import {hasMotionPreview,publishMotionPreview} from '../math-robo/animation/motionPreview';
import {describeObject,emptyScene} from '../math-robo/intelligence/sceneContext';
import {recomputeRoboDependencies} from '../math-robo/intelligence/workspaceDependencies';
import {ruhiMotion,interpolateCommand,withCinematicPreview,cinematicPreview} from '../math-robo/animation/RuhiCinematicMotionEngine';
import {animateRoboCommand} from '../math-robo/character/workspaceAdapter';
import {roboEvents} from '../math-robo/character/engine';
import { useEffect, useRef } from 'react';
import {flushSync} from 'react-dom';
import type { IntelligenceMode, VisualCommand } from './commands';
type Handler = (command: VisualCommand) => string | void;
type Reader = (command:VisualCommand) => {command:VisualCommand;vertices?:number[][]}|undefined;
const handlers = new Map<IntelligenceMode, Handler>();
const readers = new Map<IntelligenceMode,Reader>();
const known = new Map<IntelligenceMode,Map<string,VisualCommand>>();
type SceneReader=()=>{commands:VisualCommand[];selectedIds?:string[]};
const scenes=new Map<IntelligenceMode,SceneReader>();
const sceneListeners=new Set<(mode:IntelligenceMode)=>void>();
export function subscribeRoboScene(listener:(mode:IntelligenceMode)=>void){sceneListeners.add(listener);return()=>{sceneListeners.delete(listener);};}
export function isKnownRoboObject(mode:IntelligenceMode,id:string){return [...(known.get(mode)?.keys()??[])].some(base=>id===base||id.startsWith(`${base}-`));}
export function useIntelligenceWorkspace(mode: IntelligenceMode, handler: Handler, enabled = true, reader?:Reader, sceneReader?:SceneReader) {
  const ref = useRef(handler);
  const readRef=useRef(reader);readRef.current=reader;
  ref.current = handler;
  const sceneRef=useRef(sceneReader);sceneRef.current=sceneReader;
  useEffect(()=>{if(enabled&&!cinematicPreview)for(const listener of sceneListeners)listener(mode);});
  useEffect(() => {
    if (!enabled) return;
    const listener: Handler = command => ref.current(command);
    handlers.set(mode, listener);
    const read:Reader=command=>readRef.current?.(command);
    readers.set(mode,read);
    const scene:SceneReader=()=>sceneRef.current?.()??{commands:[]};scenes.set(mode,scene);
    return () => { if (handlers.get(mode) === listener) {ruhiMotion.cancel();handlers.delete(mode);readers.delete(mode);scenes.delete(mode);} };
  }, [mode, enabled]);
}
export function readRoboScene(mode:IntelligenceMode) {
  const native=scenes.get(mode)?.()??{commands:[]};
  const commands=[...(known.get(mode)?.values()??[])].filter(command=>!command.roboTemporary).flatMap(command=>{const live=readers.get(mode)?.(command);return live?[live]:[];});
  const ids=new Set(commands.map(o=>o.command.objectId));
  const nativeById=new Map(native.commands.map(command=>[command.objectId,command]));
  return {objects:[...commands,...[...nativeById.values()].filter(command=>!command.roboTemporary&&!ids.has(command.objectId)).map(command=>({command}))],selectedIds:native.selectedIds};
}
export function readRoboObject(mode:IntelligenceMode,command:VisualCommand) {
  return readers.get(mode)?.(command);
}
export async function waitForRoboWorkspace(mode:IntelligenceMode){const started=Date.now();while(!handlers.has(mode)&&Date.now()-started<15000)await new Promise(resolve=>setTimeout(resolve,100));return handlers.has(mode);}
async function commitVisualCommand(mode: IntelligenceMode, command: VisualCommand) {
  // The assistant can mount before a lazy-loaded canvas registers its handler.
  const started=Date.now();
  while(!handlers.has(mode)&&Date.now()-started<15000)await new Promise(resolve=>setTimeout(resolve,100));
  const handler = handlers.get(mode);
  if (!handler) return 'This workspace is still loading. Try again when the canvas is ready.';
  let error:string|void;
  // Follow-up references must see the committed scene before Robo announces completion.
  flushSync(()=>{error=handler(command);});
  if(!error!) {
    const objects=known.get(mode)??new Map<string,VisualCommand>();
    if(command.roboClearAll)objects.clear();
    else if(command.roboControl==='delete')objects.delete(command.objectId!);
    else if(command.roboControl!=='select'&&command.roboControl!=='deselect')objects.set(command.objectId!,{...command,roboControl:undefined});
    known.set(mode,objects);
    if(command.roboControl!=='delete')animateRoboCommand(mode,command);
  }
  if(error!)roboEvents.emit({type:'error'});
  return error!;
}

