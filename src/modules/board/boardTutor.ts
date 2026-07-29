import { analyzeBoardExpression } from "./boardMathAnalyzer";
import { executeBoardAction } from "./boardEngineAdapters";
import type {
  BoardDocument,
  BoardElement,
  BoardMathAnalysis,
  BoardResultElement,
  BoardTutorMessage,
  BoardTutorMode,
} from "./types";

export type BoardTutorContext = {
  boardId: string;
  boardTitle: string;
  selectedElementIds: string[];
  selectedExpressions: Array<{
    elementId: string;
    rawLatex: string;
    normalizedLatex?: string;
    classification?: string;
    variables?: string[];
  }>;
  selectedResults: Array<{
    elementId: string;
    actionType: string;
    inputLatex: string;
    outputLatex?: string;
    assumptions?: string[];
    warnings?: string[];
  }>;
  visibleGraphs: Array<{
    elementId: string;
    sourceExpressionIds: string[];
    graphType: string;
    configuration?: Record<string, unknown>;
  }>;
  actionHistory: BoardDocument["actionHistory"];
  priorHints: number;
};

export type BoardTutorResponse = {
  text: string;
  verified: boolean;
  verificationMethod?: string;
  referencedElementIds: string[];
  suggestedAction?: "insert-explanation" | "plot-2d" | "check-work";
};

export type BoardTutorTool =
  | "inspect_board_selection"
  | "analyze_expression"
  | "simplify_expression"
  | "factor_expression"
  | "expand_expression"
  | "solve_equation"
  | "differentiate_expression"
  | "integrate_expression"
  | "evaluate_limit"
  | "verify_equivalence"
  | "plot_2d"
  | "calculate_statistics";

export const BOARD_TUTOR_TOOL_ALLOWLIST: ReadonlySet<BoardTutorTool> = new Set([
  "inspect_board_selection",
  "analyze_expression",
  "simplify_expression",
  "factor_expression",
  "expand_expression",
  "solve_equation",
  "differentiate_expression",
  "integrate_expression",
  "evaluate_limit",
  "verify_equivalence",
  "plot_2d",
  "calculate_statistics",
]);

const INJECTION_PATTERNS = [
  /ignore (?:all |the )?(?:previous|prior|system) instructions/i,
  /reveal (?:the )?(?:system prompt|developer message|secret|api key)/i,
  /(?:execute|run) (?:this )?(?:code|command|script)/i,
  /(?:delete|clear|overwrite) (?:the )?board/i,
  /send (?:the )?board (?:content )?(?:to|elsewhere)/i,
  /change (?:your|the system) behavior/i,
];

export function buildBoardTutorContext(document: BoardDocument, selectedIds: string[]): BoardTutorContext {
  const selected = document.elements.filter((element) => selectedIds.includes(element.id));
  const selectedExpressions = selected
    .filter((element) => element.type === "math-expression" || element.type === "solution-step")
    .slice(0, 12)
    .map((element) => {
      const analysis = safeAnalyze(element.latex);
      return {
        elementId: element.id,
        rawLatex: element.latex.slice(0, 2_000),
        normalizedLatex: element.normalizedExpression,
        classification: analysis?.classification,
        variables: analysis?.variables,
      };
    });
  const selectedResults = selected
    .filter((element) => element.type === "math-result")
    .slice(0, 8)
    .map((element) => ({
      elementId: element.id,
      actionType: element.actionType,
      inputLatex: element.inputLatex.slice(0, 2_000),
      outputLatex: element.exactOutputLatex?.slice(0, 2_000),
      assumptions: element.assumptions?.slice(0, 8),
      warnings: element.warnings?.slice(0, 8),
    }));
  const visibleGraphs = document.elements
    .filter((element): element is BoardResultElement => element.type === "math-result" && Boolean(element.graph))
    .slice(-8)
    .map((element) => ({
      elementId: element.id,
      sourceExpressionIds: element.sourceElementIds,
      graphType: element.graph?.mode ?? "unknown",
      configuration: element.graph ? {
        expression: element.graph.expression,
        view: element.graph.view,
      } : undefined,
    }));
  return {
    boardId: document.id,
    boardTitle: document.title.slice(0, 200),
    selectedElementIds: selected.map((element) => element.id),
    selectedExpressions,
    selectedResults,
    visibleGraphs,
    actionHistory: document.actionHistory.slice(-20),
    priorHints: document.tutorMessages.filter((message) => message.role === "tutor" && message.mode === "hint").length,
  };
}

