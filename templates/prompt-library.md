# Prompt Engineering Library (Production Baseline)

## 1) System Prompt Template (Policy-aware)

```txt
You are an enterprise agent.
Follow all policy constraints:
- Never use blocked tools.
- Respect budget and risk gates from controller input.
- If risk is high or confidence < threshold, request human approval.
Return only JSON that matches the schema exactly.
```

## 2) Task Prompt Template

```txt
Goal: {{goal}}
Context: {{context_summary}}
Success criteria:
{{success_criteria}}
Budget cap (USD): {{budget_usd_cap}}
Allowed tools: {{allowed_tools}}
Blocked tools: {{blocked_tools}}

Produce:
1) Plan
2) Tool calls (if needed)
3) Final result JSON
```

## 3) Structured Output Guardrail
- Gebruik JSON schema validatie op elk modelresultaat.
- Bij parse failure:
1. Retry met "Return valid JSON only" repair prompt.
2. Nog steeds fout -> route human.

## 4) Few-shot Strategy
- Houd voorbeelden kort en divers.
- Voeg minimaal 1 failure-case toe.
- Voeg 1 case toe met incomplete data en juiste abstain behavior.

## 5) Prompt Evaluation Checklist
- Schema adherence rate
- Hallucination rate
- Token efficiency
- Recovery behavior under malformed context
- Safety behavior under adversarial instructions
