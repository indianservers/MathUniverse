import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import GraphCard from "../components/ui/GraphCard";
import MatrixGrid from "../components/matrix/MatrixGrid";
import MatrixInput from "../components/matrix/MatrixInput";
import MatrixTransformationCanvas from "../components/matrix/MatrixTransformationCanvas";
import {
  MatrixBreadcrumb,
  MatrixBackLink,
  MatrixErrorBox,
  MatrixOperationLayout,
  MatrixPracticeCard,
  MatrixResult,
  StepByStepPanel,
} from "../components/matrix/MatrixShared";
import SectionCard from "../components/ui/SectionCard";
import { getMatrixOperation } from "../data/matrixOperations";
import type { MatrixOperationId } from "../data/matrixOperations";
import {
  addMatrices,
  adjointMatrix,
  allCells,
  cloneMatrix,
  determinantSteps,
  eigen2x2,
  formatNumber,
  inverse,
  multiplyMatrices,
  rankMatrix,
  rowAddMultiple,
  rowScale,
  rowSwap,
  scalarMultiply,
  solve2x2System,
  subtractMatrices,
  transposeMatrix,
} from "../utils/matrixOperations";
import type { Matrix, MatrixStepResult } from "../utils/matrixOperations";

const examples: Record<MatrixOperationId, { a: Matrix; b?: Matrix; scalar?: number }> = {
  basics: { a: [[1, 2, 3], [4, 5, 6]] },
  addition: { a: [[2, 4], [3, 1]], b: [[5, 2], [7, 6]] },
  subtraction: { a: [[8, 5], [6, 4]], b: [[3, 2], [1, 7]] },
  "scalar-multiplication": { a: [[2, -1], [4, 5]], scalar: 3 },
  multiplication: { a: [[1, 2], [3, 4]], b: [[5, 6], [7, 8]] },
  transpose: { a: [[1, 2, 3], [4, 5, 6]] },
  determinant: { a: [[4, 6], [3, 8]] },
  inverse: { a: [[4, 7], [2, 6]] },
  "adjoint-cofactor": { a: [[1, 2, 3], [0, 4, 5], [1, 0, 6]] },
  rank: { a: [[1, 2, 3], [2, 4, 6], [1, 1, 1]] },
  "row-operations": { a: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
  "linear-equations": { a: [[1, 1, 5], [2, -1, 1]] },
  "eigenvalues-eigenvectors": { a: [[2, 1], [1, 2]] },
  transformations: { a: [[2, 0], [0, 2]] },
};

export default function MatrixOperationPage() {
  const { operationId } = useParams();
  const operation = getMatrixOperation(operationId);
  if (!operation) return <Navigate to="/matrices" replace />;
  if (operation.id === "basics") return <MatrixBasicsPage />;
  return <OperationWorkspace id={operation.id} title={operation.title} />;
}

function OperationWorkspace({ id, title }: { id: MatrixOperationId; title: string }) {
  const example = examples[id];
  const [a, setA] = useState<Matrix>(() => cloneMatrix(example.a));
  const [b, setB] = useState<Matrix>(() => cloneMatrix(example.b ?? example.a));
  const [scalar, setScalar] = useState(example.scalar ?? 3);
  const [active, setActive] = useState(0);
  const [reverseSubtraction, setReverseSubtraction] = useState(false);
  const [compareBA, setCompareBA] = useState(false);
  const [rowOperation, setRowOperation] = useState<"swap" | "scale" | "add">("swap");
  const [r1, setR1] = useState(0);
  const [r2, setR2] = useState(1);
  const [rowScalar, setRowScalar] = useState(-2);

  const computed = useMemo(() => compute(id, a, b, scalar, reverseSubtraction, compareBA, rowOperation, r1, r2, rowScalar), [a, b, compareBA, id, r1, r2, reverseSubtraction, rowOperation, rowScalar, scalar]);
  const step = computed.steps[Math.min(active, Math.max(0, computed.steps.length - 1))];
  const currentResult = step?.result ?? computed.result;
  const swapDisplay = (id === "subtraction" && reverseSubtraction) || (id === "multiplication" && compareBA);
  const leftMatrix = swapDisplay ? b : a;
  const rightMatrix = swapDisplay ? a : b;
  const leftLabel = swapDisplay ? "B" : "A";
  const rightLabel = swapDisplay ? "A" : "B";

  const matrixInputs = (
    <div className="grid gap-4 xl:grid-cols-2">
      <MatrixInput label="Matrix A" matrix={a} onChange={(matrix) => { setA(matrix); setActive(0); }} example={example.a} maxRows={id === "determinant" || id === "inverse" ? 3 : 4} maxCols={id === "determinant" || id === "inverse" ? 3 : 4} />
      {needsMatrixB(id) && <MatrixInput label="Matrix B" matrix={b} onChange={(matrix) => { setB(matrix); setActive(0); }} example={example.b ?? example.a} />}
    </div>
  );

  return (
    <MatrixOperationLayout {...contentFor(id, title)}>
      <div className="space-y-6">
        {matrixInputs}
        {id === "scalar-multiplication" && <ScalarControl value={scalar} onChange={setScalar} />}
        {id === "subtraction" && <button className="action-secondary" type="button" onClick={() => { setReverseSubtraction(!reverseSubtraction); setActive(0); }}>{reverseSubtraction ? "Show A - B" : "Show B - A"}</button>}
        {id === "multiplication" && <button className="action-secondary" type="button" onClick={() => { setCompareBA(!compareBA); setActive(0); }}>{compareBA ? "Compute AB" : "Compute BA if valid"}</button>}
        {id === "transformations" && <TransformationPresets onSelect={(matrix) => { setA(matrix); setActive(0); }} />}
        {id === "row-operations" && <RowOperationControls operation={rowOperation} setOperation={setRowOperation} r1={r1} r2={r2} setR1={setR1} setR2={setR2} scalar={rowScalar} setScalar={setRowScalar} rows={a.length} />}
        <MatrixErrorBox error={computed.error} />
        <SectionCard title="Interactive Visualization">
          {id === "transformations" ? (
            <MatrixTransformationCanvas matrix={a} />
          ) : (
            <div className="mobile-safe-scroll">
              <div className="flex min-w-max flex-wrap items-center justify-center gap-5">
                <MatrixGrid matrix={leftMatrix} label={leftLabel} highlights={step?.highlightA} color={leftLabel === "A" ? "a" : "b"} />
                {needsMatrixB(id) && <><span className="text-3xl font-black">{symbolFor(id)}</span><MatrixGrid matrix={rightMatrix} label={rightLabel} highlights={step?.highlightB} color={rightLabel === "A" ? "a" : "b"} /></>}
                <span className="text-3xl font-black">=</span>
                <MatrixGrid matrix={currentResult.length ? currentResult : computed.result} label="Result" highlights={step?.highlightResult ?? allCells(currentResult)} color="result" />
              </div>
            </div>
          )}
        </SectionCard>
        <StepByStepPanel steps={computed.steps} active={active} onActiveChange={setActive} />
        <MatrixResult matrix={computed.result} />
        {id === "inverse" && <InverseVerification matrix={a} inverse={computed.result} />}
        {id === "linear-equations" && <LinearEquationGraph matrix={a} solution={solve2x2System(a).solution} />}
        {id === "eigenvalues-eigenvectors" && <EigenNotes matrix={a} />}
        {id === "adjoint-cofactor" && <CofactorMinorPanel step={step} />}
        <MatrixPracticeCard question={practiceFor(id).question} answer={practiceFor(id).answer} />
      </div>
    </MatrixOperationLayout>
  );
}

function compute(id: MatrixOperationId, a: Matrix, b: Matrix, scalar: number, reverse: boolean, compareBA: boolean, rowOperation: "swap" | "scale" | "add", r1: number, r2: number, rowScalar: number): MatrixStepResult {
  if (id === "addition") return addMatrices(a, b);
  if (id === "subtraction") return reverse ? subtractMatrices(b, a) : subtractMatrices(a, b);
  if (id === "scalar-multiplication") return scalarMultiply(scalar, a);
  if (id === "multiplication") return compareBA ? multiplyMatrices(b, a) : multiplyMatrices(a, b);
  if (id === "transpose") return transposeMatrix(a);
  if (id === "determinant") return determinantSteps(a);
  if (id === "inverse") return inverse(a);
  if (id === "adjoint-cofactor") return adjointMatrix(a);
  if (id === "rank") return rankMatrix(a);
  if (id === "row-operations") {
    if (rowOperation === "swap") return rowSwap(a, clampRow(r1, a), clampRow(r2, a));
    if (rowOperation === "scale") return rowScale(a, clampRow(r1, a), rowScalar);
    return rowAddMultiple(a, clampRow(r1, a), clampRow(r2, a), rowScalar);
  }
  if (id === "linear-equations") return solve2x2System(a);
  if (id === "eigenvalues-eigenvectors") {
    const eigen = eigen2x2(a);
    if ("error" in eigen) return { result: [], steps: [], error: eigen.error };
    return {
      result: [eigen.values],
      steps: [
        { title: "Build characteristic equation", formula: "det(A-lambda I)=0", calculation: `trace=${formatNumber(eigen.trace)}, det=${formatNumber(eigen.det)}` },
        { title: "Solve quadratic", formula: "lambda^2-trace(A)lambda+det(A)=0", calculation: `Eigenvalues: ${eigen.values.map(formatNumber).join(", ")}`, result: [eigen.values] },
        { title: "Find eigenvectors", formula: "(A-lambda I)v=0", calculation: `Example directions: ${eigen.vectors.map((v) => `[${v.map(formatNumber).join(", ")}]`).join(" and ")}`, result: eigen.vectors },
      ],
    };
  }
  if (id === "transformations") return { result: a, steps: [{ title: "Apply transformation", formula: "[x',y']=A[x,y]", calculation: "Each point of the shape is multiplied by the 2x2 matrix.", result: a, highlightA: allCells(a) }] };
  return { result: [], steps: [] };
}

function MatrixBasicsPage() {
  const a = examples.basics.a;
  return (
    <div className="space-y-6">
      <MatrixBreadcrumb current="Matrix Basics" />
      <MatrixBackLink />
      <SectionCard className="overflow-hidden">
        <div className="rounded-2xl bg-gradient-to-br from-cyan-500 via-violet-500 to-fuchsia-500 p-6 text-white">
          <h1 className="text-4xl font-black">Matrix Basics</h1>
          <p className="mt-3 max-w-3xl text-white/90">A matrix is a rectangular arrangement of numbers in rows and columns. Each entry is addressed by row and column position.</p>
        </div>
      </SectionCard>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <SectionCard title="Rows, Columns, and Element Notation">
          <div className="flex justify-center"><MatrixGrid matrix={a} label="A" highlights={[[1, 2]]} color="a" /></div>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">A is a 2 x 3 matrix. Element a23 means row 2, column 3, so a23 = 6.</p>
        </SectionCard>
        <SectionCard title="Types of Matrices">
          <div className="space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <p><b>Square:</b> same rows and columns.</p>
            <p><b>Row matrix:</b> one row.</p>
            <p><b>Column matrix:</b> one column.</p>
            <p><b>Zero:</b> every element is 0.</p>
            <p><b>Identity:</b> diagonal 1s and other entries 0.</p>
            <p><b>Diagonal:</b> non-zero values only on the main diagonal.</p>
            <p><b>Symmetric:</b> A = A^T.</p>
          </div>
        </SectionCard>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ExampleMatrix title="Zero Matrix" matrix={[[0, 0], [0, 0]]} />
        <ExampleMatrix title="Identity Matrix" matrix={[[1, 0], [0, 1]]} />
        <ExampleMatrix title="Symmetric Matrix" matrix={[[1, 2], [2, 3]]} />
      </div>
      <MatrixPracticeCard question="What is the order of [[1,2,3],[4,5,6]]?" answer="It has 2 rows and 3 columns, so the order is 2 x 3." />
    </div>
  );
}

function ExampleMatrix({ title, matrix }: { title: string; matrix: Matrix }) {
  return <SectionCard title={title}><div className="flex justify-center"><MatrixGrid matrix={matrix} color="neutral" /></div></SectionCard>;
}

function ScalarControl({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <SectionCard title="Scalar k">
      <input className="w-40 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-lg dark:border-white/10 dark:bg-slate-950/60" value={value} type="number" step="0.1" onChange={(event) => onChange(Number(event.target.value))} />
    </SectionCard>
  );
}

function TransformationPresets({ onSelect }: { onSelect: (matrix: Matrix) => void }) {
  const presets = [
    { label: "Scaling", matrix: [[2, 0], [0, 2]] },
    { label: "Reflect X", matrix: [[1, 0], [0, -1]] },
    { label: "Rotate 90", matrix: [[0, -1], [1, 0]] },
    { label: "Shear", matrix: [[1, 1], [0, 1]] },
  ];

  return (
    <SectionCard title="Transformation Presets">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => <button key={preset.label} className="tool-button" type="button" onClick={() => onSelect(preset.matrix)}>{preset.label}</button>)}
      </div>
    </SectionCard>
  );
}

