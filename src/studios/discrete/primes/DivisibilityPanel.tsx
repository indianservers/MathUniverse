import { useMemo, useState } from "react";
import { Field, LiveRow, Panel, Segmented } from "../../mockup/studioLabKit";
import { ChallengeCard, Feedback, PlaybackBar, Tip, useStepPlayer } from "./primesUi";
import {
  STANDARD_DIVISORS,
  digitInfo,
  divisibilityTest,
  formatFactorization,
  hammingDigits,
  isPrime,
  parseChallengeInt,
  parseStudioInt,
  placeValues,
  primeFactors,
  randomInt,
  rule7Steps,
  tenMod,
  tensDigitChoicesDiv4,
} from "./primesMath";

type Props = {
  n: number;
  setN: (n: number) => void;
  teacherReveal?: boolean;
  onTestPrime: (n: number) => void;
};

export default function DivisibilityPanel({ n, setN, teacherReveal, onTestPrime }: Props) {
  const [divisor, setDivisor] = useState(2);
  const [custom, setCustom] = useState("13");
  const [compare, setCompare] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [build, setBuild] = useState(["1", "2", "3", "5"]);
  const [challengeKey, setChallengeKey] = useState(0);
  const [raw, setRaw] = useState(String(n));
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [placesOn, setPlacesOn] = useState(true);
  const [primeNote, setPrimeNote] = useState("");

  const result = divisibilityTest(n, divisor);
  const info = digitInfo(n);
  const places = placeValues(n);
  const highlight =
    divisor === 2 || divisor === 5 || divisor === 10 ? [info.digits.length - 1]
      : divisor === 4 || divisor === 25 ? [info.digits.length - 2, info.digits.length - 1]
        : divisor === 8 ? [info.digits.length - 3, info.digits.length - 2, info.digits.length - 1]
          : info.digits.map((_, i) => i);
  const rule7 = divisor === 7 ? rule7Steps(n) : null;

  useStepPlayer(playing, speed, () => {
    setStep((s) => {
      if (s >= result.lines.length - 1) {
        setPlaying(false);
        return result.lines.length - 1;
      }
      return s + 1;
    });
  });

  const buildNumber = Number(build.join(""));
  const by3 = divisibilityTest(buildNumber, 3).divisible;
  const by5 = divisibilityTest(buildNumber, 5).divisible;
  const by2 = divisibilityTest(buildNumber, 2).divisible;
  const buildOk = by3 && by5 && !by2;
  const factors = STANDARD_DIVISORS.filter((d) => divisibilityTest(n, d).divisible);

  const challenge = useMemo(() => {
    const kind = challengeKey % 4;
    if (kind === 0) {
      return {
        prompt: "Make a number divisible by 9. Enter any multiple of 9 between 18 and 99.",
        expected: 18,
        hint: "Digit sum must be a multiple of 9.",
        check: (raw: string) => {
          const v = parseChallengeInt(raw);
          return v != null && v >= 18 && v <= 99 && v % 9 === 0;
        },
      };
    }
    if (kind === 1) {
      return {
        prompt: "Change one digit so 3428 becomes divisible by 3. Enter the new number.",
        expected: 3426,
        hint: "Digit sum of 3428 is 17; nearest multiple of 3 is 15 or 18.",
        check: (raw: string) => {
          const v = parseChallengeInt(raw);
          return v != null && v % 3 === 0 && hammingDigits(3428, v) === 1;
        },
      };
    }
    if (kind === 2) {
      return {
        prompt: "Which digit can replace □ in 53□7 so the number is divisible by 9? Enter one valid digit.",
        expected: 3,
        hint: "5+3+d+7 = 15+d must be a multiple of 9, so d=3.",
        check: (raw: string) => parseChallengeInt(raw) === 3,
      };
    }
    const choices = tensDigitChoicesDiv4(4);
    return {
      prompt: "Find all possible digits for 21□4 to be divisible by 4. Enter the count of possible digits 0–9.",
      expected: choices.length,
      hint: `Last two digits □4 must be divisible by 4. Possible tens digits: ${choices.join(", ")}.`,
      check: (raw: string) => parseChallengeInt(raw) === choices.length,
    };
  }, [challengeKey]);

  const testPrime = () => {
    if (n > 300) {
      setPrimeNote(`${n} is ${isPrime(n) ? "prime" : "composite"} (tested directly because the sieve board stops at 300). Factorization: ${formatFactorization(primeFactors(n))}.`);
      return;
    }
    setPrimeNote("");
    onTestPrime(n);
  };

  return (
    <>
      <Panel title="Divisibility Rules">
        <Field label="Number">
          <input
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              const parsed = parseStudioInt(e.target.value.replace(/,/g, ""), 0, 1_000_000_000, "Number");
              if (!parsed.ok) { setFeedback({ ok: false, text: parsed.error }); return; }
              setN(parsed.value);
              setFeedback(null);
              setStep(0);
            }}
          />
        </Field>
        <Segmented
          value={String(divisor)}
          onChange={(id) => { setDivisor(Number(id)); setStep(0); setCompare(false); }}
          options={STANDARD_DIVISORS.map((d) => ({ id: String(d), label: `÷${d}` }))}
          label="Rule explorer"
        />
        <div className="msk-btn-row">
          <Field label="Custom divisor">
            <input value={custom} onChange={(e) => setCustom(e.target.value)} />
          </Field>
          <button type="button" className="msk-soft" onClick={() => {
            const parsed = parseStudioInt(custom, 2, 99, "Divisor");
            if (!parsed.ok) { setFeedback({ ok: false, text: parsed.error }); return; }
            setDivisor(parsed.value);
            setStep(0);
          }}>Apply custom</button>
        </div>
        <PlaybackBar
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onPrev={() => setStep((s) => Math.max(0, s - 1))}
          onNext={() => setStep((s) => Math.min(result.lines.length - 1, s + 1))}
          onReset={() => { setN(123456); setRaw("123456"); setDivisor(2); setStep(0); }}
          onRandom={() => { const v = randomInt(20, 250000); setN(v); setRaw(String(v)); setStep(0); }}
          onAuto={() => setPlaying(true)}
          speed={speed}
          onSpeed={setSpeed}
        />
        <button type="button" className="msk-soft" onClick={() => setCompare((v) => !v)}>Which numbers divide this?</button>
        <button type="button" className="msk-soft" onClick={testPrime}>Test primality</button>
        <label className="msk-field"><input type="checkbox" checked={placesOn} onChange={(e) => setPlacesOn(e.target.checked)} /> Show place values</label>
      </Panel>
      <section className="msk-panel msk-canvas">
        <div className="primes-digits" aria-label="Digits of the number">
          {info.digits.map((d, i) => (
            <span key={i} className={`primes-digit${highlight.includes(i) ? " is-on" : ""}`}>
              {d}
              {placesOn ? <small>{places[i]?.place}</small> : i === info.digits.length - 1 && (divisor === 2 || divisor === 5 || divisor === 10) ? <small>last</small> : null}
            </span>
          ))}
        </div>
        {placesOn ? (
          <p className="msk-note">
            {places.map((p) => `${p.digit}×${p.place}`).join(" + ")} = {n}
          </p>
        ) : null}
        <p className="msk-formula">{result.title} · 10 ≡ {tenMod(divisor)} (mod {divisor})</p>
        {result.lines.slice(0, step + 1).map((line) => <p key={line} className="msk-note">{line}</p>)}
        {rule7 && rule7.steps[Math.min(step, Math.max(0, rule7.steps.length - 1))] ? (
          <div className="primes-rule7">
            {(() => {
              const s = rule7.steps[Math.min(step, rule7.steps.length - 1)]!;
              return <p className="msk-formula">{s.lead} − 2 × {s.last} = {s.next}</p>;
            })()}
          </div>
        ) : null}
        <p className={result.divisible ? "msk-ok" : "msk-note"}>{result.divisible ? `Divisible by ${divisor} ✓` : `Not divisible by ${divisor}`}</p>
        {divisor === 3 || divisor === 9 ? (
          <p className="msk-note">Why 3 and 9 work: 10 ≡ 1 (mod {divisor}), so a number equals its digit sum modulo {divisor}.</p>
        ) : null}
        {divisor === 11 ? (
          <p className="msk-note">Why 11 works: 10 ≡ −1 (mod 11), so alternating digit sums decide divisibility.</p>
        ) : null}
        {compare ? (
          <div className="primes-pills">
            {STANDARD_DIVISORS.map((d) => {
              const r = divisibilityTest(n, d);
              return (
                <button key={d} type="button" onClick={() => { setDivisor(d); setCompare(false); setStep(0); }} style={{ background: r.divisible ? "#dcfce7" : "#fee2e2", color: r.divisible ? "#166534" : "#991b1b" }}>
                  {d} {r.divisible ? "✓" : "✗"} {r.divisible ? `· ${n / d}` : ""}
                </button>
              );
            })}
          </div>
        ) : null}
        {compare ? (
          <p className="msk-note">
            Standard-rule factors: {factors.map((d) => `${d} × ${n / d}`).join(", ") || "none in 2–13, 25"}.
          </p>
        ) : null}
        {primeNote ? <p className="msk-note">{primeNote}</p> : null}
        <div className="msk-challenge">
          <span>Build-a-number</span>
          <p>Create a 4-digit number divisible by 3 and 5, but not divisible by 2.</p>
          <div className="primes-build">
            {build.map((d, i) => (
              <input
                key={i}
                className="primes-digit"
                value={d}
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                onChange={(e) => {
                  const ch = e.target.value.replace(/\D/g, "").slice(-1) || "0";
                  const next = [...build];
                  next[i] = ch;
                  setBuild(next);
                }}
              />
            ))}
          </div>
          <p className="msk-note">Divisible by 3 {by3 ? "✓" : "✗"} · Divisible by 5 {by5 ? "✓" : "✗"} · Not divisible by 2 {!by2 ? "✓" : "✗"}</p>
          {buildOk ? <p className="msk-ok">Challenge complete.</p> : null}
        </div>
        <p className="msk-note"><Tip term="divisible">n is divisible by d when n = d × k for some integer k, i.e. remainder 0.</Tip></p>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Number" value={String(n)} />
        <LiveRow color="#8b45f4" label="Rule" value={`÷${divisor}`} />
        <LiveRow color="#10b981" label="Verdict" value={result.divisible ? "divisible" : `remainder ${result.remainder}`} />
        <LiveRow color="#f59e0b" label="Why it works" value={result.title} />
        <Feedback ok={feedback?.ok ?? null} text={feedback?.text ?? ""} />
        <ChallengeCard {...challenge} onNew={() => setChallengeKey((k) => k + 1)} reveal={teacherReveal} />
      </aside>
    </>
  );
}
