import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import SchoolLessonPage from "./SchoolLessonPage";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";

describe("school lesson crash sweep", () => {
  it("renders every school lesson route without crashing", () => {
    const crashCopy = "Reload the app to restore the latest lesson shell";
    expect(schoolLessonCatalog.length).toBeGreaterThanOrEqual(220);

    const failures: string[] = [];
    for (const lesson of schoolLessonCatalog) {
      try {
        const html = renderToStaticMarkup(
          <MemoryRouter initialEntries={[lesson.route]}>
            <Routes>
              <Route
                path="/lessons/school/:levelSlug/:lessonSlug"
                element={<SchoolLessonPage />}
              />
            </Routes>
          </MemoryRouter>,
        );
        if (
          html.includes(crashCopy) ||
          html.includes("School lesson not found") ||
          html.includes("Something went wrong")
        ) {
          failures.push(lesson.route);
        }
        if (
          lesson.numericId >= 10001 &&
          lesson.numericId <= 10220 &&
          html.includes('data-testid="lesson-specific-sections"')
        ) {
          failures.push(`${lesson.route}: generic MCQ shell replaced the lab`);
        }
        if (
          lesson.numericId >= 10001 &&
          lesson.numericId <= 10220 &&
          !html.includes('data-testid="school-dedicated-target"')
        ) {
          failures.push(`${lesson.route}: missing dedicated mockup target`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`${lesson.route}: ${message}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
