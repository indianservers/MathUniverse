import type { MathAssumption, MathAstNode, MathDiagnostic, MathResult, MathValue } from "./types";
import { applyArithmetic, approximateValue, formatValue, fractionValue, toFraction } from "./values";

export type EvaluationEnvironment = Record<string, MathValue>;
type InternalResult = { value?: MathValue; diagnostics: MathDiagnostic[] };

function evaluateNode(node: MathAstNode, environment: EvaluationEnvironment, assumptions: MathAssumption[]): InternalResult {
  switch (node.type) {
    case "LITERAL": {
      if (node.literalKind === "BOOLEAN") return { value: { kind: "BOOLEAN", value: node.value === "true" }, diagnostics: [] };
      if (node.literalKind === "INTEGER") return { value: fractionValue(BigInt(node.value)), diagnostics: [] };
      const [whole, fractional = ""] = node.value.split(".");
      return { value: fractionValue(BigInt(`${whole || "0"}${fractional}`), 10n ** BigInt(fractional.length)), diagnostics: [] };
    }
    case "SYMBOL": {
      if (node.name === "i") return { value: { kind: "COMPLEX", real: fractionValue(0n), imaginary: fractionValue(1n) }, diagnostics: [] };
      if (node.name === "pi" || node.name === "e") return { value: { kind: "DECIMAL", coefficient: node.name === "pi" ? "3141592653589793" : "2718281828459045", scale: 15, precision: 16, roundingMode: "HALF_EVEN" }, diagnostics: [{ code: "NAMED_CONSTANT_APPROXIMATION", severity: "INFO", message: `${node.name} is retained as a named constant but evaluated numerically here.`, nodeId: node.id }] };
      const value = environment[node.name];
      return value ? { value, diagnostics: [] } : { diagnostics: [{ code: "UNDEFINED_SYMBOL", severity: "ERROR", message: `Symbol '${node.name}' is not defined.`, sourceRange: node.sourceRange, nodeId: node.id }] };
    }
    case "UNARY_OPERATION": {
      const operand = evaluateNode(node.operand, environment, assumptions);
      if (!operand.value || node.operator === "+") return operand;
      const applied = applyArithmetic("*", fractionValue(-1n), operand.value);
      return { value: applied.value, diagnostics: [...operand.diagnostics, ...(applied.diagnostic ? [applied.diagnostic] : [])] };
    }
    case "BINARY_OPERATION": {
      const left = evaluateNode(node.left, environment, assumptions); const right = evaluateNode(node.right, environment, assumptions);
      if (!left.value || !right.value) return { diagnostics: [...left.diagnostics, ...right.diagnostics] };
      if (node.operator === "*" && left.value.kind === "MATRIX" && right.value.kind === "MATRIX") {
        const leftWidth = left.value.values[0]?.length ?? 0; const rightHeight = right.value.values.length;
        if (leftWidth !== rightHeight) return { diagnostics: [...left.diagnostics, ...right.diagnostics, { code: "INVALID_MATRIX_DIMENSIONS", severity: "ERROR", message: `Cannot multiply a ${left.value.values.length}×${leftWidth} matrix by a ${rightHeight}×${right.value.values[0]?.length ?? 0} matrix.`, nodeId: node.id, sourceRange: node.sourceRange }] };
        const rows: MathValue[][] = [];
        for (let row = 0; row < left.value.values.length; row += 1) { const outputRow: MathValue[] = []; for (let column = 0; column < (right.value.values[0]?.length ?? 0); column += 1) { let total: MathValue = fractionValue(0n); for (let index = 0; index < leftWidth; index += 1) { const product = applyArithmetic("*", left.value.values[row][index], right.value.values[index][column]); if (!product.value) return { diagnostics: [...left.diagnostics, ...right.diagnostics, product.diagnostic ?? { code: "TYPE_MISMATCH", severity: "ERROR", message: "Matrix entries must be numeric." }] }; total = applyArithmetic("+", total, product.value).value ?? total; } outputRow.push(total); } rows.push(outputRow); }
        return { value: { kind: "MATRIX", values: rows }, diagnostics: [...left.diagnostics, ...right.diagnostics] };
      }
      if (left.value.kind === "MATRIX" || right.value.kind === "MATRIX") return { diagnostics: [...left.diagnostics, ...right.diagnostics, { code: "TYPE_MISMATCH", severity: "ERROR", message: `Operator '${node.operator}' does not support these matrix operands.`, nodeId: node.id }] };
      const applied = applyArithmetic(node.operator, left.value, right.value);
      return { value: applied.value, diagnostics: [...left.diagnostics, ...right.diagnostics, ...(applied.diagnostic ? [{ ...applied.diagnostic, nodeId: node.id, sourceRange: node.sourceRange }] : [])] };
    }
    case "FUNCTION_CALL": {
      const definition = environment[node.name];
      if (definition?.kind === "FUNCTION") {
        if (definition.parameters.length !== node.arguments.length) return { diagnostics: [{ code: "ARGUMENT_COUNT_MISMATCH", severity: "ERROR", message: `Function '${node.name}' expects ${definition.parameters.length} argument(s).`, nodeId: node.id }] };
        const evaluated = node.arguments.map((argument) => evaluateNode(argument, environment, assumptions));
        if (evaluated.some((entry) => !entry.value)) return { diagnostics: evaluated.flatMap((entry) => entry.diagnostics) };
        const local = { ...environment, ...definition.closure };
        definition.parameters.forEach((parameter, index) => { local[parameter] = evaluated[index].value as MathValue; });
        const result = evaluateNode(definition.body, local, assumptions);
        return { value: result.value, diagnostics: [...evaluated.flatMap((entry) => entry.diagnostics), ...result.diagnostics] };
      }
      const args = node.arguments.map((argument) => evaluateNode(argument, environment, assumptions));
      if (args.some((entry) => !entry.value)) return { diagnostics: args.flatMap((entry) => entry.diagnostics) };
      const numeric = args.map((entry) => entry.value ? toFraction(entry.value) : undefined);
      if (["abs", "sqrt"].includes(node.name) && numeric[0]) {
        if (node.name === "abs") { const value = numeric[0]; return { value: fractionValue(value.numerator < 0n ? -value.numerator : value.numerator, value.denominator), diagnostics: [] }; }
        const value = numeric[0];
        if (value.numerator < 0n) return { value: { kind: "SPECIAL", state: "INVALID_DOMAIN", reason: "Square root of a negative real number" }, diagnostics: [{ code: "DOMAIN_VIOLATION", severity: "ERROR", message: "sqrt requires a non-negative input in the real domain.", nodeId: node.id }] };
        const numeratorRoot = BigInt(Math.trunc(Math.sqrt(Number(value.numerator)))); const denominatorRoot = BigInt(Math.trunc(Math.sqrt(Number(value.denominator))));
        if (numeratorRoot * numeratorRoot === value.numerator && denominatorRoot * denominatorRoot === value.denominator) return { value: fractionValue(numeratorRoot, denominatorRoot), diagnostics: [] };
        return { value: { kind: "SURD", coefficient: { kind: "RATIONAL", numerator: "1", denominator: value.denominator.toString() }, radicand: (value.numerator * value.denominator).toString() }, diagnostics: [] };
      }
      return { diagnostics: [{ code: "UNSUPPORTED_FUNCTION", severity: "ERROR", message: `Function '${node.name}' is not supported by the Phase 1 evaluator.`, nodeId: node.id }] };
    }
    case "DEFINITION": {
      if (node.parameters.length) return { value: { kind: "FUNCTION", parameters: node.parameters, body: node.expression, closure: { ...environment } }, diagnostics: [] };
      return evaluateNode(node.expression, environment, assumptions);
    }
    case "EQUATION": case "INEQUALITY": {
      const left = evaluateNode(node.left, environment, assumptions); const right = evaluateNode(node.right, environment, assumptions);
      const lf = left.value ? toFraction(left.value) : undefined; const rf = right.value ? toFraction(right.value) : undefined;
      if (!lf || !rf) return { diagnostics: [...left.diagnostics, ...right.diagnostics, { code: "TYPE_MISMATCH", severity: "ERROR", message: "Comparison requires exact real scalar values.", nodeId: node.id }] };
      const difference = lf.numerator * rf.denominator - rf.numerator * lf.denominator;
      const truth = node.type === "EQUATION" ? difference === 0n : node.operator === "<" ? difference < 0n : node.operator === "<=" ? difference <= 0n : node.operator === ">" ? difference > 0n : node.operator === ">=" ? difference >= 0n : difference !== 0n;
      return { value: { kind: "BOOLEAN", value: truth }, diagnostics: [...left.diagnostics, ...right.diagnostics] };
    }
    case "LIST": case "VECTOR": {
      const entries = node.items.map((item) => evaluateNode(item, environment, assumptions));
      if (entries.some((entry) => !entry.value)) return { diagnostics: entries.flatMap((entry) => entry.diagnostics) };
      return { value: { kind: node.type, values: entries.map((entry) => entry.value as MathValue) }, diagnostics: entries.flatMap((entry) => entry.diagnostics) };
    }
    case "MATRIX": {
      const entries = node.rows.map((row) => row.map((item) => evaluateNode(item, environment, assumptions)));
      if (entries.flat().some((entry) => !entry.value)) return { diagnostics: entries.flat().flatMap((entry) => entry.diagnostics) };
      return { value: { kind: "MATRIX", values: entries.map((row) => row.map((entry) => entry.value as MathValue)) }, diagnostics: entries.flat().flatMap((entry) => entry.diagnostics) };
    }
    case "PIECEWISE": return { diagnostics: [{ code: "UNSUPPORTED_EXACT_EVALUATION", severity: "ERROR", message: "Piecewise evaluation is not enabled in Phase 1.", nodeId: node.id }] };
  }
}

