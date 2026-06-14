import type { MathKeywordDefinition, MathRecognitionLevel, MathTokenCategory } from "./mathRecognitionTypes";

function keyword(
  keywordText: string,
  category: MathTokenCategory,
  label: string,
  description: string,
  level: MathRecognitionLevel,
  aliases: string[] = [],
  examples: string[] = [],
  suggestion?: string,
): MathKeywordDefinition {
  return {
    aliases,
    category,
    description,
    examples,
    keyword: keywordText,
    label,
    level,
    normalized: normalizeKeyword(keywordText),
    suggestion,
  };
}

export function normalizeKeyword(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export const mathKeywordDefinitions: MathKeywordDefinition[] = [
  keyword("plus", "arithmetic", "Addition", "Word for adding quantities.", "school", ["add", "sum", "total", "increase"]),
  keyword("minus", "arithmetic", "Subtraction", "Word for subtracting quantities.", "school", ["subtract", "difference", "decrease"]),
  keyword("multiply", "arithmetic", "Multiplication", "Instruction to multiply.", "school", ["times", "product", "into"]),
  keyword("divide", "arithmetic", "Division", "Instruction to divide.", "school", ["quotient", "per", "ratio"]),
  keyword("percent", "arithmetic", "Percent Of", "Percentage operation.", "school", ["percentage", "percent of", "% of"]),
  keyword("gcd", "arithmetic", "Greatest Common Divisor", "Largest integer divisor shared by inputs.", "school", ["hcf", "greatest common divisor", "highest common factor"]),
  keyword("lcm", "arithmetic", "Least Common Multiple", "Smallest common multiple shared by inputs.", "school", ["least common multiple"]),
  keyword("minimum", "arithmetic", "Minimum", "Smallest value in a list.", "school", ["min", "smallest"]),
  keyword("maximum", "arithmetic", "Maximum", "Largest value in a list.", "school", ["max", "largest"]),
  keyword("factorial", "arithmetic", "Factorial", "Product of positive integers up to n.", "intermediate"),
  keyword("reciprocal", "arithmetic", "Reciprocal", "Multiplicative inverse of a number.", "school"),
  keyword("absolute value", "grouping", "Absolute Value", "Magnitude notation using vertical bars.", "school", ["floor", "ceil"]),
  keyword("solve", "algebra", "Solve", "Find values that satisfy an equation.", "school", ["equation", "expression", "find x", "find y"]),
  keyword("simplify", "algebra", "Simplify", "Rewrite in a simpler equivalent form.", "school", ["reduce", "evaluate", "value of", "substitute"]),
  keyword("factor", "algebra", "Factor", "Rewrite an expression as a product.", "intermediate", ["factorize", "factorise"]),
  keyword("expand", "algebra", "Expand", "Distribute products into sums.", "school"),
  keyword("linear", "algebra", "Linear", "Degree-one algebraic form.", "school"),
  keyword("quadratic", "algebra", "Quadratic", "Degree-two algebraic form.", "intermediate"),
  keyword("cubic", "algebra", "Cubic", "Degree-three algebraic form.", "intermediate"),
  keyword("polynomial", "algebra", "Polynomial", "Expression made of powers and coefficients.", "intermediate", ["monomial", "binomial", "trinomial"]),
  keyword("coefficient", "algebra", "Coefficient", "Number multiplying a variable term.", "school", ["constant", "variable", "term", "degree", "root", "zero", "solution"]),
  keyword("sqrt", "power-root", "Square Root", "Root operation inverse to squaring.", "school", ["square root"], ["sqrt(34)"], "Use sqrt(number), for example sqrt(34)."),
  keyword("cbrt", "power-root", "Cube Root", "Root operation inverse to cubing.", "school", ["cube root"]),
  keyword("root", "power-root", "Root", "Value that produces a number when raised to a power.", "school", ["nth root", "radical"]),
  keyword("square", "power-root", "Square", "Power of 2.", "school", ["cube", "power", "exponent", "indices", "index"]),
  keyword("sin", "trigonometry", "Sine", "Trigonometric function.", "intermediate"),
  keyword("cos", "trigonometry", "Cosine", "Trigonometric function.", "intermediate"),
  keyword("tan", "trigonometry", "Tangent", "Trigonometric function.", "intermediate"),
  keyword("cot", "trigonometry", "Cotangent", "Trigonometric function.", "intermediate", ["sec", "csc"]),
  keyword("asin", "trigonometry", "Inverse Sine", "Inverse trigonometric function.", "intermediate", ["acos", "atan", "arcsin", "arccos", "arctan"]),
  keyword("sinh", "trigonometry", "Hyperbolic Sine", "Hyperbolic trigonometric function.", "intermediate", ["cosh", "tanh", "sech", "csch", "coth"]),
  keyword("trigonometry", "trigonometry", "Trigonometry", "Study of angles and triangle ratios.", "intermediate", ["angle", "degree", "degrees", "radian", "radians", "theta", "SOHCAHTOA", "unit circle", "period", "amplitude", "phase shift"]),
  keyword("log", "log-exp", "Common Logarithm", "Logarithm, usually base 10.", "intermediate", ["log10", "common log"]),
  keyword("ln", "log-exp", "Natural Logarithm", "Logarithm with base e.", "intermediate", ["natural log"]),
  keyword("exp", "log-exp", "Exponential", "Exponential function.", "intermediate", ["log2", "exponential", "antilog", "growth", "decay"]),
  keyword("derivative", "calculus", "Derivative", "Instantaneous rate of change.", "intermediate", ["differentiate", "differentiation", "d/dx", "dy/dx"]),
  keyword("integral", "calculus", "Integral", "Accumulation or antiderivative.", "intermediate", ["integrate", "integration", "dx", "dy"]),
  keyword("limit", "calculus", "Limit", "Value approached by an expression.", "intermediate", ["lim", "approaches", "tends to"]),
  keyword("continuity", "calculus", "Continuity", "Function behavior without breaks.", "intermediate", ["continuous", "discontinuous", "tangent", "normal", "rate of change", "maxima", "minima", "critical point", "inflection", "area under curve"]),
  keyword("point", "coordinate-geometry", "Point", "Location in a coordinate plane or space.", "school", ["line", "slope", "gradient", "distance", "midpoint", "section formula", "intercept"]),
  keyword("conic", "coordinate-geometry", "Conic", "Curve from slicing a cone.", "intermediate", ["parabola", "ellipse", "hyperbola", "vertex", "focus", "directrix", "axis"]),
  keyword("circle", "geometry", "Circle", "Set of points at a fixed radius.", "school", ["radius", "diameter", "center", "centre", "circumference"]),
  keyword("triangle", "geometry", "Triangle", "Three-sided polygon.", "school", ["square", "rectangle", "polygon", "angle", "area", "perimeter", "volume", "surface area", "height", "base", "side", "hypotenuse", "Pythagoras", "pythagorean theorem", "similar triangles", "congruence"]),
  keyword("mean", "statistics", "Mean", "Arithmetic average.", "school", ["average"]),
  keyword("median", "statistics", "Median", "Middle value after sorting.", "school"),
  keyword("mode", "statistics", "Mode", "Most frequent value.", "school"),
  keyword("variance", "statistics", "Variance", "Average squared deviation.", "intermediate", ["sample variance", "population variance"]),
  keyword("standard deviation", "statistics", "Standard Deviation", "Spread of data around the mean.", "intermediate", ["std"]),
  keyword("quartile", "statistics", "Quartile", "One of four data divisions.", "intermediate", ["quartiles", "Q1", "Q2", "Q3", "IQR", "interquartile range"]),
  keyword("frequency", "statistics", "Frequency", "Count of occurrences.", "school", ["frequency table", "histogram", "bar chart", "pie chart"]),
  keyword("correlation", "statistics", "Correlation", "Association between variables.", "intermediate", ["regression", "scatter plot", "normal distribution", "z score", "percentile", "weighted mean", "weighted average"]),
  keyword("probability", "probability", "Probability", "Measure of chance.", "intermediate", ["event", "sample space", "outcome", "union", "intersection", "conditional probability", "independent", "dependent", "mutually exclusive", "permutation", "combination", "factorial", "nCr", "nPr", "expected value"]),
  keyword("matrix", "matrix", "Matrix", "Rectangular array of values.", "intermediate", ["matrices"]),
  keyword("determinant", "matrix", "Determinant", "Scalar value describing a square matrix.", "intermediate", ["det"], ["determinant [[1,2],[3,4]]"], "Use determinant [[1,2],[3,4]] for a 2x2 matrix."),
  keyword("inverse", "matrix", "Inverse", "Matrix that reverses multiplication.", "intermediate", ["transpose", "rank", "trace", "rref", "REF"]),
  keyword("eigenvalue", "matrix", "Eigenvalue", "Scalar associated with a matrix-vector direction.", "engineering", ["eigenvector", "characteristic equation"]),
  keyword("linear transformation", "matrix", "Linear Transformation", "Function preserving vector addition and scalar multiplication.", "engineering", ["vector", "dot product", "cross product", "span", "basis", "dimension", "row reduction", "Gaussian elimination", "Gauss Jordan"]),
  keyword("complex", "complex", "Complex Number", "Number with real and imaginary parts.", "intermediate", ["imaginary", "real part", "imaginary part", "modulus", "argument", "conjugate", "polar form", "rectangular form", "Euler form", "Re", "Im", "arg"]),
  keyword("set", "discrete", "Set", "Collection of objects.", "intermediate", ["sets", "subset", "proper subset", "superset", "empty set", "null set", "cardinality"]),
  keyword("logic", "discrete", "Logic", "Rules of mathematical reasoning.", "intermediate", ["proposition", "truth table", "and", "or", "not", "xor", "implies", "equivalent"]),
  keyword("graph theory", "discrete", "Graph Theory", "Discrete mathematics of vertices and edges.", "engineering", ["node", "vertex", "edge", "tree", "path", "cycle"]),
  keyword("Laplace transform", "engineering", "Laplace Transform", "Engineering transform for differential equations and systems.", "engineering", ["Laplace"], ["Laplace transform of sin(t)"], "Full transform solving may be a future feature."),
  keyword("Fourier series", "engineering", "Fourier Series", "Engineering representation using sine and cosine terms.", "engineering", ["Fourier transform", "Fourier"]),
  keyword("differential equation", "engineering", "Differential Equation", "Equation involving derivatives.", "engineering", ["ordinary differential equation", "ODE", "partial differential equation", "PDE", "first order differential equation", "second order differential equation", "homogeneous", "non homogeneous", "boundary condition", "initial condition"]),
  keyword("numerical method", "engineering", "Numerical Method", "Approximate computational solution technique.", "engineering", ["Newton Raphson", "bisection method", "Runge Kutta", "Euler method"]),
  keyword("special function", "engineering", "Special Function", "Engineering special-function topic.", "engineering", ["eigenfunction", "Bessel function", "Legendre polynomial", "Taylor series", "Maclaurin series", "power series"]),
  keyword("vector calculus", "engineering", "Vector Calculus", "Engineering calculus topic.", "engineering", ["partial derivative", "gradient", "divergence", "curl", "laplacian", "jacobian", "hessian", "line integral", "surface integral", "multiple integral", "double integral", "triple integral"]),
  keyword("meter", "unit", "Meter", "Length unit.", "school", ["metre", "cm", "mm", "km", "inch", "feet"]),
  keyword("kilogram", "unit", "Kilogram", "Mass unit.", "school", ["kg", "gram"]),
  keyword("second", "unit", "Second", "Time unit.", "school", ["minute", "hour"]),
  keyword("engineering unit", "unit", "Engineering Unit", "Physical measurement unit.", "intermediate", ["m/s", "km/h", "degree Celsius", "Fahrenheit", "Kelvin", "radian", "newton", "joule", "watt", "volt", "ampere", "ohm"]),
  keyword("simple interest", "finance", "Simple Interest", "Interest computed on principal only.", "school", ["compound interest", "principal", "rate", "amount", "discount", "profit", "loss", "percentage", "GST", "VAT", "tax", "EMI", "present value", "future value", "annuity"]),
  keyword("word problem", "word-problem", "Word Problem", "Natural-language math problem.", "school", ["more than", "less than", "twice", "thrice", "half", "one third", "shared equally", "total", "remaining", "speed", "time", "work done", "pipes and cisterns", "age problem", "mixture", "profit and loss", "train", "travels"], [], "Try converting the sentence into an equation first."),
  keyword("pi", "constant", "Pi", "Circle constant approximately 3.14159.", "school", ["π"]),
  keyword("e", "constant", "Euler's Number", "Natural exponential constant.", "intermediate"),
  keyword("i", "constant", "Imaginary Unit", "Square root of -1.", "intermediate", ["j", "infinity"]),
];

export const symbolDefinitions: MathKeywordDefinition[] = [
  keyword("+", "arithmetic", "Addition", "Addition operator.", "school"),
  keyword("-", "arithmetic", "Subtraction", "Subtraction or negative sign.", "school"),
  keyword("*", "arithmetic", "Multiplication", "Multiplication operator.", "school", ["×", "·"]),
  keyword("/", "arithmetic", "Division", "Division operator.", "school", ["÷"]),
  keyword("%", "arithmetic", "Percent", "Percentage or modulo operator.", "school"),
  keyword("^", "power-root", "Power", "Exponent operator.", "school"),
  keyword("√", "power-root", "Square Root", "Radical square-root symbol.", "school"),
  keyword("∛", "power-root", "Cube Root", "Radical cube-root symbol.", "school"),
  keyword("=", "relation", "Equality", "Equals relation.", "school"),
  keyword("<", "relation", "Less Than", "Less-than relation.", "school"),
  keyword(">", "relation", "Greater Than", "Greater-than relation.", "school"),
  keyword("<=", "relation", "Less Than or Equal", "Inequality relation.", "school", ["≤"]),
  keyword(">=", "relation", "Greater Than or Equal", "Inequality relation.", "school", ["≥"]),
  keyword("!=", "relation", "Not Equal", "Inequality relation.", "school", ["≠"]),
  keyword("≈", "relation", "Approximately Equal", "Approximate equality relation.", "school"),
  keyword("->", "relation", "Approaches", "Limit arrow notation.", "intermediate", ["→"]),
  keyword("∝", "relation", "Proportional To", "Proportionality relation.", "intermediate"),
  keyword("(", "grouping", "Open Parenthesis", "Grouping symbol.", "school"),
  keyword(")", "grouping", "Close Parenthesis", "Grouping symbol.", "school"),
  keyword("[", "grouping", "Open Bracket", "Grouping symbol.", "school"),
  keyword("]", "grouping", "Close Bracket", "Grouping symbol.", "school"),
  keyword("{", "grouping", "Open Brace", "Grouping symbol.", "school"),
  keyword("}", "grouping", "Close Brace", "Grouping symbol.", "school"),
  keyword("|", "grouping", "Absolute Value Bar", "Absolute-value or grouping bar.", "school"),
  keyword(",", "grouping", "Separator", "Value separator.", "school"),
  keyword(";", "grouping", "Equation Separator", "Separates equations or statements.", "school"),
  keyword("∫", "calculus", "Integral Symbol", "Integral notation.", "intermediate"),
  keyword("∂", "calculus", "Partial Derivative Symbol", "Partial derivative symbol.", "engineering"),
  keyword("∞", "constant", "Infinity", "Unbounded quantity.", "intermediate"),
  keyword("θ", "trigonometry", "Theta", "Common angle variable.", "intermediate"),
  keyword("!", "probability", "Factorial", "Factorial operator.", "intermediate"),
  keyword("∈", "discrete", "Element Of", "Set membership relation.", "intermediate"),
  keyword("∉", "discrete", "Not Element Of", "Set membership negation.", "intermediate"),
  keyword("⊂", "discrete", "Subset", "Proper subset relation.", "intermediate"),
  keyword("⊆", "discrete", "Subset Or Equal", "Subset relation.", "intermediate"),
  keyword("∪", "discrete", "Union", "Set union.", "intermediate"),
  keyword("∩", "discrete", "Intersection", "Set intersection.", "intermediate"),
  keyword("∅", "discrete", "Empty Set", "Set with no elements.", "intermediate"),
  keyword("∀", "discrete", "For All", "Universal quantifier.", "engineering"),
  keyword("∃", "discrete", "There Exists", "Existential quantifier.", "engineering"),
  keyword("¬", "discrete", "Not", "Logical negation.", "intermediate"),
  keyword("∧", "discrete", "And", "Logical conjunction.", "intermediate"),
  keyword("∨", "discrete", "Or", "Logical disjunction.", "intermediate"),
  keyword("⇒", "discrete", "Implies", "Logical implication.", "intermediate"),
  keyword("⇔", "discrete", "Equivalent", "Logical equivalence.", "intermediate"),
];

export const keywordLookup = buildLookup(mathKeywordDefinitions);
export const symbolLookup = buildLookup(symbolDefinitions);

export const phraseKeywords = [...keywordLookup.keys()]
  .filter((keywordText) => keywordText.includes(" ") || keywordText.includes("/"))
  .sort((a, b) => b.length - a.length);

export const symbolKeywords = [...symbolLookup.keys()].sort((a, b) => b.length - a.length);

function buildLookup(definitions: MathKeywordDefinition[]) {
  const lookup = new Map<string, MathKeywordDefinition>();
  for (const definition of definitions) {
    lookup.set(definition.normalized, definition);
    for (const alias of definition.aliases ?? []) {
      lookup.set(normalizeKeyword(alias), {
        ...definition,
        keyword: alias,
        normalized: normalizeKeyword(alias),
      });
    }
  }
  return lookup;
}
