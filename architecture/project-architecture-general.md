# Project Architecture in General (Enterprise Agent Systems)

## Repository Pattern

Monorepo aanbevolen met duidelijke boundaries:
- `apps/` product surfaces (web/admin)
- `services/` agent runtime services
- `workers/` queue processors
- `workflows/` durable workflow definitions
- `packages/contracts/` shared types and schemas
- `packages/policies/` policy-as-code
- `infra/` IaC, observability, secrets management

## Service Boundaries

1. **API Gateway**: authn/authz, tenant routing
2. **Control Service**: policy decisions and run registry
3. **Execution Service**: tool orchestration and model calls
4. **Knowledge Service**: retrieval and memory management
5. **Evaluation Service**: benchmark and regression analysis

## Data Boundaries

- Operational OLTP: Postgres
- Event stream/log: append-only event table or log system
- Analytics warehouse: optional for long horizon metrics
- Vector index: pgvector first, external index on scale trigger

## Reliability Baseline

- Correlation IDs through every layer
- Idempotency keys for side-effect tools
- Retry with bounded exponential backoff
- Dead letter queue for poison jobs
- Replay-safe workflow steps

## Governance Baseline

- Tool allowlist per tenant/use-case
- Budget caps at task + run + tenant level
- Mandatory approval for high-risk actions
- Immutable audit logs
- Incident runbook for model/tool/provider failures
