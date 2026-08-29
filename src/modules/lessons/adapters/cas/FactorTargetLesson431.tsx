import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  Expand,
  Hand,
  Lightbulb,
  Pencil,
  Shuffle,
} from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type KeyboardEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./FactorTargetLesson431.css";

type FactorModel = {
  valid: boolean;
  b: number;
  c: number;
  m: number;
  n: number;
  roots: [number, number];
  factors: string;
};

const INITIAL = "x^2-x-6";
const RANDOM = ["x^2+7x+12", "x^2-9", "x^2-5x+6", "x^2+x-12"];

export default function FactorTargetLesson431({ resetToken, onInteraction }: LessonAdapterProps) {
  const [expression, setExpression] = useState(INITIAL);
  const [factored, setFactored] = useState(true);
  const [rootsVisible, setRootsVisible] = useState(true);
  const [arranged, setArranged] = useState<number[]>([0, 1, 2, 3]);
  const [leftAnswer, setLeftAnswer] = useState("");
  const [rightAnswer, setRightAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const [solution, setSolution] = useState(false);
  const [actions, setActions] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [randomIndex, setRandomIndex] = useState(0);
  const model = useMemo(() => factorQuadratic(expression), [expression]);

  useEffect(() => {
    setExpression(INITIAL);
    setFactored(true);
    setRootsVisible(true);
    setArranged([0, 1, 2, 3]);
    setLeftAnswer("");
    setRightAnswer("");
    setFeedback("idle");
    setSolution(false);
    setActions(0);
    setFullscreen(false);
    setRandomIndex(0);
  }, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const arrange = (index: number) => act(() => setArranged((current) => current.includes(index) ? current : [...current, index].sort()));
  const factor = () => act(() => { setFactored(true); setRootsVisible(true); setArranged([0, 1, 2, 3]); });
  const clear = () => act(() => { setExpression(""); setFactored(false); setRootsVisible(false); setArranged([]); });
  const random = () => act(() => {
    const next = (randomIndex + 1) % RANDOM.length;
    setRandomIndex(next);
    setExpression(RANDOM[next]);
    setFactored(true);
    setRootsVisible(true);
    setArranged([0, 1, 2, 3]);
  });
  const checkChallenge = () => act(() => {
    const values = [Number(leftAnswer), Number(rightAnswer)].sort((a, b) => a - b);
    setFeedback(values[0] === 2 && values[1] === 3 ? "correct" : "incorrect");
  });

  return <section
    className={`fac431-page${fullscreen ? " fullscreen" : ""}`}
    data-testid="symbolic-cas-mockup-0337"
    data-dedicated-lesson="431"
    data-object-model="monic-quadratic-factor-pair-roots-area-tiles-challenge"
    data-expression={expression}
    data-valid={model.valid}
    data-coefficients={`1,${model.b},${model.c}`}
    data-factor-pair={`${model.m},${model.n}`}
    data-roots={model.roots.join(",")}
    data-factors={model.factors}
    data-factored={factored}
    data-roots-visible={rootsVisible}
    data-arranged={arranged.join(",")}
    data-feedback={feedback}
    data-actions={actions}
  >
    <section className="fac431-flow">
      {[
        [Eye, "1", "OBSERVE", "See the expression as algebra tiles and in factor form."],
        [Hand, "2", "MANIPULATE", "Change terms, drag tiles, or factor using roots."],
        [Lightbulb, "3", "NOTICE", "How the tiles group into binomials using patterns or roots."],
        [CheckCircle2, "4", "UNDERSTAND", "The product of the factors rebuilds the original expression."],
      ].map(([Icon, number, title, text]) => <article key={String(number)}><i>{String(number)}</i><Icon /><h3>{String(title)}</h3><p>{String(text)}</p></article>)}
    </section>

    <section className="fac431-work">
      <header><h2>Work directly on the model</h2><div><b>{actions ? "Interactive" : "Awaiting interaction"}</b><span>{actions} actions</span><button type="button" data-lesson-control="factor-fullscreen" aria-label="Toggle factor workspace fullscreen" onClick={() => act(() => setFullscreen((value) => !value))}><Expand /></button></div></header>
      <div className="fac431-engine"><h2>Factor - dedicated CAS model</h2><select data-lesson-control="factor-mode" aria-label="Factor operation"><option>Factor</option><option>Find roots</option></select></div>
      <div className="fac431-grid">
        <article className="fac431-visual">
          <label>Expression<span><input data-lesson-control="factor-expression" aria-label="Quadratic expression" value={expression} onChange={(event) => act(() => { setExpression(event.target.value); setFactored(false); setRootsVisible(false); setArranged([]); })}/><Pencil /></span></label>
          <h3>Algebra tiles model</h3>
          <AreaTiles model={model} arranged={arranged} onArrange={arrange} />
          <div className="fac431-legend"><span />x^2 <span />{signedTerm(model.n, "x")} <span />{signedTerm(model.m, "x")} <span />{signed(model.c)}</div>
        </article>
        <article className="fac431-pipeline">
          <section><h2>Roots (zeros)</h2><p>Solve {polynomial(model.b, model.c)} = 0</p><div><strong>x1 = <em>{rootsVisible && model.valid ? model.roots[0] : "?"}</em></strong><strong>x2 = <em>{rootsVisible && model.valid ? model.roots[1] : "?"}</em></strong></div></section>
          <ArrowRight />
          <section className="fac431-drop" data-lesson-control="factor-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const index = Number(event.dataTransfer.getData("text/plain")); if (Number.isInteger(index)) arrange(index); }}><h2>Factor form</h2><p>(x - x1)(x - x2)</p><output>{factored && model.valid ? model.factors : "Arrange tiles or select Factor"}</output></section>
          <ArrowRight />
          <section><h2>Multiply back (check)</h2><p>{model.factors} = {polynomial(model.b, model.c)}</p><strong><Check /> Matches the original expression.</strong></section>
        </article>
        <aside className="fac431-help">
          <section><h2>How it works</h2>{["Find two numbers whose product is c and sum is b.", "Write the binomials using those numbers.", "Multiply to verify."].map((text, index) => <p key={text}><i>{index + 1}</i>{text}</p>)}</section>
          <section><h2>Rule</h2><p>For ax^2 + bx + c<br/>a = 1</p><p>Factor as (x + m)(x + n)<br/>where m + n = b and mn = c.</p></section>
          <section><h2><AlertTriangle /> Common pitfall</h2><p>Forgetting the signs. Numbers must satisfy both the sum and product conditions.</p><small>Example: x^2 + x - 6 != (x + 3)(x + 2)</small></section>
        </aside>
      </div>
      <div className="fac431-tools"><b>Quick tools</b><button type="button" data-lesson-control="factor-run" onClick={factor}>Factor</button><button type="button" data-lesson-control="factor-roots" onClick={() => act(() => setRootsVisible(true))}>Find roots</button><button type="button" data-lesson-control="factor-clear" onClick={clear}>Clear</button><button type="button" data-lesson-control="factor-random" onClick={random}><Shuffle /> Random example</button></div>
    </section>

    <section className="fac431-practice">
      <header><h2>Your turn: Try it</h2><span>Compact challenge</span></header>
      <div><label>Factor the expression.<strong>x^2 + 5x + 6</strong></label><ArrowRight /><label>Your answer<span>(x + <input data-lesson-control="factor-answer-left" aria-label="First factor constant" type="number" value={leftAnswer} onChange={(event) => { setLeftAnswer(event.target.value); setFeedback("idle"); }}/>) (x + <input data-lesson-control="factor-answer-right" aria-label="Second factor constant" type="number" value={rightAnswer} onChange={(event) => { setRightAnswer(event.target.value); setFeedback("idle"); }}/>)</span><span><button type="button" data-lesson-control="factor-check" onClick={checkChallenge}>Check</button><button type="button" data-lesson-control="factor-solution" onClick={() => act(() => setSolution((value) => !value))}>{solution ? "Hide solution" : "Show solution"}</button></span></label><aside><b>Hint</b><p>Find two numbers whose sum is 5 and product is 6.</p>{solution && <strong>(x + 2)(x + 3)</strong>}{feedback !== "idle" && <em className={feedback}>{feedback === "correct" ? "Correct factor pair." : "Check both sum and product."}</em>}</aside></div>
    </section>
    <nav className="fac431-nav" aria-label="Adjacent lessons"><a href="/lessons/symbolic-mathematics/430-expand"><ArrowLeft/><span><small>Previous</small>Expand</span></a><a href="/lessons/symbolic-mathematics/432-substitute"><span><small>Next</small>Substitute</span><ArrowRight/></a></nav>
  </section>;
}

function AreaTiles({ model, arranged, onArrange }: { model: FactorModel; arranged: number[]; onArrange: (index: number) => void }) {
  const labels = ["x²", signedTerm(model.n, "x"), signedTerm(model.m, "x"), signed(model.c)];
  return <div className="fac431-area"><b>x</b><b>{signed(model.m)}</b><b>x</b>{labels.map((label, index) => <Tile key={`${index}-${label}`} index={index} label={label} arranged={arranged.includes(index)} onArrange={onArrange}/>)}</div>;
}
function Tile({ index, label, arranged, onArrange }: { index: number; label: string; arranged: boolean; onArrange: (index: number) => void }) {
  const key = (event: KeyboardEvent<HTMLElement>) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onArrange(index); } };
  const drag = (event: DragEvent<HTMLElement>) => event.dataTransfer.setData("text/plain", String(index));
  return <i draggable role="button" tabIndex={0} aria-label={`Arrange ${label} tile`} data-lesson-control={`factor-tile-${index}`} data-arranged={arranged} className={arranged ? "arranged" : ""} onDragStart={drag} onClick={() => onArrange(index)} onKeyDown={key}>{label}</i>;
}

