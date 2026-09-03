import { Plus, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./TaxDiscountTargetLesson604.css";

const products = [
  ["Backpack", 2450],
  ["Water Bottle", 550],
  ["Notebook", 200],
  ["Pen Set", 250],
  ["Calculator", 900],
  ["Headphones", 1600],
] as const;
const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function TaxDiscountTargetLesson604({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [items, setItems] = useState(() =>
    products.slice(0, 4).map(([name, price]) => ({ name, price })),
  );
  const [selected, setSelected] = useState("Calculator");
  const [discount, setDiscount] = useState(15);
  const [coupon, setCoupon] = useState(10);
  const [tax, setTax] = useState(18);
  const [view, setView] = useState<"steps" | "compact">("steps");
  const [tab, setTab] = useState("Interact");
  const [answer, setAnswer] = useState("");
  const [graded, setGraded] = useState<boolean | null>(null);
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const [actions, setActions] = useState(0);
  const reset = () => {
    setItems(products.slice(0, 4).map(([name, price]) => ({ name, price })));
    setSelected("Calculator");
    setDiscount(15);
    setCoupon(10);
    setTax(18);
    setView("steps");
    setTab("Interact");
    setAnswer("");
    setGraded(null);
    setHint(false);
    setSolution(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (update: () => void) => {
    update();
    setActions((value) => value + 1);
    onInteraction();
  };
  const values = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = (subtotal * discount) / 100;
    const discounted = subtotal - discountAmount;
    const couponAmount = (discounted * coupon) / 100;
    const taxable = discounted - couponAmount;
    const taxAmount = (taxable * tax) / 100;
    return {
      subtotal,
      discountAmount,
      discounted,
      couponAmount,
      taxable,
      taxAmount,
      final: taxable + taxAmount,
    };
  }, [items, discount, coupon, tax]);
  const addItem = () =>
    act(() => {
      const product = products.find(([name]) => name === selected);
      if (product)
        setItems((current) => [
          ...current,
          { name: product[0], price: product[1] },
        ]);
    });
  const removeItem = (index: number) =>
    act(() =>
      setItems((current) =>
        current.filter((_, itemIndex) => itemIndex !== index),
      ),
    );
  const check = () =>
    act(() => setGraded(Math.abs(Number(answer) - 23833.6) < 0.011));

  return (
    <section
      className="td604-page"
      data-testid="finance-mockup-0661"
      data-object-model="dedicated-sequential-discount-coupon-tax-receipt-model"
      data-subtotal={values.subtotal.toFixed(2)}
      data-discounted={values.discounted.toFixed(2)}
      data-taxable={values.taxable.toFixed(2)}
      data-tax={values.taxAmount.toFixed(2)}
      data-final={values.final.toFixed(2)}
      data-items={items.length}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="td604-hero">
        <span>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>FINANCIAL MATHEMATICS AND MODELLING</b>
        </span>
        <h1>Tax and Discounts</h1>
        <p>Apply sequential percentage changes.</p>
        <dl>
          <b>Level: Intermediate-Advanced</b>
          <b>Lab Type: Applied Modelling</b>
          <b>Duration: 6-10 min</b>
          <b>Language: English (English)</b>
        </dl>
        <aside>
          <b>Objective:</b> Apply discount first, then tax, to find the final
          price on a shopping receipt.
        </aside>
      </header>
      <nav className="td604-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
              <small>
                {name === "Interact"
                  ? "Explore the model"
                  : name === "Learn"
                    ? "Key ideas & rule"
                    : name === "Formula"
                      ? "Key equations"
                      : name === "Practice"
                        ? "Try it yourself"
                        : "Step-by-step"}
              </small>
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="td604-note">
          <b>{tab}:</b> Percentage changes multiply sequentially; they are not
          simply added.
        </p>
      )}
      <section className="td604-shop">
        <header>
          <div>
            <h2>Shop &amp; Calculate</h2>
            <p>
              Adjust the items and settings. See how the final price changes.
            </p>
          </div>
          <span>
            View as:{" "}
            <button
              className={view === "steps" ? "active" : ""}
              onClick={() => act(() => setView("steps"))}
            >
              Steps
            </button>
            <button
              className={view === "compact" ? "active" : ""}
              onClick={() => act(() => setView("compact"))}
            >
              Compact
            </button>
            <button aria-label="Reset shop" onClick={() => act(reset)}>
              <RotateCcw />
            </button>
          </span>
        </header>
        <div className="td604-grid">
          <section className="td604-cart">
            <h3>Items in cart</h3>
            <b>
              Item <span>Price (Rs)</span>
            </b>
            {items.map((item, index) => (
              <button
                key={`${item.name}-${index}`}
                onClick={() => removeItem(index)}
                title="Remove item"
              >
                <span>{item.name}</span>
                <b>Rs {money(item.price)}</b>
              </button>
            ))}
            <label>
              Add an item
              <span>
                <select
                  aria-label="Item to add"
                  value={selected}
                  onChange={(event) =>
                    act(() => setSelected(event.target.value))
                  }
                >
                  {products.map(([name]) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
                <button onClick={addItem}>
                  <Plus /> Add
                </button>
              </span>
            </label>
            <Control
              label="Discount"
              subtitle="Percent off the subtotal"
              value={discount}
              max={50}
              onChange={(value) => act(() => setDiscount(value))}
            />
            <label>
              Coupon code (optional)<small>Save extra percent off</small>
              <select
                aria-label="Coupon code"
                value={coupon}
                onChange={(event) => act(() => setCoupon(+event.target.value))}
              >
                <option value="0">No coupon</option>
                <option value="5">SAVE5 - 5% off</option>
                <option value="10">SAVE10 - 10% off</option>
                <option value="15">SAVE15 - 15% off</option>
              </select>
            </label>
            <Control
              label="Tax rate"
              subtitle="Percent on discounted subtotal"
              value={tax}
              max={30}
              onChange={(value) => act(() => setTax(value))}
            />
          </section>
          <Receipt
            items={items}
            discount={discount}
            coupon={coupon}
            tax={tax}
            values={values}
          />
          <Steps
            values={values}
            discount={discount}
            coupon={coupon}
            tax={tax}
            compact={view === "compact"}
          />
        </div>
      </section>
      <section className="td604-order">
        <b>Order of operations matters: Discount and coupon first, then tax.</b>
        <span>Tax is calculated on the price after discounts.</span>
      </section>
      <section className="td604-theory">
        <article>
          <h2>Worked Example</h2>
          <p>Subtotal = Rs {money(values.subtotal)}</p>
          <p>
            Discount ({discount}%) = Rs {money(values.discountAmount)}
          </p>
          <p>After discount = Rs {money(values.discounted)}</p>
          <p>
            Coupon ({coupon}%) = Rs {money(values.couponAmount)}
          </p>
          <p>
            Tax ({tax}%) = Rs {money(values.taxAmount)}
          </p>
          <strong>Final price = Rs {money(values.final)}</strong>
        </article>
        <article>
          <h2>Key Rule</h2>
          <p>
            <b>Sequential percentage changes</b>
          </p>
          <p>If a price P is changed by d% discount, c% coupon and t% tax:</p>
          <strong>Final Price = P x (1 - d) x (1 - c) x (1 + t)</strong>
          <p>Discounts reduce. Tax increases.</p>
        </article>
        <article>
          <h2>Common Misconception</h2>
          <p>
            <b>Adding tax before discounts</b>
          </p>
          <p>Wrong: tax on the original price.</p>
          <p>Right: discount, coupon, then tax.</p>
          <strong>Tax is on what you actually pay after discounts.</strong>
        </article>
      </section>
      <section className="td604-challenge">
        <header>
          <h2>Your Challenge</h2>
          <p>Independent Practice</p>
        </header>
        <main>
          <b>Challenge 1</b>
          <p>
            A camera costs Rs 28,000. A store offers 20% off and a coupon for an
            extra 5% off the discounted price. Sales tax is 12%. What is the
            final price?
          </p>
          <button onClick={() => act(() => setHint((value) => !value))}>
            Show Hint
          </button>
          {hint && <small>Multiply 28,000 x 0.80 x 0.95 x 1.12.</small>}
        </main>
        <aside>
          <label>
            Your Answer
            <span>
              Rs{" "}
              <input
                aria-label="Final price answer"
                placeholder="Type amount"
                value={answer}
                onChange={(event) =>
                  act(() => {
                    setAnswer(event.target.value);
                    setGraded(null);
                  })
                }
              />
              <button onClick={check}>Check</button>
            </span>
          </label>
          <output
            className={graded === null ? "" : graded ? "correct" : "wrong"}
          >
            {graded === null
              ? ""
              : graded
                ? "Correct: Rs 23,833.60"
                : "Try each percentage in order."}
          </output>
          <button onClick={() => act(() => setSolution((value) => !value))}>
            Show Solution
          </button>
          {solution && <small>28,000 x .8 x .95 x 1.12 = Rs 23,833.60</small>}
        </aside>
      </section>
      <nav className="td604-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/603-break-even-analysis">
          &larr;{" "}
          <span>
            Previous Lesson<b>Break-Even Analysis</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/605-investment-comparison">
          <span>
            Next Lesson<b>Investment Comparison</b>
          </span>{" "}
          &rarr;
        </a>
      </nav>
    </section>
  );
}

type Values = {
  subtotal: number;
  discountAmount: number;
  discounted: number;
  couponAmount: number;
  taxable: number;
  taxAmount: number;
  final: number;
};
function Control({
  label,
  subtitle,
  value,
  max,
  onChange,
}: {
  label: string;
  subtitle: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="td604-control">
      {label}
      <small>{subtitle}</small>
      <span>
        <input
          aria-label={`${label} slider`}
          type="range"
          min="0"
          max={max}
          step="1"
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
        <input
          aria-label={label}
          type="number"
          min="0"
          max={max}
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
        %
      </span>
    </label>
  );
}
function Receipt({
  items,
  discount,
  coupon,
  tax,
  values,
}: {
  items: { name: string; price: number }[];
  discount: number;
  coupon: number;
  tax: number;
  values: Values;
}) {
  return (
    <section className="td604-receipt">
      <h2>Shopping Receipt</h2>
      {items.map((item, index) => (
        <p key={`${item.name}-${index}`}>
          {item.name}
          <b>Rs {money(item.price)}</b>
        </p>
      ))}
      <hr />
      <p>
        Subtotal<b>Rs {money(values.subtotal)}</b>
      </p>
      <p className="green">
        Discount ({discount}%)<b>- Rs {money(values.discountAmount)}</b>
      </p>
      <p className="green">
        Coupon ({coupon}%)<b>- Rs {money(values.couponAmount)}</b>
      </p>
      <p className="blue">
        Tax ({tax}%)<b>+ Rs {money(values.taxAmount)}</b>
      </p>
      <hr />
      <strong>
        TOTAL PAYABLE <b>Rs {money(values.final)}</b>
      </strong>
      <footer>
        Thank you for shopping!
        <br />
        Have a great day.
      </footer>
    </section>
  );
}
function Steps({
  values,
  discount,
  coupon,
  tax,
  compact,
}: {
  values: Values;
  discount: number;
  coupon: number;
  tax: number;
  compact: boolean;
}) {
  const steps = [
    ["Subtotal", `Rs ${money(values.subtotal)}`],
    ["Discount", `${discount}% gives Rs ${money(values.discounted)}`],
    ["Coupon", `${coupon}% gives Rs ${money(values.taxable)}`],
    ["Tax", `${tax}% = Rs ${money(values.taxAmount)}`],
    ["Final Price", `Rs ${money(values.final)}`],
  ];
  return (
    <section className={`td604-steps ${compact ? "compact" : ""}`}>
      <h3>Calculation Steps</h3>
      <p>The order matters.</p>
      {steps.map(([title, detail], index) => (
        <article key={title}>
          <b>
            {index + 1} {title}
          </b>
          {!compact && <p>{detail}</p>}
        </article>
      ))}
    </section>
  );
}
