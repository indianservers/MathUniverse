import { expect,it } from "vitest";
import { multipleOptimalModel } from "./multipleOptimalModel";
it("finds the whole AB edge for the default objective",()=>{
 const model=multipleOptimalModel(1,1);expect(model.wholeAB).toBe(true);expect(model.value).toBe(4);expect(model.slope).toBe(-1);expect(model.samples.every(p=>p.value===4)).toBe(true);
});
it("collapses to A when the objective rotates",()=>{
 const model=multipleOptimalModel(2,1);expect(model.kind).toBe("point");expect(model.best[0].label).toBe("A");expect(model.value).toBe(8);
});
it("does not confuse parallelism with optimality for negative or minimized objectives",()=>{
 expect(multipleOptimalModel(-1,-1).best[0].label).toBe("O");
 expect(multipleOptimalModel(1,1,"min").best[0].label).toBe("O");
 expect(multipleOptimalModel(-1,-1,"min").wholeAB).toBe(true);
 expect(multipleOptimalModel(0,0).kind).toBe("region");
 expect(multipleOptimalModel(1,0).slope).toBeNull();
});
