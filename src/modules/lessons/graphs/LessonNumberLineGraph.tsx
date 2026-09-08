import {useEffect,useRef,useState} from 'react';
import {LessonGraphWorkspace,type LessonGraphLegendItem} from './LessonGraphWorkspace';
import {lessonGraphTicks} from './lessonGraphGeometry';

export type LessonNumberLineRegion={id:string;start:number;end:number;color:string;label:string};

/** Fixed-domain number line. The lesson supplies regions and endpoint membership. */
export function LessonNumberLineGraph({title,min,max,value,step,onChange,inputLabel,regions,boundary,legend}: {
  title:string;min:number;max:number;value?:number;step?:number;onChange?:(value:number)=>void;inputLabel?:string;
  regions:LessonNumberLineRegion[];boundary?:{value:number;included:boolean;color:string};legend?:LessonGraphLegendItem[];
}) {
  const frame=useRef<HTMLDivElement>(null),[width,setWidth]=useState(600);
  useEffect(()=>{if(!frame.current)return;const observer=new ResizeObserver(([entry])=>setWidth(entry.contentRect.width));observer.observe(frame.current);return()=>observer.disconnect();},[]);
  const position=(x:number)=>100*(x-min)/(max-min);
  return <LessonGraphWorkspace title={title} legend={legend}>
    <div ref={frame} className="lesson-number-line" data-graph-family="number-line" data-min={min} data-max={max}>
      {value!==undefined&&<output className="lesson-number-value">x = {value}</output>}
      <div className="lesson-number-band" role="img" aria-label={`Number line from ${min} to ${max}${boundary?`; boundary ${boundary.value} is ${boundary.included?'included':'excluded'}`:''}`}>
        {regions.filter(region=>region.end>min&&region.start<max).map(region=><div key={region.id} className="lesson-number-region" data-region={region.id} data-start={Math.max(min,region.start)} data-end={Math.min(max,region.end)} style={{left:`${position(Math.max(min,region.start))}%`,width:`${position(Math.min(max,region.end))-position(Math.max(min,region.start))}%`,background:region.color}}><span className="sr-only">{region.label}</span></div>)}
        <span className="lesson-number-axis"/>
        {boundary&&boundary.value>=min&&boundary.value<=max&&<i className="lesson-number-boundary" data-included={boundary.included} style={{left:`${position(boundary.value)}%`,borderColor:boundary.color,background:boundary.included?boundary.color:'var(--lg-paper)'}}><span className="sr-only">Boundary {boundary.value}</span></i>}
        {value!==undefined&&<span className="lesson-number-marker" style={{left:`${position(value)}%`}} aria-hidden="true">▼</span>}
        {lessonGraphTicks(min,max,Math.max(2,width/65)).map(tick=><span className="lesson-number-tick" key={tick} style={{left:`${position(tick)}%`}}>{tick}</span>)}
      </div>
      {onChange&&value!==undefined&&<input aria-label={inputLabel} type="range" min={min} max={max} step={step} value={value} onChange={event=>onChange(Number(event.target.value))}/>}
    </div>
  </LessonGraphWorkspace>;
}
