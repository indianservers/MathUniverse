import { Box, Boxes, Compass, ExternalLink, GitBranch, Rows3, Target, TriangleRight, Workflow, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { FormulaBlock, MathLabLayout, ResultCard, StepPanel } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import { ResetExampleButton } from "../components/ui/UiFeedback";
import {
  Vector2,
  Vector3,
  checkBasis2D,
  crossProduct,
  dotProduct,
  gaussianElimination,
  rref,
  solveAugmentedRref,
  unitVector,
  vectorAdd,
  vectorMagnitude,
  vectorProjection,
  vectorSubtract,
} from "../utils/mathEngine/linearAlgebraUtils";

const matrixLinks = [
  ["Matrix Addition", "/matrices/addition"],
  ["Matrix Multiplication", "/matrices/multiplication"],
  ["Determinant", "/matrices/determinant"],
  ["Inverse", "/matrices/inverse"],
  ["Rank", "/matrices/rank"],
  ["Row Operations", "/matrices/row-operations"],
  ["Systems of Linear Equations", "/matrices/linear-equations"],
  ["Matrix Transformations", "/matrices/transformations"],
  ["Eigenvalues and Eigenvectors", "/matrices/eigenvalues-eigenvectors"],
];

const workspaceCards: Array<{ title: string; description: string; icon: LucideIcon }> = [
  { title: "Vector Visualizer", description: "Magnitude, angle, unit vector, vector addition and subtraction.", icon: Compass },
  { title: "Dot Product", description: "Scalar product, angle interpretation, orthogonality check.", icon: Target },
  { title: "Cross Product", description: "3D determinant method and parallelogram area.", icon: Box },
  { title: "Vector Projection", description: "Projection and perpendicular component.", icon: TriangleRight },
  { title: "Linear Combination", description: "w = au + bv with sliders.", icon: Workflow },
  { title: "Span", description: "Plane versus line depending on independence.", icon: GitBranch },
  { title: "Basis and Dimension", description: "det not zero means basis for R2.", icon: Boxes },
  { title: "Gaussian Elimination", description: "REF, RREF, rank, and augmented-system status.", icon: Rows3 },
];

export default function MathLabLinearAlgebra() {
  const [u, setU] = useState<Vector2>([3, 4]);
  const [v, setV] = useState<Vector2>([5, 0]);
  const [u3, setU3] = useState<Vector3>([1, 0, 0]);
  const [v3, setV3] = useState<Vector3>([0, 1, 0]);
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [matrix, setMatrix] = useState([[1, 2, 1], [2, 5, 3], [1, 0, 2]]);
  const [stepIndex, setStepIndex] = useState(0);

  const magnitude = vectorMagnitude(u);
  const unit = unitVector(u).result as Vector2;
  const dot = dotProduct(u, v);
  const angle = magnitude > 1e-10 && vectorMagnitude(v) > 1e-10 ? Math.acos(clamp(dot / (magnitude * vectorMagnitude(v)), -1, 1)) * 180 / Math.PI : 0;
  const projection = vectorProjection(u, v);
  const cross = crossProduct(u3, v3);
  const crossMag = vectorMagnitude(cross.result);
  const combination = vectorAdd(u.map((value) => value * a), v.map((value) => value * b)) as Vector2;
  const basis = checkBasis2D(u, v);
  const ref = useMemo(() => gaussianElimination(matrix), [matrix]);
  const reduced = useMemo(() => rref(matrix), [matrix]);
  const solution = useMemo(() => solveAugmentedRref(matrix), [matrix]);
  const currentStep = reduced.steps[Math.min(stepIndex, reduced.steps.length - 1)];

  const notes = (
    <>
      <SectionCard title="Common Mistakes">
        <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <li>Dot product gives a scalar; cross product gives a vector.</li>
          <li>Projection onto the zero vector is undefined.</li>
          <li>Parallel vectors in R2 do not form a basis.</li>
          <li>RREF and determinant are different ideas; rank counts pivots.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Real-World Use">
        <div className="flex flex-wrap gap-2">
          {["computer graphics", "machine learning", "robotics", "physics", "systems of equations", "engineering"].map((item) => <span key={item} className="mini-chip">{item}</span>)}
        </div>
      </SectionCard>
    </>
  );

  return (
    <MathLabLayout
      title="Linear Algebra Lab"
      subtitle="Explore vectors, dot products, projections, span, basis, row reduction, RREF, and matrix concepts with direct links into the full matrix operation visualizers."
      notes={notes}
    >
      <SectionCard title="Linear Algebra Workspace" description="These cards are real interactive tools or direct links to the existing full matrix visualizers. Matrix pages are linked instead of duplicated.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {workspaceCards.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
              <Icon className="h-6 w-6 text-cyan-600 dark:text-cyan-200" />
              <h2 className="mt-3 font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <SectionCard title="Vector Inputs" description="Default v = [3,4], so its magnitude is 5.">
          <div className="sticky top-20 z-20 mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
            <ResetExampleButton onClick={() => { setU([3, 4]); setV([5, 0]); setA(1); setB(1); }} />
          </div>
          <Vector2Input label="u" value={u} onChange={setU} />
          <Vector2Input label="v" value={v} onChange={setV} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Metric label="||u||" value={format(magnitude)} />
            <Metric label="angle(u)" value={`${format(Math.atan2(u[1], u[0]) * 180 / Math.PI)} deg`} />
            <Metric label="unit u" value={`[${unit.map(format).join(", ")}]`} />
            <Metric label="u + v" value={`[${vectorAdd(u, v).map(format).join(", ")}]`} />
            <Metric label="u - v" value={`[${vectorSubtract(u, v).map(format).join(", ")}]`} />
            <Metric label="dot(u,v)" value={format(dot)} />
          </div>
        </SectionCard>

        <SectionCard title="2D Vector Visualizer">
          <VectorPlane vectors={[
            { label: "u", value: u, color: "#06b6d4" },
            { label: "v", value: v, color: "#f97316" },
            { label: "u+v", value: vectorAdd(u, v) as Vector2, color: "#10b981" },
            { label: "proj_v(u)", value: projection.result, color: "#8b5cf6" },
          ]} />
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Dot Product And Projection">
          <FormulaBlock formula={"u\\cdot v=u_1v_1+u_2v_2"} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Metric label="Calculation" value={`${format(u[0])}x${format(v[0])} + ${format(u[1])}x${format(v[1])} = ${format(dot)}`} />
            <Metric label="Angle" value={`${format(angle)} deg`} />
            <Metric label="Orthogonality" value={Math.abs(dot) < 1e-8 ? "Perpendicular" : "Not perpendicular"} />
            <Metric label="Projection" value={`[${projection.result.map(format).join(", ")}]`} />
          </div>
          {projection.warning && <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">{projection.warning}</p>}
        </SectionCard>

        <SectionCard title="Linear Combination, Span, Basis">
          <FormulaBlock formula={"w=au+bv"} />
          <SliderGroup title="Combination controls" className="mt-4">
            <SliderControl density="compact" label="combination a" min={-4} max={4} step={0.1} value={a} onChange={setA} />
            <SliderControl density="compact" label="combination b" min={-4} max={4} step={0.1} value={b} onChange={setB} />
          </SliderGroup>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Metric label="w" value={`[${combination.map(format).join(", ")}]`} />
            <Metric label="det([u v])" value={format(basis.determinant)} />
            <Metric label="Span" value={basis.isBasis ? "All of R2" : "A line through the origin"} />
            <Metric label="Basis check" value={basis.explanation} />
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Cross Product In 3D" description="The result is perpendicular to both input vectors. Its magnitude is the area of the parallelogram formed by them.">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            <Vector3Input label="u" value={u3} onChange={setU3} />
            <Vector3Input label="v" value={v3} onChange={setV3} />
            <Metric label="u x v" value={`[${cross.result.map(format).join(", ")}]`} />
            <Metric label="||u x v||" value={`${format(crossMag)} area units`} />
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <FormulaBlock formula={"u\\times v=\\begin{bmatrix}u_2v_3-u_3v_2\\\\u_3v_1-u_1v_3\\\\u_1v_2-u_2v_1\\end{bmatrix}"} />
            <div className="mt-4 space-y-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              {cross.steps.map((step) => <p key={step}>{step}</p>)}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Gaussian Elimination, REF, RREF" description="Edit an ordinary or augmented matrix. Steps highlight pivot movement, row scaling, and row replacement.">
        <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div>
            <MatrixEditor matrix={matrix} onChange={(next) => { setMatrix(next); setStepIndex(0); }} />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="tool-button" onClick={() => setMatrix([[1, 2, 1], [2, 5, 3], [1, 0, 2]])}>3x3 Example</button>
              <button type="button" className="tool-button" onClick={() => setMatrix([[1, 1, 5], [2, -1, 1]])}>Augmented 2x3</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Metric label="REF rank" value={format(ref.result.filter((row) => row.some((value) => Math.abs(value) > 1e-8)).length)} />
              <Metric label="RREF rank" value={format(reduced.rank)} />
              <Metric label="System status" value={solution.status} />
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
              <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Step {Math.min(stepIndex + 1, reduced.steps.length)} of {reduced.steps.length}</p>
              <h3 className="mt-2 text-lg font-black">{currentStep?.title}</h3>
              <p className="mt-1 font-mono text-sm font-bold text-slate-600 dark:text-slate-300">{currentStep?.operation}</p>
              <div className="mt-4"><MatrixView matrix={currentStep?.matrix ?? matrix} pivot={currentStep?.pivot} /></div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="tool-button" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}>Previous</button>
                <button type="button" className="tool-button" onClick={() => setStepIndex(Math.min(reduced.steps.length - 1, stepIndex + 1))}>Next</button>
                <button type="button" className="tool-button" onClick={() => setStepIndex(reduced.steps.length - 1)}>Show RREF</button>
              </div>
            </div>
            {solution.solution && <ResultCard title="Solution" result={<p className="font-mono font-black">[{solution.solution.map(format).join(", ")}]</p>} />}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Matrix Operations Links" description="The complete matrix operation pages already exist, so this lab links to them instead of rebuilding them.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {matrixLinks.map(([label, route]) => (
            <Link key={route} to={route} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/75 p-4 font-bold transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
              <span>{label}</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </SectionCard>

      <StepPanel steps={[
        { title: "Represent vectors", explanation: "Vectors are coordinates with both length and direction.", formula: "\\lVert v\\rVert=\\sqrt{x^2+y^2}" },
        { title: "Measure relationships", explanation: "Dot products reveal angle and projection; cross products reveal perpendicular direction and area.", formula: "\\text{proj}_v(u)=\\frac{u\\cdot v}{\\lVert v\\rVert^2}v" },
        { title: "Reduce matrices", explanation: "Gaussian elimination and RREF expose pivots, rank, and solution structure.", formula: "R_i\\to R_i+kR_j" },
      ]} />
    </MathLabLayout>
  );
}

function Vector2Input({ label, value, onChange }: { label: string; value: Vector2; onChange: (value: Vector2) => void }) {
  return (
    <div className="mb-4 rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
      <p className="mb-3 text-sm font-black">{label} = [x, y]</p>
      <div className="grid grid-cols-2 gap-3">
        <NumberBox label={`${label}x`} value={value[0]} onChange={(next) => onChange([next, value[1]])} />
        <NumberBox label={`${label}y`} value={value[1]} onChange={(next) => onChange([value[0], next])} />
      </div>
    </div>
  );
}

function Vector3Input({ label, value, onChange }: { label: string; value: Vector3; onChange: (value: Vector3) => void }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
      <p className="mb-3 text-sm font-black">{label} = [x, y, z]</p>
      <div className="grid grid-cols-3 gap-3">
        <NumberBox label="x" value={value[0]} onChange={(next) => onChange([next, value[1], value[2]])} />
        <NumberBox label="y" value={value[1]} onChange={(next) => onChange([value[0], next, value[2]])} />
        <NumberBox label="z" value={value[2]} onChange={(next) => onChange([value[0], value[1], next])} />
      </div>
    </div>
  );
}

function NumberBox({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="text-xs font-bold uppercase text-slate-500">
      {label}
      <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm dark:border-white/10 dark:bg-slate-950" type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function VectorPlane({ vectors }: { vectors: Array<{ label: string; value: Vector2; color: string }> }) {
  const scale = 22;
  const origin = { x: 260, y: 220 };
  const toPoint = ([x, y]: Vector2) => ({ x: origin.x + x * scale, y: origin.y - y * scale });
  return (
    <svg className="h-[420px] w-full rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950" viewBox="0 0 520 440" role="img" aria-label="Vector plane">
      {Array.from({ length: 21 }, (_, index) => index - 10).map((tick) => (
        <g key={tick}>
          <line x1={origin.x + tick * scale} x2={origin.x + tick * scale} y1="0" y2="440" stroke="#94a3b8" opacity="0.16" />
          <line x1="0" x2="520" y1={origin.y + tick * scale} y2={origin.y + tick * scale} stroke="#94a3b8" opacity="0.16" />
        </g>
      ))}
      <line x1="0" x2="520" y1={origin.y} y2={origin.y} stroke="#0f172a" strokeWidth="2" opacity="0.65" />
      <line x1={origin.x} x2={origin.x} y1="0" y2="440" stroke="#0f172a" strokeWidth="2" opacity="0.65" />
      {vectors.map((vector, index) => {
        const point = toPoint(vector.value);
        const markerId = `vector-arrow-${index}`;
        return (
          <g key={vector.label}>
            <line x1={origin.x} y1={origin.y} x2={point.x} y2={point.y} stroke={vector.color} strokeWidth="4" markerEnd={`url(#${markerId})`} />
            <defs><marker id={markerId} markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill={vector.color} /></marker></defs>
            <circle cx={point.x} cy={point.y} r="5" fill={vector.color} />
            <text x={point.x + 8} y={point.y - 8} fill={vector.color} fontSize="14" fontWeight="800">{vector.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function MatrixEditor({ matrix, onChange }: { matrix: number[][]; onChange: (matrix: number[][]) => void }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, minmax(66px, 1fr))` }}>
        {matrix.map((row, rowIndex) => row.map((value, colIndex) => (
          <input
            key={`${rowIndex}-${colIndex}`}
            className="rounded-xl border border-slate-200 bg-white p-2 text-center font-mono dark:border-white/10 dark:bg-slate-950"
            value={value}
            type="number"
            onChange={(event) => onChange(matrix.map((items, r) => items.map((item, c) => (r === rowIndex && c === colIndex ? Number(event.target.value) : item))))}
          />
        )))}
      </div>
    </div>
  );
}

function MatrixView({ matrix, pivot }: { matrix: number[][]; pivot?: [number, number] }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, minmax(52px, 1fr))` }}>
      {matrix.map((row, rowIndex) => row.map((value, colIndex) => (
        <div key={`${rowIndex}-${colIndex}`} className={`rounded-xl p-3 text-center font-mono font-bold ${pivot?.[0] === rowIndex && pivot?.[1] === colIndex ? "bg-cyan-500 text-white" : "bg-white dark:bg-slate-950"}`}>{format(value)}</div>
      )))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 break-words font-mono text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function format(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value) < 1e-10) return "0";
  return Number(value.toFixed(4)).toString();
}
