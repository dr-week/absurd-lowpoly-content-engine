"""End-to-end episode generation pipeline: Fused (1-call) or Modular (3-call) + Auto-Repair Lint Loop."""

from __future__ import annotations

from typing import Literal

from absurd_engine.generators.idea_generator import generate_ideas
from absurd_engine.generators.storyboard_builder import (
    generate_storyboard,
    render_storyboard_prompt,
)
from absurd_engine.generators.video_builder import (
    generate_video_script,
    render_video_prompt,
)
from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.mechanics import pick_mechanic
from absurd_engine.schemas import (
    EpisodeBundle,
    FusedEpisodeDraft,
    IdeaRequest,
    LintReport,
    PremiseIdea,
    StoryboardResult,
    VideoResult,
)
from absurd_engine.validator import lint_episode

FUSED_SYSTEM_PROMPT = """You are the showrunner for a 1998 PS1/N64 ultra low-poly absurdist Indian comedy channel.

THE "ZEPTO VIRAL BENCHMARK" (MANDATORY STANDARD FOR ALL STORIES):
Every story MUST match the high-octane absurdity of this benchmark:
"Ordering a ₹14 Maggi at 3 AM causes a delivery scooter to smash through a 9th-floor glass balcony at 80 km/h, landing on the bed covered in motor oil, only to deadpan ask: 'OTP batao bhaiya, rating 5 de dena.'"

MANDATORY RULES:
1. HYPER-MODERN URBAN HOOK: Quick-commerce, ride-hailing cancellations, UPI soundboxes, gym diets, EMI loans, metro crowding. NO domestic boomer tropes (no boiling milk, no pressure cooker dal, no terrace blankets, no society uncles).
2. TRIVIAL CAUSE -> CATASTROPHIC DESTRUCTION: A tiny consumer trigger causes violent, catastrophic 3D property destruction (crashing through walls, roads splitting, vehicles launched through buildings).
3. PETTY TRANSACTIONAL PAYOFF: Surrounded by total wreckage, the character only cares about a tiny detail (OTP, 5-star rating, ₹2 change, dry chutney).

In ONE single structured JSON response, create:
1. `idea`: A high-voltage PremiseIdea matching the Zepto standard.
2. `storyboard`: An exact 6-frame 3x2 grid spec (Top Left, Top Center, Top Right, Bottom Left, Bottom Center, Bottom Right) with short Hinglish captions (<= 9 words each).
3. `video`: An exact 6-shot 20-second 9:16 video spec:
   - Shot 1 "0:00–0:03" (<= 7 words Hindi)
   - Shot 2 "0:03–0:07" (<= 9 words Hindi)
   - Shot 3 "0:07–0:10" (<= 7 words Hindi)
   - Shot 4 "0:10–0:14" (<= 9 words Hindi)
   - Shot 5 "0:14–0:17" (<= 7 words Hindi)
   - Shot 6 "0:17–0:20" (<= 7 words Hindi, SFX ends with instant hard cut to black)

EFFICIENCY & ANTI-REPETITION RULE:
- NEVER repeat "1998 PS1", "low-poly", "pixelated", or "Gouraud" inside individual frames or shots.
- Do NOT put "Hard cut to" inside visual_action; use the `transition` field only.
"""

REPAIR_SYSTEM_PROMPT = """You are a strict Playbook editor for 1998 PS1/N64 absurdist Indian comedy scripts.
Fix ONLY the reported lint issues in the provided FusedEpisodeDraft JSON while preserving the comedic premise and visual continuity:
- Trim any Hindi dialogue exceeding its shot word limit (<= 7 words for 3s shots, <= 9 words for 4s shots).
- Remove repeated global PS1 style words ("1998 PS1", "low-poly", "pixelated", "Gouraud") from individual frames/shots.
- Replace any cliché "jugaad" or talking-object phrasing with pure broken-physics absurdity.
- Ensure exact frame positions and shot timing windows ("0:00–0:03" through "0:17–0:20").
"""


