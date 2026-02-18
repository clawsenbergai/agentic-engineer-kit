# Reference Architecture

## 1) Control Plane

Verantwoordelijk voor beslissingen, niet uitvoering.

Components:
- **Run Registry**: centrale status van task/run/tool invocations
- **Policy Engine**: budget, risk, approval, tool allow/deny
- **Budget Controller**: token/cost caps per tenant/use-case
- **Trace Index**: correlatie van workflow events en failure root cause

Outputs:
- `allow`
- `require_approval`
- `deny`
- `route_human`

## 2) Execution Plane

Verantwoordelijk voor uitvoering en herstel.

Components:
- **Queue workers** (BullMQ style) voor korte taken
- **Durable workflows** (Temporal style) voor langlopende processen
- **Tool adapters** met timeouts, retries, idempotency keys
- **Compensation hooks** voor rollback/cleanup

## 3) Knowledge Plane

Verantwoordelijk voor contextkwaliteit.

Components:
- **Postgres system of record** (`jsonb` + relational)
- **Memory tiers**: working, episodic, semantic
- **Retrieval pipeline**: lexical + vector + rerank
- **Evaluation dataset** voor retrieval quality

## 4) Governance Plane

Verantwoordelijk voor controle, veiligheid en ROI.

Components:
- **Immutable event logs**
- **Approval workflows**
- **PII/security policies**
- **Cost and ROI metrics**

## Data flow (high-level)

1. Task created -> `agent_tasks`
2. Control plane evaluates policy
3. If approved: execution starts -> `agent_runs`
4. Tools invoked -> `tool_invocations`
5. If high risk: pause -> `approval_requests`
6. Result evaluated -> `evaluation_results`
7. ROI computed -> gating for future runs
