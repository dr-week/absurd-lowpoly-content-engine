"""Phase 2: Broken-Physics Mechanic Library for 1998 PS1/N64 absurdist variety."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SurrealMechanic:
    key: str
    name: str
    rule: str
    visual_cue: str


MECHANICS_CATALOG: tuple[SurrealMechanic, ...] = (
    SurrealMechanic(
        key="draw_distance_fog",
        name="PS1 Draw-Distance Fog",
        rule="Smog, mist, or confusion literally shrinks the world's 1998 render distance until objects pop out of existence into a grey void.",
        visual_cue="Thick grey draw-distance fog swallowing buildings and people two feet away.",
    ),
    SurrealMechanic(
        key="console_downgrade",
        name="Console Generation Downgrade",
        rule="Every time a character complains or waits, reality drops a graphics generation until people turn into 4-polygon floating triangles.",
        visual_cue="Sudden step-down from blocky character to crude floating geometric prism.",
    ),
    SurrealMechanic(
        key="t_pose_clipping",
        name="T-Pose Floor Clipping",
        rule="A mundane trigger turns off collision physics, causing people to freeze in a rigid T-pose and sink straight through floors or walls.",
        visual_cue="Rigid upright T-pose sinking cleanly through tiled floors or concrete walls.",
    ),
    SurrealMechanic(
        key="bureaucracy_physics",
        name="Bureaucracy Overrides Physics",
        rule="An Indian office/institutional rule (lunch break, stamp missing, token expired) literally alters gravity, time, or solid matter.",
        visual_cue="A rubber stamp or wooden counter plaque physically warping the room.",
    ),
    SurrealMechanic(
        key="scale_glitch",
        name="Abrupt Scale Glitch",
        rule="A minor penalty or fee abruptly rescales a person or vehicle to miniature or giant size while one everyday prop stays normal-sized.",
        visual_cue="1.5-foot-tall commuter wearing a full-sized rigid backpack.",
    ),
    SurrealMechanic(
        key="gravity_debit",
        name="Physical Constant Debit",
        rule="A digital payment, meter, or bill accidentally deducts a law of physics (gravity, friction, shadows, sound) instead of rupees.",
        visual_cue="Objects detaching straight upward off the pavement with zero rotation.",
    ),
    SurrealMechanic(
        key="texture_swap",
        name="Low-Res Texture Swap",
        rule="Pretentious modern settings abruptly lose their textures and revert to crude 1998 village mud, checkerboard debug tiles, or missing-texture voids.",
        visual_cue="Cafe marble floor snapping instantly to pixelated mud and checkerboard tiles.",
    ),
    SurrealMechanic(
        key="npc_loop",
        name="Deadpan NPC Loop",
        rule="While total surreal chaos unfolds, bystanders stay locked in a robotic 2-frame everyday Indian routine and demand normal payment or etiquette.",
        visual_cue="Chaiwala or uncle calmly repeating one stiff gesture amidst floating chaos.",
    ),
)

_MECHANICS_BY_KEY: dict[str, SurrealMechanic] = {m.key: m for m in MECHANICS_CATALOG}


def get_mechanic(key: str) -> SurrealMechanic:
    """Return a mechanic by key or raise KeyError."""
    if key not in _MECHANICS_BY_KEY:
        valid = ", ".join(sorted(_MECHANICS_BY_KEY))
        raise KeyError(f"Unknown mechanic '{key}'. Valid keys: {valid}")
    return _MECHANICS_BY_KEY[key]


def pick_mechanic(
    requested: str | None = None,
    exclude_keys: list[str] | None = None,
    index: int = 0,
) -> SurrealMechanic:
    """Pick an explicit mechanic or rotate through unused ones to keep batch runs varied."""
    if requested:
        return get_mechanic(requested)

    excluded = set(exclude_keys or [])
    candidates = [m for m in MECHANICS_CATALOG if m.key not in excluded]
    pool = candidates if candidates else list(MECHANICS_CATALOG)
    return pool[index % len(pool)]
