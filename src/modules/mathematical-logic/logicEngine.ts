export type LogicOperator = "not" | "and" | "or" | "xor" | "nand" | "nor" | "implies" | "iff";

export type LogicAst =
  | { type: "variable"; name: string }
  | { type: "unary"; operator: "not"; child: LogicAst }
  | { type: "binary"; operator: Exclude<LogicOperator, "not">; left: LogicAst; right: LogicAst };

export type EvaluationStep = {
  label: string;
  expression: string;
  value: boolean;
  depth: number;
};

export type TruthTableRow = {
  values: Record<string, boolean>;
  result: boolean;
  steps: EvaluationStep[];
};

export type TruthTable = {
  ast: LogicAst;
  variables: string[];
  rows: TruthTableRow[];
};

type Token =
  | { type: "variable"; value: string }
  | { type: "operator"; value: LogicOperator }
  | { type: "left"; value: "(" }
  | { type: "right"; value: ")" };

const operatorAliases: Array<[string, LogicOperator]> = [
  ["<->", "iff"],
  ["\u2194", "iff"],
  ["iff", "iff"],
  ["->", "implies"],
  ["=>", "implies"],
  ["\u2192", "implies"],
  ["implies", "implies"],
  ["nand", "nand"],
  ["\u2191", "nand"],
  ["nor", "nor"],
  ["\u2193", "nor"],
  ["xor", "xor"],
  ["\u2295", "xor"],
  ["and", "and"],
  ["&&", "and"],
  ["&", "and"],
  ["\u2227", "and"],
  ["or", "or"],
  ["||", "or"],
  ["|", "or"],
  ["\u2228", "or"],
  ["not", "not"],
  ["~", "not"],
  ["!", "not"],
  ["\u00ac", "not"],
];

const operatorLabels: Record<LogicOperator, string> = {
  not: "NOT",
  and: "AND",
  or: "OR",
  xor: "XOR",
  nand: "NAND",
  nor: "NOR",
  implies: "IMPLIES",
  iff: "IFF",
};

const precedence: Record<LogicOperator, number> = {
  not: 5,
  and: 4,
  nand: 4,
  or: 3,
  nor: 3,
  xor: 3,
  implies: 2,
  iff: 1,
};

const rightAssociative = new Set<LogicOperator>(["not", "implies"]);

export function tokenizeLogic(input: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < input.length) {
    const char = input[index];
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }
    if (char === "(") {
      tokens.push({ type: "left", value: "(" });
      index += 1;
      continue;
    }
    if (char === ")") {
      tokens.push({ type: "right", value: ")" });
      index += 1;
      continue;
    }
    const rest = input.slice(index);
    const alias = operatorAliases.find(([source]) => matchesAlias(rest, source));
    if (alias) {
      tokens.push({ type: "operator", value: alias[1] });
      index += alias[0].length;
      continue;
    }
    if (/[A-Za-z]/.test(char)) {
      let name = "";
      while (/[A-Za-z0-9_]/.test(input[index] ?? "")) {
        name += input[index];
        index += 1;
      }
      tokens.push({ type: "variable", value: name });
      continue;
    }
    throw new Error(`Unexpected token "${char}" at position ${index + 1}.`);
  }
  return tokens;
}

function matchesAlias(rest: string, source: string) {
  if (!rest.toLowerCase().startsWith(source.toLowerCase())) return false;
  if (!/^[A-Za-z]+$/.test(source)) return true;
  return !/[A-Za-z0-9_]/.test(rest[source.length] ?? "");
}

export function parseLogicExpression(input: string): LogicAst {
  const tokens = tokenizeLogic(input);
  if (!tokens.length) throw new Error("Enter a logical statement.");
  const output: Token[] = [];
  const ops: Token[] = [];
  let previous: Token | undefined;

  for (const token of tokens) {
    if (token.type === "variable") output.push(token);
    if (token.type === "operator") {
      if (token.value !== "not" && (!previous || previous.type === "operator" || previous.type === "left")) {
        throw new Error(`${operatorLabels[token.value]} needs a statement on the left.`);
      }
      while (ops.length) {
        const top = ops[ops.length - 1];
        if (top.type !== "operator") break;
        const shouldPop = rightAssociative.has(token.value)
          ? precedence[top.value] > precedence[token.value]
          : precedence[top.value] >= precedence[token.value];
        if (!shouldPop) break;
        output.push(ops.pop()!);
      }
      ops.push(token);
    }
    if (token.type === "left") ops.push(token);
    if (token.type === "right") {
      while (ops.length && ops[ops.length - 1].type !== "left") output.push(ops.pop()!);
      if (!ops.length) throw new Error("Mismatched parentheses.");
      ops.pop();
    }
    previous = token;
  }

  while (ops.length) {
    const op = ops.pop()!;
    if (op.type === "left") throw new Error("Mismatched parentheses.");
    output.push(op);
  }

  const stack: LogicAst[] = [];
  for (const token of output) {
    if (token.type === "variable") stack.push({ type: "variable", name: token.value });
    if (token.type === "operator") {
      if (token.value === "not") {
        const child = stack.pop();
        if (!child) throw new Error("NOT needs a statement.");
        stack.push({ type: "unary", operator: "not", child });
      } else {
        const right = stack.pop();
        const left = stack.pop();
        if (!left || !right) throw new Error(`${operatorLabels[token.value]} is missing an operand.`);
        stack.push({ type: "binary", operator: token.value, left, right });
      }
    }
  }
  if (stack.length !== 1) throw new Error("The expression has unused statements or operators.");
  return stack[0];
}

