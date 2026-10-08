import { COLORS } from '../../offline-intelligence/shapeCatalog';
import { interpretVisualRequest, type VisualCommand } from '../../offline-intelligence/commands';
import { describeObject } from './sceneContext';
import { validateCommand } from './commandValidator';
import { resolveTarget,resolveTargets } from './targetResolver';
import {similarityScale} from '../../studios/geometry/geometryEnhancementEngine';
import {angleBetween,derivedMeasurement,derivedRelationship,projection,triangleCenter,triangleData,unit,subtract} from './derivedGeometry';
import {EPSILON} from './tolerances';
import { center, distance, intersections, measurement, midpoint, numericRoots, relationship, rounded, vertices } from './geometryQueries';
import { compileFunctionExpression } from '../../utils/functionParser';
import type { MathRoboCommand, MathRoboPlan, RoboObjectDescriptor, RoboSceneContext } from './types';

function pointList(value:RoboSceneContext['previousResult'],dimension:number):number[][] {
  if(Array.isArray(value)&&value.length&&Array.isArray(value[0]))return value as number[][];
  if(Array.isArray(value)&&value.length===dimension&&value.every(n=>typeof n==='number'))return [value as number[]];
  throw new Error('First query or mark a point, midpoint, center or intersection.');
}
function twoTargets(c:MathRoboCommand,s:RoboSceneContext):RoboObjectDescriptor[] {
  return resolveTargets(c.targets,c.target,s);
}
export type PreparedPlan = { scene:RoboSceneContext; effects:VisualCommand[]; messages:string[]; value?:RoboSceneContext['previousResult'] };
export function preparePlan(plan:MathRoboPlan,input:Readonly<RoboSceneContext>):PreparedPlan {
  const s=structuredClone(input) as RoboSceneContext,effects:VisualCommand[]=[],messages:string[]=[];
  let primaryCreation:RoboObjectDescriptor|undefined;
  const dimension=s.activeMode.endsWith('3d')?3:2;
  const store=(c:VisualCommand,originalId?:string)=>{
    c.objectId??=crypto.randomUUID();effects.push(c);const descriptor=describeObject(c,s.activeMode);
    const previous=s.objects.find(o=>o.id===c.objectId);descriptor.creationOrder=previous?.creationOrder??Math.max(0,...s.objects.map(o=>o.creationOrder??0))+1;
    if(!c.roboLabel&&!previous){const initials:Record<string,string>={point:'P',line:'L',circle:'C',triangle:'T',rectangle:'R',square:'S',sphere:'SP',cube:'CU'},prefix=initials[c.kind]??c.kind.toUpperCase();let index=s.objects.filter(o=>o.type===c.kind).length+1;while(s.objects.some(o=>o.label===`${prefix}${index}`))index++;c.roboLabel=`${prefix}${index}`;descriptor.label=c.roboLabel;descriptor.command.roboLabel=c.roboLabel;}
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
    if(c.action==='EXPLAIN'){const previous=s.previousResults?.at(-1);if(!previous)throw new Error('First ask a mathematical question.');s.responseDepth=p.responseDepth as RoboSceneContext['responseDepth'];messages.push(previous.explanation);continue;}
    if(p.multiple&&['MOVE','ROTATE','SCALE','DELETE','HIDE','SHOW','LOCK','UNLOCK'].includes(c.action)){
      const targets=twoTargets(c,s),prepared=preparePlan({...plan,commands:targets.map(o=>({...c,target:o.id,parameters:{...p,multiple:false}}))},s);Object.assign(s,prepared.scene);effects.push(...prepared.effects);messages.push(...prepared.messages);continue;
    }
    if(c.action==='CREATE'||c.action==='PLOT'){
      if(p.fromMarkedPoints){const points=s.objects.filter(o=>o.type==='point'&&o.command.roboDependency?.kind==='midpoint').slice(-3);if(points.length!==3)throw new Error('Mark three side midpoints before joining them.');p.points=points.map(o=>o.position);p.dependency={kind:'triangle',parents:points.map(o=>({objectId:o.id}))};p.originalId=points[0].command.roboDependency?.parents[0].objectId;}
      const creationPhrase=c.subAction==='LINE'&&p.points?.length===2?`Draw line (${p.points[0].join(',')}) to (${p.points[1].join(',')})`:c.subAction==='POINT'&&(p.position||p.points?.[0])?`Create point (${(p.position??p.points![0]).join(',')})`:`Create ${c.subAction.toLowerCase()}`;
      const visual=p.legacy?structuredClone(p.legacy):interpretVisualRequest(c.action==='PLOT'?`Plot ${dimension===3?'z':'y'} = ${p.expression}`:creationPhrase,c.mode).command;
      if(!visual)throw new Error('Cannot build this object from those parameters.');
      if(visual.dimension!==(dimension===3?'3d':'2d')&&s.activeMode!=='normal')throw new Error('This object needs a different dimensional workspace.');
      if(p.atPreviousResult)visual.points=[pointList(s.previousResult,dimension)[0]];
      for(const key of ['width','height','depth','radius','sides'] as const){const val=p[key];if(typeof val==='number')visual[key]=val;}
      if(p.diameter!==undefined)visual.radius=p.diameter/2;if(p.points)visual.points=p.points;if(p.position)visual.points=[p.position];
      if(visual.kind==='square'||visual.kind==='cube')visual.height=visual.depth=visual.width;
      if(p.color)visual.color=COLORS[p.color]??p.color;visual.roboLabel=p.label;visual.roboVertexLabels=p.vertexLabels as string[]|undefined;
      if(p.dependency)visual.roboDependency=p.dependency as VisualCommand['roboDependency'];
      const count=Number(p.count??1),created:string[]=[];for(let i=0;i<count;i++){const next=structuredClone(visual);if(i)next.objectId=undefined;primaryCreation=store(next,p.originalId as string|undefined);created.push(primaryCreation.id);}s.activeObjectIds=created;messages.push(`Created ${visual.dimension.toUpperCase()} ${visual.kind}${count>1?` × ${count}`:''}${['circle','sphere'].includes(visual.kind)?` with radius ${visual.radius}`:['rectangle','square'].includes(visual.kind)?` ${visual.width} by ${visual.height}`:''}.`);continue;
    }
    if(c.action==='COUNT'){let count:number;if(c.subAction==='VERTICES'){const o=resolveTarget(c.target,s),counts:Record<string,number>={circle:0,ellipse:0,sphere:0,cylinder:0,cone:1,cube:8,cuboid:8,tetrahedron:4,octahedron:6,dodecahedron:20,icosahedron:12,prism:6,pyramid:5};count=counts[o.type]??vertices(o).length;}else count=s.objects.filter(o=>c.subAction==='OBJECTS'||c.subAction==='POINTS'&&o.type==='point'||c.subAction==='LINES'&&o.type==='line'||c.subAction==='SHAPES'&&!['line','point','plot'].includes(o.type)).length;s.previousResult=count;messages.push(`Count = ${count}.`);continue;}
    if(c.action==='DESELECT'){s.selectedIds=[];if(s.objects[0])effects.push({...s.objects[0].command,roboControl:'deselect'});messages.push('Selection cleared.');continue;}
    if(c.action==='DELETE'&&c.subAction==='ALL'){for(const o of [...s.objects].sort((a,b)=>Number(a.type==='point')-Number(b.type==='point')))effects.push({...o.command,roboControl:'delete'});s.objects=[];s.selectedIds=[];s.lastCreated=s.lastModified=s.lastReferenced=undefined;messages.push('Cleared Robo scene objects.');continue;}
    if(c.action==='SELECT'&&c.subAction==='ALL'){s.selectedIds=s.objects.map(o=>o.id);effects.push(...s.objects.map(o=>({...o.command,roboControl:'select' as const})));messages.push(`Selected ${s.selectedIds.length} objects.`);continue;}
    if(c.action==='SELECT'&&p.multiple){const objects=twoTargets(c,s);s.selectedIds=objects.map(o=>o.id);s.activeObjectIds=[...s.selectedIds];effects.push(...objects.map(o=>({...o.command,roboControl:'select' as const})));messages.push(`Selected ${objects.length} objects.`);continue;}
    if(c.action==='CHECK'&&c.subAction==='MEDIAL_TRIANGLE'){const inner=[...s.objects].reverse().find(o=>o.type==='triangle'&&o.command.roboDependency?.kind==='triangle'),outer=s.objects.find(o=>o.id===inner?.originalId);if(!inner||!outer)throw new Error('First mark the three side midpoints and join them into an inner triangle.');const sides=(o:RoboObjectDescriptor)=>vertices(o).map((p,i)=>distance(p,vertices(o)[(i+1)%3])) as [number,number,number];const relation=similarityScale(sides(outer),sides(inner)),areaRatio=Number(measurement(inner,'AREA'))/Number(measurement(outer,'AREA'));s.previousResult=relation.similar&&Math.abs(relation.scale-.5)<1e-8;s.lastQueryTargets=[outer.id,inner.id];messages.push(`${s.previousResult?'Yes':'No'} — the inner triangle has corresponding side ratio ${rounded(relation.scale)} and area ratio ${rounded(areaRatio)}. Each side joins two side midpoints; the midpoint theorem makes it parallel to, and half the length of, the corresponding original side. Parent changes re-evaluate these midpoint definitions.`);continue;}
    if(c.action==='CHECK'&&c.subAction==='ORIENTATION'){const o=resolveTarget(c.target,s),[a,b]=vertices(o);if(o.type!=='line'||!a||!b)throw new Error('Choose a line.');s.previousResult=Math.abs(b[p.orientation==='horizontal'?1:0]-a[p.orientation==='horizontal'?1:0])<1e-9;messages.push(`${s.previousResult?'Yes':'No'} — ${p.orientation}.`);continue;}
    if(c.action==='FIND'&&c.subAction==='DISTANCE'&&/\bto (?:the )?origin\b/.test(c.normalizedPhrase)){const point=resolveTarget({type:'point',reference:'lastReferenced'},s);s.previousResult=Math.hypot(...point.position);s.lastQueryTargets=[point.id];messages.push(`Distance to origin = ${rounded(s.previousResult)} units. Distance formula: √(Σ coordinate²).`);continue;}
    if(['CHECK','COMPARE'].includes(c.action)||c.action==='FIND'&&p.multiple){
      const pointCheck=c.action==='CHECK'&&c.subAction.startsWith('POINT_');
      const objects=c.action==='CHECK'&&c.subAction==='RIGHT_TRIANGLE'?[resolveTarget(c.target,s)]:pointCheck&&c.targets?c.targets.map(t=>resolveTarget(t,s)):pointCheck?[resolveTarget(typeof c.target==='object'&&c.target.type==='point'?c.target:{type:'point',reference:'lastReferenced'},s),resolveTarget({type:c.subAction==='POINT_ON_LINE'?'line':'circle',index:-1},s)]:twoTargets(c,s);
      s.lastQueryTargets=objects.map(o=>o.id);s.previousResultTargets=s.lastQueryTargets;s.lastReferenced=objects.at(-1)!.id;
      if(c.action==='CHECK'){const value=['TANGENT','COLLINEAR','POINT_OUTSIDE','RIGHT_TRIANGLE','EQUAL_ANGLES'].includes(c.subAction)?derivedRelationship(objects,c.subAction):relationship(objects,c.subAction);s.previousResult=value;messages.push(`${value?'Yes':'No'} — ${c.subAction.toLowerCase().replaceAll('_',' ')}.`);}
      else if(c.action==='COMPARE'){const kind=c.subAction==='SIZE'?(objects.every(o=>o.type==='line')?'LENGTH':dimension===3&&objects.every(o=>!['circle','triangle','rectangle','square','polygon'].includes(o.type))?'VOLUME':'AREA'):c.subAction;const values=objects.map(o=>Number(measurement(o,kind)));s.previousResult=values;messages.push(Math.abs(values[0]-values[1])<1e-7?`The objects have equal ${kind.toLowerCase()}.`:`${objects[values[0]>values[1]?0:1].label??objects[values[0]>values[1]?0:1].type} has the larger ${kind.toLowerCase()}: ${values.map(rounded).join(' vs ')}.`);}
      else if(c.subAction==='INTERSECTION'||c.subAction==='TOUCHING_POINT'){s.previousResult=intersections(objects[0],objects[1]);messages.push(`Intersections${objects.every(o=>o.type==='plot')?' (numerical, x ∈ [-100,100])':''}: ${JSON.stringify(s.previousResult)}.`);}
      else if(c.subAction==='ANGLE'){s.previousResult=angleBetween(objects[0],objects[1]);messages.push(`Angle = ${rounded(s.previousResult)} degrees.`);}
      else if(c.subAction==='PROJECTION'){const point=objects.find(o=>o.type==='point'),line=objects.find(o=>o.type==='line');if(!point||!line)throw new Error('Specify a point and a line.');s.previousResult=projection(point.position,line);messages.push(`Projection = ${JSON.stringify(s.previousResult)}.`);}
      else {
        if(objects.every(o=>o.type==='point'))s.previousResult=distance(objects[0].position,objects[1].position);
        else if(objects.every(o=>o.type==='line')){
          const [a,b]=objects,points=vertices(a),direction=subtract(points[1],points[0]),delta=subtract(vertices(b)[0],points[0]);
          if(!relationship(objects,'PARALLEL'))throw new Error('Select parallel lines to measure their perpendicular distance, or specify two points.');
          const u=unit(direction),along=delta.reduce((sum,n,i)=>sum+n*u[i],0);s.previousResult=Math.hypot(...delta.map((n,i)=>n-along*u[i]));
        }else throw new Error('Distance requires two points or two parallel lines.');
        messages.push(`Distance = ${rounded(s.previousResult)} units.`);
      }continue;
    }
    if(c.action==='MARK'||c.action==='SHOW'&&c.subAction!=='OBJECT'){
      let pts:number[][];let source:RoboObjectDescriptor|undefined;
      const originalActive=s.activeObjectIds;
      if(c.subAction==='SIDE_MIDPOINTS'){source=resolveTarget(c.target,s);const vs=vertices(source);if(vs.length<3)throw new Error('Side midpoints require a polygon.');pts=vs.map((v,i)=>v.map((n,j)=>(n+vs[(i+1)%vs.length][j])/2));}
      else if(c.subAction==='POINT'||c.subAction==='INTERSECTION')pts=p.intersectionRequested?intersections(...twoTargets({...c,target:{type:'line'}},s).slice(0,2) as [RoboObjectDescriptor,RoboObjectDescriptor]):pointList(s.previousResult,dimension);
      else {source=c.action==='SHOW'&&['RADIUS','DIAMETER'].includes(c.subAction)&&primaryCreation&&c.target==='lastReferenced'?primaryCreation:resolveTarget(c.target,s);pts=[c.subAction==='MIDPOINT'?midpoint(source):center(source)];}
      if(c.action==='SHOW'&&['RADIUS','DIAMETER'].includes(c.subAction)){if(source!.type!=='circle')throw new Error('A radius display requires a circle.');const ctr=pts[0],r=source!.command.radius*(source!.command.scale??1);createAt('line',[c.subAction==='DIAMETER'?ctr.map((v,i)=>i===0?v-r:v):ctr,ctr.map((v,i)=>i===0?v+r:v)],source);}
      else for(const [index,pt] of pts.entries()){
        const created=createAt('point',[pt],source);
        if(typeof p.label==='string'){created.label=p.label;created.command.roboLabel=p.label;effects.at(-1)!.roboLabel=p.label;}
        const prior=s.lastQueryTargets?.map(id=>s.objects.find(o=>o.id===id));
        if(!source&&prior?.length===2&&prior.every(o=>o&&['line','circle'].includes(o.type))){created.command.roboDependency={kind:'intersection',parents:prior.map(o=>({objectId:o!.id})),index};effects.at(-1)!.roboDependency=created.command.roboDependency;created.derivedFrom=prior.map(o=>o!.id);}
        if(source&&['MIDPOINT','SIDE_MIDPOINTS'].includes(c.subAction)){
          const refs=source.command.roboDependency?.kind==='line'?source.command.roboDependency.parents:[{objectId:source.id,vertex:c.subAction==='SIDE_MIDPOINTS'?index:0},{objectId:source.id,vertex:c.subAction==='SIDE_MIDPOINTS'?(index+1)%vertices(source).length:1}];
          created.command.roboDependency={kind:'midpoint',parents:refs};effects.at(-1)!.roboDependency=created.command.roboDependency;created.derivedFrom=[...new Set(refs.map(r=>r.objectId))];
          s.previousResultTargets=[source.id];s.lastQueryTargets=[source.id];
        }
      }
      s.previousResult=pts.length===1?pts[0]:pts;messages.push(`${c.action==='MARK'?'Marked':'Showing'} ${c.subAction.toLowerCase()}${pts.length>1?' points':''}.`);
      if(c.action==='SHOW')for(const effect of effects.slice(-Math.max(1,pts.length)))effect.roboTemporary=true;
      s.activeObjectIds=originalActive;
      continue;
    }
    if(c.action==='CHANGE'&&c.subAction==='RELATION'){
      const [a,b]=twoTargets(c,s);if(a.command.roboLocked||b.command.roboLocked)throw new Error('Unlock the objects before changing their relationship.');
      const visual=structuredClone(b.command);visual.action='update';visual.rotation=[0,0,0];visual.scale=1;
      if(p.relation==='TANGENT'){if(a.type!=='circle'||b.type!=='circle')throw new Error('Make tangent currently requires two circles.');let direction=subtract(center(b),center(a));if(Math.hypot(...direction)<EPSILON){const previous=[...(s.previousCommands??[])].reverse().find(command=>command.action==='MOVE')?.parameters.vector;if(previous&&Math.hypot(...previous)>EPSILON)direction=previous;else throw new Error('Specify a tangent direction or separate the circle centers first.');}const u=unit(direction),r=a.command.radius*(a.command.scale??1)+b.command.radius*(b.command.scale??1);visual.points=[center(a).map((n,i)=>n+r*u[i])];}
      else {if(a.type!=='line'||b.type!=='line')throw new Error('Parallel/perpendicular modification requires two lines.');const u=unit(subtract(vertices(a)[1],vertices(a)[0])),direction=p.relation==='PERPENDICULAR'?[-u[1],u[0]]:u,start=vertices(b)[0],length=Number(measurement(b,'LENGTH'));visual.points=[start,start.map((n,i)=>n+direction[i]*length)];}
      store(visual,b.originalId);s.activeObjectIds=[a.id,b.id];messages.push(`Made ${a.label??a.type} and ${b.label??b.type} ${String(p.relation).toLowerCase()}.`);continue;
    }
    const o=c.action==='CONSTRUCT'&&['ANGLE_BISECTOR','PROJECTION'].includes(c.subAction)?twoTargets(c,s)[0]:resolveTarget(c.target,s);s.lastReferenced=o.id;
    if(o.derivedFrom&&!s.objects.some(actual=>actual.id===o.id)&&!['FIND','CHECK','CONSTRUCT','MARK','SHOW'].includes(c.action))throw new Error('This is a derived vertex or edge. Create a separate object before editing it.');
    if(o.command.roboLocked&&!['UNLOCK','FIND','CHECK','COMPARE','SELECT','SHOW','HIDE','DUPLICATE'].includes(c.action))throw new Error('This object is locked. Unlock it before editing.');
    if(operation.allowedTypes.length&&!operation.allowedTypes.includes(o.type))throw new Error(`${c.subAction.toLowerCase()} is not applicable to ${o.type}.`);
    if(c.action==='FIND'){
      const result=['INCENTER','CIRCUMCENTER','ORTHOCENTER','TRIANGLE_TYPE','COORDINATES','EQUATION','LONGEST_SIDE','LARGEST_ANGLE'].includes(c.subAction)?derivedMeasurement(o,c.subAction):(c.subAction==='ROOTS'||c.subAction==='X_INTERCEPT')&&o.type==='plot'?numericRoots(compileFunctionExpression(o.command.expression??'')).map(x=>[x,0]):measurement(o,c.subAction);
      s.previousResult=result;s.previousResultTargets=[o.id];s.lastQueryTargets=[o.id];messages.push(`${c.subAction.toLowerCase().replaceAll('_',' ')}${c.subAction==='ROOTS'||c.subAction==='X_INTERCEPT'?' (numerical, x ∈ [-100,100])':''} = ${typeof result==='number'?rounded(result):JSON.stringify(result)}${typeof result==='number'?' units':''}.`);continue;
    }
    if(c.action==='CONSTRUCT'){
      if(['INCIRCLE','CIRCUMCIRCLE'].includes(c.subAction)){const result=triangleCenter(o,c.subAction==='INCIRCLE'?'INCENTER':'CIRCUMCENTER'),circle=createAt('circle',[result.point],o);circle.command.radius=result.radius;circle.radius=result.radius;effects.at(-1)!.radius=result.radius;messages.push(`Created ${c.subAction.toLowerCase()} with radius ${rounded(result.radius)}.`);continue;}
      if(['MEDIAN','ALTITUDE'].includes(c.subAction)){const data=triangleData(o),labels=o.command.roboVertexLabels,index=p.from?labels?.findIndex(label=>label.toLowerCase()===String(p.from).toLowerCase())??-1:0;if(index<0)throw new Error('Specify a named triangle vertex.');const a=data.p[index],b=data.p[(index+1)%3],cc=data.p[(index+2)%3],target=c.subAction==='MEDIAN'?b.map((n,i)=>(n+cc[i])/2):projection(a,{...o,type:'line',vertices:[b,cc]});createAt('line',[a,target],o);messages.push(`Created ${c.subAction.toLowerCase()} from ${labels?.[index]??'the first vertex'}.`);continue;}
      if(c.subAction==='ANGLE_BISECTOR'){const [a,b]=twoTargets(c,s),through=intersections(a,b)[0];if(!through)throw new Error('The lines must intersect to bisect their angle.');const u=unit(subtract(vertices(a)[1],vertices(a)[0])),v=unit(subtract(vertices(b)[1],vertices(b)[0])),direction=unit(u.map((n,i)=>n+v[i]));createAt('line',[through,through.map((n,i)=>n+direction[i]*6)],a);messages.push('Created angle bisector.');continue;}
      if(c.subAction==='PROJECTION'){const [point,line]=twoTargets(c,s),foot=projection(point.position,line);createAt('point',[foot],point);messages.push(`Marked projection ${JSON.stringify(foot)}.`);continue;}
      if(c.subAction==='TANGENT'){if(o.type!=='circle')throw new Error('Tangent needs a circle.');if(/inside/.test(c.normalizedPhrase))throw new Error('A tangent cannot lie inside a circle.');const ctr=center(o),r=o.command.radius*(o.command.scale??1);if(p.position&&Math.abs(distance(p.position,ctr)-r)>1e-7)throw new Error('That point is not on the circle boundary.');const a=p.position?Math.atan2(p.position[1]-ctr[1],p.position[0]-ctr[0]):(p.angle??0)*Math.PI/180,t=[ctr[0]+r*Math.cos(a),ctr[1]+r*Math.sin(a)],d=[-Math.sin(a)*r,Math.cos(a)*r];const tangent=createAt('line',[t.map((v,i)=>v-d[i]),t.map((v,i)=>v+d[i])],o);tangent.command.roboDependency={kind:'tangent',parents:[{objectId:o.id},...(typeof p.tangentPointId==='string'?[{objectId:p.tangentPointId}]:[])],angle:a};effects.at(-1)!.roboDependency=tangent.command.roboDependency;messages.push('Tangent line created.');continue;}
      if(o.type!=='line')throw new Error('Construction requires a reference line.');const [a,b]=vertices(o),delta=[b[0]-a[0],b[1]-a[1]],perpendicular=c.subAction!=='PARALLEL',v=perpendicular?[-delta[1],delta[0]]:delta;
      const through=p.position??(p.through==='midpoint'||c.subAction==='PERPENDICULAR_BISECTOR'?midpoint(o):Array.isArray(s.previousResult)?pointList(s.previousResult,dimension)[0]:s.objects.find(obj=>obj.id===s.lastCreated&&obj.type==='point')?.position);
      if(!through)throw new Error('Specify a point or query and mark a midpoint first.');const constructed=createAt('line',[through.map((n,i)=>n-v[i]),through.map((n,i)=>n+v[i])],o);
      const point=s.objects.find(obj=>obj.type==='point'&&obj.id!==constructed.id&&obj.position.every((n,i)=>Math.abs(n-through[i])<1e-8));
      if(point){const edge=o.command.roboDependency?.kind==='line'?o.command.roboDependency.parents:undefined;const reference=edge?{objectId:edge[0].objectId,edge:[edge[0].vertex!,edge[1].vertex!] as [number,number]}:{objectId:o.id};constructed.command.roboDependency={kind:perpendicular?'perp':'parallel',parents:[{objectId:point.id},reference]};effects.at(-1)!.roboDependency=constructed.command.roboDependency;}
      messages.push(`${perpendicular?'Perpendicular':'Parallel'} line created through the point.`);continue;
    }
    if(c.action==='SELECT'){s.selectedIds=[o.id];effects.push({...o.command,roboControl:'select'});messages.push(`Selected ${o.type}.`);continue;}
    if(c.action==='DELETE'){if(o.type==='point'&&o.command.roboNativeIds&&s.objects.some(other=>other.id!==o.id&&other.command.roboNativeIds?.points.includes(o.id)))throw new Error('Delete connected shapes before deleting this shared point.');const removed=new Set([o.id]);for(let pass=0;pass<s.objects.length;pass++)for(const child of s.objects)if(child.command.roboDependency?.parents.some(parent=>removed.has(parent.objectId)))removed.add(child.id);for(const object of s.objects.filter(object=>removed.has(object.id)))effects.push({...object.command,roboControl:'delete'});s.objects=s.objects.filter(obj=>!removed.has(obj.id));s.selectedIds=s.selectedIds.filter(id=>!removed.has(id));messages.push(`Deleted ${o.type}${removed.size>1?` and ${removed.size-1} dependent construction(s)`:''}.`);continue;}
    if(c.action==='SHOW'||c.action==='HIDE'){o.style.visible=c.action==='SHOW';o.command.roboVisible=o.style.visible;effects.push({...o.command,roboControl:'visibility'});messages.push(`${c.action==='SHOW'?'Showing':'Hidden'} ${o.type}.`);continue;}
    const visual=structuredClone(o.command);visual.action='update';visual.roboControl=undefined;
    if(c.action==='LOCK'||c.action==='UNLOCK'){visual.roboLocked=c.action==='LOCK';store(visual,o.originalId);messages.push(`${c.action==='LOCK'?'Locked':'Unlocked'} ${o.label??o.type}.`);continue;}
    if(c.action==='EXTEND'){const [a,b]=vertices(o);visual.points=[a,a.map((n,i)=>n+(b[i]-n)*Number(p.factor))];visual.scale=1;visual.rotation=[0,0,0];}
    if(c.action==='DUPLICATE'){visual.objectId=crypto.randomUUID();visual.roboLabel=undefined;visual.roboNativeIds=undefined;visual.action='create';store(visual,o.id);messages.push(`Duplicated ${o.type}.`);continue;}
    if(c.action==='MOVE'){const v=p.vector!;if(v.length!==dimension)throw new Error(`Provide ${dimension} translation coordinates.`);const delta=p.absolute?v.map((n,i)=>n-center(o)[i]):v;visual.points=(visual.points.length?visual.points:[Array(dimension).fill(0)]).map(pt=>pt.map((n,i)=>n+delta[i]));}
    if(c.action==='ROTATE'){visual.rotation=[...(visual.rotation??[0,0,0])];const axis=p.axis??'z';if(dimension===2&&axis!=='z')throw new Error('2D rotation uses the z-axis.');visual.rotation['xyz'.indexOf(axis)]+=p.angle!;}
    if(c.action==='SCALE')visual.scale=(visual.scale??1)*p.factor!;
    if(c.action==='REFLECT'){
      if(c.subAction==='DIAGONAL'){visual.points=vertices(o).map(pt=>[pt[1],pt[0]]);visual.rotation=[0,0,0];visual.scale=1;visual.roboExplicitVertices=true;if(o.type==='circle')visual.points=[center(o).reverse()];}
      else {
      const axes:Record<string,number[]>={X_AXIS:[1],Y_AXIS:[0],ORIGIN:[0,1],XY_PLANE:[2],XZ_PLANE:[1],YZ_PLANE:[0]};const flip=axes[c.subAction];
      if(!flip)throw new Error('UNSUPPORTED: That reflection axis is unavailable.');
      if(['circle','sphere'].includes(o.type))visual.points=[center(o).map((n,i)=>flip.includes(i)?-n:n)];
      else if(dimension===2&&o.type!=='plot'){visual.points=vertices(o).map(pt=>pt.slice(0,2).map((n,i)=>flip.includes(i)?-n:n));visual.rotation=[0,0,0];visual.scale=1;visual.fitDimensions=false;visual.roboExplicitVertices=true;}
      else if(dimension===3){visual.points=[center(o).map((n,i)=>flip.includes(i)?-n:n)];visual.rotation=(visual.rotation??[0,0,0]).map((n,i)=>flip.includes(i)?n:-n) as [number,number,number];}
      else throw new Error('UNSUPPORTED: Reflecting function graphs is not yet available.');
      }
    }
    if(c.action==='CHANGE'||c.action==='RESIZE'){
      if(typeof p.widthFactor==='number')p.width=visual.width*p.widthFactor;if(typeof p.heightFactor==='number')p.height=visual.height*p.heightFactor;
      if(c.subAction==='LENGTH'||c.subAction==='SLOPE'){const [a,b]=vertices(o),length=c.subAction==='LENGTH'?Number(p.length):distance(a,b),slope=Number(p.slope),u=c.subAction==='SLOPE'?unit([1,slope]):unit(subtract(b,a));visual.points=[a,a.map((n,i)=>n+u[i]*length)];visual.scale=1;visual.rotation=[0,0,0];}
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
