import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import StudioHomeButtons from "../../components/ui/StudioHomeButtons";
import { StudioCanvasToolbar } from "../../components/ui/StudioCanvasToolbar";
import { Line, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import ThreeSceneWrapper from "../../components/three/ThreeSceneWrapper";
import MathExpression from "../../components/ui/MathExpression";
import { isPerfectSquareInteger, normalizeRational } from "../../utils/coreAccuracyOracles";
import { roundTo } from "../../utils/math";
import {
  NUMBER_SYSTEMS_ROUTES,
  dismissCoach,
  markLabComplete,
  repeatingDecimal,
  terminatingDenominator,
  type NumberClassBand,
  type NumberSystemsPage,
} from "../../pages/numberSystemsStudioSession";

type LabProps = {
  onComplete?: () => void;
};

const LESSONS = {
  rational: { id: "60", route: "/lessons/numbers-and-arithmetic/60-rational-numbers" },
  irrational: { id: "61", route: "/lessons/numbers-and-arithmetic/61-irrational-numbers" },
  real: { id: "62", route: "/lessons/numbers-and-arithmetic/62-real-numbers" },
};

const NCERT = {
  c7: { label: "Class 7 rational lab", to: "/ncert/class-7-rational-numbers" },
  c8: { label: "Class 8 rational properties", to: "/ncert/class-8-rational-numbers" },
  c9: { label: "Class 9 number systems", to: "/ncert/class-9-number-systems" },
  c10: { label: "Class 10 real numbers", to: "/ncert/class-10-real-numbers" },
};

export const NUMBER_LABS: Array<{
  id: Exclude<NumberSystemsPage, "home">;
  label: string;
  description: string;
  minutes: number;
  level: string;
  grade: NumberClassBand[];
  modes: string[];
}> = [
  { id: "rational", label: "Rational numbers", description: "Connect p/q, reduced form, decimals, and a fraction bar.", minutes: 8, level: "Start here", grade: ["6-7", "8-10"], modes: ["Fraction", "Decimal", "Number line"] },
  { id: "irrational", label: "Irrational numbers", description: "Compare square roots that stay irrational with perfect-square rationals.", minutes: 8, level: "Core", grade: ["8-10", "jee"], modes: ["Surds", "root 2 vs 9", "pi and e"] },
  { id: "real-line", label: "Real number line", description: "Place rationals and irrationals together and insert points between them.", minutes: 8, level: "Core", grade: ["8-10", "jee"], modes: ["Density", "Zoom", "Insert"] },
  { id: "hierarchy", label: "Number hierarchy", description: "See N ⊂ W ⊂ Z ⊂ Q ⊂ R as nested sets, with an optional 3D rail.", minutes: 10, level: "Core", grade: ["8-10", "jee"], modes: ["Nested sets", "3D"] },
  { id: "concepts", label: "Concept cards", description: "Jump from each idea to the lab that shows it.", minutes: 6, level: "Review", grade: ["6-7", "8-10", "jee"], modes: ["Mini canvases"] },
  { id: "practice", label: "Practice & accuracy", description: "Classify numbers, then check the precise definitions.", minutes: 10, level: "Apply", grade: ["8-10", "jee"], modes: ["Quiz", "Accuracy"] },
];

export function NestedSetsHero({ progress, onSelect }: { progress?: number; onSelect?: (id: string) => void }) {
  return (
    <section className="ns-hero" aria-label="Nested number sets">
      <svg viewBox="0 0 640 160" className="ns-hero-sets" role="img" aria-label="N subset W subset Z subset Q subset R. Click a set to filter labs.">
        <a href="/number-systems/hierarchy" onClick={(event) => { event.preventDefault(); onSelect?.("hierarchy"); }}>
          <rect x="12" y="16" width="616" height="128" rx="22" fill="#e0f2fe" stroke="#0f172a" />
          <text x="520" y="40" fontWeight="800" fontSize="13">ℝ</text>
        </a>
        <a href="/number-systems/rational" onClick={(event) => { event.preventDefault(); onSelect?.("rational"); }}>
          <rect x="28" y="44" width="360" height="84" rx="16" fill="#ecfeff" stroke="#0f172a" />
          <text x="320" y="64" fontWeight="800" fontSize="13">ℚ</text>
        </a>
        <a href="/number-systems/irrational" onClick={(event) => { event.preventDefault(); onSelect?.("irrational"); }}>
          <rect x="410" y="44" width="200" height="84" rx="16" fill="#fff7ed" stroke="#0f172a" />
          <text x="430" y="64" fontWeight="800" fontSize="12">ℝ \\ ℚ</text>
        </a>
        <a href="/number-systems/hierarchy" onClick={(event) => { event.preventDefault(); onSelect?.("hierarchy"); }}>
          <rect x="48" y="68" width="250" height="48" rx="12" fill="#f8fafc" stroke="#0f172a" />
          <text x="220" y="88" fontWeight="800" fontSize="12">ℤ</text>
        </a>
        <a href="/number-systems/rational" onClick={(event) => { event.preventDefault(); onSelect?.("rational"); }}>
          <rect x="64" y="82" width="140" height="26" rx="8" fill="#fefce8" stroke="#0f172a" />
          <text x="78" y="100" fontWeight="800" fontSize="12">ℕ ⊂ W</text>
        </a>
        <text x="560" y="130" fontWeight="800" fontSize="12">ℂ</text>
      </svg>
      {progress != null ? <p>Studio progress {progress}% · ℕ ⊂ W ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ</p> : null}
    </section>
  );
}

function useNumberMode(page: NumberSystemsPage) {
  const modes = NUMBER_LABS.find((item) => item.id === page)?.modes ?? [];
  const [params, setParams] = useSearchParams();
  const requested = params.get("mode") ?? "";
  const mode = modes.includes(requested) ? requested : (modes[0] ?? "");
  const setMode = (next: string) => {
    const copy = new URLSearchParams(params);
    copy.set("mode", next);
    setParams(copy, { replace: true });
  };
  return { mode, setMode, modes };
}

export function ncertFor(page: NumberSystemsPage) {
  if (page === "irrational" || page === "hierarchy") return [NCERT.c9, NCERT.c10, NCERT.c8];
  if (page === "real-line" || page === "practice") return [NCERT.c9, NCERT.c10, NCERT.c7];
  return [NCERT.c7, NCERT.c8, NCERT.c9, NCERT.c10];
}

export function CoachBanner({ text }: { text: string }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="ns-coach" role="status">
      <p>{text}</p>
      <button type="button" onClick={() => { dismissCoach(); setOpen(false); }}>Got it</button>
    </div>
  );
}

function CompactSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="ns-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} aria-label={label} onChange={(event) => onChange(Number(event.target.value))} />
      <output>{value}</output>
    </label>
  );
}

export function NumberLine({
  values,
  min,
  max,
  zoomAround,
}: {
  values: Array<{ label: string; value: number; color: string }>;
  min?: number;
  max?: number;
  zoomAround?: boolean;
}) {
  const span = useMemo(() => {
    if (!zoomAround || values.length === 0) return { min: min ?? -4, max: max ?? 8 };
    const nums = values.map((item) => item.value);
    const lo = Math.min(...nums);
    const hi = Math.max(...nums);
    const pad = Math.max(0.35, (hi - lo) * 0.45 || 1);
    return { min: Math.floor((lo - pad) * 2) / 2, max: Math.ceil((hi + pad) * 2) / 2 };
  }, [max, min, values, zoomAround]);
  const map = (value: number) => 48 + ((Math.max(span.min, Math.min(span.max, value)) - span.min) / Math.max(0.001, span.max - span.min)) * 664;
  const ticks: number[] = [];
  const step = span.max - span.min > 10 ? 1 : 0.5;
  for (let tick = span.min; tick <= span.max + 1e-9; tick += step) ticks.push(Number(tick.toFixed(2)));
  return (
    <svg viewBox="0 0 760 220" className="ns-line" role="img" aria-label="Number line">
      <rect width="760" height="220" rx="16" className="ns-line-bg" />
      <line x1="48" x2="712" y1="128" y2="128" stroke="#64748b" strokeWidth="3" />
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={map(tick)} x2={map(tick)} y1="116" y2="140" stroke="#94a3b8" />
          <text x={map(tick)} y="162" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">{tick}</text>
        </g>
      ))}
      {values.map((item, index) => (
        <g key={`${item.label}-${index}`}>
          <line x1={map(item.value)} x2={map(item.value)} y1={48 + index * 18} y2="128" stroke={item.color} strokeWidth="3" />
          <circle cx={map(item.value)} cy="128" r="8" fill={item.color} stroke="#0f172a" strokeWidth="2" />
          <text x={Math.min(700, map(item.value) + 10)} y={42 + index * 18} fontSize="13" fontWeight="800" fill="currentColor">{item.label}: {roundTo(item.value, 4)}</text>
        </g>
      ))}
    </svg>
  );
}

