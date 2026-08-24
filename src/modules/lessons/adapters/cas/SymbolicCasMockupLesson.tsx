import {
  AlertTriangle,
  ArrowRight,
  Braces,
  Calculator,
  CheckCircle2,
  CircleDot,
  Copy,
  Eye,
  FunctionSquare,
  GitBranch,
  Grid3X3,
  Lightbulb,
  Link2,
  Play,
  RefreshCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { runWorkspaceCasQuery } from "../../../../cas/workspaceCas";
import type { LessonAdapterProps } from "../../types";

type CasKind =
  | "transform"
  | "solve"
  | "system"
  | "rational"
  | "calculus"
  | "matrix"
  | "complex"
  | "assumption"
  | "exact"
  | "steps"
  | "graph";

type CasSpec = {
  id: number;
  mockup: string;
  title: string;
  kind: CasKind;
  command: string;
  input: string;
  result: string;
  numeric: string;
  rule: string;
  ruleFormula: string;
  notice: string;
  misconception: string;
  examples: string[];
  steps: string[];
  challenge: string;
  challengeAnswer: string;
};

const casRows: Array<Omit<CasSpec, "id" | "mockup">> = [
  {
    title: "Symbolic Evaluation",
    kind: "transform",
    command: "simplify",
    input: "2*(x+3)+x-x+4-2",
    result: "2x + 8",
    numeric: "14 when x = 3",
    rule: "Combine like terms",
    ruleFormula: "ax + bx = (a + b)x",
    notice:
      "Exact evaluation keeps algebraic structure and assumptions visible.",
    misconception:
      "Unlike terms cannot be combined just because they appear together.",
    examples: ["2x + 3x", "sqrt(18)", "(x^2-1)/(x-1)"],
    steps: [
      "Distribute multiplication",
      "Collect variable terms",
      "Combine constants",
    ],
    challenge: "4y - 2y + y - 5 + 3",
    challengeAnswer: "3y - 2",
  },
  {
    title: "Simplify",
    kind: "transform",
    command: "simplify",
    input: "(x^2-1)/(x-1)",
    result: "x + 1, x != 1",
    numeric: "5 when x = 4",
    rule: "Cancel common factors",
    ruleFormula: "ab/ac = b/c, a != 0",
    notice: "A cancelled factor still leaves a domain restriction.",
    misconception:
      "Cancellation applies to factors, not to separate added terms.",
    examples: ["(x^2-4)/(x-2)", "6x/3", "2a+3a"],
    steps: [
      "Factor the numerator",
      "Identify the common factor",
      "Cancel and preserve the restriction",
    ],
    challenge: "(y^2-9)/(y-3)",
    challengeAnswer: "y + 3, y != 3",
  },
  {
    title: "Expand",
    kind: "transform",
    command: "expand",
    input: "(x+2)*(x-3)",
    result: "x^2 - x - 6",
    numeric: "0 when x = 3",
    rule: "Distributive property",
    ruleFormula: "a(b + c) = ab + ac",
    notice: "Every term in one factor multiplies every term in the other.",
    misconception: "Do not multiply only the first and last terms.",
    examples: ["(x+1)^2", "3(a-2)", "(2x-1)(x+4)"],
    steps: ["Distribute x", "Distribute 2", "Combine the middle terms"],
    challenge: "(y+4)*(y-2)",
    challengeAnswer: "y^2 + 2y - 8",
  },
  {
    title: "Factor",
    kind: "transform",
    command: "factor",
    input: "x^2-5*x+6",
    result: "(x - 2)(x - 3)",
    numeric: "0 at x = 2 or 3",
    rule: "Product-sum pattern",
    ruleFormula: "x^2 + bx + c = (x+m)(x+n)",
    notice: "The two factor constants multiply to c and add to b.",
    misconception:
      "Sign pairs must satisfy both the sum and product conditions.",
    examples: ["x^2-9", "x^2+7x+12", "2x^2+6x"],
    steps: [
      "Find a factor pair of 6",
      "Choose the pair summing to -5",
      "Verify by expanding",
    ],
    challenge: "y^2 + y - 12",
    challengeAnswer: "(y + 4)(y - 3)",
  },
  {
    title: "Substitute",
    kind: "transform",
    command: "simplify",
    input: "f(x)=x^2+2*x-1; x=3",
    result: "f(3) = 14",
    numeric: "14",
    rule: "Substitution",
    ruleFormula: "f(a) replaces every x by a",
    notice: "Parentheses protect the substituted value during evaluation.",
    misconception:
      "Replace every occurrence of the variable, including powers.",
    examples: ["x=-2", "a=1/2", "x=t+1"],
    steps: [
      "Replace each x with 3",
      "Evaluate the exponent",
      "Combine exact values",
    ],
    challenge: "g(y)=2y^2-y; y=-2",
    challengeAnswer: "10",
  },
  {
    title: "Solve",
    kind: "solve",
    command: "solve",
    input: "x^2-5*x+6=0",
    result: "x = 2 or x = 3",
    numeric: "{2, 3}",
    rule: "Zero-product property",
    ruleFormula: "ab = 0 => a = 0 or b = 0",
    notice: "Factoring exposes every exact root of the quadratic.",
    misconception:
      "A quadratic can have two solutions; do not stop after finding one.",
    examples: ["x+4=9", "x^2=16", "2x^2-8=0"],
    steps: [
      "Move all terms to one side",
      "Factor the polynomial",
      "Set each factor equal to zero",
    ],
    challenge: "x^2 + 2x - 8 = 0",
    challengeAnswer: "x = 2 or x = -4",
  },
  {
    title: "Numerical Solve",
    kind: "solve",
    command: "solve",
    input: "cos(x)=x",
    result: "x ~= 0.739085",
    numeric: "0.7390851332",
    rule: "Newton iteration",
    ruleFormula: "x_(n+1) = x_n - f(x_n)/f'(x_n)",
    notice: "A numerical root is an approximation controlled by tolerance.",
    misconception:
      "More displayed digits do not make an unstable method exact.",
    examples: ["e^-x=x", "x^3-x-1=0", "sin(x)=0.4"],
    steps: [
      "Choose an initial estimate",
      "Apply Newton iteration",
      "Stop when the residual is below tolerance",
    ],
    challenge: "x^3 - 2 = 0",
    challengeAnswer: "x ~= 1.259921",
  },
  {
    title: "Solve Systems",
    kind: "system",
    command: "solve",
    input: "2x+3y=13; x-y=1",
    result: "x = 16/5, y = 11/5",
    numeric: "(3.2, 2.2)",
    rule: "Elimination",
    ruleFormula: "Align one pair of coefficients, then add",
    notice:
      "The graph intersection and the algebraic solution are the same point.",
    misconception:
      "Only combine equations after matching one variable's coefficients.",
    examples: ["x+y=5", "2x-y=1", "3x+2y=14"],
    steps: [
      "Write the equations",
      "Multiply one equation",
      "Add to eliminate y",
      "Back-substitute",
    ],
    challenge: "x+y=7; x-y=1",
    challengeAnswer: "x = 4, y = 3",
  },
  {
    title: "Eliminate Variables",
    kind: "system",
    command: "solve",
    input: "x+y=5; 2x-y=1; eliminate y",
    result: "3x = 6",
    numeric: "x = 2, y = 3",
    rule: "Linear combination",
    ruleFormula: "E1 + E2 removes opposite coefficients",
    notice: "Elimination produces a relation in fewer variables.",
    misconception:
      "The same operation must apply to every term in an equation.",
    examples: ["eliminate x", "substitution", "row reduction"],
    steps: [
      "Align the selected variable",
      "Add the equations",
      "Solve the remaining relation",
    ],
    challenge: "2a+b=9; a-b=0",
    challengeAnswer: "a = 3, b = 3",
  },
  {
    title: "Partial Fractions",
    kind: "rational",
    command: "simplify",
    input: "(3x+5)/((x+1)*(x+2))",
    result: "2/(x+1) + 1/(x+2)",
    numeric: "5/6 when x = 1",
    rule: "Partial fraction decomposition",
    ruleFormula: "P/Q = A/(x-a) + B/(x-b)",
    notice: "Equating coefficients determines the unknown numerators.",
    misconception: "Decompose only after the denominator has been factored.",
    examples: ["1/(x^2-1)", "x/(x^2+3x+2)", "proper fractions"],
    steps: [
      "Factor the denominator",
      "Write the decomposition",
      "Clear denominators",
      "Match coefficients",
    ],
    challenge: "(2x+3)/((x+1)*(x+2))",
    challengeAnswer: "1/(x+1) + 1/(x+2)",
  },
  {
    title: "Polynomial Division",
    kind: "rational",
    command: "simplify",
    input: "(x^3-1)/(x-1)",
    result: "x^2 + x + 1",
    numeric: "7 when x = 2",
    rule: "Polynomial division algorithm",
    ruleFormula: "dividend = divisor*quotient + remainder",
    notice: "Each quotient term cancels the current leading term.",
    misconception:
      "Missing powers need zero placeholders during long division.",
    examples: ["(x^2-1)/(x-1)", "synthetic division", "remainder theorem"],
    steps: [
      "Divide leading terms",
      "Multiply and subtract",
      "Bring down the next term",
      "Check the remainder",
    ],
    challenge: "(y^3+8)/(y+2)",
    challengeAnswer: "y^2 - 2y + 4",
  },
  {
    title: "Derivatives",
    kind: "calculus",
    command: "differentiate",
    input: "(x^3+2x)*(x^2-1)/(x-2)^2",
    result: "(2x^4-8x^3-4x^2+16x-4)/(x-2)^3",
    numeric: "f'(1) = 2",
    rule: "Quotient, product, and chain rules",
    ruleFormula: "(u/v)' = (u'v - uv')/v^2",
    notice: "Rule annotations expose how the derivative tree is assembled.",
    misconception:
      "The quotient rule numerator uses subtraction in a fixed order.",
    examples: ["d/dx x^3", "d/dx sin x", "d/dx (x^2+1)^4"],
    steps: [
      "Identify outer quotient",
      "Differentiate the product",
      "Apply the chain rule",
      "Simplify",
    ],
    challenge: "d/dx (x^2+3)(x-1)^2",
    challengeAnswer: "2x(x-1)^2 + 2(x^2+3)(x-1)",
  },
  {
    title: "Integrals",
    kind: "calculus",
    command: "integrate",
    input: "3x^2+2x",
    result: "x^3 + x^2 + C",
    numeric: "10/3 on [0, 1]",
    rule: "Power rule for integration",
    ruleFormula: "integral x^n dx = x^(n+1)/(n+1) + C",
    notice: "Differentiating the antiderivative verifies the symbolic result.",
    misconception:
      "An indefinite integral requires the constant of integration.",
    examples: ["integral x^4", "integral cos x", "area on [0,2]"],
    steps: [
      "Split the sum",
      "Apply the power rule",
      "Add the integration constant",
      "Differentiate to verify",
    ],
    challenge: "integral (4x^3-2x) dx",
    challengeAnswer: "x^4 - x^2 + C",
  },
  {
    title: "Limits",
    kind: "calculus",
    command: "simplify",
    input: "lim x->0 sin(x)/x",
    result: "1",
    numeric: "0.999999999999",
    rule: "Standard trigonometric limit",
    ruleFormula: "lim_(x->0) sin(x)/x = 1",
    notice: "Nearby values approach the limit from both sides.",
    misconception:
      "Direct substitution can produce an indeterminate form, not the final answer.",
    examples: ["lim (x^2-1)/(x-1)", "lim 1/x", "lim x->infinity"],
    steps: [
      "Try direct substitution",
      "Recognize 0/0",
      "Apply the standard limit",
      "Compare both sides",
    ],
    challenge: "lim x->0 sin(3x)/x",
    challengeAnswer: "3",
  },
  {
    title: "Series Expansions",
    kind: "calculus",
    command: "expand",
    input: "exp(x) about x=0 to order 5",
    result: "1 + x + x^2/2 + x^3/6 + x^4/24 + O(x^5)",
    numeric: "2.70833 at x = 1",
    rule: "Taylor series",
    ruleFormula: "f(x) = sum f^(n)(a)(x-a)^n/n!",
    notice:
      "Increasing order improves the local approximation near the centre.",
    misconception:
      "A truncated series is not automatically accurate far from its centre.",
    examples: ["sin x", "cos x", "ln(1+x)"],
    steps: [
      "Choose the centre",
      "Compute derivatives",
      "Evaluate coefficients",
      "Truncate at the selected order",
    ],
    challenge: "sin x to order 5",
    challengeAnswer: "x - x^3/6 + x^5/120",
  },
  {
    title: "Differential Equations",
    kind: "calculus",
    command: "solve",
    input: "y'=2xy; y(0)=3",
    result: "y = 3e^(x^2)",
    numeric: "y(1) ~= 8.15485",
    rule: "Separation of variables",
    ruleFormula: "dy/y = 2x dx",
    notice:
      "The initial condition determines the constant in the solution family.",
    misconception:
      "A differential equation solution is a function, not a single number.",
    examples: ["y'=ky", "y'+y=x", "y''+y=0"],
    steps: [
      "Separate x and y",
      "Integrate both sides",
      "Exponentiate",
      "Apply the initial condition",
    ],
    challenge: "y'=3x^2; y(0)=2",
    challengeAnswer: "y = x^3 + 2",
  },
  {
    title: "Matrix Operations",
    kind: "matrix",
    command: "simplify",
    input: "A=[[2,3],[-1,4]]",
    result: "det(A) = 11",
    numeric: "A(1,2) = (8, 7)",
    rule: "Matrix-vector multiplication",
    ruleFormula: "[a b; c d][x;y] = [ax+by; cx+dy]",
    notice: "Each matrix row controls one output coordinate.",
    misconception:
      "Matrix multiplication combines row entries; columns are not scaled independently.",
    examples: ["A+B", "AB", "det A"],
    steps: [
      "Read a matrix row",
      "Form its dot product",
      "Repeat for each output",
      "Interpret the transformation",
    ],
    challenge: "[[1,2],[-2,1]](1,2)",
    challengeAnswer: "(5, 0)",
  },
  {
    title: "Complex Calculations",
    kind: "complex",
    command: "expand",
    input: "(2+3i)*(1-i)",
    result: "5 + i",
    numeric: "|5+i| = sqrt(26)",
    rule: "Imaginary unit",
    ruleFormula: "i^2 = -1",
    notice: "Complex multiplication combines algebra with the rule i^2=-1.",
    misconception: "The imaginary parts multiply to a real negative term.",
    examples: ["(1+i)^2", "1/(2-i)", "z conjugate"],
    steps: [
      "Distribute both factors",
      "Replace i^2 with -1",
      "Collect real and imaginary parts",
    ],
    challenge: "(3+2i)(2-i)",
    challengeAnswer: "8 + i",
  },
  {
    title: "Assumptions",
    kind: "assumption",
    command: "simplify",
    input: "sqrt(x^2)",
    result: "x when x >= 0",
    numeric: "|x| without assumptions",
    rule: "Domain-aware simplification",
    ruleFormula: "sqrt(x^2) = |x| for real x",
    notice: "Assumptions change which symbolic transformations are valid.",
    misconception:
      "sqrt(x^2) is not always x unless x is known to be nonnegative.",
    examples: ["x>0", "n integer", "z real"],
    steps: [
      "Inspect the expression domain",
      "Apply the selected assumption",
      "Simplify with conditions",
      "Report restrictions",
    ],
    challenge: "simplify |a| when a<0",
    challengeAnswer: "-a",
  },
  {
    title: "Exact / Numeric Toggle",
    kind: "exact",
    command: "simplify",
    input: "2*3^2*5 - 7/4 + sqrt(2)",
    result: "353/4 + sqrt(2)",
    numeric: "89.66421356",
    rule: "Exact versus numeric",
    ruleFormula: "exact structure <-> decimal approximation",
    notice: "Exact mode preserves surds, fractions, exponents, and parameters.",
    misconception:
      "A decimal approximation is not more correct than an exact result.",
    examples: ["sqrt(2)", "1/3", "2*pi"],
    steps: [
      "Evaluate integer powers",
      "Preserve the rational part",
      "Keep the surd exact",
      "Approximate at chosen precision",
    ],
    challenge: "2sqrt(5) + 3/2 - 1/sqrt(5)",
    challengeAnswer: "9sqrt(5)/5 + 3/2",
  },
  {
    title: "Step-by-Step Algebra",
    kind: "steps",
    command: "simplify",
    input: "2*(x+3)+x-x+4-2",
    result: "2x + 8",
    numeric: "14 when x = 3",
    rule: "Distributive property",
    ruleFormula: "a(b+c) = ab+ac",
    notice:
      "A valid next move keeps equality and moves toward the stated goal.",
    misconception:
      "Distribute the outside factor to every term inside the parentheses.",
    examples: ["3(x-2)+4x-5", "combine terms", "simplify constants"],
    steps: ["Distribute 2 across (x+3)", "Combine x and -x", "Simplify 6+4-2"],
    challenge: "4(x+1)-3x+2",
    challengeAnswer: "x + 6",
  },
  {
    title: "CAS-to-Graph Link",
    kind: "graph",
    command: "simplify",
    input: "2x+4",
    result: "f(x) = 2x + 4",
    numeric: "slope 2, intercept 4",
    rule: "Symbolic-to-visual connection",
    ruleFormula: "y=ax+b: slope=a, y-intercept=b",
    notice: "Changing a CAS parameter updates the linked graph instantly.",
    misconception:
      "Changing slope can also change where a line crosses the axes.",
    examples: ["2x+4", "3x-2", "x^2-4"],
    steps: [
      "Read the expression",
      "Identify parameters",
      "Plot the graph",
      "Verify key points",
    ],
    challenge: "line with slope -2 and intercept 3",
    challengeAnswer: "y = -2x + 3",
  },
];

const SPECS = new Map<number, CasSpec>(
  casRows.map((row, index) => [
    428 + index,
    { ...row, id: 428 + index, mockup: String(334 + index).padStart(4, "0") },
  ]),
);

const processSteps = [
  [Eye, "Observe", "Read the expression and the goal."],
  [Calculator, "Manipulate", "Change values or apply a CAS command."],
  [Lightbulb, "Notice", "Track the structure and live result."],
  [Target, "Understand", "Connect the rule to the verified output."],
] as const;

export default function SymbolicCasMockupLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const spec = SPECS.get(lesson.id) ?? SPECS.get(428)!;
  const [expression, setExpression] = useState(spec.input);
  const [result, setResult] = useState(spec.result);
  const [mode, setMode] = useState<"exact" | "numeric">("exact");
  const [precision, setPrecision] = useState(8);
  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [matrix, setMatrix] = useState([2, 3, -1, 4]);

  useEffect(() => {
    setExpression(spec.input);
    setResult(spec.result);
    setMode("exact");
    setPrecision(8);
    setActiveStep(0);
    setChecked(false);
    setShowSolution(false);
    setMatrix([2, 3, -1, 4]);
  }, [resetToken, spec]);

  const displayedResult = mode === "exact" ? result : spec.numeric;
  const graphValues = useMemo(
    () => ({ slope: 2 + activeStep * 0.25, intercept: 4 - activeStep }),
    [activeStep],
  );

  const interact = () => onInteraction();
  const calculate = () => {
    const query = runWorkspaceCasQuery(`${spec.command} ${expression}`);
    setResult(
      query?.result && query.result !== expression ? query.result : spec.result,
    );
    setActiveStep(spec.steps.length - 1);
    setChecked(true);
    interact();
  };

  return (
    <section
      className="space-y-3 text-slate-900"
      data-testid={`symbolic-cas-mockup-${spec.mockup}`}
      data-target-family="symbolic-mathematics-cas-workspace"
    >
      <div className="grid gap-2 md:grid-cols-4">
        {processSteps.map(([Icon, label, description], index) => (
          <button
            key={label}
            type="button"
            data-lesson-control={`cas-process-${index + 1}`}
            onClick={() => {
              setActiveStep(Math.min(index, spec.steps.length - 1));
              interact();
            }}
            className={`min-h-24 border p-3 text-left transition ${activeStep === index ? "border-cyan-500 bg-cyan-50" : "border-slate-200 bg-white hover:border-violet-300"}`}
          >
            <span className="flex items-center gap-2 text-xs font-black text-blue-700">
              <Icon className="h-4 w-4" /> {index + 1} {label}
            </span>
            <span className="mt-2 block text-xs leading-5 text-slate-600">
              {description}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <p className="text-[10px] font-black uppercase text-cyan-700">
            CAS Workspace
          </p>
          <h2 className="mt-1 text-xl font-black">
            {spec.title} - reusable CAS engine
          </h2>
          <p className="mt-1 text-sm text-slate-600">{spec.notice}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-black">
          <span className="border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700">
            <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> Exact engine
          </span>
          <button
            type="button"
            data-lesson-control="cas-reset"
            onClick={() => {
              setExpression(spec.input);
              setResult(spec.result);
              setActiveStep(0);
              setChecked(false);
              interact();
            }}
            className="border border-slate-200 bg-white p-2"
            aria-label="Reset CAS workspace"
            title="Reset workspace"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_minmax(220px,.68fr)]">
        <div className="min-w-0 border border-slate-200 bg-white">
          <div className="grid gap-3 border-b border-slate-200 p-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <label className="min-w-0 text-xs font-black text-slate-700">
              Expression or equation
              <input
                value={expression}
                data-lesson-control="cas-expression"
                aria-label={`${spec.title} expression`}
                onChange={(event) => {
                  setExpression(event.target.value);
                  setChecked(false);
                  interact();
                }}
                className="mt-2 h-11 w-full border border-slate-300 bg-slate-50 px-3 font-mono text-sm outline-none focus:border-cyan-500"
              />
            </label>
            <div className="flex items-end gap-2">
              <button
                type="button"
                data-lesson-control="cas-run"
                onClick={calculate}
                className="inline-flex h-11 items-center gap-2 bg-cyan-600 px-4 text-xs font-black text-white hover:bg-cyan-700"
              >
                <Play className="h-4 w-4" /> Apply {spec.command}
              </button>
              <button
                type="button"
                data-lesson-control="cas-copy"
                onClick={interact}
                className="h-11 border border-slate-200 bg-white p-3"
                aria-label="Copy CAS result"
                title="Copy result"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid min-h-[420px] gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,.8fr)]">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                {spec.examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    data-lesson-control="cas-example"
                    onClick={() => {
                      setExpression(example);
                      setChecked(false);
                      interact();
                    }}
                    className="border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-xs hover:border-cyan-400"
                  >
                    {example}
                  </button>
                ))}
              </div>
              <ModelVisual
                spec={spec}
                activeStep={activeStep}
                matrix={matrix}
                setMatrix={(index, value) => {
                  setMatrix((current) =>
                    current.map((entry, entryIndex) =>
                      entryIndex === index ? value : entry,
                    ),
                  );
                  interact();
                }}
                graphValues={graphValues}
              />
            </div>

            <div className="min-w-0 border-l border-slate-200 pl-3">
              <p className="text-[10px] font-black uppercase text-violet-700">
                Step-by-step transformation
              </p>
              <div className="mt-3 space-y-2">
                {spec.steps.map((step, index) => (
                  <button
                    key={step}
                    type="button"
                    data-lesson-control={`cas-step-${index + 1}`}
                    onClick={() => {
                      setActiveStep(index);
                      interact();
                    }}
                    className={`flex w-full items-start gap-3 border p-3 text-left ${index <= activeStep ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-black ${index <= activeStep ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold leading-5">{step}</span>
                  </button>
                ))}
              </div>
              <div
                className={`mt-3 border p-3 ${checked ? "border-emerald-300 bg-emerald-50" : "border-violet-200 bg-violet-50"}`}
              >
                <p className="text-[10px] font-black uppercase text-slate-500">
                  CAS result
                </p>
                <output className="mt-2 block font-serif text-base font-black text-slate-950 [overflow-wrap:anywhere] sm:text-lg">
                  {displayedResult}
                </output>
                <p className="mt-2 text-xs text-slate-600">
                  {checked
                    ? "Verified from the current input."
                    : "Apply the command to verify the result."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <Panel
            icon={<FunctionSquare className="h-4 w-4 text-blue-600" />}
            title="Relevant rule"
          >
            <p className="font-black">{spec.rule}</p>
            <div className="mt-3 border border-blue-100 bg-blue-50 p-3 font-serif text-lg text-blue-950">
              {spec.ruleFormula}
            </div>
          </Panel>

          <Panel
            icon={<Braces className="h-4 w-4 text-violet-600" />}
            title="Output mode"
          >
            <div className="grid grid-cols-2 gap-2">
              {(["exact", "numeric"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  data-lesson-control={`cas-mode-${value}`}
                  onClick={() => {
                    setMode(value);
                    interact();
                  }}
                  className={`min-h-14 border text-xs font-black uppercase ${mode === value ? "border-violet-500 bg-violet-50 text-violet-800" : "border-slate-200 bg-white text-slate-600"}`}
                >
                  {value}
                </button>
              ))}
            </div>
            <label className="mt-3 block text-xs font-black text-slate-600">
              Precision: {precision} digits
              <input
                data-lesson-control="cas-precision"
                aria-label="Numeric precision"
                type="range"
                min="3"
                max="14"
                value={precision}
                onChange={(event) => {
                  setPrecision(Number(event.target.value));
                  interact();
                }}
                className="mt-2 w-full accent-violet-600"
              />
            </label>
          </Panel>

          <Panel
            icon={<AlertTriangle className="h-4 w-4 text-rose-600" />}
            title="Common misconception"
            tone="danger"
          >
            <p className="text-sm leading-6 text-slate-700">
              {spec.misconception}
            </p>
          </Panel>
        </aside>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel
          icon={<Sparkles className="h-4 w-4 text-cyan-600" />}
          title="Worked example"
        >
          <p className="font-mono text-sm">{spec.input}</p>
          <ArrowRight className="my-2 h-4 w-4 text-cyan-600" />
          <p className="font-serif text-base font-black [overflow-wrap:anywhere] sm:text-lg">
            {spec.result}
          </p>
        </Panel>
        <Panel
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          title="Verify the structure"
        >
          {spec.steps.slice(0, 3).map((step) => (
            <p key={step} className="mt-2 flex gap-2 text-xs leading-5">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              {step}
            </p>
          ))}
        </Panel>
        <Panel
          icon={<Target className="h-4 w-4 text-violet-600" />}
          title="Quick practice"
        >
          <p className="font-mono text-sm font-black">{spec.challenge}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              data-lesson-control="cas-check-challenge"
              onClick={() => {
                setChecked(true);
                interact();
              }}
              className="bg-violet-600 px-3 py-2 text-xs font-black text-white"
            >
              Check
            </button>
            <button
              type="button"
              data-lesson-control="cas-show-solution"
              onClick={() => {
                setShowSolution((value) => !value);
                interact();
              }}
              className="border border-violet-300 px-3 py-2 text-xs font-black text-violet-700"
            >
              Show solution
            </button>
          </div>
          {showSolution ? (
            <p className="mt-3 border-l-4 border-emerald-500 bg-emerald-50 p-2 font-serif font-black text-emerald-900">
              {spec.challengeAnswer}
            </p>
          ) : null}
        </Panel>
      </div>
    </section>
  );
}

function Panel({
  icon,
  title,
  tone = "default",
  children,
}: {
  icon: ReactNode;
  title: string;
  tone?: "default" | "danger";
  children: ReactNode;
}) {
  return (
    <section
      className={`border p-3 ${tone === "danger" ? "border-rose-200 bg-rose-50/60" : "border-slate-200 bg-white"}`}
    >
      <h3
        className={`flex items-center gap-2 text-xs font-black uppercase ${tone === "danger" ? "text-rose-700" : "text-slate-700"}`}
      >
        {icon}
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ModelVisual({
  spec,
  activeStep,
  matrix,
  setMatrix,
  graphValues,
}: {
  spec: CasSpec;
  activeStep: number;
  matrix: number[];
  setMatrix: (index: number, value: number) => void;
  graphValues: { slope: number; intercept: number };
}) {
  if (spec.kind === "matrix")
    return <MatrixModel matrix={matrix} setMatrix={setMatrix} />;
  if (spec.kind === "complex") return <ComplexModel />;
  if (spec.kind === "system" || spec.kind === "graph")
    return (
      <GraphModel
        system={spec.kind === "system"}
        slope={graphValues.slope}
        intercept={graphValues.intercept}
      />
    );
  if (spec.kind === "calculus")
    return <CalculusModel title={spec.title} activeStep={activeStep} />;
  if (spec.kind === "solve") return <BalanceModel activeStep={activeStep} />;
  if (spec.kind === "rational")
    return <DivisionModel activeStep={activeStep} />;
  if (spec.kind === "exact") return <ExactModel />;
  if (spec.kind === "assumption") return <AssumptionModel />;
  if (spec.kind === "steps") return <StepModel activeStep={activeStep} />;
  return <TransformTree activeStep={activeStep} />;
}

function TransformTree({ activeStep }: { activeStep: number }) {
  return (
    <div className="min-h-72 border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase text-cyan-700">
        Expression structure
      </p>
      <div className="mt-5 grid grid-cols-3 items-center gap-2 text-center">
        <Node label="Input" value="2(x+3)+x-x+4-2" active />
        <ArrowRight className="mx-auto h-5 w-5 text-slate-400" />
        <Node label="Exact result" value="2x + 8" active={activeStep > 1} />
      </div>
      <div className="mx-auto mt-6 max-w-sm border-t border-slate-300 pt-4">
        <div className="grid grid-cols-3 gap-2">
          <Node label="Operation" value="Distribute" active={activeStep >= 0} />
          <Node label="Operation" value="Collect" active={activeStep >= 1} />
          <Node label="Operation" value="Simplify" active={activeStep >= 2} />
        </div>
      </div>
    </div>
  );
}

function BalanceModel({ activeStep }: { activeStep: number }) {
  return (
    <div className="min-h-72 border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase text-cyan-700">
        Balanced equation model
      </p>
      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div className="border-b-4 border-blue-700 pb-3 text-center font-serif text-lg font-black text-blue-800">
          x^2 - 5x + 6
        </div>
        <div className="h-12 w-1 bg-slate-700" />
        <div className="border-b-4 border-violet-700 pb-3 text-center font-serif text-lg font-black text-violet-800">
          0
        </div>
      </div>
      <div className="mx-auto h-0 w-0 border-x-[10px] border-b-[16px] border-x-transparent border-b-slate-700" />
      <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs font-black">
        <span className="border border-blue-200 bg-blue-50 p-3">Add 5x</span>
        <span className="border border-cyan-200 bg-cyan-50 p-3">
          Subtract 6
        </span>
        <span className="border border-violet-200 bg-violet-50 p-3">
          {activeStep > 1 ? "(x-2)(x-3)=0" : "Factor"}
        </span>
      </div>
    </div>
  );
}

function DivisionModel({ activeStep }: { activeStep: number }) {
  return (
    <div className="min-h-72 border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase text-cyan-700">
        Decomposition workspace
      </p>
      <div className="mt-8 text-center font-serif text-xl font-black">
        <span className="border-b border-slate-700">3x + 5</span>
        <br />
        <span>(x + 1)(x + 2)</span>
      </div>
      <div className="my-5 flex items-center justify-center gap-3 text-xl text-violet-700">
        <ArrowRight className="h-5 w-5" />
        <span className="font-serif">A/(x+1) + B/(x+2)</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Node
          label="Coefficient A"
          value={activeStep > 1 ? "2" : "?"}
          active={activeStep > 1}
        />
        <Node
          label="Coefficient B"
          value={activeStep > 2 ? "1" : "?"}
          active={activeStep > 2}
        />
      </div>
    </div>
  );
}

function CalculusModel({
  title,
  activeStep,
}: {
  title: string;
  activeStep: number;
}) {
  const integral = title === "Integrals";
  const series = title === "Series Expansions";
  const ode = title === "Differential Equations";
  return (
    <div className="min-h-72 border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase text-cyan-700">
          {title} model
        </p>
        <span className="text-[10px] font-black text-emerald-700">
          Rule tree live
        </span>
      </div>
      <svg
        viewBox="0 0 520 250"
        className="mt-2 h-56 w-full"
        role="img"
        aria-label={`${title} symbolic visualization`}
      >
        <g stroke="#dbe4f0" strokeWidth="1">
          {[40, 80, 120, 160, 200].map((y) => (
            <line key={y} x1="20" y1={y} x2="500" y2={y} />
          ))}
        </g>
        <line x1="30" y1="200" x2="495" y2="200" stroke="#64748b" />
        <line x1="70" y1="20" x2="70" y2="225" stroke="#64748b" />
        {integral ? (
          <>
            <path
              d="M70 190 C135 170 155 55 235 105 S365 205 470 45 L470 200 L70 200 Z"
              fill="#8b5cf6"
              opacity=".18"
            />
            <path
              d="M70 190 C135 170 155 55 235 105 S365 205 470 45"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="4"
            />
          </>
        ) : ode ? (
          <>
            {[95, 145, 195, 245, 295, 345, 395].map((x, i) => (
              <path
                key={x}
                d={`M${x - 10} ${190 - i * 18} l20 -${8 + i}`}
                stroke="#0891b2"
                strokeWidth="2"
              />
            ))}
            <path
              d="M70 195 C160 190 230 150 300 95 S420 35 480 28"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="4"
            />
          </>
        ) : series ? (
          <>
            <path
              d="M70 195 C170 185 260 150 335 95 S430 35 480 25"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
            />
            <path
              d="M70 195 Q270 185 480 35"
              fill="none"
              stroke="#8b5cf6"
              strokeDasharray="8 6"
              strokeWidth="3"
            />
          </>
        ) : (
          <>
            <path
              d="M70 190 C150 175 205 65 275 95 S385 205 475 70"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
            />
            <line
              x1="145"
              y1="188"
              x2="350"
              y2="68"
              stroke="#8b5cf6"
              strokeWidth="3"
              strokeDasharray="8 5"
            />
            <circle cx="245" cy="129" r="7" fill="#7c3aed" />
          </>
        )}
      </svg>
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black">
        <span className="bg-blue-50 p-2">Identify rule</span>
        <span className="bg-violet-50 p-2">Apply {activeStep + 1} steps</span>
        <span className="bg-emerald-50 p-2">Verify result</span>
      </div>
    </div>
  );
}

function MatrixModel({
  matrix,
  setMatrix,
}: {
  matrix: number[];
  setMatrix: (index: number, value: number) => void;
}) {
  const points = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ].map(([x, y]) => [
    x * matrix[0] + y * matrix[1],
    x * matrix[2] + y * matrix[3],
  ]);
  const path =
    points
      .map(([x, y], i) => `${i ? "L" : "M"} ${180 + x * 35} ${190 - y * 28}`)
      .join(" ") + " Z";
  return (
    <div className="grid min-h-72 gap-3 2xl:grid-cols-[180px_1fr]">
      <div className="border border-slate-200 bg-slate-50 p-3">
        <p className="text-[10px] font-black uppercase text-cyan-700">
          Input matrix A
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {matrix.map((value, index) => (
            <input
              key={index}
              type="number"
              data-lesson-control={`matrix-entry-${index}`}
              aria-label={`Matrix entry ${index + 1}`}
              value={value}
              onChange={(event) => setMatrix(index, Number(event.target.value))}
              className="h-12 border border-cyan-200 bg-white text-center font-mono font-black"
            />
          ))}
        </div>
        <p className="mt-4 font-serif">
          A = [{matrix[0]} {matrix[1]}; {matrix[2]} {matrix[3]}]
        </p>
      </div>
      <svg
        viewBox="0 0 430 260"
        className="h-64 w-full border border-slate-200 bg-white"
        role="img"
        aria-label="Matrix transformation of the unit square"
      >
        <g stroke="#e2e8f0">
          {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map((x) => (
            <line key={x} x1={x} y1="10" x2={x} y2="250" />
          ))}
          {[30, 70, 110, 150, 190, 230].map((y) => (
            <line key={y} x1="10" y1={y} x2="420" y2={y} />
          ))}
        </g>
        <line x1="10" y1="190" x2="420" y2="190" stroke="#64748b" />
        <line x1="180" y1="10" x2="180" y2="250" stroke="#64748b" />
        <path
          d={path}
          fill="#8b5cf6"
          fillOpacity=".22"
          stroke="#7c3aed"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

function ComplexModel() {
  return (
    <svg
      viewBox="0 0 520 300"
      className="h-72 w-full border border-slate-200 bg-slate-50"
      role="img"
      aria-label="Complex number plane"
    >
      <g stroke="#dbe4f0">
        {[60, 120, 180, 240, 300, 360, 420, 480].map((x) => (
          <line key={x} x1={x} y1="15" x2={x} y2="285" />
        ))}
        {[40, 90, 140, 190, 240].map((y) => (
          <line key={y} x1="15" y1={y} x2="505" y2={y} />
        ))}
      </g>
      <line
        x1="15"
        y1="190"
        x2="505"
        y2="190"
        stroke="#475569"
        strokeWidth="2"
      />
      <line
        x1="240"
        y1="15"
        x2="240"
        y2="285"
        stroke="#475569"
        strokeWidth="2"
      />
      <line
        x1="240"
        y1="190"
        x2="440"
        y2="150"
        stroke="#7c3aed"
        strokeWidth="4"
      />
      <circle cx="440" cy="150" r="8" fill="#7c3aed" />
      <text x="450" y="145" fill="#6d28d9" fontWeight="700">
        5 + i
      </text>
      <text x="470" y="210" fill="#475569">
        Re
      </text>
      <text x="250" y="30" fill="#475569">
        Im
      </text>
    </svg>
  );
}

function ExactModel() {
  return (
    <div className="grid min-h-72 gap-3 md:grid-cols-2">
      <div className="border border-blue-200 bg-blue-50 p-4">
        <p className="text-[10px] font-black uppercase text-blue-700">
          Exact symbolic result
        </p>
        <p className="mt-8 text-center font-serif text-2xl font-black">
          353/4 + sqrt(2)
        </p>
        <p className="mt-8 text-xs text-blue-700">
          Fractions and surds are preserved.
        </p>
      </div>
      <div className="border border-violet-200 bg-violet-50 p-4">
        <p className="text-[10px] font-black uppercase text-violet-700">
          Numeric decimal result
        </p>
        <p className="mt-8 text-center font-mono text-2xl font-black">
          89.66421356
        </p>
        <p className="mt-8 text-xs text-violet-700">
          Rounded to the selected precision.
        </p>
      </div>
    </div>
  );
}

function AssumptionModel() {
  return (
    <div className="min-h-72 border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase text-cyan-700">
        Assumption manager
      </p>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <Node label="Expression" value="sqrt(x^2)" active />
        <Node label="Assumption" value="x >= 0" active />
        <Node label="Result" value="x" active />
      </div>
      <div className="mt-6 border border-emerald-200 bg-emerald-50 p-4 text-sm">
        <CheckCircle2 className="mr-2 inline h-4 w-4 text-emerald-600" />
        Domain condition is active and attached to the result.
      </div>
    </div>
  );
}

function StepModel({ activeStep }: { activeStep: number }) {
  const values = ["2(x+3)+x-x+4-2", "(2x+6)+x-x+4-2", "2x+6+4-2", "2x+8"];
  return (
    <div className="min-h-72 border border-slate-200 bg-[#071a35] p-4 text-white">
      <p className="text-[10px] font-black uppercase text-cyan-300">
        Current expression
      </p>
      <p className="mt-4 border border-cyan-400/30 bg-white/10 p-4 font-serif text-xl">
        {values[Math.min(activeStep + 1, 3)]}
      </p>
      <div className="mt-6 space-y-2">
        {values.slice(1).map((value, index) => (
          <div
            key={value}
            className={`border p-3 text-sm ${index <= activeStep ? "border-emerald-400 bg-emerald-400/10" : "border-white/15"}`}
          >
            <CircleDot className="mr-2 inline h-4 w-4" />
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}

function GraphModel({
  system,
  slope,
  intercept,
}: {
  system: boolean;
  slope: number;
  intercept: number;
}) {
  const y = (x: number, m: number, b: number) => 150 - (m * x + b) * 12;
  return (
    <div className="min-h-72 border border-slate-200 bg-white p-2">
      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] font-black uppercase text-cyan-700">
          {system ? "System graph" : "Linked graph output"}
        </p>
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700">
          <Link2 className="h-3.5 w-3.5" /> Live linkage
        </span>
      </div>
      <svg
        viewBox="0 0 520 300"
        className="h-72 w-full"
        role="img"
        aria-label={
          system ? "Graph of a linear equation system" : "CAS-linked graph"
        }
      >
        <g stroke="#e2e8f0">
          {[40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480].map(
            (x) => (
              <line key={x} x1={x} y1="10" x2={x} y2="290" />
            ),
          )}
          {[30, 70, 110, 150, 190, 230, 270].map((yv) => (
            <line key={yv} x1="10" y1={yv} x2="510" y2={yv} />
          ))}
        </g>
        <line x1="10" y1="150" x2="510" y2="150" stroke="#475569" />
        <line x1="260" y1="10" x2="260" y2="290" stroke="#475569" />
        <line
          x1="20"
          y1={y(-10, slope, intercept)}
          x2="500"
          y2={y(10, slope, intercept)}
          stroke="#2563eb"
          strokeWidth="4"
        />
        {system ? (
          <>
            <line
              x1="20"
              y1={y(-10, -1, 5)}
              x2="500"
              y2={y(10, -1, 5)}
              stroke="#7c3aed"
              strokeWidth="4"
            />
            <circle cx="320" cy="114" r="8" fill="#0f172a" />
          </>
        ) : (
          <>
            <path
              d="M110 245 Q260 65 410 245"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="3"
            />
            <line
              x1="20"
              y1={y(-10, 3, -2)}
              x2="500"
              y2={y(10, 3, -2)}
              stroke="#8b5cf6"
              strokeWidth="3"
              strokeDasharray="8 5"
            />
          </>
        )}
      </svg>
    </div>
  );
}

function Node({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`border p-3 ${active ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-white"}`}
    >
      <span className="block text-[9px] font-black uppercase text-slate-500">
        {label}
      </span>
      <strong className="mt-1 block break-words font-mono text-xs">
        {value}
      </strong>
    </div>
  );
}
