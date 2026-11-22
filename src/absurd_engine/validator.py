"""Playbook Linter: validates premises, storyboards, and 20s video prompts against the canonical rules."""

from __future__ import annotations

import re

from absurd_engine.parody import find_exact_proper_name_leaks, has_emoji
from absurd_engine.playbook import (
    BANNED_CLICHE_WORDS,
    BANNED_RELIGIOUS_WORDS,
    CLICHE_WARNING_PHRASES,
    REQUIRED_NEGATIVE_CONSTRAINTS,
    STORYBOARD_SLOTS,
    STYLE_SPAM_TOKENS,
    VIDEO_BEATS,
    VISUAL_STYLE_PROFILES,
)
from absurd_engine.schemas import (
    LintIssue,
    LintReport,
    PremiseIdea,
    StoryboardResult,
    VideoResult,
)

# Strip ASCII + Devanagari punctuation (e.g. standalone danda "।") before counting words
_PUNCT_ONLY_RE = re.compile(r"^[\W_।॥]+$")
_BANNED_CLICHE_RE = re.compile(r"\b(?:" + "|".join(BANNED_CLICHE_WORDS) + r")\b", re.IGNORECASE)
_BANNED_RELIGIOUS_RE = re.compile(r"\b(?:" + "|".join(BANNED_RELIGIOUS_WORDS) + r")\b", re.IGNORECASE)


def _count_words(text: str) -> int:
    tokens = re.findall(r"\S+", text.strip())
    return sum(1 for tok in tokens if not _PUNCT_ONLY_RE.match(tok))


def _count_style_spam_items(texts: list[str]) -> int:
    """Count how many individual frames/shots repeat global PS1 style tokens."""
    flagged = 0
    for item in texts:
        lowered = item.lower()
        if any(token in lowered for token in STYLE_SPAM_TOKENS):
            flagged += 1
    return flagged


