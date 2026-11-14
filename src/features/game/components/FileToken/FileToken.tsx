import { useGameDefs } from "../GameDefs/useGameDefs";
import { fileToken as styles } from "./FileToken.style";
import type { IFileTokenProps } from "./FileToken.type";
import { useFileToken } from "./useFileToken";

export function FileToken(props: IFileTokenProps) {
  const ids = useGameDefs();
  const layout = useFileToken(props, ids?.glow);
  return (
    <g transform={layout.transform} role="img" aria-label={layout.label}>
      {layout.dropped && <path d="M0 0 Q12 38 52 54" className={styles.trail} aria-hidden="true" />}
      <g filter={layout.glowFilter} aria-hidden="true">
        <path d="M-5 -6.5 H1.5 L5 -3 V6.5 H-5Z" className={styles.paper} />
        <path d="M1.5 -6.5 V-3 H5" className={styles.mark} />
        <path d="M-2.8 0 H2.8 M-2.8 2.8 H2.8" className={styles.writing} />
      </g>
    </g>
  );
}
