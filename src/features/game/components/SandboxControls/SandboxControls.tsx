import { Button } from "@/features/shared/components/Button/Button";
import { SegmentedControl } from "@/features/shared/components/SegmentedControl/SegmentedControl";

import { sandboxControls } from "./SandboxControls.style";
import type { ISandboxControlsProps } from "./SandboxControls.type";
import { useSandboxControls } from "./useSandboxControls";

export function SandboxControls(props: ISandboxControlsProps) {
  const { port, ports, count, onPortChange, onCountChange, onGrantBits } = props;
  const view = useSandboxControls(props);
  return (
    <section aria-labelledby="sandbox-controls-heading" className={sandboxControls.base}>
      <h2 id="sandbox-controls-heading" className={sandboxControls.heading}>
        {view.controls}
      </h2>
      <div className={sandboxControls.group}>
        <span className={sandboxControls.label}>{view.spawnAt}</span>
        <SegmentedControl
          label={view.spawnAt}
          options={ports}
          value={port}
          onChange={onPortChange}
        />
      </div>
      <div className={sandboxControls.group}>
        <span className={sandboxControls.label}>{view.count}</span>
        <SegmentedControl
          label={view.count}
          options={view.counts}
          value={count}
          onChange={onCountChange}
        />
      </div>
      <div className={sandboxControls.actions}>
        <Button variant="ghost" shortcut={view.keys.worm} onClick={view.spawnWorm}>
          {view.spawn.worm}
        </Button>
        <Button variant="ghost" shortcut={view.keys.rootkit} onClick={view.spawnRootkit}>
          {view.spawn.rootkit}
        </Button>
        <Button variant="ghost" shortcut={view.keys.bits} onClick={onGrantBits}>
          {view.grantBits}
        </Button>
      </div>
    </section>
  );
}