def lint_episode(
    idea: PremiseIdea,
    storyboard: StoryboardResult,
    video: VideoResult,
) -> LintReport:
    """Validate an episode bundle against all Playbook style, pacing, efficiency, and anti-cliché rules."""
    issues: list[LintIssue] = []

    # 1. Anti-cliché, zero-emoji, and zero-exact-proper-name checks
    idea_blob = " ".join(
        [idea.title, idea.mundane_anchor, idea.broken_logic_pivot, idea.deadpan_payoff]
    ).lower()
    for phrase in CLICHE_WARNING_PHRASES:
        if phrase in idea_blob:
            issues.append(
                LintIssue(
                    severity="warning",
                    code="IDEA_BANNED_TAME_TROPE",
                    message=f"Premise mentions banned/tame trope '{phrase}' — keep premises sharp and modern.",
                    location="idea",
                )
            )

    full_text = f"{idea_blob}\n{storyboard.rendered_prompt}\n{video.rendered_prompt}"
    for leak in find_exact_proper_name_leaks(full_text):
        issues.append(
            LintIssue(
                severity="error",
                code="PROPER_NAME_LEAK",
                message=f"Exact proper name '{leak}' detected — use phonetic lookalike parody spelling instead.",
                location="episode",
            )
        )
    if has_emoji(full_text):
        issues.append(
            LintIssue(
                severity="error",
                code="EMOJI_NOT_ALLOWED",
                message="Unicode emoji detected — prompts must remain strictly zero-emoji.",
                location="episode",
            )
        )
    cliche_match = _BANNED_CLICHE_RE.search(full_text)
    if cliche_match:
        issues.append(
            LintIssue(
                severity="error",
                code="BANNED_LOCATION_OR_TROPE_CLICHE",
                message=f"Banned cliché '{cliche_match.group(0)}' detected — avoid Goa/Uncle/Delhi/Mumbai clichés.",
                location="episode",
            )
        )
    religious_match = _BANNED_RELIGIOUS_RE.search(full_text)
    if religious_match:
        issues.append(
            LintIssue(
                severity="error",
                code="RELIGIOUS_CONTENT_NOT_ALLOWED",
                message=f"Religious reference '{religious_match.group(0)}' detected — no jokes on temples, churches, mosques, or prasad.",
                location="episode",
            )
        )

    # 2. Storyboard aesthetic (style-aware), slot alignment, caption length & anti-repetition checks
    sb_profile = VISUAL_STYLE_PROFILES.get(storyboard.spec.visual_style, VISUAL_STYLE_PROFILES["ps1-1998"])
    sb_lower = storyboard.rendered_prompt.lower()
    for token in sb_profile.required_tokens:
        if token not in sb_lower:
            issues.append(
                LintIssue(
                    severity="error",
                    code="STORYBOARD_MISSING_STYLE_TOKEN",
                    message=f"Storyboard prompt ({sb_profile.key}) is missing required style token '{token}'.",
                    location="storyboard.rendered_prompt",
                )
            )
    if sb_profile.require_ps1_negatives:
        for neg in REQUIRED_NEGATIVE_CONSTRAINTS:
            if neg not in sb_lower:
                issues.append(
                    LintIssue(
                        severity="error",
                        code="STORYBOARD_MISSING_NEGATIVE_CONSTRAINT",
                        message=f"Storyboard prompt is missing required negative constraint '{neg}'.",
                        location="storyboard.rendered_prompt",
                    )
                )

    for slot, frame in zip(STORYBOARD_SLOTS, storyboard.spec.frames, strict=True):
        if frame.position != slot.position:
            issues.append(
                LintIssue(
                    severity="warning",
                    code="STORYBOARD_POSITION_MISMATCH",
                    message=f"Frame {frame.frame_number} has position '{frame.position}', expected '{slot.position}'.",
                    location=f"storyboard.frames[{frame.frame_number - 1}]",
                )
            )
        cap_words = _count_words(frame.hinglish_caption)
        if cap_words > 10:
            issues.append(
                LintIssue(
                    severity="warning",
                    code="STORYBOARD_CAPTION_LONG",
                    message=f"Frame {frame.frame_number} caption has {cap_words} words (keep <= 10 for crisp retro pixel font).",
                    location=f"storyboard.frames[{frame.frame_number - 1}]",
                )
            )

    sb_spam = _count_style_spam_items(
        [f"{f.camera_framing} {f.visual_description}" for f in storyboard.spec.frames]
    )
    if sb_spam >= 3:
        issues.append(
            LintIssue(
                severity="warning",
                code="STORYBOARD_STYLE_REPETITION",
                message=(
                    f"{sb_spam}/6 storyboard frames repeat global style terms — "
                    "keep style in the global header for token efficiency."
                ),
                location="storyboard.frames",
            )
        )

    # 3. Video aesthetic (style-aware), audio, timing, Hindi dialogue pacing & anti-repetition checks
    vid_profile = VISUAL_STYLE_PROFILES.get(video.spec.visual_style, VISUAL_STYLE_PROFILES["ps1-1998"])
    vid_lower = video.rendered_prompt.lower()
    for token in vid_profile.required_tokens:
        if token not in vid_lower:
            issues.append(
                LintIssue(
                    severity="error",
                    code="VIDEO_MISSING_STYLE_TOKEN",
                    message=f"Video prompt ({vid_profile.key}) is missing required style token '{token}'.",
                    location="video.rendered_prompt",
                )
            )
    if vid_profile.require_ps1_negatives:
        for neg in REQUIRED_NEGATIVE_CONSTRAINTS:
            if neg not in vid_lower:
                issues.append(
                    LintIssue(
                        severity="error",
                        code="VIDEO_MISSING_NEGATIVE_CONSTRAINT",
                        message=f"Video prompt is missing required negative constraint '{neg}'.",
                        location="video.rendered_prompt",
                    )
                )
    if "deadpan" not in vid_lower or "hindi" not in vid_lower:
        issues.append(
            LintIssue(
                severity="error",
                code="VIDEO_MISSING_NARRATOR_SPEC",
                message="Video prompt must specify the deadpan Indian male narrator speaking Hindi.",
                location="video.rendered_prompt",
            )
        )
    if "hard cut to black" not in vid_lower:
        issues.append(
            LintIssue(
                severity="warning",
                code="VIDEO_MISSING_BLACK_CUT",
                message="Final beat should end with an instant hard cut to black.",
                location="video.shots[5]",
            )
        )

    for forbidden in ("9:16", "16:9", "20-second", "20 second", "[0:00"):
        if forbidden in vid_lower:
            issues.append(
                LintIssue(
                    severity="error",
                    code="VIDEO_FORBIDDEN_TIME_OR_SIZE",
                    message=f"Video prompt must not mention video size, duration, or timestamps (found '{forbidden}').",
                    location="video.rendered_prompt",
                )
            )

    for beat, shot in zip(VIDEO_BEATS, video.spec.shots, strict=True):
        if f"Shot {beat.shot_number}:" not in video.rendered_prompt:
            issues.append(
                LintIssue(
                    severity="error",
                    code="VIDEO_MISSING_SHOT_LABEL",
                    message=f"Rendered video prompt missing 'Shot {beat.shot_number}:'.",
                    location=f"video.shots[{beat.shot_number - 1}]",
                )
            )
        words = _count_words(shot.hindi_dialogue)
        if words > beat.max_words:
            issues.append(
                LintIssue(
                    severity="warning",
                    code="VIDEO_DIALOGUE_TOO_LONG",
                    message=(
                        f"Shot {beat.shot_number} Hindi line has "
                        f"{words} words (target <= {beat.max_words} words for tight deadpan pacing)."
                    ),
                    location=f"video.shots[{beat.shot_number - 1}].hindi_dialogue",
                )
            )

    vid_spam = _count_style_spam_items([s.visual_action for s in video.spec.shots])
    if vid_spam >= 3:
        issues.append(
            LintIssue(
                severity="warning",
                code="VIDEO_STYLE_REPETITION",
                message=(
                    f"{vid_spam}/6 video shots repeat global style terms — "
                    "keep style in the global header for token efficiency."
                ),
                location="video.shots",
            )
        )

    errors = sum(1 for i in issues if i.severity == "error")
    warnings = sum(1 for i in issues if i.severity == "warning")
    score = max(0, 100 - (errors * 25) - (warnings * 8))

    return LintReport(passed=(errors == 0), score=score, issues=issues)
