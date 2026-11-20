"""Strict Pydantic v2 schemas for ideas, storyboards, video prompts, and validation reports."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field, field_validator


class IdeaRequest(BaseModel):
    """Inputs for generating one or more surreal Indian PS1 premises."""

    seed_topic: str | None = Field(
        default=None,
        description="Optional mundane moment, Indian setting, or news/trending hook to anchor the premise.",
    )
    setting_hint: str | None = Field(
        default=None,
        description="Optional location hint (e.g., 'Delhi Metro', 'Chai tapri', 'SBI lunch break').",
    )
    news_hook: str | None = Field(
        default=None,
        description="Optional recent news or trending internet hook to twist into surreal logic.",
    )
    count: int = Field(default=1, ge=1, le=5)


class PremiseIdea(BaseModel):
    """A surreal, anti-cliché premise anchored in a mundane Indian moment."""

    title: str = Field(..., min_length=3, max_length=80, description="Punchy Hinglish/English title.")
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
        description="Blocky 1998 PS1 character description (clothes, stiff posture, low-poly silhouette).",
    )
    key_props: list[str] = Field(
        default_factory=list,
        min_length=1,
        max_length=5,
        description="Iconic low-poly props needed across the 6 beats.",
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
        description="Framing & camera angle (e.g. 'wide static shot', 'extreme jagged close-up').",
    )
    visual_description: str = Field(
        ...,
        min_length=15,
        description="Raw 1998 PS1 low-poly character pose, props, environment, and visual absurdity.",
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
    """Single timed beat inside the 20-second 9:16 vertical video prompt."""

    shot_number: int = Field(..., ge=1, le=6)
    time_window: str = Field(..., description="Exact beat window, e.g. '0:00–0:03'.")
    transition: str = Field(
        default="",
        description="Cut style (e.g. 'Hard cut to', 'Sudden whip-pan to').",
    )
    visual_action: str = Field(
        ...,
        min_length=15,
        description="Camera framing, jerky low-FPS animation, and visual gag in PS1 3D.",
    )
    retro_sfx: str = Field(
        ...,
        min_length=3,
        description="Specific 1998 PS1/N64 retro sound effect.",
    )
    hindi_dialogue: str = Field(
        ...,
        min_length=2,
        max_length=80,
        description="Ultra-short deadpan Hindi (Devanagari or Hinglish) narrator line fitting 3–4s.",
    )


class VideoScriptSpec(BaseModel):
    """Structured 20-second 9:16 vertical video specification."""

    title: str = Field(..., min_length=3, max_length=80)
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
    idea: PremiseIdea
    storyboard: StoryboardResult
    video: VideoResult
    lint: LintReport


class EpisodeGenerateRequest(BaseModel):
    seed_topic: str | None = None
    setting_hint: str | None = None
    news_hook: str | None = None
    export: bool = False
