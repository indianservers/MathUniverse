import AdapterFrame from "../components/AdapterFrame";
import { matrixLessonPreset } from "../presets/matrixLessonPresets";
import type { LessonAdapterProps } from "../types";
import { MatrixConceptActivity } from "./matrix/MatrixConceptActivity";
import { EigenActivity } from "./p0/PriorityConceptActivities";
import MatrixBuilderTargetLesson347 from "./matrix/MatrixBuilderTargetLesson347";
import MatrixAdditionTargetLesson348 from "./matrix/MatrixAdditionTargetLesson348";
import ScalarMultiplicationTargetLesson349 from "./matrix/ScalarMultiplicationTargetLesson349";
import MatrixMultiplicationTargetLesson350 from "./matrix/MatrixMultiplicationTargetLesson350";
import IdentityMatrixTargetLesson351 from "./matrix/IdentityMatrixTargetLesson351";
import TransposeTargetLesson352 from "./matrix/TransposeTargetLesson352";
import DeterminantTargetLesson353 from "./matrix/DeterminantTargetLesson353";

export default function MatrixLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.id === 347)
    return <MatrixBuilderTargetLesson347 {...props} />;
  if (props.lesson.id === 348)
    return <MatrixAdditionTargetLesson348 {...props} />;
  if (props.lesson.id === 349)
    return <ScalarMultiplicationTargetLesson349 {...props} />;
  if (props.lesson.id === 350)
    return <MatrixMultiplicationTargetLesson350 {...props} />;
  if (props.lesson.id === 351)
    return <IdentityMatrixTargetLesson351 {...props} />;
  if (props.lesson.id === 352)
    return <TransposeTargetLesson352 {...props} />;
  if (props.lesson.id === 353)
    return <DeterminantTargetLesson353 {...props} />;
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
