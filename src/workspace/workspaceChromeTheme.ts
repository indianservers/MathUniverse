export const WORKSPACE_CHROME_THEMES = ["default", "glow", "light"] as const;
export type WorkspaceChromeTheme = (typeof WORKSPACE_CHROME_THEMES)[number];

export const WORKSPACE_CHROME_LABELS: Record<WorkspaceChromeTheme, string> = {
  default: "Default",
  glow: "Glow",
  light: "Light",
};

export function isWorkspaceChromeTheme(value: string): value is WorkspaceChromeTheme {
  return (WORKSPACE_CHROME_THEMES as readonly string[]).includes(value);
}

export function readWorkspaceChromeTheme(storageKey: string): WorkspaceChromeTheme {
  if (typeof window === "undefined") return "default";
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw === "dark") return "default";
    return raw && isWorkspaceChromeTheme(raw) ? raw : "default";
  } catch {
    return "default";
  }
}

export function persistWorkspaceChromeTheme(storageKey: string, theme: WorkspaceChromeTheme) {
  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    /* ignore quota / private-mode failures */
  }
}

export const CHROME_THEME_STORAGE_KEYS = {
  graph2d: "math-universe-chrome-2d-graph",
  geometry: "math-universe-geometry-theme",
  geometry3d: "math-universe-chrome-3d-geometry",
  graph3d: "math-universe-chrome-3d-graph",
} as const;
