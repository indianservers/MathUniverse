import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MathExpression, { MathText, normalizeFormulaForKatex } from "./MathExpression";

describe("lesson math rendering", () => {
  it("converts common numerical division notation to LaTeX fractions", () => {
    expect(normalizeFormulaForKatex("(12 + 8) / 4 = 5")).toBe("\\frac{12 + 8}{4} = 5");
    expect(normalizeFormulaForKatex("1/2 + 1/4 = 3/4")).toBe("\\frac{1}{2} + \\frac{1}{4} = \\frac{3}{4}");
  });

  it("renders numerical example steps with KaTeX fraction markup", () => {
    const html = renderToStaticMarkup(<MathText value="Then divide: 20 / 4 = 5" />);
    expect(html).toContain("katex");
    expect(html).toContain("mfrac");
    expect(html).not.toContain("20 / 4");
  });

  it("renders explicit lesson LaTeX without exposing slash notation", () => {
    const html = renderToStaticMarkup(<MathExpression value={String.raw`\displaystyle x_M = \frac{2 + 6}{2} = 4`} />);
    expect(html).toContain("mfrac");
    expect(html).not.toContain("/2");
  });

  it("normalizes legacy Unicode math and percentages into valid LaTeX", () => {
    expect(normalizeFormulaForKatex("r′ = √25 = 5 and growth = 20%"))
      .toBe(String.raw`r' = \sqrt{25} = 5 and growth = 20\%`);
    expect(normalizeFormulaForKatex("AB ∥ CD")).toBe(String.raw`AB \parallel{} CD`);
  });

  it("renders fractions embedded in numerical sentence prompts", () => {
    const html = renderToStaticMarkup(<MathText value="Add 2/3 and 1/6." />);
    expect(html).toContain("mfrac");
    expect(html).not.toContain("2/3");
    expect(html).not.toContain("1/6");
  });

  it("renders symbolic and radical divisions embedded in example prompts as fractions", () => {
    const html = renderToStaticMarkup(
      <MathText value="Evaluate x²/25 at x = 5 and compare 1/√x." />,
    );

    expect(html).toContain("mfrac");
    expect(html).not.toContain("x²/25");
    expect(html).not.toContain("1/√x");
  });

  it("never prints raw displaystyle commands in prose numerical steps", () => {
    const html = renderToStaticMarkup(
      <MathText value={String.raw`\displaystyle Substitute 5 into the Line Through Two Points in 3D rule.`} />,
    );
    expect(html).not.toContain("\\displaystyle");
    expect(html).toContain("Substitute 5");
  });

  it("keeps short English prompts as prose and only mathifies embedded formulas", () => {
    const html = renderToStaticMarkup(<MathText value="Domain of 1/(x-2)." />);
    expect(html).toContain("Domain of");
    expect(html).toContain("katex");
    expect(html).not.toMatch(/D<\/span>\s*o<\/span>/);
  });

  it("does not mathify the rest of a labelled English sentence after a colon", () => {
    const html = renderToStaticMarkup(
      <MathText value="Compute this Tangents and Normals case with input 2: Find sin 30°. Labelled result 1/2." />,
    );
    expect(html).toContain("Find");
    expect(html).toContain("katex");
    expect(html).not.toMatch(/>F<\/span>/);
  });

  it("leaves yes/no answers as ordinary text", () => {
    const html = renderToStaticMarkup(<MathText value="no" />);
    expect(html).toBe('<span class="">no</span>');
  });
});
