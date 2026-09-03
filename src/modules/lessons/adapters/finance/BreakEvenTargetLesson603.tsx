import { Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./BreakEvenTargetLesson603.css";

const cash = (value: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);

export default function BreakEvenTargetLesson603({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [fixed, setFixed] = useState(50000);
  const [variable, setVariable] = useState(400);
  const [price, setPrice] = useState(900);
  const [quantity, setQuantity] = useState(100);
  const [tab, setTab] = useState("Interact");
  const [answer, setAnswer] = useState("");
  const [graded, setGraded] = useState<boolean | null>(null);
  const [hint, setHint] = useState(false);
  const [actions, setActions] = useState(0);
  const reset = () => {
    setFixed(50000);
    setVariable(400);
    setPrice(900);
    setQuantity(100);
    setTab("Interact");
    setAnswer("");
    setGraded(null);
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (update: () => void) => {
    update();
    setActions((value) => value + 1);
    onInteraction();
  };
  const cm = price - variable;
  const valid = cm > 0;
  const breakEven = valid ? fixed / cm : Infinity;
  const breakEvenUnits = valid ? Math.ceil(breakEven) : 0;
  const breakEvenSales = valid ? breakEven * price : 0;
  const revenue = price * quantity;
  const totalCost = fixed + variable * quantity;
  const profit = revenue - totalCost;
  const contribution = cm * quantity;
  const marginSafety = Math.max(0, revenue - breakEvenSales);
  const chartMaximum = Math.max(140000, price * 250, fixed + variable * 250);
  const x = (units: number) => 55 + (units / 250) * 555;
  const y = (amount: number) => 255 - (amount / chartMaximum) * 205;
  const check = () =>
    act(() => setGraded(Math.abs(Number(answer) - 178) < 0.01));

  return (
    <section
      className="be603-page"
      data-testid="finance-mockup-0660"
      data-object-model="dedicated-cost-revenue-break-even-intersection-model"
      data-fixed={fixed}
      data-variable={variable}
      data-price={price}
      data-quantity={quantity}
      data-revenue={revenue}
      data-cost={totalCost}
      data-profit={profit}
      data-cm={cm}
      data-be={Number.isFinite(breakEven) ? breakEven.toFixed(2) : ""}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="be603-hero">
        <main>
          <span>
            <b>DISCRETE AND APPLIED MATHEMATICS</b>
            <b>FINANCIAL MATHEMATICS AND MODELLING</b>
          </span>
          <h1>Break-Even Analysis</h1>
          <p>
            <b>Objective:</b> Find the break-even quantity and
            total-cost-revenue equality.
          </p>
          <dl>
            <b>Level: Intermediate-Advanced</b>
            <b>Room: Applied Modelling Lab</b>
            <b>Medium: Graphing / Spreadsheet / CAS</b>
            <b>Time: 6-10 min</b>
          </dl>
        </main>
        <aside>
          <b>Lesson code</b>
          <br />
          603-BEA
          <p>
            <b>Topics</b>
            <br />
            Break-even point, Cost &amp; Revenue, Contribution margin
          </p>
          <svg viewBox="0 0 80 50" aria-label="Cost and revenue icon">
            <line x1="8" y1="44" x2="70" y2="44" />
            <line x1="8" y1="44" x2="8" y2="5" />
            <line className="revenue" x1="8" y1="44" x2="65" y2="7" />
            <line className="cost" x1="8" y1="30" x2="65" y2="12" />
          </svg>
        </aside>
      </header>
      <nav className="be603-tabs">
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
      {tab !== "Interact" && (
        <p className="be603-note">
          <b>{tab}:</b> Break-even occurs where total revenue equals fixed cost
          plus variable cost.
        </p>
      )}

      <section className="be603-body">
        <main>
          <section className="be603-chart">
            <header>
              <div>
                <h2>1 Observe &amp; Manipulate</h2>
                <p>
                  Drag the quantity or adjust the controls. Watch the lines and
                  values update.
                </p>
              </div>
              <button onClick={() => act(reset)}>
                <RotateCcw /> Reset All
              </button>
            </header>
            <div>
              <h3>Cost and Revenue vs Quantity</h3>
              <svg
                viewBox="0 0 650 285"
                role="img"
                aria-label="Break-even cost and revenue graph"
              >
                {[55, 166, 277, 388, 499, 610].map((position, index) => (
                  <g key={`x-${position}`} className="grid">
                    <line x1={position} x2={position} y1="35" y2="255" />
                    <text x={position - 5} y="273">
                      {index * 50}
                    </text>
                  </g>
                ))}
                {[50, 91, 132, 173, 214, 255].map((position, index) => (
                  <g key={`y-${position}`} className="grid">
                    <line x1="55" x2="610" y1={position} y2={position} />
                    <text x="12" y={position + 4}>
                      {cash((chartMaximum * (5 - index)) / 5)}
                    </text>
                  </g>
                ))}
                <g className="legend">
                  <line x1="100" x2="128" y1="18" y2="18" />
                  <text x="134" y="22">
                    Total Revenue (TR)
                  </text>
                  <line className="cost" x1="255" x2="283" y1="18" y2="18" />
                  <text x="289" y="22">
                    Total Cost (TC)
                  </text>
                  <line className="fixed" x1="400" x2="428" y1="18" y2="18" />
                  <text x="434" y="22">
                    Fixed Cost (FC)
                  </text>
                </g>
                <line x1="55" x2="610" y1="255" y2="255" />
                <line x1="55" x2="55" y1="35" y2="255" />
                <line
                  className="fixed"
                  x1="55"
                  x2="610"
                  y1={y(fixed)}
                  y2={y(fixed)}
                />
                <line
                  className="revenue"
                  x1="55"
                  y1="255"
                  x2="610"
                  y2={y(price * 250)}
                />
                <line
                  className="cost"
                  x1="55"
                  y1={y(fixed)}
                  x2="610"
                  y2={y(fixed + variable * 250)}
                />
                {valid && breakEven <= 250 && (
                  <g>
                    <line
                      className="marker"
                      x1={x(breakEven)}
                      x2={x(breakEven)}
                      y1={y(breakEvenSales)}
                      y2="255"
                    />
                    <circle cx={x(breakEven)} cy={y(breakEvenSales)} r="7" />
                    <text x={x(breakEven) - 55} y={y(breakEvenSales) - 18}>
                      Break-even point
                    </text>
                    <text x={x(breakEven) - 55} y={y(breakEvenSales) - 5}>
                      ({breakEven.toFixed(0)}, Rs {cash(breakEvenSales)})
                    </text>
                  </g>
                )}
              </svg>
              <label>
                Quantity (units)<b>{quantity}</b>
                <span>
                  0
                  <input
                    aria-label="Quantity slider"
                    type="range"
                    min="0"
                    max="250"
                    step="1"
                    value={quantity}
                    onChange={(event) =>
                      act(() => setQuantity(+event.target.value))
                    }
                  />
                  250
                </span>
              </label>
            </div>
            <dl className="be603-readouts">
              <span>
                TR (Rs)<b>{cash(revenue)}</b>
              </span>
              <span>
                TC (Rs)<b>{cash(totalCost)}</b>
              </span>
              <span>
                Profit / (Loss) (Rs)<b>{cash(profit)}</b>
              </span>
              <span>
                Contribution Margin (Rs)<b>{cash(contribution)}</b>
              </span>
              <span>
                CM / unit (Rs)<b>{cash(cm)}</b>
              </span>
            </dl>
            <footer>
              Break-even:{" "}
              <b>
                TR = TC at Q = {valid ? breakEven.toFixed(0) : "undefined"}{" "}
                units and Rs {valid ? cash(breakEvenSales) : "-"}
              </b>
            </footer>
          </section>
          <section className="be603-controls">
            <header>
              <h2>2 Manipulate the model</h2>
              <p>Adjust the assumptions and see immediate results.</p>
            </header>
            <Control
              label="Fixed cost (Rs)"
              value={fixed}
              min={0}
              max={200000}
              step={1000}
              onChange={(value) => act(() => setFixed(value))}
            />
            <Control
              label="Variable cost per unit (Rs)"
              value={variable}
              min={0}
              max={2000}
              step={10}
              onChange={(value) =>
                act(() => setVariable(Math.min(value, price - 1)))
              }
            />
            <Control
              label="Selling price per unit (Rs)"
              value={price}
              min={1}
              max={5000}
              step={10}
              onChange={(value) =>
                act(() => setPrice(Math.max(value, variable + 1)))
              }
            />
            <dl>
              <span>
                CM per unit (Rs)<b>{cash(cm)}</b>
              </span>
              <span>
                CM ratio
                <b>{valid ? ((cm / price) * 100).toFixed(2) : "0.00"}%</b>
              </span>
              <span>
                BEP (units)<b>{valid ? breakEvenUnits : "-"}</b>
              </span>
              <span>
                BEP (Rs)<b>{valid ? cash(breakEvenSales) : "-"}</b>
              </span>
              <span>
                Margin of Safety (Rs)<b>{cash(marginSafety)}</b>
                <small>
                  ({(revenue ? (marginSafety / revenue) * 100 : 0).toFixed(1)}%)
                </small>
              </span>
            </dl>
            <footer>
              CM = SP - VC = {cash(price)} - {cash(variable)} = Rs {cash(cm)} |
              CM ratio = CM / SP | MOS = TR - Break-even sales
            </footer>
          </section>
        </main>
        <aside>
          <article>
            <h2>3 Notice the pattern</h2>
            <p>
              At break-even, the Revenue line intersects the Total Cost line.
            </p>
            <p>
              Left of the intersection: TC &gt; TR (loss). Right of it: TR &gt;
              TC (profit).
            </p>
            <p>Increasing fixed cost shifts the break-even right.</p>
            <p>Higher selling price or lower variable cost shifts it left.</p>
          </article>
          <article>
            <h2>4 Understand the rule</h2>
            <p>
              <b>Key Rule (Break-Even)</b>
              <br />
              TR = TC
              <br />
              SP x Q = FC + VC x Q
            </p>
            <strong>
              Q<sub>BE</sub> = FC / (SP - VC)
            </strong>
            <p>
              <b>Definitions</b>
              <br />
              FC: Total fixed cost
              <br />
              VC: Variable cost per unit
              <br />
              SP: Selling price per unit
              <br />Q<sub>BE</sub>: Break-even quantity
              <br />
              CM = SP - VC
            </p>
            <aside>
              <b>Common misconception</b>
              <br />
              Confusing profit = 0 with cost = 0. At break-even, both cost and
              revenue are positive and equal.
            </aside>
          </article>
          <article>
            <h2>Worked Example</h2>
            <p>
              A product has FC = Rs 50,000, VC = Rs 400 per unit and SP = Rs 900
              per unit.
            </p>
            <p>
              <b>Solution</b>
              <br />
              CM per unit = Rs 500
              <br />Q<sub>BE</sub> = 50,000 / 500 = 100 units
              <br />
              Break-even sales = 900 x 100 = Rs 90,000
            </p>
            <aside>
              Matches the interactive model <Check />
            </aside>
          </article>
        </aside>
      </section>

      <section className="be603-challenge">
        <div>
          <h2>5 Try independently</h2>
          <p>
            <b>Challenge:</b> If FC = Rs 80,000, VC = Rs 300 per unit and SP =
            Rs 750 per unit, what is the break-even quantity?
          </p>
          <label>
            <input
              aria-label="Break-even challenge answer"
              placeholder="Enter your answer (units)"
              value={answer}
              onChange={(event) =>
                act(() => {
                  setAnswer(event.target.value);
                  setGraded(null);
                })
              }
            />
            <button onClick={check}>Check Answer</button>
          </label>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? "Correct: 178 units after rounding up."
                : "Use FC / (SP - VC)."}
          </output>
        </div>
        <button onClick={() => act(() => setHint((value) => !value))}>
          Show Hint
        </button>
        <aside>
          <b>Quick check {hint ? "" : "(hidden)"}</b>
          {hint && (
            <p>
              Q<sub>BE</sub> = 80,000 / (750 - 300) = 177.78, so 178 units
            </p>
          )}
        </aside>
      </section>
      <nav className="be603-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/602-profit-loss-markup-and-margin">
          &larr;{" "}
          <span>
            Previous Lesson<b>Profit, Loss, Markup and Margin</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/604-tax-and-discounts">
          <span>
            Next Lesson<b>Tax and Discounts</b>
          </span>{" "}
          &rarr;
        </a>
      </nav>
    </section>
  );
}

function Control({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="be603-control">
      <b>{label}</b>
      <span>
        {min}
        <input
          aria-label={`${label} slider`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
        {max.toLocaleString()}
        <input
          aria-label={label}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
      </span>
    </label>
  );
}
