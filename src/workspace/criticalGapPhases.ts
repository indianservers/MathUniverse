export type CriticalGapPhase = {
  id: number;
  title: string;
  goal: string;
  gaps: string[];
  deliverables: string[];
};

export const criticalGapImplementationPhases: CriticalGapPhase[] = [
  {
    id: 1,
    title: "Dynamic Core And Command Foundation",
    goal: "Make every workspace object addressable, dependency-aware, and discoverable from one command catalog.",
    gaps: ["True Dynamic Object Kernel", "Unified Algebra View Parity", "GeoGebra-Level Command Language"],
    deliverables: ["Central dependency graph", "Cycle and missing dependency detection", "Command catalog by math domain", "Algebra panel health indicators"],
  },
  {
    id: 2,
    title: "2D Geometry Kernel And Intersections",
    goal: "Upgrade construction tools from simplified helpers into robust dynamic geometry objects.",
    gaps: ["2D Geometry Tool Completeness", "Robust Intersection Engine"],
    deliverables: ["Segment/ray/vector/conic models", "Relation checker", "Conic/function intersection layer", "Proof and measurement objects"],
  },
  {
    id: 3,
    title: "3D Calculator And Gizmos",
    goal: "Turn the 3D view into a construction calculator with real objects, snapping, overlays, and transform handles.",
    gaps: ["3D Calculator Depth", "3D Transform Gizmos"],
    deliverables: ["3D object constructors", "Plane and surface intersections", "Axis/ring/scale gizmos", "3D measurement and labels"],
  },
  {
    id: 4,
    title: "CAS, Spreadsheet, And Dynamic Tables",
    goal: "Make symbolic, spreadsheet, and tabular workflows first-class and linked to graph/geometry/3D objects.",
    gaps: ["CAS Power", "Spreadsheet Parity", "Table View"],
    deliverables: ["Expanded CAS commands", "Matrix/list support", "Cell range formulas and fill", "Dynamic table view with graph linking"],
  },
];
