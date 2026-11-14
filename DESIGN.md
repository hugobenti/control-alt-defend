---
name: Ctrl+Alt+Defend
description: A legible circuit-board defense game with neon gameplay signals.
colors:
  bg: "#08130F"
  frame: "#0B1A15"
  board: "#0D1F19"
  surface: "#11241E"
  raised: "#173029"
  line: "#24443A"
  fg: "#E7EDE6"
  muted: "#9DB2A6"
  accent: "#45E3F2"
  accent-hover: "#7DEEF8"
  on-accent: "#08130F"
  focus: "#45E3F2"
  copper: "#C38A55"
  copper-dim: "#5E4329"
  firewall: "#A9C4DC"
  antivirus: "#45E3F2"
  debugger: "#86F59E"
  worm: "#FF5AA8"
  rootkit: "#B58EFF"
  data: "#FFD54A"
  danger: "#FF6B6B"
typography:
  display:
    fontFamily: "Chakra Petch, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "B612, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: "B612, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.06em"
  stat-label:
    fontFamily: "B612, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.04em"
  shortcut:
    fontFamily: "B612 Mono, monospace"
    fontSize: "11px"
  number:
    fontFamily: "B612 Mono, monospace"
    fontSize: "12px"
    fontWeight: 700
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
  card: "12px"
  story-frame: "14px"
spacing:
  compact: "4px"
  tight: "6px"
  item: "8px"
  section: "12px"
  panel: "16px"
  section-gap: "18px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.md}"
    height: "30px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
  build-item:
    backgroundColor: "transparent"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "8px"
  tower-card:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.fg}"
    rounded: "{rounded.card}"
    padding: "14px"
---

# Design System: Ctrl+Alt+Defend

## Overview

**Creative North Star: "The Playable Circuit Board"**

The game is an overhead circuit board: a dark solder-mask surface, copper traces and connectors, silkscreen labels, and recognizable electronic parts. The interface is a compact instrument panel around it, not a separate visual world. Opposing silhouettes and purpose-specific colors make threats, defenses, and stolen files readable without a tooltip. This documents the visual foundations and their Storybook states, not a claim that the full game simulation is built.

**Key Characteristics:**

- One dark palette; no light-mode variation.
- Color describes game role before it decorates.
- Crisp vector geometry, small type with deliberate hierarchy, and restrained hit feedback.
- Storybook (`pnpm storybook`) is the living reference for every built component and the composed MatchScreen.

## Colors

The 21 semantic tokens above are defined once in `src/app/globals.css`; use their generated utilities rather than raw color literals in product code.

### Primary

- **Signal cyan (`accent`, `accent-hover`, `on-accent`, `focus`):** primary actions, hovered primary actions, legible action text, and the visible keyboard outline respectively.
- **Antivirus cyan (`antivirus`):** Antivirus tower, its range and shots; shares the cyan signal value intentionally.

### Secondary

- **Firewall steel (`firewall`):** wall art, boost markers and shared-edge connections.
- **Debugger green (`debugger`):** beams, tower art, and the gain from upgrading.
- **Copper (`copper`, `copper-dim`):** pins and connectors; dim traces, vias and keep-out hatching.

### Tertiary

- **Worm pink (`worm`):** worm silhouettes and hit detail.
- **Rootkit violet (`rootkit`):** armored rootkit silhouettes and armor markers.
- **Data yellow (`data`):** files, bits, build prices and refunds.
- **Danger red (`danger`):** leaked files, refused placements, and destructive actions.

### Neutral

- **Ground (`bg`):** page and the dark foreground on a primary action.
- **Frame (`frame`):** board frame and tower pads.
- **Solder mask (`board`):** the playable board surface.
- **Panel (`surface`):** match header and right-hand menu.
- **Raised (`raised`):** card interiors, popovers and hover surfaces.
- **Circuit rule (`line`):** borders, grid dots, unfilled bars and pips.
- **Silkscreen (`fg`):** foreground text, board labels and health fill.
- **Secondary print (`muted`):** subordinate text.

**The Signal Ownership Rule.** Player towers, enemies, data and failure keep their separate semantic colors; a subtle fill uses the same token with opacity, not a new near-match color.

## Typography

**Display Font:** Chakra Petch (500/600/700; sans-serif fallback), loaded through `next/font/google` as `--font-display`.
**Body Font:** B612 (400/700; sans-serif fallback), loaded as `--font-ui`.
**Label/Mono Font:** B612 Mono (400/700; monospace fallback), loaded as `--font-num`.

### Hierarchy

