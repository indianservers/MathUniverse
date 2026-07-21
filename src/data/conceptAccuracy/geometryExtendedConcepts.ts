import { compactConcept } from "./conceptFactory";

export const geometryExtendedConcepts = [
  compactConcept({
    id: "geometry.primitives-angles",
    domain: "geometry",
    title: "Points, lines, rays, segments and angles",
    level: "Foundational",
    precise:
      "Points locate, lines extend both ways, rays extend one way, segments have two endpoints, and an angle measures rotation between rays.",
    learner:
      "Geometry starts with positions and directions; angle measures the turn between two rays.",
    prerequisites: ["measurement"],
    nextConcepts: ["triangles", "parallel lines"],
    grade: "6-8",
    chapter: "Basic Geometrical Ideas",
    notation: [
      { symbol: "∠ABC", meaning: "angle with vertex B" },
      { symbol: "AB̅", meaning: "segment AB" },
    ],
    assumptions: [
      "Euclidean plane geometry.",
      "Angles use degrees unless radians are shown.",
    ],
    domainStatement:
      "Ordinary angle measure is 0° to 360°; segment lengths are nonnegative.",
    formula: "\\text{linear pair}=180^\\circ",
    formulaConditions: ["adjacent non-common rays form a line"],
    invariants: [
      "Vertical opposite angles are equal.",
      "Angles around a point total 360°.",
    ],
    oracle:
      "Vector dot/cross products with normalized angle plus incidence tests.",
    properties: ["a line has no endpoints", "a ray has one endpoint"],
    cases: {
      foundational: [
        "Name the vertex of ∠ABC.",
        "B",
        "The middle letter is the vertex.",
      ],
      visual: [
        "Two lines cross at 40°.",
        "Opposite angle is 40°",
        "Vertical angles are equal.",
      ],
      realWorld: [
        "A road turns from north to east.",
        "90° clockwise",
        "The directions are perpendicular.",
      ],
      misconception: [
        "Does a longer drawn ray make a larger angle?",
        "No",
        "Angle depends on direction, not ray length.",
      ],
      boundary: [
        "What is a zero angle?",
        "Coincident rays",
        "There is no rotation.",
      ],
      challenge: [
        "One linear-pair angle is 3x and the other x+20.",
        "x=40; angles 120°,60°",
        "Their sum is 180°.",
      ],
      connection: [
        "Connect angle to slope.",
        "Direction angle θ has slope tan θ",
        "For nonvertical lines, tangent gives rise/run.",
      ],
    },
    misconceptions: [
      {
        claim: "Angle size depends on arm length.",
        correction: "It depends only on ray directions.",
        counterexample: "Extending both arms preserves the angle.",
      },
      {
        claim: "A line has endpoints.",
        correction: "A segment does; a line extends indefinitely.",
        counterexample: "AB̅ is a segment, while line AB extends both ways.",
      },
    ],
    sourceSection: "Basic Geometrical Ideas",
  }),
  compactConcept({
    id: "geometry.congruence-similarity",
    domain: "geometry",
    title: "Congruence and similarity",
    precise:
      "Congruent figures match by rigid motion; similar figures have equal corresponding angles and one common positive scale factor for lengths.",
    learner:
      "Congruent means same shape and size; similar means same shape, possibly scaled.",
    prerequisites: ["triangles", "ratios"],
    nextConcepts: ["trigonometry", "proof"],
    grade: "7-10",
    chapter: "Triangles and Similarity",
    notation: [
      { symbol: "≅", meaning: "congruent" },
      { symbol: "∼", meaning: "similar" },
      { symbol: "k", meaning: "scale factor" },
    ],
    assumptions: [
      "Corresponding vertices are ordered consistently.",
      "Scale factor is positive.",
    ],
    domainStatement: "All corresponding lengths are positive for ratio tests.",
    formula: "\\frac{AB}{DE}=\\frac{BC}{EF}=\\frac{CA}{FD}=k",
    formulaConditions: ["ABC and DEF are similar with listed correspondence"],
    invariants: ["Similarity preserves angles.", "Areas scale by k²."],
    oracle:
      "Compare sorted angle sets and all corresponding side ratios within tolerance.",
    tolerance: 1e-9,
    properties: [
      "congruence is similarity with k=1",
      "volumes of similar solids scale by k³",
    ],
    cases: {
      foundational: [
        "Triangles have sides 3,4,5 and 6,8,10.",
        "Similar with k=2",
        "All side ratios equal 2.",
      ],
      visual: [
        "Dilate a triangle by k=3.",
        "Angles stay; sides triple",
        "Dilation preserves shape.",
      ],
      realWorld: [
        "A 1.5 m pole casts 2 m shadow; tree shadow is 12 m.",
        "Tree is 9 m",
        "Similar triangles give h/12=1.5/2.",
      ],
      misconception: [
        "Are equal areas enough for congruence?",
        "No",
        "Different shapes may share area.",
      ],
      boundary: [
        "What if k=1?",
        "Figures are congruent",
        "Every corresponding length matches.",
      ],
      challenge: [
        "Similar areas are 25:49; find length ratio.",
        "5:7",
        "Length ratio is square root of area ratio.",
      ],
      connection: [
        "Connect similarity to maps.",
        "Map scale is k",
        "Every map length uses the same scale factor.",
      ],
    },
    misconceptions: [
      {
        claim: "Equal angles imply congruence.",
        correction: "They imply similarity, not necessarily equal size.",
        counterexample:
          "All equilateral triangles have equal angles but different sizes.",
      },
      {
        claim: "Area scales by k.",
        correction: "Area scales by k².",
        counterexample: "Doubling a square side quadruples its area.",
      },
    ],
    sourceSection: "Triangles and Similarity",
  }),
  compactConcept({
    id: "geometry.coordinate",
    domain: "geometry",
    title: "Coordinate geometry",
    precise:
      "Coordinates encode Euclidean position so distance, midpoint, and slope can be computed algebraically.",
    learner:
      "A coordinate grid turns geometric relationships into number calculations.",
    prerequisites: ["coordinate plane", "Pythagoras"],
    nextConcepts: ["analytic geometry", "vectors"],
    grade: "9-10",
    chapter: "Coordinate Geometry",
    notation: [
      { symbol: "(x,y)", meaning: "point coordinates" },
      { symbol: "d", meaning: "distance" },
    ],
    assumptions: [
      "Axes are perpendicular with stated scales.",
      "Distance is Euclidean.",
    ],
    domainStatement:
      "Coordinates are real numbers; slope excludes vertical pairs.",
    formula: "d=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}",
    formulaConditions: ["two points in a Cartesian plane"],
    invariants: [
      "Distance is nonnegative and symmetric.",
      "Midpoint is equidistant from endpoints.",
    ],
    oracle:
      "Direct coordinate differences, hypot, midpoint, and substitution checks.",
    properties: [
      "translation preserves distance",
      "collinear triples have zero signed area",
    ],
    cases: {
      foundational: [
        "Distance from (1,2) to (4,6).",
        "5",
        "Differences 3 and 4 form a 3-4-5 triangle.",
      ],
      visual: [
        "Plot midpoint of (0,0),(6,4).",
        "(3,2)",
        "Average corresponding coordinates.",
      ],
      realWorld: [
        "A robot moves 5 east and 12 north.",
        "13 units from start",
        "Use Pythagoras.",
      ],
      misconception: [
        "Is slope a distance?",
        "No",
        "Slope is signed rise/run and can be negative.",
      ],
      boundary: ["Slope through (2,1),(2,7).", "Undefined", "Run is zero."],
      challenge: [
        "Show (1,1),(3,5),(5,9) are collinear.",
        "Both successive slopes are 2",
        "Equal slopes establish one line.",
      ],
      connection: [
        "Connect distance to circles.",
        "Fixed distance r gives a circle",
        "(x-h)²+(y-k)²=r².",
      ],
    },
    misconceptions: [
      {
        claim: "Distance can be negative.",
        correction: "Euclidean distance is nonnegative.",
        counterexample: "Reversing endpoints still gives distance 5.",
      },
      {
        claim: "A vertical line has slope zero.",
        correction: "Its slope is undefined.",
        counterexample: "Its run is zero, so rise/run divides by zero.",
      },
    ],
    sourceSection: "Coordinate Geometry",
  }),
  compactConcept({
    id: "geometry.transformations-symmetry",
    domain: "geometry",
    title: "Transformations and symmetry",
    precise:
      "Translations, rotations, and reflections are distance-preserving rigid motions; dilations preserve shape with a scale factor.",
    learner:
      "Move, turn, flip, or resize a figure while tracking exactly what stays unchanged.",
    prerequisites: ["coordinates", "angles"],
    nextConcepts: ["congruence", "matrices"],
    grade: "7-10",
    chapter: "Symmetry and Transformations",
    notation: [
      { symbol: "T(x,y)", meaning: "transformed point" },
      { symbol: "k", meaning: "dilation factor" },
    ],
    assumptions: [
      "Transformations act in a Cartesian plane.",
      "Rotation orientation is stated.",
    ],
    domainStatement:
      "All real coordinate points; dilation center and factor must be specified.",
    formula: "R_{90^\\circ}(x,y)=(-y,x)",
    formulaConditions: ["counterclockwise rotation about origin"],
    invariants: [
      "Rigid motions preserve all distances and angles.",
      "A reflection reverses orientation.",
    ],
    oracle:
      "Apply transformation matrices and compare pairwise distances/determinants.",
    properties: [
      "composition order can matter",
      "dilation scales length by |k|",
    ],
    cases: {
      foundational: [
        "Translate (2,-1) by (3,4).",
        "(5,3)",
        "Add the translation vector.",
      ],
      visual: ["Reflect (4,2) across y-axis.", "(-4,2)", "Negate x only."],
      realWorld: [
        "Rotate a floor-plan symbol 90°.",
        "Use (x,y)→(-y,x)",
        "All lengths remain fixed.",
      ],
      misconception: [
        "Do reflections preserve orientation?",
        "No",
        "Clockwise vertex order becomes counterclockwise.",
      ],
      boundary: [
        "Dilate by k=0.",
        "Every point maps to the center",
        "This loses shape and is not invertible.",
      ],
      challenge: [
        "Rotate (3,-2) by 180° then reflect in x-axis.",
        "(-3,-2)",
        "Rotation gives (-3,2), reflection gives (-3,-2).",
      ],
      connection: [
        "Connect transformations to matrices.",
        "Linear maps multiply coordinate vectors",
        "Rotation/reflection formulas are matrix actions.",
      ],
    },
    misconceptions: [
      {
        claim: "Every transformation preserves size.",
        correction: "Dilations generally change size.",
        counterexample: "k=2 doubles lengths.",
      },
      {
        claim: "Composition order never matters.",
        correction: "Many transformations do not commute.",
        counterexample:
          "Translate then rotate differs from rotate then translate.",
      },
    ],
    sourceSection: "Symmetry and Transformations",
  }),
  compactConcept({
    id: "geometry.mensuration-2d",
    domain: "geometry",
    title: "Two-dimensional mensuration",
    precise:
      "Perimeter measures boundary length and area measures planar region using square units.",
    learner: "Measure around a shape for perimeter and inside it for area.",
    prerequisites: ["length", "multiplication"],
    nextConcepts: ["integration", "surface area"],
    grade: "6-10",
    chapter: "Mensuration",
    notation: [
      { symbol: "P", meaning: "perimeter", unit: "length units" },
      { symbol: "A", meaning: "area", unit: "square units" },
    ],
    assumptions: [
      "Dimensions use compatible units.",
      "Composite regions do not double-count overlaps.",
    ],
    domainStatement:
      "Lengths are nonnegative; formula-specific dimensions must define a valid figure.",
    formula: "A_{triangle}=\\frac12 bh",
    formulaConditions: ["h is perpendicular to base b"],
    invariants: [
      "Area scales by k² under dilation.",
      "Cut-and-rearrange preserves area.",
    ],
    oracle:
      "Decompose into primitives and independently sum/subtract exact areas.",
    properties: [
      "perimeter is additive along exposed boundary",
      "area uses square units",
    ],
    cases: {
      foundational: [
        "Area of triangle b=8,h=5.",
        "20 square units",
        "Half of 8×5.",
      ],
      visual: [
        "Cut a parallelogram and rearrange.",
        "Rectangle with area bh",
        "Rearrangement preserves area.",
      ],
      realWorld: [
        "Tile a 4 m by 3 m floor with 0.25 m² tiles.",
        "48 tiles",
        "Area 12 divided by 0.25.",
      ],
      misconception: [
        "Same perimeter means same area?",
        "No",
        "A 1×5 and 2×4 rectangle both have perimeter 12 but areas 5 and 8.",
      ],
      boundary: [
        "Triangle height is 0.",
        "Area 0",
        "The figure collapses to a segment.",
      ],
      challenge: ["Area of annulus R=5,r=3.", "16π", "Subtract πr² from πR²."],
      connection: [
        "Connect area to integration.",
        "An integral sums thin strips",
        "The limiting strip sum measures curved regions.",
      ],
    },
    misconceptions: [
      {
        claim: "Area and perimeter use the same units.",
        correction: "Area uses squared units.",
        counterexample: "A 2 m square has perimeter 8 m and area 4 m².",
      },
      {
        claim: "A slanted side is always triangle height.",
        correction: "Height must be perpendicular to the chosen base.",
        counterexample:
          "In a non-right triangle the altitude differs from a side.",
      },
    ],
    sourceSection: "Areas Related to Plane Figures",
  }),
  compactConcept({
    id: "geometry.orthographic",
    domain: "geometry",
    title: "Orthographic projections",
    precise:
      "Orthographic views project a 3D object perpendicularly onto mutually perpendicular planes, preserving aligned dimensions but hiding depth.",
    learner:
      "Front, top, and side views describe one solid from three perpendicular directions.",
    prerequisites: ["2D shapes", "3D solids"],
    nextConcepts: ["technical drawing", "vectors"],
    grade: "7-10",
    chapter: "Visualising Solid Shapes",
    notation: [
      { symbol: "front/top/side", meaning: "principal projection plane" },
    ],
    assumptions: [
      "Projection rays are perpendicular to the plane.",
      "Views share aligned scale.",
    ],
    domainStatement:
      "A specified 3D solid and viewing direction define each 2D projection.",
    formula: "P_{xy}(x,y,z)=(x,y)",
    formulaConditions: ["orthographic projection onto xy-plane"],
    invariants: [
      "Top/front views share width alignment.",
      "Front/side views share height alignment.",
    ],
    oracle:
      "Project all vertices, form visible silhouettes, and compare shared extents.",
    properties: [
      "depth collapses along viewing direction",
      "multiple solids can share one view",
    ],
    cases: {
      foundational: [
        "Top view of a vertical cylinder.",
        "Circle",
        "Depth along the axis collapses.",
      ],
      visual: [
        "Views of a cube.",
        "Three equal squares",
        "Each principal face is square.",
      ],
      realWorld: [
        "Why use three views in manufacturing?",
        "To recover width, height, and depth",
        "One view hides one dimension.",
      ],
      misconception: [
        "Does one view uniquely determine a solid?",
        "Usually no",
        "Different depths can share a front silhouette.",
      ],
      boundary: [
        "Project a zero-thickness plate face-on.",
        "Its full 2D shape",
        "The projection preserves dimensions in the plane.",
      ],
      challenge: [
        "Front is 4×3, top 4×2, side 2×3.",
        "A 4×2×3 cuboid is consistent",
        "Shared dimensions align across views.",
      ],
      connection: [
        "Connect projection to coordinates.",
        "Drop one coordinate",
        "Projection onto xy removes z.",
      ],
    },
    misconceptions: [
      {
        claim: "Hidden depth is zero.",
        correction: "It is omitted from that view, not necessarily zero.",
        counterexample: "A cube front view is a square but the cube has depth.",
      },
      {
        claim: "Perspective shrinkage applies.",
        correction:
          "Orthographic projection uses parallel rays and no distance shrinkage.",
        counterexample: "Equal parallel edges remain equal in the view.",
      },
    ],
    sourceSection: "Visualising Solid Shapes",
  }),
  compactConcept({
    id: "geometry.fractals",
    domain: "geometry",
    title: "Fractals and self-similarity",
    level: "Advanced",
    precise:
      "A fractal is generated by repeated structure across scales and may have a non-integer similarity dimension.",
    learner:
      "Repeat a simple geometric rule and intricate self-similar patterns emerge.",
    prerequisites: ["similarity", "exponents"],
    nextConcepts: ["limits", "complex dynamics"],
    grade: "9-12 enrichment",
    chapter: "Fractals and Iteration",
    notation: [
      { symbol: "D", meaning: "similarity dimension" },
      { symbol: "N", meaning: "number of scaled copies" },
    ],
    assumptions: [
      "Exact self-similarity uses identical scaled copies.",
      "Similarity dimension formula needs a common scale ratio.",
    ],
    domainStatement: "For N copies each scaled by r, N>0 and 0<r<1.",
    formula: "D=\\frac{\\log N}{\\log(1/r)}",
    formulaConditions: ["N self-similar copies", "common scale factor r"],
    invariants: [
      "Each iteration follows the same replacement rule.",
      "Counts and scale agree with the construction.",
    ],
    oracle:
      "Generate iteration combinatorially and verify segment count, scale, and bounding box.",
    properties: [
      "finite iterations are approximations",
      "dimension can be non-integer",
    ],
    cases: {
      foundational: [
        "Koch rule replaces one segment by four at scale 1/3.",
        "D=log4/log3",
        "Use N=4,r=1/3.",
      ],
      visual: [
        "Compare two Sierpiński iterations.",
        "Three scaled copies per step",
        "Each copy has half the side length.",
      ],
      realWorld: [
        "Why use fractals for coastlines?",
        "Detail appears at many scales",
        "Measured length changes with ruler scale.",
      ],
      misconception: [
        "Is every repeating pattern a fractal?",
        "No",
        "Scale-dependent self-similarity is essential.",
      ],
      boundary: [
        "Iteration 0 of a Koch curve.",
        "One segment",
        "No replacement has occurred.",
      ],
      challenge: [
        "Find Sierpiński dimension.",
        "log3/log2≈1.585",
        "N=3,r=1/2.",
      ],
      connection: [
        "Connect fractals to sequences.",
        "Feature counts grow geometrically",
        "At iteration n, Koch has 4^n segments.",
      ],
    },
    misconceptions: [
      {
        claim: "A screen rendering is an infinite fractal.",
        correction: "It is a finite approximation.",
        counterexample: "Pixels impose a smallest visible scale.",
      },
      {
        claim: "Dimension must be an integer.",
        correction: "Similarity dimension may be fractional.",
        counterexample: "Sierpiński triangle has dimension about 1.585.",
      },
    ],
    sourceSection: "Fractals and Iteration",
  }),
];
