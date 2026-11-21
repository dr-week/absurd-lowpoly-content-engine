"""Fetch live India Google Trends + News RSS and write web/public/live_trends.json."""

from __future__ import annotations

import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from absurd_engine.trends import RSSFeedSource, fetch_india_trends

FEEDS: tuple[RSSFeedSource, ...] = (
    RSSFeedSource("Google Trends India", "https://trends.google.com/trending/rss?geo=IN"),
    RSSFeedSource("Google News India", "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en"),
    RSSFeedSource("Indian Express Trending", "https://indianexpress.com/section/trending/feed/"),
    RSSFeedSource("NDTV Offbeat", "https://feeds.feedburner.com/ndtvnews-offbeat"),
)

_STOPWORDS = {
    "india", "indian", "news", "today", "video", "viral", "watch", "after", "before",
    "with", "from", "that", "this", "over", "into", "about", "what", "when", "where",
    "live", "updates", "says", "amid", "gets", "makes", "takes", "shows", "here",
}


def extract_keywords(titles: list[str], limit: int = 30) -> list[str]:
    counts: dict[str, int] = {}
    for title in titles:
        for word in re.findall(r"[A-Za-z][A-Za-z0-9'-]{3,}", title):
            key = word.lower()
            if key in _STOPWORDS:
                continue
            counts[key] = counts.get(key, 0) + 1
    ranked = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
    return [k for k, _ in ranked[:limit]]


async def main() -> None:
    items = await fetch_india_trends(limit=24, feeds=FEEDS, timeout=10.0, allow_fallback=True)
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
    print(f"Wrote {len(items)} live trends & {len(payload['keywords'])} keywords -> {out}")


if __name__ == "__main__":
    asyncio.run(main())
