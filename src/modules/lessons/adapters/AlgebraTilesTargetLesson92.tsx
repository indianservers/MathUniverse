import { ArrowDown, Check, Info, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  ALGEBRA_TILE_PROBLEMS_92,
  addAlgebraTile92,
  algebraTileCoefficients92,
  algebraTileExpression92,
  algebraTileStartingExpression92,
  evaluateAlgebraTiles92,
  type AlgebraTileKind92 as TileKind,
  type AlgebraTileProblem92 as Problem,
} from "./algebraTilesLesson92Model";
import "./AlgebraTilesTargetLesson92.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

const problems = ALGEBRA_TILE_PROBLEMS_92;

export default function AlgebraTilesTargetLesson92({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [problem, setProblem] = useState<Problem>(problems[0]);
  const [zeroX, setZeroX] = useState(0);
  const [zeroUnits, setZeroUnits] = useState(0);
  const [combined, setCombined] = useState(true);
  const [showAreaCalculation, setShowAreaCalculation] = useState(false);
  const [tab, setTab] = useState("Workspace");
  const [dragging, setDragging] = useState("");
  const [actions, setActions] = useState(0);
  const act = () => {
    setActions((count) => count + 1);
  };
  const reset = () => {
    setProblemIndex(0);
    setProblem(problems[0]);
    setZeroX(0);
    setZeroUnits(0);
    setCombined(true);
    setShowAreaCalculation(false);
    setTab("Workspace");
    setDragging("");
    setActions(0);
    onInteraction();
  };
  const newProblem = () => {
    const next = (problemIndex + 1) % problems.length;
    setProblemIndex(next);
    setProblem(problems[next]);
    setZeroX(0);
    setZeroUnits(0);
    setCombined(true);
    act();
  };
  const addTile = (kind: TileKind) => {
    setProblem((current) => addAlgebraTile92(current, kind));
    setCombined(false);
    act();
  };
  const startDrag = (
    event: DragEvent<HTMLButtonElement>,
    kind: TileKind,
    source = "bank",
  ) => {
    event.dataTransfer.setData("text/algebra-tile", kind);
    event.dataTransfer.setData("text/algebra-source", source);
    setDragging(`${source}:${kind}`);
  };
  const dropTile = (
    event: DragEvent<HTMLElement>,
    target: "before" | "after",
  ) => {
    event.preventDefault();
    const kind = event.dataTransfer.getData("text/algebra-tile") as TileKind;
    const source = event.dataTransfer.getData("text/algebra-source");
    if (!kind) return;
    if (source === "bank") addTile(kind);
    if (target === "after") {
      setCombined(true);
      act();
    }
    setDragging("");
  };
  const addZeroPair = (kind: "x" | "unit") => {
    if (kind === "x") setZeroX((count) => count + 1);
    else setZeroUnits((count) => count + 1);
    act();
  };
  const clearZeroPairs = () => {
    setZeroX(0);
    setZeroUnits(0);
    act();
  };
  useEffect(() => {
    reset();
  }, [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const { x: xCoefficient, constant } = algebraTileCoefficients92(problem);
  const simplified = algebraTileExpression92(problem);
  const starting = useMemo(
    () => algebraTileStartingExpression92(problem),
    [problem],
  );

  return (
    <div
      className="tiles92-page"
      data-testid="algebra-mockup-0149"
      data-dedicated-lesson="92"
      data-object-model="dedicated-tested-positive-negative-algebra-tile-object-model-draggable-bank-zero-pairs-linked-area-model-symbolic-trace-evaluation-and-functional-learning-tabs"
      data-evaluation-at-two={evaluateAlgebraTiles92(problem, 2)}
      data-expression={simplified}
      data-x-coefficient={xCoefficient}
      data-constant={constant}
      data-x-squared={problem.xSquared}
      data-zero-x={zeroX}
      data-zero-units={zeroUnits}
      data-combined={combined}
      data-area-calculation={showAreaCalculation}
      data-tab={tab}
      data-dragging={dragging}
      data-problem={problemIndex}
      data-actions={actions}
    >
      <nav className="tiles92-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>92 Algebra Tiles</b>
      </nav>
      <header className="tiles92-header">
        <h1>Algebra Tiles</h1>
        <p>Represent algebra visually.</p>
        <div>
          <b>Intermediate</b>
          <b>Worked Example + Practice</b>
          <b>CAS / Algebra View</b>
          <b>◷&nbsp; 6-10 min</b>
        </div>
      </header>
      <nav className="tiles92-tabs">
        {[
          ["Workspace", "⊙"],
          ["Explain", "▣"],
          ["Examples", "♧"],
          ["Formulas", "Σ"],
          ["Know more", "✣"],
        ].map(([name, icon]) => (
          <button
            type="button"
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name);
              act();
            }}
            key={name}
          >
            <span>{icon}</span>
            {name}
          </button>
        ))}
      </nav>
      {tab !== "Workspace" && <LessonTab92 tab={tab} problem={problem} />}
      <main className={`tiles92-layout ${tab === "Workspace" ? "" : "hidden"}`}>
        <section className="tiles92-builder">
          <header>
            <div>
              <h2>Build and combine: {starting}</h2>
              <p>
                Drag tiles to build the expression, then combine like tiles.
              </p>
            </div>
            <nav>
              <button
                type="button"
                onClick={() => {
                  reset();
                  act();
                }}
              >
                <RotateCcw />
                Reset
              </button>
              <button type="button" onClick={newProblem}>
                ↻&nbsp; New Problem
              </button>
            </nav>
          </header>
          <section
            className="tiles92-before"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => dropTile(event, "before")}
          >
            <h3>
              BEFORE <span>(Build the expression)</span>
            </h3>
            <BeforeGroups
              problem={problem}
              zeroX={zeroX}
              zeroUnits={zeroUnits}
              onDragStart={startDrag}
            />
          </section>
          <ArrowDown className="tiles92-down" />
          <section
            className="tiles92-after"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => dropTile(event, "after")}
          >
            <h3>
              AFTER <span>(Combine like tiles)</span>
            </h3>
            <strong>{simplified}</strong>
            <AfterTiles
              problem={problem}
              zeroX={zeroX}
              zeroUnits={zeroUnits}
              onDragStart={startDrag}
            />
          </section>
          <section className="tiles92-zero">
            <h3>Zero pairs</h3>
            <p>Use zero pairs to add or remove without changing the value.</p>
            <div>
              <button
                type="button"
                aria-label="Add x zero pair"
                onClick={() => addZeroPair("x")}
              >
                <Tile kind="x" /> <span>−</span> <Tile kind="negative-x" />
              </button>
              <button
                type="button"
                aria-label="Add unit zero pair"
                onClick={() => addZeroPair("unit")}
              >
                <Tile kind="unit" /> <span>−</span>{" "}
                <Tile kind="negative-unit" />
              </button>
              <button type="button" onClick={clearZeroPairs}>
                <Trash2 />
                Clear zero pairs
              </button>
            </div>
          </section>
        </section>
        <aside className="tiles92-rail">
          <TileBank onDragStart={startDrag} onAdd={addTile} />
          <section className="tiles92-count">
            <h2>Tile count</h2>
            <p>
              <Tile kind="x" compact />
              <b>{Math.max(0, xCoefficient) + zeroX}</b>
            </p>
            <p>
              <Tile kind="unit" compact />
              <b>{problem.units + zeroUnits}</b>
            </p>
            <p>
              <Tile kind="negative-unit" compact />
              <b>{problem.negativeUnits + zeroUnits}</b>
            </p>
            <p>
              <Tile kind="x-squared" compact />
              <b>{problem.xSquared}</b>
            </p>
          </section>
          <Checklist problem={problem} simplified={simplified} />
          <section className="tiles92-valid">
            <h2>
              <Check />
              Expression is valid
            </h2>
            <p>The tiles match the expression.</p>
            <strong>{simplified}</strong>
            <small>
              <Info />
              Only matching variable parts
              <br />
              can be combined
            </small>
          </section>
        </aside>
        <AreaModel
          show={showAreaCalculation}
          onToggle={() => {
            setShowAreaCalculation((value) => !value);
            act();
          }}
        />
        <Trace
          starting={starting}
          problem={problem}
          xCoefficient={xCoefficient}
          constant={constant}
          simplified={simplified}
        />
      </main>
      <LessonTopicStudyBoard lessonId={92} view={tab} onInteraction={onInteraction} />

    </div>
  );
}

