import type { MathAstNode, MathDiagnostic, ParseResult, SourceRange } from "./types";

type TokenKind = "number" | "identifier" | "operator" | "punctuation" | "eof";
type Token = { kind: TokenKind; value: string; start: number; end: number };

const binaryPrecedence: Record<string, number> = { "+": 10, "-": 10, "*": 20, "/": 20, "^": 30 };
const comparisonOperators = new Set(["<", "<=", ">", ">=", "!="]);

function tokenize(source: string): { tokens: Token[]; diagnostics: MathDiagnostic[] } {
  const tokens: Token[] = [];
  const diagnostics: MathDiagnostic[] = [];
  let index = 0;
  while (index < source.length) {
    const character = source[index];
    if (/\s/.test(character)) { index += 1; continue; }
    if (/\d|\./.test(character)) {
      const start = index;
      let dots = 0;
      while (index < source.length && /[\d.]/.test(source[index])) { if (source[index] === ".") dots += 1; index += 1; }
      const value = source.slice(start, index);
      if (dots > 1 || value === ".") diagnostics.push({ code: "INVALID_NUMBER", severity: "ERROR", message: `Invalid number '${value}'.`, sourceRange: { start, end: index } });
      tokens.push({ kind: "number", value, start, end: index });
      continue;
    }
    if (/[A-Za-z_\u03c0\u03b1-\u03c9\u0391-\u03a9]/.test(character)) {
      const start = index;
      index += 1;
      while (index < source.length && /[A-Za-z0-9_\u03b1-\u03c9\u0391-\u03a9]/.test(source[index])) index += 1;
      tokens.push({ kind: "identifier", value: source.slice(start, index), start, end: index });
      continue;
    }
    const pair = source.slice(index, index + 2);
    if (["<=", ">=", "!=", ":="].includes(pair)) { tokens.push({ kind: "operator", value: pair, start: index, end: index + 2 }); index += 2; continue; }
    if ("+-*/^=<>".includes(character)) { tokens.push({ kind: "operator", value: character, start: index, end: index + 1 }); index += 1; continue; }
    if ("()[]{},;".includes(character)) { tokens.push({ kind: "punctuation", value: character, start: index, end: index + 1 }); index += 1; continue; }
    diagnostics.push({ code: "INVALID_CHARACTER", severity: "ERROR", message: `Unexpected character '${character}'.`, sourceRange: { start: index, end: index + 1 } });
    index += 1;
  }
  tokens.push({ kind: "eof", value: "", start: source.length, end: source.length });
  return { tokens, diagnostics };
}

class Parser {
  private position = 0;
  private sequence = 0;
  readonly diagnostics: MathDiagnostic[] = [];
  constructor(private readonly source: string, private readonly tokens: Token[]) {}

  parse(): MathAstNode | undefined {
    if (this.peek().kind === "eof") { this.error("EMPTY_EXPRESSION", "Enter a mathematical expression.", this.peek()); return undefined; }
    const definition = this.tryDefinition();
    const expression = definition ?? this.parseComparison();
    if (this.peek().kind !== "eof") this.error("UNEXPECTED_TOKEN", `Unexpected token '${this.peek().value}'.`, this.peek());
    return expression;
  }

  private tryDefinition(): MathAstNode | undefined {
    const checkpoint = this.position;
    const name = this.peek();
    if (name.kind !== "identifier") return undefined;
    this.consume();
    const parameters: string[] = [];
    if (this.match("(")) {
      if (!this.check(")")) {
        do {
          const parameter = this.peek();
          if (parameter.kind !== "identifier") { this.position = checkpoint; return undefined; }
          parameters.push(this.consume().value);
        } while (this.match(","));
      }
      if (!this.match(")")) { this.position = checkpoint; return undefined; }
    }
    if (!this.match("=") && !this.match(":" + "=")) { this.position = checkpoint; return undefined; }
    const expression = this.parseComparison();
    const range = { start: name.start, end: expression.sourceRange.end };
    return this.node("DEFINITION", range, { name: name.value, parameters, expression, mathType: parameters.length ? "FUNCTION" : expression.mathType, domain: expression.domain });
  }

