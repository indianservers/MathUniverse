import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  RotateCcw,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  fractionToMixed,
  operateFractions,
  type Fraction,
} from "../../../components/ncert/grade7/grade7MathUtils";
import type { LessonAdapterProps } from "../types";
import "./FractionCalculatorTargetLesson2.css";

type Field = "aNumerator" | "aDenominator" | "bNumerator" | "bDenominator";
const VIEWS = [
  ["interaction", "◉", "Interaction + visualization"],
  ["explain", "▤", "Explain"],
  ["examples", "♙", "Examples"],
  ["formulas", "∑", "Formulas"],
  ["know", "⌘", "Know more"],
] as const;
const PROBLEMS = [
  [
    { numerator: 1, denominator: 2 },
    { numerator: 3, denominator: 4 },
  ],
  [
    { numerator: 2, denominator: 3 },
    { numerator: 1, denominator: 6 },
  ],
  [
    { numerator: 3, denominator: 5 },
    { numerator: 1, denominator: 10 },
  ],
] as const;
const VIEW_HEADINGS: Record<string, string> = {
  interaction: "Add fractions by matching parts",
  explain: "Why common denominators describe equal-sized parts",
  examples: "Worked fraction-addition examples",
  formulas: "Fraction addition formula",
  know: "Equivalent-fraction connections",
};

