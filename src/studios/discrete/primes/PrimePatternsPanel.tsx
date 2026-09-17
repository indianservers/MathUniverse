import { useMemo, useState } from "react";
import { LiveRow, Panel, Segmented, SliderRow } from "../../mockup/studioLabKit";
import { ChallengeCard, Feedback, PlaybackBar, Tip, useStepPlayer } from "./primesUi";
import {
  bertrandPrime,
  eulerLucky,
  formatFactorization,
  generatePrimes,
  goldbachPairs,
  isPrime,
  largestPrimeAtMost,
  liApprox,
  moduloClass,
  nextPrimeAfter,
  previousPrimeBefore,
  primeFactors,
  primeGaps,
  primePairsByGap,
  primePi,
  primeRaceMod4,
  randomInt,
  twinPrimes,
  ulamSpiral,
  wilsonHolds,
  wilsonResidue,
} from "./primesMath";

const VIEWS = [
  { id: "grid", label: "Number Grid" },
  { id: "ulam", label: "Ulam Spiral" },
  { id: "gaps", label: "Prime Gaps" },
  { id: "twins", label: "Twin Primes" },
  { id: "residue", label: "Residue Patterns" },
  { id: "pi", label: "Prime Distribution" },
  { id: "goldbach", label: "Goldbach" },
  { id: "wilson", label: "Wilson" },
  { id: "bertrand", label: "Bertrand" },
  { id: "race", label: "Prime race" },
];

type Props = {
  n: number;
  setN: (n: number) => void;
  teacherReveal?: boolean;
  onInspect: (n: number) => void;
};

const GRID_MAX = 1000;