function InverseVerification({ matrix, inverse }: { matrix: Matrix; inverse: Matrix }) {
  const valid = matrix.length === 2 && matrix[0]?.length === 2 && inverse.length === 2;
  if (!valid) return null;
  const product = multiplyMatrices(matrix, inverse);
  if (product.error) return null;
  return <MatrixResult title="Verify: A x A^-1 = Identity Matrix" matrix={product.result} />;
}

function RowOperationControls(props: { operation: "swap" | "scale" | "add"; setOperation: (value: "swap" | "scale" | "add") => void; r1: number; r2: number; setR1: (value: number) => void; setR2: (value: number) => void; scalar: number; setScalar: (value: number) => void; rows: number }) {
  return (
    <SectionCard title="Choose Row Operation">
      <div className="flex flex-wrap gap-3">
        <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950" value={props.operation} onChange={(event) => props.setOperation(event.target.value as "swap" | "scale" | "add")}>
          <option value="swap">Swap rows</option>
          <option value="scale">Multiply row by scalar</option>
          <option value="add">Add multiple of row</option>
        </select>
        <RowSelect value={props.r1} rows={props.rows} onChange={props.setR1} label="Target" />
        <RowSelect value={props.r2} rows={props.rows} onChange={props.setR2} label="Source" />
        <input className="w-32 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950" type="number" value={props.scalar} onChange={(event) => props.setScalar(Number(event.target.value))} />
      </div>
    </SectionCard>
  );
}

