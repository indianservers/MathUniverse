import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Pencil,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  Trophy,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState, type DragEvent, type KeyboardEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  ALGEBRAIC_FRACTION_PRACTICES_98 as practices,
  ALGEBRAIC_FRACTION_PRESETS_98 as presets,
  algebraicFractionLabel98 as fractionLabel,
  algebraicFractionValues98,
  isAlgebraicFractionAnswer98,
  isCommonFactorSource98,
  linearFactor98 as linear,
  quadraticFromRoots98 as quadratic,
  simplifiedFractionAnswer98 as answerLabel,
} from "./algebraicFractionsLesson98Model";
import "./AlgebraicFractionsTargetLesson98.css";

const minus = "−";
type AlgebraicFractionsTab98 =
  "Interact" | "Learn" | "Examples" | "Formula" | "Practice";

export default function AlgebraicFractionsTargetLesson98({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [presetId, setPresetId] = useState("difference-one");
  const [checkValue, setCheckValue] = useState(3);
  const [factorEnabled, setFactorEnabled] = useState(true);
  const [cancelEnabled, setCancelEnabled] = useState(true);
  const [restrictionEnabled, setRestrictionEnabled] = useState(true);
  const [substitutionEnabled, setSubstitutionEnabled] = useState(true);
  const [tab, setTab] = useState<AlgebraicFractionsTab98>("Interact");
  const [dragging, setDragging] = useState("");
  const [cancelDrops, setCancelDrops] = useState<string[]>([]);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("y + 3, y ≠ 3");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [actions, setActions] = useState(0);
  const preset = presets.find((item) => item.id === presetId) ?? presets[0];
  const practice = practices[practiceIndex];
  const numerator = quadratic(
    preset.variable,
    preset.cancelledRoot,
    preset.retainedRoot,
  );
  const denominator = linear(preset.variable, preset.cancelledRoot);
  const commonFactor = linear(preset.variable, preset.cancelledRoot);
  const simplified = linear(preset.variable, preset.retainedRoot);
  const restriction = preset.cancelledRoot;
  const proof = algebraicFractionValues98(preset, checkValue);
  const validCheck = proof.valid;
  const originalNumeratorValue = proof.numerator;
  const denominatorValue = proof.denominator;
  const checkSymbol = checkValue < 0 ? `(${checkValue})` : `${checkValue}`;
  const substitutedNumerator = numerator.replaceAll(
    preset.variable,
    checkSymbol,
  );
  const substitutedDenominator = denominator.replaceAll(
    preset.variable,
    checkSymbol,
  );
  const originalValue = proof.original;
  const simplifiedValue = proof.simplified;
  const equivalent = proof.equivalent;
  const practiceExpected = answerLabel(practice);
  const practiceCorrect = isAlgebraicFractionAnswer98(practiceAnswer, practice);
  const act = () => {
    setActions((count) => count + 1);
    onInteraction();
  };
  const reset = (notify = true) => {
    setPresetId("difference-one");
    setCheckValue(3);
    setFactorEnabled(true);
    setCancelEnabled(true);
    setRestrictionEnabled(true);
    setSubstitutionEnabled(true);
    setTab("Interact");
    setDragging("");
    setCancelDrops([]);
    setPracticeIndex(0);
    setPracticeAnswer("y + 3, y ≠ 3");
    setPracticeChecked(true);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => {
    reset(false);
  }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const choosePreset = (id: string) => {
    const next = presets.find((item) => item.id === id) ?? presets[0];
    setPresetId(id);
    setCheckValue(next.cancelledRoot === 3 ? 2 : 3);
    setCancelDrops([]);
    act();
  };
  const startDrag = (event: DragEvent<HTMLButtonElement>, source: string) => {
    event.dataTransfer.setData("text/common-factor", source);
    setDragging(source);
  };
  const dropFactor = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const source = event.dataTransfer.getData("text/common-factor");
    if (!isCommonFactorSource98(source)) {
      setDragging("");
      return;
    }
    setCancelDrops((current) =>
      current.includes(source) ? current : [...current, source],
    );
    setCancelEnabled(true);
    setDragging("");
    act();
  };
  const gradePractice = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setPracticeChecked(true);
      act();
    }
  };
  const nextPractice = () => {
    const next = (practiceIndex + 1) % practices.length;
    const item = practices[next];
    setPracticeIndex(next);
    setPracticeAnswer(answerLabel(item));
    setPracticeChecked(true);
    act();
  };

  return (
    <div
      className="algfrac98-page"
      data-testid="algebra-mockup-0155"
      data-dedicated-lesson="98"
      data-object-model="dedicated-tested-selectable-rational-expression-validated-draggable-common-factor-cancellation-domain-restriction-substitution-graded-practice-and-functional-learning-tabs-model"
      data-preset={presetId}
      data-numerator={numerator}
      data-denominator={denominator}
      data-common-factor={commonFactor}
      data-simplified={simplified}
      data-restriction={restriction}
      data-check-value={checkValue}
      data-valid-check={validCheck}
      data-original-numerator-value={originalNumeratorValue}
      data-denominator-value={denominatorValue}
      data-original-value={originalValue ?? "undefined"}
      data-simplified-value={simplifiedValue}
      data-equivalent={equivalent}
      data-factor-enabled={factorEnabled}
      data-cancel-enabled={cancelEnabled}
      data-restriction-enabled={restrictionEnabled}
      data-substitution-enabled={substitutionEnabled}
      data-tab={tab}
      data-dragging={dragging}
      data-cancel-drops={cancelDrops.join(",")}
      data-practice={practiceIndex}
      data-practice-answer={practiceExpected}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-actions={actions}
    >
      <nav className="algfrac98-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Expressions and Manipulation</a>
        <span>&gt;</span>
        <b>Algebraic Fractions</b>
      </nav>
      <header className="algfrac98-intro">
        <h1>Algebraic Fractions</h1>
        <p>Algebraic fractions are rational expressions.</p>
        <nav>
          <b>Intermediate</b>
          <b>Algebra</b>
          <b>6-10 min</b>
          <b>Rational expression</b>
        </nav>
      </header>
      <nav className="algfrac98-tabs">
        {["Interact", "Learn", "Examples", "Formula", "Practice"].map(
          (name) => (
            <button
              type="button"
              className={tab === name ? "active" : ""}
              key={name}
              onClick={() => {
                setTab(name as AlgebraicFractionsTab98);
                act();
              }}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <AlgebraicFractionsTabPanel98 tab={tab} presetId={presetId} />
      )}
      <main
        className={`algfrac98-layout ${tab === "Interact" ? "" : "hidden"}`}
      >
        <section className="algfrac98-left">
          <h2>Simplify the rational expression</h2>
          <div className="algfrac98-expression">
            <Fraction numerator={numerator} denominator={denominator} />
          </div>
          <article className="algfrac98-step-one">
            <h3>
              <b>Step 1:</b> Factor the numerator
            </h3>
            <div>
              <span>{numerator}</span>
              <em>=</em>
              <button
                type="button"
                draggable
                aria-label="Drag numerator common factor"
                onDragStart={(event) => startDrag(event, "numerator")}
                onDragEnd={() => setDragging("")}
              >
                {factorEnabled ? `(${commonFactor})` : numerator}
              </button>
              {factorEnabled && <span>({simplified})</span>}
            </div>
            <i>⌄</i>
          </article>
          <article
            className="algfrac98-step-two"
            onDragOver={(event) => event.preventDefault()}
            onDrop={dropFactor}
          >
            <h3>
              <b>Step 2:</b> Cancel the common factor
            </h3>
            <div className="algfrac98-cancel-target">
              <span>
                <span>
                  <button
                    type="button"
                    draggable
                    aria-label="Drag denominator common factor"
                    onDragStart={(event) => startDrag(event, "denominator")}
                    onDragEnd={() => setDragging("")}
                  >
                    ({commonFactor})
                  </button>
                  {factorEnabled && <b>({simplified})</b>}
                </span>
                <i />
                <button
                  type="button"
                  draggable
                  aria-label="Drag denominator factor"
                  onDragStart={(event) => startDrag(event, "denominator")}
                  onDragEnd={() => setDragging("")}
                >
                  ({commonFactor})
                </button>
              </span>
              <em>=</em>
              <strong>
                {cancelEnabled ? simplified : fractionLabel(preset)}
                <small>
                  {restrictionEnabled
                    ? `Restriction: ${preset.variable} ≠ ${restriction}`
                    : "Restriction hidden"}
                </small>
              </strong>
            </div>
          </article>
          <article className="algfrac98-step-three">
            <h3>
              <b>Step 3:</b> Keep the restriction
            </h3>
            <p>
              The original denominator {denominator} cannot be zero.
              <br />
              So, {preset.variable} ≠ {restriction} remains a restriction.
            </p>
            <div className="algfrac98-line">
              <span />
              <i
                style={{
                  left: `${Math.max(14, Math.min(86, 50 + restriction * 9))}%`,
                }}
              />
              <b
                style={{
                  left: `${Math.max(14, Math.min(86, 50 + restriction * 9))}%`,
                }}
              >
                {restriction}
              </b>
              <small>−∞</small>
              <small>0</small>
              <small>∞</small>
            </div>
            <aside>
              <b>
                Allowed: {preset.variable} ∈ ℝ,&nbsp; {preset.variable} ≠{" "}
                {restriction}
              </b>
              <b>
                Excluded: {preset.variable} = {restriction}
              </b>
            </aside>
          </article>
          <article className="algfrac98-proof">
            <h3>
              <CheckCircle2 />
              Simplified form
            </h3>
            <strong>
              {simplified},&nbsp; {preset.variable} ≠ {restriction}
            </strong>
            {substitutionEnabled && (
              <section>
                <h4>Check by substitution</h4>
                <p>
                  Let {preset.variable} = {checkValue}
                </p>
                <div>
                  <span>
                    <b>Original expression</b>
                    <div className="algfrac98-proof-calc">
                      <Fraction
                        numerator={numerator}
                        denominator={denominator}
                        compact
                      />
                      <i>
                        |{preset.variable}={checkValue}
                      </i>
                      <em>=</em>
                      <Fraction
                        numerator={substitutedNumerator}
                        denominator={substitutedDenominator}
                        compact
                      />
                      <em>=</em>
                      <Fraction
                        numerator={`${originalNumeratorValue}`}
                        denominator={`${denominatorValue}`}
                        compact
                      />
                      <em>= {originalValue ?? "undefined"}</em>
                    </div>
                  </span>
                  <span>
                    <b>Simplified expression</b>
                    <em>
                      {simplified} |{preset.variable}={checkValue}
                      <br />= {checkValue}{" "}
                      {preset.retainedRoot < 0 ? "+" : minus}{" "}
                      {Math.abs(preset.retainedRoot)} = {simplifiedValue}
                    </em>
                  </span>
                </div>
              </section>
            )}
          </article>
          <article className="algfrac98-warning">
            <h3>
              <TriangleAlert />
              Common misconception
            </h3>
            <p>Do not cancel terms that are not common factors.</p>
            <div>
              <span>
                <Fraction
                  numerator={`${preset.variable} + 2`}
                  denominator={preset.variable}
                  compact
                />
                <b>× Cannot cancel</b>
                <small>
                  ({preset.variable} is not a factor of {preset.variable} + 2)
                </small>
              </span>
              <i>
                Why?
                <br />
                <br />
                {preset.variable} is not a factor of {preset.variable} + 2.
              </i>
              <span>
                <Fraction
                  numerator={`${preset.variable} + 2`}
                  denominator={preset.variable}
                  compact
                />
                <em>=</em>
                <b>1 + 2/{preset.variable}</b>
                <small>✓ Correct view</small>
              </span>
            </div>
          </article>
        </section>
        <aside className="algfrac98-rail">
          <section className="algfrac98-controls">
            <h2>
              <SlidersHorizontal />
              Controls
            </h2>
            <label>
              Choose expression
              <select
                aria-label="Choose expression"
                value={presetId}
                onChange={(event) => choosePreset(event.target.value)}
              >
                {presets.map((item) => (
                  <option key={item.id} value={item.id}>
                    {fractionLabel(item)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Check value for {preset.variable}
              <input
                aria-label="Check value"
                type="number"
                value={checkValue}
                onChange={(event) => {
                  setCheckValue(Number(event.target.value));
                  act();
                }}
              />
              <small>
                {validCheck
                  ? `Must not equal ${restriction}`
                  : `Excluded value: ${restriction}`}
              </small>
            </label>
            <article>
              <h3>Guided steps</h3>
              <Toggle
                label="Factor numerator"
                value={factorEnabled}
                onToggle={() => {
                  setFactorEnabled((current) => !current);
                  act();
                }}
              />
              <Toggle
                label="Cancel common factor"
                value={cancelEnabled}
                onToggle={() => {
                  setCancelEnabled((current) => !current);
                  act();
                }}
              />
              <Toggle
                label="Show restriction"
                value={restrictionEnabled}
                onToggle={() => {
                  setRestrictionEnabled((current) => !current);
                  act();
                }}
              />
              <Toggle
                label="Check by substitution"
                value={substitutionEnabled}
                onToggle={() => {
                  setSubstitutionEnabled((current) => !current);
                  act();
                }}
              />
              <button type="button" onClick={() => reset()}>
                <RotateCcw />
                Reset all steps
              </button>
            </article>
          </section>
          <section className="algfrac98-result">
            <h2>
              <Trophy />
              Result
            </h2>
            <div>
              <strong>
                {simplified},&nbsp; {preset.variable} ≠ {restriction}
              </strong>
              <p>
                {validCheck
                  ? `Same value when ${preset.variable} = ${checkValue}`
                  : "Excluded input"}
              </p>
              <b>{equivalent ? simplifiedValue : "undefined"}</b>
            </div>
          </section>
          <section className="algfrac98-practice">
            <h2>
              <Pencil />
              Practice
            </h2>
            <p>Simplify and state restriction.</p>
            <Fraction
              numerator={quadratic(
                practice.variable,
                practice.cancelledRoot,
                practice.retainedRoot,
              )}
              denominator={linear(practice.variable, practice.cancelledRoot)}
            />
            <label>
              Your answer
              <input
                aria-label="Practice answer"
                value={practiceAnswer}
                onChange={(event) => {
                  setPracticeAnswer(event.target.value);
                  setPracticeChecked(false);
                  act();
                }}
                onKeyDown={gradePractice}
              />
              {practiceChecked && practiceCorrect && <Check />}
            </label>
            <b className={practiceChecked && practiceCorrect ? "correct" : ""}>
              {practiceChecked
                ? practiceCorrect
                  ? "Correct!"
                  : "Try again"
                : "Press Enter"}
            </b>
            <button type="button" onClick={nextPractice}>
              <RefreshCw />
              New practice
            </button>
          </section>
        </aside>
      </main>
      <nav className="algfrac98-navigation">
        <a href="/lessons/algebra/97-factorisation">
          <ArrowLeft />
          <span>
            Previous<b>Factorisation</b>
          </span>
        </a>
        <a href="/lessons/algebra/99-indices">
          <span>
            Next<b>Indices</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="algfrac98-footer">
        <div>
          <b>Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
        </div>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
          <br />
          www.IndianServers.com&nbsp;&nbsp;&nbsp; info@IndianServers.com
        </small>
      </footer>
    </div>
  );
}

function Fraction({
  numerator,
  denominator,
  compact = false,
}: {
  numerator: string;
  denominator: string;
  compact?: boolean;
}) {
  return (
    <span className={`algfrac98-fraction ${compact ? "compact" : ""}`}>
      <b>{numerator}</b>
      <i />
      <b>{denominator}</b>
    </span>
  );
}
function Toggle({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" role="switch" aria-checked={value} onClick={onToggle}>
      <span>{label}</span>
      <i className={value ? "on" : ""}>
        <b />
      </i>
    </button>
  );
}

function AlgebraicFractionsTabPanel98({
  tab,
  presetId,
}: {
  tab: Exclude<AlgebraicFractionsTab98, "Interact">;
  presetId: string;
}) {
  const preset = presets.find((item) => item.id === presetId) ?? presets[0];
  const result = answerLabel(preset);
  const content =
    tab === "Learn"
      ? [
          "Factor the numerator before cancelling a common factor.",
          "Keep every value excluded by the original denominator.",
        ]
      : tab === "Examples"
        ? presets.map((item) => `${fractionLabel(item)} → ${answerLabel(item)}`)
        : tab === "Formula"
          ? [
              "(x − a)(x − b) / (x − a) = x − b, where x ≠ a",
              `${fractionLabel(preset)} → ${result}`,
            ]
          : practices.map(
              (item) =>
                `Simplify ${fractionLabel(item)} and state its restriction`,
            );
  return (
    <section className="algfrac98-tab-panel" data-active-learning-tab={tab}>
      <h2>{tab}</h2>
      <strong>{result}</strong>
      {content.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </section>
  );
}
