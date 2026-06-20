import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ConceptMapPage from "./ConceptMapPage";

describe("ConceptMapPage", () => {
  it("renders the concept map route shell and default selected concept details", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <ConceptMapPage />
      </MemoryRouter>,
    );

    expect(html).toContain("Concept Map");
    expect(html).toContain("Search concepts, formulas, theorems, or real-life uses");
    expect(html).toContain("Unit Circle");
    expect(html).toContain("Learning path");
    expect(html).toContain("Show prerequisites");
  });

  it("renders student, teacher, explorer modes and module filters", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <ConceptMapPage />
      </MemoryRouter>,
    );

    expect(html).toContain("student");
    expect(html).toContain("teacher");
    expect(html).toContain("explorer");
    expect(html).toContain("Visual proof");
  });
});
