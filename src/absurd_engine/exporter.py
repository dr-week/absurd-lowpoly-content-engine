"""Export EpisodeBundle artifacts to disk (JSON, copy-paste TXT prompts, and Markdown)."""

from __future__ import annotations

import re
from pathlib import Path

from absurd_engine.schemas import EpisodeBundle


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return slug[:50] or "episode"


def export_episode(bundle: EpisodeBundle, output_root: Path) -> Path:
    """Write episode.json, storyboard_prompt.txt, video_prompt.txt, and episode.md."""
    folder_name = f"{bundle.episode_id}_{_slugify(bundle.idea.title)}"
    target_dir = output_root / folder_name
    target_dir.mkdir(parents=True, exist_ok=True)

    (target_dir / "episode.json").write_text(
        bundle.model_dump_json(indent=2),
        encoding="utf-8",
    )
    (target_dir / "storyboard_prompt.txt").write_text(
        bundle.storyboard.rendered_prompt + "\n",
        encoding="utf-8",
    )
    (target_dir / "video_prompt.txt").write_text(
        bundle.video.rendered_prompt + "\n",
        encoding="utf-8",
    )

    issues_md = (
        "\n".join(f"- **[{i.severity.upper()}]** `{i.code}`: {i.message}" for i in bundle.lint.issues)
        if bundle.lint.issues
        else "- None (Playbook clean!)"
    )

    markdown = f"""# {bundle.idea.title}

- **Episode ID:** `{bundle.episode_id}`
- **Provider / Model:** `{bundle.provider}` / `{bundle.model}`
- **Playbook Lint:** `{"PASS" if bundle.lint.passed else "FAIL"}` (Score: {bundle.lint.score}/100)

## Premise
- **Mundane Anchor:** {bundle.idea.mundane_anchor}
- **Broken Logic Pivot:** {bundle.idea.broken_logic_pivot}
- **Deadpan Payoff:** {bundle.idea.deadpan_payoff}
- **Protagonist:** {bundle.idea.protagonist}
- **Key Props:** {", ".join(bundle.idea.key_props)}

## Storyboard Prompt (6-Frame 3x2 Grid)

```text
{bundle.storyboard.rendered_prompt}
```

## Video Prompt (20s, 9:16 Vertical)

```text
{bundle.video.rendered_prompt}
```

## Lint Notes
{issues_md}
"""
    (target_dir / "episode.md").write_text(markdown, encoding="utf-8")
    return target_dir
