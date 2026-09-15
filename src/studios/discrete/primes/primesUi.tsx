import { useEffect, useRef, useState, type ReactNode } from "react";
import MathExpression from "../../../components/ui/MathExpression";

export function PlaybackBar({
  playing,
  onPlay,
  onPause,
  onPrev,
  onNext,
  onReset,
  onRandom,
  onAuto,
  speed,
  onSpeed,
  autoLabel = "Auto Play",
  disablePrev,
  disableNext,
  hideAuto,
}: {
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onRandom: () => void;
  onAuto?: () => void;
  speed: number;
  onSpeed: (n: number) => void;
  autoLabel?: string;
  disablePrev?: boolean;
  disableNext?: boolean;
  hideAuto?: boolean;
}) {
  return (
    <div className="msk-btn-row primes-play">
      <button type="button" className="msk-soft" onClick={onReset}>Reset</button>
      <button type="button" className="msk-soft" onClick={onRandom}>Random example</button>
      <button type="button" className="msk-soft" onClick={playing ? onPause : onPlay} aria-pressed={playing}>
        {playing ? "Pause" : "Play"}
      </button>
      <button type="button" className="msk-soft" onClick={onPrev} disabled={disablePrev}>Previous Step</button>
      <button type="button" className="msk-soft" onClick={onNext} disabled={disableNext}>Next Step</button>
      {onAuto && !hideAuto ? <button type="button" className="msk-soft" onClick={onAuto}>{autoLabel}</button> : null}
      <label className="msk-field primes-speed">
        <span>Speed</span>
        <input type="range" min={1} max={5} step={1} value={speed} onChange={(e) => onSpeed(Number(e.target.value))} aria-label="Animation speed" />
      </label>
    </div>
  );
}

export function useStepPlayer(playing: boolean, speed: number, onTick: () => void, enabled = true) {
  const tick = useRef(onTick);
  tick.current = onTick;
  useEffect(() => {
    if (!playing || !enabled) return;
    const delay = [0, 600, 450, 320, 220, 140][speed] ?? 320;
    const id = window.setInterval(() => tick.current(), delay);
    return () => window.clearInterval(id);
  }, [playing, speed, enabled]);
}

export function Tip({ term, children }: { term: string; children: ReactNode }) {
  const text = typeof children === "string" ? children : term;
  return <abbr className="primes-tip" title={text}>{term}</abbr>;
}

export function Feedback({ ok, text }: { ok: boolean | null; text: string }) {
  if (!text) return null;
  return <p className={ok ? "msk-ok" : "msk-note"} role="status">{text}</p>;
}

export function Formula({ value }: { value: string }) {
  return (
    <span className="msk-formula primes-math">
      <MathExpression value={value} />
    </span>
  );
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ChallengeCard({
  prompt,
  expected,
  hint,
  onNew,
  reveal,
  check,
}: {
  prompt: string;
  expected: number | string;
  hint: string;
  onNew: () => void;
  reveal?: boolean;
  check?: (raw: string) => boolean;
}) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  return (
    <div className="msk-challenge">
      <span>Challenge</span>
      <p>{prompt}</p>
      <input
        value={answer}
        placeholder="Enter a whole number or short word"
        aria-label="Challenge answer"
        onChange={(e) => { setAnswer(e.target.value); setStatus(""); setOk(null); }}
      />
      <div className="msk-btn-row">
        <button className="msk-cta" type="button" onClick={() => {
          const left = answer.trim().toLowerCase().replace(/\s+/g, "");
          const right = String(expected).trim().toLowerCase().replace(/\s+/g, "");
          const numeric = Number(left.replace(/,/g, ""));
          const target = typeof expected === "number" ? expected : Number(right);
          const match = check
            ? check(answer)
            : left === right || (Number.isFinite(numeric) && Number.isFinite(target) && numeric === target);
          setOk(match);
          setStatus(match ? "Correct — that matches the live calculation." : hint);
        }}>Check</button>
        <button type="button" className="msk-soft" onClick={() => { setAnswer(""); setStatus(""); setOk(null); onNew(); }}>New challenge</button>
      </div>
      {status ? <p role="status">{status}</p> : null}
      {reveal && ok === false ? <p className="msk-note">Teacher reveal: {String(expected)}</p> : null}
    </div>
  );
}
