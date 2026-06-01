export type OperationTable = Record<string, Record<string, string>>;
export type BooleanAst =
  | { type: "var"; name: string }
  | { type: "not"; child: BooleanAst }
  | { type: "binary"; op: "and" | "or" | "xor"; left: BooleanAst; right: BooleanAst };

export type AlgebraicValidation = {
  closed: boolean;
  associative: boolean;
  identity: string | null;
  semigroup: boolean;
  monoid: boolean;
  failures: string[];
};

type Token = { type: "var" | "op" | "left" | "right"; value: string };

const precedence: Record<string, number> = { "!": 3, "&": 2, "^": 1, "|": 0 };

export function modularTable(size: number, mode: "add" | "multiply" = "add"): { elements: string[]; table: OperationTable } {
  const elements = Array.from({ length: size }, (_, index) => String(index));
  const table = Object.fromEntries(elements.map((a) => [
    a,
    Object.fromEntries(elements.map((b) => [b, String(mode === "add" ? (Number(a) + Number(b)) % size : (Number(a) * Number(b)) % size)])),
  ])) as OperationTable;
  return { elements, table };
}

export function rebuildOperationTable(elements: string[], table: OperationTable): OperationTable {
  const fallback = elements[0] ?? "";
  return Object.fromEntries(elements.map((row) => [
    row,
    Object.fromEntries(elements.map((column) => [column, elements.includes(table[row]?.[column]) ? table[row][column] : fallback])),
  ])) as OperationTable;
}

export function validateOperation(elements: string[], table: OperationTable): AlgebraicValidation {
  const elementSet = new Set(elements);
  const failures: string[] = [];
  const closed = elements.every((a) => elements.every((b) => {
    const value = table[a]?.[b];
    const ok = elementSet.has(value);
    if (!ok) failures.push(`${a} * ${b} = ${value ?? "undefined"} is outside the set.`);
    return ok;
  }));
  const associative = elements.every((a) => elements.every((b) => elements.every((c) => {
    const left = table[table[a]?.[b]]?.[c];
    const right = table[a]?.[table[b]?.[c]];
    const ok = left === right;
    if (!ok && failures.length < 5) failures.push(`Associativity fails at (${a}, ${b}, ${c}): (${a}*${b})*${c}=${left}, ${a}*(${b}*${c})=${right}.`);
    return ok;
  })));
  const identity = elements.find((candidate) => elements.every((x) => table[candidate]?.[x] === x && table[x]?.[candidate] === x)) ?? null;
  const semigroup = closed && associative;
  return { closed, associative, identity, semigroup, monoid: semigroup && identity !== null, failures };
}

export function operationAnimation(elements: string[], table: OperationTable, a: string, b: string) {
  return [
    { label: "Choose left operand", value: a },
    { label: "Choose right operand", value: b },
    { label: "Read table intersection", value: table[a]?.[b] ?? "undefined" },
  ];
}

export function parseBooleanExpression(input: string): BooleanAst {
  const output: Token[] = [];
  const ops: Token[] = [];
  for (const token of tokenize(input)) {
    if (token.type === "var") output.push(token);
    if (token.type === "op") {
      while (ops.length && ops[ops.length - 1].type === "op" && precedence[ops[ops.length - 1].value] >= precedence[token.value]) output.push(ops.pop()!);
      ops.push(token);
    }
    if (token.type === "left") ops.push(token);
    if (token.type === "right") {
      while (ops.length && ops[ops.length - 1].type !== "left") output.push(ops.pop()!);
      if (!ops.length) throw new Error("Mismatched parentheses.");
      ops.pop();
    }
  }
  while (ops.length) {
    const op = ops.pop()!;
    if (op.type === "left") throw new Error("Mismatched parentheses.");
    output.push(op);
  }
  const stack: BooleanAst[] = [];
  for (const token of output) {
    if (token.type === "var") stack.push({ type: "var", name: token.value });
    if (token.type === "op") {
      if (token.value === "!") {
        const child = stack.pop();
        if (!child) throw new Error("NOT is missing an operand.");
        stack.push({ type: "not", child });
      } else {
        const right = stack.pop();
        const left = stack.pop();
        if (!left || !right) throw new Error(`${token.value} is missing an operand.`);
        stack.push({ type: "binary", op: token.value === "&" ? "and" : token.value === "|" ? "or" : "xor", left, right });
      }
    }
  }
  if (stack.length !== 1) throw new Error("Invalid Boolean expression.");
  return stack[0];
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  for (let index = 0; index < input.length;) {
    const char = input[index];
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }
    if (/[A-Za-z]/.test(char)) {
      let name = "";
      while (/[A-Za-z0-9_]/.test(input[index] ?? "")) name += input[index++];
      tokens.push({ type: "var", value: name });
      continue;
    }
    if (char === "(") tokens.push({ type: "left", value: char });
    else if (char === ")") tokens.push({ type: "right", value: char });
    else if ("!&|^".includes(char)) tokens.push({ type: "op", value: char });
    else throw new Error(`Unexpected token ${char}.`);
    index += 1;
  }
  return tokens;
}

