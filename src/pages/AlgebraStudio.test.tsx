import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AlgebraStudio from "./AlgebraStudio";

const routes = [
  ["/algebra", "Welcome to Algebra Studio"],
  ["/algebra/expressions", "Expressions &amp; Algebra Tiles Lab"],
  ["/algebra/equations", "Equations &amp; Inequalities Lab"],
  ["/algebra/functions", "Functions &amp; Transformations Lab"],
  ["/algebra/polynomials", "Polynomials Lab"],
  ["/algebra/systems", "Systems of Equations Lab"],
  ["/algebra/exponents-logs", "Exponents Radicals &amp; Logarithms Lab"],
  ["/algebra/sequences", "Sequences &amp; Progressions Lab"],
  ["/algebra/proof", "Algebraic Proof Lab"],
  ["/algebra/cas", "CAS Step Explorer"],
  ["/algebra/advanced", "Advanced Algebra Workbench"],
] as const;

describe("Algebra Studio reference routes", () => {
  it.each(routes)("renders %s", (route, heading) => {
    const html = renderToString(<MemoryRouter initialEntries={[route]}><AlgebraStudio /></MemoryRouter>);
    expect(html).toContain(heading);
    expect(html).toContain("Algebra Studio navigation");
  });

  it("links the CAS explorer to the existing CAS workspace", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/algebra/cas"]}><AlgebraStudio /></MemoryRouter>);
    expect(html).toContain("/workspace/data/cas");
    expect(html).toContain("Connected to the existing CAS workspace");
  });

  it("renders all 25 functional Algebra enhancement tools", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/algebra/advanced"]}><AlgebraStudio /></MemoryRouter>);
    expect(html.match(/data-enhancement-id="ALG-/g)).toHaveLength(25);
    expect(html).toContain("Inequality sign reversal");
    expect(html).toContain("3×3 row elimination");
    expect(html).toContain("CAS candidate verification");
    expect(html.match(/type="number"/g)).toHaveLength(4);
  });
});
