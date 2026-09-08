import {useMemo} from 'react';
import {LessonCartesianGraph, type LessonGraphSeries} from '../../graphs/LessonCartesianGraph';
import type {LessonGraphView} from '../../graphs/lessonGraphGeometry';
import {graphVisualPresetForLesson} from '../../presets/graphVisualPresets';

export const PARAMETRIC_43_VIEW=graphVisualPresetForLesson(43)!.graphViewport!;
export const parametric43Point=(a:number,b:number,t:number)=>({x:a*Math.cos(t),y:b*Math.sin(t)});
export const parametric43Speed=(a:number,b:number,t:number)=>Math.hypot(a*Math.sin(t),b*Math.cos(t));
export const parametric43Pair=(a:number,b:number,t:number)=>{const p=parametric43Point(a,b,t);const f=(n:number)=>(Math.abs(n)<1e-10?0:n).toFixed(3);return `(${f(p.x)}, ${f(p.y)})`;};

export function SharedParametricGraph43({a,b,t,showGuides,view,onViewChange}:{a:number;b:number;t:number;showGuides:boolean;view:LessonGraphView;onViewChange:(view:LessonGraphView)=>void}){
 const point=parametric43Point(a,b,t),speed=parametric43Speed(a,b,t);
 const series=useMemo<LessonGraphSeries[]>(()=>[{id:'path',label:'Parametric path',color:'#0898b7',points:Array.from({length:361},(_,i)=>parametric43Point(a,b,i*Math.PI/180))}],[a,b]);
 const direction:LessonGraphSeries[]=[];
 if(showGuides&&speed>1e-10){
   // Constant-length arrow communicates direction, not velocity magnitude.
   const ux=-a*Math.sin(t)/speed,uy=b*Math.cos(t)/speed;
   const tip={x:point.x+.65*ux,y:point.y+.65*uy};
   direction.push({id:'direction',label:'Direction as t increases',color:'#f97316',points:[point,tip,{x:tip.x-.18*ux+.1*uy,y:tip.y-.18*uy-.1*ux},tip,{x:tip.x-.18*ux-.1*uy,y:tip.y-.18*uy+.1*ux}]});
 }
 return <LessonCartesianGraph title="Parametric Curves" description="The parameter t is measured in radians and moves the point along the path." observation={`At t = ${t}: (x, y) = ${parametric43Pair(a,b,t)}; speed = ${speed.toFixed(3)}.${a===0&&b===0?' Both scales are zero, so the path is one point.':a===0||b===0?' One scale is zero, so the path is a line segment.':''}`} view={view} onViewChange={onViewChange} onResetView={()=>onViewChange(PARAMETRIC_43_VIEW)} unitAspectRatio={1} showTickLabels={showGuides} series={[...series,...direction]} annotations={showGuides?[{id:'position',...point,label:`t = ${t}`,color:'#7c3aed',testId:'parametric-position-43'}]:[]}/>;
}
