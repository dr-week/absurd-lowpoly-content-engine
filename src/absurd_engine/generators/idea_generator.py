"""Module 1: Surreal & unpredictable Indian low-poly premise generator."""

from __future__ import annotations

from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.mechanics import pick_mechanic
from absurd_engine.schemas import IdeaBatch, IdeaRequest, PremiseIdea

IDEA_SYSTEM_PROMPT = """You are the lead viral comedy writer for a 1998 PS1/N64 low-poly short-form comedy channel.

THE "ZEPTO VIRAL BENCHMARK" (MANDATORY STANDARD):
Every idea MUST match the high-octane absurdity of the benchmark:
"Ordering a ₹14 Maggi at 3 AM on Zepto causes a delivery scooter to smash through a 9th-floor glass balcony at 80 km/h, landing on the bed while covered in motor oil, only to ask: 'OTP batao bhaiya, rating 5 de dena.'"

THE 4 MANDATORY PILLARS:
1. HYPER-MODERN URBAN HOOK: Quick-commerce (Zepto/Blinkit/Instamart), Ola/Uber cancellations, gym protein obsession, UPI payment soundbox addiction, iPhone EMI desperation, co-working space wars.
2. TRIVIAL CAUSE -> CATASTROPHIC DESTRUCTION: A tiny mundane trigger causes sudden, violent, catastrophic property destruction in raw 3D PS1 physics (scooters flying through glass, metro cars plowing through walls, roads tearing apart).
3. HIGH-SPEED AGGRESSION: No slow build-ups, no quiet domestic scenes. The shock hits fast and hard.
4. PETTY TRANSACTIONAL PAYOFF: Surrounded by total destruction, the character is deadpan and only cares about an ultra-trivial Indian transaction (OTP, 5-star rating, ₹2 cash change, spilled chutney).

STRICT BANLIST (REJECT INSTANTLY):
- NO tame domestic boomer tropes: NO boiling milk, NO pressure cookers, NO drying clothes on terrace, NO TV remotes, NO society uncle maintenance jokes, NO house lizards.
- NO cute or gentle comedy. If there is no violent physical disruption or extreme shock value, do not output it.
- NO video game meta logic (no health bars, no respawns, no NPCs).
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
