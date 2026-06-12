export type MathTokenCategory =
  | "arithmetic"
  | "number"
  | "grouping"
  | "algebra"
  | "power-root"
  | "trigonometry"
  | "log-exp"
  | "calculus"
  | "coordinate-geometry"
  | "geometry"
  | "statistics"
  | "probability"
  | "matrix"
  | "complex"
  | "discrete"
  | "engineering"
  | "unit"
  | "finance"
  | "word-problem"
  | "constant"
  | "relation"
  | "variable"
  | "unknown";

export type MathTokenConfidence = "high" | "medium" | "low";

export interface MathRecognizedToken {
  text: string;
  normalized: string;
  category: MathTokenCategory;
  label: string;
  description: string;
  start: number;
  end: number;
  confidence: MathTokenConfidence;
  suggestion?: string;
}

interface TokenDefinition {
  category: MathTokenCategory;
  label: string;
  description: string;
  confidence?: MathTokenConfidence;
  suggestion?: string;
}

function def(category: MathTokenCategory, label: string, description: string, suggestion?: string): TokenDefinition {
  return { category, label, description, suggestion };
}

const phraseDefinitions: Array<[string, TokenDefinition]> = [
  ["partial derivative", def("calculus", "Partial Derivative", "Derivative with respect to one variable while others are held constant.")],
  ["area under curve", def("calculus", "Area Under Curve", "Integral interpretation as accumulated area.")],
  ["rate of change", def("calculus", "Rate of Change", "Derivative language for change per unit.")],
  ["critical point", def("calculus", "Critical Point", "Point where derivative-based behavior changes.")],
  ["line integral", def("engineering", "Line Integral", "Engineering vector-calculus integral along a curve.")],
  ["surface integral", def("engineering", "Surface Integral", "Engineering vector-calculus integral across a surface.")],
  ["multiple integral", def("engineering", "Multiple Integral", "Integral over a multi-dimensional region.")],
  ["double integral", def("engineering", "Double Integral", "Integral over a two-dimensional region.")],
  ["triple integral", def("engineering", "Triple Integral", "Integral over a three-dimensional region.")],
  ["fourier series", def("engineering", "Fourier Series", "Engineering representation using sine and cosine terms.")],
  ["fourier transform", def("engineering", "Fourier Transform", "Engineering transform from time or space to frequency.")],
  ["laplace transform", def("engineering", "Laplace Transform", "Engineering transform for differential equations and systems.", "Full transform solving may be a future feature.")],
  ["inverse laplace", def("engineering", "Inverse Laplace Transform", "Converts a Laplace-domain expression back to time domain.")],
  ["z transform", def("engineering", "Z Transform", "Discrete-time transform used in engineering mathematics.")],
  ["inverse z transform", def("engineering", "Inverse Z Transform", "Converts a Z-domain expression back to a sequence.")],
  ["differential equation", def("engineering", "Differential Equation", "Equation involving derivatives.")],
  ["ordinary differential equation", def("engineering", "Ordinary Differential Equation", "Differential equation with one independent variable.")],
  ["partial differential equation", def("engineering", "Partial Differential Equation", "Differential equation with partial derivatives.")],
  ["first order differential equation", def("engineering", "First Order Differential Equation", "Differential equation involving first derivatives.")],
  ["second order differential equation", def("engineering", "Second Order Differential Equation", "Differential equation involving second derivatives.")],
  ["boundary condition", def("engineering", "Boundary Condition", "Constraint supplied at a boundary.")],
  ["initial condition", def("engineering", "Initial Condition", "Starting value for a differential equation.")],
  ["bessel function", def("engineering", "Bessel Function", "Special function common in engineering models.")],
  ["legendre polynomial", def("engineering", "Legendre Polynomial", "Orthogonal polynomial used in engineering mathematics.")],
  ["taylor series", def("engineering", "Taylor Series", "Power series expansion around a point.")],
  ["maclaurin series", def("engineering", "Maclaurin Series", "Taylor series expanded around zero.")],
  ["power series", def("engineering", "Power Series", "Infinite polynomial-like expansion.")],
  ["numerical method", def("engineering", "Numerical Method", "Approximate computational solution technique.")],
  ["newton raphson", def("engineering", "Newton Raphson Method", "Iterative numerical root-finding method.")],
  ["bisection method", def("engineering", "Bisection Method", "Interval-based numerical root-finding method.")],
  ["runge kutta", def("engineering", "Runge Kutta Method", "Numerical method for differential equations.")],
  ["euler method", def("engineering", "Euler Method", "First-order numerical method for differential equations.")],
  ["standard deviation", def("statistics", "Standard Deviation", "Spread of data around the mean.")],
  ["sample variance", def("statistics", "Sample Variance", "Sample-based measure of spread.")],
  ["population variance", def("statistics", "Population Variance", "Population-based measure of spread.")],
  ["weighted average", def("statistics", "Weighted Average", "Average where values have different weights.")],
  ["weighted mean", def("statistics", "Weighted Mean", "Mean where values have assigned weights.")],
  ["frequency table", def("statistics", "Frequency Table", "Table showing how often each value appears.")],
  ["bar chart", def("statistics", "Bar Chart", "Categorical data visualization.")],
  ["pie chart", def("statistics", "Pie Chart", "Part-to-whole data visualization.")],
  ["scatter plot", def("statistics", "Scatter Plot", "Plot for paired numerical data.")],
  ["normal distribution", def("statistics", "Normal Distribution", "Bell-shaped probability distribution.")],
  ["z score", def("statistics", "Z Score", "Standardized distance from the mean.")],
  ["interquartile range", def("statistics", "Interquartile Range", "Spread between Q1 and Q3.")],
  ["conditional probability", def("probability", "Conditional Probability", "Probability of an event given another event.")],
  ["sample space", def("probability", "Sample Space", "Set of all possible outcomes.")],
  ["mutually exclusive", def("probability", "Mutually Exclusive", "Events that cannot happen together.")],
  ["expected value", def("probability", "Expected Value", "Long-run average value of a random variable.")],
  ["characteristic equation", def("matrix", "Characteristic Equation", "Polynomial equation used to find eigenvalues.")],
  ["identity matrix", def("matrix", "Identity Matrix", "Matrix equivalent of 1 under multiplication.")],
  ["zero matrix", def("matrix", "Zero Matrix", "Matrix with all entries zero.")],
  ["diagonal matrix", def("matrix", "Diagonal Matrix", "Matrix with nonzero entries only on the main diagonal.")],
  ["symmetric matrix", def("matrix", "Symmetric Matrix", "Matrix equal to its transpose.")],
  ["orthogonal matrix", def("matrix", "Orthogonal Matrix", "Matrix whose inverse equals its transpose.")],
  ["row reduction", def("matrix", "Row Reduction", "Matrix simplification using row operations.")],
  ["gaussian elimination", def("matrix", "Gaussian Elimination", "Row-reduction method for linear systems.")],
  ["gauss jordan", def("matrix", "Gauss Jordan", "Row-reduction method to reduced row echelon form.")],
  ["linear transformation", def("matrix", "Linear Transformation", "Function preserving vector addition and scalar multiplication.")],
  ["dot product", def("matrix", "Dot Product", "Scalar product of vectors.")],
  ["cross product", def("matrix", "Cross Product", "Vector product in three dimensions.")],
  ["real part", def("complex", "Real Part", "Real component of a complex number.")],
  ["imaginary part", def("complex", "Imaginary Part", "Imaginary component of a complex number.")],
  ["polar form", def("complex", "Polar Form", "Complex number written by modulus and argument.")],
  ["rectangular form", def("complex", "Rectangular Form", "Complex number written as a + bi.")],
  ["euler form", def("complex", "Euler Form", "Complex number written with exponential notation.")],
  ["truth table", def("discrete", "Truth Table", "Table listing logical outcomes.")],
  ["graph theory", def("discrete", "Graph Theory", "Discrete mathematics of vertices and edges.")],
  ["empty set", def("discrete", "Empty Set", "Set with no elements.")],
  ["null set", def("discrete", "Null Set", "Set with no elements.")],
  ["proper subset", def("discrete", "Proper Subset", "Subset that is not equal to the full set.")],
  ["simple interest", def("finance", "Simple Interest", "Interest computed on principal only.")],
  ["compound interest", def("finance", "Compound Interest", "Interest computed on principal plus accumulated interest.")],
  ["present value", def("finance", "Present Value", "Current worth of future money.")],
  ["future value", def("finance", "Future Value", "Future worth of money.")],
  ["more than", def("word-problem", "More Than", "Word-problem language for addition or comparison.")],
  ["less than", def("word-problem", "Less Than", "Word-problem language for subtraction or comparison.")],
  ["shared equally", def("word-problem", "Shared Equally", "Word-problem language for division.")],
  ["work done", def("word-problem", "Work Done", "Word-problem quantity often converted to an equation.")],
  ["age problem", def("word-problem", "Age Problem", "Common algebra word-problem pattern.")],
  ["profit and loss", def("word-problem", "Profit and Loss", "Business word-problem pattern.")],
  ["value of", def("algebra", "Value Of", "Instruction to evaluate an expression.")],
  ["find x", def("algebra", "Find x", "Instruction to solve for x.")],
  ["find y", def("algebra", "Find y", "Instruction to solve for y.")],
  ["square root", def("power-root", "Square Root", "Root operation inverse to squaring.")],
  ["cube root", def("power-root", "Cube Root", "Root operation inverse to cubing.")],
  ["nth root", def("power-root", "Nth Root", "General root operation.")],
  ["natural log", def("log-exp", "Natural Log", "Logarithm with base e.")],
  ["common log", def("log-exp", "Common Log", "Logarithm with base 10.")],
  ["unit circle", def("trigonometry", "Unit Circle", "Circle model for trigonometric functions.")],
  ["phase shift", def("trigonometry", "Phase Shift", "Horizontal shift of a trigonometric graph.")],
  ["section formula", def("coordinate-geometry", "Section Formula", "Formula for a point dividing a segment.")],
  ["surface area", def("geometry", "Surface Area", "Total area of a three-dimensional object's faces.")],
  ["similar triangles", def("geometry", "Similar Triangles", "Triangles with equal angles and proportional sides.")],
  ["pythagorean theorem", def("geometry", "Pythagorean Theorem", "Right-triangle relation a^2 + b^2 = c^2.")],
  ["degree celsius", def("unit", "Degree Celsius", "Temperature unit.")],
];

