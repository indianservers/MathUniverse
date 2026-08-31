import AdapterFrame from "../components/AdapterFrame";
import ReusableLessonEngine, {
  reusableEngineParamsFor,
} from "../components/ReusableLessonEngine";
import type { LessonAdapterProps } from "../types";
import { SolidNetActivity } from "./p0/PriorityConceptActivities";
import CoordinateSystemTargetLesson378 from "./geometry3d/CoordinateSystemTargetLesson378";
import PointsTargetLesson379 from "./geometry3d/PointsTargetLesson379";
import DistanceTargetLesson380 from "./geometry3d/DistanceTargetLesson380";

export default function Geometry3DLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.id === 378)
    return <CoordinateSystemTargetLesson378 {...props} />;
  if (props.lesson.id === 379) return <PointsTargetLesson379 {...props} />;
  if (props.lesson.id === 380) return <DistanceTargetLesson380 {...props} />;
  if (props.lesson.preset.id === "geometry3d.solid-net") {
    return (
      <AdapterFrame
        title={`${props.lesson.title} - linked 2D/3D net`}
        footer="Selecting or folding a face updates the linked net and solid representation."
      >
        <SolidNetActivity {...props} />
      </AdapterFrame>
    );
  }

  const surfaceLesson =
    /contour|gradient|tangent plane|partial derivative|multivariable|level curve|level surface|z=f\(x,y\)|implicit surface|parametric surface|space curve|quadric|cylindrical coordinates|spherical coordinates|normal vector/i.test(
      props.lesson.title,
    );
  const engine = surfaceLesson ? "graph-3d" : "geometry-3d";
  const params = reusableEngineParamsFor(engine, props.lesson.title);

  return (
    <AdapterFrame
      title={`${props.lesson.title} - reusable ${surfaceLesson ? "3D graph" : "spatial"} engine`}
      value={surfaceLesson ? params.surfaceExpression : params.solid}
      footer="This embeds only the reusable 3D axis workspace area with lesson parameters, not the full studio menu."
    >
      <ReusableLessonEngine
        engine={engine}
        params={params}
        resetToken={props.resetToken}
        onInteraction={props.onInteraction}
      />
    </AdapterFrame>
  );
}
