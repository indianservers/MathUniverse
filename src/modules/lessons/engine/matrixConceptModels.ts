import {
  addMatrices,
  apply2DTransformation,
  determinant,
  formatNumber,
  inverse,
  multiplyMatrices,
  rankMatrix,
  rowAddMultiple,
  scalarMultiply,
  subtractMatrices,
  transposeMatrix,
  type Matrix,
} from "../../../utils/matrixOperations";
import {
  checkBasis2D,
  rref,
  solveAugmentedRref,
  type Vector2,
} from "../../../utils/mathEngine/linearAlgebraUtils";
import type { MatrixLessonMode } from "../presets/matrixLessonPresets";

export type MatrixInputs = {
  a: number;
  b: number;
  c: number;
  d: number;
  k: number;
};
export type MatrixConceptConfig = {
  defaults: MatrixInputs;
  entryLabels: [string, string, string, string];
  scalar?: { label: string; min: number; max: number; step: number };
};
export type MatrixVector = {
  label: string;
  x: number;
  y: number;
  colour: string;
};
export type MatrixConceptModel = {
  label: string;
  value: number | string;
  display: string;
  formula: string;
  summary: string;
  prompt: string;
  expected: string;
  hint: string;
  challengeKind: "numeric" | "keywords";
  resultMatrix: Matrix;
  steps: string[];
  vectors: MatrixVector[];
  insight: string;
};

const matrixLabels: MatrixConceptConfig["entryLabels"] = [
  "A row 1 column 1",
  "A row 1 column 2",
  "A row 2 column 1",
  "A row 2 column 2",
];
const defaults = (values: Partial<MatrixInputs> = {}): MatrixInputs => ({
  a: 2,
  b: 1,
  c: 1,
  d: 2,
  k: 2,
  ...values,
});
const config = (
  values: Partial<MatrixInputs> = {},
  scalar?: MatrixConceptConfig["scalar"],
  entryLabels = matrixLabels,
): MatrixConceptConfig => ({
  defaults: defaults(values),
  entryLabels,
  scalar,
});

export const matrixConceptConfigs: Record<
  Exclude<MatrixLessonMode, "eigen-directions">,
  MatrixConceptConfig
> = {
  builder: config(),
  "addition-subtraction": config(
    { k: 1 },
    { label: "Operation (+1 add, −1 subtract)", min: -1, max: 1, step: 1 },
  ),
  "scalar-multiplication": config(
    {},
    { label: "Scalar k", min: -5, max: 5, step: 0.5 },
  ),
  "matrix-multiplication": config(),
  identity: config(),
  transpose: config(),
  determinant: config(),
  inverse: config(),
  "row-operations": config(
    {},
    { label: "Row multiple k", min: -5, max: 5, step: 0.5 },
  ),
  rref: config(),
  augmented: config(
    { k: 5 },
    { label: "First equation RHS", min: -20, max: 20, step: 1 },
  ),
  "linear-transformations": config(),
  "basis-dimension": config(),
  "linear-independence": config(),
  "vector-spaces": config(
    {},
    { label: "Combination coefficient", min: -5, max: 5, step: 0.5 },
  ),
  "gram-schmidt": config({ a: 1, b: 1, c: 1, d: 0 }),
  "least-squares": config(
    { a: 2, b: 3, c: 5, d: 3, k: 0 },
    { label: "Adjustment to y₂", min: -10, max: 10, step: 0.5 },
    ["Observed y₀", "Observed y₁", "Observed y₂", "Prediction x"],
  ),
};

