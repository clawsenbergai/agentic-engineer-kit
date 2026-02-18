import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

import { nowIso, writeJson } from "./_helpers.mjs";

const execAsync = promisify(exec);

async function main() {
  const { stdout, stderr } = await execAsync("npm run agentic:demo", {
    cwd: path.resolve(process.cwd()),
  });

  const payload = {
    collectedAt: nowIso(),
    source: "agentic:demo",
    containsPolicy: stdout.includes("Policy decision"),
    containsRoi: stdout.includes("ROI snapshot"),
    containsEval: stdout.includes("Eval results"),
    stdout,
    stderr,
  };

  const out = path.resolve(process.cwd(), "data", "dashboard", "demo-evidence.json");
  await writeJson(out, payload);
  console.log(`Wrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
