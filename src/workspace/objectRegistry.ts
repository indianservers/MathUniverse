import type { MathObject } from "./types";

type PlotSnapshot = {
  id: string;
  expression: string;
  color: string;
  kind?: string;
  visible?: boolean;
};

type ResultSnapshot = {
  id: string;
  input: string;
  interpretation: string;
  result: string;
  steps?: string[];
  visualSync?: unknown[];
};

type ConstructionSnapshot = {
  points: unknown[];
  lines: unknown[];
  circles: unknown[];
  polygons: unknown[];
  angles: unknown[];
  conics: unknown[];
  constraints: unknown[];
};

type LocusTraceSnapshot = {
  id: string;
  label: string;
  pointId: string;
  points: unknown[];
  visible: boolean;
};

type AnimationSnapshotSummary = {
  id: string;
  label: string;
  target: string;
  time: number;
};

type LessonSnapshot = {
  id: string;
  title: string;
  objective: string;
  audience: string;
  steps: Array<{ id: string; kind: string; title: string; command?: string }>;
};

type ReleaseHealthSnapshot = {
  score: number;
  status: string;
  checks: Array<{ id: string; passed: boolean }>;
};

type PracticeResponseSnapshot = {
  stepId: string;
  answer: string;
  checkedAt?: number;
  score?: number;
  feedback?: string;
};

type PracticeReportSnapshot = {
  score: number;
  answered: number;
  totalChecks: number;
  correct: number;
  status: string;
};

type WorkspaceObjectSnapshot = {
  input: string;
  plots: PlotSnapshot[];
  results: ResultSnapshot[];
  construction: ConstructionSnapshot;
  activeTool: string;
  graphParameters: Record<string, number>;
  locusTraces: LocusTraceSnapshot[];
  surface: string;
  solid: string;
  surfaceScale: number;
  height3d: number;
  crossSection: number;
  surfaceDomain: number;
  vectorStart3d: [number, number, number];
  vectorEnd3d: [number, number, number];
  point3d: [number, number, number];
  animationPlaying: boolean;
  animationTime: number;
  animationTarget: string;
  animationSnapshots: AnimationSnapshotSummary[];
  lesson: LessonSnapshot;
  practiceResponses: Record<string, PracticeResponseSnapshot>;
  practiceReport: PracticeReportSnapshot;
  releaseHealth: ReleaseHealthSnapshot;
};

function now() {
  return Date.now();
}

function createObject(object: Omit<MathObject, "createdAt" | "updatedAt" | "status" | "visible"> & Partial<Pick<MathObject, "status" | "visible">>): MathObject {
  const timestamp = now();
  return {
    createdAt: timestamp,
    updatedAt: timestamp,
    status: "ready",
    visible: true,
    ...object,
  };
}

