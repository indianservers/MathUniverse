import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../mockup/MockupStudioApp";
import { addC, fromPolar, modC, mulC, nthRoots } from "./complexLabMath";

describe("complex target labs", () => {
  it("matches arithmetic mockup controls, graph labels, and result algebra", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/complex-numbers/arithmetic"]}>
        <MockupStudioApp studioId="complex-numbers" />
      </MemoryRouter>,
    );
    expect(html).toContain("Complex Arithmetic &amp; Geometry Lab");
    expect(html).toContain("Operate on complex numbers as vectors in the Argand plane.");
    expect(html).toContain("+ Add");
    expect(html).toContain("Vectors (drag points)");
    expect(html).toContain("Show parallelogram (sum)");
    expect(html).toContain("Argand Plane");
    expect(html).toContain(">Re</text>");
    expect(html).toContain(">Im</text>");
    expect(html).toContain("z₁ + z₂");
    expect(html).toContain("Algebra (component form)");
    expect(html).toContain("The sum is the diagonal of the parallelogram");
    expect(html).toContain("Drag points P and Q");
  });

  it("matches polar mockup linked forms and Euler panel", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/complex-numbers/polar-forms"]}>
        <MockupStudioApp studioId="complex-numbers" />
      </MemoryRouter>,
    );
    expect(html).toContain("Polar &amp; Exponential Forms Lab");
    expect(html).toContain("1. Rectangular Form");
    expect(html).toContain("2. Polar Form");
    expect(html).toContain("3. Exponential Form");
    expect(html).toContain("Keep rectangular, polar, and exponential in sync.");
    expect(html).toContain("Animate conversion");
    expect(html).toContain("Live Values (Exact)");
    expect(html).toContain("Euler");
    expect(html).toContain("Branch of Argument");
    expect(html).toContain("Identity Check");
  });

  it("matches rotation mockup matrix, sequence, and arg(w) controls", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/complex-numbers/rotation"]}>
        <MockupStudioApp studioId="complex-numbers" />
      </MemoryRouter>,
    );
    expect(html).toContain("Multiplication as Rotation Lab");
    expect(html).toContain("Complex number z (input)");
    expect(html).toContain("Multiplier w");
    expect(html).toContain("Repeated multiplication");
    expect(html).toContain("Show scale circles");
    expect(html).toContain("Transformation matrix");
    expect(html).toContain("Equal scale");
    expect(html).toContain("wz");
  });

  it("matches roots mockup De Moivre table and unit-circle graph", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/complex-numbers/roots?mode=nth+Roots"]}>
        <MockupStudioApp studioId="complex-numbers" />
      </MemoryRouter>,
    );
    expect(html).toContain("Roots of Complex Numbers Lab");
    expect(html).toContain('data-lab-mode="nth Roots"');
    expect(html).toContain('data-mode-canvas="nth Roots"');
    expect(html).toContain("Choose complex number z");
    expect(html).toContain("De Moivre");
    expect(html).toContain("All roots table");
    expect(html).toContain("Argand plane (Unit Circle)");
    expect(html).toContain("Principal root");
  });

  it("keeps live complex arithmetic and sixth roots exact", () => {
    const sum = addC({ re: 2.5, im: 1.5 }, { re: -1, im: 2 });
    expect(sum).toEqual({ re: 1.5, im: 3.5 });
    const z = fromPolar(8, 40);
    const roots = nthRoots(z, 6);
    expect(roots).toHaveLength(6);
    expect(modC(roots[0] ?? { re: 0, im: 0 })).toBeCloseTo(8 ** (1 / 6), 6);
    const w = fromPolar(1.4, 60);
    const prod = mulC({ re: 1.5, im: 1 }, w);
    expect(modC(prod)).toBeCloseTo(1.4 * Math.hypot(1.5, 1), 6);
  });
});
