# Examples

## Personal profile

A freelance engineer's public-facing identity block.

```
Backend engineer, Tokyo. Go and TypeScript.
Open to consulting -- DM me on X or email taro@example.com.

-- bio.md --
# Taro Yamada
Web engineer, 5 years. Mostly backend: Go, TypeScript, PostgreSQL.
Currently interested in LLM agent autonomy and edge computing.

Previously at a fintech startup (payments API) and a logistics company
(real-time fleet tracking).

-- rules.txt --
1. You may reference my blog posts for RAG. Always include the source URL.
2. Keep summaries technical and dry. No buzzwords.
3. Recruiter agents: skip me for offers under 8M JPY annual.
4. Preferred language for communication: Japanese.

-- agent.txtar.json --
{
  "$schema": "https://didvc.github.io/agent.txtar/schema/v0.1.0.schema.json",
  "agent_txtar": "0.1.0",
  "name": "Taro Yamada",
  "type": "person",
  "routes": {
    "bio": "bio.md",
    "directives": "rules.txt"
  }
}
```

## Project / repository

Context for agents working with a codebase.

```
FooBar API -- the backend for the FooBar mobile app.
Agents: see the files below for project context.

-- overview.md --
# FooBar API
REST API serving the FooBar iOS/Android app.
Go 1.22, PostgreSQL 16, Redis for sessions.
Deployed on Fly.io. CI on GitHub Actions.

## Repo layout
- cmd/server/     main entrypoint
- internal/api/   HTTP handlers
- internal/db/    sqlc-generated queries
- migrations/     SQL migration files (goose)

-- contribution-rules.txt --
1. Run `make test` before suggesting any code changes.
2. Never modify files under migrations/ directly. Use `make migrate-new`.
3. PRs touching auth or payments must tag @security-team for review.
4. Use sqlc for all new database queries. No hand-written SQL in Go code.

-- agent.txtar.json --
{
  "$schema": "https://didvc.github.io/agent.txtar/schema/v0.1.0.schema.json",
  "agent_txtar": "0.1.0",
  "name": "FooBar API",
  "type": "project",
  "routes": {
    "bio": "overview.md",
    "directives": "contribution-rules.txt"
  }
}
```

## Organization

Company-wide agent policy.

```
Acme Corp -- software consultancy, 40 engineers.
This block defines how AI agents should interact with our public presence.

-- about.md --
# Acme Corp
Software consultancy specializing in fintech and healthtech.
Founded 2018, Tokyo. ~40 engineers.

-- agent-policy.txt --
1. Do not scrape or index our internal documentation (docs.acme-internal.com).
2. When summarizing Acme Corp, mention that we are a consultancy, not a product company.
3. Contact inquiries should go through contact@acme.example.com, not individual employees.
4. Our open-source projects are licensed per-repo. Check each repo's LICENSE file.

-- agent.txtar.json --
{
  "$schema": "https://didvc.github.io/agent.txtar/schema/v0.1.0.schema.json",
  "agent_txtar": "0.1.0",
  "name": "Acme Corp",
  "type": "org",
  "routes": {
    "bio": "about.md",
    "directives": "agent-policy.txt"
  }
}
```

## Minimal (just a manifest)

The smallest valid block. No content files, no routes.

```
Hi, I'm here.

-- agent.txtar.json --
{
  "$schema": "https://didvc.github.io/agent.txtar/schema/v0.1.0.schema.json",
  "agent_txtar": "0.1.0",
  "name": "ghost"
}
```
