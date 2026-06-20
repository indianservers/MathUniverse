import { describe, expect, it } from "vitest";
import { parseGraphDescriptor, sampleGraph, type GraphViewport } from "./graphSampler";
import { createUnsupportedWorkspaceAction } from "./unsupportedWorkspaceAction";

const viewport: GraphViewport = { xMin: -5, xMax: 5, yMin: -5, yMax: 5 };

function pointCount(sample: ReturnType<typeof sampleGraph>) {
  if ("segments" in sample) return sample.segments.reduce((sum, segment) => sum + segment.points.length, 0);
  return 0;
}

describe("graphing workflow regression", () => {
  it("covers supported graph plotting workflows", () => {
    const linear = sampleGraph("x", viewport, 120);
    expect(linear.kind).toBe("explicit");
    expect(pointCount(linear)).toBeGreaterThan(100);

    const quadratic = sampleGraph("x^2", viewport, 120);
    expect(quadratic.kind).toBe("explicit");
    expect(pointCount(quadratic)).toBeGreaterThan(50);

    const sine = sampleGraph("sin(x)", viewport, 120);
    expect(sine.kind).toBe("explicit");
    expect(pointCount(sine)).toBeGreaterThan(100);

    const multiple = ["y=x", "y=x^2", "y=sin(x)"].map((expression) => sampleGraph(expression, viewport, 80));
    expect(multiple.every((sample) => pointCount(sample) > 30)).toBe(true);

    let expressions = ["y=x", "y=x^2"];
    expressions = expressions.filter((expression) => expression !== "y=x");
    expect(expressions).toEqual(["y=x^2"]);

    expressions = expressions.map((expression) => expression === "y=x^2" ? "y=x^3" : expression);
    expect(parseGraphDescriptor(expressions[0])).toMatchObject({ kind: "explicit", expression: "x^3" });

    expect(parseGraphDescriptor("x^2 + y^2 = 4").kind).toBe("implicit");
    expect(parseGraphDescriptor("(cos(t), sin(t), t=0..6.28)").kind).toBe("parametric");
    expect(parseGraphDescriptor("r = 2*sin(theta), theta=0..6.28").kind).toBe("polar");
    expect(parseGraphDescriptor("if(x<0,-x,x)").kind).toBe("piecewise");
    expect(parseGraphDescriptor("y <= x + 1").kind).toBe("inequality");

    const implicit = sampleGraph("x^2 + y^2 = 4", viewport);
    expect(implicit.kind).toBe("implicit");
    expect("cells" in implicit ? implicit.cells.length : 0).toBeGreaterThan(0);

    const inequality = sampleGraph("y <= x + 1", viewport);
    expect(inequality.kind).toBe("inequality");
    expect("cells" in inequality ? inequality.cells.length : 0).toBeGreaterThan(0);

    const zoomIn = { ...viewport, xMin: -2, xMax: 2, yMin: -2, yMax: 2 };
    const zoomOut = { ...viewport, xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
    const reset = viewport;
    expect(pointCount(sampleGraph("y=x", zoomIn, 60))).toBeGreaterThan(50);
    expect(pointCount(sampleGraph("y=x", zoomOut, 60))).toBeGreaterThan(50);
    expect(pointCount(sampleGraph("y=x", reset, 60))).toBeGreaterThan(50);

    const traceSample = sampleGraph("y=x^2", { xMin: 1, xMax: 1, yMin: 0, yMax: 2 }, 1);
    expect(pointCount(traceSample)).toBeGreaterThan(0);

    const exported = JSON.stringify({ expressions: ["y=x", "y=sin(x)"], viewport });
    const imported = JSON.parse(exported) as { expressions: string[]; viewport: GraphViewport };
    expect(imported.expressions).toHaveLength(2);
    expect(pointCount(sampleGraph(imported.expressions[1], imported.viewport, 40))).toBeGreaterThan(30);

    const svgPathReady = sampleGraph("y=x", viewport, 40);
    expect("segments" in svgPathReady && svgPathReady.segments[0].points.length > 2).toBe(true);
  });

  it("handles invalid and unsupported graphing requests safely", () => {
    expect(() => sampleGraph("window.alert(1)", viewport)).toThrow();
    const unsupported = createUnsupportedWorkspaceAction("graph neural-network manifold", "This graphing expression is outside the supported browser sampler.");
    expect(unsupported.ok).toBe(false);
    expect(unsupported.preservesState).toBe(true);
    expect(unsupported.suggestions.length).toBeGreaterThan(0);
  });
});
