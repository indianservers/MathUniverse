import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MathWorkspacesHomeSection } from "../components/workspace/MathWorkspaceNavigation";
import { navSections } from "../components/layout/navItems";
import { mathWorkspaces } from "../workspace/mathWorkspaces";
import MathLab3DGraphing from "./MathLab3DGraphing";
import MathLabGraphingCalculator from "./MathLabGraphingCalculator";
import { buildExactGraphAnalysis } from "../graph-studio/exactGraphAnalysis";
import { fitGraphView, zoomGraphView } from "../graph-studio/graphViewUtils";

describe("Math Workspaces discovery", () => {
  it("groups the six connected studios on Home and in navigation", () => {
    const html = renderToStaticMarkup(<MemoryRouter><MathWorkspacesHomeSection /></MemoryRouter>);
    const navigation = navSections.find((section) => section.title === "Math Workspaces");
    const navigationItems = navigation?.items.flatMap((item) => item.children ?? []);

    expect(mathWorkspaces).toHaveLength(6);
    expect(navigation?.items).toHaveLength(3);
    for (const title of ["CAS", "2D Geometry", "3D Geometry", "2D Graph", "3D Graph", "Shapes Explorer"]) {
      expect(html).toContain(title);
      expect(navigationItems?.some((item) => item.title === title)).toBe(true);
    }
  });
});

describe("graphing workspaces", () => {
  it("zooms the 2D view around its center", () => {
    const view = { xMin: -10, xMax: 10, yMin: -5, yMax: 15 };

    expect(zoomGraphView(view, 0.8)).toEqual({ xMin: -8, xMax: 8, yMin: -3, yMax: 13 });
    expect(zoomGraphView(view, 1.25)).toEqual({ xMin: -12.5, xMax: 12.5, yMin: -7.5, yMax: 17.5 });
  });

  it("fits visible graph data and derives exact analysis when available", () => {
    const fitted = fitGraphView([{ visible: true, points: [{ x: 2, y: 3, valid: true }, { x: 4, y: 7, valid: true }] }], { xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
    const exact = buildExactGraphAnalysis("x^2 - 4", -2, 2);

    expect(fitted.xMin).toBeLessThan(2);
    expect(fitted.xMax).toBeGreaterThan(4);
    expect(fitted.yMin).toBeLessThan(3);
    expect(fitted.yMax).toBeGreaterThan(7);
    expect(exact.roots).toContain("-2");
    expect(exact.roots).toContain("2");
    expect(exact.yIntercept).toBe("-4");
    expect(exact.integral).toBe("-32/3");
  });

  it("renders the completed 2D graph controls and canonical examples", () => {
    const html = renderToStaticMarkup(<MemoryRouter><MathLabGraphingCalculator /></MemoryRouter>);

    expect(html).toContain("Expressions &amp; Layers");
    expect(html).toContain("x^2 + y^2 = 25");
    expect(html).toContain("(2, 3)");
    expect(html).toContain("Derivative");
    expect(html).toContain("Shade integral");
    expect(html).toContain("Function table");
    expect(html).toContain("Data &amp; regression");
    expect(html).toContain("Expression templates");
    expect(html).toContain("Parameters &amp; animation");
    expect(html).toContain("Advanced graph families");
    expect(html).toContain("Sequence");
    expect(html).toContain("Vector field");
    expect(html).toContain("Slope field");
    expect(html).toContain("Visible range");
    expect(html).toContain("Find intersections");
    expect(html).toContain("Graph Studio 2D");
    expect(html).toContain("Build");
    expect(html).toContain("Analyze");
    expect(html).toContain("Learn");
    expect(html).toContain('aria-label="Zoom in"');
    expect(html).toContain('aria-label="Zoom out"');
    expect(html).toContain('aria-label="Fit visible graphs"');
    expect(html).toContain('aria-label="Reset to default window"');
    expect(html).toContain('aria-label="View graph full screen"');
    expect(html).toContain("Exact &amp; numerical");
    expect(html).toContain("Use plus and minus to zoom");
    expect(html).not.toContain("Animate");
    expect(html).toContain("Offline ready");
  });

  it("renders multi-surface, slice, opacity, solid, save, and camera controls in 3D", () => {
    const html = renderToStaticMarkup(<MemoryRouter><MathLab3DGraphing /></MemoryRouter>);

    expect(html).toContain("Graph Studio 3D");
    expect(html).toContain("Expressions &amp; Layers");
    expect(html).toContain("Surface Inspector");
    expect(html).toContain("Cross-section");
    expect(html).toContain("Timeline");
    expect(html).toContain("Build");
    expect(html).toContain("Analyze");
    expect(html).toContain("Animate");
    expect(html).toContain("Learn");
    expect(html).toContain("Export");
    expect(html).toContain("Offline ready");
  });
});
