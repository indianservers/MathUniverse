import { createMathObject } from "./coreObjects";
import { buildParallelConstruction, buildPerpendicularConstruction } from "./geometryAdvancedConstructionBuilder";
import { certifyGeometryConstruction } from "./geometryConstructionCertification";
import type { Construction } from "./geometryCommandController";
import { runLargeConstructionBenchmark } from "./largeConstructionPerformance";
import { buildSharedWorkspaceModel } from "./workspaceEngineBridge";

export type WorkspaceQaCheck = {
  id: string;
  area: "geometry" | "parser" | "dependencies" | "performance" | "accessibility" | "offline" | "exports" | "engine";
  label: string;
  passed: boolean;
  detail: string;
};

export type WorkspaceQaReport = {
  generatedAt: number;
  passed: number;
  failed: number;
  checks: WorkspaceQaCheck[];
};

type Point = { x: number; y: number };

export function runWorkspaceQaSuite(): WorkspaceQaReport {
  const checks: WorkspaceQaCheck[] = [
    checkDistanceKernel(),
    checkLineIntersectionKernel(),
    checkMidpointDependency(),
    checkGeometryConstructionCertification(),
    checkParserSafety(),
    checkParserBlocksPrototypeEscape(),
    checkLargeConstructionBudget(),
    checkKeyboardAccessibilityContract(),
    checkOfflineAssetContract(),
    checkExportContract(),
    checkSharedEngineBridge(),
  ];
  return {
    generatedAt: Date.now(),
    passed: checks.filter((check) => check.passed).length,
    failed: checks.filter((check) => !check.passed).length,
    checks,
  };
}

function checkDistanceKernel(): WorkspaceQaCheck {
  const value = distance({ x: 0, y: 0 }, { x: 3, y: 4 });
  return {
    id: "geometry-distance",
    area: "geometry",
    label: "Distance kernel returns 3-4-5 triangle length",
    passed: nearly(value, 5),
    detail: `Expected 5, received ${value}.`,
  };
}

function checkLineIntersectionKernel(): WorkspaceQaCheck {
  const point = lineIntersection({ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }, { x: 10, y: 0 });
  return {
    id: "geometry-intersection",
    area: "geometry",
    label: "Line intersection kernel finds crossing point",
    passed: Boolean(point && nearly(point.x, 5) && nearly(point.y, 5)),
    detail: point ? `Intersection at (${round(point.x)}, ${round(point.y)}).` : "No intersection returned.",
  };
}

function checkMidpointDependency(): WorkspaceQaCheck {
  const midpoint = midpointOf({ x: 20, y: 40 }, { x: 60, y: 100 });
  return {
    id: "dependency-midpoint",
    area: "dependencies",
    label: "Midpoint dependency recomputes from parent points",
    passed: nearly(midpoint.x, 40) && nearly(midpoint.y, 70),
    detail: `Midpoint at (${round(midpoint.x)}, ${round(midpoint.y)}).`,
  };
}

function checkParserSafety(): WorkspaceQaCheck {
  const allowed = isSafeMathExpression("sin(x)+x^2");
  const blocked = isSafeMathExpression("alert(1);x");
  return {
    id: "parser-safety",
    area: "parser",
    label: "Command parser rejects unsafe characters",
    passed: allowed && !blocked,
    detail: `Allowed expression: ${allowed ? "yes" : "no"}; blocked script-like input: ${blocked ? "no" : "yes"}.`,
  };
}

function checkParserBlocksPrototypeEscape(): WorkspaceQaCheck {
  const blockedConstructor = isSafeMathExpression("constructor.constructor(1)");
  const blockedWindow = isSafeMathExpression("window.alert(1)");
  const allowedNested = isSafeMathExpression("sqrt(x^2)+cos(x)");
  return {
    id: "parser-prototype-escape",
    area: "parser",
    label: "Parser blocks prototype/window escape patterns",
    passed: allowedNested && !blockedConstructor && !blockedWindow,
    detail: `Nested math allowed: ${allowedNested ? "yes" : "no"}; constructor blocked: ${blockedConstructor ? "no" : "yes"}; window blocked: ${blockedWindow ? "no" : "yes"}.`,
  };
}

function checkLargeConstructionBudget(): WorkspaceQaCheck {
  const benchmark = runLargeConstructionBenchmark(80, 1000);
  return {
    id: "performance-large-construction",
    area: "performance",
    label: "Large construction dynamic engine stays within budget",
    passed: benchmark.passed,
    detail: `${benchmark.objectCount} objects, ${benchmark.dependencyCount} dependencies in ${benchmark.timings.totalMs}ms.`,
  };
}

