import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import {
  ChallengeBox,
  LiveRow,
  Panel,
  SliderRow,
  fmt,
  useLabMode,
} from "../studioLabKit";
import CirclesGeometryLab from "../../geometry/circles/CirclesLab";
import RightTriangleLab from "./RightTriangleLab";
import UnitCircleLab from "./UnitCircleLab";
import RemainingStudioLab from "./RemainingStudioLabs";
import ModellingStudioLab from "./ModellingLabs";
import LinearAlgebraLab from "../../linear-algebra/LinearAlgebraLabs";
import ComplexNumbersLab from "../../complex/ComplexNumbersLabs";
import CoordinateLab from "../../geometry/coordinate/CoordinateLab";
import PolygonsLab from "../../geometry/polygons/PolygonsLab";
import TrianglesLab from "../../geometry/triangles/TrianglesLab";
import { crtTwo, gcd, hopCycle, inverseMod, solveLinear } from "../../discrete/modular/modularMath";
import { IdentitiesLab as TargetIdentitiesLab } from "./IdentitiesLab";
import { InverseTrigLab as TargetInverseTrigLab } from "./InverseTrigLab";
import { TrigGraphsLab as TargetTrigGraphsLab } from "./TrigonometryConceptLabs";
import { ObliqueTriangleLab as TargetObliqueTriangleLab } from "./ObliqueTriangleLab";
import { WavesHarmonicsLab as TargetWavesHarmonicsLab } from "./WavesHarmonicsLab";

export default function DedicatedStudioLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  if (page.route.includes("mathematical-modelling") && page.id !== "home") return <ModellingStudioLab page={page} />;
  if (page.route.includes("linear-algebra") && page.id !== "home") return <LinearAlgebraLab page={page} extra={extra} />;
  if (page.route.includes("complex-numbers") && page.id !== "home") return <ComplexNumbersLab page={page} extra={extra} />;
  if (page.id === "right-triangle") return <RightTriangleLab page={page} />;
  if (page.id === "unit-circle") return <UnitCircleLab page={page} />;
  if (page.id === "polygons") return <PolygonsLab page={page} />;
  if (page.id === "coordinate") return <CoordinateLab page={page} />;
  if (page.id === "triangles") return <TrianglesLab page={page} />;
  if (page.id === "circles") return <CirclesGeometryLab page={page} />;
  if (page.id === "graphs" && page.route.includes("trigonometry")) return <TargetTrigGraphsLab page={page} />;
  if (page.id === "modular-arithmetic") return <ModularLab page={page} />;
  if (page.id === "interactive-distributions") return <DistributionsLab page={page} />;
  if (page.id === "identities") return <TargetIdentitiesLab page={page} />;
  if (page.id === "inverse") return <TargetInverseTrigLab page={page} />;
  if (page.id === "oblique") return <TargetObliqueTriangleLab page={page} />;
  if (page.id === "waves") return <TargetWavesHarmonicsLab page={page} />;
  const remaining = RemainingStudioLab({ page, extra });
  if (remaining) return remaining;
  return <SmartTopicLab page={page} extra={extra} />;
}

function LabChrome({ page, children }: { page: StudioMockupPage; children: ReactNode | ((mode: string) => ReactNode) }) {
  return <Phase1LabChrome page={page}>{children}</Phase1LabChrome>;
}

function ModularLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(5);
  const [n, setN] = useState(12);
  const [b, setB] = useState(10);
  const [m, setM] = useState(5);
  const [r, setR] = useState(3);
  const [tick, setTick] = useState(0);
  const hops = hopCycle(a, n);
  const inv = inverseMod(a, n);
  const linear = solveLinear(a, b, n);
  const crt = crtTwo(a % n, n, r, m);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 700);
    return () => window.clearInterval(id);
  }, [a, n]);
  const hopAt = hops[tick % hops.length] ?? 0;
  return (
    <LabChrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <SliderRow label="a" value={a} min={1} max={20} step={1} onChange={setA} />
            <SliderRow label="Modulus n" value={n} min={3} max={16} step={1} onChange={setN} />
            {mode === "Linear Congruences" ? <SliderRow label="b in ax ≡ b" value={b} min={0} max={20} step={1} onChange={setB} /> : null}
            {mode === "Clock Arithmetic" || mode === "Cycles" ? <p className="msk-note">Hops of +{a} on ℤ/{n}ℤ. Cycle length {hops.length}.</p> : null}
            {mode === "Inverses" ? <p className="msk-note">An inverse exists iff gcd(a,n)=1. gcd({a},{n})={gcd(a, n)}.</p> : null}
            {mode === "Congruence" ? <p className="msk-note">{a} ≡ {((a % n) + n) % n} (mod {n}). Same residue class means same clock hour.</p> : null}
            {mode === "Linear Congruences" ? (
              <>
                <SliderRow label="Second modulus m" value={m} min={2} max={15} step={1} onChange={setM} />
                <SliderRow label="x ≡ r (mod m)" value={r} min={0} max={14} step={1} onChange={setR} />
                <p className="msk-note">CRT needs gcd(n,m) to divide a−r. Solutions to {a}x ≡ {b} (mod {n}): {linear.length ? linear.join(", ") : "none"}.</p>
              </>
            ) : null}
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg
              className="msk-graph is-interactive"
              viewBox="0 0 360 360"
              role="img"
              aria-label="Modular clock"
              onPointerDown={(event: PointerEvent<SVGSVGElement>) => {
                const box = event.currentTarget.getBoundingClientRect();
                const x = ((event.clientX - box.left) / box.width) * 360 - 180;
                const y = ((event.clientY - box.top) / box.height) * 360 - 180;
                const ang = (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360;
                const hour = Math.round(ang / (360 / n)) % n;
                setA(((hour - hopAt + n) % n) || n);
              }}
            >
              <rect width="360" height="360" fill="#f8fbff" />
              <circle cx="180" cy="180" r="120" fill="none" stroke="#8b45f4" strokeWidth="2" />
              {Array.from({ length: n }, (_, i) => {
                const t = (-90 + i * 360 / n) * Math.PI / 180;
                return (
                  <g key={i}>
                    <circle cx={180 + 120 * Math.cos(t)} cy={180 + 120 * Math.sin(t)} r={i === hopAt ? 11 : inv != null && i === inv ? 11 : 8} fill={i === hopAt ? "#f59e0b" : inv != null && i === inv ? "#10b981" : i === hops[1] ? "#08b9dd" : "#147df2"} />
                    <text x={180 + 148 * Math.cos(t)} y={184 + 148 * Math.sin(t)} fontSize="11" textAnchor="middle">{i}</text>
                  </g>
                );
              })}
              {mode === "Linear Congruences" && crt ? (
                <text x="70" y="340" fontSize="12">CRT x ≡ {crt.x} (mod {crt.modulus})</text>
              ) : null}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label={`${a} mod ${n}`} value={String(((a % n) + n) % n)} />
            <LiveRow color="#8b45f4" label="Inverse" value={inv == null ? "none (gcd≠1)" : String(inv)} />
            <LiveRow color="#f59e0b" label="Cycle" value={hops.slice(0, 8).join(" → ")} />
            {mode === "Linear Congruences" ? <LiveRow color="#10b981" label="CRT" value={crt ? `x=${crt.x} (mod ${crt.modulus})` : "inconsistent"} /> : null}
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </LabChrome>
  );
}

