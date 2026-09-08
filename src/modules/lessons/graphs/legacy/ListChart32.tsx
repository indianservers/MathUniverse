const colors=["blue","green","orange","purple"];
export function ListChart({
  values,
  view,
  selected,
}: {
  values: number[];
  view: "bar" | "dot";
  selected: number;
}) {
  const max = Math.max(1, ...values.map(Math.abs));
  return (
    <svg
      viewBox="0 0 390 145"
      role="img"
      aria-label={`${view} visualization of ordered list`}
    >
      <line x1="34" y1="119" x2="380" y2="119" />
      <line x1="34" y1="8" x2="34" y2="119" />
      {values.map((value, index) => {
        const height = (Math.abs(value) / max) * 85,
          x = 58 + index * 77;
        return (
          <g key={index}>
            {view === "bar" ? (
              <rect
                className={`${colors[index % 4]} ${selected === index ? "selected" : ""}`}
                x={x}
                y={119 - height}
                width="48"
                height={height}
              />
            ) : (
              <circle
                className={`${colors[index % 4]} ${selected === index ? "selected" : ""}`}
                cx={x + 24}
                cy={119 - height}
                r="8"
              />
            )}
            <text x={x + 19} y={110 - height}>
              {value}
            </text>
            <text x={x + 20} y="139">
              {index + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

