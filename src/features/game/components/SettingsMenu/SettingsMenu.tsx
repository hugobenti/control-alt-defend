import { Button } from "@/features/shared/components/Button/Button";
import { Popover } from "@/features/shared/components/Popover/Popover";
import { SegmentedControl } from "@/features/shared/components/SegmentedControl/SegmentedControl";
import { Switch } from "@/features/shared/components/Switch/Switch";
import { cx } from "@/features/shared/utils/cx";

import { settingsMenu } from "./SettingsMenu.style";
import type { ISettingsMenuProps } from "./SettingsMenu.type";
import { useSettingsMenu } from "./useSettingsMenu";

/** Positioned against the nearest relative ancestor: wrap the trigger and the menu together. */
export function SettingsMenu({
  open,
  onClose,
  sound,
  defaultSpeed,
  onSoundChange,
  onDefaultSpeedChange,
  onRestart,
  onQuit,
  className,
}: ISettingsMenuProps) {
  const view = useSettingsMenu();
  return (
    <Popover
      label={view.title}
      open={open}
      onClose={onClose}
      className={cx(settingsMenu.base, className)}
    >
      <h3 className={settingsMenu.title}>{view.title}</h3>
      <div className={settingsMenu.row}>
        <span aria-hidden="true">{view.sound}</span>
        <Switch label={view.sound} checked={sound} onChange={onSoundChange} />
      </div>
      <div className={settingsMenu.row}>
        <span aria-hidden="true">{view.defaultSpeed}</span>
        <SegmentedControl
          label={view.defaultSpeed}
          options={view.speedOptions}
          value={defaultSpeed}
          onChange={onDefaultSpeedChange}
        />
      </div>
      <div className={settingsMenu.actions}>
        <Button variant="ghost" size="md" onClick={onRestart}>
          {view.restart}
        </Button>
        <Button variant="danger" size="md" onClick={onQuit}>
          {view.quit}
        </Button>
      </div>
    </Popover>
  );
}
