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
    "Absurdist comedy video. Apply one unified style throughout: raw 1998 PlayStation 1 (PS1) / "
    "Nintendo 64 (N64) ultra low-poly 3D game graphics—angular faceted polygons, blurry pixelated "
    "bitmap textures, stiff robotic animations with jerky low-FPS movement, crude Gouraud shading, "
    "jagged aliased edges, and muddy retro colors. Strictly NO 2D cartoon art, NO comic ink "
    "outlines, NO cel-shading, NO smooth modern CGI. Audio: deadpan, serious Indian male narrator "
    "speaking ultra-short Hindi lines matched tightly to each shot, paired with retro PS1 SFX "
    "and sharp hard cuts."
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

BANNED_CLICHE_WORDS: tuple[str, ...] = ("goa", "goan", "uncle", "uncles", "delhi", "mumbai")


@dataclass(frozen=True)
class VisualStyleProfile:
    key: str
    label: str
    storyboard_header: str
    video_header: str
    required_tokens: tuple[str, ...]
    require_ps1_negatives: bool = False


VISUAL_STYLE_PROFILES: dict[str, VisualStyleProfile] = {
    "ps1-1998": VisualStyleProfile(
        key="ps1-1998",
        label="1998 PS1 Low-Poly",
        storyboard_header=STORYBOARD_GLOBAL_HEADER,
        video_header=VIDEO_GLOBAL_HEADER,
        required_tokens=REQUIRED_PS1_TOKENS,
        require_ps1_negatives=True,
    ),
    "gta6-vice": VisualStyleProfile(
        key="gta6-vice",
        label="Vice Open-World Gameplay",
        storyboard_header=(
            "6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL "
            "panels: authentic open-world Vice City third-person gameplay screenshots—sun-drenched coastal "
            "heat haze, hyper-real neon asphalt reflections, circular GPS radar minimap in bottom-left, flashing "
            "wanted stars in top-right, and absurd chaotic NPC physics. Strictly NO 2D cartoon art. Place a short "
            'bold subtitle under each panel. Title at top: "{title}".'
        ),
        video_header=(
            "Absurdist comedy video. Apply one unified style throughout: authentic open-world Vice City "
            "third-person gameplay footage—sun-drenched coastal heat haze, circular GPS radar minimap in "
            "bottom-left, flashing wanted stars in top-right, and chaotic ragdoll NPC physics. Audio: deadpan, "
            "serious Indian male narrator speaking ultra-short Hindi lines matched tightly to each shot, paired "
            "with game-engine SFX and sharp hard cuts."
        ),
        required_tokens=("vice city", "gameplay", "minimap"),
    ),
    "hybrid-1998-gta6": VisualStyleProfile(
        key="hybrid-1998-gta6",
        label="PS1 x Vice Gameplay Hybrid",
        storyboard_header=(
            "6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL "
            "panels: 1998 PS1 ultra low-poly angular faceted polygons combined with Vice City open-world gameplay HUD—"
            "circular GPS radar minimap, flashing wanted stars, crude Gouraud shading, and jagged aliased edges. "
            'Place a short bold pixel-font Hinglish caption under each panel. Title at top: "{title}".'
        ),
        video_header=(
            "Absurdist comedy video. Apply one unified style throughout: 1998 PS1 ultra low-poly 3D polygons "
            "rendered inside a Vice City open-world third-person gameplay HUD with circular GPS radar minimap, flashing wanted "
            "stars, jerky low-FPS animations, and crude Gouraud shading. Audio: deadpan, serious Indian male "
            "narrator speaking ultra-short Hindi lines matched tightly to each shot, paired with retro SFX and "
            "sharp hard cuts."
        ),
        required_tokens=("ps1", "vice city", "minimap"),
    ),
    "cctv-dashcam": VisualStyleProfile(
        key="cctv-dashcam",
        label="240p CCTV / Dashcam",
        storyboard_header=(
            "6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL "
            "panels: raw grainy 240p overhead CCTV security camera / dashcam footage—fisheye lens warp, green-tinted "
            "infrared compression artifacts, REC indicator, and unhinged deadpan street realism. Place a short "
            'bold caption under each panel. Title at top: "{title}".'
        ),
        video_header=(
            "Absurdist comedy video. Apply one unified style throughout: raw grainy 240p overhead CCTV security "
            "camera / dashcam footage—fisheye lens warp, washed-out sodium street lights, and deadpan realism. "
            "Audio: deadpan, serious Indian male narrator speaking ultra-short Hindi lines matched tightly to "
            "each shot, paired with harsh mic-clipping SFX and sharp hard cuts."
        ),
        required_tokens=("cctv", "240p", "fisheye"),
    ),
    "claymation-stopmo": VisualStyleProfile(
        key="claymation-stopmo",
        label="Claymation Stop-Mo",
        storyboard_header=(
            "6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL "
            "panels: handmade stop-motion claymation miniature sets—visible thumbprints on plasticine faces, "
            "tiny tabletop props, warm studio lamp shadows, and deadpan googly-eyed expressions. Place a short "
            'bold caption under each panel. Title at top: "{title}".'
        ),
        video_header=(
            "Absurdist comedy video. Apply one unified style throughout: handmade 12-FPS stop-motion claymation "
            "miniature animation—visible thumbprints on plasticine faces, handcrafted props, and stiff jerky "
            "frame-by-frame motion. Audio: deadpan, serious Indian male narrator speaking ultra-short Hindi lines "
            "matched tightly to each shot, paired with tactile foley SFX and sharp hard cuts."
        ),
        required_tokens=("claymation", "stop-motion", "plasticine"),
    ),
    "retro-80s-concept": VisualStyleProfile(
        key="retro-80s-concept",
        label="80s Dark Fantasy Art",
        storyboard_header=(
            "6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL "
            "panels: grainy 1980s dark fantasy concept art / analog celluloid film stills—heavy 35mm film grain, "
            "dramatic chiaroscuro fog, painted airbrush glow, and absurdly serious mythic posture. Place a short "
            'bold caption under each panel. Title at top: "{title}".'
        ),
        video_header=(
            "Absurdist comedy video. Apply one unified style throughout: grainy 1980s dark fantasy analog "
            "celluloid film footage—heavy 35mm film grain, synth-era lighting, dramatic fog, and absurdly serious "
            "mythic posture. Audio: deadpan, serious Indian male narrator speaking ultra-short Hindi lines matched "
            "tightly to each shot, paired with analog synth SFX and sharp hard cuts."
        ),
        required_tokens=("1980s", "film grain", "celluloid"),
    ),
    "isometric-diorama": VisualStyleProfile(
        key="isometric-diorama",
        label="Isometric Miniature Diorama",
        storyboard_header=(
            "6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL "
            "panels: tilt-shift isometric miniature diorama photography—45-degree god-view angle, toy-scale "
            "Indian street and apartment cutouts, shallow macro depth-of-field, and razor-sharp studio lighting. "
            'Place a short bold caption under each panel. Title at top: "{title}".'
        ),
        video_header=(
            "Absurdist comedy video. Apply one unified style throughout: tilt-shift isometric miniature diorama "
            "footage—45-degree god-view macro camera, tiny toy-scale Indian street and room sets, and crisp "
            "miniature physics. Audio: deadpan, serious Indian male narrator speaking ultra-short Hindi lines "
            "matched tightly to each shot, paired with miniature foley SFX and sharp hard cuts."
        ),
        required_tokens=("isometric", "diorama", "tilt-shift"),
    ),
    "vhs-found-footage": VisualStyleProfile(
        key="vhs-found-footage",
        label="1990s VHS Found Footage",
        storyboard_header=(
            "6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL "
            "panels: authentic 1990s handheld VHS camcorder found footage—chromatic aberration, magnetic tape "
            "tracking lines, blown-out flash highlights, and chaotic home-video framing. Place a short bold "
            'caption under each panel. Title at top: "{title}".'
        ),
        video_header=(
            "Absurdist comedy video. Apply one unified style throughout: authentic 1990s handheld VHS camcorder "
            "found footage—magnetic tape tracking lines, chromatic aberration, shaky zoom-ins, and raw camcorder "
            "mic realism. Audio: deadpan, serious Indian male narrator speaking ultra-short Hindi lines matched "
            "tightly to each shot, paired with tape-hiss SFX and sharp hard cuts."
        ),
        required_tokens=("vhs", "camcorder", "found footage"),
    ),
    "noir-monochrome": VisualStyleProfile(
        key="noir-monochrome",
        label="Noir Monochrome + Neon",
        storyboard_header=(
            "6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL "
            "panels: high-contrast Sin City monochrome noir—razor-sharp black-and-white ink shadows, rain-slicked "
            "streets, and a single isolated neon accent color popping on the key comedy prop. Place a short bold "
            'caption under each panel. Title at top: "{title}".'
        ),
        video_header=(
            "Absurdist comedy video. Apply one unified style throughout: high-contrast monochrome film noir "
            "with a single isolated neon accent color on the comedy prop—hard venetian-blind shadows, rain haze, "
            "and deadpan detective framing. Audio: deadpan, serious Indian male narrator speaking ultra-short "
            "Hindi lines matched tightly to each shot, paired with noir sting SFX and sharp hard cuts."
        ),
        required_tokens=("noir", "monochrome", "neon"),
    ),
    "lugan-3d-skit": VisualStyleProfile(
        key="lugan-3d-skit",
        label="Stylized 3D Viral Skit",
        storyboard_header=(
            "6-frame storyboard in a 3x2 grid on a plain dark background. Apply one unified style to ALL "
            "panels: clean stylized indie 3D character animation—smooth simplified matte-shaded 3D figures "
            "with big expressive reaction faces, glossy stylized cars and garage props, crisp bright daylight "
            'lighting, and slapstick vehicle physics. Place a short bold caption under each panel. Title at top: "{title}".'
        ),
        video_header=(
            "Absurdist comedy video. Apply one unified style throughout: clean stylized indie 3D character "
            "animation—expressive simplified 3D comedy rigs with snappy squash-and-stretch timing, glossy "
            "stylized vehicles and street props, crisp daylight lighting, whip-pan reaction cuts, and slapstick "
            "physics. Audio: deadpan, serious Indian male narrator and expressive multi-character Hindi dialogue, "
            "punchy foley SFX, and sharp hard cuts."
        ),
        required_tokens=("stylized", "3d", "slapstick"),
    ),
}

