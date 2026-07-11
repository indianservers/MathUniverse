import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import SmartMathInput, { analyzeSmartMathInput, tokenizeSmartMathInput } from "./SmartMathInput";

describe("SmartMathInput", () => {
  it("recognizes powers, variables, set relations, and inequality relations", () => {
    const tokens = tokenizeSmartMathInput("y <= x^2 and A subset B");

    expect(tokens.some((token) => token.text === "<=" && token.kind === "relation")).toBe(true);
    expect(tokens.some((token) => token.text === "x^2" && token.kind === "power")).toBe(true);
    expect(tokens.some((token) => token.text === "A" && token.kind === "variable")).toBe(true);
    expect(tokens.some((token) => token.text === "subset" && token.kind === "relation")).toBe(true);
  });

  it("shows Desmos-style readable math while preserving typed input", () => {
    const html = renderToStaticMarkup(
      <SmartMathInput
        ariaLabel="Smart math test input"
        compact
        onChange={() => undefined}
        showLegend={false}
        showTokenPreview
        value="A subset B, y <= x^2"
      />,
    );

    expect(html).toContain("⊂");
    expect(html).toContain("≤");
    expect(html).toContain("<sup>");
    expect(html).toContain("A subset B, y &lt;= x^2");
  });

  it("uses a snow-white editor surface with colored token classes", () => {
    const html = renderToStaticMarkup(
      <SmartMathInput
        ariaLabel="Smart math test input"
        onChange={() => undefined}
        showLegend={false}
        value="2*x+5=17"
      />,
    );

    expect(html).toContain("bg-white");
    expect(html).toContain("text-slate-950");
    expect(html).not.toContain("text-transparent");
    expect(html).toContain("Readable math preview");
    expect(html).toContain("text-amber-700");
    expect(html).toContain("text-rose-700");
    expect(html).toContain("text-emerald-700");
  });

  it("surfaces intelligent hints for set relations and powers", () => {
    const insight = analyzeSmartMathInput("A subset B and y=x^2");

    expect(insight.hints).toContain("Set relation recognized");
    expect(insight.hints).toContain("Power notation recognized");
  });
});
