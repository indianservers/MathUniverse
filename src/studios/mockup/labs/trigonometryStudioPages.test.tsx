import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../MockupStudioApp";

function htmlFor(route: string) {
  return renderToString(
    <MemoryRouter initialEntries={[route]}>
      <MockupStudioApp studioId="trigonometry" />
    </MemoryRouter>,
  );
}

const PAGES = [
  { route: "/trigonometry/identities", title: "Identities & Visual Proofs Studio", mode: "Pythagorean", stamp: "data-id-mode", figure: "Visual Proof" },
  { route: "/trigonometry/inverse", title: "Inverse Trigonometry Studio", mode: "Arcsin", stamp: "data-inv-mode", figure: "Unit Circle Mapping" },
  { route: "/trigonometry/oblique", title: "Oblique Triangle Studio", mode: "Sine Law", stamp: "data-ob-mode", figure: "Show circumcircle" },
  { route: "/trigonometry/waves", title: "Waves & Harmonics Studio", mode: "Simple Wave", stamp: "data-wv-mode", figure: "Unit Circle Oscillator" },
  { route: "/trigonometry/applications", title: "Trigonometry Applications Studio", mode: "Heights &amp; Distances", stamp: "data-app-mode", figure: "Calculated height" },
] as const;

describe("trigonometry studio target pages", () => {
  it("renders each restored lab with mode-stamped chrome and a page-specific figure", () => {
    for (const page of PAGES) {
      const html = htmlFor(`${page.route}?mode=${encodeURIComponent(page.mode.replace(/&amp;/g, "&"))}`);
      expect(html, page.route).toContain(page.title.replace(/&/g, "&amp;"));
      expect(html, `${page.route} stamp`).toContain(`${page.stamp}="${page.mode}"`);
      expect(html, `${page.route} lab mode`).toContain(`data-lab-mode="${page.mode}"`);
      expect(html, `${page.route} canvas`).toContain(`data-mode-canvas="${page.mode}"`);
      expect(html, `${page.route} figure`).toContain(page.figure);
    }
  });

  it("renders Applications Heights helpers and mode-specific overlays", () => {
    const heights = htmlFor("/trigonometry/applications");
    expect(heights).toContain('data-app-mode="Heights &amp; Distances"');
    expect(heights).toContain('data-app-units="m"');
    expect(heights).toContain('data-app-instrument="Theodolite"');
    expect(heights).toContain('data-app-sight="elevation"');
    expect(heights).toContain("SOH CAH TOA");
    expect(heights).toContain("Calculated height");
    expect(heights).toContain("Tower");
    expect(heights).toContain("Cliff");
    expect(heights).toContain("Tree");
    expect(heights).toContain("Lighthouse");
    expect(heights).toContain("Copy reading");
    expect(heights).toContain("15°");
    expect(heights).toContain("Imperial (ft)");
    expect(heights).toContain("Clinometer");
    expect(heights).toContain("adjacent d");
    const bearings = htmlFor("/trigonometry/applications?mode=Bearings");
    expect(bearings).toContain("from north");
    expect(bearings).toContain("Reverse B → A");
    expect(bearings).toContain(">NE<");
    const survey = htmlFor("/trigonometry/applications?mode=Surveying");
    expect(survey).toContain("Two-station survey");
    expect(survey).toContain("baseline");
    const periodic = htmlFor("/trigonometry/applications?mode=Periodic+Models");
    expect(periodic).toContain("midline 2.4 m");
    expect(periodic).toContain("predicted tide");
  });

  it("keeps unit circle and right triangle baselines untouched", () => {
    const unit = htmlFor("/trigonometry/unit-circle");
    expect(unit).toContain("Show reference triangle");
    expect(unit).toContain('data-uc-mode="Angles"');
    const triangle = htmlFor("/trigonometry/right-triangle");
    expect(triangle).toContain("Triangle Inputs");
    expect(triangle).toContain("rt-target-lab");
  });
});
