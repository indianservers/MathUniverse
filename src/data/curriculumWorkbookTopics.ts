import { curriculumWorkbook, workbookLessonMappings } from "./curriculumWorkbookMappings";
import { lessonById } from "../modules/lessons/catalog/unified/unifiedLessons";
import type { CurriculumName, CurriculumTopic } from "./curriculumTopics";

const boards: Record<string, CurriculumName> = {NCERT:"NCERT", "Andhra Pradesh":"AP", Telangana:"Telangana", IB:"IB", Cambridge:"Cambridge"};
const mappings = new Map(workbookLessonMappings.map((mapping) => [mapping.rowId,mapping]));
export const workbookCurriculumTopics: CurriculumTopic[] = curriculumWorkbook.rows.map((row) => {
  const mapping = mappings.get(row.id)!;
  const direct = mapping.lessonIds.flatMap((id) => lessonById(id) ?? []);
  const related = mapping.relatedLessonIds.flatMap((id) => lessonById(id) ?? []);
  return {
    id: row.id, curriculum: boards[row.board], level: row.level, unit: row.chapter, title: row.title,
    summary: `${row.programme}. ${row.track}. ${mapping.reason}`, order: row.chapterNumber,
    lessons: direct.filter((lesson) => lesson.status === "Published"), draftLessons: direct.filter((lesson) => lesson.status !== "Published"),
    relatedLessons: related, mappingPending: mapping.state === "chapter-resources", missingReason: mapping.state === "upcoming" ? mapping.reason : undefined,
    missingCoverage: mapping.missing,
    sourceUrl: row.sourceUrl, sourceNote: `${row.verification}${row.notes ? `. ${row.notes}` : ""}. Imported from the supplied working index, All Lessons row ${row.row}.`,
    workbook: {row: row.row, chapterNumber: row.chapterNumber, lessonNumber: row.lessonNumber, programme: row.programme, track: row.track, verification: row.verification, state: mapping.state, reason: mapping.reason, sourceIssue: mapping.sourceIssue, reviewProfile: mapping.reviewProfile},
  };
});
