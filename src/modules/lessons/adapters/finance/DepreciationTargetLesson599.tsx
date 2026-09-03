import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./DepreciationTargetLesson599.css";

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function DepreciationTargetLesson599({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [cost, setCost] = useState(100000);
  const [residual, setResidual] = useState(0);
  const [life, setLife] = useState(5);
  const [rate, setRate] = useState(15);
  const [showSl, setShowSl] = useState(true);
  const [showRb, setShowRb] = useState(true);
  const [view, setView] = useState<"Graph" | "Table">("Graph");
  const [tab, setTab] = useState("Interact");
  const [actions, setActions] = useState(0);
  const reset = () => {
    setCost(100000);
    setResidual(0);
    setLife(5);
    setRate(15);
    setShowSl(true);
    setShowRb(true);
    setView("Graph");
    setTab("Interact");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const rows = useMemo(() => {
    const annualSl = (cost - residual) / life;
    return Array.from({ length: life + 1 }, (_, year) => {
      const slBook = Math.max(residual, cost - annualSl * year);
      const priorRb = year === 0 ? cost : cost * (1 - rate / 100) ** (year - 1);
      const rbBook = cost * (1 - rate / 100) ** year;
      return {
        year,
        slDep: year === 0 ? 0 : annualSl,
        slBook,
        rbDep: year === 0 ? 0 : priorRb - rbBook,
        rbBook,
      };
    });
  }, [cost, residual, life, rate]);
  const end = rows.at(-1)!;
  const x = (year: number) => 55 + (year / life) * 510;
  const y = (value: number) => 235 - (value / Math.max(cost, 1)) * 185;
  return (
    <section
      className="dep599-page"
      data-testid="finance-mockup-0656"
      data-object-model="dedicated-straight-line-reducing-balance-depreciation-model"
      data-cost={cost}
      data-residual={residual}
      data-life={life}
      data-rate={rate}
      data-sl-end={end.slBook.toFixed(2)}
      data-rb-end={end.rbBook.toFixed(2)}
      data-view={view}
      data-actions={actions}
    >
      <header className="dep599-hero">
        <main>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <h1>599 Depreciation</h1>
          <p>Compare straight-line and reducing-balance methods</p>
          <small>
            Level: <b>Intermediate-Advanced</b> {" · "} Topic:{" "}
            <b>Financial Mathematics</b> {" · "} Lab Type:{" "}
            <b>Applied Modelling</b> {" · "} Duration: <b>6-10 min</b>
          </small>
        </main>
        <aside>
          <b>OBJECTIVE</b>
          <p>
            Compare straight-line and reducing-balance depreciation, analyse
            book values, and interpret how method and rate affect asset value.
          </p>
        </aside>
      </header>
      <nav className="dep599-tabs">
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
        <p className="dep599-note">
          <b>{tab}:</b> compare equal annual depreciation with a constant
          percentage of current book value.
        </p>
      )}
      <section className="dep599-lab">
        <header>
          <div>
            <h2>1 Observe &amp; Manipulate</h2>
            <p>
              Adjust the inputs to compare book-value curves and year-by-year
              schedules.
            </p>
          </div>
          <div>
            <button
              className={view === "Graph" ? "active" : ""}
              onClick={() => act(() => setView("Graph"))}
            >
              Graph
            </button>
            <button
              className={view === "Table" ? "active" : ""}
              onClick={() => act(() => setView("Table"))}
            >
              Table
            </button>
          </div>
        </header>
        <div className="dep599-work">
          <aside>
            <h3>Asset &amp; Method Controls</h3>
            <MoneyControl
              label="Asset cost (P)"
              value={cost}
              max={1000000}
              onChange={(value) =>
                act(() => setCost(Math.max(value, residual + 1)))
              }
            />
            <MoneyControl
              label="Residual value (S)"
              value={residual}
              max={cost - 1}
              onChange={(value) =>
                act(() => setResidual(Math.min(value, cost - 1)))
              }
            />
            <Control
              label="Useful life (n)"
              value={life}
              min={1}
              max={20}
              step={1}
              suffix="years"
              onChange={(value) => act(() => setLife(value))}
            />
            <Control
              label="Reducing-balance rate (r)"
              value={rate}
              min={0}
              max={50}
              step={1}
              suffix="%"
              onChange={(value) => act(() => setRate(value))}
            />
            <fieldset>
              <legend>Methods to compare</legend>
              <label>
                <input
                  type="checkbox"
                  checked={showSl}
                  onChange={(event) =>
                    act(() => setShowSl(event.target.checked))
                  }
                />{" "}
                Straight-line (SL)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showRb}
                  onChange={(event) =>
                    act(() => setShowRb(event.target.checked))
                  }
                />{" "}
                Reducing-balance (RB)
              </label>
            </fieldset>
            <dl>
              <div>
                <dt>End of life book value (SL)</dt>
                <dd>₹{money(end.slBook)}</dd>
                <small>(by design)</small>
              </div>
              <div>
                <dt>End of life book value (RB)</dt>
                <dd>₹{money(end.rbBook)}</dd>
              </div>
            </dl>
            <button className="dep599-reset" onClick={() => act(reset)}>
              <RotateCcw /> Reset to defaults
            </button>
          </aside>
          <main>
            <h3>
              {view === "Graph"
                ? "Book Value Over Time"
                : "Depreciation Schedule"}
            </h3>
            {view === "Graph" ? (
              <svg
                viewBox="0 0 620 280"
                role="img"
                aria-label="Straight-line and reducing-balance book value graph"
              >
                <line x1="55" x2="585" y1="235" y2="235" />
                <line x1="55" x2="55" y1="40" y2="235" />
                {[0, 0.25, 0.5, 0.75, 1].map((part) => (
                  <g key={part}>
                    <line
                      className="grid"
                      x1="55"
                      x2="585"
                      y1={235 - part * 185}
                      y2={235 - part * 185}
                    />
                    <text x="45" y={239 - part * 185}>
                      {Math.round(cost * part).toLocaleString("en-IN")}
                    </text>
                  </g>
                ))}
                {showSl && (
                  <polyline
                    className="sl"
                    points={rows
                      .map((row) => `${x(row.year)},${y(row.slBook)}`)
                      .join(" ")}
                  />
                )}{" "}
                {showRb && (
                  <polyline
                    className="rb"
                    points={rows
                      .map((row) => `${x(row.year)},${y(row.rbBook)}`)
                      .join(" ")}
                  />
                )}
                {rows.map((row) => (
                  <g key={row.year}>
                    {showSl && (
                      <circle
                        className="sl"
                        cx={x(row.year)}
                        cy={y(row.slBook)}
                        r="5"
                      />
                    )}
                    {showRb && (
                      <circle
                        className="rb"
                        cx={x(row.year)}
                        cy={y(row.rbBook)}
                        r="5"
                      />
                    )}
                    <text x={x(row.year)} y="257">
                      {row.year}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <Schedule rows={rows} rate={rate} />
            )}
            <dl className="dep599-summary">
              <div>
                <dt>Year 1 depreciation</dt>
                <dd>
                  SL: ₹{money(rows[1].slDep)}
                  <br />
                  <b>RB: ₹{money(rows[1].rbDep)}</b>
                </dd>
              </div>
              <div>
                <dt>Total depreciation ({life} yrs)</dt>
                <dd>
                  SL: ₹{money(cost - end.slBook)}
                  <br />
                  <b>RB: ₹{money(cost - end.rbBook)}</b>
                </dd>
              </div>
              <div>
                <dt>Difference in method</dt>
                <dd>
                  ₹{money(Math.abs(end.rbBook - end.slBook))}
                  <br />
                  <b>
                    {end.rbBook >= end.slBook
                      ? "(RB leaves higher value)"
                      : "(SL leaves higher value)"}
                  </b>
                </dd>
              </div>
            </dl>
          </main>
        </div>
      </section>
      <section className="dep599-band dep599-pattern">
        <article>
          <h3>2 Notice the Pattern</h3>
          <p>• Straight-line has equal annual depreciation.</p>
          <p>
            • Reducing-balance has larger depreciation early and smaller later.
          </p>
          <p>• Both methods are decreasing and never negative.</p>
        </article>
        <article>
          <h3>Year-by-Year Schedule (Book Value at End of Year)</h3>
          <Schedule rows={rows} rate={rate} />
        </article>
      </section>
      <section className="dep599-band dep599-rule">
        <article>
          <h3>▥ Understand the Rule</h3>
          <p>
            <b>Definitions</b>
            <br />
            Book value after t years: value of asset after t complete years of
            depreciation.
          </p>
          <p>
            <b>Key Rules</b>
            <br />
            Straight-line: B<sub>SL</sub>(t) = P - ((P-S)/n)t
            <br />
            Reducing-balance: B<sub>RB</sub>(t) = P(1-r)<sup>t</sup>
          </p>
        </article>
        <article>
          <h3>⊙ Common Misconception</h3>
          <p>
            <b>Mistake:</b> Assuming reducing-balance also ends at the residual
            value S.
          </p>
          <p>
            <b>Reality:</b> It approaches S but may not reach it exactly; a
            switch method is used in practice.
          </p>
          <svg viewBox="0 0 440 95">
            <line x1="20" x2="420" y1="75" y2="75" />
            <line x1="20" x2="20" y1="10" y2="75" />
            <line className="sl" x1="20" x2="390" y1="12" y2="55" />
            <path className="rb" d="M20 12 Q160 60 390 66" />
          </svg>
          <aside>
            <b>Takeaway</b>
            <br />
            Reducing-balance preserves more value in the later years compared to
            straight-line.
          </aside>
        </article>
      </section>
      <section className="dep599-band dep599-practice">
        <article>
          <h3>✎ Try Independently</h3>
          <p>Change the rate r or life n. Explain:</p>
          <p>1. How does a higher r affect early depreciation?</p>
          <p>2. For which method does more value remain in late years?</p>
        </article>
        <article>
          <h3>☆ Challenge (One Step Further)</h3>
          <p>
            An asset costs ₹120,000, residual value ₹10,000, life 6 years,
            reducing-balance rate 20%.
          </p>
          <p>
            Find the book value at the end of year 3 using the reducing-balance
            method.
          </p>
          <aside>
            Answer
            <br />
            <b>₹{money(120000 * 0.8 ** 3)}</b>
          </aside>
        </article>
      </section>
      <nav className="dep599-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/598-amortisation-table">
          ←{" "}
          <span>
            Previous Lesson<b>Amortisation Table</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/600-inflation">
          <span>
            Next Lesson<b>Inflation</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function MoneyControl({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="dep599-money">
      <b>{label}</b>
      <span>
        ₹{" "}
        <input
          aria-label={label}
          type="number"
          min="0"
          max={max}
          step="1000"
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
      </span>
    </label>
  );
}
function Control({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="dep599-control">
      <b>{label}</b>
      <span>
        <input
          aria-label={`${label} slider`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
        <input
          aria-label={label}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(+event.target.value)}
        />
        {suffix}
      </span>
      <small>
        {min}
        <i>{max}</i>
      </small>
    </label>
  );
}
function Schedule({
  rows,
  rate,
}: {
  rows: Array<{
    year: number;
    slDep: number;
    slBook: number;
    rbDep: number;
    rbBook: number;
  }>;
  rate: number;
}) {
  return (
    <table className="dep599-table">
      <thead>
        <tr>
          <th>Year</th>
          <th>
            Straight-line (SL)
            <br />
            Depreciation
          </th>
          <th>Book Value</th>
          <th>
            Reducing-balance (r = {rate}%)
            <br />
            Depreciation
          </th>
          <th>Book Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.year}>
            <td>{row.year}</td>
            <td>{row.year ? `₹${money(row.slDep)}` : "—"}</td>
            <td>₹{money(row.slBook)}</td>
            <td>{row.year ? `₹${money(row.rbDep)}` : "—"}</td>
            <td>₹{money(row.rbBook)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
