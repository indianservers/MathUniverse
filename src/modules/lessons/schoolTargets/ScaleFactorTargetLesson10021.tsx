import { CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ScaleFactorTargetLesson10021.css";

const ingredients = [
  ["Flour", 2, "cups"],
  ["Sugar", 1, "cup"],
  ["Milk", 1.5, "cups"],
  ["Butter", 0.5, "cup"],
] as const;
const factors = [0.5, 1, 1.5, 2, 2.5, 3, 4];
const fixed = (value: number) => value.toFixed(2);

export default function ScaleFactorTargetLesson10021({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [factor, setFactor] = useState(2.5);
  const [mapLength, setMapLength] = useState(4);
  const [tab, setTab] = useState("Interact");
  const [answers, setAnswers] = useState({ distance: "262.5", rice: "2.625" });
  const [graded, setGraded] = useState<"idle" | "correct" | "wrong">("correct");
  const [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
  };
  const scaledMap = mapLength * factor;
  const distance = scaledMap * 50;
  const servings = 4 * factor;
  const mode =
    factor > 1 ? "Enlargement" : factor < 1 ? "Reduction" : "No change";
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const updateFactor = (value: number) =>
    act(() => {
      setFactor(Math.min(4, Math.max(0.5, value)));
      setGraded("idle");
    });
  const reset = () =>
    act(() => {
      setFactor(2.5);
      setMapLength(4);
      setAnswers({ distance: "262.5", rice: "2.625" });
      setGraded("correct");
    });
  const check = () =>
    act(() =>
      setGraded(
        Math.abs(Number(answers.distance) - 262.5) < 0.001 &&
          Math.abs(Number(answers.rice) - 2.625) < 0.001
          ? "correct"
          : "wrong",
      ),
    );
  return (
    <section
      className="sf10021-page"
      data-testid="school-mockup-0695"
      data-object-model="dedicated-shared-scale-factor-map-distance-recipe-quantity-proportion-table"
      data-factor={factor.toFixed(2)}
      data-map-length={scaledMap.toFixed(2)}
      data-distance={distance.toFixed(0)}
      data-servings={servings.toFixed(0)}
      data-mode={mode}
      data-graded={graded}
      data-actions={actions}
    >
      <header className="sf10021-hero">
        <h1>
          Scale Factor in Maps and Recipes{" "}
          <small>→ Class 7 · Applied Arithmetic</small>
        </h1>
        <b>Class 7 · Applied Arithmetic</b>
        <p>
          <strong>Objective:</strong> Understand scale factor as a common
          multiplier that scales lengths and quantities proportionally.
        </p>
        <dl>
          <span>
            ♧
            <b>
              Level<small>Foundation</small>
            </b>
          </span>
          <span>
            ▤
            <b>
              Type<small>Concept Lab</small>
            </b>
          </span>
          <span>
            ◷
            <b>
              Time<small>18 min</small>
            </b>
          </span>
          <span>
            ⌘
            <b>
              Term<small>1</small>
            </b>
          </span>
          <span>
            ◇
            <b>
              Tags<small>Scale, Ratio, Maps, Recipes</small>
            </b>
          </span>
        </dl>
      </header>
      <nav className="sf10021-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (item) => (
            <button
              className={tab === item ? "active" : ""}
              onClick={() => act(() => setTab(item))}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </nav>
      <section className="sf10021-lab">
        <header>
          <h2>Scale Factor Lab: Map ↔ Recipe</h2>
          <button onClick={reset}>
            <RotateCcw />
            Reset Lab
          </button>
        </header>
        <section className="sf10021-workspace">
          <article className="sf10021-map">
            <h2>▱ Map (Length)</h2>
            <p>
              <b>Map scale:</b> 1 cm on map represents 50 km in real life.
            </p>
            <h3>Map segment AB</h3>
            <div className="sf10021-mapart">
              <svg
                viewBox="0 0 240 120"
                role="img"
                aria-label="Map segment from A to B"
              >
                <path d="M0 86C45 60 63 96 104 61S179 29 240 40" />
                <path d="M8 29C61 45 91 23 136 35s63 51 97 41" />
                <line
                  x1="42"
                  y1="78"
                  x2={42 + Math.min(170, scaledMap * 30)}
                  y2="42"
                />
                <circle cx="42" cy="78" r="5" />
                <circle cx={42 + Math.min(170, scaledMap * 30)} cy="42" r="5" />
                <text x="34" y="68">
                  A
                </text>
                <text x={48 + Math.min(170, scaledMap * 30)} y="35">
                  B
                </text>
              </svg>
            </div>
            <h3>Map ruler (cm)</h3>
            <div className="sf10021-ruler">
              {Array.from({ length: 11 }, (_, i) => (
                <span key={i}>{i}</span>
              ))}
            </div>
            <label>
              Map length (cm)
              <input
                aria-label="Base map length"
                type="number"
                min="1"
                max="10"
                step="0.5"
                value={mapLength}
                onChange={(e) =>
                  act(() => {
                    setMapLength(Math.max(0, Number(e.target.value)));
                    setGraded("idle");
                  })
                }
              />
            </label>
            <aside>
              Real distance<strong>{distance.toFixed(0)} km</strong>
              <b>= {fixed(scaledMap)} cm × 50 km/cm</b>
            </aside>
          </article>
          <article className="sf10021-factor">
            <p>
              Scale factor
              <br />
              (common multiplier)
            </p>
            <i>k</i>
            <input
              aria-label="Scale factor value"
              type="number"
              min="0.5"
              max="4"
              step="0.25"
              value={factor}
              onChange={(e) => updateFactor(Number(e.target.value))}
            />
            <input
              aria-label="Scale factor"
              type="range"
              min="0.5"
              max="4"
              step="0.25"
              value={factor}
              onChange={(e) => updateFactor(Number(e.target.value))}
            />
            <strong>
              {mode}
              <small>(k {factor > 1 ? ">" : factor < 1 ? "<" : "="} 1)</small>
            </strong>
            <p>This single factor scales lengths and quantities.</p>
            <button
              onClick={() => updateFactor(factor === 4 ? 0.5 : factor + 0.5)}
            >
              How it works ⓘ
            </button>
          </article>
          <article className="sf10021-recipe">
            <h2>♣ Recipe (Quantity)</h2>
            <h3>Base recipe (serves 4 people)</h3>
            <table>
              <tbody>
                {ingredients.map(([name, value, unit]) => (
                  <tr key={name}>
                    <th>{name}</th>
                    <td>{fixed(value)}</td>
                    <td>{unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3>Scaled recipe (serves k × 4 = {servings.toFixed(0)} people)</h3>
            <table>
              <tbody>
                {ingredients.map(([name, value, unit]) => (
                  <tr key={name}>
                    <th>{name}</th>
                    <td>{fixed(value * factor)}</td>
                    <td>{unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <aside>
              All quantities multiplied by <i>k</i> = {fixed(factor)}
            </aside>
          </article>
        </section>
      </section>
      <section className="sf10021-table">
        <h2>Proportional Relationship Table</h2>
        <table>
          <tbody>
            <tr>
              <th>Scale factor (k)</th>
              {factors.map((k) => (
                <td className={k === factor ? "active" : ""} key={k}>
                  {fixed(k)}
                </td>
              ))}
            </tr>
            <tr>
              <th>Map length (cm)</th>
              {factors.map((k) => (
                <td className={k === factor ? "active" : ""} key={k}>
                  {fixed(mapLength * k)}
                </td>
              ))}
            </tr>
            <tr>
              <th>Real distance (km)</th>
              {factors.map((k) => (
                <td className={k === factor ? "active" : ""} key={k}>
                  {mapLength * k * 50}
                </td>
              ))}
            </tr>
            <tr>
              <th>Flour (cups)</th>
              {factors.map((k) => (
                <td className={k === factor ? "active" : ""} key={k}>
                  {fixed(2 * k)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p>⌾ Every value is k times the base (k = 1) value.</p>
      </section>
      <section className="sf10021-readouts">
        <h2>
          Real-World Readouts (for <i>k</i> = {fixed(factor)})
        </h2>
        <div>
          <article>
            <b>Map Result</b>
            <p>
              Map length = {fixed(scaledMap)} cm
              <br />
              Real distance = {distance.toFixed(0)} km
            </p>
          </article>
          <article>
            <b>Recipe Result</b>
            <p>
              Servings = {servings.toFixed(0)} people
              <br />
              Flour = {fixed(2 * factor)} cups, Sugar = {fixed(factor)} cups,
              Milk = {fixed(1.5 * factor)} cups, Butter = {fixed(0.5 * factor)}{" "}
              cups
            </p>
          </article>
        </div>
      </section>
      <section className="sf10021-theory">
        <article>
          <h2>Notice the Pattern</h2>
          <p>When the scale factor k changes:</p>
          {[
            "Map length and real distance change by the same factor.",
            "All recipe quantities change by the same factor.",
            "The ratios stay the same.",
          ].map((x) => (
            <span key={x}>
              <CheckCircle2 />
              {x}
            </span>
          ))}
          <aside>
            <b>Example check (k = {fixed(factor)}):</b>
            <br />
            {distance.toFixed(0)} km / 200 km = {fixed(factor)}
            <br />
            {fixed(2 * factor)} cups / 2.00 cups = {fixed(factor)}
          </aside>
        </article>
        <article>
          <h2>Understand the Rule</h2>
          <h3>A scale factor k multiplies every length or quantity.</h3>
          <p>For any length L:</p>
          <strong>Scaled length = k × L</strong>
          <p>For any quantity Q:</p>
          <strong>Scaled quantity = k × Q</strong>
          <p>
            k &gt; 1 → enlargement
            <br />0 &lt; k &lt; 1 → reduction
            <br />k = 1 → no change
          </p>
        </article>
        <article>
          <section>
            <h2>⚠ Common Misconception</h2>
            <h3>Adding or subtracting instead of multiplying.</h3>
            <aside>
              Wrong: 2.00 cups + 2.50 = 4.50 cups
              <br />
              <b>Correct: 2.00 cups × 2.50 = 5.00 cups</b>
            </aside>
          </section>
          <section>
            <h2>♧ Remember</h2>
            <h3>
              Use the same multiplicative factor for all related lengths or
              quantities.
            </h3>
          </section>
        </article>
      </section>
      <section className="sf10021-challenge">
        <article>
          <h2>◎ Quick Challenge</h2>
          <p>
            Map scale: 1 cm represents 25 km.
            <br />A road on the map is 6.0 cm long.
            <br />A recipe for 3 people uses 1.50 cups of rice.
            <br />
            If k = 1.75, find the real distance and the rice needed for k × 3
            people.
          </p>
        </article>
        <article>
          <h2>Your Answer</h2>
          <label>
            Real distance (km)
            <input
              aria-label="Challenge distance"
              value={answers.distance}
              onChange={(e) => {
                setAnswers((current) => ({
                  ...current,
                  distance: e.target.value,
                }));
                setGraded("idle");
              }}
            />
          </label>
          <label>
            Rice (cups)
            <input
              aria-label="Challenge rice"
              value={answers.rice}
              onChange={(e) => {
                setAnswers((current) => ({
                  ...current,
                  rice: e.target.value,
                }));
                setGraded("idle");
              }}
            />
          </label>
          <button aria-label="Check scale challenge" onClick={check}>
            Check
          </button>
        </article>
        <aside className={graded}>
          <h2>
            {graded === "correct"
              ? "Correct!"
              : graded === "wrong"
                ? "Try again"
                : "Ready to check"}
          </h2>
          <p>Real distance = 6.0 cm × 25 km/cm × 1.75 = 262.5 km</p>
          <p>Rice = 1.50 cups × 1.75 = 2.625 cups</p>
        </aside>
      </section>
      <nav className="sf10021-adjacent">
        <Link to={prev.route}>
          ←
          <span>
            Previous Lesson<b>Household Budget Arithmetic</b>
          </span>
        </Link>
        <i>
          ● ○ ○ ○ ○ ○<small>Lesson 3 of 6</small>
        </i>
        <Link to={next.route}>
          <span>
            Next Lesson<b>Unit Conversion in Recipes and Maps</b>
          </span>
          →
        </Link>
      </nav>
    </section>
  );
}
