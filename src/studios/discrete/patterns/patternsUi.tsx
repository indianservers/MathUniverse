import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export function usePlayer(playing: boolean, speed: number, tick: () => void) {
  const fn = useRef(tick);
  fn.current = tick;
  useEffect(() => {
    if (!playing) return;
    const delay = [0, 700, 500, 340, 220, 140][speed] ?? 340;
    const id = window.setInterval(() => fn.current(), delay);
    return () => window.clearInterval(id);
  }, [playing, speed]);
}

export function ChallengeBox({
  prompt,
  expected,
  hint,
  onNew,
  reveal,
}: {
  prompt: string;
  expected: number | string;
  hint: string;
  onNew: () => void;
  reveal?: boolean;
}) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  return (
    <div className="np-challenge">
      <b>Challenge</b>
      <p className="np-note">{prompt}</p>
      <input value={answer} aria-label="Challenge answer" onChange={(e) => { setAnswer(e.target.value); setStatus(""); setOk(null); }} />
      <div className="np-row">
        <button type="button" className="np-go" style={{ width: "auto", minHeight: 36, margin: 0, padding: "0 14px" }} onClick={() => {
          const left = answer.trim().toLowerCase().replace(/\s+/g, "");
          const right = String(expected).trim().toLowerCase().replace(/\s+/g, "");
          const num = Number(left);
          const target = typeof expected === "number" ? expected : Number(right);
          const match = left === right || (Number.isFinite(num) && num === target);
          setOk(match);
          setStatus(match ? "Correct — that matches the live calculation." : hint);
        }}>Check</button>
        <button type="button" className="np-ghost" onClick={() => { setAnswer(""); setStatus(""); setOk(null); onNew(); }}>New</button>
      </div>
      {status ? <p className={ok ? "np-ok" : "np-fail"} role="status">{status}</p> : null}
      {reveal && ok === false ? <p className="np-note">Teacher reveal: {String(expected)}</p> : null}
    </div>
  );
}

export function Live({ color, label, value }: { color: string; label: string; value: ReactNode }) {
  return (
    <div className="np-live">
      <i style={{ background: color }} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function NControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="np-label" style={{ display: "grid", gap: 6 }}>
      <span style={{ display: "flex", justifyContent: "space-between" }}>{label}</span>
      <div className="np-slider">
        <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
        <input className="np-num" type="number" min={min} max={max} value={value} onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isInteger(n)) onChange(Math.min(max, Math.max(min, n)));
        }} />
      </div>
    </label>
  );
}
