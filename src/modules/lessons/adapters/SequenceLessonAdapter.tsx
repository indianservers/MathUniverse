import AdapterFrame from "../components/AdapterFrame";
import { sequenceLessonPreset } from "../presets/sequenceLessonPresets";
import type { LessonAdapterProps } from "../types";
import ArithmeticSequencesTargetLesson335 from "./sequence/ArithmeticSequencesTargetLesson335";
import GeometricSequencesTargetLesson336 from "./sequence/GeometricSequencesTargetLesson336";
import RecursiveSequencesTargetLesson337 from "./sequence/RecursiveSequencesTargetLesson337";
import FibonacciSequenceTargetLesson338 from "./sequence/FibonacciSequenceTargetLesson338";
import SigmaNotationTargetLesson339 from "./sequence/SigmaNotationTargetLesson339";
import ArithmeticSeriesTargetLesson340 from "./sequence/ArithmeticSeriesTargetLesson340";
import GeometricSeriesTargetLesson341 from "./sequence/GeometricSeriesTargetLesson341";
import ConvergenceDivergenceTargetLesson342 from "./sequence/ConvergenceDivergenceTargetLesson342";
import PowerSeriesTargetLesson343 from "./sequence/PowerSeriesTargetLesson343";
import { SequenceConceptActivity } from "./sequence/SequenceConceptActivity";
import SequenceGeneratorTargetLesson334 from "./sequence/SequenceGeneratorTargetLesson334";

export default function SequenceLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.id === 334)
    return <SequenceGeneratorTargetLesson334 {...props} />;
  if (props.lesson.id === 335)
    return <ArithmeticSequencesTargetLesson335 {...props} />;
  if (props.lesson.id === 336)
    return <GeometricSequencesTargetLesson336 {...props} />;
  if (props.lesson.id === 337)
    return <RecursiveSequencesTargetLesson337 {...props} />;
  if (props.lesson.id === 338)
    return <FibonacciSequenceTargetLesson338 {...props} />;
  if (props.lesson.id === 339)
    return <SigmaNotationTargetLesson339 {...props} />;
  if (props.lesson.id === 340)
    return <ArithmeticSeriesTargetLesson340 {...props} />;
  if (props.lesson.id === 341)
    return <GeometricSeriesTargetLesson341 {...props} />;
  if (props.lesson.id === 342)
    return <ConvergenceDivergenceTargetLesson342 {...props} />;
  if (props.lesson.id === 343) return <PowerSeriesTargetLesson343 {...props} />;
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
