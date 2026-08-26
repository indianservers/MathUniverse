type Token =
  | { type: "number"; value: number }
  | { type: "variable" }
  | { type: "variableY" }
  | { type: "variableZ" }
  | { type: "operator"; value: string }
  | { type: "function"; value: string }
  | { type: "constant"; value: "pi" | "e" }
  | { type: "leftParen" }
  | { type: "rightParen" };

const functions = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh", "ln", "log", "exp", "sqrt", "cbrt", "abs", "floor", "ceil", "round"]);
const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3, "u-": 4 };
const rightAssociative = new Set(["^", "u-"]);

export function compileFunctionExpression(input: string) {
  const extended = compileExtendedFunction(input);
  if (extended) return extended;
  return compilePlainFunction(input);
}

function compilePlainFunction(input: string) {
  const rpn = toRpn(tokenize(input));
  return (x: number) => evaluateRpn(rpn, x);
}

export function compileTwoVariableExpression(input: string) {
  const rpn = toRpn(tokenize(input, true));
  return (x: number, y: number) => evaluateRpn(rpn, x, y);
}

export function compileThreeVariableExpression(input: string) {
  const rpn = toRpn(tokenize(input, true, true));
  return (x: number, y: number, z: number) => evaluateRpn(rpn, x, y, z);
}

function compileExtendedFunction(input: string): ((x: number) => number) | null {
  const expression = input.trim().replace(/^y\s*=\s*/i, "");
  const piecewise = expression.match(/^\{([\s\S]+)\}$/);
  if (piecewise) {
    const branches = splitTopLevel(piecewise[1]).map((branch) => {
      const separator = branch.indexOf(":");
      if (separator < 1) throw new Error("Piecewise branches need a condition followed by : and an expression");
      return {
        condition: compileCondition(branch.slice(0, separator)),
        evaluate: compileFunctionExpression(branch.slice(separator + 1)),
      };
    });
    return (x: number) => branches.find((branch) => branch.condition(x))?.evaluate(x) ?? Number.NaN;
  }

  const restriction = expression.match(/^([\s\S]+?)\s*\{([\s\S]+)\}$/);
  if (restriction) {
    const evaluate = compilePlainFunction(restriction[1]);
    const conditions = splitTopLevel(restriction[2]).map(compileCondition);
    return (x: number) => conditions.every((condition) => condition(x)) ? evaluate(x) : Number.NaN;
  }
  return null;
}

function compileCondition(input: string) {
  const condition = input.trim().replace(/\u2264/g, "<=").replace(/\u2265/g, ">=");
  const match = condition.match(/^(.+?)(<=|>=|<|>)(.+?)(?:(<=|>=|<|>)(.+))?$/);
  if (!match) throw new Error(`Unsupported condition: ${input.trim()}`);
  const left = compilePlainFunction(match[1]);
  const middle = compilePlainFunction(match[3]);
  const right = match[5] ? compilePlainFunction(match[5]) : null;
  return (x: number) => compare(left(x), match[2], middle(x)) && (!right || compare(middle(x), match[4], right(x)));
}

function compare(left: number, operator: string, right: number) {
  if (operator === "<") return left < right;
  if (operator === "<=") return left <= right;
  if (operator === ">") return left > right;
  return left >= right;
}

function splitTopLevel(input: string) {
  const values: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < input.length; index += 1) {
    if (input[index] === "(") depth += 1;
    if (input[index] === ")") depth -= 1;
    if (input[index] === "," && depth === 0) {
      values.push(input.slice(start, index).trim());
      start = index + 1;
    }
  }
  values.push(input.slice(start).trim());
  return values.filter(Boolean);
}

function normalize(input: string, allowZ = false) {
  const expression = input
    .trim()
    .replace(/^y\s*=/i, "")
    .replace(/\u00f7/g, "/")
    .replace(/\u00d7/g, "*")
    .replace(/\u03c0/g, "pi")
    .replace(/\u00b2/g, "^2")
    .replace(/\u00b3/g, "^3")
    .replace(/\s+/g, "")
    .toLowerCase()
    .replace(new RegExp(`(\\d|\\)|x|y${allowZ ? "|z" : ""}|pi|e)(?=(x|y${allowZ ? "|z" : ""}|pi|e|sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|ln|log|exp|sqrt|cbrt|abs|floor|ceil|round|\\())`, "g"), "$1*");
  const forbidden = /(window|document|globalthis|process|fetch|eval|function|constructor|import|=>|;|=|\{|\}|\[|\])/i;
  if (!expression) throw new Error("Enter a function of x");
  if (forbidden.test(expression)) throw new Error("Unsupported expression");
  if (!/^[0-9+\-*/^().,a-z]+$/.test(expression)) throw new Error("Invalid characters in function");
  return expression;
}

