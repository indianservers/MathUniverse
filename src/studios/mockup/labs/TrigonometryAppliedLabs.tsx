import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, StatusOk, StepList, clamp, fmt } from "../studioLabKit";

type Point = { x: number; y: number };
type Vertex = "A" | "B" | "C";
type KnownValue = "a" | "b" | "c" | "A" | "B" | "C";

const DEG = Math.PI / 180;

function distance(p: Point, q: Point) {
  return Math.hypot(p.x - q.x, p.y - q.y);
}

function angleAt(p: Point, q: Point, r: Point) {
  const ux = q.x - p.x;
  const uy = q.y - p.y;
  const vx = r.x - p.x;
  const vy = r.y - p.y;
  return Math.acos(clamp((ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy) || 1), -1, 1)) / DEG;
}

function signedDoubleArea(a: Point, b: Point, c: Point) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function circumcircle(a: Point, b: Point, c: Point) {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 0.001) return null;
  const aa = a.x * a.x + a.y * a.y;
  const bb = b.x * b.x + b.y * b.y;
  const cc = c.x * c.x + c.y * c.y;
  const center = {
    x: (aa * (b.y - c.y) + bb * (c.y - a.y) + cc * (a.y - b.y)) / d,
    y: (aa * (c.x - b.x) + bb * (a.x - c.x) + cc * (b.x - a.x)) / d,
  };
  return { center, radius: distance(center, a) };
}

function projection(p: Point, a: Point, b: Point): Point {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1);
  return { x: a.x + t * dx, y: a.y + t * dy };
}

