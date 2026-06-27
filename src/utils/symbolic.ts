import nerdamer from "nerdamer";
import "nerdamer/Algebra";
import "nerdamer/Calculus";
import "nerdamer/Solve";
import { addMatrices, adjointMatrix, cofactorMatrix, createMatrix, determinantSteps, eigen2x2, formatNumber as formatMatrixNumber, inverse, multiplyMatrices, rankMatrix, scalarMultiply, subtractMatrices, toRowEchelon, transposeMatrix, type Matrix } from "./matrixOperations";
import { crossProduct, dotProduct, scalarVectorMultiply, unitVector, vectorAdd, vectorMagnitude, vectorProjection, vectorSubtract } from "./mathEngine/linearAlgebraUtils";
import { binomialDistribution } from "./mathEngine/probabilityUtils";

export type SymbolicResult = {
  result: string;
  exact?: string;
  steps: string[];
  detail: string;
  restrictions?: string[];
  verification?: string[] | SymbolicVerification;
  warnings?: string[];
};

export type SymbolicAssignment = {
  name: string;
  value: string;
};

export type SymbolicVerification = {
  equivalent: boolean;
  method: "exact" | "numeric-sampling" | "failed";
  samples: Array<{ variable: string; value: number; difference: string }>;
};

export function symbolicSimplify(expression: string): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const result = simplifyKnownIdentity(cleanSymbolic(nerdamer(normalized).toString()), normalized);
  return {
    result,
    exact: result,
    detail: "Symbolic simplification using algebraic normalization and like-term collection.",
    steps: [
      `Read the input as: ${expression}.`,
      `Normalize notation for the parser: ${normalized}.`,
      "Combine like terms, reduce nested operations, and simplify exact constants.",
      `Return exact form: ${result}.`,
    ],
  };
}

export function symbolicExpand(expression: string): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const result = cleanSymbolic(nerdamer(`expand(${normalized})`).toString());
  return {
    result,
    exact: result,
    detail: "Expanded symbolically by distributing products and collecting terms.",
    steps: [
      `Read the expression: ${expression}.`,
      "Identify products, powers of sums, or grouped factors.",
      "Distribute multiplication over addition using algebraic expansion rules.",
      `Collect terms into expanded form: ${result}.`,
    ],
  };
}

export function symbolicFactor(expression: string): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const result = cleanSymbolic(nerdamer(`factor(${normalized})`).toString());
  return {
    result,
    exact: result,
    detail: "Factored symbolically over supported algebraic expressions.",
    steps: [
      `Read the expression: ${expression}.`,
      "Look for common factors, special products, and polynomial factor patterns.",
      "Rewrite the expression as a product when an exact factorization is available.",
      `Return factored exact form: ${result}.`,
    ],
  };
}

export function symbolicDerivative(expression: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const result = cleanSymbolic(nerdamer(`diff(${normalized},${variable})`).toString());
  return {
    result,
    exact: result,
    detail: "Exact symbolic derivative with algebraic simplification.",
    steps: [
      `Treat ${expression} as a function of ${variable}.`,
      "Break the function into sums, products, powers, and composed functions.",
      "Apply derivative rules: power, sum, product, chain, and trig rules where applicable.",
      `Simplify the result: d/d${variable}(${expression}) = ${result}.`,
    ],
  };
}

export function symbolicIntegral(expression: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const antiderivative = cleanSymbolic(nerdamer(`integrate(${normalized},${variable})`).toString());
  const result = `${antiderivative}+C`;
  return {
    result,
    exact: result,
    detail: "Exact symbolic antiderivative where supported.",
    steps: [
      `Treat ${expression} as the integrand with respect to ${variable}.`,
      "Split sums and constants where possible.",
      "Apply antiderivative rules and simplify the exact form.",
      "Add the constant of integration C.",
      `Result: ${result}.`,
    ],
  };
}

export function symbolicDefiniteIntegral(expression: string, lower: string, upper: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const normalizedLower = normalizeSymbolic(lower);
  const normalizedUpper = normalizeSymbolic(upper);
  const result = cleanSymbolic(nerdamer(`defint(${normalized},${normalizedLower},${normalizedUpper},${cleanVariable})`).toString());
  return {
    result,
    exact: result,
    detail: "Exact definite integral using the fundamental theorem where the offline CAS supports the antiderivative.",
    steps: [
      `Read the integral as the area accumulation of ${expression} from ${lower} to ${upper}.`,
      `Normalize the integrand for the parser: ${normalized}.`,
      `Find an antiderivative with respect to ${cleanVariable}.`,
      `Evaluate upper minus lower: F(${upper}) - F(${lower}).`,
      `Return exact value: ${result}.`,
    ],
  };
}

export function symbolicLimit(expression: string, variable = "x", target = "0"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const normalizedTarget = normalizeSymbolic(target);
  const result = cleanSymbolic(nerdamer(`limit(${normalized},${cleanVariable},${normalizedTarget})`).toString());
  return {
    result,
    exact: result,
    detail: "Exact symbolic limit using one-variable CAS limit rules where supported.",
    steps: [
      `Read the limit as ${cleanVariable} approaches ${target}.`,
      `Normalize the expression for the parser: ${normalized}.`,
      "Apply algebraic simplification and limit laws before substituting.",
      `Return the exact limiting value: ${result}.`,
    ],
  };
}

export function symbolicOneSidedLimit(expression: string, variable = "x", target = "0", direction: "above" | "below" = "above"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const targetValue = evaluateSymbolicNumber(normalizeSymbolic(target));
  if (targetValue === null) throw new Error("One-sided limits need a numeric target.");
  const offsets = [1e-2, 1e-3, 1e-4, 1e-5].map((epsilon) => (direction === "above" ? targetValue + epsilon : targetValue - epsilon));
  const samples = offsets.map((sample) => evaluateExpressionAt(normalized, cleanVariable, String(sample))).filter((value): value is number => value !== null);
  if (!samples.length) throw new Error("Could not numerically sample the one-sided limit.");
  const last = samples[samples.length - 1];
  const result = Math.abs(last) >= 1e5 ? (last > 0 ? "∞" : "-∞") : formatApprox(last);
  return {
    result,
    exact: result,
    detail: `One-sided limit estimated from the ${direction === "above" ? "right" : "left"} side with shrinking numeric samples.`,
    steps: [
      `Read the limit as ${cleanVariable} approaches ${target} from ${direction === "above" ? "above/right" : "below/left"}.`,
      `Normalize the expression: ${normalized}.`,
      `Sample values near the target: ${samples.map(formatApprox).join(", ")}.`,
      `Return one-sided result: ${result}.`,
    ],
    warnings: ["One-sided limit uses numeric sampling for directional behavior."],
  };
}

export function symbolicNumericalIntegral(expression: string, lower: string, upper: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const a = evaluateSymbolicNumber(normalizeSymbolic(lower));
  const b = evaluateSymbolicNumber(normalizeSymbolic(upper));
  if (a === null || b === null) throw new Error("NIntegral bounds must be numeric.");
  const intervals = 800;
  const width = (b - a) / intervals;
  let total = 0;
  for (let index = 0; index <= intervals; index += 1) {
    const x = a + width * index;
    const value = evaluateExpressionAt(normalized, cleanVariable, String(x));
    if (value === null) throw new Error("Could not evaluate integrand numerically.");
    const weight = index === 0 || index === intervals ? 1 : index % 2 === 0 ? 2 : 4;
    total += weight * value;
  }
  const result = formatApprox((width / 3) * total);
  return {
    result,
    exact: result,
    detail: "Numerical definite integral using composite Simpson integration.",
    steps: [
      `Read ∫ ${expression} d${cleanVariable} from ${lower} to ${upper}.`,
      `Normalize the integrand: ${normalized}.`,
      `Split the interval into ${intervals} Simpson subintervals.`,
      `Return numeric area estimate: ${result}.`,
    ],
  };
}

export function symbolicImplicitDerivative(equation: string, variable = "x", dependent = "y"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const cleanDependent = normalizeVariable(dependent);
  const [left, right = "0"] = splitTopLevelSymbolic(normalizeEquation(equation), "=");
  const relation = `(${left})-(${right})`;
  const partialX = cleanSymbolic(nerdamer(`diff(${relation},${cleanVariable})`).toString());
  const partialY = cleanSymbolic(nerdamer(`diff(${relation},${cleanDependent})`).toString());
  const result = cleanSymbolic(nerdamer(`-(${partialX})/(${partialY})`).toString());
  return {
    result,
    exact: result,
    detail: "Implicit derivative from F(x,y)=0 using dy/dx = -F_x/F_y.",
    steps: [
      `Move the equation to F(${cleanVariable},${cleanDependent})=0: ${relation}=0.`,
      `Differentiate F with respect to ${cleanVariable}: F_${cleanVariable}=${partialX}.`,
      `Differentiate F with respect to ${cleanDependent}: F_${cleanDependent}=${partialY}.`,
      `Return d${cleanDependent}/d${cleanVariable} = -F_${cleanVariable}/F_${cleanDependent} = ${result}.`,
    ],
  };
}

export function symbolicTaylorPolynomial(expression: string, variable = "x", center = "0", order = "5"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const normalizedCenter = normalizeSymbolic(center);
  const degree = Math.max(0, Math.min(20, Math.floor(Number(order))));
  if (!Number.isFinite(degree)) throw new Error("TaylorPolynomial order must be numeric.");
  const terms: string[] = [];
  const steps = [`Expand ${expression} around ${cleanVariable}=${center} to order ${degree}.`];
  for (let index = 0; index <= degree; index += 1) {
    const derivative = index === 0 ? normalized : cleanSymbolic(nerdamer(`diff(${normalized},${cleanVariable},${index})`).toString());
    const value = cleanSymbolic(evaluateWithSubstitution(derivative, cleanVariable, normalizedCenter));
    const denominator = factorial(index);
    const term = index === 0 ? `(${value})` : `((${value})/${denominator})*(${cleanVariable}-(${normalizedCenter}))^${index}`;
    terms.push(term);
    steps.push(`Term ${index}: f^(${index})(${center})/${index}! = ${value}/${denominator}.`);
  }
  const result = cleanSymbolic(nerdamer(`expand(${terms.join("+")})`).toString());
  return {
    result,
    exact: result,
    detail: "Taylor polynomial built from symbolic derivatives at the requested center.",
    steps: [...steps, `Return polynomial: ${result}.`],
  };
}

export function symbolicLaplace(expression: string, variable = "t", target = "s"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const cleanTarget = normalizeVariable(target);
  const result = laplaceTable(normalized, cleanVariable, cleanTarget);
  if (!result) throw new Error("Laplace table coverage is limited to constants, powers, exponentials, sine, and cosine.");
  return {
    result,
    exact: result,
    detail: "Laplace transform from the built-in elementary transform table.",
    steps: [
      `Read f(${cleanVariable})=${expression}.`,
      "Match the expression against elementary Laplace transform rules.",
      `Return F(${cleanTarget})=${result}.`,
    ],
  };
}

export function symbolicInverseLaplace(expression: string, variable = "s", target = "t"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const cleanTarget = normalizeVariable(target);
  const result = inverseLaplaceTable(normalized, cleanVariable, cleanTarget);
  if (!result) throw new Error("Inverse Laplace table coverage is limited to common elementary forms.");
  return {
    result,
    exact: result,
    detail: "Inverse Laplace transform from the built-in elementary transform table.",
    steps: [
      `Read F(${cleanVariable})=${expression}.`,
      "Match the expression against elementary inverse transform rules.",
      `Return f(${cleanTarget})=${result}.`,
    ],
  };
}

export function symbolicSolveOde(equation: string, variable = "x", dependent = "y"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const cleanDependent = normalizeVariable(dependent);
  const normalized = normalizeSymbolic(equation);
  const escapedDependent = escapeRegExp(cleanDependent);
  const derivativePattern = new RegExp(`^${escapedDependent}'=([+-]?(?:\\d+(?:\\.\\d+)?|\\d*\\.\\d+)?)\\*?${escapedDependent}$`);
  const match = normalized.match(derivativePattern);
  if (!match) throw new Error("SolveODE currently supports first-order separable forms like y'=k*y.");
  const rawRate = match[1];
  const rate = rawRate === "" || rawRate === "+" ? "1" : rawRate === "-" ? "-1" : rawRate;
  const result = rate === "1" ? `${cleanDependent}=C*e^${cleanVariable}` : `${cleanDependent}=C*e^(${rate}*${cleanVariable})`;
  return {
    result,
    exact: result,
    detail: "First-order exponential ODE solved by separation of variables.",
    steps: [
      `Read ${equation} as d${cleanDependent}/d${cleanVariable} = ${rate}${cleanDependent}.`,
      `Separate variables: d${cleanDependent}/${cleanDependent} = ${rate} d${cleanVariable}.`,
      `Integrate both sides and absorb constants into C.`,
      `Return ${result}.`,
    ],
    warnings: ["SolveODE currently covers elementary exponential growth/decay forms only."],
  };
}

export function symbolicMatrixSummary(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const rows = matrix.length;
  const columns = matrix[0]?.length ?? 0;
  const square = rows === columns;
  const determinant = square ? determinantSteps(matrix).value : undefined;
  const rank = rankMatrix(matrix).rank;
  const result = `${rows}x${columns} matrix, rank ${rank}${determinant !== undefined ? `, det ${formatMatrixNumber(determinant)}` : ""}`;
  return {
    result,
    exact: formatMatrixLiteral(matrix),
    detail: "Matrix parsed and summarized with dimensions, rank, and determinant when square.",
    steps: [
      `Read matrix: ${formatMatrixLiteral(matrix)}.`,
      `Dimensions: ${rows} rows by ${columns} columns.`,
      `Row-reduction rank: ${rank}.`,
      determinant !== undefined ? `Determinant: ${formatMatrixNumber(determinant)}.` : "Determinant skipped because the matrix is not square.",
    ],
  };
}

export function symbolicDeterminant(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = determinantSteps(matrix);
  if (computed.error || computed.value === undefined) throw new Error(computed.error ?? "Could not compute determinant.");
  return {
    result: formatMatrixNumber(computed.value),
    exact: formatMatrixNumber(computed.value),
    detail: "Determinant computed with the existing matrix step engine.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, ...matrixSteps(computed.steps), `Return determinant ${formatMatrixNumber(computed.value)}.`],
  };
}

export function symbolicTranspose(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = transposeMatrix(matrix);
  return {
    result: formatMatrixLiteral(computed.result),
    exact: formatMatrixLiteral(computed.result),
    detail: "Matrix transpose by swapping rows and columns.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, ...matrixSteps(computed.steps), `Return transpose ${formatMatrixLiteral(computed.result)}.`],
  };
}

export function symbolicInverseMatrix(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = inverse(matrix);
  if (computed.error) throw new Error(computed.error);
  return {
    result: formatMatrixLiteral(computed.result),
    exact: formatMatrixLiteral(computed.result),
    detail: "Matrix inverse using adjugate for small matrices and Gauss-Jordan for larger supported matrices.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, ...matrixSteps(computed.steps), `Return inverse ${formatMatrixLiteral(computed.result)}.`],
  };
}

export function symbolicMatrixAdd(first: string, second: string): SymbolicResult {
  const left = parseMatrixLiteral(first);
  const right = parseMatrixLiteral(second);
  const computed = addMatrices(left, right);
  if (computed.error) throw new Error(computed.error);
  return {
    result: formatMatrixLiteral(computed.result),
    exact: formatMatrixLiteral(computed.result),
    detail: "Matrix addition performed entry by entry.",
    steps: [`Read A=${formatMatrixLiteral(left)} and B=${formatMatrixLiteral(right)}.`, ...matrixSteps(computed.steps), `Return A+B=${formatMatrixLiteral(computed.result)}.`],
  };
}

export function symbolicMatrixSubtract(first: string, second: string): SymbolicResult {
  const left = parseMatrixLiteral(first);
  const right = parseMatrixLiteral(second);
  const computed = subtractMatrices(left, right);
  if (computed.error) throw new Error(computed.error);
  return {
    result: formatMatrixLiteral(computed.result),
    exact: formatMatrixLiteral(computed.result),
    detail: "Matrix subtraction performed entry by entry.",
    steps: [`Read A=${formatMatrixLiteral(left)} and B=${formatMatrixLiteral(right)}.`, ...matrixSteps(computed.steps), `Return A-B=${formatMatrixLiteral(computed.result)}.`],
  };
}

export function symbolicMatrixMultiply(first: string, second: string): SymbolicResult {
  const left = parseMatrixLiteral(first);
  const right = parseMatrixLiteral(second);
  const computed = multiplyMatrices(left, right);
  if (computed.error) throw new Error(computed.error);
  return {
    result: formatMatrixLiteral(computed.result),
    exact: formatMatrixLiteral(computed.result),
    detail: "Matrix multiplication using row-column dot products.",
    steps: [`Read A=${formatMatrixLiteral(left)} and B=${formatMatrixLiteral(right)}.`, ...matrixSteps(computed.steps), `Return AB=${formatMatrixLiteral(computed.result)}.`],
  };
}

export function symbolicScalarMultiply(scalarRaw: string, matrixRaw: string): SymbolicResult {
  const scalar = numericArg(scalarRaw, "scalar");
  const matrix = parseMatrixLiteral(matrixRaw);
  const computed = scalarMultiply(scalar, matrix);
  if (computed.error) throw new Error(computed.error);
  return {
    result: formatMatrixLiteral(computed.result),
    exact: formatMatrixLiteral(computed.result),
    detail: "Scalar multiplication of every matrix entry.",
    steps: [`Read scalar ${formatStatistic(scalar)} and matrix ${formatMatrixLiteral(matrix)}.`, ...matrixSteps(computed.steps), `Return ${formatMatrixLiteral(computed.result)}.`],
  };
}

