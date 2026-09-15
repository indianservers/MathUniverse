import { useEffect, useMemo, useState } from "react";
import { Check, Copy, KeyRound, RefreshCw, ShieldCheck, TriangleAlert } from "lucide-react";
import {
  gatewayAnswerMatches,
  gatewayEnhancements,
} from "../strengthening/catalogGatewayEnhancements";
import {
  fillDeepTemplate,
  gatewayDeepFifteen,
  type DeepFifteen,
} from "../strengthening/catalogGatewayDeepFifteen";
import "./LessonGatewayDeepFifteen.css";

export function LessonGatewayDeepFifteen({
  lessonId,
  boundLive,
  onInteraction,
}: {
  lessonId: number;
  boundLive?: string;
  onInteraction?: () => void;
}) {
  const spec = gatewayDeepFifteen[lessonId];
  const gateway = gatewayEnhancements[lessonId];
  if (!spec || !gateway) return null;
  return (
    <DeepFifteenPanel
      spec={spec}
      title={gateway.title}
      boundLive={boundLive}
      fallbackLive={gateway.liveValue}
      onInteraction={onInteraction}
    />
  );
}

function DeepFifteenPanel({
  spec,
  title,
  boundLive,
  fallbackLive,
  onInteraction,
}: {
  spec: DeepFifteen;
  title: string;
  boundLive?: string;
  fallbackLive: (t: number) => string;
  onInteraction?: () => void;
}) {
  const [probe, setProbe] = useState(0.35);
  const [trapOn, setTrapOn] = useState(true);
  const [counterOn, setCounterOn] = useState(false);
  const [hatchOn, setHatchOn] = useState(false);
  const [boardDraft, setBoardDraft] = useState("");
  const [boardChecked, setBoardChecked] = useState<boolean | null>(null);
  const [probeDraft, setProbeDraft] = useState("");
  const [probeChecked, setProbeChecked] = useState<boolean | null>(null);
  const [seed, setSeed] = useState(0);
  const [keyStep, setKeyStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [gateMarked, setGateMarked] = useState(false);
  const live = boundLive ?? fallbackLive(probe);
  const fill = (value: string) => fillDeepTemplate(value, live, probe);
  const generated = spec.generator.items.map((item) => fill(item).replace("{seed}", String(seed)));
  const boardOk = boardChecked == null ? null : gatewayAnswerMatches(spec.boardExam, boardDraft);
  const probeOk = probeChecked == null ? null : gatewayAnswerMatches(spec.probe, probeDraft);
  const gateOpen = Boolean(probeOk && gateMarked);
  const spoken = fill(spec.spoken);
  const identity = fill(spec.identity);
  const copyText = fill(spec.copyExact);
  const worked = spec.workedFromLive.map((step) => fill(step));

  const notify = () => onInteraction?.();

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const keyboardHint = useMemo(
    () => `${spec.keyboard.keys} · step ${keyStep + 1}: ${spec.keyboard.action}`,
    [keyStep, spec.keyboard],
  );

  return (
    <section
      className="lesson-gateway-deep"
      data-testid={`lesson-gateway-deep-${spec.id}`}
      aria-label={`${title} fifteen topic enhancements`}
    >
      <header>
        <p>15 topic enhancements</p>
        <h2>{title} canvas, traps, generator, and unlock gate</h2>
      </header>
      <div className="lesson-gateway-deep-grid">
        <article data-deep-slot="1">
          <h3>1. Topic canvas object</h3>
          <p className="lesson-gateway-deep-kicker">{spec.canvas.title}</p>
          <ul className="lesson-gateway-deep-layers">
            {spec.canvas.layers.map((layer) => (
              <li key={layer}>{fill(layer)}</li>
            ))}
          </ul>
          <p className="lesson-gateway-deep-forbidden">Forbidden: {spec.canvas.forbidden}</p>
          {boundLive ? null : (
            <label>
              Live seed
              <input
                aria-label={`${title} deep probe`}
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={probe}
                onChange={(event) => {
                  setProbe(Number(event.target.value));
                  notify();
                }}
              />
            </label>
          )}
        </article>
        <article data-deep-slot="2" className={trapOn ? "is-trap" : "is-clear"}>
          <h3>2. Trap overlay</h3>
          <p>
            <b>{trapOn ? "Wrong picture." : "Corrected picture."}</b> {trapOn ? spec.trap.wrong : spec.trap.right}
          </p>
          <button
            type="button"
            onClick={() => {
              setTrapOn((value) => !value);
              notify();
            }}
          >
            {trapOn ? "Show correction" : "Show trap"}
          </button>
        </article>
        <article data-deep-slot="3">
          <h3>3. Linked identity</h3>
          <p className="lesson-gateway-deep-live" aria-live="polite">
            {identity}
          </p>
        </article>
        <article data-deep-slot="4">
          <h3>
            <TriangleAlert size={14} /> 4. Second misconception
          </h3>
          <p>
            <b>Wrong move.</b> {spec.secondMisconception.wrong}
          </p>
          <p>
            <b>Correction.</b> {spec.secondMisconception.correction}
          </p>
        </article>
        <article data-deep-slot="5">
          <h3>5. Counterexample</h3>
          <p>{spec.counterexample.setup}</p>
          <button
            type="button"
            onClick={() => {
              setCounterOn((value) => !value);
              notify();
            }}
          >
            {counterOn ? "Hide result" : "Reveal counterexample"}
          </button>
          {counterOn ? <p className="ok">{spec.counterexample.result}</p> : null}
        </article>
        <article data-deep-slot="6">
          <h3>6. Board-exam item</h3>
          <p>{spec.boardExam.prompt}</p>
          <div>
            <input
              aria-label={`${title} board exam`}
              value={boardDraft}
              onChange={(event) => {
                setBoardDraft(event.target.value);
                setBoardChecked(null);
                notify();
              }}
            />
            <button
              type="button"
              onClick={() => {
                setBoardChecked(true);
                notify();
              }}
            >
              Check
            </button>
          </div>
          {boardOk != null && (
            <p role="status" className={boardOk ? "ok" : "bad"}>
              {boardOk ? "Correct." : `Expected ${spec.boardExam.answer}.`}
            </p>
          )}
        </article>
        <article data-deep-slot="7">
          <h3>7. Spoken sentence</h3>
          <p className="lesson-gateway-deep-live" aria-live="polite">
            {spoken}
          </p>
        </article>
        <article data-deep-slot="8">
          <h3>
            <KeyRound size={14} /> 8. Keyboard handle
          </h3>
          <p>{keyboardHint}</p>
          <button
            type="button"
            aria-label={`${title} keyboard handle`}
            onKeyDown={(event) => {
              if (event.key.length === 1 || event.key.startsWith("Arrow")) {
                setKeyStep((value) => value + 1);
                notify();
              }
            }}
            onClick={() => {
              setKeyStep((value) => value + 1);
              notify();
            }}
          >
            Focus and use {spec.keyboard.keys}
          </button>
        </article>
        <article data-deep-slot="9">
          <h3>9. Next-lesson handoff</h3>
          <p>{spec.handoff.sentence}</p>
          <a href={spec.handoff.href}>Next: {spec.handoff.label}</a>
        </article>
        <article data-deep-slot="10">
          <h3>10. Seeded generator</h3>
          <p>{fill(spec.generator.seed)}</p>
          <ol>
            {generated.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => {
              setSeed((value) => value + 1);
              setProbe((value) => Math.min(1, Number((value + 0.13).toFixed(2))));
              notify();
            }}
          >
            <RefreshCw size={14} /> Seed new items
          </button>
        </article>
        <article data-deep-slot="11" className={hatchOn ? "is-hatch" : undefined}>
          <h3>11. Error hatch</h3>
          <p>
            <b>Trigger.</b> {spec.errorHatch.trigger}
          </p>
          <button
            type="button"
            onClick={() => {
              setHatchOn((value) => !value);
              notify();
            }}
          >
            {hatchOn ? "Clear hatch" : "Show hatch"}
          </button>
          {hatchOn ? <p className="bad">{spec.errorHatch.message}</p> : null}
        </article>
        <article data-deep-slot="12">
          <h3>12. Copy exact answer</h3>
          <pre>{copyText}</pre>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard?.writeText(copyText);
              } catch {
                /* ignore missing clipboard in SSR tests */
              }
              setCopied(true);
              notify();
            }}
          >
            <Copy size={14} /> {copied ? "Copied" : "Copy"}
          </button>
        </article>
        <article data-deep-slot="13">
          <h3>13. Live worked example</h3>
          <ol>
            {worked.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
        <article data-deep-slot="14">
          <h3>14. Yes/no probe</h3>
          <p>{spec.probe.prompt}</p>
          <div>
            <input
              aria-label={`${title} deep probe answer`}
              value={probeDraft}
              onChange={(event) => {
                setProbeDraft(event.target.value);
                setProbeChecked(null);
                notify();
              }}
            />
            <button
              type="button"
              onClick={() => {
                setProbeChecked(true);
                notify();
              }}
            >
              Check
            </button>
          </div>
          {probeOk != null && (
            <p role="status" className={probeOk ? "ok" : "bad"}>
              {probeOk ? "Correct." : `Expected ${spec.probe.answer}.`}
            </p>
          )}
        </article>
        <article data-deep-slot="15" className={gateOpen ? "is-open" : undefined}>
          <h3>
            <ShieldCheck size={14} /> 15. Unlock gate
          </h3>
          <p>{spec.unlockGate.requirement}</p>
          <label>
            <input
              type="checkbox"
              checked={gateMarked}
              onChange={(event) => {
                setGateMarked(event.target.checked);
                notify();
              }}
            />
            {spec.unlockGate.checkLabel}
          </label>
          <p role="status" className={gateOpen ? "ok" : "bad"}>
            {gateOpen ? (
              <>
                <Check size={14} /> Gate open. Probe correct and canvas check marked.
              </>
            ) : (
              "Gate locked until the probe is correct and the canvas check is marked."
            )}
          </p>
        </article>
      </div>
    </section>
  );
}
