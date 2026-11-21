"""Phase 1: Live India RSS Trend & Offbeat News Ingestor (zero API keys required)."""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from dataclasses import dataclass

import httpx

from absurd_engine.schemas import TrendItem


@dataclass(frozen=True)
class RSSFeedSource:
    name: str
    url: str


DEFAULT_INDIA_FEEDS: tuple[RSSFeedSource, ...] = (
    RSSFeedSource(
        name="Google News India",
        url="https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
    ),
    RSSFeedSource(
        name="Indian Express Trending",
        url="https://indianexpress.com/section/trending/feed/",
    ),
    RSSFeedSource(
        name="NDTV Offbeat",
        url="https://feeds.feedburner.com/ndtvnews-offbeat",
    ),
)

_FALLBACK_TRENDS: tuple[TrendItem, ...] = (
    TrendItem(
        title="Delhi traffic cops get fan-powered filter masks as AQI surges",
        source="Fallback India Trends",
        published="",
        url="",
    ),
    TrendItem(
        title="Indian internet turns 'before GTA 6' into daily meme war",
        source="Fallback India Trends",
        published="",
        url="",
    ),
    TrendItem(
        title="Iconic Bollywood mansion listed on Airbnb sparks middle-class coupon jokes",
        source="Fallback India Trends",
        published="",
        url="",
    ),
    TrendItem(
        title="Viral India vs China high-speed train clip divides commuters online",
        source="Fallback India Trends",
        published="",
        url="",
    ),
    TrendItem(
        title="Bengaluru commuter reaches airport faster by walking than cab in rain",
        source="Fallback India Trends",
        published="",
        url="",
    ),
)

_SOURCE_SUFFIX_RE = re.compile(r"\s+-\s+[^-]{2,45}$")


def clean_headline(raw_title: str) -> str:
    """Strip trailing publisher suffixes (e.g. ' - Hindustan Times') and normalize whitespace."""
    title = re.sub(r"\s+", " ", raw_title).strip()
    title = _SOURCE_SUFFIX_RE.sub("", title).strip()
    return title


def parse_rss_xml(xml_text: str, source_name: str, limit: int = 10) -> list[TrendItem]:
    """Parse standard RSS 2.0 / Atom XML into TrendItem records."""
    items: list[TrendItem] = []
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return items

    for node in root.findall(".//item"):
        title_el = node.find("title")
        if title_el is None or not title_el.text:
            continue
        cleaned = clean_headline(title_el.text)
        if len(cleaned) < 12:
            continue
        link_el = node.find("link")
        pub_el = node.find("pubDate")
        items.append(
            TrendItem(
                title=cleaned,
                source=source_name,
                published=(pub_el.text or "").strip() if pub_el is not None else "",
                url=(link_el.text or "").strip() if link_el is not None else "",
            )
        )
        if len(items) >= limit:
            break

    return items


async def fetch_india_trends(
    limit: int = 8,
    feeds: tuple[RSSFeedSource, ...] = DEFAULT_INDIA_FEEDS,
    timeout: float = 8.0,
    allow_fallback: bool = True,
) -> list[TrendItem]:
    """Fetch and deduplicate fresh India news/trending hooks from RSS feeds."""
    collected: list[TrendItem] = []
    seen_keys: set[str] = set()

    try:
        async with httpx.AsyncClient(
            timeout=timeout,
            follow_redirects=True,
            headers={"User-Agent": "absurd-lowpoly-content-engine/0.2"},
        ) as client:
            for feed in feeds:
                try:
                    resp = await client.get(feed.url)
                    if resp.status_code >= 400:
                        continue
                    parsed = parse_rss_xml(resp.text, source_name=feed.name, limit=limit)
                    for item in parsed:
                        key = re.sub(r"[^a-z0-9]+", "", item.title.lower())[:48]
                        if key and key not in seen_keys:
                            seen_keys.add(key)
                            collected.append(item)
                except (httpx.HTTPError, httpx.InvalidURL):
                    continue
    except (httpx.HTTPError, httpx.InvalidURL, ValueError):
        pass

    if not collected and allow_fallback:
        return list(_FALLBACK_TRENDS[:limit])

    return collected[:limit]
