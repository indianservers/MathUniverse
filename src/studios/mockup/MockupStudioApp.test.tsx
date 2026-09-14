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
    expect(unit).toContain('data-uc-mode="Angles"');
    expect(unit).toContain("msk-frac");
    const exact = renderToString(<MemoryRouter initialEntries={["/trigonometry/unit-circle?mode=Exact+Values"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(exact).toContain('data-uc-mode="Exact Values"');
    expect(exact).toContain("Special angles");
    expect(exact).toContain("Snap θ to a special angle");
    const quadrants = renderToString(<MemoryRouter initialEntries={["/trigonometry/unit-circle?mode=Quadrants"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(quadrants).toContain('data-uc-mode="Quadrants"');
    expect(quadrants).toContain("Current quadrant:");
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
    expect(html).toContain('data-rt-mode="Solve Triangle"');
    expect(html).toContain("Triangle Inputs");
    expect(html).toContain("Trigonometric Ratios");
    expect(html).toContain("Pythagorean Check");
    expect(html).toContain("Similar Triangle");
    expect(html).toContain("3-4-5");
    const ratios = renderToString(<MemoryRouter initialEntries={["/trigonometry/right-triangle?mode=Ratios"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(ratios).toContain('data-rt-mode="Ratios"');
    expect(ratios).toContain("SOH-CAH-TOA");
    expect(ratios).toContain("Ratio inputs");
    const pythagoras = renderToString(<MemoryRouter initialEntries={["/trigonometry/right-triangle?mode=Pythagoras"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(pythagoras).toContain('data-rt-mode="Pythagoras"');
    expect(pythagoras).toContain("Side lengths");
    expect(pythagoras).toContain("The squares on the sides");
    const similarity = renderToString(<MemoryRouter initialEntries={["/trigonometry/right-triangle?mode=Similarity"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(similarity).toContain('data-rt-mode="Similarity"');
    expect(similarity).toContain("Corresponding sides");
    const special = renderToString(<MemoryRouter initialEntries={["/trigonometry/right-triangle?mode=Special+Triangles"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(special).toContain('data-rt-mode="Special Triangles"');
    expect(special).toContain("Special right triangles");
  });

  it("switches trigonometric graph studio modes from the URL", () => {
    const sine = renderToString(<MemoryRouter initialEntries={["/trigonometry/graphs"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(sine).toContain("Trigonometric Functions");
    expect(sine).toContain('data-tg-mode="Sine"');
    expect(sine).toContain("Sine graph");
    const cosine = renderToString(<MemoryRouter initialEntries={["/trigonometry/graphs?mode=Cosine"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(cosine).toContain('data-tg-mode="Cosine"');
    expect(cosine).toContain("Cosine graph");
    expect(cosine).toContain("cos x = sin(x + π/2)");
    const tangent = renderToString(<MemoryRouter initialEntries={["/trigonometry/graphs?mode=Tangent"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(tangent).toContain('data-tg-mode="Tangent"');
    expect(tangent).toContain("Tangent graph");
    const transforms = renderToString(<MemoryRouter initialEntries={["/trigonometry/graphs?mode=Transformations"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(transforms).toContain('data-tg-mode="Transformations"');
    expect(transforms).toContain("Transform the parent");
    const compare = renderToString(<MemoryRouter initialEntries={["/trigonometry/graphs?mode=Comparison"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(compare).toContain('data-tg-mode="Comparison"');
    expect(compare).toContain("Compare the three graphs");
  });

  it("renders the redesigned Triangles Lab explorer", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/geometry/triangles"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(html).toContain("Triangles Lab");
    expect(html).toContain("Triangle Explorer");
    expect(html).toContain("Draggable triangle ABC");
  });
});
