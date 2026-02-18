# GitHub Agentic Workflows

## Core pattern
- Issue -> Spec prompt -> Agent branch -> PR -> CI -> Human review -> Merge

## Minimum workflow
1. Structured issue template (goal, constraints, acceptance tests)
2. Agent picks issue and creates scoped branch
3. Agent opens PR with:
- design notes
- risk notes
- test evidence
4. CI gates:
- lint/build/tests
- security checks
5. Required human review for high-risk labels

## Recommended labels
- `agent-safe`
- `human-approval-required`
- `security-sensitive`
- `cost-sensitive`
- `eval-required`

## PR contract
- Include expected value estimate
- Include rollback plan
- Include monitoring hooks
