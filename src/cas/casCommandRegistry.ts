export type CasCommandCategory =
  | "Algebra"
  | "Calculus"
  | "Equation Solving"
  | "Linear Algebra"
  | "Lists And Data"
  | "Number Theory"
  | "Probability"
  | "Statistics"
  | "Notebook";

export type CasCommandSupport = "implemented" | "partial" | "planned";

export type CasCommandEngine = "symbolic" | "workspace" | "notebook" | "planned";

export type CasCommandSpec = {
  name: string;
  aliases: string[];
  category: CasCommandCategory;
  signature: string;
  description: string;
  examples: string[];
  support: CasCommandSupport;
  engine: CasCommandEngine;
  outputKind: "expression" | "equation-set" | "matrix" | "list" | "number" | "text";
};

export type CasArgumentRange = {
  min: number;
  max: number | null;
  label: string;
};

const specs: CasCommandSpec[] = [
  implemented("Simplify", "Algebra", "Simplify[expression]", "Simplify an exact expression.", ["Simplify[2*x+x]"], ["Reduce", "Collect"], "expression"),
  implemented("Factor", "Algebra", "Factor[expression]", "Factor a supported algebraic expression.", ["Factor[x^2-5*x+6]"], ["Factorize", "Factorise"], "expression"),
  implemented("Expand", "Algebra", "Expand[expression]", "Expand products and powers.", ["Expand[(x+2)(x+3)]"], ["MultiplyOut", "Distribute"], "expression"),
  implemented("Substitute", "Algebra", "Substitute[expression, variable=value]", "Substitute values and simplify.", ["Substitute[x^2+a, a=3]"], ["Replace", "EvaluateAt"], "expression"),
  implemented("PartialFractions", "Algebra", "PartialFractions[rational expression]", "Decompose rational expressions where supported.", ["PartialFractions[(3*x+5)/((x+1)(x+2))]"], ["Apart", "PartialFraction"], "expression"),
  implemented("PolynomialDivide", "Algebra", "PolynomialDivide[dividend, divisor, variable?]", "Divide polynomials and return quotient/remainder.", ["PolynomialDivide[x^3-1, x-1]"], ["Divide", "Division", "LongDivision"], "expression"),
  implemented("Rationalize", "Algebra", "Rationalize[expression]", "Rewrite expressions with rationalized denominators.", ["Rationalize[1/sqrt(2)]"], ["Rationalise"], "expression"),
  implemented("CompleteSquare", "Algebra", "CompleteSquare[quadratic]", "Rewrite a quadratic in completed-square form.", ["CompleteSquare[x^2-6*x+5]"], ["CompleteTheSquare"], "expression"),
  implemented("Coefficients", "Algebra", "Coefficients[polynomial]", "Return polynomial coefficients.", ["Coefficients[3*x^2+2*x+1]"], ["Coeff"], "list"),
  implemented("Degree", "Algebra", "Degree[polynomial]", "Return polynomial degree.", ["Degree[3*x^4+x]"], [], "number"),
  implemented("Numerator", "Algebra", "Numerator[expression]", "Return the numerator of a rational expression.", ["Numerator[(x+1)/(x-2)]"], [], "expression"),
  implemented("Denominator", "Algebra", "Denominator[expression]", "Return the denominator of a rational expression.", ["Denominator[(x+1)/(x-2)]"], [], "expression"),
  implemented("CommonDenominator", "Algebra", "CommonDenominator[expression]", "Rewrite a rational sum over a common denominator.", ["CommonDenominator[1/(x+1)+1/(x+2)]"], ["Together"], "expression"),
  implemented("Polynomial", "Algebra", "Polynomial[roots...]", "Build a monic polynomial from roots.", ["Polynomial[1,2,3]"], [], "expression"),
  implemented("LeftSide", "Algebra", "LeftSide[equation]", "Return the left side of an equation.", ["LeftSide[x+1=3]"], ["LHS"], "expression"),
  implemented("RightSide", "Algebra", "RightSide[equation]", "Return the right side of an equation.", ["RightSide[x+1=3]"], ["RHS"], "expression"),

  implemented("Solve", "Equation Solving", "Solve[equation, variable?]", "Solve equations exactly where possible with verification.", ["Solve[x^2-5*x+6=0]"], ["Solutions"], "equation-set"),
  implemented("Root", "Equation Solving", "Root[polynomial, variable?]", "Return real roots of a polynomial or equation.", ["Root[x^2-5*x+6]"], [], "list"),
  implemented("RootList", "Equation Solving", "RootList[polynomial, variable?]", "Return roots as graph-ready points.", ["RootList[x^2-5*x+6]"], [], "list"),
  implemented("SolveCubic", "Equation Solving", "SolveCubic[equation, variable?]", "Solve a cubic equation.", ["SolveCubic[x^3-6*x^2+11*x-6=0]"], [], "equation-set"),
  implemented("SolveQuartic", "Equation Solving", "SolveQuartic[equation, variable?]", "Solve a quartic equation.", ["SolveQuartic[x^4-5*x^2+4=0]"], [], "equation-set"),
  implemented("SolveSystem", "Equation Solving", "SolveSystem[equation1, equation2, ...]", "Solve simultaneous equations where supported.", ["SolveSystem[x+y=5, x-y=1]"], ["System", "Simultaneous"], "equation-set"),
  implemented("NSolve", "Equation Solving", "NSolve[equation, variable?]", "Return numerical solutions.", ["NSolve[cos(x)=x]"], ["NSolutions"], "equation-set"),
  implemented("CSolve", "Equation Solving", "CSolve[equation, variable?]", "Solve over complex numbers.", ["CSolve[x^2+1=0]"], ["CSolutions"], "equation-set"),
  implemented("CFactor", "Equation Solving", "CFactor[expression, variable?]", "Factor over the complex symbolic domain where supported.", ["CFactor[x^2+1]"], ["CIFactor", "IFactor"], "expression"),
  implemented("ComplexRoot", "Equation Solving", "ComplexRoot[polynomial, variable?]", "Return complex roots of a polynomial or equation.", ["ComplexRoot[x^2+1]"], [], "list"),
  implemented("SolveInequality", "Equation Solving", "SolveInequality[inequality]", "Solve inequalities and return intervals.", ["SolveInequality[x^2<4]"], ["InequalitySolve"], "equation-set"),
  implemented("Eliminate", "Equation Solving", "Eliminate[equations, variables]", "Eliminate variables from a system.", ["Eliminate[x+y=5, x-y=1, y]"], [], "equation-set"),
  implemented("PlotSolve", "Equation Solving", "PlotSolve[equation, variable?]", "Numerically solve for graph intersections or roots.", ["PlotSolve[cos(x)=x]"], [], "equation-set"),

  implemented("Derivative", "Calculus", "Derivative[function, variable?]", "Differentiate symbolically.", ["Derivative[x^3-2*x]"], ["Diff", "Differentiate"], "expression"),
  implemented("Integral", "Calculus", "Integral[function, variable?]", "Find an antiderivative where supported.", ["Integral[3*x^2]"], ["Integrate", "Antiderivative", "IntegralSymbolic"], "expression"),
  implemented("DefiniteIntegral", "Calculus", "DefiniteIntegral[function, lower, upper, variable?]", "Compute an exact definite integral where supported.", ["DefiniteIntegral[x^2, 0, 2, x]"], ["IntegralBetween"], "number"),
  implemented("Limit", "Calculus", "Limit[function, variable, value]", "Compute exact limits where supported.", ["Limit[sin(x)/x, x, 0]"], ["Lim"], "expression"),
  implemented("TangentLine", "Calculus", "TangentLine[function, point, variable?]", "Find the tangent line at a point.", ["TangentLine[x^2, 3, x]"], ["Tangent"], "expression"),
  implemented("VerifyIdentity", "Calculus", "VerifyIdentity[left, right, variable?]", "Verify identities exactly or by numeric sampling.", ["VerifyIdentity[tan(x), sin(x)/cos(x), x]"], ["IdentityCheck", "Verify"], "text"),
  implemented("LimitAbove", "Calculus", "LimitAbove[function, variable, value]", "Compute a right-hand limit.", ["LimitAbove[1/x, x, 0]"], [], "expression"),
  implemented("LimitBelow", "Calculus", "LimitBelow[function, variable, value]", "Compute a left-hand limit.", ["LimitBelow[1/x, x, 0]"], [], "expression"),
  implemented("NIntegral", "Calculus", "NIntegral[function, lower, upper, variable?]", "Compute numerical integrals.", ["NIntegral[sin(x), 0, pi, x]"], [], "number"),
  implemented("ImplicitDerivative", "Calculus", "ImplicitDerivative[equation, variable, dependent]", "Differentiate implicit relations.", ["ImplicitDerivative[x^2+y^2=1, x, y]"], [], "expression"),
  implemented("TaylorPolynomial", "Calculus", "TaylorPolynomial[function, variable, center, order]", "Build a Taylor polynomial.", ["TaylorPolynomial[sin(x), x, 0, 5]"], ["Series"], "expression"),
  implemented("SolveODE", "Calculus", "SolveODE[equation]", "Solve supported ordinary differential equations.", ["SolveODE[y'=y]"], [], "equation-set"),
  implemented("Laplace", "Calculus", "Laplace[function, variable, target]", "Compute a Laplace transform.", ["Laplace[sin(t), t, s]"], [], "expression"),
  implemented("InverseLaplace", "Calculus", "InverseLaplace[function, variable, target]", "Compute an inverse Laplace transform.", ["InverseLaplace[1/(s^2+1), s, t]"], [], "expression"),

  implemented("Matrix", "Linear Algebra", "Matrix[[row1],[row2]]", "Create or summarize a matrix.", ["Matrix[[1,2],[3,4]]"], ["Mat"], "matrix"),
  implemented("Determinant", "Linear Algebra", "Determinant[matrix]", "Compute a determinant.", ["Determinant[[1,2],[3,4]]"], ["Det"], "number"),
  implemented("Transpose", "Linear Algebra", "Transpose[matrix]", "Transpose a matrix.", ["Transpose[[1,2],[3,4]]"], ["Trans"], "matrix"),
  implemented("Inverse", "Linear Algebra", "Inverse[matrix]", "Invert a supported square matrix.", ["Inverse[[1,2],[3,4]]"], ["Inv", "Invert"], "matrix"),
  implemented("MatrixAdd", "Linear Algebra", "MatrixAdd[matrixA, matrixB]", "Add two matrices of the same size.", ["MatrixAdd[[[1,2],[3,4]], [[5,6],[7,8]]]"], ["MatrixPlus"], "matrix"),
  implemented("MatrixSubtract", "Linear Algebra", "MatrixSubtract[matrixA, matrixB]", "Subtract two matrices of the same size.", ["MatrixSubtract[[[5,6],[7,8]], [[1,2],[3,4]]]"], ["MatrixMinus"], "matrix"),
  implemented("MatrixMultiply", "Linear Algebra", "MatrixMultiply[matrixA, matrixB]", "Multiply compatible matrices.", ["MatrixMultiply[[[1,2],[3,4]], [[5,6],[7,8]]]"], ["MatrixProduct"], "matrix"),
  implemented("ScalarMultiply", "Linear Algebra", "ScalarMultiply[k, matrix]", "Multiply every matrix entry by a scalar.", ["ScalarMultiply[2, [[1,2],[3,4]]]"], [], "matrix"),
  implemented("Trace", "Linear Algebra", "Trace[matrix]", "Return the trace of a square matrix.", ["Trace[[1,2],[3,4]]"], [], "number"),
  implemented("IdentityMatrix", "Linear Algebra", "IdentityMatrix[n]", "Return the n by n identity matrix.", ["IdentityMatrix[3]"], ["Identity"], "matrix"),
  implemented("CofactorMatrix", "Linear Algebra", "CofactorMatrix[matrix]", "Return the cofactor matrix.", ["CofactorMatrix[[1,2],[3,4]]"], ["Cofactors"], "matrix"),
  implemented("AdjointMatrix", "Linear Algebra", "AdjointMatrix[matrix]", "Return the adjoint matrix.", ["AdjointMatrix[[1,2],[3,4]]"], ["Adjugate"], "matrix"),
  implemented("RREF", "Linear Algebra", "RREF[matrix]", "Return reduced row-echelon form.", ["RREF[[1,2,3],[4,5,6]]"], ["RowReduce", "ReducedRowEchelonForm"], "matrix"),
  implemented("MatrixRank", "Linear Algebra", "MatrixRank[matrix]", "Return matrix rank.", ["MatrixRank[[1,2],[2,4]]"], ["Rank"], "number"),
  implemented("Dimension", "Linear Algebra", "Dimension[matrixOrVector]", "Return matrix dimensions or vector length.", ["Dimension[[1,2],[3,4]]"], ["Dimensions"], "list"),
  implemented("CharacteristicPolynomial", "Linear Algebra", "CharacteristicPolynomial[matrix]", "Return det(lambda I - A).", ["CharacteristicPolynomial[[1,2],[3,4]]"], ["CharPoly"], "expression"),
  implemented("LUDecomposition", "Linear Algebra", "LUDecomposition[matrix]", "Return an LU decomposition for a square matrix.", ["LUDecomposition[[4,3],[6,3]]"], ["LU"], "text"),
  implemented("QRDecomposition", "Linear Algebra", "QRDecomposition[matrix]", "Return a QR decomposition by Gram-Schmidt.", ["QRDecomposition[[1,1],[1,0]]"], ["QR"], "text"),
  implemented("SVD", "Linear Algebra", "SVD[matrix]", "Return singular values and a compact 2x2 SVD summary.", ["SVD[[3,0],[0,2]]"], [], "text"),
  implemented("JordanDiagonalization", "Linear Algebra", "JordanDiagonalization[matrix]", "Return a 2x2 diagonalization/Jordan summary where supported.", ["JordanDiagonalization[[2,0],[0,3]]"], ["Jordan"], "text"),
  implemented("MinimalPolynomial", "Linear Algebra", "MinimalPolynomial[matrix]", "Return a compact minimal polynomial for supported matrices.", ["MinimalPolynomial[[2,0],[0,3]]"], [], "expression"),
  implemented("Eigenvalues", "Linear Algebra", "Eigenvalues[matrix]", "Return real 2x2 eigenvalues.", ["Eigenvalues[[2,0],[0,3]]"], [], "list"),
  implemented("Eigenvectors", "Linear Algebra", "Eigenvectors[matrix]", "Return real 2x2 eigenvectors.", ["Eigenvectors[[2,0],[0,3]]"], [], "list"),
  implemented("Magnitude", "Linear Algebra", "Magnitude[vector]", "Return vector magnitude.", ["Magnitude[(3,4)]"], ["Norm", "Length"], "number"),
  implemented("UnitVector", "Linear Algebra", "UnitVector[vector]", "Return a unit vector in the same direction.", ["UnitVector[(3,4)]"], ["NormalizeVector"], "list"),
  implemented("VectorAdd", "Linear Algebra", "VectorAdd[vectorA, vectorB]", "Add vectors componentwise.", ["VectorAdd[(1,2),(3,4)]"], [], "list"),
  implemented("VectorSubtract", "Linear Algebra", "VectorSubtract[vectorA, vectorB]", "Subtract vectors componentwise.", ["VectorSubtract[(3,4),(1,2)]"], [], "list"),
  implemented("VectorScale", "Linear Algebra", "VectorScale[k, vector]", "Scale a vector.", ["VectorScale[2,(3,4)]"], [], "list"),
  implemented("Projection", "Linear Algebra", "Projection[vector, ontoVector]", "Project one 2D vector onto another.", ["Projection[(3,4),(1,0)]"], ["Project"], "list"),
  implemented("PerpendicularVector", "Linear Algebra", "PerpendicularVector[vector]", "Return a 2D perpendicular vector.", ["PerpendicularVector[(3,4)]"], [], "list"),
  implemented("UnitPerpendicularVector", "Linear Algebra", "UnitPerpendicularVector[vector]", "Return a unit 2D perpendicular vector.", ["UnitPerpendicularVector[(3,4)]"], [], "list"),
  implemented("Dot", "Linear Algebra", "Dot[vector1, vector2]", "Compute a dot product.", ["Dot[(1,2),(3,4)]"], [], "number"),
  implemented("Cross", "Linear Algebra", "Cross[vector1, vector2]", "Compute a 3D cross product.", ["Cross[(1,0,0),(0,1,0)]"], [], "list"),

  implemented("List", "Lists And Data", "List[a, b, c]", "Create or summarize a numeric list.", ["List[2, 4, 4, 9]"], [], "list"),
  implemented("Sum", "Lists And Data", "Sum[list]", "Return the sum of numeric values.", ["Sum[2,4,4,9]"], [], "number"),
  implemented("Product", "Lists And Data", "Product[list]", "Return the product of numeric values.", ["Product[2,4,5]"], [], "number"),
  implemented("Element", "Lists And Data", "Element[list, index]", "Return an element using 1-based indexing.", ["Element[[10,20,30],2]"], [], "text"),
  implemented("First", "Lists And Data", "First[list, count?]", "Return the first item or first n items.", ["First[[10,20,30],2]"], [], "list"),
  implemented("Last", "Lists And Data", "Last[list, count?]", "Return the last item or last n items.", ["Last[[10,20,30],2]"], [], "list"),
  implemented("Take", "Lists And Data", "Take[list, start, end?]", "Return a 1-based slice of a list.", ["Take[[10,20,30,40],2,3]"], [], "list"),
  implemented("Delete", "Lists And Data", "Delete[list, index]", "Delete a 1-based list item.", ["Delete[[10,20,30],2]"], [], "list"),
  implemented("Unique", "Lists And Data", "Unique[list]", "Return unique list items in first-seen order.", ["Unique[[2,3,2,5]]"], [], "list"),
  implemented("Shuffle", "Lists And Data", "Shuffle[list, seed?]", "Shuffle a list, optionally reproducible by seed.", ["Shuffle[[1,2,3,4],42]"], [], "list"),
  implemented("Sample", "Lists And Data", "Sample[list, count, seed?]", "Sample list items without replacement.", ["Sample[[1,2,3,4],2,42]"], [], "list"),
  implemented("Sequence", "Lists And Data", "Sequence[expression, variable, start, end, step?]", "Generate a numeric sequence.", ["Sequence[n^2,n,1,4]"], [], "list"),
  implemented("Min", "Lists And Data", "Min[list]", "Return the minimum value.", ["Min[2,4,4,9]"], ["Minimum"], "number"),
  implemented("Max", "Lists And Data", "Max[list]", "Return the maximum value.", ["Max[2,4,4,9]"], ["Maximum"], "number"),
  implemented("Range", "Statistics", "Range[list]", "Return max - min.", ["Range[2,4,4,9]"], [], "number"),
  implemented("Mean", "Statistics", "Mean[list]", "Return the mean of data.", ["Mean[2,4,4,9]"], ["Average"], "number"),
  implemented("Median", "Statistics", "Median[list]", "Return the median of data.", ["Median[2,4,4,9]"], [], "number"),
  implemented("Mode", "Statistics", "Mode[list]", "Return the modal value or values.", ["Mode[2,3,3,5]"], [], "list"),
  implemented("FrequencyTable", "Statistics", "FrequencyTable[list]", "Return value-frequency pairs.", ["FrequencyTable[2,3,3,5]"], ["Frequency"], "list"),
  implemented("Variance", "Statistics", "Variance[list]", "Return population variance.", ["Variance[2,4,4,9]"], [], "number"),
  implemented("SampleVariance", "Statistics", "SampleVariance[list]", "Return sample variance using n-1.", ["SampleVariance[2,4,4,9]"], ["VarianceSample"], "number"),
  implemented("StandardDeviation", "Statistics", "StandardDeviation[list]", "Return population standard deviation.", ["StandardDeviation[2,4,4,9]"], ["Stdev", "SD"], "number"),
  implemented("SampleStandardDeviation", "Statistics", "SampleStandardDeviation[list]", "Return sample standard deviation using n-1.", ["SampleStandardDeviation[2,4,4,9]"], ["StdevSample"], "number"),
  implemented("Quartiles", "Statistics", "Quartiles[list]", "Return Q1, median, and Q3.", ["Quartiles[2,4,4,9,10]"], ["Q1Q3"], "list"),
  implemented("Percentile", "Statistics", "Percentile[list, p]", "Return percentile using linear interpolation.", ["Percentile[2,4,4,9,10,0.75]"], [], "number"),
  implemented("Covariance", "Statistics", "Covariance[xList, yList]", "Return population covariance of paired data.", ["Covariance[[1,2,3],[2,4,6]]"], [], "number"),
  implemented("FitPoly", "Statistics", "FitPoly[points, degree]", "Fit a polynomial model to points.", ["FitPoly[[[1,2],[2,5],[3,10]],2]"], [], "expression"),
  implemented("FitExp", "Statistics", "FitExp[points]", "Fit y=a*e^(b*x) to positive-y points.", ["FitExp[[[1,2],[2,4],[3,8]]]"], [], "expression"),
  implemented("FitLog", "Statistics", "FitLog[points]", "Fit y=a+b*ln(x) to positive-x points.", ["FitLog[[[1,2],[2,3],[4,4]]]"], [], "expression"),
  implemented("FitPow", "Statistics", "FitPow[points]", "Fit y=a*x^b to positive points.", ["FitPow[[[1,2],[2,8],[3,18]]]"], [], "expression"),
  implemented("FitSin", "Statistics", "FitSin[points]", "Fit a simple sinusoid y=a*sin(b*x+c)+d.", ["FitSin[[[0,0],[1,1],[2,0]]]"], [], "expression"),
  implemented("Normal", "Probability", "Normal[mean, sd, x]", "Evaluate normal CDF P(X <= x).", ["Normal[0,1,1.96]"], ["NormalDist"], "number"),
  implemented("NormalPDF", "Probability", "NormalPDF[mean, sd, x]", "Evaluate normal density at x.", ["NormalPDF[0,1,0]"], [], "number"),
  implemented("NormalBetween", "Probability", "NormalBetween[mean, sd, lower, upper]", "Evaluate P(lower <= X <= upper).", ["NormalBetween[0,1,-1,1]"], ["NormalCDF"], "number"),
  implemented("BinomialDist", "Probability", "BinomialDist[n, p, k]", "Evaluate binomial probabilities.", ["BinomialDist[10, 0.5, 3]"], ["Binomial"], "number"),
  implemented("BinomialCdf", "Probability", "BinomialCdf[n, p, k]", "Evaluate P(X <= k) for a binomial random variable.", ["BinomialCdf[10,0.5,3]"], ["BinomialCDF"], "number"),
  implemented("Poisson", "Probability", "Poisson[mean, k, cumulative?]", "Evaluate Poisson probability or cumulative probability.", ["Poisson[3,2]", "Poisson[3,2,true]"], [], "number"),
  implemented("Exponential", "Probability", "Exponential[lambda, x]", "Evaluate exponential distribution CDF P(X <= x).", ["Exponential[2,1]"], [], "number"),
  implemented("Gamma", "Probability", "Gamma[shape, scale, x]", "Evaluate gamma distribution CDF P(X <= x).", ["Gamma[2,3,4]"], [], "number"),
  implemented("ChiSquared", "Probability", "ChiSquared[df, x]", "Evaluate chi-square distribution CDF P(X <= x).", ["ChiSquared[4,5]"], [], "number"),
  implemented("TDistribution", "Probability", "TDistribution[df, x]", "Evaluate Student t distribution CDF P(T <= x).", ["TDistribution[10,1.5]"], ["T"], "number"),
  implemented("FDistribution", "Probability", "FDistribution[df1, df2, x]", "Evaluate F distribution CDF P(F <= x).", ["FDistribution[5,10,2]"], [], "number"),
  implemented("Cauchy", "Probability", "Cauchy[median, scale, x]", "Evaluate Cauchy distribution CDF.", ["Cauchy[0,1,0]"], [], "number"),
  implemented("HyperGeometric", "Probability", "HyperGeometric[population, successes, draws, k]", "Evaluate hypergeometric probability.", ["HyperGeometric[20,7,5,2]"], [], "number"),
  implemented("Pascal", "Probability", "Pascal[r, p, k]", "Evaluate negative-binomial/Pascal probability.", ["Pascal[3,0.5,5]"], [], "number"),
  implemented("Weibull", "Probability", "Weibull[shape, scale, x]", "Evaluate Weibull distribution CDF.", ["Weibull[2,3,4]"], [], "number"),
  implemented("Zipf", "Probability", "Zipf[n, exponent, k]", "Evaluate finite Zipf probability.", ["Zipf[10,1.2,3]"], [], "number"),
  implemented("RandomBetween", "Probability", "RandomBetween[min, max, seed?]", "Return a random integer between min and max, optionally reproducible by seed.", ["RandomBetween[1,6,42]"], [], "number"),
  implemented("RandomUniform", "Probability", "RandomUniform[min, max, count?, seed?]", "Return one or more uniform random values.", ["RandomUniform[0,1,3,42]"], [], "list"),
  implemented("RandomNormal", "Probability", "RandomNormal[mean, sd, count?, seed?]", "Return one or more normal random values.", ["RandomNormal[0,1,3,42]"], [], "list"),
  implemented("RandomBinomial", "Probability", "RandomBinomial[n, p, count?, seed?]", "Return one or more binomial random values.", ["RandomBinomial[10,0.5,5,42]"], [], "list"),
  implemented("RandomPoisson", "Probability", "RandomPoisson[mean, count?, seed?]", "Return one or more Poisson random values.", ["RandomPoisson[3,5,42]"], [], "list"),
  implemented("RandomElement", "Probability", "RandomElement[list..., seed?]", "Pick a random element from a list, optionally reproducible by seed.", ["RandomElement[red,blue,green,42]"], [], "text"),
  implemented("RandomPolynomial", "Probability", "RandomPolynomial[degree, minCoeff, maxCoeff, seed?]", "Generate a random polynomial with integer coefficients.", ["RandomPolynomial[3,-5,5,42]"], [], "expression"),

  implemented("GCD", "Number Theory", "GCD[a, b, ...]", "Return greatest common divisor.", ["GCD[84, 30]"], ["HCF"], "number"),
  implemented("LCM", "Number Theory", "LCM[a, b, ...]", "Return least common multiple.", ["LCM[12, 18]"], [], "number"),
  implemented("IsPrime", "Number Theory", "IsPrime[n]", "Test primality.", ["IsPrime[97]"], [], "text"),
  implemented("PrimeFactors", "Number Theory", "PrimeFactors[n]", "Return prime factorization.", ["PrimeFactors[360]"], [], "list"),
  implemented("Divisors", "Number Theory", "Divisors[n]", "Return positive divisors of n.", ["Divisors[28]"], ["Factors", "DivisorsList"], "list"),
  implemented("DivisorsSum", "Number Theory", "DivisorsSum[n]", "Return the sum of positive divisors of n.", ["DivisorsSum[28]"], [], "number"),
  implemented("ExtendedGCD", "Number Theory", "ExtendedGCD[a,b]", "Return gcd and Bezout coefficients.", ["ExtendedGCD[84,30]"], [], "list"),
  implemented("NextPrime", "Number Theory", "NextPrime[n]", "Return the next prime greater than n.", ["NextPrime[100]"], [], "number"),
  implemented("PreviousPrime", "Number Theory", "PreviousPrime[n]", "Return the previous prime less than n.", ["PreviousPrime[100]"], ["PrevPrime"], "number"),
  implemented("Mod", "Number Theory", "Mod[a, n]", "Return remainder modulo n.", ["Mod[17, 5]"], ["Div"], "number"),
  implemented("ModularExponent", "Number Theory", "ModularExponent[base, exponent, modulus]", "Return base^exponent mod modulus.", ["ModularExponent[3,13,7]"], [], "number"),
  implemented("MixedNumber", "Number Theory", "MixedNumber[value]", "Convert an improper fraction or decimal into mixed-number form.", ["MixedNumber[17/5]"], [], "text"),
  implemented("Factorial", "Number Theory", "Factorial[n]", "Return n factorial.", ["Factorial[6]"], ["Fact"], "number"),
  implemented("BinomialCoefficient", "Number Theory", "BinomialCoefficient[n, r]", "Return n choose r.", ["BinomialCoefficient[10, 3]"], ["NCr", "Choose"], "number"),

  implemented("ToComplex", "Algebra", "ToComplex[value]", "Convert a point or ordered pair to a+bi form.", ["ToComplex[(3,4)]"], [], "expression"),
  implemented("ToPolar", "Algebra", "ToPolar[complex]", "Convert a complex number to polar coordinates.", ["ToPolar[3+4i]"], [], "list"),
  implemented("ToExponential", "Algebra", "ToExponential[complex]", "Convert a complex number to r*e^(i theta) form.", ["ToExponential[3+4i]"], [], "expression"),
  implemented("ToPoint", "Algebra", "ToPoint[complex]", "Convert a complex number to point coordinates.", ["ToPoint[3+4i]"], [], "list"),
  implemented("GroebnerLex", "Algebra", "GroebnerLex[polynomial1, polynomial2, ...]", "Return a limited lexicographic Groebner-style basis for linear/quadratic systems.", ["GroebnerLex[x+y-3,x-y-1]"], ["GroebnerDegRevLex", "GroebnerLexDeg"], "list"),
  implemented("Intersect", "Algebra", "Intersect[equation1, equation2]", "Find intersection points for two supported equations.", ["Intersect[y=x,y=2*x-1]"], [], "list"),

  implemented("Assume", "Notebook", "Assume[condition]", "Record an assumption for following CAS rows.", ["Assume[x real]"], ["Assumption"], "text"),
  implemented("Evaluate", "Notebook", "Evaluate[expression]", "Evaluate through the exact CAS pipeline.", ["Evaluate[x+x]"], [], "expression"),
  implemented("Numeric", "Notebook", "Numeric[expression]", "Attach a numeric approximation when available.", ["Numeric[sqrt(34)]"], ["Approximate"], "number"),
  implemented("KeepInput", "Notebook", "KeepInput[expression]", "Store the input without transforming it.", ["KeepInput[(x+1)^2]"], [], "text"),
];

