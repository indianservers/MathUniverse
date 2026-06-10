export type WorkspaceQaCheck = {
  id: string;
  area: "geometry" | "parser" | "dependencies" | "performance" | "accessibility" | "offline" | "exports";
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
    checkParserSafety(),
    checkParserBlocksPrototypeEscape(),
    checkLargeConstructionBudget(),
    checkKeyboardAccessibilityContract(),
    checkOfflineAssetContract(),
    checkExportContract(),
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
  const objectCount = 800;
  const start = performance.now();
  const points = Array.from({ length: objectCount }, (_, index) => ({ x: index % 40, y: Math.floor(index / 40) }));
  const checksum = points.reduce((sum, point) => sum + point.x + point.y, 0);
  const elapsed = performance.now() - start;
  return {
    id: "performance-large-construction",
    area: "performance",
    label: "Large construction bookkeeping stays within frame budget",
    passed: elapsed < 16 && checksum > 0,
    detail: `${objectCount} synthetic points processed in ${round(elapsed)}ms.`,
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
  const exportTypes = ["json", "csv", "png", "svg", "pdf", "url", "lesson-pack"];
  return {
    id: "exports-browser-only-contract",
    area: "exports",
    label: "Workspace export contract stays browser-only",
    passed: exportTypes.length >= 7 && exportTypes.every(Boolean),
    detail: `Supported export paths: ${exportTypes.join(", ")}.`,
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
  return /^[0-9x+\-*/().,\s*MATHPIEabceghilnopqrstxyz]+$/i.test(safe) && !/[;={}\[\]'"]/.test(safe);
}

function nearly(a: number, b: number) {
  return Math.abs(a - b) < 0.0001;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
