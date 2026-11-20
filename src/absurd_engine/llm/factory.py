"""Factory to instantiate the configured LLM provider."""

from __future__ import annotations

from absurd_engine.config import EngineSettings
from absurd_engine.llm.anthropic import AnthropicProvider
from absurd_engine.llm.base import BaseLLMProvider
from absurd_engine.llm.gemini import GeminiProvider
from absurd_engine.llm.mock import MockLLMProvider
from absurd_engine.llm.openai_compat import OpenAICompatProvider


def create_provider(settings: EngineSettings | None = None) -> BaseLLMProvider:
    """Create an LLM provider instance from EngineSettings."""
    cfg = settings or EngineSettings()

    if cfg.llm_provider == "mock":
        return MockLLMProvider(model=cfg.llm_model, max_retries=cfg.llm_max_retries)

    if cfg.llm_provider in {"openai", "openrouter", "ollama"}:
        return OpenAICompatProvider(
            provider_name=cfg.llm_provider,
            model=cfg.llm_model,
            base_url=cfg.resolved_base_url(),
            api_key=cfg.llm_api_key,
            temperature=cfg.llm_temperature,
            timeout=cfg.llm_timeout_seconds,
            max_retries=cfg.llm_max_retries,
        )

    if cfg.llm_provider == "gemini":
        return GeminiProvider(
            model=cfg.llm_model,
            api_key=cfg.llm_api_key,
            base_url=cfg.resolved_base_url(),
            temperature=cfg.llm_temperature,
            timeout=cfg.llm_timeout_seconds,
            max_retries=cfg.llm_max_retries,
        )

    if cfg.llm_provider == "anthropic":
        return AnthropicProvider(
            model=cfg.llm_model,
            api_key=cfg.llm_api_key,
            base_url=cfg.resolved_base_url(),
            temperature=cfg.llm_temperature,
            timeout=cfg.llm_timeout_seconds,
            max_retries=cfg.llm_max_retries,
        )

    raise ValueError(f"Unsupported LLM provider: {cfg.llm_provider}")