const wordDefinitions = new Map<string, TokenDefinition>([
  ["plus", def("arithmetic", "Addition", "Word for adding quantities.")],
  ["add", def("arithmetic", "Addition", "Instruction to add quantities.")],
  ["sum", def("arithmetic", "Sum", "Result of addition.")],
  ["total", def("arithmetic", "Total", "Combined amount.")],
  ["increase", def("arithmetic", "Increase", "Word for addition or growth.")],
  ["minus", def("arithmetic", "Subtraction", "Word for subtracting quantities.")],
  ["subtract", def("arithmetic", "Subtract", "Instruction to subtract.")],
  ["difference", def("arithmetic", "Difference", "Result of subtraction.")],
  ["decrease", def("arithmetic", "Decrease", "Word for subtraction or reduction.")],
  ["multiply", def("arithmetic", "Multiplication", "Instruction to multiply.")],
  ["times", def("arithmetic", "Multiplication", "Word for multiplication.")],
  ["product", def("arithmetic", "Product", "Result of multiplication.")],
  ["into", def("arithmetic", "Multiplication", "School notation word for multiplication.")],
  ["divide", def("arithmetic", "Division", "Instruction to divide.")],
  ["quotient", def("arithmetic", "Quotient", "Result of division.")],
  ["per", def("arithmetic", "Per", "Ratio or division word.")],
  ["ratio", def("arithmetic", "Ratio", "Comparison by division.")],
  ["solve", def("algebra", "Solve", "Find values that satisfy an equation.")],
  ["equation", def("algebra", "Equation", "Mathematical statement with equality.")],
  ["expression", def("algebra", "Expression", "Mathematical phrase without an equals sign.")],
  ["simplify", def("algebra", "Simplify", "Rewrite in a simpler equivalent form.")],
  ["reduce", def("algebra", "Reduce", "Simplify or lower to equivalent form.")],
  ["expand", def("algebra", "Expand", "Distribute products into sums.")],
  ["factor", def("algebra", "Factor", "Rewrite as a product.")],
  ["factorize", def("algebra", "Factorize", "Rewrite as a product.")],
  ["factorise", def("algebra", "Factorise", "Rewrite as a product.")],
  ["substitute", def("algebra", "Substitute", "Replace a variable with a value.")],
  ["evaluate", def("algebra", "Evaluate", "Compute a value.")],
  ["linear", def("algebra", "Linear", "Degree-one algebraic form.")],
  ["quadratic", def("algebra", "Quadratic", "Degree-two algebraic form.")],
  ["cubic", def("algebra", "Cubic", "Degree-three algebraic form.")],
  ["polynomial", def("algebra", "Polynomial", "Expression made of powers and coefficients.")],
  ["monomial", def("algebra", "Monomial", "Single-term algebraic expression.")],
  ["binomial", def("algebra", "Binomial", "Two-term algebraic expression.")],
  ["trinomial", def("algebra", "Trinomial", "Three-term algebraic expression.")],
  ["coefficient", def("algebra", "Coefficient", "Number multiplying a variable term.")],
  ["constant", def("algebra", "Constant Term", "Term without a variable.")],
  ["variable", def("algebra", "Variable", "Symbol representing an unknown or changing value.")],
  ["term", def("algebra", "Term", "Part of an expression separated by addition or subtraction.")],
  ["degree", def("algebra", "Degree", "Highest power in a polynomial context.")],
  ["zero", def("algebra", "Zero", "Root or solution where an expression equals zero.")],
  ["solution", def("algebra", "Solution", "Value satisfying a mathematical condition.")],
  ["intercept", def("coordinate-geometry", "Intercept", "Point where a graph crosses an axis.")],
  ["slope", def("coordinate-geometry", "Slope", "Rate of change of a line.")],
  ["gradient", def("calculus", "Gradient", "Vector or slope-like rate of change.")],
  ["square", def("power-root", "Square", "Power of 2.")],
  ["cube", def("power-root", "Cube", "Power of 3.")],
  ["power", def("power-root", "Power", "Exponent operation.")],
  ["exponent", def("power-root", "Exponent", "Power applied to a base.")],
  ["indices", def("power-root", "Indices", "Powers or exponents.")],
  ["index", def("power-root", "Index", "Power or root index.")],
  ["sqrt", def("power-root", "Square Root", "Root operation inverse to squaring.", "Use sqrt(number), for example sqrt(34).")],
  ["cbrt", def("power-root", "Cube Root", "Root operation inverse to cubing.")],
  ["root", def("power-root", "Root", "Value that produces a number when raised to a power.")],
  ["radical", def("power-root", "Radical", "Root notation or expression.")],
  ["sin", def("trigonometry", "Sine", "Trigonometric function.")],
  ["cos", def("trigonometry", "Cosine", "Trigonometric function.")],
  ["tan", def("trigonometry", "Tangent", "Trigonometric function.")],
  ["cot", def("trigonometry", "Cotangent", "Trigonometric function.")],
  ["sec", def("trigonometry", "Secant", "Trigonometric function.")],
  ["csc", def("trigonometry", "Cosecant", "Trigonometric function.")],
  ["asin", def("trigonometry", "Inverse Sine", "Inverse trigonometric function.")],
  ["acos", def("trigonometry", "Inverse Cosine", "Inverse trigonometric function.")],
  ["atan", def("trigonometry", "Inverse Tangent", "Inverse trigonometric function.")],
  ["arcsin", def("trigonometry", "Arc Sine", "Inverse trigonometric function.")],
  ["arccos", def("trigonometry", "Arc Cosine", "Inverse trigonometric function.")],
  ["arctan", def("trigonometry", "Arc Tangent", "Inverse trigonometric function.")],
  ["sinh", def("trigonometry", "Hyperbolic Sine", "Hyperbolic trigonometric function.")],
  ["cosh", def("trigonometry", "Hyperbolic Cosine", "Hyperbolic trigonometric function.")],
  ["tanh", def("trigonometry", "Hyperbolic Tangent", "Hyperbolic trigonometric function.")],
  ["sech", def("trigonometry", "Hyperbolic Secant", "Hyperbolic trigonometric function.")],
  ["csch", def("trigonometry", "Hyperbolic Cosecant", "Hyperbolic trigonometric function.")],
  ["coth", def("trigonometry", "Hyperbolic Cotangent", "Hyperbolic trigonometric function.")],
  ["trigonometry", def("trigonometry", "Trigonometry", "Study of angles and triangle ratios.")],
  ["angle", def("trigonometry", "Angle", "Measure of rotation between rays.")],
  ["degrees", def("trigonometry", "Degrees", "Angle unit.")],
  ["degree", def("trigonometry", "Degree", "Angle unit or polynomial degree depending on context.")],
  ["radian", def("trigonometry", "Radian", "Angle unit based on arc length.")],
  ["radians", def("trigonometry", "Radians", "Angle unit based on arc length.")],
  ["theta", def("trigonometry", "Theta", "Common angle variable.")],
  ["hypotenuse", def("geometry", "Hypotenuse", "Longest side of a right triangle.")],
  ["opposite", def("trigonometry", "Opposite Side", "Triangle side opposite an angle.")],
  ["adjacent", def("trigonometry", "Adjacent Side", "Triangle side next to an angle.")],
  ["sohcahtoa", def("trigonometry", "SOHCAHTOA", "Mnemonic for sine, cosine, and tangent ratios.")],
  ["identity", def("trigonometry", "Identity", "Equation true for all valid inputs.")],
  ["period", def("trigonometry", "Period", "Repeat length of a function.")],
  ["amplitude", def("trigonometry", "Amplitude", "Height scale of a periodic function.")],
  ["log", def("log-exp", "Common Logarithm", "Logarithm, usually base 10.")],
  ["log10", def("log-exp", "Base-10 Logarithm", "Logarithm with base 10.")],
  ["log2", def("log-exp", "Base-2 Logarithm", "Logarithm with base 2.")],
  ["ln", def("log-exp", "Natural Logarithm", "Logarithm with base e.")],
  ["exp", def("log-exp", "Exponential", "Exponential function.")],
  ["exponential", def("log-exp", "Exponential", "Growth or decay using powers.")],
  ["base", def("log-exp", "Base", "Reference number for a logarithm or exponent.")],
  ["antilog", def("log-exp", "Antilog", "Inverse operation of logarithm.")],
  ["growth", def("log-exp", "Growth", "Increasing exponential behavior.")],
  ["decay", def("log-exp", "Decay", "Decreasing exponential behavior.")],
  ["derivative", def("calculus", "Derivative", "Instantaneous rate of change.")],
  ["differentiate", def("calculus", "Differentiate", "Compute a derivative.")],
  ["differentiation", def("calculus", "Differentiation", "Process of finding derivatives.")],
  ["integral", def("calculus", "Integral", "Accumulation or antiderivative.")],
  ["integrate", def("calculus", "Integrate", "Compute an integral.")],
  ["integration", def("calculus", "Integration", "Process of finding integrals.")],
  ["dx", def("calculus", "Differential dx", "Differential with respect to x.")],
  ["dy", def("calculus", "Differential dy", "Differential with respect to y.")],
  ["limit", def("calculus", "Limit", "Value approached by an expression.")],
  ["lim", def("calculus", "Limit", "Limit notation.")],
  ["approaches", def("calculus", "Approaches", "Limit language.")],
  ["continuity", def("calculus", "Continuity", "Function behavior without breaks.")],
  ["continuous", def("calculus", "Continuous", "No breaks in the function over a domain.")],
  ["discontinuous", def("calculus", "Discontinuous", "Function has a break or jump.")],
  ["tangent", def("calculus", "Tangent", "Line touching a curve locally.")],
  ["normal", def("calculus", "Normal", "Line perpendicular to tangent.")],
  ["maxima", def("calculus", "Maxima", "Local or global high points.")],
  ["minima", def("calculus", "Minima", "Local or global low points.")],
  ["inflection", def("calculus", "Inflection", "Point where concavity changes.")],
  ["divergence", def("engineering", "Divergence", "Vector-calculus measure of outward flow.")],
  ["curl", def("engineering", "Curl", "Vector-calculus measure of rotation.")],
  ["laplacian", def("engineering", "Laplacian", "Second-order differential operator.")],
  ["jacobian", def("engineering", "Jacobian", "Matrix of first partial derivatives.")],
  ["hessian", def("engineering", "Hessian", "Matrix of second partial derivatives.")],
  ["point", def("coordinate-geometry", "Point", "Location in a coordinate plane or space.")],
  ["line", def("coordinate-geometry", "Line", "Straight one-dimensional object.")],
  ["distance", def("coordinate-geometry", "Distance", "Length between points.")],
  ["midpoint", def("coordinate-geometry", "Midpoint", "Point halfway between two points.")],
  ["circle", def("geometry", "Circle", "Set of points at a fixed radius.")],
  ["parabola", def("coordinate-geometry", "Parabola", "Conic section with quadratic shape.")],
  ["ellipse", def("coordinate-geometry", "Ellipse", "Oval conic section.")],
  ["hyperbola", def("coordinate-geometry", "Hyperbola", "Conic section with two branches.")],
  ["conic", def("coordinate-geometry", "Conic", "Curve from slicing a cone.")],
  ["radius", def("geometry", "Radius", "Distance from center to boundary.")],
  ["diameter", def("geometry", "Diameter", "Distance across a circle through center.")],
  ["center", def("coordinate-geometry", "Center", "Central point.")],
  ["centre", def("coordinate-geometry", "Centre", "Central point.")],
  ["vertex", def("coordinate-geometry", "Vertex", "Corner or turning point.")],
  ["focus", def("coordinate-geometry", "Focus", "Special point defining a conic.")],
  ["directrix", def("coordinate-geometry", "Directrix", "Line defining a conic.")],
  ["axis", def("coordinate-geometry", "Axis", "Reference line.")],
  ["triangle", def("geometry", "Triangle", "Three-sided polygon.")],
  ["rectangle", def("geometry", "Rectangle", "Four-sided polygon with right angles.")],
  ["polygon", def("geometry", "Polygon", "Closed shape with straight sides.")],
  ["area", def("geometry", "Area", "Two-dimensional measure inside a shape.")],
  ["perimeter", def("geometry", "Perimeter", "Distance around a shape.")],
  ["circumference", def("geometry", "Circumference", "Distance around a circle.")],
  ["volume", def("geometry", "Volume", "Three-dimensional measure.")],
  ["height", def("geometry", "Height", "Vertical or perpendicular length.")],
  ["side", def("geometry", "Side", "Line segment of a shape.")],
  ["base", def("geometry", "Base", "Reference side or bottom face.")],
  ["pythagoras", def("geometry", "Pythagoras", "Right-triangle theorem.")],
  ["congruence", def("geometry", "Congruence", "Same shape and size.")],
  ["mean", def("statistics", "Mean", "Arithmetic average.")],
  ["average", def("statistics", "Average", "Typical value, often the mean.")],
  ["median", def("statistics", "Median", "Middle value after sorting.")],
  ["mode", def("statistics", "Mode", "Most frequent value.")],
  ["range", def("statistics", "Range", "Maximum minus minimum.")],
  ["variance", def("statistics", "Variance", "Average squared deviation.")],
  ["std", def("statistics", "Standard Deviation", "Spread of data around the mean.")],
  ["quartile", def("statistics", "Quartile", "One of four data divisions.")],
  ["quartiles", def("statistics", "Quartiles", "Values dividing data into quarters.")],
  ["q1", def("statistics", "Q1", "First quartile.")],
  ["q2", def("statistics", "Q2", "Second quartile or median.")],
  ["q3", def("statistics", "Q3", "Third quartile.")],
  ["iqr", def("statistics", "IQR", "Interquartile range.")],
  ["frequency", def("statistics", "Frequency", "Count of occurrences.")],
  ["histogram", def("statistics", "Histogram", "Distribution visualization.")],
  ["probability", def("probability", "Probability", "Measure of chance.")],
  ["correlation", def("statistics", "Correlation", "Association between variables.")],
  ["regression", def("statistics", "Regression", "Modeling relationship between variables.")],
  ["percentile", def("statistics", "Percentile", "Relative position in data.")],
  ["event", def("probability", "Event", "Outcome or set of outcomes.")],
  ["outcome", def("probability", "Outcome", "Result of a probability experiment.")],
  ["union", def("probability", "Union", "Combined outcomes from sets or events.")],
  ["intersection", def("probability", "Intersection", "Common outcomes from sets or events.")],
  ["independent", def("probability", "Independent", "Events whose probabilities do not affect each other.")],
  ["dependent", def("probability", "Dependent", "Events whose probabilities affect each other.")],
  ["permutation", def("probability", "Permutation", "Ordered arrangement count.")],
  ["combination", def("probability", "Combination", "Unordered selection count.")],
  ["factorial", def("probability", "Factorial", "Product of positive integers up to n.")],
  ["ncr", def("probability", "Combination nCr", "Number of unordered selections.")],
  ["npr", def("probability", "Permutation nPr", "Number of ordered arrangements.")],
  ["matrix", def("matrix", "Matrix", "Rectangular array of values.")],
  ["matrices", def("matrix", "Matrices", "Rectangular arrays of values.")],
  ["determinant", def("matrix", "Determinant", "Scalar value describing a square matrix.")],
  ["det", def("matrix", "Determinant", "Short command for determinant.", "Use determinant [[1,2],[3,4]] for a 2x2 matrix.")],
  ["inverse", def("matrix", "Inverse", "Matrix that reverses multiplication.")],
  ["transpose", def("matrix", "Transpose", "Matrix flipped across its main diagonal.")],
  ["rank", def("matrix", "Rank", "Dimension of the matrix column or row space.")],
  ["trace", def("matrix", "Trace", "Sum of diagonal entries.")],
  ["eigenvalue", def("matrix", "Eigenvalue", "Scalar associated with a matrix-vector direction.")],
  ["eigenvector", def("matrix", "Eigenvector", "Vector whose direction is preserved by a matrix.")],
  ["rref", def("matrix", "RREF", "Reduced row echelon form.")],
  ["ref", def("matrix", "REF", "Row echelon form.")],
  ["vector", def("matrix", "Vector", "Quantity with components or direction.")],
  ["span", def("matrix", "Span", "Set of all linear combinations.")],
  ["basis", def("matrix", "Basis", "Independent vectors spanning a space.")],
  ["dimension", def("matrix", "Dimension", "Number of basis vectors.")],
  ["complex", def("complex", "Complex Number", "Number with real and imaginary parts.")],
  ["imaginary", def("complex", "Imaginary", "Component involving i.")],
  ["modulus", def("complex", "Modulus", "Magnitude of a complex number.")],
  ["argument", def("complex", "Argument", "Angle of a complex number.")],
  ["conjugate", def("complex", "Conjugate", "Complex number with opposite imaginary sign.")],
  ["arg", def("complex", "Argument", "Angle of a complex number.")],
  ["re", def("complex", "Real Part", "Real component of a complex number.")],
  ["im", def("complex", "Imaginary Part", "Imaginary component of a complex number.")],
  ["set", def("discrete", "Set", "Collection of objects.")],
  ["sets", def("discrete", "Sets", "Collections of objects.")],
  ["subset", def("discrete", "Subset", "Set contained in another set.")],
  ["superset", def("discrete", "Superset", "Set containing another set.")],
  ["cardinality", def("discrete", "Cardinality", "Number of elements in a set.")],
  ["logic", def("discrete", "Logic", "Rules of mathematical reasoning.")],
  ["proposition", def("discrete", "Proposition", "Statement with true or false value.")],
  ["and", def("discrete", "Logical And", "Connector true when both statements are true.")],
  ["or", def("discrete", "Logical Or", "Connector true when at least one statement is true.")],
  ["not", def("discrete", "Logical Not", "Negation of a statement.")],
  ["xor", def("discrete", "XOR", "Exclusive or.")],
  ["implies", def("discrete", "Implies", "Logical implication.")],
  ["equivalent", def("discrete", "Equivalent", "Same truth value.")],
  ["node", def("discrete", "Node", "Graph-theory vertex.")],
  ["edge", def("discrete", "Edge", "Graph-theory connection.")],
  ["tree", def("discrete", "Tree", "Connected acyclic graph.")],
  ["path", def("discrete", "Path", "Sequence of graph edges.")],
  ["cycle", def("discrete", "Cycle", "Closed graph path.")],
  ["ode", def("engineering", "ODE", "Ordinary differential equation.")],
  ["pde", def("engineering", "PDE", "Partial differential equation.")],
  ["homogeneous", def("engineering", "Homogeneous", "Equation or system with matching form or zero forcing.")],
  ["nonhomogeneous", def("engineering", "Non Homogeneous", "Equation with nonzero forcing term.")],
  ["non", def("engineering", "Non", "Part of engineering phrase such as non homogeneous.", "Try non homogeneous for clearer recognition.")],
  ["eigenfunction", def("engineering", "Eigenfunction", "Function preserved up to scalar under an operator.")],
  ["laplace", def("engineering", "Laplace Transform", "Engineering transform keyword.", "Try Laplace transform of sin(t).")],
  ["fourier", def("engineering", "Fourier", "Engineering frequency-analysis keyword.")],
  ["newton", def("engineering", "Newton Raphson", "Numerical method keyword.", "Try Newton Raphson method.")],
  ["raphson", def("engineering", "Raphson", "Part of Newton Raphson method.")],
  ["bisection", def("engineering", "Bisection", "Numerical root-finding method.")],
  ["runge", def("engineering", "Runge", "Part of Runge Kutta method.")],
  ["kutta", def("engineering", "Kutta", "Part of Runge Kutta method.")],
  ["meter", def("unit", "Meter", "Length unit.")],
  ["metre", def("unit", "Metre", "Length unit.")],
  ["cm", def("unit", "Centimeter", "Length unit.")],
  ["mm", def("unit", "Millimeter", "Length unit.")],
  ["km", def("unit", "Kilometer", "Length unit.")],
  ["inch", def("unit", "Inch", "Length unit.")],
  ["feet", def("unit", "Feet", "Length unit.")],
  ["kg", def("unit", "Kilogram", "Mass unit.")],
  ["gram", def("unit", "Gram", "Mass unit.")],
  ["second", def("unit", "Second", "Time unit.")],
  ["minute", def("unit", "Minute", "Time unit.")],
  ["hour", def("unit", "Hour", "Time unit.")],
  ["fahrenheit", def("unit", "Fahrenheit", "Temperature unit.")],
  ["kelvin", def("unit", "Kelvin", "Temperature unit.")],
  ["newton", def("unit", "Newton", "Force unit.")],
  ["joule", def("unit", "Joule", "Energy unit.")],
  ["watt", def("unit", "Watt", "Power unit.")],
  ["volt", def("unit", "Volt", "Voltage unit.")],
  ["ampere", def("unit", "Ampere", "Current unit.")],
  ["ohm", def("unit", "Ohm", "Resistance unit.")],
  ["principal", def("finance", "Principal", "Initial money amount.")],
  ["rate", def("finance", "Rate", "Percentage or rate value.")],
  ["time", def("word-problem", "Time", "Word-problem quantity.")],
  ["amount", def("finance", "Amount", "Final money amount.")],
  ["discount", def("finance", "Discount", "Price reduction.")],
  ["profit", def("finance", "Profit", "Gain from a transaction.")],
  ["loss", def("finance", "Loss", "Negative gain from a transaction.")],
  ["percentage", def("finance", "Percentage", "Per-hundred quantity.")],
  ["gst", def("finance", "GST", "Goods and services tax.")],
  ["vat", def("finance", "VAT", "Value added tax.")],
  ["tax", def("finance", "Tax", "Government charge.")],
  ["emi", def("finance", "EMI", "Equated monthly installment.")],
  ["annuity", def("finance", "Annuity", "Series of regular payments.")],
  ["twice", def("word-problem", "Twice", "Word-problem language for multiplying by 2.")],
  ["thrice", def("word-problem", "Thrice", "Word-problem language for multiplying by 3.")],
  ["half", def("word-problem", "Half", "Word-problem language for dividing by 2.")],
  ["remaining", def("word-problem", "Remaining", "Word-problem language after subtraction.")],
  ["speed", def("word-problem", "Speed", "Distance per time.")],
  ["train", def("word-problem", "Train", "Common motion word-problem context.", "Try converting the sentence into an equation first.")],
  ["travels", def("word-problem", "Travels", "Motion word-problem language.", "Use distance = speed * time when appropriate.")],
  ["distance", def("coordinate-geometry", "Distance", "Length between points or motion quantity.")],
  ["mixture", def("word-problem", "Mixture", "Word-problem pattern involving blended quantities.")],
  ["pipes", def("word-problem", "Pipes", "Pipes-and-cisterns word-problem language.")],
  ["cisterns", def("word-problem", "Cisterns", "Pipes-and-cisterns word-problem language.")],
  ["pi", def("constant", "Pi", "Circle constant approximately 3.14159.")],
  ["e", def("constant", "Euler's Number", "Natural exponential constant.")],
  ["i", def("constant", "Imaginary Unit", "Square root of -1.")],
  ["j", def("complex", "Imaginary Unit", "Engineering notation for the imaginary unit.")],
  ["infinity", def("constant", "Infinity", "Unbounded quantity.")],
]);

