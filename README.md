# Ctrl+Alt+Defend

Tower defense game in the browser: build security programs into a maze and stop viruses from stealing your data.

What the game is and how it plays: [`product.md`](./product.md). Next.js (App Router), React, TypeScript and
Tailwind CSS. Rules for contributors and AI agents live in [`AGENTS.md`](./AGENTS.md); read it before changing
anything.

AI agents must use the skills vendored in `.agents/skills` (see "Required skills" in `AGENTS.md`).
`next-dev-loop` needs `npm i -g agent-browser@latest`.

## Getting started

Requires Node 22 (`.nvmrc`) and Corepack, which provides the pinned pnpm version.

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000.

## Checks

`pnpm verify` runs what CI's `check` job runs (format, lint, typecheck, unit tests, unused-code scan,
isolated production build). `pnpm test:e2e` runs the Playwright suite: every route in the sitemap
plus the 404 page, with an axe accessibility scan on each. The first run needs
`pnpm exec playwright install chromium`.

## Deploying

Set every variable from `.env.example` on the hosting provider; the build fails without them.
`NEXT_PUBLIC_SITE_URL` is the production origin with no trailing slash.

## Contributing

`main` is protected: work on a branch, open a pull request, and squash-merge once the `check` and `e2e`
jobs are green.
