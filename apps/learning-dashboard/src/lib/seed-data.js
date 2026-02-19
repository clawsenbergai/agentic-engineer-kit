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
  {
    id: "harness_engineering",
    name: "Harness Engineering",
    description: "System prompts, tools, middleware, self-verification loops, trace-driven improvement.",
    category: "core",
    orderIndex: 125,
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
  m("llm_fundamentals_m1", "llm_fundamentals", "Schema-constrained outputs", "Study why strict schemas reduce hallucination surface.", "Run `npm run agentic:demo`, then tighten `contracts/structured-output.schema.json` and inspect behavior.", 10),
  m("llm_fundamentals_m2", "llm_fundamentals", "Prompt repair path", "Learn how recovery prompts handle malformed outputs.", "Inject malformed response in quiz flow and verify fallback scoring path.", 20),
  m("reliability_m1", "reliability", "Retry classification", "Understand transient vs permanent failure taxonomy.", "Run tests and verify retry behavior on 429 vs 400.", 10),
  m("reliability_m2", "reliability", "Idempotency safety", "Learn where duplicate side effects occur.", "Generate deterministic idempotency keys for a fake tool call sequence.", 20),
  m("rag_memory_m1", "rag_memory", "Memory tier ranking", "Understand working vs episodic vs semantic recall priority.", "Run memory ranking and compare old vs fresh record outcomes.", 10),
  m("rag_memory_m2", "rag_memory", "Hybrid retrieval quality", "Understand lexical + vector + rerank tradeoffs.", "Build a mini benchmark and compare rerank on/off precision.", 20),
  m("orchestration_m1", "orchestration", "State transition legality", "Study workflow states and replay-safe boundaries.", "Force illegal transitions and verify deterministic rejection.", 10),
  m("orchestration_m2", "orchestration", "Human approval checkpoint", "Understand pause/resume around high-risk actions.", "Simulate approval request and resume path with audit event.", 20),
  m("governance_security_m1", "governance_security", "Prompt injection resistance", "Recognize tool-exfiltration prompts and policy denial patterns.", "Run injection checks and verify blocked tools remain blocked.", 10),
  m("governance_security_m2", "governance_security", "Immutable audit trail", "Understand why append-only logs are required.", "Review run events and validate no-update/no-delete constraints.", 20),
  m("economics_m1", "economics", "Expected value gating", "Study value thresholds for autonomous execution.", "Simulate low EV task and verify route-to-human policy outcome.", 10),
  m("economics_m2", "economics", "Cost-per-success tracking", "Track where automation creates or destroys value.", "Compute ROI with different model tiers and compare.", 20),
  m("a2a_m1", "a2a", "Handoff contract validation", "Understand required fields in A2A payloads.", "Run `node scripts/dashboard/mock-a2a-handoff.mjs` and validate accepted/rejected payloads.", 10),
  m("a2a_m2", "a2a", "Timeout + retry semantics", "Model acknowledgement and retry strategy for handoff failures.", "Inject delayed response and verify retry policy.", 20),
  m("webmcp_m1", "webmcp", "Capability detection", "Understand WebMCP compatibility checks and risk labels.", "Run `node scripts/dashboard/mock-webmcp-check.mjs` with compatibility flag toggles.", 10),
  m("webmcp_m2", "webmcp", "Fallback architecture", "Design robust fallback to HTTP tools when WebMCP is unavailable.", "Implement and verify fallback in mock route.", 20),
  m("lang_orchestration_m1", "lang_orchestration", "Graph orchestration patterns", "Understand node boundaries and persisted state.", "Model a planner-executor-critic graph with deterministic transitions.", 10),
  m("lang_orchestration_m2", "lang_orchestration", "Trace-driven eval loop", "Use traces to drive prompt or policy improvements.", "Run `node scripts/dashboard/mock-lang-eval-loop.mjs` and interpret promotion decision.", 20),
  m("agent_payments_m1", "agent_payments", "x402 Buyer Pattern", "Set up a wallet and make x402 payments to agent services.", "Run `node scripts/dashboard/mock-payment-gating.mjs` and make a real x402 payment.", 10),
  m("agent_payments_m2", "agent_payments", "x402 Seller Pattern", "Build an API with x402 payment middleware.", "Create a simple API that requires x402 payments and test it.", 20),
  m("agent_payments_m3", "agent_payments", "Budget Controls & Monitoring", "Implement spend controls and payment monitoring.", "Build budget enforcement and alerting for agent payment flows.", 30),
  m("agent_identity_m1", "agent_identity", "ERC-8004 Identity Standard", "Learn the agent identity specification and registry pattern.", "Read the EIP-8004 specification thoroughly.", 10),
  m("agent_identity_m2", "agent_identity", "Agent Registration File", "Create and deploy an agent identity file.", "Build and deploy a `.well-known/agent.json` file for identity verification.", 20),
  m("agent_identity_m3", "agent_identity", "Trust Boundaries & Delegation", "Implement delegation and revocation controls.", "Build a trust boundary system with delegation capabilities.", 30),
  m("voice_agents_m1", "voice_agents", "Real-time Voice Architecture", "Understand voice agent latency budgets and streaming.", "Run `node scripts/dashboard/mock-voice-latency.mjs` and analyze latency patterns.", 10),
  m("voice_agents_m2", "voice_agents", "Voice Quality & Compliance", "Learn voice quality metrics and compliance requirements.", "Implement voice quality monitoring and compliance checks.", 20),
  m("voice_agents_m3", "voice_agents", "Voice Agent Operations", "Understand production voice agent deployment and monitoring.", "Build a production-ready voice agent with monitoring and alerting.", 30),
  m("harness_engineering_m1", "harness_engineering", "Harness Engineering Fundamentals", "System prompts, tools, middleware - the knobs you turn for agent behavior.", "Build a basic harness with progressive disclosure pattern.", 10),
  m("harness_engineering_m2", "harness_engineering", "Self-Verification & Trace Analysis", "Build-verify-fix loops and trace-driven improvement.", "Set up LangSmith tracing and build a self-verification workflow.", 20),
  m("harness_engineering_m3", "harness_engineering", "Repository as System of Record", "Agent-first repository design with AGENTS.md and entropy management.", "Design and implement an agent-first repository structure.", 30),
];

