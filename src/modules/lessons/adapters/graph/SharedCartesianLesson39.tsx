import { LessonCartesianGraph, type LessonGraphSeries } from '../../graphs/LessonCartesianGraph';
import type { LessonGraphView } from '../../graphs/lessonGraphGeometry';
import { graphVisualPresetForLesson } from '../../presets/graphVisualPresets';

export const CARTESIAN_39_VIEW=graphVisualPresetForLesson(39)!.graphViewport!;
const snap=(value:number)=>Math.max(-5,Math.min(5,Math.round(value*2)/2));

export function SharedCartesianLesson39({primary,secondary,trace,showGuides,view,onViewChange,onPointChange}:{primary:number;secondary:number;trace:number;showGuides:boolean;view:LessonGraphView;onViewChange:(view:LessonGraphView)=>void;onPointChange:(x:number,y:number)=>void}) {
  const series:LessonGraphSeries[]=[{id:'coordinate-path',label:'x first, then y',color:'#7c3aed',dashPattern:'8 7',points:[{x:0,y:0},{x:primary,y:0},{x:primary,y:secondary}]}];
  if(showGuides)series.push({id:'trace-guide',label:'Trace x',color:'#3b82f6',dashPattern:'8 8',points:[{x:trace,y:view.yMin},{x:trace,y:view.yMax}]});
  return <LessonCartesianGraph title="Cartesian Graphing" description="Read x first (horizontal), then y (vertical)." view={view} unitAspectRatio={1} showTickLabels={showGuides} onViewChange={onViewChange} onResetView={()=>onViewChange(CARTESIAN_39_VIEW)} series={series}
    annotations={[...(showGuides?[{id:'trace',x:trace,y:secondary,label:`Trace (${trace}, ${secondary})`,color:'#14a8bd'}]:[]),{id:'point',x:primary,y:secondary,label:`P(${primary}, ${secondary})`,color:'#14a8bd',testId:'cartesian-point-39',keyboardStep:.5,onChange:point=>onPointChange(snap(point.x),snap(point.y))}]}/>;
}

