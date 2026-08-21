import type { MathAssumption, MathDiagnostic, MathValue, TransformationRecord } from "../math-foundation/types";

export type CasStatus = "EXACT" | "CONDITIONAL" | "APPROXIMATE" | "PARTIAL" | "UNSUPPORTED" | "UNDEFINED" | "INDETERMINATE" | "NON_CONVERGENT" | "ERROR";
export type MathCondition = { id: string; expression: string; description: string; source: "INPUT" | "ASSUMPTION" | "SOLVER" | "DOMAIN" };
export type BranchRecord = { id: string; condition: string; result: string; status: "VALID" | "REJECTED" | "UNRESOLVED"; verification?: string };
export type ConvergenceReport = { converged: boolean; iterations: number; maximumIterations: number; reason: string; history?: number[] };
export type VerifiedMathStep = { id: string; before: string; after: string; ruleId: string; ruleVersion: string; ruleName: string; preconditions: string[]; assumptionsUsed: string[]; explanation: string; verificationStatus: "VERIFIED" | "CONDITIONAL" | "FAILED" };

export type CertifiedCasResult = {
  status: CasStatus;
  inputNodeId: string;
  resultNodeIds: string[];
  conditions: MathCondition[];
  excludedValues: MathValue[];
  assumptionsUsed: MathAssumption[];
  assumptionLabels: string[];
  branches: BranchRecord[];
  exactResult?: MathValue;
  exactExpression?: string;
  approximateResult?: MathValue;
  approximateExpression?: string;
  numericalMethod?: string;
  precision?: number;
  tolerance?: number;
  residual?: number;
  convergence?: ConvergenceReport;
  steps: VerifiedMathStep[];
  diagnostics: MathDiagnostic[];
  provenance: TransformationRecord[];
};

export type ParsedAssumption = { id: string; source: string; symbol: string; relation: "DOMAIN" | "GT" | "GTE" | "LT" | "LTE" | "NEQ" | "EQ" | "PROPERTY"; value?: number; domain?: "REAL" | "COMPLEX" | "INTEGER" | "NATURAL"; property?: string; enabled: boolean; mathAssumption: MathAssumption };
export type AssumptionAnalysis = { assumptions: ParsedAssumption[]; contradictions: string[] };

export type DataColumnType = "INTEGER" | "DECIMAL" | "CATEGORY" | "ORDERED_CATEGORY" | "BOOLEAN" | "DATE" | "DATETIME" | "DURATION" | "TEXT" | "UNIT_NUMBER";
export type DataCell = string | number | boolean | null;
export type DataColumn = { id: string; name: string; type: DataColumnType; unit?: string; order?: string[] };
export type DatasetTransformation = { id: string; operation: string; parameters: Record<string, unknown>; sourceDatasetId: string; createdAt: string; reversible: true; invalidRows: number[]; nodeId: string };
export type Dataset = { id: string; name: string; version: number; columns: DataColumn[]; rows: Record<string, DataCell>[]; source: "MANUAL" | "PASTE" | "CSV" | "TSV" | "SPREADSHEET" | "GENERATED" | "SIMULATION" | "DOCUMENT"; transformations: DatasetTransformation[]; parentDatasetId?: string; nodeId: string };

export type SummaryStatistics = { count: number; missing: number; mean?: number; median?: number; mode?: DataCell; min?: number; max?: number; range?: number; variance?: number; standardDeviation?: number; q1?: number; q3?: number; iqr?: number; meanAbsoluteDeviation?: number; medianAbsoluteDeviation?: number; skewness?: number; excessKurtosis?: number };
export type ModelDiagnostic = { id: string; label: string; status: "PASS" | "WARN" | "FAIL" | "NOT_APPLICABLE"; detail: string };
export type LinearModelResult = { status: "COMPLETE" | "UNSUPPORTED"; outcome: string; predictors: string[]; equation: string; coefficients: Array<{ term: string; estimate: number; standardError: number; statistic: number; pValue: number; confidenceInterval: [number, number] }>; r2: number; adjustedR2: number; residualStandardError: number; residuals: Array<{ row: number; observed: number; fitted: number; residual: number; standardizedResidual: number; leverage: number; cooksDistance: number }>; diagnostics: ModelDiagnostic[]; confidenceLevel: number; trainingRows: number[]; limitations: string[] };
export type InferenceResult = { method: string; nullHypothesis: string; alternativeHypothesis: string; statistic: number; referenceDistribution: string; degreesOfFreedom?: number; pValue: number; confidenceInterval: [number, number]; effectSize: { name: string; value: number }; assumptions: ModelDiagnostic[]; decision: string; interpretation: string; limitations: string[]; alternatives: string[] };

export type SimulationRecord = { id: string; kind: string; seed: number; generator: "mulberry32"; parameters: Record<string, number | string | boolean>; trials: number; executionVersion: string; results: number[]; summary: Record<string, number>; reproduction: string; nodeId: string };

export type AnalysisCard = { id: string; version: string; sourceDatasetId: string; transformationPipeline: DatasetTransformation[]; method: string; parameters: Record<string, unknown>; assumptions: ModelDiagnostic[]; results: unknown; diagnostics: ModelDiagnostic[]; charts: Array<{ type: string; dataNodeId: string; accessibleDescription: string }>; interpretation: string; limitations: string[]; engineVersion: string; seed?: number; accessibilityDescription: string };

export type NotebookCellType = "DEFINITION" | "CAS" | "ASSUMPTION" | "GRAPH" | "GEOMETRY" | "DATASET" | "DATA_TRANSFORMATION" | "STATISTICAL_ANALYSIS" | "SIMULATION" | "EXPLANATION" | "LESSON_ACTIVITY" | "ASSESSMENT" | "REPORT_SECTION";
export type Phase4NotebookCell = { id: string; type: NotebookCellType; source: string; dependencyNodeIds: string[]; status: "IDLE" | "DIRTY" | "RUNNING" | "COMPLETE" | "ERROR" | "CANCELLED" | "FROZEN"; result?: unknown; provenance: string[]; revision: number };
export type Phase4Notebook = { id: string; version: string; assumptions: ParsedAssumption[]; cells: Phase4NotebookCell[]; datasets: Dataset[]; simulations: SimulationRecord[]; analysisCards: AnalysisCard[]; updatedAt: string };
