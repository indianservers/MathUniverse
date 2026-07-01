import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { ConceptImagePanel } from "../components/syllabus/ConceptVisualMedia";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import VisualLearningPanel from "../components/ui/VisualLearningPanel";
import { getAdvancedSyllabusLab, type AdvancedLabVisual, type AdvancedSyllabusLab } from "../data/advancedSyllabusLabs";
import { roundTo } from "../utils/math";

export default function AdvancedSyllabusLabPage() {
  const { labId } = useParams();
  const lab = getAdvancedSyllabusLab(labId);
  if (!lab) return <Navigate to="/syllabus" replace />;
  return <AdvancedSyllabusLabDetail lab={lab} />;
}

function AdvancedSyllabusLabDetail({ lab }: { lab: AdvancedSyllabusLab }) {
  const [a, setA] = useState(lab.defaultA);
  const [b, setB] = useState(lab.defaultB);

  useEffect(() => {
    setA(lab.defaultA);
    setB(lab.defaultB);
  }, [lab]);

  const metrics = useMemo(() => labMetrics(lab.visual, a, b), [lab.visual, a, b]);
  const dataRows = useMemo(() => labDataRows(lab.visual, a, b), [lab.visual, a, b]);

  return (
    <div className="space-y-6">
      <TopicHeader title={lab.title} subtitle={lab.summary} difficulty={`${lab.category} / ${lab.subcategory}`} estimatedMinutes={15} />
      <ConceptImagePanel title={lab.title} text={`${lab.summary} ${lab.category} ${lab.subcategory} ${lab.formula}`} />

      <SectionCard title="Interactive Concept Lab" description="Move the controls, watch the diagram update, and connect the visual pattern to the formula.">
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-4">
            <FormulaBlock title="Core Idea" formula={lab.formula} explanation={lab.summary} />
            <SliderGroup title="Concept controls">
              <SliderControl density="compact" label={lab.sliderA} value={a} min={lab.minA} max={lab.maxA} step={lab.stepA} onChange={setA} />
              <SliderControl density="compact" label={lab.sliderB} value={b} min={lab.minB} max={lab.maxB} step={lab.stepB} onChange={setB} />
            </SliderGroup>
            <div className="grid grid-cols-2 gap-2">{metrics.map((metric) => <Metric key={metric.label} label={metric.label} value={metric.value} />)}</div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950">
              <LabSvg visual={lab.visual} a={a} b={b} title={lab.title} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Info label="Category" value={lab.category} />
              <Info label="Subcategory" value={lab.subcategory} />
              <Info label="What to notice" value={noticeText(lab.visual)} />
            </div>
            <DataVisualizationPanel rows={dataRows} visual={lab.visual} />
          </div>
        </div>
      </SectionCard>

      <VisualLearningPanel concept={lab.summary} formula={lab.formula} changes={`${lab.sliderA} and ${lab.sliderB} control the visual model and the readout.`} realWorldUse={lab.category} steps={learningSteps(lab, a, b)} tasks={lab.tasks} />

      <SectionCard title={`${lab.title} Visual Resources`} description="Only this lab's formula, controls, measurements, and activity prompts are shown here.">
        <div className="grid gap-3 md:grid-cols-3">
          <Info label="Formula" value={lab.formula} />
          <Info label="Visualization" value={noticeText(lab.visual)} />
          <Info label="Interactive task" value={lab.tasks[0] ?? "Move the controls and explain what changes."} />
        </div>
      </SectionCard>
    </div>
  );
}

function LabSvg({ visual, a, b, title }: { visual: AdvancedLabVisual; a: number; b: number; title: string }) {
  return (
    <svg viewBox="0 0 760 460" className="h-[320px] w-full sm:h-[460px]">
      <title>{title}</title>
      <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" /></marker></defs>
      <rect width="760" height="460" rx="24" fill="#f8fafc" />
      <Grid />
      {renderVisual(visual, a, b)}
    </svg>
  );
}

type LabDataRow = { label: string; input: number; output: number };

function DataVisualizationPanel({ rows, visual }: { rows: LabDataRow[]; visual: AdvancedLabVisual }) {
  const max = Math.max(...rows.map((row) => Math.abs(row.output)), 1);
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">Live Data Visualization</p>
          <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{noticeText(visual)} as sampled data</p>
        </div>
        <span className="mini-chip">{rows.length} samples</span>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <svg viewBox="0 0 420 150" className="h-40 w-full rounded-xl bg-white dark:bg-slate-950" role="img" aria-label={`${visual} live data chart`}>
          <line x1="28" y1="124" x2="398" y2="124" stroke="#94a3b8" strokeWidth="2" />
          <line x1="28" y1="18" x2="28" y2="124" stroke="#94a3b8" strokeWidth="2" />
          {rows.map((row, index) => {
            const height = Math.max(4, Math.abs(row.output) / max * 86);
            return (
              <g key={row.label}>
                <rect x={48 + index * 53} y={124 - height} width="28" height={height} rx="5" fill={index % 2 ? "#8b5cf6" : "#06b6d4"} opacity="0.82" />
                <circle cx={62 + index * 53} cy={124 - height} r="4" fill="#f59e0b" />
                <text x={48 + index * 53} y="142" fill="#475569" fontSize="10" fontWeight="800">{row.label}</text>
              </g>
            );
          })}
          <polyline points={rows.map((row, index) => `${62 + index * 53},${124 - Math.abs(row.output) / max * 86}`).join(" ")} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-slate-950">
          <div className="grid grid-cols-3 bg-slate-100 px-3 py-2 font-black uppercase text-slate-500 dark:bg-white/10 dark:text-slate-300">
            <span>Step</span>
            <span>Input</span>
            <span>Output</span>
          </div>
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 border-t border-slate-100 px-3 py-2 font-semibold dark:border-white/10">
              <span>{row.label}</span>
              <span>{roundTo(row.input, 2)}</span>
              <span>{roundTo(row.output, 3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function labDataRows(visual: AdvancedLabVisual, a: number, b: number): LabDataRow[] {
  return Array.from({ length: 7 }, (_, index) => {
    const input = index + 1;
    const output = sampleLabValue(visual, input, a, b);
    return { label: `S${index + 1}`, input, output };
  });
}

function sampleLabValue(visual: AdvancedLabVisual, input: number, a: number, b: number) {
  if (/convergence|series|sequence|cauchy|power-series/.test(visual)) return 1 / Math.pow(input + Math.max(0.2, b), Math.max(0.4, a / 2));
  if (/matrix|gaussian|linear-system|cayley|eigen|gram|quadratic|span|vector/.test(visual)) return Math.sin(input * 0.7 + a) * b + input * 0.18;
  if (/probability|beta|gamma|statistics|interpolation|distribution/.test(visual)) return Math.exp(-Math.pow(input - (3.2 + a / 4), 2) / Math.max(0.6, b + 1));
  if (/graph|operation|relation|mapping|truth|venn|permutation|group|symmetry/.test(visual)) return ((input * Math.round(a + 2) + Math.round(b * 3)) % 9) + 1;
  if (/heat|wave|laplace|field|curl|divergence|pde|slope|ode|spring/.test(visual)) return Math.sin(input * 0.85 + a) * Math.cos(b / 2) + 1.2;
  if (/fourier|laplace-transform|z-transform|convolution|step|impulse|signal/.test(visual)) return Math.abs(Math.sin(input * Math.max(0.2, a)) * Math.exp(-input / (3 + Math.max(0, b))));
  if (/root|newton|secant|fixed|error|numerical|quadrature|rk4/.test(visual)) return 1 / (input + Math.max(0.2, a)) + Math.abs(b) * 0.04;
  if (/circle|curvature|coordinate|transform|triangle|area|integral|riemann|shell|washer|jacobian/.test(visual)) return Math.max(0.1, a * 0.2 + b * 0.12 + Math.sin(input) * 0.8);
  return Math.abs(Math.sin(input + a) + Math.cos(input * 0.6 + b));
}

function renderVisual(visual: AdvancedLabVisual, a: number, b: number) {
  if (visual === "venn") return <Venn a={a} b={b} />;
  if (visual === "mapping") return <Mapping size={Math.round(a)} shift={Math.round(b)} />;
  if (visual === "relation-matrix") return <RelationMatrix rule={Math.round(a)} size={Math.round(b)} />;
  if (visual === "truth-table") return <TruthTable expr={Math.round(a)} rows={Math.round(b)} />;
  if (visual === "induction") return <Induction n={Math.round(a)} strength={b} />;
  if (visual === "equivalence") return <Equivalence modulo={Math.round(a)} size={Math.round(b)} />;
  if (visual === "limit") return <LimitVisual distance={a} target={b} />;
  if (visual === "continuity") return <Continuity kind={Math.round(a)} point={b} />;
  if (visual === "tangent" || visual === "derivative") return <Tangent x={a} h={visual === "derivative" ? b : 0} scale={visual === "tangent" ? b : 1} />;
  if (visual === "higher-derivative") return <HigherDerivative coeff={a} marker={b} />;
  if (visual === "maxima") return <Maxima shift={a} marker={b} />;
  if (visual === "taylor") return <Taylor degree={Math.round(a)} x={b} />;
  if (visual === "curvature") return <Curvature x={a} scale={b} />;
  if (visual === "riemann") return <Riemann rectangles={Math.round(a)} end={b} />;
  if (visual === "area-under-curve") return <AreaUnderCurve start={a} end={b} />;
  if (visual === "shell-washer") return <ShellWasher position={a} mix={b} />;
  if (visual === "double-integral") return <DoubleIntegral width={a} height={b} />;
  if (visual === "triple-integral") return <TripleIntegral base={a} height={b} />;
  if (visual === "coordinate-transform") return <CoordinateTransform warp={a} rotation={b} />;
  if (visual === "beta-gamma") return <BetaGamma alpha={a} beta={b} />;
  if (visual === "sequence-convergence") return <SequenceConvergence n={Math.round(a)} limit={b} />;
  if (visual === "cauchy-sequence") return <CauchySequence start={Math.round(a)} epsilon={b} />;
  if (visual === "series-partial-sum") return <SeriesPartialSum n={Math.round(a)} ratio={b} />;
  if (visual === "convergence-test") return <ConvergenceTest family={Math.round(a)} parameter={b} />;
  if (visual === "power-series-radius") return <PowerSeriesRadius radius={a} point={b} />;
  if (visual === "pointwise-uniform") return <PointwiseUniform n={Math.round(a)} probe={b} />;
  if (visual === "partition-refinement") return <PartitionRefinement pieces={Math.round(a)} bias={b} />;
  if (visual === "argand-plane") return <ArgandPlane real={a} imaginary={b} />;
  if (visual === "complex-rotation") return <ComplexRotation angle={a} radius={b} />;
  if (visual === "nth-roots") return <NthRoots count={Math.round(a)} angle={b} />;
  if (visual === "domain-coloring") return <DomainColoring power={Math.round(a)} zoom={b} />;
  if (visual === "cauchy-riemann") return <CauchyRiemann x={a} y={b} />;
  if (visual === "laurent-annulus") return <LaurentAnnulus inner={a} outer={b} />;
  if (visual === "residue-pole") return <ResiduePole strength={a} radius={b} />;
  if (visual === "conformal-map") return <ConformalMap strength={a} rotation={b} />;
  if (visual === "vector-2d-3d") return <Vector2D3D x={a} yz={b} />;
  if (visual === "span-basis") return <SpanBasis coeffA={a} coeffB={b} />;
  if (visual === "matrix-grid-warp") return <MatrixGridWarp shear={a} rotation={b} />;
  if (visual === "gaussian-elimination") return <GaussianElimination step={Math.round(a)} pivotScale={b} />;
  if (visual === "eigenvector-direction") return <EigenvectorDirection angle={a} stretch={b} />;
  if (visual === "diagonalization-flow") return <DiagonalizationFlow lambda1={a} lambda2={b} />;
  if (visual === "gram-schmidt") return <GramSchmidt vx={a} vy={b} />;
  if (visual === "quadratic-form-surface") return <QuadraticFormSurface a={a} c={b} />;
  if (visual === "cayley-table") return <CayleyTable order={Math.round(a)} shift={Math.round(b)} />;
  if (visual === "group-operation") return <GroupOperation first={Math.round(a)} second={Math.round(b)} />;
  if (visual === "symmetry-group") return <SymmetryGroup sides={Math.round(a)} step={Math.round(b)} />;
  if (visual === "permutation-cycle") return <PermutationCycle size={Math.round(a)} shift={Math.round(b)} />;
  if (visual === "coset-partition") return <CosetPartition groupSize={Math.round(a)} subgroupSize={Math.round(b)} />;
  if (visual === "homomorphism-map") return <HomomorphismMap domainOrder={Math.round(a)} multiplier={Math.round(b)} />;
  if (visual === "ring-operation-table") return <RingOperationTable modulus={Math.round(a)} mode={Math.round(b)} />;
  if (visual === "slope-field") return <SlopeField coeffX={a} coeffY={b} />;
  if (visual === "solution-curve") return <SolutionCurve initialY={a} growth={b} />;
  if (visual === "direction-field") return <DirectionField spring={a} damping={b} />;
  if (visual === "orthogonal-trajectory") return <OrthogonalTrajectory spacing={a} rotation={b} />;
  if (visual === "spring-mass-ode") return <SpringMassODE spring={a} damping={b} />;
  if (visual === "heat-equation") return <HeatEquation time={a} diffusion={b} />;
  if (visual === "wave-equation") return <WaveEquation time={a} speed={b} />;
  if (visual === "laplace-potential") return <LaplacePotential strength={a} tilt={b} />;
  if (visual === "root-finding") return <RootFinding left={a} right={b} />;
  if (visual === "newton-raphson") return <NewtonRaphson initial={a} iterations={Math.round(b)} />;
  if (visual === "error-convergence") return <ErrorConvergence family={Math.round(a)} initialError={b} />;
  if (visual === "interpolation-builder") return <InterpolationBuilder count={Math.round(a)} tension={b} />;
  if (visual === "numerical-integration") return <NumericalIntegration intervals={Math.round(a)} method={Math.round(b)} />;
  if (visual === "euler-rk4") return <EulerRK4 steps={Math.round(a)} growth={b} />;
  if (visual === "linear-system-solver") return <LinearSystemSolver iteration={Math.round(a)} relaxation={b} />;
  if (visual === "cayley-hamilton") return <CayleyHamilton trace={a} determinant={b} />;
  if (visual === "de-moivre") return <DeMoivre n={Math.round(a)} angle={b} />;
  if (visual === "complex-log") return <ComplexLog angle={a} branch={Math.round(b)} />;
  if (visual === "complex-trig") return <ComplexTrig real={a} imaginary={b} />;
  if (visual === "jacobian") return <Jacobian stretch={a} shear={b} />;
  if (visual === "lagrange-multiplier") return <LagrangeMultiplier radius={a} tilt={b} />;
  if (visual === "asymptote-tracing") return <AsymptoteTracing shift={a} asymptote={b} />;
  if (visual === "higher-order-ode") return <HigherOrderODE damping={a} stiffness={b} />;
  if (visual === "cauchy-euler") return <CauchyEuler coeffA={a} coeffB={b} />;
  if (visual === "laplace-transform") return <LaplaceTransform decay={a} s={b} />;
  if (visual === "step-impulse") return <StepImpulse delay={a} strength={b} />;
  if (visual === "convolution") return <Convolution shift={a} width={b} />;
  if (visual === "fourier-transform") return <FourierTransformSpectrum width={a} marker={b} />;
  if (visual === "z-transform") return <ZTransform poleRadius={a} inputStep={b} />;
  if (visual === "mobius-map") return <MobiusMap pole={a} rotation={b} />;
  if (visual === "complex-line-integral") return <ComplexLineIntegral radius={a} swirl={b} />;
  if (visual === "cauchy-integral") return <CauchyIntegral pointRadius={a} contourRadius={b} />;
  if (visual === "vector-calculus-field") return <VectorCalculusField swirl={a} source={b} />;
  if (visual === "fixed-point") return <FixedPointIteration initial={a} contraction={b} />;
  if (visual === "secant-method") return <SecantMethod x0={a} x1={b} />;
  if (visual === "divided-differences") return <DividedDifferences count={Math.round(a)} evaluation={b} />;
  if (visual === "finite-difference-interpolation") return <FiniteDifferenceInterpolation index={Math.round(a)} step={b} />;
  if (visual === "gaussian-quadrature") return <GaussianQuadrature nodes={Math.round(a)} bend={b} />;
  if (visual === "graph-theory") return <GraphTheory nodeCount={Math.round(a)} density={b} />;
  if (visual === "operations-research") return <OperationsResearch c1={a} c2={b} />;
  return <PartialSurface x={a} y={b} />;
}

function GraphTheory({ nodeCount, density }: { nodeCount: number; density: number }) {
  const n = Math.max(4, Math.min(nodeCount, 9));
  const positions = Array.from({ length: n }, (_, i) => ({
    x: 380 + 155 * Math.cos(-Math.PI / 2 + 2 * Math.PI * i / n),
    y: 230 + 155 * Math.sin(-Math.PI / 2 + 2 * Math.PI * i / n),
  }));
  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const seed = (i * 31 + j * 17 + Math.floor(density * 100)) % 100;
      if (seed / 100 < density) edges.push([i, j]);
    }
  }
  const degrees = Array.from({ length: n }, (_, i) => edges.filter(([a, b]) => a === i || b === i).length);
  const degSum = degrees.reduce((s, d) => s + d, 0);
  const degSeq = [...degrees].sort((a, b) => b - a).join(", ");
  return (
    <g>
      <Label x="80" y="65" text={`n=${n} nodes, ${edges.length} edges, degree sum=${degSum} = 2|E|`} />
      {edges.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={positions[a].x} y1={positions[a].y} x2={positions[b].x} y2={positions[b].y} stroke="#06b6d4" strokeWidth="3" opacity="0.65" />
      ))}
      {positions.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="20" fill="#8b5cf6" stroke="#0f172a" strokeWidth="2" />
          <text x={p.x - 5} y={p.y + 6} fill="white" fontSize="14" fontWeight="900">{i}</text>
          <text x={p.x + 24} y={p.y + 5} fill="#0f172a" fontSize="12" fontWeight="700">d={degrees[i]}</text>
        </g>
      ))}
      <Label x="80" y="415" text={`Degree sequence: ${degSeq}. Handshaking: sum(deg) = 2 * edges.`} />
    </g>
  );
}

