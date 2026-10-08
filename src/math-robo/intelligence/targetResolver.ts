import { COLORS } from '../../offline-intelligence/shapeCatalog';
import type { RoboObjectDescriptor, RoboSceneContext, RoboTarget } from './types';
import {measurement} from './geometryQueries';
import {referenceScores} from './contextEngine';
import {DISPLAY_EPSILON} from './tolerances';
export class ResolutionError extends Error { constructor(public candidates:string[],message:string) { super(message); } }
export function resolveTarget(target:RoboTarget|undefined,scene:RoboSceneContext):RoboObjectDescriptor {
  const objects=scene.objects;
  if(typeof target==='string'&&target.startsWith('$points')){
    const names=target.split(':').slice(1);let points=names.length===2?names.map(name=>resolveTarget(name,scene)):objects.filter(o=>o.type==='point');
    if(!names.length&&scene.selectedIds.length===2)points=scene.selectedIds.map(id=>resolveTarget(id,scene));
    if(points.length!==2||points.some(p=>p.type!=='point'))throw new ResolutionError([],'Specify two point names, for example midpoint of A and B.');
    const vertices=points.map(p=>p.position);
    return {...points[0],id:target,type:'line',label:`${points[0].label}${points[1].label}`,vertices,derivedFrom:points.map(p=>p.id),command:{...points[0].command,kind:'line',points:vertices,roboExplicitVertices:true,roboDependency:{kind:'line',parents:points.map(p=>({objectId:p.id}))}}};
  }
  if(typeof target==='string'&&target.startsWith('$edge:')){
    const [,side,parentId]=target.split(':'),parent=parentId?objects.find(o=>o.id===parentId):objects.find(o=>scene.selectedIds.includes(o.id)&&['rectangle','square','triangle','polygon'].includes(o.type))??objects.find(o=>(scene.activeObjectIds?.includes(o.id)||o.id===scene.lastReferenced)&&['rectangle','square','triangle','polygon'].includes(o.type));
    const candidates=objects.filter(o=>['rectangle','square','triangle','polygon'].includes(o.type));const shape=parent??(candidates.length===1?candidates[0]:undefined);if(!shape)throw new ResolutionError(candidates.map(o=>o.id),'Which shape has that edge?');
    const vs=shape.vertices??[],edges=vs.map((p,i)=>({i,j:(i+1)%vs.length,x:(p[0]+vs[(i+1)%vs.length][0])/2,y:(p[1]+vs[(i+1)%vs.length][1])/2,length:Math.hypot(...p.map((n,k)=>n-vs[(i+1)%vs.length][k]))}));
    edges.sort((a,b)=>side==='top'?b.y-a.y:side==='bottom'?a.y-b.y:side==='left'?a.x-b.x:side==='right'?b.x-a.x:b.length-a.length);const edge=edges[0];if(!edge)throw new ResolutionError([],'That shape has no valid edge.');const points=[vs[edge.i],vs[edge.j]];
    return {...shape,id:`$edge:${side}:${shape.id}`,label:`${shape.label??'shape'} ${side} edge`,type:'line',position:points[0],vertices:points,derivedFrom:[shape.id],command:{...shape.command,kind:'line',points,rotation:[0,0,0],scale:1,roboExplicitVertices:true,roboDependency:{kind:'line',parents:[{objectId:shape.id,vertex:edge.i},{objectId:shape.id,vertex:edge.j}]}}};
  }
  const symbolic=typeof target==='string'?target:target?.name;
  if(symbolic&&!objects.some(o=>o.id.toLowerCase()===symbolic.toLowerCase()||o.label?.toLowerCase()===symbolic.toLowerCase())){
    for(const parent of [...objects].reverse()){
      const labels=parent.command.roboVertexLabels;
      if(!labels)continue;
      const names=symbolic.length===2?symbolic.split(''):[symbolic],indexes=names.map(name=>labels.findIndex(label=>label.toLowerCase()===name.toLowerCase()));
      if(indexes.every(i=>i>=0)&&parent.vertices){const pts=indexes.map(i=>parent.vertices![i]);return {...parent,id:`${parent.id}:${symbolic.toUpperCase()}`,label:symbolic.toUpperCase(),type:pts.length===1?'point':'line',position:pts[0],vertices:pts,derivedFrom:[parent.id],command:{...parent.command,objectId:`${parent.id}:${symbolic}`,kind:pts.length===1?'point':'line',points:pts,rotation:[0,0,0],scale:1,roboExplicitVertices:true,roboVertexLabels:undefined,roboNativeIds:undefined}};}
    }
  }
  if(typeof target==='string') {
    const explicit=objects.find(object=>object.id.toLowerCase()===target.toLowerCase()||object.label?.toLowerCase()===target.toLowerCase());
    if(explicit)return explicit;
    const ref=target==='$previous'||target==='lastCreated'?scene.lastCreated:target==='lastModified'?scene.lastModified:target==='lastSelected'?scene.selectedIds.at(-1):target==='lastReferenced'?(scene.selectedIds.length===1?scene.selectedIds[0]:scene.activeObjectIds?.at(-1)??scene.lastReferenced):target==='previous'?scene.previousSelectedIds?.at(-1)??scene.objects.at(-2)?.id:undefined;
    if(ref){const object=objects.find(object=>object.id===ref);if(object)return object;}
    if(target==='original') {const last=objects.find(o=>o.id===scene.lastCreated);const original=objects.find(o=>o.id===last?.originalId);if(original)return original;}
    if(target==='copy'){const object=[...objects].reverse().find(o=>o.originalId);if(object)return object;}
    if(!['it','this','that','lastReferenced','lastCreated','$previous','selected','original','copy','previous'].includes(target))throw new ResolutionError([],`No object named ${target} exists.`);
  }
  const descriptor=typeof target==='object'?target:{};
  const candidates=objects.filter(o=>(!descriptor.id||o.id===descriptor.id)&&(!descriptor.name||o.label?.toLowerCase()===descriptor.name.toLowerCase()||o.id.toLowerCase()===descriptor.name.toLowerCase()||o.id.toLowerCase()===`${descriptor.type}_${descriptor.name}`.toLowerCase())&&(!descriptor.type||o.type===descriptor.type)&&(!descriptor.color||o.style.color===descriptor.color||o.style.color===COLORS[descriptor.color])).sort((a,b)=>(a.creationOrder??0)-(b.creationOrder??0));
  if(descriptor.id||descriptor.name) { if(candidates.length===1)return candidates[0]; throw new ResolutionError(candidates.map(o=>o.id),'That named object was not found.'); }
  if(descriptor.index!==undefined){const object=descriptor.index===-1?candidates.at(-1):candidates[descriptor.index-1];if(object)return object;throw new ResolutionError([],'That object index is out of range.');}
  if(descriptor.relation) {
    if(['horizontal','vertical','above'].includes(descriptor.relation)){const matches=candidates.filter(o=>descriptor.relation==='above'?o.position[1]>DISPLAY_EPSILON:o.type==='line'&&Math.abs(o.vertices![1][descriptor.relation==='horizontal'?1:0]-o.vertices![0][descriptor.relation==='horizontal'?1:0])<DISPLAY_EPSILON);if(matches.length===1)return matches[0];throw new ResolutionError(matches.map(o=>o.id),'Several objects match this geometric attribute. Select one.');}
    const score=(o:RoboObjectDescriptor)=>descriptor.relation==='nearest'?Math.hypot(...o.position):descriptor.relation==='leftmost'?o.position[0]:Number(measurement(o,o.type==='line'?'LENGTH':o.mode.endsWith('3d')&&!['circle','triangle','rectangle','square','polygon'].includes(o.type)?'VOLUME':'AREA'));
    const sorted=[...candidates].sort((a,b)=>['largest','longest'].includes(descriptor.relation!)?score(b)-score(a):score(a)-score(b));
    if(sorted.length && (sorted.length===1||Math.abs(score(sorted[0])-score(sorted[1]))>1e-8))return sorted[0];
  } else {
    const selected=candidates.filter(o=>scene.selectedIds.includes(o.id));if(selected.length===1)return selected[0];
    if(descriptor.reference){for(const id of [scene.lastReferenced,scene.lastCreated]){const object=candidates.find(o=>o.id===id);if(object)return object;}}
    if(typeof target==='string'||!descriptor.type){const scores=referenceScores(scene,candidates.map(o=>o.id));if(scores.length&&scores[0].score>0&&(scores.length===1||scores[0].score-scores[1].score>=10))return candidates.find(o=>o.id===scores[0].id)!;}
    if(candidates.length===1)return candidates[0];
  }
  throw new ResolutionError(candidates.map(o=>o.id),candidates.length?'Several objects match. Select one or specify its name, color or index.':'No matching object exists. Create it first.');
}
export function targetFromPhrase(text:string):RoboTarget {
  const edge=text.match(/\b(top|bottom|left|right|longest) (?:edge|side)\b/)?.[1];if(edge)return `$edge:${edge}`;
  if(/\boriginal\b/.test(text))return 'original';if(/\bcopy\b/.test(text))return 'copy';if(/\bselected\b/.test(text))return 'selected';
  const type=text.match(/\b(circle|line|point|rectangle|square|triangle|sphere|cube|cuboid|cylinder|cone|plot|graph|shape)s?\b/)?.[1];
  const kind=type==='graph'?'plot':type==='shape'?undefined:type;
  const colorMatch=text.match(new RegExp(`\\b(${Object.keys(COLORS).join('|')})\\b`));
  const color=colorMatch&&type&&(colorMatch.index??0)<text.indexOf(type)?colorMatch[1]:undefined;
  const relation=text.match(/\b(largest|smallest|nearest|longest|leftmost|horizontal|vertical|above)\b/)?.[1] as Exclude<RoboTarget,string>['relation'];
  const ordinal=text.match(/\b(first|second|third|fourth)\b/)?.[1];
  const index=ordinal?['first','second','third','fourth'].indexOf(ordinal)+1:undefined;
  const name=text.match(/\b(?:point|line|circle|triangle|rectangle|square)\s+([a-z]\d*|[a-z]{2})\b/i)?.[1];
  if(name&&!['to','at','of','on','by','is','as','in'].includes(name))return {name,type:kind};
  if(/\bprevious one\b/.test(text))return 'previous';
  if(/\b(last|newest)\b/.test(text)&&kind)return {type:kind,index:-1};
  if(/\boldest\b/.test(text)&&kind)return {type:kind,index:1};
  if(/\bprevious\b/.test(text)&&kind)return {type:kind,index:-1};
  if(kind||relation||index)return {type:kind,...(color?{color}:{}),...(relation?{relation}:{}),...(index?{index}:{}),...(/\b(that|this)\b/.test(text)?{reference:'lastReferenced' as const}:{})};
  return 'lastReferenced';
}
export function resolveTargets(targets:RoboTarget[]|undefined,target:RoboTarget|undefined,scene:RoboSceneContext):RoboObjectDescriptor[]{
  if(targets)return targets.map(t=>resolveTarget(t,scene));
  const selected=scene.selectedIds.map(id=>scene.objects.find(o=>o.id===id)).filter((o):o is RoboObjectDescriptor=>!!o);
  if(selected.length>=2)return selected;
  const type=typeof target==='object'?target.type:undefined;
  const recent=(scene.activeObjectIds??scene.lastQueryTargets??[]).map(id=>scene.objects.find(o=>o.id===id)).filter((o):o is RoboObjectDescriptor=>!!o&&(!type||o.type===type));
  if(recent.length>=2)return recent;
  const candidates=scene.objects.filter(o=>!type||o.type===type);
  if(candidates.length===2)return candidates;
  throw new ResolutionError(candidates.map(o=>o.id),candidates.length>2?'Select two objects or specify their names.':'This operation needs two existing objects.');
}
