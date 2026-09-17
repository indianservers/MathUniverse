import { useMemo, useState } from "react";
import { Field, LiveRow, Panel, Segmented, SliderRow } from "../../mockup/studioLabKit";
import { ChallengeCard, Feedback, Formula, PlaybackBar, Tip, useStepPlayer } from "./primesUi";
import { EuclidRectGraph, ExponentBars, MultiplesGraph, ThreeCircleVenn, TwoCircleVenn } from "./gcdVisual";
import {
  GCD_WORD_PROBLEMS,
  areCoprime,
  bezoutCertificate,
  divisors,
  euclideanSteps,
  extendedEuclid,
  formatLatexFactorization,
  gcd,
  gcdByMinExponents,
  gcdLcmIdentity,
  gcdMany,
  lcm,
  lcmByMaxExponents,
  lcmMany,
  parseChallengeInt,
  parseStudioInt,
  primeFactors,
  randomInt,
  vennPrimeFactors,
  vennThree,
} from "./primesMath";

const METHODS = [
  { id: "prime", label: "Prime Factorization" },
  { id: "lists", label: "Factor/Multiple Lists" },
  { id: "euclid", label: "Euclidean Algorithm" },
  { id: "venn", label: "Venn Factor Diagram" },
];

type Props = {
  values: number[];
  setValues: (n: number[]) => void;
  teacherReveal?: boolean;
};

