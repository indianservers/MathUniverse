import type { AcademicLevel, SchoolSyllabusLesson, SchoolSyllabusPathway, SyllabusBoard } from "./lessonSyllabusTypes";

export const validSyllabusBoards: readonly SyllabusBoard[] = [
  "NCERT",
  "CBSE",
  "AP_SCERT",
  "TN_SCERT",
  "CAMBRIDGE_IGCSE",
  "CAMBRIDGE_A_LEVEL",
  "IB_AA",
  "IB_AI",
  "COMMON_CORE",
  "UGC_BSC",
  "IIT_JAM",
  "CSIR_NET",
];

export const validAcademicLevels: readonly AcademicLevel[] = [
  "CLASS_6",
  "CLASS_7",
  "CLASS_8",
  "CLASS_9",
  "CLASS_10",
  "CLASS_11",
  "CLASS_12",
  "UG_YEAR_1",
  "UG_YEAR_2",
  "UG_YEAR_3",
  "PG_FOUNDATION",
  "PG_ADVANCED",
];

export function validateSchoolLessonCatalog(lessons: readonly SchoolSyllabusLesson[]) {
  const errors: string[] = [];
  const ids = new Set<string>();
  const numericIds = new Set<number>();
  const slugs = new Set<string>();
  const routes = new Set<string>();

  for (const lesson of lessons) {
    if (ids.has(lesson.id)) errors.push(`duplicate id: ${lesson.id}`);
    if (numericIds.has(lesson.numericId)) errors.push(`duplicate numericId: ${lesson.numericId}`);
    if (slugs.has(lesson.slug)) errors.push(`duplicate slug: ${lesson.slug}`);
    if (routes.has(lesson.route)) errors.push(`duplicate route: ${lesson.route}`);
    ids.add(lesson.id);
    numericIds.add(lesson.numericId);
    slugs.add(lesson.slug);
    routes.add(lesson.route);

    if (!lesson.title.trim()) errors.push(`${lesson.id}: empty title`);
    if (!validAcademicLevels.includes(lesson.metadata.academicLevel)) errors.push(`${lesson.id}: invalid academic level`);
    if (!lesson.metadata.conceptFamily.trim()) errors.push(`${lesson.id}: empty concept family`);
    if (!lesson.metadata.learningObjectives.length) errors.push(`${lesson.id}: empty objectives`);
    if (!lesson.metadata.estimatedMinutes || lesson.metadata.estimatedMinutes < 5) errors.push(`${lesson.id}: invalid duration`);
    if (!lesson.metadata.searchKeywords.length) errors.push(`${lesson.id}: empty search keywords`);
    if (!lesson.content.summary.trim()) errors.push(`${lesson.id}: empty summary`);
    if (!lesson.content.learn.length || !lesson.content.explore.length || !lesson.content.practice.length) errors.push(`${lesson.id}: incomplete content sections`);
    for (const tag of lesson.metadata.syllabusTags) {
      if (!validSyllabusBoards.includes(tag.board)) errors.push(`${lesson.id}: invalid board ${tag.board}`);
      if (!validAcademicLevels.includes(tag.level)) errors.push(`${lesson.id}: invalid tag level ${tag.level}`);
      if (tag.level !== lesson.metadata.academicLevel) errors.push(`${lesson.id}: tag level mismatch ${tag.level}`);
    }
    for (const prerequisite of lesson.metadata.prerequisites) {
      if (prerequisite.lessonId && !ids.has(prerequisite.lessonId)) {
        errors.push(`${lesson.id}: prerequisite appears after lesson or is missing: ${prerequisite.lessonId}`);
      }
    }
  }

  return errors;
}

export function validateSchoolPathways(pathways: readonly SchoolSyllabusPathway[], lessons: readonly SchoolSyllabusLesson[]) {
  const errors: string[] = [];
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const pathwayIds = new Set<string>();
  for (const pathway of pathways) {
    if (pathwayIds.has(pathway.id)) errors.push(`duplicate pathway id: ${pathway.id}`);
    pathwayIds.add(pathway.id);
    if (!validSyllabusBoards.includes(pathway.board)) errors.push(`${pathway.id}: invalid board`);
    if (!validAcademicLevels.includes(pathway.academicLevel)) errors.push(`${pathway.id}: invalid academic level`);
    if (!pathway.units.length) errors.push(`${pathway.id}: empty units`);
    for (const unit of pathway.units) {
      if (!unit.lessonIds.length) errors.push(`${pathway.id}: empty unit ${unit.unit}`);
      for (const lessonId of unit.lessonIds) {
        if (!lessonIds.has(lessonId)) errors.push(`${pathway.id}: missing lesson ${lessonId}`);
      }
    }
  }
  return errors;
}
