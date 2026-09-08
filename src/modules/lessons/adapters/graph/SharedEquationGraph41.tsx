import {LessonCartesianGraph, type LessonGraphSeries} from '../../graphs/LessonCartesianGraph';
import type {LessonGraphView} from '../../graphs/lessonGraphGeometry';
import {graphVisualPresetForLesson} from '../../presets/graphVisualPresets';

export const EQUATION_41_VIEW=graphVisualPresetForLesson(41)!.graphViewport!;
export const equation41Value=(x:number,y:number)=>x*x/9+y*y/4;
export const equation41Satisfied=(x:number,y:number)=>Math.abs(equation41Value(x,y)-1)<1e-9;
export const equation41Trace=(x:number)=>Math.abs(x)>3?null:2*Math.sqrt(Math.max(0,1-x*x/9));
const snap=(x:number)=>Math.max(-5,Math.min(5,Math.round(x*2)/2));
const ellipse=Array.from({length:361},(_,i)=>({x:3*Math.cos(i*Math.PI/180),y:2*Math.sin(i*Math.PI/180)}));

export function SharedEquationGraph41({x,y,trace,showGuides,view,onViewChange,onPointChange,onTraceChange}:{x:number;y:number;trace:number;showGuides:boolean;view:LessonGraphView;onViewChange:(view:LessonGraphView)=>void;onPointChange:(x:number,y:number)=>void;onTraceChange:(x:number)=>void}){
 const traceY=equation41Trace(trace);
 const series:LessonGraphSeries[]=[{id:'ellipse',label:'x²/9 + y²/4 = 1',color:'#0898b7',points:ellipse}];
 if(showGuides)series.push({id:'trace-guide',label:`Trace x = ${trace}`,color:'#3b82f6',dashPattern:'8 8',points:[{x:trace,y:view.yMin},{x:trace,y:view.yMax}]});
 return <LessonCartesianGraph title="Equation Grapher" description="Test a point by substitution. The ellipse contains every solution of the equation." observation={`At (${x}, ${y}), x²/9 + y²/4 = ${equation41Value(x,y).toFixed(3)}. ${equation41Satisfied(x,y)?'The point satisfies the equation.':'The point does not satisfy the equation.'}${showGuides&&traceY===null?' No real points on the ellipse at this trace x.':''}`} view={view} unitAspectRatio={1} onViewChange={onViewChange} onResetView={()=>onViewChange(EQUATION_41_VIEW)} showTickLabels={showGuides} series={series} annotations={[
 ...(showGuides&&traceY!==null?(traceY===0?[0]:[traceY,-traceY]).map((value,i)=>({id:`trace-${i}`,x:trace,y:value,label:`(${trace}, ${value.toFixed(3)})`,color:'#0898b7',testId:`equation-trace-${i}-41`,keyboardStep:.5,onChange:(point:{x:number;y:number})=>onTraceChange(snap(point.x))})):[]),
 {id:'test',x,y,label:`Test (${x}, ${y})`,color:'#f97316',testId:'equation-test-41',keyboardStep:.5,onChange:point=>onPointChange(snap(point.x),snap(point.y))}
 ]}/>;
}
