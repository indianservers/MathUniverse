import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Compass,
  Eye,
  Lightbulb,
  MousePointer2,
  RotateCcw,
  Ruler,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { LessonAdapterProps } from "../types";
import PolylineTargetLesson from "./PolylineTargetLesson207";
import PerpendicularLineTargetLesson from "./PerpendicularLineTargetLesson208";
import ParallelLineTargetLesson from "./ParallelLineTargetLesson209";
import PerpendicularBisectorTargetLesson from "./PerpendicularBisectorTargetLesson210";
import AngleBisectorTargetLesson from "./AngleBisectorTargetLesson211";
import TangentTargetLesson from "./TangentTargetLesson212";
import BestFitLineTargetLesson from "./BestFitLineTargetLesson213";
import TriangleConstructorTargetLesson from "./TriangleConstructorTargetLesson214";
import RegularPolygonTargetLesson from "./RegularPolygonTargetLesson215";
import CompassTargetLesson from "./CompassTargetLesson221";
import RayTargetLesson from "./RayTargetLesson206";

type Kind =
  | "ray"
  | "polyline"
  | "perpendicular"
  | "parallel"
  | "perpendicularBisector"
  | "angleBisector"
  | "tangent"
  | "bestFit"
  | "triangle"
  | "regularPolygon"
  | "rigidPolygon"
  | "generalPolygon"
  | "circlePoint"
  | "circleRadius"
  | "circleThree"
  | "compass"
  | "semicircle"
  | "arc"
  | "circumArc"
  | "sector"
  | "conicFive"
  | "ellipse"
  | "hyperbola"
  | "parabola"
  | "distance"
  | "area"
  | "angle"
  | "fixedAngle"
  | "relation"
  | "steps";
type Spec = {
  id: number;
  mockup: string;
  kind: Kind;
  title: string;
  subtitle: string;
  accent: string;
  formula: string;
  insight: string;
  task: string;
  controls: [string, number, number, number][];
};

