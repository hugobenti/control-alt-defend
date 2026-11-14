import { Fragment } from "react";

import { Icon } from "@/features/shared/components/Icon/Icon";
import { IconButton } from "@/features/shared/components/IconButton/IconButton";
import { Pill } from "@/features/shared/components/Pill/Pill";
import { SegmentedControl } from "@/features/shared/components/SegmentedControl/SegmentedControl";
import { Stat } from "@/features/shared/components/Stat/Stat";
import { cx } from "@/features/shared/utils/cx";

import { FilePips } from "../FilePips/FilePips";
import { NextWave } from "../NextWave/NextWave";
import { SettingsMenu } from "../SettingsMenu/SettingsMenu";
import { matchHeader } from "./MatchHeader.style";
import type { IMatchHeaderProps } from "./MatchHeader.type";
import { useMatchHeader } from "./useMatchHeader";

export function MatchHeader(props: IMatchHeaderProps) {
  const {
    level,
    wave,
    nextWave,
    files,
    paused,
    speed,
    defaultSpeed,
    sound,
    settingsOpen,
    onSpeedChange,
    onSoundChange,
    onDefaultSpeedChange,
    onStartNow,
    onRestart,
    onQuit,
    className,
  } = props;
  const view = useMatchHeader(props);
  return (
    <header aria-label={view.label} className={cx(matchHeader.base, className)}>
      <div className={matchHeader.brand}>
        <span className={matchHeader.srOnly}>{view.brand.name}</span>
        <span aria-hidden="true">
          {view.brand.parts.map((part, index) => (
            <Fragment key={part}>
              {index > 0 && <b className={matchHeader.brandSeparator}>{view.brand.separator}</b>}
              {part}
            </Fragment>
          ))}
        </span>
      </div>
      <div className={matchHeader.level} title={view.levelTitle}>
        {view.levelPrefix}
        <strong className={matchHeader.levelName}>{level.name}</strong>
      </div>
      {paused && <Pill className={matchHeader.pill}>{view.pausedLabel}</Pill>}
      <div className={matchHeader.wave}>
        <Stat label={view.waveLabel} value={view.waveValue} total={view.waveTotal} />
        <NextWave {...nextWave} wave={wave.current} onStartNow={onStartNow} />
      </div>
      <div className={matchHeader.files} title={view.fileSummary}>
        <Stat label={view.filesLabel} value={view.filesValue} total={view.filesTotal} />
        <FilePips files={files} />
      </div>
      <div className={matchHeader.bits}>
        <span className={matchHeader.srOnly}>{view.bitsLabel}</span>
        <Icon name="bits" />
        <span className={matchHeader.bitsValue}>{view.bitsText}</span>
      </div>
      <div className={matchHeader.controls}>
        <IconButton icon={view.pauseIcon} label={view.pauseLabel} onClick={view.togglePause} />
        <SegmentedControl
          label={view.speedLabel}
          options={view.speedOptions}
          value={speed}
          onChange={onSpeedChange}
        />
        <IconButton
          icon={view.soundIcon}
          label={view.soundLabel}
          pressed={sound}
          onClick={view.toggleSound}
        />
        <div className={matchHeader.settings}>
          <IconButton
            icon="gear"
            label={view.settingsLabel}
            expanded={settingsOpen}
            controls={view.settingsMenuId}
            onClick={view.toggleSettings}
          />
          <SettingsMenu
            id={view.settingsMenuId}
            open={settingsOpen}
            onClose={view.closeSettings}
            sound={sound}
            defaultSpeed={defaultSpeed}
            onSoundChange={onSoundChange}
            onDefaultSpeedChange={onDefaultSpeedChange}
            onRestart={onRestart}
            onQuit={onQuit}
          />
        </div>
      </div>
    </header>
  );
}
