import type { ReactNode } from "react";
import type { LessonAdapterProps } from "../types";
import RayTargetLesson from "./RayTargetLesson206";
import PolylineTargetLesson from "./PolylineTargetLesson207";
import PerpendicularLineTargetLesson from "./PerpendicularLineTargetLesson208";
import ParallelLineTargetLesson from "./ParallelLineTargetLesson209";
import PerpendicularBisectorTargetLesson from "./PerpendicularBisectorTargetLesson210";
import AngleBisectorTargetLesson from "./AngleBisectorTargetLesson211";
import TangentTargetLesson from "./TangentTargetLesson212";
import BestFitLineTargetLesson from "./BestFitLineTargetLesson213";
import TriangleConstructorTargetLesson from "./TriangleConstructorTargetLesson214";
import RegularPolygonTargetLesson from "./RegularPolygonTargetLesson215";
import RigidPolygonTargetLesson from "./RigidPolygonTargetLesson216";
import GeneralPolygonTargetLesson from "./GeneralPolygonTargetLesson217";
import CircleCentrePointTargetLesson from "./CircleCentrePointTargetLesson218";
import CircleCentreRadiusTargetLesson from "./CircleCentreRadiusTargetLesson219";
import CircleThreePointsTargetLesson from "./CircleThreePointsTargetLesson220";
import CompassTargetLesson from "./CompassTargetLesson221";
import SemicircleTargetLesson from "./SemicircleTargetLesson222";
import CircularArcTargetLesson from "./CircularArcTargetLesson223";
import CircumcircularArcTargetLesson from "./CircumcircularArcTargetLesson224";
import CircularSectorTargetLesson from "./CircularSectorTargetLesson225";
import ConicFivePointsTargetLesson from "./ConicFivePointsTargetLesson226";
import EllipseTargetLesson from "./EllipseTargetLesson227";
import HyperbolaTargetLesson from "./HyperbolaTargetLesson228";
import ParabolaTargetLesson from "./ParabolaTargetLesson229";
import DistanceLengthTargetLesson from "./DistanceLengthTargetLesson230";
import AreaTargetLesson from "./AreaTargetLesson231";
import AngleTargetLesson from "./AngleTargetLesson232";
import FixedAngleTargetLesson from "./FixedAngleTargetLesson233";
import RelationCheckerTargetLesson from "./RelationCheckerTargetLesson234";
import ConstructionStepsTargetLesson from "./ConstructionStepsTargetLesson235";

const components: Record<number, (props: LessonAdapterProps) => ReactNode> = {
  206: RayTargetLesson,
  207: PolylineTargetLesson,
  208: PerpendicularLineTargetLesson,
  209: ParallelLineTargetLesson,
  210: PerpendicularBisectorTargetLesson,
  211: AngleBisectorTargetLesson,
  212: TangentTargetLesson,
  213: BestFitLineTargetLesson,
  214: TriangleConstructorTargetLesson,
  215: RegularPolygonTargetLesson,
  216: RigidPolygonTargetLesson,
  217: GeneralPolygonTargetLesson,
  218: CircleCentrePointTargetLesson,
  219: CircleCentreRadiusTargetLesson,
  220: CircleThreePointsTargetLesson,
  221: CompassTargetLesson,
  222: SemicircleTargetLesson,
  223: CircularArcTargetLesson,
  224: CircumcircularArcTargetLesson,
  225: CircularSectorTargetLesson,
  226: ConicFivePointsTargetLesson,
  227: EllipseTargetLesson,
  228: HyperbolaTargetLesson,
  229: ParabolaTargetLesson,
  230: DistanceLengthTargetLesson,
  231: AreaTargetLesson,
  232: AngleTargetLesson,
  233: FixedAngleTargetLesson,
  234: RelationCheckerTargetLesson,
  235: ConstructionStepsTargetLesson,
};

export function remainingGeometryTargetForLesson(props: LessonAdapterProps) {
  const Component = components[props.lesson.id];
  return Component ? <Component {...props} /> : null;
}
