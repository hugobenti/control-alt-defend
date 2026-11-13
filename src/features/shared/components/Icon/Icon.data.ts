import type { TIconName } from "./Icon.type";

// Gear outline adapted from Lucide (ISC License): https://lucide.dev/license
export const iconPaths: Record<TIconName, { d: string; fill?: "currentColor" }> = {
  pause: { d: "M6 5h4v14H6zM14 5h4v14h-4z", fill: "currentColor" },
  play: { d: "M7 4.5 19 12 7 19.5Z", fill: "currentColor" },
  sound: { d: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" },
  "sound-off": { d: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9l5 6m0-6-5 6" },
  gear: {
    d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
  },
  lock: { d: "M5 11h14v10H5zM8 11V7.5a4 4 0 0 1 8 0V11" },
  bits: {
    d: "M6.5 6.5h11v11h-11zM9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21",
  },
  block: { d: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM6 18 18 6" },
  check: { d: "M5 12.5 10 17.5 19 7" },
  forward: { d: "M5 5.5 13 12 5 18.5ZM13 5.5 21 12 13 18.5Z", fill: "currentColor" },
};
