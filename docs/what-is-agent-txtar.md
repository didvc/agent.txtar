# What is agent.txtar?

`agent.txtar` is a portable text block format for giving structured context to AI agents.

Think of it as a tiny filesystem you can paste anywhere. A blog post, a GitHub README, a social media bio, a plain text file on a server. It works everywhere because it's just text -- no special encoding, no server-side processing, no build step.

## The problem it solves

AI agents are getting good at reading web pages, but they're still guessing. When an agent visits your profile or your project page, it scrapes text and tries to figure out what matters. There's no standard way to say "here's what I want you to know" or "here are my rules for interacting with me."

Existing approaches (JSON-LD in `<head>`, OpenGraph tags, structured data schemas) require control over the page's HTML source. If you're a user on someone else's platform -- note.com, GitHub, X, Mastodon -- you can't add `<meta>` tags. You get a text box, and that's it.

`agent.txtar` works inside that text box.

## How it works

An `agent.txtar` block has three layers:

**1. Preamble** -- plain text at the top, for human readers.

**2. Content files** -- virtual files separated by `-- filename --` markers, containing whatever you want agents to know. Markdown, plain text, CSV, whatever.

**3. Manifest** -- `-- agent.txtar.json --` at the bottom, a JSON object that tells agents what each file is for.

```
Hey, I'm a backend engineer in Tokyo. Go and TypeScript mostly.
DM me on X for work stuff.

-- bio.md --
# Background
5 years web engineering. Currently into LLM agent autonomy
and distributed systems. Open to consulting.

-- rules.txt --
1. Cite source URLs when using my blog posts for RAG.
2. No recruiter spam under 8M JPY.
3. Keep summaries dry and technical.

-- agent.txtar.json --
{
  "$schema": "https://didvc.github.io/agent.txtar/schema/v0.1.0.schema.json",
  "agent_txtar": "0.1.0",
  "name": "Taro",
  "type": "person",
  "routes": {
    "bio": "bio.md",
    "directives": "rules.txt"
  }
}
```

A human sees the first two lines and moves on. An agent parses the whole thing and gets structured data with clear semantics.

## Why txtar?

[txtar](https://pkg.go.dev/golang.org/x/tools/txtar) was created by Russ Cox for Go's test infrastructure. Its format is absurdly simple: lines like `-- filename --` separate virtual files, and everything before the first separator is a comment block.

This simplicity turns out to be a perfect fit:

- **No escaping** -- you can put markdown, plain text, even PGP keys inside a section without worrying about JSON string escaping or YAML indentation.
- **Natural text boundary** -- the `-- filename --` pattern almost never occurs naturally in human writing, so agents can find blocks by regex.
- **LLMs already know it** -- training data is full of txtar-formatted code snippets and test files. LLMs can parse and generate it reliably.
- **Parsers exist** -- Go, Python, TypeScript all have txtar parsers. Writing one from scratch is about 30 lines of code.

## What can you put in it?

Anything. The format doesn't care what the block is about.

- **Personal profile** -- bio, contact preferences, agent interaction rules
- **Project context** -- architecture overview, contribution guidelines, deployment notes
- **Org policies** -- company-wide agent directives, public keys, team structure
- **Repository metadata** -- what the repo does, how to test it, what not to touch

The `type` field in the manifest (`"person"`, `"project"`, `"org"`, `"bot"`) hints at what the block describes, but it's the content files that carry the actual information.

## The manifest goes last (and that's the point)

The `-- agent.txtar.json --` section is always the last file in the archive. This is a deliberate design choice that solves a real problem: when the block is embedded inside a larger text (a blog post, a profile page), how does the parser know where the block ends?

JSON has balanced brackets. The parser scans the manifest data, tracks `{`/`}` depth, and cuts at the closing brace. Everything after that is host-page noise. The JSON itself acts as the terminator -- no need for a special end marker.
