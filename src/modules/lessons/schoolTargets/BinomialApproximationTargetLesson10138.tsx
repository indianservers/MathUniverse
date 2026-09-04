import { Info, Lightbulb, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./BinomialApproximationTargetLesson10138.css";

const fixed = (value: number, digits = 5) => value.toFixed(digits);

export default function BinomialApproximationTargetLesson10138({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [x, setX] = useState(0.02),
    [n, setN] = useState(5),
    [zoom, setZoom] = useState(0.2);
  const [axes, setAxes] = useState(true),
    [grid, setGrid] = useState(true),
    [actions, setActions] = useState(0);
  const exact = (1 + x) ** n,
    approximate = 1 + n * x,
    error = Math.abs(exact - approximate),
    percent = exact ? (error / Math.abs(exact)) * 100 : 0;
  const percentText = (Math.floor(percent * 1000) / 1000).toFixed(3);
  const reliable = Math.abs(x) <= 0.1;
  const act = () => setActions((value) => value + 1);
  const updateX = (value: number) => {
    setX(Math.max(-zoom, Math.min(zoom, value)));
    act();
  };
  const updateN = (value: number) => {
    setN(Math.max(-10, Math.min(10, value)));
    act();
  };
  const changeZoom = (value: number) => {
    setZoom(value);
    setX((current) => Math.max(-value, Math.min(value, current)));
    act();
  };
  const reset = () => {
    setX(0.02);
    setN(5);
    setZoom(0.2);
    setAxes(true);
    setGrid(true);
    act();
  };
  const graph = useMemo(() => {
    const points = Array.from(
      { length: 101 },
      (_, i) => -zoom + (2 * zoom * i) / 100,
    ).map((gx) => ({ x: gx, curve: (1 + gx) ** n, line: 1 + n * gx }));
    const values = points.flatMap((point) => [point.curve, point.line]),
      low = Math.min(...values),
      high = Math.max(...values),
      pad = Math.max((high - low) * 0.12, 0.03);
    const yMin = low - pad,
      yMax = high + pad,
      mapX = (value: number) => 40 + ((value + zoom) / (2 * zoom)) * 620,
      mapY = (value: number) => 250 - ((value - yMin) / (yMax - yMin)) * 215;
    const path = (key: "curve" | "line") =>
      points
        .map(
          (point, i) =>
            `${i ? "L" : "M"}${mapX(point.x).toFixed(1)},${mapY(point[key]).toFixed(1)}`,
        )
        .join(" ");
    return { mapX, mapY, curve: path("curve"), line: path("line") };
  }, [n, zoom]);
  return (
    <section
      className="ba10138-page"
      data-testid="school-mockup-0812"
      data-object-model="dedicated-binomial-tangent-approximation-engine"
      data-x={x}
      data-n={n}
      data-exact={fixed(exact)}
      data-approximation={fixed(approximate)}
      data-absolute-error={fixed(error)}
      data-percent-error={percentText}
      data-zoom={zoom}
      data-axes={String(axes)}
      data-grid={String(grid)}
      data-reliable={String(reliable)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · BINOMIAL THEOREM</small>
        <h1>Binomial Approximation</h1>
        <p>For |x| small and any real n, (1+x)ⁿ ≈ 1+nx.</p>
        <p>
          Use the lab to explore accuracy, errors, and the tangent-line view at
          x=0.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>Learning</span>
        </div>
      </header>
      <main>
        <section className="ba10138-inputs">
          <h2>APPROXIMATION LAB</h2>
          <p>
            Adjust x and n to see how well the first-order approximation works.
          </p>
          <label>
            x (input)<small>|x| small</small>
            <input
              aria-label="Approximation x slider"
              type="range"
              min={-zoom}
              max={zoom}
              step="0.01"
              value={x}
              onChange={(e) => updateX(Number(e.target.value))}
            />
            <input
              aria-label="Approximation x number"
              type="number"
              min={-zoom}
              max={zoom}
              step="0.01"
              value={x}
              onChange={(e) => updateX(Number(e.target.value))}
            />
          </label>
          <label>
            n (power)<small>any real n</small>
            <input
              aria-label="Approximation n slider"
              type="range"
              min="-10"
              max="10"
              step="0.5"
              value={n}
              onChange={(e) => updateN(Number(e.target.value))}
            />
            <input
              aria-label="Approximation n number"
              type="number"
              min="-10"
              max="10"
              step="0.5"
              value={n}
              onChange={(e) => updateN(Number(e.target.value))}
            />
          </label>
          <article>
            Current expression{" "}
            <strong>
              (1+{x.toFixed(2)})^{n}
            </strong>
          </article>
          <article className="example">
            <b>Example from lesson</b>
            <p>1.02⁵ ≈ 1+5(0.02) = 1.10</p>
            <span>Exact: 1.02⁵ = 1.10408</span>
          </article>
          <aside className={reliable ? "valid" : "warning"}>
            <b>{reliable ? "Validity check" : "Accuracy warning"}</b>
            <p>
              As |x| grows, the approximation gets less reliable. Keep |x| small
              for good accuracy.
            </p>
          </aside>
        </section>
        <section className="ba10138-results">
          <h2>RESULTS (Live)</h2>
          <p>Exact vs first-order approximation near x=0.</p>
          <dl>
            <div>
              <dt>
                Exact value <small>(1+x)ⁿ</small>
              </dt>
              <dd>{fixed(exact)}</dd>
            </div>
            <div>
              <dt>
                First-order approximation <small>1+nx</small>
              </dt>
              <dd>{fixed(approximate)}</dd>
            </div>
            <div>
              <dt>Absolute error</dt>
              <dd>{fixed(error)}</dd>
            </div>
            <div>
              <dt>Percent error</dt>
              <dd>{percentText}%</dd>
            </div>
          </dl>
          <aside>
            <Info />
            <p>At x=0, the tangent line y=1+nx matches y=(1+x)ⁿ.</p>
          </aside>
        </section>
        <section className="ba10138-graph">
          <h2>TANGENT vs CURVE (zoomed near x=0)</h2>
          <div className="legend">
            <span>— y=(1+x)ⁿ</span>
            <span>-- y=1+nx</span>
            <span>● Point at x</span>
          </div>
          <svg
            viewBox="0 0 700 280"
            aria-label="Exact binomial curve and tangent approximation graph"
          >
            {grid &&
              Array.from({ length: 11 }, (_, i) => (
                <line
                  className="grid"
                  key={`v${i}`}
                  x1={40 + i * 62}
                  x2={40 + i * 62}
                  y1="35"
                  y2="250"
                />
              ))}
            {grid &&
              Array.from({ length: 7 }, (_, i) => (
                <line
                  className="grid"
                  key={`h${i}`}
                  x1="40"
                  x2="660"
                  y1={35 + i * 35.8}
                  y2={35 + i * 35.8}
                />
              ))}
            {axes && (
              <>
                <line
                  className="axis"
                  x1="40"
                  x2="660"
                  y1={graph.mapY(1)}
                  y2={graph.mapY(1)}
                />
                <line
                  className="axis"
                  x1={graph.mapX(0)}
                  x2={graph.mapX(0)}
                  y1="35"
                  y2="250"
                />
              </>
            )}
            <path className="curve" d={graph.curve} />
            <path className="line" d={graph.line} />
            <line
              className="guide"
              x1={graph.mapX(x)}
              x2={graph.mapX(x)}
              y1={graph.mapY(exact)}
              y2="250"
            />
            <circle cx={graph.mapX(x)} cy={graph.mapY(exact)} r="7" />
            <text
              x={Math.min(570, graph.mapX(x) + 10)}
              y={graph.mapY(exact) - 8}
            >
              ({x.toFixed(2)}, {fixed(exact)})
            </text>
          </svg>
          <footer>
            <span>Zoom</span>
            {[0.2, 0.1, 0.05, 0.02].map((value) => (
              <button
                className={zoom === value ? "active" : ""}
                key={value}
                onClick={() => changeZoom(value)}
              >
                ±{value}
              </button>
            ))}
            <label>
              <input
                type="checkbox"
                checked={axes}
                onChange={() => {
                  setAxes((value) => !value);
                  act();
                }}
              />{" "}
              Show axes
            </label>
            <label>
              <input
                type="checkbox"
                checked={grid}
                onChange={() => {
                  setGrid((value) => !value);
                  act();
                }}
              />{" "}
              Show grid
            </label>
          </footer>
        </section>
      </main>
      <section className="ba10138-takeaways">
        <h2>KEY TAKEAWAYS</h2>
        <article>
          <b>First-order approximation</b>
          <p>(1+x)ⁿ≈1+nx for |x| small.</p>
        </article>
        <article>
          <b>Why it works</b>
          <p>The line is tangent to the curve at x=0.</p>
        </article>
        <article>
          <b>Rule of thumb</b>
          <p>For |x|≤0.05, error is usually small.</p>
        </article>
        <article>
          <Lightbulb />
          <b>Try it!</b>
          <p>Increase |x| and watch the error rise.</p>
        </article>
      </section>
      <footer>
        <button onClick={reset}>
          <RotateCcw /> Reset lab
        </button>
        <span>← Independent Term</span>
        <span>Pascal Identity →</span>
      </footer>
    </section>
  );
}
