import { parseGraphDescriptor, sampleGraph } from "./graphSampler";
import type { GraphValidationResult } from "./types/graphValidation";

export const graphValidationSuggestions = [
  "y = x",
  "y = x^2",
  "y = sin(x)",
  "x^2 + y^2 = 1",
  "x=3*sin(t), y=2*cos(t), t=0..2*pi",
  "r=4*sin(3*theta), theta=0..2*pi",
];

const blockedGraphFragments = [
  "window",
  "document",
  "globalThis",
  "fetch",
  "import",
  "eval",
  "function",
  "=>",
  ";",
];

export function validateGraphExpression(input: string): GraphValidationResult {
  const expression = input.trim();
  if (!expression) {
    return {
      status: "invalid",
      input,
      message: "Enter a graph expression before adding it.",
      suggestions: graphValidationSuggestions,
    };
  }

  const lowered = expression.toLowerCase();
  const blocked = blockedGraphFragments.find((fragment) => lowered.includes(fragment));
  if (blocked) {
    return {
      status: "unsupported",
      input,
      message: `Graph expression "${input}" is not supported because it contains "${blocked}".`,
      suggestions: graphValidationSuggestions,
    };
  }

  try {
    parseGraphDescriptor(expression);
    const sample = sampleGraph(expression, { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }, 80);
    const hasVisibleSample = "segments" in sample
      ? sample.segments.some((segment) => segment.points.some((point) => Number.isFinite(point.x) && Number.isFinite(point.y)))
      : sample.cells.length > 0;

    if (!hasVisibleSample) {
      return {
        status: "warning",
        input,
        message: "The expression is valid, but it produced no visible points in the default view.",
        suggestions: ["Try zooming out.", ...graphValidationSuggestions],
      };
    }

    return {
      status: "valid",
      input,
      message: "Graph expression is valid.",
    };
  } catch (error) {
    return {
      status: "invalid",
      input,
      message: error instanceof Error ? error.message : "Graph expression could not be sampled.",
      suggestions: graphValidationSuggestions,
    };
  }
}

export function isGraphValidationBlocking(result: GraphValidationResult) {
  return result.status === "invalid" || result.status === "unsupported";
}
