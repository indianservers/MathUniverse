export type SyllabusBoard =
  | "NCERT"
  | "CBSE"
  | "AP_SCERT"
  | "TN_SCERT"
  | "CAMBRIDGE_IGCSE"
  | "CAMBRIDGE_A_LEVEL"
  | "IB_AA"
  | "IB_AI"
  | "COMMON_CORE"
  | "UGC_BSC"
  | "IIT_JAM"
  | "CSIR_NET";

export type AcademicLevel =
  | "CLASS_6"
  | "CLASS_7"
  | "CLASS_8"
  | "CLASS_9"
  | "CLASS_10"
  | "CLASS_11"
  | "CLASS_12"
  | "UG_YEAR_1"
  | "UG_YEAR_2"
  | "UG_YEAR_3"
  | "PG_FOUNDATION"
  | "PG_ADVANCED";

export type SyllabusCoverage = "DIRECT" | "SUPPORTING" | "ENRICHMENT";

export type SyllabusTag = {
  board: SyllabusBoard;
  level: AcademicLevel;
  unit?: string;
  chapter?: string;
  concept?: string;
  learningOutcome?: string;
  coverage: SyllabusCoverage;
};

export type LessonPrerequisite = {
  lessonId?: string;
  conceptId?: string;
  description: string;
};

export type LessonAssessmentConfig = {
  diagnostic?: boolean;
  formative?: boolean;
  summative?: boolean;
  questionCount?: number;
  masteryThreshold?: number;
};

export type SyllabusLessonType =
  | "CONCEPT"
  | "VISUAL_EXPLORATION"
  | "PROOF"
  | "PRACTICE"
  | "APPLICATION"
  | "ASSESSMENT"
  | "PROJECT";

export type SyllabusLessonDifficulty = "FOUNDATION" | "INTERMEDIATE" | "ADVANCED" | "RIGOROUS";

export type LessonMetadata = {
  academicLevel: AcademicLevel;
  syllabusTags: SyllabusTag[];
  conceptFamily: string;
  prerequisites: LessonPrerequisite[];
  learningObjectives: string[];
  estimatedMinutes: number;
  difficulty: SyllabusLessonDifficulty;
  lessonType: SyllabusLessonType;
  engineDependencies?: string[];
  searchKeywords: string[];
  assessment?: LessonAssessmentConfig;
};

export type SchoolLessonContent = {
  summary: string;
  learn: string[];
  explore: string[];
  practice: string[];
  assessmentPrompts: string[];
  proofChecklist?: string[];
  constructionChecklist?: string[];
};

export type SchoolSyllabusLesson = {
  id: string;
  numericId: number;
  slug: string;
  route: string;
  title: string;
  boardPathways: SyllabusBoard[];
  metadata: LessonMetadata;
  content: SchoolLessonContent;
};

export type SchoolSyllabusPathway = {
  id: string;
  title: string;
  board: SyllabusBoard;
  academicLevel: AcademicLevel;
  units: Array<{
    unit: string;
    lessonIds: string[];
  }>;
};
