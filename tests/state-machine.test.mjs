import test from "node:test";
import assert from "node:assert/strict";

import { canTransition, transitionRun } from "../scripts/lib/stateMachine.mjs";

test("state machine allows valid transitions", () => {
  assert.equal(canTransition("queued", "running"), true);
  assert.equal(canTransition("running", "succeeded"), true);
});

test("state machine blocks invalid transitions", () => {
  assert.equal(canTransition("queued", "succeeded"), false);
  assert.throws(() => transitionRun({ runId: "r1", status: "queued" }, "succeeded"));
});
