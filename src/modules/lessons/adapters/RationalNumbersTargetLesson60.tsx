import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Languages,
  RotateCcw,
  Share2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./RationalNumbersTargetLesson60.css";

function gcd(a: number, b: number) {
  let x = Math.abs(a),
    y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}
export default function RationalNumbersTargetLesson60({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [numerator, setNumerator] = useState(4),
    [denominator, setDenominator] = useState(3);
  const [tab, setTab] = useState("Explore"),
    [language, setLanguage] = useState("English (English)");
  const [workspace, setWorkspace] = useState(false),
    [shareState, setShareState] = useState("Share");
  const [practice, setPractice] = useState<"" | "yes" | "no">(""),
    [practiceStatus, setPracticeStatus] = useState("Choose Yes or No.");
  const [actions, setActions] = useState(0);
  const divisor = gcd(numerator, denominator),
    reducedA = numerator / divisor,
    reducedB = denominator / divisor;
  const whole = Math.trunc(reducedA / reducedB),
    remainder = Math.abs(reducedA % reducedB),
    decimal = numerator / denominator;
  const parts = Math.max(1, Math.min(12, Math.abs(numerator))),
    stripDenominator = Math.max(1, Math.min(8, Math.abs(denominator)));
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeNumerator = (value: number) => {
    setNumerator(Math.max(-12, Math.min(12, Math.round(value))));
    act();
  };
  const changeDenominator = (value: number) => {
    const next = Math.max(-9, Math.min(9, Math.round(value)));
    setDenominator(next === 0 ? (denominator < 0 ? -1 : 1) : next);
    act();
  };
  const reset = () => {
    setNumerator(4);
    setDenominator(3);
    setTab("Explore");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setPractice("");
    setPracticeStatus("Choose Yes or No.");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setNumerator(4);
    setDenominator(3);
    setTab("Explore");
    setLanguage("English (English)");
    setWorkspace(false);
    setShareState("Share");
    setPractice("");
    setPracticeStatus("Choose Yes or No.");
    setActions(0);
  }, [resetToken]);
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(
        `${numerator}/${denominator} = ${decimal}`,
      );
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    act();
  };
  const decimalText = useMemo(
    () =>
      Number.isInteger(decimal)
        ? `${decimal}`
        : `${decimal.toFixed(5).replace(/0+$/, "")}...`,
    [decimal],
  );
  return (
    <div
      className="rational-page"
      data-testid="number-mockup-0042"
      data-dedicated-lesson="60"
      data-object-model="numerator-denominator-reduction-mixed-decimal-strip-number-line-membership-practice-model"
      data-numerator={numerator}
      data-denominator={denominator}
      data-reduced={`${reducedA}/${reducedB}`}
      data-whole={whole}
      data-remainder={remainder}
      data-decimal={decimal}
      data-tab={tab}
      data-language={language}
      data-workspace={workspace}
      data-practice={practice}
      data-practice-correct={practice === "yes"}
      data-actions={actions}
    >
      <span className="sr-only">
        Concept trace: Rational as ratio. Rational numbers can be written as
        a/b.
      </span>
      <nav className="rational-breadcrumb">
        <a href="/">
          <ArrowLeft />
        </a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/numbers-and-arithmetic">Numbers And Arithmetic</a>
        <span>›</span>
        <b>60 Rational Numbers</b>
      </nav>
      <header className="rational-hero">
        <nav>
          <b>NUMBERS AND ARITHMETIC</b>
          <b>NUMBERS AND NUMBER THEORY</b>
        </nav>
        <h1>Rational Numbers</h1>
        <p>Connect fractions and decimals.</p>
        <div>
          <b>♙ Rational-Intermediate</b>
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
      <nav className="rational-tabs">
        {["Explore", "Explain", "Examples", "Formulas", "Know more"].map(
          (label) => (
            <button
              type="button"
              className={tab === label ? "active" : ""}
              onClick={() => {
                setTab(label);
                act();
              }}
              key={label}
            >
              ◇ {label}
            </button>
          ),
        )}
      </nav>
      <main className="rational-layout">
        <section className="rational-work">
          <h2>
            Selected rational:{" "}
            <span>
              {numerator}/{denominator}
            </span>
          </h2>
          <h3>Fraction model</h3>
          <section className="fraction-strip">
            <div>
              {Array.from({ length: stripDenominator * 2 }, (_, index) => (
                <i
                  className={
                    index < parts
                      ? index < stripDenominator
                        ? "whole-fill"
                        : "part-fill"
                      : ""
                  }
                  key={index}
                />
              ))}
            </div>
            <footer>
              <span>1 whole</span>
              <span>
                {remainder}/{Math.abs(reducedB)}
              </span>
            </footer>
          </section>
          <p className="parts-label">
            <b>{Math.abs(numerator)}</b> parts of size{" "}
            <Fraction a={1} b={Math.abs(denominator)} />
          </p>
          <h3>Number line</h3>
          <section className="rational-line">
            <div />
            <nav>
              {[0, 1 / 3, 2 / 3, 1, 4 / 3, 5 / 3, 2].map((value, index) => (
                <button
                  type="button"
                  className={Math.abs(value - decimal) < 0.001 ? "active" : ""}
                  onClick={() => {
                    changeNumerator(index);
                    setDenominator(3);
                  }}
                  key={value}
                >
                  {index === 0 || index === 3 || index === 6 ? (
                    index / 3
                  ) : (
                    <Fraction a={index} b={3} />
                  )}
                </button>
              ))}
            </nav>
          </section>
          <h3>Equivalent forms</h3>
          <section className="equivalent-forms">
            <article>
              <Fraction a={reducedA} b={reducedB} />
              <b>=</b>
              <strong>
                {whole}
                {remainder ? (
                  <>
                    {" "}
                    <Fraction a={remainder} b={Math.abs(reducedB)} />
                  </>
                ) : null}
              </strong>
            </article>
            <article>
              <p>Decimal form:</p>
              <strong>{decimalText}</strong>
            </article>
            <article>
              A rational number can be
              <br />
              written as <Fraction a="a" b="b" />, b ≠ 0.
            </article>
          </section>
          <h3>Membership in the rational numbers ⓘ</h3>
          <section className="membership-included">
            <h4>
              Included: -2, 0, 1/2, {numerator}/{denominator}, 1.25
            </h4>
            <nav>
              {["-2", "0", "1/2", `${numerator}/${denominator}`, "1.25"].map(
                (label) => (
                  <button type="button" key={label}>
                    <CheckCircle2 />
                    {label}
                  </button>
                ),
              )}
            </nav>
          </section>
          <section className="membership-excluded">
            <h4>Not included: √2</h4>
            <button type="button">
              <XCircle />
              √2
            </button>
          </section>
        </section>
        <aside className="rational-side">
          <section className="fraction-controls">
            <h2>
              Adjust numerator
              <br />
              and denominator
            </h2>
            <label>Numerator (a)</label>
            <div>
              <button
                type="button"
                onClick={() => changeNumerator(numerator - 1)}
              >
                −
              </button>
              <input
                aria-label="Numerator"
                type="number"
                value={numerator}
                onChange={(event) =>
                  changeNumerator(Number(event.target.value))
                }
              />
              <button
                type="button"
                onClick={() => changeNumerator(numerator + 1)}
              >
                +
              </button>
            </div>
            <label>Denominator (b ≠ 0)</label>
            <div>
              <button
                type="button"
                onClick={() => changeDenominator(denominator - 1)}
              >
                −
              </button>
              <input
                aria-label="Denominator"
                type="number"
                value={denominator}
                onChange={(event) =>
                  changeDenominator(Number(event.target.value))
                }
              />
              <button
                type="button"
                onClick={() => changeDenominator(denominator + 1)}
              >
                +
              </button>
            </div>
            <output>
              <b>Result</b>
              <strong>
                {numerator} / {denominator}
              </strong>
            </output>
          </section>
          <section className="about-rational">
            <h2>About rational numbers</h2>
            <p>
              A rational number can be
              <br />
              written as <b>a/b</b>, b ≠ 0, where
              <br />a and b are integers and
              <br />b ≠ 0.
            </p>
          </section>
          <section className="rational-practice">
            <h2>Quick practice</h2>
            <p>Try: Is 7/5 rational?</p>
            <div>
              <button
                className={practice === "yes" ? "active" : ""}
                type="button"
                onClick={() => {
                  setPractice("yes");
                  setPracticeStatus("Correct: 7/5 is a ratio of integers.");
                  act();
                }}
              >
                ✓ Yes
              </button>
              <button
                className={practice === "no" ? "wrong" : ""}
                type="button"
                onClick={() => {
                  setPractice("no");
                  setPracticeStatus("Try again: its denominator is nonzero.");
                  act();
                }}
              >
                ⊗ No
              </button>
            </div>
            <output>{practiceStatus}</output>
          </section>
        </aside>
      </main>
      <nav className="rational-navigation">
        <a href="/lessons/numbers-and-arithmetic/59-integers">
          <ArrowLeft />
          <span>
            Previous<b>Integers</b>
          </span>
        </a>
        <a href="/lessons/numbers-and-arithmetic/61-irrational-numbers">
          <span>
            Next<b>Irrational Numbers</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="rational-footer">
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
function Fraction({ a, b }: { a: number | string; b: number | string }) {
  return (
    <span className="stacked-fraction">
      <b>{a}</b>
      <b>{b}</b>
    </span>
  );
}
