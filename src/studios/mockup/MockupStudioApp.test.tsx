import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "./MockupStudioApp";

describe("MockupStudioApp", () => {
  it("renders geometry home and a nested lab", () => {
    const home = renderToString(<MemoryRouter initialEntries={["/geometry"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(home).toContain("Geometry Studio");
    expect(home).toContain("Explore by Topic");
    expect(home).toContain("/geometry/triangles");
    const lab = renderToString(<MemoryRouter initialEntries={["/geometry/circles"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(lab).toContain("Circles Lab");
    expect(lab).toContain("Power of a Point");
  });

  it("renders construction, polygons, and matrices labs with mockup tools", () => {
    const construction = renderToString(<MemoryRouter initialEntries={["/geometry/construction"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(construction).toContain("Construction Workspace");
    expect(construction).toContain("Live object tree");
    expect(construction).toContain("Perp. bisector of AB");
    const polygons = renderToString(<MemoryRouter initialEntries={["/geometry/polygons"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(polygons).toContain("Polygons Lab");
    expect(polygons).toContain("Build &amp; explore regular n-gons");
    expect(polygons).toContain("Apothem");
    const matrices = renderToString(<MemoryRouter initialEntries={["/linear-algebra/matrices"]}><MockupStudioApp studioId="linear-algebra" /></MemoryRouter>);
    expect(matrices).toContain("Matrices Lab");
    expect(matrices).toContain("Compute A × B");
    expect(matrices).toContain("Result C = A × B");
  });

  it("renders unit circle, AR, fractals, algorithms, and crypto chrome", () => {
    const unit = renderToString(<MemoryRouter initialEntries={["/trigonometry/unit-circle"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(unit).toContain("Unit Circle");
    expect(unit).toContain("Show reference triangle");
    expect(unit).toContain("Exact Trigonometric Values");
    expect(unit).toContain("msk-frac");
    const ar = renderToString(<MemoryRouter initialEntries={["/geometry/ar"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(ar).toContain("Geometry AR Lab");
    expect(ar).toContain("Pyramid volume");
    const trigAr = renderToString(<MemoryRouter initialEntries={["/trigonometry/ar"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(trigAr).toContain("Height h = d tan θ");
    const fractals = renderToString(<MemoryRouter initialEntries={["/complex-numbers/fractals"]}><MockupStudioApp studioId="complex-numbers" /></MemoryRouter>);
    expect(fractals).toContain("Mandelbrot set");
    expect(fractals).toContain("Julia set for c");
    const algo = renderToString(<MemoryRouter initialEntries={["/discrete-world/algorithms"]}><MockupStudioApp studioId="discrete" /></MemoryRouter>);
    expect(algo).toContain("MergeSort");
    expect(algo).toContain("O(n log n)");
    const crypto = renderToString(<MemoryRouter initialEntries={["/discrete-world/cryptography"]}><MockupStudioApp studioId="discrete" /></MemoryRouter>);
    expect(crypto).toContain("Key generation (RSA concept)");
    expect(crypto).toContain("n = p × q");
  });

  it("renders the Right Triangle Studio three-column lab", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/trigonometry/right-triangle"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(html).toContain("Right Triangle Studio");
    expect(html).toContain("Solve Triangle");
    expect(html).toContain("Triangle Inputs");
    expect(html).toContain("Trigonometric Ratios");
    expect(html).toContain("Pythagorean Check");
    expect(html).toContain("Similar Triangle");
    expect(html).toContain("3-4-5");
  });

  it("renders the redesigned Triangles Lab explorer", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/geometry/triangles"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(html).toContain("Triangles Lab");
    expect(html).toContain("Triangle Explorer");
    expect(html).toContain("Draggable triangle ABC");
  });
});
