import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  CircleHelp,
  Expand,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type DragEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./ModularArithmeticTargetLesson72.css";

const DEFAULT_DIVIDEND = 23;
const DEFAULT_MODULUS = 7;

function clampDividend(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(99, Math.round(value)));
}

function clampModulus(value: number) {
  if (!Number.isFinite(value)) return 2;
  return Math.max(2, Math.min(12, Math.round(value)));
}

function decomposition(dividend: number, modulus: number) {
  const quotient = Math.floor(dividend / modulus);
  const remainder = dividend % modulus;
  return { quotient, remainder };
}

export default function ModularArithmeticTargetLesson72({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [dividend, setDividend] = useState(DEFAULT_DIVIDEND);
  const [modulus, setModulus] = useState(DEFAULT_MODULUS);
  const [dragRemainder, setDragRemainder] = useState<number | null>(null);
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [workspace, setWorkspace] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [practiceLoaded, setPracticeLoaded] = useState(false);
  const [actions, setActions] = useState(0);
  const { quotient, remainder } = useMemo(
    () => decomposition(dividend, modulus),
    [dividend, modulus],
  );

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };

  const changeDividend = (value: number) => {
    setDividend(clampDividend(value));
    setPracticeLoaded(false);
    act();
  };

  const changeModulus = (value: number) => {
    setModulus(clampModulus(value));
    setPracticeLoaded(false);
    act();
  };

  const chooseRemainder = (nextRemainder: number) => {
    const safeRemainder = Math.max(0, Math.min(modulus - 1, nextRemainder));
    setDividend(quotient * modulus + safeRemainder);
    setDragRemainder(null);
    setPracticeLoaded(false);
    act();
  };

  const reset = () => {
    setDividend(DEFAULT_DIVIDEND);
    setModulus(DEFAULT_MODULUS);
    setDragRemainder(null);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setExpanded(false);
    setShareState("Share");
    setPracticeLoaded(false);
    setActions(0);
    onInteraction();
  };

  useEffect(() => {
    setDividend(DEFAULT_DIVIDEND);
    setModulus(DEFAULT_MODULUS);
    setDragRemainder(null);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setExpanded(false);
    setShareState("Share");
    setPracticeLoaded(false);
    setActions(0);
  }, [resetToken]);

  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `${dividend} mod ${modulus} = ${remainder}`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };

  const loadPractice = () => {
    setDividend(31);
    setModulus(5);
    setPracticeLoaded(true);
    act();
  };

  return (
    <div
      className={`modular72-page${expanded ? " is-expanded" : ""}`}
      data-testid="number-mockup-0054"
      data-dedicated-lesson="72"
      data-object-model="editable-dividend-modulus-remainder-clock-draggable-cycle-position-quotient-remainder-decomposition-grouped-cycles-misconception-practice-model"
      data-dividend={dividend}
      data-modulus={modulus}
      data-quotient={quotient}
      data-remainder={remainder}
      data-equation={`${dividend}=${quotient}x${modulus}+${remainder}`}
      data-drag-remainder={dragRemainder ?? ""}
      data-tab={tab}
      data-language={language}
      data-workspace={workspace}
      data-expanded={expanded}
      data-practice-loaded={practiceLoaded}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Remainder clock. Divide into complete cycles. Keep the
        remainder, not the quotient.
      </span>

      <nav className="modular72-breadcrumb">
        <a href="/" aria-label="Back"><ArrowLeft /></a>
        <a href="/">Home</a><span>›</span>
        <a href="/lessons">Lessons</a><span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a><span>›</span>
        <b>72 Modular Arithmetic</b>
      </nav>

      <header className="modular72-hero">
        <h1>Modular Arithmetic</h1>
        <p>Explore remainders and cycles.</p>
        <div className="modular72-badges">
          <b>♙ Numbers and Arithmetic</b>
          <b>ϟ Numbers and Number Theory</b>
          <b>◷ 6-10 min</b>
        </div>
        <aside>
          <button
            type="button"
            onClick={() => {
              setLanguage((value) => value.startsWith("English") ? "Hindi (हिन्दी)" : "English (English)");
              act();
            }}
          >
            <Languages /><span>{language}</span><i>⌄</i>
          </button>
          <button type="button" onClick={reset}><RotateCcw /> Reset</button>
          <button type="button" onClick={() => void share()}><Share2 /> {shareState}</button>
          <button
            type="button"
            className={workspace ? "active" : ""}
            onClick={() => { setWorkspace((value) => !value); act(); }}
          >↗ Workspace</button>
        </aside>
        <span className="modular72-status"><i /> Interactive</span>
        <button
          type="button"
          className="modular72-expand"
          aria-label="Expand lesson surface"
          onClick={() => { setExpanded((value) => !value); act(); }}
        ><Expand /></button>
      </header>

      <nav className="modular72-tabs" aria-label="Modular arithmetic lesson sections">
        {[
          ["Interaction + visualization", "⊙"],
          ["Explain", "▣"],
          ["Examples", "♧"],
          ["Formulas", "Σ"],
          ["Know more", "✧"],
        ].map(([label, icon]) => (
          <button
            type="button"
            className={tab === label ? "active" : ""}
            onClick={() => { setTab(label); act(); }}
            key={label}
          ><span>{icon}</span>{label}</button>
        ))}
      </nav>

      <main className="modular72-main">
        <section className="modular72-work">
          <header>
            <small>REMAINDER CLOCK (mod {modulus})</small>
            <h2>{dividend} mod {modulus} = <b>{remainder}</b></h2>
          </header>

          <RemainderClock
            dividend={dividend}
            modulus={modulus}
            remainder={remainder}
            dragRemainder={dragRemainder}
            onDragStart={setDragRemainder}
            onChoose={chooseRemainder}
          />

          <section className="modular72-equations" aria-label="Division decomposition">
            <p><b>{dividend}</b><span>=</span><CycleSum quotient={quotient} modulus={modulus} remainder={remainder} /></p>
            <p><b>{dividend}</b><span>=</span><strong>{quotient}</strong><i>×</i><strong>{modulus}</strong><i>+</i><em>{remainder}</em></p>
          </section>

          <CycleGrouping dividend={dividend} modulus={modulus} quotient={quotient} remainder={remainder} />
        </section>

        <aside className="modular72-side">
          <section className="modular72-inputs">
            <small>INPUTS</small>
            <label>Dividend
              <input aria-label="Dividend" type="number" min="0" max="99" value={dividend} onChange={(event) => changeDividend(Number(event.target.value))} />
            </label>
            <label>Modulus
              <input aria-label="Modulus" type="number" min="2" max="12" value={modulus} onChange={(event) => changeModulus(Number(event.target.value))} />
            </label>
          </section>
          <section className="modular72-results">
            <small>RESULTS</small>
            <p>Quotient:<b>{quotient}</b></p>
            <p>Remainder:<b>{remainder}</b></p>
          </section>
          <section className="modular72-tip"><Lightbulb /><b>Keep the remainder,<br />not the quotient.</b></section>
          <section className="modular72-misconception">
            <ShieldCheck />
            <div><small>MISCONCEPTION WATCH</small><p>The answer is the remainder ({remainder}), not the quotient ({quotient}).</p></div>
          </section>
          <button type="button" className="modular72-practice" onClick={loadPractice}>
            <CircleHelp /><b>{practiceLoaded ? `31 mod 5 = ${remainder}` : "Try: What is 31 mod 5?"}</b>
          </button>
        </aside>

        <nav className="modular72-navigation">
          <a href="/lessons/numbers-and-arithmetic/71-divisibility-rules"><ArrowLeft /><span>Previous<b>Divisibility Rules</b></span></a>
          <a href="/lessons/numbers-and-arithmetic/73-base-systems"><span>Next<b>Base Systems</b></span><ArrowRight /></a>
        </nav>
      </main>

      <footer className="modular72-footer">
        <h3><Sparkles /> Math Universe</h3>
        <p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p>
        <nav>
          <a href="/sitemap"><BookOpen /> Sitemap</a>
          <a href="/docs"><Calculator /> Docs</a>
          <a href="/about">✉ About</a>
        </nav>
        <hr />
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small>
        <small>www.IndianServers.com info@IndianServers.com</small>
      </footer>
    </div>
  );
}

