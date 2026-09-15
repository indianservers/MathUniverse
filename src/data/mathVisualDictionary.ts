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
  description?: string;
  explanation?: string;
  representation?: string;
  example?: string;
};

const rawTerms: Array<
  [string, VisualDictionaryCategory, VisualDictionaryKind, string?]
> = [
  ["Abacus", "Arithmetic", "number-line"],
  ["Absolute value", "Algebra", "number-line"],
  ["Acute angle", "Geometry", "angle"],
  ["Addition", "Arithmetic", "number-line"],
  ["Adjacent angles", "Geometry", "angle"],
  ["Algebra", "Algebra", "graph"],
  ["Altitude", "Geometry", "triangle"],
  ["Angle", "Geometry", "angle"],
  ["Arc", "Geometry", "circle"],
  ["Area", "Geometry", "solid"],
  ["Arithmetic mean", "Statistics", "sequence"],
  ["Arithmetic sequence", "Algebra", "sequence"],
  ["Associative property", "Algebra", "text"],
  ["Asymptote", "Calculus", "graph"],
  ["Axis", "Geometry", "coordinate"],
  ["Axis of symmetry", "Geometry", "coordinate"],
  ["Bar graph", "Statistics", "probability"],
  ["Base", "Geometry", "triangle"],
  ["Base ten", "Arithmetic", "number-line"],
  ["Bearing", "Trigonometry", "angle"],
  ["Biconditional", "Logic", "logic"],
  ["Binomial", "Algebra", "graph"],
  ["Bisector", "Geometry", "angle"],
  ["Box plot", "Statistics", "probability"],
  ["Braces", "Set Theory", "set"],
  ["Brackets", "Algebra", "text"],
  ["Breadth", "Geometry", "solid"],
  ["Cartesian plane", "Geometry", "coordinate"],
  ["Chord", "Geometry", "circle"],
  ["Circle", "Geometry", "circle"],
  ["Circumcenter", "Geometry", "triangle"],
  ["Circumference", "Geometry", "circle"],
  ["Coefficient", "Algebra", "graph"],
  ["Collinear points", "Geometry", "coordinate"],
  ["Combination", "Probability", "probability"],
  ["Common factor", "Number Theory", "set"],
  ["Common multiple", "Number Theory", "number-line"],
  ["Commutative property", "Algebra", "text"],
  ["Complement", "Set Theory", "set"],
  ["Complex number", "Algebra", "coordinate"],
  ["Composite number", "Number Theory", "number-line"],
  ["Cone", "Geometry", "solid"],
  ["Congruent", "Geometry", "triangle"],
  ["Constant", "Algebra", "graph"],
  ["Coordinate", "Geometry", "coordinate"],
  ["Cosine", "Trigonometry", "triangle"],
  ["Cube", "Geometry", "solid"],
  ["Cuboid", "Geometry", "solid"],
  ["Cylinder", "Geometry", "solid"],
  ["Data", "Statistics", "probability"],
  ["Decimal", "Arithmetic", "fraction"],
  ["Decreasing function", "Calculus", "graph"],
  ["Degree", "Geometry", "angle"],
  ["Denominator", "Arithmetic", "fraction"],
  ["Dependent event", "Probability", "probability"],
  ["Derivative", "Calculus", "graph"],
  ["Diagonal", "Geometry", "solid"],
  ["Diameter", "Geometry", "circle"],
  ["Difference", "Arithmetic", "number-line"],
  ["Digit", "Arithmetic", "number-line"],
  ["Direct proportion", "Algebra", "graph"],
  ["Disjoint sets", "Set Theory", "set"],
  ["Distributive property", "Algebra", "text"],
  ["Dividend", "Arithmetic", "number-line"],
  ["Divisor", "Number Theory", "number-line"],
  ["Domain", "Algebra", "set"],
  ["Dot product", "Linear Algebra", "vector"],
  ["Edge", "Geometry", "solid"],
  ["Element", "Set Theory", "set"],
  ["Ellipse", "Geometry", "circle"],
  ["Empty set", "Set Theory", "set"],
  ["Equation", "Algebra", "graph"],
  ["Equilateral triangle", "Geometry", "triangle"],
  ["Equivalent fractions", "Arithmetic", "fraction"],
  ["Estimate", "Arithmetic", "number-line"],
  ["Even number", "Number Theory", "number-line"],
  ["Event", "Probability", "probability"],
  ["Exponent", "Algebra", "graph"],
  ["Expression", "Algebra", "text"],
  ["Exterior angle", "Geometry", "angle"],
  ["Face", "Geometry", "solid"],
  ["Factor", "Number Theory", "set"],
  ["Factorial", "Probability", "sequence"],
  ["Frequency", "Statistics", "probability"],
  ["Fraction", "Arithmetic", "fraction"],
  ["Function", "Algebra", "graph"],
  ["Gradient", "Calculus", "graph"],
  ["Graph", "Algebra", "graph"],
  ["Greatest common divisor", "Number Theory", "set", "gcd hcf"],
  ["Greater than", "Arithmetic", "number-line"],
  ["Height", "Geometry", "triangle"],
  ["Histogram", "Statistics", "probability"],
  ["Hypotenuse", "Geometry", "triangle"],
  ["Identity", "Algebra", "text"],
  ["Image", "Algebra", "coordinate"],
  ["Improper fraction", "Arithmetic", "fraction"],
  ["Increasing function", "Calculus", "graph"],
  ["Independent event", "Probability", "probability"],
  ["Inequality", "Algebra", "number-line"],
  ["Integer", "Arithmetic", "number-line"],
  ["Intercept", "Algebra", "graph"],
  ["Interior angle", "Geometry", "angle"],
  ["Intersection", "Set Theory", "set"],
  ["Interval", "Algebra", "number-line"],
  ["Inverse", "Algebra", "graph"],
  ["Irrational number", "Number Theory", "number-line"],
  ["Isosceles triangle", "Geometry", "triangle"],
  ["Iteration", "Algebra", "sequence"],
  ["Joint probability", "Probability", "probability"],
  ["Kite", "Geometry", "solid"],
  ["Least common multiple", "Number Theory", "number-line", "lcm"],
  ["Length", "Geometry", "solid"],
  ["Less than", "Arithmetic", "number-line"],
  ["Limit", "Calculus", "graph"],
  ["Line", "Geometry", "coordinate"],
  ["Line segment", "Geometry", "coordinate"],
  ["Linear equation", "Algebra", "graph"],
  ["Logarithm", "Algebra", "graph"],
  ["Matrix", "Linear Algebra", "matrix"],
  ["Mean", "Statistics", "probability"],
  ["Median", "Statistics", "probability"],
  ["Midpoint", "Geometry", "coordinate"],
  ["Mode", "Statistics", "probability"],
  ["Multiple", "Number Theory", "number-line"],
  ["Natural number", "Number Theory", "number-line"],
  ["Negative number", "Arithmetic", "number-line"],
  ["Net", "Geometry", "solid"],
  ["Null set", "Set Theory", "set"],
  ["Number line", "Arithmetic", "number-line"],
  ["Numerator", "Arithmetic", "fraction"],
  ["Obtuse angle", "Geometry", "angle"],
  ["Odd number", "Number Theory", "number-line"],
  ["Ordered pair", "Geometry", "coordinate"],
  ["Origin", "Geometry", "coordinate"],
  ["Outcome", "Probability", "probability"],
  ["Outlier", "Statistics", "probability"],
  ["Parallel lines", "Geometry", "coordinate"],
  ["Parabola", "Algebra", "graph"],
  ["Parentheses", "Algebra", "text"],
  ["Percent", "Arithmetic", "fraction"],
  ["Perimeter", "Geometry", "solid"],
  ["Permutation", "Probability", "probability"],
  ["Perpendicular lines", "Geometry", "coordinate"],
  ["Pi", "Geometry", "circle"],
  ["Plane", "Geometry", "coordinate"],
  ["Point", "Geometry", "coordinate"],
  ["Polygon", "Geometry", "solid"],
  ["Polynomial", "Algebra", "graph"],
  ["Positive number", "Arithmetic", "number-line"],
  ["Power", "Algebra", "text"],
  ["Prime factor", "Number Theory", "set"],
  ["Prime number", "Number Theory", "number-line"],
  ["Prism", "Geometry", "solid"],
  ["Probability", "Probability", "probability"],
  ["Product", "Arithmetic", "number-line"],
  ["Proper fraction", "Arithmetic", "fraction"],
  ["Proportion", "Algebra", "fraction"],
  ["Pyramid", "Geometry", "solid"],
  ["Quadrant", "Geometry", "coordinate"],
  ["Quadratic", "Algebra", "graph"],
  ["Quadrilateral", "Geometry", "solid"],
  ["Quotient", "Arithmetic", "number-line"],
  ["Radius", "Geometry", "circle"],
  ["Range", "Statistics", "probability"],
  ["Range of function", "Algebra", "set"],
  ["Rate", "Algebra", "graph"],
  ["Ratio", "Arithmetic", "fraction"],
  ["Rational number", "Number Theory", "fraction"],
  ["Ray", "Geometry", "coordinate"],
  ["Real number", "Number Theory", "number-line"],
  ["Rectangle", "Geometry", "solid"],
  ["Recurring decimal", "Arithmetic", "fraction"],
  ["Reflection", "Geometry", "coordinate"],
  ["Remainder", "Arithmetic", "number-line"],
  ["Rhombus", "Geometry", "solid"],
  ["Right angle", "Geometry", "angle"],
  ["Right triangle", "Geometry", "triangle"],
  ["Rotation", "Geometry", "coordinate"],
  ["Sample space", "Probability", "probability"],
  ["Scalene triangle", "Geometry", "triangle"],
  ["Scalar", "Linear Algebra", "vector"],
  ["Scatter plot", "Statistics", "coordinate"],
  ["Secant line", "Calculus", "graph"],
  ["Secant of circle", "Geometry", "circle"],
  ["Sec function", "Trigonometry", "triangle", "sec"],
  ["Sector", "Geometry", "circle"],
  ["Sequence", "Algebra", "sequence"],
  ["Set", "Set Theory", "set"],
  ["Similar triangles", "Geometry", "triangle"],
  ["Sine", "Trigonometry", "triangle"],
  ["Slope", "Algebra", "graph"],
  ["Sphere", "Geometry", "solid"],
  ["Square", "Geometry", "solid"],
  ["Square root", "Arithmetic", "number-line"],
  ["Standard deviation", "Statistics", "probability"],
  ["Subset", "Set Theory", "set"],
  ["Sum", "Arithmetic", "number-line"],
  ["Supplementary angles", "Geometry", "angle"],
  ["Surface area", "Geometry", "solid"],
  ["Symmetry", "Geometry", "coordinate"],
  ["Tan function", "Trigonometry", "triangle", "tan tangent"],
  ["Tangent line", "Calculus", "graph"],
  ["Tangent of circle", "Geometry", "circle"],
  ["Term", "Algebra", "sequence"],
  ["Tessellation", "Geometry", "solid"],
  ["Theorem", "Logic", "logic"],
  ["Transformation", "Geometry", "coordinate"],
  ["Translation", "Geometry", "coordinate"],
  ["Transversal", "Geometry", "angle"],
  ["Trapezium", "Geometry", "solid"],
  ["Tree diagram", "Probability", "probability"],
  ["Triangle", "Geometry", "triangle"],
  ["Unit", "Arithmetic", "number-line"],
  ["Unit circle", "Trigonometry", "circle"],
  ["Unit vector", "Linear Algebra", "vector"],
  ["Union", "Set Theory", "set"],
  ["Universal set", "Set Theory", "set"],
  ["Unknown", "Algebra", "text"],
  ["Variable", "Algebra", "graph"],
  ["Variance", "Statistics", "probability"],
  ["Vector", "Linear Algebra", "vector"],
  ["Venn diagram", "Set Theory", "set"],
  ["Vertex", "Geometry", "angle"],
  ["Vertical angles", "Geometry", "angle"],
  ["Volume", "Geometry", "solid"],
  ["Whole number", "Arithmetic", "number-line"],
  ["Width", "Geometry", "solid"],
  ["X-axis", "Geometry", "coordinate"],
  ["X-coordinate", "Geometry", "coordinate"],
  ["Y-axis", "Geometry", "coordinate"],
  ["Y-coordinate", "Geometry", "coordinate"],
  ["Zero", "Arithmetic", "number-line"],
  ["Zero of function", "Algebra", "graph"],
  ["Z-score", "Statistics", "probability"],
  ["Acute triangle", "Geometry", "triangle"],
  ["Additive inverse", "Algebra", "number-line"],
  ["Amplitude", "Trigonometry", "graph"],
  ["Angle bisector theorem", "Geometry", "triangle"],
  ["Apothem", "Geometry", "solid"],
  ["Argand plane", "Algebra", "coordinate"],
  ["Average rate of change", "Calculus", "graph"],
  ["Bayes theorem", "Probability", "probability"],
  ["Bijection", "Set Theory", "set"],
  ["Binomial coefficient", "Probability", "sequence"],
  ["Binomial theorem", "Algebra", "sequence"],
  ["Central angle", "Geometry", "circle"],
  ["Centroid", "Geometry", "triangle"],
  ["Chain rule", "Calculus", "graph"],
  ["Circle equation", "Geometry", "coordinate"],
  ["Cofactor", "Linear Algebra", "matrix"],
  ["Column vector", "Linear Algebra", "vector"],
  ["Conditional probability", "Probability", "probability"],
  ["Conjugate", "Algebra", "coordinate"],
  ["Cot function", "Trigonometry", "triangle", "cot cotangent"],
  ["Cosec function", "Trigonometry", "triangle", "cosec csc cosecant"],
  ["Cross product", "Linear Algebra", "vector"],
  ["Cumulative frequency", "Statistics", "probability"],
  ["Determinant", "Linear Algebra", "matrix"],
  ["Dilation", "Geometry", "coordinate"],
  ["Directrix", "Geometry", "coordinate"],
  ["Eccentricity", "Geometry", "circle"],
  ["Eigenvalue", "Linear Algebra", "matrix"],
  ["Eigenvector", "Linear Algebra", "vector"],
  ["Expected value", "Probability", "probability"],
  ["Exponential function", "Algebra", "graph"],
  ["Fibonacci sequence", "Number Theory", "sequence"],
  ["Focus", "Geometry", "coordinate"],
  ["Function composition", "Algebra", "graph"],
  ["Geometric mean", "Statistics", "sequence"],
  ["Geometric sequence", "Algebra", "sequence"],
  ["Harmonic mean", "Statistics", "sequence"],
  ["Hyperbola", "Geometry", "graph"],
  ["Hypothesis", "Logic", "logic"],
  ["Identity matrix", "Linear Algebra", "matrix"],
  ["Implication", "Logic", "logic"],
  ["Injection", "Set Theory", "set"],
  ["Inscribed angle", "Geometry", "circle"],
  ["Integral", "Calculus", "graph"],
  ["Interquartile range", "Statistics", "probability", "iqr"],
  ["Inverse function", "Algebra", "graph"],
  ["Law of cosines", "Trigonometry", "triangle"],
  ["Law of sines", "Trigonometry", "triangle"],
  ["Linear transformation", "Linear Algebra", "matrix"],
  ["Magnitude", "Linear Algebra", "vector"],
  ["Major arc", "Geometry", "circle"],
  ["Minor arc", "Geometry", "circle"],
  ["Mutually exclusive events", "Probability", "probability"],
  ["Normal distribution", "Statistics", "probability"],
  ["Normal line", "Calculus", "graph"],
  ["Null vector", "Linear Algebra", "vector"],
  ["Orthocenter", "Geometry", "triangle"],
  ["Pascal triangle", "Algebra", "sequence"],
  ["Period", "Trigonometry", "graph"],
  ["Piecewise function", "Algebra", "graph"],
  ["Power set", "Set Theory", "set"],
  ["Product rule", "Calculus", "graph"],
  ["Projection", "Linear Algebra", "vector"],
  ["Pythagorean theorem", "Geometry", "triangle"],
  ["Random variable", "Probability", "probability"],
  ["Rank of matrix", "Linear Algebra", "matrix"],
  ["Recursive sequence", "Algebra", "sequence"],
  ["Reference angle", "Trigonometry", "angle"],
  ["Regression line", "Statistics", "graph"],
  ["Relative frequency", "Statistics", "probability"],
  ["Sample mean", "Statistics", "probability"],
  ["Set difference", "Set Theory", "set"],
  ["Sigma notation", "Algebra", "sequence"],
  ["Slope intercept form", "Algebra", "graph"],
  ["Standard form", "Algebra", "text"],
  ["Surjection", "Set Theory", "set"],
  ["Truth table", "Logic", "logic"],
  ["Unit matrix", "Linear Algebra", "matrix"],
  ["Variance formula", "Statistics", "probability"],
  ["Zero matrix", "Linear Algebra", "matrix"],
  ["Absolute maximum", "Calculus", "graph"],
  ["Absolute minimum", "Calculus", "graph"],
  ["Acceleration", "Calculus", "graph"],
  ["Adjacent side", "Trigonometry", "triangle"],
  ["Alternate interior angles", "Geometry", "angle"],
  ["Annuity", "Arithmetic", "sequence"],
  ["Base angle", "Geometry", "angle"],
  ["Cartesian product", "Set Theory", "set"],
  ["Circle graph", "Statistics", "probability"],
  ["Class interval", "Statistics", "probability"],
  ["Closed interval", "Algebra", "number-line"],
  ["Common difference", "Algebra", "sequence"],
  ["Common ratio", "Algebra", "sequence"],
  ["Complementary angles", "Geometry", "angle"],
  ["Compound interest", "Arithmetic", "sequence"],
  ["Conclusion", "Logic", "logic"],
  ["Contrapositive", "Logic", "logic"],
  ["Converse", "Logic", "logic"],
  ["Correlation", "Statistics", "coordinate"],
  ["Corresponding angles", "Geometry", "angle"],
  ["Critical point", "Calculus", "graph"],
  ["Cubic function", "Algebra", "graph"],
  ["De Morgan law", "Logic", "set"],
  ["Dependent variable", "Algebra", "graph"],
  ["Difference of sets", "Set Theory", "set"],
  ["Direct variation", "Algebra", "graph"],
  ["Discrete data", "Statistics", "probability"],
  ["End behavior", "Algebra", "graph"],
  ["Equation of line", "Algebra", "graph"],
  ["Experimental probability", "Probability", "probability"],
  ["Finite set", "Set Theory", "set"],
  ["First derivative test", "Calculus", "graph"],
  ["Frequency polygon", "Statistics", "graph"],
  ["Function notation", "Algebra", "text"],
  ["Great circle", "Geometry", "circle"],
  ["Grouped data", "Statistics", "probability"],
  ["Half line", "Geometry", "coordinate"],
  ["Horizontal asymptote", "Calculus", "graph"],
  ["Independent variable", "Algebra", "graph"],
  ["Infinite set", "Set Theory", "set"],
  ["Initial value", "Algebra", "graph"],
  ["Input", "Algebra", "set"],
  ["Inverse proportion", "Algebra", "graph"],
  ["IQR", "Statistics", "probability", "interquartile range"],
  ["Leading coefficient", "Algebra", "graph"],
  ["Local maximum", "Calculus", "graph"],
  ["Local minimum", "Calculus", "graph"],
  ["Mapping", "Set Theory", "set"],
  ["Minor sector", "Geometry", "circle"],
  ["Monomial", "Algebra", "text"],
  ["Multiplicative inverse", "Arithmetic", "fraction"],
  ["Mutually exhaustive events", "Probability", "probability"],
  ["Nonlinear function", "Algebra", "graph"],
  ["Open interval", "Algebra", "number-line"],
  ["Opposite side", "Trigonometry", "triangle"],
  ["Output", "Algebra", "set"],
  ["Parameter", "Algebra", "text"],
  ["Parallel vector", "Linear Algebra", "vector"],
  ["Phase shift", "Trigonometry", "graph"],
  ["Point of tangency", "Geometry", "circle"],
  ["Population", "Statistics", "probability"],
  ["Premise", "Logic", "logic"],
  ["Quadratic formula", "Algebra", "graph"],
  ["Quartile", "Statistics", "probability"],
  ["Radical", "Algebra", "number-line"],
  ["Relative complement", "Set Theory", "set"],
  ["Rise", "Algebra", "graph"],
  ["Run", "Algebra", "graph"],
  ["Sample", "Statistics", "probability"],
  ["Scale factor", "Geometry", "triangle"],
  ["Second derivative", "Calculus", "graph"],
  ["Sine wave", "Trigonometry", "graph"],
  ["Skew lines", "Geometry", "solid"],
  ["Solution set", "Algebra", "set"],
  ["Stem and leaf plot", "Statistics", "probability"],
  ["Substitution", "Algebra", "text"],
  ["System of equations", "Algebra", "graph"],
  ["Terminal side", "Trigonometry", "angle"],
  ["Theoretical probability", "Probability", "probability"],
  ["Transpose", "Linear Algebra", "matrix"],
  ["Trinomial", "Algebra", "text"],
  ["Vector component", "Linear Algebra", "vector"],
  ["Vertical asymptote", "Calculus", "graph"],
  ["Vertical line test", "Algebra", "graph"],
  ["Weighted mean", "Statistics", "probability"],
  ["X-intercept", "Algebra", "graph"],
  ["Y-intercept", "Algebra", "graph"],
  ["Zero vector", "Linear Algebra", "vector"],
  ["Abscissa", "Geometry", "coordinate"],
  ["Absolute convergence", "Calculus", "sequence"],
  ["Adjacent matrix", "Linear Algebra", "matrix"],
  ["Affine transformation", "Linear Algebra", "matrix"],
  ["Alternating series", "Calculus", "sequence"],
  ["Analytic geometry", "Geometry", "coordinate"],
  ["Angle of elevation", "Trigonometry", "angle"],
  ["Angle of depression", "Trigonometry", "angle"],
  ["Arc length", "Calculus", "circle"],
  ["Area model", "Arithmetic", "fraction"],
  ["Augmented matrix", "Linear Algebra", "matrix"],
  ["Average speed", "Algebra", "graph"],
  ["Axiom", "Logic", "logic"],
  ["Balance method", "Algebra", "text"],
  ["Bijective function", "Set Theory", "set"],
  ["Bounded sequence", "Calculus", "sequence"],
  ["Box method", "Algebra", "solid"],
  ["Cantor set", "Set Theory", "set"],
  ["Cardinality", "Set Theory", "set"],
  ["Catenary", "Algebra", "graph"],
  ["Cauchy sequence", "Calculus", "sequence"],
  ["Ceiling function", "Algebra", "graph"],
  ["Center of mass", "Geometry", "coordinate"],
  ["Characteristic polynomial", "Linear Algebra", "matrix"],
  ["Chebyshev inequality", "Statistics", "probability"],
  ["Circle sector area", "Geometry", "circle"],
  ["Closed set", "Set Theory", "set"],
  ["Cluster sample", "Statistics", "probability"],
  ["Column space", "Linear Algebra", "matrix"],
  ["Combinatorial proof", "Logic", "logic"],
  ["Commutator", "Algebra", "text"],
  ["Compass construction", "Geometry", "circle"],
  ["Complete graph", "Set Theory", "set"],
  ["Complex conjugate", "Algebra", "coordinate"],
  ["Concave down", "Calculus", "graph"],
  ["Concave up", "Calculus", "graph"],
  ["Conditional statement", "Logic", "logic"],
  ["Consistent system", "Linear Algebra", "matrix"],
  ["Continuous data", "Statistics", "probability"],
  ["Continuity", "Calculus", "graph"],
  ["Contradiction", "Logic", "logic"],
  ["Convex polygon", "Geometry", "solid"],
  ["Coordinate proof", "Geometry", "coordinate"],
  ["Coterminal angle", "Trigonometry", "angle"],
  ["Counting principle", "Probability", "sequence"],
  ["Cramer's rule", "Linear Algebra", "matrix"],
  ["Cumulative distribution", "Statistics", "probability"],
  ["Cyclic quadrilateral", "Geometry", "circle"],
  ["Data distribution", "Statistics", "probability"],
  ["Deductive reasoning", "Logic", "logic"],
  ["Definite integral", "Calculus", "graph"],
  ["Dense set", "Set Theory", "number-line"],
  ["Derivative notation", "Calculus", "text"],
  ["Diagonal matrix", "Linear Algebra", "matrix"],
  ["Difference quotient", "Calculus", "graph"],
  ["Differentiability", "Calculus", "graph"],
  ["Dimensional analysis", "Arithmetic", "fraction"],
  ["Directed angle", "Trigonometry", "angle"],
  ["Discriminant", "Algebra", "graph"],
  ["Divergent series", "Calculus", "sequence"],
  ["Double angle identity", "Trigonometry", "triangle"],
  ["Dual graph", "Set Theory", "set"],
  ["Echelon form", "Linear Algebra", "matrix"],
  ["Empirical rule", "Statistics", "probability"],
  ["Empty product", "Algebra", "text"],
  ["Equal sets", "Set Theory", "set"],
  ["Equivalent equations", "Algebra", "text"],
  ["Euler characteristic", "Geometry", "solid"],
  ["Exterior derivative", "Calculus", "text"],
  ["Extrapolation", "Statistics", "graph"],
  ["Factor theorem", "Algebra", "graph"],
  ["Feasible region", "Algebra", "coordinate"],
  ["Field axiom", "Logic", "logic"],
  ["Finite difference", "Calculus", "sequence"],
  ["Floor function", "Algebra", "graph"],
  ["Flow diagram", "Logic", "logic"],
  ["Frustum", "Geometry", "solid"],
  ["Geometric proof", "Geometry", "solid"],
  ["Golden ratio", "Number Theory", "fraction"],
  ["Graph isomorphism", "Set Theory", "set"],
  ["Greatest integer function", "Algebra", "graph"],
  ["Half angle identity", "Trigonometry", "triangle"],
  ["Harmonic sequence", "Algebra", "sequence"],
  ["Hessian matrix", "Calculus", "matrix"],
  ["Homogeneous system", "Linear Algebra", "matrix"],
  ["Imaginary axis", "Algebra", "coordinate"],
  ["Incenter", "Geometry", "triangle"],
  ["Inclination angle", "Trigonometry", "angle"],
  ["Induction proof", "Logic", "logic"],
  ["Infinite series", "Calculus", "sequence"],
  ["Injective function", "Set Theory", "set"],
  ["Inscribed circle", "Geometry", "circle"],
  ["Instantaneous speed", "Calculus", "graph"],
  ["Integer lattice", "Geometry", "coordinate"],
  ["Inverse matrix", "Linear Algebra", "matrix"],
  ["Inverse sine", "Trigonometry", "triangle"],
  ["Inverse tangent", "Trigonometry", "triangle"],
  ["Jacobian matrix", "Calculus", "matrix"],
  ["Karnaugh map", "Logic", "set"],
  ["Kernel", "Linear Algebra", "matrix"],
  ["Latus rectum", "Geometry", "coordinate"],
  ["Left limit", "Calculus", "graph"],
  ["Linear combination", "Linear Algebra", "vector"],
  ["Linear independence", "Linear Algebra", "vector"],
  ["Logistic function", "Algebra", "graph"],
  ["Lower bound", "Algebra", "number-line"],
  ["Maclaurin series", "Calculus", "sequence"],
  ["Major sector", "Geometry", "circle"],
  ["Matrix inverse", "Linear Algebra", "matrix"],
  ["Matrix multiplication", "Linear Algebra", "matrix"],
  ["Matrix trace", "Linear Algebra", "matrix"],
  ["Maximum likelihood", "Statistics", "probability"],
  ["Mean absolute deviation", "Statistics", "probability"],
  ["Measure of arc", "Geometry", "circle"],
  ["Midline", "Trigonometry", "graph"],
  ["Modular arithmetic", "Number Theory", "number-line"],
  ["Modulo", "Number Theory", "number-line"],
  ["Monotonic sequence", "Calculus", "sequence"],
  ["Multiplicative identity", "Arithmetic", "number-line"],
  ["Nabla", "Calculus", "text"],
  ["Natural logarithm", "Algebra", "graph"],
  ["Negative correlation", "Statistics", "coordinate"],
  ["Nonempty set", "Set Theory", "set"],
  ["Normal vector", "Linear Algebra", "vector"],
  ["Null hypothesis", "Statistics", "probability"],
  ["One-to-one function", "Set Theory", "set"],
  ["Onto function", "Set Theory", "set"],
  ["Open set", "Set Theory", "set"],
  ["Ordinate", "Geometry", "coordinate"],
  ["Orthogonal vectors", "Linear Algebra", "vector"],
  ["Outcomes tree", "Probability", "probability"],
  ["Parameterization", "Geometry", "coordinate"],
  ["Parametric equation", "Algebra", "coordinate"],
  ["Partial derivative", "Calculus", "graph"],
  ["Partition of interval", "Calculus", "number-line"],
  ["Percentile", "Statistics", "probability"],
  ["Periodic function", "Trigonometry", "graph"],
  ["Piecewise notation", "Algebra", "text"],
  ["Point slope form", "Algebra", "graph"],
  ["Polar angle", "Trigonometry", "angle"],
  ["Polar coordinate", "Geometry", "coordinate"],
  ["Positive correlation", "Statistics", "coordinate"],
  ["Power series", "Calculus", "sequence"],
  ["Predicate", "Logic", "logic"],
  ["Principal value", "Trigonometry", "angle"],
  ["Proof by contradiction", "Logic", "logic"],
  ["Quadratic vertex", "Algebra", "graph"],
  ["Quantifier", "Logic", "logic"],
  ["Random sample", "Statistics", "probability"],
  ["Rate of change", "Calculus", "graph"],
  ["Rational expression", "Algebra", "fraction"],
  ["Reduced row echelon form", "Linear Algebra", "matrix"],
  ["Reflexive relation", "Set Theory", "set"],
  ["Residual", "Statistics", "coordinate"],
  ["Right limit", "Calculus", "graph"],
  ["Root mean square", "Statistics", "probability"],
  ["Row space", "Linear Algebra", "matrix"],
  ["Scalar projection", "Linear Algebra", "vector"],
  ["Secant method", "Calculus", "graph"],
  ["Second derivative test", "Calculus", "graph"],
  ["Sign chart", "Algebra", "number-line"],
  ["Similar matrices", "Linear Algebra", "matrix"],
  ["Simple interest", "Arithmetic", "sequence"],
  ["Simpson rule", "Calculus", "graph"],
  ["Singular matrix", "Linear Algebra", "matrix"],
  ["Skewed distribution", "Statistics", "probability"],
  ["Span", "Linear Algebra", "vector"],
  ["Standard error", "Statistics", "probability"],
  ["Step function", "Algebra", "graph"],
  ["Strict subset", "Set Theory", "set"],
  ["Subspace", "Linear Algebra", "vector"],
  ["Surjective function", "Set Theory", "set"],
  ["Symmetric difference", "Set Theory", "set"],
  ["Symmetric matrix", "Linear Algebra", "matrix"],
  ["Taylor series", "Calculus", "sequence"],
  ["Total probability", "Probability", "probability"],
  ["Transitive relation", "Set Theory", "set"],
  ["Trapezoidal rule", "Calculus", "graph"],
  ["Triangle inequality", "Geometry", "triangle"],
  ["Unit fraction", "Arithmetic", "fraction"],
  ["Upper bound", "Algebra", "number-line"],
  ["Vector space", "Linear Algebra", "vector"],
  ["Velocity", "Calculus", "graph"],
  ["Weighted probability", "Probability", "probability"],
];

