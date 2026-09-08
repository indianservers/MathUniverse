type Sample={x:number;y:number};
function format(value:number){if(!Number.isFinite(value))return "undefined";const rounded=Math.round(value*100)/100;return Number.isInteger(rounded)?String(rounded):rounded.toFixed(2);}
export function LegacyFunctionPlot28({
  samples,
  roots,
  vertex,
}: {
  samples: Sample[];
  roots: number[];
  vertex: Sample;
}) {
  const map = (point: Sample) => ({
      x: 233 + point.x * 34,
      y: 143 - point.y * 19,
    }),
    path = samples
      .map((point, index) => {
        const p = map(point);
        return `${index ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(" ");
  return (
    <svg
      className="function-preview"
      viewBox="0 0 500 280"
      role="img"
      aria-label="Parsed function graph preview"
    >
      <defs>
        <pattern
          id="input-grid"
          width="34"
          height="38"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M34 0H0V38"
            fill="none"
            stroke="#dce3ea"
            strokeDasharray="4 3"
          />
        </pattern>
      </defs>
      <rect width="500" height="280" fill="url(#input-grid)" />
      <line className="axis" x1="5" y1="143" x2="495" y2="143" />
      <line className="axis" x1="233" y1="4" x2="233" y2="276" />
      <path className="curve" d={path} />
      {roots.map((root) => {
        const p = map({ x: root, y: 0 });
        return (
          <g key={root}>
            <circle cx={p.x} cy={p.y} r="4" />
            <rect
              className="label-box"
              x={p.x - 29}
              y={p.y - 35}
              width="58"
              height="29"
              rx="6"
            />
            <text x={p.x - 21} y={p.y - 16}>
              ({format(root)}, 0)
            </text>
          </g>
        );
      })}
      <circle cx={map(vertex).x} cy={map(vertex).y} r="5" />
      <rect
        className="label-box"
        x={map(vertex).x + 8}
        y={map(vertex).y + 9}
        width="60"
        height="30"
        rx="6"
      />
      <text x={map(vertex).x + 16} y={map(vertex).y + 29}>
        ({format(vertex.x)}, {format(vertex.y)})
      </text>
      {[-6, -4, -2, 0, 2, 4, 6].map((value) => (
        <text className="tick" key={value} x={229 + value * 34} y="160">
          {value}
        </text>
      ))}
    </svg>
  );
}

