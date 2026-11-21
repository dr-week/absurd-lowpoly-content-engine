"""Token efficiency benchmark: compares manual prompting, v1 modular, and v2 fused engine."""

from __future__ import annotations

import json
import math
from dataclasses import dataclass

from absurd_engine.generators.idea_generator import IDEA_SYSTEM_PROMPT, build_idea_user_prompt
from absurd_engine.generators.pipeline import FUSED_SYSTEM_PROMPT, _build_fused_user_prompt
from absurd_engine.generators.storyboard_builder import (
    STORYBOARD_SYSTEM_PROMPT,
    build_storyboard_user_prompt,
    render_storyboard_prompt,
)
from absurd_engine.generators.video_builder import (
    VIDEO_SYSTEM_PROMPT,
    build_video_user_prompt,
    render_video_prompt,
)
from absurd_engine.llm.mock import _MOCK_SCENARIOS
from absurd_engine.schemas import (
    FusedEpisodeDraft,
    IdeaBatch,
    IdeaRequest,
    StoryboardSpec,
    VideoScriptSpec,
)


def estimate_tokens(text: str) -> int:
    """Estimate LLM tokens (~4 chars/token for English/JSON, ~2.5 chars/token for Devanagari)."""
    devanagari = sum(1 for ch in text if "\u0900" <= ch <= "\u097F")
    other = len(text) - devanagari
    return math.ceil((other / 4.0) + (devanagari / 2.2))


@dataclass(frozen=True)
class BenchmarkComparison:
    old_verbose_storyboard_tokens: int
    new_optimized_storyboard_tokens: int
    storyboard_prompt_saved_pct: float

    modular_v1_pretty_tokens: int
    modular_v2_compact_tokens: int
    fused_v2_tokens: int
    fused_vs_v1_modular_saved_pct: float

    manual_chat_1_episode_tokens: int
    engine_fused_1_episode_tokens: int
    engine_vs_manual_1_saved_pct: float

    manual_chat_10_episodes_tokens: int
    engine_fused_10_episodes_tokens: int
    engine_vs_manual_10_saved_pct: float


def _pct_saved(baseline: int, optimized: int) -> float:
    if baseline <= 0:
        return 0.0
    return round(((baseline - optimized) / baseline) * 100.0, 1)


