import { describe, expect, it } from "vitest";
import { resolveStudioMode } from "./useStudioMode";

const TABS = [
  "Angles",
  "Unit Circle",
  "Quadrants",
  "Exact Values",
  "Reference Angles",
] as const;

describe("resolveStudioMode", () => {
  it("matches spaced labels, plus encoding, and hyphen slugs", () => {
    expect(resolveStudioMode("Exact Values", TABS, "Angles")).toBe("Exact Values");
    expect(resolveStudioMode("Exact+Values", TABS, "Angles")).toBe("Exact Values");
    expect(resolveStudioMode("exact-values", TABS, "Angles")).toBe("Exact Values");
    expect(resolveStudioMode("Reference%20Angles", TABS, "Angles")).toBe(
      "Reference Angles",
    );
    expect(resolveStudioMode(null, TABS, "Angles")).toBe("Angles");
  });
});
