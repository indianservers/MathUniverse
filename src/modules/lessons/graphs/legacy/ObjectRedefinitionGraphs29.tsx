type Point = {x:number;y:number};
function format(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function PrettyRule({ expression }: { expression: string }) {
  return (
    <>
      {expression
        .split(/(\^[0-9]+)/)
        .map((part, index) =>
          part.startsWith("^") ? (
            <sup key={`${part}-${index}`}>{part.slice(1)}</sup>
          ) : (
            part
          ),
        )}
    </>
  );
}

export function RuleGraph({
  kind,
  title,
  name,
  rule,
  samples,
  pointA,
  pointB,
}: {
  kind: "before" | "after";
  title: string;
  name: string;
  rule: string;
  samples: Point[];
  pointA: number;
  pointB: number;
}) {
  const map = (point: Point) => ({
    x: 145 + point.x * 31,
    y: 132 - point.y * 27,
  });
  const path = samples
    .map((point, index) => {
      const mapped = map(point);
      return `${index ? "L" : "M"}${mapped.x.toFixed(1)},${mapped.y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <section className={`rule-graph ${kind}`}>
      <header>
        <b>{title}</b>
        <span>
          {kind === "before" ? "Old" : "New"}: {name}(x) ={" "}
          <PrettyRule expression={rule} />
        </span>
      </header>
      <p>
        {name}(x) = <PrettyRule expression={rule} />
      </p>
      <svg
        viewBox="0 0 290 230"
        role="img"
        aria-label={`${title} graph of ${name}`}
      >
        <defs>
          <pattern
            id={`rule-grid-${kind}`}
            width="31"
            height="27"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M31 0H0V27"
              fill="none"
              stroke="#e1e7ed"
              strokeDasharray="4 3"
            />
          </pattern>
        </defs>
        <rect width="290" height="230" fill={`url(#rule-grid-${kind})`} />
        <line className="axis" x1="5" y1="132" x2="285" y2="132" />
        <line className="axis" x1="145" y1="4" x2="145" y2="226" />
        <path className="plot" d={path} />
        {[
          [2, pointA, "A"],
          [0, pointB, "B"],
        ].map(([x, y, label]) => {
          const point = map({ x: Number(x), y: Number(y) });
          return (
            <g key={label}>
              <line
                className="guide"
                x1={point.x}
                y1={point.y}
                x2={point.x}
                y2="132"
              />
              <circle cx={point.x} cy={point.y} r="4" />
              <text x={point.x + 9} y={point.y + 4}>
                {label}({x}, {format(Number(y))})
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

export function Tree({ name, tone }: { name: string; tone: "old" | "new" }) {
  return (
    <section className={`tree ${tone}`}>
      <b>{name}</b>
      <small>Primary object</small>
      <i></i>
      <div>
        {["A = f(2)", "B = f(0)", "Value table", "Graph of f"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </section>
  );
}

