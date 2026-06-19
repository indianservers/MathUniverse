import type { PhaseTwoProofConfig, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";
import {
  DeterminantAreaVisual,
  EigenvectorVisual,
  LinearSystemVisual,
  LinearTransformationVisual,
  MatrixAdditionVisual,
  MatrixInverseVisual,
  MatrixMultiplicationVisual,
  RowOperationsVisual,
} from "./PhaseNineteenMatrixVisualModels";

const labelsToggle = { id: "labels", label: "Show labels", defaultValue: true };
const matrixRoute = "/olympyard/practice/linear-algebra-foundations";
const matrixEntries = [
  param("a1", "A11", -5, 5, 1, 1),
  param("a2", "A12", -5, 5, 2, 1),
  param("a3", "A21", -5, 5, 3, 1),
  param("a4", "A22", -5, 5, 4, 1),
  param("b1", "B11", -5, 5, 2, 1),
  param("b2", "B12", -5, 5, -1, 1),
  param("b3", "B21", -5, 5, 0, 1),
  param("b4", "B22", -5, 5, 3, 1),
  param("row", "Selected row", 0, 1, 1, 1),
  param("col", "Selected column", 0, 1, 0, 1),
];
const transformEntries = [
  param("a", "a", -3, 3, 1.4, 0.1),
  param("b", "b", -3, 3, 0.7, 0.1),
  param("c", "c", -3, 3, 0.4, 0.1),
  param("d", "d", -3, 3, 1.2, 0.1),
  param("vx", "Vector x", -4, 4, 2, 0.1),
  param("vy", "Vector y", -4, 4, 1.2, 0.1),
];

export const matrixAdditionPhaseNineteenConfig = makeConfig({
  modelKey: "cell-by-cell",
  steps: ["Build matrices A and B", "Check same dimensions", "Select one cell", "Add matching entries", "Fill result cell", "Conclude cell-by-cell addition"],
  parameters: matrixEntries,
  prediction: ["What entry of A and B creates the entry in row 2, column 1 of A+B?", "The row 2, column 1 entries of A and B."],
  misconception: ["Matrix addition mixes rows and columns like multiplication.", "Matrix addition is position-by-position, not row-by-column."],
  tokens: ["A-ij", "B-ij", "A-plus-B-ij", "same-size"],
  formula: (values) => {
    const selected = selectedIndex(values);
    const a = matrixA(values);
    const b = matrixB(values);
    return `(A+B)_ij = A_ij + B_ij = ${a[selected]} + ${b[selected]} = ${a[selected] + b[selected]}`;
  },
  liveValues: (values) => {
    const selected = selectedIndex(values);
    const a = matrixA(values);
    const b = matrixB(values);
    return [value("matrix-dimensions", "matrix dimensions", "2 x 2"), value("selected-row-column", "selected row/column", `${Math.round(values.row) + 1}, ${Math.round(values.col) + 1}`), value("A-ij", "A_ij", a[selected]), value("B-ij", "B_ij", b[selected]), value("result-entry", "result entry", a[selected] + b[selected]), value("invariant", "invariant", "addition happens cell-by-cell for same-sized matrices")];
  },
  invariant: () => "Only matching positions are added, and dimensions must match.",
  renderVisual: MatrixAdditionVisual,
});

export const matrixMultiplicationPhaseNineteenConfig = makeConfig({
  modelKey: "row-column-dot-product",
  steps: ["Choose result cell", "Highlight row in A", "Highlight column in B", "Multiply matching pairs", "Add the products", "Fill the result entry"],
  parameters: matrixEntries,
  prediction: ["What do we combine to compute one entry of AB?", "A row of A and a column of B."],
  misconception: ["Matrix multiplication is just multiplying matching cells.", "Each product entry is a dot product of a row and a column."],
  tokens: ["row-i", "column-j", "dot-product-terms", "AB-ij"],
  formula: (values) => {
    const row = Math.round(values.row);
    const col = Math.round(values.col);
    const rowVector = rowOf(matrixA(values), row);
    const columnVector = colOf(matrixB(values), col);
    const products = rowVector.map((item, index) => item * columnVector[index]);
    return `(AB)_ij = row i dot column j = ${products.join(" + ")} = ${sum(products)}`;
  },
  liveValues: (values) => {
    const row = Math.round(values.row);
    const col = Math.round(values.col);
    const rowVector = rowOf(matrixA(values), row);
    const columnVector = colOf(matrixB(values), col);
    const products = rowVector.map((item, index) => item * columnVector[index]);
    return [value("selected-i-j", "selected i,j", `${row + 1}, ${col + 1}`), value("row-vector", "row vector", rowVector.join(", ")), value("column-vector", "column vector", columnVector.join(", ")), value("pairwise-products", "pairwise products", products.join(", ")), value("dot-product-sum", "dot product sum", sum(products)), value("result-cell", "result cell", sum(products)), value("invariant", "invariant", "product entry is row-column dot product")];
  },
  invariant: () => "A product entry comes from one row of A and one column of B.",
  renderVisual: MatrixMultiplicationVisual,
});

export const matrixTransformationPhaseNineteenConfig = makeConfig({
  modelKey: "basis-vector-transformation",
  steps: ["Show original grid", "Show basis vectors", "Apply matrix to basis vectors", "Deform grid", "Transform vector v", "Conclude matrix as transformation"],
  parameters: transformEntries,
  prediction: ["What do the columns of a 2x2 matrix tell us?", "Where the basis vectors land after transformation."],
  misconception: ["A matrix is only a table of numbers.", "A matrix can represent a transformation of space."],
  tokens: ["first-column", "second-column", "Av", "matrix-entries"],
  formula: ({ a, b, c, d, vx, vy }) => `Av = [${a} ${b}; ${c} ${d}] [${vx}; ${vy}] = (${fmt(a * vx + b * vy)}, ${fmt(c * vx + d * vy)})`,
  liveValues: ({ a, b, c, d, vx, vy }) => [value("matrix-entries", "matrix entries", `[[${a}, ${b}], [${c}, ${d}]]`), value("input-vector-v", "input vector v", `(${fmt(vx)}, ${fmt(vy)})`), value("transformed-vector-Av", "transformed vector Av", `(${fmt(a * vx + b * vy)}, ${fmt(c * vx + d * vy)})`), value("transformed-basis-vectors", "transformed basis vectors", `Ai=(${a}, ${c}), Aj=(${b}, ${d})`), value("determinant", "determinant", fmt(a * d - b * c)), value("invariant", "invariant", "Av is a linear combination of transformed basis vectors")],
  invariant: () => "The columns of A are the landing places of the basis vectors.",
  renderVisual: LinearTransformationVisual,
});

export const determinantPhaseNineteenConfig = makeConfig({
  modelKey: "area-scale",
  steps: ["Start with unit square", "Transform basis vectors", "Form parallelogram", "Measure area scale", "Compare with ad-bc", "Conclude determinant meaning"],
  parameters: transformEntries.slice(0, 4),
  prediction: ["What happens to orientation when determinant is negative?", "The transformation flips orientation."],
  misconception: ["Determinant is just a number with no geometric meaning.", "For 2D matrices, determinant tells signed area scaling."],
  tokens: ["ad", "bc", "ad-minus-bc", "transformed-area"],
  formula: ({ a, b, c, d }) => `det([[a,b],[c,d]]) = ad - bc = ${fmt(a * d)} - ${fmt(b * c)} = ${fmt(a * d - b * c)}`,
  liveValues: ({ a, b, c, d }) => [value("matrix-entries", "matrix entries", `[[${a}, ${b}], [${c}, ${d}]]`), value("determinant", "determinant", fmt(a * d - b * c)), value("absolute-area-scale", "absolute area scale", fmt(Math.abs(a * d - b * c))), value("orientation-sign", "orientation sign", a * d - b * c < 0 ? "flipped" : "preserved"), value("transformed-basis-vectors", "transformed basis vectors", `(${a}, ${c}), (${b}, ${d})`), value("invariant", "invariant", "area scale equals |det(A)|")],
  invariant: ({ a, b, c, d }) => `The transformed unit square has area scale ${fmt(Math.abs(a * d - b * c))}.`,
  renderVisual: DeterminantAreaVisual,
});

export const linearSystemPhaseNineteenConfig = makeConfig({
  modelKey: "line-intersection",
  steps: ["Draw first equation as a line", "Draw second equation as a line", "Find intersection", "Test point in both equations", "Check special cases", "Conclude system solution"],
  parameters: [param("a1", "a1", -5, 5, 1, 1), param("b1", "b1", -5, 5, 1, 1), param("c1", "c1", -8, 8, 5, 1), param("a2", "a2", -5, 5, 2, 1), param("b2", "b2", -5, 5, -1, 1), param("c2", "c2", -8, 8, 1, 1)],
  prediction: ["What does the intersection point represent?", "The pair (x,y) that satisfies both equations."],
  misconception: ["Two equations always have exactly one solution.", "Lines can intersect once, be parallel, or coincide."],
  tokens: ["first-equation", "second-equation", "intersection", "determinant-condition"],
  formula: ({ a1, b1, c1, a2, b2, c2 }) => `Solve ${a1}x + ${b1}y = ${c1}, ${a2}x + ${b2}y = ${c2}; det = ${fmt(a1 * b2 - a2 * b1)}`,
  liveValues: (values) => {
    const s = system(values);
    const solution = solveSystem(s);
    const determinant = s.a1 * s.b2 - s.a2 * s.b1;
    return [value("equation-1-coefficients", "equation 1 coefficients", `${s.a1}, ${s.b1}, ${s.c1}`), value("equation-2-coefficients", "equation 2 coefficients", `${s.a2}, ${s.b2}, ${s.c2}`), value("slopes-intercepts", "slopes/intercepts", `${fmt(-s.a1 / s.b1)}, ${fmt(s.c1 / s.b1)}; ${fmt(-s.a2 / s.b2)}, ${fmt(s.c2 / s.b2)}`), value("intersection-point", "intersection point", solution ? `(${fmt(solution.x)}, ${fmt(solution.y)})` : "none"), value("determinant", "determinant", fmt(determinant)), value("solution-status", "solution status", solution ? "one solution" : "no unique solution"), value("invariant", "invariant", "solution satisfies both equations")];
  },
  invariant: () => "The solution point must lie on both equation lines.",
  renderVisual: LinearSystemVisual,
});

export const rowOperationsPhaseNineteenConfig = makeConfig({
  modelKey: "solution-preservation",
  steps: ["Start with a system", "Show solution point", "Choose row operation", "Transform equations", "Compare solution point", "Conclude row operations preserve solutions"],
  parameters: [param("k", "Row operation multiplier k", -3, 3, 1, 0.5)],
  prediction: ["What should happen to the solution after a valid row operation?", "It should remain the same."],
  misconception: ["Changing equations always changes the solution.", "Elementary row operations transform the system into an equivalent one with the same solution set."],
  tokens: ["row-operation", "solution-point", "equivalent-system"],
  formula: ({ k }) => `R2 -> R2 + ${fmt(k)}R1 creates an equivalent system with the same solution set.`,
  liveValues: ({ k }) => [value("original-system", "original system", "x+y=5; 2x-y=1"), value("transformed-system", "transformed system", `x+y=5; ${(2 + k)}x+${(-1 + k)}y=${(1 + 5 * k)}`), value("operation", "operation", `R2 + ${fmt(k)}R1`), value("original-solution", "original solution", "(2, 3)"), value("transformed-solution", "transformed solution", "(2, 3)"), value("invariant", "invariant", "solution set is preserved")],
  invariant: () => "Elementary row operations preserve the solution set.",
  renderVisual: RowOperationsVisual,
});

export const eigenvectorsPhaseNineteenConfig = makeConfig({
  modelKey: "Av-lambda-v",
  steps: ["Choose a matrix", "Draw vector v", "Transform it to Av", "Compare directions", "Find directions that do not turn", "Conclude Av = lambda v"],
  parameters: [param("theta", "Vector angle theta", -3.14, 3.14, 0.2, 0.05)],
  prediction: ["What makes a vector an eigenvector?", "After transformation, it stays on the same line, only scaled."],
  misconception: ["Every vector is an eigenvector.", "Only special directions remain on their own line after transformation."],
  tokens: ["Av", "lambda-v", "same-direction-line", "lambda"],
  formula: ({ theta }) => `For A=[[2,0],[0,0.6]], v=(cos theta, sin theta). Eigenvectors satisfy Av = lambda v. theta=${fmt(theta)}`,
  liveValues: ({ theta }) => {
    const v = { x: Math.cos(theta), y: Math.sin(theta) };
    const av = { x: 2 * v.x, y: 0.6 * v.y };
    const angle = angleBetween(v, av);
    return [value("matrix", "matrix", "[[2,0],[0,0.6]]"), value("v", "v", `(${fmt(v.x)}, ${fmt(v.y)})`), value("Av", "Av", `(${fmt(av.x)}, ${fmt(av.y)})`), value("angle-between-v-and-Av", "angle between v and Av", `${fmt(angle)} deg`), value("lambda-estimate", "lambda estimate", fmt(Math.abs(v.x) > Math.abs(v.y) ? av.x / v.x : av.y / v.y)), value("eigenvector-status", "eigenvector status", angle < 3 ? "aligned" : "not aligned"), value("invariant", "invariant", "eigenvector keeps direction under transformation")];
  },
  invariant: () => "An eigenvector may stretch, shrink, or flip, but it stays on the same line.",
  renderVisual: EigenvectorVisual,
});

export const matrixInversePhaseNineteenConfig = makeConfig({
  modelKey: "determinant-invertibility",
  steps: ["Start with vector/grid", "Apply A", "Check determinant", "Apply A inverse if possible", "Compare with original", "Conclude A inverse A = I"],
  parameters: transformEntries,
  prediction: ["When does a 2x2 matrix fail to have an inverse?", "When determinant is 0."],
  misconception: ["Every matrix transformation can be undone.", "If a transformation collapses area/space, information is lost and it cannot be inverted."],
  tokens: ["A", "A-inverse", "I", "determinant-nonzero"],
  formula: ({ a, b, c, d }) => `A^-1A = I when det(A) != 0; det(A) = ${fmt(a * d - b * c)}`,
  liveValues: ({ a, b, c, d, vx, vy }) => {
    const determinant = a * d - b * c;
    const av = { x: a * vx + b * vy, y: c * vx + d * vy };
    return [value("matrix-A", "matrix A", `[[${a}, ${b}], [${c}, ${d}]]`), value("determinant", "determinant", fmt(determinant)), value("invertible-status", "invertible status", Math.abs(determinant) > 0.001 ? "invertible" : "not invertible"), value("input-vector-v", "input vector v", `(${fmt(vx)}, ${fmt(vy)})`), value("Av", "Av", `(${fmt(av.x)}, ${fmt(av.y)})`), value("A-inverse-Av", "A^-1Av", Math.abs(determinant) > 0.001 ? `(${fmt(vx)}, ${fmt(vy)})` : "unavailable"), value("invariant", "invariant", "A^-1Av = v when det(A) != 0")];
  },
  invariant: ({ a, b, c, d }) => Math.abs(a * d - b * c) > 0.001 ? "The inverse undoes A, so the net transformation is identity." : "Determinant is zero, so the transformation cannot be undone.",
  renderVisual: MatrixInverseVisual,
});

export const phaseNineteenRouteSlugs = [
  ["matrices-linear-algebra", "matrix-addition-cell-by-cell"],
  ["matrices-linear-algebra", "matrix-multiplication-row-column"],
  ["matrices-linear-algebra", "matrix-linear-transformation-grid"],
  ["matrices-linear-algebra", "determinant-area-scale-factor"],
  ["matrices-linear-algebra", "linear-system-line-intersection"],
  ["matrices-linear-algebra", "row-operations-preserve-solutions"],
  ["matrices-linear-algebra", "eigenvectors-directions-do-not-turn"],
  ["matrices-linear-algebra", "matrix-inverse-undo-transformation"],
] as const;

export const phaseNineteenConfigs = [
  matrixAdditionPhaseNineteenConfig,
  matrixMultiplicationPhaseNineteenConfig,
  matrixTransformationPhaseNineteenConfig,
  determinantPhaseNineteenConfig,
  linearSystemPhaseNineteenConfig,
  rowOperationsPhaseNineteenConfig,
  eigenvectorsPhaseNineteenConfig,
  matrixInversePhaseNineteenConfig,
];

type ConfigInput = {
  modelKey: string;
  steps: string[];
  parameters: PhaseTwoProofConfig["parameters"];
  prediction: [string, string];
  misconception: [string, string];
  tokens: string[];
  formula: PhaseTwoProofConfig["formula"];
  liveValues: PhaseTwoProofConfig["liveValues"];
  invariant: (values: PhaseTwoValues) => string;
  renderVisual: PhaseTwoProofConfig["renderVisual"];
};

function makeConfig(input: ConfigInput): PhaseTwoProofConfig & { phaseNineteenModelKey: string } {
  return {
    phaseNineteenModelKey: input.modelKey,
    steps: input.steps.map(step),
    parameters: input.parameters,
    toggles: [labelsToggle],
    olympyardRoute: matrixRoute,
    prediction: prompt(input.prediction[0], input.prediction[1]),
    misconception: misconception(input.misconception[0], input.misconception[1]),
    formulaTokens: () => input.tokens.map((token) => ({ id: token, label: tokenLabel(token), visualLabel: tokenVisualLabel(token) })),
    formula: input.formula,
    explanation: (values) => input.invariant(values),
    liveValues: input.liveValues,
    invariants: (values) => [{ id: `matrix-${input.modelKey}-invariant`, label: "matrix invariant", holds: true, explanation: input.invariant(values) }],
    assumptions: ["Browser-only SVG matrix and transformation model.", "Sliders are bounded to keep grids and labels readable.", "Rounded displays support classroom intuition while formulas preserve the linear algebra structure."],
    renderVisual: input.renderVisual,
  };
}

function param(id: string, label: string, min: number, max: number, defaultValue: number, step = 1) {
  return { id, label, min, max, defaultValue, step };
}
function value(id: string, label: string, item: number | string) { return { id, label, value: item }; }
function step(title: string, index: number) { return { id: `p19-${index}`, title, description: title, focusLabel: index < 2 ? "matrix setup" : index < 5 ? "linear structure" : "conclusion" }; }
function prompt(question: string, answer: string) {
  return { question, correctFeedback: `Yes. ${answer}`, incorrectFeedback: "Use the matrix, vector, grid, or system visual before choosing.", revealAfterAnswer: true, options: [{ id: "correct", label: answer, correct: true, feedback: "Correct." }, { id: "shortcut", label: "Use a memorized rule without the visual.", feedback: "The visual explains why the linear algebra rule works." }] };
}
function misconception(question: string, explanation: string) {
  return { question, explanation, visualHint: "Highlight the connected matrix or transformation feature.", options: [{ id: "visual", label: "Use the matrix visual model.", correct: true, feedback: "Correct." }, { id: "symbol-only", label: "Ignore the matrix structure.", feedback: "Rows, columns, basis vectors, or transformations give the formula meaning." }] };
}

function tokenLabel(token: string) {
  const labels: Record<string, string> = {
    "A-ij": "A_ij", "B-ij": "B_ij", "A-plus-B-ij": "(A+B)_ij", "same-size": "same size",
    "row-i": "row i", "column-j": "column j", "dot-product-terms": "dot product terms", "AB-ij": "(AB)_ij",
    "first-column": "first column", "second-column": "second column", Av: "Av", "matrix-entries": "matrix entries",
    ad: "ad", bc: "bc", "ad-minus-bc": "ad - bc", "transformed-area": "transformed area",
    "first-equation": "first equation", "second-equation": "second equation", intersection: "intersection", "determinant-condition": "determinant condition",
    "row-operation": "row operation", "solution-point": "solution point", "equivalent-system": "equivalent system",
    "lambda-v": "lambda v", "same-direction-line": "same direction line", lambda: "lambda",
    A: "A", "A-inverse": "A^-1", I: "I", "determinant-nonzero": "determinant nonzero",
  };
  return labels[token] ?? token.replace(/-/g, " ");
}

function tokenVisualLabel(token: string) {
  if (token.includes("ij") || token.includes("size")) return "matrix cells";
  if (token.includes("row") || token.includes("column") || token.includes("dot")) return "row-column product guide";
  if (token.includes("column") || token === "Av" || token.includes("entries")) return "transformation grid and vectors";
  if (token === "ad" || token === "bc" || token.includes("area")) return "determinant parallelogram";
  if (token.includes("equation") || token.includes("intersection")) return "linear-system lines";
  if (token.includes("operation") || token.includes("equivalent")) return "row-operation matrix";
  if (token.includes("lambda") || token.includes("direction")) return "eigenvector direction guide";
  if (token === "A" || token.includes("inverse") || token === "I" || token.includes("nonzero")) return "inverse transformation sequence";
  return "matrix visual feature";
}

function selectedIndex(values: PhaseTwoValues) { return Math.round(values.row) * 2 + Math.round(values.col); }
function matrixA(values: PhaseTwoValues) { return [values.a1, values.a2, values.a3, values.a4].map(Math.round); }
function matrixB(values: PhaseTwoValues) { return [values.b1, values.b2, values.b3, values.b4].map(Math.round); }
function rowOf(matrix: number[], row: number) { return [matrix[row * 2], matrix[row * 2 + 1]]; }
function colOf(matrix: number[], col: number) { return [matrix[col], matrix[col + 2]]; }
function sum(items: number[]) { return items.reduce((total, item) => total + item, 0); }
function system(values: PhaseTwoValues) { return { a1: values.a1, b1: values.b1, c1: values.c1, a2: values.a2, b2: values.b2, c2: values.c2 }; }
function solveSystem(s: { a1: number; b1: number; c1: number; a2: number; b2: number; c2: number }) {
  const determinant = s.a1 * s.b2 - s.a2 * s.b1;
  if (Math.abs(determinant) < 0.001) return null;
  return { x: (s.c1 * s.b2 - s.c2 * s.b1) / determinant, y: (s.a1 * s.c2 - s.a2 * s.c1) / determinant };
}
function angleBetween(v: { x: number; y: number }, w: { x: number; y: number }) {
  const dot = v.x * w.x + v.y * w.y;
  const mag = Math.hypot(v.x, v.y) * Math.hypot(w.x, w.y);
  return mag ? Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180 / Math.PI : 0;
}
function fmt(item: number) { return Number.isFinite(item) ? item.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
