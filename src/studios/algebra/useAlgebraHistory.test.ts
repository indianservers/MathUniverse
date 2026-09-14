import { describe, expect, it } from "vitest";
import { AlgebraHistory } from "./algebraHistory";

describe("AlgebraHistory", () => {
  it("undoes discrete commits and treats replace as a live preview", () => {
    const history = new AlgebraHistory({ a: 1, b: 0 });
    history.commit({ a: 2, b: 0 });
    history.replace({ a: 2, b: 9 });
    expect(history.present).toEqual({ a: 2, b: 9 });
    history.undo();
    expect(history.present).toEqual({ a: 2, b: 0 });
    history.undo();
    expect(history.present).toEqual({ a: 1, b: 0 });
    history.redo();
    expect(history.present).toEqual({ a: 2, b: 0 });
    history.reset({ a: 1, b: 0 });
    expect(history.present).toEqual({ a: 1, b: 0 });
    expect(history.canUndo).toBe(false);
    expect(history.canRedo).toBe(false);
  });
});
