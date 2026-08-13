import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookOpen, ChevronRight, Expand, Grid3X3, Home, Menu,
  Moon, Move, Pause, Play, RotateCcw, Search, Settings, Sparkles,
  Waves as Trace, X, ZoomIn,
} from "lucide-react";
import MathExpression from "../components/ui/MathExpression";
import MainNavigation from "../components/layout/MainNavigation";
import type { FormulaVisualizerEntry, FormulaVisualizerRouteConfig } from "../data/formulaVisualizerRoutes";
import "./DerivativesFormulaStudio.css";

type LearningTab = "Visual" | "Steps" | "Intuition" | "Common Mistake";
type TopTab = "Explore" | "Formula Bank" | "Examples" | "Why it Works" | "Practice";
type Point = { x: number; y: number; ok: boolean };
type FormulaModel = {
  fn: (x: number) => number;
  df: (x: number) => number;
  functionLabel: string;
  derivativeLabel: string;
  range: { xMin: number; xMax: number; yMin: number; yMax: number };
  accent: string;
  explanation: string;
};

export default function DerivativesFormulaStudio({ config }: { config: FormulaVisualizerRouteConfig }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [a, setA] = useState(() => numberParam(searchParams.get("v_a"), 3));
  const [h, setH] = useState(() => nonZero(numberParam(searchParams.get("v_h"), 2)));
  const [selectedId, setSelectedId] = useState(config.defaultFormulaId);
  const [formulaQuery, setFormulaQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [topTab, setTopTab] = useState<TopTab>("Explore");
  const [learningTab, setLearningTab] = useState<LearningTab>("Visual");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [grid, setGrid] = useState(true);
  const [labels, setLabels] = useState(true);
  const [trace, setTrace] = useState(false);
  const [pan, setPan] = useState(false);
  const [mobileLibrary, setMobileLibrary] = useState(false);
  const [mobileControls, setMobileControls] = useState(false);

  const selected = config.formulas.find((formula) => formula.id === selectedId) ?? config.formulas[0];
  const model = useMemo(() => formulaModel(selected.id), [selected.id]);
  const fa = safe(model.fn, a), fb = safe(model.fn, a + h);
  const tangentSlope = safe(model.df, a);
  const secantSlope = Math.abs(h) < 1e-8 ? NaN : (fb - fa) / h;
  const difference = Math.abs(secantSlope - tangentSlope);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("v_a", tidy(a)); next.set("v_h", tidy(h));
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [a, h, searchParams, setSearchParams]);

  useEffect(() => {
    const nextA = numberParam(searchParams.get("v_a"), a), nextH = nonZero(numberParam(searchParams.get("v_h"), h));
    if (Math.abs(nextA - a) > 1e-9) setA(nextA);
    if (Math.abs(nextH - h) > 1e-9) setH(nextH);
  }, [a, h, searchParams]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setH((value) => {
      const next = Math.max(.01, Math.abs(value) - .025 * speed);
      if (next <= .0101) setPlaying(false);
      return Math.sign(value || 1) * next;
    }), 45);
    const visibility = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", visibility);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", visibility); };
  }, [playing, speed]);

  const resetAll = () => { setA(3); setH(2); setPlaying(false); setGrid(true); setLabels(true); setTrace(false); setPan(false); };
  const chooseTopTab = (tab: TopTab) => {
    setTopTab(tab);
    if (tab === "Formula Bank") setMobileLibrary(true);
    if (tab === "Examples") { setA(1); setH(.5); }
    if (tab === "Why it Works") setLearningTab("Steps");
    if (tab === "Practice") setLearningTab("Common Mistake");
  };

  return <main className="dfs-shell" data-testid="derivatives-formula-studio">
    <StudioSidebar />
    <div className="dfs-page">
      <StudioTopbar />
      <header className="dfs-heading"><div><div className="dfs-breadcrumb"><Home/>Home<ChevronRight/>Math<ChevronRight/>Derivatives<ChevronRight/><strong>Derivatives Formula Visualizer</strong></div><h1>Derivatives Formula Visualizer</h1><p>See every rule become a slope.</p></div><nav>{(["Explore","Formula Bank","Examples","Why it Works","Practice"] as TopTab[]).map(tab=><button className={topTab===tab?"active":""} onClick={()=>chooseTopTab(tab)} key={tab}>{tab}</button>)}</nav></header>
      <div className="dfs-mobile-actions"><button onClick={()=>setMobileLibrary(true)}><BookOpen/>Formula library</button><button onClick={()=>setMobileControls(true)}><Settings/>Controls</button></div>
      <div className="dfs-workspace">
        <FormulaLibrary config={config} selected={selected} selectedId={selectedId} query={formulaQuery} category={category} mobileOpen={mobileLibrary} onClose={()=>setMobileLibrary(false)} onQuery={setFormulaQuery} onCategory={setCategory} onSelect={(id)=>{setSelectedId(id);setMobileLibrary(false)}}/>
        <section className="dfs-studio">
          <div className="dfs-studio-header"><div className="dfs-studio-title"><i/><h2>{selected.title}</h2></div><div className="dfs-definition-row"><label>Function<select aria-label="Function model" value={selected.id} onChange={e=>setSelectedId(e.target.value)}>{config.formulas.map(f=><option value={f.id} key={f.id}>{formulaModel(f.id).functionLabel}</option>)}</select></label><div><span>Definition</span><MathExpression value={selected.latex} display/></div><strong className="dfs-slope-badge">Slope = {format(tangentSlope,3)}</strong></div></div>
          <Graph model={model} a={a} h={h} fa={fa} fb={fb} tangentSlope={tangentSlope} secantSlope={secantSlope} grid={grid} labels={labels} trace={trace} pan={pan} onA={setA} onH={setH}/>
          <div className="dfs-graph-tools"><button onClick={()=>document.dispatchEvent(new CustomEvent("dfs-zoom"))}><ZoomIn/>Zoom</button><button className={pan?"active":""} onClick={()=>setPan(v=>!v)}><Move/>Pan</button><button className={grid?"active":""} onClick={()=>setGrid(v=>!v)}><Grid3X3/>Grid</button><button className={trace?"active":""} onClick={()=>setTrace(v=>!v)}><Trace/>Trace</button><button className={labels?"active":""} onClick={()=>setLabels(v=>!v)}><span className="label-icon">A</span>Labels</button><button onClick={()=>document.querySelector<HTMLElement>(".dfs-graph-wrap")?.requestFullscreen()}><Expand/>Full screen</button><button onClick={()=>document.dispatchEvent(new CustomEvent("dfs-reset-view"))}><RotateCcw/>Reset view</button></div>
          <div className="dfs-insight"><span>ⓘ</span>As h → 0, the secant line becomes the tangent line.</div>
          <LearningTabs active={learningTab} onChange={setLearningTab} selected={selected} model={model} a={a} tangentSlope={tangentSlope}/>
        </section>
        <ControlResults a={a} h={h} fa={fa} fb={fb} tangentSlope={tangentSlope} secantSlope={secantSlope} difference={difference} playing={playing} speed={speed} mobileOpen={mobileControls} onClose={()=>setMobileControls(false)} onA={setA} onH={value=>setH(nonZero(value))} onPlaying={setPlaying} onSpeed={setSpeed} onRestart={()=>{setH(2);setPlaying(true)}} onReset={resetAll}/>
      </div>
    </div>
  </main>;
}