function angleArc(center: Point, from: Point, to: Point, radius: number) {
  const a0 = Math.atan2(from.y - center.y, from.x - center.x);
  let delta = Math.atan2(to.y - center.y, to.x - center.x) - a0;
  while (delta <= -Math.PI) delta += 2 * Math.PI;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  const end = a0 + delta;
  const p0 = { x: center.x + radius * Math.cos(a0), y: center.y + radius * Math.sin(a0) };
  const p1 = { x: center.x + radius * Math.cos(end), y: center.y + radius * Math.sin(end) };
  return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 0 ${delta > 0 ? 1 : 0} ${p1.x} ${p1.y}`;
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (next: boolean) => void; children: ReactNode }) {
  return (
    <label className="msk-toggle trig-target-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {children}
    </label>
  );
}

export function ObliqueTriangleLab({ page }: { page: StudioMockupPage }) {
  const [points, setPoints] = useState<Record<Vertex, Point>>({
    A: { x: 207, y: 65 },
    B: { x: 82, y: 344 },
    C: { x: 316, y: 344 },
  });
  const [dragging, setDragging] = useState<Vertex | null>(null);
  const [showCircle, setShowCircle] = useState(true);
  const [showAltitudes, setShowAltitudes] = useState(false);
  const [known, setKnown] = useState<Record<KnownValue, boolean>>({ a: true, b: true, c: true, A: true, B: true, C: false });
  const A = points.A;
  const B = points.B;
  const C = points.C;
  const scale = 30;
  const a = distance(B, C) / scale;
  const b = distance(C, A) / scale;
  const c = distance(A, B) / scale;
  const angleA = angleAt(A, B, C);
  const angleB = angleAt(B, A, C);
  const angleC = 180 - angleA - angleB;
  const areaPixels = Math.abs(signedDoubleArea(A, B, C)) / 2;
  const area = areaPixels / (scale * scale);
  const semiperimeter = (a + b + c) / 2;
  const heronArea = Math.sqrt(Math.max(0, semiperimeter * (semiperimeter - a) * (semiperimeter - b) * (semiperimeter - c)));
  const circle = circumcircle(A, B, C);
  const altitudeA = projection(A, B, C);
  const altitudeB = projection(B, A, C);
  const altitudeC = projection(C, A, B);
  const sineRatio = a / Math.sin(angleA * DEG);
  const knownCount = Object.values(known).filter(Boolean).length;
  const valid = area > 0.02 && a + b > c && b + c > a && c + a > b;

  const moveVertex = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect();
    const next = {
      x: clamp(((event.clientX - box.left) / box.width) * 360, 26, 334),
      y: clamp(((event.clientY - box.top) / box.height) * 420, 34, 386),
    };
    setPoints((current) => ({ ...current, [dragging]: next }));
  };

  return (
    <Phase1LabChrome page={page}>
      {(mode) => (
        <>
          <Panel title="Triangle Inputs" className="trig-target-card trig-target-oblique-controls">
            <div className="trig-target-section-title">Sides</div>
            <LiveRow color="#7c3aed" label="a (BC)" value={fmt(a, 2)} />
            <LiveRow color="#06b6d4" label="b (CA)" value={fmt(b, 2)} />
            <LiveRow color="#f97316" label="c (AB)" value={fmt(c, 2)} />
            <div className="trig-target-section-title">Angles</div>
            <LiveRow color="#f97316" label="A (∠A)" value={`${fmt(angleA, 2)}°`} />
            <LiveRow color="#7c3aed" label="B (∠B)" value={`${fmt(angleB, 2)}°`} />
            <LiveRow color="#06b6d4" label="C (∠C)" value={`${fmt(angleC, 2)}°`} />
            <div className="trig-target-known-heading"><b>Known values</b><span>{knownCount} / 6</span></div>
            <div className="trig-target-known-grid">
              {(Object.keys(known) as KnownValue[]).map((key) => (
                <Toggle key={key} checked={known[key]} onChange={(next) => setKnown((current) => ({ ...current, [key]: next }))}>{key}</Toggle>
              ))}
            </div>
            <button type="button" className="msk-primary trig-target-solve">✦ Solve</button>
            <button type="button" className="msk-soft" onClick={() => setPoints({ A: { x: 207, y: 65 }, B: { x: 82, y: 344 }, C: { x: 316, y: 344 } })}>↻ Reset All</button>
          </Panel>

          <section className="msk-panel msk-canvas trig-target-canvas trig-target-oblique-canvas" data-trig-target-mode={mode} data-ob-mode={mode}>
            <div className="trig-target-canvas-bar">
              <Toggle checked={showCircle} onChange={setShowCircle}>Show circumcircle</Toggle>
              <Toggle checked={showAltitudes} onChange={setShowAltitudes}>Show altitudes</Toggle>
              <span className="trig-target-measure">⌁ Measure</span>
            </div>
            <svg
              className="msk-graph is-interactive trig-target-triangle"
              viewBox="0 0 360 420"
              role="img"
              aria-label={`${mode} draggable oblique triangle`}
              onPointerMove={moveVertex}
              onPointerUp={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              <defs>
                <radialGradient id="trig-oblique-fill">
                  <stop offset="0" stopColor="#fff" stopOpacity=".92" />
                  <stop offset="1" stopColor="#dbeafe" stopOpacity=".45" />
                </radialGradient>
              </defs>
              <rect width="360" height="420" fill="#fbfdff" />
              {showCircle && circle && circle.radius < 500 ? (
                <circle className="trig-target-circumcircle" cx={circle.center.x} cy={circle.center.y} r={circle.radius} fill="none" stroke="#93c5fd" strokeDasharray="7 6" />
              ) : null}
              {circle ? (
                <>
                  <line x1={circle.center.x} y1={circle.center.y} x2={A.x} y2={A.y} stroke="#cbd5e1" strokeDasharray="4 5" />
                  <line x1={circle.center.x} y1={circle.center.y} x2={B.x} y2={B.y} stroke="#cbd5e1" strokeDasharray="4 5" />
                  <line x1={circle.center.x} y1={circle.center.y} x2={C.x} y2={C.y} stroke="#cbd5e1" strokeDasharray="4 5" />
                  <circle cx={circle.center.x} cy={circle.center.y} r="3" fill="#64748b" />
                </>
              ) : null}
              {showAltitudes || mode === "Area" ? (
                <g className="trig-target-altitudes" stroke="#64748b" strokeDasharray="5 4">
                  <line x1={A.x} y1={A.y} x2={altitudeA.x} y2={altitudeA.y} />
                  <line x1={B.x} y1={B.y} x2={altitudeB.x} y2={altitudeB.y} />
                  <line x1={C.x} y1={C.y} x2={altitudeC.x} y2={altitudeC.y} />
                </g>
              ) : null}
              <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill={mode === "Area" ? "rgba(139,92,246,.16)" : "url(#trig-oblique-fill)"} stroke="none" />
              <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="#7c3aed" strokeWidth="2.5" />
              <line x1={C.x} y1={C.y} x2={A.x} y2={A.y} stroke="#06b6d4" strokeWidth="2.5" />
              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#f97316" strokeWidth="2.5" />
              <path className="trig-target-angle-arc" d={angleArc(A, B, C, 34)} fill="none" stroke="#f97316" strokeWidth="2" />
              <path className="trig-target-angle-arc" d={angleArc(B, C, A, 34)} fill="none" stroke="#7c3aed" strokeWidth="2" />
              <path className="trig-target-angle-arc" d={angleArc(C, A, B, 34)} fill="none" stroke="#06b6d4" strokeWidth="2" />
              <text x={(B.x + C.x) / 2} y={(B.y + C.y) / 2 + 22} fill="#7c3aed" fontSize="12" textAnchor="middle">a = {fmt(a, 2)}</text>
              <text x={(C.x + A.x) / 2 + 18} y={(C.y + A.y) / 2} fill="#06b6d4" fontSize="12">b = {fmt(b, 2)}</text>
              <text x={(A.x + B.x) / 2 - 18} y={(A.y + B.y) / 2} fill="#f97316" fontSize="12" textAnchor="end">c = {fmt(c, 2)}</text>
              <text x={A.x} y={A.y + 50} fill="#f97316" fontSize="12" textAnchor="middle">{fmt(angleA, 1)}°</text>
              <text x={B.x + 45} y={B.y - 18} fill="#7c3aed" fontSize="12">{fmt(angleB, 1)}°</text>
              <text x={C.x - 45} y={C.y - 18} fill="#06b6d4" fontSize="12" textAnchor="end">{fmt(angleC, 1)}°</text>
              {(["A", "B", "C"] as Vertex[]).map((vertex) => {
                const point = points[vertex];
                const color = vertex === "A" ? "#f97316" : vertex === "B" ? "#7c3aed" : "#06b6d4";
                return (
                  <g key={vertex} className="trig-target-vertex" onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); setDragging(vertex); }}>
                    <circle cx={point.x} cy={point.y} r="14" fill="transparent" />
                    <circle cx={point.x} cy={point.y} r="6" fill={color} stroke="#fff" strokeWidth="2" />
                    <text x={point.x + (vertex === "B" ? -13 : 0)} y={point.y + (vertex === "A" ? -12 : 18)} fill={color} fontWeight="700" fontSize="13" textAnchor="middle">{vertex}</text>
                  </g>
                );
              })}
            </svg>
            <p className="msk-note trig-target-canvas-hint">Drag vertices (A, B, C) to explore. All values update in real time.</p>
          </section>

          <aside className="msk-panel msk-live trig-target-card trig-target-law-panel">
            <h2>{mode === "Area" ? "Area formulas" : "Selected Law"}</h2>
            <span className="trig-target-law-badge">{mode === "Area" ? "AREA" : mode.toUpperCase()}</span>
            <p className="msk-formula">{mode === "Cosine Law" ? "c² = a² + b² − 2ab cos C" : mode === "Area" ? "K = ½ab sin C" : "a / sin A = b / sin B = c / sin C"}</p>
            <h2>Live substitution</h2>
            {mode === "Cosine Law" ? (
              <>
                <LiveRow color="#f97316" label="a² + b² − 2ab cos C" value={fmt(c * c, 3)} />
                <LiveRow color="#f97316" label="Side c" value={fmt(c, 3)} />
              </>
            ) : mode === "Area" ? (
              <>
                <LiveRow color="#10b981" label={`½(${fmt(a, 2)})(${fmt(b, 2)}) sin ${fmt(angleC, 1)}°`} value={fmt(area, 3)} />
                <LiveRow color="#0ea5e9" label="Heron √s(s−a)(s−b)(s−c)" value={fmt(heronArea, 3)} />
                <LiveRow color="#7c3aed" label="Semiperimeter s" value={fmt(semiperimeter, 3)} />
                <div className="trig-target-area-pill">△ {fmt(area, 2)} square units</div>
              </>
            ) : mode === "SSA Ambiguous Case" ? (
              <>
                <LiveRow color="#7c3aed" label="Altitude h = b sin C" value={fmt(b * Math.sin(angleC * DEG), 3)} />
                <LiveRow color="#f59e0b" label="Possible solutions" value={a < b * Math.sin(angleC * DEG) ? "0" : a < b ? "2" : "1"} />
              </>
            ) : (
              <>
                <LiveRow color="#7c3aed" label="a / sin A" value={fmt(sineRatio, 3)} />
                <LiveRow color="#06b6d4" label="b / sin B" value={fmt(b / Math.sin(angleB * DEG), 3)} />
                <LiveRow color="#f97316" label="c / sin C" value={fmt(c / Math.sin(angleC * DEG), 3)} />
              </>
            )}
            <h2>Triangle validity checks</h2>
            <StatusOk>{valid ? "✓ Angle sum 180° · triangle inequality valid" : "Move a vertex to form a non-degenerate triangle."}</StatusOk>
            {mode === "Solve Triangle" ? <LiveRow color="#10b981" label="Solution" value={`a ${fmt(a, 2)}, b ${fmt(b, 2)}, c ${fmt(c, 2)}`} /> : null}
            <LiveRow color="#10b981" label="Area" value={`${fmt(area, 2)} square units`} />
            <ChallengeBox page={page} mode={mode} />
          </aside>
        </>
      )}
    </Phase1LabChrome>
  );
}

function wavePoints(fn: (t: number) => number, y0: number, scaleY: number) {
  return Array.from({ length: 181 }, (_, index) => {
    const t = (index / 180) * 5;
    return `${24 + index * 2.67},${y0 - fn(t) * scaleY}`;
  }).join(" ");
}

export function WavesHarmonicsLab({ page }: { page: StudioMockupPage }) {
  const [amplitude1, setAmplitude1] = useState(1);
  const [frequency1, setFrequency1] = useState(2);
  const [phase1, setPhase1] = useState(0);
  const [vertical1, setVertical1] = useState(0);
  const [amplitude2, setAmplitude2] = useState(0.7);
  const [frequency2, setFrequency2] = useState(3);
  const [phase2, setPhase2] = useState(Math.PI / 4);
  const [vertical2, setVertical2] = useState(0);
  const [secondWave, setSecondWave] = useState(true);
  const [time, setTime] = useState(1.25);
  const [standingMode, setStandingMode] = useState(3);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setTime((value) => value >= 5 ? 0 : value + 0.02), 32);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <Phase1LabChrome page={page}>
      {(mode) => {
        const effectiveF2 = mode === "Harmonics" ? frequency1 * 2 : mode === "Beats" ? frequency1 + 1 : frequency2;
        const effectivePhase2 = mode === "Phase" ? phase2 : 0;
        const y1 = (t: number) => amplitude1 * Math.sin(2 * Math.PI * frequency1 * t + phase1) + vertical1;
        const y2 = (t: number) => secondWave ? amplitude2 * Math.sin(2 * Math.PI * effectiveF2 * t + effectivePhase2) + vertical2 : 0;
        const result = (t: number) => y1(t) + y2(t);
        const omega1 = 2 * Math.PI * frequency1;
        const omega2 = 2 * Math.PI * effectiveF2;
        const period1 = 1 / frequency1;
        const period2 = 1 / effectiveF2;
        const harmonics = [amplitude1, amplitude2, amplitude2 * 0.43, amplitude2 * 0.22, amplitude2 * 0.13, amplitude2 * 0.08, amplitude2 * 0.05];
        const oscillatorAngle = omega1 * time + phase1;
        return (
          <>
            <Panel title="Wave 1 Controls" className="trig-target-card trig-target-wave-controls">
              <SliderRow label="Amplitude A₁" value={amplitude1} min={0.1} max={2} step={0.05} onChange={setAmplitude1} />
              <SliderRow label="Frequency f₁ (Hz)" value={frequency1} min={0.5} max={6} step={0.1} onChange={setFrequency1} />
              <SliderRow label="Phase φ₁ (rad)" value={phase1} min={-Math.PI} max={Math.PI} step={0.05} onChange={setPhase1} />
              <SliderRow label="Vertical shift d₁" value={vertical1} min={-1} max={1} step={0.05} onChange={setVertical1} />
              <div className="trig-target-section-title">Wave 2</div>
              <Toggle checked={secondWave} onChange={setSecondWave}>Add second wave</Toggle>
              <SliderRow label="Amplitude A₂" value={amplitude2} min={0} max={2} step={0.05} onChange={setAmplitude2} />
              <SliderRow label={mode === "Harmonics" ? "Harmonic f₂ = 2f₁" : "Frequency f₂ (Hz)"} value={effectiveF2} min={0.5} max={8} step={0.1} onChange={setFrequency2} />
              {mode === "Phase" ? <SliderRow label="Phase φ₂ (rad)" value={phase2} min={-Math.PI} max={Math.PI} step={0.05} onChange={setPhase2} /> : null}
              <SliderRow label="Vertical shift d₂" value={vertical2} min={-1} max={1} step={0.05} onChange={setVertical2} />
              <div className="trig-target-section-title">Time</div>
              <SliderRow label="t (s)" value={time} min={0} max={5} step={0.01} onChange={setTime} />
              <div className="msk-btn-row trig-target-wave-playback">
                <button type="button" className="msk-cta" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "▶ Play"}</button>
                <button type="button" className="msk-soft" onClick={() => { setPlaying(false); setTime(0); }}>■ Stop</button>
                <button type="button" className="msk-soft" onClick={() => { setPlaying(false); setTime(1.25); }}>↻ Reset</button>
              </div>
            </Panel>

            <section className="msk-panel msk-canvas trig-target-wave-canvas" data-trig-target-mode={mode} data-wv-mode={mode}>
              <svg className="msk-graph is-dark trig-target-wave-plot" viewBox="0 0 540 270" role="img" aria-label={`${mode} source and resultant waves`}>
                <rect width="540" height="270" rx="10" fill="#041426" />
                {Array.from({ length: 9 }, (_, index) => <line key={`v${index}`} x1={24 + index * 60} y1="22" x2={24 + index * 60} y2="248" stroke="#15314b" />)}
                {Array.from({ length: 7 }, (_, index) => <line key={`h${index}`} x1="24" y1={28 + index * 35} x2="516" y2={28 + index * 35} stroke="#15314b" />)}
                <polyline points={wavePoints(y1, 135, 35)} fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                {secondWave ? <polyline points={wavePoints(y2, 135, 35)} fill="none" stroke="#a78bfa" strokeWidth="1.5" /> : null}
                <polyline points={wavePoints(result, 135, 35)} fill="none" stroke="#f59e0b" strokeOpacity=".25" strokeWidth="9" />
                <polyline points={wavePoints(result, 135, 35)} fill="none" stroke="#fbbf24" strokeWidth="2.8" />
                <line x1={24 + time * 96} y1="22" x2={24 + time * 96} y2="248" stroke="#f97316" strokeWidth="1.5" strokeDasharray="5 4" />
                <text x="34" y="42" fill="#22d3ee" fontSize="11">— Wave 1</text>
                <text x="34" y="58" fill="#a78bfa" fontSize="11">— Wave 2</text>
                <text x="34" y="74" fill="#fbbf24" fontSize="11">— Resultant</text>
                <text x={clamp(24 + time * 96 - 20, 30, 470)} y="258" fill="#fbbf24" fontSize="11">t = {fmt(time, 2)} s</text>
              </svg>

              <div className="trig-target-wave-subpanels">
                <section className="trig-target-wave-subpanel trig-target-oscillator">
                  <h3>Unit Circle Oscillator (Wave 1)</h3>
                  <svg viewBox="0 0 180 132" role="img" aria-label="Unit circle oscillator">
                    <circle cx="72" cy="68" r="43" fill="none" stroke="#94a3b8" />
                    <line x1="20" y1="68" x2="124" y2="68" stroke="#64748b" /><line x1="72" y1="16" x2="72" y2="120" stroke="#64748b" />
                    <line x1="72" y1="68" x2={72 + 43 * Math.cos(oscillatorAngle)} y2={68 - 43 * Math.sin(oscillatorAngle)} stroke="#22d3ee" strokeWidth="2" />
                    <circle cx={72 + 43 * Math.cos(oscillatorAngle)} cy={68 - 43 * Math.sin(oscillatorAngle)} r="4" fill="#fbbf24" />
                    <text x="126" y="48" fill="#22d3ee" fontSize="9">θ₁ = {fmt(oscillatorAngle, 2)} rad</text>
                    <text x="126" y="67" fill="#e2e8f0" fontSize="9">cos {fmt(Math.cos(oscillatorAngle), 2)}</text>
                    <text x="126" y="84" fill="#e2e8f0" fontSize="9">sin {fmt(Math.sin(oscillatorAngle), 2)}</text>
                  </svg>
                </section>
                <section className="trig-target-wave-subpanel trig-target-spectrum">
                  <h3>Harmonic Spectrum (Resultant)</h3>
                  <svg viewBox="0 0 180 132" role="img" aria-label="Harmonic spectrum">
                    <line x1="20" y1="108" x2="166" y2="108" stroke="#64748b" /><line x1="20" y1="16" x2="20" y2="108" stroke="#64748b" />
                    {harmonics.map((value, index) => (
                      <g key={index}><rect x={31 + index * 18} y={108 - value * 62} width="8" height={value * 62} fill={index === 0 ? "#f59e0b" : "#d79a20"} /><text x={35 + index * 18} y="122" fill="#cbd5e1" fontSize="8" textAnchor="middle">{index + 1}</text></g>
                    ))}
                  </svg>
                </section>
                <section className="trig-target-wave-subpanel trig-target-standing">
                  <h3>Standing Wave (n = {standingMode})</h3>
                  <svg viewBox="0 0 200 92" role="img" aria-label="Standing wave">
                    <line x1="16" y1="46" x2="184" y2="46" stroke="#475569" />
                    <polyline points={Array.from({ length: 81 }, (_, index) => `${16 + index * 2.1},${46 - Math.sin(index / 80 * standingMode * Math.PI) * 25}`).join(" ")} fill="none" stroke="#fbbf24" strokeWidth="2" />
                    {Array.from({ length: standingMode + 1 }, (_, index) => <circle key={index} cx={16 + index * (168 / standingMode)} cy="46" r="3" fill="#e2e8f0" />)}
                  </svg>
                  <div className="trig-target-standing-modes">
                    {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" className={value === standingMode ? "active" : ""} onClick={() => setStandingMode(value)}>{value}</button>)}
                  </div>
                  <p className="msk-note">Nodes: {standingMode + 1} · Antinodes: {standingMode}</p>
                </section>
              </div>
            </section>

            <aside className="msk-panel msk-live trig-target-card trig-target-wave-values">
              <h2>Equations</h2>
              <p className="msk-formula">y₁(t) = A₁ sin(2πf₁t + φ₁) + d₁</p>
              <p className="msk-formula">y₂(t) = A₂ sin(2πf₂t + φ₂) + d₂</p>
              <p className="msk-formula">y(t) = y₁(t) + y₂(t)</p>
              <h2>Live Values</h2>
              <LiveRow color="#22d3ee" label="Period T₁" value={`${fmt(period1, 3)} s`} />
              <LiveRow color="#a78bfa" label="Period T₂" value={`${fmt(period2, 3)} s`} />
              <LiveRow color="#22d3ee" label="Angular freq. ω₁" value={`${fmt(omega1, 3)} rad/s`} />
              <LiveRow color="#a78bfa" label="Angular freq. ω₂" value={`${fmt(omega2, 3)} rad/s`} />
              <LiveRow color="#8b5cf6" label="Phase diff. Δφ" value={`${fmt(effectivePhase2 - phase1, 3)} rad`} />
              <LiveRow color="#fbbf24" label="Resultant y(t)" value={fmt(result(time), 3)} />
              <LiveRow color="#10b981" label="Resultant amplitude (max)" value={fmt(amplitude1 + (secondWave ? amplitude2 : 0), 3)} />
              <LiveRow color="#0ea5e9" label="RMS value" value={fmt(Math.sqrt((amplitude1 ** 2 + (secondWave ? amplitude2 ** 2 : 0)) / 2), 3)} />
              <LiveRow color="#f59e0b" label="Beat frequency |f₂−f₁|" value={`${fmt(Math.abs(effectiveF2 - frequency1), 3)} Hz`} />
              <p className="msk-note">{mode === "Beats" ? "Nearby frequencies create a slowly changing envelope." : mode === "Harmonics" ? "Integer multiples build the timbre and standing-wave modes." : mode === "Phase" ? "Phase controls constructive and destructive interference." : "Superposition adds instantaneous displacements."}</p>
              <StatusOk>At t = {fmt(time, 2)} s, the resultant reflects the current constructive or destructive interference.</StatusOk>
              <ChallengeBox page={page} mode={mode} />
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}

function Compass({ bearing }: { bearing: number }) {
  const angle = (bearing - 90) * DEG;
  return (
    <g className="trig-target-compass">
      <rect x="18" y="18" width="82" height="94" rx="6" fill="rgba(255,255,255,.9)" />
      <circle cx="59" cy="61" r="25" fill="#eff6ff" stroke="#94a3b8" />
      <text x="55" y="31" fill="#ef4444" fontSize="9">N</text>
      <text x="85" y="64" fill="#334155" fontSize="8">E</text>
      <text x="56" y="91" fill="#334155" fontSize="8">S</text>
      <text x="27" y="64" fill="#334155" fontSize="8">W</text>
      <line x1="59" y1="61" x2={59 + 21 * Math.cos(angle)} y2={61 + 21 * Math.sin(angle)} stroke="#0ea5e9" strokeWidth="5" />
      <text x="28" y="105" fill="#0f766e" fontSize="8">{String(Math.round(bearing)).padStart(3, "0")}.{Math.round((bearing % 1) * 10)}° NE</text>
    </g>
  );
}

export function ApplicationsLab({ page }: { page: StudioMockupPage }) {
  const [distanceValue, setDistanceValue] = useState(80);
  const [eyeHeight, setEyeHeight] = useState(1.7);
  const [elevation, setElevation] = useState(36.5);
  const [baseElevation, setBaseElevation] = useState(0);
  const [bearing, setBearing] = useState(58.2);
  const [observerX, setObserverX] = useState(104);
  const [animateMeasurement, setAnimateMeasurement] = useState(true);
  const [dragging, setDragging] = useState<"observer" | "target" | null>(null);
  const buildingHeight = distanceValue * Math.tan(elevation * DEG) + eyeHeight + baseElevation;
  const lineOfSight = distanceValue / Math.cos(elevation * DEG);
  const tide = 2.4 + 1.1 * Math.sin((bearing + elevation) * DEG);
  const targetX = 474;
  const groundY = 334;
  const topY = clamp(groundY - buildingHeight * 3.25, 38, 290);

  const sceneMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = clamp(((event.clientX - box.left) / box.width) * 590, 55, 470);
    if (dragging === "observer") {
      setObserverX(Math.min(x, targetX - 70));
      setDistanceValue(clamp((targetX - x) / 4.62, 10, 120));
    } else {
      const y = clamp(((event.clientY - box.top) / box.height) * 390, 34, groundY - 12);
      setElevation(clamp(Math.atan2(groundY - y, targetX - observerX) / DEG, 3, 85));
    }
  };

  return (
    <Phase1LabChrome page={page}>
      {(mode) => (
        <>
          <Panel title="Measurement setup" className="trig-target-card trig-target-application-controls">
            <SliderRow label={mode === "Bearings" || mode === "Navigation" ? "Bearing" : "Observer distance (horizontal)"} value={mode === "Bearings" || mode === "Navigation" ? bearing : distanceValue} min={mode === "Bearings" || mode === "Navigation" ? 0 : 10} max={mode === "Bearings" || mode === "Navigation" ? 360 : 500} step={0.1} onChange={mode === "Bearings" || mode === "Navigation" ? setBearing : setDistanceValue} unit={mode === "Bearings" || mode === "Navigation" ? "°" : "m"} />
            <SliderRow label="Observer eye height" value={eyeHeight} min={0.5} max={3} step={0.05} onChange={setEyeHeight} unit="m" />
            <SliderRow label={mode === "Periodic Models" ? "Phase angle" : mode === "Navigation" ? "Second bearing" : "Angle of elevation"} value={elevation} min={0} max={mode === "Navigation" ? 180 : 85} step={0.1} onChange={setElevation} unit="°" />
            <SliderRow label="Target base elevation" value={baseElevation} min={-10} max={10} step={0.1} onChange={setBaseElevation} unit="m" />
            <label className="msk-field"><span>Units</span><select aria-label="Measurement units"><option>Metric (m)</option><option>Imperial (ft)</option></select></label>
            <label className="msk-field"><span>Instrument mode</span><select aria-label="Instrument mode"><option>Theodolite</option><option>Clinometer</option></select></label>
            <Toggle checked={animateMeasurement} onChange={setAnimateMeasurement}>Animate measurement</Toggle>
            <button type="button" className="msk-soft" onClick={() => { setDistanceValue(80); setEyeHeight(1.7); setElevation(36.5); setBaseElevation(0); setBearing(58.2); setObserverX(104); }}>↻ Reset measurement</button>
          </Panel>

          <section className="msk-panel msk-canvas trig-target-application-scene" data-trig-target-mode={mode} data-app-mode={mode}>
            <svg
              className="msk-graph is-interactive"
              viewBox="0 0 590 390"
              role="img"
              aria-label={`${mode} real-world trigonometry scene`}
              onPointerMove={sceneMove}
              onPointerUp={() => setDragging(null)}
              onPointerLeave={() => setDragging(null)}
            >
              <defs>
                <linearGradient id="trig-app-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#5598d0" /><stop offset="1" stopColor="#d9efff" /></linearGradient>
                <linearGradient id="trig-app-glass" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#233b56" /><stop offset=".5" stopColor="#7aa2bd" /><stop offset="1" stopColor="#1e334b" /></linearGradient>
              </defs>
              <rect width="590" height="390" fill="url(#trig-app-sky)" />
              <circle cx="126" cy="86" r="26" fill="#fff" opacity=".5" /><circle cx="155" cy="88" r="35" fill="#fff" opacity=".46" /><circle cx="190" cy="91" r="23" fill="#fff" opacity=".42" />
              <path d="M0 274 Q70 234 145 267 T300 259 T460 251 T590 266 V390 H0Z" fill="#4f7d35" />
              <path d="M0 302 Q90 270 175 300 T340 286 T500 295 T590 284 V390 H0Z" fill="#739546" />
              <rect x="458" y={topY} width="76" height={groundY - topY} fill="url(#trig-app-glass)" stroke="#334155" />
              {Array.from({ length: 5 }, (_, column) => <line key={`c${column}`} x1={466 + column * 14} y1={topY + 8} x2={466 + column * 14} y2={groundY - 4} stroke="#b8d1df" opacity=".65" />)}
              {Array.from({ length: 9 }, (_, row) => <line key={`r${row}`} x1="460" y1={topY + 14 + row * ((groundY - topY - 18) / 9)} x2="532" y2={topY + 14 + row * ((groundY - topY - 18) / 9)} stroke="#b8d1df" opacity=".55" />)}
              <rect x="0" y={groundY} width="590" height={390 - groundY} fill="#527c2e" />
              <Compass bearing={bearing} />

              {mode === "Periodic Models" ? (
                <>
                  <rect x="0" y="235" width="590" height="155" fill="#267ea5" opacity=".82" />
                  <polyline points={Array.from({ length: 100 }, (_, index) => `${index * 6},${260 - 20 * Math.sin(index / 8 + elevation * DEG)}`).join(" ")} fill="none" stroke="#e0f2fe" strokeWidth="3" />
                  <line x1="28" y1={300 - tide * 12} x2="560" y2={300 - tide * 12} stroke="#fbbf24" strokeDasharray="6 4" />
                  <text x="32" y="220" fill="#fff" fontSize="16">Tide model h(t) = 2.4 + 1.1 sin(ωt + φ)</text>
                </>
              ) : mode === "Bearings" ? (
                <>
                  <circle cx="300" cy="220" r="94" fill="rgba(255,255,255,.22)" stroke="#e0f2fe" strokeWidth="2" />
                  <line x1="300" y1="220" x2="300" y2="112" stroke="#ef4444" strokeDasharray="4 3" />
                  <line x1="300" y1="220" x2={300 + 94 * Math.sin(bearing * DEG)} y2={220 - 94 * Math.cos(bearing * DEG)} stroke="#fbbf24" strokeWidth="4" />
                  <text x="314" y="206" fill="#fff" fontSize="14">{fmt(bearing, 1)}° clockwise from N</text>
                </>
              ) : mode === "Navigation" ? (
                <>
                  <path d={`M80 330 L${80 + 270 * Math.sin(bearing * DEG)} ${330 - 270 * Math.cos(bearing * DEG)} L510 330 Z`} fill="rgba(14,165,233,.18)" stroke="#e0f2fe" strokeWidth="2" />
                  <circle cx="80" cy="330" r="7" fill="#fbbf24" /><circle cx="510" cy="330" r="7" fill="#a78bfa" />
                  <text x="30" y="40" fill="#fff" fontSize="14">Two bearings triangulate the vessel</text>
                </>
              ) : mode === "Surveying" ? (
                <>
                  <line x1="82" y1="330" x2="360" y2="330" stroke="#22d3ee" strokeWidth="4" />
                  <line x1="82" y1="330" x2="290" y2="100" stroke="#fbbf24" strokeWidth="2" />
                  <line x1="360" y1="330" x2="290" y2="100" stroke="#a78bfa" strokeWidth="2" />
                  <circle cx="290" cy="100" r="7" fill="#f97316" />
                  <text x="178" y="350" fill="#fff" fontSize="13">measured baseline {fmt(distanceValue, 1)} m</text>
                </>
              ) : (
                <>
                  <line x1={observerX} y1={groundY} x2={targetX} y2={groundY} stroke="#22d3ee" strokeWidth="3" />
                  <line x1={observerX} y1={groundY - eyeHeight * 3.25} x2={targetX} y2={topY} stroke="#fff" strokeWidth="2" strokeDasharray="7 5" />
                  <line x1={targetX} y1={groundY} x2={targetX} y2={topY} stroke="#c084fc" strokeWidth="4" />
                  <path d={`M ${targetX - 12} ${groundY} v-12 h12`} fill="none" stroke="#fff" strokeWidth="2" />
                  <path d={`M ${observerX + 42} ${groundY - eyeHeight * 3.25} A 42 42 0 0 0 ${observerX + 42 * Math.cos(elevation * DEG)} ${groundY - eyeHeight * 3.25 - 42 * Math.sin(elevation * DEG)}`} fill="none" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx={observerX} cy={groundY - 18} r="9" fill="#fbbf24" onPointerDown={(event) => { event.preventDefault(); setDragging("observer"); }} />
                  <line x1={observerX} y1={groundY - 9} x2={observerX} y2={groundY} stroke="#334155" strokeWidth="5" />
                  <circle cx={targetX} cy={topY} r="8" fill="#f97316" stroke="#fff" strokeWidth="2" onPointerDown={(event) => { event.preventDefault(); setDragging("target"); }} />
                  <text x={(observerX + targetX) / 2} y={groundY - 9} fill="#06b6d4" fontSize="13" textAnchor="middle">{fmt(distanceValue, 2)} m</text>
                  <text x={observerX + 52} y={groundY - 22} fill="#fff" fontSize="13">{fmt(elevation, 1)}°</text>
                  <g className="trig-target-calculated-height">
                    <rect x="480" y={(topY + groundY) / 2 - 24} width="90" height="52" rx="7" fill="#7c3aed" opacity=".9" />
                    <text x="525" y={(topY + groundY) / 2 - 5} fill="#fff" fontSize="10" textAnchor="middle">Calculated height</text>
                    <text x="525" y={(topY + groundY) / 2 + 15} fill="#fff" fontSize="15" fontWeight="700" textAnchor="middle">{fmt(buildingHeight, 2)} m</text>
                  </g>
                </>
              )}
            </svg>
            <p className="msk-note trig-target-scene-hint">ⓘ Drag the observer or target to explore. Controls and overlays update in real time.</p>
          </section>

          <aside className="msk-panel msk-live trig-target-card trig-target-application-values">
            <h2>Live values</h2>
            <LiveRow color="#06b6d4" label={mode === "Bearings" || mode === "Navigation" ? "Bearing" : "Horizontal distance (d)"} value={mode === "Bearings" || mode === "Navigation" ? `${fmt(bearing, 1)}°` : `${fmt(distanceValue, 2)} m`} />
            <LiveRow color="#f59e0b" label={mode === "Periodic Models" ? "Phase" : "Angle of elevation (θ)"} value={`${fmt(elevation, 1)}°`} />
            {mode === "Heights & Distances" ? (
              <>
                <LiveRow color="#7c3aed" label="Observer eye height" value={`${fmt(eyeHeight, 2)} m`} />
                <LiveRow color="#8b5cf6" label="Target base elevation" value={`${fmt(baseElevation, 2)} m`} />
                <LiveRow color="#a78bfa" label="Line of sight length" value={`${fmt(lineOfSight, 2)} m`} />
                <h2>Trigonometric relation</h2>
                <p className="msk-formula">tan(θ) = building height above eye / horizontal distance</p>
                <h2>Substituted formula</h2>
                <p className="msk-formula trig-target-substitution">tan({fmt(elevation, 1)}°) = H<sub>above eye</sub> / {fmt(distanceValue, 2)}</p>
                <div className="trig-target-result"><small>Total height (H)</small><strong>{fmt(buildingHeight, 2)} m</strong><small>(above ground at target base)</small></div>
                <LiveRow color="#f97316" label="Uncertainty estimate" value={`± ${fmt(buildingHeight * 0.008, 2)} m (0.8% relative)`} />
              </>
            ) : null}
            {mode === "Bearings" ? <p className="msk-formula">bearing = clockwise angle measured from north</p> : null}
            {mode === "Navigation" ? <LiveRow color="#7c3aed" label="Second bearing" value={`${fmt(elevation, 1)}°`} /> : null}
            {mode === "Surveying" ? <LiveRow color="#10b981" label="Baseline" value={`${fmt(distanceValue, 2)} m`} /> : null}
            {mode === "Periodic Models" ? <LiveRow color="#10b981" label="Predicted tide height" value={`${fmt(tide, 2)} m`} /> : null}
            <h2>Step explanation</h2>
            <StepList items={
              mode === "Bearings" ? ["Face geographic north.", "Measure clockwise to the target.", "Combine bearing with distance to locate it."]
                : mode === "Navigation" ? ["Plot the first bearing ray.", "Plot the second observation.", "Their intersection fixes the position."]
                  : mode === "Surveying" ? ["Measure a baseline.", "Sight the target from both ends.", "Solve the resulting oblique triangle."]
                    : mode === "Periodic Models" ? ["Choose a midline and amplitude.", "Set period from the repeating cycle.", "Shift phase to align a peak."]
                      : [`Measure horizontal distance d = ${fmt(distanceValue, 1)} m.`, `Measure angle of elevation θ = ${fmt(elevation, 1)}°.`, "Compute d tan(θ), then add eye and base elevations."]
            } />
            <ChallengeBox page={page} mode={mode} />
          </aside>
        </>
      )}
    </Phase1LabChrome>
  );
}
