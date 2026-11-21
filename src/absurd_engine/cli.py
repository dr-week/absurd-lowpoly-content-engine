"""Typer + Rich CLI for generating PS1/N64 absurdist ideas, storyboards, 20s video prompts, trends, and batches."""

from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Optional

import typer
import uvicorn
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from absurd_engine.benchmark import run_token_benchmark
from absurd_engine.config import EngineSettings, PipelineMode, ProviderName
from absurd_engine.exporter import export_episode
from absurd_engine.generators import generate_episode, generate_ideas
from absurd_engine.llm import create_provider
from absurd_engine.mechanics import pick_mechanic
from absurd_engine.schemas import IdeaRequest
from absurd_engine.storage import EpisodeStore
from absurd_engine.trends import fetch_india_trends

app = typer.Typer(
    name="absurd",
    help="1998 PS1/N64 Low-Poly Absurdist Content Engine (Text-Only: Ideas, 3x2 Storyboards, 20s Video Prompts).",
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
def trends(
    limit: int = typer.Option(8, "--limit", "-l", min=1, max=20, help="Number of fresh India headlines."),
) -> None:
    """Fetch live India news & offbeat trending hooks from RSS."""
    items = asyncio.run(fetch_india_trends(limit=limit))
    table = Table(title="Live India Trending Hooks")
    table.add_column("#", style="cyan", width=3)
    table.add_column("Source", style="magenta")
    table.add_column("Headline")
    for idx, item in enumerate(items, start=1):
        table.add_row(str(idx), item.source, item.title)
    console.print(table)


@app.command()
def idea(
    topic: Optional[str] = typer.Option(None, "--topic", "-t", help="Seed topic or mundane moment."),
    setting: Optional[str] = typer.Option(None, "--setting", "-s", help="Indian setting hint."),
    news: Optional[str] = typer.Option(None, "--news", "-n", help="Recent news/trending hook."),
    mechanic: Optional[str] = typer.Option(None, "--mechanic", help="PS1 broken-physics mechanic key."),
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
            IdeaRequest(
                seed_topic=topic,
                setting_hint=setting,
                news_hook=news,
                mechanic=mechanic,
                count=count,
            ),
        )
    )
    for idx, item in enumerate(ideas, start=1):
        body = (
            f"[bold]Mechanic:[/bold] {item.mechanic}\n"
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
    mechanic: Optional[str] = typer.Option(None, "--mechanic", help="PS1 broken-physics mechanic key."),
    mode: PipelineMode = typer.Option("fused", "--mode", help="Pipeline mode: fused (1 call) or modular (3 calls)."),
    auto_repair: bool = typer.Option(True, "--auto-repair/--no-auto-repair", help="Auto-fix lint issues."),
    save: bool = typer.Option(True, "--save/--no-save", help="Export episode bundle to output dir."),
    save_db: bool = typer.Option(True, "--db/--no-db", help="Save episode to SQLite history."),
    output_dir: Optional[Path] = typer.Option(None, "--out", "-o", help="Export directory."),
    provider: Optional[ProviderName] = typer.Option(None, "--provider", "-p"),
    model: Optional[str] = typer.Option(None, "--model", "-m"),
) -> None:
    """Run full pipeline: Idea -> 6-Frame Storyboard Prompt -> 20s Video Prompt -> Playbook Lint."""
    cfg = _build_settings(provider=provider, model=model, output_dir=output_dir)
    llm = create_provider(cfg)
    store = EpisodeStore(cfg.db_path) if save_db else None

    avoid = store.recent_titles(limit=15) if store else []
    recent_mechs = store.recent_mechanics(limit=4) if store else []
    chosen_mech = pick_mechanic(mechanic, exclude_keys=recent_mechs).key

    bundle = asyncio.run(
        generate_episode(
            llm,
            idea_request=IdeaRequest(
                seed_topic=topic,
                setting_hint=setting,
                news_hook=news,
                mechanic=chosen_mech,
                avoid_titles=avoid,
                count=1,
            ),
            mode=mode,
            auto_repair=auto_repair,
        )
    )

    if store:
        store.save(bundle)

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
    console.print(
        f"Mode: [cyan]{bundle.mode}[/cyan] | Mechanic: [cyan]{bundle.idea.mechanic}[/cyan] | "
        f"Repaired: {bundle.repaired} | Playbook Lint: {status} (Score: {bundle.lint.score}/100)"
    )
    for issue in bundle.lint.issues:
        color = "red" if issue.severity == "error" else "yellow"
        console.print(f"  [{color}][{issue.severity.upper()}][/{color}] {issue.code}: {issue.message}")

    if save:
        saved_dir = export_episode(bundle, cfg.output_dir)
        console.print(f"\n[bold cyan]Exported episode files to:[/bold cyan] {saved_dir}")


