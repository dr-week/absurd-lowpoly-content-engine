"""6-Hour Automated AI Episode Factory: pre-generates 24 fresh AI episodes into web/public/daily_episodes.json.

Activates automatically when GEMINI_API_KEY or GROQ_API_KEY is configured in GitHub Repo Secrets.
Exits cleanly with 0 if no secret is set so CI never fails.
"""

from __future__ import annotations

import json
import os
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

SYSTEM_PROMPT = (
    "You are a stand-up & sketch comedy head writer inventing 16 BRAND-NEW, dead-simple, suspenseful, expectation-subverting comedy episodes "
    "with full 6-frame storyboards and 6-shot video scripts. Crisp ENGLISH titles/pitches; ultra-short Devanagari Hindi dialogue (<=7 words, reveal word LAST). "
    "NEVER use exact proper names (use phonetic parody names like Elone Maask, Doland Trumpe, Hulke, Spooder-Maan, Sooper-Babu, Thoorwa, GTA-Sixe). "
    "NEVER mention 9:16, 20-second, timestamps, low-poly, PS1, Delhi, Mumbai, Goa, Uncle, or ANY emojis. "
    "Cover all 6 angles: over-engineer, fake-origin, breaking-news, fake-tutorial, petty-spiral, weird-science. "
    'Return ONLY valid JSON: {"episodes":[{"id":"daily_1","title":"UPPERCASE","angle":"over-engineer","brand":"Tag","trendHook":"Daily AI","pitch":"1 sentence",'
    '"frames":[{"frame":1,"position":"Top Left","framing":"...","action":"...","caption":"Hinglish"}],'
    '"shots":[{"shot":1,"visual":"...","sfx":"...","hindi":"Hindi"}]}]}'
)


def _extract_json(raw: str) -> str:
    s = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    start = s.find("{")
    end = s.rfind("}")
    return s[start : end + 1] if start != -1 and end > start else s


def _call_gemini(api_key: str, user_prompt: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    body = json.dumps({
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {"temperature": 1.0, "responseMimeType": "application/json"},
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["candidates"][0]["content"]["parts"][0]["text"]


def _call_groq(api_key: str, user_prompt: str) -> str:
    body = json.dumps({
        "model": "llama-3.3-70b-versatile",
        "temperature": 1.0,
        "response_format": {"type": "json_object"},
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_prompt}],
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"]


def main() -> None:
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    if not gemini_key and not groq_key:
        print("No GEMINI_API_KEY or GROQ_API_KEY secret set; skipping daily AI pool generation.")
        return

    trends_path = Path("web/public/live_trends.json")
    headlines: list[str] = []
    if trends_path.exists():
        trends_data = json.loads(trends_path.read_text(encoding="utf-8"))
        headlines = [t["title"] for t in trends_data.get("trends", [])[:16] if t.get("title")]

    taste_path = Path("web/public/taste_profile.json")
    taste_line = ""
    if taste_path.exists():
        taste_line = "\nUSER TASTE DIRECTIVE: " + json.loads(taste_path.read_text(encoding="utf-8")).get("prompt_directive", "")

    prompt = (
        "Twist these live world/science/tech themes (NEVER quote raw headlines, NEVER mention Goa or Uncle) into 16 completely different episodes:\n"
        + "\n".join(f"{i + 1}. {h}" for i, h in enumerate(headlines))
        + taste_line
    )
    raw = _call_gemini(gemini_key, prompt) if gemini_key else _call_groq(groq_key, prompt)
    parsed = json.loads(_extract_json(raw))
    import re
    banned = re.compile(r"\b(goa|goan|uncle|uncles|delhi|mumbai|elon|musk|trump|modi|gandhi|hulk|batman|spider-man|superman|thor)\b|[\U0001F300-\U0001FAFF\u2600-\u27BF]", re.I)
    episodes = [
        e for e in parsed.get("episodes", [])
        if e.get("title") and len(e.get("frames", [])) == 6 and len(e.get("shots", [])) == 6
        and not banned.search(f"{e.get('title', '')} {e.get('pitch', '')}")
    ]
    if not episodes:
        print("No valid episodes returned; keeping existing daily_episodes.json.")
        return

    out = Path("web/public/daily_episodes.json")
    payload = {"updated_at": datetime.now(timezone.utc).isoformat(), "count": len(episodes), "episodes": episodes}
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(episodes)} fresh AI episodes -> {out}")


if __name__ == "__main__":
    main()
