import { describe, expect, it } from "vitest";
import { createCasCard, createDynamicTable, createListObject } from "./casTableKernel";

describe("CAS and dynamic table kernel", () => {
  it("creates highlighted dynamic tables for multiple expressions", () => {
    const table = createDynamicTable(["x", "x^2-1"], -1, 1, 1, (expression, x) => {
      if (expression === "x") return x;
      return x * x - 1;
    });

    expect(table.rows).toHaveLength(3);
    expect(table.rows.some((row) => row.highlight)).toBe(true);
    expect(table.exportCsv).toContain("x^2-1");
    expect(table.classroomTasks.length).toBeGreaterThan(2);
  });

  it("creates linked CAS cards with verification prompts", () => {
    const card = createCasCard("Factor", "x^2-5*x+6");

    expect(card.result).toContain("x");
    expect(card.linkedGraphExpressions).toContain("x^2-5*x+6");
    expect(card.verificationPrompts.length).toBe(3);
  });

  it("summarizes list objects", () => {
    const list = createListObject(["1", "2", "3", "bad"]);

    expect(list.length).toBe(3);
    expect(list.sum).toBe(6);
    expect(list.mean).toBe(2);
  });
});