const symbolDefinitions = new Map<string, TokenDefinition>([
  ["+", def("arithmetic", "Addition", "Addition operator.")],
  ["-", def("arithmetic", "Subtraction", "Subtraction or negative sign.")],
  ["*", def("arithmetic", "Multiplication", "Multiplication operator.")],
  ["×", def("arithmetic", "Multiplication", "Multiplication operator.")],
  ["·", def("arithmetic", "Multiplication", "Dot multiplication operator.")],
  ["/", def("arithmetic", "Division", "Division operator.")],
  ["÷", def("arithmetic", "Division", "Division operator.")],
  ["%", def("arithmetic", "Percent", "Percentage or modulo operator.")],
  ["^", def("power-root", "Power", "Exponent operator.")],
  ["√", def("power-root", "Square Root", "Radical square-root symbol.")],
  ["∛", def("power-root", "Cube Root", "Radical cube-root symbol.")],
  ["=", def("relation", "Equality", "Equals relation.")],
  ["<", def("relation", "Less Than", "Less-than relation.")],
  [">", def("relation", "Greater Than", "Greater-than relation.")],
  ["<=", def("relation", "Less Than or Equal", "Inequality relation.")],
  [">=", def("relation", "Greater Than or Equal", "Inequality relation.")],
  ["≤", def("relation", "Less Than or Equal", "Inequality relation.")],
  ["≥", def("relation", "Greater Than or Equal", "Inequality relation.")],
  ["!=", def("relation", "Not Equal", "Inequality relation.")],
  ["≠", def("relation", "Not Equal", "Inequality relation.")],
  ["≈", def("relation", "Approximately Equal", "Approximate equality relation.")],
  ["∝", def("relation", "Proportional To", "Proportionality relation.")],
  ["->", def("relation", "Approaches", "Limit arrow notation.")],
  ["→", def("relation", "Approaches", "Limit arrow notation.")],
  ["∞", def("constant", "Infinity", "Unbounded quantity.")],
  ["π", def("constant", "Pi", "Circle constant approximately 3.14159.")],
  ["θ", def("trigonometry", "Theta", "Common angle variable.")],
  ["∂/∂x", def("calculus", "Partial Derivative", "Partial derivative with respect to x.")],
  ["d/dx", def("calculus", "Derivative Operator", "Derivative with respect to x.")],
  ["dy/dx", def("calculus", "Derivative Operator", "Derivative of y with respect to x.")],
  ["∂", def("calculus", "Partial Derivative Symbol", "Partial derivative symbol.")],
  ["∫", def("calculus", "Integral Symbol", "Integral notation.")],
  ["(", def("grouping", "Open Parenthesis", "Grouping symbol.")],
  [")", def("grouping", "Close Parenthesis", "Grouping symbol.")],
  ["[", def("grouping", "Open Bracket", "Grouping symbol.")],
  ["]", def("grouping", "Close Bracket", "Grouping symbol.")],
  ["{", def("grouping", "Open Brace", "Grouping symbol.")],
  ["}", def("grouping", "Close Brace", "Grouping symbol.")],
  ["|", def("grouping", "Absolute Value Bar", "Absolute-value or grouping bar.")],
  [",", def("grouping", "Separator", "Value separator.")],
  [";", def("grouping", "Equation Separator", "Separates equations or statements.")],
  ["!", def("probability", "Factorial", "Factorial operator.")],
  ["∈", def("discrete", "Element Of", "Set membership relation.")],
  ["∉", def("discrete", "Not Element Of", "Set membership negation.")],
  ["⊂", def("discrete", "Subset", "Proper subset relation.")],
  ["⊆", def("discrete", "Subset Or Equal", "Subset relation.")],
  ["⊃", def("discrete", "Superset", "Proper superset relation.")],
  ["⊇", def("discrete", "Superset Or Equal", "Superset relation.")],
  ["∪", def("discrete", "Union", "Set union.")],
  ["∩", def("discrete", "Intersection", "Set intersection.")],
  ["∅", def("discrete", "Empty Set", "Set with no elements.")],
  ["∀", def("discrete", "For All", "Universal quantifier.")],
  ["∃", def("discrete", "There Exists", "Existential quantifier.")],
  ["¬", def("discrete", "Not", "Logical negation.")],
  ["∧", def("discrete", "And", "Logical conjunction.")],
  ["∨", def("discrete", "Or", "Logical disjunction.")],
  ["⇒", def("discrete", "Implies", "Logical implication.")],
  ["⇔", def("discrete", "Equivalent", "Logical equivalence.")],
]);

