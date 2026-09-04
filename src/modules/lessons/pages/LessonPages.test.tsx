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

  it("renders the dedicated profit and loss target for lesson 10019", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-applied-arithmetic-profit-loss-and-marked-price",
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
    expect(html).toContain('data-testid="school-mockup-0693"');
    expect(html).toContain(
      "dedicated-cost-marked-discount-selling-price-profit-loss-store-flow",
    );
    expect(html).toContain('data-cp="1000"');
    expect(html).toContain('data-mp="1400"');
    expect(html).toContain('data-discount="20"');
    expect(html).toContain('data-sp="1120"');
    expect(html).toContain('data-result="PROFIT"');
    expect(html).toContain('data-percent="12.00"');
  });

  it("renders the dedicated household budget target for lesson 10020", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-applied-arithmetic-household-budget-arithmetic",
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
    expect(html).toContain('data-testid="school-mockup-0694"');
    expect(html).toContain(
      "dedicated-household-income-expense-envelope-balance-goal-planner",
    );
    expect(html).toContain('data-income="5000"');
    expect(html).toContain('data-total="4800"');
    expect(html).toContain('data-balance="200"');
    expect(html).toContain('data-savings="300"');
    expect(html).toContain('data-percent="4.00"');
    expect(html).toContain('data-envelopes="6"');
  });

  it("renders the dedicated scale factor target for lesson 10021", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-applied-arithmetic-scale-factor-in-maps-and-recipes",
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
    expect(html).toContain('data-testid="school-mockup-0695"');
    expect(html).toContain(
      "dedicated-shared-scale-factor-map-distance-recipe-quantity-proportion-table",
    );
    expect(html).toContain('data-factor="2.50"');
    expect(html).toContain('data-map-length="10.00"');
    expect(html).toContain('data-distance="500"');
    expect(html).toContain('data-servings="10"');
    expect(html).toContain('data-mode="Enlargement"');
  });

  it("renders the dedicated copying a line segment target for lesson 10022", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-practical-geometry-copying-a-line-segment",
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
    expect(html).toContain('data-testid="school-mockup-0696"');
    expect(html).toContain(
      "dedicated-compass-radius-ray-endpoint-line-segment-copy-construction",
    );
    expect(html).toContain('data-radius="5.00"');
    expect(html).toContain('data-original="5.00"');
    expect(html).toContain('data-difference="0.00"');
    expect(html).toContain('data-verified="true"');
    expect(html).toContain('data-tool="Select"');
  });

  it("renders the dedicated copying an angle target for lesson 10023", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-practical-geometry-copying-an-angle",
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
    expect(html).toContain('data-testid="school-mockup-0697"');
    expect(html).toContain(
      "dedicated-equal-radius-arc-chord-transfer-angle-copy-construction",
    );
    expect(html).toContain('data-source-angle="36"');
    expect(html).toContain('data-copied-angle="36"');
    expect(html).toContain('data-radius="2.50"');
    expect(html).toContain('data-steps="6"');
    expect(html).toContain('data-congruent="true"');
    expect(html).toContain('data-tool="Compass"');
  });

  it("renders the dedicated perpendicular bisector target for lesson 10024", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-practical-geometry-perpendicular-bisector-construction",
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
    expect(html).toContain('data-testid="school-mockup-0698"');
    expect(html).toContain(
      "dedicated-equal-radius-arc-intersection-midpoint-perpendicular-bisector-construction",
    );
    expect(html).toContain('data-length="8.00"');
    expect(html).toContain('data-radius="4.00"');
    expect(html).toContain('data-arc-distance="6.00"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-bisector="true"');
    expect(html).toContain('data-right-angle="true"');
  });

  it("renders the dedicated angle bisector target for lesson 10025", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-practical-geometry-angle-bisector-construction",
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
    expect(html).toContain('data-testid="school-mockup-0699"');
    expect(html).toContain(
      "dedicated-equal-arc-intersection-angle-bisector-ray-construction",
    );
    expect(html).toContain('data-angle="72.0"');
    expect(html).toContain('data-half-angle="36.0"');
    expect(html).toContain('data-radius="4.0"');
    expect(html).toContain('data-complete="true"');
    expect(html).toContain('data-tool="Pointer"');
    expect(html).toContain('data-arcs="true"');
  });

  it("renders the dedicated perpendicular through point target for lesson 10026", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-practical-geometry-perpendicular-through-a-point",
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
    expect(html).toContain('data-testid="school-mockup-0700"');
    expect(html).toContain(
      "dedicated-point-line-equal-arc-intersections-perpendicular-construction",
    );
    expect(html).toContain('data-mode="On-line"');
    expect(html).toContain('data-radius="3.5"');
    expect(html).toContain('data-offset="0.0"');
    expect(html).toContain('data-line-selected="true"');
    expect(html).toContain('data-correct="true"');
    expect(html).toContain('data-steps="true"');
  });

  it("renders the dedicated parallel line target for lesson 10027", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-7/class-7-practical-geometry-parallel-line-construction",
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
    expect(html).toContain('data-testid="school-mockup-0701"');
    expect(html).toContain(
      "dedicated-corresponding-angle-copy-transversal-parallel-line-construction",
    );
    expect(html).toContain('data-stage="4"');
    expect(html).toContain('data-progress="0"');
    expect(html).toContain('data-angle="74"');
    expect(html).toContain('data-parallel="true"');
    expect(html).toContain('data-grid="true"');
    expect(html).toContain('data-transversal="true"');
  });

  it("renders the dedicated triangle SSS target for lesson 10028", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-practical-geometry-triangle-construction-by-sss",
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
    expect(html).toContain('data-testid="school-mockup-0702"');
    expect(html).toContain(
      "dedicated-three-side-circle-intersection-sss-triangle-construction",
    );
    expect(html).toContain('data-ab="7"');
    expect(html).toContain('data-ac="5"');
    expect(html).toContain('data-bc="6"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-stage="4"');
    expect(html).toContain('data-upper="true"');
  });

  it("renders the dedicated triangle SAS target for lesson 10029", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-practical-geometry-triangle-construction-by-sas",
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
    expect(html).toContain('data-testid="school-mockup-0703"');
    expect(html).toContain(
      "dedicated-two-sides-included-angle-sas-protractor-construction",
    );
    expect(html).toContain('data-ab="6"');
    expect(html).toContain('data-ac="4"');
    expect(html).toContain('data-angle="55"');
    expect(html).toContain('data-bc="4.95"');
    expect(html).toContain('data-stage="5"');
    expect(html).toContain('data-tool="Ray at A"');
    expect(html).toContain('data-snap="true"');
  });

  it("renders the dedicated triangle ASA target for lesson 10030", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-practical-geometry-triangle-construction-by-asa",
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
    expect(html).toContain('data-testid="school-mockup-0704"');
    expect(html).toContain(
      "dedicated-two-angle-included-side-ray-intersection-asa-construction",
    );
    expect(html).toContain('data-angle-a="50"');
    expect(html).toContain('data-angle-b="65"');
    expect(html).toContain('data-angle-c="65"');
    expect(html).toContain('data-side="7"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-steps="true"');
  });

  it("renders the dedicated right triangle RHS target for lesson 10031", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-practical-geometry-right-triangle-construction-by-rhs",
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
    expect(html).toContain('data-testid="school-mockup-0705"');
    expect(html).toContain(
      "dedicated-thales-semicircle-hypotenuse-leg-rhs-construction",
    );
    expect(html).toContain('data-hypotenuse="8"');
    expect(html).toContain('data-leg="5"');
    expect(html).toContain('data-other="6.24"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-semicircle="true"');
    expect(html).toContain('data-right-angle="true"');
  });

  it("renders the dedicated double bar graph target for lesson 10032", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-data-handling-double-bar-graph-comparison",
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
    expect(html).toContain('data-testid="school-mockup-0706"');
    expect(html).toContain(
      "dedicated-editable-paired-series-double-bar-comparison",
    );
    expect(html).toContain('data-boys-total="69"');
    expect(html).toContain('data-girls-total="62"');
    expect(html).toContain('data-selected="Wed"');
    expect(html).toContain('data-difference="-4"');
    expect(html).toContain('data-scale="20"');
    expect(html).toContain('data-boys-visible="true"');
    expect(html).toContain('data-girls-visible="true"');
  });

  it("renders the dedicated mean median mode path target for lesson 10033", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-data-handling-mean-median-and-mode-practice-path",
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
    expect(html).toContain('data-testid="school-mockup-0707"');
    expect(html).toContain("dedicated-ordering-central-tendency-practice-path");
    expect(html).toContain('data-order="2,3,3,5,7"');
    expect(html).toContain('data-correct-order="true"');
    expect(html).toContain('data-sum="20"');
    expect(html).toContain('data-mean="4.00"');
    expect(html).toContain('data-median="3"');
    expect(html).toContain('data-mode="3"');
  });

  it("renders the dedicated range and spread target for lesson 10034", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-data-handling-range-and-spread-explorer",
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
    expect(html).toContain('data-testid="school-mockup-0708"');
    expect(html).toContain(
      "dedicated-draggable-extremes-range-spread-explorer",
    );
    expect(html).toContain('data-values="3,5,6,8,11"');
    expect(html).toContain('data-min="3"');
    expect(html).toContain('data-max="11"');
    expect(html).toContain('data-range="8"');
    expect(html).toContain('data-median="6"');
    expect(html).toContain('data-outlier="true"');
    expect(html).toContain('data-challenge-range="8"');
  });

  it("renders the dedicated flowchart logic target for lesson 10035", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-information-processing-flowchart-logic",
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
    expect(html).toContain('data-testid="school-mockup-0709"');
    expect(html).toContain(
      "dedicated-executable-draggable-branching-flowchart",
    );
    expect(html).toContain('data-input="10"');
    expect(html).toContain('data-output="Even"');
    expect(html).toContain('data-step="2"');
    expect(html).toContain('data-connected="true"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-challenge-connected="false"');
    expect(html).toContain('data-zoom="100"');
  });

  it("renders the dedicated pattern encoding target for lesson 10036", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-information-processing-pattern-encoding",
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
    expect(html).toContain('data-testid="school-mockup-0710"');
    expect(html).toContain("dedicated-live-alphabet-rule-encoding-machine");
    expect(html).toContain('data-operation="Shift"');
    expect(html).toContain('data-direction="Right"');
    expect(html).toContain('data-amount="2"');
    expect(html).toContain('data-word="CODE"');
    expect(html).toContain('data-output="EQFG"');
    expect(html).toContain('data-challenge-output="DTKFIG"');
  });

  it("renders the dedicated magic squares target for lesson 10037", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-information-processing-magic-squares",
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
    expect(html).toContain('data-testid="school-mockup-0711"');
    expect(html).toContain(
      "dedicated-drag-drop-eight-line-magic-square-solver",
    );
    expect(html).toContain('data-grid="8,1,6,3,5,7,4,9,2"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-sums="15,15,15,15,15,15,15,15"');
    expect(html).toContain('data-challenge-grid="2,7,6,0,5,1,4,0,0"');
    expect(html).toContain('data-challenge-valid="false"');
  });

  it("renders the dedicated route map target for lesson 10038", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-information-processing-route-map-reasoning",
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
    expect(html).toContain('data-testid="school-mockup-0712"');
    expect(html).toContain("dedicated-draggable-waypoint-grid-route-reasoner");
    expect(html).toContain('data-start="0,0"');
    expect(html).toContain('data-end="5,4"');
    expect(html).toContain('data-waypoints="3,0;3,4"');
    expect(html).toContain('data-distance="9"');
    expect(html).toContain('data-turns="2"');
    expect(html).toContain('data-direct="6.4"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-challenge-distance="0"');
  });

  it("renders the dedicated tabular pattern target for lesson 10039", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-8/class-8-information-processing-tabular-pattern-completion",
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
    expect(html).toContain('data-testid="school-mockup-0713"');
    expect(html).toContain("dedicated-all-row-tabular-rule-inference-engine");
    expect(html).toContain('data-rule="2a + b"');
    expect(html).toContain('data-generated="4,10,17"');
    expect(html).toContain('data-third-output="17"');
    expect(html).toContain('data-matches="true,true,true"');
    expect(html).toContain('data-all-match="true"');
    expect(html).toContain('data-tested="true"');
    expect(html).toContain('data-challenge-result="correct"');
  });

  it("renders the dedicated decimal expansion target for lesson 10040", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-real-numbers-decimal-expansion-of-rational-numbers",
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
    expect(html).toContain('data-testid="school-mockup-0714"');
    expect(html).toContain("dedicated-long-division-remainder-cycle-engine");
    expect(html).toContain('data-main-fraction="1/7"');
    expect(html).toContain('data-main-cycle="142857"');
    expect(html).toContain('data-try-result="idle"');
    expect(html).toContain("Remainder 1 repeats");
  });

  it("renders the dedicated terminating-decimal target for lesson 10041", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-real-numbers-terminating-and-non-terminating-decimals",
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
    expect(html).toContain('data-testid="school-mockup-0715"');
    expect(html).toContain("dedicated-simplify-factor-predict-verify-engine");
    expect(html).toContain('data-reduced="7/40"');
    expect(html).toContain('data-classification="terminating"');
    expect(html).toContain('data-decimal="0.175"');
  });

  it("renders the dedicated rational classification target for lesson 10042", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-real-numbers-rational-and-irrational-classification",
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
    expect(html).toContain('data-testid="school-mockup-0716"');
    expect(html).toContain(
      "dedicated-rational-irrational-drag-evidence-engine",
    );
    expect(html).toContain('data-correct="0"');
    expect(html).toContain('data-remaining="8"');
    expect(html).toContain('draggable="true"');
    expect(html).toContain('data-challenge="idle"');
  });

  it("renders the dedicated successive magnification target for lesson 10043", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-real-numbers-successive-magnification-on-the-number-line",
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
    expect(html).toContain('data-testid="school-mockup-0717"');
    expect(html).toContain("dedicated-successive-decimal-interval-zoom-engine");
    expect(html).toContain('data-level="1"');
    expect(html).toContain('data-interval="1.4,1.5"');
    expect(html).toContain('data-width="0.1"');
    expect(html).toContain('data-challenge="idle"');
  });

  it("renders the dedicated rationalisation target for lesson 10044", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-real-numbers-rationalisation-of-denominators",
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
    expect(html).toContain('data-testid="school-mockup-0718"');
    expect(html).toContain(
      "dedicated-conjugate-rationalisation-equivalence-engine",
    );
    expect(html).toContain('data-numerator="√3 − 1"');
    expect(html).toContain('data-denominator="√3 − 1"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('draggable="true"');
    expect(html).toContain('data-challenge="true"');
  });

  it("renders the dedicated nth-roots target for lesson 10045", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-real-numbers-nth-roots-and-radical-meaning",
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
    expect(html).toContain('data-testid="school-mockup-0719"');
    expect(html).toContain("dedicated-power-root-domain-and-matching-engine");
    expect(html).toContain('data-base="-8"');
    expect(html).toContain('data-index="3"');
    expect(html).toContain('data-power="-512"');
    expect(html).toContain('data-root="-2"');
    expect(html).toContain('data-challenge="idle"');
  });

  it("renders the dedicated graphical-zeros target for lesson 10046", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-polynomials-graphical-zeros-of-polynomials",
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
    expect(html).toContain('data-testid="school-mockup-0720"');
    expect(html).toContain(
      "dedicated-quadratic-coefficients-draggable-roots-engine",
    );
    expect(html).toContain('data-a="1"');
    expect(html).toContain('data-b="-5"');
    expect(html).toContain('data-c="6"');
    expect(html).toContain('data-roots="2,3"');
    expect(html).toContain('aria-label="Interactive quadratic graph"');
    expect(html).toContain('data-challenge-root="-1"');
  });

  it("renders the dedicated polynomial-division target for lesson 10047", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-polynomials-polynomial-division",
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
    expect(html).toContain('data-testid="school-mockup-0721"');
    expect(html).toContain(
      "dedicated-polynomial-long-division-coefficient-engine",
    );
    expect(html).toContain('data-dividend="x³ + 0x² + 0x − 1"');
    expect(html).toContain('data-divisor="x − 1"');
    expect(html).toContain('data-quotient="x² + x + 1"');
    expect(html).toContain('data-remainder="0"');
    expect(html).toContain('data-identity="true"');
    expect(html).toContain('draggable="true"');
  });

  it("renders the dedicated remainder-theorem target for lesson 10048", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-polynomials-remainder-theorem",
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
    expect(html).toContain('data-testid="school-mockup-0722"');
    expect(html).toContain(
      "dedicated-remainder-theorem-synthetic-substitution-engine",
    );
    expect(html).toContain('data-polynomial="x² + 3x + 2"');
    expect(html).toContain('data-a="2"');
    expect(html).toContain('data-quotient="x + 5"');
    expect(html).toContain('data-remainder="12"');
    expect(html).toContain('data-identity="true"');
    expect(html).toContain('data-quick="idle"');
  });

  it("renders the dedicated factor-theorem target for lesson 10049", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-polynomials-factor-theorem",
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
    expect(html).toContain('data-testid="school-mockup-0723"');
    expect(html).toContain(
      "dedicated-factor-theorem-substitution-synthetic-division-engine",
    );
    expect(html).toContain('data-polynomial="x² − 5x + 6"');
    expect(html).toContain('data-candidate="2"');
    expect(html).toContain('data-value="0"');
    expect(html).toContain('data-factor="true"');
    expect(html).toContain('data-quotient="x − 3"');
    expect(html).toContain('data-remainder="0"');
  });

  it("renders the dedicated zeros-and-coefficients target for lesson 10050", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-polynomials-relationship-between-zeros-and-coefficients",
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
    expect(html).toContain('data-testid="school-mockup-0724"');
    expect(html).toContain(
      "dedicated-vieta-draggable-roots-coefficient-engine",
    );
    expect(html).toContain('data-alpha="1"');
    expect(html).toContain('data-beta="3"');
    expect(html).toContain('data-b="-4"');
    expect(html).toContain('data-c="3"');
    expect(html).toContain('data-sum="4"');
    expect(html).toContain('data-product="3"');
    expect(html).toContain('data-target-roots="2,3"');
    expect(html).toContain('data-quick="B"');
    expect(html).toContain('data-quick-correct="true"');
    expect(html).toContain('aria-label="Interactive roots graph"');
  });

  it("renders the dedicated cubic-identities target for lesson 10051", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-polynomials-cubic-algebraic-identities",
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
    expect(html).toContain('data-testid="school-mockup-0725"');
    expect(html).toContain(
      "dedicated-cubic-volume-decomposition-and-signed-tile-engine",
    );
    expect(html).toContain('data-mode="plus"');
    expect(html).toContain('data-a="2"');
    expect(html).toContain('data-b="1"');
    expect(html).toContain('data-lhs="27"');
    expect(html).toContain('data-rhs="27"');
    expect(html).toContain('data-expanded="true"');
    expect(html).toContain('data-cube-tiles="a3,a2b,ab2,b3"');
    expect(html).toContain('data-challenge="a3,a2b,ab2,b3"');
    expect(html).toContain('aria-label="Cubic identity volume decomposition"');
  });

  it("renders the dedicated factorisation-practice target for lesson 10052", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-polynomials-polynomial-factorisation-practice",
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
    expect(html).toContain('data-testid="school-mockup-0726"');
    expect(html).toContain(
      "dedicated-four-method-factorisation-and-expansion-verification-engine",
    );
    expect(html).toContain('data-method="Common Factor"');
    expect(html).toContain('data-polynomial="6x² + 9x"');
    expect(html).toContain('data-factor="3x"');
    expect(html).toContain('data-result="3x(2x + 3)"');
    expect(html).toContain('data-score="4"');
    expect(html).toContain('aria-label="Factorisation 1"');
    expect(html).toContain('aria-label="Expansion 4"');
  });

  it("renders the dedicated Euclidean-foundations target for lesson 10053", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-definitions-axioms-and-postulates",
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
    expect(html).toContain('data-testid="school-mockup-0727"');
    expect(html).toContain(
      "dedicated-euclidean-statement-classification-dependency-and-justification-engine",
    );
    expect(html).toContain('data-correct="6"');
    expect(html).toContain('data-total="6"');
    expect(html).toContain('data-checked="true"');
    expect(html).toContain('data-challenge-score="idle"');
    expect(html).toContain('aria-label="Justification 1"');
    expect(html).toContain('aria-label="Justification 2"');
    expect(html).toContain("DEFINITION DEPENDENCY MAP");
  });

  it("renders the dedicated Euclid-postulates target for lesson 10054", () => {
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
    expect(html).toContain('data-testid="school-mockup-0728"');
    expect(html).toContain(
      "dedicated-five-postulate-construction-and-matching-engine",
    );
    expect(html).toContain('data-postulate="1"');
    expect(html).toContain('data-tool="Select"');
    expect(html).toContain('data-a="95,180"');
    expect(html).toContain('data-b="315,180"');
    expect(html).toContain('data-score="idle"');
    expect(html).toContain('aria-label="Interactive Euclidean construction"');
    expect(html).toContain('aria-label="Postulate match 5"');
    expect(html).toContain("euclid-five-postulates-hero.png");
  });

  it("renders the dedicated fifth-postulate-equivalence target for lesson 10055", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-equivalent-forms-of-the-fifth-postulate",
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
    expect(html).toContain('data-testid="school-mockup-0729"');
    expect(html).toContain(
      "dedicated-linked-parallel-equivalence-and-assumption-testing-engine",
    );
    expect(html).toContain('data-scenario="Playfair&#x27;s Axiom"');
    expect(html).toContain('data-point="220,92"');
    expect(html).toContain('data-angle="-10"');
    expect(html).toContain('data-show-angles="true"');
    expect(html).toContain('data-transversal="true"');
    expect(html).toContain('data-score="idle"');
    expect(html).toContain(
      'aria-label="Interactive fifth-postulate equivalence diagram"',
    );
  });

  it("renders the dedicated axiom-versus-theorem target for lesson 10056", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-axiom-versus-theorem",
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
    expect(html).toContain('data-testid="school-mockup-0730"');
    expect(html).toContain(
      "dedicated-proof-dependency-counterexample-and-minimal-chain-engine",
    );
    expect(html).toContain('data-assumed="A1,A2,D1"');
    expect(html).toContain('data-proved="T1,T2"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-counterexample="true"');
    expect(html).toContain('data-challenge=""');
    expect(html).toContain('aria-label="Whole value"');
    expect(html).toContain('aria-label="Part value"');
  });

  it("renders the dedicated proof-structure target for lesson 10057", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-proof-structure-and-logical-statements",
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
    expect(html).toContain('data-testid="school-mockup-0731"');
    expect(html).toContain("dedicated-ordered-proof-reason-and-repair-engine");
    expect(html).toContain('data-proof="G1,D1,T1"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-extra-given="false"');
    expect(html).toContain('data-fix-score="idle"');
    expect(html).toContain('aria-label="Repair step 1"');
    expect(html).toContain('aria-label="Repair step 2"');
    expect(html).toContain('aria-label="Repair step 3"');
  });

  it("renders the dedicated vertically-opposite-angles target for lesson 10058", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-vertically-opposite-angles",
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
    expect(html).toContain('data-testid="school-mockup-0732"');
    expect(html).toContain(
      "dedicated-intersecting-lines-drag-angle-pair-engine",
    );
    expect(html).toContain('data-angle="68"');
    expect(html).toContain('data-supplement="112"');
    expect(html).toContain('data-challenge="125"');
    expect(html).toContain(
      'aria-label="Interactive intersecting lines diagram"',
    );
    expect(html).toContain('aria-label="Angle between lines"');
  });

  it("renders the dedicated linear-pair target for lesson 10059", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-linear-pair-axiom-and-converse",
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
    expect(html).toContain('data-testid="school-mockup-0733"');
    expect(html).toContain(
      "dedicated-linear-pair-axiom-converse-construction-engine",
    );
    expect(html).toContain('data-angle="72"');
    expect(html).toContain('data-supplement="108"');
    expect(html).toContain('data-mode="axiom"');
    expect(html).toContain('data-tool="ray"');
    expect(html).toContain('data-challenge="65,115"');
    expect(html).toContain('data-challenge-valid="true"');
    expect(html).toContain('aria-label="Interactive linear pair construction"');
  });

  it("renders the dedicated corresponding-angles target for lesson 10060", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-corresponding-angles",
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
    expect(html).toContain('data-testid="school-mockup-0734"');
    expect(html).toContain(
      "dedicated-two-line-transversal-correspondence-parallel-test-engine",
    );
    expect(html).toContain('data-angle="64"');
    expect(html).toContain('data-values="64,116,64,116,64,116,64,116"');
    expect(html).toContain('data-parallel="true"');
    expect(html).toContain('data-selected-pairs="0,1,2,3"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain(
      'aria-label="Interactive corresponding angles diagram"',
    );
  });

  it("renders the dedicated alternate-interior target for lesson 10061", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-alternate-interior-angles",
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
    expect(html).toContain('data-testid="school-mockup-0735"');
    expect(html).toContain(
      "dedicated-alternate-interior-position-equality-converse-engine",
    );
    expect(html).toContain('data-angle="117"');
    expect(html).toContain('data-supplement="63"');
    expect(html).toContain('data-parallel="true"');
    expect(html).toContain('data-selected="0,1"');
    expect(html).toContain('data-solved="false"');
    expect(html).toContain(
      'aria-label="Interactive alternate interior angle diagram"',
    );
  });

  it("renders the dedicated same-side-interior target for lesson 10062", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-interior-angles-on-the-same-side",
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
    expect(html).toContain('data-testid="school-mockup-0736"');
    expect(html).toContain(
      "dedicated-same-side-interior-supplement-converse-engine",
    );
    expect(html).toContain('data-angles="62,118"');
    expect(html).toContain('data-sum="180"');
    expect(html).toContain('data-parallel="true"');
    expect(html).toContain('data-pair="0"');
    expect(html).toContain('data-tilt="14"');
    expect(html).toContain('data-challenge-valid="true"');
    expect(html).toContain(
      'aria-label="Interactive same-side interior diagram"',
    );
  });

  it("renders the dedicated parallel-converse target for lesson 10063", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-parallel-line-converse-theorems",
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
    expect(html).toContain('data-testid="school-mockup-0737"');
    expect(html).toContain(
      "dedicated-parallel-converse-evidence-inference-engine",
    );
    expect(html).toContain('data-test="0"');
    expect(html).toContain('data-angle="58"');
    expect(html).toContain('data-paired="58"');
    expect(html).toContain('data-condition="true"');
    expect(html).toContain('data-challenge-score="3"');
    expect(html).toContain(
      'aria-label="Interactive parallel converse diagram"',
    );
  });

  it("renders the dedicated triangle-angle-sum target for lesson 10064", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-triangle-angle-sum-theorem",
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
    expect(html).toContain('data-testid="school-mockup-0738"');
    expect(html).toContain(
      "dedicated-draggable-triangle-angle-sum-tear-rearrange-engine",
    );
    expect(html).toContain('data-points="70,320;450,320;328,35"');
    expect(html).toContain('data-angles="48,67,65"');
    expect(html).toContain('data-sum="180"');
    expect(html).toContain('data-line="0,1,2"');
    expect(html).toContain('data-challenge="0"');
    expect(html).toContain(
      'aria-label="Interactive triangle angle sum diagram"',
    );
  });

  it("renders the dedicated exterior-angle target for lesson 10065", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-euclidean-geometry-exterior-angle-theorem",
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
    expect(html).toContain('data-testid="school-mockup-0739"');
    expect(html).toContain(
      "dedicated-exterior-ray-remote-angle-balance-engine",
    );
    expect(html).toContain('data-extended="true"');
    expect(html).toContain('data-tilt="0"');
    expect(html).toContain('data-angles="42,73,65,115"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-answer="73"');
    expect(html).toContain('data-correct="true"');
    expect(html).toContain('aria-label="Interactive exterior angle triangle"');
  });

  it("renders the dedicated SAS-congruence target for lesson 10066", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-triangle-proofs-sas-congruence",
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
    expect(html).toContain('data-testid="school-mockup-0740"');
    expect(html).toContain(
      "dedicated-two-triangle-sas-congruence-overlay-engine",
    );
    expect(html).toContain('data-abc="5,7,60"');
    expect(html).toContain('data-def="5,7,60"');
    expect(html).toContain('data-overlay="true"');
    expect(html).toContain('data-matches="true"');
    expect(html).toContain('data-score="4"');
    expect(html).toContain('aria-label="Triangle ABC SAS model"');
    expect(html).toContain('aria-label="Triangle DEF SAS model"');
    expect(html).toContain('draggable="true"');
  });

  it("renders the dedicated ASA-congruence target for lesson 10067", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-triangle-proofs-asa-congruence",
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
    expect(html).toContain('data-testid="school-mockup-0741"');
    expect(html).toContain(
      "dedicated-dual-angle-included-side-asa-congruence-engine",
    );
    expect(html).toContain('data-one="50,70,6,60"');
    expect(html).toContain('data-two="50,70,6,60"');
    expect(html).toContain('data-matches="true"');
    expect(html).toContain('data-challenge="40,65,7"');
    expect(html).toContain('aria-label="ASA triangle ABC"');
    expect(html).toContain('aria-label="ASA triangle DEF"');
  });

  it("renders the dedicated AAS-congruence target for lesson 10068", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-triangle-proofs-aas-congruence",
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
    expect(html).toContain('data-testid="school-mockup-0742"');
    expect(html).toContain(
      "dedicated-aas-nonincluded-side-law-of-sines-engine",
    );
    expect(html).toContain('data-model="45,70,6"');
    expect(html).toContain('data-third="65"');
    expect(html).toContain('data-sides="5.79,4.51"');
    expect(html).toContain('data-overlay="false"');
    expect(html).toContain('data-show-sides="false"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('aria-label="AAS triangle ABC"');
    expect(html).toContain('aria-label="AAS triangle DEF"');
  });

  it("renders the dedicated SSS-congruence target for lesson 10069", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-triangle-proofs-sss-congruence",
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
    expect(html).toContain('data-testid="school-mockup-0743"');
    expect(html).toContain(
      "dedicated-linked-sss-circle-intersection-rigid-overlay-engine",
    );
    expect(html).toContain('data-sides="5,6,7"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-mode="Perfect Overlay"');
    expect(html).toContain('data-arcs="true"');
    expect(html).toContain('data-measures="true"');
    expect(html).toContain('data-correspondence="true"');
    expect(html).toContain('aria-label="SSS triangle ABC"');
    expect(html).toContain('aria-label="SSS triangle DEF"');
  });

  it("renders the dedicated RHS-congruence target for lesson 10070", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-triangle-proofs-rhs-congruence",
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
    expect(html).toContain('data-testid="school-mockup-0744"');
    expect(html).toContain(
      "dedicated-rhs-pythagorean-locked-right-triangle-engine",
    );
    expect(html).toContain('data-model="10.00,6.00,8.00"');
    expect(html).toContain('data-parts="1,1,0"');
    expect(html).toContain('data-view="normal"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-satisfied="true"');
    expect(html).toContain('aria-label="Interactive RHS triangle ABC"');
    expect(html).toContain('aria-label="Interactive RHS triangle DEF"');
  });

  it("renders the dedicated equal-sides-and-angles target for lesson 10071", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-triangle-proofs-equal-sides-and-equal-angles",
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
    expect(html).toContain('data-testid="school-mockup-0745"');
    expect(html).toContain(
      "dedicated-constrained-apex-isosceles-opposite-parts-engine",
    );
    expect(html).toContain('data-apex="0.00,2.43"');
    expect(html).toContain('data-sides="6.72,6.72,7.24"');
    expect(html).toContain('data-angles="44.7,67.6,67.6"');
    expect(html).toContain('data-side-lock="1"');
    expect(html).toContain('data-angle-lock="1"');
    expect(html).toContain('data-options="1,1,1,1"');
    expect(html).toContain('data-equal="true"');
    expect(html).toContain('data-choice="0,0,1,0"');
    expect(html).toContain(
      'aria-label="Draggable equal sides and angles triangle"',
    );
  });

  it("renders the dedicated triangle-inequality target for lesson 10072", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-triangle-proofs-triangle-inequality",
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
    expect(html).toContain('data-testid="school-mockup-0746"');
    expect(html).toContain("dedicated-segment-drop-triangle-inequality-engine");
    expect(html).toContain('data-sides="4,5,8"');
    expect(html).toContain('data-checks="1,1,1"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-perimeter="17"');
    expect(html).toContain('data-placed=""');
    expect(html).toContain('data-view="triangle"');
    expect(html).toContain('data-challenge="5,6,7,8,9,10,11,12,13"');
    expect(html).toContain('aria-label="Triangle construction drop zone"');
    expect(html).toContain('draggable="true"');
  });

  it("renders the dedicated parallelogram-opposite-sides target for lesson 10073", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-opposite-sides",
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
    expect(html).toContain('data-testid="school-mockup-0747"');
    expect(html).toContain(
      "dedicated-constrained-parallelogram-congruence-proof-engine",
    );
    expect(html).toContain('data-points="118,82;488,82;440,330;70,330"');
    expect(html).toContain('data-sides="370,252.6,370,252.6"');
    expect(html).toContain('data-opposite-equal="true"');
    expect(html).toContain('data-diagonal="AC"');
    expect(html).toContain('data-overlays="1,1,1"');
    expect(html).toContain('data-score="7/7"');
    expect(html).toContain('aria-label="Draggable parallelogram ABCD"');
    expect(html).toContain('aria-label="Draggable vertex A"');
  });

  it("renders the dedicated parallelogram-opposite-angles target for lesson 10074", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-opposite-angles",
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
    expect(html).toContain('data-testid="school-mockup-0748"');
    expect(html).toContain(
      "dedicated-constrained-parallelogram-opposite-angle-engine",
    );
    expect(html).toContain('data-points="82,85;402,85;492,312;172,312"');
    expect(html).toContain('data-angles="68,112,68,112"');
    expect(html).toContain('data-diagonal="AC"');
    expect(html).toContain('data-layers="1,1,1"');
    expect(html).toContain('data-proof-step="1"');
    expect(html).toContain('data-challenge="95;85,85,95;3/3"');
    expect(html).toContain(
      'aria-label="Draggable opposite-angle parallelogram"',
    );
    expect(html).toContain('aria-label="Draggable vertex C"');
  });

  it("renders the dedicated parallelogram-diagonals target for lesson 10075", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-diagonals",
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
    expect(html).toContain('data-testid="school-mockup-0749"');
    expect(html).toContain("dedicated-half-diagonal-midpoint-bisection-engine");
    expect(html).toContain(
      'data-points="88,46;440,70;472,334;120,310;280,190"',
    );
    expect(html).toContain('data-measures="6,6,5,5"');
    expect(html).toContain('data-totals="12,10"');
    expect(html).toContain('data-midpoint="true"');
    expect(html).toContain('data-locked="true"');
    expect(html).toContain('data-score="4/4"');
    expect(html).toContain(
      'aria-label="Draggable parallelogram diagonal model"',
    );
    expect(html).toContain('aria-label="Draggable midpoint O"');
  });

  it("renders the dedicated quadrilateral-condition dashboard for lesson 10076", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-quadrilateral-proofs-conditions-for-a-quadrilateral-to-be-a-parallelogram",
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
    expect(html).toContain('data-testid="school-mockup-0750"');
    expect(html).toContain(
      "dedicated-quadrilateral-measurement-and-sufficient-condition-dashboard",
    );
    expect(html).toContain('data-points="105,70;420,88;378,320;58,310"');
    expect(html).toContain('data-certificates="0,0,0,1,0"');
    expect(html).toContain('data-result="true"');
    expect(html).toContain('data-count="1"');
    expect(html).toContain('data-tool="vertex"');
    expect(html).toContain('data-locked="false"');
    expect(html).toContain(
      'aria-label="Draggable quadrilateral condition model"',
    );
    expect(html).toContain('aria-label="Challenge justification"');
  });

  it("renders the dedicated midpoint-theorem target for lesson 10077", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-quadrilateral-proofs-midpoint-theorem",
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
    expect(html).toContain('data-testid="school-mockup-0751"');
    expect(html).toContain("dedicated-moving-triangle-midpoint-segment-engine");
    expect(html).toContain('data-points="324.32,91.79;100,320;500,320"');
    expect(html).toContain('data-midpoints="212.16,205.9;412.16,205.9"');
    expect(html).toContain('data-lengths="8,7.2,10,5"');
    expect(html).toContain('data-ratio="0.5"');
    expect(html).toContain('data-parallel="true"');
    expect(html).toContain('data-show-midpoints="true"');
    expect(html).toContain('data-checks="1,1"');
    expect(html).toContain('aria-label="Draggable midpoint theorem triangle"');
    expect(html).toContain('aria-label="Draggable vertex A"');
  });

  it("renders the dedicated converse-midpoint target for lesson 10078", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-quadrilateral-proofs-converse-of-midpoint-theorem",
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
    expect(html).toContain('data-testid="school-mockup-0752"');
    expect(html).toContain(
      "dedicated-midpoint-parallel-line-intersection-converse-engine",
    );
    expect(html).toContain('data-points="210,55;80,330;500,330"');
    expect(html).toContain('data-d="145,192.5"');
    expect(html).toContain('data-e="355,192.5"');
    expect(html).toContain('data-ratio="1"');
    expect(html).toContain('data-parallel="true"');
    expect(html).toContain('data-bisected="true"');
    expect(html).toContain('data-angle="0"');
    expect(html).toContain('data-mode="forward"');
    expect(html).toContain('data-show="1,1,1"');
    expect(html).toContain(
      'aria-label="Draggable converse midpoint theorem triangle"',
    );
    expect(html).toContain('aria-label="Line DE rotation"');
  });

  it("renders the dedicated Heron formula target for lesson 10079", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-mensuration-heron-s-formula-derivation",
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
    expect(html).toContain('data-testid="school-mockup-0753"');
    expect(html).toContain(
      "dedicated-heron-altitude-semiperimeter-area-engine",
    );
    expect(html).toContain('data-sides="13,14,15"');
    expect(html).toContain('data-semiperimeter="21"');
    expect(html).toContain('data-area="84"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain('data-order="ABCDEF"');
    expect(html).toContain('aria-label="Draggable Heron formula triangle"');
    expect(html).toContain('aria-label="Side a"');
  });

  it("renders the dedicated semi-perimeter target for lesson 10080", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-mensuration-semi-perimeter-lab",
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
    expect(html).toContain('data-testid="school-mockup-0754"');
    expect(html).toContain(
      "dedicated-semiperimeter-ribbon-heron-factor-engine",
    );
    expect(html).toContain('data-sides="5,5,6"');
    expect(html).toContain('data-perimeter="16"');
    expect(html).toContain('data-semiperimeter="8"');
    expect(html).toContain('data-factors="3,3,2"');
    expect(html).toContain('data-area="12"');
    expect(html).toContain('aria-label="Draggable semi-perimeter triangle"');
  });

  it("renders the dedicated coordinate-versus-Heron target for lesson 10081", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-mensuration-coordinate-area-versus-heron-s-formula",
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
    expect(html).toContain('data-testid="school-mockup-0755"');
    expect(html).toContain(
      "dedicated-coordinate-shoelace-heron-reconciliation-engine",
    );
    expect(html).toContain('data-c="0,3"');
    expect(html).toContain('data-sides="4,5,3"');
    expect(html).toContain('data-semiperimeter="6"');
    expect(html).toContain('data-coordinate-area="6"');
    expect(html).toContain('data-heron-area="6"');
    expect(html).toContain('data-match="true"');
    expect(html).toContain('aria-label="Draggable coordinate triangle"');
  });

  it("renders the dedicated combined-solids target for lesson 10082", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-9/class-9-mensuration-combined-solids",
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
    expect(html).toContain('data-testid="school-mockup-0756"');
    expect(html).toContain(
      "dedicated-component-solid-volume-external-surface-engine",
    );
    expect(html).toContain('data-parts="cylinder,hemisphere"');
    expect(html).toContain('data-volume-pi="90"');
    expect(html).toContain('data-surface-pi="75"');
    expect(html).toContain('data-radius="3"');
    expect(html).toContain('data-height="8"');
    expect(html).toContain('data-correct="true"');
  });

  it("renders the dedicated distance-formula target for lesson 10083", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-coordinate-geometry-distance-formula",
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
    expect(html).toContain('data-testid="school-mockup-0757"');
    expect(html).toContain("dedicated-two-point-distance-pythagorean-engine");
    expect(html).toContain('data-a="1,2"');
    expect(html).toContain('data-b="5,5"');
    expect(html).toContain('data-differences="4,3"');
    expect(html).toContain('data-square="25"');
    expect(html).toContain('data-distance="5"');
    expect(html).toContain('aria-label="Draggable point A"');
    expect(html).toContain('aria-label="Draggable point B"');
  });

  it("renders the dedicated midpoint-formula target for lesson 10084", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-coordinate-geometry-midpoint-formula",
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
    expect(html).toContain('data-testid="school-mockup-0758"');
    expect(html).toContain(
      "dedicated-endpoint-average-equal-distance-midpoint-engine",
    );
    expect(html).toContain('data-a="-2,4"');
    expect(html).toContain('data-b="6,-2"');
    expect(html).toContain('data-midpoint="2,1"');
    expect(html).toContain('data-distances="5,5"');
    expect(html).toContain('data-challenge-midpoint="2,1"');
    expect(html).toContain('data-challenge-fixed="true"');
  });

  it("renders the dedicated internal-section target for lesson 10085", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-coordinate-geometry-internal-section-formula",
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
    expect(html).toContain('data-testid="school-mockup-0759"');
    expect(html).toContain("dedicated-internal-section-weighted-ratio-engine");
    expect(html).toContain('data-point="4,2"');
    expect(html).toContain('data-ratio="2:3"');
    expect(html).toContain('data-distances="4.47,6.71"');
    expect(html).toContain('data-ratio-match="true"');
    expect(html).toContain('data-challenge-point="6,3"');
    expect(html).toContain('data-challenge-correct="true"');
    expect(html).toContain('aria-label="Draggable main point P"');
    expect(html).toContain('aria-label="Draggable challenge point P"');
  });

  it("renders the dedicated external-section target for lesson 10086", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-coordinate-geometry-external-section-formula",
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
    expect(html).toContain('data-testid="school-mockup-0760"');
    expect(html).toContain(
      "dedicated-directed-external-section-singularity-engine",
    );
    expect(html).toContain('data-point="8,4"');
    expect(html).toContain('data-ratio="2:1"');
    expect(html).toContain('data-distances="8.944,4.472"');
    expect(html).toContain('data-match="true"');
    expect(html).toContain('data-singular="false"');
    expect(html).toContain('aria-label="Draggable external point P"');
    expect(html).toContain("Point goes to infinity");
  });

  it("renders the dedicated coordinate-triangle-area target for lesson 10087", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-coordinate-geometry-area-of-triangle-using-coordinates",
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
    expect(html).toContain('data-testid="school-mockup-0761"');
    expect(html).toContain(
      "dedicated-three-vertex-signed-determinant-area-engine",
    );
    expect(html).toContain('data-a="1,1"');
    expect(html).toContain('data-b="5,1"');
    expect(html).toContain('data-c="3,4"');
    expect(html).toContain('data-determinant="12"');
    expect(html).toContain('data-signed-area="6"');
    expect(html).toContain('data-absolute-area="6"');
    expect(html).toContain('data-orientation="counterclockwise"');
    expect(html).toContain('aria-label="Draggable vertex A"');
    expect(html).toContain('aria-label="Draggable vertex B"');
    expect(html).toContain('aria-label="Draggable vertex C"');
  });

  it("renders the dedicated collinearity-area target for lesson 10088", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-coordinate-geometry-collinearity-using-coordinate-area",
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
    expect(html).toContain('data-testid="school-mockup-0762"');
    expect(html).toContain(
      "dedicated-three-point-zero-determinant-line-distance-engine",
    );
    expect(html).toContain('data-a="1,2"');
    expect(html).toContain('data-b="3,4"');
    expect(html).toContain('data-c="5,6"');
    expect(html).toContain('data-determinant="0"');
    expect(html).toContain('data-area="0"');
    expect(html).toContain('data-distance="0"');
    expect(html).toContain('data-collinear="true"');
    expect(html).toContain('aria-label="Draggable collinearity point C"');
    expect(html).toContain('aria-label="Line equation"');
  });

  it("renders the dedicated equal-chords target for lesson 10089", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-circle-proofs-equal-chords-and-equal-angles",
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
    expect(html).toContain('data-testid="school-mockup-0763"');
    expect(html).toContain(
      "dedicated-equal-chord-central-angle-congruence-engine",
    );
    expect(html).toContain('data-ab="6"');
    expect(html).toContain('data-cd="6"');
    expect(html).toContain('data-left-angle="54"');
    expect(html).toContain('data-right-angle="54"');
    expect(html).toContain('data-equal-chords="true"');
    expect(html).toContain('data-equal-angles="true"');
    expect(html).toContain('data-theorem="true"');
    expect(html).toContain('aria-label="Draggable chord point A"');
    expect(html).toContain('aria-label="Draggable chord point D"');
  });

  it("renders the dedicated centre-perpendicular target for lesson 10090", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-circle-proofs-perpendicular-from-centre-to-chord",
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
    expect(html).toContain('data-testid="school-mockup-0764"');
    expect(html).toContain(
      "dedicated-centre-perpendicular-chord-bisection-engine",
    );
    expect(html).toContain('data-radius="6"');
    expect(html).toContain('data-chord="10"');
    expect(html).toContain('data-half="5"');
    expect(html).toContain('data-om="3.32"');
    expect(html).toContain('data-am="5"');
    expect(html).toContain('data-mb="5"');
    expect(html).toContain('data-right-angles="90,90"');
    expect(html).toContain('data-congruent="true"');
    expect(html).toContain('aria-label="Draggable chord endpoint A"');
    expect(html).toContain('aria-label="Draggable chord endpoint B"');
  });

  it("renders the dedicated arc-angle target for lesson 10091", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-circle-proofs-angle-subtended-by-an-arc",
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
    expect(html).toContain('data-testid="school-mockup-0765"');
    expect(html).toContain(
      "dedicated-fixed-arc-central-inscribed-angle-engine",
    );
    expect(html).toContain('data-position="0.5"');
    expect(html).toContain('data-c="0,1"');
    expect(html).toContain('data-central-angle="118.4"');
    expect(html).toContain('data-inscribed-angle="59.2"');
    expect(html).toContain('data-ratio="2"');
    expect(html).toContain('data-invariant="true"');
    expect(html).toContain('aria-label="Draggable point C on major arc"');
    expect(html).toContain('aria-label="Point C around major arc"');
  });

  it("renders the dedicated semicircle target for lesson 10092", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-circle-proofs-angle-in-a-semicircle",
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
    expect(html).toContain('data-testid="school-mockup-0766"');
    expect(html).toContain("dedicated-diameter-semicircle-right-angle-engine");
    expect(html).toContain('data-theta="68"');
    expect(html).toContain('data-c="2.36,5.85"');
    expect(html).toContain('data-angle-a="34"');
    expect(html).toContain('data-angle-b="56"');
    expect(html).toContain('data-angle-c="90"');
    expect(html).toContain('data-pythagorean="true"');
    expect(html).toContain('aria-label="Point C on semicircle"');
    expect(html).toContain('aria-label="Point C position"');
    expect(html).toContain('aria-label="Start auto-drag"');
  });

  it("renders the dedicated same-segment target for lesson 10093", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-circle-proofs-angles-in-the-same-segment",
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
    expect(html).toContain('data-testid="school-mockup-0767"');
    expect(html).toContain(
      "dedicated-two-point-same-segment-inscribed-angle-engine",
    );
    expect(html).toContain('data-c-angle="125"');
    expect(html).toContain('data-d-angle="55"');
    expect(html).toContain('data-angle-c="52"');
    expect(html).toContain('data-angle-d="52"');
    expect(html).toContain('data-difference="0"');
    expect(html).toContain('data-relation="equal"');
    expect(html).toContain('aria-label="Point C on circle"');
    expect(html).toContain('aria-label="Point D on circle"');
  });

  it("renders the dedicated cyclic-quadrilateral target for lesson 10094", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-circle-proofs-cyclic-quadrilateral",
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
    expect(html).toContain('data-testid="school-mockup-0768"');
    expect(html).toContain("dedicated-four-vertex-cyclic-quadrilateral-engine");
    expect(html).toContain('data-vertices-on-circle="4"');
    expect(html).toContain('data-angle-a="94.5"');
    expect(html).toContain('data-angle-b="93"');
    expect(html).toContain('data-angle-c="85.5"');
    expect(html).toContain('data-angle-d="87"');
    expect(html).toContain('data-sum-ac="180"');
    expect(html).toContain('data-sum-bd="180"');
    expect(html).toContain('data-cyclic="true"');
    expect(html).toContain('aria-label="Vertex A"');
    expect(html).toContain('aria-label="Vertex D"');
    expect(html).toContain('aria-label="Challenge vertex B radius"');
  });

  it("renders the dedicated opposite-cyclic-angle target for lesson 10095", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-circle-proofs-opposite-angles-of-a-cyclic-quadrilateral",
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
    expect(html).toContain('data-testid="school-mockup-0769"');
    expect(html).toContain("dedicated-cyclic-opposite-angle-and-arc-engine");
    expect(html).toContain('data-angle-a="112"');
    expect(html).toContain('data-angle-b="74"');
    expect(html).toContain('data-angle-c="68"');
    expect(html).toContain('data-angle-d="106"');
    expect(html).toContain('data-sum-ac="180"');
    expect(html).toContain('data-sum-bd="180"');
    expect(html).toContain('data-balanced="true"');
    expect(html).toContain('data-arc-bc="224"');
    expect(html).toContain('data-arc-ab="212"');
    expect(html).toContain('aria-label="Challenge angle A"');
    expect(html).toContain('aria-label="Prediction for angle C"');
  });

  it("renders the dedicated tangent-perpendicular target for lesson 10096", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-circle-proofs-tangent-perpendicular-to-radius",
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
    expect(html).toContain('data-testid="school-mockup-0770"');
    expect(html).toContain(
      "dedicated-tangent-line-distance-intersection-engine",
    );
    expect(html).toContain('data-t-angle="270"');
    expect(html).toContain('data-line-angle="0"');
    expect(html).toContain('data-distance="6"');
    expect(html).toContain('data-intersections="1"');
    expect(html).toContain('data-contact-angle="90"');
    expect(html).toContain('data-status="tangent"');
    expect(html).toContain('data-perpendicular="true"');
    expect(html).toContain('aria-label="Tangent point T"');
    expect(html).toContain('aria-label="Rotate tangent line"');
  });

  it("renders the dedicated external-tangent-length target for lesson 10097", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-circle-proofs-tangent-lengths-from-an-external-point",
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
    expect(html).toContain('data-testid="school-mockup-0771"');
    expect(html).toContain(
      "dedicated-external-point-two-tangent-congruence-engine",
    );
    expect(html).toContain('data-distance-op="10"');
    expect(html).toContain('data-direction="0"');
    expect(html).toContain('data-pa="8"');
    expect(html).toContain('data-pb="8"');
    expect(html).toContain('data-difference="0"');
    expect(html).toContain('data-equal="true"');
    expect(html).toContain('aria-label="Point A"');
    expect(html).toContain('aria-label="Point B"');
    expect(html).toContain('aria-label="Point P"');
  });

  it("renders the dedicated angle-elevation target for lesson 10098", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-trigonometry-applications-angle-of-elevation",
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
    expect(html).toContain('data-testid="school-mockup-0772"');
    expect(html).toContain(
      "dedicated-angle-elevation-surveying-triangle-engine",
    );
    expect(html).toContain('data-distance="20"');
    expect(html).toContain('data-angle="45"');
    expect(html).toContain('data-eye-height="1.6"');
    expect(html).toContain('data-height="20"');
    expect(html).toContain('data-total-height="21.6"');
    expect(html).toContain('data-challenge-expected="22.61"');
    expect(html).toContain('aria-label="Tower top C"');
    expect(html).toContain('aria-label="Tower height estimate"');
    expect(html).toContain("angle-elevation-scene-v2.png");
  });

  it("renders the dedicated angle-depression target for lesson 10099", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-trigonometry-applications-angle-of-depression",
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
    expect(html).toContain('data-testid="school-mockup-0773"');
    expect(html).toContain("dedicated-angle-depression-parallel-lines-engine");
    expect(html).toContain('data-height="40"');
    expect(html).toContain('data-distance="69.28"');
    expect(html).toContain('data-depression-angle="30"');
    expect(html).toContain('data-elevation-angle="30"');
    expect(html).toContain('data-equal-angles="true"');
    expect(html).toContain('aria-label="Boat B"');
    expect(html).toContain("angle-depression-lighthouse.png");
  });

  it("renders the dedicated shadow-length target for lesson 10100", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-trigonometry-applications-shadow-length-modelling",
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
    expect(html).toContain('data-testid="school-mockup-0774"');
    expect(html).toContain("dedicated-shadow-similar-triangle-engine");
    expect(html).toContain('data-angle="45"');
    expect(html).toContain('data-shadow="6"');
    expect(html).toContain('data-height="6"');
    expect(html).toContain('data-ratio="1"');
    expect(html).toContain('data-challenge-height="6.3"');
    expect(html).toContain('aria-label="Shadow endpoint"');
    expect(html).toContain('aria-label="Solar elevation"');
    expect(html).toContain('aria-label="Shadow length"');
  });

  it("renders the dedicated two-observer target for lesson 10101", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-trigonometry-applications-two-observer-height-problems",
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
    expect(html).toContain('data-testid="school-mockup-0775"');
    expect(html).toContain("dedicated-two-observer-linked-tangent-engine");
    expect(html).toContain('data-near-angle="60"');
    expect(html).toContain('data-far-angle="30"');
    expect(html).toContain('data-observer-gap="20"');
    expect(html).toContain('data-near-distance="10"');
    expect(html).toContain('data-height="17.321"');
    expect(html).toContain('data-challenge-near="21.21"');
    expect(html).toContain('data-challenge-height="21.21"');
    expect(html).toContain('aria-label="Near observer"');
    expect(html).toContain('aria-label="Far observer"');
  });

  it("renders the dedicated grouped-mean direct target for lesson 10102", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-statistics-grouped-mean-by-direct-method",
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
    expect(html).toContain('data-testid="school-mockup-0776"');
    expect(html).toContain("dedicated-grouped-frequency-direct-mean-engine");
    expect(html).toContain('data-row-count="5"');
    expect(html).toContain('data-selected-row="4"');
    expect(html).toContain('data-total-frequency="40"');
    expect(html).toContain('data-total-product="1140"');
    expect(html).toContain('data-mean="28.5"');
    expect(html).toContain('aria-label="Frequency row 1"');
    expect(html).toContain('aria-label="Midpoint row 4"');
    expect(html).toContain("Calculate Mean");
  });

  it("renders the dedicated assumed-mean target for lesson 10103", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-statistics-grouped-mean-by-assumed-mean",
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
    expect(html).toContain('data-testid="school-mockup-0777"');
    expect(html).toContain("dedicated-assumed-mean-deviation-invariant-engine");
    expect(html).toContain('data-assumed-mean="25"');
    expect(html).toContain('data-total-frequency="40"');
    expect(html).toContain('data-total-deviation="60"');
    expect(html).toContain('data-mean="26.5"');
    expect(html).toContain('data-direct-mean="26.5"');
    expect(html).toContain('data-invariant="true"');
    expect(html).toContain('aria-label="Assumed mean marker"');
    expect(html).toContain('aria-label="Frequency row 1"');
  });

  it("renders the dedicated step-deviation target for lesson 10104", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-statistics-grouped-mean-by-step-deviation",
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
    expect(html).toContain('data-testid="school-mockup-0778"');
    expect(html).toContain("dedicated-step-deviation-common-width-engine");
    expect(html).toContain('data-assumed-mean="25"');
    expect(html).toContain('data-class-width="10"');
    expect(html).toContain('data-total-frequency="40"');
    expect(html).toContain('data-total-step="1"');
    expect(html).toContain('data-mean="25.25"');
    expect(html).toContain('data-equal-width="true"');
    expect(html).toContain('data-widths="10,10,10,10,10"');
    expect(html).toContain('aria-label="Assumed mean step marker"');
  });

  it("renders the dedicated less-than cumulative target for lesson 10105", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-statistics-less-than-cumulative-frequency",
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
    expect(html).toContain('data-testid="school-mockup-0779"');
    expect(html).toContain("dedicated-less-than-cumulative-ogive-engine");
    expect(html).toContain('data-frequencies="4,3,5,6,7,5"');
    expect(html).toContain('data-cumulative="4,7,12,18,25,30"');
    expect(html).toContain('data-total="30"');
    expect(html).toContain('data-show-values="true"');
    expect(html).toContain('data-show-points="true"');
    expect(html).toContain('aria-label="Frequency row 3"');
    expect(html).toContain("Randomize Frequencies");
  });

  it("renders the dedicated more-than cumulative target for lesson 10106", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-statistics-more-than-cumulative-frequency",
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
    expect(html).toContain('data-testid="school-mockup-0780"');
    expect(html).toContain("dedicated-more-than-descending-subtraction-engine");
    expect(html).toContain('data-frequencies="6,9,12,8,5"');
    expect(html).toContain('data-more-than="40,34,25,13,5,0"');
    expect(html).toContain('data-less-than="0,6,15,27,35,40"');
    expect(html).toContain('data-total="40"');
    expect(html).toContain('aria-label="Frequency row 3"');
    expect(html).toContain('aria-label="Clear frequency row 2"');
  });

  it("renders the dedicated less-than ogive target for lesson 10107", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-statistics-less-than-ogive",
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
    expect(html).toContain('data-testid="school-mockup-0781"');
    expect(html).toContain("dedicated-less-than-ogive-median-read-off-engine");
    expect(html).toContain(
      'data-points="10.5:0,20.5:4,30.5:8,40.5:15,50.5:22,60.5:28,70.5:30"',
    );
    expect(html).toContain('data-total="30"');
    expect(html).toContain('data-half="15"');
    expect(html).toContain('data-median="40.5"');
    expect(html).toContain('aria-label="Ogive point 4"');
    expect(html).toContain("Export PNG");
  });

  it("renders the dedicated more-than ogive target for lesson 10108", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-statistics-more-than-ogive",
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
    expect(html).toContain('data-testid="school-mockup-0782"');
    expect(html).toContain(
      "dedicated-more-than-ogive-descending-median-engine",
    );
    expect(html).toContain('data-frequencies="4,6,8,7,5"');
    expect(html).toContain('data-more-than="30,26,20,12,5,0"');
    expect(html).toContain('data-total="30"');
    expect(html).toContain('data-median="26.3"');
    expect(html).toContain('aria-label="More-than point 4"');
  });

  it("renders the dedicated median-from-ogive target for lesson 10109", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-statistics-median-from-an-ogive",
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
    expect(html).toContain('data-testid="school-mockup-0783"');
    expect(html).toContain(
      "dedicated-dual-ogive-grouped-median-equivalence-engine",
    );
    expect(html).toContain('data-frequencies="5,9,12,15,7,2"');
    expect(html).toContain('data-less="0,5,14,26,41,48,50"');
    expect(html).toContain('data-more="50,45,36,24,9,2,0"');
    expect(html).toContain('data-total="50"');
    expect(html).toContain('data-median="29.17"');
    expect(html).toContain('data-median-class="20-30"');
  });

  it("renders the dedicated Three.js frustum target for lesson 10110", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-mensuration-frustum-of-a-cone",
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
    expect(html).toContain('data-testid="school-mockup-0784"');
    expect(html).toContain("dedicated-threejs-frustum-annular-net-engine");
    expect(html).toContain('data-radius-base="6"');
    expect(html).toContain('data-radius-top="3"');
    expect(html).toContain('data-height="8"');
    expect(html).toContain('data-slant="8.54"');
    expect(html).toContain('data-volume="527.79"');
    expect(html).toContain('data-csa="241.58"');
    expect(html).toContain('data-tsa="382.95"');
    expect(html).toContain('data-theta="126.4"');
  });

  it("renders the dedicated Three.js combined-solids target for lesson 10111", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-10/class-10-mensuration-combined-solids",
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
    expect(html).toContain('data-testid="school-mockup-0785"');
    expect(html).toContain(
      "dedicated-threejs-combined-solids-hidden-face-engine",
    );
    expect(html).toContain('data-radius="3"');
    expect(html).toContain('data-cylinder-height="12"');
    expect(html).toContain('data-cone-slant="6"');
    expect(html).toContain('data-cone-height="5.2"');
    expect(html).toContain('data-cylinder-volume="339.29"');
    expect(html).toContain('data-hemisphere-volume="56.55"');
    expect(html).toContain('data-cone-volume="48.97"');
    expect(html).toContain('data-total-volume="444.81"');
    expect(html).toContain('data-exposed-area="339.29"');
  });

  it("renders the dedicated relation graph and matrix target for lesson 10112", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-11/class-11-relations-and-functions-types-of-relations",
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
    expect(html).toContain('data-testid="school-mockup-0786"');
    expect(html).toContain(
      "dedicated-directed-relation-matrix-property-engine",
    );
    expect(html).toContain('data-pair-count="9"');
    expect(html).toContain('data-reflexive="true"');
    expect(html).toContain('data-symmetric="false"');
    expect(html).toContain('data-antisymmetric="true"');
    expect(html).toContain('data-transitive="false"');
    expect(html).toContain("Toggle pair 4, 4");
  });

  it("renders the dedicated reflexive relation checker for lesson 10113", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter
        initialEntries={[
          "/lessons/school/class-11/class-11-relations-and-functions-reflexive-relations",
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
    expect(html).toContain('data-testid="school-mockup-0787"');
    expect(html).toContain(
      "dedicated-reflexive-directed-graph-matrix-witness-engine",
    );
    expect(html).toContain('data-set-size="4"');
    expect(html).toContain('data-pair-count="8"');
    expect(html).toContain('data-missing="1"');
    expect(html).toContain('data-reflexive="false"');
    expect(html).toContain("Missing self-pair: (1, 1)");
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
