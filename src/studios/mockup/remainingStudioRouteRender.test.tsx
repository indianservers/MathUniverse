import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AlgebraStudio from "../../pages/AlgebraStudio";
import CalculusStudio, { type CalculusStudioPage } from "../../pages/CalculusStudio";
import MockupStudioApp from "./MockupStudioApp";
import {
  PROTECTED_HOME_ROUTES,
  PROTECTED_LAB_SAMPLES,
  remainingStudioTargets,
} from "./remainingStudioVisualManifest";

function encodedTitle(title: string) {
  return title
    .replace(/&/g, "&amp;")
    .replace(/'/g, "&#x27;")
    .replace(/"/g, "&quot;");
}

function htmlFor(route: string) {
  const pathname = route.split("?")[0] ?? route;
  if (pathname === "/algebra" || pathname.startsWith("/algebra/")) {
    return renderToString(<MemoryRouter initialEntries={[route]}><AlgebraStudio /></MemoryRouter>);
  }
  if (pathname === "/calculus" || pathname.startsWith("/calculus/")) {
    const page = (pathname === "/calculus" ? "home" : pathname.slice("/calculus/".length)) as CalculusStudioPage;
    return renderToString(<MemoryRouter initialEntries={[route]}><CalculusStudio page={page} /></MemoryRouter>);
  }
  const studioId = route.startsWith("/linear-algebra")
    ? "linear-algebra"
    : route.startsWith("/complex-numbers")
      ? "complex-numbers"
      : route.startsWith("/mathematical-modelling")
        ? "modelling"
        : route.startsWith("/discrete-world")
          ? "discrete"
          : route.startsWith("/geometry")
            ? "geometry"
            : "trigonometry";
  return renderToString(<MemoryRouter initialEntries={[route]}><MockupStudioApp studioId={studioId} /></MemoryRouter>);
}

describe("remaining studio route restoration", () => {
  it("renders every restored page title and marks lab modes on the canvas", () => {
    expect(remainingStudioTargets).toHaveLength(63);
    for (const target of remainingStudioTargets) {
      const html = htmlFor(target.route);
      expect(
        html.includes(target.title) || html.includes(encodedTitle(target.title)),
        target.route,
      ).toBe(true);
      if (target.modes.length) {
        const mode = encodedTitle(target.modes[0]!);
        const withMode = htmlFor(`${target.route}?mode=${encodeURIComponent(target.modes[0]!)}`);
        expect(withMode, `${target.route} mode`).toContain(`data-lab-mode="${mode}"`);
        expect(withMode, `${target.route} canvas`).toContain(`data-mode-canvas="${mode}"`);
      }
    }
  });

  it("keeps Geometry and Trigonometry protected routes intact", () => {
    for (const route of [...PROTECTED_HOME_ROUTES, ...PROTECTED_LAB_SAMPLES]) {
      const html = htmlFor(route);
      expect(html).not.toContain("la-target-grid");
      expect(html).not.toContain("cx-target-grid");
    }
    const geoHome = htmlFor("/geometry");
    expect(geoHome).toContain("Geometry Studio");
    expect(geoHome).toContain("Explore by Topic");
    const triangles = htmlFor("/geometry/triangles");
    expect(triangles).toContain("Triangle Explorer");
    expect(triangles).toContain("Draggable triangle ABC");
    const trigHome = htmlFor("/trigonometry");
    expect(trigHome).toContain("Explore Key Topics");
    expect(trigHome).toContain("msk-trig-flow");
    const unit = htmlFor("/trigonometry/unit-circle");
    expect(unit).toContain("Show reference triangle");
    expect(unit).toContain('data-uc-mode="Angles"');
  });
});
