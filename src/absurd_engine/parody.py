"""Phonetic lookalike parody sanitizer, parallel-dimension rules, and forbidden-token strippers."""

from __future__ import annotations

import re

PARODY_NAME_MAP: tuple[tuple[str, str], ...] = (
    (r"\bElon\s+Musk\b", "Elone Maask"),
    (r"\bDonald\s+Trump\b", "Doland Trumpe"),
    (r"\bNarendra\s+Modi\b", "Mudi-Ji"),
    (r"\bMahatma\s+Gandhi\b", "Bapu-Wa"),
    (r"\bVladimir\s+Putin\b", "Puteen-Bhai"),
    (r"\bSpider[- ]?Man\b", "Spooder-Maan"),
    (r"\bIron\s+Man\b", "Loha-Babu"),
    (r"\bSuperman\b", "Sooper-Babu"),
    (r"\bBatman\b", "Baatmaan"),
    (r"\bHulk\b", "Hulke"),
    (r"\bThor\b", "Thoorwa"),
    (r"\bSalman\s+Khan\b", "Salmaan Bhoi"),
    (r"\bVirat\s+Kohli\b", "Koohli"),
    (r"\bMukesh\s+Ambani\b", "Ambaani-Seth"),
    (r"\bPuneet\s+Superstar\b", "Lorde Puneete"),
    (r"\bDolly\s+Chaiwala\b", "Dolli Chai"),
    (r"\bGreat\s+Khali\b", "Khaali"),
    (r"\bGTA\s*6\b", "GTA-Sixe"),
    (r"\bElon\b", "Elone"),
    (r"\bTrump\b", "Trumpe"),
    (r"\bModi\b", "Mudi-Ji"),
    (r"\bGandhi\b", "Bapu-Wa"),
    (r"\bPutin\b", "Puteen-Bhai"),
)

_COMPILED_PARODY: tuple[tuple[re.Pattern[str], str], ...] = tuple(
    (re.compile(pattern, re.IGNORECASE), replacement) for pattern, replacement in PARODY_NAME_MAP
)

EXACT_PROPER_NAME_RE = re.compile(
    r"\b(?:Elon\s+Musk|Donald\s+Trump|Narendra\s+Modi|Mahatma\s+Gandhi|Vladimir\s+Putin|"
    r"Spider[- ]?Man|Iron\s+Man|Superman|Batman|Hulk|Thor|Salman\s+Khan|Virat\s+Kohli|"
    r"Mukesh\s+Ambani|Puneet\s+Superstar|Dolly\s+Chaiwala|Great\s+Khali|GTA\s*6|"
    r"Elon|Trump|Modi|Gandhi|Putin)\b",
    re.IGNORECASE,
)

EMOJI_RE = re.compile(r"[\U0001F300-\U0001FAFF\u2600-\u27BF]")

VIDEO_FORBIDDEN_RE = re.compile(
    r"(?:\b9:16\b|\b16:9\b|\b20[- ]?seconds?\b|\[\d:\d{2}\s*[–-]\s*\d:\d{2}\]|\b0:\d{2}\s*[–-]\s*0:\d{2}\b)",
    re.IGNORECASE,
)


def sanitize_parody_text(text: str) -> str:
    """Replace exact proper names with phonetic lookalike parodies and strip emojis."""
    out = EMOJI_RE.sub("", text)
    for regex, replacement in _COMPILED_PARODY:
        out = regex.sub(replacement, out)
    return re.sub(r" {2,}", " ", out).strip()


def strip_video_forbidden(text: str) -> str:
    """Strip forbidden video time/aspect-ratio mentions and emojis without damaging newlines."""
    lines = []
    for line in text.splitlines():
        cleaned = VIDEO_FORBIDDEN_RE.sub("", line)
        cleaned = EMOJI_RE.sub("", cleaned)
        cleaned = re.sub(r" {2,}", " ", cleaned).strip()
        lines.append(cleaned)
    return "\n".join(lines).strip()


def find_exact_proper_name_leaks(text: str) -> list[str]:
    """Return deduplicated exact proper names found in text."""
    return sorted({m.group(0) for m in EXACT_PROPER_NAME_RE.finditer(text)})


def has_emoji(text: str) -> bool:
    """Return True if text contains any Unicode emoji."""
    return bool(EMOJI_RE.search(text))
