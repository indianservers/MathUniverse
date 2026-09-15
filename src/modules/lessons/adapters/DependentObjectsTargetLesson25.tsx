import { CheckCircle2, Info, Lightbulb, Lock, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import { LessonCartesianGraph } from "../graphs/LessonCartesianGraph";
import { LessonGraphWorkspace } from "../graphs/LessonGraphWorkspace";
import { LessonDependencyTree } from "../graphs/LessonDependencyTree";
import "./DependentObjectsTargetLesson25.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";


type Point = { x: number; y: number };
const GRAPH_VIEW = {
  xMin: -80 / 72,
  xMax: (720 - 80) / 72,
  yMin: (300 - 365) / 52,
  yMax: 300 / 52,
};
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const fmt = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

export default function DependentObjectsTargetLesson25({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState<Point>({ x: 1, y: 2 }),
    [b, setB] = useState<Point>({ x: 5, y: 2 }),
    [actions, setActions] = useState(0);
  const [graphView, setGraphView] = useState(GRAPH_VIEW);
  const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    length = Math.hypot(b.x - a.x, b.y - a.y);
  const touch = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const update = (name: "a" | "b", point: Point) => {
    const bounded = {
      x: clamp(Math.round(point.x), 0, 8),
      y: clamp(Math.round(point.y), -1, 5),
    };
    if (name === "a") setA(bounded);
    else setB(bounded);
    touch();
  };
  const nudge = (name: "a" | "b", axis: "x" | "y", delta: number) => {
    const source = name === "a" ? a : b;
    update(name, { ...source, [axis]: source[axis] + delta });
  };
  useEffect(() => {
    setA({ x: 1, y: 2 });
    setB({ x: 5, y: 2 });
    setActions(0);
    setGraphView(GRAPH_VIEW);
  }, [resetToken]);
  return (
    <div
      className="dependency-page"
      aria-label="Draggable independent points A and B with dependent midpoint"
      data-testid="algebra-mockup-0025"
      data-dedicated-lesson="25"
      data-object-model="two-draggable-parent-points-derived-segment-midpoint-length-label-hierarchy-model"
      data-ax={a.x}
      data-ay={a.y}
      data-bx={b.x}
      data-by={b.y}
      data-mx={midpoint.x}
      data-my={midpoint.y}
      data-length={fmt(length)}
      data-actions={actions}
    >
      <nav className="dependency-breadcrumb">
        <a href="/">←</a>
        <a href="/">Home</a>
        <span>›</span>
        <a href="/lessons">Lessons</a>
        <span>›</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a>
        <span>›</span>
        <b>25 Dependent And Independent Objects</b>
      </nav>
      <header className="dependency-header">
        <div>
          <h1>Dependent and Independent Objects</h1>
          <p>Teach construction hierarchy.</p>
          <nav>
            <b>
              <i />
              Independent: A and B
            </b>
            <b>
              <i />
              Dependent: segment AB and midpoint M
            </b>
          </nav>
        </div>
        <aside>
          <Lightbulb />
          <b>
            Move a parent object to
            <br />
            update its children.
          </b>
        </aside>
      </header>
      <main className="dependency-main">
        <section className="dependency-lab">
          <LessonCartesianGraph
            title="Independent points and dependent midpoint"
            description="Drag A or B to update segment AB and midpoint M."
            view={graphView}
            onViewChange={setGraphView}
            onResetView={() => setGraphView(GRAPH_VIEW)}
            aspectRatio={720 / 365}
            legend={[
              {
                id: "parents",
                label: "Independent: A and B",
                color: "#0872dd",
              },
              {
                id: "midpoint",
                label: "Dependent: midpoint M",
                color: "#13a43e",
              },
            ]}
            series={[
              {
                id: "segment",
                label: "Segment AB",
                color: "#195fe4",
                points: [a, b],
              },
            ]}
            annotations={[
              {
                id: "a",
                ...a,
                label: `A(${a.x}, ${a.y})`,
                color: "#0872dd",
                testId: "dependency-handle-a",
                onChange: (point) => update("a", point),
                keyboardStep: 1,
              },
              {
                id: "b",
                ...b,
                label: `B(${b.x}, ${b.y})`,
                color: "#0872dd",
                testId: "dependency-handle-b",
                onChange: (point) => update("b", point),
                keyboardStep: 1,
              },
              {
                id: "midpoint",
                ...midpoint,
                label: `M(${fmt(midpoint.x)}, ${fmt(midpoint.y)})`,
                color: "#13a43e",
              },
            ]}
          />
          <div className="dependency-lower">
            <section className="dependency-formula">
              <div className="parent-cards">
                <b>
                  <i />
                  A({a.x}, {a.y})
                </b>
                <b>
                  <i />
                  B({b.x}, {b.y})
                </b>
              </div>
              <div className="formula-flow">
                <span>↘</span>
                <span>↙</span>
                <strong>
                  M = (&nbsp;
                  <i className="fraction">
                    <span>
                      x<sub>A</sub> + x<sub>B</sub>
                    </span>
                    <small>2</small>
                  </i>
                  , &nbsp;
                  <i className="fraction">
                    <span>
                      y<sub>A</sub> + y<sub>B</sub>
                    </span>
                    <small>2</small>
                  </i>
                  &nbsp;)
                </strong>
                <em>↓</em>
                <b>
                  <i />
                  M({fmt(midpoint.x)}, {fmt(midpoint.y)})
                </b>
              </div>
            </section>
            <LessonGraphWorkspace title="Dependency hierarchy">
              <LessonDependencyTree
                label="A and B determine segment AB, midpoint M and its label"
                levels={[
                  [
                    { id: "a", label: "A", color: "#0875df" },
                    { id: "b", label: "B", color: "#0875df" },
                  ],
                  [{ id: "segment", label: "Segment AB", color: "#195fe4" }],
                  [{ id: "midpoint", label: "Midpoint M", color: "#13a43e" }],
                  [
                    {
                      id: "label",
                      label: `Label M(${fmt(midpoint.x)}, ${fmt(midpoint.y)})`,
                      color: "#13a43e",
                    },
                  ],
                ]}
              />
            </LessonGraphWorkspace>
          </div>
        </section>
        <aside className="dependency-side">
          <h2>
            Independent objects <Info />
          </h2>
          <PointControls
            name="A"
            point={a}
            onNudge={(axis, delta) => nudge("a", axis, delta)}
          />
          <PointControls
            name="B"
            point={b}
            onNudge={(axis, delta) => nudge("b", axis, delta)}
          />
          <h2>
            Dependent objects <small>(auto-updated)</small>
          </h2>
          <section className="dependent-card">
            <header>
              <i />
              M({fmt(midpoint.x)}, {fmt(midpoint.y)})<span>Midpoint of AB</span>
              <Lock />
            </header>
            <label>
              x<output>{fmt(midpoint.x)}</output>
            </label>
            <label>
              y<output>{fmt(midpoint.y)}</output>
            </label>
          </section>
          <section className="dependent-card length">
            <header>
              <i />
              <u />
              AB = {fmt(length)}
              <span>Length of segment</span>
              <Lock />
            </header>
            <label>
              Length<output>{fmt(length)}</output>
            </label>
          </section>
          <p className="dependency-note">
            <CheckCircle2 />
            Move a parent object to
            <br />
            update its children.
          </p>
        </aside>
      </main>
<nav className="dependency-neighbors">
        <a href="/lessons/core-workspaces/24-animation-controls">
          ←
          <span>
            <small>Previous</small>
            <b>Animation Controls</b>
          </span>
        </a>
        <a href="/lessons/core-workspaces/26-conditional-visibility">
          <span>
            <small>Next</small>
            <b>Conditional Visibility</b>
          </span>
          →
        </a>
      </nav>
      <LessonTopicStudyBoard lessonId={25} alwaysVisible onInteraction={onInteraction} />
    </div>
  );
}

function PointControls({
  name,
  point,
  onNudge,
}: {
  name: string;
  point: Point;
  onNudge: (axis: "x" | "y", delta: number) => void;
}) {
  return (
    <section className="parent-control">
      <header>
        <i />
        <b>
          {name}({point.x}, {point.y})
        </b>
        <Unlock />
      </header>
      {(["x", "y"] as const).map((axis) => (
        <label key={axis}>
          {axis}
          <button
            type="button"
            aria-label={`Decrease ${name} ${axis}`}
            onClick={() => onNudge(axis, -1)}
          >
            −
          </button>
          <output>{point[axis]}</output>
          <button
            type="button"
            aria-label={`Increase ${name} ${axis}`}
            onClick={() => onNudge(axis, 1)}
          >
            +
          </button>
        </label>
      ))}
    </section>
  );
}
