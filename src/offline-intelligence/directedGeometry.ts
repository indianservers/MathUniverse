import { outlineVertices, type VisualCommand } from './commands';

/** Slab clipping preserves the ray's t >= 0 domain, including origins offscreen. */
export function clipRay(origin:number[],direction:number[],min:number[],max:number[]):number[][]|null {
  let enter=0,exit=Infinity;
  for(let i=0;i<min.length;i++){
    if(direction[i]===0){if(origin[i]<min[i]||origin[i]>max[i])return null;continue;}
    const a=(min[i]-origin[i])/direction[i],b=(max[i]-origin[i])/direction[i];
    enter=Math.max(enter,Math.min(a,b));exit=Math.min(exit,Math.max(a,b));
  }
  if(!Number.isFinite(exit)||exit<enter)return null;
  return [enter,exit].map(t=>origin.map((n,i)=>n+t*direction[i]));
}
export function directedData(command:VisualCommand){
  const [origin,through]=outlineVertices(command),direction=through.map((n,i)=>n-origin[i]);
  return {origin,through,direction,magnitude:Math.hypot(...direction)};
}

export function clipInfiniteLine(origin:number[],direction:number[],min:number[],max:number[]):number[][]|null {const forward=clipRay(origin,direction,min,max),back=clipRay(origin,direction.map(x=>-x),min,max);if(!forward)return back;if(!back)return forward;return [back[1],forward[1]];}
