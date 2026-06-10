export type ReleaseHealthInput = {
  plots: number;
  results: number;
  geometryObjects: number;
  spaceObjects: number;
  lessonSteps: number;
  animationSnapshots: number;
  importExportReady: boolean;
};

export type ReleaseHealth = {
  score: number;
  status: "needs-work" | "good" | "release-ready";
  checks: Array<{ id: string; label: string; passed: boolean; detail: string }>;
};

export function computeReleaseHealth(input: ReleaseHealthInput): ReleaseHealth {
  const checks = [
    { id: "graph", label: "Graph workspace", passed: input.plots > 0, detail: `${input.plots} graph layer(s)` },
    { id: "cas", label: "CAS results", passed: input.results > 0, detail: `${input.results} result card(s)` },
    { id: "geometry", label: "Geometry kernel", passed: input.geometryObjects > 0, detail: `${input.geometryObjects} geometry object(s)` },
    { id: "space3d", label: "3D studio", passed: input.spaceObjects >= 3, detail: `${input.spaceObjects} live 3D object(s)` },
    { id: "lesson", label: "Classroom authoring", passed: input.lessonSteps > 0, detail: `${input.lessonSteps} lesson step(s)` },
    { id: "motion", label: "Animation snapshots", passed: input.animationSnapshots > 0, detail: `${input.animationSnapshots} motion snapshot(s)` },
    { id: "export", label: "Import/export suite", passed: input.importExportReady, detail: input.importExportReady ? "bundle and import tools available" : "export tools missing" },
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
