import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./BillsTaxTargetLesson10018.css";

type Item = {
  id: number;
  name: string;
  icon: string;
  price: number;
  qty: number;
};
const defaults: Item[] = [
  { id: 1, name: "T-Shirt", icon: "👕", price: 600, qty: 2 },
  { id: 2, name: "Jeans", icon: "👖", price: 1250, qty: 1 },
  { id: 3, name: "Sneakers", icon: "👟", price: 1800, qty: 1 },
  { id: 4, name: "Backpack", icon: "🎒", price: 850, qty: 1 },
];
const money = (value: number) =>
  value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function BillsTaxTargetLesson10018({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [items, setItems] = useState(defaults);
  const [discount, setDiscount] = useState(10);
  const [tax, setTax] = useState(8);
  const [tab, setTab] = useState("Interact");
  const [answer, setAnswer] = useState(false);
  const [actions, setActions] = useState(0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0),
    saving = (subtotal * discount) / 100,
    after = subtotal - saving,
    taxAmount = (after * tax) / 100,
    total = after + taxAmount,
    idx = schoolLessonCatalog.findIndex((item) => item.id === lesson.id),
    prev = schoolLessonCatalog[idx - 1],
    next = schoolLessonCatalog[idx + 1];
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
  };
  const update = (id: number, key: "price" | "qty", value: number) =>
    act(() =>
      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, [key]: Math.max(key === "qty" ? 1 : 0, value) }
            : item,
        ),
      ),
    );
  const reset = () =>
    act(() => {
      setItems(defaults);
      setDiscount(10);
      setTax(8);
      setAnswer(false);
    });
  return (
    <section
      className="bt10018-page"
      data-testid="school-mockup-0692"
      data-object-model="dedicated-shopping-bill-discount-then-tax-live-receipt-and-challenge"
      data-subtotal={subtotal}
      data-saving={saving.toFixed(2)}
      data-after-discount={after.toFixed(2)}
      data-tax-amount={taxAmount.toFixed(2)}
      data-total={total.toFixed(2)}
      data-items={items.length}
      data-answer={answer}
      data-actions={actions}
    >
      <header className="bt10018-hero">
        <small>CLASS 7 · APPLIED ARITHMETIC</small>
        <h1>Bills, Discounts and Tax</h1>
        <p>
          Use percentage discount and tax to find the final amount of a shopping
          bill.
          <br />
          See how each step affects the total.
        </p>
        <dl>
          <span>◷ 18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>number</span>
          <span>Learning Path: Applied Arithmetic</span>
        </dl>
        <aside>
          <Link to={prev.route}>
            ← Previous<b>Average and Percentage</b>
          </Link>
          <Link to={next.route}>
            Next →<b>{next.title}</b>
          </Link>
        </aside>
      </header>
      <nav className="bt10018-tabs">
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
      <section className="bt10018-main">
        <article>
          <header>
            <h2>▣ OBSERVE & MANIPULATE</h2>
            <h3>Shopping Bill Simulator</h3>
            <p>
              Change quantities, discount and tax. Watch the bill update live.
            </p>
            <button className="reset" onClick={reset}>
              <RotateCcw />
              Reset
            </button>
          </header>
          <table>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>PRICE (₹)</th>
                <th>QTY</th>
                <th>AMOUNT (₹)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <i>{item.icon}</i>
                    {item.name}
                  </td>
                  <td>
                    <input
                      aria-label={`${item.name} price`}
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        update(item.id, "price", Number(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <button
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => update(item.id, "qty", item.qty - 1)}
                    >
                      −
                    </button>
                    <b>{item.qty}</b>
                    <button
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => update(item.id, "qty", item.qty + 1)}
                    >
                      ＋
                    </button>
                  </td>
                  <td>{money(item.price * item.qty)}</td>
                  <td>
                    <button
                      aria-label={`Remove ${item.name}`}
                      onClick={() =>
                        act(() =>
                          setItems((current) =>
                            current.filter((row) => row.id !== item.id),
                          ),
                        )
                      }
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="add"
            onClick={() =>
              act(() =>
                setItems((current) => [
                  ...current,
                  {
                    id: Date.now(),
                    name: `Item ${current.length + 1}`,
                    icon: "🛍",
                    price: 500,
                    qty: 1,
                  },
                ]),
              )
            }
          >
            <Plus />
            Add item
          </button>
          <section className="bt10018-sliders">
            <label>
              DISCOUNT (%)
              <input
                aria-label="Discount percentage"
                type="range"
                min="0"
                max="50"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
              <b>{discount}%</b>
              <span>0% to 50%</span>
            </label>
            <label>
              TAX (%)
              <input
                aria-label="Tax percentage"
                type="range"
                min="0"
                max="28"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
              />
              <b>{tax}%</b>
              <span>0% to 28%</span>
            </label>
          </section>
          <section className="bt10018-cards">
            <article>
              <b>SUBTOTAL (₹)</b>
              <small>Before discount and tax</small>
              <strong>{money(subtotal)}</strong>
            </article>
            <article>
              <b>YOU SAVE (₹)</b>
              <small>Discount amount (savings)</small>
              <strong>{money(saving)}</strong>
            </article>
          </section>
          <footer>ⓘ Bill updates in real time as you change values.</footer>
        </article>
        <article className="bt10018-receipt">
          <h2>LIVE RECEIPT</h2>
          <section>
            <header>
              <h3>MATH UNIVERSE MART</h3>
              <p>Thank you for shopping with us!</p>
            </header>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Rate (₹)</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>{money(item.price)}</td>
                    <td>{money(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl>
              <p>
                <b>Subtotal (Before Discount)</b>
                <span>₹ {money(subtotal)}</span>
              </p>
              <p className="green">
                <b>Discount @ {discount}%</b>
                <span>− ₹ {money(saving)}</span>
              </p>
              <p>
                <b>Amount After Discount</b>
                <span>₹ {money(after)}</span>
              </p>
              <p className="blue">
                <b>
                  Tax @ {tax}% on ₹ {money(after)}
                </b>
                <span>＋ ₹ {money(taxAmount)}</span>
              </p>
              <p className="total">
                <b>TOTAL AMOUNT PAYABLE</b>
                <span>₹ {money(total)}</span>
              </p>
            </dl>
            <footer>
              You saved ₹ {money(saving)}
              <small>Happy Learning!</small>
            </footer>
          </section>
          <aside>
            <span>
              🏷 DISCOUNT<b>{discount}%</b>
            </span>
            <span>
              ％ TAX<b>{tax}%</b>
            </span>
            <span>
              💵 FINAL BILL<b>₹ {money(total)}</b>
            </span>
          </aside>
        </article>
      </section>
      <section className="bt10018-rules">
        <article>
          <h2>2 NOTICE THE PATTERN</h2>
          <p>Try changing values and observe.</p>
          <ul>
            <li>Increase quantity → Subtotal increases.</li>
            <li>Increase discount % → Savings increases.</li>
            <li>Tax is calculated on the amount after discount.</li>
            <li>Higher tax % → Final bill increases.</li>
          </ul>
        </article>
        <article>
          <h2>3 UNDERSTAND THE RULE</h2>
          <b>Key Rule</b>
          <p>
            Discount is applied first. Then tax is calculated on the discounted
            amount.
          </p>
          <strong>
            Amount after discount = S(1 − d/100)
            <br />
            Tax amount = t/100 × Amount after discount
            <br />
            Total = Amount after discount + Tax amount
          </strong>
        </article>
        <article>
          <h2>⚠ COMMON MISTAKE</h2>
          <p>
            Calculating tax on the original subtotal instead of the discounted
            amount.
          </p>
          <b className="wrong">Wrong: Tax = t/100 × S ✕</b>
          <b className="right">Correct: Tax = t/100 × S(1 − d/100) ✓</b>
        </article>
      </section>
      <section className="bt10018-examples">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <p>
            A bill has a subtotal of ₹3,750. A discount of 12% is given and then
            8% tax is charged.
          </p>
          <b>Solution:</b>
          <p>Amount after discount = 3750(0.88) = ₹3,300.00</p>
          <p>Tax amount = 8/100 × 3300 = ₹264.00</p>
          <p>Total amount payable = 3300 + 264 = ₹3,564.00</p>
          <strong>Answer: The total amount payable is ₹3,564.00.</strong>
        </article>
        <article>
          <h2>5 TRY INDEPENDENTLY</h2>
          <p>
            <b>Challenge:</b> A watch has a price of ₹2,450. A discount of 15%
            is given and then 12% tax is charged. What is the total amount
            payable?
          </p>
          <button onClick={() => act(() => setAnswer(!answer))}>
            ◉ Show Answer
          </button>
          {answer && (
            <aside>
              <b>Answer:</b>
              <p>Amount after discount = 2450(0.85) = ₹2,082.50</p>
              <p>Tax amount = 12/100 × 2082.50 = ₹249.90</p>
              <p>Total amount payable = ₹2,332.40</p>
            </aside>
          )}
        </article>
      </section>
      <section className="bt10018-glance">
        <h2>LESSON AT A GLANCE</h2>
        {[
          ["▤", "Concept", "Discount first, then tax."],
          ["◉", "Sequence", "Subtotal → Discount → Tax → Total"],
          ["♧", "Formula", "Use the rule consistently."],
          ["▢", "Real life", "Shopping bills, invoice, billing"],
        ].map((x) => (
          <span key={x[1]}>
            <i>{x[0]}</i>
            <b>{x[1]}</b>
            <small>{x[2]}</small>
          </span>
        ))}
        <p>
          <b>Learning Tips</b>
          <br />
          Always check the order of operations: Discount first, then Tax.
        </p>
      </section>
      <nav className="bt10018-adjacent">
        <Link to={prev.route}>
          ← Previous Lesson<b>Average and Percentage</b>
        </Link>
        <Link to={next.route}>
          Next Lesson →<b>{next.title}</b>
        </Link>
      </nav>
    </section>
  );
}
