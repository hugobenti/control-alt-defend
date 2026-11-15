export const sandboxScreen = {
  base: "grid h-dvh grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-bg",
  headingHidden: "sr-only",
  body: "grid min-h-0 grid-cols-[minmax(0,1fr)_320px]",
  board:
    "min-h-0 min-w-0 bg-bg outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus",
  boardDrawing: "h-full w-full [&>svg]:h-full [&>svg]:w-full",
  side: "flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto border-l border-line bg-surface p-4",
  heading: "mb-2 font-sans text-[13px] font-bold uppercase tracking-[0.06em] text-muted",
  build: "flex flex-col gap-1.5",
  empty: "text-sm text-muted",
} as const;
