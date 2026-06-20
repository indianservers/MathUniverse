import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { theoremCategories, theoremCount } from "../data/theoremLibrary";
import TheoremLibraryPage from "./TheoremLibraryPage";

function renderTheoremRoute(path: string) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/theorems" element={<TheoremLibraryPage />} />
        <Route path="/theorems/:categorySlug" element={<TheoremLibraryPage />} />
        <Route path="/theorems/:categorySlug/:theoremSlug" element={<TheoremLibraryPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TheoremLibraryPage", () => {
  it("renders an all-theorems page with category links", () => {
    const html = renderTheoremRoute("/theorems");

    expect(theoremCategories).toHaveLength(12);
    expect(theoremCount).toBeGreaterThanOrEqual(200);
    expect(html).toContain("Theorem Library");
    expect(html).toContain("/theorems/geometry");
    expect(html).toContain("/theorems/calculus-analysis");
    expect(html).toContain("Search theorem, topic, use, prerequisite");
  });

  it("renders a theorem category subpage", () => {
    const html = renderTheoremRoute("/theorems/geometry");

    expect(html).toContain("Geometry");
    expect(html).toContain("Pythagorean theorem");
    expect(html).toContain("Triangle angle sum theorem");
    expect(html).toContain("Open proof scaffold");
  });

  it("renders an individual theorem proof scaffold route", () => {
    const theorem = theoremCategories.find((category) => category.id === "geometry")?.theorems[0];
    expect(theorem).toBeDefined();

    const html = renderTheoremRoute(`/theorems/geometry/${theorem?.slug}`);

    expect(html).toContain("Pythagorean theorem");
    expect(html).toContain("Proof Roadmap");
    expect(html).toContain("Statement");
    expect(html).toContain("Step-by-step draft proof is available below");
  });

  it("connects theorems to visual proofs and formula sections", () => {
    const html = renderTheoremRoute("/theorems/geometry/pythagorean-theorem-1");

    expect(html).toContain("Connected learning");
    expect(html).toContain("/visual-proofs/geometry/pythagorean-theorem-area-rearrangement");
    expect(html).toContain("Pythagorean Theorem by Area Rearrangement");
    expect(html).toContain("/formulas/geometry");
  });

  it("renders Phase 1 number theory theorem step proofs", () => {
    const numberTheory = theoremCategories.find((category) => category.id === "number-theory");
    expect(numberTheory).toBeDefined();
    expect(numberTheory?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);
    expect(numberTheory?.theorems.every((theorem) => theorem.proofSteps && theorem.proofSteps.length >= 4)).toBe(true);

    const html = renderTheoremRoute("/theorems/number-theory/euclid-division-lemma-1");

    expect(html).toContain("Step-by-step proof");
    expect(html).toContain("Choose the divisor");
    expect(html).toContain("Trap the dividend");
    expect(html).toContain("Exam Memory");
    expect(html).toContain("Common Mistakes");
  });

  it("renders Phase 2 geometry theorem step proofs", () => {
    const geometry = theoremCategories.find((category) => category.id === "geometry");
    expect(geometry).toBeDefined();
    expect(geometry?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);
    expect(geometry?.theorems.every((theorem) => theorem.proofSteps && theorem.proofSteps.length >= 5)).toBe(true);

    const html = renderTheoremRoute("/theorems/geometry/pythagorean-theorem-1");

    expect(html).toContain("Step-by-step proof");
    expect(html).toContain("Build a square on each side");
    expect(html).toContain("Make the large square");
    expect(html).toContain("Exam Memory");
    expect(html).toContain("Common Mistakes");
  });

  it("renders Phase 3 trigonometry theorem step proofs", () => {
    const trigonometry = theoremCategories.find((category) => category.id === "trigonometry");
    expect(trigonometry).toBeDefined();
    expect(trigonometry?.theorems).toHaveLength(18);
    expect(trigonometry?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);
    expect(trigonometry?.theorems.every((theorem) => theorem.proofSteps && theorem.proofSteps.length >= 5)).toBe(true);

    const html = renderTheoremRoute("/theorems/trigonometry/sine-rule-1");

    expect(html).toContain("Step-by-step proof");
    expect(html).toContain("Drop an altitude");
    expect(html).toContain("Every side is proportional");
    expect(html).toContain("Exam Memory");
    expect(html).toContain("Common Mistakes");
  });

  it("renders Phase 4 algebra theorem step proofs", () => {
    const algebra = theoremCategories.find((category) => category.id === "algebra");
    expect(algebra).toBeDefined();
    expect(algebra?.theorems).toHaveLength(18);
    expect(algebra?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);
    expect(algebra?.theorems.every((theorem) => theorem.proofSteps && theorem.proofSteps.length >= 5)).toBe(true);

    const html = renderTheoremRoute("/theorems/algebra/factor-theorem-1");

    expect(html).toContain("Step-by-step proof");
    expect(html).toContain("Divide by the linear factor");
    expect(html).toContain("A root makes the remainder zero");
    expect(html).toContain("Exam Memory");
    expect(html).toContain("Common Mistakes");
  });
});
