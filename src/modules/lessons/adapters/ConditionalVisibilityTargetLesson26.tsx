import {
  CheckCircle2,
  ExternalLink,
  Languages,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import { LessonGraphWorkspace } from "../graphs/LessonGraphWorkspace";
import { LessonNumberLineGraph } from "../graphs/LessonNumberLineGraph";
import { LessonVisibilityGraph } from "../graphs/LessonVisibilityGraph";
import "./ConditionalVisibilityTargetLesson26.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";


const VIEWS = ["Explore", "Explain", "Examples", "Formulas", "Know more"];
const OPERATORS = [">=", ">", "<=", "<", "=", "!="];
const compare = (value: number, operator: string, boundary: number) =>
  operator === ">="
    ? value >= boundary
    : operator === ">"
      ? value > boundary
      : operator === "<="
        ? value <= boundary
        : operator === "<"
          ? value < boundary
          : operator === "="
            ? value === boundary
            : value !== boundary;
const display = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

export default function ConditionalVisibilityTargetLesson26({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(2.5),
    [operator, setOperator] = useState(">="),
    [boundary, setBoundary] = useState(2),
    [view, setView] = useState(0),
    [workspace, setWorkspace] = useState(false),
    [legend, setLegend] = useState(false),
    [shareState, setShareState] = useState("Share"),
    [actions, setActions] = useState(0);
  const visible = compare(x, operator, boundary),
    truth = visible ? "TRUE" : "FALSE",
    symbol = `${display(x)} ${operator} ${display(boundary)}`;
  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const updateX = (value: number) => {
    setX(Math.max(-5, Math.min(5, Math.round(value * 10) / 10)));
    touch();
  };
  const reset = () => {
    setX(2.5);
    setOperator(">=");
    setBoundary(2);
    setView(0);
    setWorkspace(false);
    setLegend(false);
    setShareState("Share");
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setX(2.5);
    setOperator(">=");
    setBoundary(2);
    setView(0);
    setWorkspace(false);
    setLegend(false);
    setShareState("Share");
    setActions(0);
  }, [resetToken]);
  const share = async () => {
    try {
      await navigator.clipboard?.writeText(`${symbol} -> ${truth}`);
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    touch();
  };
  const before = boundary - 0.5,
    after = boundary + 0.5;
  return (
    <div
      className="visibility-page"
      data-testid="algebra-mockup-0026"
      data-dedicated-lesson="26"
      data-object-model="editable-boolean-boundary-number-line-region-object-visibility-before-after-model"
      data-x={x}
      data-operator={operator}
      data-boundary={boundary}
      data-visible={visible}
      data-view={view}
      data-workspace={workspace}
      data-legend={legend}
      data-actions={actions}
    >
      <nav className="visibility-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>26 Conditional Visibility</b>
      </nav>
      <header className="visibility-header">
        <h1>Conditional Visibility</h1>
        <p>Create responsive interactive lessons.</p>
        <div className="visibility-meta">
          <b>♙ Foundational-Advanced</b>
          <b>ϟ Exploration Lab</b>
          <b>▣ Algebra View / Input Bar</b>
          <b>◴ 6-10 min</b>
        </div>
        <nav>
          <button type="button" onClick={touch}>
            <Languages />
            English (English)<span>⌄</span>
          </button>
          <button type="button" onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button type="button" onClick={() => void share()}>
            <Share2 />
            {shareState}
          </button>
          <button
            type="button"
            className={workspace ? "active" : ""}
            onClick={() => {
              setWorkspace((value) => !value);
              touch();
            }}
          >
            <ExternalLink />
            Workspace
          </button>
        </nav>
      </header>
      <nav className="visibility-tabs" aria-label="Lesson views">
        {VIEWS.map((label, index) => (
          <button
            type="button"
            className={view === index ? "active" : ""}
            key={label}
            onClick={() => {
              setView(index);
              touch();
            }}
          >
            {index === 0
              ? "◉"
              : index === 1
                ? "▣"
                : index === 2
                  ? "♧"
                  : index === 3
                    ? "∑"
                    : "✣"}
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <main className="visibility-main">
        <section className="visibility-lab">
          <header>
            <div>
              <small>VISUALIZATION</small>
              <h2>Condition-based visibility on a number line</h2>
              <p>Rule: Objects are visible only where the condition is TRUE.</p>
            </div>
            <button
              type="button"
              className={legend ? "active" : ""}
              aria-pressed={legend}
              onClick={() => {
                setLegend((value) => !value);
                touch();
              }}
            >
              ♧ Legend
            </button>
          </header>
          <NumberLine
            x={x}
            boundary={boundary}
            operator={operator}
            onX={updateX}
            legend={legend}
          />
          <div className="visibility-middle">
            <LessonGraphWorkspace title="Object P">
              <LessonVisibilityGraph visible={visible} />
            </LessonGraphWorkspace>
            <section className="visibility-rule">
              <small>RULE</small>
              <h2>
                Visible if&nbsp; x {operator} {display(boundary)}
              </h2>
              <hr />
              <small>EVALUATION</small>
              <p>x = {display(x)}</p>
              <b className={visible ? "true" : "false"}>
                {symbol} -&gt; {truth}
                <CheckCircle2 />
              </b>
              <strong className={visible ? "true" : "false"}>
                <CheckCircle2 />
                Object P is {visible ? "visible" : "hidden"}
              </strong>
            </section>
          </div>
          <section className="visibility-before">
            <h3>Before / After</h3>
            <div>
              <article className="hidden">
                <section>
                  <small>BEFORE&nbsp; (Hidden)</small>
                  <b>x = {display(before)}</b>
                  <strong>
                    {display(before)} {operator} {display(boundary)} -&gt;{" "}
                    {compare(before, operator, boundary) ? "TRUE" : "FALSE"}
                  </strong>
                  <span>
                    Object P is{" "}
                    {compare(before, operator, boundary) ? "visible" : "hidden"}
                  </span>
                </section>
                <LessonVisibilityGraph
                  compact
                  visible={compare(before, operator, boundary)}
                />
              </article>
              <article>
                <section>
                  <small>AFTER&nbsp; (Visible)</small>
                  <b>x = {display(after)}</b>
                  <strong>
                    {display(after)} {operator} {display(boundary)} -&gt;{" "}
                    {compare(after, operator, boundary) ? "TRUE" : "FALSE"}
                  </strong>
                  <span>
                    Object P is{" "}
                    {compare(after, operator, boundary) ? "visible" : "hidden"}
                  </span>
                </section>
                <LessonVisibilityGraph
                  compact
                  visible={compare(after, operator, boundary)}
                />
              </article>
            </div>
          </section>
        </section>
        <aside className="visibility-side">
          <small>CONTROLS</small>
          <h2>x = {display(x)}</h2>
          <input
            aria-label="Conditional value x drag control"
            type="range"
            min="-5"
            max="5"
            step=".1"
            value={x}
            onChange={(event) => updateX(Number(event.target.value))}
          />
          <div className="visibility-ticks">
            <span>-5</span>
            <span>-4</span>
            <span>-3</span>
            <span>-2</span>
            <span>-1</span>
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
          <section className="condition-editor">
            <small>CONDITION EDITOR</small>
            <div>
              <select aria-label="Condition variable" onChange={touch}>
                <option>x</option>
              </select>
              <select
                aria-label="Condition operator"
                value={operator}
                onChange={(event) => {
                  setOperator(event.target.value);
                  touch();
                }}
              >
                {OPERATORS.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
              <input
                aria-label="Condition boundary"
                type="number"
                value={boundary}
                step=".5"
                onChange={(event) => {
                  setBoundary(Number(event.target.value));
                  touch();
                }}
              />
            </div>
          </section>
          <section className="boundary-card">
            <label>
              Boundary (c)
              <input
                aria-label="Boundary c"
                type="number"
                value={boundary}
                step=".5"
                onChange={(event) => {
                  setBoundary(Number(event.target.value));
                  touch();
                }}
              />
            </label>
            <b>Boundary: x = {display(boundary)}</b>
            <p>Check boundary values carefully.</p>
          </section>
          <section className="status-card">
            <small>VISIBILITY STATUS</small>
            <div className={visible ? "true" : "false"}>
              <CheckCircle2 />
              <b>{visible ? "Visible" : "Hidden"}</b>
              <span>
                The condition is {truth} at x = {display(x)}
              </span>
            </div>
          </section>
          <section className="truth-card">
            <small>TRUTH EVALUATION</small>
            <b className={visible ? "true" : "false"}>
              {symbol} -&gt; {truth}
            </b>
          </section>
          <section className="about-card">
            <small>ABOUT THIS RULE</small>
            <p>
              Objects are shown only in the region
              <br />
              where the condition is TRUE.
              <br />
              Adjust x to see the visibility change.
            </p>
          </section>
        </aside>
      </main>
<nav className="visibility-neighbors">
        <a href="/lessons/core-workspaces/25-dependent-and-independent-objects">
          ←
          <span>
            <small>PREVIOUS</small>
            <b>Dependent and Independent Objects</b>
          </span>
        </a>
        <a href="/lessons/core-workspaces/27-dynamic-labels">
          <span>
            <small>NEXT</small>
            <b>Dynamic Labels</b>
          </span>
          →
        </a>
      </nav>
      <LessonTopicStudyBoard lessonId={26} alwaysVisible onInteraction={onInteraction} />
    </div>
  );
}

function NumberLine({
  x,
  boundary,
  operator,
  onX,
  legend,
}: {
  x: number;
  boundary: number;
  operator: string;
  onX: (value: number) => void;
  legend: boolean;
}) {
  // Partition the original domain; the lesson's existing comparison decides each region.
  const cuts = [...new Set([-5, Math.max(-5, Math.min(5, boundary)), 5])].sort(
    (a, b) => a - b,
  );
  const regions = cuts.slice(0, -1).map((start, index) => {
    const end = cuts[index + 1],
      visible = compare((start + end) / 2, operator, boundary);
    return {
      id: `${visible ? "visible" : "hidden"}-${index}`,
      start,
      end,
      color: visible ? "#078e66" : "#d5202d",
      label: `${visible ? "Visible" : "Hidden"} region from ${start} to ${end}`,
    };
  });
  return (
    <LessonNumberLineGraph
      title={`Visibility regions: x ${operator} ${display(boundary)}`}
      min={-5}
      max={5}
      value={x}
      step={0.1}
      onChange={onX}
      inputLabel="Visibility number line drag control"
      regions={regions}
      boundary={{
        value: boundary,
        included: compare(boundary, operator, boundary),
        color: "#078e66",
      }}
      legend={
        legend
          ? [
              { id: "visible", label: "Visible region", color: "#078e66" },
              { id: "hidden", label: "Hidden region", color: "#d5202d" },
              {
                id: "boundary",
                label: `Boundary ${compare(boundary, operator, boundary) ? "included" : "excluded"}`,
                color: "#078e66",
              },
            ]
          : undefined
      }
    />
  );
}
