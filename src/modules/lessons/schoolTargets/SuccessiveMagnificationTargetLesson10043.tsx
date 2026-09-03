import {
  ArrowLeft,
  ArrowRight,
  Check,
  Info,
  RotateCcw,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SuccessiveMagnificationTargetLesson10043.css";

const targetOptions = {
  sqrt2: { label: "√2 ≈ 1.41421356…", value: Math.SQRT2 },
  sqrt3: { label: "√3 ≈ 1.73205080…", value: Math.sqrt(3) },
  pi: { label: "π ≈ 3.14159265…", value: Math.PI },
} as const;
type TargetKey = keyof typeof targetOptions;
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];

function intervalFor(value: number, level: number) {
  const scale = 10 ** level;
  const lower = Math.floor(value * scale) / scale;
  return {
    lower,
    upper: lower + 1 / scale,
    width: 1 / scale,
    digit: Math.floor(value * 10 ** (level + 1)) % 10,
  };
}
function intervalsFromDigits(value: number, digits: number[]) {
  const result = [
    {
      lower: Math.floor(value),
      upper: Math.floor(value) + 1,
      width: 1,
      digit: Math.floor(value * 10) % 10,
    },
  ];
  digits.forEach((digit) => {
    const parent = result.at(-1)!;
    const width = parent.width / 10;
    const lower = parent.lower + digit * width;
    result.push({ lower, upper: lower + width, width, digit });
  });
  return result;
}
const fixed = (value: number, places: number) => value.toFixed(places);

