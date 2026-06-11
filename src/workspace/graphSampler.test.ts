import { describe, expect, it } from "vitest";
import { parseGraphDescriptor, sampleGraph } from "./graphSampler";

describe("robust graph sampler", () => {
  it("classifies explicit, implicit, parametric, polar, piecewise, and inequality graphs", () => {
    expect(parseGraphDescriptor("sin(x)").kind).toBe("explicit");
    expect(parseGraphDescriptor("x^2 + y^2 = 9").kind).toBe("implicit");
    expect(parseGraphDescriptor("x=cos(t), y=sin(t)").kind).toBe("parametric");
    expect(parseGraphDescriptor("r=2*sin(theta)").kind).toBe("polar");
    expect(parseGraphDescriptor("if(x<0,-x,x)").kind).toBe("piecewise");
    expect(parseGraphDescriptor("y < x + 1").kind).toBe("inequality");
  });

  it("splits discontinuous explicit functions into multiple segments", () => {
    const sample = sampleGraph("1/x", { xMin: -2, xMax: 2, yMin: -10, yMax: 10 }, 240);

    expect(sample.kind).toBe("explicit");
    expect("segments" in sample && sample.segments.length).toBeGreaterThan(1);
  });

  it("samples implicit and polar graphs into drawable structures", () => {
    const implicit = sampleGraph("x^2+y^2=4", { xMin: -3, xMax: 3, yMin: -3, yMax: 3 });
    const polar = sampleGraph("r=2*sin(theta)", { xMin: -3, xMax: 3, yMin: -3, yMax: 3 });

    expect(implicit.kind).toBe("implicit");
    expect("cells" in implicit && implicit.cells.length).toBeGreaterThan(0);
    expect("segments" in implicit && implicit.segments.length).toBeGreaterThan(12);
    expect(polar.kind).toBe("polar");
    expect("segments" in polar && polar.segments[0].points.length).toBeGreaterThan(10);
  });

  it("parses parameter domains for parametric and polar graphs", () => {
    const parametric = parseGraphDescriptor("x=cos(t), y=sin(t), t=0..2*pi");
    const polar = parseGraphDescriptor("r=2*sin(theta), theta=0..pi");

    expect(parametric.kind).toBe("parametric");
    expect(parametric.kind === "parametric" ? parametric.range?.min : undefined).toBe(0);
    expect(parametric.kind === "parametric" ? parametric.range?.max : undefined).toBeCloseTo(2 * Math.PI);
    expect(polar.kind).toBe("polar");
    expect(polar.kind === "polar" ? polar.range?.max : undefined).toBeCloseTo(Math.PI);
  });
});
