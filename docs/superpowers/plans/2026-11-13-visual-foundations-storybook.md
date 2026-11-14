# Visual foundations and Storybook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved visual direction as code: a dark-only token palette and fonts, a Storybook that documents
them, and presentational React components for every game piece and interface part of the first release (3 towers,
2 enemies, board with obstacles, tower info card, match header, UI primitives), each documented with stories.

**Architecture:** Tokens live once in `src/app/globals.css` and reach components as Tailwind utilities
(`bg-surface`, `fill-worm`, `stroke-firewall`). UI primitives go in `src/features/shared/components`; game pieces go in
a new `src/features/game` feature. Every component follows `AGENTS.md`: `X.tsx` renders only, `useX.ts` builds the
view model (all arithmetic, transforms, arrays), `X.style.ts` holds classes, `X.type.ts` holds types, copy comes from
`src/content/game.ts`. Game pieces are SVG drawn in board units (1 cell = 40 units) so they scale with their container.
Nothing here runs the game: no simulation, pathfinding or state machine. Components take props.

**Tech Stack:** Next.js 16.4.6, React 19.3, Tailwind 4.3.3, TypeScript 6, Storybook 10.6.7 (`@storybook/nextjs-vite`,
`@storybook/addon-docs`, `@storybook/addon-a11y`, `@storybook/addon-vitest`), Vitest 5 (jsdom unit project + browser
project for stories via `@vitest/browser-playwright`), `@tailwindcss/vite` 4.3.3, `next/font/google`.

**Spec:** `product.md` (sections "First release", 5, 6, 8, 11, 12) and the approved mockup
`docs/design/visual-direction.html` (open it in a browser; it is the visual reference for every task: shapes,
proportions, states and copy).

## Global Constraints

- One task = one branch = one pull request into `main`, ≤ ~20 files, PR template filled in. Branch from the latest
  `main`; if the previous task's PR is not merged yet, branch from that task's branch and set the PR base to it.
  PR #1 (`chore/project-setup`) must be merged before Task 1.
- `pnpm verify` and `pnpm test:e2e` green before asking for review; from Task 2 on, also `pnpm test:stories` and
  `pnpm storybook:build`.
- `AGENTS.md` rules apply to all product code: presentation-only `.tsx`, `useX.ts` / `X.style.ts` / `X.type.ts` /
  `X.data.ts`, `I`/`T` type prefixes, copy only in `src/content`, token-only colors (no hex in `src/**/*.{ts,tsx}`
  outside tests), jsx-a11y strict, `function X()` components, no feature imports another feature.
- Dark only. One palette; no `prefers-color-scheme` branch (product.md section 12).
- Colors, exact values (from the approved mockup):

  | Token          | Value     | Role                                              |
  | -------------- | --------- | ------------------------------------------------- |
  | `bg`           | `#08130F` | page ground                                       |
  | `frame`        | `#0B1A15` | board frame, tower pads                           |
  | `board`        | `#0D1F19` | play surface (solder mask)                        |
  | `surface`      | `#11241E` | header, side panel                                |
  | `raised`       | `#173029` | cards, popovers, hover                            |
  | `line`         | `#24443A` | borders, grid dots, empty bars and pips           |
  | `fg`           | `#E7EDE6` | text, silkscreen labels, health fill              |
  | `muted`        | `#9DB2A6` | secondary text                                    |
  | `accent`       | `#45E3F2` | primary button, focus ring                        |
  | `accent-hover` | `#7DEEF8` | primary button hover                              |
  | `on-accent`    | `#08130F` | text on accent                                    |
  | `focus`        | `#45E3F2` | focus outline                                     |
  | `copper`       | `#C38A55` | pins, connectors                                  |
  | `copper-dim`   | `#5E4329` | traces, vias, keep-out hatch                      |
  | `firewall`     | `#A9C4DC` | Firewall tower, boost marker and edge             |
  | `antivirus`    | `#45E3F2` | Antivirus tower, shots                            |
  | `debugger`     | `#86F59E` | Debugger tower, beams, upgrade gains              |
  | `worm`         | `#FF5AA8` | Worm                                              |
  | `rootkit`      | `#B58EFF` | Rootkit, armor marker                             |
  | `data`         | `#FFD54A` | files, bits, costs                                |
  | `danger`       | `#FF6B6B` | leaked files, refused placement, destructive text |

  Darker inner fills in the mockup (tower inner discs, rootkit shell, chip bodies, resistor body) are expressed with
  these tokens plus Tailwind opacity modifiers (`fill-rootkit/15`, `fill-bg`), never new hex values.