function OperationsResearch({ c1, c2 }: { c1: number; c2: number }) {
  const corners = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 2, y: 3 }, { x: 0, y: 5 }];
  const gx = (v: number) => 105 + v * 108;
  const gy = (v: number) => 400 - v * 58;
  const zValues = corners.map((p) => ({ ...p, z: roundTo(c1 * p.x + c2 * p.y, 2) }));
  const maxZ = Math.max(...zValues.map((p) => p.z));
  const optimal = zValues.find((p) => p.z === maxZ);
  const polyPts = corners.map((p) => `${gx(p.x)},${gy(p.y)}`).join(" ");
  const constraints = [
    { x1: 0, y1: 5, x2: 4, y2: 0 },
    { x1: 0, y1: 3, x2: 4, y2: 3 },
  ];
  return (
    <g>
      <Label x="80" y="55" text={`Maximize Z = ${roundTo(c1, 1)}x + ${roundTo(c2, 1)}y over feasible region`} />
      <line x1="80" x2="660" y1={gy(0)} y2={gy(0)} stroke="#0f172a" strokeWidth="2" />
      <line x1={gx(0)} y1="50" x2={gx(0)} y2="420" stroke="#0f172a" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((v) => (
        <g key={v}>
          <text x={gx(v) - 5} y={gy(0) + 20} fill="#334155" fontSize="13" fontWeight="700">{v}</text>
          <text x={gx(0) - 20} y={gy(v) + 5} fill="#334155" fontSize="13" fontWeight="700">{v}</text>
        </g>
      ))}
      {constraints.map((c, i) => (
        <line key={i} x1={gx(c.x1)} y1={gy(c.y1)} x2={gx(c.x2)} y2={gy(c.y2)} stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="8 5" opacity="0.7" />
      ))}
      <polygon points={polyPts} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="3" />
      {zValues.map((p) => (
        <g key={`${p.x}-${p.y}`}>
          <circle cx={gx(p.x)} cy={gy(p.y)} r={p.z === maxZ ? 12 : 7} fill={p.z === maxZ ? "#f59e0b" : "#ef4444"} stroke="#0f172a" strokeWidth="2" />
          <text x={gx(p.x) + 15} y={gy(p.y) - 4} fill="#0f172a" fontSize="12" fontWeight="800">Z={p.z}</text>
        </g>
      ))}
      {optimal && (
        <text x={gx(optimal.x) + 15} y={gy(optimal.y) + 16} fill="#f59e0b" fontSize="11" fontWeight="900">optimal ({optimal.x},{optimal.y})</text>
      )}
      <Label x="80" y="430" text={`Max Z = ${maxZ}. Check all corner points — the simplex method moves between adjacent ones.`} />
    </g>
  );
}

function ZTransform({ poleRadius, inputStep }: { poleRadius: number; inputStep: number }) {
  const radius = Math.max(0.1, Math.min(1.8, poleRadius));
  const poleX = 380 + radius * 105;
  const response = Array.from({ length: 22 }, (_, n) => inputStep * Math.pow(radius, n));
  const stable = radius < 1;
  return (
    <g>
      <Label x="80" y="58" text={`Z-plane pole radius ${roundTo(radius, 2)}: ${stable ? "stable response" : "outside unit circle"}`} />
      <line x1="105" x2="395" y1="240" y2="240" stroke="#94a3b8" strokeWidth="2" />
      <line x1="250" x2="250" y1="95" y2="385" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="250" cy="240" r="105" fill="#06b6d4" opacity="0.08" stroke="#06b6d4" strokeWidth="4" />
      <circle cx={poleX - 130} cy="240" r="12" fill={stable ? "#10b981" : "#ef4444"} stroke="#0f172a" strokeWidth="2" />
      <text x="305" y="115" fill="#0f172a" fontSize="13" fontWeight="800">unit circle</text>
      <path d={response.map((value, n) => {
        const x = 425 + n * 12;
        const y = 305 - Math.max(-3, Math.min(3, value)) * 48;
        return `${n ? "L" : "M"}${x},${y}`;
      }).join(" ")} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      <line x1="420" x2="690" y1="305" y2="305" stroke="#94a3b8" strokeWidth="2" />
      {response.slice(0, 16).map((value, n) => (
        <circle key={n} cx={425 + n * 12} cy={305 - Math.max(-3, Math.min(3, value)) * 48} r="4" fill="#8b5cf6" />
      ))}
      <Label x="420" y="405" text="Right plot: recurrence response x_(n+1)=r*x_n + input." />
    </g>
  );
}

function VectorCalculusField({ swirl, source }: { swirl: number; source: number }) {
  const points = [-2, -1, 0, 1, 2].flatMap((x) => [-1.5, -0.5, 0.5, 1.5].map((y) => ({ x, y })));
  const center = { x: 380, y: 230 };
  const scale = 70;
  const field = (x: number, y: number) => ({ x: source * x - swirl * y, y: source * y + swirl * x });
  const curl = 2 * swirl;
  const divergence = 2 * source;
  return (
    <g>
      <Label x="80" y="58" text={`div F=${roundTo(divergence, 2)}, curl F=${roundTo(curl, 2)} for radial plus swirl field`} />
      <ellipse cx={center.x} cy={center.y} rx="185" ry="105" fill="#06b6d4" opacity="0.08" stroke="#06b6d4" strokeWidth="4" />
      {points.map((p, index) => {
        const v = field(p.x, p.y);
        const mag = Math.hypot(v.x, v.y) || 1;
        const x1 = center.x + p.x * scale;
        const y1 = center.y - p.y * scale;
        return <Arrow key={index} x1={x1} y1={y1} x2={x1 + v.x / mag * 28} y2={y1 - v.y / mag * 28} color={source >= 0 ? "#06b6d4" : "#f59e0b"} />;
      })}
      <path d="M245,230 C245,150 515,150 515,230 C515,310 245,310 245,230" fill="none" stroke="#8b5cf6" strokeWidth="5" strokeDasharray="10 7" />
      <Arrow x1={520} y1={230} x2={500} y2={swirl >= 0 ? 190 : 270} color="#8b5cf6" />
      <line x1="380" y1="230" x2="565" y2="230" stroke="#f59e0b" strokeWidth="4" />
      <text x="570" y="235" fill="#0f172a" fontSize="12" fontWeight="900">flux normal</text>
      <Label x="100" y="410" text="Boundary circulation links to curl; outward flux links to divergence." />
    </g>
  );
}

function Venn({ a, b }: { a: number; b: number }) {
  const overlap = Math.min(a, b);
  return <g><circle cx="315" cy="230" r={a + 45} fill="#06b6d4" opacity="0.28" stroke="#06b6d4" strokeWidth="5" /><circle cx={445 - overlap} cy="230" r="105" fill="#8b5cf6" opacity="0.28" stroke="#8b5cf6" strokeWidth="5" /><Label x="230" y="125" text="A" /><Label x="520" y="125" text="B" /><Label x="330" y="235" text={`overlap ${roundTo(overlap, 0)}`} /></g>;
}

function Mapping({ size, shift }: { size: number; shift: number }) {
  return <g>{Array.from({ length: size }).map((_, i) => <g key={`d-${i}`}><circle cx="170" cy={95 + i * 48} r="18" fill="#06b6d4" /><Label x="160" y={101 + i * 48} text={`${i + 1}`} /></g>)}{Array.from({ length: size }).map((_, i) => <g key={`c-${i}`}><circle cx="590" cy={95 + i * 48} r="18" fill="#8b5cf6" /><Label x="580" y={101 + i * 48} text={`${String.fromCharCode(97 + i)}`} /></g>)}{Array.from({ length: size }).map((_, i) => <Arrow key={`a-${i}`} x1={195} y1={95 + i * 48} x2={565} y2={95 + ((i + shift) % size) * 48} color="#f59e0b" />)}</g>;
}

function RelationMatrix({ rule, size }: { rule: number; size: number }) {
  const active = (i: number, j: number) => rule === 1 ? i === j : rule === 2 ? i <= j : rule === 3 ? (i + j) % 2 === 0 : Math.abs(i - j) <= 1;
  return <g><Label x="80" y="70" text="Relation matrix" />{Array.from({ length: size }).flatMap((_, i) => Array.from({ length: size }).map((__, j) => <rect key={`${i}-${j}`} x={160 + j * 55} y={100 + i * 45} width="38" height="32" rx="8" fill={active(i, j) ? "#06b6d4" : "#e2e8f0"} stroke="#0f172a" opacity="0.8" />))}</g>;
}

function TruthTable({ expr, rows }: { expr: number; rows: number }) {
  const names = ["p AND q", "p OR q", "p -> q", "p <-> q"];
  const vals = [[true, true], [true, false], [false, true], [false, false]].slice(0, rows);
  const result = (p: boolean, q: boolean) => expr === 1 ? p && q : expr === 2 ? p || q : expr === 3 ? !p || q : p === q;
  return <g><Label x="90" y="70" text={names[expr - 1] ?? names[0]} />{["p", "q", "result"].map((h, i) => <Label key={h} x={170 + i * 150} y="120" text={h} />)}{vals.map(([p, q], r) => [p, q, result(p, q)].map((v, c) => <text key={`${r}-${c}`} x={178 + c * 150} y={165 + r * 50} fill="#0f172a" fontSize="24" fontWeight="900">{v ? "T" : "F"}</text>))}</g>;
}

function Induction({ n }: { n: number; strength: number }) {
  return <g><Label x="80" y="75" text="Base case, then k -> k+1" />{Array.from({ length: 12 }).map((_, i) => <rect key={i} x={95 + i * 50} y={260 - Math.min(i, n - 1) * 8} width="28" height="105" rx="8" fill={i < n ? "#06b6d4" : "#cbd5e1"} transform={`rotate(${i < n ? -14 : 0} ${109 + i * 50} ${312})`} />)}<Label x="90" y="410" text={`P(1) starts the chain; P(${n}) is reached.`} /></g>;
}

function Equivalence({ modulo, size }: { modulo: number; size: number }) {
  const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];
  return <g><Label x="80" y="70" text={`Classes modulo ${modulo}`} />{Array.from({ length: size }).map((_, i) => <g key={i}><circle cx={105 + (i % 12) * 52} cy={130 + Math.floor(i / 12) * 72} r="20" fill={colors[i % modulo]} opacity="0.75" /><Label x={97 + (i % 12) * 52} y={136 + Math.floor(i / 12) * 72} text={`${i}`} /></g>)}</g>;
}

function LimitVisual({ distance, target }: { distance: number; target: number }) {
  const left = target - distance, right = target + distance;
  return <Graph>{curvePath((x) => (x * x - 1) / (x - 1 || 0.001), -3, 3, "#06b6d4")}<PointGraph x={left} y={left + 1} label="left" /><PointGraph x={right} y={right + 1} label="right" /><PointGraph x={target} y={target + 1} label="limit" color="#f59e0b" /></Graph>;
}

function Continuity({ kind, point }: { kind: number; point: number }) {
  return <Graph>{curvePath((x) => kind === 2 && x > point ? x + 2 : kind === 3 ? 1 / (x - point || 0.08) : x * x, -3, 3, "#06b6d4")}<circle cx={gx(point)} cy={gy(kind === 1 ? point * point + 1.4 : point * point)} r="8" fill="#f8fafc" stroke="#ef4444" strokeWidth="4" /></Graph>;
}

function Tangent({ x, h, scale }: { x: number; h: number; scale: number }) {
  const f = (t: number) => scale * (t * t - 1);
  const slope = 2 * scale * x;
  return <Graph>{curvePath(f, -3, 3, "#06b6d4")}<line x1={gx(x - 1.6)} y1={gy(f(x) - slope * 1.6)} x2={gx(x + 1.6)} y2={gy(f(x) + slope * 1.6)} stroke="#f59e0b" strokeWidth="4" />{h > 0 && <line x1={gx(x)} y1={gy(f(x))} x2={gx(x + h)} y2={gy(f(x + h))} stroke="#8b5cf6" strokeWidth="4" />}<PointGraph x={x} y={f(x)} label={`slope ${roundTo(slope, 2)}`} /></Graph>;
}

