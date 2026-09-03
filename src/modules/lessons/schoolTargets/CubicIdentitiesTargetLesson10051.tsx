import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  Star,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CubicIdentitiesTargetLesson10051.css";

type TileKind = "a3" | "a2b" | "ab2" | "b3";
const tiles: { kind: TileKind; label: string; count: number }[] = [
  { kind: "a3", label: "a³", count: 1 },
  { kind: "a2b", label: "a²b", count: 3 },
  { kind: "ab2", label: "ab²", count: 3 },
  { kind: "b3", label: "b³", count: 1 },
];
const expected: TileKind[] = ["a3", "a2b", "ab2", "b3"];

export default function CubicIdentitiesTargetLesson10051({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [mode, setMode] = useState<"plus" | "minus">("plus");
  const [labels, setLabels] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [cubeTiles, setCubeTiles] = useState<TileKind[]>([...expected]);
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [tab, setTab] = useState("Interact");
  const [slots, setSlots] = useState<(TileKind | null)[]>([...expected]);
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [hint, setHint] = useState(false);
  const [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const terms = [a ** 3, 3 * a * a * b, 3 * a * b * b, b ** 3];
  const lhs = (mode === "plus" ? a + b : a - b) ** 3;
  const rhs =
    mode === "plus"
      ? terms.reduce((sum, value) => sum + value, 0)
      : terms[0] - terms[1] + terms[2] - terms[3];
  const challengeCorrect = slots.every(
    (slot, index) => slot === expected[index],
  );
  const reset = () =>
    act(() => {
      setMode("plus");
      setA(2);
      setB(1);
      setExpanded(true);
      setCubeTiles([...expected]);
      setLabels(true);
    });
  const addCubeTile = (kind: TileKind) =>
    act(() => {
      setCubeTiles((current) =>
        current.includes(kind) ? current : [...current, kind],
      );
      setExpanded(true);
    });
  const place = (kind: TileKind, index?: number) =>
    act(() => {
      setChecked(false);
      setSlots((current) => {
        const next = [...current];
        const target = index ?? next.findIndex((slot) => slot === null);
        if (target >= 0) next[target] = kind;
        return next;
      });
    });

  return (
    <section
      className="ci10051-page"
      data-testid="school-mockup-0725"
      data-object-model="dedicated-cubic-volume-decomposition-and-signed-tile-engine"
      data-mode={mode}
      data-a={a}
      data-b={b}
      data-lhs={lhs}
      data-rhs={rhs}
      data-expanded={String(expanded)}
      data-cube-tiles={cubeTiles.join(",")}
      data-labels={String(labels)}
      data-challenge={slots.map((slot) => slot ?? "empty").join(",")}
      data-challenge-correct={String(checked && challengeCorrect)}
      data-actions={actions}
    >
      <header className="ci10051-hero">
        <small>CLASS 9 · POLYNOMIALS</small>
        <h1>Cubic Algebraic Identities</h1>
        <p>
          <b>Objective:</b> Understand and verify standard cubic identities
          through volume and algebraic decomposition.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>

      <nav className="ci10051-tabs" aria-label="Lesson sections">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-selected={tab === item}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>

      <main>
        <section className="ci10051-lab">
          <article className="ci10051-cube-panel">
            <h2>3D CUBE DECOMPOSITION MODEL</h2>
            <div className="ci10051-mode">
              <button
                className={mode === "plus" ? "active" : ""}
                onClick={() => act(() => setMode("plus"))}
              >
                (a + b)³
              </button>
              <button
                className={mode === "minus" ? "active" : ""}
                onClick={() => act(() => setMode("minus"))}
              >
                (a − b)³
              </button>
              <label>
                Labels{" "}
                <input
                  type="checkbox"
                  checked={labels}
                  onChange={() => act(() => setLabels((v) => !v))}
                />
                <i />
              </label>
            </div>
            <CubeDiagram
              labels={labels}
              expanded={expanded}
              compact={false}
              parts={cubeTiles}
              onTile={addCubeTile}
            />
            <div className="ci10051-legend">
              {tiles.map((tile) => (
                <span key={tile.kind}>
                  <i className={tile.kind} />
                  {tile.label}
                </span>
              ))}
              <p>
                Total volume: <b>({mode === "plus" ? "a + b" : "a − b"})³</b>
              </p>
            </div>
          </article>

          <article className="ci10051-algebra">
            <h2>ALGEBRA TILES (drag to cube)</h2>
            <TilePalette onPlace={addCubeTile} />
            <h2>SYMBOLIC EXPANSION CONTROLS</h2>
            <div className="ci10051-actions">
              <button
                className="primary"
                onClick={() =>
                  act(() => {
                    setExpanded(true);
                    setCubeTiles([...expected]);
                  })
                }
              >
                Expand
              </button>
              <button
                onClick={() =>
                  act(() => {
                    setExpanded(false);
                    setCubeTiles([]);
                  })
                }
              >
                Collapse
              </button>
              <button
                onClick={() =>
                  act(() => {
                    setA(1 + Math.floor(Math.random() * 4));
                    setB(1 + Math.floor(Math.random() * 3));
                  })
                }
              >
                Randomize
              </button>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </div>
            <div className="ci10051-expansion">
              <b>({mode === "plus" ? "a + b" : "a − b"})³ =</b>
              {tiles.map((tile, index) => (
                <span className={tile.kind} key={tile.kind}>
                  {mode === "minus" && (index === 1 || index === 3)
                    ? "− "
                    : index
                      ? "+ "
                      : ""}
                  {tile.label === "a²b" || tile.label === "ab²"
                    ? `3${tile.label}`
                    : tile.label}
                </span>
              ))}
            </div>
            <div className="ci10051-term-row">
              <small>Term volumes</small>
              {tiles.map((tile) => (
                <span key={tile.kind}>
                  {tile.kind === "a3" || tile.kind === "b3"
                    ? tile.label
                    : `3${tile.label}`}
                </span>
              ))}
            </div>
            <div className="ci10051-numeric">
              <b>Numeric check</b>
              <label>
                a ={" "}
                <input
                  aria-label="Value a"
                  type="number"
                  min="1"
                  max="9"
                  value={a}
                  onChange={(e) =>
                    act(() => setA(Math.max(1, Number(e.target.value))))
                  }
                />
              </label>
              <label>
                b ={" "}
                <input
                  aria-label="Value b"
                  type="number"
                  min="1"
                  max="9"
                  value={b}
                  onChange={(e) =>
                    act(() => setB(Math.max(1, Number(e.target.value))))
                  }
                />
              </label>
              <button onClick={() => act(() => setExpanded(true))}>
                Compute
              </button>
            </div>
            <div className="ci10051-checkline">
              <section>
                <small>
                  Left side ({mode === "plus" ? "a + b" : "a − b"})³
                </small>
                <strong>{lhs}</strong>
              </section>
              <b>=</b>
              <section>
                <small>Right side sum</small>
                <strong>
                  {terms
                    .map(
                      (value, i) =>
                        `${mode === "minus" && (i === 1 || i === 3) ? "−" : i ? "+" : ""}${value}`,
                    )
                    .join(" ")}{" "}
                  = {rhs}
                </strong>
              </section>
            </div>
            <footer>
              <Check /> Identity verified! &nbsp; LHS = RHS = {rhs}
            </footer>
          </article>
        </section>

        <section className="ci10051-theory">
          <article className="why">
            <h2>
              <Lightbulb /> WHY IT WORKS
            </h2>
            <p>
              The cube of side (a+b) is partitioned into four non-overlapping
              parts:
            </p>
            <ul>
              <li>
                <b>a³</b> — one large cube.
              </li>
              <li>
                <b>3a²b</b> — three faces of size a × a × b.
              </li>
              <li>
                <b>3ab²</b> — three faces of size a × b × b.
              </li>
              <li>
                <b>b³</b> — one small cube.
              </li>
            </ul>
            <footer>Adding their volumes gives (a+b)³.</footer>
          </article>
          <article className="worked">
            <h2>
              <Star /> WORKED EXAMPLE
            </h2>
            <p>
              For <b>a=2, b=1</b>
            </p>
            <strong>(a+b)³=(2+1)³=3³=27</strong>
            <b>Breakdown:</b>
            <p>🟦 a³ = 2³ = 8</p>
            <p>🟩 3a²b = 3·2²·1 = 12</p>
            <p>🟪 3ab² = 3·2·1² = 6</p>
            <p>🟧 b³ = 1³ = 1</p>
            <footer>8 + 12 + 6 + 1 = 27 ✓</footer>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> MISCONCEPTION WARNING
            </h2>
            <b>Do not omit the coefficients 3.</b>
            <p>
              They come from the three congruent rectangular prisms of each
              type.
            </p>
            <div>
              <i className="a3" /> <b>×3</b> = <i className="a2b" />
              <i className="a2b" />
              <i className="a2b" />
            </div>
            <footer>
              Ignoring the 3 undercounts the volume and breaks the identity.
            </footer>
          </article>
        </section>

        <section className="ci10051-challenge">
          <h2>CHALLENGE: (a − b)³</h2>
          <p>Assemble the pieces and match every signed term.</p>
          <div className="ci10051-challenge-grid">
            <div>
              <CubeDiagram
                labels={true}
                expanded={true}
                compact
                parts={expected}
              />
              <label>
                Show solution{" "}
                <input
                  type="checkbox"
                  checked={showSolution}
                  onChange={() => act(() => setShowSolution((v) => !v))}
                />
              </label>
            </div>
            <div className="ci10051-build">
              <small>Available tiles (drag to cube)</small>
              <TilePalette onPlace={(kind) => place(kind)} />
              <small>Match the signed terms</small>
              <div className="ci10051-slots">
                {expected.map((kind, index) => (
                  <button
                    key={kind}
                    className={kind}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) =>
                      place(e.dataTransfer.getData("tile") as TileKind, index)
                    }
                    onClick={() =>
                      act(() => {
                        setChecked(false);
                        setSlots((current) =>
                          current.map((slot, i) => (i === index ? null : slot)),
                        );
                      })
                    }
                  >
                    <b>{index === 1 || index === 3 ? "−" : "+"}</b>
                    <span>
                      {slots[index]
                        ? tiles.find((tile) => tile.kind === slots[index])
                            ?.label
                        : "Drop tile"}
                    </span>
                  </button>
                ))}
              </div>
              {showSolution && (
                <p className="ci10051-solution">a³ − 3a²b + 3ab² − b³</p>
              )}
              <button
                className="ci10051-hint"
                onClick={() => act(() => setHint((v) => !v))}
              >
                Need a hint? <span>⌄</span>
              </button>
              {hint && (
                <p className="ci10051-hinttext">
                  The signs alternate: positive, negative, positive, negative.
                </p>
              )}
              <button
                className="ci10051-check"
                onClick={() => act(() => setChecked(true))}
              >
                Check
              </button>
              {checked && (
                <p className={challengeCorrect ? "success" : "error"}>
                  {challengeCorrect
                    ? "Correct: every term and sign matches."
                    : "Not yet. Rebuild the four terms in identity order."}
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <nav className="ci10051-adjacent">
        <Link to="/lessons/school/class-9/class-9-polynomials-relationship-between-zeros-and-coefficients">
          <ArrowLeft /> Relationship Between Zeros and Coefficients
        </Link>
        <Link to="/lessons/school">
          <span>Polynomial Factorisation Practice</span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function TilePalette({ onPlace }: { onPlace: (kind: TileKind) => void }) {
  return (
    <div className="ci10051-palette">
      {tiles.map((tile) => (
        <button
          key={tile.kind}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("tile", tile.kind)}
          onClick={() => onPlace(tile.kind)}
        >
          <i className={tile.kind} />
          <b>{tile.label}</b>
          <span>×{tile.count}</span>
        </button>
      ))}
    </div>
  );
}

function CubeDiagram({
  labels,
  expanded,
  compact,
  parts,
  onTile,
}: {
  labels: boolean;
  expanded: boolean;
  compact: boolean;
  parts: TileKind[];
  onTile?: (kind: TileKind) => void;
}) {
  return (
    <svg
      className={`ci10051-cube ${compact ? "compact" : ""} ${expanded ? "expanded" : "collapsed"}`}
      viewBox="0 0 360 300"
      aria-label="Cubic identity volume decomposition"
      onDragOver={onTile ? (event) => event.preventDefault() : undefined}
      onDrop={
        onTile
          ? (event) => onTile(event.dataTransfer.getData("tile") as TileKind)
          : undefined
      }
    >
      <polygon
        className={`top-blue ${parts.includes("a3") ? "" : "missing"}`}
        points="65,75 125,20 280,20 220,75"
      />
      <polygon
        className={`top-purple ${parts.includes("ab2") ? "" : "missing"}`}
        points="280,20 315,50 255,105 220,75"
      />
      <rect
        className={`front-blue ${parts.includes("a3") ? "" : "missing"}`}
        x="65"
        y="75"
        width="155"
        height="155"
      />
      <rect
        className={`front-green ${parts.includes("a2b") ? "" : "missing"}`}
        x="220"
        y="75"
        width="58"
        height="155"
      />
      <rect
        className={`front-green second ${parts.includes("a2b") ? "" : "missing"}`}
        x="65"
        y="230"
        width="155"
        height="55"
      />
      <polygon
        className={`side-purple ${parts.includes("ab2") ? "" : "missing"}`}
        points="278,75 315,50 315,205 278,230"
      />
      <rect
        className={`front-orange ${parts.includes("b3") ? "" : "missing"}`}
        x="220"
        y="230"
        width="58"
        height="55"
      />
      <polygon
        className={`side-orange ${parts.includes("b3") ? "" : "missing"}`}
        points="278,230 315,205 315,260 278,285"
      />
      <g className="guides">
        <line x1="125" y1="20" x2="125" y2="285" />
        <line x1="65" y1="175" x2="315" y2="150" />
      </g>
      {labels && (
        <g className="labels">
          <text x="45" y="170">
            a + b
          </text>
          <text x="135" y="298">
            a
          </text>
          <text x="246" y="298">
            b
          </text>
          <text x="295" y="280">
            a + b
          </text>
        </g>
      )}
    </svg>
  );
}