function factorQuadratic(value: string): FactorModel {
  const source = value.replaceAll(" ", "").replaceAll("²", "^2").replaceAll("−", "-");
  const match = source.match(/^x\^2(?:(\+|-)\s*(\d*)x)?(?:(\+|-)\s*(\d+))$/);
  if (!match) return { valid: false, b: 0, c: 0, m: 0, n: 0, roots: [0, 0], factors: "Invalid expression" };
  const b = match[1] ? (match[1] === "-" ? -1 : 1) * Number(match[2] || 1) : 0;
  const c = (match[3] === "-" ? -1 : 1) * Number(match[4]);
  let m = 0, n = 0, found = false;
  for (let candidate = -Math.abs(c) - 1; candidate <= Math.abs(c) + 1; candidate += 1) if (candidate && c % candidate === 0 && candidate + c / candidate === b) { m = candidate; n = c / candidate; found = true; break; }
  if (!found) return { valid: false, b, c, m: 0, n: 0, roots: [0, 0], factors: "No integer factor pair" };
  [m, n] = [m, n].sort((left, right) => right - left);
  const roots: [number, number] = [-m, -n];
  return { valid: true, b, c, m, n, roots, factors: `${binomial(m)}${binomial(n)}` };
}
function binomial(value: number) { return `(x ${value < 0 ? "-" : "+"} ${Math.abs(value)})`; }
function polynomial(b: number, c: number) { return `x^2 ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x ${c < 0 ? "-" : "+"} ${Math.abs(c)}`; }
function signed(value: number) { return `${value >= 0 ? "+" : "-"}${Math.abs(value)}`; }
function signedTerm(value: number, variable: string) { return `${value >= 0 ? "+" : "-"}${Math.abs(value) === 1 ? "" : Math.abs(value)}${variable}`; }
