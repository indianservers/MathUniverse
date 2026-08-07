import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { distanceBetween, line, midpoint, polygonArea, polygonPerimeter, relationBetween, type KernelPoint } from "../../../workspace/geometry2dKernel";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const sx = (x: number) => 320 + x * 38;
const sy = (y: number) => 180 - y * 38;

function transformFor(title: string, point: KernelPoint, amount: number): KernelPoint {
  const name = title.toLowerCase();
  if (name.includes("reflect")) return { x: -point.x, y: point.y };
  if (name.includes("rotat")) {
    const angle = (amount * Math.PI) / 12;
    return { x: point.x * Math.cos(angle) - point.y * Math.sin(angle), y: point.x * Math.sin(angle) + point.y * Math.cos(angle) };
  }
  if (name.includes("enlarge") || name.includes("dilat") || name.includes("scale")) return { x: (point.x * amount) / 2, y: (point.y * amount) / 2 };
  return { x: point.x + amount, y: point.y + 1 };
}

function guidanceFor(title: string) {
  const name = title.toLowerCase();
  if (name === "perpendicular line") return ["Perpendicular line", "The constructed line meets the parent at 90 degrees.", "Use the tool, not an eye estimate."];
  if (name === "parallel line") return ["Parallel line", "The constructed line keeps the parent line's direction.", "Parallel lines do not meet in a plane."];
  if (name.includes("perpendicular bisector")) return ["Perpendicular bisector", "It crosses a segment at its midpoint and 90 degrees.", "It both bisects and is perpendicular."];
  if (name.includes("angle bisector")) return ["Angle bisector", "It splits an angle into two equal angles.", "The two angle measures must match."];
  if (name.includes("best-fit line")) return ["Best-fit line", "The line models the overall trend of scattered points.", "It does not need to pass through every point."];
  if (name.includes("triangle constructor")) return ["Triangle constructor", "Three non-collinear points determine a triangle.", "Collinear points make zero area."];
  if (name.includes("regular polygon")) return ["Regular polygon", "All sides and all angles are equal.", "Checking sides alone is not enough."];
  if (name.includes("rigid polygon")) return ["Rigid polygon", "Side lengths and angles stay fixed while it moves.", "Rigid shapes do not stretch."];
  if (name.includes("general polygon")) return ["General polygon", "A polygon is a closed chain of straight segments.", "Connect the last vertex back to the first."];
  if (name.includes("circle: centre and point")) return ["Centre and point circle", "The point sets the radius from the centre.", "Every circle point is the same distance from the centre."];
  if (name.includes("circle: centre and radius")) return ["Centre and radius circle", "The radius is fixed by the numeric distance.", "Do not use diameter as radius."];
  if (name.includes("circle through three points")) return ["Circle through three points", "Three non-collinear points determine one circle.", "Collinear points do not work."];
  if (name === "compass") return ["Compass", "A compass copies a fixed distance.", "Keep the width unchanged while copying."];
  if (name === "semicircle") return ["Semicircle", "A semicircle is exactly half a circle.", "Its arc measures 180 degrees."];
  if (name === "circular arc") return ["Circular arc", "An arc is part of a circle.", "Arc length follows the curve, not a straight segment."];
  if (name.includes("circumcircular arc")) return ["Circumcircular arc", "The arc lies on the circumcircle through its points.", "Use the correct supporting circle."];
  if (name.includes("circular sector")) return ["Circular sector", "A sector is the region between two radii and an arc.", "It is more than the curved edge."];
  if (name.includes("conic through five points")) return ["Conic through five points", "Five suitable points determine a general conic.", "Avoid degenerate point arrangements."];
  if (name === "ellipse") return ["Ellipse", "The sum of distances to two foci stays constant.", "Not every oval is an ellipse."];
  if (name === "hyperbola") return ["Hyperbola", "The absolute difference of focus distances stays constant.", "Use difference, not sum."];
  if (name === "parabola") return ["Parabola", "Points are equally distant from focus and directrix.", "A U-shape alone is not enough."];
  if (name.includes("distance / length")) return ["Distance or length", "Length is the shortest straight distance between endpoints.", "Distance is never negative."];
  if (name === "area") return ["Area", "Area measures the inside region in square units.", "Do not use perimeter when area is needed."];
  if (name === "angle") return ["Angle", "Angle measures turn between two rays.", "Ray length does not change angle size."];
  if (name.includes("fixed angle")) return ["Fixed angle", "The chosen angle measure stays unchanged.", "Drag-test that the angle remains fixed."];
  if (name.includes("relation checker")) return ["Relation checker", "The checker tests exact geometric relationships.", "Use measurements instead of eye estimates."];
  if (name.includes("construction steps")) return ["Construction steps", "Later objects depend on earlier construction steps.", "Build parent objects first."];
  if (name.includes("translation by vector")) return ["Translation by vector", "Add the same vector to every point.", "Move all vertices, not only one."];
  if (name.includes("reflection in line")) return ["Reflection in line", "The mirror line bisects point-image segments at 90 degrees.", "Reflection flips orientation."];
  if (name.includes("reflection in point")) return ["Reflection in point", "The centre is the midpoint of each point-image segment.", "This is a half-turn."];
  if (name.includes("reflection in circle")) return ["Reflection in circle", "Circle reflection uses OP times OP' equals r squared.", "It is not ordinary line reflection."];
  if (name.includes("rotation around point")) return ["Rotation around point", "Distance from the centre stays fixed.", "Only direction changes by the angle."];
  if (name.includes("dilation from point")) return ["Dilation from point", "Distances from the centre multiply by the scale factor.", "Dilation scales; it does not add."];
  if (name.includes("matrix transformation")) return ["Matrix transformation", "Apply the same matrix to every point.", "Transform all vertices."];
  if (name.includes("composite transformations")) return ["Composite transformations", "Apply transformations in sequence.", "Order can change the final image."];
  if (name.includes("transformation mapping")) return ["Transformation mapping", "Each original point maps to its matching image point.", "Keep labels paired."];
  if (name === "invariants") return ["Invariants", "An invariant is a property that stays unchanged.", "Different transformations preserve different properties."];
  if (name.includes("symmetry explorer")) return ["Symmetry explorer", "A symmetry maps a shape exactly onto itself.", "A near match is not enough."];
  if (name.includes("locus generator")) return ["Locus generator", "A locus is all points satisfying a condition.", "One example point is not the whole locus."];
  if (name.includes("equidistant loci")) return ["Equidistant loci", "Equal-distance points form exact lines or curves.", "Use distance checks, not eye estimates."];
  if (name.includes("moving-linkage loci")) return ["Moving-linkage loci", "The path is controlled by linkage constraints.", "The tracing point is not free."];
  if (name.includes("envelope of lines")) return ["Envelope of lines", "An envelope is touched by a family of lines.", "One line alone does not make an envelope."];
  if (name.includes("dynamic trace")) return ["Dynamic trace", "Trace records previous positions of a moving object.", "It is a record, not a constraint."];
  if (name.includes("conjecture testing")) return ["Conjecture testing", "Testing examples supports a claim.", "Only proof gives certainty."];
  if (name.includes("exact proof")) return ["Exact proof", "Proof uses valid reasons for all cases.", "One measured diagram is not proof."];
  if (name.includes("collinearity test")) return ["Collinearity test", "Collinear points lie on one straight line.", "Check slope or zero area."];
  if (name.includes("concurrency test")) return ["Concurrency test", "Concurrent lines share one point.", "All tested lines must pass through it."];
  if (name.includes("concyclicity test")) return ["Concyclicity test", "Concyclic points lie on one circle.", "The extra point must lie on the same circle."];
  if (name.includes("cartesian plane")) return ["Cartesian rule", "(x,y) means horizontal first, vertical second.", "Read x before y."];
  if (name.includes("plotting points")) return ["Plotting rule", "Start at the origin, move by x, then move by y.", "Negative x moves left; negative y moves down."];
  if (name.includes("distance between")) return ["Distance formula", "d = sqrt((x2-x1)^2 + (y2-y1)^2).", "Square both coordinate changes before adding."];
  if (name === "midpoint") return ["Midpoint formula", "M = ((x1+x2)/2, (y1+y2)/2).", "Average x-values and y-values separately."];
  if (name.includes("section formula")) return ["Section formula", "Use weighted averages to divide a segment in a ratio.", "Check the ratio order before substituting."];
  if (name.includes("gradient") || name.includes("slope")) return ["Slope formula", "m = (y2-y1)/(x2-x1).", "Slope is rise over run."];
  if (name.includes("equation of a line")) return ["Line equation", "y = mx + b uses slope and y-intercept.", "Vertical lines need x = c."];
  if (name.includes("parallel")) return ["Parallel test", "Distinct non-vertical parallel lines have equal slopes.", "Same slope means same direction."];
  if (name.includes("perpendicular")) return ["Perpendicular test", "Non-vertical perpendicular slopes multiply to -1.", "Use the negative reciprocal."];
  if (name.includes("angle between")) return ["Angle rule", "Use the smaller angle where the lines meet.", "Parallel gives 0 degrees; perpendicular gives 90 degrees."];
  if (name.includes("point-to-line")) return ["Shortest distance", "Measure along the perpendicular from the point to the line.", "Do not measure to a random point."];
  if (name.includes("loci") || name.includes("locus")) return ["Locus rule", "Draw all points satisfying the condition.", "Fixed distance from one point makes a circle."];
  if (name.includes("coordinate transformations")) return ["Transformation rule", "Apply the same coordinate rule to every point.", "For translation, add the vector to each point."];
  if (name.includes("polar coordinates")) return ["Polar conversion", "x = r cos theta and y = r sin theta.", "Theta is an angle, not a y-coordinate."];
  if (name.includes("parametric coordinates")) return ["Parametric rule", "Compute x(t) and y(t) from the same parameter.", "t controls the point; it is not a plane coordinate."];
  if (name.includes("barycentric")) return ["Barycentric rule", "Use vertex weights that add to 1.", "Equal triangle weights give the centroid."];
  if (name.includes("free point")) return ["Free point", "A free point moves independently.", "No other object controls its position."];
  if (name.includes("point on object")) return ["Point on object", "The point stays constrained to its parent object.", "Drag it along the object, not away from it."];
  if (name.includes("intersection point")) return ["Intersection point", "An intersection belongs to two parent objects.", "Use the exact crossing, not a point placed by eye."];
  if (name.includes("midpoint or centre")) return ["Midpoint or centre", "A midpoint is halfway; a centre is the middle of a circle.", "Drag-test equal distances."];
  if (name.includes("attach") || name.includes("detach")) return ["Attach or detach", "Attach constrains a point; detach makes it free.", "This changes dependency."];
  if (name.includes("line through two points")) return ["Line through two points", "Two distinct points determine exactly one line.", "Moving either point updates the line."];
  if (name === "segment") return ["Segment", "A segment is finite and has two endpoints.", "Do not extend it forever."];
  if (name.includes("given length")) return ["Fixed length segment", "The segment keeps the chosen distance.", "Drag-test that the length stays fixed."];
  if (name === "ray") return ["Ray", "A ray starts at one endpoint and continues one way forever.", "The second point sets direction."];
  if (name.includes("polyline")) return ["Polyline", "A polyline is a chain of straight segments.", "Each vertex joins one segment to the next."];
  if (name === "tangent") return ["Tangent", "A tangent touches a circle at exactly one point.", "The radius to the touch point is perpendicular."];
  return ["Coordinate rule", "Use the diagram and formula together.", "Check coordinates before calculating."];
}

