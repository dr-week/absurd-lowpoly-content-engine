"""FastAPI backend for the Absurd Low-Poly Content Engine (UI-ready REST API)."""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException
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
from absurd_engine.schemas import (
    EpisodeBundle,
    EpisodeGenerateRequest,
    IdeaRequest,
    LintReport,
    PremiseIdea,
    StoryboardResult,
    StoryboardSpec,
    VideoResult,
    VideoScriptSpec,
)
from absurd_engine.validator import lint_episode


class VideoFromIdeaRequest(BaseModel):
    idea: PremiseIdea
    storyboard: StoryboardSpec | None = None


class EpisodeExportResponse(BaseModel):
    episode: EpisodeBundle
    exported_to: str | None = None


class LintEpisodeRequest(BaseModel):
    idea: PremiseIdea
    storyboard: StoryboardResult
    video: VideoResult


def create_app(settings: EngineSettings | None = None) -> FastAPI:
    cfg = settings or EngineSettings()
    app = FastAPI(
        title="Absurd Low-Poly Content Engine API",
        version=__version__,
        description=(
            "Backend script and prompt maker for 1998 PS1/N64 ultra low-poly "
            "absurdist Hindi/Hinglish storyboards (3x2) and 20s 9:16 vertical videos."
        ),
    )

    def _provider():
        return create_provider(cfg)

    @app.get("/health")
    async def health() -> dict[str, Any]:
        return {
            "status": "ok",
            "version": __version__,
            "provider": cfg.llm_provider,
            "model": cfg.llm_model,
        }

    @app.post("/ideas/generate", response_model=list[PremiseIdea])
    async def api_generate_ideas(req: IdeaRequest) -> list[PremiseIdea]:
        try:
            return await generate_ideas(_provider(), req)
        except LLMProviderError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    @app.post("/storyboards/generate", response_model=StoryboardResult)
    async def api_generate_storyboard(idea: PremiseIdea) -> StoryboardResult:
        try:
            return await generate_storyboard(_provider(), idea)
        except LLMProviderError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    @app.post("/storyboards/render")
    async def api_render_storyboard(spec: StoryboardSpec) -> dict[str, str]:
        return {"rendered_prompt": render_storyboard_prompt(spec)}

    @app.post("/videos/generate", response_model=VideoResult)
    async def api_generate_video(req: VideoFromIdeaRequest) -> VideoResult:
        try:
            return await generate_video_script(_provider(), req.idea, storyboard=req.storyboard)
        except LLMProviderError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    @app.post("/videos/render")
    async def api_render_video(spec: VideoScriptSpec) -> dict[str, str]:
        return {"rendered_prompt": render_video_prompt(spec)}

    @app.post("/episodes/generate", response_model=EpisodeExportResponse)
    async def api_generate_episode(req: EpisodeGenerateRequest) -> EpisodeExportResponse:
        try:
            bundle = await generate_episode(
                _provider(),
                idea_request=IdeaRequest(
                    seed_topic=req.seed_topic,
                    setting_hint=req.setting_hint,
                    news_hook=req.news_hook,
                    count=1,
                ),
            )
        except LLMProviderError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

        exported_path: str | None = None
        if req.export:
            exported_path = str(export_episode(bundle, cfg.output_dir))

        return EpisodeExportResponse(episode=bundle, exported_to=exported_path)

    @app.post("/lint", response_model=LintReport)
    async def api_lint_episode(req: LintEpisodeRequest) -> LintReport:
        return lint_episode(req.idea, req.storyboard, req.video)

    return app


app = create_app()
