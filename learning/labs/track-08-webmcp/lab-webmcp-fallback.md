# Lab: WebMCP Fallback

## Goal
Validate capability detection and fallback when WebMCP is unavailable.

## Commands
```bash
node scripts/dashboard/mock-webmcp-check.mjs
```

## Expected output
- Environment reported as `experimental` or `fallback`.

## Mutation exercise
- Toggle compatibility flag and inspect route behavior.

## Observation prompt
- Note what changed after your mutation and why the system responded that way.

## Failure injection drill
- Force unsupported browser path and verify graceful fallback.

## Pass/fail evidence artifact
- Capture compatibility report.
