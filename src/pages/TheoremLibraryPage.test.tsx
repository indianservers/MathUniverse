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

    expect(theoremCategories).toHaveLength(13);
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
    expect(html).toContain("Open proof draft");
  });

  it("renders an individual theorem proof draft route", () => {
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
    expect(html).toContain('annotation encoding="application/x-tex">c^2=a^2+b^2</annotation>');
    expect(html).toContain("Exam Memory");
    expect(html).toContain("Common Mistakes");
  });

  it("renders a universal interactive visual proof for every theorem detail page", () => {
    const html = renderTheoremRoute("/theorems/geometry/base-angle-theorem-5");

    expect(html).toContain("Base angle theorem");
    expect(html).toContain('data-testid="theorem-universal-visual-proof"');
    expect(html).toContain("Interactive Visual Proof");
    expect(html).toContain("Visual state 1");
    expect(html).toContain("Equal sides in a triangle have equal opposite angles.");
    expect(html).toContain("aria-label=\"Base angle theorem visual proof\"");
  });

  it("renders Phase 3 trigonometry theorem step proofs", () => {
    const trigonometry = theoremCategories.find((category) => category.id === "trigonometry");
    expect(trigonometry).toBeDefined();
    expect(trigonometry?.theorems.length).toBeGreaterThanOrEqual(18);
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
    expect(algebra?.theorems.length).toBeGreaterThanOrEqual(18);
    expect(algebra?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);
    expect(algebra?.theorems.every((theorem) => theorem.proofSteps && theorem.proofSteps.length >= 5)).toBe(true);

    const html = renderTheoremRoute("/theorems/algebra/factor-theorem-1");

    expect(html).toContain("Step-by-step proof");
    expect(html).toContain("Divide by the linear factor");
    expect(html).toContain("A root makes the remainder zero");
    expect(html).toContain("Exam Memory");
    expect(html).toContain("Common Mistakes");
  });

  it("renders Phase 5 linear algebra theorem step proofs", () => {
    const linearAlgebra = theoremCategories.find((category) => category.id === "linear-algebra-vectors");
    expect(linearAlgebra).toBeDefined();
    expect(linearAlgebra?.theorems.length).toBeGreaterThanOrEqual(18);
    expect(linearAlgebra?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);
    expect(linearAlgebra?.theorems.every((theorem) => theorem.proofSteps && theorem.proofSteps.length >= 5)).toBe(true);

    const html = renderTheoremRoute("/theorems/linear-algebra-vectors/rank-nullity-theorem-4");

    expect(html).toContain("Step-by-step proof");
    expect(html).toContain("Find the kernel directions");
    expect(html).toContain("Domain dimension = lost directions + surviving output directions");
    expect(html).toContain("Exam Memory");
    expect(html).toContain("Common Mistakes");
  });

  it("renders Phase 6 coordinate geometry and calculus draft proofs", () => {
    const coordinateGeometry = theoremCategories.find((category) => category.id === "coordinate-geometry");
    const calculus = theoremCategories.find((category) => category.id === "calculus-analysis");

    expect(coordinateGeometry?.theorems.length).toBeGreaterThanOrEqual(18);
    expect(calculus?.theorems.length).toBeGreaterThanOrEqual(18);
    expect(coordinateGeometry?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);
    expect(calculus?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);

    const coordinateHtml = renderTheoremRoute("/theorems/coordinate-geometry/distance-formula-theorem-1");
    expect(coordinateHtml).toContain("Build the mathematical setup");
    expect(coordinateHtml).toContain('annotation encoding="application/x-tex">d^2=(x2-x1)^2+(y2-y1)^2</annotation>');

    const calculusHtml = renderTheoremRoute("/theorems/calculus-analysis/mean-value-theorem-5");
    expect(calculusHtml).toContain("Apply the key relation");
    expect(calculusHtml).toContain("f(b)-f(a)");
  });

  it("renders Phase 7 probability/statistics and complex number draft proofs", () => {
    const probabilityStatistics = theoremCategories.find((category) => category.id === "probability-statistics");
    const complexNumbers = theoremCategories.find((category) => category.id === "complex-numbers");

    expect(probabilityStatistics?.theorems.length).toBeGreaterThanOrEqual(18);
    expect(complexNumbers?.theorems.length).toBeGreaterThanOrEqual(18);
    expect(probabilityStatistics?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);
    expect(complexNumbers?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);

    const probabilityHtml = renderTheoremRoute("/theorems/probability-statistics/bayes-theorem-3");
    expect(probabilityHtml).toContain("Use the key relation");
    expect(probabilityHtml).toContain('annotation encoding="application/x-tex">P(A|B)=P(B|A)P(A)/P(B)</annotation>');

    const complexHtml = renderTheoremRoute("/theorems/complex-numbers/de-moivre-theorem-4");
    expect(complexHtml).toContain("Build the setup");
    expect(complexHtml).toContain('annotation encoding="application/x-tex">\\theta</annotation>');
  });

  it("renders Phase 8 discrete logic and graph theory draft proofs", () => {
    const discreteLogic = theoremCategories.find((category) => category.id === "discrete-logic");
    const graphTheory = theoremCategories.find((category) => category.id === "graph-theory");

    expect(discreteLogic?.theorems.length).toBeGreaterThanOrEqual(18);
    expect(graphTheory?.theorems.length).toBeGreaterThanOrEqual(18);
    expect(discreteLogic?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);
    expect(graphTheory?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);

    const discreteHtml = renderTheoremRoute("/theorems/discrete-logic/principle-of-mathematical-induction-1");
    expect(discreteHtml).toContain("State the claim carefully");
    expect(discreteHtml).toContain('annotation encoding="application/x-tex">P(n)\\to P(n+1)</annotation>');

    const graphHtml = renderTheoremRoute("/theorems/graph-theory/dijkstra-correctness-theorem-15");
    expect(graphHtml).toContain("Check the hidden condition");
    expect(graphHtml).toContain("Negative edge weights break the proof.");
  });

  it("renders Phase 9 optimization and engineering draft proofs", () => {
    const optimizationEngineering = theoremCategories.find((category) => category.id === "optimization-engineering");

    expect(optimizationEngineering?.theorems.length).toBeGreaterThanOrEqual(18);
    expect(optimizationEngineering?.theorems.every((theorem) => theorem.proofStatus === "draft-ready")).toBe(true);

    const html = renderTheoremRoute("/theorems/optimization-engineering/lagrange-multiplier-theorem-3");

    expect(html).toContain("Step-by-step proof");
    expect(html).toContain('annotation encoding="application/x-tex">f=lambda</annotation>');
    expect(html).toContain("The constraint gradient must not be zero.");
  });

  it("keeps every theorem category fully draft-ready after proof-draft phases", () => {
    const theoremStatuses = theoremCategories.flatMap((category) => category.theorems.map((theorem) => theorem.proofStatus));

    expect(theoremStatuses).toHaveLength(theoremCount);
    expect(theoremStatuses.every((status) => status === "draft-ready")).toBe(true);
  });
});
