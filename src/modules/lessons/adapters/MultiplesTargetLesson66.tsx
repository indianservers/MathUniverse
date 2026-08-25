import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  Info,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./MultiplesTargetLesson66.css";

const INITIAL_BASE = 9;
const INITIAL_CANDIDATE = 36;
const DISPLAY_JUMPS = 5;

function clampInteger(value: number, minimum: number, maximum: number) {
  if (!Number.isFinite(value)) return minimum;
  return Math.max(minimum, Math.min(maximum, Math.round(value)));
}

export default function MultiplesTargetLesson66({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [base, setBase] = useState(INITIAL_BASE);
  const [candidate, setCandidate] = useState(INITIAL_CANDIDATE);
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [workspace, setWorkspace] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [dragMultiple, setDragMultiple] = useState("");
  const [actions, setActions] = useState(0);

  const quotient = Math.floor(candidate / base);
  const remainder = candidate % base;
  const isMultiple = remainder === 0;
  const products = useMemo(
    () =>
      Array.from({ length: DISPLAY_JUMPS }, (_, index) => base * (index + 1)),
    [base],
  );
  const nonExample =
    products[Math.min(DISPLAY_JUMPS - 1, Math.max(0, quotient))] - 7;

  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeBase = (value: number) => {
    setBase(clampInteger(value, 2, 15));
    act();
  };
  const changeCandidate = (value: number) => {
    setCandidate(clampInteger(value, 0, 90));
    act();
  };
  const chooseProduct = (value: number) => {
    setCandidate(value);
    act();
  };
  const dropProduct = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("text/multiple") || dragMultiple;
    const value = Number(raw);
    if (!Number.isInteger(value)) return;
    setCandidate(value);
    setDragMultiple("");
    act();
  };
  const reset = () => {
    setBase(INITIAL_BASE);
    setCandidate(INITIAL_CANDIDATE);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setDragMultiple("");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setBase(INITIAL_BASE);
    setCandidate(INITIAL_CANDIDATE);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setDragMultiple("");
    setActions(0);
  }, [resetToken]);
  const share = async () => {
    const summary = `${candidate} ${isMultiple ? "is" : "is not"} a multiple of ${base}: ${candidate} = ${base} x ${quotient}, remainder ${remainder}.`;
    try {
      await navigator.clipboard?.writeText(summary);
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };

  return (
    <div
      className="multiples66-page"
      data-testid="number-mockup-0048"
      data-dedicated-lesson="66"
      data-object-model="editable-base-candidate-exact-skip-count-number-line-draggable-product-repeated-addition-quotient-remainder-non-example-model"
      data-base={base}
      data-candidate={candidate}
      data-quotient={quotient}
      data-remainder={remainder}
      data-is-multiple={isMultiple}
      data-products={products.join(",")}
      data-drag-multiple={dragMultiple}
      data-tab={tab}
      data-language={language}
      data-workspace={workspace}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Multiple skip-count list. Multiples are made by
        multiplying. Equal jumps show repeated products and exact skip-count
        results.
      </span>
      <nav className="multiples66-breadcrumb">
        <a href="/" aria-label="Back">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>66 Multiples</b>
      </nav>

      <header className="multiples66-hero">
        <nav>
          <b>NUMBERS AND ARITHMETIC</b>
          <b>NUMBERS AND NUMBER THEORY</b>
        </nav>
        <h1>Multiples</h1>
        <p>Explore repeated products.</p>
        <div className="multiples66-badges">
          <b>♙ Foundational-Intermediate</b>
          <b>ϟ Concept + Manipulative</b>
          <b>▣ Exact skip-counting only</b>
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

      <nav className="multiples66-tabs" aria-label="Multiples lesson sections">
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

      <main className="multiples66-main">
        <section className="multiples66-work">
          <header>
            <small>EXACT SKIP-COUNTING ONLY</small>
            <h2>Multiples on the number line</h2>
          </header>
          <section
            className="multiples66-line"
            aria-label="Multiple number line drop zone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={dropProduct}
          >
            <svg
              viewBox="0 0 760 138"
              role="img"
              aria-label={`Five equal jumps of ${base}`}
            >
              <line x1="30" y1="92" x2="730" y2="92" />
              {products.map((value, index) => {
                const start = 30 + index * 140;
                const selected = value === candidate;
                return (
                  <g key={value}>
                    <path
                      d={`M ${start + 8} 86 Q ${start + 70} 8 ${start + 132} 86`}
                    />
                    <text x={start + 70} y="27">
                      +{base}
                    </text>
                    <circle
                      className={selected ? "selected" : ""}
                      cx={start + 140}
                      cy="92"
                      r={selected ? 9 : 6}
                    />
                    <text className="tick" x={start + 140} y="124">
                      {value}
                    </text>
                  </g>
                );
              })}
              <circle cx="30" cy="92" r="6" />
              <text className="tick" x="30" y="124">
                0
              </text>
            </svg>
            <input
              aria-label="Candidate multiple drag control"
              type="range"
              min="0"
              max={base * DISPLAY_JUMPS}
              step={base}
              value={Math.min(
                base * DISPLAY_JUMPS,
                Math.max(0, Math.round(candidate / base) * base),
              )}
              onChange={(event) => changeCandidate(Number(event.target.value))}
            />
          </section>
          <p className="multiples66-jumps">
            <span />
            <b>
              {Math.min(quotient, DISPLAY_JUMPS)} jumps of {base}
            </b>
            <span />
          </p>

          <section className="multiples66-products">
            <h3>PRODUCTS (MULTIPLES OF {base})</h3>
            <nav>
              {products.map((value, index) => (
                <button
                  type="button"
                  draggable
                  className={value === candidate ? "selected" : ""}
                  onClick={() => chooseProduct(value)}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/multiple", String(value));
                    setDragMultiple(String(value));
                  }}
                  onDragEnd={() => setDragMultiple("")}
                  key={value}
                >
                  <strong>
                    {base} × {index + 1}
                  </strong>
                  <span>= {value}</span>
                </button>
              ))}
            </nav>
          </section>

          <section className="multiples66-addition">
            <h3>REPEATED ADDITION</h3>
            <div>
              {Array.from(
                { length: Math.max(1, Math.min(quotient, DISPLAY_JUMPS)) },
                (_, index) => (
                  <span key={index}>
                    <b>{base}</b>
                    {index < Math.min(quotient, DISPLAY_JUMPS) - 1 ? (
                      <i>+</i>
                    ) : null}
                  </span>
                ),
              )}
              <strong>=</strong>
              <em>{base * Math.max(1, Math.min(quotient, DISPLAY_JUMPS))}</em>
            </div>
          </section>

          <p
            className={
              isMultiple ? "multiples66-success" : "multiples66-warning"
            }
          >
            {isMultiple ? <Check /> : <AlertTriangle />}
            <b>
              {candidate} {isMultiple ? "is" : "is not"} a multiple of {base}
            </b>
          </p>
          <section className="multiples66-nonexample">
            <h3>NON-EXAMPLE</h3>
            <p>
              <AlertTriangle />
              <b>
                {nonExample} is between {Math.max(0, quotient * base)} and{" "}
                {(quotient + 1) * base}, so it is not reached by equal jumps of{" "}
                {base}.
              </b>
            </p>
          </section>
        </section>

        <aside className="multiples66-side">
          <p className="multiples66-info">
            <Info />
            <b>Multiples are made by multiplying.</b>
          </p>
          <section className="multiples66-inputs">
            <label htmlFor="multiples66-base">Base:</label>
            <input
              id="multiples66-base"
              aria-label="Base number"
              type="number"
              min="2"
              max="15"
              value={base}
              onChange={(event) => changeBase(Number(event.target.value))}
            />
          </section>
          <section className="multiples66-inputs">
            <label htmlFor="multiples66-candidate">Candidate:</label>
            <input
              id="multiples66-candidate"
              aria-label="Candidate number"
              type="number"
              min="0"
              max="90"
              value={candidate}
              onChange={(event) => changeCandidate(Number(event.target.value))}
            />
          </section>
          <section
            className={`multiples66-result ${isMultiple ? "exact" : "not-exact"}`}
          >
            <h3>Exact skip-count result</h3>
            <strong>
              {candidate} = {base} × {quotient}
            </strong>
            <hr />
            <div>
              <p>
                Quotient:<b>{quotient}</b>
              </p>
              <p>
                Remainder:<b>{remainder}</b>
              </p>
            </div>
          </section>
          <button
            type="button"
            className="multiples66-practice"
            onClick={() => changeCandidate(38)}
          >
            <Lightbulb />
            <span>
              Try: Is 38 a multiple of {base}?
              <b>{38 % base === 0 ? "Yes." : "No."}</b>
            </span>
          </button>
        </aside>

        <nav className="multiples66-navigation">
          <a href="/lessons/numbers-and-arithmetic/65-factors">
            <ArrowLeft />
            <span>
              PREVIOUS<b>Factors</b>
            </span>
          </a>
          <a href="/lessons/numbers-and-arithmetic/67-prime-numbers">
            <span>
              NEXT<b>Prime Numbers</b>
            </span>
            <ArrowRight />
          </a>
        </nav>
      </main>

      <footer className="multiples66-footer">
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