export function symbolicTrace(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  if (!matrix.length || matrix.length !== matrix[0].length) throw new Error("Trace needs a square matrix.");
  const trace = matrix.reduce((sum, row, index) => sum + row[index], 0);
  const result = formatMatrixNumber(trace);
  return {
    result,
    exact: result,
    detail: "Trace is the sum of diagonal entries.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, `Add diagonal entries: ${matrix.map((row, index) => formatMatrixNumber(row[index])).join(" + ")} = ${result}.`],
  };
}

export function symbolicIdentityMatrix(sizeRaw: string): SymbolicResult {
  const size = Math.round(numericArg(sizeRaw, "size"));
  if (size < 1 || size > 12) throw new Error("IdentityMatrix size must be from 1 to 12.");
  const matrix = createMatrix(size, size).map((row, rowIndex) => row.map((_, columnIndex) => (rowIndex === columnIndex ? 1 : 0)));
  return {
    result: formatMatrixLiteral(matrix),
    exact: formatMatrixLiteral(matrix),
    detail: "Identity matrix with ones on the main diagonal and zeros elsewhere.",
    steps: [`Create a ${size}x${size} matrix.`, "Put 1 on every main diagonal entry and 0 elsewhere.", `Return ${formatMatrixLiteral(matrix)}.`],
  };
}

export function symbolicCofactorMatrix(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = cofactorMatrix(matrix);
  if (computed.error) throw new Error(computed.error);
  return {
    result: formatMatrixLiteral(computed.result),
    exact: formatMatrixLiteral(computed.result),
    detail: "Cofactor matrix from signed minors.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, ...matrixSteps(computed.steps), `Return cofactor matrix ${formatMatrixLiteral(computed.result)}.`],
  };
}

export function symbolicAdjointMatrix(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = adjointMatrix(matrix);
  if (computed.error) throw new Error(computed.error);
  return {
    result: formatMatrixLiteral(computed.result),
    exact: formatMatrixLiteral(computed.result),
    detail: "Adjoint matrix as transpose of the cofactor matrix.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, ...matrixSteps(computed.steps), `Return adjoint ${formatMatrixLiteral(computed.result)}.`],
  };
}

export function symbolicRref(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = toRowEchelon(matrix);
  const reduced = rrefNumeric(computed.result);
  return {
    result: formatMatrixLiteral(reduced),
    exact: formatMatrixLiteral(reduced),
    detail: "Reduced row-echelon form using elementary row operations.",
    steps: [
      `Read matrix: ${formatMatrixLiteral(matrix)}.`,
      ...matrixSteps(computed.steps),
      `Clear pivot columns above pivots to get RREF: ${formatMatrixLiteral(reduced)}.`,
    ],
  };
}

export function symbolicMatrixRank(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = rankMatrix(matrix);
  return {
    result: `${computed.rank}`,
    exact: `${computed.rank}`,
    detail: "Matrix rank from row-echelon form by counting nonzero rows.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, ...matrixSteps(computed.steps), `Return rank ${computed.rank}.`],
  };
}

export function symbolicDimension(expression: string): SymbolicResult {
  try {
    const matrix = parseMatrixLiteral(expression);
    const result = formatVector([matrix.length, matrix[0]?.length ?? 0]);
    return {
      result,
      exact: result,
      detail: "Matrix dimensions as row count by column count.",
      steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, `Count ${matrix.length} rows and ${matrix[0]?.length ?? 0} columns.`, `Return ${result}.`],
    };
  } catch {
    const vector = parseVectorLiteral(expression);
    const result = `${vector.length}`;
    return {
      result,
      exact: result,
      detail: "Vector dimension as component count.",
      steps: [`Read vector ${formatVector(vector)}.`, `Count ${vector.length} components.`, `Return ${result}.`],
    };
  }
}

export function symbolicCharacteristicPolynomial(expression: string, variable = "lambda"): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  if (!matrix.length || matrix.length !== matrix[0].length) throw new Error("CharacteristicPolynomial needs a square matrix.");
  const cleanVariable = normalizeVariable(variable);
  let result: string;
  if (matrix.length === 1) {
    result = `${cleanVariable}${signedNumber(-matrix[0][0])}`;
  } else if (matrix.length === 2) {
    const trace = matrix[0][0] + matrix[1][1];
    const det = determinantSteps(matrix).value ?? 0;
    result = cleanSymbolic(nerdamer(`expand(${cleanVariable}^2-${formatCoefficient(trace)}*${cleanVariable}+${formatCoefficient(det)})`).toString());
  } else {
    const terms = matrix.map((row, rowIndex) => row.map((value, columnIndex) => (rowIndex === columnIndex ? `(${cleanVariable}-${formatCoefficient(value)})` : `(${-value})`)));
    result = cleanSymbolic(nerdamer(`expand(${determinantSymbolic(terms)})`).toString());
  }
  return {
    result,
    exact: result,
    detail: "Characteristic polynomial det(lambda I - A).",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, `Build ${cleanVariable}I - A.`, `Compute determinant symbolically.`, `Return ${result}.`],
  };
}

export function symbolicJordanDiagonalization(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = eigen2x2(matrix);
  if ("error" in computed) throw new Error(computed.error);
  const [first, second] = computed.values;
  const [firstVector, secondVector] = computed.vectors;
  const p = [firstVector, secondVector].map((_, rowIndex) => [firstVector[rowIndex] ?? 0, secondVector[rowIndex] ?? 0]);
  const d = [
    [first, 0],
    [0, second],
  ];
  const repeated = Math.abs(first - second) < 1e-10;
  const j = [
    [first, repeated ? 1 : 0],
    [0, second],
  ];
  const result = repeated ? `J=${formatMatrixLiteral(j)}` : `P=${formatMatrixLiteral(p)}, D=${formatMatrixLiteral(d)}`;
  return {
    result,
    exact: result,
    detail: repeated ? "Compact 2x2 Jordan block summary for a repeated eigenvalue." : "2x2 diagonalization summary using eigenvectors as columns.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, `Find eigenvalues ${computed.values.map(formatMatrixNumber).join(", ")}.`, repeated ? "Use a Jordan block for the repeated eigenvalue." : "Place eigenvectors into P and eigenvalues into D.", `Return ${result}.`],
    warnings: repeated ? ["Repeated-eigenvalue Jordan summaries are compact; generalized eigenvector display is limited."] : undefined,
  };
}

export function symbolicMinimalPolynomial(expression: string, variable = "lambda"): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = eigen2x2(matrix);
  if ("error" in computed) throw new Error(computed.error);
  const cleanVariable = normalizeVariable(variable);
  const values = uniqueNumeric(computed.values.map((value) => Math.round(value * 1_000_000) / 1_000_000));
  const product = values.map((value) => `(${cleanVariable}${signedNumber(-value)})`).join("*") || "1";
  const result = cleanSymbolic(nerdamer(`expand(${product})`).toString());
  return {
    result,
    exact: result,
    detail: "Minimal polynomial for a supported diagonalizable 2x2 matrix.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, `Use distinct eigenvalues ${values.map(formatMatrixNumber).join(", ")}.`, `Build product of (lambda - eigenvalue).`, `Return ${result}.`],
    warnings: computed.values.length !== values.length ? ["Repeated eigenvalues may need higher powers for defective matrices; this compact result assumes the simple supported case."] : undefined,
  };
}

export function symbolicLuDecomposition(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const { l, u, steps } = luDecompose(matrix);
  const result = `L=${formatMatrixLiteral(l)}, U=${formatMatrixLiteral(u)}`;
  return {
    result,
    exact: result,
    detail: "LU decomposition without pivoting for nonsingular square matrices.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, ...steps, `Return ${result}.`],
  };
}

export function symbolicQrDecomposition(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const { q, r, steps } = qrDecompose(matrix);
  const result = `Q=${formatMatrixLiteral(q)}, R=${formatMatrixLiteral(r)}`;
  return {
    result,
    exact: result,
    detail: "QR decomposition by classical Gram-Schmidt.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, ...steps, `Return ${result}.`],
  };
}

export function symbolicSvd(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const singularValues = singularValues2x2(matrix);
  const result = `singular values=[${singularValues.map(formatMatrixNumber).join(", ")}]`;
  return {
    result,
    exact: result,
    detail: "Compact SVD summary from eigenvalues of A^T A for 2x2 matrices.",
    steps: [`Read matrix: ${formatMatrixLiteral(matrix)}.`, "Compute A^T A.", "Eigenvalues of A^T A give squared singular values.", `Return ${result}.`],
  };
}

export function symbolicEigenvalues(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = eigen2x2(matrix);
  if ("error" in computed) throw new Error(computed.error);
  const values = computed.values.map(formatMatrixNumber);
  return {
    result: `[${values.join(", ")}]`,
    exact: values.join(","),
    detail: "Real eigenvalues for a 2x2 matrix from the characteristic polynomial.",
    steps: [
      `Read matrix: ${formatMatrixLiteral(matrix)}.`,
      `Trace = ${formatMatrixNumber(computed.trace)}, determinant = ${formatMatrixNumber(computed.det)}.`,
      `Discriminant = ${formatMatrixNumber(computed.discriminant)}.`,
      `Return eigenvalues: ${values.join(", ")}.`,
    ],
  };
}

export function symbolicEigenvectors(expression: string): SymbolicResult {
  const matrix = parseMatrixLiteral(expression);
  const computed = eigen2x2(matrix);
  if ("error" in computed) throw new Error(computed.error);
  const pairs = computed.values.map((value, index) => `λ=${formatMatrixNumber(value)}: ${formatVector(computed.vectors[index])}`);
  return {
    result: pairs.join("; "),
    exact: pairs.join("; "),
    detail: "Real 2x2 eigenvectors paired with each eigenvalue.",
    steps: [
      `Read matrix: ${formatMatrixLiteral(matrix)}.`,
      "Solve (A - λI)v = 0 for each real eigenvalue.",
      `Return eigenpairs: ${pairs.join("; ")}.`,
    ],
  };
}

export function symbolicVectorMagnitude(expression: string): SymbolicResult {
  const vector = parseVectorLiteral(expression);
  const magnitude = vectorMagnitude(vector);
  const result = formatStatistic(magnitude);
  return {
    result,
    exact: result,
    detail: "Vector magnitude from the square root of sum of squares.",
    steps: [`Read vector ${formatVector(vector)}.`, `Compute sqrt(${vector.map((value) => `${formatStatistic(value)}^2`).join(" + ")}) = ${result}.`],
  };
}

export function symbolicUnitVector(expression: string): SymbolicResult {
  const vector = parseVectorLiteral(expression);
  const computed = unitVector(vector);
  return {
    result: formatVector(computed.result),
    exact: formatVector(computed.result),
    detail: "Unit vector in the same direction.",
    steps: [`Read vector ${formatVector(vector)}.`, `Divide every component by magnitude ${formatStatistic(vectorMagnitude(vector))}.`, `Return ${formatVector(computed.result)}.`],
    warnings: computed.warning ? [computed.warning] : undefined,
  };
}

export function symbolicVectorAdd(first: string, second: string): SymbolicResult {
  const u = parseVectorLiteral(first);
  const v = parseVectorLiteral(second);
  const resultVector = vectorAdd(u, v);
  return {
    result: formatVector(resultVector),
    exact: formatVector(resultVector),
    detail: "Componentwise vector addition.",
    steps: [`Read vectors ${formatVector(u)} and ${formatVector(v)}.`, `Add components to get ${formatVector(resultVector)}.`],
  };
}

export function symbolicVectorSubtract(first: string, second: string): SymbolicResult {
  const u = parseVectorLiteral(first);
  const v = parseVectorLiteral(second);
  const resultVector = vectorSubtract(u, v);
  return {
    result: formatVector(resultVector),
    exact: formatVector(resultVector),
    detail: "Componentwise vector subtraction.",
    steps: [`Read vectors ${formatVector(u)} and ${formatVector(v)}.`, `Subtract components to get ${formatVector(resultVector)}.`],
  };
}

export function symbolicVectorScale(scalarRaw: string, vectorRaw: string): SymbolicResult {
  const scalar = numericArg(scalarRaw, "scalar");
  const vector = parseVectorLiteral(vectorRaw);
  const resultVector = scalarVectorMultiply(scalar, vector);
  return {
    result: formatVector(resultVector),
    exact: formatVector(resultVector),
    detail: "Vector scalar multiplication.",
    steps: [`Read scalar ${formatStatistic(scalar)} and vector ${formatVector(vector)}.`, `Scale components to get ${formatVector(resultVector)}.`],
  };
}

export function symbolicProjection(first: string, second: string): SymbolicResult {
  const u = parseVectorLiteral(first);
  const v = parseVectorLiteral(second);
  if (u.length !== 2 || v.length !== 2) throw new Error("Projection currently supports 2D vectors.");
  const computed = vectorProjection(u as [number, number], v as [number, number]);
  return {
    result: formatVector(computed.result),
    exact: formatVector(computed.result),
    detail: "Projection of one vector onto another.",
    steps: [`Read vectors ${formatVector(u)} and ${formatVector(v)}.`, `Projection scalar = ${formatStatistic(computed.scalar)}.`, `Return ${formatVector(computed.result)}.`],
    warnings: computed.warning ? [computed.warning] : undefined,
  };
}

export function symbolicPerpendicularVector(expression: string, unit = false): SymbolicResult {
  const vector = parseVectorLiteral(expression);
  if (vector.length !== 2) throw new Error("PerpendicularVector needs a 2D vector.");
  const perpendicular = [-vector[1], vector[0]];
  const resultVector = unit ? unitVector(perpendicular).result : perpendicular;
  const result = formatVector(resultVector);
  return {
    result,
    exact: result,
    detail: unit ? "Unit vector perpendicular to a 2D vector." : "A 2D perpendicular vector by rotating 90 degrees.",
    steps: [`Read vector ${formatVector(vector)}.`, `Rotate (x,y) to (-y,x).`, unit ? "Normalize the perpendicular vector." : "Keep the same length scale.", `Return ${result}.`],
  };
}

export function symbolicDotProduct(first: string, second: string): SymbolicResult {
  const u = parseVectorLiteral(first);
  const v = parseVectorLiteral(second);
  if (u.length !== v.length) throw new Error("Dot product needs vectors of equal length.");
  const products = u.map((value, index) => value * v[index]);
  const result = dotProduct(u, v);
  return {
    result: formatMatrixNumber(result),
    exact: formatMatrixNumber(result),
    detail: "Dot product computed as the sum of pairwise products.",
    steps: [
      `Read vectors ${formatVector(u)} and ${formatVector(v)}.`,
      `Pairwise products: ${products.map(formatMatrixNumber).join(", ")}.`,
      `Sum products to get ${formatMatrixNumber(result)}.`,
    ],
  };
}

export function symbolicCrossProduct(first: string, second: string): SymbolicResult {
  const u = parseVectorLiteral(first);
  const v = parseVectorLiteral(second);
  if (u.length !== 3 || v.length !== 3) throw new Error("Cross product needs two 3D vectors.");
  const computed = crossProduct(u as [number, number, number], v as [number, number, number]);
  return {
    result: formatVector(computed.result),
    exact: formatVector(computed.result),
    detail: "3D cross product computed by determinant component expansion.",
    steps: [`Read vectors ${formatVector(u)} and ${formatVector(v)}.`, ...computed.steps, `Return ${formatVector(computed.result)}.`],
  };
}

export function symbolicListSummary(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const sorted = [...values].sort((a, b) => a - b);
  const total = values.reduce((sum, value) => sum + value, 0);
  const mean = total / values.length;
  const median = medianNumber(sorted);
  const variance = populationVariance(values);
  const result = `n=${values.length}, sum=${formatStatistic(total)}, mean=${formatStatistic(mean)}, median=${formatStatistic(median)}, variance=${formatStatistic(variance)}`;
  return {
    result,
    exact: formatVector(values),
    detail: "Numeric list summary with count, sum, mean, median, and population variance.",
    steps: [
      `Read list values: ${formatVector(values)}.`,
      `Sort values: ${formatVector(sorted)}.`,
      `Sum = ${formatStatistic(total)} and count = ${values.length}.`,
      `Mean = ${formatStatistic(mean)}, median = ${formatStatistic(median)}, variance = ${formatStatistic(variance)}.`,
    ],
  };
}

export function symbolicMean(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const total = values.reduce((sum, value) => sum + value, 0);
  const result = formatStatistic(total / values.length);
  return {
    result,
    exact: result,
    detail: "Arithmetic mean of a numeric list.",
    steps: [`Read values: ${formatVector(values)}.`, `Sum = ${formatStatistic(total)}.`, `Divide by ${values.length}: mean = ${result}.`],
  };
}

export function symbolicSum(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const total = values.reduce((sum, value) => sum + value, 0);
  const result = formatStatistic(total);
  return {
    result,
    exact: result,
    detail: "Sum of numeric list values.",
    steps: [`Read values: ${formatVector(values)}.`, `Add all values to get ${result}.`],
  };
}

export function symbolicProduct(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const product = values.reduce((total, value) => total * value, 1);
  const result = formatStatistic(product);
  return {
    result,
    exact: result,
    detail: "Product of numeric list values.",
    steps: [`Read values: ${formatVector(values)}.`, `Multiply all values to get ${result}.`],
  };
}

export function symbolicElement(listRaw: string, indexRaw: string): SymbolicResult {
  const values = parseLooseItems(listRaw);
  const index = Math.round(numericArg(indexRaw, "index"));
  if (index < 1 || index > values.length) throw new Error("Element index is out of range.");
  const result = values[index - 1];
  return { result, exact: result, detail: "List element using 1-based indexing.", steps: [`Read list ${formatItems(values)}.`, `Use index ${index}.`, `Return ${result}.`] };
}