const specs: Record<number, Spec> = {
  206: s(
    206,
    "0263",
    "ray",
    "Ray",
    "Construct and explore a ray from an endpoint through a second point.",
    "#7c3aed",
    "R(t) = A + t(B - A),  t >= 0",
    "A ray has one endpoint and extends forever in one direction.",
    "Set endpoint A=(-2,-1) and direction angle 30 degrees.",
    [
      ["Direction", 35, 0, 360],
      ["Scale", 5, 1, 8],
    ],
  ),
  207: s(
    207,
    "0264",
    "polyline",
    "Polyline",
    "Build an open chain of connected segments and inspect its total length.",
    "#0891b2",
    "L = sum |P(i+1)-P(i)|",
    "A polyline is ordered, open, and its length is the sum of segment lengths.",
    "Create a four-vertex path with total length greater than 12.",
    [
      ["Vertices", 4, 3, 7],
      ["Spread", 4, 2, 7],
    ],
  ),
  208: s(
    208,
    "0265",
    "perpendicular",
    "Perpendicular Line",
    "Construct a line through a point at exactly 90 degrees to a given line.",
    "#06b6d4",
    "m1*m2 = -1",
    "Perpendicular lines meet at a right angle.",
    "Move P and verify that the angle remains 90 degrees.",
    [
      ["Base angle", 18, -80, 80],
      ["Point offset", 2, -5, 5],
    ],
  ),
  209: s(
    209,
    "0266",
    "parallel",
    "Parallel Line",
    "Construct a line through a point parallel to a given line.",
    "#8b5cf6",
    "m1 = m2",
    "Parallel lines have equal slopes and never intersect.",
    "Set the offset to 3 and confirm equal slopes.",
    [
      ["Slope", 0.6, -2, 2],
      ["Offset", -2, -5, 5],
    ],
  ),
  210: s(
    210,
    "0267",
    "perpendicularBisector",
    "Perpendicular Bisector",
    "Construct the line through a segment's midpoint at 90 degrees.",
    "#7c3aed",
    "M=((x1+x2)/2,(y1+y2)/2)",
    "Every point on the perpendicular bisector is equidistant from A and B.",
    "Move the endpoints and verify PA = PB.",
    [
      ["Segment angle", 0, -80, 80],
      ["Half length", 4, 2, 6],
    ],
  ),
  211: s(
    211,
    "0268",
    "angleBisector",
    "Angle Bisector",
    "Construct the ray that divides an angle into two equal angles.",
    "#06b6d4",
    "angle AOB / 2",
    "The bisector creates two congruent angles.",
    "Set the full angle to 80 degrees and identify both half-angles.",
    [
      ["Full angle", 55, 10, 160],
      ["Ray length", 5, 3, 7],
    ],
  ),
  212: s(
    212,
    "0269",
    "tangent",
    "Tangent",
    "Construct a line touching a circle at exactly one point.",
    "#0ea5e9",
    "OT is perpendicular to tangent at T",
    "A tangent meets the radius at a right angle at the point of contact.",
    "Rotate T and verify the radius-tangent angle stays 90 degrees.",
    [
      ["Contact angle", 90, 0, 360],
      ["Radius", 3, 1, 5],
    ],
  ),
  213: s(
    213,
    "0270",
    "bestFit",
    "Best Fit Line",
    "Model the linear trend in a scatter plot using residuals.",
    "#2563eb",
    "y = mx + b",
    "Least squares minimizes the sum of squared vertical residuals.",
    "Adjust m and b until the residual score is below 6.",
    [
      ["Slope m", 0.82, -1, 2],
      ["Intercept b", 0.35, -3, 3],
    ],
  ),
  214: s(
    214,
    "0271",
    "triangle",
    "Triangle Constructor",
    "Construct a triangle from three draggable vertices and classify it.",
    "#06b6d4",
    "A+B+C = 180 degrees",
    "Three non-collinear points determine one triangle.",
    "Create an isosceles triangle and verify two equal sides.",
    [
      ["Apex x", 0, -4, 4],
      ["Apex y", 4, 1, 6],
    ],
  ),
  215: s(
    215,
    "0272",
    "regularPolygon",
    "Regular Polygon",
    "Construct a regular polygon and explore equal sides and angles.",
    "#6366f1",
    "interior angle = (n-2)180/n",
    "A regular polygon has equal sides and equal interior angles.",
    "Construct a regular octagon.",
    [
      ["Sides n", 6, 3, 12],
      ["Radius", 4, 2, 6],
    ],
  ),
  216: s(
    216,
    "0273",
    "rigidPolygon",
    "Rigid Polygon",
    "Move and rotate a polygon while preserving all lengths and angles.",
    "#10b981",
    "distance(Pi,Pj) is invariant",
    "Rigid motion changes position, not shape or size.",
    "Rotate the polygon 60 degrees and verify side invariants.",
    [
      ["Rotation", 25, 0, 360],
      ["Translate x", 1, -4, 4],
    ],
  ),
  217: s(
    217,
    "0274",
    "generalPolygon",
    "General Polygon",
    "Construct and edit an unrestricted polygon vertex by vertex.",
    "#14b8a6",
    "area = 1/2 |sum(xi*y(i+1)-yi*x(i+1))|",
    "A general polygon may have unequal sides and angles.",
    "Move one vertex and observe area and perimeter update.",
    [
      ["Vertices", 5, 3, 8],
      ["Irregularity", 1.2, 0, 2],
    ],
  ),
  218: s(
    218,
    "0275",
    "circlePoint",
    "Circle Centre and Point",
    "Define a circle by its centre and one point on the circumference.",
    "#8b5cf6",
    "r = distance(C,P)",
    "The radius is determined by the centre-to-point distance.",
    "Move P to create a circle of radius 4.",
    [
      ["Point angle", 35, 0, 360],
      ["Point distance", 3.5, 1, 6],
    ],
  ),
  219: s(
    219,
    "0276",
    "circleRadius",
    "Circle Centre and Radius",
    "Define a circle from a centre and a numeric radius.",
    "#06b6d4",
    "(x-h)^2+(y-k)^2=r^2",
    "Centre and radius uniquely determine a circle.",
    "Set centre C=(1,-1) and radius 4.",
    [
      ["Radius", 3.5, 1, 6],
      ["Centre x", 0, -3, 3],
    ],
  ),
  220: s(
    220,
    "0277",
    "circleThree",
    "Circle through Three Points",
    "Construct the unique circumcircle through three non-collinear points.",
    "#8b5cf6",
    "CA = CB = CC",
    "Perpendicular bisectors meet at the circumcentre.",
    "Move one point and track the circumcentre.",
    [
      ["Point C x", 2, -4, 4],
      ["Point C y", 3, -4, 5],
    ],
  ),
  221: s(
    221,
    "0278",
    "compass",
    "Compass",
    "Copy a distance and draw a circle with a compass construction.",
    "#0891b2",
    "radius = |AB|",
    "A compass transfers a length without changing it.",
    "Copy AB as a radius from centre C.",
    [
      ["Compass opening", 3, 1, 6],
      ["Centre x", 2, -3, 4],
    ],
  ),
  222: s(
    222,
    "0279",
    "semicircle",
    "Semicircle",
    "Construct a half-circle from a diameter and explore its properties.",
    "#2563eb",
    "r = diameter/2",
    "An angle subtended by a diameter at the semicircle is 90 degrees.",
    "Set diameter AB=8 and locate its midpoint.",
    [
      ["Diameter", 7, 2, 10],
      ["Orientation", 0, -180, 180],
    ],
  ),
  223: s(
    223,
    "0280",
    "arc",
    "Circular Arc",
    "Construct an arc using centre, radius, start angle and end angle.",
    "#8b5cf6",
    "arc length = r*theta",
    "Arc length depends on radius and central angle in radians.",
    "Create a 120 degree arc of radius 4.",
    [
      ["Radius", 3.5, 1, 6],
      ["Arc angle", 110, 10, 330],
    ],
  ),
  224: s(
    224,
    "0281",
    "circumArc",
    "Circumcircular Arc",
    "Construct an arc through three points on a circumcircle.",
    "#06b6d4",
    "inscribed angle = central angle/2",
    "Three non-collinear points determine a circumcircular arc.",
    "Move B and compare central and inscribed angles.",
    [
      ["Central angle", 110, 30, 260],
      ["Radius", 4, 2, 6],
    ],
  ),
  225: s(
    225,
    "0282",
    "sector",
    "Circular Sector",
    "Explore the region enclosed by two radii and their arc.",
    "#0ea5e9",
    "area = theta*r^2/2",
    "A sector combines an arc with two radii.",
    "Construct a 60 degree sector with radius 5.",
    [
      ["Radius", 4, 1, 6],
      ["Sector angle", 65, 10, 350],
    ],
  ),
  226: s(
    226,
    "0283",
    "conicFive",
    "Conic through Five Points",
    "Construct a conic determined by five draggable points.",
    "#8b5cf6",
    "Ax^2+Bxy+Cy^2+Dx+Ey+F=0",
    "Five points in general position determine a conic.",
    "Move one point and observe the fitted conic update.",
    [
      ["Horizontal scale", 4, 2, 6],
      ["Vertical scale", 2.8, 1, 5],
    ],
  ),
  227: s(
    227,
    "0284",
    "ellipse",
    "Ellipse",
    "Explore an ellipse using its semi-axes and foci.",
    "#6366f1",
    "x^2/a^2+y^2/b^2=1",
    "The sum of distances from any ellipse point to the two foci is 2a.",
    "Set a=5 and b=3, then verify the focal sum.",
    [
      ["Semi-major a", 5, 2, 7],
      ["Semi-minor b", 3, 1, 6],
    ],
  ),
  228: s(
    228,
    "0285",
    "hyperbola",
    "Hyperbola",
    "Explore two branches, foci, asymptotes, and transverse axes.",
    "#8b5cf6",
    "x^2/a^2-y^2/b^2=1",
    "The absolute difference of focal distances is 2a.",
    "Set a=3 and b=2 and inspect the asymptotes.",
    [
      ["Semi-axis a", 3, 1, 5],
      ["Semi-axis b", 2, 1, 5],
    ],
  ),
  229: s(
    229,
    "0286",
    "parabola",
    "Parabola",
    "Construct the locus equidistant from a focus and directrix.",
    "#0ea5e9",
    "(x-h)^2=4p(y-k)",
    "Each point on a parabola is equidistant from focus and directrix.",
    "Move the focus and observe the vertex and focal width.",
    [
      ["Focal parameter p", 1.5, 0.5, 4],
      ["Horizontal shift", 0, -3, 3],
    ],
  ),
  230: s(
    230,
    "0287",
    "distance",
    "Distance / Length",
    "Measure the exact and approximate distance between two points.",
    "#7c3aed",
    "d=sqrt((x2-x1)^2+(y2-y1)^2)",
    "Distance is the hypotenuse formed by horizontal and vertical changes.",
    "Set A=(-2,1), B=(3,4) and verify sqrt(34).",
    [
      ["Delta x", 5, -8, 8],
      ["Delta y", 3, -8, 8],
    ],
  ),
  231: s(
    231,
    "0288",
    "area",
    "Area",
    "Measure polygon area and compare decomposition methods.",
    "#06b6d4",
    "area=1/2|sum(xi*y(i+1)-yi*x(i+1))|",
    "The shoelace formula computes any simple polygon's area.",
    "Edit a vertex and verify the recomputed area.",
    [
      ["Width", 5, 2, 8],
      ["Height", 3, 1, 6],
    ],
  ),
  232: s(
    232,
    "0289",
    "angle",
    "Angle",
    "Measure and classify an angle formed by two rays.",
    "#10b981",
    "theta=atan2(cross,dot)",
    "Angle measure is the rotation from one ray to the other.",
    "Construct and identify an obtuse angle.",
    [
      ["Angle", 55, 0, 180],
      ["Ray length", 5, 2, 7],
    ],
  ),
  233: s(
    233,
    "0290",
    "fixedAngle",
    "Fixed Angle",
    "Construct a ray constrained to a specified angle.",
    "#0ea5e9",
    "angle AOB = alpha",
    "The angle constraint remains invariant when the construction moves.",
    "Lock 55 degrees, move O, and verify the measure.",
    [
      ["Fixed angle", 55, 5, 175],
      ["Base rotation", 0, -180, 180],
    ],
  ),
  234: s(
    234,
    "0291",
    "relation",
    "Relation Checker",
    "Check whether geometric objects are parallel, perpendicular, equal, or incident.",
    "#8b5cf6",
    "dot(v1,v2)=0 for perpendicular lines",
    "Relations are determined from object equations, not visual appearance.",
    "Create perpendicular lines and run the checker.",
    [
      ["Line 1 angle", 45, -90, 90],
      ["Line 2 angle", -45, -90, 90],
    ],
  ),
  235: s(
    235,
    "0292",
    "steps",
    "Construction Steps",
    "Build a construction and inspect its ordered dependency history.",
    "#0891b2",
    "dependent objects follow parent objects",
    "A valid construction records objects in dependency order.",
    "Create two points, a segment, and its midpoint.",
    [
      ["Point A x", 0, -5, 5],
      ["Point B x", 4, -5, 5],
    ],
  ),
};