const sortedPhrases = [...phraseDefinitions].sort((a, b) => b[0].length - a[0].length);
const sortedSymbols = [...symbolDefinitions.keys()].sort((a, b) => b.length - a.length);

export function recognizeMathKeywords(input: string): MathRecognizedToken[] {
  const tokens: MathRecognizedToken[] = [];
  let index = 0;

  while (index < input.length) {
    const char = input[index];
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    const phrase = matchPhrase(input, index);
    if (phrase) {
      tokens.push(createToken(input.slice(index, phrase.end), phrase.definition, index, phrase.end));
      index = phrase.end;
      continue;
    }

    const symbol = sortedSymbols.find((candidate) => input.startsWith(candidate, index));
    if (symbol) {
      const definition = symbolDefinitions.get(symbol);
      if (definition) tokens.push(createToken(symbol, definition, index, index + symbol.length));
      index += symbol.length;
      continue;
    }

    const number = matchNumber(input, index, tokens);
    if (number) {
      tokens.push(number);
      index = number.end;
      continue;
    }

    const word = matchWord(input, index);
    if (word) {
      tokens.push(createWordToken(word.text, index, word.end));
      index = word.end;
      continue;
    }

    tokens.push({
      text: char,
      normalized: char,
      category: "unknown",
      label: "Unrecognized Symbol",
      description: "This symbol is not yet recognized by the offline math tokenizer.",
      start: index,
      end: index + 1,
      confidence: "low",
      suggestion: "Try a clearer mathematical expression or supported notation.",
    });
    index += 1;
  }

  return tokens;
}