function Tile({
  kind,
  compact = false,
  draggable = false,
  label,
  onDragStart,
}: {
  kind: TileKind;
  compact?: boolean;
  draggable?: boolean;
  label?: string;
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void;
}) {
  const text =
    kind === "x"
      ? "X"
      : kind === "negative-x"
        ? "−X"
        : kind === "unit"
          ? "1"
          : kind === "negative-unit"
            ? "−1"
            : "x²";
  if (!draggable)
    return (
      <span className={`tiles92-tile ${kind} ${compact ? "compact" : ""}`}>
        {text}
      </span>
    );
  return (
    <button
      type="button"
      aria-label={label ?? `${text} tile`}
      draggable={draggable}
      onDragStart={onDragStart}
      className={`tiles92-tile ${kind} ${compact ? "compact" : ""}`}
    >
      {text}
    </button>
  );
}
function BeforeGroups({
  problem,
  zeroX,
  zeroUnits,
  onDragStart,
}: {
  problem: Problem;
  zeroX: number;
  zeroUnits: number;
  onDragStart: (
    event: DragEvent<HTMLButtonElement>,
    kind: TileKind,
    source?: string,
  ) => void;
}) {
  const group = (count: number, kind: TileKind, name: string) =>
    count > 0 && (
      <div className="tiles92-group">
        <strong>{name}</strong>
        <p>
          {Array.from({ length: count }, (_, index) => (
            <Tile
              key={index}
              kind={kind}
              draggable
              label={`${name} tile ${index + 1}`}
              onDragStart={(event) => onDragStart(event, kind, "expression")}
            />
          ))}
        </p>
      </div>
    );
  const groups = [
    group(problem.firstX, "x", `${problem.firstX}x`),
    group(problem.secondX, "x", `${problem.secondX}x`),
    group(problem.negativeX, "negative-x", `${problem.negativeX} negative x`),
    group(problem.units, "unit", String(problem.units)),
    group(
      problem.negativeUnits,
      "negative-unit",
      String(problem.negativeUnits),
    ),
  ].filter(Boolean);
  return (
    <div className="tiles92-groups">
      {groups.map((item, index) => (
        <span className="tiles92-group-wrap" key={index}>
          {index > 0 && (
            <i>
              {index === groups.length - 1 && problem.negativeUnits ? "−" : "+"}
            </i>
          )}
          {item}
        </span>
      ))}
      {zeroX > 0 && (
        <span className="tiles92-zero-added">+ {zeroX}(x − x)</span>
      )}
      {zeroUnits > 0 && (
        <span className="tiles92-zero-added">+ {zeroUnits}(1 − 1)</span>
      )}
    </div>
  );
}
function AfterTiles({
  problem,
  zeroX,
  zeroUnits,
  onDragStart,
}: {
  problem: Problem;
  zeroX: number;
  zeroUnits: number;
  onDragStart: (
    event: DragEvent<HTMLButtonElement>,
    kind: TileKind,
    source?: string,
  ) => void;
}) {
  const coefficient = problem.firstX + problem.secondX - problem.negativeX;
  const constant = problem.units - problem.negativeUnits;
  return (
    <div className="tiles92-after-tiles">
      {Array.from({ length: problem.xSquared }, (_, index) => (
        <Tile
          key={`s${index}`}
          kind="x-squared"
          draggable
          onDragStart={(event) => onDragStart(event, "x-squared", "expression")}
        />
      ))}
      {Array.from({ length: Math.abs(coefficient) }, (_, index) => (
        <Tile
          key={`x${index}`}
          kind={coefficient >= 0 ? "x" : "negative-x"}
          draggable
          onDragStart={(event) =>
            onDragStart(
              event,
              coefficient >= 0 ? "x" : "negative-x",
              "expression",
            )
          }
        />
      ))}
      {Array.from({ length: Math.abs(constant) }, (_, index) => (
        <Tile
          key={`u${index}`}
          kind={constant >= 0 ? "unit" : "negative-unit"}
          draggable
          onDragStart={(event) =>
            onDragStart(
              event,
              constant >= 0 ? "unit" : "negative-unit",
              "expression",
            )
          }
        />
      ))}
      {zeroX > 0 && (
        <span>
          {zeroX} zero x pair{zeroX > 1 ? "s" : ""}
        </span>
      )}
      {zeroUnits > 0 && (
        <span>
          {zeroUnits} zero unit pair{zeroUnits > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
function TileBank({
  onDragStart,
  onAdd,
}: {
  onDragStart: (
    event: DragEvent<HTMLButtonElement>,
    kind: TileKind,
    source?: string,
  ) => void;
  onAdd: (kind: TileKind) => void;
}) {
  const entries: Array<[TileKind, string]> = [
    ["x", "x tile"],
    ["unit", "unit tile"],
    ["negative-unit", "unit tile"],
    ["x-squared", "x² tile"],
  ];
  return (
    <section className="tiles92-bank">
      <h2>Tile bank</h2>
      {entries.map(([kind, name]) => (
        <p key={kind}>
          <Tile
            kind={kind}
            draggable
            label={`Add ${name}`}
            onDragStart={(event) => onDragStart(event, kind)}
          />
          <button type="button" onClick={() => onAdd(kind)}>
            {name}
          </button>
        </p>
      ))}
    </section>
  );
}
function Checklist({
  problem,
  simplified,
}: {
  problem: Problem;
  simplified: string;
}) {
  const xParts = [
    problem.firstX,
    problem.secondX,
    problem.negativeX ? -problem.negativeX : 0,
  ].filter(Boolean);
  const constant = problem.units - problem.negativeUnits;
  const combine = `${xParts.map((value, index) => `${index > 0 && value > 0 ? "+ " : value < 0 ? "− " : ""}${Math.abs(value)}x`).join(" ")} = ${xParts.reduce((sum, value) => sum + value, 0)}x`;
  const constantText = `${constant < 0 ? "−" : ""}${Math.abs(constant)} stays as ${constant < 0 ? "−" : ""}${Math.abs(constant)}`;
  return (
    <section className="tiles92-checklist">
      <h2>Combine like terms</h2>
      {[
        ["Identify like tiles", "x tiles together"],
        ["Combine x tiles", combine],
        ["Keep constants", constantText],
        ["Final expression", simplified],
      ].map(([title, detail]) => (
        <p key={title}>
          <Check />
          <span>
            <b>{title}</b>
            <small>{detail}</small>
          </span>
          <Check />
        </p>
      ))}
    </section>
  );
}
function AreaModel({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <section className={`tiles92-area ${show ? "calculation-active" : ""}`}>
      <header>
        <div>
          <h2>Area model: (x+2)(x+3)</h2>
          <p>Algebra Tiles are a model representation.</p>
        </div>
        <button type="button" onClick={onToggle}>
          {show ? "Hide calculation" : "Show calculation"}
        </button>
      </header>
      <div className="tiles92-area-grid">
        <span className="top x">x</span>
        <span className="top two">+&nbsp;&nbsp;&nbsp;&nbsp;2</span>
        <span className="side x">x</span>
        <span className="side three">
          +<br />3
        </span>
        <b className="square">x²</b>
        <b className="twox">2x</b>
        <b className="threex">3x</b>
        <b className="six">6</b>
      </div>
      <div className="tiles92-area-calc">
        <p>
          <i>x²</i>
          <span>x × x = x²</span>
        </p>
        <p>
          <i>2x</i>
          <span>x × 2 = 2x</span>
        </p>
        <p>
          <i>3x</i>
          <span>3 × x = 3x</span>
        </p>
        <p>
          <i>6</i>
          <span>2 × 3 = 6</span>
        </p>
      </div>
    </section>
  );
}
function Trace({
  starting,
  problem,
  xCoefficient,
  constant,
  simplified,
}: {
  starting: string;
  problem: Problem;
  xCoefficient: number;
  constant: number;
  simplified: string;
}) {
  const sign = constant < 0 ? "−" : "+";
  return (
    <section className="tiles92-trace">
      <h2>Symbolic equation trace</h2>
      <p>See how the tiles translate into algebraic expressions.</p>
      <div>
        <article>
          <strong>{starting}</strong>
          <small>Start</small>
          <b>
            <i>{problem.firstX}x</i> + <i>{problem.secondX}x</i>{" "}
            {problem.negativeX > 0 && (
              <>
                − <i>{problem.negativeX}x</i>
              </>
            )}{" "}
            {constant !== 0 && (
              <>
                {sign} <em>{Math.abs(constant)}</em>
              </>
            )}
          </b>
        </article>
        <span>→</span>
        <article>
          <strong>
            ({problem.firstX} + {problem.secondX}
            {problem.negativeX > 0 ? ` − ${problem.negativeX}` : ""})x{" "}
            {constant !== 0 && (
              <>
                {sign} {Math.abs(constant)}
              </>
            )}
          </strong>
          <small>Combine like terms</small>
          <b>
            <i>{xCoefficient}x</i>{" "}
            {constant !== 0 && (
              <>
                {sign} <em>{Math.abs(constant)}</em>
              </>
            )}
          </b>
        </article>
        <span>→</span>
        <article>
          <strong>{simplified}</strong>
          <small>Simplified</small>
          <b>
            <i>{xCoefficient}x</i>{" "}
            {constant !== 0 && (
              <>
                {sign} <em>{Math.abs(constant)}</em>
              </>
            )}
          </b>
        </article>
      </div>
    </section>
  );
}

function LessonTab92({ tab, problem }: { tab: string; problem: Problem }) {
  const simplified = algebraTileExpression92(problem);
  const coefficients = algebraTileCoefficients92(problem);
  const content =
    tab === "Explain"
      ? [
          "A tile's colour and shape encode its variable part and sign.",
          "Only tiles with the same variable part can be combined.",
        ]
      : tab === "Examples"
        ? ALGEBRA_TILE_PROBLEMS_92.map(
            (item) =>
              `${algebraTileStartingExpression92(item)} → ${algebraTileExpression92(item)}`,
          )
        : tab === "Formulas"
          ? [
              `x coefficient = ${problem.firstX} + ${problem.secondX} − ${problem.negativeX} = ${coefficients.x}`,
              `constant = ${problem.units} − ${problem.negativeUnits} = ${coefficients.constant}`,
            ]
          : [
              "Zero pairs preserve value.",
              "Area models connect tile products to polynomial expansion.",
            ];
  return (
    <section className="tiles92-tab-panel" data-active-learning-tab={tab}>
      <h2>{tab}</h2>
      <strong>{simplified}</strong>
      {content.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </section>
  );
}
