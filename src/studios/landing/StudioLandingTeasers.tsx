import { useMemo, useState, type PointerEvent, type ReactNode, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { writeTrigSession, useTrigSession } from "../mockup/trigStudioSession";

export function stopTeaserNav(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

function Frame({ label, children, dark = false }: { label: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`sl-teaser${dark ? " is-dark" : ""}`} onClick={stopTeaserNav} onPointerDown={stopTeaserNav} role="group" aria-label={label}>
      {children}
    </div>
  );
}

export function BisectorTeaser() {
  const [ax, setAx] = useState(36);
  const bx = 244;
  const mid = (ax + bx) / 2;
  return (
    <Frame label="Drag A to keep the perpendicular bisector of AB">
      <svg viewBox="0 0 280 88" className="sl-svg" onPointerMove={(event: PointerEvent<SVGSVGElement>) => {
        if (!event.buttons) return;
        const box = event.currentTarget.getBoundingClientRect();
        setAx(Math.max(20, Math.min(120, ((event.clientX - box.left) / box.width) * 280)));
      }}>
        <rect width="280" height="88" fill="#f8fbff" />
        <line x1={ax} y1="64" x2={bx} y2="64" stroke="#147df2" />
        <line x1={mid} y1="10" x2={mid} y2="82" stroke="#8b45f4" strokeDasharray="4 3" />
        <circle cx={ax} cy="64" r="6" fill="#147df2" />
        <circle cx={bx} cy="64" r="6" fill="#147df2" />
        <circle cx={mid} cy="64" r="4" fill="#08b9dd" />
        <text x="8" y="18" fill="#334155" fontSize="11">Drag A · ℓ ⊥ AB at midpoint</text>
      </svg>
    </Frame>
  );
}

export function CongruencePairTeaser() {
  const [kind, setKind] = useState<"SSS" | "SAS" | "ASA">("SSS");
  return (
    <Frame label="Congruence pair picker">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <polygon points="18,58 70,18 78,58" fill="#dbeafe" stroke="#2563eb" />
        <polygon points="88,58 140,18 148,58" fill="#ede9fe" stroke="#7c3aed" />
      </svg>
      <div className="sl-chips">
        {(["SSS", "SAS", "ASA"] as const).map((item) => (
          <button key={item} type="button" className={kind === item ? "is-on" : ""} onClick={() => setKind(item)}>{item}</button>
        ))}
      </div>
      <Link className="sl-mini-link" to={`/geometry/triangles?mode=Congruence&pair=${kind}`}>Open {kind}</Link>
    </Frame>
  );
}

export function NetsSolidsTeaser() {
  const [net, setNet] = useState(false);
  return (
    <Frame label="Nets versus solids">
      <svg viewBox="0 0 160 72" className="sl-svg">
        {net ? (
          <>
            <rect x="58" y="8" width="28" height="20" fill="#dbeafe" stroke="#147df2" />
            <rect x="30" y="28" width="84" height="20" fill="#e0f2fe" stroke="#147df2" />
            <rect x="58" y="48" width="28" height="16" fill="#dbeafe" stroke="#147df2" />
          </>
        ) : (
          <polygon points="40,58 80,18 128,58 88,66" fill="#dbeafe" stroke="#147df2" />
        )}
      </svg>
      <button type="button" className="sl-chip" onClick={() => setNet((value) => !value)}>{net ? "Fold solid" : "Unfold net"}</button>
    </Frame>
  );
}

export function ExactValueRoulette() {
  const values = [
    { deg: 30, sin: "1/2" },
    { deg: 45, sin: "√2/2" },
    { deg: 60, sin: "√3/2" },
  ];
  const [index, setIndex] = useState(0);
  const item = values[index]!;
  return (
    <Frame label="Exact-value roulette" dark>
      <p className="sl-kicker">sin {item.deg}° = {item.sin}</p>
      <button type="button" className="sl-chip" onClick={() => setIndex((value) => (value + 1) % values.length)}>Spin exact value</button>
    </Frame>
  );
}

export function WaveCircleToggle() {
  const session = useTrigSession();
  const [wave, setWave] = useState(false);
  const rad = (session.theta * Math.PI) / 180;
  return (
    <Frame label="Wave versus circle" dark>
      <svg viewBox="0 0 200 72" className="sl-svg">
        <rect width="200" height="72" fill="#061428" />
        {wave ? (
          <path d={`M8 36 ${Array.from({ length: 24 }, (_, i) => {
            const x = 8 + i * 8;
            const y = 36 - Math.sin(rad + i / 4) * 18;
            return `L${x} ${y}`;
          }).join(" ")}`} fill="none" stroke="#22d3ee" />
        ) : (
          <>
            <circle cx="40" cy="36" r="22" fill="none" stroke="#22d3ee" />
            <line x1="40" y1="36" x2={40 + Math.cos(rad) * 22} y2={36 - Math.sin(rad) * 22} stroke="#fbbf24" />
          </>
        )}
      </svg>
      <button type="button" className="sl-chip" onClick={() => setWave((value) => !value)}>{wave ? "Show circle" : "Show wave"}</button>
    </Frame>
  );
}

export function IdentityHoldTeaser() {
  const [theta, setTheta] = useState(40);
  const rad = (theta * Math.PI) / 180;
  const hold = Math.sin(rad) ** 2 + Math.cos(rad) ** 2;
  return (
    <Frame label="Identity holds the radius">
      <p className="sl-kicker">sin²θ + cos²θ = {hold.toFixed(3)}</p>
      <input type="range" min={0} max={360} value={theta} aria-label="Theta" onChange={(event) => setTheta(Number(event.target.value))} />
    </Frame>
  );
}

export function SsaAmbiguousTeaser() {
  return (
    <Frame label="Ambiguous SSA">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <polygon points="20,60 110,60 86,18" fill="none" stroke="#147df2" />
        <polygon points="20,60 110,60 54,28" fill="none" stroke="#8b45f4" strokeDasharray="4 3" />
      </svg>
      <small>Two triangles can fit SSA.</small>
    </Frame>
  );
}

export function DetLiveTeaser({ k = 0.4, onK }: { k?: number; onK?: (value: number) => void }) {
  const det = 1;
  return (
    <Frame label="Determinant of a shear">
      <svg viewBox="0 0 160 72" className="sl-svg" onPointerMove={(event) => {
        if (!event.buttons || !onK) return;
        const box = event.currentTarget.getBoundingClientRect();
        onK(Math.max(0, Math.min(1.4, ((event.clientX - box.left) / box.width) * 1.4)));
      }}>
        <polygon points={`16,60 ${70 + k * 28},60 ${86 + k * 28},20 32,20`} fill="rgba(20,125,242,.2)" stroke="#147df2" />
      </svg>
      <p className="sl-kicker">det = {det} · preserve</p>
    </Frame>
  );
}

export function EigenStayTeaser() {
  return (
    <Frame label="Eigenvector does not turn">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <line x1="20" y1="56" x2="130" y2="18" stroke="#94a3b8" />
        <line x1="20" y1="56" x2="130" y2="18" stroke="#147df2" strokeWidth="3" />
        <polygon points="130,18 118,22 124,30" fill="#147df2" />
      </svg>
      <p className="sl-kicker">Arrow stays on its line</p>
    </Frame>
  );
}

export function RankNullityTeaser() {
  const [free, setFree] = useState(false);
  return (
    <Frame label="Rank and nullity">
      <p className="sl-kicker">{free ? "rank 1 · free var 1 · line of solutions" : "rank 2 · unique solution"}</p>
      <button type="button" className="sl-chip" onClick={() => setFree((value) => !value)}>{free ? "Make full rank" : "Add a free variable"}</button>
    </Frame>
  );
}

export function LeastSquaresTeaser() {
  const [y, setY] = useState(18);
  return (
    <Frame label="Least-squares residual">
      <svg viewBox="0 0 160 72" className="sl-svg" onPointerMove={(event) => {
        if (!event.buttons) return;
        const box = event.currentTarget.getBoundingClientRect();
        setY(Math.max(8, Math.min(64, ((event.clientY - box.top) / box.height) * 72)));
      }}>
        <line x1="12" y1="52" x2="148" y2="20" stroke="#147df2" />
        <circle cx="96" cy={y} r="6" fill="#f59e0b" />
        <line x1="96" y1={y} x2="96" y2="32" stroke="#ef4444" />
      </svg>
      <p className="sl-kicker">Drag the outlier</p>
    </Frame>
  );
}

export function MultiplyByITeaser({ re, im, onRotate }: { re: number; im: number; onRotate: () => void }) {
  const scale = 14;
  return (
    <Frame label="Multiply by i">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <line x1="80" y1="8" x2="80" y2="64" stroke="#cbd5e1" />
        <line x1="12" y1="36" x2="148" y2="36" stroke="#cbd5e1" />
        <circle cx={80 + re * scale} cy={36 - im * scale} r="5" fill="#147df2" />
      </svg>
      <button type="button" className="sl-chip" onClick={onRotate}>× i (90°)</button>
    </Frame>
  );
}

export function RootsOfUnityTeaser() {
  const [n, setN] = useState(5);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return `${80 + Math.cos(a) * 26},${36 + Math.sin(a) * 26}`;
  });
  return (
    <Frame label="Roots of unity">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <polygon points={pts.join(" ")} fill="none" stroke="#8b45f4" />
      </svg>
      <label className="sl-inline">n
        <input type="range" min={2} max={8} value={n} aria-label="Root count" onChange={(event) => setN(Number(event.target.value))} />
        <span>{n}</span>
      </label>
    </Frame>
  );
}

