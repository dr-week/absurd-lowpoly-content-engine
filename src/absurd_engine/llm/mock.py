"""Deterministic offline mock provider for instant testing without API keys."""

from __future__ import annotations

import hashlib
from typing import TypeVar

from pydantic import BaseModel

from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.schemas import (
    FusedEpisodeDraft,
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
            mechanic="gravity_debit",
            mundane_anchor="A tired office worker paying ₹12 via UPI at a roadside chai tapri.",
            broken_logic_pivot=(
                "The faded laminated QR sticker fails to scan; when he tilts his phone 15 degrees, "
                "the payment app deducts 9.8 m/s² of local gravity instead of ₹12."
            ),
            deadpan_payoff=(
                "The entire chai tapri, kettle, and plastic stools float rigidly into grey fog "
                "while the chaiwala calmly hands him a floating cutting chai and asks for ₹2 extra for parcel."
            ),
            protagonist=(
                "Indian office man in a light-blue half-sleeve shirt, brown trousers, and leather chappals."
            ),
            key_props=[
                "faded laminated UPI QR standee",
                "brick-shaped smartphone",
                "aluminum chai kettle",
                "red plastic stool",
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
                        "Office man in a blue shirt stands at a roadside chai tapri, "
                        "pointing a brick-like phone at a faded laminated QR standee."
                    ),
                    hinglish_caption="12 rupaye ka chai, QR scan nahi ho raha.",
                ),
                StoryboardFrame(
                    frame_number=2,
                    position="Top Center",
                    camera_framing="Medium side angle",
                    visual_description=(
                        "Office man tilts his torso 45 degrees rigidly while the chaiwala "
                        "stares straight ahead without blinking."
                    ),
                    hinglish_caption="Angle thoda tedha kiya, beep baj gaya.",
                ),
                StoryboardFrame(
                    frame_number=3,
                    position="Top Right",
                    camera_framing="Extreme close-up",
                    visual_description=(
                        "Smartphone screen displays a crude green checkmark and bold text "
                        "'PAID: 9.8 m/s2 GRAVITY'."
                    ),
                    hinglish_caption="Paise ki jagah gravity kat gayi.",
                ),
                StoryboardFrame(
                    frame_number=4,
                    position="Bottom Left",
                    camera_framing="Low-angle wide shot",
                    visual_description=(
                        "The wooden tapri stall, aluminum kettle, and red plastic stools detach "
                        "from the cracked footpath and hover two feet in the air."
                    ),
                    hinglish_caption="Poora tapri hawa mein atak gaya.",
                ),
                StoryboardFrame(
                    frame_number=5,
                    position="Bottom Center",
                    camera_framing="Medium shot",
                    visual_description=(
                        "Office man floats horizontally like a rigid statue beside a hovering glass "
                        "of cutting chai while traffic drives underneath unbothered."
                    ),
                    hinglish_caption="Chaiwala bilkul normal khada hai.",
                ),
                StoryboardFrame(
                    frame_number=6,
                    position="Bottom Right",
                    camera_framing="Absurd wide shot into grey distance fog",
                    visual_description=(
                        "Tapri drifts high into thick grey draw-distance fog as the chaiwala "
                        "extends one hand demanding two extra rupees for air parcel."
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
                        "Wide static shot of office man Ramesh aiming his brick phone at a faded "
                        "UPI QR standee at a roadside chai tapri in jerky 12fps motion."
                    ),
                    retro_sfx="Low-bit menu error buzz and distant street hum",
                    hindi_dialogue="रमेश ने बारह रुपये की चाय पी।",
                ),
                VideoShot(
                    shot_number=2,
                    time_window="0:03–0:07",
                    transition="Hard cut to",
                    visual_action=(
                        "Side angle as Ramesh bends his waist sideways and snaps his phone toward "
                        "the QR code with robotic twitching."
                    ),
                    retro_sfx="Sharp 1998 scanner chime and crunchy coin beep",
                    hindi_dialogue="थोड़ा टेढ़ा किया, और पेमेंट हो गई।",
                ),
                VideoShot(
                    shot_number=3,
                    time_window="0:07–0:10",
                    transition="",
                    visual_action=(
                        "Close-up of the phone screen flashing a crude green tick reading "
                        "'GRAVITY DEBITED: 9.8'."
                    ),
                    retro_sfx="Retro confirmation jingle pitched slightly down",
                    hindi_dialogue="पैसे नहीं कटे। गुरुत्वाकर्षण कट गया।",
                ),
                VideoShot(
                    shot_number=4,
                    time_window="0:10–0:14",
                    transition="Hard cut to",
                    visual_action=(
                        "Low-angle shot of the wooden chai tapri, aluminum kettle, and plastic "
                        "stools rising straight off the pavement with zero rotation."
                    ),
                    retro_sfx="Heavy low-fi elevator drone and tin clank",
                    hindi_dialogue="पूरी टपरी हवा में ऊपर चली गई।",
                ),
                VideoShot(
                    shot_number=5,
                    time_window="0:14–0:17",
                    transition="Hard cut to",
                    visual_action=(
                        "Medium shot of Ramesh floating rigidly sideways beside a hovering glass "
                        "of cutting chai while the chaiwala slides smoothly beside him."
                    ),
                    retro_sfx="Hollow wind loop and awkward glass clink",
                    hindi_dialogue="चायवाले को कोई फर्क नहीं पड़ा।",
                ),
                VideoShot(
                    shot_number=6,
                    time_window="0:17–0:20",
                    transition="Sudden whip-pan to",
                    visual_action=(
                        "Absurd wide shot of the tapri disappearing into thick grey draw-distance "
                        "fog as the chaiwala holds up two fingers."
                    ),
                    retro_sfx="Compressed bass hit, instant hard cut to black",
                    hindi_dialogue="बोला, हवा पार्सल के दो रुपये अलग।",
                ),
            ],
        ),
    },
    {
        "idea": PremiseIdea(
            title="LUNCH BREAK KA PORTAL",
            mechanic="t_pose_clipping",
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
                "Indian man holding a flat cardboard file folder, wearing a checkered half-sleeve "
                "shirt and thick spectacles."
            ),
            key_props=[
                "wooden 'LUNCH TIME' plaque",
                "beige bank passbook",
                "steel tiffin box",
                "three-blade ceiling fan",
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
                        "Customer with a cardboard file stands at Counter 4 of a dim green-walled "
                        "government bank hall while the wall clock reads 1:59."
                    ),
                    hinglish_caption="1:59 baje counter par number aaya.",
                ),
                StoryboardFrame(
                    frame_number=2,
                    position="Top Center",
                    camera_framing="Medium front shot",
                    visual_description=(
                        "Bank clerk slams a wooden 'LUNCH TIME' plaque onto the counter with a "
                        "blank expression."
                    ),
                    hinglish_caption="2 baje lunch board lag gaya.",
                ),
                StoryboardFrame(
                    frame_number=3,
                    position="Top Right",
                    camera_framing="Extreme close-up",
                    visual_description=(
                        "Customer's leather chappals sink halfway into the beige checkerboard "
                        "floor tiles."
                    ),
                    hinglish_caption="Floor ka collision off ho gaya.",
                ),
                StoryboardFrame(
                    frame_number=4,
                    position="Bottom Left",
                    camera_framing="Wide lobby shot",
                    visual_description=(
                        "The entire queue of customers clips waist-deep through the bank floor "
                        "in rigid upright poses while clutching passbooks."
                    ),
                    hinglish_caption="Poori line zameen mein dhans gayi.",
                ),
                StoryboardFrame(
                    frame_number=5,
                    position="Bottom Center",
                    camera_framing="Low-angle upward shot",
                    visual_description=(
                        "Customer drops out of the grey void below and snaps directly onto the "
                        "ceiling rod in a horizontal T-pose."
                    ),
                    hinglish_caption="Seedha chhat par respawn ho gaya.",
                ),
                StoryboardFrame(
                    frame_number=6,
                    position="Bottom Right",
                    camera_framing="Absurd wide shot of bank hall",
                    visual_description=(
                        "Customer spins slowly like a ceiling fan above Counter 4 while the clerk "
                        "calmly opens a steel tiffin box below."
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
                        "Static shot of customer Suresh stepping rigidly up to Counter 4 holding "
                        "a cardboard file under flickering fluorescent lights."
                    ),
                    retro_sfx="Retro clock tick and stiff footstep thud",
                    hindi_dialogue="एक बजकर उनसठ मिनट पर नंबर आया।",
                ),
                VideoShot(
                    shot_number=2,
                    time_window="0:03–0:07",
                    transition="Hard cut to",
                    visual_action=(
                        "Clerk jerks forward and slams a wooden 'LUNCH TIME' sign onto the "
                        "counter with zero facial expression."
                    ),
                    retro_sfx="Loud wooden slam and power-down blip",
                    hindi_dialogue="दो बजते ही लंच बोर्ड लग गया।",
                ),
                VideoShot(
                    shot_number=3,
                    time_window="0:07–0:10",
                    transition="",
                    visual_action=(
                        "Close-up of Suresh's leather chappals glitching and sinking straight "
                        "through the beige floor tiles."
                    ),
                    retro_sfx="Glitchy 16-bit clip buzz",
                    hindi_dialogue="फर्श का कोलिजन बंद हो गया।",
                ),
                VideoShot(
                    shot_number=4,
                    time_window="0:10–0:14",
                    transition="Hard cut to",
                    visual_action=(
                        "Wide shot of Suresh falling straight down through the lobby floor "
                        "without bending his knees while still holding his passbook."
                    ),
                    retro_sfx="Falling synth whistle",
                    hindi_dialogue="सुरेश सीधे ज़मीन के पार चला गया।",
                ),
                VideoShot(
                    shot_number=5,
                    time_window="0:14–0:17",
                    transition="Hard cut to",
                    visual_action=(
                        "Upward shot as Suresh snaps abruptly onto the ceiling mount in a T-pose "
                        "and begins rotating in jerky 10fps increments."
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
                        "the clerk calmly eats dal-chawal from a steel tiffin."
                    ),
                    retro_sfx="Compressed bass drop, instant hard cut to black",
                    hindi_dialogue="क्लर्क बोला, तीन बजे के बाद आना।",
                ),
            ],
        ),
    },
    {
        "idea": PremiseIdea(
            title="FAN MASK NE SKYBOX KHEENCH LIYA",
            mechanic="draw_distance_fog",
            mundane_anchor="A commuter testing a fan-powered anti-pollution mask at a foggy traffic signal.",
            broken_logic_pivot=(
                "He clicks the mask fan to Speed 3 and accidentally inhales the entire city's "
                "render distance and skybox, turning the busy roundabout into a blank grey void."
            ),
            deadpan_payoff=(
                "Traffic cops calmly hand him a ₹500 challan for removing the city's background "
                "while cars drive through empty grey nothingness."
            ),
            protagonist=(
                "Scooter commuter in a brown puffer jacket, helmet, and bulky fan-powered face mask."
            ),
            key_props=[
                "fan-powered filter mask with dial",
                "scooter at red signal",
                "traffic police challan pad",
                "vanishing city skyline",
            ],
            tone_tags=["deadpan", "surreal", "ps1-1998", "city-aqi"],
        ),
        "storyboard": StoryboardSpec(
            title="FAN MASK NE SKYBOX KHEENCH LIYA",
            frames=[
                StoryboardFrame(
                    frame_number=1,
                    position="Top Left",
                    camera_framing="Wide static traffic shot",
                    visual_description=(
                        "Scooter commuter in a brown jacket waits at a foggy traffic signal wearing "
                        "a bulky fan-powered filter mask."
                    ),
                    hinglish_caption="AQI 400 tha, fan mask pehna.",
                ),
                StoryboardFrame(
                    frame_number=2,
                    position="Top Center",
                    camera_framing="Close-up on mask dial",
                    visual_description=(
                        "Gloved thumb clicks the mask's fan dial from 1 straight to 'MAX 3'."
                    ),
                    hinglish_caption="Speed teen par daal diya.",
                ),
                StoryboardFrame(
                    frame_number=3,
                    position="Top Right",
                    camera_framing="Medium front shot",
                    visual_description=(
                        "Thick grey smog streams straight into the mask fan like a vacuum, "
                        "pulling distant flyovers and trees with it."
                    ),
                    hinglish_caption="Dhuaan ke saath flyover bhi gaya.",
                ),
                StoryboardFrame(
                    frame_number=4,
                    position="Bottom Left",
                    camera_framing="Wide street shot",
                    visual_description=(
                        "Every building behind the traffic light pops out of existence, leaving "
                        "only flat grey void and floating red signal lights."
                    ),
                    hinglish_caption="Poora city background delete ho gaya.",
                ),
                StoryboardFrame(
                    frame_number=5,
                    position="Bottom Center",
                    camera_framing="Medium side shot",
                    visual_description=(
                        "Commuter sits calmly on his scooter in the empty void while his mask "
                        "bulges slightly and hums quietly."
                    ),
                    hinglish_caption="Ab hawa bilkul saaf hai.",
                ),
                StoryboardFrame(
                    frame_number=6,
                    position="Bottom Right",
                    camera_framing="Absurd two-shot in blank grey void",
                    visual_description=(
                        "A traffic cop marches out of the grey nothingness and hands him a yellow "
                        "challan slip for stealing the city skyline."
                    ),
                    hinglish_caption="Background chori ka 500 challan.",
                ),
            ],
        ),
        "video": VideoScriptSpec(
            title="FAN MASK NE SKYBOX KHEENCH LIYA",
            shots=[
                VideoShot(
                    shot_number=1,
                    time_window="0:00–0:03",
                    transition="",
                    visual_action=(
                        "Static shot of commuter Vivek on a scooter at a foggy city intersection, "
                        "wearing a bulky fan-powered pollution mask."
                    ),
                    retro_sfx="Distant traffic horns and tiny fan whirr",
                    hindi_dialogue="सुबह विवेक ने फैन मास्क पहना।",
                ),
                VideoShot(
                    shot_number=2,
                    time_window="0:03–0:07",
                    transition="Hard cut to",
                    visual_action=(
                        "Close-up as Vivek's stiff thumb snaps the mask dial to Speed 3 with a "
                        "jerky click."
                    ),
                    retro_sfx="Sharp plastic switch click and rising turbine hum",
                    hindi_dialogue="उसने स्पीड तीन पर घुमा दिया।",
                ),
                VideoShot(
                    shot_number=3,
                    time_window="0:07–0:10",
                    transition="",
                    visual_action=(
                        "Front shot as thick grey smog and distant concrete flyovers bend and "
                        "get sucked straight into the small mask fan."
                    ),
                    retro_sfx="Heavy retro vacuum suction roar",
                    hindi_dialogue="धुएं के साथ पूरा फ्लाईओवर खिंच गया।",
                ),
                VideoShot(
                    shot_number=4,
                    time_window="0:10–0:14",
                    transition="Hard cut to",
                    visual_action=(
                        "Wide shot of Connaught Place vanishing in two frames, leaving only a "
                        "flat grey void and one floating red traffic light."
                    ),
                    retro_sfx="Hollow void drone and two pop-out blips",
                    hindi_dialogue="शहर का पूरा बैकग्राउंड गायब हो गया।",
                ),
                VideoShot(
                    shot_number=5,
                    time_window="0:14–0:17",
                    transition="Hard cut to",
                    visual_action=(
                        "Medium shot of Vivek nodding once in satisfaction on his scooter while "
                        "cars glide silently across empty nothingness."
                    ),
                    retro_sfx="Quiet gentle fan hum",
                    hindi_dialogue="विवेक बोला, अब हवा साफ़ है।",
                ),
                VideoShot(
                    shot_number=6,
                    time_window="0:17–0:20",
                    transition="Sudden whip-pan to",
                    visual_action=(
                        "Traffic cop stepping out of the blank grey void and stiffly tearing off "
                        "a yellow challan slip."
                    ),
                    retro_sfx="Compressed bass hit, instant hard cut to black",
                    hindi_dialogue="पुलिस बोली, स्काईबॉक्स चोरी का चालान।",
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
        filtered = "\n".join(
            line for line in user_prompt.splitlines() if not line.startswith("DO NOT REPEAT")
        )
        lowered = filtered.lower()
        if "bank" in lowered or "lunch" in lowered or "sbi" in lowered:
            return _MOCK_SCENARIOS[1]
        if "chai" in lowered or "qr" in lowered or "upi" in lowered:
            return _MOCK_SCENARIOS[0]
        if "aqi" in lowered or "mask" in lowered:
            return _MOCK_SCENARIOS[2]
        if "t_pose_clipping" in lowered:
            return _MOCK_SCENARIOS[1]
        if "gravity_debit" in lowered:
            return _MOCK_SCENARIOS[0]
        if "draw_distance_fog" in lowered:
            return _MOCK_SCENARIOS[2]
        digest = int(hashlib.sha256(filtered.encode("utf-8")).hexdigest(), 16)
        return _MOCK_SCENARIOS[digest % len(_MOCK_SCENARIOS)]

    async def _complete_json(self, system_prompt: str, user_prompt: str) -> str:
        return "{}"

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: type[T],
    ) -> T:
        scenario = self._pick_scenario(user_prompt)

        if response_model is FusedEpisodeDraft:
            return response_model.model_validate(
                {
                    "idea": scenario["idea"].model_dump(),
                    "storyboard": scenario["storyboard"].model_dump(),
                    "video": scenario["video"].model_dump(),
                }
            )

        if response_model is IdeaBatch:
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
