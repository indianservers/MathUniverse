import { outlineVertices } from '../../offline-intelligence/commands';
import type { VisualCommand } from '../../offline-intelligence/commands';
import type { RoboMode, RoboObjectDescriptor, RoboSceneContext } from './types';
export function emptyScene(mode:RoboMode):RoboSceneContext { return {snapshotId:crypto.randomUUID(),objects:[],selectedIds:[],activeMode:mode}; }
export function describeObject(command:VisualCommand,mode:RoboMode,vertices?:number[][]):RoboObjectDescriptor {
  const dimension=mode.endsWith('3d')?3:2;
  return {id:command.objectId!,type:command.kind,mode,position:(command.points[0]??Array(dimension).fill(0)).slice(0,dimension),radius:command.radius,label:command.roboLabel,style:{color:command.color,visible:command.roboVisible??true},command:structuredClone(command),vertices:(vertices??outlineVertices(command)).map(p=>p.slice(0,dimension))};
}
export function readonlySnapshot(scene:RoboSceneContext):Readonly<RoboSceneContext> { return structuredClone(scene); }
