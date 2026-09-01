import AdapterFrame from "../components/AdapterFrame";
import ReusableLessonEngine, {
  reusableEngineParamsFor,
} from "../components/ReusableLessonEngine";
import type { LessonAdapterProps } from "../types";
import { SolidNetActivity } from "./p0/PriorityConceptActivities";
import CoordinateSystemTargetLesson378 from "./geometry3d/CoordinateSystemTargetLesson378";
import PointsTargetLesson379 from "./geometry3d/PointsTargetLesson379";
import DistanceTargetLesson380 from "./geometry3d/DistanceTargetLesson380";
import LinesTargetLesson381 from "./geometry3d/LinesTargetLesson381";
import PlanesTargetLesson382 from "./geometry3d/PlanesTargetLesson382";
import ParallelPlanesTargetLesson383 from "./geometry3d/ParallelPlanesTargetLesson383";
import LinePlaneTargetLesson384 from "./geometry3d/LinePlaneTargetLesson384";
import PlanePlaneTargetLesson385 from "./geometry3d/PlanePlaneTargetLesson385";
import AngleLinesTargetLesson386 from "./geometry3d/AngleLinesTargetLesson386";
import AnglePlanesTargetLesson387 from "./geometry3d/AnglePlanesTargetLesson387";
import AngleLinePlaneTargetLesson388 from "./geometry3d/AngleLinePlaneTargetLesson388";
import PointPlaneDistanceTargetLesson389 from "./geometry3d/PointPlaneDistanceTargetLesson389";
import VectorsTargetLesson390 from "./geometry3d/VectorsTargetLesson390";
import CubeTargetLesson391 from "./geometry3d/CubeTargetLesson391";
import CuboidTargetLesson392 from "./geometry3d/CuboidTargetLesson392";
import PrismTargetLesson393 from "./geometry3d/PrismTargetLesson393";
import PyramidTargetLesson394 from "./geometry3d/PyramidTargetLesson394";
import TetrahedronTargetLesson395 from "./geometry3d/TetrahedronTargetLesson395";
import RegularPolyhedraTargetLesson396 from "./geometry3d/RegularPolyhedraTargetLesson396";
import CylinderTargetLesson397 from "./geometry3d/CylinderTargetLesson397";
import ConeTargetLesson398 from "./geometry3d/ConeTargetLesson398";
import SphereTargetLesson399 from "./geometry3d/SphereTargetLesson399";
import HemisphereTargetLesson400 from "./geometry3d/HemisphereTargetLesson400";
import FrustumTargetLesson401 from "./geometry3d/FrustumTargetLesson401";
import SurfaceRevolutionTargetLesson402 from "./geometry3d/SurfaceRevolutionTargetLesson402";
import ExtrusionTargetLesson403 from "./geometry3d/ExtrusionTargetLesson403";
import NetsSolidsTargetLesson404 from "./geometry3d/NetsSolidsTargetLesson404";
import CrossSectionsTargetLesson405 from "./geometry3d/CrossSectionsTargetLesson405";

export default function Geometry3DLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.id === 378)
    return <CoordinateSystemTargetLesson378 {...props} />;
  if (props.lesson.id === 379) return <PointsTargetLesson379 {...props} />;
  if (props.lesson.id === 380) return <DistanceTargetLesson380 {...props} />;
  if (props.lesson.id === 381) return <LinesTargetLesson381 {...props} />;
  if (props.lesson.id === 382) return <PlanesTargetLesson382 {...props} />;
  if (props.lesson.id === 383)
    return <ParallelPlanesTargetLesson383 {...props} />;
  if (props.lesson.id === 384) return <LinePlaneTargetLesson384 {...props} />;
  if (props.lesson.id === 385) return <PlanePlaneTargetLesson385 {...props} />;
  if (props.lesson.id === 386) return <AngleLinesTargetLesson386 {...props} />;
  if (props.lesson.id === 387) return <AnglePlanesTargetLesson387 {...props} />;
  if (props.lesson.id === 388)
    return <AngleLinePlaneTargetLesson388 {...props} />;
  if (props.lesson.id === 389)
    return <PointPlaneDistanceTargetLesson389 {...props} />;
  if (props.lesson.id === 390) return <VectorsTargetLesson390 {...props} />;
  if (props.lesson.id === 391) return <CubeTargetLesson391 {...props} />;
  if (props.lesson.id === 392) return <CuboidTargetLesson392 {...props} />;
  if (props.lesson.id === 393) return <PrismTargetLesson393 {...props} />;
  if (props.lesson.id === 394) return <PyramidTargetLesson394 {...props} />;
  if (props.lesson.id === 395) return <TetrahedronTargetLesson395 {...props} />;
  if (props.lesson.id === 396)
    return <RegularPolyhedraTargetLesson396 {...props} />;
  if (props.lesson.id === 397) return <CylinderTargetLesson397 {...props} />;
  if (props.lesson.id === 398) return <ConeTargetLesson398 {...props} />;
  if (props.lesson.id === 399) return <SphereTargetLesson399 {...props} />;
  if (props.lesson.id === 400) return <HemisphereTargetLesson400 {...props} />;
  if (props.lesson.id === 401) return <FrustumTargetLesson401 {...props} />;
  if (props.lesson.id === 402)
    return <SurfaceRevolutionTargetLesson402 {...props} />;
  if (props.lesson.id === 403) return <ExtrusionTargetLesson403 {...props} />;
  if (props.lesson.id === 404) return <NetsSolidsTargetLesson404 {...props} />;
  if (props.lesson.id === 405)
    return <CrossSectionsTargetLesson405 {...props} />;
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
