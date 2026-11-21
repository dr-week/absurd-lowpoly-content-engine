"""Shared HTTP helper with connection reuse and exponential backoff for 429/503/timeouts."""

from __future__ import annotations

import asyncio
from typing import Any

import httpx

from absurd_engine.llm.base import LLMProviderError

RETRYABLE_STATUS_CODES = {429, 500, 502, 503, 504}


class ResilientHTTPMixin:
    """Provides a lazily reused httpx.AsyncClient and exponential backoff POST."""

    timeout: float
    provider_name: str
    _client: httpx.AsyncClient | None = None

    def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=self.timeout)
        return self._client

    async def aclose(self) -> None:
        if self._client is not None and not self._client.is_closed:
            await self._client.aclose()

    async def _post_with_backoff(
        self,
        url: str,
        *,
        headers: dict[str, str] | None = None,
        params: dict[str, str] | None = None,
        json_body: dict[str, Any],
        max_attempts: int = 3,
    ) -> httpx.Response:
        client = self._get_client()
        last_exc: Exception | None = None

        for attempt in range(max_attempts):
            try:
                resp = await client.post(url, headers=headers, params=params, json=json_body)
                if resp.status_code not in RETRYABLE_STATUS_CODES or attempt == max_attempts - 1:
                    return resp
            except (httpx.TimeoutException, httpx.ConnectError) as exc:
                last_exc = exc
                if attempt == max_attempts - 1:
                    raise LLMProviderError(
                        f"[{self.provider_name}] Network error after {max_attempts} attempts: {exc}"
                    ) from exc

            await asyncio.sleep(0.5 * (2**attempt))

        raise LLMProviderError(f"[{self.provider_name}] Request failed: {last_exc}")
