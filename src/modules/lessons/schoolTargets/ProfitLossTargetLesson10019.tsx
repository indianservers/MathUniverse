import { CheckCircle2, RotateCcw, Shuffle, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ProfitLossTargetLesson10019.css";

const rupees = (value: number) =>
  value.toLocaleString("en-IN", { maximumFractionDigits: 2 });

export default function ProfitLossTargetLesson10019({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [cp, setCp] = useState(1000);
  const [mp, setMp] = useState(1400);
  const [discount, setDiscount] = useState(20);
  const [tab, setTab] = useState("Interact");
  const [answers, setAnswers] = useState({ sp: "", profit: "", percent: "" });
  const [graded, setGraded] = useState<"idle" | "correct" | "wrong">("idle");
  const [steps, setSteps] = useState(false);
  const [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const model = useMemo(() => {
    const discountAmount = (mp * discount) / 100;
    const sp = mp - discountAmount;
    const difference = sp - cp;
    const result =
      difference > 0
        ? "PROFIT"
        : difference < 0
          ? "LOSS"
          : "NO PROFIT, NO LOSS";
    const percent = cp ? (Math.abs(difference) / cp) * 100 : 0;
    return { discountAmount, sp, difference, result, percent };
  }, [cp, discount, mp]);
  const idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id);
  const prev = schoolLessonCatalog[idx - 1];
  const next = schoolLessonCatalog[idx + 1];
  const setValue = (setter: (value: number) => void, value: number) =>
    act(() => setter(Math.max(0, value)));
  const reset = () =>
    act(() => {
      setCp(1000);
      setMp(1400);
      setDiscount(20);
      setAnswers({ sp: "", profit: "", percent: "" });
      setGraded("idle");
      setSteps(false);
    });
  const preset = (kind: "profit" | "loss") =>
    act(() => {
      setCp(kind === "profit" ? 1000 : 1600);
      setMp(1400);
      setDiscount(20);
    });
  const randomize = () =>
    act(() => {
      const seed = (actions % 5) + 1;
      setCp(600 + seed * 180);
      setMp(1000 + seed * 220);
      setDiscount(5 + seed * 5);
    });
  const check = () => {
    const sp = 1800;
    const profit = 300;
    const percent = 20;
    act(() =>
      setGraded(
        Math.abs(Number(answers.sp) - sp) < 0.01 &&
          Math.abs(Number(answers.profit) - profit) < 0.01 &&
          Math.abs(Number(answers.percent) - percent) < 0.01
          ? "correct"
          : "wrong",
      ),
    );
  };
  return (
    <section
      className="pl10019-page"
      data-testid="school-mockup-0693"
      data-object-model="dedicated-cost-marked-discount-selling-price-profit-loss-store-flow"
      data-cp={cp}
      data-mp={mp}
      data-discount={discount}
      data-sp={model.sp}
      data-difference={model.difference}
      data-result={model.result}
      data-percent={model.percent.toFixed(2)}
      data-graded={graded}
      data-actions={actions}
    >
      <header className="pl10019-hero">
        <section>
          <small>CLASS 7 · APPLIED ARITHMETIC</small>
          <h1>Profit, Loss and Marked Price</h1>
          <b>OBJECTIVE</b>
          <p>
            Understand profit, loss and marked price relationships and apply the
            rule to solve problems.
          </p>
        </section>
        <dl>
          <span>
            ◷<b>18 min</b>
            <small>Duration</small>
          </span>
          <span>
            ▥<b>FOUNDATION</b>
            <small>Level</small>
          </span>
          <span>
            ▦<b>CLASS 7</b>
            <small>Grade</small>
          </span>
          <span>
            ◇<b>number</b>
            <small>Topic</small>
          </span>
        </dl>
      </header>
      <nav className="pl10019-tabs">
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
      <section className="pl10019-lab">
        <header>
          <h2>INTERACTIVE MODEL · PROFIT/LOSS &amp; MARKED PRICE STORE</h2>
          <button onClick={reset}>
            <RotateCcw />
            Reset all
          </button>
        </header>
        <section className="pl10019-workspace">
          <aside className="pl10019-controls">
            <h3>CONTROLS</h3>
            {[
              ["Cost Price (CP) ₹", cp, setCp, 100, 10000],
              ["Marked Price (MP) ₹", mp, setMp, 100, 10000],
              ["Discount (%) %", discount, setDiscount, 0, 90],
            ].map(([label, value, setter, min, max]) => (
              <label key={String(label)}>
                {label}
                <strong>{value}</strong>
                <span>
                  <button
                    aria-label={`Decrease ${label}`}
                    onClick={() =>
                      setValue(
                        setter as (v: number) => void,
                        Number(value) - (label === "Discount (%) %" ? 1 : 100),
                      )
                    }
                  >
                    −
                  </button>
                  <button
                    aria-label={`Increase ${label}`}
                    onClick={() =>
                      setValue(
                        setter as (v: number) => void,
                        Number(value) + (label === "Discount (%) %" ? 1 : 100),
                      )
                    }
                  >
                    ＋
                  </button>
                </span>
                <input
                  aria-label={String(label)}
                  type="range"
                  min={Number(min)}
                  max={Number(max)}
                  step={label === "Discount (%) %" ? 1 : 100}
                  value={Number(value)}
                  onChange={(event) =>
                    setValue(
                      setter as (v: number) => void,
                      Number(event.target.value),
                    )
                  }
                />
                <small>
                  {min}
                  <b>{value}</b>
                  {max}
                </small>
              </label>
            ))}
            <b>Actions</b>
            <div>
              <button onClick={() => preset("profit")}>Preset: Profit</button>
              <button onClick={() => preset("loss")}>Preset: Loss</button>
            </div>
            <button className="random" onClick={randomize}>
              <Shuffle />
              Randomize
            </button>
          </aside>
          <article className="pl10019-store">
            <div className="pl10019-awning">
              {Array.from({ length: 14 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <section className="pl10019-flow">
              <article>
                <b>
                  COST PRICE
                  <br />
                  (CP)
                </b>
                <strong>₹{rupees(cp)}</strong>
                <span>♟</span>
              </article>
              <i>→</i>
              <article>
                <b>
                  MARKED PRICE
                  <br />
                  (MP)
                </b>
                <strong>₹{rupees(mp)}</strong>
                <span>◇</span>
              </article>
              <i>→</i>
              <article className="discount">
                <b>
                  DISCOUNT
                  <br />
                  {discount}%
                </b>
                <strong>₹{rupees(model.discountAmount)}</strong>
                <span>✂</span>
              </article>
              <i>→</i>
              <article className="selling">
                <b>
                  SELLING PRICE
                  <br />
                  (SP)
                </b>
                <strong>₹{rupees(model.sp)}</strong>
                <span>▤</span>
              </article>
            </section>
            <section
              className={`pl10019-result ${model.result.startsWith("LOSS") ? "loss" : ""}`}
            >
              <article>
                SP − CP = ₹{rupees(Math.abs(model.difference))}
                <strong>{model.result}</strong>
              </article>
              <article>
                {model.result === "LOSS" ? "LOSS" : "PROFIT"} % ={" "}
                {model.percent.toFixed(0)}%
                <strong>
                  = ({rupees(Math.abs(model.difference))} / {rupees(cp)}) × 100
                </strong>
              </article>
              <article>
                LOSS % = 0%
                <strong>
                  {model.result === "PROFIT"
                    ? "—"
                    : model.percent.toFixed(0) + "%"}
                </strong>
              </article>
            </section>
            <footer>
              <h3>SUMMARY</h3>
              <div>
                <span>
                  CP<b>₹{rupees(cp)}</b>
                </span>
                <span>
                  SP<b>₹{rupees(model.sp)}</b>
                </span>
                <span>
                  Difference (SP − CP)
                  <b>₹{rupees(Math.abs(model.difference))}</b>
                </span>
                <span>
                  Result
                  <b>
                    {model.result}
                    <br />
                    {model.percent.toFixed(0)}%
                  </b>
                </span>
              </div>
            </footer>
          </article>
        </section>
        <footer>
          <b>Selling Price after discount:</b> SP = MP − (Discount% × MP)
          <span>
            Here: SP = {mp} − ({discount} × {mp} / 100) = {rupees(model.sp)}
          </span>
        </footer>
      </section>
      <section className="pl10019-theory">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>
            A shopkeeper marks an article at ₹1500 and allows a discount of 15%.
            If the cost price is ₹1100, find the selling price, profit and
            profit%.
          </p>
          <ol>
            <li>
              <b>Selling Price:</b>
              <br />
              SP = 1500 − (15 × 1500 / 100) = ₹1275
            </li>
            <li>
              <b>Profit:</b>
              <br />
              Profit = 1275 − 1100 = ₹175
            </li>
            <li>
              <b>Profit%:</b>
              <br />
              (175 / 1100) × 100 = 15.91%
            </li>
          </ol>
          <strong>Answer: SP = ₹1275, Profit = ₹175, Profit% ≈ 15.91%</strong>
        </article>
        <article>
          <h2>KEY RULE / DEFINITION</h2>
          <p>
            <b>Marked Price (MP):</b> The price written on the article.
          </p>
          <p>
            <b>Discount:</b> Reduction from the marked price.
          </p>
          <p>
            <b>Selling Price (SP):</b> Price at which the article is sold.
          </p>
          <p>
            <b>Profit = SP − CP</b>
          </p>
          <p>
            <b>Loss = CP − SP</b>
          </p>
          <p>
            <b>Profit% = (Profit / CP) × 100</b>
          </p>
          <aside>
            If SP &gt; CP → Profit
            <br />
            If SP &lt; CP → Loss
            <br />
            If SP = CP → No profit, no loss
          </aside>
        </article>
      </section>
      <section className="pl10019-pattern">
        <article>
          <h2>▣ NOTICE THE PATTERN</h2>
          <p>Move the sliders and observe.</p>
          {[
            "Increasing discount decreases the selling price.",
            "If SP > CP → Profit% is positive.",
            "If SP < CP → Loss% is positive.",
            "Profit% or Loss% is measured on cost price.",
          ].map((x) => (
            <span key={x}>
              <CheckCircle2 />
              {x}
            </span>
          ))}
        </article>
        <article>
          <h2>⚠ COMMON MISCONCEPTION</h2>
          <p>
            Students often think profit% is calculated on the selling price.
          </p>
          <p>
            Remember: Always calculate profit% or loss% on <b>COST PRICE.</b>
          </p>
          <aside>
            <b>Wrong:</b>
            <br />
            Profit% = (Profit / SP) × 100 <XCircle />
          </aside>
        </article>
      </section>
      <section className="pl10019-practice">
        <article>
          <h2>TRY INDEPENDENTLY</h2>
          <p>
            Marked price of a watch is ₹2400. Discount offered is 25%. If the
            cost price is ₹1500, find the selling price, profit and profit%.
          </p>
          <div>
            {(["sp", "profit", "percent"] as const).map((key) => (
              <label key={key}>
                {key === "sp"
                  ? "Selling Price (₹)"
                  : key === "profit"
                    ? "Profit (₹)"
                    : "Profit %"}
                <input
                  value={answers[key]}
                  placeholder={`Enter ${key}`}
                  onChange={(e) =>
                    setAnswers({ ...answers, [key]: e.target.value })
                  }
                />
              </label>
            ))}
            <button onClick={check}>Check Answer</button>
          </div>
          {graded !== "idle" && (
            <strong className={graded}>
              {graded === "correct"
                ? "Correct: ₹1800, ₹300 and 20%."
                : "Check each step and calculate percentage on cost price."}
            </strong>
          )}
        </article>
        <aside>
          <b>Hint</b>
          <p>SP = MP − (Discount% × MP / 100)</p>
          <button onClick={() => act(() => setSteps(!steps))}>
            {steps ? "Hide steps" : "Show steps"}
          </button>
          {steps && <p>SP = ₹1800; Profit = ₹300; Profit% = 20%.</p>}
        </aside>
      </section>
      <nav className="pl10019-adjacent">
        <Link to={prev.route}>
          ←
          <span>
            Previous<b>Class 7 Decimals</b>
          </span>
        </Link>
        <Link to={next.route}>
          <span>
            Next<b>Class 7 Simple Equations</b>
          </span>
          →
        </Link>
      </nav>
    </section>
  );
}
