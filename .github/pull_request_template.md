## What and why

<!-- One or two sentences: the change and the reason for it. Link the issue or spec if there is one. -->

## How to check it

<!-- Steps or the page to open. Screenshots at desktop and phone width for UI changes. -->

## Checklist

- [ ] Branch is small (≤ ~20 files) and does one stage of work
- [ ] Failing test written first for anything with logic
- [ ] `pnpm verify` passes (format, lint, typecheck, test, knip, isolated build)
- [ ] `pnpm test:e2e` passes; new public routes are in `src/app/sitemap.ts`
- [ ] Copy lives in `src/content`; colors come from tokens; new color pairs are in `tokenContrast.test.ts`
- [ ] New environment variables are in `src/env.ts`, `.env.example`, CI and the hosting provider
- [ ] `AGENTS.md` updated if a rule, command or folder changed
