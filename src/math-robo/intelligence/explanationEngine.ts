import {vertices,center,measurement,distance} from './geometryQueries';
import {resolveTarget,resolveTargets} from './targetResolver';
import type {MathRoboPlan,RoboSceneContext} from './types';
export function explainResult(plan:MathRoboPlan,scene:RoboSceneContext){
  const command=plan.commands.at(-1);if(!command)return '';
  try{
    if(command.action==='FIND'&&command.subAction==='DISTANCE'&&/\bto (?:the )?origin\b/.test(command.normalizedPhrase)){const point=resolveTarget({type:'point',reference:'lastReferenced'},scene);return `Distance formula from ${JSON.stringify(point.position)} to the origin: √(Σ coordinate²) = ${Math.hypot(...point.position)}.`;}
    if(command.action==='EXPLAIN')return scene.previousResults?.at(-1)?.explanation??'';
    if(command.action==='CHECK'&&['PARALLEL','PERPENDICULAR'].includes(command.subAction)){const [a,b]=resolveTargets(command.targets,command.target,scene),[p,q]=vertices(a),[r,s]=vertices(b),u=q.map((n,i)=>n-p[i]),v=s.map((n,i)=>n-r[i]),value=command.subAction==='PARALLEL'?u[0]*v[1]-u[1]*v[0]:u.reduce((sum,n,i)=>sum+n*v[i],0);return `${command.subAction==='PARALLEL'?'Direction determinant':'Direction dot product'} = ${Number(value.toFixed(8))}. ${command.subAction==='PARALLEL'?'Parallel':'Perpendicular'} lines have a value of zero.`;}
    if(command.action!=='FIND')return '';
    if(command.subAction==='DISTANCE'){
      const [a,b]=resolveTargets(command.targets,command.target,scene);
      if(a.type==='line'&&b.type==='line'){const [p,q]=vertices(a),r=vertices(b)[0],u=q.map((n,i)=>n-p[i]),delta=r.map((n,i)=>n-p[i]),length=Math.hypot(...u),projection=delta.reduce((sum,n,i)=>sum+n*u[i]/length,0),value=Math.hypot(...delta.map((n,i)=>n-projection*u[i]/length));return `The perpendicular distance between the parallel lines is ${Number(value.toFixed(8))} units. Project the displacement between points on the lines onto the direction perpendicular to them.`;}
      return `Distance formula: √(Σ(bᵢ−aᵢ)²), using ${JSON.stringify(a.position)} and ${JSON.stringify(b.position)}.`;
    }
    const o=resolveTarget(command.target,scene),pts=vertices(o);
    if(['COMPONENTS','DIRECTION','MAGNITUDE','PARAMETERIZATION'].includes(command.subAction)&&['ray','vector'].includes(o.type)){const direction=pts[1].map((n,i)=>n-pts[0][i]);return `Subtract the start coordinates from the second point: (${direction.join(', ')}). ${o.type==='ray'?'The ray uses P(t) = start + t × direction, t ≥ 0.':`Magnitude = √(${direction.map(n=>`(${n})²`).join(' + ')}) = ${Math.hypot(...direction)}.`}`;}
    if(command.subAction==='MIDPOINT')return `Midpoint formula: M = ((x₁+x₂)/2, (y₁+y₂)/2). Endpoints: ${JSON.stringify(pts)}.`;
    if(command.subAction==='SLOPE')return `Δy = ${pts[1][1]-pts[0][1]}, Δx = ${pts[1][0]-pts[0][0]}; slope = Δy/Δx.`;
    if(command.subAction==='LENGTH'||command.subAction==='DISTANCE')return `Distance formula: √(Σ(bᵢ−aᵢ)²) = ${distance(pts[0],pts[1])}.`;
    if(command.subAction==='AREA')return o.type==='circle'?`A = πr², r = ${measurement(o,'RADIUS')}.`:`Area is calculated from the vertices with the shoelace formula (or triangle cross products in 3D).`;
    if(command.subAction==='VOLUME')return o.type==='sphere'?`V = 4πr³/3, r = ${measurement(o,'RADIUS')}.`:`Volume is calculated from ${o.type}'s dimensions and uniform scale.`;
    if(command.subAction==='CENTER'||command.subAction==='CENTROID')return `Center coordinates: ${JSON.stringify(center(o))}; polygon centroids use signed area weighting.`;
    if(command.subAction==='TRIANGLE_TYPE')return 'Side lengths classify equilateral/isosceles/scalene. Comparing a²+b² with c² classifies acute/right/obtuse.';
    if(command.subAction==='EQUATION')return 'A = y₂−y₁, B = x₁−x₂, C = −Ax₁−By₁; the equation is Ax+By+C=0.';
  }catch{/* No unverified explanation when references are unavailable. */}
  return '';
}
