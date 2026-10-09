import {validateImportedScene} from './importValidation';
import {safeAst} from '../kernel/safeExpression';
import {validateMathObjectGraph,type MathDefinition,type MathObjectGraph,type MathObjectIR} from '../../math-foundation/mathIR';
import {vertices,center} from './geometryQueries';
import type {RoboObjectDescriptor,RoboSceneContext} from './types';
function definition(object:RoboObjectDescriptor):MathDefinition{
 const points=vertices(object).map(p=>[...p]),command=object.command;
 if(object.type==='plot'&&command.expression){try{const ast=safeAst(command.expression);return {kind:ast.type==='EQUATION'?'equation':ast.type==='INEQUALITY'?'inequality':'expression',ast};}catch{return {kind:'unsupported',originalKind:'plot',reason:'The native graph expression is outside the bounded canonical scalar AST support.'};}}
 if(object.type==='point')return {kind:'point',coordinates:[...object.position]};
 if(['circle','sphere'].includes(object.type))return {kind:object.type as 'circle'|'sphere',center:center(object),radius:command.radius*(command.scale??1)};
 if(['line','segment','ray','vector'].includes(object.type)&&points.length===2)return {kind:object.type==='line'&&command.linearExtent==='segment'?'segment':object.type as 'line'|'segment'|'ray'|'vector',points:points as [number[],number[]]};
 if(['triangle','polygon','rectangle','square'].includes(object.type))return {kind:object.type==='square'?'rectangle':object.type as 'triangle'|'polygon'|'rectangle',vertices:points};
 if(object.type==='plane'&&points.length>=3)return {kind:'plane',points:points.slice(0,3) as [number[],number[],number[]]};
 return {kind:'unsupported',originalKind:object.type,reason:'The existing renderer supports this object, but no canonical definition for it is established in MathIR v1.'};
}
export function canonicalObjectGraph(scene:Pick<RoboSceneContext,'objects'>):MathObjectGraph{
 const objects:MathObjectIR[]=scene.objects.map(object=>{
  const d=definition(object),command=object.command;
  if(command.roboSchemaVersion!==undefined&&command.roboSchemaVersion!==1)throw new Error('Unsupported persisted Ruhi command schema version.');
  return {id:object.id,aliases:object.label?[object.label]:[],definition:d,state:command.roboDefinitionState??(d.kind==='unsupported'?{status:'unsupported',reason:d.reason}:{status:'defined'}),unit:{symbol:object.type==='plot'?'1':'u',dimension:object.type==='plot'?'dimensionless':'length',scaleToBase:1},domain:'REAL',assumptions:[],dependencies:[...new Set(command.roboDependency?.parents.map(p=>p.objectId)??[])]};
 });
 const graph:MathObjectGraph={schema:'ruhi-math-object-graph',version:1,objects};validateMathObjectGraph(graph);return graph;
}
export type RoboSceneEnvelope={schema:'ruhi-scene';version:1;graph:MathObjectGraph;scene:RoboSceneContext;history:{undo:RoboSceneContext[];redo:RoboSceneContext[]}};
export function serializeRoboScene(scene:RoboSceneContext,undo:RoboSceneContext[]=[],redo:RoboSceneContext[]=[]):string{
 if(undo.length>100||redo.length>100)throw new Error('History exceeds the 100-entry limit.');
 for(const entry of [...undo,...redo])canonicalObjectGraph(entry);
 const envelope:RoboSceneEnvelope={schema:'ruhi-scene',version:1,graph:canonicalObjectGraph(scene),scene:structuredClone(scene),history:{undo:structuredClone(undo),redo:structuredClone(redo)}};
 const text=JSON.stringify(envelope);if(text.length>4000000)throw new Error('Scene exceeds the 4 MB import/export budget.');return text;
}
export function deserializeRoboScene(text:string,mode:RoboSceneContext['activeMode']):RoboSceneEnvelope{
 if(text.length>4000000)throw new Error('Scene exceeds the 4 MB import/export budget.');
 const raw=JSON.parse(text),legacy=raw?.schema===undefined&&Array.isArray(raw?.objects);
 if(!legacy&&(raw?.schema!=='ruhi-scene'||raw.version!==1))throw new Error('Unsupported scene schema version.');
 const scene:RoboSceneContext=legacy?raw:raw.scene;
 validateImportedScene(scene,mode);
 const graph=canonicalObjectGraph(scene),history=legacy?{undo:[],redo:[]}:raw.history;
 if(!history||!Array.isArray(history.undo)||!Array.isArray(history.redo)||history.undo.length>100||history.redo.length>100)throw new Error('Invalid persisted history.');
 for(const entry of [...history.undo,...history.redo]){validateImportedScene(entry,mode);canonicalObjectGraph(entry);}
 if(!legacy&&JSON.stringify(raw.graph)!==JSON.stringify(graph))throw new Error('Canonical and compatible native definitions disagree.');
 if(scene.selectedIds.some(id=>!scene.objects.some(o=>o.id===id)))throw new Error('Selection contains a dangling semantic ID.');
 return {schema:'ruhi-scene',version:1,graph,scene,history};
}
