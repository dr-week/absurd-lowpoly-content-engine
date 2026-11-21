"""Module 1: Surreal & unpredictable Indian low-poly premise generator."""

from __future__ import annotations

from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.mechanics import pick_mechanic
from absurd_engine.schemas import IdeaBatch, IdeaRequest, PremiseIdea

IDEA_SYSTEM_PROMPT = """You are the head writer for an absurdist 1998 PS1/N64 low-poly 3D comedy channel set in India.

STRICT IDEA FORMULA:
1. Anchor the premise in a MUNDANE Indian moment, everyday setting (chai tapri, Delhi Metro, SBI lunch break, ration queue, auto stand, coaching class, society lift, local train), OR a recent news/trending hook.
2. Pivot abruptly into BROKEN LOGIC, strange cause-and-effect, or disorienting physical/video-game-glitch absurdity.
3. Keep the payoff VISUAL, DEADPAN, and UNEXPECTED. Everyone reacts stiffly and matter-of-factly.

STRICTLY AVOID CLICHÉS:
- NO neat "jugaad" or "life hack" setups.
- NO predictable talking-object jokes (talking phone, talking fridge, talking fan, etc.).
- NO preachy morals or sitcom punchlines.

EFFICIENCY RULE:
- Keep protagonist and key_props concrete and concise without repeating global PS1 style words.
"""


def build_idea_user_prompt(request: IdeaRequest) -> str:
    mechanic = pick_mechanic(request.mechanic)
    lines = [
        f"COUNT: {request.count}",
        f"Generate {request.count} distinct surreal, deadpan Indian PS1 comedy premise(s).",
        f"TARGET MECHANIC ({mechanic.key} — {mechanic.name}): {mechanic.rule}",
        f"VISUAL CUE: {mechanic.visual_cue}",
    ]
    if request.seed_topic:
        lines.append(f"SEED TOPIC: {request.seed_topic}")
    if request.setting_hint:
        lines.append(f"INDIAN SETTING: {request.setting_hint}")
    if request.news_hook:
        lines.append(f"NEWS / TRENDING HOOK TO TWIST: {request.news_hook}")
    if request.avoid_titles:
        lines.append(f"DO NOT REPEAT THESE PAST TITLES: {', '.join(request.avoid_titles[:15])}")
    lines.append("Return a JSON object with an 'ideas' array matching the schema.")
    return "\n".join(lines)


async def generate_ideas(
    provider: BaseLLMProvider,
    request: IdeaRequest | None = None,
) -> list[PremiseIdea]:
    """Generate one or more surreal anti-cliché premises."""
    req = request or IdeaRequest()
    batch = await provider.generate_structured(
        system_prompt=IDEA_SYSTEM_PROMPT,
        user_prompt=build_idea_user_prompt(req),
        response_model=IdeaBatch,
    )
    return batch.ideas[: req.count]
