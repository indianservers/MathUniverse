import type { ReactNode } from "react";
import type { MatrixOperationId } from "../data/matrixOperations";

export function MatrixMark() {
  return (
    <span className="mx-mark" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export function MatrixHeroArt() {
  return (
    <figure className="mx-hero-art">
      <div className="mx-eqs" aria-hidden="true">
        <Eq name="A" cells={["2", "1", "0", "3"]} />
        <Eq name="B" cells={["1", "−1", "4", "2"]} />
        <p className="mx-prod">
          <em>C</em>
          <span>=</span>
          <em>A</em>
          <span className="mx-dot">·</span>
          <em>B</em>
        </p>
      </div>
      <Cubes />
      <blockquote>
        “Matrices turn
        <br />
        numbers into
        <br />
        possibilities.”
      </blockquote>
    </figure>
  );
}

function Eq({ name, cells }: { name: string; cells: string[] }) {
  return (
    <p className="mx-eq">
      <em>{name}</em>
      <span>=</span>
      <span className="mx-mat">
        {cells.map((cell, index) => (
          <b key={`${name}-${index}`}>{cell}</b>
        ))}
      </span>
    </p>
  );
}

function Cubes() {
  return (
    <svg className="mx-cubes" viewBox="0 0 220 150" fill="none" aria-hidden="true">
      <path d="M118 86 86 70 54 86l32 16 32-16Z" fill="#93c5fd" />
      <path d="M86 102 54 86v28l32 16V102Z" fill="#3b82f6" />
      <path d="M118 86v28l-32 16V102l32-16Z" fill="#2563eb" />
      <path d="M168 78 136 62 104 78l32 16 32-16Z" fill="#c4b5fd" />
      <path d="M136 94 104 78v28l32 16V94Z" fill="#8b5cf6" />
      <path d="M168 78v28l-32 16V94l32-16Z" fill="#7c3aed" />
      <path d="M86 62 54 46 22 62l32 16 32-16Z" fill="#67e8f9" />
      <path d="M54 78 22 62v28l32 16V78Z" fill="#22d3ee" />
      <path d="M86 62v28l-32 16V78l32-16Z" fill="#06b6d4" />
    </svg>
  );
}

export function MatrixTopicArt({ id }: { id: MatrixOperationId }) {
  return <span className="mx-glyph">{arts[id]}</span>;
}

function Mini({
  cells,
  accent = "#2563eb",
  x = 0,
  y = 0,
  scale = 1,
}: {
  cells: string[];
  accent?: string;
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="2" y="2" width="44" height="40" rx="6" fill="#fff" stroke={accent} strokeWidth="1.5" />
      {cells.map((cell, index) => (
        <text
          key={`${cell}-${index}`}
          x={13 + (index % 2) * 22}
          y={17 + Math.floor(index / 2) * 16}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#0f172a"
        >
          {cell}
        </text>
      ))}
    </g>
  );
}

const arts: Record<MatrixOperationId, ReactNode> = {
  basics: (
    <svg viewBox="0 0 72 56">
      <Mini cells={["1", "2", "3", "4"]} />
      <circle cx="58" cy="42" r="12" fill="#2563eb" />
      <text x="58" y="46" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800">+</text>
    </svg>
  ),
  addition: (
    <svg viewBox="0 0 86 48">
      <Mini cells={["1", "2", "3", "4"]} scale={0.82} />
      <text x="40" y="30" fontSize="18" fontWeight="800" fill="#2563eb">+</text>
      <Mini cells={["5", "0", "2", "1"]} accent="#22c55e" x={48} scale={0.82} />
    </svg>
  ),
  subtraction: (
    <svg viewBox="0 0 86 48">
      <Mini cells={["4", "1", "2", "3"]} accent="#f97316" scale={0.82} />
      <text x="40" y="28" fontSize="22" fontWeight="800" fill="#f97316">−</text>
      <Mini cells={["1", "0", "2", "1"]} x={48} scale={0.82} />
    </svg>
  ),
  "scalar-multiplication": (
    <svg viewBox="0 0 86 48">
      <text x="4" y="32" fontSize="22" fontWeight="800" fill="#7c3aed">3·</text>
      <Mini cells={["1", "2", "0", "4"]} accent="#7c3aed" x={36} scale={0.9} />
    </svg>
  ),
  multiplication: (
    <svg viewBox="0 0 86 48">
      <Mini cells={["2", "1", "0", "3"]} scale={0.82} />
      <text x="40" y="30" fontSize="18" fontWeight="800" fill="#16a34a">·</text>
      <Mini cells={["1", "−1", "4", "2"]} accent="#16a34a" x={48} scale={0.82} />
    </svg>
  ),
  transpose: (
    <svg viewBox="0 0 72 48">
      <text x="8" y="34" fontFamily="Times New Roman, serif" fontSize="28" fill="#0f172a">A</text>
      <text x="28" y="18" fontFamily="Times New Roman, serif" fontSize="16" fill="#0f172a">T</text>
      <path d="M42 34c10-12 22-8 26 2" stroke="#22c55e" strokeWidth="2.4" fill="none" />
      <path d="M64 28l6 10-12 0" fill="#22c55e" />
    </svg>
  ),
  determinant: (
    <svg viewBox="0 0 96 48">
      <text x="2" y="32" fontFamily="Times New Roman, serif" fontSize="22" fill="#0f172a">det(A)</text>
    </svg>
  ),
  inverse: (
    <svg viewBox="0 0 72 48">
      <text x="10" y="36" fontFamily="Times New Roman, serif" fontSize="32" fill="#0f172a">A</text>
      <text x="34" y="18" fontFamily="Times New Roman, serif" fontSize="16" fill="#0f172a">−1</text>
    </svg>
  ),
  "adjoint-cofactor": (
    <svg viewBox="0 0 72 48">
      <text x="10" y="36" fontFamily="Times New Roman, serif" fontSize="32" fill="#0f172a">A</text>
      <text x="34" y="18" fontFamily="Times New Roman, serif" fontSize="18" fill="#0f172a">*</text>
    </svg>
  ),
  rank: (
    <svg viewBox="0 0 108 48">
      <text x="2" y="32" fontFamily="Times New Roman, serif" fontSize="22" fill="#0f172a">rank(A)</text>
    </svg>
  ),
  "row-operations": (
    <svg viewBox="0 0 72 48">
      <circle cx="24" cy="24" r="14" stroke="#0ea5e9" strokeWidth="3" fill="none" />
      <circle cx="48" cy="24" r="14" stroke="#38bdf8" strokeWidth="3" fill="none" />
      <path d="M16 18c4-6 12-8 16-2" stroke="#0ea5e9" strokeWidth="2" fill="none" />
      <path d="M56 30c-4 6-12 8-16 2" stroke="#38bdf8" strokeWidth="2" fill="none" />
    </svg>
  ),
  "linear-equations": (
    <svg viewBox="0 0 96 48">
      <text x="4" y="32" fontFamily="Times New Roman, serif" fontSize="22" fill="#0f172a">Ax = b</text>
    </svg>
  ),
  "eigenvalues-eigenvectors": (
    <svg viewBox="0 0 56 48">
      <text x="10" y="36" fontFamily="Times New Roman, serif" fontSize="34" fill="#7c3aed">λ</text>
    </svg>
  ),
  transformations: (
    <svg viewBox="0 0 72 56">
      <path d="M10 48h52M18 10v38" stroke="#94a3b8" strokeWidth="1.4" />
      <path d="M36 34 22 42 28 26Z" fill="#67e8f9" stroke="#0ea5e9" />
      <path d="M36 34l14-18 10 8-10 18Z" fill="#818cf8" stroke="#6366f1" />
    </svg>
  ),
};
