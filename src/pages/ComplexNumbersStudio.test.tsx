import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ComplexNumbersStudio from "./ComplexNumbersStudio";

function html(route: string) {
  return renderToString(
    <MemoryRouter initialEntries={[route]}>
      <ComplexNumbersStudio />
    </MemoryRouter>,
  );
}

describe("ComplexNumbersStudio dedicated shell", () => {
  it("provides all learning panes and valid typeset formulas in every lab", () => {
    for (const id of [
      "argand-plane",
      "arithmetic",
      "polar-forms",
      "rotation",
      "roots",
      "euler",
      "loci",
      "fractals",
      "waves-circuits",
    ]) {
      const content = html(`/complex-numbers/${id}`);
      for (const pane of ["meaning", "uses", "quiz", "more"])
        expect(content, `${id}: ${pane}`).toContain(`data-lab-pane="${pane}"`);
      expect(content).toContain("Before you start:");
      expect(content).toContain("Derivation &amp; connections");
      expect(content).not.toContain("katex-error");
    }
  });
  it("renders the algebra-style home instead of mockup chrome", () => {
    const home = html("/complex-numbers");
    expect(home).toContain('data-complex-studio="dedicated"');
    expect(home).toContain("Welcome to Complex Numbers Studio");
    expect(home).toContain("Complex Numbers Studio");
    expect(home).toContain('data-studio-home="complex-numbers"');
    expect(home).toContain("Start here");
    expect(home).toContain("Plot · Modulus · Argument");
    expect(home).toContain("Continue Experiment");
    expect(home).toContain("COMPLEX");
    expect(home).toContain("View all topics");
    expect(home).not.toContain("msk-shell");
  });

  it("renders every lab title, Re/Im canvas, and mode attributes", () => {
    const argand = html("/complex-numbers/argand-plane");
    expect(argand).toContain("Argand Plane Lab");
    expect(argand).toContain("Argand Plane");
    expect(argand).toContain(">Re</text>");
    expect(argand).toContain(">Im</text>");
    expect(argand).toContain('data-cx-mode="Plot"');
    expect(argand).toContain('data-lab-mode="Plot"');
    expect(argand).toContain('data-mode-canvas="Plot"');

    for (const mode of [
      "Plot",
      "Modulus",
      "Argument",
      "Conjugate",
      "Distance",
      "Locus",
    ]) {
      const content = html(`/complex-numbers/argand-plane?mode=${mode}`);
      expect(content).toContain(`data-lab-mode="${mode}"`);
      expect(content).toContain("Concept Check");
      expect(content).not.toContain("katex-error");
    }

    const fractals = html("/complex-numbers/fractals");
    expect(fractals).toContain("Mandelbrot");
    expect(fractals).toContain("Julia");
    expect(fractals).toContain("MANDELBROT");

    expect(html("/complex-numbers/arithmetic")).toContain("PARALLELOGRAM LAW");
    expect(html("/complex-numbers/polar-forms")).toContain(
      "Polar &amp; Exponential Forms Lab",
    );
    expect(html("/complex-numbers/rotation")).toContain(
      "Multiplication as Rotation Lab",
    );
    expect(html("/complex-numbers/roots")).toContain(
      "Roots of Complex Numbers Lab",
    );
    expect(html("/complex-numbers/euler")).toContain("EULER");
    expect(html("/complex-numbers/loci")).toContain("Loci &amp; Transformations Lab");
    expect(html("/complex-numbers/waves-circuits")).toContain("PHASOR DIAGRAM");

    const nth = html("/complex-numbers/roots?mode=nth+Roots");
    expect(nth).toContain('data-lab-mode="nth Roots"');
    expect(nth).toContain('data-mode-canvas="nth Roots"');
  });
});

