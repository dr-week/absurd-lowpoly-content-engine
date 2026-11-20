"""End-to-end episode generation pipeline: Idea -> Storyboard -> Video Prompt -> Lint."""

from __future__ import annotations

from absurd_engine.generators.idea_generator import generate_ideas
from absurd_engine.generators.storyboard_builder import generate_storyboard
from absurd_engine.generators.video_builder import generate_video_script
from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.schemas import EpisodeBundle, IdeaRequest, PremiseIdea
from absurd_engine.validator import lint_episode


async def generate_episode(
    provider: BaseLLMProvider,
    idea_request: IdeaRequest | None = None,
    idea: PremiseIdea | None = None,
) -> EpisodeBundle:
    """Run the full prompt-generation pipeline and lint the resulting episode."""
    chosen_idea = idea
    if chosen_idea is None:
        req = idea_request or IdeaRequest(count=1)
        req = req.model_copy(update={"count": 1})
        ideas = await generate_ideas(provider, req)
        chosen_idea = ideas[0]

    storyboard = await generate_storyboard(provider, chosen_idea)
    video = await generate_video_script(provider, chosen_idea, storyboard=storyboard.spec)
    lint = lint_episode(chosen_idea, storyboard, video)

    return EpisodeBundle(
        provider=provider.provider_name,
        model=provider.model,
        idea=chosen_idea,
        storyboard=storyboard,
        video=video,
        lint=lint,
    )
