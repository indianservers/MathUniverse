import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TrigonometryEnhancementWorkbench from "./TrigonometryEnhancementWorkbench";

describe("Trigonometry enhancement workbench", () => {
  it("renders exactly 25 computed tools and five editable parameters", () => {
    const html = renderToString(<TrigonometryEnhancementWorkbench />);
    expect(html.match(/data-enhancement-id="TRIG-/g)).toHaveLength(25);
    expect(html.match(/type="number"/g)).toHaveLength(5);
    expect(html).toContain("Exact-angle snapping");
    expect(html).toContain("Fourier harmonic synthesis");
    expect(html).toContain("Singularity stability warning");
  });
});
