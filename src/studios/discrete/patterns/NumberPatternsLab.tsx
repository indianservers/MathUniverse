import { useMemo, useState, type KeyboardEvent } from "react";
import { useSearchParams } from "react-router-dom";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { usePrimesSession, writePrimesSession } from "../primes/primesSession";
import FiguratePanel from "./FiguratePanel";
import FractalsPanel from "./FractalsPanel";
import PascalPanel from "./PascalPanel";
import RecursivePanel from "./RecursivePanel";
import {
  LEARNING,
  MISCONCEPTIONS,
  PATTERNS_MODES,
  TAB_META,
  figurateLearning,
  parsePatternsMode,
  type PatternsMode,
} from "./patternsCopy";
import "./NumberPatternsLab.css";

const ICONS: Record<PatternsMode, string> = {
  Figurate: "M12 19 4 7h16Z",
  Recursive: "M5 8h10M9 4v8M19 16H9M15 12v8",
  "Pascal Triangle": "M12 5 6 17h12Z",
  Fractals: "M12 4v8l6 6M12 12 6 18M12 4 6 8m6-4 6 4",
};

export default function NumberPatternsLab({ page }: { page: StudioMockupPage }) {
  const [params, setParams] = useSearchParams();
  const mode = parsePatternsMode(params.get("mode"));
  const teacher = usePrimesSession();
  const [n, setN] = useState(6);
  const [sides, setSides] = useState(3);
  const [pascalRows, setPascalRows] = useState(8);
  const [pascalPattern, setPascalPattern] = useState("None");
  const [fractalDepth, setFractalDepth] = useState(4);

  const setMode = (next: PatternsMode) => {
    setParams((current) => {
      const updated = new URLSearchParams(current);
      if (next === "Figurate") updated.delete("mode");
      else updated.set("mode", next);
      return updated;
    });
  };

  const onKey = (event: KeyboardEvent) => {
    const index = PATTERNS_MODES.indexOf(mode);
    if (event.key === "ArrowRight" && event.altKey) {
      event.preventDefault();
      setMode(PATTERNS_MODES[(index + 1) % PATTERNS_MODES.length]!);
    }
    if (event.key === "ArrowLeft" && event.altKey) {
      event.preventDefault();
      setMode(PATTERNS_MODES[(index - 1 + PATTERNS_MODES.length) % PATTERNS_MODES.length]!);
    }
  };

  const learning = mode === "Figurate" ? figurateLearning(sides === 0 ? 8 : sides) : LEARNING[mode];
  const misconception = MISCONCEPTIONS[mode];
  const hideFormula = teacher.teacherMode && !teacher.showNotation;
  const hideValues = teacher.teacherMode && !teacher.showAlgorithm;

  const strip = useMemo(() => ([
    { icon: "👁", color: "#147df2", title: "Observe", text: learning.observe },
    { icon: "?", color: "#8b45f4", title: "Understand", text: learning.understand },
    { icon: "!", color: "#f59e0b", title: "Why", text: learning.why },
    { icon: "✎", color: "#08b9dd", title: "Try", text: learning.try },
    { icon: "🏆", color: "#10b981", title: "Challenge", text: learning.challenge },
  ]), [learning]);

  return (
    <div className={`np-lab${teacher.presentation ? " is-present" : ""}`} data-lab-mode={mode} data-mode-canvas={mode} onKeyDown={onKey}>
      <p className="np-quote">
        “Patterns are the language in which mathematics writes its beauty.”
        <b>— Godfrey H. Hardy</b>
      </p>
      <nav className="np-tabs" aria-label={`${page.title} modes`}>
        {PATTERNS_MODES.map((item) => (
          <button
            key={item}
            type="button"
            className={`np-tab${item === mode ? " is-on" : ""}`}
            aria-pressed={item === mode}
            onClick={() => setMode(item)}
          >
            <svg className="np-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d={ICONS[item]} />
            </svg>
            <span>
              <b>{TAB_META[item].title}</b>
              <small>{TAB_META[item].subtitle}</small>
            </span>
          </button>
        ))}
      </nav>
      {teacher.teacherMode ? (
        <section className="np-teacher np-card">
          <h2>Teacher mode</h2>
          <label><input type="checkbox" checked={teacher.showNotation} onChange={(e) => writePrimesSession({ showNotation: e.target.checked })} /> Reveal formula</label>
          <label><input type="checkbox" checked={teacher.showAlgorithm} onChange={(e) => writePrimesSession({ showAlgorithm: e.target.checked })} /> Show labels / values</label>
          <label><input type="checkbox" checked={teacher.showAnswers} onChange={(e) => writePrimesSession({ showAnswers: e.target.checked })} /> Reveal explanation / answers</label>
          <label><input type="checkbox" checked={teacher.pauseEachStep} onChange={(e) => writePrimesSession({ pauseEachStep: e.target.checked })} /> Pause after each step</label>
          <label><input type="checkbox" checked={teacher.showMisconceptions} onChange={(e) => writePrimesSession({ showMisconceptions: e.target.checked })} /> Highlight misconception</label>
          <label><input type="checkbox" checked={teacher.presentation} onChange={(e) => writePrimesSession({ presentation: e.target.checked })} /> Presentation mode</label>
          <div className="np-row">
            <button type="button" className="np-ghost" onClick={() => { setN(6); setSides(3); setPascalRows(8); setFractalDepth(4); }}>Reset</button>
            <button type="button" className="np-ghost" onClick={() => { setN(10); setSides(5); setPascalRows(12); setFractalDepth(5); }}>Generate example</button>
            <button type="button" className="np-ghost" onClick={() => writePrimesSession({ showAnswers: true })}>Generate challenge</button>
          </div>
          {teacher.showMisconceptions ? (
            <p className="np-note">Student claim: “{misconception.claim}” {misconception.ask} {teacher.showAnswers ? misconception.reveal : ""}</p>
          ) : null}
        </section>
      ) : null}
      {mode === "Figurate" ? (
        <FiguratePanel
          n={n}
          setN={setN}
          sides={sides}
          setSides={setSides}
          teacherReveal={teacher.teacherMode && teacher.showAnswers}
          hideFormula={hideFormula}
          onOpenPascal={() => { setPascalPattern("Triangular"); setMode("Pascal Triangle"); }}
        />
      ) : null}
      {mode === "Recursive" ? (
        <RecursivePanel
          teacherReveal={teacher.teacherMode && teacher.showAnswers}
          hideFormula={hideFormula}
          onOpenPascalFib={() => { setPascalPattern("Fibonacci"); setMode("Pascal Triangle"); }}
        />
      ) : null}
      {mode === "Pascal Triangle" ? (
        <PascalPanel
          rows={pascalRows}
          setRows={setPascalRows}
          teacherReveal={teacher.teacherMode && teacher.showAnswers}
          hideFormula={hideFormula}
          hideValues={hideValues}
          pattern={pascalPattern}
          setPattern={setPascalPattern}
          onOpenFractal={(rowCount) => { setFractalDepth(Math.min(8, Math.max(3, Math.round(Math.log2(rowCount + 1))))); setMode("Fractals"); }}
        />
      ) : null}
      {mode === "Fractals" ? (
        <FractalsPanel
          depth={fractalDepth}
          setDepth={setFractalDepth}
          teacherReveal={teacher.teacherMode && teacher.showAnswers}
          onOpenPascal={(rowCount) => { setPascalRows(rowCount); setPascalPattern("None"); setMode("Pascal Triangle"); }}
        />
      ) : null}
      <section className="np-strip" aria-label={`Learning loop for ${page.label} · ${mode}`}>
        {strip.map((item) => (
          <div key={item.title}>
            <i style={{ background: item.color }}>{item.icon}</i>
            <span>
              <b>{item.title}</b>
              <small>{item.text}</small>
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
