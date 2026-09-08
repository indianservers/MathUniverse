import { ArrowLeft, MoreVertical, RotateCcw, X } from "lucide-react";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./vector-addition-mobile.css";

type Vector = { x: number; y: number };
export default function VectorAdditionMobileProof() {
  const navigate = useNavigate();
  const [u, setU] = useState<Vector>({ x: 3, y: 2 });
  const [v, setV] = useState<Vector>({ x: 1, y: 3 });
  const [mode, setMode] = useState<"parallelogram" | "tip">("parallelogram");
  const [menuOpen, setMenuOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"u" | "sum" | null>(null);
  const origin = { x: 82, y: 410 }, unit = 53;
  const P = (vector: Vector) => ({ x: origin.x + vector.x * unit, y: origin.y - vector.y * unit });
  const sum = { x: u.x + v.x, y: u.y + v.y }, up = P(u), vp = P(v), sp = P(sum);
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svgRef.current) return;
    const matrix = svgRef.current.getScreenCTM(); if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const vector = { x: Math.max(-.5, Math.min(5, Math.round((p.x-origin.x)/unit*2)/2)), y: Math.max(-.5, Math.min(5.5, Math.round((origin.y-p.y)/unit*2)/2)) };
    if (dragging.current === "u") setU(vector); else setV({ x: vector.x-u.x, y: vector.y-u.y });
  };
  const reset = () => { setU({x:3,y:2}); setV({x:1,y:3}); setMode("parallelogram"); setMenuOpen(false); };
  const setComponent = (which: "u"|"v", key: "x"|"y", value: number) => (which==="u"?setU:setV)((current) => ({...current,[key]:value}));
  return <main className="vector-add-mobile">
    <header><button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button><div><h1>Vector Addition</h1><p>23 / 69</p></div><button onClick={() => setMenuOpen((value) => !value)} aria-label="Lesson options"><MoreVertical /></button></header>
    <section className="vector-add-stage"><svg ref={svgRef} viewBox="0 0 390 500" onPointerMove={move} onPointerUp={() => dragging.current=null} onPointerCancel={() => dragging.current=null} aria-label={`u (${u.x}, ${u.y}) plus v (${v.x}, ${v.y}) equals (${sum.x}, ${sum.y})`}>
      <defs><marker id="va-red" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 10 5 0 10Z" /></marker><marker id="va-orange" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 10 5 0 10Z" /></marker><marker id="va-blue" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 10 5 0 10Z" /></marker></defs>
      {Array.from({length:7},(_,i)=>i-1).map((n)=><g key={n}><line className="grid" x1={origin.x+n*unit} y1="60" x2={origin.x+n*unit} y2="465"/><line className="grid" x1="25" y1={origin.y-n*unit} x2="370" y2={origin.y-n*unit}/></g>)}
      <line className="axis" x1="24" y1={origin.y} x2="372" y2={origin.y}/><line className="axis" x1={origin.x} y1="465" x2={origin.x} y2="55"/>
      <polygon className="parallelogram" points={`${origin.x},${origin.y} ${up.x},${up.y} ${sp.x},${sp.y} ${vp.x},${vp.y}`} />
      <line className="u-vector" x1={origin.x} y1={origin.y} x2={up.x} y2={up.y} markerEnd="url(#va-red)"/><line className="v-vector" x1={mode==="tip"?up.x:origin.x} y1={mode==="tip"?up.y:origin.y} x2={mode==="tip"?sp.x:vp.x} y2={mode==="tip"?sp.y:vp.y} markerEnd="url(#va-orange)"/><line className="sum-vector" x1={origin.x} y1={origin.y} x2={sp.x} y2={sp.y} markerEnd="url(#va-blue)"/>
      <line className="copy" x1={up.x} y1={up.y} x2={sp.x} y2={sp.y}/><line className="copy" x1={vp.x} y1={vp.y} x2={sp.x} y2={sp.y}/>
      <text className="u-label" x={(origin.x+up.x)/2} y={(origin.y+up.y)/2+24}>u</text><text className="v-label" x={(up.x+sp.x)/2+16} y={(up.y+sp.y)/2}>v</text><text className="sum-label" x={(origin.x+sp.x)/2-15} y={(origin.y+sp.y)/2}>u+v</text>
      <g className="drag-point u" role="slider" tabIndex={0} aria-label="Vector u endpoint" aria-valuetext={`${u.x}, ${u.y}`} onPointerDown={(e)=>{dragging.current="u";e.currentTarget.setPointerCapture(e.pointerId)}}><circle cx={up.x} cy={up.y} r="11"/></g>
      <g className="drag-point v" role="slider" tabIndex={0} aria-label="Vector sum endpoint" aria-valuetext={`${sum.x}, ${sum.y}`} onPointerDown={(e)=>{dragging.current="sum";e.currentTarget.setPointerCapture(e.pointerId)}}><circle cx={sp.x} cy={sp.y} r="11"/></g>
    </svg></section>
    <section className="vector-values">{(["u","v"] as const).map((which)=><div key={which}><strong>{which}</strong>{(["x","y"] as const).map((key)=><label key={key}><span>{key}</span><input aria-label={`${which} ${key} component`} type="range" min="-.5" max="5" step=".5" value={(which==="u"?u:v)[key]} onChange={(e)=>setComponent(which,key,Number(e.target.value))}/></label>)}<output>({(which==="u"?u:v).x}, {(which==="u"?u:v).y})</output></div>)}<p><b>u+v</b> = ({sum.x}, {sum.y})</p></section>
    <nav className="vector-add-controls"><button className={mode==="parallelogram"?"active":""} onClick={()=>setMode("parallelogram")} aria-label="Show parallelogram rule" aria-pressed={mode==="parallelogram"}>▱</button><button className={mode==="tip"?"active":""} onClick={()=>setMode("tip")} aria-label="Show tip to tail rule" aria-pressed={mode==="tip"}>↗↗</button><button onClick={reset} aria-label="Reset vector addition"><RotateCcw/></button></nav>
    {menuOpen?<aside role="dialog"><button onClick={()=>setMenuOpen(false)} aria-label="Close lesson options"><X/></button><h2>Add components</h2><p>The tip-to-tail endpoint and parallelogram diagonal agree because horizontal components add and vertical components add independently.</p></aside>:null}
  </main>;
}
