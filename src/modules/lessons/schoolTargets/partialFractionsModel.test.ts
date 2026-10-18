import{describe,expect,it}from"vitest";
import{coefficientState,parseFraction,primitive,rationalBranches,rationalFunction,solveLinearFractions,stepFraction}from"./partialFractionsModel";
describe("partial fractions",()=>{
 it("solves and recombines both examples with correct signs",()=>{
  expect(solveLinearFractions(3,5,1,2)).toEqual({a:2,b:1});const p=solveLinearFractions(2,7,-3,2);expect(p.a).toBeCloseTo(13/5);expect(p.b).toBeCloseTo(-3/5);expect(coefficientState(2,1).solved).toBe(true);expect(coefficientState(p.a,p.b,true).solved).toBe(true);expect(coefficientState(null,1).solved).toBe(false);expect(coefficientState(2.0001,.9999).solved).toBe(false);expect(coefficientState(1,2).xMatches).toBe(true);expect(coefficientState(1,2).constantMatches).toBe(false);
  for(const x of[-5,-2.5,-1.5,0,1,4])expect(2/(x+1)+1/(x+2)).toBeCloseTo(rationalFunction(x)!);for(const x of[-5,-1,0,2,4])expect(p.a/(x-3)+p.b/(x+2)).toBeCloseTo((2*x+7)/((x-3)*(x+2)));
 });
 it("plots three real decreasing branches without crossing poles and verifies both primitives",()=>{
  const branches=rationalBranches();expect(branches).toHaveLength(3);for(const points of branches){expect(points).toHaveLength(1001);for(let i=1;i<points.length;i++){expect(points[i].x).toBeGreaterThan(points[i-1].x);expect(points[i].y).toBeLessThan(points[i-1].y);expect(points[i].y).toBeCloseTo(rationalFunction(points[i].x)!,10);}}
  expect(branches[0].at(-1)!.x).toBeLessThan(-2);expect(branches[1][0].x).toBeGreaterThan(-2);expect(branches[1].at(-1)!.x).toBeLessThan(-1);expect(branches[2][0].x).toBeGreaterThan(-1);expect(rationalFunction(-2)).toBeNull();expect(rationalFunction(-1)).toBeNull();expect(rationalFunction(-5/3)).toBeCloseTo(0);expect(rationalFunction(0)).toBe(2.5);
  for(const practice of[false,true])for(const x of[-5,-2.5,-1.5,0,1,4]){const h=1e-5,derivative=(primitive(x+h,practice)!-primitive(x-h,practice)!)/(2*h),expected=practice?(2*x+7)/((x-3)*(x+2)):rationalFunction(x)!;expect(derivative).toBeCloseTo(expected,7);}expect(primitive(-1)).toBeNull();expect(primitive(3,true)).toBeNull();
 });
 it("parses finite fractions and decimals safely and steps fifths without drift",()=>{
  expect(parseFraction("13/5")).toBe(2.6);expect(parseFraction("−3/5")).toBe(-.6);expect(parseFraction("\\frac{13}{5}")).toBe(2.6);expect(stepFraction("13/5",.2)).toBe("14/5");expect(stepFraction("-3/5",-.2)).toBe("-4/5");expect(stepFraction("2.6",.2)).toBe("2.8");for(const value of["","1/0","Infinity","2+1","NaN","alert(1)"])expect(parseFraction(value)).toBeNull();
 });
});
