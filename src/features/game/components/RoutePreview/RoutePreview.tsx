import { routePreview as styles } from "./RoutePreview.style";
import type { IRoutePreviewProps } from "./RoutePreview.type";
import { useRoutePreview } from "./useRoutePreview";

export function RoutePreview(props: IRoutePreviewProps) {
  const points = useRoutePreview(props);
  if (!points.length) return null;
  return (
    <g aria-hidden="true">
      {points.map((route, index) => (
        <polyline key={index} points={route} aria-hidden="true" className={styles.line} />
      ))}
    </g>
  );
}
