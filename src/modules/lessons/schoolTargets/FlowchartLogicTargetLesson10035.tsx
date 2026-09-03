import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Lightbulb,
  Maximize2,
  Play,
  RotateCcw,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { type PointerEvent, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./FlowchartLogicTargetLesson10035.css";

const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];
const traceLabels = ["Start", "Read n", "n mod 2 = 0 ?", "Output", "End"];
type Point = { x: number; y: number };
type NodeKey = "start" | "read" | "decision" | "even" | "odd" | "end";
const initialNodes: Record<NodeKey, Point> = {
  start: { x: 260, y: 28 },
  read: { x: 260, y: 96 },
  decision: { x: 260, y: 180 },
  even: { x: 140, y: 275 },
  odd: { x: 380, y: 275 },
  end: { x: 260, y: 365 },
};

export default function FlowchartLogicTargetLesson10035({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [value, setValue] = useState(10);
  const [step, setStep] = useState(2);
  const [connected, setConnected] = useState(true);
  const [checked, setChecked] = useState<"idle" | "valid" | "invalid">("idle");
  const [tab, setTab] = useState("Interact");
  const [zoom, setZoom] = useState(100);
  const [nodes, setNodes] = useState(initialNodes);
  const [dragging, setDragging] = useState<NodeKey | null>(null);
  const [tool, setTool] = useState("Connector");
  const [challengeConnected, setChallengeConnected] = useState(false);
  const [challengeResult, setChallengeResult] = useState<
    "idle" | "correct" | "retry"
  >("idle");
  const [hint, setHint] = useState(false);
  const [actions, setActions] = useState(0);
  const output = value % 2 === 0 ? "Even" : "Odd";
  const act = (fn: () => void) => {
    fn();
    setActions((count) => count + 1);
  };
  const reset = () =>
    act(() => {
      setValue(10);
      setStep(2);
      setConnected(true);
      setChecked("idle");
      setTab("Interact");
      setZoom(100);
      setNodes(initialNodes);
      setTool("Connector");
      setChallengeConnected(false);
      setChallengeResult("idle");
      setHint(false);
    });
  const moveNode = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !event.currentTarget.hasPointerCapture(event.pointerId))
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 520;
    const y = ((event.clientY - rect.top) / rect.height) * 410;
    setNodes((current) => ({
      ...current,
      [dragging]: {
        x: Math.max(55, Math.min(465, x)),
        y: Math.max(25, Math.min(385, y)),
      },
    }));
    setActions((count) => count + 1);
  };
  const startDrag = (event: PointerEvent<SVGGElement>, key: NodeKey) => {
    setDragging(key);
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
  };
  return (
    <section
      className="flow10035-page"
      data-testid="school-mockup-0709"
      data-object-model="dedicated-executable-draggable-branching-flowchart"
      data-input={value}
      data-output={output}
      data-step={step}
      data-connected={connected}
      data-valid={connected}
      data-challenge-connected={challengeConnected}
      data-challenge-result={challengeResult}
      data-zoom={zoom}
      data-start-x={Math.round(nodes.start.x)}
      data-actions={actions}
    >
      <header className="flow10035-hero">
        <small>CLASS 8 - INFORMATION PROCESSING</small>
        <h1>Flowchart Logic</h1>
        <p>
          Trace and build decision flowcharts that transform inputs into correct
          outputs.
        </p>
        <div>
          <span>18 min</span>
          <span>Chapter: Information Processing</span>
          <span>Topic: Flowchart Logic</span>
          <span>Level: Class 8</span>
        </div>
        <Link to="/lessons/school">School lessons</Link>
      </header>
      <nav className="flow10035-tabs" aria-label="Lesson sections">
        {tabs.map((item) => (
          <button
            className={tab === item ? "active" : ""}
            key={item}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>

      <section className="flow10035-builder">
        <header>
          <div>
            <h2>INTERACTIVE FLOWCHART BUILDER</h2>
            <p>
              Build, run, and trace your flowchart. Every decision must have Yes
              and No branches.
            </p>
          </div>
          <div>
            <button onClick={reset}>
              <RotateCcw size={13} /> Reset
            </button>
            <button
              onClick={() =>
                act(() => {
                  setConnected(false);
                  setChecked("idle");
                })
              }
            >
              <Trash2 size={13} /> Clear
            </button>
            <button
              className="primary"
              onClick={() =>
                act(() => setChecked(connected ? "valid" : "invalid"))
              }
            >
              <Lightbulb size={13} /> Check flowchart
            </button>
          </div>
        </header>
        <aside className="flow10035-controls">
          <article>
            <h3>INPUT</h3>
            <label>
              Enter a value:
              <input
                aria-label="Flowchart input"
                type="number"
                value={value}
                onChange={(event) =>
                  act(() => {
                    setValue(Number(event.target.value));
                    setStep(0);
                  })
                }
              />
            </label>
          </article>
          <article>
            <h3>EXECUTION CONTROLS</h3>
            <button className="run" onClick={() => act(() => setStep(4))}>
              <Play size={13} /> Run
            </button>
            <div>
              <button
                onClick={() =>
                  act(() => setStep((current) => Math.min(4, current + 1)))
                }
              >
                Step
              </button>
              <button
                onClick={() =>
                  act(() => setStep((current) => Math.max(0, current - 1)))
                }
              >
                Step back
              </button>
            </div>
          </article>
          <article className="trace">
            <h3>EXECUTION TRACE</h3>
            {traceLabels.map((label, index) => (
              <p className={step === index ? "current" : ""} key={label}>
                <b>{index + 1}</b>
                <span>
                  {index === 2
                    ? `${label} ${output === "Even" ? "Yes" : "No"}`
                    : index === 3
                      ? `Output "${output}"`
                      : label}
                </span>
                <i className={index <= step ? "done" : ""}>
                  {index < step ? "check" : index === step ? "now" : ""}
                </i>
              </p>
            ))}
          </article>
          <article className="live">
            <h3>LIVE OUTPUT</h3>
            <strong>{step >= 3 ? output : "-"}</strong>
            <span>n = {value}</span>
          </article>
        </aside>
        <div className="flow10035-canvas">
          <FlowDiagram
            nodes={nodes}
            connected={connected}
            zoom={zoom}
            onStart={startDrag}
            onMove={moveNode}
            onEnd={() => setDragging(null)}
            onNudge={(key, dx, dy) =>
              act(() =>
                setNodes((current) => ({
                  ...current,
                  [key]: {
                    x: Math.max(55, Math.min(465, current[key].x + dx)),
                    y: Math.max(25, Math.min(385, current[key].y + dy)),
                  },
                })),
              )
            }
          />
          <aside className="toolbox">
            <h3>TOOLBOX</h3>
            {["Start / End", "Input / Output", "Decision", "Connector"].map(
              (item) => (
                <button
                  className={tool === item ? "active" : ""}
                  key={item}
                  onClick={() => act(() => setTool(item))}
                >
                  <i className={item.split(" ")[0].toLowerCase()} />
                  {item}
                </button>
              ),
            )}
          </aside>
          <div className="zoom">
            <button
              aria-label="Zoom out"
              onClick={() => act(() => setZoom((z) => Math.max(80, z - 10)))}
            >
              <ZoomOut size={13} />
            </button>
            <b>{zoom}%</b>
            <button
              aria-label="Zoom in"
              onClick={() => act(() => setZoom((z) => Math.min(130, z + 10)))}
            >
              <ZoomIn size={13} />
            </button>
            <button
              aria-label="Fit view"
              onClick={() => act(() => setZoom(100))}
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
        <footer className={checked === "invalid" ? "invalid" : ""}>
          <CheckCircle2 size={15} />
          {checked === "invalid"
            ? "A decision branch is disconnected. Restore both Yes and No paths."
            : "All branches connected. Flowchart is complete and valid."}
        </footer>
      </section>

      <section className="flow10035-theory">
        <article>
          <h2>WHY IT WORKS</h2>
          <p>
            Every decision has two explicit branches (Yes / No) that lead to
            valid next steps. This guarantees the algorithm handles all possible
            cases and always reaches an output.
          </p>
        </article>
        <article>
          <h2>WORKED EXAMPLE</h2>
          <h3>Test whether n is even.</h3>
          <p>Rule: n mod 2 = 0 leads to Even, otherwise Odd.</p>
          <div className="mini-flow">
            <span>Start</span>
            <b>to</b>
            <span>Read n</span>
            <b>to</b>
            <span>n mod 2 = 0 ?</span>
            <b>to</b>
            <span>Even / Odd</span>
          </div>
        </article>
        <article className="warning">
          <h2>COMMON MISCONCEPTION</h2>
          <p>Leaving a branch unconnected makes the algorithm incomplete.</p>
          <p>
            Every decision must have both Yes and No branches leading to a valid
            next step or output.
          </p>
        </article>
      </section>

      <section className="flow10035-challenge">
        <header>
          <h2>PRACTICE CHALLENGE</h2>
          <p>
            Repair the flowchart to classify a number as Positive, Zero, or
            Negative.
          </p>
        </header>
        <aside className="instructions">
          <h3>INSTRUCTIONS</h3>
          <p>Connect the missing branch.</p>
          <p>Use the correct next step.</p>
          <p>Ensure both decisions have Yes and No branches.</p>
          <strong>+ 10 XP</strong>
        </aside>
        <ChallengeDiagram
          connected={challengeConnected}
          onConnect={() =>
            act(() => {
              setChallengeConnected(true);
              setChallengeResult("idle");
            })
          }
        />
        <aside className="challenge-tools">
          <h3>ADD STEP</h3>
          {["Start / End", "Input / Output", "Decision", "Connector"].map(
            (item) => (
              <button
                key={item}
                onClick={() =>
                  act(() => {
                    setTool(item);
                    if (item === "Connector") setChallengeConnected(true);
                  })
                }
              >
                {item}
              </button>
            ),
          )}
          <div>
            <h3>HINT</h3>
            {hint && (
              <p>If n is not zero, check whether it is greater than zero.</p>
            )}
            <button onClick={() => act(() => setHint((open) => !open))}>
              <Eye size={13} /> {hint ? "Hide hint" : "Show hint"}
            </button>
          </div>
          <button
            className="check"
            onClick={() =>
              act(() =>
                setChallengeResult(challengeConnected ? "correct" : "retry"),
              )
            }
          >
            Check my answer
          </button>
          {challengeResult !== "idle" && (
            <p className={challengeResult}>
              {challengeResult === "correct"
                ? "Correct. Every branch reaches an output."
                : "Connect the missing No branch first."}
            </p>
          )}
        </aside>
      </section>
      <nav className="flow10035-adjacent">
        <Link to="/lessons/school/class-8/class-8-data-handling-range-and-spread-explorer">
          <ArrowLeft size={13} /> Previous: Formula
        </Link>
        <Link
          className="next"
          to="/lessons/school/class-8/class-8-information-processing-pattern-encoding"
        >
          Next: Practice <ArrowRight size={13} />
        </Link>
      </nav>
    </section>
  );
}

function FlowDiagram({
  nodes,
  connected,
  zoom,
  onStart,
  onMove,
  onEnd,
  onNudge,
}: {
  nodes: Record<NodeKey, Point>;
  connected: boolean;
  zoom: number;
  onStart: (event: PointerEvent<SVGGElement>, key: NodeKey) => void;
  onMove: (event: PointerEvent<SVGSVGElement>) => void;
  onEnd: () => void;
  onNudge: (key: NodeKey, dx: number, dy: number) => void;
}) {
  const p = nodes;
  return (
    <svg
      className="flow-diagram"
      viewBox="0 0 520 410"
      onPointerMove={onMove}
      onPointerUp={onEnd}
      onPointerCancel={onEnd}
      style={{ transform: `scale(${zoom / 100})` }}
      aria-label="Executable even or odd flowchart"
    >
      <g className="connectors">
        <path d={`M${p.start.x} ${p.start.y + 18}V${p.read.y - 23}`} />
        <path d={`M${p.read.x} ${p.read.y + 23}V${p.decision.y - 35}`} />
        <path
          d={`M${p.decision.x - 48} ${p.decision.y}H${p.even.x}V${p.even.y - 25}`}
        />
        {connected && (
          <path
            d={`M${p.decision.x + 48} ${p.decision.y}H${p.odd.x}V${p.odd.y - 25}`}
          />
        )}
        <path d={`M${p.even.x} ${p.even.y + 25}V${p.end.y}H${p.end.x - 44}`} />
        <path d={`M${p.odd.x} ${p.odd.y + 25}V${p.end.y}H${p.end.x + 44}`} />
      </g>
      <text
        className="yes"
        x={(p.decision.x + p.even.x) / 2 - 10}
        y={p.decision.y - 8}
      >
        Yes
      </text>
      <text
        className="no"
        x={(p.decision.x + p.odd.x) / 2 + 3}
        y={p.decision.y - 8}
      >
        No
      </text>
      <FlowNode
        kind="terminal"
        at={p.start}
        label="Start"
        nodeKey="start"
        onStart={onStart}
        onNudge={onNudge}
      />
      <FlowNode
        kind="io"
        at={p.read}
        label="Read n"
        nodeKey="read"
        onStart={onStart}
        onNudge={onNudge}
      />
      <FlowNode
        kind="decision"
        at={p.decision}
        label="n mod 2 = 0 ?"
        nodeKey="decision"
        onStart={onStart}
        onNudge={onNudge}
      />
      <FlowNode
        kind="io"
        at={p.even}
        label={'Output "Even"'}
        nodeKey="even"
        onStart={onStart}
        onNudge={onNudge}
      />
      <FlowNode
        kind="io"
        at={p.odd}
        label={'Output "Odd"'}
        nodeKey="odd"
        onStart={onStart}
        onNudge={onNudge}
      />
      <FlowNode
        kind="terminal"
        at={p.end}
        label="End"
        nodeKey="end"
        onStart={onStart}
        onNudge={onNudge}
      />
    </svg>
  );
}

function FlowNode({
  kind,
  at,
  label,
  nodeKey,
  onStart,
  onNudge,
}: {
  kind: "terminal" | "io" | "decision";
  at: Point;
  label: string;
  nodeKey: NodeKey;
  onStart: (event: PointerEvent<SVGGElement>, key: NodeKey) => void;
  onNudge: (key: NodeKey, dx: number, dy: number) => void;
}) {
  return (
    <g
      className={`flow-node ${kind}`}
      role="slider"
      tabIndex={0}
      aria-label={`${label} node`}
      transform={`translate(${at.x} ${at.y})`}
      onPointerDown={(event) => onStart(event, nodeKey)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") onNudge(nodeKey, 5, 0);
        if (event.key === "ArrowLeft") onNudge(nodeKey, -5, 0);
        if (event.key === "ArrowUp") onNudge(nodeKey, 0, -5);
        if (event.key === "ArrowDown") onNudge(nodeKey, 0, 5);
      }}
    >
      {kind === "terminal" ? (
        <rect x="-43" y="-18" width="86" height="36" rx="18" />
      ) : kind === "decision" ? (
        <path d="M0-36L64 0 0 36-64 0Z" />
      ) : (
        <path d="M-48-25H55L48 25H-55Z" />
      )}
      <text textAnchor="middle" dominantBaseline="middle">
        {label}
      </text>
    </g>
  );
}

function ChallengeDiagram({
  connected,
  onConnect,
}: {
  connected: boolean;
  onConnect: () => void;
}) {
  return (
    <div className="challenge-diagram">
      <svg
        viewBox="0 0 470 300"
        aria-label="Positive zero or negative flowchart challenge"
      >
        <g className="connectors">
          <path d="M235 28V55M235 95V115M195 140H145V165M275 140H325V165M145 205V235H205M325 205V235H265" />
          {connected && <path d="M235 165V205" />}
        </g>
        <FlowShape x={235} y={20} kind="terminal" text="Start" />
        <FlowShape x={235} y={75} kind="io" text="Read n" />
        <FlowShape x={235} y={140} kind="decision" text="n = 0 ?" />
        <FlowShape x={145} y={185} kind="io" text={'Output "Zero"'} />
        <FlowShape x={235} y={210} kind="decision" text="n > 0 ?" />
        <FlowShape x={125} y={255} kind="io" text={'Output "Positive"'} />
        <FlowShape x={345} y={255} kind="io" text={'Output "Negative"'} />
        <FlowShape x={235} y={280} kind="terminal" text="End" />
      </svg>
      {!connected && (
        <button aria-label="Connect missing branch" onClick={onConnect}>
          +
        </button>
      )}
    </div>
  );
}
function FlowShape({
  x,
  y,
  kind,
  text,
}: {
  x: number;
  y: number;
  kind: "terminal" | "io" | "decision";
  text: string;
}) {
  return (
    <g className={`flow-node ${kind}`} transform={`translate(${x} ${y})`}>
      {kind === "terminal" ? (
        <rect x="-35" y="-13" width="70" height="26" rx="13" />
      ) : kind === "decision" ? (
        <path d="M0-24L43 0 0 24-43 0Z" />
      ) : (
        <path d="M-40-18H44L40 18H-44Z" />
      )}
      <text textAnchor="middle" dominantBaseline="middle">
        {text}
      </text>
    </g>
  );
}
