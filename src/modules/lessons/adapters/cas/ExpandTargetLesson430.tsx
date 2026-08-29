import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  Lightbulb,
  Pencil,
  RefreshCcw,
  RotateCcw,
  Shapes,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import type { LessonAdapterProps } from "../../types";
import "./ExpandTargetLesson430.css";

type Binomial = { x: number; constant: number; label: string };
type ExpansionModel = {
  valid: boolean;
  left: Binomial;
  right: Binomial;
  products: [number, number, number, number];
  coefficients: [number, number, number];
  expanded: string;
};

const INITIAL = "(x+2)*(x-3)";
const CHALLENGE = "(2x - 1)(x + 4)";
const INITIAL_ANSWER = "2x² + 8x - 4";

export default function ExpandTargetLesson430({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [expression, setExpression] = useState(INITIAL);
  const [view, setView] = useState<"tiles" | "symbolic">("tiles");
  const [stage, setStage] = useState(3);
  const [showAlgebra, setShowAlgebra] = useState(false);
  const [challenge, setChallenge] = useState(CHALLENGE);
  const [answer, setAnswer] = useState(INITIAL_ANSWER);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">(
    "idle",
  );
  const [hint, setHint] = useState(false);
  const [practiceSteps, setPracticeSteps] = useState(false);
  const [collected, setCollected] = useState<number[]>([0, 1, 2, 3]);
  const [headerTarget, setHeaderTarget] = useState<HTMLElement | null>(null);
  const model = useMemo(() => parseExpansion(expression), [expression]);
  const challengeModel = useMemo(() => parseExpansion(challenge), [challenge]);

  useEffect(() => {
    setExpression(INITIAL);
    setView("tiles");
    setStage(3);
    setShowAlgebra(false);
    setChallenge(CHALLENGE);
    setAnswer(INITIAL_ANSWER);
    setFeedback("idle");
    setHint(false);
    setPracticeSteps(false);
    setCollected([0, 1, 2, 3]);
  }, [resetToken]);
  useEffect(() => {
    setHeaderTarget(document.querySelector<HTMLElement>(".lesson-shell-header"));
  }, []);

  const interact = (run: () => void) => {
    run();
    onInteraction();
  };
  const checkAnswer = () =>
    interact(() => {
      setFeedback(
        normalizePolynomial(answer) ===
          normalizePolynomial(challengeModel.expanded) && challengeModel.valid
          ? "correct"
          : "incorrect",
      );
    });
  const collectProduct = (index: number) =>
    interact(() => {
      setCollected((current) => {
        if (current.includes(index)) return current;
        const next = [...current, index].sort();
        if (next.length === 4) setStage(3);
        return next;
      });
    });
  const reverseStep = () =>
    interact(() => {
      setStage((current) => {
        if (current === 3) {
          setCollected([]);
          return 2;
        }
        if (current === 2) return 1;
        setCollected([0, 1, 2, 3]);
        return 3;
      });
    });

  return (
    <section
      className="exp430-page"
      data-testid="symbolic-cas-mockup-0336"
      data-dedicated-lesson="430"
      data-object-model="parsed-binomial-four-products-area-tiles-combine-practice"
      data-expression={expression}
      data-valid={model.valid}
      data-products={model.products.join(",")}
      data-coefficients={model.coefficients.join(",")}
      data-result={model.expanded}
      data-view={view}
      data-stage={stage}
      data-collected={collected.join(",")}
      data-feedback={feedback}
    >
      {headerTarget && createPortal(<aside className="exp430-guide" aria-label="How to use this CAS Workspace">
        <h2>How to use this CAS Workspace</h2>
        {[
          [Eye, "1", "Observe", "See the expression as a structure (tree)."],
          [Shapes, "2", "Manipulate", "Distribute and collect using algebra tiles."],
          [Lightbulb, "3", "Notice", "Watch terms combine and simplify."],
          [CheckCircle2, "4", "Understand", "Connect to the rule and try a challenge."],
        ].map(([Icon, number, title, text]) => (
          <div key={String(number)}>
            <Icon />
            <b>{String(number)} {String(title)}</b>
            <span>{String(text)}</span>
          </div>
        ))}
      </aside>, headerTarget)}

      <section className="exp430-workspace">
        <article className="exp430-structure">
          <label>
            Expression
            <span>
              <input
                data-lesson-control="expand-expression"
                aria-label="Expression to expand"
                value={expression}
                onChange={(event) =>
                  interact(() => {
                    setExpression(event.target.value);
                    setStage(1);
                    setCollected([]);
                  })
                }
              />
              <Pencil />
              <button
                type="button"
                data-lesson-control="expand-expression-reset"
                aria-label="Reset expansion expression"
                    onClick={() => interact(() => { setExpression(INITIAL); setStage(3); setCollected([0, 1, 2, 3]); })}
              >
                <RefreshCcw />
              </button>
            </span>
          </label>
          <h2>EXPRESSION TREE</h2>
          <ExpressionTree model={model} />
          <h2>DISTRIBUTION (FOIL / AREA MODEL)</h2>
          <AreaModel model={model} />
          <div className="exp430-legend">
            <span /> First x First <span /> First x Last <span /> Last x First <span /> Last x Last
          </div>
        </article>

        <article className="exp430-tiles">
          <header>
            <h2><i>1</i> Algebra Tiles Workspace</h2>
            <div role="group" aria-label="Expansion display mode">
              <button
                type="button"
                data-lesson-control="expand-tiles-view"
                className={view === "tiles" ? "active" : ""}
                onClick={() => interact(() => setView("tiles"))}
              >Tiles view</button>
              <button
                type="button"
                data-lesson-control="expand-symbolic-view"
                className={view === "symbolic" ? "active" : ""}
                onClick={() => interact(() => setView("symbolic"))}
              >Symbolic view</button>
            </div>
          </header>
          <ExpansionStages model={model} view={view} stage={stage} collected={collected} onCollect={collectProduct} />
          <button
            type="button"
            className="exp430-reverse"
            data-lesson-control="expand-reverse-step"
            onClick={reverseStep}
          >
            <RotateCcw /> {stage <= 1 ? "Restore steps" : "Reverse step"}
            <span>{stage <= 1 ? "Build the product tiles again." : "Go back one step to explore."}</span>
          </button>
        </article>
      </section>

      <section className="exp430-result">
        <div>
          <h2>Result (expanded form)</h2>
          <Polynomial coefficients={model.coefficients} />
          <span><Check /> Verified</span>
        </div>
        <button
          type="button"
          data-lesson-control="expand-algebra-steps"
          onClick={() => interact(() => setShowAlgebra((value) => !value))}
        >
          {showAlgebra ? "Hide algebra steps" : "Show steps as algebra"}
        </button>
        {showAlgebra && <p>{model.left.label}{model.right.label} = {model.products.join(" + ")} = {model.expanded}</p>}
      </section>

      <section className="exp430-learning">
        <article>
          <h2>Why this works</h2>
          <p>We use the Distributive Property:</p>
          <strong>a(b + c) = ab + ac</strong>
          <p>so (x + 2)(x - 3) = x(x - 3) + 2(x - 3)</p>
          <p className="equation">= x^2 - 3x + 2x - 6<br />= x^2 - x - 6</p>
        </article>
        <article>
          <h2><CheckCircle2 /> Worked example</h2>
          <p><b>Expand</b> &nbsp; (x + 2)(x - 3)</p>
          <p>= x(x - 3) + 2(x - 3)</p>
          <p>= x^2 - 3x + 2x - 6</p>
          <strong>= x^2 - x - 6</strong>
        </article>
        <article>
          <h2><AlertTriangle /> Common misconception</h2>
          <b>Do not add across parentheses.</b>
          <p><b>Incorrect:</b> (x+2)(x-3) = x + 2 - 3 <span className="wrong">X</span></p>
          <p><b>Why it's wrong:</b> The parentheses mean multiplication of two expressions, not simple addition/subtraction.</p>
        </article>
      </section>

      <section className="exp430-practice">
        <div>
          <h2>Try it yourself</h2>
          <p><b>Challenge:</b> Expand the expression.</p>
          <label>
            <input
              data-lesson-control="expand-challenge"
              aria-label="Expansion challenge"
              value={challenge}
              onChange={(event) => interact(() => { setChallenge(event.target.value); setFeedback("idle"); })}
            />
            <Pencil />
          </label>
        </div>
        <div>
          <label>
            Your answer
            <span>
              <input
                data-lesson-control="expand-practice-answer"
                aria-label="Expanded answer"
                value={answer}
                onChange={(event) => { setAnswer(event.target.value); setFeedback("idle"); }}
              />
              <button type="button" data-lesson-control="expand-practice-check" onClick={checkAnswer}>Check</button>
            </span>
          </label>
          <button type="button" data-lesson-control="expand-hint" className="exp430-hint" onClick={() => interact(() => setHint((value) => !value))}>
            <Lightbulb /> {hint ? "Multiply first, outside, inside, last." : "Show hint"}
          </button>
        </div>
        <div className={`exp430-answer ${feedback}`}>
          <h2>Answer</h2>
          <p><Polynomial coefficients={challengeModel.coefficients} /> <Check /></p>
          {feedback === "incorrect" && <small>Combine both middle x terms.</small>}
          <button type="button" data-lesson-control="expand-practice-steps" onClick={() => interact(() => setPracticeSteps((value) => !value))}>
            <Shapes /> {practiceSteps ? challengeModel.products.join(" + ") : "Show steps"}
          </button>
        </div>
      </section>

      <nav className="exp430-nav" aria-label="Adjacent lessons">
        <a href="/lessons/symbolic-mathematics/429-simplify"><ArrowLeft /><span><small>Previous</small>Simplify</span></a>
        <a href="/lessons/symbolic-mathematics/431-factor"><span><small>Next</small>Factor</span><ArrowRight /></a>
      </nav>
    </section>
  );
}

