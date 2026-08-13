export type Graph3DThemeId =
  | "simple-gradient"
  | "aurora-neon"
  | "solar-flare"
  | "arctic-glass"
  | "emerald-matrix"
  | "cosmic-candy"
  | "minimal-pearl"
  | "thermal-spectrum";

export type Graph3DGradientStop = { at: number; color: string };

export type Graph3DTheme = {
  id: Graph3DThemeId;
  name: string;
  description: string;
  background: string;
  backgroundAccent: string;
  gradient: Graph3DGradientStop[];
  mesh: string;
  meshOpacity: number;
  gridMajor: string;
  gridMinor: string;
  axes: [string, string, string];
  selection: string;
  hover: string;
  point: string;
  crossSection: string;
  contour: string;
  surfaceOpacity: number;
  roughness: number;
  metalness: number;
  emissive: string;
  emissiveIntensity: number;
};

export const GRAPH_3D_THEME_STORAGE_KEY = "math-universe-3d-graph-theme-v1";
export const DEFAULT_GRAPH_3D_THEME_ID: Graph3DThemeId = "simple-gradient";

export const GRAPH_3D_THEMES: Graph3DTheme[] = [
  theme("simple-gradient", "Simple Gradient", "Clean cyan, blue and soft violet height shading.", "#061126", "#102958", ["#22d3ee", "#2788f5", "#8b7cf6"], "#b8e8ff", "#1d6592", "#102c4c", ["#45dff4", "#78a7ff", "#b3a5ff"], "#ffffff", "#dff8ff", "#c8f5ff", "#ffd166", "#9edfff", .14, .92, .36, .08, "#123d67", .14),
  theme("aurora-neon", "Aurora Neon", "Electric cyan, blue, violet and magenta with restrained bloom.", "#020619", "#111044", ["#00f5ff", "#1677ff", "#7746ff", "#ff39d6"], "#91fbff", "#1545a1", "#0c2252", ["#55f7ff", "#7697ff", "#d087ff"], "#ffffff", "#6fffff", "#f7efff", "#ffe15a", "#8ffcff", .19, .94, .3, .16, "#3145b8", .42),
  theme("solar-flare", "Solar Flare", "Crimson, coral, amber and yellow on deep plum.", "#120514", "#351025", ["#d90052", "#ff3b30", "#ff7a1a", "#ffd84a"], "#ffd28a", "#67203e", "#2b1025", ["#ffbf36", "#ff745d", "#fff16a"], "#fff7d6", "#ffe46a", "#fff2a8", "#ffe347", "#ffb45c", .16, .94, .4, .05, "#8d1c24", .32),
  theme("arctic-glass", "Arctic Glass", "Transparent cobalt, turquoise and icy white glass.", "#03111f", "#0b304a", ["#1857d8", "#12bcd4", "#baf9ff", "#f3ffff"], "#d8ffff", "#1a6680", "#0c2f43", ["#61eaff", "#82b9ff", "#f4ffff"], "#ffffff", "#c5ffff", "#f4ffff", "#fff1a8", "#b9fbff", .2, .62, .16, .34, "#1a6e8e", .22),
  theme("emerald-matrix", "Emerald Matrix", "Forest, teal, emerald and mint on green-black.", "#020d0b", "#063328", ["#056b53", "#00a77d", "#32d6a1", "#b4ffd9"], "#8fffd0", "#08765c", "#043326", ["#35f2bd", "#6be7cb", "#c2ffe2"], "#f1fff8", "#6bffd0", "#c5ffe5", "#ffe682", "#83f8c8", .16, .9, .4, .04, "#06785c", .28),
  theme("cosmic-candy", "Cosmic Candy", "Indigo, ultraviolet, fuchsia, peach and cyan.", "#09061e", "#2c1153", ["#352be5", "#8d35f5", "#f03bc2", "#ff9f91", "#2be8ff"], "#e8c9ff", "#53238e", "#1d1241", ["#37e8ff", "#ff65ca", "#b27bff"], "#fff6ff", "#64f4ff", "#ffe7fb", "#ffe46b", "#e1bbff", .18, .93, .32, .12, "#6226aa", .36),
  theme("minimal-pearl", "Minimal Pearl", "Pale blue, silver, white and champagne satin.", "#07111f", "#1a2a3c", ["#8abce3", "#c5d8ea", "#fffdf7", "#f6ddbd"], "#f5fbff", "#64788b", "#253647", ["#b7dcf7", "#e8eef5", "#ffe8c4"], "#ffffff", "#ffffff", "#fff9ea", "#ffe1a3", "#e7f5ff", .12, .98, .54, .1, "#6e8ca8", .08),
  theme("thermal-spectrum", "Thermal Spectrum", "Continuous scientific blue-to-red temperature spectrum.", "#03091b", "#102349", ["#123cdb", "#00b9ff", "#00dcaa", "#b8ed25", "#ffe21c", "#ff7818", "#f02424"], "#bcecff", "#164f82", "#0c2748", ["#4fc3ff", "#60e1cf", "#fff16b"], "#ffffff", "#ffed6a", "#e9fbff", "#fff34f", "#85d9ff", .15, .96, .38, .06, "#134f98", .22),
];

function theme(
  id: Graph3DThemeId, name: string, description: string, background: string, backgroundAccent: string,
  colors: string[], mesh: string, gridMajor: string, gridMinor: string, axes: [string, string, string],
  selection: string, hover: string, point: string, crossSection: string, contour: string,
  meshOpacity: number, surfaceOpacity: number, roughness: number, metalness: number, emissive: string, emissiveIntensity: number,
): Graph3DTheme {
  const denominator = Math.max(1, colors.length - 1);
  return { id, name, description, background, backgroundAccent, gradient: colors.map((color, index) => ({ at: index / denominator, color })), mesh, meshOpacity, gridMajor, gridMinor, axes, selection, hover, point, crossSection, contour, surfaceOpacity, roughness, metalness, emissive, emissiveIntensity };
}

export function isGraph3DThemeId(value: unknown): value is Graph3DThemeId {
  return GRAPH_3D_THEMES.some((item) => item.id === value);
}

export function getGraph3DTheme(id: Graph3DThemeId): Graph3DTheme {
  return GRAPH_3D_THEMES.find((item) => item.id === id) ?? GRAPH_3D_THEMES[0];
}

export function graph3DThemeGradient(themeValue: Graph3DTheme): string {
  return `linear-gradient(90deg, ${themeValue.gradient.map((stop) => `${stop.color} ${Math.round(stop.at * 100)}%`).join(", ")})`;
}
