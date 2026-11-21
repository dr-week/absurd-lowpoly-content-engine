"""Module 2: 6-frame 3x2 Storyboard spec generator and canonical prompt renderer."""

from __future__ import annotations

from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.playbook import STORYBOARD_GLOBAL_HEADER, STORYBOARD_SLOTS
from absurd_engine.schemas import PremiseIdea, StoryboardResult, StoryboardSpec

STORYBOARD_SYSTEM_PROMPT = """You are a 1998 PS1/N64 low-poly storyboard director.
Expand the given surreal Indian comedy premise into an exact 6-frame 3x2 storyboard specification.

EFFICIENCY & ANTI-REPETITION RULE:
- The global header ALREADY enforces the 1998 PS1/N64 low-poly style, pixelated textures, Gouraud shading, jagged edges, and negative constraints for all 6 panels.
- Do NOT repeat phrases like "Raw 1998 PS1 low-poly 3D screenshot", "blocky", "low-poly", "pixelated", or "muddy" in every frame. Focus each frame purely on camera framing, concrete Indian setting/props, pose, and the visual gag.

6-FRAME ARC:
- Frame 1 (Top Left): Setup scene & character in the mundane Indian setting.
- Frame 2 (Top Center): Action / escalation.
- Frame 3 (Top Right): Close-up revealing the weird shift / broken-logic detail.
- Frame 4 (Bottom Left): Consequence in the surrounding environment.
- Frame 5 (Bottom Center): Deadpan build-up right before the twist.
- Frame 6 (Bottom Right): Surprising, deadpan absurd visual payoff.

CAPTIONS:
- Each frame MUST have a short, punchy Hinglish caption (3 to 9 words) suitable for retro pixel font underneath the panel.
"""


def render_storyboard_prompt(spec: StoryboardSpec) -> str:
    """Render a StoryboardSpec into the concise, token-efficient 3x2 Playbook prompt."""
    lines = [STORYBOARD_GLOBAL_HEADER.format(title=spec.title), ""]

    for slot, frame in zip(STORYBOARD_SLOTS, spec.frames, strict=True):
        framing = frame.camera_framing.strip().rstrip(".")
        visual = frame.visual_description.strip().rstrip(".")
        caption = frame.hinglish_caption.strip().strip('"')
        lines.append(f"Frame {slot.index} ({slot.position}): {framing}. {visual}.")
        lines.append(f'Caption: "{caption}"')
        lines.append("")

    return "\n".join(lines).strip()


def build_storyboard_user_prompt(idea: PremiseIdea) -> str:
    return (
        "Build a 6-frame 3x2 PS1/N64 storyboard spec for this premise:\n"
        f"- Title: {idea.title}\n"
        f"- Mundane Anchor: {idea.mundane_anchor}\n"
        f"- Broken Logic Pivot: {idea.broken_logic_pivot}\n"
        f"- Deadpan Payoff: {idea.deadpan_payoff}\n"
        f"- Protagonist: {idea.protagonist}\n"
        f"- Key Props: {', '.join(idea.key_props)}\n\n"
        "Use exact frame positions: Top Left, Top Center, Top Right, Bottom Left, Bottom Center, Bottom Right."
    )


async def generate_storyboard(
    provider: BaseLLMProvider,
    idea: PremiseIdea,
) -> StoryboardResult:
    """Generate a structured 6-frame storyboard and its rendered copy-paste prompt."""
    spec = await provider.generate_structured(
        system_prompt=STORYBOARD_SYSTEM_PROMPT,
        user_prompt=build_storyboard_user_prompt(idea),
        response_model=StoryboardSpec,
    )
    return StoryboardResult(
        spec=spec,
        rendered_prompt=render_storyboard_prompt(spec),
    )
