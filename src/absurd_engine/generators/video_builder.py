"""Module 3: 20-second 9:16 vertical Video Prompt generator and canonical renderer."""

from __future__ import annotations

from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.playbook import VIDEO_BEATS, VIDEO_GLOBAL_HEADER
from absurd_engine.schemas import (
    PremiseIdea,
    StoryboardSpec,
    VideoResult,
    VideoScriptSpec,
)

VIDEO_SYSTEM_PROMPT = """You are a director of 20-second, 9:16 vertical 1998 PS1/N64 ultra low-poly absurdist Hindi comedy videos.

STRICT VISUAL & AUDIO STYLE:
- Raw 1998 PS1/N64 low-poly 3D graphics, angular faceted meshes, blurry pixelated bitmap textures, stiff robotic animations with jerky low-FPS movement, crude vertex/Gouraud shading, jagged aliased edges, muddy retro colors.
- NO smooth modern CGI, NO 2D cartoon art, NO comic ink outlines.
- Audio: deadpan, serious Indian male narrator speaking ULTRA-SHORT Hindi lines (Devanagari script preferred), paired with specific retro 1998 PS1 sound effects and sharp hard cuts.

EXACT 6-SHOT TIMING WINDOWS (MUST MATCH EXACTLY):
- Shot 1: "0:00–0:03" (3s) -> Setup scene + jerky action. Max 7 words Hindi dialogue.
- Shot 2: "0:03–0:07" (4s) -> Hard cut to escalation + action. Max 9 words Hindi dialogue.
- Shot 3: "0:07–0:10" (3s) -> Close-up / weird shift + action. Max 7 words Hindi dialogue.
- Shot 4: "0:10–0:14" (4s) -> Hard cut to environmental consequence. Max 9 words Hindi dialogue.
- Shot 5: "0:14–0:17" (3s) -> Hard cut to deadpan build-up beat. Max 7 words Hindi dialogue.
- Shot 6: "0:17–0:20" (3s) -> Sudden whip-pan/snap-in to absurd payoff, SFX ends with bass drop/hit and instant hard cut to black. Max 7 words Hindi dialogue.

PACING RULE:
- Keep every Hindi dialogue line ultra-short and punchy so a serious deadpan narrator can deliver it comfortably inside 3–4 seconds.
"""


def render_video_prompt(spec: VideoScriptSpec) -> str:
    """Render a VideoScriptSpec into the exact copy-paste 20s 9:16 Playbook prompt."""
    lines = [VIDEO_GLOBAL_HEADER, ""]

    for beat, shot in zip(VIDEO_BEATS, spec.shots, strict=True):
        transition = (shot.transition or beat.default_transition).strip()
        action = shot.visual_action.strip().rstrip(".")
        if transition:
            # Lowercase leading letter of action if it follows a transition phrase like "Hard cut to"
            if action and action[0].isupper() and not action.startswith(("PS1", "N64", "UPI", "QR")):
                action = action[0].lower() + action[1:]
            shot_body = f"{transition} {action}."
        else:
            shot_body = f"{action}."

        sfx = shot.retro_sfx.strip().rstrip(".")
        if beat.shot_number == 6 and "hard cut to black" not in sfx.lower():
            sfx = f"{sfx}, instant hard cut to black"

        dialogue = shot.hindi_dialogue.strip().strip('"')
        lines.append(f"[{beat.label}] Shot {beat.shot_number}: {shot_body} SFX: {sfx}.")
        lines.append(f'Hindi Dialogue: "{dialogue}"')
        lines.append("")

    return "\n".join(lines).strip()


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
        "\nRemember: keep every Hindi dialogue line ultra-short (<= 7 words for 3s shots, <= 9 words for 4s shots)."
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
