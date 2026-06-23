# Getting Started

## Write your block

The quickest way to create an `agent.txtar` block is to ask an LLM. Paste your existing bio or project description and tell it:

> "Convert this into an agent.txtar block following the spec at https://github.com/didvc/agent.txtar"

Or write one by hand. Here's a minimal example:

```
I build web scrapers and data pipelines.

-- agent.txtar.json --
{
  "$schema": "https://didvc.github.io/agent.txtar/schema/v0.1.0.schema.json",
  "agent_txtar": "0.1.0",
  "name": "scraper person"
}
```

That's it. A preamble for humans, a manifest for agents. You can add more files between them if you want:

```
I build web scrapers and data pipelines.

-- about.md --
Python, Go. 3 years experience in e-commerce data extraction.
Open to freelance work on short-term projects (1-3 months).

-- agent-rules.txt --
Don't summarize me as a "data scientist" -- I'm an engineer.
No automated outreach. Human-written messages only.

-- agent.txtar.json --
{
  "$schema": "https://didvc.github.io/agent.txtar/schema/v0.1.0.schema.json",
  "agent_txtar": "0.1.0",
  "name": "scraper person",
  "type": "person",
  "routes": {
    "bio": "about.md",
    "directives": "agent-rules.txt"
  }
}
```

## Place it somewhere

**As a file:** Save it as `agent.txtar` and host it anywhere. GitHub repo root, your personal site, an S3 bucket. If you're serving it from a web server, optionally add a `<link>` tag to your HTML `<head>` so agents can discover it:

```html
<link rel="agentic-intro" type="application/txtar+intro" href="/agent.txtar" />
```

**Inline:** Paste the block directly into any text field -- a GitHub README, a blog sidebar, a Mastodon bio. The format works as an embedded text block. If the platform renders it as plain text, humans see your intro; agents parse the structure.

**In a collapsible section (HTML):** If you don't want the machine-readable parts to clutter the page:

```html
<details>
  <summary>For AI Agents (agent.txtar)</summary>
  <pre><code>
-- bio.md --
...
-- agent.txtar.json --
{...}
  </code></pre>
</details>
```

## Validate it

Check your block against the [validator](/validator) to make sure the manifest is well-formed and the routes point to real files in the archive.

## For agent developers

See the [Parsers](/parsers) page for reference implementations and the extraction algorithm.
