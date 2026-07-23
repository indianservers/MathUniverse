import { useEffect, useMemo, useState } from "react";
import SliderControl, {
  SliderGroup,
} from "../../../../components/ui/SliderControl";
import {
  deriveFinanceConceptModel,
  financeConceptConfigs,
  type FinanceInputs,
} from "../../engine/financeConceptModels";
import { createLessonInteractionEvent } from "../../engine/lessonInteraction";
import type { FinanceLessonMode } from "../../presets/financeLessonPresets";
import type { LessonAdapterProps } from "../../types";

type Props = Pick<LessonAdapterProps, "resetToken" | "onInteraction"> & {
  mode: Exclude<FinanceLessonMode, "simple-interest">;
};

export function FinanceConceptActivity({
  mode,
  resetToken,
  onInteraction,
}: Props) {
  const config = financeConceptConfigs[mode];
  const [inputs, setInputs] = useState<FinanceInputs>(config.defaults);

  useEffect(() => {
    setInputs(financeConceptConfigs[mode].defaults);
  }, [mode, resetToken]);

  const model = useMemo(
    () => deriveFinanceConceptModel(mode, inputs),
    [inputs, mode],
  );
  const chart = useMemo(() => chartGeometry(model.points), [model.points]);

  const change = (key: keyof FinanceInputs, value: number) => {
    const next = { ...inputs, [key]: value };
    const nextModel = deriveFinanceConceptModel(mode, next);
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
          challengeKind: "numeric",
        },
        affectedOutputs: ["finance-result"],
      }),
    );
  };

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-950 p-3 text-white">
          <svg
            viewBox="0 0 640 260"
            className="h-64 w-full"
            role="img"
            aria-label={model.summary}
          >
            <line
              x1="48"
              y1="220"
              x2="615"
              y2="220"
              stroke="#64748b"
              strokeWidth="2"
            />
            <line
              x1="48"
              y1="20"
              x2="48"
              y2="220"
              stroke="#64748b"
              strokeWidth="2"
            />
            {mode !== "linear-programming" && (
              <polyline
                points={chart.coordinates}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            {chart.points.map((item, index) => (
              <g key={`${item.label}-${index}`}>
                <circle
                  cx={item.cx}
                  cy={item.cy}
                  r={mode === "linear-programming" ? 4 : 6}
                  fill={index === chart.points.length - 1 ? "#f59e0b" : "#22d3ee"}
                />
                {(chart.points.length <= 14 ||
                  index === chart.points.length - 1) && (
                  <text
                    x={item.cx}
                    y={Math.max(14, item.cy - 10)}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                  >
                    {item.label}
                  </text>
                )}
              </g>
            ))}
          </svg>
          <output
            id="finance-result"
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
              {model.secondary}
            </span>
          </output>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {model.rows.slice(0, 12).map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5"
            >
              <span className="block text-[11px] font-black uppercase text-slate-500">
                {item.label}
              </span>
              <span className="mt-1 block break-words font-mono text-xs font-bold">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SliderGroup title="Active assumptions">
          {(["a", "b", "c"] as const).map((key, index) => {
            const control = config.controls[index];
            return (
              <SliderControl
                key={key}
                density="compact"
                label={control.label}
                value={inputs[key]}
                min={control.min}
                max={control.max}
                step={control.step}
                unit={control.unit}
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

function chartGeometry(
  points: { x: number; y: number; label: string }[],
) {
  const safe = points.length ? points : [{ x: 0, y: 0, label: "0" }];
  const xs = safe.map((item) => item.x);
  const ys = safe.map((item) => item.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const normalized = safe.map((item) => ({
    ...item,
    cx: 48 + ((item.x - minX) / width) * 567,
    cy: 220 - ((item.y - minY) / height) * 190,
  }));
  return {
    points: normalized,
    coordinates: normalized.map((item) => `${item.cx},${item.cy}`).join(" "),
  };
}
