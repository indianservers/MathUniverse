import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import AppLayout from "./components/layout/AppLayout";
import SeoMetadata from "./components/seo/SeoMetadata";
import About from "./pages/About";
import AdvancedSyllabusLabPage from "./pages/AdvancedSyllabusLabPage";
import AIApplications from "./pages/AIApplications";
import Algebra from "./pages/Algebra";
import Calculus from "./pages/Calculus";
import ComplexNumbers from "./pages/ComplexNumbers";
import DerivativesTangentVisualizer from "./pages/DerivativesTangentVisualizer";
import Documentation from "./pages/Documentation";
import EigenvectorsVisualizerPage from "./pages/EigenvectorsVisualizerPage";
import FourierSeriesVisualizerPage from "./pages/FourierSeriesVisualizerPage";
import FourierSeriesAnimator from "./pages/FourierSeriesAnimator";
import FunctionsGraphsVisualizer from "./pages/FunctionsGraphsVisualizer";
import GraphComparisonMode from "./pages/GraphComparisonMode";
import Geometry from "./pages/Geometry";
import GeometryConceptPage from "./pages/GeometryConceptPage";
import Home from "./pages/Home";
import IntegrationAreaVisualizerPage from "./pages/IntegrationAreaVisualizerPage";
import LearningHub from "./pages/LearningHub";
import LinearAlgebra from "./pages/LinearAlgebra";
import LimitsContinuityVisualizer from "./pages/LimitsContinuityVisualizer";
import MathVisualizationPage from "./pages/MathVisualizationPage";
import MathLab3DGraphing from "./pages/MathLab3DGraphing";
import MathLab from "./pages/MathLab";
import MathLabFunctionExplorer from "./pages/MathLabFunctionExplorer";
import MathLabGraphingCalculator from "./pages/MathLabGraphingCalculator";
import MathLabLinearAlgebra from "./pages/MathLabLinearAlgebra";
import MathLabToolPage from "./pages/MathLabToolPage";
import MatrixTransformationsVisualizerPage from "./pages/MatrixTransformationsVisualizerPage";
import MatrixOperationsSandbox from "./pages/MatrixOperationsSandbox";
import MatrixOperations from "./pages/MatrixOperations";
import MatrixOperationPage from "./pages/MatrixOperationPage";
import MathWorkspace from "./pages/MathWorkspace";
import NCERTConceptPage from "./pages/NCERTConceptPage";
import ConceptDependencyGraph from "./pages/ConceptDependencyGraph";
import DailyChallenge from "./pages/DailyChallenge";
import ParametricCurveExplorer from "./pages/ParametricCurveExplorer";
import PolarCoordinatesVisualizer from "./pages/PolarCoordinatesVisualizer";
import ProbabilityStatistics from "./pages/ProbabilityStatistics";
import Quiz from "./pages/Quiz";
import ScientificCalculator from "./pages/ScientificCalculator";
import ShapesExplorer from "./pages/ShapesExplorer";
import Sitemap from "./pages/Sitemap";
import SlopeFieldsVisualizerPage from "./pages/SlopeFieldsVisualizerPage";
import SpacedRepetitionQuiz from "./pages/SpacedRepetitionQuiz";
import StepByStepProblemSolver from "./pages/StepByStepProblemSolver";
import SurfacePlotter3D from "./pages/SurfacePlotter3D";
import Syllabus from "./pages/Syllabus";
import Trigonometry from "./pages/Trigonometry";
import TrigonometryConceptPage from "./pages/TrigonometryConceptPage";
import TruthTableGenerator from "./pages/TruthTableGenerator";
import UnitConverter from "./pages/UnitConverter";
import WorkedExamplesLibrary from "./pages/WorkedExamplesLibrary";
import { ANVESHAK_STATISTICS_URL } from "./data/externalLinks";

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
    <>
      <SeoMetadata />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="algebra" element={<Algebra />} />
          <Route path="math-lab" element={<MathLab />} />
          <Route path="math-lab/graphing-calculator" element={<MathLabGraphingCalculator />} />
          <Route path="math-lab/function-explorer" element={<MathLabFunctionExplorer />} />
          <Route path="math-lab/linear-algebra" element={<MathLabLinearAlgebra />} />
          <Route path="math-lab/3d-graphing" element={<MathLab3DGraphing />} />
          <Route path="math-lab/:toolId" element={<MathLabToolPage />} />
          <Route path="workspace" element={<MathWorkspace />} />
          <Route path="geometry" element={<Geometry />} />
          <Route path="geometry/:conceptId" element={<GeometryConceptPage />} />
          <Route path="shapes" element={<ShapesExplorer />} />
          <Route path="trigonometry" element={<Trigonometry />} />
          <Route path="trigonometry/:conceptId" element={<TrigonometryConceptPage />} />
          <Route path="calculus" element={<Calculus />} />
          <Route path="complex-numbers" element={<ComplexNumbers />} />
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
          <Route path="parametric-curves" element={<ParametricCurveExplorer />} />
          <Route path="surface-plotter" element={<SurfacePlotter3D />} />
          <Route path="fourier-animator" element={<FourierSeriesAnimator />} />
          <Route path="polar-visualizer" element={<PolarCoordinatesVisualizer />} />
          <Route path="unit-converter" element={<UnitConverter />} />
          <Route path="probability-statistics" element={<ProbabilityStatistics />} />
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
    </>
  );
}
