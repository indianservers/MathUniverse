import { createMathObject } from "./coreObjects";
import type { MathObject, MathObjectKind } from "./types";

export const UNIVERSAL_OBJECT_SOURCE = "universal-object-graph";

export type UniversalObjectScope =
  | "problem-solver"
  | "cas-notebook"
  | "graphing-calculator"
  | "engineering-math"
  | "formula-library";

type ProblemSolverPublishInput = {
  input: string;
  problemType: string;
  confidence?: string;
  method?: string;
  finalAnswer?: string;
  assumptions?: string[];
  restrictions?: string[];
  warnings?: string[];
  steps?: string[];
  visual?: {
    title: string;
    description: string;
    curves: Array<{ expression: string; label: string; color: string }>;
    markers: Array<{ label: string; x: number; y: number }>;
    table: Array<{ x: number; y: number | string | null }>;
  } | null;
};

type CasCellPublishInput = {
  id: string;
  input: string;
  operation: string;
  output: string;
  ok: boolean;
  steps?: string[];
};

type CasNotebookPublishInput = {
  assumptions: string;
  mode: string;
  cells: CasCellPublishInput[];
};

type GraphFunctionPublishInput = {
  id: string;
  input: string;
  color: string;
  visible: boolean;
  normalized?: string;
  error?: string | null;
};

type GraphCalculatorPublishInput = {
  functions: GraphFunctionPublishInput[];
  selectedId: string;
  tableRows: Array<{ x: number; y: number | null; valid?: boolean }>;
  view: { xMin: number; xMax: number; yMin: number; yMax: number };
  analysis: {
    roots?: number[];
    yIntercept?: number | null;
    visibleRange?: { min: number | null; max: number | null };
    discontinuities?: number[];
  };
};

type EngineeringPublishInput = {
  domain: {
    id: string;
    title: string;
    semesterBand: string;
    purpose: string;
    workspaceTargets: string[];
    formulaFamilies: string[];
  };
  formulas: Array<{ title: string; formula: string; route?: string; prerequisites?: string[] }>;
  simulations: Array<{ id: string; title: string; model: string; metricLabel: string; metricValue: number; metricUnit: string; variables: string[]; samples: number[] }>;
  coverage?: { percent: number; missing: string[] };
  controls: { shape: number; forcing: number; time: number };
};

type EngineeringLiveSystemPublishInput = {
  parent?: { id: string; title: string };
  systems: Array<{
    id: string;
    title: string;
    systemType: string;
    kind?: MathObjectKind;
    metricLabel: string;
    metricValue: number | string;
    metricUnit?: string;
    sampleCount: number;
    controls: Record<string, number | string>;
    summary: string;
    color?: string;
  }>;
};

type FormulaPublishInput = {
  selected?: {
    id: string;
    title: string;
    formula: string;
    category: { id: string; title: string };
    level: string;
    group: string;
    usage: string[];
    tags: string[];
    variables: string[];
    item: { note: string };
  };
  related: Array<{ id: string; title: string; formula: string }>;
  progress: string;
  bookmarked: boolean;
};

function scopedId(scope: UniversalObjectScope, id: string) {
  return `${scope}:${id.replace(/[^a-z0-9:_-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase()}`;
}

function baseMetadata(scope: UniversalObjectScope, metadata: MathObject["metadata"] = {}) {
  return {
    source: UNIVERSAL_OBJECT_SOURCE,
    universalScope: scope,
    ...metadata,
  };
}

function textList(values: string[] | undefined, fallback = "none") {
  return values?.filter(Boolean).join(", ") || fallback;
}

type UniversalCreateInput = Parameters<typeof createMathObject>[0] & Partial<Pick<MathObject, "status">>;

function createUniversalObject(scope: UniversalObjectScope, input: UniversalCreateInput) {
  const object = createMathObject({
    ...input,
    id: input.id ? scopedId(scope, input.id) : undefined,
    metadata: baseMetadata(scope, input.metadata),
  });
  return input.status ? { ...object, status: input.status } : object;
}

