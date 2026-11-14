import { Button } from "@/features/shared/components/Button/Button";
import { Icon } from "@/features/shared/components/Icon/Icon";
import { cx } from "@/features/shared/utils/cx";

import { TowerArt } from "../TowerArt/TowerArt";
import { towerCard } from "./TowerCard.style";
import type { ITowerCardProps } from "./TowerCard.type";
import { useTowerCard } from "./useTowerCard";

export function TowerCard(props: ITowerCardProps) {
  const { type, version, onUpgrade, onSell } = props;
  const view = useTowerCard(props);
  return (
    <section className={towerCard.base} aria-labelledby={view.nameId}>
      <div className={towerCard.head}>
        <TowerArt type={type} version={version} className={towerCard.art} />
        <div>
          <h3 id={view.nameId} className={towerCard.name}>
            {view.name}
          </h3>
          <p className={towerCard.role}>{view.role}</p>
        </div>
        <span className={cx(towerCard.version.base, towerCard.version.color[type])}>
          {view.versionLabel}
        </span>
      </div>
      <dl className={towerCard.stats}>
        {view.rows.map((row) => (
          <div key={row.label} className={towerCard.row}>
            <dt className={towerCard.statLabel}>{row.label}</dt>
            <dd className={cx(towerCard.statValue, row.tone && towerCard.tone[row.tone])}>
              {row.value}
              {row.next !== undefined && <span className={towerCard.gain}> {row.next}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <div className={towerCard.upgrade}>
        {view.showIntro && (
          <p className={towerCard.intro}>
            <strong className={towerCard.introVersion}>{view.nextVersionLabel}</strong> {view.adds}
          </p>
        )}
        {view.canUpgrade && (
          <Button
            size="md"
            shortcut={view.upgradeShortcut}
            disabled={view.upgradeDisabled}
            describedBy={view.upgradeDescribedBy}
            onClick={onUpgrade}
          >
            <span id={view.reasonId}>{view.upgradeText}</span>
          </Button>
        )}
        {view.showMessage && (
          <p className={towerCard.message}>
            <span className={towerCard.messageIcon[view.messageIcon]}>
              <Icon name={view.messageIcon} />
            </span>
            <span>
              {view.messageTitle !== undefined && (
                <strong className={towerCard.messageTitle}>{view.messageTitle}</strong>
              )}{" "}
              {view.messageText}
            </span>
          </p>
        )}
      </div>
      <div className={towerCard.actions}>
        <Button
          variant="ghost"
          size="md"
          shortcut={view.sellShortcut}
          className={towerCard.button}
          onClick={onSell}
        >
          {view.sellLabel} <span className={towerCard.refund}>{view.sellText}</span>
        </Button>
      </div>
    </section>
  );
}