export const casCommandCatalog = specs;

export function resolveCasCommandSpec(name: string) {
  const compact = normalizeName(name);
  return specs.find((spec) => [spec.name, ...spec.aliases].some((alias) => normalizeName(alias) === compact));
}

export function normalizeCasCommandName(name: string) {
  return resolveCasCommandSpec(name)?.name ?? null;
}

export function suggestCasCommands(query: string, limit = 3) {
  const normalized = normalizeName(query);
  if (!normalized) return [];
  const scored = specs
    .map((spec) => {
      const names = [spec.name, ...spec.aliases];
      const bestDistance = Math.min(...names.map((name) => levenshtein(normalizeName(name), normalized)));
      const prefixBoost = names.some((name) => normalizeName(name).startsWith(normalized)) ? -2 : 0;
      return { spec, score: bestDistance + prefixBoost };
    })
    .filter((item) => item.score <= Math.max(2, Math.ceil(normalized.length / 3)))
    .sort((a, b) => a.score - b.score || a.spec.name.localeCompare(b.spec.name));
  return scored.slice(0, limit).map((item) => item.spec);
}

export function casCommandArgumentRange(commandName: string): CasArgumentRange | null {
  const spec = resolveCasCommandSpec(commandName);
  if (!spec) return null;
  const override = arityOverrides[spec.name];
  if (override) return override;
  return rangeFromSignature(spec.signature);
}

