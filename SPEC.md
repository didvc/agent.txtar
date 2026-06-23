# agent.txtar Specification

**Version:** 0.1.0-draft

**Key words:** [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) (`MUST`, `MUST NOT`, `REQUIRED`, `SHOULD`, `SHOULD NOT`, `MAY`)

## 1. Overview

`agent.txtar` is a portable text block that gives structured context to AI agents. It can live anywhere -- a standalone file, embedded in a blog post, pasted into a social media bio, inside a README. The format is built on Go's [txtar](https://pkg.go.dev/golang.org/x/tools/txtar) archive format.

An `agent.txtar` block consists of:

1. **Preamble** -- human-readable text before the first file separator
2. **Content files** -- zero or more virtual files (`-- filename --`)
3. **Manifest** -- `-- agent.txtar.json --` as the last file section

## 2. Discovery

### 2.1 HTML Discovery

When an HTML document contains a `<link>` element in `<head>` matching the following, User-Agents **MUST** treat it as a pointer to an `agent.txtar` resource:

```html
<link rel="agentic-intro" type="application/txtar+intro" href="/agent.txtar" />
```

- `rel` **MUST** be `"agentic-intro"`.
- `type` **MUST** be `"application/txtar+intro"`.

### 2.2 Plaintext Discovery

When the source is not HTML (GitHub bio, SNS profile, plain text page, etc.), User-Agents **MAY** attempt to parse the entire text as a txtar archive directly.

### 2.3 Content-Type Handling

User-Agents **MUST** use lax content-type matching. The block is valid regardless of HTTP `Content-Type` header (`text/plain`, `application/octet-stream`, etc.). Parsers **MUST NOT** reject a block solely because the server didn't return a specific MIME type. Most web servers won't know about `.txtar` files, and that's fine.

## 3. Format

An `agent.txtar` block **MUST** conform to Go's standard `txtar` format.

### 3.1 Encoding

- **MUST** be UTF-8, no BOM.
- User-Agents **MAY** reject non-UTF-8 input.

### 3.2 Line Endings

- All line endings **MUST** be normalized to `\n` (LF, U+000A) before parsing.
- Parsers **MUST** treat `\r\n` (CRLF) as `\n`.

### 3.3 Size Limit

- Total uncompressed size **MUST NOT** exceed **100,000 bytes** (100 KB).
- When fetching over HTTP, if `Content-Length` exceeds 100 KB, User-Agents **MAY** abort the connection and discard the buffer.

## 4. Archive Structure

### 4.1 Preamble

Everything from the start of the text to the first `-- filename --` marker is the **Preamble**.

- User-Agents **MUST** ignore the preamble when extracting structured data.
- Authors **SHOULD** use the preamble for human-readable context only.

### 4.2 Manifest: `agent.txtar.json`

The **last** file section in the archive **MUST** be named `agent.txtar.json`. If the last section is not `agent.txtar.json`, User-Agents **MUST** reject the archive as invalid.

The manifest contains a JSON object with these properties:

| Property | Type | Required | Description |
|---|---|---|---|
| `$schema` | string (URL) | **REQUIRED** | Schema URL for validation |
| `agent_txtar` | string | **REQUIRED** | Spec version (semver). If missing, reject the archive. |
| `name` | string | **REQUIRED** | Name of the person, project, org, or entity |
| `type` | string | RECOMMENDED | `"person"`, `"org"`, `"bot"`, or `"project"`. Defaults to `"person"`. |
| `routes` | object | OPTIONAL | Maps semantic roles to filenames in the archive |

### 4.3 Routes

The `routes` object maps well-known keys to filenames within the archive. This decouples meaning from filename -- users can name their files whatever they want, in any language.

**Core routes** (defined by this spec):

| Key | Purpose |
|---|---|
| `bio` | Background, profile, or overview for human consumption / RAG |
| `directives` | Rules and instructions for agents (system-prompt-like) |
| `verification` | Public key, DID, or signature for identity verification |

These are all optional. A minimal block can have zero routes.

**Registered routes** are listed in [REGISTRY.md](REGISTRY.md) and managed by community PRs.

**Experimental routes** use any key not in core or registry. Authors **MAY** use custom keys freely.

### 4.4 Manifest Placement and EOF

The manifest is placed last by design. This solves the "where does the block end?" problem when `agent.txtar` is embedded in a larger text (e.g., a blog post with content after the block).

Since the manifest is JSON, parsers can use bracket balancing: scan from the start of the manifest's data, track `{`/`}` depth, and cut at the position where depth returns to zero. Everything after the closing `}` is host-page noise and **MUST** be discarded.

### 4.5 Block Identification

To determine whether an arbitrary string contains an `agent.txtar` block:

1. Parse it as txtar.
2. Check if any file section is named `agent.txtar.json`.
3. If found, it's an `agent.txtar` block. Everything after the manifest is noise. Everything before the first `-- filename --` is preamble.
4. If not found, it's just regular text.

## 5. Security

### 5.1 Prompt Injection

Parsers **MUST** treat all text content from an `agent.txtar` block as untrusted user data. Agents **MUST NOT** inject block contents directly into system prompts without sanitization. Content **SHOULD** be passed to the LLM as isolated data objects, clearly separated from system instructions.

### 5.2 Size and Resource Limits

The 100 KB cap (section 3.3) exists to prevent context window exhaustion. Parsers **SHOULD** enforce this limit before attempting to parse.
