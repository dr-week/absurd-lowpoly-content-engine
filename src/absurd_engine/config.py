from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

ProviderName = Literal["mock", "openai", "openrouter", "ollama", "gemini", "anthropic"]


class EngineSettings(BaseSettings):
    """Runtime configuration for the Absurd Low-Poly Content Engine."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    llm_provider: ProviderName = Field(default="mock", alias="LLM_PROVIDER")
    llm_model: str = Field(default="mock-ps1-v1", alias="LLM_MODEL")
    llm_api_key: str = Field(default="", alias="LLM_API_KEY")
    llm_base_url: str = Field(default="", alias="LLM_BASE_URL")
    llm_temperature: float = Field(default=0.9, ge=0.0, le=2.0, alias="LLM_TEMPERATURE")
    llm_timeout_seconds: float = Field(default=60.0, gt=0.0, alias="LLM_TIMEOUT_SECONDS")
    llm_max_retries: int = Field(default=2, ge=0, le=5, alias="LLM_MAX_RETRIES")
    output_dir: Path = Field(default=Path("output"), alias="OUTPUT_DIR")

    def resolved_base_url(self) -> str:
        """Return explicit base URL or sensible default per provider."""
        if self.llm_base_url:
            return self.llm_base_url.rstrip("/")
        defaults = {
            "openai": "https://api.openai.com/v1",
            "openrouter": "https://openrouter.ai/api/v1",
            "ollama": "http://localhost:11434/v1",
            "gemini": "https://generativelanguage.googleapis.com/v1beta",
            "anthropic": "https://api.anthropic.com/v1",
            "mock": "",
        }
        return defaults[self.llm_provider]
