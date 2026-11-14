import { cx } from "@/features/shared/utils/cx";

import { Tower } from "../Tower/Tower";
import { towerArt } from "./TowerArt.style";
import type { ITowerArtProps } from "./TowerArt.type";

/** A tower drawn on its own, decorative: the text next to it names the tower. */
export function TowerArt({ type, version, className }: ITowerArtProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={cx(towerArt.base, className)}>
      <Tower type={type} version={version} c={0} r={0} />
    </svg>
  );
}
