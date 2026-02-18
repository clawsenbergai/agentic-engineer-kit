export function costPerSuccess(totalCostUsd, successfulRuns) {
  if (successfulRuns <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return totalCostUsd / successfulRuns;
}

export function valuePerTask(manualCostSavedUsd, costPerSuccessfulTaskUsd) {
  return manualCostSavedUsd - costPerSuccessfulTaskUsd;
}

export function automationRoi(totalValueUsd, totalCostUsd) {
  if (totalCostUsd === 0) {
    return Number.POSITIVE_INFINITY;
  }
  return (totalValueUsd - totalCostUsd) / totalCostUsd;
}

export function shouldAutoExecute({ expectedValueUsd, minExpectedValueUsd }) {
  return expectedValueUsd >= minExpectedValueUsd;
}
