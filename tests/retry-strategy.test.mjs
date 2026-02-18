import test from "node:test";
import assert from "node:assert/strict";

import { classifyError, createIdempotencyKey, shouldRetry } from "../scripts/lib/retryStrategy.mjs";

test("retries transient failures", () => {
  assert.equal(classifyError("429"), "transient");
  assert.equal(shouldRetry({ attempt: 1, maxAttempts: 3, errorCode: "429" }), true);
});

test("does not retry permanent failures", () => {
  assert.equal(classifyError("400"), "permanent");
  assert.equal(shouldRetry({ attempt: 1, maxAttempts: 3, errorCode: "400" }), false);
});

test("idempotency key is deterministic", () => {
  const key = createIdempotencyKey({ taskId: "t1", step: 2, fingerprint: "abc" });
  assert.equal(key, "t1:2:abc");
});