function ExpressionTree({ model }: { model: ExpansionModel }) {
  return <div className="exp430-tree">
    <b>{model.valid ? `${model.left.label}${model.right.label}` : "Invalid expression"}</b>
    <div><span>{model.left.label}</span><span>{model.right.label}</span></div>
    <div><i>{term(model.left.x, "x")}</i><i>{signed(model.left.constant)}</i><i>{term(model.right.x, "x")}</i><i>{signed(model.right.constant)}</i></div>
  </div>;
}

function AreaModel({ model }: { model: ExpansionModel }) {
  const [ac, ad, bc, bd] = model.products;
  return <div className="exp430-area">
    <span /><b>{term(model.right.x, "x")}</b><b>{signed(model.right.constant)}</b>
    <b>{term(model.left.x, "x")}</b><i>{term(ac, "x²")}</i><i>{term(ad, "x")}</i>
    <b>{signed(model.left.constant)}</b><i>{term(bc, "x")}</i><i>{signed(bd)}</i>
  </div>;
}

function ExpansionStages({ model, view, stage, collected, onCollect }: { model: ExpansionModel; view: "tiles" | "symbolic"; stage: number; collected: number[]; onCollect: (index: number) => void }) {
  const [ac, ad, bc, bd] = model.products, [a, b, c] = model.coefficients;
  return <div className={`exp430-stages ${view} stage-${stage}`}>
    <section><h3>Step 1: Distribute <span>(create product tiles)</span></h3><div>{view === "tiles" ? <>{[term(ac, "x²"), term(ad, "x"), term(bc, "x"), signed(bd)].map((label, index) => <ProductTile key={`${index}-${label}`} index={index} label={label} collected={collected.includes(index)} onCollect={onCollect} />)}</> : <strong>{term(ac, "x²")} + {term(ad, "x")} + {term(bc, "x")} + {signed(bd)}</strong>}</div></section>
    <section><h3>Step 2: Collect like terms</h3><div className={collected.length === 4 ? "complete" : "collecting"} data-lesson-control="expand-collect-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const index = Number(event.dataTransfer.getData("text/plain")); if (Number.isInteger(index) && index >= 0 && index < 4) onCollect(index); }}>{view === "tiles" ? <><i>{term(a, "x²")}</i><i>{term(b, "x")}</i><i>{signed(c)}</i></> : <strong>{term(a, "x²")} + ({ad} + {bc})x + {signed(c)}</strong>}</div></section>
    <section><h3>Step 3: Final result</h3><output><Polynomial coefficients={model.coefficients} /><span><CheckCircle2 /> Correct</span></output></section>
  </div>;
}

