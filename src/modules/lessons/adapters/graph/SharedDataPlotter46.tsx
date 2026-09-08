import {LessonCartesianGraph, type LessonGraphSeries} from '../../graphs/LessonCartesianGraph';
import type {LessonGraphView} from '../../graphs/lessonGraphGeometry';

export const DATA_46_POINTS=[{x:2,y:68},{x:4,y:78},{x:6,y:90}] as const;
// The old score axis (-2..8) could not display the declared scores 68..90.
export const DATA_46_VIEW={xMin:-6,xMax:6,yMin:-10,yMax:100};
const mx=DATA_46_POINTS.reduce((s,p)=>s+p.x,0)/DATA_46_POINTS.length;
const my=DATA_46_POINTS.reduce((s,p)=>s+p.y,0)/DATA_46_POINTS.length;
const xx=DATA_46_POINTS.reduce((s,p)=>s+(p.x-mx)**2,0);
const yy=DATA_46_POINTS.reduce((s,p)=>s+(p.y-my)**2,0);
const xy=DATA_46_POINTS.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0);
export const DATA_46_SLOPE=xy/xx;
export const DATA_46_INTERCEPT=my-DATA_46_SLOPE*mx;
export const DATA_46_CORRELATION=xy/Math.sqrt(xx*yy);
export const data46Fit=(x:number)=>DATA_46_SLOPE*x+DATA_46_INTERCEPT;
export const data46Summary=(x:number,y:number,trace:number)=>`r = ${DATA_46_CORRELATION.toFixed(4)}; probe (${x}, ${y}), residual = ${(y-data46Fit(x)).toFixed(3)}; fit at ${trace} hours = ${data46Fit(trace).toFixed(3)}`;
const snap=(v:number)=>Math.max(-5,Math.min(5,Math.round(v*2)/2));
export function SharedDataPlotter46({x,y,trace,showGuides,view,onViewChange,onPointChange}:{x:number;y:number;trace:number;showGuides:boolean;view:LessonGraphView;onViewChange:(v:LessonGraphView)=>void;onPointChange:(x:number,y:number)=>void}){
 const series:LessonGraphSeries[]=[
  {id:'fit',label:'Least-squares fit',color:'#7c3aed',points:[{x:view.xMin,y:data46Fit(view.xMin)},{x:view.xMax,y:data46Fit(view.xMax)}]},
  {id:'observations',label:'Three recorded rows',color:'#14a8bd',kind:'points',points:DATA_46_POINTS},
 ];
 if(showGuides){
  series.push({id:'residuals',label:'Recorded residuals',color:'#cbd5e1',points:DATA_46_POINTS.flatMap(p=>[p,{x:p.x,y:data46Fit(p.x)},null])});
  series.push({id:'probe-residual',label:'Probe residual',color:'#f97316',dashed:true,points:[{x,y},{x,y:data46Fit(x)}]});
  series.push({id:'trace-guide',label:'Trace hours',color:'#3b82f6',dashPattern:'8 8',points:[{x:trace,y:view.yMin},{x:trace,y:view.yMax}]});
 }
 return <LessonCartesianGraph title="Data Plotter" description="x measures study hours; y measures quiz score. The orange comparison point is excluded from the fit." observation={`Fit: score = ${DATA_46_SLOPE.toFixed(3)} × hours + ${DATA_46_INTERCEPT.toFixed(3)}. ${data46Summary(x,y,trace)}.${trace<2||trace>6?' The trace extrapolates outside the recorded 2–6 hour range.':''}${x<0?' Negative hours are outside the study context.':''}`} view={view} onViewChange={onViewChange} onResetView={()=>onViewChange(DATA_46_VIEW)} showTickLabels={showGuides} series={series} annotations={[
  ...DATA_46_POINTS.map((p,i)=>({id:`row-${i}`,...p,label:`(${p.x}h, ${p.y})`,color:'#14a8bd',testId:`data-row-${i}-46`})),
  ...(showGuides?[{id:'trace',x:trace,y:data46Fit(trace),label:`Fit ${data46Fit(trace).toFixed(2)}`,color:'#14a8bd',testId:'data-trace-46'}]:[]),
  {id:'probe',x,y,label:`Probe (${x}, ${y})`,color:'#f97316',testId:'data-probe-46',keyboardStep:.5,onChange:p=>onPointChange(snap(p.x),snap(p.y))},
 ]}/>;
}
