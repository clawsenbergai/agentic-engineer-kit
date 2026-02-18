import crypto from "node:crypto";

export const TRACKS = [
  {
    id: "llm_fundamentals",
    name: "LLM Fundamentals",
    description: "Tokenization, context windows, structured outputs, tool calling.",
    category: "core",
    orderIndex: 10,
  },
  {
    id: "reliability",
    name: "Reliability Engineering",
    description: "Retries, idempotency, state transitions, timeout design.",
    category: "core",
    orderIndex: 20,
  },
  {
    id: "rag_memory",
    name: "RAG + Memory",
    description: "Retrieval quality, chunking, memory tiers, reranking.",
    category: "core",
    orderIndex: 30,
  },
  {
    id: "orchestration",
    name: "Durable Orchestration",
    description: "Queue + workflow design with human approval checkpoints.",
    category: "core",
    orderIndex: 40,
  },
  {
    id: "governance_security",
    name: "Governance + Security",
    description: "Prompt-injection defenses, audit trails, least privilege.",
    category: "core",
    orderIndex: 50,
  },
  {
    id: "economics",
    name: "Agent Economics",
    description: "Expected value, budget gating, model tiering and ROI.",
    category: "core",
    orderIndex: 60,
  },
  {
    id: "a2a",
    name: "A2A Protocol",
    description: "Agent-to-agent interop contracts and handoff semantics.",
    category: "core",
    orderIndex: 70,
  },
  {
    id: "webmcp",
    name: "WebMCP",
    description: "Browser model context protocols and agent-ready web tooling.",
    category: "core",
    orderIndex: 80,
  },
  {
    id: "lang_orchestration",
    name: "LangChain / LangGraph / LangSmith",
    description: "Graph orchestration, trace analytics, and eval discipline.",
    category: "core",
    orderIndex: 90,
  },
  {
    id: "agent_payments",
    name: "x402 / Agent Payments",
    description: "Agent payment rails (x402, AP2, UCP).",
    category: "elective",
    orderIndex: 100,
  },
  {
    id: "agent_identity",
    name: "ERC-8004 Identity",
    description: "On-chain identity, delegation, and revocation controls.",
    category: "elective",
    orderIndex: 110,
  },
  {
    id: "voice_agents",
    name: "Voice Agents",
    description: "Realtime voice architecture, QA and compliance loops.",
    category: "later_phase",
    orderIndex: 120,
  },
];

