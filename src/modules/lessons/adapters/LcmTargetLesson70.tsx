import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Languages,
  Lightbulb,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./LcmTargetLesson70.css";

function clampInteger(value: number) {
  if (!Number.isFinite(value)) return 2;
  return Math.max(2, Math.min(20, Math.round(value)));
}

function gcd(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function lcm(left: number, right: number) {
  return Math.abs(left * right) / gcd(left, right);
}

function primeFactorsOf(value: number) {
  const factors: number[] = [];
  let remaining = value;
  for (let divisor = 2; divisor <= remaining; divisor += 1) {
    while (remaining % divisor === 0) {
      factors.push(divisor);
      remaining /= divisor;
    }
  }
  return factors;
}

function powerEntries(factors: number[]) {
  const counts = new Map<number, number>();
  factors.forEach((factor) =>
    counts.set(factor, (counts.get(factor) ?? 0) + 1),
  );
  return Array.from(counts.entries());
}

function powerText(factors: number[]) {
  return powerEntries(factors)
    .map(([factor, count]) =>
      count > 1 ? `${factor}^${count}` : String(factor),
    )
    .join(" × ");
}

function PowerExpression({ factors }: { factors: number[] }) {
  return powerEntries(factors).map(([factor, count], index) => (
    <span key={factor}>
      {index ? " × " : ""}
      {factor}
      {count > 1 ? <sup>{count}</sup> : null}
    </span>
  ));
}

export default function LcmTargetLesson70({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [first, setFirst] = useState(6);
  const [second, setSecond] = useState(8);
  const [candidate, setCandidate] = useState(24);
  const [dragMultiple, setDragMultiple] = useState("");
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [workspace, setWorkspace] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [actions, setActions] = useState(0);
  const least = lcm(first, second);
  const lineMaximum = least * 2;
  const firstMultiples = useMemo(
    () => Array.from({ length: 5 }, (_, index) => first * (index + 1)),
    [first],
  );
  const secondMultiples = useMemo(
    () => Array.from({ length: 5 }, (_, index) => second * (index + 1)),
    [second],
  );
  const firstLine = useMemo(
    () =>
      Array.from(
        { length: lineMaximum / first },
        (_, index) => first * (index + 1),
      ),
    [first, lineMaximum],
  );
  const secondLine = useMemo(
    () =>
      Array.from(
        { length: lineMaximum / second },
        (_, index) => second * (index + 1),
      ),
    [second, lineMaximum],
  );
  const firstPrimes = useMemo(() => primeFactorsOf(first), [first]);
  const secondPrimes = useMemo(() => primeFactorsOf(second), [second]);
  const lcmPrimes = useMemo(() => primeFactorsOf(least), [least]);
  const candidateShared = candidate % first === 0 && candidate % second === 0;
  const candidateCorrect = candidate === least;

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeNumber = (which: "first" | "second", value: number) => {
    const next = clampInteger(value);
    const nextFirst = which === "first" ? next : first;
    const nextSecond = which === "second" ? next : second;
    if (which === "first") setFirst(next);
    else setSecond(next);
    setCandidate(lcm(nextFirst, nextSecond));
    act();
  };
  const dropCandidate = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("text/multiple") || dragMultiple;
    const value = Number(raw);
    if (!Number.isInteger(value)) return;
    setCandidate(value);
    setDragMultiple("");
    act();
  };
  const reset = () => {
    setFirst(6);
    setSecond(8);
    setCandidate(24);
    setDragMultiple("");
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setFirst(6);
    setSecond(8);
    setCandidate(24);
    setDragMultiple("");
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setActions(0);
  }, [resetToken]);
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `LCM(${first}, ${second}) = ${least}`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };

  return (
    <div
      className="lcm70-page"
      data-testid="number-mockup-0052"
      data-dedicated-lesson="70"
      data-object-model="editable-number-pair-synchronized-multiple-jump-lines-generated-lists-draggable-shared-landing-prime-power-ladder-least-common-multiple-practice-model"
      data-first={first}
      data-second={second}
      data-lcm={least}
      data-line-maximum={lineMaximum}
      data-first-multiples={firstMultiples.join(",")}
      data-second-multiples={secondMultiples.join(",")}
      data-first-primes={firstPrimes.join(",")}
      data-second-primes={secondPrimes.join(",")}
      data-lcm-primes={lcmPrimes.join(",")}
      data-lcm-power-form={powerText(lcmPrimes)}
      data-candidate={candidate}
      data-candidate-shared={candidateShared}
      data-candidate-correct={candidateCorrect}
      data-drag-multiple={dragMultiple}
      data-tab={tab}
      data-language={language}
      data-workspace={workspace}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Shared-multiple ladder. LCM is the first shared positive
        multiple. Use the highest prime powers needed by either number.
      </span>
      <nav className="lcm70-breadcrumb">
        <a href="/" aria-label="Back">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>70 Lcm</b>
      </nav>
      <header className="lcm70-hero">
        <h1>LCM</h1>
        <p>Find earliest common multiples.</p>
        <div className="lcm70-badges">
          <b>♙ Foundational-Intermediate</b>
          <b>ϟ Concept + Manipulative</b>
          <b>▣ Numbers and Number Theory</b>
          <b>◷ 6-10 min</b>
        </div>
        <aside>
          <button
            type="button"
            onClick={() => {
              setLanguage((value) =>
                value.startsWith("English")
                  ? "Hindi (हिन्दी)"
                  : "English (English)",
              );
              act();
            }}
          >
            <Languages />
            <span>{language}</span>
            <i>⌄</i>
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw /> Reset
          </button>
          <button type="button" onClick={() => void share()}>
            <Share2 /> {shareState}
          </button>
          <button
            type="button"
            className={workspace ? "active" : ""}
            onClick={() => {
              setWorkspace((value) => !value);
              act();
            }}
          >
            ↗ Workspace
          </button>
        </aside>
      </header>
      <nav className="lcm70-tabs" aria-label="LCM lesson sections">
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
            onClick={() => {
              setTab(label);
              act();
            }}
            key={label}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <main className="lcm70-main">
        <section className="lcm70-work">
          <header>
            <small>SYNCHRONIZED NUMBER LINES</small>
            <h2>Watch the multiples land together.</h2>
          </header>
          <section className="lcm70-lines">
            <MultipleLine
              number={first}
              multiples={firstLine}
              maximum={lineMaximum}
              lcmValue={least}
              tone="cyan"
            />
            <MultipleLine
              number={second}
              multiples={secondLine}
              maximum={lineMaximum}
              lcmValue={least}
              tone="purple"
            />
            <i
              className="lcm70-sync"
              style={{ left: `${5 + (least / lineMaximum) * 90}%` }}
            />
            <nav>
              <span>
                <i className="cyan" />
                Multiples of {first}
              </span>
              <span>
                <i className="purple" />
                Multiples of {second}
              </span>
              <span>
                <i className="gold" />
                First shared landing
              </span>
            </nav>
          </section>
          <section className="lcm70-lists">
            <header>
              <small>MULTIPLE LISTS</small>
              <h3>Listing the first few multiples.</h3>
            </header>
            <MultipleList
              number={first}
              multiples={firstMultiples}
              candidate={candidate}
              tone="cyan"
              onDropStart={setDragMultiple}
              onChoose={(value) => {
                setCandidate(value);
                act();
              }}
            />
            <MultipleList
              number={second}
              multiples={secondMultiples}
              candidate={candidate}
              tone="purple"
              onDropStart={setDragMultiple}
              onChoose={(value) => {
                setCandidate(value);
                act();
              }}
            />
          </section>
        </section>

        <aside className="lcm70-side">
          <section className="lcm70-controls">
            <small>NUMBER CONTROLS</small>
            <NumberControl
              label="First number"
              value={first}
              tone="cyan"
              onChange={(value) => changeNumber("first", value)}
            />
            <NumberControl
              label="Second number"
              value={second}
              tone="purple"
              onChange={(value) => changeNumber("second", value)}
            />
          </section>
          <section
            className={`lcm70-landing ${candidateCorrect ? "correct" : "warning"}`}
            aria-label="First shared landing drop zone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={dropCandidate}
          >
            <small>FIRST SHARED LANDING</small>
            <p>The earliest common landing point.</p>
            <b>{candidate}</b>
            {!candidateCorrect ? (
              <em>
                {candidateShared
                  ? "Shared, but not the first."
                  : "Not shared by both numbers."}
              </em>
            ) : null}
          </section>
          <section className="lcm70-result">
            <b>LCM = {least}</b>
            <p>The LCM is the first shared positive multiple.</p>
          </section>
          <section className="lcm70-ladder">
            <small>PRIME-POWER LADDER</small>
            <p>Build using prime powers.</p>
            <div>
              <b>
                {first} = <PowerExpression factors={firstPrimes} />
              </b>
              <b>
                {second} = <PowerExpression factors={secondPrimes} />
              </b>
            </div>
            <hr />
            <strong>
              LCM = <PowerExpression factors={lcmPrimes} /> = {least}
            </strong>
          </section>
          <section className="lcm70-misconception">
            <Lightbulb />
            <p>
              <small>MISCONCEPTION CHECK</small>
              <span>
                Remember: The LCM is the first shared positive multiple, not
                just any shared multiple.
              </span>
            </p>
          </section>
          <button
            type="button"
            className="lcm70-try"
            onClick={() => {
              setFirst(4);
              setSecond(10);
              setCandidate(20);
              act();
            }}
          >
            <Target />
            <span>
              <small>TRY IT NEXT</small>Try: Find the LCM of 4 and 10.
            </span>
          </button>
        </aside>
        <nav className="lcm70-navigation">
          <a href="/lessons/numbers-and-arithmetic/69-hcf-gcd">
            <ArrowLeft />
            <span>
              PREVIOUS<b>HCF / GCD</b>
            </span>
          </a>
          <a href="/lessons/numbers-and-arithmetic/71-divisibility-rules">
            <span>
              NEXT<b>Divisibility Rules</b>
            </span>
            <ArrowRight />
          </a>
        </nav>
      </main>
      <footer className="lcm70-footer">
        <h3>
          <Sparkles /> Math Universe
        </h3>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <a href="/sitemap">
            <BookOpen /> Sitemap
          </a>
          <a href="/docs">
            <Calculator /> Docs
          </a>
          <a href="/about">✉ About</a>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <small>www.IndianServers.com info@IndianServers.com</small>
      </footer>
    </div>
  );
}