export function JuliaThumbTeaser() {
  const [c, setC] = useState(-0.4);
  return (
    <Frame label="Julia thumbnail">
      <svg viewBox="0 0 160 72" className="sl-svg">
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i % 10) * 16 + 8;
          const y = Math.floor(i / 10) * 16 + 10;
          const live = Math.abs(Math.sin(i + c * 6)) > 0.35;
          return <rect key={i} x={x} y={y} width="12" height="12" fill={live ? "#0f172a" : "#e0f2fe"} />;
        })}
      </svg>
      <input type="range" min={-1} max={0.4} step={0.05} value={c} aria-label="c real part" onChange={(event) => setC(Number(event.target.value))} />
    </Frame>
  );
}

export function PhasorTeaser() {
  const [lag, setLag] = useState(30);
  const rad = (lag * Math.PI) / 180;
  return (
    <Frame label="Phasor clock">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <circle cx="40" cy="36" r="24" fill="none" stroke="#147df2" />
        <line x1="40" y1="36" x2={40 + 24} y2="36" stroke="#f59e0b" />
        <line x1="40" y1="36" x2={40 + Math.cos(rad) * 24} y2={36 - Math.sin(rad) * 24} stroke="#8b45f4" />
      </svg>
      <p className="sl-kicker">lag {lag}°</p>
      <input type="range" min={0} max={90} value={lag} aria-label="Phase lag" onChange={(event) => setLag(Number(event.target.value))} />
    </Frame>
  );
}

