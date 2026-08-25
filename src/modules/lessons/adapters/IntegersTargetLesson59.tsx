import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Languages,
  RotateCcw,
  Share2,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./IntegersTargetLesson59.css";

export default function IntegersTargetLesson59({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [selected, setSelected] = useState(-4);
  const [compare, setCompare] = useState(8);
  const [tab, setTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [workspace, setWorkspace] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [actions, setActions] = useState(0);
  const opposite = -selected;
  const relation = selected === compare ? "=" : selected < compare ? "<" : ">";
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const choose = (value: number) => {
    setSelected(Math.max(-10, Math.min(10, Math.round(value))));
    act();
  };
  const reset = () => {
    setSelected(-4);
    setCompare(8);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setSelected(-4);
    setCompare(8);
    setTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setActions(0);
  }, [resetToken]);
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `${selected} ${relation} ${compare}; opposite ${opposite}`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };
  return (
    <div
      className="integers-page"
      data-testid="number-mockup-0041"
      data-dedicated-lesson="59"
      data-object-model="signed-integer-number-line-opposite-temperature-ledger-order-comparison-model"
      data-selected={selected}
      data-compare={compare}
      data-opposite={opposite}
      data-relation={relation}
      data-tab={tab}
      data-language={language}
      data-workspace={workspace}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Integer direction from zero. Farther right means greater.
      </span>
      <nav className="integers-breadcrumb">
        <a href="/">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>59 Integers</b>
      </nav>
      <header className="integers-hero">
        <nav>
          <b>NUMBERS AND ARITHMETIC</b>
          <b>NUMBERS AND NUMBER THEORY</b>
        </nav>
        <h1>Integers</h1>
        <p>Understand positive and negative values.</p>
        <div>
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
            {language}
            <span>⌄</span>
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button type="button" onClick={() => void share()}>
            <Share2 />
            {shareState}
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
      <nav className="integers-tabs">
        {[
          ["Interaction + visualization", Eye],
          ["Explain", Languages],
          ["Examples", Languages],
          ["Formulas", Languages],
          ["Know more", Languages],
        ].map(([label, Icon]) => (
          <button
            type="button"
            className={tab === label ? "active" : ""}
            onClick={() => {
              setTab(label as string);
              act();
            }}
            key={label as string}
          >
            <Icon />
            {label as string}
          </button>
        ))}
      </nav>
      <main className="integers-layout">
        <section className="integers-work">
          <h2>Work directly on the number line</h2>
          <section className="integer-line-card">
            <div className="opposite-arrows">
              <span>
                {Math.abs(selected)} steps {selected < 0 ? "left" : "right"} of
                zero
              </span>
              <span>opposite: {formatSigned(opposite)}</span>
            </div>
            <div className="integer-axis">
              <i />
              <nav>
                {Array.from({ length: 21 }, (_, index) => index - 10).map(
                  (value) => (
                    <button
                      type="button"
                      className={
                        value === selected
                          ? "selected"
                          : value === compare
                            ? "compare"
                            : ""
                      }
                      onClick={() => choose(value)}
                      key={value}
                    >
                      {value}
                    </button>
                  ),
                )}
              </nav>
            </div>
            <input
              aria-label="Selected integer drag control"
              type="range"
              min="-10"
              max="10"
              value={selected}
              onChange={(event) => choose(Number(event.target.value))}
            />
            <p>farther right → greater</p>
            <footer>
              <span>
                <i />
                Selected ({selected})
              </span>
              <span>
                <i />
                Compare ({compare})
              </span>
            </footer>
          </section>
          <section className="integer-contexts">
            <article className="temperature-card">
              <h3>Real-life context: Temperature</h3>
              <div className="thermometer">
                <i
                  style={{
                    height: `${Math.max(6, ((selected + 30) / 60) * 188)}px`,
                  }}
                />
                <b>°C</b>
                {[30, 20, 10, 0, -10, -20, -30].map((value) => (
                  <span
                    style={{ top: `${22 + (30 - value) * 2.7}px` }}
                    key={value}
                  >
                    {value}
                  </span>
                ))}
              </div>
              <aside>
                <strong>{formatSigned(selected)}°C</strong>
                <span>{selected < 0 ? "below" : "above"} 0°C</span>
              </aside>
              <p>Negative temperatures are below zero.</p>
            </article>
            <article className="ledger-card">
              <h3>Real-life context: Bank ledger</h3>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Debit</th>
                    <td>Cash withdrawal</td>
                    <td>{formatSigned(selected)}</td>
                  </tr>
                  <tr>
                    <th>Credit</th>
                    <td>Cash deposit</td>
                    <td>{formatSigned(compare)}</td>
                  </tr>
                </tbody>
              </table>
              <p>More credit (+) means a higher balance.</p>
            </article>
          </section>
          <aside className="integer-warning">
            <TriangleAlert />
            <div>
              <h3>Common misconception</h3>
              <p>
                A negative number is not smaller because it has more digits.
                <br />
                It's smaller because it is left of zero.
              </p>
            </div>
          </aside>
        </section>
        <aside className="integers-side">
          <section>
            <h2>Your values</h2>
            <h3>Selected integer: {selected}</h3>
            <ValueCard label="Selected" value={selected} tone="blue" />
            <hr />
            <h3>Compare with: {compare}</h3>
            <div className="compare-control">
              <button
                type="button"
                onClick={() => {
                  setCompare(Math.max(-10, compare - 1));
                  act();
                }}
              >
                −
              </button>
              <input
                aria-label="Compare integer"
                type="number"
                min="-10"
                max="10"
                value={compare}
                onChange={(event) => {
                  setCompare(
                    Math.max(-10, Math.min(10, Number(event.target.value))),
                  );
                  act();
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setCompare(Math.min(10, compare + 1));
                  act();
                }}
              >
                +
              </button>
            </div>
            <ValueCard label="Compare" value={compare} tone="green" />
            <hr />
            <h3>Opposite: {opposite}</h3>
            <ValueCard label="Opposite" value={opposite} tone="purple" />
          </section>
          <section className="order-result">
            <h2>Order result</h2>
            <strong>
              {selected} {relation} {compare}
            </strong>
            <p>
              Negative integers sit
              <br />
              left of zero.
            </p>
            <footer>
              Farther right means
              <br />
              greater.
            </footer>
          </section>
          <section className="integer-try">
            Try: Which is greater,
            <br />
            -2 or 3? <b>?</b>
          </section>
        </aside>
      </main>
      <nav className="integer-navigation">
        <a href="/lessons/numbers-and-arithmetic/58-whole-numbers">
          <ArrowLeft />
          <span>
            PREVIOUS<b>Whole Numbers</b>
          </span>
        </a>
        <a href="/lessons/numbers-and-arithmetic/60-rational-numbers">
          <span>
            NEXT<b>Rational Numbers</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="integer-footer">
        <h3>✧ Math Universe</h3>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <nav>
          <button type="button">▣ Sitemap</button>
          <button type="button">⚑ Docs</button>
          <button type="button">✉ About</button>
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
function formatSigned(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}
function ValueCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "green" | "purple";
}) {
  return (
    <div className={`integer-value ${tone}`}>
      <b>{label}</b>
      <strong>{formatSigned(value)}</strong>
    </div>
  );
}