type EnrichedVisualDictionaryTerm = Omit<VisualDictionaryTerm, "keywords"> & {
  extra?: string;
};

function rawTermDescription(
  term: string,
  category: VisualDictionaryCategory,
  kind: VisualDictionaryKind,
) {
  const topic = term.toLowerCase();
  const exact = exactRawDescriptions[topic];
  if (exact) return exact;
  if (topic.includes("angle"))
    return `${term} is an angle relationship involving the size, position, or direction of a turn between rays.`;
  if (topic.includes("axis"))
    return `${term} is a reference line used to measure position, direction, or symmetry.`;
  if (topic.includes("factor"))
    return `${term} is a number or expression that divides another quantity exactly, or helps build it by multiplication.`;
  if (topic.includes("limit"))
    return `${term} describes the value a quantity approaches near a chosen input, boundary, or direction.`;
  if (topic.includes("matrix"))
    return `${term} is a row-and-column object or operation used to organize values, solve systems, or transform vectors.`;
  if (topic.includes("probability") || topic.includes("event"))
    return `${term} describes a chance situation by naming outcomes and comparing favorable cases with all possible cases.`;
  if (topic.includes("function"))
    return `${term} describes a rule that assigns each allowed input to an output.`;
  if (topic.includes("sequence") || topic.includes("series"))
    return `${term} describes ordered numbers whose positions or sums follow a pattern.`;
  if (topic.includes("vector"))
    return `${term} describes a quantity with direction and magnitude, often represented by an arrow.`;
  if (topic.includes("set"))
    return `${term} describes a collection of objects and the membership relationship between them.`;
  if (topic.includes("triangle"))
    return `${term} describes a property, side, angle, or construction inside a three-sided figure.`;

  const byKind: Record<VisualDictionaryKind, string> = {
    angle: `${term} names a specific angle type or angle relationship measured by the opening between rays.`,
    circle: `${term} names a part or measurement of a circle, such as its boundary, centre distance, or related line.`,
    triangle: `${term} names a side, angle, centre, or relationship inside a triangle.`,
    graph: `${term} is an algebraic idea that can be visualized on a graph when its values or changes are plotted.`,
    "number-line": `${term} is a number idea shown by position, distance, order, or repeated steps on a number line.`,
    set: `${term} describes how objects belong to, combine with, or differ between sets.`,
    matrix: `${term} is represented with a rectangular array of entries or an operation on that array.`,
    vector: `${term} describes arrows, components, direction, magnitude, or vector spaces.`,
    solid: `${term} names a geometric shape, feature, or measurement in two or three dimensions.`,
    fraction: `${term} compares one quantity with another using equal parts, ratios, or a numerator over a denominator.`,
    probability: `${term} describes outcomes, likelihood, counting, or variation in a random process.`,
    sequence: `${term} describes ordered terms, repeated growth, or a summation pattern.`,
    coordinate: `${term} names a position, direction, line, or transformation on coordinate axes.`,
    logic: `${term} is a reasoning structure used to connect assumptions, statements, and conclusions.`,
    text: `${term} is mathematical language or notation used to group, name, or manipulate expressions.`,
  };
  return byKind[kind];
}

function rawTermExplanation(term: string, kind: VisualDictionaryKind) {
  const topic = term.toLowerCase();
  const exact = exactRawExplanations[topic];
  if (exact) return exact;
  if (topic.includes("inverse"))
    return `The visual highlights how ${term.toLowerCase()} reverses or undoes a matching operation.`;
  if (topic.includes("symmetry"))
    return `The visual marks the line, point, or transformation that keeps the figure balanced.`;
  if (topic.includes("proportion") || topic.includes("ratio"))
    return `The visual compares two quantities so their relative sizes can be read directly.`;
  if (topic.includes("correlation"))
    return `The visual uses a scatter pattern to show how two quantities move together.`;
  if (
    topic.includes("derivative") ||
    topic.includes("gradient") ||
    topic.includes("slope")
  )
    return `The visual shows the changing rate with a line that captures direction at or between points.`;

  const byKind: Record<VisualDictionaryKind, string> = {
    angle: `Look for the highlighted opening, matching angle pair, or turn that identifies ${term.toLowerCase()}.`,
    circle: `Look for the highlighted arc, radius, chord, sector, tangent, or circle region that identifies ${term.toLowerCase()}.`,
    triangle: `The marked sides, angles, and helper lines show where ${term.toLowerCase()} lives in the triangle.`,
    graph: `The curve, intercepts, slope marks, or shaded regions show the behaviour named by ${term.toLowerCase()}.`,
    "number-line": `The highlighted point or interval places ${term.toLowerCase()} in order on the number line.`,
    set: `The shaded region or arrows show which elements are included in ${term.toLowerCase()}.`,
    matrix: `The highlighted rows, columns, or diagonal entries show the structure behind ${term.toLowerCase()}.`,
    vector: `The arrows and component marks show the direction or span described by ${term.toLowerCase()}.`,
    solid: `The highlighted face, edge, dimension, or net shows the shape feature named by ${term.toLowerCase()}.`,
    fraction: `The shaded parts show the numerator, denominator, or comparison behind ${term.toLowerCase()}.`,
    probability: `The favorable outcomes, bars, or branches show how ${term.toLowerCase()} is counted.`,
    sequence: `The ordered dots show the pattern or repeated step behind ${term.toLowerCase()}.`,
    coordinate: `The axes, point, and guide lines show the location or movement described by ${term.toLowerCase()}.`,
    logic: `The statement boxes and arrows show how ${term.toLowerCase()} connects assumptions to conclusions.`,
    text: `The notation card shows how ${term.toLowerCase()} is written and read inside a mathematical sentence.`,
  };
  return byKind[kind];
}

function rawTermRepresentation(term: string, kind: VisualDictionaryKind) {
  const topic = term.toLowerCase();
  const exact = exactRawRepresentations[topic];
  if (exact) return exact;
  if (topic.includes("angle")) return "m angle ABC = 45 degrees";
  if (topic.includes("axis")) return "x-axis: y = 0; y-axis: x = 0";
  if (topic.includes("matrix")) return "A = [[1, 2], [3, 4]]";
  if (topic.includes("set")) return "A = {1, 2, 3}";
  if (topic.includes("function")) return "f(x) = x^2";
  if (topic.includes("triangle"))
    return "a + b + c perimeter, A + B + C = 180 degrees";

  const byKind: Record<VisualDictionaryKind, string> = {
    angle: "theta = 60 degrees",
    circle: "C = 2 pi r",
    triangle: "a^2 + b^2 = c^2",
    graph: "y = f(x)",
    "number-line": "-3 < 0 < 4",
    set: "A union B",
    matrix: "A = [[a, b], [c, d]]",
    vector: "v = <3, 2>",
    solid: "V = length x width x height",
    fraction: "a / b, b != 0",
    probability: "P(A) = favorable outcomes / total outcomes",
    sequence: "a_n = a_1 + (n - 1)d",
    coordinate: "P = (x, y)",
    logic: "p -> q",
    text: term,
  };
  return byKind[kind];
}

function rawTermExample(term: string, kind: VisualDictionaryKind) {
  const topic = term.toLowerCase();
  const exact = exactRawExamples[topic];
  if (exact) return exact;
  if (topic.includes("angle"))
    return `If one ray turns 45 degrees from another, the marked opening is an example of ${term.toLowerCase()}.`;
  if (topic.includes("axis"))
    return `On the coordinate plane, the x-axis is the horizontal reference line and the y-axis is vertical.`;
  if (topic.includes("factor"))
    return `Since 3 x 4 = 12, both 3 and 4 are factors of 12.`;
  if (topic.includes("matrix"))
    return `In [[1, 2], [3, 4]], 1 and 2 are in the first row of the matrix.`;
  if (topic.includes("probability"))
    return `If 2 of 6 equally likely outcomes are favorable, the probability is 2/6 = 1/3.`;
  if (topic.includes("function"))
    return `For f(x) = x^2, input 3 gives output f(3) = 9.`;
  if (topic.includes("sequence"))
    return `2, 5, 8, 11 is a sequence with common difference 3.`;
  if (topic.includes("vector"))
    return `The vector <3, 2> moves 3 units right and 2 units up.`;
  if (topic.includes("set"))
    return `If A = {1, 2, 3}, then 2 is an element of A.`;

  const byKind: Record<VisualDictionaryKind, string> = {
    angle: "A 90 degree corner of a square is a right angle.",
    circle: "In a circle with radius 5 cm, the diameter is 10 cm.",
    triangle: "A triangle with sides 3, 4, and 5 is a right triangle.",
    graph: "For y = 2x + 1, x = 3 gives y = 7.",
    "number-line": "The number -2 sits two units to the left of 0.",
    set: "For A = {2, 4, 6}, the number 4 belongs to A.",
    matrix: "A 2 by 2 matrix can be written as [[1, 2], [3, 4]].",
    vector: "A displacement of <5, 0> moves five units horizontally.",
    solid: "A cuboid of size 2 x 3 x 4 has volume 24 cubic units.",
    fraction: "The fraction 3/5 means 3 equal parts out of 5 total parts.",
    probability:
      "Rolling an even number on a fair die has probability 3/6 = 1/2.",
    sequence: "The sequence 4, 8, 12, 16 increases by 4 each step.",
    coordinate:
      "The point (4, 2) is four units right and two units up from the origin.",
    logic:
      "If p means it is raining and q means the ground is wet, p -> q reads if p, then q.",
    text: "In 2 x (3 + 4), the parentheses tell us to add first.",
  };
  return byKind[kind];
}

const exactRawDescriptions: Record<string, string> = {
  power:
    "In mathematics, a power (or exponentiation) is an expression that represents multiplying a base by itself a specified number of times.",
  exponent:
    "An exponent is the small raised number in a power that tells how many equal factors of the base are multiplied.",
  base: "A base is the repeated factor in a power expression, or the reference side of a geometric figure when the term is used in geometry.",
  "base ten":
    "Base ten is the place-value number system that uses the ten digits 0 through 9.",
  algebra:
    "Algebra is the branch of mathematics that uses symbols and variables to describe number patterns and relationships.",
  coefficient:
    "A coefficient is a number multiplying a variable or expression.",
  constant: "A constant is a fixed value that does not change.",
  equation:
    "An equation is a mathematical statement that two expressions are equal.",
  expression:
    "An expression is a mathematical phrase made from numbers, variables, and operations, without an equals sign.",
  variable:
    "A variable is a symbol that stands for a value that can change or be unknown.",
  unknown: "An unknown is a value to be found in an equation or problem.",
  term: "A term is one part of an expression, separated from other parts by addition or subtraction.",
  logarithm:
    "A logarithm is the exponent needed to raise a base to a given number.",
  polynomial:
    "A polynomial is an expression made from variables raised to whole-number powers and combined by addition or subtraction.",
  quadratic: "A quadratic is a degree-two expression, equation, or function.",
  binomial: "A binomial is an algebraic expression with exactly two terms.",
  monomial: "A monomial is an algebraic expression with one term.",
  trinomial: "A trinomial is an algebraic expression with exactly three terms.",
  fraction:
    "A fraction represents parts of a whole or division using a numerator over a denominator.",
  numerator:
    "A numerator is the top number of a fraction, showing how many parts are selected.",
  denominator:
    "A denominator is the bottom number of a fraction, showing how many equal parts make the whole.",
  percent: "A percent is a ratio out of 100.",
  decimal:
    "A decimal is a number written with a decimal point to show whole units and fractional parts.",
  "absolute value":
    "Absolute value is a number's distance from zero on the number line.",
  integer:
    "An integer is a whole number, zero, or the negative of a whole number.",
  "natural number":
    "A natural number is a counting number such as 1, 2, 3, and so on.",
  "whole number":
    "A whole number is 0 or a counting number with no fractional part.",
  "rational number":
    "A rational number can be written as a fraction of two integers with a nonzero denominator.",
  "irrational number":
    "An irrational number cannot be written as a fraction of two integers.",
  "real number":
    "A real number is any number that can be placed on the number line.",
  "complex number":
    "A complex number has the form a + bi, where a and b are real numbers and i^2 = -1.",
  mean: "The mean is the arithmetic average found by adding values and dividing by how many values there are.",
  median: "The median is the middle value when data is arranged in order.",
  mode: "The mode is the value that appears most often in a data set.",
  range:
    "The range is the difference between the largest and smallest data values.",
  "standard deviation":
    "Standard deviation measures a typical distance of data values from the mean.",
  variance: "Variance is the average squared distance of values from the mean.",
};

const exactRawExplanations: Record<string, string> = {
  power:
    "In b^n, b is the base, n is the exponent, and the whole expression b^n is the power. For example, 2^4 means 2 x 2 x 2 x 2.",
  exponent:
    "The exponent counts repeated factors, not ordinary multiplication by that number: 2^4 is 2 x 2 x 2 x 2, not 2 x 4.",
  base: "In exponents, the base is repeatedly multiplied; in geometry, the base is the side or face used as a reference for height.",
  logarithm:
    "Logarithms undo exponentiation: log base 2 of 8 is 3 because 2^3 = 8.",
};

const exactRawRepresentations: Record<string, string> = {
  power: "b^n = b x b x ... x b, n factors",
  exponent: "2^4: exponent = 4",
  base: "2^4: base = 2",
  logarithm: "log_b(a) = c means b^c = a",
};

const exactRawExamples: Record<string, string> = {
  power:
    "In 2^4 = 16, 2 is the base, 4 is the exponent, and 2 x 2 x 2 x 2 equals 16.",
  exponent:
    "In 5^3 = 125, the exponent 3 says to multiply three factors: 5 x 5 x 5.",
  base: "In 7^2 = 49, the base is 7; in a triangle area formula, the base is the side paired with the height.",
  logarithm: "log_10(1000) = 3 because 10^3 = 1000.",
  coefficient: "In 6x + 2, the coefficient of x is 6.",
  constant: "In y = 3x + 5, the constant term is 5.",
  equation: "x + 4 = 9 is an equation; solving it gives x = 5.",
  expression:
    "3x + 7 is an expression, not an equation, because it has no equals sign.",
  variable: "In A = l x w, l and w are variables for length and width.",
  fraction: "In 3/5, 3 is the numerator and 5 is the denominator.",
  percent: "25% means 25 out of 100, which equals 1/4.",
};

