import fs from "node:fs/promises";

export async function loadEvalCases(path) {
  const raw = await fs.readFile(path, "utf8");
  return JSON.parse(raw);
}

export async function runEvalSuite(cases, evaluator) {
  const results = [];

  for (const item of cases) {
    const outcome = await evaluator(item.input);
    const passed = item.assert(outcome);
    results.push({ id: item.id, passed, outcome });
  }

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;

  return {
    passed,
    failed,
    passRate: results.length ? passed / results.length : 0,
    results
  };
}