export function sanitizeTutorContent(value: string) {
  return value.replace(/[<>]/g, "").replaceAll(String.fromCharCode(0), "").slice(0, 4_000);
}

export function detectPromptInjection(value: string) {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

export function validateTutorTool(tool: string, input: Record<string, unknown>) {
  if (!BOARD_TUTOR_TOOL_ALLOWLIST.has(tool as BoardTutorTool)) throw new Error("INVALID_TOOL_CALL");
  const expression = input.expression;
  if (typeof expression === "string" && expression.length > 2_000) throw new Error("INVALID_TOOL_CALL");
  if (Object.keys(input).length > 12) throw new Error("INVALID_TOOL_CALL");
  return true;
}

export function hintForAnalysis(analysis: BoardMathAnalysis, level: number) {
  const boundedLevel = Math.max(1, Math.min(7, level));
  const variable = analysis.variables[0] ?? "x";
  const hints: Record<string, string[]> = {
    equation: [
      "Think about keeping both sides balanced.",
      `Try isolating the term containing ${variable}.`,
      "Use the same inverse operation on both sides.",
      "Move constant terms before dividing by the coefficient.",
      `Write the equation with only the ${variable}-term on one side.`,
      `Divide both sides by the coefficient of ${variable}.`,
      "Now use Solve if you want the complete verified solution.",
    ],
    "algebraic-expression": [
      "Look for a useful structure before calculating.",
      "Check whether the terms share a common factor or form a familiar pattern.",
      "For a quadratic, seek two numbers whose product is the constant term and whose sum is the linear coefficient.",
      "Write a tentative pair of binomial factors.",
      "Expand the tentative factors to verify the middle term.",
      "Use Factor to verify the intermediate form.",
      "The full verified result is available from the Factor action.",
    ],
    derivative: [
      "Identify whether more than one differentiation rule is needed.",
      "Mark each factor before applying a rule.",
      "For a product, differentiate one factor at a time.",
      "Set up u′v + uv′ without simplifying yet.",
      "Differentiate each factor carefully.",
      "Combine the two product-rule terms.",
      "Use Differentiate to view the complete verified derivative.",
    ],
    integral: [
      "First identify the integrand and the variable of integration.",
      "Look for a reverse derivative pattern.",
      "Choose a substitution only if it simplifies the differential.",
      "Write the antiderivative pattern without evaluating bounds.",
      "For a definite integral, evaluate upper minus lower.",
      "Check signs and include + C only for an indefinite integral.",
      "Use Integrate for the complete verified result.",
    ],
  };
  const ladder = hints[analysis.classification] ?? [
    "Identify the mathematical object and the quantity the question asks for.",
    "Name the relevant rule before applying it.",
    "Work on one transformation at a time.",
    "Preserve exact values until the final step.",
    "Check that the transformation preserves the original conditions.",
    "Use a deterministic Board action to verify the next step.",
    "Request the full solution only when you are ready to compare.",
  ];
  return ladder[boundedLevel - 1];
}

export async function runBoardTutor(input: {
  mode: BoardTutorMode;
  question: string;
  context: BoardTutorContext;
  signal?: AbortSignal;
}): Promise<BoardTutorResponse> {
  if (input.signal?.aborted) throw new DOMException("Tutor request cancelled", "AbortError");
  const question = sanitizeTutorContent(input.question);
  if (detectPromptInjection(question)) {
    return {
      text: "I treated the embedded instruction as untrusted content. Ask a mathematical question or select the expression you want to study.",
      verified: false,
      referencedElementIds: input.context.selectedElementIds,
    };
  }
  const expression = input.context.selectedExpressions[0];
  if (!expression) {
    return {
      text: "Select an expression or a set of ordered solution steps so I can use structured Board context.",
      verified: false,
      referencedElementIds: [],
    };
  }
  const analysis = analyzeBoardExpression(expression.rawLatex);
  if (input.mode === "hint") {
    return {
      text: hintForAnalysis(analysis, input.context.priorHints + 1),
      verified: true,
      verificationMethod: "Deterministic hint rule matched to expression classification",
      referencedElementIds: [expression.elementId],
    };
  }
  if (input.mode === "next-step") {
    return nextStepResponse(analysis, expression.elementId, input.signal);
  }
  if (input.mode === "full-solution" || input.mode === "exam" || input.mode === "concise") {
    const action = analysis.classification === "equation" ? "solve" : analysis.classification === "derivative" ? "differentiate" : analysis.classification === "integral" ? "integrate" : "simplify";
    const result = await executeBoardAction({ action, analysis, parameters: { variable: analysis.variables[0] ?? "x" }, signal: input.signal });
    return {
      text: input.mode === "concise"
        ? result.exactOutputLatex ?? result.plainTextOutput ?? "No result."
        : `${result.exactOutputLatex ?? result.plainTextOutput ?? "No result."}${result.steps?.[0]?.explanation ? `\n\nFirst verified step: ${result.steps[0].explanation}` : ""}`,
      verified: true,
      verificationMethod: result.engine.underlyingEngine,
      referencedElementIds: [expression.elementId],
      suggestedAction: "insert-explanation",
    };
  }
  if (input.mode === "visual") {
    return {
      text: "Open the linked interactive graph to inspect how the expression changes. The Board will use the existing graph engine.",
      verified: true,
      verificationMethod: "Existing graph adapter",
      referencedElementIds: [expression.elementId],
      suggestedAction: "plot-2d",
    };
  }
  if (input.mode === "alternative") {
    return {
      text: alternativeMethod(analysis.classification),
      verified: true,
      verificationMethod: "Deterministic applicability rule",
      referencedElementIds: [expression.elementId],
    };
  }
  if (input.mode === "check-work" || input.mode === "find-mistake") {
    return {
      text: "Select at least two expressions in reading order, then use Check my work. I will compare each transformation with the previous valid step.",
      verified: false,
      referencedElementIds: input.context.selectedElementIds,
      suggestedAction: "check-work",
    };
  }
  return {
    text: conceptExplanation(analysis),
    verified: false,
    verificationMethod: "Offline deterministic tutor; no production AI provider is configured",
    referencedElementIds: [expression.elementId],
  };
}

export function createTutorMessage(role: BoardTutorMessage["role"], mode: BoardTutorMode, text: string, referencedElementIds: string[], verified: boolean, verificationMethod?: string): BoardTutorMessage {
  return {
    id: `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    role,
    mode,
    text: sanitizeTutorContent(text),
    referencedElementIds,
    verified,
    verificationMethod,
    createdAt: new Date().toISOString(),
  };
}

function safeAnalyze(latex: string) {
  try {
    return analyzeBoardExpression(latex);
  } catch {
    return null;
  }
}

async function nextStepResponse(analysis: BoardMathAnalysis, elementId: string, signal?: AbortSignal): Promise<BoardTutorResponse> {
  if (analysis.classification === "equation") {
    const result = await executeBoardAction({ action: "solve", analysis, parameters: { variable: analysis.variables[0] ?? "x" }, signal });
    const firstStep = result.steps?.find((step) => step.explanation && !/final/i.test(step.explanation));
    return {
      text: firstStep?.explanation ?? "Apply one inverse operation to both sides, then stop and verify that transformation.",
      verified: true,
      verificationMethod: result.engine.underlyingEngine,
      referencedElementIds: [elementId],
    };
  }
  return {
    text: hintForAnalysis(analysis, 5),
    verified: true,
    verificationMethod: "Deterministic next-transformation rule",
    referencedElementIds: [elementId],
  };
}

function alternativeMethod(classification: BoardMathAnalysis["classification"]) {
  if (classification === "equation") return "An equation can often be solved algebraically and checked graphically by finding the intersection of both sides.";
  if (classification === "algebraic-expression") return "For a quadratic, compare factorization, completing the square, and a graph. Use the method that best exposes the requested feature.";
  if (classification === "integral") return "Depending on the integrand, compare substitution, integration by parts, or a numerical/graphical area interpretation.";
  return "Try a symbolic method and a visual or numerical check, then compare whether both preserve the same conditions.";
}

function conceptExplanation(analysis: BoardMathAnalysis) {
  const structures = analysis.detectedStructures.slice(0, 3).join(", ") || "mathematical structure";
  return `This is classified as ${analysis.classification}. Focus on ${structures}. Use a Board engine action when you need an exact result; this offline explanation is not presented as a new CAS result.`;
}

export function selectedTutorElements(elements: BoardElement[], ids: string[]) {
  return elements.filter((element) => ids.includes(element.id));
}
