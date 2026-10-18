import { Navigate, useParams } from "react-router-dom";
import { getNCERTConcept } from "../data/ncertConcepts";
import { curriculumTopicRoute } from "../data/curriculumLessonMappings";

// Preserve bookmarks while opening the shared, curriculum-neutral lesson page.
export default function NCERTConceptPage() {
  const { conceptId } = useParams();
  const concept = getNCERTConcept(conceptId);
  return <Navigate to={concept ? curriculumTopicRoute(concept.id) : "/curriculum"} replace />;
}