function StudioSidebar(){return <MainNavigation/>}
function StudioTopbar(){return <div className="dfs-topbar"><button className="dfs-menu" aria-label="Open menu"><Menu/></button><div className="dfs-search"><Search/>Search (Ctrl+K)</div><button>🔥 0</button><button>☆ 0 XP</button><button><Sparkles/>Teacher mode</button><button aria-label="Settings"><Settings/></button><button aria-label="Theme"><Moon/></button></div>}

function FormulaLibrary({config,selected,selectedId,query,category,mobileOpen,onClose,onQuery,onCategory,onSelect}:{config:FormulaVisualizerRouteConfig;selected:FormulaVisualizerEntry;selectedId:string;query:string;category:string;mobileOpen:boolean;onClose:()=>void;onQuery:(v:string)=>void;onCategory:(v:string)=>void;onSelect:(v:string)=>void}){
  const filtered=config.formulas.filter(f=>{const q=query.toLowerCase();const cat=category==="All"||(category==="Trig"?f.group.includes("Trig"):f.group===category);return cat&&(`${f.title} ${f.plainText} ${f.tags.join(" ")}`.toLowerCase().includes(q))});
  return <aside className={`dfs-library ${mobileOpen?"open":""}`}><header><h2>Formula library</h2><button onClick={onClose}><X/></button></header><label className="dfs-formula-search"><Search/><input value={query} onChange={e=>onQuery(e.target.value)} placeholder="Search formulas..."/></label><div className="dfs-filters">{["All","Rules","Trig","Applications"].map(x=><button className={category===x?"active":""} onClick={()=>onCategory(x)} key={x}>{x}</button>)}</div><div className="dfs-formula-list">{filtered.map((formula,index)=><button key={formula.id} className={selectedId===formula.id?"selected":""} onClick={()=>onSelect(formula.id)}><i className={`formula-icon f${index%4}`}>{iconText(formula.id)}</i><span><strong>{formula.title}</strong><MathExpression value={formula.latex}/><small>{formula.group} · {formula.difficulty}</small></span><ChevronRight/></button>)}{!filtered.length&&<p>No matching formulas.</p>}</div><span className="sr-only">Selected {selected.title}</span></aside>}

