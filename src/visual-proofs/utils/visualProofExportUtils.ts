export type VisualProofExportExtension = "json" | "svg" | "png";

export type SvgToPngOptions = {
  scale?: number;
};

type SerializeSvgOptions = {
  removeForeignObjects?: boolean;
};

export function proofSlugFromRoute(route: string) {
  return route.split("/").filter(Boolean).at(-1) ?? "visual-proof";
}

export function buildExportFilename(slugOrRoute: string, extension: VisualProofExportExtension, date = new Date()) {
  const slug = slugOrRoute.includes("/") ? proofSlugFromRoute(slugOrRoute) : slugOrRoute;
  const safeSlug = slug.replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "") || "visual-proof";
  const safeTimestamp = date.toISOString().replace(/[:.]/g, "-");
  return `${safeSlug}-${safeTimestamp}.${extension}`;
}

export function generateSnapshotFilename(route: string, timestamp: string, extension: VisualProofExportExtension) {
  return buildExportFilename(route, extension, new Date(timestamp));
}

export function ensureSvgXmlNamespace(serializedSvg: string) {
  if (serializedSvg.includes("xmlns=")) return serializedSvg;
  return serializedSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
}

export function serializeSvgElement(svg: SVGSVGElement, options: SerializeSvgOptions = {}) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  if (options.removeForeignObjects) {
    clone.querySelectorAll("foreignObject").forEach((node) => node.remove());
  }
  inlineSvgDimensions(svg, clone);
  return ensureSvgXmlNamespace(new XMLSerializer().serializeToString(clone));
}

export function createSvgBlob(svgMarkup: string) {
  return new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
}

export async function svgToPngBlob(svg: SVGSVGElement, options: SvgToPngOptions = {}) {
  if (typeof Image === "undefined" || typeof document === "undefined") {
    throw new Error("PNG export requires browser image and canvas APIs.");
  }

  const scale = options.scale ?? 2;
  const dimensions = getSvgExportDimensions(svg);
  if (dimensions.width <= 0 || dimensions.height <= 0) {
    throw new Error("PNG export unavailable: SVG dimensions are missing.");
  }

  const svgMarkup = serializeSvgElement(svg, { removeForeignObjects: true });
  const svgUrl = URL.createObjectURL(createSvgBlob(svgMarkup));

  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(dimensions.width * scale));
    canvas.height = Math.max(1, Math.round(dimensions.height * scale));

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("PNG export failed: canvas context unavailable.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob>((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("PNG export failed: canvas export returned no image."));
            return;
          }
          resolve(blob);
        }, "image/png");
      } catch (error) {
        reject(error instanceof Error ? error : new Error("PNG export failed."));
      }
    });
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(href);
}

function inlineSvgDimensions(source: SVGSVGElement, clone: SVGSVGElement) {
  const dimensions = getSvgExportDimensions(source);
  if (!clone.getAttribute("viewBox")) {
    clone.setAttribute("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);
  }
  if (!clone.getAttribute("width")) {
    clone.setAttribute("width", String(dimensions.width));
  }
  if (!clone.getAttribute("height")) {
    clone.setAttribute("height", String(dimensions.height));
  }
}

function getSvgExportDimensions(svg: SVGSVGElement) {
  const viewBox = svg.viewBox.baseVal;
  const box = svg.getBoundingClientRect();
  const width = box.width || Number(svg.getAttribute("width")) || viewBox.width;
  const height = box.height || Number(svg.getAttribute("height")) || viewBox.height;
  return { width, height };
}

async function loadImage(url: string) {
  const image = new Image();
  image.decoding = "async";

  const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("PNG export failed: SVG image decode failed."));
  });

  image.src = url;

  if ("decode" in image) {
    try {
      await image.decode();
      return image;
    } catch {
      return loaded;
    }
  }

  return loaded;
}
