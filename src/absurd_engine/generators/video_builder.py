"""Module 3: 20-second 9:16 vertical Video Prompt generator and canonical renderer."""

from __future__ import annotations

import re

from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.parody import sanitize_parody_text, strip_video_forbidden
from absurd_engine.playbook import VIDEO_BEATS, VISUAL_STYLE_PROFILES
from absurd_engine.schemas import (
    PremiseIdea,
    StoryboardSpec,
    VideoResult,
    VideoScriptSpec,
)

VIDEO_SYSTEM_PROMPT = """You are a director of 20-second, 9:16 vertical 1998 PS1/N64 ultra low-poly absurdist Hindi comedy videos.

EFFICIENCY & ANTI-REPETITION RULE:
- The global header ALREADY locks the 1998 PS1/N64 low-poly 3D style, pixelated textures, Gouraud shading, jagged edges, jerky low-FPS animation, negative constraints, and deadpan Hindi narrator for all 6 shots.
- Do NOT repeat "1998 PS1", "low-poly", "pixelated", "blocky", or "muddy" in every shot. Focus each shot purely on camera framing, concrete Indian setting/props, jerky movement/visual gag, specific retro SFX, and ultra-short Hindi dialogue.
- Do NOT include transition prefixes like "Hard cut to" inside visual_action; put them only in the transition field.

EXACT 6-SHOT TIMING WINDOWS (MUST MATCH EXACTLY):
- Shot 1: "0:00–0:03" (3s) -> Setup scene + jerky action. Max 7 words Hindi dialogue.
- Shot 2: "0:03–0:07" (4s) -> Hard cut to escalation + action. Max 9 words Hindi dialogue.
- Shot 3: "0:07–0:10" (3s) -> Close-up / weird shift + action. Max 7 words Hindi dialogue.
- Shot 4: "0:10–0:14" (4s) -> Hard cut to environmental consequence. Max 9 words Hindi dialogue.
- Shot 5: "0:14–0:17" (3s) -> Hard cut to deadpan build-up beat. Max 7 words Hindi dialogue.
- Shot 6: "0:17–0:20" (3s) -> Sudden whip-pan/snap-in to absurd payoff, SFX ends with bass drop/hit and instant hard cut to black. Max 7 words Hindi dialogue.

PACING RULE:
- Keep every Hindi dialogue line ultra-short and punchy (Devanagari preferred) so a deadpan Indian male narrator delivers it comfortably inside 3–4 seconds.
"""

_COMMON_CAMERA_STARTERS = (
    "Wide ",
    "Medium ",
    "Close-up ",
    "Extreme ",
    "Low-angle ",
    "High-angle ",
    "Side ",
    "Static ",
    "Tracking ",
    "Upward ",
    "Interior ",
    "Absurd ",
    "Deadpan ",
    "The ",
    "A ",
)


def _merge_transition_and_action(transition: str, action: str) -> str:
    """Safely combine transition and visual_action without duplicate prefixes or broken proper nouns."""
    clean_action = action.strip().rstrip(".")
    clean_transition = transition.strip().rstrip(":")

    if not clean_transition:
        return f"{clean_action}."

    # Prevent duplicate transition text if the model already started visual_action with it
    if clean_action.lower().startswith(clean_transition.lower()):
        return f"{clean_action}."

    # Strip any redundant "Hard cut to " when another transition is already set
    clean_action = re.sub(r"^(?:hard cut to|sudden whip-pan to|snap-zoom to)\s+", "", clean_action, flags=re.IGNORECASE)

    # Only lowercase known generic framing/article starters; preserve proper nouns like "Ramesh", "Amit", "SBI"
    if clean_action.startswith(_COMMON_CAMERA_STARTERS):
        clean_action = clean_action[0].lower() + clean_action[1:]

    return f"{clean_transition} {clean_action}."


def render_video_prompt(spec: VideoScriptSpec) -> str:
    """Render a VideoScriptSpec into a clean video prompt with NO time, duration, or size mentions."""
    profile = VISUAL_STYLE_PROFILES.get(spec.visual_style, VISUAL_STYLE_PROFILES["ps1-1998"])
    lines = [profile.video_header, ""]

    for beat, shot in zip(VIDEO_BEATS, spec.shots, strict=True):
        transition = (shot.transition or beat.default_transition).strip()
        shot_body = sanitize_parody_text(_merge_transition_and_action(transition, shot.visual_action))

        sfx = sanitize_parody_text(shot.retro_sfx.strip().rstrip("."))
        if beat.shot_number == 6 and "hard cut to black" not in sfx.lower():
            sfx = f"{sfx}, instant hard cut to black"

        dialogue = sanitize_parody_text(shot.hindi_dialogue.strip().strip('"'))
        lines.append(f"Shot {beat.shot_number}: {shot_body} SFX: {sfx}.")
        lines.append(f'Hindi Dialogue: "{dialogue}"')
        lines.append("")

    return strip_video_forbidden("\n".join(lines).strip())


def build_video_user_prompt(
    idea: PremiseIdea,
    storyboard: StoryboardSpec | None = None,
) -> str:
    parts = [
        "Build a 20-second, 9:16 vertical PS1/N64 video script spec for this premise:",
        f"- Title: {idea.title}",
        f"- Mundane Anchor: {idea.mundane_anchor}",
        f"- Broken Logic Pivot: {idea.broken_logic_pivot}",
        f"- Deadpan Payoff: {idea.deadpan_payoff}",
        f"- Protagonist: {idea.protagonist}",
        f"- Key Props: {', '.join(idea.key_props)}",
    ]
    if storyboard:
        parts.append("\nAlign the 6 shots tightly with this 6-frame storyboard for visual continuity:")
        for frame in storyboard.frames:
            parts.append(
                f"  Frame {frame.frame_number} ({frame.position}): {frame.visual_description} "
                f'[Caption: "{frame.hinglish_caption}"]'
            )
    parts.append(
        "\nRemember: keep every Hindi dialogue line ultra-short (<= 7 words for 3s shots, <= 9 words for 4s shots) "
        "and avoid repeating global PS1 style adjectives in every shot."
    )
    return "\n".join(parts)


async def generate_video_script(
    provider: BaseLLMProvider,
    idea: PremiseIdea,
    storyboard: StoryboardSpec | None = None,
) -> VideoResult:
    """Generate a structured 20s 9:16 video script and its rendered copy-paste prompt."""
    spec = await provider.generate_structured(
        system_prompt=VIDEO_SYSTEM_PROMPT,
        user_prompt=build_video_user_prompt(idea, storyboard),
        response_model=VideoScriptSpec,
    )
    return VideoResult(
        spec=spec,
        rendered_prompt=render_video_prompt(spec),
    )