def run_token_benchmark(playbook_text: str) -> BenchmarkComparison:
    """Compute concrete token metrics across prompt rendering, modular vs fused, and manual vs engine."""
    scenario = _MOCK_SCENARIOS[0]
    idea = scenario["idea"]
    sb_spec = scenario["storyboard"]
    vid_spec = scenario["video"]
    req = IdeaRequest(seed_topic="chai tapri QR code", mechanic="gravity_debit", count=1)

    # 1. Storyboard prompt text: old verbose (repeated prefix + style adjectives) vs optimized v2
    old_header = (
        "Create a storyboard of six frames in a 3x2 grid layout on a plain dark background, "
        "rendered strictly in authentic 1998 PlayStation 1 (PS1) and Nintendo 64 (N64) ultra "
        "low-poly 3D video game graphics. Every panel must look like raw, unpolished late-90s "
        "3D game screenshots: extremely angular faceted polygon meshes with visible sharp edges, "
        "blurry pixelated low-resolution bitmap textures stretched over blocky geometry, stiff "
        "awkward character poses, crude vertex/Gouraud shading, jagged aliased edges, and muddy "
        "retro colors. Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading, and "
        "NO smooth modern CGI. Place a short, bold retro pixel-font Hinglish caption underneath "
        f'each panel. Title at top: "{sb_spec.title}".'
    )
    old_frames = "\n\n".join(
        f"Frame {f.frame_number} ({f.position}): Raw 1998 PS1 low-poly 3D screenshot. "
        f"{f.camera_framing}. Blocky low-poly 1998 PS1 pixelated {f.visual_description.lower()}\n"
        f'Caption: "{f.hinglish_caption}"'
        for f in sb_spec.frames
    )
    old_verbose_sb = f"{old_header}\n\n{old_frames}"
    new_optimized_sb = render_storyboard_prompt(sb_spec)

    old_sb_tok = estimate_tokens(old_verbose_sb)
    new_sb_tok = estimate_tokens(new_optimized_sb)

    # 2. LLM API call tokens: v1 Modular (3 calls, indent=2 schemas) vs v2 Modular (compact) vs v2 Fused (1 call)
    idea_out = IdeaBatch(ideas=[idea]).model_dump_json()
    sb_out = sb_spec.model_dump_json()
    vid_out = vid_spec.model_dump_json()
    fused_out = FusedEpisodeDraft(idea=idea, storyboard=sb_spec, video=vid_spec).model_dump_json()

    # v1 Modular (pretty-printed JSON schemas, 3 calls)
    v1_mod_in = (
        IDEA_SYSTEM_PROMPT
        + json.dumps(IdeaBatch.model_json_schema(), indent=2)
        + build_idea_user_prompt(req)
        + STORYBOARD_SYSTEM_PROMPT
        + json.dumps(StoryboardSpec.model_json_schema(), indent=2)
        + build_storyboard_user_prompt(idea)
        + VIDEO_SYSTEM_PROMPT
        + json.dumps(VideoScriptSpec.model_json_schema(), indent=2)
        + build_video_user_prompt(idea, sb_spec)
    )
    v1_mod_total = estimate_tokens(v1_mod_in) + estimate_tokens(idea_out + sb_out + vid_out)

    # v2 Modular (compact JSON schemas, 3 calls)
    v2_mod_in = (
        IDEA_SYSTEM_PROMPT
        + json.dumps(IdeaBatch.model_json_schema(), separators=(",", ":"))
        + build_idea_user_prompt(req)
        + STORYBOARD_SYSTEM_PROMPT
        + json.dumps(StoryboardSpec.model_json_schema(), separators=(",", ":"))
        + build_storyboard_user_prompt(idea)
        + VIDEO_SYSTEM_PROMPT
        + json.dumps(VideoScriptSpec.model_json_schema(), separators=(",", ":"))
        + build_video_user_prompt(idea, sb_spec)
    )
    v2_mod_total = estimate_tokens(v2_mod_in) + estimate_tokens(idea_out + sb_out + vid_out)

    # v2 Fused (1 call, compact schema; templates rendered deterministically in Python = 0 LLM tokens!)
    v2_fused_in = (
        FUSED_SYSTEM_PROMPT
        + json.dumps(FusedEpisodeDraft.model_json_schema(), separators=(",", ":"))
        + _build_fused_user_prompt(req)
    )
    v2_fused_total = estimate_tokens(v2_fused_in) + estimate_tokens(fused_out)

    # 3. Manual chat workflow vs Engine Fused workflow
    # Manual workflow: user pastes PLAYBOOK.md + asks for idea/storyboard/video; LLM outputs full prose
    # (global headers + 6 storyboard frames + 6 video shots + commentary), AND in multi-turn chats the
    # prior turns get re-sent in context on every follow-up (e.g. "now make another one").
    rendered_vid = render_video_prompt(vid_spec)
    manual_single_in = playbook_text + "\nCreate a 3x2 storyboard prompt and 20s video prompt with Hindi script for chai tapri QR code."
    manual_single_out = old_verbose_sb + "\n\n" + rendered_vid + "\n\nHere is your copy-paste storyboard and video prompt!"
    # Typically takes 1 initial generation + 1 refinement turn ("make it shorter / less repetitive") in manual chat
    manual_turn1_in = estimate_tokens(manual_single_in)
    manual_turn1_out = estimate_tokens(manual_single_out)
    manual_turn2_in = manual_turn1_in + manual_turn1_out + 25  # full chat history re-sent on refinement!
    manual_turn2_out = estimate_tokens(new_optimized_sb + "\n\n" + rendered_vid)
    manual_1_ep = manual_turn1_in + manual_turn1_out + manual_turn2_in + manual_turn2_out

    # Over a 10-episode manual chat session (accumulating history in 1 chat or pasting playbook 10x with 1 tweak each):
    # Even assuming a fresh chat per episode (best case for manual), 10x manual_1_ep;
    # In engine fused mode, each episode is stateless 1-call fused (with ~15-title blocklist = +45 tokens).
    manual_10_ep = manual_1_ep * 10
    engine_10_ep = v2_fused_total * 10 + (45 * 9)

    return BenchmarkComparison(
        old_verbose_storyboard_tokens=old_sb_tok,
        new_optimized_storyboard_tokens=new_sb_tok,
        storyboard_prompt_saved_pct=_pct_saved(old_sb_tok, new_sb_tok),
        modular_v1_pretty_tokens=v1_mod_total,
        modular_v2_compact_tokens=v2_mod_total,
        fused_v2_tokens=v2_fused_total,
        fused_vs_v1_modular_saved_pct=_pct_saved(v1_mod_total, v2_fused_total),
        manual_chat_1_episode_tokens=manual_1_ep,
        engine_fused_1_episode_tokens=v2_fused_total,
        engine_vs_manual_1_saved_pct=_pct_saved(manual_1_ep, v2_fused_total),
        manual_chat_10_episodes_tokens=manual_10_ep,
        engine_fused_10_episodes_tokens=engine_10_ep,
        engine_vs_manual_10_saved_pct=_pct_saved(manual_10_ep, engine_10_ep),
    )
