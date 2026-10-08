import {evaluate,type GeomObject} from '../../studios/geometry/construction/constructionEngine';
import {add3,scale3,point3} from '../../workspace/geometry3dKernel';
import {describeObject} from './sceneContext';
import {vertices,relationship} from './geometryQueries';
import type {RoboObjectDescriptor,RoboSceneContext} from './types';
import type {VisualCommand} from '../../offline-intelligence/commands';
export type DependencyRef={objectId:string;vertex?:number;edge?:[number,number]};
export type RoboDependency={kind:'midpoint'|'triangle'|'polygon'|'line'|'perp'|'parallel'|'intersection'|'tangent';parents:DependencyRef[];index?:number;angle?:number};
export function vertexReference(object:RoboObjectDescriptor,index:number):DependencyRef{return {objectId:object.id,vertex:index};}
export function recomputeRoboDependencies(scene:RoboSceneContext):VisualCommand[]{
  if(!scene.objects.some(o=>o.command.roboDependency))return [];
  if(scene.activeMode.endsWith('3d')){
    const effects:VisualCommand[]=[],visited=new Set<string>(),visiting=new Set<string>();
    const refresh=(object:RoboObjectDescriptor)=>{
      if(visited.has(object.id))return;if(visiting.has(object.id))throw new Error('The construction contains a dependency cycle.');visiting.add(object.id);
      const definition=object.command.roboDependency;
      if(definition?.kind==='midpoint'){
        const positions=definition.parents.map(ref=>{const parent=scene.objects.find(o=>o.id===ref.objectId);if(!parent)throw new Error('The midpoint parent is missing.');refresh(parent);return ref.vertex===undefined?parent.position:vertices(parent)[ref.vertex];});
        if(positions.length!==2||positions.some(p=>!p))throw new Error('A midpoint needs two defined parents.');
        const value=scale3(add3(point3(...positions[0] as [number,number,number]),point3(...positions[1] as [number,number,number])),0.5),points=[[value.x,value.y,value.z]];
        if(JSON.stringify(points)!==JSON.stringify(object.command.points)){const command={...object.command,action:'update' as const,points,scale:1,rotation:[0,0,0] as [number,number,number]};effects.push(command);Object.assign(object,describeObject(command,scene.activeMode));}
      }
      visiting.delete(object.id);visited.add(object.id);
    };
    scene.objects.forEach(refresh);return effects;
  }
  const graph:GeomObject[]=[],base=(id:string,kind:GeomObject['kind'],parents:string[]=[],params?:GeomObject['params']):GeomObject=>({id,kind,label:id,parents,params,visible:true,locked:false,constructed:kind!=='freePoint'});
  const refs=(ref:DependencyRef):string=>{
    const parent=scene.objects.find(o=>o.id===ref.objectId);if(!parent)throw new Error('A construction parent was removed. Undo its deletion or delete the dependent construction.');
    if(ref.edge){const id=`${ref.objectId}:edge${ref.edge.join('_')}`;if(!graph.some(o=>o.id===id))graph.push(base(id,'line',ref.edge.map(vertex=>refs({objectId:ref.objectId,vertex}))));return id;}
    if(ref.vertex===undefined)return ref.objectId;
    const definition=parent.command.roboDependency;
    if(definition&&['triangle','polygon','line'].includes(definition.kind))return refs(definition.parents[ref.vertex]);
    return `${ref.objectId}:v${ref.vertex}`;
  };
  for(const o of scene.objects){
    const d=o.command.roboDependency;
    if(d){if(d.kind==='tangent'){const circleId=d.parents[0].objectId,at=d.parents[1]?refs(d.parents[1]):`${o.id}:at`,radius=`${o.id}:radius`;if(!d.parents[1])graph.push(base(at,'pointOnObject',[circleId],{t:d.angle??0}));graph.push(base(radius,'line',[`${circleId}:center`,at]),base(o.id,'perp',[at,radius]));}else graph.push(base(o.id,d.kind,d.parents.map(refs),d.index===undefined?undefined:{index:d.index}));continue;}
    if(o.type==='point'){graph.push(base(o.id,'freePoint',[],{x:o.position[0],y:o.position[1]}));continue;}
    if(o.type==='circle'){const id=`${o.id}:center`;graph.push(base(id,'freePoint',[],{x:o.position[0],y:o.position[1]}),base(o.id,'circleCR',[id],{r:o.command.radius*(o.command.scale??1)}));continue;}
    const vs=vertices(o);vs.forEach((p,i)=>graph.push(base(`${o.id}:v${i}`,'freePoint',[],{x:p[0],y:p[1]})));
    if(o.type==='line')graph.push(base(o.id,'line',vs.slice(0,2).map((_,i)=>`${o.id}:v${i}`)));
    else if(vs.length>=3)graph.push(base(o.id,'polygon',vs.map((_,i)=>`${o.id}:v${i}`)));
  }
  const world=evaluate(graph),effects:VisualCommand[]=[];
  for(const o of scene.objects){if(!o.command.roboDependency)continue;const definition=o.command.roboDependency,evaluated=world[o.id],invalidContact=definition.kind==='tangent'&&definition.parents.length>1&&!relationship([scene.objects.find(p=>p.id===definition.parents[1].objectId)!,scene.objects.find(p=>p.id===definition.parents[0].objectId)!],'POINT_ON_CIRCLE');if(!evaluated||evaluated.undefinedReason||invalidContact){if(o.command.roboVisible!==false){const hidden={...o.command,action:'update' as const,roboVisible:false};effects.push(hidden);o.command=hidden;}continue;}
    const command=structuredClone(o.command);command.action='update';command.roboVisible=true;command.rotation=[0,0,0];command.scale=1;command.roboExplicitVertices=true;
    if(o.type==='point'&&evaluated.point)command.points=[[evaluated.point.x,evaluated.point.y]];
    else if(['triangle','polygon'].includes(o.type)&&evaluated.polygon)command.points=evaluated.polygon.map(p=>[p.x,p.y]);
    else if(o.type==='line'&&evaluated.line){const {origin,dir}=evaluated.line;command.points=o.command.roboDependency.kind==='tangent'?[[origin.x-dir.x,origin.y-dir.y],[origin.x+dir.x,origin.y+dir.y]]:[[origin.x,origin.y],[origin.x+dir.x,origin.y+dir.y]];}
    else throw new Error('The construction engine returned an incompatible geometry type.');
    if(o.command.roboVisible===false||JSON.stringify(command.points)!==JSON.stringify(vertices(o))){effects.push(command);Object.assign(o,describeObject(command,scene.activeMode),{creationOrder:o.creationOrder,originalId:o.originalId,derivedFrom:o.command.roboDependency.parents.map(p=>p.objectId)});}
  }
  return effects;
}