export function formatAst(ast: LogicAst): string {
  if (ast.type === "variable") return ast.name;
  if (ast.type === "unary") return `!${wrapAst(ast.child)}`;
  const symbol: Record<Exclude<LogicOperator, "not">, string> = {
    and: "&",
    or: "|",
    xor: "xor",
    nand: "nand",
    nor: "nor",
    implies: "->",
    iff: "<->",
  };
  return `${wrapAst(ast.left)} ${symbol[ast.operator]} ${wrapAst(ast.right)}`;
}

function wrapAst(ast: LogicAst) {
  return ast.type === "variable" || ast.type === "unary" ? formatAst(ast) : `(${formatAst(ast)})`;
}

export function collectVariables(ast: LogicAst): string[] {
  const names = new Set<string>();
  const visit = (node: LogicAst) => {
    if (node.type === "variable") names.add(node.name);
    if (node.type === "unary") visit(node.child);
    if (node.type === "binary") {
      visit(node.left);
      visit(node.right);
    }
  };
  visit(ast);
  return Array.from(names).sort();
}

export function evaluateLogic(ast: LogicAst, values: Record<string, boolean>, steps: EvaluationStep[] = [], depth = 0): boolean {
  if (ast.type === "variable") {
    const value = Boolean(values[ast.name]);
    steps.push({ label: ast.name, expression: ast.name, value, depth });
    return value;
  }
  if (ast.type === "unary") {
    const child = evaluateLogic(ast.child, values, steps, depth + 1);
    const value = !child;
    steps.push({ label: "NOT", expression: formatAst(ast), value, depth });
    return value;
  }
  const left = evaluateLogic(ast.left, values, steps, depth + 1);
  const right = evaluateLogic(ast.right, values, steps, depth + 1);
  const value = applyOperator(ast.operator, left, right);
  steps.push({ label: operatorLabels[ast.operator], expression: formatAst(ast), value, depth });
  return value;
}

export function applyOperator(operator: Exclude<LogicOperator, "not">, left: boolean, right: boolean) {
  if (operator === "and") return left && right;
  if (operator === "or") return left || right;
  if (operator === "xor") return left !== right;
  if (operator === "nand") return !(left && right);
  if (operator === "nor") return !(left || right);
  if (operator === "implies") return !left || right;
  return left === right;
}

export function buildTruthTable(input: string): TruthTable {
  const ast = parseLogicExpression(input);
  const variables = collectVariables(ast);
  if (!variables.length) throw new Error("Add at least one statement variable.");
  if (variables.length > 6) throw new Error("Use six or fewer variables for an interactive table.");
  const rows = Array.from({ length: 2 ** variables.length }, (_, mask) => {
    const values = Object.fromEntries(
      variables.map((variable, index) => [variable, Boolean(mask & (1 << (variables.length - index - 1)))])
    ) as Record<string, boolean>;
    const steps: EvaluationStep[] = [];
    const result = evaluateLogic(ast, values, steps);
    return { values, result, steps };
  });
  return { ast, variables, rows };
}

export function toNormalForms(table: TruthTable) {
  const trueRows = table.rows.filter((row) => row.result);
  const falseRows = table.rows.filter((row) => !row.result);
  const dnf = trueRows.length
    ? trueRows.map((row) => `(${table.variables.map((v) => row.values[v] ? v : `!${v}`).join(" & ")})`).join(" | ")
    : "FALSE";
  const cnf = falseRows.length
    ? falseRows.map((row) => `(${table.variables.map((v) => row.values[v] ? `!${v}` : v).join(" | ")})`).join(" & ")
    : "TRUE";
  return {
    dnf,
    cnf,
    steps: [
      "Eliminate implications and biconditionals through truth-functional equivalence.",
      "Evaluate every valuation to identify true rows and false rows.",
      "DNF is the disjunction of minterms from true rows.",
      "CNF is the conjunction of maxterms from false rows.",
      "Simplify tautology or contradiction edge cases when every row agrees.",
    ],
  };
}

