import { validARTrackedPose } from './arWorldTracking';

export type SpatialAssessment = { ready: boolean; matrix: readonly number[] | null; message: string };
/** Evaluates real device poses and hit tests; never invents a surface from camera pixels. */
export class ARSpatialIntelligence {
 private candidate: readonly number[] | null = null;
 private since = 0;
 private started: number | null = null;
 reset() { this.candidate=null; this.since=0; this.started=null; }
 update(time: number, tracked: boolean, hits: ArrayLike<number>[]): SpatialAssessment {
  if(this.started===null)this.started=time;
  if(!tracked){this.candidate=null;return {ready:false,matrix:null,message:'Position tracking lost. Hold still, then slowly scan a well-lit, textured area.'};}
  const pose=hits.map(validARTrackedPose).find(p=>p!==null)?.matrix;
  if(!pose){this.candidate=null;return {ready:false,matrix:null,message:time-this.started>8000?'No surface yet. Aim at a table or floor with visible detail; avoid blank, reflective surfaces and improve lighting.':'6DoF tracking active. Slowly move sideways and aim at a table or floor.'};}
  const previous=this.candidate;
  const stable=previous&&Math.hypot(pose[12]-previous[12],pose[13]-previous[13],pose[14]-previous[14])<.08&&pose[4]*previous[4]+pose[5]*previous[5]+pose[6]*previous[6]>.98;
  if(!stable)this.since=time;
  this.candidate=pose;
  const ready=time-this.since>=180;
  return {ready,matrix:pose,message:ready?'Stable surface found. Tap the ring to place your object.':'Surface candidate found. Hold your aim briefly to stabilize placement.'};
 }
}
