import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Workspace3D from "../pages/Workspace3D";
import WorkspaceData from "../pages/WorkspaceData";
import WorkspaceGeometry from "../pages/WorkspaceGeometry";
import WorkspaceGraph from "../pages/WorkspaceGraph";
import WorkspaceTeach from "../pages/WorkspaceTeach";
import { protectedWorkspaceBaselines } from "./workspaceBaselineGuards";
import type { WorkspaceRouteHealth } from "./types/workspaceReleaseHealth";

function renderWorkspace(element: React.ReactElement) {
  const errors: unknown[] = [];
  const spy = vi.spyOn(console, "error").mockImplementation((...args) => {
    errors.push(args);
  });
  try {
    const html = renderToStaticMarkup(<MemoryRouter>{element}</MemoryRouter>);
    return { errors, html };
  } finally {
    spy.mockRestore();
  }
}

const routes: WorkspaceRouteHealth[] = [
  {
    routeId: "workspace-graph",
    routePath: "/workspace/graph",
    module: "graphing",
    status: "passed",
    checks: [
      { id: "heading", label: "Graph workspace heading", status: "passed" },
      { id: "controls", label: "Graph controls exist", status: "passed" },
    ],
  },
  {
    routeId: "workspace-geometry",
    routePath: "/workspace/geometry",
    module: "geometry",
    status: "passed",
    checks: [
      { id: "heading", label: "Geometry workspace heading", status: "passed" },
      { id: "board", label: "Geometry board exists", status: "passed" },
    ],
  },
  {
    routeId: "workspace-3d",
    routePath: "/workspace/3d",
    module: "three-d",
    status: "passed",
    checks: [
      { id: "heading", label: "3D workspace heading", status: "passed" },
      { id: "panels", label: "3D panels exist", status: "passed" },
    ],
  },
  {
    routeId: "workspace-data",
    routePath: "/workspace/data",
    module: "data-cas",
    status: "passed",
    checks: [
      { id: "heading", label: "Data workspace heading", status: "passed" },
      { id: "spreadsheet", label: "Spreadsheet controls exist", status: "passed" },
    ],
  },
  {
    routeId: "workspace-teach",
    routePath: "/workspace/teach",
    module: "teacher-studio",
    status: "passed",
    checks: [
      { id: "heading", label: "Teacher workspace heading", status: "passed" },
      { id: "guided", label: "Guided controls exist", status: "passed" },
    ],
  },
];

describe("workspace route smoke coverage", () => {
  it.each([
    ["graph", <WorkspaceGraph />, ["Graph, CAS", "Workspace command keyboard", "Results"]],
    ["geometry", <WorkspaceGeometry />, ["Geometry Constructor", "Current tool", "Object Properties"]],
    ["3d", <Workspace3D />, ["3D Graphing", "Controls", "3D Scene Objects"]],
    ["data", <WorkspaceData />, ["Data Workspace", "Spreadsheet", "Function Analysis"]],
    ["teach", <WorkspaceTeach />, ["Teacher", "Guided", "offline"]],
  ])("renders the %s workspace route without a blank shell", (_name, element, signals) => {
    const { errors, html } = renderWorkspace(element);

    expect(html.length).toBeGreaterThan(1000);
    for (const signal of signals) expect(html).toContain(signal);
    const fatalErrors = errors.filter((entry) => !String(entry).includes("useLayoutEffect does nothing on the server"));
    expect(fatalErrors).toHaveLength(0);
  });

  it("keeps route health contract entries actionable", () => {
    expect(routes).toHaveLength(5);
    expect(routes.every((route) => route.routePath.startsWith("/workspace"))).toBe(true);
    expect(routes.every((route) => route.checks.length >= 2)).toBe(true);
  });

  it("keeps protected workspace source signals present", () => {
    const mathWorkspace = readFileSync(new URL("../pages/MathWorkspace.tsx", import.meta.url), "utf8");
    const geometryCommandController = readFileSync(new URL("./geometryCommandController.ts", import.meta.url), "utf8");
    const geometryConstructionBuilder = readFileSync(new URL("./geometryConstructionBuilder.ts", import.meta.url), "utf8");
    const geometryAdvancedConstructionBuilder = readFileSync(new URL("./geometryAdvancedConstructionBuilder.ts", import.meta.url), "utf8");
    const geometryWorkspacePanel = readFileSync(new URL("../components/workspace/panels/GeometryWorkspacePanel.tsx", import.meta.url), "utf8");
    const source = `${mathWorkspace}\n${geometryCommandController}\n${geometryConstructionBuilder}\n${geometryAdvancedConstructionBuilder}\n${geometryWorkspacePanel}`;
    for (const baseline of protectedWorkspaceBaselines.filter((item) => ["workspace-geometry-2d", "workspace-3d"].includes(item.id))) {
      for (const signal of baseline.protectedSignals) expect(source).toContain(signal);
    }
  });
});
