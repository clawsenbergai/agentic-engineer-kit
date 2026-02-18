export function scoreMemory(record, nowIso = new Date().toISOString()) {
  const created = new Date(record.createdAt).getTime();
  const now = new Date(nowIso).getTime();
  const ageHours = Math.max(1, (now - created) / 1000 / 60 / 60);

  const base = Number(record.score ?? 0.5);
  const kindWeight =
    record.kind === "working" ? 1.0 : record.kind === "episodic" ? 0.8 : 0.6;
  const freshness = 1 / Math.log2(ageHours + 2);

  return base * kindWeight * freshness;
}

export function rankMemories(records, limit = 5) {
  return [...records]
    .map((record) => ({ ...record, rankScore: scoreMemory(record) }))
    .sort((a, b) => b.rankScore - a.rankScore)
    .slice(0, limit);
}
