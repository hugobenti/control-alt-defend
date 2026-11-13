import { useCallback } from "react";

import type { ISwitchProps } from "./Switch.type";

export function useSwitch({ checked, onChange }: Pick<ISwitchProps, "checked" | "onChange">) {
  const toggle = useCallback(() => onChange(!checked), [checked, onChange]);
  return { toggle };
}
