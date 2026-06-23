# agent.txtar Standard Routes Registry

Community-managed registry of standardized `routes` keys beyond the core three (`bio`, `directives`, `verification`).

Want to register a new key? Add a row to the table below and open a Pull Request.

## Rules

- Pick a short, lowercase, descriptive key.
- Don't duplicate an existing key's purpose. If in doubt, open an issue first.
- Include a one-line description and what kind of content the file should contain.
- Core routes (`bio`, `directives`, `verification`) live in [SPEC.md](SPEC.md) and can't be changed here.

## Registered Routes

| Key | Expected Content | Description | Proposer |
|:----|:-----------------|:------------|:---------|
| `schedule` | URL or iCal | Link or data for booking / calendar availability | @didvc |
| `contact` | structured text | Contact methods and preferences beyond what's in the preamble | @didvc |
| `memory` | plain text | Carry-over notes for agents that have talked to this person/project before | @didvc |

## Experimental / Unregistered

Any key not listed above or in the core spec is fair game. Use whatever you want -- `x-my-thing`, `ramen-ranking`, `llm-overrides`, etc. Agents that don't recognize a key just skip it.
