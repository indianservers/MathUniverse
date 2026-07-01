import {
  symbolicBinomialDist,
  symbolicBinomialCdf,
  symbolicBinomialCoefficient,
  symbolicCauchy,
  symbolicCharacteristicPolynomial,
  symbolicChiSquared,
  symbolicCommonDenominator,
  symbolicCompleteSquare,
  symbolicComplexFactor,
  symbolicComplexRoot,
  symbolicComplexSolve,
  symbolicCovariance,
  symbolicDefiniteIntegral,
  symbolicDelete,
  symbolicDenominator,
  symbolicDerivative,
  symbolicDeterminant,
  symbolicDimension,
  symbolicDivisors,
  symbolicDivisorsSum,
  symbolicDotProduct,
  symbolicElement,
  symbolicEliminate,
  symbolicEquationSide,
  symbolicEigenvalues,
  symbolicEigenvectors,
  symbolicExtendedGcd,
  symbolicExponential,
  symbolicExpand,
  symbolicFDistribution,
  symbolicFactor,
  symbolicFactorial,
  symbolicFirst,
  symbolicFitExp,
  symbolicFitLog,
  symbolicFitPoly,
  symbolicFitPow,
  symbolicFitSin,
  symbolicFrequencyTable,
  symbolicGcd,
  symbolicGammaDist,
  symbolicGroebnerBasis,
  symbolicHyperGeometric,
  symbolicIdentityMatrix,
  symbolicIntersect,
  symbolicIsPrime,
  symbolicAdjointMatrix,
  symbolicCofactorMatrix,
  symbolicInverseMatrix,
  symbolicIntegral,
  symbolicImplicitDerivative,
  symbolicInverseLaplace,
  symbolicJordanDiagonalization,
  symbolicLaplace,
  symbolicLatex,
  symbolicLast,
  symbolicLcm,
  symbolicListSummary,
  symbolicLimit,
  symbolicLuDecomposition,
  symbolicMatrixAdd,
  symbolicMatrixMultiply,
  symbolicMatrixRank,
  symbolicMatrixSubtract,
  symbolicMatrixSummary,
  symbolicMean,
  symbolicMedian,
  symbolicMinimalPolynomial,
  symbolicMin,
  symbolicMixedNumber,
  symbolicModulo,
  symbolicMode,
  symbolicModularExponent,
  symbolicMax,
  symbolicNextPrime,
  symbolicNumericalIntegral,
  symbolicNumericSolve,
  symbolicNormal,
  symbolicNormalBetween,
  symbolicNormalPdf,
  symbolicOneSidedLimit,
  symbolicPartialFractions,
  symbolicPascal,
  symbolicPolynomialCoefficients,
  symbolicPolynomialDegree,
  symbolicPolynomialDivide,
  symbolicPolynomialFromRoots,
  symbolicPoisson,
  symbolicPrimeFactors,
  symbolicProduct,
  symbolicPreviousPrime,
  symbolicPercentile,
  symbolicPerpendicularVector,
  symbolicQuartiles,
  symbolicRationalize,
  symbolicRange,
  symbolicRandomBetween,
  symbolicRandomBinomial,
  symbolicRandomElement,
  symbolicRandomNormal,
  symbolicRandomPoisson,
  symbolicRandomPolynomial,
  symbolicRandomUniform,
  symbolicProjection,
  symbolicQrDecomposition,
  symbolicRoot,
  symbolicRootList,
  symbolicRref,
  symbolicSample,
  symbolicScalarMultiply,
  symbolicSequence,
  symbolicShuffle,
  symbolicSimplify,
  symbolicSolve,
  symbolicSolveInequality,
  symbolicSolveOde,
  symbolicSolvePolynomialDegree,
  symbolicSvd,
  symbolicSampleVariance,
  symbolicStandardDeviation,
  symbolicSubstitute,
  symbolicSum,
  symbolicSystemSolve,
  symbolicTake,
  symbolicTangentLine,
  symbolicTaylorPolynomial,
  symbolicTDistribution,
  symbolicToComplex,
  symbolicToExponential,
  symbolicToPoint,
  symbolicToPolar,
  symbolicTranspose,
  symbolicCrossProduct,
  symbolicNumerator,
  symbolicTrace,
  symbolicUnitVector,
  symbolicUnique,
  symbolicVariance,
  symbolicWeibull,
  symbolicVectorAdd,
  symbolicVectorMagnitude,
  symbolicVectorScale,
  symbolicVectorSubtract,
  symbolicVerifyIdentity,
  symbolicZipf,
  trySymbolic,
  type SymbolicAssignment,
  type SymbolicResult,
} from "../utils/symbolic";
import { resolveCasCommandSpec, type CasCommandSpec } from "./casCommandRegistry";
import { parseCasInput, type ParsedCasInput } from "./casParser";