export function buildProblemSolverWorkspaceObjects(input: ProblemSolverPublishInput): MathObject[] {
  const trimmed = input.input.trim();
  if (!trimmed) return [];
  const objects: MathObject[] = [
    createUniversalObject("problem-solver", {
      id: "input",
      kind: input.input.includes("=") ? "equation" : "expression",
      label: "Problem Solver input",
      value: trimmed,
      summary: `${input.problemType}${input.method ? ` via ${input.method}` : ""}`,
      linkedViews: ["Problem Solver", "CAS", "Graph", "Inspector"],
      definition: { source: trimmed, category: "cas", parentIds: [] },
      metadata: { problemType: input.problemType, confidence: input.confidence ?? "unknown" },
    }),
  ];

  if (input.finalAnswer) {
    objects.push(createUniversalObject("problem-solver", {
      id: "final-answer",
      kind: "result",
      label: "Problem Solver final answer",
      value: input.finalAnswer,
      summary: `Method: ${input.method ?? "classified result"}`,
      linkedViews: ["Problem Solver", "CAS", "Inspector"],
      dependencies: [{ id: scopedId("problem-solver", "input"), label: "Problem Solver input", role: "source" }],
      metadata: { method: input.method ?? "", stepCount: input.steps?.length ?? 0 },
    }));
  }

  if (input.steps?.length) {
    objects.push(createUniversalObject("problem-solver", {
      id: "steps",
      kind: "result",
      label: "Problem Solver steps",
      value: `${input.steps.length} step(s)`,
      summary: input.steps.slice(0, 3).join(" | "),
      linkedViews: ["Problem Solver", "Teaching", "Inspector"],
      dependencies: [{ id: scopedId("problem-solver", "input"), label: "Problem Solver input", role: "source" }],
      metadata: { stepCount: input.steps.length },
    }));
  }

  input.visual?.curves.forEach((curve, index) => {
    objects.push(createUniversalObject("problem-solver", {
      id: `visual-curve-${index + 1}`,
      kind: "function",
      label: curve.label || `Visual curve ${index + 1}`,
      value: `y = ${curve.expression}`,
      summary: input.visual?.description,
      style: { color: curve.color },
      linkedViews: ["Problem Solver", "Graph", "Table", "Inspector"],
      definition: { source: curve.expression, expression: curve.expression, category: "graph", parentIds: [scopedId("problem-solver", "input")] },
      dependencies: [{ id: scopedId("problem-solver", "input"), label: "Problem Solver input", role: "source" }],
      metadata: { visualTitle: input.visual?.title ?? "" },
    }));
  });

  if (input.visual?.table.length) {
    objects.push(createUniversalObject("problem-solver", {
      id: "visual-table",
      kind: "table",
      label: "Problem Solver value table",
      value: `${input.visual.table.length} row(s)`,
      summary: input.visual.description,
      linkedViews: ["Problem Solver", "Graph", "Table", "Inspector"],
      dependencies: input.visual.curves.map((curve, index) => ({ id: scopedId("problem-solver", `visual-curve-${index + 1}`), label: curve.label || `Visual curve ${index + 1}`, role: "source" })),
      metadata: { rows: input.visual.table.length },
    }));
  }

  if (input.restrictions?.length || input.warnings?.length) {
    objects.push(createUniversalObject("problem-solver", {
      id: "domain-warnings",
      kind: "result",
      label: "Domain and warnings",
      value: textList([...(input.restrictions ?? []), ...(input.warnings ?? [])]),
      summary: `Assumptions: ${textList(input.assumptions)}`,
      status: input.warnings?.length ? "warning" : "ready",
      linkedViews: ["Problem Solver", "Inspector"],
      dependencies: [{ id: scopedId("problem-solver", "input"), label: "Problem Solver input", role: "source" }],
      metadata: { restrictions: input.restrictions?.length ?? 0, warnings: input.warnings?.length ?? 0 },
    }));
  }

  return objects;
}