function FractionBars({ p, q }: { p: number; q: number }) {
  const parts = Math.max(1, Math.abs(q));
  const filled = Math.min(parts, Math.abs(p));
  return (
    <div className="ns-bars" aria-label={`Fraction bar for ${p}/${q}`}>
      {Array.from({ length: parts }, (_, index) => (
        <i key={index} className={index < filled ? "is-on" : ""} />
      ))}
    </div>
  );
}

export function LabChrome({
  title,
  summary,
  lesson,
  page,
  children,
  presets,
  onReset,
}: {
  title: string;
  summary: string;
  lesson: { id: string; route: string };
  page: NumberSystemsPage;
  children: ReactNode;
  presets?: Array<{ label: string; onClick: () => void }>;
  onReset?: () => void;
}) {
  const { mode, setMode, modes } = useNumberMode(page);
  return (
    <div className="ns-lab" data-ns-mode={mode}>
      <header className="ns-lab-head">
        <div>
          <StudioHomeButtons studioTo="/number-systems" />
          <Link className="ns-lesson" to={lesson.route}>Next step: Lesson {lesson.id}</Link>
          <h1>{title}</h1>
          <p>{summary}</p>
        </div>
        <div className="ns-lab-actions">
          <StudioCanvasToolbar />
          {presets?.map((preset) => (
            <button key={preset.label} type="button" onClick={preset.onClick}>{preset.label}</button>
          ))}
          {onReset ? <button type="button" onClick={onReset}>Reset</button> : null}
        </div>
      </header>
      {modes.length ? (
        <nav className="ns-modes" aria-label={`${title} modes`}>
          {modes.map((item) => (
            <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>{item}</button>
          ))}
        </nav>
      ) : null}
      <CoachBanner text="Try one preset, read the live classification, then complete the check at the bottom." />
      <div className="ns-lab-grid">
        <div className="ns-lab-main">{children}</div>
        <aside className="ns-inspector">
          <h2>Class labs</h2>
          <nav>
            {ncertFor(page).map((item) => (
              <Link key={item.to} to={item.to}>{item.label}</Link>
            ))}
          </nav>
          <Link className="ns-soft" to="/number-systems/formula-visualizer">Formula visualizer</Link>
        </aside>
      </div>
    </div>
  );
}