BOOK_FRAMEWORKS: tuple[dict[str, str], ...] = (
    {"id": "comedy-bible", "title": "The Comedy Bible", "author": "Judy Carter", "craft": "Attitude + Act-Out"},
    {"id": "save-the-cat", "title": "Save the Cat!", "author": "Blake Snyder", "craft": "Logline Irony + Beat Reversal"},
    {"id": "hidden-tools", "title": "The Hidden Tools of Comedy", "author": "Steve Kaplan", "craft": "Straight Line / Wavy Line"},
    {"id": "blink-of-eye", "title": "In the Blink of an Eye", "author": "Walter Murch", "craft": "Rule of Six + Emotional Cut"},
    {"id": "five-cs", "title": "The Five C's of Cinematography", "author": "Joseph Mascelli", "craft": "Camera Angles + Cutting"},
    {"id": "made-to-stick", "title": "Made to Stick", "author": "Chip & Dan Heath", "craft": "Unexpectedness + Concrete Gaps"},
    {"id": "contagious", "title": "Contagious", "author": "Jonah Berger", "craft": "Social Currency + High-Arousal Triggers"},
    {"id": "story-mckee", "title": "Story", "author": "Robert McKee", "craft": "Value Charge Shift (Positive to Negative)"},
    {"id": "hooked", "title": "Hooked", "author": "Nir Eyal", "craft": "Variable Reward Loops"},
    {"id": "sculpting-time", "title": "Sculpting in Time", "author": "Andrei Tarkovsky", "craft": "Deadpan Durational Tension"},
)

