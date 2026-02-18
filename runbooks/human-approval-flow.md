# Human Approval Flow

## When approval is mandatory
- Risk level = high
- Tool action touches finance, production data mutation, or external side effects
- Confidence under threshold

## Approval payload must include
- Proposed action
- Why agent believes it should proceed
- Estimated cost/value impact
- Rollback strategy

## Decision outcomes
- Approved -> resume run
- Rejected -> cancel or route_human with manual execution

## Audit requirements
- `approval_requests` row written for every gate
- `run_events` append-only records for request + decision
