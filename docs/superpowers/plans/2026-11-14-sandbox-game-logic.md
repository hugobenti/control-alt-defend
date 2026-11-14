# Sandbox game logic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A playable sandbox at `/play` (Home PC map, all three towers upgradable to v3.0, spawn buttons for Worm and
Rootkit, files that are stolen / dropped / drift home / leak, game over + restart, pause, 1× / 2×, full keyboard play)
reached from a home page that is only the title and a Play button.

**Architecture:** A pure, deterministic, fixed-timestep simulation in `src/features/game/logic` (`createMatch`,
`applyCommand`, `step`; no React, no DOM; seeded PRNG; one `balance.data.ts` holds every number). A tiny external store
(`createMatchStore`) owns the state; `useGameLoop` drives it with `requestAnimationFrame` and an accumulator (2× = two
ticks per 1/60 s); `useSyncExternalStore` publishes once per frame; a pure `matchView.ts` turns state into the props the
already-merged presentational components take (`Tower`, `Enemy`, `Shot`, `Beam`, `FileToken`, `BoostEdge`, `RangeRing`,
`PlacementGhost`, `MatchHeader`, `BuildItem`, `TowerCard`). Pathing is an 8-connected distance field on the cell grid
(no corner cutting) plus line-of-sight waypoints, so enemies walk straight lines across open space and bend around
towers. Every new piece of UI follows `AGENTS.md`: `X.tsx` renders, `useX.ts` derives, `X.style.ts` styles,
`X.type.ts` types, copy in `src/content`.

**Tech Stack:** Next.js 16.4.6 (App Router), React 19.3, TypeScript 6, Tailwind 4.3.3, Vitest 5 (unit project jsdom +
storybook browser project), Storybook 10.6.7, Playwright + axe. No new runtime dependencies.

**Spec:** `product.md` sections 3 (fixed time step), 5, 6, 7, 8, 10, 11 and the new section "Sandbox mode (first
playable)" under section 9, which records the scope and Calls for this plan. `DESIGN.md` for look. Previous plan
`docs/superpowers/plans/2026-11-13-visual-foundations-storybook.md` for task size and PR conventions.

## Global Constraints

- One task = one branch = one pull request into `main`, ≤ ~20 files, PR template filled in, name the Vercel skill rules
  applied. Branch from the latest `main` (`git fetch && git pull --ff-only`); if the previous task's PR is not merged,
  branch from its branch and set the PR base to it. Never commit to `main`.
- `pnpm verify && pnpm test:e2e` green before asking for review (includes lint, typecheck, unit tests, knip, build into
  `.next-verify`, story tests, Storybook build, Playwright + axe on every sitemap route). Never build into `.next`.
- `AGENTS.md` architecture: presentation-only `.tsx` (no helpers, arithmetic, array methods other than `.map`, effects,
  browser APIs, module-level data, class strings); `useX.ts` for behavior and view models; pure logic in
  `src/features/game/logic/*.ts` with a `*.test.ts` next to it; `X.data.ts` for static data; every `interface`/`type`
  in a `*.type.ts` (`I` / `T` prefixes); copy only in `src/content` (`src/content/game.ts`, `src/content/home.ts`,
  `src/content/metadata.ts`, types in `src/content/content.type.ts`); token-only colors; `cx()` for classes;
  `function X()` components; no feature imports another feature (`home` and `game` share only through
  `src/features/shared`).
- knip runs in `verify`: every new module must be imported by product code or a test; delete code made obsolete (no
  aliases, no re-exports).
- Accessibility: every control is a focusable element with an accessible name from content; state never by color
  alone; `focus-visible` outline; axe (WCAG 2.2 AA tags) passes on `/` and `/play`; exactly one `h1` per route;
  `prefers-reduced-motion` already handled by `Enemy` (opacity fade). **No `preventDefault` on wheel, touch or
  keyboard events**: the play screen is a fixed-height, non-scrolling layout (`h-dvh overflow-hidden`), so arrow keys
  and Space never need to be suppressed. (`contextmenu` may be prevented: it is not scrolling.)
- Storybook: every new component gets `X.stories.tsx` next to it, one story per documented state; stories are exempt
  from presentation/copy/type lint rules but must pass the a11y check.
- Board units: `CELL = 40` SVG units; Home PC is 24 × 16 cells; `Board` viewBox is `-16 -16 992 672`. All simulation
  positions are in board units; SVG y grows downward; headings are degrees from `Math.atan2(dy, dx)` (0 = right,
  90 = down), which is what `Enemy` rotates by. Speeds are stored in cells per second and converted once.
- Simulation: `TICK_S = 1 / 60`. `step(state)` advances exactly one tick, never reads `Date`, `Math.random`, or
  anything outside its arguments, never mutates its input. The same `IMatchOptions.seed` and command sequence must yield
  a deep-equal state.
- Out of scope (do not build): Upgrade lab, keys, store, level select, campaign levels, waves, saved progress, sound
  playback, mobile/touch layouts (Hugo: the game must work on mobile later, planned separately; no "window too small"
  message in the meantime), How to play. The sound toggle in Settings is visual-only (Call: a boolean in the screen
  hook that nothing reads).

## Review Focus

1. **Sealing the maze through a diagonal.** Two towers touching only at a corner must count as a wall both for the
   route check and for walking; placing the tower that leaves a port only a corner-to-corner gap must be refused. Task 1
   pins both (`distanceField` corner test, `checkPlacement` → `"blocksRoute"` on the diagonal fixture).
2. **Enemy half inside the cell being built.** An enemy whose disc overlaps the target cell (not only its center) must
   refuse the placement; and whenever a piece appears inside a wall anyway (worm halves spawning beside a tower) it must
   be pushed out, never stuck. Task 1 pins the disc-vs-rect refusal; Task 3 pins `resolveCollision`; Task 4 pins halves.
3. **Pocket sealed around a dropped file or a live enemy.** A placement that keeps every port connected but walls off
   a dropped file or an enemy from the Core would leave an unreachable file forever. Decided (Hugo: no traps): refuse
   it (`"trapsPiece"`).
   Task 1 pins it; Task 4 pins that a carrier killed while pressed against a wall drops its file in an open cell.
4. **Frame-rate dependence at 2× and after a hidden tab.** Two 8.3 ms frames and one 16.7 ms frame must run the same
   ticks; a 5 s gap must not run 300 ticks in one frame. Task 5 pins `ticksToRun`; Task 4 pins determinism of a 600-tick
   scripted match.
5. **Keyboard focus on the board.** Space on a focused HUD button must not also toggle pause; Enter on a HUD button
   must not also place a tower; Tab must leave the board (no trap); game over must move focus to Restart and Restart
   must return it to the board; Escape while placing with Settings open closes Settings first. Task 8 pins each with a
   story play function or e2e step.

---

## File structure

```
src/features/game/logic/
  balance.data.ts, balance.type.ts     every number: towers, enemies, files, movement, sandbox
  rng.ts                               seeded PRNG (mulberry32), pure
  grid.ts, grid.type.ts                cells, blocked mask, keep-out mask, core mask, port cells, core rect
  distanceField.ts                     8-connected Dijkstra, no corner cutting, descend, pathCells
  steering.ts                          line of sight, waypoint, moveToward, resolveCollision
  placement.ts, placement.type.ts      checkPlacement, routePreview
  economy.ts                           costs, upgrade costs, refunds
  boost.ts                             Firewall boost lookup, boost edges, effective stats
  match.ts, match.type.ts              IMatchState, commands, events, createMatch, applyCommand
  enemies.ts                           spawn queue, goals, movement, steal, pickup, leak
  files.ts                             drop, drift home, rejoin
  combat.ts                            targeting, Antivirus shots (pierce), Debugger pulses (ramp, chain), deaths
  step.ts                              step(state): fixed order of sub-steps, game over
  gameLoop.ts                          ticksToRun(accumulator, frame, speed) (pure part of the rAF loop)
  matchView.ts, matchView.type.ts      state → component props
  announcements.ts                     events → live-region sentences
  geometry.ts                          + pointToCell
src/features/game/hooks/
  matchStore.ts, matchStore.type.ts    createMatchStore
  useMatchStore.ts                     useSyncExternalStore wrapper
  useGameLoop.ts                       requestAnimationFrame driver
src/features/shared/components/LiveRegion/
src/features/game/components/
  RoutePreview/, BoardCursor/, GameOverOverlay/, SandboxControls/, SandboxStatus/, SandboxScreen/
  MatchHeader/ (progress slot replaces wave props)
src/features/home/components/HomeScreen (rewritten)
src/app/play/page.tsx, src/app/sitemap.ts, src/content/*
e2e/sandbox.spec.ts
```

