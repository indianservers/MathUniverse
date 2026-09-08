import {LessonCartesianGraph, type LessonGraphSeries} from '../../graphs/LessonCartesianGraph';
import type {LessonGraphView} from '../../graphs/lessonGraphGeometry';
import {graphVisualPresetForLesson} from '../../presets/graphVisualPresets';

export const POINT_45_VIEW=graphVisualPresetForLesson(45)!.graphViewport!;
const snap=(n:number)=>Math.max(-5,Math.min(5,Math.round(n*2)/2));
export function SharedPointPlotter45({x,y,trace,showGuides,view,onViewChange,onPointChange}:{x:number;y:number;trace:number;showGuides:boolean;view:LessonGraphView;onViewChange:(view:LessonGraphView)=>void;onPointChange:(x:number,y:number)=>void}){
 const a={x:-2,y:1},b={x:-1,y:3};
 const series:LessonGraphSeries[]=[{id:'point-order',label:'Point order (not a fitted curve)',color:'#94a3b8',dashPattern:'8 6',points:[a,b,{x,y}]}];
 if(showGuides)series.push({id:'trace-guide',label:'Trace x',color:'#3b82f6',dashPattern:'8 8',points:[{x:trace,y:view.yMin},{x:trace,y:view.yMax}]});
 return <LessonCartesianGraph title="Point Plotter" description="Read x first, then y. Drag C or use its arrow keys to move by half a unit." observation={`Selected C = (${x}, ${y}). A = (−2, 1); B = (−1, 3).${showGuides?` The trace reads (${trace}, ${y}) at C’s current height.`:''}`} view={view} unitAspectRatio={1} onViewChange={onViewChange} onResetView={()=>onViewChange(POINT_45_VIEW)} showTickLabels={showGuides} series={series} annotations={[
  {id:'a',...a,label:'A(−2, 1)',color:'#14a8bd',testId:'point-a-45'},
  {id:'b',...b,label:'B(−1, 3)',color:'#14a8bd',testId:'point-b-45'},
  ...(showGuides?[{id:'trace',x:trace,y,label:`Trace (${trace}, ${y})`,color:'#14a8bd',testId:'point-trace-45'}]:[]),
  {id:'c',x,y,label:`C(${x}, ${y})`,color:'#f97316',testId:'point-c-45',keyboardStep:.5,onChange:p=>onPointChange(snap(p.x),snap(p.y))},
 ]}/>;
}
