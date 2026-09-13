import EigenvectorVisualizer from "../visualizations/linear-algebra/EigenvectorVisualizer";
import MatrixTransformationVisualizer from "../visualizations/linear-algebra/MatrixTransformationVisualizer";
import VectorVisualizer from "../visualizations/linear-algebra/VectorVisualizer";
import MockupStudioApp from "../studios/mockup/MockupStudioApp";

export default function LinearAlgebra() {
  return (
    <MockupStudioApp
      studioId="linear-algebra"
      extras={{
        vectors: <VectorVisualizer />,
        "linear-transforms": <MatrixTransformationVisualizer />,
        eigenvectors: <EigenvectorVisualizer />,
        playground: <MatrixTransformationVisualizer />,
      }}
    />
  );
}
