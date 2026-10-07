import { classifyHandPose } from './KnownHandGestures';
import type { HandPoint } from '../arHandGestures';
import type { HandFeatures, IntelligenceProfile, RawHand, Vec3 } from './types';
import { add, angleDelta, clamp, distance, dot, length, mul, normalized, sub } from './math';

type Track = { feature: HandFeatures; lastSeen: number; size: number };
const xyz = (p: HandPoint): Vec3 => [p.x,p.y,p.z];
/** Stable identities, normalized poses and speed-adaptive low-pass filtering. No camera images retained. */
export class HandFeatureEngine {
  private tracks = new Map<string,Track>(); private serial=0;
  reset(){this.tracks.clear();}
  update(raw: RawHand[], time:number, camera:boolean, profile:IntelligenceProfile, latencyMs=60): HandFeatures[] {
    const candidates=raw.slice(0,2).map(h=>this.pose(h,camera)).filter((h):h is NonNullable<ReturnType<HandFeatureEngine['pose']>>=>h!==null);
    const existing=[...this.tracks.values()].filter(t=>time-t.lastSeen<350);
    // Joint assignment preserves crossing identities; handedness is only a weak prior.
    const cost=(c:typeof candidates[number],t:Track)=>distance(c.position,add(t.feature.position,mul(t.feature.velocity,Math.min(.15,(time-t.lastSeen)/1000))))+(c.handedness===t.feature.handedness?0:.03);
    if(candidates.length===2&&existing.length===2&&cost(candidates[0],existing[1])+cost(candidates[1],existing[0])<cost(candidates[0],existing[0])+cost(candidates[1],existing[1]))existing.reverse();
    const used=new Set<string>();const output:HandFeatures[]=[];
    for(let i=0;i<candidates.length;i++){
      const c=candidates[i];let track: Track | undefined=candidates.length===1?existing.slice().sort((a,b)=>cost(c,a)-cost(c,b))[0]:existing[i];
      if(!track||used.has(track.feature.id)||cost(c,track)>(camera?.3:1))track=undefined;
      if(!track)track=existing.filter(t=>!used.has(t.feature.id)&&cost(c,t)<(camera?.3:1)).sort((a,b)=>cost(c,a)-cost(c,b))[0];
      const old=track?.feature;const dt=old?clamp((time-old.timestamp)/1000,.008,.2):1/30;
      const rawVelocity=old?mul(sub(c.position,old.position),1/dt):[0,0,0] as Vec3;
      const speed=length(rawVelocity);const acceleration=old?mul(sub(rawVelocity,old.velocity),1/dt):[0,0,0] as Vec3;
      const jerk=old?length(sub(acceleration,old.acceleration))/dt:0;
      const reversal=old&&dot(rawVelocity,old.velocity)<0;
      const jitter=!!old&&reversal&&distance(c.position,old.position)<(camera?.006:.003)&&speed<.25;
      const alpha=1-Math.exp(-2*Math.PI*(profile==='precision'?1.2:profile==='play'?3.2:2.1)*(1+Math.min(5,speed*8))*dt);
      const position=old?add(old.position,mul(sub(c.position,old.position),jitter?.05:alpha)):c.position;
      const velocity=old?add(mul(old.velocity,.4),mul(rawVelocity,.6)):rawVelocity;
      const prediction=mul(velocity,clamp(latencyMs/1000,.05,.15));
      const predictionLimit=camera?.018:.025;
      const predictedPosition=add(position,mul(prediction,Math.min(1,predictionLimit/Math.max(length(prediction),1e-6))));
      const quality=clamp(c.confidence*(camera?clamp(c.size/.055,.25,1):1)*(speed>(camera?4:8)?.3:1));
      const id=old?.id??`hand-${++this.serial}`;
      const feature:HandFeatures={id,pose:c.pose,handedness:c.handedness,position,predictedPosition,fingertip:c.fingertip,velocity,acceleration,jerk,speed,
        angularVelocity:old?angleDelta(c.orientation,old.orientation)/dt:0,curvature:old?1-clamp(dot(normalized(velocity),normalized(old.velocity)),-1,1):0,
        palmNormal:c.normal,orientation:c.orientation,curls:c.curls,pinchRatio:c.pinchRatio,pinchVelocity:old?(c.pinchRatio-old.pinchRatio)/dt:0,
        openScore:c.openScore,closure:c.closure,pointing:c.pointing,quality,stability:clamp(1-speed*.8-(jitter?.15:0)),jitter,embedding:[],timestamp:time,missing:false};
      feature.embedding=[...feature.curls,feature.pinchRatio,...feature.palmNormal,...velocity,feature.speed,feature.openScore,feature.closure];
      used.add(id);this.tracks.set(id,{feature,lastSeen:time,size:track?track.size*.98+c.size*.02:c.size});output.push(feature);
    }
    for(const [id,track] of this.tracks){
      if(used.has(id))continue;
      // Preserve identity during occlusion but never fabricate movement or contact.
      if(time-track.lastSeen<=180)output.push({...track.feature,timestamp:time,quality:track.feature.quality*.5,missing:true});
      else if(time-track.lastSeen>350)this.tracks.delete(id);
    }
    return output;
  }
  private pose(hand:RawHand,camera:boolean){
    const p=hand.landmarks;
    if(p){
      if(p.length!==21||p.some(v=>![v.x,v.y,v.z].every(Number.isFinite)))return null;
      const size=distance(xyz(p[0]),xyz(p[9]));if(size<.015)return null;
      const curls=[4,8,12,16,20].map((tip,i)=>clamp(1-distance(xyz(p[tip]),xyz(p[0]))/(size*(i===0?1.8:2.5))));
      const u=sub(xyz(p[5]),xyz(p[0])),v=sub(xyz(p[17]),xyz(p[0]));
      const normal=normalized([u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]]);const pinchRatio=distance(xyz(p[4]),xyz(p[8]))/size;
      const pose=classifyHandPose(p,camera);const position=pose!=='unknown'&&pose!=='index'?xyz(p[9]):mul(add(xyz(p[4]),xyz(p[8])),.5);
      // MediaPipe relative z is not metric room depth. Camera targeting uses image XY.
      if(camera)position[2]=0;
      const fingertip=xyz(p[8]);if(camera)fingertip[2]=0;
      const extension=(tip:number,pip:number)=>clamp((distance(xyz(p[tip]),xyz(p[0]))/Math.max(distance(xyz(p[pip]),xyz(p[0])),1e-5)-1)*3);
      const pointing=extension(8,6)*(1-(extension(12,10)+extension(16,14)+extension(20,18))/3);
      return{pose,position,fingertip,size,curls,pinchRatio,normal,orientation:hand.orientation??Math.atan2(p[5].y-p[17].y,p[5].x-p[17].x),confidence:clamp(hand.confidence??.9),handedness:hand.handedness??'unknown',openScore:pose==='open-palm'?1:1-curls.reduce((a,b)=>a+b,0)/5,closure:curls.slice(1).reduce((a,b)=>a+b,0)/4,pointing:pose==='index'?1:pointing};
    }
    if(!hand.point||![hand.point.x,hand.point.y,hand.point.z,hand.pinchRatio].every(Number.isFinite))return null;
    const position=xyz(hand.point);const pinchRatio=hand.pinchRatio??1;
    return{pose:undefined,position,fingertip:position,size:.08,curls:[0,0,0,0,0],pinchRatio,normal:[0,1,0] as Vec3,orientation:hand.orientation??0,confidence:clamp(hand.confidence??1),handedness:hand.handedness??'unknown',openScore:clamp(pinchRatio),closure:clamp(1-pinchRatio),pointing:0};
  }
}
