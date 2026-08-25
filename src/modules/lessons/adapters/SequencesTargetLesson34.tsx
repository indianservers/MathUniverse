import { Check, ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./SequencesTargetLesson34.css";
const presets: [[number, number], [number, number], [number, number]] = [
  [2, 3],
  [3, 4],
  [-2, 5],
];
export default function SequencesTargetLesson34({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [first, setFirst] = useState(2),
    [difference, setDifference] = useState(3),
    [selected, setSelected] = useState(5),
    [preset, setPreset] = useState(0),
    [tab, setTab] = useState(0),
    [shareState, setShareState] = useState("Share"),
    [workspace, setWorkspace] = useState(false),
    [actions, setActions] = useState(0);
  const terms = useMemo(
      () => Array.from({ length: 6 }, (_, index) => first + index * difference),
      [first, difference],
    ),
    selectedValue = terms[selected - 1],
    next = terms[5];
  const touch = () => {
      setActions((value) => value + 1);
      onInteraction();
    },
    restart = () => {
      setFirst(2);
      setDifference(3);
      setSelected(5);
      setPreset(0);
      touch();
    },
    reset = () => {
      setFirst(2);
      setDifference(3);
      setSelected(5);
      setPreset(0);
      setTab(0);
      setShareState("Share");
      setWorkspace(false);
      setActions(0);
      onInteraction();
    };
  useEffect(() => {
    setFirst(2);
    setDifference(3);
    setSelected(5);
    setPreset(0);
    setTab(0);
    setShareState("Share");
    setWorkspace(false);
    setActions(0);
  }, [resetToken]);
  const newValues = () => {
      const index = (preset + 1) % presets.length;
      setPreset(index);
      setFirst(presets[index][0]);
      setDifference(presets[index][1]);
      setSelected(5);
      touch();
    },
    share = async () => {
      try {
        await navigator.clipboard?.writeText(terms.join(", "));
        setShareState("Copied");
      } catch {
        setShareState("Ready");
      }
      touch();
    };
  return (
    <div
      className="sequences-page"
      data-testid="algebra-mockup-0034"
      data-dedicated-lesson="34"
      data-object-model="arithmetic-sequence-first-term-common-difference-index-explicit-rule-jump-table-prediction-model"
      data-first={first}
      data-difference={difference}
      data-selected={selected}
      data-selected-value={selectedValue}
      data-terms={terms.join(",")}
      data-next={next}
      data-tab={tab}
      data-workspace={workspace}
      data-preset={preset}
      data-actions={actions}
    >
      <nav className="sequences-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>34 Sequences</b>
      </nav>
      <section className="sequences-header">
        <div className="sequence-tags">
          <b>CORE WORKSPACES</b>
          <b>ALGEBRA AND DYNAMIC VARIABLES</b>
        </div>
        <h1>Sequences</h1>
        <p>Generate ordered mathematical patterns.</p>
        <nav>
          <b>♙ Foundational-Advanced</b>
          <b>ϟ Exploration Lab</b>
          <b>▣ Algebra View / Input Bar</b>
          <b>◷ 6-10 min</b>
        </nav>
        <aside>
          <button onClick={touch}>⌁ English (English)⌄</button>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => void share()}>
            <Share2 />
            {shareState}
          </button>
          <button
            onClick={() => {
              setWorkspace((value) => !value);
              touch();
            }}
          >
            <ExternalLink />
            Workspace
          </button>
        </aside>
      </section>
      <nav className="sequence-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((label, index) => (
          <button
            type="button"
            className={tab === index ? "active" : ""}
            onClick={() => {
              setTab(index);
              touch();
            }}
            key={label}
          >
            {["⊙", "▣", "♧", "Σ", "✣"][index]} {label}
          </button>
        ))}
      </nav>
      <main className="sequence-layout">
        <section className="sequence-work">
          <header>
            <h2>Sequence overview</h2>
            <b>{terms.join(", ")}</b>
          </header>
          <div className="term-cards">
            {terms.map((value, index) => (
              <button
                type="button"
                className={selected === index + 1 ? "selected" : ""}
                onClick={() => {
                  setSelected(index + 1);
                  touch();
                }}
                key={index}
              >
                <i>
                  a<sub>{index + 1}</sub>
                </i>
                <b>{value}</b>
              </button>
            ))}
          </div>
          <section className="jump-model">
            <h2>Number-line jump model</h2>
            <JumpModel terms={terms} difference={difference} />
            <p>Common difference d = {difference}</p>
          </section>
          <div className="sequence-bottom">
            <section className="rule-builder">
              <h2>Rule builder</h2>
              <label>
                <b className="field-label">
                  First term (a<sub>1</sub>)
                </b>
                <span>
                  a<sub>1</sub> ={" "}
                  <input
                    aria-label="First term"
                    type="number"
                    value={first}
                    onChange={(event) => {
                      setFirst(Number(event.target.value));
                      touch();
                    }}
                  />
                </span>
              </label>
              <label>
                <b className="field-label">Common difference (d)</b>
                <span>
                  d ={" "}
                  <input
                    aria-label="Common difference"
                    type="number"
                    value={difference}
                    onChange={(event) => {
                      setDifference(Number(event.target.value));
                      touch();
                    }}
                  />
                </span>
              </label>
              <p>nth term rule</p>
              <strong>
                a<sub>n</sub> = {first} + (n − 1){difference}
              </strong>
            </section>
            <section className="term-table">
              <h2>Term number maps to term value.</h2>
              <header>
                <b>n</b>
                <b>
                  a<sub>n</sub>
                </b>
              </header>
              {terms.map((value, index) => (
                <button
                  type="button"
                  className={selected === index + 1 ? "selected" : ""}
                  onClick={() => {
                    setSelected(index + 1);
                    touch();
                  }}
                  key={index}
                >
                  <span>{index + 1}</span>
                  <b>{value}</b>
                </button>
              ))}
            </section>
            <section className="sequence-controls">
              <h2>Controls</h2>
              <label>
                <b className="field-label">
                  First term (a<sub>1</sub>)
                </b>
                <input
                  aria-label="First term stepper"
                  type="number"
                  value={first}
                  onChange={(event) => {
                    setFirst(Number(event.target.value));
                    touch();
                  }}
                />
              </label>
              <label>
                <b className="field-label">Common difference (d)</b>
                <input
                  aria-label="Common difference stepper"
                  type="number"
                  value={difference}
                  onChange={(event) => {
                    setDifference(Number(event.target.value));
                    touch();
                  }}
                />
              </label>
              <h3>Select n</h3>
              <nav>
                {terms.map((_, index) => (
                  <button
                    type="button"
                    className={selected === index + 1 ? "active" : ""}
                    onClick={() => {
                      setSelected(index + 1);
                      touch();
                    }}
                    key={index}
                  >
                    {index + 1}
                  </button>
                ))}
              </nav>
              <strong>
                a<sub>{selected}</sub> = {selectedValue}
              </strong>
            </section>
          </div>
          <section className="next-challenge">
            <div>
              <h2>Next-term challenge</h2>
              <p>
                Predict a<sub>6</sub>.
              </p>
            </div>
            <span>
              a<sub>5</sub> = {terms[4]}
            </span>
            <b>+{difference} →</b>
            <strong>
              a<sub>6</sub> = {next}
            </strong>
          </section>
        </section>
        <aside className="sequence-side">
          <section>
            <h2>Quick controls</h2>
            <button type="button" onClick={restart}>
              <RotateCcw />
              Restart
            </button>
            <button type="button" onClick={newValues}>
              <ExternalLink />
              New values
            </button>
          </section>
          <section className="quick-check">
            <h2>Quick check</h2>
            <p>
              Using a<sub>n</sub> = {first} +<br />
              (n − 1){difference}
            </p>
            <p>For n = {selected}</p>
            <p>
              a<sub>{selected}</sub> = {first} + ({selected} − 1){difference}
            </p>
            <p>
              = {first} + {(selected - 1) * difference}
            </p>
            <p>= {selectedValue}</p>
            <footer>
              <Check />
              Correct!
            </footer>
          </section>
          <section className="predict-card">
            <h2>Predict next term</h2>
            <p>
              a<sub>6</sub> = a<sub>5</sub> + d
            </p>
            <p>
              = {terms[4]} + {difference}
            </p>
            <p>= {next}</p>
            <footer>
              Predict a<sub>6</sub> = {next}
            </footer>
          </section>
        </aside>
      </main>
    </div>
  );
}
function JumpModel({
  terms,
  difference,
}: {
  terms: number[];
  difference: number;
}) {
  return (
    <svg
      viewBox="0 0 760 130"
      role="img"
      aria-label="Arithmetic sequence number line jumps"
    >
      <line x1="20" y1="81" x2="738" y2="81" />
      <path d="M738 81l-10-6v12z" />
      {terms.map((value, index) => {
        const x = 33 + index * 134;
        return (
          <g key={index}>
            <circle cx={x} cy="81" r="6" />
            <text x={x - 6} y="112">
              {value}
            </text>
            {index < terms.length - 1 ? (
              <>
                <path
                  className="jump"
                  d={`M${x + 5} 72 Q${x + 67} 22 ${x + 128} 72`}
                />
                <path className="arrow" d={`M${x + 128} 72l-10-2 5 9z`} />
                <text className="jump-label" x={x + 56} y="29">
                  {difference >= 0 ? "+" : ""}
                  {difference}
                </text>
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
