const INJECTION_PATTERNS = [
  /ignore\s+(all|previous)\s+instructions/i,
  /reveal\s+system\s+prompt/i,
  /exfiltrate|leak\s+secrets?/i,
  /run\s+shell|execute\s+command/i,
  /sudo\s+|rm\s+-rf/i
];

export function detectPromptInjection(text) {
  if (!text) return { flagged: false, matches: [] };

  const matches = INJECTION_PATTERNS.filter((rx) => rx.test(text)).map((rx) => rx.source);
  return { flagged: matches.length > 0, matches };
}

export function isToolAllowed(toolName, blockedTools = []) {
  return !blockedTools.includes(toolName);
}