export function createWorkspaceObjectsFromSnapshot(snapshot: WorkspaceObjectSnapshot): MathObject[] {
  const objects: MathObject[] = [];
  const command = snapshot.input.trim();

  if (command) {
    objects.push(
      createObject({
        id: "workspace-command",
        kind: "expression",
        label: "Current command",
        value: command,
        summary: "Command input currently staged in the unified workspace.",
        linkedViews: ["Solve", "CAS", "Graph"],
        metadata: { source: "live-workspace" },
      })
    );
  }

  snapshot.plots.forEach((plot, index) => {
    objects.push(
      createObject({
        id: `plot:${plot.id}`,
        kind: "function",
        label: `Graph ${index + 1}`,
        value: `y = ${plot.expression}`,
        summary: plot.kind ? `${plot.kind} graph layer` : "Graph layer",
        visible: plot.visible ?? true,
        status: plot.visible === false ? "hidden" : "ready",
        style: { color: plot.color },
        linkedViews: ["Graph", "Table", "CAS"],
        metadata: { source: "live-workspace", plotKind: plot.kind ?? "function" },
      })
    );
  });

  Object.entries(snapshot.graphParameters).forEach(([name, value]) => {
    objects.push(
      createObject({
        id: `slider:${name}`,
        kind: "slider",
        label: `Slider ${name}`,
        value: `${name} = ${Number(value.toFixed(3))}`,
        summary: "Live graph parameter shared by expressions, graph layers, and generated table values.",
        linkedViews: ["Graph", "Table", "Inspector"],
        metadata: { source: "live-workspace", parameter: name, value },
      })
    );
  });

  if (snapshot.plots.length > 0) {
    objects.push(
      createObject({
        id: "graph-table",
        kind: "table",
        label: "Linked graph table",
        value: `${snapshot.plots.filter((plot) => plot.visible !== false).length} visible graph layer(s)`,
        summary: "Generated table values track the visible graph layers and current slider parameters.",
        linkedViews: ["Graph", "Table", "Export"],
        dependencies: snapshot.plots.map((plot, index) => ({ id: `plot:${plot.id}`, label: `Graph ${index + 1}`, role: "source" })),
        metadata: {
          source: "live-workspace",
          parameterCount: Object.keys(snapshot.graphParameters).length,
          plotCount: snapshot.plots.length,
        },
      })
    );
  }

  snapshot.results.slice(0, 6).forEach((result, index) => {
    const isCas = /symbolic|workspace|derivative|integral|solve|factor|expand|simplify|external data tool/i.test(result.interpretation);
    objects.push(
      createObject({
        id: `result:${result.id}`,
        kind: isCas ? "equation" : "result",
        label: isCas ? `CAS result ${index + 1}` : `Result ${index + 1}`,
        value: result.result,
        summary: `${result.interpretation}: ${result.input}`,
        linkedViews: isCas ? ["CAS", "Steps", "Results"] : ["Results", "CAS"],
        dependencies: [{ id: "workspace-command", label: "Current command", role: "input" }],
        metadata: { source: "live-workspace", stepCount: result.steps?.length ?? 0, visualLinks: result.visualSync?.length ?? 0 },
      })
    );
  });

  const geometryCount =
    snapshot.construction.points.length +
    snapshot.construction.lines.length +
    snapshot.construction.circles.length +
    snapshot.construction.polygons.length +
    snapshot.construction.angles.length +
    snapshot.construction.conics.length;

  objects.push(
    createObject({
      id: "geometry-construction",
      kind: "geometry",
      label: "Geometry construction",
      value: `${geometryCount} objects, ${snapshot.construction.constraints.length} constraints`,
      summary: `Active tool: ${snapshot.activeTool}`,
      linkedViews: ["Geometry", "Inspector", "Export"],
      metadata: {
        source: "live-workspace",
        points: snapshot.construction.points.length,
        lines: snapshot.construction.lines.length,
        circles: snapshot.construction.circles.length,
        polygons: snapshot.construction.polygons.length,
        angles: snapshot.construction.angles.length,
        conics: snapshot.construction.conics.length,
        constraints: snapshot.construction.constraints.length,
        locusTraces: snapshot.locusTraces.length,
      },
    })
  );

  snapshot.locusTraces.forEach((trace) => {
    objects.push(
      createObject({
        id: `locus:${trace.id}`,
        kind: "geometry",
        label: trace.label,
        value: `${trace.points.length} traced samples`,
        summary: `Locus trace for point ${trace.pointId}.`,
        visible: trace.visible,
        status: trace.visible ? "ready" : "hidden",
        linkedViews: ["Geometry", "Locus", "Export"],
        dependencies: [{ id: "geometry-construction", label: "Geometry construction", role: "source" }],
        metadata: { source: "live-workspace", pointId: trace.pointId, samples: trace.points.length },
      })
    );
  });

  objects.push(
    createObject({
      id: "animation-timeline",
      kind: "slider",
      label: "Animation timeline",
      value: `${snapshot.animationPlaying ? "playing" : "paused"} at ${Number(snapshot.animationTime.toFixed(2))}s`,
      summary: `${snapshot.animationTarget} target with ${snapshot.animationSnapshots.length} captured motion snapshot(s).`,
      status: "ready",
      linkedViews: ["Graph", "3D", "Timeline", "Export"],
      metadata: {
        source: "live-workspace",
        playing: snapshot.animationPlaying,
        time: snapshot.animationTime,
        target: snapshot.animationTarget,
        snapshots: snapshot.animationSnapshots.length,
      },
    })
  );

  snapshot.animationSnapshots.slice(0, 6).forEach((item, index) => {
    objects.push(
      createObject({
        id: `animation-snapshot:${item.id}`,
        kind: "slider",
        label: `Motion snapshot ${index + 1}`,
        value: item.label,
        summary: `${item.target} at ${Number(item.time.toFixed(2))}s.`,
        linkedViews: ["Timeline", "Graph", "3D", "Export"],
        dependencies: [{ id: "animation-timeline", label: "Animation timeline", role: "source" }],
        metadata: { source: "live-workspace", target: item.target, time: item.time },
      })
    );
  });

  objects.push(
    createObject({
      id: "classroom-lesson",
      kind: "result",
      label: "Classroom lesson",
      value: snapshot.lesson.title,
      summary: `${snapshot.lesson.audience}: ${snapshot.lesson.steps.length} authored step(s).`,
      linkedViews: ["Tools", "Classroom", "Export"],
      metadata: {
        source: "live-workspace",
        lessonId: snapshot.lesson.id,
        steps: snapshot.lesson.steps.length,
        objective: snapshot.lesson.objective.slice(0, 80),
      },
    })
  );

  objects.push(
    createObject({
      id: "practice-assessment",
      kind: "result",
      label: "Practice assessment",
      value: `${snapshot.practiceReport.score}% ${snapshot.practiceReport.status}`,
      summary: `${snapshot.practiceReport.answered}/${snapshot.practiceReport.totalChecks} response(s), ${snapshot.practiceReport.correct} mastery check(s) passed.`,
      status: snapshot.practiceReport.status === "mastered" ? "ready" : snapshot.practiceReport.answered > 0 ? "warning" : "ready",
      linkedViews: ["Tools", "Classroom", "Export"],
      dependencies: [{ id: "classroom-lesson", label: "Classroom lesson", role: "source" }],
      metadata: {
        source: "live-workspace",
        score: snapshot.practiceReport.score,
        answered: snapshot.practiceReport.answered,
        totalChecks: snapshot.practiceReport.totalChecks,
        correct: snapshot.practiceReport.correct,
      },
    })
  );

  Object.values(snapshot.practiceResponses).slice(0, 8).forEach((response, index) => {
    if (!response.answer.trim()) return;
    objects.push(
      createObject({
        id: `practice-response:${response.stepId}`,
        kind: "result",
        label: `Practice response ${index + 1}`,
        value: `${response.score ?? 0}%`,
        summary: response.feedback ?? response.answer.slice(0, 120),
        status: (response.score ?? 0) >= 70 ? "ready" : "warning",
        linkedViews: ["Tools", "Classroom"],
        dependencies: [{ id: "practice-assessment", label: "Practice assessment", role: "child" }],
        metadata: {
          source: "live-workspace",
          stepId: response.stepId,
          score: response.score ?? 0,
          checked: Boolean(response.checkedAt),
        },
      })
    );
  });

  objects.push(
    createObject({
      id: "import-export-suite",
      kind: "result",
      label: "Import export suite",
      value: "Workspace, bundle, SVG, CSV, worksheet",
      summary: "Phase 9 portable project tools for browser-only import/export workflows.",
      linkedViews: ["Tools", "Export", "Classroom"],
      metadata: {
        source: "live-workspace",
        plots: snapshot.plots.length,
        results: snapshot.results.length,
        lessonSteps: snapshot.lesson.steps.length,
        geometryObjects:
          snapshot.construction.points.length +
          snapshot.construction.lines.length +
          snapshot.construction.circles.length +
          snapshot.construction.polygons.length +
          snapshot.construction.conics.length,
      },
    })
  );

  objects.push(
    createObject({
      id: "release-readiness",
      kind: "result",
      label: "Release readiness",
      value: `${snapshot.releaseHealth.score}% ${snapshot.releaseHealth.status}`,
      summary: `${snapshot.releaseHealth.checks.filter((check) => check.passed).length}/${snapshot.releaseHealth.checks.length} readiness checks passed.`,
      linkedViews: ["Tools", "Inspector", "Export"],
      metadata: {
        source: "live-workspace",
        score: snapshot.releaseHealth.score,
        status: snapshot.releaseHealth.status,
        checks: snapshot.releaseHealth.checks.length,
      },
    })
  );

  snapshot.lesson.steps.slice(0, 8).forEach((step, index) => {
    objects.push(
      createObject({
        id: `lesson-step:${step.id}`,
        kind: "result",
        label: `Lesson step ${index + 1}`,
        value: step.title,
        summary: step.command ? `${step.kind}: ${step.command}` : step.kind,
        linkedViews: ["Classroom", "Tools", "Solve"],
        dependencies: [{ id: "classroom-lesson", label: "Classroom lesson", role: "parent" }],
        metadata: { source: "live-workspace", kind: step.kind, hasCommand: Boolean(step.command) },
      })
    );
  });

  objects.push(
    createObject({
      id: "space3d-scene",
      kind: "space3d",
      label: "3D scene",
      value: `${snapshot.surface} surface + ${snapshot.solid}`,
      summary: `scale ${snapshot.surfaceScale}, clip ${snapshot.surfaceDomain}, size ${snapshot.height3d}, slice z=${snapshot.crossSection}`,
      linkedViews: ["3D", "Inspector"],
      metadata: {
        source: "live-workspace",
        surface: snapshot.surface,
        solid: snapshot.solid,
        surfaceScale: snapshot.surfaceScale,
        surfaceDomain: snapshot.surfaceDomain,
        solidSize: snapshot.height3d,
        crossSection: snapshot.crossSection,
      },
    })
  );

  objects.push(
    createObject({
      id: "space3d-surface",
      kind: "space3d",
      label: "3D surface object",
      value: snapshot.surface,
      summary: `Surface scale ${snapshot.surfaceScale}; clipping/domain radius ${snapshot.surfaceDomain}.`,
      linkedViews: ["3D", "Inspector", "Measurements"],
      dependencies: [{ id: "space3d-scene", label: "3D scene", role: "parent" }],
      metadata: { source: "live-workspace", surface: snapshot.surface, scale: snapshot.surfaceScale, domain: snapshot.surfaceDomain },
    })
  );

  objects.push(
    createObject({
      id: "space3d-vector",
      kind: "space3d",
      label: "3D vector",
      value: `<${snapshot.vectorEnd3d.map((value, index) => Number((value - snapshot.vectorStart3d[index]).toFixed(2))).join(", ")}>`,
      summary: `From (${snapshot.vectorStart3d.join(", ")}) to (${snapshot.vectorEnd3d.join(", ")}).`,
      linkedViews: ["3D", "Inspector", "Measurements"],
      dependencies: [{ id: "space3d-scene", label: "3D scene", role: "parent" }],
      metadata: { source: "live-workspace", start: snapshot.vectorStart3d.join(","), end: snapshot.vectorEnd3d.join(",") },
    })
  );

  objects.push(
    createObject({
      id: "space3d-point",
      kind: "space3d",
      label: "3D point P",
      value: `P(${snapshot.point3d.map((value) => Number(value.toFixed(2))).join(", ")})`,
      summary: "Editable point marker used by the 3D studio.",
      linkedViews: ["3D", "Inspector", "Measurements"],
      dependencies: [{ id: "space3d-scene", label: "3D scene", role: "parent" }],
      metadata: { source: "live-workspace", point: snapshot.point3d.join(",") },
    })
  );

  return objects;
}
