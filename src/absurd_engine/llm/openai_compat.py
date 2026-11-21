"""OpenAI-compatible provider (OpenAI, OpenRouter, Groq, Together, Ollama, vLLM, LM Studio)."""

from __future__ import annotations

from absurd_engine.llm.base import BaseLLMProvider, LLMProviderError
from absurd_engine.llm.http_client import ResilientHTTPMixin


class OpenAICompatProvider(ResilientHTTPMixin, BaseLLMProvider):
    """Calls any /chat/completions endpoint supporting the OpenAI wire format."""

    def __init__(
        self,
        provider_name: str,
        model: str,
        base_url: str,
        api_key: str = "",
        temperature: float = 0.9,
        timeout: float = 60.0,
        max_retries: int = 2,
    ) -> None:
        super().__init__(model=model, max_retries=max_retries)
        self.provider_name = provider_name
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.temperature = temperature
        self.timeout = timeout

    async def _complete_json(self, system_prompt: str, user_prompt: str) -> str:
        if self.provider_name != "ollama" and not self.api_key:
            raise LLMProviderError(
                f"LLM_API_KEY is required for provider '{self.provider_name}'."
            )

        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        body: dict = {
            "model": self.model,
            "temperature": self.temperature,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "response_format": {"type": "json_object"},
        }

        url = f"{self.base_url}/chat/completions"
        resp = await self._post_with_backoff(url, headers=headers, json_body=body)
        if resp.status_code == 400 and "response_format" in resp.text:
            body.pop("response_format", None)
            resp = await self._post_with_backoff(url, headers=headers, json_body=body)

        if resp.status_code >= 400:
            raise LLMProviderError(
                f"[{self.provider_name}] HTTP {resp.status_code}: {resp.text[:400]}"
            )

        data = resp.json()
        try:
            return data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError) as exc:
            raise LLMProviderError(
                f"[{self.provider_name}] Unexpected response shape: {data}"
            ) from exc