function m(id, trackId, title, theoryMarkdown, buildExerciseMarkdown, orderIndex) {
  return {
    id,
    trackId,
    title,
    theoryMarkdown,
    buildExerciseMarkdown,
    orderIndex,
    status: "not_started",
    requiredQuiz: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const MILESTONES = [
  m(
    "llm_fundamentals_m1",
    "llm_fundamentals",
    "Schema-constrained outputs",
    "Study why strict schemas reduce hallucination surface.",
    "Run `npm run agentic:demo`, then tighten `contracts/structured-output.schema.json` and inspect behavior.",
    10
  ),
  m(
    "llm_fundamentals_m2",
    "llm_fundamentals",
    "Prompt repair path",
    "Learn how recovery prompts handle malformed outputs.",
    "Inject malformed response in quiz flow and verify fallback scoring path.",
    20
  ),
  m(
    "reliability_m1",
    "reliability",
    "Retry classification",
    "Understand transient vs permanent failure taxonomy.",
    "Run tests and verify retry behavior on 429 vs 400.",
    10
  ),
  m(
    "reliability_m2",
    "reliability",
    "Idempotency safety",
    "Learn where duplicate side effects occur.",
    "Generate deterministic idempotency keys for a fake tool call sequence.",
    20
  ),
  m(
    "rag_memory_m1",
    "rag_memory",
    "Memory tier ranking",
    "Understand working vs episodic vs semantic recall priority.",
    "Run memory ranking and compare old vs fresh record outcomes.",
    10
  ),
  m(
    "rag_memory_m2",
    "rag_memory",
    "Hybrid retrieval quality",
    "Understand lexical + vector + rerank tradeoffs.",
    "Build a mini benchmark and compare rerank on/off precision.",
    20
  ),
  m(
    "orchestration_m1",
    "orchestration",
    "State transition legality",
    "Study workflow states and replay-safe boundaries.",
    "Force illegal transitions and verify deterministic rejection.",
    10
  ),
  m(
    "orchestration_m2",
    "orchestration",
    "Human approval checkpoint",
    "Understand pause/resume around high-risk actions.",
    "Simulate approval request and resume path with audit event.",
    20
  ),
  m(
    "governance_security_m1",
    "governance_security",
    "Prompt injection resistance",
    "Recognize tool-exfiltration prompts and policy denial patterns.",
    "Run injection checks and verify blocked tools remain blocked.",
    10
  ),
  m(
    "governance_security_m2",
    "governance_security",
    "Immutable audit trail",
    "Understand why append-only logs are required.",
    "Review run events and validate no-update/no-delete constraints.",
    20
  ),
  m(
    "economics_m1",
    "economics",
    "Expected value gating",
    "Study value thresholds for autonomous execution.",
    "Simulate low EV task and verify route-to-human policy outcome.",
    10
  ),
  m(
    "economics_m2",
    "economics",
    "Cost-per-success tracking",
    "Track where automation creates or destroys value.",
    "Compute ROI with different model tiers and compare.",
    20
  ),
  m(
    "a2a_m1",
    "a2a",
    "Handoff contract validation",
    "Understand required fields in A2A payloads.",
    "Run `node scripts/dashboard/mock-a2a-handoff.mjs` and validate accepted/rejected payloads.",
    10
  ),
  m(
    "a2a_m2",
    "a2a",
    "Timeout + retry semantics",
    "Model acknowledgement and retry strategy for handoff failures.",
    "Inject delayed response and verify retry policy.",
    20
  ),
  m(
    "webmcp_m1",
    "webmcp",
    "Capability detection",
    "Understand WebMCP compatibility checks and risk labels.",
    "Run `node scripts/dashboard/mock-webmcp-check.mjs` with compatibility flag toggles.",
    10
  ),
  m(
    "webmcp_m2",
    "webmcp",
    "Fallback architecture",
    "Design robust fallback to HTTP tools when WebMCP is unavailable.",
    "Implement and verify fallback in mock route.",
    20
  ),
  m(
    "lang_orchestration_m1",
    "lang_orchestration",
    "Graph orchestration patterns",
    "Understand node boundaries and persisted state.",
    "Model a planner-executor-critic graph with deterministic transitions.",
    10
  ),
  m(
    "lang_orchestration_m2",
    "lang_orchestration",
    "Trace-driven eval loop",
    "Use traces to drive prompt or policy improvements.",
    "Run `node scripts/dashboard/mock-lang-eval-loop.mjs` and interpret promotion decision.",
    20
  ),
  m(
    "agent_payments_m1",
    "agent_payments",
    "Budget lock and spend controls",
    "Understand pay-per-tool-call controls and cap enforcement.",
    "Run `node scripts/dashboard/mock-payment-gating.mjs`.",
    10
  ),
  m(
    "agent_identity_m1",
    "agent_identity",
    "Identity assertion policy",
    "Understand trust boundary for delegated agent identity.",
    "Run `node scripts/dashboard/mock-identity-policy.mjs`.",
    10
  ),
  m(
    "voice_agents_m1",
    "voice_agents",
    "Latency and handoff guardrails",
    "Understand voice latency budgets and uncertainty handoffs.",
    "Run `node scripts/dashboard/mock-voice-latency.mjs`.",
    10
  ),
];

export const DEMO_ARTIFACTS = [
  {
    id: crypto.randomUUID(),
    trackId: "reliability",
    milestoneId: "reliability_m1",
    title: "Retry policy unit tests",
    description: "Validated 429 retries and 400 no-retry behavior.",
    status: "valid",
    sourceType: "test",
    projectSource: "kit_internal",
    evidenceUrl: "tests/retry-strategy.test.mjs",
    confidenceScore: 0.91,
    freshnessScore: 0.95,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    trackId: "economics",
    milestoneId: "economics_m2",
    title: "Polymarket bot risk engine ROI notebook",
    description: "Real project evidence for expected value and risk-gated execution.",
    status: "valid",
    sourceType: "real_project",
    projectSource: "polymarket_bot",
    evidenceUrl: "https://example.com/polymarket-risk-engine",
    confidenceScore: 0.84,
    freshnessScore: 0.7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    trackId: "webmcp",
    milestoneId: "webmcp_m2",
    title: "Agent-ready tool fallback spec",
    description: "Real project mapping for MCP/WebMCP fallback behavior.",
    status: "stale",
    sourceType: "real_project",
    projectSource: "agent_ready_tool",
    evidenceUrl: "https://example.com/agent-ready-tool",
    confidenceScore: 0.62,
    freshnessScore: 0.35,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
];

export const DEFAULT_TRACK_WEIGHTS = {
  evidenceWeight: 0.7,
  quizWeight: 0.3,
};

export function createInitialStore(options = {}) {
  const includeDemoArtifacts =
    options.includeDemoArtifacts ?? process.env.LEARNING_DEMO_SEED === "1";

  return {
    tracks: structuredClone(TRACKS),
    milestones: structuredClone(MILESTONES),
    artifacts: includeDemoArtifacts ? structuredClone(DEMO_ARTIFACTS) : [],
    evaluations: [],
    quizQuestions: [],
    quizResponses: [],
    progressSnapshots: [],
    gaps: [],
    recommendations: [],
    reflections: [],
    trackWeights: { ...DEFAULT_TRACK_WEIGHTS },
    providerRuns: [],
  };
}
