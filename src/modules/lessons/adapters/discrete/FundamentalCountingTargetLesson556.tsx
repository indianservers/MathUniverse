import { Footprints, Minus, Plus, Shirt, Utensils } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "../geometry3d/CoordinateSystemTargetLesson378.css";
import "./FundamentalCountingTargetLesson556.css";

const colors = ["#1677d2", "#20a46b", "#e9483e", "#8c53d6", "#e5a52c"],
  fix = (n: number) => Math.max(1, Math.min(5, n));
export default function FundamentalCountingTargetLesson556({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [tops, setTops] = useState(3),
    [pants, setPants] = useState(2),
    [shoes, setShoes] = useState(2),
    [tab, setTab] = useState("Interact"),
    [selected, setSelected] = useState([0, 0, 0]),
    [meal, setMeal] = useState([2, 3, 2]),
    [answer, setAnswer] = useState(""),
    [graded, setGraded] = useState(false),
    [actions, setActions] = useState(0),
    total = tops * pants * shoes,
    mealTotal = meal.reduce((a, b) => a * b, 1),
    correct = graded && Number(answer) === mealTotal,
    act = (f: () => void) => {
      f();
      setActions((n) => n + 1);
      onInteraction();
    },
    reset = () => {
      setTops(3);
      setPants(2);
      setShoes(2);
      setTab("Interact");
      setSelected([0, 0, 0]);
      setMeal([2, 3, 2]);
      setAnswer("");
      setGraded(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const paths = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => [
        Math.floor(i / (pants * shoes)),
        Math.floor(i / shoes) % pants,
        i % shoes,
      ]),
    [pants, shoes, total],
  );
  const change = (setter: (n: number) => void, value: number) =>
    act(() => setter(fix(value)));
  return (
    <section
      className="cs378-page fcp556-page"
      data-testid="discrete-mockup-0613"
      data-object-model="dedicated-three-stage-cartesian-product-wardrobe-tree-selectable-path-live-product-meal-practice"
      data-direct-interaction="true"
      data-tops={tops}
      data-pants={pants}
      data-shoes={shoes}
      data-total={total}
      data-selected={selected.join("-")}
      data-meal={meal.join("-")}
      data-meal-total={mealTotal}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="fcp556-hero">
        <small>DISCRETE AND APPLIED MATHEMATICS</small>
        <small>DISCRETE MATH LAB</small>
        <h1>Fundamental Counting Principle</h1>
        <p>Count sequential choices using the product rule.</p>
        <div>
          <span>Level: Intermediate-Advanced</span>
          <span>Time: 6-10 min</span>
          <span>Topics: Counting, Product Rule, Trees</span>
          <span>Prerequisites: Basic Addition</span>
        </div>
      </header>
      <nav className="fcp556-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="fcp556-lab">
        <article className="fcp556-observe">
          <h2>
            <i>1</i> OBSERVE
          </h2>
          <p>A counting tree shows all outfit choices.</p>
          <Tree
            tops={tops}
            pants={pants}
            paths={paths}
            selected={selected}
            onSelect={(p) => act(() => setSelected(p))}
          />
          <div className="fcp556-product">
            <span>Choices per stage</span>
            <span>Total combinations</span>
            <output>
              {tops} × {pants} × {shoes} = <b>{total}</b>
            </output>
            <strong>All possible outfits: {total}</strong>
          </div>
        </article>
        <article className="fcp556-manip">
          <h2>
            <i>2</i> MANIPULATE
          </h2>
          <p>Add options and watch the counts multiply.</p>
          <Stepper
            icon={<Shirt />}
            name="Tops"
            value={tops}
            set={(v) => change(setTops, v)}
          />
          <Stepper
            icon={<Shirt />}
            name="Pants"
            value={pants}
            set={(v) => change(setPants, v)}
          />
          <Stepper
            icon={<Footprints />}
            name="Shoes"
            value={shoes}
            set={(v) => change(setShoes, v)}
          />
          <div className="fcp556-live">
            <b>Live count (Product)</b>
            <output>
              {tops} × {pants} × {shoes} = <strong>{total}</strong>
            </output>
          </div>
          <div className="fcp556-cases">
            <aside>
              <b>Additive case (OR)</b>
              <output>
                {tops}+{pants}={tops + pants}
              </output>
              <p>Not sequential choices</p>
            </aside>
            <aside>
              <b>Multiplicative case (AND)</b>
              <output>
                {tops}×{pants}×{shoes}={total}
              </output>
              <p>Sequential choices</p>
            </aside>
          </div>
        </article>
      </section>
      <section className="fcp556-theory">
        <article>
          <h2>
            <i>3</i> NOTICE THE PATTERN
          </h2>
          <p>Each new stage multiplies the total.</p>
          <table>
            <tbody>
              <tr>
                <th>Stages</th>
                <th>Total combinations</th>
              </tr>
              <tr>
                <td>1 (Tops)</td>
                <td>{tops}</td>
              </tr>
              <tr>
                <td>2 (Tops × Pants)</td>
                <td>
                  {tops} × {pants} = {tops * pants}
                </td>
              </tr>
              <tr>
                <td>3 (Tops × Pants × Shoes)</td>
                <td>
                  {tops} × {pants} × {shoes} = {total}
                </td>
              </tr>
            </tbody>
          </table>
        </article>
        <article>
          <h2>
            <i>4</i> UNDERSTAND THE RULE
          </h2>
          <b>Product Rule (Fundamental Counting Principle)</b>
          <p>
            If a task can be done in k stages, with n₁,n₂,...,nₖ choices at each
            stage, then the total number of ways is
          </p>
          <output>n₁ × n₂ × ... × nₖ</output>
          <aside>
            Definition: A stage is a single choice; the next choice depends on
            completing the previous stage.
          </aside>
        </article>
        <article>
          <h2>
            <i>5</i> COMMON MISCONCEPTION
          </h2>
          <p>Do not add when choices happen one after another.</p>
          <div className="wrong">
            Wrong: {tops}+{pants}+{shoes}={tops + pants + shoes}
          </div>
          <div className="right">
            Right: {tops}×{pants}×{shoes}={total}
          </div>
        </article>
      </section>
      <section className="fcp556-practice">
        <div>
          <h2>
            <i>6</i> TRY INDEPENDENTLY
          </h2>
          <p>
            A meal has {meal[0]} starters, {meal[1]} main courses, and {meal[2]}{" "}
            desserts.
          </p>
          <b>How many different meal combinations are possible?</b>
        </div>
        {["Starters", "Mains", "Desserts"].map((name, i) => (
          <Stepper
            key={name}
            icon={<Utensils />}
            name={name}
            value={meal[i]}
            set={(v) =>
              act(() => {
                const next = [...meal];
                next[i] = fix(v);
                setMeal(next);
                setGraded(false);
              })
            }
          />
        ))}
        <label>
          Your answer
          <input
            aria-label="Meal combinations answer"
            type="number"
            value={answer}
            onChange={(e) =>
              act(() => {
                setAnswer(e.target.value);
                setGraded(false);
              })
            }
          />
          <button onClick={() => act(() => setGraded(true))}>
            Check Answer
          </button>
        </label>
        <aside>
          <b>Solution</b>
          <output>
            {meal.join(" × ")} = {mealTotal}
          </output>
          {graded && (
            <strong className={correct ? "correct" : "wrong"}>
              {correct ? "Correct" : "Try multiplying every stage."}
            </strong>
          )}
        </aside>
      </section>
      <nav className="fcp556-adjacent">
        <button>
          Previous Lesson
          <br />
          <b>555 Addition Rule</b>
        </button>
        <button>
          Next Lesson
          <br />
          <b>557 Factorials</b>
        </button>
      </nav>
    </section>
  );
}
function Stepper({
  icon,
  name,
  value,
  set,
}: {
  icon: React.ReactNode;
  name: string;
  value: number;
  set: (n: number) => void;
}) {
  return (
    <div className="fcp556-stepper">
      <i>{icon}</i>
      <b>{name}</b>
      <button aria-label={`Decrease ${name}`} onClick={() => set(value - 1)}>
        <Minus />
      </button>
      <output>{value}</output>
      <button aria-label={`Increase ${name}`} onClick={() => set(value + 1)}>
        <Plus />
      </button>
    </div>
  );
}
function Tree({
  tops,
  pants,
  paths,
  selected,
  onSelect,
}: {
  tops: number;
  pants: number;
  paths: number[][];
  selected: number[];
  onSelect: (p: number[]) => void;
}) {
  return (
    <div className="fcp556-tree">
      <div className="tops">
        {Array.from({ length: tops }, (_, i) => (
          <span key={i} style={{ color: colors[i] }}>
            <Shirt />
            Top {i + 1}
          </span>
        ))}
      </div>
      <div className="pants">
        {Array.from({ length: tops * pants }, (_, i) => (
          <span key={i}>▯</span>
        ))}
      </div>
      <div className="shoes">
        {paths.map((path, i) => (
          <button
            key={i}
            className={selected.join() === path.join() ? "active" : ""}
            onClick={() => onSelect(path)}
            aria-label={`Outfit ${path.map((n) => n + 1).join("-")}`}
          >
            <Footprints />
          </button>
        ))}
      </div>
      <small>
        Selected outfit: top {selected[0] + 1}, pants {selected[1] + 1}, shoes{" "}
        {selected[2] + 1}
      </small>
    </div>
  );
}
