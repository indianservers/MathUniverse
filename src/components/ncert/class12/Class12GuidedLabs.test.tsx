import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Class12GuidedLab from "./Class12GuidedLabs";

describe("Class 12 tabbed NCERT guided labs", () => {
  it("renders the compact tabs and determinant sub-tabs", () => {
    const html = renderToStaticMarkup(<Class12GuidedLab kind="determinants" />);

    expect(html).toContain("Determinants");
    expect(html).toContain("Visual");
    expect(html).toContain("Method Stepper");
    expect(html).toContain("Verification");
    expect(html).toContain("Cramer");
    expect(html).toContain('role="tablist"');
  });

  it("renders integration, vector, and practice surfaces for Phase 7 priority labs", () => {
    const integration = renderToStaticMarkup(<Class12GuidedLab kind="integration-methods" />);
    const vectors = renderToStaticMarkup(<Class12GuidedLab kind="vectors-3d-geometry" />);

    expect(integration).toContain("Substitution");
    expect(integration).toContain("Partial Fractions");
    expect(integration).toContain("Area");
    expect(integration).toContain("Practice");
    expect(vectors).toContain("3D Lines");
    expect(vectors).toContain("Shortest Distance");
    expect(vectors).toContain("Dot Product");
  });

  it("renders every Phase 7 Class 12 lab kind without scaffold-only output", () => {
    const kinds = [
      "relations-functions",
      "determinants",
      "continuity-differentiability",
      "integration-methods",
      "differential-equations",
      "vectors-3d-geometry",
      "bayes-theorem",
      "linear-programming",
      "inverse-trig",
    ] as const;

    for (const kind of kinds) {
      const html = renderToStaticMarkup(<Class12GuidedLab kind={kind} />);
      expect(html).toContain("Method Stepper");
      expect(html).toContain("Verification");
      expect(html).toContain("Practice");
      expect(html).toContain("Notes / Links");
      expect(html).toContain("Diagram summary");
    }
  });
});