export function validateCasCommandArguments(commandName: string, args: string[]) {
  const spec = resolveCasCommandSpec(commandName);
  const range = spec ? casCommandArgumentRange(spec.name) : null;
  if (!spec || !range) return { errors: [] as string[], warnings: [] as string[] };

  const errors: string[] = [];
  const warnings: string[] = [];
  if (args.length < range.min) {
    errors.push(`${spec.name} expects ${range.label}; received ${args.length}. Example: ${spec.examples[0]}.`);
  }
  if (range.max !== null && args.length > range.max) {
    errors.push(`${spec.name} expects ${range.label}; received ${args.length}. Example: ${spec.examples[0]}.`);
  }
  if (args.some((arg) => !arg.trim())) warnings.push(`${spec.name} has an empty argument; check commas and brackets.`);
  return { errors, warnings };
}

export function searchCasCommands(query: string, limit = 12) {
  const normalized = query.trim().toLowerCase();
  const scored = specs
    .map((spec) => ({ spec, score: commandSearchScore(spec, normalized) }))
    .filter((item) => !normalized || item.score > 0)
    .sort((a, b) => b.score - a.score || a.spec.name.localeCompare(b.spec.name));
  return scored.slice(0, limit).map((item) => item.spec);
}

export function casCommandRegistrySummary() {
  const bySupport = countBy(specs, (spec) => spec.support);
  const byCategory = specs.reduce<Record<CasCommandCategory, { total: number; implemented: number; partial: number; planned: number }>>((summary, spec) => {
    summary[spec.category] ??= { total: 0, implemented: 0, partial: 0, planned: 0 };
    summary[spec.category].total += 1;
    summary[spec.category][spec.support] += 1;
    return summary;
  }, {} as Record<CasCommandCategory, { total: number; implemented: number; partial: number; planned: number }>);

  return {
    total: specs.length,
    implemented: bySupport.implemented ?? 0,
    partial: bySupport.partial ?? 0,
    planned: bySupport.planned ?? 0,
    byCategory,
  };
}

