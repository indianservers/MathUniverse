import AdapterFrame from "../components/AdapterFrame";
import ReusableLessonEngine, { reusableEngineParamsFor } from "../components/ReusableLessonEngine";
import type { LessonAdapterProps } from "../types";

export default function Geometry2DLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const params = reusableEngineParamsFor("geometry-2d", lesson.title);
  return (
    <AdapterFrame title={`${lesson.title} - reusable 2D geometry engine`} value={params.isTransform ? "Transforming construction" : "Measured construction"} footer={`Focused geometry workspace with ${params.tools?.join(", ") ?? "point, segment, measure"} tools only.`}>
      <ReusableLessonEngine engine="geometry-2d" params={params} resetToken={resetToken} onInteraction={onInteraction} />
    </AdapterFrame>
  );
}