export function RationalLab({ onComplete }: LabProps) {
  const { mode } = useNumberMode("rational");
  const [p, setP] = useState(5);
  const [q, setQ] = useState(8);
  const reduced = normalizeRational(p, q);
  const value = p / Math.max(1, q);
  const terminating = terminatingDenominator(reduced.denominator);
  const decimal = repeatingDecimal(p, q);
  const equivalents = [2, 3, 4].map((k) => `${reduced.numerator * k}/${reduced.denominator * k}`);
  return (
    <LabChrome
      title="Rational numbers"
      summary="Move p and q to connect a fraction bar, reduced form, and a zoomed number line."
      lesson={LESSONS.rational}
      page="rational"
      presets={[
        { label: "5/8", onClick: () => { setP(5); setQ(8); } },
        { label: "1/3", onClick: () => { setP(1); setQ(3); } },
        { label: "−3/4", onClick: () => { setP(-3); setQ(4); } },
      ]}
      onReset={() => { setP(5); setQ(8); }}
    >
      <div className="ns-split" data-ns-view={mode}>
        <div>
          <CompactSlider label="Numerator p" value={p} min={-24} max={24} step={1} onChange={setP} />
          <CompactSlider label="Denominator q" value={q} min={1} max={24} step={1} onChange={setQ} />
          <dl className="ns-metrics">
            <div><dt>Fraction</dt><dd>{p}/{q}</dd></div>
            <div><dt>Reduced</dt><dd>{reduced.numerator}/{reduced.denominator}</dd></div>
            {mode !== "Fraction" ? <div><dt>Decimal</dt><dd>{decimal}</dd></div> : null}
          </dl>
          {mode === "Decimal" ? <p className={`ns-badge ${terminating ? "is-good" : "is-warn"}`}>{terminating ? "Terminating decimal" : "Repeating decimal with overline"}</p> : <p className={`ns-badge ${terminating ? "is-good" : "is-warn"}`}>{terminating ? "Terminating decimal" : "Repeating decimal"}</p>}
          <p className="ns-note">Equivalent fractions: {equivalents.join(" = ")}</p>
          {mode === "Fraction" ? <FractionBars p={Math.abs(reduced.numerator)} q={reduced.denominator} /> : null}
        </div>
        {mode !== "Fraction" ? <NumberLine values={[{ label: `${p}/${q}`, value, color: "#06b6d4" }]} zoomAround /> : <FractionBars p={Math.abs(reduced.numerator)} q={reduced.denominator} />}
      </div>
      <CompleteCheck prompt={`Is 0.625 a rational number? (live p/q is ${p}/${q})`} answer="yes" onPass={() => { markLabComplete("rational"); onComplete?.(); }} />
    </LabChrome>
  );
}

export function IrrationalLab({ onComplete }: LabProps) {
  const { mode } = useNumberMode("irrational");
  const [root, setRoot] = useState(2);
  const [example, setExample] = useState<"root" | "pi" | "e">("root");
  useEffect(() => {
    if (mode === "pi and e") setExample("pi");
    if (mode === "root 2 vs 9") setRoot(2);
  }, [mode]);
  const value = example === "pi" ? Math.PI : example === "e" ? Math.E : Math.sqrt(root);
  const rational = example === "root" && isPerfectSquareInteger(root);
  const nearby = example === "root" ? Math.sqrt(Math.round(Math.sqrt(root)) ** 2) : 3;
  return (
    <LabChrome
      title="Irrational numbers"
      summary="Roots of non-squares, π, and e do not terminate or repeat. Perfect squares stay rational."
      lesson={LESSONS.irrational}
      page="irrational"
      presets={[
        { label: "√2", onClick: () => { setExample("root"); setRoot(2); } },
        { label: "√9", onClick: () => { setExample("root"); setRoot(9); } },
        { label: "√3", onClick: () => { setExample("root"); setRoot(3); } },
        { label: "π", onClick: () => setExample("pi") },
        { label: "e", onClick: () => setExample("e") },
      ]}
      onReset={() => { setExample("root"); setRoot(2); }}
    >
      <div className="ns-split">
        <div>
          {mode !== "pi and e" ? <CompactSlider label="n in √n" value={root} min={2} max={50} step={1} onChange={(value) => { setExample("root"); setRoot(value); }} /> : null}
          {mode === "root 2 vs 9" ? (
            <div className="ns-legend">
              <span>√2 ≈ {roundTo(Math.SQRT2, 6)} · irrational</span>
              <span>√9 = 3 · rational</span>
            </div>
          ) : null}
          {mode === "pi and e" ? (
            <div className="ns-legend">
              <button type="button" className={example === "pi" ? "active" : ""} onClick={() => setExample("pi")}>π</button>
              <button type="button" className={example === "e" ? "active" : ""} onClick={() => setExample("e")}>e</button>
            </div>
          ) : null}
          <p className={`ns-badge ${rational ? "is-good" : "is-warn"}`}>{rational ? "Rational perfect square" : "Irrational"}</p>
          <p className="ns-note">Extra decimal digits do not prove irrationality. Non-terminating, non-repeating expansion does.</p>
          <dl className="ns-metrics">
            <div><dt>Value</dt><dd><MathExpression value={example === "pi" ? "\\pi" : example === "e" ? "e" : `\\sqrt{${root}}`} /> ≈ {roundTo(value, 6)}</dd></div>
          </dl>
        </div>
        <NumberLine
          values={[
            { label: example === "pi" ? "π" : example === "e" ? "e" : `√${root}`, value, color: rational ? "#10b981" : "#f59e0b" },
            { label: "nearby square", value: nearby, color: "#64748b" },
          ]}
          zoomAround
        />
      </div>
      <CompleteCheck prompt="Is √9 irrational?" answer="no" onPass={() => { markLabComplete("irrational"); onComplete?.(); }} />
    </LabChrome>
  );
}

