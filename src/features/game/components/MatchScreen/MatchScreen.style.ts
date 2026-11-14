export const matchScreen = {
  base: "w-[1312px] overflow-hidden rounded-[14px] border border-line bg-bg",
  body: "grid grid-cols-[minmax(0,992px)_minmax(0,1fr)]",
  board: "min-w-0 bg-bg",
  side: "flex min-w-0 flex-col gap-[18px] border-l border-line bg-surface p-4",
  heading: "mb-2 font-sans text-[13px] font-bold uppercase tracking-[0.06em] text-muted",
  build: "flex flex-col gap-1.5",
} as const;
