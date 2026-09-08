import { describe,expect,it } from "vitest";
import { gammaCheck,gammaCheckpoints,gammaIntegrand,gammaLens,gammaValue } from "./gammaLessonModel";
describe("Gamma lesson mathematics",()=>{
  it("matches factorial checkpoints and half integers",()=>{let factorial=1;for(let n=1;n<=8;n++){if(n>1)factorial*=n-1;expect(gammaValue(n)).toBeCloseTo(factorial,8);}expect(gammaValue(.5)).toBeCloseTo(Math.sqrt(Math.PI),12);expect(gammaValue(1.5)).toBeCloseTo(Math.sqrt(Math.PI)/2,12);expect(gammaValue(-.5)).toBeCloseTo(-2*Math.sqrt(Math.PI),12);expect(gammaCheckpoints).toHaveLength(6);});
  it("satisfies recurrence on positive and negative nonpole inputs",()=>{for(const x of [-4.8,-3.5,-2.2,-.5,.2,.7,1.4,3.7,6])expect(gammaValue(x+1)).toBeCloseTo(x*gammaValue(x)!,9);});
  it("marks every nonpositive integer as undefined",()=>{for(const x of [0,-1,-2,-3,-4])expect(gammaValue(x)).toBeNull();expect(gammaValue(NaN)).toBeNull();expect(gammaValue(Infinity)).toBeNull();});
  it("evaluates the finite integral independently of the Gamma evaluator",()=>{const lens=gammaLens(3);expect(lens.partial).toBeCloseTo(2-170*Math.exp(-12),9);expect(lens.total).toBeCloseTo(2,12);expect(lens.tail).toBeCloseTo(170*Math.exp(-12),9);});
  it("handles the singular endpoint with a smooth integration substitution",()=>{expect(gammaIntegrand(.5,0)).toBe(Infinity);expect(gammaIntegrand(1,0)).toBe(1);expect(gammaIntegrand(3,0)).toBe(0);for(const x of [.2,.5,.99,1.1,2.5,6]){const lens=gammaLens(x,60);expect(lens.partial).toBeCloseTo(gammaValue(x)!,6);}});
  it("does not falsely impose increasing values on the whole positive axis",()=>{expect(gammaValue(.5)!).toBeGreaterThan(gammaValue(1)!);expect(gammaValue(1.5)!).toBeLessThan(gammaValue(1)!);expect(gammaValue(3)!).toBeGreaterThan(gammaValue(2)!);});
  it("checks numeric practice with a tolerance and rejects missing answers",()=>{expect(gammaCheck("0.886227",Math.sqrt(Math.PI)/2)).toBe(true);expect(gammaCheck("",0)).toBe(false);expect(gammaCheck("Infinity",120)).toBe(false);expect(gammaCheck("120",24)).toBe(false);});
});
