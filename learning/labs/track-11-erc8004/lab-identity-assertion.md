# Lab: Identity Assertion and Policy Check (Elective)

## Goal
Validate that only allowed identities can execute privileged actions.

## Commands
```bash
node scripts/dashboard/mock-identity-policy.mjs
```

## Expected output
- Authorized identity passes, unauthorized identity denied.

## Mutation exercise
- Rotate identity key and update allowlist.

## Observation prompt
- Note what changed after your mutation and why the system responded that way.

## Failure injection drill
- Submit revoked identity and verify hard deny.

## Pass/fail evidence artifact
- Save policy decision output.
