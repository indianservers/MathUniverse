import { describe, expect, it } from "vitest";
import { createBoardDocument } from "./boardPersistence";
import {
  approveSafeWorkflowSteps,
  buildBoardIntelligenceContext,
  cancelBoardWorkflow,
  inferBoardGoal,
  planBoardWorkflow,
  updateWorkflowStep,
  verifyBoardResult,
} from "./boardIntelligence";

function setup() {
  const board = createBoardDocument();
  board.elements.push({
    id: "quadratic",
    type: "math-expression",
    latex: "x^2-5x+6=0",
    sourceStrokeIds: [],
    bounds: { x: 20, y: 20, width: 220, height: 60 },
    createdAt: board.createdAt,
  });
  const context = buildBoardIntelligenceContext({ document: board, selectedElementIds: ["quadratic"] });
  return { board, context };
}

describe("Board intelligence workflow", () => {
  it("detects explicit high-confidence natural-language intent", () => {
    const { context } = setup();
    expect(inferBoardGoal(context, "Solve and graph this.")).toMatchObject({ type: "solve", confidence: "high", userConfirmed: true });
  });

  it("plans the transparent quadratic solve-and-graph workflow", () => {
    const { context } = setup();
    const workflow = planBoardWorkflow({ context, command: "Solve and graph this." });
    expect(workflow.steps.map((step) => step.title)).toEqual([
      "Confirm selected expression",
      "Factor the quadratic",
      "Find the roots",
      "Verify the roots",
      "Plot with the existing 2D graph engine",
    ]);
    expect(workflow.steps[4]?.dependsOnStepIds).toEqual([workflow.steps[3]?.id]);
    expect(workflow.requiredCapabilities).toEqual(expect.arrayContaining(["factor", "find-roots", "verify", "plot-2d"]));
  });

  it("approves safe steps while preserving sensitive confirmation", () => {
    const { context } = setup();
    const workflow = planBoardWorkflow({ context, command: "Solve this." });
    workflow.steps.push({
      id: "sensitive",
      order: 99,
      type: "analyze",
      title: "Replace original",
      inputElementIds: ["quadratic"],
      dependsOnStepIds: [],
      status: "pending",
      requiresConfirmation: true,
      permissionClass: "sensitive",
      canRetry: false,
      canSkip: true,
    });
    const approved = approveSafeWorkflowSteps(workflow);
    expect(approved.steps.filter((step) => step.id !== "sensitive").every((step) => step.status === "approved")).toBe(true);
    expect(approved.steps.find((step) => step.id === "sensitive")?.status).toBe("pending");
  });

  it("supports failure, retry, skip, resume and cancellation transitions", () => {
    const { context } = setup();
    let workflow = approveSafeWorkflowSteps(planBoardWorkflow({ context, command: "Solve and graph this." }));
    workflow = updateWorkflowStep(workflow, "step-1", { status: "success" });
    workflow = updateWorkflowStep(workflow, "step-2", { status: "failed", error: "engine offline" });
    expect(workflow.status).toBe("failed");
    workflow = updateWorkflowStep(workflow, "step-2", { status: "approved", error: undefined });
    workflow = updateWorkflowStep(workflow, "step-2", { status: "success" });
    workflow = updateWorkflowStep(workflow, "step-5", { status: "skipped" });
    expect(workflow.steps.find((step) => step.id === "step-5")?.status).toBe("skipped");
    workflow = cancelBoardWorkflow(workflow);
    expect(workflow.status).toBe("cancelled");
    expect(workflow.steps.every((step) => ["success", "skipped", "cancelled"].includes(step.status))).toBe(true);
  });

  it("labels deterministic result verification without overstating it", () => {
    const { board } = setup();
    const result = {
      id: "result",
      type: "math-result" as const,
      actionType: "factor" as const,
      sourceElementIds: ["quadratic"],
      title: "Factor",
      status: "success" as const,
      inputLatex: "x^2-5x+6",
      exactOutputLatex: "(x-2)(x-3)",
      engine: { adapter: "cas", underlyingEngine: "Nerdamer" },
      collapsed: false,
      bounds: { x: 300, y: 20, width: 300, height: 200 },
      createdAt: board.createdAt,
      updatedAt: board.createdAt,
    };
    expect(verifyBoardResult(result)).toEqual({ status: "verified-with-conditions", label: "Computed by existing CAS" });
  });
});
