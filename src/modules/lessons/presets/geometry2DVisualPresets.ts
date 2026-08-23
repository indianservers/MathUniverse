import type { ReusableLessonEngineParams } from "../components/ReusableLessonEngine";

type GeometryPreset = {
  formula: string;
  worked: string;
  avoid: string;
  labels: string[];
};

const geometryPresets: Record<number, GeometryPreset> = {
  167: preset("Cartesian rule: (x,y)", "Worked: Plot (3,2) -> (3,2)", "Avoid: reading y before x. Correct: read x first, then y.", ["origin", "x first", "quadrants"]),
  168: preset("Plotting rule: horizontal then vertical", "Worked: Plot (-2,4) -> left 2, up 4", "Avoid: reversing the ordered pair. Correct: x controls left/right.", ["ordered pair", "left/right", "up/down"]),
  169: preset("Distance formula: d=sqrt((x2-x1)^2+(y2-y1)^2)", "Worked: (0,0) to (3,4) -> 5", "Avoid: adding coordinate changes without squaring. Correct: use Pythagoras.", ["dx, dy", "right triangle", "distance"]),
  170: preset("Midpoint formula: M=((x1+x2)/2,(y1+y2)/2)", "Worked: (2,4) and (6,8) -> (4,6)", "Avoid: averaging all coordinates into one number. Correct: average x and y separately.", ["halfway", "average x", "average y"]),
  171: preset("Section formula: weighted average by ratio", "Worked: (0,0) to (6,0) in 1:2 -> (2,0)", "Avoid: reversing m:n. Correct: check which part is closer to which endpoint.", ["ratio", "weighted point", "internal division"]),
  172: preset("Slope formula: m=(y2-y1)/(x2-x1)", "Worked: (0,1) to (2,5) -> slope 2", "Avoid: run over rise. Correct: slope is rise divided by run.", ["rise", "run", "steepness"]),
  173: preset("Line equation: y=mx+b", "Worked: slope 2, intercept 1 -> y=2x+1", "Avoid: swapping slope and intercept. Correct: slope multiplies x.", ["slope", "intercept", "line"]),
  174: preset("Parallel test: m1=m2", "Worked: y=2x+1 and y=2x-3 -> parallel", "Avoid: checking only intercepts. Correct: compare slopes.", ["same slope", "distinct lines", "parallel"]),
  175: preset("Perpendicular test: m1*m2=-1", "Worked: perpendicular to slope 2 -> -1/2", "Avoid: using the same slope. Correct: use negative reciprocal.", ["right angle", "negative reciprocal", "perpendicular"]),
  176: preset("Angle rule: parallel 0 degrees, perpendicular 90 degrees", "Worked: perpendicular lines -> 90 degrees", "Avoid: taking the larger angle. Correct: use the smaller angle unless stated.", ["line direction", "turn angle", "smaller angle"]),
  177: preset("Shortest distance: perpendicular to the line", "Worked: point (5,6) to y=2 -> 4", "Avoid: measuring to a random point. Correct: use the perpendicular segment.", ["point", "line", "shortest path"]),
  178: preset("Locus rule: x^2+y^2=r^2", "Worked: 3 units from origin -> circle radius 3", "Avoid: drawing one sample point. Correct: draw every point satisfying the rule.", ["condition", "all points", "locus"]),
  179: preset("Transformation rule: (x,y)->(x+a,y+b)", "Worked: (3,4)+(2,-1) -> (5,3)", "Avoid: moving only one vertex. Correct: transform every point.", ["image", "translation", "invariant"]),
  180: preset("Polar conversion: x=r cos(theta), y=r sin(theta)", "Worked: r=5, theta=0 -> (5,0)", "Avoid: treating theta as y. Correct: theta is an angle.", ["radius", "angle", "conversion"]),
  181: preset("Parametric rule: (x,y)=(x(t),y(t))", "Worked: x=t, y=t^2, t=3 -> (3,9)", "Avoid: plotting t as a coordinate. Correct: t controls x and y.", ["parameter", "path", "trace"]),
  182: preset("Barycentric rule: P=w1A+w2B+w3C", "Worked: equal weights -> centroid", "Avoid: using unnormalised weights. Correct: weights should add to 1.", ["triangle", "weights", "centroid"]),
  198: preset("Free point: P=(x,y)", "Worked: Drag P -> independent position", "Avoid: constraining it to a line. Correct: free points move independently.", ["free point", "independent", "drag anywhere"]),
  199: preset("Point on object: P remains on parent", "Worked: P on circle -> distance to centre stays fixed", "Avoid: dragging the point away from its parent. Correct: it stays attached to the object.", ["attached point", "constraint", "parent object"]),
  200: preset("Intersection point: object A meets object B", "Worked: line meets circle -> exact crossing point", "Avoid: placing a point near the crossing by eye. Correct: use the exact intersection.", ["crossing", "shared point", "exact"]),
  201: preset("Midpoint or centre: M=((x1+x2)/2,(y1+y2)/2)", "Worked: A(0,2), B(4,2) -> M(2,2)", "Avoid: guessing halfway by sight. Correct: use equal distances from both ends.", ["midpoint", "centre", "equal distance"]),
  202: preset("Attach or detach: constrain or release a point", "Worked: Detach P -> P no longer follows the circle", "Avoid: thinking detached points still follow the object. Correct: detached points move freely.", ["constraint", "release", "parent object"]),
  203: preset("Line through two points: line AB", "Worked: A and B define one straight line", "Avoid: using one point twice. Correct: two distinct points define the line.", ["two points", "infinite line", "straight"]),
  204: preset("Segment: finite part from A to B", "Worked: AB has endpoints A and B", "Avoid: extending a segment forever. Correct: a segment stops at endpoints.", ["endpoint", "length", "finite"]),
  205: preset("Fixed length segment: AB = chosen length", "Worked: fixed length 5 -> endpoint stays 5 units away", "Avoid: dragging the endpoint and changing the fixed length. Correct: preserve the chosen length.", ["fixed length", "radius guide", "constraint"]),
  206: preset("Ray: starts at A and passes through B", "Worked: ray AB continues beyond B", "Avoid: stopping the ray at the second point. Correct: the ray continues past B.", ["start point", "direction", "infinite ray"]),
  207: preset("Polyline: A-B-C connected by straight pieces", "Worked: three vertices -> two straight segments", "Avoid: drawing it as one smooth curve. Correct: a polyline is made of straight segments.", ["vertices", "segments", "path"]),
  208: preset("Perpendicular line: l perpendicular m", "Worked: line through P makes 90 degrees with m", "Avoid: drawing a line that only looks close to 90 degrees. Correct: use the perpendicular relation.", ["right angle", "90 degrees", "constraint"]),
  209: preset("Parallel line: l parallel m", "Worked: copied direction -> no intersection", "Avoid: drawing a nearly parallel line by sight. Correct: match the exact direction.", ["same direction", "no crossing", "parallel"]),
  210: preset("Perpendicular bisector: midpoint plus right angle", "Worked: every point on it is equally far from A and B", "Avoid: finding midpoint but not making a right angle. Correct: bisect and stay perpendicular.", ["midpoint", "right angle", "equal distance"]),
  211: preset("Angle bisector: splits angle A equally", "Worked: 60 degrees -> two 30 degree angles", "Avoid: splitting into unequal parts. Correct: the two angles must match.", ["equal angles", "vertex", "bisector"]),
  212: preset("Tangent: radius is perpendicular to tangent", "Worked: tangent touches circle once", "Avoid: drawing a line that cuts through the circle. Correct: tangent touches at one point.", ["touch point", "radius", "perpendicular"]),
  213: preset("Best-fit line: y=mx+b models trend", "Worked: points near y=2x+1 -> line y=2x+1", "Avoid: forcing the line through every point. Correct: a best-fit line models the trend.", ["trend", "residuals", "model"]),
  214: preset("Triangle constructor: A+B+C=180 degrees", "Worked: three non-collinear points -> triangle", "Avoid: using three collinear points. Correct: vertices must not all lie on one line.", ["three vertices", "angle sum", "non-collinear"]),
  215: preset("Regular polygon: exterior angle=360 degrees/n", "Worked: regular hexagon exterior angle -> 60 degrees", "Avoid: checking only equal sides. Correct: regular means equal sides and equal angles.", ["equal sides", "equal angles", "polygon"]),
  216: preset("Rigid polygon: lengths and angles stay fixed", "Worked: drag the polygon -> shape moves without bending", "Avoid: moving vertices independently. Correct: rigid polygons preserve their shape.", ["rigid", "invariant", "whole shape"]),
  217: preset("General polygon: vertices connect in order", "Worked: A-B-C-D -> quadrilateral boundary", "Avoid: skipping or crossing vertices accidentally. Correct: follow the vertex order.", ["ordered vertices", "boundary", "area"]),
  218: preset("Centre and point circle: radius = CP", "Worked: move point P -> circle radius changes from centre C", "Avoid: treating P as another centre. Correct: C is centre and CP is radius.", ["centre", "radius", "point on circle"]),
  219: preset("Centre and radius circle: r is fixed", "Worked: centre C, radius 4 -> all points are 4 units from C", "Avoid: changing radius while dragging centre. Correct: centre moves, radius stays fixed.", ["fixed radius", "centre", "circle"]),
  220: preset("Circle through three points: three non-collinear points define a circle", "Worked: A, B, C not on one line -> unique circle", "Avoid: using collinear points. Correct: three points need curvature to define a circle.", ["circumcircle", "three points", "non-collinear"]),
  221: preset("Compass: copy a distance exactly", "Worked: copy AB from point C -> new circle radius AB", "Avoid: changing compass width mid-construction. Correct: preserve the copied length.", ["copied length", "circle", "radius"]),
  222: preset("Semicircle: arc over a diameter", "Worked: diameter AB -> half-circle arc", "Avoid: drawing the full circle. Correct: a semicircle is exactly half.", ["diameter", "arc", "half circle"]),
  223: preset("Circular arc: portion of a circle", "Worked: start and end points mark the visible arc", "Avoid: using the chord as the arc. Correct: the arc follows the circle.", ["arc", "centre", "start-end"]),
  224: preset("Circumcircular arc: arc through three points", "Worked: A, B, C determine the supporting circle", "Avoid: drawing an arbitrary curve. Correct: the arc belongs to the circumcircle.", ["three points", "circumcircle", "arc"]),
  225: preset("Circular sector: two radii plus an arc", "Worked: angle 60 degrees, radius 3 -> sector slice", "Avoid: drawing only a triangle. Correct: include the curved arc boundary.", ["sector", "radii", "central angle"]),
  226: preset("Conic through five points: five constraints determine the conic", "Worked: five well-placed points -> one conic", "Avoid: using too few points. Correct: a general conic needs five point constraints.", ["conic", "five points", "constraint"]),
  227: preset("Ellipse: sum of distances to foci is constant", "Worked: PF1+PF2 stays fixed -> ellipse", "Avoid: assuming every oval is a circle. Correct: use the two-focus distance rule.", ["foci", "constant sum", "oval"]),
  228: preset("Hyperbola: difference of focal distances is constant", "Worked: |PF1-PF2| fixed -> two branches", "Avoid: confusing it with an ellipse. Correct: compare distance difference, not sum.", ["foci", "constant difference", "branches"]),
  229: preset("Parabola: distance to focus equals distance to directrix", "Worked: PF equals distance to line -> parabola", "Avoid: calling any U-shape a parabola. Correct: check the focus-directrix rule.", ["focus", "directrix", "equal distance"]),
  230: preset("Distance or length: measure exact segment AB", "Worked: A(0,0), B(3,4) -> AB=5", "Avoid: estimating from the grid by eye. Correct: use exact length measurement.", ["measure", "segment", "units"]),
  231: preset("Area: count square units inside boundary", "Worked: rectangle 3 by 4 -> area 12", "Avoid: confusing area with perimeter. Correct: area covers surface.", ["square units", "boundary", "surface"]),
  232: preset("Angle: measure a turn between two rays", "Worked: quarter turn -> 90 degrees", "Avoid: using side length to decide angle size. Correct: measure the opening.", ["vertex", "rays", "turn"]),
  233: preset("Fixed angle: chosen angle stays constant", "Worked: 45 degrees remains 45 degrees while dragged", "Avoid: dragging until the fixed angle changes. Correct: preserve the angle constraint.", ["fixed angle", "constraint", "rotation"]),
  234: preset("Relation checker: test exact geometric relationships", "Worked: slopes 2 and -1/2 -> perpendicular", "Avoid: trusting a visual guess. Correct: use the relation result.", ["exact check", "parallel", "perpendicular"]),
  235: preset("Construction steps: order controls dependencies", "Worked: construct midpoint before bisector -> stable result", "Avoid: skipping a dependency. Correct: build in logical order.", ["steps", "dependency", "protocol"]),
  236: preset("Translation by vector: every point moves by the same vector", "Worked: (x,y)->(x+3,y-1)", "Avoid: moving only one vertex. Correct: translate the whole figure.", ["vector", "same shift", "image"]),
  237: preset("Reflection in line: mirror distance is equal on both sides", "Worked: point P reflects across l to P'", "Avoid: accepting a near visual match. Correct: line is perpendicular bisector of PP'.", ["mirror line", "equal distance", "image"]),
  238: preset("Reflection in point: centre is midpoint of PP'", "Worked: half-turn around O sends P to P'", "Avoid: treating it as line reflection. Correct: rotate 180 degrees around the point.", ["point mirror", "midpoint", "180 degrees"]),
  239: preset("Reflection in circle: OP * OP' = r^2", "Worked: point outside circle maps inside by inversion", "Avoid: using an ordinary mirror reflection. Correct: preserve the inversion product.", ["inversion", "circle", "reciprocal distance"]),
  240: preset("Rotation around point: distance to centre stays fixed", "Worked: rotate P by 90 degrees around O", "Avoid: sliding the figure. Correct: turn around the fixed centre.", ["centre", "angle", "same radius"]),
  241: preset("Dilation from point: distances scale from centre", "Worked: scale factor 2 sends OP to 2OP", "Avoid: translating instead of scaling. Correct: image points stay on centre rays.", ["scale factor", "centre", "similarity"]),
  242: preset("Matrix transformation: apply matrix to every point", "Worked: [[1,0],[0,-1]] reflects across x-axis", "Avoid: transforming only one coordinate pair in a shape. Correct: transform all vertices.", ["matrix", "image", "linear map"]),
  243: preset("Composite transformations: order matters", "Worked: reflect then translate can differ from translate then reflect", "Avoid: reversing the order. Correct: apply transformations left-to-right as specified.", ["sequence", "order", "composition"]),
  244: preset("Transformation mapping: preimage maps to image", "Worked: A -> A', B -> B', C -> C'", "Avoid: leaving image points unlabeled. Correct: match each original to its image.", ["preimage", "image", "labels"]),
  245: preset("Invariants: properties that stay unchanged", "Worked: translation preserves length and angle", "Avoid: assuming every property remains fixed. Correct: name the invariant for that transformation.", ["unchanged", "length", "angle"]),
  246: preset("Symmetry explorer: T(shape)=shape", "Worked: after symmetry transformation -> exact match", "Avoid: calling a near match symmetry. Correct: symmetry needs exact overlap.", ["symmetry", "mapping", "match"]),
  247: preset("Locus generator: all points satisfying a condition", "Worked: points 5 units from O -> circle", "Avoid: giving one point as the whole locus. Correct: include all matching points.", ["condition", "path", "all points"]),
  248: preset("Equidistant loci: d(P,A)=d(P,B)", "Worked: equidistant from A and B -> perpendicular bisector", "Avoid: accepting distances that only look equal. Correct: use exact distance checks.", ["equal distance", "bisector", "locus"]),
  249: preset("Moving-linkage loci: P(t) follows constraints", "Worked: trace a joint as the linkage moves -> curve", "Avoid: treating the tracing point as free. Correct: linkage constraints control the path.", ["linkage", "trace", "constraint"]),
  250: preset("Envelope of lines: family touches a boundary curve", "Worked: many tangent lines reveal an envelope", "Avoid: using one line as the envelope. Correct: envelope comes from a whole family.", ["line family", "tangent", "boundary"]),
  251: preset("Dynamic trace: path={P(t)}", "Worked: moving point leaves a visible path", "Avoid: thinking trace changes the construction. Correct: trace records motion only.", ["trace", "motion", "record"]),
  252: preset("Conjecture testing: examples support a claim", "Worked: many diagrams support a pattern -> still needs proof", "Avoid: thinking many examples prove a theorem. Correct: examples support; proof explains always.", ["examples", "claim", "proof need"]),
  253: preset("Exact proof: given facts -> valid steps -> conclusion", "Worked: one measured diagram is not proof", "Avoid: using measurement as proof. Correct: proof gives general reasons.", ["given", "reason", "conclusion"]),
  254: preset("Collinearity test: points share one straight line", "Worked: slope AB equals slope BC -> collinear", "Avoid: accepting nearly straight by eye. Correct: verify one common line.", ["same line", "slope", "alignment"]),
  255: preset("Concurrency test: lines meet at one point", "Worked: three medians meet at centroid", "Avoid: checking only pairwise intersections. Correct: all lines must share the same point.", ["common point", "lines", "intersection"]),
  256: preset("Concyclicity test: points lie on one circle", "Worked: equal power or same circumcircle -> concyclic", "Avoid: accepting a near circle by eye. Correct: verify one common circle.", ["same circle", "cyclic", "test"]),
};

export function geometry2DVisualPresetForLesson(lessonId: number, base: ReusableLessonEngineParams): ReusableLessonEngineParams {
  const specific = geometryPresets[lessonId];
  if (!specific) return base;
  return {
    ...base,
    insight: `${base.insight ?? "Drag the construction and read the matching measurement."} ${specific.formula}`,
    check: `${specific.worked}. ${specific.avoid}`,
    visualLabels: specific.labels,
  };
}

function preset(formula: string, worked: string, avoid: string, labels: string[]): GeometryPreset {
  return { formula, worked, avoid, labels };
}
