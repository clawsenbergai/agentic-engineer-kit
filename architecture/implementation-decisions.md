# Implementation Decisions (Locked Defaults)

## Stack
- TypeScript-first
- OpenAI-first model policy with fallback routing
- Queue + Temporal hybrid orchestration

## Data
- Postgres first for truth and governance
- `pgvector` as default vector path
- External vector DB only if scale/isolation requires

## Safety
- Least-privilege tool access
- Approval required for high-risk actions
- Budget caps at task and run level
- Prompt injection heuristics + tool hardening

## Reliability
- Deterministic state machine
- Retry policy with jitter and max-attempts
- Idempotency keys required for side-effect tools
- Failure recovery runbook mandatory

## Economics
- Persist token and cost metrics for every run
- Compute cost-per-success and value-per-task
- Route to human when expected value below threshold