export function buildCasNotebookWorkspaceObjects(input: CasNotebookPublishInput): MathObject[] {
  const solvedCells = input.cells.filter((cell) => cell.output.trim());
  if (!input.cells.length) return [];
  const objects: MathObject[] = [
    createUniversalObject("cas-notebook", {
      id: "notebook",
      kind: "result",
      label: "CAS notebook",
      value: `${solvedCells.length}/${input.cells.length} solved cell(s)`,
      summary: `Mode: ${input.mode}; assumptions: ${input.assumptions.trim() || "none"}`,
      linkedViews: ["CAS Notebook", "Problem Solver", "Table", "Inspector"],
      metadata: { mode: input.mode, cellCount: input.cells.length, solvedCells: solvedCells.length },
    }),
  ];

  solvedCells.slice(0, 12).forEach((cell, index) => {
    const kind: MathObjectKind = cell.operation === "matrix" ? "matrix" : cell.operation === "list" ? "dataset" : cell.input.includes("=") || cell.operation === "solve" || cell.operation === "system" ? "equation" : "expression";
    objects.push(createUniversalObject("cas-notebook", {
      id: `cell-${cell.id}`,
      kind,
      label: `CAS cell ${index + 1}`,
      value: cell.output,
      summary: `${cell.operation}: ${cell.input}`,
      status: cell.ok ? "ready" : "warning",
      linkedViews: ["CAS Notebook", "Problem Solver", "Graph", "Inspector"],
      dependencies: [{ id: scopedId("cas-notebook", "notebook"), label: "CAS notebook", role: "parent" }],
      definition: { source: cell.input, category: "cas", parentIds: [scopedId("cas-notebook", "notebook")] },
      metadata: { operation: cell.operation, stepCount: cell.steps?.length ?? 0 },
    }));
  });

  return objects;
}

export function buildGraphingCalculatorWorkspaceObjects(input: GraphCalculatorPublishInput): MathObject[] {
  const validFunctions = input.functions.filter((fn) => fn.input.trim());
  if (!validFunctions.length) return [];
  const objects: MathObject[] = [
    createUniversalObject("graphing-calculator", {
      id: "view",
      kind: "result",
      label: "Graphing calculator view",
      value: `x:[${input.view.xMin}, ${input.view.xMax}], y:[${input.view.yMin}, ${input.view.yMax}]`,
      summary: `${validFunctions.length} function layer(s), selected ${input.selectedId}`,
      linkedViews: ["Graphing Calculator", "Graph", "Table", "Inspector"],
      metadata: { selectedId: input.selectedId, functionCount: validFunctions.length },
    }),
  ];

  validFunctions.forEach((fn, index) => {
    objects.push(createUniversalObject("graphing-calculator", {
      id: `function-${fn.id}`,
      kind: "function",
      label: `Graph function ${index + 1}`,
      value: `y = ${fn.normalized || fn.input}`,
      summary: fn.error ? `Input issue: ${fn.error}` : "Live graphing calculator function.",
      visible: fn.visible,
      status: fn.error ? "warning" : fn.visible ? "ready" : "hidden",
      style: { color: fn.color },
      linkedViews: ["Graphing Calculator", "Graph", "CAS", "Table"],
      definition: { source: fn.input, expression: fn.normalized || fn.input, category: "graph", parentIds: [] },
      metadata: { selected: fn.id === input.selectedId, error: fn.error ?? "" },
    }));
  });

  if (input.tableRows.length) {
    objects.push(createUniversalObject("graphing-calculator", {
      id: "table",
      kind: "table",
      label: "Graphing calculator table",
      value: `${input.tableRows.length} row(s)`,
      summary: `Roots: ${input.analysis.roots?.join(", ") || "none visible"}; y-intercept: ${input.analysis.yIntercept ?? "undefined"}`,
      linkedViews: ["Graphing Calculator", "Table", "Data", "Inspector"],
      dependencies: [{ id: scopedId("graphing-calculator", `function-${input.selectedId}`), label: "Selected function", role: "source" }],
      metadata: {
        rows: input.tableRows.length,
        roots: input.analysis.roots?.length ?? 0,
        discontinuities: input.analysis.discontinuities?.length ?? 0,
      },
    }));
  }

  return objects;
}

