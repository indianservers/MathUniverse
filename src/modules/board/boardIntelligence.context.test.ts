import { describe, expect, it } from "vitest";
import { createBoardDocument } from "./boardPersistence";
import {
  buildBoardIntelligenceContext,
  createBoardSessionMemory,
  dismissBoardRecommendation,
  resolveBoardAmbiguity,
  understandBoardContext,
} from "./boardIntelligence";
import type { BoardDocument, MathExpressionElement } from "./types";

function expression(id: string, latex: string, x = 20, y = 20, confidence = 0.98): MathExpressionElement {
  return {
    id,
    type: "math-expression",
    latex,
    sourceStrokeIds: [],
    recognitionConfidence: confidence,
    bounds: { x, y, width: 220, height: 60 },
    createdAt: new Date().toISOString(),
  };
}

function quadraticBoard(): BoardDocument {
  const board = createBoardDocument("Quadratic");
  board.elements = [expression("quadratic", "x^2-5x+6=0")];
  return board;
}

describe("Board intelligence context", () => {
  it("includes only the selection and directly linked elements", () => {
    const board = quadraticBoard();
    board.elements.push(expression("linked", "(x-2)(x-3)=0", 300, 20), expression("unrelated", "y=9", 20, 400));
    board.relationships.push({
      id: "relation-1",
      type: "derived-from",
      sourceElementId: "quadratic",
      targetElementId: "linked",
      createdAt: board.createdAt,
    });
    const context = buildBoardIntelligenceContext({ document: board, selectedElementIds: ["quadratic"] });
    expect(context.elements.map((item) => item.id)).toEqual(["quadratic", "linked"]);
    expect(context.elements.some((item) => item.id === "unrelated")).toBe(false);
    expect(context.relationships).toHaveLength(1);
  });

  it("preserves logical top-to-bottom reading order", () => {
    const board = quadraticBoard();
    board.elements = [
      expression("third", "x=3", 20, 220),
      expression("first", "x^2-5x+6=0", 20, 20),
      expression("second", "(x-2)(x-3)=0", 20, 120),
    ];
    const context = buildBoardIntelligenceContext({ document: board, selectedElementIds: ["third", "first", "second"] });
    expect(context.elements.map((item) => item.id)).toEqual(["first", "second", "third"]);
  });

  it("enforces element and token limits and records omissions", () => {
    const board = quadraticBoard();
    board.elements.push(expression("second", "x".repeat(1_000), 20, 120));
    const context = buildBoardIntelligenceContext({
      document: board,
      selectedElementIds: ["quadratic", "second"],
      maxElements: 1,
      maxEstimatedTokens: 128,
    });
    expect(context.elements).toHaveLength(1);
    expect(context.metrics.omittedElementCount).toBe(1);
    expect(context.omittedElementIds).toContain("second");
  });

  it("never includes image data URLs in structured AI context", () => {
    const board = createBoardDocument();
    board.elements.push({
      id: "image-1",
      type: "image",
      source: "upload",
      dataUrl: "data:image/png;base64,SECRETPIXELS",
      width: 200,
      height: 100,
      rotation: 0,
      opacity: 1,
      locked: false,
      recognitionRegions: [],
      bounds: { x: 0, y: 0, width: 200, height: 100 },
      createdAt: board.createdAt,
    });
    const context = buildBoardIntelligenceContext({ document: board, selectedElementIds: ["image-1"] });
    expect(JSON.stringify(context)).not.toContain("SECRETPIXELS");
    expect(context.metrics.croppedVisualCount).toBe(0);
  });

  it("identifies an active quadratic problem and local recommendations", () => {
    const board = quadraticBoard();
    const context = buildBoardIntelligenceContext({ document: board, selectedElementIds: ["quadratic"] });
    const result = understandBoardContext(context, board.intelligence.sessionMemory);
    expect(result.primarySubject).toBe("mathematics");
    expect(result.detectedConcepts[0]?.label).toBe("Quadratic equation");
    expect(result.activeProblem?.problemElementIds).toEqual(["quadratic"]);
    expect(result.recommendations.map((item) => item.action)).toEqual(expect.arrayContaining(["factor", "find-roots", "plot-2d"]));
    expect(result.intelligenceMode).toBe("deterministic");
  });

  it("extracts low-confidence recognition ambiguity and reuses a problem-scoped resolution", () => {
    const board = createBoardDocument();
    board.elements.push(expression("uncertain", "l=1", 20, 20, 0.51));
    let context = buildBoardIntelligenceContext({ document: board, selectedElementIds: ["uncertain"] });
    expect(context.pendingAmbiguities[0]?.requiresResolution).toBe(true);
    board.intelligence = resolveBoardAmbiguity(board.intelligence, "recognition:uncertain", "l=1");
    context = buildBoardIntelligenceContext({ document: board, selectedElementIds: ["uncertain"] });
    expect(context.pendingAmbiguities).toHaveLength(0);
  });

  it("suppresses dismissed and similar recommendations through Board-scoped memory", () => {
    const board = quadraticBoard();
    const context = buildBoardIntelligenceContext({ document: board, selectedElementIds: ["quadratic"] });
    const first = understandBoardContext(context, createBoardSessionMemory(board.id));
    const target = first.recommendations.find((item) => item.action === "factor")!;
    const persistence = dismissBoardRecommendation(board.intelligence, target.id, "dismiss", target.category);
    const second = understandBoardContext(context, persistence.sessionMemory);
    expect(second.recommendations.some((item) => item.id === target.id)).toBe(false);
  });

  it("reports unavailable subject engines honestly", () => {
    const board = createBoardDocument();
    board.elements.push({
      id: "sentence",
      type: "text",
      text: "She have completed her assignment.",
      bounds: { x: 10, y: 10, width: 300, height: 60 },
      createdAt: board.createdAt,
    });
    const context = buildBoardIntelligenceContext({ document: board, selectedElementIds: ["sentence"] });
    const result = understandBoardContext(context, board.intelligence.sessionMemory);
    expect(result.primarySubject).toBe("english");
    expect(result.recommendations[0]).toMatchObject({ action: "check-grammar", enabled: false });
    expect(result.recommendations[0]?.disabledReason).toContain("No verified English engine");
  });

  it("keeps Physics ownership while recording English as a supporting subject", () => {
    const board = createBoardDocument();
    board.elements.push(
      { id: "prompt", type: "text", text: "A car starts from rest. Find its final speed.", bounds: { x: 10, y: 10, width: 350, height: 50 }, createdAt: board.createdAt },
      { id: "values", type: "text", text: "velocity u = 0 m/s, acceleration a = 3 m/s^2", bounds: { x: 10, y: 80, width: 350, height: 50 }, createdAt: board.createdAt },
    );
    const context = buildBoardIntelligenceContext({ document: board, selectedElementIds: ["prompt", "values"] });
    const result = understandBoardContext(context, board.intelligence.sessionMemory);
    expect(result.primarySubject).toBe("physics");
    expect(result.supportingSubjects).toContain("english");
    expect(result.recommendations[0]).toMatchObject({ action: "open-unit-converter", enabled: true });
  });

  it("disables recommendations when a deterministic engine is partially unavailable", () => {
    const board = quadraticBoard();
    const context = buildBoardIntelligenceContext({
      document: board,
      selectedElementIds: ["quadratic"],
      serviceAvailability: { cas: false, graph2d: true },
    });
    const result = understandBoardContext(context, board.intelligence.sessionMemory);
    expect(result.intelligenceMode).toBe("partial");
    expect(result.recommendations.find((item) => item.action === "factor")).toMatchObject({
      enabled: false,
      disabledReason: "Existing CAS is unavailable.",
    });
    expect(result.recommendations.find((item) => item.action === "plot-2d")?.enabled).toBe(true);
  });
});
