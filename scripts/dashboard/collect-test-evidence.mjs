import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

import { nowIso, writeJson } from "./_helpers.mjs";

const execAsync = promisify(exec);

async function main() {
  const { stdout, stderr } = await execAsync("npm run agentic:test", {
    cwd: path.resolve(process.cwd()),
  });

  const passedMatch = stdout.match(/# pass (\d+)/);
  const failedMatch = stdout.match(/# fail (\d+)/);

  const payload = {
    collectedAt: nowIso(),
    source: "agentic:test",
    passed: passedMatch ? Number(passedMatch[1]) : null,
    failed: failedMatch ? Number(failedMatch[1]) : null,
    stdout,
    stderr,
  };

  const out = path.resolve(process.cwd(), "data", "dashboard", "test-evidence.json");
  await writeJson(out, payload);
  console.log(`Wrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
