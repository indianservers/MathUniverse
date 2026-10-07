import type { HandIntelligenceState, ManipulationResult } from '../../ar-math-lab/hand-intelligence/types';
import type { HandTransform } from '../../ar-math-lab/arHandGestures';
import type { ImmersiveAdapter } from './types';
/** One mathematical edit transaction per deliberate grab, shared by camera and XR. */
export class ImmersiveModelController {
 private holding=false;
 constructor(private getAdapter:()=>ImmersiveAdapter|null,private transaction:(active:boolean)=>void=()=>undefined){}
 update(state:HandIntelligenceState,result:ManipulationResult,previous:HandTransform){
  const adapter=this.getAdapter();if(!adapter)return;
  const locked=state.primaryTarget?.affordance.locked;
  if(state.targetLocked&&!locked){
   if(!this.holding){this.holding=true;adapter.begin?.();this.transaction(true);}
   if(state.targetObjectId)adapter.select(state.targetObjectId);
   adapter.apply(state,result,previous);
  }
  if(result.inspection)adapter.apply(state,result,previous);
  if(!state.targetLocked||locked)this.release();
 }
 release(){if(!this.holding)return;this.holding=false;this.getAdapter()?.end?.();this.transaction(false);}
}