const additionalVisualDictionaryTerms: EnrichedVisualDictionaryTerm[] = [
  {
    term: "Abelian group",
    category: "Algebra",
    kind: "set",
    description: "A group where the operation can be done in either order.",
    explanation:
      "For every a and b in the group, a * b equals b * a. Integer addition is the standard friendly example.",
    representation:
      "Represent with a closed set of elements and a symmetric operation table.",
  },
  {
    term: "Absolute error",
    category: "Statistics",
    kind: "number-line",
    description: "The raw distance between an estimate and the true value.",
    explanation:
      "It tells how far the answer missed, without caring whether the estimate was too high or too low.",
    representation:
      "Show two points on a number line with the gap between them highlighted.",
  },
  {
    term: "Adjacent vertices",
    category: "Geometry",
    kind: "solid",
    description: "Two vertices connected directly by an edge.",
    explanation:
      "In a polygon or solid, adjacent vertices sit next to each other and share a side or edge.",
    representation: "Highlight two neighboring corners on a polygon or box.",
  },
  {
    term: "Algebraic multiplicity",
    category: "Linear Algebra",
    kind: "matrix",
    description: "How many times an eigenvalue appears as a root.",
    explanation:
      "If a characteristic polynomial has (lambda - 2)^3, then 2 has algebraic multiplicity 3.",
    representation:
      "Show repeated roots in a characteristic polynomial beside a matrix.",
  },
  {
    term: "Alternating angles",
    category: "Geometry",
    kind: "angle",
    description: "Angles on opposite sides of a transversal.",
    explanation:
      "When two parallel lines are cut by a transversal, alternate interior angles are equal.",
    representation:
      "Draw parallel lines, a slanted transversal, and matching angle arcs.",
  },
  {
    term: "Angle of rotation",
    category: "Geometry",
    kind: "angle",
    description: "The amount a figure turns around a fixed point.",
    explanation:
      "A rotation keeps size and shape the same while changing direction around a center.",
    representation:
      "Show a shape before and after turning with an arc arrow between them.",
  },
  {
    term: "Arc cosine",
    category: "Trigonometry",
    kind: "triangle",
    description:
      "The inverse function that returns an angle from a cosine value.",
    explanation:
      "If cos(theta) = x, then arccos(x) gives the angle theta in the allowed principal range.",
    representation:
      "Show a right triangle with adjacent over hypotenuse leading back to an angle.",
  },
  {
    term: "Arc sine",
    category: "Trigonometry",
    kind: "triangle",
    description:
      "The inverse function that returns an angle from a sine value.",
    explanation:
      "If sin(theta) = x, then arcsin(x) gives the angle theta in the principal range.",
    representation: "Show opposite over hypotenuse pointing back to the angle.",
  },
  {
    term: "Area under curve",
    category: "Calculus",
    kind: "graph",
    description: "The accumulated region between a graph and an axis.",
    explanation:
      "A definite integral measures signed area under a curve over an interval.",
    representation: "Shade the region below a curve and above the x-axis.",
  },
  {
    term: "Autocorrelation",
    category: "Statistics",
    kind: "sequence",
    description: "Correlation between a sequence and a shifted copy of itself.",
    explanation:
      "It reveals repeating patterns in time-series data, such as seasonal behavior.",
    representation: "Show two shifted wave-like sequences with matching peaks.",
  },
  {
    term: "Basis vector",
    category: "Linear Algebra",
    kind: "vector",
    description: "A vector used as a building block for coordinates.",
    explanation:
      "In 2D, i and j form a standard basis because every point can be built from horizontal and vertical steps.",
    representation: "Draw two perpendicular unit arrows from the origin.",
  },
  {
    term: "Bernoulli trial",
    category: "Probability",
    kind: "probability",
    description: "A random experiment with exactly two outcomes.",
    explanation:
      "Each trial is success or failure, like heads/tails or pass/fail.",
    representation: "Show one split node branching into success and failure.",
  },
  {
    term: "Bias",
    category: "Statistics",
    kind: "probability",
    description: "A systematic tilt away from the true value.",
    explanation:
      "A biased method misses in a consistent direction even if repeated many times.",
    representation: "Show many estimates clustered to one side of a target.",
  },
  {
    term: "Boundary point",
    category: "Set Theory",
    kind: "coordinate",
    description:
      "A point where every tiny neighborhood touches both inside and outside.",
    explanation:
      "Boundary points sit on the edge of a region, separating the set from its complement.",
    representation: "Highlight a point on the outline of a shaded region.",
  },
  {
    term: "Centroid formula",
    category: "Geometry",
    kind: "coordinate",
    description: "The coordinate average of triangle vertices.",
    explanation:
      "For vertices A, B, and C, the centroid uses the average of x-values and y-values.",
    representation:
      "Draw a triangle with medians meeting at the average point.",
  },
  {
    term: "Characteristic equation",
    category: "Linear Algebra",
    kind: "matrix",
    description: "An equation used to find eigenvalues.",
    explanation:
      "It usually comes from det(A - lambda I) = 0, turning matrix behavior into a polynomial equation.",
    representation: "Show a matrix arrow to a determinant equation.",
  },
  {
    term: "Chebyshev distance",
    category: "Geometry",
    kind: "coordinate",
    description: "Distance measured by the largest coordinate change.",
    explanation:
      "It is like a king move on a chessboard: diagonal and straight steps can count equally.",
    representation: "Show two grid points connected by a square boundary.",
  },
  {
    term: "Chi-square statistic",
    category: "Statistics",
    kind: "probability",
    description: "A measure comparing observed and expected counts.",
    explanation:
      "Large values suggest the observed counts are far from what the model predicted.",
    representation: "Show paired bars for observed and expected frequencies.",
  },
  {
    term: "Closure property",
    category: "Algebra",
    kind: "set",
    description:
      "A set is closed under an operation if results stay inside the set.",
    explanation:
      "Whole numbers are closed under addition because adding two whole numbers gives another whole number.",
    representation:
      "Show two elements combining with an arrow back into the same set.",
  },
  {
    term: "Codomain",
    category: "Set Theory",
    kind: "set",
    description: "The target set where a function is allowed to send outputs.",
    explanation:
      "The range is what the function actually hits; the codomain is the full declared target.",
    representation:
      "Draw arrows from domain elements into a larger target circle.",
  },
  {
    term: "Coefficient matrix",
    category: "Linear Algebra",
    kind: "matrix",
    description: "The matrix made from coefficients in a linear system.",
    explanation:
      "It stores only the numbers multiplying the variables, not the constants on the right side.",
    representation:
      "Highlight variable coefficients inside aligned equations and copy them into a grid.",
  },
  {
    term: "Column rank",
    category: "Linear Algebra",
    kind: "matrix",
    description: "The number of independent columns in a matrix.",
    explanation:
      "It tells how many column directions actually add new information.",
    representation:
      "Show matrix columns as vectors, with dependent columns faded.",
  },
  {
    term: "Complement rule",
    category: "Probability",
    kind: "probability",
    description: "The probability of not A is one minus the probability of A.",
    explanation:
      "Because A and not A fill the whole sample space, their probabilities add to 1.",
    representation:
      "Shade one part of a sample-space rectangle and label the leftover.",
  },
  {
    term: "Concavity",
    category: "Calculus",
    kind: "graph",
    description: "The bending direction of a graph.",
    explanation: "Concave up looks like a cup; concave down bends like a cap.",
    representation: "Draw two curves, one opening upward and one downward.",
  },
  {
    term: "Conic section",
    category: "Geometry",
    kind: "solid",
    description: "A curve made by slicing a cone.",
    explanation:
      "Circles, ellipses, parabolas, and hyperbolas are all conic sections.",
    representation: "Show a cone intersected by a tilted cutting plane.",
  },
  {
    term: "Contradiction proof",
    category: "Logic",
    kind: "logic",
    description: "A proof that assumes the opposite and reaches impossibility.",
    explanation:
      "If the opposite assumption forces a false statement, the original claim must be true.",
    representation:
      "Show an assumption arrow leading to a red impossible symbol.",
  },
  {
    term: "Covariance",
    category: "Statistics",
    kind: "coordinate",
    description: "A measure of how two variables vary together.",
    explanation:
      "Positive covariance means high x-values tend to pair with high y-values.",
    representation:
      "Show a scatter plot with points trending upward or downward.",
  },
  {
    term: "Critical value",
    category: "Statistics",
    kind: "probability",
    description: "A cutoff value used to decide a statistical test.",
    explanation:
      "It marks the boundary between ordinary model behavior and a rejection region.",
    representation:
      "Show a distribution curve with a shaded tail after the cutoff.",
  },
  {
    term: "Curl",
    category: "Calculus",
    kind: "vector",
    description: "A vector calculus measure of local rotation.",
    explanation: "Curl says how much a vector field swirls around a point.",
    representation: "Draw small arrows circulating around a point.",
  },
  {
    term: "Decimal expansion",
    category: "Arithmetic",
    kind: "number-line",
    description: "The digit-by-digit decimal form of a number.",
    explanation:
      "Rational numbers may terminate or repeat, while irrational numbers never settle into a repeating block.",
    representation:
      "Show a number line zooming into tenths, hundredths, and thousandths.",
  },
  {
    term: "Decreasing sequence",
    category: "Calculus",
    kind: "sequence",
    description: "A sequence whose terms move downward.",
    explanation: "Each later term is less than or equal to the previous term.",
    representation: "Plot dots stepping lower from left to right.",
  },
  {
    term: "Degree of polynomial",
    category: "Algebra",
    kind: "graph",
    description: "The highest power of the variable in a polynomial.",
    explanation:
      "The degree often predicts end behavior and maximum possible turning points.",
    representation:
      "Show a polynomial expression with the largest exponent highlighted.",
  },
  {
    term: "Dependent system",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "A system with infinitely many solutions because equations repeat the same condition.",
    explanation: "In graph form, two equations may describe the same line.",
    representation: "Show overlapping lines or repeated matrix rows.",
  },
  {
    term: "Directional derivative",
    category: "Calculus",
    kind: "vector",
    description: "Rate of change of a function in a chosen direction.",
    explanation:
      "Instead of only moving along x or y, it measures slope along any vector direction.",
    representation:
      "Draw a surface contour with an arrow showing the chosen direction.",
  },
  {
    term: "Divergence",
    category: "Calculus",
    kind: "vector",
    description:
      "A measure of how much a vector field spreads out or flows inward.",
    explanation:
      "Positive divergence acts like a source; negative divergence acts like a sink.",
    representation: "Show arrows radiating outward from a point.",
  },
  {
    term: "Dot plot",
    category: "Statistics",
    kind: "probability",
    description: "A simple data display using dots above values.",
    explanation:
      "Each dot represents one observation, so stacks show frequency.",
    representation: "Place dots above a number line at repeated values.",
  },
  {
    term: "Empirical probability",
    category: "Probability",
    kind: "probability",
    description: "Probability estimated from experiments or data.",
    explanation: "It uses observed frequency divided by total trials.",
    representation: "Show repeated trial results as colored outcome dots.",
  },
  {
    term: "Endpoint",
    category: "Geometry",
    kind: "coordinate",
    description: "A point at the end of a segment, ray, or interval.",
    explanation: "Endpoints mark where a finite object begins or stops.",
    representation: "Draw a segment with solid dots at its two ends.",
  },
  {
    term: "Equivalent ratios",
    category: "Arithmetic",
    kind: "fraction",
    description: "Ratios that compare quantities in the same way.",
    explanation:
      "Multiplying or dividing both parts by the same nonzero number creates an equivalent ratio.",
    representation: "Show 2:3 and 4:6 as matching shaded bars.",
  },
  {
    term: "Expected frequency",
    category: "Statistics",
    kind: "probability",
    description: "The count predicted by a probability model.",
    explanation:
      "It equals total trials multiplied by the probability of that outcome.",
    representation: "Show expected bars beside observed bars.",
  },
  {
    term: "Exterior point",
    category: "Geometry",
    kind: "coordinate",
    description: "A point outside a shape or region.",
    explanation:
      "It does not lie inside the boundary and does not sit on the boundary.",
    representation: "Draw a shaded region with one point outside it.",
  },
  {
    term: "Flux",
    category: "Calculus",
    kind: "vector",
    description: "How much of a vector field passes through a surface.",
    explanation:
      "Flux counts flow crossing a boundary, like wind through a window.",
    representation: "Show arrows piercing a rectangular surface.",
  },
  {
    term: "Function inverse graph",
    category: "Algebra",
    kind: "graph",
    description: "The graph of a function with input and output reversed.",
    explanation: "A function and its inverse reflect across the line y = x.",
    representation: "Draw two mirrored curves across a diagonal line.",
  },
  {
    term: "Geometric multiplicity",
    category: "Linear Algebra",
    kind: "vector",
    description: "The number of independent eigenvectors for an eigenvalue.",
    explanation:
      "It measures how many separate directions share the same eigenvalue.",
    representation: "Show several arrows lying in an eigenspace.",
  },
  {
    term: "Gradient vector",
    category: "Calculus",
    kind: "vector",
    description: "A vector pointing in the direction of steepest increase.",
    explanation:
      "For a multivariable function, the gradient gives the fastest uphill direction.",
    representation:
      "Draw contour lines with an arrow crossing them perpendicularly.",
  },
  {
    term: "Group operation",
    category: "Algebra",
    kind: "set",
    description: "The rule used to combine two elements in a group.",
    explanation:
      "The operation must work with closure, associativity, identity, and inverses.",
    representation:
      "Show two elements entering an operation box and one element coming out.",
  },
  {
    term: "Harmonic series",
    category: "Calculus",
    kind: "sequence",
    description: "The series 1 + 1/2 + 1/3 + 1/4 + ...",
    explanation:
      "Its terms shrink to zero, but the total sum still grows without bound.",
    representation:
      "Show shrinking bars whose accumulated height keeps increasing.",
  },
  {
    term: "Homothety",
    category: "Geometry",
    kind: "coordinate",
    description: "A transformation that scales a figure from a fixed center.",
    explanation:
      "Every point moves along a ray from the center by the same scale factor.",
    representation:
      "Show a small triangle and a larger similar triangle aligned from one center.",
  },
  {
    term: "Hypothesis test",
    category: "Statistics",
    kind: "probability",
    description:
      "A method for judging whether data is surprising under a claim.",
    explanation:
      "It compares sample evidence against a null hypothesis using a test statistic or p-value.",
    representation:
      "Show a distribution with an observed statistic marked in the tail.",
  },
  {
    term: "Image of transformation",
    category: "Geometry",
    kind: "coordinate",
    description: "The final figure after a transformation.",
    explanation:
      "A preimage becomes its image after translation, rotation, reflection, or dilation.",
    representation: "Show an original shape and its transformed copy.",
  },
  {
    term: "Improper integral",
    category: "Calculus",
    kind: "graph",
    description:
      "An integral with infinite limits or an infinite discontinuity.",
    explanation:
      "It is evaluated using limits to see whether the area approaches a finite value.",
    representation: "Shade an area extending toward infinity under a curve.",
  },
  {
    term: "Incircle",
    category: "Geometry",
    kind: "triangle",
    description: "The circle tangent to all three sides of a triangle.",
    explanation: "Its center is the incenter, where angle bisectors meet.",
    representation: "Draw a triangle with a circle touching each side.",
  },
  {
    term: "Indicator variable",
    category: "Probability",
    kind: "probability",
    description: "A variable that is 1 if an event happens and 0 otherwise.",
    explanation:
      "It converts a yes/no event into a number for counting or expectation.",
    representation: "Show a switch labeled event on -> 1 and off -> 0.",
  },
  {
    term: "Infimum",
    category: "Algebra",
    kind: "number-line",
    description: "The greatest lower bound of a set.",
    explanation:
      "It is the best possible floor for a set, even if the set never reaches it.",
    representation: "Show a set of points with a boundary marker below them.",
  },
  {
    term: "Interior point",
    category: "Set Theory",
    kind: "coordinate",
    description: "A point surrounded by a small region entirely inside a set.",
    explanation:
      "If you can draw a tiny circle around the point without leaving the set, it is interior.",
    representation:
      "Show a point inside a shaded region with a small circle around it.",
  },
  {
    term: "Invariant",
    category: "Algebra",
    kind: "text",
    description: "A quantity or property that stays unchanged.",
    explanation:
      "Invariants help solve problems by tracking what cannot change during transformations or moves.",
    representation:
      "Show before-and-after states with one highlighted value staying equal.",
  },
  {
    term: "Law of total expectation",
    category: "Probability",
    kind: "probability",
    description: "A rule that averages conditional expectations across cases.",
    explanation:
      "It says an overall expected value can be built from expected values inside groups.",
    representation:
      "Show a tree diagram with branch averages combining into one mean.",
  },
  {
    term: "Least squares",
    category: "Statistics",
    kind: "coordinate",
    description:
      "A method that fits a line by minimizing squared vertical errors.",
    explanation:
      "It chooses the line with the smallest total squared residuals.",
    representation:
      "Show a scatter plot, fit line, and vertical residual segments.",
  },
  {
    term: "Left endpoint",
    category: "Algebra",
    kind: "number-line",
    description: "The starting point on the left side of an interval.",
    explanation:
      "It may be included with a closed dot or excluded with an open dot.",
    representation: "Show an interval with the left boundary emphasized.",
  },
  {
    term: "Linear recurrence",
    category: "Algebra",
    kind: "sequence",
    description: "A sequence rule using previous terms in a linear way.",
    explanation:
      "The Fibonacci rule a_n = a_{n-1} + a_{n-2} is a famous example.",
    representation:
      "Show arrows from earlier terms feeding into the next term.",
  },
  {
    term: "Logarithmic scale",
    category: "Algebra",
    kind: "number-line",
    description: "A scale where equal steps multiply instead of add.",
    explanation:
      "It makes very large ranges easier to compare, such as 1, 10, 100, and 1000.",
    representation: "Draw ticks at powers of 10 with equal spacing.",
  },
  {
    term: "Lower quartile",
    category: "Statistics",
    kind: "probability",
    description: "The median of the lower half of ordered data.",
    explanation:
      "It marks the 25th percentile and helps build the interquartile range.",
    representation: "Show a box plot with Q1 highlighted.",
  },
  {
    term: "Manhattan distance",
    category: "Geometry",
    kind: "coordinate",
    description: "Distance measured by horizontal plus vertical movement.",
    explanation:
      "It is like walking city blocks instead of taking a diagonal shortcut.",
    representation:
      "Show a grid path from one point to another using right-angle steps.",
  },
  {
    term: "Markov chain",
    category: "Probability",
    kind: "probability",
    description:
      "A process where the next state depends only on the current state.",
    explanation:
      "It models systems that jump between states with fixed transition probabilities.",
    representation:
      "Draw circles for states with arrows labeled by probabilities.",
  },
  {
    term: "Matrix determinant zero",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A sign that a matrix transformation collapses space.",
    explanation:
      "When determinant is zero, the matrix is singular and has no inverse.",
    representation: "Show a grid squashed into a line or plane.",
  },
  {
    term: "Matrix power",
    category: "Linear Algebra",
    kind: "matrix",
    description: "Repeated multiplication of a square matrix by itself.",
    explanation:
      "A^3 means A times A times A, often representing repeated transformations.",
    representation: "Show the same matrix action applied step by step.",
  },
  {
    term: "Maximum point",
    category: "Calculus",
    kind: "graph",
    description:
      "A point where a graph reaches a high value compared with nearby points.",
    explanation:
      "A local maximum is highest nearby; an absolute maximum is highest on the whole domain.",
    representation: "Highlight the top of a curve.",
  },
  {
    term: "Median of triangle",
    category: "Geometry",
    kind: "triangle",
    description:
      "A segment from a vertex to the midpoint of the opposite side.",
    explanation: "The three medians of a triangle meet at the centroid.",
    representation:
      "Draw a triangle with a vertex connected to the opposite midpoint.",
  },
  {
    term: "Mesh",
    category: "Geometry",
    kind: "solid",
    description: "A network of connected vertices, edges, and faces.",
    explanation:
      "Meshes approximate curved or complex shapes in geometry and graphics.",
    representation: "Show a surface divided into many small triangles.",
  },
  {
    term: "Minimum point",
    category: "Calculus",
    kind: "graph",
    description:
      "A point where a graph reaches a low value compared with nearby points.",
    explanation:
      "A local minimum is lowest nearby; an absolute minimum is lowest on the whole domain.",
    representation: "Highlight the bottom of a curve.",
  },
  {
    term: "Modular inverse",
    category: "Number Theory",
    kind: "number-line",
    description: "A number that multiplies another to give 1 modulo n.",
    explanation:
      "For example, 3 and 7 are inverses modulo 10 because 3 x 7 = 21 = 1 mod 10.",
    representation: "Show multiplication wrapping around a modular clock.",
  },
  {
    term: "Multiset",
    category: "Set Theory",
    kind: "set",
    description: "A set-like collection where repeated elements count.",
    explanation: "Unlike a normal set, {1,1,2} keeps both copies of 1.",
    representation: "Show a circle containing duplicate tokens.",
  },
  {
    term: "Natural domain",
    category: "Algebra",
    kind: "set",
    description: "All input values for which an expression is defined.",
    explanation:
      "A denominator cannot be zero, and even roots need nonnegative radicands in real-valued work.",
    representation: "Show allowed inputs shaded on a number line.",
  },
  {
    term: "Negative exponent",
    category: "Algebra",
    kind: "fraction",
    description: "An exponent that indicates a reciprocal power.",
    explanation: "a^-n equals 1 divided by a^n when a is nonzero.",
    representation: "Show a power moving from numerator to denominator.",
  },
  {
    term: "Net change",
    category: "Calculus",
    kind: "graph",
    description: "The total change in a quantity over an interval.",
    explanation:
      "For a rate function, the integral gives accumulated net change.",
    representation: "Show signed area above and below the x-axis.",
  },
  {
    term: "One-sided limit",
    category: "Calculus",
    kind: "graph",
    description: "A limit approached from only the left or only the right.",
    explanation:
      "Left-hand and right-hand limits must agree for the two-sided limit to exist.",
    representation: "Show arrows approaching a point from one side of a graph.",
  },
  {
    term: "Orthogonal matrix",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A matrix whose columns form perpendicular unit vectors.",
    explanation:
      "Orthogonal matrices preserve lengths and angles, like rotations and reflections.",
    representation: "Show a grid rotated without stretching.",
  },
  {
    term: "Outcome set",
    category: "Probability",
    kind: "set",
    description: "The collection of outcomes being considered.",
    explanation:
      "It may be the full sample space or a smaller event inside the sample space.",
    representation:
      "Show outcome tokens inside a rectangle, with a subset circled.",
  },
  {
    term: "P-value",
    category: "Statistics",
    kind: "probability",
    description:
      "The probability of seeing data at least this extreme if the null hypothesis is true.",
    explanation:
      "Small p-values suggest the observed data is unusual under the null model.",
    representation: "Shade a tail region beyond the observed statistic.",
  },
  {
    term: "Partial fraction",
    category: "Algebra",
    kind: "fraction",
    description:
      "A decomposition of a rational expression into simpler fractions.",
    explanation:
      "It breaks one complicated fraction into pieces that are easier to integrate or simplify.",
    representation: "Show one fraction splitting into two simpler fractions.",
  },
  {
    term: "Perpendicular bisector",
    category: "Geometry",
    kind: "coordinate",
    description: "A line that cuts a segment in half at a right angle.",
    explanation:
      "Every point on the perpendicular bisector is equally far from the segment endpoints.",
    representation:
      "Draw a segment, its midpoint, and a 90-degree crossing line.",
  },
  {
    term: "Pivot column",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A column containing a leading pivot in row reduction.",
    explanation:
      "Pivot columns identify independent variable directions in a matrix.",
    representation:
      "Show a matrix with leading entries highlighted down the rows.",
  },
  {
    term: "Poisson distribution",
    category: "Probability",
    kind: "probability",
    description: "A distribution for counts of events in a fixed interval.",
    explanation:
      "It models rare or independent counts such as arrivals per minute.",
    representation:
      "Show bars for 0, 1, 2, 3 events with a peak near the average rate.",
  },
  {
    term: "Principal component",
    category: "Statistics",
    kind: "coordinate",
    description: "A direction that captures maximum variation in data.",
    explanation:
      "PCA rotates data axes so the first component follows the longest spread.",
    representation: "Show a scatter cloud with a long axis arrow through it.",
  },
  {
    term: "Probability mass function",
    category: "Probability",
    kind: "probability",
    description: "A rule assigning probabilities to discrete values.",
    explanation:
      "Each value has a probability, and all probabilities add to 1.",
    representation: "Show separate probability bars over integer outcomes.",
  },
  {
    term: "Proof by induction",
    category: "Logic",
    kind: "sequence",
    description:
      "A proof method that starts at a base case and proves the next step.",
    explanation:
      "If the first domino falls and each domino knocks the next, every domino falls.",
    representation: "Show a chain of numbered steps with arrows forward.",
  },
  {
    term: "Proportional relationship",
    category: "Algebra",
    kind: "graph",
    description:
      "A relationship where one quantity is a constant multiple of another.",
    explanation: "Its graph is a straight line through the origin.",
    representation: "Show a line through (0,0) with constant slope.",
  },
  {
    term: "Quantile",
    category: "Statistics",
    kind: "probability",
    description:
      "A cutoff that divides ordered data or probability into parts.",
    explanation: "Quartiles, percentiles, and medians are common quantiles.",
    representation: "Show a distribution split by vertical cutoff lines.",
  },
  {
    term: "Radial symmetry",
    category: "Geometry",
    kind: "circle",
    description: "Symmetry around a central point.",
    explanation:
      "A figure with radial symmetry looks the same after certain rotations around its center.",
    representation: "Show repeated spokes or petals around a center.",
  },
  {
    term: "Rational root theorem",
    category: "Algebra",
    kind: "number-line",
    description: "A theorem listing possible rational roots of a polynomial.",
    explanation:
      "Possible roots come from factors of the constant term over factors of the leading coefficient.",
    representation:
      "Show candidate roots marked on a number line and tested in a polynomial.",
  },
  {
    term: "Rejection region",
    category: "Statistics",
    kind: "probability",
    description:
      "The part of a test distribution where the null hypothesis is rejected.",
    explanation:
      "If the test statistic lands in this region, the data is considered too extreme for the null claim.",
    representation: "Shade one or both tails beyond critical values.",
  },
  {
    term: "Relative error",
    category: "Statistics",
    kind: "fraction",
    description: "Error compared with the true value.",
    explanation:
      "It helps judge whether an error is large relative to the scale of the measurement.",
    representation: "Show absolute error divided by true value.",
  },
  {
    term: "Riemann sum",
    category: "Calculus",
    kind: "graph",
    description: "An approximation of area using many rectangles.",
    explanation:
      "As rectangles get thinner, the sum approaches the definite integral.",
    representation: "Draw rectangles under a curve.",
  },
  {
    term: "Root of equation",
    category: "Algebra",
    kind: "graph",
    description:
      "A value that makes an equation true or a function equal zero.",
    explanation:
      "On a graph, roots appear where the curve crosses or touches the x-axis.",
    representation: "Highlight x-intercepts on a curve.",
  },
  {
    term: "Sample variance",
    category: "Statistics",
    kind: "probability",
    description:
      "A measure of sample spread using squared deviations from the sample mean.",
    explanation:
      "It divides by n - 1 to better estimate population variance from a sample.",
    representation:
      "Show points around a mean line with squared deviation boxes.",
  },
  {
    term: "Squeeze theorem",
    category: "Calculus",
    kind: "graph",
    description:
      "A limit theorem where one function is trapped between two others.",
    explanation:
      "If the upper and lower functions approach the same value, the trapped function must also approach it.",
    representation: "Show a middle curve squeezed between two boundary curves.",
  },
  {
    term: "Standard normal distribution",
    category: "Statistics",
    kind: "probability",
    description:
      "The normal distribution with mean 0 and standard deviation 1.",
    explanation: "Z-scores convert normal data into this standard scale.",
    representation:
      "Show a bell curve centered at 0 with ticks at -1, 0, and 1.",
  },
  {
    term: "Unit rate",
    category: "Arithmetic",
    kind: "fraction",
    description: "A rate with denominator 1.",
    explanation:
      "It tells how much of one quantity corresponds to one unit of another.",
    representation: "Show miles per 1 hour or rupees per 1 item.",
  },
  {
    term: "Upper quartile",
    category: "Statistics",
    kind: "probability",
    description: "The median of the upper half of ordered data.",
    explanation:
      "It marks the 75th percentile and helps compute interquartile range.",
    representation: "Show a box plot with Q3 highlighted.",
  },
  {
    term: "Vector norm",
    category: "Linear Algebra",
    kind: "vector",
    description: "A measure of vector length.",
    explanation:
      "The usual Euclidean norm is the square root of the sum of squared components.",
    representation: "Draw a vector arrow and label its length.",
  },
  {
    term: "Adjugate matrix",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A matrix built from cofactors and used in inverse formulas.",
    explanation:
      "For an invertible square matrix, the inverse can be written using the adjugate divided by the determinant.",
    representation:
      "Show a square matrix turning into a cofactor grid, then transposed.",
  },
  {
    term: "Affine space",
    category: "Geometry",
    kind: "coordinate",
    description:
      "A geometry space where points can be shifted and compared by vectors.",
    explanation:
      "It has points and directions, but no fixed origin is required.",
    representation:
      "Show a coordinate grid with the origin faded and arrows between points highlighted.",
  },
  {
    term: "Angle bisector",
    category: "Geometry",
    kind: "angle",
    description: "A ray or segment that splits an angle into two equal angles.",
    explanation:
      "It gives the exact middle direction between the two sides of an angle.",
    representation:
      "Draw one angle with a central ray and matching angle arcs on both sides.",
  },
  {
    term: "Antiderivative",
    category: "Calculus",
    kind: "graph",
    description: "A function whose derivative gives the original function.",
    explanation:
      "Finding an antiderivative reverses differentiation and is the core idea behind indefinite integration.",
    representation:
      "Show a slope graph feeding into a smoother accumulated curve.",
  },
  {
    term: "Apollonius circle",
    category: "Geometry",
    kind: "circle",
    description:
      "A circle of points with a fixed ratio of distances to two fixed points.",
    explanation:
      "Every point on the circle keeps distance to point A and point B in the same ratio.",
    representation:
      "Draw two fixed points and a circle whose points have paired distance segments.",
  },
  {
    term: "Arithmetic-geometric mean",
    category: "Arithmetic",
    kind: "sequence",
    description:
      "A shared limit reached by repeatedly averaging arithmetically and geometrically.",
    explanation:
      "Starting with two positive numbers, one sequence uses the arithmetic mean and the other uses the geometric mean until they meet.",
    representation:
      "Show two dot sequences moving toward the same center value.",
  },
  {
    term: "Asymptotic behavior",
    category: "Calculus",
    kind: "graph",
    description:
      "How a function behaves as the input becomes very large or approaches a boundary.",
    explanation:
      "It focuses on the long-run shape, growth, or closeness to a line or curve.",
    representation: "Draw a curve getting closer to a dashed guide line.",
  },
  {
    term: "Barycentric coordinates",
    category: "Geometry",
    kind: "triangle",
    description:
      "Coordinates that locate a point by weights at triangle vertices.",
    explanation:
      "A point inside a triangle can be described as a weighted blend of the three corners.",
    representation:
      "Show a triangle with weights at vertices pulling to an interior point.",
  },
  {
    term: "Bernoulli distribution",
    category: "Probability",
    kind: "probability",
    description:
      "A probability distribution for a single success-or-failure trial.",
    explanation: "It assigns probability p to 1 and probability 1 - p to 0.",
    representation: "Show two bars labeled 0 and 1 with heights 1 - p and p.",
  },
  {
    term: "Beta distribution",
    category: "Probability",
    kind: "probability",
    description: "A distribution on values between 0 and 1.",
    explanation:
      "It is often used to model uncertain probabilities, proportions, and rates.",
    representation:
      "Show a smooth curve drawn only across the interval from 0 to 1.",
  },
  {
    term: "Binomial distribution",
    category: "Probability",
    kind: "probability",
    description:
      "A distribution for the number of successes in repeated Bernoulli trials.",
    explanation:
      "It counts how many successes occur in n independent trials with the same success probability.",
    representation:
      "Show bars over 0 through n successes, with the tallest near the expected count.",
  },
  {
    term: "Boolean algebra",
    category: "Logic",
    kind: "logic",
    description: "Algebra of true/false values and logical operations.",
    explanation:
      "It uses operations like AND, OR, and NOT to combine statements.",
    representation: "Show truth values flowing through simple gate boxes.",
  },
  {
    term: "Borel set",
    category: "Set Theory",
    kind: "set",
    description:
      "A set built from open intervals using countable set operations.",
    explanation:
      "Borel sets are the standard measurable sets used for real-line probability and analysis.",
    representation:
      "Show intervals being combined by union, intersection, and complement arrows.",
  },
  {
    term: "Bounded function",
    category: "Calculus",
    kind: "graph",
    description:
      "A function whose values stay between fixed upper and lower limits.",
    explanation:
      "No matter which input is chosen, the output never escapes the bounding lines.",
    representation: "Draw a curve trapped between two horizontal dashed lines.",
  },
  {
    term: "Cartesian vector",
    category: "Linear Algebra",
    kind: "vector",
    description: "A vector described by components along coordinate axes.",
    explanation:
      "In 2D, a Cartesian vector is usually written as horizontal and vertical components.",
    representation: "Draw an arrow decomposed into x and y component arrows.",
  },
  {
    term: "Cavalieri principle",
    category: "Geometry",
    kind: "solid",
    description:
      "A volume principle comparing solids by matching cross-sections.",
    explanation:
      "If two solids have equal cross-sectional areas at every height, they have equal volume.",
    representation:
      "Show two different solids sliced at the same height with equal shaded sections.",
  },
  {
    term: "Central limit theorem",
    category: "Statistics",
    kind: "probability",
    description:
      "A theorem explaining why averages often look normally distributed.",
    explanation:
      "With many independent samples, the distribution of sample means tends toward a bell curve.",
    representation:
      "Show many small sample bars smoothing into a normal curve.",
  },
  {
    term: "Cevian",
    category: "Geometry",
    kind: "triangle",
    description: "A segment from a triangle vertex to the opposite side.",
    explanation:
      "Medians, angle bisectors, and altitudes are special kinds of cevians.",
    representation:
      "Draw a triangle with one vertex connected to a point on the opposite side.",
  },
  {
    term: "Characteristic function",
    category: "Probability",
    kind: "graph",
    description:
      "A function that encodes a probability distribution using expected complex waves.",
    explanation:
      "It uniquely identifies a distribution and helps study sums of random variables.",
    representation:
      "Show a probability shape transforming into a wave-like graph.",
  },
  {
    term: "Circle inversion",
    category: "Geometry",
    kind: "circle",
    description:
      "A transformation that swaps points inside and outside a circle.",
    explanation:
      "Each point moves along the ray from the center so the product of old and new distances is fixed.",
    representation:
      "Show a point inside a circle paired with a point outside on the same radius.",
  },
  {
    term: "Coefficient of variation",
    category: "Statistics",
    kind: "fraction",
    description: "Standard deviation compared with the mean.",
    explanation:
      "It measures relative spread, making variation comparable across different scales.",
    representation: "Show spread divided by center as a compact ratio.",
  },
  {
    term: "Commutative diagram",
    category: "Logic",
    kind: "logic",
    description: "A diagram where different arrow paths give the same result.",
    explanation:
      "It shows that applying functions in different valid orders ends at the same object.",
    representation:
      "Draw a square of nodes with arrows around both paths meeting at one target.",
  },
  {
    term: "Complementary event",
    category: "Probability",
    kind: "probability",
    description: "The event that A does not happen.",
    explanation:
      "An event and its complement fill the whole sample space without overlap.",
    representation:
      "Shade event A in one color and the remaining region as not A.",
  },
  {
    term: "Conditional expectation",
    category: "Probability",
    kind: "probability",
    description:
      "An expected value calculated after some information is known.",
    explanation:
      "It averages outcomes inside a condition, group, or event rather than across everything.",
    representation:
      "Show a probability tree with one branch selected and averaged.",
  },
  {
    term: "Congruence modulo n",
    category: "Number Theory",
    kind: "number-line",
    description:
      "A relation saying two numbers leave the same remainder after division by n.",
    explanation:
      "For example, 17 and 5 are congruent modulo 12 because both have remainder 5.",
    representation:
      "Show numbers landing on the same position of a modular clock.",
  },
  {
    term: "Connected graph",
    category: "Set Theory",
    kind: "set",
    description:
      "A graph where every vertex can be reached from every other vertex.",
    explanation:
      "There is always some path of edges joining any two chosen vertices.",
    representation: "Draw nodes linked in one piece with no isolated island.",
  },
  {
    term: "Continuous function",
    category: "Calculus",
    kind: "graph",
    description: "A function with no breaks, jumps, or holes in its graph.",
    explanation:
      "Small input changes cause small output changes, so the graph can be traced smoothly.",
    representation: "Draw an unbroken curve and contrast it with a faded jump.",
  },
  {
    term: "Convex function",
    category: "Calculus",
    kind: "graph",
    description: "A function whose graph bends upward in a bowl-like way.",
    explanation:
      "The line segment between any two points on the graph stays above the graph.",
    representation: "Show a U-shaped curve with a chord drawn above it.",
  },
  {
    term: "Cosecant graph",
    category: "Trigonometry",
    kind: "graph",
    description: "The graph of the reciprocal of sine.",
    explanation:
      "Where sine is near zero, cosecant grows very large or is undefined.",
    representation: "Show repeating branches with vertical gaps at sine zeros.",
  },
  {
    term: "Cotangent graph",
    category: "Trigonometry",
    kind: "graph",
    description: "The graph of the reciprocal of tangent.",
    explanation:
      "Cotangent repeats every 180 degrees and is undefined where sine is zero.",
    representation:
      "Draw descending repeating branches between vertical asymptotes.",
  },
  {
    term: "Cubic polynomial",
    category: "Algebra",
    kind: "graph",
    description: "A polynomial whose highest power is three.",
    explanation:
      "Its graph often has an S-like shape and can have up to three real roots.",
    representation: "Show a smooth cubic curve crossing the x-axis.",
  },
  {
    term: "Curvature",
    category: "Calculus",
    kind: "graph",
    description: "A measure of how sharply a curve bends.",
    explanation:
      "A straight line has zero curvature, while tight turns have larger curvature.",
    representation:
      "Show a curve with a tight bend highlighted by a small osculating circle.",
  },
  {
    term: "Cylindrical coordinates",
    category: "Geometry",
    kind: "solid",
    description: "A 3D coordinate system using radius, angle, and height.",
    explanation: "It extends polar coordinates upward with a z-value.",
    representation:
      "Show a point located by a circular radius, an angle, and a vertical height.",
  },
  {
    term: "De Moivre theorem",
    category: "Algebra",
    kind: "coordinate",
    description: "A rule for powers of complex numbers in polar form.",
    explanation:
      "It says powers multiply the angle and raise the radius to that power.",
    representation:
      "Show a complex arrow rotating multiple times around the origin.",
  },
  {
    term: "Decimal place value",
    category: "Arithmetic",
    kind: "number-line",
    description:
      "The value of each digit based on its position around the decimal point.",
    explanation:
      "Digits to the left count ones, tens, and hundreds; digits to the right count tenths and hundredths.",
    representation: "Show a place-value chart split by a decimal point.",
  },
  {
    term: "Differential equation",
    category: "Calculus",
    kind: "graph",
    description: "An equation involving a function and its derivatives.",
    explanation:
      "It describes how a quantity changes, often modeling motion, growth, or flow.",
    representation: "Show slope arrows guiding a family of solution curves.",
  },
  {
    term: "Distance formula",
    category: "Geometry",
    kind: "coordinate",
    description: "A formula for distance between two coordinate points.",
    explanation:
      "It comes from the Pythagorean theorem using horizontal and vertical differences.",
    representation:
      "Draw two points with a right triangle connecting dx, dy, and distance.",
  },
  {
    term: "Eigenbasis",
    category: "Linear Algebra",
    kind: "vector",
    description: "A basis made of eigenvectors.",
    explanation:
      "When a matrix has an eigenbasis, its action becomes easier to understand as stretching along fixed directions.",
    representation:
      "Show independent eigenvector arrows forming coordinate axes.",
  },
  {
    term: "Eigenvalue decomposition",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "A factorization that separates a matrix into eigenvectors and eigenvalues.",
    explanation:
      "It rewrites a matrix action as change of basis, scaling, and changing back.",
    representation:
      "Show a matrix splitting into vector, diagonal scale, and inverse vector blocks.",
  },
  {
    term: "Elementary row operation",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A basic move used to simplify matrix rows.",
    explanation:
      "You may swap rows, scale a row, or add a multiple of one row to another.",
    representation:
      "Show one highlighted matrix row transforming into a simpler row.",
  },
  {
    term: "Equivalence class",
    category: "Set Theory",
    kind: "set",
    description: "A group of objects considered the same under a relation.",
    explanation:
      "For congruence modulo n, all numbers with the same remainder form one equivalence class.",
    representation: "Show a set partitioned into labeled clusters.",
  },
  {
    term: "Euler formula",
    category: "Algebra",
    kind: "coordinate",
    description:
      "The identity connecting complex exponentials with sine and cosine.",
    explanation: "It says e^(ix) = cos x + i sin x, linking rotation to waves.",
    representation: "Show a unit-circle point with cosine on x and sine on y.",
  },
  {
    term: "Exponential growth",
    category: "Algebra",
    kind: "graph",
    description:
      "Growth where a quantity is repeatedly multiplied by a fixed factor.",
    explanation:
      "The same percentage increase creates faster and faster absolute growth.",
    representation: "Draw a curve rising slowly first and then steeply upward.",
  },
  {
    term: "Fermat little theorem",
    category: "Number Theory",
    kind: "number-line",
    description: "A theorem about powers modulo a prime.",
    explanation:
      "If p is prime and a is not divisible by p, then a^(p-1) leaves remainder 1 modulo p.",
    representation:
      "Show powers wrapping around a modular clock and returning to 1.",
  },
  {
    term: "Finite field",
    category: "Algebra",
    kind: "set",
    description: "A field with finitely many elements.",
    explanation:
      "Addition, subtraction, multiplication, and division work inside the set, except division by zero.",
    representation: "Show a small closed table of modular arithmetic values.",
  },
  {
    term: "First quartile",
    category: "Statistics",
    kind: "probability",
    description: "The value below which about 25 percent of ordered data lies.",
    explanation:
      "It is also called Q1 and marks the left edge of the box in a box plot.",
    representation: "Show the first quarter of a sorted data line shaded.",
  },
  {
    term: "Fourier coefficient",
    category: "Calculus",
    kind: "graph",
    description:
      "A number measuring how much of a sine or cosine wave is present.",
    explanation:
      "Fourier coefficients build complex waves from simpler repeating waves.",
    representation: "Show a signal decomposed into small sine-wave components.",
  },
  {
    term: "Gamma function",
    category: "Calculus",
    kind: "graph",
    description: "A function that extends factorials beyond whole numbers.",
    explanation: "For positive integers, Gamma(n) equals (n - 1) factorial.",
    representation:
      "Draw a smooth curve passing through factorial-related points.",
  },
  {
    term: "Gaussian elimination",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A row-reduction method for solving linear systems.",
    explanation:
      "It uses row operations to turn a system into a simpler triangular or echelon form.",
    representation:
      "Show a matrix becoming stair-stepped from top left to bottom right.",
  },
  {
    term: "Generating function",
    category: "Algebra",
    kind: "sequence",
    description: "A power series that stores a sequence as coefficients.",
    explanation:
      "It turns sequence problems into algebra problems using a single formal expression.",
    representation:
      "Show sequence terms entering coefficient slots of a power series.",
  },
  {
    term: "Geodesic",
    category: "Geometry",
    kind: "solid",
    description: "The shortest path between points on a curved surface.",
    explanation:
      "On a sphere, geodesics are arcs of great circles rather than flat straight lines.",
    representation:
      "Show two points on a sphere connected by a curved shortest path.",
  },
  {
    term: "Graph adjacency matrix",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A matrix that records which graph vertices are connected.",
    explanation:
      "A 1 or weight in row i, column j means there is an edge from vertex i to vertex j.",
    representation: "Show a node graph beside a matching 0-1 matrix.",
  },
  {
    term: "Green theorem",
    category: "Calculus",
    kind: "vector",
    description:
      "A theorem connecting circulation around a boundary with behavior inside a region.",
    explanation:
      "It converts a line integral around a closed curve into a double integral over the enclosed area.",
    representation:
      "Show arrows around a loop with the interior region shaded.",
  },
  {
    term: "Hadamard product",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "Cell-by-cell multiplication of two matrices of the same size.",
    explanation:
      "Each output entry is made by multiplying matching entries, not row-by-column products.",
    representation:
      "Show two equal-size grids multiplying matching cells into a third grid.",
  },
  {
    term: "Half open interval",
    category: "Algebra",
    kind: "number-line",
    description:
      "An interval that includes one endpoint and excludes the other.",
    explanation:
      "It is written like [a,b) or (a,b], using one closed and one open endpoint.",
    representation:
      "Show a number-line segment with one solid dot and one hollow dot.",
  },
  {
    term: "Harmonic number",
    category: "Number Theory",
    kind: "sequence",
    description: "A partial sum of the harmonic series.",
    explanation: "The nth harmonic number adds 1 + 1/2 + 1/3 + ... + 1/n.",
    representation:
      "Show shrinking fraction bars stacking into a growing total.",
  },
  {
    term: "Hermitian matrix",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A complex matrix equal to its conjugate transpose.",
    explanation:
      "Hermitian matrices behave like symmetric matrices in complex vector spaces and have real eigenvalues.",
    representation:
      "Show a matrix mirrored across the diagonal with conjugate pairs.",
  },
  {
    term: "Hypergeometric distribution",
    category: "Probability",
    kind: "probability",
    description: "A distribution for successes drawn without replacement.",
    explanation:
      "It models sampling from a finite group where each draw changes what remains.",
    representation:
      "Show balls removed from a box and success counts shown as bars.",
  },
  {
    term: "Implicit differentiation",
    category: "Calculus",
    kind: "graph",
    description:
      "A method for differentiating equations where y is not isolated.",
    explanation:
      "It treats y as a function of x and differentiates both sides of the relation.",
    representation:
      "Show a curve from an equation with a tangent drawn at one point.",
  },
  {
    term: "Independent set",
    category: "Set Theory",
    kind: "set",
    description: "A set of graph vertices with no edges between them.",
    explanation:
      "No two chosen vertices are adjacent, so the selected points stay separated.",
    representation:
      "Draw a graph with non-touching selected nodes highlighted.",
  },
  {
    term: "Initial condition",
    category: "Calculus",
    kind: "coordinate",
    description: "A starting value used to choose one solution from many.",
    explanation:
      "Differential equations often have many solution curves; an initial condition selects the one passing through a given point.",
    representation:
      "Show a family of curves with one curve passing through a marked point.",
  },
  {
    term: "Integer partition",
    category: "Number Theory",
    kind: "set",
    description: "A way to write a whole number as a sum of positive integers.",
    explanation:
      "Order does not matter, so 3 + 2 and 2 + 3 are the same partition of 5.",
    representation: "Show one number split into stacks of smaller blocks.",
  },
  {
    term: "Intercept form",
    category: "Algebra",
    kind: "graph",
    description:
      "A line or curve form that highlights where it crosses the axes.",
    explanation:
      "For a line, intercept form shows the x-intercept and y-intercept directly.",
    representation:
      "Draw a line crossing both axes with the intercepts labeled.",
  },
  {
    term: "Inverse variation",
    category: "Algebra",
    kind: "graph",
    description:
      "A relationship where one quantity decreases as the other increases by a reciprocal rule.",
    explanation:
      "The product of the two variables stays constant, such as xy = k.",
    representation:
      "Show a hyperbola-like curve with paired rectangles of equal area.",
  },
  {
    term: "Isometry",
    category: "Geometry",
    kind: "coordinate",
    description: "A transformation that preserves distances.",
    explanation:
      "Translations, rotations, and reflections move figures without changing their size or shape.",
    representation:
      "Show a shape moved to a new position with matching side lengths.",
  },
  {
    term: "Jordan curve",
    category: "Geometry",
    kind: "coordinate",
    description: "A simple closed curve with no self-intersections.",
    explanation:
      "It separates the plane into an inside region and an outside region.",
    representation:
      "Draw a closed loop with inside shaded and outside left clear.",
  },
  {
    term: "Lagrange multiplier",
    category: "Calculus",
    kind: "coordinate",
    description: "A method for optimizing a function subject to a constraint.",
    explanation:
      "At the best constrained point, the objective gradient aligns with the constraint gradient.",
    representation:
      "Show contour curves touching a constraint curve at one tangent point.",
  },
  {
    term: "Laplace transform",
    category: "Calculus",
    kind: "graph",
    description:
      "A transform that changes a time-domain function into an s-domain function.",
    explanation:
      "It helps solve differential equations by turning derivatives into algebraic expressions.",
    representation:
      "Show a time graph passing through an arrow into a simpler algebra panel.",
  },
  {
    term: "Least upper bound",
    category: "Algebra",
    kind: "number-line",
    description:
      "The smallest number that is still above every element of a set.",
    explanation:
      "It is also called the supremum and may or may not belong to the set.",
    representation:
      "Show set points on a number line with the tightest upper marker.",
  },
  {
    term: "Legendre polynomial",
    category: "Calculus",
    kind: "graph",
    description:
      "A special polynomial family used in approximation and physics.",
    explanation:
      "These polynomials are orthogonal on an interval and appear in spherical problems.",
    representation:
      "Show several smooth polynomial curves crossing an interval.",
  },
  {
    term: "Linear programming",
    category: "Algebra",
    kind: "coordinate",
    description: "Optimization with linear constraints and a linear objective.",
    explanation:
      "The best solution usually occurs at a corner of the feasible region.",
    representation:
      "Show a shaded polygon region with objective lines sliding to a corner.",
  },
  {
    term: "Lipschitz continuity",
    category: "Calculus",
    kind: "graph",
    description:
      "A controlled kind of continuity with a maximum steepness rate.",
    explanation:
      "The function cannot change faster than a fixed multiple of the input change.",
    representation: "Draw a curve trapped within slope guide cones.",
  },
  {
    term: "Logistic regression",
    category: "Statistics",
    kind: "graph",
    description: "A model for predicting probabilities of binary outcomes.",
    explanation:
      "It uses an S-shaped curve to keep predicted probabilities between 0 and 1.",
    representation:
      "Show data points with a sigmoid probability curve through them.",
  },
  {
    term: "Maclaurin polynomial",
    category: "Calculus",
    kind: "graph",
    description: "A polynomial approximation built from derivatives at zero.",
    explanation:
      "It approximates a function near x = 0 using the first terms of its Maclaurin series.",
    representation:
      "Show a curve and a nearby polynomial hugging it around the origin.",
  },
  {
    term: "Marginal probability",
    category: "Probability",
    kind: "probability",
    description:
      "The probability of one event after summing over other variables.",
    explanation:
      "It is found from the margin totals of a table or by adding joint probabilities.",
    representation:
      "Show a two-way table with row or column totals highlighted.",
  },
  {
    term: "Matrix diagonalization",
    category: "Linear Algebra",
    kind: "matrix",
    description: "Rewriting a matrix as a diagonal matrix in a better basis.",
    explanation:
      "Diagonalization reveals independent stretching directions and simplifies powers of matrices.",
    representation:
      "Show a full matrix becoming a diagonal grid through a basis change.",
  },
  {
    term: "Mean value theorem",
    category: "Calculus",
    kind: "graph",
    description:
      "A theorem linking average slope to an equal instantaneous slope.",
    explanation:
      "For a smooth curve, some tangent slope matches the slope of the secant over the interval.",
    representation:
      "Draw a secant line and a parallel tangent line on the same curve.",
  },
  {
    term: "Measure zero",
    category: "Set Theory",
    kind: "number-line",
    description:
      "A set that can be covered by intervals with arbitrarily small total length.",
    explanation:
      "Finite sets of points on a line have measure zero because they take up no length.",
    representation:
      "Show tiny intervals covering isolated points on a number line.",
  },
  {
    term: "Moment generating function",
    category: "Statistics",
    kind: "graph",
    description: "A function that stores moments of a random variable.",
    explanation:
      "When it exists, derivatives of this function reveal mean, variance, and higher moments.",
    representation:
      "Show a distribution feeding into a curve with derivative markers.",
  },
  {
    term: "Monic polynomial",
    category: "Algebra",
    kind: "graph",
    description: "A polynomial whose leading coefficient is 1.",
    explanation:
      "The highest-power term begins with coefficient 1, such as x^3 - 2x + 5.",
    representation: "Highlight the leading term of a polynomial expression.",
  },
  {
    term: "Monte Carlo method",
    category: "Probability",
    kind: "probability",
    description: "A method using random sampling to estimate a result.",
    explanation:
      "Many random trials approximate areas, probabilities, or expected values.",
    representation: "Show random dots inside a region with a shaded estimate.",
  },
  {
    term: "Multivariable function",
    category: "Calculus",
    kind: "solid",
    description: "A function with more than one input variable.",
    explanation:
      "For example, z = f(x,y) assigns a height to each point in the xy-plane.",
    representation: "Show a 3D surface rising over a coordinate grid.",
  },
  {
    term: "Newton method",
    category: "Calculus",
    kind: "graph",
    description: "An iterative method for approximating roots.",
    explanation:
      "It uses tangent lines to jump from one estimate to a better estimate.",
    representation:
      "Show a curve with tangent steps moving toward an x-intercept.",
  },
  {
    term: "Normal approximation",
    category: "Statistics",
    kind: "probability",
    description: "Using a normal curve to approximate another distribution.",
    explanation:
      "Large binomial or sample distributions can often be estimated by a bell curve.",
    representation: "Show histogram bars with a smooth bell curve overlaid.",
  },
  {
    term: "Null space",
    category: "Linear Algebra",
    kind: "matrix",
    description: "All vectors that a matrix sends to the zero vector.",
    explanation:
      "It describes the directions collapsed by a linear transformation.",
    representation: "Show several input arrows mapping into the origin.",
  },
  {
    term: "Objective function",
    category: "Algebra",
    kind: "graph",
    description: "The quantity being maximized or minimized.",
    explanation:
      "In optimization, constraints limit choices while the objective measures what is best.",
    representation:
      "Show contour lines or level lines sliding across a feasible region.",
  },
  {
    term: "Open cover",
    category: "Set Theory",
    kind: "set",
    description: "A collection of open sets whose union contains a target set.",
    explanation: "Open covers are central in compactness and analysis.",
    representation:
      "Show overlapping open intervals covering every point of a smaller set.",
  },
  {
    term: "Ordinary differential equation",
    category: "Calculus",
    kind: "graph",
    description: "A differential equation involving one independent variable.",
    explanation: "It relates a function of one variable to its derivatives.",
    representation:
      "Show slope arrows along an x-y plane with solution curves.",
  },
  {
    term: "Orthonormal basis",
    category: "Linear Algebra",
    kind: "vector",
    description: "A basis of perpendicular unit vectors.",
    explanation:
      "It makes coordinates clean because directions are independent and length one.",
    representation:
      "Draw perpendicular unit arrows from the origin with equal lengths.",
  },
  {
    term: "Parametric curve",
    category: "Geometry",
    kind: "coordinate",
    description: "A curve traced by coordinates depending on a parameter.",
    explanation:
      "Instead of y as a function of x, both x and y are controlled by a moving parameter.",
    representation: "Show a dot moving along a curve with a small t label.",
  },
  {
    term: "Partial sum",
    category: "Calculus",
    kind: "sequence",
    description: "The sum of the first several terms of a sequence or series.",
    explanation:
      "Partial sums reveal whether an infinite series is settling down or growing.",
    representation: "Show bars accumulating one by one into a running total.",
  },
  {
    term: "Permutation matrix",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A matrix that reorders coordinates or rows.",
    explanation:
      "Multiplying by it swaps positions without changing the values themselves.",
    representation:
      "Show a matrix with one highlighted 1 in each row and column.",
  },
  {
    term: "Phase portrait",
    category: "Calculus",
    kind: "vector",
    description: "A picture of solution paths for a dynamical system.",
    explanation: "It shows how points move through state space over time.",
    representation:
      "Draw arrows and curved trajectories flowing around equilibrium points.",
  },
  {
    term: "Piecewise linear function",
    category: "Algebra",
    kind: "graph",
    description: "A function made of straight-line pieces.",
    explanation:
      "Different intervals use different linear rules joined at breakpoints.",
    representation:
      "Show connected line segments with corner points highlighted.",
  },
  {
    term: "Point estimate",
    category: "Statistics",
    kind: "probability",
    description: "A single-number estimate of an unknown population value.",
    explanation: "A sample mean can be a point estimate for a population mean.",
    representation:
      "Show a target value estimated by one marked dot from a sample.",
  },
  {
    term: "Polar form",
    category: "Algebra",
    kind: "coordinate",
    description: "A way to write a complex number using magnitude and angle.",
    explanation:
      "Instead of a + bi, polar form uses radius and direction from the origin.",
    representation: "Draw a complex-plane arrow with length r and angle theta.",
  },
  {
    term: "Positive definite matrix",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "A symmetric matrix that gives positive quadratic values for nonzero vectors.",
    explanation:
      "It behaves like a bowl-shaped energy form and appears in optimization.",
    representation: "Show a matrix beside an upward bowl surface.",
  },
  {
    term: "Prime gap",
    category: "Number Theory",
    kind: "number-line",
    description: "The distance between consecutive prime numbers.",
    explanation: "For example, the gap between 7 and 11 is 4.",
    representation:
      "Show primes marked on a number line with spaces between neighboring primes.",
  },
  {
    term: "Projection matrix",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A matrix that drops vectors onto a subspace.",
    explanation:
      "Applying it twice gives the same result because the vector is already projected.",
    representation:
      "Show a vector falling perpendicularly onto a line or plane.",
  },
  {
    term: "Pseudoinverse",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "A generalized inverse for matrices that may not be square or invertible.",
    explanation:
      "It helps solve least-squares problems when exact inverse methods do not apply.",
    representation:
      "Show a rectangular matrix linked to a best-fit solution vector.",
  },
  {
    term: "Abel summation",
    category: "Calculus",
    kind: "sequence",
    description: "A summation method that rearranges products of sequences.",
    explanation:
      "It works like integration by parts for sums, separating cumulative totals from differences.",
    representation:
      "Show sequence bars grouped into running totals with difference arrows.",
  },
  {
    term: "Absolute continuity",
    category: "Calculus",
    kind: "graph",
    description:
      "A strong form of continuity controlled by total interval length.",
    explanation:
      "Small enough input intervals force the total output change to be small.",
    representation:
      "Show tiny intervals on the x-axis producing tiny vertical changes on a curve.",
  },
  {
    term: "Accumulation point",
    category: "Set Theory",
    kind: "coordinate",
    description: "A point that other points of a set get arbitrarily close to.",
    explanation:
      "Every small neighborhood around it contains another point from the set.",
    representation: "Show many dots clustering around one highlighted point.",
  },
  {
    term: "Adaptive quadrature",
    category: "Calculus",
    kind: "graph",
    description:
      "Numerical integration that uses smaller pieces where a curve is harder.",
    explanation:
      "The method refines intervals in bendy regions and uses wider intervals where the curve is smooth.",
    representation:
      "Draw rectangles or panels under a curve with denser panels near sharp bends.",
  },
  {
    term: "Algebraic closure",
    category: "Algebra",
    kind: "set",
    description:
      "A field extension where every nonconstant polynomial has a root.",
    explanation:
      "Complex numbers are algebraically closed, so polynomial roots do not need to leave the complex plane.",
    representation:
      "Show a field circle expanding until every polynomial arrow lands inside it.",
  },
  {
    term: "Alternating harmonic series",
    category: "Calculus",
    kind: "sequence",
    description: "The series 1 - 1/2 + 1/3 - 1/4 + ...",
    explanation:
      "Its terms alternate signs and shrink, so the partial sums settle toward a limit.",
    representation:
      "Show partial-sum dots jumping above and below a horizontal limit line.",
  },
  {
    term: "Annihilator",
    category: "Linear Algebra",
    kind: "vector",
    description:
      "A collection of linear functionals that send chosen vectors to zero.",
    explanation: "It captures all measurements that vanish on a subspace.",
    representation: "Show vectors in a subspace being mapped to a zero marker.",
  },
  {
    term: "Area between curves",
    category: "Calculus",
    kind: "graph",
    description: "The region trapped between two graphs over an interval.",
    explanation: "It is computed by integrating top curve minus bottom curve.",
    representation:
      "Shade the vertical gap between two curves from left boundary to right boundary.",
  },
  {
    term: "Bayes factor",
    category: "Statistics",
    kind: "probability",
    description: "A ratio comparing how well two hypotheses explain the data.",
    explanation:
      "Values above 1 favor the first hypothesis, while values below 1 favor the second.",
    representation:
      "Show two evidence scales with likelihood weights on each side.",
  },
  {
    term: "Bezier curve",
    category: "Geometry",
    kind: "coordinate",
    description: "A smooth curve controlled by anchor and handle points.",
    explanation:
      "Moving the control points changes the curve shape without drawing every point manually.",
    representation: "Show a curve pulled by polygon control handles.",
  },
  {
    term: "Biconnected graph",
    category: "Set Theory",
    kind: "set",
    description: "A graph that stays connected after removing any one vertex.",
    explanation:
      "It has no single critical vertex whose removal breaks the graph apart.",
    representation:
      "Draw a node network with multiple alternate paths around each node.",
  },
  {
    term: "Bilinear form",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A rule that is linear in each of two vector inputs.",
    explanation:
      "Dot products and matrix expressions like x^T A y are common examples.",
    representation:
      "Show two vectors entering a matrix box and producing one scalar.",
  },
  {
    term: "Birthday paradox",
    category: "Probability",
    kind: "probability",
    description:
      "The surprising chance that two people in a group share a birthday.",
    explanation:
      "Pair counts grow quickly, so matching birthdays become likely with fewer people than intuition expects.",
    representation: "Show many person pairs connected in a growing network.",
  },
  {
    term: "Bivariate data",
    category: "Statistics",
    kind: "coordinate",
    description: "Data with two measured variables for each observation.",
    explanation: "Each observation becomes one point on a scatter plot.",
    representation: "Show paired x and y values plotted as dots.",
  },
  {
    term: "Brownian motion",
    category: "Probability",
    kind: "coordinate",
    description: "A random continuous path with jittery movement.",
    explanation:
      "It models unpredictable motion such as particle paths or idealized financial noise.",
    representation: "Show a jagged wandering curve starting from one point.",
  },
  {
    term: "Cantor function",
    category: "Calculus",
    kind: "graph",
    description:
      "A famous continuous staircase-like function linked to the Cantor set.",
    explanation:
      "It increases from 0 to 1 while staying flat on many intervals.",
    representation: "Draw a step-like curve with many flat shelves.",
  },
  {
    term: "Categorical data",
    category: "Statistics",
    kind: "probability",
    description:
      "Data sorted into labels or groups instead of measured numbers.",
    explanation:
      "Examples include color, class, blood type, or yes/no responses.",
    representation: "Show colored category boxes with counts above each label.",
  },
  {
    term: "Cauchy product",
    category: "Calculus",
    kind: "sequence",
    description:
      "A way to multiply two infinite series term by term through convolution.",
    explanation:
      "Each coefficient of the product collects all pairs of terms whose indices add to that position.",
    representation:
      "Show two sequences feeding diagonal pair sums into a new sequence.",
  },
  {
    term: "Cayley table",
    category: "Algebra",
    kind: "set",
    description:
      "A grid showing the result of combining every pair of elements under an operation.",
    explanation:
      "It is useful for seeing structure in finite groups or modular operations.",
    representation:
      "Show row and column elements meeting inside an operation table.",
  },
  {
    term: "Chain complex",
    category: "Algebra",
    kind: "logic",
    description:
      "A sequence of objects connected by maps whose consecutive composition is zero.",
    explanation:
      "It organizes algebraic information so boundaries of boundaries vanish.",
    representation:
      "Show boxes connected by arrows with every two-step path marked zero.",
  },
  {
    term: "Change of base formula",
    category: "Algebra",
    kind: "graph",
    description: "A formula for rewriting logarithms using a different base.",
    explanation:
      "It lets log base b of x be computed using logs in any convenient base.",
    representation: "Show one logarithm splitting into a ratio of two logs.",
  },
  {
    term: "Change of variables",
    category: "Calculus",
    kind: "coordinate",
    description:
      "A method for rewriting an integral using new coordinates or inputs.",
    explanation:
      "It changes the region and scale, often making the integral easier.",
    representation:
      "Show a warped grid transforming into a simpler rectangular grid.",
  },
  {
    term: "Chord theorem",
    category: "Geometry",
    kind: "circle",
    description: "A theorem about intersecting chords inside a circle.",
    explanation:
      "When two chords cross, the products of the two segment lengths are equal.",
    representation:
      "Draw two crossing chords with four segment lengths labeled.",
  },
  {
    term: "Circle packing",
    category: "Geometry",
    kind: "circle",
    description: "An arrangement of circles that do not overlap.",
    explanation:
      "Circle packings study how circles can touch and fill a region efficiently.",
    representation: "Show many tangent circles packed inside a boundary.",
  },
  {
    term: "Clopen set",
    category: "Set Theory",
    kind: "set",
    description: "A set that is both closed and open in a given topology.",
    explanation:
      "Whether a set is clopen depends on the surrounding space and its topology.",
    representation:
      "Show one highlighted region labeled as both open and closed.",
  },
  {
    term: "Cofactor expansion",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A determinant method expanding along a row or column.",
    explanation:
      "It breaks a determinant into smaller determinants weighted by signs and entries.",
    representation:
      "Highlight one matrix row with arrows to smaller minor matrices.",
  },
  {
    term: "Compact set",
    category: "Set Theory",
    kind: "coordinate",
    description: "A set where every open cover has a finite subcover.",
    explanation:
      "In ordinary Euclidean space, closed and bounded sets are compact.",
    representation:
      "Show many cover intervals reduced to a few selected covers.",
  },
  {
    term: "Complete metric space",
    category: "Set Theory",
    kind: "coordinate",
    description:
      "A space where every Cauchy sequence converges inside the space.",
    explanation:
      "Sequences that should settle down do not fall into missing holes.",
    representation:
      "Show a dot sequence moving inward to a limit point inside a region.",
  },
  {
    term: "Conditional density",
    category: "Probability",
    kind: "probability",
    description:
      "A density for one variable after another variable is fixed or known.",
    explanation:
      "It slices a joint distribution and renormalizes the remaining probabilities.",
    representation: "Show a 2D probability surface sliced at one x-value.",
  },
  {
    term: "Confidence interval",
    category: "Statistics",
    kind: "number-line",
    description: "A range of plausible values for an unknown parameter.",
    explanation:
      "It uses sample data to give an interval estimate rather than a single guess.",
    representation:
      "Show a number-line interval centered around a sample estimate.",
  },
  {
    term: "Conjugacy class",
    category: "Algebra",
    kind: "set",
    description: "A set of group elements related by conjugation.",
    explanation:
      "Elements in the same conjugacy class behave similarly inside the group structure.",
    representation:
      "Show elements grouped into clusters by curved conjugation arrows.",
  },
  {
    term: "Constraint equation",
    category: "Algebra",
    kind: "coordinate",
    description: "An equation that limits the allowed values in a problem.",
    explanation:
      "Optimization and modeling problems use constraints to define feasible choices.",
    representation:
      "Show a curve or line restricting a shaded feasible region.",
  },
  {
    term: "Convergent sequence",
    category: "Calculus",
    kind: "sequence",
    description: "A sequence whose terms approach a fixed value.",
    explanation:
      "As the index grows, the terms get closer and closer to the limit.",
    representation:
      "Show dots approaching a horizontal line from one side or both sides.",
  },
  {
    term: "Coordinate transformation",
    category: "Geometry",
    kind: "coordinate",
    description: "A change from one coordinate system to another.",
    explanation:
      "The same point can be described differently after rotating, shifting, or warping axes.",
    representation:
      "Show one point labeled in two overlapping coordinate grids.",
  },
  {
    term: "Coprime integers",
    category: "Number Theory",
    kind: "set",
    description: "Two integers whose greatest common divisor is 1.",
    explanation:
      "They share no prime factor, so their factor sets do not overlap except at 1.",
    representation: "Show two factor circles with no shared prime tokens.",
  },
  {
    term: "Critical number",
    category: "Calculus",
    kind: "graph",
    description: "An input where the derivative is zero or undefined.",
    explanation:
      "Critical numbers are candidates for local maxima, minima, or sharp turns.",
    representation: "Mark peaks, valleys, and corners on a curve.",
  },
  {
    term: "Cross-section",
    category: "Geometry",
    kind: "solid",
    description: "The shape made by slicing through a solid.",
    explanation:
      "Different slicing angles can reveal circles, rectangles, triangles, or other shapes.",
    representation: "Show a plane cutting a 3D solid with the cut face shaded.",
  },
  {
    term: "Cumulative sum",
    category: "Arithmetic",
    kind: "sequence",
    description: "A running total formed by adding terms one at a time.",
    explanation:
      "Each new value includes all previous values plus the next term.",
    representation: "Show sequence bars stacking into a growing total line.",
  },
  {
    term: "Decomposition",
    category: "Algebra",
    kind: "text",
    description: "Breaking an object into simpler parts.",
    explanation:
      "Numbers, matrices, functions, and shapes can often be understood by decomposing them.",
    representation:
      "Show one large block splitting into labeled smaller pieces.",
  },
  {
    term: "Negative definite matrix",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "A symmetric matrix whose quadratic form is always negative for nonzero vectors.",
    explanation:
      "It behaves like a downward bowl in optimization and curvature analysis.",
    representation: "Show a matrix beside an upside-down bowl surface.",
  },
  {
    term: "Del operator",
    category: "Calculus",
    kind: "vector",
    description:
      "A vector differential operator used for gradient, divergence, and curl.",
    explanation:
      "It packages partial derivatives into one symbol for multivariable calculus.",
    representation:
      "Show one operator branching into gradient, divergence, and curl arrows.",
  },
  {
    term: "Density function",
    category: "Probability",
    kind: "probability",
    description:
      "A curve whose area gives probability for continuous variables.",
    explanation:
      "The probability of an interval is the area under the density curve over that interval.",
    representation: "Shade an interval under a smooth probability curve.",
  },
  {
    term: "Descartes rule of signs",
    category: "Algebra",
    kind: "graph",
    description: "A rule estimating possible positive roots of a polynomial.",
    explanation:
      "The number of sign changes in coefficients bounds the number of positive real roots.",
    representation:
      "Highlight plus and minus signs in a polynomial coefficient row.",
  },
  {
    term: "Difference equation",
    category: "Algebra",
    kind: "sequence",
    description: "An equation that relates sequence values at different steps.",
    explanation: "It is the discrete-time cousin of a differential equation.",
    representation: "Show indexed terms connected by arrows from n to n+1.",
  },
  {
    term: "Dijkstra algorithm",
    category: "Set Theory",
    kind: "set",
    description: "An algorithm for finding shortest paths in a weighted graph.",
    explanation:
      "It repeatedly locks in the nearest unvisited node until shortest distances are known.",
    representation:
      "Show a weighted node graph with the shortest route highlighted.",
  },
  {
    term: "Direct sum",
    category: "Linear Algebra",
    kind: "vector",
    description: "A way to combine spaces without overlap except zero.",
    explanation:
      "Every vector in the combined space has a unique decomposition into parts from each subspace.",
    representation:
      "Show two subspace arrows joining into one coordinate plane.",
  },
  {
    term: "Discrete Fourier transform",
    category: "Calculus",
    kind: "sequence",
    description:
      "A transform that converts sampled data into frequency components.",
    explanation:
      "It reveals how much of each repeating wave appears in a discrete signal.",
    representation:
      "Show sampled dots transforming into vertical frequency bars.",
  },
  {
    term: "Discrete random variable",
    category: "Probability",
    kind: "probability",
    description: "A random variable with separate countable possible values.",
    explanation: "Each possible value has its own probability mass.",
    representation: "Show distinct bars above integer outcome labels.",
  },
  {
    term: "Distribution function",
    category: "Probability",
    kind: "graph",
    description:
      "A function giving probability that a variable is less than or equal to x.",
    explanation: "It accumulates probability from left to right.",
    representation: "Show a nondecreasing curve rising from 0 to 1.",
  },
  {
    term: "Divisor function",
    category: "Number Theory",
    kind: "number-line",
    description: "A function that counts or sums divisors of an integer.",
    explanation:
      "For example, one version counts how many positive divisors a number has.",
    representation: "Show a number connected to all of its divisor markers.",
  },
  {
    term: "Dot product formula",
    category: "Linear Algebra",
    kind: "vector",
    description: "A formula measuring aligned length between two vectors.",
    explanation:
      "It can be computed from components or from magnitudes and the cosine of the angle.",
    representation:
      "Show two vectors with the angle between them and a projection shadow.",
  },
  {
    term: "Dual basis",
    category: "Linear Algebra",
    kind: "vector",
    description: "A basis of linear functionals paired with a vector basis.",
    explanation:
      "Each dual basis element picks out exactly one coordinate from the original basis.",
    representation: "Show basis arrows matched with coordinate-reading probes.",
  },
  {
    term: "Eccentric anomaly",
    category: "Trigonometry",
    kind: "angle",
    description: "An angle parameter used to describe position on an ellipse.",
    explanation:
      "It helps convert circular angle motion into elliptical orbit position.",
    representation: "Show an ellipse linked to a reference circle and angle.",
  },
  {
    term: "Empirical distribution",
    category: "Statistics",
    kind: "probability",
    description: "The distribution built directly from observed sample data.",
    explanation:
      "It places probability mass on the values that actually appeared in the sample.",
    representation:
      "Show observed dots turning into a step-like cumulative graph.",
  },
  {
    term: "Entropy",
    category: "Probability",
    kind: "probability",
    description: "A measure of uncertainty or information in a distribution.",
    explanation:
      "Higher entropy means outcomes are more spread out and less predictable.",
    representation:
      "Compare a concentrated probability bar chart with an even one.",
  },
  {
    term: "Equivalent system",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "A system of equations with the same solution set as another system.",
    explanation:
      "Row operations create equivalent systems while making equations easier to solve.",
    representation:
      "Show two equation systems connected by row-operation arrows to the same solution point.",
  },
  {
    term: "Error bound",
    category: "Calculus",
    kind: "number-line",
    description:
      "A limit on how far an approximation can be from the true value.",
    explanation:
      "It gives a guaranteed maximum possible error, not just a guess.",
    representation: "Show an estimate with a shaded error interval around it.",
  },
  {
    term: "Euclidean distance",
    category: "Geometry",
    kind: "coordinate",
    description: "Straight-line distance between two points.",
    explanation:
      "It is the ordinary ruler distance, computed from coordinate differences by Pythagoras.",
    representation:
      "Draw two points connected by a diagonal segment with dx and dy legs.",
  },
  {
    term: "Euler circuit",
    category: "Set Theory",
    kind: "set",
    description: "A closed path in a graph that uses every edge exactly once.",
    explanation:
      "It starts and ends at the same vertex without repeating edges.",
    representation:
      "Show a graph with all edges traced in one highlighted loop.",
  },
  {
    term: "Event independence",
    category: "Probability",
    kind: "probability",
    description:
      "A relation where knowing one event happened does not change the probability of another.",
    explanation: "For independent events, P(A and B) equals P(A) times P(B).",
    representation:
      "Show two event regions with a product rule label between them.",
  },
  {
    term: "Exact differential equation",
    category: "Calculus",
    kind: "graph",
    description:
      "A differential equation that comes from the total differential of a potential function.",
    explanation:
      "It can be solved by reconstructing the hidden potential function.",
    representation:
      "Show gradient arrows pointing back to level curves of one function.",
  },
  {
    term: "Inclusion-exclusion principle",
    category: "Set Theory",
    kind: "set",
    description: "A counting rule that corrects for overlap between sets.",
    explanation:
      "Add individual set sizes, subtract overlaps, and continue correcting shared regions.",
    representation:
      "Show overlapping circles with the overlap subtracted once.",
  },
  {
    term: "Exponential decay",
    category: "Algebra",
    kind: "graph",
    description:
      "A decrease where a quantity is repeatedly multiplied by a factor below 1.",
    explanation:
      "The amount drops quickly at first and then levels toward zero.",
    representation:
      "Draw a curve falling steeply and flattening near the x-axis.",
  },
  {
    term: "Factor graph",
    category: "Probability",
    kind: "set",
    description:
      "A graph showing how a large function factors into smaller local pieces.",
    explanation:
      "It is used to visualize dependencies in probability and optimization models.",
    representation: "Show variable nodes connected to square factor nodes.",
  },
  {
    term: "Fixed point",
    category: "Algebra",
    kind: "coordinate",
    description:
      "A point that stays unchanged after a function or transformation is applied.",
    explanation: "If f(x) = x, then x is a fixed point of the function.",
    representation: "Show an arrow from a point looping back to itself.",
  },
  {
    term: "Fractal dimension",
    category: "Geometry",
    kind: "solid",
    description:
      "A dimension measure for shapes with repeating detail across scales.",
    explanation:
      "It can be non-integer, capturing complexity between ordinary dimensions.",
    representation: "Show a self-similar shape repeated at smaller scales.",
  },
  {
    term: "Fundamental solution",
    category: "Calculus",
    kind: "graph",
    description:
      "A basic solution used to build solutions for differential equations.",
    explanation:
      "It acts like the response to a concentrated impulse or source.",
    representation: "Show a spike input producing a spreading response curve.",
  },
  {
    term: "Geometric distribution",
    category: "Probability",
    kind: "probability",
    description: "A distribution for the trial number of the first success.",
    explanation: "It models repeated independent trials until success occurs.",
    representation:
      "Show failure dots followed by one highlighted success dot.",
  },
  {
    term: "Graph traversal",
    category: "Set Theory",
    kind: "set",
    description: "A method for visiting nodes of a graph systematically.",
    explanation:
      "Depth-first and breadth-first traversal explore connected structures in different orders.",
    representation:
      "Show numbered nodes visited along highlighted graph edges.",
  },
  {
    term: "Greatest lower bound",
    category: "Algebra",
    kind: "number-line",
    description:
      "The largest value that is still below every element of a set.",
    explanation: "It is another name for the infimum.",
    representation:
      "Show a set of points with the tightest lower marker on a number line.",
  },
  {
    term: "Hessian determinant",
    category: "Calculus",
    kind: "matrix",
    description:
      "The determinant of the Hessian matrix used in multivariable tests.",
    explanation:
      "It helps classify critical points as peaks, valleys, or saddle points.",
    representation:
      "Show second partial derivatives in a 2 by 2 matrix with a determinant label.",
  },
  {
    term: "Hyperplane",
    category: "Geometry",
    kind: "coordinate",
    description:
      "A flat subspace one dimension lower than the surrounding space.",
    explanation:
      "A line is a hyperplane in 2D, and a plane is a hyperplane in 3D.",
    representation:
      "Show a flat slice dividing a coordinate space into two sides.",
  },
  {
    term: "Identity transformation",
    category: "Geometry",
    kind: "coordinate",
    description: "A transformation that leaves every point unchanged.",
    explanation:
      "It acts like doing nothing, so the image equals the original object.",
    representation: "Show a shape mapped directly onto itself.",
  },
  {
    term: "Improper subset",
    category: "Set Theory",
    kind: "set",
    description: "A subset that is equal to the original set.",
    explanation: "Every set is an improper subset of itself.",
    representation: "Show two identical circles exactly overlapping.",
  },
  {
    term: "Independent trials",
    category: "Probability",
    kind: "probability",
    description: "Repeated trials where one result does not affect another.",
    explanation:
      "Coin tosses are modeled as independent when each toss keeps the same probabilities.",
    representation:
      "Show separate trial boxes with no connecting influence arrows.",
  },
  {
    term: "Indeterminate form",
    category: "Calculus",
    kind: "fraction",
    description:
      "A limit expression whose form alone does not determine the answer.",
    explanation:
      "Forms like 0/0 or infinity/infinity need more analysis before the limit is known.",
    representation:
      "Show a fraction with both numerator and denominator approaching uncertain values.",
  },
  {
    term: "Infinite product",
    category: "Calculus",
    kind: "sequence",
    description: "A product with infinitely many factors.",
    explanation:
      "Like infinite series, infinite products may converge to a nonzero value or collapse.",
    representation:
      "Show factors multiplying one by one toward a limiting product.",
  },
  {
    term: "Interval notation",
    category: "Algebra",
    kind: "number-line",
    description: "A compact way to write sets of numbers between endpoints.",
    explanation:
      "Parentheses exclude endpoints and brackets include endpoints.",
    representation:
      "Show a number-line segment with open and closed endpoint symbols.",
  },
  {
    term: "Invertible function",
    category: "Algebra",
    kind: "graph",
    description: "A function that can be reversed by another function.",
    explanation:
      "Each output must come from exactly one input, so the inverse knows where to return.",
    representation:
      "Show arrows from inputs to outputs and matching reverse arrows.",
  },
  {
    term: "Joint distribution",
    category: "Probability",
    kind: "probability",
    description:
      "A distribution describing two or more random variables together.",
    explanation:
      "It stores probabilities for combinations of values, not just one variable alone.",
    representation: "Show a grid of probability cells for x and y outcomes.",
  },
  {
    term: "Kernel density estimate",
    category: "Statistics",
    kind: "graph",
    description: "A smooth estimate of a distribution from sample data.",
    explanation:
      "Each data point contributes a small bump, and the bumps combine into a density curve.",
    representation:
      "Show dots on an axis with small bell bumps adding into one smooth curve.",
  },
  {
    term: "Kronecker delta",
    category: "Linear Algebra",
    kind: "matrix",
    description: "A symbol equal to 1 when two indices match and 0 otherwise.",
    explanation: "It acts like the entries of an identity matrix.",
    representation: "Show a diagonal grid of ones with zeros elsewhere.",
  },
  {
    term: "Law of large numbers",
    category: "Probability",
    kind: "sequence",
    description: "A theorem saying sample averages stabilize with many trials.",
    explanation:
      "As trials increase, the observed average tends to move closer to the expected value.",
    representation:
      "Show a running average curve settling toward a horizontal expected-value line.",
  },
  {
    term: "Level curve",
    category: "Calculus",
    kind: "coordinate",
    description: "A curve where a multivariable function has a constant value.",
    explanation: "On a map, contour lines are level curves of height.",
    representation: "Show nested contour curves with equal-value labels.",
  },
  {
    term: "Linear approximation",
    category: "Calculus",
    kind: "graph",
    description: "A tangent-line estimate of a function near a point.",
    explanation:
      "Near the contact point, the tangent line gives a quick local approximation.",
    representation:
      "Draw a curve with a tangent line closely matching nearby values.",
  },
  {
    term: "Linear functional",
    category: "Linear Algebra",
    kind: "vector",
    description: "A linear rule that sends vectors to numbers.",
    explanation:
      "It measures vectors in a particular direction or coordinate-like way.",
    representation:
      "Show vectors passing through a measuring line to produce scalar values.",
  },
  {
    term: "Logarithmic differentiation",
    category: "Calculus",
    kind: "graph",
    description: "A differentiation method using logarithms first.",
    explanation:
      "It simplifies products, quotients, powers, and variable exponents before differentiating.",
    representation:
      "Show a complex expression entering a log box and becoming simpler terms.",
  },
  {
    term: "Lower sum",
    category: "Calculus",
    kind: "graph",
    description:
      "An area estimate using rectangle heights from minimum function values.",
    explanation:
      "It underestimates area for many positive curves on each partition interval.",
    representation:
      "Draw rectangles under a curve touching low points in each interval.",
  },
  {
    term: "Markov property",
    category: "Probability",
    kind: "probability",
    description: "The rule that the future depends only on the present state.",
    explanation:
      "Past history becomes irrelevant once the current state is known.",
    representation:
      "Show a chain of states where only the current node points to the next.",
  },
  {
    term: "Matrix factorization",
    category: "Linear Algebra",
    kind: "matrix",
    description: "Writing a matrix as a product of simpler matrices.",
    explanation:
      "Factorizations reveal structure and make solving, compression, or computation easier.",
    representation:
      "Show one matrix splitting into two or three matrix blocks multiplied together.",
  },
  {
    term: "Median absolute deviation",
    category: "Statistics",
    kind: "probability",
    description: "A robust spread measure based on distances from the median.",
    explanation:
      "It resists outliers better than standard deviation in skewed data.",
    representation:
      "Show data dots with distances to a median line highlighted.",
  },
  {
    term: "Mixed partial derivative",
    category: "Calculus",
    kind: "solid",
    description:
      "A derivative taken with respect to more than one variable in sequence.",
    explanation: "For example, differentiate first by x and then by y.",
    representation:
      "Show a surface with two directional derivative arrows crossing.",
  },
  {
    term: "Monotone function",
    category: "Calculus",
    kind: "graph",
    description: "A function that only increases or only decreases.",
    explanation:
      "It never reverses direction over the interval being considered.",
    representation: "Draw a curve moving consistently upward or downward.",
  },
  {
    term: "Multiplicity of root",
    category: "Algebra",
    kind: "graph",
    description:
      "How many times a root is repeated in a polynomial factorization.",
    explanation:
      "Even multiplicity often touches the x-axis; odd multiplicity often crosses it.",
    representation:
      "Show roots on a graph with touch and cross behavior labeled.",
  },
  {
    term: "Negative binomial distribution",
    category: "Probability",
    kind: "probability",
    description:
      "A distribution for trials needed to reach a fixed number of successes.",
    explanation:
      "It generalizes the geometric distribution from first success to r successes.",
    representation:
      "Show a sequence of failures and successes ending at the target success count.",
  },
  {
    term: "Neighborhood",
    category: "Set Theory",
    kind: "coordinate",
    description: "A region around a point.",
    explanation:
      "Neighborhoods help describe closeness, continuity, and limit behavior.",
    representation: "Draw a point with a small circle around it.",
  },
  {
    term: "Nonlinear system",
    category: "Algebra",
    kind: "graph",
    description:
      "A system of equations where at least one equation is nonlinear.",
    explanation:
      "Solutions are intersections of curves rather than only straight lines.",
    representation: "Show a line and a curve crossing at one or more points.",
  },
  {
    term: "Normed vector space",
    category: "Linear Algebra",
    kind: "vector",
    description: "A vector space with a rule for measuring vector length.",
    explanation:
      "The norm allows distance, convergence, and size to be discussed for vectors.",
    representation:
      "Show several arrows with length labels from a common origin.",
  },
  {
    term: "Orthogonal complement",
    category: "Linear Algebra",
    kind: "vector",
    description: "All vectors perpendicular to every vector in a subspace.",
    explanation:
      "It captures the directions completely independent of the original subspace.",
    representation:
      "Show a line subspace with perpendicular arrows forming the complement direction.",
  },
  {
    term: "Upper sum",
    category: "Calculus",
    kind: "graph",
    description:
      "An area estimate using rectangle heights from maximum function values.",
    explanation:
      "It overestimates area for many positive curves on each partition interval.",
    representation:
      "Draw rectangles above a curve touching high points in each interval.",
  },
  {
    term: "Euclidean algorithm",
    category: "Number Theory",
    kind: "number-line",
    description:
      "A repeated-division method for finding the greatest common divisor of two integers.",
    explanation:
      "Replace the larger number by its remainder on division by the smaller one until the remainder is zero; the last nonzero remainder is the gcd.",
    representation:
      "Show successive division steps shrinking toward the final remainder.",
    example:
      "gcd(48, 18): 48 = 2(18) + 12, 18 = 1(12) + 6, 12 = 2(6) + 0, so gcd = 6.",
    extra: "gcd hcf division algorithm",
  },
  {
    term: "Fundamental theorem of arithmetic",
    category: "Number Theory",
    kind: "number-line",
    description:
      "Every integer greater than 1 factors into primes in exactly one way.",
    explanation:
      "The order of the prime factors can change, but the collection of primes is unique, which makes prime factorization a fingerprint for a number.",
    representation:
      "Draw a factor tree breaking a number down into prime leaves.",
    example: "360 = 2^3 x 3^2 x 5, and no other prime factorization exists.",
    extra: "prime factorization unique factorisation factor tree",
  },
  {
    term: "Euler totient function",
    category: "Number Theory",
    kind: "set",
    description:
      "A count of how many integers below n share no common factor with n.",
    explanation:
      "Written phi(n), it counts the numbers coprime to n and appears in modular arithmetic and RSA encryption.",
    representation:
      "Show the numbers 1 to n with the coprime ones highlighted as a set.",
    example: "phi(12) = 4 because only 1, 5, 7, and 11 are coprime to 12.",
    extra: "phi coprime totient rsa",
  },
  {
    term: "Chinese remainder theorem",
    category: "Number Theory",
    kind: "number-line",
    description:
      "A rule that solves several remainder conditions with coprime moduli at once.",
    explanation:
      "If the moduli are pairwise coprime, there is exactly one solution modulo their product.",
    representation:
      "Show overlapping repeating step patterns meeting at one shared position.",
    example: "x = 2 (mod 3) and x = 3 (mod 5) together give x = 8 (mod 15).",
    extra: "crt simultaneous congruence modulus",
  },
  {
    term: "Bezout identity",
    category: "Number Theory",
    kind: "number-line",
    description:
      "Every gcd of two integers can be written as an integer combination of them.",
    explanation:
      "There are integers x and y with ax + by = gcd(a, b), found by reversing the steps of the Euclidean algorithm.",
    representation:
      "Show two step sizes combining forward and backward to land on the gcd.",
    example: "For 48 and 18: 48(-1) + 18(3) = 6 = gcd(48, 18).",
    extra: "bezout coefficients extended euclidean",
  },
  {
    term: "Diophantine equation",
    category: "Number Theory",
    kind: "coordinate",
    description: "An equation whose solutions are restricted to integers.",
    explanation:
      "Only lattice points count, so a line or curve may pass through infinitely many, finitely many, or no valid solutions.",
    representation:
      "Draw a line on a grid with the integer lattice points on it circled.",
    example:
      "3x + 6y = 9 has integer solutions such as (3, 0) and (1, 1), while 2x + 4y = 5 has none.",
    extra: "integer solutions lattice linear diophantine",
  },
  {
    term: "Perfect number",
    category: "Number Theory",
    kind: "number-line",
    description: "A number equal to the sum of its proper divisors.",
    explanation:
      "Perfect numbers are rare; 6, 28, 496, and 8128 are the first four.",
    representation:
      "Show divisor blocks stacking up to exactly the original number.",
    example: "6 is perfect because 1 + 2 + 3 = 6.",
    extra: "divisor sum abundant deficient",
  },
  {
    term: "Twin primes",
    category: "Number Theory",
    kind: "number-line",
    description: "A pair of primes that differ by two.",
    explanation:
      "They are the closest primes can be after 2 and 3, and it is still unknown whether infinitely many pairs exist.",
    representation:
      "Mark prime positions on a number line and join the pairs two units apart.",
    example: "(11, 13) and (17, 19) are twin prime pairs.",
    extra: "prime pair gap conjecture",
  },
  {
    term: "Sieve of Eratosthenes",
    category: "Number Theory",
    kind: "number-line",
    description: "A crossing-out method that lists all primes up to a limit.",
    explanation:
      "Starting at 2, remove every multiple of each surviving number; whatever is left is prime.",
    representation:
      "Show a number grid with multiples crossed out and primes left standing.",
    example: "Sieving 1 to 20 leaves 2, 3, 5, 7, 11, 13, 17, and 19.",
    extra: "prime sieve multiples crossing out",
  },
  {
    term: "Pythagorean triple",
    category: "Number Theory",
    kind: "triangle",
    description: "Three whole numbers that fit the Pythagorean theorem.",
    explanation:
      "They give right triangles with every side an integer, and any multiple of a triple is also a triple.",
    representation:
      "Draw a right triangle with integer side labels and squares on each side.",
    example: "3, 4, 5 works because 9 + 16 = 25, and so does 6, 8, 10.",
    extra: "right triangle integer sides 3 4 5",
  },
  {
    term: "Continued fraction",
    category: "Number Theory",
    kind: "fraction",
    description:
      "A number written as a nested chain of fractions with integer parts.",
    explanation:
      "Cutting the chain early gives the best rational approximation available for that size of denominator.",
    representation:
      "Show a stacked fraction nesting inside its own denominator.",
    example: "415/93 = 4 + 1/(2 + 1/(6 + 1/7)).",
    extra: "convergent approximation nested fraction",
  },
  {
    term: "Order of operations",
    category: "Arithmetic",
    kind: "text",
    description: "The agreed sequence for evaluating a mixed expression.",
    explanation:
      "Brackets first, then powers and roots, then multiplication and division left to right, and finally addition and subtraction.",
    representation:
      "Show the expression evaluated one layer at a time with each step circled.",
    example: "2 + 3 x 4^2 = 2 + 3 x 16 = 2 + 48 = 50.",
    extra: "bodmas bidmas pemdas bracket precedence",
  },
  {
    term: "Scientific notation",
    category: "Arithmetic",
    kind: "text",
    description: "A way of writing numbers as a digit times a power of ten.",
    explanation:
      "The form a x 10^n with 1 <= |a| < 10 keeps very large and very small numbers readable and easy to compare.",
    representation:
      "Show the decimal point sliding while the exponent counts the shift.",
    example: "0.00042 = 4.2 x 10^-4 and 93,000,000 = 9.3 x 10^7.",
    extra: "standard form powers of ten exponent",
  },
  {
    term: "Significant figures",
    category: "Arithmetic",
    kind: "number-line",
    description: "The digits in a measurement that carry real precision.",
    explanation:
      "Leading zeros do not count, and a calculated answer should not claim more significant figures than the data it came from.",
    representation:
      "Show a measured value on a scale with the reliable digits boxed.",
    example: "0.004560 has four significant figures: 4, 5, 6, and the final 0.",
    extra: "precision accuracy digits rounding",
  },
  {
    term: "Rounding",
    category: "Arithmetic",
    kind: "number-line",
    description:
      "Replacing a number by a nearby simpler value at a chosen place.",
    explanation:
      "Look at the digit just after the rounding place: 5 or more rounds up, less than 5 rounds down.",
    representation:
      "Show the number between two tick marks with the nearer one highlighted.",
    example:
      "3.473 rounds to 3.5 to one decimal place and to 3 to the nearest whole number.",
    extra: "round off nearest estimate decimal place",
  },
  {
    term: "Percentage change",
    category: "Arithmetic",
    kind: "fraction",
    description:
      "The change in a quantity expressed as a percent of its original value.",
    explanation:
      "Divide the increase or decrease by the starting amount, never the final amount, then multiply by 100.",
    representation:
      "Show two bars with the difference between them compared against the first bar.",
    example:
      "A price rising from 80 to 100 is a change of 20/80 = 25% increase.",
    extra: "increase decrease percent growth",
  },
  {
    term: "Reciprocal",
    category: "Arithmetic",
    kind: "fraction",
    description: "The number that multiplies with a given number to make 1.",
    explanation:
      "Flip a fraction to get its reciprocal; dividing by a number is the same as multiplying by its reciprocal, and zero has none.",
    representation: "Show a fraction flipped upside down beside its original.",
    example: "The reciprocal of 3/4 is 4/3, and 3/4 x 4/3 = 1.",
    extra: "multiplicative inverse flip one over",
  },
  {
    term: "Completing the square",
    category: "Algebra",
    kind: "graph",
    description: "Rewriting a quadratic as a perfect square plus a constant.",
    explanation:
      "It exposes the vertex directly and is the derivation behind the quadratic formula.",
    representation:
      "Show an area square being completed with a small missing corner block.",
    example: "x^2 + 6x + 5 = (x + 3)^2 - 4, so the vertex is (-3, -4).",
    extra: "vertex form quadratic perfect square",
  },
  {
    term: "Difference of squares",
    category: "Algebra",
    kind: "text",
    description: "A factoring pattern for one square subtracted from another.",
    explanation:
      "a^2 - b^2 always factors as (a - b)(a + b), which makes many products and simplifications instant.",
    representation:
      "Show a large square with a smaller square removed and rearranged into a rectangle.",
    example: "x^2 - 49 = (x - 7)(x + 7), and 51 x 49 = 50^2 - 1 = 2499.",
    extra: "factoring identity a2 minus b2",
  },
  {
    term: "Polynomial long division",
    category: "Algebra",
    kind: "text",
    description:
      "Dividing one polynomial by another using the long-division layout.",
    explanation:
      "It produces a quotient and a remainder of lower degree than the divisor, just like integer division.",
    representation:
      "Show the division bracket with each subtraction step aligned by degree.",
    example: "(x^2 + 5x + 6) / (x + 2) = x + 3 with remainder 0.",
    extra: "divide quotient remainder synthetic division",
  },
  {
    term: "Remainder theorem",
    category: "Algebra",
    kind: "graph",
    description: "Dividing a polynomial by x - a leaves the remainder p(a).",
    explanation:
      "It turns a division question into a single substitution, and a zero remainder means x - a is a factor.",
    representation:
      "Show a curve with the value at x = a marked as the leftover amount.",
    example: "For p(x) = x^3 - 2x + 1, dividing by x - 2 leaves p(2) = 5.",
    extra: "factor theorem substitution divide",
  },
  {
    term: "Rationalizing the denominator",
    category: "Algebra",
    kind: "fraction",
    description: "Rewriting a fraction so no root remains on the bottom.",
    explanation:
      "Multiply top and bottom by a matching factor or conjugate; the value stays the same while the form becomes easier to compare.",
    representation:
      "Show the fraction multiplied by a shaded factor equal to one.",
    example: "1/sqrt(2) = sqrt(2)/2 and 1/(sqrt(3) - 1) = (sqrt(3) + 1)/2.",
    extra: "surd conjugate radical denominator",
  },
  {
    term: "Absolute value equation",
    category: "Algebra",
    kind: "number-line",
    description: "An equation containing a distance-from-zero expression.",
    explanation:
      "Because distance ignores sign, |x| = k with k > 0 splits into two cases, and there is no solution when k < 0.",
    representation:
      "Show two points equally far from a center on a number line.",
    example: "|x - 3| = 5 gives x = 8 or x = -2.",
    extra: "modulus distance two cases",
  },
  {
    term: "System of inequalities",
    category: "Algebra",
    kind: "coordinate",
    description: "Several inequalities that must hold at the same time.",
    explanation:
      "Each inequality shades a half-plane, and the solution is the overlap, which becomes the feasible region in linear programming.",
    representation:
      "Draw shaded half-planes on a grid with the overlap region darkest.",
    example: "y >= x and y <= 4 - x overlap in a wedge with corner at (2, 2).",
    extra: "feasible region shading half plane",
  },
  {
    term: "Roots of unity",
    category: "Algebra",
    kind: "coordinate",
    description: "The complex solutions of z^n = 1.",
    explanation:
      "They sit evenly spaced on the unit circle, 360/n degrees apart, and for n > 1 they always sum to zero.",
    representation:
      "Show n points evenly spaced around the unit circle in the complex plane.",
    example:
      "The cube roots of unity are 1, -1/2 + (sqrt(3)/2)i, and -1/2 - (sqrt(3)/2)i.",
    extra: "complex unit circle de moivre",
  },
  {
    term: "Modulus of a complex number",
    category: "Algebra",
    kind: "coordinate",
    description: "The distance of a complex number from the origin.",
    explanation:
      "For z = a + bi the modulus |z| = sqrt(a^2 + b^2), which is the length of the arrow in the Argand plane.",
    representation:
      "Show an arrow from the origin to a + bi with its length labelled.",
    example: "|3 + 4i| = sqrt(9 + 16) = 5.",
    extra: "absolute value argand magnitude",
  },
  {
    term: "Argument of a complex number",
    category: "Algebra",
    kind: "coordinate",
    description:
      "The angle a complex number makes with the positive real axis.",
    explanation:
      "Together with the modulus it gives polar form, and arguments add when complex numbers are multiplied.",
    representation:
      "Show an arrow to a + bi with the angle from the real axis arced.",
    example:
      "arg(1 + i) = 45 degrees, so 1 + i = sqrt(2)(cos 45 degrees + i sin 45 degrees).",
    extra: "polar form angle theta argand",
  },
  {
    term: "Group",
    category: "Algebra",
    kind: "set",
    description:
      "A set with one operation that is closed, associative, has an identity, and has inverses.",
    explanation:
      "Groups capture symmetry and reversible moves, from integer addition to the rotations of a square.",
    representation:
      "Show a set of elements with its operation table beside it.",
    example:
      "The integers under addition form a group with identity 0 and inverse -n.",
    extra: "abstract algebra symmetry axioms",
  },
  {
    term: "Ring",
    category: "Algebra",
    kind: "set",
    description:
      "A set with addition and multiplication that behave like the integers.",
    explanation:
      "Addition forms a group and multiplication distributes over it, but division by every nonzero element need not exist.",
    representation: "Show one set carrying two operation tables side by side.",
    example:
      "The integers form a ring, and so do polynomials with real coefficients.",
    extra: "abstract algebra field integers",
  },
  {
    term: "Subgroup",
    category: "Algebra",
    kind: "set",
    description:
      "A subset of a group that is itself a group under the same operation.",
    explanation:
      "It must contain the identity and stay closed under the operation and under inverses.",
    representation:
      "Show a smaller closed circle drawn inside a larger group circle.",
    example:
      "The even integers form a subgroup of the integers under addition.",
    extra: "closure identity coset lagrange",
  },
  {
    term: "Isomorphism",
    category: "Algebra",
    kind: "set",
    description:
      "A structure-preserving one-to-one correspondence between two objects.",
    explanation:
      "If an isomorphism exists, the two objects are mathematically the same apart from the names of their elements.",
    representation: "Show two labelled structures joined by matching arrows.",
    example:
      "The map x -> 2^x is an isomorphism from the reals under addition to the positive reals under multiplication.",
    extra: "bijective structure preserving equivalent",
  },
  {
    term: "Homomorphism",
    category: "Algebra",
    kind: "set",
    description: "A map between structures that respects their operations.",
    explanation:
      "It satisfies f(a * b) = f(a) * f(b) but may collapse different elements together, unlike an isomorphism.",
    representation:
      "Show arrows from one operation table into another, with some arrows merging.",
    example:
      "The map f(n) = n mod 3 is a homomorphism from the integers onto {0, 1, 2}.",
    extra: "kernel image structure map",
  },
  {
    term: "Fundamental theorem of calculus",
    category: "Calculus",
    kind: "graph",
    description:
      "The theorem tying differentiation and integration together as inverse processes.",
    explanation:
      "The derivative of an accumulated area is the original function, and a definite integral equals the change in any antiderivative.",
    representation:
      "Show an area under a curve with its total changing as the right edge moves.",
    example:
      "The integral of 2x from 1 to 3 equals [x^2] from 1 to 3 = 9 - 1 = 8.",
    extra: "antiderivative area evaluation theorem",
  },
  {
    term: "Quotient rule",
    category: "Calculus",
    kind: "graph",
    description:
      "The rule for differentiating one function divided by another.",
    explanation:
      "(u/v)' = (u'v - uv')/v^2, and the order of the numerator terms matters.",
    representation:
      "Show a ratio curve with the numerator and denominator rates labelled.",
    example: "d/dx (x^2 / (x + 1)) = (2x(x + 1) - x^2)/(x + 1)^2.",
    extra: "derivative fraction differentiate ratio",
  },
  {
    term: "Integration by parts",
    category: "Calculus",
    kind: "graph",
    description: "An integration rule built by reversing the product rule.",
    explanation:
      "The integral of u dv equals uv minus the integral of v du, which helps when one factor gets simpler after differentiating.",
    representation:
      "Show two shaded regions whose areas combine into a rectangle.",
    example: "The integral of x e^x dx equals x e^x - e^x + C.",
    extra: "product rule reverse udv",
  },
  {
    term: "Trigonometric substitution",
    category: "Calculus",
    kind: "graph",
    description:
      "Replacing a variable by a trigonometric expression to simplify a root.",
    explanation:
      "Substitutions such as x = a sin(theta) turn sqrt(a^2 - x^2) into a cosine, removing the square root.",
    representation:
      "Show a right triangle linking x, a, and the substituted angle.",
    example:
      "For the integral of dx/sqrt(1 - x^2), setting x = sin(theta) gives arcsin(x) + C.",
    extra: "substitution root integral sine",
  },
  {
    term: "L'Hopital rule",
    category: "Calculus",
    kind: "graph",
    description:
      "A limit rule that differentiates the top and bottom of an indeterminate ratio.",
    explanation:
      "When a limit gives 0/0 or infinity/infinity, the limit of f'/g' gives the same answer whenever it exists.",
    representation:
      "Show two curves approaching the same point with their slopes compared.",
    example: "lim x->0 sin(x)/x = lim x->0 cos(x)/1 = 1.",
    extra: "indeterminate form limit ratio derivative",
  },
  {
    term: "Inflection point",
    category: "Calculus",
    kind: "graph",
    description: "A point where a curve changes its direction of bending.",
    explanation:
      "Concavity flips from up to down or back, so the second derivative changes sign there.",
    representation:
      "Show a curve with the bend switching sides at a marked point.",
    example:
      "For y = x^3 the inflection point is (0, 0) because y'' = 6x changes sign at 0.",
    extra: "concavity second derivative bend",
  },
  {
    term: "Extreme value theorem",
    category: "Calculus",
    kind: "graph",
    description:
      "A continuous function on a closed interval attains a highest and a lowest value.",
    explanation:
      "The guarantee fails if the interval is open or the function has a break, which is why endpoints are always checked.",
    representation:
      "Show a continuous curve over a closed interval with its top and bottom points marked.",
    example:
      "On [0, 3], f(x) = x^2 - 2x has minimum -1 at x = 1 and maximum 3 at x = 3.",
    extra: "maximum minimum closed interval continuous",
  },
  {
    term: "Intermediate value theorem",
    category: "Calculus",
    kind: "graph",
    description:
      "A continuous function takes every value between two of its outputs.",
    explanation:
      "If f changes sign across an interval there must be a root inside, which justifies bisection searches.",
    representation:
      "Show a continuous curve crossing a horizontal target line.",
    example:
      "For f(x) = x^3 - x - 1, f(1) = -1 and f(2) = 5, so a root lies between 1 and 2.",
    extra: "root existence continuity bisection",
  },
  {
    term: "Rolle theorem",
    category: "Calculus",
    kind: "graph",
    description:
      "A differentiable curve with equal endpoint values has a flat point between them.",
    explanation:
      "It is the special case of the mean value theorem where the connecting line is horizontal.",
    representation:
      "Show a curve returning to the same height with a horizontal tangent marked.",
    example: "For f(x) = x^2 - 4x on [0, 4], f(0) = f(4) = 0 and f'(2) = 0.",
    extra: "mean value horizontal tangent stationary",
  },
  {
    term: "Related rates",
    category: "Calculus",
    kind: "graph",
    description:
      "Linking the rates of change of quantities tied together by an equation.",
    explanation:
      "Differentiate the relationship with respect to time, then substitute the known rate to find the unknown one.",
    representation:
      "Show a changing figure with arrows labelling each changing measurement.",
    example:
      "If a circle radius grows at 2 cm/s, then dA/dt = 2 pi r (2) = 40 pi cm^2/s when r = 10 cm.",
    extra: "chain rule time derivative word problem",
  },
  {
    term: "Radius of convergence",
    category: "Calculus",
    kind: "sequence",
    description:
      "The distance from the center within which a power series converges.",
    explanation:
      "Inside the radius the series adds to a finite value, outside it diverges, and the endpoints must be tested separately.",
    representation:
      "Show an interval centered on a point with converging terms inside it.",
    example:
      "The series sum of x^n has radius of convergence 1, converging for |x| < 1.",
    extra: "power series interval ratio test",
  },
  {
    term: "Ratio test",
    category: "Calculus",
    kind: "sequence",
    description:
      "A convergence test comparing each term with the one before it.",
    explanation:
      "If the limit of |a_(n+1)/a_n| is below 1 the series converges absolutely, above 1 it diverges, and exactly 1 is inconclusive.",
    representation: "Show successive terms shrinking by a steady factor.",
    example:
      "For the sum of 1/n!, the ratio 1/(n + 1) tends to 0, so the series converges.",
    extra: "series convergence limit test",
  },
  {
    term: "Solid of revolution",
    category: "Calculus",
    kind: "solid",
    description:
      "A three-dimensional shape formed by spinning a region about an axis.",
    explanation:
      "Slices perpendicular to the axis are circles or washers whose areas integrate into the volume.",
    representation: "Show a flat region sweeping a full turn around a line.",
    example:
      "Revolving y = x from x = 0 to 1 about the x-axis gives a cone of volume pi/3.",
    extra: "revolution volume rotate axis",
  },
  {
    term: "Disk method",
    category: "Calculus",
    kind: "solid",
    description: "A volume formula that stacks circular slices along an axis.",
    explanation:
      "Each slice has area pi [f(x)]^2, so the volume is the integral of pi [f(x)]^2 dx.",
    representation:
      "Show thin circular slices stacked along the axis of rotation.",
    example:
      "Revolving y = sqrt(x) on [0, 4] about the x-axis gives volume 8 pi.",
    extra: "washer volume slice revolution",
  },
  {
    term: "Slope field",
    category: "Calculus",
    kind: "coordinate",
    description:
      "A grid of short segments showing the slopes a differential equation predicts.",
    explanation:
      "Following the segments traces solution curves without solving the equation algebraically.",
    representation:
      "Show a grid of small tilted dashes with one curve threading through them.",
    example:
      "For dy/dx = x the segments are flat along the y-axis and steepen as x grows.",
    extra: "direction field differential equation solution curve",
  },
  {
    term: "Euler method",
    category: "Calculus",
    kind: "coordinate",
    description:
      "A step-by-step numerical way to approximate a differential equation solution.",
    explanation:
      "Each step follows the current slope a short distance: y_(n+1) = y_n + h f(x_n, y_n), and smaller h reduces the error.",
    representation:
      "Show a chain of short straight steps tracking a smooth curve.",
    example:
      "For dy/dx = y with y(0) = 1 and h = 0.5, the first step gives y(0.5) about 1.5.",
    extra: "numerical step size approximation ode",
  },
  {
    term: "Separable differential equation",
    category: "Calculus",
    kind: "graph",
    description:
      "An equation that can be split so each variable sits with its own differential.",
    explanation:
      "Write it as g(y) dy = f(x) dx, integrate both sides, then use the initial condition to fix the constant.",
    representation:
      "Show the equation split into two integrals on opposite sides.",
    example: "dy/dx = xy gives dy/y = x dx, so ln|y| = x^2/2 + C.",
    extra: "ode integrate both sides variables separable",
  },
  {
    term: "Partial differential equation",
    category: "Calculus",
    kind: "graph",
    description:
      "An equation relating a multivariable function to its partial derivatives.",
    explanation:
      "Solutions describe fields changing across space and time, such as heat spreading or waves travelling.",
    representation:
      "Show a surface with slope arrows in two independent directions.",
    example:
      "The heat equation u_t = k u_xx models temperature spreading along a rod.",
    extra: "pde heat wave laplace multivariable",
  },
  {
    term: "Line integral",
    category: "Calculus",
    kind: "vector",
    description:
      "An integral taken along a curve rather than a straight interval.",
    explanation:
      "It accumulates a value along a path, giving quantities such as the work done by a force.",
    representation:
      "Show a curve through a field with arrows sampled along it.",
    example:
      "The work done by F = <1, 0> along the path from (0, 0) to (3, 0) is 3.",
    extra: "work path curve vector field",
  },
  {
    term: "Divergence theorem",
    category: "Calculus",
    kind: "vector",
    description:
      "A theorem equating outward flux through a closed surface with divergence inside.",
    explanation:
      "It converts a surface integral into a volume integral, so local spreading explains total outflow.",
    representation:
      "Show a closed surface with arrows leaving it and sources marked inside.",
    example:
      "For F = <x, y, z>, div F = 3, so the flux out of a unit ball is 4 pi.",
    extra: "gauss flux surface volume integral",
  },
  {
    term: "Stokes theorem",
    category: "Calculus",
    kind: "vector",
    description:
      "A theorem equating circulation around a boundary with curl across the surface.",
    explanation:
      "It generalizes Green's theorem from flat regions to curved surfaces in three dimensions.",
    representation:
      "Show a surface with a looping boundary arrow and spin arrows inside.",
    example:
      "If curl F = <0, 0, 2>, the circulation around a unit circle equals 2 pi.",
    extra: "curl circulation boundary surface",
  },
  {
    term: "Vector field",
    category: "Calculus",
    kind: "vector",
    description: "An assignment of a vector to every point of a region.",
    explanation:
      "Wind maps, fluid flow, and force fields are vector fields, and divergence and curl describe their spreading and spinning.",
    representation:
      "Show a grid of arrows whose lengths and directions vary by position.",
    example:
      "F(x, y) = <-y, x> gives arrows that circle counterclockwise around the origin.",
    extra: "field arrows flow divergence curl",
  },
  {
    term: "Hyperbolic function",
    category: "Calculus",
    kind: "graph",
    description:
      "A function built from exponential combinations that mirrors trigonometric structure.",
    explanation:
      "cosh(x) = (e^x + e^-x)/2 and sinh(x) = (e^x - e^-x)/2, and they satisfy cosh^2 - sinh^2 = 1.",
    representation:
      "Show two exponential curves averaging into a hanging-chain shape.",
    example:
      "cosh(0) = 1 and sinh(0) = 0, and a hanging cable follows y = cosh(x).",
    extra: "sinh cosh tanh catenary exponential",
  },
  {
    term: "Fourier series",
    category: "Calculus",
    kind: "graph",
    description:
      "A representation of a periodic function as a sum of sines and cosines.",
    explanation:
      "Each term adds one harmonic, so partial sums approximate the wave more closely as more terms are included.",
    representation:
      "Show a square wave with sine harmonics adding toward its shape.",
    example: "A square wave equals (4/pi)(sin x + sin 3x/3 + sin 5x/5 + ...).",
    extra: "harmonic periodic sine cosine expansion",
  },
  {
    term: "Parallelogram",
    category: "Geometry",
    kind: "solid",
    description: "A quadrilateral with both pairs of opposite sides parallel.",
    explanation:
      "Opposite sides and angles are equal, the diagonals bisect each other, and area is base times perpendicular height.",
    representation:
      "Show a slanted four-sided figure with matching arrows on parallel sides.",
    example: "A parallelogram with base 8 cm and height 5 cm has area 40 cm^2.",
    extra: "quadrilateral rhombus opposite sides area",
  },
  {
    term: "Regular polygon",
    category: "Geometry",
    kind: "solid",
    description: "A polygon with all sides and all angles equal.",
    explanation:
      "Its interior angles each measure (n - 2)180/n degrees and its exterior angles each measure 360/n degrees.",
    representation:
      "Show equal side ticks and equal angle arcs around one figure.",
    example:
      "A regular hexagon has interior angles of 120 degrees and exterior angles of 60 degrees.",
    extra: "equilateral equiangular hexagon pentagon octagon",
  },
  {
    term: "Polyhedron",
    category: "Geometry",
    kind: "solid",
    description: "A solid bounded entirely by flat polygon faces.",
    explanation:
      "For a convex polyhedron the counts satisfy Euler's relation V - E + F = 2.",
    representation: "Show a solid with its faces, edges, and corners labelled.",
    example:
      "A cube has 8 vertices, 12 edges, and 6 faces, and 8 - 12 + 6 = 2.",
    extra: "faces edges vertices solid euler",
  },
  {
    term: "Platonic solid",
    category: "Geometry",
    kind: "solid",
    description: "One of the five convex solids with identical regular faces.",
    explanation:
      "Only the tetrahedron, cube, octahedron, dodecahedron, and icosahedron are possible.",
    representation: "Show the five regular solids arranged side by side.",
    example:
      "The octahedron has 8 equilateral triangular faces meeting four to a vertex.",
    extra: "regular solid tetrahedron icosahedron dodecahedron",
  },
  {
    term: "Torus",
    category: "Geometry",
    kind: "solid",
    description:
      "A doughnut-shaped surface made by revolving a circle about an outside line.",
    explanation:
      "With path radius R and tube radius r, the volume is 2 pi^2 R r^2 and the surface area is 4 pi^2 R r.",
    representation:
      "Show a small circle sweeping a full turn around a distant axis.",
    example: "A torus with R = 3 and r = 1 has volume 6 pi^2.",
    extra: "doughnut ring revolution genus",
  },
  {
    term: "Hemisphere",
    category: "Geometry",
    kind: "solid",
    description: "Half of a sphere cut by a plane through its centre.",
    explanation:
      "Its curved surface is 2 pi r^2, its total surface with the flat disc is 3 pi r^2, and its volume is (2/3) pi r^3.",
    representation:
      "Show a sphere sliced through the centre with one half shaded.",
    example: "A hemisphere of radius 3 cm has volume 18 pi cm^3.",
    extra: "half sphere dome curved surface",
  },
  {
    term: "Slant height",
    category: "Geometry",
    kind: "solid",
    description:
      "The distance measured along the sloping surface of a cone or pyramid.",
    explanation:
      "For a right cone it satisfies l^2 = r^2 + h^2, and the curved surface area is pi r l.",
    representation:
      "Show a cone with the sloping edge marked separately from the vertical height.",
    example:
      "A cone with r = 3 and h = 4 has slant height 5 and curved surface 15 pi.",
    extra: "cone pyramid lateral surface",
  },
  {
    term: "Heron formula",
    category: "Geometry",
    kind: "triangle",
    description:
      "A formula for the area of a triangle from its three side lengths alone.",
    explanation:
      "With s = (a + b + c)/2, the area is sqrt(s(s - a)(s - b)(s - c)), so no height is needed.",
    representation:
      "Show a triangle labelled only with side lengths and its shaded area.",
    example:
      "For sides 13, 14, 15, s = 21 and the area is sqrt(21 x 8 x 7 x 6) = 84.",
    extra: "semi perimeter area three sides",
  },
  {
    term: "Triangle angle sum",
    category: "Geometry",
    kind: "triangle",
    description: "The interior angles of any triangle add to 180 degrees.",
    explanation:
      "It follows from a parallel line drawn through one vertex, and it forces each exterior angle to equal the two remote interior angles.",
    representation:
      "Show the three corners torn off and laid together on a straight line.",
    example:
      "If two angles measure 50 and 60 degrees, the third must be 70 degrees.",
    extra: "interior angles 180 degrees exterior",
  },
  {
    term: "Thales theorem",
    category: "Geometry",
    kind: "circle",
    description: "An angle inscribed in a semicircle is a right angle.",
    explanation:
      "Any point on the circle sees the diameter at exactly 90 degrees, the inscribed angle theorem applied to a half-circle arc.",
    representation:
      "Show a diameter with a triangle drawn out to a point on the circle.",
    example:
      "If AB is a diameter and C lies on the circle, then angle ACB = 90 degrees.",
    extra: "semicircle right angle inscribed diameter",
  },
  {
    term: "Circumcircle",
    category: "Geometry",
    kind: "circle",
    description: "The circle passing through every vertex of a polygon.",
    explanation:
      "For a triangle its centre is the circumcenter where the perpendicular bisectors meet, and its radius is abc/(4 x area).",
    representation:
      "Show a triangle with a circle touching all three of its corners.",
    example:
      "A right triangle with hypotenuse 10 has a circumcircle of radius 5 centred at the hypotenuse midpoint.",
    extra: "circumscribed circle circumradius triangle",
  },
  {
    term: "Rotational symmetry",
    category: "Geometry",
    kind: "solid",
    description:
      "A figure looking unchanged after a turn of less than a full circle.",
    explanation:
      "The order of symmetry counts how many positions within one full turn look identical.",
    representation:
      "Show a figure turning about its centre with the matching positions marked.",
    example:
      "A regular pentagon has rotational symmetry of order 5, matching every 72 degrees.",
    extra: "order of symmetry turn centre invariant",
  },
  {
    term: "Pythagorean identity",
    category: "Trigonometry",
    kind: "triangle",
    description: "The identity sin^2 + cos^2 = 1 holding for every angle.",
    explanation:
      "It comes from the unit circle, where a point has coordinates (cos theta, sin theta), and it generates the tangent and secant versions.",
    representation:
      "Show a unit circle right triangle with legs cos theta and sin theta.",
    example:
      "If sin theta = 3/5, then cos theta = 4/5 or -4/5 because 9/25 + 16/25 = 1.",
    extra: "unit circle identity sec tan sin cos",
  },
  {
    term: "Sum and difference identity",
    category: "Trigonometry",
    kind: "angle",
    description:
      "Formulas expanding the sine or cosine of two angles combined.",
    explanation:
      "sin(A + B) = sin A cos B + cos A sin B and cos(A + B) = cos A cos B - sin A sin B, which give the double-angle rules when A = B.",
    representation:
      "Show two angles stacked at one vertex with the combined opening marked.",
    example: "cos 75 degrees = cos(45 + 30) = (sqrt(6) - sqrt(2))/4.",
    extra: "addition formula compound angle sine cosine",
  },
  {
    term: "Cofunction identity",
    category: "Trigonometry",
    kind: "angle",
    description: "A rule swapping a function with its complement partner.",
    explanation:
      "sin(90 degrees - theta) = cos theta, and the same pairing links tangent with cotangent and secant with cosecant.",
    representation:
      "Show a right triangle where the two acute angles swap roles.",
    example: "sin 70 degrees = cos 20 degrees because 70 + 20 = 90.",
    extra: "complementary angle sine cosine swap",
  },
  {
    term: "Radian measure",
    category: "Trigonometry",
    kind: "angle",
    description: "An angle measured by arc length divided by radius.",
    explanation:
      "One full turn is 2 pi radians, so 180 degrees equals pi radians, and calculus formulas for sine and cosine assume radians.",
    representation:
      "Show an arc equal in length to the radius spanning one radian.",
    example:
      "90 degrees = pi/2 radians, and an arc of 2 radians on radius 5 has length 10.",
    extra: "arc length pi conversion degrees",
  },
  {
    term: "Alternative hypothesis",
    category: "Statistics",
    kind: "probability",
    description: "The claim a significance test looks for evidence to support.",
    explanation:
      "Written H1, it is accepted only when the data make the null hypothesis implausible, and it can be one-tailed or two-tailed.",
    representation:
      "Show a sampling distribution with the rejection tail shaded.",
    example:
      "Testing whether a coin favours heads uses H0: p = 0.5 against H1: p > 0.5.",
    extra: "h1 null hypothesis testing tail",
  },
  {
    term: "Significance level",
    category: "Statistics",
    kind: "probability",
    description:
      "The probability of rejecting a true null hypothesis that a test allows.",
    explanation:
      "Called alpha and often set at 0.05, it fixes the size of the rejection region before the data are seen.",
    representation:
      "Show a distribution with a small shaded tail area labelled alpha.",
    example:
      "At alpha = 0.05, a p-value of 0.03 leads to rejecting the null hypothesis.",
    extra: "alpha p-value rejection region confidence",
  },
  {
    term: "Type I error",
    category: "Statistics",
    kind: "probability",
    description: "Rejecting a null hypothesis that is actually true.",
    explanation:
      "It is a false positive, and its probability equals the chosen significance level alpha.",
    representation:
      "Show the true-null distribution with the wrongly rejected tail shaded.",
    example:
      "Declaring a medicine effective when it truly has no effect is a Type I error.",
    extra: "false positive alpha error testing",
  },
  {
    term: "Type II error",
    category: "Statistics",
    kind: "probability",
    description: "Failing to reject a null hypothesis that is actually false.",
    explanation:
      "It is a false negative with probability beta, and it shrinks as the sample size or the true effect grows.",
    representation:
      "Show two overlapping distributions with the missed region shaded.",
    example:
      "Concluding a medicine does not work when it truly does is a Type II error.",
    extra: "false negative beta power sample size",
  },
  {
    term: "Degrees of freedom",
    category: "Statistics",
    kind: "probability",
    description:
      "The number of values in a calculation that can vary independently.",
    explanation:
      "Each estimated parameter uses one up, which is why a sample variance divides by n - 1.",
    representation:
      "Show a set of data values with one position fixed by the others.",
    example:
      "A sample of 10 values has 9 degrees of freedom once the mean is estimated.",
    extra: "df t distribution chi square n minus one",
  },
  {
    term: "Sampling distribution",
    category: "Statistics",
    kind: "probability",
    description: "The distribution of a statistic across all possible samples.",
    explanation:
      "Sample means cluster far more tightly than raw data, with standard error sigma/sqrt(n), and that is what makes inference possible.",
    representation:
      "Show many sample means collecting into a narrow bell shape.",
    example:
      "For a population with sigma = 20 and n = 25, sample means have standard error 4.",
    extra: "standard error central limit theorem statistic",
  },
  {
    term: "Margin of error",
    category: "Statistics",
    kind: "probability",
    description: "The half-width of a confidence interval around an estimate.",
    explanation:
      "It equals a critical value times the standard error, so quadrupling the sample size halves it.",
    representation: "Show an estimate with equal error bars on each side.",
    example:
      "A poll reporting 52% with a 3% margin of error covers 49% to 55%.",
    extra: "confidence interval error bar polling",
  },
  {
    term: "Coefficient of determination",
    category: "Statistics",
    kind: "graph",
    description:
      "The share of variation in the response explained by a fitted model.",
    explanation:
      "Written r^2, it runs from 0 to 1 and is the square of the correlation coefficient in simple linear regression.",
    representation:
      "Show scatter points with a fitted line and shrinking residual gaps.",
    example: "An r of 0.9 gives r^2 = 0.81, so 81% of variation is explained.",
    extra: "r squared regression fit variance explained",
  },
  {
    term: "Stratified sample",
    category: "Statistics",
    kind: "probability",
    description: "A sample drawn proportionally from distinct subgroups.",
    explanation:
      "Splitting the population into strata first and sampling each one guarantees every group is represented.",
    representation:
      "Show a population divided into bands with equal proportions drawn from each.",
    example:
      "From 600 boys and 400 girls, a stratified sample of 100 takes 60 boys and 40 girls.",
    extra: "strata proportional sampling representative",
  },
  {
    term: "Five number summary",
    category: "Statistics",
    kind: "probability",
    description:
      "The minimum, lower quartile, median, upper quartile, and maximum of a data set.",
    explanation:
      "These five values describe centre and spread, and they are exactly what a box plot draws.",
    representation: "Show a box plot with each of the five markers labelled.",
    example: "For 2, 4, 6, 8, 10 the summary is 2, 3, 6, 9, 10.",
    extra: "box plot quartile median range spread",
  },
  {
    term: "Uniform distribution",
    category: "Probability",
    kind: "probability",
    description:
      "A distribution where every outcome in a range is equally likely.",
    explanation:
      "The discrete version gives each of n outcomes probability 1/n, while the continuous version on [a, b] has constant density 1/(b - a) and mean (a + b)/2.",
    representation:
      "Show a flat rectangle of equal-height bars across a range.",
    example:
      "A fair die is uniform with each face at probability 1/6 and mean 3.5.",
    extra: "equally likely flat rectangular density",
  },
  {
    term: "Exponential distribution",
    category: "Probability",
    kind: "probability",
    description: "A distribution of waiting times between random events.",
    explanation:
      "With rate lambda it has density lambda e^(-lambda t), mean 1/lambda, and no memory of how long you have already waited.",
    representation: "Show a decaying curve with area crowded near zero.",
    example:
      "If calls arrive at 2 per hour, the mean wait is half an hour and P(T > 1) = e^-2.",
    extra: "waiting time memoryless poisson lambda",
  },
  {
    term: "Odds",
    category: "Probability",
    kind: "probability",
    description: "A comparison of favourable outcomes with unfavourable ones.",
    explanation:
      "Odds of a to b correspond to probability a/(a + b), which is why odds and probability are different numbers.",
    representation:
      "Show two bars comparing favourable and unfavourable counts.",
    example:
      "Drawing a heart has probability 1/4 and odds of 1 to 3 in favour.",
    extra: "odds in favour against ratio",
  },
  {
    term: "Pigeonhole principle",
    category: "Probability",
    kind: "set",
    description:
      "If more items than containers are placed, some container holds at least two.",
    explanation:
      "The general form says n items in k boxes force some box to hold at least n/k items rounded up.",
    representation:
      "Show more dots than boxes with one box receiving two dots.",
    example:
      "Among 13 people at least two share a birth month, because 13 is more than 12.",
    extra: "counting argument dirichlet boxes combinatorics",
  },
  {
    term: "Relation",
    category: "Set Theory",
    kind: "set",
    description: "Any set of ordered pairs linking elements of two sets.",
    explanation:
      "Every function is a relation, but a relation may pair one input with several outputs, and reflexive, symmetric, and transitive properties classify it.",
    representation:
      "Show two element columns with arrows joining the related pairs.",
    example: "On {1, 2, 3} the relation is-less-than is {(1,2), (1,3), (2,3)}.",
    extra: "ordered pairs function reflexive symmetric transitive",
  },
  {
    term: "Countable set",
    category: "Set Theory",
    kind: "set",
    description:
      "A set whose elements can be listed in a one-to-one match with the counting numbers.",
    explanation:
      "Finite sets and sets such as the integers and rationals are countable, while the real numbers are not.",
    representation: "Show elements paired one by one with 1, 2, 3 and onward.",
    example: "The integers are countable using the order 0, 1, -1, 2, -2, ...",
    extra: "denumerable enumerable cardinality bijection",
  },
  {
    term: "Set builder notation",
    category: "Set Theory",
    kind: "set",
    description: "A way of defining a set by a rule its members satisfy.",
    explanation:
      "The form {x : condition} reads as the set of all x such that the condition holds, replacing long or infinite lists.",
    representation: "Show a rule inside braces beside the elements it selects.",
    example: "{x in Z : x^2 < 10} = {-3, -2, -1, 0, 1, 2, 3}.",
    extra: "such that braces condition define",
  },
  {
    term: "Metric space",
    category: "Set Theory",
    kind: "coordinate",
    description:
      "A set together with a distance rule satisfying the usual distance properties.",
    explanation:
      "The metric must be non-negative, zero only between identical points, symmetric, and obedient to the triangle inequality.",
    representation:
      "Show points with distance labels and a triangle inequality check.",
    example:
      "The plane with d = sqrt((x1 - x2)^2 + (y1 - y2)^2) is a metric space.",
    extra: "distance function triangle inequality topology",
  },
  {
    term: "Tautology",
    category: "Logic",
    kind: "logic",
    description:
      "A statement that is true for every assignment of truth values.",
    explanation:
      "Its truth table column is entirely true, so it says nothing about the world but is essential in proof rules.",
    representation:
      "Show a truth table whose final column is true in every row.",
    example: "p or not p is a tautology, true whether p is true or false.",
    extra: "truth table always true valid contradiction",
  },
  {
    term: "Modus ponens",
    category: "Logic",
    kind: "logic",
    description: "The rule that concludes q from p and from p implies q.",
    explanation:
      "It is the core forward step of deductive proof, and it becomes invalid if the implication is used backwards.",
    representation:
      "Show two premise boxes feeding an arrow into the conclusion.",
    example:
      "From if it rains the ground is wet, and it is raining, conclude the ground is wet.",
    extra: "deduction implication inference rule",
  },
  {
    term: "Counterexample",
    category: "Logic",
    kind: "logic",
    description: "A single case that disproves a general claim.",
    explanation:
      "One counterexample is enough to refute a universal statement, though no number of examples can prove one.",
    representation: "Show a general claim with one failing case circled.",
    example:
      "The claim all primes are odd fails at 2, which is prime and even.",
    extra: "disproof refute universal claim exception",
  },
  {
    term: "Corollary",
    category: "Logic",
    kind: "logic",
    description: "A result that follows quickly from a theorem already proved.",
    explanation:
      "It needs little extra work, unlike a lemma, which is proved first as a stepping stone toward a larger theorem.",
    representation:
      "Show a theorem box with a short arrow to a smaller result.",
    example:
      "From the triangle angle sum it follows that each angle of an equilateral triangle is 60 degrees.",
    extra: "lemma theorem consequence proof",
  },
  {
    term: "Singular value decomposition",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "A factorization of any matrix into a rotation, a scaling, and another rotation.",
    explanation:
      "Writing A = U S V^T exposes the strongest directions of the matrix and underpins data compression and least squares.",
    representation: "Show a matrix split into three labelled factor blocks.",
    example:
      "Keeping only the largest singular values of an image matrix gives a compressed approximation.",
    extra: "svd factorization rank compression pca",
  },
  {
    term: "LU decomposition",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "A factorization of a matrix into lower and upper triangular factors.",
    explanation:
      "Once A = LU is known, many systems Ax = b are solved quickly by forward then backward substitution.",
    representation:
      "Show a square matrix split into a lower and an upper triangle.",
    example: "[[2, 1], [4, 3]] = [[1, 0], [2, 1]] x [[2, 1], [0, 1]].",
    extra: "triangular gaussian elimination solve pivot",
  },
  {
    term: "QR decomposition",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "A factorization into an orthogonal matrix times an upper triangular matrix.",
    explanation:
      "Because Q has orthonormal columns, A = QR gives numerically stable least squares solutions.",
    representation:
      "Show a matrix split into orthonormal columns and a triangular factor.",
    example: "For a full-rank A, solving Ax = b reduces to Rx = Q^T b.",
    extra: "orthogonal gram schmidt least squares stable",
  },
  {
    term: "Gram-Schmidt process",
    category: "Linear Algebra",
    kind: "vector",
    description: "A method turning any basis into an orthonormal one.",
    explanation:
      "Each new vector has its projections onto the earlier ones subtracted off, then is scaled to unit length.",
    representation:
      "Show an arrow with its projection removed to leave a perpendicular part.",
    example:
      "From (1, 1) and (1, 0) the process gives (1, 1)/sqrt(2) and (1, -1)/sqrt(2).",
    extra: "orthonormal basis projection orthogonalize qr",
  },
  {
    term: "Cayley-Hamilton theorem",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "Every square matrix satisfies its own characteristic polynomial.",
    explanation:
      "Substituting the matrix into that polynomial gives the zero matrix, which yields shortcuts for powers and inverses.",
    representation:
      "Show a characteristic polynomial with the matrix substituted for lambda.",
    example:
      "For A = [[1, 1], [0, 1]], the polynomial (lambda - 1)^2 gives (A - I)^2 = 0.",
    extra: "characteristic polynomial eigenvalue matrix power",
  },
  {
    term: "Rank-nullity theorem",
    category: "Linear Algebra",
    kind: "matrix",
    description:
      "The rank plus the nullity of a matrix equals its number of columns.",
    explanation:
      "Every input dimension is either stretched into the image or collapsed into the kernel, so the two counts always add up.",
    representation:
      "Show input dimensions splitting into an image part and a kernel part.",
    example: "A 3 by 4 matrix of rank 3 has nullity 4 - 3 = 1.",
    extra: "rank nullity kernel image dimension",
  },
];

