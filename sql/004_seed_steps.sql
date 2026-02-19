INSERT INTO learning.steps (id, milestone_id, order_index, type, title, content_markdown, url, validation_command, completed) VALUES
  ('llm_m1_s1', 'llm_fundamentals_m1', 1, 'read', 'OpenAI Structured Outputs guide', NULL, 'https://platform.openai.com/docs/guides/structured-outputs', NULL, false),
  ('llm_m1_s2', 'llm_fundamentals_m1', 2, 'watch', '3Blue1Brown: But what is a GPT?', NULL, 'https://www.youtube.com/watch?v=wjZofJX0v4M', NULL, false),
  ('llm_m1_s3', 'llm_fundamentals_m1', 3, 'watch', 'Andrej Karpathy: Intro to LLMs', NULL, 'https://www.youtube.com/watch?v=zjkBMFhNj_g', NULL, false),
  ('llm_m1_s4', 'llm_fundamentals_m1', 4, 'article', 'Why schemas matter', '## Why Schema-Constrained Outputs Matter

When LLMs generate free-form text, they can hallucinate arbitrary JSON structures, invent fields, or produce syntactically invalid output. **Structured outputs** solve this by constraining the model''s response to a strict JSON Schema.

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
- Very complex nested schemas may reduce output quality', NULL, NULL, false),
  ('llm_m1_s5', 'llm_fundamentals_m1', 5, 'setup', 'Install OpenAI SDK and test structured output', 'Set up the OpenAI SDK and verify you can make a structured output call.', NULL, 'node -e "import(''openai'').then(() => console.log(''openai SDK available''))"', false),
  ('llm_m1_s6', 'llm_fundamentals_m1', 6, 'build', 'Tighten the structured output schema', '### Exercise
1. Open `contracts/structured-output.schema.json`
2. Add stricter constraints: required fields, enum values, maxLength
3. Run `npm run agentic:demo` and observe how the model respects constraints
4. Try adding a field the model shouldn''t populate and verify it''s absent

### Expected outcome
The demo output should match your tightened schema exactly, with no extra fields or invalid values.', NULL, NULL, false),
  ('llm_m1_s7', 'llm_fundamentals_m1', 7, 'quiz', 'Schema-constrained outputs quiz', 'Explain why structured outputs reduce hallucination and describe one trade-off of using them in production.', NULL, NULL, false),
  ('llm_m1_s8', 'llm_fundamentals_m1', 8, 'evidence', 'Link your structured output proof', 'Link a test file, screenshot, or commit showing your tightened schema working correctly.', NULL, NULL, false),
  ('llm_m2_s1', 'llm_fundamentals_m2', 1, 'read', 'Anthropic prompt engineering guide', NULL, 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', NULL, false),
  ('llm_m2_s2', 'llm_fundamentals_m2', 2, 'watch', 'Building reliable LLM applications', NULL, 'https://www.youtube.com/watch?v=bZQun8Y4L2A', NULL, false),
  ('llm_m2_s3', 'llm_fundamentals_m2', 3, 'article', 'Recovery prompts and fallback parsing', '## Prompt Repair Strategies

Even with structured outputs, models can fail. A **repair path** is a systematic approach to handling malformed responses.

### Common failure modes
- Model returns valid JSON but wrong schema shape
- Response truncated due to max_tokens
- API returns an error (rate limit, overload)
- Model refuses the request (safety filter)

### Repair strategies
1. **Retry with rephrased prompt** — simplify or add more constraints
2. **Fallback parser** — use heuristic extraction (find first `{`, parse JSON substring)
3. **Model downgrade** — try a faster/cheaper model for simple cases
4. **Mock response** — return a safe default when all else fails

### Best practice
Always define a `normalizePayload()` function that takes whatever the model returns and produces a guaranteed-valid structure, using defaults for missing fields.', NULL, NULL, false),
  ('llm_m2_s4', 'llm_fundamentals_m2', 4, 'build', 'Test the fallback scoring path', '### Exercise
1. In the quiz service, find `parseJsonFromModel()`
2. Inject a malformed string (e.g. `"not json at all"`)
3. Verify the fallback heuristic fires correctly
4. Inject a partial JSON: `''{"score": 75, "feedback": "ok"''` (missing closing brace)
5. Verify the repair path extracts the valid portion

### Expected outcome
Both malformed inputs should produce a valid, normalized output without throwing.', NULL, NULL, false),
  ('llm_m2_s5', 'llm_fundamentals_m2', 5, 'quiz', 'Prompt repair quiz', 'Describe your recovery strategy when an LLM returns malformed JSON. Include at least two fallback layers.', NULL, NULL, false),
  ('llm_m2_s6', 'llm_fundamentals_m2', 6, 'evidence', 'Link repair path evidence', 'Link a test file or screenshot showing your fallback parser handling malformed input.', NULL, NULL, false),
  ('rel_m1_s1', 'reliability_m1', 1, 'read', 'OpenAI rate limits documentation', NULL, 'https://platform.openai.com/docs/guides/rate-limits', NULL, false),
  ('rel_m1_s2', 'reliability_m1', 2, 'read', 'Anthropic error handling docs', NULL, 'https://docs.anthropic.com/en/api/errors', NULL, false),
  ('rel_m1_s3', 'reliability_m1', 3, 'watch', 'Retry patterns for distributed systems', NULL, 'https://www.youtube.com/watch?v=nH4qjFP0HR8', NULL, false),
  ('rel_m1_s4', 'reliability_m1', 4, 'article', 'Transient vs permanent failures', '## Retry Classification

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
- **404 Not Found** — resource doesn''t exist

### Retry strategy
```
attempt 1: immediate
attempt 2: wait 1s
attempt 3: wait 2s
attempt 4: wait 4s (max 3 retries typical)
```

Add jitter (random 0-500ms) to prevent thundering herd.', NULL, NULL, false),
  ('rel_m1_s5', 'reliability_m1', 5, 'build', 'Verify retry behavior on 429 vs 400', '### Exercise
1. Write a test that mocks a 429 response followed by a 200
2. Verify the retry logic fires and succeeds on the second attempt
3. Write a test that mocks a 400 response
4. Verify the error is thrown immediately without retry

### Expected outcome
429 → retry → success. 400 → immediate error. No infinite loops.', NULL, NULL, false),
  ('rel_m1_s6', 'reliability_m1', 6, 'quiz', 'Retry classification quiz', 'Given a 429 and a 400 error from an LLM API, explain exactly which should be retried and why. Include your backoff strategy.', NULL, NULL, false),
  ('rel_m1_s7', 'reliability_m1', 7, 'evidence', 'Link retry test evidence', 'Link your retry behavior test file showing 429 retry and 400 non-retry paths.', NULL, NULL, false),
  ('rel_m2_s1', 'reliability_m2', 1, 'read', 'Stripe idempotency keys guide', NULL, 'https://docs.stripe.com/api/idempotent-requests', NULL, false),
  ('rel_m2_s2', 'reliability_m2', 2, 'article', 'Idempotency in agent systems', '## Idempotency for Tool Calls

When an agent retries a tool call, the external system may execute the action twice. **Idempotency keys** prevent duplicate side effects.

### The problem
1. Agent calls `send_email(to: "user@example.com")`
2. Network timeout — agent doesn''t know if it succeeded
3. Agent retries the same call
4. User receives two identical emails

### The solution
Generate a deterministic idempotency key from the call parameters:
```javascript
const key = crypto.createHash(''sha256'')
  .update(JSON.stringify({ tool: ''send_email'', params: { to, subject, body } }))
  .digest(''hex'');
```

### Rules
- Same input → same key → same result (no duplicate side effect)
- Different input → different key → independent execution
- Keys should expire after a reasonable TTL (e.g. 24 hours)', NULL, NULL, false),
  ('rel_m2_s3', 'reliability_m2', 3, 'build', 'Generate deterministic idempotency keys', '### Exercise
1. Create a function `generateIdempotencyKey(toolName, params)`
2. It should produce the same hash for identical inputs
3. Test with a sequence of 5 fake tool calls
4. Verify duplicate calls produce the same key
5. Verify different calls produce different keys

### Expected outcome
A deterministic, collision-resistant key generator that prevents duplicate tool executions.', NULL, NULL, false),
  ('rel_m2_s4', 'reliability_m2', 4, 'quiz', 'Idempotency quiz', 'Explain when and why idempotency keys are critical in agentic systems. Give a concrete example of what goes wrong without them.', NULL, NULL, false),
  ('rel_m2_s5', 'reliability_m2', 5, 'evidence', 'Link idempotency evidence', 'Link your idempotency key generator code or test output.', NULL, NULL, false),
  ('rag_m1_s1', 'rag_memory_m1', 1, 'read', 'LangChain memory documentation', NULL, 'https://python.langchain.com/docs/concepts/memory/', NULL, false),
  ('rag_m1_s2', 'rag_memory_m1', 2, 'watch', 'RAG explained in 10 minutes', NULL, 'https://www.youtube.com/watch?v=T-D1OfcDW1M', NULL, false),
  ('rag_m1_s3', 'rag_memory_m1', 3, 'article', 'Memory tier architecture', '## Memory Tiers in Agent Systems

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
4. **Frequency** — often-accessed memories may be more useful', NULL, NULL, false),
  ('rag_m1_s4', 'rag_memory_m1', 4, 'build', 'Compare old vs fresh record outcomes', '### Exercise
1. Create a mock memory store with 10 records (5 old, 5 fresh)
2. Implement a ranking function that considers recency and relevance
3. Query with a test prompt and verify fresh, relevant records rank highest
4. Query with a different prompt and verify relevance beats recency

### Expected outcome
A ranking function that correctly balances recency and relevance, with tunable weights.', NULL, NULL, false),
  ('rag_m1_s5', 'rag_memory_m1', 5, 'quiz', 'Memory tier quiz', 'Describe the three memory tiers and explain when an agent should use each one. Include a concrete example.', NULL, NULL, false),
  ('rag_m1_s6', 'rag_memory_m1', 6, 'evidence', 'Link memory ranking evidence', 'Link your memory ranking implementation or test output.', NULL, NULL, false),
  ('rag_m2_s1', 'rag_memory_m2', 1, 'read', 'LangChain retriever documentation', NULL, 'https://python.langchain.com/docs/concepts/retrievers/', NULL, false),
  ('rag_m2_s2', 'rag_memory_m2', 2, 'watch', 'Hybrid search: combining BM25 and vector', NULL, 'https://www.youtube.com/watch?v=lYxGYXjfrNI', NULL, false),
  ('rag_m2_s3', 'rag_memory_m2', 3, 'article', 'Reranking strategy', '## Hybrid Retrieval and Reranking

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
- **MRR** — how high is the first relevant result?', NULL, NULL, false),
  ('rag_m2_s4', 'rag_memory_m2', 4, 'build', 'Benchmark rerank on/off precision', '### Exercise
1. Create a test dataset: 20 documents with known relevance labels
2. Implement basic vector search (cosine similarity on embeddings)
3. Add a reranking step (sort by a scoring function)
4. Measure precision@5 with and without reranking
5. Compare and document the improvement

### Expected outcome
Measurable precision improvement when reranking is enabled.', NULL, NULL, false),
  ('rag_m2_s5', 'rag_memory_m2', 5, 'quiz', 'Hybrid retrieval quiz', 'Explain the trade-offs between lexical and vector retrieval. When would you use hybrid search vs. pure vector search?', NULL, NULL, false),
  ('rag_m2_s6', 'rag_memory_m2', 6, 'evidence', 'Link retrieval benchmark evidence', 'Link your benchmark results comparing retrieval with and without reranking.', NULL, NULL, false),
  ('pay_m1_s1', 'agent_payments_m1', 1, 'read', 'x402 Protocol specification', NULL, 'https://docs.x402.org/protocol/', NULL, false),
  ('pay_m1_s2', 'agent_payments_m1', 2, 'read', 'Base blockchain agent payments guide', NULL, 'https://docs.base.org/tools/agent-payments', NULL, false),
  ('pay_m1_s3', 'agent_payments_m1', 3, 'article', 'Understanding x402 payment flows', '## x402 Payment Protocol

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
- Cryptographic proof of payment', NULL, NULL, false),
  ('pay_m1_s4', 'agent_payments_m1', 4, 'setup', 'Set up agent wallet', 'Set up a testnet wallet with Base USDC for testing x402 payments.', NULL, 'cast balance $AGENT_ADDRESS --rpc-url https://sepolia.base.org', false),
  ('pay_m1_s5', 'agent_payments_m1', 5, 'build', 'Make a test x402 payment', '### Exercise
1. Use the mock payment gating script
2. Configure a small test payment (0.01 USDC)
3. Execute the payment and capture the proof
4. Verify the payment was successful

### Expected outcome
A successful x402 payment with proof that can be verified on-chain.', NULL, NULL, false),
  ('pay_m1_s6', 'agent_payments_m1', 6, 'quiz', 'x402 buyer quiz', 'Explain the x402 buyer pattern and describe when an agent should reject a payment request.', NULL, NULL, false),
  ('pay_m1_s7', 'agent_payments_m1', 7, 'evidence', 'Link payment proof', 'Link the transaction hash or proof from your test x402 payment.', NULL, NULL, false),
  ('pay_m2_s1', 'agent_payments_m2', 1, 'read', 'x402 seller implementation guide', NULL, 'https://docs.x402.org/seller/', NULL, false),
  ('pay_m2_s2', 'agent_payments_m2', 2, 'article', 'Payment middleware patterns', '## x402 Seller Implementation

As a service provider, you need to verify payments before delivering services.

### Middleware pattern
```javascript
async function x402Middleware(req, res, next) {
  const proof = req.headers[''x-x402-proof''];
  if (!proof) return res.status(402).json({ error: ''Payment required'' });
  
  const isValid = await verifyPayment(proof, req.body);
  if (!isValid) return res.status(402).json({ error: ''Invalid payment'' });
  
  next();
}
```

### Verification steps
1. Extract payment proof from headers
2. Verify proof signature
3. Check payment amount matches service cost
4. Ensure proof hasn''t been used before (replay protection)
5. Verify on-chain transaction exists', NULL, NULL, false),
  ('pay_m2_s3', 'agent_payments_m2', 3, 'build', 'Build payment-gated API', '### Exercise
1. Create a simple Express API endpoint
2. Add x402 payment middleware
3. Test with a valid payment proof
4. Test with invalid/missing payment proof
5. Verify proper error responses

### Expected outcome
A working API that only serves requests with valid x402 payments.', NULL, NULL, false),
  ('pay_m2_s4', 'agent_payments_m2', 4, 'quiz', 'x402 seller quiz', 'Explain the seller verification pattern and list three security considerations for payment middleware.', NULL, NULL, false),
  ('pay_m2_s5', 'agent_payments_m2', 5, 'evidence', 'Link seller API evidence', 'Link your payment-gated API code or test results.', NULL, NULL, false),
  ('pay_m3_s1', 'agent_payments_m3', 1, 'article', 'Agent spending controls', '## Budget Controls for Agent Payments

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
- Cost per service/outcome analysis', NULL, NULL, false),
  ('pay_m3_s2', 'agent_payments_m3', 2, 'build', 'Implement budget controls', '### Exercise
1. Build a budget tracking system
2. Add daily and per-transaction limits
3. Implement alerting when limits are approached
4. Test with various spending scenarios
5. Verify limits are enforced correctly

### Expected outcome
A robust budget system that prevents overspending while alerting on unusual patterns.', NULL, NULL, false),
  ('pay_m3_s3', 'agent_payments_m3', 3, 'quiz', 'Budget controls quiz', 'Design a budget control system for an agent that makes API calls. Include three types of limits and explain when human approval should be required.', NULL, NULL, false),
  ('pay_m3_s4', 'agent_payments_m3', 4, 'evidence', 'Link budget system evidence', 'Link your budget control implementation or monitoring dashboard.', NULL, NULL, false),
  ('id_m1_s1', 'agent_identity_m1', 1, 'read', 'EIP-8004: Agent Identity specification', NULL, 'https://eips.ethereum.org/EIPS/eip-8004', NULL, false),
  ('id_m1_s2', 'agent_identity_m1', 2, 'read', 'Agent identity use cases', NULL, 'https://ethereum-magicians.org/t/eip-8004-agent-identity/', NULL, false),
  ('id_m1_s3', 'agent_identity_m1', 3, 'article', 'Agent identity fundamentals', '## Agent Identity with ERC-8004

ERC-8004 defines a standard for agent identity on Ethereum.

### Core concepts
- **Agent address** — unique on-chain identifier
- **Identity document** — off-chain metadata about capabilities
- **Delegation** — granting permissions to act on behalf of others
- **Revocation** — removing delegated permissions

### Why identity matters
- Trust: know which agent you''re interacting with
- Capability discovery: what can this agent do?
- Accountability: audit trail of agent actions
- Delegation: controlled permission sharing', NULL, NULL, false),
  ('id_m1_s4', 'agent_identity_m1', 4, 'quiz', 'Agent identity quiz', 'Explain why agent identity is important and describe the key components of the ERC-8004 standard.', NULL, NULL, false),
  ('id_m1_s5', 'agent_identity_m1', 5, 'evidence', 'Link ERC-8004 research', 'Link your notes or analysis of the ERC-8004 specification.', NULL, NULL, false),
  ('id_m2_s1', 'agent_identity_m2', 1, 'article', 'Agent registration file format', '## Agent Registration File

The `.well-known/agent.json` file describes an agent''s identity and capabilities.

### File structure
```json
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
```

### Best practices
- Use HTTPS for all endpoints
- Include capability descriptions
- Set reasonable delegation limits
- Provide contact information', NULL, NULL, false),
  ('id_m2_s2', 'agent_identity_m2', 2, 'build', 'Create agent.json file', '### Exercise
1. Design an agent identity document
2. Create the JSON file with your agent''s capabilities
3. Deploy it to `.well-known/agent.json` on a domain
4. Verify it''s accessible via HTTP GET
5. Test with an agent identity parser

### Expected outcome
A valid agent.json file deployed and accessible via HTTPS.', NULL, NULL, false),
  ('id_m2_s3', 'agent_identity_m2', 3, 'quiz', 'Agent registration quiz', 'Design an agent.json file for a trading bot. Include appropriate capabilities and delegation settings.', NULL, NULL, false),
  ('id_m2_s4', 'agent_identity_m2', 4, 'evidence', 'Link deployed agent.json', 'Link the URL of your deployed agent.json file.', NULL, NULL, false),
  ('id_m3_s1', 'agent_identity_m3', 1, 'article', 'Delegation and trust boundaries', '## Trust Boundaries in Agent Systems

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
- Audit logging for all delegated actions', NULL, NULL, false),
  ('id_m3_s2', 'agent_identity_m3', 2, 'build', 'Implement delegation system', '### Exercise
1. Design a delegation contract or API
2. Implement scoped permissions (read-only, spend limits, etc.)
3. Add time-based expiration
4. Build revocation functionality
5. Test delegation lifecycle (grant → use → revoke)

### Expected outcome
A working delegation system with proper scope and time limits.', NULL, NULL, false),
  ('id_m3_s3', 'agent_identity_m3', 3, 'quiz', 'Trust boundaries quiz', 'Design a delegation system for agents managing portfolio investments. Include appropriate trust boundaries and safety mechanisms.', NULL, NULL, false),
  ('id_m3_s4', 'agent_identity_m3', 4, 'evidence', 'Link delegation system evidence', 'Link your delegation implementation or test results.', NULL, NULL, false),
  ('voice_m1_s1', 'voice_agents_m1', 1, 'read', 'Real-time voice processing architectures', NULL, 'https://docs.deepgram.com/docs/streaming-api', NULL, false),
  ('voice_m1_s2', 'voice_agents_m1', 2, 'watch', 'Build a voice agent with LangChain', NULL, 'https://www.youtube.com/watch?v=kDPzdyX76cg', NULL, false),
  ('voice_m1_s3', 'voice_agents_m1', 3, 'article', 'Voice agent latency budgets', '## Voice Agent Latency Management

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
5. **Fallback responses** — "I''m thinking..." when processing takes time

### Architecture patterns
- WebRTC for low-latency audio
- WebSocket connections for real-time data
- Edge deployment for reduced network latency', NULL, NULL, false),
  ('voice_m1_s4', 'voice_agents_m1', 4, 'build', 'Analyze voice latency patterns', '### Exercise
1. Run the mock voice latency script
2. Measure STT, LLM, and TTS latencies separately
3. Identify bottlenecks in the pipeline
4. Test interrupt handling
5. Calculate total round-trip times

### Expected outcome
Detailed latency analysis with identified optimization opportunities.', NULL, NULL, false),
  ('voice_m1_s5', 'voice_agents_m1', 5, 'quiz', 'Voice latency quiz', 'Explain the components of voice agent latency and describe three strategies to stay under 1000ms total response time.', NULL, NULL, false),
  ('voice_m1_s6', 'voice_agents_m1', 6, 'evidence', 'Link latency analysis', 'Link your voice latency measurement results.', NULL, NULL, false),
  ('voice_m2_s1', 'voice_agents_m2', 1, 'read', 'Voice AI quality metrics', NULL, 'https://platform.openai.com/docs/guides/speech-to-text', NULL, false),
  ('voice_m2_s2', 'voice_agents_m2', 2, 'article', 'Voice compliance requirements', '## Voice Quality and Compliance

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
- User feedback collection', NULL, NULL, false),
  ('voice_m2_s3', 'voice_agents_m2', 3, 'build', 'Implement quality monitoring', '### Exercise
1. Define quality metrics for your voice agent
2. Implement real-time quality scoring
3. Add compliance check automation
4. Create alert system for quality degradation
5. Test with various voice inputs

### Expected outcome
A quality monitoring system that tracks voice agent performance and compliance.', NULL, NULL, false),
  ('voice_m2_s4', 'voice_agents_m2', 4, 'quiz', 'Voice quality quiz', 'Design a quality assurance system for a voice agent handling customer service calls. Include metrics, compliance checks, and escalation procedures.', NULL, NULL, false),
  ('voice_m2_s5', 'voice_agents_m2', 5, 'evidence', 'Link quality monitoring evidence', 'Link your voice quality monitoring implementation.', NULL, NULL, false),
  ('voice_m3_s1', 'voice_agents_m3', 1, 'article', 'Production voice agent deployment', '## Voice Agent Operations

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
- Error rates by component (STT, LLM, TTS)', NULL, NULL, false),
  ('voice_m3_s2', 'voice_agents_m3', 2, 'build', 'Build production voice agent', '### Exercise
1. Design a scalable voice agent architecture
2. Implement health checks and monitoring
3. Add error handling and graceful degradation
4. Set up alerting for critical failures
5. Test under load with multiple concurrent sessions

### Expected outcome
A production-ready voice agent with proper monitoring and error handling.', NULL, NULL, false),
  ('voice_m3_s3', 'voice_agents_m3', 3, 'quiz', 'Voice operations quiz', 'Describe the key operational challenges for voice agents and your approach to monitoring and alerting.', NULL, NULL, false),
  ('voice_m3_s4', 'voice_agents_m3', 4, 'evidence', 'Link production deployment evidence', 'Link your production voice agent deployment or monitoring dashboard.', NULL, NULL, false),
  ('harness_m1_s1', 'harness_engineering_m1', 1, 'read', 'OpenAI: Harness Engineering', NULL, 'https://openai.com/index/harness-engineering/', NULL, false),
  ('harness_m1_s2', 'harness_engineering_m1', 2, 'read', 'LangChain: Improving Deep Agents', NULL, 'https://blog.langchain.com/improving-deep-agents-with-harness-engineering/', NULL, false),
  ('harness_m1_s3', 'harness_engineering_m1', 3, 'watch', 'From Context Engineering to AI Agent Harnesses', NULL, 'https://www.youtube.com/watch?v=2Muxy3wE-E0', NULL, false),
  ('harness_m1_s4', 'harness_engineering_m1', 4, 'article', 'What is a Harness?', '## Understanding Agent Harnesses

A **harness** is the infrastructure that wraps around an AI model to make it useful in production.

### The Three Knobs
1. **System prompt** — defines role, constraints, and behavior
2. **Tools** — external capabilities the agent can use
3. **Middleware** — guardrails, logging, validation, and control flow

### Key principle: Progressive Disclosure
- AGENTS.md as table of contents (~100 lines)
- Link to detailed docs/ for deep knowledge
- Agent legibility over human legibility
- Don''t overwhelm with everything at once

### What makes a good harness?
- **Deterministic** — same input produces same output (when possible)
- **Observable** — every decision is logged and traceable
- **Controllable** — clear knobs to tune behavior
- **Safe** — bounded actions with approval gates', NULL, NULL, false),
  ('harness_m1_s5', 'harness_engineering_m1', 5, 'build', 'Design a basic harness', '### Exercise
1. Create an AGENTS.md file (~100 lines) for a simple agent
2. Define 3-5 tools with clear interfaces  
3. Write system prompt with role and constraints
4. Add basic middleware for logging and validation
5. Test the progressive disclosure pattern

### Expected outcome
A working agent harness with progressive disclosure and clear separation of concerns.', NULL, NULL, false),
  ('harness_m1_s6', 'harness_engineering_m1', 6, 'quiz', 'Harness fundamentals quiz', 'Explain the difference between prompt engineering and harness engineering. What are the three main knobs and why is progressive disclosure important?', NULL, NULL, false),
  ('harness_m1_s7', 'harness_engineering_m1', 7, 'evidence', 'Link harness implementation', 'Link your AGENTS.md file and basic harness code.', NULL, NULL, false),
  ('harness_m2_s1', 'harness_engineering_m2', 1, 'read', 'Codex Execution Plans', NULL, 'https://cookbook.openai.com/articles/codex_exec_plans', NULL, false),
  ('harness_m2_s2', 'harness_engineering_m2', 2, 'read', 'Ralph Wiggum Loop', NULL, 'https://ghuntley.com/loop/', NULL, false),
  ('harness_m2_s3', 'harness_engineering_m2', 3, 'watch', 'LangSmith tracing tutorial', NULL, 'https://www.youtube.com/watch?v=fA9b4D8IsPQ', NULL, false),
  ('harness_m2_s4', 'harness_engineering_m2', 4, 'article', 'Build-Verify-Fix Loop', '## The Build-Verify-Fix Loop

Most agents skip verification. They build something and assume it worked.

### The loop
1. **Planning & Discovery** — understand requirements
2. **Build** — implement the solution  
3. **Verify against spec** — not against your own code!
4. **Fix** — address gaps found in verification

### Why agents skip verification
- They''re trained to be confident
- Verification feels like extra work
- No clear success criteria

### Forcing verification
- PreCompletionChecklist middleware
- Explicit verification steps in the workflow
- Test-driven development patterns
- External validation tools', NULL, NULL, false),
  ('harness_m2_s5', 'harness_engineering_m2', 5, 'article', 'Trace-Driven Improvement', '## Using Traces for Harness Improvement

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
- Context overflow (too much information)', NULL, NULL, false),
  ('harness_m2_s6', 'harness_engineering_m2', 6, 'build', 'Set up trace analysis workflow', '### Exercise
1. Set up LangSmith tracing for an agent
2. Run the agent on 10 different tasks
3. Analyze traces for failure patterns
4. Identify 3 specific improvements to make
5. Implement changes and re-test

### Expected outcome
A trace analysis workflow that identifies concrete harness improvements.', NULL, NULL, false),
  ('harness_m2_s7', 'harness_engineering_m2', 7, 'quiz', 'Self-verification quiz', 'Describe the build-verify-fix loop and explain why agents tend to skip verification. How do you force it in your harness?', NULL, NULL, false),
  ('harness_m2_s8', 'harness_engineering_m2', 8, 'evidence', 'Link trace analysis results', 'Link your LangSmith traces and improvement analysis.', NULL, NULL, false),
  ('harness_m3_s1', 'harness_engineering_m3', 1, 'read', 'ARCHITECTURE.md pattern', NULL, 'https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html', NULL, false),
  ('harness_m3_s2', 'harness_engineering_m3', 2, 'article', 'Agent-First Repository Design', '## Repository Design for Agent-First Development

When agents are the primary consumers of your code, organize for their needs.

### Key principles
- **AGENTS.md as table of contents** (~100 lines, not comprehensive)
- **docs/ as structured knowledge base** (detailed, searchable)
- **Plans as first-class versioned artifacts**
- **Progressive disclosure** (overview → details → deep dive)
- **Mechanical enforcement** (linters, CI, automated checks)

### Repository structure
```
AGENTS.md          # Agent landing page (~100 lines)
docs/
  guides/          # How-to guides  
  reference/       # API docs and specs
  architecture/    # System design docs
plans/             # Versioned planning artifacts
tools/             # Agent-accessible utilities
```', NULL, NULL, false),
  ('harness_m3_s3', 'harness_engineering_m3', 3, 'article', 'Entropy Management', '## Fighting Repository Entropy

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
- **Friday "AI slop" cleanup** sessions → automate them', NULL, NULL, false),
  ('harness_m3_s4', 'harness_engineering_m3', 4, 'build', 'Design agent-first repository', '### Exercise
1. Create AGENTS.md (~100 lines) for a project
2. Set up docs/ with proper organization
3. Add automated link checking
4. Implement a doc-gardening workflow
5. Test with an agent reading the repository

### Expected outcome
An agent-first repository with mechanical enforcement and entropy management.', NULL, NULL, false),
  ('harness_m3_s5', 'harness_engineering_m3', 5, 'quiz', 'Repository design quiz', 'Why should AGENTS.md be ~100 lines instead of comprehensive? What happens when context rots and how do you prevent it?', NULL, NULL, false),
  ('harness_m3_s6', 'harness_engineering_m3', 6, 'evidence', 'Link repository design', 'Link your agent-first repository with AGENTS.md and docs/ structure.', NULL, NULL, false)
ON CONFLICT (id) DO NOTHING;