---

### Task 1: Grid, distance field, steering, placement rules

Branch `feat/sim-grid-pathing`.

**Files:**

- Create: `src/features/game/logic/balance.data.ts`, `balance.type.ts`
- Create: `src/features/game/logic/rng.ts` + `rng.test.ts`
- Create: `src/features/game/logic/grid.ts`, `grid.type.ts` + `grid.test.ts`
- Create: `src/features/game/logic/distanceField.ts` + `distanceField.test.ts`
- Create: `src/features/game/logic/steering.ts` + `steering.test.ts`
- Create: `src/features/game/logic/placement.ts`, `placement.type.ts` + `placement.test.ts`

**Interfaces:**

- Consumes: `CELL`, `cellCenter`, `cellOrigin` from `geometry.ts`; `ILevelMap`, `IPort` from `level/level.type.ts`;
  `homePc`.
- Produces:
  - `balance.type.ts`: `ITowerVersionStats { cost: number; damage: number; rate: number; range: number }` (`rate` =
    shots per second for Antivirus, pulses per second for Debugger, `0` for Firewall; `cost` is the price of buying that
    version: v1 = build cost, v2/v3 = upgrade cost), `IEnemyStats { health: number; speed: number; radius: number;
armor: number; reward: number }`, `IBalance` (shape below).
  - `balance.data.ts`: `export const TICK_S = 1 / 60` and `export const balance: IBalance` with exactly:

    | Tower     | v1 cost/dmg/rate/range | v2 cost/dmg/rate/range | v3 cost/dmg/rate/range | v3 extra                                 |
    | --------- | ---------------------- | ---------------------- | ---------------------- | ---------------------------------------- |
    | firewall  | 20 / 0 / 0 / 0         | 30 / 0 / 0 / 0         | 50 / 0 / 0 / 0         | boost: v2 ×1.25 dmg; v3 ×1.5 dmg, +1 rng |
    | antivirus | 60 / 10 / 2 / 3        | 90 / 16 / 2.5 / 3.25   | 150 / 22 / 3 / 3.5     | `pierceReach: 1.5` cells, same damage    |
    | debugger  | 120 / 8 / 4 / 2.5      | 180 / 12 / 4 / 2.75    | 300 / 16 / 4 / 3       | `chainReach: 2` cells, `chainFactor: .5` |

    `debugger.rampSeconds: 3`, `debugger.rampMax: 3` (pulse damage × (1 + (rampMax − 1) × min(t / rampSeconds, 1))).
    `boost: { 2: { damage: 1.25, range: 0 }, 3: { damage: 1.5, range: 1 } }`.

    | Enemy     | health | speed (cells/s) | radius | armor | reward | note                      |
    | --------- | ------ | --------------- | ------ | ----- | ------ | ------------------------- |
    | worm      | 30     | 2.4             | 10     | 0     | 8      | splits into 2 `wormSmall` |
    | wormSmall | 12     | 2.8             | 7      | 0     | 3      | never splits              |
    | rootkit   | 320    | 1.0             | 12     | 6     | 40     | armor min damage 1        |

    `files: { driftSpeed: 0.8, radius: 6, count: 8 }`, `movement: { turnRateDeg: 540, arrive: 2, lookaheadCells: 8,
offsetMax: 8, splitOffset: 10, shotTicks: 6, hitTicks: 8 }`, `economy: { sellRefund: 0.7, startBits: 1000,
grantBits: 1000 }`, `sandbox: { groupSpacingS: 0.4 }`.

  - `rng.ts`: `nextRandom(seed: number): { value: number; seed: number }` (mulberry32; `value` in [0, 1)),
    `randomRange(seed: number, min: number, max: number): { value: number; seed: number }`.
  - `grid.type.ts`: `ICell { c: number; r: number }`, `IPoint { x: number; y: number }`, `IGrid { cols: number;
rows: number; blocked: Uint8Array; keepOut: Uint8Array; core: Uint8Array }` (`blocked`: obstacles, core cells, towers;
    `keepOut`: cells that can never be built on: port cells, the cell directly inside each port, obstacle cells and
    core cells; `core`: the four core cells, blocked for walking but allowed as a path destination).
  - `grid.ts`: `buildStaticGrid(map: ILevelMap): IGrid`; `withBlocked(grid, cells: ICell[]): IGrid` (copy);
    `withoutBlocked(grid, cells): IGrid`; `cellIndex(grid, cell): number`; `inBounds(grid, cell): boolean`;
    `cellOf(p: IPoint): ICell`; `portCells(map, port: IPort): [ICell, ICell]`; `portInsideCells(map, port):
[ICell, ICell]`; `coreCells(map): ICell[]`; `coreRect(map): { x; y; w; h }`; `discOverlapsCell(p: IPoint,
radius: number, cell: ICell): boolean` (circle vs axis-aligned cell rect); `discTouchesRect(p, radius, rect): boolean`.
  - `distanceField.ts`: `computeDistanceField(grid: IGrid, sources: ICell[]): Float64Array` (cost 1 orthogonal,
    `Math.SQRT2` diagonal; a diagonal step `(c,r)→(c+1,r+1)` is allowed only when `(c+1,r)` and `(c,r+1)` are both
    enterable; a cell is enterable when not `blocked` or when it is a source; blocked non-source and unreachable cells are
    `Infinity`; sources are `0`); `descend(field, grid, cell): ICell | null` (enterable neighbor with the strictly lowest
    value, ties broken by neighbor order E, S, W, N, SE, SW, NW, NE; `null` at value `0` or when no neighbor is lower);
    `pathCells(field, grid, from: ICell, max: number): ICell[]` (successive `descend` results, up to `max`).
  - `steering.ts`: `hasLineOfSight(grid, from: IPoint, to: IPoint, radius: number, allow: Uint8Array | null):
boolean` (sample every `radius / 2` units along the segment including both ends; each sample must stay inside the board
    and must not `discOverlapsCell` any cell that is `blocked` and not set in `allow`); `nextWaypoint(grid, field, pos:
IPoint, radius, offset: IPoint, allow: Uint8Array | null): IPoint | null` (candidates are the centers of
    `pathCells(field, grid, cellOf(pos), lookaheadCells)` plus `offset`, except the last cell of the whole path (value
    `0`) which gets no offset; returns the farthest candidate with line of sight, else the first candidate without
    offset, `null` when `pathCells` is empty); `moveToward(pos, headingDeg, target, speedUnitsPerS, turnRateDeg, dtS):
{ pos: IPoint; heading: number }` (turns at most `turnRate × dt` toward the target direction then advances
    `min(speed × dt, distance)` along the new heading); `resolveCollision(grid, pos, radius): IPoint` (for each blocked
    cell the disc overlaps, push along the axis of least penetration; clamp to `[radius, size − radius]` on both axes; at
    most 4 passes).
  - `placement.type.ts`: `TPlacementRefusal = "keepOut" | "occupied" | "blocksRoute" | "trapsPiece" |
"overlapsEnemy" | "overlapsFile" | "notEnoughBits"`; `IPlacementInput { map: ILevelMap; grid: IGrid; cell: ICell;
cost: number; bits: number; enemies: { pos: IPoint; radius: number }[]; droppedFiles: IPoint[] }`.
  - `placement.ts`: `checkPlacement(input: IPlacementInput): TPlacementRefusal | null`, checked in the order of the
    union above (first failing reason wins: `grid.keepOut` → `keepOut`; `grid.blocked` → `occupied`; then with the cell
    blocked compute the field from `coreCells`: any port cell at `Infinity` → `blocksRoute`, any enemy's or dropped
    file's cell at `Infinity` → `trapsPiece`; any enemy disc overlapping the cell → `overlapsEnemy`; any dropped file disc
    (`files.radius`) overlapping → `overlapsFile`; `bits < cost` → `notEnoughBits`); `routePreview(map, grid, cell: ICell
| null): IPoint[][]` (for each port, `pathCells` from the port's first `portInsideCells` cell, max `cols × rows`, on the
    field computed with `cell` blocked (or the given grid when `null`), mapped to cell centers, prefixed with the start
    cell's center; empty for a port with no route).

- [ ] **Step 1: Write the failing tests**

  Test fixture (define it in a shared `src/features/game/logic/testMaps.ts`, imported only by tests): `tinyMap:
ILevelMap` = `{ cols: 6, rows: 6, core: { c: 4, r: 4 }, ports: [{ id: "P1", side: "left", start: 0 }], obstacles: [],
traces: [] }`.

  `rng.test.ts`: `nextRandom(42)` twice gives the same `value` and `seed`; 1000 chained draws stay in `[0, 1)`;
  `randomRange(1, -8, 8).value` is within `[-8, 8)`.

  `grid.test.ts`: `buildStaticGrid(homePc)` blocks `(4,9)`, `(6,10)`, `(11,7)`, `(12,8)`, `(10,14)` and not `(0,2)`;
  `core` holds exactly `(11,7)`, `(12,7)`, `(11,8)`, `(12,8)`; `keepOut` holds `(0,2)`, `(0,3)`, `(1,2)`, `(1,3)`,
  `(23,12)`, `(23,13)`, `(22,12)`, `(22,13)`, every obstacle cell and the four core cells, and not `(6,6)`;
  `coreRect(homePc)` is `{ x: 440, y: 280, w: 80, h: 80 }`;
  `cellOf({ x: 259, y: 40 })` is `{ c: 6, r: 1 }`; `discOverlapsCell({ x: 275, y: 260 }, 10, { c: 7, r: 6 })` is
  `true` (center in cell 6, disc crosses into 7) and `false` with radius 4; `withBlocked` does not mutate its input.

  `distanceField.test.ts` on `buildStaticGrid(tinyMap)` with `withoutBlocked` of the core cells so the grid is empty
  (or a second fixture without a core; implementer's choice): source `(0,0)`: `field[(1,1)] === Math.SQRT2`,
  `field[(5,0)] === 5`; `pathCells` from `(5,5)` has 5 cells ending at `(0,0)`; **corner wall**: block `(2,2)` and
  `(3,3)`: `field[(2,3)]` is `3 + Math.SQRT2` (the detour, not `1 + 2 × Math.SQRT2`), `descend` from `(3,2)` is
  `(3,1)`; a cell ringed by blocked cells is `Infinity`; `descend` at a source is `null`; with the real core cells
  blocked and used as sources, `descend` from `(3,4)` returns `(4,4)` (enterable because it is a source).

  `steering.test.ts` (empty 6 × 6 grid unless stated): `hasLineOfSight` across an empty row is `true`; across a
  blocked cell is `false`; passing 8 units from a blocked cell's edge is `false` with radius 10 and `true` with radius 4;
  `hasLineOfSight` to a core cell center with `allow = grid.core` is `true` and `false` with `allow = null`;
  `nextWaypoint` from `(20,20)` toward source `(5,5)` returns the 5th cell center (`pathCells` has 5) plus offset
  `(0,0)` → `(220,220)`; with `(3,3)` blocked it returns a cell center with line of sight and not `(220,220)`;
  `moveToward` with `turnRate 540`, `dt 1/60` from heading `0` toward a target straight down gives heading `9`; moving
  toward a target 1 unit away at speed 96 units/s lands exactly on it; `resolveCollision` moves a disc (radius 10)
  centered 5 units inside the left edge of a blocked cell to 10 units left of that edge and leaves a free disc untouched;
  it clamps a disc at `(2, 100)` to `x = 10`.

  `placement.test.ts` (`bits: 1000`, `cost: 20`, no enemies or files unless stated):
  - Home PC: `(11,7)` → `"keepOut"`; `(1,2)` → `"keepOut"`; `(23,12)` → `"keepOut"`; `(4,9)` → `"keepOut"`; a cell
    blocked with `withBlocked` (a tower) → `"occupied"`; `(6,6)` → `null`;
    `bits: 10` → `"notEnoughBits"`; enemy `{ pos: { x: 275, y: 260 }, radius: 10 }` placing `(7,6)` →
    `"overlapsEnemy"`; dropped file at `(300, 260)` placing `(7,6)` → `"overlapsFile"`.
  - `tinyMap`, towers at `(2,0)`, `(2,1)`, `(2,2)`, `(3,4)`, `(3,5)` already blocked: placing `(3,3)` →
    `"blocksRoute"` (the only remaining gap is the corner between `(2,3)` and `(3,2)`); placing `(2,3)` instead →
    `"blocksRoute"`; placing `(4,2)` → `null`.
  - `tinyMap` pocket: towers at `(1,3)`, `(3,3)`, `(1,4)`, `(3,4)`, `(1,5)`, `(2,5)`, `(3,5)` enclose `(2,4)` with the
    only opening at `(2,3)`. Dropped file at `(cellCenter(2), cellCenter(4))`: placing `(2,3)` → `"trapsPiece"`; the
    same with an enemy `{ pos: that point, radius: 10 }` instead → `"trapsPiece"`; with neither → `null` (the port stays
    connected to the core through rows 0–2).
  - `routePreview(homePc, grid, null)` returns two polylines, first points `(60,100)` and `(900,500)`, last points
    inside `coreRect`; with `(5,2)` blocked the J1 polyline contains no point `(220,100)`; `routePreview` with the
    sealing cell from the `tinyMap` case returns `[[]]`.

- [ ] **Step 2: Run** `pnpm test` → FAIL (modules missing).

- [ ] **Step 3: Implement** `balance.data.ts`, `rng.ts`, `grid.ts`, `distanceField.ts` (a binary heap or sorted
      insertion over 384 cells; deterministic), `steering.ts`, `placement.ts`, `testMaps.ts` with the signatures above.

- [ ] **Step 4: Run** `pnpm test` → PASS. **Run** `pnpm verify && pnpm test:e2e` → PASS (knip: every export used by
      product code or a test; `testMaps.ts` is test-only, which knip accepts because tests import it).

- [ ] **Step 5: Commit and open the PR** `feat: grid pathing and placement rules`.

### Task 2: Match state, commands, economy and boost

Branch `feat/sim-match-commands`.

**Files:**

- Create: `src/features/game/logic/match.type.ts`, `match.ts` + `match.test.ts`
- Create: `src/features/game/logic/economy.ts` + `economy.test.ts`
- Create: `src/features/game/logic/boost.ts` + `boost.test.ts`

**Interfaces:**

- Consumes: Task 1 (`IGrid`, `buildStaticGrid`, `withBlocked`, `withoutBlocked`, `computeDistanceField`,
  `coreCells`, `portCells`, `cellOf`, `checkPlacement`, `balance`, `TICK_S`, `nextRandom`); `TTowerType`, `TVersion`
  from `Tower.type.ts`; `TEnemyType` from `Enemy.type.ts`; `IBoostEdgeProps`.
- Produces (`match.type.ts`):

  ```ts
  interface ITowerState {
    id: number;
    type: TTowerType;
    version: TVersion;
    c: number;
    r: number;
    spent: number;
    cooldownTicks: number;
    beamTargetId: number | null;
    beamTicks: number;
    kills: number;
    aimAt: IPoint | null;
  }
  type TEnemyGoal = "core" | "file" | "exit";
  interface IEnemyState {
    id: number;
    type: TEnemyType;
    small: boolean;
    pos: IPoint;
    heading: number;
    health: number;
    maxHealth: number;
    carrying: number | null;
    offset: IPoint;
    hitUntilTick: number;
    touchedEmptyCore: boolean;
    goal: TEnemyGoal;
  }
  type TFileStatus = "core" | "carried" | "dropped" | "leaked";
  interface IFileState {
    id: number;
    status: TFileStatus;
    pos: IPoint | null;
    carrierId: number | null;
    heading: number;
  }
  interface IShotState {
    from: IPoint;
    to: IPoint;
    untilTick: number;
  }
  interface IBeamState {
    towerId: number;
    from: IPoint;
    to: IPoint;
    ramp: number;
    chainTo: IPoint | null;
  }
  interface IPendingSpawn {
    type: TEnemyType;
    portId: string;
    atTick: number;
  }
  interface IFields {
    toCore: Float64Array;
    toExit: Float64Array;
    toFile: Record<number, Float64Array>;
  }
  type TMatchStatus = "playing" | "over";
  interface IMatchOptions {
    map: ILevelMap;
    seed: number;
    startBits: number;
    files: number;
  }
  interface IMatchState {
    options: IMatchOptions;
    tick: number;
    grid: IGrid;
    fields: IFields;
    towers: ITowerState[];
    enemies: IEnemyState[];
    files: IFileState[];
    shots: IShotState[];
    beams: IBeamState[];
    pendingSpawns: IPendingSpawn[];
    bits: number;
    status: TMatchStatus;
    seed: number;
    nextId: number;
    events: TMatchEvent[];
  }
  type TMatchCommand =
    | { kind: "place"; type: TTowerType; cell: ICell }
    | { kind: "upgrade"; towerId: number }
    | { kind: "sell"; towerId: number }
    | { kind: "spawn"; type: TEnemyType; portId: string; count: number }
    | { kind: "grantBits" }
    | { kind: "restart" };
  type TMatchEvent =
    | { kind: "refused"; reason: TPlacementRefusal | "maxVersion" }
    | { kind: "placed"; towerId: number }
    | { kind: "sold"; refund: number }
    | { kind: "upgraded"; towerId: number }
    | { kind: "stolen"; filesInCore: number }
    | { kind: "dropped" }
    | { kind: "recovered"; filesInCore: number }
    | { kind: "leaked"; leaked: number; total: number }
    | { kind: "killed"; type: TEnemyType; reward: number }
    | { kind: "gameOver" };
  ```

- Produces (`match.ts`): `createMatch(options: IMatchOptions): IMatchState` (files `id 0..n-1` all `"core"`, `pos:
null`; `seed = options.seed`; `fields` computed; `events: []`); `applyCommand(state, command): IMatchState` (pure;
  appends to `events`); `recomputeFields(state): IMatchState` (`toCore` from `coreCells`, `toExit` from every port's
  `portCells`, `toFile[id]` for every `"dropped"` file from `cellOf(file.pos)`). Place: `checkPlacement` with
  `cost = balance.towers[type][1].cost`; on success `withBlocked`, append the tower (`spent = cost`, `cooldownTicks 0`,
  `beamTargetId null`, `beamTicks 0`, `kills 0`, `aimAt null`), deduct bits, `recomputeFields`, event `placed`; on
  refusal only the event. Upgrade: `maxVersion` at v3, `notEnoughBits`; otherwise `version + 1`, `spent += cost`,
  `bits −= cost`, event `upgraded`. Sell: `refund = sellRefund(spent)`, remove, `withoutBlocked`, `recomputeFields`,
  event `sold`. Spawn: append `count` pending spawns at `tick + i × Math.round(groupSpacingS / TICK_S)`. GrantBits:
  `+ grantBits`. Restart: `createMatch(state.options)`.
- Produces (`economy.ts`): `buildCost(type): number`, `upgradeCost(type, from: TVersion): number | null` (`null` at
  v3), `sellRefund(spent): number` = `Math.floor(spent × balance.economy.sellRefund)`.
- Produces (`boost.ts`): `boostFor(towers: ITowerState[], tower: ITowerState): { version: 2 | 3; from: ICell } |
null` (strongest Firewall v2/v3 among the four orthogonal neighbors; Firewalls themselves get `null`; ties → first in
  E, S, W, N order); `effectiveStats(towers, tower): ITowerVersionStats` (damage × factor, range + bonus; Firewalls
  unchanged); `boostEdges(towers): IBoostEdgeProps[]` (one per v2+ Firewall × orthogonal attacking neighbor, every pair,
  in tower order).

- [ ] **Step 1: Write the failing tests**

  `economy.test.ts`: `buildCost("antivirus") === 60`; `upgradeCost("antivirus", 1) === 90`,
  `upgradeCost("debugger", 2) === 300`, `upgradeCost("firewall", 3) === null`; `sellRefund(150) === 105`,
  `sellRefund(21) === 14`.

  `boost.test.ts`: Antivirus at `(5,5)` with Firewall v2 at `(6,5)` → `boostFor` `{ version: 2, from: { c: 6, r: 5 }
}`, `effectiveStats` damage `12.5`, range `3`; with Firewall v3 at `(5,4)` too → version 3, damage `15`, range `4`;
  Firewall v1 neighbor → `null`; diagonal v3 → `null`; Firewall next to Firewall → `null`; `boostEdges` for v3 at
  `(5,6)` between Debugger `(4,6)` and Antivirus `(6,6)` returns exactly two edges, none for a diagonal neighbor, none
  for a v1 Firewall.

  `match.test.ts` (`createMatch({ map: homePc, seed: 1, startBits: 1000, files: 8 })`): place Antivirus at `(6,6)` →
  `bits === 940`, one tower with `spent 60`, `grid.blocked` set at `(6,6)`, event `placed`, `fields.toCore` is a new
  array with `Infinity` at `(6,6)`; place on `(6,6)` again → towers unchanged and event `refused "occupied"`; place with
  `bits 10` → `refused "notEnoughBits"`; upgrade twice → `version 3`, `spent 300`, `bits 700`; third upgrade → `refused
"maxVersion"`; sell → `bits 910`, no towers, cell open, event `sold 210`; spawn worm ×5 at `J1` → 5 `pendingSpawns` at
  ticks `0, 24, 48, 72, 96`; `grantBits` → `bits + 1000`; `restart` after all of the above deep-equals
  `createMatch(options)`; `applyCommand` leaves its input deep-equal to a `structuredClone` taken before the call;
  `fields.toCore` at `(1,2)` is finite and at `(11,7)` is `0`; `fields.toExit` at `(0,2)` and `(23,13)` is `0`.

- [ ] **Step 2: Run** `pnpm test` → FAIL.
- [ ] **Step 3: Implement** `match.ts`, `economy.ts`, `boost.ts`. Structural sharing: arrays that did not change keep
      their reference (`towers` changes only on place / upgrade / sell).
- [ ] **Step 4: Run** `pnpm test` → PASS; `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 5: Commit and open the PR** `feat: match state, commands, economy and boost`.

### Task 3: Enemies and files: spawn, walk, steal, carry, drop, drift, leak

Branch `feat/sim-enemies-files`.

**Files:**

- Create: `src/features/game/logic/enemies.ts` + `enemies.test.ts`
- Create: `src/features/game/logic/files.ts` + `files.test.ts`
- Create: `src/features/game/logic/step.ts` + `step.test.ts`

**Interfaces:**

- Consumes: Tasks 1–2; `TFileState` from `matchHud.type.ts`.
- Produces:
  - `enemies.ts`: `enemyStats(enemy): IEnemyStats` (`wormSmall` when `small`); `spawnDue(state): IMatchState` (each
    pending spawn with `atTick <= tick` becomes an enemy at the center of one of the port's two `portCells` chosen with
    `nextRandom` (`value < 0.5` → first), heading toward the board interior (left port → `0`, right → `180`, top → `90`,
    bottom → `-90`), `offset` from two `randomRange(−offsetMax, offsetMax)` draws, `goal "core"`, `health = maxHealth`;
    `seed` advanced; `nextId` advanced); `enemyGoal(state, enemy): TEnemyGoal` (carrier → `"exit"`; `filesInCore > 0`
    → `"core"`; any dropped file → `"file"`; `touchedEmptyCore` → `"exit"`; else `"core"`); `goalField(state, enemy):
Float64Array` (`toCore`, `toExit`, or the `toFile` field with the lowest value at the enemy's cell, ties → lowest file
    id); `stepEnemies(state): IMatchState`: for each enemy in id order: `goal` → `nextWaypoint(grid, field, pos, radius,
offset, goal === "core" ? grid.core : null)` → `moveToward` at `speed × CELL` → `resolveCollision`; then arrivals: a
    non-carrier whose disc `discTouchesRect` the core rect steals the lowest-id `"core"` file (file `"carried"`,
    `carrierId`; event `stolen`) or, if none, sets `touchedEmptyCore`; a non-carrier within `radius + files.radius` of a
    dropped file picks it up (lowest id first; file `"carried"`); a carrier within `movement.arrive` of a port cell center
    → file `"leaked"`, `pos null`, enemy removed, event `leaked { leaked, total }`; a non-carrier with goal `"exit"`
    within `arrive` of a port cell center → removed, no event.
  - `files.ts`: `dropFile(state, enemy): IMatchState` (file at `enemy.pos`, `"dropped"`, `carrierId null`, `heading`
    = enemy heading, `recomputeFields`, event `dropped`); `stepFiles(state): IMatchState` (each dropped file:
    `nextWaypoint` on `toCore`, radius `files.radius`, offset `(0,0)`, `allow grid.core`; `moveToward` at `driftSpeed ×
CELL`; `discTouchesRect` core → `"core"`, `pos null`, `toFile[id]` removed, event `recovered`); `filesInCore(state):
number`; `fileStates(state): TFileState[]` (`core → "safe"`, `carried`, `dropped`, `leaked`, in id order).
  - `step.ts`: `step(state: IMatchState): IMatchState`: `events = []` → `spawnDue` → `stepCombat` (Task 4; until then
    this call does not exist) → `stepEnemies` → `stepFiles` → drop shots with `untilTick <= tick` → `tick + 1` → if
    every file is `"leaked"` and `status === "playing"`: `status "over"`, event `gameOver`. `step` of an `"over"` state
    returns a copy with `events: []` and nothing else changed. `runTicks(state, n): IMatchState`.

- [ ] **Step 1: Write the failing tests**

  Helper in the tests: `spawnOne(state, type, portId)` = `applyCommand` spawn count 1 then `spawnDue`; `base =
createMatch({ map: homePc, seed: 7, startBits: 1000, files: 8 })`.

  `enemies.test.ts`: a worm spawned at `J1` sits at `x === 20` and `y` in `{100, 140}` with heading `0`; over
  `runTicks(60)` the sum of per-tick displacements is `96 ± 1` and consecutive headings differ by `≤ 9°`; within
  `60 × 15` ticks it has `carrying !== null`, `filesInCore === 7`, that tick's events include `stolen`, and its goal is
  `"exit"`; a carrier placed by hand at `(880, 500)` reaches `J2` (`pos.x` increases over 60 ticks) and leaks: file
  `"leaked"`, enemy gone, event `{ kind: "leaked", leaked: 1, total: 8 }`; **recalculation on maze change**: with a
  worm at `(100, 100)` heading to the core, place Firewalls at `(4,2)`, `(4,3)`, `(4,4)`, `(4,1)` (not overlapping it)
  → within 300 ticks it is still never overlapping a blocked cell (`discOverlapsCell` false for every blocked cell every
  tick) and its `pos.x` eventually exceeds `200` (it went around); **collision**: an enemy hand-placed 5 units inside a
  tower cell is outside it after one tick; core empty (all files `"leaked"` except one `"dropped"` at `(300, 260)` with
  `recomputeFields`) → a worm's goal is `"file"` and it ends up `carrying` it; core empty and nothing dropped → goal
  `"core"` until it touches the core, then `"exit"`, then removed with no `leaked` event; two enemies on the same
  route end at the same positions as when simulated alone (no pushing).

  `files.test.ts`: `dropFile` puts the file at the enemy position with `"dropped"` and adds `toFile[id]`; over 60
  ticks a dropped file moves `32 ± 1` units along its route; a file dropped at `(300, 260)` reaches the core (`"core"`,
  event `recovered`, `toFile[id]` gone) within `60 × 20` ticks; a file dropped at `(100, 300)` with Firewalls at
  `(7,5)…(7,9)` between it and the core never overlaps a blocked cell and still arrives; `fileStates` maps the four
  statuses in id order.

  `step.test.ts`: `step` clears the previous tick's events; the tick the 8th file leaks (7 set `"leaked"`, one carrier
  hand-placed 10 units from `J2`'s cell center) yields `status "over"` and event `gameOver`; `step` on an `"over"`
  state changes only `events`; `runTicks(state, 0)` returns the same object.

- [ ] **Step 2: Run** `pnpm test` → FAIL.
- [ ] **Step 3: Implement** `enemies.ts`, `files.ts`, `step.ts`.
- [ ] **Step 4: Run** `pnpm test` → PASS; `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 5: Commit and open the PR** `feat: enemy movement, stealing, dropping and leaking`.

### Task 4: Combat

Branch `feat/sim-combat`.

**Files:**

- Create: `src/features/game/logic/combat.ts` + `combat.test.ts`
- Modify: `src/features/game/logic/step.ts` (call `stepCombat` after `spawnDue`), `step.test.ts` (determinism)

**Interfaces:**

- Consumes: Tasks 1–3, `effectiveStats`, `dropFile`, `enemyStats`.
- Produces (`combat.ts`): `remainingPath(state, enemy): number` (`toExit` value at the enemy's cell for carriers,
  `toCore` otherwise); `pickTarget(state, tower, rangeCells: number): IEnemyState | null` (enemies with center
  distance `≤ range × CELL`; carriers first; then lowest `remainingPath`; then lowest id); `applyHit(enemy, damage,
tick): IEnemyState` (`health −= max(1, damage − armor)`; `hitUntilTick = tick + hitTicks`); `stepCombat(state):
IMatchState`:
  - Antivirus: `cooldownTicks` counts down to 0; at 0 with a target: hit it, push `IShotState { from: tower center,
to: target.pos, untilTick: tick + shotTicks }`, `aimAt = target.pos`, `cooldownTicks = round(60 / rate)`. v3: also
    hit the first other enemy (lowest id) whose center is within `pierceReach × CELL` beyond the target along the
    tower→target direction and within its own radius of that line.
  - Debugger: if `beamTargetId` is alive and in range keep it and `beamTicks + 1`, else `pickTarget` and `beamTicks =
0` (no target → `beamTargetId null`); a pulse fires when `beamTicks % round(60 / rate) === 0` (so at beam ticks 0,
    15, 30, …) with damage `d × (1 + (rampMax − 1) × min(beamTicks × TICK_S / rampSeconds, 1))`; push `IBeamState` with
    `ramp = min(beamTicks × TICK_S / rampSeconds, 1)`, `aimAt = target.pos`. v3: the nearest other enemy within
    `chainReach × CELL` of the target takes `chainFactor ×` the pulse; `chainTo = its pos`.
  - Deaths (health `≤ 0`, resolved after every tower acted, in enemy id order): `bits += reward`, event `killed`, the
    last tower that hit it gets `kills + 1`; a carrier → `dropFile`; a full-size worm → two `wormSmall` at
    `pos ± splitOffset` perpendicular to its heading, each `resolveCollision`ed, same heading, fresh offsets from the
    PRNG, `carrying null`, `goal "core"`, new ids; the dead enemy is removed; towers whose `beamTargetId` died reset
    `beamTicks 0`, `beamTargetId null`.
  - `beams` is rebuilt every tick (derived); `shots` accumulate until `untilTick`.

- [ ] **Step 1: Write the failing tests**

  `combat.test.ts` (states built with `createMatch` + direct assignment of `enemies`/`towers` and `recomputeFields`;
  to keep enemies parked, loop `stepCombat` and increment `tick` by hand instead of calling `step`):
  `pickTarget` prefers a carrier with `remainingPath 30` over a non-carrier with `remainingPath 1`; among non-carriers
  the lower `toCore` wins; an enemy at `range × 40 + 1` units → `null`; `applyHit` on a rootkit with damage `10` removes
  `4`, with damage `3` removes `1`; Antivirus v1 at `(6,6)` and a worm (health 30) parked at `(300, 260)` → dead after
  `≤ 61` ticks, then two `small` worms at `±10` perpendicular to its heading, `bits + 8`, event `killed`, tower `kills
=== 1`; small worms die without splitting; **pierce**: v3 with two worms in line one cell apart → both lose `22` on the
  first shot; a worm `30` units off the line is untouched; **Debugger ramp**: v1 pulses at beam ticks `0, 15, 30`; the
  pulse at beam tick `180` is `24`; killing the target resets the next `ramp` to `0`; **chain**: v3 with a second enemy
  one cell from the target → it loses `8` on the first pulse; **carrier death** drops the file at the death position,
  and for a carrier parked against a Firewall wall (`pos` 10 units from the tower edge) `grid.blocked[cellIndex(
cellOf(file.pos))] === 0` and both halves do not overlap the wall; **boost**: Antivirus v1 next to Firewall v3 hits for
  `15` and hits an enemy `3.9 × 40` units away; `shots` are gone after `shotTicks` ticks.

  `step.test.ts` add: **determinism** — two matches with `seed: 3`, the same script (place Antivirus `(6,6)`,
  Debugger `(7,4)`, Firewall `(6,5)` upgraded twice, spawn 5 worms `J1`, 2 rootkits `J2`) and `runTicks(600)` →
  `JSON.stringify` of both (with `Float64Array` fields spread to arrays) identical; `runTicks(300)` twice equals
  `runTicks(600)`.

- [ ] **Step 2: Run** `pnpm test` → FAIL.
- [ ] **Step 3: Implement** `combat.ts`; wire `stepCombat` into `step.ts`.
- [ ] **Step 4: Run** `pnpm test` → PASS; `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 5: Commit and open the PR** `feat: combat, targeting, worm split and armor`.

### Task 5: Store, game loop, view models and live region

Branch `feat/game-loop-store`.

**Files:**

- Create: `src/features/game/hooks/matchStore.ts`, `matchStore.type.ts` + `matchStore.test.ts`
- Create: `src/features/game/hooks/useMatchStore.ts`
- Create: `src/features/game/hooks/useGameLoop.ts` + `useGameLoop.test.ts`
- Create: `src/features/game/logic/gameLoop.ts` + `gameLoop.test.ts`
- Create: `src/features/game/logic/matchView.ts`, `matchView.type.ts` + `matchView.test.ts`
- Create: `src/features/shared/components/LiveRegion/` (`LiveRegion.tsx`, `useLiveRegion.ts` + `useLiveRegion.test.ts`,
  `LiveRegion.style.ts`, `LiveRegion.type.ts`, `LiveRegion.stories.tsx`)
- Modify: `src/features/game/logic/geometry.ts` + `geometry.test.ts` (`pointToCell`)
- Modify: `src/content/game.ts`, `src/content/content.type.ts`

**Interfaces:**

- Consumes: Tasks 1–4; prop types `ITowerProps`, `IEnemyProps`, `IShotProps`, `IBeamProps`, `IBoostEdgeProps`,
  `IRangeRingProps`, `IPlacementGhostProps`, `IBuildItemProps`, `ITowerCardProps`, `TFileState`.
- Produces:
  - `gameLoop.ts`: `MAX_FRAME_S = 0.1`; `ticksToRun(accumulatorS: number, frameS: number, speed: 1 | 2): { ticks:
number; rest: number }` (`acc = accumulator + min(frameS, MAX_FRAME_S) × speed`; `ticks = floor(acc / TICK_S)`; `rest =
acc − ticks × TICK_S`).
  - `matchStore.type.ts`: `IMatchStore { getState(): IMatchState; subscribe(listener: () => void): () => void;
dispatch(command: TMatchCommand): void; advance(ticks: number): void }`.
  - `matchStore.ts`: `createMatchStore(initial: IMatchState): IMatchStore` (`advance` runs `step` `ticks` times and
    notifies once; `advance(0)` does not notify; `dispatch` notifies once).
  - `useMatchStore.ts`: `useMatchStore(store: IMatchStore): IMatchState` via `useSyncExternalStore(store.subscribe,
store.getState, store.getState)`.
  - `useGameLoop.ts`: `useGameLoop(store: IMatchStore, running: boolean, speed: 1 | 2): void` (rAF loop while
    `running`; accumulator and last timestamp in refs; on `document` `visibilitychange` back to visible, reset the last
    timestamp so the hidden gap is not simulated; cancels on unmount or when `running` turns false).
  - `geometry.ts`: `pointToCell(clientX: number, clientY: number, rect: { left; top; width; height }, map: ILevelMap):
ICell | null` (maps through the `-16 -16 (W+32) (H+32)` viewBox; `null` outside the grid).
  - `matchView.type.ts`: `IBoardUi { cursor: ICell; placing: TTowerType | null; selectedTowerId: number | null }`;
    `IBoardView { towers: ITowerProps[]; enemies: (IEnemyProps & { id: number })[]; shots: IShotProps[]; beams:
IBeamProps[]; boostEdges: IBoostEdgeProps[]; droppedFiles: { id: number; x: number; y: number }[]; rangeRing:
IRangeRingProps | null; ghost: IPlacementGhostProps | null; routePreview: IPoint[][]; files: number; filesInCore:
number }`.
  - `matchView.ts`: `buildBoardView(state, ui): IBoardView` (`hit = tick < hitUntilTick`, `health = health /
maxHealth`, `boosted = boostFor(...) !== null`, `selected = id === selectedTowerId`; `rangeRing` for the selected
    attacking tower, or for the ghost while placing an attacking tower, with `effectiveStats` range (the ghost's range
    uses v1 stats + boost it would receive); `ghost` while placing: `valid = checkPlacement(...) === null`, `reason =
game.placement.reasons[refusal]`; `routePreview(map, grid, valid ? cursor : null)` only while placing; empty otherwise);
    `buildBuildItems(state, placing): IBuildItemProps[]` (shortcuts `"1" "2" "3"`, `state` `placing | poor |
available`, `missingBits`); `buildTowerCard(state, towerId): Omit<ITowerCardProps, "onUpgrade" | "onSell"> | null`
    (rows: Damage, Fire rate (`"2 /s"`) or Pulse (`"8 × 4 /s"`), Range (`"3.0"`), each with `next` when upgradable;
    Firewall boost row with `tone "boost"` when boosted; Targets "Carriers first"; Kills; a Firewall card shows Boost
    (`"—"`, `"+25% damage"`, `"+50% damage, +1 range"`) and Boosting `n towers`; `upgrade.state` `available | poor |
max` with `cost`, `missingBits`, `nextVersion`, `adds` from content; `sellRefund`).
  - `LiveRegion({ message: string; slot: 0 | 1 })`: two visually hidden `div role="status" aria-live="polite"
aria-atomic="true"`; the active `slot` holds `message`, the other is empty, so identical consecutive messages
    re-announce. `useLiveRegion(): { message: string; slot: 0 | 1; announce(text: string): void }` (`announce` flips
    the slot).
  - Content: `game.placement.reasons: Record<TPlacementRefusal, string>` = keepOut "Can't build on ports, parts or the
    Core", occupied "Already built here", blocksRoute "Would block a port's route to the Core", trapsPiece "Would trap a
    file or a virus", overlapsEnemy "A virus is in the way", overlapsFile "A dropped file is in the way", notEnoughBits
    "Not enough bits"; `game.card.stats { damage, fireRate, pulse, range, targets, kills, boostNone, boostV2, boostV3
}`, `game.card.targetsValue: "Carriers first"`, `game.card.adds: Record<TTowerType, string>` (firewall: "boosts
    neighbours' damage and range.", antivirus: "adds piercing: each shot also hits the virus behind.", debugger: "the
    beam chains to one nearby virus at half damage."), `game.card.perSecond(n)`, `game.card.pulseValue(d, n)`.

- [ ] **Step 1: Write the failing tests**

  `gameLoop.test.ts`: `ticksToRun(0, 1/60, 1)` → `ticks 1`, `rest ≈ 0`; speed 2 → `ticks 2`; feeding 120 frames of
  `1/120` s and 60 frames of `1/60` s through the accumulator both total `60` ticks at 1× and `120` at 2×; `frameS 5` →
  `ticks ≤ 6` (Review Focus 4).

  `matchStore.test.ts`: `advance(3)` notifies once and `getState().tick === 3`; `dispatch` notifies once;
  unsubscribed listeners are not called; `advance(0)` does not notify.

  `useGameLoop.test.ts` (`vi.stubGlobal("requestAnimationFrame", …)` with a manual queue, `renderHook`): `running
true`, speed 2, two frames 16.67 ms apart → `tick === 2`; `running false` → `tick === 0`; unmount cancels the pending
  frame.

  `geometry.test.ts` add: `pointToCell(496, 336, { left: 0, top: 0, width: 992, height: 672 }, homePc)` is `{ c: 12,
r: 8 }`; `pointToCell(4, 4, …)` is `null`.

  `matchView.test.ts`: a worm at `(100, 140)`, `health 15 / 30`, `hitUntilTick > tick` → enemy view `{ x: 100, y:
140, health: 0.5, hit: true, small: false, carrier: false }`; a selected Antivirus v1 next to a Firewall v3 →
  `rangeRing.range === 4`, `towers[i].boosted === true`, `selected === true`; placing Firewall at `(11,7)` →
  `ghost.valid === false`, `reason === "Can't build on ports, parts or the Core"`, `routePreview` empty; placing at
  `(6,6)` → `ghost.valid`,
  two polylines; `buildBuildItems` with `bits 50` → Antivirus `poor`, `missingBits 10`, and Firewall `placing` when
  placing Firewall; `buildTowerCard` for a v3 tower → `upgrade.state "max"`; for a v1 Antivirus → `upgrade { state:
"available", cost: 90, nextVersion: 2 }`, `sellRefund 42`, rows include `{ label: "Damage", value: "10", next: "16" }`.

  `useLiveRegion.test.ts`: `announce("a")` then `announce("a")` → slot `0` then `1`, message `"a"` both times.
  `LiveRegion.stories.tsx` play: after clicking an "Announce" button in the story, one `status` element contains the
  text.

- [ ] **Step 2: Run** `pnpm test && pnpm test:stories` → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 5: Commit and open the PR** `feat: match store, game loop, view models and live region`.

### Task 6: Route preview, board cursor and game-over overlay

Branch `feat/board-input-components`.

**Files:**

- Create: `src/features/game/components/RoutePreview/` (`RoutePreview.tsx`, `useRoutePreview.ts`, `.style.ts`,
  `.type.ts`, `.stories.tsx`)
- Create: `src/features/game/components/BoardCursor/` (`BoardCursor.tsx`, `useBoardCursor.ts`, `.style.ts`, `.type.ts`,
  `.stories.tsx`)
- Create: `src/features/game/components/GameOverOverlay/` (`GameOverOverlay.tsx`, `useGameOverOverlay.ts`, `.style.ts`,
  `.type.ts`, `.stories.tsx`)
- Modify: `src/content/game.ts`, `src/content/content.type.ts`

**Interfaces:**

- Consumes: `cellCenter`, `cellOrigin`, `Button`.
- Produces:
  - `RoutePreview({ routes: IPoint[][] })`: one `polyline` per route, dashed, `stroke-fg/50`, `aria-hidden`
    (`useRoutePreview` builds the `points` strings; renders nothing for empty routes).
  - `BoardCursor({ c, r })`: square outline on the cell (`stroke-accent`, 2 units, 6-unit corner ticks), `role="img"`,
    label `game.cursor(c, r)` = "Cell 7, 6".
  - `GameOverOverlay({ open: boolean; files: number; onRestart: () => void })`: when `open`, a full-screen `div
role="dialog" aria-modal="true" aria-labelledby={titleId}` with heading `game.gameOver.title` "Game over", text
    `game.gameOver.text(files)` "All 8 files leaked.", one primary `Button` "Restart"; `useGameOverOverlay({ open })`
    returns `{ buttonRef, titleId }` and focuses the button when `open` becomes true. Renders `null` when closed.
    Escape does nothing (not a `Popover`).

- [ ] **Step 1: Write the failing stories**

  `RoutePreview`: two routes on the Home PC board (play: two `polyline` elements). `BoardCursor`: at `(7,6)` (play:
  `img` named "Cell 7, 6"). `GameOverOverlay`: open (play: `document.activeElement` is the "Restart" button; pressing
  Escape keeps the dialog and does not call `onRestart`; clicking Restart calls it once) and closed (no `dialog`).

- [ ] **Step 2: Run** `pnpm test:stories` → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 5: Commit and open the PR** `feat: route preview, board cursor and game-over overlay`.

### Task 7: Sandbox HUD components and header progress slot

Branch `feat/sandbox-hud-components`.

**Files:**

- Modify: `src/features/game/components/MatchHeader/MatchHeader.tsx`, `MatchHeader.type.ts`, `useMatchHeader.ts`,
  `useMatchHeader.test.ts`, `MatchHeader.stories.tsx`; `src/features/game/components/MatchScreen/MatchScreen.stories.tsx`,
  `MatchScreen.data.ts`
- Create: `src/features/game/components/SandboxStatus/` (`.tsx`, `useSandboxStatus.ts`, `.style.ts`, `.type.ts`,
  `.stories.tsx`)
- Create: `src/features/game/components/SandboxControls/` (`.tsx`, `useSandboxControls.ts`, `.style.ts`, `.type.ts`,
  `.stories.tsx`)
- Modify: `src/content/game.ts`, `src/content/content.type.ts`

**Interfaces:**

- Consumes: `Button`, `SegmentedControl`, `Pill`, `Stat`, `NextWave` (stories only).
- Produces:
  - `MatchHeader`: **Call: a slot, not a mode flag** (`vercel-composition-patterns`: avoid boolean props). Replace
    `wave`, `nextWave` and `onStartNow` with `progress: ReactNode`, rendered where the wave `Stat` + `NextWave` were.
    `useMatchHeader` drops `waveLabel`, `waveValue`, `waveTotal`. `MatchHeader.stories.tsx` and `MatchScreen` pass
    `<><Stat label… /><NextWave … /></>` as `progress`; one header story passes `<SandboxStatus enemiesOnBoard={3} />`.
  - `SandboxStatus({ enemiesOnBoard: number })`: `Pill` "Sandbox" + `Stat` label "Viruses" value `n`.
  - `SandboxControls({ port: string; ports: { value: string; text: string }[]; count: TSpawnCount; onPortChange(port);
onCountChange(count); onSpawn(type: TEnemyType); onGrantBits() })` with `TSpawnCount = "1" | "5"`: a `section`
    labelled "Sandbox" (visible heading, same style as Build / Selected); `SegmentedControl` "Spawn at"; `SegmentedControl`
    "Count"; `Button` ghost "Spawn Worm" (shortcut `W`); `Button` ghost "Spawn Rootkit" (shortcut `R`); `Button` ghost
    "+1000 bits" (shortcut `B`).
  - Content: `game.sandbox { title: "Sandbox", status: "Sandbox", viruses: "Viruses", controls: "Sandbox", spawnAt:
"Spawn at", count: "Count", spawn: Record<TEnemyType, string> ("Spawn Worm", "Spawn Rootkit"), grantBits: "+1000
bits", keys: { worm: "W", rootkit: "R", bits: "B" } }`; `game.header.settings.quit` → "Quit to title".

- [ ] **Step 1: Write the failing tests and stories**

  `useMatchHeader.test.ts`: drop the wave assertions, keep files and bits. Stories: `SandboxStatus` with `0` and `12`;
  `SandboxControls` (play: clicking "Spawn Worm" calls `onSpawn` with `"worm"`; pressing "J2" calls `onPortChange("J2")`;
  pressing "5" calls `onCountChange("5")`; all six controls are reachable by Tab in order); `MatchHeader` stories
  compile against the `progress` slot, plus the sandbox story.

- [ ] **Step 2: Run** `pnpm test && pnpm test:stories` → FAIL.
- [ ] **Step 3: Implement** (delete `wave` / `nextWave` / `onStartNow` from the header and the dead view fields).
- [ ] **Step 4: Run** `pnpm verify && pnpm test:e2e` → PASS.
- [ ] **Step 5: Commit and open the PR** `feat: sandbox HUD components and header progress slot`.

### Task 8: Sandbox screen, `/play` route, keyboard and e2e

Branch `feat/sandbox-screen`.

**Files:**

- Create: `src/features/game/components/SandboxScreen/` (`SandboxScreen.tsx`, `useSandboxScreen.ts` +
  `useSandboxScreen.test.ts`, `useBoardInput.ts`, `useMatchKeys.ts`, `SandboxScreen.style.ts`, `SandboxScreen.type.ts`,
  `SandboxScreen.stories.tsx`)
- Create: `src/features/game/logic/announcements.ts` + `announcements.test.ts`
- Create: `src/app/play/page.tsx`
- Modify: `src/app/sitemap.ts` (`PUBLIC_PATHS = ["/", "/play"]`), `src/content/metadata.ts` (`playMetadata { title:
game.sandbox.title, alternates: { canonical: "/play" } }`), `src/content/game.ts` + `content.type.ts`
- Modify (only if lint flags `role="application"` + `tabIndex`): `eslint.config.mjs`,
  `jsx-a11y/no-noninteractive-tabindex` option `{ roles: ["application"] }`
- Create: `e2e/sandbox.spec.ts`

**Interfaces:**

- Consumes: everything above; `Board`, `Tower`, `Enemy`, `Shot`, `Beam`, `FileToken`, `BoostEdge`, `RangeRing`,
  `PlacementGhost`, `RoutePreview`, `BoardCursor`, `MatchHeader`, `SandboxStatus`, `SandboxControls`, `BuildItem`,
  `TowerCard`, `GameOverOverlay`, `LiveRegion`; `useRouter` from `next/navigation`.
- Produces:
  - `announcements.ts`: `announcementFor(event: TMatchEvent): string | null` using `game.announce`: `stolen` → "File
    stolen. 7 files in the core."; `leaked` → "File leaked. 1 of 8 files lost."; `recovered` → "File recovered. 8 files
    in the core."; `gameOver` → "Game over: every file leaked."; `refused` → `game.placement.reasons[reason]` or
    "Max version reached." for `maxVersion`; every other event → `null`.
  - `useBoardInput({ map, onCell(cell: ICell), onActivate(cell: ICell), onCancel() }): { ref:
RefObject<HTMLDivElement>; onPointerMove; onClick; onContextMenu }` (`pointToCell` on the wrapper's
    `getBoundingClientRect`; `null` cells ignored; `contextmenu` → `preventDefault` + `onCancel`).
  - `useMatchKeys(handlers: IMatchKeyHandlers, boardRef)`: one `document` `keydown` listener. **Bindings (Call,
    listed in the board's description text):** `ArrowUp/Down/Left/Right` move the cursor (clamped to the grid); `1` / `2`
    / `3` pick Firewall / Antivirus / Debugger (same key again cancels); `Escape` cancels placing, else deselects; `U`
    upgrades and `S` sells the selected tower (or the tower under the cursor); `F` toggles speed; `W` / `R` spawn at the
    picker's port and count; `B` grants bits; `Enter` places (when placing) or selects the tower under the cursor, and
    `Space` toggles pause, **both only when `event.target` is the board wrapper (`Space` also on `document.body`)** so
    HUD buttons keep their native activation. Every key is ignored when `event.target` is inside the settings popover,
    when a modifier is held, or when the game is over. Never calls `preventDefault`.
  - `useSandboxScreen(initialState?: IMatchState): ISandboxScreenView` — store created once in a ref from
    `initialState ?? createMatch({ map: homePc, seed: Date.now() % 2 ** 31, startBits: balance.economy.startBits,
files: balance.files.count })`; UI state: `cursor` (initial `{ c: 6, r: 6 }`), `placing`, `selectedTowerId`, `paused`,
    `speed: TGameSpeed`, `defaultSpeed`, `sound`, `settingsOpen`, `spawnPort "J1"`, `spawnCount "1"`;
    `useGameLoop(store, !paused && status === "playing", Number(speed) as 1 | 2)`; `useMatchStore(store)`;
    `buildBoardView` / `buildBuildItems` / `buildTowerCard` / `fileStates` per render; `useLiveRegion` fed by
    `announcementFor` for each event of the latest state (track the last announced tick in a ref); pointer hover moves
    the cursor (the cursor is the only source of truth for the ghost); click = `activate(cell)`; `restart` dispatches
    `restart`, sets `paused false`, `speed = defaultSpeed`, focuses the board; `quit` → `router.push("/")`; `sound` is
    held and passed back to the header only.
  - `SandboxScreen({ initialState?: IMatchState })` (the prop is the story/test seam): `h-dvh overflow-hidden` grid of
    header / body; visually hidden `h1` `game.sandbox.title`; `MatchHeader` with `progress={<SandboxStatus
enemiesOnBoard={n} />}`; board column: `div role="application" tabIndex={0} aria-label={game.boardInput.label}
("Board") aria-describedby={instructionsId}` with a visually hidden paragraph `game.boardInput.instructions` listing the
    keys, wrapping `Board` with layers in order: `RoutePreview`, `RangeRing`, `BoostEdge[]`, `Tower[]`, dropped
    `FileToken[]`, `Enemy[]`, `Shot[]`, `Beam[]`, `PlacementGhost`, `BoardCursor`; side panel: Build (`BuildItem[]`),
    Selected (`TowerCard` or `game.screen.selectNone` "Select a tower on the board."), `SandboxControls`;
    `GameOverOverlay`; `LiveRegion`.
  - `src/app/play/page.tsx`: `export const metadata = playMetadata; export default function PlayPage() { return
<SandboxScreen />; }`.
  - Content: `game.announce { stolen(n), leaked(k, n), recovered(n), gameOver, maxVersion }`, `game.boardInput { label:
"Board", instructions: "Arrow keys move the cursor. 1, 2, 3 pick a tower; Enter places it; Escape cancels. U upgrades
and S sells the selected tower. Space pauses. F toggles speed. W and R spawn a Worm or a Rootkit; B adds bits." }`,
    `game.screen.selectNone`.

- [ ] **Step 1: Write the failing tests**

  `announcements.test.ts`: the mappings above with exact strings; `placed` → `null`.

  `useSandboxScreen.test.ts` (`renderHook`, stubbed rAF): initial view has `bits 1000`, 8 `"safe"` files, cursor
  `(6,6)`; `pickTower("antivirus")` then `activate()` → one tower in `boardView.towers`, still placing;
  `cancel()` → not placing; `spawn("worm")` then one frame → one enemy; `togglePause()` then frames → `tick`
  unchanged; `restart()` → bits `1000`, no towers.

  `SandboxScreen.stories.tsx` play functions (Review Focus 5): (a) focus the "Pause" button, press Space → "Resume"
  appears; Space again → "Pause" (one toggle per press); (b) focus "Spawn Worm", press Enter → one Worm appears and
  no tower was placed; (c) focus the board, press Tab → `document.activeElement` is not the board; (d) press `2`, open
  Settings with the gear, press Escape → Settings closed and the ghost (`img` "Valid placement") still present; Escape
  again → ghost gone; (e) story `GameOver` with `initialState` = `createMatch(...)` with 7 files `"leaked"` and one
  carried by a worm 10 units from `J2`'s cell center → within 2 s the dialog "Game over" is shown and focus is on
  "Restart"; click it → focus is on the board and the header shows `8 / 8` files.

  `e2e/sandbox.spec.ts`: `goto("/")`, click `link` "Play", `toHaveURL(/\/play$/)`; click `button` named
  /Antivirus/; focus `application` "Board"; press `Enter`; expect `img` "Antivirus v1.0" in the board; click `button`
  "Spawn Worm"; expect an `img` whose name matches `/^Worm, 100% health/` within 2 s; press `Space` with the board
  focused; expect `button` "Resume".

- [ ] **Step 2: Run** `pnpm test && pnpm test:stories` → FAIL.
- [ ] **Step 3: Implement** the hooks, the screen, the route, sitemap and metadata entries, content.
- [ ] **Step 4: Smoke** in `next dev` (per the `next-dev-loop` skill): place each tower, upgrade to v3, sell, spawn
      ×5 Worms at J1 and ×5 Rootkits at J2, watch split / drop / drift / pickup / leak, let 8 files leak → overlay →
      Restart; run 2× for a minute with ≥ 40 enemies and check the React profiler: commit per frame under ~4 ms. If not,
      split the enemy / shot / beam layers into a child component that subscribes to the store itself before merging.
- [ ] **Step 5: Run** `pnpm verify && pnpm test:e2e` → PASS (axe on `/play`; one `h1`).
- [ ] **Step 6: Commit and open the PR** `feat: sandbox screen at /play`.

### Task 9: Home page: title and Play

Branch `feat/home-play`.

**Files:**

- Modify: `src/features/home/components/HomeScreen.tsx`, `HomeScreen.style.ts`; create `HomeScreen.stories.tsx`
- Modify: `src/content/home.ts`, `src/content/content.type.ts` (`IHomeContent { h1: string; lead: string; play:
string; playHref: "/play" }`)

**Interfaces:**

- Consumes: `button` styles from `src/features/shared/components/Button/Button.style.ts` for the Play link (a
  `next/link` `Link`, since it navigates), `cx`.
- Produces: `HomeScreen`: `main` with the `h1` brand, one lead line (Call: keep the existing one-sentence lead), a
  `Link` "Play" to `/play` styled as the primary button.

- [ ] **Step 1: Write the failing story** `HomeScreen.stories.tsx`: play asserts a `link` named "Play" with `href`
      `/play` and one `heading` level 1.
- [ ] **Step 2: Run** `pnpm test:stories` → FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `pnpm verify && pnpm test:e2e` → PASS (Task 8's e2e clicks the link; if Task 8 is not merged
      yet, branch from it).
- [ ] **Step 5: Commit and open the PR** `feat: home page with Play`.

---

## Self-review notes

- Spec coverage: section 5 pathing and free movement (Tasks 1, 3), placement refusal and route preview (1, 5, 8);
  section 6 files (3, 4); section 7 bits and 70 % refund (2); section 8 targeting, versions, info panel, boost rules
  and edges (2, 4, 5); section 10 Worm split and Rootkit armor (4); section 11 keyboard, HUD controls, live region,
  state not by color alone (5–8); section 3 fixed time step (3, 5). Waves, lab, keys, result screen, saved data, sound,
  How to play: out of scope by Hugo's decision and recorded in product.md.
- Names used across tasks: `checkPlacement`, `routePreview`, `computeDistanceField`, `descend`, `pathCells`,
  `hasLineOfSight`, `nextWaypoint`, `moveToward`, `resolveCollision`, `createMatch`, `applyCommand`,
  `recomputeFields`, `step`, `runTicks`, `spawnDue`, `stepEnemies`, `stepFiles`, `stepCombat`, `effectiveStats`,
  `boostFor`, `boostEdges`, `dropFile`, `fileStates`, `filesInCore`, `ticksToRun`, `createMatchStore`,
  `useMatchStore`, `useGameLoop`, `buildBoardView`, `buildBuildItems`, `buildTowerCard`, `announcementFor`,
  `pointToCell`, `useLiveRegion`.
