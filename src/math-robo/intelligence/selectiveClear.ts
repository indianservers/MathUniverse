import {COLORS,FLAT_SHAPES,SOLID_SHAPES} from '../../offline-intelligence/shapeCatalog';
import {ResolutionError,resolveTarget} from './targetResolver';
import type {RoboTarget,RoboSceneContext} from './types';

const kinds=[...new Set([...FLAT_SHAPES,...SOLID_SHAPES,'point','line','ray','vector','plot','graph','plane','arc','sector'])].sort((a,b)=>b.length-a.length);
const selector=new RegExp(`^(?:(?:all|the|a|an|any|each)\\s+)?(?:(first|second|third|fourth|last|newest|oldest)\\s+)?(?:(${Object.keys(COLORS).join('|')})\\s+)?(${kinds.join('|')})s?(?:\\s+(?:(?:named|called|labelled|labeled)\\s+)?([a-z][a-z0-9_-]*))?$`);
export const selectiveClearExamples=['Clear all except circle','Clear all except circles','Delete all except the circle','Remove everything except circles','Clear all except for circles','Clear all excluding circles','Clear all apart from circles','Delete everything other than circles','Clear all but keep circles','Clear all but circles','Clear all except blue circles','Clear all except circle C1','Clear all except circles and triangles'];
export function parseSelectiveClear(text:string):{targets?:RoboTarget[];error?:string}|undefined {
 const reversed=text.match(/^(?:keep|leave|save) (.+?) (?:and|then|while) (?:clear|delete|remove|reset) (?:everything else|the rest|all else|all other objects)$/);
 if(reversed)text='clear all except '+reversed[1];
 else if(/^(?:keep|leave|save)\b/.test(text)&&/\b(?:clear|delete|remove|reset)\b/.test(text))return {error:'Specify the objects to keep and say clear everything else. Nothing was cleared.'};
 if(!/^(?:clear|reset|delete|remove)\b/.test(text))return;
 const exception=text.match(/\b(?:except(?:\s+for)?|excluding|apart\s+from|other\s+than|but(?:\s+(?:keep|not|leave))?)\b(.*)$/);
 if(!exception)return;
 const scope=text.slice(0,exception.index).trim();
 if(!/^(?:clear|reset|delete|remove) (?:all|everything|all objects|all the objects)$/.test(scope)&&! /^(?:clear|reset)(?: (?:the )?(?:workspace|canvas|scene))?$/.test(scope))return {error:'Specify the deletion scope, for example “clear all except circles”.'};
 const parts=exception[1].trim().split(/\s*(?:,|\band\b|\bor\b)\s*/);
 const targets:RoboTarget[]=[];
 for(const part of parts){
  if(!part)return {error:'Specify which objects to keep before clearing anything.'};
  if(/^(?:it|this|that|selected|the selected objects)$/.test(part)){targets.push(/selected/.test(part)?'selected':'lastReferenced');continue;}
  const match=part.match(selector);
  if(match){const [,ordinal,color,kind,name]=match;const type=kind==='graph'?'plot':kind;targets.push({type,...(color?{color}:{}),...(name?{name}:{}),...(ordinal?{index:['last','newest'].includes(ordinal)?-1:ordinal==='oldest'?1:['first','second','third','fourth'].indexOf(ordinal)+1}:{})});continue;}
  if(/^[a-z][a-z0-9_-]*$/.test(part)){targets.push({name:part});continue;}
  return {error:`I could not identify “${part}” as an exception. Name the objects or shape types to keep.`};
 }
 return {targets};
}
export function preservedObjectIds(targets:RoboTarget[],scene:RoboSceneContext):Set<string>{
 if(!targets.length)throw new ResolutionError([],'Specify at least one object to keep.');
 const keep=new Set<string>();
 for(const target of targets){
  const matches=target==='selected'?scene.objects.filter(o=>scene.selectedIds.includes(o.id)):typeof target==='object'&&target.type&&!target.name&&!target.id&&target.index===undefined&&!target.relation&&!target.reference?scene.objects.filter(o=>(o.type===target.type||target.type==='polygon'&&['triangle','rectangle','square','pentagon','hexagon','parallelogram','rhombus','trapezoid'].includes(o.type))&&(!target.color||o.style.color===(COLORS[target.color]??target.color))):[resolveTarget(target,scene)];
  if(!matches.length||matches.some(o=>!scene.objects.some(native=>native.id===o.id)))throw new ResolutionError([],`No existing objects match the exception. Nothing was cleared.`);
  matches.forEach(o=>keep.add(o.id));
 }
 // Preserve the defining construction too: a retained object cannot lose its parents.
 const visit=(id:string)=>{const object=scene.objects.find(o=>o.id===id);for(const parent of object?.command.roboDependency?.parents??[]){if(!keep.has(parent.objectId)){if(!scene.objects.some(o=>o.id===parent.objectId))throw new ResolutionError([],'The retained construction has a missing parent. Nothing was cleared.');keep.add(parent.objectId);visit(parent.objectId);}}};
 for(const id of [...keep])visit(id);
 return keep;
}
