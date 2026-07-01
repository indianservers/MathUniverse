export type ConceptDifficulty = "foundation" | "basic" | "intermediate" | "advanced" | "olympiad";

export type ConceptCategory =
  | "numbers"
  | "algebra"
  | "geometry"
  | "trigonometry"
  | "coordinate-geometry"
  | "functions"
  | "calculus"
  | "probability"
  | "statistics"
  | "sets-logic"
  | "matrices"
  | "vectors"
  | "mensuration"
  | "visual-proofs"
  | "olympiad"
  | "computation"
  | "applied"
  | "advanced-pure";

export type LearningMode = "student" | "teacher" | "explorer";

export interface ConceptNode {
  id: string;
  title: string;
  shortTitle?: string;
  category: ConceptCategory;
  difficulty: ConceptDifficulty;
  description: string;
  whyItMatters: string;
  prerequisites: string[];
  nextConcepts: string[];
  relatedConcepts: string[];
  formulas?: string[];
  theorems?: string[];
  realLifeUses?: string[];
  availableModules: {
    formulaVisualization?: boolean;
    dictionary?: boolean;
    theorem?: boolean;
    problemSolver?: boolean;
    graph?: boolean;
    visualization2D?: boolean;
    visualization3D?: boolean;
    venn?: boolean;
    visualProof?: boolean;
    practice?: boolean;
    olympiad?: boolean;
  };
  route?: string;
  estimatedMinutes?: number;
  masteryLevel?: number;
  x: number;
  y: number;
}

export type ConceptEdgeType =
  | "prerequisite"
  | "builds-into"
  | "related"
  | "formula-link"
  | "theorem-link"
  | "application-link"
  | "visual-proof-link";

export interface ConceptEdge {
  id: string;
  source: string;
  target: string;
  type: ConceptEdgeType;
  label: string;
  strength?: number;
}

export type ConceptModuleFilter =
  | "formulaVisualization"
  | "theorem"
  | "problemSolver"
  | "graph"
  | "visualization2D"
  | "visualization3D"
  | "visualProof"
  | "venn"
  | "practice"
  | "olympiad";

export interface ConceptMapFilters {
  search?: string;
  categories?: ConceptCategory[];
  difficulties?: ConceptDifficulty[];
  modules?: ConceptModuleFilter[];
}

export interface ConceptCategoryInfo {
  id: ConceptCategory;
  label: string;
  color: string;
  softColor: string;
}
