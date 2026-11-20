"""Module 1: Surreal & unpredictable Indian low-poly premise generator."""

from __future__ import annotations

from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.schemas import IdeaBatch, IdeaRequest, PremiseIdea

IDEA_SYSTEM_PROMPT = """You are the head writer for an absurdist 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) low-poly 3D comedy channel set in India.

STRICT IDEA FORMULA:
1. Anchor the premise in a MUNDANE Indian moment, everyday setting (chai tapri, Delhi Metro, SBI lunch break, ration queue, auto stand, coaching class, society lift, local train), OR a recent news/trending hook.
2. Pivot abruptly into BROKEN LOGIC, strange cause-and-effect, or disorienting physical/video-game-glitch absurdity (e.g., physics breaking, gravity getting debited, collision turning off, objects obeying bureaucratic rules instead of nature).
3. Keep the payoff VISUAL, DEADPAN, and UNEXPECTED. Nobody reacts like a cartoon—everyone stays stiff, awkward, and matter-of-fact.

STRICTLY AVOID CLICHÉS:
- NO neat "jugaad" or "life hack" setups.
- NO predictable talking-object jokes (talking phone, talking fridge, talking fan, etc.).
- NO preachy morals or sitcom punchlines.

VISUAL DESIGN RULES:
- Protagonist and props must be easy to render as angular, boxy 1998 PS1/N64 low-poly 3D meshes with blurry pixelated textures.
"""


def build_idea_user_prompt(request: IdeaRequest) -> str:
    lines = [
        f"COUNT: {request.count}",
        f"Generate {request.count} distinct surreal, deadpan Indian PS1 low-poly comedy premise(s).",
    ]
    if request.seed_topic:
        lines.append(f"SEED TOPIC / PREMISE HINT: {request.seed_topic}")
    if request.setting_hint:
        lines.append(f"INDIAN SETTING HINT: {request.setting_hint}")
    if request.news_hook:
        lines.append(f"NEWS / TRENDING HOOK TO TWIST: {request.news_hook}")
    lines.append(
        "Return a JSON object with an 'ideas' array containing the requested number of PremiseIdea objects."
    )
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