- **Display:** Chakra Petch, semibold (600), medium-large (18px), tight leading (1.1): tower names and prominent match text.
- **Body:** B612, regular (400), compact (13px): stats, instructions and descriptions; build item names step up to 14px bold.
- **Panel label:** B612, bold (700), compact (13px), tracked (0.06em), uppercase: the MatchScreen story's side-panel headings.
- **Stat label:** B612, bold (700), small (11px), tracked (0.04em), uppercase: Wave, Files and other HUD statistics.
- **Number:** B612 Mono, regular or bold (400/700), compact (12px and up): prices, versions, timers, counters and board labels; keyboard shortcut caps are 11px. Counters use tabular numerals.

**The Numbers Mean Numbers Rule.** Use the mono face for actual data and shortcuts, not to make all prose look technical.

## Layout

The MatchScreen story composes a 1312px-wide framed reference surface: one top header above a two-column row. The left column caps at 992px and its SVG board scales to fill the available column; the right panel takes the remaining ~320px with 16px padding and 18px between the build menu and selected-tower card. The Home PC map is 24 × 16 cells; one cell measures 40 SVG units, with a 16-unit border on each side (`viewBox="-16 -16 992 672"`). The story depicts the approved desktop composition, not an implemented responsive game screen; the product's target is desktop (minimum 1024 × 640).

## Elevation & Depth

Tonal layers and fine borders organize the playable board and adjacent panel; ordinary controls and the selected-tower card stay flat. Popovers alone float above these surfaces with a deep, soft shadow (`shadow-popover`: `0 16px 40px -12px rgb(0 0 0 / 0.8)`). Glowing board effects use the per-board SVG glow filter: shots, beams and boosted connections remain legible over dark solder mask. Do not turn the glow into a wash that obscures enemy health or files.

## Shapes

Controls use small corners (4px for shortcuts, 6px for buttons; 10px for build rows); the tower card rounds to 12px. The 14px `story-frame` corner belongs only to the Storybook MatchScreen composition, not to the board's SVG frame. Tower pads and chip bodies are geometric board parts. Each tower has a different silhouette; worms are segmented and rootkits are armored. Board obstacles are chips, capacitors, resistors and crystals, while ports are edge connectors. A range ring is dashed in its owner's tower color.

## Components

### Shared primitives

- **Button:** primary cyan, ghost outlined, and danger outlined variants; small and medium sizes. Hover brightens the primary action or raises a ghost surface; disabled stays muted with a clear reason where relevant. All focusable controls receive the 2px token focus outline with 2px offset.
- **Icon / IconButton / Kbd:** authored SVG symbols; icon-only actions have accessible names, shortcut caps use mono figures.
- **Pill / SegmentedControl / Stat:** compact HUD chips, a pressed-state speed segment (selected foreground on dark ground), and labeled number pairs.
- **Switch / Popover:** a pressed/unpressed sound switch and the settings disclosure panel; keyboard state and focus must remain accessible.

### Game pieces

- **Board / GameDefs / Port / Obstacle / DataCore:** SVG board contains per-instance ids for the dots and glow filter so two boards never collide. The Core visibly holds its files; ports and obstacles are part of the board rather than decorative overlay.
- **Tower / TowerArt / RangeRing / BoostEdge / PlacementGhost:** Firewall, Antivirus and Debugger have versions v1.0–v3.0, selected and boosted visual cues, owner-colored range, adjacent Firewall boost edges, and a valid/refused placement preview.
- **Enemy / EnemyArt / FileToken / Shot / Beam:** Worm and armored Rootkit bodies have health indication; small split Worms, a carrying Worm's visible file, a dropped file and its drift trail, an Antivirus projectile and the Debugger ramp beam all have their own semantic marks. On hit, a brief glitch separates copies; the reduced-motion equivalent is an opacity fade only.
- **BuildItem / TowerCard:** build choices show cost and number-key shortcut; available, placing, unaffordable and lab-locked states have distinct treatment and accessible explanations. Selected-tower cards display stats, boost and next-version gains, upgrade affordance or the unaffordable/locked/max reason, and sell refund.
- **MatchHeader / FilePips / NextWave / SettingsMenu:** wave and next-wave preview, file states (safe, carried, dropped, leaked), bits, pause, speed, sound and settings. Every action is a named keyboard-focusable control. The MatchScreen is a Storybook-only composed reference, not a gameplay route.

## Do's and Don'ts

### Do:

- **Do** take color, shape and typography from the actual tokens and component state stories in Storybook.
- **Do** keep player, enemy and file silhouettes legible at board scale; label meaningful SVG pieces with `role="img"` and a content-sourced `aria-label`, and hide decorative circuitry from assistive technology.
- **Do** preserve a visible keyboard focus outline and explain disabled actions to assistive technology. WCAG 2.2 AA contrast applies to UI and text.
- **Do** honor reduced motion: on hit replace the glitch with the short opacity fade and move nothing else.

### Don't:

- **Don't** introduce a second color scheme or hard-code new near-match palette colors in components.
- **Don't** make particles, beams or glow obscure movement, health or the data files.
- **Don't** treat color alone as the signal for a carrier, a refused placement or a locked action.