  private parseComparison(): MathAstNode {
    const left = this.parseBinary(0);
    const token = this.peek();
    if (token.value === "=") {
      this.consume(); const right = this.parseBinary(0);
      return this.node("EQUATION", this.span(left, right), { left, right, mathType: "EQUATION", domain: "BOOLEAN" });
    }
    if (comparisonOperators.has(token.value)) {
      this.consume(); const right = this.parseBinary(0);
      return this.node("INEQUALITY", this.span(left, right), { operator: token.value as "<" | "<=" | ">" | ">=" | "!=", left, right, mathType: "BOOLEAN", domain: "BOOLEAN" });
    }
    return left;
  }

  private parseBinary(minimum: number): MathAstNode {
    let left = this.parseUnary();
    while (true) {
      const token = this.peek();
      const implicit = this.startsPrimary(token);
      const operator = implicit ? "*" : token.value;
      const precedence = binaryPrecedence[operator];
      if (precedence === undefined || precedence < minimum) break;
      if (!implicit) this.consume();
      const right = this.parseBinary(operator === "^" ? precedence : precedence + 1);
      left = this.node("BINARY_OPERATION", this.span(left, right), { operator: operator as "+" | "-" | "*" | "/" | "^", left, right, mathType: "SCALAR", domain: "UNKNOWN" });
    }
    return left;
  }

  private parseUnary(): MathAstNode {
    const token = this.peek();
    if (token.value === "+" || token.value === "-") {
      this.consume(); const operand = this.parseUnary();
      return this.node("UNARY_OPERATION", { start: token.start, end: operand.sourceRange.end }, { operator: token.value, operand, mathType: operand.mathType, domain: operand.domain });
    }
    return this.parsePrimary();
  }

  private parsePrimary(): MathAstNode {
    const token = this.consume();
    if (token.kind === "number") return this.node("LITERAL", { start: token.start, end: token.end }, { value: token.value, literalKind: token.value.includes(".") ? "DECIMAL" : "INTEGER", mathType: "SCALAR", domain: token.value.includes(".") ? "REAL" : "INTEGER" });
    if (token.kind === "identifier") {
      if ((token.value === "true" || token.value === "false") && !this.check("(")) return this.node("LITERAL", { start: token.start, end: token.end }, { value: token.value, literalKind: "BOOLEAN", mathType: "BOOLEAN", domain: "BOOLEAN" });
      if (this.match("(")) {
        const arguments_: MathAstNode[] = [];
        if (!this.check(")")) { do { arguments_.push(this.parseComparison()); } while (this.match(",")); }
        const close = this.expect(")", "MISSING_CLOSING_PARENTHESIS");
        return this.node("FUNCTION_CALL", { start: token.start, end: close.end }, { name: token.value, arguments: arguments_, mathType: "SCALAR", domain: "UNKNOWN" });
      }
      return this.node("SYMBOL", { start: token.start, end: token.end }, { name: token.value === "π" ? "pi" : token.value, mathType: "SCALAR", domain: "UNKNOWN" });
    }
    if (token.value === "(") {
      const first = this.parseComparison();
      if (this.match(",")) {
        const items = [first]; do { items.push(this.parseComparison()); } while (this.match(","));
        const close = this.expect(")", "MISSING_CLOSING_PARENTHESIS");
        return this.node("VECTOR", { start: token.start, end: close.end }, { items, mathType: "VECTOR", domain: "UNKNOWN" });
      }
      this.expect(")", "MISSING_CLOSING_PARENTHESIS"); return first;
    }
    if (token.value === "[") return this.parseBracket(token);
    this.error("EXPECTED_EXPRESSION", "Expected a number, symbol, function, vector, list, or matrix.", token);
    return this.node("LITERAL", { start: token.start, end: token.end }, { value: "0", literalKind: "INTEGER", mathType: "SCALAR", domain: "INTEGER", validation: "INVALID" });
  }