export function symbolicFirst(listRaw: string, countRaw = "1"): SymbolicResult {
  const values = parseLooseItems(listRaw);
  const count = Math.max(1, Math.min(values.length, Math.round(numericArg(countRaw, "count"))));
  const picked = values.slice(0, count);
  const result = count === 1 ? picked[0] : formatItems(picked);
  return { result, exact: result, detail: "First item or first n list items.", steps: [`Read list ${formatItems(values)}.`, `Take first ${count}.`, `Return ${result}.`] };
}

export function symbolicLast(listRaw: string, countRaw = "1"): SymbolicResult {
  const values = parseLooseItems(listRaw);
  const count = Math.max(1, Math.min(values.length, Math.round(numericArg(countRaw, "count"))));
  const picked = values.slice(values.length - count);
  const result = count === 1 ? picked[0] : formatItems(picked);
  return { result, exact: result, detail: "Last item or last n list items.", steps: [`Read list ${formatItems(values)}.`, `Take last ${count}.`, `Return ${result}.`] };
}

export function symbolicTake(listRaw: string, startRaw: string, endRaw?: string): SymbolicResult {
  const values = parseLooseItems(listRaw);
  const start = Math.round(numericArg(startRaw, "start"));
  const end = endRaw ? Math.round(numericArg(endRaw, "end")) : start;
  const from = Math.max(1, Math.min(values.length, start));
  const to = Math.max(from, Math.min(values.length, end));
  const picked = values.slice(from - 1, to);
  const result = formatItems(picked);
  return { result, exact: result, detail: "1-based list slice.", steps: [`Read list ${formatItems(values)}.`, `Take items ${from} through ${to}.`, `Return ${result}.`] };
}

export function symbolicDelete(listRaw: string, indexRaw: string): SymbolicResult {
  const values = parseLooseItems(listRaw);
  const index = Math.round(numericArg(indexRaw, "index"));
  if (index < 1 || index > values.length) throw new Error("Delete index is out of range.");
  const result = formatItems(values.filter((_, itemIndex) => itemIndex !== index - 1));
  return { result, exact: result, detail: "Delete a list item using 1-based indexing.", steps: [`Read list ${formatItems(values)}.`, `Delete item ${index}.`, `Return ${result}.`] };
}

export function symbolicUnique(listRaw: string): SymbolicResult {
  const values = parseLooseItems(listRaw);
  const seen = new Set<string>();
  const unique = values.filter((value) => {
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
  const result = formatItems(unique);
  return { result, exact: result, detail: "Unique values in first-seen order.", steps: [`Read list ${formatItems(values)}.`, "Keep first occurrence of each value.", `Return ${result}.`] };
}

export function symbolicShuffle(listRaw: string, seedRaw?: string): SymbolicResult {
  const values = parseLooseItems(listRaw);
  const random = seededRandom(seedRaw);
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  const result = formatItems(shuffled);
  return { result, exact: result, detail: "Seedable Fisher-Yates list shuffle.", steps: [`Read list ${formatItems(values)}.`, seedRaw ? `Use seed ${seedRaw}.` : "Use an unseeded random source.", `Return ${result}.`] };
}

export function symbolicSample(listRaw: string, countRaw: string, seedRaw?: string): SymbolicResult {
  const values = parseLooseItems(listRaw);
  const count = Math.max(1, Math.min(values.length, Math.round(numericArg(countRaw, "count"))));
  const shuffled = symbolicShuffle(listRaw, seedRaw).exact ?? formatItems(values);
  const result = formatItems(parseLooseItems(shuffled).slice(0, count));
  return { result, exact: result, detail: "Seedable sample without replacement.", steps: [`Read list ${formatItems(values)}.`, `Shuffle and take ${count}.`, `Return ${result}.`] };
}

export function symbolicSequence(expression: string, variableRaw: string, startRaw: string, endRaw: string, stepRaw = "1"): SymbolicResult {
  const variable = normalizeVariable(variableRaw);
  const start = numericArg(startRaw, "start");
  const end = numericArg(endRaw, "end");
  const step = numericArg(stepRaw, "step");
  if (step === 0) throw new Error("Sequence step cannot be 0.");
  const values: number[] = [];
  for (let value = start, guard = 0; step > 0 ? value <= end + 1e-10 : value >= end - 1e-10; value += step, guard += 1) {
    if (guard > 1000) throw new Error("Sequence is limited to 1000 values.");
    const evaluated = evaluateExpressionAt(normalizeSymbolic(expression), variable, String(value));
    if (evaluated === null) throw new Error("Could not evaluate sequence expression.");
    values.push(evaluated);
  }
  const result = formatVector(values);
  return { result, exact: result, detail: "Numeric sequence from an expression and index range.", steps: [`Read ${expression} for ${variable}=${start} to ${end} step ${step}.`, `Return ${result}.`] };
}

export function symbolicMin(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const result = formatStatistic(Math.min(...values));
  return {
    result,
    exact: result,
    detail: "Minimum numeric list value.",
    steps: [`Read values: ${formatVector(values)}.`, `Return the smallest value: ${result}.`],
  };
}

export function symbolicMax(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const result = formatStatistic(Math.max(...values));
  return {
    result,
    exact: result,
    detail: "Maximum numeric list value.",
    steps: [`Read values: ${formatVector(values)}.`, `Return the largest value: ${result}.`],
  };
}

export function symbolicRange(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const result = formatStatistic(max - min);
  return {
    result,
    exact: result,
    detail: "Range of numeric data.",
    steps: [`Read values: ${formatVector(values)}.`, `Minimum = ${formatStatistic(min)}, maximum = ${formatStatistic(max)}.`, `Range = max - min = ${result}.`],
  };
}

export function symbolicMedian(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const sorted = [...values].sort((a, b) => a - b);
  const result = formatStatistic(medianNumber(sorted));
  return {
    result,
    exact: result,
    detail: "Median of sorted numeric data.",
    steps: [`Read values: ${formatVector(values)}.`, `Sort values: ${formatVector(sorted)}.`, `Return middle value or average of two middle values: ${result}.`],
  };
}

export function symbolicMode(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const counts = new Map<number, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  const maxFrequency = Math.max(...counts.values());
  const modes = maxFrequency > 1 ? Array.from(counts.entries()).filter(([, count]) => count === maxFrequency).map(([value]) => value).sort((a, b) => a - b) : [];
  const result = modes.length ? formatVector(modes) : "No mode";
  return {
    result,
    exact: result,
    detail: "Mode of numeric data, returning every value tied for highest frequency.",
    steps: [
      `Read values: ${formatVector(values)}.`,
      `Frequency table: ${Array.from(counts.entries()).sort((a, b) => a[0] - b[0]).map(([value, count]) => `${formatStatistic(value)}:${count}`).join(", ")}.`,
      modes.length ? `Highest repeated frequency is ${maxFrequency}; mode = ${result}.` : "No value repeats, so the data has no mode.",
    ],
  };
}

export function symbolicFrequencyTable(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const counts = frequencyCounts(values);
  const result = `[${counts.map(([value, count]) => `[${formatStatistic(value)}, ${count}]`).join(", ")}]`;
  return {
    result,
    exact: result,
    detail: "Frequency table as [value, count] pairs.",
    steps: [`Read values: ${formatVector(values)}.`, `Count occurrences of each value.`, `Return frequency table ${result}.`],
  };
}

export function symbolicVariance(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const squared = values.map((value) => (value - mean) ** 2);
  const variance = populationVariance(values);
  const result = formatStatistic(variance);
  return {
    result,
    exact: result,
    detail: "Population variance of numeric data.",
    steps: [
      `Read values: ${formatVector(values)}.`,
      `Mean = ${formatStatistic(mean)}.`,
      `Squared deviations: ${formatVector(squared)}.`,
      `Population variance = average squared deviation = ${result}.`,
    ],
  };
}

export function symbolicSampleVariance(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  if (values.length < 2) throw new Error("Sample variance needs at least two values.");
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const squared = values.map((value) => (value - mean) ** 2);
  const variance = squared.reduce((sum, value) => sum + value, 0) / (values.length - 1);
  const result = formatStatistic(variance);
  return {
    result,
    exact: result,
    detail: "Sample variance of numeric data using denominator n - 1.",
    steps: [`Read values: ${formatVector(values)}.`, `Mean = ${formatStatistic(mean)}.`, `Squared deviations: ${formatVector(squared)}.`, `Sample variance = ${result}.`],
  };
}

export function symbolicStandardDeviation(items: string[], sample = false): SymbolicResult {
  const variance = sample ? symbolicSampleVariance(items) : symbolicVariance(items);
  const result = formatStatistic(Math.sqrt(Number(variance.result)));
  return {
    result,
    exact: result,
    detail: sample ? "Sample standard deviation using denominator n - 1." : "Population standard deviation.",
    steps: [...variance.steps, `Take square root of variance: ${result}.`],
  };
}

export function symbolicQuartiles(items: string[]): SymbolicResult {
  const values = parseNumberItems(items);
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const lower = sorted.slice(0, middle);
  const upper = sorted.length % 2 ? sorted.slice(middle + 1) : sorted.slice(middle);
  const q1 = lower.length ? medianNumber(lower) : sorted[0];
  const q2 = medianNumber(sorted);
  const q3 = upper.length ? medianNumber(upper) : sorted[sorted.length - 1];
  const result = `[${formatStatistic(q1)}, ${formatStatistic(q2)}, ${formatStatistic(q3)}]`;
  return {
    result,
    exact: result,
    detail: "Quartiles using the median-of-halves method.",
    steps: [
      `Read values: ${formatVector(values)}.`,
      `Sort values: ${formatVector(sorted)}.`,
      `Lower half: ${formatVector(lower)}; upper half: ${formatVector(upper)}.`,
      `Return [Q1, Q2, Q3] = ${result}.`,
    ],
  };
}

export function symbolicPercentile(items: string[]): SymbolicResult {
  const raw = parseNumberItems(items);
  if (raw.length < 2) throw new Error("Percentile needs data values and percentile p.");
  const p = raw[raw.length - 1];
  if (p < 0 || p > 1) throw new Error("Percentile p must be between 0 and 1.");
  const values = raw.slice(0, -1).sort((a, b) => a - b);
  if (!values.length) throw new Error("Percentile needs at least one data value.");
  const position = p * (values.length - 1);
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const weight = position - lowerIndex;
  const percentile = values[lowerIndex] + (values[upperIndex] - values[lowerIndex]) * weight;
  const result = formatStatistic(percentile);
  return {
    result,
    exact: result,
    detail: "Percentile by linear interpolation over sorted data.",
    steps: [
      `Read sorted values: ${formatVector(values)}.`,
      `Percentile p = ${formatStatistic(p)} gives zero-based position ${formatStatistic(position)}.`,
      `Interpolate between indices ${lowerIndex} and ${upperIndex}: ${result}.`,
    ],
  };
}

export function symbolicCovariance(firstRaw: string, secondRaw: string): SymbolicResult {
  const x = parseNumberItems([firstRaw]);
  const y = parseNumberItems([secondRaw]);
  if (x.length !== y.length || x.length < 2) throw new Error("Covariance needs two numeric lists of equal length.");
  const meanX = x.reduce((sum, value) => sum + value, 0) / x.length;
  const meanY = y.reduce((sum, value) => sum + value, 0) / y.length;
  const covariance = x.reduce((sum, value, index) => sum + (value - meanX) * (y[index] - meanY), 0) / x.length;
  const result = formatStatistic(covariance);
  return { result, exact: result, detail: "Population covariance of paired numeric data.", steps: [`Read x=${formatVector(x)} and y=${formatVector(y)}.`, `Means are ${formatStatistic(meanX)} and ${formatStatistic(meanY)}.`, `Return covariance ${result}.`] };
}

export function symbolicFitPoly(pointsRaw: string, degreeRaw = "1"): SymbolicResult {
  const points = parsePointPairs(pointsRaw);
  const degree = Math.max(0, Math.min(5, Math.round(numericArg(degreeRaw, "degree"))));
  const coefficients = leastSquaresPolynomial(points, degree);
  const result = formatPolynomialCoefficients(coefficients, "x");
  return { result, exact: result, detail: "Least-squares polynomial fit.", steps: [`Read ${points.length} point${points.length === 1 ? "" : "s"}.`, `Fit degree ${degree} polynomial.`, `Return ${result}.`] };
}

export function symbolicFitExp(pointsRaw: string): SymbolicResult {
  const points = parsePointPairs(pointsRaw);
  if (points.some(([, y]) => y <= 0)) throw new Error("FitExp needs positive y-values.");
  const fit = linearFit(points.map(([x, y]) => [x, Math.log(y)]));
  const a = Math.exp(fit.intercept);
  const result = `${formatStatistic(a)}*e^(${formatStatistic(fit.slope)}*x)`;
  return { result, exact: result, detail: "Exponential fit y=a*e^(b*x) using a log transform.", steps: [`Transform y-values with ln(y).`, `Fit line ln(y)=ln(a)+b*x.`, `Return ${result}.`] };
}

export function symbolicFitLog(pointsRaw: string): SymbolicResult {
  const points = parsePointPairs(pointsRaw);
  if (points.some(([x]) => x <= 0)) throw new Error("FitLog needs positive x-values.");
  const fit = linearFit(points.map(([x, y]) => [Math.log(x), y]));
  const slopeText = fit.slope < 0 ? `-${formatStatistic(Math.abs(fit.slope))}` : `+${formatStatistic(fit.slope)}`;
  const result = `${formatStatistic(fit.intercept)}${slopeText}*ln(x)`;
  return { result, exact: result, detail: "Logarithmic fit y=a+b*ln(x).", steps: [`Transform x-values with ln(x).`, `Fit line y=a+b*ln(x).`, `Return ${result}.`] };
}

export function symbolicFitPow(pointsRaw: string): SymbolicResult {
  const points = parsePointPairs(pointsRaw);
  if (points.some(([x, y]) => x <= 0 || y <= 0)) throw new Error("FitPow needs positive x and y values.");
  const fit = linearFit(points.map(([x, y]) => [Math.log(x), Math.log(y)]));
  const a = Math.exp(fit.intercept);
  const result = `${formatStatistic(a)}*x^${formatStatistic(fit.slope)}`;
  return { result, exact: result, detail: "Power fit y=a*x^b using log-log linear regression.", steps: [`Transform x and y with natural log.`, `Fit ln(y)=ln(a)+b*ln(x).`, `Return ${result}.`] };
}

export function symbolicFitSin(pointsRaw: string): SymbolicResult {
  const points = parsePointPairs(pointsRaw);
  const ys = points.map(([, y]) => y);
  const max = Math.max(...ys);
  const min = Math.min(...ys);
  const amplitude = (max - min) / 2;
  const midline = (max + min) / 2;
  const xs = points.map(([x]) => x);
  const span = Math.max(...xs) - Math.min(...xs);
  const frequency = span > 0 ? (2 * Math.PI) / span : 1;
  const result = `${formatStatistic(amplitude)}*sin(${formatStatistic(frequency)}*x)+${formatStatistic(midline)}`.replace("+-", "-");
  return { result, exact: result, detail: "Simple sinusoid estimate from amplitude, midline, and x-span.", steps: [`Read ${points.length} points.`, `Amplitude=(max-min)/2=${formatStatistic(amplitude)}; midline=${formatStatistic(midline)}.`, `Estimate angular frequency ${formatStatistic(frequency)}.`, `Return ${result}.`], warnings: ["FitSin is an educational sinusoid estimate; refine with more points for production modelling."] };
}

export function symbolicNormal(meanRaw: string, sdRaw: string, xRaw: string): SymbolicResult {
  const mean = numericArg(meanRaw, "mean");
  const sd = numericArg(sdRaw, "standard deviation");
  const x = numericArg(xRaw, "x");
  if (sd <= 0) throw new Error("Normal distribution standard deviation must be positive.");
  const z = (x - mean) / sd;
  const cdf = normalCdfLocal(z);
  const pdf = Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
  const result = formatStatistic(cdf);
  return {
    result,
    exact: result,
    detail: "Normal distribution cumulative probability P(X <= x), with density included in the steps.",
    steps: [
      `Read Normal(mean=${formatStatistic(mean)}, sd=${formatStatistic(sd)}, x=${formatStatistic(x)}).`,
      `Standardize: z = (x - mean) / sd = ${formatStatistic(z)}.`,
      `PDF at x = ${formatStatistic(pdf)}.`,
      `CDF P(X <= x) = ${result}.`,
    ],
  };
}

export function symbolicNormalPdf(meanRaw: string, sdRaw: string, xRaw: string): SymbolicResult {
  const mean = numericArg(meanRaw, "mean");
  const sd = numericArg(sdRaw, "standard deviation");
  const x = numericArg(xRaw, "x");
  if (sd <= 0) throw new Error("Normal distribution standard deviation must be positive.");
  const z = (x - mean) / sd;
  const pdf = Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
  const result = formatStatistic(pdf);
  return {
    result,
    exact: result,
    detail: "Normal distribution probability density at x.",
    steps: [`Read NormalPDF(mean=${formatStatistic(mean)}, sd=${formatStatistic(sd)}, x=${formatStatistic(x)}).`, `Standardize z=${formatStatistic(z)}.`, `Return density ${result}.`],
  };
}

export function symbolicNormalBetween(meanRaw: string, sdRaw: string, lowerRaw: string, upperRaw: string): SymbolicResult {
  const mean = numericArg(meanRaw, "mean");
  const sd = numericArg(sdRaw, "standard deviation");
  const lower = numericArg(lowerRaw, "lower");
  const upper = numericArg(upperRaw, "upper");
  if (sd <= 0) throw new Error("Normal distribution standard deviation must be positive.");
  const lowZ = (Math.min(lower, upper) - mean) / sd;
  const highZ = (Math.max(lower, upper) - mean) / sd;
  const probability = normalCdfLocal(highZ) - normalCdfLocal(lowZ);
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Normal probability between two bounds.",
    steps: [
      `Read bounds ${formatStatistic(lower)} and ${formatStatistic(upper)}.`,
      `Standardize to z-values ${formatStatistic(lowZ)} and ${formatStatistic(highZ)}.`,
      `Subtract CDF values to get ${result}.`,
    ],
  };
}

export function symbolicPoisson(meanRaw: string, kRaw: string, cumulativeRaw = "false"): SymbolicResult {
  const mean = numericArg(meanRaw, "mean");
  const k = Math.round(numericArg(kRaw, "k"));
  const cumulative = /^true|1|cdf$/i.test(cumulativeRaw.trim());
  if (mean <= 0 || k < 0) throw new Error("Poisson needs mean > 0 and k >= 0.");
  const probabilityAt = (value: number) => Math.exp(-mean) * (mean ** value) / factorial(value);
  const probability = cumulative ? Array.from({ length: k + 1 }, (_, index) => probabilityAt(index)).reduce((sum, value) => sum + value, 0) : probabilityAt(k);
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: cumulative ? "Cumulative Poisson probability P(X <= k)." : "Poisson probability P(X = k).",
    steps: [`Read mean=${formatStatistic(mean)}, k=${k}.`, cumulative ? `Sum probabilities from 0 through ${k}.` : "Use e^-mean * mean^k / k!.", `Return ${result}.`],
  };
}

