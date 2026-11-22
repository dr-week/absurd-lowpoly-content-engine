"""FastAPI backend for the Absurd Low-Poly Content Engine (UI-ready REST API)."""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from absurd_engine import __version__
from absurd_engine.config import EngineSettings
from absurd_engine.exporter import export_episode
from absurd_engine.generators import (
    generate_episode,
    generate_ideas,
    generate_storyboard,
    generate_video_script,
    render_storyboard_prompt,
    render_video_prompt,
)
from absurd_engine.llm import LLMProviderError, create_provider
from absurd_engine.mechanics import MECHANICS_CATALOG, pick_mechanic
from absurd_engine.playbook import BOOK_FRAMEWORKS, DIRECTORS_STACKS, VISUAL_STYLE_PROFILES
from absurd_engine.schemas import (
    BatchGenerateRequest,
    EpisodeBundle,
    EpisodeGenerateRequest,
    EpisodeSummary,
    IdeaRequest,
    LintReport,
    PremiseIdea,
    StoryboardResult,
    StoryboardSpec,
    TrendItem,
    VideoResult,
    VideoScriptSpec,
)
from absurd_engine.storage import EpisodeStore
from absurd_engine.trends import fetch_india_trends
from absurd_engine.validator import lint_episode


class VideoFromIdeaRequest(BaseModel):
    idea: PremiseIdea
    storyboard: StoryboardSpec | None = None


class EpisodeExportResponse(BaseModel):
    episode: EpisodeBundle
    exported_to: str | None = None


class BatchExportResponse(BaseModel):
    count: int
    episodes: list[EpisodeExportResponse]


class LintEpisodeRequest(BaseModel):
    idea: PremiseIdea
    storyboard: StoryboardResult
    video: VideoResult