export default function GcdLcmPanel({ values, setValues, teacherReveal }: Props) {
  const [method, setMethod] = useState("prime");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [focus, setFocus] = useState<"gcd" | "lcm">("gcd");
  const [challengeKey, setChallengeKey] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [story, setStory] = useState(0);
  const [bank, setBank] = useState<"left" | "common" | "right" | null>(null);
  const [dragPrime, setDragPrime] = useState<number | null>(null);
  const nums = values.map((v) => Math.max(1, v));
  const a = nums[0] ?? 84;
  const b = nums[1] ?? 60;
  const c = nums[2];

  const g = gcdMany(nums);
  const l = lcmMany(nums);
  const gPowers = gcdByMinExponents(nums);
  const lPowers = lcmByMaxExponents(nums);
  const euclid = nums.length >= 3 && c != null
    ? [...euclideanSteps(a, b), ...euclideanSteps(gcd(a, b), c).map((row) => ({ ...row }))]
    : euclideanSteps(a, b);
  const identity = nums.length === 2 ? gcdLcmIdentity(a, b) : null;
  const bezout = nums.length === 2 ? bezoutCertificate(a, b) : null;
  const ext = nums.length === 2 ? extendedEuclid(a, b) : null;
  const maxStep = method === "euclid" ? Math.max(0, euclid.length - 1)
    : method === "lists" ? Math.max(divisors(a).length, divisors(b).length, 12)
    : method === "prime" ? nums.length + 2
      : 6;
  const finished = step >= maxStep || teacherReveal;

  useStepPlayer(playing, speed, () => {
    setStep((s) => {
      if (s >= maxStep) {
        setPlaying(false);
        return maxStep;
      }
      return s + 1;
    });
  });

  const shownA = divisors(a).slice(0, Math.max(1, step + 1));
  const shownB = divisors(b).slice(0, Math.max(1, step + 1));
  const common = shownA.filter((d) => shownB.includes(d));
  const runningGcd = common.length ? Math.max(...common) : 1;
  const multiplesA = Array.from({ length: Math.max(4, step + 2) }, (_, i) => a * (i + 1));
  const multiplesB = Array.from({ length: Math.max(4, step + 2) }, (_, i) => b * (i + 1));
  const firstCommonMultiple = multiplesA.find((m) => multiplesB.includes(m)) ?? lcm(a, b);
  const venn = vennPrimeFactors(a, b);
  const three = c != null ? vennThree(a, b, c) : null;
  const euclidRow = euclid[Math.min(step, Math.max(0, euclid.length - 1))];
  const problem = GCD_WORD_PROBLEMS[story % GCD_WORD_PROBLEMS.length]!;

  const challenge = useMemo(() => {
    const kind = challengeKey % 5;
    if (kind === 0) return { prompt: "gcd(84,60) = ?", expected: 12, hint: "Shared primes with min powers: 2² × 3." };
    if (kind === 1) return { prompt: "lcm(18,24) = ?", expected: 72, hint: "Max exponents: 2³ × 3²." };
    if (kind === 2) return { prompt: "Find two numbers with GCD 6 and LCM 72. Enter their product.", expected: 432, hint: "gcd × lcm = a × b.", check: (raw: string) => parseChallengeInt(raw) === 432 };
    if (kind === 3) return { prompt: "If gcd(a,b)=8, lcm(a,b)=240 and a=48, find b.", expected: 40, hint: "b = gcd×lcm / a." };
    return { prompt: "Which method finds gcd(12348,14256) most efficiently? Enter 1 factorization, 2 lists, 3 Euclid, 4 Venn.", expected: 3, hint: "Remainders beat huge factor lists." };
  }, [challengeKey]);

  const setAt = (index: number, raw: string) => {
    const parsed = parseStudioInt(raw, 0, 1000, `n${index + 1}`);
    if (!parsed.ok) { setFeedback({ ok: false, text: parsed.error }); return; }
    const next = [...nums];
    next[index] = parsed.value === 0 ? 0 : parsed.value;
    setValues(next);
    setStep(0);
  };

  const dropOn = (region: "left" | "common" | "right") => {
    if (dragPrime == null) return;
    const ok =
      (region === "common" && venn.common.includes(dragPrime))
      || (region === "left" && venn.left.includes(dragPrime))
      || (region === "right" && venn.right.includes(dragPrime));
    setFeedback(ok
      ? { ok: true, text: `${dragPrime} belongs in the ${region === "common" ? "shared" : region} region.` }
      : { ok: false, text: `${dragPrime} does not belong in that region. Shared primes go in COMMON.` });
    setDragPrime(null);
    setBank(region);
  };

  return (
    <>
      <Panel title="GCD & LCM">
        {nums.map((v, i) => (
          <SliderRow key={i} label={i === 0 ? "A" : i === 1 ? "B" : `n${i + 1}`} value={v} min={1} max={1000} step={1} onChange={(n) => {
            const next = [...nums]; next[i] = n; setValues(next); setStep(0);
          }} />
        ))}
        {nums.map((v, i) => (
          <Field key={`f${i}`} label={i === 0 ? "A" : i === 1 ? "B" : `Number ${i + 1}`}>
            <input value={String(v)} onChange={(e) => setAt(i, e.target.value)} />
          </Field>
        ))}
        <button type="button" className="msk-soft" onClick={() => setValues([...nums, randomInt(12, 120)].slice(0, 5))}>Add Number +</button>
        {nums.length > 2 ? <button type="button" className="msk-soft" onClick={() => setValues(nums.slice(0, -1))}>Remove last</button> : null}
        <Segmented value={method} onChange={(id) => { setMethod(id); setStep(0); }} options={METHODS} label="Methods" />
        <PlaybackBar
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onPrev={() => setStep((s) => Math.max(0, s - 1))}
          onNext={() => setStep((s) => Math.min(maxStep, s + 1))}
          onReset={() => { setValues([84, 60]); setStep(0); setPlaying(false); }}
          onRandom={() => { setValues([randomInt(12, 180), randomInt(12, 180)]); setStep(0); }}
          onAuto={() => setPlaying(true)}
          speed={speed}
          onSpeed={setSpeed}
        />
        <div className="msk-btn-row">
          <button type="button" className={`msk-soft${focus === "gcd" ? " active" : ""}`} onClick={() => setFocus("gcd")}>Show GCD</button>
          <button type="button" className={`msk-soft${focus === "lcm" ? " active" : ""}`} onClick={() => setFocus("lcm")}>Show LCM</button>
        </div>
        {areCoprime(a, b) && nums.length === 2 ? <p className="msk-ok">A and B are coprime: gcd = 1.</p> : null}
        <div className="msk-challenge">
          <span>Word problem</span>
          <p>{problem.text}</p>
          <div className="msk-btn-row">
            <button type="button" className="msk-soft" onClick={() => { setValues([problem.a, problem.b]); setStep(0); }}>Load {problem.a} and {problem.b}</button>
            <button type="button" className="msk-soft" onClick={() => setStory((s) => s + 1)}>Next story</button>
          </div>
        </div>
      </Panel>
      <section className="msk-panel msk-canvas">
        {method === "prime" ? (
          <>
            {c != null && three ? <ThreeCircleVenn a={a} b={b} c={c} three={three} /> : <TwoCircleVenn a={a} b={b} venn={venn} focus={focus} finished={finished} gcdValue={g} lcmValue={l} />}
            {nums.length === 2 ? (
              <ExponentBars a={a} b={b} aPowers={primeFactors(a)} bPowers={primeFactors(b)} focus={focus} finished={finished} />
            ) : null}
            {nums.map((v, i) => (
              i <= step ? <Formula key={`${v}-${i}`} value={`${v} = ${formatLatexFactorization(primeFactors(v))}`} /> : null
            ))}
            {step >= nums.length ? (
              <p className="msk-note">
                GCD keeps the minimum shared exponents
                {finished ? <>: <Formula value={`\\gcd = ${formatLatexFactorization(gPowers)} = ${g}`} /></> : " (play to the end to reveal)."}
              </p>
            ) : (
              <p className="msk-note">Blue circle is A, purple is B. Shared primes sit in the overlap.</p>
            )}
            {step >= nums.length + 1 ? (
              <p className="msk-note">
                LCM keeps the maximum exponents
                {finished ? <>: <Formula value={`\\operatorname{lcm} = ${formatLatexFactorization(lPowers)} = ${l}`} /></> : "."}
              </p>
            ) : null}
          </>
        ) : null}
        {method === "lists" ? (
          <>
            <MultiplesGraph a={a} b={b} lcmValue={l} step={step} finished={finished} />
            <p className="msk-note">Factors of {a}: {shownA.join(", ")}</p>
            <p className="msk-note">Factors of {b}: {shownB.join(", ")}</p>
            <p className="msk-formula">Common so far: {common.join(", ") || "—"} · running greatest: {runningGcd}</p>
            <p className="msk-note">Multiples of {a}: {multiplesA.join(", ")}…</p>
            <p className="msk-note">Multiples of {b}: {multiplesB.join(", ")}…</p>
            <p className="msk-formula">
              First common multiple shown: {multiplesA.filter((m) => multiplesB.includes(m)).join(", ") || "not yet"}
            </p>
            {finished ? <p className="msk-ok">GCD = {g} · LCM = {firstCommonMultiple}</p> : <p className="msk-note">Keep listing until the first common multiple appears.</p>}
          </>
        ) : null}
        {method === "euclid" ? (
          <>
            {euclidRow ? <EuclidRectGraph row={euclidRow} gcdValue={g} finished={finished} /> : null}
            <ol className="msk-steps">
              {euclid.slice(0, step + 1).map((row, i) => (
                <li key={i}><b>{i + 1}</b><span>{row.a} = {row.b} × {row.q} + {row.r}</span></li>
              ))}
            </ol>
            {euclidRow ? (
              <div className="primes-euclid-fit" aria-hidden="true">
                {Array.from({ length: euclidRow.q }, (_, i) => (
                  <i key={i} style={{ flex: euclidRow.b }} title={`${euclidRow.b}`} />
                ))}
                {euclidRow.r > 0 ? <i className="is-rem" style={{ flex: euclidRow.r }} title={`remainder ${euclidRow.r}`} /> : null}
              </div>
            ) : null}
            <p className="msk-note">Each row fits the smaller length into the larger: quotient copies plus remainder.</p>
            {nums.length >= 3 ? <p className="msk-note">For three numbers we compute gcd(gcd(A,B), C).</p> : null}
            {finished ? <p className="msk-ok">GCD = {g}</p> : <p className="msk-note">The GCD is the last non-zero remainder — finish the steps to reveal it.</p>}
            {finished && bezout ? (
              <Formula value={`${bezout.g} = ${a}(${bezout.x}) + ${b}(${bezout.y})`} />
            ) : null}
            {finished && ext ? <p className="msk-note">Bézout: integers x, y with gcd = Ax + By.</p> : null}
          </>
        ) : null}
        {method === "venn" && three && c != null ? (
          <>
          <ThreeCircleVenn a={a} b={b} c={c} three={three} />
          <div className="primes-venn primes-venn-3">
            <div><b>{a} only</b><div>{three.onlyA.map((p, i) => <span key={`a${i}`} className="primes-token">{p}</span>)}</div></div>
            <div><b>{b} only</b><div>{three.onlyB.map((p, i) => <span key={`b${i}`} className="primes-token" style={{ background: "#8b45f4" }}>{p}</span>)}</div></div>
            <div><b>{c} only</b><div>{three.onlyC.map((p, i) => <span key={`c${i}`} className="primes-token" style={{ background: "#f59e0b" }}>{p}</span>)}</div></div>
            <div><b>A∩B</b><div>{three.ab.map((p, i) => <span key={`ab${i}`} className="primes-token" style={{ background: "#10b981" }}>{p}</span>)}</div></div>
            <div><b>A∩C</b><div>{three.ac.map((p, i) => <span key={`ac${i}`} className="primes-token" style={{ background: "#10b981" }}>{p}</span>)}</div></div>
            <div><b>B∩C</b><div>{three.bc.map((p, i) => <span key={`bc${i}`} className="primes-token" style={{ background: "#10b981" }}>{p}</span>)}</div></div>
            <div><b>A∩B∩C</b><div>{three.abc.map((p, i) => <span key={`abc${i}`} className="primes-token" style={{ background: "#0f766e" }}>{p}</span>)}</div></div>
          </div>
          </>
        ) : null}
        {method === "venn" && !three ? (
          <>
          <TwoCircleVenn a={a} b={b} venn={venn} focus={focus} finished={finished} gcdValue={g} lcmValue={l} />
          <div className={`primes-venn${focus === "gcd" ? " is-gcd" : " is-lcm"}`}>
            {(["left", "common", "right"] as const).map((region) => (
              <div
                key={region}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dropOn(region)}
                className={bank === region ? "is-drop" : ""}
              >
                <b>{region === "common" ? "COMMON" : region === "left" ? `${a} only` : `${b} only`}</b>
                <div>
                  {(region === "left" ? venn.left : region === "right" ? venn.right : venn.common).map((p, i) => (
                    <span
                      key={`${region}${i}`}
                      className="primes-token"
                      draggable
                      onDragStart={() => setDragPrime(p)}
                      style={{ background: region === "common" ? "#10b981" : region === "right" ? "#8b45f4" : "#147df2", opacity: focus === "gcd" && region !== "common" ? 0.35 : 1 }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          </>
        ) : null}
        {method === "venn" ? (
          finished ? (
            <>
              <Formula value={`\\gcd = ${formatLatexFactorization(gPowers)} = ${g}`} />
              <Formula value={`\\operatorname{lcm} = ${formatLatexFactorization(lPowers)} = ${l}`} />
            </>
          ) : (
            <p className="msk-note">{focus === "gcd" ? "GCD is the COMMON region only." : "LCM uses every prime token in the whole diagram."} Play to the end to reveal the values. Drag a token onto a region to check it belongs there.</p>
          )
        ) : null}
        {identity && finished ? (
          <Formula value={`\\gcd(a,b)\\times\\operatorname{lcm}(a,b)=a\\times b \\Rightarrow ${identity.g}\\times ${identity.l}=${a}\\times ${b}`} />
        ) : null}
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Numbers" value={nums.join(", ")} />
        <LiveRow color="#10b981" label="GCD" value={finished ? String(g) : "hidden until the method finishes"} />
        <LiveRow color="#8b45f4" label="LCM" value={finished ? String(l) : "hidden until the method finishes"} />
        <LiveRow color="#f59e0b" label="Focus" value={finished ? (focus === "gcd" ? formatLatexFactorization(gPowers).replace(/\\times/g, "×") : formatLatexFactorization(lPowers).replace(/\\times/g, "×")) : "—"} />
        <LiveRow color="#08b9dd" label="Product check" value={finished && identity ? `${identity.left}` : "—"} />
        <p className="msk-note"><Tip term="Euclidean algorithm">Replace (a, b) by (b, a mod b) until the remainder is 0.</Tip></p>
        <Feedback ok={feedback?.ok ?? null} text={feedback?.text ?? ""} />
        <ChallengeCard {...challenge} onNew={() => setChallengeKey((k) => k + 1)} reveal={teacherReveal} />
      </aside>
    </>
  );
}
