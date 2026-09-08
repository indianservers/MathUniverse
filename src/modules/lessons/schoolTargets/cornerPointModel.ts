import { regionVertices, type RegionConstraint } from "./feasibleRegionModel";
export function cornerPointModel(c1:number,c2:number,cx:number,cy:number) {
  const constraints:RegionConstraint[]=[
    {a:1,b:1,c:c1,label:`x + y ≤ ${c1}`,color:"#248bff",enabled:true},
    {a:1,b:2,c:c2,label:`x + 2y ≤ ${c2}`,color:"#954aff",enabled:true},
    {a:-1,b:0,c:0,label:"x ≥ 0",color:"#727e8b",enabled:true},
    {a:0,b:-1,c:0,label:"y ≥ 0",color:"#727e8b",enabled:true},
  ];
  const vertices=regionVertices(constraints).map((point,index)=>({point,label:index===0?"O":String.fromCharCode(64+index),value:cx*point[0]+cy*point[1]}));
  const maximum=vertices.length?Math.max(...vertices.map(v=>v.value)):null;
  return {constraints,vertices,maximum,best:vertices.filter(v=>maximum!==null&&Math.abs(v.value-maximum)<1e-8)};
}
