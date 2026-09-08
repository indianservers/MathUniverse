import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {LessonPolarGrid} from "./LessonPolarGrid";
import { zoomGraphView } from "../../../graph-studio/graphViewUtils";
import { LessonGraphWorkspace, type LessonGraphLegendItem } from "./LessonGraphWorkspace";
import { lessonGraphCaptionY, lessonGraphLabelLines, lessonGraphProjection, lessonGraphSegments, lessonGraphTicks, panLessonGraph, type LessonGraphPoint, type LessonGraphView } from "./lessonGraphGeometry";

export type LessonGraphSeries = { id: string; label: string; color: string; points: readonly (LessonGraphPoint | null)[]; dashed?: boolean; dashPattern?: string; kind?: "line" | "points" | "region"; opacity?: number };
export type LessonGraphAnnotation = LessonGraphPoint & { id: string; label: string; color: string; included?: boolean; testId?: string; onChange?: (point: LessonGraphPoint) => void; keyboardStep?: number };

/** Sampled-function / Cartesian-geometry adapter. No expression parsing or lesson calculations. */
export function LessonCartesianGraph({ title, description, view, onViewChange, onResetView, series, annotations = [], legend, aspectRatio = 1.5, xLabel = 'x', unitAspectRatio, onProbe, showTickLabels=true, observation, grid='cartesian' }: {
  title: string;
  description?: string;
  observation?: ReactNode;
  grid?: 'cartesian'|'polar';
  view: LessonGraphView;
  onViewChange?: (view: LessonGraphView) => void;
  onResetView?: () => void;
  series: LessonGraphSeries[];
  annotations?: LessonGraphAnnotation[];
  legend?: LessonGraphLegendItem[];
  aspectRatio?: number;
  xLabel?: string;
  /** Pixels per x unit divided by pixels per y unit, when the source fixes this ratio. */
  unitAspectRatio?: number;
  onProbe?: (point:LessonGraphPoint)=>void;
  showTickLabels?: boolean;
}) {
  const id=useId();
  const frame=useRef<HTMLDivElement>(null);
  const svg=useRef<SVGSVGElement>(null);
  const [width,setWidth]=useState(600);
  const [selected,setSelected]=useState<string|null>(null);
  const drag=useRef<{pointerId:number;clientX:number;clientY:number;view:LessonGraphView}|null>(null);
  const height=Math.max(260,Math.min(480,width/aspectRatio));
  const margin={left:48,right:24,top:24,bottom:40};
  if(unitAspectRatio&&Number.isFinite(unitAspectRatio)&&unitAspectRatio>0){
    const ratio=(view.xMax-view.xMin)/(view.yMax-view.yMin)*unitAspectRatio;
    const availableWidth=width-margin.left-margin.right,availableHeight=height-margin.top-margin.bottom;
    if(availableWidth/availableHeight>ratio){const inset=(availableWidth-availableHeight*ratio)/2;margin.left+=inset;margin.right+=inset;}
    else {const inset=(availableHeight-availableWidth/ratio)/2;margin.top+=inset;margin.bottom+=inset;}
  }
  const plotWidth=Math.max(1,width-margin.left-margin.right), plotHeight=height-margin.top-margin.bottom;
  const projection=lessonGraphProjection(view,plotWidth,plotHeight);
  const xTicks=lessonGraphTicks(view.xMin,view.xMax,Math.max(3,plotWidth/85));
  const yTicks=lessonGraphTicks(view.yMin,view.yMax,Math.max(3,plotHeight/65));
  const px=(x:number)=>projection.toScreen({x,y:0}).x+margin.left;
  const py=(y:number)=>projection.toScreen({x:0,y}).y+margin.top;
  const inView=(p:LessonGraphPoint)=>p.x>=view.xMin&&p.x<=view.xMax&&p.y>=view.yMin&&p.y<=view.yMax;
  const selectedPoint=annotations.find(p=>p.id===selected);
  const visibleAnnotations=annotations.filter(inView);
  const labelPositions: Array<{x:number;y:number;width:number;height:number;lines:string[]}>=[];
  for(const point of visibleAnnotations) {
    const lines=lessonGraphLabelLines(point.label,plotWidth/8);
    const labelWidth=Math.max(...lines.map(line=>line.length))*8;
    const labelHeight=lines.length*18;
    const labelX=Math.max(margin.left,Math.min(width-margin.right-labelWidth,px(point.x)+12));
    const labelY=lessonGraphCaptionY(py(point.y)-14-(lines.length-1)*18,margin.top+16,height-margin.bottom-labelHeight+16,labelHeight,labelX,labelWidth,labelPositions);
    labelPositions.push({x:labelX,y:labelY,width:labelWidth,height:labelHeight,lines});
  }
  useEffect(()=>{
    if(!frame.current) return;
    const observer=new ResizeObserver(entries=>setWidth(Math.max(180,entries[0].contentRect.width)));
    observer.observe(frame.current);
    return ()=>observer.disconnect();
  },[]);
  const pointFromPointer=(clientX:number,clientY:number)=>{
    const rect=svg.current!.getBoundingClientRect();
    return projection.toWorld({x:(clientX-rect.left)*width/rect.width-margin.left,y:(clientY-rect.top)*height/rect.height-margin.top});
  };
  const zoom=(factor:number)=>onViewChange?.(zoomGraphView(view,factor));
  return <LessonGraphWorkspace title={title} description={description} observation={observation}
    legend={legend??series.map(s=>({id:s.id,label:s.label,color:s.color,dashed:s.dashed||Boolean(s.dashPattern),kind:s.kind==='points'?'point' as const:s.kind==='region'?'region' as const:'line' as const}))}
    navigation={onViewChange&&onResetView?{zoomIn:()=>zoom(.8),zoomOut:()=>zoom(1.25),reset:onResetView,canZoomIn:view.xMax-view.xMin>1e-6,canZoomOut:view.xMax-view.xMin<1e8}:undefined}>
    <div ref={frame} className="lesson-cartesian-frame" data-graph-family={grid} data-x-min={view.xMin} data-x-max={view.xMax} data-y-min={view.yMin} data-y-max={view.yMax} data-plot-left={margin.left} data-plot-top={margin.top} data-plot-width={plotWidth} data-plot-height={plotHeight}>
      <svg ref={svg} viewBox={`0 0 ${width} ${height}`} className="lesson-cartesian-canvas" role="img" aria-label={title} aria-describedby={`${id}-help`} tabIndex={0}
        style={{touchAction:onViewChange||onProbe?"none":"pan-y"}}
        onKeyDown={event=>{
          if(event.target!==event.currentTarget||!onViewChange) return;
          const dx=(view.xMax-view.xMin)*.1,dy=(view.yMax-view.yMin)*.1;
          if(event.key==='+'||event.key==='=') zoom(.8);
          else if(event.key==='-') zoom(1.25);
          else if(event.key==='0'&&onResetView) onResetView();
          else if(event.key==='ArrowLeft') onViewChange(panLessonGraph(view,-dx,0));
          else if(event.key==='ArrowRight') onViewChange(panLessonGraph(view,dx,0));
          else if(event.key==='ArrowUp') onViewChange(panLessonGraph(view,0,dy));
          else if(event.key==='ArrowDown') onViewChange(panLessonGraph(view,0,-dy));
          else return;
          event.preventDefault();
        }}
        onPointerDown={event=>{
          if((!onViewChange&&!onProbe)||event.button!==0) return;
          drag.current={pointerId:event.pointerId,clientX:event.clientX,clientY:event.clientY,view};
          event.currentTarget.setPointerCapture(event.pointerId);
          onProbe?.(pointFromPointer(event.clientX,event.clientY));
        }}
        onPointerMove={event=>{
          const start=drag.current;
          if(!start||start.pointerId!==event.pointerId) return;
          if(onProbe){onProbe(pointFromPointer(event.clientX,event.clientY));return;}
          if(!onViewChange)return;
          const rect=event.currentTarget.getBoundingClientRect();
          const dx=-(event.clientX-start.clientX)*width/rect.width/plotWidth*(start.view.xMax-start.view.xMin);
          const dy=(event.clientY-start.clientY)*height/rect.height/plotHeight*(start.view.yMax-start.view.yMin);
          onViewChange(panLessonGraph(start.view,dx,dy));
        }}
        onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}>
        <desc>{onViewChange?"Drag to pan. Use + and − to zoom, arrow keys to pan, and 0 to reset. ":""}Select a labelled point for its coordinates.</desc>
        <defs><clipPath id={`${id}-clip`}><rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight}/></clipPath></defs>
        {grid==='polar'?<LessonPolarGrid view={view} px={px} py={py} xScale={plotWidth/(view.xMax-view.xMin)} yScale={plotHeight/(view.yMax-view.yMin)} clipId={`${id}-clip`} showLabels={showTickLabels}/>:<g className="lesson-cartesian-grid">{xTicks.map(x=><line key={`x${x}`} x1={px(x)} y1={margin.top} x2={px(x)} y2={height-margin.bottom}/>)}{yTicks.map(y=><line key={`y${y}`} x1={margin.left} y1={py(y)} x2={width-margin.right} y2={py(y)}/>)}</g>}
        <g className="lesson-cartesian-axes">
          {view.yMin<=0&&view.yMax>=0&&<line x1={margin.left} y1={py(0)} x2={width-margin.right} y2={py(0)}/>}
          {view.xMin<=0&&view.xMax>=0&&<line x1={px(0)} y1={margin.top} x2={px(0)} y2={height-margin.bottom}/>}
        </g>
        <g className="lesson-cartesian-ticks">{grid==='cartesian'&&showTickLabels&&xTicks.map(x=><text key={`x${x}`} x={px(x)} y={height-16} textAnchor="middle">{x}</text>)}{grid==='cartesian'&&showTickLabels&&yTicks.map(y=><text key={`y${y}`} x={margin.left-8} y={py(y)+5} textAnchor="end">{y}</text>)}<text x={width-12} y={height-16}>{xLabel}</text><text x={margin.left-8} y={15}>y</text></g>
        <g clipPath={`url(#${id}-clip)`}>
          {series.map(s=><g key={s.id} opacity={s.opacity??1} data-series-id={s.id}>{lessonGraphSegments(s.points).map((segment,i)=>s.kind==='points'?segment.map((p,j)=><circle key={j} cx={px(p.x)} cy={py(p.y)} r={4} fill={s.color}><title>{s.label}: ({p.x}, {p.y})</title></circle>):s.kind==='region'?<polygon key={i} points={segment.map(p=>`${px(p.x)},${py(p.y)}`).join(' ')} fill={s.color} opacity={.2}/>:<polyline key={i} points={segment.map(p=>`${px(p.x)},${py(p.y)}`).join(' ')} fill="none" stroke={s.color} strokeWidth={3} strokeDasharray={s.dashPattern??(s.dashed?'7 5':undefined)}/>)}</g>)}
        </g>
        {visibleAnnotations.map((p,index)=><g key={p.id}>
          <line className="lesson-cartesian-label-leader" x1={px(p.x)} y1={py(p.y)} x2={Math.max(labelPositions[index].x,Math.min(labelPositions[index].x+labelPositions[index].width,px(p.x)))} y2={Math.max(labelPositions[index].y-14,Math.min(labelPositions[index].y-14+labelPositions[index].height,py(p.y)))}/>
          <circle data-testid={p.testId} data-included={p.included} cx={px(p.x)} cy={py(p.y)} r={8} fill={p.included===false?'var(--lg-paper)':p.color} stroke={p.included===false?p.color:'var(--lg-paper)'} strokeWidth={2} role="button" tabIndex={0} aria-label={`${p.label}: (${p.x}, ${p.y})`} aria-pressed={selected===p.id}
            onClick={()=>setSelected(p.id)} onFocus={()=>setSelected(p.id)}
            onKeyDown={event=>{
              if(event.key==='Enter'||event.key===' ') {event.preventDefault();setSelected(p.id);return;}
              if(!p.onChange) return;
              const step=p.keyboardStep??.1;
              const delta=event.key==='ArrowLeft'?[-step,0]:event.key==='ArrowRight'?[step,0]:event.key==='ArrowUp'?[0,step]:event.key==='ArrowDown'?[0,-step]:null;
              if(delta){event.preventDefault();event.stopPropagation();p.onChange({x:p.x+delta[0],y:p.y+delta[1]});}
            }}
            onPointerDown={event=>{if(p.onChange||!onProbe)event.stopPropagation();if(p.onChange)event.currentTarget.setPointerCapture(event.pointerId);}}
            onPointerMove={event=>{if(p.onChange&&event.currentTarget.hasPointerCapture(event.pointerId))p.onChange(pointFromPointer(event.clientX,event.clientY));}}>
            <title>{p.label}: ({p.x}, {p.y})</title>
          </circle>
          <text className="lesson-cartesian-annotation" x={labelPositions[index].x} y={labelPositions[index].y}>{labelPositions[index].lines.map((line,lineIndex)=><tspan key={lineIndex} x={labelPositions[index].x} dy={lineIndex===0?0:18}>{line}</tspan>)}</text>
        </g>)}
      </svg>
      <p id={`${id}-help`} className="sr-only">{onProbe?'Click or drag in the graph to move the lesson probe. ':''}{onViewChange?'Focus the graph and use arrow keys to pan, plus or minus to zoom, and zero to reset the view. ':''}Tab to a point to inspect its coordinates.</p>
      {selectedPoint&&<output className="lesson-graph-tooltip" aria-live="polite">{selectedPoint.label}: ({selectedPoint.x}, {selectedPoint.y})</output>}
    </div>
  </LessonGraphWorkspace>;
}