export default function PrimePatternsPanel({ n, setN, teacherReveal, onInspect }: Props) {
  const [view, setView] = useState("grid");
  const [cols, setCols] = useState(10);
  const [mod, setMod] = useState(6);
  const [pairKind, setPairKind] = useState<"twin" | "cousin" | "sexy">("twin");
  const [focus, setFocus] = useState<number | null>(null);
  const [step, setStep] = useState(40);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [challengeKey, setChallengeKey] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [hoverUlam, setHoverUlam] = useState<string>("");
  const [evenN, setEvenN] = useState(28);

  const cap = Math.min(view === "ulam" ? 5000 : 2500, Math.max(10, n));
  const gridCap = Math.min(cap, GRID_MAX);
  const primes = useMemo(() => generatePrimes(cap), [cap]);
  const gaps = useMemo(() => primeGaps(cap), [cap]);
  const twins = useMemo(() => twinPrimes(cap), [cap]);
  const cousins = useMemo(() => primePairsByGap(cap, 4), [cap]);
  const sexy = useMemo(() => primePairsByGap(cap, 6), [cap]);
  const spiral = useMemo(() => ulamSpiral(Math.min(cap, 2500)), [cap]);
  const shownSpiral = spiral.slice(0, Math.max(1, step));
  const goldbach = useMemo(() => goldbachPairs(evenN), [evenN]);
  const race = useMemo(() => primeRaceMod4(cap), [cap]);

  useStepPlayer(playing && (view === "ulam" || view === "pi"), speed, () => {
    setStep((s) => {
      if (s >= spiral.length) {
        setPlaying(false);
        return spiral.length;
      }
      return s + Math.max(1, Math.floor(spiral.length / 80));
    });
  });

  const pi = primePi(cap);
  const approx = liApprox(cap);
  const gap2 = gaps.filter((g) => g.gap === 2).length;
  const gap4 = gaps.filter((g) => g.gap === 4).length;
  const largestGap = gaps.reduce((m, g) => (g.gap > m.gap ? g : m), gaps[0] ?? { prime: 2, next: 3, gap: 1 });
  const avgGap = gaps.length ? gaps.reduce((s, g) => s + g.gap, 0) / gaps.length : 0;
  const maxGap = Math.max(1, ...gaps.map((g) => g.gap));

  const hover = focus ?? 2;
  const prev = previousPrimeBefore(hover);
  const next = nextPrimeAfter(hover);
  const eulerHighlight = new Set(Array.from({ length: 40 }, (_, i) => eulerLucky(i)).filter((v) => v <= Math.min(cap, 2500)));

  const challenge = useMemo(() => {
    const kind = challengeKey % 3;
    if (kind === 0) return { prompt: "What is π(100)?", expected: 25, hint: "Count primes ≤ 100.", hidePi: true };
    if (kind === 1) return { prompt: "How many twin-prime pairs are ≤ 100?", expected: 8, hint: "Pairs differing by 2, both prime, both ≤ 100.", hidePi: false };
    return { prompt: "Every prime > 3 is 1 or 5 mod 6. Enter 1 if 25 is nevertheless composite.", expected: 1, hint: "25 = 6×4+1 = 5×5.", hidePi: false };
  }, [challengeKey]);

  const inspectNumber = (v: number) => {
    setFocus(v);
    if (v === 1) {
      setFeedback({ ok: true, text: "1 is neither prime nor composite." });
      return;
    }
    if (isPrime(v)) {
      setFeedback({ ok: true, text: `${v} is prime. Previous: ${prev ?? "—"}. Next: ${next ?? "—"}.` });
    } else {
      setFeedback({ ok: true, text: `${v} is composite: ${v} = ${formatFactorization(primeFactors(v))}.` });
    }
  };

  const pairs = pairKind === "twin" ? twins : pairKind === "cousin" ? cousins : sexy;
  const showPlayback = view === "ulam" || view === "pi" || view === "gaps";
  const hidePi = Boolean(challenge.hidePi) && !teacherReveal;

  return (
    <>
      <Panel title="Prime Patterns">
        <SliderRow label="Range" value={n} min={100} max={view === "ulam" ? 5000 : 2500} step={view === "ulam" ? 100 : 10} onChange={(v) => { setN(v); setStep(40); }} />
        <Segmented value={view} onChange={setView} options={VIEWS} label="Views" />
        {view === "grid" ? (
          <Segmented value={String(cols)} onChange={(id) => setCols(Number(id))} options={[10, 12, 20, 30].map((c) => ({ id: String(c), label: `${c} columns` }))} />
        ) : null}
        {view === "residue" ? (
          <Segmented value={String(mod)} onChange={(id) => setMod(Number(id))} options={[4, 6, 10, 12].map((m) => ({ id: String(m), label: `mod ${m}` }))} />
        ) : null}
        {view === "twins" ? (
          <Segmented value={pairKind} onChange={(id) => setPairKind(id as typeof pairKind)} options={[
            { id: "twin", label: "Twins (gap 2)" },
            { id: "cousin", label: "Cousins (gap 4)" },
            { id: "sexy", label: "Sexy (gap 6)" },
          ]} />
        ) : null}
        {showPlayback ? (
          <PlaybackBar
            playing={playing}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onPrev={() => setStep((s) => Math.max(1, s - 10))}
            onNext={() => setStep((s) => Math.min(spiral.length, s + 10))}
            onReset={() => { setN(100); setStep(40); setZoom(1); setPan({ x: 0, y: 0 }); }}
            onRandom={() => setN([100, 500, 1000, 2500][randomInt(0, 3)]!)}
            onAuto={() => { setView("ulam"); setPlaying(true); }}
            speed={speed}
            onSpeed={setSpeed}
          />
        ) : (
          <div className="msk-btn-row">
            <button type="button" className="msk-soft" onClick={() => setN(100)}>Reset range 100</button>
            <button type="button" className="msk-soft" onClick={() => setN([100, 500, 1000, 2500][randomInt(0, 3)]!)}>Random example</button>
          </div>
        )}
      </Panel>
      <section className="msk-panel msk-canvas">
        {view === "grid" ? (
          <>
            <div className="primes-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(28px, 1fr))` }} role="grid">
              {Array.from({ length: gridCap }, (_, i) => i + 1).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`primes-cell ${v === 1 ? "is-neither" : isPrime(v) ? "is-prime" : "is-unprocessed"}${focus === v ? " is-focus" : ""}`}
                  onClick={() => inspectNumber(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            {cap > GRID_MAX ? <p className="msk-note">Showing 1–{GRID_MAX} of {cap} for performance.</p> : null}
          </>
        ) : null}
        {view === "ulam" ? (
          <>
            <svg
              className="primes-ulam"
              viewBox="-42 -42 84 84"
              role="img"
              aria-label="Ulam spiral"
              style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})` }}
              onWheel={(e) => { e.preventDefault(); setZoom((z) => Math.min(4, Math.max(0.5, z + (e.deltaY > 0 ? -0.1 : 0.1)))); }}
              onPointerDown={(e) => {
                const o = { x: e.clientX - pan.x, y: e.clientY - pan.y };
                const move = (ev: PointerEvent) => setPan({ x: ev.clientX - o.x, y: ev.clientY - o.y });
                const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
                window.addEventListener("pointermove", move);
                window.addEventListener("pointerup", up);
              }}
            >
              <line x1="-40" y1="0" x2="40" y2="0" stroke="#cbd5e1" strokeWidth="0.15" />
              <line x1="0" y1="-40" x2="0" y2="40" stroke="#cbd5e1" strokeWidth="0.15" />
              <text x="38" y="2" fontSize="2" fill="#64748b">x</text>
              <text x="1" y="-37" fontSize="2" fill="#64748b">y</text>
              {shownSpiral.map((p) => (
                <rect
                  key={p.n}
                  x={p.x - 0.45}
                  y={-p.y - 0.45}
                  width="0.9"
                  height="0.9"
                  fill={eulerHighlight.has(p.n) && p.prime ? "#f59e0b" : p.prime ? "#147df2" : "#e2e8f0"}
                  onClick={() => inspectNumber(p.n)}
                  onMouseEnter={() => setHoverUlam(`${p.n} at (${p.x}, ${p.y})${p.prime ? " prime" : ""}`)}
                >
                  <title>{`${p.n}${p.prime ? " prime" : ""} (${p.x},${p.y})`}</title>
                </rect>
              ))}
            </svg>
            <p className="msk-note">{hoverUlam || "Hover a cell. Amber cells lie on Euler’s n² + n + 41 (often prime for n = 0…39). Diagonals are clues, not theorems."}</p>
          </>
        ) : null}
        {view === "gaps" ? (
          <svg className="primes-gap-plot" viewBox="0 0 440 220" role="img" aria-label="Prime gaps">
            <rect width="440" height="220" fill="#f8fbff" />
            <line x1="40" y1="180" x2="420" y2="180" stroke="#94a3b8" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#94a3b8" />
            <text x="8" y="24" fontSize="10" fill="#64748b">{maxGap}</text>
            <text x="200" y="210" fontSize="10" fill="#64748b">prime index</text>
            {gaps.map((g, i) => {
              const x = 40 + (i * 380) / Math.max(1, gaps.length - 1);
              const h = (g.gap / maxGap) * 150;
              return (
                <rect
                  key={g.prime}
                  x={x}
                  y={180 - h}
                  width={Math.max(2, 360 / Math.max(gaps.length, 1))}
                  height={h}
                  fill="#8b45f4"
                  onMouseEnter={() => setFeedback({ ok: true, text: `Prime pair: ${g.prime} → ${g.next}. Gap: ${g.gap}` })}
                />
              );
            })}
          </svg>
        ) : null}
        {view === "twins" ? (
          <>
            <div className="primes-pills">
              {pairs.map(([p, q]) => (
                <button key={`${p}-${q}`} type="button" onClick={() => inspectNumber(p)}>({p}, {q})</button>
              ))}
            </div>
            <p className="msk-note">
              {pairKind === "twin" ? "Twin" : pairKind === "cousin" ? "Cousin" : "Sexy"}-prime pairs ≤ {cap}: {pairs.length}.
              The Twin Prime Conjecture remains unproved.
            </p>
          </>
        ) : null}
        {view === "residue" ? (
          <div className="primes-lanes">
            {Array.from({ length: mod }, (_, r) => {
              const forbidden = mod === 6 && (r === 0 || r === 2 || r === 3 || r === 4);
              return (
                <div key={r} className={`primes-lane${forbidden ? " is-forbidden" : ""}`}>
                  <b>{r} mod {mod}{forbidden ? " · no primes > 3" : ""}</b>
                  {Array.from({ length: cap }, (_, i) => i + 1).filter((v) => moduloClass(v, mod) === r).slice(0, 40).map((v) => (
                    <button key={v} type="button" className={`primes-cell ${isPrime(v) ? "is-prime" : "is-composite"}`} onClick={() => inspectNumber(v)}>{v}</button>
                  ))}
                </div>
              );
            })}
            <p className="msk-note">
              Every prime &gt; 3 lies in 1 or 5 mod 6. The converse is false: 25 = 6×4+1 is composite.
            </p>
          </div>
        ) : null}
        {view === "pi" ? (
          <>
            <svg className="primes-gap-plot" viewBox="0 0 440 220" role="img" aria-label="Prime counting function">
              <rect width="440" height="220" fill="#f8fbff" />
              <polyline
                fill="none"
                stroke="#147df2"
                strokeWidth="2"
                points={Array.from({ length: 40 }, (_, i) => {
                  const x = Math.max(2, Math.round((cap * (i + 1)) / 40));
                  return `${40 + (i * 380) / 39},${180 - (primePi(x) / Math.max(pi, 1)) * 150}`;
                }).join(" ")}
              />
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                points={Array.from({ length: 40 }, (_, i) => {
                  const x = Math.max(2, (cap * (i + 1)) / 40);
                  const y = liApprox(x);
                  return `${40 + (i * 380) / 39},${180 - (y / Math.max(pi, 1)) * 150}`;
                }).join(" ")}
              />
            </svg>
            <p className="msk-note">Blue π(x) · amber x/ln(x). Error at {cap}: {Number.isFinite(approx) ? (pi - approx).toFixed(1) : "—"}.</p>
          </>
        ) : null}
        {view === "goldbach" ? (
          <>
            <SliderRow label="Even number" value={evenN} min={4} max={Math.min(200, cap)} step={2} onChange={setEvenN} />
            <div className="primes-pills">
              {goldbach.map(([p, q]) => (
                <button key={`${p}+${q}`} type="button" onClick={() => inspectNumber(p)}>{evenN} = {p} + {q}</button>
              ))}
            </div>
            <p className="msk-note">{goldbach.length} Goldbach pair{goldbach.length === 1 ? "" : "s"} for {evenN} (verified even = p + q with p, q prime).</p>
          </>
        ) : null}
        {view === "wilson" ? (
          <div>
            <p className="msk-formula">(p − 1)! ≡ −1 (mod p) iff p is prime (Wilson).</p>
            <div className="primes-pills">
              {primes.slice(0, 18).map((p) => (
                <button key={p} type="button" onClick={() => setFeedback({ ok: wilsonHolds(p), text: `(${p}−1)! ≡ ${wilsonResidue(p)} (mod ${p}). Wilson ${wilsonHolds(p) ? "holds" : "fails"}.` })}>
                  {p}: {wilsonResidue(p)}
                </button>
              ))}
            </div>
            <p className="msk-note">Check a composite: (8−1)! ≡ {wilsonResidue(8)} (mod 8), not 7, so 8 is not prime.</p>
          </div>
        ) : null}
        {view === "bertrand" ? (
          <div>
            <p className="msk-formula">Bertrand: for n ≥ 2 there is a prime strictly between n and 2n.</p>
            <p className="msk-ok">Witness for n = {Math.max(2, Math.min(cap, 200))}: {bertrandPrime(Math.max(2, Math.min(cap, 200)))} lies between that n and twice n.</p>
            <p className="msk-note">Example: between 8 and 16 sits 11 (or 13).</p>
          </div>
        ) : null}
        {view === "race" ? (
          <div>
            <p className="msk-formula">Chebyshev’s bias: primes 3 (mod 4) often lead primes 1 (mod 4).</p>
            <LiveRow color="#8b45f4" label="π(x; 4, 3)" value={String(race.r3)} />
            <LiveRow color="#147df2" label="π(x; 4, 1)" value={String(race.r1)} />
            <p className="msk-note">Up to {cap}, {race.r3 >= race.r1 ? "3 (mod 4) is ahead or tied" : "1 (mod 4) is ahead"}.</p>
          </div>
        ) : null}
        {focus ? <button type="button" className="msk-soft" onClick={() => onInspect(focus)}>Inspect number</button> : null}
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label={`Range ≤ ${cap}`} value={hidePi ? "π(n) hidden for the challenge" : `π(${cap}) = ${pi}`} />
        <LiveRow color="#8b45f4" label="Percentage prime" value={hidePi ? "hidden" : `${((pi / cap) * 100).toFixed(1)}%`} />
        <LiveRow color="#10b981" label="Largest prime" value={String(largestPrimeAtMost(cap) ?? "—")} />
        <LiveRow color="#f59e0b" label="Largest gap" value={`${largestGap.gap} (${largestGap.prime}→${largestGap.next})`} />
        <LiveRow color="#08b9dd" label="Average gap" value={avgGap.toFixed(2)} />
        <LiveRow color="#64748b" label="Gap-2 / gap-4 pairs" value={`${gap2} / ${gap4}`} />
        {view === "pi" ? <LiveRow color="#f59e0b" label="x / ln(x)" value={Number.isFinite(approx) ? approx.toFixed(1) : "—"} /> : null}
        <p className="msk-note"><Tip term="π(n)">The prime-counting function: how many primes are ≤ n.</Tip> Visual clusters are clues, not proofs. The Twin Prime Conjecture remains unproved.</p>
        <Feedback ok={feedback?.ok ?? null} text={feedback?.text ?? ""} />
        <ChallengeCard {...challenge} onNew={() => setChallengeKey((k) => k + 1)} reveal={teacherReveal} />
      </aside>
    </>
  );
}
