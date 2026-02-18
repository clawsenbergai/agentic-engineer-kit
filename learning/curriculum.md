# Curriculum: Theory -> Build -> Re-read

## Track 1: LLM Fundamentals for Engineers

### Theory
- Tokenization and context windows
- Tool calling and structured outputs
- Failure modes: hallucination, schema drift, hidden assumptions

### Build
- Prompt library with strict schema constraints
- Parser with fallback and validation errors

### Re-read Focus
- Which prompts are brittle under noisy input?
- Which schema fields fail first?

## Track 2: Reliability Engineering for Agents

### Theory
- Idempotency and retries
- Timeouts, cancellation, partial failures
- State machine design

### Build
- Deterministic state machine + tests
- Retry strategy with jitter and classification

### Re-read Focus
- Which failures are transient vs permanent?
- Where are duplicate side effects possible?

## Track 3: RAG + Memory Systems

### Theory
- Chunking, embeddings, ANN basics
- Hybrid retrieval + reranking
- Memory lifecycle and expiration

### Build
- Memory scoring engine
- Eval harness with known-answer dataset

### Re-read Focus
- Is retrieval precise or only broad?
- What memory kind leaks stale context?

## Track 4: Orchestration and Durable Workflows

### Theory
- Queue semantics vs durable workflows
- Saga/compensation patterns
- Human approval checkpoints

### Build
- Queue envelope + workflow contract
- Recovery runbook with replay rules

### Re-read Focus
- What is replay-safe?
- Which workflow steps need compensation?

## Track 5: Governance, Security, and Compliance

### Theory
- Prompt injection and tool exfiltration patterns
- Least privilege and approval gating
- Immutable logging and audit trails

### Build
- Policy engine with risk + budget gates
- Security guard module and tests

### Re-read Focus
- Can untrusted content escalate privileges?
- Are all sensitive actions auditable?

## Track 6: Multi-agent Economics

### Theory
- Planner/executor/critic decomposition
- Compete vs collaborate modes
- Expected value and budget allocation

### Build
- ROI model + budget policy framework
- Scenario simulation for allocation

### Re-read Focus
- Where does automation destroy value?
- Which model tier gives best value density?

## Track 7: A2A Protocol (Core)

### Theory
- Agent-to-Agent message contracts
- Capability negotiation and handoff semantics
- Interop boundaries and trust assumptions

### Build
- Two-agent handoff with typed payloads and retry policy
- Contract validation test suite

### Re-read Focus
- Where does protocol ambiguity cause silent failure?
- Which handoffs need explicit acknowledgment?

## Track 8: WebMCP (Core, Experimental Guardrails)

### Theory
- Browser-side MCP model context patterns
- `navigator.modelContext` concepts and safety constraints
- Agent-ready website contracts

### Build
- WebMCP-compatible tool surface with fallback path
- Guardrail labels (experimental, pilot, production)

### Re-read Focus
- What breaks in non-compatible browsers?
- How do you avoid over-trusting web context?

## Track 9: LangChain / LangGraph / LangSmith (Core)

### Theory
- Chain vs graph orchestration
- State persistence and checkpointing
- Trace-driven evaluation loops

### Build
- LangGraph flow with explicit state transitions
- LangSmith experiment compare workflow

### Re-read Focus
- Which node boundaries should be deterministic?
- Which traces actually change decisions?

## Track 10: x402 / Agent Payments (Elective)

### Theory
- Payment authorization and settlement patterns
- Crypto rails (x402) and fiat rails (AP2/UCP)
- Abuse prevention and reconciliation constraints

### Build
- Pay-per-tool-call simulation with budget lock and release

### Re-read Focus
- Where can payment race conditions occur?
- Which actions should require pre-authorization?

## Track 11: ERC-8004 Agent Identity (Elective)

### Theory
- On-chain identity primitives and delegation
- Proofs, trust domains and revocation
- Identity and compliance considerations

### Build
- Identity assertion + policy check simulation

### Re-read Focus
- Which identity claims are actually required?
- How do you handle key rotation safely?

## Track 12: Voice Agents (Later Phase)

### Theory
- Real-time streaming and interruption handling
- Call quality and latency budgets
- Compliance and conversation audit patterns

### Build
- Voice orchestration skeleton with QA scoring hooks

### Re-read Focus
- What metrics define voice quality at scale?
- Which conversations must trigger human handoff?

## Track 13: Business Capstones
- Ops/Portal autonomous improvement
- Marketing automation with brand guardrails
- Finance analysis with audit-grade controls

## Reference Docs
- OpenAI Responses API: https://platform.openai.com/docs/api-reference/responses
- OpenAI Agents guide: https://platform.openai.com/docs/guides/agents
- Google A2A: https://google.github.io/A2A/
- Model Context Protocol: https://modelcontextprotocol.io
- LangGraph JS: https://docs.langchain.com/oss/javascript/langgraph/overview
- LangSmith: https://docs.langchain.com/langsmith
- Temporal: https://docs.temporal.io
- BullMQ: https://docs.bullmq.io
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
