import {
  BarChart3,
  CirclePlus,
  GripVertical,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./ListsTargetLesson32.css";

const colors = ["blue", "green", "orange", "purple"];
const stats = (values: number[]) => ({
  length: values.length,
  sum: values.reduce((total, value) => total + value, 0),
  mean: values.length
    ? values.reduce((total, value) => total + value, 0) / values.length
    : 0,
});
const show = (values: number[]) => `[${values.join(", ")}]`;
export default function ListsTargetLesson32({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [values, setValues] = useState([2, 4, 6, 8]),
    [selected, setSelected] = useState(2),
    [view, setView] = useState<"bar" | "dot">("bar"),
    [descending, setDescending] = useState(false),
    [actions, setActions] = useState(0);
  const [dragging, setDragging] = useState<number | null>(null);
  const sourceStats = stats(values),
    pipeline = useMemo(() => {
      const appended = [...values, 10],
        removed = appended.filter(
          (value, index) => !(value === 4 && appended.indexOf(4) === index),
        ),
        sorted = [...removed].sort((a, b) => (descending ? b - a : a - b)),
        mapped = sorted.map((value) => value * 2);
      return { appended, removed, sorted, mapped, stats: stats(mapped) };
    }, [values, descending]);
  const touch = () => {
      setActions((value) => value + 1);
      onInteraction();
    },
    reset = () => {
      setValues([2, 4, 6, 8]);
      setSelected(2);
      setView("bar");
      setDescending(false);
      setActions(0);
      onInteraction();
    };
  useEffect(() => {
    setValues([2, 4, 6, 8]);
    setSelected(2);
    setView("bar");
    setDescending(false);
    setActions(0);
  }, [resetToken]);
  const update = (index: number, value: number) => {
      setValues((current) =>
        current.map((entry, i) => (i === index ? value : entry)),
      );
      touch();
    },
    append = () => {
      setValues((current) => [...current, (current.at(-1) ?? 0) + 2]);
      setSelected(values.length);
      touch();
    },
    remove = () => {
      if (!values.length) return;
      setValues((current) => current.filter((_, index) => index !== selected));
      setSelected((index) => Math.max(0, Math.min(index, values.length - 2)));
      touch();
    },
    mapValues = () => {
      setValues((current) => current.map((value) => value * 2));
      touch();
    },
    sortValues = () => {
      setValues((current) =>
        [...current].sort((a, b) => (descending ? b - a : a - b)),
      );
      setDescending((current) => !current);
      touch();
    };
  const drop = (event: DragEvent, index: number) => {
    event.preventDefault();
    if (dragging === null || dragging === index) return;
    setValues((current) => {
      const next = [...current],
        item = next.splice(dragging, 1)[0];
      next.splice(index, 0, item);
      return next;
    });
    setSelected(index);
    setDragging(null);
    touch();
  };
  return (
    <div
      className="lists-page"
      data-testid="algebra-mockup-0032"
      data-dedicated-lesson="32"
      data-object-model="editable-draggable-ordered-list-index-selection-operation-pipeline-statistics-bar-dot-result-model"
      data-list={values.join(",")}
      data-selected-index={selected}
      data-selected-value={values[selected] ?? ""}
      data-length={sourceStats.length}
      data-sum={sourceStats.sum}
      data-mean={sourceStats.mean}
      data-final-list={pipeline.mapped.join(",")}
      data-final-sum={pipeline.stats.sum}
      data-final-mean={pipeline.stats.mean}
      data-view={view}
      data-descending={descending}
      data-actions={actions}
    >
      <nav className="lists-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>Lists</b>
      </nav>
      <section className="lists-shell">
        <header className="lists-header">
          <div>
            <b>CORE WORKSPACES</b>
            <h1>Lists</h1>
            <p>Work with ordered collections. Order matters.</p>
          </div>
          <aside>
            <span>
              ◷
              <small>
                Estimated time
                <br />
                <b>6-10 min</b>
              </small>
            </span>
            <span>
              ⊕
              <small>
                Language
                <br />
                <b>English</b>
              </small>
            </span>
          </aside>
        </header>
        <nav className="lists-tabs">
          {[
            "Interaction + visualization",
            "Explain",
            "Examples",
            "Formulas",
            "Know more",
          ].map((label, index) => (
            <button
              type="button"
              className={index === 0 ? "active" : ""}
              onClick={touch}
              key={label}
            >
              {["☷", "▣", "♧", "Σ", "✣"][index]} {label}
            </button>
          ))}
        </nav>
      </section>
      <div className="lists-layout">
        <main className="lists-workspace">
          <header>
            <h2>Build and transform an ordered list</h2>
            <nav>
              <button type="button" onClick={reset}>
                <RotateCcw />
                Reset list
              </button>
              <button
                type="button"
                onClick={() => {
                  setValues([]);
                  setSelected(0);
                  touch();
                }}
              >
                ↔ Start over
              </button>
            </nav>
          </header>
          <h3>List L = {show(values)}</h3>
          <section className="list-editor">
            {values.map((value, index) => (
              <div
                className={`list-item ${colors[index % 4]} ${selected === index ? "selected" : ""}`}
                draggable
                onDragStart={() => setDragging(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => drop(event, index)}
                key={`${index}-${value}`}
              >
                <GripVertical />
                <input
                  aria-label={`List value ${index + 1}`}
                  type="number"
                  value={value}
                  onFocus={() => setSelected(index)}
                  onChange={(event) =>
                    update(index, Number(event.target.value))
                  }
                />
                <small>{index + 1}</small>
              </div>
            ))}
            <button
              type="button"
              className="append-tile"
              aria-label="Append next list value"
              onClick={append}
            >
              <CirclePlus />
            </button>
          </section>
          <p className="index-label">Index positions</p>
          <section className="pipeline">
            <h3>Operation pipeline</h3>
            <div>
              {[
                ["Append 10", pipeline.appended],
                ["Remove 4", pipeline.removed],
                [`Sort (${descending ? "desc" : "asc"})`, pipeline.sorted],
                ["Map x → 2x", pipeline.mapped],
                ["Sum & Mean", pipeline.mapped],
              ].map(([label, result], index) => (
                <article className={colors[index % 4]} key={String(label)}>
                  <i>{index + 1}</i>
                  <b>{String(label)}</b>
                  <span>
                    {index === 4
                      ? `Sum = ${pipeline.stats.sum}, Mean = ${pipeline.stats.mean}`
                      : `L → ${show(result as number[])}`}
                  </span>
                </article>
              ))}
            </div>
          </section>
          <section className="lists-visuals">
            <article>
              <h3>Visual representation (optional)</h3>
              <nav>
                <button
                  type="button"
                  className={view === "bar" ? "active" : ""}
                  onClick={() => {
                    setView("bar");
                    touch();
                  }}
                >
                  <BarChart3 />
                  Bar chart
                </button>
                <button
                  type="button"
                  className={view === "dot" ? "active" : ""}
                  onClick={() => {
                    setView("dot");
                    touch();
                  }}
                >
                  ⌘ Dot plot
                </button>
              </nav>
              <ListChart values={values} view={view} selected={selected} />
            </article>
            <article className="pipeline-result">
              <h3>List after pipeline</h3>
              <p>Final list</p>
              <div>
                {pipeline.mapped.map((value, index) => (
                  <b className={colors[index % 4]} key={`${index}-${value}`}>
                    {value}
                  </b>
                ))}
              </div>
              <footer>
                Length = {pipeline.stats.length}&nbsp;&nbsp;&nbsp; Sum ={" "}
                {pipeline.stats.sum}&nbsp;&nbsp;&nbsp; Mean ={" "}
                {pipeline.stats.mean}
              </footer>
            </article>
          </section>
        </main>
        <aside className="lists-side">
          <section>
            <header>
              <h2>Selected entry</h2>
              <b>Index {values.length ? selected + 1 : "-"}</b>
            </header>
            <div>
              <strong>
                Selected value = <em>{values[selected] ?? "-"}</em>
              </strong>
              <p>
                This is the value at position{" "}
                {values.length ? selected + 1 : "-"}.
              </p>
              <p>You can drag to reorder or edit values.</p>
            </div>
          </section>
          <section className="list-summary">
            <h2>List summary</h2>
            {[
              ["List", `L = ${show(values)}`],
              ["Length", sourceStats.length],
              ["Sum", sourceStats.sum],
              ["Mean", sourceStats.mean],
            ].map(([label, value]) => (
              <p key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </p>
            ))}
          </section>
          <section className="list-operations">
            <h2>Operations</h2>
            <button type="button" onClick={append}>
              <CirclePlus />
              <b>Append</b>
              <span>Add a value to the end</span>
            </button>
            <button type="button" disabled={!values.length} onClick={remove}>
              <Trash2 />
              <b>Remove</b>
              <span>Remove selected value</span>
            </button>
            <button type="button" disabled={!values.length} onClick={mapValues}>
              <b>ƒx</b>
              <strong>Map</strong>
              <span>Apply rule to all entries</span>
              <small>map x → 2x</small>
            </button>
            <button
              type="button"
              disabled={!values.length}
              onClick={sortValues}
            >
              <b>⇄</b>
              <strong>Sort</strong>
              <span>Sort entries (asc / desc)</span>
            </button>
            <footer>♧ Tip: Operations work on the current list.</footer>
          </section>
        </aside>
      </div>
      <section className="lists-concepts">
        {[
          [
            "Ordered entries",
            "A list is an ordered collection.",
            "The order of values matters.",
          ],
          ["Index", "Each entry has a position (index)", "starting from 1."],
          [
            "Operations",
            "Operations act on the list as a whole",
            "or on selected entries.",
          ],
          [
            "Result",
            "A list is not a single number.",
            "Aggregate operations give a number.",
          ],
        ].map((item, index) => (
          <article key={item[0]}>
            <h2>
              <i>{["▥", "≛", "ƒx", "≛"][index]}</i>
              {item[0]}
            </h2>
            <p>{item[1]}</p>
            <p>{item[2]}</p>
            {index === 0 ? (
              <strong>[2, 4, 6, 8] &nbsp;≠&nbsp; [8, 6, 4, 2]</strong>
            ) : index === 1 ? (
              <div className="mini-index">
                {values.slice(0, 4).map((value, i) => (
                  <span key={i}>
                    <b>{value}</b>
                    <small>{i + 1}</small>
                  </span>
                ))}
              </div>
            ) : index === 2 ? (
              <nav>
                <button onClick={append}>＋</button>
                <button onClick={remove}>−</button>
                <button onClick={mapValues}>ƒx</button>
                <button onClick={sortValues}>⇄</button>
              </nav>
            ) : (
              <nav>
                <button onClick={touch}>Sum</button>
                <button onClick={touch}>Mean</button>
                <button onClick={touch}>Min</button>
                <button onClick={touch}>Max</button>
              </nav>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
function ListChart({
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
