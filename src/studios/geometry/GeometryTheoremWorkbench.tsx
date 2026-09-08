import { useEffect, useState } from "react";
import { useStudioMode } from "../../hooks/useStudioMode";

type Theorem = { id: string; title: string; category: string; statement: string; given: string; prove: string; steps: string[]; related: string[] };
const f = (value: number) => value.toFixed(3);
export default function GeometryTheoremWorkbench({ theorems }: { theorems: Theorem[] }) {
  const [selected, select] = useStudioMode("theorem", theorems.map((t) => t.id), "angle-sum");
  const theorem = theorems.find((t) => t.id === selected)!;
  const [search, setSearch] = useState(""), [category, setCategory] = useState("All"), [step, setStep] = useState(0), [playing, setPlaying] = useState(false), [x, setX] = useState(3), [height, setHeight] = useState(4), [ratio, setRatio] = useState(0.5), [angle, setAngle] = useState(60);
  const [labels, setLabels] = useState(true), [construction, setConstruction] = useState(true), [arcs, setArcs] = useState(true), [drag, setDrag] = useState(false), [panel, setPanel] = useState("Statement");
  useEffect(() => { if (!playing) return; const id = window.setInterval(() => setStep((s) => (s + 1) % theorem.steps.length), 900); return () => clearInterval(id); }, [playing, theorem.steps.length]);
  const h = selected === "thales" ? 4 * Math.sin(angle * Math.PI / 180) : height;
  const apex = selected === "thales" ? 4 + 4 * Math.cos(angle * Math.PI / 180) : x;
  const sideA = Math.hypot(8 - apex, h), sideB = Math.hypot(apex, h), sideC = 8;
  const angleA = Math.atan2(h, apex), angleB = Math.atan2(h, 8 - apex), angleC = Math.PI - angleA - angleB;
  const deg = (value: number) => value * 180 / Math.PI;
  const checks: Record<string, string> = {
    "angle-sum": `${f(deg(angleA))}° + ${f(deg(angleB))}° + ${f(deg(angleC))}° = 180°`,
    "exterior-angle": `Exterior at B: ${f(180 - deg(angleB))}° = A + C = ${f(deg(angleA + angleC))}°`,
    midpoint: `Parallel segment length = ${f(sideC / 2)} = BC / 2`,
    "basic-proportionality": `AD/DB = AE/EC = ${f(ratio / (1 - ratio))}`,
    "similar-triangles": `Corresponding side ratios: ${f(ratio * sideA / sideA)}, ${f(ratio * sideB / sideB)}, ${f(ratio)}; equal angles`,
    thales: `Angle APB = ${f(deg(angleC))}°`,
    "law-of-sines": `a/sin A = ${f(sideA / Math.sin(angleA))}; b/sin B = ${f(sideB / Math.sin(angleB))}; c/sin C = ${f(sideC / Math.sin(angleC))}`,
    "law-of-cosines": `c² = ${f(sideC ** 2)}; a²+b²−2ab cos C = ${f(sideA ** 2 + sideB ** 2 - 2 * sideA * sideB * Math.cos(angleC))}`,
  };
  const sx = (n: number) => 80 + 55 * n, sy = (n: number) => 330 - 45 * n;
  const r = selected === "midpoint" ? 0.5 : ratio;
  const proportional = ["midpoint", "basic-proportionality", "similar-triangles"].includes(selected);
  return <div className="gu-theorem-grid"><aside className="gu-library"><h2>Theorem Library</h2><label>Search theorems<input value={search} onChange={(e) => setSearch(e.target.value)} /></label><div className="gu-filter-row">{["All", "Triangles", "Circles", "Trigonometry"].map((c) => <button type="button" key={c} onClick={() => setCategory(c)}>{c}</button>)}</div><div className="gu-library-list">{theorems.filter((t) => (category === "All" || category === t.category) && t.title.toLowerCase().includes(search.toLowerCase())).map((t) => <button type="button" key={t.id} className={t.id === selected ? "active" : ""} onClick={() => { select(t.id); setStep(0); setPlaying(false); }}>{t.title}</button>)}</div></aside><section className="gu-workspace-frame"><div className="gu-filter-row">{[["Labels", labels, setLabels], ["Construction lines", construction, setConstruction], ["Angle arcs", arcs, setArcs], ["Drag", drag, setDrag]].map(([name, value, setter]) => <button type="button" key={String(name)} aria-pressed={Boolean(value)} onClick={() => (setter as (v: boolean) => void)(!value)}>{String(name)}</button>)}<button type="button" onClick={() => { setStep(0); setPlaying(false); setX(3); setHeight(4); setRatio(0.5); setAngle(60); setLabels(true); setConstruction(true); setArcs(true); setDrag(false); }}>Reset</button></div><h2>{theorem.title}</h2><svg viewBox="0 0 650 460" role="img" aria-label={`${theorem.title} construction`} style={{ width: "100%", touchAction: "none" }} onPointerMove={(event) => { if (!drag || !event.buttons) return; const svg = event.currentTarget, point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY; const matrix = svg.getScreenCTM(); if (!matrix) return; const p = point.matrixTransform(matrix.inverse()); if (selected === "thales") setAngle(Math.max(10, Math.min(170, Math.atan2((330 - p.y) / 45, (p.x - 300) / 55) * 180 / Math.PI))); else { setX(Math.max(0.5, Math.min(7.5, (p.x - 80) / 55))); setHeight(Math.max(1, Math.min(6, (330 - p.y) / 45))); } }}>
      {selected === "thales" && <ellipse cx={sx(4)} cy={sy(0)} rx={220} ry={180} fill="none" stroke="#94a3b8" />}
      <polygon points={`${sx(0)},${sy(0)} ${sx(8)},${sy(0)} ${sx(apex)},${sy(h)}`} fill="#0891b222" stroke="#0891b2" strokeWidth="3" />
      <circle cx={sx(apex)} cy={sy(h)} r="9" fill="#8b5cf6" style={{ cursor: drag ? "grab" : "default" }} onPointerDown={(event) => { if (drag) event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId); }} />
      {construction && proportional && <line x1={sx(apex * (1 - r))} y1={sy(h * (1 - r))} x2={sx(apex + (8 - apex) * r)} y2={sy(h * (1 - r))} stroke="#d97706" strokeWidth="4" />}
      {construction && selected === "exterior-angle" && <line x1={sx(8)} y1={sy(0)} x2="620" y2={sy(0)} stroke="#d97706" strokeWidth="4" />}
      {construction && selected === "angle-sum" && step > 0 && <line x1="40" y1={sy(h)} x2="600" y2={sy(h)} stroke="#d97706" strokeDasharray="6 4" />}
      {construction && ["law-of-sines", "law-of-cosines"].includes(selected) && <line x1={sx(apex)} y1={sy(h)} x2={sx(apex)} y2={sy(0)} stroke="#d97706" strokeDasharray="6 4" />}
      {arcs && <path d={`M${sx(0) + 30} ${sy(0)} A30 30 0 0 0 ${sx(0) + 30 * Math.cos(angleA)} ${sy(0) - 30 * Math.sin(angleA)}`} fill="none" stroke="#8b5cf6" strokeWidth="3" />}
      {labels && <><text x={sx(0)} y={sy(0) + 25}>A</text><text x={sx(8)} y={sy(0) + 25}>B</text><text x={sx(apex) + 12} y={sy(h) - 12}>C</text><text x="65" y="420">a={f(sideA)}, b={f(sideB)}, c=8</text></>}
    </svg><output>{checks[selected]}</output></section><aside className="gu-inspector"><h2>Theorem inspector</h2><div className="gu-filter-row">{["Statement", "Proof", "Check"].map((p) => <button type="button" key={p} onClick={() => setPanel(p)}>{p}</button>)}</div>{panel === "Statement" ? <><p>{theorem.statement}</p><p>{theorem.given}</p><p>{theorem.prove}</p></> : panel === "Proof" ? <><div className="gu-proof-list">{theorem.steps.map((text, i) => <button type="button" key={text} className={step === i ? "active" : ""} onClick={() => setStep(i)}>{i + 1}. {text}</button>)}</div><button type="button" onClick={() => setPlaying(!playing)}>{playing ? "Pause proof" : "Animate proof"}</button><p aria-live="polite">Step {step + 1}: {theorem.steps[step]}</p></> : <p>{checks[selected]}</p>}{selected === "thales" ? <label>Circle angle<input type="range" min="10" max="170" value={angle} onChange={(e) => setAngle(Number(e.target.value))} /></label> : <><label>Apex x<input type="range" min="0.5" max="7.5" step="0.1" value={x} onChange={(e) => setX(Number(e.target.value))} /></label><label>Height<input type="range" min="1" max="6" step="0.1" value={height} onChange={(e) => setHeight(Number(e.target.value))} /></label></>}{proportional && selected !== "midpoint" && <label>Scale ratio<input type="range" min="0.1" max="0.9" step="0.05" value={ratio} onChange={(e) => setRatio(Number(e.target.value))} /></label>}</aside></div>;
}
