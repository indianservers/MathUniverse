import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ShapeThumbnail from "../components/shapes/ShapeThumbnail";
import { shapes } from "./ShapesExplorer";

describe("Shapes Explorer thumbnail catalog", () => {
  it("maps all 54 shapes to unique PNG assets that exist", () => {
    const thumbnails = shapes.map((shape) => shape.thumbnail);

    expect(shapes).toHaveLength(54);
    expect(new Set(shapes.map((shape) => shape.id)).size).toBe(54);
    expect(new Set(thumbnails).size).toBe(54);
    expect(thumbnails.every((thumbnail) => thumbnail.endsWith(".png"))).toBe(true);
    expect(thumbnails.every((thumbnail) => existsSync(resolve("public", thumbnail.slice(1))))).toBe(true);
  });

  it("preserves the required category coverage", () => {
    const categoryCounts = Object.fromEntries(
      ["2D Basic", "2D Curved", "2D Polygons", "3D Solids", "3D Curved Solids"].map((category) => [
        category,
        shapes.filter((shape) => shape.category === category).length,
      ]),
    );

    expect(categoryCounts).toEqual({
      "2D Basic": 8,
      "2D Curved": 8,
      "2D Polygons": 14,
      "3D Solids": 15,
      "3D Curved Solids": 9,
    });
  });

  it("matches the shipped asset manifest without orphaned thumbnails", () => {
    const manifest = JSON.parse(readFileSync(resolve("public/assets/shapes/thumbnails/manifest.json"), "utf8")) as { files: string[] };
    const catalogFiles = shapes.map((shape) => shape.thumbnail.split("/").at(-1)).sort();

    expect(catalogFiles).toEqual([...manifest.files].sort());
  });

  it("renders a fixed, lazy thumbnail with selected and accessible states", () => {
    const circle = shapes.find((shape) => shape.id === "circle")!;
    const html = renderToStaticMarkup(<ShapeThumbnail src={circle.thumbnail} name={circle.name} size="large" selected />);

    expect(html).toContain("shape-thumbnail-large is-selected");
    expect(html).toContain('width:40px;height:40px');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('alt="Circle shape"');
    expect(html).toContain(circle.thumbnail);
  });
});
