export type LessonStepKind = "explore" | "question" | "hint" | "check" | "teacher-note";

export type LessonStep = {
  id: string;
  kind: LessonStepKind;
  title: string;
  prompt: string;
  command?: string;
  expected?: string;
};

export type ClassroomLesson = {
  id: string;
  title: string;
  objective: string;
  audience: string;
  teacherNotes: string;
  steps: LessonStep[];
  updatedAt: number;
};

export const lessonStepKinds: LessonStepKind[] = ["explore", "question", "hint", "check", "teacher-note"];

export function createDefaultLesson(): ClassroomLesson {
  return {
    id: crypto.randomUUID(),
    title: "Interactive math investigation",
    objective: "Students connect symbolic, graphical, geometric, and 3D views through one workspace.",
    audience: "Grade 9-12 / foundation college",
    teacherNotes: "Use guided examples first, then ask students to modify sliders and explain what changes.",
    updatedAt: Date.now(),
    steps: [
      {
        id: crypto.randomUUID(),
        kind: "explore",
        title: "Start with a visible object",
        prompt: "Run the command and identify what changed in the workspace.",
        command: "plot a*x^2 + b",
      },
      {
        id: crypto.randomUUID(),
        kind: "question",
        title: "Explain the slider",
        prompt: "Move the parameter slider. What does the parameter control?",
        expected: "The parameter changes the shape or position of the graph.",
      },
      {
        id: crypto.randomUUID(),
        kind: "check",
        title: "Connect CAS to graph",
        prompt: "Run a derivative command and compare the original graph with the derivative graph.",
        command: "derivative x^3 - 2*x",
      },
    ],
  };
}

export function lessonSummary(lesson: ClassroomLesson) {
  const counts = lesson.steps.reduce<Record<string, number>>((acc, step) => {
    acc[step.kind] = (acc[step.kind] ?? 0) + 1;
    return acc;
  }, {});
  return `${lesson.steps.length} step(s), ${counts.question ?? 0} question(s), ${counts.check ?? 0} check(s)`;
}
