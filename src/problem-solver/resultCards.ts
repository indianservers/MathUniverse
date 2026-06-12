import type { ProblemVisualData } from "./graphingUtils";
import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

export type ProblemResultCardType =
  | "input-interpretation"
  | "classification"
  | "assumptions"
  | "steps"
  | "final-answer"
  | "verification"
  | "visual"
  | "table"
  | "domain"
  | "alternative-method"
  | "related-concepts"
  | "practice"
  | "warnings";

export interface ProblemResultCard {
  id: string;
  type: ProblemResultCardType;
  title: string;
  priority: number;
  content: string | string[] | Record<string, unknown>;
  visible: boolean;
}

export function buildProblemResultCards(classification: ProblemClassification, result: ProblemSolverResult, visual: ProblemVisualData | null): ProblemResultCard[] {
  const cards: ProblemResultCard[] = [
    {
      id: "input-interpretation",
      type: "input-interpretation",
      title: "Input Interpretation",
      priority: 10,
      content: {
        input: classification.rawInput,
        normalized: classification.normalizedInput,
        expression: classification.expression,
        method: result.method,
      },
      visible: Boolean(classification.rawInput || classification.normalizedInput),
    },
    {
      id: "classification",
      type: "classification",
      title: "Detected Problem Type",
      priority: 20,
      content: {
        type: labelForKind(classification.kind),
        confidence: classification.confidence,
        reason: classification.reason,
      },
      visible: true,
    },
    {
      id: "assumptions",
      type: "assumptions",
      title: "Assumptions",
      priority: 30,
      content: result.assumptions,
      visible: result.assumptions.length > 0,
    },
    {
      id: "steps",
      type: "steps",
      title: "Step-by-Step Solution",
      priority: 40,
      content: result.steps,
      visible: result.steps.length > 0,
    },
    {
      id: "final-answer",
      type: "final-answer",
      title: "Final Answer",
      priority: 50,
      content: result.result ?? "",
      visible: Boolean(result.result),
    },
    {
      id: "verification",
      type: "verification",
      title: "Verification",
      priority: 60,
      content: result.verification ?? [],
      visible: Boolean(result.verification?.length),
    },
    {
      id: "visual",
      type: "visual",
      title: "Visual Verification",
      priority: 70,
      content: {
        title: visual?.title,
        description: visual?.description,
      },
      visible: Boolean(visual),
    },
    {
      id: "table",
      type: "table",
      title: "Table of Values",
      priority: 80,
      content: { rows: visual?.table.map((row) => ({ x: row.x, y: row.y === null ? "undefined" : row.y })) ?? [] },
      visible: Boolean(visual?.table.length),
    },
    {
      id: "domain",
      type: "domain",
      title: "Domain / Restrictions",
      priority: 90,
      content: result.restrictions ?? [],
      visible: Boolean(result.restrictions?.length),
    },
    {
      id: "alternative-method",
      type: "alternative-method",
      title: "Alternative Method",
      priority: 100,
      content: alternativeMethodFor(classification, result),
      visible: Boolean(alternativeMethodFor(classification, result)),
    },
    {
      id: "related-concepts",
      type: "related-concepts",
      title: "Related Concepts",
      priority: 110,
      content: relatedConceptsFor(classification.kind),
      visible: relatedConceptsFor(classification.kind).length > 0,
    },
    {
      id: "practice",
      type: "practice",
      title: "Practice Similar Problems",
      priority: 120,
      content: practiceFor(classification.kind),
      visible: practiceFor(classification.kind).length > 0,
    },
    {
      id: "warnings",
      type: "warnings",
      title: "Warnings / Limitations",
      priority: 130,
      content: result.warnings,
      visible: result.warnings.length > 0,
    },
  ];

  return cards.filter((card) => card.visible).sort((left, right) => left.priority - right.priority);
}

function alternativeMethodFor(classification: ProblemClassification, result: ProblemSolverResult) {
  if (result.method === "CAS fallback" || result.method === "CAS-assisted result") return "A deterministic human-readable method is preferred when available; this result is clearly labeled as assisted.";
  if (classification.kind === "quadratic-equation") return "You can also solve many quadratics with the quadratic formula or by graphing the x-intercepts.";
  if (classification.kind === "linear-equation") return "You can verify the answer by graphing both sides and finding their intersection.";
  if (classification.kind === "system") return "Linear systems can also be solved by substitution, elimination, or matrix row-reduction.";
  if (classification.kind === "statistics") return "For data sets, compare the center with spread measures such as range, variance, and standard deviation.";
  if (classification.kind === "matrix") return "Matrix operations can often be checked by row-reduction or multiplication verification.";
  return "";
}

function relatedConceptsFor(kind: string) {
  const concepts: Record<string, string[]> = {
    "linear-equation": ["Inverse operations", "Slope-intercept form", "Graph intersections"],
    "quadratic-equation": ["Factoring", "Zero-product rule", "Parabola roots"],
    "polynomial-equation": ["Polynomial roots", "End behavior", "Graph intercepts"],
    simplify: ["Equivalent expressions", "Domain restrictions", "Factoring"],
    factor: ["Polynomial factors", "Special products", "Roots"],
    expand: ["Distributive property", "Like terms", "Polynomial form"],
    evaluate: ["Order of operations", "Function notation", "Numeric approximation"],
    derivative: ["Rate of change", "Tangent slope", "Power rule"],
    integral: ["Antiderivatives", "Area under curve", "Constant of integration"],
    limit: ["Continuity", "Direct substitution", "Standard limits"],
    system: ["Elimination", "Substitution", "Matrix methods"],
    statistics: ["Center", "Spread", "Frequency"],
    matrix: ["Rows and columns", "Determinants", "Row-reduction"],
  };
  return concepts[kind] ?? [];
}

function practiceFor(kind: string) {
  const practice: Record<string, string[]> = {
    "linear-equation": ["3x - 7 = 11", "x/3 + 2 = 5"],
    "quadratic-equation": ["x^2 - 4 = 0", "x^2 + 5x + 6 = 0"],
    simplify: ["simplify 2x + 3x - 5", "reduce (x^2 - 4)/(x - 2)"],
    factor: ["factor x^2 - 4", "factor x^2 + 2x + 1"],
    expand: ["expand (x-2)(x+3)", "expand 2(x+1)(x-1)"],
    derivative: ["derivative of x^3 + 2x", "derivative of sin(x)"],
    integral: ["integrate 2x", "integral of x^2"],
    limit: ["limit x->2 x^2 + 1", "lim x->0 sin(x)/x"],
    system: ["2x + 3y = 12; x - y = 1", "x + y = 2; x + y = 3"],
    statistics: ["median of 4, 6, 8, 10", "frequency table of 1, 2, 2, 3"],
    matrix: ["determinant [[1,2],[3,4]]", "transpose [[1,2],[3,4]]"],
  };
  return practice[kind] ?? [];
}

function labelForKind(kind: string) {
  return kind.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
