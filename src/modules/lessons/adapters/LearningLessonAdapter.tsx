import { useEffect, useState } from "react";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const activitySteps = ["Predict", "Test", "Explain"] as const;

export default function LearningLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  if (isRedesignedLearningPageLesson(lesson.id)) {
    return <RedesignedLearningPageLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  return <LegacyLearningLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
}

function LegacyLearningLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<"increase" | "decrease" | "same" | null>(null);
  const [value, setValue] = useState(2);
  useEffect(() => { setStep(0); setChoice(null); setValue(2); }, [lesson.id, resetToken]);
  const advance = () => { setStep((current) => Math.min(2, current + 1)); setValue((current) => current + 2); onInteraction(); };

  return (
    <AdapterFrame title={`${lesson.title} learning flow`} value={activitySteps[step]} footer="The existing authoring and assessment model is presented one compact step at a time.">
      <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="grid grid-cols-3 gap-2 lg:grid-cols-1" aria-label="Activity steps">{activitySteps.map((item, index) => <button key={item} type="button" disabled={index > step} onClick={() => setStep(index)} className={index === step ? "min-h-11 rounded-xl bg-cyan-500 px-3 py-2 text-sm font-black text-white" : "min-h-11 rounded-xl bg-slate-100 px-3 py-2 text-sm font-black disabled:opacity-40 dark:bg-white/10"}>{index + 1}. {item}</button>)}</nav>
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-5 rounded-xl bg-slate-50 p-5 dark:bg-slate-900">
          {step === 0 ? <><p className="max-w-lg text-center text-lg font-black">If the input doubles, what happens to y = 3x?</p><div className="flex flex-wrap justify-center gap-2">{(["increase", "decrease", "same"] as const).map((item) => <button key={item} type="button" className={choice === item ? "action-primary" : "action-secondary"} onClick={() => { setChoice(item); onInteraction(); }}>{item}</button>)}</div></> : null}
          {step >= 1 ? <div className="w-full max-w-lg space-y-4"><div className="grid grid-cols-2 gap-3 text-center"><ValueCard label="x" value={value} /><ValueCard label="y = 3x" value={value * 3} /></div><input aria-label="Test input value" type="range" min="1" max="10" value={value} onChange={(event) => { setValue(Number(event.target.value)); onInteraction(); }} className="w-full accent-cyan-500" /></div> : null}
          {step === 2 ? <p className="rounded-xl bg-emerald-100 px-4 py-3 text-center font-bold text-emerald-900">The output changes at three times the input rate. Compare this with your prediction.</p> : null}
          {step < 2 ? <button type="button" className="action-primary" disabled={step === 0 && !choice} onClick={advance}>Record and continue</button> : null}
        </div>
      </div>
    </AdapterFrame>
  );
}

function isRedesignedLearningPageLesson(lessonId: number) {
  return (lessonId >= 640 && lessonId <= 648) || lessonId === 650 || lessonId === 651 || (lessonId >= 653 && lessonId <= 656);
}

type LearningPageSpec = {
  title: string;
  value: string;
  purpose: string;
  prompt: string;
  focus: string;
  left: string[];
  right: string[];
  footer: string;
  visual: "line" | "parabola" | "balance" | "construction" | "cards" | "exit" | "revision";
};

