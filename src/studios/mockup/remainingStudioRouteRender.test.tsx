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

function htmlFor(route: string) {
  if (route === "/algebra" || route.startsWith("/algebra/")) {
    return renderToString(<MemoryRouter initialEntries={[route]}><AlgebraStudio /></MemoryRouter>);
  }
  if (route === "/calculus" || route.startsWith("/calculus/")) {
    const page = (route === "/calculus" ? "home" : route.slice("/calculus/".length)) as CalculusStudioPage;
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
      expect(html, target.route).toContain(target.title.replace(/&/g, "&amp;"));
      if (target.modes.length) {
        const withMode = htmlFor(`${target.route}?mode=${encodeURIComponent(target.modes[0]!)}`);
        expect(withMode, `${target.route} mode`).toContain(`data-lab-mode="${target.modes[0]}"`);
        expect(withMode, `${target.route} canvas`).toContain(`data-mode-canvas="${target.modes[0]}"`);
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
