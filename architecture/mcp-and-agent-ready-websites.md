# MCP and Agent-Ready Websites

## MCP usage model
- Expose internal tools via well-scoped MCP servers
- Each tool advertises explicit input/output schema
- Enforce auth and tenant scope server-side

## Agent-ready website principles
- Stable machine-readable endpoints (not only UI rendering)
- Deterministic IDs and structured data attributes
- Explicit action APIs for safe automation
- Rate limits and abuse controls

## Security patterns
- Signed requests between agents and tool servers
- Capability tokens per tool scope
- Zero trust: never trust model output without policy checks
