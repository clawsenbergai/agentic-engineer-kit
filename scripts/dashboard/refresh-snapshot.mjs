import fs from "node:fs/promises";
import path from "node:path";

import { nowIso, writeJson } from "./_helpers.mjs";

async function readOrNull(file) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function scoreFromEvidence(testEvidence, demoEvidence, docEvidence) {
  const testScore = testEvidence?.failed === 0 ? 100 : 60;
  const demoScore = demoEvidence?.containsEval ? 95 : 50;
  const docScore = docEvidence?.coveragePercent ?? 0;

  return Math.round((testScore * 0.45 + demoScore * 0.25 + docScore * 0.3) * 100) / 100;
}

async function main() {
  const base = path.resolve(process.cwd(), "data", "dashboard");
  const testEvidence = await readOrNull(path.join(base, "test-evidence.json"));
  const demoEvidence = await readOrNull(path.join(base, "demo-evidence.json"));
  const docEvidence = await readOrNull(path.join(base, "doc-evidence.json"));

  const evidenceScore = scoreFromEvidence(testEvidence, demoEvidence, docEvidence);
  const quizScore = 0;
  const overall = Math.round((evidenceScore * 0.7 + quizScore * 0.3) * 100) / 100;

  const snapshot = {
    createdAt: nowIso(),
    evidenceWeight: 0.7,
    quizWeight: 0.3,
    evidenceScore,
    quizScore,
    overall,
    inputs: {
      testEvidence: Boolean(testEvidence),
      demoEvidence: Boolean(demoEvidence),
      docEvidence: Boolean(docEvidence),
    },
  };

  const out = path.resolve(base, "snapshot.json");
  await writeJson(out, snapshot);
  console.log(`Wrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
