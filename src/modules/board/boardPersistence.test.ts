import { describe, expect, it } from "vitest";
import {
  BOARD_DRAFT_KEY,
  createBoardDocument,
  deleteBoard,
  readBoardLibrary,
  recoverDraft,
  saveBoard,
  saveDraft,
  serializeBoard,
} from "./boardPersistence";

describe("board persistence", () => {
  it("saves, reloads, renames, and deletes versioned Boards", () => {
    const board = createBoardDocument("Calculus notes");
    saveBoard(board);
    expect(readBoardLibrary()).toHaveLength(1);
    saveBoard({ ...board, title: "Renamed notes" });
    expect(readBoardLibrary()).toHaveLength(1);
    expect(readBoardLibrary()[0].title).toBe("Renamed notes");
    expect(deleteBoard(board.id)).toHaveLength(0);
  });

  it("autosaves and recovers a draft after refresh", () => {
    const board = createBoardDocument("Recovered");
    saveDraft(board);
    expect(JSON.parse(localStorage.getItem(BOARD_DRAFT_KEY) ?? "{}").schemaVersion).toBe(1);
    expect(recoverDraft()?.title).toBe("Recovered");
    expect(serializeBoard(board).schemaVersion).toBe(1);
  });

  it("handles invalid persisted data safely", () => {
    localStorage.setItem(BOARD_DRAFT_KEY, "{broken");
    expect(recoverDraft()).toBeNull();
  });

  it("persists structured results, relationships, and action history", () => {
    const board = createBoardDocument("Phase 2");
    board.elements.push({
      id: "result-1",
      type: "math-result",
      actionType: "factor",
      sourceElementIds: ["math-1"],
      title: "Factor",
      status: "success",
      inputLatex: "x^2-1",
      exactOutputLatex: "(x-1)(x+1)",
      engine: { adapter: "cas", underlyingEngine: "Existing CAS" },
      collapsed: false,
      bounds: { x: 0, y: 0, width: 300, height: 200 },
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    });
    board.relationships.push({
      id: "rel-1",
      type: "derived-from",
      sourceElementId: "math-1",
      targetElementId: "result-1",
      createdAt: board.createdAt,
    });
    board.actionHistory.push({
      id: "action-1",
      actionType: "factor",
      sourceElementId: "math-1",
      resultElementId: "result-1",
      inputExpression: "x^2-1",
      normalizedExpression: "x^2-1",
      parameters: {},
      engineAdapter: "cas",
      underlyingEngine: "Existing CAS",
      startedAt: board.createdAt,
      completedAt: board.updatedAt,
      result: "(x-1)(x+1)",
      cancelled: false,
    });
    saveBoard(board);
    const restored = readBoardLibrary()[0];
    expect(restored.elements[0].type).toBe("math-result");
    expect(restored.relationships[0].targetElementId).toBe("result-1");
    expect(restored.actionHistory[0].result).toBe("(x-1)(x+1)");
  });
});
