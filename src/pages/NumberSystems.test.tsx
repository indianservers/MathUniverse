import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NumberSystems from "./NumberSystems";

const routes = [
  ["/number-systems", "Welcome to Number Systems Studio"],
  ["/number-systems/rational", "Rational numbers"],
  ["/number-systems/irrational", "Irrational numbers"],
  ["/number-systems/real-line", "Real number line"],
  ["/number-systems/hierarchy", "Number hierarchy"],
  ["/number-systems/concepts", "Concept cards"],
  ["/number-systems/practice", "Practice &amp; accuracy"],
] as const;

describe("Number Systems Studio", () => {
  it.each(routes)("renders %s", (route, heading) => {
    const html = renderToString(<MemoryRouter initialEntries={[route]}><NumberSystems /></MemoryRouter>);
    expect(html).toContain(heading);
    expect(html).toContain("Number Systems Studio navigation");
  });

  it("keeps the home cards linked to dedicated labs", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/number-systems"]}><NumberSystems /></MemoryRouter>);
    for (const href of ["/number-systems/rational", "/number-systems/irrational", "/number-systems/real-line", "/number-systems/hierarchy", "/number-systems/formula-visualizer"]) {
      expect(html).toContain(`href="${href}"`);
    }
    expect(html).toContain("Progress counts only completed checks");
    expect(html).toContain("Nested number sets");
    expect(html).toContain("ℕ ⊂ W");
  });

  it("exposes real mode tabs and concept mini canvases", () => {
    const rational = renderToString(<MemoryRouter initialEntries={["/number-systems/rational"]}><NumberSystems /></MemoryRouter>);
    expect(rational).toContain("Fraction");
    expect(rational).toContain("Decimal");
    expect(rational).toContain("Number line");
    const concepts = renderToString(<MemoryRouter initialEntries={["/number-systems/concepts"]}><NumberSystems /></MemoryRouter>);
    expect(concepts).toContain("ns-mini-canvas");
    const practice = renderToString(<MemoryRouter initialEntries={["/number-systems/practice"]}><NumberSystems /></MemoryRouter>);
    expect(practice).toContain("Is 0.125 rational?");
  });
});
