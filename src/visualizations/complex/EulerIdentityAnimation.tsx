import { useEffect, useState } from "react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";

const steps = [
  { title: "Start at 1", text: "Begin at the multiplicative identity on the real axis.", angle: 0, add: false },
  { title: "Multiply by e^(iπ)", text: "The factor e^(iπ) means rotate by π radians.", angle: Math.PI * 0.35, add: false },
  { title: "Rotate 180°", text: "A π-radian rotation is exactly 180 degrees.", angle: Math.PI * 0.75, add: false },
  { title: "Reach -1", text: "The rotation lands at -1.", angle: Math.PI, add: false },
  { title: "Add +1", text: "Move one unit right by adding 1.", angle: Math.PI, add: true },
  { title: "Reach 0", text: "The expression e^(iπ) + 1 equals 0.", angle: Math.PI, add: true, done: true },
];

export default function EulerIdentityAnimation() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setStep((value) => value >= steps.length - 1 ? 0 : value + 1), 1100);
    return () => window.clearInterval(id);
  }, [playing]);
  const current = steps[step];
  const x = Math.cos(current.angle);
  const y = Math.sin(current.angle);
  const px = 180 + x * 110;
  const py = 180 - y * 110;
  const finalX = current.done ? 180 : px;
  const finalY = current.done ? 180 : py;

  return (
    <SectionCard title="Euler's Identity Animation" description="Euler's Identity connects five fundamental constants: e, i, pi, 1, and 0.">
      <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
        <div className="space-y-4">
          <FormulaBlock title="Identity" formula={"e^{i\\pi}+1=0"} />
          <SliderControl label="Step" value={step + 1} min={1} max={steps.length} step={1} onChange={(value) => setStep(value - 1)} />
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-white dark:bg-white dark:text-slate-950" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play"}</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold dark:bg-white/10" onClick={() => { setPlaying(false); setStep(0); }}>Reset</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold dark:bg-white/10" onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold dark:bg-white/10" onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>Forward</button>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="font-bold">{current.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{current.text}</p>
            <p className="mt-3 font-mono text-sm">{step < 4 ? "e^(iπ)" : "e^(iπ) + 1"} {current.done ? "= 0" : ""}</p>
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">e represents natural growth, i the imaginary direction, pi circular rotation, 1 multiplicative identity, and 0 additive identity.</p>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/60">
          <svg viewBox="0 0 360 360" className="h-[360px] w-full">
            <circle cx="180" cy="180" r="110" fill="rgba(34,211,238,.08)" stroke="#06b6d4" strokeWidth="3" />
            <line x1="40" x2="320" y1="180" y2="180" stroke="#64748b" /><line x1="180" x2="180" y1="40" y2="320" stroke="#64748b" />
            <path d="M 290 180 A 110 110 0 0 0 70 180" fill="none" stroke="#f59e0b" strokeWidth="5" strokeDasharray={step < 2 ? "8 7" : "none"} />
            <line x1="180" y1="180" x2={px} y2={py} stroke="#22d3ee" strokeWidth="4" />
            {current.add && <line x1={px} y1={py} x2="180" y2="180" stroke="#a78bfa" strokeWidth="4" markerEnd="url(#identity-arrow)" />}
            <defs><marker id="identity-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#a78bfa" /></marker></defs>
            <circle cx="290" cy="180" r="7" fill="#22c55e" /><text x="296" y="172" fill="#22c55e">1</text>
            <circle cx="70" cy="180" r="7" fill="#f43f5e" /><text x="42" y="172" fill="#f43f5e">-1</text>
            <circle cx={finalX} cy={finalY} r="9" fill="#f59e0b" />
          </svg>
        </div>
      </div>
    </SectionCard>
  );
}