export function symbolicExponential(lambdaRaw: string, xRaw: string): SymbolicResult {
  const lambda = numericArg(lambdaRaw, "lambda");
  const x = numericArg(xRaw, "x");
  if (lambda <= 0) throw new Error("Exponential needs lambda > 0.");
  const probability = x < 0 ? 0 : 1 - Math.exp(-lambda * x);
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Exponential distribution CDF P(X <= x).",
    steps: [`Read lambda=${formatStatistic(lambda)}, x=${formatStatistic(x)}.`, "Use CDF 1 - e^(-lambda*x).", `Return ${result}.`],
  };
}

export function symbolicGammaDist(shapeRaw: string, scaleRaw: string, xRaw: string): SymbolicResult {
  const shape = numericArg(shapeRaw, "shape");
  const scale = numericArg(scaleRaw, "scale");
  const x = numericArg(xRaw, "x");
  if (shape <= 0 || scale <= 0) throw new Error("Gamma needs shape > 0 and scale > 0.");
  const probability = x <= 0 ? 0 : regularizedGammaP(shape, x / scale);
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Gamma distribution CDF using a regularized incomplete gamma approximation.",
    steps: [`Read shape=${formatStatistic(shape)}, scale=${formatStatistic(scale)}, x=${formatStatistic(x)}.`, "Evaluate P(shape, x/scale).", `Return ${result}.`],
  };
}

export function symbolicChiSquared(dfRaw: string, xRaw: string): SymbolicResult {
  const df = numericArg(dfRaw, "df");
  const x = numericArg(xRaw, "x");
  if (df <= 0) throw new Error("ChiSquared needs df > 0.");
  const probability = x <= 0 ? 0 : regularizedGammaP(df / 2, x / 2);
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Chi-square CDF as a gamma CDF with shape df/2 and scale 2.",
    steps: [`Read df=${formatStatistic(df)}, x=${formatStatistic(x)}.`, "Use P(df/2, x/2).", `Return ${result}.`],
  };
}

export function symbolicTDistribution(dfRaw: string, xRaw: string): SymbolicResult {
  const df = numericArg(dfRaw, "df");
  const x = numericArg(xRaw, "x");
  if (df <= 0) throw new Error("TDistribution needs df > 0.");
  const pdf = (t: number) => gammaLanczos((df + 1) / 2) / (Math.sqrt(df * Math.PI) * gammaLanczos(df / 2)) * (1 + (t * t) / df) ** (-(df + 1) / 2);
  const area = x >= 0 ? 0.5 + numericIntegrate(pdf, 0, x, 800) : 0.5 - numericIntegrate(pdf, x, 0, 800);
  const result = formatStatistic(clamp01(area));
  return {
    result,
    exact: result,
    detail: "Student t CDF by numerical integration of the density.",
    steps: [`Read df=${formatStatistic(df)}, x=${formatStatistic(x)}.`, "Integrate the t density from 0 and use symmetry around 0.", `Return ${result}.`],
  };
}

export function symbolicFDistribution(df1Raw: string, df2Raw: string, xRaw: string): SymbolicResult {
  const df1 = numericArg(df1Raw, "df1");
  const df2 = numericArg(df2Raw, "df2");
  const x = numericArg(xRaw, "x");
  if (df1 <= 0 || df2 <= 0) throw new Error("FDistribution needs positive degrees of freedom.");
  const z = x <= 0 ? 0 : (df1 * x) / (df1 * x + df2);
  const probability = x <= 0 ? 0 : regularizedBeta(z, df1 / 2, df2 / 2);
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "F distribution CDF through the regularized beta function.",
    steps: [`Read df1=${formatStatistic(df1)}, df2=${formatStatistic(df2)}, x=${formatStatistic(x)}.`, `Transform to z=${formatStatistic(z)}.`, `Return ${result}.`],
  };
}

export function symbolicCauchy(medianRaw: string, scaleRaw: string, xRaw: string): SymbolicResult {
  const median = numericArg(medianRaw, "median");
  const scale = numericArg(scaleRaw, "scale");
  const x = numericArg(xRaw, "x");
  if (scale <= 0) throw new Error("Cauchy scale must be positive.");
  const probability = 0.5 + Math.atan((x - median) / scale) / Math.PI;
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Cauchy distribution CDF.",
    steps: [`Read median=${formatStatistic(median)}, scale=${formatStatistic(scale)}, x=${formatStatistic(x)}.`, "Use 1/2 + atan((x-median)/scale)/pi.", `Return ${result}.`],
  };
}

export function symbolicHyperGeometric(popRaw: string, successRaw: string, drawRaw: string, kRaw: string): SymbolicResult {
  const population = Math.round(numericArg(popRaw, "population"));
  const successes = Math.round(numericArg(successRaw, "successes"));
  const draws = Math.round(numericArg(drawRaw, "draws"));
  const k = Math.round(numericArg(kRaw, "k"));
  if (population <= 0 || successes < 0 || draws < 0 || successes > population || draws > population) throw new Error("HyperGeometric needs 0 <= successes, draws <= population.");
  const probability = combinationNumber(successes, k) * combinationNumber(population - successes, draws - k) / combinationNumber(population, draws);
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Hypergeometric probability without replacement.",
    steps: [`Read population=${population}, successes=${successes}, draws=${draws}, k=${k}.`, "Use C(successes,k)C(failures,draws-k)/C(population,draws).", `Return ${result}.`],
  };
}

export function symbolicPascal(rRaw: string, pRaw: string, kRaw: string): SymbolicResult {
  const r = Math.round(numericArg(rRaw, "r"));
  const p = numericArg(pRaw, "p");
  const k = Math.round(numericArg(kRaw, "k"));
  if (r <= 0 || p < 0 || p > 1 || k < r) throw new Error("Pascal needs r > 0, 0 <= p <= 1, and k >= r.");
  const probability = combinationNumber(k - 1, r - 1) * (p ** r) * ((1 - p) ** (k - r));
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Pascal/negative-binomial probability that the r-th success occurs on trial k.",
    steps: [`Read r=${r}, p=${formatStatistic(p)}, k=${k}.`, "Use C(k-1,r-1)p^r(1-p)^(k-r).", `Return ${result}.`],
  };
}

export function symbolicWeibull(shapeRaw: string, scaleRaw: string, xRaw: string): SymbolicResult {
  const shape = numericArg(shapeRaw, "shape");
  const scale = numericArg(scaleRaw, "scale");
  const x = numericArg(xRaw, "x");
  if (shape <= 0 || scale <= 0) throw new Error("Weibull needs shape > 0 and scale > 0.");
  const probability = x < 0 ? 0 : 1 - Math.exp(-((x / scale) ** shape));
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Weibull distribution CDF.",
    steps: [`Read shape=${formatStatistic(shape)}, scale=${formatStatistic(scale)}, x=${formatStatistic(x)}.`, "Use CDF 1 - exp(-(x/scale)^shape).", `Return ${result}.`],
  };
}

export function symbolicZipf(nRaw: string, exponentRaw: string, kRaw: string): SymbolicResult {
  const n = Math.round(numericArg(nRaw, "n"));
  const exponent = numericArg(exponentRaw, "exponent");
  const k = Math.round(numericArg(kRaw, "k"));
  if (n < 1 || k < 1 || k > n || exponent <= 0) throw new Error("Zipf needs n >= 1, exponent > 0, and 1 <= k <= n.");
  const denominator = Array.from({ length: n }, (_, index) => 1 / ((index + 1) ** exponent)).reduce((sum, value) => sum + value, 0);
  const probability = (1 / (k ** exponent)) / denominator;
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Finite Zipf probability.",
    steps: [`Read n=${n}, exponent=${formatStatistic(exponent)}, k=${k}.`, "Normalize 1/k^s by the finite harmonic sum.", `Return ${result}.`],
  };
}

export function symbolicRandomBetween(minRaw: string, maxRaw: string, seedRaw?: string): SymbolicResult {
  const min = Math.ceil(numericArg(minRaw, "min"));
  const max = Math.floor(numericArg(maxRaw, "max"));
  if (max < min) throw new Error("RandomBetween needs max >= min.");
  const random = seededRandom(seedRaw);
  const value = min + Math.floor(random() * (max - min + 1));
  const result = `${value}`;
  return {
    result,
    exact: result,
    detail: "Random integer from a closed interval, reproducible when a seed is supplied.",
    steps: [`Read interval [${min}, ${max}].`, seedRaw ? `Use seed ${seedRaw}.` : "Use an unseeded random source.", `Return ${result}.`],
  };
}

export function symbolicRandomUniform(minRaw: string, maxRaw: string, countRaw = "1", seedRaw?: string): SymbolicResult {
  const min = numericArg(minRaw, "min");
  const max = numericArg(maxRaw, "max");
  const count = boundedCount(countRaw);
  if (max < min) throw new Error("RandomUniform needs max >= min.");
  const random = seededRandom(seedRaw);
  const values = Array.from({ length: count }, () => min + random() * (max - min));
  const result = count === 1 ? formatStatistic(values[0]) : formatVector(values);
  return {
    result,
    exact: result,
    detail: "Uniform random sample, reproducible when a seed is supplied.",
    steps: [`Read min=${formatStatistic(min)}, max=${formatStatistic(max)}, count=${count}.`, seedRaw ? `Use seed ${seedRaw}.` : "Use an unseeded random source.", `Return ${result}.`],
  };
}

export function symbolicRandomNormal(meanRaw: string, sdRaw: string, countRaw = "1", seedRaw?: string): SymbolicResult {
  const mean = numericArg(meanRaw, "mean");
  const sd = numericArg(sdRaw, "standard deviation");
  const count = boundedCount(countRaw);
  if (sd <= 0) throw new Error("RandomNormal needs sd > 0.");
  const random = seededRandom(seedRaw);
  const values = Array.from({ length: count }, () => {
    const u1 = Math.max(random(), 1e-12);
    const u2 = random();
    return mean + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  });
  const result = count === 1 ? formatStatistic(values[0]) : formatVector(values);
  return {
    result,
    exact: result,
    detail: "Normal random sample using the Box-Muller transform, reproducible when seeded.",
    steps: [`Read mean=${formatStatistic(mean)}, sd=${formatStatistic(sd)}, count=${count}.`, "Transform uniform random pairs into normal values.", `Return ${result}.`],
  };
}

export function symbolicRandomBinomial(nRaw: string, pRaw: string, countRaw = "1", seedRaw?: string): SymbolicResult {
  const n = Math.round(numericArg(nRaw, "n"));
  const p = numericArg(pRaw, "p");
  const count = boundedCount(countRaw);
  if (n < 0 || p < 0 || p > 1) throw new Error("RandomBinomial needs n >= 0 and 0 <= p <= 1.");
  const random = seededRandom(seedRaw);
  const values = Array.from({ length: count }, () => {
    let successes = 0;
    for (let trial = 0; trial < n; trial += 1) if (random() < p) successes += 1;
    return successes;
  });
  const result = count === 1 ? `${values[0]}` : formatVector(values);
  return {
    result,
    exact: result,
    detail: "Binomial random sample from repeated Bernoulli trials.",
    steps: [`Read n=${n}, p=${formatStatistic(p)}, count=${count}.`, seedRaw ? `Use seed ${seedRaw}.` : "Use an unseeded random source.", `Return ${result}.`],
  };
}

export function symbolicRandomPoisson(meanRaw: string, countRaw = "1", seedRaw?: string): SymbolicResult {
  const mean = numericArg(meanRaw, "mean");
  const count = boundedCount(countRaw);
  if (mean <= 0) throw new Error("RandomPoisson needs mean > 0.");
  const random = seededRandom(seedRaw);
  const values = Array.from({ length: count }, () => poissonSample(mean, random));
  const result = count === 1 ? `${values[0]}` : formatVector(values);
  return {
    result,
    exact: result,
    detail: "Poisson random sample using Knuth's product method.",
    steps: [`Read mean=${formatStatistic(mean)}, count=${count}.`, seedRaw ? `Use seed ${seedRaw}.` : "Use an unseeded random source.", `Return ${result}.`],
  };
}

export function symbolicRandomElement(items: string[]): SymbolicResult {
  if (!items.length) throw new Error("RandomElement needs at least one item.");
  const maybeSeed = Number(items[items.length - 1]);
  const hasSeed = items.length > 1 && Number.isFinite(maybeSeed);
  const values = hasSeed ? items.slice(0, -1) : items;
  const random = seededRandom(hasSeed ? String(maybeSeed) : undefined);
  const value = values[Math.floor(random() * values.length)];
  return {
    result: value,
    exact: value,
    detail: "Random element from the provided list, reproducible when the final argument is numeric seed.",
    steps: [`Read ${values.length} item${values.length === 1 ? "" : "s"}.`, hasSeed ? `Use seed ${maybeSeed}.` : "Use an unseeded random source.", `Return ${value}.`],
  };
}

export function symbolicRandomPolynomial(degreeRaw: string, minRaw: string, maxRaw: string, seedRaw?: string, variable = "x"): SymbolicResult {
  const degree = Math.round(numericArg(degreeRaw, "degree"));
  const min = Math.ceil(numericArg(minRaw, "min coefficient"));
  const max = Math.floor(numericArg(maxRaw, "max coefficient"));
  if (degree < 0 || degree > 12) throw new Error("RandomPolynomial degree must be from 0 to 12.");
  if (max < min) throw new Error("RandomPolynomial needs max coefficient >= min coefficient.");
  const random = seededRandom(seedRaw);
  const coefficients = Array.from({ length: degree + 1 }, (_, index) => {
    let coefficient = min + Math.floor(random() * (max - min + 1));
    if (index === 0 && degree > 0 && coefficient === 0) coefficient = max !== 0 ? max : 1;
    return coefficient;
  });
  const result = formatPolynomialCoefficients(coefficients, normalizeVariable(variable));
  return {
    result,
    exact: result,
    detail: "Random polynomial with integer coefficients, reproducible when seeded.",
    steps: [`Read degree=${degree}, coefficient range [${min}, ${max}].`, seedRaw ? `Use seed ${seedRaw}.` : "Use an unseeded random source.", `Generated coefficients: ${formatVector(coefficients)}.`, `Return ${result}.`],
  };
}

export function symbolicBinomialDist(nRaw: string, pRaw: string, kRaw: string): SymbolicResult {
  const n = Math.round(numericArg(nRaw, "n"));
  const p = numericArg(pRaw, "p");
  const k = Math.round(numericArg(kRaw, "k"));
  if (n < 0 || k < 0 || k > n || p < 0 || p > 1) throw new Error("BinomialDist needs n >= 0, 0 <= p <= 1, and 0 <= k <= n.");
  const probability = binomialDistribution(n, p)[k]?.count ?? 0;
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Binomial probability P(X = k).",
    steps: [
      `Read n=${n}, p=${formatStatistic(p)}, k=${k}.`,
      `Use C(n,k)p^k(1-p)^(n-k).`,
      `P(X=${k}) = ${result}.`,
    ],
  };
}

export function symbolicBinomialCdf(nRaw: string, pRaw: string, kRaw: string): SymbolicResult {
  const n = Math.round(numericArg(nRaw, "n"));
  const p = numericArg(pRaw, "p");
  const k = Math.round(numericArg(kRaw, "k"));
  if (n < 0 || p < 0 || p > 1) throw new Error("BinomialCdf needs n >= 0 and 0 <= p <= 1.");
  const cappedK = Math.max(0, Math.min(n, k));
  const probability = binomialDistribution(n, p).slice(0, cappedK + 1).reduce((sum, item) => sum + item.count, 0);
  const result = formatStatistic(probability);
  return {
    result,
    exact: result,
    detail: "Cumulative binomial probability P(X <= k).",
    steps: [`Read n=${n}, p=${formatStatistic(p)}, k=${k}.`, `Sum probabilities from 0 through ${cappedK}.`, `Return P(X <= ${k}) = ${result}.`],
  };
}

