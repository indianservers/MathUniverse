import { useEffect, useMemo, useState } from "react";
import SliderControl, {
  SliderGroup,
} from "../../../../components/ui/SliderControl";
import {
  deriveSequenceConceptModel,
  sequenceConceptConfigs,
  type SequenceInputs,
} from "../../engine/sequenceConceptModels";
import { createLessonInteractionEvent } from "../../engine/lessonInteraction";
import type { SequenceLessonMode } from "../../presets/sequenceLessonPresets";
import type { LessonAdapterProps } from "../../types";

type Props = Pick<LessonAdapterProps, "resetToken" | "onInteraction"> & {
  mode: SequenceLessonMode;
};

export function SequenceConceptActivity({
  mode,
  resetToken,
  onInteraction,
}: Props) {
  const config = sequenceConceptConfigs[mode];
  const [inputs, setInputs] = useState<SequenceInputs>(config.defaults);

  useEffect(() => {
    setInputs(sequenceConceptConfigs[mode].defaults);
  }, [mode, resetToken]);

  const model = useMemo(
    () => deriveSequenceConceptModel(mode, inputs),
    [inputs, mode],
  );
  const chart = useMemo(
    () => sequenceChart(model.terms, model.partialSums),
    [model.partialSums, model.terms],
  );

  const change = (key: keyof SequenceInputs, value: number) => {
    const next = { ...inputs, [key]: value };
    const nextModel = deriveSequenceConceptModel(mode, next);
    setInputs(next);
    onInteraction(
      createLessonInteractionEvent({
        controlId: "primary-control",
        kind: "slider",
        before: inputs,
        after: {
          ...next,
          value: nextModel.value,
          challengePrompt: nextModel.prompt,
          challengeExpected: nextModel.expected,
          challengeHint: nextModel.hint,
          challengeKind: nextModel.challengeKind,
        },
        affectedOutputs: ["sequence-result"],
      }),
    );
  };

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-950 p-3 text-white">
          <svg
            viewBox="0 0 680 300"
            className="h-[280px] w-full"
            role="img"
            aria-label={model.summary}
          >
            <line
              x1="45"
              x2="650"
              y1={chart.zeroY}
              y2={chart.zeroY}
              stroke="#64748b"
              strokeWidth="2"
            />
            {chart.terms.map((item, index) => (
              <g key={`term-${index}`}>
                <line
                  x1={item.x}
                  x2={item.x}
                  y1={chart.zeroY}
                  y2={item.y}
                  stroke="#22d3ee"
                  strokeWidth="7"
                  opacity=".55"
                />
                <circle cx={item.x} cy={item.y} r="5" fill="#22d3ee" />
                <text
                  x={item.x}
                  y="286"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                >
                  {index + 1}
                </text>
              </g>
            ))}
            <polyline
              points={chart.partialCoordinates}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex flex-wrap gap-3 text-xs font-bold">
            <span className="text-cyan-300">● Terms</span>
            <span className="text-amber-300">— Partial sums</span>
          </div>
          <output
            id="sequence-result"
            aria-live="polite"
            className="mt-2 block rounded-lg bg-white/10 p-3"
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

        <div
          className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10"
          aria-label="Term and partial-sum table"
        >
          <table className="w-full min-w-[460px] text-right text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-white/10">
                <th className="p-2 text-left">n</th>
                {model.terms.map((_, index) => (
                  <th key={index} className="p-2">
                    {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200 dark:border-white/10">
                <th className="p-2 text-left">aₙ</th>
                {model.terms.map((value, index) => (
                  <td key={index} className="p-2 font-mono">
                    {format(value)}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-slate-200 dark:border-white/10">
                <th className="p-2 text-left">Sₙ</th>
                {model.partialSums.map((value, index) => (
                  <td key={index} className="p-2 font-mono">
                    {format(value)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <SliderGroup title="Active sequence">
          {(["a", "b", "n"] as const).map((key, index) => {
            const spec = config.controls[index];
            return (
              <SliderControl
                key={key}
                density="compact"
                label={spec.label}
                value={inputs[key]}
                min={spec.min}
                max={spec.max}
                step={spec.step}
                onChange={(value) => change(key, value)}
              />
            );
          })}
        </SliderGroup>
        <div className="rounded-xl bg-cyan-50 p-3 text-cyan-950 dark:bg-cyan-400/10 dark:text-cyan-50">
          <p className="font-mono text-sm font-black">{model.formula}</p>
          <p className="mt-2 text-xs font-semibold">{model.prompt}</p>
        </div>
      </div>
    </div>
  );
}

function sequenceChart(terms: number[], partialSums: number[]) {
  const all = [...terms, ...partialSums, 0];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = Math.max(1, max - min);
  const toY = (value: number) => 260 - ((value - min) / range) * 225;
  const toX = (index: number) =>
    55 + (index / Math.max(1, terms.length - 1)) * 585;
  const termPoints = terms.map((value, index) => ({
    x: toX(index),
    y: toY(value),
  }));
  const partialPoints = partialSums.map((value, index) => ({
    x: toX(index),
    y: toY(value),
  }));
  return {
    terms: termPoints,
    zeroY: toY(0),
    partialCoordinates: partialPoints
      .map((item) => `${item.x},${item.y}`)
      .join(" "),
  };
}

function format(value: number) {
  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(3).replace(/\.?0+$/, "");
}
