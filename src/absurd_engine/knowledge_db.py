"""SQLite FTS5 + JSON1 Structured Dictionary & Fast Knowledge-Base Engine."""

from __future__ import annotations

import json
import re
import sqlite3
from pathlib import Path
from typing import Any

from absurd_engine.playbook import BOOK_FRAMEWORKS, DIRECTORS_STACKS, VISUAL_STYLE_PROFILES

MARKETING_AND_STORY_BOOKS: tuple[dict[str, str], ...] = (
    *BOOK_FRAMEWORKS,
    {"id": "hook-point", "title": "Hook Point", "author": "Brendan Kane", "craft": "3-Second Pattern Interrupt"},
    {"id": "storybrand", "title": "Building a StoryBrand", "author": "Donald Miller", "craft": "Customer-as-Hero + Product-as-Guide"},
    {"id": "breakthrough-adv", "title": "Breakthrough Advertising", "author": "Eugene Schwartz", "craft": "5 Stages of Market Awareness"},
    {"id": "influence", "title": "Influence", "author": "Robert Cialdini", "craft": "Social Proof, Scarcity & Authority"},
    {"id": "purple-cow", "title": "Purple Cow", "author": "Seth Godin", "craft": "Remarkable Visual Differentiation"},
    {"id": "dialogue-mckee", "title": "Dialogue", "author": "Robert McKee", "craft": "Verbal Action & Hidden Subtext"},
    {"id": "impro-johnstone", "title": "Impro", "author": "Keith Johnstone", "craft": "Status Seesaw & Blocking"},
    {"id": "anatomy-story", "title": "The Anatomy of Story", "author": "John Truby", "craft": "Desire vs Opponent 7-Step Spine"},
)


class KnowledgeBaseDB:
    """Fast dictionary-like SQLite FTS5 + JSON1 database with O(1) ID lookup and BM25 search."""

    def __init__(self, db_path: str | Path = ":memory:") -> None:
        self._conn = sqlite3.connect(str(db_path), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._init_schema()
        self._seed_defaults()

    def _init_schema(self) -> None:
        self._conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS kb_records (
                id TEXT PRIMARY KEY,
                kind TEXT NOT NULL,
                title TEXT NOT NULL,
                tags TEXT NOT NULL,
                summary TEXT NOT NULL,
                payload_json TEXT NOT NULL
            );
            CREATE VIRTUAL TABLE IF NOT EXISTS kb_fts USING fts5(
                id UNINDEXED,
                kind UNINDEXED,
                title,
                tags,
                summary,
                tokenize='porter unicode61'
            );
            """
        )
        self._conn.commit()

    def upsert(self, rec_id: str, kind: str, title: str, tags: str, summary: str, payload: dict[str, Any]) -> None:
        self._conn.execute(
            "INSERT OR REPLACE INTO kb_records (id, kind, title, tags, summary, payload_json) VALUES (?, ?, ?, ?, ?, ?)",
            (rec_id, kind, title, tags, summary, json.dumps(payload, ensure_ascii=False)),
        )
        self._conn.execute("DELETE FROM kb_fts WHERE id = ?", (rec_id,))
        self._conn.execute(
            "INSERT INTO kb_fts (id, kind, title, tags, summary) VALUES (?, ?, ?, ?, ?)",
            (rec_id, kind, title, tags, summary),
        )
        self._conn.commit()

    def _seed_defaults(self) -> None:
        for b in MARKETING_AND_STORY_BOOKS:
            self.upsert(f"book:{b['id']}", "book", f"{b['title']} ({b['author']})", f"book craft {b['author']}", b["craft"], b)
        for s in DIRECTORS_STACKS:
            self.upsert(f"stack:{s['id']}", "stack", s["label"], f"film lens edit {s['book']}", f"{s['lens']} | {s['edit']}", s)
        for p in VISUAL_STYLE_PROFILES.values():
            self.upsert(
                f"style:{p.key}",
                "style",
                p.label,
                f"style visual {' '.join(p.required_tokens)}",
                p.storyboard_header,
                {"key": p.key, "label": p.label, "required_tokens": list(p.required_tokens)},
            )

    def get(self, rec_id: str) -> dict[str, Any] | None:
        row = self._conn.execute("SELECT * FROM kb_records WHERE id = ?", (rec_id,)).fetchone()
        if not row:
            return None
        return {
            "id": row["id"],
            "kind": row["kind"],
            "title": row["title"],
            "summary": row["summary"],
            "payload": json.loads(row["payload_json"]),
        }

    def search(self, query: str, kind: str | None = None, limit: int = 12) -> list[dict[str, Any]]:
        tokens = [t for t in re.findall(r"[a-zA-Z0-9]+", query.strip()) if len(t) >= 2]
        if not tokens:
            sql = "SELECT * FROM kb_records" + (" WHERE kind = ?" if kind else "") + " LIMIT ?"
            params: list[Any] = ([kind] if kind else []) + [limit]
            rows = self._conn.execute(sql, params).fetchall()
        else:
            fts_expr = " OR ".join(f"{t}*" for t in tokens)
            sql = (
                "SELECT r.* FROM kb_fts f JOIN kb_records r ON f.id = r.id "
                "WHERE kb_fts MATCH ?" + (" AND r.kind = ?" if kind else "") + " ORDER BY bm25(kb_fts) LIMIT ?"
            )
            params = [fts_expr] + ([kind] if kind else []) + [limit]
            rows = self._conn.execute(sql, params).fetchall()
        return [
            {"id": r["id"], "kind": r["kind"], "title": r["title"], "summary": r["summary"], "payload": json.loads(r["payload_json"])}
            for r in rows
        ]