function HigherDerivative({ coeff, marker }: { coeff: number; marker: number }) {
  return <Graph>{curvePath((x) => coeff * x ** 3 / 4, -3, 3, "#06b6d4")}{curvePath((x) => coeff * 3 * x * x / 4, -3, 3, "#8b5cf6")}{curvePath((x) => coeff * 1.5 * x, -3, 3, "#f59e0b")}<PointGraph x={marker} y={coeff * marker ** 3 / 4} label="f" /></Graph>;
}

function Maxima({ shift, marker }: { shift: number; marker: number }) {
  const f = (x: number) => -(x ** 3) + 3 * x + shift;
  return <Graph>{curvePath(f, -3, 3, "#06b6d4")}<PointGraph x={-1} y={f(-1)} label="min" color="#8b5cf6" /><PointGraph x={1} y={f(1)} label="max" color="#f59e0b" /><PointGraph x={marker} y={f(marker)} label="scan" /></Graph>;
}

function Taylor({ degree, x }: { degree: number; x: number }) {
  const approx = (t: number) => Array.from({ length: degree + 1 }).reduce<number>((sum, _, n) => sum + ((n % 2 ? -1 : 1) * t ** (2 * n)) / factorial(2 * n), 0);
  return <Graph>{curvePath(Math.cos, -3, 3, "#06b6d4")}{curvePath(approx, -3, 3, "#f59e0b")}<PointGraph x={x} y={approx(x)} label={`degree ${degree}`} /></Graph>;
}

function Curvature({ x, scale }: { x: number; scale: number }) {
  const f = (t: number) => scale * t * t / 2;
  const yp = scale * x, ypp = scale;
  const k = Math.abs(ypp) / Math.pow(1 + yp * yp, 1.5);
  const r = Math.min(2.5, 1 / Math.max(k, 0.01));
  return <Graph>{curvePath(f, -3, 3, "#06b6d4")}<circle cx={gx(x)} cy={gy(f(x) + r)} r={Math.abs(gx(r) - gx(0))} fill="none" stroke="#f59e0b" strokeWidth="4" opacity="0.8" /><PointGraph x={x} y={f(x)} label={`R ${roundTo(1 / Math.max(k, 0.01), 2)}`} /></Graph>;
}

function PartialSurface({ x, y }: { x: number; y: number }) {
  const z = (x * x + y * y) / 4;
  return <g><Label x="80" y="70" text={`z=(x^2+y^2)/4, z=${roundTo(z, 2)}`} /><ellipse cx="380" cy="250" rx="210" ry="95" fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="4" /><line x1="170" y1={250 - y * 18} x2="590" y2={250 - y * 18} stroke="#f59e0b" strokeWidth="5" /><line x1={380 + x * 45} y1="130" x2={380 + x * 45} y2="365" stroke="#8b5cf6" strokeWidth="5" /><Point x={380 + x * 45} y={250 - y * 18} label="slice point" /></g>;
}

function Riemann({ rectangles, end }: { rectangles: number; end: number }) {
  const start = 0;
  const dx = (end - start) / rectangles;
  const f = (x: number) => 0.35 * x * x + 0.6;
  return <Graph>{curvePath(f, 0, 5, "#06b6d4")}{Array.from({ length: rectangles }).map((_, i) => { const x = start + i * dx; const h = f(x + dx); return <rect key={i} x={gx(x)} y={gy(h)} width={Math.max(2, gx(x + dx) - gx(x))} height={gy(0) - gy(h)} fill="#22d3ee" opacity="0.28" stroke="#0891b2" />; })}<Label x="90" y="75" text={`n=${rectangles}, dx=${roundTo(dx, 3)}`} /></Graph>;
}

function AreaUnderCurve({ start, end }: { start: number; end: number }) {
  const left = Math.min(start, end);
  const right = Math.max(start, end);
  const f = (x: number) => Math.sin(x) + 1.2;
  const areaPath = [`M${gx(left)},${gy(0)}`, ...Array.from({ length: 100 }).map((_, i) => { const x = left + (i / 99) * (right - left); return `L${gx(x)},${gy(f(x))}`; }), `L${gx(right)},${gy(0)}Z`].join(" ");
  return <Graph><path d={areaPath} fill="#f59e0b" opacity="0.28" />{curvePath(f, -3, 4, "#06b6d4")}<Label x="90" y="75" text={`interval [${roundTo(left, 2)}, ${roundTo(right, 2)}]`} /></Graph>;
}

function ShellWasher({ position, mix }: { position: number; mix: number }) {
  const radius = 36 + position * 34;
  const shellOpacity = 0.25 + (1 - mix) * 0.45;
  const washerOpacity = 0.25 + mix * 0.45;
  return <g><Label x="80" y="70" text={mix < 0.5 ? "Shell method emphasized" : "Washer method emphasized"} /><ellipse cx="380" cy="245" rx={radius} ry="145" fill="#06b6d4" opacity={shellOpacity} stroke="#06b6d4" strokeWidth="5" /><rect x={380 - radius / 2} y="115" width={radius} height="260" fill="#06b6d4" opacity={shellOpacity * 0.5} /><ellipse cx="380" cy="245" rx={radius * 1.35} ry={radius * 0.48} fill="#f59e0b" opacity={washerOpacity} stroke="#f59e0b" strokeWidth="5" /><ellipse cx="380" cy="245" rx={radius * 0.55} ry={radius * 0.2} fill="#f8fafc" stroke="#0f172a" strokeWidth="3" /><Label x="110" y="410" text="shells use radius x height; washers use outer minus inner area" /></g>;
}

function DoubleIntegral({ width, height }: { width: number; height: number }) {
  const w = width * 95;
  const h = height * 75;
  const x = 380 - w / 2;
  const y = 240 - h / 2;
  return <g><Label x="80" y="70" text={`Region R area approx ${roundTo(width * height, 2)}`} /><rect x={x} y={y} width={w} height={h} rx="20" fill="#06b6d4" opacity="0.24" stroke="#06b6d4" strokeWidth="5" />{Array.from({ length: 8 }).map((_, i) => <line key={`v-${i}`} x1={x + (i / 7) * w} y1={y} x2={x + (i / 7) * w} y2={y + h} stroke="#0891b2" opacity="0.45" />)}{Array.from({ length: 6 }).map((_, i) => <line key={`h-${i}`} x1={x} y1={y + (i / 5) * h} x2={x + w} y2={y + (i / 5) * h} stroke="#0891b2" opacity="0.45" />)}<Point x={x + w * 0.68} y={y + h * 0.35} label="f(x,y)" /></g>;
}

function TripleIntegral({ base, height }: { base: number; height: number }) {
  const s = base * 42;
  const h = height * 45;
  const x = 275, y = 340, d = 70;
  return <g><Label x="80" y="70" text={`Volume elements dV, scale ${roundTo(base * base * height, 2)}`} /><polygon points={`${x},${y} ${x + s},${y} ${x + s + d},${y - d} ${x + d},${y - d}`} fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="4" /><polygon points={`${x + s},${y} ${x + s + d},${y - d} ${x + s + d},${y - d - h} ${x + s},${y - h}`} fill="#8b5cf6" opacity="0.18" stroke="#8b5cf6" strokeWidth="4" /><polygon points={`${x},${y} ${x + s},${y} ${x + s},${y - h} ${x},${y - h}`} fill="#f59e0b" opacity="0.22" stroke="#f59e0b" strokeWidth="4" /><Label x="95" y="410" text="triple integral stacks tiny boxes through a solid region" /></g>;
}

function CoordinateTransform({ warp, rotation }: { warp: number; rotation: number }) {
  const angle = (rotation * Math.PI) / 180;
  const transformPoint = (u: number, v: number) => {
    const x = u + warp * Math.sin(v * 1.4);
    const y = v + warp * Math.sin(u * 1.4);
    return { x: 380 + (x * Math.cos(angle) - y * Math.sin(angle)) * 60, y: 235 + (x * Math.sin(angle) + y * Math.cos(angle)) * 42 };
  };
  const lines = [];
  for (let k = -3; k <= 3; k += 1) {
    lines.push(Array.from({ length: 80 }).map((_, i) => transformPoint(-3 + (i / 79) * 6, k)));
    lines.push(Array.from({ length: 80 }).map((_, i) => transformPoint(k, -3 + (i / 79) * 6)));
  }
  return <g><Label x="80" y="70" text={`Jacobian changes local area; warp=${roundTo(warp, 2)}`} />{lines.map((line, i) => <path key={i} d={line.map((p, j) => `${j ? "L" : "M"}${p.x},${p.y}`).join(" ")} fill="none" stroke={i % 2 ? "#06b6d4" : "#8b5cf6"} strokeWidth="2" opacity="0.72" />)}</g>;
}

function BetaGamma({ alpha, beta }: { alpha: number; beta: number }) {
  const betaShape = (x: number) => Math.pow(Math.max(0.001, x), alpha - 1) * Math.pow(Math.max(0.001, 1 - x), beta - 1);
  const gammaShape = (x: number) => Math.pow(Math.max(0.001, x), alpha - 1) * Math.exp(-x);
  const betaMax = Math.max(...Array.from({ length: 100 }).map((_, i) => betaShape(i / 100)));
  const gammaMax = Math.max(...Array.from({ length: 100 }).map((_, i) => gammaShape((i / 100) * 6)));
  const betaPath = Array.from({ length: 160 }).map((_, i) => { const x = i / 159; return `${i ? "L" : "M"}${100 + x * 260},${350 - (betaShape(x) / betaMax) * 220}`; }).join(" ");
  const gammaPath = Array.from({ length: 160 }).map((_, i) => { const x = (i / 159) * 6; return `${i ? "L" : "M"}${420 + (x / 6) * 260},${350 - (gammaShape(x) / gammaMax) * 220}`; }).join(" ");
  return <g><Label x="100" y="80" text={`Beta(${roundTo(alpha, 1)}, ${roundTo(beta, 1)})`} /><Label x="420" y="80" text={`Gamma alpha=${roundTo(alpha, 1)}`} /><path d={betaPath} fill="none" stroke="#06b6d4" strokeWidth="5" /><path d={gammaPath} fill="none" stroke="#f59e0b" strokeWidth="5" /><line x1="90" x2="370" y1="350" y2="350" stroke="#94a3b8" /><line x1="410" x2="690" y1="350" y2="350" stroke="#94a3b8" /></g>;
}

function SequenceConvergence({ n, limit }: { n: number; limit: number }) {
  const seq = (k: number) => limit + 1 / k;
  return <Graph><line x1="80" x2="680" y1={gy(limit)} y2={gy(limit)} stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 7" />{Array.from({ length: Math.min(n, 60) }).map((_, i) => <circle key={i} cx={90 + i * 9.5} cy={gy(seq(i + 1))} r="4" fill="#06b6d4" />)}<Label x="90" y="75" text={`a_n = L + 1/n, error=${roundTo(1 / n, 4)}`} /></Graph>;
}

function CauchySequence({ start, epsilon }: { start: number; epsilon: number }) {
  const points = Array.from({ length: 42 }, (_, i) => 1 + Math.sin(i * 1.7) / (i + 1));
  return <Graph><rect x={gx(0)} y={gy(1 + epsilon)} width="520" height={Math.abs(gy(1 - epsilon) - gy(1 + epsilon))} fill="#f59e0b" opacity="0.16" />{points.map((p, i) => <circle key={i} cx={100 + i * 13} cy={gy(p)} r={i + 1 >= start ? 5 : 3} fill={i + 1 >= start ? "#06b6d4" : "#94a3b8"} />)}<Label x="90" y="75" text={`tail starts at N=${start}, epsilon=${roundTo(epsilon, 2)}`} /></Graph>;
}

function SeriesPartialSum({ n, ratio }: { n: number; ratio: number }) {
  const sums = Array.from({ length: n }, (_, i) => (1 - Math.pow(ratio, i + 1)) / (1 - ratio || 0.001));
  const target = 1 / (1 - ratio || 0.001);
  return <Graph><line x1="80" x2="680" y1={gy(Math.max(-4, Math.min(4, target)))} y2={gy(Math.max(-4, Math.min(4, target)))} stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 7" />{sums.slice(0, 70).map((s, i) => <circle key={i} cx={90 + i * 8.4} cy={gy(Math.max(-4, Math.min(4, s)))} r="4" fill="#06b6d4" />)}<Label x="90" y="75" text={`S_n=${roundTo(sums.at(-1) ?? 0, 4)}, infinite=${roundTo(target, 4)}`} /></Graph>;
}

function ConvergenceTest({ family, parameter }: { family: number; parameter: number }) {
  const names = ["geometric", "p-series", "harmonic", "alternating"];
  const converges = family === 1 ? Math.abs(parameter) < 1 : family === 2 ? parameter > 1 : family === 3 ? false : parameter > 0;
  const bars = Array.from({ length: 22 }, (_, i) => family === 1 ? Math.abs(parameter) ** i : family === 2 ? 1 / Math.pow(i + 1, parameter) : family === 3 ? 1 / (i + 1) : (i % 2 ? -1 : 1) / Math.pow(i + 1, parameter));
  return <g><Label x="80" y="70" text={`${names[family - 1] ?? names[0]}: ${converges ? "likely converges" : "diverges / inconclusive"}`} />{bars.map((v, i) => <rect key={i} x={95 + i * 28} y={230 - Math.max(0, v) * 120} width="18" height={Math.max(4, Math.abs(v) * 120)} fill={v >= 0 ? "#06b6d4" : "#f59e0b"} opacity="0.72" />)}<Label x="90" y="410" text="Compare term shrinkage and test boundary." /></g>;
}

function PowerSeriesRadius({ radius, point }: { radius: number; point: number }) {
  const inside = Math.abs(point) < radius;
  return <g><circle cx="380" cy="235" r={radius * 52} fill="#06b6d4" opacity="0.13" stroke="#06b6d4" strokeWidth="5" /><line x1="100" x2="660" y1="235" y2="235" stroke="#0f172a" strokeWidth="3" /><Point x={380 + point * 52} y={235} label={inside ? "inside" : "outside"} /><Label x="90" y="75" text={`|x-a|=${roundTo(Math.abs(point), 2)}, R=${roundTo(radius, 2)} -> ${inside ? "converges" : "outside radius"}`} /></g>;
}

function PointwiseUniform({ n, probe }: { n: number; probe: number }) {
  const fn = (x: number) => Math.pow(x, n);
  return <Graph>{curvePath((x) => x >= 0 && x <= 1 ? fn(x) : NaN, 0, 1, "#06b6d4")}<line x1={gx(0)} x2={gx(1)} y1={gy(0)} y2={gy(0)} stroke="#f59e0b" strokeWidth="4" /><PointGraph x={probe} y={fn(probe)} label={`f_n=${roundTo(fn(probe), 3)}`} /><Label x="90" y="75" text={`x^n converges pointwise, not uniformly on [0,1]`} /></Graph>;
}

function PartitionRefinement({ pieces, bias }: { pieces: number; bias: number }) {
  const f = (x: number) => 0.25 * x * x + 0.5;
  const dx = 5 / pieces;
  return <Graph>{curvePath(f, 0, 5, "#06b6d4")}{Array.from({ length: pieces }).map((_, i) => { const x = i * dx; const low = f(x); const high = f(x + dx); const sample = low * (1 - bias) + high * bias; return <rect key={i} x={gx(x)} y={gy(sample)} width={Math.max(2, gx(x + dx) - gx(x))} height={gy(0) - gy(sample)} fill={bias < 0.5 ? "#8b5cf6" : "#f59e0b"} opacity="0.28" stroke="#0f172a" />; })}<Label x="90" y="75" text={`mesh=${roundTo(dx, 3)}, pieces=${pieces}`} /></Graph>;
}

