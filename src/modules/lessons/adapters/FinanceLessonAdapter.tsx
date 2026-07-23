import AdapterFrame from "../components/AdapterFrame";
import { financeLessonPreset } from "../presets/financeLessonPresets";
import type { LessonAdapterProps } from "../types";
import { FinanceConceptActivity } from "./finance/FinanceConceptActivity";
import { SimpleInterestActivity } from "./p0/PriorityConceptActivities";

export default function FinanceLessonAdapter(props: LessonAdapterProps) {
  const mode = financeLessonPreset(props.lesson.id).mode;
  if (mode === "simple-interest") {
    return (
      <AdapterFrame
        title={`${props.lesson.title} · simple-interest model`}
        footer="The table and graph use I = P × r × t; no amortisation model is substituted."
      >
        <SimpleInterestActivity {...props} />
      </AdapterFrame>
    );
  }
  return (
    <AdapterFrame
      title={`${props.lesson.title} · finance and modelling lab`}
      footer="The controls, linked chart, derived values, and Check challenge use this lesson's explicit finance preset."
    >
      <FinanceConceptActivity mode={mode} {...props} />
    </AdapterFrame>
  );
}