function implemented(name: string, category: CasCommandCategory, signature: string, description: string, examples: string[], aliases: string[], outputKind: CasCommandSpec["outputKind"]): CasCommandSpec {
  return { name, aliases, category, signature, description, examples, support: "implemented", engine: "symbolic", outputKind };
}

function partial(name: string, category: CasCommandCategory, signature: string, description: string, examples: string[], aliases: string[], engine: CasCommandEngine, outputKind: CasCommandSpec["outputKind"]): CasCommandSpec {
  return { name, aliases, category, signature, description, examples, support: "partial", engine, outputKind };
}

function planned(name: string, category: CasCommandCategory, signature: string, description: string, examples: string[], aliases: string[], outputKind: CasCommandSpec["outputKind"]): CasCommandSpec {
  return { name, aliases, category, signature, description, examples, support: "planned", engine: "planned", outputKind };
}

function commandSearchScore(spec: CasCommandSpec, query: string) {
  if (!query) return 1;
  const haystack = [spec.name, spec.category, spec.signature, spec.description, ...spec.aliases, ...spec.examples].join(" ").toLowerCase();
  if (spec.name.toLowerCase() === query) return 100;
  if (spec.name.toLowerCase().startsWith(query)) return 80;
  if (spec.aliases.some((alias) => alias.toLowerCase() === query)) return 70;
  if (haystack.includes(query)) return 20;
  return 0;
}