function matchPhrase(input: string, start: number) {
  const lower = input.slice(start).toLowerCase();
  for (const [phrase, definition] of sortedPhrases) {
    if (!lower.startsWith(phrase)) continue;
    const end = start + phrase.length;
    const beforeOk = start === 0 || !isWordCharacter(input[start - 1]);
    const afterOk = end >= input.length || !isWordCharacter(input[end]);
    if (beforeOk && afterOk) return { definition, end };
  }
  return null;
}

function matchNumber(input: string, start: number, tokens: MathRecognizedToken[]): MathRecognizedToken | null {
  const fragment = input.slice(start);
  const previous = tokens[tokens.length - 1];
  const canBeNegative = !previous || previous.category === "arithmetic" || previous.category === "relation" || previous.category === "grouping";
  const signPattern = canBeNegative ? "-?" : "";
  const match = fragment.match(new RegExp(`^${signPattern}(?:(?:\\d+\\.\\d+|\\d+|\\.\\d+)(?:e[+-]?\\d+)?)(?:/(?:\\d+\\.\\d+|\\d+|\\.\\d+)(?:e[+-]?\\d+)?)?%?`, "i"));
  if (!match) return null;

  const text = match[0];
  const label = text.endsWith("%") ? "Percentage" : text.includes("/") ? "Fraction" : /e[+-]?\d+/i.test(text) ? "Scientific Notation" : text.includes(".") ? "Decimal Number" : text.startsWith("-") ? "Negative Number" : "Number";
  return {
    text,
    normalized: text.toLowerCase(),
    category: "number",
    label,
    description: "Numeric value recognized by the offline tokenizer.",
    start,
    end: start + text.length,
    confidence: "high",
  };
}