type GraphProps={model:FormulaModel;a:number;h:number;fa:number;fb:number;tangentSlope:number;secantSlope:number;grid:boolean;labels:boolean;trace:boolean;pan:boolean;onA:(v:number)=>void;onH:(v:number)=>void};
function Graph(props:GraphProps){const wrapRef=useRef<HTMLDivElement>(null);const [view,setView]=useState(props.model.range);const [hover,setHover]=useState<Point|null>(null);const [dragging,setDragging]=useState<"a"|"b"|"pan"|null>(null);const panStart=useRef<{x:number;range:typeof view}|null>(null);useEffect(()=>setView(props.model.range),[props.model]);useEffect(()=>{const zoom=()=>setView(v=>{const cx=(v.xMin+v.xMax)/2,span=(v.xMax-v.xMin)*.78;return{...v,xMin:cx-span/2,xMax:cx+span/2}});const reset=()=>setView(props.model.range);document.addEventListener("dfs-zoom",zoom);document.addEventListener("dfs-reset-view",reset);return()=>{document.removeEventListener("dfs-zoom",zoom);document.removeEventListener("dfs-reset-view",reset)}},[props.model]);const width=850,height=440,pad=48;const sx=(x:number)=>pad+(x-view.xMin)/(view.xMax-view.xMin)*(width-pad*2),sy=(y:number)=>height-pad-(y-view.yMin)/(view.yMax-view.yMin)*(height-pad*2),px=(clientX:number)=>{const r=wrapRef.current!.getBoundingClientRect();return view.xMin+(clientX-r.left)/r.width*(view.xMax-view.xMin)};const curve=sample(props.model.fn,view.xMin,view.xMax,700);const derivativeCurve=sample(props.model.df,view.xMin,view.xMax,600);const tangent=(x:number)=>props.fa+props.tangentSlope*(x-props.a),secant=(x:number)=>props.fa+props.secantSlope*(x-props.a);const pointerMove=(e:ReactPointerEvent<SVGSVGElement>)=>{const x=px(e.clientX);if(dragging==="a")props.onA(clamp(x,-6,10));else if(dragging==="b")props.onH(nonZero(clamp(x-props.a,-6,10)));else if(dragging==="pan"&&panStart.current){const r=wrapRef.current!.getBoundingClientRect(),dx=(e.clientX-panStart.current.x)/r.width*(view.xMax-view.xMin),s=panStart.current.range;setView({...s,xMin:s.xMin-dx,xMax:s.xMax-dx})}else if(props.trace)setHover(pointAt(props.model.fn,x))};return <div className="dfs-graph-wrap" ref={wrapRef}><svg viewBox={`0 0 ${width} ${height}`} onPointerMove={pointerMove} onPointerDown={e=>{if(props.pan){setDragging("pan");panStart.current={x:e.clientX,range:view};e.currentTarget.setPointerCapture(e.pointerId)}}} onPointerUp={e=>{setDragging(null);panStart.current=null;e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerLeave={()=>{setDragging(null);setHover(null)}} onWheel={e=>{e.preventDefault();const factor=e.deltaY>0?1.15:.86,cx=px(e.clientX),left=(cx-view.xMin)*factor,right=(view.xMax-cx)*factor;setView(v=>({...v,xMin:cx-left,xMax:cx+right}))}} aria-label="Interactive derivative graph. Drag points A and B; use the mouse wheel to zoom."><rect width={width} height={height} rx="12" fill="#071a30"/>{props.grid&&<Grid view={view} sx={sx} sy={sy} width={width} height={height} pad={pad}/>}<line x1={pad} x2={width-pad} y1={sy(0)} y2={sy(0)} className="axis"/><line x1={sx(0)} x2={sx(0)} y1={pad} y2={height-pad} className="axis"/><path d={path(curve,sx,sy,view.yMin,view.yMax)} className="function-curve"/><path d={path(derivativeCurve,sx,sy,view.yMin,view.yMax)} className="derivative-curve"/>{Number.isFinite(props.secantSlope)&&<line x1={sx(view.xMin)} y1={sy(secant(view.xMin))} x2={sx(view.xMax)} y2={sy(secant(view.xMax))} className="secant-line"/>}{Number.isFinite(props.tangentSlope)&&<line x1={sx(view.xMin)} y1={sy(tangent(view.xMin))} x2={sx(view.xMax)} y2={sy(tangent(view.xMax))} className="tangent-line"/>}<g className="change-guides"><line x1={sx(props.a)} x2={sx(props.a+props.h)} y1={sy(props.fa)} y2={sy(props.fa)}/><line x1={sx(props.a+props.h)} x2={sx(props.a+props.h)} y1={sy(props.fa)} y2={sy(props.fb)}/></g><g className="point-a" onPointerDown={e=>{e.stopPropagation();setDragging("a");e.currentTarget.setPointerCapture(e.pointerId)}}><circle cx={sx(props.a)} cy={sy(props.fa)} r="8"/><title>Drag point A: ({tidy(props.a)}, {tidy(props.fa)})</title></g><g className="point-b" onPointerDown={e=>{e.stopPropagation();setDragging("b");e.currentTarget.setPointerCapture(e.pointerId)}}><circle cx={sx(props.a+props.h)} cy={sy(props.fb)} r="8"/><title>Drag point B: ({tidy(props.a+props.h)}, {tidy(props.fb)})</title></g>{props.labels&&<GraphLabels {...props} sx={sx} sy={sy}/>} {hover?.ok&&<g className="hover-point"><circle cx={sx(hover.x)} cy={sy(hover.y)} r="5"/><text x={sx(hover.x)+9} y={sy(hover.y)-9}>({hover.x.toFixed(2)}, {hover.y.toFixed(2)})</text></g>}</svg></div>}
function GraphLabels(p:GraphProps&{sx:(x:number)=>number;sy:(y:number)=>number}){return <g className="graph-labels"><text x={p.sx(p.model.range.xMin+.6)} y={p.sy(safe(p.model.fn,p.model.range.xMin+.6))-12} className="curve-label">{p.model.functionLabel}</text><text x={p.sx(p.a)-72} y={p.sy(p.fa)-18}>A ({tidy(p.a)}, {tidy(p.fa)})</text><text x={p.sx(p.a+p.h)+13} y={p.sy(p.fb)-16}>B ({tidy(p.a+p.h)}, {tidy(p.fb)})</text><text x={(p.sx(p.a)+p.sx(p.a+p.h))/2} y={p.sy(p.fa)+24}>Δx = h = {tidy(p.h)}</text><text x={p.sx(p.a+p.h)+14} y={(p.sy(p.fa)+p.sy(p.fb))/2} className="delta-y">Δy = {tidy(p.fb-p.fa)}</text><text x={p.sx(p.a+Math.max(.5,p.h*.25))} y={p.sy(p.fa+p.tangentSlope*Math.max(.5,p.h*.25))-20} className="tangent-label">Tangent slope = {format(p.tangentSlope,2)}</text><g className="secant-badge"><rect x="668" y="326" width="150" height="76" rx="9"/><text x="683" y="350">Slope of secant</text><text x="683" y="382">Δy / Δx = {format(p.secantSlope,3)}</text></g></g>}
function Grid({view,sx,sy,width,height,pad}:{view:FormulaModel["range"];sx:(x:number)=>number;sy:(y:number)=>number;width:number;height:number;pad:number}){const xs=integerTicks(view.xMin,view.xMax),ys=integerTicks(view.yMin,view.yMax);return <g>{xs.map(x=><g key={`x${x}`}><line x1={sx(x)} x2={sx(x)} y1={pad} y2={height-pad} className="gridline"/><text x={sx(x)} y={sy(0)+20} textAnchor="middle" className="tick">{x}</text></g>)}{ys.map(y=><g key={`y${y}`}><line x1={pad} x2={width-pad} y1={sy(y)} y2={sy(y)} className="gridline"/><text x={sx(0)-9} y={sy(y)+4} textAnchor="end" className="tick">{y}</text></g>)}</g>}

function ControlResults({a,h,fa,fb,tangentSlope,secantSlope,difference,playing,speed,mobileOpen,onClose,onA,onH,onPlaying,onSpeed,onRestart,onReset}:{a:number;h:number;fa:number;fb:number;tangentSlope:number;secantSlope:number;difference:number;playing:boolean;speed:number;mobileOpen:boolean;onClose:()=>void;onA:(v:number)=>void;onH:(v:number)=>void;onPlaying:(v:boolean)=>void;onSpeed:(v:number)=>void;onRestart:()=>void;onReset:()=>void}){return <aside className={`dfs-results ${mobileOpen?"open":""}`}><header><h2>Controls &amp; results</h2><button onClick={onClose}><X/></button></header><section><h3>Controls</h3><ControlRange label="Point a" value={a} onChange={onA}/><ControlRange label="Step h" value={h} onChange={onH}/><div className="fine-step"><label><input type="checkbox"/>Fine step near zero</label></div><div className="animate-row"><span>Animate h → 0</span><div><button onClick={onRestart} title="Restart"><RotateCcw/></button><button onClick={()=>onPlaying(!playing)} title={playing?"Pause":"Play"}>{playing?<Pause/>:<Play/>}</button><select value={speed} onChange={e=>onSpeed(Number(e.target.value))}><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></div></div></section><section><h3>Live substitution</h3><div className="live-math"><span>[f({tidy(a+h)}) − f({tidy(a)})] / {tidy(h)}</span><span>= ({tidy(fb)} − {tidy(fa)}) / {tidy(h)}</span><strong>= {format(secantSlope,4)}</strong></div></section><section><h3>Comparison</h3><div className="comparison"><div><span>Secant slope</span><strong>{format(secantSlope,3)}</strong></div><i>VS</i><div><span>Tangent slope</span><strong>{format(tangentSlope,3)}</strong></div></div><div className="difference"><span>Difference</span><b>{format(difference,4)}</b><small>{difference<.05?"Converged":"Approaching tangent"}</small></div></section><button className="reset-all" onClick={onReset}><RotateCcw/>Reset all</button></aside>}
function ControlRange({label,value,onChange}:{label:string;value:number;onChange:(v:number)=>void}){return <label className="control-range"><span>{label}</span><div><input aria-label={label} type="range" min="-6" max="10" step="0.1" value={value} onChange={e=>onChange(Number(e.target.value))}/><input aria-label={`${label} numeric value`} type="number" min="-6" max="10" step="0.1" value={value} onChange={e=>onChange(Number(e.target.value))}/></div><small><i>-6</i><i>0</i><i>10</i></small></label>}

function LearningTabs({active,onChange,selected,model,a,tangentSlope}:{active:LearningTab;onChange:(v:LearningTab)=>void;selected:FormulaVisualizerEntry;model:FormulaModel;a:number;tangentSlope:number}){return <section className="dfs-learning"><nav>{(["Visual","Steps","Intuition","Common Mistake"] as LearningTab[]).map(t=><button className={active===t?"active":""} onClick={()=>onChange(t)} key={t}>{t}</button>)}</nav><div>{active==="Visual"&&<><article><b>Curve and points</b><p>The cyan curve is {model.functionLabel}. A fixes the tangent point; B defines the secant interval.</p></article><article><b>Change triangle</b><p>Dashed guides show Δx = h and Δy = f(a+h) − f(a).</p></article></>}{active==="Steps"&&<><article><b>1. Start with the definition</b><MathExpression value="f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}" display/></article><article><b>2. Simplify for the selected model</b>{selected.id==="derivative-definition"?<><MathExpression value="\frac{(a+h)^2-a^2}{h}=\frac{2ah+h^2}{h}=2a+h" display/><strong>At a = {tidy(a)} ⇒ f′(a) = {format(tangentSlope,3)}</strong></>:<><MathExpression value={selected.latex} display/><p>{model.explanation}</p></>}</article></>}{active==="Intuition"&&<article className="wide"><b>Average change becomes instantaneous change</b><p>A secant measures average change across an interval. The tangent measures the instantaneous change at a single point as the interval shrinks to zero.</p></article>}{active==="Common Mistake"&&<article className="wide warning"><b>Do not confuse secant slope with the derivative</b><p>For nonzero h, the secant slope is an approximation. The derivative is the limiting tangent slope as h → 0.</p></article>}</div></section>}

function formulaModel(id:string):FormulaModel{const base={accent:"#16c7e8"};if(id==="power-rule")return{...base,fn:x=>x**3/3,df:x=>x*x,functionLabel:"f(x) = x³/3",derivativeLabel:"f′(x) = x²",range:{xMin:-4,xMax:5,yMin:-8,yMax:16},explanation:"The power drops in front and the exponent decreases by one."};if(id==="product-rule")return{...base,fn:x=>x*Math.sin(x),df:x=>Math.sin(x)+x*Math.cos(x),functionLabel:"u·v = x sin x",derivativeLabel:"u′v + uv′",range:{xMin:-6,xMax:8,yMin:-9,yMax:9},explanation:"Both x and sin x change, so both derivative contributions are added."};if(id==="quotient-rule")return{...base,fn:x=>x/(x+2),df:x=>2/(x+2)**2,functionLabel:"u/v = x/(x+2)",derivativeLabel:"(u′v−uv′)/v²",range:{xMin:-1.7,xMax:8,yMin:-2,yMax:5},explanation:"The denominator is squared after the cross-subtraction."};if(id==="chain-rule")return{...base,fn:x=>Math.sin(x*x),df:x=>2*x*Math.cos(x*x),functionLabel:"f(g(x)) = sin(x²)",derivativeLabel:"2x cos(x²)",range:{xMin:-3,xMax:4,yMin:-4,yMax:4},explanation:"The outer cosine is multiplied by the inner derivative 2x."};if(id==="sin-derivative")return{...base,fn:Math.sin,df:Math.cos,functionLabel:"f(x) = sin x",derivativeLabel:"f′(x) = cos x",range:{xMin:-6,xMax:8,yMin:-2,yMax:2},explanation:"Cosine gives the slope of sine at every input."};if(id==="cos-derivative")return{...base,fn:Math.cos,df:x=>-Math.sin(x),functionLabel:"f(x) = cos x",derivativeLabel:"f′(x) = −sin x",range:{xMin:-6,xMax:8,yMin:-2,yMax:2},explanation:"Negative sine gives the slope of cosine."};if(id==="critical-points")return{...base,fn:x=>x**3-3*x,df:x=>3*x*x-3,functionLabel:"f(x) = x³ − 3x",derivativeLabel:"f′(x) = 3x² − 3",range:{xMin:-3,xMax:4,yMin:-8,yMax:10},explanation:"Critical points occur where the green derivative curve crosses zero."};return{...base,fn:x=>x*x,df:x=>2*x,functionLabel:"f(x) = x²",derivativeLabel:"f′(x) = 2x",range:{xMin:-7,xMax:11,yMin:-5,yMax:30},explanation:"The difference quotient simplifies to 2a+h, whose limit is 2a."}}
function iconText(id:string){return id==="derivative-definition"?"lim":id==="power-rule"?"xⁿ":id==="product-rule"?"uv":id==="quotient-rule"?"u/v":id==="chain-rule"?"f(g)":id.includes("sin")?"sin":id.includes("cos")?"cos":"f′=0"}
function sample(fn:(x:number)=>number,min:number,max:number,count:number){return Array.from({length:count},(_,i)=>pointAt(fn,min+i/(count-1)*(max-min)))}function pointAt(fn:(x:number)=>number,x:number):Point{const y=safe(fn,x);return{x,y,ok:Number.isFinite(y)&&Math.abs(y)<1e5}}function safe(fn:(x:number)=>number,x:number){try{const y=fn(x);return Number.isFinite(y)?y:NaN}catch{return NaN}}function path(points:Point[],sx:(x:number)=>number,sy:(y:number)=>number,yMin:number,yMax:number){let open=false;return points.map(p=>{if(!p.ok||p.y<yMin-3||p.y>yMax+3){open=false;return""}const c=open?"L":"M";open=true;return`${c}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`}).join(" ")}function numberParam(v:string|null,f:number){const n=Number(v);return Number.isFinite(n)?n:f}function nonZero(v:number){return Math.abs(v)<.0001?(v<0?-.01:.01):v}function tidy(v:number){return Number.isFinite(v)?Number(v.toFixed(3)).toString():"undefined"}function format(v:number,digits:number){return Number.isFinite(v)?Number(v.toFixed(digits)).toString():"undefined"}function clamp(v:number,min:number,max:number){return Math.max(min,Math.min(max,v))}function integerTicks(min:number,max:number){const step=max-min>20?5:max-min>10?2:1,values=[];for(let x=Math.ceil(min/step)*step;x<=max;x+=step)values.push(x);return values}