export type CasEvaluationMode = "exact" | "numeric" | "keep-input";

export type CasResultStatus = "ok" | "error" | "planned" | "partial";

export type CasVerification =
  | string[]
  | {
      equivalent: boolean;
      method: "exact" | "numeric-sampling" | "failed";
      samples: Array<{ variable: string; value: number; difference: string }>;
    };

export type CasResult = {
  id: string;
  input: string;
  parsed: ParsedCasInput;
  command?: CasCommandSpec;
  status: CasResultStatus;
  exact?: string;
  numeric?: string;
  latex?: string;
  summary: string;
  detail: string;
  steps: string[];
  warnings: string[];
  assumptions: string[];
  verification?: CasVerification;
  linkedViews: Array<"Graph" | "Table" | "Spreadsheet" | "Inspector" | "Notebook">;
  createdAt: string;
  dependencies: string[];
};

export type CasNotebookRow = {
  id: string;
  input: string;
  mode: CasEvaluationMode;
  result?: CasResult;
};

export type CasNotebookState = {
  rows: CasNotebookRow[];
  assumptions: string[];
};

export type CasNotebookMemory = {
  outputs: string[];
  assignments: Record<string, string>;
};

export function createCasNotebookState(rows: string[] = []) {
  return {
    rows: rows.map((input) => createCasNotebookRow(input)),
    assumptions: [],
  } satisfies CasNotebookState;
}

export function createCasNotebookRow(input = "", mode: CasEvaluationMode = "exact"): CasNotebookRow {
  return {
    id: createId(),
    input,
    mode,
  };
}

