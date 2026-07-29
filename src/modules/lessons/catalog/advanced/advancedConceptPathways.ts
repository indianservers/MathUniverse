import { advancedConceptLessons } from "./advancedConceptLessons";

export type AdvancedConceptPathway = {
  id: string;
  title: string;
  summary: string;
  outcome: string;
  lessonIds: string[];
  capstonePrompt: string;
};

export const advancedConceptPathways: AdvancedConceptPathway[] = [
  {
    id: "number-theory-patterns",
    title: "Number Theory Patterns",
    summary: "Move from rational approximation into famous prime and integer problems where computation suggests deep structure.",
    outcome: "Explain how examples, algorithms, and conjectures support mathematical discovery without replacing proof.",
    lessonIds: [
      "advanced-2001",
      "advanced-2002",
      "advanced-2003",
      "advanced-2004",
      "advanced-2005",
      "advanced-2006",
      "advanced-2007",
      "advanced-2008",
    ],
    capstonePrompt: "Compare continued-fraction evidence for approximation with Collatz or Goldbach evidence for conjectures. Where does each kind of evidence stop?",
  },
  {
    id: "inference-and-modeling",
    title: "Inference and Modeling",
    summary: "Connect statistical decisions to dynamic models, emphasizing uncertainty, assumptions, and interpretation.",
    outcome: "Build a short argument that separates model output, sampling uncertainty, and real-world conclusions.",
    lessonIds: [
      "advanced-2011",
      "advanced-2012",
      "advanced-2013",
      "advanced-2014",
      "advanced-2015",
      "advanced-2016",
      "advanced-2018",
      "advanced-2019",
    ],
    capstonePrompt: "Choose a growth or decay scenario, estimate uncertainty in a measured parameter, and explain what the model can and cannot claim.",
  },
  {
    id: "special-functions-and-equations",
    title: "Special Functions and Equations",
    summary: "See special functions as named solutions, normalizers, and bridges between calculus, probability, and physics.",
    outcome: "Recognize when an advanced function is useful because it packages a recurring integral, series, or differential-equation solution.",
    lessonIds: [
      "advanced-2017",
      "advanced-2020",
      "advanced-2021",
      "advanced-2022",
      "advanced-2023",
      "advanced-2024",
      "advanced-2025",
      "advanced-2008",
    ],
    capstonePrompt: "Pick Gamma, Zeta, erf, or Bessel and explain which problem type it packages: factorial extension, prime structure, Gaussian area, or symmetric waves.",
  },
];

export function lessonsForAdvancedPathway(pathway: AdvancedConceptPathway) {
  const byId = new Map(advancedConceptLessons.map((lesson) => [lesson.id, lesson]));
  return pathway.lessonIds.map((id) => byId.get(id)).filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));
}

export function pathwaysForAdvancedLesson(lessonId: string) {
  return advancedConceptPathways.filter((pathway) => pathway.lessonIds.includes(lessonId));
}

export function adjacentLessonInPathway(pathway: AdvancedConceptPathway, lessonId: string) {
  const lessons = lessonsForAdvancedPathway(pathway);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  return {
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  };
}
