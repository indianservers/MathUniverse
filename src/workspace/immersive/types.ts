import type { HandTransform } from '../../ar-math-lab/arHandGestures';
import type { HandIntelligenceState, ManipulationResult, ObjectAffordance, Vec3 } from '../../ar-math-lab/hand-intelligence/types';
export type ImmersiveAdapter = {
  gestureObjects?: () => import('../../ar-math-lab/hand-intelligence/GestureController').GestureSelectable[];
  kind: '2d' | '3d';
  boardExtent?: () => [number,number];
  element: () => HTMLElement | SVGSVGElement | null;
  targets: () => ObjectAffordance[];
  transform: (id: string) => HandTransform;
  select: (id: string) => void;
  clearSelection?: () => void;
  apply: (state: HandIntelligenceState, result: ManipulationResult, previous: HandTransform) => void;
  navigate?: (delta: Vec3, scale: number) => void;
  begin?: () => void;
  end?: () => void;
};
export const identityTransform = (): HandTransform => ({position:[0,0,0],rotation:[0,0,0],scale:1});
export function screenTarget(id:string, x:number, y:number, radius=.06, locked=false, kind:ObjectAffordance['preferredGrabZones'][number]['kind']='body'):ObjectAffordance {
 return {objectId:id,semanticType:kind,position:[x,y,0],radius,depth:0,visible:true,locked,precisionRequired:.4,allowedInteractions:{translate:!locked,rotate:!locked,scale:!locked,sampleSurface:kind==='surface'},preferredGrabZones:[{id,kind,position:[x,y,0],radius}]};
}
export function transformDelta(next:HandTransform,previous:HandTransform){return {position:next.position.map((v,i)=>v-previous.position[i]) as Vec3,rotation:next.rotation.map((v,i)=>v-previous.rotation[i]) as Vec3,scale:next.scale/Math.max(.001,previous.scale)};}
