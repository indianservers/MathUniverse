import { MoreHorizontal, MousePointer2, Pencil, RotateCcw, Spline } from "lucide-react";
import { useMemo, useRef, useState, type PointerEvent } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, ChipRow, Field, Segmented, StatusOk, StepList, clamp, fmt, useLabMode } from "../studioLabKit";

type Known = "angle-side" | "sides";
type Units = "deg" | "rad" | "grad";
type Ori = "std" | "flipx" | "flipy";
type Example = "345" | "306090" | "454590" | "custom";
type Tool = "select" | "measure" | "labels" | "trace";

const MODES = ["Solve Triangle", "Ratios", "Pythagoras", "Similarity", "Special Triangles"];

function toDeg(value: number, units: Units) {
  if (units === "rad") return value * 180 / Math.PI;
  if (units === "grad") return value * 0.9;
  return value;
}

function fromDeg(deg: number, units: Units) {
  if (units === "rad") return deg * Math.PI / 180;
  if (units === "grad") return deg / 0.9;
  return deg;
}

function unitLabel(units: Units) {
  return units === "rad" ? " rad" : units === "grad" ? " gon" : "°";
}

function Fraction({ top, bot }: { top: string; bot: string }) {
  return <span className="msk-frac"><b>{top}</b><b>{bot}</b></span>;
}

function RatioLine({ color, name, words, num, den, value }: { color: string; name: string; words: [string, string]; num: string; den: string; value: string }) {
  return (
    <div className="msk-ratio">
      <i style={{ background: color }} />
      <em>{name} A</em>
      <span>=</span>
      <Fraction top={words[0]} bot={words[1]} />
      <span>=</span>
      <Fraction top={num} bot={den} />
      <strong>= {value}</strong>
    </div>
  );
}

function ValueRow({ color, label, value, ok = true }: { color: string; label: string; value: string; ok?: boolean }) {
  return (
    <div className="msk-ratio">
      <i style={{ background: color }} />
      <em>{label}</em>
      <strong>{value}</strong>
      <span className={ok ? "msk-tick" : "msk-tick is-off"} aria-hidden="true">✓</span>
    </div>
  );
}

