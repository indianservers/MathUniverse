import {
  ArrowLeft,
  ArrowLeftRight,
  MoreVertical,
  RotateCcw,
  X,
} from "lucide-react";
import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import "./square-binomial-mobile.css";

export default function SquareBinomialMobileProof() {
  const navigate = useNavigate();
  const [ratio, setRatio] = useState(0.58);
  const [horizontal, setHorizontal] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const side = 286;
  const startX = 52;
  const startY = 100;
  const a = side * ratio;
  const b = side - a;
  const displayA = (10 * ratio).toFixed(1);
  const displayB = (10 * (1 - ratio)).toFixed(1);

  const updateFromPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svgRef.current) return;
    const matrix = svgRef.current.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    setRatio(Math.max(0.25, Math.min(0.75, (point.x - startX) / side)));
  };

  const changeSplitWithKeyboard = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 0.02 : -0.02;
    setRatio((value) => Math.max(0.25, Math.min(0.75, value + step)));
  };

  const reset = () => {
    setRatio(0.58);
    setHorizontal(true);
    setMenuOpen(false);
  };

  return (
    <main className="binomial-mobile">
      <header>
        <button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
        <h1>Square of a Binomial</h1>
        <p>14 / 69</p>
        <button onClick={() => setMenuOpen((value) => !value)} aria-label="Lesson options"><MoreVertical /></button>
      </header>

      <section className="binomial-stage">
        <svg
          ref={svgRef}
          viewBox="0 0 390 700"
          onPointerMove={updateFromPointer}
          onPointerUp={() => { dragging.current = false; }}
          onPointerCancel={() => { dragging.current = false; }}
          role="img"
          aria-label={`Square split into a squared, two ab rectangles, and b squared; a ${displayA}, b ${displayB}`}
        >
          <rect x={startX} y={startY} width={a} height={a} fill="#ff8582" />
          <rect x={startX + a} y={startY} width={b} height={a} fill="#ffbd58" />
          <rect x={startX} y={startY + a} width={a} height={b} fill="#ffbd58" />
          <rect x={startX + a} y={startY + a} width={b} height={b} fill="#7dd4ef" />
          <rect x={startX} y={startY} width={side} height={side} fill="none" stroke="#26343c" strokeWidth="2" />
          <line x1={startX + a} y1={startY} x2={startX + a} y2={startY + side} stroke="#26343c" strokeDasharray="6 4" />
          <line x1={startX} y1={startY + a} x2={startX + side} y2={startY + a} stroke="#26343c" strokeDasharray="6 4" />

          <text x={startX + a / 2} y={startY + a / 2}>a²</text>
          <text x={startX + a + b / 2} y={startY + a / 2}>ab</text>
          <text x={startX + a / 2} y={startY + a + b / 2}>ab</text>
          <text x={startX + a + b / 2} y={startY + a + b / 2}>b²</text>
          <text className="measure red" x={startX + a / 2} y="77">a = {displayA}</text>
          <text className="measure amber" x={startX + a + b / 2} y="77">b = {displayB}</text>

          <g
            className="binomial-drag"
            role="slider"
            tabIndex={0}
            aria-label="Split between a and b"
            aria-valuemin={25}
            aria-valuemax={75}
            aria-valuenow={Math.round(ratio * 100)}
            onPointerDown={(event) => {
              dragging.current = true;
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onKeyDown={changeSplitWithKeyboard}
          >
            <circle cx={startX + a} cy={startY - 20} r="15" />
            <ArrowLeftRight x={startX + a - 9} y={startY - 29} width="18" />
          </g>

          <g
            className="binomial-rearrange"
            transform="translate(195 465)"
            role="button"
            tabIndex={0}
            aria-label="Rotate the two ab rectangles"
            aria-pressed={!horizontal}
            onClick={() => setHorizontal((value) => !value)}
          >
            <rect x="-110" y="-35" width="220" height="70" rx="35" />
            <rect x="-82" y="-22" width="65" height="44" fill="#ffbd58" />
            <rect x="17" y="-22" width="65" height="44" fill="#ffbd58" transform={horizontal ? "" : "rotate(90 49 0)"} />
            <circle r="25" />
            <ArrowLeftRight x="-13" y="-13" width="26" />
          </g>

          <g className="binomial-formula" transform="translate(195 590)">
            <rect x="-165" y="-52" width="330" height="104" rx="12" />
            <text x="0" y="8">
              <tspan fill="#ef3d5d">(a</tspan><tspan> + </tspan><tspan fill="#167ec3">b)</tspan><tspan>² = </tspan>
              <tspan fill="#ef3d5d">a²</tspan><tspan> + 2</tspan><tspan fill="#ec8b05">ab</tspan><tspan> + </tspan><tspan fill="#167ec3">b²</tspan>
            </text>
          </g>
        </svg>
      </section>

      {menuOpen ? (
        <aside role="dialog">
          <button onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button>
          <h2>One square, four regions</h2>
          <p>The side is a+b. Its parts have areas a², ab, ab, and b², so (a+b)²=a²+2ab+b².</p>
          <button onClick={reset} aria-label="Reset binomial square"><RotateCcw /> Reset</button>
        </aside>
      ) : null}
    </main>
  );
}