  private parseBracket(open: Token): MathAstNode {
    const items: MathAstNode[] = [];
    if (!this.check("]")) { do { items.push(this.parseComparison()); } while (this.match(",")); }
    const close = this.expect("]", "MISSING_CLOSING_BRACKET");
    if (items.length > 0 && items.every((item) => item.type === "LIST")) {
      const rows = items.map((item) => item.type === "LIST" ? item.items : []);
      const widths = new Set(rows.map((row) => row.length));
      if (widths.size > 1) this.error("INVALID_MATRIX_DIMENSIONS", "Matrix rows must have equal length.", open);
      return this.node("MATRIX", { start: open.start, end: close.end }, { rows, mathType: "MATRIX", domain: "UNKNOWN", validation: widths.size > 1 ? "INVALID" : "VALID" });
    }
    return this.node("LIST", { start: open.start, end: close.end }, { items, mathType: "LIST", domain: "UNKNOWN" });
  }

  private node<T extends MathAstNode["type"]>(type: T, sourceRange: SourceRange, extra: Omit<Extract<MathAstNode, { type: T }>, "type" | "id" | "sourceRange" | "assumptions" | "validation"> & { validation?: "VALID" | "INVALID" | "UNVALIDATED" }): Extract<MathAstNode, { type: T }> {
    const validation = extra.validation ?? "VALID";
    return { type, id: `ast-${sourceRange.start}-${sourceRange.end}-${this.sequence++}`, sourceRange, assumptions: [], validation, ...extra } as unknown as Extract<MathAstNode, { type: T }>;
  }
  private span(left: MathAstNode, right: MathAstNode) { return { start: left.sourceRange.start, end: right.sourceRange.end }; }
  private startsPrimary(token: Token) { return token.kind === "number" || token.kind === "identifier" || token.value === "(" || token.value === "["; }
  private peek() { return this.tokens[this.position]; }
  private consume() { return this.tokens[this.position++]; }
  private check(value: string) { return this.peek().value === value; }
  private match(value: string) { if (!this.check(value)) return false; this.consume(); return true; }
  private expect(value: string, code: string) { if (this.check(value)) return this.consume(); const token = this.peek(); this.error(code, `Expected '${value}'.`, token); return token; }
  private error(code: string, message: string, token: Token) { this.diagnostics.push({ code, severity: "ERROR", message, sourceRange: { start: token.start, end: token.end } }); }
}

export function parseMath(source: string): ParseResult {
  const tokenized = tokenize(source);
  const parser = new Parser(source, tokenized.tokens);
  const ast = parser.parse();
  return { source, ast, diagnostics: [...tokenized.diagnostics, ...parser.diagnostics] };
}

export function serializeAst(node: MathAstNode): string {
  const sort = (value: unknown): unknown => Array.isArray(value) ? value.map(sort) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, nested]) => [key, sort(nested)])) : value;
  return JSON.stringify(sort(node));
}

export function collectSymbols(node: MathAstNode, excluded = new Set<string>()): string[] {
  const symbols = new Set<string>();
  const visit = (current: MathAstNode) => {
    switch (current.type) {
      case "SYMBOL": if (!excluded.has(current.name) && !["pi", "e", "i"].includes(current.name)) symbols.add(current.name); break;
      case "UNARY_OPERATION": visit(current.operand); break;
      case "BINARY_OPERATION": visit(current.left); visit(current.right); break;
      case "FUNCTION_CALL": current.arguments.forEach(visit); if (!excluded.has(current.name)) symbols.add(current.name); break;
      case "DEFINITION": visit(current.expression); break;
      case "EQUATION": case "INEQUALITY": visit(current.left); visit(current.right); break;
      case "LIST": case "VECTOR": current.items.forEach(visit); break;
      case "MATRIX": current.rows.flat().forEach(visit); break;
      case "PIECEWISE": current.cases.forEach((entry) => { visit(entry.value); visit(entry.condition); }); if (current.otherwise) visit(current.otherwise); break;
      case "LITERAL": break;
    }
  };
  visit(node);
  return [...symbols].sort();
}
