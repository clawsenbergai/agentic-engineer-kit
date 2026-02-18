export function classifyError(errorCode) {
  const transientCodes = new Set(["429", "500", "502", "503", "504", "ETIMEDOUT"]);
  return transientCodes.has(String(errorCode)) ? "transient" : "permanent";
}

export function nextBackoffMs(attempt, baseMs = 200, maxMs = 30_000) {
  const exp = Math.min(maxMs, baseMs * 2 ** Math.max(0, attempt - 1));
  const jitter = Math.floor(Math.random() * Math.max(1, Math.floor(exp * 0.2)));
  return exp + jitter;
}

export function shouldRetry({ attempt, maxAttempts, errorCode }) {
  if (attempt >= maxAttempts) {
    return false;
  }

  return classifyError(errorCode) === "transient";
}

export function createIdempotencyKey({ taskId, step, fingerprint }) {
  return `${taskId}:${step}:${fingerprint}`;
}