function ProductTile({ index, label, collected, onCollect }: { index: number; label: string; collected: boolean; onCollect: (index: number) => void }) {
  const start = (event: DragEvent<HTMLElement>) => event.dataTransfer.setData("text/plain", String(index));
  const key = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onCollect(index);
    }
  };
  return <i draggable data-lesson-control={`expand-product-${index}`} data-collected={collected} className={collected ? "collected" : ""} role="button" tabIndex={0} aria-label={`Collect product ${label}`} onDragStart={start} onClick={() => onCollect(index)} onKeyDown={key}>{label}</i>;
}

function Polynomial({ coefficients: [a, b, c] }: { coefficients: [number, number, number] }) {
  return <strong className="exp430-polynomial">{term(a, "x")}<sup>2</sup> {operator(b)} {Math.abs(b) === 1 ? "" : Math.abs(b)}x {operator(c)} {Math.abs(c)}</strong>;
}

function parseExpansion(value: string): ExpansionModel {
  const cleaned = value.replaceAll(" ", "").replaceAll("−", "-").replaceAll("·", "*");
  const match = cleaned.match(/^\(([^()]+)\)\*?\(([^()]+)\)$/);
  const invalid: ExpansionModel = { valid: false, left: { x: 0, constant: 0, label: "(?)" }, right: { x: 0, constant: 0, label: "(?)" }, products: [0, 0, 0, 0], coefficients: [0, 0, 0], expanded: "Invalid expression" };
  if (!match) return invalid;
  const left = parseBinomial(match[1]), right = parseBinomial(match[2]);
  if (!left || !right) return invalid;
  const products: [number, number, number, number] = [left.x * right.x, left.x * right.constant, left.constant * right.x, left.constant * right.constant];
  const coefficients: [number, number, number] = [products[0], products[1] + products[2], products[3]];
  return { valid: true, left, right, products, coefficients, expanded: polynomialText(coefficients) };
}

function parseBinomial(value: string): Binomial | null {
  const match = value.match(/^([+-]?\d*)\*?x([+-]\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const x = match[1] === "" || match[1] === "+" ? 1 : match[1] === "-" ? -1 : Number(match[1]);
  const constant = Number(match[2]);
  if (!Number.isFinite(x) || !Number.isFinite(constant)) return null;
  return { x, constant, label: `(${term(x, "x")}${constant >= 0 ? "+" : ""}${constant})` };
}
function term(coefficient: number, variable: string) { return `${coefficient === 1 ? "" : coefficient === -1 ? "-" : coefficient}${variable}`; }
function signed(value: number) { return value >= 0 ? `+${value}` : `${value}`; }
function operator(value: number) { return value < 0 ? "-" : "+"; }
function polynomialText([a, b, c]: [number, number, number]) { return `${term(a, "x^2")} ${operator(b)} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x ${operator(c)} ${Math.abs(c)}`; }
function normalizePolynomial(value: string) { return value.replaceAll(" ", "").replaceAll("*", "").replaceAll("²", "^2").replaceAll("−", "-").toLowerCase(); }
