import { cx } from "@/features/shared/utils/cx";

import { filePips } from "./FilePips.style";
import type { IFilePipsProps } from "./FilePips.type";
import { useFilePips } from "./useFilePips";

/** One pip per file, drawn so each state differs by shape, not only by color. */
export function FilePips({ files, className }: IFilePipsProps) {
  const { summary, pips } = useFilePips({ files });
  return (
    <div className={cx(filePips.base, className)}>
      <span className={filePips.summary}>{summary}</span>
      {pips.map(({ state, key }) => (
        <svg key={key} aria-hidden="true" viewBox="0 0 16 20" className={filePips.pip}>
          {state === "safe" && (
            <>
              <path d="M2 2h8l4 4v12H2z" className={filePips.paper} />
              <path d="M10 2v4h4" className={filePips.fold} />
            </>
          )}
          {state !== "safe" && (
            <path d="M2.75 2.75h7l3.5 3.5v11h-10.5z" className={filePips.outline[state]} />
          )}
          {state === "carried" && <circle cx="8" cy="12" r="2.6" className={filePips.carrier} />}
          {state === "leaked" && <path d="M4 16 13 5" className={filePips.slash} />}
        </svg>
      ))}
    </div>
  );
}
