# Agentic Engineer Kit (TS-first, enterprise-ready)

Clean nieuw project om jezelf op te leiden en systemen te bouwen voor de agent era.

## Why this repo exists
- Los van clientprojecten, zodat je veilig kunt experimenteren.
- Focus op architectuur + code + governance + economics.
- Direct toepasbaar op enterprise use-cases (ops, marketing, finance).

## Quick start

```bash
npm install
npm run agentic:check
npm run agentic:tree
```

## Repository layout

### Learning + architecture
- `learning/` curriculum, milestones, tooling landscape, reading list
- `architecture/` reference architecture, deployment blueprints, MCP/workflow patterns
- `templates/` prompt engineering and structured output templates
- `runbooks/` recovery, approval, security, ROI operations
- `capstones/` ops/marketing/finance blueprints

### Runtime starter kit
- `contracts/` canonical interfaces and schema
- `sql/` governance-first Postgres schema
- `scripts/lib/` policy, retry, state machine, security, ROI, memory
- `tests/` must-pass scenarios from the masterplan

### Monorepo skeleton (phase 2)
- `apps/agent-control-api/`
- `services/control-plane/`
- `services/execution-plane/`
- `workers/queue-runner/`
- `workflows/temporal-orchestrator/`
- `packages/contracts/`
- `packages/policies/`
- `infra/`

## Included capabilities
- Control plane: policy engine + budget/risk gating
- Execution plane: deterministic states + retry primitives
- Knowledge plane: memory ranking logic and eval data
- Governance plane: approval gates + immutable run-event patterns
- Economics: cost-per-success + ROI formulas + value gating

## Notes
- This repo is intentionally framework-light and learning-first.
- You can incrementally wire these modules into real services.