export function RealLineLab({ onComplete }: LabProps) {
  const { mode } = useNumberMode("real-line");
  const [rational, setRational] = useState(0.625);
  const [irrational, setIrrational] = useState(Math.SQRT2);
  const [extras, setExtras] = useState<number[]>([]);
  const midpoint = (rational + irrational) / 2;
  const values = [
    { label: "rational", value: rational, color: "#06b6d4" },
    { label: "irrational", value: irrational, color: "#f59e0b" },
    { label: "between", value: midpoint, color: "#ec4899" },
    ...extras.map((value, index) => ({ label: `extra ${index + 1}`, value, color: "#8b5cf6" })),
  ];
  return (
    <LabChrome
      title="Real number line"
      summary="Rationals (Q) and irrationals (R \\ Q) share one continuous line. Between any two, more points exist."
      lesson={LESSONS.real}
      page="real-line"
      presets={[{ label: "5/8 and √2", onClick: () => { setRational(0.625); setIrrational(Math.SQRT2); setExtras([]); } }]}
    >
      <CompactSlider label="Rational point" value={Number(rational.toFixed(3))} min={-2} max={4} step={0.125} onChange={setRational} />
      <CompactSlider label="Irrational point" value={Number(irrational.toFixed(3))} min={0.5} max={4} step={0.05} onChange={setIrrational} />
      <NumberLine values={values} zoomAround={mode === "Zoom"} min={mode === "Density" ? -4 : undefined} max={mode === "Density" ? 8 : undefined} />
      <div className="ns-legend">
        <span><i style={{ background: "#06b6d4" }} /> Rational in Q</span>
        <span><i style={{ background: "#f59e0b" }} /> Irrational in R \\ Q</span>
        <span><i style={{ background: "#ec4899" }} /> One point between</span>
      </div>
      {mode !== "Density" ? <button type="button" className="ns-soft" onClick={() => setExtras((current) => [...current, (midpoint + irrational) / 2])}>Insert another point between</button> : <p className="ns-note">The pink point is already between the two. Zoom never runs out of room.</p>}
      <CompleteCheck prompt="Between 0.625 and √2, is there another real number?" answer="yes" onPass={() => { markLabComplete("real-line"); onComplete?.(); }} />
    </LabChrome>
  );
}

