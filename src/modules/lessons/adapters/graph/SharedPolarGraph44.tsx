import {useMemo} from 'react';
import {LessonPolarGraph} from '../../graphs/LessonPolarGraph';
import type {LessonGraphSeries} from '../../graphs/LessonCartesianGraph';
import type {LessonGraphView} from '../../graphs/lessonGraphGeometry';
import {graphVisualPresetForLesson} from '../../presets/graphVisualPresets';

export const POLAR_44_VIEW=graphVisualPresetForLesson(44)!.graphViewport!;
export const polar44Radius=(a:number,n:number,theta:number)=>a*Math.sin(n*theta);
export const polar44Point=(a:number,n:number,theta:number)=>{const r=polar44Radius(a,n,theta);return {x:r*Math.cos(theta),y:r*Math.sin(theta)};};
export const polar44Period=(n:number)=>Number.isInteger(n)?2*Math.PI:4*Math.PI;
export const polar44Petals=(a:number,n:number)=>a===0||n===0?0:Number.isInteger(n)?Math.abs(n)*(Math.abs(n)%2===0?2:1):4*Math.abs(n);
export const polar44Summary=(a:number,n:number,theta:number)=>{const p=polar44Point(a,n,theta);return `θ = ${theta} rad; r = ${polar44Radius(a,n,theta).toFixed(3)}; (x, y) = (${p.x.toFixed(3)}, ${p.y.toFixed(3)})`;};

export function SharedPolarGraph44({a,n,theta,showGuides,view,onViewChange}:{a:number;n:number;theta:number;showGuides:boolean;view:LessonGraphView;onViewChange:(view:LessonGraphView)=>void}){
 const point=polar44Point(a,n,theta),r=polar44Radius(a,n,theta),length=Math.max(Math.abs(a),1);
 const series=useMemo<LessonGraphSeries[]>(()=>[{id:'rose',label:'Polar curve',color:'#0898b7',kind:a===0||n===0?'points':'line',points:a===0||n===0?[{x:0,y:0}]:Array.from({length:721},(_,i)=>polar44Point(a,n,i*polar44Period(n)/720))}],[a,n]);
 const guides:LessonGraphSeries[]=showGuides?[
  {id:'angle-ray',label:'Positive angle ray',color:'#2563eb',dashed:true,points:[{x:0,y:0},{x:length*Math.cos(theta),y:length*Math.sin(theta)}]},
  {id:'radius',label:'Signed radius',color:'#f97316',points:[{x:0,y:0},point]},
 ]:[];
 return <LessonPolarGraph title="Polar Graphs" description="r = a sin(nθ). The angle control uses radians; the examples use degrees." observation={`${polar44Summary(a,n,theta)}. ${r<0?'A negative radius places the point opposite the positive angle ray.':r===0?'The point is at the pole.':'The point lies along the positive angle ray.'} ${a===0||n===0?'The curve is one point at the pole.':`The complete curve has ${polar44Petals(a,n)} petals and is sampled over ${Number.isInteger(n)?'2π':'4π'} radians.`}`} view={view} onViewChange={onViewChange} onResetView={()=>onViewChange(POLAR_44_VIEW)} showTickLabels={showGuides} series={[...series,...guides]} annotations={showGuides?[{id:'position',...point,label:`θ = ${theta}`,color:'#14b8a6',testId:'polar-position-44'}]:[]}/>;
}
