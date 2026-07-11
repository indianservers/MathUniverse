import type { ReactNode } from "react";
import FormulaBlock from "../ui/FormulaBlock";
import SectionCard from "../ui/SectionCard";
import { DiagramSummary, GuidedScaffoldPanel, StudentTaskCard, TeacherNotes } from "../ui/LearningScaffolds";
import { getNCERTPracticeItems } from "../../data/ncertPracticeBank";
import NCERTTabbedWorkspace from "./layout/NCERTTabbedWorkspace";
import NCERTPracticeCheck from "./practice/NCERTPracticeCheck";
import NCERTTeacherModePanel from "./teacher/NCERTTeacherModePanel";

type NCERTChapterScaffoldProps = {
  title: string;
  conceptId?: string;
  classLevel?: string;
  subtitle: string;
  formula: string;
  children: ReactNode;
  studentTask: {
    tryFirst: string;
    predict: string;
    observe: string;
    explain: string;
    commonMistake: string;
  };
  teacherNote: {
    objective: string;
    prerequisite: string;
    prompt: string;
    misconception: string;
    extension: string;
  };
  diagramSummary: string;
  recap: string[];
  presets: string[];
};

export default function NCERTChapterScaffold({
  title,
  conceptId,
  classLevel = "Class 7",
  subtitle,
  formula,
  children,
  studentTask,
  teacherNote,
  diagramSummary,
  recap,
  presets,
}: NCERTChapterScaffoldProps) {
  const bankQuestions = conceptId ? getNCERTPracticeItems(conceptId) : [];
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-cyan-200 bg-white/90 p-5 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/70">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Class 7 NCERT guided lab</p>
        <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{title}</h1>
        <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
      </section>

      <NCERTTabbedWorkspace
        ariaLabel={`${title} compact learning tabs`}
        tabs={[
          {
            id: "explore",
            label: "Explore",
            content: (
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">{children}</div>
                <aside className="space-y-4">
                  <FormulaBlock title="Key idea" formula={formula} explanation={subtitle} />
                  <DiagramSummary>{diagramSummary}</DiagramSummary>
                </aside>
              </div>
            ),
          },
          {
            id: "visual-model",
            label: "Visual Model",
            content: (
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div>{children}</div>
                <DiagramSummary>{diagramSummary}</DiagramSummary>
              </div>
            ),
          },
          {
            id: "practice",
            label: "Practice",
            content: (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
                {bankQuestions.length > 0 ? (
                  <NCERTPracticeCheck title={`${title} practice bank`} questions={bankQuestions} conceptId={conceptId} compact />
                ) : (
                  <GuidedScaffoldPanel
                    title="What did you learn?"
                    goal="Say the rule in your own words, then test it on a new example."
                    notice={recap[0] ?? "The visual shows the important structure."}
                    tryIt={recap[1] ?? "Change one value and predict the result."}
                    explain={recap[2] ?? "Explain why the answer changed."}
                    checks={recap}
                  />
                )}
                <SectionCard title="Practice presets" description="Use these NCERT-style starting points before making your own.">
                  <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => (
                      <span key={preset} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-900 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
                        {preset}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              </div>
            ),
          },
          {
            id: "mistakes",
            label: "Common Mistakes",
            content: <StudentTaskCard {...studentTask} />,
          },
          {
            id: "teacher-notes",
            label: "Teacher Notes",
            content: bankQuestions.length > 0 ? (
              <NCERTTeacherModePanel
                title={title}
                classLevel={classLevel}
                questions={bankQuestions}
                prompts={[teacherNote.prompt, studentTask.predict, studentTask.explain]}
                misconception={teacherNote.misconception}
                extension={teacherNote.extension}
              />
            ) : <TeacherNotes {...teacherNote} />,
          },
        ]}
      />
    </div>
  );
}