export function evaluateCasInput(input: string, options: { mode?: CasEvaluationMode; assumptions?: string[]; memory?: CasNotebookMemory } = {}): CasResult {
  const mode = options.mode ?? "exact";
  const memory = options.memory ?? createCasNotebookMemory();
  const resolved = resolveCasReferences(input, memory);
  const parsed = parseCasInput(resolved.input);
  const command = parsed.normalizedName ? resolveCasCommandSpec(parsed.normalizedName) : undefined;
  const assumptions = options.assumptions ?? [];
  const baseWarnings = [...resolved.warnings, ...parsed.warnings];

  if (parsed.errors.length) {
    return createCasResult({ input, parsed, command, status: "error", summary: parsed.errors[0], detail: parsed.errors.join(" "), steps: ["Parse the input.", "Stop before changing notebook state."], warnings: baseWarnings, assumptions, dependencies: resolved.dependencies });
  }

  if (!command) {
    return createCasResult({ input, parsed, command, status: "error", summary: "Unknown CAS command.", detail: `No registered CAS command matched "${parsed.commandName}".`, steps: ["Look up command metadata.", "No executor was found."], warnings: baseWarnings, assumptions, dependencies: resolved.dependencies });
  }

  if (mode === "keep-input" || command.name === "KeepInput") {
    return createCasResult({ input, parsed, command, status: "ok", exact: parsed.expression || input, summary: parsed.expression || input, detail: "Input stored without transformation.", steps: ["Keep the original input for later reference."], warnings: baseWarnings, assumptions, dependencies: resolved.dependencies });
  }

  const assignment = parseAssignment(resolved.input);
  if (assignment) {
    memory.assignments[assignment.name] = assignment.value;
    return createCasResult({ input, parsed, command, status: "ok", exact: assignment.value, summary: `${assignment.name} := ${assignment.value}`, detail: "Notebook assignment stored for later rows.", steps: [`Store ${assignment.name} as ${assignment.value}.`, `Later rows can reference ${assignment.name}.`], warnings: baseWarnings, assumptions, dependencies: resolved.dependencies });
  }

  if (command.name === "Assume") {
    const assumption = parsed.args.join(" ").trim();
    return createCasResult({ input, parsed, command, status: "ok", exact: assumption, summary: `Assume ${assumption}`, detail: "Assumption recorded for following CAS rows.", steps: ["Read the assumption.", "Attach it to subsequent symbolic checks."], warnings: baseWarnings, assumptions: [...assumptions, assumption].filter(Boolean), dependencies: resolved.dependencies });
  }

  if (command.support === "planned") {
    return createCasResult({ input, parsed, command, status: "planned", summary: `${command.name} is planned.`, detail: command.description, steps: ["The command is registered in the Phase 1 catalog.", "Execution will land in a later command-pack phase."], warnings: [`${command.name} is not implemented yet.`, ...baseWarnings], assumptions, dependencies: resolved.dependencies });
  }

  const symbolic = runImplementedCommand(command.name, parsed.args);
  if (!symbolic) {
    return createCasResult({ input, parsed, command, status: command.support === "partial" ? "partial" : "error", summary: "No supported exact result.", detail: `${command.name} is registered, but this input is outside the current engine coverage.`, steps: ["Parse command arguments.", "Try existing symbolic engine.", "Return a structured fallback instead of a silent failure."], warnings: baseWarnings, assumptions, dependencies: resolved.dependencies });
  }

  const numeric = mode === "numeric" || command.name === "Numeric" ? numericApproximation(symbolic.result) : undefined;
  return createCasResult({
    input,
    parsed,
    command,
    status: "ok",
    exact: symbolic.result,
    numeric,
    summary: numeric ?? symbolic.result,
    detail: symbolic.detail,
    steps: symbolic.steps,
    warnings: [...baseWarnings, ...(symbolic.warnings ?? [])],
    assumptions,
    verification: symbolic.verification,
    dependencies: resolved.dependencies,
  });
}

export function evaluateCasNotebookRows(rows: CasNotebookRow[], assumptions: string[] = []) {
  const memory = createCasNotebookMemory();
  const nextAssumptions = [...assumptions];
  return rows.map((row, index) => {
    const result = evaluateCasInput(row.input, { mode: row.mode, assumptions: nextAssumptions, memory });
    if (result.command?.name === "Assume" && result.exact) nextAssumptions.push(result.exact);
    if (result.status === "ok" && result.exact) {
      memory.outputs[index + 1] = result.exact;
      const assignment = parseAssignment(result.input);
      if (assignment) memory.assignments[assignment.name] = assignment.value;
    }
    return { ...row, result };
  });
}

export function createCasNotebookMemory(): CasNotebookMemory {
  return { outputs: [], assignments: {} };
}

export function resolveCasReferences(input: string, memory: CasNotebookMemory) {
  const dependencies: string[] = [];
  const warnings: string[] = [];
  let resolved = input.replace(/(?:\$|#|ans)(\d+)/gi, (token, indexRaw: string) => {
    const index = Number(indexRaw);
    const value = memory.outputs[index];
    if (!value) {
      warnings.push(`Reference ${token} has no earlier CAS output.`);
      return token;
    }
    dependencies.push(`row ${index}`);
    return `(${value})`;
  });

  Object.entries(memory.assignments).forEach(([name, value]) => {
    const pattern = new RegExp(`\\b${escapeRegExp(name)}\\b`, "g");
    if (pattern.test(resolved)) {
      dependencies.push(`${name} := ${value}`);
      resolved = resolved.replace(pattern, `(${value})`);
    }
  });

  return { input: resolved, dependencies: Array.from(new Set(dependencies)), warnings };
}

