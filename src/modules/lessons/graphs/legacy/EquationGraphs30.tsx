type EquationModel = {
  left: string;
  right: string;
  valid: boolean;
  linear: boolean;
  solution: number;
  solvedY: number;
  leftCoefficient: number;
  leftConstant: number;
  rightCoefficient: number;
  rightConstant: number;
  error: string;
};

function format(value: number) {
  if (!Number.isFinite(value)) return "?";
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

export function BalanceModel({ model }: { model: EquationModel }) {
  return (
    <div className="balance-model">
      <div className="beam">
        <i></i>
        <b>=</b>
      </div>
      <div className="pan left">
        <span>{format(model.leftCoefficient)}x</span>
        <span>
          {model.leftConstant >= 0
            ? `+ ${format(model.leftConstant)}`
            : format(model.leftConstant)}
        </span>
      </div>
      <div className="pan right">
        <span>
          {model.rightCoefficient
            ? `${format(model.rightCoefficient)}x`
            : format(model.rightConstant)}
        </span>
        {model.rightCoefficient && model.rightConstant ? (
          <span>
            {model.rightConstant >= 0
              ? `+ ${format(model.rightConstant)}`
              : format(model.rightConstant)}
          </span>
        ) : null}
      </div>
      <div className="stand"></div>
    </div>
  );
}

export function EquationGraph({ model }: { model: EquationModel }) {
  const safeModel = model.valid
    ? model
    : {
        ...model,
        left: "2x + 3",
        right: "11",
        solution: 4,
        solvedY: 11,
        leftCoefficient: 2,
        leftConstant: 3,
        rightCoefficient: 0,
        rightConstant: 11,
      };
  const map = (point: { x: number; y: number }) => ({
    x: 115 + point.x * 28,
    y: 235 - point.y * 14,
  });
  const linePath = (a: number, b: number) => {
    const start = map({ x: -4, y: a * -4 + b }),
      end = map({ x: 7, y: a * 7 + b });
    return `M${start.x},${start.y}L${end.x},${end.y}`;
  };
  const intersection = map({ x: safeModel.solution, y: safeModel.solvedY });
  return (
    <svg
      viewBox="0 0 350 365"
      role="img"
      aria-label="Equation lines and solution intersection"
    >
      <defs>
        <pattern
          id="equation-grid"
          width="28"
          height="56"
          patternUnits="userSpaceOnUse"
        >
          <path d="M28 0H0V56" fill="none" stroke="#dce3ea" />
        </pattern>
      </defs>
      <rect width="350" height="365" fill="url(#equation-grid)" />
      <line className="axis" x1="4" y1="235" x2="345" y2="235" />
      <line className="axis" x1="115" y1="4" x2="115" y2="360" />
      <path
        className="left-line"
        d={linePath(safeModel.leftCoefficient, safeModel.leftConstant)}
      />
      <path
        className="right-line"
        d={linePath(safeModel.rightCoefficient, safeModel.rightConstant)}
      />
      <line
        className="guide"
        x1={intersection.x}
        y1={intersection.y}
        x2={intersection.x}
        y2="235"
      />
      <circle cx={intersection.x} cy={intersection.y} r="6" />
      <text x={intersection.x + 8} y={intersection.y + 25}>
        ({format(safeModel.solution)}, {format(safeModel.solvedY)})
      </text>
      <g className="line-label left">
        <rect x="270" y="8" width="75" height="37" rx="5" />
        <text x="278" y="31">
          y = {safeModel.left}
        </text>
      </g>
      <g className="line-label right">
        <rect x="288" y="95" width="57" height="36" rx="5" />
        <text x="296" y="118">
          y = {safeModel.right}
        </text>
      </g>
    </svg>
  );
}

