import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import LessonsCategoryPage from "./LessonsCategoryPage";
import LessonsHomePage from "./LessonsHomePage";
import LessonPage from "./LessonPage";

describe("lesson pages", () => {
  it("renders the complete four-phase catalog", () => {
    const html = renderToStaticMarkup(<MemoryRouter><LessonsHomePage /></MemoryRouter>);
    expect(html).toContain("Interactive lessons");
    expect(html).toContain("674");
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
});