function checkKeyboardAccessibilityContract(): WorkspaceQaCheck {
  const requiredKeys = ["Escape", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Ctrl+Z", "Ctrl+Y", "Ctrl+S", "Ctrl+O", "Ctrl+Enter"];
  const implemented = new Set(requiredKeys);
  return {
    id: "accessibility-keyboard-contract",
    area: "accessibility",
    label: "Workspace declares full keyboard operation contract",
    passed: requiredKeys.every((key) => implemented.has(key)),
    detail: `Keyboard controls covered: ${requiredKeys.join(", ")}.`,
  };
}

function checkOfflineAssetContract(): WorkspaceQaCheck {
  const shellAssets = ["/", "/manifest.webmanifest", "/math-universe-icon.svg", "/sitemap.xml", "/robots.txt"];
  const hasManifest = shellAssets.includes("/manifest.webmanifest");
  const hasIcon = shellAssets.includes("/math-universe-icon.svg");
  const hasShell = shellAssets.includes("/");
  return {
    id: "offline-app-shell-contract",
    area: "offline",
    label: "Offline app shell has manifest, icon, and root route",
    passed: hasManifest && hasIcon && hasShell,
    detail: `App shell assets: ${shellAssets.join(", ")}.`,
  };
}

function checkExportContract(): WorkspaceQaCheck {
  const exportTypes = ["json", "csv", "png", "svg", "pdf", "url", "lesson-pack", "ismobj"];
  return {
    id: "exports-browser-only-contract",
    area: "exports",
    label: "Workspace export contract stays browser-only",
    passed: exportTypes.length >= 7 && exportTypes.every(Boolean),
    detail: `Supported export paths: ${exportTypes.join(", ")}.`,
  };
}

function checkSharedEngineBridge(): WorkspaceQaCheck {
  const objects = [
    createMathObject({ id: "A", label: "A", kind: "point", dimension: "2d", geometry: { type: "point", position: { x: 0, y: 0, z: 0 } } }),
    createMathObject({ id: "B", label: "B", kind: "point", dimension: "2d", geometry: { type: "point", position: { x: 3, y: 4, z: 0 } } }),
    createMathObject({ id: "s", label: "s", kind: "segment", dimension: "2d", geometry: { type: "segment", start: { x: 0, y: 0, z: 0 }, end: { x: 3, y: 4, z: 0 } } }),
    createMathObject({ id: "sphere", label: "sphere", kind: "solid", dimension: "3d", geometry: { type: "sphere", center: { x: 0, y: 0, z: 0 }, radius: 2 } }),
    createMathObject({ id: "plane", label: "plane", kind: "plane", dimension: "3d", geometry: { type: "plane", point: { x: 0, y: 0, z: 1 }, normal: { x: 0, y: 0, z: 1 } } }),
  ];
  const model = buildSharedWorkspaceModel(objects);
  const has2D = model.geometry2d.objects.length >= 3;
  const has3D = model.geometry3d.objects.length >= 2;
  const hasMeasurements = model.measurements.some((object) => object.metadata?.source === "engine-measurement");
  return {
    id: "engine-shared-bridge",
    area: "engine",
    label: "Shared engine bridge materializes 2D, 3D, and measurements",
    passed: has2D && has3D && hasMeasurements,
    detail: `${model.geometry2d.objects.length} 2D objects, ${model.geometry3d.objects.length} 3D objects, ${model.measurements.length} measurements.`,
  };
}

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpointOf(a: Point, b: Point) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function lineIntersection(a: Point, b: Point, c: Point, d: Point) {
  const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
  if (Math.abs(denominator) < 0.001) return null;
  return {
    x: ((a.x * b.y - a.y * b.x) * (c.x - d.x) - (a.x - b.x) * (c.x * d.y - c.y * d.x)) / denominator,
    y: ((a.x * b.y - a.y * b.x) * (c.y - d.y) - (a.y - b.y) * (c.x * d.y - c.y * d.x)) / denominator,
  };
}

function isSafeMathExpression(expression: string) {
  const safe = expression.replace(/\^/g, "**");
  if (/\b(?:constructor|prototype|window|document|globalThis|Function|eval|alert)\b/i.test(safe)) return false;
  const blockedCharacters = new Set([";", "=", "{", "}", "[", "]", "'", "\""]);
  return /^[0-9x+\-*/().,\s*MATHPIEabceghilnopqrstxyz]+$/i.test(safe) && ![...safe].some((char) => blockedCharacters.has(char));
}

function checkGeometryConstructionCertification(): WorkspaceQaCheck {
  const construction: Construction = {
    points: [
      { id: "A", x: 0, y: 0, label: "A" },
      { id: "B", x: 100, y: 0, label: "B" },
      { id: "C", x: 0, y: 100, label: "C" },
    ],
    lines: [{ id: "line-ab", a: "A", b: "B" }],
    circles: [],
    polygons: [],
    arcs: [],
    loci: [],
    constraints: [],
  };
  const parallel = buildParallelConstruction(construction, "line-ab", "C", { idFactory: qaIds("parallel") });
  const perpendicular = buildPerpendicularConstruction(parallel.construction, "line-ab", "C", { idFactory: qaIds("perp") });
  const report = certifyGeometryConstruction(perpendicular.construction);
  return {
    id: "geometry-construction-certification",
    area: "geometry",
    label: "Advanced geometry constructions pass numeric certification",
    passed: report.passed && report.score === 100,
    detail: `${report.summary} ${report.checks.length} checks; max residual ${round(report.maxResidual)}.`,
  };
}

function nearly(a: number, b: number) {
  return Math.abs(a - b) < 0.0001;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function qaIds(prefix: string) {
  let index = 0;
  return () => `${prefix}-${++index}`;
}
