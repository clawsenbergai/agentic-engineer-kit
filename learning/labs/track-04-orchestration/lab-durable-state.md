# Lab: Durable State Flow

## Goal
Validate legal state transitions with pause/resume semantics.

## Commands
```bash
npm run agentic:test
```

## Expected output
- State machine tests pass and illegal transitions fail.

## Mutation exercise
- Add a forbidden transition and confirm test catches regression.

## Observation prompt
- Note what changed after your mutation and why the system responded that way.

## Failure injection drill
- Force transition from `queued` to `succeeded` and verify exception.

## Pass/fail evidence artifact
- Attach failing and passing run logs.