function runImplementedCommand(name: string, args: string[]): SymbolicResult | null {
  const expression = args[0] ?? "";
  if (name === "Evaluate" || name === "Numeric" || name === "Simplify") return trySymbolic(() => symbolicSimplify(expression));
  if (name === "Factor") return trySymbolic(() => symbolicFactor(expression));
  if (name === "Expand") return trySymbolic(() => symbolicExpand(expression));
  if (name === "Rationalize") return trySymbolic(() => symbolicRationalize(expression));
  if (name === "CompleteSquare") return trySymbolic(() => symbolicCompleteSquare(expression, args[1] ?? "x"));
  if (name === "Coefficients") return trySymbolic(() => symbolicPolynomialCoefficients(expression, args[1] ?? "x"));
  if (name === "Degree") return trySymbolic(() => symbolicPolynomialDegree(expression, args[1] ?? "x"));
  if (name === "CommonDenominator") return trySymbolic(() => symbolicCommonDenominator(expression));
  if (name === "Polynomial") return trySymbolic(() => symbolicPolynomialFromRoots(args));
  if (name === "ToComplex") return trySymbolic(() => symbolicToComplex(expression));
  if (name === "ToPolar") return trySymbolic(() => symbolicToPolar(expression));
  if (name === "ToExponential") return trySymbolic(() => symbolicToExponential(expression));
  if (name === "ToPoint") return trySymbolic(() => symbolicToPoint(expression));
  if (name === "Numerator") return trySymbolic(() => symbolicNumerator(expression));
  if (name === "Denominator") return trySymbolic(() => symbolicDenominator(expression));
  if (name === "LeftSide") return trySymbolic(() => symbolicEquationSide(expression, "left"));
  if (name === "RightSide") return trySymbolic(() => symbolicEquationSide(expression, "right"));
  if (name === "Solve") return trySymbolic(() => symbolicSolve(expression, args[1] ?? "x"));
  if (name === "Root") return trySymbolic(() => symbolicRoot(expression, args[1] ?? "x"));
  if (name === "RootList") return trySymbolic(() => symbolicRootList(expression, args[1] ?? "x"));
  if (name === "SolveCubic") return trySymbolic(() => symbolicSolvePolynomialDegree(expression, args[1] ?? "x", "cubic"));
  if (name === "SolveQuartic") return trySymbolic(() => symbolicSolvePolynomialDegree(expression, args[1] ?? "x", "quartic"));
  if (name === "SolveSystem") return trySymbolic(() => symbolicSystemSolve(args));
  if (name === "NSolve") return trySymbolic(() => symbolicNumericSolve(expression, args[1] ?? "x"));
  if (name === "CSolve") return trySymbolic(() => symbolicComplexSolve(expression, args[1] ?? "x"));
  if (name === "CFactor") return trySymbolic(() => symbolicComplexFactor(expression, args[1] ?? "x"));
  if (name === "ComplexRoot") return trySymbolic(() => symbolicComplexRoot(expression, args[1] ?? "x"));
  if (name === "SolveInequality") return trySymbolic(() => symbolicSolveInequality(expression, args[1] ?? "x"));
  if (name === "Eliminate") return trySymbolic(() => symbolicEliminate(args, args[args.length - 1] ?? "y"));
  if (name === "PlotSolve") return trySymbolic(() => symbolicNumericSolve(expression, args[1] ?? "x"));
  if (name === "Derivative") return trySymbolic(() => symbolicDerivative(expression, args[1] ?? "x"));
  if (name === "Integral") return trySymbolic(() => symbolicIntegral(expression, args[1] ?? "x"));
  if (name === "DefiniteIntegral") return trySymbolic(() => symbolicDefiniteIntegral(expression, args[1] ?? "0", args[2] ?? "1", args[3] ?? "x"));
  if (name === "Limit") return trySymbolic(() => symbolicLimit(expression, args[1] ?? "x", args[2] ?? "0"));
  if (name === "LimitAbove") return trySymbolic(() => symbolicOneSidedLimit(expression, args[1] ?? "x", args[2] ?? "0", "above"));
  if (name === "LimitBelow") return trySymbolic(() => symbolicOneSidedLimit(expression, args[1] ?? "x", args[2] ?? "0", "below"));
  if (name === "NIntegral") return trySymbolic(() => symbolicNumericalIntegral(expression, args[1] ?? "0", args[2] ?? "1", args[3] ?? "x"));
  if (name === "ImplicitDerivative") return trySymbolic(() => symbolicImplicitDerivative(expression, args[1] ?? "x", args[2] ?? "y"));
  if (name === "TaylorPolynomial") return trySymbolic(() => symbolicTaylorPolynomial(expression, args[1] ?? "x", args[2] ?? "0", args[3] ?? "5"));
  if (name === "SolveODE") return trySymbolic(() => symbolicSolveOde(expression, args[1] ?? "x", args[2] ?? "y"));
  if (name === "Laplace") return trySymbolic(() => symbolicLaplace(expression, args[1] ?? "t", args[2] ?? "s"));
  if (name === "InverseLaplace") return trySymbolic(() => symbolicInverseLaplace(expression, args[1] ?? "s", args[2] ?? "t"));
  if (name === "Matrix") return trySymbolic(() => symbolicMatrixSummary(matrixArgument(args)));
  if (name === "Determinant") return trySymbolic(() => symbolicDeterminant(matrixArgument(args)));
  if (name === "Transpose") return trySymbolic(() => symbolicTranspose(matrixArgument(args)));
  if (name === "Inverse") return trySymbolic(() => symbolicInverseMatrix(matrixArgument(args)));
  if (name === "MatrixAdd") return trySymbolic(() => symbolicMatrixAdd(args[0] ?? "", args[1] ?? ""));
  if (name === "MatrixSubtract") return trySymbolic(() => symbolicMatrixSubtract(args[0] ?? "", args[1] ?? ""));
  if (name === "MatrixMultiply") return trySymbolic(() => symbolicMatrixMultiply(args[0] ?? "", args[1] ?? ""));
  if (name === "ScalarMultiply") return trySymbolic(() => symbolicScalarMultiply(expression, args[1] ?? ""));
  if (name === "Trace") return trySymbolic(() => symbolicTrace(matrixArgument(args)));
  if (name === "IdentityMatrix") return trySymbolic(() => symbolicIdentityMatrix(expression));
  if (name === "CofactorMatrix") return trySymbolic(() => symbolicCofactorMatrix(matrixArgument(args)));
  if (name === "AdjointMatrix") return trySymbolic(() => symbolicAdjointMatrix(matrixArgument(args)));
  if (name === "RREF") return trySymbolic(() => symbolicRref(matrixArgument(args)));
  if (name === "MatrixRank") return trySymbolic(() => symbolicMatrixRank(matrixArgument(args)));
  if (name === "Dimension") return trySymbolic(() => symbolicDimension(matrixArgument(args)));
  if (name === "CharacteristicPolynomial") return trySymbolic(() => symbolicCharacteristicPolynomial(matrixArgument(args), "lambda"));
  if (name === "LUDecomposition") return trySymbolic(() => symbolicLuDecomposition(matrixArgument(args)));
  if (name === "QRDecomposition") return trySymbolic(() => symbolicQrDecomposition(matrixArgument(args)));
  if (name === "SVD") return trySymbolic(() => symbolicSvd(matrixArgument(args)));
  if (name === "JordanDiagonalization") return trySymbolic(() => symbolicJordanDiagonalization(matrixArgument(args)));
  if (name === "MinimalPolynomial") return trySymbolic(() => symbolicMinimalPolynomial(matrixArgument(args)));
  if (name === "Eigenvalues") return trySymbolic(() => symbolicEigenvalues(matrixArgument(args)));
  if (name === "Eigenvectors") return trySymbolic(() => symbolicEigenvectors(matrixArgument(args)));
  if (name === "Magnitude") return trySymbolic(() => symbolicVectorMagnitude(expression));
  if (name === "UnitVector") return trySymbolic(() => symbolicUnitVector(expression));
  if (name === "VectorAdd") return trySymbolic(() => symbolicVectorAdd(expression, args[1] ?? ""));
  if (name === "VectorSubtract") return trySymbolic(() => symbolicVectorSubtract(expression, args[1] ?? ""));
  if (name === "VectorScale") return trySymbolic(() => symbolicVectorScale(expression, args[1] ?? ""));
  if (name === "Projection") return trySymbolic(() => symbolicProjection(expression, args[1] ?? ""));
  if (name === "PerpendicularVector") return trySymbolic(() => symbolicPerpendicularVector(expression));
  if (name === "UnitPerpendicularVector") return trySymbolic(() => symbolicPerpendicularVector(expression, true));
  if (name === "Dot") return trySymbolic(() => symbolicDotProduct(expression, args[1] ?? ""));
  if (name === "Cross") return trySymbolic(() => symbolicCrossProduct(expression, args[1] ?? ""));
  if (name === "List") return trySymbolic(() => symbolicListSummary(args));
  if (name === "Sum") return trySymbolic(() => symbolicSum(args));
  if (name === "Product") return trySymbolic(() => symbolicProduct(args));
  if (name === "Element") return trySymbolic(() => symbolicElement(expression, args[1] ?? "1"));
  if (name === "First") return trySymbolic(() => symbolicFirst(expression, args[1] ?? "1"));
  if (name === "Last") return trySymbolic(() => symbolicLast(expression, args[1] ?? "1"));
  if (name === "Take") return trySymbolic(() => symbolicTake(expression, args[1] ?? "1", args[2]));
  if (name === "Delete") return trySymbolic(() => symbolicDelete(expression, args[1] ?? "1"));
  if (name === "Unique") return trySymbolic(() => symbolicUnique(expression));
  if (name === "Shuffle") return trySymbolic(() => symbolicShuffle(expression, args[1]));
  if (name === "Sample") return trySymbolic(() => symbolicSample(expression, args[1] ?? "1", args[2]));
  if (name === "Sequence") return trySymbolic(() => symbolicSequence(expression, args[1] ?? "n", args[2] ?? "1", args[3] ?? "1", args[4] ?? "1"));
  if (name === "Min") return trySymbolic(() => symbolicMin(args));
  if (name === "Max") return trySymbolic(() => symbolicMax(args));
  if (name === "Range") return trySymbolic(() => symbolicRange(args));
  if (name === "Mean") return trySymbolic(() => symbolicMean(args));
  if (name === "Median") return trySymbolic(() => symbolicMedian(args));
  if (name === "Mode") return trySymbolic(() => symbolicMode(args));
  if (name === "FrequencyTable") return trySymbolic(() => symbolicFrequencyTable(args));
  if (name === "Variance") return trySymbolic(() => symbolicVariance(args));
  if (name === "SampleVariance") return trySymbolic(() => symbolicSampleVariance(args));
  if (name === "StandardDeviation") return trySymbolic(() => symbolicStandardDeviation(args));
  if (name === "SampleStandardDeviation") return trySymbolic(() => symbolicStandardDeviation(args, true));
  if (name === "Quartiles") return trySymbolic(() => symbolicQuartiles(args));
  if (name === "Percentile") return trySymbolic(() => symbolicPercentile(args));
  if (name === "Covariance") return trySymbolic(() => symbolicCovariance(expression, args[1] ?? ""));
  if (name === "FitPoly") return trySymbolic(() => symbolicFitPoly(expression, args[1] ?? "1"));
  if (name === "FitExp") return trySymbolic(() => symbolicFitExp(expression));
  if (name === "FitLog") return trySymbolic(() => symbolicFitLog(expression));
  if (name === "FitPow") return trySymbolic(() => symbolicFitPow(expression));
  if (name === "FitSin") return trySymbolic(() => symbolicFitSin(expression));
  if (name === "Normal") return trySymbolic(() => symbolicNormal(expression, args[1] ?? "1", args[2] ?? "0"));
  if (name === "NormalPDF") return trySymbolic(() => symbolicNormalPdf(expression, args[1] ?? "1", args[2] ?? "0"));
  if (name === "NormalBetween") return trySymbolic(() => symbolicNormalBetween(expression, args[1] ?? "1", args[2] ?? "0", args[3] ?? "0"));
  if (name === "BinomialDist") return trySymbolic(() => symbolicBinomialDist(expression, args[1] ?? "0.5", args[2] ?? "0"));
  if (name === "BinomialCdf") return trySymbolic(() => symbolicBinomialCdf(expression, args[1] ?? "0.5", args[2] ?? "0"));
  if (name === "Poisson") return trySymbolic(() => symbolicPoisson(expression, args[1] ?? "0", args[2] ?? "false"));
  if (name === "Exponential") return trySymbolic(() => symbolicExponential(expression, args[1] ?? "0"));
  if (name === "Gamma") return trySymbolic(() => symbolicGammaDist(expression, args[1] ?? "1", args[2] ?? "0"));
  if (name === "ChiSquared") return trySymbolic(() => symbolicChiSquared(expression, args[1] ?? "0"));
  if (name === "TDistribution") return trySymbolic(() => symbolicTDistribution(expression, args[1] ?? "0"));
  if (name === "FDistribution") return trySymbolic(() => symbolicFDistribution(expression, args[1] ?? "1", args[2] ?? "0"));
  if (name === "Cauchy") return trySymbolic(() => symbolicCauchy(expression, args[1] ?? "1", args[2] ?? "0"));
  if (name === "HyperGeometric") return trySymbolic(() => symbolicHyperGeometric(expression, args[1] ?? "0", args[2] ?? "0", args[3] ?? "0"));
  if (name === "Pascal") return trySymbolic(() => symbolicPascal(expression, args[1] ?? "0.5", args[2] ?? "0"));
  if (name === "Weibull") return trySymbolic(() => symbolicWeibull(expression, args[1] ?? "1", args[2] ?? "0"));
  if (name === "Zipf") return trySymbolic(() => symbolicZipf(expression, args[1] ?? "1", args[2] ?? "1"));
  if (name === "RandomBetween") return trySymbolic(() => symbolicRandomBetween(expression, args[1] ?? "1", args[2]));
  if (name === "RandomUniform") return trySymbolic(() => symbolicRandomUniform(expression, args[1] ?? "1", args[2] ?? "1", args[3]));
  if (name === "RandomNormal") return trySymbolic(() => symbolicRandomNormal(expression, args[1] ?? "1", args[2] ?? "1", args[3]));
  if (name === "RandomBinomial") return trySymbolic(() => symbolicRandomBinomial(expression, args[1] ?? "0.5", args[2] ?? "1", args[3]));
  if (name === "RandomPoisson") return trySymbolic(() => symbolicRandomPoisson(expression, args[1] ?? "1", args[2]));
  if (name === "RandomElement") return trySymbolic(() => symbolicRandomElement(args));
  if (name === "RandomPolynomial") return trySymbolic(() => symbolicRandomPolynomial(expression, args[1] ?? "-5", args[2] ?? "5", args[3]));
  if (name === "GCD") return trySymbolic(() => symbolicGcd(args));
  if (name === "LCM") return trySymbolic(() => symbolicLcm(args));
  if (name === "IsPrime") return trySymbolic(() => symbolicIsPrime(expression));
  if (name === "PrimeFactors") return trySymbolic(() => symbolicPrimeFactors(expression));
  if (name === "Divisors") return trySymbolic(() => symbolicDivisors(expression));
  if (name === "DivisorsSum") return trySymbolic(() => symbolicDivisorsSum(expression));
  if (name === "ExtendedGCD") return trySymbolic(() => symbolicExtendedGcd(expression, args[1] ?? "0"));
  if (name === "NextPrime") return trySymbolic(() => symbolicNextPrime(expression));
  if (name === "PreviousPrime") return trySymbolic(() => symbolicPreviousPrime(expression));
  if (name === "Mod") return trySymbolic(() => symbolicModulo(expression, args[1] ?? "1"));
  if (name === "ModularExponent") return trySymbolic(() => symbolicModularExponent(expression, args[1] ?? "0", args[2] ?? "1"));
  if (name === "MixedNumber") return trySymbolic(() => symbolicMixedNumber(expression));
  if (name === "Factorial") return trySymbolic(() => symbolicFactorial(expression));
  if (name === "BinomialCoefficient") return trySymbolic(() => symbolicBinomialCoefficient(expression, args[1] ?? "0"));
  if (name === "Substitute") return trySymbolic(() => symbolicSubstitute(expression, args.slice(1).map(parseSubstitution).filter(Boolean) as SymbolicAssignment[]));
  if (name === "PartialFractions") return trySymbolic(() => symbolicPartialFractions(expression, args[1] ?? "x"));
  if (name === "PolynomialDivide") return trySymbolic(() => symbolicPolynomialDivide(expression, args[1] ?? "1", args[2] ?? "x"));
  if (name === "TangentLine") return trySymbolic(() => symbolicTangentLine(expression, args[1] ?? "0", args[2] ?? "x"));
  if (name === "VerifyIdentity") return trySymbolic(() => symbolicVerifyIdentity(expression, args[1] ?? "", args[2] ?? "x"));
  if (name === "GroebnerLex") return trySymbolic(() => symbolicGroebnerBasis(args));
  if (name === "Intersect") return trySymbolic(() => symbolicIntersect(expression, args[1] ?? ""));
  return null;
}

