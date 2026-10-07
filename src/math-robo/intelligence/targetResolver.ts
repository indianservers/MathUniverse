import { COLORS } from '../../offline-intelligence/shapeCatalog';
import type { RoboObjectDescriptor, RoboSceneContext, RoboTarget } from './types';
import {measurement} from './geometryQueries';
export class ResolutionError extends Error { constructor(public candidates:string[],message:string) { super(message); } }
export function resolveTarget(target:RoboTarget|undefined,scene:RoboSceneContext):RoboObjectDescriptor {
  const objects=scene.objects;
  if(typeof target==='string') {
    const explicit=objects.find(object=>object.id.toLowerCase()===target.toLowerCase()||object.label?.toLowerCase()===target.toLowerCase());
    if(explicit)return explicit;
    const ref=target==='$previous'||target==='lastCreated'?scene.lastCreated:target==='lastModified'?scene.lastModified:target==='lastSelected'?scene.selectedIds.at(-1):target==='lastReferenced'?scene.lastReferenced:undefined;
    if(ref){const object=objects.find(object=>object.id===ref);if(object)return object;}
    if(target==='original') {const last=objects.find(o=>o.id===scene.lastCreated);const original=objects.find(o=>o.id===last?.originalId);if(original)return original;}
    if(target==='copy'){const object=[...objects].reverse().find(o=>o.originalId);if(object)return object;}
    if(!['it','this','that','lastReferenced','lastCreated','$previous','selected','original','copy'].includes(target))throw new ResolutionError([],`No object named ${target} exists.`);
  }
  const descriptor=typeof target==='object'?target:{};
  const candidates=objects.filter(o=>(!descriptor.id||o.id===descriptor.id)&&(!descriptor.name||o.label?.toLowerCase()===descriptor.name.toLowerCase()||o.id.toLowerCase()===descriptor.name.toLowerCase()||o.id.toLowerCase()===`${descriptor.type}_${descriptor.name}`.toLowerCase())&&(!descriptor.type||o.type===descriptor.type)&&(!descriptor.color||o.style.color===descriptor.color||o.style.color===COLORS[descriptor.color]));
  if(descriptor.id||descriptor.name) { if(candidates.length===1)return candidates[0]; throw new ResolutionError(candidates.map(o=>o.id),'That named object was not found.'); }
  if(descriptor.index!==undefined){const object=descriptor.index===-1?candidates.at(-1):candidates[descriptor.index-1];if(object)return object;throw new ResolutionError([],'That object index is out of range.');}
  if(descriptor.relation) {
    const score=(o:RoboObjectDescriptor)=>descriptor.relation==='nearest'?Math.hypot(...o.position):Number(measurement(o,o.type==='line'?'LENGTH':o.mode.endsWith('3d')&&!['circle','triangle','rectangle','square','polygon'].includes(o.type)?'VOLUME':'AREA'));
    const sorted=[...candidates].sort((a,b)=>descriptor.relation==='largest'?score(b)-score(a):score(a)-score(b));
    if(sorted.length && (sorted.length===1||Math.abs(score(sorted[0])-score(sorted[1]))>1e-8))return sorted[0];
  } else {
    const selected=candidates.filter(o=>scene.selectedIds.includes(o.id));if(selected.length===1)return selected[0];
    if(descriptor.reference){for(const id of [scene.lastReferenced,scene.lastCreated]){const object=candidates.find(o=>o.id===id);if(object)return object;}}
    for(const id of [scene.lastReferenced,scene.lastCreated,scene.lastModified]) { const object=candidates.find(o=>o.id===id); if(object && (typeof target==='string'||!descriptor.type))return object; }
    if(candidates.length===1)return candidates[0];
  }
  throw new ResolutionError(candidates.map(o=>o.id),candidates.length?'Several objects match. Select one or specify its name, color or index.':'No matching object exists. Create it first.');
}
export function targetFromPhrase(text:string):RoboTarget {
  if(/\boriginal\b/.test(text))return 'original';if(/\bcopy\b/.test(text))return 'copy';if(/\bselected\b/.test(text))return 'selected';
  const type=text.match(/\b(circle|line|point|rectangle|square|triangle|sphere|cube|cuboid|cylinder|cone|plot|graph|shape)s?\b/)?.[1];
  const kind=type==='graph'?'plot':type==='shape'?undefined:type;
  const colorMatch=text.match(new RegExp(`\\b(${Object.keys(COLORS).join('|')})\\b`));
  const color=colorMatch&&type&&(colorMatch.index??0)<text.indexOf(type)?colorMatch[1]:undefined;
  const relation=text.match(/\b(largest|smallest|nearest)\b/)?.[1] as 'largest'|'smallest'|'nearest'|undefined;
  const ordinal=text.match(/\b(first|second|third|fourth)\b/)?.[1];
  const index=ordinal?['first','second','third','fourth'].indexOf(ordinal)+1:undefined;
  const name=text.match(/\b(?:point|line|circle)\s+([a-z])\b/i)?.[1];
  if(name)return {name,type:kind};
  if(/\b(last|previous)\b/.test(text)&&kind)return {id:undefined,type:kind,index:-1};
  if(kind||relation||index)return {type:kind,...(color?{color}:{}),...(relation?{relation}:{}),...(index?{index}:{}),...(/\b(that|this)\b/.test(text)?{reference:'lastReferenced' as const}:{})};
  return 'lastReferenced';
}
