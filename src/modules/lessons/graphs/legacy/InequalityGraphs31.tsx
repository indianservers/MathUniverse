import nerdamer from "nerdamer";
type Operator = "<" | "<=" | ">" | ">=" | "=";
type Model = {
  left: string;
  right: string;
  inputOperator: Operator;
  solutionOperator: Operator;
  valid: boolean;
  boundary: number;
  inclusive: boolean;
  flipped: boolean;
  leftA: number;
  leftB: number;
  rightA: number;
  rightB: number;
  error: string;
};
const engine = nerdamer as unknown as (
  expression: string,
  substitutions?: Record<string, string>,
) => { evaluate: () => { toString: () => string } };
const format = (value: number) =>
  Number.isFinite(value)
    ? Number.isInteger(Math.round(value * 100) / 100)
      ? String(Math.round(value * 100) / 100)
      : (Math.round(value * 100) / 100).toFixed(2)
    : "?";
function evaluate(expression: string, x: number) {
  try {
    const normalized = expression.replace(/(\d)\s*x/gi, "$1*x");
    const value = Number(
      engine(normalized, { x: String(x) })
        .evaluate()
        .toString(),
    );
    return Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}
export function NumberLine({ model }: { model: Model }) {
  const boundary = model.valid ? model.boundary : 4,
    operator = model.valid ? model.solutionOperator : "<",
    x = 150 + boundary * 17,
    left = operator.startsWith("<");
  return (
    <svg
      viewBox="0 0 350 120"
      role="img"
      aria-label="Inequality solution on number line"
    >
      <line className="base" x1="12" y1="55" x2="338" y2="55" />
      <line
        className="region"
        x1={left ? 12 : x}
        y1="55"
        x2={left ? x : 338}
        y2="55"
      />
      <path
        className="arrow"
        d={left ? "M12 55l10-7v14z" : "M338 55l-10-7v14z"}
      />
      <circle
        className={model.inclusive ? "closed" : "open"}
        cx={x}
        cy="55"
        r="9"
      />
      {[-6, -4, -2, 0, 2, 4, 6, 8, 10].map((value) => (
        <g key={value}>
          <line x1={150 + value * 17} y1="50" x2={150 + value * 17} y2="61" />
          <text x={145 + value * 17} y="86">
            {value}
          </text>
        </g>
      ))}
    </svg>
  );
}
export function ComparisonGraph({ model }: { model: Model }) {
  const graphModel = model.valid
      ? model
      : {
          ...model,
          leftA: 2,
          leftB: 3,
          rightA: 0,
          rightB: 11,
          boundary: 4,
          left: "2x + 3",
          right: "11",
        },
    map = (x: number, y: number) => ({ x: 145 + x * 20, y: 185 - y * 8 }),
    path = (a: number, b: number) => {
      const p1 = map(-6, a * -6 + b),
        p2 = map(8, a * 8 + b);
      return `M${p1.x},${p1.y}L${p2.x},${p2.y}`;
    },
    point = map(
      graphModel.boundary,
      evaluate(graphModel.left, graphModel.boundary),
    );
  return (
    <svg
      viewBox="0 0 340 285"
      role="img"
      aria-label="Graph comparison and inequality region"
    >
      <defs>
        <pattern
          id="inequality-grid"
          width="40"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path d="M40 0H0V32" fill="none" stroke="#dce4ea" />
        </pattern>
      </defs>
      <rect width="340" height="285" fill="url(#inequality-grid)" />
      <rect
        className="shade"
        x="25"
        y={point.y}
        width={Math.max(0, point.x - 25)}
        height={Math.max(0, 185 - point.y)}
      />
      <line className="axis" x1="15" y1="185" x2="330" y2="185" />
      <line className="axis" x1="145" y1="8" x2="145" y2="275" />
      <path
        className="left-line"
        d={path(graphModel.leftA, graphModel.leftB)}
      />
      <path
        className="right-line"
        d={path(graphModel.rightA, graphModel.rightB)}
      />
      <circle
        className={model.inclusive ? "closed" : "open"}
        cx={point.x}
        cy={point.y}
        r="7"
      />
      <text x={point.x + 8} y={point.y + 22}>
        ({format(graphModel.boundary)},{" "}
        {format(evaluate(graphModel.left, graphModel.boundary))})
      </text>
    </svg>
  );
}

