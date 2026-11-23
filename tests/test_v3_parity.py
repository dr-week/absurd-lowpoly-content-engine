"""v3 Creative Matrix & Full-Stack Parity tests for the Python FastAPI backend."""

from __future__ import annotations

from pathlib import Path

from fastapi.testclient import TestClient

from absurd_engine.api import create_app
from absurd_engine.config import EngineSettings
from absurd_engine.generators.storyboard_builder import render_storyboard_prompt
from absurd_engine.generators.video_builder import render_video_prompt
from absurd_engine.parody import (
    find_exact_proper_name_leaks,
    has_emoji,
    sanitize_parody_text,
    strip_video_forbidden,
)
from absurd_engine.playbook import BOOK_FRAMEWORKS, DIRECTORS_STACKS, VISUAL_STYLE_PROFILES
from absurd_engine.schemas import (
    PremiseIdea,
    StoryboardFrame,
    StoryboardResult,
    StoryboardSpec,
    VideoResult,
    VideoScriptSpec,
    VideoShot,
)
from absurd_engine.validator import lint_episode


def _make_client(tmp_path: Path) -> TestClient:
    cfg = EngineSettings(
        llm_provider="mock",
        db_path=tmp_path / "parity.db",
        output_dir=tmp_path / "episodes",
    )
    return TestClient(create_app(cfg))


