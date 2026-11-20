"""Tests for end-to-end pipeline, Playbook rendering, validation linter, and FastAPI endpoints."""

from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from absurd_engine.api import create_app
from absurd_engine.config import EngineSettings
from absurd_engine.exporter import export_episode
from absurd_engine.generators import generate_episode, generate_ideas
from absurd_engine.llm.base import extract_json_payload
from absurd_engine.llm.mock import MockLLMProvider
from absurd_engine.schemas import IdeaRequest
from absurd_engine.validator import lint_episode


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

    # Storyboard prompt follows exact Playbook template
    sb = bundle.storyboard.rendered_prompt
    assert "3x2 grid layout on a plain dark background" in sb
    assert "Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading, and NO smooth modern CGI." in sb
    assert 'Title at top: "QR CODE NE GRAVITY KAAT DI".' in sb
    assert "Frame 1 (Top Left): Raw 1998 PS1 low-poly 3D screenshot." in sb
    assert "Frame 6 (Bottom Right): Raw 1998 PS1 low-poly 3D absurd wide/close shot." in sb

    # Video prompt follows exact 20s 9:16 Playbook template
    vid = bundle.video.rendered_prompt
    assert "20-second, 9:16 vertical absurdist comedy video" in vid
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
async def test_linter_flags_cliche_and_long_hindi_dialogue() -> None:
    provider = MockLLMProvider()
    bundle = await generate_episode(provider, idea_request=IdeaRequest(seed_topic="SBI bank lunch"))

    # Inject a predictable jugaad cliché and an overly long Hindi line for a 3s shot
    bad_idea = bundle.idea.model_copy(
        update={"broken_logic_pivot": "He tries a clever jugaad with a talking phone."}
    )
    shots = list(bundle.video.spec.shots)
    shots[0] = shots[0].model_copy(
        update={
            "hindi_dialogue": "यह बहुत लंबा हिंदी संवाद है जो तीन सेकंड के शॉट में बिल्कुल फिट नहीं होगा।"
        }
    )
    bad_video = bundle.video.model_copy(
        update={"spec": bundle.video.spec.model_copy(update={"shots": shots})}
    )

    report = lint_episode(bad_idea, bundle.storyboard, bad_video)
    codes = {i.code for i in report.issues}
    assert "IDEA_CLICHE_TROPES" in codes
    assert "VIDEO_DIALOGUE_TOO_LONG" in codes
    assert report.score < 100


@pytest.mark.asyncio
async def test_multi_idea_generation() -> None:
    provider = MockLLMProvider()
    ideas = await generate_ideas(provider, IdeaRequest(count=2))
    assert len(ideas) == 2
    assert ideas[0].title != ideas[1].title


def test_extract_json_payload_handles_fences_and_prose() -> None:
    raw = 'Here is your JSON:\n```json\n{"title": "TEST"}\n```\nDone.'
    assert extract_json_payload(raw) == '{"title": "TEST"}'


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
