import AdapterFrame from "../components/AdapterFrame";
import ReusableLessonEngine, { reusableEngineParamsFor } from "../components/ReusableLessonEngine";
import { graphVisualPresetForLesson } from "../presets/graphVisualPresets";
import type { LessonAdapterProps } from "../types";

export default function GraphLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const params = graphVisualPresetForLesson(lesson.id) ?? reusableEngineParamsFor("graph-2d", lesson.title);
  return (
    <AdapterFrame title={`${lesson.title} - reusable 2D graph engine`} value={params.expression} footer="This lesson uses the shared graph engine in focused axis mode: no full workspace menus, only topic parameters and the graph area.">
      <ReusableLessonEngine engine="graph-2d" params={params} resetToken={resetToken} onInteraction={onInteraction} />
    </AdapterFrame>
  );
}