function NumberControl({
  label,
  value,
  tone,
  onChange,
}: {
  label: string;
  value: number;
  tone: "cyan" | "purple";
  onChange: (value: number) => void;
}) {
  const id = `lcm70-${label.toLowerCase().replace(" ", "-")}`;
  return (
    <section className={`lcm70-number-control ${tone}`}>
      <label htmlFor={id}>
        {label}: <b>{value}</b>
      </label>
      <div>
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(value - 1)}
        >
          <Minus />
        </button>
        <input
          id={id}
          aria-label={label}
          type="number"
          min="2"
          max="20"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
        >
          <Plus />
        </button>
      </div>
    </section>
  );
}

function MultipleLine({
  number,
  multiples,
  maximum,
  lcmValue,
  tone,
}: {
  number: number;
  multiples: number[];
  maximum: number;
  lcmValue: number;
  tone: "cyan" | "purple";
}) {
  const x = (value: number) => 30 + (value / maximum) * 500;
  return (
    <section className={`lcm70-line ${tone}`}>
      <h3>Multiples of {number}</h3>
      <b>Jump by {number}</b>
      <svg
        viewBox="0 0 560 150"
        role="img"
        aria-label={`Multiples of ${number} number line`}
      >
        <line x1="25" y1="100" x2="535" y2="100" />
        {multiples.map((value, index) => {
          const start = index === 0 ? 30 : x(multiples[index - 1]);
          const end = x(value);
          return (
            <g key={value}>
              <path d={`M ${start} 91 Q ${(start + end) / 2} 22 ${end} 91`} />
              <circle
                className={value === lcmValue ? "shared" : ""}
                cx={end}
                cy="100"
                r={value === lcmValue ? 10 : 7}
              />
              <text x={end} y="137">
                {value}
              </text>
            </g>
          );
        })}
        <text x="30" y="137">
          0
        </text>
      </svg>
    </section>
  );
}

function MultipleList({
  number,
  multiples,
  candidate,
  tone,
  onDropStart,
  onChoose,
}: {
  number: number;
  multiples: number[];
  candidate: number;
  tone: "cyan" | "purple";
  onDropStart: (value: string) => void;
  onChoose: (value: number) => void;
}) {
  return (
    <section className={`lcm70-list ${tone}`}>
      <b>{number}</b>
      <h3>Multiples of {number}</h3>
      <div>
        {multiples.map((value) => (
          <button
            type="button"
            draggable
            className={candidate === value ? "selected" : ""}
            onClick={() => onChoose(value)}
            onDragStart={(event) => {
              event.dataTransfer.setData("text/multiple", String(value));
              onDropStart(String(value));
            }}
            onDragEnd={() => onDropStart("")}
            key={value}
          >
            {value}
          </button>
        ))}
      </div>
    </section>
  );
}
