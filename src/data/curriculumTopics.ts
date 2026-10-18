import { currentTextbookTopics } from "./curriculumTextbookChapters";
import { workbookCurriculumTopics } from "./curriculumWorkbookTopics";
import { draftsForTopic } from "./curriculumAvailableDrafts";
import { ncertConcepts } from "./ncertConcepts";
import { lessonsForCurriculumTopic } from "./curriculumLessonMappings";
import { allSyllabusTopics } from "./syllabus";
import registry from "../modules/lessons/catalog/upcoming/apCurriculumRegistry.generated.json";
import { schoolLessonCatalog } from "../modules/lessons/catalog/school/schoolSyllabusCatalog";
import type { UnifiedLesson } from "../modules/lessons/catalog/unified/unifiedLessons";
import { canonicalChapter, exactPublishedLesson, normalizeChapter, publishedLessons, sharedChapterLessons } from "./curriculumSharedLessons";
import { sharedTopicLessonIds } from "./curriculumTopicAliases";
import coverageReview from "./curriculumCoverageReview.json";
import telanganaBooks from "./telanganaChapterSources.json";

export type CurriculumName = "NCERT" | "AP" | "Telangana" | "CBSE" | "Cambridge" | "IB" | "Common Core";
export const curriculumNames: CurriculumName[] = ["NCERT", "AP", "Telangana", "CBSE", "Cambridge", "IB", "Common Core"];
export type CurriculumTopic = {
  id: string;
  curriculum: CurriculumName;
  level: string;
  unit: string;
  title: string;
  summary: string;
  lessons: UnifiedLesson[];
  draftLessons?: UnifiedLesson[];
  relatedLessons?: UnifiedLesson[];
  workbook?: { row: number; chapterNumber: number; lessonNumber: number; programme: string; track: string; verification: string; state: "mapped" | "partial" | "chapter-resources" | "upcoming"; reason: string; sourceIssue?: string; reviewProfile?: string };
  mappingPending?: boolean;
  practiceAlignmentPending?: boolean;
  coverageNote?: string;
  missingReason?: string;
  missingCoverage?: Array<{ title: string; rationale: string }>;
  order?: number;
  sourceUrl?: string;
  sourceNote?: string;
};
const conceptChapters: Record<string, string> = {
  "class-7-decimal-operations": "Fractions and Decimals", "class-7-fraction-operations": "Fractions and Decimals",
  "class-7-constructions-and-tilings": "Practical Constructions", "class-7-lines-and-triangles": "Triangle and its Properties",
  "class-8-square-cube-roots": "Squares and Square Roots", "class-8-proportional-reasoning-2": "Direct and Inverse Proportions",

  "class-9-heron": "Heron's Formula", "class-9-euclid-geometry": "Introduction to Euclid's Geometry",
  "class-10-real-numbers": "Real Numbers", "class-10-section-formula": "Coordinate Geometry",
  "class-10-heights-distances": "Applications of Trigonometry", "class-11-permutations": "Permutations and Combinations",
  "class-11-binomial": "Binomial Theorem", "class-11-conics": "Conic Sections",
  "class-12-integration-methods": "Integrals", "class-12-vectors-3d-geometry": "Three Dimensional Geometry",
  "class-12-bayes-theorem": "Probability", "class-10-pair-linear": "Pair of Linear Equations in Two Variables",
  "class-10-quadratic": "Quadratic Equations", "class-10-polynomials": "Polynomials",
  "class-10-irrational-numbers": "Real Numbers", "class-10-polynomial-zero-coefficients": "Polynomials",
  "class-10-linear-substitution-elimination": "Pair of Linear Equations in Two Variables",
  "class-10-linear-consistency": "Pair of Linear Equations in Two Variables",
  "class-10-triangle-bpt-converse": "Triangles", "class-10-similarity-criteria": "Triangles",
  "class-10-areas-similar-triangles": "Triangles", "class-10-special-trig-angles": "Introduction to Trigonometry",
  "class-10-circle-tangent-radius": "Circles", "class-10-two-tangents": "Circles",
  "class-10-sector-segment-area": "Areas Related to Circles", "class-10-composite-circle-regions": "Areas Related to Circles",
  "class-10-combination-solids": "Surface Areas and Volumes", "class-10-recasting-solids": "Surface Areas and Volumes",
  "class-10-frustum-cone": "Surface Areas and Volumes", "class-10-grouped-mean-methods": "Statistics",
  "class-10-grouped-mode": "Statistics", "class-10-grouped-median": "Statistics",
  "class-10-proof-reasoning": "Proofs in Mathematics", "class-10-mathematical-modelling": "Mathematical Modelling",
  "class-8-algebraic-identities": "Algebraic Expressions and Identities", "class-8-proportion": "Direct and Inverse Proportions",
};
const boardNames = {
  NCERT: "NCERT", CBSE: "CBSE", AP_SCERT: "AP", CAMBRIDGE_IGCSE: "Cambridge", IB_AA: "IB", IB_AI: "IB", COMMON_CORE: "Common Core",
} as const;
function schoolChapter(lesson: (typeof schoolLessonCatalog)[number], curriculum: CurriculumName) {
  if (curriculum !== "NCERT") return lesson.metadata.conceptFamily;
  const level = lesson.metadata.academicLevel.replace("CLASS_", "Class ");
  const chapter = allSyllabusTopics.filter((topic) => topic.classLevel === level)
    .map((topic) => ({ title: topic.title, lessons: sharedChapterLessons(topic.title, level) }))
    .filter((topic) => topic.lessons.some((candidate) => candidate.id === lesson.numericId))
    .sort((a, b) => a.lessons.length - b.lessons.length)[0];
  return chapter?.title ?? lesson.metadata.conceptFamily;
}
const schoolTopics = schoolLessonCatalog.flatMap((lesson) => [...new Set(lesson.boardPathways.flatMap((board) => board in boardNames ? [boardNames[board as keyof typeof boardNames]] : []))].flatMap((curriculum): CurriculumTopic[] => {
  if (curriculum === "AP" && !["CLASS_6", "CLASS_7"].includes(lesson.metadata.academicLevel)) return [];
  return [{ id: `school-${lesson.numericId}`, curriculum, level: lesson.metadata.academicLevel.replace("CLASS_", "Class "),
    unit: schoolChapter(lesson, curriculum), title: lesson.title, summary: lesson.content.summary,
    lessons: exactPublishedLesson(lesson.title, lesson.numericId),
    sourceNote: "Registered curriculum topic groups; textbook chapter order may differ by edition.",
  }];
}));
const apTopics = [...registry.schoolTopics, ...registry.upcomingLessons.filter((topic) => topic.level === "AP Intermediate")];
const registeredTopics: CurriculumTopic[] = [
  ...currentTextbookTopics,
  ...allSyllabusTopics.filter((topic) => /^Class \d+$/.test(topic.classLevel)).map((topic): CurriculumTopic => ({
    id: `chapter-${topic.id}`, curriculum: "NCERT", level: topic.classLevel, unit: canonicalChapter(topic.title), title: topic.title,
    summary: topic.description, lessons: sharedChapterLessons(topic.title, topic.classLevel),
    sourceNote: "Chapter map from the registered school syllabus. Chapter names vary across textbook editions.",
  })),
  ...allSyllabusTopics.filter((topic) => ["Class 6", "Class 7"].includes(topic.classLevel)).map((topic): CurriculumTopic => ({
    id: `shared-${topic.id}`, curriculum: "AP", level: topic.classLevel, unit: canonicalChapter(topic.title), title: topic.title,
    summary: topic.description, lessons: sharedChapterLessons(topic.title, topic.classLevel),
    sourceNote: "Shared class topic groups. AP textbook edition-specific chapter ordering is upcoming.",
  })),
  ...ncertConcepts.map((concept): CurriculumTopic => ({
    id: concept.id, curriculum: "NCERT", level: concept.classLevel, unit: conceptChapters[concept.id] ?? canonicalChapter(concept.title),
    title: concept.title, summary: concept.summary, lessons: lessonsForCurriculumTopic(concept.id),
  })),
  ...schoolTopics,
  ...apTopics.map((topic): CurriculumTopic => ({
    id: String(topic.lessonId), curriculum: "AP", level: topic.level, unit: topic.chapterName,
    title: topic.topicName, summary: "Shared mathematics lessons for this chapter topic.",
    lessons: publishedLessons(sharedTopicLessonIds[topic.lessonId] ?? []).length
      ? publishedLessons(sharedTopicLessonIds[topic.lessonId]) : exactPublishedLesson(topic.topicName, topic.existingLessonId),
    order: topic.chapterNumber ?? undefined,
    sourceNote: topic.sourceStatus,
    sourceUrl: registry.sources.find((source) => source.id === topic.sourceId)?.url,
  })),
  ...telanganaBooks.flatMap((book) => book.chapters.map((title, index): CurriculumTopic => ({
    id: `chapter-${book.level.replace("Class ", "")}-${index + 1}`, curriculum: "Telangana", level: book.level,
    unit: title, title, summary: "Open the shared mathematics lessons for this chapter.",
    lessons: sharedChapterLessons(title, book.level), order: index + 1, sourceUrl: book.sourceUrl, sourceNote: book.sourceNote,
  }))),
  ...allSyllabusTopics.filter((topic) => ["Class 11", "Class 12"].includes(topic.classLevel)).map((topic): CurriculumTopic => ({
    id: `telangana-intermediate-reference-${topic.id}`, curriculum: "Telangana", level: topic.classLevel,
    unit: topic.title, title: topic.title, summary: topic.description, lessons: sharedChapterLessons(topic.title, topic.classLevel),
    mappingPending: true, sourceNote: "Shared Intermediate mathematics reference. Telangana IA/IB/IIA/IIB chapter sequencing is not yet verified.",
  })),
  ...["Class 11", "Class 12"].map((level): CurriculumTopic => ({
    id: `paper-map-${level}`, curriculum: "Telangana", level, unit: "Intermediate paper chapters",
    title: level === "Class 11" ? "Mathematics IA and IB chapter mapping" : "Mathematics IIA and IIB chapter mapping",
    summary: "Upcoming: paper-specific chapter mapping. Browse the shared lesson library for algebra, trigonometry, calculus and geometry.", lessons: [],
  })),
];

