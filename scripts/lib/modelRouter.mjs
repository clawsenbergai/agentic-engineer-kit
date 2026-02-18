export function selectModel({ riskLevel, complexity, budgetTight, preferred = "gpt-5" }) {
  if (riskLevel === "high") {
    return "gpt-5";
  }

  if (budgetTight && complexity === "low") {
    return "gpt-4o-mini";
  }

  if (complexity === "high") {
    return preferred;
  }

  return "gpt-4.1";
}

export function fallbackModel(primary) {
  const map = {
    "gpt-5": "gpt-4.1",
    "gpt-4.1": "gpt-4o-mini",
    "gpt-4o-mini": "gpt-4.1"
  };
  return map[primary] || "gpt-4.1";
}
