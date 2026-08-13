import katex from "katex";
import { useEffect, useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import StudioPageShell from "../components/ui/StudioPageShell";

const examples = [
  { topic: "Algebra", title: "Linear equation", problem: "2x+5=17", steps: [{ hint: "Undo addition first.", math: "2x=12" }, { hint: "Divide by the coefficient.", math: "x=6" }] },
  { topic: "Calculus", title: "Power rule", problem: "f(x)=x^3+2x", steps: [{ hint: "Differentiate term by term.", math: "f'(x)=3x^2+2" }] },
  { topic: "Trigonometry", title: "Unit identity", problem: "\\sin^2\\theta+\\cos^2\\theta", steps: [{ hint: "Use the unit circle radius.", math: "\\sin^2\\theta+\\cos^2\\theta=1" }] },
  { topic: "Linear Algebra", title: "2x2 determinant", problem: "\\begin{vmatrix}a&b\\\\c&d\\end{vmatrix}", steps: [{ hint: "Multiply main diagonal minus other diagonal.", math: "ad-bc" }] },
];

export default function WorkedExamplesLibrary() {
  const topics = useMemo(() => Array.from(new Set(examples.map((example) => example.topic))), []);
  const [topic, setTopic] = useState(() => readExampleTopicFromUrl(topics));
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const visible = examples.filter((example) => example.topic === topic);
  const activeExample = visible[0] ?? examples[0];

  useEffect(() => {
    const onPopState = () => setTopic(readExampleTopicFromUrl(topics));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [topics]);

  const selectTopic = (nextTopic: string) => {
    setTopic(nextTopic);
    const url = new URL(window.location.href);
    if (nextTopic === topics[0]) url.searchParams.delete("topic");
    else url.searchParams.set("topic", nextTopic);
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <StudioPageShell
      className="examples-studio"
      title="Worked Examples Studio"
      subtitle="Curated solved problems with rendered math and toggleable hints at each step."
      breadcrumbs={["Home", "Practice", "Worked Examples"]}
      difficulty="Reference"
      estimatedMinutes={9}
      progress={68}
      status={[
        { id: "topics", label: "Topics", value: topics.length, tone: "cyan" },
        { id: "examples", label: "Examples", value: examples.length, tone: "violet" },
      ]}
    >
      <div className="examples-workspace">
        <section className="examples-main-panel" aria-label="Worked example activity">
          <div className="examples-tabs" role="tablist" aria-label="Worked example topics">
            {topics.map((item) => (
              <button key={item} type="button" role="tab" aria-selected={topic === item} className={topic === item ? "active" : ""} onClick={() => selectTopic(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="examples-context-strip">
            <div>
              <span>Current example</span>
              <strong>{activeExample.title}</strong>
            </div>
            <p>{topic} worked problem with rendered math, step hints, and compact solution flow.</p>
          </div>
          <div className="examples-content thin-scrollbar">
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
        </section>
        <aside className="examples-inspector thin-scrollbar" aria-label="Worked examples inspector">
          <div className="examples-guide-card">
            <span>Study guide</span>
            <h2>{topic}</h2>
            <p>Predict the next algebraic move, open hints only when needed, then compare against the rendered solution step.</p>
          </div>
          <div className="examples-mini-grid">
            <Metric label="Steps" value={activeExample.steps.length} />
            <Metric label="Visible" value={visible.length} />
            <Metric label="Topics" value={topics.length} />
            <Metric label="Hints" value={Object.values(openHints).filter(Boolean).length} />
          </div>
          <SectionCard title="Practice Routine" compact>
            <div className="grid gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <p>1. Read the problem and predict the first move.</p>
              <p>2. Reveal a hint only if you are stuck.</p>
              <p>3. Rework the example without hints after checking.</p>
            </div>
          </SectionCard>
        </aside>
      </div>
    </StudioPageShell>
  );
}

function Rendered({ value }: { value: string }) {
  const html = useMemo(() => katex.renderToString(value, { displayMode: true, throwOnError: false }), [value]);
  return <div className="overflow-x-auto rounded-2xl bg-slate-100 p-4 dark:bg-white/10 [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}

function readExampleTopicFromUrl(topics: string[]) {
  if (typeof window === "undefined") return topics[0] ?? "Algebra";
  const topic = new URLSearchParams(window.location.search).get("topic");
  return topic && topics.includes(topic) ? topic : topics[0] ?? "Algebra";
}