function ArgandPlane({ real, imaginary }: { real: number; imaginary: number }) {
  const r = Math.hypot(real, imaginary);
  const theta = Math.atan2(imaginary, real) * 180 / Math.PI;
  return <ComplexPlane><Arrow x1={380} y1={230} x2={zx(real)} y2={zy(imaginary)} color="#06b6d4" /><Point x={zx(real)} y={zy(imaginary)} label="z" /><Label x="90" y="75" text={`z=${roundTo(real, 2)} ${imaginary >= 0 ? "+" : "-"} ${roundTo(Math.abs(imaginary), 2)}i, |z|=${roundTo(r, 2)}, arg=${roundTo(theta, 1)} deg`} /></ComplexPlane>;
}

function ComplexRotation({ angle, radius }: { angle: number; radius: number }) {
  const rad = angle * Math.PI / 180;
  return <ComplexPlane><circle cx="380" cy="230" r={radius * 55} fill="#06b6d4" opacity="0.08" stroke="#06b6d4" strokeWidth="3" /><Arrow x1={380} y1={230} x2={zx(radius)} y2={zy(0)} color="#94a3b8" /><Arrow x1={380} y1={230} x2={zx(radius * Math.cos(rad))} y2={zy(radius * Math.sin(rad))} color="#f59e0b" /><Point x={zx(radius * Math.cos(rad))} y={zy(radius * Math.sin(rad))} label="rotated z" /><Label x="90" y="75" text={`multiply by e^(i theta), theta=${roundTo(angle, 1)} deg`} /></ComplexPlane>;
}

function NthRoots({ count, angle }: { count: number; angle: number }) {
  const start = angle * Math.PI / 180;
  return <ComplexPlane><circle cx="380" cy="230" r="155" fill="#06b6d4" opacity="0.08" stroke="#06b6d4" strokeWidth="3" />{Array.from({ length: count }).map((_, k) => { const t = (start + 2 * Math.PI * k) / count; return <Point key={k} x={zx(2.8 * Math.cos(t))} y={zy(2.8 * Math.sin(t))} label={`z${k}`} />; })}<Label x="90" y="75" text={`${count} roots equally spaced by ${roundTo(360 / count, 1)} deg`} /></ComplexPlane>;
}

function DomainColoring({ power, zoom }: { power: number; zoom: number }) {
  const cells = 13;
  return <g><Label x="90" y="70" text={`domain coloring for f(z)=z^${power}`} />{Array.from({ length: cells * cells }).map((_, index) => { const i = index % cells, j = Math.floor(index / cells); const x = (i - 6) / (2 * zoom), y = (6 - j) / (2 * zoom); const arg = Math.atan2(y, x) * power; const mag = Math.min(1, Math.hypot(x, y) / 3); const hue = ((arg * 180 / Math.PI) % 360 + 360) % 360; return <rect key={index} x={120 + i * 38} y={105 + j * 25} width="36" height="23" fill={`hsl(${hue} 78% ${42 + mag * 28}%)`} />; })}<Label x="120" y="420" text="hue shows argument; brightness shows modulus" /></g>;
}

function CauchyRiemann({ x, y }: { x: number; y: number }) {
  const ux = 2 * x, uy = -2 * y, vx = 2 * y, vy = 2 * x;
  return <g><Label x="80" y="70" text="For f(z)=z^2: u=x^2-y^2, v=2xy" /><ellipse cx="270" cy="240" rx="150" ry="78" fill="#06b6d4" opacity="0.18" stroke="#06b6d4" strokeWidth="4" /><ellipse cx="500" cy="240" rx="150" ry="78" fill="#f59e0b" opacity="0.18" stroke="#f59e0b" strokeWidth="4" /><Point x={270 + x * 45} y={240 - y * 30} label="u slice" /><Point x={500 + x * 45} y={240 - y * 30} label="v slice" /><Label x="90" y="405" text={`u_x=${roundTo(ux, 2)}, v_y=${roundTo(vy, 2)}; u_y=${roundTo(uy, 2)}, -v_x=${roundTo(-vx, 2)}`} /></g>;
}

function LaurentAnnulus({ inner, outer }: { inner: number; outer: number }) {
  const r1 = Math.min(inner, outer - 0.1) * 52;
  const r2 = Math.max(inner + 0.1, outer) * 52;
  return <ComplexPlane><circle cx="380" cy="230" r={r2} fill="#06b6d4" opacity="0.16" stroke="#06b6d4" strokeWidth="5" /><circle cx="380" cy="230" r={r1} fill="#f8fafc" stroke="#f59e0b" strokeWidth="5" /><Point x={380} y={230} label="z0" /><Label x="90" y="75" text={`annulus: ${roundTo(r1 / 52, 2)} < |z-z0| < ${roundTo(r2 / 52, 2)}`} /></ComplexPlane>;
}

function ResiduePole({ strength, radius }: { strength: number; radius: number }) {
  return <ComplexPlane><circle cx="380" cy="230" r={radius * 55} fill="#f59e0b" opacity="0.12" stroke="#f59e0b" strokeWidth="5" /><path d={`M${380 + radius * 55},230 A${radius * 55},${radius * 55} 0 1 1 ${380 + radius * 55 - 1},230`} fill="none" stroke="#06b6d4" strokeWidth="5" markerEnd="url(#arrow)" /><circle cx="380" cy="230" r={8 + strength * 4} fill="#ef4444" /><Label x="90" y="75" text={`pole strength=${roundTo(strength, 2)}, contour radius=${roundTo(radius, 2)}`} /><Label x="90" y="405" text="residue is the 1/(z-a) coefficient measured by contour circulation" /></ComplexPlane>;
}

function ConformalMap({ strength, rotation }: { strength: number; rotation: number }) {
  const angle = rotation * Math.PI / 180;
  const map = (x: number, y: number) => {
    const sx = x + strength * (x * x - y * y) / 3;
    const sy = y + strength * (2 * x * y) / 3;
    return { x: 380 + (sx * Math.cos(angle) - sy * Math.sin(angle)) * 55, y: 230 - (sx * Math.sin(angle) + sy * Math.cos(angle)) * 55 };
  };
  const lines = [];
  for (let k = -3; k <= 3; k += 1) {
    lines.push(Array.from({ length: 80 }).map((_, i) => map(-3 + i * 6 / 79, k)));
    lines.push(Array.from({ length: 80 }).map((_, i) => map(k, -3 + i * 6 / 79)));
  }
  return <g><Label x="90" y="70" text="conformal map bends grid but preserves local angles" />{lines.map((line, i) => <path key={i} d={line.map((p, j) => `${j ? "L" : "M"}${p.x},${p.y}`).join(" ")} fill="none" stroke={i % 2 ? "#06b6d4" : "#8b5cf6"} strokeWidth="2" opacity="0.72" />)}</g>;
}

function Vector2D3D({ x, yz }: { x: number; yz: number }) {
  const z = yz / 1.6;
  const px = 380 + x * 45 + z * 24;
  const py = 245 - yz * 45 - z * 16;
  return <g><Label x="80" y="70" text={`v=<${roundTo(x, 1)}, ${roundTo(yz, 1)}, ${roundTo(z, 1)}>, |v|=${roundTo(Math.hypot(x, yz, z), 2)}`} /><line x1="120" x2="650" y1="245" y2="245" stroke="#94a3b8" /><line x1="380" x2="380" y1="85" y2="390" stroke="#94a3b8" /><line x1="260" x2="500" y1="325" y2="165" stroke="#cbd5e1" /><Arrow x1={380} y1={245} x2={380 + x * 55} y2={245 - yz * 55} color="#06b6d4" /><Arrow x1={380} y1={245} x2={px} y2={py} color="#f59e0b" /><line x1={380 + x * 55} y1={245 - yz * 55} x2={px} y2={py} stroke="#f59e0b" strokeDasharray="7 6" /><Point x={px} y={py} label="3D projection" /><Label x="610" y="238" text="x" /><Label x="390" y="95" text="y" /><Label x="510" y="160" text="z" /></g>;
}

function SpanBasis({ coeffA, coeffB }: { coeffA: number; coeffB: number }) {
  const u = { x: 2.2, y: 0.7 };
  const v = { x: -0.8, y: 2.1 };
  const target = { x: coeffA * u.x + coeffB * v.x, y: coeffA * u.y + coeffB * v.y };
  return <Graph><polygon points={`${gx(0)},${gy(0)} ${gx(coeffA * u.x)},${gy(coeffA * u.y)} ${gx(target.x)},${gy(target.y)} ${gx(coeffB * v.x)},${gy(coeffB * v.y)}`} fill="#06b6d4" opacity="0.14" stroke="#06b6d4" strokeWidth="3" /><Arrow x1={gx(0)} y1={gy(0)} x2={gx(u.x)} y2={gy(u.y)} color="#06b6d4" /><Arrow x1={gx(0)} y1={gy(0)} x2={gx(v.x)} y2={gy(v.y)} color="#8b5cf6" /><Arrow x1={gx(0)} y1={gy(0)} x2={gx(target.x)} y2={gy(target.y)} color="#f59e0b" /><PointGraph x={target.x} y={target.y} label="au+bv" /><Label x="90" y="75" text={`target = ${roundTo(coeffA, 1)}u + ${roundTo(coeffB, 1)}v`} /></Graph>;
}

function MatrixGridWarp({ shear, rotation }: { shear: number; rotation: number }) {
  const angle = rotation * Math.PI / 180;
  const transformPoint = (x: number, y: number) => {
    const sx = x + shear * y;
    const sy = y + 0.35 * shear * x;
    return { x: 380 + (sx * Math.cos(angle) - sy * Math.sin(angle)) * 58, y: 230 - (sx * Math.sin(angle) + sy * Math.cos(angle)) * 58 };
  };
  const lines = [];
  for (let k = -3; k <= 3; k += 1) {
    lines.push(Array.from({ length: 80 }).map((_, i) => transformPoint(-3 + i * 6 / 79, k)));
    lines.push(Array.from({ length: 80 }).map((_, i) => transformPoint(k, -3 + i * 6 / 79)));
  }
  return <g><Label x="80" y="70" text={`2x2 transformation, determinant approx ${roundTo(1 - 0.35 * shear * shear, 2)}`} />{lines.map((line, i) => <path key={i} d={line.map((p, j) => `${j ? "L" : "M"}${p.x},${p.y}`).join(" ")} fill="none" stroke={i % 2 ? "#06b6d4" : "#8b5cf6"} strokeWidth="2" opacity="0.7" />)}<Arrow x1={380} y1={230} x2={transformPoint(1, 0).x} y2={transformPoint(1, 0).y} color="#f59e0b" /><Arrow x1={380} y1={230} x2={transformPoint(0, 1).x} y2={transformPoint(0, 1).y} color="#ef4444" /></g>;
}

function GaussianElimination({ step, pivotScale }: { step: number; pivotScale: number }) {
  const matrices = [
    [["2", "1", "5"], ["4", "-6", "-2"], ["-2", "7", "9"]],
    [["2", "1", "5"], ["0", "-8", "-12"], ["0", "8", "14"]],
    [["2", "1", "5"], ["0", "1", roundTo(1.5 * pivotScale, 1).toString()], ["0", "8", "14"]],
    [["2", "1", "5"], ["0", "1", roundTo(1.5 * pivotScale, 1).toString()], ["0", "0", roundTo(2 * pivotScale, 1).toString()]],
    [["1", "0", roundTo(1.8 * pivotScale, 1).toString()], ["0", "1", roundTo(1.5 * pivotScale, 1).toString()], ["0", "0", "1"]],
  ];
  const labels = ["Start augmented matrix", "Eliminate below first pivot", "Scale second pivot", "Eliminate below second pivot", "Back substitute"];
  const current = matrices[Math.max(0, Math.min(step, matrices.length - 1))];
  return <g><Label x="80" y="70" text={labels[Math.max(0, Math.min(step, labels.length - 1))]} />{current.map((row, r) => row.map((value, c) => <g key={`${r}-${c}`}><rect x={220 + c * 95} y={125 + r * 70} width="70" height="48" rx="10" fill={c === 2 ? "#fef3c7" : "#e0f2fe"} stroke={r === c && c < 2 ? "#f59e0b" : "#94a3b8"} strokeWidth="3" /><Label x={246 + c * 95} y={156 + r * 70} text={value} /></g>))}<line x1="405" x2="405" y1="115" y2="345" stroke="#0f172a" strokeWidth="3" /><Label x="115" y="410" text="Each step preserves the solution while simplifying the system." /></g>;
}

function EigenvectorDirection({ angle, stretch }: { angle: number; stretch: number }) {
  const rad = angle * Math.PI / 180;
  const v = { x: Math.cos(rad) * 2.4, y: Math.sin(rad) * 2.4 };
  const av = { x: stretch * v.x, y: 0.65 * v.y };
  const alignment = Math.abs(Math.sin(rad)) < 0.1 || Math.abs(Math.cos(rad)) < 0.1 ? "near eigen-direction" : "changes direction";
  return <Graph><line x1={gx(-4)} y1={gy(0)} x2={gx(4)} y2={gy(0)} stroke="#06b6d4" strokeWidth="4" strokeDasharray="8 7" /><line x1={gx(0)} y1={gy(-4)} x2={gx(0)} y2={gy(4)} stroke="#8b5cf6" strokeWidth="4" strokeDasharray="8 7" /><Arrow x1={gx(0)} y1={gy(0)} x2={gx(v.x)} y2={gy(v.y)} color="#94a3b8" /><Arrow x1={gx(0)} y1={gy(0)} x2={gx(av.x)} y2={gy(av.y)} color="#f59e0b" /><PointGraph x={av.x} y={av.y} label="Av" /><Label x="90" y="75" text={`A scales x by ${roundTo(stretch, 1)} and y by 0.65: ${alignment}`} /></Graph>;
}

function DiagonalizationFlow({ lambda1, lambda2 }: { lambda1: number; lambda2: number }) {
  const stages = ["standard v", "P^-1", "D scales", "P returns"];
  const xs = [120, 285, 455, 620];
  return <g><Label x="80" y="70" text={`A = P D P^-1 with D = diag(${roundTo(lambda1, 1)}, ${roundTo(lambda2, 1)})`} />{stages.map((stage, i) => <g key={stage}><rect x={xs[i] - 58} y="170" width="116" height="92" rx="16" fill={i === 2 ? "#fef3c7" : "#e0f2fe"} stroke={i === 2 ? "#f59e0b" : "#06b6d4"} strokeWidth="4" /><Label x={xs[i] - 36} y="215" text={stage} />{i < stages.length - 1 && <Arrow x1={xs[i] + 66} y1={216} x2={xs[i + 1] - 70} y2={216} color="#8b5cf6" />}</g>)}<rect x="392" y="295" width={Math.max(12, Math.abs(lambda1) * 32)} height="26" rx="8" fill="#06b6d4" /><rect x="392" y="334" width={Math.max(12, Math.abs(lambda2) * 32)} height="26" rx="8" fill="#f59e0b" /><Label x="185" y="410" text="Diagonalization makes the hard transformation into simple axis scaling." /></g>;
}

