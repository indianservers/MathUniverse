import { useState, type ReactNode } from "react";
import * as la from "./linearAlgebraEnhancementEngine";

function Tool({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <article data-enhancement-id={id} className="min-h-40 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70">
      <h2 className="text-sm font-black">{title}</h2>
      {children}
    </article>
  );
}

function Mini({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 72" className="mt-2 h-16 w-full rounded-lg bg-indigo-50 dark:bg-indigo-950/40" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function Input({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="grid gap-1 text-xs font-bold">
      <span>{label}</span>
      <input className="h-10 rounded-lg border border-slate-200 px-2" type="number" step="0.1" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="mt-2 font-mono text-[11px] leading-5 text-slate-700">{children}</p>;
}

function n(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : "∞";
}

function vec(values: number[]) {
  return `(${values.map((value) => n(value)).join(", ")})`;
}

function mat(values: number[][]) {
  return values.map((row) => `[${row.map((value) => n(value)).join(" ")}]`).join(" ");
}

export default function LinearAlgebraEnhancementWorkbench() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(1);
  const [d, setD] = useState(3);
  const [csv, setCsv] = useState("1,2\n3,4");
  const m: [[number, number], [number, number]] = [[a, b], [c, d]];
  const v: [number, number] = [a, b];
  const w: [number, number] = [c, d];
  const det = la.determinant(m);
  const cond = la.conditionNumber2(m);
  const eigen = la.eigen2(m);
  const parsed = la.parseMatrixCsv(csv);
  const span = la.spanAnalysis([v, w]);
  const pca = la.pca2([[a, b], [c, d], [a + c, b + d], [2 * a, 2 * b]]);
  const markov = la.markovStep([1, 0], [[0.8, 0.2], [0.1, 0.9]], Math.max(1, Math.round(Math.abs(a))));
  const coords = la.basisCoordinates(v, [1, 1], [1, -1]);
  const gs = la.gramSchmidt([v, w]);
  const proj = la.projection(v, w);
  const products = la.dotCross([a, b, 1], [c, d, 1]);
  const composed = la.multiply(m, [[0, -1], [1, 0]]);
  const reduced = la.rref([[a, b, 1], [c, d, 0]]);
  const spaces = la.fundamentalSubspaces(m);
  const inv = la.inverse2(m);
  const lu = la.lu2(m);
  const qr = la.qr2(m);
  const sigmas = la.singularValues2(m);
  const jordan = la.jordanClassification(m);
  const spectral = la.spectralDecomposition([[a, b], [b, d]]);
  const quad = la.classifyQuadraticForm([[a, b], [b, d]]);
  const rotating = la.eigen2([[a, -b], [b, a]]);
  const graph = la.adjacencyAnalysis([[0, 1, 1], [1, 0, 0], [1, 0, 0]]);
  const flow = la.linearSystemEuler(m, [1, 1], 1);
  const image = la.rankOneApproximation(m);
  const commute = la.proofCounterexample("commutative", m, [[1, 1], [0, 1]]);
  const ox = 30, oy = 58, u = 12;

  return (
    <div className="space-y-4 p-2">
      <section className="rounded-xl border border-indigo-200 bg-gradient-to-r from-cyan-50 to-indigo-50 p-4">
        <h1 className="text-xl font-black">Advanced Linear Algebra Workbench</h1>
        <p className="mt-1 text-sm text-slate-600">Twenty-five connected vector, matrix, factorization, eigenvalue, numerical-stability, and application tools.</p>
      </section>
      <section aria-label="Shared linear algebra parameters" className="grid gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <Input label="Matrix a₁₁" value={a} onChange={setA} />
        <Input label="Matrix a₁₂" value={b} onChange={setB} />
        <Input label="Matrix a₂₁" value={c} onChange={setC} />
        <Input label="Matrix a₂₂" value={d} onChange={setD} />
        <label className="grid gap-1 text-xs font-bold sm:col-span-2 xl:col-span-4">
          <span>Matrix CSV</span>
          <textarea aria-label="Matrix CSV" className="min-h-16 rounded-lg border p-2 font-mono" value={csv} onChange={(e) => setCsv(e.target.value)} />
        </label>
      </section>
      <section aria-label="Twenty-five Linear Algebra enhancements" className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Tool id="LINALG-01" title="1. Coordinates in a chosen basis">
          <Mini label="basis coordinates"><line x1={ox} y1={oy} x2={ox + a * u} y2={oy - b * u} stroke="#147df2" /><line x1={ox} y1={oy} x2={ox + 12} y2={oy - 12} stroke="#8b45f4" /></Mini>
          <Caption>{coords ? `coordinates ${vec(coords)} in the { (1,1), (1,-1) } basis` : "basis is singular"}</Caption>
        </Tool>
        <Tool id="LINALG-02" title="2. Span visualizer">
          <Mini label="span"><polygon points={`${ox},${oy} ${ox + a * u},${oy - b * u} ${ox + (a + c) * u},${oy - (b + d) * u} ${ox + c * u},${oy - d * u}`} fill="rgba(20,125,242,.2)" stroke="#147df2" /></Mini>
          <Caption>rank {span.rank} · independent {String(span.independent)}</Caption>
        </Tool>
        <Tool id="LINALG-03" title="3. Linear-dependence detector">
          <Mini label="dependence">{span.independent ? <polygon points="30,58 90,18 130,58" fill="rgba(16,185,129,.25)" stroke="#10b981" /> : <line x1="24" y1="58" x2="136" y2="18" stroke="#ef4444" strokeWidth="4" />}</Mini>
          <Caption>{la.dependenceCoefficients([v, w]) == null ? "independent" : "dependent — one vector is a scale of the other"}</Caption>
        </Tool>
        <Tool id="LINALG-04" title="4. Gram–Schmidt orthogonalization">
          <Mini label="Gram-Schmidt"><line x1={ox} y1={oy} x2={ox + 40} y2={oy} stroke="#10b981" /><line x1={ox} y1={oy} x2={ox} y2={oy - 32} stroke="#f59e0b" /></Mini>
          <Caption>{gs.map((q, i) => `q${i + 1} ${vec(q)}`).join(" · ") || "need a nonzero spanning set"}</Caption>
        </Tool>
        <Tool id="LINALG-05" title="5. Projection and least squares">
          <Mini label="projection"><line x1={ox} y1={oy} x2={ox + 50} y2={oy} stroke="#147df2" /><line x1={ox} y1={oy} x2={ox + 30} y2={oy - 24} stroke="#8b45f4" /><line x1={ox + 30} y1={oy - 24} x2={ox + 30} y2={oy} stroke="#f59e0b" strokeDasharray="3 2" /></Mini>
          <Caption>proj {vec(proj.projected)} · residual {vec(proj.residual)}</Caption>
        </Tool>
        <Tool id="LINALG-06" title="6. Dot and cross products">
          <Mini label="dot and cross"><line x1="30" y1="58" x2="90" y2="20" stroke="#147df2" /><line x1="30" y1="58" x2="120" y2="50" stroke="#8b45f4" /><line x1="30" y1="58" x2="48" y2="18" stroke="#f59e0b" /></Mini>
          <Caption>dot {n(products.dot)} · |cross| {n(Math.hypot(...products.cross))} · θ {n(products.angle * 180 / Math.PI, 1)}°</Caption>
        </Tool>
        <Tool id="LINALG-07" title="7. Determinant geometry">
          <Mini label="determinant parallelogram"><polygon points={`${ox},${oy} ${ox + a * u},${oy} ${ox + a * u + b * u},${oy - 24} ${ox + b * u},${oy - 24}`} fill={det >= 0 ? "rgba(16,185,129,.25)" : "rgba(239,68,68,.25)"} stroke="#10b981" /></Mini>
          <Caption>det {det} · area {Math.abs(det)}</Caption>
        </Tool>
        <Tool id="LINALG-08" title="8. Matrix composition">
          <Mini label="composition"><polygon points="30,58 70,58 86,22 46,22" fill="rgba(139,69,244,.2)" stroke="#8b45f4" /></Mini>
          <Caption>A · R90 = {mat(composed)}</Caption>
        </Tool>
        <Tool id="LINALG-09" title="9. Row-operation workbench">
          <Mini label="rref steps">{reduced.matrix.map((row, i) => <line key={i} x1="20" y1={20 + i * 16} x2={20 + Math.abs(row[0] ?? 0) * 40} y2={20 + i * 16} stroke="#147df2" strokeWidth="4" />)}</Mini>
          <Caption>RREF {mat(reduced.matrix)}</Caption>
        </Tool>
        <Tool id="LINALG-10" title="10. Fundamental subspaces">
          <Mini label="rank-nullity"><rect x="20" y="24" width={spaces.rank * 40} height="12" fill="#147df2" /><rect x="20" y="44" width={Math.max(8, spaces.nullity * 40)} height="12" fill="#f59e0b" /></Mini>
          <Caption>rank {spaces.rank} · nullity {spaces.nullity} · pivots {spaces.pivotColumns.join(", ") || "none"}</Caption>
        </Tool>
        <Tool id="LINALG-11" title="11. Inverse transformation">
          <Mini label="inverse">{inv ? <polygon points="40,52 88,52 88,20 40,20" fill="rgba(16,185,129,.2)" stroke="#10b981" /> : <text x="24" y="42" fill="#ef4444" fontSize="12">singular</text>}</Mini>
          <Caption>{inv ? `A⁻¹ = ${mat(inv)}` : "singular — no inverse"}</Caption>
        </Tool>
        <Tool id="LINALG-12" title="12. LU, QR, and SVD">
          <Mini label="factorizations"><rect x="18" y="18" width="36" height="36" fill="#93c5fd" /><rect x="62" y="18" width="36" height="36" fill="#c4b5fd" /><rect x="106" y="18" width="36" height="36" fill="#fde68a" /></Mini>
          <Caption>σ {sigmas.map((value) => n(value)).join(", ")} · LU {lu ? "ok" : "needs pivot"} · QR {qr ? "ok" : "rank drop"}</Caption>
        </Tool>
        <Tool id="LINALG-13" title="13. Dynamic eigenvectors">
          <Mini label="eigenlines">{(eigen.vectors ?? []).map((vecItem, i) => <line key={i} x1={80 - vecItem[0] * 20} y1={36 + vecItem[1] * 12} x2={80 + vecItem[0] * 20} y2={36 - vecItem[1] * 12} stroke="#8b45f4" />)}</Mini>
          <Caption>{eigen.values.length ? `λ = ${eigen.values.map((value) => n(value)).join(", ")}` : "complex pair"}</Caption>
        </Tool>
        <Tool id="LINALG-14" title="14. Defective matrices and Jordan form">
          <Mini label="Jordan">{jordan.kind === "defective" ? <rect x="40" y="20" width="80" height="32" fill="rgba(239,68,68,.2)" stroke="#ef4444" /> : <rect x="40" y="20" width="80" height="32" fill="rgba(16,185,129,.2)" stroke="#10b981" />}</Mini>
          <Caption>{jordan.kind}{jordan.eigenvalue != null ? ` · λ = ${n(jordan.eigenvalue)}` : ""}</Caption>
        </Tool>
        <Tool id="LINALG-15" title="15. Spectral theorem">
          <Mini label="spectral"><ellipse cx="80" cy="36" rx="48" ry="18" fill="none" stroke="#8b45f4" /></Mini>
          <Caption>{spectral ? `symmetric · λ ${spectral.eigenvalues.map((value) => n(value)).join(", ")} · Q orthonormal ${String(spectral.orthonormal)}` : "not symmetric"}</Caption>
        </Tool>
        <Tool id="LINALG-16" title="16. Quadratic-form classification">
          <Mini label="quadratic"><ellipse cx="80" cy="36" rx={Math.max(12, Math.abs(a) * 8)} ry={Math.max(8, Math.abs(d) * 6)} fill="rgba(8,185,221,.2)" stroke="#08b9dd" /></Mini>
          <Caption>{quad.type} · λ {quad.eigenvalues.map((value) => n(value)).join(", ")}</Caption>
        </Tool>
        <Tool id="LINALG-17" title="17. Complex eigenvalues">
          <Mini label="complex plane"><line x1="20" y1="36" x2="140" y2="36" stroke="#94a3b8" /><line x1="80" y1="8" x2="80" y2="64" stroke="#94a3b8" /><circle cx="104" cy="24" r="5" fill="#8b45f4" /></Mini>
          <Caption>{rotating.complex ? rotating.complex.map((z) => `${n(z.real)} ${z.imaginary >= 0 ? "+" : "−"} ${n(Math.abs(z.imaginary))}i`).join(" · ") : `real λ ${rotating.values.map((value) => n(value)).join(", ")}`}</Caption>
        </Tool>
        <Tool id="LINALG-18" title="18. Principal component analysis">
          <Mini label="PCA cloud">{[[a, b], [c, d], [a + c, b + d]].map((p, i) => <circle key={i} cx={40 + p[0] * 8} cy={50 - p[1] * 6} r="4" fill="#147df2" />)}</Mini>
          <Caption>mean {vec(pca.mean)}</Caption>
        </Tool>
        <Tool id="LINALG-19" title="19. Markov-chain dynamics">
          <Mini label="Markov simplex"><circle cx={40 + markov[0] * 80} cy={36} r="8" fill="#08b9dd" /><circle cx={40 + markov[1] * 80} cy={50} r="8" fill="#8b45f4" /></Mini>
          <Caption>state {vec(markov)}</Caption>
        </Tool>
        <Tool id="LINALG-20" title="20. Adjacency-matrix graph analysis">
          <Mini label="graph"><circle cx="40" cy="24" r="6" fill="#f59e0b" /><circle cx="90" cy="48" r="6" fill="#10b981" /><circle cx="120" cy="20" r="6" fill="#147df2" /><line x1="40" y1="24" x2="90" y2="48" stroke="#334155" /><line x1="40" y1="24" x2="120" y2="20" stroke="#334155" /></Mini>
          <Caption>{graph.vertices} vertices · {graph.edges} edges · degrees {graph.degrees.join(", ")}</Caption>
        </Tool>
        <Tool id="LINALG-21" title="21. Linear differential-system portrait">
          <Mini label="flow"><path d="M 24 50 Q 70 10 130 40" fill="none" stroke="#147df2" /><circle cx="130" cy="40" r="4" fill="#f59e0b" /></Mini>
          <Caption>after t=1, state {vec([flow.x, flow.y])}</Caption>
        </Tool>
        <Tool id="LINALG-22" title="22. Conditioning and error amplification">
          <Mini label="condition gauge"><rect x="20" y="28" width={Math.min(120, (Number.isFinite(cond.condition) ? cond.condition : 120) * 8)} height="12" fill={cond.illConditioned ? "#ef4444" : "#10b981"} /></Mini>
          <Caption>κ ≈ {String(cond.condition)}</Caption>
        </Tool>
        <Tool id="LINALG-23" title="23. Image SVD compression">
          <Mini label="rank-one image"><rect x="24" y="16" width="48" height="40" fill="#cbd5e1" /><rect x="88" y="16" width="48" height="40" fill="#93c5fd" /></Mini>
          <Caption>σ₁ {n(image.sigma)} · rank-1 approx {mat(image.approximation)}</Caption>
        </Tool>
        <Tool id="LINALG-24" title="24. Matrix-claim counterexample">
          <Mini label="commutator"><rect x="24" y="20" width="48" height="32" fill="#bfdbfe" /><rect x="88" y="20" width="48" height="32" fill="#ddd6fe" /></Mini>
          <Caption>{commute.holds ? "AB equals BA on this pair" : "AB ≠ BA — multiplication is not commutative"}</Caption>
        </Tool>
        <Tool id="LINALG-25" title="25. Matrix CSV import">
          <Mini label="csv grid">{parsed.valid ? parsed.matrix.slice(0, 3).flatMap((row, i) => row.slice(0, 4).map((cell, j) => <rect key={`${i}-${j}`} x={20 + j * 28} y={12 + i * 18} width="24" height="14" fill={cell ? "#93c5fd" : "#e2e8f0"} />)) : <text x="28" y="42" fill="#ef4444" fontSize="12">invalid</text>}</Mini>
          <Caption>{parsed.valid ? `${parsed.rows}×${parsed.columns} matrix loaded` : "Invalid CSV"}</Caption>
        </Tool>
      </section>
    </div>
  );
}
