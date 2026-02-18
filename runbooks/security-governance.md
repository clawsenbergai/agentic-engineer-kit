# Security and Governance Baseline

## Core controls
- Least-privilege credentials per tool adapter
- Secrets never present in model context
- Prompt-injection detection before tool execution
- Blocklist for dangerous tools/commands

## Data controls
- Tenant isolation key mandatory on all run/task/memory records
- PII tagging in memory payloads
- Retention policy for logs and traces

## Governance controls
- Budget caps and kill switches
- Approval gates for high-risk actions
- Regular red-team scenarios against agent prompts/tools
