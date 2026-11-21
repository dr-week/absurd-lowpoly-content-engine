"""Provider-agnostic LLM interface with structured Pydantic v2 JSON parsing and retries."""

from __future__ import annotations

import json
import re
from abc import ABC, abstractmethod
from typing import TypeVar

from pydantic import BaseModel, ValidationError

T = TypeVar("T", bound=BaseModel)


class LLMProviderError(RuntimeError):
    """Raised when an LLM provider request or structured parse fails."""


def extract_json_payload(raw_text: str) -> str:
    """Extract the first valid JSON object/array from raw LLM output, handling fences and trailing prose."""
    text = raw_text.strip()

    fenced = re.search(r"```(?:json)?\s*([\s\S]*?)```", text, flags=re.IGNORECASE)
    if fenced:
        text = fenced.group(1).strip()

    decoder = json.JSONDecoder()
    for idx, ch in enumerate(text):
        if ch in "{[":
            try:
                _, end = decoder.raw_decode(text, idx)
                return text[idx:end]
            except json.JSONDecodeError:
                continue

    return text


class BaseLLMProvider(ABC):
    """Abstract base class for all LLM providers."""

    provider_name: str = "base"

    def __init__(self, model: str, max_retries: int = 2) -> None:
        self.model = model
        self.max_retries = max_retries

    @abstractmethod
    async def _complete_json(self, system_prompt: str, user_prompt: str) -> str:
        """Send prompts to the underlying provider and return raw text containing JSON."""

    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: type[T],
    ) -> T:
        """Generate and validate a Pydantic model instance with automatic retry on parse errors."""
        # Compact JSON schema (no pretty-print whitespace) saves ~25-35% prompt tokens per call
        schema_json = json.dumps(response_model.model_json_schema(), separators=(",", ":"))
        augmented_system = (
            f"{system_prompt}\n\n"
            "OUTPUT RULES:\n"
            "- Return ONLY valid JSON matching the schema below.\n"
            "- Do NOT include markdown commentary or explanations outside the JSON.\n"
            f"JSON SCHEMA:{schema_json}"
        )

        last_error: Exception | None = None
        current_user_prompt = user_prompt

        for attempt in range(self.max_retries + 1):
            raw = await self._complete_json(augmented_system, current_user_prompt)
            try:
                payload = extract_json_payload(raw)
                return response_model.model_validate_json(payload)
            except (ValidationError, json.JSONDecodeError, ValueError) as exc:
                last_error = exc
                if attempt < self.max_retries:
                    current_user_prompt = (
                        f"{user_prompt}\n\n"
                        f"Your previous output failed JSON/schema validation with error:\n{exc}\n"
                        "Fix the JSON strictly according to the schema and return ONLY valid JSON."
                    )

        raise LLMProviderError(
            f"[{self.provider_name}/{self.model}] Failed to produce valid "
            f"{response_model.__name__} after {self.max_retries + 1} attempts: {last_error}"
        )
