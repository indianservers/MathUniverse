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
    <svg viewBox="0 0 160 72" className="mt-2 h-16 w-full rounded-lg bg-indigo-50 dark:bg-indigo-950/40" role="img" aria-label={label}>
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
          <Caption>{JSON.stringify(la.basisCoordinates(v, [1, 1], [1, -1]))}</Caption>
        </Tool>
        <Tool id="LINALG-02" title="2. Span visualizer">
          <Mini label="span"><polygon points={`${ox},${oy} ${ox + a * u},${oy - b * u} ${ox + (a + c) * u},${oy - (b + d) * u} ${ox + c * u},${oy - d * u}`} fill="rgba(20,125,242,.2)" stroke="#147df2" /></Mini>
          <Caption>rank {span.rank} · independent {String(span.independent)}</Caption>
        </Tool>
        <Tool id="LINALG-03" title="3. Linear-dependence detector">
          <Caption>{la.dependenceCoefficients([v, w]) ?? "independent"}</Caption>
        </Tool>
        <Tool id="LINALG-04" title="4. Gram–Schmidt orthogonalization">
          <Mini label="Gram-Schmidt"><line x1={ox} y1={oy} x2={ox + 40} y2={oy} stroke="#10b981" /><line x1={ox} y1={oy} x2={ox} y2={oy - 32} stroke="#f59e0b" /></Mini>
          <Caption>{JSON.stringify(la.gramSchmidt([v, w]).map((q) => q.map((n) => Math.round(n * 100) / 100)))}</Caption>
        </Tool>
        <Tool id="LINALG-05" title="5. Projection and least squares">
          <Mini label="projection"><line x1={ox} y1={oy} x2={ox + 50} y2={oy} stroke="#147df2" /><line x1={ox} y1={oy} x2={ox + 30} y2={oy - 24} stroke="#8b45f4" /><line x1={ox + 30} y1={oy - 24} x2={ox + 30} y2={oy} stroke="#f59e0b" strokeDasharray="3 2" /></Mini>
          <Caption>proj {JSON.stringify(la.projection(v, w).projected.map((n) => Math.round(n * 100) / 100))}</Caption>
        </Tool>
        <Tool id="LINALG-06" title="6. Dot and cross products">
          <Caption>{JSON.stringify(la.dotCross([a, b, 1], [c, d, 1]), (_, v) => typeof v === "number" ? Math.round(v * 1000) / 1000 : v)}</Caption>
        </Tool>
        <Tool id="LINALG-07" title="7. Determinant geometry">
          <Mini label="determinant parallelogram"><polygon points={`${ox},${oy} ${ox + a * u},${oy} ${ox + a * u + b * u},${oy - 24} ${ox + b * u},${oy - 24}`} fill={det >= 0 ? "rgba(16,185,129,.25)" : "rgba(239,68,68,.25)"} stroke="#10b981" /></Mini>
          <Caption>det {det} · area {Math.abs(det)}</Caption>
        </Tool>
        <Tool id="LINALG-08" title="8. Matrix composition">
          <Caption>{JSON.stringify(la.multiply(m, [[0, -1], [1, 0]]))}</Caption>
        </Tool>
        <Tool id="LINALG-09" title="9. Row-operation workbench">
          <Caption>{JSON.stringify(la.rref([[a, b, 1], [c, d, 0]]).matrix)}</Caption>
        </Tool>
        <Tool id="LINALG-10" title="10. Fundamental subspaces">
          <Caption>{JSON.stringify(la.fundamentalSubspaces(m))}</Caption>
        </Tool>
        <Tool id="LINALG-11" title="11. Inverse transformation">
          <Caption>{JSON.stringify(la.inverse2(m))}</Caption>
        </Tool>
        <Tool id="LINALG-12" title="12. LU, QR, and SVD">
          <Caption>{JSON.stringify({ lu: la.lu2(m), qr: la.qr2(m), singularValues: la.singularValues2(m) }, (_, v) => typeof v === "number" ? Math.round(v * 1000) / 1000 : v)}</Caption>
        </Tool>
        <Tool id="LINALG-13" title="13. Dynamic eigenvectors">
          <Mini label="eigenlines">{(eigen.vectors ?? []).map((vec, i) => <line key={i} x1={80 - vec[0] * 20} y1={36 + vec[1] * 12} x2={80 + vec[0] * 20} y2={36 - vec[1] * 12} stroke="#8b45f4" />)}</Mini>
          <Caption>{JSON.stringify(eigen.values)}</Caption>
        </Tool>
        <Tool id="LINALG-14" title="14. Defective matrices and Jordan form">
          <Caption>{JSON.stringify(la.jordanClassification(m))}</Caption>
        </Tool>
        <Tool id="LINALG-15" title="15. Spectral theorem">
          <Caption>{JSON.stringify(la.spectralDecomposition([[a, b], [b, d]]))}</Caption>
        </Tool>
        <Tool id="LINALG-16" title="16. Quadratic-form classification">
          <Caption>{JSON.stringify(la.classifyQuadraticForm([[a, b], [b, d]]))}</Caption>
        </Tool>
        <Tool id="LINALG-17" title="17. Complex eigenvalues">
          <Caption>{JSON.stringify(la.eigen2([[a, -b], [b, a]]))}</Caption>
        </Tool>
        <Tool id="LINALG-18" title="18. Principal component analysis">
          <Mini label="PCA cloud">{[[a, b], [c, d], [a + c, b + d]].map((p, i) => <circle key={i} cx={40 + p[0] * 8} cy={50 - p[1] * 6} r="4" fill="#147df2" />)}</Mini>
          <Caption>mean {JSON.stringify(pca.mean.map((n) => Math.round(n * 100) / 100))}</Caption>
        </Tool>
        <Tool id="LINALG-19" title="19. Markov-chain dynamics">
          <Mini label="Markov simplex"><circle cx={40 + markov[0] * 80} cy={36} r="8" fill="#08b9dd" /><circle cx={40 + markov[1] * 80} cy={50} r="8" fill="#8b45f4" /></Mini>
          <Caption>{JSON.stringify(markov.map((n) => Math.round(n * 1000) / 1000))}</Caption>
        </Tool>
        <Tool id="LINALG-20" title="20. Adjacency-matrix graph analysis">
          <Mini label="graph"><circle cx="40" cy="24" r="6" fill="#f59e0b" /><circle cx="90" cy="48" r="6" fill="#10b981" /><circle cx="120" cy="20" r="6" fill="#147df2" /><line x1="40" y1="24" x2="90" y2="48" stroke="#334155" /><line x1="40" y1="24" x2="120" y2="20" stroke="#334155" /></Mini>
          <Caption>{JSON.stringify(la.adjacencyAnalysis([[0, 1, 1], [1, 0, 0], [1, 0, 0]]))}</Caption>
        </Tool>
        <Tool id="LINALG-21" title="21. Linear differential-system portrait">
          <Caption>{JSON.stringify(la.linearSystemEuler(m, [1, 1], 1), (_, v) => typeof v === "number" ? Math.round(v * 1000) / 1000 : v)}</Caption>
        </Tool>
        <Tool id="LINALG-22" title="22. Conditioning and error amplification">
          <Mini label="condition gauge"><rect x="20" y="28" width={Math.min(120, (Number.isFinite(cond.condition) ? cond.condition : 120) * 8)} height="12" fill={cond.illConditioned ? "#ef4444" : "#10b981"} /></Mini>
          <Caption>κ ≈ {String(cond.condition)}</Caption>
        </Tool>
        <Tool id="LINALG-23" title="23. Image SVD compression">
          <Caption>{JSON.stringify(la.rankOneApproximation(m), (_, v) => typeof v === "number" ? Math.round(v * 1000) / 1000 : v)}</Caption>
        </Tool>
        <Tool id="LINALG-24" title="24. Matrix-claim counterexample">
          <Caption>{JSON.stringify(la.proofCounterexample("commutative", m, [[1, 1], [0, 1]]))}</Caption>
        </Tool>
        <Tool id="LINALG-25" title="25. Matrix CSV import">
          <Caption>{parsed.valid ? `${parsed.rows}×${parsed.columns} matrix loaded` : "Invalid CSV"} · {JSON.stringify(parsed.matrix)}</Caption>
        </Tool>
      </section>
    </div>
  );
}
