import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { fmt } from "../mockup/studioLabKit";
import { LinearAlgebraLabChrome } from "./LinearAlgebraLabChrome";
import { BracketMatrix, Card, SliderRow } from "./linearAlgebraUi";
import {
  cayleyHamilton,
  classifyQuadratic,
  diagonal3Presets,
  diagonalize2,
  inverse,
  inverseFromCayley,
  jordanCheck,
  jordanPresets,
  leastSquaresQr,
  luFactor,
  matrixPower2,
  multiply,
  powerCoefficients2,
  powerCoefficients3,
  principalAxes,
  qrFactor,
  quadraticValue,
  similarMatrix,
  svd2,
  transpose,
  type Mat,
} from "./advancedLinearMath";

function cells(matrix: Mat, onChange: (row: number, col: number, value: number) => void) {
  return (
    <div className="la-matrix-edit">
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((value, col) => (
            <input
              key={col}
              aria-label={`Entry ${rowIndex + 1},${col + 1}`}
              type="number"
              step="0.5"
              value={Number.isFinite(value) ? value : 0}
              onChange={(event) => {
                const next = Number(event.target.value);
                onChange(rowIndex, col, Number.isFinite(next) ? next : 0);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function setEntry(matrix: Mat, row: number, col: number, value: number) {
  return matrix.map((line, rowIndex) => line.map((entry, colIndex) => (rowIndex === row && colIndex === col ? value : entry)));
}

export function CayleyHamiltonLab({ page }: { page: StudioMockupPage }) {
  const [A, setA] = useState<Mat>([[1, 1], [0, 1]]);
  const [B, setB] = useState<Mat>([[1, 1, 0], [0, 2, 1], [0, 0, 3]]);
  const [exponent, setExponent] = useState(4);
  const report = useMemo(() => cayleyHamilton(A), [A]);
  const cubic = useMemo(() => cayleyHamilton(B), [B]);
  const powers = powerCoefficients2(report.trace, report.determinant, exponent);
  const powered = matrixPower2(A, exponent);
  const cubicPower = powerCoefficients3(cubic.trace, cubic.sigma, cubic.determinant, exponent);
  const inverse = inverseFromCayley(A);
  const inverse3 = inverseFromCayley(B);
  return (
    <LinearAlgebraLabChrome page={page} pills>
      {(mode) => (
        <div className="la-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <Card title={mode === "Three by three" ? "3×3 characteristic polynomial" : "Characteristic polynomial"}>
            {mode === "Three by three" ? cells(B, (row, col, value) => setB(setEntry(B, row, col, value))) : cells(A, (row, col, value) => setA(setEntry(A, row, col, value)))}
            <p>{mode === "Three by three"
              ? `λ³ − (${fmt(cubic.trace, 2)})λ² + (${fmt(cubic.sigma, 2)})λ − (${fmt(cubic.determinant, 2)})`
              : `λ² − (${fmt(report.trace, 2)})λ + (${fmt(report.determinant, 2)})`}</p>
            <p>Substitute the matrix for λ. p(A) is the {mode === "Three by three" ? (cubic.zero ? "zero" : "nonzero") : (report.zero ? "zero" : "nonzero")} matrix.</p>
            <BracketMatrix matrix={mode === "Three by three" ? cubic.value : report.value} />
          </Card>
          <Card title={mode === "Powers" || mode === "Three by three" ? "Reduced power" : mode === "Inverse" ? "Inverse from the theorem" : "What the identity says"}>
            {mode === "Inverse" ? (
              <>
                {inverse ? <p>A⁻¹ = {inverse.formula}. Division is valid because det(A) = {fmt(report.determinant, 3)} ≠ 0.</p> : <p>det(A) = 0, so this matrix has no inverse. The inverse workflow stays off.</p>}
                {inverse ? <BracketMatrix matrix={inverse.inverse} /> : null}
                {inverse3 ? <p>The same idea for the 3×3 matrix uses {inverse3.formula}.</p> : <p>The current 3×3 preset is singular, so its inverse formula is disabled.</p>}
              </>
            ) : (
              <>
                <SliderRow label="Exponent n" min={0} max={8} step={1} value={exponent} digits={0} onChange={setExponent} />
                {mode === "Three by three" ? (
                  <p>A^{exponent} = ({fmt(cubicPower.alpha, 2)}) A² + ({fmt(cubicPower.beta, 2)}) A + ({fmt(cubicPower.gamma, 2)}) I</p>
                ) : (
                  <>
                    <p>A^{exponent} = ({fmt(powers.alpha, 2)}) A + ({fmt(powers.beta, 2)}) I</p>
                    <BracketMatrix matrix={powered} />
                  </>
                )}
                <p>Each higher power is reduced by the recurrence from p(A) = 0.</p>
              </>
            )}
            <p><Link to="/linear-algebra/eigenvectors">Eigenvalues are the roots of this same polynomial.</Link></p>
          </Card>
        </div>
      )}
    </LinearAlgebraLabChrome>
  );
}

export function DiagonalizationLab({ page }: { page: StudioMockupPage }) {
  const [A, setA] = useState<Mat>([[2, 1], [0, 3]]);
  const [preset, setPreset] = useState(0);
  const [stage, setStage] = useState(2);
  const info = useMemo(() => diagonalize2(A), [A]);
  const cube = diagonal3Presets[preset];
  const samples = useMemo(() => {
    if (!info.P || !info.D) return [];
    const changeInverse = inverse(info.P);
    if (!changeInverse) return [];
    const chosen = stage === 0 ? changeInverse : stage === 1 ? multiply(info.D, changeInverse) : multiply(multiply(info.P, info.D), changeInverse);
    return Array.from({ length: 16 }, (_, index) => {
      const angle = (index / 16) * Math.PI * 2;
      const x = Math.cos(angle);
      const y = Math.sin(angle);
      return [chosen[0][0] * x + chosen[0][1] * y, chosen[1][0] * x + chosen[1][1] * y] as const;
    });
  }, [info, stage]);
  return (
    <LinearAlgebraLabChrome page={page} pills>
      {(mode) => (
        <div className="la-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <Card title=            {mode === "Three by three" ? cube.label : "A = P D P⁻¹"}>
            {mode === "Three by three" ? (
              <>
                {diagonal3Presets.map((item, index) => (
                  <button key={item.id} type="button" aria-pressed={index === preset} onClick={() => setPreset(index)}>{item.label}</button>
                ))}
                <BracketMatrix matrix={cube.matrix} />
                <p>{cube.diagonalizable ? "Enough independent eigenvectors exist." : "Not every matrix is diagonalizable. This one is defective."}</p>
                <p>Algebraic multiplicities {cube.algebraic.join(", ")}. Geometric multiplicities {cube.geometric.join(", ")}.</p>
              </>
            ) : (
              <>
                {cells(A, (row, col, value) => setA(setEntry(A, row, col, value)))}
                <button type="button" onClick={() => setA([[2, 1], [0, 3]])}>Diagonalizable</button>
                <button type="button" onClick={() => setA([[4, 0], [0, 4]])}>Repeated, diagonalizable</button>
                <button type="button" onClick={() => setA([[2, 1], [0, 2]])}>Defective</button>
                <p>{info.reason}</p>
                {info.diagonalizable ? null : <p><Link to="/linear-algebra/jordan-form">Why this matrix cannot be diagonalized: geometric multiplicity is short, so a Jordan block is needed.</Link></p>}
                <p>Eigenvalues {info.eigenvalues?.map((value) => fmt(value, 2)).join(", ") || "complex"}.</p>
              </>
            )}
          </Card>
          <Card title={mode === "Three by three" ? "Multiplicity" : mode === "Visual" ? "Basis, scale, return" : "Check"}>
            {mode === "Three by three" ? (
              <>
                <p>{cube.diagonalizable ? "A full set of eigenvectors exists, so this preset has a diagonal form." : "A diagonal form does not exist: geometric multiplicity is smaller than algebraic multiplicity."}</p>
                {cube.diagonalizable ? null : <p><Link to="/linear-algebra/jordan-form">Why this matrix cannot be diagonalized: the missing eigenvector is replaced by a Jordan chain.</Link></p>}
              </>
            ) : mode === "Visual" && info.diagonalizable ? (
              <>
                <SliderRow label="Stage" min={0} max={2} step={1} value={stage} digits={0} onChange={setStage} />
                <p>{stage === 0 ? "P⁻¹ changes to the eigenbasis." : stage === 1 ? "D scales along those directions." : "P returns the result to the standard basis."}</p>
                <svg className="odes-plot" viewBox="-2 -2 4 4" role="img" aria-label="Diagonalization stages">
                  <polyline fill="none" stroke="#0f766e" points={samples.map((point) => `${point[0]},${-point[1]}`).join(" ")} />
                </svg>
              </>
            ) : (
              <>
                {info.D ? <BracketMatrix matrix={info.D} /> : <p>No real diagonal form.</p>}
                {info.rebuilt ? <p>P D P⁻¹ matches A: {info.diagonalizable ? "yes" : "no"}.</p> : null}
              </>
            )}
          </Card>
        </div>
      )}
    </LinearAlgebraLabChrome>
  );
}

export function QuadraticFormsLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(0.4);
  const [c, setC] = useState(1);
  const [x, setX] = useState(0.8);
  const [y, setY] = useState(-0.3);
  const form = classifyQuadratic(a, b, c);
  const axes = principalAxes(a, b, c);
  const value = quadraticValue(a, b, c, x, y);
  const ellipse = useMemo(() => {
    if (!axes.P || !axes.canonical || form.type.includes("indefinite") || form.type.includes("semi")) return [];
    const first = Math.abs(axes.canonical[0][0]);
    const second = Math.abs(axes.canonical[1][1]);
    if (first < 1e-6 || second < 1e-6) return [];
    return Array.from({ length: 40 }, (_, index) => {
      const angle = (index / 39) * Math.PI * 2;
      const u = Math.cos(angle) / Math.sqrt(first);
      const v = Math.sin(angle) / Math.sqrt(second);
      return [axes.P![0][0] * u + axes.P![0][1] * v, axes.P![1][0] * u + axes.P![1][1] * v] as const;
    });
  }, [axes, form.type]);
  return (
    <LinearAlgebraLabChrome page={page} pills>
      {(mode) => (
        <div className="la-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <Card title={mode === "Canonical" || page.id === "principal-axes" ? "Principal axes" : "Quadratic form"}>
            <SliderRow label="a" min={-3} max={3} step={0.1} value={a} onChange={setA} />
            <SliderRow label="h" min={-2} max={2} step={0.1} value={b} onChange={setB} />
            <SliderRow label="b" min={-3} max={3} step={0.1} value={c} onChange={setC} />
            <SliderRow label="x" min={-2} max={2} step={0.1} value={x} onChange={setX} />
            <SliderRow label="y" min={-2} max={2} step={0.1} value={y} onChange={setY} />
            <p>Q = {fmt(value, 3)}. Classification: {form.type}.</p>
            <p>{form.sylvester}</p>
          </Card>
          <Card title="Canonical form">
            {axes.canonical ? <p>λ₁ u² + λ₂ v² uses eigenvalues {axes.eigenvalues?.map((item) => fmt(item, 2)).join(" and ")}.</p> : <p>This matrix has no real orthonormal eigenbasis.</p>}
            {axes.canonical ? <BracketMatrix matrix={axes.canonical} /> : null}
            <svg viewBox="-2.2 -2.2 4.4 4.4" role="img" aria-label="Principal axes and level curve">
              <line x1="-2" y1="0" x2="2" y2="0" stroke="currentColor" opacity="0.3" />
              <line x1="0" y1="-2" x2="0" y2="2" stroke="currentColor" opacity="0.3" />
              {axes.vectors?.slice(0, 2).map((vector, index) => (
                <line key={index} x1={-vector[0]} y1={vector[1]} x2={vector[0]} y2={-vector[1]} stroke="#b45309" />
              ))}
              {ellipse.length ? <polyline fill="none" stroke="#0f766e" points={ellipse.map((point) => `${point[0]},${-point[1]}`).join(" ")} /> : null}
              <circle cx={x} cy={-y} r="0.06" fill="#0f766e" />
            </svg>
            <p>Amber lines are eigenvector axes. The teal curve is a level set when the form is definite.</p>
          </Card>
        </div>
      )}
    </LinearAlgebraLabChrome>
  );
}

export function FactorizationLab({ page }: { page: StudioMockupPage }) {
  const [A, setA] = useState<Mat>([[0, 2, 1], [1, 1, 0], [2, 0, 1]]);
  const [svdStage, setSvdStage] = useState(0);
  const lu = useMemo(() => luFactor(A), [A]);
  const qr = useMemo(() => qrFactor(A.slice(0, 2).map((row) => row.slice(0, 2))), [A]);
  const svd = useMemo(() => svd2(A.slice(0, 2).map((row) => row.slice(0, 2))), [A]);
  const fit = useMemo(() => leastSquaresQr([[1, 0], [1, 1], [1, 2]], [1, 2, 2.5]), []);
  return (
    <LinearAlgebraLabChrome page={page} pills>
      {(mode) => (
        <div className="la-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <Card title={mode}>
            {mode.startsWith("LU") || mode === "Pivoted LU" ? cells(A, (row, col, value) => setA(setEntry(A, row, col, value))) : cells(A.slice(0, 2).map((row) => row.slice(0, 2)), (row, col, value) => setA(setEntry(A, row, col, value)))}
            <button type="button" onClick={() => setA([[0, 2, 1], [1, 1, 0], [2, 0, 1]])}>Needs a swap</button>
            <button type="button" onClick={() => setA([[1, 2, 0], [2, 4, 0], [0, 0, 1]])}>Singular</button>
            {lu.singular ? <p>A pivot vanished. Continuing without a row swap would be unstable, so the factorization stops with a warning.</p> : <p>Partial pivoting produced P A = L U. Match: {lu.matches ? "yes" : "no"}.</p>}
            <ul>{lu.steps.slice(0, 6).map((step) => <li key={step}>{step}</li>)}</ul>
          </Card>
          <Card title="Factors">
            {mode === "QR" && qr.Q ? (
              <>
                <p>Q has orthonormal columns: {qr.orthonormal ? "yes" : "no"}. Q R matches A: {qr.matches ? "yes" : "no"}.</p>
                <BracketMatrix matrix={qr.Q} />
                <BracketMatrix matrix={qr.R} />
                <p>Least-squares sample A x ≈ b gives slope {fit?.solution ? fmt(fit.solution[1], 2) : "unavailable"}.</p>
                <p><Link to="/linear-algebra/least-squares">Open the least-squares lab for the geometric fit.</Link></p>
              </>
            ) : null}
            {mode === "SVD" && svd ? (
              <>
                <p>Singular values {svd.singular.map((value) => fmt(value, 2)).join(", ")}. Rank {svd.rank}. Condition {Number.isFinite(svd.condition) ? fmt(svd.condition, 2) : "infinite"}.</p>
                <p>U Σ Vᵀ matches A: {svd.matches ? "yes" : "no"}.</p>
                <SliderRow label="SVD stage" min={0} max={3} step={1} value={svdStage} digits={0} onChange={setSvdStage} />
                <p>{svdStage === 0 ? "Start with the unit circle." : svdStage === 1 ? "Vᵀ rotates or reflects into the right singular directions." : svdStage === 2 ? "Σ stretches those directions by the singular values." : "U rotates or reflects the result into the output plane."}</p>
                <svg viewBox="-3 -3 6 6" role="img" aria-label="SVD action on the unit circle">
                  <polyline fill="none" stroke="#0f766e" points={Array.from({ length: 48 }, (_, index) => {
                    const angle = (index / 47) * Math.PI * 2;
                    const point: [number, number] = [Math.cos(angle), Math.sin(angle)];
                    const afterV = multiply(transpose(svd.V), point.map((value) => [value])).map((row) => row[0]);
                    const afterS = multiply(svd.sigma, afterV.map((value) => [value])).map((row) => row[0]);
                    const afterU = multiply(svd.U, afterS.map((value) => [value])).map((row) => row[0]);
                    const chosen = svdStage === 0 ? point : svdStage === 1 ? afterV : svdStage === 2 ? afterS : afterU;
                    return `${chosen[0]},${-chosen[1]}`;
                  }).join(" ")} />
                </svg>
                <p>Rank-1 piece uses the largest singular value.</p>
                <BracketMatrix matrix={svd.rankOne} />
              </>
            ) : null}
            {mode !== "QR" && mode !== "SVD" ? (
              <>
                <p>L</p>
                <BracketMatrix matrix={lu.L} />
                <p>U</p>
                <BracketMatrix matrix={lu.U} />
                <p>P</p>
                <BracketMatrix matrix={lu.P} />
              </>
            ) : null}
          </Card>
        </div>
      )}
    </LinearAlgebraLabChrome>
  );
}

export function SimilarityLab({ page }: { page: StudioMockupPage }) {
  const [A, setA] = useState<Mat>([[2, 1], [0, 3]]);
  const [P, setP] = useState<Mat>([[1, 1], [0, 1]]);
  const [showBases, setShowBases] = useState(true);
  const result = useMemo(() => similarMatrix(A, P), [A, P]);
  return (
    <LinearAlgebraLabChrome page={page} pills>
      {() => (
        <div className="la-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <Card title="B = P⁻¹ A P">
            <p>A</p>
            {cells(A, (row, col, value) => setA(setEntry(A, row, col, value)))}
            <p>Invertible P</p>
            {cells(P, (row, col, value) => setP(setEntry(P, row, col, value)))}
            <button type="button" aria-pressed={showBases} onClick={() => setShowBases((value) => !value)}>{showBases ? "Bases shown" : "Show both bases"}</button>
          </Card>
          <Card title="Shared invariants">
            {result ? (
              <>
                <BracketMatrix matrix={result.B} />
                <ul>
                  <li>Trace {result.sameTrace ? "matches" : "differs"}</li>
                  <li>Determinant {result.sameDeterminant ? "matches" : "differs"}</li>
                  <li>Characteristic polynomial {result.samePolynomial ? "matches" : "differs"}</li>
                </ul>
                <p>Same eigenvalues, different coordinates. P must be invertible; a singular P is rejected.</p>
              </>
            ) : <p>P is singular, so it is not a change of basis.</p>}
            {showBases ? <p>The columns of P are the new basis. A and B describe one linear map in two bases.</p> : null}
            <p><Link to="/linear-algebra/diagonalization">Diagonalization is similarity to a diagonal matrix.</Link></p>
          </Card>
        </div>
      )}
    </LinearAlgebraLabChrome>
  );
}

export function JordanLab({ page }: { page: StudioMockupPage }) {
  const [index, setIndex] = useState(0);
  const preset = jordanPresets[index];
  const check = useMemo(() => jordanCheck(preset), [preset]);
  return (
    <LinearAlgebraLabChrome page={page} pills>
      {() => (
        <div className="la-grid" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <Card title="Jordan chain">
            {jordanPresets.map((item, itemIndex) => (
              <button key={item.id} type="button" aria-pressed={itemIndex === index} onClick={() => setIndex(itemIndex)}>{item.label}</button>
            ))}
            <BracketMatrix matrix={preset.matrix} />
            <p>Algebraic multiplicity {preset.algebraic}. Geometric multiplicity {check.geometric}.</p>
            <p>{preset.note}</p>
            <p>{check.diagonalizable ? "Enough eigenvectors to diagonalize." : "A missing eigenvector is why a Jordan block appears."}</p>
          </Card>
          <Card title="A = P J P⁻¹">
            {check.J ? <BracketMatrix matrix={check.J} /> : <p>The 3×3 block is already in Jordan form. A general symbolic Jordan decomposition is not claimed.</p>}
            {check.rebuilt ? <p>Rebuilt matrix matches the preset: {check.matches ? "yes" : "no"}.</p> : null}
            <p><Link to="/linear-algebra/diagonalization">Compare this with a diagonalizable repeated eigenvalue.</Link></p>
          </Card>
        </div>
      )}
    </LinearAlgebraLabChrome>
  );
}
