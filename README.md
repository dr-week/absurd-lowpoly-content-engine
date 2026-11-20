# Absurd Low-Poly Content Engine

Backend script & prompt generation engine for **1998 PS1 / N64 ultra low-poly 3D** absurdist Indian comedy — built in Python with **FastAPI**, **Pydantic v2**, **Typer**, and a **provider-agnostic LLM layer**.

See [PLAYBOOK.md](PLAYBOOK.md) for the canonical visual style, idea formula, 6-frame 3x2 storyboard structure, and 20-second 9:16 vertical video prompt rules.

## What's Included (v1 — Prompt Text Generation)

1. **Absurd Idea / Premise Generator** (`absurd_engine.generators.idea_generator`)
   - Anchors in a mundane Indian setting, everyday moment, or recent news/trending hook.
   - Pivots into broken logic / disorienting physical absurdity and a deadpan visual payoff.
   - Explicitly rejects predictable "jugaad/hack" and talking-object clichés.
2. **6-Frame 3x2 Storyboard Prompt Builder** (`absurd_engine.generators.storyboard_builder`)
   - Generates structured 6-frame specs + renders the exact Playbook copy-paste prompt with strict 1998 PS1/N64 aesthetic tokens, negative constraints, title, and short Hinglish pixel-font captions.
3. **20s 9:16 Video Prompt Builder** (`absurd_engine.generators.video_builder`)
   - Generates structured 6-beat timed video scripts (`[0:00–0:03]` through `[0:17–0:20]`) with jerky low-FPS animation, retro PS1 SFX, sharp hard cuts, and ultra-short deadpan Hindi narrator dialogue.
4. **Playbook Linter** (`absurd_engine.validator`)
   - Scores every episode (0–100), enforcing PS1/N64 aesthetic tokens, negative constraints, beat timing, Hindi line word-count pacing per 3–4s window, and cliché warnings.
5. **Any-AI Provider Layer** (`absurd_engine.llm`)
   - Works out-of-the-box with `mock` (offline deterministic PS1 scenarios), plus `gemini`, `openai`, `openrouter`, `ollama` (or any OpenAI-compatible endpoint), and `anthropic`.

## Quick Start

```bash
# Install dependencies into a local venv with uv
uv sync --extra dev

# Run tests
uv run pytest

# Generate a full episode (idea -> 6-frame storyboard prompt -> 20s video prompt -> lint + export)
uv run absurd generate --topic "chai tapri QR code"

# Generate just premises
uv run absurd idea --setting "Delhi Metro" --count 2

# Start the FastAPI backend (Swagger UI at /docs)
uv run absurd serve --port 8000
```

## Switching AI Providers

Copy `.env.example` to `.env` and configure any provider:

```env
# Google Gemini
LLM_PROVIDER=gemini
LLM_MODEL=gemini-2.5-flash
LLM_API_KEY=your-key

# OpenAI / OpenRouter / Groq / Ollama
LLM_PROVIDER=openrouter
LLM_MODEL=google/gemini-2.5-flash
LLM_API_KEY=your-key

# Local Ollama (no API key needed)
LLM_PROVIDER=ollama
LLM_MODEL=llama3.1
```

## REST API Endpoints (UI-Ready)

- `GET /health` — Engine status and active LLM provider/model.
- `POST /ideas/generate` — Generate 1–5 surreal anti-cliché Indian premises.
- `POST /storyboards/generate` — Expand a `PremiseIdea` into a 6-frame 3x2 storyboard spec + rendered prompt.
- `POST /storyboards/render` — Re-render an edited `StoryboardSpec` into the canonical prompt text.
- `POST /videos/generate` — Expand a `PremiseIdea` (+ optional `StoryboardSpec`) into a 20s 9:16 video script + rendered prompt.
- `POST /videos/render` — Re-render an edited `VideoScriptSpec` into the canonical prompt text.
- `POST /episodes/generate` — Full pipeline (`idea -> storyboard -> video -> lint`) with optional disk export.
- `POST /lint` — Run the Playbook Linter on any episode bundle.
