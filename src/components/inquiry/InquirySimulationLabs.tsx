import { CheckCircle2, FlaskConical, Lightbulb, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import SectionCard from "../ui/SectionCard";
import SliderControl from "../ui/SliderControl";
import { roundTo } from "../../utils/math";

type InquiryLabId = "slope" | "area" | "circle" | "quadratic" | "similarity" | "sampling";

type InquiryLab = {
  id: InquiryLabId;
  title: string;
  question: string;
  variableLabel: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  predictionOptions: string[];
  correctPrediction: (value: number) => string;
  explanation: (value: number) => string;
  teacherPrompt: string;
};

const inquiryLabs: InquiryLab[] = [
  {
    id: "slope",
    title: "Ramp Slope Inquiry",
    question: "If the rise increases while run stays fixed, what happens to slope?",
    variableLabel: "Rise",
    min: 1,
    max: 10,
    step: 0.5,
    defaultValue: 4,
    predictionOptions: ["Slope increases", "Slope decreases", "Slope stays same"],
    correctPrediction: () => "Slope increases",
    explanation: (value) => `Slope = rise/run = ${roundTo(value, 2)}/6 = ${roundTo(value / 6, 3)}. More rise makes a steeper ramp.`,
    teacherPrompt: "Ask learners to justify the prediction before moving the slider.",
  },
  {
    id: "area",
    title: "Area Scaling Inquiry",
    question: "If a square side doubles, what happens to its area?",
    variableLabel: "Side length",
    min: 1,
    max: 10,
    step: 0.5,
    defaultValue: 4,
    unit: "u",
    predictionOptions: ["Area grows linearly", "Area grows quadratically", "Area stays same"],
    correctPrediction: () => "Area grows quadratically",
    explanation: (value) => `Area = side^2 = ${roundTo(value, 2)}^2 = ${roundTo(value * value, 2)}. Area grows by the square of the scale factor.`,
    teacherPrompt: "Have students count grid squares before reading the formula.",
  },
  {
    id: "circle",
    title: "Circle Radius Inquiry",
    question: "When radius grows, which grows faster: circumference or area?",
    variableLabel: "Radius",
    min: 1,
    max: 10,
    step: 0.5,
    defaultValue: 3,
    predictionOptions: ["Circumference", "Area", "Same speed"],
    correctPrediction: () => "Area",
    explanation: (value) => `C = 2*pi*r approx ${roundTo(2 * Math.PI * value, 2)}, but A = pi*r^2 approx ${roundTo(Math.PI * value * value, 2)}. Area grows quadratically.`,
    teacherPrompt: "Ask why the filled surface changes faster than the boundary path.",
  },
  {
    id: "quadratic",
    title: "Parabola Width Inquiry",
    question: "What happens when coefficient a gets larger in y = ax^2?",
    variableLabel: "Coefficient a",
    min: 0.2,
    max: 3,
    step: 0.1,
    defaultValue: 1,
    predictionOptions: ["Parabola gets wider", "Parabola gets narrower", "Vertex moves right"],
    correctPrediction: () => "Parabola gets narrower",
    explanation: (value) => `At x=2, y=a*x^2 = ${roundTo(value, 2)}*4 = ${roundTo(value * 4, 2)}. Larger a climbs faster, so the graph looks narrower.`,
    teacherPrompt: "Let students compare points at x=1 and x=2, then generalize.",
  },
  {
    id: "similarity",
    title: "Similar Shapes Inquiry",
    question: "If a triangle is scaled, what stays unchanged?",
    variableLabel: "Scale factor",
    min: 0.5,
    max: 2.5,
    step: 0.1,
    defaultValue: 1.4,
    predictionOptions: ["Angles stay same", "Area stays same", "Side lengths stay same"],
    correctPrediction: () => "Angles stay same",
    explanation: (value) => `Scale factor ${roundTo(value, 2)} multiplies side lengths, area by scale^2, but angles remain equal.`,
    teacherPrompt: "Ask students to identify what changes and what remains invariant.",
  },
  {
    id: "sampling",
    title: "Sampling Variability Inquiry",
    question: "When sample size increases, what happens to random fluctuation?",
    variableLabel: "Sample size",
    min: 10,
    max: 200,
    step: 10,
    defaultValue: 50,
    predictionOptions: ["Fluctuation usually decreases", "Fluctuation increases", "Nothing changes"],
    correctPrediction: () => "Fluctuation usually decreases",
    explanation: (value) => `Expected random noise often shrinks roughly like 1/sqrt(n). For n=${value}, a rough noise scale is ${roundTo(1 / Math.sqrt(value), 3)}.`,
    teacherPrompt: "Use this as a bridge to the native Statistics and Probability dashboard.",
  },
];

export default function InquirySimulationLabs() {
  const [activeId, setActiveId] = useState<InquiryLabId>("slope");
  const lab = inquiryLabs.find((item) => item.id === activeId) ?? inquiryLabs[0];
  const [value, setValue] = useState(lab.defaultValue);
  const [prediction, setPrediction] = useState(lab.predictionOptions[0]);
  const [checked, setChecked] = useState(false);
  const [reflection, setReflection] = useState("");

  const result = useMemo(() => lab.correctPrediction(value), [lab, value]);
  const correct = prediction === result;

  const switchLab = (next: InquiryLab) => {
    setActiveId(next.id);
    setValue(next.defaultValue);
    setPrediction(next.predictionOptions[0]);
    setChecked(false);
    setReflection("");
  };

  return (
    <SectionCard title="Inquiry-Based Simulation Labs" description="Predict first, test with a simulation, check evidence, then reflect. This mirrors research-style conceptual learning rather than only showing the answer.">
      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-3">
          {inquiryLabs.map((item) => (
            <button key={item.id} type="button" onClick={() => switchLab(item)} className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${item.id === lab.id ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-400/10" : "border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5"}`}>
              <p className="flex items-center gap-2 font-bold"><FlaskConical className="h-4 w-4 text-cyan-500" />{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.question}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-sm font-bold text-cyan-200">Predict</p>
              <h3 className="mt-2 text-2xl font-black">{lab.question}</h3>
              <div className="mt-4 grid gap-2 md:grid-cols-3">
                {lab.predictionOptions.map((option) => (
                  <button key={option} type="button" onClick={() => { setPrediction(option); setChecked(false); }} className={`rounded-xl px-3 py-3 text-sm font-bold transition ${prediction === option ? "bg-cyan-400 text-slate-950" : "bg-white/10 hover:bg-white/15"}`}>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[270px_minmax(0,1fr)]">
              <SliderControl label={lab.variableLabel} value={value} min={lab.min} max={lab.max} step={lab.step} unit={lab.unit} onChange={(next) => { setValue(next); setChecked(false); }} />
              <InquiryVisual lab={lab.id} value={value} />
            </div>

            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
              <p className="flex items-center gap-2 font-bold"><Lightbulb className="h-4 w-4 text-amber-500" />Evidence</p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{lab.explanation(value)}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-bold">Check</p>
              <button type="button" onClick={() => setChecked(true)} className="mt-3 action-primary w-full"><CheckCircle2 className="h-4 w-4" />Check prediction</button>
              {checked && <div className={`mt-3 rounded-2xl p-3 text-sm font-bold ${correct ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-100" : "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-100"}`}>{correct ? "Your prediction matches the evidence." : `Not quite. Evidence supports: ${result}.`}</div>}
              <button type="button" onClick={() => { setChecked(false); setReflection(""); setValue(lab.defaultValue); }} className="mt-3 action-secondary w-full"><RefreshCw className="h-4 w-4" />Reset lab</button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-bold">Reflect</p>
              <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} className="mt-3 min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-white/10 dark:bg-slate-900" placeholder="What changed? What stayed the same? What evidence convinced you?" />
              <p className="mt-3 rounded-xl bg-slate-100 p-3 text-xs leading-5 text-slate-600 dark:bg-white/10 dark:text-slate-300">{lab.teacherPrompt}</p>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function InquiryVisual({ lab, value }: { lab: InquiryLabId; value: number }) {
  if (lab === "slope") return <svg viewBox="0 0 360 220" className="h-56 w-full rounded-2xl bg-slate-100 dark:bg-slate-950"><line x1="45" y1="175" x2="315" y2="175" stroke="#94a3b8" strokeWidth="3" /><polygon points={`60,175 300,175 300,${175 - value * 13}`} fill="#22d3ee" opacity="0.22" stroke="#06b6d4" strokeWidth="4" /><text x="178" y="198" className="text-xs font-bold">run = 6</text><text x="308" y={175 - value * 6} className="text-xs font-bold">rise</text></svg>;
  if (lab === "area") return <svg viewBox="0 0 360 220" className="h-56 w-full rounded-2xl bg-slate-100 dark:bg-slate-950"><rect x="95" y="35" width={value * 18} height={value * 18} fill="#22d3ee" opacity="0.28" stroke="#06b6d4" strokeWidth="4" /><text x="95" y="200" className="text-xs font-bold">Area = {roundTo(value * value, 1)} square units</text></svg>;
  if (lab === "circle") return <svg viewBox="0 0 360 220" className="h-56 w-full rounded-2xl bg-slate-100 dark:bg-slate-950"><circle cx="180" cy="110" r={value * 8} fill="#f59e0b" opacity="0.25" stroke="#f59e0b" strokeWidth="4" /><line x1="180" y1="110" x2={180 + value * 8} y2="110" stroke="#06b6d4" strokeWidth="4" /><text x="145" y="205" className="text-xs font-bold">r = {roundTo(value, 1)}</text></svg>;
  if (lab === "quadratic") return <svg viewBox="0 0 360 220" className="h-56 w-full rounded-2xl bg-slate-100 dark:bg-slate-950"><path d={parabolaPath(value)} fill="none" stroke="#8b5cf6" strokeWidth="4" /><line x1="180" x2="180" y1="20" y2="200" stroke="#94a3b8" /><line x1="30" x2="330" y1="175" y2="175" stroke="#94a3b8" /><text x="210" y="42" className="text-xs font-bold">y = ax^2</text></svg>;
  if (lab === "similarity") return <svg viewBox="0 0 360 220" className="h-56 w-full rounded-2xl bg-slate-100 dark:bg-slate-950"><polygon points="70,170 150,170 105,80" fill="#22d3ee" opacity="0.25" stroke="#06b6d4" strokeWidth="4" /><g transform={`translate(215 170) scale(${value}) translate(-105 -170)`}><polygon points="70,170 150,170 105,80" fill="#f59e0b" opacity="0.25" stroke="#f59e0b" strokeWidth="4" /></g><text x="120" y="205" className="text-xs font-bold">Angles stay equal</text></svg>;
  return <svg viewBox="0 0 360 220" className="h-56 w-full rounded-2xl bg-slate-100 dark:bg-slate-950">{Array.from({ length: 20 }).map((_, index) => <circle key={index} cx={35 + (index % 10) * 30} cy={70 + Math.floor(index / 10) * 55 + Math.sin(index * value) * 8} r="7" fill={index % 2 ? "#06b6d4" : "#f59e0b"} />)}<text x="86" y="190" className="text-xs font-bold">larger n, smoother estimate</text></svg>;
}

function parabolaPath(a: number) {
  const points: string[] = [];
  for (let i = 0; i <= 120; i += 1) {
    const x = -3 + (i / 120) * 6;
    const y = a * x * x;
    const sx = 180 + x * 45;
    const sy = 175 - y * 16;
    if (sy < 10 || sy > 210) continue;
    points.push(`${points.length ? "L" : "M"}${sx},${sy}`);
  }
  return points.join(" ");
}
