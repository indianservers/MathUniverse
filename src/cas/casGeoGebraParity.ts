import { casCommandCatalog, resolveCasCommandSpec, type CasCommandSpec } from "./casCommandRegistry";

export type GeoGebraParityStatus = "direct" | "equivalent" | "missing";

export type GeoGebraParityEntry = {
  geogebra: string;
  status: GeoGebraParityStatus;
  localCommand?: string;
  category: "algebra" | "calculus" | "linear-algebra" | "probability" | "statistics" | "lists-data" | "number-theory" | "complex" | "geometry" | "random" | "advanced-symbolic";
  priority: "P0" | "P1" | "P2";
  note: string;
};

const geogebraCasCommands = [
  "Assume", "BinomialDist", "CFactor", "CIFactor", "CSolutions", "CSolve", "Cauchy", "ChiSquared", "CharacteristicPolynomial", "Coefficients", "CommonDenominator", "CompleteSquare", "ComplexRoot", "Covariance", "Cross", "Degree", "Delete", "Denominator", "Derivative", "Determinant", "Dimension", "Div", "Division", "Divisors", "DivisorsList", "DivisorsSum", "Dot", "Eigenvalues", "Eigenvectors", "Element", "Eliminate", "Expand", "Exponential", "ExtendedGCD", "FDistribution", "Factor", "Factors", "First", "FitExp", "FitLog", "FitPoly", "FitPow", "FitSin", "GCD", "Gamma", "GroebnerDegRevLex", "GroebnerLex", "GroebnerLexDeg", "HyperGeometric", "IFactor", "Identity", "ImplicitDerivative", "Integral", "IntegralBetween", "IntegralSymbolic", "Intersect", "InverseLaplace", "Invert", "IsPrime", "JordanDiagonalization", "Laplace", "Last", "LCM", "LeftSide", "Length", "Limit", "LimitAbove", "LimitBelow", "LUDecomposition", "MatrixRank", "Max", "Mean", "Median", "Min", "MinimalPolynomial", "MixedNumber", "Mod", "ModularExponent", "NIntegral", "NSolutions", "NSolve", "NextPrime", "Normal", "Numerator", "Numeric", "PartialFractions", "Pascal", "PerpendicularVector", "PlotSolve", "Poisson", "Polynomial", "PreviousPrime", "PrimeFactors", "Product", "QRDecomposition", "RandomBetween", "RandomBinomial", "RandomElement", "RandomNormal", "RandomPoisson", "RandomPolynomial", "RandomUniform", "Rationalize", "ReducedRowEchelonForm", "RightSide", "Root", "RootList", "SD", "Sample", "SampleSD", "SampleVariance", "Sequence", "Shuffle", "Simplify", "Solutions", "Solve", "SolveCubic", "SolveODE", "SolveQuartic", "Substitute", "Sum", "SVD", "TDistribution", "Take", "TaylorPolynomial", "ToComplex", "ToExponential", "ToPoint", "ToPolar", "Transpose", "Unique", "UnitPerpendicularVector", "UnitVector", "Variance", "Weibull", "Zipf",
] as const;

const equivalentCommands: Record<string, string> = {
  CSolutions: "CSolve",
  Factors: "Divisors",
  Identity: "IdentityMatrix",
  IntegralBetween: "DefiniteIntegral",
  IntegralSymbolic: "Integral",
  Invert: "Inverse",
  Length: "Magnitude",
  NSolutions: "NSolve",
  ReducedRowEchelonForm: "RREF",
  Root: "Solve",
  SD: "StandardDeviation",
  SampleSD: "SampleStandardDeviation",
  Solutions: "Solve",
};

export function geogebraCasParityReport(): GeoGebraParityEntry[] {
  return geogebraCasCommands.map((command) => parityEntry(command));
}

