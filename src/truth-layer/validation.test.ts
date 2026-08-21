import { describe, expect, it } from "vitest";
import { migrateLegacySyllabus } from "./migration";
import { curriculumMappings } from "./registry";
import type { CurriculumMapping } from "./types";
import { validateCurriculumMapping } from "./validation";

const complete = (): CurriculumMapping => ({ ...structuredClone(curriculumMappings[0]), status: "COMPLETE", officialSource: { title: "Official", url: "https://example.edu/source.pdf", checksum: "sha256:abc", pageOrSection: "p. 4" }, coverage: { ...curriculumMappings[0].coverage, explained: "VERIFIED" }, evidence: { ...curriculumMappings[0].evidence, explanation: ["lesson"], practice: ["practice"], assessment: ["assessment"], automatedTests: ["test"] }, review: { reviewers: ["reviewer"], reviewedAt: "2026-08-01", expiresAt: "2027-08-01" } });
describe("truthful curriculum validation", () => {
  it("rejects complete mapping without exact page reference", () => { const mapping = complete(); mapping.officialSource.pageOrSection = ""; expect(validateCurriculumMapping(mapping).map((issue) => issue.code)).toContain("MISSING_PAGE_REFERENCE"); });
  it("rejects certified mapping without assessment evidence", () => { const mapping = complete(); mapping.status = "CERTIFIED"; mapping.coverage.boardCertified = "VERIFIED"; mapping.evidence.assessment = []; expect(validateCurriculumMapping(mapping).map((issue) => issue.code)).toContain("MISSING_ASSESSMENT_EVIDENCE"); });
  it("rejects expired certification and scaffolds", () => { const mapping = complete(); mapping.status = "CERTIFIED"; mapping.coverage.boardCertified = "VERIFIED"; mapping.review.expiresAt = "2020-01-01"; mapping.contentOrigin = "GENERATED_SCAFFOLD"; expect(validateCurriculumMapping(mapping).map((issue) => issue.code)).toEqual(expect.arrayContaining(["CERTIFICATION_EXPIRED", "SCAFFOLD_CANNOT_BE_COMPLETE"])); });
  it("downgrades legacy claims repeatably while preserving IDs", () => { const input = [{ id: "same-id", board: "AP_BIE", classLevel: "Intermediate", title: "Functions", status: "complete", generated: true }]; const first = migrateLegacySyllabus(input, "2026-27"); const second = migrateLegacySyllabus(input, "2026-27"); expect(first).toEqual(second); expect(first.mappings[0]).toMatchObject({ id: "same-id", board: "AP_BIE", status: "UNVERIFIED", contentOrigin: "GENERATED_SCAFFOLD", coverage: { explained: "DRAFT" } }); });
});
