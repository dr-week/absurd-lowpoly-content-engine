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

## 2. Idea Formula (Surreal & Unpredictable)

Skip neat "jugaad/hack" setups or obvious talking-object jokes when they feel too predictable. Instead:

* Anchor the premise in a **mundane moment, Indian setting, or recent news/trending hook**.
* Pivot into **broken logic, strange cause-and-effect, or disorienting physical absurdity**.
* Keep the payoff visual, deadpan, and unexpected.

---

## 3. Storyboard Prompt Structure (6-Frame 3x2 Grid)

When prompting for a storyboard grid, structure it like this:

1. **Global Setup:** Specify a 3x2 grid layout on a plain dark background, retro PS1/N64 low-poly style, negative constraints (no 2D/ink/smooth CGI), a title at the top, and a short retro pixel-font Hinglish caption under each frame.
2. **Per-Frame Breakdown (Frames 1–6):** Give camera framing/location, low-poly character/prop action, visual absurdity, and a short Hinglish caption.

---

## 4. Video Prompt Structure (20s, 9:16 Vertical)

When prompting for a short vertical video:

1. **Global Style & Audio:** 20-second, 9:16 vertical absurdist comedy in raw 1998 PS1/N64 low-poly 3D with jerky low-FPS movement, sharp hard cuts between shots, retro PS1 SFX, and a **deadpan, serious Indian male narrator speaking in Hindi**.
2. **Pacing Rule:** Keep **Hindi dialogues very short** so each line fits comfortably inside its 3–4 second shot window.
3. **Shot-by-Shot Beats (`[0:00–0:03]` through `[0:17–0:20]`):** Define the camera/scene, jerky animation/visual gag, specific retro SFX, and short Hindi dialogue for every beat, ending with a hard cut on the final twist.

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
