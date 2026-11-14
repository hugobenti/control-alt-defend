import { Icon } from "@/features/shared/components/Icon/Icon";
import { Kbd } from "@/features/shared/components/Kbd/Kbd";
import { cx } from "@/features/shared/utils/cx";

import { TowerArt } from "../TowerArt/TowerArt";
import { buildItem } from "./BuildItem.style";
import type { IBuildItemProps } from "./BuildItem.type";
import { useBuildItem } from "./useBuildItem";

export function BuildItem(props: IBuildItemProps) {
  const { type, cost, shortcut, state, onSelect } = props;
  const view = useBuildItem(props);
  return (
    <button
      type="button"
      className={cx(buildItem.base, buildItem.state[state])}
      disabled={view.disabled}
      aria-pressed={view.pressed}
      aria-describedby={view.describedBy}
      aria-keyshortcuts={shortcut}
      onClick={onSelect}
    >
      <TowerArt
        type={type}
        version={1}
        className={cx(buildItem.art, state === "locked" && buildItem.artLocked)}
      />
      <span>
        <span className={buildItem.name}>{view.name}</span>
        <span
          id={view.subtitleId}
          className={view.isReason ? buildItem.subtitle.why : buildItem.subtitle.role}
        >
          {view.showLock && (
            <span className={buildItem.lockIcon}>
              <Icon name="lock" />
            </span>
          )}
          {view.subtitle}
        </span>
      </span>
      {view.showCost ? (
        <span className={buildItem.cost}>
          <span id={view.costId}>
            <span aria-hidden="true" className={buildItem.num[view.costValue]}>
              {cost}
            </span>
            <span className={buildItem.srOnly}>{view.costText}</span>
          </span>
          <Kbd>{shortcut}</Kbd>
        </span>
      ) : (
        <span />
      )}
    </button>
  );
}
