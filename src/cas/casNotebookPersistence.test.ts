import { describe, expect, it } from "vitest";
import { readCasNotebookState, saveCasNotebookState } from "./casNotebookPersistence";
import type { NotebookState } from "./casNotebookEngine";

describe("casNotebookPersistence", () => {
  it("restores a valid notebook after cross-workspace navigation", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
    const state = { assumptions: "x real", mode: "exact", cells: [{ id: "1", input: "x^2", operation: "factor", output: "x^2", ok: true, detail: "", steps: [], createdAt: "test" }] } satisfies NotebookState;
    saveCasNotebookState(state, storage);
    expect(readCasNotebookState(storage)).toEqual(state);
  });
});