export function R0NeedleTeaser() {
  const [r0, setR0] = useState(1.4);
  return (
    <Frame label="R0 needle">
      <p className={`sl-kicker ${r0 < 1 ? "is-ok" : "is-warn"}`}>R₀ = {r0.toFixed(2)} · {r0 < 1 ? "fades" : "outbreak"}</p>
      <input type="range" min={0.4} max={3} step={0.1} value={r0} aria-label="R0" onChange={(event) => setR0(Number(event.target.value))} />
    </Frame>
  );
}

export function FeasibleRegionTeaser() {
  const [cut, setCut] = useState(90);
  return (
    <Frame label="Feasible region">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <polygon points={`12,60 12,20 ${cut},20 120,60`} fill="rgba(16,185,129,.25)" stroke="#10b981" />
      </svg>
      <input type="range" min={40} max={120} value={cut} aria-label="Constraint" onChange={(event) => setCut(Number(event.target.value))} />
    </Frame>
  );
}

export function TrafficEdgeTeaser() {
  const [closed, setClosed] = useState(false);
  return (
    <Frame label="Traffic closure">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <circle cx="28" cy="36" r="8" fill="#147df2" />
        <circle cx="132" cy="36" r="8" fill="#10b981" />
        <line x1="36" y1="36" x2="124" y2="36" stroke={closed ? "#ef4444" : "#334155"} strokeDasharray={closed ? "4 3" : undefined} />
      </svg>
      <button type="button" className="sl-chip" onClick={() => setClosed((value) => !value)}>{closed ? "Reopen edge" : "Close an edge"}</button>
    </Frame>
  );
}

