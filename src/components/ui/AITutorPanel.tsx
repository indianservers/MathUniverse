import { useMemo, useState } from "react";
import SectionCard from "./SectionCard";

const topics = ["Algebra", "Geometry", "Trigonometry", "Calculus", "Complex Numbers", "Linear Algebra", "AI Applications"];

function answerFor(question: string, topic: string) {
  const q = question.toLowerCase();
  if (q.includes("slope")) return "Slope is the rate of change of a line. In y = mx + c, m tells how much y changes when x increases by 1.";
  if (q.includes("derivative")) return "A derivative measures instantaneous rate of change. For x^2, the derivative is 2x, so the slope changes with position.";
  if (q.includes("integral")) return "An integral adds tiny pieces of area or accumulation. Visually, it is the limiting sum of many thin rectangles.";
  if (q.includes("euler") || q.includes("complex")) return "Euler's formula e^(i theta) = cos theta + i sin theta connects complex exponentials to circular motion.";
  if (q.includes("mean")) return "Statistics questions now live in the dedicated Anveshak app: https://www.aimersociety.com/anveshak/";
  if (q.includes("vector")) return "A vector stores magnitude and direction. In 2D, [x, y] has length sqrt(x^2 + y^2).";
  if (q.includes("matrix")) return "A matrix transforms vectors and shapes. In AI, matrices efficiently apply many weighted sums at once.";
  if (q.includes("gradient")) return "Gradient descent moves parameters downhill on a loss curve using x_new = x - learning_rate * gradient.";
  if (q.includes("neural")) return "A neural network combines weighted sums, biases, and activation functions, often written as activation(Wx + b).";
  return `This offline demo tutor can give rule-based help for ${topic}. API integration can be added later for richer, personalized explanations.`;
}

export default function AITutorPanel() {
  const [topic, setTopic] = useState("Algebra");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState("");
  const response = useMemo(() => submitted ? answerFor(submitted, topic) : "", [submitted, topic]);

  // Future API integration point:
  // Send { topic, question } to a secured backend route, then call OpenAI, Gemini, Groq, or another provider there.
  // Keep provider API keys out of this browser-only React app.

  return (
    <SectionCard title="AI Tutor Preview" description="Offline demo tutor. API integration can be enabled later.">
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <label className="block">
          <span className="text-sm font-semibold">Topic</span>
          <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={topic} onChange={(event) => setTopic(event.target.value)}>
            {topics.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Question</span>
          <textarea className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about slope, derivative, Euler, matrix, gradient..." />
        </label>
      </div>
      <button className="action-primary mt-4" onClick={() => setSubmitted(question.trim())} disabled={!question.trim()}>Ask Tutor</button>
      {response && <div className="mt-4 rounded-2xl bg-cyan-50 p-4 text-sm leading-6 text-slate-700 dark:bg-cyan-400/10 dark:text-cyan-50">{response}</div>}
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Future API connection point: send topic and question to a secured backend route that calls OpenAI, Gemini, or Groq. No API keys are used in this browser-only demo.</p>
    </SectionCard>
  );
}