def _build_fused_user_prompt(request: IdeaRequest) -> str:
    mechanic = pick_mechanic(request.mechanic)
    lines = [
        "Generate one complete FusedEpisodeDraft (idea + 6-frame storyboard + 6-shot 20s video script).",
        f"MECHANIC ({mechanic.key} — {mechanic.name}): {mechanic.rule}",
        f"VISUAL CUE: {mechanic.visual_cue}",
    ]
    if request.seed_topic:
        lines.append(f"SEED TOPIC: {request.seed_topic}")
    if request.setting_hint:
        lines.append(f"INDIAN SETTING: {request.setting_hint}")
    if request.news_hook:
        lines.append(f"NEWS / TRENDING HOOK: {request.news_hook}")
    if request.avoid_titles:
        lines.append(f"DO NOT REPEAT THESE TITLES: {', '.join(request.avoid_titles[:15])}")
    return "\n".join(lines)


def _render_bundle(
    provider: BaseLLMProvider,
    draft: FusedEpisodeDraft,
    mode: Literal["fused", "modular"],
    repaired: bool = False,
) -> EpisodeBundle:
    sb_res = StoryboardResult(
        spec=draft.storyboard,
        rendered_prompt=render_storyboard_prompt(draft.storyboard),
    )
    vid_res = VideoResult(
        spec=draft.video,
        rendered_prompt=render_video_prompt(draft.video),
    )
    lint = lint_episode(draft.idea, sb_res, vid_res)
    return EpisodeBundle(
        provider=provider.provider_name,
        model=provider.model,
        mode=mode,
        repaired=repaired,
        idea=draft.idea,
        storyboard=sb_res,
        video=vid_res,
        lint=lint,
    )


async def _repair_draft(
    provider: BaseLLMProvider,
    draft: FusedEpisodeDraft,
    lint: LintReport,
) -> FusedEpisodeDraft:
    issue_lines = "\n".join(
        f"- [{i.severity.upper()}] {i.code} ({i.location}): {i.message}"
        for i in lint.issues
    )
    user_prompt = (
        f"Fix these Playbook lint issues (current score: {lint.score}/100):\n"
        f"{issue_lines}\n\n"
        f"CURRENT DRAFT JSON:\n{draft.model_dump_json()}"
    )
    return await provider.generate_structured(
        system_prompt=REPAIR_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_model=FusedEpisodeDraft,
    )


async def generate_episode(
    provider: BaseLLMProvider,
    idea_request: IdeaRequest | None = None,
    idea: PremiseIdea | None = None,
    mode: Literal["fused", "modular"] = "fused",
    auto_repair: bool = True,
) -> EpisodeBundle:
    """Run the full prompt-generation pipeline (1-call fused or 3-call modular) with optional auto-repair."""
    req = idea_request or IdeaRequest(count=1)

    if mode == "fused" and idea is None:
        draft = await provider.generate_structured(
            system_prompt=FUSED_SYSTEM_PROMPT,
            user_prompt=_build_fused_user_prompt(req),
            response_model=FusedEpisodeDraft,
        )
        effective_mode: Literal["fused", "modular"] = "fused"
    else:
        chosen_idea = idea
        if chosen_idea is None:
            ideas = await generate_ideas(provider, req.model_copy(update={"count": 1}))
            chosen_idea = ideas[0]
        storyboard = await generate_storyboard(provider, chosen_idea)
        video = await generate_video_script(provider, chosen_idea, storyboard=storyboard.spec)
        draft = FusedEpisodeDraft(
            idea=chosen_idea,
            storyboard=storyboard.spec,
            video=video.spec,
        )
        effective_mode = "modular"

    bundle = _render_bundle(provider, draft, mode=effective_mode, repaired=False)

    if auto_repair and (not bundle.lint.passed or bundle.lint.score < 95):
        repaired_draft = await _repair_draft(provider, draft, bundle.lint)
        repaired_bundle = _render_bundle(provider, repaired_draft, mode=effective_mode, repaired=True)
        # Keep the repaired version only if it improved or maintained score
        if repaired_bundle.lint.score >= bundle.lint.score:
            bundle = repaired_bundle

    return bundle