export default function SuccessiveMagnificationTargetLesson10043({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [targetKey, setTargetKey] = useState<TargetKey>("sqrt2"),
    [digits, setDigits] = useState<number[]>([4]),
    [nextDigit, setNextDigit] = useState(4),
    [showTarget, setShowTarget] = useState(true),
    [tab, setTab] = useState("Interact"),
    [challengeDigits, setChallengeDigits] = useState<string[]>(["", "", ""]),
    [challengeChecked, setChallengeChecked] = useState(false),
    [actions, setActions] = useState(0);
  const target = targetOptions[targetKey],
    targetDigits = useMemo(
      () =>
        target.value.toFixed(8).split(".")[1].slice(0, 3).split("").map(Number),
      [target.value],
    ),
    displayDigits = useMemo(
      () => [...digits, ...targetDigits.slice(digits.length, 3)],
      [digits, targetDigits],
    ),
    levels = useMemo(
      () => intervalsFromDigits(target.value, digits),
      [digits, target.value],
    ),
    displayLevels = useMemo(
      () => intervalsFromDigits(target.value, displayDigits),
      [displayDigits, target.value],
    );
  const current = levels.at(-1)!;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const zoom = () =>
    act(() => {
      if (digits.length < 6) setDigits((d) => [...d, nextDigit]);
    });
  const reset = () =>
    act(() => {
      setTargetKey("sqrt2");
      setDigits([]);
      setNextDigit(4);
      setShowTarget(true);
    });
  const changeTarget = (key: TargetKey) =>
    act(() => {
      setTargetKey(key);
      setDigits([]);
      setNextDigit(Math.floor(targetOptions[key].value * 10) % 10);
    });
  const challengeCorrect = challengeDigits.join("") === "732";
  return (
    <section
      className="mag10043-page"
      data-testid="school-mockup-0717"
      data-object-model="dedicated-successive-decimal-interval-zoom-engine"
      data-target={targetKey}
      data-level={digits.length}
      data-interval={`${fixed(current.lower, digits.length)},${fixed(current.upper, digits.length)}`}
      data-width={current.width}
      data-challenge={challengeChecked ? String(challengeCorrect) : "idle"}
      data-actions={actions}
    >
      <header className="mag10043-hero">
        <small>CLASS 9 · REAL NUMBERS</small>
        <h1>Successive Magnification on the Number Line</h1>
        <p>
          <b>Objective:</b> Locate irrational numbers precisely by repeatedly
          zooming into nested decimal intervals.
        </p>
        <div>
          <span>◷ 18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>NUMBER LINE</span>
          <span>ZOOM &amp; NEST</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="mag10043-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main className="mag10043-main">
        <section className="mag10043-lab">
          <header>
            <div>
              <h2>Interactive: Multi-level Number Line Zoom</h2>
              <p>
                Use decimal digits to zoom and trap the target number in nested
                intervals.
              </p>
            </div>
            <label>
              Target number
              <select
                value={targetKey}
                onChange={(e) => changeTarget(e.target.value as TargetKey)}
              >
                {Object.entries(targetOptions).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <button aria-label="Locate target">
              <Target />
            </button>
          </header>
          <div className="mag-lab-grid">
            <aside>
              <section>
                <h3>Step 1: Choose next digit</h3>
                <p>Each digit picks one tenth of the current interval.</p>
                <div className="mag-digits">
                  {Array.from({ length: 10 }, (_, d) => (
                    <button
                      key={d}
                      className={nextDigit === d ? "active" : ""}
                      onClick={() => act(() => setNextDigit(d))}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3>Step 2: Apply zoom (×10)</h3>
                <p>Interval shrinks by a factor of 10.</p>
                <button className="mag-zoom" onClick={zoom}>
                  Zoom In ×10
                </button>
              </section>
              <section>
                <h3>Controls</h3>
                <button className="mag-reset" onClick={reset}>
                  <RotateCcw /> Reset All
                </button>
                <label>
                  Show target
                  <input
                    type="checkbox"
                    checked={showTarget}
                    onChange={(e) => act(() => setShowTarget(e.target.checked))}
                  />
                </label>
              </section>
              <section>
                <h3>Current Interval</h3>
                <strong>
                  {fixed(current.lower, digits.length)} ≤ x &lt;
                  {fixed(current.upper, digits.length)}
                </strong>
                <b>Width = {current.width}</b>
              </section>
              <section>
                <h3>Decimal built</h3>
                <strong>
                  {digits.length
                    ? `${Math.floor(target.value)}.${digits.join("")}`
                    : Math.floor(target.value)}
                </strong>
              </section>
            </aside>
            <div className="mag-lines">
              {displayLevels.slice(0, 4).map((interval, level) => (
                <NumberLine
                  key={level}
                  level={level}
                  parent={
                    level === 0
                      ? {
                          lower: 0,
                          upper: targetKey === "pi" ? 4 : 3,
                          width: targetKey === "pi" ? 4 : 3,
                        }
                      : displayLevels[level - 1]
                  }
                  interval={interval}
                  value={target.value}
                  digit={level ? displayDigits[level - 1] : undefined}
                  showTarget={showTarget}
                />
              ))}
            </div>
          </div>
          <footer>
            <Info />
            <b>Rule:</b> Each decimal digit selects one tenth of the current
            interval, producing nested intervals that locate the number.
          </footer>
          <aside className="mag-warning">
            <TriangleAlert /> Rounding an approximation is not the same as the
            exact irrational number.
          </aside>
        </section>
        <section className="mag10043-theory">
          <article>
            <h2>Why it works</h2>
            <p>
              At each step, the chosen digit partitions the current interval
              into 10 equal parts. Selecting the digit keeps exactly one tenth
              of the interval that contains the target.
            </p>
            <p>
              After n digits, the interval width is 10⁻ⁿ. Since the target is
              never excluded, the nested intervals converge to the exact number.
            </p>
            <div>
              <b>Digits used</b>
              <span>4 → 1 → 4 → …</span>
              <b>Intervals</b>
              <span>[1.4,1.5) [1.41,1.42) [1.414,1.415)</span>
              <b>Widths</b>
              <span>10⁻¹ → 10⁻² → 10⁻³</span>
            </div>
          </article>
          <article>
            <h2>Worked Example: Locate √2</h2>
            <p>√2 ≈ 1.41421356…</p>
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Digit</th>
                  <th>Interval</th>
                  <th>Width</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>–</td>
                  <td>[1, 2)</td>
                  <td>1</td>
                </tr>
                {[1, 2, 3].map((level) => (
                  <tr key={level}>
                    <td>{level}</td>
                    <td>{[4, 1, 4][level - 1]}</td>
                    <td>
                      [{fixed(intervalFor(Math.SQRT2, level).lower, level)},{" "}
                      {fixed(intervalFor(Math.SQRT2, level).upper, level)})
                    </td>
                    <td>{10 ** -level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Therefore, √2 ∈ [1.414, 1.415).</p>
          </article>
          <article className="misconception">
            <h2>Common Misconception</h2>
            <b>Rounding gives an approximation, not the exact number.</b>
            <div>
              <span>
                Rounding (approximation)
                <small>Round √2 to 1.41 and lose information.</small>
              </span>
              <span>
                Successive Magnification
                <small>
                  Zoom to trap the exact number in smaller intervals.
                </small>
              </span>
            </div>
          </article>
          <Challenge
            digits={challengeDigits}
            setDigits={setChallengeDigits}
            checked={challengeChecked}
            setChecked={setChallengeChecked}
            correct={challengeCorrect}
            act={act}
          />
        </section>
      </main>
      <nav className="mag10043-adjacent">
        <Link to="/lessons/school/class-9/class-9-real-numbers-rational-and-irrational-classification">
          <ArrowLeft />
          <span>
            <small>Previous</small>Rational and Irrational Classification
          </span>
        </Link>
        <Link to="/lessons/school/class-9/class-9-real-numbers-rationalisation-of-denominators">
          <span>
            <small>Next</small>Rationalisation of Denominators
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function NumberLine({
  level,
  parent,
  interval,
  value,
  digit,
  showTarget,
}: {
  level: number;
  parent: { lower: number; upper: number; width: number };
  interval: { lower: number; upper: number; width: number };
  value: number;
  digit?: number;
  showTarget: boolean;
}) {
  const divisions = level === 0 ? 6 : 10;
  const places = level === 0 ? 1 : level;
  const targetRatio = ((value - parent.lower) / parent.width) * 100;
  const selectionLeft = ((interval.lower - parent.lower) / parent.width) * 100;
  const selectionWidth = (interval.width / parent.width) * 100;
  return (
    <article className="mag-line">
      <h3>{level === 0 ? "Overview (level 0)" : `Level ${level} (×10)`}</h3>
      <div className="mag-axis">
        <em
          style={{ left: `${selectionLeft}%`, width: `${selectionWidth}%` }}
        />
        {Array.from({ length: divisions + 1 }, (_, i) => (
          <span key={i} style={{ left: `${(i / divisions) * 100}%` }}>
            <i />
            {fixed(parent.lower + (parent.width * i) / divisions, places)}
          </span>
        ))}
        {showTarget && targetRatio >= 0 && targetRatio <= 100 ? (
          <b style={{ left: `${targetRatio}%` }} />
        ) : null}
      </div>
      {level ? (
        <footer>
          <span>
            Interval: [{fixed(interval.lower, level)},{" "}
            {fixed(interval.upper, level)})
          </span>
          <span>Width: {interval.width}</span>
          <b>Digit used: {digit}</b>
        </footer>
      ) : null}
    </article>
  );
}

function Challenge({
  digits,
  setDigits,
  checked,
  setChecked,
  correct,
  act,
}: {
  digits: string[];
  setDigits: (d: string[]) => void;
  checked: boolean;
  setChecked: (v: boolean) => void;
  correct: boolean;
  act: (fn: () => void) => void;
}) {
  return (
    <article className="mag-challenge">
      <h2>Challenge: Trap √3 within width 0.001</h2>
      <p>√3 ≈ 1.73205080…</p>
      <p>Zoom three levels to get an interval of width 0.001.</p>
      <div>
        <b>Your digits:</b>
        {digits.map((value, index) => (
          <input
            key={index}
            aria-label={`Challenge digit ${index + 1}`}
            value={value}
            maxLength={1}
            inputMode="numeric"
            onChange={(e) =>
              act(() => {
                const next = [...digits];
                next[index] = e.target.value.replace(/\D/g, "");
                setDigits(next);
                setChecked(false);
              })
            }
          />
        ))}
        <button onClick={() => act(() => setChecked(true))}>Check</button>
      </div>
      <p>
        <b>Tip:</b> First digit is 7.
      </p>
      <footer>
        🏆 Goal: Get width = 0.001{" "}
        {checked ? (
          <span className={correct ? "correct" : "retry"}>
            {correct ? (
              <>
                <Check /> √3 ∈ [1.732, 1.733)
              </>
            ) : (
              "Check each successive digit."
            )}
          </span>
        ) : null}
      </footer>
    </article>
  );
}
