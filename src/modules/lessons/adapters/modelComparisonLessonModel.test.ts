import { describe, expect, it } from "vitest";
import { comparisonDefault, compareModels } from "./modelComparisonLessonModel";
describe("Model comparison", () => { it("returns all model metrics", () => { const models = compareModels(); expect(models.linear.r2).toBeGreaterThan(0); expect(models.quadratic.rmse).toBeGreaterThanOrEqual(0); expect(models.exponential.params).toBe(2); }); it("supports edited data", () => { expect(compareModels([{ x: 1, y: 1 }, { x: 2, y: 2 }]).linear.rmse).toBeCloseTo(0); expect(comparisonDefault).toHaveLength(10); }); });


describe("model curve correctness", () => {
  it("fits exponential growth against x instead of a power law", () => {
    const points = Array.from({length:8}, (_,i) => ({x:i+1,y:3*Math.exp(.4*(i+1))}));
    const fit = compareModels(points).exponential;
    expect(fit.valid).toBe(true);
    expect(fit.rmse).toBeLessThan(1e-10);
    expect(fit.predict(4.5)).toBeCloseTo(3*Math.exp(.4*4.5),10);
  });
  it("fits linear and quadratic datasets and reports the defined teaching score", () => {
    const xs = Array.from({length:8}, (_,i) => i+1);
    const line = compareModels(xs.map(x=>({x,y:2+3*x}))).linear;
    const quadratic = compareModels(xs.map(x=>({x,y:2-x+.7*x*x}))).quadratic;
    expect(line.rmse).toBeLessThan(1e-10);
    expect(quadratic.predict(3.5)).toBeCloseTo(2-3.5+.7*3.5**2,9);
    expect(quadratic.score).toBeCloseTo(quadratic.sse+6,10);
  });
  it("marks unsupported fits as unavailable", () => {
    expect(compareModels([{x:1,y:-2},{x:2,y:3}]).exponential.valid).toBe(false);
    expect(compareModels([{x:1,y:1},{x:2,y:2}]).quadratic.valid).toBe(false);
    expect(compareModels([{x:1,y:2},{x:1,y:3},{x:1,y:4}]).linear.valid).toBe(false);
  });
});
