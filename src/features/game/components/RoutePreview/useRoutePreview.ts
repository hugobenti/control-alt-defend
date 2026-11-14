import type { IRoutePreviewProps } from "./RoutePreview.type";

export function useRoutePreview({ routes }: IRoutePreviewProps) {
  return routes.map((route) => route.map(({ x, y }) => `${x},${y}`).join(" "));
}