def create_app(settings: EngineSettings | None = None) -> FastAPI:
    cfg = settings or EngineSettings()
    provider = create_provider(cfg)
    store = EpisodeStore(cfg.db_path)

    app = FastAPI(
        title="Absurd Low-Poly Content Engine API",
        version=__version__,
        description=(
            "Text-only backend script & prompt engine for multi-style viral comedy "
            "storyboards (3x2) and deadpan Hindi/Hinglish short videos."
        ),
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://dr-week.github.io", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def health() -> dict[str, Any]:
        return {
            "status": "ok",
            "version": __version__,
            "provider": cfg.llm_provider,
            "model": cfg.llm_model,
            "default_mode": cfg.default_pipeline_mode,
        }

    @app.get("/mechanics")
    async def list_mechanics() -> list[dict[str, str]]:
        return [
            {"key": m.key, "name": m.name, "rule": m.rule, "visual_cue": m.visual_cue}
            for m in MECHANICS_CATALOG
        ]

    @app.get("/styles")
    async def list_styles() -> list[dict[str, Any]]:
        return [
            {"key": p.key, "label": p.label, "required_tokens": list(p.required_tokens)}
            for p in VISUAL_STYLE_PROFILES.values()
        ]

    @app.get("/creative-matrix")
    async def get_creative_matrix() -> dict[str, Any]:
        return {
            "books": list(BOOK_FRAMEWORKS),
            "directors_stacks": list(DIRECTORS_STACKS),
            "visual_styles_count": len(VISUAL_STYLE_PROFILES),
        }

    @app.get("/trends", response_model=list[TrendItem])
    async def api_trends(limit: int = 8) -> list[TrendItem]:
        return await fetch_india_trends(limit=max(1, min(20, limit)))

    @app.post("/ideas/generate", response_model=list[PremiseIdea])
    async def api_generate_ideas(req: IdeaRequest) -> list[PremiseIdea]:
        try:
            return await generate_ideas(provider, req)
        except LLMProviderError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    @app.post("/storyboards/generate", response_model=StoryboardResult)
    async def api_generate_storyboard(idea: PremiseIdea) -> StoryboardResult:
        try:
            return await generate_storyboard(provider, idea)
        except LLMProviderError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    @app.post("/storyboards/render")
    async def api_render_storyboard(spec: StoryboardSpec) -> dict[str, str]:
        return {"rendered_prompt": render_storyboard_prompt(spec)}

    @app.post("/videos/generate", response_model=VideoResult)
    async def api_generate_video(req: VideoFromIdeaRequest) -> VideoResult:
        try:
            return await generate_video_script(provider, req.idea, storyboard=req.storyboard)
        except LLMProviderError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    @app.post("/videos/render")
    async def api_render_video(spec: VideoScriptSpec) -> dict[str, str]:
        return {"rendered_prompt": render_video_prompt(spec)}

    @app.post("/episodes/generate", response_model=EpisodeExportResponse)
    async def api_generate_episode(req: EpisodeGenerateRequest) -> EpisodeExportResponse:
        recent_titles = store.recent_titles(limit=15)
        recent_mechs = store.recent_mechanics(limit=4)
        chosen_mech = pick_mechanic(req.mechanic, exclude_keys=recent_mechs).key
        try:
            bundle = await generate_episode(
                provider,
                idea_request=IdeaRequest(
                    seed_topic=req.seed_topic,
                    setting_hint=req.setting_hint,
                    news_hook=req.news_hook,
                    mechanic=chosen_mech,
                    avoid_titles=recent_titles,
                    count=1,
                ),
                mode=req.mode,
                auto_repair=req.auto_repair,
                visual_style=req.visual_style,
            )
        except LLMProviderError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

        if req.save_to_db:
            store.save(bundle)

        exported_path: str | None = None
        if req.export:
            exported_path = str(export_episode(bundle, cfg.output_dir))

        return EpisodeExportResponse(episode=bundle, exported_to=exported_path)

    @app.post("/episodes/batch", response_model=BatchExportResponse)
    async def api_batch_episodes(req: BatchGenerateRequest) -> BatchExportResponse:
        trends = await fetch_india_trends(limit=req.count) if req.from_trends else []
        results: list[EpisodeExportResponse] = []
        used_titles = store.recent_titles(limit=20)
        used_mechs = store.recent_mechanics(limit=4)

        for i in range(req.count):
            mech = pick_mechanic(exclude_keys=used_mechs, index=i).key
            used_mechs.append(mech)
            seed = req.seed_topics[i] if i < len(req.seed_topics) else None
            hook = trends[i].title if i < len(trends) else None
            try:
                bundle = await generate_episode(
                    provider,
                    idea_request=IdeaRequest(
                        seed_topic=seed,
                        news_hook=hook,
                        mechanic=mech,
                        avoid_titles=used_titles,
                        count=1,
                    ),
                    mode=req.mode,
                    auto_repair=req.auto_repair,
                    visual_style=req.visual_style,
                )
            except LLMProviderError as exc:
                raise HTTPException(status_code=502, detail=str(exc)) from exc

            used_titles.append(bundle.idea.title)
            if req.save_to_db:
                store.save(bundle)
            exported = str(export_episode(bundle, cfg.output_dir)) if req.export else None
            results.append(EpisodeExportResponse(episode=bundle, exported_to=exported))

        return BatchExportResponse(count=len(results), episodes=results)

    @app.get("/episodes", response_model=list[EpisodeSummary])
    async def api_list_episodes(limit: int = 20) -> list[EpisodeSummary]:
        return store.list_recent(limit=max(1, min(100, limit)))

    @app.get("/episodes/{episode_id}", response_model=EpisodeBundle)
    async def api_get_episode(episode_id: str) -> EpisodeBundle:
        found = store.get(episode_id)
        if found is None:
            raise HTTPException(status_code=404, detail=f"Episode '{episode_id}' not found.")
        return found

    @app.post("/lint", response_model=LintReport)
    async def api_lint_episode(req: LintEpisodeRequest) -> LintReport:
        return lint_episode(req.idea, req.storyboard, req.video)

    return app


app = create_app()
