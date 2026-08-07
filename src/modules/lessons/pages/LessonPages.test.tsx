import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import LessonsCategoryPage from "./LessonsCategoryPage";
import LessonsHomePage from "./LessonsHomePage";
import LessonPage from "./LessonPage";
import SchoolLessonsPage from "./SchoolLessonsPage";
import SchoolLessonPage from "./SchoolLessonPage";

describe("lesson pages", () => {
  it("renders the complete four-phase catalog", () => {
    const html = renderToStaticMarkup(<MemoryRouter><LessonsHomePage /></MemoryRouter>);
    expect(html).toContain("Interactive lessons");
    expect(html).toContain("919");
    expect(html).toContain("674");
    expect(html).toContain("School Syllabus Remediation");
    expect(html).toContain("220");
    expect(html).toContain("Core Workspaces");
  });

  it("renders a category route", () => {
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={["/lessons/numbers-and-arithmetic"]}><Routes><Route path="/lessons/:categorySlug" element={<LessonsCategoryPage />} /></Routes></MemoryRouter>);
    expect(html).toContain("Numbers and Arithmetic");
    expect(html).toContain("35 lessons");
    expect(html).toContain("Fraction Models");
  });

  it("renders a canonical lesson shell and preserves compact stages", () => {
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={["/lessons/core-workspaces/1-basic-calculator"]}><Routes><Route path="/lessons/:categorySlug/:lessonSlug" element={<LessonPage />} /></Routes></MemoryRouter>);
    expect(html).toContain("Basic Calculator");
    expect(html).toContain("Discover");
    expect(html).toContain("Explore");
    expect(html).toContain("Try");
    expect(html).toContain("Check");
  });

  it("renders generated school syllabus pathways", () => {
    const html = renderToStaticMarkup(<MemoryRouter><SchoolLessonsPage /></MemoryRouter>);
    expect(html).toContain("School syllabus remediation");
    expect(html).toContain("220");
    expect(html).toContain("Euclidean Geometry");
    expect(html).toContain("NCERT Class 6 Mathematics");
  });

  it("renders a generated school lesson route", () => {
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={["/lessons/school/class-9/class-9-euclidean-geometry-euclid-s-five-postulates"]}><Routes><Route path="/lessons/school/:levelSlug/:lessonSlug" element={<SchoolLessonPage />} /></Routes></MemoryRouter>);
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
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={["/lessons/school/class-6/class-6-numbers-and-arithmetic-place-value-explorer"]}><Routes><Route path="/lessons/school/:levelSlug/:lessonSlug" element={<SchoolLessonPage />} /></Routes></MemoryRouter>);
    expect(html).toContain("Place value tells the value of a digit");
    expect(html).toContain("Read digits from right to left");
    expect(html).toContain("In 4,582, what is the place value of 5?");
    expect(html).not.toContain("Place Value Explorer fills a Class 6");
  });

  it("renders strengthened school batch content beyond the first three lessons", () => {
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={["/lessons/school/class-6/class-6-data-handling-pictograph-builder"]}><Routes><Route path="/lessons/school/:levelSlug/:lessonSlug" element={<SchoolLessonPage />} /></Routes></MemoryRouter>);
    expect(html).toContain("A pictograph uses pictures or symbols");
    expect(html).toContain("Always multiply pictures by the key value");
    expect(html).not.toContain("Pictograph Builder fills a Class 6");
  });

  it("renders strengthened advanced school batch content", () => {
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={["/lessons/school/class-11/class-11-relations-and-functions-composition-of-functions"]}><Routes><Route path="/lessons/school/:levelSlug/:lessonSlug" element={<SchoolLessonPage />} /></Routes></MemoryRouter>);
    expect(html).toContain("applying one function after another");
    expect(html).toContain("In f(g(x)), g acts first");
    expect(html).not.toContain("Composition of Functions fills a Class 11");
  });

  it("renders strengthened Class 12 school batch content", () => {
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={["/lessons/school/class-12/class-12-formal-calculus-rolle-s-theorem"]}><Routes><Route path="/lessons/school/:levelSlug/:lessonSlug" element={<SchoolLessonPage />} /></Routes></MemoryRouter>);
    expect(html).toContain("f&#x27;(c)=0");
    expect(html).toContain("Check continuity");
    expect(html).not.toContain("Rolle&#x27;s Theorem fills a Class 12");
  });

  it("renders strengthened final school batch content", () => {
    const html = renderToStaticMarkup(<MemoryRouter initialEntries={["/lessons/school/class-12/class-12-probability-bayes-theorem"]}><Routes><Route path="/lessons/school/:levelSlug/:lessonSlug" element={<SchoolLessonPage />} /></Routes></MemoryRouter>);
    expect(html).toContain("Bayes&#x27; Theorem");
    expect(html).toContain("reverses conditional probability");
    expect(html).toContain("total probability denominator");
    expect(html).not.toContain("Bayes&#x27; Theorem fills a Class 12");
  });
});
