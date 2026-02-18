# ROI Operations

Track per run:
- `costUsd`
- `timeToComplete`
- `humanMinutesSaved`
- `errorRate`
- `reworkRate`

Operational formulas:
- `cost_per_success = total_cost / successful_runs`
- `value_per_task = manual_cost_saved - cost_per_success`
- `automation_roi = (total_value - total_cost) / total_cost`

Gating rules:
- If expected value < threshold: route to human.
- If cost drifts above cap: deny or downgrade model tier.
- Promote model tier only after eval score improvement is proven.
