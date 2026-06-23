# Contributing

Thanks for your interest. Here's how to help.

## Spec feedback

The simplest way to contribute is to open an issue. If something in the spec feels unclear, broken, or missing -- say so. Concrete examples help a lot ("I tried to do X and the spec didn't cover Y").

## Route registry

Want a new standardized route key? Edit [REGISTRY.md](REGISTRY.md), add a row to the table, and open a PR. Keep the description short. If your key overlaps with an existing one, we'll ask you to consolidate.

## Parsers

Reference parsers live in `src/parsers/`. PRs for new languages or improvements to existing ones are welcome. Your parser should:

- Pass all fixtures in `tests/fixtures/valid/` (parse successfully, extract correct manifest and files)
- Reject all fixtures in `tests/fixtures/invalid/` (return error or null)
- Handle the trailing-text guillotine (JSON bracket balancing on the manifest)

Zero-dependency implementations are preferred.

## Docs

Documentation source is in `docs/` and built with VitePress. To preview locally:

```bash
npm install
npm run docs:dev
```

## Code style

Nothing fancy. Keep things readable. Don't over-engineer.

## License

By contributing, you agree that your spec/doc contributions are released under CC BY 4.0 and code contributions under MIT. See [LICENSE](LICENSE).