function learningPageSpecFor(lessonId: number): LearningPageSpec {
  const specs: Record<number, LearningPageSpec> = {
    640: { title: "Concept Introduction", value: "Direct variation", purpose: "Introduce definitions and notation.", prompt: "y = 3x", focus: "When x doubles, y doubles", left: ["x = 2", "y = 6", "x = 4", "y = 12"], right: ["Predict", "Test", "Explain"], footer: "The first model connects the table, graph, and notation before practice begins.", visual: "line" },
    641: { title: "Visualise", value: "y = 2x + 1", purpose: "Build conceptual understanding with linked representations.", prompt: "x = 3", focus: "y = 7", left: ["pattern tiles", "input-output machine", "table", "graph"], right: ["All views update together", "Representation link confirmed"], footer: "Pattern, machine, table, and graph highlight the same selected input.", visual: "line" },
    642: { title: "Manipulative Laboratory", value: "x = 4", purpose: "Learn by changing objects.", prompt: "2x + 3 = 11", focus: "Balance preserved", left: ["blue x tiles", "yellow unit tiles", "Drag tiles"], right: ["remove 3 both sides", "2x = 8", "divide by 2", "x = 4"], footer: "Dragging tiles shows each inverse operation while keeping both sides equal.", visual: "balance" },
    643: { title: "Guided Exploration", value: "m = 1.5", purpose: "Direct discovery.", prompt: "y = 1.5x + 1", focus: "Steeper lines have larger |m|", left: ["m=-1", "m=0.5", "m=2", "drag slope"], right: ["Notice", "Change", "Compare", "Conclude"], footer: "Ghost lines create evidence for the final conclusion.", visual: "line" },
    644: { title: "Predict-Test-Explain", value: "a = 2", purpose: "Develop reasoning.", prompt: "Prediction: curve gets narrower", focus: "Test: a = 2", left: ["y = ax²", "vertex remains (0,0)", "At x = 2, y = 8"], right: ["Evidence", "Explain", "My explanation"], footer: "The prediction stays visible while the tested curve updates.", visual: "parabola" },
    645: { title: "Worked Example", value: "roots confirmed", purpose: "Demonstrate complete solutions.", prompt: "x² - 5x + 6 = 0", focus: "(x - 2)(x - 3) = 0", left: ["factor tiles", "Product:6", "Sum:-5"], right: ["roots x=2 or x=3", "graph check", "intercepts", "Both roots confirmed"], footer: "Factoring, zero-product reasoning, and graph intercepts tell the same story.", visual: "parabola" },
    646: { title: "Step-by-Step Practice", value: "Correct step", purpose: "Scaffold procedures.", prompt: "3x - 4 = 11", focus: "x=5", left: ["Add 4", "3x=15", "Divide by 3"], right: ["3(5)-4=11", "correct step", "balance mini", "hints"], footer: "Each checked move unlocks the next algebra step.", visual: "balance" },
    647: { title: "Construction Challenge", value: "Construction valid", purpose: "Assess geometric competence.", prompt: "Construct the perpendicular bisector of AB", focus: "PQ ⟂ AB", left: ["segment AB", "compass arcs", "intersection P/Q", "midpoint M"], right: ["AM = MB", "right angle", "Construction valid"], footer: "Compass arcs locate P and Q, and line PQ verifies the bisector conditions.", visual: "construction" },
    648: { title: "Graph Matching", value: "1 of 3 matched", purpose: "Connect equations and representations.", prompt: "y=2x+1", focus: "correct match", left: ["y=-x+4", "y=x²-1", "drag to match"], right: ["1 of 3 matched", "use slope and intercept"], footer: "Learners match graphs by slope, intercept, shape, and table values.", visual: "line" },
    650: { title: "Multiple Representations", value: "All forms agree", purpose: "Connect mathematical forms.", prompt: "y = x + 2", focus: "selected x=3, y=5", left: ["Equation", "Table", "Mapping", "Graph", "Verbal rule"], right: ["x=3", "y=5", "connected", "All forms agree"], footer: "Equation, table, mapping, graph, and verbal rule stay synchronized.", visual: "line" },
    651: { title: "Real-World Application", value: "Choose Plan A", purpose: "Apply mathematics authentically.", prompt: "Plan A: C = 199 + 20g", focus: "Plan B: C = 99 + 35g", left: ["usage 8 GB", "break-even 6.67 GB"], right: ["recommend Choose Plan A", "compare total cost"], footer: "The recommendation follows from comparing total cost at the same usage.", visual: "line" },
    653: { title: "Dynamic Question Generator", value: "4 valid questions", purpose: "Provide repeated practice.", prompt: "a/b + c/d", focus: "2/3 + 3/4", left: ["common denominator 12", "answer 17/12 = 1 5/12", "simplified"], right: ["generate new", "4 valid questions"], footer: "The generator checks validity and simplification before releasing variants.", visual: "cards" },
    654: { title: "Mastery Challenge", value: "3/4", purpose: "Integrate related skills.", prompt: "Question 4", focus: "Explain y-intercept", left: ["linear functions checkpoint", "4 questions", "score 3/4"], right: ["confidence slider", "review mistake", "mastery almost there"], footer: "The checkpoint asks for answer, explanation, confidence, and review.", visual: "cards" },
    655: { title: "Exit Ticket", value: "Correct", purpose: "Check essential understanding.", prompt: "y = 2x + 1", focus: "When x = 5, y = 11", left: ["Quick check 1", "Quick check 2", "Explain one takeaway", "Confidence: Good"], right: ["Correct", "Evidence recorded", "Next: Practice intercepts"], footer: "The exit ticket records calculation, graph reading, explanation, and confidence evidence.", visual: "exit" },
    656: { title: "Revision Summary", value: "62%", purpose: "Consolidate key knowledge.", prompt: "Linear functions review", focus: "y = mx + b", left: ["Slope", "Intercept", "Table", "Graph", "Equation"], right: ["Weak spot: intercepts", "Revise next", "Mistake pattern", "Two revision cards"], footer: "The review map connects slope, intercept, table, graph, and equation before suggesting the next revision.", visual: "revision" },
  };
  return specs[lessonId] ?? specs[640];
}

function RedesignedLearningPageLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const spec = learningPageSpecFor(lesson.id);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(50);

  useEffect(() => { setStep(0); setProgress(50); }, [lesson.id, resetToken]);
  const recordStep = (next: number) => { setStep(next); setProgress(50 + next * 20); onInteraction(); };

  return (
    <AdapterFrame title={`${lesson.title} learning flow`} value={spec.value} footer={spec.footer}>
      <section className="grid gap-4 xl:grid-cols-[230px_minmax(0,1fr)_250px]" aria-label={`${lesson.title} redesigned learning page`}>
        <nav className="space-y-2 rounded-3xl border border-cyan-100 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10" aria-label="Activity steps">
          {(["Predict", "Test", "Explain"] as const).map((item, index) => (
            <button key={item} type="button" onClick={() => recordStep(index)} className={index === step ? "min-h-11 w-full rounded-2xl bg-cyan-600 px-3 py-2 text-sm font-black text-white" : "min-h-11 w-full rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-700 ring-1 ring-cyan-100 dark:bg-slate-950 dark:text-slate-100 dark:ring-white/10"}>{index + 1}. {item}</button>
          ))}
          <div className="pt-2">
            <label className="text-[10px] font-black uppercase text-cyan-700">Progress<input aria-label="Learning page progress" type="range" min="0" max="100" value={progress} onChange={(event) => { setProgress(Number(event.target.value)); onInteraction(); }} className="mt-2 w-full accent-cyan-600" /></label>
          </div>
          {spec.left.map((item, index) => <p key={`${item}-${index}`} className="rounded-2xl bg-white p-3 text-sm font-black text-slate-800 ring-1 ring-cyan-100 dark:bg-slate-950 dark:text-slate-100 dark:ring-white/10">{item}</p>)}
        </nav>

        <main className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-violet-50/70 p-4 shadow-sm dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-violet-300/10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-violet-700">Lesson and assessment page</p>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">{spec.title}</h2>
              <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">{spec.purpose}</p>
            </div>
            <span className="rounded-2xl bg-white px-3 py-2 text-sm font-black text-violet-800 shadow-sm ring-1 ring-violet-100">{activitySteps[step]}</span>
          </div>
          <div className="mt-4 rounded-3xl bg-slate-950 p-4 text-white">
            <p className="font-mono text-2xl font-black">{spec.prompt}</p>
            <p className="mt-2 rounded-2xl bg-white/10 p-3 font-mono text-xl font-black">{spec.focus}</p>
          </div>
          <div className="mt-4">{renderLearningPageVisual(spec)}</div>
        </main>

        <aside className="space-y-3">
          {spec.right.map((item, index) => <p key={`${item}-${index}`} className="rounded-3xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-black text-emerald-950">{item}</p>)}
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-900">Feedback compares learner evidence with the page goal before the next step.</div>
        </aside>
      </section>
    </AdapterFrame>
  );
}