@app.command()
def batch(
    count: int = typer.Option(3, "--count", "-c", min=1, max=10, help="Number of episodes to generate."),
    from_trends: bool = typer.Option(True, "--from-trends/--no-trends", help="Anchor episodes in live India RSS trends."),
    mode: PipelineMode = typer.Option("fused", "--mode"),
    save: bool = typer.Option(True, "--save/--no-save"),
    provider: Optional[ProviderName] = typer.Option(None, "--provider", "-p"),
    model: Optional[str] = typer.Option(None, "--model", "-m"),
) -> None:
    """Generate a batch of distinct trend-anchored episodes with rotating PS1 mechanics."""
    cfg = _build_settings(provider=provider, model=model)
    llm = create_provider(cfg)
    store = EpisodeStore(cfg.db_path)

    async def _run() -> list:
        trend_items = await fetch_india_trends(limit=count) if from_trends else []
        used_titles = store.recent_titles(limit=20)
        used_mechs = store.recent_mechanics(limit=4)
        bundles = []
        for i in range(count):
            mech = pick_mechanic(exclude_keys=used_mechs, index=i).key
            used_mechs.append(mech)
            hook = trend_items[i].title if i < len(trend_items) else None
            b = await generate_episode(
                llm,
                idea_request=IdeaRequest(
                    news_hook=hook,
                    mechanic=mech,
                    avoid_titles=used_titles,
                    count=1,
                ),
                mode=mode,
                auto_repair=True,
            )
            used_titles.append(b.idea.title)
            store.save(b)
            if save:
                export_episode(b, cfg.output_dir)
            bundles.append(b)
        return bundles

    bundles = asyncio.run(_run())
    table = Table(title=f"Generated Batch ({len(bundles)} episodes)")
    table.add_column("ID", style="cyan")
    table.add_column("Title")
    table.add_column("Mechanic", style="magenta")
    table.add_column("Mode")
    table.add_column("Lint", style="green")
    for b in bundles:
        table.add_row(b.episode_id, b.idea.title, b.idea.mechanic, b.mode, f"{b.lint.score}/100")
    console.print(table)


@app.command()
def history(
    limit: int = typer.Option(15, "--limit", "-l", min=1, max=100),
) -> None:
    """List saved episodes from the local SQLite library."""
    cfg = EngineSettings()
    store = EpisodeStore(cfg.db_path)
    rows = store.list_recent(limit=limit)
    table = Table(title="Saved Episode History")
    table.add_column("ID", style="cyan")
    table.add_column("Title")
    table.add_column("Mechanic", style="magenta")
    table.add_column("Mode")
    table.add_column("Lint")
    for r in rows:
        table.add_row(r.episode_id, r.title, r.mechanic, r.mode, f"{r.lint_score}/100")
    console.print(table)


@app.command()
def benchmark() -> None:
    """Measure exact token efficiency: verbose vs optimized prompts, modular vs fused, and manual vs engine."""
    playbook_path = Path("PLAYBOOK.md")
    playbook_text = playbook_path.read_text(encoding="utf-8") if playbook_path.exists() else ""
    res = run_token_benchmark(playbook_text)

    table = Table(title="Token Efficiency Benchmark")
    table.add_column("Comparison", style="cyan")
    table.add_column("Baseline", justify="right")
    table.add_column("Optimized / Engine", justify="right", style="green")
    table.add_column("Saved", justify="right", style="bold magenta")
    table.add_row(
        "Storyboard Prompt Text (Verbose vs Optimized)",
        f"{res.old_verbose_storyboard_tokens} tok",
        f"{res.new_optimized_storyboard_tokens} tok",
        f"{res.storyboard_prompt_saved_pct}%",
    )
    table.add_row(
        "Pipeline Calls (v1 3-Call Modular vs v2 1-Call Fused)",
        f"{res.modular_v1_pretty_tokens} tok (3 calls)",
        f"{res.fused_v2_tokens} tok (1 call)",
        f"{res.fused_vs_v1_modular_saved_pct}%",
    )
    table.add_row(
        "1 Episode: Manual Chat vs Engine Fused",
        f"{res.manual_chat_1_episode_tokens} tok",
        f"{res.engine_fused_1_episode_tokens} tok",
        f"{res.engine_vs_manual_1_saved_pct}%",
    )
    table.add_row(
        "10 Episodes: Manual Chat vs Engine Fused Batch",
        f"{res.manual_chat_10_episodes_tokens} tok",
        f"{res.engine_fused_10_episodes_tokens} tok",
        f"{res.engine_vs_manual_10_saved_pct}%",
    )
    console.print(table)


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
