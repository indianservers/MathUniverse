import { MathDependencyGraph } from "../math-foundation/dependencyGraph";
import { evaluateCertifiedCas } from "./casEngine";
import { compositeSimpson } from "./numerical";

export function createLinkedCalculusWorkflow(options: { expression?: string; variable?: string; lower?: number; upper?: number } = {}) {
  const expression = options.expression ?? "x^3-3*x"; const variable = options.variable ?? "x"; const lower = options.lower ?? -2; const upper = options.upper ?? 2; const graph = new MathDependencyGraph();
  graph.define(`f(${variable})=${expression}`, "phase4-function-f");
  const derivative = evaluateCertifiedCas(`Derivative[${expression},${variable}]`, [`${variable} in R`], "DIFFERENTIATE");
  const derivativeExpression = derivative.exactExpression;
  if (!derivativeExpression) throw new Error("The existing exact engine did not return a derivative for this workflow.");
  graph.define(`df(${variable})=${derivativeExpression}`, "phase4-function-df");
  graph.define("stationaryLeft=-1", "phase4-stationary-left"); graph.define("stationaryRight=1", "phase4-stationary-right");
  const exactIntegral = evaluateCertifiedCas(`DefiniteIntegral[${expression},${lower},${upper},${variable}]`, [`${variable} in R`]);
  const numericalIntegral = compositeSimpson((x) => x ** 3 - 3 * x, lower, upper, 400, 1e-10);
  return { graph, functionNodeId: "phase4-function-f", derivativeNodeId: "phase4-function-df", stationaryPointNodeIds: ["phase4-stationary-left", "phase4-stationary-right"], derivative, exactIntegral, numericalIntegral, links: [{ from: "phase4-function-f", to: "phase4-function-df", kind: "DERIVATIVE" }, { from: "phase4-function-df", to: "phase4-stationary-left", kind: "ROOT" }, { from: "phase4-function-df", to: "phase4-stationary-right", kind: "ROOT" }, { from: "phase4-function-f", to: exactIntegral.resultNodeIds[0] ?? "integral-result", kind: "DEFINITE_INTEGRAL" }] };
}