export function MonteCarloPiTeaser() {
  const [n, setN] = useState(40);
  const inside = Math.round(n * 0.78);
  return (
    <Frame label="Monte Carlo pi">
      <p className="sl-kicker">π ≈ {(4 * inside / n).toFixed(3)} · {n} dots</p>
      <button type="button" className="sl-chip" onClick={() => setN((value) => Math.min(400, value + 20))}>Drop more points</button>
    </Frame>
  );
}

export function SieveTeaser() {
  const [struck, setStruck] = useState<number[]>([]);
  const cells = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <Frame label="Live sieve">
      <div className="sl-sieve">
        {cells.map((n) => (
          <button key={n} type="button" className={struck.includes(n) ? "is-struck" : ""} onClick={() => setStruck((list) => list.includes(n) ? list : [...list, n])}>{n}</button>
        ))}
      </div>
      <small>Tap composites to strike them.</small>
    </Frame>
  );
}

export function ClockHopTeaser() {
  const [k, setK] = useState(5);
  const ang = (k / 12) * 2 * Math.PI - Math.PI / 2;
  return (
    <Frame label="Clock hops">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <circle cx="40" cy="36" r="24" fill="none" stroke="#147df2" />
        <line x1="40" y1="36" x2={40 + Math.cos(ang) * 20} y2={36 + Math.sin(ang) * 20} stroke="#f59e0b" />
      </svg>
      <p className="sl-kicker">{k} mod 12</p>
      <input type="range" min={0} max={11} value={k} aria-label="Clock hop" onChange={(event) => setK(Number(event.target.value))} />
    </Frame>
  );
}

export function MeanMedianTeaser() {
  const [outlier, setOutlier] = useState(9);
  const data = [2, 3, 4, 4, outlier];
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const sorted = [...data].sort((a, b) => a - b);
  const median = sorted[2]!;
  return (
    <Frame label="Mean versus median">
      <p className="sl-kicker">mean {mean.toFixed(1)} · median {median}</p>
      <input type="range" min={4} max={20} value={outlier} aria-label="Outlier" onChange={(event) => setOutlier(Number(event.target.value))} />
    </Frame>
  );
}

export function EmpiricalRuleTeaser() {
  return (
    <Frame label="68-95-99.7">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <path d="M8 60 C 30 60 40 12 80 12 C 120 12 130 60 152 60" fill="#dbeafe" stroke="#147df2" />
        <rect x="52" y="12" width="56" height="48" fill="rgba(20,125,242,.2)" />
      </svg>
      <p className="sl-kicker">~68% within 1σ</p>
    </Frame>
  );
}

export function BalanceScaleTeaser() {
  return (
    <Frame label="Balance scale">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <line x1="80" y1="16" x2="80" y2="58" stroke="#64748b" strokeWidth="3" />
        <line x1="24" y1="28" x2="136" y2="28" stroke="#94a3b8" strokeWidth="3" />
        <rect x="18" y="28" width="36" height="22" fill="#dbeafe" />
        <rect x="106" y="28" width="36" height="22" fill="#ede9fe" />
      </svg>
    </Frame>
  );
}

export function FactorTilesTeaser() {
  const [grouped, setGrouped] = useState(false);
  return (
    <Frame label="Factor tiles">
      <div className={`sl-tiles${grouped ? " is-grouped" : ""}`}>
        <i>x</i><i>x</i><i>+</i><i>3</i>
      </div>
      <button type="button" className="sl-chip" onClick={() => setGrouped((value) => !value)}>{grouped ? "Ungroup" : "Regroup"}</button>
    </Frame>
  );
}

