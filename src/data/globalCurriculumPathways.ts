import { unifiedLessons, type UnifiedLesson } from "../modules/lessons/catalog/unified/unifiedLessons";
import draftChapters from "./curriculumDraftChapters.json";

export const studyStages = ["School", "Undergraduate", "Postgraduate", "PhD", "Complete library"] as const;
export type StudyStage = typeof studyStages[number];
export type GlobalChapter = { title: string; lessons: UnifiedLesson[]; note?: string };
const byIds = (ids: number[]) => unifiedLessons.filter((lesson) => ids.includes(lesson.id));
export const higherPathways: Record<string, { source: string; note: string; chapters: GlobalChapter[] }> = {
  Undergraduate: {
    source: "https://www.maths.cam.ac.uk/undergrad/node/40",
    note: "A subject pathway informed by university course lists. These links cover individual skills; they do not certify completion of a university course.",
    chapters: [
      {title: "Calculus and differential equations", lessons: unifiedLessons.filter((l) => ["limits-and-derivatives", "integrals", "differential-equations"].includes(l.categorySlug))},
      {title: "Linear algebra and vector calculus", lessons: unifiedLessons.filter((l) => ["matrices-and-linear-algebra", "vectors-and-3d-geometry"].includes(l.categorySlug))},
      {title: "Groups, rings and algebraic structures", lessons: byIds([32011])},
      {title: "Complex analysis", lessons: byIds([32007])},
      {title: "Probability, statistics and stochastic processes", lessons: unifiedLessons.filter((l) => /probability|statistics/.test(l.categorySlug))},
      {title: "Numerical analysis and optimization", lessons: unifiedLessons.filter((l) => /numerical|optimization/.test(l.categorySlug))},
      {title: "Number theory, logic and discrete mathematics", lessons: unifiedLessons.filter((l) => /number-theory|logic|discrete|graph-theory/.test(l.categorySlug))},
      {title: "Real analysis and topology", lessons: [], note: "A complete proof-based sequence has not been identified in the catalog."},
      {title: "Differential geometry and algebraic geometry", lessons: [], note: "Elementary geometry tools do not cover these university courses."},
    ],
  },
  Postgraduate: {
    source: "https://math.mit.edu/academics/classes.php",
    note: "Selected postgraduate subject areas, with available lessons and explicit gaps. University programmes choose different courses and depth.",
    chapters: [
      {title: "Mathematical foundations", lessons: byIds([32008,32009,32010,32011])},
      {title: "Machine learning and statistical learning", lessons: byIds([32012,32013,32014,32015,32016,32017,32018,32019])},
      {title: "Feature engineering and dimensionality reduction", lessons: byIds([32020,32021,32022])},
      {title: "Deep learning mathematics", lessons: byIds([32023,32024,32025,32026,32027])},
      {title: "Natural language processing mathematics", lessons: byIds([32028,32029,32030])},
      {title: "Quantum mathematics", lessons: byIds([32031,32032,32033])},
      {title: "Measure theory, functional analysis and advanced probability", lessons: [], note: "No complete graduate sequence is registered; introductory probability is a prerequisite."},
      {title: "Commutative algebra, algebraic topology and representation theory", lessons: [], note: "Groups and rings provide introductory background only; advanced course lessons are missing."},
    ],
  },
  PhD: {
    source: "https://math.mit.edu/research/",
    note: "Research pathways, not a fixed PhD syllabus. Doctoral work depends on the university, supervisor and research problem. Supporting lessons below are preparation, not research-level coverage.",
    chapters: [
      {title: "Algebra and number theory", lessons: byIds([32011]), note: "Preparation: groups and rings. Research seminars, reading courses and original research are not included."},
      {title: "Analysis and partial differential equations", lessons: byIds([32006,32007]), note: "Preparation: transforms and complex analysis. Research-level analysis and PDE courses are upcoming."},
      {title: "Geometry and topology", lessons: [], note: "Research-level geometry and topology lessons are missing."},
      {title: "Combinatorics and probability", lessons: byIds([32008]), note: "Preparation: generating functions. Advanced seminars and research projects are missing."},
      {title: "Applied mathematics and scientific computing", lessons: byIds([32005,32006]), note: "Preparation only. Advanced numerical analysis, research methods and thesis work are not included."},
      {title: "Research methods, literature review and dissertation", lessons: [], note: "No research training or dissertation pathway is registered."},
    ],
  },
};
export const allLibraryChapters: GlobalChapter[] = [...new Set(unifiedLessons.map((l) => l.category))].map((title) => ({title, lessons: unifiedLessons.filter((l) => l.category === title)}));
export const schoolDraftChapters = draftChapters.filter((entry) => /^Class \d+$/.test(entry.level ?? ""));