function validateAssumptions(environment: EvaluationEnvironment, assumptions: MathAssumption[]): MathDiagnostic[] {
  return assumptions.flatMap((assumption) => {
    const value = environment[assumption.symbol]; const fraction = value ? toFraction(value) : undefined;
    if (!value) return [];
    if (!fraction && assumption.constraint) return [{ code: "INVALID_ASSUMPTION", severity: "ERROR" as const, message: `Assumption for '${assumption.symbol}' requires a real scalar.` }];
    if (!fraction) return [];
    const sign = fraction.numerator;
    const violated = assumption.constraint === "POSITIVE" ? sign <= 0n : assumption.constraint === "NON_NEGATIVE" ? sign < 0n : assumption.constraint === "NEGATIVE" ? sign >= 0n : assumption.constraint === "NON_ZERO" ? sign === 0n : assumption.constraint === "NATURAL" ? fraction.denominator !== 1n || sign < 1n : assumption.constraint === "INTEGER" ? fraction.denominator !== 1n : false;
    return violated ? [{ code: "ASSUMPTION_VIOLATION", severity: "ERROR" as const, message: `Value of '${assumption.symbol}' violates its ${assumption.constraint?.toLowerCase().replaceAll("_", " ")} assumption.` }] : [];
  });
}

export function evaluateMath(node: MathAstNode, environment: EvaluationEnvironment = {}, assumptions: MathAssumption[] = []): MathResult {
  const evaluated = evaluateNode(node, environment, assumptions);
  const diagnostics = [...validateAssumptions(environment, assumptions), ...evaluated.diagnostics];
  const special = evaluated.value?.kind === "SPECIAL" ? evaluated.value : undefined;
  const status = special?.state === "UNDEFINED" ? "UNDEFINED" : special?.state === "INDETERMINATE" ? "INDETERMINATE" : special?.state === "UNSUPPORTED" ? "UNSUPPORTED" : diagnostics.some((diagnostic) => diagnostic.severity === "ERROR") ? "ERROR" : evaluated.value?.kind === "DECIMAL" ? "APPROXIMATE" : "EXACT";
  return {
    status,
    value: evaluated.value,
    exactForm: evaluated.value ? formatValue(evaluated.value) : undefined,
    approximateForm: evaluated.value ? approximateValue(evaluated.value) : undefined,
    precision: evaluated.value?.kind === "DECIMAL" ? evaluated.value.precision : undefined,
    assumptionsUsed: assumptions.map((assumption) => assumption.id),
    diagnostics,
    provenance: [{ id: `evaluation-${node.id}`, operation: "EVALUATE", inputNodeIds: [node.id], timestamp: new Date(0).toISOString(), description: "Evaluated by the universal Phase 1 value engine." }],
  };
}
