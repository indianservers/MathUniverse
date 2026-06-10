export type GuidedActivityPhase = "predict" | "manipulate" | "check" | "reflect";

export type SyllabusWorkspaceTemplate = {
  id: string;
  title: string;
  unit: string;
  description: string;
  command: string;
  focus: "algebra" | "geometry" | "3d";
  outcomes: string[];
  steps: { phase: GuidedActivityPhase; title: string; prompt: string; reveal: string }[];
};

export const syllabusWorkspaceTemplates: SyllabusWorkspaceTemplate[] = [
  {
    id: "polynomials",
    title: "Polynomial Roots And Shape",
    unit: "Polynomials",
    description: "Connect factors, zeros, graph crossings, and coefficient changes in one workspace.",
    command: "plot x^2-5*x+6",
    focus: "algebra",
    outcomes: ["Zeros as x-intercepts", "Factor form and expanded form", "Coefficient sliders for curve changes"],
    steps: [
      { phase: "predict", title: "Predict crossings", prompt: "Where will x^2 - 5x + 6 meet the x-axis?", reveal: "The roots are 2 and 3, so the graph crosses at (2,0) and (3,0)." },
      { phase: "manipulate", title: "Move the shape", prompt: "Change a and b in the graph panel and watch the vertex and roots move.", reveal: "Changing coefficients changes both the opening and the intercepts." },
      { phase: "check", title: "Check by solving", prompt: "Run solve x^2-5*x+6=0 and compare the CAS result with the graph.", reveal: "The symbolic and visual answers should agree." },
      { phase: "reflect", title: "Explain the link", prompt: "Write how factors, roots, and intercepts are the same idea in three languages.", reveal: "Algebra, graph, and table are linked representations." },
    ],
  },
  {
    id: "circles",
    title: "Circle Radius, Tangent, And Area",
    unit: "Circles",
    description: "Build a circle, drag the radius point, and connect live measurements to formulas.",
    command: "area circle radius 5",
    focus: "geometry",
    outcomes: ["Radius as distance", "Area formula", "Point-on-circle dependency"],
    steps: [
      { phase: "predict", title: "Predict radius", prompt: "Before dragging, estimate the circle radius from the grid.", reveal: "The measurement panel reports radius in grid units." },
      { phase: "manipulate", title: "Drag radius point", prompt: "Drag the edge point and watch the radius and area idea update.", reveal: "A circle is the set of points at one fixed distance from the center." },
      { phase: "check", title: "Check formula", prompt: "Run area circle radius 5 and compare with pi r^2.", reveal: "Area grows with the square of radius, not linearly." },
      { phase: "reflect", title: "Connect theorem", prompt: "Explain why every point on the circle stays the same distance from the center.", reveal: "That fixed distance is the definition of a circle." },
    ],
  },
  {
    id: "quadrilaterals",
    title: "Quadrilateral Properties Lab",
    unit: "Quadrilaterals",
    description: "Drag vertices and inspect side lengths, diagonals, area, and parallel structure.",
    command: "table x^2",
    focus: "geometry",
    outcomes: ["Area by decomposition", "Parallel sides", "Dragging invariant properties"],
    steps: [
      { phase: "predict", title: "Predict invariant", prompt: "Which properties should stay true when a parallelogram is dragged?", reveal: "Opposite sides stay parallel and equal when the dependency is built correctly." },
      { phase: "manipulate", title: "Drag vertices", prompt: "Move a vertex and watch the live area and side measurements.", reveal: "Shape changes can preserve selected relationships." },
      { phase: "check", title: "Check measurements", prompt: "Compare opposite side lengths in the measurement panel.", reveal: "Measurements turn visual claims into evidence." },
      { phase: "reflect", title: "Name the class", prompt: "Decide whether the current shape is a parallelogram, rectangle, rhombus, or general quadrilateral.", reveal: "A quadrilateral can belong to multiple subfamilies." },
    ],
  },
  {
    id: "coordinate-geometry",
    title: "Coordinate Geometry Point And Slope",
    unit: "Coordinate Geometry",
    description: "Plot points, drag them, and connect coordinates to slope and distance.",
    command: "intersect x^2 and 2*x+3",
    focus: "geometry",
    outcomes: ["Ordered pairs", "Slope from two points", "Intersection as a shared solution"],
    steps: [
      { phase: "predict", title: "Predict point location", prompt: "Where should point A be if x increases and y decreases?", reveal: "Positive x moves right; smaller y moves up on this screen coordinate board." },
      { phase: "manipulate", title: "Move points", prompt: "Use arrow keys on a selected point for precise coordinate movement.", reveal: "Keyboard nudging supports accurate construction and accessibility." },
      { phase: "check", title: "Check intersection", prompt: "Run the intersection command and compare algebraic and visual crossings.", reveal: "An intersection is a point satisfying both equations." },
      { phase: "reflect", title: "Describe the model", prompt: "Explain how a coordinate pair locates a point without drawing first.", reveal: "Coordinates are instructions for horizontal and vertical displacement." },
    ],
  },
  {
    id: "3d-solids",
    title: "3D Solids And Cross Sections",
    unit: "3D Geometry",
    description: "Manipulate solids, surfaces, and slicing planes with editable object transforms.",
    command: "plot x^2",
    focus: "3d",
    outcomes: ["3D transforms", "Cross-section plane", "Surface and solid comparison"],
    steps: [
      { phase: "predict", title: "Predict slice", prompt: "What shape will the slice make through the selected solid?", reveal: "Cross-sections reveal hidden 2D shapes inside 3D objects." },
      { phase: "manipulate", title: "Move objects", prompt: "Select a 3D object and edit x, y, z, rotation, size, and visibility.", reveal: "Transform controls make 3D math inspectable." },
      { phase: "check", title: "Pause and inspect", prompt: "Pause rotation and compare the surface with the slicing plane.", reveal: "A still scene is better for proof and discussion." },
      { phase: "reflect", title: "Generalize", prompt: "How does changing height/radius affect the model?", reveal: "Parameters control whole families of objects." },
    ],
  },
  {
    id: "number-systems",
    title: "Real Number Line And Classification",
    unit: "Number Systems",
    description: "Classify rational, irrational, and real numbers while placing exact and approximate values on one line.",
    command: "DynamicTable[x, sqrt(x), 1, 16, 1]",
    focus: "algebra",
    outcomes: ["Number classification", "Root locations", "Exact versus approximate values"],
    steps: [
      { phase: "predict", title: "Predict type", prompt: "Choose a value and predict whether it is rational or irrational before checking the table.", reveal: "Perfect square roots are rational; non-perfect square roots are irrational." },
      { phase: "manipulate", title: "Move on the line", prompt: "Change the value and compare exact root notation with decimal position.", reveal: "A decimal approximation can locate an irrational number without ending or repeating." },
      { phase: "check", title: "Check classification", prompt: "Use the dynamic table to compare x and sqrt(x) for perfect and non-perfect squares.", reveal: "The table separates exact square roots from approximations." },
      { phase: "reflect", title: "Explain real numbers", prompt: "Explain how rational and irrational numbers both live on the same continuous number line.", reveal: "Real numbers include all points on the number line." },
    ],
  },
  {
    id: "linear-equations",
    title: "Linear Equations And Intersections",
    unit: "Linear Equations",
    description: "Turn equations into lines, compare slopes, and read solutions as intersections.",
    command: "Intersect[2*x+3, -x+6]",
    focus: "algebra",
    outcomes: ["Slope and intercept", "Solution as intersection", "Parallel and perpendicular comparison"],
    steps: [
      { phase: "predict", title: "Predict intersection", prompt: "Estimate where two lines will meet before running the intersection command.", reveal: "The shared point satisfies both equations." },
      { phase: "manipulate", title: "Change slope", prompt: "Adjust line coefficients and watch the intersection move or disappear.", reveal: "Equal slopes with different intercepts create parallel lines." },
      { phase: "check", title: "Check algebraically", prompt: "Run Intersect and substitute the point into both equations.", reveal: "Both left and right sides match at the solution point." },
      { phase: "reflect", title: "Represent the solution", prompt: "Describe the same solution as a graph point, ordered pair, and equation result.", reveal: "Multiple representations make the same relation easier to verify." },
    ],
  },
  {
    id: "euclid-geometry",
    title: "Euclid Axiom And Proof Flow",
    unit: "Euclid Geometry",
    description: "Sequence axioms, postulates, diagrams, and proof statements with revealable reasoning.",
    command: "Relation[Line[(0,0),(1,0)], Line[(0,1),(1,1)]]",
    focus: "geometry",
    outcomes: ["Axiom versus theorem", "Proof sequence", "Diagram-to-statement reasoning"],
    steps: [
      { phase: "predict", title: "Predict relation", prompt: "Look at two visual statements and predict which axiom or postulate supports them.", reveal: "A proof step must cite a known statement, not just visual appearance." },
      { phase: "manipulate", title: "Reorder proof", prompt: "Use construction protocol steps to place dependencies before conclusions.", reveal: "Proofs are dependency graphs: conclusions depend on earlier facts." },
      { phase: "check", title: "Check relation", prompt: "Run a relation command and compare the result with the written statement.", reveal: "The engine can verify simple geometric relations such as parallel or perpendicular." },
      { phase: "reflect", title: "Name the logic", prompt: "Explain why a theorem is stronger than a single drawing.", reveal: "A theorem applies to every valid case, not only the current diagram." },
    ],
  },
  {
    id: "triangles",
    title: "Triangle Angles, Congruence, And Area",
    unit: "Triangles",
    description: "Drag triangle vertices and validate angle sum, side relations, area, and congruence evidence.",
    command: "Angle[(1,0), (0,0), (0,1)]",
    focus: "geometry",
    outcomes: ["Angle sum", "Congruence criteria", "Area from base and height"],
    steps: [
      { phase: "predict", title: "Predict angle sum", prompt: "Before measuring, predict how the three angles change when one vertex moves.", reveal: "The individual angles change, but the total remains 180 degrees." },
      { phase: "manipulate", title: "Drag a vertex", prompt: "Move one vertex and observe sides, height, and angle labels.", reveal: "Dragging changes shape while preserving selected triangle constraints." },
      { phase: "check", title: "Check measures", prompt: "Measure angles or sides and decide which congruence rule could apply.", reveal: "SSS, SAS, ASA, and RHS use different evidence sets." },
      { phase: "reflect", title: "Explain invariant", prompt: "Explain why angle sum remains fixed even when the triangle shape changes.", reveal: "Triangle angle sum follows from parallel-line angle relations." },
    ],
  },
  {
    id: "trigonometry",
    title: "Unit Circle And Trig Ratios",
    unit: "Trigonometry",
    description: "Connect right-triangle ratios, unit-circle coordinates, and wave tables.",
    command: "DynamicTable[sin(x), cos(x), -3, 3, 0.5]",
    focus: "algebra",
    outcomes: ["Sine and cosine as coordinates", "Trig ratios", "Periodic behavior"],
    steps: [
      { phase: "predict", title: "Predict signs", prompt: "Predict the signs of sine and cosine in the current quadrant.", reveal: "The x-coordinate gives cosine and the y-coordinate gives sine." },
      { phase: "manipulate", title: "Rotate angle", prompt: "Move the angle or table range and watch sine/cosine values repeat.", reveal: "Trig functions repeat because circular motion repeats." },
      { phase: "check", title: "Check table", prompt: "Use the dynamic table to identify zeroes and maximum/minimum values.", reveal: "Zeros and extrema appear as special rows in the table." },
      { phase: "reflect", title: "Connect models", prompt: "Explain how a triangle ratio becomes a graph wave.", reveal: "The same circular coordinates unfold into periodic graphs." },
    ],
  },
  {
    id: "statistics",
    title: "Statistics Data And Feedback Lab",
    unit: "Statistics",
    description: "Enter data, compute summaries, spot outliers, and compare center/spread visually.",
    command: "List[2, 4, 4, 5, 9]",
    focus: "algebra",
    outcomes: ["Mean, median, range", "Outlier effect", "Data-to-chart connection"],
    steps: [
      { phase: "predict", title: "Predict center", prompt: "Before computing, predict which value best represents the data center.", reveal: "Mean and median can disagree when data is skewed." },
      { phase: "manipulate", title: "Change data", prompt: "Add a high value and observe how mean, median, and range respond.", reveal: "The mean is sensitive to outliers; the median is more stable." },
      { phase: "check", title: "Check summary", prompt: "Run the list command and verify n, sum, mean, min, and max.", reveal: "A summary should match the raw data, not replace it." },
      { phase: "reflect", title: "Choose measure", prompt: "Explain whether mean or median is more useful for this data set.", reveal: "The best measure depends on shape, outliers, and the question being asked." },
    ],
  },
];

export function getSyllabusWorkspaceTemplate(id: string) {
  return syllabusWorkspaceTemplates.find((template) => template.id === id);
}
