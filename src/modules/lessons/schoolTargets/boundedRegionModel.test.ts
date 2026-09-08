import { expect,it } from "vitest";
import { analyzeRegion } from "./feasibleRegionModel";
import { boundedConstraints,boundedPractice } from "./boundedRegionModel";
it("calculates the reference polygon",()=>{
 const model=analyzeRegion(boundedConstraints());
 expect(model.vertices).toEqual([[0,0],[5,0],[3,4],[0,7]]);expect(model.kind).toBe("BOUNDED");expect(model.area).toBe(20.5);
});
it("does not falsely call removal of a redundant resource limit unbounded",()=>{
 expect(analyzeRegion(boundedConstraints(10,7,[true,true,false,true])).kind).toBe("BOUNDED");
 expect(analyzeRegion(boundedConstraints(10,7,[false,true,true,true])).kind).toBe("UNBOUNDED");
});
it("recomputes changed constants and the separate practice",()=>{
 expect(analyzeRegion(boundedConstraints(4)).vertices).toEqual([[0,0],[2,0],[0,4]]);
 expect(boundedPractice().vertices).toEqual([[0,0],[4,0],[3.2,2.4],[0,4]]);
});
