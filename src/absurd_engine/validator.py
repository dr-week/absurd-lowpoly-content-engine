"""Playbook Linter: validates premises, storyboards, and 20s video prompts against the canonical rules."""

from __future__ import annotations

import re

from absurd_engine.playbook import (
    CLICHE_WARNING_PHRASES,
    REQUIRED_NEGATIVE_CONSTRAINTS,
    REQUIRED_PS1_TOKENS,
    VIDEO_BEATS,
)
from absurd_engine.schemas import (
    LintIssue,
    LintReport,
    PremiseIdea,
    StoryboardResult,
    VideoResult,
)


def _count_words(text: str) -> int:
    return len(re.findall(r"\S+", text.strip()))


def lint_episode(
    idea: PremiseIdea,
    storyboard: StoryboardResult,
    video: VideoResult,
) -> LintReport:
    """Validate an episode bundle against all Playbook style, pacing, and anti-cliché rules."""
    issues: list[LintIssue] = []

    # 1. Anti-cliché checks on premise
    idea_blob = " ".join(
        [idea.title, idea.mundane_anchor, idea.broken_logic_pivot, idea.deadpan_payoff]
    ).lower()
    for phrase in CLICHE_WARNING_PHRASES:
        if phrase in idea_blob:
            issues.append(
                LintIssue(
                    severity="warning",
                    code="IDEA_CLICHE_TROPES",
                    message=f"Premise mentions '{phrase}' — verify it isn't a predictable jugaad/talking-object joke.",
                    location="idea",
                )
            )

    # 2. Storyboard aesthetic & negative constraints checks
    sb_lower = storyboard.rendered_prompt.lower()
    for token in REQUIRED_PS1_TOKENS:
        if token not in sb_lower:
            issues.append(
                LintIssue(
                    severity="error",
                    code="STORYBOARD_MISSING_PS1_STYLE",
                    message=f"Storyboard prompt is missing required PS1/N64 style token '{token}'.",
                    location="storyboard.rendered_prompt",
                )
            )
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

    for frame in storyboard.spec.frames:
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

    # 3. Video aesthetic, audio, timing & Hindi dialogue pacing checks
    vid_lower = video.rendered_prompt.lower()
    for token in REQUIRED_PS1_TOKENS:
        if token not in vid_lower:
            issues.append(
                LintIssue(
                    severity="error",
                    code="VIDEO_MISSING_PS1_STYLE",
                    message=f"Video prompt is missing required PS1/N64 style token '{token}'.",
                    location="video.rendered_prompt",
                )
            )
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

    for beat, shot in zip(VIDEO_BEATS, video.spec.shots, strict=True):
        if f"[{beat.label}]" not in video.rendered_prompt:
            issues.append(
                LintIssue(
                    severity="error",
                    code="VIDEO_TIMING_MISMATCH",
                    message=f"Rendered video prompt missing beat window [{beat.label}].",
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
                        f"Shot {beat.shot_number} ({beat.label}, {beat.duration_sec}s) Hindi line has "
                        f"{words} words (target <= {beat.max_words} words for tight deadpan pacing)."
                    ),
                    location=f"video.shots[{beat.shot_number - 1}].hindi_dialogue",
                )
            )

    errors = sum(1 for i in issues if i.severity == "error")
    warnings = sum(1 for i in issues if i.severity == "warning")
    score = max(0, 100 - (errors * 25) - (warnings * 8))

    return LintReport(passed=(errors == 0), score=score, issues=issues)