// Keep unfilled class mappings visible instead of dropping a class from navigation.
const unreviewedTopics: CurriculumTopic[] = [
  ...registeredTopics,
  ...curriculumNames.flatMap((curriculum) => [6, 7, 8, 9, 10, 11, 12].flatMap((grade): CurriculumTopic[] => {
    const level = `Class ${grade}`;
    if (registeredTopics.some((topic) => topic.curriculum === curriculum && topic.level === level)) return [];
    const references = allSyllabusTopics.filter((topic) => topic.classLevel === level).map((topic) => ({
      id: `shared-reference-${curriculum}-${topic.id}`, curriculum, level,
      unit: topic.title, title: topic.title, summary: topic.description,
      lessons: sharedChapterLessons(topic.title, level),
      mappingPending: true,
      sourceNote: "Shared mathematics reference chapters for this class. This board's exact textbook chapter names, sequence and alignment are not yet verified.",
    }));
    return [{id: `pending-${grade}`, curriculum, level, unit: "Chapter mapping", title: "Chapter-to-lesson mapping", summary: "Exact board alignment is being checked; shared reference chapters are listed below.", lessons: [], mappingPending: true}, ...references];
  })),
];

const reviewedCoverage = new Map(coverageReview.reviews.map((review) => [`${review.curriculum}:${review.id}`, review]));
const publishedTopics: CurriculumTopic[] = unreviewedTopics.map((topic) => {
  const review = reviewedCoverage.get(`${topic.curriculum}:${topic.id}`);
  if (!review) return topic;
  return {
    ...topic,
    lessons: publishedLessons(review.lessonIds),
    mappingPending: review.decision === "mapping-pending",
    practiceAlignmentPending: review.decision === "shared-practice",
    coverageNote: review.rationale,
    missingReason: review.decision === "missing" ? review.rationale : undefined,
    missingCoverage: review.decision === "partial" ? [{title: "Fractals and Sierpinski carpet", rationale: "Solid views are available; a dedicated fractal/Sierpinski lesson is missing."}] : undefined,
    summary: review.decision === "mapping-pending" ? "Paper and chapter sequencing is being mapped. Explore the existing shared lesson library." : topic.summary,
  };
});
export const curriculumTopics: CurriculumTopic[] = [...publishedTopics.map((topic) => ({...topic,
  draftLessons: topic.draftLessons ?? draftsForTopic(topic.id, topic.title),
})), ...workbookCurriculumTopics];
export function topicHasUpcomingLesson(topic: CurriculumTopic) {
  return (!topic.mappingPending && !topic.lessons.length && !topic.draftLessons?.length) || !!topic.missingCoverage?.length;
}

