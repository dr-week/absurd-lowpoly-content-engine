"""Anthropic Messages API provider."""

from __future__ import annotations

import httpx

from absurd_engine.llm.base import BaseLLMProvider, LLMProviderError


class AnthropicProvider(BaseLLMProvider):
    """Calls Anthropic /v1/messages endpoint via httpx."""

    provider_name = "anthropic"

    def __init__(
        self,
        model: str,
        api_key: str,
        base_url: str = "https://api.anthropic.com/v1",
        temperature: float = 0.9,
        timeout: float = 60.0,
        max_retries: int = 2,
    ) -> None:
        super().__init__(model=model, max_retries=max_retries)
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.temperature = temperature
        self.timeout = timeout

    async def _complete_json(self, system_prompt: str, user_prompt: str) -> str:
        if not self.api_key:
            raise LLMProviderError("LLM_API_KEY is required for provider 'anthropic'.")

        url = f"{self.base_url}/messages"
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        body = {
            "model": self.model,
            "max_tokens": 2048,
            "temperature": self.temperature,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}],
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, headers=headers, json=body)
            if resp.status_code >= 400:
                raise LLMProviderError(
                    f"[anthropic] HTTP {resp.status_code}: {resp.text[:400]}"
                )
            data = resp.json()
            try:
                return data["content"][0]["text"]
            except (KeyError, IndexError, TypeError) as exc:
                raise LLMProviderError(
                    f"[anthropic] Unexpected response shape: {data}"
                ) from exc
