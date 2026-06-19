import { expect, type Download, type Page, type TestInfo } from "@playwright/test";
import { readFile, stat } from "node:fs/promises";

const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const minimumPngFileSizeBytes = 1_000;

export type PngArtifactInspectionResult = {
  filename: string;
  path: string;
  size: number;
  width: number;
  height: number;
  visibleSampleCount: number;
  uniqueVisibleColorCount: number;
};

export async function getExpectedSvgPngExportDimensions(page: Page, route: string) {
  const expectedExportDimensions = await page.getByTestId("visual-proof-primary-visual").evaluate((visual) => {
    const svg = visual.querySelector("svg");
    if (!(svg instanceof SVGSVGElement)) return null;
    const box = svg.getBoundingClientRect();
    return {
      width: Math.round(box.width * 2),
      height: Math.round(box.height * 2),
    };
  });

  expect(expectedExportDimensions, `${route} should expose an SVG-backed visual for PNG export`).not.toBeNull();
  return expectedExportDimensions;
}

export async function inspectDownloadedPngArtifact({
  page,
  download,
  testInfo,
  route,
  expectedDimensions,
}: {
  page: Page;
  download: Download;
  testInfo: TestInfo;
  route: string;
  expectedDimensions: { width: number; height: number } | null;
}) {
  const pngFilename = safeOutputFilename(`${route.replace(/^\/+/, "").replace(/[^a-z0-9-]+/gi, "-")}-${download.suggestedFilename()}`);
  expect(download.suggestedFilename(), `${route} PNG filename should end with .png`).toMatch(/\.png$/);

  const pngPath = testInfo.outputPath(pngFilename);
  await download.saveAs(pngPath);

  const pngStats = await stat(pngPath);
  expect(pngStats.size, `${route} PNG file should not be tiny`).toBeGreaterThan(minimumPngFileSizeBytes);

  const pngBuffer = await readFile(pngPath);
  const pngMetadata = parsePngMetadata(pngBuffer, route);
  expect(pngMetadata.signature, `${route} PNG signature should match`).toEqual(pngSignature);
  expect(pngMetadata.width, `${route} PNG width should be positive`).toBeGreaterThan(0);
  expect(pngMetadata.height, `${route} PNG height should be positive`).toBeGreaterThan(0);
  expect(pngMetadata.width, `${route} PNG width should not be unexpectedly tiny`).toBeGreaterThan(300);
  expect(pngMetadata.height, `${route} PNG height should not be unexpectedly tiny`).toBeGreaterThan(200);

  if (expectedDimensions) {
    expect(Math.abs(pngMetadata.width - expectedDimensions.width), `${route} PNG width should match 2x SVG export scale`).toBeLessThanOrEqual(2);
    expect(Math.abs(pngMetadata.height - expectedDimensions.height), `${route} PNG height should match 2x SVG export scale`).toBeLessThanOrEqual(2);
  }

  const nonblankResult = await inspectPngNonblankPixels(page, pngBuffer, route);
  expect(nonblankResult.visibleSampleCount, `${route} PNG should contain visible pixels`).toBeGreaterThan(0);
  expect(nonblankResult.uniqueVisibleColorCount, `${route} PNG should contain visible color variation`).toBeGreaterThan(1);

  return {
    filename: pngFilename,
    path: pngPath,
    size: pngStats.size,
    width: pngMetadata.width,
    height: pngMetadata.height,
    visibleSampleCount: nonblankResult.visibleSampleCount,
    uniqueVisibleColorCount: nonblankResult.uniqueVisibleColorCount,
  } satisfies PngArtifactInspectionResult;
}

function parsePngMetadata(buffer: Buffer, route: string) {
  expect(buffer.byteLength, `${route} PNG should contain a signature and IHDR chunk`).toBeGreaterThanOrEqual(33);

  const signature = Array.from(buffer.subarray(0, 8));
  expect(signature, `${route} PNG signature should match`).toEqual(pngSignature);

  const ihdrLength = buffer.readUInt32BE(8);
  const chunkType = buffer.subarray(12, 16).toString("ascii");
  expect(ihdrLength, `${route} IHDR length should be 13`).toBe(13);
  expect(chunkType, `${route} first PNG chunk should be IHDR`).toBe("IHDR");

  return {
    signature,
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

async function inspectPngNonblankPixels(page: Page, pngBuffer: Buffer, route: string) {
  const dataUrl = `data:image/png;base64,${pngBuffer.toString("base64")}`;

  return page.evaluate(
    async ({ src, routeLabel }) => {
      const image = new Image();
      const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`${routeLabel} downloaded PNG could not be decoded for pixel inspection.`));
      });
      image.src = src;
      await loaded;

      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        throw new Error(`${routeLabel} canvas context unavailable for downloaded PNG inspection.`);
      }

      context.drawImage(image, 0, 0);

      const stride = Math.max(1, Math.floor(Math.min(canvas.width, canvas.height) / 96));
      const uniqueVisibleColors = new Set<string>();
      let visibleSampleCount = 0;

      for (let y = 0; y < canvas.height; y += stride) {
        for (let x = 0; x < canvas.width; x += stride) {
          const [red, green, blue, alpha] = context.getImageData(x, y, 1, 1).data;
          if (alpha > 8) {
            visibleSampleCount += 1;
            uniqueVisibleColors.add(`${red},${green},${blue},${alpha}`);
          }
        }
      }

      return {
        width: canvas.width,
        height: canvas.height,
        visibleSampleCount,
        uniqueVisibleColorCount: uniqueVisibleColors.size,
      };
    },
    { src: dataUrl, routeLabel: route },
  );
}

function safeOutputFilename(filename: string) {
  return filename.replace(/[^a-z0-9.-]+/gi, "-").replace(/^-+|-+$/g, "") || "visual-proof-export.png";
}