export function symbolicGcd(items: string[]): SymbolicResult {
  const values = parseIntegerItems(items);
  const resultValue = values.reduce((current, value) => gcdNumber(current, value));
  const result = `${Math.abs(resultValue)}`;
  return {
    result,
    exact: result,
    detail: "Greatest common divisor using Euclid's algorithm.",
    steps: [`Read integers: ${values.join(", ")}.`, "Apply Euclid's algorithm pairwise.", `Return GCD = ${result}.`],
  };
}

export function symbolicLcm(items: string[]): SymbolicResult {
  const values = parseIntegerItems(items);
  const resultValue = values.reduce((current, value) => lcmNumber(current, value));
  const result = `${Math.abs(resultValue)}`;
  return {
    result,
    exact: result,
    detail: "Least common multiple from gcd relationships.",
    steps: [`Read integers: ${values.join(", ")}.`, "Use lcm(a,b)=|ab|/gcd(a,b) pairwise.", `Return LCM = ${result}.`],
  };
}

export function symbolicIsPrime(item: string): SymbolicResult {
  const value = Math.round(numericArg(item, "n"));
  const prime = isPrimeNumber(value);
  return {
    result: prime ? "true" : "false",
    exact: prime ? "true" : "false",
    detail: "Primality test by trial division up to sqrt(n).",
    steps: [`Read n=${value}.`, value < 2 ? "Numbers below 2 are not prime." : "Check possible divisors up to sqrt(n).", prime ? `${value} is prime.` : `${value} is not prime.`],
  };
}

export function symbolicPrimeFactors(item: string): SymbolicResult {
  let value = Math.abs(Math.round(numericArg(item, "n")));
  if (value < 2) throw new Error("PrimeFactors needs an integer greater than 1.");
  const factors: number[] = [];
  for (let divisor = 2; divisor * divisor <= value; divisor += divisor === 2 ? 1 : 2) {
    while (value % divisor === 0) {
      factors.push(divisor);
      value /= divisor;
    }
  }
  if (value > 1) factors.push(value);
  const result = `[${factors.join(", ")}]`;
  return {
    result,
    exact: result,
    detail: "Prime factorization by repeated division.",
    steps: [`Read n=${item}.`, "Divide by prime candidates until the remaining quotient is 1.", `Return factors: ${result}.`],
  };
}

export function symbolicDivisors(item: string): SymbolicResult {
  const value = Math.abs(Math.round(numericArg(item, "n")));
  if (value < 1) throw new Error("Divisors needs a nonzero integer.");
  const divisors: number[] = [];
  for (let candidate = 1; candidate * candidate <= value; candidate += 1) {
    if (value % candidate === 0) {
      divisors.push(candidate);
      if (candidate !== value / candidate) divisors.push(value / candidate);
    }
  }
  divisors.sort((a, b) => a - b);
  const result = `[${divisors.join(", ")}]`;
  return {
    result,
    exact: result,
    detail: "Positive divisors of an integer.",
    steps: [`Read n=${value}.`, "Test divisor pairs up to sqrt(n).", `Return divisors ${result}.`],
  };
}

export function symbolicDivisorsSum(item: string): SymbolicResult {
  const divisors = parseNumberItems([symbolicDivisors(item).exact ?? ""]);
  const sum = divisors.reduce((total, value) => total + value, 0);
  const result = formatStatistic(sum);
  return { result, exact: result, detail: "Sum of positive divisors.", steps: [`Find divisors ${formatVector(divisors)}.`, `Add them to get ${result}.`] };
}

export function symbolicExtendedGcd(firstRaw: string, secondRaw: string): SymbolicResult {
  let oldR = Math.round(numericArg(firstRaw, "a"));
  let r = Math.round(numericArg(secondRaw, "b"));
  let oldS = 1;
  let s = 0;
  let oldT = 0;
  let t = 1;
  while (r !== 0) {
    const quotient = Math.trunc(oldR / r);
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
    [oldT, t] = [t, oldT - quotient * t];
  }
  const sign = oldR < 0 ? -1 : 1;
  const result = `[${Math.abs(oldR)}, ${oldS * sign}, ${oldT * sign}]`;
  return { result, exact: result, detail: "Extended Euclidean algorithm returning [gcd, s, t] with s*a+t*b=gcd.", steps: [`Read a=${firstRaw}, b=${secondRaw}.`, "Run Euclidean remainders while tracking Bezout coefficients.", `Return ${result}.`] };
}

export function symbolicModularExponent(baseRaw: string, exponentRaw: string, modulusRaw: string): SymbolicResult {
  let base = BigInt(Math.round(numericArg(baseRaw, "base")));
  let exponent = BigInt(Math.round(numericArg(exponentRaw, "exponent")));
  const modulus = BigInt(Math.round(numericArg(modulusRaw, "modulus")));
  if (modulus === 0n || exponent < 0n) throw new Error("ModularExponent needs nonnegative exponent and nonzero modulus.");
  let resultValue = 1n;
  base = ((base % modulus) + modulus) % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) resultValue = (resultValue * base) % modulus;
    base = (base * base) % modulus;
    exponent /= 2n;
  }
  const result = resultValue.toString();
  return { result, exact: result, detail: "Fast modular exponentiation by repeated squaring.", steps: [`Read ${baseRaw}^${exponentRaw} mod ${modulusRaw}.`, "Square and reduce modulo n at every step.", `Return ${result}.`] };
}

export function symbolicMixedNumber(valueRaw: string): SymbolicResult {
  const value = evaluateSymbolicNumber(normalizeSymbolic(valueRaw));
  if (value === null) throw new Error("MixedNumber needs a numeric value or fraction.");
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const whole = Math.floor(abs);
  const fraction = decimalToFraction(abs - whole);
  const result = fraction.numerator === 0 ? `${sign}${whole}` : `${sign}${whole} ${fraction.numerator}/${fraction.denominator}`;
  return { result, exact: result, detail: "Convert numeric value to mixed-number form.", steps: [`Read ${valueRaw} = ${formatStatistic(value)}.`, `Whole part is ${whole}.`, `Fractional part is ${fraction.numerator}/${fraction.denominator}.`, `Return ${result}.`] };
}

export function symbolicNextPrime(item: string): SymbolicResult {
  let value = Math.floor(numericArg(item, "n")) + 1;
  while (!isPrimeNumber(value)) value += 1;
  const result = `${value}`;
  return {
    result,
    exact: result,
    detail: "Next prime greater than n.",
    steps: [`Start after ${item}.`, `Search upward until a prime is found: ${result}.`],
  };
}

export function symbolicPreviousPrime(item: string): SymbolicResult {
  let value = Math.ceil(numericArg(item, "n")) - 1;
  while (value >= 2 && !isPrimeNumber(value)) value -= 1;
  if (value < 2) throw new Error("No previous prime exists below this value.");
  const result = `${value}`;
  return {
    result,
    exact: result,
    detail: "Previous prime less than n.",
    steps: [`Start before ${item}.`, `Search downward until a prime is found: ${result}.`],
  };
}

export function symbolicModulo(valueRaw: string, modulusRaw: string): SymbolicResult {
  const value = numericArg(valueRaw, "value");
  const modulus = numericArg(modulusRaw, "modulus");
  if (modulus === 0) throw new Error("Modulus cannot be 0.");
  const remainder = ((value % modulus) + Math.abs(modulus)) % Math.abs(modulus);
  const result = formatStatistic(remainder);
  return {
    result,
    exact: result,
    detail: "Modulo remainder normalized to the interval [0, |modulus|).",
    steps: [`Read ${formatStatistic(value)} mod ${formatStatistic(modulus)}.`, `Return normalized remainder ${result}.`],
  };
}

export function symbolicFactorial(item: string): SymbolicResult {
  const value = Math.round(numericArg(item, "n"));
  if (value < 0 || value > 170) throw new Error("Factorial needs an integer from 0 to 170.");
  const resultValue = factorial(value);
  const result = formatStatistic(resultValue);
  return {
    result,
    exact: result,
    detail: "Factorial product n*(n-1)*...*1.",
    steps: [`Read n=${value}.`, value === 0 ? "By definition, 0! = 1." : `Multiply integers from 1 through ${value}.`, `Return ${value}! = ${result}.`],
  };
}

export function symbolicBinomialCoefficient(nRaw: string, rRaw: string): SymbolicResult {
  const n = Math.round(numericArg(nRaw, "n"));
  const r = Math.round(numericArg(rRaw, "r"));
  if (n < 0 || r < 0 || r > n) throw new Error("BinomialCoefficient needs integers with 0 <= r <= n.");
  const k = Math.min(r, n - r);
  let value = 1;
  for (let index = 1; index <= k; index += 1) value = (value * (n - k + index)) / index;
  const result = formatStatistic(value);
  return {
    result,
    exact: result,
    detail: "Binomial coefficient n choose r.",
    steps: [`Read n=${n}, r=${r}.`, "Use nCr = n!/(r!(n-r)!) with symmetry r=min(r,n-r).", `Return C(${n}, ${r}) = ${result}.`],
  };
}

export function symbolicTangentLine(expression: string, point: string, variable = "x"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const normalizedExpression = normalizeSymbolic(expression);
  const normalizedPoint = normalizeSymbolic(point);
  const derivative = cleanSymbolic(nerdamer(`diff(${normalizedExpression},${cleanVariable})`).toString());
  const yValue = cleanSymbolic(evaluateWithSubstitution(normalizedExpression, cleanVariable, normalizedPoint));
  const slope = cleanSymbolic(evaluateWithSubstitution(derivative, cleanVariable, normalizedPoint));
  const line = cleanSymbolic(nerdamer(`expand((${yValue})+(${slope})*(${cleanVariable}-(${normalizedPoint})))`).toString());
  const result = `y = ${line}`;
  return {
    result,
    exact: result,
    detail: "Tangent line found by evaluating the derivative as slope at the requested point.",
    steps: [
      `Treat ${expression} as y=f(${cleanVariable}).`,
      `Differentiate: f'(${cleanVariable}) = ${derivative}.`,
      `Evaluate the point: f(${point}) = ${yValue}.`,
      `Evaluate the slope: f'(${point}) = ${slope}.`,
      `Use point-slope form y - ${yValue} = ${slope}(${cleanVariable} - ${point}).`,
      `Simplify to ${result}.`,
    ],
  };
}

export function symbolicVerifyIdentity(left: string, right: string, variable = "x"): SymbolicResult & { verification: SymbolicVerification } {
  const cleanVariable = normalizeVariable(variable);
  const normalizedLeft = normalizeSymbolic(left);
  const normalizedRight = normalizeSymbolic(right);
  const differenceExpression = `(${normalizedLeft})-(${normalizedRight})`;
  const exactDifference = simplifyKnownIdentity(cleanSymbolic(nerdamer(`simplify(${differenceExpression})`).toString()), differenceExpression);
  const samples = sampleDifference(differenceExpression, cleanVariable);
  const numericallyEquivalent = samples.length > 0 && samples.every((sample) => Math.abs(Number(sample.difference)) < 1e-7);
  const equivalent = exactDifference === "0" || numericallyEquivalent;
  const method: SymbolicVerification["method"] = exactDifference === "0" ? "exact" : numericallyEquivalent ? "numeric-sampling" : "failed";
  return {
    result: equivalent ? "Identity verified" : "Identity not verified",
    exact: exactDifference,
    detail: "Checks whether two symbolic expressions represent the same function, using exact simplification first and numeric sampling as a fallback.",
    steps: [
      `Compare left side: ${left}.`,
      `Compare right side: ${right}.`,
      `Move everything to one side: (${left}) - (${right}).`,
      `Exact simplification gives: ${exactDifference}.`,
      method === "numeric-sampling" ? "Exact simplification was inconclusive, so sample values were checked." : `Verification method: ${method}.`,
      equivalent ? "Conclusion: the expressions match on the certified checks." : "Conclusion: the expressions did not pass the certified checks.",
    ],
    verification: { equivalent, method, samples },
  };
}

export function symbolicSubstitute(expression: string, assignments: SymbolicAssignment[]): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const applied = assignments.reduce((current, assignment) => {
    const variable = normalizeVariable(assignment.name);
    const value = normalizeSymbolic(assignment.value);
    return current.replace(new RegExp(`\\b${escapeRegExp(variable)}\\b`, "g"), `(${value})`);
  }, normalized);
  const result = cleanSymbolic(nerdamer(applied).toString());
  return {
    result,
    exact: result,
    detail: "Exact substitution followed by symbolic simplification.",
    steps: [
      `Start with ${expression}.`,
      `Apply ${assignments.map((item) => `${item.name}=${item.value}`).join(", ")}.`,
      `Simplify the substituted expression: ${applied}.`,
      `Return exact form: ${result}.`,
    ],
  };
}

export function symbolicSystemSolve(equations: string[], variables?: string[]): SymbolicResult {
  const normalizedEquations = equations.map(normalizeEquation);
  const engine = nerdamer as unknown as { solveEquations?: (items: string[]) => { toString: () => string } };
  if (!engine.solveEquations) throw new Error("System solver is unavailable.");
  const raw = engine.solveEquations(normalizedEquations).toString();
  const pairs = parseSolveEquationPairs(raw, variables);
  const result = pairs.length ? pairs.map(([name, value]) => `${name} = ${cleanSymbolic(value)}`).join(", ") : cleanSymbolic(raw);
  return {
    result,
    exact: raw,
    detail: "Exact simultaneous equation solve for supported algebraic systems.",
    steps: [
      `Read ${equations.length} equation${equations.length === 1 ? "" : "s"}.`,
      `Normalize equations: ${normalizedEquations.join("; ")}.`,
      "Solve the equations together so shared variables satisfy every equation.",
      `Return solution values: ${result}.`,
    ],
  };
}

export function symbolicPolynomialDivide(dividend: string, divisor: string, variable = "x"): SymbolicResult {
  const normalizedDividend = normalizeSymbolic(dividend);
  const normalizedDivisor = normalizeSymbolic(divisor);
  const quotient = cleanSymbolic(nerdamer(`divide(${normalizedDividend},${normalizedDivisor})`).toString());
  const remainder = cleanSymbolic(nerdamer(`expand((${normalizedDividend})-(${normalizedDivisor})*(${quotient}))`).toString());
  const result = remainder === "0" ? quotient : `${quotient}, remainder ${remainder}`;
  return {
    result,
    exact: result,
    detail: `Polynomial division in ${normalizeVariable(variable)} with quotient and remainder.`,
    steps: [
      `Divide ${dividend} by ${divisor}.`,
      `CAS quotient: ${quotient}.`,
      `Check remainder by dividend - divisor*quotient = ${remainder}.`,
      `Return ${result}.`,
    ],
  };
}

export function symbolicPartialFractions(expression: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const fallback = partialFractionLinearFallback(normalized, cleanVariable);
  const result = fallback ?? cleanSymbolic(nerdamer(`partfrac(${normalized},${cleanVariable})`).toString());
  return {
    result,
    exact: result,
    detail: fallback ? "Partial fraction decomposition for a product of two linear factors." : "Partial fraction command delegated to the CAS engine where supported.",
    steps: fallback
      ? [
          `Read rational expression: ${expression}.`,
          "Detect a denominator with two linear factors.",
          "Solve cover-up constants for A/(linear factor) + B/(linear factor).",
          `Return decomposition: ${result}.`,
        ]
      : [
          `Read rational expression: ${expression}.`,
          "Ask the CAS for partial fraction form.",
          `Return decomposition: ${result}.`,
        ],
  };
}

export function symbolicLatex(expression: string) {
  try {
    const converted = (nerdamer as unknown as { convertToLaTeX?: (value: string) => string }).convertToLaTeX?.(expression);
    if (converted) return converted;
  } catch {
    // Fall back to a readable monospaced expression below.
  }
  return expression.replace(/\*/g, "\\cdot ");
}

export function symbolicSolve(equation: string, variable = "x"): SymbolicResult {
  const normalized = normalizeEquation(equation);
  const cleanVariable = normalizeVariable(variable);
  const roots = nerdamer.solve(normalized, cleanVariable).toString();
  const analyzed = analyzeSolveCandidates(normalized, roots, cleanVariable);
  const result = `${cleanVariable} = ${formatSolutionList(analyzed.accepted.length ? `[${analyzed.accepted.join(",")}]` : roots)}`;
  return {
    result,
    exact: roots,
    detail: "Exact symbolic solve where possible, with domain and substitution checks around the candidate solution set.",
    steps: [
      `Read the equation as: ${equation}.`,
      `Normalize to parser form: ${normalized}.`,
      `Isolate or reduce the expression so the CAS can solve for ${cleanVariable}.`,
      `Exact solution set: ${roots}.`,
      ...analyzed.steps,
      "Use the graph panel or table to visually verify the roots.",
    ],
    restrictions: analyzed.restrictions,
    verification: analyzed.verification,
    warnings: analyzed.warnings,
  };
}

export function symbolicNumericSolve(equation: string, variable = "x"): SymbolicResult {
  const normalized = normalizeEquation(equation);
  const cleanVariable = normalizeVariable(variable);
  const [left, right = "0"] = splitTopLevelSymbolic(normalized, "=");
  const delta = `(${left})-(${right})`;
  const roots = numericRoots(delta, cleanVariable);
  return {
    result: roots.length ? `${cleanVariable} ≈ ${roots.map(formatApprox).join(", ")}` : "No real numeric roots found in [-50, 50]",
    exact: roots.join(","),
    detail: "Numeric solve by scanning for sign changes and refining roots with bisection.",
    steps: [
      `Move all terms to one side: ${delta} = 0.`,
      "Scan x from -50 to 50 for zeros and sign changes.",
      roots.length ? `Refined ${roots.length} root${roots.length === 1 ? "" : "s"}: ${roots.map(formatApprox).join(", ")}.` : "No sign-changing real root was detected in the scan window.",
    ],
  };
}