export type InferenceRule = "Modus Ponens" | "Modus Tollens" | "Hypothetical Syllogism" | "Disjunctive Syllogism" | "Resolution";

export type InferenceResult = {
  rule: InferenceRule;
  valid: boolean;
  conclusion: string;
  explanation: string;
  matchedPremises: number[];
};

export function runInference(rule: InferenceRule, premises: string[]): InferenceResult {
  const normalized = premises.map((p) => p.trim()).filter(Boolean);
  const fail = (explanation: string): InferenceResult => ({ rule, valid: false, conclusion: "", explanation, matchedPremises: [] });
  try {
    const parsed = normalized.map(parseLogicExpression);
    if (parsed.length < 2) return fail(`${rule} needs at least two premises.`);
    const derivation = deriveInference(rule, parsed);
    if (!derivation) return fail(`No ${rule} pattern was found in the current premises.`);
    return { rule, valid: true, ...derivation };
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Invalid premise.");
  }
}

type Derivation = Pick<InferenceResult, "conclusion" | "explanation" | "matchedPremises">;

function deriveInference(rule: InferenceRule, premises: LogicAst[]): Derivation | null {
  if (rule === "Modus Ponens") return deriveModusPonens(premises);
  if (rule === "Modus Tollens") return deriveModusTollens(premises);
  if (rule === "Hypothetical Syllogism") return deriveHypotheticalSyllogism(premises);
  if (rule === "Disjunctive Syllogism") return deriveDisjunctiveSyllogism(premises);
  return deriveResolution(premises);
}

function deriveModusPonens(premises: LogicAst[]): Derivation | null {
  for (const [conditionalIndex, premise] of premises.entries()) {
    if (!isBinary(premise, "implies")) continue;
    const factIndex = premises.findIndex((candidate, index) => index !== conditionalIndex && astEquals(candidate, premise.left));
    if (factIndex >= 0) {
      return {
        conclusion: formatAst(premise.right),
        explanation: `Premise ${factIndex + 1} affirms the antecedent of premise ${conditionalIndex + 1}, so the consequent follows.`,
        matchedPremises: [factIndex, conditionalIndex],
      };
    }
  }
  return null;
}

function deriveModusTollens(premises: LogicAst[]): Derivation | null {
  for (const [conditionalIndex, premise] of premises.entries()) {
    if (!isBinary(premise, "implies")) continue;
    const negatedConsequentIndex = premises.findIndex((candidate, index) => index !== conditionalIndex && isNegationOf(candidate, premise.right));
    if (negatedConsequentIndex >= 0) {
      return {
        conclusion: formatAst(negateAst(premise.left)),
        explanation: `Premise ${negatedConsequentIndex + 1} denies the consequent of premise ${conditionalIndex + 1}, so the antecedent is denied.`,
        matchedPremises: [conditionalIndex, negatedConsequentIndex],
      };
    }
  }
  return null;
}

function deriveHypotheticalSyllogism(premises: LogicAst[]): Derivation | null {
  for (const [firstIndex, first] of premises.entries()) {
    if (!isBinary(first, "implies")) continue;
    for (const [secondIndex, second] of premises.entries()) {
      if (firstIndex === secondIndex || !isBinary(second, "implies")) continue;
      if (astEquals(first.right, second.left)) {
        return {
          conclusion: formatAst({ type: "binary", operator: "implies", left: first.left, right: second.right }),
          explanation: `Premise ${firstIndex + 1} ends where premise ${secondIndex + 1} begins, so the implications chain.`,
          matchedPremises: [firstIndex, secondIndex],
        };
      }
    }
  }
  return null;
}

function deriveDisjunctiveSyllogism(premises: LogicAst[]): Derivation | null {
  for (const [disjunctionIndex, premise] of premises.entries()) {
    if (!isBinary(premise, "or")) continue;
    const leftNegatedIndex = premises.findIndex((candidate, index) => index !== disjunctionIndex && isNegationOf(candidate, premise.left));
    if (leftNegatedIndex >= 0) {
      return {
        conclusion: formatAst(premise.right),
        explanation: `Premise ${leftNegatedIndex + 1} eliminates the left disjunct of premise ${disjunctionIndex + 1}.`,
        matchedPremises: [disjunctionIndex, leftNegatedIndex],
      };
    }
    const rightNegatedIndex = premises.findIndex((candidate, index) => index !== disjunctionIndex && isNegationOf(candidate, premise.right));
    if (rightNegatedIndex >= 0) {
      return {
        conclusion: formatAst(premise.left),
        explanation: `Premise ${rightNegatedIndex + 1} eliminates the right disjunct of premise ${disjunctionIndex + 1}.`,
        matchedPremises: [disjunctionIndex, rightNegatedIndex],
      };
    }
  }
  return null;
}

