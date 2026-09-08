import { describe, expect, it } from "vitest";
import {
  DEFAULT_TABLE_EXPRESSION,
  buildValueRows,
  fitTableView,
  parseQuadraticRule,
  tableCurvePath,
  valueDifferences,
} from "./tableValuesLesson47Model";

describe("table of values lesson 47 model", () => {
  it("parses the target rule and generates every table row", () => {
    const rule = parseQuadraticRule(DEFAULT_TABLE_EXPRESSION)!;
    expect(rule).toEqual({ a: 1, b: -2, c: -3 });
    expect(buildValueRows(rule, 1).map((row) => row.y)).toEqual([
      5, 0, -3, -4, -3, 0, 5,
    ]);
  });

  it("derives first and constant second differences", () => {
    const rows = buildValueRows(
      parseQuadraticRule(DEFAULT_TABLE_EXPRESSION)!,
      1,
    );
    expect(valueDifferences(rows).first).toEqual([null, -5, -3, -1, 1, 3, 5]);
    expect(valueDifferences(rows).constantSecond).toBe(2);
  });

  it("fits a viewport and generates the actual function curve", () => {
    const rule = parseQuadraticRule(DEFAULT_TABLE_EXPRESSION)!;
    const view = fitTableView(buildValueRows(rule, 2));
    expect(view.xMax).toBe(9);
    expect(tableCurvePath(rule, view).split(" ")).toHaveLength(301);
  });
});
