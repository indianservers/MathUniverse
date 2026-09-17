import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import DiscreteWorldModule from "./DiscreteWorldModule";

describe("Number & Discrete Mathematics Studio", () => {
  it("renders the studio shell and automata lab by default", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/discrete-world"]}>
        <DiscreteWorldModule />
      </MemoryRouter>,
    );
    expect(html).toContain("Number &amp; Discrete Mathematics Studio");
    expect(html).toContain("Explore by Topic");
    expect(html).toContain("/discrete-world/number-sense");
    expect(html).toContain("/discrete-world/logic");
    expect(html).toContain("/discrete-world/sets");
    expect(html).toContain("/discrete-world/combinatorics");
    expect(html).toContain("/discrete-world/graphs");
  });

  it("renders the grammar workbench from the existing query param", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/discrete-world?workbench=grammar"]}>
        <DiscreteWorldModule />
      </MemoryRouter>,
    );
    expect(html).toContain("Grammar");
  });
});
