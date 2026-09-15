import { useMemo, useState } from "react";
import { ArrowRight, TriangleAlert } from "lucide-react";
import {
  gatewayAnswerMatches,
  gatewayEnhancements,
  type GatewayEnhancement,
} from "../strengthening/catalogGatewayEnhancements";
import { LessonGatewayDeepFifteen } from "./LessonGatewayDeepFifteen";
import "./LessonGatewayEnhancement.css";

export function LessonGatewayEnhancement({
  lessonId,
  boundLive,
  onInteraction,
}: {
  lessonId: number;
  boundLive?: string;
  onInteraction?: () => void;
}) {
  const spec = gatewayEnhancements[lessonId];
  if (!spec) return null;
  return (
    <>
      <GatewayPanel spec={spec} boundLive={boundLive} onInteraction={onInteraction} />
      <LessonGatewayDeepFifteen lessonId={lessonId} boundLive={boundLive} onInteraction={onInteraction} />
    </>
  );
}

function GatewayPanel({
  spec,
  boundLive,
  onInteraction,
}: {
  spec: GatewayEnhancement;
  boundLive?: string;
  onInteraction?: () => void;
}) {
  const [probe, setProbe] = useState(0.35);
  const [drafts, setDrafts] = useState(["", "", ""]);
  const [checked, setChecked] = useState<Array<boolean | null>>([null, null, null]);
  const live = boundLive ?? spec.liveValue(probe);
  const unlockIds = spec.unlocks.ids.join(", ");

  const results = useMemo(
    () => drafts.map((draft, index) => (checked[index] == null ? null : gatewayAnswerMatches(spec.exams[index], draft))),
    [checked, drafts, spec.exams],
  );

  return (
    <section
      className="lesson-gateway-enhancement"
      data-testid={`lesson-gateway-${spec.id}`}
      aria-label={`${spec.title} gateway enhancement`}
    >
      <header>
        <p>Gateway lesson</p>
        <h2>{spec.title} live model, misconception, and exam ticket</h2>
      </header>
      <div className="lesson-gateway-grid">
        <article>
          <h3>Live canvas value</h3>
          <p className="lesson-gateway-live" aria-live="polite">
            {spec.liveLabel} = <strong>{live}</strong>
          </p>
          {boundLive ? (
            <p>This readout is bound to the interaction already on the canvas.</p>
          ) : (
            <label>
              Canvas probe
              <input
                aria-label={`${spec.title} canvas probe`}
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={probe}
                onChange={(event) => {
                  setProbe(Number(event.target.value));
                  onInteraction?.();
                }}
              />
            </label>
          )}
        </article>
        <article className="lesson-gateway-misconception">
          <h3>
            <TriangleAlert size={14} /> Named misconception
          </h3>
          <p>
            <b>Wrong move.</b> {spec.misconception.wrong}
          </p>
          <p>
            <b>Correction.</b> {spec.misconception.correction}
          </p>
        </article>
        <article>
          <h3>Exam exit ticket</h3>
          <ol>
            {spec.exams.map((item, index) => (
              <li key={item.prompt}>
                <p>{item.prompt}</p>
                <div>
                  <input
                    aria-label={`${spec.title} exam ${index + 1}`}
                    value={drafts[index]}
                    onChange={(event) => {
                      const next = [...drafts];
                      next[index] = event.target.value;
                      setDrafts(next);
                      const flags = [...checked];
                      flags[index] = null;
                      setChecked(flags);
                      onInteraction?.();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const flags = [...checked];
                      flags[index] = true;
                      setChecked(flags);
                      onInteraction?.();
                    }}
                  >
                    Check
                  </button>
                </div>
                {results[index] != null && (
                  <p role="status" className={results[index] ? "ok" : "bad"}>
                    {results[index] ? "Correct." : `Expected ${item.answer}.`}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </article>
      </div>
      <footer>
        <p>
          {spec.unlocks.sentence} {unlockIds ? `Unlocks lesson ${unlockIds}.` : ""}
        </p>
        <a href={spec.unlocks.nextHref}>
          Next: {spec.unlocks.nextLabel}
          <ArrowRight size={14} />
        </a>
      </footer>
    </section>
  );
}