export function CasExpandTeaser() {
  const [out, setOut] = useState("");
  return (
    <Frame label="CAS expand">
      <p className="sl-mono">expand((x+2)³)</p>
      <button type="button" className="sl-chip" onClick={() => setOut("x³ + 6x² + 12x + 8")}>Run locally</button>
      {out ? <p className="sl-kicker">{out}</p> : null}
    </Frame>
  );
}

export function EpsilonDeltaTeaser() {
  return (
    <Frame label="Epsilon-delta window">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <rect x="40" y="8" width="80" height="56" fill="rgba(20,125,242,.12)" stroke="#147df2" />
        <rect x="58" y="22" width="44" height="28" fill="rgba(139,69,244,.18)" stroke="#8b45f4" />
      </svg>
      <p className="sl-kicker">ε band and δ window</p>
    </Frame>
  );
}

export function SecantTangentTeaser() {
  const [h, setH] = useState(1.2);
  return (
    <Frame label="Secant to tangent">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <path d="M8 58 Q 80 8 152 48" fill="none" stroke="#8b5cf6" strokeWidth="2" />
        <line x1="40" y1={50} x2={40 + h * 50} y2={50 - h * 18} stroke="#f59e0b" />
      </svg>
      <input type="range" min={0.15} max={1.4} step={0.05} value={h} aria-label="Secant width" onChange={(event) => setH(Number(event.target.value))} />
    </Frame>
  );
}

export function RiemannChipsTeaser() {
  const [kind, setKind] = useState<"left" | "mid" | "right">("mid");
  return (
    <Frame label="Riemann type">
      <div className="sl-chips">
        {(["left", "mid", "right"] as const).map((item) => (
          <button key={item} type="button" className={kind === item ? "is-on" : ""} onClick={() => setKind(item)}>{item}</button>
        ))}
      </div>
      <Link className="sl-mini-link" to={`/calculus/integration?mode=riemann&sum=${kind}`}>Open {kind} sums</Link>
    </Frame>
  );
}

export function CayleyMiniTeaser() {
  const cells = ["0", "1", "2", "3", "1", "2", "3", "0", "2", "3", "0", "1", "3", "0", "1", "2"];
  return (
    <Frame label="Mini Cayley table Z4">
      <div className="sl-cayley">
        {cells.map((cell, index) => <span key={index} className={cell === "0" ? "is-id" : ""}>{cell}</span>)}
      </div>
      <p className="sl-kicker">identity 0 highlighted</p>
    </Frame>
  );
}

export function VennCountTeaser() {
  return (
    <Frame label="Venn region counts">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <circle cx="60" cy="36" r="24" fill="rgba(20,125,242,.25)" stroke="#147df2" />
        <circle cx="92" cy="36" r="24" fill="rgba(139,69,244,.25)" stroke="#8b45f4" />
        <text x="48" y="40" fontSize="11">3</text>
        <text x="72" y="40" fontSize="11">2</text>
        <text x="96" y="40" fontSize="11">4</text>
      </svg>
    </Frame>
  );
}

export function HandshakeTeaser() {
  return (
    <Frame label="Handshaking lemma">
      <svg viewBox="0 0 160 72" className="sl-svg">
        <circle cx="40" cy="24" r="8" fill="#147df2" />
        <circle cx="110" cy="24" r="8" fill="#147df2" />
        <circle cx="75" cy="56" r="8" fill="#10b981" />
        <line x1="40" y1="24" x2="110" y2="24" stroke="#334155" />
        <line x1="40" y1="24" x2="75" y2="56" stroke="#334155" />
        <line x1="110" y1="24" x2="75" y2="56" stroke="#334155" />
      </svg>
      <p className="sl-kicker">Σ deg = 2|E| = 6</p>
    </Frame>
  );
}

