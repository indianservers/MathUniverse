import type { CurriculumMapping, MathCapability, ValidationIssue } from "./types";

const advancedStatuses = new Set(["COMPLETE", "CERTIFIED"]);

export function validateCurriculumMapping(mapping: CurriculumMapping, now = new Date()): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const required = (condition: boolean, code: string, field: string, message: string) => { if (!condition) issues.push({ code, field, message, severity: "ERROR" }); };
  required(Boolean(mapping.id), "MISSING_ID", "id", "A stable mapping ID is required.");
  required(Boolean(mapping.curriculumYear), "MISSING_CURRICULUM_YEAR", "curriculumYear", "A curriculum or academic year is required.");
  if (mapping.paper && !["IA", "IB", "IIA", "IIB"].includes(mapping.paper)) issues.push({ code: "INVALID_INTERMEDIATE_PAPER", field: "paper", message: "Intermediate paper must be IA, IB, IIA, or IIB.", severity: "ERROR" });
  if ((mapping.board === "AP_BIE" || mapping.board === "TELANGANA_BIE") && !mapping.paper) issues.push({ code: "MISSING_INTERMEDIATE_PAPER", field: "paper", message: "Intermediate board mappings require a paper identifier.", severity: "ERROR" });
  if (!advancedStatuses.has(mapping.status)) return issues;
  required(Boolean(mapping.officialSource.title), "MISSING_OFFICIAL_SOURCE", "officialSource.title", "Official source title is required.");
  required(/^https?:\/\//.test(mapping.officialSource.url), "MISSING_OFFICIAL_SOURCE", "officialSource.url", "Official source URL is required.");
  required(Boolean(mapping.officialSource.checksum), "MISSING_SOURCE_CHECKSUM", "officialSource.checksum", "Source checksum is required.");
  required(Boolean(mapping.officialSource.pageOrSection), "MISSING_PAGE_REFERENCE", "officialSource.pageOrSection", "Exact page or section is required.");
  required(mapping.canonicalConceptIds.length > 0, "MISSING_CANONICAL_CONCEPT", "canonicalConceptIds", "At least one canonical concept is required.");
  required(mapping.coverage.explained === "VERIFIED" && mapping.evidence.explanation.length > 0, "MISSING_EXPLANATION_EVIDENCE", "evidence.explanation", "Approved explanation evidence is required.");
  required(mapping.evidence.practice.length > 0, "MISSING_PRACTICE_EVIDENCE", "evidence.practice", "Practice evidence is required.");
  required(mapping.evidence.assessment.length > 0, "MISSING_ASSESSMENT_EVIDENCE", "evidence.assessment", "Assessment evidence is required.");
  required(mapping.evidence.automatedTests.length > 0, "MISSING_AUTOMATED_TEST_EVIDENCE", "evidence.automatedTests", "Automated-test evidence is required.");
  required(mapping.review.reviewers.length > 0, "MISSING_REVIEWER", "review.reviewers", "At least one reviewer is required.");
  required(Boolean(mapping.review.reviewedAt), "MISSING_REVIEW_DATE", "review.reviewedAt", "Review date is required.");
  if (mapping.status === "CERTIFIED") {
    required(mapping.coverage.boardCertified === "VERIFIED", "MISSING_BOARD_CERTIFICATION", "coverage.boardCertified", "Board certification must be independently verified.");
    required(Boolean(mapping.review.expiresAt), "MISSING_CERTIFICATION_EXPIRY", "review.expiresAt", "Certification expiry is required.");
    if (mapping.review.expiresAt && new Date(mapping.review.expiresAt) <= now) issues.push({ code: "CERTIFICATION_EXPIRED", field: "review.expiresAt", message: "Certification has expired.", severity: "ERROR" });
  }
  if (mapping.contentOrigin === "GENERATED_SCAFFOLD") issues.push({ code: "SCAFFOLD_CANNOT_BE_COMPLETE", field: "contentOrigin", message: "Generated scaffold content cannot be COMPLETE or CERTIFIED.", severity: "ERROR" });
  return issues;
}

export function validateCapability(capability: MathCapability): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (capability.status === "VERIFIED" && capability.testIds.length === 0) issues.push({ code: "VERIFIED_WITHOUT_TESTS", field: "testIds", message: "Verified capabilities require automated test evidence.", severity: "ERROR" });
  if (!/^\d+\.\d+\.\d+$/.test(capability.version)) issues.push({ code: "INVALID_CAPABILITY_VERSION", field: "version", message: "Capability versions must use semantic versioning.", severity: "ERROR" });
  return issues;
}

export function assertValidMappingTransition(mapping: CurriculumMapping, requestedStatus: CurriculumMapping["status"], now = new Date()) {
  const candidate = { ...mapping, status: requestedStatus };
  const issues = validateCurriculumMapping(candidate, now);
  return { accepted: issues.every((issue) => issue.severity !== "ERROR"), mapping: issues.some((issue) => issue.severity === "ERROR") ? mapping : candidate, issues };
}
