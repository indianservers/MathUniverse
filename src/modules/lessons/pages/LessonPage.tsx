import { Link, useParams } from "react-router-dom";
import { findLesson } from "../catalog/lessonCatalog";
import LessonShell from "../components/LessonShell";

export default function LessonPage() {
  const { categorySlug, lessonSlug } = useParams();
  const lesson = findLesson(categorySlug, lessonSlug);
  if (!lesson) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><h1 className="text-2xl font-black">Lesson not found</h1><p className="mt-2 text-sm">The requested lesson is not registered in the current catalog.</p><Link className="action-secondary mt-4" to="/lessons">Browse lessons</Link></div>;
  return <LessonShell lesson={lesson} />;
}
