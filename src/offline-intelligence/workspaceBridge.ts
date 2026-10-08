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
  useEffect(()=>{if(enabled)for(const listener of sceneListeners)listener(mode);});
  useEffect(() => {
    if (!enabled) return;
    const listener: Handler = command => ref.current(command);
    handlers.set(mode, listener);
    const read:Reader=command=>readRef.current?.(command);
    readers.set(mode,read);
    const scene:SceneReader=()=>sceneRef.current?.()??{commands:[]};scenes.set(mode,scene);
    return () => { if (handlers.get(mode) === listener) {handlers.delete(mode);readers.delete(mode);scenes.delete(mode);} };
  }, [mode, enabled]);
}
export function readRoboScene(mode:IntelligenceMode) {
  const native=scenes.get(mode)?.()??{commands:[]};
  const commands=[...(known.get(mode)?.values()??[])].filter(command=>!command.roboTemporary).flatMap(command=>{const live=readers.get(mode)?.(command);return live?[live]:[];});
  const ids=new Set(commands.map(o=>o.command.objectId));
  return {objects:[...commands,...native.commands.filter(command=>!ids.has(command.objectId)).map(command=>({command}))],selectedIds:native.selectedIds};
}
export function readRoboObject(mode:IntelligenceMode,command:VisualCommand) {
  return readers.get(mode)?.(command);
}
export async function waitForRoboWorkspace(mode:IntelligenceMode){const started=Date.now();while(!handlers.has(mode)&&Date.now()-started<15000)await new Promise(resolve=>setTimeout(resolve,100));return handlers.has(mode);}
export async function applyVisualCommand(mode: IntelligenceMode, command: VisualCommand) {
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
    if(command.roboControl==='delete')objects.delete(command.objectId!);
    else if(command.roboControl!=='select'&&command.roboControl!=='deselect')objects.set(command.objectId!,{...command,roboControl:undefined});
    known.set(mode,objects);
    if(command.roboControl!=='delete')animateRoboCommand(mode,command);
  }
  if(error!)roboEvents.emit({type:'error'});
  return error!;
}
