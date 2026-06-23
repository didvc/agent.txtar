# Prompts

You don't need to write `agent.txtar` blocks by hand. LLMs are good at this.

## Generate a personal block

Paste your existing bio, profile text, or resume into an LLM and use a prompt like:

```
Create an agent.txtar block from the following information about me.
Follow the spec at https://github.com/didvc/agent.txtar

The block should include:
- A short human-readable preamble at the top
- A bio.md with my background
- A directives.txt with rules for how agents should interact with me
- An agent.txtar.json manifest at the end

Here's my info:
[paste your bio / profile / resume here]
```

## Generate a project block

For a repository or project:

```
Create an agent.txtar block for this project.
Follow the spec at https://github.com/didvc/agent.txtar

Include:
- A preamble with a one-line project description
- An overview.md with what the project does, its stack, and repo layout
- A directives.txt with contribution rules and things agents should know
- An agent.txtar.json manifest with type "project"

Here's the project README:
[paste README or project description]
```

## Conversion from existing formats

If you already have a JSON-LD profile, an about page, or structured data somewhere:

```
Convert the following structured data into an agent.txtar block.
Follow the spec at https://github.com/didvc/agent.txtar
Keep the preamble short and human-friendly.

[paste your existing data]
```

## Tips

- LLMs won't mess up the syntax. There's nothing to escape -- txtar sections are just plain text between `-- filename --` markers.
- The manifest JSON is simple enough that LLMs produce valid output consistently.
- You can iterate: generate a draft, edit the parts you care about, and leave the rest.
