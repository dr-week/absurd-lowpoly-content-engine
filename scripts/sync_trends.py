"""Fetch live World News, Science Studies, Politics, Tech, and Goa RSS into web/public/live_trends.json."""

from __future__ import annotations

import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from absurd_engine.trends import RSSFeedSource, fetch_india_trends

FEEDS: tuple[RSSFeedSource, ...] = (
    RSSFeedSource("BBC World News", "https://feeds.bbci.co.uk/news/world/rss.xml"),
    RSSFeedSource("ScienceDaily Top Science", "https://www.sciencedaily.com/rss/top/science.xml"),
    RSSFeedSource("Google News World", "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en&gl=US&ceid=US:en"),
    RSSFeedSource("Google News Science", "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en&gl=US&ceid=US:en"),
    RSSFeedSource("Goa News", "https://news.google.com/rss/search?q=Goa&hl=en-IN&gl=IN&ceid=IN:en"),
    RSSFeedSource("Hacker News Tech", "https://hnrss.org/frontpage"),
)

_STOPWORDS = {
    "news", "today", "video", "viral", "watch", "after", "before", "with", "from",
    "that", "this", "over", "into", "about", "what", "when", "where", "live",
    "updates", "says", "amid", "gets", "makes", "takes", "shows", "here", "study",
    "have", "were", "been", "years", "year", "another", "away", "across", "calls",
    "being", "their", "there", "would", "could", "should", "will", "more", "most",
    "some", "than", "then", "them", "they", "your", "just", "first", "last",
    "biggest", "new", "city", "cities", "deal", "leader", "apparent", "aftermath",
    "accuses", "announces", "claims", "warns", "urges", "seeks", "faces", "plans",
    "didn't", "don't", "won't", "can't", "close", "dependent", "control",
}

_SENSITIVE_FILTER = {
    "assassinate", "assassination", "killed", "killing", "murder", "dead", "death",
    "sentenced", "arrested", "strikes", "strike", "attack", "bomb", "war", "prison",
    "beating", "besieged", "shooting", "terror", "suicide", "abuse", "rape",
    "cremated", "convicted", "criminal", "detained", "conning", "deadlock",
}


def extract_keywords(titles: list[str], limit: int = 35) -> list[str]:
    counts: dict[str, int] = {}
    for title in titles:
        for word in re.findall(r"[A-Za-z][A-Za-z0-9'-]{3,}", title):
            key = word.lower().strip("'-")
            if len(key) < 4 or key in _STOPWORDS or key in _SENSITIVE_FILTER:
                continue
            counts[key] = counts.get(key, 0) + 1
    ranked = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
    return [k for k, _ in ranked[:limit]]


async def main() -> None:
    items = await fetch_india_trends(limit=30, feeds=FEEDS, timeout=10.0, allow_fallback=True)
    titles = [i.title for i in items]
    payload = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "count": len(items),
        "keywords": extract_keywords(titles),
        "trends": [i.model_dump() for i in items],
    }
    out = Path("web/public/live_trends.json")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(items)} global/science/Goa trends & {len(payload['keywords'])} keywords -> {out}")


if __name__ == "__main__":
    asyncio.run(main())
