"""Tests for end-to-end pipeline, Playbook rendering, validation linter, and FastAPI endpoints."""

from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from absurd_engine.api import create_app
from absurd_engine.config import EngineSettings
from absurd_engine.exporter import export_episode
from absurd_engine.generators import generate_episode, generate_ideas
from absurd_engine.generators.video_builder import _merge_transition_and_action
from absurd_engine.llm.base import extract_json_payload
from absurd_engine.llm.mock import MockLLMProvider
from absurd_engine.schemas import IdeaRequest
from absurd_engine.validator import _count_words, lint_episode


@pytest.mark.asyncio
async def test_full_episode_pipeline_passes_playbook_lint(tmp_path: Path) -> None:
    provider = MockLLMProvider()
    bundle = await generate_episode(
        provider,
        idea_request=IdeaRequest(seed_topic="chai tapri QR code", count=1),
    )

    assert bundle.idea.title == "QR CODE NE GRAVITY KAAT DI"
    assert len(bundle.storyboard.spec.frames) == 6
    assert len(bundle.video.spec.shots) == 6

    # Storyboard prompt follows concise Playbook template (style declared once globally)
    sb = bundle.storyboard.rendered_prompt
    assert "3x2 grid on a plain dark background" in sb
    assert "Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading, NO smooth modern CGI." in sb
    assert 'Title at top: "QR CODE NE GRAVITY KAAT DI".' in sb
    assert "Frame 1 (Top Left): Wide static street shot." in sb
    assert "Frame 6 (Bottom Right): Absurd wide shot into grey distance fog." in sb
    assert "Raw 1998 PS1 low-poly 3D screenshot." not in sb

    # Video prompt follows concise 20s 9:16 Playbook template
    vid = bundle.video.rendered_prompt
    assert "20-second, 9:16 vertical absurdist comedy video" in vid
    assert "NO cel-shading" in vid
    assert "deadpan, serious Indian male narrator speaking ultra-short Hindi lines" in vid
    for window in ("0:00–0:03", "0:03–0:07", "0:07–0:10", "0:10–0:14", "0:14–0:17", "0:17–0:20"):
        assert f"[{window}]" in vid
    assert "instant hard cut to black" in vid.lower()

    # Playbook lint passes cleanly with 100/100
    assert bundle.lint.passed is True
    assert bundle.lint.score == 100
    assert bundle.lint.issues == []

    # Export writes all 4 expected files
    out_dir = export_episode(bundle, tmp_path)
    assert (out_dir / "episode.json").exists()
    assert (out_dir / "storyboard_prompt.txt").exists()
    assert (out_dir / "video_prompt.txt").exists()
    assert (out_dir / "episode.md").exists()


@pytest.mark.asyncio
async def test_linter_flags_cliche_long_dialogue_and_style_repetition() -> None:
    provider = MockLLMProvider()
    bundle = await generate_episode(provider, idea_request=IdeaRequest(seed_topic="SBI bank lunch"))

    bad_idea = bundle.idea.model_copy(
        update={"broken_logic_pivot": "He tries a clever jugaad with a talking phone."}
    )
    shots = list(bundle.video.spec.shots)
    shots[0] = shots[0].model_copy(
        update={
            "hindi_dialogue": "यह बहुत लंबा हिंदी संवाद है जो तीन सेकंड के शॉट में बिल्कुल फिट नहीं होगा।"
        }
    )
    # Inject style-word spam across 3 storyboard frames
    frames = list(bundle.storyboard.spec.frames)
    for i in range(3):
        frames[i] = frames[i].model_copy(
            update={"visual_description": f"Low-poly 1998 PS1 pixelated scene number {i + 1} with Gouraud shading."}
        )
    bad_sb = bundle.storyboard.model_copy(
        update={"spec": bundle.storyboard.spec.model_copy(update={"frames": frames})}
    )
    bad_video = bundle.video.model_copy(
        update={"spec": bundle.video.spec.model_copy(update={"shots": shots})}
    )

    report = lint_episode(bad_idea, bad_sb, bad_video)
    codes = {i.code for i in report.issues}
    assert "IDEA_BANNED_TAME_TROPE" in codes
    assert "VIDEO_DIALOGUE_TOO_LONG" in codes
    assert "STORYBOARD_STYLE_REPETITION" in codes
    assert report.score < 100


def test_video_transition_merging_avoids_duplicates_and_preserves_proper_nouns() -> None:
    assert _merge_transition_and_action("Hard cut to", "Hard cut to side angle") == "Hard cut to side angle."
    assert _merge_transition_and_action("Hard cut to", "Wide shot of tapri.") == "Hard cut to wide shot of tapri."
    assert _merge_transition_and_action("Hard cut to", "Ramesh bends sideways.") == "Hard cut to Ramesh bends sideways."


def test_hindi_word_count_ignores_standalone_danda() -> None:
    assert _count_words("रमेश ने चाय पी ।") == 4
    assert _count_words("रमेश ने चाय पी।") == 4


def test_extract_json_payload_handles_fences_and_trailing_braces() -> None:
    raw = 'Here is your JSON:\n```json\n{"title": "TEST"}\n```\nNote: ignore {this}.'
    assert extract_json_payload(raw) == '{"title": "TEST"}'

    un_fenced = 'Sure! {"title": "OK", "n": 1} hope that helps {extra}'
    assert extract_json_payload(un_fenced) == '{"title": "OK", "n": 1}'


@pytest.mark.asyncio
async def test_multi_idea_generation() -> None:
    provider = MockLLMProvider()
    ideas = await generate_ideas(provider, IdeaRequest(count=2))
    assert len(ideas) == 2
    assert ideas[0].title != ideas[1].title


def test_fastapi_endpoints(tmp_path: Path) -> None:
    settings = EngineSettings(LLM_PROVIDER="mock", OUTPUT_DIR=tmp_path)
    client = TestClient(create_app(settings))

    health = client.get("/health")
    assert health.status_code == 200
    assert health.json()["status"] == "ok"

    ep = client.post(
        "/episodes/generate",
        json={"seed_topic": "SBI bank lunch break", "export": True},
    )
    assert ep.status_code == 200
    payload = ep.json()
    assert payload["episode"]["idea"]["title"] == "LUNCH BREAK KA PORTAL"
    assert payload["episode"]["lint"]["passed"] is True
    assert payload["exported_to"] is not None
    assert Path(payload["exported_to"]).exists()
