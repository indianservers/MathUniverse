import { describe, expect, it } from "vitest";
import { sampleGraphExpression } from "../pages/MathLabGraphingCalculator";
import { compileFunction, generateTableValues, safeEvaluateFunction } from "../utils/mathEngine/graphSampler";
import { fitGraphView, zoomGraphView } from "./graphViewUtils";
import { sampledGraphIntersections } from "./sampleIntersections";
import { detectGraphVariables, createGraphVariable, substituteGraphVariables } from "./expressionEngine";
import { numericalCases, invalidCases, type RegressionCase } from "./graphRegressionFixtures";
const cases: RegressionCase[] = [];
const add = (name: string, run: () => void) => cases.push({ name, run });
for (const [expression, x, expected] of numericalCases) add(`numeric ${expression} at ${x}`, () => {
  const result = safeEvaluateFunction(expression, x);
  expect(result.valid).toBe(true); expect(result.y).toBeCloseTo(expected, 9);
});
for (const expression of invalidCases) add(`invalid ${JSON.stringify(expression)}`, () => {
  expect(compileFunction(expression).error).toBeTruthy();
  expect(sampleGraphExpression(expression, -3, 3, 80).error).toBeTruthy();
});
const plots = ["Y^2", "y\u00b2", "X=Y^2", "x=y^3", "x=2y", "y=x^2", "Y=X^3", "x^2+y^2=4", "Y^2=X", "x*y=1", "y<x", "y>=x^2", "x<2", "x>=-1", "(2,3)", "(-2,-3)", "[1,2,3]", "(0,0);(1,1)", "x=cos(t),y=sin(t)", "r=2"];
for (const expression of plots) add(`plot ${expression}`, () => {
 const result = sampleGraphExpression(expression, -3, 3, 80, -5, 5);
 expect(result.error).toBeUndefined(); expect(result.points.some(p => p.valid)).toBe(true);
 expect(result.points.filter(p => p.valid).every(p => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true);
 if (/^(Y\^2|y\u00b2|X=Y\^2)$/.test(expression)) expect(result.points[0]).toMatchObject({ x:25, y:-5 });
});
for (const expression of ["seq(n^2,1,5)", "seq(2n,0,4)", "recur(1,prev+1,5)", "cobweb(0.5,x/2,5)", "contour(x^2+y^2,1;4)", "vector(-y,x)", "slope(x-y)", "param(cos(t),sin(t),0,pi)", "r=2,theta=0..pi", "param(t,t^2,-2,2)"]) add(`advanced ${expression}`, () => {
 const result = sampleGraphExpression(expression,-3,3,80); expect(result.error).toBeUndefined(); expect(result.points.some(p=>p.valid)).toBe(true);
});
for (const [expression, start, end, step] of [["x",-2,2,1],["x^2",-3,3,1],["sin(x)",0,3,.5],["2x",2,-2,1],["5",0,2,.25],["sqrt(x)",0,4,1],["1/x",-2,2,1],["abs(x)",-1,1,.5],["x^3",0,2,.5],["cos(x)",3,0,.5]] as Array<[string,number,number,number]>) add(`table ${expression} ${start}..${end}`, () => {
 const result=generateTableValues(expression,start,end,step); expect(result.error).toBeUndefined(); expect(result.rows).toHaveLength(Math.round(Math.abs(end-start)/step)+1);
 for(const row of result.rows) { const oracle=safeEvaluateFunction(expression,row.x); expect(row.valid).toBe(oracle.valid); if(row.valid) expect(row.y).toBeCloseTo(oracle.y!,9); }
});
for (const factor of [.1,.5,.8,1,1.25,2,10,1e-10,1e10,0]) add(`view zoom ${factor}`, () => {
 const v=zoomGraphView({xMin:-10,xMax:10,yMin:-5,yMax:15},factor); expect((v.xMin+v.xMax)/2).toBeCloseTo(0); expect((v.yMin+v.yMax)/2).toBeCloseTo(5); expect(v.xMax-v.xMin).toBeGreaterThanOrEqual(1e-6-1e-9); expect(v.xMax-v.xMin).toBeLessThanOrEqual(1e8);
 const fitted=fitGraphView([{visible:true,points:[{x:2,y:3,valid:true},{x:4,y:7,valid:true}]}],v); expect(fitted.xMin).toBeLessThan(2); expect(fitted.yMax).toBeGreaterThan(7);
});
for (let intercept=-5;intercept<5;intercept++) add(`intersection y=x with y=${intercept}`,()=>{
 const line=(input:string)=>sampleGraphExpression(input,-10,10,120).points;
 const result=sampledGraphIntersections([{id:"a",points:line("x")},{id:"b",points:line(String(intercept))}]); expect(result).toHaveLength(1); expect(result[0].x).toBeCloseTo(intercept,5); expect(result[0].y).toBeCloseTo(intercept,5);
});
for (const expression of ["a*x", "b+x", "c*x^2", "d*sin(x)", "k+x", "sec(x)", "csc(x)", "cot(x)", "sign(x)", "sinc(x)"]) add(`variables ${expression}`,()=>{
 const name=expression[0]; const builtIn=/^(sec|csc|cot|sign|sinc)/.test(expression); expect(detectGraphVariables([expression])).toEqual(builtIn?[]:[name]);
 if(!builtIn) expect(substituteGraphVariables(expression,[createGraphVariable(name,2)])).not.toMatch(new RegExp(`\b${name}\b`));
});
if(cases.length!==150) throw new Error(`Expected 150 2D cases, got ${cases.length}`);
describe("2D graph: 150 regression cases",()=>cases.forEach((c,i)=>it(`2D-${String(i+1).padStart(3,"0")} ${c.name}`,c.run)));
