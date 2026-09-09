export type SetExpressionOperator = "union" | "intersection" | "difference" | "symmetric-difference" | "and" | "or";
export type SetExpressionNode =
  | { kind: "set"; name: string }
  | { kind: "not"; value: SetExpressionNode }
  | { kind: "binary"; operator: SetExpressionOperator; left: SetExpressionNode; right: SetExpressionNode };

export type ExpressionToken =
  | { kind: "set"; value: string }
  | { kind: "operator"; value: SetExpressionOperator | "not" }
  | { kind: "left" | "right" };

const precedence: Record<SetExpressionOperator, number> = {
  union: 1, or: 1, "symmetric-difference": 2, difference: 3, intersection: 4, and: 4,
};

export const expressionOperatorLabels: Record<ExpressionToken extends { kind: "operator"; value: infer V } ? V : never, string> = {
  union: "Union ∪", intersection: "Intersection ∩", difference: "Difference −", "symmetric-difference": "Symmetric difference △", and: "Logical AND", or: "Logical OR", not: "Logical NOT",
};

export function parseSetExpression(tokens: ExpressionToken[]): SetExpressionNode {
  if (!tokens.length) throw new Error("Add a set to begin the expression.");
  let index = 0;
  const peek = () => tokens[index];
  const consume = () => tokens[index++];
  const parsePrimary = (): SetExpressionNode => {
    const token = consume();
    if (!token) throw new Error("Expression ends before a set is provided.");
    if (token.kind === "operator" && token.value === "not") return { kind: "not", value: parsePrimary() };
    if (token.kind === "set") return { kind: "set", name: token.value };
    if (token.kind === "left") {
      const value = parseBinary(0);
      if (consume()?.kind !== "right") throw new Error("Missing closing parenthesis.");
      return value;
    }
    throw new Error("Expected a set, NOT, or opening parenthesis.");
  };
  const parseBinary = (minimum: number): SetExpressionNode => {
    let left = parsePrimary();
    while (true) {
      const token = peek();
      if (!token || token.kind !== "operator" || token.value === "not") break;
      const level = precedence[token.value];
      if (level < minimum) break;
      consume();
      const right = parseBinary(level + 1);
      left = { kind: "binary", operator: token.value, left, right };
    }
    return left;
  };
  const result = parseBinary(0);
  if (index < tokens.length) {
    if (tokens[index]?.kind === "right") throw new Error("Unexpected closing parenthesis.");
    throw new Error("Two sets or operators cannot be placed next to each other.");
  }
  return result;
}

export function evaluateSetExpression(node: SetExpressionNode, sets: Record<string, string[]>, universe: string[]): string[] {
  const values = (current: SetExpressionNode): Set<string> => {
    if (current.kind === "set") return new Set(sets[current.name] ?? []);
    if (current.kind === "not") return new Set(universe.filter((item) => !values(current.value).has(item)));
    const left = values(current.left); const right = values(current.right);
    if (current.operator === "union" || current.operator === "or") return new Set([...left, ...right]);
    if (current.operator === "intersection" || current.operator === "and") return new Set([...left].filter((item) => right.has(item)));
    if (current.operator === "difference") return new Set([...left].filter((item) => !right.has(item)));
    return new Set([...left, ...right].filter((item) => left.has(item) !== right.has(item)));
  };
  const result = values(node);
  return universe.filter((item) => result.has(item));
}

export type ExpressionStep = { expression: string; operation: string; values: string[]; node: SetExpressionNode };
export function expressionSteps(node: SetExpressionNode, sets: Record<string, string[]>, universe: string[]): ExpressionStep[] {
  const steps: ExpressionStep[] = [];
  const walk = (current: SetExpressionNode): string[] => {
    if (current.kind === "set") return sets[current.name] ?? [];
    if (current.kind === "not") {
      walk(current.value);
      const values = evaluateSetExpression(current, sets, universe);
      steps.push({ expression: `${formatSetExpression(current.value)}ᶜ`, operation: "Complement: keep elements outside the set", values, node: current });
      return values;
    }
    walk(current.left); walk(current.right);
    const values = evaluateSetExpression(current, sets, universe);
    steps.push({ expression: formatSetExpression(current), operation: operationText(current.operator), values, node: current });
    return values;
  };
  walk(node);
  return steps;
}

function operationText(operator: SetExpressionOperator) {
  return ({ union: "Union: combine members from both sets", or: "Logical OR: either membership is true", intersection: "Intersection: keep shared members", and: "Logical AND: both memberships are true", difference: "Difference: keep the left-only members", "symmetric-difference": "Symmetric difference: keep members in exactly one set" })[operator];
}

export function formatSetExpression(node: SetExpressionNode): string {
  if (node.kind === "set") return node.name;
  if (node.kind === "not") return `${formatSetExpression(node.value)}ᶜ`;
  const symbol = ({ union: "∪", or: "∨", intersection: "∩", and: "∧", difference: "−", "symmetric-difference": "△" })[node.operator];
  return `(${formatSetExpression(node.left)} ${symbol} ${formatSetExpression(node.right)})`;
}
