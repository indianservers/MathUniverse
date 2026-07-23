import AdapterFrame from "../components/AdapterFrame";
import { sequenceLessonPreset } from "../presets/sequenceLessonPresets";
import type { LessonAdapterProps } from "../types";
import { SequenceConceptActivity } from "./sequence/SequenceConceptActivity";

export default function SequenceLessonAdapter(props: LessonAdapterProps) {
  const mode = sequenceLessonPreset(props.lesson.id).mode;
  return (
    <AdapterFrame
      title={`${props.lesson.title} · sequence and series lab`}
      footer="The explicit preset links its terms, partial sums, formula, accessible summary, and current-state Check challenge."
    >
      <SequenceConceptActivity mode={mode} {...props} />
    </AdapterFrame>
  );
}
