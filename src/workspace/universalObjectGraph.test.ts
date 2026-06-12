import { describe, expect, it, beforeEach } from "vitest";
import { createDefaultWorkspaceState } from "./workspacePersistence";
import { useWorkspaceStore } from "./workspaceStore";
import {
  buildCasNotebookWorkspaceObjects,
  buildEngineeringLiveSystemWorkspaceObjects,
  buildEngineeringWorkspaceObjects,
  buildFormulaLibraryWorkspaceObjects,
  buildGraphingCalculatorWorkspaceObjects,
  buildProblemSolverWorkspaceObjects,
  UNIVERSAL_OBJECT_SOURCE,
} from "./universalObjectGraph";

beforeEach(() => {
  const defaults = createDefaultWorkspaceState();
  useWorkspaceStore.setState({
    ...defaults,
    selectedObjectIds: [],
    redoHistory: [],
  });
});

describe("universal object graph adapters", () => {
  it("builds problem solver objects with answer, steps, curves, and table", () => {
    const objects = buildProblemSolverWorkspaceObjects({
      input: "2x + 5 = 15",
      problemType: "linear-equation",
      confidence: "high",
      method: "Linear isolation",
      finalAnswer: "x = 5",
      steps: ["Start with 2x + 5 = 15", "x = 5"],
      visual: {
        title: "Equation Visual",
        description: "Graph both sides.",
        curves: [{ expression: "2*x+5", label: "left side", color: "#0891b2" }],
        markers: [{ label: "x = 5", x: 5, y: 15 }],
        table: [{ x: 5, y: 0 }],
      },
    });

    expect(objects.map((object) => object.id)).toEqual(expect.arrayContaining([
      "problem-solver:input",
      "problem-solver:final-answer",
      "problem-solver:steps",
      "problem-solver:visual-curve-1",
      "problem-solver:visual-table",
    ]));
    expect(objects.every((object) => object.metadata?.source === UNIVERSAL_OBJECT_SOURCE)).toBe(true);
    expect(objects.find((object) => object.id === "problem-solver:visual-curve-1")?.kind).toBe("function");
  });

  it("builds CAS notebook cell objects with operation-aware kinds", () => {
    const objects = buildCasNotebookWorkspaceObjects({
      assumptions: "x real",
      mode: "exact",
      cells: [
        { id: "a", input: "x^2-5*x+6=0", operation: "solve", output: "x=2,3", ok: true, steps: ["Solve."] },
        { id: "b", input: "[[1,2],[3,4]]", operation: "matrix", output: "det=-2", ok: true, steps: ["Parse matrix."] },
      ],
    });

    expect(objects.find((object) => object.id === "cas-notebook:cell-a")?.kind).toBe("equation");
    expect(objects.find((object) => object.id === "cas-notebook:cell-b")?.kind).toBe("matrix");
    expect(objects.find((object) => object.id === "cas-notebook:notebook")?.value).toContain("2/2");
  });

  it("builds graphing calculator function and table objects", () => {
    const objects = buildGraphingCalculatorWorkspaceObjects({
      functions: [{ id: "f1", input: "x^2 - 4", color: "#06b6d4", visible: true, normalized: "x^2-4" }],
      selectedId: "f1",
      tableRows: [{ x: 0, y: -4, valid: true }],
      view: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
      analysis: { roots: [-2, 2], yIntercept: -4, visibleRange: { min: -4, max: 96 }, discontinuities: [] },
    });

    expect(objects.find((object) => object.id === "graphing-calculator:function-f1")?.value).toBe("y = x^2-4");
    expect(objects.find((object) => object.id === "graphing-calculator:table")?.dependencies?.[0]?.id).toBe("graphing-calculator:function-f1");
  });

  it("builds engineering and formula-library objects", () => {
    const engineering = buildEngineeringWorkspaceObjects({
      domain: {
        id: "transforms-signals",
        title: "Transforms and Signal Mathematics",
        semesterBand: "M2-M3",
        purpose: "Signals and transforms.",
        workspaceTargets: ["CAS notebook"],
        formulaFamilies: ["Laplace transform"],
      },
      formulas: [{ title: "Laplace derivative rule", formula: "L{f'}=sF(s)-f(0)", route: "/formulas", prerequisites: ["ODEs"] }],
      simulations: [{ id: "spectrum", title: "Spectrum sweep", model: "frequency response", metricLabel: "harmonic", metricValue: 3, metricUnit: "n", variables: ["cutoff"], samples: [0.1, 0.5] }],
      coverage: { percent: 88, missing: ["Bode plot"] },
      controls: { shape: 1, forcing: 0.5, time: 0.25 },
    });
    const formulas = buildFormulaLibraryWorkspaceObjects({
      selected: {
        id: "quadratic-formula",
        title: "Quadratic formula",
        formula: "x=(-b+-sqrt(b^2-4ac))/(2a)",
        category: { id: "algebra", title: "Algebra" },
        level: "High School",
        group: "Algebra & Functions",
        usage: ["Exam"],
        tags: ["quadratic"],
        variables: ["a", "b", "c"],
        item: { note: "Solve quadratics." },
      },
      related: [{ id: "discriminant", title: "Discriminant", formula: "D=b^2-4ac" }],
      progress: "viewed",
      bookmarked: true,
    });

    expect(engineering.some((object) => object.id === "engineering-math:simulation-spectrum")).toBe(true);
    expect(formulas.find((object) => object.id === "formula-library:selected-quadratic-formula")?.metadata?.bookmarked).toBe(true);
  });

  it("builds live engineering system objects for the shared inspector graph", () => {
    const objects = buildEngineeringLiveSystemWorkspaceObjects({
      parent: { id: "domain-transforms-signals", title: "Transforms and Signal Mathematics" },
      systems: [
        {
          id: "bode-plot",
          title: "Live Bode plot",
          systemType: "control-frequency-response",
          kind: "function",
          metricLabel: "cutoff",
          metricValue: 1.25,
          metricUnit: " rad/s",
          sampleCount: 80,
          controls: { gain: 1.4, timeConstant: 0.8 },
          summary: "First-order low-pass magnitude and phase response.",
          color: "#38bdf8",
        },
        {
          id: "vector-field",
          title: "Live vector field",
          systemType: "field-analysis",
          kind: "vector",
          metricLabel: "curl",
          metricValue: 1.3,
          sampleCount: 49,
          controls: { swirl: 0.65, source: 0.2 },
          summary: "Adjustable linear field with divergence and curl metrics.",
        },
      ],
    });

    expect(objects.map((object) => object.id)).toEqual(expect.arrayContaining([
      "engineering-math:live-bode-plot",
      "engineering-math:live-vector-field",
    ]));
    expect(objects.find((object) => object.id === "engineering-math:live-bode-plot")?.kind).toBe("function");
    expect(objects.find((object) => object.id === "engineering-math:live-vector-field")?.kind).toBe("vector");
    expect(objects.every((object) => object.metadata?.liveSystem === true)).toBe(true);
    expect(objects.every((object) => object.dependencies?.[0]?.id === "engineering-math:domain-transforms-signals")).toBe(true);
  });

  it("replaces only the selected universal scope in the workspace store", () => {
    const firstProblem = buildProblemSolverWorkspaceObjects({ input: "2x+5=15", problemType: "linear-equation", finalAnswer: "x = 5" });
    const casObjects = buildCasNotebookWorkspaceObjects({
      assumptions: "",
      mode: "exact",
      cells: [{ id: "cell", input: "factor x^2-1", operation: "factor", output: "(x-1)(x+1)", ok: true }],
    });
    useWorkspaceStore.getState().replaceObjectScope("problem-solver", firstProblem);
    useWorkspaceStore.getState().replaceObjectScope("cas-notebook", casObjects);

    const nextProblem = buildProblemSolverWorkspaceObjects({ input: "3x-7=11", problemType: "linear-equation", finalAnswer: "x = 6" });
    useWorkspaceStore.getState().replaceObjectScope("problem-solver", nextProblem);

    const objects = useWorkspaceStore.getState().objects;
    expect(objects.find((object) => object.id === "problem-solver:input")?.value).toBe("3x-7=11");
    expect(objects.find((object) => object.id === "problem-solver:final-answer")?.value).toBe("x = 6");
    expect(objects.find((object) => object.id === "cas-notebook:cell-cell")?.value).toBe("(x-1)(x+1)");
    expect(objects.filter((object) => object.metadata?.universalScope === "problem-solver").length).toBe(nextProblem.length);
  });
});
