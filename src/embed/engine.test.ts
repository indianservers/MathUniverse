import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  API_NAMES,
  createApi,
  decodeScene,
  defaultScene,
  encodeScene,
  evaluateExpression,
  iframeSnippet,
  isEmbedKind,
  normalizeScene,
  scriptSnippet,
} from "./engine";

describe("embeddable graph and geometry scenes", () => {
  it("keeps a versioned object list with sizes and coordinates", () => {
    for (const kind of ["twodgraph", "twodgeometry", "threedgraph", "threedgeometry"] as const) {
      const scene = defaultScene(kind);
      expect(scene.version).toBe(1);
      expect(scene.kind).toBe(kind);
      expect(scene.objects.length).toBeGreaterThan(0);
      expect(scene.objects[0]?.id).toBeTruthy();
      expect(API_NAMES[kind]).toMatch(/Graph|Geometry/);
    }
    expect(isEmbedKind("twodgraph")).toBe(true);
    expect(isEmbedKind("nope")).toBe(false);
  });

  it("round-trips iframe payloads and evaluates safe expressions", () => {
    const scene = defaultScene("twodgraph");
    const again = decodeScene(encodeScene(scene), "twodgraph");
    expect(again.objects.map((item) => item.expression)).toContain("x^2");
    expect(evaluateExpression("x^2", { x: 3, y: 0, z: 0 })).toBe(9);
    expect(evaluateExpression("sin(0)", { x: 0, y: 0, z: 0 })).toBe(0);
    expect(Number.isNaN(evaluateExpression("process.exit(1)", { x: 0, y: 0, z: 0 }))).toBe(true);
  });

  it("builds Google-maps-style iframe and script snippets", () => {
    const snippet = iframeSnippet("https://example.test", defaultScene("threedgraph"));
    expect(snippet).toContain("/embed.html?kind=threedgraph&c=");
    expect(scriptSnippet("https://example.test", defaultScene("threedgeometry"))).toContain("ThreeDGeometry.embed");
    expect(normalizeScene({ objects: [{ type: "point", x: "2" }] }).objects[0]?.x).toBe(2);
    expect(createApi("twodgraph").kind).toBe("twodgraph");
  });

  it("publishes standalone widget scripts named like Google Maps embeds", () => {
    for (const [kind, api] of Object.entries(API_NAMES)) {
      const source = readFileSync(`public/${kind}.js`, "utf8");
      expect(source).toContain(`${api}.embed`);
      expect(source).toContain("autostart");
    }
    expect(readFileSync("public/embed.html", "utf8")).toContain("mu-embed-stage");
  });
});
