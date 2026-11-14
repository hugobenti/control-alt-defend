export const buildItem = {
  base: "grid w-full cursor-pointer grid-cols-[40px_1fr_auto] items-center gap-2.5 rounded-lg border bg-transparent p-2 text-left text-fg hover:bg-raised disabled:cursor-not-allowed disabled:hover:bg-transparent",
  state: {
    available: "border-line",
    placing: "border-antivirus bg-antivirus/10",
    poor: "border-line",
    locked: "border-dashed border-line",
  },
  art: "size-10",
  artLocked: "opacity-35",
  name: "block text-sm font-bold",
  subtitle: {
    role: "block text-xs text-muted",
    why: "flex items-center gap-1 text-xs text-muted",
  },
  lockIcon: "inline-flex size-3.5 shrink-0 [&>svg]:size-full",
  srOnly: "sr-only",
  cost: "flex flex-col items-end gap-1",
  num: {
    available: "font-mono font-bold text-data",
    poor: "font-mono font-bold text-muted line-through",
  },
};
