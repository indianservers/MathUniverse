import { useMemo, useState, type KeyboardEvent } from "react";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { MockupLearningStrip } from "../../mockup/MockupStudioChrome";
import { useLabMode } from "../../mockup/studioLabKit";
import { LEARNING, MISCONCEPTIONS, PRIMES_MODES, type PrimesMode } from "./primesCopy";
import { usePrimesSession, writePrimesSession } from "./primesSession";
import DivisibilityPanel from "./DivisibilityPanel";
import FactorTreePanel from "./FactorTreePanel";
import GcdLcmPanel from "./GcdLcmPanel";
import PrimePatternsPanel from "./PrimePatternsPanel";
import SievePanel from "./SievePanel";
import "./PrimesLab.css";

export default function PrimesLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const teacher = usePrimesSession();
  const [sieveN, setSieveN] = useState(30);
  const [sieveStep, setSieveStep] = useState(0);
  const [treeN, setTreeN] = useState(84);
  const [gcdValues, setGcdValues] = useState([84, 60]);
  const [divN, setDivN] = useState(123456);
  const [patternN, setPatternN] = useState(100);

  const go = (next: PrimesMode) => setMode(next);

  const onKey = (event: KeyboardEvent) => {
    const index = PRIMES_MODES.indexOf(mode as PrimesMode);
    if (index < 0) return;
    if (event.key === "ArrowRight" && event.altKey) {
      event.preventDefault();
      go(PRIMES_MODES[(index + 1) % PRIMES_MODES.length]!);
    }
    if (event.key === "ArrowLeft" && event.altKey) {
      event.preventDefault();
      go(PRIMES_MODES[(index - 1 + PRIMES_MODES.length) % PRIMES_MODES.length]!);
    }
  };

  const misconception = MISCONCEPTIONS[mode as PrimesMode];
  const learning = LEARNING[mode as PrimesMode] ?? page.learning;
  const pageForStrip = useMemo(() => ({ ...page, learning }), [page, learning]);

  return (
    <div className={`primes-lab${teacher.presentation ? " is-present" : ""}`} onKeyDown={onKey}>
      <nav className="msk-tabs" aria-label={`${page.title} modes`}>
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>
            {item}
          </button>
        ))}
      </nav>
      <div className="msk-dash-banner" data-lab-mode={mode}>
        <b>{page.title} · {mode}</b>
        <small>{page.subtitle}</small>
      </div>
      {teacher.teacherMode ? (
        <section className="msk-panel primes-teacher">
          <h2>Teacher mode</h2>
          <label><input type="checkbox" checked={teacher.showAlgorithm} onChange={(e) => writePrimesSession({ showAlgorithm: e.target.checked })} /> Show algorithm</label>
          <label><input type="checkbox" checked={teacher.showAnswers} onChange={(e) => writePrimesSession({ showAnswers: e.target.checked })} /> Reveal answer</label>
          <label><input type="checkbox" checked={teacher.showNotation} onChange={(e) => writePrimesSession({ showNotation: e.target.checked })} /> Show mathematical notation</label>
          <label><input type="checkbox" checked={teacher.showMisconceptions} onChange={(e) => writePrimesSession({ showMisconceptions: e.target.checked })} /> Show misconception prompts</label>
          <label><input type="checkbox" checked={teacher.pauseEachStep} onChange={(e) => writePrimesSession({ pauseEachStep: e.target.checked })} /> Pause at each step</label>
          <label><input type="checkbox" checked={teacher.presentation} onChange={(e) => writePrimesSession({ presentation: e.target.checked })} /> Presentation mode</label>
          <div className="msk-btn-row">
            <button type="button" className="msk-soft" onClick={() => writePrimesSession({ showAnswers: true })}>Reveal answer</button>
            <button type="button" className="msk-soft" onClick={() => writePrimesSession({ showAnswers: false })}>Hide answer</button>
            <button type="button" className="msk-soft" onClick={() => {
              setSieveN(30); setSieveStep(0); setTreeN(84); setGcdValues([84, 60]); setDivN(123456); setPatternN(100);
            }}>Reset class example</button>
            <button type="button" className="msk-soft" onClick={() => {
              setSieveN(100); setTreeN(180); setGcdValues([48, 180]); setDivN(918082); setPatternN(500);
            }}>Generate new example</button>
          </div>
          {teacher.showMisconceptions && misconception ? (
            <div className="primes-inspect">
              <p>Student claim: “{misconception.claim}”</p>
              <p>Ask the class: {misconception.ask}</p>
              {teacher.showAnswers ? <p>Reveal: {misconception.reveal}</p> : null}
            </div>
          ) : null}
        </section>
      ) : null}
      <div className={`msk-lab${teacher.presentation ? " is-present" : ""}`}>
        {mode === "Sieve of Eratosthenes" ? (
          <SievePanel
            n={sieveN}
            setN={setSieveN}
            step={sieveStep}
            setStep={setSieveStep}
            teacherReveal={teacher.teacherMode && teacher.showAnswers}
            showAlgorithm={teacher.teacherMode && teacher.showAlgorithm}
            pauseEachStep={teacher.pauseEachStep}
            onExploreFactor={(value) => { setTreeN(value); go("Factor Tree"); }}
          />
        ) : null}
        {mode === "Factor Tree" ? (
          <FactorTreePanel
            n={treeN}
            setN={setTreeN}
            teacherReveal={teacher.teacherMode && teacher.showAnswers}
            onCompareGcd={(a, b) => { setGcdValues([a, b]); go("GCD & LCM"); }}
          />
        ) : null}
        {mode === "GCD & LCM" ? (
          <GcdLcmPanel values={gcdValues} setValues={setGcdValues} teacherReveal={teacher.teacherMode && teacher.showAnswers} />
        ) : null}
        {mode === "Divisibility Rules" ? (
          <DivisibilityPanel
            n={divN}
            setN={setDivN}
            teacherReveal={teacher.teacherMode && teacher.showAnswers}
            onTestPrime={(value) => { setSieveN(Math.min(300, Math.max(10, value))); setPatternN(Math.max(100, value)); go("Sieve of Eratosthenes"); }}
          />
        ) : null}
        {mode === "Prime Patterns" ? (
          <PrimePatternsPanel
            n={patternN}
            setN={setPatternN}
            teacherReveal={teacher.teacherMode && teacher.showAnswers}
            onInspect={(value) => { setDivN(value); go("Divisibility Rules"); }}
          />
        ) : null}
      </div>
      <MockupLearningStrip page={pageForStrip} mode={mode} />
    </div>
  );
}
