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

  it("teaches double-angle identities with stacked angles, forms, and the 2sinθ trap", () => {
    const html = htmlFor("/trigonometry/identities?mode=Double+Angle");
    expect(html).toContain('data-id-mode="Double Angle"');
    expect(html).toContain('data-double-form="sin"');
    expect(html).toContain("Purple ray is 2θ");
    expect(html).toContain("Two gold wedges stack as θ + θ");
    expect(html).toContain("2θ is θ stacked on θ, not “twice the sine”");
    expect(html).toContain("area 2 sinθ cosθ");
    expect(html).toContain("Common trap");
    expect(html).toContain("Why the 2 appears");
    expect(html).toContain("Check this θ");
    expect(html).toContain("Where tan 2θ breaks");
    expect(html).toContain(">cos 2θ<");
    expect(html).toContain(">tan 2θ<");
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
