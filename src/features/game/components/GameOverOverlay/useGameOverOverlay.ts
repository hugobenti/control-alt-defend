import { useEffect, useId, useRef } from "react";

import type { IGameOverOverlayProps } from "./GameOverOverlay.type";

export function useGameOverOverlay({ open }: Pick<IGameOverOverlayProps, "open">) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    buttonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      event.preventDefault();
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  return { buttonRef, titleId };
}
