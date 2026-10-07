import { COLORS } from '../../offline-intelligence/shapeCatalog';
import { interpretVisualRequest, type VisualCommand } from '../../offline-intelligence/commands';
import { describeObject } from './sceneContext';
import { validateCommand } from './commandValidator';
import { resolveTarget } from './targetResolver';
import { center, distance, intersections, measurement, midpoint, numericRoots, relationship, rounded, vertices } from './geometryQueries';
import { compileFunctionExpression } from '../../utils/functionParser';
import type { MathRoboCommand, MathRoboPlan, RoboObjectDescriptor, RoboSceneContext } from './types';

function pointList(value:RoboSceneContext['previousResult'],dimension:number):number[][] {
  if(Array.isArray(value)&&value.length&&Array.isArray(value[0]))return value as number[][];
  if(Array.isArray(value)&&value.length===dimension&&value.every(n=>typeof n==='number'))return [value as number[]];
  throw new Error('First query or mark a point, midpoint, center or intersection.');
}
function twoTargets(c:MathRoboCommand,s:RoboSceneContext):RoboObjectDescriptor[] {
  if(c.targets)return c.targets.map(target=>resolveTarget(target,s));
  let objects=s.selectedIds.map(id=>s.objects.find(o=>o.id===id)).filter((o):o is RoboObjectDescriptor=>!!o);
  if(objects.length<2){const type=typeof c.target==='object'?c.target.type:undefined;objects=s.objects.filter(o=>!type||o.type===type);}
  if(objects.length<2)throw new Error('This operation needs two existing objects.');
  if(objects.length>2&&!/last|these|those|two/.test(c.normalizedPhrase))throw new Error('Select two objects or specify their names.');
  return objects.slice(-2);
}
export type PreparedPlan = { scene:RoboSceneContext; effects:VisualCommand[]; messages:string[]; value?:RoboSceneContext['previousResult'] };
export function preparePlan(plan:MathRoboPlan,input:Readonly<RoboSceneContext>):PreparedPlan {
  const s=structuredClone(input) as RoboSceneContext,effects:VisualCommand[]=[],messages:string[]=[];
  let primaryCreation:RoboObjectDescriptor|undefined;
  const dimension=s.activeMode.endsWith('3d')?3:2;
  const store=(c:VisualCommand,originalId?:string)=>{
    c.objectId??=crypto.randomUUID();effects.push(c);const descriptor=describeObject(c,s.activeMode);
    if(originalId)descriptor.originalId=originalId;
    s.objects=[...s.objects.filter(o=>o.id!==c.objectId),descriptor];s.lastReferenced=c.objectId;s.lastModified=c.objectId;if(c.action!=='update')s.lastCreated=c.objectId;
    return descriptor;
  };
  const createAt=(kind:string,points:number[][],source?:RoboObjectDescriptor)=>{
    const c:VisualCommand={kind:kind as VisualCommand['kind'],dimension:dimension===3?'3d':'2d',points,width:6,height:4,radius:3,color:source?.style.color??'#22d3ee',scale:1,rotation:[0,0,0],action:'create'};return store(c);
  };
  for(const c of plan.commands){
    const operation=validateCommand(c);const p=c.parameters;
    if(['UNDO','REDO'].includes(c.action))throw new Error('History commands must be used separately.');
    if(c.action==='CREATE'||c.action==='PLOT'){
      const visual=p.legacy?structuredClone(p.legacy):interpretVisualRequest(c.action==='PLOT'?`Plot ${dimension===3?'z':'y'} = ${p.expression}`:`Create ${c.subAction.toLowerCase()}`,c.mode).command;
      if(!visual)throw new Error('Cannot build this object from those parameters.');
      if(visual.dimension!==(dimension===3?'3d':'2d')&&s.activeMode!=='normal')throw new Error('This object needs a different dimensional workspace.');
      if(p.atPreviousResult)visual.points=[pointList(s.previousResult,dimension)[0]];
      for(const key of ['width','height','depth','radius','sides'] as const){const val=p[key];if(typeof val==='number')visual[key]=val;}
      if(p.diameter!==undefined)visual.radius=p.diameter/2;if(p.points)visual.points=p.points;if(p.position)visual.points=[p.position];
      if(visual.kind==='square'||visual.kind==='cube')visual.height=visual.depth=visual.width;
      if(p.color)visual.color=COLORS[p.color]??p.color;visual.roboLabel=p.label;primaryCreation=store(visual);messages.push(`Created ${visual.dimension.toUpperCase()} ${visual.kind}.`);continue;
    }
    if(c.action==='COUNT'){let count:number;if(c.subAction==='VERTICES'){const o=resolveTarget(c.target,s),counts:Record<string,number>={circle:0,ellipse:0,sphere:0,cylinder:0,cone:1,cube:8,cuboid:8,tetrahedron:4,octahedron:6,dodecahedron:20,icosahedron:12,prism:6,pyramid:5};count=counts[o.type]??vertices(o).length;}else count=s.objects.filter(o=>c.subAction==='OBJECTS'||c.subAction==='POINTS'&&o.type==='point'||c.subAction==='LINES'&&o.type==='line'||c.subAction==='SHAPES'&&!['line','point','plot'].includes(o.type)).length;s.previousResult=count;messages.push(`Count = ${count}.`);continue;}
    if(c.action==='DESELECT'){s.selectedIds=[];if(s.objects[0])effects.push({...s.objects[0].command,roboControl:'deselect'});messages.push('Selection cleared.');continue;}
    if(c.action==='DELETE'&&c.subAction==='ALL'){for(const o of [...s.objects].sort((a,b)=>Number(a.type==='point')-Number(b.type==='point')))effects.push({...o.command,roboControl:'delete'});s.objects=[];s.selectedIds=[];s.lastCreated=s.lastModified=s.lastReferenced=undefined;messages.push('Cleared Robo scene objects.');continue;}
    if(c.action==='SELECT'&&c.subAction==='ALL'){s.selectedIds=s.objects.map(o=>o.id);effects.push(...s.objects.map(o=>({...o.command,roboControl:'select' as const})));messages.push(`Selected ${s.selectedIds.length} objects.`);continue;}
    if(['CHECK','COMPARE'].includes(c.action)||c.action==='FIND'&&p.multiple){
      const pointCheck=c.action==='CHECK'&&c.subAction.startsWith('POINT_');
      const objects=pointCheck?[resolveTarget(typeof c.target==='object'&&c.target.type==='point'?c.target:{type:'point',reference:'lastReferenced'},s),resolveTarget({type:c.subAction==='POINT_ON_LINE'?'line':'circle',index:-1},s)]:twoTargets(c,s);
      s.lastQueryTargets=objects.map(o=>o.id);s.previousResultTargets=s.lastQueryTargets;s.lastReferenced=objects.at(-1)!.id;
      if(c.action==='CHECK'){const value=relationship(objects,c.subAction);s.previousResult=value;messages.push(`${value?'Yes':'No'} — ${c.subAction.toLowerCase().replaceAll('_',' ')}.`);}
      else if(c.action==='COMPARE'){const kind=c.subAction==='SIZE'?(dimension===3?'VOLUME':'AREA'):c.subAction;const values=objects.map(o=>Number(measurement(o,kind)));s.previousResult=values;messages.push(Math.abs(values[0]-values[1])<1e-7?`The objects have equal ${kind.toLowerCase()}.`:`${objects[values[0]>values[1]?0:1].label??objects[values[0]>values[1]?0:1].type} has the larger ${kind.toLowerCase()}: ${values.map(rounded).join(' vs ')}.`);}
      else if(c.subAction==='INTERSECTION'){s.previousResult=intersections(objects[0],objects[1]);messages.push(`Intersections${objects.every(o=>o.type==='plot')?' (numerical, x ∈ [-100,100])':''}: ${JSON.stringify(s.previousResult)}.`);}
      else {if(!objects.every(o=>o.type==='point'))throw new Error('Distance between two targets requires two points.');s.previousResult=distance(objects[0].position,objects[1].position);messages.push(`Distance = ${rounded(s.previousResult)} units.`);}continue;
    }
    if(c.action==='MARK'||c.action==='SHOW'&&c.subAction!=='OBJECT'){
      let pts:number[][];let source:RoboObjectDescriptor|undefined;
      if(c.subAction==='POINT'||c.subAction==='INTERSECTION')pts=pointList(s.previousResult,dimension);
      else {source=c.action==='SHOW'&&['RADIUS','DIAMETER'].includes(c.subAction)&&primaryCreation&&c.target==='lastReferenced'?primaryCreation:resolveTarget(c.target,s);pts=[c.subAction==='MIDPOINT'?midpoint(source):center(source)];}
      if(c.action==='SHOW'&&['RADIUS','DIAMETER'].includes(c.subAction)){if(source!.type!=='circle')throw new Error('A radius display requires a circle.');const ctr=pts[0],r=source!.command.radius*(source!.command.scale??1);createAt('line',[c.subAction==='DIAMETER'?ctr.map((v,i)=>i===0?v-r:v):ctr,ctr.map((v,i)=>i===0?v+r:v)],source);}
      else for(const pt of pts)createAt('point',[pt],source);
      s.previousResult=pts.length===1?pts[0]:pts;messages.push(`${c.action==='MARK'?'Marked':'Showing'} ${c.subAction.toLowerCase()}${pts.length>1?' points':''}.`);
      if(c.action==='SHOW')for(const effect of effects.slice(-Math.max(1,pts.length)))effect.roboTemporary=true;
      continue;
    }
    const o=resolveTarget(c.target,s);s.lastReferenced=o.id;
    if(operation.allowedTypes.length&&!operation.allowedTypes.includes(o.type))throw new Error(`${c.subAction.toLowerCase()} is not applicable to ${o.type}.`);
    if(c.action==='FIND'){
      const result=c.subAction==='ROOTS'||c.subAction==='X_INTERCEPT'?numericRoots(compileFunctionExpression(o.command.expression??'')).map(x=>[x,0]):measurement(o,c.subAction);
      s.previousResult=result;s.previousResultTargets=[o.id];s.lastQueryTargets=[o.id];messages.push(`${c.subAction.toLowerCase().replaceAll('_',' ')}${c.subAction==='ROOTS'||c.subAction==='X_INTERCEPT'?' (numerical, x ∈ [-100,100])':''} = ${typeof result==='number'?rounded(result):JSON.stringify(result)}${typeof result==='number'?' units':''}.`);continue;
    }
    if(c.action==='CONSTRUCT'){
      if(c.subAction==='TANGENT'){if(o.type!=='circle')throw new Error('Tangent needs a circle.');if(/inside/.test(c.normalizedPhrase))throw new Error('A tangent cannot lie inside a circle.');const ctr=center(o),r=o.command.radius*(o.command.scale??1);if(p.position&&Math.abs(distance(p.position,ctr)-r)>1e-7)throw new Error('That point is not on the circle boundary.');const a=p.position?Math.atan2(p.position[1]-ctr[1],p.position[0]-ctr[0]):(p.angle??0)*Math.PI/180,t=[ctr[0]+r*Math.cos(a),ctr[1]+r*Math.sin(a)],d=[-Math.sin(a)*r,Math.cos(a)*r];createAt('line',[t.map((v,i)=>v-d[i]),t.map((v,i)=>v+d[i])],o);messages.push('Tangent segment created.');continue;}
      if(o.type!=='line')throw new Error('Construction requires a reference line.');const [a,b]=vertices(o),delta=[b[0]-a[0],b[1]-a[1]],perpendicular=c.subAction!=='PARALLEL',v=perpendicular?[-delta[1],delta[0]]:delta;
      const through=p.position??(p.through==='midpoint'||c.subAction==='PERPENDICULAR_BISECTOR'?midpoint(o):Array.isArray(s.previousResult)?pointList(s.previousResult,dimension)[0]:s.objects.find(obj=>obj.id===s.lastCreated&&obj.type==='point')?.position);
      if(!through)throw new Error('Specify a point or query and mark a midpoint first.');createAt('line',[through.map((n,i)=>n-v[i]),through.map((n,i)=>n+v[i])],o);messages.push(`${perpendicular?'Perpendicular':'Parallel'} line created through the point.`);continue;
    }
    if(c.action==='SELECT'){s.selectedIds=[o.id];effects.push({...o.command,roboControl:'select'});messages.push(`Selected ${o.type}.`);continue;}
    if(c.action==='DELETE'){if(o.type==='point'&&o.command.roboNativeIds&&s.objects.some(other=>other.id!==o.id&&other.command.roboNativeIds?.points.includes(o.id)))throw new Error('Delete connected shapes before deleting this shared point.');s.objects=s.objects.filter(obj=>obj.id!==o.id);s.selectedIds=s.selectedIds.filter(id=>id!==o.id);effects.push({...o.command,roboControl:'delete'});messages.push(`Deleted ${o.type}.`);continue;}
    if(c.action==='SHOW'||c.action==='HIDE'){o.style.visible=c.action==='SHOW';o.command.roboVisible=o.style.visible;effects.push({...o.command,roboControl:'visibility'});messages.push(`${c.action==='SHOW'?'Showing':'Hidden'} ${o.type}.`);continue;}
    const visual=structuredClone(o.command);visual.action='update';visual.roboControl=undefined;
    if(c.action==='DUPLICATE'){visual.objectId=crypto.randomUUID();visual.roboNativeIds=undefined;visual.action='create';store(visual,o.id);messages.push(`Duplicated ${o.type}.`);continue;}
    if(c.action==='MOVE'){const v=p.vector!;if(v.length!==dimension)throw new Error(`Provide ${dimension} translation coordinates.`);const delta=p.absolute?v.map((n,i)=>n-center(o)[i]):v;visual.points=(visual.points.length?visual.points:[Array(dimension).fill(0)]).map(pt=>pt.map((n,i)=>n+delta[i]));}
    if(c.action==='ROTATE'){visual.rotation=[...(visual.rotation??[0,0,0])];const axis=p.axis??'z';if(dimension===2&&axis!=='z')throw new Error('2D rotation uses the z-axis.');visual.rotation['xyz'.indexOf(axis)]+=p.angle!;}
    if(c.action==='SCALE')visual.scale=(visual.scale??1)*p.factor!;
    if(c.action==='REFLECT'){
      const axes:Record<string,number[]>={X_AXIS:[1],Y_AXIS:[0],ORIGIN:[0,1],XY_PLANE:[2],XZ_PLANE:[1],YZ_PLANE:[0]};const flip=axes[c.subAction];
      if(!flip)throw new Error('UNSUPPORTED: That reflection axis is unavailable.');
      if(['circle','sphere'].includes(o.type))visual.points=[center(o).map((n,i)=>flip.includes(i)?-n:n)];
      else if(dimension===2&&o.type!=='plot'){visual.points=vertices(o).map(pt=>pt.slice(0,2).map((n,i)=>flip.includes(i)?-n:n));visual.rotation=[0,0,0];visual.scale=1;visual.fitDimensions=false;visual.roboExplicitVertices=true;}
      else if(dimension===3){visual.points=[center(o).map((n,i)=>flip.includes(i)?-n:n)];visual.rotation=(visual.rotation??[0,0,0]).map((n,i)=>flip.includes(i)?n:-n) as [number,number,number];}
      else throw new Error('UNSUPPORTED: Reflecting function graphs is not yet available.');
    }
    if(c.action==='CHANGE'||c.action==='RESIZE'){
      if(p.color)visual.color=COLORS[p.color]??p.color;if(p.label)visual.roboLabel=p.label;
      if(['RADIUS','DIAMETER'].includes(c.subAction)&&!['circle','sphere'].includes(o.type))throw new Error('Radius changes require a circle or sphere.');
      for(const key of ['width','height','depth','radius'] as const)if(p[key]!==undefined)visual[key]=p[key]!;
      if(p.diameter!==undefined)visual.radius=p.diameter/2;if(p.position)visual.points=[p.position];
      if(['width','height','depth','radius','diameter'].some(key=>p[key]!==undefined)){visual.scale=1;visual.fitDimensions=true;}
      if(['square','cube'].includes(visual.kind)&&(p.width!==undefined||p.height!==undefined||p.depth!==undefined)){const side=p.width??p.height??p.depth!;visual.width=visual.height=visual.depth=side;}
    }
    if(visual.width*(visual.scale??1)>10000||visual.radius*(visual.scale??1)>10000)throw new Error('The resulting object exceeds 10,000 units.');
    store(visual,o.originalId);messages.push(`${c.action==='CHANGE'?'Changed':c.action.toLowerCase()} ${o.type}${p.color?` to ${p.color}`:''}.`);
  }
  s.snapshotId=crypto.randomUUID();return {scene:s,effects,messages,value:s.previousResult};
}
