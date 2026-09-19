import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../mockup/MockupStudioApp";
import AlgebraicStructuresStudio from "../../pages/AlgebraicStructuresStudio";

describe("phase 1 studio labs", () => {
  it("replaces geometry transformation and proof stubs with live figures", () => {
    const rotate = renderToString(
      <MemoryRouter initialEntries={["/geometry/transformations?mode=Rotate"]}>
        <MockupStudioApp studioId="geometry" />
      </MemoryRouter>,
    );
    expect(rotate).toContain('data-lab-mode="Rotate"');
    expect(rotate).toContain('data-mode-canvas="Rotate"');
    expect(rotate).toContain("Share");
    expect(rotate).toContain("Exact");
    expect(rotate).not.toContain("ModeCanvas");

    const proofs = renderToString(
      <MemoryRouter initialEntries={["/geometry/proofs?mode=Angle+Sum"]}>
        <MockupStudioApp studioId="geometry" />
      </MemoryRouter>,
    );
    expect(proofs).toContain("∠A+∠B+∠C = 180°");
    expect(proofs).toContain("Tear onto a line");
  });

  it("rewires discrete sets and graphs to dedicated engines", () => {
    const sets = renderToString(
      <MemoryRouter initialEntries={["/discrete-world/sets"]}>
        <MockupStudioApp studioId="discrete" />
      </MemoryRouter>,
    );
    expect(sets).toContain("/set-theory/venn-diagram-engine");
    expect(sets).toContain("Set Theory Studio");
    const graphs = renderToString(
      <MemoryRouter initialEntries={["/discrete-world/graphs"]}>
        <MockupStudioApp studioId="discrete" />
      </MemoryRouter>,
    );
    expect(graphs).toContain("/graph-theory");
    expect(graphs).toContain("Graph Theory Studio");
  });

  it("computes vector-space dimension and fractal orbits", () => {
    const span = renderToString(
      <MemoryRouter initialEntries={["/linear-algebra/vector-spaces?mode=Span"]}>
        <MockupStudioApp studioId="linear-algebra" />
      </MemoryRouter>,
    );
    expect(span).toContain("dim(Span)");
    expect(span).toContain("independent");
    const fractals = renderToString(
      <MemoryRouter initialEntries={["/complex-numbers/fractals"]}>
        <MockupStudioApp studioId="complex-numbers" />
      </MemoryRouter>,
    );
    expect(fractals).toContain("Mandelbrot set");
    expect(fractals).toContain("Julia set for c");
    expect(fractals).toContain("Douady rabbit");
  });

  it("opens algebraic structures from a home of launch cards", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/algebraic-structures"]}>
        <AlgebraicStructuresStudio page="home" />
      </MemoryRouter>,
    );
    expect(html).toContain("algebraic-structures-home");
    expect(html).toContain("Cayley Tables");
    expect(html).toContain("/algebraic-structures/structure-test");
  });
});
