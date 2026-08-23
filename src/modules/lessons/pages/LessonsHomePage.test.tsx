import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { getLessonTotals } from "../learningExperience";
import LessonsHomePage from "./LessonsHomePage";

function renderPage(route = "/lessons") {
  return renderToString(
    <MemoryRouter initialEntries={[route]}>
      <LessonsHomePage />
    </MemoryRouter>,
  );
}

describe("LessonsHomePage", () => {
  it("renders the redesigned lessons landing page with real catalog totals and topic icons", () => {
    const html = renderPage();
    const totals = getLessonTotals();

    expect(html).toContain("Mathematics you can see, touch, and understand.");
    expect(html).toContain(`${totals.total}</strong><span>lessons`);
    expect(html).toContain(`${totals.interactive}</strong><span>interactive`);
    expect(html).toContain(`${totals.school}</strong><span>school`);
    expect(html).toContain(`${totals.advanced}</strong><span>advanced`);
    expect(html).toContain("/assets/lesson-topic-icons/07-graphs-and-functions.png");
    expect(html).toContain("Understanding Domain and Range");
    expect(html).toContain("Try a smart search");
    expect(html).toContain("Goal shortcuts");
    expect(html).toContain("Class routes");
    expect(html).toContain("Visual tools");
    expect(html).toContain("No filters yet");
  });

  it("uses URL query parameters to render filtered lesson results", () => {
    const html = renderPage("/lessons?q=domain&type=explore&tool=2D+Graph");

    expect(html).toContain("Clear filters");
    expect(html).toContain("Domain");
    expect(html).toContain("2D Graph");
    expect(html).toContain("Search results");
    expect(html).toContain("matching lessons");
    expect(html).toContain("Tool");
    expect(html).toContain("<strong>2D Graph</strong>");
    expect(html).toContain("lessons-result-meta");
  });

  it("renders working Pathway, Topics, and Curriculum landing tabs", () => {
    const pathway = renderPage("/lessons?view=pathway");
    const topics = renderPage("/lessons?view=topics");
    const curriculum = renderPage("/lessons?view=curriculum");

    expect(pathway).toContain("aria-label=\"Pathway tab content\"");
    expect(pathway).toContain("Master Functions &amp; Graphs");
    expect(pathway).toContain("aria-current=\"page\"");

    expect(topics).toContain("aria-label=\"Topics tab content\"");
    expect(topics).toContain("All topic worlds");
    expect(topics).toContain("Trigonometry");

    expect(curriculum).toContain("aria-label=\"Curriculum tab content\"");
    expect(curriculum).toContain("School Curriculum");
    expect(curriculum).toContain("Curriculum Map");
  });
});
