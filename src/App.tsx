import { Component, lazy, Suspense, useEffect, useState, type ComponentType, type ErrorInfo, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import SeoMetadata from "./components/seo/SeoMetadata";
import { formulaVisualizerConfigs } from "./data/formulaVisualizerRoutes";

const routeChunkReloadKey = "math-universe-route-chunk-reload";

function isRouteChunkLoadError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(message);
}

function lazyRoute<Props>(loader: () => Promise<{ default: ComponentType<Props> }>) {
  return lazy(async () => {
    try {
      const module = await loader();
      if (typeof window !== "undefined") sessionStorage.removeItem(routeChunkReloadKey);
      return module;
    } catch (error) {
      if (typeof window !== "undefined" && isRouteChunkLoadError(error) && sessionStorage.getItem(routeChunkReloadKey) !== "1") {
        sessionStorage.setItem(routeChunkReloadKey, "1");
        window.location.reload();
      }
      throw error;
    }
  });
}

const About = lazyRoute(() => import("./pages/About"));
const AccuracyCertification = lazyRoute(() => import("./pages/AccuracyCertification"));
const AdvancedSyllabusLabPage = lazyRoute(() => import("./pages/AdvancedSyllabusLabPage"));
const Algebra = lazyRoute(() => import("./pages/Algebra"));
const AlgebraicStructures = lazyRoute(() => import("./pages/AlgebraicStructures"));
const AIApplications = lazyRoute(() => import("./pages/AIApplications"));
const ARMathLab = lazyRoute(() => import("./pages/ARMathLab"));
const BoardSyllabusVisualizer = lazyRoute(() => import("./pages/BoardSyllabusVisualizer"));
const Calculus = lazyRoute(() => import("./pages/Calculus"));
const CircleToTriangleVisualization = lazyRoute(() => import("./pages/CircleToTriangleVisualization"));
const Combinatorics = lazyRoute(() => import("./pages/Combinatorics"));
const ComplexNumbers = lazyRoute(() => import("./pages/ComplexNumbers"));
const ConceptDependencyGraph = lazyRoute(() => import("./pages/ConceptDependencyGraph"));
const ConceptMapPage = lazyRoute(() => import("./concept-map/ConceptMapPage"));
const DailyChallenge = lazyRoute(() => import("./pages/DailyChallenge"));
const DerivativesTangentVisualizer = lazyRoute(() => import("./pages/DerivativesTangentVisualizer"));
const DiscreteWorld = lazyRoute(() => import("./pages/DiscreteWorld"));
const Documentation = lazyRoute(() => import("./pages/Documentation"));
const EigenvectorsVisualizerPage = lazyRoute(() => import("./pages/EigenvectorsVisualizerPage"));
const EngineeringMath = lazyRoute(() => import("./pages/EngineeringMath"));
const Formulas = lazyRoute(() => import("./pages/Formulas"));
const FormulaVisualizerPage = lazyRoute(() => import("./pages/FormulaVisualizerPage"));
const FourierSeriesAnimator = lazyRoute(() => import("./pages/FourierSeriesAnimator"));
const FourierSeriesVisualizerPage = lazyRoute(() => import("./pages/FourierSeriesVisualizerPage"));
const FunctionsGraphsVisualizer = lazyRoute(() => import("./pages/FunctionsGraphsVisualizer"));
const Geometry = lazyRoute(() => import("./pages/Geometry"));
const GeometryConceptPage = lazyRoute(() => import("./pages/GeometryConceptPage"));
const GraphComparisonMode = lazyRoute(() => import("./pages/GraphComparisonMode"));
const GraphTheory = lazyRoute(() => import("./pages/GraphTheory"));
const Home = lazyRoute(() => import("./pages/Home"));
const IntegrationAreaVisualizerPage = lazyRoute(() => import("./pages/IntegrationAreaVisualizerPage"));
const LearningHub = lazyRoute(() => import("./pages/LearningHub"));
const LinearAlgebra = lazyRoute(() => import("./pages/LinearAlgebra"));
const LimitsContinuityVisualizer = lazyRoute(() => import("./pages/LimitsContinuityVisualizer"));
const MathLab = lazyRoute(() => import("./pages/MathLab"));
const MathLab3DGraphing = lazyRoute(() => import("./pages/MathLab3DGraphing"));
const MathLabConicSolver = lazyRoute(() => import("./pages/MathLabConicSolver"));
const MathLabFunctionExplorer = lazyRoute(() => import("./pages/MathLabFunctionExplorer"));
const MathLabGraphingCalculator = lazyRoute(() => import("./pages/MathLabGraphingCalculator"));
const MathLabLinearAlgebra = lazyRoute(() => import("./pages/MathLabLinearAlgebra"));
const MathLabProbability = lazyRoute(() => import("./pages/MathLabProbability"));
const MathLabSmartQuery = lazyRoute(() => import("./pages/MathLabSmartQuery"));
const MathLabToolPage = lazyRoute(() => import("./pages/MathLabToolPage"));
const MathVisualizationPage = lazyRoute(() => import("./pages/MathVisualizationPage"));
const MathVisualDictionary = lazyRoute(() => import("./pages/MathVisualDictionary"));
const MathWorkspace = lazyRoute(() => import("./pages/MathWorkspace"));
const MagicMaths = lazyRoute(() => import("./pages/MagicMaths"));
const MatrixOperationPage = lazyRoute(() => import("./pages/MatrixOperationPage"));
const MatrixOperations = lazyRoute(() => import("./pages/MatrixOperations"));
const MatrixOperationsSandbox = lazyRoute(() => import("./pages/MatrixOperationsSandbox"));
const MatrixTransformationsVisualizerPage = lazyRoute(() => import("./pages/MatrixTransformationsVisualizerPage"));
const NCERTConceptPage = lazyRoute(() => import("./pages/NCERTConceptPage"));
const NCERTDashboardPage = lazyRoute(() => import("./pages/NCERTDashboardPage"));
const NumberSystems = lazyRoute(() => import("./pages/NumberSystems"));
const Olympyard = lazyRoute(() => import("./pages/Olympyard"));
const OlympyardMockTest = lazyRoute(() => import("./pages/OlympyardMockTest"));
const OlympyardPractice = lazyRoute(() => import("./pages/OlympyardPractice"));
const ParametricCurveExplorer = lazyRoute(() => import("./pages/ParametricCurveExplorer"));
const PermutationsCombinationsVisualizer = lazyRoute(() => import("./pages/PermutationsCombinationsVisualizer"));
const PolarCoordinatesVisualizer = lazyRoute(() => import("./pages/PolarCoordinatesVisualizer"));
const ProbabilityStatistics = lazyRoute(() => import("./pages/ProbabilityStatistics"));
const Quiz = lazyRoute(() => import("./pages/Quiz"));
const ScientificCalculator = lazyRoute(() => import("./pages/ScientificCalculator"));
const SetTheory = lazyRoute(() => import("./pages/SetTheory"));
const ShapesExplorer = lazyRoute(() => import("./pages/ShapesExplorer"));
const Sitemap = lazyRoute(() => import("./pages/Sitemap"));
const SlopeFieldsVisualizerPage = lazyRoute(() => import("./pages/SlopeFieldsVisualizerPage"));
const SpacedRepetitionQuiz = lazyRoute(() => import("./pages/SpacedRepetitionQuiz"));
const StepByStepProblemSolver = lazyRoute(() => import("./pages/StepByStepProblemSolver"));
const SurfacePlotter3D = lazyRoute(() => import("./pages/SurfacePlotter3D"));
const Syllabus = lazyRoute(() => import("./pages/Syllabus"));
const SyllabusVisualPage = lazyRoute(() => import("./pages/SyllabusVisualPage"));
const Theorems = lazyRoute(() => import("./pages/Theorems"));
const Trigonometry = lazyRoute(() => import("./pages/Trigonometry"));
const TrigonometryConceptPage = lazyRoute(() => import("./pages/TrigonometryConceptPage"));
const TrigFormulaVisualizerPage = lazyRoute(() => import("./trigonometry/pages/TrigFormulaVisualizerPage"));
const TruthTableGenerator = lazyRoute(() => import("./pages/TruthTableGenerator"));
const UnitConverter = lazyRoute(() => import("./pages/UnitConverter"));
const VisualFormulasHub = lazyRoute(() => import("./pages/VisualFormulasHub"));
const VisualShowcase = lazyRoute(() => import("./pages/VisualShowcase"));
const VisualProofsHomePage = lazyRoute(() => import("./visual-proofs/pages/VisualProofsHomePage"));
const VisualProofCategoryPage = lazyRoute(() => import("./visual-proofs/pages/VisualProofCategoryPage"));
const VisualProofPage = lazyRoute(() => import("./visual-proofs/pages/VisualProofPage"));
const WorkedExamplesLibrary = lazyRoute(() => import("./pages/WorkedExamplesLibrary"));
const Workspace3D = lazyRoute(() => import("./pages/Workspace3D"));
const WorkspaceData = lazyRoute(() => import("./pages/WorkspaceData"));
const WorkspaceGeometry = lazyRoute(() => import("./pages/WorkspaceGeometry"));
const WorkspaceGraph = lazyRoute(() => import("./pages/WorkspaceGraph"));
const WorkspaceTeach = lazyRoute(() => import("./pages/WorkspaceTeach"));

