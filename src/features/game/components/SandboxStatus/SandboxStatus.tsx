import { Pill } from "@/features/shared/components/Pill/Pill";
import { Stat } from "@/features/shared/components/Stat/Stat";

import { sandboxStatus } from "./SandboxStatus.style";
import type { ISandboxStatusProps } from "./SandboxStatus.type";
import { useSandboxStatus } from "./useSandboxStatus";

export function SandboxStatus(props: ISandboxStatusProps) {
  const view = useSandboxStatus(props);
  return (
    <div className={sandboxStatus.base}>
      <Pill>{view.label}</Pill>
      <Stat label={view.viruses} value={view.value} />
    </div>
  );
}
