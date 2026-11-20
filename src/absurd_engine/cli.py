"""Typer + Rich CLI for generating PS1/N64 absurdist ideas, storyboards, and 20s video prompts."""

from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Optional

import typer
import uvicorn
from rich.console import Console
from rich.panel import Panel

from absurd_engine.config import EngineSettings, ProviderName
from absurd_engine.exporter import export_episode
from absurd_engine.generators import generate_episode, generate_ideas
from absurd_engine.llm import create_provider
from absurd_engine.schemas import IdeaRequest

app = typer.Typer(
    name="absurd",
    help="1998 PS1/N64 Low-Poly Absurdist Content Engine (Ideas, Storyboards, 20s Video Prompts).",
    no_args_is_help=True,
)
console = Console()


def _build_settings(
    provider: Optional[ProviderName] = None,
    model: Optional[str] = None,
    output_dir: Optional[Path] = None,
) -> EngineSettings:
    base = EngineSettings()
    updates: dict = {}
    if provider is not None:
        updates["llm_provider"] = provider
    if model is not None:
        updates["llm_model"] = model
    if output_dir is not None:
        updates["output_dir"] = output_dir
    return base.model_copy(update=updates) if updates else base


@app.command()
def idea(
    topic: Optional[str] = typer.Option(None, "--topic", "-t", help="Seed topic or mundane moment."),
    setting: Optional[str] = typer.Option(None, "--setting", "-s", help="Indian setting hint."),
    news: Optional[str] = typer.Option(None, "--news", "-n", help="Recent news/trending hook."),
    count: int = typer.Option(1, "--count", "-c", min=1, max=5, help="Number of premises."),
    provider: Optional[ProviderName] = typer.Option(None, "--provider", "-p"),
    model: Optional[str] = typer.Option(None, "--model", "-m"),
) -> None:
    """Generate surreal, anti-cliché Indian PS1 comedy premises."""
    cfg = _build_settings(provider=provider, model=model)
    llm = create_provider(cfg)
    ideas = asyncio.run(
        generate_ideas(
            llm,
            IdeaRequest(seed_topic=topic, setting_hint=setting, news_hook=news, count=count),
        )
    )
    for idx, item in enumerate(ideas, start=1):
        body = (
            f"[bold]Anchor:[/bold] {item.mundane_anchor}\n"
            f"[bold]Broken Logic:[/bold] {item.broken_logic_pivot}\n"
            f"[bold]Deadpan Payoff:[/bold] {item.deadpan_payoff}\n"
            f"[bold]Protagonist:[/bold] {item.protagonist}\n"
            f"[bold]Props:[/bold] {', '.join(item.key_props)}"
        )
        console.print(Panel(body, title=f"Idea {idx}: {item.title}", border_style="cyan"))


@app.command()
def generate(
    topic: Optional[str] = typer.Option(None, "--topic", "-t", help="Seed topic or mundane moment."),
    setting: Optional[str] = typer.Option(None, "--setting", "-s", help="Indian setting hint."),
    news: Optional[str] = typer.Option(None, "--news", "-n", help="Recent news/trending hook."),
    save: bool = typer.Option(True, "--save/--no-save", help="Export episode bundle to output dir."),
    output_dir: Optional[Path] = typer.Option(None, "--out", "-o", help="Export directory."),
    provider: Optional[ProviderName] = typer.Option(None, "--provider", "-p"),
    model: Optional[str] = typer.Option(None, "--model", "-m"),
) -> None:
    """Run full pipeline: Idea -> 6-Frame Storyboard Prompt -> 20s Video Prompt -> Playbook Lint."""
    cfg = _build_settings(provider=provider, model=model, output_dir=output_dir)
    llm = create_provider(cfg)
    bundle = asyncio.run(
        generate_episode(
            llm,
            idea_request=IdeaRequest(seed_topic=topic, setting_hint=setting, news_hook=news, count=1),
        )
    )

    console.print(
        Panel(
            bundle.storyboard.rendered_prompt,
            title=f"6-Frame 3x2 Storyboard Prompt — {bundle.idea.title}",
            border_style="magenta",
        )
    )
    console.print(
        Panel(
            bundle.video.rendered_prompt,
            title=f"20s 9:16 Video Prompt — {bundle.idea.title}",
            border_style="green",
        )
    )

    status = "[bold green]PASS[/bold green]" if bundle.lint.passed else "[bold red]FAIL[/bold red]"
    console.print(f"Playbook Lint: {status} (Score: {bundle.lint.score}/100)")
    for issue in bundle.lint.issues:
        color = "red" if issue.severity == "error" else "yellow"
        console.print(f"  [{color}][{issue.severity.upper()}][/{color}] {issue.code}: {issue.message}")

    if save:
        saved_dir = export_episode(bundle, cfg.output_dir)
        console.print(f"\n[bold cyan]Exported episode files to:[/bold cyan] {saved_dir}")


@app.command()
def serve(
    host: str = typer.Option("0.0.0.0", "--host"),
    port: int = typer.Option(8000, "--port"),
    reload: bool = typer.Option(False, "--reload"),
) -> None:
    """Start the FastAPI backend server."""
    uvicorn.run("absurd_engine.api:app", host=host, port=port, reload=reload)


if __name__ == "__main__":
    app()
