import { useEffect, useMemo, useRef, useState } from "react";
import { ChallengeBox, NControl, usePlayer } from "./patternsUi";
import {
  cantorRemainingLength,
  cantorSegmentCount,
  cantorSegments,
  fractalDimension,
  kochPerimeter,
  kochSegmentCount,
  kochSegments,
  pascalTriangle,
  sierpinskiCount,
  sierpinskiTriangles,
} from "./patternsMath";

const KINDS = ["Sierpiński", "Koch", "Tree", "Cantor", "Pascal mod 2"] as const;

type Props = {
  depth: number;
  setDepth: (n: number) => void;
  teacherReveal?: boolean;
  onOpenPascal?: (rows: number) => void;
};

export default function FractalsPanel({ depth, setDepth, teacherReveal, onOpenPascal }: Props) {
  const [kind, setKind] = useState<(typeof KINDS)[number]>("Sierpiński");
  const [shown, setShown] = useState(depth);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [angle, setAngle] = useState(28);
  const [ratio, setRatio] = useState(72);
  const [branches, setBranches] = useState(2);
  const [pascalRows, setPascalRows] = useState(16);
  const [challengeKey, setChallengeKey] = useState(0);
  const maxD = kind === "Koch" ? 6 : kind === "Tree" ? 10 : kind === "Sierpiński" ? 8 : 8;
  const d = Math.min(depth, maxD);

  usePlayer(playing, speed, () => {
    setShown((s) => {
      if (s >= d) {
        setPlaying(false);
        return d;
      }
      return s + 1;
    });
  });

  const tris = useMemo(() => sierpinskiTriangles(Math.min(shown, 8)), [shown]);
  const koch = useMemo(() => kochSegments(Math.min(shown, 6)), [shown]);
  const cantor = useMemo(() => cantorSegments(Math.min(shown, 8)), [shown]);
  const pascal = useMemo(() => pascalTriangle(Math.min(pascalRows, 32)), [pascalRows]);

  const challenge = useMemo(() => {
    const i = challengeKey % 4;
    if (i === 0) return { prompt: "How many filled triangles at Sierpiński depth 5?", expected: 243, hint: "3⁵." };
    if (i === 1) return { prompt: "Koch snowflake segments at iteration 2?", expected: 48, hint: "3 × 4²." };
    if (i === 2) return { prompt: "Cantor iteration 3: how many segments?", expected: 8, hint: "2³." };
    return { prompt: "Enter 1 if Koch perimeter is unbounded while area stays finite.", expected: 1, hint: "P_n = P₀(4/3)^n → ∞." };
  }, [challengeKey]);

  return (
    <>
      <div className="np-head">
        <div>
          <h2>Fractals</h2>
          <p>Recursion and self-similarity — Sierpiński, Koch, trees, the Cantor set, and Pascal mod 2.</p>
        </div>
      </div>
      <div className="np-seg" style={{ marginBottom: 12 }}>
        {KINDS.map((item) => (
          <button key={item} type="button" className={kind === item ? "is-on" : ""} onClick={() => { setKind(item); setPlaying(false); setShown(item === "Pascal mod 2" ? 0 : 0); }}>{item}</button>
        ))}
      </div>
      <div className="np-work">
        <section className="np-card">
          {kind !== "Pascal mod 2" ? (
            <NControl label="Iteration" value={d} min={0} max={maxD} onChange={(v) => { setDepth(v); setShown(playing ? shown : v); }} />
          ) : (
            <NControl label="Pascal rows" value={pascalRows} min={8} max={64} onChange={setPascalRows} />
          )}
          {kind === "Tree" ? (
            <>
              <NControl label="Branch angle (°)" value={angle} min={8} max={80} onChange={setAngle} />
              <NControl label="Length ratio (%)" value={ratio} min={40} max={85} onChange={setRatio} />
              <NControl label="Branches" value={branches} min={2} max={3} onChange={setBranches} />
            </>
          ) : null}
          <button type="button" className="np-go" onClick={() => { setShown(0); setPlaying(true); }}>▶ Play</button>
          <div className="np-row">
            <button type="button" className="np-ghost" onClick={() => setPlaying(false)}>Pause</button>
            <button type="button" className="np-ghost" onClick={() => { setPlaying(false); setShown(Math.max(0, shown - 1)); }}>Previous</button>
            <button type="button" className="np-ghost" onClick={() => { setPlaying(false); setShown(Math.min(d, shown + 1)); }}>Next</button>
            <button type="button" className="np-ghost" onClick={() => { setPlaying(false); setShown(0); setDepth(kind === "Koch" ? 3 : 5); }}>Reset</button>
          </div>
          {kind === "Pascal mod 2" && onOpenPascal ? (
            <button type="button" className="np-ghost" onClick={() => onOpenPascal(Math.min(30, pascalRows - 1))}>Open in Pascal Triangle</button>
          ) : null}
        </section>
        <section className="np-card np-stage">
          {kind === "Sierpiński" ? <SierpinskiSvg tris={tris} /> : null}
          {kind === "Koch" ? <KochSvg segs={koch} /> : null}
          {kind === "Tree" ? <TreeCanvas depth={Math.min(shown, 10)} angle={angle} ratio={ratio / 100} branches={branches} /> : null}
          {kind === "Cantor" ? (
            <svg className="np-svg" viewBox="0 0 400 80" aria-label="Cantor set">
              {cantor.map((s, i) => <rect key={i} x={20 + s.left * 360} y={30} width={Math.max(1, (s.right - s.left) * 360)} height="18" fill="#147df2" />)}
            </svg>
          ) : null}
          {kind === "Pascal mod 2" ? (
            <div className="np-pascal" aria-label="Pascal mod 2">
              {pascal.map((row, r) => (
                <span key={r}>{row.map((v, c) => <i key={c} className={v % 2 ? "is-odd" : "is-even"}>{v % 2 ? "1" : ""}</i>)}</span>
              ))}
            </div>
          ) : null}
        </section>
        <aside className="np-card np-insight">
          {kind === "Sierpiński" ? (
            <>
              <p className="np-formula">D = log 3 / log 2 ≈ {fractalDimension(3, 1 / 2).toFixed(3)}</p>
              <p className="np-work-eq">Iteration {shown}: filled triangles 3^{shown} = {sierpinskiCount(shown)}. Scale 1/2.</p>
              <p className="np-note">Dimension between 1 and 2: more than a curve, less than a filled area.</p>
            </>
          ) : null}
          {kind === "Koch" ? (
            <>
              <p className="np-formula">Pₙ = P₀ (4/3)ⁿ</p>
              <p className="np-work-eq">Segments 3×4^{shown} = {kochSegmentCount(shown)}. Perimeter {kochPerimeter(shown).toFixed(3)} (P₀=3).</p>
              <p className="np-note">Perimeter grows without bound; the enclosed area approaches a finite limit.</p>
            </>
          ) : null}
          {kind === "Cantor" ? (
            <>
              <p className="np-formula">D = log 2 / log 3 ≈ {fractalDimension(2, 1 / 3).toFixed(3)}</p>
              <p className="np-work-eq">segments = 2^{shown} = {cantorSegmentCount(shown)}; length each (1/3)^{shown}; remaining (2/3)^{shown} = {cantorRemainingLength(shown).toFixed(5)}.</p>
            </>
          ) : null}
          {kind === "Tree" ? <p className="np-note">Each branch splits into {branches} copies scaled by {ratio}%. Depth is capped so the browser stays responsive.</p> : null}
          {kind === "Pascal mod 2" ? <p className="np-ok">Odd binomial coefficients form the Sierpiński triangle — the same recursive removal rule, in disguise.</p> : null}
          <table className="np-table">
            <thead><tr><th>Fractal</th><th>Scale</th><th>Copies</th><th>D</th></tr></thead>
            <tbody>
              <tr><td>Sierpiński</td><td>1/2</td><td>3</td><td>{fractalDimension(3, 0.5).toFixed(3)}</td></tr>
              <tr><td>Cantor</td><td>1/3</td><td>2</td><td>{fractalDimension(2, 1 / 3).toFixed(3)}</td></tr>
              <tr><td>Koch curve</td><td>1/3</td><td>4</td><td>{fractalDimension(4, 1 / 3).toFixed(3)}</td></tr>
            </tbody>
          </table>
          <ChallengeBox {...challenge} onNew={() => setChallengeKey((x) => x + 1)} reveal={teacherReveal} />
        </aside>
      </div>
    </>
  );
}

