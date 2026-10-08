export type Circle={id:'A'|'B'|'C';x:number;y:number;r:number};
export type Point={x:number;y:number};
export const defaultCircles:Circle[]=[{id:'A',x:265,y:200,r:143},{id:'B',x:435,y:200,r:143},{id:'C',x:350,y:323,r:143}];
export const inside=(p:Point,c:Circle)=>Math.hypot(p.x-c.x,p.y-c.y)<c.r;
export function clearsLabels(p:Point,circles:Circle[]):boolean {
 return circles.every((c,i)=>{
  const x=c.x+(i===0?-50:i===1?50:0),top=c.y+(i===2?50:-75),bottom=c.y+(i===2?105:-18);
  return Math.hypot(Math.max(x-75-p.x,0,p.x-x-75),Math.max(top-p.y,0,p.y-bottom))>=markerClearance;
 });
}
export const maskAt=(p:Point,circles:Circle[])=>circles.reduce((mask,c,i)=>mask|(inside(p,c)?1<<i:0),0);
// Include the 15-unit marker radius, its outline, and a visible gap.
export const markerClearance=22;
export function regionClearance(p:Point,mask:number,circles:Circle[]):number {
 return Math.min(p.x-20,700-p.x,p.y-20,480-p.y,...circles.map((c,i)=>{
  const distance=Math.hypot(p.x-c.x,p.y-c.y);
  return mask&(1<<i)?c.r-distance:distance-c.r;
 }));
}
export function layoutElements(u:string[],a:string[],b:string[],c:string[],circles:Circle[],preferred?:Record<string,Point>):Record<string,Point>{
 if(preferred&&u.every((item,i)=>{const p=preferred[item],mask=(a.includes(item)?1:0)|(b.includes(item)?2:0)|(c.includes(item)?4:0);return p&&maskAt(p,circles)===mask&&regionClearance(p,mask,circles)>=markerClearance&&clearsLabels(p,circles)&&u.slice(0,i).every(other=>Math.hypot(p.x-preferred[other].x,p.y-preferred[other].y)>=38);}))return Object.fromEntries(u.map(item=>[item,preferred[item]]));
 const positioned:Record<string,Point>={},byMask:Record<number,string[]>={};
 u.forEach(item=>{const mask=(a.includes(item)?1:0)|(b.includes(item)?2:0)|(c.includes(item)?4:0);(byMask[mask]??=[]).push(item);});
 for(const [maskText,items] of Object.entries(byMask)){
  const mask=Number(maskText),candidates:Point[]=[];
  for(let y=48;y<=458;y+=6)for(let x=42;x<=678;x+=6)if(maskAt({x,y},circles)===mask&&clearsLabels({x,y},circles))candidates.push({x,y});
  candidates.sort((p,q)=>regionClearance(q,mask,circles)-regionClearance(p,mask,circles));
  const safe=candidates.filter(p=>regionClearance(p,mask,circles)>=markerClearance);
  const pool=safe.length?safe:candidates;
  const spread=pool.length?Math.max(...pool.map(p=>p.x))-Math.min(...pool.map(p=>p.x))>=Math.max(...pool.map(p=>p.y))-Math.min(...pool.map(p=>p.y))?'x':'y':'x';
  const edge=items.length>1?[...pool].sort((p,q)=>p[spread]-q[spread])[0]:undefined;
  items.forEach((item,i)=>{
   const used=Object.values(positioned);
   const previous=preferred?.[item];
   const follows=previous&&maskAt(previous,circles)===mask&&regionClearance(previous,mask,circles)>=markerClearance&&clearsLabels(previous,circles)&&used.every(q=>Math.hypot(previous.x-q.x,previous.y-q.y)>=38)?previous:undefined;
   const near=previous?[...pool].sort((p,q)=>Math.hypot(p.x-previous.x,p.y-previous.y)-Math.hypot(q.x-previous.x,q.y-previous.y)).find(p=>used.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>=38)):undefined;
   const chosen=follows??near??(i===0&&edge&&Object.values(positioned).every(q=>Math.hypot(edge.x-q.x,edge.y-q.y)>=38)?edge:pool.find(p=>used.every(q=>Math.hypot(p.x-q.x,p.y-q.y)>=38)));
   // If space is tight, keep the marker in its own region and maximize separation.
   const fallback=used.length?pool.reduce<Point|undefined>((best,p)=>{
    const separation=(v:Point)=>Math.min(...used.map(q=>Math.hypot(v.x-q.x,v.y-q.y)));
    return !best||separation(p)>separation(best)?p:best;
   },undefined):pool[0];
   positioned[item]=chosen??fallback??{x:42+i*35,y:470};
  });
 }
 return positioned;
}

/** Carry members of the original circle, including shared members, with the same transform. */
export function carryCircleElements(points:Record<string,Point>,before:Circle,after:Circle):Record<string,Point>{
 const scale=after.r/before.r;
 return Object.fromEntries(Object.entries(points).map(([item,p])=>[item,inside(p,before)?{x:after.x+(p.x-before.x)*scale,y:after.y+(p.y-before.y)*scale}:p]));
}
export function membershipsAt(universe:string[],points:Record<string,Point>,circles:Circle[]):string[][]{
 return circles.map(circle=>universe.filter(item=>points[item]&&inside(points[item],circle)));
}
export function connectedCircleLayout(universe:string[],points:Record<string,Point>,before:Circle,after:Circle,circles:Circle[]){
 const carried=carryCircleElements(points,before,after),sets=membershipsAt(universe,carried,circles);
 return {sets,points:layoutElements(universe,sets[0],sets[1],sets[2],circles,carried)};
}
