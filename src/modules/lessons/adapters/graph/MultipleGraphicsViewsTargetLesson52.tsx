import {
  Grid2X2,
  LayoutGrid,
  MoreHorizontal,
  RotateCcw,
  Share2,
  Square,
  StretchHorizontal,
  StretchVertical,
} from "lucide-react";
import { useEffect, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  MULTIPLE_FULL_BOUNDS,
  MULTIPLE_TABLE_X,
  clampMultipleX,
  detailBounds,
  multipleCurvePath,
  multipleGraphPosition,
  multipleViewValue,
  multipleXFromPixel,
  type MultipleLayout,
  type MultipleViewBounds,
  type MultipleViewId,
} from "./multipleViewsLesson52Model";
import "./MultipleGraphicsViewsTargetLesson52.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

function LinkedGraph({
  view,
  cursor,
  onChange,
  detail = false,
}: {
  view: MultipleViewId;
  cursor: number;
  onChange: (value: number) => void;
  detail?: boolean;
}) {
  const bounds: MultipleViewBounds = detail
      ? detailBounds(cursor)
      : MULTIPLE_FULL_BOUNDS,
    width = 400,
    height = 260,
    y = multipleViewValue(cursor),
    point = multipleGraphPosition(cursor, y, bounds, width, height),
    origin = multipleGraphPosition(0, 0, bounds, width, height);
  const drag = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    onChange(
      multipleXFromPixel(
        ((event.clientX - rect.left) / rect.width) * width,
        bounds,
        width,
      ),
    );
  };
  const key = (event: ReactKeyboardEvent<SVGCircleElement>) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    onChange(cursor + (event.key === "ArrowLeft" ? -0.1 : 0.1));
  };
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${detail ? "Detail" : "Full"} function graph with linked cursor`}
    >
      <defs>
        <pattern
          id={`mg52-grid-${view}`}
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path d="M28 0H0V28" fill="none" stroke="#dfe8f2" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#mg52-grid-${view})`} />
      <line x1="0" x2={width} y1={origin.y} y2={origin.y} className="axis" />
      <line x1={origin.x} x2={origin.x} y1="0" y2={height} className="axis" />
      <polyline
        points={multipleCurvePath(bounds, width, height)}
        className="curve"
      />
      <line
        x1={point.x}
        x2={point.x}
        y1="0"
        y2={height}
        className="cursor-line"
      />
      {detail && (
        <line
          x1="0"
          x2={width}
          y1={point.y}
          y2={point.y}
          className="cursor-line"
        />
      )}
      <circle
        aria-label={`Drag ${view} cursor`}
        tabIndex={0}
        cx={point.x}
        cy={point.y}
        r="8"
        className="cursor-point"
        onPointerDown={(event) =>
          event.currentTarget.setPointerCapture(event.pointerId)
        }
        onPointerMove={drag}
        onKeyDown={key}
      />
      <g
        className="mg52-label"
        transform={`translate(${Math.min(width - 118, point.x + 12)} ${Math.max(8, point.y - 38)})`}
      >
        <rect width="116" height="32" rx="7" />
        <text x="58" y="21" textAnchor="middle">
          ({cursor.toFixed(1)}, {y.toFixed(6)})
        </text>
      </g>
    </svg>
  );
}