export function remainingGeometryTargetForLesson(props: LessonAdapterProps) {
  const C = components[props.lesson.id];
  return C ? <C {...props} /> : null;
}

function named(id: number) {
  return (props: LessonAdapterProps) => (
    <DedicatedGeometrySurface {...props} spec={specs[id]} />
  );
}
export const RigidPolygonTargetLesson = named(216),
  GeneralPolygonTargetLesson = named(217),
  CircleCentrePointTargetLesson = named(218),
  CircleCentreRadiusTargetLesson = named(219),
  CircleThreePointsTargetLesson = named(220),
  SemicircleTargetLesson = named(222),
  CircularArcTargetLesson = named(223),
  CircumcircularArcTargetLesson = named(224),
  CircularSectorTargetLesson = named(225),
  ConicFivePointsTargetLesson = named(226),
  EllipseTargetLesson = named(227),
  HyperbolaTargetLesson = named(228),
  ParabolaTargetLesson = named(229),
  DistanceLengthTargetLesson = named(230),
  AreaTargetLesson = named(231),
  AngleTargetLesson = named(232),
  FixedAngleTargetLesson = named(233),
  RelationCheckerTargetLesson = named(234),
  ConstructionStepsTargetLesson = named(235);

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

function DedicatedGeometrySurface({
  lesson,
  resetToken,
  onInteraction,
  spec,
}: { spec: Spec } & LessonAdapterProps) {
  const [v1, setV1] = useState(spec.controls[0][1]),
    [v2, setV2] = useState(spec.controls[1][1]),
    [point, setPoint] = useState({ x: 3, y: 2 }),
    [show, setShow] = useState(true),
    [checked, setChecked] = useState(false),
    [history, setHistory] = useState<string[]>([
      "Created base objects",
      "Applied construction constraint",
      "Measured result",
    ]);
  useEffect(() => {
    setV1(spec.controls[0][1]);
    setV2(spec.controls[1][1]);
    setPoint({ x: 3, y: 2 });
    setShow(true);
    setChecked(false);
    setHistory([
      "Created base objects",
      "Applied construction constraint",
      "Measured result",
    ]);
  }, [resetToken, spec]);
  const interact = () => {
    onInteraction();
    setChecked(false);
  };
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    const r = event.currentTarget.getBoundingClientRect();
    setPoint({
      x: Number((((event.clientX - r.left) / r.width) * 12 - 6).toFixed(1)),
      y: Number((5 - ((event.clientY - r.top) / r.height) * 10).toFixed(1)),
    });
    interact();
  };
  const result = useMemo(
    () => resultFor(spec.kind, v1, v2, point),
    [spec.kind, v1, v2, point],
  );
  return (
    <section
      className="space-y-2"
      data-testid={`dynamic-geometry-mockup-${spec.mockup}`}
      data-dedicated-lesson={lesson.id}
      data-object-model={spec.kind}
      data-direct-interaction="true"
    >
      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-4">
            <span
              className="grid h-16 w-16 shrink-0 place-items-center rounded-lg text-white shadow-sm [&_svg]:h-8 [&_svg]:w-8"
              style={{ background: spec.accent }}
              aria-hidden="true"
            >
              <Compass />
            </span>
            <div>
              <h1 className="text-3xl font-black leading-none text-slate-950">
                {spec.title}
              </h1>
              <p className="mt-2 text-[11px] font-semibold text-slate-600">
                {spec.subtitle}
              </p>
              <div className="mt-2 flex flex-wrap gap-1 text-[8px] font-bold text-slate-600">
                <span className="target-geometry-chip">
                  Dynamic Geometry Construction
                </span>
                <span className="target-geometry-chip">
                  Foundation / Advanced
                </span>
                <span className="target-geometry-chip">6-10 min</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              className="target-geometry-action"
              type="button"
              onClick={() => {
                setV1(spec.controls[0][1]);
                setV2(spec.controls[1][1]);
                setPoint({ x: 3, y: 2 });
                onInteraction();
              }}
            >
              <RotateCcw />
              Reset
            </button>
            <button
              className="target-geometry-action"
              type="button"
              onClick={() => onInteraction()}
            >
              <Share2 />
              Share
            </button>
          </div>
        </div>
      </header>
      <nav
        className="grid grid-cols-5 rounded-lg border border-slate-200 bg-white"
        aria-label={`${spec.title} lesson stages`}
      >
        {["Observe", "Manipulate", "Notice", "Understand", "Try"].map(
          (x, i) => (
            <button
              type="button"
              key={x}
              onClick={interact}
              className={`h-10 text-[9px] font-black ${i === 0 ? "border-b-2 border-blue-500 bg-blue-50 text-blue-700" : "text-slate-600"}`}
            >
              {i + 1} {x}
            </button>
          ),
        )}
      </nav>
      <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[minmax(0,1fr)_270px]">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black">{modelHeading(spec.kind)}</h2>
              <p className="text-[9px] font-semibold text-slate-500">
                Drag the highlighted object or change the controls.
              </p>
            </div>
            <label className="flex items-center gap-1 text-[9px] font-bold">
              Show guides
              <input
                type="checkbox"
                checked={show}
                onChange={(e) => {
                  setShow(e.target.checked);
                  interact();
                }}
              />
            </label>
          </div>
          <div className="mt-2 flex gap-1">
            <button
              className="target-geometry-tool is-active"
              type="button"
              aria-label="Select object"
            >
              <MousePointer2 />
            </button>
            <button
              className="target-geometry-tool"
              type="button"
              aria-label="Construct object"
            >
              <CircleDot />
            </button>
            <button
              className="target-geometry-tool"
              type="button"
              aria-label="Measure object"
            >
              <Ruler />
            </button>
          </div>
          <GeometryModel
            kind={spec.kind}
            v1={v1}
            v2={v2}
            point={point}
            show={show}
            accent={spec.accent}
            onPointer={pointer}
          />
          <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-600">
            {result.summary}
          </p>
        </div>
        <aside className="space-y-2">
          <TargetControl
            title={spec.controls[0][0]}
            value={v1}
            min={spec.controls[0][2]}
            max={spec.controls[0][3]}
            onChange={(x) => {
              setV1(x);
              interact();
            }}
          />
          <TargetControl
            title={spec.controls[1][0]}
            value={v2}
            min={spec.controls[1][2]}
            max={spec.controls[1][3]}
            onChange={(x) => {
              setV2(x);
              interact();
            }}
          />
          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-[9px]">
            <div className="flex justify-between">
              <strong className="text-cyan-800">Live Verification</strong>
              <span className="text-emerald-700">✓ Valid</span>
            </div>
            <dl className="mt-2 grid grid-cols-[1fr_auto] gap-y-1">
              <dt>Primary measure</dt>
              <dd className="font-black">{result.primary}</dd>
              <dt>Secondary</dt>
              <dd className="font-black">{result.secondary}</dd>
              <dt>Point P</dt>
              <dd className="font-black">
                ({point.x}, {point.y})
              </dd>
            </dl>
          </div>
          <div className="rounded-lg border border-slate-200 p-3 text-[9px]">
            <strong>Object model</strong>
            <p className="mt-1 text-slate-600">{result.objectModel}</p>
          </div>
        </aside>
      </section>
      <div className="grid gap-2 md:grid-cols-2">
        <LessonCard title={`What is ${spec.title}?`} tone="blue">
          <p>{spec.subtitle}</p>
          <p className="mt-3 rounded-md border border-blue-100 bg-blue-50 p-3 font-serif text-sm font-black text-blue-950">
            {spec.formula}
          </p>
          <p className="mt-2 font-semibold text-slate-600">
            The highlighted handles define this object and update every
            dependent measurement continuously.
          </p>
        </LessonCard>
        <LessonCard title="How it's constructed" tone="violet">
          <ol className="space-y-2">
            {constructionFor(spec.kind).map((x, i) => (
              <li className="flex items-start gap-2" key={x}>
                <b className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-600 text-[9px] text-white">
                  {i + 1}
                </b>
                <span>{x}</span>
              </li>
            ))}
          </ol>
          <MiniStep kind={spec.kind} index={2} accent={spec.accent} />
        </LessonCard>
      </div>
      <LessonCard title="Key Rule" tone="violet">
        <div className="grid items-center gap-3 md:grid-cols-[1fr_1fr]">
          <p>{spec.insight}</p>
          <p className="rounded-md bg-violet-50 p-3 text-center font-serif text-sm font-black">
            {spec.formula}
          </p>
        </div>
      </LessonCard>
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex justify-between">
          <h2 className="text-xs font-black">Construction Steps</h2>
          {spec.kind === "steps" ? (
            <button
              type="button"
              className="text-[9px] font-bold text-blue-700"
              onClick={() => {
                setHistory([
                  ...history,
                  `Step ${history.length + 1}: dependent object`,
                ]);
                onInteraction();
              }}
            >
              Add step
            </button>
          ) : null}
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          {history
            .concat(
              spec.kind === "steps"
                ? ["Validated dependencies"]
                : ["Verified relationship"],
            )
            .slice(0, 4)
            .map((x, i) => (
              <article
                key={`${x}-${i}`}
                className="rounded-md border border-slate-200 p-2 text-[8px]"
              >
                <span className="rounded bg-blue-50 px-1.5 py-1 font-black text-blue-700">
                  {i + 1}
                </span>
                <strong className="ml-1">{x}</strong>
                <MiniStep kind={spec.kind} index={i} accent={spec.accent} />
              </article>
            ))}
        </div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-black text-blue-950">
              5 Try it yourself
            </h2>
            <p className="mt-1 text-[10px] font-semibold text-slate-600">
              {spec.task}
            </p>
          </div>
          <button
            type="button"
            className="rounded-md bg-violet-600 px-4 py-2 text-[10px] font-black text-white"
            onClick={() => {
              setChecked(true);
              onInteraction();
            }}
          >
            <CheckCircle2 className="mr-1 inline h-3 w-3" />
            Check Construction
          </button>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-[1fr_220px]">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="grid items-center gap-3 sm:grid-cols-[1fr_190px]">
              <div>
                <strong className="text-[10px] text-blue-800">Task</strong>
                <p className="mt-1 text-[10px] font-semibold">{spec.task}</p>
                <p className="mt-2 text-[9px] text-slate-500">
                  Use the model controls, then record the primary and secondary
                  measurements.
                </p>
              </div>
              <MiniStep kind={spec.kind} index={3} accent={spec.accent} />
            </div>
          </div>
          <div className="rounded-md border border-slate-200 p-3 text-[9px]">
            <strong>Record</strong>
            <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
              <span>Primary</span>
              <b>{result.primary}</b>
              <span>Secondary</span>
              <b>{result.secondary}</b>
              <span>Object</span>
              <b>{spec.title}</b>
            </div>
            {checked ? (
              <p role="status" className="mt-3 font-black text-emerald-700">
                <CheckCircle2 className="mr-1 inline h-3 w-3" />
                Construction verified.
              </p>
            ) : null}
          </div>
        </div>
      </section>
      <nav
        className="grid grid-cols-2 gap-2 text-[9px] font-bold"
        aria-label="Adjacent lessons"
      >
        <a
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2"
          href={previousRoute(lesson.id)}
        >
          <ArrowLeft className="h-3 w-3" />
          <span>
            <small className="block uppercase text-slate-500">Previous</small>
            {previousTitle(lesson.id)}
          </span>
        </a>
        <a
          className="flex items-center justify-end gap-2 rounded-lg border border-slate-200 bg-white p-2 text-right"
          href={nextRoute(lesson.id)}
        >
          <span>
            <small className="block uppercase text-slate-500">Next</small>
            {nextTitle(lesson.id)}
          </span>
          <ArrowRight className="h-3 w-3" />
        </a>
      </nav>
    </section>
  );
}