export function booleanVariables(ast: BooleanAst) {
  const names = new Set<string>();
  const visit = (node: BooleanAst) => {
    if (node.type === "var") names.add(node.name);
    if (node.type === "not") visit(node.child);
    if (node.type === "binary") {
      visit(node.left);
      visit(node.right);
    }
  };
  visit(ast);
  return Array.from(names).sort();
}

export function evaluateBoolean(ast: BooleanAst, values: Record<string, boolean>): boolean {
  if (ast.type === "var") return Boolean(values[ast.name]);
  if (ast.type === "not") return !evaluateBoolean(ast.child, values);
  const left = evaluateBoolean(ast.left, values);
  const right = evaluateBoolean(ast.right, values);
  if (ast.op === "and") return left && right;
  if (ast.op === "or") return left || right;
  return left !== right;
}

export function simplifyBooleanExpression(input: string) {
  const ast = parseBooleanExpression(input);
  const allVariables = booleanVariables(ast);
  if (allVariables.length > 4) throw new Error("K-map simplification supports up to four variables.");
  const variables = allVariables;
  const rows = Array.from({ length: 2 ** variables.length }, (_, mask) => {
    const values = Object.fromEntries(variables.map((name, index) => [name, Boolean(mask & (1 << (variables.length - index - 1)))])) as Record<string, boolean>;
    return { values, result: evaluateBoolean(ast, values), minterm: mask };
  });
  const trueRows = rows.filter((row) => row.result);
  const expression = trueRows.length === rows.length
    ? "1"
    : trueRows.length
    ? trueRows.map((row) => `(${variables.map((name) => row.values[name] ? name : `!${name}`).join(" & ")})`).join(" | ")
    : "0";
  return { ast, variables, rows, simplified: expression, kmap: kMapCells(variables, rows), circuit: booleanCircuitLayers(ast) };
}

function kMapCells(variables: string[], rows: Array<{ values: Record<string, boolean>; result: boolean; minterm: number }>) {
  const gray = [0, 1, 3, 2];
  const rowCount = variables.length <= 2 ? 1 : 4;
  const colCount = variables.length <= 1 ? 2 : 4;
  return Array.from({ length: rowCount }, (_, row) => Array.from({ length: colCount }, (_, col) => {
    const index = variables.length <= 2 ? gray[col] ?? col : ((gray[row] ?? row) << 2) | (gray[col] ?? col);
    return rows.find((item) => item.minterm === index)?.result ?? false;
  }));
}

export function booleanLawSteps(law: "de-morgan" | "distributive" | "associative" | "complement") {
  const laws = {
    "de-morgan": ["!(A & B)", "!A | !B", "Negation distributes and flips AND to OR."],
    distributive: ["A & (B | C)", "(A & B) | (A & C)", "A distributes across the joined expression."],
    associative: ["(A | B) | C", "A | (B | C)", "Grouping changes, truth value stays fixed."],
    complement: ["A | !A", "1", "A and its complement cover every Boolean value."],
  };
  return laws[law];
}

export function gateOutput(gate: "AND" | "OR" | "NOT" | "XOR", a: boolean, b: boolean) {
  if (gate === "AND") return a && b;
  if (gate === "OR") return a || b;
  if (gate === "NOT") return !a;
  return a !== b;
}

export function meetJoin(elements: string[], relationPairs: Array<[string, string]>, a: string, b: string) {
  const relates = new Set(relationPairs.map(([x, y]) => `${x}->${y}`));
  const leq = (x: string, y: string) => x === y || relates.has(`${x}->${y}`);
  const lower = elements.filter((x) => leq(x, a) && leq(x, b));
  const upper = elements.filter((x) => leq(a, x) && leq(b, x));
  const meet = lower.find((x) => lower.every((y) => leq(y, x))) ?? null;
  const join = upper.find((x) => upper.every((y) => leq(x, y))) ?? null;
  return { meet, join, lower, upper };
}

export function coverRelations(elements: string[], relationPairs: Array<[string, string]>) {
  const relates = new Set(relationPairs.map(([x, y]) => `${x}->${y}`));
  const leq = (x: string, y: string) => x === y || relates.has(`${x}->${y}`);
  return relationPairs.filter(([a, b]) => {
    if (a === b) return false;
    return !elements.some((middle) => middle !== a && middle !== b && leq(a, middle) && leq(middle, b));
  });
}

export function booleanCircuitLayers(ast: BooleanAst) {
  const layers: Array<Array<{ id: string; label: string }>> = [];
  let nextId = 0;
  const visit = (node: BooleanAst, depth = 0): string => {
    const id = `gate-${nextId++}`;
    const label = node.type === "var" ? node.name : node.type === "not" ? "NOT" : node.op.toUpperCase();
    layers[depth] = [...(layers[depth] ?? []), { id, label }];
    if (node.type === "not") visit(node.child, depth + 1);
    if (node.type === "binary") {
      visit(node.left, depth + 1);
      visit(node.right, depth + 1);
    }
    return id;
  };
  visit(ast);
  return layers;
}
