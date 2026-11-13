# AGENTS.md

Guide for AI coding agents (and humans) working in this repo. Read it before changing anything.

## What this is

Ctrl+Alt+Defend: tower defense game in the browser. Build security programs into a maze and stop viruses from stealing your data.

The product spec is [`product.md`](./product.md): read it before building or changing any game behavior. When a change alters what the game does, update `product.md` in the same PR.

<!-- BEGIN:hugo-rules -->
<!-- House rules shared by every project from the setup-fe-project template. Project-specific rules go outside this block. -->

## Repo map

```
src/app               Next.js routes; thin, they render a feature screen
src/features/shared   shared kernel: UI primitives, utils
src/features/<name>   one folder per feature (components, hooks, pure logic)
src/content           all UI copy and page metadata, typed
src/env.ts            typed environment variables (the build fails on a missing one)
e2e                   Playwright smoke + accessibility tests over every sitemap route
.agents/skills        vendored agent skills pinned in skills-lock.json (.claude/skills links to them)
```

Dependencies flow one way: **shared → features → app**.

## Rules

- **Boundary:** `src/features/shared` may not import another feature or `src/app`; a feature may not import another feature or `src/app`. What two features need moves to `shared`. ESLint generates the rule for every folder in `src/features`, and CI fails on a violation. Do not disable the rule; move the code instead.
- **No third-party UI kit.** Build components in `src/features/shared/components` (primitives) or the feature's `components/`. Behavior-only libraries are fine.
- **Every `.tsx` component is presentation only.** It renders props and what its hook returns: no logic, no data, no class strings. ESLint fails the build on helper functions, arithmetic, template formatting, array manipulation, module-level data, effects or browser APIs in a component file (`presentation/no-restricted-syntax`). Full rule: "Component architecture" below. Applies to shared primitives, feature components and `src/app` route files alike.
- **Types live in `X.type.ts`.** Every `interface` and `type` goes in a `.type.ts` file next to the file that uses it (`Button.tsx` → `Button.type.ts`; copy → `src/content/content.type.ts`); tests may keep local types. Interfaces start with `I` (`IUser`), type aliases with `T` (`TButtonProps`). ESLint enforces both.
- **Token-only styling.** Colors, fonts and radii are semantic tokens declared once in `src/app/globals.css` (`@theme`). Style files use the Tailwind utilities those tokens generate (`bg-surface`, `text-muted`, `outline-focus`…). Tailwind's default palette is removed and `design-tokens/no-raw-color` fails on raw palette classes and color literals. Every new color pair that carries text or UI goes in `src/app/tokenContrast.test.ts`.
- **Accessibility is a requirement:** semantic HTML, an accessible name on every control, visible focus (`focus-visible`), WCAG 2.2 AA contrast for every token pair (tested in both color schemes), keyboard access, and `prefers-reduced-motion` honored (opacity fades only). `jsx-a11y` strict rules run in lint; axe runs on every route in `pnpm test:e2e`.
- **No scroll-jacking:** never `preventDefault` wheel, touch or keyboard scrolling.
- **Copy:** all text lives in `src/content` (labels, headings, `aria-label`s, metadata). ESLint fails on text in markup.
- **Environment:** read variables from `env` (`src/env.ts`), never `process.env`. A new variable goes in `src/env.ts`, `.env.example`, the CI workflow's `env`, and the hosting provider.
- **New public route:** add its path to `src/app/sitemap.ts`; the e2e suite then loads it and runs axe on it.

## Required skills

Three skills from Vercel are installed in `.agents/skills/` (pinned in `skills-lock.json`). Using them is mandatory, not optional:

| Skill                         | Read it before…                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `vercel-react-best-practices` | writing, reviewing or refactoring any React or Next.js code: components, hooks, routes, data fetching, bundles     |
| `vercel-composition-patterns` | designing or changing a component's API: props, variants, compound components, context, shared state               |
| `next-dev-loop`               | calling a UI or route change done: verify it at runtime against `next dev` (needs `npm i -g agent-browser@latest`) |