function matchWord(input: string, start: number) {
  const fragment = input.slice(start);
  const match = fragment.match(/^[A-Za-z][A-Za-z0-9]*/);
  if (!match) return null;
  return { text: match[0], end: start + match[0].length };
}

function createWordToken(text: string, start: number, end: number): MathRecognizedToken {
  const normalized = text.toLowerCase();
  const definition = wordDefinitions.get(normalized);
  if (definition) return createToken(text, definition, start, end);

  if (/^[a-z](?:\d+)?$/i.test(text)) {
    return {
      text,
      normalized,
      category: "variable",
      label: text.length > 1 ? "Indexed Variable" : "Variable",
      description: "Symbol used as a variable or unknown.",
      start,
      end,
      confidence: "medium",
    };
  }

  return {
    text,
    normalized,
    category: "unknown",
    label: "Unknown Word",
    description: "This word is not currently mapped to a supported math keyword.",
    start,
    end,
    confidence: "low",
    suggestion: "Try a clearer mathematical expression or a supported command such as solve, simplify, derivative, integrate, mean, or determinant.",
  };
}

function createToken(text: string, definition: TokenDefinition, start: number, end: number): MathRecognizedToken {
  return {
    text,
    normalized: text.toLowerCase(),
    category: definition.category,
    label: definition.label,
    description: definition.description,
    start,
    end,
    confidence: definition.confidence ?? "high",
    suggestion: definition.suggestion,
  };
}

function isWordCharacter(value: string | undefined) {
  return Boolean(value && /[A-Za-z0-9]/.test(value));
}
