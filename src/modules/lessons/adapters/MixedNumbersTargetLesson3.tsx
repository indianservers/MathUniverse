import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  fractionToMixed,
  operateFractions,
} from "../../../components/ncert/grade7/grade7MathUtils";
import type { LessonAdapterProps } from "../types";
import "./MixedNumbersTargetLesson3.css";

type MixedNumber = { whole: number; numerator: number; denominator: number };
type Side = "first" | "second";
type Part = keyof MixedNumber;
type ActiveField = `${Side}-${Part}`;

const INITIAL_FIRST: MixedNumber = { whole: 2, numerator: 1, denominator: 3 };
const INITIAL_SECOND: MixedNumber = { whole: 1, numerator: 3, denominator: 4 };
const VIEWS = [
  ["interaction", "Interaction + visualization"],
  ["explain", "Explain"],
  ["examples", "Examples"],
  ["formulas", "Formulas"],
  ["know", "Know more"],
] as const;
const VIEW_TITLES: Record<string, string> = {
  interaction: "Convert before you calculate",
  explain: "Why mixed numbers convert first",
  examples: "Worked mixed-number examples",
  formulas: "Mixed-to-improper conversion formula",
  know: "Mixed numbers as whole and fractional parts",
};

export default function MixedNumbersTargetLesson3({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [first, setFirst] = useState<MixedNumber>(INITIAL_FIRST);
  const [second, setSecond] = useState<MixedNumber>(INITIAL_SECOND);
  const [activeField, setActiveField] = useState<ActiveField>("first-whole");
  const [activeView, setActiveView] = useState("interaction");
  const [keyMode, setKeyMode] = useState("calculator");
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [evaluations, setEvaluations] = useState(0);
  const model = useMemo(() => mixedModel(first, second), [first, second]);
  const keyLabels =
    keyMode === "fractions"
      ? [
          "1",
          "2",
          "3",
          "/",
          "4",
          "5",
          "6",
          "x",
          "7",
          "8",
          "9",
          "(",
          "0",
          ")",
          "-",
          "+",
        ]
      : keyMode === "symbols"
        ? [
            "(",
            ")",
            "{",
            "}",
            "+",
            "-",
            "x",
            "÷",
            "1",
            "2",
            "3",
            "/",
            "4",
            "5",
            "6",
            "0",
          ]
        : [
            "7",
            "8",
            "9",
            "÷",
            "4",
            "5",
            "6",
            "x",
            "1",
            "0",
            "-",
            "(",
            "(",
            ")",
            "}",
            "+",
          ];

  useEffect(() => {
    setFirst(INITIAL_FIRST);
    setSecond(INITIAL_SECOND);
    setActiveField("first-whole");
    setActiveView("interaction");
    setKeyMode("calculator");
    setPracticeOpen(false);
    setEvaluations(0);
  }, [resetToken]);

  const update = (side: Side, part: Part, value: number) => {
    const safe = part === "denominator" && value === 0 ? 1 : value;
    const setter = side === "first" ? setFirst : setSecond;
    setter((current) => ({ ...current, [part]: safe }));
    onInteraction();
  };
  const activeValue = () => {
    const [side, part] = activeField.split("-") as [Side, Part];
    return (side === "first" ? first : second)[part];
  };
  const key = (label: string) => {
    const [side, part] = activeField.split("-") as [Side, Part];
    if (label === "Clear")
      return update(side, part, part === "denominator" ? 1 : 0);
    if (label === "-") return update(side, part, -activeValue());
    if (label === "+") {
      setActiveField(side === "first" ? "second-whole" : "first-whole");
      return onInteraction();
    }
    if (label === "/") {
      setActiveField(`${side}-denominator`);
      return onInteraction();
    }
    if (label === "(") {
      setActiveField(`${side}-whole`);
      return onInteraction();
    }
    if (label === ")" || label === "}") {
      setActiveField(`${side}-numerator`);
      return onInteraction();
    }
    if (label === "x" || label === "÷") {
      const next =
        part === "whole"
          ? "numerator"
          : part === "numerator"
            ? "denominator"
            : "whole";
      setActiveField(`${side}-${next}`);
      return onInteraction();
    }
    const digit = Number(label);
    if (Number.isFinite(digit)) {
      const sign = Math.sign(activeValue() || 1);
      update(side, part, Number(`${Math.abs(activeValue())}${digit}`) * sign);
    }
  };

  return (
    <div
      className="target-mixed-page"
      data-testid="calculator-mockup-0003"
      data-dedicated-lesson="3"
      data-object-model="dual-mixed-number-whole-block-fraction-strip-improper-lcd-exact-decimal-model"
      data-first={`${first.whole} ${first.numerator}/${first.denominator}`}
      data-second={`${second.whole} ${second.numerator}/${second.denominator}`}
      data-improper-first={model.firstImproper.text}
      data-improper-second={model.secondImproper.text}
      data-lcd={model.common}
      data-exact={model.exact}
      data-mixed={model.mixed}
      data-decimal={model.decimal.toFixed(5)}
      data-active-field={activeField}
      data-active-view={activeView}
      data-key-mode={keyMode}
      data-practice-open={practiceOpen}
      data-evaluations={evaluations}
    >
      <nav
        className="target-mixed-breadcrumb"
        aria-label="Mixed numbers breadcrumb"
      >
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>3 Mixed Numbers</b>
      </nav>
      <header className="target-mixed-header">
        <div>
          <span>CORE WORKSPACES</span>
          <span>SCIENTIFIC CALCULATOR</span>
          <h1>Mixed Numbers</h1>
          <p>Connect mixed and improper fraction forms</p>
        </div>
        <aside>
          <b>⌑ Calculator Lab</b>
          <b>▣ Scientific Calculator</b>
          <b>◷ 8-10 min</b>
        </aside>
      </header>
      <div className="target-mixed-columns">
        <main>
          <nav
            className="target-mixed-tabs"
            aria-label="Mixed number lesson views"
          >
            {VIEWS.map(([id, label]) => (
              <button
                type="button"
                className={activeView === id ? "active" : ""}
                key={id}
                onClick={() => {
                  setActiveView(id);
                  onInteraction();
                }}
              >
                {label}
              </button>
            ))}
          </nav>
          <section className="target-mixed-workspace">
            <header>
              <h2>{VIEW_TITLES[activeView]}</h2>
              <p>
                Build mixed numbers, convert to improper fractions, then add
                exactly.
              </p>
            </header>
            <div className="target-mixed-builders">
              <MixedBuilder
                label="First mixed number"
                side="first"
                value={first}
                color="blue"
                activeField={activeField}
                onFocus={setActiveField}
                onChange={update}
              />
              <b>+</b>
              <MixedBuilder
                label="Second mixed number"
                side="second"
                value={second}
                color="violet"
                activeField={activeField}
                onFocus={setActiveField}
                onChange={update}
              />
            </div>
            <div className="target-mixed-steps">
              <section>
                <h3>Step 1: Convert to improper fractions</h3>
                <div>
                  <CircleCheck />
                  <Equation
                    value={`${mixedText(first)} = ${model.firstImproper.text}`}
                    tone="blue"
                  />
                  <b>+</b>
                  <Equation
                    value={`${mixedText(second)} = ${model.secondImproper.text}`}
                    tone="violet"
                  />
                  <ArrowRight />
                  <Equation
                    value={`${model.firstImproper.text} + ${model.secondImproper.text}`}
                  />
                </div>
              </section>
              <section>
                <h3>Step 2: Use common denominator</h3>
                <small>
                  LCM of {first.denominator} and {second.denominator} is{" "}
                  {model.common}
                </small>
                <div>
                  <Equation
                    value={`${model.firstImproper.text} x ${model.firstMultiplier}/${model.firstMultiplier} = ${model.commonFirst}/${model.common}`}
                    tone="blue"
                  />
                  <b>+</b>
                  <Equation
                    value={`${model.secondImproper.text} x ${model.secondMultiplier}/${model.secondMultiplier} = ${model.commonSecond}/${model.common}`}
                    tone="violet"
                  />
                  <ArrowRight />
                  <Equation
                    value={`${model.commonFirst}/${model.common} + ${model.commonSecond}/${model.common} = ${model.unsimplified}`}
                  />
                </div>
              </section>
              <section className="mixed-result-step">
                <h3>Step 3: Simplify and write as mixed number</h3>
                <div>
                  <strong>
                    {model.unsimplified} = {model.mixed}
                  </strong>
                  <b>Result = {model.mixed}</b>
                  <span>
                    Decimal check (approx.)
                    <strong>
                      {model.mixed} = {model.decimal.toFixed(5)}...
                    </strong>
                    <Check />
                  </span>
                </div>
              </section>
            </div>
            <div className="target-mixed-keyboard">
              <nav>
                {["Calculator", "Fractions", "Symbols", "Clear"].map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    className={keyMode === mode.toLowerCase() ? "active" : ""}
                    onClick={() => {
                      setKeyMode(mode.toLowerCase());
                      if (mode === "Clear") key("Clear");
                      else onInteraction();
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </nav>
              <div>
                {keyLabels.map((label, index) => (
                  <button
                    type="button"
                    key={`${label}-${index}`}
                    aria-label={`Mixed number key ${label} ${index}`}
                    onClick={() => key(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="Evaluate mixed numbers"
                onClick={() => {
                  setEvaluations((value) => value + 1);
                  onInteraction();
                }}
              >
                =
              </button>
            </div>
          </section>
          <section className="target-mixed-practice">
            <WandSparkles />
            <div>
              <h3>Try this next</h3>
              <p>Apply the same steps to subtract mixed numbers.</p>
            </div>
            <b>Try: 3 1/2 - 1 2/5</b>
            <button
              type="button"
              onClick={() => {
                setPracticeOpen((value) => !value);
                onInteraction();
              }}
            >
              {practiceOpen ? "2 1/10" : "Start practice"}
              <ArrowRight />
            </button>
          </section>
        </main>
        <aside className="target-mixed-proof">
          <section className="mixed-remember">
            <TriangleAlert />
            <div>
              <h3>Remember</h3>
              <p>
                A mixed number means
                <br />
                whole part plus fraction.
              </p>
            </div>
          </section>
          <ProofCard title="Mixed-number structure">
            <MiniStructure value={first} color="blue" />
            <MiniStructure value={second} color="violet" />
          </ProofCard>
          <ProofCard title="Improper form">
            <p>Convert each mixed number.</p>
            <strong>
              {mixedText(first)} = {model.firstImproper.text}{" "}
              {mixedText(second)} = {model.secondImproper.text}
            </strong>
          </ProofCard>
          <ProofCard title={`Common denominator (${model.common})`}>
            <strong>
              {model.firstImproper.text} = {model.commonFirst}/{model.common}{" "}
              {model.secondImproper.text} = {model.commonSecond}/{model.common}
            </strong>
            <b>
              {model.commonFirst}/{model.common} + {model.commonSecond}/
              {model.common} = {model.unsimplified}
            </b>
          </ProofCard>
          <ProofCard title="Exact result" success>
            <strong>
              {model.exact} = {model.mixed}
            </strong>
            <p>This is the exact value.</p>
          </ProofCard>
          <ProofCard title="Decimal check">
            <strong>
              {model.mixed} ≈ {model.decimal.toFixed(5)}...
            </strong>
            <CircleCheck />
          </ProofCard>
        </aside>
      </div>
      <nav className="target-mixed-nav">
        <a href="/lessons/core-workspaces/2-fraction-calculator">
          <ArrowLeft />
          <span>
            <b>Previous</b>Fraction Calculator
          </span>
        </a>
        <a href="/lessons/core-workspaces/4-percentage-calculator">
          <span>
            <b>Next</b>Percentage Calculator
          </span>
          <ArrowRight />
        </a>
      </nav>
    </div>
  );
}

function MixedBuilder({
  label,
  side,
  value,
  color,
  activeField,
  onFocus,
  onChange,
}: {
  label: string;
  side: Side;
  value: MixedNumber;
  color: "blue" | "violet";
  activeField: ActiveField;
  onFocus: (field: ActiveField) => void;
  onChange: (side: Side, part: Part, value: number) => void;
}) {
  return (
    <fieldset className={`mixed-builder ${color}`}>
      <legend>{label}</legend>
      <div className="mixed-builder-inputs">
        <label>
          <input
            aria-label={`${label} whole part`}
            className={activeField === `${side}-whole` ? "active" : ""}
            value={value.whole}
            onFocus={() => onFocus(`${side}-whole`)}
            onChange={(event) =>
              onChange(side, "whole", Number(event.target.value))
            }
          />
          <span>whole part</span>
        </label>
        <label>
          <input
            aria-label={`${label} numerator`}
            className={activeField === `${side}-numerator` ? "active" : ""}
            value={value.numerator}
            onFocus={() => onFocus(`${side}-numerator`)}
            onChange={(event) =>
              onChange(side, "numerator", Number(event.target.value))
            }
          />
          <b>/</b>
          <input
            aria-label={`${label} denominator`}
            className={activeField === `${side}-denominator` ? "active" : ""}
            value={value.denominator}
            onFocus={() => onFocus(`${side}-denominator`)}
            onChange={(event) =>
              onChange(side, "denominator", Number(event.target.value))
            }
          />
          <span>fraction part</span>
        </label>
      </div>
      <div className="mixed-builder-model">
        {Array.from(
          { length: Math.min(5, Math.max(0, value.whole)) },
          (_, index) => (
            <i key={index} />
          ),
        )}
        <i className="empty" />
        <FractionStrip
          numerator={value.numerator}
          denominator={value.denominator}
        />
      </div>
      <strong>
        {mixedText(value)} = {value.whole * value.denominator + value.numerator}
        /{value.denominator}
        <small>improper form</small>
      </strong>
    </fieldset>
  );
}
function FractionStrip({
  numerator,
  denominator,
}: {
  numerator: number;
  denominator: number;
}) {
  const count = Math.min(12, Math.max(1, Math.abs(denominator)));
  return (
    <div className="mixed-fraction-strip">
      {Array.from({ length: count }, (_, index) => (
        <i className={index < Math.abs(numerator) ? "fill" : ""} key={index} />
      ))}
      <span>
        {numerator}/{denominator}
      </span>
    </div>
  );
}
function Equation({
  value,
  tone = "neutral",
}: {
  value: string;
  tone?: "blue" | "violet" | "neutral";
}) {
  return <span className={`mixed-equation ${tone}`}>{value}</span>;
}
function ProofCard({
  title,
  children,
  success = false,
}: {
  title: string;
  children: React.ReactNode;
  success?: boolean;
}) {
  return (
    <section className={`mixed-proof-card ${success ? "success" : ""}`}>
      <h3>{title}</h3>
      {children}
    </section>
  );
}
function MiniStructure({
  value,
  color,
}: {
  value: MixedNumber;
  color: "blue" | "violet";
}) {
  return (
    <div className={`mixed-mini ${color}`}>
      <div>
        {Array.from(
          { length: Math.min(3, Math.max(0, value.whole)) },
          (_, index) => (
            <i key={index} />
          ),
        )}
        <i className="empty" />
        <b>+</b>
        <strong>{mixedText(value)}</strong>
      </div>
      <p>
        {value.whole} whole part{value.whole === 1 ? "" : "s"} +{" "}
        {value.numerator}/{value.denominator}
      </p>
    </div>
  );
}
function mixedText(value: MixedNumber) {
  return `${value.whole} ${value.numerator}/${value.denominator}`;
}
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : Math.abs(a);
}
function mixedModel(first: MixedNumber, second: MixedNumber) {
  const firstImproper = {
    numerator: first.whole * first.denominator + first.numerator,
    denominator: first.denominator || 1,
  };
  const secondImproper = {
    numerator: second.whole * second.denominator + second.numerator,
    denominator: second.denominator || 1,
  };
  const result = operateFractions(firstImproper, secondImproper, "add");
  const common = result.commonDenominator;
  const commonFirst =
    firstImproper.numerator * (common / firstImproper.denominator);
  const commonSecond =
    secondImproper.numerator * (common / secondImproper.denominator);
  const unsimplified = `${commonFirst + commonSecond}/${common}`;
  const divisor = gcd(commonFirst + commonSecond, common);
  const exact = `${(commonFirst + commonSecond) / divisor}/${common / divisor}`;
  return {
    firstImproper: {
      ...firstImproper,
      text: `${firstImproper.numerator}/${firstImproper.denominator}`,
    },
    secondImproper: {
      ...secondImproper,
      text: `${secondImproper.numerator}/${secondImproper.denominator}`,
    },
    common,
    firstMultiplier: common / firstImproper.denominator,
    secondMultiplier: common / secondImproper.denominator,
    commonFirst,
    commonSecond,
    unsimplified,
    exact,
    mixed: fractionToMixed(result.result),
    decimal: result.result.numerator / result.result.denominator,
  };
}
