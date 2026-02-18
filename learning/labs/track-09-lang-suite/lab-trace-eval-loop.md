# Lab: Trace + Eval Loop

## Goal
Run a mock experiment compare cycle and generate a score delta.

## Commands
```bash
node scripts/dashboard/mock-lang-eval-loop.mjs
```

## Expected output
- Baseline score, candidate score, decision recommendation.

## Mutation exercise
- Adjust rubric weights and rerun.

## Observation prompt
- Note what changed after your mutation and why the system responded that way.

## Failure injection drill
- Inject missing trace and ensure result is flagged low confidence.

## Pass/fail evidence artifact
- Save experiment comparison output.
