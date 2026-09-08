import {LessonCartesianGraph, type LessonGraphSeries} from '../../graphs/LessonCartesianGraph';
import type {LessonGraphView} from '../../graphs/lessonGraphGeometry';
import {graphVisualPresetForLesson} from '../../presets/graphVisualPresets';

export const TRACE_48_VIEW=graphVisualPresetForLesson(48)!.graphViewport!;
export const trace48Value=(x:number)=>Math.sin(x)+.3*x;
export const trace48Slope=(x:number)=>Math.cos(x)+.3;
export const trace48Secant=(x:number,offset:number)=>offset===0?null:(trace48Value(x+offset)-trace48Value(x))/offset;
export const trace48Summary=(x:number,offset:number)=>`x = ${x}; y = ${trace48Value(x).toFixed(3)}; slope = ${trace48Slope(x).toFixed(3)}; Δx = ${offset}; secant = ${trace48Secant(x,offset)?.toFixed(3)??'undefined'}`;
const snap=(x:number)=>Math.max(-5,Math.min(5,Math.round(x*2)/2));
export function SharedTraceGraph48({x,offset,showGuides,view,onViewChange,onXChange,onOffsetChange}:{x:number;offset:number;showGuides:boolean;view:LessonGraphView;onViewChange:(view:LessonGraphView)=>void;onXChange:(x:number)=>void;onOffsetChange:(offset:number)=>void}){
 const y=trace48Value(x),next={x:x+offset,y:trace48Value(x+offset)},slope=trace48Slope(x);
 const series:LessonGraphSeries[]=[
  {id:'function',label:'f(x) = sin(x) + 0.3x',color:'#0898b7',points:Array.from({length:601},(_,i)=>{const x=view.xMin+(view.xMax-view.xMin)*i/600;return {x,y:trace48Value(x)};})},
  {id:'tangent',label:'Tangent: exact slope',color:'#f97316',points:[{x:x-1.5,y:y-1.5*slope},{x:x+1.5,y:y+1.5*slope}]},
 ];
 if(showGuides){series.push({id:'trace-guide',label:'Trace x',color:'#3b82f6',dashPattern:'8 8',points:[{x,y:view.yMin},{x,y:view.yMax}]});if(offset!==0)series.push({id:'secant',label:'Secant across Δx',color:'#64748b',dashed:true,points:[{x,y},next]});}
 const nextVisible=next.x>=view.xMin&&next.x<=view.xMax&&next.y>=view.yMin&&next.y<=view.yMax;
 return <LessonCartesianGraph title="Trace Mode" description="Move the purple trace point horizontally. The signed offset places a comparison point on the same curve; slope is calculated." observation={`${trace48Summary(x,offset)}.${offset===0?' A zero offset cannot define a secant slope.':''}${!nextVisible?' Zoom out to see the offset point.':''} Fit restores the original offset and view.`} view={view} onViewChange={onViewChange} onResetView={()=>onViewChange(TRACE_48_VIEW)} series={series} showTickLabels={showGuides} annotations={[
  ...(showGuides?[{id:'offset',...next,label:`x + Δx = ${next.x}`,color:'#14a8bd',testId:'trace-offset-48',keyboardStep:.5,onChange:(p:{x:number;y:number})=>onOffsetChange(snap(p.x-x))}]:[]),
  {id:'trace',x,y,label:`(${x}, ${y.toFixed(3)})`,color:'#7c3aed',testId:'trace-point-48',keyboardStep:.5,onChange:p=>onXChange(snap(p.x))},
 ]}/>;
}
