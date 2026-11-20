"""Deterministic offline mock provider for instant testing without API keys."""

from __future__ import annotations

import hashlib
import json
from typing import TypeVar

from pydantic import BaseModel

from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.schemas import (
    IdeaBatch,
    PremiseIdea,
    StoryboardFrame,
    StoryboardSpec,
    VideoScriptSpec,
    VideoShot,
)

T = TypeVar("T", bound=BaseModel)

_MOCK_SCENARIOS = [
    {
        "idea": PremiseIdea(
            title="QR CODE NE GRAVITY KAAT DI",
            mundane_anchor="A tired office worker paying ₹12 via UPI at a roadside Delhi chai tapri.",
            broken_logic_pivot=(
                "The faded laminated QR sticker fails to scan; when he tilts his phone 15 degrees, "
                "the payment app deducts 9.8 m/s² of local gravity instead of ₹12."
            ),
            deadpan_payoff=(
                "The entire chai tapri, kettle, and plastic stools float rigidly into low-poly fog "
                "while the chaiwala calmly hands him a floating cutting chai and asks for ₹2 extra for parcel."
            ),
            protagonist=(
                "Blocky 1998 PS1 Indian office man in a stiff pixelated light-blue shirt, "
                "boxy brown trousers, and rectangular leather chappals."
            ),
            key_props=[
                "blurry laminated UPI QR standee",
                "angular brick-shaped smartphone",
                "faceted aluminum chai kettle",
                "low-poly plastic red stool",
            ],
            tone_tags=["deadpan", "surreal", "ps1-1998", "indian-street"],
        ),
        "storyboard": StoryboardSpec(
            title="QR CODE NE GRAVITY KAAT DI",
            frames=[
                StoryboardFrame(
                    frame_number=1,
                    position="Top Left",
                    camera_framing="Wide static street shot",
                    visual_description=(
                        "Blocky PS1 office man in a muddy blue shirt standing stiffly at a jagged "
                        "roadside chai tapri, pointing a brick-like phone at a blurry laminated QR standee."
                    ),
                    hinglish_caption="12 rupaye ka chai, QR scan nahi ho raha.",
                ),
                StoryboardFrame(
                    frame_number=2,
                    position="Top Center",
                    camera_framing="Medium awkward side angle",
                    visual_description=(
                        "Office man tilts his angular torso 45 degrees in stiff low-poly posture "
                        "while the chaiwala stares blankly with low-res pixelated eyes."
                    ),
                    hinglish_caption="Angle thoda tedha kiya, beep baj gaya.",
                ),
                StoryboardFrame(
                    frame_number=3,
                    position="Top Right",
                    camera_framing="Extreme jagged close-up",
                    visual_description=(
                        "Pixelated smartphone screen showing a crude green checkmark and bold bitmap "
                        "text 'PAID: 9.8 m/s2 GRAVITY' with muddy Gouraud shading."
                    ),
                    hinglish_caption="Paise ki jagah gravity kat gayi.",
                ),
                StoryboardFrame(
                    frame_number=4,
                    position="Bottom Left",
                    camera_framing="Low-angle wide shot",
                    visual_description=(
                        "The entire wooden tapri stall, aluminum kettle, and red plastic stools "
                        "detach from the cracked low-poly footpath and hover stiffly two feet in the air."
                    ),
                    hinglish_caption="Poora tapri hawa mein atak gaya.",
                ),
                StoryboardFrame(
                    frame_number=5,
                    position="Bottom Center",
                    camera_framing="Stiff medium shot",
                    visual_description=(
                        "Office man floats horizontally like a rigid T-pose statue beside a hovering "
                        "glass of cutting chai while cars drive underneath unbothered."
                    ),
                    hinglish_caption="Chaiwala bilkul normal khada hai.",
                ),
                StoryboardFrame(
                    frame_number=6,
                    position="Bottom Right",
                    camera_framing="Absurd wide shot into grey PS1 distance fog",
                    visual_description=(
                        "Tapri drifts high into muddy grey PS1 draw-distance fog as the rigid "
                        "chaiwala extends a blocky hand demanding two extra rupees for air parcel."
                    ),
                    hinglish_caption="Bhaiya, 2 rupaye parcel ka alag.",
                ),
            ],
        ),
        "video": VideoScriptSpec(
            title="QR CODE NE GRAVITY KAAT DI",
            shots=[
                VideoShot(
                    shot_number=1,
                    time_window="0:00–0:03",
                    transition="",
                    visual_action=(
                        "Wide static shot of blocky PS1 office man awkwardly aiming his brick phone "
                        "at a blurry UPI QR standee at a muddy roadside chai tapri in jerky 12fps motion."
                    ),
                    retro_sfx="Low-bit PS1 menu error buzz and distant street hum",
                    hindi_dialogue="रमेश ने बारह रुपये की चाय पी।",
                ),
                VideoShot(
                    shot_number=2,
                    time_window="0:03–0:07",
                    transition="Hard cut to",
                    visual_action=(
                        "Side angle as Ramesh stiffly bends his angular waist sideways; his phone "
                        "snaps toward the QR code with robotic low-FPS twitching."
                    ),
                    retro_sfx="Sharp 1998 scanner chime and crunchy coin beep",
                    hindi_dialogue="थोड़ा टेढ़ा किया, और पेमेंट हो गई।",
                ),
                VideoShot(
                    shot_number=3,
                    time_window="0:07–0:10",
                    transition="",
                    visual_action=(
                        "Jagged close-up on the pixelated phone screen flashing a crude green "
                        "tick reading 'GRAVITY DEBITED: 9.8' with aliased bitmap edges."
                    ),
                    retro_sfx="Retro PS1 confirmation jingle pitched slightly down",
                    hindi_dialogue="पैसे नहीं कटे। गुरुत्वाकर्षण कट गया।",
                ),
                VideoShot(
                    shot_number=4,
                    time_window="0:10–0:14",
                    transition="Hard cut to",
                    visual_action=(
                        "Low-angle shot of the entire boxy chai tapri, aluminum kettle, and plastic "
                        "stools rising stiffly off the pavement with zero rotation."
                    ),
                    retro_sfx="Heavy low-fi PS1 elevator drone and tin clank",
                    hindi_dialogue="पूरी टपरी हवा में ऊपर चली गई।",
                ),
                VideoShot(
                    shot_number=5,
                    time_window="0:14–0:17",
                    transition="Hard cut to",
                    visual_action=(
                        "Medium shot of Ramesh floating rigidly sideways beside a hovering glass "
                        "of cutting chai while the low-poly chaiwala slides smoothly beside him."
                    ),
                    retro_sfx="Hollow wind loop and awkward ceramic clink",
                    hindi_dialogue="चायवाले को कोई फर्क नहीं पड़ा।",
                ),
                VideoShot(
                    shot_number=6,
                    time_window="0:17–0:20",
                    transition="Sudden whip-pan to",
                    visual_action=(
                        "Absurd wide shot of the tapri disappearing into thick grey 1998 PS1 draw-distance "
                        "fog as the chaiwala stiffly holds up two boxy fingers."
                    ),
                    retro_sfx="Compressed PS1 bass hit, instant hard cut to black",
                    hindi_dialogue="बोला, हवा पार्सल के दो रुपये अलग।",
                ),
            ],
        ),
    },
    {
        "idea": PremiseIdea(
            title="LUNCH BREAK KA PORTAL",
            mundane_anchor="A customer standing at Counter 4 of an old government bank at 1:59 PM.",
            broken_logic_pivot=(
                "The clerk flips the wooden 'LUNCH TIME' sign at 2:00 PM sharp, which deletes the "
                "collision physics of the entire bank lobby."
            ),
            deadpan_payoff=(
                "The customer clips straight through the beige tiled floor and respawns spinning "
                "slowly as the lobby ceiling fan while the clerk eats tiffin underneath."
            ),
            protagonist=(
                "Stiff low-poly Indian man holding a flat cardboard file folder, wearing a "
                "muddy checkered half-sleeve shirt and boxy spectacles."
            ),
            key_props=[
                "blocky wooden 'LUNCH TIME' plaque",
                "pixelated beige bank passbook",
                "muddy steel tiffin box",
                "three-blade PS1 ceiling fan",
            ],
            tone_tags=["deadpan", "surreal", "ps1-1998", "indian-office"],
        ),
        "storyboard": StoryboardSpec(
            title="LUNCH BREAK KA PORTAL",
            frames=[
                StoryboardFrame(
                    frame_number=1,
                    position="Top Left",
                    camera_framing="Static over-the-shoulder shot",
                    visual_description=(
                        "Blocky man with a flat cardboard file standing at Counter 4 of a dim, "
                        "muddy-green 1998 PS1 bank hall as the wall clock reads 1:59."
                    ),
                    hinglish_caption="1:59 baje counter par number aaya.",
                ),
                StoryboardFrame(
                    frame_number=2,
                    position="Top Center",
                    camera_framing="Medium front shot",
                    visual_description=(
                        "Stiff low-poly bank clerk rigidly slams a blocky wooden 'LUNCH TIME' "
                        "plaque onto the desk with jagged polygon hands."
                    ),
                    hinglish_caption="2 baje lunch board lag gaya.",
                ),
                StoryboardFrame(
                    frame_number=3,
                    position="Top Right",
                    camera_framing="Extreme jagged close-up",
                    visual_description=(
                        "Close-up of the customer's rectangular leather chappals sinking halfway "
                        "into the blurry beige checkerboard floor tiles."
                    ),
                    hinglish_caption="Floor ka collision off ho gaya.",
                ),
                StoryboardFrame(
                    frame_number=4,
                    position="Bottom Left",
                    camera_framing="Wide lobby shot",
                    visual_description=(
                        "The entire queue of angular customers clips waist-deep through the bank "
                        "floor in rigid upright poses while clutching low-poly passbooks."
                    ),
                    hinglish_caption="Poori line zameen mein dhans gayi.",
                ),
                StoryboardFrame(
                    frame_number=5,
                    position="Bottom Center",
                    camera_framing="Low-angle upward shot",
                    visual_description=(
                        "The customer drops out of the grey void below and snaps directly onto the "
                        "ceiling rod in a stiff horizontal T-pose."
                    ),
                    hinglish_caption="Seedha chhat par respawn ho gaya.",
                ),
                StoryboardFrame(
                    frame_number=6,
                    position="Bottom Right",
                    camera_framing="Absurd wide shot of bank hall",
                    visual_description=(
                        "The customer spins slowly like a ceiling fan above Counter 4 while the "
                        "clerk calmly opens a low-poly steel tiffin box below."
                    ),
                    hinglish_caption="Ab 3 baje ke baad neeche aana.",
                ),
            ],
        ),
        "video": VideoScriptSpec(
            title="LUNCH BREAK KA PORTAL",
            shots=[
                VideoShot(
                    shot_number=1,
                    time_window="0:00–0:03",
                    transition="",
                    visual_action=(
                        "Static PS1 shot of blocky customer stepping rigidly up to Counter 4 "
                        "holding a flat cardboard file under flickering muddy fluorescent lights."
                    ),
                    retro_sfx="Retro clock tick and stiff footstep thud",
                    hindi_dialogue="एक बजकर उनसठ मिनट पर नंबर आया।",
                ),
                VideoShot(
                    shot_number=2,
                    time_window="0:03–0:07",
                    transition="Hard cut to",
                    visual_action=(
                        "Clerk jerks in low-FPS motion and slams a jagged wooden 'LUNCH TIME' "
                        "sign onto the counter with zero facial expression."
                    ),
                    retro_sfx="Loud 1998 wooden slam and PS1 power-down blip",
                    hindi_dialogue="दो बजते ही लंच बोर्ड लग गया।",
                ),
                VideoShot(
                    shot_number=3,
                    time_window="0:07–0:10",
                    transition="",
                    visual_action=(
                        "Jagged close-up of the customer's boxy shoes glitching and sinking "
                        "straight through the pixelated beige floor tiles."
                    ),
                    retro_sfx="Glitchy 16-bit clip buzz",
                    hindi_dialogue="फर्श का कोलिजन बंद हो गया।",
                ),
                VideoShot(
                    shot_number=4,
                    time_window="0:10–0:14",
                    transition="Hard cut to",
                    visual_action=(
                        "Wide shot of the customer falling rigidly downward through the lobby "
                        "floor without bending his knees while still holding his passbook."
                    ),
                    retro_sfx="Falling PS1 synth whistle",
                    hindi_dialogue="सुरेश सीधे ज़मीन के पार चला गया।",
                ),
                VideoShot(
                    shot_number=5,
                    time_window="0:14–0:17",
                    transition="Hard cut to",
                    visual_action=(
                        "Upward shot as Suresh snaps abruptly onto the ceiling mount in a stiff "
                        "T-pose and begins rotating in jerky 10fps increments."
                    ),
                    retro_sfx="Squeaky metal fan click and hum",
                    hindi_dialogue="और ऊपर छत पर रीस्पॉन हो गया।",
                ),
                VideoShot(
                    shot_number=6,
                    time_window="0:17–0:20",
                    transition="Sudden whip-pan to",
                    visual_action=(
                        "Wide absurd shot of Suresh spinning steadily as the ceiling fan while "
                        "the clerk calmly eats low-poly dal-chawal from a steel tiffin."
                    ),
                    retro_sfx="Compressed PS1 bass drop, instant hard cut to black",
                    hindi_dialogue="क्लर्क बोला, तीन बजे के बाद आना।",
                ),
            ],
        ),
    },
]


