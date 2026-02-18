const latencyMs = 420;
const budgetMs = 350;

console.log({
  latencyMs,
  budgetMs,
  withinBudget: latencyMs <= budgetMs,
  recommendation: latencyMs <= budgetMs ? "continue" : "route_human_review",
});
