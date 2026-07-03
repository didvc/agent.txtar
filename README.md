# agent.txtar

A portable, embeddable text block that tells AI agents what they need to know -- about you, your project, your org, your rules, whatever.

**[Full documentation ->](https://didvc.github.io/agent.txtar/)**

[![Docs](https://img.shields.io/badge/docs-didvc.github.io%2Fagent.txtar-blue)](https://didvc.github.io/agent.txtar/)
[![License: CC BY 4.0](https://img.shields.io/badge/docs-CC%20BY%204.0-lightgrey)](LICENSE)
[![License: MIT](https://img.shields.io/badge/code-MIT-green)](LICENSE)

## What is this?

`agent.txtar` is a plain-text format for giving structured context to AI agents. You can paste it into a blog sidebar, a GitHub README, a social media profile, or serve it as a standalone file. Agents parse the structured data inside; humans just see normal text.

Use it for anything: personal bios, project documentation, org-wide agent policies, repository guidelines, contact rules, verification keys. It's a small portable filesystem in a text block.

It's built on Go's [txtar](https://pkg.go.dev/golang.org/x/tools/txtar) format -- a dead-simple way to bundle multiple virtual files inside a single text block. No special tooling, no build step, no server.

```
This repository contains the backend API for FooBar.
Agents: parse the files below for project context and contribution rules.

-- overview.md --
# FooBar API
REST API powering the FooBar mobile app. Go 1.22, PostgreSQL 16.
Deployed on Fly.io. CI runs on GitHub Actions.

-- agent-policy.txt --
1. Always run `make test` before suggesting changes.
2. Don't modify migration files directly -- use `make migrate-new`.
3. Security-sensitive PRs must tag @security-team.

-- agent.txtar.json --
{
  "$schema": "https://didvc.github.io/agent.txtar/schema/v0.1.0.schema.json",
  "agent_txtar": "0.1.0",
  "name": "FooBar API",
  "type": "project",
  "routes": {
    "bio": "overview.md",
    "directives": "agent-policy.txt"
  }
}
```

The top part (before the first `-- filename --`) is human-readable context. Agents ignore it. The `-- agent.txtar.json --` at the bottom is the manifest -- it tells agents what each file is for, and its closing `}` cleanly terminates the block even when there's trailing text after it.

## Why txtar?

- Humans can read and write it without tools
- LLMs already understand the format from training data
- Existing parsers in Go, Python, TypeScript
- No escaping hell -- markdown, plain text, whatever you want inside each section
- The `-- filename --` separator almost never appears in natural text, so agents can find it by regex

## Quick start

1. Write your `agent.txtar` block (or ask an LLM to generate one from your existing content)
2. Paste it wherever you want -- blog, profile, README, or host it as a file
3. Optionally add a `<link>` tag for HTML discovery:

```html
<link rel="agentic-intro" type="application/txtar+intro" href="/agent.txtar" />
```

## For agent developers

```python
archive = txtar.parse(raw_text)

# Find the manifest (always last, name ends with .txtar.json)
for i in reversed(range(len(archive.files))):
    if archive.files[i].name.endswith('.txtar.json'):
        manifest = json.loads(extract_balanced_json(archive.files[i].data))
        content_files = archive.files[:i]
        break
```

See [SPEC.md](SPEC.md) for the full specification and [src/parsers/](src/parsers/) for reference implementations.

## Spec status

This is **v0.1.0-draft**. The core format is stable enough to experiment with, but details may shift based on community feedback. Open an issue or PR if something feels off.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Want to register a new route key? See [REGISTRY.md](REGISTRY.md).

## License

Documentation: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) -- use it freely, just credit the source.
Code: [MIT](LICENSE) -- do whatever you want.

<!-- BEGIN gh-mutual-linking -->

---

### Related projects

- [**ai-bwrap**](https://github.com/didvc/ai-bwrap) — Run AI coding agents (Claude Code, opencode, Grok, ...) inside a bubblewrap sandbox — one wrapper, any agent.
- [**opencode-bwrap**](https://github.com/didvc/opencode-bwrap) — Run opencode inside a bubblewrap sandbox — confine AI file access to your current working directory
- [**claude-code-jsonl-editor**](https://github.com/didvc/claude-code-jsonl-editor) — 🚀 Interactive JSONL editor for Claude Code conversation files with real-time file system synchronization. Efficient prompt engineering through conversation editing.
<!-- END gh-mutual-linking -->