function SierpinskiSvg({ tris }: { tris: Array<{ x: number; y: number; s: number }> }) {
  const h = Math.sqrt(3) / 2;
  return (
    <svg className="np-svg" viewBox="-1.1 -0.1 2.2 2" aria-label="Sierpinski triangle">
      {tris.map((t, i) => {
        const p1 = `${t.x},${t.y}`;
        const p2 = `${t.x - t.s / 2},${t.y + t.s * h}`;
        const p3 = `${t.x + t.s / 2},${t.y + t.s * h}`;
        return <polygon key={i} points={`${p1} ${p2} ${p3}`} fill="#147df2" />;
      })}
    </svg>
  );
}

function KochSvg({ segs }: { segs: Array<{ x1: number; y1: number; x2: number; y2: number }> }) {
  return (
    <svg className="np-svg" viewBox="-0.1 -0.15 1.2 1.05" aria-label="Koch snowflake">
      {segs.map((s, i) => <line key={i} x1={s.x1} y1={1 - s.y1} x2={s.x2} y2={1 - s.y2} stroke="#147df2" strokeWidth="0.012" />)}
    </svg>
  );
}

function TreeCanvas({ depth, angle, ratio, branches }: { depth: number; angle: number; ratio: number; branches: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 420, 280);
    ctx.strokeStyle = "#147df2";
    const draw = (x: number, y: number, len: number, dir: number, d: number) => {
      if (d > depth || len < 2) return;
      const x2 = x + Math.cos(dir) * len;
      const y2 = y + Math.sin(dir) * len;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const spread = (angle * Math.PI) / 180;
      if (branches === 2) {
        draw(x2, y2, len * ratio, dir - spread, d + 1);
        draw(x2, y2, len * ratio, dir + spread, d + 1);
      } else {
        draw(x2, y2, len * ratio, dir - spread, d + 1);
        draw(x2, y2, len * ratio, dir, d + 1);
        draw(x2, y2, len * ratio, dir + spread, d + 1);
      }
    };
    draw(210, 260, 70, -Math.PI / 2, 0);
  }, [depth, angle, ratio, branches]);
  return <canvas ref={ref} width={420} height={280} aria-label="Fractal tree" style={{ width: "100%", height: "auto" }} />;
}