const arityOverrides: Record<string, CasArgumentRange> = {
  Matrix: { min: 1, max: null, label: "one or more matrix rows" },
  Determinant: { min: 1, max: null, label: "a matrix" },
  Transpose: { min: 1, max: null, label: "a matrix" },
  Inverse: { min: 1, max: null, label: "a matrix" },
  Trace: { min: 1, max: null, label: "a matrix" },
  CofactorMatrix: { min: 1, max: null, label: "a matrix" },
  AdjointMatrix: { min: 1, max: null, label: "a matrix" },
  RREF: { min: 1, max: null, label: "a matrix" },
  MatrixRank: { min: 1, max: null, label: "a matrix" },
  Dimension: { min: 1, max: null, label: "a matrix or vector" },
  Eigenvalues: { min: 1, max: null, label: "a matrix" },
  Eigenvectors: { min: 1, max: null, label: "a matrix" },
  CharacteristicPolynomial: { min: 1, max: null, label: "a matrix" },
  LUDecomposition: { min: 1, max: null, label: "a matrix" },
  QRDecomposition: { min: 1, max: null, label: "a matrix" },
  SVD: { min: 1, max: null, label: "a matrix" },
  JordanDiagonalization: { min: 1, max: null, label: "a matrix" },
  MinimalPolynomial: { min: 1, max: null, label: "a matrix" },
  SolveSystem: { min: 2, max: null, label: "at least two equations" },
  Eliminate: { min: 3, max: null, label: "equations followed by a variable" },
  Substitute: { min: 2, max: null, label: "an expression and at least one assignment" },
  GCD: { min: 2, max: null, label: "at least two integers" },
  LCM: { min: 2, max: null, label: "at least two integers" },
  List: { min: 1, max: null, label: "one or more values" },
  Sum: { min: 1, max: null, label: "one or more values" },
  Product: { min: 1, max: null, label: "one or more values" },
  Polynomial: { min: 1, max: null, label: "one or more roots" },
  Sequence: { min: 4, max: 5, label: "an expression, variable, start, end, and optional step" },
  GroebnerLex: { min: 1, max: null, label: "one or more polynomial generators" },
  Min: { min: 1, max: null, label: "one or more values" },
  Max: { min: 1, max: null, label: "one or more values" },
  Range: { min: 1, max: null, label: "one or more values" },
  Mean: { min: 1, max: null, label: "one or more values" },
  Median: { min: 1, max: null, label: "one or more values" },
  Mode: { min: 1, max: null, label: "one or more values" },
  FrequencyTable: { min: 1, max: null, label: "one or more values" },
  Variance: { min: 1, max: null, label: "one or more values" },
  SampleVariance: { min: 2, max: null, label: "at least two values" },
  StandardDeviation: { min: 1, max: null, label: "one or more values" },
  SampleStandardDeviation: { min: 2, max: null, label: "at least two values" },
  Quartiles: { min: 1, max: null, label: "one or more values" },
  Percentile: { min: 2, max: null, label: "values followed by a percentile p" },
};

