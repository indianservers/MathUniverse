export type DiagnosticSeverity = "INFO" | "WARNING" | "ERROR";

export type MathDiagnostic = {
  code: string;
  severity: DiagnosticSeverity;
  message: string;
  sourceRange?: { start: number; end: number };
  nodeId?: string;
  details?: Record<string, unknown>;
};

export type MathDomain = "REAL" | "COMPLEX" | "INTEGER" | "NATURAL" | "BOOLEAN" | "UNKNOWN";
export type MathType = "SCALAR" | "BOOLEAN" | "VECTOR" | "MATRIX" | "LIST" | "FUNCTION" | "EQUATION" | "UNKNOWN";

export type MathAssumption = {
  id: string;
  symbol: string;
  domain?: MathDomain;
  constraint?: "POSITIVE" | "NON_NEGATIVE" | "NEGATIVE" | "NON_ZERO" | "INTEGER" | "NATURAL";
  interval?: { lower?: string; upper?: string; lowerInclusive: boolean; upperInclusive: boolean };
  branch?: string;
  unit?: { symbol: string; dimension: string };
};

export type ValidationState = "VALID" | "INVALID" | "UNVALIDATED";
export type SourceRange = { start: number; end: number };

type AstBase = {
  id: string;
  sourceRange: SourceRange;
  mathType: MathType;
  domain: MathDomain;
  assumptions: MathAssumption[];
  validation: ValidationState;
};

export type LiteralNode = AstBase & { type: "LITERAL"; value: string; literalKind: "INTEGER" | "DECIMAL" | "BOOLEAN" };
export type SymbolNode = AstBase & { type: "SYMBOL"; name: string };
export type UnaryOperationNode = AstBase & { type: "UNARY_OPERATION"; operator: "+" | "-"; operand: MathAstNode };
export type BinaryOperationNode = AstBase & { type: "BINARY_OPERATION"; operator: "+" | "-" | "*" | "/" | "^"; left: MathAstNode; right: MathAstNode };
export type FunctionCallNode = AstBase & { type: "FUNCTION_CALL"; name: string; arguments: MathAstNode[] };
export type DefinitionNode = AstBase & { type: "DEFINITION"; name: string; parameters: string[]; expression: MathAstNode };
export type EquationNode = AstBase & { type: "EQUATION"; left: MathAstNode; right: MathAstNode };
export type InequalityNode = AstBase & { type: "INEQUALITY"; operator: "<" | "<=" | ">" | ">=" | "!="; left: MathAstNode; right: MathAstNode };
export type ListNode = AstBase & { type: "LIST"; items: MathAstNode[] };
export type VectorNode = AstBase & { type: "VECTOR"; items: MathAstNode[] };
export type MatrixNode = AstBase & { type: "MATRIX"; rows: MathAstNode[][] };
export type PiecewiseNode = AstBase & { type: "PIECEWISE"; cases: { value: MathAstNode; condition: MathAstNode }[]; otherwise?: MathAstNode };

export type MathAstNode = LiteralNode | SymbolNode | UnaryOperationNode | BinaryOperationNode | FunctionCallNode | DefinitionNode | EquationNode | InequalityNode | ListNode | VectorNode | MatrixNode | PiecewiseNode;

export type ParseResult = { source: string; ast?: MathAstNode; diagnostics: MathDiagnostic[] };

export type IntegerValue = { kind: "INTEGER"; value: string };
export type RationalValue = { kind: "RATIONAL"; numerator: string; denominator: string };
export type DecimalValue = { kind: "DECIMAL"; coefficient: string; scale: number; precision: number; roundingMode: "HALF_EVEN" | "HALF_UP" | "DOWN" };
export type SurdValue = { kind: "SURD"; coefficient: RationalValue; radicand: string };
export type ComplexValue = { kind: "COMPLEX"; real: IntegerValue | RationalValue; imaginary: IntegerValue | RationalValue };
export type BooleanValue = { kind: "BOOLEAN"; value: boolean };
export type VectorValue = { kind: "VECTOR"; values: MathValue[] };
export type MatrixValue = { kind: "MATRIX"; values: MathValue[][] };
export type ListValue = { kind: "LIST"; values: MathValue[] };
export type SetValue = { kind: "SET"; values: MathValue[] };
export type IntervalValue = { kind: "INTERVAL"; lower?: MathValue; upper?: MathValue; lowerInclusive: boolean; upperInclusive: boolean };
export type FunctionValue = { kind: "FUNCTION"; parameters: string[]; body: MathAstNode; closure: Record<string, MathValue> };
export type SpecialValue = { kind: "SPECIAL"; state: "UNDEFINED" | "INDETERMINATE" | "INVALID_DOMAIN" | "NON_CONVERGENT" | "UNSUPPORTED"; reason: string };
export type UnitValue = { kind: "UNIT"; magnitude: MathValue; unit: string; dimension: string };

export type MathValue = IntegerValue | RationalValue | DecimalValue | SurdValue | ComplexValue | BooleanValue | VectorValue | MatrixValue | ListValue | SetValue | IntervalValue | FunctionValue | SpecialValue | UnitValue;

export type TransformationRecord = { id: string; operation: string; inputNodeIds: string[]; timestamp: string; description: string };
export type MathResult<T = MathValue> = {
  status: "EXACT" | "APPROXIMATE" | "UNDEFINED" | "INDETERMINATE" | "UNSUPPORTED" | "ERROR";
  value?: T;
  exactForm?: string;
  approximateForm?: string;
  precision?: number;
  assumptionsUsed: string[];
  diagnostics: MathDiagnostic[];
  provenance: TransformationRecord[];
};