function createCasResult(data: {
  input: string;
  parsed: ParsedCasInput;
  command?: CasCommandSpec;
  status: CasResultStatus;
  exact?: string;
  numeric?: string;
  summary: string;
  detail: string;
  steps: string[];
  warnings: string[];
  assumptions: string[];
  verification?: CasVerification;
  dependencies: string[];
}): CasResult {
  return {
    id: createId(),
    input: data.input,
    parsed: data.parsed,
    command: data.command,
    status: data.status,
    exact: data.exact,
    numeric: data.numeric,
    latex: data.exact ? safeLatex(data.exact) : undefined,
    summary: data.summary,
    detail: data.detail,
    steps: data.steps,
    warnings: data.warnings,
    assumptions: data.assumptions,
    verification: data.verification,
    linkedViews: linkedViewsFor(data.command),
    createdAt: new Date().toISOString(),
    dependencies: data.dependencies,
  };
}

function linkedViewsFor(command?: CasCommandSpec): CasResult["linkedViews"] {
  if (!command) return ["Notebook"];
  if (command.category === "Calculus" || command.category === "Equation Solving" || command.category === "Algebra") return ["Notebook", "Graph", "Table", "Inspector"];
  if (command.category === "Lists And Data" || command.category === "Statistics" || command.category === "Probability") return ["Notebook", "Spreadsheet", "Table"];
  if (command.category === "Linear Algebra") return ["Notebook", "Inspector"];
  return ["Notebook"];
}