function RemainderClock({
  dividend,
  modulus,
  remainder,
  dragRemainder,
  onDragStart,
  onChoose,
}: {
  dividend: number;
  modulus: number;
  remainder: number;
  dragRemainder: number | null;
  onDragStart: (value: number | null) => void;
  onChoose: (value: number) => void;
}) {
  const points = Array.from({ length: modulus }, (_, value) => {
    const angle = -Math.PI / 2 + (value / modulus) * Math.PI * 2;
    return { value, x: 48 + Math.cos(angle) * 36, y: 50 + Math.sin(angle) * 39 };
  });
  return (
    <section className="modular72-clock" aria-label={`Remainder clock modulo ${modulus}`}>
      <svg viewBox="0 0 420 360" role="img" aria-label={`${dividend} steps around a modulo ${modulus} clock`}>
        <defs>
          <linearGradient id="modular72-cycle" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#0aa9c0" /><stop offset=".5" stopColor="#0aa9c0" /><stop offset=".52" stopColor="#7840ce" /><stop offset="1" stopColor="#7840ce" /></linearGradient>
          <marker id="modular72-arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#0a9fb7" /></marker>
        </defs>
        <circle cx="202" cy="177" r="157" fill="none" stroke="url(#modular72-cycle)" strokeWidth="4" />
        <path d="M202 20 A157 157 0 0 1 356 148" fill="none" stroke="#0aa9c0" strokeWidth="3" markerEnd="url(#modular72-arrow)" />
        <path d="M344 243 A157 157 0 0 1 157 328" fill="none" stroke="#7540ce" strokeWidth="3" markerEnd="url(#modular72-arrow)" />
      </svg>
      <div className="modular72-clock-center"><b>{dividend}</b><strong>steps</strong><span>Start at 0 and<br />count forward<br />{dividend} steps.</span></div>
      {points.map((point) => (
        <button
          type="button"
          key={point.value}
          draggable
          aria-label={`Remainder position ${point.value}`}
          className={`${point.value === remainder ? "active" : ""}${dragRemainder === point.value ? " dragging" : ""}`}
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
          onClick={() => onChoose(point.value)}
          onDragStart={(event) => { event.dataTransfer.setData("text/remainder", String(point.value)); onDragStart(point.value); }}
          onDragEnd={() => onDragStart(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event: DragEvent<HTMLButtonElement>) => { event.preventDefault(); onChoose(point.value); }}
        ><i /><span>{point.value}</span></button>
      ))}
    </section>
  );
}

