import { useEffect, useState } from "react";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const activitySteps = ["Predict", "Test", "Explain"] as const;

export default function LearningLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
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

function ValueCard({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-white/10"><span className="block text-xs font-black uppercase text-slate-500">{label}</span><strong className="mt-2 block font-mono text-3xl">{value}</strong></div>;
}
