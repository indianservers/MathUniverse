import type { HandTransform } from '../arHandGestures';
import { angleDelta, average, clamp, distance, dot, length, sub } from './math';
import type { HandIntelligenceState, IntelligenceProfile, ManipulationResult, SemanticEdit, Vec3 } from './types';

type Baseline={ids:string;points:Vec3[];orientation:number;time:number;objectId:string};
/** Intent-gated constraint solver. Prediction never starts a transform; hand-count changes rebase. */
export class SpatialHandEngine {
  private baseline?:Baseline;private dimensions=new Map<string,number>();
  reset(){this.baseline=undefined;this.dimensions.clear();}
  solve(state:HandIntelligenceState,transform:HandTransform,camera:boolean,profile:IntelligenceProfile='balanced'):ManipulationResult {
    const target=state.primaryTarget;
    if(state.primaryIntent==='inspect'&&target)return{transform:null,inspection:{objectId:target.objectId,position:target.zone.sample??target.zone.position,index:target.zone.index}};
    if(!state.targetLocked){this.baseline=undefined;this.dimensions.clear();return{transform:null,releaseVelocity:state.throwAllowed?state.releaseVelocity:undefined};}
    const hands=state.activeHandIds.map(id=>state.hands.find(h=>h.id===id)).filter(h=>h!==undefined);
    if(!target||hands.length!==state.activeHandIds.length||hands.some(h=>h.missing)||state.interactionConfidence<.4)return{transform:null};
    const ids=state.activeHandIds.join(':');const points=hands.map(h=>h.position);const old=this.baseline;
    const current:Baseline={ids,points,orientation:hands[0].orientation,time:state.timestamp,objectId:target.objectId};
    if(!old||old.ids!==ids||old.objectId!==target.objectId){this.baseline=current;return{transform:null};}
    if(points.some((p,i)=>distance(p,old.points[i])>(camera?.18:.3))){this.baseline=current;return{transform:null};}
    const center=average(points),previous=average(old.points);const delta=sub(center,previous);
    const angle=points.length===2?angleDelta(Math.atan2(points[1][camera?1:2]-points[0][camera?1:2],points[1][0]-points[0][0]),Math.atan2(old.points[1][camera?1:2]-old.points[0][camera?1:2],old.points[1][0]-old.points[0][0])):angleDelta(hands[0].orientation,old.orientation);
    const radialChange=target.zone.kind==='radius'?(distance(center,target.affordance.position)-distance(previous,target.affordance.position))/Math.max(.025,target.affordance.radius):-delta[1]*4;
    const ratio=points.length===2?clamp(distance(points[0],points[1])/Math.max(.025,distance(old.points[0],old.points[1])),.9,1.1):Math.exp(clamp(radialChange,-.1,.1));
    const deadZone=state.precision?.001:.0025;
    if(length(delta)<deadZone&&Math.abs(angle)<.012&&Math.abs(ratio-1)<.008)return{transform:null};
    this.baseline=current;
    const precisionGain=state.precision?.35:1;const speedGain=hands[0].speed>.7?1.2:1;
    const sizeGain=clamp(target.affordance.radius/(camera?.14:.2),.35,1.5);
    const gain=(camera?8:1)*precisionGain*sizeGain*speedGain;
    const allowed=target.affordance.allowedInteractions;
    const position=[...transform.position] as Vec3,rotation=[...transform.rotation] as Vec3;let scale=transform.scale;
    const weights=state.weights;
    let semanticEdit:SemanticEdit|undefined;
    const editing=target.zone.kind==='vertex'&&allowed.editVertex||target.zone.kind==='vector'&&allowed.editVector;
    const stretch=target.zone.kind==='face'&&state.primaryIntent==='stretch'&&target.zone.dimension;
    if(editing&&weights.translate>.15){semanticEdit={objectId:target.objectId,kind:target.zone.kind==='vector'?'vector':'vertex',index:target.zone.index,delta:[delta[0]*gain,delta[1]*gain*(camera?-1:1),camera?0:delta[2]*gain]};}
    else if(stretch){
      const axis=target.zone.axis??0;const key=`${target.objectId}:${target.zone.dimension}`;
      const value=this.dimensions.get(key)??target.zone.value??1;
      const direction=target.zone.position[axis]>=target.affordance.position[axis]?1:-1;
      const change=target.zone.direction?dot(delta,target.zone.direction):delta[axis]*(camera&&axis===1?-1:1)*direction;
      const next=clamp(value*(points.length===2?Math.pow(ratio,weights.stretch):Math.exp(change*gain)),.001,100000);this.dimensions.set(key,next);
      semanticEdit={objectId:target.objectId,kind:'dimension',dimension:target.zone.dimension,value:next};
    }else{
      if(allowed.translate&&weights.translate>.15&&state.primaryIntent!=='resize')for(let i=0;i<3;i++)if(!camera||i!==2)position[i]=clamp(position[i]+delta[i]*gain*weights.translate*(camera&&i===1?-1:1),camera?-4:-10,camera?4:10);
      if(allowed.rotate&&weights.rotate>.2)rotation[camera?2:1]+=clamp(angle,-.15,.15)*weights.rotate;
      if(weights.scale>.2){
        if(allowed.editRadius&&target.zone.dimension){const key=`${target.objectId}:${target.zone.dimension}`;const value=this.dimensions.get(key)??target.zone.value??1;
          const next=clamp(value*Math.pow(ratio,weights.scale),.001,100000);this.dimensions.set(key,next);semanticEdit={objectId:target.objectId,kind:'dimension',dimension:target.zone.dimension,value:next};
        }else if(allowed.scale)scale=clamp(scale*Math.pow(ratio,weights.scale),.18,5);
      }
    }
    if(state.precision&&hands[0].speed<.025){
      for(let i=0;i<3;i++){const grid=Math.round(position[i]*10)/10;if(Math.abs(grid-position[i])<.012)position[i]+=(grid-position[i])*.35;}
      if(Math.abs(hands[0].angularVelocity)<.05)for(let i=0;i<3;i++){const snap=Math.round(rotation[i]/(Math.PI/2))*(Math.PI/2);if(Math.abs(rotation[i]-snap)<.025)rotation[i]+=(snap-rotation[i])*.25;}
    }
    // Play changes response, never enables throws without an explicit physics context.
    if(profile==='precision')scale=clamp(scale,.18,5);
    const changed=distance(position,transform.position)>1e-7||distance(rotation,transform.rotation)>1e-7||Math.abs(scale-transform.scale)>1e-7;
    return{transform:changed?{position,rotation,scale}:null,semanticEdit};
  }
}
