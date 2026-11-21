"""Optimize Taste DNA profile from exported .jsonl logs or Studio Backup .json files."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def optimize_from_file(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8").strip()
    angles: dict[str, int] = {}
    worlds: dict[str, int] = {}
    viral_wins = 0

    if path.suffix.lower() == ".jsonl":
        for line in raw.splitlines():
            if not line.strip():
                continue
            row = json.loads(line)
            delta = 2 if row.get("vote") == "up" else -2
            angles[row.get("angle", "unknown")] = angles.get(row.get("angle", "unknown"), 0) + delta
            worlds[row.get("brand", "Global")] = worlds.get(row.get("brand", "Global"), 0) + delta
    else:
        data = json.loads(raw)
        for row in data.get("logs", []):
            delta = 2 if row.get("vote") == "up" else -2
            angles[row.get("angle", "unknown")] = angles.get(row.get("angle", "unknown"), 0) + delta
            worlds[row.get("brand", "Global")] = worlds.get(row.get("brand", "Global"), 0) + delta
        for item in data.get("saved", []):
            topic = item.get("topic", {})
            outcome = item.get("outcome")
            weight = 10 if outcome == "viral" else 4 if outcome == "good" else -6 if outcome == "flop" else 3
            if outcome == "viral":
                viral_wins += 1
            angles[topic.get("angle", "unknown")] = angles.get(topic.get("angle", "unknown"), 0) + weight
            worlds[topic.get("brand", "Global")] = worlds.get(topic.get("brand", "Global"), 0) + weight

    top_angles = [k for k, v in sorted(angles.items(), key=lambda kv: -kv[1]) if v > 0][:4]
    top_worlds = [k for k, v in sorted(worlds.items(), key=lambda kv: -kv[1]) if v > 0][:5]
    avoid_worlds = [k for k, v in sorted(worlds.items(), key=lambda kv: kv[1]) if v < 0][:4]
    return {
        "viral_wins": viral_wins,
        "winning_angles": top_angles,
        "winning_worlds": top_worlds,
        "avoid_worlds": avoid_worlds,
        "prompt_directive": (
            f"Prioritize formats: {', '.join(top_angles) or 'all 6'}. "
            f"Winning worlds: {', '.join(top_worlds) or 'Global/Goa/Science/Iconic'}. "
            f"Avoid: {', '.join(avoid_worlds) or 'Delhi/Mumbai'}."
        ),
    }


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: uv run python scripts/optimize_from_logs.py <absurd-logs.jsonl | absurd-studio-backup.json>")
        raise SystemExit(1)
    profile = optimize_from_file(Path(sys.argv[1]))
    out = Path("web/public/taste_profile.json")
    out.write_text(json.dumps(profile, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Updated {out}:\n{json.dumps(profile, indent=2)}")


if __name__ == "__main__":
    main()
