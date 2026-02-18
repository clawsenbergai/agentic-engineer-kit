# Lab: Memory Ranking Validation

## Goal
Validate recency and kind-based memory ranking.

## Commands
```bash
node scripts/demo-run.mjs
```

## Expected output
- Top memories printed with rank scores.

## Mutation exercise
- Increase age of top memory and observe rank drop.

## Observation prompt
- Note what changed after your mutation and why the system responded that way.

## Failure injection drill
- Set invalid memory scores and validate clamping behavior.

## Pass/fail evidence artifact
- Store ranked output snapshot.