const symbolDictionaryTerms: EnrichedVisualDictionaryTerm[] = [
  {
    term: "Integral symbol (∫)",
    category: "Calculus",
    kind: "text",
    description:
      "The symbol for continuous accumulation or area under a curve.",
    explanation:
      "It adds infinitely many tiny pieces, such as slices of area, distance, or mass.",
    representation: "Example: ∫_0^2 x dx = 2.",
    extra: "integration antiderivative area accumulation",
  },
  {
    term: "Double integral symbol (∫∫)",
    category: "Calculus",
    kind: "text",
    description: "A symbol for accumulation over a two-dimensional region.",
    explanation:
      "It is used for area, mass, probability density, and surface-like totals over a plane region.",
    representation: "Example: ∫∫_R f(x,y) dA.",
    extra: "multiple integral area region",
  },
  {
    term: "Triple integral symbol (∫∫∫)",
    category: "Calculus",
    kind: "text",
    description: "A symbol for accumulation over a three-dimensional region.",
    explanation: "It adds values throughout a volume.",
    representation: "Example: ∫∫∫_V ρ dV gives total mass.",
    extra: "volume integral mass density",
  },
  {
    term: "Contour integral symbol (∮)",
    category: "Calculus",
    kind: "text",
    description: "An integral taken around a closed curve.",
    explanation:
      "It appears in vector calculus, complex analysis, and circulation problems.",
    representation: "Example: ∮_C F · dr measures circulation around C.",
    extra: "closed line integral circulation",
  },
  {
    term: "Derivative symbol (d/dx)",
    category: "Calculus",
    kind: "text",
    description: "The operator for differentiating with respect to x.",
    explanation: "It measures instantaneous rate of change or tangent slope.",
    representation: "Example: d/dx(x^3) = 3x^2.",
    extra: "differentiation slope rate",
  },
  {
    term: "Prime derivative symbol (′)",
    category: "Calculus",
    kind: "text",
    description: "A compact mark for the derivative of a function.",
    explanation: "It is often used when the input variable is understood.",
    representation: "Example: if f(x) = x^2, then f′(x) = 2x.",
    extra: "f prime derivative",
  },
  {
    term: "Second derivative symbol (″)",
    category: "Calculus",
    kind: "text",
    description: "A compact mark for the derivative of a derivative.",
    explanation: "It measures curvature, concavity, or acceleration.",
    representation: "Example: if s(t) is position, s″(t) is acceleration.",
    extra: "double prime acceleration concavity",
  },
  {
    term: "Partial derivative symbol (∂)",
    category: "Calculus",
    kind: "text",
    description:
      "The symbol for differentiating with respect to one variable while holding others fixed.",
    explanation: "It is central in multivariable calculus.",
    representation: "Example: ∂/∂x (x^2y) = 2xy.",
    extra: "partial differential del",
  },
  {
    term: "Nabla symbol (∇)",
    category: "Calculus",
    kind: "text",
    description:
      "The vector differential operator used for gradient, divergence, and curl.",
    explanation:
      "It packages multivariable derivative operations into one symbol.",
    representation: "Example: ∇f points in the direction of steepest increase.",
    extra: "del gradient divergence curl",
  },
  {
    term: "Gradient symbol (∇f)",
    category: "Calculus",
    kind: "text",
    description: "A vector of partial derivatives.",
    explanation:
      "It points toward fastest increase of a multivariable function.",
    representation: "Example: for f=x^2+y^2, ∇f=(2x,2y).",
    extra: "gradient vector steepest ascent",
  },
  {
    term: "Delta symbol (Δ)",
    category: "Calculus",
    kind: "text",
    description: "A symbol for change or finite difference.",
    explanation: "It compares a later value with an earlier value.",
    representation: "Example: Δx = x_2 - x_1.",
    extra: "change difference",
  },
  {
    term: "Differential symbol (dx)",
    category: "Calculus",
    kind: "text",
    description: "A tiny change in x used in calculus notation.",
    explanation:
      "In integrals it identifies the variable being accumulated over.",
    representation: "Example: ∫ 2x dx integrates with respect to x.",
    extra: "differential infinitesimal",
  },
  {
    term: "Limit arrow symbol (→)",
    category: "Calculus",
    kind: "text",
    description: "A symbol meaning approaches or maps to.",
    explanation: "In limits it shows the input moving toward a value.",
    representation: "Example: x → 0 means x approaches 0.",
    extra: "approaches tends to maps to",
  },
  {
    term: "Infinity symbol (∞)",
    category: "Calculus",
    kind: "text",
    description:
      "A symbol for unbounded size, endlessness, or an infinite process.",
    explanation:
      "It is not an ordinary number, but it describes growth without bound.",
    representation: "Example: lim_{x→∞} 1/x = 0.",
    extra: "infinite unbounded",
  },
  {
    term: "Summation symbol (Σ)",
    category: "Algebra",
    kind: "text",
    description: "A symbol for adding a sequence of terms.",
    explanation: "It compresses long repeated addition into one notation.",
    representation: "Example: Σ_{k=1}^4 k = 1+2+3+4 = 10.",
    extra: "sigma sum series",
  },
  {
    term: "Product symbol (Π)",
    category: "Algebra",
    kind: "text",
    description: "A symbol for multiplying a sequence of terms.",
    explanation: "It is the multiplication counterpart of summation notation.",
    representation: "Example: Π_{k=1}^4 k = 24.",
    extra: "pi product multiplication",
  },
  {
    term: "Pi symbol (π)",
    category: "Geometry",
    kind: "text",
    description:
      "The constant ratio of a circle circumference to its diameter.",
    explanation: "It appears in circle, trigonometry, and wave formulas.",
    representation: "Example: circle area A = πr^2.",
    extra: "pie pi constant circle",
  },
  {
    term: "Euler number symbol (e)",
    category: "Algebra",
    kind: "text",
    description: "The natural growth constant, approximately 2.71828.",
    explanation: "It is the base of natural logarithms and continuous growth.",
    representation: "Example: d/dx(e^x) = e^x.",
    extra: "euler constant natural exponential",
  },
  {
    term: "Imaginary unit symbol (i)",
    category: "Algebra",
    kind: "text",
    description: "The number whose square is -1.",
    explanation: "It extends real numbers into complex numbers.",
    representation: "Example: i^2 = -1 and 3+2i is complex.",
    extra: "complex imaginary",
  },
  {
    term: "Euler gamma symbol (γ)",
    category: "Number Theory",
    kind: "text",
    description: "A symbol often used for the Euler-Mascheroni constant.",
    explanation:
      "It appears in harmonic sums, logarithms, and advanced analysis.",
    representation: "Example: H_n - ln(n) approaches γ.",
    extra: "gamma euler mascheroni constant",
  },
  {
    term: "Golden ratio symbol (φ)",
    category: "Geometry",
    kind: "text",
    description: "A constant approximately equal to 1.618.",
    explanation:
      "It appears when a whole relates to a larger part as the larger part relates to the smaller.",
    representation: "Example: φ = (1 + √5) / 2.",
    extra: "phi golden ratio",
  },
  {
    term: "Square root symbol (√)",
    category: "Arithmetic",
    kind: "text",
    description:
      "A symbol asking for a number whose square gives the radicand.",
    explanation:
      "The principal square root is nonnegative in ordinary real-number work.",
    representation: "Example: √49 = 7.",
    extra: "radical root",
  },
  {
    term: "Nth root symbol (ⁿ√)",
    category: "Arithmetic",
    kind: "text",
    description: "A symbol for roots beyond square roots.",
    explanation:
      "It asks which number raised to the nth power gives the value inside.",
    representation: "Example: ³√27 = 3.",
    extra: "cube root radical",
  },
  {
    term: "Plus-minus symbol (±)",
    category: "Algebra",
    kind: "text",
    description: "A symbol meaning both plus and minus cases.",
    explanation: "It is used when two symmetric answers are possible.",
    representation: "Example: x = ±3 means x = 3 or x = -3.",
    extra: "positive negative both",
  },
  {
    term: "Minus-plus symbol (∓)",
    category: "Algebra",
    kind: "text",
    description: "A paired symbol used opposite to plus-minus.",
    explanation: "It keeps signs coordinated across two expressions.",
    representation:
      "Example: a ± b and c ∓ d means choose opposite signs together.",
    extra: "paired signs",
  },
  {
    term: "Multiplication dot symbol (·)",
    category: "Arithmetic",
    kind: "text",
    description: "A centered dot used for multiplication.",
    explanation: "It avoids confusion with the letter x.",
    representation: "Example: 6 · 7 = 42.",
    extra: "times product dot",
  },
  {
    term: "Multiplication cross symbol (×)",
    category: "Arithmetic",
    kind: "text",
    description: "A cross-shaped multiplication sign.",
    explanation: "It is common in arithmetic and dimensions.",
    representation: "Example: 8 × 5 = 40.",
    extra: "times product cross",
  },
  {
    term: "Division symbol (÷)",
    category: "Arithmetic",
    kind: "text",
    description: "A symbol for division.",
    explanation: "It separates a quantity into equal groups.",
    representation: "Example: 20 ÷ 4 = 5.",
    extra: "divide quotient",
  },
  {
    term: "Fraction slash symbol (/)",
    category: "Arithmetic",
    kind: "text",
    description: "A compact symbol for division or fractions.",
    explanation: "It is often used in inline formulas.",
    representation: "Example: 3/4 means three divided by four.",
    extra: "fraction divide ratio",
  },
  {
    term: "Equals symbol (=)",
    category: "Algebra",
    kind: "text",
    description: "A symbol saying two expressions have the same value.",
    explanation: "It creates a balance between the left and right sides.",
    representation: "Example: 2x + 1 = 7.",
    extra: "equation equality",
  },
  {
    term: "Not equal symbol (≠)",
    category: "Algebra",
    kind: "text",
    description: "A symbol saying two expressions are different.",
    explanation: "It rejects equality between the two sides.",
    representation: "Example: 5 ≠ 8.",
    extra: "inequality unequal",
  },
  {
    term: "Approximately equal symbol (≈)",
    category: "Arithmetic",
    kind: "text",
    description: "A symbol meaning close enough for an approximation.",
    explanation: "It is used when values are rounded or numerically estimated.",
    representation: "Example: π ≈ 3.14.",
    extra: "approx about estimate",
  },
  {
    term: "Congruent symbol (≅)",
    category: "Geometry",
    kind: "text",
    description: "A symbol meaning same size and same shape.",
    explanation: "It is often used for figures or segments in geometry.",
    representation: "Example: △ABC ≅ △DEF.",
    extra: "congruence geometry",
  },
  {
    term: "Similar symbol (∼)",
    category: "Geometry",
    kind: "text",
    description: "A symbol meaning same shape, possibly different size.",
    explanation:
      "Similar figures have equal corresponding angles and proportional sides.",
    representation: "Example: △ABC ∼ △PQR.",
    extra: "similarity proportional",
  },
  {
    term: "Proportional symbol (∝)",
    category: "Algebra",
    kind: "text",
    description:
      "A symbol meaning one quantity is a constant multiple of another.",
    explanation: "If y is proportional to x, then y = kx for some constant k.",
    representation: "Example: C ∝ r for circle circumference and radius.",
    extra: "direct variation proportion",
  },
  {
    term: "Less than symbol (<)",
    category: "Arithmetic",
    kind: "text",
    description: "A comparison symbol meaning the left value is smaller.",
    explanation: "It orders numbers from smaller to larger.",
    representation: "Example: 3 < 9.",
    extra: "comparison inequality",
  },
  {
    term: "Greater than symbol (>)",
    category: "Arithmetic",
    kind: "text",
    description: "A comparison symbol meaning the left value is larger.",
    explanation: "It orders numbers from larger to smaller.",
    representation: "Example: 12 > 5.",
    extra: "comparison inequality",
  },
  {
    term: "Less than or equal symbol (≤)",
    category: "Algebra",
    kind: "text",
    description: "A comparison symbol meaning smaller than or exactly equal.",
    explanation: "It includes the boundary value.",
    representation: "Example: x ≤ 4 includes x = 4.",
    extra: "inequality at most",
  },
  {
    term: "Greater than or equal symbol (≥)",
    category: "Algebra",
    kind: "text",
    description: "A comparison symbol meaning larger than or exactly equal.",
    explanation: "It includes the boundary value.",
    representation: "Example: x ≥ -2 includes x = -2.",
    extra: "inequality at least",
  },
  {
    term: "Much less than symbol (≪)",
    category: "Arithmetic",
    kind: "text",
    description: "A symbol meaning one quantity is far smaller than another.",
    explanation:
      "It expresses scale separation rather than an exact threshold.",
    representation: "Example: 1 ≪ 1000000.",
    extra: "asymptotic scale small",
  },
  {
    term: "Much greater than symbol (≫)",
    category: "Arithmetic",
    kind: "text",
    description: "A symbol meaning one quantity is far larger than another.",
    explanation: "It is useful for comparing very different magnitudes.",
    representation: "Example: 10^9 ≫ 10^3.",
    extra: "asymptotic scale large",
  },
  {
    term: "Ceiling symbol (⌈x⌉)",
    category: "Algebra",
    kind: "text",
    description: "A symbol for rounding up to the nearest integer.",
    explanation:
      "The ceiling is the smallest integer greater than or equal to the input.",
    representation: "Example: ⌈3.2⌉ = 4 and ⌈-1.7⌉ = -1.",
    extra: "ceiling function round up",
  },
  {
    term: "Floor symbol (⌊x⌋)",
    category: "Algebra",
    kind: "text",
    description: "A symbol for rounding down to the nearest integer.",
    explanation:
      "The floor is the greatest integer less than or equal to the input.",
    representation: "Example: ⌊3.8⌋ = 3 and ⌊-1.2⌋ = -2.",
    extra: "flooring floor function round down",
  },
  {
    term: "Absolute value bars (|x|)",
    category: "Algebra",
    kind: "text",
    description: "Bars showing distance from zero.",
    explanation: "Absolute value is never negative.",
    representation: "Example: |-6| = 6.",
    extra: "modulus magnitude distance",
  },
  {
    term: "Norm symbol (‖v‖)",
    category: "Linear Algebra",
    kind: "text",
    description: "Double bars showing vector length or size.",
    explanation: "A norm generalizes absolute value to vectors and functions.",
    representation: "Example: ‖(3,4)‖ = 5.",
    extra: "vector length magnitude",
  },
  {
    term: "Angle bracket symbol (⟨u,v⟩)",
    category: "Linear Algebra",
    kind: "text",
    description: "A common notation for inner product.",
    explanation:
      "It measures alignment between vectors in an inner product space.",
    representation: "Example: ⟨(1,2),(3,4)⟩ = 11.",
    extra: "inner product dot product",
  },
  {
    term: "Vector arrow symbol (→)",
    category: "Linear Algebra",
    kind: "text",
    description: "An arrow over a letter indicating a vector.",
    explanation: "It distinguishes a directed quantity from a scalar.",
    representation:
      "Example: →v may represent velocity with magnitude and direction.",
    extra: "vector notation arrow",
  },
  {
    term: "Hat symbol (x̂)",
    category: "Statistics",
    kind: "text",
    description:
      "A mark often used for an estimate, prediction, or unit vector.",
    explanation:
      "The meaning depends on context: statistics uses estimates, vectors use unit directions.",
    representation: "Example: p̂ is a sample proportion estimate.",
    extra: "estimate unit vector prediction",
  },
  {
    term: "Bar symbol (x̄)",
    category: "Statistics",
    kind: "text",
    description: "A mark often used for sample mean.",
    explanation: "It indicates an average computed from observed data.",
    representation: "Example: x̄ = (2+4+9)/3 = 5.",
    extra: "mean average sample",
  },
  {
    term: "Factorial symbol (!)",
    category: "Probability",
    kind: "text",
    description: "A symbol for multiplying all positive integers down to 1.",
    explanation: "It counts arrangements of distinct objects.",
    representation: "Example: 5! = 5×4×3×2×1 = 120.",
    extra: "permutation counting",
  },
  {
    term: "Percent symbol (%)",
    category: "Arithmetic",
    kind: "text",
    description: "A symbol meaning per hundred.",
    explanation: "It rewrites a fraction with denominator 100.",
    representation: "Example: 25% = 25/100 = 0.25.",
    extra: "percentage per hundred",
  },
  {
    term: "Per mille symbol (‰)",
    category: "Arithmetic",
    kind: "text",
    description: "A symbol meaning per thousand.",
    explanation: "It is useful for small rates.",
    representation: "Example: 5‰ = 5/1000 = 0.005.",
    extra: "per thousand rate",
  },
  {
    term: "Degree symbol (°)",
    category: "Geometry",
    kind: "text",
    description:
      "A symbol for measuring angles or temperature-like quantities.",
    explanation: "In geometry it divides a full turn into 360 degrees.",
    representation: "Example: a right angle is 90°.",
    extra: "angle measure degrees",
  },
  {
    term: "Radian symbol (rad)",
    category: "Trigonometry",
    kind: "text",
    description: "A unit for angle measure based on arc length over radius.",
    explanation: "Radians connect angles directly to circle arc lengths.",
    representation: "Example: 180° = π rad.",
    extra: "angle unit radians",
  },
  {
    term: "Parallel symbol (∥)",
    category: "Geometry",
    kind: "text",
    description: "A symbol meaning two lines or segments never meet.",
    explanation:
      "Parallel lines keep the same direction and constant separation.",
    representation: "Example: AB ∥ CD.",
    extra: "parallel lines geometry",
  },
  {
    term: "Perpendicular symbol (⊥)",
    category: "Geometry",
    kind: "text",
    description: "A symbol meaning two lines meet at a right angle.",
    explanation: "Perpendicular lines form 90-degree angles.",
    representation: "Example: AB ⊥ CD.",
    extra: "orthogonal right angle",
  },
  {
    term: "Triangle symbol (△)",
    category: "Geometry",
    kind: "text",
    description: "A symbol used before three points to name a triangle.",
    explanation: "It helps state relationships involving triangle vertices.",
    representation: "Example: △ABC has vertices A, B, and C.",
    extra: "triangle geometry",
  },
  {
    term: "Angle symbol (∠)",
    category: "Geometry",
    kind: "text",
    description: "A symbol used to name an angle.",
    explanation: "The middle letter usually marks the vertex of the angle.",
    representation: "Example: ∠ABC has vertex B.",
    extra: "angle geometry",
  },
  {
    term: "Measured angle symbol (∡)",
    category: "Geometry",
    kind: "text",
    description: "A symbol sometimes used for an angle with explicit measure.",
    explanation: "It emphasizes the numerical angle size.",
    representation: "Example: m∡ABC = 45°.",
    extra: "angle measure",
  },
  {
    term: "Set membership symbol (∈)",
    category: "Set Theory",
    kind: "text",
    description: "A symbol meaning is an element of.",
    explanation: "It says an object belongs to a set.",
    representation: "Example: 3 ∈ {1,2,3}.",
    extra: "belongs element member",
  },
  {
    term: "Not member symbol (∉)",
    category: "Set Theory",
    kind: "text",
    description: "A symbol meaning is not an element of.",
    explanation: "It says an object does not belong to a set.",
    representation: "Example: 5 ∉ {1,2,3}.",
    extra: "not belongs element member",
  },
  {
    term: "Subset symbol (⊂)",
    category: "Set Theory",
    kind: "text",
    description: "A symbol meaning one set is contained inside another.",
    explanation: "Every element of the smaller set is in the larger set.",
    representation: "Example: {1,2} ⊂ {1,2,3}.",
    extra: "proper subset contained",
  },
  {
    term: "Subset or equal symbol (⊆)",
    category: "Set Theory",
    kind: "text",
    description: "A symbol meaning contained in, possibly equal.",
    explanation: "It allows the two sets to be the same.",
    representation: "Example: {1,2} ⊆ {1,2}.",
    extra: "subset equal contained",
  },
  {
    term: "Superset symbol (⊃)",
    category: "Set Theory",
    kind: "text",
    description: "A symbol meaning one set contains another set.",
    explanation: "It reverses the direction of subset notation.",
    representation: "Example: {1,2,3} ⊃ {1,2}.",
    extra: "proper superset contains",
  },
  {
    term: "Superset or equal symbol (⊇)",
    category: "Set Theory",
    kind: "text",
    description: "A symbol meaning contains, possibly equal.",
    explanation: "It allows both sets to contain exactly the same elements.",
    representation: "Example: A ⊇ A.",
    extra: "superset equal contains",
  },
  {
    term: "Union symbol (∪)",
    category: "Set Theory",
    kind: "text",
    description: "A symbol for combining elements from either set.",
    explanation: "The union includes everything in A, in B, or in both.",
    representation: "Example: {1,2} ∪ {2,3} = {1,2,3}.",
    extra: "or sets combine",
  },
  {
    term: "Intersection symbol (∩)",
    category: "Set Theory",
    kind: "text",
    description: "A symbol for elements shared by sets.",
    explanation: "The intersection keeps only what belongs to both sets.",
    representation: "Example: {1,2} ∩ {2,3} = {2}.",
    extra: "and overlap sets",
  },
  {
    term: "Empty set symbol (∅)",
    category: "Set Theory",
    kind: "text",
    description: "A symbol for a set with no elements.",
    explanation: "It is a set, but it contains nothing.",
    representation: "Example: {even primes greater than 2} = ∅.",
    extra: "null set empty",
  },
  {
    term: "Universal set symbol (U)",
    category: "Set Theory",
    kind: "text",
    description: "A symbol for the whole set under discussion.",
    explanation: "Complements are usually taken relative to the universal set.",
    representation: "Example: if U={1,2,3}, then A' stays inside U.",
    extra: "universe universal set",
  },
  {
    term: "Set complement symbol (A′)",
    category: "Set Theory",
    kind: "text",
    description: "A mark for everything in the universal set but not in A.",
    explanation: "Complement notation depends on the chosen universe.",
    representation: "Example: if U={1,2,3} and A={1}, then A′={2,3}.",
    extra: "complement not A",
  },
  {
    term: "Logical and symbol (∧)",
    category: "Logic",
    kind: "text",
    description: "A symbol meaning both statements are true.",
    explanation: "The combined statement is true only when each part is true.",
    representation: "Example: P ∧ Q means P and Q.",
    extra: "conjunction logic and",
  },
  {
    term: "Logical or symbol (∨)",
    category: "Logic",
    kind: "text",
    description: "A symbol meaning at least one statement is true.",
    explanation:
      "In standard inclusive logic, it also allows both statements to be true.",
    representation: "Example: P ∨ Q means P or Q or both.",
    extra: "disjunction logic or",
  },
  {
    term: "Logical not symbol (¬)",
    category: "Logic",
    kind: "text",
    description: "A symbol meaning the negation of a statement.",
    explanation: "It flips true to false and false to true.",
    representation: "Example: ¬P means not P.",
    extra: "negation logic not",
  },
  {
    term: "Implies symbol (⇒)",
    category: "Logic",
    kind: "text",
    description:
      "A symbol meaning if the left statement is true, the right follows.",
    explanation: "It represents logical implication.",
    representation: "Example: x=2 ⇒ x^2=4.",
    extra: "therefore implication if then",
  },
  {
    term: "If and only if symbol (⇔)",
    category: "Logic",
    kind: "text",
    description: "A symbol meaning both directions of implication hold.",
    explanation: "Each statement is true exactly when the other is true.",
    representation: "Example: n is even ⇔ n is divisible by 2.",
    extra: "biconditional iff",
  },
  {
    term: "Therefore symbol (∴)",
    category: "Logic",
    kind: "text",
    description: "A symbol introducing a conclusion.",
    explanation: "It marks the result that follows from previous statements.",
    representation: "Example: a=b and b=c, ∴ a=c.",
    extra: "conclusion proof",
  },
  {
    term: "Because symbol (∵)",
    category: "Logic",
    kind: "text",
    description: "A symbol introducing a reason.",
    explanation: "It points to the justification for a step.",
    representation: "Example: x=3 ∵ x+2=5.",
    extra: "reason proof",
  },
  {
    term: "For all symbol (∀)",
    category: "Logic",
    kind: "text",
    description: "A quantifier meaning every object in a domain.",
    explanation: "It makes a statement universal.",
    representation: "Example: ∀x∈R, x^2 ≥ 0.",
    extra: "universal quantifier all",
  },
  {
    term: "There exists symbol (∃)",
    category: "Logic",
    kind: "text",
    description: "A quantifier meaning at least one object exists.",
    explanation: "It claims some example satisfies the condition.",
    representation: "Example: ∃x∈R such that x^2=4.",
    extra: "existential quantifier exists",
  },
  {
    term: "Does not exist symbol (∄)",
    category: "Logic",
    kind: "text",
    description: "A quantifier meaning no object satisfies the condition.",
    explanation: "It denies existence in the chosen domain.",
    representation: "Example: ∄x∈R such that x^2=-1.",
    extra: "not exists quantifier",
  },
  {
    term: "Natural numbers symbol (ℕ)",
    category: "Number Theory",
    kind: "text",
    description: "A symbol for the natural numbers.",
    explanation: "Depending on convention, it may start at 1 or include 0.",
    representation: "Example: 5 ∈ ℕ.",
    extra: "N counting numbers",
  },
  {
    term: "Integers symbol (ℤ)",
    category: "Number Theory",
    kind: "text",
    description: "A symbol for all whole numbers and their negatives.",
    explanation: "It includes ..., -2, -1, 0, 1, 2, ...",
    representation: "Example: -7 ∈ ℤ.",
    extra: "Z integers whole negatives",
  },
  {
    term: "Rational numbers symbol (ℚ)",
    category: "Number Theory",
    kind: "text",
    description:
      "A symbol for numbers that can be written as a fraction of integers.",
    explanation: "The denominator must be nonzero.",
    representation: "Example: 3/5 ∈ ℚ.",
    extra: "Q rationals fractions",
  },
  {
    term: "Real numbers symbol (ℝ)",
    category: "Number Theory",
    kind: "text",
    description: "A symbol for all real-line numbers.",
    explanation: "It includes rational and irrational numbers.",
    representation: "Example: √2 ∈ ℝ.",
    extra: "R real line",
  },
  {
    term: "Complex numbers symbol (ℂ)",
    category: "Algebra",
    kind: "text",
    description: "A symbol for numbers of the form a + bi.",
    explanation: "It includes all real numbers and imaginary components.",
    representation: "Example: 2 - 3i ∈ ℂ.",
    extra: "C complex plane",
  },
  {
    term: "Divides symbol (∣)",
    category: "Number Theory",
    kind: "text",
    description:
      "A symbol meaning one integer divides another with no remainder.",
    explanation: "It states exact divisibility.",
    representation: "Example: 3 ∣ 12.",
    extra: "divisibility number theory",
  },
  {
    term: "Does not divide symbol (∤)",
    category: "Number Theory",
    kind: "text",
    description:
      "A symbol meaning one integer does not divide another exactly.",
    explanation: "It says a remainder is left over.",
    representation: "Example: 5 ∤ 12.",
    extra: "not divisible",
  },
  {
    term: "Congruence modulo symbol (≡)",
    category: "Number Theory",
    kind: "text",
    description:
      "A symbol meaning two values have the same remainder modulo n.",
    explanation: "It groups numbers by remainder.",
    representation: "Example: 17 ≡ 5 (mod 12).",
    extra: "mod modular congruent",
  },
  {
    term: "Modulo notation (mod)",
    category: "Number Theory",
    kind: "text",
    description: "Notation for arithmetic by remainders.",
    explanation: "It wraps numbers around after reaching the modulus.",
    representation: "Example: 14 mod 5 = 4.",
    extra: "remainder clock arithmetic",
  },
  {
    term: "Combination symbol (nCr)",
    category: "Probability",
    kind: "text",
    description: "A symbol for choosing r objects from n without order.",
    explanation: "It counts selections where arrangement does not matter.",
    representation: "Example: 5C2 = 10.",
    extra: "choose binomial coefficient",
  },
  {
    term: "Permutation symbol (nPr)",
    category: "Probability",
    kind: "text",
    description: "A symbol for arranging r objects from n in order.",
    explanation: "It counts ordered selections.",
    representation: "Example: 5P2 = 20.",
    extra: "arrangement ordered counting",
  },
  {
    term: "Probability symbol (P)",
    category: "Probability",
    kind: "text",
    description: "A symbol for the probability of an event.",
    explanation: "It assigns a value from 0 to 1 to describe chance.",
    representation: "Example: P(heads) = 1/2.",
    extra: "chance event probability",
  },
  {
    term: "Conditional probability bar (|)",
    category: "Probability",
    kind: "text",
    description: "A vertical bar meaning given that in probability.",
    explanation: "It conditions one event on another already known event.",
    representation: "Example: P(A | B) means probability of A given B.",
    extra: "given conditional probability",
  },
  {
    term: "Expected value symbol (E)",
    category: "Probability",
    kind: "text",
    description: "A symbol for the long-run average of a random variable.",
    explanation: "It weights each outcome by its probability.",
    representation: "Example: E[X] for a fair die is 3.5.",
    extra: "expectation mean random variable",
  },
  {
    term: "Variance symbol (Var)",
    category: "Statistics",
    kind: "text",
    description: "A symbol for spread measured by average squared deviation.",
    explanation: "It shows how far values tend to sit from the mean.",
    representation: "Example: Var(X) = E[(X-μ)^2].",
    extra: "spread statistics",
  },
  {
    term: "Standard deviation symbol (σ)",
    category: "Statistics",
    kind: "text",
    description: "A common symbol for population standard deviation.",
    explanation:
      "It measures typical distance from the mean in original units.",
    representation: "Example: σ = √Var(X).",
    extra: "sigma spread deviation",
  },
  {
    term: "Mean symbol (μ)",
    category: "Statistics",
    kind: "text",
    description: "A common symbol for a population mean.",
    explanation: "It marks the center or expected average of a distribution.",
    representation: "Example: μ = 70 for a test-score population average.",
    extra: "mu average expected value",
  },
  {
    term: "Correlation symbol (ρ)",
    category: "Statistics",
    kind: "text",
    description: "A common symbol for population correlation.",
    explanation: "It measures strength and direction of linear relationship.",
    representation: "Example: ρ = 1 means perfect positive correlation.",
    extra: "rho correlation",
  },
  {
    term: "Alpha symbol (α)",
    category: "Statistics",
    kind: "text",
    description:
      "A Greek letter often used for significance level or an angle.",
    explanation:
      "In hypothesis testing, it marks the chance of a Type I error threshold.",
    representation: "Example: α = 0.05.",
    extra: "alpha significance angle",
  },
  {
    term: "Beta symbol (β)",
    category: "Algebra",
    kind: "text",
    description:
      "A Greek letter used for coefficients, angles, or Type II error rate.",
    explanation: "Its meaning depends on the mathematical context.",
    representation: "Example: y = α + βx in a regression line.",
    extra: "beta coefficient regression angle",
  },
  {
    term: "Theta symbol (θ)",
    category: "Trigonometry",
    kind: "text",
    description: "A Greek letter commonly used for an angle.",
    explanation: "It appears throughout trigonometry and polar coordinates.",
    representation: "Example: sin(θ) = opposite/hypotenuse.",
    extra: "theta angle trig",
  },
  {
    term: "Lambda symbol (λ)",
    category: "Linear Algebra",
    kind: "text",
    description: "A Greek letter often used for eigenvalues or rates.",
    explanation:
      "In linear algebra it names the scale factor of an eigenvector.",
    representation: "Example: Av = λv.",
    extra: "lambda eigenvalue rate",
  },
  {
    term: "Omega symbol (ω)",
    category: "Trigonometry",
    kind: "text",
    description: "A Greek letter often used for angular frequency.",
    explanation: "It measures how fast an angle changes in periodic motion.",
    representation: "Example: y = sin(ωt).",
    extra: "omega angular frequency",
  },
  {
    term: "Capital omega symbol (Ω)",
    category: "Number Theory",
    kind: "text",
    description: "A symbol used in asymptotic lower bounds and other contexts.",
    explanation: "In algorithms, it describes at least a certain growth rate.",
    representation: "Example: f(n) = Ω(n) means f grows at least linearly.",
    extra: "big omega asymptotic",
  },
  {
    term: "Capital theta symbol (Θ)",
    category: "Number Theory",
    kind: "text",
    description: "A symbol for tight asymptotic growth bounds.",
    explanation: "It means a function grows on the same scale above and below.",
    representation: "Example: 3n^2 + 1 is Θ(n^2).",
    extra: "big theta asymptotic complexity",
  },
  {
    term: "Capital O symbol (O)",
    category: "Number Theory",
    kind: "text",
    description: "A symbol for an asymptotic upper bound.",
    explanation: "It describes growth rate while ignoring constant factors.",
    representation: "Example: 5n + 2 is O(n).",
    extra: "big O complexity upper bound",
  },
  {
    term: "Matrix transpose symbol (Aᵀ)",
    category: "Linear Algebra",
    kind: "text",
    description: "A symbol for swapping matrix rows and columns.",
    explanation: "The entry in row i, column j moves to row j, column i.",
    representation: "Example: if A is 2 by 3, Aᵀ is 3 by 2.",
    extra: "transpose matrix",
  },
  {
    term: "Matrix inverse symbol (A⁻¹)",
    category: "Linear Algebra",
    kind: "text",
    description: "A symbol for the matrix that undoes A.",
    explanation: "Only invertible square matrices have inverses.",
    representation: "Example: AA⁻¹ = I.",
    extra: "inverse matrix undo",
  },
  {
    term: "Determinant bars (det A)",
    category: "Linear Algebra",
    kind: "text",
    description: "Notation for the determinant of a square matrix.",
    explanation:
      "It measures area or volume scaling and whether a matrix is invertible.",
    representation: "Example: det([[a,b],[c,d]]) = ad - bc.",
    extra: "determinant matrix bars",
  },
  {
    term: "Identity matrix symbol (I)",
    category: "Linear Algebra",
    kind: "text",
    description: "A symbol for the matrix that leaves vectors unchanged.",
    explanation: "It is the matrix version of multiplying by 1.",
    representation: "Example: AI = A.",
    extra: "unit matrix identity",
  },
  {
    term: "Element-wise product symbol (⊙)",
    category: "Linear Algebra",
    kind: "text",
    description: "A symbol for multiplying matching matrix or vector entries.",
    explanation: "It differs from ordinary matrix multiplication.",
    representation: "Example: (1,2) ⊙ (3,4) = (3,8).",
    extra: "hadamard product",
  },
  {
    term: "Dot product symbol (·)",
    category: "Linear Algebra",
    kind: "text",
    description: "A symbol for scalar product of vectors.",
    explanation:
      "It measures how much two vectors point in the same direction.",
    representation: "Example: (1,2) · (3,4) = 11.",
    extra: "inner product scalar product",
  },
  {
    term: "Cross product symbol (×)",
    category: "Linear Algebra",
    kind: "text",
    description: "A symbol for vector product in 3D.",
    explanation: "It produces a vector perpendicular to the two input vectors.",
    representation: "Example: i × j = k.",
    extra: "vector product perpendicular",
  },
  {
    term: "Approximately proportional symbol (∼)",
    category: "Statistics",
    kind: "text",
    description: "A symbol used to say follows a distribution or behaves like.",
    explanation: "In statistics it often reads as is distributed as.",
    representation: "Example: X ∼ N(0,1).",
    extra: "distributed as similar asymptotic",
  },
  {
    term: "Normal distribution symbol (N)",
    category: "Statistics",
    kind: "text",
    description: "A symbol for the normal distribution family.",
    explanation: "It is usually written with mean and variance parameters.",
    representation: "Example: X ∼ N(μ, σ^2).",
    extra: "normal gaussian bell curve",
  },
  {
    term: "Binomial distribution symbol (Bin)",
    category: "Probability",
    kind: "text",
    description: "A compact symbol for a binomial distribution.",
    explanation:
      "It models the count of successes in repeated independent trials.",
    representation: "Example: X ∼ Bin(n, p).",
    extra: "binomial trials success",
  },
  {
    term: "Approximately normal symbol (≈N)",
    category: "Statistics",
    kind: "text",
    description: "A shorthand saying a distribution is close to normal.",
    explanation:
      "It is often used after approximation theorems or large-sample assumptions.",
    representation: "Example: sample means are often ≈ N(μ, σ^2/n).",
    extra: "normal approximation",
  },
  {
    term: "Open interval parentheses ((a,b))",
    category: "Algebra",
    kind: "text",
    description: "Parentheses marking endpoints not included in an interval.",
    explanation: "Every value strictly between a and b is included.",
    representation: "Example: (2,5) excludes 2 and 5.",
    extra: "interval notation open",
  },
  {
    term: "Closed interval brackets ([a,b])",
    category: "Algebra",
    kind: "text",
    description: "Brackets marking endpoints included in an interval.",
    explanation: "The boundary values are part of the set.",
    representation: "Example: [2,5] includes 2 and 5.",
    extra: "interval notation closed",
  },
  {
    term: "Half-open interval ([a,b))",
    category: "Algebra",
    kind: "text",
    description:
      "Interval notation with one endpoint included and one excluded.",
    explanation: "It is common in piecewise definitions and ranges.",
    representation: "Example: [0,1) includes 0 but excludes 1.",
    extra: "interval notation half open",
  },
  {
    term: "Function composition symbol (∘)",
    category: "Algebra",
    kind: "text",
    description: "A symbol for applying one function after another.",
    explanation:
      "The right function acts first, then the left function acts on the result.",
    representation: "Example: (f∘g)(x) = f(g(x)).",
    extra: "compose functions",
  },
  {
    term: "Maps to symbol (↦)",
    category: "Algebra",
    kind: "text",
    description: "A symbol showing where an input is sent by a function.",
    explanation: "It describes a rule for transforming each input.",
    representation: "Example: x ↦ x^2.",
    extra: "function mapping",
  },
  {
    term: "Right arrow symbol (→)",
    category: "Algebra",
    kind: "text",
    description:
      "A symbol for mapping, direction, or convergence depending on context.",
    explanation:
      "It connects inputs to outputs or shows a value approaching another.",
    representation: "Example: f: A → B maps A into B.",
    extra: "arrow function to",
  },
  {
    term: "Equivalence relation symbol (∼)",
    category: "Set Theory",
    kind: "text",
    description:
      "A symbol meaning two objects are equivalent under a relation.",
    explanation: "It groups objects into equivalence classes.",
    representation:
      "Example: a ∼ b can mean a and b have the same remainder modulo n.",
    extra: "equivalent relation",
  },
  {
    term: "Definition equals symbol (:=)",
    category: "Algebra",
    kind: "text",
    description: "A symbol meaning is defined to be.",
    explanation: "It separates a definition from an equation to solve.",
    representation: "Example: f(x) := x^2 + 1.",
    extra: "defined as assignment",
  },
  {
    term: "QED symbol (∎)",
    category: "Logic",
    kind: "text",
    description: "A symbol marking the end of a proof.",
    explanation: "It means the argument is complete.",
    representation: "Example: after the final proof step, write ∎.",
    extra: "proof complete end",
  },
];

