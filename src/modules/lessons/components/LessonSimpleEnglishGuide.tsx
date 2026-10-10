import { useParams } from "react-router-dom";
import {
  getLessonSimpleEnglish,
  resolveLessonSimpleEnglish,
  type LessonSimpleEnglish,
} from "./lessonSimpleEnglish";
import "./LessonSimpleEnglishGuide.css";
import { resolveStudyLessonId, studyRolloutLimit } from './LessonStudySession';

export default function LessonSimpleEnglishGuide({
  lessonId,
  title,
  summary,
}: {
  lessonId?: number;
  title?: string;
  summary?: string;
}) {
  const params = useParams();
  const guide: LessonSimpleEnglish | null =
    lessonId != null
      ? getLessonSimpleEnglish(lessonId, title ? { title, summary } : undefined)
      : resolveLessonSimpleEnglish({
          levelSlug: params.levelSlug,
          lessonSlug: params.lessonSlug,
          categorySlug: params.categorySlug,
        });
  if (!guide) return null;
  const compact = (lessonId ?? resolveStudyLessonId(params) ?? Infinity) <= studyRolloutLimit;
  const content = <>
    {guide.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
    <aside><b>Try this example</b><p>{guide.examplePrompt}</p><details><summary>Compare your answer</summary><p>Answer: <strong>{guide.exampleAnswer}</strong></p></details></aside>
  </>;
  return (
    <section
      className="lesson-simple-english"
      data-lesson-simple-english
      data-testid="lesson-simple-english"
      aria-label={`Simple English explanation of ${guide.title}`}
    >
      {compact ? <details><summary><span className="lesson-simple-english-kicker">In simple English</span><h2>Understand {guide.title}</h2></summary>{content}</details> : <><p className="lesson-simple-english-kicker">In simple English</p><h2>Understand {guide.title}</h2>{content}</>}
    </section>
  );
}