function step(id, milestoneId, orderIndex, type, title, opts = {}) {
  return {
    id,
    milestoneId,
    orderIndex,
    type,
    title,
    contentMarkdown: opts.contentMarkdown || null,
    url: opts.url || null,
    validationCommand: opts.validationCommand || null,
    completed: false,
    completedAt: null,
  };
}

export const STEPS = [
  // ── LLM Fundamentals > M1: Schema-constrained outputs ──
  step("llm_m1_s1", "llm_fundamentals_m1", 1, "read", "OpenAI Structured Outputs guide", {
    url: "https://platform.openai.com/docs/guides/structured-outputs",
  }),
  step("llm_m1_s2", "llm_fundamentals_m1", 2, "watch", "3Blue1Brown: But what is a GPT?", {
    url: "https://www.youtube.com/watch?v=wjZofJX0v4M",
  }),
  step("llm_m1_s3", "llm_fundamentals_m1", 3, "watch", "Andrej Karpathy: Intro to LLMs", {
    url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
  }),
  step("llm_m1_s4", "llm_fundamentals_m1", 4, "article", "Why schemas matter", {
    contentMarkdown: `## Why Schema-Constrained Outputs Matter

When LLMs generate free-form text, they can hallucinate arbitrary JSON structures, invent fields, or produce syntactically invalid output. **Structured outputs** solve this by constraining the model's response to a strict JSON Schema.

### Key benefits
- **Eliminates parse failures** — guaranteed valid JSON every time
- **Reduces hallucination surface** — model can only produce declared fields
- **Enables type safety** — downstream code can trust the shape of responses
- **Simplifies error handling** — no need for complex regex/heuristic parsers

### How it works
1. You define a JSON Schema for the expected response
2. The API constrains token generation to only produce valid instances
3. The response is guaranteed to match your schema

### Trade-offs
- Slightly higher latency due to constrained decoding
- Schema must be expressible in JSON Schema (no arbitrary validation)
- Very complex nested schemas may reduce output quality`,
  }),
  step("llm_m1_s5", "llm_fundamentals_m1", 5, "setup", "Install OpenAI SDK and test structured output", {
    contentMarkdown: "Set up the OpenAI SDK and verify you can make a structured output call.",
    validationCommand: "node -e \"import('openai').then(() => console.log('openai SDK available'))\"",
  }),
  step("llm_m1_s6", "llm_fundamentals_m1", 6, "build", "Tighten the structured output schema", {
    contentMarkdown: `### Exercise
1. Open \`contracts/structured-output.schema.json\`
2. Add stricter constraints: required fields, enum values, maxLength
3. Run \`npm run agentic:demo\` and observe how the model respects constraints
4. Try adding a field the model shouldn't populate and verify it's absent

### Expected outcome
The demo output should match your tightened schema exactly, with no extra fields or invalid values.`,
  }),
  step("llm_m1_s7", "llm_fundamentals_m1", 7, "quiz", "Schema-constrained outputs quiz", {
    contentMarkdown: "Explain why structured outputs reduce hallucination and describe one trade-off of using them in production.",
  }),
  step("llm_m1_s8", "llm_fundamentals_m1", 8, "evidence", "Link your structured output proof", {
    contentMarkdown: "Link a test file, screenshot, or commit showing your tightened schema working correctly.",
  }),

  // ── LLM Fundamentals > M2: Prompt repair path ──
  step("llm_m2_s1", "llm_fundamentals_m2", 1, "read", "Anthropic prompt engineering guide", {
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
  }),
  step("llm_m2_s2", "llm_fundamentals_m2", 2, "watch", "Building reliable LLM applications", {
    url: "https://www.youtube.com/watch?v=bZQun8Y4L2A",
  }),
  step("llm_m2_s3", "llm_fundamentals_m2", 3, "article", "Recovery prompts and fallback parsing", {
    contentMarkdown: `## Prompt Repair Strategies

Even with structured outputs, models can fail. A **repair path** is a systematic approach to handling malformed responses.

### Common failure modes
- Model returns valid JSON but wrong schema shape
- Response truncated due to max_tokens
- API returns an error (rate limit, overload)
- Model refuses the request (safety filter)

### Repair strategies
1. **Retry with rephrased prompt** — simplify or add more constraints
2. **Fallback parser** — use heuristic extraction (find first \`{\`, parse JSON substring)
3. **Model downgrade** — try a faster/cheaper model for simple cases
4. **Mock response** — return a safe default when all else fails

### Best practice
Always define a \`normalizePayload()\` function that takes whatever the model returns and produces a guaranteed-valid structure, using defaults for missing fields.`,
  }),
  step("llm_m2_s4", "llm_fundamentals_m2", 4, "build", "Test the fallback scoring path", {
    contentMarkdown: `### Exercise
1. In the quiz service, find \`parseJsonFromModel()\`
2. Inject a malformed string (e.g. \`"not json at all"\`)
3. Verify the fallback heuristic fires correctly
4. Inject a partial JSON: \`'{"score": 75, "feedback": "ok"'\` (missing closing brace)
5. Verify the repair path extracts the valid portion

### Expected outcome
Both malformed inputs should produce a valid, normalized output without throwing.`,
  }),
  step("llm_m2_s5", "llm_fundamentals_m2", 5, "quiz", "Prompt repair quiz", {
    contentMarkdown: "Describe your recovery strategy when an LLM returns malformed JSON. Include at least two fallback layers.",
  }),
  step("llm_m2_s6", "llm_fundamentals_m2", 6, "evidence", "Link repair path evidence", {
    contentMarkdown: "Link a test file or screenshot showing your fallback parser handling malformed input.",
  }),

  // ── Reliability > M1: Retry classification ──
  step("rel_m1_s1", "reliability_m1", 1, "read", "OpenAI rate limits documentation", {
    url: "https://platform.openai.com/docs/guides/rate-limits",
  }),
  step("rel_m1_s2", "reliability_m1", 2, "read", "Anthropic error handling docs", {
    url: "https://docs.anthropic.com/en/api/errors",
  }),
  step("rel_m1_s3", "reliability_m1", 3, "watch", "Retry patterns for distributed systems", {
    url: "https://www.youtube.com/watch?v=nH4qjFP0HR8",
  }),
  step("rel_m1_s4", "reliability_m1", 4, "article", "Transient vs permanent failures", {
    contentMarkdown: `## Retry Classification

Not all errors should be retried. Retrying a permanent failure wastes resources and can cause cascading problems.

### Transient failures (RETRY)
- **429 Too Many Requests** — rate limit hit, retry with backoff
- **500 Internal Server Error** — server-side transient issue
- **503 Service Unavailable** — temporary overload
- **Network timeouts** — connection dropped

### Permanent failures (DO NOT RETRY)
- **400 Bad Request** — malformed input, fix the request first
- **401 Unauthorized** — invalid API key
- **403 Forbidden** — insufficient permissions
- **404 Not Found** — resource doesn't exist

### Retry strategy
\`\`\`
attempt 1: immediate
attempt 2: wait 1s
attempt 3: wait 2s
attempt 4: wait 4s (max 3 retries typical)
\`\`\`

Add jitter (random 0-500ms) to prevent thundering herd.`,
  }),
  step("rel_m1_s5", "reliability_m1", 5, "build", "Verify retry behavior on 429 vs 400", {
    contentMarkdown: `### Exercise
1. Write a test that mocks a 429 response followed by a 200
2. Verify the retry logic fires and succeeds on the second attempt
3. Write a test that mocks a 400 response
4. Verify the error is thrown immediately without retry

### Expected outcome
429 → retry → success. 400 → immediate error. No infinite loops.`,
  }),
  step("rel_m1_s6", "reliability_m1", 6, "quiz", "Retry classification quiz", {
    contentMarkdown: "Given a 429 and a 400 error from an LLM API, explain exactly which should be retried and why. Include your backoff strategy.",
  }),
  step("rel_m1_s7", "reliability_m1", 7, "evidence", "Link retry test evidence", {
    contentMarkdown: "Link your retry behavior test file showing 429 retry and 400 non-retry paths.",
  }),

  // ── Reliability > M2: Idempotency safety ──
  step("rel_m2_s1", "reliability_m2", 1, "read", "Stripe idempotency keys guide", {
    url: "https://docs.stripe.com/api/idempotent-requests",
  }),
  step("rel_m2_s2", "reliability_m2", 2, "article", "Idempotency in agent systems", {
    contentMarkdown: `## Idempotency for Tool Calls

When an agent retries a tool call, the external system may execute the action twice. **Idempotency keys** prevent duplicate side effects.

### The problem
1. Agent calls \`send_email(to: "user@example.com")\`
2. Network timeout — agent doesn't know if it succeeded
3. Agent retries the same call
4. User receives two identical emails

### The solution
Generate a deterministic idempotency key from the call parameters:
\`\`\`javascript
const key = crypto.createHash('sha256')
  .update(JSON.stringify({ tool: 'send_email', params: { to, subject, body } }))
  .digest('hex');
\`\`\`

### Rules
- Same input → same key → same result (no duplicate side effect)
- Different input → different key → independent execution
- Keys should expire after a reasonable TTL (e.g. 24 hours)`,
  }),
  step("rel_m2_s3", "reliability_m2", 3, "build", "Generate deterministic idempotency keys", {
    contentMarkdown: `### Exercise
1. Create a function \`generateIdempotencyKey(toolName, params)\`
2. It should produce the same hash for identical inputs
3. Test with a sequence of 5 fake tool calls
4. Verify duplicate calls produce the same key
5. Verify different calls produce different keys

### Expected outcome
A deterministic, collision-resistant key generator that prevents duplicate tool executions.`,
  }),
  step("rel_m2_s4", "reliability_m2", 4, "quiz", "Idempotency quiz", {
    contentMarkdown: "Explain when and why idempotency keys are critical in agentic systems. Give a concrete example of what goes wrong without them.",
  }),
  step("rel_m2_s5", "reliability_m2", 5, "evidence", "Link idempotency evidence", {
    contentMarkdown: "Link your idempotency key generator code or test output.",
  }),

  // ── RAG + Memory > M1: Memory tier ranking ──
  step("rag_m1_s1", "rag_memory_m1", 1, "read", "LangChain memory documentation", {
    url: "https://python.langchain.com/docs/concepts/memory/",
  }),
  step("rag_m1_s2", "rag_memory_m1", 2, "watch", "RAG explained in 10 minutes", {
    url: "https://www.youtube.com/watch?v=T-D1OfcDW1M",
  }),
  step("rag_m1_s3", "rag_memory_m1", 3, "article", "Memory tier architecture", {
    contentMarkdown: `## Memory Tiers in Agent Systems

Agents need different types of memory for different purposes:

### Tier 1: Working Memory (Context Window)
- Current conversation + recent tool results
- Fastest access, limited by context window size
- Cleared between sessions

### Tier 2: Episodic Memory (Session History)
- Summaries of past conversations and actions
- Retrieved by relevance to current task
- Persisted across sessions, pruned by age

### Tier 3: Semantic Memory (Knowledge Base)
- Facts, procedures, domain knowledge
- Retrieved by vector similarity
- Long-lived, updated by explicit learning

### Ranking priority
When retrieving context, rank by:
1. **Recency** — fresher memories score higher
2. **Relevance** — semantic similarity to current query
3. **Importance** — user-flagged or high-confidence items
4. **Frequency** — often-accessed memories may be more useful`,
  }),
  step("rag_m1_s4", "rag_memory_m1", 4, "build", "Compare old vs fresh record outcomes", {
    contentMarkdown: `### Exercise
1. Create a mock memory store with 10 records (5 old, 5 fresh)
2. Implement a ranking function that considers recency and relevance
3. Query with a test prompt and verify fresh, relevant records rank highest
4. Query with a different prompt and verify relevance beats recency

### Expected outcome
A ranking function that correctly balances recency and relevance, with tunable weights.`,
  }),
  step("rag_m1_s5", "rag_memory_m1", 5, "quiz", "Memory tier quiz", {
    contentMarkdown: "Describe the three memory tiers and explain when an agent should use each one. Include a concrete example.",
  }),
  step("rag_m1_s6", "rag_memory_m1", 6, "evidence", "Link memory ranking evidence", {
    contentMarkdown: "Link your memory ranking implementation or test output.",
  }),

  // ── RAG + Memory > M2: Hybrid retrieval quality ──
  step("rag_m2_s1", "rag_memory_m2", 1, "read", "LangChain retriever documentation", {
    url: "https://python.langchain.com/docs/concepts/retrievers/",
  }),
  step("rag_m2_s2", "rag_memory_m2", 2, "watch", "Hybrid search: combining BM25 and vector", {
    url: "https://www.youtube.com/watch?v=lYxGYXjfrNI",
  }),
  step("rag_m2_s3", "rag_memory_m2", 3, "article", "Reranking strategy", {
    contentMarkdown: `## Hybrid Retrieval and Reranking

No single retrieval method is best for all queries. **Hybrid retrieval** combines multiple methods:

### Lexical (BM25/TF-IDF)
- Good for exact keyword matches
- Fast and well-understood
- Misses semantic similarity

### Vector (Embedding similarity)
- Good for semantic meaning
- Captures paraphrases and related concepts
- Can miss exact terms

### Hybrid approach
1. Run both lexical and vector search
2. Merge results using Reciprocal Rank Fusion (RRF)
3. Rerank top-N results with a cross-encoder
4. Return top-K final results

### Measuring quality
- **Precision@K** — what fraction of top-K results are relevant?
- **Recall@K** — what fraction of all relevant docs appear in top-K?
- **MRR** — how high is the first relevant result?`,
  }),
  step("rag_m2_s4", "rag_memory_m2", 4, "build", "Benchmark rerank on/off precision", {
    contentMarkdown: `### Exercise
1. Create a test dataset: 20 documents with known relevance labels
2. Implement basic vector search (cosine similarity on embeddings)
3. Add a reranking step (sort by a scoring function)
4. Measure precision@5 with and without reranking
5. Compare and document the improvement

### Expected outcome
Measurable precision improvement when reranking is enabled.`,
  }),
  step("rag_m2_s5", "rag_memory_m2", 5, "quiz", "Hybrid retrieval quiz", {
    contentMarkdown: "Explain the trade-offs between lexical and vector retrieval. When would you use hybrid search vs. pure vector search?",
  }),
  step("rag_m2_s6", "rag_memory_m2", 6, "evidence", "Link retrieval benchmark evidence", {
    contentMarkdown: "Link your benchmark results comparing retrieval with and without reranking.",
  }),

  // ── Agent Payments > M1: x402 Buyer Pattern ──
  step("pay_m1_s1", "agent_payments_m1", 1, "read", "x402 Protocol specification", {
    url: "https://docs.x402.org/protocol/",
  }),
  step("pay_m1_s2", "agent_payments_m1", 2, "read", "Base blockchain agent payments guide", {
    url: "https://docs.base.org/tools/agent-payments",
  }),
  step("pay_m1_s3", "agent_payments_m1", 3, "article", "Understanding x402 payment flows", {
    contentMarkdown: `## x402 Payment Protocol

x402 enables agents to make and receive payments automatically using blockchain rails.

### Core concepts
- **Payment request** — agent requests payment for a service
- **Payment proof** — cryptographic proof of payment
- **Service delivery** — service provided after payment verification

### Buyer pattern
1. Agent receives payment request (amount, address, chain)
2. Agent checks budget constraints and approvals
3. Agent executes payment transaction
4. Agent submits proof to service provider
5. Service provider verifies and delivers service

### Benefits
- Automated micropayments for agent services
- No human intervention required for small transactions
- Cryptographic proof of payment`,
  }),
  step("pay_m1_s4", "agent_payments_m1", 4, "setup", "Set up agent wallet", {
    contentMarkdown: "Set up a testnet wallet with Base USDC for testing x402 payments.",
    validationCommand: "cast balance $AGENT_ADDRESS --rpc-url https://sepolia.base.org",
  }),
  step("pay_m1_s5", "agent_payments_m1", 5, "build", "Make a test x402 payment", {
    contentMarkdown: `### Exercise
1. Use the mock payment gating script
2. Configure a small test payment (0.01 USDC)
3. Execute the payment and capture the proof
4. Verify the payment was successful

### Expected outcome
A successful x402 payment with proof that can be verified on-chain.`,
  }),
  step("pay_m1_s6", "agent_payments_m1", 6, "quiz", "x402 buyer quiz", {
    contentMarkdown: "Explain the x402 buyer pattern and describe when an agent should reject a payment request.",
  }),
  step("pay_m1_s7", "agent_payments_m1", 7, "evidence", "Link payment proof", {
    contentMarkdown: "Link the transaction hash or proof from your test x402 payment.",
  }),

  // ── Agent Payments > M2: x402 Seller Pattern ──
  step("pay_m2_s1", "agent_payments_m2", 1, "read", "x402 seller implementation guide", {
    url: "https://docs.x402.org/seller/",
  }),
  step("pay_m2_s2", "agent_payments_m2", 2, "article", "Payment middleware patterns", {
    contentMarkdown: `## x402 Seller Implementation

As a service provider, you need to verify payments before delivering services.

### Middleware pattern
\`\`\`javascript
async function x402Middleware(req, res, next) {
  const proof = req.headers['x-x402-proof'];
  if (!proof) return res.status(402).json({ error: 'Payment required' });
  
  const isValid = await verifyPayment(proof, req.body);
  if (!isValid) return res.status(402).json({ error: 'Invalid payment' });
  
  next();
}
\`\`\`

### Verification steps
1. Extract payment proof from headers
2. Verify proof signature
3. Check payment amount matches service cost
4. Ensure proof hasn't been used before (replay protection)
5. Verify on-chain transaction exists`,
  }),
  step("pay_m2_s3", "agent_payments_m2", 3, "build", "Build payment-gated API", {
    contentMarkdown: `### Exercise
1. Create a simple Express API endpoint
2. Add x402 payment middleware
3. Test with a valid payment proof
4. Test with invalid/missing payment proof
5. Verify proper error responses

### Expected outcome
A working API that only serves requests with valid x402 payments.`,
  }),
  step("pay_m2_s4", "agent_payments_m2", 4, "quiz", "x402 seller quiz", {
    contentMarkdown: "Explain the seller verification pattern and list three security considerations for payment middleware.",
  }),
  step("pay_m2_s5", "agent_payments_m2", 5, "evidence", "Link seller API evidence", {
    contentMarkdown: "Link your payment-gated API code or test results.",
  }),

  // ── Agent Payments > M3: Budget Controls & Monitoring ──
  step("pay_m3_s1", "agent_payments_m3", 1, "article", "Agent spending controls", {
    contentMarkdown: `## Budget Controls for Agent Payments

Autonomous agents need spending limits to prevent runaway costs.

### Control layers
1. **Per-transaction limits** — max amount per single payment
2. **Time-based budgets** — hourly/daily/monthly spending caps
3. **Service allowlists** — only approved payment recipients
4. **Human approval gates** — require confirmation for large amounts

### Monitoring patterns
- Real-time spend tracking
- Budget utilization alerts
- Unusual spending pattern detection
- Cost per service/outcome analysis`,
  }),
  step("pay_m3_s2", "agent_payments_m3", 2, "build", "Implement budget controls", {
    contentMarkdown: `### Exercise
1. Build a budget tracking system
2. Add daily and per-transaction limits
3. Implement alerting when limits are approached
4. Test with various spending scenarios
5. Verify limits are enforced correctly

### Expected outcome
A robust budget system that prevents overspending while alerting on unusual patterns.`,
  }),
  step("pay_m3_s3", "agent_payments_m3", 3, "quiz", "Budget controls quiz", {
    contentMarkdown: "Design a budget control system for an agent that makes API calls. Include three types of limits and explain when human approval should be required.",
  }),
  step("pay_m3_s4", "agent_payments_m3", 4, "evidence", "Link budget system evidence", {
    contentMarkdown: "Link your budget control implementation or monitoring dashboard.",
  }),

  // ── Agent Identity > M1: ERC-8004 Identity Standard ──
  step("id_m1_s1", "agent_identity_m1", 1, "read", "EIP-8004: Agent Identity specification", {
    url: "https://eips.ethereum.org/EIPS/eip-8004",
  }),
  step("id_m1_s2", "agent_identity_m1", 2, "read", "Agent identity use cases", {
    url: "https://ethereum-magicians.org/t/eip-8004-agent-identity/",
  }),
  step("id_m1_s3", "agent_identity_m1", 3, "article", "Agent identity fundamentals", {
    contentMarkdown: `## Agent Identity with ERC-8004

ERC-8004 defines a standard for agent identity on Ethereum.

### Core concepts
- **Agent address** — unique on-chain identifier
- **Identity document** — off-chain metadata about capabilities
- **Delegation** — granting permissions to act on behalf of others
- **Revocation** — removing delegated permissions

### Why identity matters
- Trust: know which agent you're interacting with
- Capability discovery: what can this agent do?
- Accountability: audit trail of agent actions
- Delegation: controlled permission sharing`,
  }),
  step("id_m1_s4", "agent_identity_m1", 4, "quiz", "Agent identity quiz", {
    contentMarkdown: "Explain why agent identity is important and describe the key components of the ERC-8004 standard.",
  }),
  step("id_m1_s5", "agent_identity_m1", 5, "evidence", "Link ERC-8004 research", {
    contentMarkdown: "Link your notes or analysis of the ERC-8004 specification.",
  }),

  // ── Agent Identity > M2: Agent Registration File ──
  step("id_m2_s1", "agent_identity_m2", 1, "article", "Agent registration file format", {
    contentMarkdown: `## Agent Registration File

The \`.well-known/agent.json\` file describes an agent's identity and capabilities.

### File structure
\`\`\`json
{
  "id": "0x123...abc",
  "name": "My Agent",
  "description": "AI agent for task automation",
  "capabilities": ["web_search", "email", "calendar"],
  "endpoints": {
    "api": "https://api.myagent.com/v1",
    "webhook": "https://api.myagent.com/webhook"
  },
  "delegation": {
    "allowed": true,
    "maxDuration": "24h"
  }
}
\`\`\`

### Best practices
- Use HTTPS for all endpoints
- Include capability descriptions
- Set reasonable delegation limits
- Provide contact information`,
  }),
  step("id_m2_s2", "agent_identity_m2", 2, "build", "Create agent.json file", {
    contentMarkdown: `### Exercise
1. Design an agent identity document
2. Create the JSON file with your agent's capabilities
3. Deploy it to \`.well-known/agent.json\` on a domain
4. Verify it's accessible via HTTP GET
5. Test with an agent identity parser

### Expected outcome
A valid agent.json file deployed and accessible via HTTPS.`,
  }),
  step("id_m2_s3", "agent_identity_m2", 3, "quiz", "Agent registration quiz", {
    contentMarkdown: "Design an agent.json file for a trading bot. Include appropriate capabilities and delegation settings.",
  }),
  step("id_m2_s4", "agent_identity_m2", 4, "evidence", "Link deployed agent.json", {
    contentMarkdown: "Link the URL of your deployed agent.json file.",
  }),

  // ── Agent Identity > M3: Trust Boundaries & Delegation ──
  step("id_m3_s1", "agent_identity_m3", 1, "article", "Delegation and trust boundaries", {
    contentMarkdown: `## Trust Boundaries in Agent Systems

Delegation allows agents to act on behalf of others, but requires careful trust management.

### Trust levels
1. **Full trust** — unlimited delegation (dangerous)
2. **Scoped trust** — specific actions/resources only
3. **Time-limited** — delegation expires automatically
4. **Amount-limited** — spending caps and transaction limits

### Implementation patterns
- Smart contract-based delegation
- API key scoping and rotation
- Multi-signature approvals for high-risk actions
- Audit logging for all delegated actions`,
  }),
  step("id_m3_s2", "agent_identity_m3", 2, "build", "Implement delegation system", {
    contentMarkdown: `### Exercise
1. Design a delegation contract or API
2. Implement scoped permissions (read-only, spend limits, etc.)
3. Add time-based expiration
4. Build revocation functionality
5. Test delegation lifecycle (grant → use → revoke)

### Expected outcome
A working delegation system with proper scope and time limits.`,
  }),
  step("id_m3_s3", "agent_identity_m3", 3, "quiz", "Trust boundaries quiz", {
    contentMarkdown: "Design a delegation system for agents managing portfolio investments. Include appropriate trust boundaries and safety mechanisms.",
  }),
  step("id_m3_s4", "agent_identity_m3", 4, "evidence", "Link delegation system evidence", {
    contentMarkdown: "Link your delegation implementation or test results.",
  }),

  // ── Voice Agents > M1: Real-time Voice Architecture ──
  step("voice_m1_s1", "voice_agents_m1", 1, "read", "Real-time voice processing architectures", {
    url: "https://docs.deepgram.com/docs/streaming-api",
  }),
  step("voice_m1_s2", "voice_agents_m1", 2, "watch", "Build a voice agent with LangChain", {
    url: "https://www.youtube.com/watch?v=kDPzdyX76cg",
  }),
  step("voice_m1_s3", "voice_agents_m1", 3, "article", "Voice agent latency budgets", {
    contentMarkdown: `## Voice Agent Latency Management

Voice interactions are latency-sensitive. Users expect near-real-time responses.

### Latency budget
- **Speech-to-text**: <300ms
- **LLM processing**: <500ms
- **Text-to-speech**: <200ms
- **Total round-trip**: <1000ms

### Optimization strategies
1. **Streaming STT** — start processing before complete utterance
2. **Parallel processing** — STT and intent detection simultaneously  
3. **Response caching** — pre-generate common responses
4. **Interrupt handling** — stop generation when user speaks
5. **Fallback responses** — "I'm thinking..." when processing takes time

### Architecture patterns
- WebRTC for low-latency audio
- WebSocket connections for real-time data
- Edge deployment for reduced network latency`,
  }),
  step("voice_m1_s4", "voice_agents_m1", 4, "build", "Analyze voice latency patterns", {
    contentMarkdown: `### Exercise
1. Run the mock voice latency script
2. Measure STT, LLM, and TTS latencies separately
3. Identify bottlenecks in the pipeline
4. Test interrupt handling
5. Calculate total round-trip times

### Expected outcome
Detailed latency analysis with identified optimization opportunities.`,
  }),
  step("voice_m1_s5", "voice_agents_m1", 5, "quiz", "Voice latency quiz", {
    contentMarkdown: "Explain the components of voice agent latency and describe three strategies to stay under 1000ms total response time.",
  }),
  step("voice_m1_s6", "voice_agents_m1", 6, "evidence", "Link latency analysis", {
    contentMarkdown: "Link your voice latency measurement results.",
  }),

  // ── Voice Agents > M2: Voice Quality & Compliance ──
  step("voice_m2_s1", "voice_agents_m2", 1, "read", "Voice AI quality metrics", {
    url: "https://platform.openai.com/docs/guides/speech-to-text",
  }),
  step("voice_m2_s2", "voice_agents_m2", 2, "article", "Voice compliance requirements", {
    contentMarkdown: `## Voice Quality and Compliance

Voice agents must meet quality standards and regulatory requirements.

### Quality metrics
- **Word Error Rate (WER)** — accuracy of speech recognition
- **Response appropriateness** — relevance and correctness
- **Voice naturalness** — TTS quality and prosody
- **Conversation coherence** — maintaining context over turns

### Compliance considerations
- **Call recording notifications** — inform users of recording
- **Data retention policies** — how long to keep voice data
- **Privacy protection** — encryption and access controls
- **Consent management** — opt-in/opt-out mechanisms

### Monitoring approach
- Real-time quality scoring
- Human-in-the-loop auditing
- Automated compliance checks
- User feedback collection`,
  }),
  step("voice_m2_s3", "voice_agents_m2", 3, "build", "Implement quality monitoring", {
    contentMarkdown: `### Exercise
1. Define quality metrics for your voice agent
2. Implement real-time quality scoring
3. Add compliance check automation
4. Create alert system for quality degradation
5. Test with various voice inputs

### Expected outcome
A quality monitoring system that tracks voice agent performance and compliance.`,
  }),
  step("voice_m2_s4", "voice_agents_m2", 4, "quiz", "Voice quality quiz", {
    contentMarkdown: "Design a quality assurance system for a voice agent handling customer service calls. Include metrics, compliance checks, and escalation procedures.",
  }),
  step("voice_m2_s5", "voice_agents_m2", 5, "evidence", "Link quality monitoring evidence", {
    contentMarkdown: "Link your voice quality monitoring implementation.",
  }),

  // ── Voice Agents > M3: Voice Agent Operations ──
  step("voice_m3_s1", "voice_agents_m3", 1, "article", "Production voice agent deployment", {
    contentMarkdown: `## Voice Agent Operations

Running voice agents in production requires robust infrastructure and monitoring.

### Deployment considerations
- **Scalability** — handle concurrent voice sessions
- **Reliability** — minimize dropped calls and errors
- **Security** — protect voice data and prevent abuse
- **Monitoring** — real-time performance tracking

### Operational patterns
- Load balancing across agent instances
- Circuit breakers for external service failures  
- Graceful degradation when services are unavailable
- Health checks and auto-recovery mechanisms

### Monitoring stack
- Call success/failure rates
- Latency percentiles (p50, p95, p99)
- Resource utilization (CPU, memory, bandwidth)
- Error rates by component (STT, LLM, TTS)`,
  }),
  step("voice_m3_s2", "voice_agents_m3", 2, "build", "Build production voice agent", {
    contentMarkdown: `### Exercise
1. Design a scalable voice agent architecture
2. Implement health checks and monitoring
3. Add error handling and graceful degradation
4. Set up alerting for critical failures
5. Test under load with multiple concurrent sessions

### Expected outcome
A production-ready voice agent with proper monitoring and error handling.`,
  }),
  step("voice_m3_s3", "voice_agents_m3", 3, "quiz", "Voice operations quiz", {
    contentMarkdown: "Describe the key operational challenges for voice agents and your approach to monitoring and alerting.",
  }),
  step("voice_m3_s4", "voice_agents_m3", 4, "evidence", "Link production deployment evidence", {
    contentMarkdown: "Link your production voice agent deployment or monitoring dashboard.",
  }),

  // ── Harness Engineering > M1: Fundamentals ──
  step("harness_m1_s1", "harness_engineering_m1", 1, "read", "OpenAI: Harness Engineering", {
    url: "https://openai.com/index/harness-engineering/",
  }),
  step("harness_m1_s2", "harness_engineering_m1", 2, "read", "LangChain: Improving Deep Agents", {
    url: "https://blog.langchain.com/improving-deep-agents-with-harness-engineering/",
  }),
  step("harness_m1_s3", "harness_engineering_m1", 3, "watch", "From Context Engineering to AI Agent Harnesses", {
    url: "https://www.youtube.com/watch?v=2Muxy3wE-E0",
  }),
  step("harness_m1_s4", "harness_engineering_m1", 4, "article", "What is a Harness?", {
    contentMarkdown: `## Understanding Agent Harnesses

A **harness** is the infrastructure that wraps around an AI model to make it useful in production.

### The Three Knobs
1. **System prompt** — defines role, constraints, and behavior
2. **Tools** — external capabilities the agent can use
3. **Middleware** — guardrails, logging, validation, and control flow

### Key principle: Progressive Disclosure
- AGENTS.md as table of contents (~100 lines)
- Link to detailed docs/ for deep knowledge
- Agent legibility over human legibility
- Don't overwhelm with everything at once

### What makes a good harness?
- **Deterministic** — same input produces same output (when possible)
- **Observable** — every decision is logged and traceable
- **Controllable** — clear knobs to tune behavior
- **Safe** — bounded actions with approval gates`,
  }),
  step("harness_m1_s5", "harness_engineering_m1", 5, "build", "Design a basic harness", {
    contentMarkdown: `### Exercise
1. Create an AGENTS.md file (~100 lines) for a simple agent
2. Define 3-5 tools with clear interfaces  
3. Write system prompt with role and constraints
4. Add basic middleware for logging and validation
5. Test the progressive disclosure pattern

### Expected outcome
A working agent harness with progressive disclosure and clear separation of concerns.`,
  }),
  step("harness_m1_s6", "harness_engineering_m1", 6, "quiz", "Harness fundamentals quiz", {
    contentMarkdown: "Explain the difference between prompt engineering and harness engineering. What are the three main knobs and why is progressive disclosure important?",
  }),
  step("harness_m1_s7", "harness_engineering_m1", 7, "evidence", "Link harness implementation", {
    contentMarkdown: "Link your AGENTS.md file and basic harness code.",
  }),

  // ── Harness Engineering > M2: Self-Verification & Trace Analysis ──
  step("harness_m2_s1", "harness_engineering_m2", 1, "read", "Codex Execution Plans", {
    url: "https://cookbook.openai.com/articles/codex_exec_plans",
  }),
  step("harness_m2_s2", "harness_engineering_m2", 2, "read", "Ralph Wiggum Loop", {
    url: "https://ghuntley.com/loop/",
  }),
  step("harness_m2_s3", "harness_engineering_m2", 3, "watch", "LangSmith tracing tutorial", {
    url: "https://www.youtube.com/watch?v=fA9b4D8IsPQ",
  }),
  step("harness_m2_s4", "harness_engineering_m2", 4, "article", "Build-Verify-Fix Loop", {
    contentMarkdown: `## The Build-Verify-Fix Loop

Most agents skip verification. They build something and assume it worked.

### The loop
1. **Planning & Discovery** — understand requirements
2. **Build** — implement the solution  
3. **Verify against spec** — not against your own code!
4. **Fix** — address gaps found in verification

### Why agents skip verification
- They're trained to be confident
- Verification feels like extra work
- No clear success criteria

### Forcing verification
- PreCompletionChecklist middleware
- Explicit verification steps in the workflow
- Test-driven development patterns
- External validation tools`,
  }),
  step("harness_m2_s5", "harness_engineering_m2", 5, "article", "Trace-Driven Improvement", {
    contentMarkdown: `## Using Traces for Harness Improvement

Like machine learning boosting: focus on mistakes from previous runs.

### Process
1. **Run agent workflows** — capture LangSmith traces
2. **Parallel error analysis** — identify failure patterns
3. **Synthesize findings** — categorize and prioritize issues
4. **Targeted harness changes** — adjust prompts, tools, or middleware

### What to look for in traces
- Repeated mistakes (same error pattern)
- Tool usage anti-patterns (wrong tool selection)
- Prompt drift (agents ignoring instructions)
- Context overflow (too much information)`,
  }),
  step("harness_m2_s6", "harness_engineering_m2", 6, "build", "Set up trace analysis workflow", {
    contentMarkdown: `### Exercise
1. Set up LangSmith tracing for an agent
2. Run the agent on 10 different tasks
3. Analyze traces for failure patterns
4. Identify 3 specific improvements to make
5. Implement changes and re-test

### Expected outcome
A trace analysis workflow that identifies concrete harness improvements.`,
  }),
  step("harness_m2_s7", "harness_engineering_m2", 7, "quiz", "Self-verification quiz", {
    contentMarkdown: "Describe the build-verify-fix loop and explain why agents tend to skip verification. How do you force it in your harness?",
  }),
  step("harness_m2_s8", "harness_engineering_m2", 8, "evidence", "Link trace analysis results", {
    contentMarkdown: "Link your LangSmith traces and improvement analysis.",
  }),

  // ── Harness Engineering > M3: Repository as System of Record ──
  step("harness_m3_s1", "harness_engineering_m3", 1, "read", "ARCHITECTURE.md pattern", {
    url: "https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html",
  }),
  step("harness_m3_s2", "harness_engineering_m3", 2, "article", "Agent-First Repository Design", {
    contentMarkdown: `## Repository Design for Agent-First Development

When agents are the primary consumers of your code, organize for their needs.

### Key principles
- **AGENTS.md as table of contents** (~100 lines, not comprehensive)
- **docs/ as structured knowledge base** (detailed, searchable)
- **Plans as first-class versioned artifacts**
- **Progressive disclosure** (overview → details → deep dive)
- **Mechanical enforcement** (linters, CI, automated checks)

### Repository structure
\`\`\`
AGENTS.md          # Agent landing page (~100 lines)
docs/
  guides/          # How-to guides  
  reference/       # API docs and specs
  architecture/    # System design docs
plans/             # Versioned planning artifacts
tools/             # Agent-accessible utilities
\`\`\``,
  }),
  step("harness_m3_s3", "harness_engineering_m3", 3, "article", "Entropy Management", {
    contentMarkdown: `## Fighting Repository Entropy

Code and documentation naturally decay. Fight entropy with automation.

### Golden principles
1. **Documentation close to code** — co-locate context
2. **Single source of truth** — no duplicate information
3. **Automated freshness checks** — detect stale content
4. **Progressive enhancement** — start simple, add detail over time

### Entropy management strategies  
- **Doc-gardening agents** — automated cleanup and updates
- **Link checking** — verify all references are valid
- **Freshness scoring** — highlight outdated content
- **Continuous small increments** over painful big-bang updates
- **Friday "AI slop" cleanup** sessions → automate them`,
  }),
  step("harness_m3_s4", "harness_engineering_m3", 4, "build", "Design agent-first repository", {
    contentMarkdown: `### Exercise
1. Create AGENTS.md (~100 lines) for a project
2. Set up docs/ with proper organization
3. Add automated link checking
4. Implement a doc-gardening workflow
5. Test with an agent reading the repository

### Expected outcome
An agent-first repository with mechanical enforcement and entropy management.`,
  }),
  step("harness_m3_s5", "harness_engineering_m3", 5, "quiz", "Repository design quiz", {
    contentMarkdown: "Why should AGENTS.md be ~100 lines instead of comprehensive? What happens when context rots and how do you prevent it?",
  }),
  step("harness_m3_s6", "harness_engineering_m3", 6, "evidence", "Link repository design", {
    contentMarkdown: "Link your agent-first repository with AGENTS.md and docs/ structure.",
  }),
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
    steps: structuredClone(STEPS),
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
