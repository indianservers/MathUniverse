import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import SeoMetadata from "./components/seo/SeoMetadata";

const About = lazy(() => import("./pages/About"));
const AdvancedSyllabusLabPage = lazy(() => import("./pages/AdvancedSyllabusLabPage"));
const Algebra = lazy(() => import("./pages/Algebra"));
const AlgebraicStructures = lazy(() => import("./pages/AlgebraicStructures"));
const AIApplications = lazy(() => import("./pages/AIApplications"));
const ARMathLab = lazy(() => import("./pages/ARMathLab"));
const BoardSyllabusVisualizer = lazy(() => import("./pages/BoardSyllabusVisualizer"));
const Calculus = lazy(() => import("./pages/Calculus"));
const CircleToTriangleVisualization = lazy(() => import("./pages/CircleToTriangleVisualization"));
const Combinatorics = lazy(() => import("./pages/Combinatorics"));
const ComplexNumbers = lazy(() => import("./pages/ComplexNumbers"));
const ConceptDependencyGraph = lazy(() => import("./pages/ConceptDependencyGraph"));
const ConceptMapPage = lazy(() => import("./concept-map/ConceptMapPage"));
const DailyChallenge = lazy(() => import("./pages/DailyChallenge"));
const DerivativesTangentVisualizer = lazy(() => import("./pages/DerivativesTangentVisualizer"));
const DiscreteWorld = lazy(() => import("./pages/DiscreteWorld"));
const Documentation = lazy(() => import("./pages/Documentation"));
const EigenvectorsVisualizerPage = lazy(() => import("./pages/EigenvectorsVisualizerPage"));
const EngineeringMath = lazy(() => import("./pages/EngineeringMath"));
const Formulas = lazy(() => import("./pages/Formulas"));
const FourierSeriesAnimator = lazy(() => import("./pages/FourierSeriesAnimator"));
const FourierSeriesVisualizerPage = lazy(() => import("./pages/FourierSeriesVisualizerPage"));
const FunctionsGraphsVisualizer = lazy(() => import("./pages/FunctionsGraphsVisualizer"));
const Geometry = lazy(() => import("./pages/Geometry"));
const GeometryConceptPage = lazy(() => import("./pages/GeometryConceptPage"));
const GraphComparisonMode = lazy(() => import("./pages/GraphComparisonMode"));
const GraphTheory = lazy(() => import("./pages/GraphTheory"));
const Home = lazy(() => import("./pages/Home"));
const IntegrationAreaVisualizerPage = lazy(() => import("./pages/IntegrationAreaVisualizerPage"));
const LearningHub = lazy(() => import("./pages/LearningHub"));
const LinearAlgebra = lazy(() => import("./pages/LinearAlgebra"));
const LimitsContinuityVisualizer = lazy(() => import("./pages/LimitsContinuityVisualizer"));
const MathLab = lazy(() => import("./pages/MathLab"));
const MathLab3DGraphing = lazy(() => import("./pages/MathLab3DGraphing"));
const MathLabConicSolver = lazy(() => import("./pages/MathLabConicSolver"));
const MathLabFunctionExplorer = lazy(() => import("./pages/MathLabFunctionExplorer"));
const MathLabGraphingCalculator = lazy(() => import("./pages/MathLabGraphingCalculator"));
const MathLabLinearAlgebra = lazy(() => import("./pages/MathLabLinearAlgebra"));
const MathLabProbability = lazy(() => import("./pages/MathLabProbability"));
const MathLabSmartQuery = lazy(() => import("./pages/MathLabSmartQuery"));
const MathLabToolPage = lazy(() => import("./pages/MathLabToolPage"));
const MathVisualizationPage = lazy(() => import("./pages/MathVisualizationPage"));
const MathVisualDictionary = lazy(() => import("./pages/MathVisualDictionary"));
const MathWorkspace = lazy(() => import("./pages/MathWorkspace"));
const MagicMaths = lazy(() => import("./pages/MagicMaths"));
const MatrixOperationPage = lazy(() => import("./pages/MatrixOperationPage"));
const MatrixOperations = lazy(() => import("./pages/MatrixOperations"));
const MatrixOperationsSandbox = lazy(() => import("./pages/MatrixOperationsSandbox"));
const MatrixTransformationsVisualizerPage = lazy(() => import("./pages/MatrixTransformationsVisualizerPage"));
const NCERTConceptPage = lazy(() => import("./pages/NCERTConceptPage"));
const NumberSystems = lazy(() => import("./pages/NumberSystems"));
const Olympyard = lazy(() => import("./pages/Olympyard"));
const OlympyardMockTest = lazy(() => import("./pages/OlympyardMockTest"));
const OlympyardPractice = lazy(() => import("./pages/OlympyardPractice"));
const ParametricCurveExplorer = lazy(() => import("./pages/ParametricCurveExplorer"));
const PermutationsCombinationsVisualizer = lazy(() => import("./pages/PermutationsCombinationsVisualizer"));
const PolarCoordinatesVisualizer = lazy(() => import("./pages/PolarCoordinatesVisualizer"));
const ProbabilityStatistics = lazy(() => import("./pages/ProbabilityStatistics"));
const Quiz = lazy(() => import("./pages/Quiz"));
const ScientificCalculator = lazy(() => import("./pages/ScientificCalculator"));
const SetTheory = lazy(() => import("./pages/SetTheory"));
const ShapesExplorer = lazy(() => import("./pages/ShapesExplorer"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const SlopeFieldsVisualizerPage = lazy(() => import("./pages/SlopeFieldsVisualizerPage"));
const SpacedRepetitionQuiz = lazy(() => import("./pages/SpacedRepetitionQuiz"));
const StepByStepProblemSolver = lazy(() => import("./pages/StepByStepProblemSolver"));
const SurfacePlotter3D = lazy(() => import("./pages/SurfacePlotter3D"));
const Syllabus = lazy(() => import("./pages/Syllabus"));
const SyllabusVisualPage = lazy(() => import("./pages/SyllabusVisualPage"));
const Theorems = lazy(() => import("./pages/Theorems"));
const Trigonometry = lazy(() => import("./pages/Trigonometry"));
const TrigonometryConceptPage = lazy(() => import("./pages/TrigonometryConceptPage"));
const TrigFormulaVisualizerPage = lazy(() => import("./trigonometry/pages/TrigFormulaVisualizerPage"));
const TruthTableGenerator = lazy(() => import("./pages/TruthTableGenerator"));
const UnitConverter = lazy(() => import("./pages/UnitConverter"));
const VisualShowcase = lazy(() => import("./pages/VisualShowcase"));
const VisualProofsHomePage = lazy(() => import("./visual-proofs/pages/VisualProofsHomePage"));
const VisualProofCategoryPage = lazy(() => import("./visual-proofs/pages/VisualProofCategoryPage"));
const VisualProofPage = lazy(() => import("./visual-proofs/pages/VisualProofPage"));
const WorkedExamplesLibrary = lazy(() => import("./pages/WorkedExamplesLibrary"));
const Workspace3D = lazy(() => import("./pages/Workspace3D"));
const WorkspaceData = lazy(() => import("./pages/WorkspaceData"));
const WorkspaceGeometry = lazy(() => import("./pages/WorkspaceGeometry"));
const WorkspaceGraph = lazy(() => import("./pages/WorkspaceGraph"));
const WorkspaceTeach = lazy(() => import("./pages/WorkspaceTeach"));

type AppErrorBoundaryProps = { children: ReactNode };
type AppErrorBoundaryState = { hasError: boolean };

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
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
  return (
    <AppErrorBoundary>
      <SeoMetadata />
      <RouteProgressBar />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
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
