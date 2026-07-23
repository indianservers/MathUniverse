import { useEffect, useMemo, useState } from "react";
import SliderControl from "../../../../components/ui/SliderControl";
import {
  deriveMatrixConceptModel,
  matrixConceptConfigs,
  type MatrixInputs,
} from "../../engine/matrixConceptModels";
import { createLessonInteractionEvent } from "../../engine/lessonInteraction";
import type { MatrixLessonMode } from "../../presets/matrixLessonPresets";
import type { LessonAdapterProps } from "../../types";

type Props = Pick<LessonAdapterProps, "resetToken" | "onInteraction"> & {
  mode: Exclude<MatrixLessonMode, "eigen-directions">;
};

export function MatrixConceptActivity({
  mode,
  resetToken,
  onInteraction,
}: Props) {
  const config = matrixConceptConfigs[mode];
  const [inputs, setInputs] = useState<MatrixInputs>(config.defaults);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setInputs(matrixConceptConfigs[mode].defaults);
    setStep(0);
  }, [mode, resetToken]);

  const model = useMemo(
    () => deriveMatrixConceptModel(mode, inputs),
    [inputs, mode],
  );
  const vectors = useMemo(() => vectorGeometry(model.vectors), [model.vectors]);

  const emit = (
    before: unknown,
    next: MatrixInputs,
    kind: "input" | "slider" | "playback" = "input",
  ) => {
    const nextModel = deriveMatrixConceptModel(mode, next);
    onInteraction(
      createLessonInteractionEvent({
        controlId: "primary-control",
        kind,
        before,
        after: {
          ...next,
          value: nextModel.value,
          challengePrompt: nextModel.prompt,
          challengeExpected: nextModel.expected,
          challengeHint: nextModel.hint,
          challengeKind: nextModel.challengeKind,
        },
        affectedOutputs: ["matrix-result"],
      }),
    );
  };
  const change = (key: keyof MatrixInputs, value: number) => {
    const next = { ...inputs, [key]: value };
    setInputs(next);
    setStep(0);
    emit(inputs, next, key === "k" ? "slider" : "input");
  };
  const activeStep =
    model.steps[Math.min(step, Math.max(0, model.steps.length - 1))];

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-950 p-3 text-white">
          <svg
            viewBox="0 0 640 340"
            className="h-[300px] w-full"
            role="img"
            aria-label={model.summary}
          >
            <line
              x1="0"
              x2="640"
              y1="170"
              y2="170"
              stroke="#475569"
            />
            <line
              x1="320"
              x2="320"
              y1="0"
              y2="340"
              stroke="#475569"
            />
            <rect
              x="260"
              y="110"
              width="120"
              height="120"
              fill="#94a3b8"
              opacity=".08"
              stroke="#64748b"
              strokeDasharray="7 5"
            />
            {vectors.map((vector) => (
              <g key={vector.label}>
                <line
                  x1="320"
                  y1="170"
                  x2={vector.x}
                  y2={vector.y}
                  stroke={vector.colour}
                  strokeWidth="5"
                />
                <circle
                  cx={vector.x}
                  cy={vector.y}
                  r="7"
                  fill={vector.colour}
                />
                <text
                  x={vector.x + 8}
                  y={vector.y - 8}
                  fill={vector.colour}
                  fontWeight="900"
                >
                  {vector.label}
                </text>
              </g>
            ))}
          </svg>
          <output
            id="matrix-result"
            aria-live="polite"
            className="block rounded-lg bg-white/10 p-3"
          >
            <span className="block text-xs font-black uppercase text-cyan-300">
              {model.label}
            </span>
            <span className="mt-1 block text-3xl font-black">
              {model.display}
            </span>
            <span className="mt-1 block text-sm text-slate-300">
              {model.insight}
            </span>
          </output>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <MatrixTable title="Active result" matrix={model.resultMatrix} />
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-black uppercase text-slate-500">
              Computation
            </p>
            <p className="mt-2 font-mono text-sm font-black">{model.formula}</p>
            <p className="mt-2 min-h-10 text-xs">{activeStep ?? model.insight}</p>
            <button
              type="button"
              className="action-secondary mt-3 min-h-11 w-full justify-center"
              disabled={model.steps.length < 2}
              onClick={() => {
                const nextStep =
                  (step + 1) % Math.max(1, model.steps.length);
                setStep(nextStep);
                emit(step, inputs, "playback");
              }}
            >
              Next computation step
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="mb-3 text-xs font-black uppercase text-slate-500">
            Editable values
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(["a", "b", "c", "d"] as const).map((key, index) => (
              <label key={key} className="text-xs font-bold text-slate-500">
                {config.entryLabels[index]}
                <input
                  type="number"
                  value={inputs[key]}
                  step="0.5"
                  aria-label={`${config.entryLabels[index]} exact value`}
                  className="lesson-input mt-1 min-h-11"
                  onChange={(event) => change(key, Number(event.target.value))}
                />
              </label>
            ))}
          </div>
        </div>
        {config.scalar ? (
          <SliderControl
            density="compact"
            label={config.scalar.label}
            value={inputs.k}
            min={config.scalar.min}
            max={config.scalar.max}
            step={config.scalar.step}
            onChange={(value) => change("k", value)}
          />
        ) : null}
        <div className="rounded-xl bg-cyan-50 p-3 text-cyan-950 dark:bg-cyan-400/10 dark:text-cyan-50">
          <p className="text-xs font-semibold">{model.prompt}</p>
        </div>
      </div>
    </div>
  );
}

function MatrixTable({ title, matrix }: { title: string; matrix: number[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-black uppercase text-slate-500">{title}</p>
      {matrix.length ? (
        <table className="mt-2 w-full border-separate border-spacing-1 text-center font-mono text-sm">
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, columnIndex) => (
                  <td
                    key={columnIndex}
                    className="min-w-14 rounded-lg bg-white p-2 font-bold dark:bg-slate-900"
                  >
                    {format(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-2 text-sm font-bold text-amber-700">
          No matrix result for this state.
        </p>
      )}
    </div>
  );
}

function vectorGeometry(
  vectors: { label: string; x: number; y: number; colour: string }[],
) {
  const extent = Math.max(
    1,
    ...vectors.flatMap((vector) => [Math.abs(vector.x), Math.abs(vector.y)]),
  );
  const scale = Math.min(65, 125 / extent);
  return vectors.map((vector) => ({
    ...vector,
    x: 320 + vector.x * scale,
    y: 170 - vector.y * scale,
  }));
}

function format(value: number) {
  return Math.abs(value) < 1e-10
    ? "0"
    : Number(value.toFixed(3)).toString();
}
