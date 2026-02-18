# Failure Recovery Runbook

## Trigger classes
- Model provider outage
- Tool adapter failures
- Queue backlog saturation
- Workflow stuck in waiting state

## Standard response
1. Freeze new high-risk runs
2. Enable fallback model routing
3. Drain queue with lower concurrency if downstream unstable
4. Route unresolved runs to human review
5. Capture root cause and recovery timeline in run events

## Replay policy
- Replay only idempotent steps automatically
- For non-idempotent steps: require explicit approval

## Post-incident checklist
- Incident summary added
- New regression test added
- Policy thresholds reviewed
