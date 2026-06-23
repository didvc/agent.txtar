# Parsers

Reference implementations for extracting `agent.txtar` blocks from arbitrary text.

## Extraction algorithm

Every parser follows the same logic:

1. Parse the input string as a txtar archive
2. Scan the file list for a section named `agent.txtar.json`
3. If not found, this isn't an `agent.txtar` block -- return null
4. Extract the JSON from that section using bracket balancing (track `{`/`}` depth, cut at depth 0) to handle trailing host-page text
5. Parse the JSON as the manifest
6. Validate: `agent_txtar` key must be present
7. All file sections before the manifest are content files; everything after is discarded

```python
def extract(raw: str):
    archive = txtar.parse(raw)

    manifest_idx = None
    for i in reversed(range(len(archive.files))):
        if archive.files[i].name == "agent.txtar.json":
            manifest_idx = i
            break

    if manifest_idx is None:
        return None

    json_str = balanced_json(archive.files[manifest_idx].data)
    manifest = json.loads(json_str)

    if "agent_txtar" not in manifest:
        return None

    return {
        "preamble": archive.comment,
        "files": archive.files[:manifest_idx],
        "manifest": manifest,
    }
```

## Reference implementations

| Language | Path | Package |
|----------|------|---------|
| TypeScript | [`src/parsers/ts/`](https://github.com/didvc/agent.txtar/tree/main/src/parsers/ts) | -- |
| Go | [`src/parsers/go/`](https://github.com/didvc/agent.txtar/tree/main/src/parsers/go) | -- |
| Python | [`src/parsers/py/`](https://github.com/didvc/agent.txtar/tree/main/src/parsers/py) | -- |

All reference parsers are zero-dependency and should pass the test fixtures in [`tests/fixtures/`](https://github.com/didvc/agent.txtar/tree/main/tests/fixtures).

## Bracket balancing (the guillotine)

The manifest is always last. When the block is embedded in a larger text, the manifest section's raw data may contain trailing garbage from the host page:

```
{
  "agent_txtar": "0.1.0",
  "name": "someone"
}

Oh btw here's my latest blog post about cats...
```

The parser must not try to JSON.parse the whole thing. Instead:

1. Find the first `{`
2. Scan forward, incrementing depth on `{`, decrementing on `}`
3. When depth hits 0, that's the end of the JSON
4. Slice the string there and parse only that portion

This handles strings containing `{` and `}` correctly because JSON string contents are escaped.

## Conformance testing

Your parser is conformant if it:

- Successfully parses everything in `tests/fixtures/valid/` and produces the correct manifest + file list
- Rejects everything in `tests/fixtures/invalid/` (returns null/error)
- Correctly handles `03_trailing_text.txtar` (discards text after the manifest's closing brace)

PRs for parsers in other languages are welcome. See [CONTRIBUTING.md](https://github.com/didvc/agent.txtar/blob/main/CONTRIBUTING.md).
