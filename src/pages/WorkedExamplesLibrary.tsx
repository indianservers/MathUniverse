import katex from "katex";
import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";

const examples = [
  { topic: "Algebra", title: "Linear equation", problem: "2x+5=17", steps: [{ hint: "Undo addition first.", math: "2x=12" }, { hint: "Divide by the coefficient.", math: "x=6" }] },
  { topic: "Calculus", title: "Power rule", problem: "f(x)=x^3+2x", steps: [{ hint: "Differentiate term by term.", math: "f'(x)=3x^2+2" }] },
  { topic: "Trigonometry", title: "Unit identity", problem: "\\sin^2\\theta+\\cos^2\\theta", steps: [{ hint: "Use the unit circle radius.", math: "\\sin^2\\theta+\\cos^2\\theta=1" }] },
  { topic: "Linear Algebra", title: "2x2 determinant", problem: "\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}", steps: [{ hint: "Multiply main diagonal minus other diagonal.", math: "ad-bc" }] },
];

export default function WorkedExamplesLibrary() {
  const [topic, setTopic] = useState("Algebra");
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const visible = examples.filter((example) => example.topic === topic);

  return (
    <div className="space-y-6">
      <TopicHeader title="Worked Examples Library" subtitle="Curated solved problems with rendered math and toggleable hints at each step." difficulty="Reference" estimatedMinutes={9} />
      <SectionCard title="Topics">
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(examples.map((example) => example.topic))).map((item) => <button key={item} className={topic === item ? "action-primary" : "action-secondary"} type="button" onClick={() => setTopic(item)}>{item}</button>)}
        </div>
      </SectionCard>
      {visible.map((example) => (
        <SectionCard key={example.title} title={example.title}>
          <Rendered value={example.problem} />
          <div className="mt-5 space-y-3">
            {example.steps.map((step, index) => {
              const key = `${example.title}-${index}`;
              return (
                <div key={key} className="rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-black">Step {index + 1}</p>
                    <button className="action-secondary min-h-0 py-2" type="button" onClick={() => setOpenHints((items) => ({ ...items, [key]: !items[key] }))}>Hint</button>
                  </div>
                  {openHints[key] && <p className="mt-3 text-sm text-cyan-700 dark:text-cyan-200">{step.hint}</p>}
                  <div className="mt-3"><Rendered value={step.math} /></div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

function Rendered({ value }: { value: string }) {
  const html = useMemo(() => katex.renderToString(value, { displayMode: true, throwOnError: false }), [value]);
  return <div className="overflow-x-auto rounded-2xl bg-slate-100 p-4 dark:bg-white/10 [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} />;
}
