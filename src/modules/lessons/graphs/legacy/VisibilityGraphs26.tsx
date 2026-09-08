import type {CSSProperties} from "react";
const display=(value:number)=>Number.isInteger(value)?String(value):value.toFixed(1);
export function LegacyNumberLine26({
  x,
  boundary,
  operator,
  onX,
}: {
  x: number;
  boundary: number;
  operator: string;
  onX: (value: number) => void;
}) {
  const threshold = Math.max(0, Math.min(100, (boundary + 5) * 10)),
    value = Math.max(0, Math.min(100, (x + 5) * 10)),
    right = operator.includes(">"),
    inclusive = operator.includes("=");
  return (
    <section
      className="condition-line"
      style={{ "--boundary": `${threshold}%` } as CSSProperties}
    >
      <div
        className="hidden-region"
        style={
          right
            ? { left: 0, width: `${threshold}%` }
            : { left: `${threshold}%`, right: 0 }
        }
      >
        <b>HIDDEN REGION</b>
        <span>
          x {right ? "<" : ">"} {display(boundary)}
        </span>
      </div>
      <div
        className="visible-region"
        style={
          right
            ? { left: `${threshold}%`, right: 0 }
            : { left: 0, width: `${threshold}%` }
        }
      >
        <b>VISIBLE REGION</b>
        <span>
          x {operator} {display(boundary)}
        </span>
      </div>
      <input
        aria-label="Visibility number line drag control"
        type="range"
        min="-5"
        max="5"
        step=".1"
        value={x}
        onChange={(event) => onX(Number(event.target.value))}
      />
      <i
        className={inclusive ? "closed" : "open"}
        style={{ left: `${threshold}%` }}
      />
      <output style={{ left: `${value}%` }}>{display(x)}</output>
      <footer>
        {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((number) => (
          <span key={number}>{number}</span>
        ))}
      </footer>
    </section>
  );
}
export function LegacyObjectPlot26({ visible }: { visible: boolean }) {
  return (
    <section className="object-plot">
      <span className="axis x" />
      <span className="axis y" />
      <div className={visible ? "object visible" : "object hidden"}>
        {visible ? "★" : ""}
      </div>
      <b>{visible ? "Object P" : "Object P hidden"}</b>
    </section>
  );
}
export function LegacyMiniPlot26({ visible }: { visible: boolean }) {
  return (
    <div className="mini-plot">
      <span />
      <i className={visible ? "visible" : ""}>{visible ? "★" : ""}</i>
    </div>
  );
}

