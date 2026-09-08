type Matrix=number[][];
export function TransformGraph({ matrix }: { matrix: Matrix }) {
  const a = matrix[0]?.[0] ?? 0,
    b = matrix[0]?.[1] ?? 0,
    c = matrix[1]?.[0] ?? 0,
    d = matrix[1]?.[1] ?? 0,
    map = (x: number, y: number) => ({ x: 270 + x * 48, y: 185 - y * 18 }),
    points = [
      [0, 0],
      [a, c],
      [a + b, c + d],
      [b, d],
    ].map(([x, y]) => map(x, y)),
    path =
      points
        .map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`)
        .join(" ") + "Z";
  return (
    <svg
      viewBox="0 0 460 250"
      role="img"
      aria-label="Matrix transformation of the unit square"
    >
      <line x1="23" y1="184" x2="150" y2="184" />
      <line x1="35" y1="205" x2="35" y2="45" />
      <rect
        x="35"
        y="104"
        width="72"
        height="80"
        fill="#eaf4ff"
        stroke="#0875ef"
      />
      <text x="32" y="226">
        Input: Unit square
      </text>
      <text x="282" y="226">
        Output: Parallelogram
      </text>
      <path className="transform-shape" d={path} />
      {points.map((point, index) => (
        <circle key={index} cx={point.x} cy={point.y} r="4" />
      ))}
      <path d="M155 135h45l-10-8m10 8l-10 8" />
      <text x="171" y="124">
        A
      </text>
    </svg>
  );
}