export type CurriculumChapter = {
  id: string;
  title: string;
  topics: CurriculumTopic[];
  lessons: UnifiedLesson[];
  draftLessons: UnifiedLesson[];
  relatedLessons: UnifiedLesson[];
  upcoming: CurriculumTopic[];
  mappingPending: CurriculumTopic[];
  alignmentPending: CurriculumTopic[];
  order?: number;
};
export type CurriculumClass = { title: string; chapters: CurriculumChapter[]; lessons: UnifiedLesson[]; upcomingCount: number; mappingPendingCount: number };
export type CurriculumTree = { title: CurriculumName; classes: CurriculumClass[] };
const uniqueLessons = (lessons: UnifiedLesson[]) => [...new Map(lessons.map((lesson) => [lesson.id, lesson])).values()];
export function groupCurriculumTopics(topics: CurriculumTopic[]): CurriculumTree[] {
  return curriculumNames.flatMap((curriculum) => {
    const selected = topics.filter((topic) => topic.curriculum === curriculum);
    const levels = [...new Set(selected.map((topic) => topic.level))].sort((a, b) => Number(a.match(/\d+/)?.[0] ?? 99) - Number(b.match(/\d+/)?.[0] ?? 99));
    const classes = levels.map((title): CurriculumClass => {
      const chapterMap = new Map<string, CurriculumChapter>();
      for (const topic of selected.filter((topic) => topic.level === title)) {
        // Preserve each board's own printed chapter names, including AP's two differently named books.
        const chapterTitle = curriculum === "NCERT" && !topic.workbook ? canonicalChapter(topic.unit) : topic.unit;
        const key = normalizeChapter(chapterTitle);
        const chapter: CurriculumChapter = chapterMap.get(key) ?? { id: `${curriculum}-${title}-${key}`, title: chapterTitle, topics: [], lessons: [], draftLessons: [], relatedLessons: [], upcoming: [], mappingPending: [], alignmentPending: [], order: topic.order };
        chapter.topics.push(topic);
        chapter.draftLessons = uniqueLessons([...chapter.draftLessons, ...topic.draftLessons ?? []]);
        chapter.relatedLessons = uniqueLessons([...chapter.relatedLessons, ...topic.relatedLessons ?? []]);
        chapter.lessons = uniqueLessons([...chapter.lessons, ...topic.lessons]);
        if (topic.mappingPending) chapter.mappingPending.push(topic);
        if (topic.practiceAlignmentPending) chapter.alignmentPending.push(topic);
        for (const [index, missing] of (topic.missingCoverage ?? []).entries()) chapter.upcoming.push({...topic, id: `${topic.id}-missing-${index}`, title: missing.title, lessons: [], missingCoverage: undefined, missingReason: missing.rationale});
        if (!topic.mappingPending && !topic.lessons.length && !topic.draftLessons?.length && !chapter.upcoming.some((entry) => normalizeChapter(entry.title) === normalizeChapter(topic.title))) chapter.upcoming.push(topic);
        chapterMap.set(key, chapter);
      }
      const chapters = [...chapterMap.values()].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      return { title, chapters, lessons: uniqueLessons(chapters.flatMap((chapter) => chapter.lessons)), upcomingCount: chapters.reduce((sum, chapter) => sum + chapter.upcoming.length, 0), mappingPendingCount: chapters.reduce((sum, chapter) => sum + chapter.mappingPending.length, 0) };
    });
    return classes.length ? [{ title: curriculum, classes }] : [];
  });
}
