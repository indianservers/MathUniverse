import { useMemo, useState } from "react";
import { Field, LiveRow, Panel, SliderRow } from "../../mockup/studioLabKit";
import { ChallengeCard, Feedback, PlaybackBar, Tip, copyText, useStepPlayer } from "./primesUi";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import {
  applySieveSteps,
  firstEliminator,
  formatFactorization,
  generatePrimes,
  isPrime,
  largestPrimeAtMost,
  parseChallengeInt,
  primeFactors,
  primePi,
  randomInt,
  sieveAlgorithmLines,
  sieveTrace,
} from "./primesMath";

type Props = {
  n: number;
  setN: (n: number) => void;
  step: number;
  setStep: (n: number | ((s: number) => number)) => void;
  teacherReveal?: boolean;
  showAlgorithm?: boolean;
  pauseEachStep?: boolean;
  onExploreFactor: (n: number) => void;
};

export default function SievePanel({ n, setN, step, setStep, teacherReveal, showAlgorithm, pauseEachStep, onExploreFactor }: Props) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [selectMode, setSelectMode] = useState(false);
  const [focus, setFocus] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [challengeKey, setChallengeKey] = useState(0);
  const [copied, setCopied] = useState("");
  const [sound, setSound] = useState(false);
  const reduced = useReducedMotion();

  const model = useMemo(() => applySieveSteps(n, step), [n, step]);
  const maxStep = Math.max(0, model.steps.length - 1);
  const sqrtN = model.sqrtN;

  useStepPlayer(playing && !reduced, speed, () => {
    setStep((s) => {
      if (s >= maxStep) {
        setPlaying(false);
        return maxStep;
      }
      const next = s + 1;
      if (sound && !reduced && typeof window !== "undefined" && typeof AudioContext !== "undefined") {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 420 + (next % 8) * 40;
        gain.gain.value = 0.04;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
      if (pauseEachStep && model.steps[next]?.kind === "select") setPlaying(false);
      return next;
    });
  });

  const challenge = useMemo(() => {
    const kind = challengeKey % 5;
    if (kind === 0) return { prompt: `How many primes are ≤ ${n}?`, expected: primePi(n), hint: "Count confirmed primes on the board, excluding 1.", check: (raw: string) => parseChallengeInt(raw) === primePi(n), hideCount: true };
    if (kind === 1) return { prompt: `What is the largest prime ≤ ${Math.min(n, 80)}?`, expected: largestPrimeAtMost(Math.min(n, 80)) ?? 2, hint: "Look at the right end of the prime list.", check: undefined as ((raw: string) => boolean) | undefined, hideCount: false };
    const p = generatePrimes(Math.min(n, 20)).find((v) => v * v <= n) ?? 7;
    const first = p * p;
    if (kind === 2) return { prompt: `Which number is eliminated first when processing ${p}?`, expected: first, hint: "The optimized sieve starts at p².", hideCount: false };
    if (kind === 3) return { prompt: "Is 91 prime? Enter 1 for yes, 0 for no.", expected: 0, hint: "Check 7: 7 × 13 = 91.", hideCount: false };
    const lo = 30;
    const hi = Math.min(60, n);
    const count = generatePrimes(hi).filter((v) => v > lo && v <= hi).length;
    return { prompt: `How many primes exist between ${lo} and ${hi} (exclusive of ${lo})?`, expected: count, hint: "Count primes p with 30 < p ≤ bound.", hideCount: true };
  }, [challengeKey, n]);

  const inspect = focus ?? (model.steps[step]?.kind === "eliminate" ? model.steps[step].multiple : model.currentPrime);
  const nextSelect = model.steps.slice(step + 1).find((s) => s.kind === "select");
  const currentStep = model.steps[step];
  const equation = currentStep?.kind === "eliminate" ? `${currentStep.prime} × ${currentStep.factor} = ${currentStep.multiple}` : null;

  const explain =
    currentStep?.kind === "select" ? `Current prime: ${currentStep.prime}. Begin striking multiples at ${currentStep.prime}² = ${currentStep.prime ** 2}.`
      : currentStep?.kind === "eliminate" ? `Current prime: ${currentStep.prime}. ${equation}${currentStep.already ? " (already composite)" : ""}.`
        : currentStep?.kind === "confirm" ? `p² > ${n}, so unmarked ${currentStep.value} is prime.`
          : `Sieve complete for 2–${n}.`;

  const onCell = (v: number) => {
    setFocus(v);
    if (v === 1) {
      setFeedback({ ok: false, text: "1 is neither prime nor composite. It has only one positive divisor." });
      return;
    }
    if (selectMode) {
      if (nextSelect && nextSelect.kind === "select") {
        if (v === nextSelect.prime) {
          const idx = model.steps.findIndex((s, i) => i > step && s.kind === "select");
          setStep(idx);
          setFeedback({ ok: true, text: `Correct — ${v} is the next unmarked prime.` });
        } else if (model.states[v] === "composite" || model.states[v] === "eliminating") {
          setFeedback({ ok: false, text: `${v} has already been marked composite. Choose the smallest remaining unmarked number.` });
        } else {
          setFeedback({ ok: false, text: `${nextSelect.prime} is the smallest remaining unmarked number.` });
        }
      } else {
        setFeedback({ ok: false, text: "Every prime needed for sieving is already chosen. Finish confirming the remaining unmarked numbers." });
      }
      return;
    }
    if (model.states[v] === "composite" || model.states[v] === "eliminating") {
      const by = model.eliminatedBy[v] ?? firstEliminator(v);
      setFeedback({
        ok: true,
        text: `${v} is composite. First eliminated by ${by}. ${v} = ${by} × ${v / (by ?? 1)}. Prime factorization = ${formatFactorization(primeFactors(v))}.`,
      });
    } else if (isPrime(v)) {
      setFeedback({ ok: true, text: `${v} is prime. It has exactly two positive divisors: 1 and ${v}.` });
    } else if (model.states[v] === "candidate") {
      setFeedback({ ok: true, text: `${v} is still a candidate: no prime ≤ √${n} has claimed it yet.` });
    } else {
      setFeedback({ ok: true, text: `${v} is still unclassified.` });
    }
  };

  const jumpNextPrime = () => {
    const idx = model.steps.findIndex((s, i) => i > step && s.kind === "select");
    if (idx >= 0) setStep(idx);
    else setStep(maxStep);
    setPlaying(false);
  };

  return (
    <>
      <Panel title="Sieve of Eratosthenes">
        <SliderRow label="Range" value={n} min={10} max={300} step={1} onChange={(v) => { setN(v); setStep(0); setPlaying(false); }} />
        <Field label="n">
          <input type="number" min={10} max={300} step={1} value={n} onChange={(e) => { const v = Number(e.target.value); if (Number.isInteger(v)) { setN(Math.min(300, Math.max(10, v))); setStep(0); } }} />
        </Field>
        <label className="msk-field msk-slider-row">
          <span>Algorithm step {step} / {maxStep}</span>
          <div>
            <input
              type="range"
              min={0}
              max={maxStep}
              step={1}
              value={step}
              aria-label="Sieve step"
              onChange={(e) => { setPlaying(false); setStep(Number(e.target.value)); }}
            />
          </div>
        </label>
        <PlaybackBar
          playing={playing}
          onPlay={() => { if (!reduced) setPlaying(true); }}
          onPause={() => setPlaying(false)}
          onPrev={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)); }}
          onNext={() => { setPlaying(false); setStep((s) => Math.min(maxStep, s + 1)); }}
          onReset={() => { setStep(0); setPlaying(false); setFocus(null); setFeedback(null); }}
          onRandom={() => { setN(randomInt(20, 120)); setStep(0); setPlaying(false); }}
          hideAuto
          speed={speed}
          onSpeed={setSpeed}
          disablePrev={step <= 0}
          disableNext={step >= maxStep}
        />
        <div className="msk-btn-row">
          <button type="button" className={`msk-soft${selectMode ? " active" : ""}`} aria-pressed={selectMode} onClick={() => setSelectMode((v) => !v)}>Select Prime</button>
          <button type="button" className="msk-soft" onClick={jumpNextPrime}>Jump to next prime</button>
          <label className="msk-toggle"><input type="checkbox" checked={sound && !reduced} onChange={(e) => setSound(e.target.checked)} /> Sound (optional)</label>
          {reduced ? <p className="msk-note">Reduced motion: step with the slider instead of auto-play.</p> : null}
        </div>
        <p className="msk-note">
          <Tip term="Sieve of Eratosthenes">An algorithm that finds primes by crossing out multiples of each prime, starting at p².</Tip>
          {" "}1 is neither prime nor composite.
        </p>
        {showAlgorithm ? (
          <ol className="msk-steps">{sieveAlgorithmLines(n).map((line) => <li key={line}><span>{line}</span></li>)}</ol>
        ) : null}
      </Panel>
      <section className="msk-panel msk-canvas" onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); setStep((s) => Math.min(maxStep, s + 1)); }
        if (e.key === "ArrowLeft") { e.preventDefault(); setStep((s) => Math.max(0, s - 1)); }
        if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
      }}>
        <div className="primes-legend">
          <span><i style={{ background: "#f8fafc", border: "1px dashed #94a3b8" }} />Neither</span>
          <span><i style={{ background: "#f1f5f9" }} />Unprocessed</span>
          <span><i style={{ background: "#c7d2fe" }} />Candidate (≥ p²)</span>
          <span><i style={{ background: "#147df2" }} />Current prime</span>
          <span><i style={{ background: "#f59e0b" }} />Multiple being eliminated</span>
          <span><i style={{ background: "#e2e8f0" }} />Composite</span>
          <span><i style={{ background: "#dbeafe" }} />Confirmed prime</span>
        </div>
        <p className="msk-note">√{n} ≈ {Math.sqrt(n).toFixed(2)} so the sieve may stop after primes ≤ {sqrtN}.</p>
        {equation ? <p className="msk-formula primes-eq">{equation}</p> : null}
        <div className="primes-grid" role="grid" aria-label={`Integers from 1 to ${n}`}>
          {Array.from({ length: n }, (_, i) => i + 1).map((v) => {
            const state = model.states[v] ?? "unprocessed";
            const hit = model.eliminatedBy[v];
            return (
              <button
                key={v}
                type="button"
                className={`primes-cell is-${state}${focus === v ? " is-focus" : ""}${currentStep?.kind === "eliminate" && currentStep.multiple === v ? " is-eq" : ""}`}
                aria-label={`${v} ${state}${hit ? ` first hit by ${hit}` : ""}`}
                onClick={() => onCell(v)}
              >
                <span className={state === "composite" || state === "eliminating" ? "primes-strike" : undefined}>{v}</span>
                {hit ? <sup>{hit}</sup> : null}
              </button>
            );
          })}
        </div>
        <div className="primes-sqrt" aria-hidden="true">
          <span>1 … {sqrtN} (primes here do the sieving)</span>
          <span>{sqrtN + 1} … {n} (survive or fall)</span>
        </div>
        <p className="msk-formula">{explain}</p>
        <div className="primes-pills" aria-label="Prime list">
          {model.primes.map((p) => (
            <button key={p} type="button" onClick={() => setFocus(p)}>{p}</button>
          ))}
        </div>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Range" value={`2–${n}`} />
        <LiveRow color="#10b981" label="Primes found" value={challenge.hideCount && !teacherReveal ? "hidden for the challenge" : String(model.primes.length)} />
        <LiveRow color="#64748b" label="Composite numbers" value={String(model.composites.length)} />
        <LiveRow color="#8b45f4" label="Current prime" value={String(model.currentPrime ?? "—")} />
        <LiveRow color="#f59e0b" label={`Largest prime ≤ ${n}`} value={challenge.hideCount && !teacherReveal ? "hidden" : String(largestPrimeAtMost(n) ?? "—")} />
        <LiveRow color="#08b9dd" label="Algorithm stage" value={model.stage} />
        <p className="msk-note">{explain}</p>
        {inspect && inspect > 1 ? (
          <div className="primes-inspect">
            <b>{inspect}</b>
            <p>{model.states[inspect] === "neither" ? "Neither" : model.states[inspect] === "composite" || model.states[inspect] === "eliminating" ? "Composite" : isPrime(inspect) ? "Prime" : model.states[inspect] === "candidate" ? "Candidate" : "Unclassified"}</p>
            {model.eliminatedBy[inspect] ? (
              <p>First eliminated by {model.eliminatedBy[inspect]}. {inspect} = {model.eliminatedBy[inspect]} × {inspect / model.eliminatedBy[inspect]!}. Prime factorization = {formatFactorization(primeFactors(inspect))}.</p>
            ) : null}
            {!isPrime(inspect) && inspect > 1 ? <button type="button" className="msk-soft" onClick={() => onExploreFactor(inspect)}>Explore factorization</button> : null}
          </div>
        ) : inspect === 1 ? (
          <div className="primes-inspect"><b>1</b><p>Neither prime nor composite.</p></div>
        ) : null}
        <div className="msk-btn-row">
          <button type="button" className="msk-soft" onClick={async () => {
            const ok = await copyText(model.primes.join(", "));
            setCopied(ok ? "Copied prime list." : "Could not copy.");
          }}>Copy primes</button>
          <button type="button" className="msk-soft" onClick={async () => {
            const ok = await copyText(sieveTrace(n).join("\n"));
            setCopied(ok ? "Copied algorithm trace." : "Could not copy.");
          }}>Copy trace</button>
        </div>
        {copied ? <p className="msk-note" role="status">{copied}</p> : null}
        <Feedback ok={feedback?.ok ?? null} text={feedback?.text ?? ""} />
        <ChallengeCard {...challenge} onNew={() => setChallengeKey((k) => k + 1)} reveal={teacherReveal} />
      </aside>
    </>
  );
}
