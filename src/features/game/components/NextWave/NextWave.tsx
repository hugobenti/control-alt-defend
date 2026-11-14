import { Button } from "@/features/shared/components/Button/Button";
import { cx } from "@/features/shared/utils/cx";

import { EnemyArt } from "../EnemyArt/EnemyArt";
import { nextWave } from "./NextWave.style";
import type { INextWaveProps } from "./NextWave.type";
import { useNextWave } from "./useNextWave";

export function NextWave(props: INextWaveProps) {
  const { phase, onStartNow, className } = props;
  const view = useNextWave(props);
  if (phase === "running") {
    return (
      <div className={cx(nextWave.base, className)}>
        <span className={nextWave.label}>{view.runningText}</span>
        {view.virusesText !== undefined && (
          <span className={nextWave.viruses}>{view.virusesText}</span>
        )}
      </div>
    );
  }
  return (
    <div className={cx(nextWave.base, className)}>
      <span className={nextWave.label}>{view.label}</span>
      <div className={nextWave.chips}>
        {view.chips.map((chip) => (
          <span key={chip.key} className={nextWave.chip}>
            <EnemyArt type={chip.type} className={nextWave.art} />
            <span aria-hidden="true">{chip.times}</span>
            <span className={nextWave.srOnly}>{chip.name}</span>
          </span>
        ))}
      </div>
      {view.timeText !== undefined && <span className={nextWave.time}>{view.timeText}</span>}
      <Button shortcut={view.startKey} onClick={onStartNow}>
        {view.startNow}
        {view.bonusText !== undefined && <span className={nextWave.bonus}>{view.bonusText}</span>}
      </Button>
    </div>
  );
}
