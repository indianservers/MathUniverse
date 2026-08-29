import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Lightbulb,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./MatrixOperationsTargetLesson444.css";

type Matrix = [number, number, number, number];
type Point = [number, number];
const defaults: Matrix = [2, 3, -1, 4];
const challenges: Matrix[] = [
  [1, 2, -2, 1],
  [2, -1, 1, 3],
  [0, 2, -1, 1],
];

export default function MatrixOperationsTargetLesson444({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [matrix, setMatrix] = useState<Matrix>(defaults),
    [activeTab, setActiveTab] = useState("Interaction + visualization"),
    [view, setView] = useState<"graph" | "table">("graph"),
    [challengeIndex, setChallengeIndex] = useState(0),
    [challengeMatrix, setChallengeMatrix] = useState<Matrix>(challenges[0]),
    [answer, setAnswer] = useState<[string, string]>(["5", "0"]),
    [feedback, setFeedback] = useState<"" | "correct" | "incorrect">(
      "correct",
    ),
    [actions, setActions] = useState(0);
  const model = useMemo(() => matrixModel(matrix), [matrix]),
    challengeResult = multiply(challengeMatrix, [1, 2]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  useEffect(() => {
    setMatrix(defaults);
    setActiveTab("Interaction + visualization");
    setView("graph");
    setChallengeIndex(0);
    setChallengeMatrix(challenges[0]);
    setAnswer(["5", "0"]);
    setFeedback("correct");
    setActions(0);
  }, [resetToken]);
  const setEntry = (index: number, value: string) =>
    act(() =>
      setMatrix((current) =>
        current.map((entry, position) =>
          position === index ? finite(value) : entry,
        ) as Matrix,
      ),
    );
  return (
    <section
      className="mo444-page"
      data-testid="symbolic-cas-mockup-0350"
      data-dedicated-lesson="444"
      data-object-model="editable-2x2-matrix-row-rules-unit-square-transformation-vertices-determinant-practice"
      data-matrix={matrix.join(",")}
      data-determinant={model.determinant}
      data-orientation={model.orientation}
      data-feedback={feedback}
      data-challenge={challengeMatrix.join(",")}
      data-answer={answer.join(",")}
      data-active-tab={activeTab}
      data-view={view}
      data-actions={actions}
    >
      <h2 className="sr-only">Matrix Operations</h2>
      <nav className="mo444-tabs">
        {[
          ["Interaction + visualization", "workspace", <Eye key="eye" />],
          ["Explain", "formula", "▣"],
          ["Examples", "worked", <Lightbulb key="bulb" />],
          ["Formulas", "formula", "Σ"],
          ["Know more", "misconception", <Sparkles key="sparkles" />],
        ].map(([label, target, icon]) => (
          <button
            key={String(label)}
            className={activeTab === label ? "active" : ""}
            data-lesson-control={`matrix-tab-${String(label).toLowerCase().replaceAll(" ", "-")}`}
            onClick={() =>
              act(() => {
                setActiveTab(String(label));
                document.getElementById(`mo444-${target}`)?.scrollIntoView({ block: "center" });
              })
            }
          >{icon} {label}</button>
        ))}
      </nav>
      <div className="mo444-flow">
        {[
          ["1", "Observe", "See how the matrix transforms the shape."],
          ["2", "Manipulate", "Edit the matrix entries. Rows control highlights."],
          ["3", "Notice", "Watch each row control a new coordinate."],
          ["4", "Understand", "Link entries → rule → transformation."],
        ].map(([number, title, text]) => (
          <article key={number}>
            <b>{number} {title}</b><p>{text}</p>
          </article>
        ))}
      </div>
      <section className="mo444-workspace" id="mo444-workspace">
        <header>
          <b>CAS Workspace</b> — Edit matrix and see the transformation
          <select aria-label="Workspace view" data-lesson-control="matrix-view" value={view} onChange={(event) => act(() => setView(event.target.value as "graph" | "table"))}><option value="graph">2D view</option><option value="table">Coordinate table</option></select>
        </header>
        <div className="mo444-lab">
          <aside>
            <h3>Input Matrix A (2×2)</h3>
            <div className="mo444-column-head"><b>Col 1</b><b>Col 2</b></div>
            <div className="mo444-matrix-grid">
              <span>Row 1</span>
              {matrix.slice(0, 2).map((value, index) => (
                <input key={index} aria-label={`Matrix entry ${index + 1}`} data-lesson-control={`matrix-entry-${index + 1}`} type="number" value={value} onChange={(event) => setEntry(index, event.target.value)} />
              ))}
              <span>Row 2</span>
              {matrix.slice(2).map((value, index) => (
                <input key={index} aria-label={`Matrix entry ${index + 3}`} data-lesson-control={`matrix-entry-${index + 3}`} type="number" value={value} onChange={(event) => setEntry(index + 2, event.target.value)} />
              ))}
            </div>
            <output className="mo444-matrix">A = [ {matrix[0]} &nbsp; {matrix[1]} ; &nbsp; {matrix[2]} &nbsp; {matrix[3]} ]</output>
            <article className="mo444-rule">
              <b>Rule (from rows)</b>
              <p>x′ = <mark>{term(matrix[0], "x")}</mark> + <mark>{term(matrix[1], "y")}</mark></p>
              <p>y′ = <mark>{term(matrix[2], "x")}</mark> + <mark>{term(matrix[3], "y")}</mark></p>
            </article>
            <article className="mo444-vector"><b>Transform a vector</b><p>v = [x,y] → v′ = A v = [x′,y′]</p></article>
          </aside>
          <main>
            <h3>Geometric transformation of unit square</h3>
            {view === "graph" ? <MatrixGraph model={model} /> : <VertexTable model={model} />}
            <div className="mo444-legend"><span>Original unit square</span><span>Transformed by A</span></div>
            <p><b>Vertices mapping:</b> (0,0) → A′{formatPoint(model.vertices[0])}, (1,0) → B′{formatPoint(model.vertices[1])}, (1,1) → C′{formatPoint(model.vertices[2])}, (0,1) → D′{formatPoint(model.vertices[3])}</p>
          </main>
        </div>
        <p className="mo444-caption">Editing A updates both the algebraic rule and the geometric transformation instantly.</p>
      </section>
      <div className="mo444-learning">
        <article id="mo444-formula"><h3>Formula / Rule</h3><p>For A = [a b; c d] and v = [x,y],</p><strong>x′ = ax + by<br />y′ = cx + dy</strong><p>So, v′ = A v.</p></article>
        <article id="mo444-worked"><h3>Worked Example</h3><strong>A = [ {matrix[0]} {matrix[1]}; {matrix[2]} {matrix[3]} ]</strong>{([[1, 0], [1, 1], [0, 1], [0, 0]] as Point[]).map((point) => <p key={point.join(",")}>• {formatPoint(point)} → {formatPoint(multiply(matrix, point))}</p>)}</article>
        <article className="misconception" id="mo444-misconception"><h3><AlertTriangle /> Common Misconception</h3><p>Do not multiply columns by x and y separately.</p><p className="wrong">× Wrong: [ax, by; cx, dy]</p><p className="right"><Check /> Right: [ax + by; cx + dy]</p><b>Matrix-vector multiplication combines entries from the same row.</b></article>
      </div>
      <section className="mo444-practice">
        <div><h3>Quick Practice</h3><p>Edit the matrix and identify the image of (1,2).</p><small>Your rule: x′={term(challengeMatrix[0], "x")}+{term(challengeMatrix[1], "y")}, y′={term(challengeMatrix[2], "x")}+{term(challengeMatrix[3], "y")}</small></div>
        <div className="practice-matrix">{challengeMatrix.map((value, index) => <input key={index} aria-label={`Practice matrix entry ${index + 1}`} type="number" value={value} onChange={(event) => act(() => { const next = [...challengeMatrix] as Matrix; next[index] = finite(event.target.value); setChallengeMatrix(next); setFeedback(""); })} />)}</div>
        <b>→ A(1,2) =</b>
        <div className="practice-answer"><input aria-label="Practice x coordinate" value={answer[0]} onChange={(event) => { setAnswer([event.target.value, answer[1]]); setFeedback(""); }} /><input aria-label="Practice y coordinate" value={answer[1]} onChange={(event) => { setAnswer([answer[0], event.target.value]); setFeedback(""); }} /><button data-lesson-control="matrix-check" onClick={() => act(() => setFeedback(Number(answer[0]) === challengeResult[0] && Number(answer[1]) === challengeResult[1] ? "correct" : "incorrect"))}>Check</button><output className={feedback}>{feedback === "correct" ? "Correct!" : feedback === "incorrect" ? "Try again" : ""}</output></div>
        <button className="new-challenge" data-lesson-control="matrix-new-challenge" onClick={() => act(() => { const next = (challengeIndex + 1) % challenges.length; setChallengeIndex(next); setChallengeMatrix(challenges[next]); const result = multiply(challenges[next], [1, 2]); setAnswer([String(result[0]), String(result[1])]); setFeedback(""); })}><RefreshCcw /> New Challenge<small>Try another matrix</small></button>
      </section>
      <nav className="mo444-nav"><a href="/lessons/symbolic-mathematics/443-differential-equations"><ArrowLeft /><span><small>Previous</small>Differential Equations</span></a><a href="/lessons/symbolic-mathematics/445-complex-calculations"><span><small>Next</small>Complex Calculations</span><ArrowRight /></a></nav>
    </section>
  );
}

function matrixModel(matrix: Matrix) {
  const vertices = ([[0, 0], [1, 0], [1, 1], [0, 1]] as Point[]).map((point) => multiply(matrix, point));
  const determinant = matrix[0] * matrix[3] - matrix[1] * matrix[2];
  return { matrix, vertices, determinant, orientation: determinant > 0 ? "orientation preserved" : determinant < 0 ? "orientation reversed" : "collapsed dimension" };
}
function multiply(matrix: Matrix, [x, y]: Point): Point { return [matrix[0] * x + matrix[1] * y, matrix[2] * x + matrix[3] * y]; }
function MatrixGraph({ model }: { model: ReturnType<typeof matrixModel> }) {
  const sx = (x: number) => 165 + x * 43, sy = (y: number) => 225 - y * 43;
  const transformed = model.vertices.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ");
  const original = ([[0, 0], [1, 0], [1, 1], [0, 1]] as Point[]).map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ");
  return <svg viewBox="0 0 520 390" role="img" aria-label="Unit square transformed by the editable matrix">
    <g stroke="#e8edf4">{Array.from({ length: 13 }, (_, index) => <line key={`v${index}`} x1={36 + index * 43} x2={36 + index * 43} y1="25" y2="355" />)}{Array.from({ length: 9 }, (_, index) => <line key={`h${index}`} x1="35" x2="505" y1={10 + index * 43} y2={10 + index * 43} />)}</g>
    <line x1="35" x2="505" y1={sy(0)} y2={sy(0)} stroke="#64748b" /><line x1={sx(0)} x2={sx(0)} y1="20" y2="360" stroke="#64748b" />
    <polygon points={original} fill="#94a3b822" stroke="#64748b" strokeDasharray="5 4" /><polygon points={transformed} fill="#7c3aed22" stroke="#6d28d9" strokeWidth="2" />
    {model.vertices.map((point, index) => <g key={index}><circle cx={sx(point[0])} cy={sy(point[1])} r="4" fill="#6d28d9" /><text x={sx(point[0]) + 7} y={sy(point[1]) + (index === 2 ? -8 : 16)} fill="#5b21b6" fontSize="11" fontWeight="700">{String.fromCharCode(65 + index)}′{formatPoint(point)}</text></g>)}
    {([[0, 0], [1, 0], [1, 1], [0, 1]] as Point[]).map((point, index) => <text key={index} x={sx(point[0]) + 5} y={sy(point[1]) - 7} fill="#475569" fontSize="10">{formatPoint(point)}</text>)}
    <text x="500" y={sy(0) - 8}>x</text><text x={sx(0) + 8} y="22">y</text>
  </svg>;
}
function VertexTable({ model }: { model: ReturnType<typeof matrixModel> }) {
  const source: Point[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
  return <div className="mo444-coordinate-table"><table><thead><tr><th>Vertex</th><th>Original</th><th>Transformed by A</th></tr></thead><tbody>{source.map((point, index) => <tr key={index}><th>{String.fromCharCode(65 + index)} → {String.fromCharCode(65 + index)}′</th><td>{formatPoint(point)}</td><td>{formatPoint(model.vertices[index])}</td></tr>)}</tbody></table><p>det(A) = {model.determinant}; {model.orientation}; area scale {Math.abs(model.determinant)}.</p></div>;
}
function term(value: number, variable: string) { return `${value}${variable}`; }
function formatPoint(point: Point) { return `(${point[0]},${point[1]})`; }
function finite(value: string) { const result = Number(value); return Number.isFinite(result) ? result : 0; }
