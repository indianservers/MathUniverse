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
import FunctionsGraphsVisualizer from "./pages/FunctionsGraphsVisualizer";
import Geometry from "./pages/Geometry";
import GeometryConceptPage from "./pages/GeometryConceptPage";
import Home from "./pages/Home";
import IntegrationAreaVisualizerPage from "./pages/IntegrationAreaVisualizerPage";
import LearningHub from "./pages/LearningHub";
import LinearAlgebra from "./pages/LinearAlgebra";
import LimitsContinuityVisualizer from "./pages/LimitsContinuityVisualizer";
import MathVisualizationPage from "./pages/MathVisualizationPage";
import MatrixTransformationsVisualizerPage from "./pages/MatrixTransformationsVisualizerPage";
import MathWorkspace from "./pages/MathWorkspace";
import NCERTConceptPage from "./pages/NCERTConceptPage";
import Quiz from "./pages/Quiz";
import ScientificCalculator from "./pages/ScientificCalculator";
import ShapesExplorer from "./pages/ShapesExplorer";
import Sitemap from "./pages/Sitemap";
import SlopeFieldsVisualizerPage from "./pages/SlopeFieldsVisualizerPage";
import Syllabus from "./pages/Syllabus";
import Trigonometry from "./pages/Trigonometry";
import TrigonometryConceptPage from "./pages/TrigonometryConceptPage";
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
          <Route path="ai-applications" element={<AIApplications />} />
          <Route path="learn" element={<LearningHub />} />
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
