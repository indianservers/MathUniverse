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
import MatrixInverseTargetLesson354 from "./matrix/MatrixInverseTargetLesson354";
import RowOperationsTargetLesson355 from "./matrix/RowOperationsTargetLesson355";
import RrefTargetLesson356 from "./matrix/RrefTargetLesson356";
import AugmentedMatricesTargetLesson357 from "./matrix/AugmentedMatricesTargetLesson357";
import LinearTransformationsTargetLesson358 from "./matrix/LinearTransformationsTargetLesson358";
import EigenTargetLesson359 from "./matrix/EigenTargetLesson359";
import BasisDimensionTargetLesson360 from "./matrix/BasisDimensionTargetLesson360";
import LinearIndependenceTargetLesson361 from "./matrix/LinearIndependenceTargetLesson361";
import VectorSpacesTargetLesson362 from "./matrix/VectorSpacesTargetLesson362";
import GramSchmidtTargetLesson363 from "./matrix/GramSchmidtTargetLesson363";
import LeastSquaresTargetLesson364 from "./matrix/LeastSquaresTargetLesson364";

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
  if (props.lesson.id === 354)
    return <MatrixInverseTargetLesson354 {...props} />;
  if (props.lesson.id === 355)
    return <RowOperationsTargetLesson355 {...props} />;
  if (props.lesson.id === 356)
    return <RrefTargetLesson356 {...props} />;
  if (props.lesson.id === 357)
    return <AugmentedMatricesTargetLesson357 {...props} />;
  if (props.lesson.id === 358)
    return <LinearTransformationsTargetLesson358 {...props} />;
  if (props.lesson.id === 359)
    return <EigenTargetLesson359 {...props} />;
  if (props.lesson.id === 360)
    return <BasisDimensionTargetLesson360 {...props} />;
  if (props.lesson.id === 361)
    return <LinearIndependenceTargetLesson361 {...props} />;
  if (props.lesson.id === 362)
    return <VectorSpacesTargetLesson362 {...props} />;
  if (props.lesson.id === 363)
    return <GramSchmidtTargetLesson363 {...props} />;
  if (props.lesson.id === 364)
    return <LeastSquaresTargetLesson364 {...props} />;
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
