"""Strict Pydantic v2 schemas for ideas, storyboards, video prompts, trends, and episodes."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field, field_validator

VisualStyle = Literal[
    "ps1-1998",
    "gta6-vice",
    "hybrid-1998-gta6",
    "cctv-dashcam",
    "claymation-stopmo",
    "retro-80s-concept",
    "isometric-diorama",
    "vhs-found-footage",
    "noir-monochrome",
    "lugan-3d-skit",
    "stylized-2d-anime",
    "mixed-2d-realworld",
    "mixed-2d-3d-collage",
    "paper-cutout-stopmo",
]


class TrendItem(BaseModel):
    """A fresh Indian news or trending hook fetched from RSS."""

    title: str
    source: str
    published: str = ""
    url: str = ""


class IdeaRequest(BaseModel):
    """Inputs for generating one or more surreal Indian PS1 premises."""

    seed_topic: str | None = Field(
        default=None,
        description="Optional mundane moment, Indian setting, or news/trending hook to anchor the premise.",
    )
    setting_hint: str | None = Field(
        default=None,
        description="Optional location hint (e.g., 'Metro platform', 'Chai tapri', 'SBI lunch break').",
    )
    news_hook: str | None = Field(
        default=None,
        description="Optional recent news or trending internet hook to twist into surreal logic.",
    )
    mechanic: str | None = Field(
        default=None,
        description="Optional PS1 broken-physics mechanic key (e.g., 'draw_distance_fog', 'scale_glitch').",
    )
    avoid_titles: list[str] = Field(
        default_factory=list,
        description="Past episode titles to avoid repeating.",
    )
    count: int = Field(default=1, ge=1, le=5)


class PremiseIdea(BaseModel):
    """A surreal, anti-cliché premise anchored in a mundane Indian moment."""

    title: str = Field(..., min_length=3, max_length=80, description="Punchy Hinglish/English title.")
    mechanic: str = Field(
        default="gravity_debit",
        description="Broken-physics PS1 mechanic key driving the absurd twist.",
    )
    mundane_anchor: str = Field(
        ...,
        description="The ordinary Indian setting, everyday moment, or news/trending hook.",
    )
    broken_logic_pivot: str = Field(
        ...,
        description="The disorienting cause-and-effect break or physical absurdity.",
    )
    deadpan_payoff: str = Field(
        ...,
        description="The unexpected visual punchline delivered deadpan.",
    )
    protagonist: str = Field(
        ...,
        description="Concise character description (clothes, posture, silhouette).",
    )
    key_props: list[str] = Field(
        default_factory=list,
        min_length=1,
        max_length=5,
        description="Iconic props needed across the 6 beats.",
    )
    tone_tags: list[str] = Field(
        default_factory=lambda: ["deadpan", "surreal", "ps1-1998"],
    )


class IdeaBatch(BaseModel):
    ideas: list[PremiseIdea] = Field(..., min_length=1)


class StoryboardFrame(BaseModel):
    """Single panel inside the 6-frame 3x2 storyboard grid."""

    frame_number: int = Field(..., ge=1, le=6)
    position: Literal[
        "Top Left",
        "Top Center",
        "Top Right",
        "Bottom Left",
        "Bottom Center",
        "Bottom Right",
    ]
    camera_framing: str = Field(
        ...,
        description="Framing & camera angle (e.g. 'Wide static shot', 'Close-up').",
    )
    visual_description: str = Field(
        ...,
        min_length=15,
        description="Concrete scene, character pose, props, and visual absurdity (no repeated global style words).",
    )
    hinglish_caption: str = Field(
        ...,
        min_length=2,
        max_length=70,
        description="Short, punchy retro pixel-font Hinglish caption under this panel.",
    )


class StoryboardSpec(BaseModel):
    """Structured 6-frame 3x2 storyboard specification."""

    title: str = Field(..., min_length=3, max_length=80)
    visual_style: VisualStyle = "ps1-1998"
    frames: list[StoryboardFrame] = Field(..., min_length=6, max_length=6)

    @field_validator("frames")
    @classmethod
    def validate_frame_order(cls, frames: list[StoryboardFrame]) -> list[StoryboardFrame]:
        numbers = [f.frame_number for f in frames]
        if numbers != [1, 2, 3, 4, 5, 6]:
            raise ValueError(f"Frames must be numbered 1 through 6 in order, got {numbers}")
        return frames


class StoryboardResult(BaseModel):
    spec: StoryboardSpec
    rendered_prompt: str


class VideoShot(BaseModel):
    """Single timed beat inside the 6-shot vertical video prompt."""

    shot_number: int = Field(..., ge=1, le=6)
    time_window: str = Field(..., description="Exact beat window, e.g. '0:00–0:03'.")
    transition: str = Field(
        default="",
        description="Cut style (e.g. 'Hard cut to', 'Sudden whip-pan to').",
    )
    visual_action: str = Field(
        ...,
        min_length=15,
        description="Camera framing, jerky movement, and visual gag (no repeated global style words).",
    )
    retro_sfx: str = Field(
        ...,
        min_length=3,
        description="Specific retro 1998 PS1/N64 sound effect.",
    )
    hindi_dialogue: str = Field(
        ...,
        min_length=2,
        max_length=80,
        description="Ultra-short spoken Hindi line fitting 3–4s.",
    )
    speaker: str = Field(
        default="PROTAGONIST",
        description="Explicit speaker label (e.g. PROTAGONIST, NPC-1: CHAIWALA, NPC-2: BYSTANDER, ENTITY: PA SPEAKER, NARRATOR (V.O.)).",
    )
    voice_direction: str = Field(
        default="natural conversational tone, on-screen lip-sync",
        description="Voice texture, delivery, and eyeline/lip-sync direction.",
    )


class VideoScriptSpec(BaseModel):
    """Structured 6-shot vertical video specification."""

    title: str = Field(..., min_length=3, max_length=80)
    visual_style: VisualStyle = "ps1-1998"
    narrator_voice: str = Field(
        default="Deadpan, serious Indian male narrator speaking ultra-short Hindi lines",
    )
    shots: list[VideoShot] = Field(..., min_length=6, max_length=6)

    @field_validator("shots")
    @classmethod
    def validate_shot_order(cls, shots: list[VideoShot]) -> list[VideoShot]:
        numbers = [s.shot_number for s in shots]
        if numbers != [1, 2, 3, 4, 5, 6]:
            raise ValueError(f"Shots must be numbered 1 through 6 in order, got {numbers}")
        return shots


class VideoResult(BaseModel):
    spec: VideoScriptSpec
    rendered_prompt: str


class FusedEpisodeDraft(BaseModel):
    """Single-shot structured output combining premise, 6-frame storyboard, and 6-shot video script."""

    idea: PremiseIdea
    storyboard: StoryboardSpec
    video: VideoScriptSpec


class LintIssue(BaseModel):
    severity: Literal["error", "warning"]
    code: str
    message: str
    location: str | None = None


class LintReport(BaseModel):
    passed: bool
    score: int = Field(..., ge=0, le=100)
    issues: list[LintIssue] = Field(default_factory=list)


class EpisodeBundle(BaseModel):
    """Complete generated package ready for copy-paste, export, or future UI consumption."""

    episode_id: str = Field(default_factory=lambda: uuid4().hex[:10])
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    provider: str
    model: str
    mode: Literal["fused", "modular"] = "fused"
    repaired: bool = False
    idea: PremiseIdea
    storyboard: StoryboardResult
    video: VideoResult
    lint: LintReport


class EpisodeSummary(BaseModel):
    """Lightweight row returned from SQLite episode history."""

    episode_id: str
    created_at: str
    title: str
    mechanic: str
    provider: str
    model: str
    mode: str
    lint_score: int
    lint_passed: bool


class EpisodeGenerateRequest(BaseModel):
    seed_topic: str | None = None
    setting_hint: str | None = None
    news_hook: str | None = None
    mechanic: str | None = None
    visual_style: VisualStyle = "ps1-1998"
    mode: Literal["fused", "modular"] = "fused"
    auto_repair: bool = True
    save_to_db: bool = True
    export: bool = False


class BatchGenerateRequest(BaseModel):
    count: int = Field(default=3, ge=1, le=10)
    from_trends: bool = True
    seed_topics: list[str] = Field(default_factory=list)
    visual_style: VisualStyle = "ps1-1998"
    mode: Literal["fused", "modular"] = "fused"
    auto_repair: bool = True
    save_to_db: bool = True
    export: bool = False