export default function MultipleGraphicsViewsTargetLesson52({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [selected, setSelected] = useState(2),
    [cursors, setCursors] = useState<Record<MultipleViewId, number>>({
      algebra: 2,
      graph: 2,
      table: 2,
      detail: 2,
    }),
    [sync, setSync] = useState(true),
    [layout, setLayout] = useState<MultipleLayout>("grid"),
    [hidden, setHidden] = useState<Set<MultipleViewId>>(new Set()),
    [language, setLanguage] = useState("en"),
    [actions, setActions] = useState(0);
  const reset = () => {
    setSelected(2);
    setCursors({ algebra: 2, graph: 2, table: 2, detail: 2 });
    setSync(true);
    setLayout("grid");
    setHidden(new Set());
    setLanguage("en");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const cursor = (view: MultipleViewId) => (sync ? selected : cursors[view]);
  const changeCursor = (view: MultipleViewId, value: number) =>
    act(() => {
      const next = clampMultipleX(value);
      if (sync) {
        setSelected(next);
        setCursors({ algebra: next, graph: next, table: next, detail: next });
      } else setCursors((current) => ({ ...current, [view]: next }));
    });
  const togglePane = (view: MultipleViewId) =>
    act(() =>
      setHidden((current) => {
        const next = new Set(current);
        if (next.has(view)) next.delete(view);
        else next.add(view);
        return next;
      }),
    );
  const panes: MultipleViewId[] =
    layout === "single" ? ["graph"] : ["algebra", "graph", "table", "detail"];
  const isVisible = (view: MultipleViewId) =>
    panes.includes(view) && !hidden.has(view);
  const activeX = cursor("graph"),
    activeY = multipleViewValue(activeX);

  return (
    <section
      className="mg52-page"
      data-testid="2d-graphing-mockup-0144"
      data-dedicated-lesson="52"
      data-object-model="single-shared-function-four-independent-representations-pointer-keyboard-draggable-full-and-detail-cursors-clickable-table-linked-or-unsynced-values-real-single-grid-split-stack-layouts-pane-visibility-language-reset-share-workspace-and-navigation"
      data-layout={layout}
      data-sync={sync}
      data-x={activeX}
      data-y={activeY.toFixed(6)}
      data-actions={actions}
    >
      <nav className="mg52-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>52 Multiple Graphics Views</b>
      </nav>
      <header className="mg52-hero">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>2D GRAPHING CALCULATOR</b>
        </small>
        <h1>Multiple Graphics Views</h1>
        <p>Compare representations side by side.</p>
        <nav>
          <b>Foundational-Advanced</b>
          <b>⚡ Graph Explorer</b>
          <b>▣ Graphing Calculator</b>
          <b>◷ 6-10 min</b>
        </nav>
        <section>
          <select
            aria-label="Multiple views language"
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
                navigator.clipboard?.writeText(`f(${activeX})=${activeY}`),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="#mg52-workspace">↗ Workspace</a>
        </section>
      </header>
      <section className={`mg52-workspace ${layout}`} id="mg52-workspace">
        <main className="mg52-panes">
          {isVisible("algebra") && (
            <article className="mg52-pane algebra">
              <header>
                <h2>ƒₓ &nbsp; Algebra view</h2>
                <button
                  aria-label="Hide algebra view"
                  onClick={() => togglePane("algebra")}
                >
                  <MoreHorizontal />
                </button>
              </header>
              <strong>f(x) = sin(x) + 0.25x</strong>
              <section>
                <p>Evaluate at selected x</p>
                <b>x = {cursor("algebra").toFixed(1)}</b>
                <output>
                  f({cursor("algebra").toFixed(1)}) ={" "}
                  {multipleViewValue(cursor("algebra")).toFixed(6)}
                </output>
              </section>
            </article>
          )}
          {isVisible("graph") && (
            <article className="mg52-pane">
              <header>
                <h2>⌁ &nbsp; Graph view</h2>
                <button
                  aria-label="Hide graph view"
                  onClick={() => togglePane("graph")}
                >
                  <MoreHorizontal />
                </button>
              </header>
              <LinkedGraph
                view="graph"
                cursor={cursor("graph")}
                onChange={(value) => changeCursor("graph", value)}
              />
              <footer>x = {cursor("graph").toFixed(1)}</footer>
            </article>
          )}
          {isVisible("table") && (
            <article className="mg52-pane table">
              <header>
                <h2>▦ &nbsp; Table view</h2>
                <button
                  aria-label="Hide table view"
                  onClick={() => togglePane("table")}
                >
                  <MoreHorizontal />
                </button>
              </header>
              <table>
                <thead>
                  <tr>
                    <th>x</th>
                    <th>f(x) = sin(x) + 0.25x</th>
                  </tr>
                </thead>
                <tbody>
                  {MULTIPLE_TABLE_X.map((x) => (
                    <tr
                      key={x}
                      className={
                        Math.abs(cursor("table") - x) < 0.05 ? "active" : ""
                      }
                      onClick={() => changeCursor("table", x)}
                    >
                      <td>{x.toFixed(1)}</td>
                      <td>{multipleViewValue(x).toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <footer>x = {cursor("table").toFixed(1)}</footer>
            </article>
          )}
          {isVisible("detail") && (
            <article className="mg52-pane">
              <header>
                <h2>⌕ &nbsp; Detail view</h2>
                <button
                  aria-label="Hide detail view"
                  onClick={() => togglePane("detail")}
                >
                  <MoreHorizontal />
                </button>
              </header>
              <LinkedGraph
                view="detail"
                cursor={cursor("detail")}
                onChange={(value) => changeCursor("detail", value)}
                detail
              />
              <footer>x = {cursor("detail").toFixed(1)}</footer>
            </article>
          )}
        </main>
        <aside className="mg52-controls">
          <h2>Same object, different views</h2>
          <p>
            Explore the same function across multiple representations. Move the
            cursor or change the value to see all views update together.
          </p>
          <hr />
          <h3>Layout</h3>
          <section>
            {(
              [
                ["single", Square, "1×1"],
                ["grid", Grid2X2, "2×2"],
                ["split", StretchHorizontal, "Split"],
                ["stack", StretchVertical, "Stack"],
              ] as const
            ).map(([value, Icon, label]) => (
              <button
                key={value}
                className={layout === value ? "active" : ""}
                onClick={() => act(() => setLayout(value))}
              >
                <Icon />
                {label}
              </button>
            ))}
          </section>
          <hr />
          <label>
            Sync cursor
            <input
              type="checkbox"
              checked={sync}
              onChange={(event) => act(() => setSync(event.target.checked))}
            />
            <small>
              Keep the selected x-value synchronized across all views.
            </small>
          </label>
          <div className="mg52-selected">
            <span>Selected x-value</span>
            <input
              aria-label="Selected x value"
              type="number"
              min="-5"
              max="5"
              step="0.1"
              value={activeX}
              onChange={(event) =>
                changeCursor("graph", Number(event.target.value))
              }
            />
            <b>
              f({activeX.toFixed(1)}) = {activeY.toFixed(6)}
            </b>
          </div>
          {hidden.size > 0 && (
            <section className="mg52-restore">
              {[...hidden].map((view) => (
                <button key={view} onClick={() => togglePane(view)}>
                  <LayoutGrid />
                  Restore {view}
                </button>
              ))}
            </section>
          )}
        </aside>
      </section>
      <nav className="mg52-adjacent">
        <a href="/lessons/graphs-and-functions/51-grid-controls">
          ←{" "}
          <span>
            PREVIOUS<b>Grid Controls</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/53-special-points">
          <span>
            NEXT<b>Special Points</b>
          </span>{" "}
          →
        </a>
      </nav>
      <LessonTopicStudyBoard lessonId={52} alwaysVisible onInteraction={onInteraction} />

    </section>
  );
}
