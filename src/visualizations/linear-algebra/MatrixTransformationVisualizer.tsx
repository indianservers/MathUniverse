import { motion } from "framer-motion";
import { useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { Matrix2x2, matrixVectorMultiply2D, reflectionMatrixX, reflectionMatrixY, rotationMatrix, scalingMatrix, shearMatrix } from "../../utils/linearAlgebra";
import { roundTo } from "../../utils/math";

const center = 180;
const scale = 48;
const shape: [number, number][] = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
const toSvg = ([x, y]: [number, number]) => `${center + x * scale},${center - y * scale}`;

export default function MatrixTransformationVisualizer() {
  const [matrix, setMatrix] = useState<Matrix2x2>([[1, 0], [0, 1]]);
  const transformed = shape.map((p) => matrixVectorMultiply2D(matrix, p));
  const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  const setCell = (row: 0 | 1, col: 0 | 1, value: number) => setMatrix((m) => [[row === 0 && col === 0 ? value : m[0][0], row === 0 && col === 1 ? value : m[0][1]], [row === 1 && col === 0 ? value : m[1][0], row === 1 && col === 1 ? value : m[1][1]]]);
  const presets: [string, Matrix2x2][] = [
    ["Identity", [[1, 0], [0, 1]]],
    ["Rotation 30", rotationMatrix(Math.PI / 6)],
    ["Rotation 45", rotationMatrix(Math.PI / 4)],
    ["Rotation 90", rotationMatrix(Math.PI / 2)],
    ["Scaling 2x", scalingMatrix(2, 2)],
    ["Reflection X", reflectionMatrixX()],
    ["Reflection Y", reflectionMatrixY()],
    ["Shear X", shearMatrix(1, 0)],
    ["Shear Y", shearMatrix(0, 1)],
    ["Projection", [[1, 0], [0, 0]]],
  ];
  const gridLines = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <SectionCard title="Matrix Transformation Visualizer" description="A 2x2 matrix reshapes the plane. The determinant shows area scaling and orientation flip.">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <SliderGroup title="Matrix entries">
            <SliderControl density="compact" label="a" value={matrix[0][0]} min={-3} max={3} step={0.1} onChange={(v) => setCell(0, 0, v)} />
            <SliderControl density="compact" label="b" value={matrix[0][1]} min={-3} max={3} step={0.1} onChange={(v) => setCell(0, 1, v)} />
            <SliderControl density="compact" label="c" value={matrix[1][0]} min={-3} max={3} step={0.1} onChange={(v) => setCell(1, 0, v)} />
            <SliderControl density="compact" label="d" value={matrix[1][1]} min={-3} max={3} step={0.1} onChange={(v) => setCell(1, 1, v)} />
          </SliderGroup>
          <div className="flex flex-wrap gap-2">{presets.map(([name, m]) => <button key={name} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-white/10" onClick={() => setMatrix(m)}>{name}</button>)}</div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="font-mono text-lg">[{roundTo(matrix[0][0], 2)} {roundTo(matrix[0][1], 2)}; {roundTo(matrix[1][0], 2)} {roundTo(matrix[1][1], 2)}]</p>
            <p className="mt-2 text-sm">det = ad - bc = {roundTo(det, 3)}</p>
            <p className="mt-2 text-sm">{det < 0 ? "Orientation flips." : det > 0 ? "Orientation is preserved." : "Area collapses to zero."} Area scale factor = {roundTo(Math.abs(det), 3)}.</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/60">
          <svg viewBox="0 0 360 360" className="h-[390px] w-full">
            {Array.from({ length: 13 }, (_, i) => { const pos = 180 + (i - 6) * 30; return <g key={i}><line x1={pos} x2={pos} y1="0" y2="360" stroke="rgba(148,163,184,.16)" /><line x1="0" x2="360" y1={pos} y2={pos} stroke="rgba(148,163,184,.16)" /></g>; })}
            <line x1="0" x2="360" y1="180" y2="180" stroke="#64748b" /><line x1="180" x2="180" y1="0" y2="360" stroke="#64748b" />
            {gridLines.map((g) => {
              const v1 = matrixVectorMultiply2D(matrix, [g, -3]);
              const v2 = matrixVectorMultiply2D(matrix, [g, 3]);
              const h1 = matrixVectorMultiply2D(matrix, [-3, g]);
              const h2 = matrixVectorMultiply2D(matrix, [3, g]);
              return <g key={g}><line x1={toSvg(v1).split(",")[0]} y1={toSvg(v1).split(",")[1]} x2={toSvg(v2).split(",")[0]} y2={toSvg(v2).split(",")[1]} stroke="rgba(34,211,238,.28)" /><line x1={toSvg(h1).split(",")[0]} y1={toSvg(h1).split(",")[1]} x2={toSvg(h2).split(",")[0]} y2={toSvg(h2).split(",")[1]} stroke="rgba(34,211,238,.28)" /></g>;
            })}
            <polygon points={shape.map(toSvg).join(" ")} fill="rgba(148,163,184,.16)" stroke="#94a3b8" strokeWidth="3" />
            <motion.polygon animate={{ points: transformed.map(toSvg).join(" ") }} fill="rgba(34,211,238,.22)" stroke="#22d3ee" strokeWidth="4" />
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="A matrix is a function that moves every point in space."
          formula="[a b; c d][x; y] = [ax+by; cx+dy]"
          changes="Changing matrix entries bends the grid, moves the shape, changes area scale, and may flip orientation."
          realWorldUse="Computer graphics, robotics, image transforms, PCA, animation, and physics simulations."
          steps={[`Apply the matrix to each vertex.`, `Transform grid lines to see the whole plane move.`, `det=${roundTo(det, 3)} gives area scale ${roundTo(Math.abs(det), 3)}.`, det < 0 ? "Negative determinant flips orientation." : det === 0 ? "Zero determinant collapses area." : "Positive determinant preserves orientation."]}
          tasks={["Try rotation 30 or 90 degrees.", "Try projection and watch area collapse.", "Try shear and observe grid slant.", "Compare scale x and scale y."]}
        />
      </div>
    </SectionCard>
  );
}