- **Precedence:** this file wins over any skill, and the Next.js docs in `node_modules/next/dist/docs/` win on what a Next.js API does. When a skill's example puts logic, data or class strings in a `.tsx` file, apply the idea and keep this file's split: the logic goes in `useX.ts`, data in `X.data.ts` or `src/content`, classes in `X.style.ts`.
- **Name the skill rules you applied** in the PR description when they shaped the change (for example `async-parallel`, `architecture-avoid-boolean-props`).
- **Never edit the vendored skill files.** Update them on a `chore/` branch with `npx skills update -p -y`; `npx skills check` reports updates and local edits.

## Component architecture

Each concern has its own kind of file. A component file never mixes them.

- **`X.tsx` is presentation only.** It maps props and hook results to markup: JSX, destructuring, `.map` over ready-made arrays, simple conditionals on given values (`status === "done"`, `index > 0`), and `cx()` for classes. Nothing else: no helper functions, arithmetic, template formatting, array manipulation (`filter`, `sort`, `join`…), module-level data, effects, timers, observers or `window` / `document` / `navigator`.
- **`useX.ts` is behavior and derived data.** State, effects, browser APIs, timers, and the view model the markup needs. It never returns JSX. A generic behavior hook is named after what it does (`useDisclosure`) and composed by the component's own hook.
- **Pure logic** that needs no React goes in a plain `.ts` module (`features/*/logic`) with its own unit test; hooks call it.
- **`X.data.ts`** holds static data a component renders (option lists, presets). UI copy lives in `src/content`.
- **`X.type.ts`** holds every type and interface, next to the file that uses it.

## Styling architecture

Markup and styling never share a file.

- **`X.style.ts` owns every class.** It exports one plain object per component: `base` for the classes every instance gets, one key per variant mapping each option to its classes, and named keys for other parts. No logic: values are plain strings, or `cx()` over strings and shared pieces. `.join()` and template literals fail ESLint, so Tailwind always sees every class literally.
- **`X.tsx` composes classes with `cx()`** (`src/features/shared/utils/cx.ts`): `cx(button.base, button.variant[variant], className)`. A class string in `className` (literal, template, or inside a call/conditional) fails ESLint.
- **Variants are declared once.** Prop types come from the style object (`variant?: keyof typeof button.variant`). Defaults live in the component's props.
- **Callers extend, never override.** A component accepts `className` and passes it last to `cx()`; use it for layout, not to restyle internals.

## Commands

| Command             | What it does                                                          |
| ------------------- | --------------------------------------------------------------------- |
| `pnpm dev`          | Next.js dev server                                                    |
| `pnpm build`        | production build                                                      |
| `pnpm lint`         | ESLint (boundary, component, style-file, copy, token and a11y rules)  |
| `pnpm typecheck`    | route types + `tsc --noEmit`                                          |
| `pnpm test`         | Vitest + Testing Library                                              |
| `pnpm test:e2e`     | Playwright: isolated production build, every sitemap route + 404, axe |
| `pnpm knip`         | unused files, exports and dependencies                                |
| `pnpm format`       | Prettier; also sorts Tailwind classes, inside `cx()` too              |
| `pnpm format:check` | Prettier check (CI)                                                   |
| `pnpm verify`       | everything CI's `check` job runs, building into `.next-verify`        |

## Workflow

Never commit to `main`; GitHub rejects it. Each stage of work gets its own branch (`feat/<name>`, `fix/<name>`, `refactor/<name>`, `chore/<name>`), stays small (≤ ~20 files) and lands through a pull request that Hugo reviews and squash-merges; the `check` and `e2e` CI jobs must be green. Fill in the PR template. Write the failing test first for anything with logic; run `pnpm verify` and `pnpm test:e2e` before asking for review.

Dependabot opens grouped dependency PRs weekly. Review them like any other PR; CI decides.

**Verifying a production build while Hugo works:** never delete or build into `.next` (his `next dev` and builds use it). Build and serve in isolation: `NEXT_DIST_DIR=.next-verify pnpm build`, then `NEXT_DIST_DIR=.next-verify pnpm start -p <port>` once the build has finished. `pnpm test:e2e` builds into `.next-e2e` for the same reason.

<!-- END:hugo-rules -->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
