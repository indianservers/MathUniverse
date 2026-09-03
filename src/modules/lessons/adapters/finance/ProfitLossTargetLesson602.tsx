import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ProfitLossTargetLesson602.css";
const cash = (v: number, d = 0) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(v),
  pct = (v: number) => `${v >= 0 ? "" : "−"}${Math.abs(v).toFixed(2)}%`;
export default function ProfitLossTargetLesson602({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const cost = 800,
    [selling, setSelling] = useState(1100),
    [display, setDisplay] = useState<"profit" | "loss">("profit"),
    [tab, setTab] = useState("Interact"),
    [answers, setAnswers] = useState(["", "", ""]),
    [graded, setGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setSelling(1100);
    setDisplay("profit");
    setTab("Interact");
    setAnswers(["", "", ""]);
    setGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const profit = selling - cost,
    markup = (profit / cost) * 100,
    margin = selling === 0 ? 0 : (profit / selling) * 100,
    samples = useMemo(
      () =>
        [600, 800, 1100, 1400, 1700].map((price) => ({
          price,
          profit: price - cost,
          markup: ((price - cost) / cost) * 100,
          margin: ((price - cost) / price) * 100,
        })),
      [],
    ),
    shown = display === "profit" ? profit : -profit,
    x = 130 + ((selling - 400) / 1600) * 440,
    y = 270 - (selling / 2000) * 205,
    setAnswer = (i: number, v: string) =>
      act(() => {
        const next = [...answers];
        next[i] = v;
        setAnswers(next);
        setGraded(null);
      }),
    check = () =>
      act(() =>
        setGraded(
          Math.abs(+answers[0] - 1140) < 0.01 &&
            Math.abs(+answers[1] - 190) < 0.01 &&
            Math.abs(+answers[2] - 16.67) < 0.02,
        ),
      );
  return (
    <section
      className="pl602-page"
      data-testid="finance-mockup-0659"
      data-object-model="dedicated-profit-markup-margin-pricing-model"
      data-cost={cost}
      data-selling={selling}
      data-profit={profit}
      data-markup={markup.toFixed(2)}
      data-margin={margin.toFixed(2)}
      data-display={display}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="pl602-hero">
        <span>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>FINANCIAL MATHEMATICS AND MODELLING</b>
        </span>
        <h1>Profit, Loss, Markup and Margin</h1>
        <p>
          <b>Objective:</b> Connect cost, selling price, profit/loss, markup and
          margin in a pricing model.
        </p>
        <dl>
          <b>
            Level
            <br />
            Intermediate-Advanced
          </b>
          <b>
            Lab
            <br />
            Interactive Modelling
          </b>
          <b>
            Skill
            <br />
            Business Mathematics
          </b>
          <b>
            Time
            <br />
            6-10 min
          </b>
        </dl>
      </header>
      <nav className="pl602-tabs">
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
        <p className="pl602-note">
          <b>{tab}:</b> Markup compares profit with cost; margin compares the
          same profit with selling price.
        </p>
      )}
      <section className="pl602-lab">
        <header>
          <h2>MANIPULATE THE MODEL</h2>
          <p>
            Drag the selling price to see how profit, loss, markup and margin
            change.
          </p>
          <aside>
            Drag the orange point
            <br />
            or adjust the slider.
          </aside>
        </header>
        <div>
          <main>
            <svg
              viewBox="0 0 650 300"
              role="img"
              aria-label="Cost and selling price model"
            >
              <line x1="70" x2="610" y1="270" y2="270" />
              <line x1="70" x2="70" y1="40" y2="270" />
              <line className="guide" x1="130" x2={x} y1={y} y2={y} />
              <line className="guide" x1={x} x2={x} y1={y} y2="270" />
              <circle
                className="cost"
                cx="130"
                cy={270 - (cost / 2000) * 205}
                r="10"
              />
              <circle className="selling" cx={x} cy={y} r="11" />
              <text x="115" y={250 - (cost / 2000) * 205}>
                Cost{` ₹${cost}`}
              </text>
              <text x={x + 8} y={y - 14}>
                Selling Price{` ₹${cash(selling)}`}
              </text>
              <text x="15" y="45">
                Price (₹)
              </text>
            </svg>
            <label>
              <b>
                Selling price (₹)<strong>{cash(selling)}</strong>
              </b>
              <span>
                400
                <input
                  aria-label="Selling price slider"
                  type="range"
                  min="400"
                  max="2000"
                  step="10"
                  value={selling}
                  onChange={(e) => act(() => setSelling(+e.target.value))}
                />
                2,000
              </span>
            </label>
            <footer>
              <button
                className={display === "loss" ? "active" : ""}
                onClick={() => act(() => setDisplay("loss"))}
              >
                Show as loss
              </button>
              <button
                className={display === "profit" ? "active" : ""}
                onClick={() => act(() => setDisplay("profit"))}
              >
                Show as profit
              </button>
            </footer>
          </main>
          <aside className="pl602-results">
            <h3>CURRENT RESULTS</h3>
            <p>
              Profit <small>(₹)</small>
              <b className={profit >= 0 ? "green" : "red"}>
                {shown >= 0 ? "+" : "−"}
                {cash(Math.abs(shown))}
              </b>
            </p>
            <p>
              Markup <small>(% of cost)</small>
              <b>{pct(markup)}</b>
            </p>
            <p>
              Margin <small>(% of selling price)</small>
              <b>{pct(margin)}</b>
            </p>
            <dl>
              <span>
                Cost<b>₹{cost}</b>
              </span>
              <span>
                Selling price<b>₹{cash(selling)}</b>
              </span>
              <span>
                {profit >= 0 ? "Profit" : "Loss"}
                <b>₹{cash(Math.abs(profit))}</b>
              </span>
            </dl>
            <aside>
              Markup compares profit to cost.
              <br />
              Margin compares profit to selling price.
            </aside>
          </aside>
        </div>
      </section>
      <section className="pl602-row">
        <article>
          <h3>NOTICE THE PATTERN</h3>
          <p>Try a few selling prices.</p>
          <table>
            <thead>
              <tr>
                <th>Selling Price (₹)</th>
                <th>Profit (₹)</th>
                <th>Markup (%)</th>
                <th>Margin (%)</th>
              </tr>
            </thead>
            <tbody>
              {samples.map((row) => (
                <tr
                  key={row.price}
                  className={row.price === selling ? "active" : ""}
                  onClick={() => act(() => setSelling(row.price))}
                >
                  <td>{cash(row.price)}</td>
                  <td>
                    {row.profit >= 0 ? "+" : "−"}
                    {cash(Math.abs(row.profit))}
                  </td>
                  <td>{pct(row.markup)}</td>
                  <td>{pct(row.margin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <aside>
            Notice: Margin is always smaller (in absolute value) than markup for
            the same profit or loss.
          </aside>
        </article>
        <article>
          <h3>UNDERSTAND THE RULE</h3>
          <p>
            Key definitions
            <br />
            Let C be cost, S be selling price, and P = S − C.
          </p>
          <strong>Profit (₹): P = S − C</strong>
          <strong>Markup (% of cost): 100 × P/C</strong>
          <strong>Margin (% of selling price): 100 × P/S</strong>
          <p>
            <b>Important:</b> Margin &lt; Markup when P &gt; 0.
          </p>
        </article>
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>Cost = ₹800, Selling price = ₹1,400</p>
          <dl>
            <span>
              Profit<b>P = 1,400 − 800 = ₹600</b>
            </span>
            <span>
              Markup<b>100 × 600/800 = 75%</b>
            </span>
            <span>
              Margin<b>100 × 600/1,400 = 42.86%</b>
            </span>
          </dl>
          <aside>
            <Check /> Check: Margin &lt; Markup.
          </aside>
        </article>
      </section>
      <section className="pl602-row pl602-lower">
        <article>
          <h3>KEY RULE / DEFINITION</h3>
          <p>
            <b>Profit, Markup and Margin</b>
          </p>
          <strong>P = S − C</strong>
          <strong>100 × (S − C)/C</strong>
          <strong>100 × (S − C)/S</strong>
          <aside>
            Use markup to compare against cost.
            <br />
            Use margin to compare against selling price.
          </aside>
        </article>
        <article>
          <h3>COMMON MISCONCEPTION</h3>
          <p>
            <b>Markup is not the same as Margin.</b>
          </p>
          <div>
            <span>
              Cost
              <br />
              <b>₹800</b>
            </span>
            → <b>+₹300</b> →
            <span>
              Selling Price
              <br />
              <b>₹1,100</b>
            </span>
          </div>
          <p>
            Markup = 37.50% of cost
            <br />
            Margin = 27.27% of selling price
          </p>
          <aside>
            Don't say “37.5% margin.” That would be 37.5% of selling price, not
            of cost.
          </aside>
        </article>
        <article>
          <h3>TRY THIS CHALLENGE</h3>
          <p>Cost = ₹950. You sell the item at a 20% markup.</p>
          <p>What are the selling price, profit and margin?</p>
          {["Selling price (₹)", "Profit (₹)", "Margin (%)"].map((label, i) => (
            <label key={label}>
              {label}
              <input
                aria-label={label}
                value={answers[i]}
                onChange={(e) => setAnswer(i, e.target.value)}
              />
            </label>
          ))}
          <button onClick={check}>Check Answer</button>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? "Correct: ₹1,140, ₹190, 16.67%."
                : "Use markup = profit ÷ cost."}
          </output>
        </article>
      </section>
      <nav className="pl602-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/601-currency-conversion">
          ←{" "}
          <span>
            PREVIOUS<b>Currency Conversion</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/603-break-even-analysis">
          <span>
            NEXT<b>Break-Even Analysis</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