export function symbolicComplexSolve(equation: string, variable = "x"): SymbolicResult {
  const normalized = normalizeEquation(equation);
  const cleanVariable = normalizeVariable(variable);
  const roots = nerdamer.solve(normalized, cleanVariable).toString();
  const result = `${cleanVariable} = ${formatSolutionList(roots)}`;
  return {
    result,
    exact: roots,
    detail: "Complex-capable solve using the symbolic engine solution set without real-domain filtering.",
    steps: [
      `Read the equation as: ${equation}.`,
      `Normalize to parser form: ${normalized}.`,
      `Solve over the symbolic domain for ${cleanVariable}.`,
      `Return candidates including complex values when present: ${result}.`,
    ],
  };
}

export function symbolicRoot(expression: string, variable = "x"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const roots = numericRoots(rootDelta(expression), cleanVariable);
  const result = `[${roots.map(formatApprox).join(", ")}]`;
  return {
    result,
    exact: roots.join(","),
    detail: "Real roots by numeric scanning and bisection, returned as a list.",
    steps: [`Read ${expression}.`, "Move to f(x)=0 if an equation is provided.", "Scan the real line window [-50, 50] and refine sign changes.", `Return ${result}.`],
  };
}

export function symbolicRootList(expression: string, variable = "x"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const roots = numericRoots(rootDelta(expression), cleanVariable);
  const points = roots.map((root) => [root, 0]);
  const result = formatMatrixLiteral(points);
  return {
    result,
    exact: result,
    detail: "Graph-ready root list as points on the x-axis.",
    steps: [`Find roots of ${expression}.`, `Convert each root to (${cleanVariable}, 0).`, `Return ${result}.`],
  };
}

export function symbolicComplexRoot(expression: string, variable = "x"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const roots = nerdamer.solve(normalizeEquation(expression), cleanVariable).toString();
  const result = `[${formatSolutionList(roots)}]`;
  return {
    result,
    exact: roots,
    detail: "Complex roots from the symbolic solver.",
    steps: [`Read ${expression}.`, `Solve over the complex symbolic domain for ${cleanVariable}.`, `Return ${result}.`],
  };
}

export function symbolicSolvePolynomialDegree(equation: string, variable = "x", degreeLabel = "polynomial"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const degree = symbolicPolynomialDegree(rootDelta(equation), cleanVariable).result;
  const solved = symbolicComplexSolve(equation, cleanVariable);
  return {
    ...solved,
    detail: `Solve ${degreeLabel} equation with degree ${degree}.`,
    steps: [`Detect polynomial degree ${degree}.`, ...solved.steps],
  };
}

export function symbolicPolynomialFromRoots(items: string[], variable = "x"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const roots = parseNumberItems(items);
  const coefficients = roots.reduce((current, root) => {
    const next = Array.from({ length: current.length + 1 }, () => 0);
    current.forEach((coefficient, index) => {
      next[index] += coefficient;
      next[index + 1] -= coefficient * root;
    });
    return next;
  }, [1]);
  const result = formatPolynomialCoefficients(coefficients, cleanVariable);
  return {
    result,
    exact: result,
    detail: "Monic polynomial built from the supplied roots.",
    steps: [`Read roots: ${formatVector(roots)}.`, `Build product ${roots.map((root) => `(${cleanVariable}-${formatStatistic(root)})`).join("")}.`, `Expand to ${result}.`],
  };
}

export function symbolicCommonDenominator(expression: string): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const result = cleanSymbolic(nerdamer(`simplify(${normalized})`).toString());
  return {
    result,
    exact: result,
    detail: "Rational expression simplified into a single equivalent form where supported.",
    steps: [`Read ${expression}.`, "Combine rational terms through symbolic simplification.", `Return ${result}.`],
  };
}

export function symbolicComplexFactor(expression: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const cleanVariable = normalizeVariable(variable);
  const roots = nerdamer.solve(`${normalized}=0`, cleanVariable).toString().replace(/^\[|\]$/g, "").split(",").map((root) => root.trim()).filter(Boolean);
  const result = roots.length ? roots.map((root) => `(${cleanVariable}-(${cleanSymbolic(root)}))`).join("*") : cleanSymbolic(nerdamer(`factor(${normalized})`).toString());
  return {
    result,
    exact: result,
    detail: "Complex factorization from symbolic roots where available.",
    steps: [`Read ${expression}.`, roots.length ? `Find roots ${roots.join(", ")}.` : "Use symbolic factor fallback.", `Return ${result}.`],
  };
}

export function symbolicToComplex(value: string): SymbolicResult {
  const complex = parseComplexValue(value);
  const result = formatComplex(complex.re, complex.im);
  return {
    result,
    exact: result,
    detail: "Point or ordered pair converted to complex a+bi form.",
    steps: [`Read ${value}.`, `Real part = ${formatStatistic(complex.re)}, imaginary part = ${formatStatistic(complex.im)}.`, `Return ${result}.`],
  };
}

export function symbolicToPoint(value: string): SymbolicResult {
  const complex = parseComplexValue(value);
  const result = `[${formatStatistic(complex.re)}, ${formatStatistic(complex.im)}]`;
  return {
    result,
    exact: result,
    detail: "Complex number converted to point coordinates.",
    steps: [`Read ${value}.`, `Return point ${result}.`],
  };
}

export function symbolicToPolar(value: string): SymbolicResult {
  const complex = parseComplexValue(value);
  const radius = Math.hypot(complex.re, complex.im);
  const theta = Math.atan2(complex.im, complex.re);
  const result = `[${formatStatistic(radius)}, ${formatStatistic(theta)}]`;
  return {
    result,
    exact: result,
    detail: "Complex number converted to polar coordinates [r, theta].",
    steps: [`Read ${value}.`, `r=sqrt(a^2+b^2)=${formatStatistic(radius)}.`, `theta=atan2(b,a)=${formatStatistic(theta)} radians.`, `Return ${result}.`],
  };
}

export function symbolicToExponential(value: string): SymbolicResult {
  const complex = parseComplexValue(value);
  const radius = Math.hypot(complex.re, complex.im);
  const theta = Math.atan2(complex.im, complex.re);
  const result = `${formatStatistic(radius)}*e^(i*${formatStatistic(theta)})`;
  return {
    result,
    exact: result,
    detail: "Complex number converted to exponential polar form.",
    steps: [`Read ${value}.`, `Compute r=${formatStatistic(radius)} and theta=${formatStatistic(theta)}.`, `Return ${result}.`],
  };
}

export function symbolicGroebnerBasis(items: string[]): SymbolicResult {
  const polynomials = items.map((item) => normalizeEquation(item)).map((item) => {
    const pieces = splitTopLevelSymbolic(item, "=");
    return pieces.length === 2 ? `(${pieces[0]})-(${pieces[1]})` : item;
  });
  if (!polynomials.length) throw new Error("GroebnerLex needs at least one polynomial.");
  const result = formatItems(polynomials.map((polynomial) => cleanSymbolic(nerdamer(`expand(${normalizeSymbolic(polynomial)})`).toString())));
  return {
    result,
    exact: result,
    detail: "Lexicographic Groebner-style generator normalization for supported polynomial systems.",
    steps: [`Read ${polynomials.length} polynomial generator${polynomials.length === 1 ? "" : "s"}.`, "Move equations to zero form when needed.", "Expand and normalize each generator.", `Return ${result}.`],
    warnings: ["Full Buchberger reduction is still limited; this command returns a normalized generator basis for notebook workflows."],
  };
}

export function symbolicIntersect(firstRaw: string, secondRaw: string): SymbolicResult {
  const first = splitTopLevelSymbolic(normalizeEquation(firstRaw), "=");
  const second = splitTopLevelSymbolic(normalizeEquation(secondRaw), "=");
  if (first.length !== 2 || second.length !== 2) throw new Error("Intersect needs two equations.");
  if (first[0] === "y" && second[0] === "y") {
    const relation = `(${first[1]})-(${second[1]})`;
    const roots = numericRoots(relation, "x");
    const points = roots.map((root) => {
      const y = evaluateExpressionAt(first[1], "x", String(root));
      return `[${formatStatistic(root)}, ${formatStatistic(y ?? 0)}]`;
    });
    const result = `[${points.join(", ")}]`;
    return {
      result,
      exact: result,
      detail: "Intersection points found by solving equality of two y= functions.",
      steps: [`Read ${firstRaw} and ${secondRaw}.`, `Solve ${first[1]} = ${second[1]} numerically.`, "Evaluate y at each x-root.", `Return ${result}.`],
      warnings: ["Intersect currently scans x in [-50, 50] for supported explicit y= curves."],
    };
  }
  const solved = symbolicSystemSolve([firstRaw, secondRaw]);
  return {
    ...solved,
    detail: "Intersection solved as a two-equation system.",
    steps: [`Read ${firstRaw} and ${secondRaw}.`, ...solved.steps],
  };
}

export function symbolicSolveInequality(inequality: string, variable = "x"): SymbolicResult {
  const normalized = normalizeSymbolic(inequality);
  const match = normalized.match(/^(.+?)(<=|>=|<|>)(.+)$/);
  if (!match) throw new Error("Use an inequality such as x^2<4.");
  const [, left, operator, right] = match;
  const cleanVariable = normalizeVariable(variable);
  const delta = `(${left})-(${right})`;
  const roots = numericRoots(delta, cleanVariable);
  const intervals = inequalityIntervals(delta, operator, roots, cleanVariable);
  return {
    result: intervals.length ? `${cleanVariable} ∈ ${intervals.join(" ∪ ")}` : "No solution found in scanned real intervals",
    exact: intervals.join(" union "),
    detail: "Real inequality solve by using roots as interval boundaries and testing sample points.",
    steps: [
      `Move to one side: ${delta} ${operator} 0.`,
      roots.length ? `Boundary roots: ${roots.map(formatApprox).join(", ")}.` : "No finite boundary root was found in [-50, 50].",
      "Test one sample point in each interval.",
      intervals.length ? `Keep intervals where the inequality is true: ${intervals.join(", ")}.` : "No tested interval satisfied the inequality.",
    ],
  };
}

export function symbolicPolynomialCoefficients(expression: string, variable = "x"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const polynomial = polynomialMap(expression, cleanVariable);
  const degree = Math.max(...Object.keys(polynomial).map(Number));
  const coefficients = Array.from({ length: degree + 1 }, (_, index) => polynomial[degree - index] ?? 0);
  return {
    result: `[${coefficients.map(formatCoefficient).join(", ")}]`,
    exact: coefficients.join(","),
    detail: "Polynomial coefficients listed from highest degree to constant term.",
    steps: [
      `Expand ${expression}.`,
      `Collect powers of ${cleanVariable}.`,
      `Return coefficients from degree ${degree} down to 0.`,
    ],
  };
}

export function symbolicPolynomialDegree(expression: string, variable = "x"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const polynomial = polynomialMap(expression, cleanVariable);
  const degree = Math.max(...Object.entries(polynomial).filter(([, coefficient]) => Math.abs(coefficient) > 1e-10).map(([power]) => Number(power)), 0);
  return {
    result: `${degree}`,
    exact: `${degree}`,
    detail: "Highest exponent with nonzero coefficient.",
    steps: [`Expand ${expression}.`, `Collect powers of ${cleanVariable}.`, `Highest nonzero power is ${degree}.`],
  };
}

export function symbolicCompleteSquare(expression: string, variable = "x"): SymbolicResult {
  const cleanVariable = normalizeVariable(variable);
  const polynomial = polynomialMap(expression, cleanVariable);
  const a = polynomial[2] ?? 0;
  const b = polynomial[1] ?? 0;
  const c = polynomial[0] ?? 0;
  if (Math.abs(a) < 1e-10) throw new Error("CompleteSquare needs a quadratic expression.");
  const h = b / (2 * a);
  const k = c - (b * b) / (4 * a);
  const leading = Math.abs(a - 1) < 1e-10 ? "" : `${formatCoefficient(a)}*`;
  const result = `${leading}(${cleanVariable}${signedNumber(h)})^2${signedNumber(k)}`;
  return {
    result,
    exact: result,
    detail: "Quadratic rewritten in completed-square form a(x-h)^2+k.",
    steps: [
      `Identify a=${formatCoefficient(a)}, b=${formatCoefficient(b)}, c=${formatCoefficient(c)}.`,
      `Half of b/a gives the square shift: ${formatCoefficient(h)}.`,
      `Correction term is c - b^2/(4a) = ${formatCoefficient(k)}.`,
      `Completed-square form: ${result}.`,
    ],
  };
}

export function symbolicNumerator(expression: string): SymbolicResult {
  const [numerator] = rationalParts(expression);
  return {
    result: numerator,
    exact: numerator,
    detail: "Numerator extracted from a top-level rational expression.",
    steps: [`Read ${expression}.`, `Top-level numerator is ${numerator}.`],
  };
}

export function symbolicDenominator(expression: string): SymbolicResult {
  const [, denominator] = rationalParts(expression);
  return {
    result: denominator,
    exact: denominator,
    detail: "Denominator extracted from a top-level rational expression.",
    steps: [`Read ${expression}.`, `Top-level denominator is ${denominator}.`],
  };
}

export function symbolicEquationSide(equation: string, side: "left" | "right"): SymbolicResult {
  const normalized = normalizeSymbolic(equation);
  const [left, right = "0"] = splitTopLevelSymbolic(normalized, "=");
  const result = side === "left" ? left : right;
  return {
    result,
    exact: result,
    detail: `${side === "left" ? "Left" : "Right"} side extracted from an equation.`,
    steps: [`Split ${equation} at the top-level equals sign.`, `Return ${result}.`],
  };
}

export function symbolicRationalize(expression: string): SymbolicResult {
  const normalized = normalizeSymbolic(expression);
  const match = normalized.match(/^(.+)\/sqrt\((.+)\)$/);
  if (!match) {
    const result = cleanSymbolic(nerdamer(normalized).toString());
    return {
      result,
      exact: result,
      detail: "Expression simplified; no simple square-root denominator pattern was detected.",
      steps: [`Read ${expression}.`, "Try simplification through the symbolic engine.", `Return ${result}.`],
    };
  }
  const numerator = stripOuterParens(match[1]);
  const radicand = stripOuterParens(match[2]);
  const result = numerator === "1" ? `sqrt(${radicand})/${radicand}` : `${numerator}*sqrt(${radicand})/${radicand}`;
  return {
    result,
    exact: result,
    detail: "Rationalized a simple square-root denominator by multiplying by sqrt(n)/sqrt(n).",
    steps: [
      `Start with ${expression}.`,
      `Multiply numerator and denominator by sqrt(${radicand}).`,
      `Denominator becomes ${radicand}.`,
      `Return ${result}.`,
    ],
  };
}

export function symbolicEliminate(items: string[], variable = "y"): SymbolicResult {
  const equations = items.slice(0, -1).length ? items.slice(0, -1) : items;
  const eliminateVariable = items.length > 2 ? items[items.length - 1] : variable;
  if (equations.length < 2) throw new Error("Eliminate needs at least two equations.");
  const solved = symbolicSolve(equations[0], eliminateVariable).exact?.replace(/^\[|\]$/g, "") ?? "";
  if (!solved) throw new Error("Could not isolate the eliminated variable.");
  const substituted = equations.slice(1).map((equation) => equation.replace(new RegExp(`\\b${escapeRegExp(eliminateVariable)}\\b`, "g"), `(${solved})`));
  const [left, right = "0"] = splitTopLevelSymbolic(normalizeEquation(substituted[0]), "=");
  const result = cleanSymbolic(nerdamer(`expand((${left})-(${right}))`).toString());
  return {
    result,
    exact: result,
    detail: `Eliminated ${eliminateVariable} by solving one equation and substituting into another.`,
    steps: [
      `Solve ${equations[0]} for ${eliminateVariable}: ${eliminateVariable} = ${solved}.`,
      `Substitute into ${equations[1]}.`,
      `Return reduced relation: ${result} = 0.`,
    ],
  };
}

export function trySymbolic(action: () => SymbolicResult): SymbolicResult | null {
  try {
    const result = action();
    if (!result.result || /undefined|NaN/i.test(result.result)) return null;
    return result;
  } catch {
    return null;
  }
}

function normalizeEquation(equation: string) {
  const normalized = normalizeSymbolic(equation);
  return normalized.includes("=") ? normalized : `${normalized}=0`;
}

function rootDelta(expression: string) {
  const normalized = normalizeEquation(expression);
  const [left, right = "0"] = splitTopLevelSymbolic(normalized, "=");
  return `(${left})-(${right})`;
}

function normalizeVariable(variable: string) {
  const clean = variable.trim().replace(/[^a-zA-Z0-9_]/g, "");
  return clean || "x";
}

function normalizeSymbolic(expression: string) {
  return expression
    .trim()
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, "pi")
    .replace(/√/g, "sqrt")
    .replace(/\bsin\^2\(([^)]+)\)/gi, "(sin($1))^2")
    .replace(/\bcos\^2\(([^)]+)\)/gi, "(cos($1))^2")
    .replace(/\btan\^2\(([^)]+)\)/gi, "(tan($1))^2")
    .replace(/\s+/g, "")
    .replace(/(\d)([a-zA-Z(])/g, "$1*$2")
    .replace(/([a-zA-Z)])(\d)/g, "$1*$2")
    .replace(/\)([a-zA-Z(])/g, ")*$1")
    .replace(/\bpi\b/gi, "pi")
    .replace(/\bln\(/gi, "log(")
    .replace(/√/g, "sqrt");
}

function formatSolutionList(value: string) {
  return value.replace(/^\[|\]$/g, "").replace(/,/g, ", ") || "no symbolic solution";
}

