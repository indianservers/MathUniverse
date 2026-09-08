import {useMemo} from 'react';
import {LessonCartesianGraph, type LessonGraphSeries} from '../../graphs/LessonCartesianGraph';
import type {LessonGraphView, LessonGraphPoint} from '../../graphs/lessonGraphGeometry';
import {graphVisualPresetForLesson} from '../../presets/graphVisualPresets';

export const INEQUALITY_42_VIEW=graphVisualPresetForLesson(42)!.graphViewport!;
export const inequality42Upper=(x:number)=>.8*x+1;
export const inequality42Lower=(x:number)=>-.5*x+2;
export const inequality42Interval=(x:number)=>inequality42Lower(x)<inequality42Upper(x)?`${inequality42Lower(x).toFixed(3)} < y ≤ ${inequality42Upper(x).toFixed(3)}`:'No overlap';
function clipHalfPlane(polygon:LessonGraphPoint[],signedDistance:(point:LessonGraphPoint)=>number){
 const result:LessonGraphPoint[]=[];
 for(let i=0;i<polygon.length;i++){
  const a=polygon[i],b=polygon[(i+1)%polygon.length],da=signedDistance(a),db=signedDistance(b);
  if(da<=0)result.push(a);
  if((da<=0)!==(db<=0)){const t=da/(da-db);result.push({x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)});}
 }
 return result;
}
export function SharedInequalityGraph42({trace,showGuides,view,onViewChange,onTraceChange,showA=true,showB=true}:{trace:number;showGuides:boolean;view:LessonGraphView;onViewChange:(view:LessonGraphView)=>void;onTraceChange:(x:number)=>void;showA?:boolean;showB?:boolean}){
 const series=useMemo<LessonGraphSeries[]>(()=>{
  const rectangle=[{x:view.xMin,y:view.yMin},{x:view.xMax,y:view.yMin},{x:view.xMax,y:view.yMax},{x:view.xMin,y:view.yMax}];
  const a=(p:LessonGraphPoint)=>p.y-inequality42Upper(p.x),b=(p:LessonGraphPoint)=>inequality42Lower(p.x)-p.y;
  const layers:LessonGraphSeries[]=[
   {id:'region-a',label:'y ≤ 0.8x + 1',color:'#bae6fd',kind:'region',points:clipHalfPlane(rectangle,a)},
   {id:'region-b',label:'y > −0.5x + 2',color:'#ddd6fe',kind:'region',points:clipHalfPlane(rectangle,b)},
   {id:'overlap',label:'Both inequalities',color:'#5eead4',kind:'region',points:clipHalfPlane(clipHalfPlane(rectangle,a),b)},
   {id:'boundary-a',label:'A: solid, included',color:'#0898b7',points:[{x:view.xMin,y:inequality42Upper(view.xMin)},{x:view.xMax,y:inequality42Upper(view.xMax)}]},
   {id:'boundary-b',label:'B: dashed, excluded',color:'#7c3aed',dashPattern:'10 8',points:[{x:view.xMin,y:inequality42Lower(view.xMin)},{x:view.xMax,y:inequality42Lower(view.xMax)}]},
  ];
  return layers.filter(layer=>layer.id==='region-a'||layer.id==='boundary-a'?showA:layer.id==='region-b'||layer.id==='boundary-b'?showB:true);
 },[view,showA,showB]);
 const lower=inequality42Lower(trace),upper=inequality42Upper(trace),hasOverlap=lower<upper;
 const traceSeries:LessonGraphSeries[]=showGuides?[{id:'trace-guide',label:`Trace x = ${trace}`,color:'#3b82f6',dashPattern:'8 8',points:[{x:trace,y:view.yMin},{x:trace,y:view.yMax}]},...(hasOverlap?[{id:'trace-solution',label:'Solutions at trace x',color:'#0b9d78',points:[{x:trace,y:lower},{x:trace,y:upper}]}]:[])]:[];
 return <LessonCartesianGraph title="Inequality Grapher" description="The solution is below or on the solid line and strictly above the dashed line." observation={`A(1, 2) is outside the overlap: 2 ≤ 1.8 is false. At x = ${trace}: ${inequality42Interval(trace)}.${!showA||!showB?" The overlap still uses both inequalities.":""}`} view={view} onViewChange={onViewChange} onResetView={()=>onViewChange(INEQUALITY_42_VIEW)} showTickLabels={showGuides} series={[...series,...traceSeries]} legend={[...(showA?[{id:'a',label:'y ≤ 0.8x + 1 (included)',color:'#0898b7'}]:[]),...(showB?[{id:'b',label:'y > −0.5x + 2 (excluded)',color:'#7c3aed',dashed:true}]:[]),{id:'overlap',label:'Overlap: both inequalities',color:'#0b9d78'}]} annotations={[
 {id:'sample',x:1,y:2,label:'Sample A(1, 2)',color:'#f97316',testId:'inequality-sample-42'},
 ...(showGuides&&showA?[{id:'upper',x:trace,y:upper,label:`A (${trace}, ${upper.toFixed(3)})`,color:'#0898b7',included:true,testId:'inequality-upper-42',keyboardStep:.5,onChange:(p:LessonGraphPoint)=>onTraceChange(Math.max(-5,Math.min(5,Math.round(p.x*2)/2)))}]:[]),...(showGuides&&showB?[{id:'lower',x:trace,y:lower,label:`B (${trace}, ${lower.toFixed(3)})`,color:'#7c3aed',included:false,testId:'inequality-lower-42',keyboardStep:.5,onChange:(p:LessonGraphPoint)=>onTraceChange(Math.max(-5,Math.min(5,Math.round(p.x*2)/2)))}]:[])
 ]}/>;
}