type AppErrorBoundaryProps = { children: ReactNode; resetKey: string };
type AppErrorBoundaryState = { hasError: boolean };

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: AppErrorBoundaryProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Math Universe failed to render", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-950 dark:bg-slate-950 dark:text-white">
          <section className="max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-600 dark:text-cyan-300">Math Universe</p>
            <h1 className="mt-3 text-2xl font-bold">Something went wrong.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Reload the app to restore the latest lesson shell and cached visualizations.
            </p>
            <button className="action-primary mt-5" type="button" onClick={() => window.location.reload()}>
              Reload app
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const location = useLocation();

  return (
    <AppErrorBoundary resetKey={location.pathname}>
      <SeoMetadata />
      <RouteProgressBar />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="accuracy-certification" element={<AccuracyCertification />} />
            <Route path="algebra" element={<Algebra />} />
            <Route path="algebraic-structures" element={<AlgebraicStructures />} />
            <Route path="math-lab" element={<MathLab />} />
            <Route path="engineering-math" element={<EngineeringMath />} />
            <Route path="math-lab/graphing-calculator" element={<MathLabGraphingCalculator />} />
            <Route path="math-lab/function-explorer" element={<MathLabFunctionExplorer />} />
            <Route path="math-lab/linear-algebra" element={<MathLabLinearAlgebra />} />
            <Route path="math-lab/3d-graphing" element={<MathLab3DGraphing />} />
            <Route path="math-lab/conics" element={<MathLabConicSolver />} />
            <Route path="math-lab/probability" element={<MathLabProbability />} />
            <Route path="math-lab/cas-solver" element={<Navigate to="/problem-solver" replace />} />
            <Route path="math-lab/query" element={<MathLabSmartQuery />} />
            <Route path="math-lab/:toolId" element={<MathLabToolPage />} />
            <Route path="ar-math-lab" element={<Navigate to="/modules/ar-math-lab" replace />} />
            <Route path="modules/ar-math-lab" element={<ARMathLab />} />
            <Route path="visual-dictionary" element={<MathVisualDictionary />} />
            <Route path="magic-maths" element={<MagicMaths />} />
            <Route path="magic-maths/:conceptSlug" element={<MagicMaths />} />
            <Route path="workspace" element={<MathWorkspace />} />
            <Route path="workspace/graph" element={<WorkspaceGraph />} />
            <Route path="workspace/geometry" element={<WorkspaceGeometry />} />
            <Route path="workspace/3d" element={<Workspace3D />} />
            <Route path="workspace/data" element={<WorkspaceData />} />
            <Route path="workspace/data/spreadsheet" element={<WorkspaceData page="spreadsheet" />} />
            <Route path="workspace/data/analysis" element={<WorkspaceData page="analysis" />} />
            <Route path="workspace/data/cas" element={<WorkspaceData page="cas" />} />
            <Route path="workspace/data/results" element={<WorkspaceData page="results" />} />
            <Route path="workspace/data/objects" element={<WorkspaceData page="objects" />} />
            <Route path="workspace/teach" element={<WorkspaceTeach />} />
            <Route path="formulas" element={<Formulas />} />
            <Route path="formulas/:categorySlug" element={<Formulas />} />
            <Route path="visual-formulas" element={<VisualFormulasHub />} />
            <Route path="visual-formulas/sierpinski-carpet" element={<FormulaVisualizerPage conceptId="sierpinski-carpet" />} />
            <Route path="visual-formulas/proportional-reasoning-2" element={<FormulaVisualizerPage conceptId="proportional-reasoning-2" />} />
            {formulaVisualizerConfigs.filter((config) => config.id !== "trigonometry" && config.id !== "sierpinski-carpet" && config.id !== "proportional-reasoning-2").map((config) => (
              <Route key={config.route} path={config.route.slice(1)} element={<FormulaVisualizerPage conceptId={config.id} />} />
            ))}
            <Route path="theorems" element={<Theorems />} />
            <Route path="theorems/:categorySlug" element={<Theorems />} />
            <Route path="theorems/:categorySlug/:theoremSlug" element={<Theorems />} />
            <Route path="visual-showcase" element={<VisualShowcase />} />
            <Route path="circle-to-triangle" element={<CircleToTriangleVisualization />} />
            <Route path="visual-proofs" element={<VisualProofsHomePage />} />
            <Route path="visual-proofs/:categorySlug" element={<VisualProofCategoryPage />} />
            <Route path="visual-proofs/geometry/circle-to-triangle" element={<CircleToTriangleVisualization />} />
            <Route path="visual-proofs/:categorySlug/:proofSlug" element={<VisualProofPage />} />
            <Route path="geometry" element={<Geometry />} />
            <Route path="geometry/:conceptId" element={<GeometryConceptPage />} />
            <Route path="shapes" element={<ShapesExplorer />} />
            <Route path="number-systems" element={<NumberSystems />} />
            <Route path="trigonometry" element={<Trigonometry />} />
            <Route path="trigonometry/formula-visualizer" element={<TrigFormulaVisualizerPage />} />
            <Route path="trigonometry/:conceptId" element={<TrigonometryConceptPage />} />
            <Route path="calculus" element={<Calculus />} />
            <Route path="calculus/limits" element={<Calculus page="limits" />} />
            <Route path="calculus/derivatives" element={<Calculus page="derivatives" />} />
            <Route path="calculus/integrals" element={<Calculus page="integrals" />} />
            <Route path="calculus/motion" element={<Calculus page="motion" />} />
            <Route path="calculus/practice" element={<Calculus page="practice" />} />
            <Route path="calculus/proof-problems" element={<Calculus page="proof-problems" />} />
            <Route path="calculus/series-blocks" element={<Calculus page="series-blocks" />} />
            <Route path="calculus/atlas" element={<Calculus page="atlas" />} />
            <Route path="calculus/formulas" element={<Calculus page="formulas" />} />
            <Route path="calculus/applications" element={<Calculus page="applications" />} />
            <Route path="combinatorics" element={<Combinatorics />} />
            <Route path="complex-numbers" element={<ComplexNumbers />} />
            <Route path="set-theory" element={<SetTheory />} />
            <Route path="set-theory/:pageSlug" element={<SetTheory />} />
            <Route path="statistics" element={<ProbabilityStatistics />} />
            <Route path="linear-algebra" element={<LinearAlgebra />} />
            <Route path="matrices" element={<MatrixOperations />} />
            <Route path="matrices/:operationId" element={<MatrixOperationPage />} />
            <Route path="matrix-sandbox" element={<MatrixOperationsSandbox />} />
            <Route path="ai-applications" element={<AIApplications />} />
            <Route path="learn" element={<LearningHub />} />
            <Route path="olympyard" element={<Olympyard />} />
            <Route path="olympyard/mock-test" element={<OlympyardMockTest />} />
            <Route path="olympyard/practice/:topicId" element={<OlympyardPractice />} />
            <Route path="spaced-repetition" element={<SpacedRepetitionQuiz />} />
            <Route path="problem-solver" element={<StepByStepProblemSolver />} />
            <Route path="concept-map" element={<ConceptMapPage />} />
            <Route path="concept-graph" element={<ConceptDependencyGraph />} />
            <Route path="daily-challenge" element={<DailyChallenge />} />
            <Route path="worked-examples" element={<WorkedExamplesLibrary />} />
            <Route path="graph-comparison" element={<GraphComparisonMode />} />
            <Route path="graph-theory" element={<GraphTheory />} />
            <Route path="discrete-world" element={<DiscreteWorld />} />
            <Route path="parametric-curves" element={<ParametricCurveExplorer />} />
            <Route path="surface-plotter" element={<SurfacePlotter3D />} />
            <Route path="fourier-animator" element={<FourierSeriesAnimator />} />
            <Route path="polar-visualizer" element={<PolarCoordinatesVisualizer />} />
            <Route path="unit-converter" element={<UnitConverter />} />
            <Route path="probability-statistics" element={<ProbabilityStatistics />} />
            <Route path="mathematical-logic" element={<TruthTableGenerator />} />
            <Route path="truth-table" element={<TruthTableGenerator />} />
            <Route path="math/functions-graphs" element={<FunctionsGraphsVisualizer />} />
            <Route path="math/limits-continuity" element={<LimitsContinuityVisualizer />} />
            <Route path="math/derivatives" element={<DerivativesTangentVisualizer />} />
            <Route path="math/integration" element={<IntegrationAreaVisualizerPage />} />
            <Route path="math/matrix-transformations" element={<MatrixTransformationsVisualizerPage />} />
            <Route path="math/eigenvectors" element={<EigenvectorsVisualizerPage />} />
            <Route path="math/slope-fields" element={<SlopeFieldsVisualizerPage />} />
            <Route path="math/fourier-series" element={<FourierSeriesVisualizerPage />} />
            <Route path="math/permutations-combinations" element={<PermutationsCombinationsVisualizer />} />
            <Route path="math/:visualizationId" element={<MathVisualizationPage />} />
            <Route path="ncert" element={<NCERTDashboardPage />} />
            <Route path="ncert/:conceptId" element={<NCERTConceptPage />} />
            <Route path="syllabus-visual/:topicId" element={<BoardSyllabusVisualizer />} />
            <Route path="syllabus-visual-v2/:slug" element={<SyllabusVisualPage />} />
            <Route path="syllabus-lab/:labId" element={<AdvancedSyllabusLabPage />} />
            <Route path="syllabus" element={<Syllabus />} />
            <Route path="syllabus/:levelId" element={<Syllabus />} />
            <Route path="calculator" element={<ScientificCalculator />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="documentation" element={<Documentation />} />
            <Route path="sitemap" element={<Sitemap />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </AppErrorBoundary>
  );
}

function RouteProgressBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setVisible(true);
    setProgress(18);
    const timers = [
      window.setTimeout(() => setProgress(48), 80),
      window.setTimeout(() => setProgress(78), 220),
      window.setTimeout(() => setProgress(100), 420),
      window.setTimeout(() => setVisible(false), 700),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [location.hash, location.pathname, location.search]);

  return (
    <div
      className={`route-progress ${visible ? "route-progress-visible" : ""}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <span style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" aria-label="Loading" />
    </div>
  );
}
