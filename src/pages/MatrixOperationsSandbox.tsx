import { useMemo, useState } from "react";
import { ArrowRight, Calculator, Grid3X3 } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";

type Matrix = number[][];
type RowStep = { label: string; matrix: Matrix };

const baseMatrix: Matrix = [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]];

export default function MatrixOperationsSandbox() {
  const [size, setSize] = useState(3);
  const [active, setActive] = useState(0);
  const matrix = baseMatrix.slice(0, size).map((row) => row.slice(0, size));
  const reduction = useMemo(() => rowReductionSteps(matrix), [matrix]);
  const determinant = useMemo(() => determinantSteps(matrix), [matrix]);
  const inverse = useMemo(() => inverseSteps(matrix), [matrix]);
  const shown = reduction[Math.min(active, reduction.length - 1)] ?? reduction[0];

  return (
    <div className="space-y-6">
      <TopicHeader title="Matrix Operations Sandbox" subtitle="Step through row reduction, determinants, and inverses as animated elementary row operations." difficulty="Linear Algebra Tool" estimatedMinutes={12} />
      <SectionCard title="Row Reduction Animator" description="Move through the operation chain to see each pivot, swap, scale, and elimination step.">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="space-y-4">
            <SliderControl label="Matrix size" value={size} min={2} max={3} step={1} onChange={(value) => { setSize(Math.round(value)); setActive(0); }} />
            <SliderControl label="Operation step" value={active} min={0} max={Math.max(0, reduction.length - 1)} step={1} onChange={(value) => setActive(Math.round(value))} />
            <div className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">{shown?.label}</div>
          </div>
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-slate-950/50">
            <MatrixView matrix={shown?.matrix ?? matrix} />
          </div>
        </div>
      </SectionCard>
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Determinant Calculation">
          <div className="space-y-3">
            {determinant.steps.map((step) => <StepLine key={step} text={step} />)}
            <p className="rounded-2xl bg-cyan-50 p-4 text-lg font-black text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100">det(A) = {round(determinant.value)}</p>
          </div>
        </SectionCard>
        <SectionCard title="Inverse by Augmented Matrix" description={inverse.invertible ? "The right half becomes A inverse after reduction." : "This matrix is singular, so no inverse exists."}>
          <div className="space-y-3">
            {inverse.steps.slice(0, 7).map((step) => <StepLine key={step.label} text={step.label} />)}
            {inverse.invertible ? <MatrixView matrix={inverse.inverse} compact /> : <p className="font-bold text-rose-600 dark:text-rose-300">No inverse: determinant is 0.</p>}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function MatrixView({ matrix, compact = false }: { matrix: Matrix; compact?: boolean }) {
  return (
    <div className={`grid gap-2 ${compact ? "text-sm" : "text-xl"}`} style={{ gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, minmax(54px, 1fr))` }}>
      {matrix.flatMap((row, rowIndex) => row.map((value, colIndex) => (
        <div key={`${rowIndex}-${colIndex}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center font-mono font-bold dark:border-white/10 dark:bg-white/10">
          {round(value)}
        </div>
      )))}
    </div>
  );
}

function StepLine({ text }: { text: string }) {
  return <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-white/10 dark:text-slate-200"><ArrowRight className="h-4 w-4 text-cyan-500" />{text}</div>;
}

function rowReductionSteps(input: Matrix) {
  const matrix = clone(input);
  const steps: RowStep[] = [{ label: "Start with A", matrix: clone(matrix) }];
  const rows = matrix.length;
  const cols = matrix[0].length;
  let pivotRow = 0;

  for (let col = 0; col < cols && pivotRow < rows; col += 1) {
    let best = pivotRow;
    for (let row = pivotRow + 1; row < rows; row += 1) if (Math.abs(matrix[row][col]) > Math.abs(matrix[best][col])) best = row;
    if (Math.abs(matrix[best][col]) < 1e-9) continue;
    if (best !== pivotRow) {
      [matrix[pivotRow], matrix[best]] = [matrix[best], matrix[pivotRow]];
      steps.push({ label: `Swap R${pivotRow + 1} and R${best + 1}`, matrix: clone(matrix) });
    }
    const pivot = matrix[pivotRow][col];
    matrix[pivotRow] = matrix[pivotRow].map((value) => value / pivot);
    steps.push({ label: `Scale R${pivotRow + 1} by 1/${round(pivot)}`, matrix: clone(matrix) });
    for (let row = 0; row < rows; row += 1) {
      if (row === pivotRow) continue;
      const factor = matrix[row][col];
      if (Math.abs(factor) < 1e-9) continue;
      matrix[row] = matrix[row].map((value, index) => value - factor * matrix[pivotRow][index]);
      steps.push({ label: `R${row + 1} = R${row + 1} - (${round(factor)})R${pivotRow + 1}`, matrix: clone(matrix) });
    }
    pivotRow += 1;
  }
  return steps;
}

function determinantSteps(matrix: Matrix) {
  if (matrix.length === 2) {
    const value = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    return { value, steps: [`Use ad - bc`, `${matrix[0][0]} x ${matrix[1][1]} - ${matrix[0][1]} x ${matrix[1][0]}`] };
  }
  const [a, b, c] = matrix[0];
  const minors = [
    det2([[matrix[1][1], matrix[1][2]], [matrix[2][1], matrix[2][2]]]),
    det2([[matrix[1][0], matrix[1][2]], [matrix[2][0], matrix[2][2]]]),
    det2([[matrix[1][0], matrix[1][1]], [matrix[2][0], matrix[2][1]]]),
  ];
  const value = a * minors[0] - b * minors[1] + c * minors[2];
  return { value, steps: ["Expand across the first row", `${a}(${round(minors[0])}) - ${b}(${round(minors[1])}) + ${c}(${round(minors[2])})`] };
}

function inverseSteps(matrix: Matrix) {
  const det = determinantSteps(matrix).value;
  const augmented = matrix.map((row, index) => [...row, ...row.map((_, col) => (col === index ? 1 : 0))]);
  const steps = rowReductionSteps(augmented);
  const last = steps[steps.length - 1]?.matrix ?? augmented;
  return { invertible: Math.abs(det) > 1e-9, steps, inverse: last.map((row) => row.slice(matrix.length)) };
}

function det2(matrix: Matrix) {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

function clone(matrix: Matrix) {
  return matrix.map((row) => [...row]);
}

function round(value: number) {
  return Number(value.toFixed(3)).toString();
}