export function geogebraCasParitySummary() {
  const report = geogebraCasParityReport();
  const byStatus = countBy(report, (entry) => entry.status);
  const byPriority = countBy(report.filter((entry) => entry.status === "missing"), (entry) => entry.priority);
  return {
    geogebraTotal: report.length,
    localTotal: casCommandCatalog.length,
    direct: byStatus.direct ?? 0,
    equivalent: byStatus.equivalent ?? 0,
    covered: (byStatus.direct ?? 0) + (byStatus.equivalent ?? 0),
    missing: byStatus.missing ?? 0,
    missingByPriority: {
      P0: byPriority.P0 ?? 0,
      P1: byPriority.P1 ?? 0,
      P2: byPriority.P2 ?? 0,
    },
  };
}

export function missingGeoGebraCasCommands(priority?: GeoGebraParityEntry["priority"]) {
  return geogebraCasParityReport().filter((entry) => entry.status === "missing" && (!priority || entry.priority === priority));
}

function parityEntry(command: string): GeoGebraParityEntry {
  const direct = resolveCasCommandSpec(command);
  if (direct) {
    return {
      geogebra: command,
      status: direct.name === command ? "direct" : "equivalent",
      localCommand: direct.name,
      category: parityCategory(command, direct),
      priority: parityPriority(command),
      note: direct.name === command ? "Implemented with the same command name." : `Covered by local command or alias ${direct.name}.`,
    };
  }

  const equivalent = equivalentCommands[command];
  if (equivalent && resolveCasCommandSpec(equivalent)) {
    return {
      geogebra: command,
      status: "equivalent",
      localCommand: equivalent,
      category: parityCategory(command),
      priority: parityPriority(command),
      note: `Covered by equivalent local command ${equivalent}.`,
    };
  }

  return {
    geogebra: command,
    status: "missing",
    category: parityCategory(command),
    priority: parityPriority(command),
    note: "Not implemented yet; keep as a tracked command-coverage gap.",
  };
}

function parityCategory(command: string, local?: CasCommandSpec): GeoGebraParityEntry["category"] {
  if (local?.category === "Calculus") return "calculus";
  if (local?.category === "Linear Algebra") return "linear-algebra";
  if (local?.category === "Probability") return "probability";
  if (local?.category === "Statistics") return "statistics";
  if (local?.category === "Lists And Data") return "lists-data";
  if (local?.category === "Number Theory") return "number-theory";
  if (/Random/.test(command)) return "random";
  if (/Factor|Root|Complex|ToComplex|ToExponential|ToPolar|ToPoint/.test(command)) return "complex";
  if (/Matrix|Eigen|Jordan|LU|QR|SVD|Characteristic|Minimal|Dimension/.test(command)) return "linear-algebra";
  if (/Cauchy|ChiSquared|Exponential|Distribution|Gamma|HyperGeometric|Pascal|Poisson|Normal|Weibull|Zipf/.test(command)) return "probability";
  if (/Fit|Covariance|Sample|Variance|Mean|Median|SD/.test(command)) return "statistics";
  if (/Delete|Element|First|Last|Sequence|Shuffle|Take|Unique/.test(command)) return "lists-data";
  if (/Divisors|GCD|LCM|Prime|Modular/.test(command)) return "number-theory";
  if (/Groebner/.test(command)) return "advanced-symbolic";
  if (/Intersect|Perpendicular|PlotSolve/.test(command)) return "geometry";
  if (/Integral|Derivative|Limit|SolveODE|Taylor|Laplace/.test(command)) return "calculus";
  return "algebra";
}

function parityPriority(command: string): GeoGebraParityEntry["priority"] {
  if (/CFactor|CIFactor|ComplexRoot|RootList|SolveCubic|SolveQuartic|CharacteristicPolynomial|LUDecomposition|QRDecomposition|SVD|JordanDiagonalization|Poisson|Exponential|Gamma|ChiSquared|TDistribution|FDistribution/.test(command)) return "P0";
  if (/Groebner|Random|Fit|Sequence|Element|First|Last|Take|Unique|ExtendedGCD|ModularExponent|HyperGeometric|Pascal|Weibull|Zipf|Cauchy/.test(command)) return "P1";
  return "P2";
}

function countBy<T extends string>(items: GeoGebraParityEntry[], key: (item: GeoGebraParityEntry) => T) {
  return items.reduce<Record<T, number>>((counts, item) => {
    const value = key(item);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}