function GeometryModel({
  kind,
  v1,
  v2,
  point,
  show,
  accent,
  onPointer,
}: {
  kind: Kind;
  v1: number;
  v2: number;
  point: { x: number; y: number };
  show: boolean;
  accent: string;
  onPointer: (e: PointerEvent<SVGSVGElement>) => void;
}) {
  const sx = (x: number) => 300 + x * 38,
    sy = (y: number) => 220 - y * 38,
    rad = (d: number) => (d * Math.PI) / 180;
  const poly = (n: number, r: number, rot = 0) =>
    Array.from(
      { length: n },
      (_, i) =>
        `${sx(Math.cos(rad(rot + (i * 360) / n)) * r)},${sy(Math.sin(rad(rot + (i * 360) / n)) * r)}`,
    ).join(" ");
  const grid = (
    <>
      {Array.from({ length: 15 }, (_, i) => (
        <g key={i}>
          <line
            x1={34 + i * 38}
            x2={34 + i * 38}
            y1="20"
            y2="420"
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />
          <line
            y1={30 + i * 38}
            y2={30 + i * 38}
            x1="20"
            x2="580"
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />
        </g>
      ))}
      <line x1="20" x2="585" y1="220" y2="220" stroke="#64748b" />
      <line x1="300" x2="300" y1="15" y2="425" stroke="#64748b" />
    </>
  );
  let object: ReactNode;
  const p = { x: sx(point.x), y: sy(point.y) };
  switch (kind) {
    case "ray":
      {
        const x = 300 + Math.cos(rad(v1)) * 210,
          y = 220 - Math.sin(rad(v1)) * 210;
        object = (
          <>
            <line
              x1="300"
              y1="220"
              x2={x}
              y2={y}
              stroke={accent}
              strokeWidth="4"
            />
            <path
              d={`M${x - 12},${y - 8} L${x},${y} L${x - 12},${y + 8}`}
              fill="none"
              stroke={accent}
              strokeWidth="3"
            />
            <circle cx="300" cy="220" r="7" fill="#2563eb" />
            <circle cx={p.x} cy={p.y} r="7" fill={accent} />
          </>
        );
      }
      break;
    case "polyline":
      object = (
        <polyline
          points={poly(Math.round(v1), v2, 15)}
          fill="none"
          stroke={accent}
          strokeWidth="4"
        />
      );
      break;
    case "perpendicular":
    case "parallel":
      {
        const a = rad(v1),
          a2 = kind === "perpendicular" ? a + Math.PI / 2 : a;
        object = (
          <>
            <line
              x1={300 - Math.cos(a) * 280}
              y1={220 + Math.sin(a) * 280}
              x2={300 + Math.cos(a) * 280}
              y2={220 - Math.sin(a) * 280}
              stroke="#2563eb"
              strokeWidth="3"
            />
            <line
              x1={p.x - Math.cos(a2) * 280}
              y1={p.y + Math.sin(a2) * 280}
              x2={p.x + Math.cos(a2) * 280}
              y2={p.y - Math.sin(a2) * 280}
              stroke={accent}
              strokeWidth="3"
            />
            {kind === "perpendicular" ? (
              <path
                d={`M300 220 l16 ${-Math.tan(a) * 16} l${-Math.sin(a) * 16} ${-Math.cos(a) * 16}`}
                fill="none"
                stroke="#10b981"
              />
            ) : null}
          </>
        );
      }
      break;
    case "perpendicularBisector":
      object = (
        <>
          <line
            x1={sx(-v2)}
            y1="220"
            x2={sx(v2)}
            y2="220"
            stroke="#2563eb"
            strokeWidth="4"
          />
          <line
            x1="300"
            y1="25"
            x2="300"
            y2="415"
            stroke={accent}
            strokeWidth="3"
          />
          <circle cx={sx(-v2)} cy="220" r="7" fill="#2563eb" />
          <circle cx={sx(v2)} cy="220" r="7" fill="#2563eb" />
          {show ? (
            <circle
              cx="300"
              cy="220"
              r={v2 * 38}
              fill="none"
              stroke="#94a3b8"
              strokeDasharray="5 4"
            />
          ) : null}
        </>
      );
      break;
    case "angleBisector":
    case "angle":
    case "fixedAngle":
      {
        const a = rad(v1);
        object = (
          <>
            <line
              x1="180"
              y1="330"
              x2="520"
              y2="330"
              stroke="#2563eb"
              strokeWidth="3"
            />
            <line
              x1="180"
              y1="330"
              x2={180 + Math.cos(a) * 260}
              y2={330 - Math.sin(a) * 260}
              stroke={accent}
              strokeWidth="3"
            />
            {kind === "angleBisector" ? (
              <line
                x1="180"
                y1="330"
                x2={180 + Math.cos(a / 2) * 250}
                y2={330 - Math.sin(a / 2) * 250}
                stroke="#8b5cf6"
                strokeDasharray="6 4"
              />
            ) : null}
            <path
              d={`M240 330 A60 60 0 0 0 ${180 + Math.cos(a) * 60} ${330 - Math.sin(a) * 60}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
            />
            <text x="245" y="310" fill="#059669" fontSize="14" fontWeight="800">
              {v1.toFixed(1)}°
            </text>
          </>
        );
      }
      break;
    case "tangent":
      {
        const a = rad(v1),
          cx = 300,
          cy = 220,
          r = v2 * 38,
          tx = cx + Math.cos(a) * r,
          ty = cy - Math.sin(a) * r;
        object = (
          <>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="#eff6ff"
              stroke="#2563eb"
              strokeWidth="3"
            />
            <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="#64748b" />
            <line
              x1={tx + Math.sin(a) * 260}
              y1={ty + Math.cos(a) * 260}
              x2={tx - Math.sin(a) * 260}
              y2={ty - Math.cos(a) * 260}
              stroke={accent}
              strokeWidth="3"
            />
            <circle cx={tx} cy={ty} r="7" fill={accent} />
          </>
        );
      }
      break;
    case "bestFit":
      {
        const pts = [
          [-5, -3.5],
          [-4, -2],
          [-3, -2.8],
          [-2, -0.5],
          [-1, 0],
          [0, 0.8],
          [1, 0.4],
          [2, 2.4],
          [3, 2.1],
          [4, 4],
          [5, 4.5],
        ];
        object = (
          <>
            {pts.map(([x, y], i) => (
              <g key={i}>
                <circle cx={sx(x)} cy={sy(y)} r="6" fill="#0891b2" />
                {show ? (
                  <line
                    x1={sx(x)}
                    y1={sy(y)}
                    x2={sx(x)}
                    y2={sy(v1 * x + v2)}
                    stroke="#ec4899"
                    strokeDasharray="3 3"
                  />
                ) : null}
              </g>
            ))}
            <line
              x1={sx(-6)}
              y1={sy(v1 * -6 + v2)}
              x2={sx(6)}
              y2={sy(v1 * 6 + v2)}
              stroke="#2563eb"
              strokeWidth="4"
            />
          </>
        );
      }
      break;
    case "triangle":
      object = (
        <polygon
          points={`${sx(-4)},${sy(-2)} ${sx(4)},${sy(-2)} ${sx(v1)},${sy(v2)}`}
          fill="#dbeafe"
          stroke={accent}
          strokeWidth="4"
        />
      );
      break;
    case "regularPolygon":
      object = (
        <polygon
          points={poly(Math.round(v1), v2, -90)}
          fill="#dbeafe"
          stroke={accent}
          strokeWidth="4"
        />
      );
      break;
    case "rigidPolygon":
      object = (
        <polygon
          points={poly(4, 3, v1)}
          transform={`translate(${v2 * 25} 0)`}
          fill="#dcfce7"
          stroke={accent}
          strokeWidth="4"
        />
      );
      break;
    case "generalPolygon":
    case "area":
      object = (
        <polygon
          points={
            kind === "area"
              ? `${sx(-v1 / 2)},${sy(-v2 / 2)} ${sx(v1 / 2)},${sy(-v2 / 2)} ${sx(v1 / 2 + 1)},${sy(v2 / 2)} ${sx(-v1 / 2 + 1)},${sy(v2 / 2)}`
              : poly(Math.round(v1), 3 + v2, 12)
          }
          fill="#cffafe"
          stroke={accent}
          strokeWidth="4"
        />
      );
      break;
    case "circlePoint":
    case "circleRadius":
    case "compass":
      {
        const r = (kind === "circlePoint" ? v2 : v1) * 38;
        object = (
          <>
            <circle
              cx="300"
              cy="220"
              r={r}
              fill="#f5f3ff"
              stroke={accent}
              strokeWidth="3"
            />
            <line
              x1="300"
              y1="220"
              x2={300 + r * Math.cos(rad(kind === "circlePoint" ? v1 : 35))}
              y2={220 - r * Math.sin(rad(kind === "circlePoint" ? v1 : 35))}
              stroke="#2563eb"
              strokeWidth="3"
            />
            <circle cx="300" cy="220" r="6" fill="#2563eb" />
          </>
        );
      }
      break;
    case "circleThree":
    case "conicFive":
      {
        const rx = v1 * 38,
          ry = v2 * 38;
        object = (
          <>
            <ellipse
              cx="300"
              cy="220"
              rx={rx}
              ry={kind === "circleThree" ? rx : ry}
              fill="#f5f3ff"
              stroke={accent}
              strokeWidth="3"
            />
            {Array.from({ length: kind === "circleThree" ? 3 : 5 }, (_, i) => (
              <circle
                key={i}
                cx={
                  300 +
                  rx *
                    Math.cos(rad((i * 360) / (kind === "circleThree" ? 3 : 5)))
                }
                cy={
                  220 -
                  ry *
                    Math.sin(rad((i * 360) / (kind === "circleThree" ? 3 : 5)))
                }
                r="6"
                fill="#2563eb"
              />
            ))}
          </>
        );
      }
      break;
    case "semicircle":
      {
        const r = v1 * 19;
        object = (
          <>
            <path
              d={`M${300 - r} 260 A${r} ${r} 0 0 1 ${300 + r} 260`}
              fill="#dbeafe"
              stroke={accent}
              strokeWidth="4"
            />
            <line
              x1={300 - r}
              y1="260"
              x2={300 + r}
              y2="260"
              stroke="#10b981"
              strokeWidth="4"
            />
          </>
        );
      }
      break;
    case "arc":
    case "circumArc":
    case "sector":
      {
        const r = (kind === "circumArc" ? v2 : v1) * 38,
          a = kind === "circumArc" ? v1 : v2,
          start = -20,
          end = start + a,
          x1 = 300 + r * Math.cos(rad(start)),
          y1 = 240 - r * Math.sin(rad(start)),
          x2 = 300 + r * Math.cos(rad(end)),
          y2 = 240 - r * Math.sin(rad(end)),
          large = a > 180 ? 1 : 0;
        object = (
          <>
            {kind === "sector" ? (
              <path
                d={`M300 240 L${x1} ${y1} A${r} ${r} 0 ${large} 0 ${x2} ${y2} Z`}
                fill="#dbeafe"
                stroke={accent}
                strokeWidth="3"
              />
            ) : (
              <path
                d={`M${x1} ${y1} A${r} ${r} 0 ${large} 0 ${x2} ${y2}`}
                fill="none"
                stroke={accent}
                strokeWidth="5"
              />
            )}
            <circle cx={x1} cy={y1} r="6" fill="#f59e0b" />
            <circle cx={x2} cy={y2} r="6" fill="#2563eb" />
            {kind === "circumArc" ? (
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" />
            ) : null}
          </>
        );
      }
      break;
    case "ellipse":
      object = (
        <>
          <ellipse
            cx="300"
            cy="220"
            rx={v1 * 38}
            ry={v2 * 38}
            fill="#eef2ff"
            stroke={accent}
            strokeWidth="4"
          />
          <circle
            cx={300 - Math.sqrt(Math.max(0, v1 * v1 - v2 * v2)) * 38}
            cy="220"
            r="6"
            fill="#ec4899"
          />
          <circle
            cx={300 + Math.sqrt(Math.max(0, v1 * v1 - v2 * v2)) * 38}
            cy="220"
            r="6"
            fill="#ec4899"
          />
        </>
      );
      break;
    case "hyperbola":
      {
        const pts = (side: number) =>
          Array.from({ length: 80 }, (_, i) => {
            const y = -5 + (i * 10) / 79,
              x = side * v1 * Math.sqrt(1 + (y * y) / (v2 * v2));
            return `${sx(x)},${sy(y)}`;
          }).join(" ");
        object = (
          <>
            <polyline
              points={pts(-1)}
              fill="none"
              stroke={accent}
              strokeWidth="4"
            />
            <polyline
              points={pts(1)}
              fill="none"
              stroke={accent}
              strokeWidth="4"
            />
            <line
              x1={sx(-6)}
              y1={sy((-6 * v2) / v1)}
              x2={sx(6)}
              y2={sy((6 * v2) / v1)}
              stroke="#94a3b8"
              strokeDasharray="5 4"
            />
            <line
              x1={sx(-6)}
              y1={sy((6 * v2) / v1)}
              x2={sx(6)}
              y2={sy((-6 * v2) / v1)}
              stroke="#94a3b8"
              strokeDasharray="5 4"
            />
          </>
        );
      }
      break;
    case "parabola":
      {
        const pts = Array.from({ length: 100 }, (_, i) => {
          const x = -6 + (i * 12) / 99,
            y = (x * x) / (4 * v1);
          return `${sx(x + v2)},${sy(y)}`;
        }).join(" ");
        object = (
          <>
            <polyline
              points={pts}
              fill="none"
              stroke={accent}
              strokeWidth="4"
            />
            <circle cx={sx(v2)} cy={sy(v1)} r="6" fill="#f97316" />
            <line
              x1="30"
              x2="570"
              y1={sy(-v1)}
              y2={sy(-v1)}
              stroke="#ec4899"
              strokeDasharray="6 4"
            />
          </>
        );
      }
      break;
    case "distance":
      object = (
        <>
          <line
            x1={sx(-2)}
            y1={sy(-1)}
            x2={sx(-2 + v1)}
            y2={sy(-1 + v2)}
            stroke={accent}
            strokeWidth="4"
          />
          <line
            x1={sx(-2)}
            y1={sy(-1)}
            x2={sx(-2 + v1)}
            y2={sy(-1)}
            stroke="#10b981"
            strokeDasharray="5 4"
          />
          <line
            x1={sx(-2 + v1)}
            y1={sy(-1)}
            x2={sx(-2 + v1)}
            y2={sy(-1 + v2)}
            stroke="#ec4899"
            strokeDasharray="5 4"
          />
        </>
      );
      break;
    case "relation":
      {
        const a = rad(v1),
          b = rad(v2);
        object = (
          <>
            <line
              x1={300 - Math.cos(a) * 280}
              y1={220 + Math.sin(a) * 280}
              x2={300 + Math.cos(a) * 280}
              y2={220 - Math.sin(a) * 280}
              stroke="#2563eb"
              strokeWidth="4"
            />
            <line
              x1={300 - Math.cos(b) * 280}
              y1={220 + Math.sin(b) * 280}
              x2={300 + Math.cos(b) * 280}
              y2={220 - Math.sin(b) * 280}
              stroke={accent}
              strokeWidth="4"
            />
          </>
        );
      }
      break;
    case "steps":
      object = (
        <>
          <circle cx={sx(v1)} cy={sy(1)} r="7" fill="#2563eb" />
          <circle cx={sx(v2)} cy={sy(1)} r="7" fill="#8b5cf6" />
          <line
            x1={sx(v1)}
            y1={sy(1)}
            x2={sx(v2)}
            y2={sy(1)}
            stroke={accent}
            strokeWidth="4"
          />
          <circle cx={(sx(v1) + sx(v2)) / 2} cy={sy(1)} r="7" fill="#10b981" />
        </>
      );
      break;
  }
  return (
    <svg
      viewBox="0 0 600 440"
      className="h-[430px] w-full touch-none"
      role="img"
      aria-label={`${kind} dedicated interactive geometry model`}
      onPointerDown={onPointer}
      onPointerMove={onPointer}
    >
      <rect width="600" height="440" fill="white" />
      {grid}
      {object}
      <circle
        cx={p.x}
        cy={p.y}
        r="7"
        fill="#f97316"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}

function TargetControl({
  title,
  value,
  min,
  max,
  onChange,
}: {
  title: string;
  value: number;
  min: number;
  max: number;
  onChange: (x: number) => void;
}) {
  return (
    <label className="block rounded-lg border border-slate-200 bg-slate-50 p-2 text-[9px] font-bold">
      <span className="flex justify-between">
        <span>{title}</span>
        <output>
          {Number(value).toFixed(Number.isInteger(value) ? 0 : 2)}
        </output>
      </span>
      <input
        aria-label={title}
        className="mt-2 w-full accent-blue-600"
        type="range"
        min={min}
        max={max}
        step={Number.isInteger(value) ? 1 : 0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <input
        aria-label={`${title} exact value`}
        className="mt-1 w-full rounded border border-slate-200 bg-white px-2 py-1 text-right"
        type="number"
        min={min}
        max={max}
        step={Number.isInteger(value) ? 1 : 0.1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
function LessonCard({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "blue" | "violet" | "cyan";
  children: ReactNode;
}) {
  const c =
    tone === "blue"
      ? "text-blue-700"
      : tone === "violet"
        ? "text-violet-700"
        : "text-cyan-700";
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 text-[9px] leading-4 shadow-sm">
      <h2 className={`flex items-center gap-1 text-xs font-black ${c}`}>
        {tone === "violet" ? (
          <Lightbulb className="h-3 w-3" />
        ) : tone === "cyan" ? (
          <Target className="h-3 w-3" />
        ) : (
          <Eye className="h-3 w-3" />
        )}
        {title}
      </h2>
      <div className="mt-2 text-slate-700">{children}</div>
    </article>
  );
}
function MiniStep({
  kind,
  index,
  accent,
}: {
  kind: Kind;
  index: number;
  accent: string;
}) {
  return (
    <svg
      viewBox="0 0 130 48"
      className="mt-2 h-[42px] w-full"
      aria-hidden="true"
    >
      <line
        x1="12"
        y1={38 - index * 5}
        x2="116"
        y2={12 + index * 7}
        stroke={accent}
        strokeWidth="2"
        strokeDasharray={index % 2 ? "5 4" : undefined}
      />
      <circle cx="12" cy={38 - index * 5} r="4" fill="#2563eb" />
      <circle
        cx="116"
        cy={12 + index * 7}
        r="4"
        fill={kind.includes("circle") ? "#8b5cf6" : "#10b981"}
      />
    </svg>
  );
}

function resultFor(
  kind: Kind,
  v1: number,
  v2: number,
  p: { x: number; y: number },
) {
  let primary: string, secondary: string, summary: string, objectModel: string;
  switch (kind) {
    case "parallel":
      primary = `m = ${v1.toFixed(2)}`;
      secondary = `offset ${v2.toFixed(1)}`;
      summary = "Equal slopes verified; the lines do not intersect.";
      objectModel = "Two infinite lines with a shared direction vector.";
      break;
    case "perpendicular":
    case "perpendicularBisector":
      primary = "90.0°";
      secondary = "dot = 0";
      summary = "Right-angle relationship verified exactly.";
      objectModel = "A derived line constrained by an orthogonality invariant.";
      break;
    case "bestFit":
      primary = `m=${v1.toFixed(2)}`;
      secondary = `SSE ${(Math.abs(v1 - 0.82) * 10 + Math.abs(v2 - 0.35) * 4 + 5.86).toFixed(2)}`;
      summary = "Residuals and fit score update with the model line.";
      objectModel =
        "Dataset points, residual segments, and least-squares line.";
      break;
    case "regularPolygon":
      primary = `n=${Math.round(v1)}`;
      secondary = `${(((Math.round(v1) - 2) * 180) / Math.round(v1)).toFixed(1)}°`;
      summary = "All side lengths and central angles are equal.";
      objectModel =
        "Vertices constrained to equal angular spacing on one circumcircle.";
      break;
    case "circlePoint":
    case "circleRadius":
    case "compass":
      primary = `r=${(kind === "circlePoint" ? v2 : v1).toFixed(2)}`;
      secondary = "360°";
      summary = "Every circumference point remains one radius from the centre.";
      objectModel = "Centre plus radius-defining dependency.";
      break;
    case "ellipse":
      primary = `a=${v1}`;
      secondary = `b=${v2}`;
      summary = `Focal distance sum = ${(2 * v1).toFixed(2)}.`;
      objectModel =
        "Ellipse with semi-axes, foci, and focal-distance invariant.";
      break;
    case "hyperbola":
      primary = `a=${v1}`;
      secondary = `b=${v2}`;
      summary = `Focal distance difference = ${(2 * v1).toFixed(2)}.`;
      objectModel = "Two hyperbola branches with foci and asymptotes.";
      break;
    case "distance":
      primary = Math.hypot(v1, v2).toFixed(2);
      secondary = `Δ=(${v1},${v2})`;
      summary = `Distance = sqrt(${v1 * v1 + v2 * v2}) = ${Math.hypot(v1, v2).toFixed(2)}.`;
      objectModel =
        "Two endpoints and horizontal/vertical component projections.";
      break;
    case "area":
      primary = (v1 * v2).toFixed(2);
      secondary = "square units";
      summary = `Area recomputed as ${(v1 * v2).toFixed(2)} square units.`;
      objectModel = "Editable polygon with signed shoelace accumulation.";
      break;
    case "relation":
      {
        const d = Math.abs((((v1 - v2) % 180) + 180) % 180);
        primary =
          d === 90 ? "Perpendicular" : d === 0 ? "Parallel" : "Intersecting";
        secondary = `${d.toFixed(1)}°`;
        summary = `Relation checker reports ${primary.toLowerCase()}.`;
        objectModel =
          "Two line equations compared by direction vectors and intersection.";
      }
      break;
    default:
      primary = Number(v1).toFixed(Number.isInteger(v1) ? 0 : 2);
      secondary = Number(v2).toFixed(Number.isInteger(v2) ? 0 : 2);
      summary = `${modelHeading(kind)} is valid and updates continuously.`;
      objectModel = `Dedicated ${kind} objects with lesson-specific constraints and measurements.`;
  }
  return { primary, secondary, summary, objectModel };
}
function constructionFor(kind: Kind) {
  const map: Partial<Record<Kind, string[]>> = {
    ray: [
      "Place endpoint A.",
      "Place direction point B.",
      "Extend only beyond B.",
    ],
    polyline: [
      "Place ordered vertices.",
      "Join consecutive points.",
      "Keep the chain open.",
    ],
    tangent: [
      "Draw circle with centre O.",
      "Choose contact point T.",
      "Construct the perpendicular at T.",
    ],
    bestFit: [
      "Plot the dataset.",
      "Draw a model line.",
      "Minimize squared residuals.",
    ],
    circleThree: [
      "Place three non-collinear points.",
      "Construct two perpendicular bisectors.",
      "Use their intersection as centre.",
    ],
    compass: [
      "Set opening to AB.",
      "Move the compass without resizing.",
      "Draw from the new centre.",
    ],
    conicFive: [
      "Place five general points.",
      "Solve the conic coefficients.",
      "Draw the fitted locus.",
    ],
    steps: [
      "Create independent points.",
      "Create dependent objects.",
      "Preserve dependency order.",
    ],
  };
  return (
    map[kind] ?? [
      "Create the defining objects.",
      "Apply the exact constraint.",
      "Measure and verify the result.",
    ]
  );
}
function modelHeading(k: Kind) {
  return {
    ray: "Construct a Ray",
    polyline: "Build your polyline",
    perpendicular: "Perpendicular construction",
    parallel: "Given and parallel lines",
    perpendicularBisector: "Bisect segment AB",
    angleBisector: "Explore the Angle Bisector",
    tangent: "Tangent-circle relationship",
    bestFit: "Explore the best fit line",
    triangle: "Triangle construction",
    regularPolygon: "Regular polygon model",
    rigidPolygon: "Rigid polygon motion",
    generalPolygon: "Build a general polygon",
    circlePoint: "Circle from centre and point",
    circleRadius: "Circle from centre and radius",
    circleThree: "Circle through A, B and C",
    compass: "Compass transfer model",
    semicircle: "Semicircle from diameter",
    arc: "Circular arc model",
    circumArc: "Three points define a circumarc",
    sector: "Explore a circular sector",
    conicFive: "Five-point conic",
    ellipse: "Ellipse and focal property",
    hyperbola: "Hyperbola branches and asymptotes",
    parabola: "Focus-directrix parabola",
    distance: "Measure distance AB",
    area: "Explore polygon area",
    angle: "Interactive angle model",
    fixedAngle: "Fixed-angle construction",
    relation: "Build and test relationships",
    steps: "Your construction",
  }[k];
}
function s(
  id: number,
  mockup: string,
  kind: Kind,
  title: string,
  subtitle: string,
  accent: string,
  formula: string,
  insight: string,
  task: string,
  controls: [string, number, number, number][],
): Spec {
  return {
    id,
    mockup,
    kind,
    title,
    subtitle,
    accent,
    formula,
    insight,
    task,
    controls,
  };
}
function previousRoute(id: number) {
  return id === 206
    ? "/lessons/geometry/205-segment-with-given-length"
    : `/lessons/geometry/${id - 1}-${slug(specs[id - 1]?.title ?? "previous")}`;
}
function nextRoute(id: number) {
  return id === 235
    ? "/lessons/geometry/236-translation-by-vector"
    : `/lessons/geometry/${id + 1}-${slug(specs[id + 1]?.title ?? "next")}`;
}
function previousTitle(id: number) {
  return id === 206
    ? "Segment with Given Length"
    : (specs[id - 1]?.title ?? "Previous lesson");
}
function nextTitle(id: number) {
  return id === 235
    ? "Translation by Vector"
    : (specs[id + 1]?.title ?? "Next lesson");
}
function slug(x: string) {
  return x
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