export async function applyVisualCommand(mode:IntelligenceMode,command:VisualCommand,hint?:{angle?:number;pivot?:number[]}){
  if(command.roboControl||typeof requestAnimationFrame==='undefined')return commitVisualCommand(mode,command);
  await waitForRoboWorkspace(mode);
  const handler=handlers.get(mode);if(!handler)return commitVisualCommand(mode,command);
  const live=readRoboObject(mode,known.get(mode)?.get(command.objectId!)??command);
  const previous=live?.vertices&&mode==='geometry2d'&&!['circle','point','line','ray','vector','plot'].includes(command.kind)?{...live.command,points:live.vertices.map(p=>p.slice(0,2)),rotation:[0,0,0] as [number,number,number],scale:1,roboExplicitVertices:true}:live?.command;
  const start=emptyScene(mode);start.objects=readRoboScene(mode).objects.map(o=>describeObject(o.command,mode,'vertices' in o?o.vertices as number[][]|undefined:undefined));
  if(previous&&JSON.stringify(previous)===JSON.stringify(command))return commitVisualCommand(mode,command);
  if(hasMotionPreview(mode)){
    const render=(t:number)=>{
        const preview=interpolateCommand(previous,command,t,hint),scene=structuredClone(start),object=describeObject(preview,mode);
        const index=scene.objects.findIndex(o=>o.id===command.objectId);if(index<0)scene.objects.push(object);else scene.objects[index]=object;
        publishMotionPreview(mode,{commands:[preview,...recomputeRoboDependencies(scene)],progress:t,creating:previous?[]:[command.objectId!],sources:previous?{[command.objectId!]:previous}:undefined});
      };
    try{
      await ruhiMotion.enqueue(render);
      const error=await commitVisualCommand(mode,command);
      if(!error){
        const targetScene=structuredClone(start),target=describeObject(command,mode),i=targetScene.objects.findIndex(o=>o.id===command.objectId);if(i<0)targetScene.objects.push(target);else targetScene.objects[i]=target;
        for(const dependent of recomputeRoboDependencies(targetScene))await commitVisualCommand(mode,dependent);
        ruhiMotion.setReplay(async()=>{if(!hasMotionPreview(mode))return;try{await ruhiMotion.enqueue(render);}finally{publishMotionPreview(mode);}});
      }
      return error;
    }finally{publishMotionPreview(mode);}
  }

  try{
    await ruhiMotion.enqueue(t=>withCinematicPreview(()=>flushSync(()=>{
      const preview=interpolateCommand(previous,command,t,hint);
      const error=handler({...preview,action:'create'});if(error)throw new Error(error);
      const scene=structuredClone(start);const object=describeObject(preview,mode);
      const index=scene.objects.findIndex(o=>o.id===command.objectId);if(index<0)scene.objects.push(object);else scene.objects[index]=object;
      for(const dependent of recomputeRoboDependencies(scene)){const failure=handler(dependent);if(failure)throw new Error(failure);}
    })));
  }catch(error){withCinematicPreview(()=>flushSync(()=>handler(previous?{...previous,action:'create'}:{...command,roboControl:'delete'})));throw error;}
  withCinematicPreview(()=>flushSync(()=>{for(const original of start.objects.filter(o=>o.command.roboDependency))handler({...original.command,action:'create'});}));
  // Restore the exact start before recording the final change; both run in one paint.
  withCinematicPreview(()=>flushSync(()=>handler(previous?{...previous,action:'create'}:{...command,roboControl:'delete'})));
  return commitVisualCommand(mode,command);
}
