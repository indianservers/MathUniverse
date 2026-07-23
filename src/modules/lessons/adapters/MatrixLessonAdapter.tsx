import AdapterFrame from "../components/AdapterFrame";
import { matrixLessonPreset } from "../presets/matrixLessonPresets";
import type { LessonAdapterProps } from "../types";
import { MatrixConceptActivity } from "./matrix/MatrixConceptActivity";
import { EigenActivity } from "./p0/PriorityConceptActivities";

export default function MatrixLessonAdapter(props: LessonAdapterProps) {
  const mode = matrixLessonPreset(props.lesson.id).mode;
  if (mode === "eigen-directions") {
    return (
      <AdapterFrame
        title={`${props.lesson.title} · eigendirection lab`}
        footer="Matrix entries drive the characteristic polynomial, eigen-directions, and transformed vector together."
      >
        <EigenActivity {...props} />
      </AdapterFrame>
    );
  }
  return (
    <AdapterFrame
      title={`${props.lesson.title} · matrix and linear-algebra lab`}
      footer="The explicit preset links editable values, engine-derived computation steps, the vector view, and the current-state Check challenge."
    >
      <MatrixConceptActivity mode={mode} {...props} />
    </AdapterFrame>
  );
}
