export type ReleaseHealthInput = {
  plots: number;
  results: number;
  objectCount?: number;
  undoableActions?: number;
  redoActions?: number;
  algebraLinks?: number;
  geometryObjects: number;
  geometryToolCount?: number;
  spaceObjects: number;
  selectedSpaceObject?: boolean;
  lessonSteps: number;
  teachingMode?: boolean;
  animationSnapshots: number;
  simulationsReady?: boolean;
  importExportReady: boolean;
  shareReady?: boolean;
  offlineReady?: boolean;
  qaReady?: boolean;
  performanceReady?: boolean;
  accessibilityReady?: boolean;
  syllabusReady?: boolean;
  differentiatorCount?: number;
};

export type ReleaseHealth = {
  score: number;
  status: "needs-work" | "good" | "release-ready";
  checks: ReleaseCheck[];
};

export type ReleaseCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  group: "foundation" | "construction" | "teaching" | "production" | "beyond-geogebra";
  action: string;
};

export function computeReleaseHealth(input: ReleaseHealthInput): ReleaseHealth {
  const checks: ReleaseCheck[] = [
    {
      id: "object-model-history",
      group: "foundation",
      label: "Object model and undo/redo",
      passed: (input.objectCount ?? 0) >= 12 && (input.undoableActions ?? 0) > 0,
      detail: `${input.objectCount ?? 0} objects, ${input.undoableActions ?? 0} undoable action(s), ${input.redoActions ?? 0} redo item(s)`,
      action: "Create or edit objects through the inspector/object list so the timeline has recoverable entries.",
    },
    {
      id: "geometry-tools",
      group: "construction",
      label: "GeoGebra-like 2D construction",
      passed: input.geometryObjects > 0 && (input.geometryToolCount ?? 0) >= 30,
      detail: `${input.geometryObjects} construction object(s), ${input.geometryToolCount ?? 0} 2D tool(s)`,
      action: "Load a geometry template or construct points, lines, circles, polygons, measurements, and transforms.",
    },
    {
      id: "space3d-selection",
      group: "construction",
      label: "Strong 3D object manipulation",
      passed: input.spaceObjects >= 7 && Boolean(input.selectedSpaceObject),
      detail: `${input.spaceObjects} live 3D object(s), selection ${input.selectedSpaceObject ? "active" : "not active"}`,
      action: "Select a 3D object, then adjust position, rotation, size, material, or visibility in the inspector.",
    },
    {
      id: "algebra-linking",
      group: "foundation",
      label: "Algebra panel and dynamic linking",
      passed: input.plots > 0 && (input.algebraLinks ?? 0) >= 3,
      detail: `${input.plots} graph layer(s), ${input.results} CAS result(s), ${input.algebraLinks ?? 0} linked algebra item(s)`,
      action: "Run CAS commands, add plotted expressions, and animate parameters to create live links.",
    },
    {
      id: "inspector-context",
      group: "foundation",
      label: "Inspector and right-click polish",
      passed: (input.objectCount ?? 0) > 0,
      detail: "Selected objects expose editable properties, object-list actions, and context menu actions.",
      action: "Select any 2D/3D object and use the inspector, object list, or right-click menu.",
    },
    {
      id: "teaching-overlays",
      group: "teaching",
      label: "Teaching overlays",
      passed: Boolean(input.teachingMode) || input.lessonSteps >= 3,
      detail: `${input.lessonSteps} lesson step(s), teaching mode ${input.teachingMode ? "on" : "off"}`,
      action: "Turn on Teaching mode or seed a syllabus activity from the current workspace.",
    },
    {
      id: "animation-simulation",
      group: "teaching",
      label: "Animation and simulations",
      passed: input.animationSnapshots > 0 || Boolean(input.simulationsReady),
      detail: `${input.animationSnapshots} captured motion snapshot(s)`,
      action: "Use Animation tools to capture a parameter, cross-section, surface, or orbit snapshot.",
    },
    {
      id: "persistence-offline",
      group: "production",
      label: "Persistence, export, and offline",
      passed: input.importExportReady && Boolean(input.shareReady) && Boolean(input.offlineReady),
      detail: `Export ${input.importExportReady ? "ready" : "missing"}, share ${input.shareReady ? "ready" : "missing"}, offline ${input.offlineReady ? "ready" : "missing"}`,
      action: "Use the browser project center to save, recover, export, import, and share without a server.",
    },
    {
      id: "qa-performance-accessibility",
      group: "production",
      label: "QA, performance, and accessibility",
      passed: Boolean(input.qaReady) && Boolean(input.performanceReady) && Boolean(input.accessibilityReady),
      detail: `QA ${input.qaReady ? "ready" : "pending"}, performance ${input.performanceReady ? "ready" : "pending"}, accessibility ${input.accessibilityReady ? "ready" : "pending"}`,
      action: "Keep typecheck/build green, preserve keyboard shortcuts, aria labels, stable panels, and responsive layouts.",
    },
    {
      id: "syllabus-intelligence",
      group: "beyond-geogebra",
      label: "Differentiators and syllabus intelligence",
      passed: Boolean(input.syllabusReady) && (input.differentiatorCount ?? 0) >= 3,
      detail: `${input.differentiatorCount ?? 0} beyond-GeoGebra differentiator(s) active`,
      action: "Seed a syllabus teaching activity and connect the active workspace to lesson, practice, animation, and share workflows.",
    },
  ];
  const score = Math.round((checks.filter((check) => check.passed).length / checks.length) * 100);
  const status = score >= 90 ? "release-ready" : score >= 65 ? "good" : "needs-work";
  return { score, status, checks };
}

export function releaseStatusLabel(status: ReleaseHealth["status"]) {
  if (status === "release-ready") return "Release ready";
  if (status === "good") return "Good";
  return "Needs work";
}
