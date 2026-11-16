import { liveRegion } from "./LiveRegion.style";
import type { ILiveRegionProps } from "./LiveRegion.type";

export function LiveRegion({ message, slot }: ILiveRegionProps) {
  return (
    <>
      <div className={liveRegion.base} role="status" aria-live="polite" aria-atomic="true">
        {slot === 0 ? message : ""}
      </div>
      <div className={liveRegion.base} role="status" aria-live="polite" aria-atomic="true">
        {slot === 1 ? message : ""}
      </div>
    </>
  );
}