function rangeFromSignature(signature: string): CasArgumentRange | null {
  const match = signature.match(/\[(.*)\]/);
  if (!match) return null;
  const raw = match[1].trim();
  if (!raw) return { min: 0, max: 0, label: "no arguments" };
  const pieces = splitSignatureArguments(raw);
  const variadic = pieces.some((piece) => piece.includes("..."));
  const required = pieces.filter((piece) => !piece.includes("...") && !piece.trim().endsWith("?")).length;
  const max = variadic ? null : pieces.length;
  return {
    min: required,
    max,
    label: max === null ? `${required} or more arguments` : required === max ? `${required} argument${required === 1 ? "" : "s"}` : `${required} to ${max} arguments`,
  };
}

function splitSignatureArguments(value: string) {
  const args: string[] = [];
  let current = "";
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "[" || char === "(" || char === "{") depth += 1;
    if (char === "]" || char === ")" || char === "}") depth -= 1;
    if (char === "," && depth === 0) {
      args.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function levenshtein(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let last = i - 1;
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const old = previous[j];
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, last + (a[i - 1] === b[j - 1] ? 0 : 1));
      last = old;
    }
  }
  return previous[b.length];
}

function countBy<T extends string>(items: CasCommandSpec[], key: (item: CasCommandSpec) => T) {
  return items.reduce<Record<T, number>>((counts, item) => {
    const value = key(item);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/[\s_-]+/g, "");
}
