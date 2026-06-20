import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import FormulaLibraryPage from "./FormulaLibraryPage";

function renderFormulaRoute(path: string) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/formulas" element={<FormulaLibraryPage />} />
        <Route path="/formulas/:categorySlug" element={<FormulaLibraryPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("FormulaLibraryPage", () => {
  it("renders a compact all-formulas page with category links", () => {
    const html = renderFormulaRoute("/formulas");

    expect(html).toContain("Formula Library");
    expect(html).toContain("/formulas/trigonometry");
    expect(html).toContain("/formulas/geometry");
    expect(html).toContain("Search formula, topic, note");
  });

  it("renders the trigonometry category page", () => {
    const html = renderFormulaRoute("/formulas/trigonometry");

    expect(html).toContain("Trigonometry");
    expect(html).toContain("Basic ratios");
    expect(html).toContain("Pythagorean identities");
    expect(html).not.toContain("Formula Command Center");
  });

  it("renders the geometry category page", () => {
    const html = renderFormulaRoute("/formulas/geometry");

    expect(html).toContain("Geometry");
    expect(html).toContain("Triangle area");
    expect(html).toContain("Circle area");
    expect(html).toContain("/visual-proofs/geometry/");
    expect(html).toContain("/theorems/geometry/");
  });

  it("supports grouped calculus category pages", () => {
    const html = renderFormulaRoute("/formulas/calculus");

    expect(html).toContain("Calculus");
    expect(html).toContain("Power rule");
    expect(html).toContain("Fundamental theorem");
  });

  it("explains formula symbols on advanced cards", () => {
    const html = renderFormulaRoute("/formulas/linear-programming");

    expect(html).toContain("Simplex reduced cost");
    expect(html).toContain("candidate non-basic variable column");
    expect(html).toContain("current basis matrix");
    expect(html).toContain("transpose, so row/column orientation matches");
    expect(html).toContain("constraint column for variable j");
  });

  it("explains differential geometry arc-length notation", () => {
    const html = renderFormulaRoute("/formulas/differential-geometry");

    expect(html).toContain("Arc length parameter");
    expect(html).toContain("arc length measured along the curve");
    expect(html).toContain("curve parameter or upper limit");
    expect(html).toContain("position vector of the curve");
    expect(html).toContain("velocity vector, the derivative of r");
    expect(html).toContain("dummy integration parameter");
    expect(html).toContain("tiny change in the parameter u");
    expect(html).not.toContain("i index");
  });
});
