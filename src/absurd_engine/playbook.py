"""Canonical Playbook rules, templates, timing windows, and aesthetic constraints."""

from __future__ import annotations

from dataclasses import dataclass


STORYBOARD_GLOBAL_HEADER = (
    "6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL "
    "panels: raw 1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game screenshots—"
    "angular faceted polygons, blurry pixelated bitmap textures, stiff awkward poses, crude "
    "Gouraud shading, jagged aliased edges, and muddy retro colors. Strictly NO 2D cartoon art, "
    "NO comic ink outlines, NO cel-shading, NO smooth modern CGI. Place a short bold retro "
    'pixel-font Hinglish caption under each panel. Title at top: "{title}".'
)

VIDEO_GLOBAL_HEADER = (
    "20-second, 9:16 vertical absurdist comedy video. Apply one unified style throughout: raw "
    "1998 PlayStation 1 (PS1) / Nintendo 64 (N64) ultra low-poly 3D game graphics—angular "
    "faceted polygons, blurry pixelated bitmap textures, stiff robotic animations with jerky "
    "low-FPS movement, crude Gouraud shading, jagged aliased edges, and muddy retro colors. "
    "Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading, NO smooth modern CGI. "
    "Audio: deadpan, serious Indian male narrator speaking ultra-short Hindi lines matched "
    "tightly to each shot, paired with retro PS1 SFX and sharp hard cuts."
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
    "no cel-shading",
    "no smooth modern cgi",
)

# Style adjectives that belong ONCE in the global header, not spammed across every frame/shot.
STYLE_SPAM_TOKENS = (
    "1998 ps1",
    "low-poly",
    "low poly",
    "pixelated",
    "gouraud",
    "faceted polygon",
    "aliased",
)

# Tame, boring boomer domestic tropes and predictable clichés that are strictly banned.
BANNED_TAME_TROPES = (
    "boiling milk",
    "doodh ubal",
    "pressure cooker",
    "cooker whistle",
    "clothesline",
    "drying clothes",
    "terrace blanket",
    "kambal",
    "tv remote",
    "society uncle",
    "maintenance cheque",
    "lizard",
    "chipkali",
    "jugaad",
    "life hack",
    "lifehack",
    "pro tip",
    "talking phone",
    "talking fridge",
    "talking fan",
)

# Mandatory high-energy modern concepts: must feature violent physical disruption or catastrophic property destruction.
CATASTROPHIC_DESTRUCTION_KEYWORDS = (
    "crash",
    "smash",
    "shatter",
    "explode",
    "fly through",
    "split",
    "launch",
    "derail",
    "rip through",
    "destroy",
    "collapse",
    "slam",
    "detach",
    "sink",
    "vanish",
    "hover",
    "float",
)

CLICHE_WARNING_PHRASES = BANNED_TAME_TROPES


@dataclass(frozen=True)
class FrameSlot:
    index: int
    position: str
    role: str


STORYBOARD_SLOTS: tuple[FrameSlot, ...] = (
    FrameSlot(1, "Top Left", "Setup scene & character"),
    FrameSlot(2, "Top Center", "Action / escalation"),
    FrameSlot(3, "Top Right", "Weird shift / close-up detail"),
    FrameSlot(4, "Bottom Left", "Consequence in environment"),
    FrameSlot(5, "Bottom Center", "Build-up right before twist"),
    FrameSlot(6, "Bottom Right", "Surprising absurd payoff"),
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
