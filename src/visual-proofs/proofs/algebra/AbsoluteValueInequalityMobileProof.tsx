import { ArrowLeft, MoreVertical, RotateCcw, X as Close } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./absolute-value-inequality-mobile.css";

export default function AbsoluteValueInequalityMobileProof() {
  const navigate = useNavigate();
  const [radius, setRadius] = useState(3);
  const [xValue, setXValue] = useState(0.8);
  const [inside, setInside] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<"x" | "r" | null>(null);

  const origin = 195;
  const unit = 47;
  const left = origin - radius * unit;
  const right = origin + radius * unit;
  const xPosition = origin + xValue * unit;
  const relationHolds = inside ? Math.abs(xValue) < radius : Math.abs(xValue) > radius;
  const fmt = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(1);

  const updatePointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svgRef.current) return;
    const matrix = svgRef.current.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    if (dragging.current === "x") {
      setXValue(Math.max(-4.8, Math.min(4.8, (point.x - origin) / unit)));
    } else {
      setRadius(Math.max(1, Math.min(4.5, Math.abs(point.x - origin) / unit)));
    }
  };

  const nudge = (kind: "x" | "r") => (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 0.1 : -0.1;
    if (kind === "x") setXValue((value) => Math.max(-4.8, Math.min(4.8, value + delta)));
    else setRadius((value) => Math.max(1, Math.min(4.5, value + delta)));
  };

  const reset = () => {
    setRadius(3);
    setXValue(0.8);
    setInside(true);
    setMenuOpen(false);
  };

  return (
    <main className="absolute-mobile">
      <header>
        <button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
        <h1>Absolute-Value Inequality</h1>
        <p>15 / 69</p>
        <button onClick={() => setMenuOpen((value) => !value)} aria-label="Lesson options"><MoreVertical /></button>
      </header>

      <section className="absolute-stage">
        <svg
          ref={svgRef}
          viewBox="0 0 390 760"
          onPointerMove={updatePointer}
          onPointerUp={() => { dragging.current = null; }}
          onPointerCancel={() => { dragging.current = null; }}
        >
          <defs>
            <marker id="abs-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M8 0 0 4 8 8Z" fill="#1f2a34" /></marker>
          </defs>

          <line className="axis" x1="28" y1="170" x2="362" y2="170" markerStart="url(#abs-arrow)" markerEnd="url(#abs-arrow)" />
          {[-4,-3,-2,-1,0,1,2,3,4].map((tick) => <line key={tick} className="tick" x1={origin + tick * unit} y1={tick === 0 ? 158 : 164} x2={origin + tick * unit} y2={tick === 0 ? 182 : 176} />)}
          <text className="zero" x={origin} y="199">0</text>

          <line className="guide" x1={left} y1="170" x2={left} y2="365" />
          <line className="guide" x1={right} y1="170" x2={right} y2="365" />
          <text className="bound" x={left} y="205">−r</text>
          <text className="bound" x={right} y="205">r</text>

          <g
            className="radius-handle"
            role="slider"
            tabIndex={0}
            aria-label="Radius r"
            aria-valuemin={1}
            aria-valuemax={4.5}
            aria-valuenow={Number(radius.toFixed(1))}
            onPointerDown={(event) => { dragging.current = "r"; event.currentTarget.setPointerCapture(event.pointerId); }}
            onKeyDown={nudge("r")}
          >
            <circle cx={left} cy="170" r="12" /><circle cx={right} cy="170" r="12" />
          </g>

          <line className="x-track" x1={left} y1="275" x2={right} y2="275" />
          <g
            className="x-handle"
            role="slider"
            tabIndex={0}
            aria-label="Value x"
            aria-valuemin={-4.8}
            aria-valuemax={4.8}
            aria-valuenow={Number(xValue.toFixed(1))}
            onPointerDown={(event) => { dragging.current = "x"; event.currentTarget.setPointerCapture(event.pointerId); }}
            onKeyDown={nudge("x")}
          >
            <circle cx={xPosition} cy="275" r="16" />
            <text x={xPosition} y="245">x</text>
          </g>

          <line className="distance" x1={origin} y1="346" x2={xPosition} y2="346" />
          <line className="distance-cap" x1={origin} y1="337" x2={origin} y2="355" />
          <line className="distance-cap" x1={xPosition} y1="337" x2={xPosition} y2="355" />
          <text className="distance-label" x={(origin + xPosition) / 2} y="378">|x| = {fmt(Math.abs(xValue))}</text>

          <g className="mode-toggle" transform="translate(195 445)">
            <rect x="-92" y="-31" width="184" height="62" rx="16" />
            <rect className={inside ? "selected" : ""} x="-92" y="-31" width="92" height="62" rx="16" />
            <rect className={!inside ? "selected" : ""} x="0" y="-31" width="92" height="62" rx="16" />
            <line x1="0" y1="-31" x2="0" y2="31" />
            <text role="button" tabIndex={0} aria-label="Show values inside radius" aria-pressed={inside} onClick={() => setInside(true)} x="-46" y="9">&lt;</text>
            <text role="button" tabIndex={0} aria-label="Show values outside radius" aria-pressed={!inside} onClick={() => setInside(false)} x="46" y="9">&gt;</text>
          </g>

          <g className={`statement ${relationHolds ? "holds" : "fails"}`} transform="translate(195 550)">
            <rect x="-165" y="-54" width="330" height="108" rx="14" />
            <text x="0" y="-5">|x| {inside ? "<" : ">"} r</text>
            <text className="status" x="0" y="31">{relationHolds ? "TRUE for this x" : "Move x into the highlighted solution"}</text>
          </g>

          <text className="implies" x="195" y="635">⌄</text>
          <g className="solution" transform="translate(195 690)">
            <rect x="-165" y="-42" width="330" height="84" rx="14" />
            <text x="0" y="8">{inside ? `−${fmt(radius)} < x < ${fmt(radius)}` : `x < −${fmt(radius)} or x > ${fmt(radius)}`}</text>
          </g>
        </svg>
      </section>

      {menuOpen ? (
        <aside role="dialog">
          <button onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><Close /></button>
          <h2>Absolute value is distance</h2>
          <p>|x| &lt; r means x is less than r units from zero. |x| &gt; r means x lies outside the two boundary points.</p>
          <button onClick={reset} aria-label="Reset absolute value inequality"><RotateCcw /> Reset</button>
        </aside>
      ) : null}
    </main>
  );
}
