import type { HandFeatures, HandIntelligenceState, ObjectAffordance, SpatialFrame, SpatialTarget, Vec3 } from './types';
import { add, clamp, distance, dot, normalized, sub } from './math';

/** Coordinates supplied by adapters are either normalized image XY or real XR local metres. */
export class SpatialProcessingLayer {
  private hover=new Map<string,{since:number;last:number}>();
  reset(){this.hover.clear();}
  frame(time:number,hands:HandFeatures[],targets:ObjectAffordance[],state?:HandIntelligenceState):SpatialFrame {
    const contacts:SpatialTarget[]=[];
    for(const hand of hands){
      if(hand.missing||hand.quality<.4)continue;
      for(const target of targets.slice(0,40)){
        if(!target.visible||target.occluded||target.locked||!Number.isFinite(target.radius)||target.position.some(v=>!Number.isFinite(v)))continue;
        const cursor=hand.pointing>.5?hand.fingertip:hand.predictedPosition;
        for(const zone of target.preferredGrabZones.slice(0,80)){
          if(!Number.isFinite(zone.radius)||zone.radius<=0||zone.position.some(v=>!Number.isFinite(v)))continue;
          const reach=distance(cursor,zone.position),radius=Math.max(.008,zone.radius)*(hand.speed<.15?1.15:1);
          if(reach>radius*2)continue;
          const key=`${hand.id}:${target.objectId}:${zone.id}`;
          let hover=this.hover.get(key);if(!hover||time-hover.last>150)hover={since:time,last:time};hover.last=time;this.hover.set(key,hover);
          const proximity=clamp(1-reach/(radius*2));const alignment=clamp(1-reach/Math.max(radius*1.5,.01));
          const approach=clamp(dot(normalized(hand.velocity),normalized(sub(zone.position,hand.position))));
          const history=state?.targetObjectId===target.objectId?1:target.selected?.7:0;
          const precisionZone=zone.kind==='vertex'||zone.kind==='vector';
          const score=.4*alignment+.2*proximity+.15*clamp((time-hover.since)/300)+.1*clamp(1-target.depth/20)+.1*history+.05*(precisionZone?1:.65)+.04*approach;
          contacts.push({objectId:target.objectId,zone,score:clamp(score),contact:clamp(1-reach/radius),handId:hand.id,affordance:target});
        }
      }
    }
    for(const [key,value] of this.hover)if(time-value.last>400)this.hover.delete(key);
    // Semantic hit priority resolves nested zones without defeating confidence/proximity.
    const priority={vertex:.08,vector:.08,edge:.04,face:.025,radius:.04,surface:.015,body:0,ui:.08};
    contacts.sort((a,b)=>(b.score+priority[b.zone.kind])-(a.score+priority[a.zone.kind]));
    const primary=state?.targetLocked?contacts.find(c=>c.objectId===state.targetObjectId&&c.zone.id===state.primaryTarget?.zone.id)??state.primaryTarget:contacts[0];
    const secondary=contacts.find(c=>c.objectId===primary?.objectId&&c.handId!==primary.handId);
    return{timestamp:time,hands,interactions:{primaryTarget:primary,secondaryTarget:secondary,contactPoints:contacts,
      grabAnchors:state?.targetLocked?hands.filter(h=>state.activeHandIds.includes(h.id)).map(h=>({handId:h.id,objectId:state.targetObjectId!,position:h.position})):[],
      oneHandTransform:state?.activeHandIds.length===1?state.weights:undefined,twoHandTransform:state?.activeHandIds.length===2?state.weights:undefined}};
  }
  static webcamToNDC(p:Vec3):Vec3{return[p[0]*2-1,1-p[1]*2,p[2]];}
  static ndcToWebcam(p:Vec3):Vec3{return[(p[0]+1)/2,(1-p[1])/2,0];}
  static coverPoint(p:Vec3,videoAspect:number,viewAspect:number):Vec3 {
    if(videoAspect>viewAspect)return[.5+(p[0]-.5)*videoAspect/viewAspect,p[1],p[2]];
    return[p[0],.5+(p[1]-.5)*viewAspect/videoAspect,p[2]];
  }
  static worldToLocal(point:Vec3,origin:Vec3):Vec3{return sub(point,origin);}
  static localToWorld(point:Vec3,origin:Vec3):Vec3{return add(point,origin);}
}
