import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CalculusEnhancementWorkbench from "./CalculusEnhancementWorkbench";

describe("Calculus enhancement workbench", () => {
  it("renders exactly 25 computed calculus tools and editable parameters", () => {
    const html = renderToString(<CalculusEnhancementWorkbench />);
    expect(html.match(/data-enhancement-id="CALC-/g)).toHaveLength(25);
    expect(html.match(/type="number"/g)).toHaveLength(5);
    expect(html).toContain("Epsilon–delta bands");
    expect(html).toContain("ODE method comparison");
    expect(html).toContain("Divergence-flux theorem");
  });
});