function renderLearningPageVisual(spec: LearningPageSpec) {
  if (spec.visual === "parabola") {
    return (
      <svg viewBox="0 0 420 260" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label={`${spec.title} parabola view`}>
        <line x1="40" y1="218" x2="380" y2="218" stroke="#334155" strokeWidth="2" /><line x1="210" y1="30" x2="210" y2="236" stroke="#334155" strokeWidth="2" />
        <polyline points="92,60 132,130 172,190 210,218 248,190 288,130 328,60" fill="none" stroke="#a78bfa" strokeWidth="4" />
        <polyline points="118,32 150,122 184,190 210,218 236,190 270,122 302,32" fill="none" stroke="#0f766e" strokeWidth="6" />
        <text x="245" y="58" fill="#0f766e" fontWeight="900">{spec.focus}</text>
      </svg>
    );
  }
  if (spec.visual === "balance") {
    return (
      <svg viewBox="0 0 420 235" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label={`${spec.title} balance view`}>
        <line x1="210" y1="35" x2="210" y2="190" stroke="#334155" strokeWidth="5" /><line x1="78" y1="84" x2="342" y2="84" stroke="#334155" strokeWidth="5" />
        <path d="M62 98 h122 l-24 78 h-74zM236 98 h122 l-24 78 h-74z" fill="#e0f2fe" stroke="#0e7490" strokeWidth="4" />
        <text x="98" y="142" fontWeight="900">{spec.prompt}</text><text x="268" y="142" fill="#166534" fontWeight="900">{spec.focus}</text>
      </svg>
    );
  }
  if (spec.visual === "construction") {
    return (
      <svg viewBox="0 0 420 250" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label="Perpendicular bisector construction">
        <line x1="88" y1="150" x2="332" y2="150" stroke="#0f766e" strokeWidth="6" />
        <path d="M88 150 A96 96 0 0 1 210 56 M88 150 A96 96 0 0 0 210 236 M332 150 A96 96 0 0 0 210 56 M332 150 A96 96 0 0 1 210 236" fill="none" stroke="#7c3aed" strokeWidth="4" strokeDasharray="7 5" />
        <line x1="210" y1="48" x2="210" y2="236" stroke="#f59e0b" strokeWidth="5" />
        <text x="79" y="174" fontWeight="900">A</text><text x="337" y="174" fontWeight="900">B</text><text x="218" y="70" fontWeight="900">P</text><text x="218" y="230" fontWeight="900">Q</text><text x="175" y="143" fontWeight="900">M</text>
      </svg>
    );
  }
  if (spec.visual === "line") {
    return (
      <svg viewBox="0 0 420 260" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label={`${spec.title} line view`}>
        <line x1="40" y1="218" x2="380" y2="218" stroke="#334155" strokeWidth="2" /><line x1="210" y1="30" x2="210" y2="236" stroke="#334155" strokeWidth="2" />
        <line x1="85" y1="206" x2="330" y2="70" stroke="#7c3aed" strokeWidth="5" />
        <line x1="85" y1="110" x2="330" y2="200" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 6" />
        <circle cx="270" cy="104" r="12" fill="#f59e0b" />
        <text x="282" y="103" fontWeight="900">{spec.focus}</text>
      </svg>
    );
  }
  if (spec.visual === "exit") {
    return (
      <div className="grid gap-3 rounded-3xl bg-white p-4 ring-1 ring-slate-200 lg:grid-cols-[1fr_220px]">
        <div className="space-y-3">
          {["Calculate y", "Identify slope from graph", "Explain one takeaway"].map((task, index) => <div key={task} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200"><p className="text-xs font-black uppercase text-slate-500">Question {index + 1}</p><p className="font-black text-slate-900">{task}</p>{index === 0 ? <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 font-mono font-black text-emerald-900">When x = 5, y = 11 - Correct</p> : null}</div>)}
        </div>
        <svg viewBox="0 0 220 220" className="w-full rounded-2xl bg-slate-50 ring-1 ring-slate-200" role="img" aria-label="Exit ticket slope graph">
          <line x1="30" y1="180" x2="200" y2="180" stroke="#334155" strokeWidth="2" /><line x1="70" y1="20" x2="70" y2="200" stroke="#334155" strokeWidth="2" />
          <line x1="55" y1="162" x2="185" y2="32" stroke="#7c3aed" strokeWidth="5" />
          <circle cx="150" cy="68" r="9" fill="#14b8a6" /><text x="108" y="58" fontWeight="900">x=5, y=11</text>
        </svg>
      </div>
    );
  }
  if (spec.visual === "revision") {
    return (
      <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-200">
        <div className="grid place-items-center gap-3 md:grid-cols-[1fr_1fr_1fr]">
          {["Slope", "Table", "Graph", "Equation", "Intercept"].map((node, index) => <div key={node} className={node === "Intercept" ? "rounded-2xl bg-amber-50 p-4 text-center font-black text-amber-900 ring-2 ring-amber-300" : "rounded-2xl bg-emerald-50 p-4 text-center font-black text-emerald-900 ring-1 ring-emerald-100"}>{node}{index < 4 ? <span className="ml-2 text-violet-600">-&gt;</span> : null}</div>)}
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-3">{[["Slope", "88%"], ["Intercept", "62%"], ["Equation", "91%"]].map(([label, score]) => <div key={label} className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-black text-slate-500">{label}</p><div className="mt-2 h-3 rounded-full bg-slate-200"><div className={label === "Intercept" ? "h-full rounded-full bg-amber-400" : "h-full rounded-full bg-teal-500"} style={{ width: score }} /></div><p className="mt-1 font-mono font-black">{score}</p></div>)}</div>
      </div>
    );
  }
  return (
    <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200 md:grid-cols-3">
      {[spec.prompt, spec.focus, spec.footer].map((item, index) => <div key={`${item}-${index}`} className="rounded-2xl bg-white p-4 text-center font-mono font-black text-slate-900 ring-1 ring-slate-200">{item}</div>)}
    </div>
  );
}

function ValueCard({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-white/10"><span className="block text-xs font-black uppercase text-slate-500">{label}</span><strong className="mt-2 block font-mono text-3xl">{value}</strong></div>;
}
