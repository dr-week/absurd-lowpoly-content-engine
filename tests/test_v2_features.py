"""Tests for v2 features: RSS trends, mechanics catalog, fused + auto-repair pipeline, SQLite store, batch API, and token benchmark."""

from __future__ import annotations

from pathlib import Path
from typing import TypeVar

import pytest
from fastapi.testclient import TestClient
from pydantic import BaseModel

from absurd_engine.api import create_app
from absurd_engine.benchmark import run_token_benchmark
from absurd_engine.config import EngineSettings
from absurd_engine.generators import generate_episode
from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.llm.mock import _MOCK_SCENARIOS
from absurd_engine.mechanics import MECHANICS_CATALOG, pick_mechanic
from absurd_engine.schemas import FusedEpisodeDraft, IdeaRequest
from absurd_engine.storage import EpisodeStore
from absurd_engine.trends import clean_headline, parse_rss_xml

T = TypeVar("T", bound=BaseModel)


class _NeedsRepairProvider(BaseLLMProvider):
    """Returns a draft with a 14-word Hindi line on call 1, then fixes it on repair call 2."""

    provider_name = "test-repair"

    def __init__(self) -> None:
        super().__init__(model="test-repair-v1", max_retries=0)
        self.calls = 0

    async def _complete_json(self, system_prompt: str, user_prompt: str) -> str:
        return "{}"

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: type[T],
    ) -> T:
        self.calls += 1
        scenario = _MOCK_SCENARIOS[0]
        draft = FusedEpisodeDraft(
            idea=scenario["idea"],
            storyboard=scenario["storyboard"],
            video=scenario["video"],
        )
        if self.calls == 1:
            # Inject overly long Hindi dialogue on Shot 1 to force lint < 95
            shots = list(draft.video.shots)
            shots[0] = shots[0].model_copy(
                update={
                    "hindi_dialogue": "रमेश ने आज सुबह बहुत लंबी बात कही जो तीन सेकंड में बिल्कुल फिट नहीं होगी।"
                }
            )
            draft = draft.model_copy(
                update={"video": draft.video.model_copy(update={"shots": shots})}
            )
        return response_model.model_validate(draft.model_dump())


def test_rss_xml_parsing_and_headline_cleaning() -> None:
    assert clean_headline("Delhi AQI hits 400 again - Hindustan Times") == "Delhi AQI hits 400 again"

    sample_xml = """<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0"><channel>
      <item>
        <title>Delhi traffic cops get fan-powered masks - Indian Express</title>
        <link>https://example.com/1</link>
        <pubDate>Sat, 21 Nov 2026 06:00:00 GMT</pubDate>
      </item>
      <item>
        <title>Short</title>
        <link>https://example.com/2</link>
      </item>
    </channel></rss>
    """
    items = parse_rss_xml(sample_xml, source_name="Test RSS", limit=5)
    assert len(items) == 1
    assert items[0].title == "Delhi traffic cops get fan-powered masks"
    assert items[0].source == "Test RSS"


def test_mechanic_rotation_avoids_recent() -> None:
    first = pick_mechanic(exclude_keys=["draw_distance_fog", "console_downgrade"])
    assert first.key not in {"draw_distance_fog", "console_downgrade"}
    assert len(MECHANICS_CATALOG) >= 8


@pytest.mark.asyncio
async def test_fused_pipeline_single_call_and_auto_repair_loop() -> None:
    provider = _NeedsRepairProvider()
    bundle = await generate_episode(
        provider,
        idea_request=IdeaRequest(seed_topic="chai tapri QR code"),
        mode="fused",
        auto_repair=True,
    )
    assert provider.calls == 2  # 1 fused call + 1 targeted auto-repair call
    assert bundle.mode == "fused"
    assert bundle.repaired is True
    assert bundle.lint.passed is True
    assert bundle.lint.score == 100


def test_sqlite_episode_store_and_batch_api(tmp_path: Path) -> None:
    db_file = tmp_path / "episodes.db"
    settings = EngineSettings(LLM_PROVIDER="mock", OUTPUT_DIR=tmp_path / "out", DB_PATH=db_file)
    client = TestClient(create_app(settings))

    # Mechanics endpoint
    mechs = client.get("/mechanics")
    assert mechs.status_code == 200
    assert len(mechs.json()) >= 8

    # Batch generate 3 episodes using offline fallback trends (no network required)
    batch_resp = client.post(
        "/episodes/batch",
        json={"count": 3, "from_trends": False, "mode": "fused", "save_to_db": True, "export": True},
    )
    assert batch_resp.status_code == 200
    data = batch_resp.json()
    assert data["count"] == 3
    assert all(ep["episode"]["mode"] == "fused" for ep in data["episodes"])
    assert all(ep["episode"]["lint"]["score"] == 100 for ep in data["episodes"])

    # SQLite history & single lookup
    hist = client.get("/episodes")
    assert hist.status_code == 200
    assert len(hist.json()) == 3

    first_id = hist.json()[0]["episode_id"]
    detail = client.get(f"/episodes/{first_id}")
    assert detail.status_code == 200
    assert detail.json()["episode_id"] == first_id

    # Direct store helper check
    store = EpisodeStore(db_file)
    assert len(store.recent_titles()) == 3


def test_token_benchmark_shows_positive_savings() -> None:
    playbook = Path("PLAYBOOK.md").read_text(encoding="utf-8")
    res = run_token_benchmark(playbook)
    assert res.storyboard_prompt_saved_pct > 25.0
    assert res.fused_vs_v1_modular_saved_pct > 30.0
    assert res.engine_vs_manual_1_saved_pct > 40.0
    assert res.engine_vs_manual_10_saved_pct > 40.0
