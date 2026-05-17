import { useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { Matrix2x2, matrixVectorMultiply2D } from "../../utils/linearAlgebra";
import { roundTo } from "../../utils/math";

type Preset = {
  name: string;
  matrix: Matrix2x2;
  info: string;
  eigenLines: [number, number][];
};

const presets: Preset[] = [
  { name: "[2 0; 0 1]", matrix: [[2, 0], [0, 1]], info: "Eigenvectors lie on the x-axis and y-axis with eigenvalues 2 and 1.", eigenLines: [[1, 0], [0, 1]] },
  { name: "[1 1; 0 1]", matrix: [[1, 1], [0, 1]], info: "The x-axis keeps direction with eigenvalue 1.", eigenLines: [[1, 0]] },
  { name: "[3 0; 0 2]", matrix: [[3, 0], [0, 2]], info: "Axis-aligned eigenvectors scale by 3 and 2.", eigenLines: [[1, 0], [0, 1]] },
  { name: "[2 1; 1 2]", matrix: [[2, 1], [1, 2]], info: "Directions [1,1] and [1,-1] are eigenvectors with eigenvalues 3 and 1.", eigenLines: [[1, 1], [1, -1]] },
];

const center = 180;
const scale = 24;
const vectors = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  return [Math.cos(angle) * 3, Math.sin(angle) * 3] as [number, number];
});
const toSvg = ([x, y]: [number, number]) => ({ x: center + x * scale, y: center - y * scale });

export default function EigenvectorVisualizer() {
  const [preset, setPreset] = useState(presets[0]);

  return (
    <SectionCard title="Eigenvector Demonstration" description="Eigenvectors keep their direction after transformation, only their length changes.">
      <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
        <div className="space-y-4">
          <div className="grid gap-2">{presets.map((item) => <button key={item.name} className={`rounded-2xl px-4 py-3 text-left font-semibold ${item.name === preset.name ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 dark:bg-white/10"}`} onClick={() => setPreset(item)}>{item.name}</button>)}</div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="font-bold">Matrix {preset.name}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{preset.info}</p>
            <p className="mt-3 font-mono text-sm">A v = λ v</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/60">
          <svg viewBox="0 0 360 360" className="h-[390px] w-full">
            <defs><marker id="eig-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" /></marker></defs>
            {Array.from({ length: 13 }, (_, i) => { const pos = 180 + (i - 6) * 30; return <g key={i}><line x1={pos} x2={pos} y1="0" y2="360" stroke="rgba(148,163,184,.16)" /><line x1="0" x2="360" y1={pos} y2={pos} stroke="rgba(148,163,184,.16)" /></g>; })}
            <line x1="0" x2="360" y1="180" y2="180" stroke="#64748b" /><line x1="180" x2="180" y1="0" y2="360" stroke="#64748b" />
            {preset.eigenLines.map((line, index) => {
              const p1 = toSvg([line[0] * -6, line[1] * -6]);
              const p2 = toSvg([line[0] * 6, line[1] * 6]);
              return <line key={index} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 6" />;
            })}
            {vectors.map((vector, index) => {
              const end = toSvg(vector);
              const transformed = toSvg(matrixVectorMultiply2D(preset.matrix, vector));
              return <g key={index}><line x1={center} y1={center} x2={end.x} y2={end.y} stroke="#94a3b8" strokeWidth="1.5" /><line x1={center} y1={center} x2={transformed.x} y2={transformed.y} stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#eig-arrow)" /></g>;
            })}
          </svg>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">Gray vectors are original directions. Cyan vectors are transformed. Gold dashed lines are eigen-directions.</p>
        </div>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="Eigenvectors reveal stable directions of a transformation."
          formula="A v = λ v"
          changes="Changing the preset matrix changes which directions remain on the same line after transformation."
          realWorldUse="PCA, Google PageRank, vibration analysis, quantum mechanics, stability analysis, and AI embeddings."
          steps={["Choose a matrix with known eigenvectors.", "Transform many directions from the origin.", "Look for vectors that stay on their original line.", "Those stable directions satisfy A v = λ v."]}
          tasks={["Try the diagonal matrices.", "Try [2 1; 1 2].", "Compare gray original vectors and cyan transformed vectors.", "Find the gold dashed eigen-directions."]}
        />
      </div>
    </SectionCard>
  );
}