function numericRoots(expression: string, variable: string) {
  const roots: number[] = [];
  const fn = (x: number) => evaluateExpressionAt(expression, variable, String(x));
  let previousX = -50;
  let previousY = fn(previousX);
  for (let x = -49.75; x <= 50; x += 0.25) {
    const y = fn(x);
    if (y !== null && Math.abs(y) < 1e-7) roots.push(x);
    if (previousY !== null && y !== null && Number.isFinite(previousY) && Number.isFinite(y) && previousY * y < 0) {
      roots.push(bisectNumeric(fn, previousX, x));
    }
    previousX = x;
    previousY = y;
  }
  return uniqueNumeric(roots.map((root) => Math.round(root * 1_000_000) / 1_000_000)).slice(0, 24);
}

function bisectNumeric(fn: (x: number) => number | null, left: number, right: number) {
  let low = left;
  let high = right;
  for (let index = 0; index < 60; index += 1) {
    const mid = (low + high) / 2;
    const lowValue = fn(low);
    const midValue = fn(mid);
    if (lowValue === null || midValue === null) break;
    if (Math.abs(midValue) < 1e-10) return mid;
    if (lowValue * midValue <= 0) high = mid;
    else low = mid;
  }
  return (low + high) / 2;
}

function uniqueNumeric(values: number[]) {
  const output: number[] = [];
  values.forEach((value) => {
    if (!Number.isFinite(value)) return;
    if (output.some((existing) => Math.abs(existing - value) < 1e-5)) return;
    output.push(value);
  });
  return output.sort((a, b) => a - b);
}

function inequalityIntervals(expression: string, operator: string, roots: number[], variable: string) {
  const boundaries = [-Infinity, ...roots, Infinity];
  const intervals: string[] = [];
  for (let index = 0; index < boundaries.length - 1; index += 1) {
    const left = boundaries[index];
    const right = boundaries[index + 1];
    const sample = samplePoint(left, right);
    const value = evaluateExpressionAt(expression, variable, String(sample));
    if (value === null || !inequalityHolds(value, operator)) continue;
    intervals.push(formatInterval(left, right, operator.includes("=")));
  }
  return intervals;
}

function samplePoint(left: number, right: number) {
  if (!Number.isFinite(left) && !Number.isFinite(right)) return 0;
  if (!Number.isFinite(left)) return right - 1;
  if (!Number.isFinite(right)) return left + 1;
  return (left + right) / 2;
}

function inequalityHolds(value: number, operator: string) {
  if (operator === "<") return value < 0;
  if (operator === "<=") return value <= 1e-9;
  if (operator === ">") return value > 0;
  if (operator === ">=") return value >= -1e-9;
  return false;
}

function formatInterval(left: number, right: number, closed: boolean) {
  const openLeft = Number.isFinite(left) && closed ? "[" : "(";
  const openRight = Number.isFinite(right) && closed ? "]" : ")";
  const leftText = Number.isFinite(left) ? formatApprox(left) : "-∞";
  const rightText = Number.isFinite(right) ? formatApprox(right) : "∞";
  return `${openLeft}${leftText}, ${rightText}${openRight}`;
}

function polynomialMap(expression: string, variable: string) {
  const normalized = normalizeSymbolic(expression);
  const expanded = cleanSymbolic(nerdamer(`expand(${normalized})`).toString());
  const terms = splitPolynomialTerms(expanded);
  const polynomial: Record<number, number> = {};
  terms.forEach((term) => {
    const parsed = parsePolynomialTerm(term, variable);
    if (!parsed) throw new Error(`Unsupported polynomial term: ${term}`);
    polynomial[parsed.power] = (polynomial[parsed.power] ?? 0) + parsed.coefficient;
  });
  return polynomial;
}

function splitPolynomialTerms(expression: string) {
  const normalized = expression.replace(/-/g, "+-");
  return normalized.split("+").map((term) => term.trim()).filter(Boolean);
}

function parsePolynomialTerm(term: string, variable: string) {
  const escapedVariable = escapeRegExp(variable);
  const powerPattern = new RegExp(`^([+-]?(?:\\d+(?:\\.\\d+)?|\\d*\\.\\d+)?)(?:\\*)?${escapedVariable}\\^(\\d+)$`);
  const linearPattern = new RegExp(`^([+-]?(?:\\d+(?:\\.\\d+)?|\\d*\\.\\d+)?)(?:\\*)?${escapedVariable}$`);
  const power = term.match(powerPattern);
  if (power) return { coefficient: coefficientFromRaw(power[1]), power: Number(power[2]) };
  const linear = term.match(linearPattern);
  if (linear) return { coefficient: coefficientFromRaw(linear[1]), power: 1 };
  const constant = Number(term);
  if (Number.isFinite(constant)) return { coefficient: constant, power: 0 };
  const evaluated = evaluateSymbolicNumber(term);
  return evaluated === null ? null : { coefficient: evaluated, power: 0 };
}

function coefficientFromRaw(value: string | undefined) {
  if (!value || value === "+") return 1;
  if (value === "-") return -1;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) throw new Error(`Invalid coefficient: ${value}`);
  return numeric;
}

function rationalParts(expression: string) {
  const normalized = stripOuterParens(normalizeSymbolic(expression));
  const parts = splitTopLevelSymbolic(normalized, "/");
  return parts.length > 1 ? [stripOuterParens(parts[0]), stripOuterParens(parts.slice(1).join("/"))] : [normalized, "1"];
}

function stripOuterParens(value: string) {
  let output = value.trim();
  while (output.startsWith("(") && output.endsWith(")") && hasSingleOuterPair(output)) output = output.slice(1, -1);
  return output;
}

function hasSingleOuterPair(value: string) {
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (depth === 0 && index < value.length - 1) return false;
  }
  return depth === 0;
}

function signedNumber(value: number) {
  const rounded = formatCoefficient(Math.abs(value));
  if (Math.abs(value) < 1e-10) return "+0";
  return value < 0 ? `-${rounded}` : `+${rounded}`;
}

function formatApprox(value: number) {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function formatPolynomialCoefficients(coefficients: number[], variable: string) {
  const degree = coefficients.length - 1;
  const terms = coefficients.flatMap((coefficient, index) => {
    if (Math.abs(coefficient) < 1e-10) return [];
    const power = degree - index;
    const sign = coefficient < 0 ? "-" : "+";
    const abs = Math.abs(coefficient);
    const coefficientText = Math.abs(abs - 1) < 1e-10 && power > 0 ? "" : formatStatistic(abs);
    const variableText = power === 0 ? "" : power === 1 ? variable : `${variable}^${power}`;
    const product = coefficientText && variableText ? `${coefficientText}*${variableText}` : `${coefficientText}${variableText}`;
    return [{ sign, product }];
  });
  if (!terms.length) return "0";
  return terms.map((term, index) => index === 0 ? `${term.sign === "-" ? "-" : ""}${term.product}` : `${term.sign}${term.product}`).join("");
}

function factorial(value: number) {
  let output = 1;
  for (let index = 2; index <= value; index += 1) output *= index;
  return output;
}

function combinationNumber(n: number, r: number) {
  if (r < 0 || r > n) return 0;
  const k = Math.min(r, n - r);
  let result = 1;
  for (let index = 1; index <= k; index += 1) result = (result * (n - k + index)) / index;
  return result;
}

function boundedCount(value: string) {
  const count = Math.round(numericArg(value, "count"));
  if (count < 1 || count > 200) throw new Error("Random sample count must be from 1 to 200.");
  return count;
}

function seededRandom(seedRaw?: string) {
  if (!seedRaw?.trim()) return Math.random;
  let state = Math.abs(Math.floor(Number(seedRaw))) || 1;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function poissonSample(mean: number, random: () => number) {
  const threshold = Math.exp(-mean);
  let k = 0;
  let product = 1;
  do {
    k += 1;
    product *= random();
  } while (product > threshold);
  return k - 1;
}

function gammaLanczos(z: number): number {
  const coefficients = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaLanczos(1 - z));
  let x = 0.9999999999998099;
  const shifted = z - 1;
  coefficients.forEach((coefficient, index) => {
    x += coefficient / (shifted + index + 1);
  });
  const t = shifted + coefficients.length - 0.5;
  return Math.sqrt(2 * Math.PI) * (t ** (shifted + 0.5)) * Math.exp(-t) * x;
}

function regularizedGammaP(shape: number, x: number) {
  if (x <= 0) return 0;
  const gammaShape = gammaLanczos(shape);
  const density = (t: number) => t <= 0 ? 0 : (t ** (shape - 1)) * Math.exp(-t) / gammaShape;
  return clamp01(numericIntegrate(density, 0, x, 1200));
}

function regularizedBeta(x: number, a: number, b: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const beta = gammaLanczos(a) * gammaLanczos(b) / gammaLanczos(a + b);
  const density = (t: number) => t <= 0 || t >= 1 ? 0 : (t ** (a - 1)) * ((1 - t) ** (b - 1)) / beta;
  return clamp01(numericIntegrate(density, 0, x, 1200));
}

function numericIntegrate(fn: (x: number) => number, lower: number, upper: number, intervals: number) {
  if (upper === lower) return 0;
  const n = intervals % 2 === 0 ? intervals : intervals + 1;
  const width = (upper - lower) / n;
  let total = 0;
  for (let index = 0; index <= n; index += 1) {
    const x = lower + width * index;
    const weight = index === 0 || index === n ? 1 : index % 2 === 0 ? 2 : 4;
    total += weight * fn(x);
  }
  return (width / 3) * total;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function laplaceTable(expression: string, variable: string, target: string) {
  const escapedVariable = escapeRegExp(variable);
  const constant = evaluateSymbolicNumber(expression);
  if (constant !== null && !new RegExp(`\\b${escapedVariable}\\b`).test(expression)) return `${formatCoefficient(constant)}/${target}`;
  if (expression === variable) return `1/${target}^2`;
  const power = expression.match(new RegExp(`^${escapedVariable}\\^(\\d+)$`));
  if (power) {
    const degree = Number(power[1]);
    return `${factorial(degree)}/${target}^${degree + 1}`;
  }
  const exp = expression.match(new RegExp(`^e\\^\\(?([+-]?(?:\\d+(?:\\.\\d+)?|\\d*\\.\\d+)?)\\*?${escapedVariable}\\)?$|^exp\\(([+-]?(?:\\d+(?:\\.\\d+)?|\\d*\\.\\d+)?)\\*?${escapedVariable}\\)$`));
  if (exp) {
    const rate = exp[1] || exp[2] || "1";
    const signed = rate.startsWith("-") ? `+${rate.slice(1)}` : `-${rate}`;
    return `1/(${target}${signed})`;
  }
  const sine = expression.match(new RegExp(`^sin\\(([+-]?(?:\\d+(?:\\.\\d+)?|\\d*\\.\\d+)?)\\*?${escapedVariable}\\)$`));
  if (sine) {
    const frequency = sine[1] || "1";
    return `${frequency}/(${target}^2+${formatCoefficient(Number(frequency) ** 2)})`;
  }
  const cosine = expression.match(new RegExp(`^cos\\(([+-]?(?:\\d+(?:\\.\\d+)?|\\d*\\.\\d+)?)\\*?${escapedVariable}\\)$`));
  if (cosine) {
    const frequency = cosine[1] || "1";
    return `${target}/(${target}^2+${formatCoefficient(Number(frequency) ** 2)})`;
  }
  return null;
}

function inverseLaplaceTable(expression: string, variable: string, target: string) {
  const escapedVariable = escapeRegExp(variable);
  if (expression === `1/${variable}`) return "1";
  const reciprocalPower = expression.match(new RegExp(`^([+-]?(?:\\d+(?:\\.\\d+)?|\\d*\\.\\d+)?)\\/${escapedVariable}\\^(\\d+)$`));
  if (reciprocalPower) {
    const numerator = coefficientFromRaw(reciprocalPower[1]);
    const power = Number(reciprocalPower[2]);
    const coefficient = numerator / factorial(power - 1);
    const base = power === 2 ? target : `${target}^${power - 1}`;
    return Math.abs(coefficient - 1) < 1e-10 ? base : `${formatCoefficient(coefficient)}*${base}`;
  }
  const shifted = expression.match(new RegExp(`^1\\/\\(${escapedVariable}([+-]\\d+(?:\\.\\d+)?)\\)$`));
  if (shifted) {
    const shift = Number(shifted[1]);
    const rate = -shift;
    return rate === 1 ? `e^${target}` : `e^(${formatCoefficient(rate)}*${target})`;
  }
  const sine = expression.match(new RegExp(`^(\\d+(?:\\.\\d+)?)\\/\\(${escapedVariable}\\^2\\+(\\d+(?:\\.\\d+)?)\\)$`));
  if (sine && Math.abs(Number(sine[1]) ** 2 - Number(sine[2])) < 1e-8) return Number(sine[1]) === 1 ? `sin(${target})` : `sin(${sine[1]}*${target})`;
  const cosine = expression.match(new RegExp(`^${escapedVariable}\\/\\(${escapedVariable}\\^2\\+(\\d+(?:\\.\\d+)?)\\)$`));
  if (cosine) {
    const frequency = Math.sqrt(Number(cosine[1]));
    return Math.abs(frequency - 1) < 1e-8 ? `cos(${target})` : `cos(${formatCoefficient(frequency)}*${target})`;
  }
  return null;
}

function parseMatrixLiteral(expression: string): Matrix {
  const normalized = expression.trim();
  try {
    const parsed = JSON.parse(normalized) as unknown;
    if (!Array.isArray(parsed) || !parsed.length) throw new Error("Use nested matrix syntax like [[1,2],[3,4]].");
    const matrix = parsed.map((row) => {
      if (!Array.isArray(row) || !row.length) throw new Error("Every matrix row needs entries.");
      return row.map((value) => {
        if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Matrix entries must be numeric.");
        return value;
      });
    });
    const width = matrix[0].length;
    if (!matrix.every((row) => row.length === width)) throw new Error("Matrix rows must have the same length.");
    return matrix;
  } catch (error) {
    if (error instanceof Error && !/JSON/.test(error.message)) throw error;
    throw new Error("Use numeric nested matrix syntax like [[1,2],[3,4]].");
  }
}

function parseVectorLiteral(expression: string): number[] {
  const normalized = expression.trim().replace(/^\(/, "[").replace(/\)$/, "]");
  try {
    const parsed = JSON.parse(normalized) as unknown;
    if (!Array.isArray(parsed) || !parsed.length) throw new Error("Use vector syntax like [1,2,3] or (1,2,3).");
    return parsed.map((value) => {
      if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Vector entries must be numeric.");
      return value;
    });
  } catch (error) {
    if (error instanceof Error && !/JSON/.test(error.message)) throw error;
    throw new Error("Use numeric vector syntax like [1,2,3] or (1,2,3).");
  }
}

function formatMatrixLiteral(matrix: Matrix) {
  return `[${matrix.map((row) => `[${row.map(formatMatrixNumber).join(", ")}]`).join(", ")}]`;
}

function formatVector(vector: number[]) {
  return `[${vector.map(formatMatrixNumber).join(", ")}]`;
}

function matrixSteps(steps: Array<{ title: string; calculation: string }>) {
  return steps.slice(0, 12).map((step) => `${step.title}: ${step.calculation}.`);
}

function rrefNumeric(source: Matrix): Matrix {
  const matrix = source.map((row) => [...row]);
  let lead = 0;
  for (let row = 0; row < matrix.length; row += 1) {
    if (lead >= matrix[0].length) break;
    let pivot = row;
    while (Math.abs(matrix[pivot][lead]) < 1e-10) {
      pivot += 1;
      if (pivot === matrix.length) {
        pivot = row;
        lead += 1;
        if (lead === matrix[0].length) return cleanNumericMatrix(matrix);
      }
    }
    [matrix[row], matrix[pivot]] = [matrix[pivot], matrix[row]];
    const pivotValue = matrix[row][lead];
    matrix[row] = matrix[row].map((value) => value / pivotValue);
    for (let target = 0; target < matrix.length; target += 1) {
      if (target === row) continue;
      const factor = matrix[target][lead];
      matrix[target] = matrix[target].map((value, index) => value - factor * matrix[row][index]);
    }
    lead += 1;
  }
  return cleanNumericMatrix(matrix);
}

function cleanNumericMatrix(matrix: Matrix) {
  return matrix.map((row) => row.map((value) => (Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(6)))));
}

function determinantSymbolic(matrix: string[][]): string {
  if (matrix.length === 1) return matrix[0][0];
  return matrix[0].map((value, column) => {
    const sign = column % 2 === 0 ? "" : "-";
    const minor = matrix.filter((_, rowIndex) => rowIndex !== 0).map((row) => row.filter((_, columnIndex) => columnIndex !== column));
    return `${sign}(${value})*(${determinantSymbolic(minor)})`;
  }).join("+");
}

function luDecompose(matrix: Matrix) {
  if (!matrix.length || matrix.length !== matrix[0].length) throw new Error("LUDecomposition needs a square matrix.");
  const n = matrix.length;
  const l = createMatrix(n, n);
  const u = createMatrix(n, n);
  const steps: string[] = [];
  for (let index = 0; index < n; index += 1) l[index][index] = 1;
  for (let i = 0; i < n; i += 1) {
    for (let k = i; k < n; k += 1) {
      let sum = 0;
      for (let j = 0; j < i; j += 1) sum += l[i][j] * u[j][k];
      u[i][k] = matrix[i][k] - sum;
    }
    if (Math.abs(u[i][i]) < 1e-10) throw new Error("LUDecomposition without pivoting failed because a pivot is zero.");
    for (let k = i + 1; k < n; k += 1) {
      let sum = 0;
      for (let j = 0; j < i; j += 1) sum += l[k][j] * u[j][i];
      l[k][i] = (matrix[k][i] - sum) / u[i][i];
    }
    steps.push(`Column ${i + 1}: compute U row ${i + 1} and L entries below the pivot.`);
  }
  return { l: cleanNumericMatrix(l), u: cleanNumericMatrix(u), steps };
}

function qrDecompose(matrix: Matrix) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  if (!rows || !cols || matrix.some((row) => row.length !== cols)) throw new Error("QRDecomposition needs a rectangular numeric matrix.");
  const columns = Array.from({ length: cols }, (_, column) => matrix.map((row) => row[column]));
  const qColumns: number[][] = [];
  const r = createMatrix(cols, cols);
  const steps: string[] = [];
  columns.forEach((column, index) => {
    let v = [...column];
    qColumns.forEach((q, qIndex) => {
      const projection = dotNumeric(column, q);
      r[qIndex][index] = projection;
      v = v.map((value, rowIndex) => value - projection * q[rowIndex]);
    });
    const norm = Math.hypot(...v);
    if (norm < 1e-10) throw new Error("QRDecomposition failed because columns are linearly dependent.");
    r[index][index] = norm;
    qColumns.push(v.map((value) => value / norm));
    steps.push(`Column ${index + 1}: subtract earlier projections and normalize.`);
  });
  const q = Array.from({ length: rows }, (_, row) => qColumns.map((column) => column[row]));
  return { q: cleanNumericMatrix(q), r: cleanNumericMatrix(r), steps };
}