const TEASER_KEYS = new Set([
  "geometry:construction",
  "geometry:triangles",
  "geometry:solids",
  "trigonometry:unit-circle",
  "trigonometry:graphs",
  "trigonometry:waves",
  "trigonometry:identities",
  "trigonometry:oblique",
  "linear-algebra:linear-transforms",
  "linear-algebra:determinants",
  "linear-algebra:eigenvectors",
  "linear-algebra:row-reduction",
  "linear-algebra:least-squares",
  "complex-numbers:argand-plane",
  "complex-numbers:rotation",
  "complex-numbers:roots",
  "complex-numbers:fractals",
  "complex-numbers:waves-circuits",
  "modelling:epidemics",
  "modelling:optimization",
  "modelling:networks",
  "modelling:numerical",
  "discrete:primes",
  "discrete:modular-arithmetic",
  "statistics:descriptive",
  "statistics:interactive-distributions",
  "calculus:limits",
  "calculus:derivatives",
  "calculus:integration",
]);

export function hasLandingTeaser(studioId: string, labId: string) {
  return TEASER_KEYS.has(`${studioId}:${labId}`);
}

export function LandingTeaser({ studioId, labId }: { studioId: string; labId: string }) {
  const key = `${studioId}:${labId}`;
  const [k, setK] = useState(0.5);
  const [z, setZ] = useState({ re: 2, im: 1 });
  const session = useTrigSession();
  const art = useMemo(() => {
    if (key === "geometry:construction") return <BisectorTeaser />;
    if (key === "geometry:triangles") return <CongruencePairTeaser />;
    if (key === "geometry:solids") return <NetsSolidsTeaser />;
    if (key === "trigonometry:unit-circle") return <ExactValueRoulette />;
    if (key === "trigonometry:graphs" || key === "trigonometry:waves") return <WaveCircleToggle />;
    if (key === "trigonometry:identities") return <IdentityHoldTeaser />;
    if (key === "trigonometry:oblique") return <SsaAmbiguousTeaser />;
    if (key === "linear-algebra:linear-transforms" || key === "linear-algebra:determinants") return <DetLiveTeaser k={k} onK={setK} />;
    if (key === "linear-algebra:eigenvectors") return <EigenStayTeaser />;
    if (key === "linear-algebra:row-reduction") return <RankNullityTeaser />;
    if (key === "linear-algebra:least-squares") return <LeastSquaresTeaser />;
    if (key === "complex-numbers:argand-plane" || key === "complex-numbers:rotation") {
      return <MultiplyByITeaser re={z.re} im={z.im} onRotate={() => setZ(({ re, im }) => ({ re: -im, im: re }))} />;
    }
    if (key === "complex-numbers:roots") return <RootsOfUnityTeaser />;
    if (key === "complex-numbers:fractals") return <JuliaThumbTeaser />;
    if (key === "complex-numbers:waves-circuits") return <PhasorTeaser />;
    if (key === "modelling:epidemics") return <R0NeedleTeaser />;
    if (key === "modelling:optimization") return <FeasibleRegionTeaser />;
    if (key === "modelling:networks") return <TrafficEdgeTeaser />;
    if (key === "modelling:numerical") return <MonteCarloPiTeaser />;
    if (key === "discrete:primes") return <SieveTeaser />;
    if (key === "discrete:modular-arithmetic") return <ClockHopTeaser />;
    if (key === "statistics:descriptive") return <MeanMedianTeaser />;
    if (key === "statistics:interactive-distributions") return <EmpiricalRuleTeaser />;
    if (key === "calculus:limits") return <EpsilonDeltaTeaser />;
    if (key === "calculus:derivatives") return <SecantTangentTeaser />;
    if (key === "calculus:integration") return <RiemannChipsTeaser />;
    return null;
  }, [key, k, z, session.theta]);
  return art;
}

export function UnitsHomeSwitch() {
  const session = useTrigSession();
  return (
    <div className="sl-units" role="group" aria-label="Angle units">
      <button type="button" className={session.units === "deg" ? "is-on" : ""} onClick={() => writeTrigSession({ units: "deg" })}>Degrees</button>
      <button type="button" className={session.units === "rad" ? "is-on" : ""} onClick={() => writeTrigSession({ units: "rad" })}>Radians</button>
    </div>
  );
}