function GramSchmidt({ vx, vy }: { vx: number; vy: number }) {
  const u1 = { x: 2.6, y: 0.8 };
  const dot = vx * u1.x + vy * u1.y;
  const norm2 = u1.x * u1.x + u1.y * u1.y;
  const proj = { x: (dot / norm2) * u1.x, y: (dot / norm2) * u1.y };
  const ortho = { x: vx - proj.x, y: vy - proj.y };
  return <Graph><Arrow x1={gx(0)} y1={gy(0)} x2={gx(u1.x)} y2={gy(u1.y)} color="#06b6d4" /><Arrow x1={gx(0)} y1={gy(0)} x2={gx(vx)} y2={gy(vy)} color="#94a3b8" /><Arrow x1={gx(0)} y1={gy(0)} x2={gx(proj.x)} y2={gy(proj.y)} color="#f59e0b" /><Arrow x1={gx(proj.x)} y1={gy(proj.y)} x2={gx(vx)} y2={gy(vy)} color="#ef4444" /><PointGraph x={ortho.x} y={ortho.y} label="u2" color="#8b5cf6" /><Label x="90" y="75" text={`v2 = projection + perpendicular part, dot(u1,u2) approx 0`} /></Graph>;
}

function QuadraticFormSurface({ a, c }: { a: number; c: number }) {
  const saddle = a * c < 0;
  const contours = [0.6, 1.2, 1.8, 2.4];
  return <g><Label x="80" y="70" text={`q(x,y)=${roundTo(a, 1)}x^2 + 0.8xy + ${roundTo(c, 1)}y^2 -> ${saddle ? "saddle" : a > 0 && c > 0 ? "bowl" : "inverted/indefinite"}`} /><ellipse cx="380" cy="250" rx="220" ry="92" fill={saddle ? "#fef3c7" : "#e0f2fe"} opacity="0.75" stroke={saddle ? "#f59e0b" : "#06b6d4"} strokeWidth="4" /><path d={`M190,270 C280,${saddle ? 115 : 170} 480,${saddle ? 390 : 135} 585,230`} fill="none" stroke="#8b5cf6" strokeWidth="5" /><path d={`M220,215 C315,${saddle ? 355 : 145} 455,${saddle ? 120 : 165} 565,285`} fill="none" stroke="#ef4444" strokeWidth="4" opacity="0.8" />{contours.map((r) => <ellipse key={r} cx="380" cy="250" rx={r * 58} ry={r * (saddle ? 22 : 34)} fill="none" stroke="#0f172a" opacity="0.18" />)}<Label x="120" y="410" text="Contours reveal how the symmetric matrix bends space." /></g>;
}

function CayleyTable({ order, shift }: { order: number; shift: number }) {
  const n = Math.max(3, order);
  const cell = Math.min(46, 310 / n);
  const startX = 215;
  const startY = 105;
  return <g><Label x="80" y="70" text={`Cayley table for Z_${n}: a*b=(a+b+${shift % n}) mod ${n}`} />{Array.from({ length: n + 1 }).flatMap((_, r) => Array.from({ length: n + 1 }).map((__, c) => { const header = r === 0 || c === 0; const value = r === 0 && c === 0 ? "*" : r === 0 ? `${c - 1}` : c === 0 ? `${r - 1}` : `${mod(r - 1 + c - 1 + shift, n)}`; return <g key={`${r}-${c}`}><rect x={startX + c * cell} y={startY + r * cell} width={cell - 2} height={cell - 2} rx="7" fill={header ? "#fef3c7" : value === "0" ? "#dcfce7" : "#e0f2fe"} stroke="#94a3b8" /><Label x={startX + c * cell + cell * 0.36} y={startY + r * cell + cell * 0.62} text={value} /></g>; }))}<Label x="90" y="410" text="A group table has one identity and each row/column rearranges all elements." /></g>;
}

function GroupOperation({ first, second }: { first: number; second: number }) {
  const n = 8;
  const a = mod(first, n);
  const b = mod(second, n);
  const product = mod(a + b, n);
  const point = (k: number) => ({ x: 380 + 145 * Math.cos(-Math.PI / 2 + 2 * Math.PI * k / n), y: 235 + 145 * Math.sin(-Math.PI / 2 + 2 * Math.PI * k / n) });
  return <g><Label x="80" y="70" text={`g^${a} * g^${b} = g^${product} in cyclic group C_${n}`} /><circle cx="380" cy="235" r="145" fill="#06b6d4" opacity="0.08" stroke="#94a3b8" strokeWidth="3" />{Array.from({ length: n }).map((_, k) => { const p = point(k); return <g key={k}><circle cx={p.x} cy={p.y} r={k === product ? 16 : 10} fill={k === a ? "#06b6d4" : k === b ? "#8b5cf6" : k === product ? "#f59e0b" : "#cbd5e1"} /><Label x={p.x + 12} y={p.y + 5} text={`g${k}`} /></g>; })}<path d={`M${point(a).x},${point(a).y} Q380,235 ${point(product).x},${point(product).y}`} fill="none" stroke="#f59e0b" strokeWidth="5" markerEnd="url(#arrow)" /><Label x="105" y="410" text="The product moves around the cycle by adding exponents modulo group order." /></g>;
}

function SymmetryGroup({ sides, step }: { sides: number; step: number }) {
  const n = Math.max(3, sides);
  const rotation = mod(step, n);
  const reflected = step >= n;
  const points = Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + 2 * Math.PI * i / n + rotation * 2 * Math.PI / n;
    const x = reflected ? 380 - 120 * Math.cos(angle) : 380 + 120 * Math.cos(angle);
    return `${x},${235 + 120 * Math.sin(angle)}`;
  }).join(" ");
  return <g><Label x="80" y="70" text={`D_${n}: ${n} rotations + ${n} reflections; showing ${reflected ? "reflection" : "rotation"} step ${rotation}`} /><polygon points={points} fill="#e0f2fe" stroke="#06b6d4" strokeWidth="5" /><line x1="380" x2="380" y1="90" y2="380" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 7" /><circle cx="380" cy="235" r="10" fill="#ef4444" /><Label x="105" y="410" text="A symmetry is an action that moves the shape but leaves it visually unchanged." /></g>;
}

function PermutationCycle({ size, shift }: { size: number; shift: number }) {
  const n = Math.max(4, size);
  const s = Math.max(1, mod(shift, n));
  const point = (k: number) => ({ x: 380 + 150 * Math.cos(-Math.PI / 2 + 2 * Math.PI * k / n), y: 235 + 150 * Math.sin(-Math.PI / 2 + 2 * Math.PI * k / n) });
  const cycles = permutationCycles(n, s);
  return <g><Label x="80" y="70" text={`sigma(i)=i+${s} mod ${n}; cycles: ${cycles.map((cycle) => `(${cycle.join(" ")})`).join(" ")}`} />{Array.from({ length: n }).map((_, i) => { const p = point(i); const q = point(mod(i + s, n)); return <g key={i}><path d={`M${p.x},${p.y} Q380,235 ${q.x},${q.y}`} fill="none" stroke="#8b5cf6" strokeWidth="3" opacity="0.65" markerEnd="url(#arrow)" /><circle cx={p.x} cy={p.y} r="14" fill="#06b6d4" /><Label x={p.x - 5} y={p.y + 5} text={`${i}`} /></g>; })}<Label x="120" y="410" text="Cycle notation groups elements that chase each other under repeated permutation." /></g>;
}

function CosetPartition({ groupSize, subgroupSize }: { groupSize: number; subgroupSize: number }) {
  const n = Math.max(2, groupSize);
  const h = Math.max(1, Math.min(subgroupSize, n));
  const cosetCount = Math.ceil(n / h);
  const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#6366f1", "#14b8a6"];
  return <g><Label x="80" y="70" text={`Partition into ${cosetCount} cosets, each up to ${h} elements`} />{Array.from({ length: n }).map((_, i) => { const block = Math.floor(i / h); return <g key={i}><rect x={100 + (i % 12) * 52} y={120 + Math.floor(i / 12) * 76} width="40" height="44" rx="12" fill={colors[block % colors.length]} opacity="0.72" /><Label x={112 + (i % 12) * 52} y={148 + Math.floor(i / 12) * 76} text={`${i}`} /></g>; })}<Label x="95" y="410" text="Cosets tile the group into equal or comparable blocks generated from a subgroup." /></g>;
}

function HomomorphismMap({ domainOrder, multiplier }: { domainOrder: number; multiplier: number }) {
  const n = Math.max(4, domainOrder);
  const m = n + 2;
  const images = Array.from({ length: n }, (_, i) => mod(i * multiplier, m));
  const unique = new Set(images);
  return <g><Label x="80" y="70" text={`phi: Z_${n} -> Z_${m}, phi(x)=${multiplier}x mod ${m}; image size ${unique.size}`} />{Array.from({ length: n }).map((_, i) => <g key={`d-${i}`}><circle cx="170" cy={105 + i * 34} r="13" fill="#06b6d4" /><Label x="166" y={110 + i * 34} text={`${i}`} /></g>)}{Array.from({ length: m }).map((_, i) => <g key={`c-${i}`}><circle cx="590" cy={90 + i * 28} r="12" fill={images.includes(i) ? "#f59e0b" : "#cbd5e1"} /><Label x="586" y={95 + i * 28} text={`${i}`} /></g>)}{images.map((img, i) => <Arrow key={i} x1={188} y1={105 + i * 34} x2={572} y2={90 + img * 28} color="#8b5cf6" />)}<Label x="110" y="420" text="A homomorphism preserves operation structure while possibly collapsing elements." /></g>;
}

function RingOperationTable({ modulus, mode }: { modulus: number; mode: number }) {
  const n = Math.max(3, modulus);
  const multiply = mode === 1;
  const cell = Math.min(46, 310 / n);
  const startX = 215;
  const startY = 105;
  return <g><Label x="80" y="70" text={`Ring Z_${n} ${multiply ? "multiplication" : "addition"} table modulo ${n}`} />{Array.from({ length: n + 1 }).flatMap((_, r) => Array.from({ length: n + 1 }).map((__, c) => { const header = r === 0 || c === 0; const raw = multiply ? (r - 1) * (c - 1) : (r - 1) + (c - 1); const value = r === 0 && c === 0 ? (multiply ? "x" : "+") : r === 0 ? `${c - 1}` : c === 0 ? `${r - 1}` : `${mod(raw, n)}`; const zeroDivisor = multiply && !header && r > 1 && c > 1 && value === "0"; return <g key={`${r}-${c}`}><rect x={startX + c * cell} y={startY + r * cell} width={cell - 2} height={cell - 2} rx="7" fill={header ? "#fef3c7" : zeroDivisor ? "#fee2e2" : value === "0" ? "#dcfce7" : "#e0f2fe"} stroke="#94a3b8" /><Label x={startX + c * cell + cell * 0.36} y={startY + r * cell + cell * 0.62} text={value} /></g>; }))}<Label x="90" y="410" text={multiply ? "Red zero cells mark possible zero-divisor behavior." : "Addition table shows the abelian group inside the ring."} /></g>;
}

function SlopeField({ coeffX, coeffY }: { coeffX: number; coeffY: number }) {
  const points = [];
  for (let x = -3; x <= 3; x += 0.75) {
    for (let y = -3; y <= 3; y += 0.75) points.push({ x, y, slope: coeffX * x + coeffY * y });
  }
  return <Graph>{points.map((p, i) => { const angle = Math.atan(p.slope); const length = 18; return <line key={i} x1={gx(p.x) - Math.cos(angle) * length / 2} y1={gy(p.y) + Math.sin(angle) * length / 2} x2={gx(p.x) + Math.cos(angle) * length / 2} y2={gy(p.y) - Math.sin(angle) * length / 2} stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />; })}<Label x="90" y="75" text={`dy/dx = ${roundTo(coeffX, 1)}x + ${roundTo(coeffY, 1)}y`} /></Graph>;
}

function SolutionCurve({ initialY, growth }: { initialY: number; growth: number }) {
  const path = Array.from({ length: 120 }).reduce<{ x: number; y: number }[]>((pts, _, i) => {
    if (i === 0) return [{ x: -3, y: initialY }];
    const prev = pts[i - 1];
    const dx = 6 / 119;
    const slope = 0.35 * prev.x + growth * prev.y;
    return [...pts, { x: prev.x + dx, y: Math.max(-4, Math.min(4, prev.y + slope * dx)) }];
  }, []);
  return <Graph><SlopeField coeffX={0.35} coeffY={growth} />{pathToSvg(path, "#f59e0b", 5)}<PointGraph x={-3} y={initialY} label="initial" color="#8b5cf6" /><Label x="90" y="405" text="Euler trace follows the local slope field from the starting point." /></Graph>;
}

function DirectionField({ spring, damping }: { spring: number; damping: number }) {
  const points = [];
  for (let x = -3; x <= 3; x += 0.9) {
    for (let y = -2.5; y <= 2.5; y += 0.75) points.push({ x, y });
  }
  return <Graph>{points.map((p, i) => { const dx = p.y; const dy = -spring * p.x - damping * p.y; const mag = Math.hypot(dx, dy) || 1; return <Arrow key={i} x1={gx(p.x)} y1={gy(p.y)} x2={gx(p.x) + dx / mag * 22} y2={gy(p.y) - dy / mag * 22} color={damping > 0.5 ? "#f59e0b" : "#06b6d4"} />; })}<PointGraph x={0} y={0} label="equilibrium" color="#ef4444" /><Label x="90" y="75" text={`phase field: x'=v, v'=-${roundTo(spring, 1)}x-${roundTo(damping, 1)}v`} /></Graph>;
}

function OrthogonalTrajectory({ spacing, rotation }: { spacing: number; rotation: number }) {
  const angle = rotation * Math.PI / 180;
  const rot = (x: number, y: number) => ({ x: x * Math.cos(angle) - y * Math.sin(angle), y: x * Math.sin(angle) + y * Math.cos(angle) });
  const linePath = (offset: number, flip: boolean) => Array.from({ length: 80 }).map((_, i) => {
    const t = -3 + i * 6 / 79;
    const base = flip ? rot(offset, t) : rot(t, offset);
    return `${i ? "L" : "M"}${gx(base.x)},${gy(base.y)}`;
  }).join(" ");
  const offsets = [-2, -1, 0, 1, 2].map((v) => v * spacing / 1.4);
  return <Graph>{offsets.map((o) => <path key={`f-${o}`} d={linePath(o, false)} fill="none" stroke="#06b6d4" strokeWidth="4" opacity="0.72" />)}{offsets.map((o) => <path key={`o-${o}`} d={linePath(o, true)} fill="none" stroke="#f59e0b" strokeWidth="4" opacity="0.72" />)}<Label x="90" y="75" text="Blue family and orange family cross at right angles." /></Graph>;
}