function RowSelect({ value, rows, onChange, label }: { value: number; rows: number; onChange: (value: number) => void; label: string }) {
  return <select aria-label={label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950" value={value} onChange={(event) => onChange(Number(event.target.value))}>{Array.from({ length: rows }, (_, index) => <option key={index} value={index}>R{index + 1}</option>)}</select>;
}

function LinearEquationGraph({ matrix, solution }: { matrix: Matrix; solution?: { x: number; y: number } }) {
  if (matrix.length !== 2 || matrix[0].length !== 3 || !solution) return null;
  const line = (row: number, x: number) => (matrix[row][2] - matrix[row][0] * x) / matrix[row][1];
  const points1 = [-4, 4].map((x) => `${180 + x * 35},${180 - line(0, x) * 35}`).join(" ");
  const points2 = [-4, 4].map((x) => `${180 + x * 35},${180 - line(1, x) * 35}`).join(" ");
  return (
    <GraphCard title="2D Graph Connection">
      <svg viewBox="0 0 360 360" className="h-full w-full">
        <line x1="0" x2="360" y1="180" y2="180" stroke="#64748b" />
        <line x1="180" x2="180" y1="0" y2="360" stroke="#64748b" />
        <polyline points={points1} stroke="#06b6d4" strokeWidth="4" fill="none" />
        <polyline points={points2} stroke="#f97316" strokeWidth="4" fill="none" />
        <circle cx={180 + solution.x * 35} cy={180 - solution.y * 35} r="7" fill="#22c55e" />
      </svg>
    </GraphCard>
  );
}

function EigenNotes({ matrix }: { matrix: Matrix }) {
  const eigen = eigen2x2(matrix);
  if ("error" in eigen) return null;
  return (
    <SectionCard title="Eigenvector Meaning">
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">For this matrix, lambda values are {eigen.values.map(formatNumber).join(" and ")}. Eigenvectors keep their direction after transformation; only their length changes.</p>
    </SectionCard>
  );
}

function CofactorMinorPanel({ step }: { step?: { matrix?: Matrix } }) {
  if (!step?.matrix) return null;
  return <SectionCard title="Current Minor Matrix"><div className="flex justify-center"><MatrixGrid matrix={step.matrix} color="neutral" /></div></SectionCard>;
}

function clampRow(row: number, matrix: Matrix) {
  return Math.min(Math.max(row, 0), matrix.length - 1);
}

function needsMatrixB(id: MatrixOperationId) {
  return id === "addition" || id === "subtraction" || id === "multiplication";
}

function symbolFor(id: MatrixOperationId) {
  if (id === "addition") return "+";
  if (id === "subtraction") return "-";
  if (id === "multiplication") return "x";
  return "";
}

function contentFor(id: MatrixOperationId, title: string) {
  const base = {
    title,
    subtitle: `${title} with interactive inputs, animated highlighted cells, worked steps, and practice.`,
    explanation: "Matrix operations transform rectangular arrays by following row, column, and element rules.",
    condition: "Check matrix dimensions before calculating.",
    formula: "C_{ij}",
    mistake: "A common mistake is ignoring matrix order before applying an operation.",
    realWorld: "Matrices are used in computer graphics, AI, engineering, economics, robotics, and systems of equations.",
  };
  const map: Partial<Record<MatrixOperationId, Partial<typeof base>>> = {
    addition: { explanation: "Matrix addition adds corresponding elements.", condition: "A and B must have the same order.", formula: "C_{ij}=A_{ij}+B_{ij}", mistake: "Adding matrices of different orders is not defined." },
    subtraction: { explanation: "Matrix subtraction subtracts corresponding elements.", condition: "A and B must have the same order.", formula: "C_{ij}=A_{ij}-B_{ij}", mistake: "Subtraction is not commutative, so A-B is generally not B-A." },
    "scalar-multiplication": { explanation: "Scalar multiplication changes every entry by the same factor.", condition: "Any matrix can be multiplied by a scalar.", formula: "B_{ij}=kA_{ij}", mistake: "Do not multiply only one row or only the diagonal." },
    multiplication: { explanation: "Matrix multiplication uses dot products of rows and columns.", condition: "Columns of A must equal rows of B.", formula: "C_{ij}=\\sum_k A_{ik}B_{kj}", mistake: "AB is usually not equal to BA." },
    transpose: { explanation: "Transpose turns rows into columns.", condition: "Any matrix has a transpose.", formula: "(A^T)_{ij}=A_{ji}", mistake: "Transpose is not the same thing as inverse." },
    determinant: { explanation: "The determinant measures signed scaling for square matrices.", condition: "Only square matrices have determinants.", formula: "\\det(A)=ad-bc", mistake: "Trying to find determinant of a non-square matrix." },
    inverse: { explanation: "The inverse reverses a matrix transformation.", condition: "A must be square and determinant must be non-zero.", formula: "A^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}", mistake: "Forgetting to change signs of b and c." },
    "adjoint-cofactor": { explanation: "Cofactors are signed minors; the adjoint is the transpose of the cofactor matrix.", condition: "Use square matrices.", formula: "adj(A)=C^T", mistake: "Forgetting the checkerboard sign pattern." },
    rank: { explanation: "Rank counts independent rows or columns.", condition: "Any matrix has a rank.", formula: "rank(A)=\\text{nonzero rows in REF}", mistake: "Confusing rank with determinant." },
    "row-operations": { explanation: "Elementary row operations transform a matrix while preserving solution structure.", condition: "Scale rows by non-zero scalars when preserving equivalence.", formula: "R_i\\leftrightarrow R_j,\\ R_i\\to kR_i,\\ R_i\\to R_i+kR_j", mistake: "Using a zero scalar for row scaling destroys information." },
    "linear-equations": { explanation: "Augmented matrices organize coefficients and constants for solving systems.", condition: "Use one row per equation and one column per variable plus constants.", formula: "[A|b]\\to RREF", mistake: "Mixing coefficient columns with the constant column." },
    "eigenvalues-eigenvectors": { explanation: "Eigenvectors keep direction after transformation and eigenvalues tell the scale factor.", condition: "This page supports 2x2 matrices with real eigenvalues.", formula: "Av=\\lambda v", mistake: "Thinking every vector is an eigenvector." },
    transformations: { explanation: "2x2 matrices can scale, rotate, reflect, and shear 2D shapes.", condition: "Use a 2x2 transformation matrix.", formula: "\\begin{bmatrix}x'\\\\y'\\end{bmatrix}=A\\begin{bmatrix}x\\\\y\\end{bmatrix}", mistake: "Applying matrix entries directly without multiplying coordinates." },
  };
  return { ...base, ...(map[id] ?? {}) };
}

function practiceFor(id: MatrixOperationId) {
  const questions: Record<MatrixOperationId, { question: string; answer: string }> = {
    basics: { question: "What is a square matrix?", answer: "A matrix with the same number of rows and columns." },
    addition: { question: "[[2,4],[3,1]] + [[5,2],[7,6]]", answer: "[[7,6],[10,7]]" },
    subtraction: { question: "[[8,5],[6,4]] - [[3,2],[1,7]]", answer: "[[5,3],[5,-3]]" },
    "scalar-multiplication": { question: "3 x [[2,-1],[4,5]]", answer: "[[6,-3],[12,15]]" },
    multiplication: { question: "[[1,2],[3,4]] x [[5,6],[7,8]]", answer: "[[19,22],[43,50]]" },
    transpose: { question: "Transpose [[1,2,3],[4,5,6]]", answer: "[[1,4],[2,5],[3,6]]" },
    determinant: { question: "det([[4,6],[3,8]])", answer: "14" },
    inverse: { question: "inverse([[4,7],[2,6]])", answer: "[[0.6,-0.7],[-0.2,0.4]]" },
    "adjoint-cofactor": { question: "What is adj(A)?", answer: "The transpose of the cofactor matrix." },
    rank: { question: "What does rank count?", answer: "The number of linearly independent rows or columns." },
    "row-operations": { question: "Name the three elementary row operations.", answer: "Swap rows, scale a row, add a multiple of one row to another." },
    "linear-equations": { question: "Solve x+y=5 and 2x-y=1.", answer: "x=2, y=3" },
    "eigenvalues-eigenvectors": { question: "What does Av=lambda v mean?", answer: "The vector v keeps its direction and scales by lambda." },
    transformations: { question: "What matrix reflects over the x-axis?", answer: "[[1,0],[0,-1]]" },
  };
  return questions[id];
}
