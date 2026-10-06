import GeometrySmartbar from "./GeometrySmartbar";
import { forwardRef, useState, useRef, useEffect, useLayoutEffect, type SVGProps, type ReactNode } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import WorkspaceSvg from "../../components/workspace/WorkspaceSvg";
import { nativeLessonScene, type LessonScene, type LessonPoint } from "./geometryLessonScene";
import { withLessonOverlays } from "./geometryLessonOverlays";
import { lessonViewBox } from "./lessonViewBox";
import "./geometryEmbeddedWorkspace.css";

type Props = SVGProps<SVGSVGElement> & {
  scene: LessonScene;
  presentation?: ReactNode;
  activityId?: string;
  showToolbar?: boolean;
  showFullWorkspace?: boolean;
  fitObjects?: boolean;
  pointStep?: number;
  editablePointIds?: string[];
  onPointChange?: (id: string, point: LessonPoint) => void;
};

/** The lesson canvas and its object controls share the same live construction. */
const GeometryLessonCanvas = forwardRef<SVGSVGElement, Props>(function GeometryLessonCanvas({ scene, activityId, onPointChange, presentation, children, showToolbar = true, showFullWorkspace = true, fitObjects = true, pointStep = 0.1, editablePointIds, ...props }, ref) {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const identity = `${pathname}:${params.toString()}:${activityId ?? "canvas"}`;
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState("");
  const [zoom,setZoom] = useState(1);
  const [contrast,setContrast] = useState(false);
  const [largeLabels,setLargeLabels] = useState(false);
  const [compact,setCompact] = useState(true);
  const baseBox = fitObjects ? lessonViewBox(scene) : (props.viewBox ?? "0 0 640 460");
  const [bx,by,bw,bh] = baseBox.split(/[ ,]+/).map(Number);
  const viewBox = `${bx+bw*(1-1/zoom)/2} ${by+bh*(1-1/zoom)/2} ${bw/zoom} ${bh/zoom}`;
  useEffect(() => {
    const canvas=canvasRef.current;
    if(!canvas)return;
    const wheel=(event:WheelEvent)=>{
      if((event.target as Element).closest("button,input,select,.geo-smartbar-menu"))return;
      event.preventDefault();event.stopPropagation();setZoom(value=>Math.max(.5,Math.min(3,value*Math.exp(-event.deltaY*.002))));
    };
    canvas.addEventListener("wheel",wheel,{passive:false,capture:true});
    return ()=>canvas.removeEventListener("wheel",wheel,true);
  },[]);
  useLayoutEffect(()=>{
    const svg=canvasRef.current?.querySelector<SVGSVGElement>('svg[data-workspace-presentation]');
    if(!svg)return;
    const update=()=>{
      const rect=svg.getBoundingClientRect();const box=svg.viewBox.baseVal;
      if(!rect.width||!rect.height)return;
      const unitsPerPixel=Math.max(box.width/rect.width,box.height/rect.height);
      svg.querySelectorAll('text').forEach(text=>{
        const original=Number(text.dataset.labelFontSize??parseFloat(getComputedStyle(text).fontSize));
        text.dataset.labelFontSize=String(original);
        text.style.fontSize=`${Math.max(original,(largeLabels?18:13)*unitsPerPixel)}px`;
        text.style.paintOrder='stroke';text.style.stroke='#fff';text.style.strokeWidth=`${2*unitsPerPixel}px`;text.style.strokeLinejoin='round';
      });
    };
    update();const observer=new ResizeObserver(update);observer.observe(svg);return()=>observer.disconnect();
  },[viewBox,children,largeLabels]);
  const points = scene.construction.points.filter(p => p.label && p.style?.labelMode !== "hidden" && p.style?.visible !== false && (!editablePointIds || editablePointIds.includes(p.id)) && !scene.construction.constraints.some(c => (c.type === "midpoint" || c.type === "affine") && c.point === p.id));
  const point = points.find(p => p.id === selected) ?? points[0];
  const move = (dx: number, dy: number) => {
    if (point) onPointChange?.(point.id, { x: point.x + dx * scene.unitScale * pointStep, y: point.y + dy * scene.unitScale * pointStep });
  };
  return <div ref={canvasRef} onKeyDownCapture={event=>{
    if(/INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement).tagName))return;
    if(event.key==='+'||event.key==='='||event.key==='-'||event.key==='0'){
      event.preventDefault();event.stopPropagation();setZoom(value=>event.key==='0'?1:Math.max(.5,Math.min(3,value+(event.key==='-'?-.2:.2))));
    }
  }} className={`geo-lesson-workspace geo-smart-canvas ${contrast?"is-contrast":""} ${largeLabels?"has-large-labels":""} ${compact?"is-compact":""}`} data-workspace-type="2d-geometry" data-workspace-activity={identity}>
    <GeometrySmartbar zoom={zoom} onZoom={setZoom} contrast={contrast} onContrast={()=>setContrast(v=>!v)} largeLabels={largeLabels} onLabels={()=>setLargeLabels(v=>!v)} compact={compact} onCompact={()=>setCompact(v=>!v)}/>
    {showToolbar && <div className="geo-lesson-workspace-tools" role="toolbar" aria-label="Graph object controls">
      {onPointChange && point ? <>
        <label>Point <select aria-label="Point to move" value={point.id} onChange={event => setSelected(event.target.value)}>{points.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
        <button type="button" aria-label="Move point left" onClick={() => move(-1, 0)}>←</button>
        <button type="button" aria-label="Move point up" onClick={() => move(0, -1)}>↑</button>
        <button type="button" aria-label="Move point down" onClick={() => move(0, 1)}>↓</button>
        <button type="button" aria-label="Move point right" onClick={() => move(1, 0)}>→</button>
      </> : <span>Use the lab controls to change the figure</span>}
      {showFullWorkspace && <button type="button" className="geo-open-full" onClick={() => navigate("/workspace/geometry", { state: { embeddedWorkspaceScene: nativeLessonScene(withLessonOverlays(scene, children)) } })}>Full workspace</button>}
    </div>}
    <div className="geo-lesson-presentation">{presentation ?? <WorkspaceSvg {...props} viewBox={viewBox} preserveAspectRatio="xMidYMid meet" ref={ref} data-workspace-presentation="lesson">{children}</WorkspaceSvg>}</div>
  </div>;
});
export default GeometryLessonCanvas;
