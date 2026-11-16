import { useEffect, useId, useRef } from "react";

import type { IGameOverOverlayProps } from "./GameOverOverlay.type";

export function useGameOverOverlay({ open }: Pick<IGameOverOverlayProps, "open">) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (open) buttonRef.current?.focus();
  }, [open]);
  return { buttonRef, titleId };
}
