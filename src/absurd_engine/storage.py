"""Phase 4: Lightweight SQLite Episode Store for history, lookup, and anti-duplicate memory."""

from __future__ import annotations

import sqlite3
from pathlib import Path

from absurd_engine.schemas import EpisodeBundle, EpisodeSummary


class EpisodeStore:
    """Persistent SQLite repository for generated episodes."""

    def __init__(self, db_path: Path) -> None:
        self.db_path = db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_schema()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_schema(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS episodes (
                    episode_id TEXT PRIMARY KEY,
                    created_at TEXT NOT NULL,
                    title TEXT NOT NULL,
                    mechanic TEXT NOT NULL,
                    provider TEXT NOT NULL,
                    model TEXT NOT NULL,
                    mode TEXT NOT NULL,
                    lint_score INTEGER NOT NULL,
                    lint_passed INTEGER NOT NULL,
                    bundle_json TEXT NOT NULL
                )
                """
            )
            conn.commit()

    def save(self, bundle: EpisodeBundle) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO episodes (
                    episode_id, created_at, title, mechanic, provider,
                    model, mode, lint_score, lint_passed, bundle_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    bundle.episode_id,
                    bundle.created_at.isoformat(),
                    bundle.idea.title,
                    bundle.idea.mechanic,
                    bundle.provider,
                    bundle.model,
                    bundle.mode,
                    bundle.lint.score,
                    1 if bundle.lint.passed else 0,
                    bundle.model_dump_json(),
                ),
            )
            conn.commit()

    def get(self, episode_id: str) -> EpisodeBundle | None:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT bundle_json FROM episodes WHERE episode_id = ?",
                (episode_id,),
            ).fetchone()
        if row is None:
            return None
        return EpisodeBundle.model_validate_json(row["bundle_json"])

    def list_recent(self, limit: int = 20) -> list[EpisodeSummary]:
        with self._connect() as conn:
            rows = conn.execute(
                """
                SELECT episode_id, created_at, title, mechanic, provider,
                       model, mode, lint_score, lint_passed
                FROM episodes
                ORDER BY created_at DESC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
        return [
            EpisodeSummary(
                episode_id=r["episode_id"],
                created_at=r["created_at"],
                title=r["title"],
                mechanic=r["mechanic"],
                provider=r["provider"],
                model=r["model"],
                mode=r["mode"],
                lint_score=r["lint_score"],
                lint_passed=bool(r["lint_passed"]),
            )
            for r in rows
        ]

    def recent_titles(self, limit: int = 20) -> list[str]:
        return [row.title for row in self.list_recent(limit=limit)]

    def recent_mechanics(self, limit: int = 6) -> list[str]:
        return [row.mechanic for row in self.list_recent(limit=limit)]
