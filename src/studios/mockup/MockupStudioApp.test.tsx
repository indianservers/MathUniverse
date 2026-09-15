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
    expect(home).toContain("Start with Triangles");
    expect(home).toContain("0 of 9 labs started");
    expect(home).not.toContain("Needs camera");
    expect(home).toContain("Opens 2D/3D explorer");
    const trig = renderToString(<MemoryRouter initialEntries={["/trigonometry"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(trig).toContain("Explore Key Topics");
    expect(trig).toContain("studio-home-btns");
    expect(trig).toContain("Studio Home");
    expect(trig).toContain("msk-trig-flow");
    expect(trig).toContain("Identities");
    expect(trig).toContain("Open unit circle");
    expect(trig).toContain("Drag the ray");
    const lin = renderToString(<MemoryRouter initialEntries={["/linear-algebra"]}><MockupStudioApp studioId="linear-algebra" /></MemoryRouter>);
    expect(lin).toContain("Open lab");
    expect(lin).toContain("Eigen");
    expect(lin).toContain("Start here");
    expect(lin).toContain("Dot · Cross · Projections");
    const cx = renderToString(<MemoryRouter initialEntries={["/complex-numbers"]}><MockupStudioApp studioId="complex-numbers" /></MemoryRouter>);
    expect(cx).toContain("Start here");
    expect(cx).toContain("Plot · Modulus · Argument");
    expect(cx).toContain('data-studio-home="complex-numbers"');
    expect(cx).toContain("Continue Experiment");
    expect(cx).toContain("View all topics");
    expect(cx).toContain("COMPLEX");
    const disc = renderToString(<MemoryRouter initialEntries={["/discrete-world"]}><MockupStudioApp studioId="discrete" /></MemoryRouter>);
    expect(disc).toContain("Start here");
    expect(disc).toContain("Integers · Fractions · Decimals");
    const stats = renderToString(<MemoryRouter initialEntries={["/probability-statistics"]}><MockupStudioApp studioId="statistics" /></MemoryRouter>);
    expect(stats).toContain("Start here");
    expect(stats).toContain("Overview · Pairwise");
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
    expect(unit).toContain("studio-canvas-tools");
    expect(unit).toContain("msk-units-deg");
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
    const argand = renderToString(<MemoryRouter initialEntries={["/complex-numbers/argand-plane"]}><MockupStudioApp studioId="complex-numbers" /></MemoryRouter>);
    expect(argand).toContain("ARGAND PLANE");
    expect(argand).toContain(">Re</text>");
    expect(argand).toContain(">Im</text>");
    expect(argand).toContain('data-cx-mode="Plot"');
    const fractals = renderToString(<MemoryRouter initialEntries={["/complex-numbers/fractals"]}><MockupStudioApp studioId="complex-numbers" /></MemoryRouter>);
    expect(fractals).toContain("Mandelbrot set");
    expect(fractals).toContain("Julia set for c");
    expect(fractals).toContain("MANDELBROT");
    const algo = renderToString(<MemoryRouter initialEntries={["/discrete-world/algorithms"]}><MockupStudioApp studioId="discrete" /></MemoryRouter>);
    expect(algo).toContain("MergeSort");
    expect(algo).toContain("O(n log n)");
    const crypto = renderToString(<MemoryRouter initialEntries={["/discrete-world/cryptography?mode=RSA+Concept"]}><MockupStudioApp studioId="discrete" /></MemoryRouter>);
    expect(crypto).toContain("Key generation (RSA concept)");
    expect(crypto).toContain("n = p × q");
    const modular = renderToString(<MemoryRouter initialEntries={["/discrete-world/modular-arithmetic?mode=Inverses"]}><MockupStudioApp studioId="discrete" /></MemoryRouter>);
    expect(modular).toContain("inverse exists iff");
    expect(modular).toContain("data-mode-canvas");
    const sat = renderToString(<MemoryRouter initialEntries={["/discrete-world/logic?mode=SAT"]}><MockupStudioApp studioId="discrete" /></MemoryRouter>);
    expect(sat).toContain("SAT witness");
    expect(sat).toContain("CNF");
    const discHome = renderToString(<MemoryRouter initialEntries={["/discrete-world"]}><MockupStudioApp studioId="discrete" /></MemoryRouter>);
    expect(discHome).toContain("Opt-in figure snapshots");
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
    expect(transforms).toContain("Drag the A and D handles on the graph");
    expect(transforms).toContain(">A</text>");
    const compare = renderToString(<MemoryRouter initialEntries={["/trigonometry/graphs?mode=Comparison"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(compare).toContain('data-tg-mode="Comparison"');
    expect(compare).toContain("Compare the three graphs");
  });

  it("wires trigonometry home chrome, remaining lab modes, and path map", () => {
    const home = renderToString(<MemoryRouter initialEntries={["/trigonometry"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(home).toContain("Site home");
    expect(home).not.toContain(">Main<");
    expect(home).toContain(" › ");
    expect(home).toContain("Start here");
    expect(home).toContain("Applications");
    expect(home).not.toContain(">AR Lab<");
    expect(home).toContain("Angles · Unit Circle · Quadrants");
    expect(home).not.toContain("0 XP");
    expect(home).toContain("placeholder=\"1 or √2/2\"");
    expect(home).not.toContain("Class ");
    expect(home).toContain("Daily visual challenge");
    const identities = renderToString(<MemoryRouter initialEntries={["/trigonometry/identities?mode=Double+Angle"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(identities).toContain('data-id-mode="Double Angle"');
    expect(identities).toContain("sin 2θ");
    expect(identities).toContain("gold ray is 2θ");
    expect(identities).toContain("sin(2×45°)");
    const inverse = renderToString(<MemoryRouter initialEntries={["/trigonometry/inverse?mode=Compositions"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(inverse).toContain('data-inv-mode="Compositions"');
    expect(inverse).toContain("arcsin(sin");
    expect(inverse).not.toContain("msk-mode-ribbon");
    const apps = renderToString(<MemoryRouter initialEntries={["/trigonometry/applications?mode=Bearings"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(apps).toContain('data-app-mode="Bearings"');
    expect(apps).toContain("from north");
    const ar = renderToString(<MemoryRouter initialEntries={["/trigonometry/ar?mode=Wave+Projection"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(ar).toContain('data-ar-mode="Wave Projection"');
    expect(ar).toContain("WAVE OVERLAY");
  });

  it("renders mathematical modelling home and interactive labs", () => {
    const home = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(home).toContain("Mathematical Modelling Studio");
    expect(home).toContain("Explore modelling domains");
    expect(home).toContain("Popular scenarios &amp; datasets");
    expect(home).toContain("Epidemic Spread in Campus");
    expect(home).toContain("Optimize the Route");
    expect(home).toContain("Launch →");
    expect(home).toContain("Start here");
    expect(home).toContain("Projectile · Vehicle · Pursuit");
    expect(home).toContain("10 min");
    expect(home).toContain(">Main<");
    expect(home).not.toContain("Teacher mode");
    const motion = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling/motion"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(motion).toContain("Motion Modelling Lab");
    expect(motion).toContain("Model A ignores drag");
    const epidemics = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling/epidemics"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(epidemics).toContain("Compartment flow");
    const networks = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling/networks"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(networks).toContain("Dijkstra");
    const numerical = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling/numerical"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(numerical).toContain("Monte Carlo");
    const population = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling/population"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(population).toContain("Carrying capacity");
    const finance = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling/finance"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(finance).toContain("Future value");
    const optimization = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling/optimization"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(optimization).toContain("Feasible region");
    const regression = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling/regression"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(regression).toContain("Scatter &amp; fit");
    const periodic = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling/periodic"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(periodic).toContain("Tide time series");
    const comparison = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling/comparison"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(comparison).toContain("Quadratic");
  });

  it("renders unique canvases for transformation and proof modes", () => {
    const rotate = renderToString(<MemoryRouter initialEntries={["/geometry/transformations?mode=Rotate"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(rotate).toContain('data-lab-mode="Rotate"');
    expect(rotate).toContain('data-mode-canvas="Rotate"');
    const reflect = renderToString(<MemoryRouter initialEntries={["/geometry/transformations?mode=Reflect"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(reflect).toContain('data-mode-canvas="Reflect"');
    const angle = renderToString(<MemoryRouter initialEntries={["/geometry/proofs?mode=Angle+Sum"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(angle).toContain("Angle Sum");
    expect(angle).toContain("∠A+∠B+∠C = 180°");
    const inverse = renderToString(<MemoryRouter initialEntries={["/trigonometry/inverse?mode=Arccos"]}><MockupStudioApp studioId="trigonometry" /></MemoryRouter>);
    expect(inverse).toContain('data-lab-mode="Arccos"');
    expect(inverse).toContain('data-mode-canvas="Arccos"');
    const fractions = renderToString(<MemoryRouter initialEntries={["/discrete-world/number-sense?mode=Fractions"]}><MockupStudioApp studioId="discrete" /></MemoryRouter>);
    expect(fractions).toContain('data-mode-canvas="Fractions"');
    expect(fractions).toContain("Which is larger, 3/5 or 2/3?");
  });

  it("renders triangles explorer chrome", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/geometry/triangles"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(html).toContain("Triangles Lab");
    expect(html).toContain("Triangle Explorer");
    expect(html).toContain("Draggable triangle ABC");
  });

  it("marks every mockup lab mode on the banner and canvas", () => {
    const samples: Array<[string, string, string]> = [
      ["linear-algebra", "/linear-algebra/determinants?mode=3D+Volume", "3D Volume"],
      ["linear-algebra", "/linear-algebra/matrices?mode=Inverse", "Inverse"],
      ["complex-numbers", "/complex-numbers/roots?mode=nth+Roots", "nth Roots"],
      ["modelling", "/mathematical-modelling/motion?mode=Drag", "Drag"],
      ["discrete", "/discrete-world/logic?mode=Truth+Table", "Truth Table"],
      ["statistics", "/probability-statistics/hypothesis?mode=Proportion", "Proportion"],
      ["trigonometry", "/trigonometry/applications?mode=Bearings", "Bearings"],
    ];
    for (const [studioId, path, mode] of samples) {
      const html = renderToString(<MemoryRouter initialEntries={[path]}><MockupStudioApp studioId={studioId} /></MemoryRouter>);
      expect(html).toContain(`data-lab-mode="${mode}"`);
      expect(html).toContain(`data-mode-canvas="${mode}"`);
    }
  });
});
