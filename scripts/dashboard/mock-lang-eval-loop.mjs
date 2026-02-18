const baseline = 71;
const candidate = 79;

console.log({
  baseline,
  candidate,
  delta: candidate - baseline,
  recommendation: candidate > baseline ? "promote_candidate" : "keep_baseline",
});