function CycleSum({ quotient, modulus, remainder }: { quotient: number; modulus: number; remainder: number }) {
  if (quotient <= 4) {
    return <>{Array.from({ length: quotient }, (_, index) => <span key={index}><strong>{modulus}</strong><i>+</i></span>)}<em>{remainder}</em></>;
  }
  return <><strong>{quotient}</strong><i>×</i><strong>{modulus}</strong><i>+</i><em>{remainder}</em></>;
}

function CycleGrouping({ dividend, modulus, quotient, remainder }: { dividend: number; modulus: number; quotient: number; remainder: number }) {
  const complete = Math.min(quotient, 3);
  const maximum = Math.max(dividend, modulus);
  const x = (value: number) => 18 + (value / maximum) * 414;
  const shownStops = Array.from({ length: complete + 1 }, (_, index) => index * modulus);
  if (shownStops.at(-1) !== dividend) shownStops.push(dividend);
  return (
    <section className="modular72-grouping">
      <small>GROUPING {dividend} INTO {modulus}S</small>
      <svg viewBox="0 0 470 145" role="img" aria-label={`${quotient} complete cycles and remainder ${remainder}`}>
        <line x1="18" y1="35" x2="448" y2="35" className="axis" />
        <path d="M448 35 l-12 -7 v14 z" className="axis-arrow" />
        {shownStops.map((value, index) => <g key={`${value}-${index}`}><line x1={x(value)} x2={x(value)} y1="27" y2="44" className="tick" /><text x={x(value)} y="18" className="stop">{value}</text></g>)}
        {Array.from({ length: complete }, (_, index) => {
          const start = index * modulus;
          const end = (index + 1) * modulus;
          return <g key={index}><path d={`M${x(start)} 47 v10 q0 9 9 9 h${Math.max(2, x(end) - x(start) - 18)} q9 0 9 -9 v-10`} className="brace" /><text x={(x(start) + x(end)) / 2} y="88" className="cycle-number">{modulus}</text><text x={(x(start) + x(end)) / 2} y="112" className="cycle-label">{index + 1}{index === 0 ? "st" : index === 1 ? "nd" : "rd"} cycle</text></g>;
        })}
        {remainder > 0 ? <g><path d={`M${x(quotient * modulus)} 47 v10 q0 9 9 9 h${Math.max(2, x(dividend) - x(quotient * modulus) - 18)} q9 0 9 -9 v-10`} className="brace remainder" /><text x={(x(quotient * modulus) + x(dividend)) / 2} y="88" className="cycle-number remainder">{remainder}</text><text x={(x(quotient * modulus) + x(dividend)) / 2} y="112" className="cycle-label">Leftover {remainder}<tspan x={(x(quotient * modulus) + x(dividend)) / 2} dy="18">to {dividend}</tspan></text></g> : null}
      </svg>
      <p><CircleHelp /> <b>{quotient === 1 ? "One full cycle" : `${quotient} full cycles`} plus {remainder === 1 ? "one step" : `${remainder} steps`}</b></p>
    </section>
  );
}