export function HierarchyLab({ onComplete }: LabProps) {
  const { mode } = useNumberMode("hierarchy");
  const view = mode === "3D" ? "space" : "sets";
  const [selected, setSelected] = useState("R");
  const [camera, setCamera] = useState<[number, number, number]>([5, 3.4, 6.5]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (view !== "space") return;
    setReady(false);
    const timer = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(timer);
  }, [view]);
  return (
    <LabChrome
      title="Number hierarchy"
      summary="Natural, whole, integer, and rational numbers nest inside the reals. Irrationals sit in R but outside Q."
      lesson={LESSONS.real}
      page="hierarchy"
    >
      {view === "sets" ? (
        <>
        <svg viewBox="0 0 760 420" className="ns-sets" role="img" aria-label="Nested number sets">
          <rect x="40" y="36" width="680" height="300" rx="28" fill="#e0f2fe" stroke="#0f172a" onClick={() => setSelected("R")} />
          <text x="620" y="64" fontWeight="800">Real ℝ</text>
          <rect x="64" y="84" width="400" height="210" rx="22" fill="#ecfeff" stroke="#0f172a" onClick={() => setSelected("Q")} />
          <text x="360" y="112" fontWeight="800">Rational ℚ</text>
          <rect x="490" y="84" width="200" height="210" rx="22" fill="#fff7ed" stroke="#0f172a" onClick={() => setSelected("I")} />
          <text x="510" y="112" fontWeight="800">Irrational ℝ\\ℚ</text>
          <rect x="92" y="132" width="300" height="150" rx="18" fill="#f8fafc" stroke="#0f172a" onClick={() => setSelected("Z")} />
          <text x="330" y="158" fontWeight="800">Integer ℤ</text>
          <rect x="116" y="168" width="210" height="90" rx="14" fill="#fefce8" stroke="#0f172a" onClick={() => setSelected("W")} />
          <text x="140" y="196" fontWeight="800">Whole W</text>
          <rect x="140" y="198" width="120" height="40" rx="10" fill="#dcfce7" stroke="#0f172a" onClick={() => setSelected("N")} />
          <text x="154" y="224" fontWeight="800">Natural ℕ</text>
        </svg>
        <p className="ns-note">Selected: {selected === "I" ? "Irrationals sit in ℝ but outside ℚ." : selected === "Q" ? "Every repeating or terminating decimal lives in ℚ." : `${selected} is nested inside every set drawn around it.`}</p>
        <Link className="ns-soft" to={selected === "I" ? NUMBER_SYSTEMS_ROUTES.irrational : selected === "Q" ? NUMBER_SYSTEMS_ROUTES.rational : NUMBER_SYSTEMS_ROUTES["real-line"]}>Open matching lab</Link>
        </>
      ) : (
        <div className="ns-3d">
          {!ready ? <div className="ns-skeleton">Loading 3D hierarchy…</div> : null}
          <div className="ns-modes">
            <button type="button" onClick={() => setCamera([5, 3.4, 6.5])}>Hierarchy</button>
            <button type="button" onClick={() => setCamera([0, 6, 0.2])}>Top-down</button>
            <button type="button" onClick={() => setCamera([8, 1.2, 0])}>Number rail</button>
          </div>
          <ThreeSceneWrapper height="420px" cameraPosition={camera} fov={43} quality="high" chrome="cinematic" sceneLabel="number systems 3D" interactionLabel="Drag rotate - scroll zoom">
            <OrbitControls enableDamping makeDefault />
            <gridHelper args={[9, 18, "#38bdf8", "#334155"]} position={[0, -1.35, 0]} />
            <Line points={[new THREE.Vector3(-4.2, -1.15, 0), new THREE.Vector3(4.2, -1.15, 0)]} color="#e0f2fe" lineWidth={4} />
            <SetRing radius={1.05} y={0.05} color="#22d3ee" label="N" />
            <SetRing radius={1.45} y={0.42} color="#10b981" label="W" />
            <SetRing radius={1.86} y={0.79} color="#f59e0b" label="Z" />
            <SetRing radius={2.28} y={1.16} color="#8b5cf6" label="Q" />
            <SetRing radius={2.72} y={1.53} color="#ec4899" label="R" />
            <Text position={[-4.1, 2.55, 0]} fontSize={0.2} color="#e0f2fe" anchorX="left">N ⊂ W ⊂ Z ⊂ Q ⊂ R</Text>
          </ThreeSceneWrapper>
        </div>
      )}
      <p className="ns-math"><MathExpression value={"\\mathbb{N}\\subset\\mathbb{W}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}"} display /></p>
      <CompleteCheck prompt="Is every integer also rational?" answer="yes" onPass={() => { markLabComplete("hierarchy"); onComplete?.(); }} />
    </LabChrome>
  );
}

function SetRing({ radius, y, color, label }: { radius: number; y: number; color: string; label: string }) {
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.025, 12, 96]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
      </mesh>
      <Text position={[radius + 0.28, 0.08, 0]} fontSize={0.2} color={color}>{label}</Text>
    </group>
  );
}