function safeLatex(value: string) {
  try {
    return symbolicLatex(value);
  } catch {
    return value;
  }
}

function numericApproximation(value: string) {
  const numeric = evaluateNumeric(value.replace(/\+C$/, ""));
  return numeric === null ? undefined : String(round(numeric));
}

function evaluateNumeric(expression: string): number | null {
  const safe = expression
    .replace(/\^/g, "**")
    .replace(/\bpi\b/gi, "Math.PI")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bsqrt\b/gi, "Math.sqrt")
    .replace(/\bcbrt\b/gi, "Math.cbrt")
    .replace(/\bsin\b/gi, "Math.sin")
    .replace(/\bcos\b/gi, "Math.cos")
    .replace(/\btan\b/gi, "Math.tan")
    .replace(/\blog\b/gi, "Math.log")
    .replace(/\babs\b/gi, "Math.abs");
  if (!/^[0-9+\-*/().,\sMathPIEabceghilnopqrstxyz]+$/i.test(safe) || /[;={}\]'"[]/.test(safe)) return null;
  try {
    const value = Function(`"use strict"; return (${safe});`)() as number;
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

function parseSubstitution(value: string) {
  const [name, ...rest] = value.split("=");
  const expression = rest.join("=").trim();
  return name?.trim() && expression ? { name: name.trim(), value: expression } : null;
}

function matrixArgument(args: string[]) {
  if (args.length > 1 && args.every((arg) => arg.trim().startsWith("[") && arg.trim().endsWith("]"))) return `[${args.join(",")}]`;
  return args[0] ?? "";
}

function parseAssignment(value: string) {
  const match = value.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:=\s*(.+)$/);
  return match ? { name: match[1], value: match[2].trim() } : null;
}

function round(value: number) {
  if (Math.abs(value) >= 1e9 || (Math.abs(value) > 0 && Math.abs(value) < 1e-6)) return value.toExponential(6);
  return Number(value.toFixed(6));
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `cas-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
