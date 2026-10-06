import { HandFeatureEngine } from './HandFeatureEngine';
import { SpatialProcessingLayer } from './SpatialProcessingLayer';
import { angleDelta, average, clamp, distance, dot, length, normalized, RingBuffer, sub } from './math';
import type { HandFeatures, HandIntent, HandIntelligenceState, IntelligenceEvent, IntelligenceFrameInput, IntelligenceProfile, IntentModel, SpatialFrame, SpatialTarget, TransformWeights } from './types';

const zeroWeights=():TransformWeights=>({translate:0,rotate:0,scale:0,stretch:0,depth:0});
export const idleState=(timestamp=0):HandIntelligenceState=>({timestamp,hands:[],primaryIntent:'idle',targetConfidence:0,intentConfidence:0,interactionConfidence:0,uncertainty:1,phase:'idle',isStable:false,targetLocked:false,activeHandIds:[],precision:false,weights:zeroWeights(),scores:{},reasons:[],throwAllowed:false});
/** Deterministic temporal scoring with an optional future intent-model adapter. */
export class HandIntelligenceEngine {
  readonly features=new HandFeatureEngine();readonly spatial=new SpatialProcessingLayer();readonly history=new RingBuffer<HandIntelligenceState>(60);
  state=idleState();frame:SpatialFrame={timestamp:0,hands:[],interactions:{contactPoints:[],grabAnchors:[]}};
  private listeners=new Set<(event:IntelligenceEvent)=>void>();private focusSince=0;private focusKey='';private readySince=0;private readyKey='';
  private releaseSince:number|null=null;private secondSince:number|null=null;private intentSince=0;private usages=new Map<string,number>();private pinchThreshold=.30;
  constructor(public profile:IntelligenceProfile='balanced',private model?:IntentModel){}
  subscribe(listener:(event:IntelligenceEvent)=>void){this.listeners.add(listener);return()=>{this.listeners.delete(listener);};}
  reset(){this.features.reset();this.spatial.reset();this.history.clear();this.state=idleState();this.focusKey='';this.readyKey='';this.releaseSince=null;this.secondSince=null;this.usages.clear();this.pinchThreshold=.30;}
  setProfile(profile:IntelligenceProfile){this.profile=profile;}
  update(input:IntelligenceFrameInput):HandIntelligenceState {
    if(!Number.isFinite(input.timestamp)||input.timestamp<=this.state.timestamp&&this.history.size)return this.state;
    const old=this.state,time=input.timestamp;
    const hands=this.features.update(input.hands,time,input.camera,this.profile,input.latencyMs);
    this.frame=this.spatial.frame(time,hands,input.targets,old);
    let target=this.frame.interactions.primaryTarget;
    if(old.targetLocked){const live=input.targets.find(t=>t.objectId===old.targetObjectId&&!t.locked&&t.visible&&!t.occluded);if(!live)target=undefined;else if(target)target={...target,affordance:live,zone:live.preferredGrabZones.find(z=>z.id===old.primaryTarget?.zone.id)??target.zone};}
    const next:HandIntelligenceState={...idleState(time),hands,primaryTarget:target,targetObjectId:target?.objectId,targetConfidence:target?.score??0,targetLocked:old.targetLocked,activeHandIds:[...old.activeHandIds],phase:old.phase};
    const focusKey=target?`${target.objectId}:${target.zone.id}`:'';
    if(focusKey!==this.focusKey){this.focusSince=time;this.focusKey=focusKey;}
    const focusDuration=time-this.focusSince;
    const targeted=hands.filter(h=>!h.missing&&this.frame.interactions.contactPoints.some(t=>t.handId===h.id&&t.objectId===target?.objectId&&t.score>.55));
    const primary=old.targetLocked?hands.find(h=>h.id===old.activeHandIds[0]):hands.find(h=>h.id===target?.handId);
    const closure=(h:HandFeatures)=>Math.max(clamp(1-(h.pinchRatio-this.pinchThreshold)/.35),clamp((h.closure-.45)/.4));
    const grabScore=primary&&target?.affordance?clamp(.25*(old.targetLocked?1:target.contact)+.25*closure(primary)+.2*target.score+.2*clamp(focusDuration/180)+.1*(old.targetLocked?1:0))*(.9+.1*primary.quality):0;
    const held=hands.filter(h=>old.activeHandIds.includes(h.id));
    const quality=held.length?Math.min(...held.map(h=>h.quality)):primary?.quality??0;
    const opening=primary&&!primary.missing?clamp((primary.pinchRatio-.5)/.3)*(1-clamp(primary.closure)):0;
    const releaseScore=clamp(opening*.85+(target?0:.8)+(!held.length?.9:0));
    const unavailable=!primary||primary.missing||primary.quality<.35;
    const permitted=input.tool!=='draw'&&input.tool!=='ui'&&!!target;
    if(old.targetLocked){
      if(!permitted||unavailable||releaseScore>.7){if(this.releaseSince===null)this.releaseSince=time;}
      else this.releaseSince=null;
      if(this.releaseSince!==null&&time-this.releaseSince>=(unavailable?180:120)){
        next.targetLocked=false;next.activeHandIds=[];next.primaryIntent='release';next.phase='release';next.intentConfidence=Math.max(.7,releaseScore);next.releaseVelocity=primary?.velocity;
        const previous=this.history.values().slice(-4).filter(s=>s.targetLocked).map(s=>s.hands.find(h=>h.id===old.activeHandIds[0])?.velocity).filter(v=>v!==undefined);
        const directional=previous.length>=3&&previous.every(v=>dot(normalized(v!),normalized(previous[0]!))>.8);
        next.throwAllowed=!!input.physicsEnabled&&this.profile==='play'&&directional&&(primary?.speed??0)>1.5&&quality>.8;
        this.readyKey='';this.readySince=time;
      }else{
        next.targetLocked=true;next.targetObjectId=old.targetObjectId;next.primaryTarget=target??old.primaryTarget;next.targetConfidence=old.targetConfidence;
        const second=targeted.find(h=>!old.activeHandIds.includes(h.id)&&closure(h)>.85&&h.quality>.65);
        if(old.activeHandIds.length===1&&second){if(this.secondSince===null)this.secondSince=time;next.phase='two-hand-ready';if(time-this.secondSince>160){next.activeHandIds.push(second.id);next.phase='two-hand-grab';this.secondSince=null;}}
        else if(old.activeHandIds.length===1)this.secondSince=null;
        if(old.activeHandIds.length===2){const support=hands.find(h=>h.id===old.activeHandIds[1]);
          if(!support||support.missing||closure(support)<.45){if(this.secondSince===null)this.secondSince=time;if(time-this.secondSince>160){next.activeHandIds=[old.activeHandIds[0]];this.secondSince=null;}}
          else this.secondSince=null;
        }
        if(!unavailable&&this.releaseSince===null&&target){this.motion(next,old,input,target);}
        else {next.primaryIntent=old.primaryIntent;next.intentConfidence=old.intentConfidence*.7;next.reasons=['Holding pose while tracking or release is uncertain.'];}
      }
    }else if(permitted&&primary&&grabScore>(this.profile==='precision'?.83:.80)&&target!.score>.65&&quality>.65){
      const key=`${target!.objectId}:${primary.id}`;
      if(this.readyKey!==key){this.readyKey=key;this.readySince=time;}
      next.phase='grab-ready';next.primaryIntent='touch';next.intentConfidence=grabScore;
      if(time-this.readySince>=(this.profile==='precision'?160:100)){
        next.targetLocked=true;next.activeHandIds=[primary.id];next.primaryIntent='grab';next.phase='grabbed';next.intentConfidence=grabScore;
        this.usages.set(primary.handedness,(this.usages.get(primary.handedness)??0)+1);
        // Session adaptation is deliberately bounded; no automatic relaxation beyond these limits.
        if(primary.pinchRatio<.35)this.pinchThreshold=clamp(this.pinchThreshold*.98+primary.pinchRatio*.02,.22,.32);
      }
    }else{
      this.readyKey='';
      const pointScore=(primary?.pointing??0)*(.4+.6*(target?.score??0));
      const inspectScore=target?.affordance.allowedInteractions.sampleSurface?pointScore*clamp(focusDuration/180)*(1-clamp((primary?.speed??1)*2)):0;
      next.scores={grab:grabScore,point:pointScore,inspect:inspectScore,release:releaseScore};
      if(input.tool==='ui'){next.primaryIntent='ui';next.phase='idle';}
      else if(inspectScore>.6){next.primaryIntent='inspect';next.phase='hover';next.intentConfidence=inspectScore;}
      else if(pointScore>.55){next.primaryIntent='point';next.phase='hover';next.intentConfidence=pointScore;}
      else if(target){next.primaryIntent=focusDuration>150?'touch':'explore';next.phase=focusDuration>150?'contact':'approach';next.intentConfidence=target.score;}
    }
    next.dominantHand=[...this.usages].sort((a,b)=>b[1]-a[1])[0]?.[0];
    next.precision=!!primary&&(primary.speed<.18&&focusDuration>250||this.profile==='precision'||(target?.affordance.precisionRequired??0)>.7);
    next.interactionConfidence=clamp(next.intentConfidence*quality*(next.targetLocked?1:next.targetConfidence));next.uncertainty=1-next.interactionConfidence;
    next.isStable=quality>.6&&(primary?.stability??0)>.6;
    next.oneHandMode=next.activeHandIds.length===1?(next.precision?'precision':'whole-object'):undefined;
    next.twoHandMode=next.activeHandIds.length===2?(Object.values(next.weights).filter(v=>v>.35).length>1?'combined':next.primaryIntent):undefined;
    next.predictedNextIntent=next.phase==='approach'?'inspect':next.phase==='grab-ready'?'grab':next.phase==='two-hand-ready'?'resize':next.targetLocked?'move':undefined;
    this.emitChanges(old,next);this.state=next;this.history.push(next);return next;
  }
  private motion(next:HandIntelligenceState,old:HandIntelligenceState,input:IntelligenceFrameInput,target:SpatialTarget){
    const active=next.hands.filter(h=>next.activeHandIds.includes(h.id));const previous=old.hands.filter(h=>next.activeHandIds.includes(h.id));
    if(active.length!==previous.length||active.some(h=>h.missing)){next.primaryIntent='grab';next.intentConfidence=.8;return;}
    const a=average(active.map(h=>h.position)),b=average(previous.map(h=>h.position));
    const dt=Math.max(.01,(next.timestamp-old.timestamp)/1000);const translate=clamp(distance(a,b)/(dt*(input.camera?.22:.35)));
    let scale=0,rotate=0;
    if(active.length===2){const av=sub(active[1].position,active[0].position),bv=sub(previous[1].position,previous[0].position);
      scale=clamp(Math.abs(Math.log(Math.max(length(av),.01)/Math.max(length(bv),.01)))/(dt*1.3));
      const angle=(v:typeof av)=>Math.atan2(v[input.camera?1:2],v[0]);rotate=clamp(Math.abs(angleDelta(angle(av),angle(bv)))/(dt*1.4));
    }else{rotate=clamp(Math.abs(active[0]?.angularVelocity??0)/1.5);if(input.tool==='resize'||target.zone.kind==='radius')scale=clamp(distance(a,b)/(dt*.15));}
    const allow=target.affordance.allowedInteractions;
    next.weights={translate:allow.translate&&target.zone.kind!=='radius'?translate:0,rotate:allow.rotate?rotate:0,scale:allow.scale||allow.editRadius?scale:0,
      stretch:target.zone.kind==='face'&&target.zone.dimension&&(allow.stretchX||allow.stretchY||allow.stretchZ)?Math.max(translate,scale):0,depth:!input.camera?clamp(Math.abs(a[2]-b[2])/(dt*.2)):0};
    next.scores={grab:.55,move:.45+next.weights.translate*.55,rotate:.35+next.weights.rotate*.6,resize:.35+next.weights.scale*.6,
      stretch:.4+next.weights.stretch*.7,push:.3+(a[2]-b[2]>0?next.weights.depth*.6:0),pull:.3+(a[2]-b[2]<0?next.weights.depth*.6:0)};
    if(this.model){const scores=this.model.predict(active,this.history.values()).probabilities;for(const [intent,score] of Object.entries(scores))if(Number.isFinite(score))next.scores[intent as HandIntent]=clamp((next.scores[intent as HandIntent]??0)*.7+score!*.3);}
    const winner=Object.entries(next.scores).sort((a,b)=>b[1]!-a[1]!)[0] as [HandIntent,number];
    const motion=['move','rotate','resize','stretch','push','pull'];
    next.primaryIntent=winner?.[1]>.6?winner[0]:'grab';
    if(motion.includes(old.primaryIntent)&&next.primaryIntent!==old.primaryIntent&&next.timestamp-this.intentSince<200&&(next.scores[old.primaryIntent]??0)>.45)next.primaryIntent=old.primaryIntent;
    if(next.primaryIntent!==old.primaryIntent)this.intentSince=next.timestamp;
    next.intentConfidence=next.scores[next.primaryIntent]??.7;next.phase=next.activeHandIds.length===2?'two-hand-grab':'grabbed';
    next.reasons=[`${active.length} confident hand contact(s)`, `Translation ${translate.toFixed(2)} · spread ${scale.toFixed(2)} · rotation ${rotate.toFixed(2)}`];
  }
  private emitChanges(old:HandIntelligenceState,next:HandIntelligenceState){
    const emit=(type:IntelligenceEvent['type'])=>{for(const callback of this.listeners)callback({type,state:next});};
    if(old.primaryIntent!==next.primaryIntent){emit('onIntentEnd');emit('onIntentStart');}else emit('onIntentUpdate');
    if(next.targetObjectId!==old.targetObjectId)emit('onTargetPredicted');
    if(!old.targetLocked&&next.targetLocked){emit('onTargetLocked');emit('onGrabStart');}
    else if(old.targetLocked&&!next.targetLocked){emit('onGrabEnd');emit('onTargetReleased');}
    else if(next.targetLocked)emit('onGrabUpdate');
    if(old.activeHandIds.length<2&&next.activeHandIds.length===2)emit('onTwoHandStart');
    else if(old.activeHandIds.length===2&&next.activeHandIds.length<2)emit('onTwoHandEnd');
    else if(next.activeHandIds.length===2)emit('onTwoHandUpdate');
  }
}
