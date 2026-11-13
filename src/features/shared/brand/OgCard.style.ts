import { themeColor } from "@/features/shared/theme/themeTokens";

/** Inline styles: Satori (next/og) renders style objects, not classes. */
export const ogCard = {
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 32,
    width: "100%",
    height: "100%",
    padding: 96,
    background: themeColor("light", "bg"),
  },
  mark: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    borderRadius: 24,
    background: themeColor("light", "accent"),
    color: themeColor("light", "on-accent"),
    fontSize: 72,
    fontWeight: 700,
  },
  title: { fontSize: 72, fontWeight: 700, color: themeColor("light", "fg") },
  description: { fontSize: 36, color: themeColor("light", "muted") },
} as const;