- Fonts: Chakra Petch 500/600/700 (`font-display`), B612 400/700 (`font-sans`), B612 Mono 400/700 (`font-mono`), via
  `next/font/google`, variables `--font-display`, `--font-ui`, `--font-num`.
- Board units: 1 cell = 40 SVG units; the Home PC board is 24 × 16 cells; the frame is 16 units wide around it.
- Every interactive control has an accessible name from content; game pieces drawn as SVG have `role="img"` and an
  `aria-label` from content, decorative board parts are `aria-hidden`.
- `prefers-reduced-motion`: the hit glitch becomes a short opacity fade; nothing else moves.
- Stories: every component gets a `X.stories.tsx` next to it with one story per documented state. Stories are
  exempt from the presentation, copy and types lint rules (Task 2 sets this up) but must pass the a11y test.

## Review Focus

1. **Fonts in Storybook.** `next/font` must apply in Storybook, not fall back to system fonts. Task 2 adds a story
   test asserting the computed `font-family` of a `font-display` element contains `Chakra Petch`.
2. **Tokens that silently don't exist.** A typo like `fill-firwall` compiles to no CSS and draws black. Task 1's
   token test pins the exact token list; every later style file uses only those names.
3. **Header with large numbers.** Bits `99999`, wave `30 / 30`, 12 file pips must not overflow the header at
   1312 px wide. Task 8 adds a story whose play function asserts `scrollWidth <= clientWidth` on the header.
4. **Disabled actions explain themselves.** "Not enough bits" and "Locked in the Upgrade lab" must expose the reason
   to assistive tech, not only visually. Tasks 7's stories assert the reason text is in the accessible description.
5. **Board scales.** The board SVG must fill its container width without fixed pixel sizes. Task 4's story asserts the
   SVG has a `viewBox` and no `width`/`height` attributes.

---

### Task 1: Dark palette and fonts

Branch `feat/design-tokens`.

**Files:**

- Modify: `src/app/globals.css` (replace the light `@theme static` values and delete the dark `@media` block; set
  `html { color-scheme: dark }`; map fonts in `@theme inline`)
- Modify: `src/app/fonts.ts` (replace Geist with the three faces)
- Modify: `src/app/layout.tsx` (apply the three font variables)
- Modify: `src/app/tokenContrast.test.ts`
- Modify: `src/features/shared/utils/colorContrast.ts` (delete `readDarkColors` and `DARK_BLOCK`)
- Modify: `src/features/shared/theme/themeTokens.ts` (`themeColor(name)`; drop the scheme parameter) and its callers
  `src/features/shared/brand/OgCard.style.ts`, `src/features/shared/brand/brandImage.ts`, `src/app/manifest.ts`
- Modify: `AGENTS.md` (outside the hugo-rules markers: "Dark only, one palette; see product.md section 12")

**Interfaces:**

- Produces: Tailwind utilities for every token in Global Constraints (`bg-*`, `text-*`, `border-*`, `fill-*`,
  `stroke-*`), `font-display`, `font-sans`, `font-mono`. `themeColor(name: string): string`.

- [ ] **Step 1: Rewrite `tokenContrast.test.ts` (failing)**

  Tests:
  - `declares exactly the game palette`: `Object.keys(readThemeColors(css)).sort()` equals the 21 token names above.
  - `text pairs meet 4.5:1`: `fg`, `muted` on `bg`, `surface`, `raised`; `on-accent` on `accent`, `accent-hover`;
    `data`, `danger`, `debugger`, `firewall` on `surface` and `raised`.
  - `graphics meet 3:1`: `focus` on `bg`, `surface`; `copper`, `firewall`, `antivirus`, `debugger`, `worm`,
    `rootkit`, `data`, `danger`, `fg` on `board`.
  - `has no dark-scheme override block`: `css` does not match `/prefers-color-scheme/`.

