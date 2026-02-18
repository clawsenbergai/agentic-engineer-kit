# Tooling Landscape (What to Learn and Why)

## A) Runtime / Agent Frameworks
- **OpenAI Responses + Agents SDK**: default for structured outputs + tool calling
- **LangGraph**: stateful graph orchestration for complex multi-step agents
- **Mastra**: JS-first agent workflows and tooling patterns
- **PydanticAI**: strong typed Python agent workflows
- **AutoGen / CrewAI**: multi-agent collaboration patterns
- **Haystack**: retrieval-heavy enterprise pipelines

## B) Workflow / Job Orchestration
- **BullMQ + Redis**: high-throughput async tasks
- **Temporal**: durable workflows, replay, human-in-the-loop
- **Cloudflare Workflows/Queues**: edge-native orchestration pattern

## C) Data / Storage
- **Postgres (+ jsonb)**: system of record + audit + policy state
- **pgvector**: default vector layer in same DB
- **Pinecone / Qdrant / Weaviate**: scale path for dedicated vector infra
- **Graph DB (Neo4j, Memgraph)**: only if relationship reasoning dominates

## D) Retrieval Quality Stack
- Dense embeddings + lexical retrieval + reranking
- Rerankers: cross-encoder style models for precision lift
- Eval stack: static benchmark sets + drift tracking

## E) Observability / Evals
- **OpenTelemetry**: traces, spans, correlation IDs
- **LangSmith**: evals, experiment comparison
- **Arize Phoenix / Braintrust**: LLM eval and trace analytics
- **Helicone**: request-level LLM usage and cost visibility

## F) Security / Governance
- Least-privilege tool adapters
- Secret isolation and signed tool requests
- Policy as code for budgets, approvals, and risk classes
- OWASP GenAI practices for red teaming and attack simulation

## G) Deployment Targets
- **Vercel**: frontend + API routes
- **Railway**: workers/services straightforward ops
- **Cloudflare**: edge-first apps and remote MCP patterns
- **Kubernetes**: when platform team and scale justify complexity

## H) Missing-But-Critical Concepts
- Idempotency keys and exactly-once illusions
- Economic guardrails (expected value gating)
- Failure budgets and kill switches
- Human approval UX as a first-class system boundary
