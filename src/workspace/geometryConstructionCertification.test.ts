import { describe, expect, it } from "vitest";
import {
  buildCompassCopyConstruction,
  buildIntersectionConstruction,
  buildMidpointConstruction,
  buildParallelConstruction,
  buildPerpendicularConstruction,
  buildRegularPolygonConstruction,
} from "./geometryAdvancedConstructionBuilder";
import { buildGeometryVisualQaContract, certifyGeometryConstruction } from "./geometryConstructionCertification";
import type { Construction } from "./geometryCommandController";
import type { GeometryIdFactory } from "./geometryConstructionBuilder";

const baseConstruction: Construction = {
  points: [
    { id: "A", x: 0, y: 0, label: "A" },
    { id: "B", x: 100, y: 0, label: "B" },
    { id: "C", x: 0, y: 100, label: "C" },
    { id: "D", x: 100, y: 100, label: "D" },
  ],
  lines: [
    { id: "line-ab", a: "A", b: "B" },
    { id: "line-ac", a: "A", b: "C" },
    { id: "line-ad", a: "A", b: "D" },
    { id: "line-bc", a: "B", b: "C" },
  ],
  circles: [{ id: "circle-a-b", center: "A", edge: "B" }],
  polygons: [],
  arcs: [],
  loci: [],
  constraints: [],
};

function cloneConstruction() {
  return structuredClone(baseConstruction);
}

function ids(prefix: string): GeometryIdFactory {
  let index = 0;
  return () => `${prefix}-${++index}`;
}

describe("geometry construction certification", () => {
  it("certifies midpoint, parallel, perpendicular, and intersection constraints from builder output", () => {
    const midpoint = buildMidpointConstruction(cloneConstruction(), ["A", "B"], { idFactory: ids("mid") });
    const parallel = buildParallelConstruction(midpoint.construction, "line-ab", "C", { idFactory: ids("parallel") });
    const perpendicular = buildPerpendicularConstruction(parallel.construction, "line-ab", "C", { idFactory: ids("perp") });
    const intersection = buildIntersectionConstruction(perpendicular.construction, "line-ad", "line-bc", { firstType: "line", secondType: "line", idFactory: ids("hit") });

    const report = certifyGeometryConstruction(intersection.construction);

    expect(report.passed).toBe(true);
    expect(report.score).toBe(100);
    expect(report.summary).toBe("Geometry accuracy certified.");
    expect(report.checks.some((check) => check.kind === "midpoint" && check.severity === "pass")).toBe(true);
    expect(report.checks.some((check) => check.kind === "parallel" && check.severity === "pass")).toBe(true);
    expect(report.checks.some((check) => check.kind === "perpendicular" && check.severity === "pass")).toBe(true);
    expect(report.checks.filter((check) => check.kind === "intersection")).toHaveLength(2);
  });

  it("certifies point-on-circle and fixed-length style invariants", () => {
    const compass = buildCompassCopyConstruction(cloneConstruction(), "A", "B", "C", { idFactory: ids("compass") });
    const copiedCircle = compass.construction.circles.at(-1);
    const edge = compass.construction.points.at(-1);
    const construction: Construction = {
      ...compass.construction,
      constraints: copiedCircle && edge
        ? [
          ...compass.construction.constraints,
          { id: "edge-on-copied-circle", type: "on-circle", point: edge.id, circle: copiedCircle.id },
          { id: "copied-radius", type: "fixed-length", anchor: copiedCircle.center, point: edge.id, length: 100 },
        ]
        : compass.construction.constraints,
    };

    const report = certifyGeometryConstruction(construction);

    expect(report.passed).toBe(true);
    expect(report.checks.some((check) => check.kind === "on-circle" && check.severity === "pass")).toBe(true);
    expect(report.checks.some((check) => check.kind === "fixed-length" && check.severity === "pass")).toBe(true);
  });

  it("certifies regular polygon side and angle invariants when requested", () => {
    const result = buildRegularPolygonConstruction(cloneConstruction(), ["A", "B"], 6, { idFactory: ids("hex") });
    const polygonId = result.construction.polygons.at(-1)?.id;

    const report = certifyGeometryConstruction(result.construction, { regularPolygonIds: polygonId ? [polygonId] : [] });

    expect(report.passed).toBe(true);
    expect(report.checks.some((check) => check.id.endsWith(":sides") && check.severity === "pass")).toBe(true);
    expect(report.checks.some((check) => check.id.endsWith(":angles") && check.severity === "pass")).toBe(true);
  });

  it("fails loudly when a construction drifts away from its constraint", () => {
    const result = buildMidpointConstruction(cloneConstruction(), ["A", "B"], { idFactory: ids("mid") });
    const midpointId = result.construction.points.at(-1)?.id;
    const broken: Construction = {
      ...result.construction,
      points: result.construction.points.map((point) => point.id === midpointId ? { ...point, x: point.x + 9 } : point),
    };

    const report = certifyGeometryConstruction(broken);

    expect(report.passed).toBe(false);
    expect(report.score).toBeLessThan(100);
    expect(report.summary).toContain("failed");
    expect(report.checks.find((check) => check.kind === "midpoint")?.severity).toBe("fail");
  });

  it("declares the browser visual QA contract for geometry certification", () => {
    const contract = buildGeometryVisualQaContract();

    expect(contract.route).toBe("/workspace/geometry");
    expect(contract.selectors).toContain("workspace-geometry-board");
    expect(contract.pixelChecks).toContain("Board SVG is nonblank after first paint.");
    expect(contract.accuracyChecks.join(" ")).toContain("certifyGeometryConstruction");
  });
});
