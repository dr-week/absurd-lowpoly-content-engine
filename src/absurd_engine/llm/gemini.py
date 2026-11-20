"""Google Gemini REST API provider (structured JSON via responseMimeType)."""

from __future__ import annotations

import httpx

from absurd_engine.llm.base import BaseLLMProvider, LLMProviderError


class GeminiProvider(BaseLLMProvider):
    """Calls Gemini generateContent REST endpoint via httpx."""

    provider_name = "gemini"

    def __init__(
        self,
        model: str,
        api_key: str,
        base_url: str = "https://generativelanguage.googleapis.com/v1beta",
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
            raise LLMProviderError("LLM_API_KEY is required for provider 'gemini'.")

        url = f"{self.base_url}/models/{self.model}:generateContent"
        params = {"key": self.api_key}
        body = {
            "system_instruction": {"parts": [{"text": system_prompt}]},
            "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
            "generationConfig": {
                "temperature": self.temperature,
                "responseMimeType": "application/json",
            },
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(url, params=params, json=body)
            if resp.status_code >= 400:
                raise LLMProviderError(
                    f"[gemini] HTTP {resp.status_code}: {resp.text[:400]}"
                )
            data = resp.json()
            try:
                return data["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError, TypeError) as exc:
                raise LLMProviderError(
                    f"[gemini] Unexpected response shape: {data}"
                ) from exc
