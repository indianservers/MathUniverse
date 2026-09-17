import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Expand,
  ExternalLink,
  Languages,
  Lightbulb,
  Link2,
  RefreshCcw,
  RotateCcw,
  Scale,
  Share2,
  Sparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  LITERAL_FORMULAS_110 as formulas,
  LITERAL_PRACTICES_110 as practiceFormulas,
  isLiteralOperationDrop110,
  literalOperationPayload110,
  solveLiteralFormula110,
  type LiteralFormula110 as FormulaDefinition,
} from "./literalEquationsLesson110Model";
import "./LiteralEquationsTargetLesson110.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

const formatNumber = (value: number) =>
  Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/\.00$/, "");

export default function LiteralEquationsTargetLesson110({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [formulaId, setFormulaId] = useState(formulas[0].id);
  const [subject, setSubject] = useState(formulas[0].defaultSubject);
  const [values, setValues] = useState<Record<string, number>>({
    ...formulas[0].defaults,
  });
  const [operationApplied, setOperationApplied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [invalidDrop, setInvalidDrop] = useState("");
  const [checked, setChecked] = useState(true);
  const [activeTab, setActiveTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceHint, setPracticeHint] = useState(false);
  const [actions, setActions] = useState(0);

  const formula = useMemo(
    () => formulas.find((item) => item.id === formulaId) ?? formulas[0],
    [formulaId],
  );
  const { arrangement, numericResult, check, checkCorrect } =
    solveLiteralFormula110(formula, subject, values);
  const practice = practiceFormulas[practiceIndex];
  const practiceArrangement = practice.arrangements[practice.defaultSubject];
  const practiceResult = practiceArrangement.compute(practice.defaults);
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };

  const reset = (notify = true) => {
    setFormulaId(formulas[0].id);
    setSubject(formulas[0].defaultSubject);
    setValues({ ...formulas[0].defaults });
    setOperationApplied(false);
    setDragging(false);
    setInvalidDrop("");
    setChecked(true);
    setActiveTab("Interaction + visualization");
    setLanguage("English (English)");
    setShared(false);
    setWorkspaceOpen(false);
    setExpanded(false);
    setPracticeIndex(0);
    setPracticeHint(false);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const chooseFormula = (id: string) => {
    const next = formulas.find((item) => item.id === id) ?? formulas[0];
    setFormulaId(next.id);
    setSubject(next.defaultSubject);
    setValues({ ...next.defaults });
    setOperationApplied(false);
    setInvalidDrop("");
    setChecked(false);
    act();
  };
  const chooseSubject = (nextSubject: string) => {
    setSubject(nextSubject);
    setOperationApplied(false);
    setInvalidDrop("");
    setChecked(false);
    act();
  };
  const dropOperation = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData("text/literal-operation");
    if (isLiteralOperationDrop110(payload, formula, subject)) {
      setOperationApplied(true);
      setInvalidDrop("");
    } else {
      setInvalidDrop(payload || "missing operation");
    }
    setDragging(false);
    act();
  };
  const shareLesson = async () => {
    const shareData = {
      title: "Literal Equations",
      text: `Rearrange ${formula.formula} for ${subject}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      act();
    } catch {
      setShared(false);
    }
  };

  const hindi = language.startsWith("Hindi");

  return (
    <div
      className={`literal110-page ${expanded ? "expanded" : ""}`}
      data-testid="algebra-mockup-0167"
      data-dedicated-lesson="110"
      data-object-model="dedicated-tested-selectable-calculated-literal-formula-target-subject-validated-native-inverse-operation-drag-symbolic-isolation-restriction-tracking-numeric-substitution-generated-practice-functional-tabs-language-and-native-sharing-model"
      data-formula-id={formula.id}
      data-formula={formula.formula}
      data-subject={subject}
      data-result={arrangement.result}
      data-divisor={arrangement.divisor ?? "none"}
      data-restriction={
        arrangement.divisor ? `${arrangement.divisor} ≠ 0` : "none"
      }
      data-numeric-result={numericResult}
      data-check-left={check.left}
      data-check-right={check.right}
      data-check-correct={checked && checkCorrect}
      data-operation-applied={operationApplied}
      data-dragging={dragging}
      data-invalid-drop={invalidDrop}
      data-active-tab={activeTab}
      data-language={language}
      data-shared={shared}
      data-workspace-open={workspaceOpen}
      data-expanded={expanded}
      data-practice-index={practiceIndex}
      data-practice-formula={practice.formula}
      data-practice-result={practiceArrangement.result}
      data-practice-numeric={practiceResult}
      data-practice-hint={practiceHint}
      data-actions={actions}
    >
      <nav className="literal110-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>110 Literal Equations</b>
      </nav>

      <header className="literal110-intro">
        <small>
          <b>ALGEBRA</b>
          <b>EQUATIONS AND INEQUALITIES</b>
        </small>
        <h1>{hindi ? "शाब्दिक समीकरण" : "Literal Equations"}</h1>
        <p>
          {hindi
            ? "किसी एक चर को सूत्र का विषय बनाने के लिए सूत्र को पुनर्व्यवस्थित करें।"
            : "Rearrange formulas to make one variable the subject."}
        </p>
        <nav>
          <b>
            <Lightbulb />
            Intermediate-Advanced
          </b>
          <b>
            <Link2 />
            Formula rearranger
          </b>
          <b>
            <RefreshCcw />
            6-10 min
          </b>
          <b>
            <Sparkles />
            Guided Practice
          </b>
        </nav>
        <div>
          <label>
            <Languages />
            <select
              aria-label="Literal equations language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                act();
              }}
            >
              <option>English (English)</option>
              <option>Hindi (हिन्दी)</option>
            </select>
          </label>
          <button type="button" onClick={() => reset()}>
            <RotateCcw />
            Reset
          </button>
          <button type="button" onClick={shareLesson}>
            <Share2 />
            {shared ? "Link ready" : "Share"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            setWorkspaceOpen((value) => !value);
            act();
          }}
        >
          <ExternalLink />
          {workspaceOpen ? "Close workspace" : "Workspace"}
        </button>
      </header>

      <nav className="literal110-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((tab) => (
          <button
            type="button"
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              act();
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "Interaction + visualization" ? (
        <main className="literal110-lab">
          <header>
            <div>
              <small>INTERACTION · FORMULA REARRANGER</small>
              <h2>Make the target variable the subject</h2>
              <p>
                Rearrange the formula by performing valid inverse operations.
              </p>
            </div>
            <nav>
              <b>
                Target variable: <i>{subject}</i>
              </b>
              <b>
                Restriction:{" "}
                <i>
                  {arrangement.divisor ? `${arrangement.divisor} ≠ 0` : "none"}
                </i>
              </b>
              <b>{actions} actions</b>
              <button
                type="button"
                aria-label="Expand formula workspace"
                onClick={() => {
                  setExpanded((value) => !value);
                  act();
                }}
              >
                <Expand />
              </button>
            </nav>
          </header>
          <section className="literal110-workspace-grid">
            <article className="literal110-steps">
              <section className="start">
                <h3>
                  Step 1 <span>Start with the given formula</span>
                </h3>
                <FormulaDisplay
                  formula={formula}
                  subject={subject}
                  mode="original"
                />
              </section>
              <section
                className={`operation ${operationApplied ? "applied" : ""}`}
                aria-label="Inverse operation drop target"
                onDragOver={(event) => event.preventDefault()}
                onDrop={dropOperation}
              >
                <div className="balance-line">
                  <Scale />
                </div>
                <header>
                  <h3>
                    Step 2{" "}
                    <span>
                      {arrangement.divisor
                        ? `Divide both sides by ${arrangement.divisor}`
                        : `The subject ${subject} is already isolated`}
                    </span>
                  </h3>
                  <p>
                    {arrangement.divisor
                      ? `We divide by ${arrangement.divisor}. This is valid because ${arrangement.divisor} ≠ 0.`
                      : "No inverse operation is needed."}
                  </p>
                </header>
                <button
                  type="button"
                  draggable
                  aria-label={`Drag inverse operation ${arrangement.divisor ? `Divide by ${arrangement.divisor}` : "Already isolated"}`}
                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      "text/literal-operation",
                      literalOperationPayload110(formula, subject),
                    );
                    setDragging(true);
                    setInvalidDrop("");
                    act();
                  }}
                  onDragEnd={() => setDragging(false)}
                  onClick={() => {
                    setOperationApplied(true);
                    act();
                  }}
                >
                  {arrangement.divisor
                    ? `Operation: ÷ ${arrangement.divisor}`
                    : "Subject isolated"}
                </button>
                <FormulaDisplay
                  formula={formula}
                  subject={subject}
                  mode="operation"
                />
                {invalidDrop && (
                  <em>Use the inverse operation for the selected subject.</em>
                )}
              </section>
              <section className="simplify">
                <h3>
                  Step 3 <span>Simplify</span>
                </h3>
                <FormulaResult result={arrangement.result} />
              </section>
              <section className="spotlight">
                <h3>
                  Step 4 <span>Identify the subject</span>
                </h3>
                <div>
                  <b>Subject spotlight</b>
                  <strong>{subject}</strong>
                  <i>=</i>
                  <FormulaExpression result={arrangement.result} />
                </div>
              </section>
              <footer>
                <CircleHelp />
                <b>Rule of thumb</b>
                <p>
                  Undo operations around the subject variable.
                  <br />
                  Other variables stay as symbols and do not disappear unless
                  removed by a valid inverse operation.
                </p>
              </footer>
            </article>

            <aside className="literal110-details">
              <h3>Formula details</h3>
              <b>{formula.formula}</b>
              <p>
                Make <strong>{subject}</strong> the subject.
              </p>
              <h3>Variables</h3>
              <ul>
                {formula.variables.map((variable) => (
                  <li
                    className={variable === subject ? "target" : ""}
                    key={variable}
                  >
                    {variable}
                    {variable === subject ? " (target)" : ""}
                  </li>
                ))}
              </ul>
            </aside>

            <aside className="literal110-controls">
              <h2>Controls</h2>
              <label>
                Formula
                <select
                  aria-label="Literal formula"
                  value={formula.id}
                  onChange={(event) => chooseFormula(event.target.value)}
                >
                  {formulas.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.formula}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Choose subject
                <select
                  aria-label="Literal equation subject"
                  value={subject}
                  onChange={(event) => chooseSubject(event.target.value)}
                >
                  {formula.variables.map((variable) => (
                    <option key={variable}>{variable}</option>
                  ))}
                </select>
              </label>
              <fieldset>
                <legend>Check values</legend>
                {formula.variables
                  .filter((variable) => variable !== subject)
                  .map((variable) => (
                    <label key={variable}>
                      {variable}
                      <input
                        aria-label={`Check value ${variable}`}
                        type="number"
                        step="any"
                        value={values[variable]}
                        onChange={(event) => {
                          setValues((current) => ({
                            ...current,
                            [variable]: Number(event.target.value),
                          }));
                          setChecked(false);
                          act();
                        }}
                      />
                    </label>
                  ))}
              </fieldset>
              <button
                type="button"
                onClick={() => {
                  setChecked(true);
                  act();
                }}
              >
                Check with values
              </button>
              <button
                type="button"
                onClick={() => {
                  setValues({ ...formula.defaults });
                  setOperationApplied(false);
                  setChecked(false);
                  act();
                }}
              >
                <RotateCcw />
                Reset workspace
              </button>
            </aside>

            <aside className="literal110-results">
              <section>
                <small>Result</small>
                <FormulaResult result={arrangement.result} />
              </section>
              <section>
                <small>Numeric result</small>
                <strong>
                  {subject} = {formatNumber(numericResult)}
                </strong>
              </section>
              <section>
                <small>Check the original formula</small>
                <p>
                  {formatNumber(check.right)} = {formatNumber(check.left)}{" "}
                  {checked && checkCorrect && <Check />}
                </p>
                <strong>
                  {checked
                    ? checkCorrect
                      ? "The rearranged formula works!"
                      : "Check the entered values."
                    : "Press Check with values."}
                </strong>
              </section>
            </aside>
          </section>
        </main>
      ) : (
        <LiteralTabPanel110 tab={activeTab} onChooseFormula={chooseFormula} />
      )}

      {workspaceOpen && (
        <section
          className="literal110-workspace-panel"
          aria-label="Literal equations workspace"
        >
          <b>Workspace values</b>
          <span>{formula.formula}</span>
          <span>{arrangement.result}</span>
          <span>
            {subject} = {formatNumber(numericResult)}
          </span>
        </section>
      )}

      <section className="literal110-practice">
        <header>
          <h2>Guided practice</h2>
          <p>Try a similar problem.</p>
        </header>
        <div>
          <article>
            <b>Practice {practiceIndex + 1}</b>
            <p>
              Make <strong>{practice.defaultSubject}</strong> the subject of the
              formula below.
            </p>
            <h3>{practice.formula}</h3>
            <button
              type="button"
              onClick={() => {
                setPracticeHint((value) => !value);
                act();
              }}
            >
              <Lightbulb />
              {practiceHint ? "Hide hint" : "Show hint"}
            </button>
          </article>
          <article>
            <h3>
              Step 1{" "}
              <span>Divide both sides by {practiceArrangement.divisor}</span>
            </h3>
            <FormulaDisplay
              formula={practice}
              subject={practice.defaultSubject}
              mode="operation"
            />
            <h3>
              Step 2 <span>Simplify</span>
            </h3>
            <FormulaResult result={practiceArrangement.result} />
            <footer>
              <b>Final answer</b>
              <span>
                <FormulaResult result={practiceArrangement.result} compact />
                <i>
                  Correct! <Check />
                </i>
              </span>
            </footer>
          </article>
          <aside>
            <CircleHelp />
            <b>Pro tip</b>
            <p>
              {practice.id === "circumference"
                ? "Keep π as a symbol. Do not round or evaluate unless asked to."
                : "Keep every non-subject variable in the denominator."}
            </p>
            {practiceHint && (
              <strong>
                Divide both sides by {practiceArrangement.divisor}.
              </strong>
            )}
            <button
              type="button"
              onClick={() => {
                setPracticeIndex(
                  (value) => (value + 1) % practiceFormulas.length,
                );
                setPracticeHint(false);
                act();
              }}
            >
              <RefreshCcw />
              New practice
            </button>
          </aside>
        </div>
      </section>

      <nav className="literal110-navigation">
        <a href="/lessons/algebra/109-equations-with-fractions">
          <ArrowLeft />
          <span>
            Previous<b>Equations with Fractions</b>
          </span>
        </a>
        <a href="/lessons/algebra/111-linear-equations">
          <span>
            Next<b>Linear Equations</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="literal110-footer">
        <div>
          <Sparkles />
          <span>
            <b>Math Universe</b>
            <small>
              Interactive math labs, visual proofs, NCERT explorations,
              graphing, CAS-style tools, and classroom-ready activities.
            </small>
          </span>
        </div>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <p>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</p>
        <small>www.IndianServers.com · info@IndianServers.com</small>
      </footer>
      <LessonTopicStudyBoard lessonId={110} view={activeTab} onInteraction={onInteraction} />

    </div>
  );
}

function FormulaDisplay({
  formula,
  subject,
  mode,
}: {
  formula: FormulaDefinition;
  subject: string;
  mode: "original" | "operation";
}) {
  if (mode === "original") {
    const [left, right = ""] = formula.formula
      .split("=")
      .map((part) => part.trim());
    return (
      <div className="literal110-formula-display">
        <b className={left === subject ? "target" : ""}>{left}</b>
        <i>=</i>
        {right.split(" ").map((token, index) => (
          <span className="product-token" key={token}>
            {index > 0 && <i>·</i>}
            <b className={token === subject ? "target" : ""}>{token}</b>
          </span>
        ))}
      </div>
    );
  }
  const arrangement = formula.arrangements[subject];
  return (
    <div className="literal110-operation-display">
      <span>
        <strong>{formula.formula.split("=")[0].trim()}</strong>
        <i>{arrangement.divisor ?? "1"}</i>
      </span>
      <b>=</b>
      <span>
        <strong>{formula.formula.split("=")[1].trim()}</strong>
        <i>{arrangement.divisor ?? "1"}</i>
      </span>
      <b>=</b>
      <strong>{subject}</strong>
    </div>
  );
}

function FormulaResult({
  result,
  compact = false,
}: {
  result: string;
  compact?: boolean;
}) {
  const [subject, expression = ""] = result
    .split("=")
    .map((part) => part.trim());
  const fraction =
    expression.match(/^(.+) \/ \((.+)\)$/) ??
    expression.match(/^(.+) \/ (.+)$/);
  return (
    <div className={`literal110-formula-result ${compact ? "compact" : ""}`}>
      <b>{subject}</b>
      <i>=</i>
      {fraction ? (
        <span>
          <strong>{fraction[1]}</strong>
          <em>{fraction[2]}</em>
        </span>
      ) : (
        <strong>{expression}</strong>
      )}
    </div>
  );
}

function FormulaExpression({ result }: { result: string }) {
  const expression = result.split("=")[1]?.trim() ?? result;
  const fraction =
    expression.match(/^(.+) \/ \((.+)\)$/) ??
    expression.match(/^(.+) \/ (.+)$/);
  return fraction ? (
    <span className="literal110-expression">
      <strong>{fraction[1]}</strong>
      <em>{fraction[2]}</em>
    </span>
  ) : (
    <strong>{expression}</strong>
  );
}

function LiteralTabPanel110({
  tab,
  onChooseFormula,
}: {
  tab: string;
  onChooseFormula: (id: string) => void;
}) {
  const content: Record<string, { title: string; body: string }> = {
    Explain: {
      title: "Why inverse operations work",
      body: "Apply the same non-zero operation to both sides. Equality stays balanced while the target variable becomes isolated.",
    },
    Examples: {
      title: "Worked formula examples",
      body: "Choose an example to load it into the rearranger with calculated values and subject-specific steps.",
    },
    Formulas: {
      title: "Formula library",
      body: "Every subject option below is backed by its own symbolic arrangement and numerical evaluator.",
    },
    "Know more": {
      title: "Restrictions matter",
      body: "A divisor cannot be zero. The rearranger displays the restriction produced by the selected subject.",
    },
  };
  const selected = content[tab] ?? content.Explain;
  return (
    <main className="literal110-lab literal110-tab-panel">
      <small>LITERAL EQUATIONS</small>
      <h2>{selected.title}</h2>
      <p>{selected.body}</p>
      {(tab === "Examples" || tab === "Formulas") && (
        <div>
          {formulas.map((formula) => (
            <button
              type="button"
              key={formula.id}
              onClick={() => onChooseFormula(formula.id)}
            >
              {formula.formula}
              <span>Make {formula.defaultSubject} the subject</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
