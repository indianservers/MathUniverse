import { Component, lazy, Suspense, useEffect, type ErrorInfo, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import SeoMetadata from "./components/seo/SeoMetadata";
import { ANVESHAK_STATISTICS_URL } from "./data/externalLinks";

const About = lazy(() => import("./pages/About"));
const AdvancedSyllabusLabPage = lazy(() => import("./pages/AdvancedSyllabusLabPage"));
const AlgebraicStructures = lazy(() => import("./pages/AlgebraicStructures"));
const AIApplications = lazy(() => import("./pages/AIApplications"));
const Algebra = lazy(() => import("./pages/Algebra"));
const Calculus = lazy(() => import("./pages/Calculus"));
const Combinatorics = lazy(() => import("./pages/Combinatorics"));
const ComplexNumbers = lazy(() => import("./pages/ComplexNumbers"));
const ConceptDependencyGraph = lazy(() => import("./pages/ConceptDependencyGraph"));
const DailyChallenge = lazy(() => import("./pages/DailyChallenge"));
const DerivativesTangentVisualizer = lazy(() => import("./pages/DerivativesTangentVisualizer"));
const Documentation = lazy(() => import("./pages/Documentation"));
const DiscreteWorld = lazy(() => import("./pages/DiscreteWorld"));
const EigenvectorsVisualizerPage = lazy(() => import("./pages/EigenvectorsVisualizerPage"));
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
const MathLabCasNotebook = lazy(() => import("./pages/MathLabCasNotebook"));
const MathLabFunctionExplorer = lazy(() => import("./pages/MathLabFunctionExplorer"));
const MathLabGraphingCalculator = lazy(() => import("./pages/MathLabGraphingCalculator"));
const MathLabLinearAlgebra = lazy(() => import("./pages/MathLabLinearAlgebra"));
const MathLabProbability = lazy(() => import("./pages/MathLabProbability"));
const MathLabSmartQuery = lazy(() => import("./pages/MathLabSmartQuery"));
const MathLabToolPage = lazy(() => import("./pages/MathLabToolPage"));
const MathVisualizationPage = lazy(() => import("./pages/MathVisualizationPage"));
const MathWorkspace = lazy(() => import("./pages/MathWorkspace"));
const MatrixOperationPage = lazy(() => import("./pages/MatrixOperationPage"));
const MatrixOperations = lazy(() => import("./pages/MatrixOperations"));
const MatrixOperationsSandbox = lazy(() => import("./pages/MatrixOperationsSandbox"));
const MatrixTransformationsVisualizerPage = lazy(() => import("./pages/MatrixTransformationsVisualizerPage"));
const NCERTConceptPage = lazy(() => import("./pages/NCERTConceptPage"));
const ParametricCurveExplorer = lazy(() => import("./pages/ParametricCurveExplorer"));
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
const Trigonometry = lazy(() => import("./pages/Trigonometry"));
const TrigonometryConceptPage = lazy(() => import("./pages/TrigonometryConceptPage"));
const TruthTableGenerator = lazy(() => import("./pages/TruthTableGenerator"));
const UnitConverter = lazy(() => import("./pages/UnitConverter"));
const WorkedExamplesLibrary = lazy(() => import("./pages/WorkedExamplesLibrary"));

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

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

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" aria-label="Loading" />
    </div>
  );
}

function ExternalStatisticsRedirect() {
  useEffect(() => {
    window.location.replace(ANVESHAK_STATISTICS_URL);
  }, []);

  return (
    <div className="p-6">
      <a className="action-primary" href={ANVESHAK_STATISTICS_URL}>
        Open Statistics in Anveshak
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <SeoMetadata />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="algebra" element={<Algebra />} />
            <Route path="algebraic-structures" element={<AlgebraicStructures />} />
            <Route path="math-lab" element={<MathLab />} />
            <Route path="math-lab/graphing-calculator" element={<MathLabGraphingCalculator />} />
            <Route path="math-lab/function-explorer" element={<MathLabFunctionExplorer />} />
            <Route path="math-lab/linear-algebra" element={<MathLabLinearAlgebra />} />
            <Route path="math-lab/3d-graphing" element={<MathLab3DGraphing />} />
            <Route path="math-lab/probability" element={<MathLabProbability />} />
            <Route path="math-lab/cas-solver" element={<MathLabCasNotebook />} />
            <Route path="math-lab/query" element={<MathLabSmartQuery />} />
            <Route path="math-lab/:toolId" element={<MathLabToolPage />} />
            <Route path="workspace" element={<MathWorkspace />} />
            <Route path="geometry" element={<Geometry />} />
            <Route path="geometry/:conceptId" element={<GeometryConceptPage />} />
            <Route path="shapes" element={<ShapesExplorer />} />
            <Route path="trigonometry" element={<Trigonometry />} />
            <Route path="trigonometry/:conceptId" element={<TrigonometryConceptPage />} />
            <Route path="calculus" element={<Calculus />} />
            <Route path="combinatorics" element={<Combinatorics />} />
            <Route path="complex-numbers" element={<ComplexNumbers />} />
            <Route path="set-theory" element={<SetTheory />} />
            <Route path="statistics" element={<ExternalStatisticsRedirect />} />
            <Route path="linear-algebra" element={<LinearAlgebra />} />
            <Route path="matrices" element={<MatrixOperations />} />
            <Route path="matrices/:operationId" element={<MatrixOperationPage />} />
            <Route path="matrix-sandbox" element={<MatrixOperationsSandbox />} />
            <Route path="ai-applications" element={<AIApplications />} />
            <Route path="learn" element={<LearningHub />} />
            <Route path="spaced-repetition" element={<SpacedRepetitionQuiz />} />
            <Route path="problem-solver" element={<StepByStepProblemSolver />} />
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
            <Route path="math/:visualizationId" element={<MathVisualizationPage />} />
            <Route path="ncert/:conceptId" element={<NCERTConceptPage />} />
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
