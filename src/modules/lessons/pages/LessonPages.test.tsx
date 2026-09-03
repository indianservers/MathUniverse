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

  it("renders the dedicated mixed-unit conversion target for lesson 10005", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-numbers-and-arithmetic-mixed-units-and-unit-conversion",
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
    expect(html).toContain('data-testid="school-mockup-0679"');
    expect(html).toContain(
      "dedicated-drag-drop-dimensional-unit-conversion-and-comparison-model",
    );
    expect(html).toContain('data-observe-difference="0.00"');
    expect(html).toContain('data-a-metres="2.50"');
    expect(html).toContain('data-b-metres="1.75"');
    expect(html).toContain('data-difference="0.75"');
    expect(html).toContain('data-chain-valid="true"');
    expect(html).toContain('data-chain-result="2.5"');
  });

  it("renders the dedicated pictograph builder target for lesson 10006", () => {
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
    expect(html).toContain('data-testid="school-mockup-0680"');
    expect(html).toContain(
      "dedicated-draggable-keyed-pictograph-and-row-challenge-model",
    );
    expect(html).toContain('data-key="1"');
    expect(html).toContain('data-counts="7,5,3,9"');
    expect(html).toContain('data-total-icons="24"');
    expect(html).toContain('data-challenge="0,0,0,0"');
  });

  it("renders the dedicated bar graph builder target for lesson 10007", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-data-handling-bar-graph-builder",
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
    expect(html).toContain('data-testid="school-mockup-0681"');
    expect(html).toContain(
      "dedicated-live-svg-bar-graph-scale-and-analysis-model",
    );
    expect(html).toContain('data-values="42,28,15,35"');
    expect(html).toContain('data-scale="50"');
    expect(html).toContain('data-highest="42"');
    expect(html).toContain('data-lowest="15"');
    expect(html).toContain('data-range="27"');
    expect(html).toContain('data-total="120"');
  });

  it("renders the dedicated survey frequency target for lesson 10008", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-data-handling-survey-to-frequency-table",
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
    expect(html).toContain('data-testid="school-mockup-0682"');
    expect(html).toContain(
      "dedicated-survey-response-tally-frequency-percentage-and-bar-model",
    );
    expect(html).toContain('data-counts="9,4,3,2,2"');
    expect(html).toContain('data-total="20"');
    expect(html).toContain('data-practice-counts="0,0,0,0,0"');
  });

  it("renders the dedicated misleading graph target for lesson 10009", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-data-handling-misleading-graph-detection",
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
    expect(html).toContain('data-testid="school-mockup-0683"');
    expect(html).toContain(
      "dedicated-live-axis-interval-3d-misleading-graph-and-evidence-model",
    );
    expect(html).toContain('data-truncated="true"');
    expect(html).toContain('data-start="100"');
    expect(html).toContain('data-end="300"');
    expect(html).toContain('data-unequal="false"');
    expect(html).toContain('data-three-d="false"');
  });

  it("renders the dedicated number pattern target for lesson 10010", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-patterns-number-pattern-completion",
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
    expect(html).toContain('data-testid="school-mockup-0684"');
    expect(html).toContain(
      "dedicated-arithmetic-geometric-sequence-rule-nth-term-and-practice-model",
    );
    expect(html).toContain('data-mode="add"');
    expect(html).toContain('data-first="4"');
    expect(html).toContain('data-change="4"');
    expect(html).toContain('data-terms="4,8,12,16,20,24,28,32,36,40"');
  });

  it("renders the dedicated shape pattern target for lesson 10011", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-patterns-shape-pattern-completion",
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
    expect(html).toContain('data-testid="school-mockup-0685"');
    expect(html).toContain(
      "dedicated-growing-odd-tile-pattern-breakdown-and-rule-model",
    );
    expect(html).toContain('data-figure="4"');
    expect(html).toContain('data-total="7"');
    expect(html).toContain('data-added="2"');
  });

  it("renders the dedicated Input-Output Rule Machines target surface", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-6/class-6-patterns-input-output-rule-machines",
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
    expect(html).toContain('data-testid="school-mockup-0686"');
    expect(html).toContain(
      "dedicated-drag-drop-operation-block-rule-machine-and-grading-model",
    );
    expect(html).toContain('data-ops="× 1|+ 3|drop|drop"');
    expect(html).toContain('data-known-outputs="4,5,6,7"');
    expect(html).toContain('data-accuracy="100"');
    expect(html).toContain('data-practice-correct="3"');
  });

  it("renders the dedicated divisibility tests target for lesson 10013", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-numbers-and-arithmetic-divisibility-tests-for-2-4-5-6-8-10-and-11",
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
    expect(html).toContain('data-testid="school-mockup-0687"');
    expect(html).toContain(
      "dedicated-digit-card-divisibility-engine-and-all-rules-challenge",
    );
    expect(html).toContain('data-number="1232"');
    expect(html).toContain(
      'data-results="2:true|4:true|5:false|6:false|8:true|10:false|11:true"',
    );
  });

  it("renders the dedicated digital root target for lesson 10014", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-numbers-and-arithmetic-digital-root-and-divisibility",
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
    expect(html).toContain('data-testid="school-mockup-0688"');
    expect(html).toContain(
      "dedicated-repeated-digit-sum-digital-root-and-independent-builders",
    );
    expect(html).toContain('data-number="987"');
    expect(html).toContain('data-root="6"');
    expect(html).toContain('data-steps="24,6"');
  });

  it("renders the dedicated remainder target for lesson 10015", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-numbers-and-arithmetic-remainder-reasoning",
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
    expect(html).toContain('data-testid="school-mockup-0689"');
    expect(html).toContain(
      "dedicated-division-number-line-jumps-remainder-invariant-and-grading",
    );
    expect(html).toContain('data-division="29/5"');
    expect(html).toContain('data-quotient="5"');
    expect(html).toContain('data-remainder="4"');
  });

  it("renders the dedicated unit rate target for lesson 10016", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-numbers-and-arithmetic-unit-rate-table-lab",
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
    expect(html).toContain('data-testid="school-mockup-0690"');
    expect(html).toContain(
      "dedicated-linked-unit-rate-table-double-number-line-and-comparison-grading",
    );
    expect(html).toContain('data-values="4,12"');
    expect(html).toContain('data-unit-rate="3"');
    expect(html).toContain('data-rows="5"');
  });

  it("renders the dedicated ratio table target for lesson 10017", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-numbers-and-arithmetic-ratio-tables",
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
    expect(html).toContain('data-testid="school-mockup-0691"');
    expect(html).toContain(
      "dedicated-scaled-ratio-row-simplification-double-number-line-and-practice",
    );
    expect(html).toContain('data-base="4:3"');
    expect(html).toContain('data-active="16:12"');
    expect(html).toContain('data-simple="4:3"');
  });

  it("renders the dedicated bills and tax target for lesson 10018", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-applied-arithmetic-bills-discounts-and-tax",
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
    expect(html).toContain('data-testid="school-mockup-0692"');
    expect(html).toContain(
      "dedicated-shopping-bill-discount-then-tax-live-receipt-and-challenge",
    );
    expect(html).toContain('data-subtotal="5100"');
    expect(html).toContain('data-saving="510.00"');
    expect(html).toContain('data-tax-amount="367.20"');
    expect(html).toContain('data-total="4957.20"');
    expect(html).toContain('data-items="4"');
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
