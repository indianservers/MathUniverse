import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import VectorVisualizer from "./VectorVisualizer";

describe("VectorVisualizer", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { location: { search: "" } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders beginner vector guidance and preset controls", () => {
    const html = renderToStaticMarkup(<VectorVisualizer />);

    expect(html).toContain("A vector is an arrow with direction and length");
    expect(html).toContain("Right arrow");
    expect(html).toContain("Diagonal arrow");
    expect(html).toContain("Zero vector");
    expect(html).toContain("3D pane options");
  });

  it("renders accessible labels for 3D options and zero-vector warning copy", () => {
    const html = renderToStaticMarkup(<VectorVisualizer />);

    expect(html).toContain("X axis");
    expect(html).toContain("Y axis");
    expect(html).toContain("Z axis");
    expect(html).toContain("Labels");
    expect(html).toContain("A zero vector has length 0");
  });
});
