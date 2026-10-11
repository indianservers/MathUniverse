import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import MathExpression from "../../components/ui/MathExpression";
import { LabSectionContext } from "../curriculum/FocusedLab";
import { complexLessons, complexPaths, type ComplexQuestion } from "./complexLearningContent";
import { markComplexComplete, useComplexSession } from "./complexStudioSession";

export function ComplexPractice({ questions, pageId }: { questions: ComplexQuestion[]; pageId?: string }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const [notice, setNotice] = useState("");
  const score = questions.filter((q, i) => answers[i] === q.correct).length;
  return <form className="complex-practice" onSubmit={e => {
    e.preventDefault();
    if (questions.some((_, i) => answers[i] === undefined)) { setNotice("Answer each question before checking."); return; }
    setChecked(true); setNotice(`${score} of ${questions.length} correct. ${score === questions.length ? "All checks passed. Explain the reasoning in your own words next." : "Review the explanations, revise your choices and check again."}`);
    if (pageId && score === questions.length) markComplexComplete(pageId);
  }}>
    {questions.map((q, i) => <fieldset key={q.prompt}><legend>{i + 1}. {q.prompt}</legend>{q.choices.map((choice, j) => <label key={choice}><input type="radio" name={`${pageId ?? "diagnostic"}-${i}`} value={j} checked={answers[i] === j} onChange={() => { setAnswers({ ...answers, [i]: j }); setChecked(false); setNotice(""); }} />{choice}</label>)}{checked && <p className={answers[i] === q.correct ? "is-correct" : "is-retry"}>{answers[i] === q.correct ? "Correct. " : `Review: ${q.choices[q.correct]}. `}{q.explanation}</p>}</fieldset>)}
    <button type="submit">Check understanding</button><p role="status">{notice}</p>
  </form>;
}

export default function ComplexLearningDepth({ pageId }: { pageId: string }) {
  const lesson = complexLessons[pageId];
  const active = useContext(LabSectionContext);
  if (!lesson) return null;
  const keys = Object.keys(complexLessons), index = keys.indexOf(pageId);
  return <div className="complex-learning-depth">
    <section className="complex-depth-panel" data-complex-owned data-lab-pane="meaning" hidden={!!active && active !== "meaning"}><small>LEARNING GOAL</small><h2>What it means · {lesson.title}</h2><p>{lesson.goal}</p><p><strong>Before you start:</strong> {lesson.prerequisite}.</p><p>{lesson.meaning}</p><MathExpression value={lesson.formula} display /><div className="complex-misconception"><strong>Watch for this misconception</strong><p>{lesson.misconception}</p></div></section>
    <section className="complex-depth-panel" data-complex-owned data-lab-pane="uses" hidden={!!active && active !== "uses"}><h2>Worked example & application</h2><ol>{lesson.example.map(step => <li key={step}>{step}</li>)}</ol><h3>Where this is useful</h3><p>{lesson.application}</p><h3>Investigate, record, explain</h3><ol>{lesson.investigation.map(step => <li key={step}>{step}</li>)}</ol><p>Write your prediction first. Record the input and observed result, then explain why they agree or differ.</p></section>
    <section className="complex-depth-panel" data-complex-owned data-lab-pane="quiz" hidden={!!active && active !== "quiz"}><h2>Quiz · {lesson.title}</h2><p>Three conceptual checks. Passing all three records this lab as completed on this device.</p><ComplexPractice key={pageId} questions={lesson.questions} pageId={pageId} /></section>
    <section className="complex-depth-panel" data-complex-owned data-lab-pane="more" hidden={!!active && active !== "more"}><h2>Derivation & connections</h2><MathExpression value={lesson.formula} display /><ol>{lesson.derivation.map(step => <li key={step}>{step}</li>)}</ol><h3>Explain it without the diagram</h3><p>{lesson.goal} Use a concrete example, an equation and a geometric explanation.</p><div className="complex-related">{index > 0 && <Link to={`/complex-numbers/${keys[index - 1]}`}>← Revisit {complexLessons[keys[index - 1]].title}</Link>}{index < keys.length - 1 && <Link to={`/complex-numbers/${keys[index + 1]}`}>Continue: {complexLessons[keys[index + 1]].title} →</Link>}<Link to="/complex-numbers">Choose another learning path</Link></div></section>
  </div>;
}

export function ComplexStudioDepth() {
  const session = useComplexSession();
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  return <section className="complex-studio-depth" aria-label="Complex numbers learning paths"><header><div><small>GO BEYOND THE DIAGRAM</small><h2>Choose a path. Make a prediction. Explain why.</h2><p>Each lab includes meaning, a derivation, a worked example, an investigation and three conceptual checks. Progress is saved on this device.</p></div><button type="button" aria-expanded={showDiagnostic} onClick={() => setShowDiagnostic(!showDiagnostic)}>Check my starting point</button></header>
    {showDiagnostic && <div className="complex-depth-panel"><h3>Foundation check</h3><ComplexPractice questions={[complexLessons["argand-plane"].questions[0], complexLessons.arithmetic.questions[0], complexLessons["polar-forms"].questions[1]]} /><p>Need coordinates? Start with foundations. Comfortable with all three? Try structure or applications.</p></div>}
    <div className="complex-path-grid">{complexPaths.map(path => <article key={path.title}><h3>{path.title}</h3><p>{path.description}</p><ol>{path.ids.map(id => <li key={id}><Link to={`/complex-numbers/${id}`}>{complexLessons[id].title}</Link><span>{session.completed.includes(id) ? "✓ Completed" : "Available"}</span></li>)}</ol></article>)}</div>
    <details className="complex-glossary"><summary>Quick reference · notation and conventions</summary><dl><div><dt>i (or j in engineering)</dt><dd>Imaginary unit, i² = −1.</dd></div><div><dt>Re z, Im z</dt><dd>Real coordinates a and b of z = a + bi.</dd></div><div><dt>|z|</dt><dd>Distance from the origin, √(a² + b²).</dd></div><div><dt>arg z</dt><dd>Direction modulo 2π; undefined at zero. A principal argument selects one interval.</dd></div><div><dt>Radians</dt><dd>One turn = 2π radians = 360°. Power series and angular frequency use radians.</dd></div><div><dt>Conjugate</dt><dd>Replace a + bi with a − bi; reflect across the real axis.</dd></div><div><dt>Phasor</dt><dd>Amplitude and phase of a sinusoid. Circuit examples use eⁱωᵗ and state RMS conventions.</dd></div></dl></details>
  </section>;
}