- [ ] **Step 2: Run** `pnpm test` → FAIL (token list differs, dark block present).

- [ ] **Step 3: Implement** the tokens, delete the dark block and `readDarkColors`, switch fonts
      (`Chakra_Petch({ weight: ["500","600","700"], variable: "--font-display" })`, `B612({ weight: ["400","700"],
variable: "--font-ui" })`, `B612_Mono({ weight: ["400","700"], variable: "--font-num" })`, subsets `latin`),
      `@theme inline { --font-display: var(--font-display); --font-sans: var(--font-ui); --font-mono: var(--font-num); }`.
      Update `themeColor` callers.

- [ ] **Step 4: Run** `pnpm verify && pnpm test:e2e` → PASS (the home and 404 pages now render dark; axe passes).

- [ ] **Step 5: Commit and open the PR** `feat: dark game palette and fonts`.

### Task 2: Storybook, foundations pages and icons

Branch `chore/storybook`.

**Files:**

- Create: `.storybook/main.ts` (framework `@storybook/nextjs-vite`; stories `../src/**/*.mdx`,
  `../src/**/*.stories.tsx`; addons docs, a11y, vitest; `viteFinal` adds `tailwindcss()` from `@tailwindcss/vite`)
- Create: `.storybook/preview.tsx` (imports `../src/app/globals.css`; decorator wraps stories in an element carrying
  the three font variables and `bg-bg text-fg font-sans p-6`; `parameters.a11y.test = "error"`;
  `parameters.layout = "fullscreen"`)
- Create: `.storybook/vitest.setup.ts` (`setProjectAnnotations` with the preview and a11y annotations)
- Modify: `vitest.config.mts` (two projects: `unit` = current jsdom config; `storybook` = `storybookTest()` plugin,
  browser mode, `@vitest/browser-playwright`, headless chromium)
- Modify: `package.json` scripts: `test` → `vitest run --project unit`; add `test:stories` →
  `vitest run --project storybook`; `storybook` → `storybook dev -p 6006`; `storybook:build` →
  `storybook build -o storybook-static`; `verify` appends `pnpm test:stories && pnpm storybook:build`
- Modify: `.github/workflows/ci.yml` job `check`: after install add `pnpm exec playwright install --with-deps
chromium`, then `pnpm test:stories` and `pnpm storybook:build` after `pnpm test`
- Modify: `eslint.config.mjs`: `globalIgnores` adds `storybook-static/**`; a block for `**/*.stories.tsx` and
  `.storybook/**` turning off `presentation/no-restricted-syntax` and `no-restricted-syntax` (keeps jsx-a11y and
  `design-tokens/no-raw-color`)
- Modify: `.gitignore`, `.prettierignore`: `storybook-static`
- Modify: `pnpm-workspace.yaml` `allowBuilds` only if `pnpm install` reports a blocked build that Storybook needs
- Modify: `AGENTS.md` (outside hugo-rules): "Storybook" section with the four commands, "every component gets
  stories next to it, one per documented state", and the stories lint exemption
