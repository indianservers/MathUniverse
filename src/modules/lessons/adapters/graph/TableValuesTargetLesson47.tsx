import {
  ExternalLink,
  Globe2,
  Minus,
  Pencil,
  Plus,
  RotateCcw,
  Share2,
  Table2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  DEFAULT_TABLE_EXPRESSION,
  DEFAULT_TABLE_VIEW,
  buildValueRows,
  evaluateQuadraticRule,
  fitTableView,
  parseQuadraticRule,
  tableCurvePath,
  tableGraphPosition,
  tableXFromPixel,
  valueDifferences,
} from "./tableValuesLesson47Model";
import "./TableValuesTargetLesson47.css";

export default function TableValuesTargetLesson47({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [expression, setExpression] = useState(DEFAULT_TABLE_EXPRESSION),
    [step, setStep] = useState(1),
    [selected, setSelected] = useState(5),
    [showPoints, setShowPoints] = useState(true),
    [connectCurve, setConnectCurve] = useState(false),
    [editing, setEditing] = useState(false),
    [language, setLanguage] = useState("en"),
    [view, setView] = useState(DEFAULT_TABLE_VIEW),
    [customX, setCustomX] = useState<Record<number, number>>({}),
    [actions, setActions] = useState(0);
  const parsed = useMemo(() => parseQuadraticRule(expression), [expression]);
  const rule = useMemo(() => parsed ?? { a: 0, b: 0, c: 0 }, [parsed]);
  const rows = useMemo(
    () =>
      buildValueRows(rule, step).map((row) =>
        customX[row.id] === undefined
          ? row
          : {
              ...row,
              x: customX[row.id],
              y: evaluateQuadraticRule(rule, customX[row.id]),
            },
      ),
    [rule, step, customX],
  );
  const differences = useMemo(() => valueDifferences(rows), [rows]);
  const current = rows[selected] ?? rows[0];
  const currentPosition = tableGraphPosition(current.x, current.y, view);
  const reset = () => {
    setExpression(DEFAULT_TABLE_EXPRESSION);
    setStep(1);
    setSelected(5);
    setShowPoints(true);
    setConnectCurve(false);
    setEditing(false);
    setLanguage("en");
    setView(DEFAULT_TABLE_VIEW);
    setCustomX({});
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const changeStep = (value: number) =>
    act(() => {
      setStep(Math.max(0.5, Math.min(3, Math.round(value * 2) / 2)));
      setCustomX({});
    });
  const changeSelectedX = (x: number) =>
    act(() =>
      setCustomX((values) => ({
        ...values,
        [selected]: Math.max(view.xMin, Math.min(view.xMax, x)),
      })),
    );
  const dragSelected = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    changeSelectedX(
      tableXFromPixel(((event.clientX - rect.left) / rect.width) * 580, view),
    );
  };
  const keySelected = (event: ReactKeyboardEvent<SVGCircleElement>) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    changeSelectedX(current.x + (event.key === "ArrowLeft" ? -0.5 : 0.5));
  };

  return (
    <section
      className="tv47-page"
      data-testid="2d-graphing-mockup-0139"
      data-dedicated-lesson="47"
      data-object-model="editable-quadratic-rule-generated-value-rows-first-and-second-differences-selectable-row-pointer-keyboard-horizontal-point-drag-step-size-points-curve-fit-reset-language-share-and-navigation"
      data-expression={expression}
      data-step={step}
      data-selected={selected}
      data-valid={Boolean(parsed)}
      data-actions={actions}
    >
      <nav className="tv47-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>47 Table Of Values</b>
      </nav>
      <header className="tv47-hero">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>2D GRAPHING CALCULATOR</b>
          <b>INTERACTION + VISUALIZATION</b>
        </small>
        <h1>Table of Values</h1>
        <p>Link numerical and graphical representations.</p>
        <nav>
          <select
            aria-label="Table language"
            value={language}
            onChange={(event) => act(() => setLanguage(event.target.value))}
          >
            <option value="en">English (English)</option>
            <option value="hi">Hindi</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  rows.map((row) => `${row.x},${row.y}`).join("\n"),
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="#tv47-workspace">
            <ExternalLink />
            Workspace
          </a>
        </nav>
      </header>
      <section className="tv47-workspace" id="tv47-workspace">
        <aside className="tv47-table">
          <header>
            <h2>
              <Table2 />
              Table of Values
            </h2>
            <b>Row becomes point</b>
          </header>
          <table>
            <thead>
              <tr>
                <th>x</th>
                <th>f(x) = {expression}</th>
                <th>First differences</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={selected === row.id ? "active" : ""}
                  onClick={() => act(() => setSelected(row.id))}
                >
                  <td>{row.x}</td>
                  <td>{row.y}</td>
                  <td>
                    {differences.first[index] === null
                      ? "—"
                      : differences.first[index]}{" "}
                    {index > 0 && index < rows.length - 1 ? "↓" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <section>
            <b>Second differences constant</b>
            <span>
              {differences.second.slice(2).map((value, index) => (
                <i key={index}>{value}</i>
              ))}
            </span>
            <p>
              All second differences are{" "}
              {differences.constantSecond ?? "not constant"}.<br />
              This{" "}
              {differences.constantSecond === null
                ? "does not reveal"
                : "reveals"}{" "}
              a quadratic relationship.
            </p>
          </section>
        </aside>
        <main className="tv47-graph">
          <h2>
            Graph of <b>f(x) = {expression}</b>
          </h2>
          <svg
            viewBox="0 0 580 580"
            role="img"
            aria-label="Function graph linked to table rows"
          >
            <defs>
              <pattern
                id="tv47-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path d="M40 0H0V40" fill="none" stroke="#dfe8f2" />
              </pattern>
            </defs>
            <rect
              x="30"
              y="30"
              width="520"
              height="520"
              fill="url(#tv47-grid)"
            />
            <line
              x1="30"
              x2="550"
              y1={tableGraphPosition(0, 0, view).y}
              y2={tableGraphPosition(0, 0, view).y}
              className="axis"
            />
            <line
              x1={tableGraphPosition(0, 0, view).x}
              x2={tableGraphPosition(0, 0, view).x}
              y1="30"
              y2="550"
              className="axis"
            />
            {connectCurve && parsed && (
              <polyline points={tableCurvePath(rule, view)} className="curve" />
            )}
            {showPoints &&
              rows.map((row) => {
                const point = tableGraphPosition(row.x, row.y, view);
                return (
                  <circle
                    key={row.id}
                    aria-label={`Select table row ${row.id + 1}`}
                    cx={point.x}
                    cy={point.y}
                    r={selected === row.id ? 9 : 7}
                    className={selected === row.id ? "selected" : ""}
                    onClick={() => act(() => setSelected(row.id))}
                  />
                );
              })}
            <circle
              aria-label="Drag selected table point"
              tabIndex={0}
              cx={currentPosition.x}
              cy={currentPosition.y}
              r="14"
              className="drag-handle"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={dragSelected}
              onKeyDown={keySelected}
            />
            <g
              className="tv47-label"
              transform={`translate(${Math.min(455, currentPosition.x - 50)} ${Math.max(35, currentPosition.y - 75)})`}
            >
              <rect width="100" height="58" rx="8" />
              <text x="50" y="23" textAnchor="middle">
                x = {current.x}
              </text>
              <text x="50" y="45" textAnchor="middle">
                f(x) = {current.y}
              </text>
            </g>
          </svg>
        </main>
        <aside className="tv47-controls">
          <section>
            <h2>Function</h2>
            <label className={!parsed ? "invalid" : ""}>
              f(x)=
              <input
                aria-label="Quadratic function"
                readOnly={!editing}
                value={expression}
                onChange={(event) =>
                  act(() => setExpression(event.target.value))
                }
              />
              <button
                aria-label="Edit function"
                onClick={() => act(() => setEditing((value) => !value))}
              >
                <Pencil />
              </button>
            </label>
            {!parsed && (
              <small>Enter a polynomial using x^2, x, and constants.</small>
            )}
          </section>
          <section>
            <h2>Step size</h2>
            <div>
              <button
                aria-label="Decrease step"
                onClick={() => changeStep(step - 0.5)}
              >
                <Minus />
              </button>
              <output>{step}</output>
              <button
                aria-label="Increase step"
                onClick={() => changeStep(step + 0.5)}
              >
                <Plus />
              </button>
            </div>
          </section>
          <section>
            <h2>Show</h2>
            <label>
              <input
                type="checkbox"
                checked={showPoints}
                onChange={(event) =>
                  act(() => setShowPoints(event.target.checked))
                }
              />
              Points<small>Plot each row as a point</small>
            </label>
            <label>
              <input
                type="checkbox"
                checked={connectCurve}
                onChange={(event) =>
                  act(() => setConnectCurve(event.target.checked))
                }
              />
              Connect curve<small>Show function curve</small>
            </label>
          </section>
          <section>
            <h2>Legend</h2>
            <p>
              ● Row → Point<small>Table row plotted</small>
            </p>
            <p>
              ● Selected row<small>Highlighted match</small>
            </p>
          </section>
          <footer>
            <button onClick={() => act(() => setView(fitTableView(rows)))}>
              ⌗ Zoom fit
            </button>
            <button onClick={() => act(() => setView(DEFAULT_TABLE_VIEW))}>
              <RotateCcw />
              Reset view
            </button>
          </footer>
        </aside>
      </section>
      <section className="tv47-explain">
        <Globe2 />
        <div>
          <h2>How table rows map to the graph</h2>
          <p>
            Each row in the table becomes a point (x, f(x)) on the coordinate
            plane.
          </p>
          <p>
            Here, f(x)={expression} is{" "}
            {rule.a !== 0 ? "a quadratic" : "the current"} function.
          </p>
          <p>
            The {differences.constantSecond === null ? "changing" : "constant"}{" "}
            second differences{" "}
            {differences.constantSecond === null ? "do not confirm" : "confirm"}{" "}
            the quadratic pattern.
          </p>
        </div>
        <b>
          Table row
          <br />
          x, f(x)
        </b>
        <span>Row becomes point →</span>
        <b>
          Graph point
          <br />
          (x, f(x))
        </b>
      </section>
      <nav className="tv47-adjacent">
        <a href="/lessons/graphs-and-functions/46-data-plotter">
          ←{" "}
          <span>
            PREVIOUS<b>Data Plotter</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/48-trace-mode">
          <span>
            NEXT<b>Trace Mode</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
