export type WorkspaceViewportMode = "phone" | "tablet" | "desktop" | "tv";

export function classifyWorkspaceViewport(width: number, height: number, coarsePointer: boolean, hoverAvailable: boolean): WorkspaceViewportMode {
  if (width >= 1600 && (coarsePointer || !hoverAvailable)) return "tv";
  if (width < 600 || (height < 600 && width < 960)) return "phone";
  if (width < 1180) return "tablet";
  return "desktop";
}
export const requiredWorkspaceViewports = [
  [320, 568], [360, 800], [390, 844], [412, 915], [600, 960], [768, 1024], [820, 1180],
  [1024, 768], [1280, 720], [1366, 768], [1440, 900], [1920, 1080], [2560, 1440], [3840, 2160],
] as const;