const CONCEPTS: Array<{ title: string; set: string; note: string; example: string; to: string }> = [
  { title: "Natural numbers", set: "N", note: "Counting numbers: 1, 2, 3, …", example: "5", to: NUMBER_SYSTEMS_ROUTES.hierarchy },
  { title: "Whole numbers", set: "W", note: "Natural numbers plus 0.", example: "0", to: NUMBER_SYSTEMS_ROUTES.hierarchy },
  { title: "Integers", set: "Z", note: "Positive, negative, and zero.", example: "-7", to: NUMBER_SYSTEMS_ROUTES.hierarchy },
  { title: "Rational numbers", set: "Q", note: "Numbers expressible as p/q with q ≠ 0.", example: "-5/8", to: NUMBER_SYSTEMS_ROUTES.rational },
  { title: "Terminating decimals", set: "Q", note: "Reduced denominator has only factors 2 and 5.", example: "0.125", to: NUMBER_SYSTEMS_ROUTES.rational },
  { title: "Repeating decimals", set: "Q", note: "Rationals with a repeating block.", example: "0.(3)", to: NUMBER_SYSTEMS_ROUTES.rational },
  { title: "Irrational numbers", set: "R\\Q", note: "Non-terminating, non-repeating decimals.", example: "√2, π", to: NUMBER_SYSTEMS_ROUTES.irrational },
  { title: "Real numbers", set: "R", note: "All rational and irrational points on the line.", example: "every point", to: NUMBER_SYSTEMS_ROUTES["real-line"] },
  { title: "Density", set: "R", note: "Between any two reals, more rationals and irrationals exist.", example: "(a+b)/2", to: NUMBER_SYSTEMS_ROUTES["real-line"] },
  { title: "Surds", set: "R\\Q", note: "Roots that cannot simplify to rationals.", example: "√18=3√2", to: NUMBER_SYSTEMS_ROUTES.irrational },
  { title: "Decimal expansion test", set: "Q or R\\Q", note: "Terminating/repeating means rational.", example: "0.101001…", to: NUMBER_SYSTEMS_ROUTES.practice },
  { title: "Real number hierarchy", set: "N ⊂ W ⊂ Z ⊂ Q ⊂ R", note: "Sets nest; irrationals share R outside Q.", example: "√3 ∈ R, not Q", to: NUMBER_SYSTEMS_ROUTES.hierarchy },
];

function MiniCanvas({ kind }: { kind: string }) {
  if (kind === "Natural numbers" || kind === "Whole numbers" || kind === "Integers") {
    return (
      <svg viewBox="0 0 160 56" className="ns-mini-canvas" aria-hidden="true">
        <line x1="8" x2="152" y1="32" y2="32" stroke="#64748b" />
        {[0, 1, 2, 3].map((n) => <circle key={n} cx={28 + n * 32} cy="32" r="6" fill="#06b6d4" />)}
      </svg>
    );
  }
  if (kind === "Rational numbers" || kind === "Terminating decimals" || kind === "Repeating decimals") {
    return (
      <svg viewBox="0 0 160 56" className="ns-mini-canvas" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={8 + i * 18} y="16" width="14" height="24" fill={i < 5 ? "#06b6d4" : "#e2e8f0"} rx="3" />)}
      </svg>
    );
  }
  if (kind === "Irrational numbers" || kind === "Surds") {
    return (
      <svg viewBox="0 0 160 56" className="ns-mini-canvas" aria-hidden="true">
        <rect x="40" y="8" width="40" height="40" fill="none" stroke="#f59e0b" />
        <line x1="40" y1="48" x2="80" y2="8" stroke="#0f172a" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 56" className="ns-mini-canvas" aria-hidden="true">
      <line x1="8" x2="152" y1="28" y2="32" stroke="#64748b" />
      <circle cx="50" cy="30" r="5" fill="#06b6d4" />
      <circle cx="90" cy="28" r="5" fill="#f59e0b" />
      <circle cx="70" cy="29" r="4" fill="#ec4899" />
    </svg>
  );
}

