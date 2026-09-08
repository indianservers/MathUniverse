import {useMemo} from 'react';
import {LessonCartesianGraph, type LessonGraphSeries} from '../../graphs/LessonCartesianGraph';
import type {LessonGraphView} from '../../graphs/lessonGraphGeometry';
import {graphVisualPresetForLesson} from '../../presets/graphVisualPresets';

export const FUNCTION_40_VIEW=graphVisualPresetForLesson(40)!.graphViewport!;
export const FUNCTION_40_RULES=[
  {id:'f',label:'f(x) = x² − 2',color:'#0898b7',evaluate:(x:number)=>x*x-2},
  {id:'g',label:'g(x) = 0.8x + 1',color:'#7c3aed',evaluate:(x:number)=>.8*x+1},
  {id:'h',label:'h(x) = sin(x)',color:'#f97316',evaluate:(x:number)=>Math.sin(x)},
];

/** Samples belong to this lesson; the shared renderer only projects them. */
export function SharedFunctionGraph40({trace,showGuides,view,onViewChange,onTraceChange,showF=true,showG=true}:{trace:number;showGuides:boolean;view:LessonGraphView;onViewChange:(view:LessonGraphView)=>void;onTraceChange:(value:number)=>void;showF?:boolean;showG?:boolean}) {
  const series=useMemo<LessonGraphSeries[]>(()=>FUNCTION_40_RULES.filter(rule=>rule.id==='f'?showF:rule.id==='g'?showG:true).map(rule=>({id:rule.id,label:rule.label,color:rule.color,points:Array.from({length:601},(_,i)=>{const x=view.xMin+(view.xMax-view.xMin)*i/600;return {x,y:rule.evaluate(x)};})})),[view,showF,showG]);
  const guides:LessonGraphSeries[]=showGuides?[{id:'trace-guide',label:`Trace x = ${trace}`,color:'#3b82f6',dashPattern:'8 8',points:[{x:trace,y:view.yMin},{x:trace,y:view.yMax}]}]:[];
  return <LessonCartesianGraph title="Function Plotter" description="Compare each function at the same x input." view={view} onViewChange={onViewChange} onResetView={()=>onViewChange(FUNCTION_40_VIEW)} showTickLabels={showGuides} series={[...series,...guides]} annotations={showGuides?FUNCTION_40_RULES.filter(rule=>rule.id==='f'?showF:rule.id==='g'?showG:true).map(rule=>({id:rule.id,x:trace,y:rule.evaluate(trace),label:`${rule.id}(${trace}) = ${rule.evaluate(trace).toFixed(3)}`,color:rule.color,testId:`function-${rule.id}-trace-40`,keyboardStep:.5,onChange:(point:{x:number;y:number})=>onTraceChange(Math.max(-5,Math.min(5,Math.round(point.x*2)/2)))})):[]}/>;
}

export const FUNCTION_40_INTERSECTIONS=FUNCTION_40_RULES.flatMap((a,i)=>FUNCTION_40_RULES.slice(i+1).map(b=>{
  const roots:{x:number;y:number}[]=[];
  const difference=(x:number)=>a.evaluate(x)-b.evaluate(x);
  for(let j=0;j<600;j++){
    let left=-6+j*.02,right=left+.02;
    if(difference(left)*difference(right)>0)continue;
    for(let k=0;k<45;k++){const mid=(left+right)/2;if(difference(left)*difference(mid)<=0)right=mid;else left=mid;}
    const x=(left+right)/2;
    if(!roots.some(p=>Math.abs(p.x-x)<1e-6))roots.push({x,y:a.evaluate(x)});
  }
  return `${a.id} & ${b.id}: ${roots.map(p=>`(${p.x.toFixed(3)}, ${p.y.toFixed(3)})`).join('; ')}`;
}));
