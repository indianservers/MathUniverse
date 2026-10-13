import {describe,it,expect} from 'vitest';
import {clipSystemRegion,coefficientRows,defaultSystemLines,lineExpression,parseSystemLine,satisfiesLine,solveSystemLines} from './systemsDashboardMath';
describe('systems dashboard models',()=>{
 it('preserves the displayed equations when building matrices',()=>{
  expect(coefficientRows(defaultSystemLines)).toEqual([[2,-1,-1],[1,1,4]]);
  const result=solveSystemLines(defaultSystemLines);
  expect(result.status).toBe('unique solution');expect(result.solution).toEqual([1,3]);
 });
 it('classifies dependent, inconsistent and extra-equation systems',()=>{
  expect(solveSystemLines([defaultSystemLines[0],{...defaultSystemLines[0]}]).status).toBe('infinitely many solutions');
  expect(solveSystemLines([defaultSystemLines[0],{...defaultSystemLines[0],b:4}]).status).toBe('inconsistent');
  expect(solveSystemLines([...defaultSystemLines,{m:1,b:2,relation:'>='}]).solution).toEqual([1,3]);
  expect(solveSystemLines([...defaultSystemLines,{m:1,b:0,relation:'>='}]).status).toBe('inconsistent');
 });
 it('parses editable lines and rejects unsupported expressions',()=>{
  expect(parseSystemLine('y = −x + 4')).toEqual({m:-1,b:4});expect(parseSystemLine('y = .5x − 2')).toEqual({m:.5,b:-2});
  expect(parseSystemLine('y = 3')).toEqual({m:0,b:3});expect(parseSystemLine('y = x²')).toBeUndefined();
  expect(lineExpression(defaultSystemLines[1])).toBe('−x + 4');
 });
 it('tests strict boundaries and clips the common feasible region',()=>{
  expect(defaultSystemLines.every(l=>satisfiesLine(l,0,2))).toBe(true);
  expect(defaultSystemLines.every(l=>satisfiesLine(l,0,0))).toBe(false);
  expect(satisfiesLine(defaultSystemLines[0],1,3)).toBe(true);expect(satisfiesLine(defaultSystemLines[1],1,3)).toBe(false);
  const polygon=clipSystemRegion(defaultSystemLines,6);expect(polygon.length).toBeGreaterThan(2);
  for(const [x,y] of polygon){expect(y-2*x-1).toBeGreaterThanOrEqual(-1e-8);expect(y+x-4).toBeLessThanOrEqual(1e-8);}
 });
});
