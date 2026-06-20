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
        value="A subset B, y <= x^2"
      />,
    );

    expect(html).toContain("⊂");
    expect(html).toContain("≤");
    expect(html).toContain("<sup>");
    expect(html).toContain("A subset B, y &lt;= x^2");
  });

  it("surfaces intelligent hints for set relations and powers", () => {
    const insight = analyzeSmartMathInput("A subset B and y=x^2");

    expect(insight.hints).toContain("Set relation recognized");
    expect(insight.hints).toContain("Power notation recognized");
  });
});
