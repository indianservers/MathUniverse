export type VisualDictionaryKind =
  | "angle"
  | "circle"
  | "triangle"
  | "graph"
  | "number-line"
  | "set"
  | "matrix"
  | "vector"
  | "solid"
  | "fraction"
  | "probability"
  | "sequence"
  | "coordinate"
  | "logic"
  | "text";

export type VisualDictionaryCategory =
  | "Algebra"
  | "Arithmetic"
  | "Calculus"
  | "Geometry"
  | "Linear Algebra"
  | "Logic"
  | "Number Theory"
  | "Probability"
  | "Set Theory"
  | "Statistics"
  | "Trigonometry";

export type VisualDictionaryTerm = {
  term: string;
  category: VisualDictionaryCategory;
  kind: VisualDictionaryKind;
  keywords: string[];
};

const rawTerms: Array<[string, VisualDictionaryCategory, VisualDictionaryKind, string?]> = [
  ["Abacus", "Arithmetic", "number-line"], ["Absolute value", "Algebra", "number-line"], ["Acute angle", "Geometry", "angle"], ["Addition", "Arithmetic", "number-line"], ["Adjacent angles", "Geometry", "angle"], ["Algebra", "Algebra", "graph"], ["Altitude", "Geometry", "triangle"], ["Angle", "Geometry", "angle"],
  ["Arc", "Geometry", "circle"], ["Area", "Geometry", "solid"], ["Arithmetic mean", "Statistics", "sequence"], ["Arithmetic sequence", "Algebra", "sequence"], ["Associative property", "Algebra", "text"], ["Asymptote", "Calculus", "graph"], ["Axis", "Geometry", "coordinate"], ["Axis of symmetry", "Geometry", "coordinate"],
  ["Bar graph", "Statistics", "probability"], ["Base", "Geometry", "triangle"], ["Base ten", "Arithmetic", "number-line"], ["Bearing", "Trigonometry", "angle"], ["Biconditional", "Logic", "logic"], ["Binomial", "Algebra", "graph"], ["Bisector", "Geometry", "angle"], ["Box plot", "Statistics", "probability"],
  ["Braces", "Set Theory", "set"], ["Brackets", "Algebra", "text"], ["Breadth", "Geometry", "solid"], ["Cartesian plane", "Geometry", "coordinate"], ["Chord", "Geometry", "circle"], ["Circle", "Geometry", "circle"], ["Circumcenter", "Geometry", "triangle"], ["Circumference", "Geometry", "circle"],
  ["Coefficient", "Algebra", "graph"], ["Collinear points", "Geometry", "coordinate"], ["Combination", "Probability", "probability"], ["Common factor", "Number Theory", "set"], ["Common multiple", "Number Theory", "number-line"], ["Commutative property", "Algebra", "text"], ["Complement", "Set Theory", "set"], ["Complex number", "Algebra", "coordinate"],
  ["Composite number", "Number Theory", "number-line"], ["Cone", "Geometry", "solid"], ["Congruent", "Geometry", "triangle"], ["Constant", "Algebra", "graph"], ["Coordinate", "Geometry", "coordinate"], ["Cosine", "Trigonometry", "triangle"], ["Cube", "Geometry", "solid"], ["Cuboid", "Geometry", "solid"],
  ["Cylinder", "Geometry", "solid"], ["Data", "Statistics", "probability"], ["Decimal", "Arithmetic", "fraction"], ["Decreasing function", "Calculus", "graph"], ["Degree", "Geometry", "angle"], ["Denominator", "Arithmetic", "fraction"], ["Dependent event", "Probability", "probability"], ["Derivative", "Calculus", "graph"],
  ["Diagonal", "Geometry", "solid"], ["Diameter", "Geometry", "circle"], ["Difference", "Arithmetic", "number-line"], ["Digit", "Arithmetic", "number-line"], ["Direct proportion", "Algebra", "graph"], ["Disjoint sets", "Set Theory", "set"], ["Distributive property", "Algebra", "text"], ["Dividend", "Arithmetic", "number-line"],
  ["Divisor", "Number Theory", "number-line"], ["Domain", "Algebra", "set"], ["Dot product", "Linear Algebra", "vector"], ["Edge", "Geometry", "solid"], ["Element", "Set Theory", "set"], ["Ellipse", "Geometry", "circle"], ["Empty set", "Set Theory", "set"], ["Equation", "Algebra", "graph"],
  ["Equilateral triangle", "Geometry", "triangle"], ["Equivalent fractions", "Arithmetic", "fraction"], ["Estimate", "Arithmetic", "number-line"], ["Even number", "Number Theory", "number-line"], ["Event", "Probability", "probability"], ["Exponent", "Algebra", "graph"], ["Expression", "Algebra", "text"], ["Exterior angle", "Geometry", "angle"],
  ["Face", "Geometry", "solid"], ["Factor", "Number Theory", "set"], ["Factorial", "Probability", "sequence"], ["Frequency", "Statistics", "probability"], ["Fraction", "Arithmetic", "fraction"], ["Function", "Algebra", "graph"], ["Gradient", "Calculus", "graph"], ["Graph", "Algebra", "graph"],
  ["Greatest common divisor", "Number Theory", "set", "gcd hcf"], ["Greater than", "Arithmetic", "number-line"], ["Height", "Geometry", "triangle"], ["Histogram", "Statistics", "probability"], ["Hypotenuse", "Geometry", "triangle"], ["Identity", "Algebra", "text"], ["Image", "Algebra", "coordinate"], ["Improper fraction", "Arithmetic", "fraction"],
  ["Increasing function", "Calculus", "graph"], ["Independent event", "Probability", "probability"], ["Inequality", "Algebra", "number-line"], ["Integer", "Arithmetic", "number-line"], ["Intercept", "Algebra", "graph"], ["Interior angle", "Geometry", "angle"], ["Intersection", "Set Theory", "set"], ["Interval", "Algebra", "number-line"],
  ["Inverse", "Algebra", "graph"], ["Irrational number", "Number Theory", "number-line"], ["Isosceles triangle", "Geometry", "triangle"], ["Iteration", "Algebra", "sequence"], ["Joint probability", "Probability", "probability"], ["Kite", "Geometry", "solid"], ["Least common multiple", "Number Theory", "number-line", "lcm"], ["Length", "Geometry", "solid"],
  ["Less than", "Arithmetic", "number-line"], ["Limit", "Calculus", "graph"], ["Line", "Geometry", "coordinate"], ["Line segment", "Geometry", "coordinate"], ["Linear equation", "Algebra", "graph"], ["Logarithm", "Algebra", "graph"], ["Matrix", "Linear Algebra", "matrix"], ["Mean", "Statistics", "probability"],
  ["Median", "Statistics", "probability"], ["Midpoint", "Geometry", "coordinate"], ["Mode", "Statistics", "probability"], ["Multiple", "Number Theory", "number-line"], ["Natural number", "Number Theory", "number-line"], ["Negative number", "Arithmetic", "number-line"], ["Net", "Geometry", "solid"], ["Null set", "Set Theory", "set"],
  ["Number line", "Arithmetic", "number-line"], ["Numerator", "Arithmetic", "fraction"], ["Obtuse angle", "Geometry", "angle"], ["Odd number", "Number Theory", "number-line"], ["Ordered pair", "Geometry", "coordinate"], ["Origin", "Geometry", "coordinate"], ["Outcome", "Probability", "probability"], ["Outlier", "Statistics", "probability"],
  ["Parallel lines", "Geometry", "coordinate"], ["Parabola", "Algebra", "graph"], ["Parentheses", "Algebra", "text"], ["Percent", "Arithmetic", "fraction"], ["Perimeter", "Geometry", "solid"], ["Permutation", "Probability", "probability"], ["Perpendicular lines", "Geometry", "coordinate"], ["Pi", "Geometry", "circle"],
  ["Plane", "Geometry", "coordinate"], ["Point", "Geometry", "coordinate"], ["Polygon", "Geometry", "solid"], ["Polynomial", "Algebra", "graph"], ["Positive number", "Arithmetic", "number-line"], ["Power", "Algebra", "graph"], ["Prime factor", "Number Theory", "set"], ["Prime number", "Number Theory", "number-line"],
  ["Prism", "Geometry", "solid"], ["Probability", "Probability", "probability"], ["Product", "Arithmetic", "number-line"], ["Proper fraction", "Arithmetic", "fraction"], ["Proportion", "Algebra", "fraction"], ["Pyramid", "Geometry", "solid"], ["Quadrant", "Geometry", "coordinate"], ["Quadratic", "Algebra", "graph"],
  ["Quadrilateral", "Geometry", "solid"], ["Quotient", "Arithmetic", "number-line"], ["Radius", "Geometry", "circle"], ["Range", "Statistics", "probability"], ["Range of function", "Algebra", "set"], ["Rate", "Algebra", "graph"], ["Ratio", "Arithmetic", "fraction"], ["Rational number", "Number Theory", "fraction"],
  ["Ray", "Geometry", "coordinate"], ["Real number", "Number Theory", "number-line"], ["Rectangle", "Geometry", "solid"], ["Recurring decimal", "Arithmetic", "fraction"], ["Reflection", "Geometry", "coordinate"], ["Remainder", "Arithmetic", "number-line"], ["Rhombus", "Geometry", "solid"], ["Right angle", "Geometry", "angle"],
  ["Right triangle", "Geometry", "triangle"], ["Rotation", "Geometry", "coordinate"], ["Sample space", "Probability", "probability"], ["Scalene triangle", "Geometry", "triangle"], ["Scalar", "Linear Algebra", "vector"], ["Scatter plot", "Statistics", "coordinate"], ["Secant line", "Calculus", "graph"], ["Secant of circle", "Geometry", "circle"],
  ["Sec function", "Trigonometry", "triangle", "sec"], ["Sector", "Geometry", "circle"], ["Sequence", "Algebra", "sequence"], ["Set", "Set Theory", "set"], ["Similar triangles", "Geometry", "triangle"], ["Sine", "Trigonometry", "triangle"], ["Slope", "Algebra", "graph"], ["Sphere", "Geometry", "solid"],
  ["Square", "Geometry", "solid"], ["Square root", "Arithmetic", "number-line"], ["Standard deviation", "Statistics", "probability"], ["Subset", "Set Theory", "set"], ["Sum", "Arithmetic", "number-line"], ["Supplementary angles", "Geometry", "angle"], ["Surface area", "Geometry", "solid"], ["Symmetry", "Geometry", "coordinate"],
  ["Tan function", "Trigonometry", "triangle", "tan tangent"], ["Tangent line", "Calculus", "graph"], ["Tangent of circle", "Geometry", "circle"], ["Term", "Algebra", "sequence"], ["Tessellation", "Geometry", "solid"], ["Theorem", "Logic", "logic"], ["Transformation", "Geometry", "coordinate"], ["Translation", "Geometry", "coordinate"],
  ["Transversal", "Geometry", "angle"], ["Trapezium", "Geometry", "solid"], ["Tree diagram", "Probability", "probability"], ["Triangle", "Geometry", "triangle"], ["Unit", "Arithmetic", "number-line"], ["Unit circle", "Trigonometry", "circle"], ["Unit vector", "Linear Algebra", "vector"], ["Union", "Set Theory", "set"],
  ["Universal set", "Set Theory", "set"], ["Unknown", "Algebra", "text"], ["Variable", "Algebra", "graph"], ["Variance", "Statistics", "probability"], ["Vector", "Linear Algebra", "vector"], ["Venn diagram", "Set Theory", "set"], ["Vertex", "Geometry", "angle"], ["Vertical angles", "Geometry", "angle"],
  ["Volume", "Geometry", "solid"], ["Whole number", "Arithmetic", "number-line"], ["Width", "Geometry", "solid"], ["X-axis", "Geometry", "coordinate"], ["X-coordinate", "Geometry", "coordinate"], ["Y-axis", "Geometry", "coordinate"], ["Y-coordinate", "Geometry", "coordinate"], ["Zero", "Arithmetic", "number-line"],
  ["Zero of function", "Algebra", "graph"], ["Z-score", "Statistics", "probability"],
];

export const visualDictionaryTerms: VisualDictionaryTerm[] = rawTerms.map(([term, category, kind, extra = ""]) => ({
  term,
  category,
  kind,
  keywords: [term, category, kind, extra].join(" ").toLowerCase().split(/\s+/).filter(Boolean),
}));

export const visualDictionaryLetters = Array.from(new Set(visualDictionaryTerms.map((entry) => entry.term[0].toUpperCase()))).sort();

export const visualDictionaryCategories = Array.from(new Set(visualDictionaryTerms.map((entry) => entry.category))).sort() as VisualDictionaryCategory[];