function SpringMassODE({ spring, damping }: { spring: number; damping: number }) {
  const omega = Math.sqrt(spring);
  const amplitude = Math.exp(-damping * 1.6);
  const massX = 450 + Math.cos(omega * 2.6) * 110 * amplitude;
  const coils = Array.from({ length: 13 }).map((_, i) => `${170 + i * ((massX - 210) / 12)},${230 + (i % 2 ? 22 : -22)}`).join(" ");
  const curve = Array.from({ length: 160 }).map((_, i) => { const t = i / 159 * 6; const y = Math.exp(-damping * t / 2) * Math.cos(omega * t); return `${i ? "L" : "M"}${90 + t * 70},${385 - y * 42}`; }).join(" ");
  return <g><Label x="80" y="70" text={`x'' + ${roundTo(damping, 2)}x' + ${roundTo(spring, 2)}x = 0`} /><rect x="90" y="170" width="70" height="120" rx="12" fill="#cbd5e1" /><polyline points={coils} fill="none" stroke="#06b6d4" strokeWidth="5" /><rect x={massX} y="195" width="85" height="70" rx="14" fill="#f59e0b" stroke="#0f172a" strokeWidth="3" /><path d={curve} fill="none" stroke="#8b5cf6" strokeWidth="4" /><Label x="90" y="420" text="Damping shrinks amplitude; spring strength changes oscillation speed." /></g>;
}

function HeatEquation({ time, diffusion }: { time: number; diffusion: number }) {
  const cells = 16;
  return <g><Label x="80" y="70" text={`u_t = alpha u_xx, time=${roundTo(time, 1)}, alpha=${roundTo(diffusion, 1)}`} />{Array.from({ length: cells * cells }).map((_, index) => { const i = index % cells, j = Math.floor(index / cells); const x = (i - 7.5) / 3.2, y = (j - 7.5) / 3.2; const temp = Math.exp(-(x * x + y * y) / (0.35 + diffusion * time * 0.55)); const hue = 210 - temp * 190; return <rect key={index} x={125 + i * 31} y={105 + j * 18} width="29" height="16" fill={`hsl(${hue} 82% ${44 + temp * 18}%)`} />; })}<Label x="120" y="420" text="Heat diffuses outward and sharp temperature differences smooth over time." /></g>;
}

function WaveEquation({ time, speed }: { time: number; speed: number }) {
  const wave = (x: number) => Math.sin(Math.PI * x) * Math.cos(speed * time);
  const path = Array.from({ length: 180 }).map((_, i) => { const x = i / 179; return `${i ? "L" : "M"}${110 + x * 540},${235 - wave(x) * 105}`; }).join(" ");
  return <g><Label x="80" y="70" text={`u_tt = ${roundTo(speed * speed, 2)}u_xx; fixed endpoints stay at nodes`} /><line x1="105" x2="655" y1="235" y2="235" stroke="#94a3b8" strokeDasharray="8 7" /><path d={path} fill="none" stroke="#06b6d4" strokeWidth="7" strokeLinecap="round" /><circle cx="110" cy="235" r="10" fill="#ef4444" /><circle cx="650" cy="235" r="10" fill="#ef4444" /><Label x="105" y="410" text="Wave speed changes phase; endpoints stay fixed while the string vibrates." /></g>;
}

function LaplacePotential({ strength, tilt }: { strength: number; tilt: number }) {
  const contours = [-2, -1, 0, 1, 2];
  return <g><Label x="80" y="70" text={`harmonic potential: u=${roundTo(strength, 1)}(x^2-y^2)+${roundTo(tilt, 1)}x`} /><ellipse cx="380" cy="245" rx="225" ry="95" fill="#e0f2fe" stroke="#06b6d4" strokeWidth="4" opacity="0.7" /><path d={`M170,280 C260,${180 - strength * 18} 480,${330 + tilt * 10} 600,210`} fill="none" stroke="#8b5cf6" strokeWidth="5" /><path d={`M190,200 C300,${335 + strength * 14} 460,${120 - tilt * 10} 585,275`} fill="none" stroke="#f59e0b" strokeWidth="5" />{contours.map((c) => <path key={c} d={`M${170 + c * 25},${245 - c * 20} C300,${170 + c * 22} 455,${320 - c * 18} ${600 - c * 20},${245 + c * 14}`} fill="none" stroke="#0f172a" opacity="0.16" />)}<Label x="95" y="410" text="Laplace solutions balance interior values from boundary behavior." /></g>;
}

function RootFinding({ left, right }: { left: number; right: number }) {
  const f = (x: number) => x * x * x - x - 1;
  const a = Math.min(left, right);
  const b = Math.max(left, right);
  const mid = (a + b) / 2;
  return <Graph>{curvePath(f, -3, 3, "#06b6d4")}<line x1={gx(a)} y1={gy(-4)} x2={gx(a)} y2={gy(4)} stroke="#8b5cf6" strokeWidth="4" strokeDasharray="8 7" /><line x1={gx(b)} y1={gy(-4)} x2={gx(b)} y2={gy(4)} stroke="#8b5cf6" strokeWidth="4" strokeDasharray="8 7" /><PointGraph x={mid} y={f(mid)} label="midpoint" color="#f59e0b" /><Label x="90" y="75" text={`f(a)f(b)=${roundTo(f(a) * f(b), 2)}; sign change means bracketed root`} /></Graph>;
}

function NewtonRaphson({ initial, iterations }: { initial: number; iterations: number }) {
  const f = (x: number) => x * x * x - x - 1;
  const fp = (x: number) => 3 * x * x - 1;
  const xs = [initial];
  for (let i = 0; i < iterations; i += 1) xs.push(xs.at(-1)! - f(xs.at(-1)!) / (fp(xs.at(-1)!) || 0.001));
  return <Graph>{curvePath(f, -3, 3, "#06b6d4")}{xs.slice(0, -1).map((x, i) => { const slope = fp(x); const next = xs[i + 1]; return <g key={i}><line x1={gx(x - 0.7)} y1={gy(f(x) - slope * 0.7)} x2={gx(next)} y2={gy(0)} stroke="#f59e0b" strokeWidth="3" opacity={0.45 + i / Math.max(1, iterations) * 0.45} /><PointGraph x={x} y={f(x)} label={`x${i}`} color="#8b5cf6" /></g>; })}<PointGraph x={xs.at(-1)!} y={0} label="estimate" color="#ef4444" /><Label x="90" y="75" text={`latest x=${roundTo(xs.at(-1)!, 5)}, iterations=${iterations}`} /></Graph>;
}

function ErrorConvergence({ family, initialError }: { family: number; initialError: number }) {
  const errors = Array.from({ length: 12 }).reduce<number[]>((list, _, i) => {
    if (i === 0) return [initialError];
    const prev = list[i - 1];
    const next = family === 1 ? prev * 0.55 : family === 2 ? prev * prev * 0.9 : prev * 0.82;
    return [...list, Math.max(0.0001, next)];
  }, []);
  const names = ["linear", "quadratic", "slow"];
  return <g><Label x="80" y="70" text={`${names[family - 1] ?? "linear"} convergence, error after 12 steps=${roundTo(errors.at(-1)!, 5)}`} />{errors.map((e, i) => <rect key={i} x={110 + i * 45} y={350 - Math.log10(1 / e) * 48} width="26" height={Math.max(6, Math.log10(1 / e) * 48)} fill={family === 2 ? "#10b981" : family === 3 ? "#f59e0b" : "#06b6d4"} opacity="0.78" />)}<line x1="90" x2="680" y1="350" y2="350" stroke="#94a3b8" /><Label x="105" y="410" text="Faster methods drive error bars downward sooner." /></g>;
}

function InterpolationBuilder({ count, tension }: { count: number; tension: number }) {
  const pts = Array.from({ length: count }, (_, i) => {
    const x = -3 + i * 6 / (count - 1);
    return { x, y: Math.sin(x * 1.15) + tension * Math.cos(i * 1.7) };
  });
  const d = pts.map((p, i) => `${i ? "L" : "M"}${gx(p.x)},${gy(p.y)}`).join(" ");
  return <Graph><path d={d} fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />{pts.map((p, i) => <PointGraph key={i} x={p.x} y={p.y} label={`p${i}`} color="#06b6d4" />)}<Label x="90" y="75" text={`${count} sample points; interpolation passes through all chosen points`} /></Graph>;
}

function NumericalIntegration({ intervals, method }: { intervals: number; method: number }) {
  const n = Math.max(2, intervals);
  const f = (x: number) => Math.sin(x) + 1.5;
  const dx = 5 / n;
  const names = ["rectangles", "trapezoids", "Simpson-like"];
  return <Graph>{curvePath(f, 0, 5, "#06b6d4")}{Array.from({ length: n }).map((_, i) => { const x0 = i * dx; const x1 = x0 + dx; const y0 = f(x0); const y1 = f(x1); const mid = f((x0 + x1) / 2); const top = method === 0 ? `L${gx(x0)},${gy(y1)} L${gx(x1)},${gy(y1)}` : method === 1 ? `L${gx(x0)},${gy(y0)} L${gx(x1)},${gy(y1)}` : `Q${gx((x0 + x1) / 2)},${gy(mid)} ${gx(x1)},${gy(y1)}`; return <path key={i} d={`M${gx(x0)},${gy(0)} ${top} L${gx(x1)},${gy(0)} Z`} fill="#f59e0b" opacity="0.22" stroke="#f59e0b" />; })}<Label x="90" y="75" text={`${names[method] ?? names[0]}, n=${n}, dx=${roundTo(dx, 3)}`} /></Graph>;
}

function EulerRK4({ steps, growth }: { steps: number; growth: number }) {
  const n = Math.max(2, steps);
  const exact = (x: number) => Math.exp(growth * x);
  const euler = Array.from({ length: n + 1 }).reduce<{ x: number; y: number }[]>((pts, _, i) => {
    if (i === 0) return [{ x: 0, y: 1 }];
    const h = 4 / n;
    const prev = pts[i - 1];
    return [...pts, { x: prev.x + h, y: prev.y + h * growth * prev.y }];
  }, []);
  return <Graph>{curvePath((x) => x >= 0 && x <= 4 ? exact(x) : NaN, 0, 4, "#06b6d4")}{pathToSvg(euler, "#f59e0b", 5)}{Array.from({ length: n + 1 }).map((_, i) => { const x = i * 4 / n; return <circle key={i} cx={gx(x)} cy={gy(exact(x))} r="3" fill="#06b6d4" />; })}<Label x="90" y="75" text={`Blue smooth curve vs orange Euler path; steps=${n}`} /></Graph>;
}

function LinearSystemSolver({ iteration, relaxation }: { iteration: number; relaxation: number }) {
  const solution = { x: 1.2, y: 1.1 };
  const guess = Array.from({ length: iteration }).reduce<{ x: number; y: number }>((p) => ({ x: p.x + (solution.x - p.x) * 0.28 * relaxation, y: p.y + (solution.y - p.y) * 0.28 * relaxation }), { x: -2.4, y: -1.4 });
  const line1 = (x: number) => 2.3 - x;
  const line2 = (x: number) => 0.45 * x + 0.56;
  return <Graph>{curvePath(line1, -3, 3, "#06b6d4")}{curvePath(line2, -3, 3, "#8b5cf6")}<PointGraph x={solution.x} y={solution.y} label="solution" color="#10b981" /><Arrow x1={gx(-2.4)} y1={gy(-1.4)} x2={gx(guess.x)} y2={gy(guess.y)} color="#f59e0b" /><PointGraph x={guess.x} y={guess.y} label={`x${iteration}`} color="#ef4444" /><Label x="90" y="75" text={`Iterative correction moves guesses toward Ax=b intersection.`} /></Graph>;
}

function CayleyHamilton({ trace, determinant }: { trace: number; determinant: number }) {
  const discriminant = trace * trace - 4 * determinant;
  const rootText = discriminant >= 0 ? `roots ${roundTo((trace + Math.sqrt(discriminant)) / 2, 2)}, ${roundTo((trace - Math.sqrt(discriminant)) / 2, 2)}` : "complex eigen pair";
  return <g><Label x="80" y="70" text={`p(lambda)=lambda^2 - (${roundTo(trace, 2)})lambda + (${roundTo(determinant, 2)})`} /><rect x="120" y="125" width="155" height="115" rx="16" fill="#06b6d4" opacity="0.22" stroke="#06b6d4" strokeWidth="4" /><Label x="145" y="170" text="A" /><text x="320" y="185" fill="#0f172a" fontSize="24" fontWeight="900">satisfies</text><rect x="470" y="120" width="190" height="130" rx="16" fill="#f59e0b" opacity="0.22" stroke="#f59e0b" strokeWidth="4" /><Label x="492" y="170" text="A^2 - tr(A)A + det(A)I = 0" /><Arrow x1={198} y1={285} x2={520} y2={285} color="#8b5cf6" /><Label x="120" y="335" text={rootText} /><Label x="120" y="385" text={Math.abs(determinant) > 0.05 ? "Inverse follows from A^-1=(tr(A)I-A)/det(A)." : "Near singular: inverse expression becomes unstable."} /></g>;
}

function DeMoivre({ n, angle }: { n: number; angle: number }) {
  const theta = angle * Math.PI / 180;
  const powerAngle = n * theta;
  const points = Array.from({ length: n }, (_, k) => ({ a: (theta + 2 * Math.PI * k) / n, k }));
  return <ComplexPlane><circle cx="380" cy="230" r="130" fill="none" stroke="#94a3b8" strokeWidth="3" /><Arrow x1={380} y1={230} x2={380 + Math.cos(theta) * 130} y2={230 - Math.sin(theta) * 130} color="#06b6d4" /><Arrow x1={380} y1={230} x2={380 + Math.cos(powerAngle) * 155} y2={230 - Math.sin(powerAngle) * 155} color="#f59e0b" />{points.map((p) => <circle key={p.k} cx={380 + Math.cos(p.a) * 88} cy={230 - Math.sin(p.a) * 88} r="7" fill="#8b5cf6" />)}<Label x="90" y="75" text={`n=${n}: powers multiply angles; roots divide and spread evenly.`} /></ComplexPlane>;
}

function ComplexLog({ angle, branch }: { angle: number; branch: number }) {
  const principal = angle * Math.PI / 180;
  const branchAngle = principal + 2 * Math.PI * branch;
  const x = Math.cos(principal) * 145;
  const y = Math.sin(principal) * 145;
  return <ComplexPlane><circle cx="380" cy="230" r="145" fill="none" stroke="#06b6d4" strokeWidth="4" /><line x1="80" y1="230" x2="380" y2="230" stroke="#ef4444" strokeWidth="5" strokeDasharray="10 8" /><Arrow x1={380} y1={230} x2={380 + x} y2={230 - y} color="#f59e0b" /><Label x="90" y="75" text={`Log z = ln r + i(${roundTo(branchAngle, 2)}); branch k=${branch}`} /><Label x="95" y="410" text="The red ray marks the branch cut; changing k adds 2pi i." /></ComplexPlane>;
}

function ComplexTrig({ real, imaginary }: { real: number; imaginary: number }) {
  const sinMag = Math.hypot(Math.sin(real) * Math.cosh(imaginary), Math.cos(real) * Math.sinh(imaginary));
  const cosh = Math.cosh(imaginary);
  return <Graph>{curvePath((x) => Math.sin(x) * cosh, -3, 3, "#06b6d4")}{curvePath((x) => Math.sinh(imaginary) * Math.cos(x), -3, 3, "#f59e0b")}<PointGraph x={real} y={Math.min(4, sinMag)} label={`|sin z| ${roundTo(sinMag, 2)}`} /><Label x="90" y="75" text="Imaginary input turns trig oscillation into hyperbolic growth." /></Graph>;
}

