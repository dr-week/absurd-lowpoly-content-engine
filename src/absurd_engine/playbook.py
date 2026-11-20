"""Canonical Playbook rules, templates, timing windows, and aesthetic constraints."""

from __future__ import annotations

from dataclasses import dataclass


STORYBOARD_GLOBAL_HEADER = (
    "Create a storyboard of six frames in a 3x2 grid layout on a plain dark background, "
    "rendered strictly in authentic 1998 PlayStation 1 (PS1) and Nintendo 64 (N64) ultra "
    "low-poly 3D video game graphics. Every panel must look like raw, unpolished late-90s "
    "3D game screenshots: extremely angular faceted polygon meshes with visible sharp edges, "
    "blurry pixelated low-resolution bitmap textures stretched over blocky geometry, stiff "
    "awkward character poses, crude vertex/Gouraud shading, jagged aliased edges, and muddy "
    "retro colors. Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading, and "
    "NO smooth modern CGI. Place a short, bold retro pixel-font Hinglish caption underneath "
    'each panel. Title at top: "{title}".'
)

VIDEO_GLOBAL_HEADER = (
    "Create a 20-second, 9:16 vertical absurdist comedy video rendered strictly in authentic "
    "1998 PlayStation 1 (PS1) and Nintendo 64 (N64) ultra low-poly 3D video game graphics. "
    "Maintain extremely angular faceted polygon meshes, blurry pixelated low-resolution "
    "bitmap textures, stiff robotic character animations with jerky low-FPS movement, crude "
    "vertex/Gouraud shading, jagged aliased edges, and muddy retro colors throughout. "
    "Strictly NO smooth modern CGI, NO 2D cartoon art, and NO comic ink outlines. Audio "
    "features a deadpan, serious Indian male narrator speaking ultra-short Hindi lines "
    "matched tightly to each shot, paired with retro PS1 sound effects and sharp hard cuts."
)

REQUIRED_PS1_TOKENS = (
    "1998",
    "ps1",
    "low-poly",
    "polygon",
    "gouraud",
)

REQUIRED_NEGATIVE_CONSTRAINTS = (
    "no 2d cartoon art",
    "no comic ink outlines",
    "no smooth modern cgi",
)

CLICHE_WARNING_PHRASES = (
    "jugaad",
    "life hack",
    "lifehack",
    "pro tip",
    "talking phone",
    "talking fridge",
    "talking fan",
    "talking chair",
    "talking cup",
    "smart hack",
)


@dataclass(frozen=True)
class FrameSlot:
    index: int
    position: str
    shot_prefix: str
    role: str


STORYBOARD_SLOTS: tuple[FrameSlot, ...] = (
    FrameSlot(1, "Top Left", "Raw 1998 PS1 low-poly 3D screenshot.", "Setup scene & character"),
    FrameSlot(2, "Top Center", "Raw 1998 PS1 low-poly 3D screenshot.", "Action / escalation"),
    FrameSlot(3, "Top Right", "Raw 1998 PS1 low-poly 3D close-up.", "Weird shift / detail"),
    FrameSlot(4, "Bottom Left", "Raw 1998 PS1 low-poly 3D screenshot.", "Consequence in environment"),
    FrameSlot(5, "Bottom Center", "Raw 1998 PS1 low-poly 3D screenshot.", "Build-up right before twist"),
    FrameSlot(6, "Bottom Right", "Raw 1998 PS1 low-poly 3D absurd wide/close shot.", "Surprising absurd payoff"),
)


@dataclass(frozen=True)
class BeatWindow:
    shot_number: int
    start_sec: int
    end_sec: int
    default_transition: str
    role: str
    max_words: int

    @property
    def label(self) -> str:
        return f"0:{self.start_sec:02d}–0:{self.end_sec:02d}"

    @property
    def duration_sec(self) -> int:
        return self.end_sec - self.start_sec


VIDEO_BEATS: tuple[BeatWindow, ...] = (
    BeatWindow(1, 0, 3, "", "Setup scene + jerky action", max_words=7),
    BeatWindow(2, 3, 7, "Hard cut to", "Escalation scene + action", max_words=9),
    BeatWindow(3, 7, 10, "", "Close-up / weird shift + action", max_words=7),
    BeatWindow(4, 10, 14, "Hard cut to", "Environmental escalation + action", max_words=9),
    BeatWindow(5, 14, 17, "Hard cut to", "Build-up beat right before twist", max_words=7),
    BeatWindow(6, 17, 20, "Sudden whip-pan to", "Absurd payoff + instant hard cut to black", max_words=7),
)
