import { polygonArea, polygonHull } from "d3";
export type RegionPoint = [number, number];
export type RegionConstraint = { a: number; b: number; c: number; label: string; color: string; enabled: boolean; shaded?: boolean };
export const DEFAULT_REGION: RegionConstraint[] = [
  { a:1,b:2,c:40,label:"x + 2y ≤ 40",color:"#3168ff",enabled:true },
  { a:3,b:2,c:60,label:"3x + 2y ≤ 60",color:"#ff8a16",enabled:true },
  { a:-1,b:0,c:0,label:"x ≥ 0",color:"#526170",enabled:true },
  { a:0,b:-1,c:0,label:"y ≥ 0",color:"#526170",enabled:true },
];
export const satisfiesRegion = (point: RegionPoint, constraint: RegionConstraint) => constraint.a*point[0]+constraint.b*point[1] <= constraint.c+1e-8;
export function regionVertices(constraints: RegionConstraint[]): RegionPoint[] {
  const active = constraints.filter(c => c.enabled);
  const points: RegionPoint[] = [];
  active.forEach((first,i) => active.slice(i+1).forEach(second => {
    const determinant = first.a*second.b-second.a*first.b;
    if (Math.abs(determinant)<1e-10) return;
    const point: RegionPoint = [(first.c*second.b-second.c*first.b)/determinant,(first.a*second.c-second.a*first.c)/determinant];
    if (Object.is(point[0],-0)) point[0]=0;
    if (Object.is(point[1],-0)) point[1]=0;
    if (active.every(c => satisfiesRegion(point,c)) && !points.some(p => Math.hypot(p[0]-point[0],p[1]-point[1])<1e-8)) points.push(point);
  }));
  const hull = polygonHull(points) || points;
  const center = hull.reduce((p,q) => [p[0]+q[0]/hull.length,p[1]+q[1]/hull.length] as RegionPoint,[0,0] as RegionPoint);
  return hull.sort((p,q) => Math.atan2(p[1]-center[1],p[0]-center[0])-Math.atan2(q[1]-center[1],q[0]-center[0]));
}
export function analyzeRegion(constraints: RegionConstraint[]) {
  const active=constraints.filter(c=>c.enabled), vertices=regionVertices(active);
  const candidates: RegionPoint[] = [[0,0],...vertices,...active.map(c => {const s=c.a*c.a+c.b*c.b; return [c.a*c.c/s,c.b*c.c/s] as RegionPoint;})];
  const empty=!candidates.some(p=>active.every(c=>satisfiesRegion(p,c)));
  const directions: RegionPoint[] = [[1,0],[-1,0],[0,1],[0,-1],...active.flatMap(c=>[[c.b,-c.a],[-c.b,c.a]] as RegionPoint[])];
  const rays=directions.filter(p=>Math.hypot(...p)>1e-8 && active.every(c=>c.a*p[0]+c.b*p[1]<=1e-8));
  const unbounded=!empty && rays.length>0;
  const objectiveUnbounded=unbounded && rays.some(p=>50*p[0]+40*p[1]>1e-8);
  const optimum=vertices.reduce<RegionPoint|null>((best,p)=>!best || 50*p[0]+40*p[1]>50*best[0]+40*best[1]?p:best,null);
  return { vertices, kind:empty?"EMPTY":unbounded?"UNBOUNDED":"BOUNDED", area:empty?0:unbounded?null:Math.abs(polygonArea(vertices)), optimum:empty||objectiveUnbounded?null:optimum, objectiveUnbounded };
}
export function visibleRegion(constraints: RegionConstraint[], bounds={left:-5,right:45,top:35,bottom:-5}) {
  return regionVertices([...constraints,{a:1,b:0,c:bounds.right,label:"",color:"",enabled:true},{a:-1,b:0,c:-bounds.left,label:"",color:"",enabled:true},{a:0,b:1,c:bounds.top,label:"",color:"",enabled:true},{a:0,b:-1,c:-bounds.bottom,label:"",color:"",enabled:true}]);
}
