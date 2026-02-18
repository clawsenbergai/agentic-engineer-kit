import test from "node:test";
import assert from "node:assert/strict";

import {
  automationRoi,
  costPerSuccess,
  shouldAutoExecute,
  valuePerTask
} from "../scripts/lib/roiModel.mjs";

test("cost per success computes correctly", () => {
  assert.equal(costPerSuccess(100, 20), 5);
});

test("value per task can be negative", () => {
  assert.equal(valuePerTask(2, 5), -3);
});

test("automation ROI formula", () => {
  assert.equal(automationRoi(150, 50), 2);
});

test("expected value gate", () => {
  assert.equal(shouldAutoExecute({ expectedValueUsd: 2, minExpectedValueUsd: 1 }), true);
  assert.equal(shouldAutoExecute({ expectedValueUsd: 0.5, minExpectedValueUsd: 1 }), false);
});
