import { describe, expect, it } from "vitest";
import { calculatedColumn, exportCsv, filterDataset, parseDataset, removeDuplicates, summarize } from "./dataframe";
import { regressionCard } from "./analysisCard";
import { fitSimpleLinearRegression, recommendMethod, twoSampleComparison } from "./statistics";

describe("general dataframe and statistics", () => {
  const source = "group,x,y\nA,1,3\nA,2,5\nB,3,7\nB,,9\nB,3,7";
  it("imports, types, filters, calculates and preserves provenance", () => { const data = parseDataset(source); expect(data.columns.map((column) => column.type)).toEqual(["CATEGORY", "INTEGER", "INTEGER"]); const filtered = filterDataset(data, data.columns[1].id, "NOT_MISSING"); const calculated = calculatedColumn(filtered, "double_x", [data.columns[1].id], (row) => Number(row[data.columns[1].id]) * 2); const unique = removeDuplicates(calculated); expect(unique.rows).toHaveLength(3); expect(unique.transformations.map((item) => item.operation)).toEqual(["FILTER", "CALCULATED_COLUMN", "REMOVE_DUPLICATES"]); expect(data.rows).toHaveLength(5); });
  it("calculates rich summaries", () => { const result = summarize([1, 2, 3, 4, null]); expect(result).toMatchObject({ count: 4, missing: 1, mean: 2.5, median: 2.5, q1: 1.75, q3: 3.25 }); });
  it("fits a general dataset-driven model and portable card", () => { const data = parseDataset("x,y\n0,1\n1,3\n2,5\n3,7\n4,9"); const model = fitSimpleLinearRegression(data, data.columns[1].id, data.columns[0].id); expect(model.status).toBe("COMPLETE"); expect(model.coefficients[1].estimate).toBeCloseTo(2); expect(regressionCard(data, model).charts).toHaveLength(3); });
  it("does not coerce missing regression values to zero", () => { const data = parseDataset("x,y\n1,3\n2,5\n,99\n3,7\n3,7"); const model = fitSimpleLinearRegression(data, data.columns[1].id, data.columns[0].id); expect(model.trainingRows).not.toContain(2); expect(model.coefficients[1].estimate).toBeCloseTo(2); });
  it("runs inference with effect size and limitations", () => { const data = parseDataset("group,value\nA,1\nA,2\nA,3\nB,3\nB,4\nB,5"); const result = twoSampleComparison(data, data.columns[1].id, data.columns[0].id, "A", "B"); expect(result.method).toContain("Welch"); expect(Number.isFinite(result.effectSize.value)).toBe(true); expect(result.limitations.join(" ")).toContain("causation"); });
  it("uses explicit educational selection rules", () => { const result = recommendMethod({ outcomeType: "NUMERIC", groups: 2, paired: false, independent: true, observational: true, sampleSize: 40, severeSkew: false }); expect(result.recommended[0]).toContain("Welch"); expect(result.warnings.join(" ")).toContain("causal"); });
  it("neutralizes spreadsheet formulas on CSV export", () => { const data = parseDataset("name,value\n=CMD(),2"); expect(exportCsv(data)).toContain("'=CMD()"); });
});
