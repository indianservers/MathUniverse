import * as THREE from 'three';
import {SOLID_SHAPES} from '../../offline-intelligence/shapeCatalog';
import {center,vertices,measurement} from './geometryQueries';
import {resolveTarget,ResolutionError} from './targetResolver';
import {planeFromPoints3} from '../kernel/geometry3d';
import {add,sub,mul,dot,norm,unit,cross3,dist,EPS} from './geometryAnalyticMath';
import type {VisualCommand} from '../../offline-intelligence/commands';
import type {MathRoboCommand,MathRoboPlan,RoboObjectDescriptor,RoboSceneContext} from './types';
import type {GeometrySlots} from './geometryQuestionGrammar';
export class Kid3dBoard{
 effects:VisualCommand[]=[];targets=new Set<string>();
 constructor(public command:MathRoboCommand,public scene:RoboSceneContext,public lesson:GeometrySlots){}
 get n(){return this.lesson.numbers;}
 objects=(type?:string)=>this.scene.objects.filter(o=>(!type||type==='solid'?(type!=='solid'||(SOLID_SHAPES as readonly string[]).includes(o.type)):o.type===type)&&o.command.roboVisible!==false&&o.command.roboDefinitionState?.status!=='undefined');
 track=(o:RoboObjectDescriptor)=>{this.targets.add(o.id);return o;};
 one=(type?:string)=>{
  const list=this.objects(type),chosen=list.filter(o=>this.scene.selectedIds.includes(o.id));
  const explicit=typeof this.command.target==='string'?list.find(o=>o.id===this.command.target):undefined;if(explicit)return this.track(explicit);
  if(chosen.length===1)return this.track(chosen[0]);if(list.length===1)return this.track(list[0]);
  throw new ResolutionError(list.map(o=>o.id),`Choose one ${type??'object'} so I use the right one.`);
 };
 pair=(type:string,count=2)=>{
  const list=this.objects(type),specified=this.command.parameters.kidChosenTargets as string[]|undefined,chosen=list.filter(o=>(specified??this.scene.selectedIds).includes(o.id));
  const result=chosen.length===count?chosen:list.length===count?list:undefined;
  if(!result)throw new ResolutionError(list.map(o=>o.id),`Choose ${count} ${type} objects for this question.`);
  result.forEach(this.track);return result;
 };
 point=(key:string)=>{const label=this.lesson.names[key]??key,o=resolveTarget({type:'point',name:label},this.scene);if(o.position.length!==3||o.position.some(x=>!Number.isFinite(x)))throw new Error('I need three finite coordinates for this point.');return this.track(o).position;};
 objectPoint=(key:string)=>resolveTarget({type:'point',name:this.lesson.names[key]??key},this.scene);
 v=(keys:string)=>sub(this.point(keys[1]),this.point(keys[0]));
 vector=()=>{const o=this.one('vector'),p=vertices(o);return sub(p[1],p[0]);};
 vectors=()=>this.pair('vector').map(o=>{const [a,b]=vertices(o);return sub(b,a);});
 line=(o=this.one('line'))=>{const [a,b]=vertices(o);unit(sub(b,a));return {kind:'line' as const,point:a,direction:sub(b,a)};};
 plane=(o=this.one('plane'))=>planeFromPoints3(vertices(o).slice(0,3));
 sphere=(o=this.one('sphere'))=>({object:o,center:center(o),radius:o.command.radius*(o.command.scale??1)});
 dimensions=(o:RoboObjectDescriptor)=>{const c=o.command,s=c.scale??1;return [c.width*s,(o.type==='cube'?c.width:c.height)*s,(o.type==='cube'?c.width:c.depth??c.width)*s];};
 local=(p:number[],o:RoboObjectDescriptor)=>{const c=o.command,r=c.rotation??[0,0,0],q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...r.map(x=>x*Math.PI/180) as [number,number,number])).invert();return new THREE.Vector3(...sub(p,center(o)) as [number,number,number]).applyQuaternion(q).toArray();};
 boxVertices=(o:RoboObjectDescriptor)=>{const [w,h,d]=this.dimensions(o),r=o.command.rotation??[0,0,0],q=new THREE.Quaternion().setFromEuler(new THREE.Euler(...r.map(x=>x*Math.PI/180) as [number,number,number]));return Array.from({length:8},(_,i)=>add(center(o),new THREE.Vector3((i&1?1:-1)*w/2,(i&2?1:-1)*h/2,(i&4?1:-1)*d/2).applyQuaternion(q).toArray()));};
 inside=(p:number[],o:RoboObjectDescriptor)=>{if(o.type==='sphere')return dist(p,center(o))<=o.command.radius*(o.command.scale??1)+EPS;if(['cube','cuboid'].includes(o.type))return this.local(p,o).every((x,i)=>Math.abs(x)<=this.dimensions(o)[i]/2+EPS);throw new Error('UNSUPPORTED: I can check containment in spheres and boxes here.');};
 measure=(o:RoboObjectDescriptor,kind='VOLUME')=>{const c=o.command,s=c.scale??1,r=c.radius*s,h=c.height*s;if(o.type==='prism'){const base=3*Math.sqrt(3)*r*r/4;return kind==='VOLUME'?base*h:2*base+3*Math.sqrt(3)*r*h;}if(o.type==='pyramid'){const base=2*r*r;return kind==='VOLUME'?base*h/3:base+2*Math.sqrt(2)*r*Math.hypot(h,r/Math.sqrt(2));}if(o.type==='tetrahedron'&&c.points.length===4){const [a,b,d,e]=vertices(o);return kind==='VOLUME'?Math.abs(dot(sub(b,a),cross3(sub(d,a),sub(e,a))))/6:[[a,b,d],[a,b,e],[a,d,e],[b,d,e]].reduce((sum,[a,b,c])=>sum+norm(cross3(sub(b,a),sub(c,a)))/2,0);}if(o.type==='tetrahedron'){return kind==='VOLUME'?8*Math.sqrt(3)*r**3/27:8*Math.sqrt(3)*r*r/3;}if(o.type==='octahedron')return kind==='VOLUME'?4*r**3/3:4*Math.sqrt(3)*r*r;if(o.type==='torus'){const t=r/4;return kind==='VOLUME'?2*Math.PI**2*r*t*t:4*Math.PI**2*r*t;}if(o.type==='tube'){const inner=.7*r;return kind==='VOLUME'?Math.PI*(r*r-inner*inner)*h:2*Math.PI*(r+inner)*h+2*Math.PI*(r*r-inner*inner);}if(o.type==='hemisphere')return kind==='VOLUME'?2*Math.PI*r**3/3:3*Math.PI*r*r;if(o.type==='capsule')return kind==='VOLUME'?Math.PI*r*r*h+4*Math.PI*r**3/3:2*Math.PI*r*h+4*Math.PI*r*r;if(o.type==='frustum'){const top=r/2;return kind==='VOLUME'?Math.PI*h*(r*r+r*top+top*top)/3:Math.PI*(r+top)*Math.hypot(h,r-top)+Math.PI*(r*r+top*top);}if(o.type==='ellipsoid'&&kind==='VOLUME'){const [w,h,d]=this.dimensions(o);return Math.PI*w*h*d/6;}return Number(measurement(o,kind));};
 make=(kind:VisualCommand['kind'],points:number[][],extra:Partial<VisualCommand>={})=>{if(points.some(p=>p.length!==3||p.some(v=>!Number.isFinite(v))))throw new Error('Every point needs three finite coordinates.');const c:VisualCommand={kind,points,dimension:'3d',width:4,height:4,depth:4,radius:2,color:'#22d3ee',rotation:[0,0,0],scale:1,action:'create',objectId:crypto.randomUUID(),roboExplicitVertices:true,...extra};if([c.width,c.height,c.depth??1,c.radius].some(v=>!Number.isFinite(v)||v<=0||v>10000))throw new Error('Dimensions must be positive and no greater than 10,000 units.');if(c.roboLabel&&this.scene.objects.some(o=>o.label?.toLowerCase()===c.roboLabel?.toLowerCase()))throw new Error(`An object named ${c.roboLabel} already exists. Choose another name.`);this.effects.push(c);return c;};
 update=(o:RoboObjectDescriptor,patch:Partial<VisualCommand>)=>{if(o.command.roboLocked)throw new Error('Unlock this object before changing it.');const c={...o.command,...patch,action:'update' as const,roboAppearanceOnly:patch.roboAppearanceOnly??false};
 const d=o.command.roboDependency,parents=d?.parents.map(ref=>ref.vertex===undefined?this.scene.objects.find(p=>p.id===ref.objectId&&p.type==='point'):undefined);
 if(patch.points&&d&&['line','triangle','tetrahedron'].includes(d.kind)&&parents?.length===patch.points.length&&parents.every(p=>!!p)){
  parents.forEach((p,i)=>{if(dist(p!.position,patch.points![i])>EPS)this.update(p!,{points:[patch.points![i]],rotation:[0,0,0],scale:1});});this.track(o);return c;
 }
 this.effects.push(c);this.track(o);return c;};
 plan=(action:string,subAction:string,objects:RoboObjectDescriptor[],parameters:MathRoboCommand['parameters']={}):MathRoboPlan=>({rawPhrase:this.command.rawPhrase,confidence:1,commands:objects.map(o=>({id:crypto.randomUUID(),rawPhrase:this.command.rawPhrase,normalizedPhrase:this.command.normalizedPhrase,detectedAction:action,action,subAction,mode:this.scene.activeMode,target:o.id,parameters,confidence:{overall:1,action:1,subAction:1},source:{action:'rule',subAction:'rule'},requiresExecution:true}))});
 list=(objects:RoboObjectDescriptor[])=>{objects.forEach(this.track);return objects.map(o=>o.label??o.id).join(', ')||'None';};
 circle=(origin:number[],normal:number[],radius:number)=>{if(radius<=EPS)return this.make('point',[origin]);const n=unit(normal),u=unit(cross3(n,Math.abs(n[0])<.8?[1,0,0]:[0,1,0])),v=cross3(n,u);return this.make('polygon',Array.from({length:64},(_,i)=>add(origin,add(mul(u,radius*Math.cos(2*Math.PI*i/64)),mul(v,radius*Math.sin(2*Math.PI*i/64))))),{roboLabel:undefined});};
}
