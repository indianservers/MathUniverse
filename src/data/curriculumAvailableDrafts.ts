import authored from "../modules/lessons/authored/authoredLessonIndex.generated.json";
import { unifiedLessons } from "../modules/lessons/catalog/unified/unifiedLessons";

const authoredRoutes = new Map(authored.lessons.map((lesson) => [lesson.lessonId, lesson.route]));
export const availableDrafts = unifiedLessons.filter((lesson) => lesson.kind === "authored" && authoredRoutes.get(lesson.id) === lesson.route);
const explicit: Record<string, number[]> = {
  "class-10-triangle-bpt-converse": [30257, 30258],
  "class-10-similarity-criteria": [30259, 30260, 30261],
  "class-10-composite-circle-regions": [30300, 30301],
  "chapter-8-3": [30055, 30061],
  "class-10-grouped-mode": [30313],
};
export function draftsForTopic(id: string, title: string) {
  const ids = explicit[id] ?? [];
  return availableDrafts.filter((lesson) => ids.includes(lesson.id) || String(lesson.id) === id || lesson.title.toLowerCase() === title.toLowerCase());
}
