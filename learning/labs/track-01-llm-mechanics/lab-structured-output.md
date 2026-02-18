# Lab: Structured Output Hardening

## Goal
Validate that model outputs conform to strict JSON schema.

## Prereqs
- Node installed
- Repo dependencies installed

## Commands
```bash
npm run agentic:demo
```

## Expected output
- Demo prints policy decision, ROI snapshot, and eval results.

## Mutation exercise
- Edit `contracts/structured-output.schema.json` and add a required field.
- Re-run demo and inspect parser behavior.

## Observation prompt
- Note what changed after your mutation and why the system responded that way.

## Failure injection drill
- Force malformed JSON in quiz scorer fallback.
- Verify route returns safe feedback and logs fallback provider.

## Pass/fail evidence artifact
- Capture terminal output and store as artifact with status `valid`.
