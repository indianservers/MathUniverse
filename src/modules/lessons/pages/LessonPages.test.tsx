import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import LessonsCategoryPage from "./LessonsCategoryPage";
import LessonsHomePage from "./LessonsHomePage";
import LessonPage from "./LessonPage";
import AdvancedConceptLessonPage from "./AdvancedConceptLessonPage";
import SchoolLessonsPage from "./SchoolLessonsPage";
import SchoolLessonPage from "./SchoolLessonPage";
import { schoolLessonsFor } from "../catalog/school/schoolSyllabusCatalog";
import type { AcademicLevel } from "../syllabus/lessonSyllabusTypes";

const schoolLevels: AcademicLevel[] = [
  "CLASS_6",
  "CLASS_7",
  "CLASS_8",
  "CLASS_9",
  "CLASS_10",
  "CLASS_11",
  "CLASS_12",
];

describe("lesson pages", () => {
  it("renders the complete four-phase catalog", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <LessonsHomePage />
      </MemoryRouter>,
    );
    expect(html).toContain("Interactive mathematics");
    expect(html).toContain("919");
    expect(html).toContain("674");
    expect(html).toContain("School Curriculum");
    expect(html).toContain("220");
    expect(html).toContain("Visual Workspaces");
  });

  it("renders a category route", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/lessons/numbers-and-arithmetic"]}>
        <Routes>
          <Route
            path="/lessons/:categorySlug"
            element={<LessonsCategoryPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("Numbers and Arithmetic");
    expect(html).toContain("35 lessons");
    expect(html).toContain("Fraction Models");
  });

  it("renders a canonical lesson shell and preserves compact stages", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={["/lessons/core-workspaces/1-basic-calculator"]}
      >
        <Routes>
          <Route
            path="/lessons/:categorySlug/:lessonSlug"
            element={<LessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("Basic Calculator");
    expect(html).toContain("Interaction + visualization");
    expect(html).toContain("Explain");
    expect(html).toContain("Examples");
    expect(html).toContain("Formulas");
    expect(html).toContain("Know more");
  });

  it("renders expert-review lessons with topic-specific visual requirements", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/lessons/calculus/277-informal-limits"]}>
        <Routes>
          <Route
            path="/lessons/:categorySlug/:lessonSlug"
            element={<LessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("Informal Limits");
    expect(html).toContain("Interaction + visualization");
    expect(html).toContain("primary-control");
    expect(html).toContain("function");
    expect(html).toContain("calculus object");
    expect(html).not.toContain("For f(x)=");
  });

  it("renders generated school syllabus pathways", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <SchoolLessonsPage />
      </MemoryRouter>,
    );
    expect(html).toContain("School syllabus remediation");
    expect(html).toContain("220");
    expect(html).toContain("Euclidean Geometry");
    expect(html).toContain("NCERT Class 6 Mathematics");
  });

  it("renders class-specific school lesson lists for every school class route", () => {
    for (const level of schoolLevels) {
      const routeLevel = level.toLowerCase().replace("_", "-");
      const expectedLessons = schoolLessonsFor(level, "ALL", "");
      const html = renderToStaticMarkup(
        <MemoryRouter initialEntries={[`/lessons/school/${routeLevel}`]}>
          <Routes>
            <Route
              path="/lessons/school/:levelSlug"
              element={<SchoolLessonsPage />}
            />
          </Routes>
        </MemoryRouter>,
      );

      expect(html).toContain(`${formatClassForTest(level)} lessons`);
      expect(html).toContain(
        `${expectedLessons.length} matching school lessons`,
      );
      expect(html).toContain(expectedLessons[0].title);
      expect(html).not.toContain("School lesson not found");
    }
  });

  it("renders advanced interactive labs with visual scenes", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={["/lessons/advanced-concepts/2001-partial-quotients"]}
      >
        <Routes>
          <Route
            path="/lessons/advanced-concepts/:lessonSlug"
            element={<AdvancedConceptLessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("Partial Quotients");
    expect(html).toContain("Step Explorer");
    expect(html).toContain("continued fraction convergent error plot");
    expect(html).toContain("convergents climb toward the target");
  });

  it("renders a generated school lesson route", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-euclid-s-five-postulates",
        ]}
      >
        <Routes>
          <Route
            path="/lessons/school/:levelSlug/:lessonSlug"
            element={<SchoolLessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("Euclid&#x27;s Five Postulates");
    expect(html).toContain("accepted starting rules");
    expect(html).toContain("A postulate is accepted as a starting rule");
    expect(html).toContain("Exact proof mini tool");
    expect(html).toContain("Lesson arc");
    expect(html).toContain("Proof checklist");
    expect(html).toContain("Syllabus tags");
    expect(html).toContain("NCERT");
    expect(html).not.toContain("Euclid&#x27;s Five Postulates fills a Class 9");
  });

  it("renders strengthened Class 6 school lesson content", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-numbers-and-arithmetic-place-value-explorer",
        ]}
      >
        <Routes>
          <Route
            path="/lessons/school/:levelSlug/:lessonSlug"
            element={<SchoolLessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("Place value tells the value of a digit");
    expect(html).toContain("Read digits from right to left");
    expect(html).toContain("In 4,582, what is the place value of 5?");
    expect(html).toContain("place value chart visual model");
    expect(html).toContain("a digit&#x27;s value depends on its column");
    expect(html).not.toContain("Place Value Explorer fills a Class 6");
  });

  it("renders the dedicated dual number-system target for lesson 10002", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-numbers-and-arithmetic-indian-and-international-number-naming-systems",
        ]}
      >
        <Routes>
          <Route
            path="/lessons/school/:levelSlug/:lessonSlug"
            element={<SchoolLessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain('data-testid="school-mockup-0676"');
    expect(html).toContain(
      "dedicated-draggable-dual-number-grouping-and-naming-model",
    );
    expect(html).toContain('data-indian="1,33,215"');
    expect(html).toContain('data-international="133,215"');
    expect(html).toContain(
      "One Lakh Thirty-Three Thousand Two Hundred Fifteen",
    );
  });

  it("renders the dedicated estimation and rounding target for lesson 10003", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-numbers-and-arithmetic-estimation-and-rounding-lab",
        ]}
      >
        <Routes>
          <Route
            path="/lessons/school/:levelSlug/:lessonSlug"
            element={<SchoolLessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain('data-testid="school-mockup-0677"');
    expect(html).toContain(
      "dedicated-draggable-number-line-rounding-and-live-error-model",
    );
    expect(html).toContain('data-number="53"');
    expect(html).toContain('data-rounded="50"');
    expect(html).toContain('data-estimate-total="130"');
    expect(html).toContain('data-actual-total="128"');
  });

  it("renders the dedicated approximation error-bounds target for lesson 10004", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-numbers-and-arithmetic-approximation-and-error-bounds",
        ]}
      >
        <Routes>
          <Route
            path="/lessons/school/:levelSlug/:lessonSlug"
            element={<SchoolLessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain('data-testid="school-mockup-0678"');
    expect(html).toContain(
      "dedicated-draggable-half-open-rounding-error-bound-model",
    );
    expect(html).toContain('data-exact="4.3268"');
    expect(html).toContain('data-rounded="4.3"');
    expect(html).toContain('data-lower="4.25"');
    expect(html).toContain('data-upper="4.35"');
  });

  it("renders strengthened school batch content beyond the first three lessons", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-data-handling-pictograph-builder",
        ]}
      >
        <Routes>
          <Route
            path="/lessons/school/:levelSlug/:lessonSlug"
            element={<SchoolLessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("A pictograph uses pictures or symbols");
    expect(html).toContain("Always multiply pictures by the key value");
    expect(html).not.toContain("Pictograph Builder fills a Class 6");
  });

  it("renders strengthened advanced school batch content", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-11/class-11-relations-and-functions-composition-of-functions",
        ]}
      >
        <Routes>
          <Route
            path="/lessons/school/:levelSlug/:lessonSlug"
            element={<SchoolLessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("applying one function after another");
    expect(html).toContain("In f(g(x)), g acts first");
    expect(html).not.toContain("Composition of Functions fills a Class 11");
  });

  it("renders strengthened Class 12 school batch content", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-12/class-12-formal-calculus-rolle-s-theorem",
        ]}
      >
        <Routes>
          <Route
            path="/lessons/school/:levelSlug/:lessonSlug"
            element={<SchoolLessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("f&#x27;(c)=0");
    expect(html).toContain("Check continuity");
    expect(html).not.toContain("Rolle&#x27;s Theorem fills a Class 12");
  });

  it("renders strengthened final school batch content", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-12/class-12-probability-bayes-theorem",
        ]}
      >
        <Routes>
          <Route
            path="/lessons/school/:levelSlug/:lessonSlug"
            element={<SchoolLessonPage />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("Bayes&#x27; Theorem");
    expect(html).toContain("reverses conditional probability");
    expect(html).toContain("total probability denominator");
    expect(html).toContain("tree diagram visual model");
    expect(html).toContain("branches multiply along paths");
    expect(html).not.toContain("Bayes&#x27; Theorem fills a Class 12");
  });
});

function formatClassForTest(value: AcademicLevel) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
