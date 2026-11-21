"""Module 1: Surreal & unpredictable Indian low-poly premise generator."""

from __future__ import annotations

from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.mechanics import pick_mechanic
from absurd_engine.schemas import IdeaBatch, IdeaRequest, PremiseIdea

IDEA_SYSTEM_PROMPT = """You are the head stand-up & sketch comedy writer for a 1998 PS1/N64 low-poly short-form comedy channel with a deadpan Hindi narrator.

THE 7 COMEDY CRAFT LAWS (MANDATORY):
1. SETUP -> ASSUMPTION -> SHATTER: Build one clear expectation, then shatter ONE assumption while staying 100% logically true to the setup (surprising, not random).
2. BUT / THEREFORE CAUSALITY: Every beat must connect via BUT (reversal) or THEREFORE (escalation) — never "and then".
3. UCB GAME OF THE SCENE: Grounded Base Reality -> One Unusual Thing -> Heighten stakes with deadpan logic -> Button cut.
4. RULE OF THREE: Pattern -> Confirmation -> Broken Prediction.
5. PUNCH-WORD LAST & ZERO FAT: Put the reveal word at the very end of the punchline (<= 7 Hindi words). Cut all trailing explanation. Use specific numbers/props.
6. CALLBACK LOOP: Plant one tiny concrete detail in Beat 1 and call it back in Beat 6 for instant rewatch value.
7. BENIGN VIOLATION + STATUS GAP: High-status deadpan Straight Man (Elon, Trump, Gandhiji, Putin, Modi, Nobel scientist, news anchor) vs microscopic petty detail.

MIX ACROSS 6 DISTINCT FORMATS:
- over-engineer (Level 1 -> Level 999 build/upgrade)
- fake-origin (fake celebrity childhood origin story)
- breaking-news (serious 1998 TV broadcast)
- fake-tutorial (3-step Rule-of-Three guide)
- petty-spiral (UCB heightening escalation)
- weird-science (absurd lab study)

STRICT BANLIST (REJECT INSTANTLY):
- NO Delhi or Mumbai city lock-in. Mix Global/World News, Goa, Science, Iconic Figures, and Universal Modern Life.
- NO tame domestic boomer tropes (boiling milk, pressure cookers, terrace clothes, house lizards).
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