function deriveResolution(premises: LogicAst[]): Derivation | null {
  for (const [firstIndex, first] of premises.entries()) {
    if (!isBinary(first, "or")) continue;
    for (const [secondIndex, second] of premises.entries()) {
      if (firstIndex === secondIndex || !isBinary(second, "or")) continue;
      const firstTerms = [first.left, first.right];
      const secondTerms = [second.left, second.right];
      for (let firstTermIndex = 0; firstTermIndex < firstTerms.length; firstTermIndex += 1) {
        for (let secondTermIndex = 0; secondTermIndex < secondTerms.length; secondTermIndex += 1) {
          if (!areComplements(firstTerms[firstTermIndex], secondTerms[secondTermIndex])) continue;
          const remaining = [
            ...firstTerms.filter((_, index) => index !== firstTermIndex),
            ...secondTerms.filter((_, index) => index !== secondTermIndex),
          ];
          const conclusion = remaining.reduce<LogicAst | null>((acc, term) => acc ? { type: "binary", operator: "or", left: acc, right: term } : term, null);
          return {
            conclusion: conclusion ? formatAst(conclusion) : "FALSE",
            explanation: `Premises ${firstIndex + 1} and ${secondIndex + 1} contain complementary literals, so resolution removes them.`,
            matchedPremises: [firstIndex, secondIndex],
          };
        }
      }
    }
  }
  return null;
}

function isBinary(ast: LogicAst, operator: Exclude<LogicOperator, "not">): ast is Extract<LogicAst, { type: "binary" }> {
  return ast.type === "binary" && ast.operator === operator;
}

function astEquals(left: LogicAst, right: LogicAst): boolean {
  if (left.type !== right.type) return false;
  if (left.type === "variable" && right.type === "variable") return left.name === right.name;
  if (left.type === "unary" && right.type === "unary") return astEquals(left.child, right.child);
  if (left.type === "binary" && right.type === "binary") return left.operator === right.operator && astEquals(left.left, right.left) && astEquals(left.right, right.right);
  return false;
}

function isNegationOf(candidate: LogicAst, target: LogicAst) {
  return candidate.type === "unary" && astEquals(candidate.child, target);
}

function areComplements(left: LogicAst, right: LogicAst) {
  return isNegationOf(left, right) || isNegationOf(right, left);
}

function negateAst(ast: LogicAst): LogicAst {
  return ast.type === "unary" ? ast.child : { type: "unary", operator: "not", child: ast };
}

export type PredicateQuantifier = "forall" | "exists";

export type PredicateScenario = {
  quantifier: PredicateQuantifier;
  predicateName: string;
  variable: string;
  domain: string[];
  trueFor: string[];
};

export function evaluatePredicateScenario(scenario: PredicateScenario) {
  const trueSet = new Set(scenario.trueFor);
  const mapped = scenario.domain.map((item) => ({ item, value: trueSet.has(item), substitution: `${scenario.predicateName}(${item})` }));
  const value = scenario.quantifier === "forall" ? mapped.every((m) => m.value) : mapped.some((m) => m.value);
  return {
    value,
    mapped,
    statement: `${scenario.quantifier === "forall" ? "forall" : "exists"} ${scenario.variable} in D: ${scenario.predicateName}(${scenario.variable})`,
    explanation: scenario.quantifier === "forall"
      ? "Universal statements are true only when every domain object satisfies the predicate."
      : "Existential statements are true when at least one domain object satisfies the predicate.",
  };
}

export function buildPredicateInferenceSteps(scenario: PredicateScenario) {
  const evaluation = evaluatePredicateScenario(scenario);
  const failing = evaluation.mapped.find((item) => !item.value);
  const witness = evaluation.mapped.find((item) => item.value);
  return {
    rule: scenario.quantifier === "forall" ? "Universal instantiation" : "Existential witness",
    valid: evaluation.value,
    steps: evaluation.mapped.map((item, index) => ({
      label: `${scenario.variable} := ${item.item}`,
      statement: item.substitution,
      value: item.value,
      note: scenario.quantifier === "forall"
        ? `Universal check ${index + 1}: every substitution must be true.`
        : `Existential check ${index + 1}: one true substitution is enough.`,
    })),
    conclusion: scenario.quantifier === "forall"
      ? failing ? `Counterexample: ${failing.substitution} is false.` : `Every object satisfies ${scenario.predicateName}.`
      : witness ? `Witness found: ${witness.substitution} is true.` : `No witness satisfies ${scenario.predicateName}.`,
  };
}
