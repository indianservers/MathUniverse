import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MathWorkspacesHomeSection } from "../components/workspace/MathWorkspaceNavigation";
import { navSections } from "../components/layout/navItems";
import { mathWorkspaces } from "../workspace/mathWorkspaces";
import MathLab3DGraphing from "./MathLab3DGraphing";
import MathLabGraphingCalculator from "./MathLabGraphingCalculator";

describe("Math Workspaces discovery", () => {
  it("groups the six connected studios on Home and in navigation", () => {
    const html = renderToStaticMarkup(<MemoryRouter><MathWorkspacesHomeSection /></MemoryRouter>);
    const navigation = navSections.find((section) => section.title === "Math Workspaces");
    const navigationItems = navigation?.items.flatMap((item) => item.children ?? []);

    expect(mathWorkspaces).toHaveLength(6);
    expect(navigation?.items).toHaveLength(3);
    for (const title of ["CAS", "2D Geometry", "3D Geometry", "Graphs", "3D Graphs", "Shapes Explorer"]) {
      expect(html).toContain(title);
      expect(navigationItems?.some((item) => item.title === title)).toBe(true);
    }
  });
});

describe("graphing workspaces", () => {
  it("renders the completed 2D graph controls and canonical examples", () => {
    const html = renderToStaticMarkup(<MemoryRouter><MathLabGraphingCalculator /></MemoryRouter>);

    expect(html).toContain("Expressions &amp; Layers");
    expect(html).toContain("x^2 + y^2 = 25");
    expect(html).toContain("(2, 3)");
    expect(html).toContain("Derivative");
    expect(html).toContain("Shade integral");
    expect(html).toContain("Table of values");
    expect(html).toContain("Visible range");
    expect(html).toContain("Find intersections");
    expect(html).toContain("Graph Studio 2D");
    expect(html).toContain("Build");
    expect(html).toContain("Analyze");
    expect(html).toContain("Animate");
    expect(html).toContain("Learn");
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