export function deriveMatrixConceptModel(
  mode: Exclude<MatrixLessonMode, "eigen-directions">,
  input: MatrixInputs,
): MatrixConceptModel {
  const matrix: Matrix = [
    [input.a, input.b],
    [input.c, input.d],
  ];
  const make = (
    label: string,
    value: number | string,
    formula: string,
    prompt: string,
    hint: string,
    resultMatrix: Matrix,
    steps: string[],
    vectors: MatrixVector[],
    insight: string,
    challengeKind: MatrixConceptModel["challengeKind"] = "numeric",
  ): MatrixConceptModel => {
    const display =
      typeof value === "number" ? formatNumber(value) : String(value);
    return {
      label,
      value,
      display,
      formula,
      prompt,
      expected:
        typeof value === "number" ? value.toFixed(3) : value.toLowerCase(),
      hint,
      challengeKind,
      resultMatrix,
      steps,
      vectors,
      insight,
      summary: `${label} is ${display}. ${insight}`,
    };
  };
  const columnVectors = (result = matrix): MatrixVector[] => [
    { label: "column 1", x: result[0]?.[0] ?? 0, y: result[1]?.[0] ?? 0, colour: "#22d3ee" },
    { label: "column 2", x: result[0]?.[1] ?? 0, y: result[1]?.[1] ?? 0, colour: "#f59e0b" },
  ];

  if (mode === "builder") {
    const sum = matrix.flat().reduce((total, value) => total + value, 0);
    return make("Sum of matrix entries", sum, "A = [aᵢⱼ]", "What is the sum of all entries in the active matrix?", "Add the four editable cells.", matrix, ["Edit any cell to rebuild matrix A."], columnVectors(), "The two columns are shown as vectors.");
  }
  if (mode === "addition-subtraction") {
    const other: Matrix = [[2, -1], [1, 3]];
    const adding = input.k >= 0;
    const result = adding
      ? addMatrices(matrix, other)
      : subtractMatrices(matrix, other);
    return make(
      `Entry C₁₁ of A${adding ? "+" : "−"}B`,
      result.result[0][0],
      `C = A ${adding ? "+" : "−"} B`,
      `What is entry C₁₁ in the displayed matrix ${
        adding ? "sum" : "difference"
      }?`,
      `${adding ? "Add" : "Subtract"} corresponding row-1 column-1 entries.`,
      result.result,
      result.steps.map((step) => step.calculation),
      columnVectors(result.result),
      "B is fixed at [[2,−1],[1,3]]; every result entry is computed cell by cell.",
    );
  }
  if (mode === "scalar-multiplication") {
    const result = scalarMultiply(input.k, matrix);
    return make("Scaled entry C₁₁", result.result[0][0], "C = kA", "What is entry C₁₁ after scalar multiplication?", "Multiply A₁₁ by the active scalar.", result.result, result.steps.map((step) => step.calculation), columnVectors(result.result), `Every entry is multiplied by k=${formatNumber(input.k)}.`);
  }
  if (mode === "matrix-multiplication") {
    const other: Matrix = [[2, 1], [-1, 3]];
    const result = multiplyMatrices(matrix, other);
    return make("Product entry C₁₁", result.result[0][0], "C = AB", "What is product entry C₁₁?", "Take row 1 of A dotted with column 1 of B.", result.result, result.steps.map((step) => step.calculation), columnVectors(result.result), "B is fixed at [[2,1],[−1,3]]; rows of A combine columns of B.");
  }
  if (mode === "identity") {
    const result = multiplyMatrices(matrix, [[1, 0], [0, 1]]);
    const trace = result.result[0][0] + result.result[1][1];
    return make("Trace after multiplying by I", trace, "AI = IA = A", "What trace is displayed after multiplying A by the identity?", "The identity leaves every entry unchanged; add the diagonal.", result.result, ["Multiply each row of A by the matching identity column.", "Verify AI=A."], columnVectors(result.result), "The result exactly matches A.");
  }
  if (mode === "transpose") {
    const result = transposeMatrix(matrix);
    return make("Transpose entry (2,1)", result.result[1][0], "Aᵀᵢⱼ = Aⱼᵢ", "What is entry row 2, column 1 of Aᵀ?", "Rows become columns.", result.result, result.steps.map((step) => step.calculation), columnVectors(result.result), "The off-diagonal entries exchange positions.");
  }
  if (mode === "determinant") {
    const value = determinant(matrix);
    return make("Determinant", value, "det(A)=ad−bc", "What determinant is displayed?", "Subtract the off-diagonal product from the main-diagonal product.", [[value]], [`${formatNumber(input.a * input.d)} − ${formatNumber(input.b * input.c)} = ${formatNumber(value)}`], columnVectors(), Math.abs(value) < 1e-10 ? "The transformation collapses area and is singular." : `Oriented area scale is ${formatNumber(value)}.`);
  }
  if (mode === "inverse") {
    const result = inverse(matrix);
    if (result.error) {
      return make("Inverse status", "singular", "A⁻¹ exists iff det(A)≠0", "Is the active matrix invertible or singular?", "A zero determinant means no inverse exists.", [], [result.error], columnVectors(), result.error, "keywords");
    }
    return make("Inverse entry (1,1)", result.result[0][0], "A⁻¹=(1/det A)adj(A)", "What is entry row 1, column 1 of A⁻¹?", "Use the reciprocal determinant and adjugate.", result.result, result.steps.map((step) => step.calculation), columnVectors(result.result), "Multiplying A by this result produces the identity.");
  }
  if (mode === "row-operations") {
    const result = rowAddMultiple(matrix, 1, 0, -input.k);
    return make("New row-2 first entry", result.result[1][0], "R₂ → R₂ − kR₁", "What is the new first entry of row 2?", "Subtract k times the row-1 entry from row 2.", result.result, result.steps.map((step) => step.calculation), columnVectors(result.result), "The row operation preserves the solution set.");
  }
  if (mode === "rref") {
    const result = rref(matrix);
    return make("Number of pivots", result.rank, "RREF(A)", "How many pivots are in the displayed RREF?", "Count leading ones in the reduced matrix.", result.result, result.steps.map((step) => `${step.title}: ${step.operation}`), columnVectors(result.result), `Rank ${result.rank} equals the number of pivot columns.`);
  }
  if (mode === "augmented") {
    const augmented: Matrix = [[input.a, input.b, input.k], [input.c, input.d, 4]];
    const result = solveAugmentedRref(augmented);
    if (!result.solution) {
      return make("System status", result.status, "[A|b] → RREF", "What solution status is displayed?", "Compare coefficient and augmented pivots.", result.result, result.steps.map((step) => `${step.title}: ${step.operation}`), columnVectors(), `The augmented system is ${result.status}.`, "keywords");
    }
    return make("Solution x", result.solution[0], "[A|b] → [I|x]", "What x-value solves the active augmented system?", "Read x from the reduced augmented matrix.", result.result, result.steps.map((step) => `${step.title}: ${step.operation}`), [{ label: "solution", x: result.solution[0], y: result.solution[1], colour: "#f59e0b" }], `Unique solution (${formatNumber(result.solution[0])}, ${formatNumber(result.solution[1])}).`);
  }
  if (mode === "linear-transformations") {
    const corners = apply2DTransformation(matrix, [[-1, -1], [1, -1], [1, 1], [-1, 1]]);
    const areaScale = Math.abs(determinant(matrix));
    return make("Area scale factor", areaScale, "[x′,y′]ᵀ=A[x,y]ᵀ", "What area scale factor does the active transformation have?", "Use the absolute determinant.", corners.map(([x, y]) => [x, y]), ["Transform every corner with the same matrix.", "Compare original and transformed area."], columnVectors(), `The unit square becomes a parallelogram with area scale ${formatNumber(areaScale)}.`);
  }
  if (mode === "basis-dimension" || mode === "linear-independence") {
    const basis = checkBasis2D([input.a, input.c], [input.b, input.d]);
    const rank = rankMatrix(matrix).rank;
    if (mode === "linear-independence") {
      const status = basis.isBasis ? "independent" : "dependent";
      return make("Column-vector status", status, "det([u v]) ≠ 0 ⇔ independent", "Are the active column vectors independent or dependent?", "A nonzero determinant means neither vector is redundant.", matrix, [`det([u v]) = ${formatNumber(basis.determinant)}`], columnVectors(), basis.explanation, "keywords");
    }
    return make("Span dimension", rank, "dim(span{u,v}) = rank([u v])", "What is the dimension of the active span?", "Count independent pivot columns.", matrix, [`det([u v]) = ${formatNumber(basis.determinant)}`, `rank = ${rank}`], columnVectors(), basis.explanation);
  }
  if (mode === "vector-spaces") {
    const u: Vector2 = [input.a, input.c];
    const v: Vector2 = [input.b, input.d];
    const combination: Vector2 = [input.k * u[0] + v[0], input.k * u[1] + v[1]];
    return make("Combination x-coordinate", combination[0], "w = ku + v", "What is the x-coordinate of the active linear combination?", "Multiply u by k, then add v componentwise.", [[u[0], v[0], combination[0]], [u[1], v[1], combination[1]]], [`${formatNumber(input.k)}(${formatNumber(u[0])}) + ${formatNumber(v[0])} = ${formatNumber(combination[0])}`], [...columnVectors(), { label: "w", x: combination[0], y: combination[1], colour: "#a78bfa" }], "Every displayed combination remains inside span{u,v}.");
  }
  if (mode === "gram-schmidt") {
    const u: Vector2 = [input.a, input.c];
    const v: Vector2 = [input.b, input.d];
    const uNorm = Math.hypot(...u);
    const e1: Vector2 = uNorm < 1e-10 ? [0, 0] : [u[0] / uNorm, u[1] / uNorm];
    const projection = v[0] * e1[0] + v[1] * e1[1];
    const orthogonal: Vector2 = [v[0] - projection * e1[0], v[1] - projection * e1[1]];
    const orthogonalNorm = Math.hypot(...orthogonal);
    const e2: Vector2 = orthogonalNorm < 1e-10 ? [0, 0] : [orthogonal[0] / orthogonalNorm, orthogonal[1] / orthogonalNorm];
    return make("Second orthogonal-vector length", orthogonalNorm, "v⊥ = v − projᵤ(v)", "What is the length of the second orthogonal vector?", "Subtract v's projection onto the first unit vector.", [[e1[0], e2[0]], [e1[1], e2[1]]], [`proj coefficient = ${formatNumber(projection)}`, `v⊥ = (${formatNumber(orthogonal[0])}, ${formatNumber(orthogonal[1])})`], [{ label: "e₁", x: e1[0], y: e1[1], colour: "#22d3ee" }, { label: "v⊥", x: orthogonal[0], y: orthogonal[1], colour: "#f59e0b" }], orthogonalNorm < 1e-10 ? "The input vectors are dependent, so a second basis direction cannot be created." : `The normalized directions have dot product ${formatNumber(e1[0] * e2[0] + e1[1] * e2[1])}.`);
  }

  const observations = [input.a, input.b, input.c + input.k];
  const meanY = observations.reduce((sum, value) => sum + value, 0) / 3;
  const slope = (observations[2] - observations[0]) / 2;
  const intercept = meanY - slope;
  const prediction = intercept + slope * input.d;
  const residuals = observations.map(
    (value, index) => value - (intercept + slope * index),
  );
  return make("Least-squares prediction", prediction, "β=(XᵀX)⁻¹Xᵀy", "What least-squares prediction is displayed at the active x?", "Use the fitted intercept and slope at the selected x.", [[intercept, slope], [input.d, prediction]], [`intercept = ${formatNumber(intercept)}`, `slope = ${formatNumber(slope)}`, `residuals = ${residuals.map(formatNumber).join(", ")}`], [{ label: "fit at x", x: input.d, y: prediction, colour: "#f59e0b" }], `Best-fit line y=${formatNumber(intercept)}+${formatNumber(slope)}x; residual sum is ${formatNumber(residuals.reduce((sum, value) => sum + value, 0))}.`);
}
