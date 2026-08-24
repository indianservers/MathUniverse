import AdapterFrame from "../components/AdapterFrame";
import ReusableLessonEngine, {
  reusableEngineParamsFor,
} from "../components/ReusableLessonEngine";
import type { LessonAdapterProps } from "../types";
import SymbolicCasMockupLesson from "./cas/SymbolicCasMockupLesson";
import { DifferentialEquationActivity } from "./p0/PriorityConceptActivities";

export default function CasLessonAdapter(props: LessonAdapterProps) {
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