function tokenize(input: string, allowY = false, allowZ = false): Token[] {
  const expression = normalize(input, allowZ);
  const tokens: Token[] = [];
  let index = 0;
  while (index < expression.length) {
    const char = expression[index];
    if (/\d|\./.test(char)) {
      let raw = "";
      while (index < expression.length && /[\d.]/.test(expression[index])) raw += expression[index++];
      const value = Number(raw);
      if (!Number.isFinite(value)) throw new Error("Invalid number");
      tokens.push({ type: "number", value });
      continue;
    }
    if (/[a-z]/.test(char)) {
      let name = "";
      while (index < expression.length && /[a-z]/.test(expression[index])) name += expression[index++];
      if (name === "x") tokens.push({ type: "variable" });
      else if (name === "y" && allowY) tokens.push({ type: "variableY" } as Token);
      else if (name === "z" && allowZ) tokens.push({ type: "variableZ" } as Token);
      else if (name === "pi" || name === "e") tokens.push({ type: "constant", value: name });
      else if (functions.has(name)) tokens.push({ type: "function", value: name });
      else throw new Error(`Unsupported name: ${name}`);
      continue;
    }
    if (char === "(") tokens.push({ type: "leftParen" });
    else if (char === ")") tokens.push({ type: "rightParen" });
    else if ("+-*/^".includes(char)) {
      const previous = tokens[tokens.length - 1];
      const unary = char === "-" && (!previous || previous.type === "operator" || previous.type === "leftParen");
      tokens.push({ type: "operator", value: unary ? "u-" : char });
    } else throw new Error("Invalid token");
    index += 1;
  }
  return tokens;
}

function toRpn(tokens: Token[]) {
  const output: Token[] = [];
  const operators: Token[] = [];
  tokens.forEach((token) => {
    if (token.type === "number" || token.type === "constant" || token.type === "variable" || token.type === "variableY" || token.type === "variableZ") output.push(token);
    else if (token.type === "function") operators.push(token);
    else if (token.type === "operator") {
      while (operators.length) {
        const top = operators[operators.length - 1];
        if (top.type === "function" || (top.type === "operator" && (precedence[top.value] > precedence[token.value] || (precedence[top.value] === precedence[token.value] && !rightAssociative.has(token.value))))) output.push(operators.pop()!);
        else break;
      }
      operators.push(token);
    } else if (token.type === "leftParen") operators.push(token);
    else {
      while (operators.length && operators[operators.length - 1].type !== "leftParen") output.push(operators.pop()!);
      if (!operators.length) throw new Error("Mismatched parentheses");
      operators.pop();
      if (operators[operators.length - 1]?.type === "function") output.push(operators.pop()!);
    }
  });
  while (operators.length) {
    const token = operators.pop()!;
    if (token.type === "leftParen" || token.type === "rightParen") throw new Error("Mismatched parentheses");
    output.push(token);
  }
  return output;
}

function evaluateRpn(rpn: Token[], x: number, y = 0, z = 0) {
  const stack: number[] = [];
  rpn.forEach((token) => {
    if (token.type === "number") stack.push(token.value);
    else if (token.type === "variable") stack.push(x);
    else if (token.type === "variableY") stack.push(y);
    else if (token.type === "variableZ") stack.push(z);
    else if (token.type === "constant") stack.push(token.value === "pi" ? Math.PI : Math.E);
    else if (token.type === "function") {
      const value = stack.pop();
      if (value === undefined) throw new Error("Missing function argument");
      stack.push(applyFunction(token.value, value));
    } else if (token.type === "operator") {
      if (token.value === "u-") {
        const value = stack.pop();
        if (value === undefined) throw new Error("Missing operand");
        stack.push(-value);
      } else {
        const right = stack.pop();
        const left = stack.pop();
        if (left === undefined || right === undefined) throw new Error("Missing operand");
        if (token.value === "+") stack.push(left + right);
        if (token.value === "-") stack.push(left - right);
        if (token.value === "*") stack.push(left * right);
        if (token.value === "/") stack.push(left / right);
        if (token.value === "^") stack.push(Math.pow(left, right));
      }
    }
  });
  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}

function applyFunction(name: string, value: number) {
  if (name === "sin") return Math.sin(value);
  if (name === "cos") return Math.cos(value);
  if (name === "tan") return Math.tan(value);
  if (name === "asin") return Math.asin(value);
  if (name === "acos") return Math.acos(value);
  if (name === "atan") return Math.atan(value);
  if (name === "sinh") return Math.sinh(value);
  if (name === "cosh") return Math.cosh(value);
  if (name === "tanh") return Math.tanh(value);
  if (name === "ln") return Math.log(value);
  if (name === "log") return Math.log10(value);
  if (name === "exp") return Math.exp(value);
  if (name === "sqrt") return Math.sqrt(value);
  if (name === "cbrt") return Math.cbrt(value);
  if (name === "abs") return Math.abs(value);
  if (name === "floor") return Math.floor(value);
  if (name === "ceil") return Math.ceil(value);
  if (name === "round") return Math.round(value);
  throw new Error("Unsupported function");
}
