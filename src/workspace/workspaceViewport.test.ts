import { describe, expect, it } from "vitest";
import { classifyWorkspaceViewport, requiredWorkspaceViewports } from "./workspaceViewport";

describe("workspace viewport classification", () => {
  it("classifies every required responsive audit viewport", () => {
    expect(requiredWorkspaceViewports).toHaveLength(14);
    const modes = requiredWorkspaceViewports.map(([width, height]) => classifyWorkspaceViewport(width, height, false, true));
    expect(modes.slice(0, 4)).toEqual(["phone", "phone", "phone", "phone"]);
    expect(modes).toEqual(expect.arrayContaining(["tablet", "desktop"]));
  });

  it("uses input capability as well as width for TV mode", () => {
    expect(classifyWorkspaceViewport(1920, 1080, true, false)).toBe("tv");
    expect(classifyWorkspaceViewport(1920, 1080, false, true)).toBe("desktop");
    expect(classifyWorkspaceViewport(3840, 2160, false, false)).toBe("tv");
  });
});
