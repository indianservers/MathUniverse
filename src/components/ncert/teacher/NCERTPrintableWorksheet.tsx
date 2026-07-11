import type { NCERTPracticeQuestion } from "../practice/ncertPracticeTypes";
import { printableAnswer } from "./ncertWorksheetUtils";

type NCERTPrintableWorksheetProps = {
  title: string;
  classLevel?: string;
  questions: NCERTPracticeQuestion[];
  showAnswerKey: boolean;
};

export default function NCERTPrintableWorksheet({ title, classLevel = "NCERT", questions, showAnswerKey }: NCERTPrintableWorksheetProps) {
  return (
    <section className="ncert-printable-worksheet rounded-2xl border border-slate-200 bg-white p-4 text-slate-950 print:border-0 print:p-0">
      <style>{`
        @media print {
          body { background: white !important; }
          .ncert-printable-worksheet { color: #000 !important; background: white !important; }
          .ncert-no-print { display: none !important; }
          .ncert-printable-worksheet article { break-inside: avoid; }
        }
      `}</style>
      <div className="border-b border-slate-300 pb-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-600">{classLevel} worksheet</p>
        <h2 className="mt-1 text-xl font-black">{title}</h2>
        <div className="mt-3 grid gap-2 text-sm font-semibold sm:grid-cols-2">
          <span>Name: ______________________________</span>
          <span>Date: _______________________________</span>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {questions.map((question, index) => (
          <article key={question.id} className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-black">Q{index + 1}. {question.prompt}</p>
            {question.choices && (
              <ol className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                {question.choices.map((choice) => <li key={choice}>{choice}</li>)}
              </ol>
            )}
            <div className="mt-3 h-8 border-b border-dashed border-slate-300" />
          </article>
        ))}
      </div>
      {showAnswerKey && (
        <div className="mt-5 border-t border-slate-300 pt-4">
          <h3 className="font-black">Answer Key</h3>
          <ol className="mt-2 grid gap-1 text-sm font-semibold sm:grid-cols-2">
            {questions.map((question, index) => <li key={question.id}>{index + 1}. {printableAnswer(question.answer)}</li>)}
          </ol>
        </div>
      )}
    </section>
  );
}
