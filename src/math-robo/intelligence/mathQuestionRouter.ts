import {executionOutcome} from '../../math-foundation/executionOutcome';
import {vertices,center} from './geometryQueries';
import type {RoboResult,RoboSceneContext} from './types';
/** Bounded object-grounded proof/verification adapters. No theorem is inferred by a model. */
export function mathematicalQuestion(text:string,scene:RoboSceneContext):RoboResult|undefined{
  const q=text.toLowerCase().trim().replace(/[?.]+$/,'');
  if(!/^(?:prove|verify|explain why)\b/.test(q))return undefined;
  const reply=(message:string,status:RoboResult['status']='success',residual?:number):RoboResult=>({status,message,execution:residual!==undefined?executionOutcome(residual<=1e-7?'verified':'invalid_input',crypto.randomUUID(),message,{level:residual<=1e-7?'numerical_consistency':'contradicted',independent:true,passed:residual<=1e-7,method:'Independent coordinate incidence check, tolerance 1e-7',residual,assumptions:['Finite Euclidean 2D coordinates; floating point tolerance.']}):undefined,plan:{rawPhrase:text,commands:[],confidence:1},effects:[],parseMs:0,executionMs:0});
  const active=scene.objects.find(o=>o.id===scene.lastReferenced);
  if(/tangent|tangency/.test(q)||q==='prove it'&&(active?.command.roboDependency?.kind==='tangent'||scene.objects.filter(o=>o.command.roboDependency?.kind==='tangent').length===1)){
    const tangents=scene.objects.filter(o=>o.type==='line'&&o.command.roboDependency?.kind==='tangent'),line=active?.command.roboDependency?.kind==='tangent'?active:tangents.length===1?tangents[0]:undefined;
    if(!line)return reply('Select a defined tangent construction and its circle.','ambiguous');
    const circle=scene.objects.find(o=>o.id===line.command.roboDependency?.parents[0]?.objectId),points=vertices(line),ctr=circle?center(circle):undefined,r=circle?circle.command.radius*(circle.command.scale??1):NaN;
    if(!circle||circle.type!=='circle'||circle.command.dimension!=='2d'||line.command.dimension!=='2d'||line.command.roboDefinitionState?.status==='undefined'||points.length!==2||points.some(p=>p.length!==2||p.some(x=>!Number.isFinite(x)))||ctr?.length!==2||ctr.some(x=>!Number.isFinite(x))||!Number.isFinite(r)||r<=0)return reply('This tangent evidence requires defined finite 2D geometry.','unsupported');
    const [a,b]=points,u=[b[0]-a[0],b[1]-a[1]],length=Math.hypot(...u);if(!length)return reply('A zero direction cannot define a tangent.','invalid');
    const distance=Math.abs(u[0]*(ctr[1]-a[1])-u[1]*(ctr[0]-a[0]))/length,residual=Math.abs(distance-r)/Math.max(1,r);
    return reply(`The center-to-line distance is ${distance} and the circle radius is ${r}. A line is tangent precisely when its distance from the center equals the positive radius: the perpendicular radius reaches the single contact point. Residual ${residual}; this checks the actual drawn line numerically, not a universal symbolic proof.`,residual<=1e-7?'success':'invalid',residual);
  }
  if(/circumcent(?:er|re)|equidistant/.test(q)){
    const circles=scene.objects.filter(o=>o.command.roboDependency?.kind==='circumcircle');
    const chosen=circles.filter(o=>scene.selectedIds.includes(o.id));const circle=chosen.length===1?chosen[0]:circles.length===1?circles[0]:undefined;
    if(!circle)return reply('Select a dependent circumcircle and its triangle so I can inspect this construction.','ambiguous');
    const triangle=scene.objects.find(o=>o.id===circle.command.roboDependency!.parents[0]?.objectId);if(!triangle||triangle.type!=='triangle'||triangle.command.roboDefinitionState?.status==='undefined'||circle.command.roboDefinitionState?.status==='undefined')return reply('The parent triangle or circumcircle is undefined. A circumcenter requires three noncollinear vertices.','invalid');
    const points=vertices(triangle),center=circle.command.points[0],radius=circle.command.radius*(circle.command.scale??1);
    if(points.length!==3||points.some(p=>p.length!==2||p.some(x=>!Number.isFinite(x)))||center?.length!==2||center.some(x=>!Number.isFinite(x))||!Number.isFinite(radius)||radius<=0)return reply('This is not a defined finite circumcircle construction.','invalid');
    const [a,b,c]=points;if(Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))<=1e-12)return reply('A collinear triangle has no unique circumcenter.','invalid');
    const radii=points.map(p=>Math.hypot(p[0]-center[0],p[1]-center[1])),residual=Math.max(Math.max(...radii)-Math.min(...radii),...radii.map(r=>Math.abs(r-radius)));
    return reply(`The perpendicular bisector of AB consists of points equally distant from A and B. Intersecting it with the bisector of BC gives OA = OB = OC for a noncollinear triangle. For this construction the three distances are ${radii.join(', ')}; the maximum equal-distance/radius residual is ${residual}. This is a numerical incidence check of the drawn construction, alongside the Euclidean argument.`,residual<=1e-7?'success':'invalid',residual);
  }
  if(/(?:(?:those|these) (?:two )?|the two )lines are parallel/.test(q)){
    if(scene.activeMode.endsWith('3d'))return reply('This independent proof adapter currently supports 2D line directions. Use the existing 3D relationship tools.','unsupported');
    const selected=scene.objects.filter(o=>scene.selectedIds.includes(o.id)&&o.type==='line'),lines=selected.length===2?selected:scene.objects.filter(o=>o.type==='line');
    if(lines.length!==2)return reply('Select exactly two lines to verify parallelism.','ambiguous');
    if(lines.some(o=>o.command.dimension!=='2d'||vertices(o).length!==2||vertices(o).some(p=>p.length!==2||p.some(x=>!Number.isFinite(x)))))return reply('Parallelism evidence requires finite 2D line directions.','unsupported');
    const directions=lines.map(o=>{const [a,b]=vertices(o);return [b[0]-a[0],b[1]-a[1]];}),[u,v]=directions,denominator=Math.hypot(...u)*Math.hypot(...v);if(!denominator)return reply('A zero-length direction does not define a line.','invalid');
    const residual=Math.abs(u[0]*v[1]-u[1]*v[0])/denominator;
    return reply(`Direction vectors are (${u.join(', ')}) and (${v.join(', ')}). Their normalized cross product has magnitude ${residual}. ${residual<=1e-7?'The drawn directions are parallel within tolerance; proportional direction vectors define parallel or coincident infinite lines.':'These directions are not parallel.'}`,residual<=1e-7?'success':'invalid',residual);
  }
  return undefined;
}
