import { analyzeRegion,satisfiesRegion,type RegionConstraint,type RegionPoint } from "./feasibleRegionModel";
export function unboundedConstraints(offsets=[0,0,-2,4],enabled=[true,true,true,true]):RegionConstraint[] {
  return [
    {a:-1,b:0,c:-offsets[0],label:`x ≥ ${offsets[0]}`,color:"#0ab768",enabled:enabled[0]},
    {a:0,b:-1,c:-offsets[1],label:`y ≥ ${offsets[1]}`,color:"#ff8514",enabled:enabled[1]},
    {a:1,b:-1,c:-offsets[2],label:`y ≥ x ${offsets[2]<0?"−":"+"} ${Math.abs(offsets[2])}`,color:"#2875ff",enabled:enabled[2]},
    {a:-1,b:-1,c:-offsets[3],label:`x + y ≥ ${offsets[3]}`,color:"#7941e9",enabled:enabled[3]},
  ];
}
export const isRecessionDirection=(constraints:RegionConstraint[],d:RegionPoint)=>Math.hypot(...d)>1e-9&&constraints.filter(c=>c.enabled).every(c=>c.a*d[0]+c.b*d[1]<=1e-8);
export function unboundedObjective(constraints:RegionConstraint[],mode:"min"|"max") {
  const active=constraints.filter(c=>c.enabled),region=analyzeRegion(constraints);
  const directions:RegionPoint[]=[[1,0],[-1,0],[0,1],[0,-1],...active.flatMap(c=>[[c.b,-c.a],[-c.b,c.a]] as RegionPoint[])];
  const unbounded=region.kind!=="EMPTY"&&directions.some(d=>isRecessionDirection(active,d)&&(mode==="max"?d[0]+d[1]>1e-8:d[0]+d[1]<-1e-8));
  const candidates:RegionPoint[]=[...region.vertices,[0,0],...active.map(c=>{const norm=c.a*c.a+c.b*c.b;return [c.a*c.c/norm,c.b*c.c/norm] as RegionPoint;})].filter(p=>active.every(c=>satisfiesRegion(p,c)));
  const value=unbounded||region.kind==="EMPTY"?null:(mode==="min"?Math.min:Math.max)(...candidates.map(p=>p[0]+p[1]));
  const best=candidates.filter((p,i)=>value!==null&&Math.abs(p[0]+p[1]-value)<1e-8&&!candidates.slice(0,i).some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<1e-8));
  return {region,unbounded,value,best};
}
