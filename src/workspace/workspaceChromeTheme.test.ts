import { describe, expect, it } from "vitest";
import { isWorkspaceChromeTheme, readWorkspaceChromeTheme } from "./workspaceChromeTheme";

describe("workspace chrome theme", () => {
  it("treats the current look as default", () => {
    expect(isWorkspaceChromeTheme("default")).toBe(true);
    expect(isWorkspaceChromeTheme("glow")).toBe(true);
    expect(isWorkspaceChromeTheme("light")).toBe(true);
    expect(isWorkspaceChromeTheme("neon")).toBe(false);
  });

  it("returns default when storage is unavailable", () => {
    expect(readWorkspaceChromeTheme("math-universe-geometry-theme")).toBe("default");
  });
});
