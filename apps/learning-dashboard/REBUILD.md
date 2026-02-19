# REBUILD: Agentic Engineer Course Platform

## Vision
A personal course platform for learning agentic engineering. Think Udemy/Coursera but self-hosted, single-user, dark theme, clean. Tracks → Modules → Steps. Progress is persistent (Supabase). YouTube videos are embedded. You always know where you left off.

## Current State
- Next.js 16 + shadcn/ui (dark, emerald accent) - KEEP
- Supabase client configured but NOT connected (runs in-memory) - FIX
- 12 tracks with milestones and steps in seed-data.js - EXPAND
- Steps table missing from SQL schema - ADD
- YouTube videos are links, not embeds - FIX
- No "continue where you left off" - ADD
- No harness engineering track - ADD

## Database: Supabase

### Add `learning.steps` table to `sql/003_learning_dashboard.sql`:
```sql
CREATE TABLE IF NOT EXISTS learning.steps (
  id TEXT PRIMARY KEY,
  milestone_id TEXT NOT NULL REFERENCES learning.milestones(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('read', 'watch', 'article', 'setup', 'build', 'quiz', 'evidence')),
  title TEXT NOT NULL,
  content_markdown TEXT,
  url TEXT,
  validation_command TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_steps_milestone ON learning.steps(milestone_id, order_index);

ALTER TABLE learning.steps ENABLE ROW LEVEL SECURITY;
-- same RLS policy as other tables
```

### Add step seed data to the SQL file
All steps from seed-data.js should be INSERT statements in the SQL file so Supabase has the data.

### Repository layer
Update `src/lib/repository.js`:
- When Supabase is configured, use it for ALL reads and writes (tracks, milestones, steps, quiz responses, etc.)
- When not configured, fall back to in-memory (dev mode only)
- Step toggle should UPDATE the steps table in Supabase
- Progress calculations should query Supabase

### Environment variables needed:
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY= (for quiz scoring)
```

## UI Changes

### 1. YouTube Embeds
For steps with type "watch" and a YouTube URL, render an embedded iframe:
```jsx
function YouTubeEmbed({ url }) {
  const videoId = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1];
  if (!videoId) return <a href={url}>Watch video</a>;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
