export type LibraryKind = "lesson" | "worksheet" | "activity" | "assignment";
export type AudienceMode = "Kid" | "Teacher" | "Both";

export type LibraryItem = {
  id: string;
  title: string;
  kind: LibraryKind;
  gradeBand: string;
  topic: string;
  route: string;
  duration: number;
  audience: AudienceMode;
  summary: string;
  outcomes: string[];
  tags: string[];
};

export const contentLibrary: LibraryItem[] = [
  {
    id: "shape-story-area",
    title: "Shape Story: Build a Playground",
    kind: "activity",
    gradeBand: "Class 3-5",
    topic: "Shapes",
    route: "/shapes",
    duration: 25,
    audience: "Kid",
    summary: "Students choose 2D and 3D shapes to design a playground while discovering area, perimeter, and volume.",
    outcomes: ["Identify common shapes", "Connect dimensions to formulas", "Explain a design choice"],
    tags: ["kid mode", "story", "badges", "area"],
  },
  {
    id: "geometry-constraints",
    title: "Construct, Drag, Constrain",
    kind: "lesson",
    gradeBand: "Class 7-10",
    topic: "Geometry",
    route: "/workspace",
    duration: 35,
    audience: "Both",
    summary: "Use draggable points, lines, circles, parallel/perpendicular constraints, midpoints, and intersections.",
    outcomes: ["Create constructions", "Measure live distances", "Explain invariant properties"],
    tags: ["geometry engine", "constraints", "measurements"],
  },
  {
    id: "desmos-style-graphing",
    title: "Graphing Lab: Sliders and Inequalities",
    kind: "lesson",
    gradeBand: "Class 8-12",
    topic: "Graphing",
    route: "/workspace",
    duration: 40,
    audience: "Both",
    summary: "Plot multiple functions, use a and b sliders, shade inequalities, read tables, and add regression.",
    outcomes: ["Compare graph families", "Use parameters", "Read table values"],
    tags: ["graphing", "sliders", "inequalities", "tables"],
  },
  {
    id: "symbolic-solving",
    title: "CAS Steps: Solve, Factor, Differentiate",
    kind: "worksheet",
    gradeBand: "Class 9-12",
    topic: "Algebra and Calculus",
    route: "/workspace",
    duration: 30,
    audience: "Teacher",
    summary: "A guided worksheet where learners predict steps, run CAS, and verify with graph/table outputs.",
    outcomes: ["Solve equations", "Check exact forms", "Verify numerically"],
    tags: ["CAS", "steps", "symbolic", "worksheet"],
  },
  {
    id: "eclipse-inquiry",
    title: "Solar and Lunar Eclipse Inquiry",
    kind: "activity",
    gradeBand: "Class 8-10",
    topic: "Trigonometry",
    route: "/trigonometry",
    duration: 30,
    audience: "Both",
    summary: "Move alignment, apparent diameter, and light cone angle to classify eclipse cases.",
    outcomes: ["Use apparent angle", "Explain shadows", "Classify eclipse type"],
    tags: ["trigonometry", "inquiry", "light"],
  },
  {
    id: "statistics-bridge",
    title: "Statistics and Probability Data Lab",
    kind: "assignment",
    gradeBand: "Class 7-12",
    topic: "Statistics",
    route: "/probability-statistics",
    duration: 35,
    audience: "Teacher",
    summary: "Use native charts, sampling, variation, regression, and uncertainty labs with class datasets.",
    outcomes: ["Collect data", "Compare samples", "Reflect on uncertainty"],
    tags: ["statistics", "probability", "data lab"],
  },
];

export const assignmentTemplates = [
  {
    title: "Prediction Check Lab",
    mode: "Inquiry",
    instructions: "Students write a prediction, test with a slider, capture evidence, and submit a reflection.",
    evidence: ["Prediction", "Screenshot or values", "One-sentence reflection"],
  },
  {
    title: "Construct and Explain",
    mode: "Geometry",
    instructions: "Students create a construction with at least one constraint and explain what stays fixed while dragging.",
    evidence: ["Construction name", "Constraint used", "Measurement before/after dragging"],
  },
  {
    title: "Graph Family Investigation",
    mode: "Graphing",
    instructions: "Students graph y=a*x+b, change sliders, fill a table, and describe how a and b affect the graph.",
    evidence: ["Two slider settings", "Table values", "Pattern explanation"],
  },
];