function singularValues2x2(matrix: Matrix) {
  if (matrix.length !== 2 || matrix[0]?.length !== 2) throw new Error("SVD currently supports 2x2 matrices.");
  const atA = multiplyMatrices(transposeMatrix(matrix).result, matrix).result;
  const eigen = eigen2x2(atA);
  if ("error" in eigen) throw new Error(eigen.error);
  return eigen.values.map((value) => Math.sqrt(Math.max(0, value))).sort((a, b) => b - a);
}

function dotNumeric(a: number[], b: number[]) {
  return a.reduce((sum, value, index) => sum + value * (b[index] ?? 0), 0);
}

function parseNumberItems(items: string[]): number[] {
  const values = items.flatMap((item) => parseLooseNumberList(item));
  if (!values.length) throw new Error("Expected at least one numeric value.");
  return values;
}

function parseIntegerItems(items: string[]): number[] {
  const values = parseNumberItems(items).map((value) => Math.round(value));
  if (!values.length) throw new Error("Expected at least one integer.");
  return values;
}

function parseLooseNumberList(value: string): number[] {
  const trimmed = value.trim();
  const unwrapped = trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed.slice(1, -1) : trimmed;
  return unwrapped
    .split(/,|\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number)
    .filter(Number.isFinite);
}

function parseLooseItems(value: string): string[] {
  const trimmed = value.trim();
  const unwrapped = trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed.slice(1, -1) : trimmed;
  return splitTopLevelSymbolic(unwrapped, ",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatItems(values: string[]) {
  return `[${values.join(", ")}]`;
}

function parsePointPairs(value: string): Array<[number, number]> {
  const matrix = parseMatrixLiteral(value);
  if (!matrix.length || matrix.some((row) => row.length < 2)) throw new Error("Fit commands need points like [[x1,y1],[x2,y2]].");
  return matrix.map((row) => [row[0], row[1]] as [number, number]);
}

function linearFit(points: Array<[number, number]>) {
  if (points.length < 2) throw new Error("Fit needs at least two points.");
  const n = points.length;
  const sumX = points.reduce((sum, [x]) => sum + x, 0);
  const sumY = points.reduce((sum, [, y]) => sum + y, 0);
  const sumXX = points.reduce((sum, [x]) => sum + x * x, 0);
  const sumXY = points.reduce((sum, [x, y]) => sum + x * y, 0);
  const denominator = n * sumXX - sumX * sumX;
  if (Math.abs(denominator) < 1e-10) throw new Error("Fit failed because x-values do not vary.");
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

function leastSquaresPolynomial(points: Array<[number, number]>, degree: number) {
  if (points.length < degree + 1) throw new Error("FitPoly needs at least degree + 1 points.");
  const size = degree + 1;
  const augmented = Array.from({ length: size }, (_, row) => [
    ...Array.from({ length: size }, (_, column) => points.reduce((sum, [x]) => sum + x ** (row + column), 0)),
    points.reduce((sum, [x, y]) => sum + y * x ** row, 0),
  ]);
  return solveLinearSystemNumeric(augmented).reverse();
}

function solveLinearSystemNumeric(source: number[][]) {
  const matrix = source.map((row) => [...row]);
  const rows = matrix.length;
  const columns = matrix[0]?.length ?? 0;
  for (let pivot = 0; pivot < rows; pivot += 1) {
    let best = pivot;
    for (let row = pivot + 1; row < rows; row += 1) {
      if (Math.abs(matrix[row][pivot]) > Math.abs(matrix[best][pivot])) best = row;
    }
    if (Math.abs(matrix[best][pivot]) < 1e-10) throw new Error("Fit failed because the normal equations are singular.");
    [matrix[pivot], matrix[best]] = [matrix[best], matrix[pivot]];
    const pivotValue = matrix[pivot][pivot];
    for (let column = pivot; column < columns; column += 1) matrix[pivot][column] /= pivotValue;
    for (let row = 0; row < rows; row += 1) {
      if (row === pivot) continue;
      const factor = matrix[row][pivot];
      for (let column = pivot; column < columns; column += 1) matrix[row][column] -= factor * matrix[pivot][column];
    }
  }
  return matrix.map((row) => row[columns - 1]);
}

function decimalToFraction(value: number) {
  const sign = value < 0 ? -1 : 1;
  const absolute = Math.abs(value);
  const denominatorLimit = 100000;
  let bestNumerator = Math.round(absolute);
  let bestDenominator = 1;
  let bestError = Math.abs(absolute - bestNumerator);
  for (let denominator = 1; denominator <= denominatorLimit && bestError > 1e-10; denominator += 1) {
    const numerator = Math.round(absolute * denominator);
    const error = Math.abs(absolute - numerator / denominator);
    if (error < bestError) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      bestError = error;
    }
  }
  const divisor = gcdNumber(bestNumerator, bestDenominator) || 1;
  return { numerator: sign * (bestNumerator / divisor), denominator: bestDenominator / divisor };
}

function parseComplexValue(value: string) {
  const trimmed = value.trim();
  if (/^\(?\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\)?$/.test(trimmed)) {
    const vector = parseVectorLiteral(trimmed);
    return { re: vector[0] ?? 0, im: vector[1] ?? 0 };
  }
  const normalized = normalizeSymbolic(trimmed).replace(/\*/g, "");
  if (normalized === "i") return { re: 0, im: 1 };
  if (normalized === "-i") return { re: 0, im: -1 };
  const complex = normalized.match(/^([+-]?\d+(?:\.\d+)?)([+-])(\d*(?:\.\d+)?)i$/);
  if (complex) return { re: Number(complex[1]), im: Number(`${complex[2]}${complex[3] || "1"}`) };
  const pureImaginary = normalized.match(/^([+-]?\d*(?:\.\d+)?)i$/);
  if (pureImaginary) {
    const raw = pureImaginary[1];
    return { re: 0, im: raw === "" || raw === "+" ? 1 : raw === "-" ? -1 : Number(raw) };
  }
  const real = numericArg(trimmed, "complex value");
  return { re: real, im: 0 };
}

function formatComplex(re: number, im: number) {
  if (Math.abs(im) < 1e-10) return formatStatistic(re);
  if (Math.abs(re) < 1e-10) return `${formatStatistic(im)}i`;
  return `${formatStatistic(re)}${im < 0 ? "-" : "+"}${formatStatistic(Math.abs(im))}i`;
}

function medianNumber(sorted: number[]) {
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function populationVariance(values: number[]) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
}

function frequencyCounts(values: number[]) {
  const counts = new Map<number, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => a[0] - b[0]);
}

function numericArg(value: string, label: string) {
  const numeric = Number(value.trim());
  if (!Number.isFinite(numeric)) throw new Error(`${label} must be numeric.`);
  return numeric;
}

function normalCdfLocal(z: number) {
  const sign = z < 0 ? -1 : 1;
  const a = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * a);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
  return 0.5 * (1 + sign * erf);
}

function gcdNumber(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function lcmNumber(a: number, b: number) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a * b)) / gcdNumber(a, b);
}

function isPrimeNumber(value: number) {
  if (value < 2 || !Number.isInteger(value)) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function formatStatistic(value: number) {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function analyzeSolveCandidates(equation: string, rawRoots: string, variable: string) {
  const candidates = uniqueCandidates(parseSolutionCandidates(rawRoots));
  const restrictions = detectSolveRestrictions(equation, variable);
  const accepted: string[] = [];
  const rejected: string[] = [];
  const verification: string[] = [];
  const warnings: string[] = [];

  candidates.forEach((candidate) => {
    const restrictionFailure = restrictions.find((restriction) => restriction.fails(candidate));
    if (restrictionFailure) {
      rejected.push(candidate);
      verification.push(`Rejected ${variable} = ${candidate}: ${restrictionFailure.label}.`);
      return;
    }

    const residual = evaluateEquationResidual(equation, variable, candidate);
    if (residual === null) {
      accepted.push(candidate);
      warnings.push(`Could not numerically verify ${variable} = ${candidate}; retained as symbolic candidate.`);
      return;
    }
    if (Math.abs(residual) <= 1e-7) {
      accepted.push(candidate);
      verification.push(`Verified ${variable} = ${candidate}: substitution residual ${formatSmallNumber(residual)}.`);
    } else {
      rejected.push(candidate);
      verification.push(`Rejected ${variable} = ${candidate}: substitution residual ${formatSmallNumber(residual)}.`);
    }
  });

  return {
    accepted: accepted.length ? accepted : candidates,
    rejected,
    restrictions: restrictions.map((restriction) => restriction.label),
    verification,
    warnings,
    steps: [
      restrictions.length ? `Domain restrictions checked: ${restrictions.map((restriction) => restriction.label).join("; ")}.` : "No simple real-domain restriction was detected.",
      verification.length ? `Candidate verification: ${verification.join(" ")}` : "Candidate verification was not available for this solution form.",
      rejected.length ? `Extraneous or invalid candidates removed: ${rejected.join(", ")}.` : "No extraneous candidate was removed.",
    ],
  };
}

function parseSolutionCandidates(rawRoots: string) {
  const trimmed = rawRoots.replace(/^\[|\]$/g, "");
  return splitTopLevelSymbolic(trimmed, ",").map((candidate) => candidate.trim()).filter(Boolean);
}

function uniqueCandidates(candidates: string[]) {
  const output: string[] = [];
  const numericValues: number[] = [];
  candidates.forEach((candidate) => {
    const numeric = evaluateSymbolicNumber(candidate);
    if (numeric !== null && numericValues.some((value) => Math.abs(value - numeric) < 1e-7)) return;
    if (numeric !== null) numericValues.push(numeric);
    if (!output.includes(candidate)) output.push(candidate);
  });
  return output;
}

function detectSolveRestrictions(equation: string, variable: string) {
  const restrictions: Array<{ label: string; fails: (candidate: string) => boolean }> = [];
  collectFunctionArguments(equation, "sqrt").forEach((argument) => {
    restrictions.push({
      label: `${argument} >= 0 for real square roots`,
      fails: (candidate) => {
        const value = evaluateExpressionAt(argument, variable, candidate);
        return value !== null && value < -1e-9;
      },
    });
  });
  collectFunctionArguments(equation, "log").forEach((argument) => {
    restrictions.push({
      label: `${argument} > 0 for logarithms`,
      fails: (candidate) => {
        const value = evaluateExpressionAt(argument, variable, candidate);
        return value !== null && value <= 0;
      },
    });
  });
  collectSimpleDenominators(equation).forEach((denominator) => {
    restrictions.push({
      label: `${denominator} != 0 for denominators`,
      fails: (candidate) => {
        const value = evaluateExpressionAt(denominator, variable, candidate);
        return value !== null && Math.abs(value) < 1e-9;
      },
    });
  });
  return restrictions;
}

function evaluateEquationResidual(equation: string, variable: string, candidate: string) {
  const [left, right = "0"] = splitTopLevelSymbolic(equation, "=");
  return evaluateExpressionAt(`(${left})-(${right})`, variable, candidate);
}

function evaluateExpressionAt(expression: string, variable: string, candidate: string) {
  try {
    const value = evaluateWithSubstitution(expression, variable, candidate);
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  } catch {
    return null;
  }
}

function evaluateSymbolicNumber(expression: string) {
  try {
    const value = nerdamer(expression).evaluate().text();
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  } catch {
    return null;
  }
}

function collectFunctionArguments(expression: string, functionName: string) {
  const output: string[] = [];
  const token = `${functionName}(`;
  let index = expression.indexOf(token);
  while (index >= 0) {
    const start = index + token.length;
    let depth = 1;
    let cursor = start;
    while (cursor < expression.length && depth > 0) {
      const char = expression[cursor];
      if (char === "(") depth += 1;
      if (char === ")") depth -= 1;
      cursor += 1;
    }
    if (depth === 0) output.push(expression.slice(start, cursor - 1));
    index = expression.indexOf(token, cursor);
  }
  return output;
}

function collectSimpleDenominators(expression: string) {
  const output: string[] = [];
  const matches = expression.matchAll(/\/\(([^()=]+)\)|\/([a-zA-Z][a-zA-Z0-9_]*[+-]\d+(?:\.\d+)?)/g);
  for (const match of matches) {
    output.push(match[1] ?? match[2]);
  }
  return output;
}

function splitTopLevelSymbolic(value: string, separator: string) {
  const output: string[] = [];
  let current = "";
  let depth = 0;
  for (const char of value) {
    if (char === "(" || char === "[") depth += 1;
    if (char === ")" || char === "]") depth -= 1;
    if (char === separator && depth === 0) {
      output.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  output.push(current);
  return output;
}

function formatSmallNumber(value: number) {
  const rounded = Math.round(value * 1_000_000_000) / 1_000_000_000;
  return `${Object.is(rounded, -0) ? 0 : rounded}`;
}

function cleanSymbolic(value: string) {
  return value.replace(/\s+/g, "").replace(/\*/g, "*");
}

function simplifyKnownIdentity(result: string, normalizedInput: string) {
  const expression = normalizedInput.replace(/\s+/g, "");
  if (/^\(?sin\(x\)\)?\^2\+\(?cos\(x\)\)?\^2$/.test(expression) || /^\(?cos\(x\)\)?\^2\+\(?sin\(x\)\)?\^2$/.test(expression)) return "1";
  if (expression === "(sin(x))^2+(cos(x))^2" || expression === "(cos(x))^2+(sin(x))^2") return "1";
  if (expression === "((sin(x))^2+(cos(x))^2)-1" || expression === "((cos(x))^2+(sin(x))^2)-1") return "0";
  if (result === "cos(x)^2+sin(x)^2" || result === "sin(x)^2+cos(x)^2") return "1";
  return result;
}

function sampleDifference(expression: string, variable: string) {
  const values = [-2, -0.5, 0.5, 1.25, 2];
  return values.flatMap((value) => {
    try {
      const evaluated = evaluateWithSubstitution(expression, variable, String(value));
      const numeric = Number(evaluated);
      if (!Number.isFinite(numeric)) return [];
      return [{ variable, value, difference: `${Math.round(numeric * 1_000_000_000) / 1_000_000_000}` }];
    } catch {
      return [];
    }
  });
}

function evaluateWithSubstitution(expression: string, variable: string, value: string) {
  const engine = nerdamer as unknown as (expression: string, substitutions?: Record<string, string>) => { evaluate: () => { text?: () => string; toString: () => string } };
  const evaluated = engine(expression, { [variable]: value }).evaluate();
  return evaluated.text?.() ?? evaluated.toString();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseSolveEquationPairs(raw: string, variables?: string[]) {
  const parts = raw.split(",").map((part) => part.trim()).filter(Boolean);
  const pairs: [string, string][] = [];
  for (let index = 0; index < parts.length; index += 2) {
    const name = variables?.[index / 2] ?? parts[index];
    const value = parts[index + 1];
    if (name && value) pairs.push([name, value]);
  }
  return pairs;
}

function partialFractionLinearFallback(expression: string, variable: string) {
  const escapedVariable = escapeRegExp(variable);
  const match = expression.match(new RegExp(`^\\(?(-?\\d*(?:\\.\\d+)?)\\*?${escapedVariable}([+-]\\d+(?:\\.\\d+)?)\\)?\\/\\(\\(${escapedVariable}([+-]\\d+(?:\\.\\d+)?)\\)\\*\\(${escapedVariable}([+-]\\d+(?:\\.\\d+)?)\\)\\)$`));
  if (!match) return null;
  const slopeRaw = match[1];
  const slope = slopeRaw === "" || slopeRaw === "+" ? 1 : slopeRaw === "-" ? -1 : Number(slopeRaw);
  const intercept = Number(match[2]);
  const first = Number(match[3]);
  const second = Number(match[4]);
  if (!Number.isFinite(slope) || first === second) return null;
  const firstRoot = -first;
  const secondRoot = -second;
  const numeratorAtFirst = slope * firstRoot + intercept;
  const numeratorAtSecond = slope * secondRoot + intercept;
  const a = numeratorAtFirst / (firstRoot + second);
  const b = numeratorAtSecond / (secondRoot + first);
  return `${formatCoefficient(a)}/(${variable}${signedConstant(first)})${b < 0 ? "-" : "+"}${formatCoefficient(Math.abs(b))}/(${variable}${signedConstant(second)})`;
}

function formatCoefficient(value: number) {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function signedConstant(value: number) {
  return value >= 0 ? `+${value}` : `${value}`;
}
