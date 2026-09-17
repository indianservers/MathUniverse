import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MatrixOperations from "./MatrixOperations";
import { matrixOperations } from "../data/matrixOperations";

describe("Matrix Operations Studio launcher", () => {
  it("renders every visualizer route from the operations catalog", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/matrices"]}>
        <MatrixOperations />
      </MemoryRouter>,
    );
    expect(html).toContain("Matrix Operations Studio");
    for (const operation of matrixOperations) {
      expect(html).toContain(`href="${operation.route}"`);
      expect(html).toContain(operation.title);
    }
    expect(html).toContain("/visual-proofs/matrices-linear-algebra");
    expect(html).toContain("/linear-algebra");
    expect(html).toContain("/quiz");
  });
});
