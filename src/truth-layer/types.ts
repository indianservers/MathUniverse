export type CoverageEvidenceState = "NOT_STARTED" | "DRAFT" | "REVIEW_REQUIRED" | "VERIFIED" | "NOT_APPLICABLE";
export type CoverageDimensions = { catalogued: CoverageEvidenceState; explained: CoverageEvidenceState; visualized: CoverageEvidenceState; computational: CoverageEvidenceState; practised: CoverageEvidenceState; assessed: CoverageEvidenceState; textbookMapped: CoverageEvidenceState; boardCertified: CoverageEvidenceState };
export type BoardId = "NCERT" | "CBSE" | "AP_SCERT" | "TELANGANA_SCERT" | "TN_SCERT" | "AP_BIE" | "TELANGANA_BIE";
export type IntermediatePaper = "IA" | "IB" | "IIA" | "IIB";
export type CurriculumPathway = "CBSE_IX_MATHEMATICS" | "CBSE_IX_MATHEMATICS_ADVANCED" | "CBSE_XI_XII_MATHEMATICS" | "CBSE_XI_XII_APPLIED_MATHEMATICS" | "AP_INTERMEDIATE_IA" | "AP_INTERMEDIATE_IB" | "AP_INTERMEDIATE_IIA" | "AP_INTERMEDIATE_IIB" | "TELANGANA_INTERMEDIATE_IA" | "TELANGANA_INTERMEDIATE_IB" | "TELANGANA_INTERMEDIATE_IIA" | "TELANGANA_INTERMEDIATE_IIB";

export type CurriculumMappingStatus = "UNMAPPED" | "UNVERIFIED" | "SUPPORTING" | "PARTIAL" | "COMPLETE" | "CERTIFIED";
export type CurriculumMapping = {
  id: string; jurisdiction: "INDIA"; board: BoardId; pathway?: CurriculumPathway; curriculumYear: string; effectiveFrom: string; effectiveTo?: string; supersedes?: string;
  gradeOrCourse: string; subjectCode?: string; paper?: IntermediatePaper | string; medium?: string; textbookEdition?: string;
  officialSource: { title: string; url: string; checksum: string; pageOrSection: string; retrievedAt?: string };
  unit: string; chapter: string; learningOutcome: string; canonicalConceptIds: string[]; assessmentBlueprintIds: string[];
  evidence: { explanation: string[]; visualization: string[]; computation: string[]; practice: string[]; assessment: string[]; automatedTests: string[] };
  coverage: CoverageDimensions; status: CurriculumMappingStatus;
  review: { reviewers: string[]; reviewedAt?: string; expiresAt?: string; notes?: string };
  contentOrigin?: "AUTHORED" | "GENERATED_SCAFFOLD" | "LEGACY";
};

export type MathCapability = {
  id: string; name: string; category: "PARSER" | "VALUES" | "CAS" | "GRAPH_2D" | "GRAPH_3D" | "GEOMETRY" | "DATA" | "PROBABILITY" | "STATISTICS" | "ASSESSMENT" | "ACCESSIBILITY";
  status: "UNSUPPORTED" | "EXPERIMENTAL" | "PARTIAL" | "SUPPORTED" | "VERIFIED";
  supportedInputs: string[]; supportedDomains: string[]; exactBehavior: string; numericBehavior: string; knownLimitations: string[];
  testIds: string[]; consumingRoutes: string[]; dependentConceptIds: string[]; dependentCurriculumMappingIds: string[];
  accessibility: { keyboard: boolean; screenReader: boolean; nonVisualAlternative: boolean; description?: string };
  version: string; owner?: string; reviewedAt?: string;
};

export type ValidationIssue = { code: string; field: string; message: string; severity: "ERROR" | "WARNING" };
