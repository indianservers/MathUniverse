import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../mockup/MockupStudioApp";

describe("advanced linear algebra labs", () => {
  it("renders Cayley–Hamilton and Jordan pages", () => {
    const cayley = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/linear-algebra/cayley-hamilton"]}>
        <MockupStudioApp studioId="linear-algebra" />
      </MemoryRouter>,
    );
    expect(cayley).toContain("Cayley");
    expect(cayley).toContain("zero");

    const jordan = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/linear-algebra/jordan-form"]}>
        <MockupStudioApp studioId="linear-algebra" />
      </MemoryRouter>,
    );
    expect(jordan).toContain("Geometric multiplicity");
  });
});
