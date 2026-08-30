import { Check, Lightbulb, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./SeparableEquationsTargetLesson325.css";

type Term = "x" | "y";
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function SeparableEquationsTargetLesson325({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [xPlaced, setXPlaced] = useState(true);
  const [yPlaced, setYPlaced] = useState(true);
  const [integrated, setIntegrated] = useState(true);
  const [k, setK] = useState(2);
  const [tab, setTab] = useState("Interact");
  const [hint, setHint] = useState(false);
  const [practice, setPractice] = useState(0);
  const [actions, setActions] = useState(0);
  const separated = xPlaced && yPlaced;
  const reset = () => {
    setXPlaced(true);
    setYPlaced(true);
    setIntegrated(true);
    setK(2);
    setTab("Interact");
    setHint(false);
    setPractice(0);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const place = (term: Term, side: Term) =>
    act(() => {
      if (term === "x") setXPlaced(side === "x");
      else setYPlaced(side === "y");
      setIntegrated(false);
    });
  const drop = (side: Term, event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const term = event.dataTransfer.getData("text/plain") as Term;
    if (term === "x" || term === "y") place(term, side);
  };
  return (
    <section
      className="sep325-page"
      data-testid="calculus-mockup-0404"
      data-object-model="draggable-variable-separation-dual-antiderivatives-combined-constant-solution-family-k-graph-practice"
      data-x-placed={xPlaced}
      data-y-placed={yPlaced}
      data-separated={separated}
      data-integrated={integrated}
      data-k={k.toFixed(2)}
      data-tab={tab}
      data-hint={hint}
      data-practice={practice}
      data-actions={actions}
    >
      <header className="sep325-hero">
        <span>
          <b>CALCULUS</b>
          <b>DIFFERENTIAL EQUATIONS</b>
        </span>
        <h1>Separable Equations</h1>
        <p>
          Isolate x and y, integrate both sides, and build the family of
          solutions.
        </p>
        <div>
          <button>English⌄</button>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() => void navigator.clipboard?.writeText(location.href))
            }
          >
            <Share2 />
            Share
          </button>
          <button>↗ Workspace</button>
        </div>
        <aside>
          <h2>Key idea</h2>
          <p>
            Rewrite dy/dx as a product f(x)g(y). Move all x-terms to one side
            and y-terms to the other, integrate, and solve for y.
          </p>
        </aside>
      </header>
      <nav className="sep325-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="sep325-separate">
        <header>
          <h2>
            <i>1</i> Separate the variables
          </h2>
          <p>
            Drag terms to move x-terms to the left and y-terms to the right.
          </p>
          <output className={separated ? "correct" : ""}>
            {separated ? (
              <>
                <Check /> Correct separation!
              </>
            ) : (
              "Place both terms correctly"
            )}
          </output>
        </header>
        <aside className="terms">
          <h3>Original equation</h3>
          <strong>dy/dx = y/x</strong>
          <h3>Available terms</h3>
          <button
            draggable
            onDragStart={(event) =>
              event.dataTransfer.setData("text/plain", "x")
            }
            onClick={() => place("x", "x")}
          >
            dx/x
          </button>
          <button
            draggable
            onDragStart={(event) =>
              event.dataTransfer.setData("text/plain", "y")
            }
            onClick={() => place("y", "y")}
          >
            dy/y
          </button>
          <h3>Unused</h3>
          <b>
            {xPlaced && yPlaced
              ? "−"
              : `${xPlaced ? "" : "dx/x "}${yPlaced ? "" : "dy/y"}`}
          </b>
        </aside>
        <section
          className="drop x"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => drop("x", event)}
        >
          <h3>x-side</h3>
          {xPlaced && (
            <button
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("text/plain", "x")
              }
            >
              dx/x
            </button>
          )}
        </section>
        <b className="equals">=</b>
        <section
          className="drop y"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => drop("y", event)}
        >
          <h3>y-side</h3>
          {yPlaced && (
            <button
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("text/plain", "y")
              }
            >
              dy/y
            </button>
          )}
        </section>
        <aside className="how">
          <h3>How it works</h3>
          <ol>
            <li>Move all x-terms to the left.</li>
            <li>Move all y-terms to the right.</li>
            <li>Integrate both sides.</li>
            <li>Add a constant.</li>
            <li>Solve for y.</li>
          </ol>
          <button onClick={() => act(() => setHint((value) => !value))}>
            <Lightbulb /> Need a hint?
          </button>
          {hint && <p>Divide by y and multiply by dx.</p>}
        </aside>
        <footer>
          <b>Separated form</b>
          <strong>{separated ? "dx/x = dy/y" : "Complete both sides"}</strong>
        </footer>
      </section>
      <section className="sep325-integrate">
        <header>
          <h2>
            <i>2</i> Integrate both sides
          </h2>
          <p>Integrate each side and build the solution.</p>
        </header>
        <main>
          {[
            ["Integrate x-side", "∫ dx/x = ln|x| + C₁"],
            ["Integrate y-side", "∫ dy/y = ln|y| + C₂"],
            ["Equate & combine constants", "ln|x| + C₁ = ln|y| + C₂"],
            ["Solve for y", "y = Ceᶜx = Kx"],
          ].map(([title, formula], index) => (
            <article key={title} className={integrated ? "done" : ""}>
              <h3>{title}</h3>
              <strong>{formula}</strong>
              {index < 3 && <span>→</span>}
              <p>
                {integrated ? (
                  <>
                    <Check /> Correct
                  </>
                ) : (
                  "Waiting"
                )}
              </p>
            </article>
          ))}
        </main>
        <footer>
          <label>
            Constant of integration (K)
            <button
              onClick={() =>
                act(() => setK((value) => clamp(value - 0.5, -3, 3)))
              }
            >
              −
            </button>
            <input
              aria-label="Separable solution K"
              type="number"
              step=".5"
              min="-3"
              max="3"
              value={k}
              onChange={(event) =>
                act(() => setK(clamp(Number(event.target.value), -3, 3)))
              }
            />
            <button
              onClick={() =>
                act(() => setK((value) => clamp(value + 0.5, -3, 3)))
              }
            >
              +
            </button>
          </label>
          <p>
            C₀=ln|K| ={" "}
            {k === 0 ? "undefined" : Math.log(Math.abs(k)).toFixed(3)}
          </p>
          <aside>
            <b>Solution family</b> All solutions are lines through the origin:
            y=Kx.
          </aside>
          <button
            className="integrate-button"
            disabled={!separated}
            onClick={() => act(() => setIntegrated(true))}
          >
            Integrate both sides
          </button>
        </footer>
      </section>
      <section className="sep325-family">
        <article>
          <header>
            <h2>
              <i>3</i> Solution family graph
            </h2>
            <p>Explore the family y=Kx.</p>
          </header>
          <FamilyGraph k={k} />
          <footer>
            All lines pass through (0,0). Larger |K| gives a steeper slope.
          </footer>
        </article>
        <aside>
          <section>
            <h2>Quick explanation</h2>
            <p>
              We separated the equation so that x and y live on opposite sides.
              Combining constants yields ln|y|=ln|x|+C, so y=Kx.
            </p>
          </section>
          <section className="warning">
            <h2>Watch out!</h2>
            <p>Forgetting absolute values can miss sign cases.</p>
            {[
              "Forget |x|, |y| in integration",
              "Drop the constant C",
              "Integrate incorrectly",
              "Exponentiate incorrectly",
            ].map((text, index) => (
              <p key={text}>
                <i>{index + 1}</i>
                {text}
                <b>×</b>
              </p>
            ))}
            <footer>
              Check each step and you're good! <Check />
            </footer>
          </section>
        </aside>
      </section>
      <section className="sep325-practice">
        <header>
          <h2>
            <i>4</i> Practice challenge
          </h2>
          <p>Solve and find the solution family.</p>
        </header>
        <article>
          <h3>Solve</h3>
          <strong>dy/dx = 3xy, y(1)=2</strong>
        </article>
        <article>
          <h3>Your steps</h3>
          <p>
            Separate: dy/y=3x dx <Check />
          </p>
          <p>
            Integrate: ln|y|=3x²/2+C <Check />
          </p>
          <p>
            Apply y(1)=2 <Check />
          </p>
          <p>
            Solution: y=2e^(3/2(x²−1)) <Check />
          </p>
        </article>
        <article>
          <h3>Your graph</h3>
          <PracticeGraph />
        </article>
        <aside>
          <h3>Check</h3>
          <b>All correct!</b>
          <p>Matches the solution family and initial condition.</p>
          <button onClick={() => act(() => setPractice((value) => value + 1))}>
            Try another ({practice})
          </button>
        </aside>
      </section>
    </section>
  );
}

