# Lab: Voice Latency and Handoff (Later Phase)

## Goal
Measure simulated end-to-end latency and human handoff trigger.

## Commands
```bash
node scripts/dashboard/mock-voice-latency.mjs
```

## Expected output
- Latency budget report and handoff recommendation.

## Mutation exercise
- Increase processing delay and observe quality score drop.

## Observation prompt
- Note what changed after your mutation and why the system responded that way.

## Failure injection drill
- Simulate transcript uncertainty and force human review.

## Pass/fail evidence artifact
- Store latency report as voice artifact.
