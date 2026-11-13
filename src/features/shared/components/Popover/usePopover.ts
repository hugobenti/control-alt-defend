import { useEffect, useRef } from "react";

import type { IPopoverProps } from "./Popover.type";

/** Moves focus into the popover on open, closes on Escape, and returns focus to the trigger on close. */
export function usePopover({ open, onClose }: Pick<IPopoverProps, "open" | "onClose">) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement;
    ref.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  }, [open]);

  return { ref };
}
