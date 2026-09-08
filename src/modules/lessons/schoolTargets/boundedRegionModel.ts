import { analyzeRegion, type RegionConstraint } from "./feasibleRegionModel";
export function boundedConstraints(k=10,limit=7,enabled=[true,true,true,true]):RegionConstraint[] {
  return [
    {a:-1,b:0,c:0,label:"x ≥ 0",color:"#267bff",enabled:enabled[0]},
    {a:0,b:-1,c:0,label:"y ≥ 0",color:"#06a87a",enabled:enabled[1]},
    {a:1,b:1,c:limit,label:`x + y ≤ ${limit}`,color:"#9244ff",enabled:enabled[2]},
    {a:2,b:1,c:k,label:`2x + y ≤ ${k}`,color:"#ff7b24",enabled:enabled[3]},
  ];
}
export const boundedPractice=()=>analyzeRegion([
  ...boundedConstraints().slice(0,2),
  {a:1,b:2,c:8,label:"x + 2y ≤ 8",color:"#9244ff",enabled:true},
  {a:3,b:1,c:12,label:"3x + y ≤ 12",color:"#ff7b24",enabled:true},
]);
