import { describe, expect, it } from "vitest";
import { DEFAULT_GRAPH_3D_THEME_ID, GRAPH_3D_THEMES, getGraph3DTheme, graph3DThemeGradient, isGraph3DThemeId } from "./graph3dThemes";

describe("3D graph themes", () => {
  it("provides the complete unique theme set with Simple Gradient as default", () => {
    expect(GRAPH_3D_THEMES).toHaveLength(8);
    expect(new Set(GRAPH_3D_THEMES.map((item) => item.id)).size).toBe(8);
    expect(getGraph3DTheme(DEFAULT_GRAPH_3D_THEME_ID).name).toBe("Simple Gradient");
  });

  it("keeps every gradient ordered and usable as a CSS preview", () => {
    GRAPH_3D_THEMES.forEach((theme) => {
      expect(theme.gradient.length).toBeGreaterThanOrEqual(3);
      expect(theme.gradient[0].at).toBe(0);
      expect(theme.gradient.at(-1)?.at).toBe(1);
      expect(graph3DThemeGradient(theme)).toContain("linear-gradient");
    });
  });

  it("validates persisted theme identifiers", () => {
    expect(isGraph3DThemeId("thermal-spectrum")).toBe(true);
    expect(isGraph3DThemeId("unknown-theme")).toBe(false);
  });
});
