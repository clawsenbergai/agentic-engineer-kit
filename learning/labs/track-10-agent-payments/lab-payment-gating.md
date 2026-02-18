# Lab: Agent Payment Budget Gate (Elective)

## Goal
Simulate pay-per-tool-call and budget exhaustion.

## Commands
```bash
node scripts/dashboard/mock-payment-gating.mjs
```

## Expected output
- Calls stop once budget limit is exceeded.

## Mutation exercise
- Increase budget and observe additional call allowance.

## Observation prompt
- Note what changed after your mutation and why the system responded that way.

## Failure injection drill
- Trigger settlement mismatch and route to manual review.

## Pass/fail evidence artifact
- Store payment simulation transcript.
