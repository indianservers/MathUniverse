import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  EXCLUDED_FROM_RESTORATION,
  PROTECTED_HOME_ROUTES,
  PROTECTED_LAB_SAMPLES,
  REMAINING_STUDIO_IDS,
  REMAINING_STUDIO_PAGE_COUNT,
  remainingStudioModeSlots,
  remainingStudioTargets,
  protectedStudioTargets,
} from "./remainingStudioVisualManifest";

const here = dirname(fileURLToPath(import.meta.url));

describe("remaining studio visual manifest", () => {
  it("covers exactly 63 restored pages across the six target studios", () => {
    expect(remainingStudioTargets).toHaveLength(REMAINING_STUDIO_PAGE_COUNT);
    expect(REMAINING_STUDIO_IDS).toEqual([
      "algebra",
      "calculus",
      "linear-algebra",
      "complex-numbers",
      "modelling",
      "discrete",
    ]);
    const byStudio = Object.fromEntries(
      REMAINING_STUDIO_IDS.map((id) => [id, remainingStudioTargets.filter((item) => item.studio === id).length]),
    );
    expect(byStudio).toEqual({
      algebra: 10,
      calculus: 10,
      "linear-algebra": 11,
      "complex-numbers": 10,
      modelling: 11,
      discrete: 11,
    });
  });

  it("lists every lab mode so each tab is a restore target", () => {
    const slots = remainingStudioModeSlots();
    expect(slots.length).toBeGreaterThan(remainingStudioTargets.length);
    expect(slots.some((item) => item.route === "/algebra/functions" && item.mode === "Piecewise")).toBe(true);
    expect(slots.some((item) => item.route === "/calculus/limits" && item.mode === "lhopital")).toBe(true);
    expect(slots.some((item) => item.route === "/linear-algebra/vector-spaces" && item.mode === "Span")).toBe(true);
    expect(slots.some((item) => item.route === "/complex-numbers/fractals" && item.mode === "Julia Set")).toBe(true);
    expect(slots.some((item) => item.route === "/mathematical-modelling/motion" && item.mode === "Pursuit")).toBe(true);
    expect(slots.some((item) => item.route === "/discrete-world/number-sense" && item.mode === "Fractions")).toBe(true);
    expect(remainingStudioTargets.every((item) => item.pageId === "home" || item.modes.length > 0)).toBe(true);
  });

  it("excludes advanced workbenches, AR, and statistics from the restore set", () => {
    const routes = remainingStudioTargets.map((item) => item.route);
    for (const route of EXCLUDED_FROM_RESTORATION) {
      expect(routes.some((item) => item === route || item.startsWith(`${route}/`))).toBe(false);
    }
    expect(routes.some((item) => item === "/geometry/ar" || item === "/trigonometry/ar" || item.endsWith("/ar"))).toBe(false);
    expect(routes.some((item) => item.includes("probability") || item.includes("statistics"))).toBe(false);
  });

  it("records Geometry and Trigonometry as protected baselines", () => {
    expect(PROTECTED_HOME_ROUTES).toEqual(["/geometry", "/trigonometry"]);
    expect(protectedStudioTargets.some((item) => item.route === "/geometry" && item.pageId === "home")).toBe(true);
    expect(protectedStudioTargets.some((item) => item.route === "/trigonometry/unit-circle")).toBe(true);
    for (const route of PROTECTED_LAB_SAMPLES) {
      expect(protectedStudioTargets.some((item) => item.route === route)).toBe(true);
    }
    expect(protectedStudioTargets.every((item) => item.studio === "geometry" || item.studio === "trigonometry")).toBe(true);
  });

  it("keeps restore styles studio-scoped instead of rewriting shared chrome", () => {
    const shared = readFileSync(join(here, "MockupStudioChrome.css"), "utf8");
    const linear = readFileSync(join(here, "LinearAlgebraTarget.css"), "utf8");
    const complex = readFileSync(join(here, "ComplexNumbersTarget.css"), "utf8");
    const modelling = readFileSync(join(here, "ModellingTarget.css"), "utf8");
    const discrete = readFileSync(join(here, "DiscreteTarget.css"), "utf8");
    expect(linear).toContain(".msk-linear-algebra");
    expect(complex).toContain(".msk-complex-numbers");
    expect(modelling).toContain(".msk-modelling");
    expect(discrete).toContain(".msk-discrete");
    expect(linear).not.toMatch(/^\.msk-shell\s*\{/m);
    expect(complex).not.toMatch(/^\.msk-tab\s*\{/m);
    expect(shared).not.toContain("la-target-grid");
    expect(shared).not.toContain("cx-target-grid");
  });
});