class MockLLMProvider(BaseLLMProvider):
    """Offline mock provider returning playbook-compliant structured JSON."""

    provider_name = "mock"

    def __init__(self, model: str = "mock-ps1-v1", max_retries: int = 0) -> None:
        super().__init__(model=model, max_retries=max_retries)

    def _pick_scenario(self, user_prompt: str) -> dict:
        lowered = user_prompt.lower()
        if "bank" in lowered or "lunch" in lowered or "sbi" in lowered:
            return _MOCK_SCENARIOS[1]
        if "chai" in lowered or "qr" in lowered or "upi" in lowered:
            return _MOCK_SCENARIOS[0]
        digest = int(hashlib.sha256(user_prompt.encode("utf-8")).hexdigest(), 16)
        return _MOCK_SCENARIOS[digest % len(_MOCK_SCENARIOS)]

    async def _complete_json(self, system_prompt: str, user_prompt: str) -> str:
        # Not used directly because generate_structured handles typed dispatch cleanly.
        return "{}"

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: type[T],
    ) -> T:
        scenario = self._pick_scenario(user_prompt)

        if response_model is IdeaBatch:
            # Support multi-idea requests cleanly
            count = 1
            for line in user_prompt.splitlines():
                if line.startswith("COUNT:"):
                    try:
                        count = max(1, min(5, int(line.split(":", 1)[1].strip())))
                    except ValueError:
                        count = 1
            ideas = [
                _MOCK_SCENARIOS[(i + _MOCK_SCENARIOS.index(scenario)) % len(_MOCK_SCENARIOS)]["idea"]
                for i in range(count)
            ]
            return response_model.model_validate({"ideas": [item.model_dump() for item in ideas]})

        if response_model is StoryboardSpec:
            return response_model.model_validate(scenario["storyboard"].model_dump())

        if response_model is VideoScriptSpec:
            return response_model.model_validate(scenario["video"].model_dump())

        raise ValueError(f"MockLLMProvider does not support schema {response_model.__name__}")
