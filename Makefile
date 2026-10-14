.PHONY: build test check

build:
	bun run build

test:
	bun run workspace:test

check:
	bun run check