```

Replace the current "Watch video" link in `milestone-detail-client.jsx` StepCard with this component when step.type === "watch".

### 2. "Continue Where You Left Off" on Dashboard
On the main page (/), add a prominent card above the track grid:
- Find the first incomplete step across all tracks (ordered by track order, then milestone order, then step order)
- Show: Track name → Milestone name → Step title
- Big green "Continue" button that links directly to that milestone page
- If everything is complete, show "All tracks completed! 🎉"

### 3. Progress Percentages
- Each track card: show "X/Y steps completed" + percentage bar
- Overall: "X/Y total steps completed" + big percentage
- Calculate from actual step completion, not milestone status
- Milestone is "complete" when ALL its steps are completed

### 4. Current Step Indicator
On the milestone detail page, highlight the first incomplete step:
- Add a subtle left border (emerald) or glow to the current step card
- Auto-scroll to it on page load
- Show "← You are here" badge

### 5. Sidebar
Update sidebar to show per-track progress as small percentage next to each track name.

## Content: Add Harness Engineering Track

Add track `harness_engineering` (orderIndex: 125, category: "core"):

**Description:** "System prompts, tools, middleware, self-verification loops, trace-driven improvement."

### Milestone 1: "Harness Engineering Fundamentals"
Steps:
1. **read** - "OpenAI: Harness Engineering" - url: https://openai.com/index/harness-engineering/
2. **read** - "LangChain: Improving Deep Agents with Harness Engineering" - url: https://blog.langchain.com/improving-deep-agents-with-harness-engineering/
3. **watch** - "Viv Trivedy: Building Better Coding Agent Harnesses" - url: https://www.youtube.com/watch?v=placeholder (find real URL or use article)
4. **article** - "What is a Harness?" - content explaining: system prompt + tools + middleware = harness. The knobs you turn. Progressive disclosure (AGENTS.md as table of contents, not encyclopedia). Agent legibility over human legibility.
5. **quiz** - "Explain the difference between prompt engineering and harness engineering. What are the three main knobs?"

### Milestone 2: "Self-Verification & Trace Analysis"
Steps:
1. **read** - "Codex Execution Plans" - url: https://cookbook.openai.com/articles/codex_exec_plans
2. **read** - "Ralph Wiggum Loop" - url: https://ghuntley.com/loop/
3. **article** - "Build-Verify-Fix Loop" - content: planning & discovery → build → verify against spec (not own code) → fix. PreCompletionChecklist middleware. Self-verification as fastest performance ramp.
4. **article** - "Trace-Driven Improvement" - content: LangSmith traces → parallel error analysis → synthesize findings → targeted harness changes. Like boosting: focus on mistakes from previous runs.
5. **build** - "Set up a trace analysis workflow" - Use LangSmith to trace an agent run, identify failure patterns, and propose harness improvements.
6. **quiz** - "Describe the build-verify-fix loop and explain why agents tend to skip verification. How do you force it?"

### Milestone 3: "Repository as System of Record"
Steps:
1. **read** - "ARCHITECTURE.md pattern" - url: https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html
2. **article** - "Agent-First Repository Design" - content: AGENTS.md as table of contents (~100 lines). docs/ as structured knowledge base. Plans as first-class versioned artifacts. Progressive disclosure. Mechanical enforcement (linters, CI, doc-gardening agents).
3. **article** - "Entropy Management" - content: Golden principles. Automated cleanup agents. Technical debt as high-interest loan. Continuous small increments > painful bursts. Friday "AI slop" cleanup → automated.
4. **build** - "Set up AGENTS.md + docs/ structure for a project" - Create an agent-first repository with progressive disclosure, mechanical enforcement, and a doc-gardening workflow.
5. **quiz** - "Why should AGENTS.md be ~100 lines instead of comprehensive? What happens when context rots?"

## Content: Audit Existing Tracks

### Tracks that need more concrete content (find real YouTube URLs):

**Track: LLM Fundamentals**
- ✅ Has Karpathy video, OpenAI docs, Anthropic docs - good
- Add: "3Blue1Brown: But what is a GPT?" https://www.youtube.com/watch?v=wjZofJX0v4M

**Track: Reliability**
- ✅ Has retry patterns video - good
- Add: Stripe idempotency blog post

**Track: RAG + Memory**
- ✅ Has RAG video - good
- Verify YouTube links still work

**Track: Orchestration (only 2 milestones, no real video content)**
- Add: "Temporal 101" video
- Add: "BullMQ getting started" resource

**Track: Governance + Security (only 2 milestones, very abstract)**
- Add: OWASP GenAI top 10 resource
- Add: "Simon Willison: Prompt Injection" video/blog

**Track: Agent Economics (only 2 milestones)**
- Good theory, but add real-world example (Stripe Minions model)

**Track: A2A (only 2 milestones)**
- Add: Google A2A codelab: https://codelabs.developers.google.com/intro-a2a-purchasing-concierge
- Add: Agent Card (.well-known/agent.json) setup exercise

**Track: x402 / Agent Payments**
- Only 1 milestone! Add more:
  - Milestone: "x402 Buyer Pattern" - set up a wallet, make a payment
  - Milestone: "x402 Seller Pattern" - build an API with payment middleware
  - Use our real APIs as examples

**Track: ERC-8004 Identity**
- Only 1 milestone. Add:
  - Milestone: "Read the EIP" - https://eips.ethereum.org/EIPS/eip-8004
  - Milestone: "Agent Registration File" - build one

**Track: LangChain / LangGraph / LangSmith**
- Good structure but should reference harness engineering track for traces

**Tracks with only 1 milestone need at least 2-3 milestones each.**

## Quality Checklist
- [ ] All YouTube URLs are real and working (verify with fetch)
- [ ] Every track has at least 2 milestones
- [ ] Every milestone has at least 4 steps
- [ ] Step flow: read/watch → article → build → quiz
- [ ] Supabase steps table created and seeded
- [ ] Repository layer uses Supabase when configured
- [ ] YouTube videos are embedded iframes
- [ ] "Continue where you left off" card on dashboard
- [ ] Current step highlighted on milestone page
- [ ] Progress percentages everywhere (sidebar, track cards, overall)
- [ ] `npm run build` passes
- [ ] Responsive but desktop-first

## Do NOT Change
- shadcn/ui components (already good)
- Dark theme with emerald accent
- Overall layout (sidebar + main content)
- Quiz scoring system (AI-powered)
- Evidence linking system

## File Structure Reference
```
src/
  app/
    page.js                          # Dashboard
    layout.js                        # Root layout
    tracks/page.js                   # All tracks
    tracks/[trackId]/page.js         # Track detail
    tracks/[trackId]/milestones/[milestoneId]/page.js  # Milestone detail (course page)
    evidence/page.js
    gaps/page.js
    settings/page.js
    api/...                          # API routes
  components/
    milestone-detail-client.jsx      # Main course view (steps)
    app-sidebar.jsx                  # Sidebar navigation
    ...ui/                           # shadcn components
  lib/
    seed-data.js                     # Track/milestone/step definitions
    repository.js                    # Data layer (memory + Supabase)
    supabase.js                      # Supabase client
    core.js                          # Dashboard state computation
    quiz-service.js                  # AI quiz scoring
```
