import { CheckCircle2, Trash2, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./HouseholdBudgetTargetLesson10020.css";

type Envelope = { id: number; name: string; amount: number; color: string };
const defaults: Envelope[] = [
  { id: 1, name: "Housing", amount: 1800, color: "#3d8ed8" },
  { id: 2, name: "Food", amount: 1200, color: "#36aa62" },
  { id: 3, name: "Transport", amount: 600, color: "#f2a329" },
  { id: 4, name: "Education", amount: 500, color: "#7956cf" },
  { id: 5, name: "Utilities", amount: 400, color: "#36adca" },
  { id: 6, name: "Savings", amount: 300, color: "#e96696" },
];
const money = (value: number) =>
  value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function HouseholdBudgetTargetLesson10020({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [income, setIncome] = useState(5000);
  const [envelopes, setEnvelopes] = useState(defaults);
  const [goal, setGoal] = useState(500);
  const [days, setDays] = useState(30);
  const [tab, setTab] = useState("Interact");
  const [graded, setGraded] = useState<"idle" | "correct" | "wrong">("idle");
  const [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
  };
  const total = envelopes.reduce((sum, item) => sum + item.amount, 0);
  const balance = income - total;
  const savings =
    envelopes.find((item) => item.name === "Savings")?.amount ?? 0;
  const savingsPercent = income ? (balance / income) * 100 : 0;
  const goalMet = savings >= goal && balance >= 0;
  const status =
    balance < 0 ? "OVER BUDGET" : goalMet ? "GOAL MET" : "ON TRACK";
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const slices = useMemo(() => {
    let used = 0;
    return envelopes
      .map((item) => {
        const start = income ? (used / income) * 360 : 0;
        used += item.amount;
        return `${item.color} ${start}deg ${income ? (used / income) * 360 : 0}deg`;
      })
      .join(",");
  }, [envelopes, income]);
  const update = (id: number, amount: number) =>
    act(() => {
      setEnvelopes((rows) =>
        rows.map((row) =>
          row.id === id ? { ...row, amount: Math.max(0, amount) } : row,
        ),
      );
      setGraded("idle");
    });
  const remove = (id: number) =>
    act(() => {
      setEnvelopes((rows) => rows.filter((row) => row.id !== id));
      setGraded("idle");
    });
  const add = () =>
    act(() => {
      setEnvelopes((rows) => [
        ...rows,
        {
          id: Date.now(),
          name: `Other ${rows.length - 5}`,
          amount: 100,
          color: "#7d98ac",
        },
      ]);
      setGraded("idle");
    });
  return (
    <section
      className="hb10020-page"
      data-testid="school-mockup-0694"
      data-object-model="dedicated-household-income-expense-envelope-balance-goal-planner"
      data-income={income}
      data-total={total}
      data-balance={balance}
      data-savings={savings}
      data-percent={savingsPercent.toFixed(2)}
      data-status={status}
      data-goal-met={goalMet}
      data-envelopes={envelopes.length}
      data-graded={graded}
      data-actions={actions}
    >
      <header className="hb10020-hero">
        <small>CLASS 7 · APPLIED ARITHMETIC</small>
        <h1>Household Budget Arithmetic</h1>
        <p>
          <b>Objective:</b> Plan and adjust a household budget using ratios,
          percentages and the rule <i>a − b = c.</i>
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>number</span>
          <span>real-life</span>
        </dl>
        <Link to="/lessons/school">← School lessons</Link>
      </header>
      <nav className="hb10020-tabs">
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
      <section className="hb10020-flow">
        {[
          ["◉", "1 Observe", "See a budget in action."],
          ["☝", "2 Manipulate", "Adjust income & expenses."],
          ["⌕", "3 Notice the pattern", "Look for relationships."],
          ["♧", "4 Understand the rule", "Connect to a − b = c."],
          ["◎", "5 Try independently", "Test with a challenge."],
        ].map((item, i) => (
          <article key={item[1]}>
            <i>{item[0]}</i>
            <span>
              <b>{item[1]}</b>
              <small>{item[2]}</small>
            </span>
            {i < 4 && <em>→</em>}
          </article>
        ))}
      </section>
      <section className="hb10020-lab">
        <aside className="hb10020-planner">
          <h2>
            <i>1</i> Household Budget Planner
          </h2>
          <p>Adjust amounts to see instant updates.</p>
          <label>
            MONTHLY INCOME
            <input
              aria-label="Monthly income"
              type="number"
              value={income}
              onChange={(e) =>
                act(() => {
                  setIncome(Math.max(0, Number(e.target.value)));
                  setGraded("idle");
                })
              }
            />
          </label>
          <h3>
            EXPENSE ENVELOPES <small>(Edit any amount)</small>
          </h3>
          <header>
            <span>Category</span>
            <span>Amount (₹)</span>
            <span>% of Income</span>
          </header>
          {envelopes.map((item) => (
            <div className="hb10020-envelope" key={item.id}>
              <span>
                <i style={{ background: item.color }} />
                {item.name}
              </span>
              <input
                aria-label={`${item.name} amount`}
                type="number"
                value={item.amount}
                onChange={(e) => update(item.id, Number(e.target.value))}
              />
              <b>{income ? Math.round((item.amount / income) * 100) : 0}%</b>
              <button
                aria-label={`Remove ${item.name}`}
                onClick={() => remove(item.id)}
              >
                <Trash2 />
              </button>
            </div>
          ))}
          <button className="hb10020-add" onClick={add}>
            ＋ Add envelope
          </button>
          <section className="hb10020-goal">
            <h3>
              ◎ Savings Goal <small>(optional)</small>
            </h3>
            <div>
              <label>
                Goal amount (₹)
                <input
                  aria-label="Savings goal"
                  type="number"
                  value={goal}
                  onChange={(e) =>
                    act(() => {
                      setGoal(Math.max(0, Number(e.target.value)));
                      setGraded("idle");
                    })
                  }
                />
              </label>
              <label>
                Target date
                <input
                  aria-label="Target days"
                  type="number"
                  value={days}
                  onChange={(e) =>
                    act(() => {
                      setDays(Math.max(1, Number(e.target.value)));
                      setGraded("idle");
                    })
                  }
                />
              </label>
            </div>
            <p>Hint: Try to keep Savings ≥ goal.</p>
          </section>
        </aside>
        <article className="hb10020-dashboard">
          <header className="hb10020-totals">
            <span>
              TOTAL EXPENSES<b>₹ {money(total)}</b>
            </span>
            <span>
              SAVINGS (BALANCE)
              <b className={balance < 0 ? "bad" : ""}>₹ {money(balance)}</b>
            </span>
            <span>
              SAVINGS %<b>{savingsPercent.toFixed(0)}%</b>
            </span>
            <span>
              STATUS
              <b>
                <CheckCircle2 />
                {status}
              </b>
            </span>
          </header>
          <section className="hb10020-chart">
            <article>
              <h3>EXPENSE BREAKDOWN</h3>
              <div
                className="hb10020-donut"
                style={{
                  background: `conic-gradient(${slices}${total < income ? `,#e9eef3 ${(total / income) * 360}deg 360deg` : ""})`,
                }}
              >
                <span>
                  <b>₹ {money(total)}</b>
                  <small>
                    {income ? Math.round((total / income) * 100) : 0}%
                  </small>
                </span>
              </div>
            </article>
            <article>
              <h3>AMOUNT REMAINING</h3>
              <strong>₹ {money(balance)}</strong>
              <p>
                =₹{money(income)} − ₹{money(total)}
              </p>
              <label>
                Goal
                <br />₹{money(goal)}
              </label>
              <progress max={income || 1} value={Math.max(0, balance)} />
              <small>
                <b>0</b>
                <b>₹{money(income)}</b>
              </small>
            </article>
          </section>
          <section className={`hb10020-alert ${goalMet ? "met" : ""}`}>
            <b>
              {balance < 0
                ? "OVERSPEND ALERT"
                : goalMet
                  ? "SAVINGS GOAL MET"
                  : "SAVINGS GOAL ALERT"}
            </b>
            <strong>
              {balance < 0
                ? `Expenses exceed income by ₹${money(-balance)}.`
                : `Set aside ₹${money(Math.max(0, goal - savings))} more to reach the goal.`}
            </strong>
            <span>
              {balance < 0
                ? "Reduce one or more envelopes."
                : `Planned savings are ₹${money(savings)}.`}
            </span>
            <button
              onClick={() =>
                update(
                  envelopes.find((x) => x.name === "Savings")?.id ?? 0,
                  goal,
                )
              }
            >
              Adjust to goal
            </button>
          </section>
          <section className="hb10020-summary">
            <h3>ENVELOPE SUMMARY</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount (₹)</th>
                  <th>% of Income</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {envelopes.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{money(item.amount)}</td>
                    <td>
                      {income ? Math.round((item.amount / income) * 100) : 0}%
                    </td>
                    <td>◉ OK</td>
                  </tr>
                ))}
                <tr>
                  <th>TOTAL</th>
                  <th>{money(total)}</th>
                  <th>{income ? Math.round((total / income) * 100) : 0}%</th>
                  <th>—</th>
                </tr>
              </tbody>
            </table>
          </section>
        </article>
      </section>
      <section className="hb10020-theory">
        <article>
          <h2>
            <i>2</i> Worked Example (Correct)
          </h2>
          <p>Income = ₹5,000</p>
          <p>
            Expenses: Housing ₹1,800; Food ₹1,200; Transport ₹600; Education
            ₹500; Utilities ₹400; Savings ₹300.
          </p>
          <p>Total expenses = 1,800 + 1,200 + 600 + 500 + 400 + 300 = ₹4,800</p>
          <p>Savings (balance) = 5,000 − 4,800 = ₹200</p>
          <p>Savings % = 200 / 5,000 × 100 = 4%</p>
        </article>
        <article>
          <h2>
            <i>3</i> Key Rule / Definition
          </h2>
          <aside>
            <b>Budget Rule: a − b = c</b>
            <p>
              a = total income
              <br />b = total expenses
              <br />c = savings (balance)
            </p>
            <p>Percent allocation = category amount / total income × 100%</p>
          </aside>
        </article>
        <article>
          <h2>
            <i>4</i> Common Misconception
          </h2>
          <p>Thinking “leftover” is always savings.</p>
          <p>
            Not all leftovers are planned savings. Savings is money set aside on
            purpose inside the budget.
          </p>
          <div>
            <span>
              🐖<b>Planned Savings ✓</b>
              <small>Included in budget</small>
            </span>
            <b>VS</b>
            <span>
              🐖<b>Leftovers ✕</b>
              <small>What remains (may be zero)</small>
            </span>
          </div>
        </article>
        <article>
          <h2>
            <i>5</i> Challenge: Can You Hit the Goal?
          </h2>
          <p>Income = ₹5,000. Goal: Save at least ₹500 in 30 days.</p>
          <p>Adjust the envelopes to meet the goal.</p>
          <div>
            <span>
              Target<b>₹ {money(goal)}</b>
            </span>
            <span>
              Your Savings<b>₹ {money(savings)}</b>
            </span>
            <span>
              <Trophy />
              Goal Met?<b>{goalMet ? "Yes" : "No"}</b>
            </span>
          </div>
          <button
            onClick={() => act(() => setGraded(goalMet ? "correct" : "wrong"))}
          >
            Check my plan
          </button>
          {graded !== "idle" && (
            <strong className={graded}>
              {graded === "correct"
                ? "Goal achieved with a balanced plan."
                : "Increase planned savings without overspending."}
            </strong>
          )}
        </article>
      </section>
      <nav className="hb10020-adjacent">
        <Link to={prev.route}>← Previous: Profit, Loss and Marked Price</Link>
        <Link to={next.route}>Next: Scale Factor in Maps and Recipes →</Link>
      </nav>
    </section>
  );
}
