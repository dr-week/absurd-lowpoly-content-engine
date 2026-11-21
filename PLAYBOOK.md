# Absurd Low-Poly Content Engine — Playbook

The canonical ruleset for generating 1998 PS1 / N64 ultra low-poly absurdist Hindi/Hinglish storyboards and 20-second vertical video prompts.

---

## 0. Output Rule (Strict Text-Only — No Images)

* **Always output text only:** Generate only the **6-frame 3x2 Storyboard Prompt** and the **20s 9:16 Video Prompt with Hindi Script**.
* **Strictly NO image or video generation:** Never generate, render, or attach images unless the user explicitly overrides this rule.

---

## 1. Visual Style (Strict 1998 PS1 / N64 Aesthetic)

To get the exact low-effort, gritty retro 3D look instead of smooth CGI or 2D cartoons, always enforce these traits:

* **Geometry:** Raw, unpolished late-90s 3D game meshes, sharp visible polygons, boxy/angular limbs, stiff awkward character poses.
* **Textures & Shading:** Blurry, low-resolution pixelated bitmap textures stretched over blocky geometry, crude vertex/Gouraud shading, jagged aliased edges, and muddy retro colors.
* **Negative Constraints (Always Exclude):** No 2D cartoon art, no comic ink outlines, no cel-shading, and no smooth modern CGI.

---

## 2. Idea Formula (The "Zepto Standard" — High-Voltage Modern Indian Absurdity)

Every concept must match the intensity of the **"Late Night 10-Minute Zepto Delivery"** benchmark. 

### The 4 Mandatory Pillars:
1. **Hyper-Modern Urban Hook (No Boomer Tropes):** Must revolve around modern Indian obsessions—10-minute quick commerce (Zepto/Blinkit), Cab cancellation standoffs (Ola/Uber), Gym protein culture, UPI payment soundbox addiction, iPhone EMI desperation, Co-working space cold wars.
2. **Trivial Cause -> Catastrophic Destruction:** Ordering a ₹14 Maggi or asking for an AC cab leads to **sudden, violent, catastrophic property destruction** in raw 3D PS1 physics (scooters flying through 9th-floor balconies, metro trains derailing into bedrooms, roads splitting in half).
3. **High-Speed Aggression (Zero Fluff):** No slow build-ups or peaceful tea sips. The jolt hits fast, hard, and loud within 3 seconds.
4. **Petty Transactional Payoff:** In the middle of total destruction, the character only cares about a **hyper-specific trivial Indian detail** (e.g. asking for OTP, demanding a 5-star rating, insisting on ₹2 cash change, checking if the packet leaked).

### STRICT BANLIST (Instant Reject):
- **NO Boomer / Tame Domestic Tropes:** No boiling milk, no pressure cooker dal, no drying clothes on terrace, no TV remote fights, no society uncle maintenance jokes, no talking lizards/geckos.
- **NO Cute / Gentle Humor:** If there is no violent physical disruption or extreme shock value, the idea is rejected.
- **NO Video Game Tropes:** No health bars, cheat codes, or characters knowing they are in 3D.


---

## 3. Storyboard Prompt Structure (6-Frame 3x2 Grid)

When prompting for a storyboard grid, structure it like this:

1. **Global Setup:** Specify a 3x2 grid layout on a plain dark background, retro PS1/N64 low-poly style, negative constraints (no 2D/ink/smooth CGI), a title at the top, and a short retro pixel-font Hinglish caption under each frame.
2. **Per-Frame Breakdown (Frames 1–6):** Give camera framing/location, low-poly character/prop action, visual absurdity, and a short Hinglish caption.

---

## 4. Video Prompt Structure (20s, 9:16 Vertical) — The Attention-Wave Formula

To keep short-form retention pinned and prevent drop-off, every 20-second script follows the **Attention-Wave (Sine-Wave Rhythm)**:
* As soon as a shot feels mundane or familiar, **an abrupt unexpected jolt hits before the viewer's attention dips**.
* Rhythm alternates: **Mundane Hook -> Micro-Twist -> Normal Escalation -> Unhinged Shock -> Deadpan Snap-Back**.

