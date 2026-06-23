# Architecture

This page describes the structural decisions behind `agent.txtar` and why they are the way they are.

## The txtar container

The format is Go's [txtar](https://pkg.go.dev/golang.org/x/tools/txtar), created by Russ Cox for test data. A txtar archive is:

1. A **comment block** (everything before the first `-- filename --`)
2. Zero or more **file sections**, each starting with `-- filename --` on its own line

That's the entire spec. There are no escape sequences, no nesting, no version headers. A regex like `(?m)^-- (.+) --$` finds all boundaries.

## Three audiences, one block

An `agent.txtar` block serves three audiences from a single text:

| Layer | Audience | What they see |
|-------|----------|---------------|
| Preamble (comment block) | Humans | Plain-text intro or context. Read and move on. |
| Content files (bio.md, rules.txt, etc.) | LLMs / RAG pipelines | Rich context in whatever format works best -- markdown, plain text, CSV. No escaping needed. |
| Manifest (agent.txtar.json) | Deterministic parsers, crawlers | Typed JSON with schema validation. Machine-readable routing table. |

## Manifest-last design

Traditional manifests go at the top (package.json, HTML `<head>`). This one goes at the bottom, and that's the key design decision.

When an `agent.txtar` block is embedded inside a larger text -- say, a blog post that continues after the block -- the parser needs to know where the block ends. txtar has no end-of-archive marker; it reads until EOF.

Putting JSON last solves this. JSON has balanced brackets. The parser reads the manifest section's data, counts `{` and `}`, and cuts the string the moment depth returns to zero. Everything after the closing `}` is discarded as host-page noise.

The manifest does double duty: it's both the metadata and the terminator.

## Block identification

Given an arbitrary string, an agent determines whether it contains an `agent.txtar` block with this logic:

```
archive = txtar.parse(string)
if any file in archive.files has name == "agent.txtar.json":
    this is an agent.txtar block
else:
    this is regular text, discard
```

No magic strings, no special headers. The presence of a file named `agent.txtar.json` is the sole indicator.

## Routes decouple meaning from filenames

Users name their files whatever they want -- `bio.md`, `経歴.txt`, `my-rules.md`. The manifest's `routes` object maps semantic roles to those filenames:

```json
{
  "routes": {
    "bio": "経歴.txt",
    "directives": "my-rules.md"
  }
}
```

Agents never guess from filenames. They read `routes.directives`, look up that filename in the archive, and use that content. If a route key is missing, the agent skips it.

## Size cap

100 KB max, uncompressed. This prevents someone from stuffing their entire Spotify history into a block and blowing up an agent's context window. Parsers can enforce this before even attempting to parse.

## Encoding and line endings

UTF-8 only, no BOM. Line endings normalized to LF. These are non-negotiable to keep parsers simple and avoid the `-- filename --` boundary regex from breaking on CRLF.
