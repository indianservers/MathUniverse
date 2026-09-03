import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  ShieldCheck,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AsaCongruenceTargetLesson10067.css";

type Asa = { left: number; right: number; side: number };
const INITIAL: Asa = { left: 50, right: 70, side: 6 };

export default function AsaCongruenceTargetLesson10067({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [one, setOne] = useState<Asa>(INITIAL),
    [two, setTwo] = useState<Asa>(INITIAL),
    [tool, setTool] = useState(0),
    [tab, setTab] = useState(0),
    [challenge, setChallenge] = useState({ left: 40, right: 65, side: 7 }),
    [checked, setChecked] = useState(false),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const third1 = 180 - one.left - one.right,
    third2 = 180 - two.left - two.right;
  const matches =
    one.left === two.left && one.right === two.right && one.side === two.side;
  const reset = () =>
    act(() => {
      setOne(INITIAL);
      setTwo(INITIAL);
      setTool(0);
    });
  return (
    <section
      className="asa10067-page"
      data-testid="school-mockup-0741"
      data-object-model="dedicated-dual-angle-included-side-asa-congruence-engine"
      data-one={`${one.left},${one.right},${one.side},${third1}`}
      data-two={`${two.left},${two.right},${two.side},${third2}`}
      data-matches={String(matches)}
      data-tool={tool}
      data-challenge={`${challenge.left},${challenge.right},${challenge.side}`}
      data-checked={String(checked)}
      data-actions={actions}
    >
      <header className="asa10067-hero">
        <small>CLASS 9 · TRIANGLE PROOFS</small>
        <h1>
          ASA Congruence <ShieldCheck />
        </h1>
        <p>
          Prove two triangles congruent using two corresponding angles and the
          included side.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="asa10067-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-selected={tab === i}
            onClick={() => act(() => setTab(i))}
          >
            {x}
          </button>
        ))}
      </nav>
      <main>
        <section className="asa10067-lab">
          <header>
            <div>
              <h2>CONSTRUCT & VERIFY</h2>
              <p>
                Build both triangles using the given data. Adjust the dials and
                side, then check if the triangles are congruent.
              </p>
            </div>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </header>
          <div className="asa10067-builders">
            <AsaBuilder
              title="Triangle 1"
              letters="ABC"
              value={one}
              tool={tool}
              onTool={(i) => act(() => setTool(i))}
              onChange={(v) => act(() => setOne(v))}
            />
            <AsaBuilder
              title="Triangle 2"
              letters="DEF"
              value={two}
              tool={tool}
              onTool={(i) => act(() => setTool(i))}
              onChange={(v) => act(() => setTwo(v))}
            />
          </div>
          <section className="asa10067-verify">
            <h2>VERIFY CONGRUENCE</h2>
            <article>
              <h3>• Third angle (calculated)</h3>
              <p>
                ∠C = 180° − ({one.left}° + {one.right}°) = <b>{third1}°</b>
              </p>
              <p>
                ∠F = 180° − ({two.left}° + {two.right}°) = <b>{third2}°</b>
              </p>
            </article>
            <article>
              <h3>Overlay check</h3>
              <Overlay one={one} two={two} />
              <strong className={matches ? "pass" : "fail"}>
                <Check />{" "}
                {matches
                  ? "All parts match perfectly."
                  : "Adjust corresponding parts."}
                <br />
                <i>△ABC {matches ? "≅" : "≇"} △DEF (ASA)</i>
              </strong>
            </article>
            <article>
              <h3>• Corresponding parts</h3>
              {[
                ["∠A = ∠D", one.left, two.left],
                ["∠B = ∠E", one.right, two.right],
                ["AB = DE", one.side, two.side],
                ["∠C = ∠F", third1, third2],
              ].map(([label, a, b]) => (
                <p key={String(label)}>
                  <b>{label}</b>
                  <span>
                    {a} = {b}
                  </span>
                  {a === b ? <Check /> : <TriangleAlert />}
                </p>
              ))}
              <footer>
                Result: Triangles are {matches ? "congruent" : "not congruent"}{" "}
                by ASA.
              </footer>
            </article>
          </section>
        </section>
        <section className="asa10067-theory">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              In ASA, two corresponding angles fix the directions of two rays
              from one vertex. The included side fixes the distance between
              those rays.
            </p>
            <div>
              <AsaMini />
              <b>↔</b>
              <AsaMini />
            </div>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              <b>Given:</b> ∠A = ∠D = 50°, AB = DE = 6, ∠B = ∠E = 70°
            </p>
            <p>
              <b>Then:</b> ∠C = ∠F = 60°
            </p>
            <strong>
              Therefore, △ABC ≅ △DEF (ASA) <Check />
            </strong>
            <p>
              <b>Correspondence:</b>
              <br />A ↔ D, B ↔ E, C ↔ F
            </p>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> COMMON MISCONCEPTION
            </h2>
            <p>
              The known side must be between the two known angles. If the side
              is not included between the two angles, ASA does not apply.
            </p>
            <div>
              <AsaMini />
              <AsaMini wrong />
            </div>
          </article>
          <article className="challenge">
            <h2>
              <Target /> CHALLENGE YOURSELF
            </h2>
            <p>
              Set the given data, construct both triangles, and identify all
              corresponding parts.
            </p>
            <label>
              1 ∠A = ∠D{" "}
              <select
                value={challenge.left}
                onChange={(e) =>
                  act(() =>
                    setChallenge({ ...challenge, left: +e.target.value }),
                  )
                }
              >
                <option>40</option>
                <option>50</option>
              </select>
              ° ∠B = ∠E{" "}
              <select
                value={challenge.right}
                onChange={(e) =>
                  act(() =>
                    setChallenge({ ...challenge, right: +e.target.value }),
                  )
                }
              >
                <option>65</option>
                <option>70</option>
              </select>
              ° AB = DE{" "}
              <input
                aria-label="Challenge included side"
                type="number"
                value={challenge.side}
                onChange={(e) =>
                  act(() =>
                    setChallenge({ ...challenge, side: +e.target.value }),
                  )
                }
              />
            </label>
            <p>2 Construct both triangles and check congruence.</p>
            <p>3 List all corresponding angles and sides.</p>
            <button onClick={() => act(() => setChecked(true))}>
              ☆ Check my answer
            </button>
            {checked && (
              <strong className="answer">
                Correct construction: ASA fixes a unique triangle.
              </strong>
            )}
          </article>
        </section>
      </main>
      <nav className="asa10067-adjacent">
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-sss-congruence">
          <ArrowLeft />
          <span>
            Previous
            <br />
            <b>SSS Congruence</b>
          </span>
        </Link>
        <span>
          Progress
          <br />○ ○ ○ ○ ● ○ ○ ○ ○ ○
        </span>
        <Link to="/lessons/school/class-9/class-9-triangle-proofs-aas-congruence">
          <span>
            Next
            <br />
            <b>AAS Congruence</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function AsaBuilder({
  title,
  letters,
  value,
  tool,
  onTool,
  onChange,
}: {
  title: string;
  letters: string;
  value: Asa;
  tool: number;
  onTool: (n: number) => void;
  onChange: (v: Asa) => void;
}) {
  const labels = letters.split("");
  return (
    <article className="asa10067-builder">
      <header>
        <h2>{title}</h2>
        <i>△{letters}</i>
      </header>
      <aside>
        <b>
          ∠{labels[0]} = ∠{letters === "ABC" ? "D" : "A"}
        </b>
        <Dial
          value={value.left}
          label={`Angle ${labels[0]}`}
          onChange={(n) => onChange({ ...value, left: n })}
        />
        <b>
          ∠{labels[1]} = ∠{letters === "ABC" ? "E" : "B"}
        </b>
        <Dial
          value={value.right}
          label={`Angle ${labels[1]}`}
          onChange={(n) => onChange({ ...value, right: n })}
        />
        <b>
          Included side {labels[0]}
          {labels[1]}
        </b>
        <span className="asa10067-step">
          <button
            onClick={() =>
              onChange({ ...value, side: Math.max(3, value.side - 1) })
            }
          >
            −
          </button>
          <output>{value.side}</output>
          <button
            onClick={() =>
              onChange({ ...value, side: Math.min(9, value.side + 1) })
            }
          >
            +
          </button>
        </span>
      </aside>
      <TriangleModel letters={letters} value={value} />
      <nav>
        {["↖", "•", "╱", "△", "↶"].map((x, i) => (
          <button
            key={i}
            className={tool === i ? "active" : ""}
            aria-label={`${title} tool ${i + 1}`}
            onClick={() => onTool(i)}
          >
            {x}
          </button>
        ))}
        <button
          onClick={() =>
            onChange({ ...value, side: Math.max(3, value.side - 1) })
          }
        >
          −
        </button>
        <button
          onClick={() =>
            onChange({ ...value, side: Math.min(9, value.side + 1) })
          }
        >
          +
        </button>
      </nav>
    </article>
  );
}
function Dial({
  value,
  label,
  onChange,
}: {
  value: number;
  label: string;
  onChange: (n: number) => void;
}) {
  return (
    <label className="asa10067-dial">
      <input
        aria-label={label}
        type="range"
        min="20"
        max="120"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <strong>{value}°</strong>
      <small>
        <span>0°</span>
        <span>180°</span>
      </small>
    </label>
  );
}
function points(v: Asa) {
  const a = (v.left * Math.PI) / 180,
    b = (v.right * Math.PI) / 180,
    base = 170;
  const h = (base * Math.sin(a) * Math.sin(b)) / Math.sin(Math.PI - a - b);
  return { x: 35 + h / Math.tan(a), y: 215 - h };
}
function TriangleModel({ letters, value }: { letters: string; value: Asa }) {
  const p = points(value),
    [a, b, c] = letters.split("");
  return (
    <svg
      className="asa10067-triangle"
      viewBox="0 0 250 245"
      aria-label={`ASA triangle ${letters}`}
    >
      <path d={`M35 215L205 215L${p.x} ${p.y}Z`} />
      <path className="left" d="M35 215H67A32 32 0 0 0 55 190Z" />
      <path className="right" d="M205 215H173A32 32 0 0 1 186 188Z" />
      <circle cx="35" cy="215" r="4" />
      <circle cx="205" cy="215" r="4" />
      <circle cx={p.x} cy={p.y} r="4" />
      <text x="20" y="235">
        {a}
      </text>
      <text x="207" y="235">
        {b}
      </text>
      <text x={p.x - 4} y={p.y - 10}>
        {c}
      </text>
      <text x="63" y="201">
        {value.left}°
      </text>
      <text x="164" y="201">
        {value.right}°
      </text>
      <text className="side" x="115" y="234">
        {value.side}
      </text>
    </svg>
  );
}
function Overlay({ one, two }: { one: Asa; two: Asa }) {
  return (
    <svg
      className="asa10067-overlay"
      viewBox="0 0 220 130"
      aria-label="ASA overlay check"
    >
      <path d="M20 110L190 110L105 20Z" />
      <path
        className="two"
        d={`M20 110L${20 + (two.side / one.side) * 170} 110L105 ${20 + (one.left - two.left)}Z`}
      />
      <text x="8" y="125">
        A,D
      </text>
      <text x="190" y="125">
        B,E
      </text>
      <text x="100" y="16">
        C,F
      </text>
    </svg>
  );
}
function AsaMini({ wrong = false }: { wrong?: boolean }) {
  return (
    <svg className="asa10067-mini" viewBox="0 0 150 90">
      <path d={wrong ? "M5 75L140 75L105 15Z" : "M5 75L125 75L65 15Z"} />
      <path className="left" d="M5 75H25L15 59Z" />
      <path className="right" d={`${wrong ? "M140" : "M125"} 75H105L116 58Z`} />
      <text x="38" y="88">
        6
      </text>
      {wrong && (
        <text className="x" x="130" y="28">
          ×
        </text>
      )}
    </svg>
  );
}
