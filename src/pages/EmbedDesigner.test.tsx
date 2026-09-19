import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import EmbedDesigner from "./EmbedDesigner";

describe("embed designer", () => {
  it("lets authors edit an object list and shows iframe embed copy", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/design/twodgraph"]}>
        <Routes>
          <Route path="/design/:kind" element={<EmbedDesigner />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("2D Graph designer");
    expect(html).toContain("Copy iframe");
    expect(html).toContain("TwoDGraph.embed");
    expect(html).toContain("/twodgraph.js");
    expect(html).toContain("y = x²");
  });
});