export const visualDictionaryTerms: VisualDictionaryTerm[] = [
  ...rawTerms.map(([term, category, kind, extra = ""]) => ({
    term,
    category,
    kind,
    description: rawTermDescription(term, category, kind),
    explanation: rawTermExplanation(term, kind),
    representation: rawTermRepresentation(term, kind),
    example: rawTermExample(term, kind),
    keywords: [term, category, kind, extra]
      .join(" ")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean),
  })),
  ...additionalVisualDictionaryTerms.map(({ extra = "", ...entry }) => ({
    ...entry,
    example: generatedExampleFor(entry),
    keywords: [
      entry.term,
      entry.category,
      entry.kind,
      entry.description,
      entry.explanation,
      entry.representation,
      generatedExampleFor(entry),
      extra,
    ]
      .join(" ")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean),
  })),
  ...symbolDictionaryTerms.map(({ extra = "", ...entry }) => ({
    ...entry,
    example: generatedExampleFor(entry),
    keywords: [
      entry.term,
      entry.category,
      entry.kind,
      entry.description,
      entry.explanation,
      entry.representation,
      generatedExampleFor(entry),
      extra,
    ]
      .join(" ")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean),
  })),
];

function generatedExampleFor(entry: Omit<VisualDictionaryTerm, "keywords">) {
  if (entry.example?.trim()) return entry.example;
  if (entry.representation?.trim().toLowerCase().startsWith("example:"))
    return entry.representation;
  return rawTermExample(entry.term, entry.kind);
}

export const visualDictionaryLetters = Array.from(
  new Set(visualDictionaryTerms.map((entry) => entry.term[0].toUpperCase())),
).sort();

export const visualDictionaryCategories = Array.from(
  new Set(visualDictionaryTerms.map((entry) => entry.category)),
).sort() as VisualDictionaryCategory[];
