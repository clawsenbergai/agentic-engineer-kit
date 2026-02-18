import fs from "node:fs/promises";
import path from "node:path";

import { nowIso, writeJson } from "./_helpers.mjs";

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const requiredDocs = [
    "learning/curriculum.md",
    "learning/reading-list.md",
    "learning/tooling-landscape.md",
    "learning/tracks/a2a.md",
    "learning/tracks/webmcp.md",
    "learning/tracks/agent-payments.md",
    "learning/tracks/erc-8004.md",
    "learning/tracks/lang-suite.md",
    "learning/tracks/voice-agents.md",
  ];

  const coverage = [];
  for (const rel of requiredDocs) {
    const absolute = path.resolve(process.cwd(), rel);
    coverage.push({ path: rel, exists: await exists(absolute) });
  }

  const payload = {
    collectedAt: nowIso(),
    source: "docs",
    coverage,
    coveragePercent:
      Math.round(
        (coverage.filter((c) => c.exists).length / Math.max(1, coverage.length)) * 100
      ),
  };

  const out = path.resolve(process.cwd(), "data", "dashboard", "doc-evidence.json");
  await writeJson(out, payload);
  console.log(`Wrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
