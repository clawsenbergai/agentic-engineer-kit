# Learning Dashboard v2

Standalone Next.js App Router dashboard for evidence-driven agentic engineering learning.

## What it includes

- Capability scoring (`70% evidence + 30% quiz`)
- AI quiz validation flow (Claude primary, OpenAI fallback)
- Real project evidence linking (`project_source`)
- Gap queue + next-best-action recommendation
- Single-user token-gated API mode
- Dark monochrome UI with green/red operational accents

## App routes

- `/` dashboard home
- `/tracks` track grid
- `/tracks/[trackId]` timeline + evidence + quiz trigger
- `/evidence` evidence explorer
- `/gaps` gap queue
- `/settings` env/provider health

## Required environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required for Supabase mode:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Required for AI scoring:

- `CLAUDE_API_KEY`
- `OPENAI_API_KEY` (fallback)
- `QUIZ_PROVIDER_PRIMARY=claude`
- `QUIZ_PROVIDER_FALLBACK=openai`

Optional auth hardening:

- `DASHBOARD_OWNER_TOKEN`
- `LEARNING_DEMO_SEED=1` (optional demo seed with preloaded artifacts)

If `DASHBOARD_OWNER_TOKEN` is set, send it in header `x-owner-token`.
Default behavior is a clean start (`0/100`) when `LEARNING_DEMO_SEED` is not `1`.

## Local dev

From repo root:

```bash
npm run dashboard:dev
```

Tests:

```bash
npm run dashboard:test
```

Build:

```bash
npm run dashboard:build
```

## Database setup (new Supabase project)

1. Create a new Supabase project.
2. Apply SQL migration:
   - `sql/003_learning_dashboard.sql`
3. Confirm schema `learning` exists.
4. Insert your single allowed user id:

```sql
insert into learning.owner_profile(singleton, owner_user_id)
values (true, 'YOUR_SUPABASE_AUTH_USER_UUID')
on conflict (singleton) do update set owner_user_id = excluded.owner_user_id;
```

5. Configure app env vars in Vercel project.

## Deployment (standalone Vercel project)

- Root directory: `apps/learning-dashboard`
- Framework preset: Next.js
- Add env vars from `.env.example`
- Deploy independently from other apps

## Primary docs

- [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses)
- [OpenAI Agents Guide](https://platform.openai.com/docs/guides/agents)
- [Anthropic Claude Docs](https://docs.anthropic.com/en/api/getting-started)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [LangGraph JS](https://docs.langchain.com/oss/javascript/langgraph/overview)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Temporal](https://docs.temporal.io)
- [BullMQ](https://docs.bullmq.io)
