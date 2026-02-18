# Deployment Blueprints

## Blueprint 1: Vercel + Railway + Managed Postgres
- Vercel: web app + API endpoints
- Railway: workers (queue consumers) + orchestration sidecars
- Postgres: managed DB (Supabase/Neon/RDS)
- Redis: queue and rate-limiting

Use when:
- Je snel product features wilt shippen met duidelijke worker scheiding.

## Blueprint 2: Cloudflare edge-heavy
- Cloudflare Workers + Queues + Durable Objects/Workflows
- D1/KV/R2 where appropriate
- External Postgres for system-of-record workflows

Use when:
- Lage latency wereldwijd en edge-first tool integrations belangrijk zijn.

## Blueprint 3: Platform team / Kubernetes
- Gateway + microservices + Temporal cluster
- Dedicated observability stack
- Strict network and secret boundaries

Use when:
- Organisatie volwassen genoeg is voor platform operations overhead.
