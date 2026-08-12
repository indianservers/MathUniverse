import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("ThreeSceneWrapper lifecycle and accessibility", () => {
  it("provides an accessible scene alternative and explicit WebGL teardown", async () => {
    const source = await readFile(new URL("./ThreeSceneWrapper.tsx", import.meta.url), "utf8");
    expect(source).toContain('role="application"');
    expect(source).toContain('aria-hidden="true"');
    expect(source).toContain("gl.renderLists.dispose()");
    expect(source).toContain("gl.forceContextLoss()");
    expect(source).toContain("Use the adjacent controls for a keyboard-accessible alternative");
  });
});