def test_cors_and_metadata_endpoints(tmp_path: Path) -> None:
    client = _make_client(tmp_path)

    # CORS preflight from GitHub Pages origin
    preflight = client.options(
        "/episodes/generate",
        headers={
            "Origin": "https://dr-week.github.io",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert preflight.status_code == 200
    assert preflight.headers.get("access-control-allow-origin") == "https://dr-week.github.io"

    # GET /styles returns all 16 visual engines
    styles_res = client.get("/styles")
    assert styles_res.status_code == 200
    styles = styles_res.json()
    assert len(styles) == 16
    assert {s["key"] for s in styles} == set(VISUAL_STYLE_PROFILES.keys())

    # GET /creative-matrix returns 10 books + 6 director's stacks
    matrix_res = client.get("/creative-matrix")
    assert matrix_res.status_code == 200
    matrix = matrix_res.json()
    assert len(matrix["books"]) == len(BOOK_FRAMEWORKS) == 10
    assert len(matrix["directors_stacks"]) == len(DIRECTORS_STACKS) == 6
    assert matrix["visual_styles_count"] == 16


def test_multi_style_episode_generation_passes_style_aware_lint(tmp_path: Path) -> None:
    client = _make_client(tmp_path)

    for style in (
        "gta6-vice",
        "isometric-diorama",
        "vhs-found-footage",
        "noir-monochrome",
        "concept-art-gouache",
        "ink-wash-blueprint",
    ):
        res = client.post(
            "/episodes/generate",
            json={
                "seed_topic": "Tea vendor charges extra for slow-motion eye contact",
                "visual_style": style,
                "save_to_db": False,
                "export": False,
            },
        )
        assert res.status_code == 200, f"Failed for style={style}: {res.text}"
        ep = res.json()["episode"]
        assert ep["storyboard"]["spec"]["visual_style"] == style
        assert ep["video"]["spec"]["visual_style"] == style
        assert ep["lint"]["passed"] is True, f"Lint failed for {style}: {ep['lint']['issues']}"
        for token in VISUAL_STYLE_PROFILES[style].required_tokens:
            assert token in ep["storyboard"]["rendered_prompt"].lower()
            assert token in ep["video"]["rendered_prompt"].lower()


def test_parody_sanitizer_and_video_forbidden_stripper() -> None:
    raw = "Elon Musk meets Hulk, Spider-Man, Goku, Naruto, Gojo, John Wick, Harry Potter, Thanos and Superman in 9:16 20-second [0:00–0:03] clip 🔥🚀"
    sanitized = sanitize_parody_text(raw)
    assert "Elone Maask" in sanitized
    assert "Hulke" in sanitized
    assert "Spooder-Maan" in sanitized
    assert "Gokoo-Bhai" in sanitized
    assert "Narooto-Wa" in sanitized
    assert "Goojo-Ji" in sanitized
    assert "Jaan-Wicke" in sanitized
    assert "Haari-Paatar" in sanitized
    assert "Thaanos-Seth" in sanitized
    assert "Sooper-Babu" in sanitized
    assert find_exact_proper_name_leaks(sanitized) == []
    assert not has_emoji(sanitized)

    vid_clean = strip_video_forbidden(sanitized)
    for forbidden in ("9:16", "20-second", "[0:00"):
        assert forbidden not in vid_clean


def test_validator_flags_proper_names_emojis_and_cliches() -> None:
    idea = PremiseIdea(
        title="Elon Musk visits Goa temple with Uncle",
        mundane_anchor="A wild Goa beach argument with an Uncle over prasad",
        broken_logic_pivot="Hulk flips a plastic chair into orbit",
        deadpan_payoff="He still asks for two rupees change",
        protagonist="Man in neon slippers",
        key_props=["Plastic chair"],
    )
    positions = ["Top Left", "Top Center", "Top Right", "Bottom Left", "Bottom Center", "Bottom Right"]
    sb_spec = StoryboardSpec(
        title="Clean Title",
        visual_style="noir-monochrome",
        frames=[
            StoryboardFrame(
                frame_number=i + 1,
                position=positions[i],  # type: ignore[arg-type]
                camera_framing="Wide shot",
                visual_description="A man stares deadpan at a glowing neon chai cup on a wet table.",
                hinglish_caption="Chai garam hai",
            )
            for i in range(6)
        ],
    )
    vid_spec = VideoScriptSpec(
        title="Clean Title",
        visual_style="noir-monochrome",
        shots=[
            VideoShot(
                shot_number=i + 1,
                time_window="0:00–0:03",
                transition="Hard cut to" if i > 0 else "",
                visual_action="Camera holds deadpan on the neon chai cup vibrating on the table.",
                retro_sfx="Low hum" if i < 5 else "Bass hit, instant hard cut to black",
                hindi_dialogue="चाय तैयार है।",
            )
            for i in range(6)
        ],
    )
    sb_res = StoryboardResult(spec=sb_spec, rendered_prompt=render_storyboard_prompt(sb_spec) + " 🔥")
    vid_res = VideoResult(spec=vid_spec, rendered_prompt=render_video_prompt(vid_spec))

    report = lint_episode(idea, sb_res, vid_res)
    codes = {i.code for i in report.issues}
    assert report.passed is False
    assert "PROPER_NAME_LEAK" in codes
    assert "EMOJI_NOT_ALLOWED" in codes
    assert "BANNED_LOCATION_OR_TROPE_CLICHE" in codes
    assert "RELIGIOUS_CONTENT_NOT_ALLOWED" in codes


def test_knowledge_db_fts5_search_and_books_endpoint(tmp_path: Path) -> None:
    client = _make_client(tmp_path)
    books_res = client.get("/knowledge/books")
    assert books_res.status_code == 200
    assert len(books_res.json()) >= 18

    search_res = client.get("/knowledge/search", params={"q": "Hook Point", "kind": "book"})
    assert search_res.status_code == 200
    hits = search_res.json()
    assert len(hits) >= 1
    assert any("Hook Point" in h["title"] for h in hits)


def test_mcp_jsonrpc_server_endpoint(tmp_path: Path) -> None:
    client = _make_client(tmp_path)

    init_res = client.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "initialize"})
    assert init_res.status_code == 200
    assert init_res.json()["result"]["serverInfo"]["name"] == "absurd-studio-mcp"

    list_res = client.post("/mcp", json={"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
    assert list_res.status_code == 200
    tool_names = {t["name"] for t in list_res.json()["result"]["tools"]}
    assert {"list_visual_engines", "search_comedy_knowledge", "generate_viral_episode"} <= tool_names

    call_res = client.post(
        "/mcp",
        json={"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "list_visual_engines"}},
    )
    assert call_res.status_code == 200
    engines = call_res.json()["result"]["content"][0]["json"]
    assert len(engines) == 16


