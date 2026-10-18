import { legacyLessonRedirects } from "../catalog/legacyLessonRoutes";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { findLesson } from "../catalog/lessonCatalog";
import LessonShell from "../components/LessonShell";
import AuthoredCurriculumLessonPage,{getAuthoredCurriculumLesson} from './AuthoredCurriculumLessonPage';

export default function LessonPage() {
  const { categorySlug, lessonSlug } = useParams();
  const { pathname } = useLocation();
  const redirect = legacyLessonRedirects[pathname];
  if (redirect) return <Navigate to={redirect} replace />;
  const authored=getAuthoredCurriculumLesson(Number(lessonSlug?.split('-')[0]));
  if(authored)return <AuthoredCurriculumLessonPage lessonId={authored.lessonId}/>;
  const lesson = findLesson(categorySlug, lessonSlug);
  if (!lesson) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950"><h1 className="text-2xl font-black">Lesson not found</h1><p className="mt-2 text-sm">The requested lesson is not registered in the current catalog.</p><Link className="action-secondary mt-4" to="/lessons">Browse lessons</Link></div>;
  return <LessonShell lesson={lesson} />;
}
