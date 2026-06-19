import { describe, expect, it } from "vitest";
import {
  buildExportFilename,
  createSvgBlob,
  ensureSvgXmlNamespace,
  generateSnapshotFilename,
  proofSlugFromRoute,
  svgToPngBlob,
} from "./visualProofExportUtils";

describe("Visual Proof export utilities", () => {
  it("builds stable export filenames from routes or slugs", () => {
    const date = new Date("2026-06-19T10:20:30.400Z");

    expect(buildExportFilename("/visual-proofs/geometry/sector-area-formula", "png", date)).toBe(
      "sector-area-formula-2026-06-19T10-20-30-400Z.png",
    );
    expect(buildExportFilename("unit-circle-sine-cosine", "svg", date)).toBe(
      "unit-circle-sine-cosine-2026-06-19T10-20-30-400Z.svg",
    );
    expect(generateSnapshotFilename("/visual-proofs/statistics/linear-regression-least-squares", "2026-06-19T10:20:30.400Z", "json")).toBe(
      "linear-regression-least-squares-2026-06-19T10-20-30-400Z.json",
    );
  });

  it("extracts safe proof slugs from routes", () => {
    expect(proofSlugFromRoute("/visual-proofs/trigonometry/unit-circle-sine-cosine")).toBe("unit-circle-sine-cosine");
    expect(proofSlugFromRoute("/")).toBe("visual-proof");
  });

  it("adds an XML namespace only when one is missing", () => {
    expect(ensureSvgXmlNamespace('<svg viewBox="0 0 10 10"></svg>')).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(ensureSvgXmlNamespace('<svg xmlns="http://www.w3.org/2000/svg"></svg>')).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    );
  });

  it("creates an SVG blob with the expected MIME type", () => {
    const blob = createSvgBlob('<svg xmlns="http://www.w3.org/2000/svg"></svg>');

    expect(blob.type).toBe("image/svg+xml;charset=utf-8");
    expect(blob.size).toBeGreaterThan(0);
  });

  it("rejects PNG conversion outside a browser canvas environment", async () => {
    await expect(svgToPngBlob({} as SVGSVGElement)).rejects.toThrow("PNG export requires browser image and canvas APIs.");
  });
});
