import { useMemo, useState } from "react";
import type { NCERTPracticeQuestion } from "../practice/ncertPracticeTypes";
import NCERTPrintableWorksheet from "./NCERTPrintableWorksheet";
import { selectWorksheetQuestions } from "./ncertWorksheetUtils";

type NCERTTeacherModePanelProps = {
  title: string;
  classLevel?: string;
  questions: NCERTPracticeQuestion[];
  prompts?: string[];
  misconception?: string;
  extension?: string;
};

export default function NCERTTeacherModePanel({
  title,
  classLevel,
  questions,
  prompts = ["Ask students to predict before checking.", "Ask for the method, not only the answer."],
  misconception = "Students may copy a formula without checking the condition where it applies.",
  extension = "Ask students to create one similar question and exchange it with a partner.",
}: NCERTTeacherModePanelProps) {
  const [difficulty, setDifficulty] = useState("all");
  const [count, setCount] = useState(Math.min(8, questions.length));
  const [showAnswerKey, setShowAnswerKey] = useState(true);
  const worksheetQuestions = useMemo(() => selectWorksheetQuestions(questions, difficulty, count), [count, difficulty, questions]);

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-300/20 dark:bg-amber-300/10">
      <div className="ncert-no-print flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950 dark:text-white">Teacher worksheet mode</h2>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Print-friendly HTML worksheet using the checked practice bank.</p>
        </div>
        <button type="button" className="action-primary" onClick={() => window.print()}>Print worksheet</button>
      </div>
      <div className="ncert-no-print mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-black">
          Difficulty
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="mt-2 w-full rounded-2xl border border-amber-200 bg-white px-3 py-2 dark:border-amber-300/20 dark:bg-slate-950">
            <option value="all">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="exam">Exam</option>
          </select>
        </label>
        <label className="text-sm font-black">
          Questions
          <input type="number" min="1" max={questions.length} value={count} onChange={(event) => setCount(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-amber-200 bg-white px-3 py-2 dark:border-amber-300/20 dark:bg-slate-950" />
        </label>
        <label className="flex items-center gap-2 self-end text-sm font-black">
          <input type="checkbox" checked={showAnswerKey} onChange={(event) => setShowAnswerKey(event.target.checked)} />
          Include answer key
        </label>
      </div>
      <div className="ncert-no-print mt-4 grid gap-3 md:grid-cols-3">
        <Info title="Classroom prompts" text={prompts.join(" ")} />
        <Info title="Misconception note" text={misconception} />
        <Info title="Extension challenge" text={extension} />
      </div>
      <div className="mt-4">
        <NCERTPrintableWorksheet title={title} classLevel={classLevel} questions={worksheetQuestions} showAnswerKey={showAnswerKey} />
      </div>
    </section>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-3 text-sm dark:bg-slate-950/40">
      <p className="font-black text-slate-950 dark:text-white">{title}</p>
      <p className="mt-1 font-semibold leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}