function Jacobian({ stretch, shear }: { stretch: number; shear: number }) {
  const base = [{ x: 120, y: 155 }, { x: 230, y: 155 }, { x: 230, y: 265 }, { x: 120, y: 265 }];
  const mapped = base.map((p) => ({ x: 430 + (p.x - 120) * stretch + (p.y - 155) * shear, y: 155 + (p.y - 155) / Math.max(0.4, stretch) }));
  const det = stretch / Math.max(0.4, stretch);
  return <g><Label x="80" y="70" text={`Local area scale |J| approx ${roundTo(det, 2)}; shear changes shape without alone changing area.`} /><polygon points={base.map((p) => `${p.x},${p.y}`).join(" ")} fill="#06b6d4" opacity="0.24" stroke="#06b6d4" strokeWidth="4" /><polygon points={mapped.map((p) => `${p.x},${p.y}`).join(" ")} fill="#f59e0b" opacity="0.26" stroke="#f59e0b" strokeWidth="4" /><Arrow x1={265} y1={210} x2={400} y2={210} color="#8b5cf6" /><Label x="120" y="310" text="du dv patch" /><Label x="470" y="310" text="warped dx dy patch" /></g>;
}

function LagrangeMultiplier({ radius, tilt }: { radius: number; tilt: number }) {
  const contact = { x: radius / Math.sqrt(2), y: radius / Math.sqrt(2) };
  return <Graph>{[0.7, 1.3, 1.9, 2.5].map((r) => <ellipse key={r} cx={gx(tilt * 0.35)} cy={gy(0)} rx={r * 80} ry={r * 42} fill="none" stroke="#06b6d4" strokeWidth="3" opacity="0.65" />)}<circle cx={gx(0)} cy={gy(0)} r={radius * 42} fill="none" stroke="#f59e0b" strokeWidth="5" /><PointGraph x={contact.x} y={contact.y} label="gradients parallel" color="#ef4444" /><Arrow x1={gx(contact.x)} y1={gy(contact.y)} x2={gx(contact.x + 0.65)} y2={gy(contact.y + 0.65 + tilt * 0.25)} color="#8b5cf6" /><Label x="90" y="75" text="Optimum occurs where the constraint is tangent to a level curve." /></Graph>;
}

function AsymptoteTracing({ shift, asymptote }: { shift: number; asymptote: number }) {
  const f = (x: number) => shift + 1 / (x - asymptote);
  return <Graph>{curvePath((x) => Math.abs(x - asymptote) < 0.06 ? NaN : f(x), -3, 3, "#06b6d4")}<line x1={gx(asymptote)} x2={gx(asymptote)} y1="60" y2="400" stroke="#ef4444" strokeWidth="4" strokeDasharray="8 7" /><line x1="80" x2="680" y1={gy(shift)} y2={gy(shift)} stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 7" /><Label x="90" y="75" text={`Vertical asymptote x=${roundTo(asymptote, 2)}, horizontal asymptote y=${roundTo(shift, 2)}`} /></Graph>;
}

function HigherOrderODE({ damping, stiffness }: { damping: number; stiffness: number }) {
  const disc = damping * damping - 4 * stiffness;
  const mode = disc > 0.05 ? "real roots" : disc < -0.05 ? "complex roots" : "repeated root";
  const omega = Math.sqrt(Math.max(0.05, stiffness - damping * damping / 4));
  return <Graph>{curvePath((x) => x < 0 ? NaN : Math.exp(-damping * x / 4) * (disc < 0 ? Math.cos(omega * x) : Math.exp(-Math.abs(damping) * x / 12)), 0, 5, "#06b6d4")}<Label x="90" y="75" text={`${mode}: r^2 + ${roundTo(damping, 2)}r + ${roundTo(stiffness, 2)}=0`} /></Graph>;
}

function CauchyEuler({ coeffA, coeffB }: { coeffA: number; coeffB: number }) {
  const disc = (coeffA - 1) ** 2 - 4 * coeffB;
  const m = disc >= 0 ? (1 - coeffA + Math.sqrt(disc)) / 2 : (1 - coeffA) / 2;
  return <Graph>{curvePath((x) => x <= 0 ? NaN : Math.pow(x, m), 0.2, 5, "#06b6d4")}<Label x="90" y="75" text={`m(m-1)+${roundTo(coeffA, 2)}m+${roundTo(coeffB, 2)}=0; shown y=x^m`} /></Graph>;
}

function LaplaceTransform({ decay, s }: { decay: number; s: number }) {
  const f = (t: number) => Math.exp(-decay * t) * Math.cos(2 * t);
  const transform = (value: number) => (value + decay) / ((value + decay) ** 2 + 4);
  return <g><Label x="80" y="70" text={`Time-domain f(t) maps to F(s); F(${roundTo(s, 2)})=${roundTo(transform(s), 3)}`} /><g transform="translate(0 0)">{curvePath((x) => x < 0 ? NaN : f(x), 0, 5, "#06b6d4")}</g><path d={Array.from({ length: 140 }).map((_, i) => { const x = 0.3 + i * 4.7 / 139; return `${i ? "L" : "M"}${90 + x * 110},${390 - transform(x) * 360}`; }).join(" ")} fill="none" stroke="#f59e0b" strokeWidth="5" /><line x1={90 + s * 110} y1="235" x2={90 + s * 110} y2="395" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="8 7" /></g>;
}

function StepImpulse({ delay, strength }: { delay: number; strength: number }) {
  const x = 110 + delay * 95;
  return <g><Label x="80" y="70" text={`u(t-${roundTo(delay, 2)}) and ${roundTo(strength, 2)}delta(t-${roundTo(delay, 2)})`} /><line x1="90" x2="670" y1="330" y2="330" stroke="#94a3b8" /><path d={`M90,330 L${x},330 L${x},210 L670,210`} fill="none" stroke="#06b6d4" strokeWidth="6" /><Arrow x1={x} y1={330} x2={x} y2={330 - strength * 70} color="#f59e0b" /><Label x="100" y="400" text="Delay in time multiplies transforms by an exponential shift factor." /></g>;
}

function Convolution({ shift, width }: { shift: number; width: number }) {
  const left = 120 + shift * 80;
  const overlap = Math.max(0, Math.min(260, left + width * 80) - Math.max(260, left - width * 80));
  return <g><Label x="80" y="70" text={`Overlap area approx ${roundTo(overlap / 80, 2)} drives (f*g)(t).`} /><rect x="260" y="170" width="180" height="110" fill="#06b6d4" opacity="0.28" stroke="#06b6d4" strokeWidth="4" /><rect x={left - width * 80} y="205" width={width * 160} height="110" fill="#f59e0b" opacity="0.28" stroke="#f59e0b" strokeWidth="4" /><rect x={Math.max(260, left - width * 80)} y="215" width={overlap} height="90" fill="#8b5cf6" opacity="0.46" /><Label x="105" y="410" text="The sliding overlap is the geometric heart of convolution." /></g>;
}

function FourierTransformSpectrum({ width, marker }: { width: number; marker: number }) {
  const pulse = (t: number) => Math.exp(-(t * t) / (width * width));
  const spectrum = (w: number) => width * Math.exp(-(width * width * w * w) / 4);
  return <g><Label x="80" y="70" text="Wider time pulse means narrower frequency spectrum." /><path d={Array.from({ length: 140 }).map((_, i) => { const t = -3 + i * 6 / 139; return `${i ? "L" : "M"}${95 + (t + 3) * 92},${205 - pulse(t) * 90}`; }).join(" ")} fill="none" stroke="#06b6d4" strokeWidth="5" /><path d={Array.from({ length: 140 }).map((_, i) => { const w = -5 + i * 10 / 139; return `${i ? "L" : "M"}${95 + (w + 5) * 55},${365 - spectrum(w) * 70}`; }).join(" ")} fill="none" stroke="#f59e0b" strokeWidth="5" /><line x1={95 + (marker + 5) * 55} y1="275" x2={95 + (marker + 5) * 55} y2="390" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="8 7" /></g>;
}

function MobiusMap({ pole, rotation }: { pole: number; rotation: number }) {
  return <ConformalMap strength={pole} rotation={rotation} />;
}

function ComplexLineIntegral({ radius, swirl }: { radius: number; swirl: number }) {
  const r = radius * 45;
  return <ComplexPlane><circle cx="380" cy="230" r={r} fill="#06b6d4" opacity="0.12" stroke="#06b6d4" strokeWidth="5" /><path d={`M${380 + r},230 A${r},${r} 0 1 1 ${380 - r},230 A${r},${r} 0 1 1 ${380 + r},230`} fill="none" stroke="#f59e0b" strokeWidth="5" /><Arrow x1={380 + r * 0.7} y1={230 - r * 0.7} x2={380 + r * 0.7 - swirl * 25} y2={230 - r * 0.7 - 35} color="#8b5cf6" /><Label x="90" y="75" text="Sample vectors accumulate along the oriented contour." /></ComplexPlane>;
}

function CauchyIntegral({ pointRadius, contourRadius }: { pointRadius: number; contourRadius: number }) {
  const inside = pointRadius < contourRadius;
  return <ComplexPlane><circle cx="380" cy="230" r={contourRadius * 45} fill="none" stroke="#06b6d4" strokeWidth="5" /><circle cx={380 + pointRadius * 45} cy="230" r="9" fill={inside ? "#10b981" : "#ef4444"} /><Label x="90" y="75" text={inside ? "Point a is inside C: integral recovers f(a)." : "Point a is outside C: formula conditions fail."} /></ComplexPlane>;
}

