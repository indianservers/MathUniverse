import { BookOpen, Calculator, FlipHorizontal2, Grid3X3, Layers3, RotateCw, Sigma, Sparkles, Workflow } from "lucide-react";

export type MatrixOperationId =
  | "basics"
  | "addition"
  | "subtraction"
  | "scalar-multiplication"
  | "multiplication"
  | "transpose"
  | "determinant"
  | "inverse"
  | "adjoint-cofactor"
  | "rank"
  | "row-operations"
  | "linear-equations"
  | "eigenvalues-eigenvectors"
  | "transformations";

export type MatrixOperationMeta = {
  id: MatrixOperationId;
  title: string;
  route: string;
  explanation: string;
  difficulty: "Basic" | "Intermediate" | "Advanced";
  classRelevance: string;
  icon: typeof Grid3X3;
  topics?: string[];
};

export const matrixOperations: MatrixOperationMeta[] = [
  {
    id: "basics",
    title: "Matrix Basics",
    route: "/matrices/basics",
    explanation: "Understand rows, columns, matrix order, notation, and important matrix types.",
    difficulty: "Basic",
    classRelevance: "Class 11 / Class 12",
    icon: BookOpen,
    topics: ["What is a matrix?", "Rows and columns", "Order", "Square", "Row", "Column", "Zero", "Identity", "Diagonal", "Symmetric"],
  },
  { id: "addition", title: "Matrix Addition", route: "/matrices/addition", explanation: "Add corresponding elements when two matrices have the same order.", difficulty: "Basic", classRelevance: "Class 12", icon: Grid3X3 },
  { id: "subtraction", title: "Matrix Subtraction", route: "/matrices/subtraction", explanation: "Subtract corresponding elements and compare A - B with B - A.", difficulty: "Basic", classRelevance: "Class 12", icon: Grid3X3 },
  { id: "scalar-multiplication", title: "Scalar Multiplication", route: "/matrices/scalar-multiplication", explanation: "Multiply every matrix element by the same scalar.", difficulty: "Basic", classRelevance: "Class 11 / Class 12", icon: Calculator },
  { id: "multiplication", title: "Matrix Multiplication", route: "/matrices/multiplication", explanation: "Use row-column dot products to build a product matrix.", difficulty: "Intermediate", classRelevance: "Class 12 / Engineering", icon: Workflow },
  { id: "transpose", title: "Transpose of Matrix", route: "/matrices/transpose", explanation: "Turn rows into columns and columns into rows.", difficulty: "Basic", classRelevance: "Class 12", icon: FlipHorizontal2 },
  { id: "determinant", title: "Determinant", route: "/matrices/determinant", explanation: "Measure signed area or volume scaling for square matrices.", difficulty: "Intermediate", classRelevance: "Class 12 / Degree", icon: Sigma },
  { id: "inverse", title: "Inverse Matrix", route: "/matrices/inverse", explanation: "Find the matrix that reverses a transformation when determinant is non-zero.", difficulty: "Intermediate", classRelevance: "Class 12 / Engineering", icon: RotateCw },
  { id: "adjoint-cofactor", title: "Adjoint / Cofactor Matrix", route: "/matrices/adjoint-cofactor", explanation: "Build minors, cofactors, and the adjoint used in inverse formulas.", difficulty: "Advanced", classRelevance: "Class 12 / Degree", icon: Layers3 },
  { id: "rank", title: "Rank of Matrix", route: "/matrices/rank", explanation: "Use row echelon form to count independent rows or columns.", difficulty: "Intermediate", classRelevance: "Class 12 / Degree", icon: Sigma },
  { id: "row-operations", title: "Row Operations", route: "/matrices/row-operations", explanation: "Practice swaps, row scaling, and row replacement interactively.", difficulty: "Basic", classRelevance: "Class 12 / Degree", icon: Workflow },
  { id: "linear-equations", title: "System of Linear Equations", route: "/matrices/linear-equations", explanation: "Solve equations using augmented matrices and connect them to line intersections.", difficulty: "Intermediate", classRelevance: "Class 12 / Engineering", icon: Calculator },
  { id: "eigenvalues-eigenvectors", title: "Eigenvalues and Eigenvectors", route: "/matrices/eigenvalues-eigenvectors", explanation: "Find directions that keep their line after a matrix transformation.", difficulty: "Advanced", classRelevance: "Degree / Engineering", icon: Sparkles },
  { id: "transformations", title: "Matrix Transformations in 2D Geometry", route: "/matrices/transformations", explanation: "Visualize scaling, rotation, reflection, and shear on a coordinate grid.", difficulty: "Intermediate", classRelevance: "Class 12 / Engineering", icon: Layers3 },
];

export function getMatrixOperation(id: string | undefined) {
  return matrixOperations.find((operation) => operation.id === id);
}
