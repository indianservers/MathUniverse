export type AngleMode = "DEG" | "RAD";

type Token =
  | { type: "number"; value: number }
  | { type: "operator"; value: string }
  | { type: "function"; value: string }
  | { type: "constant"; value: "pi" | "e" }
  | { type: "leftParen" }
  | { type: "rightParen" };

const functions = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "ln", "log", "exp", "sqrt", "cbrt", "abs", "factorial"]);
const precedence: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3, "u-": 3 };
const rightAssociative = new Set(["^", "u-"]);

export function factorial(value: number) {
  if (!Number.isFinite(value) || value < 0 || Math.floor(value) !== value || value > 170) throw new Error("Factorial needs an integer from 0 to 170");
  let result = 1;
  for (let index = 2; index <= value; index += 1) result *= index;
  return result;
}

export function degToRad(value: number) {
  return (value * Math.PI) / 180;
}

export function formatCalculatorResult(value: number) {
  if (!Number.isFinite(value)) throw new Error("Result is undefined");
  if (Math.abs(value) > 1e12 || (Math.abs(value) < 1e-8 && value !== 0)) return value.toExponential(8);
  return Number(value.toFixed(10)).toString();
}

export function convertDisplayToExpression(input: string) {
  return input
    .replace(/\u00f7/g, "/")
    .replace(/\u00d7/g, "*")
    .replace(/\u03c0/g, "pi")
    .replace(/\u221a/g, "sqrt")
    .replace(/\u221b/g, "cbrt")
    .replace(/e\^\(/g, "exp(")
    .replace(/10\^\(/g, "10^(")
    .replace(/\s+/g, "");
}

export function sanitizeExpression(input: string) {
  const expression = convertDisplayToExpression(input);
  const forbidden = /(window|document|globalThis|process|fetch|eval|Function|constructor|import|=>|;|=|\{|\}|\[|\])/i;
  if (forbidden.test(expression)) throw new Error("Unsupported expression");
  if (!/^[0-9+\-*/^().,%a-zA-Z]+$/.test(expression)) throw new Error("Invalid characters");
  return expression.replace(/%/g, "/100");
}

export function tokenizeExpression(input: string): Token[] {
  const expression = sanitizeExpression(input);
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
    if (/[a-zA-Z]/.test(char)) {
      let name = "";
      while (index < expression.length && /[a-zA-Z]/.test(expression[index])) name += expression[index++];
      if (name === "pi" || name === "e") tokens.push({ type: "constant", value: name });
      else if (functions.has(name)) tokens.push({ type: "function", value: name });
      else throw new Error(`Unsupported function: ${name}`);
      continue;
    }
    if (char === "(") tokens.push({ type: "leftParen" });
    else if (char === ")") tokens.push({ type: "rightParen" });
    else if ("+-*/^".includes(char)) {
      const previous = tokens[tokens.length - 1];
      const unary = char === "-" && (!previous || previous.type === "operator" || previous.type === "leftParen");
      tokens.push({ type: "operator", value: unary ? "u-" : char });
    } else {
      throw new Error("Invalid token");
    }
    index += 1;
  }
  return tokens;
}

function toRpn(tokens: Token[]) {
  const output: Token[] = [];
  const operators: Token[] = [];
  tokens.forEach((token) => {
    if (token.type === "number" || token.type === "constant") output.push(token);
    else if (token.type === "function") operators.push(token);
    else if (token.type === "operator") {
      while (operators.length) {
        const top = operators[operators.length - 1];
        if (top.type === "function" || (top.type === "operator" && (precedence[top.value] > precedence[token.value] || (precedence[top.value] === precedence[token.value] && !rightAssociative.has(token.value))))) {
          output.push(operators.pop()!);
        } else break;
      }
      operators.push(token);
    } else if (token.type === "leftParen") operators.push(token);
    else if (token.type === "rightParen") {
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

function applyFunction(name: string, value: number, angleMode: AngleMode) {
  const toAngle = (input: number) => angleMode === "DEG" ? degToRad(input) : input;
  if (name === "sin") return Math.sin(toAngle(value));
  if (name === "cos") return Math.cos(toAngle(value));
  if (name === "tan") return Math.tan(toAngle(value));
  if (name === "asin") return angleMode === "DEG" ? Math.asin(value) * 180 / Math.PI : Math.asin(value);
  if (name === "acos") return angleMode === "DEG" ? Math.acos(value) * 180 / Math.PI : Math.acos(value);
  if (name === "atan") return angleMode === "DEG" ? Math.atan(value) * 180 / Math.PI : Math.atan(value);
  if (name === "ln") return Math.log(value);
  if (name === "log") return Math.log10(value);
  if (name === "exp") return Math.exp(value);
  if (name === "sqrt") return Math.sqrt(value);
  if (name === "cbrt") return Math.cbrt(value);
  if (name === "abs") return Math.abs(value);
  if (name === "factorial") return factorial(value);
  throw new Error("Unsupported function");
}

export function evaluateExpression(input: string, angleMode: AngleMode) {
  const rpn = toRpn(tokenizeExpression(input));
  const stack: number[] = [];
  rpn.forEach((token) => {
    if (token.type === "number") stack.push(token.value);
    else if (token.type === "constant") stack.push(token.value === "pi" ? Math.PI : Math.E);
    else if (token.type === "function") {
      const value = stack.pop();
      if (value === undefined) throw new Error("Missing function argument");
      stack.push(applyFunction(token.value, value, angleMode));
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
  return formatCalculatorResult(stack[0]);
}
