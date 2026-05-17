import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import About from "./pages/About";
import AIApplications from "./pages/AIApplications";
import Algebra from "./pages/Algebra";
import Calculus from "./pages/Calculus";
import ComplexNumbers from "./pages/ComplexNumbers";
import Geometry from "./pages/Geometry";
import Home from "./pages/Home";
import LinearAlgebra from "./pages/LinearAlgebra";
import Quiz from "./pages/Quiz";
import Statistics from "./pages/Statistics";
import Trigonometry from "./pages/Trigonometry";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="algebra" element={<Algebra />} />
        <Route path="geometry" element={<Geometry />} />
        <Route path="trigonometry" element={<Trigonometry />} />
        <Route path="calculus" element={<Calculus />} />
        <Route path="complex-numbers" element={<ComplexNumbers />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="linear-algebra" element={<LinearAlgebra />} />
        <Route path="ai-applications" element={<AIApplications />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
