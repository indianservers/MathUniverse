import {outlineVertices} from '../../offline-intelligence/commands';
import type {VisualCommand} from '../../offline-intelligence/commands';
export const cinematicEase=(t:number)=>t*t*(3-2*t);
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
/** Only preview values are interpolated. The endpoint is always a fresh exact target. */
export function interpolateCommand(from:VisualCommand|undefined,to:VisualCommand,t:number,hint?:{angle?:number;pivot?:number[]}):VisualCommand {
  if(t>=1)return structuredClone(to);
  if(from&&from.kind!==to.kind&&to.dimension==='2d'&&!['point','line','ray','vector','plot'].includes(from.kind)&&!['point','line','ray','vector','plot'].includes(to.kind)){
    const sample=(vertices:number[][])=>{const lengths=vertices.map((p,i)=>Math.hypot(...p.map((v,j)=>v-(vertices[(i+1)%vertices.length][j]??0)))),total=lengths.reduce((a,b)=>a+b,0);return Array.from({length:128},(_,i)=>{let distance=total*i/128,index=0;while(index<lengths.length-1&&distance>lengths[index])distance-=lengths[index++];const a=vertices[index],b=vertices[(index+1)%vertices.length],ratio=lengths[index]?distance/lengths[index]:0;return a.map((v,j)=>mix(v,b[j]??0,ratio));});};
    const a=sample(outlineVertices(from)),b=sample(outlineVertices(to));return {...structuredClone(to),kind:'polygon',roboExplicitVertices:true,points:b.map((p,i)=>p.map((v,j)=>mix(a[i][j]??0,v,t))),rotation:[0,0,0],scale:1};
  }
  if(from&&to.dimension==='2d'&&(from.roboExplicitVertices||to.roboExplicitVertices)&&!['circle','ellipse','semicircle','line','ray','vector','plot','point'].includes(to.kind)){
    from={...from,points:outlineVertices(from),rotation:[0,0,0],scale:1,roboExplicitVertices:true};
    to={...to,points:outlineVertices(to),rotation:[0,0,0],scale:1,roboExplicitVertices:true};
  }
  const a=from??{...to,width:to.width*.001,height:to.height*.001,radius:to.radius*.001,scale:(to.scale??1)*.001};
  const c=structuredClone(to);
  // Transform explicit vertices around the mathematical pivot, preserving edge lengths.
  if(from&&to.dimension==='2d'&&to.roboExplicitVertices&&to.points.length>1){
    const old=outlineVertices(from),next=outlineVertices(to);
    if(old.length===next.length){
      const angle=hint?.angle!==undefined?hint.angle*Math.PI/180:Math.atan2(next[1][1]-next[0][1],next[1][0]-next[0][0])-Math.atan2(old[1][1]-old[0][1],old[1][0]-old[0][0]);
      const co=Math.cos(angle),si=Math.sin(angle),dx=next[0][0]-co*old[0][0]+si*old[0][1],dy=next[0][1]-si*old[0][0]-co*old[0][1];
      const oriented=old.every((p,i)=>Math.hypot(co*p[0]-si*p[1]+dx-next[i][0],si*p[0]+co*p[1]+dy-next[i][1])<1e-7);
      if(oriented&&Math.abs(si)+Math.abs(1-co)>1e-8){
        const det=(1-co)**2+si**2,pivot=hint?.pivot??[((1-co)*dx-si*dy)/det,(si*dx+(1-co)*dy)/det];
        c.points=old.map((p,i)=>[pivot[0]+(p[0]-pivot[0])*Math.cos(angle*t)-(p[1]-pivot[1])*Math.sin(angle*t),pivot[1]+(p[0]-pivot[0])*Math.sin(angle*t)+(p[1]-pivot[1])*Math.cos(angle*t),mix(p[2]??0,next[i][2]??0,t)]);return c;
      }
      if(hint?.angle!==undefined&&oriented){const pivot=hint.pivot??[0,1].map(i=>old.reduce((sum,p)=>sum+p[i],0)/old.length);c.points=old.map(p=>[pivot[0]+(p[0]-pivot[0])*Math.cos(angle*t)-(p[1]-pivot[1])*Math.sin(angle*t),pivot[1]+(p[0]-pivot[0])*Math.sin(angle*t)+(p[1]-pivot[1])*Math.cos(angle*t)]);return c;}
    }
  }
  for(const k of ['width','height','radius','depth','scale'] as const){const av=a[k]??(k==='scale'?1:to[k]??0),bv=to[k]??(k==='scale'?1:av);c[k]=mix(av,bv,t);}
  c.points=to.points.map((p,i)=>p.map((v,j)=>mix(a.points[i]?.[j]??0,v,t)));
  if(!from&&['line','ray','vector'].includes(to.kind))c.points=to.points.map(p=>p.map((v,j)=>mix(to.points[0]?.[j]??0,v,t)));
  if(!from&&(to.roboExplicitVertices||['triangle','polygon'].includes(to.kind))){const center=[0,1,2].map(j=>to.points.reduce((sum,p)=>sum+(p[j]??0),0)/to.points.length);c.points=to.points.map(p=>p.map((v,j)=>mix(center[j],v,t)));}
  c.rotation=[0,1,2].map(i=>mix(a.rotation?.[i]??0,to.rotation?.[i]??0,t)) as [number,number,number];
  if(a.expression&&to.expression&&a.expression!==to.expression)c.expression=`(${1-t})*(${a.expression})+(${t})*(${to.expression})`;
  return c;
}
export type MotionStatus='idle'|'playing'|'paused';
export class RuhiCinematicMotionEngine {
  enabled=true; speed=1; reducedMotion=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  glow=true; trails=false; private replayJob?:()=>Promise<void>;
  setReplay(job:()=>Promise<void>){this.replayJob=job;this.publish(this.state.status);}
  get canReplay(){return !!this.replayJob;}
  replay(){return this.replayJob?.();}
  configure(patch:Partial<Pick<RuhiCinematicMotionEngine,'enabled'|'speed'|'reducedMotion'|'glow'|'trails'>>){Object.assign(this,patch);try{localStorage.setItem('ruhi-cinematic-settings',JSON.stringify({enabled:this.enabled,speed:this.speed,reducedMotion:this.reducedMotion,glow:this.glow,trails:this.trails}));}catch{/* Optional persistence. */}this.publish(this.state.status);}
  constructor(){try{const saved=JSON.parse(localStorage.getItem('ruhi-cinematic-settings')??'null');if(saved){for(const key of ['enabled','reducedMotion','glow','trails'] as const)if(typeof saved[key]==='boolean')this[key]=saved[key];if([.5,1,1.5,2].includes(saved.speed))this.speed=saved.speed;}}catch{/* Optional persistence. */}}
  private generation=0; private tail:Promise<unknown>=Promise.resolve(); private listeners=new Set<()=>void>();
  private active?:{finish:()=>void;cancel:()=>void};
  private state={status:'idle' as MotionStatus,progress:0};
  subscribe=(fn:()=>void)=>{this.listeners.add(fn);return()=>{this.listeners.delete(fn);};};
  snapshot=()=>this.state;
  private publish(status:MotionStatus,progress=this.state.progress){this.state={status,progress};for(const fn of this.listeners)fn();}
  pause(){if(this.state.status==='playing')this.publish('paused');}
  resume(){if(this.state.status==='paused')this.publish('playing');}
  play(){this.resume();}
  skip(){this.active?.finish();}
  instantComplete(){this.skip();}
  cancel(){this.generation++;this.active?.cancel();}
  enqueue(frame:(progress:number)=>void,duration=750):Promise<void>{
    const generation=this.generation;const work=this.tail.catch(()=>undefined).then(()=>{if(generation!==this.generation)throw new Error('Motion cancelled');return this.animateFrames(frame,duration);});this.tail=work;return work;
  }
  private animateFrames(frame:(progress:number)=>void,duration:number):Promise<void>{
    if(!this.enabled){frame(1);return Promise.resolve();}
    return new Promise((resolve,reject)=>{
      let raf=0,last:number|undefined,elapsed=0,done=false;
      const finish=()=>{if(done)return;done=true;cancelAnimationFrame(raf);try{frame(1);resolve();}catch(error){reject(error);}finally{this.active=undefined;this.publish('idle',1);}};
      const cancel=(error:unknown=new Error('Motion cancelled'))=>{if(done)return;done=true;cancelAnimationFrame(raf);this.active=undefined;this.publish('idle',0);reject(error);};
      this.active={finish,cancel};this.publish('playing',0);
      const tick=(now:number)=>{if(done)return;const delta=last===undefined?0:now-last;last=now;
        if(this.state.status!=='paused'){elapsed+=Math.min(delta,50)*this.speed;const t=Math.min(1,elapsed/(this.reducedMotion?100:duration));
          if(t===1){finish();return;}try{frame(cinematicEase(t));}catch(error){cancel(error);return;}
          this.publish('playing',t);}
        if(!done)raf=requestAnimationFrame(tick);
      };raf=requestAnimationFrame(tick);
    });
  }
}
export const ruhiMotion=new RuhiCinematicMotionEngine();
export let cinematicPreview=false;
export function withCinematicPreview<T>(fn:()=>T):T{cinematicPreview=true;try{return fn();}finally{cinematicPreview=false;}}
