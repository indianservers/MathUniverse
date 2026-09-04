import { BadgeCheck, RotateCcw, Star } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PascalIdentityTargetLesson10139.css";

const choose = (n: number, r: number) => {
  if (r < 0 || r > n) return 0;
  let result = 1;
  for (let i = 1; i <= Math.min(r, n - r); i += 1) {
    result = (result * (n - i + 1)) / i;
  }
  return Math.round(result);
};

function LatticePlot({ n, r }: { n: number; r: number }) {
  const width = 210,
    height = 105,
    x0 = 24,
    y0 = 82,
    dx = (width - 48) / Math.max(n, 1),
    dy = (height - 35) / Math.max(r, 1);
  const paths = useMemo(() => {
    const steps = n;
    const up = r;
    const variants: number[][] = [];
    const walk = (position: number, remaining: number, selected: number[]) => {
      if (variants.length >= 12) return;
      if (position === steps) {
        if (remaining === 0) variants.push(selected);
        return;
      }
      if (remaining > 0)
        walk(position + 1, remaining - 1, [...selected, position]);
      if (steps - position > remaining) walk(position + 1, remaining, selected);
    };
    walk(0, up, []);
    return variants;
  }, [n, r]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} aria-label="Parent lattice paths">
      {Array.from({ length: n + 1 }, (_, x) =>
        Array.from({ length: r + 1 }, (_, y) => (
          <circle
            className="node"
            key={`${x}-${y}`}
            cx={x0 + x * dx}
            cy={y0 - y * dy}
            r="3"
          />
        )),
      )}
      {paths.map((ups, pathIndex) => {
        let y = 0;
        const points = [`${x0},${y0}`];
        for (let step = 0; step < n; step += 1) {
          if (ups.includes(step)) y += 1;
          points.push(`${x0 + (step + 1) * dx},${y0 - y * dy}`);
        }
        return (
          <polyline
            className="path"
            key={pathIndex}
            points={points.join(" ")}
          />
        );
      })}
      <text x="8" y="14">
        y
      </text>
      <text x={width - 12} y={height - 4}>
        x
      </text>
    </svg>
  );
}

export default function PascalIdentityTargetLesson10139({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [n, setN] = useState(5),
    [r, setR] = useState(2),
    [actions, setActions] = useState(0);
  const selected = choose(n, r),
    left = choose(n - 1, r - 1),
    right = choose(n - 1, r),
    verified = selected === left + right;
  const select = (row: number, column: number) => {
    if (row < 2 || column < 1 || column >= row) return;
    setN(row);
    setR(column);
    setActions((value) => value + 1);
  };
  const reset = () => {
    setN(5);
    setR(2);
    setActions((value) => value + 1);
  };
  return (
    <section
      className="pi10139-page"
      data-testid="school-mockup-0813"
      data-object-model="dedicated-pascal-combinatorial-path-engine"
      data-n={n}
      data-r={r}
      data-selected={selected}
      data-left-parent={left}
      data-right-parent={right}
      data-verified={String(verified)}
      data-actions={actions}
    >
      <header>
        <div>
          <small>CLASS 11 &bull; BINOMIAL THEOREM</small>
          <h1>Pascal Identity</h1>
          <p>
            Pascal Identity states <b>C(n,r) = C(n-1,r-1) + C(n-1,r)</b> for 1
            &le; r &le; n-1.
          </p>
          <p>
            Select any entry C(n,r) in Pascal&apos;s triangle to verify the
            identity and see its combinatorial (lattice-path) meaning.
          </p>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset all
        </button>
      </header>

      <main>
        <section className="pi10139-triangle">
          <h2>
            PASCAL&apos;S TRIANGLE <span>(Click any entry C(n,r))</span>
          </h2>
          <div className="axis-head">
            <span>
              <b>n (row)</b>
              <i>r &rarr;</i>
            </span>
            {Array.from({ length: 7 }, (_, i) => (
              <i key={i}>{i}</i>
            ))}
          </div>
          <div className="triangle-grid">
            {Array.from({ length: 7 }, (_, row) => (
              <div className="triangle-row" key={row}>
                <b>{row}</b>
                <div>
                  {Array.from({ length: row + 1 }, (_, column) => {
                    const kind =
                      row === n && column === r
                        ? "selected"
                        : row === n - 1 && column === r - 1
                          ? "left"
                          : row === n - 1 && column === r
                            ? "right"
                            : "";
                    const enabled = row >= 2 && column > 0 && column < row;
                    return (
                      <button
                        key={column}
                        className={kind}
                        disabled={!enabled}
                        aria-label={`Choose C(${row},${column})`}
                        onClick={() => select(row, column)}
                      >
                        {choose(row, column)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="legend">
            <span>
              <i className="selected" /> Selected C(n,r)
            </span>
            <span>
              <i className="left" /> C(n-1,r-1) (Left parent)
            </span>
            <span>
              <i className="right" /> C(n-1,r) (Right parent)
            </span>
          </div>
          <p className="current">
            &#9432; Currently selected C({n},{r}).
          </p>
        </section>

        <div className="pi10139-right">
          <section className="verifier">
            <h2>NUMERIC VERIFIER</h2>
            <p>
              You selected C({n},{r}).
            </p>
            <div className="equation">
              <article className="selected">
                <em>
                  C({n},{r})
                </em>
                <b>{selected}</b>
              </article>
              <strong>=</strong>
              <article className="left">
                <em>
                  C({n - 1},{r - 1})
                </em>
                <b>{left}</b>
              </article>
              <strong>+</strong>
              <article className="right">
                <em>
                  C({n - 1},{r})
                </em>
                <b>{right}</b>
              </article>
            </div>
            <div className="verified">
              <BadgeCheck /> <b>Verified:</b>&nbsp; {selected} = {left} +{" "}
              {right}
              <span>&#10003; {String(verified).replace("true", "True")}</span>
            </div>
          </section>

          <section className="paths">
            <h2>LATTICE-PATH INTERPRETATION</h2>
            <p>
              <em>
                C({n},{r})
              </em>{" "}
              counts lattice paths from (0,0) to ({n},{r}) using {n - r} Rights
              (R) and {r} Ups (U).
            </p>
            <p>
              Any such path&apos;s last step is either R from ({n - 1},{r}) or U
              from ({n},{r - 1}).
            </p>
            <div className="path-sum">
              <article className="path-card left">
                <b>
                  Last step is R (from ({n - 1},{r}))
                </b>
                <span>
                  Paths from (0,0) to ({n - 1},{r})
                </span>
                <em>
                  = C({n - 1},{r - 1}) = {left}
                </em>
                <LatticePlot n={n - 1} r={r - 1} />
              </article>
              <article className="path-card right">
                <b>
                  Last step is U (from ({n},{r - 1}))
                </b>
                <span>
                  Paths from (0,0) to ({n},{r - 1})
                </span>
                <em>
                  = C({n - 1},{r}) = {right}
                </em>
                <LatticePlot n={n - 1} r={r} />
              </article>
              <strong className="plus">+</strong>
              <article className="total">
                <b>
                  Total paths to ({n},{r})
                </b>
                <span>
                  = {left} + {right}
                </span>
                <em>= {selected}</em>
              </article>
            </div>
            <footer>
              These two sets are disjoint and together form all paths to ({n},
              {r}).
            </footer>
          </section>
        </div>
      </main>
      <footer className="identity">
        <Star /> Pascal Identity: <em>C(n,r) = C(n-1,r-1) + C(n-1,r)</em> -
        verified numerically and explained combinatorially.
      </footer>
    </section>
  );
}
