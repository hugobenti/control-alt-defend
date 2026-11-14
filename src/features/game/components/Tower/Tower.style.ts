export const tower = {
  pad: "fill-frame stroke-[1.5]",
  color: {
    firewall: "stroke-firewall",
    antivirus: "stroke-antivirus",
    debugger: "stroke-debugger",
  },
  brick: "fill-firewall",
  disc: "fill-antivirus/15 stroke-antivirus stroke-2",
  shield: "fill-antivirus",
  diamond: "fill-debugger/10 stroke-debugger stroke-2",
  emitter: "fill-debugger",
  guide: "fill-none stroke-debugger stroke-[1.6]",
  pip: {
    on: { firewall: "fill-firewall", antivirus: "fill-antivirus", debugger: "fill-debugger" },
    off: "fill-line",
  },
  boost: "fill-none stroke-firewall stroke-[1.6]",
  selected: "fill-none stroke-fg stroke-2",
} as const;
