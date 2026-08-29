import AdapterFrame from "../components/AdapterFrame";
import ReusableLessonEngine, {
  reusableEngineParamsFor,
} from "../components/ReusableLessonEngine";
import type { LessonAdapterProps } from "../types";
import SymbolicCasMockupLesson from "./cas/SymbolicCasMockupLesson";
import SymbolicEvaluationTargetLesson428 from "./cas/SymbolicEvaluationTargetLesson428";
import SimplifyTargetLesson429 from "./cas/SimplifyTargetLesson429";
import ExpandTargetLesson430 from "./cas/ExpandTargetLesson430";
import FactorTargetLesson431 from "./cas/FactorTargetLesson431";
import { DifferentialEquationActivity } from "./p0/PriorityConceptActivities";

export default function CasLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.id === 428) {
    return <SymbolicEvaluationTargetLesson428 {...props} />;
  }
  if (props.lesson.id === 429) {
    return <SimplifyTargetLesson429 {...props} />;
  }
  if (props.lesson.id === 430) {
    return <ExpandTargetLesson430 {...props} />;
  }
  if (props.lesson.id === 431) {
    return <FactorTargetLesson431 {...props} />;
  }
  if (props.lesson.id >= 428 && props.lesson.id <= 449) {
    return <SymbolicCasMockupLesson {...props} />;
  }

  if (props.lesson.preset.id === "cas.first-order-ode") {
    return (
      <AdapterFrame
        title={`${props.lesson.title} - differential-equation lab`}
        footer="The slope field and Euler path are recalculated from the selected equation and initial condition."
      >
        <DifferentialEquationActivity {...props} />
      </AdapterFrame>
    );
  }

  const params = reusableEngineParamsFor("cas", props.lesson.title);
  return (
    <AdapterFrame
      title={`${props.lesson.title} - reusable CAS engine`}
      value={params.casCommand}
      footer="This lesson uses the shared symbolic engine with only expression, result, and steps visible."
    >
      <ReusableLessonEngine
        engine="cas"
        params={params}
        resetToken={props.resetToken}
        onInteraction={props.onInteraction}
      />
    </AdapterFrame>
  );
}
