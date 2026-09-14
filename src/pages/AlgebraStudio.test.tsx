import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AlgebraStudio from "./AlgebraStudio";

const algebraStudioCss = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "AlgebraStudio.css"),
  "utf8",
);

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

  it("keeps the algebra stage as a vertical scroll pane", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/algebra"]}><AlgebraStudio /></MemoryRouter>);
    expect(html).toContain('data-testid="algebra-scroll-pane"');
    expect(algebraStudioCss).toMatch(/\.alg-stage\{[^}]*overflow-y:auto/);
    expect(algebraStudioCss).toMatch(/\.alg-studio\{[^}]*overflow:hidden/);
  });

  it("renders the expressions tile dashboard and equations balance model", () => {
    const expressions = renderToString(<MemoryRouter initialEntries={["/algebra/expressions"]}><AlgebraStudio /></MemoryRouter>);
    expect(expressions).toContain("Drag tiles to build your expression");
    expect(expressions).toContain("Visual model");
    expect(expressions).toContain("Equivalent forms");
    expect(expressions).toContain("Observe");
    const equations = renderToString(<MemoryRouter initialEntries={["/algebra/equations"]}><AlgebraStudio /></MemoryRouter>);
    expect(equations).toContain("Balance Model");
    expect(equations).toContain("Solution on Number Line");
    expect(equations).toContain("Watch how the scale stays balanced");
  });

  it("links the CAS explorer to the existing CAS workspace", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/algebra/cas"]}><AlgebraStudio /></MemoryRouter>);
    expect(html).toContain("/workspace/data/cas");
    expect(html).toContain("Connected to the existing CAS workspace");
  });

  it("links home topic studios to the existing algebra lab routes", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/algebra"]}><AlgebraStudio /></MemoryRouter>);
    for (const route of ["/algebra/expressions", "/algebra/equations", "/algebra/functions", "/algebra/polynomials", "/algebra/systems", "/algebra/exponents-logs", "/algebra/sequences", "/algebra/proof", "/algebra/cas", "/algebra/advanced"]) {
      expect(html).toContain(`href="${route}"`);
    }
  });

  it("lists every studio page with its lab tabs", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/algebra"]}><AlgebraStudio /></MemoryRouter>);
    expect(html).toContain("Combine Terms");
    expect(html).toContain("Absolute Value");
    expect(html).toContain("Piecewise");
    expect(html).toContain("End Behavior");
    expect(html).toContain("Elimination");
    expect(html).toContain("Exponent Laws");
    expect(html).toContain("Geometric");
    expect(html).toContain("Counterexample");
    expect(html).toContain("Substitute");
    expect(html).toContain("Advanced Workbench");
    expect(html).toContain("mode=Piecewise");
  });

  it("exposes working lab chrome: modes, undo, help, and challenges", () => {
    const equations = renderToString(<MemoryRouter initialEntries={["/algebra/equations"]}><AlgebraStudio /></MemoryRouter>);
    expect(equations).toContain("aria-label=\"Undo\"");
    expect(equations).toContain("aria-label=\"Help\"");
    expect(equations).toContain("Auto-balance");
    expect(equations).toContain("Challenge Me");
    const home = renderToString(<MemoryRouter initialEntries={["/algebra"]}><AlgebraStudio /></MemoryRouter>);
    expect(home).toContain("x + 7");
    expect(home).toContain("2(x + 3)");
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
