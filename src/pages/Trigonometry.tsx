import MockupStudioApp from "../studios/mockup/MockupStudioApp";
import TrigonometryMathLab from "../visualizations/trigonometry/TrigonometryMathLab";

export default function Trigonometry() {
  return (
    <MockupStudioApp
      studioId="trigonometry"
      extras={{
        "unit-circle": <TrigonometryMathLab compact />,
        graphs: <TrigonometryMathLab compact />,
        waves: <TrigonometryMathLab compact />,
      }}
    />
  );
}