function FamilyGraph({ k }: { k: number }) {
  const w = 420,
    h = 285,
    p = 18,
    sx = (x: number) => p + ((x + 6) / 12) * (w - 2 * p),
    sy = (y: number) => h - p - ((y + 6) / 12) * (h - 2 * p),
    values = [-2, -1, -0.5, 0.5, 1, 2];
  return (
    <svg className="sep325-graph" viewBox={`0 0 ${w} ${h}`}>
      <line className="axis" x1={p} x2={w - p} y1={sy(0)} y2={sy(0)} />
      <line className="axis" x1={sx(0)} x2={sx(0)} y1={p} y2={h - p} />
      {values.map((value) => (
        <line
          key={value}
          className={Math.abs(value - k) < 0.01 ? "active" : "family"}
          x1={sx(-6)}
          y1={sy(-6 * value)}
          x2={sx(6)}
          y2={sy(6 * value)}
        />
      ))}
      {!values.includes(k) && (
        <line
          className="active"
          x1={sx(-6)}
          y1={sy(-6 * k)}
          x2={sx(6)}
          y2={sy(6 * k)}
        />
      )}
      <circle cx={sx(0)} cy={sy(0)} r="4" />
    </svg>
  );
}
function PracticeGraph() {
  return (
    <svg className="sep325-practice-graph" viewBox="0 0 190 105">
      <line x1="10" x2="180" y1="86" y2="86" />
      <line x1="95" x2="95" y1="8" y2="100" />
      <path d="M48 12 C58 48 68 75 95 78 C122 75 132 48 142 12" />
      <circle cx="112" cy="68" r="4" />
    </svg>
  );
}
