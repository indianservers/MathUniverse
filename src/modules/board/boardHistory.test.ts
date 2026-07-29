import { describe, expect, it } from "vitest";
import { executeCommand, undoCommand } from "./boardHistory";
import { createBoardDocument } from "./boardPersistence";
import type { StrokeElement } from "./types";

const stroke: StrokeElement = {
  id: "stroke",
  type: "stroke",
  points: [{ x: 2, y: 3, pressure: 0.5, time: 0 }],
  tool: "pen",
  width: 2,
  opacity: 1,
  color: "#000",
  bounds: { x: 2, y: 3, width: 0, height: 0 },
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("board command history", () => {
  it("adds and undoes a stroke without snapshot cloning", () => {
    const board = createBoardDocument();
    const command = { type: "add" as const, elements: [stroke] };
    const changed = executeCommand(board, command);
    expect(changed.elements).toHaveLength(1);
    expect(undoCommand(changed, command).elements).toHaveLength(0);
  });

  it("deletes, moves, clears, and restores elements", () => {
    const board = { ...createBoardDocument(), elements: [stroke] };
    const moved = executeCommand(board, { type: "move", ids: [stroke.id], dx: 8, dy: 7 });
    expect(moved.elements[0].bounds).toMatchObject({ x: 10, y: 10 });
    const deleted = executeCommand(board, { type: "delete", elements: [stroke] });
    expect(deleted.elements).toHaveLength(0);
    expect(undoCommand(deleted, { type: "delete", elements: [stroke] }).elements).toHaveLength(1);
    expect(executeCommand(board, { type: "clear", elements: [stroke] }).elements).toHaveLength(0);
  });
});

