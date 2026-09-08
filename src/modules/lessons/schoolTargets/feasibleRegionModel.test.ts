import { expect,it } from "vitest";
import { DEFAULT_REGION,analyzeRegion,visibleRegion } from "./feasibleRegionModel";
it("keeps feasibility and optimization unchanged when shading is hidden",()=>{
  expect(analyzeRegion(DEFAULT_REGION.map(c=>({...c,shaded:false})))).toEqual(analyzeRegion(DEFAULT_REGION));
});
it("computes the four vertices, true area and optimum",()=>{
  const model=analyzeRegion(DEFAULT_REGION);
  expect(model.kind).toBe("BOUNDED");expect(model.area).toBe(250);
  expect(model.vertices).toEqual([[0,0],[20,0],[10,15],[0,20]]);
  expect(model.optimum).toEqual([10,15]);
});
it("classifies the positive quadrant as unbounded",()=>{
  const model=analyzeRegion(DEFAULT_REGION.map((c,i)=>({...c,enabled:i>=2})));
  expect(model.kind).toBe("UNBOUNDED");expect(model.objectiveUnbounded).toBe(true);
});
it("detects contradictory first-quadrant constraints",()=>{
  expect(analyzeRegion(DEFAULT_REGION.map((c,i)=>i===0?{...c,c:-1}:c)).kind).toBe("EMPTY");
});
it("clips unbounded shading to the supplied zoom viewport without changing classification",()=>{
  const constraints=DEFAULT_REGION.map((c,i)=>({...c,enabled:i>=2}));
  const polygon=visibleRegion(constraints,{left:-10,right:80,top:60,bottom:-10});
  expect(polygon).toEqual([[0,0],[80,0],[80,60],[0,60]]);
  expect(analyzeRegion(constraints).kind).toBe("UNBOUNDED");
});
