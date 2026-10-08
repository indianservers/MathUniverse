import {planeFromPoints3,linePlane3} from '../kernel/geometry3d';
import {evaluate,type GeomObject} from '../../studios/geometry/construction/constructionEngine';
import {add3,scale3,point3} from '../../workspace/geometry3dKernel';
import {describeObject} from './sceneContext';
import {vertices,relationship} from './geometryQueries';
import type {RoboObjectDescriptor,RoboSceneContext} from './types';
import type {VisualCommand} from '../../offline-intelligence/commands';
export type DependencyRef={objectId:string;vertex?:number;edge?:[number,number]};
export type RoboDependency={kind:'midpoint'|'triangle'|'polygon'|'line'|'perp'|'parallel'|'intersection'|'tangent'|'circumcircle'|'incircle'|'plane3'|'perpPlane3'|'intersection3';parents:DependencyRef[];index?:number;angle?:number};
export function vertexReference(object:RoboObjectDescriptor,index:number):DependencyRef{return {objectId:object.id,vertex:index};}
export function recomputeRoboDependencies(scene:RoboSceneContext):VisualCommand[]{
  if(!scene.objects.some(o=>o.command.roboDependency))return [];
  if(scene.activeMode.endsWith('3d')){
    const effects:VisualCommand[]=[],visited=new Set<string>(),visiting=new Set<string>();
    const refresh=(object:RoboObjectDescriptor)=>{
      if(visited.has(object.id))return;if(visiting.has(object.id))throw new Error('The construction contains a dependency cycle.');visiting.add(object.id);
      const definition=object.command.roboDependency;
      if(definition){
        const parents=definition.parents.map(ref=>{const parent=scene.objects.find(o=>o.id===ref.objectId);if(!parent)throw new Error('A construction parent is missing.');refresh(parent);return parent;});
        const positions=parents.map((parent,i)=>definition.parents[i].vertex===undefined?parent.position:vertices(parent)[definition.parents[i].vertex!]);let command:VisualCommand|undefined;
        try{
          if(parents.some(p=>p.command.roboVisible===false))throw new Error('A parent construction is invalid.');
          if(definition.kind==='midpoint'){if(positions.length!==2||positions.some(p=>!p))throw new Error('A midpoint needs two defined parents.');const value=scale3(add3(point3(...positions[0] as [number,number,number]),point3(...positions[1] as [number,number,number])),0.5);command={...object.command,roboVisible:true,points:[[value.x,value.y,value.z]]};}
          else if(definition.kind==='plane3'){const plane=planeFromPoints3(positions);command={...object.command,roboVisible:true,points:positions,roboPlane:plane};}
          else if(definition.kind==='perpPlane3'){const plane=planeFromPoints3(vertices(parents[0]).slice(0,3)),origin=positions[1]??vertices(object)[0];command={...object.command,roboVisible:true,points:[origin,origin.map((x,i)=>x+plane.normal[i])]};}
          else if(definition.kind==='intersection3'){const line=parents.find(p=>['line','ray','vector'].includes(p.type)),host=parents.find(p=>p.type==='plane');if(!line||!host)throw new Error('A dependent 3D intersection needs a line and a plane.');const [a,b]=vertices(line),hit=linePlane3({kind:line.type==='ray'?'ray':line.command.linearExtent==='segment'?'segment':'line',point:a,direction:b.map((x,i)=>x-a[i])},planeFromPoints3(vertices(host).slice(0,3)));if(hit.kind!=='point'||!hit.point)throw new Error('No unique intersection in this configuration.');command={...object.command,roboVisible:true,points:[hit.point]};}
        }catch{command={...object.command,roboVisible:false};}
        if(command){command={...command,action:'update',roboVisible:command.roboVisible??true,scale:1,rotation:[0,0,0],roboExplicitVertices:true};if(command.roboVisible!==false)command.roboVisible=true;if(JSON.stringify(command.points)!==JSON.stringify(object.command.points)||(command.roboVisible??true)!==(object.command.roboVisible??true)){effects.push(command);Object.assign(object,describeObject(command,scene.activeMode));}}
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
    if(d&&(d.kind==='plane3'||d.kind==='perpPlane3'||d.kind==='intersection3'))throw new Error('A spatial dependency requires a 3D workspace.');
    if(d){if(d.kind==='circumcircle'||d.kind==='incircle'){const parent=d.parents[0];graph.push(base(o.id,d.kind==='incircle'?'incircle':'circle3',[0,1,2].map(vertex=>refs({...parent,vertex}))));}else if(d.kind==='tangent'){const circleId=d.parents[0].objectId,at=d.parents[1]?refs(d.parents[1]):`${o.id}:at`,radius=`${o.id}:radius`;if(!d.parents[1])graph.push(base(at,'pointOnObject',[circleId],{t:d.angle??0}));graph.push(base(radius,'line',[`${circleId}:center`,at]),base(o.id,'perp',[at,radius]));}else if(d.kind!=='plane3'&&d.kind!=='perpPlane3'&&d.kind!=='intersection3')graph.push(base(o.id,d.kind,d.parents.map(refs),d.index===undefined?undefined:{index:d.index}));continue;}
    if(o.type==='point'){graph.push(base(o.id,'freePoint',[],{x:o.position[0],y:o.position[1]}));continue;}
    if(o.type==='circle'){const id=`${o.id}:center`;graph.push(base(id,'freePoint',[],{x:o.position[0],y:o.position[1]}),base(o.id,'circleCR',[id],{r:o.command.radius*(o.command.scale??1)}));continue;}
    const vs=vertices(o);vs.forEach((p,i)=>graph.push(base(`${o.id}:v${i}`,'freePoint',[],{x:p[0],y:p[1]})));
    if(o.type==='line')graph.push(base(o.id,'line',vs.slice(0,2).map((_,i)=>`${o.id}:v${i}`)));
    else if(vs.length>=3)graph.push(base(o.id,'polygon',vs.map((_,i)=>`${o.id}:v${i}`)));
  }
  const world=evaluate(graph),effects:VisualCommand[]=[];
  for(const o of scene.objects){if(!o.command.roboDependency)continue;const definition=o.command.roboDependency,evaluated=world[o.id],invalidContact=definition.kind==='tangent'&&definition.parents.length>1&&!relationship([scene.objects.find(p=>p.id===definition.parents[1].objectId)!,scene.objects.find(p=>p.id===definition.parents[0].objectId)!],'POINT_ON_CIRCLE');if(!evaluated||evaluated.undefinedReason||invalidContact){if(o.command.roboVisible!==false){const hidden={...o.command,action:'update' as const,roboVisible:false};effects.push(hidden);o.command=hidden;}continue;}
    const command=structuredClone(o.command);command.action='update';command.roboVisible=true;command.rotation=[0,0,0];command.scale=1;command.roboExplicitVertices=true;
    if(o.type==='circle'&&evaluated.circle){command.points=[[evaluated.circle.center.x,evaluated.circle.center.y]];command.radius=evaluated.circle.r;}
    else if(o.type==='point'&&evaluated.point)command.points=[[evaluated.point.x,evaluated.point.y]];
    else if(['triangle','polygon'].includes(o.type)&&evaluated.polygon)command.points=evaluated.polygon.map(p=>[p.x,p.y]);
    else if(o.type==='line'&&evaluated.line){const {origin,dir}=evaluated.line;command.points=o.command.roboDependency.kind==='tangent'?[[origin.x-dir.x,origin.y-dir.y],[origin.x+dir.x,origin.y+dir.y]]:[[origin.x,origin.y],[origin.x+dir.x,origin.y+dir.y]];}
    else throw new Error('The construction engine returned an incompatible geometry type.');
    if(o.command.roboVisible===false||JSON.stringify(command.points)!==JSON.stringify(vertices(o))||command.radius!==o.command.radius){effects.push(command);Object.assign(o,describeObject(command,scene.activeMode),{creationOrder:o.creationOrder,originalId:o.originalId,derivedFrom:o.command.roboDependency.parents.map(p=>p.objectId)});}
  }
  return effects;
}
