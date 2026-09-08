import {LessonCartesianGraph, type LessonGraphSeries} from '../../graphs/LessonCartesianGraph';
import type {LessonGraphView} from '../../graphs/lessonGraphGeometry';
import {graphVisualPresetForLesson} from '../../presets/graphVisualPresets';

export const TABLE_47_VIEW={...graphVisualPresetForLesson(47)!.graphViewport!,yMin:-6};
export const TABLE_47_FIT_VIEW={xMin:-6,xMax:6,yMin:-6,yMax:34};
export const table47Value=(x:number)=>x*x-2*x-3;
export const table47Summary=(x:number,trace:number)=>`x = ${x}; f(x) = ${table47Value(x)}; point = (${x}, ${table47Value(x)}); trace = (${trace}, ${table47Value(trace)})`;
const snap=(x:number)=>Math.max(-5,Math.min(5,Math.round(x*2)/2));
export function SharedTableGraph47({x,trace,showGuides,view,onViewChange,onXChange}:{x:number;trace:number;showGuides:boolean;view:LessonGraphView;onViewChange:(view:LessonGraphView)=>void;onXChange:(x:number)=>void}){
 const series:LessonGraphSeries[]=[
  {id:'function',label:'f(x) = x² − 2x − 3',color:'#0898b7',points:Array.from({length:601},(_,i)=>{const x=view.xMin+(view.xMax-view.xMin)*i/600;return {x,y:table47Value(x)};})},
  {id:'table-rows',label:'Rows: roots and vertex',color:'#0898b7',kind:'points',points:[-1,1,3].map(x=>({x,y:table47Value(x)}))},
 ];
 if(showGuides)series.push({id:'trace-guide',label:'Trace x',color:'#3b82f6',dashPattern:'8 8',points:[{x:trace,y:view.yMin},{x:trace,y:view.yMax}]});
 const visible=x>=view.xMin&&x<=view.xMax&&table47Value(x)>=view.yMin&&table47Value(x)<=view.yMax;
 return <LessonCartesianGraph title="Table of Values" description="Output is calculated from x. Drag the orange point horizontally or use Left/Right. The blue table column follows Trace x." observation={`${table47Summary(x,trace)}.${visible?'':' Use Fit to bring the selected point into view.'}`} view={view} onViewChange={onViewChange} onResetView={()=>onViewChange(TABLE_47_VIEW)} series={series} showTickLabels={showGuides} annotations={[
  ...(showGuides?[{id:'trace',x:trace,y:table47Value(trace),label:`Trace (${trace}, ${table47Value(trace)})`,color:'#14a8bd',testId:'table-trace-47'}]:[]),
  {id:'selected',x,y:table47Value(x),label:`(${x}, ${table47Value(x)})`,color:'#f97316',testId:'table-selected-47',keyboardStep:.5,onChange:p=>onXChange(snap(p.x))},
 ]}/>;
}