export default function FractionCalculatorTargetLesson2({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState<Fraction>({ numerator: 1, denominator: 2 });
  const [b, setB] = useState<Fraction>({ numerator: 3, denominator: 4 });
  const [activeField, setActiveField] = useState<Field>("aNumerator");
  const [activeView, setActiveView] = useState("interaction");
  const [keyMode, setKeyMode] = useState<"numbers" | "fraction" | "sign">(
    "fraction",
  );
  const [problemIndex, setProblemIndex] = useState(0);
  const [evaluations, setEvaluations] = useState(0);
  const model = useMemo(() => fractionModel(a, b), [a, b]);
  const restore = () => {
    setA({ numerator: 1, denominator: 2 });
    setB({ numerator: 3, denominator: 4 });
    setActiveField("aNumerator");
    setActiveView("interaction");
    setKeyMode("fraction");
    setProblemIndex(0);
    setEvaluations(0);
  };
  useEffect(restore, [resetToken]);
  const update = (field: Field, value: number) => {
    const safe = field.endsWith("Denominator") && value === 0 ? 1 : value;
    if (field.startsWith("a"))
      setA((v) => ({
        ...v,
        [field.endsWith("Numerator") ? "numerator" : "denominator"]: safe,
      }));
    else
      setB((v) => ({
        ...v,
        [field.endsWith("Numerator") ? "numerator" : "denominator"]: safe,
      }));
    onInteraction();
  };
  const valueFor = (field: Field) =>
    field === "aNumerator"
      ? a.numerator
      : field === "aDenominator"
        ? a.denominator
        : field === "bNumerator"
          ? b.numerator
          : b.denominator;
  const key = (label: string) => {
    if (label === "⌫")
      return update(activeField, Math.trunc(valueFor(activeField) / 10));
    if (label === "±" || label === "-")
      return update(activeField, -valueFor(activeField));
    if (label === "/")
      return setActiveField(
        activeField.startsWith("a") ? "aDenominator" : "bDenominator",
      );
    if (label === "+")
      return setActiveField(
        activeField.startsWith("a") ? "bNumerator" : "aNumerator",
      );
    if (label === ".")
      return update(
        activeField.endsWith("Numerator")
          ? activeField.startsWith("a")
            ? "aDenominator"
            : "bDenominator"
          : activeField,
        10,
      );
    const digit = Number(label);
    if (Number.isFinite(digit))
      update(
        activeField,
        Number(`${Math.abs(valueFor(activeField))}${digit}`) *
          Math.sign(valueFor(activeField) || 1),
      );
  };
  const load = (index: number) => {
    const [left, right] = PROBLEMS[index];
    setA({ ...left });
    setB({ ...right });
    setProblemIndex(index);
    onInteraction();
  };
  return (
    <div
      className="target-fraction-page"
      data-testid="calculator-mockup-0002"
      data-dedicated-lesson="2"
      data-object-model="linked-two-fraction-lcd-equivalent-bars-exact-mixed-decimal-model"
      data-a={`${a.numerator}/${a.denominator}`}
      data-b={`${b.numerator}/${b.denominator}`}
      data-lcd={model.common}
      data-result={model.resultText}
      data-mixed={model.mixedText}
      data-decimal={model.decimal.toFixed(6)}
      data-active-field={activeField}
      data-key-mode={keyMode}
      data-active-view={activeView}
      data-problem-index={problemIndex}
      data-evaluations={evaluations}
    >
      <nav
        className="target-fraction-breadcrumb"
        aria-label="Fraction calculator breadcrumb"
      >
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>2 Fraction Calculator</b>
      </nav>
      <header className="target-fraction-header">
        <div>
          <h1>Fraction Calculator</h1>
          <p>Calculate accurately with fractions</p>
          <span>⌘ Calculator Lab</span>
          <span>◷ 6–10 min</span>
        </div>
        <aside>
          <Target />
          <div>
            <h2>Objective</h2>
            <p>Add fractions by matching denominators first.</p>
            <b>Never add denominators directly.</b>
          </div>
        </aside>
      </header>
      <nav
        className="target-fraction-tabs"
        aria-label="Fraction calculator lesson views"
      >
        {VIEWS.map(([id, icon, label]) => (
          <button
            type="button"
            key={id}
            className={activeView === id ? "active" : ""}
            onClick={() => {
              setActiveView(id);
              onInteraction();
            }}
          >
            {icon} {label}
          </button>
        ))}
      </nav>
      <section className="target-fraction-workspace">
        <h2>
          {VIEW_HEADINGS[activeView]} <Info />
        </h2>
        <div className="target-fraction-grid">
          <section className="target-fraction-entry">
            <h3>Enter fractions</h3>
            <div className="target-fraction-inputs">
              <FractionInput
                side="a"
                value={a}
                activeField={activeField}
                setActiveField={setActiveField}
                update={update}
              />
              <b>+</b>
              <FractionInput
                side="b"
                value={b}
                activeField={activeField}
                setActiveField={setActiveField}
                update={update}
              />
            </div>
            <div className="fraction-entry-actions">
              <button
                type="button"
                onClick={() => {
                  setA({ numerator: 0, denominator: 1 });
                  setB({ numerator: 0, denominator: 1 });
                  onInteraction();
                }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  setA(b);
                  setB(a);
                  onInteraction();
                }}
              >
                ↔ Swap
              </button>
            </div>
            <div className="fraction-key-modes">
              <button
                type="button"
                className={keyMode === "numbers" ? "active" : ""}
                onClick={() => {
                  setKeyMode("numbers");
                  setActiveField(
                    activeField.startsWith("a") ? "aNumerator" : "bNumerator",
                  );
                  onInteraction();
                }}
              >
                123
              </button>
              <button
                type="button"
                className={keyMode === "fraction" ? "active" : ""}
                onClick={() => {
                  setKeyMode("fraction");
                  onInteraction();
                }}
              >
                a/b
              </button>
              <button
                type="button"
                className={keyMode === "sign" ? "active" : ""}
                onClick={() => {
                  setKeyMode("sign");
                  key("±");
                  onInteraction();
                }}
              >
                ±
              </button>
            </div>
            <div className="fraction-keypad">
              {[
                "7",
                "8",
                "9",
                "⌫",
                "4",
                "5",
                "6",
                "/",
                "1",
                "2",
                "3",
                "-",
                "0",
                ".",
                "+",
              ].map((label) => (
                <button
                  type="button"
                  key={label}
                  aria-label={`Fraction key ${label}`}
                  onClick={() => key(label)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="fraction-equals"
              onClick={() => {
                setEvaluations((v) => v + 1);
                onInteraction();
              }}
            >
              =
            </button>
            <p className="fraction-tip">
              <b>Tip:</b> Change to a common denominator before adding. Only
              numerators combine.
            </p>
          </section>
          <section className="target-fraction-visual">
            <h3>Visualize the fractions</h3>
            <div className="fraction-legend">
              <span>
                ■ First fraction ({a.numerator}/{a.denominator})
              </span>
              <span>
                ■ Second fraction ({b.numerator}/{b.denominator})
              </span>
            </div>
            <h4>Original fractions</h4>
            <FractionBar fraction={a} color="cyan" />
            <FractionBar fraction={b} color="violet" />
            <hr />
            <h4>Make a common denominator ({model.commonName})</h4>
            <div className="fraction-common">
              <div>
                <b>
                  {a.numerator}/{a.denominator} = {model.aEquivalent}/
                  {model.common}
                </b>
                <p>
                  Multiply numerator and denominator by{" "}
                  {model.common / a.denominator}.
                </p>
              </div>
              <div>
                <FractionBar
                  fraction={{
                    numerator: model.aEquivalent,
                    denominator: model.common,
                  }}
                  color="cyan"
                />
                <FractionBar
                  fraction={{
                    numerator: model.bEquivalent,
                    denominator: model.common,
                  }}
                  color="violet"
                />
              </div>
            </div>
            <div className="fraction-add">
              <b>Add numerators (denominators stay the same)</b>
              <p>
                {model.aEquivalent}/{model.common} + {model.bEquivalent}/
                {model.common} =
                <strong>
                  {model.sumNumerator}/{model.common}
                </strong>
                <span>
                  <Check /> Result = {model.resultText}
                </span>
              </p>
            </div>
            <div className="fraction-warning">
              <TriangleAlert />
              <b>
                Never add denominators directly.
                <br />
                Only numerators combine after denominators match.
              </b>
            </div>
          </section>
          <aside className="target-fraction-output">
            <h3>Input</h3>
            <p>
              {a.numerator}/{a.denominator} + {b.numerator}/{b.denominator}
            </p>
            <Output
              label="Common denominator"
              value={`The least common denominator (LCD) of ${a.denominator} and ${b.denominator} is ${model.common}.`}
            />
            <Output
              label={`Equivalent fractions (with denominator ${model.common})`}
              value={`${a.numerator}/${a.denominator} = ${model.aEquivalent}/${model.common}\n${b.numerator}/${b.denominator} = ${model.bEquivalent}/${model.common}`}
            />
            <Output
              label="Addition with common denominator"
              value={`${model.aEquivalent}/${model.common} + ${model.bEquivalent}/${model.common} = ${model.sumNumerator}/${model.common}`}
            />
            <Output
              label="Exact result"
              value={`Result = ${model.resultText}`}
              success
            />
            <Output
              label="Mixed number"
              value={`Mixed number = ${model.mixedText}`}
              success
            />
            <Output
              label="Decimal check"
              value={`${model.resultText} = ${format(model.decimal)} ✓`}
            />
            <button
              type="button"
              onClick={() => {
                setEvaluations((v) => v + 1);
                onInteraction();
              }}
            >
              Evaluate
            </button>
            <button
              type="button"
              onClick={() => load((problemIndex + 1) % PROBLEMS.length)}
            >
              <RotateCcw /> New problem
            </button>
          </aside>
        </div>
      </section>
      <section className="target-fraction-practice">
        <Target />
        <div>
          <h3>Practice time</h3>
          <p>Try another problem to test your understanding.</p>
        </div>
        <b>Try: 2/3 + 1/6</b>
        <button type="button" onClick={() => load(1)}>
          Solve it <ArrowRight />
        </button>
      </section>
      <nav className="target-fraction-nav">
        <a href="/lessons/core-workspaces/1-basic-calculator">
          <ArrowLeft />
          <span>
            <b>Previous</b>Basic Calculator
          </span>
        </a>
        <div>
          Lesson progress <progress value="35" max="100" /> 35%
        </div>
        <a href="/lessons/core-workspaces/3-mixed-numbers">
          <span>
            <b>Next</b>Mixed Numbers
          </span>
          <ArrowRight />
        </a>
      </nav>
    </div>
  );
}

function FractionInput({
  side,
  value,
  activeField,
  setActiveField,
  update,
}: {
  side: "a" | "b";
  value: Fraction;
  activeField: Field;
  setActiveField: (v: Field) => void;
  update: (f: Field, v: number) => void;
}) {
  const n = `${side}Numerator` as Field,
    d = `${side}Denominator` as Field;
  return (
    <div>
      <input
        aria-label={`${side} numerator`}
        className={activeField === n ? "active" : ""}
        value={value.numerator}
        onFocus={() => setActiveField(n)}
        onChange={(e) => update(n, Number(e.target.value))}
      />
      <input
        aria-label={`${side} denominator`}
        className={activeField === d ? "active" : ""}
        value={value.denominator}
        onFocus={() => setActiveField(d)}
        onChange={(e) => update(d, Number(e.target.value))}
      />
    </div>
  );
}
function FractionBar({
  fraction,
  color,
}: {
  fraction: Fraction;
  color: "cyan" | "violet";
}) {
  const count = Math.max(1, Math.min(12, Math.abs(fraction.denominator)));
  return (
    <div className="fraction-bar-row">
      <b>
        {fraction.numerator}
        <i />
        {fraction.denominator}
      </b>
      <div className={`fraction-bar ${color}`}>
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={i < Math.abs(fraction.numerator) ? "fill" : ""}
          >{`1/${count}`}</span>
        ))}
      </div>
    </div>
  );
}
function Output({
  label,
  value,
  success = false,
}: {
  label: string;
  value: string;
  success?: boolean;
}) {
  return (
    <div className={success ? "success" : ""}>
      <b>{label}</b>
      <p>{value}</p>
    </div>
  );
}
function fractionModel(a: Fraction, b: Fraction) {
  const result = operateFractions(a, b, "add");
  const common = result.commonDenominator;
  const aEquivalent = a.numerator * (common / a.denominator);
  const bEquivalent = b.numerator * (common / b.denominator);
  const sumNumerator = aEquivalent + bEquivalent;
  const mixed = fractionToMixed(result.result);
  const mixedText =
    result.result.numerator < 0 && !mixed.startsWith("-") ? `-${mixed}` : mixed;
  return {
    common,
    aEquivalent,
    bEquivalent,
    sumNumerator,
    resultText: `${result.result.numerator}/${result.result.denominator}`,
    mixedText,
    decimal: result.result.numerator / result.result.denominator,
    commonName: common === 4 ? "fourths" : `${common}ths`,
  };
}
function format(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(4).replace(/0+$/, "");
}