export function ConceptsLab({ onComplete }: LabProps) {
  return (
    <LabChrome title="Concept cards" summary="Open the lab that shows each idea. The nested diagram is the map." lesson={LESSONS.real} page="concepts">
      <svg viewBox="0 0 760 220" className="ns-mini-sets" aria-hidden="true">
        <rect x="20" y="20" width="720" height="180" rx="20" fill="#e0f2fe" />
        <rect x="40" y="50" width="430" height="130" rx="16" fill="#ecfeff" />
        <rect x="500" y="50" width="180" height="130" rx="16" fill="#fff7ed" />
        <text x="60" y="90" fontWeight="800">ℕ ⊂ W ⊂ ℤ ⊂ ℚ</text>
        <text x="520" y="90" fontWeight="800">ℝ \\ ℚ</text>
      </svg>
      <div className="ns-cards">
        {CONCEPTS.map((item) => (
          <Link key={item.title} to={item.to} className="ns-card">
            <header>
              <h3>{item.title}</h3>
              <span>{item.set}</span>
            </header>
            <MiniCanvas kind={item.title} />
            <p>{item.note}</p>
            <MathExpression value={/[=√\\]/.test(item.example) ? item.example.replace("√", "\\sqrt") : ""} />
            {!/[=√\\]/.test(item.example) ? <p className="ns-note">{item.example}</p> : null}
          </Link>
        ))}
      </div>
      <CompleteCheck prompt="Does 0.333… belong to Q?" answer="yes" onPass={() => { markLabComplete("concepts"); onComplete?.(); }} />
    </LabChrome>
  );
}

const QUIZ = [
  { prompt: "Is 0.125 rational?", answer: "yes", to: "/number-systems/rational?mode=Decimal", label: "Open the decimal lab" },
  { prompt: "Is √2 rational?", answer: "no", to: "/number-systems/irrational?mode=Surds", label: "Open the surds lab" },
  { prompt: "Is 0.(3) irrational?", answer: "no", to: "/number-systems/rational?mode=Decimal", label: "See repeating decimals" },
  { prompt: "Is π a real number?", answer: "yes", to: "/number-systems/irrational?mode=pi+and+e", label: "Open π and e" },
];

export function PracticeLab({ onComplete }: LabProps) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const item = QUIZ[index];
  return (
    <LabChrome title="Practice & accuracy" summary="Classify the current number, then read the short definition. This is a check, not a wall of validation notes." lesson={LESSONS.rational} page="practice">
      <p className="ns-note">A rational is a live p/q: 0.125 = 1/8, 0.5 = 1/2. Answers stay yes or no.</p>
      {item ? (
        <CompleteCheck
          key={index}
          prompt={item.prompt}
          answer={item.answer}
          failLab={{ to: item.to, label: item.label }}
          onPass={() => {
            setScore((value) => value + 1);
            setIndex((value) => value + 1);
          }}
        />
      ) : (
        <p className="ns-badge is-good">Quiz complete: {score}/{QUIZ.length}. Accuracy notes are below.</p>
      )}
      {!item ? (
        <div className="ns-accuracy">
          <article>
            <h3>Rational numbers</h3>
            <MathExpression value={"\\mathbb{Q}=\\{p/q:p,q\\in\\mathbb{Z}, q\\ne 0\\}"} display />
            <p>A number is rational when it can be written as an integer fraction.</p>
            <p>0.999… = 1 exactly: both are the same rational, not a sequence that “never arrives.”</p>
          </article>
          <article>
            <h3>Irrational numbers</h3>
            <p>Non-terminating, non-repeating decimals, including √p for prime p.</p>
          </article>
        </div>
      ) : null}
      {!item ? <button type="button" className="ns-soft" onClick={() => { markLabComplete("practice"); onComplete?.(); }}>Mark practice complete</button> : null}
    </LabChrome>
  );
}

function CompleteCheck({ prompt, answer, onPass, failLab }: { prompt: string; answer: string; onPass: () => void; failLab?: { to: string; label: string } }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");
  const [failed, setFailed] = useState(false);
  return (
    <form
      className="ns-check"
      onSubmit={(event) => {
        event.preventDefault();
        const ok = value.trim().toLowerCase() === answer;
        setStatus(ok ? "Correct." : "Not yet. Open the matching lab to see why.");
        setFailed(!ok);
        if (ok) onPass();
      }}
    >
      <p>{prompt}</p>
      <input value={value} onChange={(event) => setValue(event.target.value)} aria-label={prompt} placeholder="yes or no" />
      <button type="submit">Check</button>
      {status ? <p role="status">{status}</p> : null}
      {failed && failLab ? <Link className="ns-soft" to={failLab.to}>{failLab.label}</Link> : null}
    </form>
  );
}

