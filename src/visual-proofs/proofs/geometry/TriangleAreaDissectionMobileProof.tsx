import { ArrowLeft, MoreVertical, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./triangle-area-dissection-mobile.css";

type DragMode = "shear" | "height" | null;
const DEFAULT_APEX = { x: 195, y: 72 };

export default function TriangleAreaDissectionMobileProof() {
  const navigate = useNavigate();
  const [apex, setApex] = useState(DEFAULT_APEX);
  const [progress, setProgress] = useState(52);
  const [playing, setPlaying] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const dragMode = useRef<DragMode>(null);
  const lastFrame = useRef<number | null>(null);
  const baseY = 276;
  const height = baseY - apex.y;
  const rectangleHeight = Math.max(72, Math.min(112, height / 2));
  const rectangleTop = 548 - rectangleHeight;

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const animate = (time: number) => {
      if (lastFrame.current === null) lastFrame.current = time;
      const elapsed = time - lastFrame.current;
      lastFrame.current = time;
      setProgress((value) => {
        const next = value + elapsed / 520;
        return next >= 100 ? 0 : next;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); lastFrame.current = null; };
  }, [playing]);

  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragMode.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 390;
    const y = ((event.clientY - rect.top) / rect.height) * 700;
    if (dragMode.current === "shear") setApex((point) => ({ ...point, x: Math.max(82, Math.min(308, x)) }));
    else setApex((point) => ({ ...point, y: Math.max(48, Math.min(172, y)) }));
  };

  const reset = () => { setApex(DEFAULT_APEX); setProgress(0); setPlaying(false); setMenuOpen(false); };

  return (
    <main className="triangle-area-mobile" aria-label="Triangle Area Dissection interactive proof">
      <header className="triangle-area-header">
        <button type="button" onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
        <div><h1>Triangle Area Dissection</h1><p>3 / 69</p></div>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Lesson options"><MoreVertical /></button>
      </header>

      <section className="triangle-area-stage" aria-label="Triangle dissection diagram">
        <svg viewBox="0 0 390 700" role="img" aria-label="A triangle of base b and height h is rearranged into a rectangle of base b and height h over two" onPointerMove={move} onPointerUp={() => { dragMode.current = null; }} onPointerCancel={() => { dragMode.current = null; }}>
          <polygon points={`${apex.x},${apex.y} 55,${baseY} 335,${baseY}`} fill="#fff8e8" fillOpacity=".58" stroke="#242d35" strokeWidth="2.6" strokeLinejoin="round" />
          <line x1={apex.x} y1={apex.y} x2={apex.x} y2={baseY} stroke="#f16b42" strokeWidth="2.3" strokeDasharray="7 7" />

          <MeasureLine x1={55} y1="302" x2={335} y2="302" color="#1983b8" label="b" labelX="195" labelY="326" />
          <MeasureLine x1={346} y1={apex.y} x2={346} y2={baseY} color="#f16b42" label="h" labelX="363" labelY={(apex.y + baseY) / 2} vertical />

          <g className="triangle-area-shear-handle" role="slider" tabIndex={0} aria-label="Shear triangle apex" aria-valuemin={82} aria-valuemax={308} aria-valuenow={Math.round(apex.x)} onPointerDown={(event) => { dragMode.current = "shear"; event.currentTarget.setPointerCapture(event.pointerId); }} onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); setApex((point) => ({ ...point, x: Math.max(82, Math.min(308, point.x + (event.key === "ArrowLeft" ? -8 : 8))) })); } }} transform={`translate(${apex.x} ${baseY})`}>
            <circle r="13" fill="#fff" stroke="#f16b42" strokeWidth="2" /><circle r="7" fill="#f16b42" />
          </g>
          <g className="triangle-area-height-handle" role="slider" tabIndex={0} aria-label="Change triangle height" aria-valuemin={104} aria-valuemax={228} aria-valuenow={Math.round(height)} onPointerDown={(event) => { dragMode.current = "height"; event.currentTarget.setPointerCapture(event.pointerId); }} onKeyDown={(event) => { if (event.key === "ArrowUp" || event.key === "ArrowDown") { event.preventDefault(); setApex((point) => ({ ...point, y: Math.max(48, Math.min(172, point.y + (event.key === "ArrowUp" ? -8 : 8))) })); } }}>
            <circle cx="346" cy={(apex.y + baseY) / 2} r="6" fill="#f16b42" />
          </g>

          <path d={`M ${apex.x - 22} 350 Q 84 366 54 454`} fill="none" stroke="#f16b42" strokeWidth="2.2" strokeDasharray="7 7" opacity={.35 + progress / 155} />
          <path d={`M ${apex.x + 22} 350 Q 306 366 336 454`} fill="none" stroke="#2697c7" strokeWidth="2.2" strokeDasharray="7 7" opacity={.35 + progress / 155} />
          <path d="M 48 445 L 54 456 L 59 443" fill="#f16b42" /><path d="M 331 443 L 336 456 L 342 445" fill="#2697c7" />

          <g className="triangle-area-ghosts" opacity={.18 + Math.abs(50 - progress) / 120}>
            <polygon points={`${apex.x},350 94,394 57,456`} fill="#ffb17d" stroke="#f16b42" />
            <polygon points={`${apex.x},350 296,394 333,456`} fill="#8ed7e8" stroke="#2697c7" />
          </g>

          <g opacity={.45 + progress / 182}>
            <rect x="55" y={rectangleTop} width="280" height={rectangleHeight} fill="#59c7e1" stroke="#242d35" strokeWidth="2.5" />
            <polygon points={`55,${rectangleTop} ${apex.x},${rectangleTop} 55,548`} fill="#ff744f" stroke="#1b78a6" strokeWidth="1.3" />
            <line x1={apex.x} y1={rectangleTop} x2="335" y2="548" stroke="#1b78a6" strokeWidth="1.5" />
          </g>
          <MeasureLine x1={55} y1="572" x2={335} y2="572" color="#1983b8" label="b" labelX="195" labelY="596" />
          <MeasureLine x1={347} y1={rectangleTop} x2={347} y2="548" color="#f16b42" label="h/2" labelX="365" labelY={(rectangleTop + 548) / 2} vertical />

          <g className="triangle-area-formula" transform="translate(195 642)"><rect x="-48" y="-29" width="96" height="58" rx="13" /><text x="0" y="3"><tspan fill="#f16b42">½</tspan><tspan fill="#1983b8"> b</tspan><tspan fill="#f16b42">h</tspan></text></g>
        </svg>
      </section>

      <section className="triangle-area-controls" aria-label="Dissection controls">
        <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause dissection" : "Play dissection"}>{playing ? <Pause /> : <Play />}</button>
        <label><span className="sr-only">Dissection progress</span><input type="range" min="0" max="100" value={Math.round(progress)} style={{ "--area-progress": `${progress}%` } as CSSProperties} onChange={(event) => { setPlaying(false); setProgress(Number(event.target.value)); }} aria-label="Dissection progress" /></label>
        <button type="button" onClick={reset} aria-label="Reset dissection"><RotateCcw /></button>
      </section>

      {menuOpen ? <section className="triangle-area-menu" role="dialog" aria-label="Lesson options"><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button><h2>Why one half?</h2><p>The two cut pieces fill a rectangle with the same base b but only half the triangle’s height. Its unchanged area is therefore b × h/2 = ½bh.</p><p>Drag the orange foot to shear the triangle; the area stays unchanged. Drag the height marker to see the rectangle’s half-height update.</p></section> : null}
    </main>
  );
}

function MeasureLine({ x1, y1, x2, y2, color, label, labelX, labelY, vertical = false }: { x1: number; y1: number | string; x2: number; y2: number | string; color: string; label: string; labelX: number | string; labelY: number | string; vertical?: boolean }) {
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.8" /><line x1={vertical ? x1 - 6 : x1} y1={vertical ? y1 : Number(y1) - 6} x2={vertical ? x1 + 6 : x1} y2={vertical ? y1 : Number(y1) + 6} stroke={color} strokeWidth="1.8" /><line x1={vertical ? x2 - 6 : x2} y1={vertical ? y2 : Number(y2) - 6} x2={vertical ? x2 + 6 : x2} y2={vertical ? y2 : Number(y2) + 6} stroke={color} strokeWidth="1.8" /><text className="triangle-area-measure-label" x={labelX} y={labelY} fill={color}>{label}</text></g>;
}