export function buildEngineeringWorkspaceObjects(input: EngineeringPublishInput): MathObject[] {
  const domain = input.domain;
  const objects: MathObject[] = [
    createUniversalObject("engineering-math", {
      id: `domain-${domain.id}`,
      kind: "result",
      label: domain.title,
      value: domain.semesterBand,
      summary: domain.purpose,
      linkedViews: ["Engineering Math", "Formula Map", "CAS Notebook", "Inspector"],
      metadata: { domainId: domain.id, workspaceTargets: domain.workspaceTargets.length, formulaFamilies: domain.formulaFamilies.length },
    }),
  ];

  input.formulas.slice(0, 8).forEach((formula, index) => {
    objects.push(createUniversalObject("engineering-math", {
      id: `formula-${domain.id}-${index + 1}`,
      kind: "expression",
      label: formula.title,
      value: formula.formula,
      summary: `Engineering formula for ${domain.title}.`,
      linkedViews: ["Engineering Math", "Formula Map", "CAS Notebook", "Inspector"],
      dependencies: [{ id: scopedId("engineering-math", `domain-${domain.id}`), label: domain.title, role: "parent" }],
      metadata: { route: formula.route ?? "", prerequisites: formula.prerequisites?.length ?? 0 },
    }));
  });

  input.simulations.forEach((simulation) => {
    objects.push(createUniversalObject("engineering-math", {
      id: `simulation-${simulation.id}`,
      kind: "dataset",
      label: simulation.title,
      value: `${simulation.metricLabel} = ${simulation.metricValue}${simulation.metricUnit}`,
      summary: simulation.model,
      linkedViews: ["Engineering Math", "Data", "Graph", "Inspector"],
      dependencies: [{ id: scopedId("engineering-math", `domain-${domain.id}`), label: domain.title, role: "parent" }],
      metadata: {
        variables: simulation.variables.length,
        samples: simulation.samples.length,
        shape: input.controls.shape,
        forcing: input.controls.forcing,
        time: input.controls.time,
      },
    }));
  });

  if (input.coverage) {
    objects.push(createUniversalObject("engineering-math", {
      id: `coverage-${domain.id}`,
      kind: "result",
      label: "Engineering coverage",
      value: `${input.coverage.percent}%`,
      summary: input.coverage.missing.length ? `${input.coverage.missing.length} upgrade target(s): ${input.coverage.missing.slice(0, 3).join(", ")}` : "No core gaps remain for this domain.",
      status: input.coverage.missing.length ? "warning" : "ready",
      linkedViews: ["Engineering Math", "Inspector", "Roadmap"],
      dependencies: [{ id: scopedId("engineering-math", `domain-${domain.id}`), label: domain.title, role: "parent" }],
      metadata: { missing: input.coverage.missing.length },
    }));
  }

  return objects;
}

export function buildEngineeringLiveSystemWorkspaceObjects(input: EngineeringLiveSystemPublishInput): MathObject[] {
  const parentDependency = input.parent
    ? [{ id: scopedId("engineering-math", input.parent.id), label: input.parent.title, role: "parent" }]
    : [];

  return input.systems.map((system) => createUniversalObject("engineering-math", {
    id: `live-${system.id}`,
    kind: system.kind ?? "dataset",
    label: system.title,
    value: `${system.metricLabel} = ${system.metricValue}${system.metricUnit ?? ""}`,
    summary: system.summary,
    style: system.color ? { color: system.color } : undefined,
    linkedViews: ["Engineering Math", "Graph", "Data", "Inspector"],
    dependencies: parentDependency,
    metadata: {
      liveSystem: true,
      systemType: system.systemType,
      sampleCount: system.sampleCount,
      controlCount: Object.keys(system.controls).length,
      controls: JSON.stringify(system.controls),
    },
  }));
}

export function buildFormulaLibraryWorkspaceObjects(input: FormulaPublishInput): MathObject[] {
  if (!input.selected) return [];
  const record = input.selected;
  const objects: MathObject[] = [
    createUniversalObject("formula-library", {
      id: `selected-${record.id}`,
      kind: "expression",
      label: record.title,
      value: record.formula,
      summary: record.item.note,
      linkedViews: ["Formula Library", "CAS Notebook", "Graph", "Inspector"],
      definition: { source: record.formula, expression: record.formula, category: "cas", parentIds: [] },
      metadata: {
        categoryId: record.category.id,
        categoryTitle: record.category.title,
        level: record.level,
        group: record.group,
        progress: input.progress,
        bookmarked: input.bookmarked,
        variables: record.variables.length,
      },
    }),
  ];

  input.related.slice(0, 6).forEach((related, index) => {
    objects.push(createUniversalObject("formula-library", {
      id: `related-${related.id}`,
      kind: "expression",
      label: `Related formula ${index + 1}: ${related.title}`,
      value: related.formula,
      summary: `Related to ${record.title}.`,
      linkedViews: ["Formula Library", "CAS Notebook", "Inspector"],
      dependencies: [{ id: scopedId("formula-library", `selected-${record.id}`), label: record.title, role: "source" }],
      metadata: { relatedTo: record.id },
    }));
  });

  return objects;
}