export default function Geometry2DLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [ax, setAx] = useState(-3);
  const [ay, setAy] = useState(-1);
  const [bx, setBx] = useState(3);
  const [by, setBy] = useState(2);
  const [amount, setAmount] = useState(2);

  useEffect(() => {
    setAx(-3);
    setAy(-1);
    setBx(3);
    setBy(2);
    setAmount(2);
  }, [resetToken]);

  const a = useMemo(() => ({ x: ax, y: ay }), [ax, ay]);
  const b = useMemo(() => ({ x: bx, y: by }), [bx, by]);
  const mid = midpoint(a, b);
  const transformed = transformFor(lesson.title, b, amount);
  const distance = distanceBetween(a, b);
  const relation = relationBetween(line(a, b), line(mid, { x: mid.x - (b.y - a.y), y: mid.y + (b.x - a.x) }));
  const polygon = [a, b, transformed];
  const isTransform = /transform|reflect|rotat|translat|enlarg|dilat|loci|locus|symmetr/i.test(lesson.title);
  const guidance = guidanceFor(lesson.title);
  const tools = /circle|arc|tangent/i.test(lesson.title)
    ? ["Point", "Circle", "Measure"]
    : /polygon|triangle|quadrilateral/i.test(lesson.title)
      ? ["Point", "Polygon", "Measure"]
      : ["Point", "Segment", "Relation"];
  const update = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };

  return (
    <AdapterFrame
      title={`${lesson.title} - construction`}
      value={isTransform ? `B' (${transformed.x.toFixed(1)}, ${transformed.y.toFixed(1)})` : `AB = ${distance.toFixed(2)}`}
      footer={`Whitelisted tools: ${tools.join(", ")}. Checks use kernel distances, areas, and relations.`}
    >
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
          <svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label="Interactive coordinate construction">
            <GeometryGrid />
            {isTransform ? (
              <>
                <polygon points={polygon.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")} fill="#06b6d4" opacity=".16" stroke="#06b6d4" strokeWidth="3" />
                <line x1={sx(b.x)} y1={sy(b.y)} x2={sx(transformed.x)} y2={sy(transformed.y)} stroke="#f59e0b" strokeDasharray="7 5" strokeWidth="2" />
              </>
            ) : (
              <>
                <line x1={sx(a.x)} y1={sy(a.y)} x2={sx(b.x)} y2={sy(b.y)} stroke="#06b6d4" strokeWidth="4" />
                <circle cx={sx(mid.x)} cy={sy(mid.y)} r="6" fill="#f59e0b" />
              </>
            )}
            <PointMark point={a} label="A" />
            <PointMark point={b} label="B" />
            {isTransform ? <PointMark point={transformed} label="B'" accent /> : null}
          </svg>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {tools.map((tool) => <span key={tool} className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{tool}</span>)}
          </div>
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
          <SliderGroup title="Seeded points">
            <SliderControl density="compact" label="A x" value={ax} min={-6} max={6} step={0.5} onChange={update(setAx)} />
            <SliderControl density="compact" label="A y" value={ay} min={-4} max={4} step={0.5} onChange={update(setAy)} />
            <SliderControl density="compact" label="B x" value={bx} min={-6} max={6} step={0.5} onChange={update(setBx)} />
            <SliderControl density="compact" label="B y" value={by} min={-4} max={4} step={0.5} onChange={update(setBy)} />
          </SliderGroup>
          {isTransform ? <SliderControl density="compact" label="Transform" value={amount} min={-4} max={4} step={0.5} onChange={update(setAmount)} /> : null}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <Metric label="Midpoint" value={`${mid.x.toFixed(1)}, ${mid.y.toFixed(1)}`} />
            <Metric label="Invariant" value={isTransform ? `Area ${polygonArea(polygon).toFixed(1)}` : relation.relation} />
            <Metric label="Perimeter" value={polygonPerimeter(polygon).toFixed(1)} />
            <Metric label="Tolerance" value="1e-7" />
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

function GeometryGrid() {
  return (
    <g>
      {Array.from({ length: 17 }, (_, i) => <line key={`v${i}`} x1={i * 38 + 16} x2={i * 38 + 16} y1="0" y2="360" stroke="#cbd5e1" opacity=".3" />)}
      {Array.from({ length: 11 }, (_, i) => <line key={`h${i}`} x1="0" x2="640" y1={i * 38 - 10} y2={i * 38 - 10} stroke="#cbd5e1" opacity=".3" />)}
      <line x1="0" x2="640" y1="180" y2="180" stroke="#64748b" />
      <line x1="320" x2="320" y1="0" y2="360" stroke="#64748b" />
    </g>
  );
}

function PointMark({ point, label, accent = false }: { point: KernelPoint; label: string; accent?: boolean }) {
  return (
    <g>
      <circle cx={sx(point.x)} cy={sy(point.y)} r="8" fill={accent ? "#f59e0b" : "#0891b2"} />
      <text x={sx(point.x) + 11} y={sy(point.y) - 10} fontWeight="800" fill="#334155">{label}</text>
    </g>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-100 p-2 dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">{label}</span><strong>{value}</strong></div>;
}
