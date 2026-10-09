import {compileFunctionExpression,compileTwoVariableExpression} from '../../utils/functionParser';
import type {RoboSceneContext} from './types';
import {FLAT_SHAPES,SOLID_SHAPES} from '../../offline-intelligence/shapeCatalog';
const kinds=new Set<string>([...FLAT_SHAPES,...SOLID_SHAPES,'plot','point','line','ray','vector','plane']);
/** Validate serialized data before any renderer control or geometry code sees it. */
export function validateImportedScene(value:unknown,mode:RoboSceneContext['activeMode']):asserts value is RoboSceneContext{
 if(!value||typeof value!=='object')throw new Error('Invalid scene.');
 const scene=value as Record<string,unknown>;
 if(scene.activeMode!==mode||!Array.isArray(scene.objects)||scene.objects.length>1000||!Array.isArray(scene.selectedIds))throw new Error('Invalid scene mode or 1000-object budget.');
 const ids=new Set<string>();
 for(const raw of scene.objects){
  if(!raw||typeof raw!=='object')throw new Error('Invalid scene object.');
  const object=raw as Record<string,unknown>,command=object.command as Record<string,unknown>|undefined;
  if(typeof object.id!=='string'||!object.id||object.id.length>256||ids.has(object.id)||object.mode!==mode)throw new Error('Invalid or duplicate object identity.');ids.add(object.id);
  if(!command||typeof command!=='object'||!kinds.has(String(command.kind))||!['2d','3d'].includes(String(command.dimension)))throw new Error('Invalid object command.');
  if(command.roboControl!==undefined||command.roboClearAll!==undefined)throw new Error('Scene objects cannot contain renderer control commands.');
  if(command.action!==undefined&&!['create','update'].includes(String(command.action))||command.objectId!==undefined&&command.objectId!==object.id)throw new Error('Object command identity mismatch.');
  const dimension=command.dimension==='3d'?3:2;
  const point=(p:unknown):p is number[]=>Array.isArray(p)&&p.length===dimension&&p.every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=1e9);
  if(!Array.isArray(command.points)||command.points.length>4096||!command.points.every(point)||!point(object.position))throw new Error('Invalid finite coordinates or vertex budget.');
  for(const key of ['width','height','radius'])if(typeof command[key]!=='number'||!Number.isFinite(command[key])||Number(command[key])<=0||Number(command[key])>1e9)throw new Error('Invalid positive object dimensions.');
  if(command.scale!==undefined&&(typeof command.scale!=='number'||!Number.isFinite(command.scale)||command.scale<=0||command.scale>1e9))throw new Error('Invalid object scale.');
  if(command.rotation!==undefined&&(!Array.isArray(command.rotation)||command.rotation.length!==3||!command.rotation.every(n=>typeof n==='number'&&Number.isFinite(n))))throw new Error('Invalid rotation.');
  if(typeof command.color!=='string'||command.color.length>128||typeof object.type!=='string'||object.type!==(command.roboSemanticKind??command.kind))throw new Error('Invalid object type or style.');
  if(command.kind==='point'&&(command.points.length!==1||command.points[0].some((n:number,i:number)=>Math.abs(n-(object.position as number[])[i])>1e-8)))throw new Error('Point command and semantic coordinates disagree.');
  if(command.expression!==undefined&&(typeof command.expression!=='string'||command.expression.length>2048))throw new Error('Invalid expression budget.');
  if(command.kind==='plot'){if(typeof command.expression!=='string')throw new Error('Missing plot expression.');if(dimension===2)compileFunctionExpression(command.expression);else compileTwoVariableExpression(command.expression);}
  const parents=(command.roboDependency as {parents?:unknown})?.parents;
  if(parents!==undefined&&(!Array.isArray(parents)||parents.length>256||parents.some(p=>!p||typeof p.objectId!=='string'||p.vertex!==undefined&&(!Number.isInteger(p.vertex)||p.vertex<0||p.vertex>4095))))throw new Error('Invalid dependency references.');
 }
 for(const key of ['selectedIds','activeObjectIds','previousSelectedIds','recentlyReferencedObjectIds','lastQueryTargets'] as const){const list=scene[key];if(list!==undefined&&(!Array.isArray(list)||list.length>1000||list.some(id=>typeof id!=='string'||!ids.has(id))))throw new Error('Dangling persisted references.');}
 for(const key of ['lastCreated','lastModified','lastReferenced'])if(scene[key]!==undefined&&!ids.has(String(scene[key])))throw new Error('Dangling persisted object.');
 if(scene.previousCommands!==undefined&&(!Array.isArray(scene.previousCommands)||scene.previousCommands.length>100)||scene.previousResults!==undefined&&(!Array.isArray(scene.previousResults)||scene.previousResults.length>100))throw new Error('Invalid conversation history budget.');
}
