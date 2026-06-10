export type SyllabusUnitKind =
  | "real-numbers"
  | "polynomial"
  | "coordinate"
  | "linear-equation"
  | "euclid"
  | "triangle"
  | "quadrilateral"
  | "circle"
  | "statistics"
  | "relations"
  | "matrix"
  | "calculus"
  | "vector"
  | "measurement"
  | "pattern"
  | "generic";

export type SyllabusUnitConcept = {
  id: string;
  title: string;
  kind: SyllabusUnitKind;
  strand: string;
  summary: string;
  route: string;
  examples: string[];
  prompts: string[];
  controls: {
    a: string;
    b: string;
    mode: string;
  };
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function concept(input: Omit<SyllabusUnitConcept, "id" | "route">): SyllabusUnitConcept {
  const id = slug(input.title);
  return { ...input, id, route: `/syllabus-visual/${id}` };
}

const conceptTemplates: Array<Omit<SyllabusUnitConcept, "id" | "route">> = [
  {
    title: "Real numbers",
    kind: "real-numbers",
    strand: "Number systems",
    summary: "Compare rational positions, irrational markers, intervals, and square-root locations on one living number line.",
    examples: ["Locate sqrt(2), sqrt(3), and sqrt(5)", "Compare decimals with fractions", "Show an interval and test points inside it"],
    prompts: ["Move the marker until it crosses zero.", "Switch representation and explain what stayed equal.", "Find two different labels for the same point."],
    controls: { a: "Marker", b: "Zoom", mode: "Representation" },
  },
  {
    title: "Polynomials",
    kind: "polynomial",
    strand: "Algebra",
    summary: "Drag coefficients and roots to see turning points, zeros, factor form, and graph shape change together.",
    examples: ["Quadratic roots as x-intercepts", "Remainder theorem as a graph value", "Factor form and expanded form connection"],
    prompts: ["Make two real roots.", "Move the graph so one root is repeated.", "Predict the y-intercept before changing the slider."],
    controls: { a: "Coefficient", b: "Root gap", mode: "Form" },
  },
  {
    title: "Coordinate geometry",
    kind: "coordinate",
    strand: "Coordinate geometry",
    summary: "Plot points, read quadrants, connect distance/slope/midpoint, and see ordered pairs as movements.",
    examples: ["Point locator by ordered pair", "Distance between two points", "Midpoint and slope of a segment"],
    prompts: ["Move the point into each quadrant.", "Make a horizontal segment.", "Predict the midpoint before revealing it."],
    controls: { a: "x-coordinate", b: "y-coordinate", mode: "Measure" },
  },
  {
    title: "Linear equations",
    kind: "linear-equation",
    strand: "Algebra and graphs",
    summary: "Change slope and intercept and watch tables, graph points, and equation form update as one system.",
    examples: ["Slope-intercept form", "Pair of linear equations", "Solution as intersection"],
    prompts: ["Make a positive slope.", "Move the intercept without changing slope.", "Find when two lines meet."],
    controls: { a: "Slope", b: "Intercept", mode: "View" },
  },
  {
    title: "Euclid geometry",
    kind: "euclid",
    strand: "Proof and construction",
    summary: "Use straightedge-compass style visuals to connect axioms, equal lengths, copying segments, and bisectors.",
    examples: ["Equal radii construction", "Perpendicular bisector", "Common notions with equal segments"],
    prompts: ["Copy a segment length.", "Show two equal circles.", "Explain why the intersection stays fixed."],
    controls: { a: "Radius", b: "Separation", mode: "Construction" },
  },
  {
    title: "Triangles",
    kind: "triangle",
    strand: "Geometry",
    summary: "Drag vertices and inspect angle sum, altitude, area, similarity, and congruence cues in real time.",
    examples: ["Angle sum is 180 degrees", "Base-height area", "Similarity by matching angles"],
    prompts: ["Make a right triangle.", "Keep the base fixed and change area.", "Find when two sides become equal."],
    controls: { a: "Vertex x", b: "Height", mode: "Measure" },
  },
  {
    title: "Quadrilaterals",
    kind: "quadrilateral",
    strand: "Geometry",
    summary: "Transform a four-sided shape and compare parallel sides, diagonals, angle properties, and area.",
    examples: ["Parallelogram area", "Rhombus diagonals", "Trapezium parallel sides"],
    prompts: ["Make opposite sides parallel.", "Change diagonal length.", "Keep area stable while skewing the shape."],
    controls: { a: "Skew", b: "Height", mode: "Family" },
  },
  {
    title: "Circles",
    kind: "circle",
    strand: "Geometry",
    summary: "Control radius and angle to connect circumference, area, chord, tangent, sector, and arc length.",
    examples: ["Radius and diameter", "Sector angle and arc", "Tangent perpendicular to radius"],
    prompts: ["Double the radius and observe area.", "Make a quarter sector.", "Move the tangent point."],
    controls: { a: "Radius", b: "Angle", mode: "Object" },
  },
  {
    title: "Statistics",
    kind: "statistics",
    strand: "Data",
    summary: "Change data values and see bars, mean, median, spread, and interpretation update immediately.",
    examples: ["Mean as balance level", "Median as middle value", "Bar chart comparison"],
    prompts: ["Raise one outlier and watch the mean.", "Make two categories equal.", "Compare mean and median."],
    controls: { a: "Selected value", b: "Spread", mode: "Statistic" },
  },
  {
    title: "Relations and functions",
    kind: "relations",
    strand: "Functions",
    summary: "Map inputs to outputs and test when a relation becomes a function with one output per input.",
    examples: ["Arrow mapping", "Function machine", "Domain and range"],
    prompts: ["Create one output per input.", "Break the function rule.", "List the range from the diagram."],
    controls: { a: "Input shift", b: "Output spread", mode: "Mapping" },
  },
  {
    title: "Matrices",
    kind: "matrix",
    strand: "Linear algebra",
    summary: "Edit matrix cells and see grids, transformations, determinant area, and row-column structure.",
    examples: ["2x2 transformation", "Determinant area scale", "Matrix multiplication as chained action"],
    prompts: ["Make the grid wider.", "Flip orientation.", "Find when area scale becomes zero."],
    controls: { a: "Scale", b: "Shear", mode: "Matrix" },
  },
  {
    title: "Derivatives",
    kind: "calculus",
    strand: "Calculus",
    summary: "Move a secant toward a tangent and connect instantaneous rate with the derivative graph.",
    examples: ["Secant slope", "Tangent line", "Derivative as changing slope"],
    prompts: ["Shrink the interval.", "Find a flat tangent.", "Compare steep and shallow regions."],
    controls: { a: "Point", b: "Gap", mode: "Rate" },
  },
  {
    title: "Integrals",
    kind: "calculus",
    strand: "Calculus",
    summary: "Accumulate area with adjustable rectangles and connect visual sums to definite integrals.",
    examples: ["Left/right rectangles", "Area under a curve", "Net signed area"],
    prompts: ["Increase rectangle count.", "Find where area is negative.", "Compare estimate and curve."],
    controls: { a: "Start", b: "Rectangles", mode: "Accumulation" },
  },
  {
    title: "Vector algebra",
    kind: "vector",
    strand: "Vectors",
    summary: "Drag magnitude and direction to see components, addition, resultant vectors, and spatial meaning.",
    examples: ["Vector components", "Head-to-tail addition", "Scalar multiplication"],
    prompts: ["Make opposite vectors.", "Double one vector.", "Predict the resultant direction."],
    controls: { a: "Magnitude", b: "Direction", mode: "Vector" },
  },
  {
    title: "Mensuration",
    kind: "measurement",
    strand: "Measurement",
    summary: "Adjust dimensions and compare perimeter, area, surface area, and volume as linked quantities.",
    examples: ["Rectangle area", "Cylinder volume", "Surface area nets"],
    prompts: ["Double one dimension.", "Keep area fixed.", "Compare 2D and 3D measures."],
    controls: { a: "Length", b: "Depth", mode: "Measure" },
  },
  {
    title: "Sequences and series",
    kind: "pattern",
    strand: "Patterns",
    summary: "Build term-by-term patterns and compare arithmetic, geometric, and accumulated series views.",
    examples: ["Arithmetic progression", "Geometric progression", "Partial sums"],
    prompts: ["Increase common difference.", "Switch to ratio growth.", "Watch partial sums accumulate."],
    controls: { a: "Term", b: "Growth", mode: "Sequence" },
  },
];

export const syllabusUnitConcepts = conceptTemplates.map(concept);

export function syllabusUnitRoute(title: string) {
  return `/syllabus-visual/${slug(title)}`;
}

export function getSyllabusUnitConcept(id: string | undefined): SyllabusUnitConcept | undefined {
  if (!id) return undefined;
  return syllabusUnitConcepts.find((item) => item.id === id);
}

export function createFallbackSyllabusUnitConcept(titleOrId: string): SyllabusUnitConcept {
  const title = titleOrId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return concept({
    title,
    kind: inferKind(title),
    strand: "Interactive mathematics",
    summary: "Explore this syllabus concept with a responsive model, examples, prompts, and linked representations.",
    examples: ["Move the controls and describe what changes", "Compare the visual model with the formula", "Create a new example and explain it"],
    prompts: ["Predict first.", "Move one control.", "Explain the invariant."],
    controls: { a: "Control A", b: "Control B", mode: "Representation" },
  });
}

export function inferKind(title: string): SyllabusUnitKind {
  const lower = title.toLowerCase();
  if (lower.includes("real") || lower.includes("number")) return "real-numbers";
  if (lower.includes("polynomial") || lower.includes("quadratic")) return "polynomial";
  if (lower.includes("coordinate") || lower.includes("straight line") || lower.includes("conic")) return "coordinate";
  if (lower.includes("linear equation") || lower.includes("equation")) return "linear-equation";
  if (lower.includes("euclid") || lower.includes("construction")) return "euclid";
  if (lower.includes("triangle") || lower.includes("heron") || lower.includes("similarity")) return "triangle";
  if (lower.includes("quadrilateral") || lower.includes("parallelogram") || lower.includes("rhombus") || lower.includes("trapez")) return "quadrilateral";
  if (lower.includes("circle") || lower.includes("arc") || lower.includes("tangent")) return "circle";
  if (lower.includes("statistic") || lower.includes("data")) return "statistics";
  if (lower.includes("relation") || lower.includes("function")) return "relations";
  if (lower.includes("matrix") || lower.includes("determinant")) return "matrix";
  if (lower.includes("derivative") || lower.includes("integral") || lower.includes("limit") || lower.includes("continuity")) return "calculus";
  if (lower.includes("vector") || lower.includes("3d") || lower.includes("three-dimensional")) return "vector";
  if (lower.includes("mensuration") || lower.includes("area") || lower.includes("volume") || lower.includes("measure")) return "measurement";
  if (lower.includes("sequence") || lower.includes("series") || lower.includes("progression") || lower.includes("pattern")) return "pattern";
  return "generic";
}
