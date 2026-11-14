import { useState } from "react";

import type { ILiveRegionState } from "./LiveRegion.type";

export function useLiveRegion(): ILiveRegionState {
  const [{ message, slot }, setAnnouncement] = useState<{ message: string; slot: 0 | 1 }>({
    message: String(),
    slot: 1,
  });
  return {
    message,
    slot,
    announce(text) {
      setAnnouncement((current) => ({ message: text, slot: current.slot === 0 ? 1 : 0 }));
    },
  };
}
