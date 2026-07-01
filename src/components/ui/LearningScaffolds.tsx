import type { ReactNode } from "react";

type StudentTaskCardProps = {
  tryFirst: string;
  predict: string;
  observe: string;
  explain: string;
  commonMistake: string;
};

export function StudentTaskCard({ tryFirst, predict, observe, explain, commonMistake }: StudentTaskCardProps) {
  return (
    <section className="rounded-2xl border border-cyan-200 bg-cyan-50/90 p-4 text-sm text-cyan-950 shadow-sm dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
      <h3 className="text-sm font-black">Try this first</h3>
      <p className="mt-1 font-semibold leading-6">{tryFirst}</p>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <MiniPrompt label="Predict" value={predict} />
        <MiniPrompt label="Observe" value={observe} />
        <MiniPrompt label="Explain" value={explain} />
      </div>
      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-50">
        Common mistake: {commonMistake}
      </p>
    </section>
  );
}

export function TeacherNotes({
  objective,
  prerequisite,
  prompt,
  misconception,
  extension,
}: {
  objective: string;
  prerequisite: string;
  prompt: string;
  misconception: string;
  extension: string;
}) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-white/85 p-4 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.07]">
      <summary className="cursor-pointer font-black text-slate-900 dark:text-white">Teacher notes</summary>
      <div className="mt-3 space-y-2 text-slate-700 dark:text-slate-200">
        <TeacherLine label="Objective" value={objective} />
        <TeacherLine label="Prerequisite" value={prerequisite} />
        <TeacherLine label="Classroom prompt" value={prompt} />
        <TeacherLine label="Misconception" value={misconception} />
        <TeacherLine label="Extension" value={extension} />
      </div>
    </details>
  );
}

export function InvalidMathStateMessage({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-50">
      {children}
    </div>
  );
}

export function DiagramSummary({ children }: { children: ReactNode }) {
  return <p className="sr-only">{children}</p>;
}

function MiniPrompt({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/35">
      <p className="text-[11px] font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">{label}</p>
      <p className="mt-1 font-semibold leading-5">{value}</p>
    </div>
  );
}

function TeacherLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-black">{label}:</span> {value}
    </p>
  );
}
