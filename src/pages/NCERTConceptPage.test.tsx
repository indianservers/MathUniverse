import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NCERTConceptPage from "./NCERTConceptPage";

function renderConcept(path: string) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/ncert/:conceptId" element={<NCERTConceptPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("NCERT quantitative bar visuals", () => {
  it("shows one-unit sections for countable exponent results", () => {
    const html = renderConcept("/ncert/class-7-exponents");

    expect(html).toContain("8 units");
    expect(html).toContain("4 units");
    expect(html).toContain("32 units");
    expect(html).toContain("each section = 1 unit");
  });

  it("groups large exponent results into clean unit scales", () => {
    const html = renderConcept("/ncert/class-8-exponents");

    expect(html).toContain("1000 units");
    expect(html).toContain("each section = 100 units");
    expect(html).toContain("1.00e+5 units");
    expect(html).toContain("each section = 5000 units");
  });

  it("adds values and units to comparison and progression bars", () => {
    const comparisonHtml = renderConcept("/ncert/class-7-comparing-quantities");
    const progressionHtml = renderConcept("/ncert/class-10-arithmetic-progressions");

    expect(comparisonHtml).toContain("120.00 units");
    expect(comparisonHtml).toContain("whole bar = 1000 units | each section = 100.00 units");
    expect(progressionHtml).toContain("bar height = term value (units)");
    expect(progressionHtml).toContain("a_n=17 units, S_n=80 units");
  });

  it("labels Grade 7 data bars with their measured units", () => {
    const html = renderConcept("/ncert/class-7-data-handling");

    expect(html).toContain("Data bar chart. Values in units");
    expect(html).toContain("value (units)");
    expect(html).toContain("mean 8.0 units");
  });
});
