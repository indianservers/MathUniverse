import type { CoverageDimensions, CurriculumMapping } from "./types";

export type LegacySyllabusRecord = { id: string; board?: string; classLevel: string; title: string; unit?: string; route?: string; status?: string; generated?: boolean };
export type MigrationSummary = { inputCount: number; outputCount: number; preservedIds: number; downgradedClaims: number; generatedDrafts: number; unchanged: number; warnings: string[] };
const boards = new Set(["NCERT", "CBSE", "AP_SCERT", "TELANGANA_SCERT", "TN_SCERT", "AP_BIE", "TELANGANA_BIE"]);
const coverage = (generated: boolean): CoverageDimensions => ({ catalogued: "VERIFIED", explained: generated ? "DRAFT" : "REVIEW_REQUIRED", visualized: "REVIEW_REQUIRED", computational: "NOT_STARTED", practised: "NOT_STARTED", assessed: "NOT_STARTED", textbookMapped: "NOT_STARTED", boardCertified: "NOT_STARTED" });

export function migrateLegacySyllabus(records: LegacySyllabusRecord[], curriculumYear: string): { mappings: CurriculumMapping[]; summary: MigrationSummary } {
  let downgradedClaims = 0; let generatedDrafts = 0; let unchanged = 0;
  const mappings = records.map((record) => {
    const claimed = ["complete", "certified", "available"].includes(record.status?.toLowerCase() ?? "");
    if (claimed) downgradedClaims += 1; else unchanged += 1;
    if (record.generated) generatedDrafts += 1;
    return { id: record.id, jurisdiction: "INDIA" as const, board: boards.has(record.board ?? "") ? record.board as CurriculumMapping["board"] : "NCERT", curriculumYear, effectiveFrom: `${curriculumYear.slice(0, 4)}-04-01`, gradeOrCourse: record.classLevel, officialSource: { title: "", url: "", checksum: "", pageOrSection: "" }, unit: record.unit ?? "Unclassified", chapter: record.title, learningOutcome: `Legacy record for ${record.title}; official outcome not yet verified.`, canonicalConceptIds: [], assessmentBlueprintIds: [], evidence: { explanation: record.route ? [record.route] : [], visualization: [], computation: [], practice: [], assessment: [], automatedTests: [] }, coverage: coverage(Boolean(record.generated)), status: claimed ? "UNVERIFIED" as const : "UNMAPPED" as const, review: { reviewers: [], notes: "Idempotent legacy migration. Retain the source backup to roll back." }, contentOrigin: record.generated ? "GENERATED_SCAFFOLD" as const : "LEGACY" as const };
  });
  return { mappings, summary: { inputCount: records.length, outputCount: mappings.length, preservedIds: mappings.filter((mapping, index) => mapping.id === records[index].id).length, downgradedClaims, generatedDrafts, unchanged, warnings: records.some((record) => !boards.has(record.board ?? "")) ? ["Unknown boards were retained as unverified NCERT-scoped legacy records and require manual reassignment."] : [] } };
}
