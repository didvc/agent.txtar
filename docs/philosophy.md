# Philosophy

## Text first

The whole point of `agent.txtar` is that it's just text. Not a file format that needs a special viewer. Not a protocol that needs a server. Not a schema that lives in a `<head>` tag you can't control.

You should be able to paste it into a note.com bio, a Mastodon profile, a GitHub README, or a plain `.txt` file, and it works. If a platform gives you a text box, that's enough.

## Progressive enhancement

If a human reads your `agent.txtar` block, they see a normal paragraph at the top and some code-looking stuff at the bottom. They get what they need and ignore the rest. If an AI agent reads it, it gets structured data with typed fields and clear semantics. Same block, both audiences served, neither one compromised.

This borrows from the web's old "progressive enhancement" idea: the baseline works everywhere, and capabilities layer on top for clients that understand them.

## The author writes for agents, not against platforms

JSON-LD, OpenGraph, and microformats are good ideas that ran into the same wall: you need to control the HTML `<head>`. On most platforms, you don't. You're a guest on someone else's infrastructure, and all you get is a text field.

`agent.txtar` works inside that constraint. Agents are smart enough to find a `-- agent.txtar.json --` boundary in raw text without needing HTTP headers or HTML metadata.

## LLMs generate it, LLMs consume it

This format is designed for a world where both the writer and the reader might be an LLM.

A person can ask ChatGPT to generate their `agent.txtar` block from an existing bio. The LLM won't mess up the syntax because there's nothing to mess up -- no JSON string escaping for multiline text, no YAML indentation sensitivity. Just `-- filename --` separators and plain content.

On the reading side, LLMs already understand txtar from training data (Go test fixtures, code generation benchmarks). They parse it more reliably than deeply nested JSON.

## Don't over-specify

The spec defines three core route keys (`bio`, `directives`, `verification`) and leaves everything else open. Want to add `-- ramen-ranking.csv --`? Go ahead. Agents that don't know what to do with it will skip it. Agents that do will use it.

New standardized routes go through the [REGISTRY.md](https://github.com/didvc/agent.txtar/blob/main/REGISTRY.md) as community PRs. The core spec stays small and stable.

## No central authority needed

There's no API to register with, no token to obtain, no DNS record to configure. You write a text block, you put it somewhere, and that's it. Verification (if you want it) uses existing decentralized mechanisms -- PGP keys, DIDs -- bundled right inside the block.
