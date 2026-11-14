export const enemy = {
  fadeOnHit: "motion-reduce:animate-[glitch-fade_120ms_linear]",
  layer: {
    ghostShift:
      "hue-rotate-160 saturate-[1.6] [--glitch-opacity:0.55] [--glitch-shift:-2.5px] motion-reduce:hidden opacity-0 motion-safe:animate-[glitch_240ms_linear]",
    ghostLight:
      "brightness-[1.6] [--glitch-opacity:0.45] [--glitch-shift:2.5px] motion-reduce:hidden opacity-0 motion-safe:animate-[glitch_240ms_linear]",
    main: "",
  },
  slice:
    "fill-bg [--glitch-opacity:0.9] [--glitch-shift:0px] motion-reduce:hidden opacity-0 motion-safe:animate-[glitch_240ms_linear]",
  wormSegment: { tail: "fill-worm/50", mid: "fill-worm/75", body: "fill-worm", head: "fill-worm" },
  eye: "fill-bg",
  shell: "fill-rootkit/15 stroke-rootkit stroke-[3.2]",
  core: "fill-rootkit",
  plates: "stroke-rootkit/80 stroke-[1.3]",
  ring: "fill-none stroke-data/90 stroke-[1.5]",
  track: "fill-line",
  fill: "fill-fg",
  armor: "fill-rootkit",
} as const;
