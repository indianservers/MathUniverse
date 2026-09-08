const FRAMES = [0, 0.5, 1, 1.5, 2, 2];
export function LegacyAnimationGraph24({ frame }: { frame: number }) {
  const active = FRAMES[frame],
    traces = [active, ...FRAMES.slice(Math.max(0, frame - 2), frame).reverse()]
      .filter((value, index, array) => array.indexOf(value) === index)
      .slice(0, 3);
  const map = (x: number, y: number) => ({ x: 302 + x * 55, y: 349 - y * 55 });
  return (
    <section className="animation-graph">
      <svg
        viewBox="0 0 640 560"
        role="img"
        aria-label={`Animated graph y equals ${active}x plus 1`}
      >
        <defs>
          <pattern
            id="animation-grid"
            width="27.5"
            height="27.5"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 27.5 0 L 0 0 0 27.5"
              fill="none"
              stroke="#e8edf2"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="640" height="560" fill="url(#animation-grid)" />
        <line className="axis" x1="10" y1="349" x2="628" y2="349" />
        <line className="axis" x1="302" y1="15" x2="302" y2="540" />
        {traces.map((slope, index) => {
          const p1 = map(-5, slope * -5 + 1),
            p2 = map(5, slope * 5 + 1);
          return (
            <line
              className={`trace t${index}`}
              key={`${slope}-${index}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
            />
          );
        })}
        <circle
          className="origin-point"
          cx={map(0, 1).x}
          cy={map(0, 1).y}
          r="6"
        />
        <circle
          className="output-point"
          cx={map(2, 2 * active + 1).x}
          cy={map(2, 2 * active + 1).y}
          r="6"
        />
        <text className="point-label" x={map(0, 1).x - 45} y={map(0, 1).y - 17}>
          (0, 1)
        </text>
        <text
          className="point-label"
          x={map(2, 2 * active + 1).x - 35}
          y={map(2, 2 * active + 1).y - 18}
        >
          (2, {2 * active + 1})
        </text>
        <text x="612" y="341">
          x
        </text>
        <text x="313" y="18">
          y
        </text>
        {[-4, -2, -1, 0, 1, 2, 3, 4].map((value) => (
          <text
            className="tick"
            key={`x${value}`}
            x={map(value, 0).x - 5}
            y="370"
          >
            {value}
          </text>
        ))}
        {[-3, -2, -1, 1, 2, 3, 4, 5, 6].map((value) => (
          <text
            className="tick"
            key={`y${value}`}
            x="280"
            y={map(0, value).y + 4}
          >
            {value}
          </text>
        ))}
        <g className="equation" transform="translate(482 24)">
          <rect width="143" height="50" rx="6" />
          <text x="17" y="32">
            y = ax + 1
          </text>
        </g>
        <g className="legend" transform="translate(12 16)">
          <rect width="195" height="108" rx="7" />
          <line className="trace t0" x1="14" y1="24" x2="50" y2="24" />
          <text x="70" y="29">
            Current: a = {active.toFixed(1)}
          </text>
          {traces.slice(1).map((slope, index) => (
            <g key={slope} transform={`translate(0 ${34 * (index + 1)})`}>
              <line
                className={`trace t${index + 1}`}
                x1="14"
                y1="24"
                x2="50"
                y2="24"
              />
              <text x="70" y="29">
                Previous: a = {slope.toFixed(1)}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </section>
  );
}

