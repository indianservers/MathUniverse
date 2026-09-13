import MockupStudioApp from "../studios/mockup/MockupStudioApp";
import ComplexMultiplicationVisualizer from "../visualizations/complex/ComplexMultiplicationVisualizer";
import ComplexPlaneVisualizer from "../visualizations/complex/ComplexPlaneVisualizer";
import EulerFormula2D from "../visualizations/complex/EulerFormula2D";

export default function ComplexNumbers() {
  return (
    <MockupStudioApp
      studioId="complex-numbers"
      extras={{
        "argand-plane": <ComplexPlaneVisualizer />,
        rotation: <ComplexMultiplicationVisualizer />,
        euler: <EulerFormula2D />,
      }}
    />
  );
}
