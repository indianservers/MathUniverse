import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import MockupStudioApp from "../../mockup/MockupStudioApp";
import { parseMeasureMode, parseMeasurePanel } from "./measurementMode";
import { defaultRects, unionArea, unionPerimeter, convertFromCm, fmt } from "./measurementMath";

describe("Measurement Lab", () => {
  it("parses mode and inspector panel from the URL", () => {
    expect(parseMeasureMode("Angle")).toBe("angle");
    expect(parseMeasureMode(null)).toBe("length");
    expect(parseMeasurePanel("proof")).toBe("proof");
    expect(parseMeasurePanel(null)).toBe("measurements");
  });

  it("computes disjoint-union area and outer perimeter", () => {
    const rects = defaultRects();
    const parts = rects.reduce((sum, r) => sum + r.w * r.h, 0);
    expect(unionArea(rects)).toBeCloseTo(parts, 5);
    expect(unionArea(rects)).toBeCloseTo(185.72, 5);
    expect(unionPerimeter(rects)).toBeCloseTo(65.7, 5);
    expect(unionPerimeter(rects)).toBeGreaterThan(0);
    expect(unionPerimeter(rects)).toBeLessThan(rects.reduce((sum, r) => sum + 2 * (r.w + r.h), 0));
    expect(convertFromCm(100, "m")).toBeCloseTo(1);
  });

  it("renders the composite measurement workspace", () => {
    const rects = defaultRects();
    const liveArea = fmt(unionArea(rects), 0.01);
    const livePeri = fmt(unionPerimeter(rects), 0.01);
    const html = renderToString(
      <MemoryRouter initialEntries={["/geometry/measurement"]}>
        <MockupStudioApp studioId="geometry" />
      </MemoryRouter>,
    );
    expect(html).toContain("Measurement Lab");
    expect(html).toContain("Measure length, angle, area, perimeter, scale, and uncertainty.");
    expect(html).toContain("Measurement controls");
    expect(html).toContain("Composite shape summary");
    expect(html).toContain(liveArea);
    expect(html).toContain(livePeri);
    if (liveArea !== "129.34") expect(html).not.toContain("129.34");
    if (livePeri !== "48.80") expect(html).not.toContain("48.80");
    expect(html).toContain("Decomposition");
    expect(html).toContain("Unit conversions");
    expect(html).toContain("Uncertainty");
    expect(html).toContain("The shape is composite");
    expect(html).not.toContain("workspace-suite-bar");
  });

  it("opens the proof inspector from the panel query", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/geometry/measurement?panel=proof&mode=area"]}>
        <MockupStudioApp studioId="geometry" />
      </MemoryRouter>,
    );
    expect(html).toContain("Proof explanation");
    expect(html).toContain("finitely additive");
    expect(html).toContain('aria-selected="true"');
  });
});