export default function RightTriangleLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page, MODES);
  const [known, setKnown] = useState<Known>("angle-side");
  const [units, setUnits] = useState<Units>("deg");
  const [angleA, setAngleA] = useState(35);
  const [opp, setOpp] = useState(7);
  const [hyp, setHyp] = useState(12);
  const [adj, setAdj] = useState(Math.sqrt(95));
  const [ori, setOri] = useState<Ori>("std");
  const [example, setExample] = useState<Example>("custom");
  const [scale, setScale] = useState(1.5);
  const [locked, setLocked] = useState(false);
  const [tool, setTool] = useState<Tool>("select");
  const [labels, setLabels] = useState(true);
  const [measure, setMeasure] = useState(true);
  const [trace, setTrace] = useState(false);
  const drag = useRef<"A" | "B" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const solved = useMemo(() => {
    let A = clamp(angleA, 1, 89);
    let b = Math.max(0.25, opp);
    let c = Math.max(0.5, hyp);
    let a = Math.max(0.25, adj);
    if (known === "angle-side") {
      const rad = A * Math.PI / 180;
      if (mode === "Pythagoras") {
        c = Math.max(b + 0.1, c);
        a = Math.sqrt(Math.max(0, c * c - b * b));
        A = Math.asin(clamp(b / c, 0, 1)) * 180 / Math.PI;
      } else {
        c = Math.max(b + 0.05, c);
        b = c * Math.sin(rad);
        a = c * Math.cos(rad);
      }
    } else {
      c = Math.hypot(a, b);
      A = Math.atan2(b, a) * 180 / Math.PI;
    }
    const B = 90 - A;
    return { A, B, a, b, c, sinA: b / c, cosA: a / c, tanA: b / a, py: a * a + b * b, cc: c * c, ok: Math.abs(a * a + b * b - c * c) < 0.05 };
  }, [adj, angleA, hyp, known, mode, opp]);

  const applyExample = (id: Example) => {
    setExample(id);
    if (id === "345") { setKnown("sides"); setAdj(3); setOpp(4); setHyp(5); setAngleA(Math.atan2(4, 3) * 180 / Math.PI); }
    if (id === "306090") { setKnown("angle-side"); setAngleA(30); setHyp(2); setOpp(1); setAdj(Math.sqrt(3)); }
    if (id === "454590") { setKnown("angle-side"); setAngleA(45); setHyp(Math.SQRT2); setOpp(1); setAdj(1); }
  };

  const reset = () => {
    setKnown("angle-side"); setUnits("deg"); setAngleA(35); setOpp(7); setHyp(12); setAdj(Math.sqrt(95)); setOri("std"); setExample("custom"); setScale(1.5); setLocked(false);
  };

  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 640;
    const y = ((event.clientY - rect.top) / rect.height) * 360;
    return { x: clamp((x - 48) / 28, 0.5, 14), y: clamp((320 - y) / 28, 0.5, 10) };
  };

  const onMove = (event: PointerEvent<SVGSVGElement>) => {
    if (locked || !drag.current || tool !== "select") return;
    const p = pointer(event);
    if (drag.current === "A") { setKnown("sides"); setAdj(p.x); setHyp(Math.hypot(p.x, solved.b)); }
    else { setKnown("sides"); setOpp(p.y); setHyp(Math.hypot(solved.a, p.y)); }
    setExample("custom");
  };

  const ox = 48;
  const oy = 320;
  const u = 28;
  const Ax = ox + (ori === "flipx" ? 0 : solved.a * u);
  const Ay = oy;
  const Bx = ox;
  const By = oy - (ori === "flipy" ? 0 : solved.b * u);
  const similar = { a: solved.a * scale, b: solved.b * scale, c: solved.c * scale };
  const pickTool = (next: Tool) => {
    setTool(next);
    if (next === "labels") setLabels((value) => !value);
    if (next === "measure") setMeasure((value) => !value);
    if (next === "trace") setTrace((value) => !value);
  };

  return (
    <>
      <nav className="msk-tabs" aria-label="Right Triangle Studio modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>{item}</button>
        ))}
      </nav>
      <div className="msk-lab msk-rt">
        <section className="msk-panel">
          <h2>Triangle Inputs</h2>
          <Field label="Known quantities">
            <Segmented value={known} onChange={(id) => setKnown(id as Known)} options={[{ id: "angle-side", label: "Angle & Side" }, { id: "sides", label: "Sides Only" }]} />
          </Field>
          <Field label="Angle A">
            <div className="msk-num-row">
              <input type="number" min={1} max={89} step={0.1} value={Number(fmt(fromDeg(solved.A, units), 2))} disabled={locked || known === "sides"} onChange={(event) => { setKnown("angle-side"); setAngleA(toDeg(Number(event.target.value), units)); setExample("custom"); }} />
              <span>{unitLabel(units).trim()}</span>
            </div>
          </Field>
          <Field label="Side b (opposite A)">
            <div className="msk-num-row">
              <input type="number" min={0.25} step={0.1} value={Number(fmt(solved.b, 4))} disabled={locked} onChange={(event) => { setOpp(Number(event.target.value)); setExample("custom"); }} />
              <span>cm</span>
            </div>
          </Field>
          <Field label="Side c (hypotenuse)">
            <div className="msk-num-row">
              <input type="number" min={0.5} step={0.1} value={Number(fmt(solved.c, 4))} disabled={locked} onChange={(event) => { setHyp(Number(event.target.value)); setKnown("angle-side"); setExample("custom"); }} />
              <span>cm</span>
            </div>
          </Field>
          <Field label="Side a (adjacent A)">
            <div className="msk-num-row">
              <input type="number" min={0.25} step={0.1} value={Number(fmt(solved.a, 4))} disabled={locked || known === "angle-side"} onChange={(event) => { setAdj(Number(event.target.value)); setKnown("sides"); setExample("custom"); }} />
              <span>cm</span>
            </div>
          </Field>
          <Field label="Units">
            <Segmented value={units} onChange={(id) => setUnits(id as Units)} options={[{ id: "deg", label: "Deg" }, { id: "rad", label: "Rad" }, { id: "grad", label: "Grad" }]} />
          </Field>
          <Field label="Orientation">
            <div className="msk-ori">
              {(["std", "flipx", "flipy"] as Ori[]).map((item) => (
                <button key={item} type="button" className={ori === item ? "active" : ""} aria-label={`Orientation ${item}`} onClick={() => setOri(item)}>
                  <svg viewBox="0 0 32 24"><polygon points={item === "std" ? "4,20 28,20 4,4" : item === "flipx" ? "28,20 4,20 28,4" : "4,4 28,4 4,20"} fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                </button>
              ))}
            </div>
          </Field>
          <Field label="Examples">
            <ChipRow value={example} onChange={(id) => applyExample(id as Example)} options={[{ id: "345", label: "3-4-5" }, { id: "306090", label: "30-60-90" }, { id: "454590", label: "45-45-90" }, { id: "custom", label: "Custom" }]} />
          </Field>
          <div className="msk-btn-row">
            <button className="msk-soft" type="button" onClick={reset}><RotateCcw /> Reset</button>
            <button className="msk-soft" type="button" onClick={() => setLocked((value) => !value)}>{locked ? "Unlock All" : "Lock All"}</button>
          </div>
        </section>

        <section className="msk-panel msk-canvas msk-rt-stage">
          <div className="msk-icon-tools" role="toolbar" aria-label="Canvas tools">
            <button type="button" className={tool === "select" ? "active" : ""} aria-pressed={tool === "select"} onClick={() => setTool("select")} title="Select / Drag"><MousePointer2 /><span>Select / Drag</span></button>
            <button type="button" className={measure ? "active" : ""} aria-pressed={measure} onClick={() => pickTool("measure")} title="Measure"><Pencil /><span>Measure</span></button>
            <button type="button" className={labels ? "active" : ""} aria-pressed={labels} onClick={() => pickTool("labels")} title="Labels"><span className="msk-tool-a">A</span><span>Labels</span></button>
            <button type="button" className={trace ? "active" : ""} aria-pressed={trace} onClick={() => pickTool("trace")} title="Trace"><Spline /><span>Trace</span></button>
            <button type="button" onClick={reset} title="Reset view"><RotateCcw /></button>
            <button type="button" title="More"><MoreHorizontal /></button>
          </div>
          <svg ref={svgRef} className="msk-graph" viewBox="0 0 640 360" role="img" aria-label="Interactive right triangle" onPointerMove={onMove} onPointerUp={() => { drag.current = null; }} onPointerLeave={() => { drag.current = null; }}>
            <rect width="640" height="360" fill="#f7fbff" />
            {Array.from({ length: 16 }, (_, i) => <line key={`vx${i}`} x1={ox + i * u} y1="12" x2={ox + i * u} y2={oy} stroke="#e8eef6" />)}
            {Array.from({ length: 11 }, (_, i) => <line key={`hy${i}`} x1={ox} y1={oy - i * u} x2="620" y2={oy - i * u} stroke="#e8eef6" />)}
            <line x1={ox} y1="12" x2={ox} y2={oy} stroke="#1e293b" />
            <line x1={ox} y1={oy} x2="620" y2={oy} stroke="#1e293b" />
            <text x="628" y={oy + 4} fill="#64748b" fontSize="11">x</text>
            <text x={ox - 10} y="16" fill="#64748b" fontSize="11">y</text>
            {Array.from({ length: 8 }, (_, i) => <text key={`tx${i}`} x={ox + i * 2 * u} y={oy + 14} fill="#94a3b8" fontSize="10" textAnchor="middle">{i * 2}</text>)}
            {Array.from({ length: 5 }, (_, i) => <text key={`ty${i}`} x={ox - 8} y={oy - (i + 1) * 2 * u + 4} fill="#94a3b8" fontSize="10" textAnchor="end">{(i + 1) * 2}</text>)}
            {trace ? <polyline points={Array.from({ length: 12 }, (_, i) => `${ox + (solved.a * i / 11) * u},${oy - (solved.b * i / 11) * u}`).join(" ")} fill="none" stroke="#94a3b8" strokeDasharray="4 4" /> : null}
            <line x1={ox} y1={oy} x2={Ax} y2={Ay} stroke="#147df2" strokeWidth="2.2" />
            <line x1={ox} y1={oy} x2={Bx} y2={By} stroke="#8b45f4" strokeWidth="2.2" />
            <line x1={Ax} y1={Ay} x2={Bx} y2={By} stroke="#08b9dd" strokeWidth="2.2" />
            <rect x={ox + 6} y={oy - 18} width="12" height="12" fill="none" stroke="#1e293b" />
            <path d={`M ${Ax - 30} ${Ay} A 30 30 0 0 0 ${Ax - 30 * Math.cos(solved.A * Math.PI / 180)} ${Ay - 30 * Math.sin(solved.A * Math.PI / 180)}`} fill="rgba(245,158,11,.16)" stroke="#f59e0b" />
            {measure ? (
              <>
                <text x={(Ax + ox) / 2} y={Ay + 18} fill="#147df2" fontSize="13" fontWeight="700">b = {fmt(solved.b, 2)} cm</text>
                <text x={ox - 10} y={(By + oy) / 2} fill="#8b45f4" fontSize="13" fontWeight="700" textAnchor="end">{fmt(solved.a, 4)} cm</text>
                <text x={(Ax + Bx) / 2 + 12} y={(Ay + By) / 2 - 6} fill="#08b9dd" fontSize="13" fontWeight="700">c = {fmt(solved.c, 2)} cm</text>
                <text x={Ax - 44} y={Ay - 16} fill="#f59e0b" fontSize="12">{fmt(fromDeg(solved.A, units), 0)}{unitLabel(units)}</text>
                <text x={Bx + 14} y={By + 26} fill="#8b45f4" fontSize="12">{fmt(fromDeg(solved.B, units), 0)}{unitLabel(units)}</text>
              </>
            ) : null}
            {labels ? (
              <>
                <text x={Ax + 10} y={Ay - 10} fill="#0f172a" fontSize="12" fontWeight="800">A ({fmt(solved.a, 4)}, 0)</text>
                <text x={Bx + 10} y={By - 10} fill="#0f172a" fontSize="12" fontWeight="800">B (0, {fmt(solved.b, 2)})</text>
                <text x={ox + 10} y={oy + 28} fill="#0f172a" fontSize="12" fontWeight="800">C (0, 0)</text>
              </>
            ) : null}
            <circle cx={Ax} cy={Ay} r="8" fill="#f59e0b" stroke="#fff" strokeWidth="2" style={{ cursor: "grab" }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); drag.current = "A"; }} />
            <circle cx={Bx} cy={By} r="8" fill="#8b45f4" stroke="#fff" strokeWidth="2" style={{ cursor: "grab" }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); drag.current = "B"; }} />
            <text x={ox - 18} y={(By + oy) / 2} fill="#8b45f4" fontSize="14" fontStyle="italic" fontWeight="700">a</text>
            <text x={(Ax + ox) / 2} y={oy + 32} fill="#147df2" fontSize="14" fontStyle="italic" fontWeight="700">b</text>
            <text x={(Ax + Bx) / 2 + 18} y={(Ay + By) / 2 - 14} fill="#08b9dd" fontSize="14" fontStyle="italic" fontWeight="700">c</text>
            <circle cx={ox} cy={oy} r="7" fill="#147df2" stroke="#fff" strokeWidth="2" />
          </svg>
          <aside className="msk-similar">
            <h3>Similar Triangle (Scale: {fmt(scale, 1)}×)</h3>
            <input className="msk-similar-scale" type="range" min={0.5} max={3} step={0.1} value={scale} onChange={(event) => setScale(Number(event.target.value))} aria-label="Similar triangle scale" />
            <svg viewBox="0 0 248 132" aria-hidden="true">
              <polygon points="32,108 186,108 32,22" fill="none" stroke="#08b9dd" strokeWidth="1.55" />
              <rect x="36" y="94" width="13" height="13" fill="none" stroke="#1e293b" strokeWidth="1.2" />
              <circle cx="32" cy="108" r="3.4" fill="#147df2" />
              <circle cx="186" cy="108" r="3.4" fill="#f59e0b" />
              <circle cx="32" cy="22" r="3.4" fill="#8b45f4" />
              <text x="88" y="128" fill="#475569" fontSize="16" fontFamily="Georgia, Times New Roman, serif">{fmt(similar.a, 2)}</text>
              <text x="0" y="72" fill="#475569" fontSize="16" fontFamily="Georgia, Times New Roman, serif">{fmt(similar.b, 2)}</text>
              <text x="114" y="54" fill="#08b9dd" fontSize="16" fontFamily="Georgia, Times New Roman, serif">{fmt(similar.c, 2)}</text>
              <text x="42" y="42" fill="#8b45f4" fontSize="13" fontFamily="Georgia, Times New Roman, serif">{fmt(solved.B, 0)}°</text>
              <text x="148" y="98" fill="#f59e0b" fontSize="13" fontFamily="Georgia, Times New Roman, serif">{fmt(solved.A, 0)}°</text>
            </svg>
          </aside>
        </section>

        <aside className="msk-panel msk-live">
          <h2>Trigonometric Ratios (at ∠A = {fmt(fromDeg(solved.A, units), 1)}{unitLabel(units)})</h2>
          <RatioLine color="#08b9dd" name="sin" words={["opp", "hyp"]} num={fmt(solved.b, 4)} den={fmt(solved.c, 4)} value={fmt(solved.sinA, 4)} />
          <RatioLine color="#8b45f4" name="cos" words={["adj", "hyp"]} num={fmt(solved.a, 4)} den={fmt(solved.c, 4)} value={fmt(solved.cosA, 4)} />
          <RatioLine color="#f59e0b" name="tan" words={["opp", "adj"]} num={fmt(solved.b, 4)} den={fmt(solved.a, 4)} value={fmt(solved.tanA, 4)} />
          <h2>Solved Values</h2>
          <ValueRow color="#f59e0b" label="∠A" value={`${fmt(fromDeg(solved.A, units), 2)}${unitLabel(units)}`} />
          <ValueRow color="#8b45f4" label="∠B" value={`${fmt(fromDeg(solved.B, units), 2)}${unitLabel(units)}`} />
          <ValueRow color="#147df2" label="∠C" value={`90${unitLabel(units)}`} />
          <ValueRow color="#8b45f4" label="a (adjacent)" value={`${fmt(solved.a, 4)} cm`} />
          <ValueRow color="#147df2" label="b (opposite)" value={`${fmt(solved.b, 4)} cm`} />
          <ValueRow color="#08b9dd" label="c (hypotenuse)" value={`${fmt(solved.c, 4)} cm`} />
          <h2>Pythagorean Check</h2>
          <p className="msk-formula">a² + b² = c²</p>
          <p className="msk-formula">({fmt(solved.a, 4)})² + ({fmt(solved.b, 4)})² = ({fmt(solved.c, 4)})²</p>
          <p className="msk-formula">{fmt(solved.a * solved.a, 2)} + {fmt(solved.b * solved.b, 2)} = {fmt(solved.cc, 2)}</p>
          <StatusOk>{solved.ok ? "Valid — all values are consistent." : "Sides are being reconciled."}</StatusOk>
          <h2>Steps & Reasoning</h2>
          <StepList items={[
            "Given ∠A and two sides (b, c).",
            "∠C = 90° (right angle).",
            `∠B = 90° − ∠A = ${fmt(solved.B, 1)}°.`,
            "Use sin A = opp / hyp to verify the ratio.",
            "Use Pythagoras to find a = √(c² − b²).",
            "All values validated.",
          ]} />
          <StatusOk>Solution status: all values are consistent.</StatusOk>
          <ChallengeBox prompt={page.challenge.prompt} expected={page.challenge.expected} hint={page.challenge.hint} />
        </aside>
      </div>
      <MockupLearningStrip page={page} />
    </>
  );
}