function DistributionsLab({ page }: { page: StudioMockupPage }) {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [lo, setLo] = useState(-1);
  const [hi, setHi] = useState(1);
  const pdf = (x: number) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
  const cdf = (z: number) => {
    const sign = z < 0 ? -1 : 1;
    const a = Math.abs(z) / Math.SQRT2;
    const t = 1 / (1 + 0.3275911 * a);
    const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
    return 0.5 * (1 + sign * erf);
  };
  const p = cdf((hi - mu) / sigma) - cdf((lo - mu) / sigma);
  const pts = Array.from({ length: 121 }, (_, i) => {
    const x = mu - 4 * sigma + (i / 120) * 8 * sigma;
    return `${20 + i * 4},${200 - pdf(x) * 160 * sigma}`;
  }).join(" ");
  return (
    <LabChrome page={page}>
      <Panel title="Distribution">
        <SliderRow label="Mean μ" value={mu} min={-3} max={3} step={0.1} onChange={setMu} />
        <SliderRow label="σ" value={sigma} min={0.4} max={2.5} step={0.1} onChange={setSigma} />
        <SliderRow label="Shade a" value={lo} min={-4} max={4} step={0.1} onChange={setLo} />
        <SliderRow label="Shade b" value={hi} min={-4} max={4} step={0.1} onChange={setHi} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 520 240" role="img" aria-label="Normal curve">
          <rect width="520" height="240" fill="#f8fbff" />
          <polyline points={pts} fill="none" stroke="#8b45f4" strokeWidth="2.2" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#8b45f4" label="P(a < X < b)" value={fmt(p, 3)} />
        <LiveRow color="#08b9dd" label="68% band" value="μ ± σ" />
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function SmartTopicLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const { mode } = useLabMode(page);
  const [a, setA] = useState(2.5);
  const [b, setB] = useState(1.5);
  const [n, setN] = useState(8);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(0);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      tRef.current += 0.08;
      setT(tRef.current);
      setA((value) => -8 + ((value + 8 + 0.08) % 20));
    }, 80);
    return () => window.clearInterval(id);
  }, [playing]);

  const live = compute(page.id, mode, a, b, n, t);
  return (
    <LabChrome page={page}>
      <Panel title={`${mode} controls`}>
        <p className="msk-note">{page.description}</p>
        <SliderRow label={live.aLabel} value={a} min={live.aMin} max={live.aMax} step={0.1} onChange={setA} />
        <SliderRow label={live.bLabel} value={b} min={-6} max={8} step={0.1} onChange={setB} />
        <SliderRow label={live.nLabel} value={n} min={1} max={24} step={1} onChange={setN} />
        <div className="msk-btn-row">
          <button className="msk-cta" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play animation"}</button>
          <button className="msk-soft" type="button" onClick={() => { setA(2.5); setB(1.5); setN(8); }}>Reset</button>
        </div>
      </Panel>
      <section className="msk-panel msk-canvas">
        {extra ?? <TopicCanvas pageId={page.id} mode={mode} a={a} b={b} n={n} t={t} />}
      </section>
      <aside className="msk-panel msk-live">
        <h2>Live values</h2>
        {live.rows.map((row) => <LiveRow key={row.label} color={row.color} label={row.label} value={row.value} />)}
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function compute(pageId: string, mode: string, a: number, b: number, n: number, t: number) {
  const r = Math.hypot(a, b);
  const rows: Array<{ label: string; value: string; color: string }> = [];
  let aLabel = "Parameter a", bLabel = "Parameter b", nLabel = "Steps n", aMin = -8, aMax = 12;
  if (/matrix|row|transform|det|eigen|ortho|least|playground/.test(pageId)) {
    aLabel = "Matrix a₁₁"; bLabel = "Matrix a₁₂"; nLabel = "Size n";
    rows.push({ label: "det model", value: fmt(a * n - b), color: "#8b45f4" }, { label: "‖v‖", value: fmt(r), color: "#147df2" });
  } else if (/polygon|solid|measure|coordinate|construction|proof/.test(pageId)) {
    aLabel = "Length"; bLabel = "Height"; nLabel = "Sides / slices";
    rows.push({ label: "Area", value: fmt(Math.abs(a * b)), color: "#08b9dd" }, { label: "Perimeter", value: fmt(2 * (Math.abs(a) + Math.abs(b))), color: "#147df2" });
  } else if (/polar|euler|root|loci|fractal|rotation|arithmetic|circuit/.test(pageId)) {
    aLabel = "Re(z)"; bLabel = "Im(z)"; nLabel = "n / terms";
    rows.push({ label: "|z|", value: fmt(r), color: "#147df2" }, { label: "arg z", value: `${fmt(Math.atan2(b, a) * 180 / Math.PI, 1)}°`, color: "#8b45f4" });
  } else if (/motion|population|finance|opt|network|regress|periodic|numeric|compar/.test(pageId)) {
    aLabel = "Rate / slope"; bLabel = "Initial / intercept"; nLabel = "Horizon";
    rows.push({ label: "Model y", value: fmt(b * Math.exp(0.08 * a) + t), color: "#08b9dd" }, { label: "RMSE proxy", value: fmt(Math.abs(a - b) / (n + 1), 3), color: "#f59e0b" });
  } else if (/prime|pattern|combin|logic|set|graph|algo|crypto|number/.test(pageId)) {
    aLabel = "Value a"; bLabel = "Value b"; nLabel = "Modulus / n";
    rows.push({ label: "Count", value: String(Math.round(Math.abs(a * n) + b)), color: "#147df2" }, { label: "mod n", value: String(((Math.round(a) % n) + n) % n), color: "#8b45f4" });
  } else if (/data|descript|experiment|count|clt|confidence|hypothes|correl|anova/.test(pageId)) {
    aLabel = "Mean / p"; bLabel = "Spread / n effect"; nLabel = "Sample size";
    rows.push({ label: "z", value: fmt((a - 0) / Math.max(0.2, b), 3), color: "#8b45f4" }, { label: "SE", value: fmt(Math.abs(b) / Math.sqrt(n), 3), color: "#147df2" });
  } else {
    rows.push({ label: "Mode", value: mode, color: "#08b9dd" }, { label: "a + b", value: fmt(a + b), color: "#147df2" });
  }
  rows.unshift({ label: "Mode", value: mode, color: "#64748b" });
  return { rows, aLabel, bLabel, nLabel, aMin, aMax };
}

function TopicCanvas({ pageId, mode, a, b, n, t }: { pageId: string; mode: string; a: number; b: number; n: number; t: number }) {
  const x1 = 210 + a * 14;
  const y1 = 160 - b * 12;
  const sides = Math.max(3, Math.round(n / 2 + 3));
  if (/polygon/.test(pageId)) {
    const pts = Array.from({ length: sides }, (_, i) => {
      const ang = (i / sides) * Math.PI * 2 - Math.PI / 2;
      return `${210 + Math.cos(ang) * (40 + a * 6)},${160 + Math.sin(ang) * (40 + a * 6)}`;
    }).join(" ");
    return <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label={mode} data-mode-canvas={mode}><rect width="420" height="320" fill="#f8fbff" /><polygon points={pts} fill="rgba(139,69,244,.12)" stroke="#8b45f4" strokeWidth="2" /></svg>;
  }
  if (/fractal/.test(pageId)) {
    return (
      <svg className="msk-graph is-dark" viewBox="0 0 420 320" role="img" aria-label="Mandelbrot">
        <rect width="420" height="320" fill="#061428" />
        {Array.from({ length: 220 }, (_, i) => {
          const x = -2 + (i % 20) * 0.16 + a * 0.02;
          const y = -1.2 + Math.floor(i / 20) * 0.2 + b * 0.02;
          let zx = 0, zy = 0, k = 0;
          while (zx * zx + zy * zy < 4 && k < 12 + n) { const nx = zx * zx - zy * zy + x; zy = 2 * zx * zy + y; zx = nx; k += 1; }
          return <rect key={i} x={(i % 20) * 21} y={Math.floor(i / 20) * 29} width="21" height="29" fill={k > 10 + n / 2 ? "#0f172a" : `hsl(${200 + k * 8} 70% 55%)`} />;
        })}
      </svg>
    );
  }
  if (/inverse/.test(pageId)) {
    return (
      <svg className="msk-graph is-dark" viewBox="0 0 420 320" role="img" aria-label="Principal inverse">
        <rect width="420" height="320" fill="#061428" />
        <path d={`M40 ${260 - a * 8} C 140 ${260 - a * 8}, 180 ${80 + b * 6}, 380 ${60 + b * 4}`} fill="none" stroke="#c4b5fd" strokeWidth="3" />
        <circle cx={210 + n * 4} cy={160 - a * 10} r="7" fill="#fbbf24" />
        <text x="24" y="32" fill="#67e8f9" fontSize="14">arcsin / arccos principal branch</text>
      </svg>
    );
  }
  if (/application/.test(pageId)) {
    return (
      <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label="Angle of elevation">
        <rect width="420" height="320" fill="#f8fbff" />
        <polygon points={`40,280 ${180 + a * 12},280 ${180 + a * 12},${80 + b * 8}`} fill="#e0f7ff" stroke="#147df2" strokeWidth="2" />
        <text x="24" y="32" fill="#334155" fontSize="14">h = d tan θ · {mode}</text>
      </svg>
    );
  }
  if (/epidemic/.test(pageId)) {
    return (
      <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label="SIR curves">
        <rect width="420" height="320" fill="#f8fbff" />
        <path d={`M20 80 C 120 ${40 + a * 4}, 220 90, 400 ${60 + b * 3}`} fill="none" stroke="#ef4444" strokeWidth="3" />
        <path d={`M20 220 C 140 ${180 - n}, 260 240, 400 260`} fill="none" stroke="#10b981" strokeWidth="3" />
        <text x="24" y="32" fill="#334155" fontSize="14">S / I / R compartments</text>
      </svg>
    );
  }
  return (
    <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label={`${pageId} ${mode}`} data-mode-canvas={mode}>
      <rect width="420" height="320" fill="#f8fbff" />
      <line x1="30" y1="160" x2="400" y2="160" stroke="#cbd5e1" />
      <line x1="210" y1="20" x2="210" y2="300" stroke="#cbd5e1" />
      <circle cx={x1} cy={y1} r="7" fill="#08b9dd" />
      <circle cx={210 + n * 6} cy={160 - a * 8 - Math.sin(t) * 10} r="6" fill="#8b45f4" />
      <line x1="210" y1="160" x2={x1} y2={y1} stroke="#147df2" strokeWidth="2.4" />
      <text x="24" y="28" fill="#334155" fontSize="12">{mode}</text>
    </svg>
  );
}