- Create: `src/docs/Introduction.mdx`, `src/docs/Colors.mdx` (`ColorPalette`/`ColorItem` grouped "Board and
  interface" and "Game roles", each with the role text from Global Constraints), `src/docs/Typography.mdx`
  (`Typeset` for display 40/18, body 15, label 11 caps, numbers 18 mono, silkscreen 10 mono)
- Create: `src/docs/Fonts.stories.tsx` (story test for Review Focus 1)
- Create: `src/features/shared/components/Icon/Icon.tsx`, `Icon.data.ts`, `Icon.type.ts`, `Icon.style.ts`,
  `Icon.stories.tsx`

**Interfaces:**

- Produces: `Icon({ name, className }: IIconProps)`; `TIconName = "pause" | "play" | "sound" | "sound-off" | "gear" |
"lock" | "bits" | "block" | "check" | "forward"`. 24 × 24 viewBox, `stroke="currentColor"` 1.8, decorative
  (`aria-hidden`), color from the parent's text color. Gear path from Lucide (ISC); keep the license note in
  `Icon.data.ts`.

- [ ] **Step 1:** Install `storybook@10.6.7 @storybook/nextjs-vite@10.6.7 @storybook/addon-docs@10.6.7
@storybook/addon-a11y@10.6.7 @storybook/addon-vitest@10.6.7 @vitest/browser-playwright @tailwindcss/vite@4.3.3` as
      dev dependencies (`pnpm add -D`).
- [ ] **Step 2:** Write `Fonts.stories.tsx` with a story rendering a `font-display` heading and a play function
      asserting `getComputedStyle(heading).fontFamily` contains `Chakra Petch`; write `Icon.stories.tsx` with an
      "All icons" story rendering every `TIconName`.
- [ ] **Step 3: Run** `pnpm test:stories` → FAIL (no config / no component).
- [ ] **Step 4:** Implement the config files, docs pages and `Icon`.
- [ ] **Step 5: Run** `pnpm verify && pnpm test:e2e` → PASS; open `pnpm storybook` and check Colors and Typography
      pages against the mockup's palette and type sections.
- [ ] **Step 6: Commit and open the PR** `chore: add Storybook with colors, typography and icons`.

### Task 3: UI primitives

Branch `feat/ui-primitives`. All under `src/features/shared/components/<Name>/` with `.tsx`, `.style.ts`,
`.type.ts`, `.stories.tsx`, plus `useX.ts` where state or derived values exist.

**Interfaces:**

- Produces:
  - `Button({ variant, size, children, shortcut, disabled, describedBy, onClick, className })`, `variant: "primary" |
"ghost" | "danger"`, `size: "sm" | "md"` (30 / 34 px). `shortcut` renders a `Kbd` inside.
  - `IconButton({ icon: TIconName, label, pressed, onClick })` (34 × 34, `aria-pressed` when `pressed` is defined).
  - `SegmentedControl<T extends string>({ label, options: { value: T; text: string }[], value, onChange })`
    (`role="group"`, buttons with `aria-pressed`).
  - `Switch({ label, checked, onChange })` (`role="switch"`, `aria-checked`).
  - `Kbd({ children })`, `Pill({ children })`.
  - `Stat({ label, value, total })` (caps label over mono value; `total` rendered muted as "/ total").
  - `Popover({ label, open, onClose, children })` (`role="dialog"`, Escape closes, focus moves into it on open and
    back to the trigger on close).

- [ ] **Step 1:** Write stories with play functions: `Switch` toggles `aria-checked` on click and Space;
      `SegmentedControl` sets `aria-pressed` on the clicked option and calls `onChange` with its value; `Popover`
      closes on Escape and returns focus to the trigger; `IconButton` exposes its label as accessible name. Plain
      render stories for every `Button` variant × disabled, `Kbd`, `Pill`, `Stat`.
- [ ] **Step 2: Run** `pnpm test:stories` → FAIL.
- [ ] **Step 3:** Implement the components (state in `usePopover.ts` / `useSwitch.ts`; classes per mockup:
      radii 6 px for controls, 12 px for popover, borders `border-line`, hover `bg-raised`).
- [ ] **Step 4: Run** `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 5: Commit and open the PR** `feat: UI primitives with stories`.

### Task 4: Board, obstacles, ports and Data Core

Branch `feat/board`. New feature folder `src/features/game`.

**Files:**

- Create: `src/features/game/logic/geometry.ts` + `geometry.test.ts`
- Create: `src/features/game/level/level.type.ts`, `src/features/game/level/homePc.data.ts`
- Create: `src/features/game/components/GameDefs/` (SVG `<defs>`: `glow` filter, `dots` pattern, `keepout`
  pattern, `invalid` pattern; rendered once inside each board SVG)
- Create: `src/features/game/components/Board/` (`Board.tsx`, `useBoard.ts`, `Board.style.ts`, `Board.type.ts`,
  `Board.stories.tsx`): frame, dotted grid, traces with vias, obstacles, ports, core, and a `children` slot for
  towers/enemies/effects layers
- Create: `src/features/game/components/Obstacle/` (`chip`, `capacitor`, `resistor`, `crystal`, each with its
  silkscreen label)
- Create: `src/features/game/components/Port/` (edge connector fingers, keep-out hatch, "J1 PORT" label)
- Create: `src/features/game/components/DataCore/` (package with copper pins, die, "CORE" label, file slots lit or
  outlined)
- Create: `src/features/game/components/FileToken/` (yellow file glyph; variants `inCore`, `dropped` with the
  dashed drift trail)
- Create: `src/content/game.ts` + types in `src/content/content.type.ts` (`IGameContent`; this task adds board
  labels: `core`, `port(label)`, obstacle accessible names)

**Interfaces:**

- Produces:
  - `CELL = 40`; `cellCenter(c: number): number` (`c * 40 + 20`); `cellOrigin(c: number): number`;
    `boardSize(cols: number, rows: number): { width: number; height: number }`.
  - `ILevelMap { cols; rows; core: { c; r }; ports: IPort[]; obstacles: IObstacle[]; traces: ITrace[] }`,
    `IPort { id: string; side: "left" | "right" | "top" | "bottom"; start: number }` (2 cells long),
    `IObstacle { kind: "chip" | "capacitor" | "resistor" | "crystal"; c; r; w; h; label; text? }`,
    `ITrace { d: string; vias: [number, number][] }`.
  - `homePc: ILevelMap` with exactly the mockup's layout: 24 × 16, core at (11, 7), ports J1 left rows 2–3 and J2
    right rows 12–13, chips U1 BIOS (4,9 3×2), U2 RAM (16,2 2×2), U3 NET (10,12 2×3), capacitors C1 (8,3), C2 (20,7),
    resistor R1 (18,14 2×1), crystal Y1 (5,13 2×1), and the mockup's eight traces.
  - `Board({ map: ILevelMap, children })`, `DataCore({ files: number, filesInCore: number })`,
    `FileToken({ state: "inCore" | "dropped" })`.

- [ ] **Step 1: Write `geometry.test.ts`**: `cellCenter(0) === 20`, `cellCenter(23) === 940`,
      `boardSize(24, 16)` is `{ width: 960, height: 640 }`.
- [ ] **Step 2: Run** `pnpm test` → FAIL.
- [ ] **Step 3: Implement** `geometry.ts`.
- [ ] **Step 4:** Write stories: `Board / Home PC` (asserts Review Focus 5: `viewBox` present, no `width`/`height`
      attributes on the root `svg`), each obstacle kind, `Port`, `DataCore` with 8/8, 5/8, 0/8 files (play function
      asserts the accessible name reads the count, e.g. "Core, 5 of 8 files"), `FileToken` dropped.
- [ ] **Step 5:** Implement the components; all coordinates come from `useBoard` / `useX` view models built with
      `geometry.ts`.
- [ ] **Step 6: Run** `pnpm verify && pnpm test:e2e` → PASS; compare `Board / Home PC` with the mockup board.
- [ ] **Step 7: Commit and open the PR** `feat: board, obstacles, ports and data core`.

### Task 5: Towers

Branch `feat/towers`.

**Files:**

- Create: `src/features/game/components/Tower/` (`Tower.tsx`, `useTower.ts`, `Tower.style.ts`, `Tower.type.ts`,
  `Tower.stories.tsx`)
- Create: `src/features/game/components/RangeRing/`, `BoostEdge/`, `Shot/`, `Beam/`, `PlacementGhost/`
- Modify: `src/content/game.ts` (tower names, roles, accessible state words: "selected", "boosted", "version")

**Interfaces:**

- Consumes: `cellCenter`, `GameDefs`, `Board` (stories place towers on a small board).
- Produces:
  - `TTowerType = "firewall" | "antivirus" | "debugger"`, `TVersion = 1 | 2 | 3`.
  - `Tower({ type, version, c, r, aimAt?: { x; y }, selected?, boosted? })`: pad, type glyph (brick wall, shield
    turret with barrel rotated toward `aimAt`, diamond emitter), three version pips along the bottom edge, boost
    chevrons top-right when `boosted`, silkscreen corner brackets when `selected`. Accessible name e.g.
    "Antivirus v2.0, boosted, selected".
  - `RangeRing({ type, c, r, range })` (range in cells; dashed ring in the tower color at 6 % fill).
  - `BoostEdge({ from: { c; r }, to: { c; r } })` (glowing `firewall` bar on the shared edge; only orthogonal
    neighbors).
  - `Shot({ from: { x; y }, to: { x; y } })`, `Beam({ from, to, ramp: number })` (`ramp` 0–1 sets thickness).
  - `PlacementGhost({ type, c, r, valid, reason? })`: valid = 55 % tower + white outline + check badge; invalid =
    `invalid` hatch + `block` icon + reason tooltip text.

- [ ] **Step 1:** `useTower.test.ts`: barrel rotation for `aimAt` straight above is `0`, to the right is `90`;
      pips for version 2 are `[true, true, false]`; `BoostEdge` view model for neighbors `(6,6)→(7,6)` is a vertical bar
      centered at `x = 280`, and is `null` for diagonal or non-adjacent cells (diagonals never boost; the component
      renders nothing). Put the edge test in `useBoostEdge.test.ts`.
- [ ] **Step 2: Run** `pnpm test` → FAIL.
- [ ] **Step 3:** Implement hooks, then components.
- [ ] **Step 4:** Stories mirroring the mockup's tower sheet: each type at v1/v2/v3, selected with range ring,
      Firewall v2/v3 boosting a neighbor, boosted Debugger, Antivirus firing a `Shot`, Debugger `Beam` at ramp 0.25 and
      1, valid and refused placement on a 12 × 6 board (refused one asserts the reason text is exposed).
- [ ] **Step 5: Run** `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 6: Commit and open the PR** `feat: tower components`.

### Task 6: Enemies

Branch `feat/enemies`.

**Files:**

- Create: `src/features/game/components/Enemy/` (`Enemy.tsx`, `useEnemy.ts`, `Enemy.style.ts`, `Enemy.type.ts`,
  `Enemy.stories.tsx`)
- Modify: `src/app/globals.css` (one `@keyframes glitch` and its reduced-motion fade replacement)
- Modify: `src/content/game.ts` (enemy names, "carrying a file", "armored", "health")

**Interfaces:**

- Produces: `TEnemyType = "worm" | "rootkit"`;
  `Enemy({ type, x, y, heading, health: number /* 0–1 */, small?, carrier?, hit? })`: worm = four segments head
  first; rootkit = hex shell with plates; health bar (`line` track, `fg` fill) above; rootkit adds the violet armor
  plate; `carrier` adds the dashed `data` ring and the file glyph above; `hit` plays the glitch (chromatic offset +
  slice) or, under reduced motion, a 120 ms opacity dip. Accessible name e.g. "Worm, 30% health, carrying a file".

- [ ] **Step 1:** `useEnemy.test.ts`: health `0.3` gives bar width `7.2` for a full-size enemy (24 wide) and `4.8`
      for `small` (16 wide); health is clamped to 0–1; the accessible-name builder includes "carrying a file" only when
      `carrier`.
- [ ] **Step 2: Run** `pnpm test` → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Stories mirroring the mockup's enemy sheet: Worm, split pair, hit, carrier; Rootkit, under a
      Debugger beam, carrier; health bars.
- [ ] **Step 5: Run** `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 6: Commit and open the PR** `feat: enemy components`.

### Task 7: Build menu and tower info card

Branch `feat/tower-card`.

**Files:**

- Create: `src/features/game/components/BuildItem/`, `src/features/game/components/TowerCard/` (each with `useX.ts`)
- Modify: `src/content/game.ts` (build/card labels: stats names, "Upgrade to v{n}.0", "Need {n} more bits",
  "v{n}.0 is locked. Unlock it in the Upgrade lab between levels.", "Max version reached.", "Sell", "Firewall
  boost", "Boosting {n} towers")

**Interfaces:**

- Consumes: `Button`, `Kbd`, `Icon`, `Tower` art (render `Tower` inside a 40-unit SVG for the card head).
- Produces:
  - `BuildItem({ type, cost, shortcut, state: "available" | "placing" | "poor" | "locked", missingBits?, onSelect })`.
  - `TowerCard({ type, version, stats: { label: string; value: string; next?: string }[], boost?: string,
upgrade: { state: "available" | "poor" | "locked" | "max"; cost?; missingBits?; nextVersion?; adds?: string },
sellRefund, onUpgrade, onSell })`.

- [ ] **Step 1:** `useTowerCard.test.ts`: `poor` with `missingBits: 38` yields a disabled upgrade with the text
      "Need 38 more bits"; `locked` yields no upgrade button and the lock message naming the next version; `max` yields
      the max message; `available` yields "Upgrade to v3.0" with the cost.
- [ ] **Step 2: Run** `pnpm test` → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Stories: the four build item states; card states from the mockup (upgrade available with
      Firewall boost row, not enough bits, locked in lab, max version, Firewall card). The `poor` and `locked` stories
      assert the reason is the disabled control's accessible description (Review Focus 4).
- [ ] **Step 5: Run** `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 6: Commit and open the PR** `feat: build menu items and tower info card`.

### Task 8: Match header

Branch `feat/match-header`.

**Files:**

- Create: `src/features/game/components/MatchHeader/` (`MatchHeader.tsx`, `useMatchHeader.ts`, style, type,
  stories), `src/features/game/components/FilePips/`, `src/features/game/components/NextWave/`,
  `src/features/game/components/SettingsMenu/`
- Modify: `src/content/game.ts` (header labels, settings labels, file pip state names)

**Interfaces:**

- Consumes: `Stat`, `Button`, `IconButton`, `SegmentedControl`, `Switch`, `Pill`, `Popover`, `Icon`, `Enemy` art.
- Produces:
  - `FilePips({ files: ("safe" | "carried" | "dropped" | "leaked")[] })` with a visually hidden summary
    ("5 in the core, 1 carried, 1 dropped, 1 leaked").
  - `NextWave({ phase: "break" | "running", preview: { type: TEnemyType; count: number }[], secondsLeft?,
earlyBonus?, virusesLeft?, onStartNow })`.
  - `SettingsMenu({ sound, defaultSpeed, onSoundChange, onDefaultSpeedChange, onRestart, onQuit })` in a `Popover`.
  - `MatchHeader({ level: { number; name }, wave: { current; total }, nextWave, files, bits, paused, speed, sound,
settingsOpen, handlers… })`.

- [ ] **Step 1:** `useMatchHeader.test.ts`: `secondsLeft: 12` formats "0:12"; `files` with one of each state
      produces the summary sentence above and "7 / 8" not-leaked count.
- [ ] **Step 2: Run** `pnpm test` → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Stories: build break, wave running, paused with settings open (play: open via gear, Escape closes
      and focus returns to gear), large numbers (Review Focus 3: bits 99999, wave 30/30, 12 pips; assert no horizontal
      overflow at 1312 px).
- [ ] **Step 5: Run** `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 6: Commit and open the PR** `feat: match header with settings`.

### Task 9: Match screen composition and DESIGN.md

Branch `docs/match-screen`.

**Files:**

- Create: `src/features/game/components/MatchScreen/MatchScreen.stories.tsx` (story-only composition: header, board
  with the mockup's towers, enemies, effects, build menu and selected-tower card; data in
  `MatchScreen.data.ts`)
- Create: `DESIGN.md` and `.impeccable/design.json` via the Impeccable documenter (`impeccable-documenter`
  subagent, inputs: project root, `docs/design/visual-direction.html`, product.md, Storybook docs pages)

- [ ] **Step 1:** Write the story; its play function asserts the board, the header and the card are present by
      role and name.
- [ ] **Step 2: Run** `pnpm test:stories` → PASS after composing (no new components; if a piece is missing, it
      belongs to the earlier task and is fixed there).
- [ ] **Step 3:** Generate `DESIGN.md`; check it lists every token from Global Constraints and both font families.
- [ ] **Step 4: Run** `pnpm verify && pnpm test:e2e` → PASS; screenshot the story next to the mockup's match screen
      for the PR description.
- [ ] **Step 5: Commit and open the PR** `docs: match screen story and DESIGN.md`.
