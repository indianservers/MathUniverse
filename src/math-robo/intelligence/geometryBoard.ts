import {resolveTarget,ResolutionError} from './targetResolver';
import {vertices,rounded} from './geometryQueries';
import {dist,EPS,validatePolygon} from './geometryAnalyticMath';
import type {GeometrySlots} from './geometryQuestionGrammar';
import type {RoboObjectDescriptor,RoboSceneContext} from './types';
import type {VisualCommand} from '../../offline-intelligence/commands';
import type {AnalyticConstraint} from './analyticConstraints';
export class GeometryBoard{
  targets=new Set<string>();effects:VisualCommand[]=[];
  constructor(public lesson:GeometrySlots,public scene:RoboSceneContext){}
  name=(key:string)=>this.lesson.names[key]??key.toLowerCase();
  usable=(o:RoboObjectDescriptor)=>o.command.roboVisible!==false&&(!o.command.roboDefinitionState||o.command.roboDefinitionState.status==='defined');
  objects=(type:string)=>this.scene.objects.filter(o=>o.type===type&&this.usable(o));
  obj=(key:string,type?:string)=>{const name=this.name(key),list=this.scene.objects.filter(o=>(o.label?.toLowerCase()===name.toLowerCase()||o.id.toLowerCase()===name.toLowerCase())&&(!type||o.type===type)&&this.usable(o));
    if(list.length>1)throw new ResolutionError(list.map(o=>o.id),`Several ${type??'objects'} are named ${name}. Select or rename one.`);
    const o=list[0]??resolveTarget(type?{name,type}:name,this.scene);if(!this.usable(o))throw new Error(`${name} is hidden or undefined.`);if(type&&o.type!==type)throw new Error(`${name} must be a ${type}.`);this.targets.add(o.id);return o;
  };
  point=(key:string)=>{const o=this.obj(key,'point'),d=this.scene.activeMode.endsWith('3d')?3:2;if(o.position.length!==d||o.position.some(v=>!Number.isFinite(v)))throw new Error(`Finite ${d}D coordinates are required.`);return o.position;};
  poly=(keys:string)=>validatePolygon(keys.split('').map(this.point));
  pts=(keys:string)=>keys.split('').map(this.point);
  circle=(key='c')=>{const o=this.obj(key,'circle'),r=o.command.radius*(o.command.scale??1);if(!(r>0))throw new Error('A positive circle radius is required.');return {object:o,center:o.position,radius:r};};
  selected=(type:string,count:number)=>{const list=this.objects(type).filter(o=>this.scene.selectedIds.includes(o.id));if(list.length!==count)throw new ResolutionError(this.objects(type).map(o=>o.id),`Select exactly ${count} ${type} objects first.`);list.forEach(o=>this.targets.add(o.id));return list;};
  list=(objects:RoboObjectDescriptor[])=>{objects.forEach(o=>this.targets.add(o.id));return objects.map(o=>`${o.label??o.id} (${o.position.map(rounded).join(', ')})`).join('; ')||'None';};
  extreme=(objects:RoboObjectDescriptor[],score:(o:RoboObjectDescriptor)=>number,min=true)=>{if(!objects.length)throw new Error('No matching visible points or objects exist.');const values=objects.map(score),best=(min?Math.min:Math.max)(...values);return this.list(objects.filter((_,i)=>Math.abs(values[i]-best)<=EPS*Math.max(1,Math.abs(best))));};
  make=(kind:VisualCommand['kind'],points:number[][],extra:Partial<VisualCommand>={})=>{const command:VisualCommand={kind,points,dimension:this.scene.activeMode.endsWith('3d')?'3d':'2d',width:4,height:4,radius:1,color:'#22d3ee',rotation:[0,0,0],scale:1,action:'create',objectId:crypto.randomUUID(),roboExplicitVertices:true,...extra};this.effects.push(command);return command;};
  update=(key:string,position:number[],rule?:AnalyticConstraint,type='point')=>{const o=this.obj(key,type);if(!this.scene.objects.some(p=>p.id===o.id))throw new Error('UNSUPPORTED: Create a separate point before applying this constraint to a virtual vertex.');if(o.command.roboLocked)throw new Error('Unlock the object before changing it.');this.effects.push({...o.command,points:[position],action:'update',roboExplicitVertices:true,...(rule?{roboAnalyticConstraint:rule}:{})});return position;};
  refs=(keys:string)=>keys.split('').map(k=>{const o=this.obj(k,'point');return this.scene.objects.some(p=>p.id===o.id)?o.id:this.name(k);});
  lines=()=>this.objects('line').filter(o=>vertices(o).length===2&&dist(vertices(o)[0],vertices(o)[1])>EPS);
}
