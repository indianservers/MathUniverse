import { ArrowLeft, MoreVertical, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./anscombe-quartet-mobile.css";

const xs = [10,8,13,9,11,14,6,4,12,7,5];
const sets = [
  [8.04,6.95,7.58,8.81,8.33,9.96,7.24,4.26,10.84,4.82,5.68],
  [9.14,8.14,8.74,8.77,9.26,8.1,6.13,3.1,9.13,7.26,4.74],
  [7.46,6.77,12.74,7.11,7.81,8.84,6.08,5.39,8.15,6.42,5.73],
  [7.58,5.76,7.71,8.84,8.47,7.04,5.25,12.5,6.89,5.56,7.91],
];
const colors = ["#f16048","#eaa20b","#0ba9c0","#5152c5"];

function Plot({ index, selectedX, active, onSelect }: { index: number; selectedX: number; active: boolean; onSelect: () => void }) {
  const ox = index % 2 ? 205 : 14, oy = index > 1 ? 282 : 32, w = 170, h = 208;
  const Xp = (x: number) => ox + (x - 3) / 15 * w, Yp = (y: number) => oy + h - (y - 3) / 11 * h;
  return <g role="button" tabIndex={0} aria-label={`Inspect Anscombe data set ${index + 1}`} aria-pressed={active} onClick={onSelect} className={active ? "quartet-plot active" : "quartet-plot"}>
    <rect x={ox} y={oy} width={w} height={h} rx="8" />
    {[4,8,12,16].map((x) => <line key={x} className="grid" x1={Xp(x)} y1={oy} x2={Xp(x)} y2={oy+h} />)}
    {[4,7,10,13].map((y) => <line key={y} className="grid" x1={ox} y1={Yp(y)} x2={ox+w} y2={Yp(y)} />)}
    <line className="regression" x1={Xp(3)} y1={Yp(4.5)} x2={Xp(18)} y2={Yp(12)} />
    <line className="crosshair" x1={Xp(selectedX)} y1={oy} x2={Xp(selectedX)} y2={oy+h} />
    {sets[index].map((y, i) => <circle key={i} cx={Xp(index === 3 ? (i === 7 ? 19 : 8) : xs[i])} cy={Yp(y)} r="4.5" fill={colors[index]} />)}
    <circle className="badge" cx={ox+12} cy={oy-10} r="12" fill={colors[index]} /><text className="badge-text" x={ox+12} y={oy-5}>{["I","II","III","IV"][index]}</text>
  </g>;
}

export default function AnscombeQuartetMobileProof() {
  const navigate = useNavigate();
  const [selectedX, setSelectedX] = useState(10);
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const reset = () => { setSelectedX(10); setActive(0); setMenuOpen(false); };
  return <main className="quartet-mobile">
    <header><button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button><h1>Anscombe’s Quartet</h1><p>22 / 69</p><button onClick={() => setMenuOpen((value) => !value)} aria-label="Lesson options"><MoreVertical /></button></header>
    <section className="quartet-stage"><svg viewBox="0 0 390 530" aria-label={`Four data sets with mean x 9, mean y 7.5, correlation 0.816; selected x ${selectedX.toFixed(1)}`}>
      {[0,1,2,3].map((index) => <Plot key={index} index={index} selectedX={selectedX} active={active===index} onSelect={() => setActive(index)} />)}
    </svg></section>
    <section className="quartet-stats"><div><span>x̄</span><strong>9.00</strong></div><div><span>ȳ</span><strong>7.50</strong></div><div><span>r</span><strong>0.816</strong></div></section>
    <label className="quartet-slider"><span>x</span><input aria-label="Shared x inspection line" type="range" min="4" max="18" step=".5" value={selectedX} onChange={(event) => setSelectedX(Number(event.target.value))} /><output>{selectedX.toFixed(1)}</output></label>
    {menuOpen ? <aside role="dialog"><button onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button><h2>Same summaries, different stories</h2><p>All four sets share nearly the same means, variances, correlation, and regression line. Their plots reveal curvature, an outlier, and leverage that the summaries hide.</p><button onClick={reset} aria-label="Reset Anscombe quartet"><RotateCcw /> Reset</button></aside> : null}
  </main>;
}
