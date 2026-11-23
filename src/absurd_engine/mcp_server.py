"""Lightweight JSON-RPC 2.0 Model Context Protocol (MCP) handler for agentic automation.

Exposes Absurd Studio tools (`list_visual_engines`, `search_comedy_knowledge`, `generate_viral_episode`)
so external AI agents, n8n workflows, and CLI orchestrators can drive the engine programmatically.
"""

from __future__ import annotations

from typing import Any

from absurd_engine.config import EngineSettings
from absurd_engine.generators.pipeline import generate_episode
from absurd_engine.knowledge_db import KnowledgeBaseDB
from absurd_engine.llm.factory import create_provider
from absurd_engine.playbook import VISUAL_STYLE_PROFILES

MCP_TOOLS: list[dict[str, Any]] = [
    {
        "name": "list_visual_engines",
        "description": "List all 16 randomized visual engines (PS1, Gouache Concept Art, 2D Anime, Mixed-Media, etc.).",
        "inputSchema": {"type": "object", "properties": {}},
    },
    {
        "name": "search_comedy_knowledge",
        "description": "Search the SQLite FTS5 comedy, film-editing, and viral marketing knowledge base.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query (e.g. 'Hook Point', 'status reversal')"},
                "limit": {"type": "integer", "default": 5},
            },
            "required": ["query"],
        },
    },
    {
        "name": "generate_viral_episode",
        "description": "Generate a copyright-safe, no-religion, linted 6-frame storyboard + video script episode.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "seed_topic": {"type": "string", "description": "Optional 1-line comedy premise"},
                "visual_style": {"type": "string", "default": "ps1-1998"},
            },
        },
    },
]


async def handle_mcp_request(payload: dict[str, Any], settings: EngineSettings) -> dict[str, Any]:
    """Process a single JSON-RPC 2.0 MCP request (`initialize`, `tools/list`, `tools/call`)."""
    req_id = payload.get("id")
    method = payload.get("method", "")
    params = payload.get("params") or {}

    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "serverInfo": {"name": "absurd-studio-mcp", "version": "4.0.0"},
                "capabilities": {"tools": {}},
            },
        }

    if method == "tools/list":
        return {"jsonrpc": "2.0", "id": req_id, "result": {"tools": MCP_TOOLS}}

    if method == "tools/call":
        name = params.get("name")
        args = params.get("arguments") or {}
        if name == "list_visual_engines":
            data = [{"key": p.key, "label": p.label} for p in VISUAL_STYLE_PROFILES.values()]
            return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "json", "json": data}]}}

        if name == "search_comedy_knowledge":
            db = KnowledgeBaseDB(settings.db_path)
            hits = db.search(str(args.get("query", "")), limit=int(args.get("limit", 5)))
            return {"jsonrpc": "2.0", "id": req_id, "result": {"content": [{"type": "json", "json": hits}]}}

        if name == "generate_viral_episode":
            llm = create_provider(settings)
            style = str(args.get("visual_style", "ps1-1998"))
            ep = await generate_episode(
                llm,
                seed_topic=args.get("seed_topic"),
                visual_style=style if style in VISUAL_STYLE_PROFILES else "ps1-1998",  # type: ignore[arg-type]
                mode="fused",
            )
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {"content": [{"type": "json", "json": ep.model_dump(mode="json")}]},
            }

        return {"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": f"Unknown tool: {name}"}}

    return {"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": f"Unknown method: {method}"}}