DIRECTORS_STACKS: tuple[dict[str, str], ...] = (
    {"id": "edgar-wright", "label": "Edgar Wright Snap-Cut", "book": "In the Blink of an Eye (Walter Murch)", "lens": "24mm Wide Whip-Pan", "perspective": "Hyper-Kinetic Close POV", "edit": "Match-Cut + Whip-Pan + Audio Pre-Lap"},
    {"id": "wes-deadpan", "label": "Symmetrical Deadpan", "book": "The Hidden Tools of Comedy (Steve Kaplan)", "lens": "40mm Locked Tripod", "perspective": "Centered God-View Tableau", "edit": "Static Tableau + Sudden Smash Cut"},
    {"id": "mockumentary-zoom", "label": "Office Crash-Zoom", "book": "The Comedy Bible (Judy Carter)", "lens": "24-70mm Handheld Crash-Zoom", "perspective": "Eavesdropping Documentary Cam", "edit": "Reaction Snap-Zoom + J-Cut Audio"},
    {"id": "horror-anticipation", "label": "Protocol Slow-Push", "book": "Made to Stick (Heath Brothers)", "lens": "35mm Slow Dolly-In", "perspective": "Fixed Physical Countdown Cam", "edit": "Dead-Silence Hold + Instant Smash Cut"},
    {"id": "noir-betrayal", "label": "Chiaroscuro Reversal", "book": "Story (Robert McKee)", "lens": "85mm Shallow Telephoto", "perspective": "Low-Angle Power Silhouette", "edit": "L-Cut Voiceover + Hard Cut to Black"},
    {"id": "diorama-godview", "label": "Isometric Toy-Chaos", "book": "The Five C's of Cinematography (Mascelli)", "lens": "50mm Tilt-Shift Macro", "perspective": "45-Degree Isometric Overhead", "edit": "Speed-Ramp + Jump-Cut Escalation"},
)