### The 6-Beat Attention-Wave Timing:
1. **`[0:00–0:03]` Beat 1 (Mundane Hook):** Everyday slice-of-life action that looks completely normal (waiting for OTP, pouring chai, bargaining, tightening a screw).
2. **`[0:03–0:07]` Beat 2 (First Micro-Jolt):** Just as the viewer thinks they know what's happening, a sudden bizarre visual surprise hits (the screw tightens the entire room, the chai boils downward).
3. **`[0:07–0:10]` Beat 3 (Temporary False Normalcy):** The character reacts with deadpan calm, normalizing the weirdness to lull the viewer into false security.
4. **`[0:10–0:14]` Beat 4 (Massive Escalation Wave):** Sudden hard cut to a bigger, completely unexpected chain-reaction affecting the environment.
5. **`[0:14–0:17]` Beat 5 (Pre-Twist Suspense Wave):** A tight, awkward pause where the tension peaks.
6. **`[0:17–0:20]` Beat 6 (The Unhinged Snap-Back Payoff):** Sudden snap-zoom to a ridiculous, trivial everyday Indian punchline delivered with zero emotion, ending with an instant hard cut to black.

---

## Quick Copy-Paste Templates

### Storyboard Template

```text
Create a storyboard of six frames in a 3x2 grid layout on a plain dark background, rendered strictly in authentic 1998 PlayStation 1 (PS1) and Nintendo 64 (N64) ultra low-poly 3D video game graphics. Every panel must look like raw, unpolished late-90s 3D game screenshots: extremely angular faceted polygon meshes with visible sharp edges, blurry pixelated low-resolution bitmap textures stretched over blocky geometry, stiff awkward character poses, crude vertex/Gouraud shading, jagged aliased edges, and muddy retro colors. Strictly NO 2D cartoon art, NO comic ink outlines, NO cel-shading, and NO smooth modern CGI. Place a short, bold retro pixel-font Hinglish caption underneath each panel. Title at top: "[TITLE]".

Frame 1 (Top Left): [Framing]. [Setup scene & character].
Caption: "[Short Hinglish line 1]"

Frame 2 (Top Center): [Framing]. [Action/escalation].
Caption: "[Short Hinglish line 2]"

Frame 3 (Top Right): [Close-up framing]. [Weird shift/detail].
Caption: "[Short Hinglish line 3]"

Frame 4 (Bottom Left): [Framing]. [Consequence in environment].
Caption: "[Short Hinglish line 4]"

Frame 5 (Bottom Center): [Framing]. [Build-up right before twist].
Caption: "[Short Hinglish line 5]"

Frame 6 (Bottom Right): [Absurd wide/close framing]. [Surprising absurd payoff].
Caption: "[Short Hinglish line 6]"
```

### Video Prompt Template

```text
Create a 20-second, 9:16 vertical absurdist comedy video rendered strictly in authentic 1998 PlayStation 1 (PS1) and Nintendo 64 (N64) ultra low-poly 3D video game graphics. Maintain extremely angular faceted polygon meshes, blurry pixelated low-resolution bitmap textures, stiff robotic character animations with jerky low-FPS movement, crude vertex/Gouraud shading, jagged aliased edges, and muddy retro colors throughout. Strictly NO smooth modern CGI, NO 2D cartoon art, and NO comic ink outlines. Audio features a deadpan, serious Indian male narrator speaking ultra-short Hindi lines matched tightly to each shot, paired with retro PS1 sound effects and sharp hard cuts.

[0:00–0:03] Shot 1: [Scene + jerky action]. SFX: [Retro SFX].
Hindi Dialogue: "[Short Hindi line]"

[0:03–0:07] Shot 2: Hard cut to [scene + action]. SFX: [Retro SFX].
Hindi Dialogue: "[Short Hindi line]"

[0:07–0:10] Shot 3: [Close-up/shift + action]. SFX: [Retro SFX].
Hindi Dialogue: "[Short Hindi line]"

[0:10–0:14] Shot 4: Hard cut to [escalation + action]. SFX: [Retro SFX].
Hindi Dialogue: "[Short Hindi line]"

[0:14–0:17] Shot 5: Hard cut to [build-up beat]. SFX: [Retro SFX].
Hindi Dialogue: "[Short Hindi line]"

[0:17–0:20] Shot 6: Sudden [whip-pan/snap-in] to [absurd payoff]. SFX: [Bass drop/hit], instant hard cut to black.
Hindi Dialogue: "[Short Hindi line]"
```