function FixedPointIteration({ initial, contraction }: { initial: number; contraction: number }) {
  const g = (x: number) => contraction * Math.cos(x);
  const points = [initial];
  for (let i = 0; i < 8; i += 1) points.push(g(points.at(-1)!));
  return <Graph>{curvePath((x) => x, -3, 3, "#94a3b8")}{curvePath(g, -3, 3, "#06b6d4")}{points.slice(0, -1).map((x, i) => <path key={i} d={`M${gx(x)},${gy(x)} L${gx(x)},${gy(g(x))} L${gx(g(x))},${gy(g(x))}`} fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.75" />)}<Label x="90" y="75" text={`Cobweb iteration for x=g(x), contraction=${roundTo(contraction, 2)}`} /></Graph>;
}

function SecantMethod({ x0, x1 }: { x0: number; x1: number }) {
  const f = (x: number) => x * x * x - x - 1;
  const x2 = x1 - f(x1) * (x1 - x0) / ((f(x1) - f(x0)) || 0.001);
  return <Graph>{curvePath(f, -3, 3, "#06b6d4")}<line x1={gx(x0)} y1={gy(f(x0))} x2={gx(x1)} y2={gy(f(x1))} stroke="#f59e0b" strokeWidth="5" /><PointGraph x={x0} y={f(x0)} label="x0" /><PointGraph x={x1} y={f(x1)} label="x1" /><PointGraph x={x2} y={0} label="next" color="#10b981" /><Label x="90" y="75" text={`Next secant estimate x=${roundTo(x2, 4)}`} /></Graph>;
}

function DividedDifferences({ count, evaluation }: { count: number; evaluation: number }) {
  const pts = Array.from({ length: count }, (_, i) => ({ x: -2.5 + i * 5 / (count - 1), y: Math.sin(i * 1.1) + i * 0.12 }));
  return <Graph>{pathToSvg(pts, "#f59e0b", 5)}{pts.map((p, i) => <PointGraph key={i} x={p.x} y={p.y} label={`x${i}`} color="#06b6d4" />)}<PointGraph x={evaluation} y={Math.sin((evaluation + 2.5) * 1.1) + 0.2} label="eval" color="#ef4444" /><Label x="90" y="75" text={`${count} points build nested Newton coefficients.`} /></Graph>;
}

function FiniteDifferenceInterpolation({ index, step }: { index: number; step: number }) {
  const rows = Array.from({ length: 6 }, (_, i) => Math.sin(i * step) + i * 0.2);
  return <g><Label x="80" y="70" text={`Equally spaced table with h=${roundTo(step, 2)}; focus index ${index}`} />{rows.map((value, i) => <g key={i}><rect x={120 + i * 86} y="145" width="68" height="44" rx="10" fill={i === index ? "#f59e0b" : "#06b6d4"} opacity="0.28" stroke={i === index ? "#f59e0b" : "#06b6d4"} strokeWidth="3" /><Label x={135 + i * 86} y="173" text={roundTo(value, 2).toString()} />{i < rows.length - 1 && <Label x={143 + i * 86} y="235" text={`D ${roundTo(rows[i + 1] - value, 2)}`} />}</g>)}<Label x="105" y="410" text="Forward/backward formulas choose the nearest table end and reuse finite differences." /></g>;
}

function GaussianQuadrature({ nodes, bend }: { nodes: number; bend: number }) {
  const xs = nodes === 2 ? [-0.577, 0.577] : nodes === 3 ? [-0.775, 0, 0.775] : Array.from({ length: nodes }, (_, i) => -0.85 + i * 1.7 / (nodes - 1));
  const f = (x: number) => 1 + bend * (x * x + 0.25 * Math.sin(3 * x));
  return <Graph>{curvePath(f, -1.4, 1.4, "#06b6d4")}{xs.map((x, i) => <g key={i}><line x1={gx(x)} y1={gy(0)} x2={gx(x)} y2={gy(f(x))} stroke="#f59e0b" strokeWidth="4" /><PointGraph x={x} y={f(x)} label={`w${i + 1}`} color="#8b5cf6" /></g>)}<Label x="90" y="75" text={`${nodes} optimized nodes sample the curve more efficiently than equal spacing.`} /></Graph>;
}

function Graph({ children }: { children: ReactNode }) {
  return <g><line x1="80" x2="680" y1="230" y2="230" stroke="#94a3b8" /><line x1="380" x2="380" y1="60" y2="400" stroke="#94a3b8" />{children}</g>;
}

function ComplexPlane({ children }: { children: ReactNode }) {
  return <g><line x1="80" x2="680" y1="230" y2="230" stroke="#94a3b8" /><line x1="380" x2="380" y1="60" y2="400" stroke="#94a3b8" /><Label x="655" y="218" text="Re" /><Label x="392" y="75" text="Im" />{children}</g>;
}

function Grid() {
  return <g opacity="0.42">{Array.from({ length: 15 }).map((_, i) => <line key={`v-${i}`} x1={40 + i * 48} y1="30" x2={40 + i * 48} y2="430" stroke="#e2e8f0" />)}{Array.from({ length: 9 }).map((_, i) => <line key={`h-${i}`} x1="30" y1={45 + i * 45} x2="730" y2={45 + i * 45} stroke="#e2e8f0" />)}</g>;
}

function curvePath(f: (x: number) => number, from: number, to: number, color: string) {
  let drawing = false;
  const d = Array.from({ length: 220 }).map((_, i) => {
    const x = from + (i / 219) * (to - from);
    const y = f(x);
    if (!Number.isFinite(y)) {
      drawing = false;
      return "";
    }
    const command = drawing ? "L" : "M";
    drawing = true;
    return `${command}${gx(x)},${gy(Math.max(-5, Math.min(5, y)))}`;
  }).filter(Boolean).join(" ");
  return <path d={d} fill="none" stroke={color} strokeWidth="4" />;
}

function pathToSvg(points: { x: number; y: number }[], color: string, width = 4) {
  const d = points.map((p, i) => `${i ? "L" : "M"}${gx(p.x)},${gy(p.y)}`).join(" ");
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />;
}

function gx(x: number) { return 380 + x * 85; }
function gy(y: number) { return 230 - y * 45; }
function zx(x: number) { return 380 + x * 55; }
function zy(y: number) { return 230 - y * 55; }

function PointGraph({ x, y, label, color = "#ef4444" }: { x: number; y: number; label: string; color?: string }) {
  return <g><circle cx={gx(x)} cy={gy(y)} r="8" fill={color} stroke="#0f172a" strokeWidth="2" /><Label x={gx(x) + 12} y={gy(y) - 10} text={label} /></g>;
}

function Point({ x, y, label }: { x: number; y: number; label: string }) {
  return <g><circle cx={x} cy={y} r="8" fill="#ef4444" stroke="#0f172a" strokeWidth="2" /><Label x={x + 12} y={y - 10} text={label} /></g>;
}

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4" markerEnd="url(#arrow)" />;
}

function Label({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} fill="#0f172a" fontSize="15" fontWeight="800">{text}</text>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 font-mono text-sm font-bold">{value}</p></div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-sm leading-6">{value}</p></div>;
}

function labMetrics(visual: AdvancedLabVisual, a: number, b: number) {
  if (visual === "venn") return [{ label: "Union", value: `${roundTo(a + 100 - Math.min(a, b), 0)}` }, { label: "Intersection", value: `${roundTo(Math.min(a, b), 0)}` }];
  if (visual === "tangent" || visual === "derivative") return [{ label: "Slope", value: `${roundTo(2 * a, 3)}` }, { label: "x", value: `${roundTo(a, 2)}` }];
  if (visual === "taylor") return [{ label: "cos(x)", value: `${roundTo(Math.cos(b), 4)}` }, { label: "degree", value: `${roundTo(a, 0)}` }];
  if (visual === "partial") return [{ label: "df/dx", value: `${roundTo(a / 2, 3)}` }, { label: "df/dy", value: `${roundTo(b / 2, 3)}` }];
  if (visual === "riemann") return [{ label: "dx", value: `${roundTo(b / Math.max(1, Math.round(a)), 4)}` }, { label: "rectangles", value: `${Math.round(a)}` }];
  if (visual === "area-under-curve") return [{ label: "width", value: `${roundTo(Math.abs(b - a), 3)}` }, { label: "interval", value: `[${roundTo(Math.min(a, b), 1)}, ${roundTo(Math.max(a, b), 1)}]` }];
  if (visual === "shell-washer") return [{ label: "shell radius", value: `${roundTo(a, 2)}` }, { label: "washer mix", value: `${roundTo(b * 100, 0)}%` }];
  if (visual === "double-integral") return [{ label: "region area", value: `${roundTo(a * b, 3)}` }, { label: "dA grid", value: "visible" }];
  if (visual === "triple-integral") return [{ label: "volume scale", value: `${roundTo(a * a * b, 3)}` }, { label: "dV boxes", value: "stacked" }];
  if (visual === "coordinate-transform") return [{ label: "warp", value: `${roundTo(a, 2)}` }, { label: "rotation", value: `${roundTo(b, 1)} deg` }];
  if (visual === "beta-gamma") return [{ label: "alpha", value: `${roundTo(a, 2)}` }, { label: "beta", value: `${roundTo(b, 2)}` }];
  if (visual === "sequence-convergence") return [{ label: "error", value: `${roundTo(1 / Math.max(1, a), 4)}` }, { label: "limit", value: `${roundTo(b, 2)}` }];
  if (visual === "cauchy-sequence") return [{ label: "tail N", value: `${Math.round(a)}` }, { label: "epsilon", value: `${roundTo(b, 3)}` }];
  if (visual === "series-partial-sum") return [{ label: "terms", value: `${Math.round(a)}` }, { label: "ratio", value: `${roundTo(b, 2)}` }];
  if (visual === "convergence-test") return [{ label: "family", value: `${Math.round(a)}` }, { label: "parameter", value: `${roundTo(b, 2)}` }];
  if (visual === "power-series-radius") return [{ label: "inside", value: `${Math.abs(b) < a ? "yes" : "no"}` }, { label: "R", value: `${roundTo(a, 2)}` }];
  if (visual === "pointwise-uniform") return [{ label: "n", value: `${Math.round(a)}` }, { label: "probe x", value: `${roundTo(b, 2)}` }];
  if (visual === "partition-refinement") return [{ label: "mesh", value: `${roundTo(5 / Math.max(1, a), 3)}` }, { label: "pieces", value: `${Math.round(a)}` }];
  if (visual === "argand-plane") return [{ label: "modulus", value: `${roundTo(Math.hypot(a, b), 3)}` }, { label: "argument", value: `${roundTo(Math.atan2(b, a) * 180 / Math.PI, 2)} deg` }];
  if (visual === "complex-rotation") return [{ label: "angle", value: `${roundTo(a, 1)} deg` }, { label: "radius", value: `${roundTo(b, 2)}` }];
  if (visual === "nth-roots") return [{ label: "root spacing", value: `${roundTo(360 / Math.max(1, Math.round(a)), 2)} deg` }, { label: "roots", value: `${Math.round(a)}` }];
  if (visual === "cauchy-riemann") return [{ label: "u_x / v_y", value: `${roundTo(2 * a, 2)}` }, { label: "u_y / -v_x", value: `${roundTo(-2 * b, 2)}` }];
  if (visual === "laurent-annulus") return [{ label: "inner", value: `${roundTo(Math.min(a, b), 2)}` }, { label: "outer", value: `${roundTo(Math.max(a, b), 2)}` }];
  if (visual === "residue-pole") return [{ label: "pole", value: `${roundTo(a, 2)}` }, { label: "contour", value: `${roundTo(b, 2)}` }];
  if (visual === "vector-2d-3d") return [{ label: "magnitude", value: `${roundTo(Math.hypot(a, b, b / 1.6), 3)}` }, { label: "direction", value: `${roundTo(Math.atan2(b, a) * 180 / Math.PI, 1)} deg` }];
  if (visual === "span-basis") return [{ label: "coefficient a", value: `${roundTo(a, 2)}` }, { label: "coefficient b", value: `${roundTo(b, 2)}` }];
  if (visual === "matrix-grid-warp") return [{ label: "determinant", value: `${roundTo(1 - 0.35 * a * a, 3)}` }, { label: "rotation", value: `${roundTo(b, 1)} deg` }];
  if (visual === "gaussian-elimination") return [{ label: "step", value: `${Math.round(a)}` }, { label: "pivot scale", value: `${roundTo(b, 2)}` }];
  if (visual === "eigenvector-direction") return [{ label: "angle", value: `${roundTo(a, 1)} deg` }, { label: "lambda", value: `${roundTo(b, 2)}` }];
  if (visual === "diagonalization-flow") return [{ label: "lambda 1", value: `${roundTo(a, 2)}` }, { label: "lambda 2", value: `${roundTo(b, 2)}` }];
  if (visual === "gram-schmidt") return [{ label: "v2", value: `<${roundTo(a, 1)}, ${roundTo(b, 1)}>` }, { label: "orthogonalized", value: "u2" }];
  if (visual === "quadratic-form-surface") return [{ label: "type", value: `${a * b < 0 ? "saddle" : a > 0 && b > 0 ? "bowl" : "mixed"}` }, { label: "trace", value: `${roundTo(a + b, 2)}` }];
  if (visual === "cayley-table") return [{ label: "order", value: `${Math.round(a)}` }, { label: "identity", value: `${mod(-Math.round(b), Math.round(a))}` }];
  if (visual === "group-operation") return [{ label: "product", value: `g^${mod(Math.round(a) + Math.round(b), 8)}` }, { label: "group", value: "C_8" }];
  if (visual === "symmetry-group") return [{ label: "symmetries", value: `${2 * Math.round(a)}` }, { label: "shown", value: `${Math.round(b) >= Math.round(a) ? "reflection" : "rotation"}` }];
  if (visual === "permutation-cycle") return [{ label: "cycles", value: `${permutationCycles(Math.round(a), Math.round(b)).length}` }, { label: "shift", value: `${Math.round(b)}` }];
  if (visual === "coset-partition") return [{ label: "cosets", value: `${Math.ceil(Math.round(a) / Math.max(1, Math.round(b)))}` }, { label: "subgroup", value: `${Math.round(b)}` }];
  if (visual === "homomorphism-map") return [{ label: "domain", value: `Z_${Math.round(a)}` }, { label: "multiplier", value: `${Math.round(b)}` }];
  if (visual === "ring-operation-table") return [{ label: "modulus", value: `${Math.round(a)}` }, { label: "operation", value: `${Math.round(b) === 1 ? "multiply" : "add"}` }];
  if (visual === "slope-field") return [{ label: "x coeff", value: `${roundTo(a, 2)}` }, { label: "y coeff", value: `${roundTo(b, 2)}` }];
  if (visual === "solution-curve") return [{ label: "initial y0", value: `${roundTo(a, 2)}` }, { label: "growth", value: `${roundTo(b, 2)}` }];
  if (visual === "direction-field") return [{ label: "spring k", value: `${roundTo(a, 2)}` }, { label: "damping", value: `${roundTo(b, 2)}` }];
  if (visual === "orthogonal-trajectory") return [{ label: "spacing", value: `${roundTo(a, 2)}` }, { label: "rotation", value: `${roundTo(b, 1)} deg` }];
  if (visual === "spring-mass-ode") return [{ label: "omega", value: `${roundTo(Math.sqrt(a), 3)}` }, { label: "damping", value: `${roundTo(b, 2)}` }];
  if (visual === "heat-equation") return [{ label: "time", value: `${roundTo(a, 2)}` }, { label: "diffusion", value: `${roundTo(b, 2)}` }];
  if (visual === "wave-equation") return [{ label: "phase", value: `${roundTo(a * b, 2)}` }, { label: "speed", value: `${roundTo(b, 2)}` }];
  if (visual === "laplace-potential") return [{ label: "strength", value: `${roundTo(a, 2)}` }, { label: "tilt", value: `${roundTo(b, 2)}` }];
  if (visual === "root-finding") return [{ label: "bracket width", value: `${roundTo(Math.abs(b - a), 3)}` }, { label: "midpoint", value: `${roundTo((a + b) / 2, 3)}` }];
  if (visual === "newton-raphson") return [{ label: "x0", value: `${roundTo(a, 2)}` }, { label: "iterations", value: `${Math.round(b)}` }];
  if (visual === "error-convergence") return [{ label: "method", value: `${Math.round(a)}` }, { label: "initial error", value: `${roundTo(b, 3)}` }];
  if (visual === "interpolation-builder") return [{ label: "points", value: `${Math.round(a)}` }, { label: "tension", value: `${roundTo(b, 2)}` }];
  if (visual === "numerical-integration") return [{ label: "subintervals", value: `${Math.round(a)}` }, { label: "method", value: `${["rect", "trap", "simpson"][Math.round(b)] ?? "rect"}` }];
  if (visual === "euler-rk4") return [{ label: "steps", value: `${Math.round(a)}` }, { label: "growth", value: `${roundTo(b, 2)}` }];
  if (visual === "linear-system-solver") return [{ label: "iteration", value: `${Math.round(a)}` }, { label: "relaxation", value: `${roundTo(b, 2)}` }];
  if (visual === "z-transform") return [{ label: "stability", value: a < 1 ? "stable" : "unstable" }, { label: "pole radius", value: `${roundTo(a, 2)}` }];
  if (visual === "vector-calculus-field") return [{ label: "divergence", value: `${roundTo(2 * b, 3)}` }, { label: "curl", value: `${roundTo(2 * a, 3)}` }];
  return [{ label: "Control A", value: `${roundTo(a, 2)}` }, { label: "Control B", value: `${roundTo(b, 2)}` }];
}

function noticeText(visual: AdvancedLabVisual) {
  if (["limit", "continuity"].includes(visual)) return "Compare what the graph approaches with the value at the point.";
  if (["tangent", "derivative", "higher-derivative", "maxima", "curvature"].includes(visual)) return "Watch slope, turning, and bending change together.";
  if (["riemann", "area-under-curve", "shell-washer"].includes(visual)) return "Watch how slices accumulate into area or volume.";
  if (["double-integral", "triple-integral", "coordinate-transform", "partial"].includes(visual)) return "Track the region, slicing direction, and differential element.";
  if (visual === "beta-gamma") return "Changing parameters reshapes the curve peak and skew.";
  if (["sequence-convergence", "cauchy-sequence", "series-partial-sum", "convergence-test", "power-series-radius", "pointwise-uniform", "partition-refinement"].includes(visual)) return "Track the tail, error, radius, or mesh as the limiting process becomes clearer.";
  if (["argand-plane", "complex-rotation", "nth-roots", "domain-coloring", "cauchy-riemann", "laurent-annulus", "residue-pole", "conformal-map"].includes(visual)) return "Track modulus, argument, singularities, or angle-preserving structure in the complex plane.";
  if (["vector-2d-3d", "span-basis", "matrix-grid-warp", "gaussian-elimination", "eigenvector-direction", "diagonalization-flow", "gram-schmidt", "quadratic-form-surface"].includes(visual)) return "Track vectors, bases, matrix actions, pivots, eigen-directions, and orthogonal structure.";
  if (["cayley-table", "group-operation", "symmetry-group", "permutation-cycle", "coset-partition", "homomorphism-map", "ring-operation-table"].includes(visual)) return "Track closure, identity, cycles, cosets, structure-preserving maps, and modular operations.";
  if (["slope-field", "solution-curve", "direction-field", "orthogonal-trajectory", "spring-mass-ode", "heat-equation", "wave-equation", "laplace-potential"].includes(visual)) return "Track local rates of change, trajectories, oscillation, diffusion, waves, and boundary-driven potentials.";
  if (visual === "z-transform") return "Track poles, the unit circle, region of convergence, and discrete recurrence stability.";
  if (visual === "vector-calculus-field") return "Track divergence, curl, flux, and boundary circulation in one vector field.";
  if (["root-finding", "newton-raphson", "error-convergence", "interpolation-builder", "numerical-integration", "euler-rk4", "linear-system-solver"].includes(visual)) return "Track approximation, iteration, error decay, fitted curves, numerical area, and solver convergence.";
  if (["venn", "mapping", "relation-matrix", "truth-table", "equivalence"].includes(visual)) return "Look for structure: regions, arrows, matrix patterns, or partitions.";
  return "Move both controls and compare the visual with the formula.";
}

function learningSteps(lab: AdvancedSyllabusLab, a: number, b: number) {
  return [`Start with ${lab.formula}.`, `Set ${lab.sliderA}=${roundTo(a, 2)} and ${lab.sliderB}=${roundTo(b, 2)}.`, "Observe the diagram before calculating.", "Use the formula or definition to explain what changed."];
}

function factorial(n: number): number {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function mod(value: number, modulus: number) {
  return ((value % modulus) + modulus) % modulus;
}

function permutationCycles(size: number, shift: number) {
  const n = Math.max(1, size);
  const s = Math.max(1, mod(shift, n));
  const seen = new Set<number>();
  const cycles: number[][] = [];
  for (let i = 0; i < n; i += 1) {
    if (seen.has(i)) continue;
    const cycle: number[] = [];
    let current = i;
    while (!seen.has(current)) {
      seen.add(current);
      cycle.push(current);
      current = mod(current + s, n);
    }
    cycles.push(cycle);
  }
  return cycles;
}
