import { expandBounds, unionBounds } from "./boardGeometry";
import type { BoundingBox, MathRecognitionResult, StrokeElement } from "./types";

export type MathRecognitionInput = {
  strokes: StrokeElement[];
  bounds: BoundingBox;
  width: number;
  height: number;
  imageDataUrl?: string;
};

export type MathRecognitionOptions = {
  signal?: AbortSignal;
  language?: string;
};

export interface MathRecognitionProvider {
  readonly id: string;
  readonly production: boolean;
  recognize(input: MathRecognitionInput, options?: MathRecognitionOptions): Promise<MathRecognitionResult>;
}

type RecognitionServiceResponse = Partial<MathRecognitionResult> & {
  text?: string;
  confidence_score?: number;
  candidates?: Array<{ latex?: string; text?: string; confidence?: number }>;
};

export function createRecognitionInput(strokes: StrokeElement[], padding = 24): MathRecognitionInput {
  if (!strokes.length) throw new Error("Select at least one handwritten stroke.");
  const bounds = expandBounds(unionBounds(strokes.map((stroke) => stroke.bounds)), padding);
  return {
    strokes,
    bounds,
    width: Math.max(1, Math.ceil(bounds.width)),
    height: Math.max(1, Math.ceil(bounds.height)),
  };
}

export function renderRecognitionImage(input: MathRecognitionInput): MathRecognitionInput {
  if (typeof document === "undefined") return input;
  const scale = Math.min(3, Math.max(1, globalThis.devicePixelRatio || 1));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(input.width * scale));
  canvas.height = Math.max(1, Math.ceil(input.height * scale));
  const context = canvas.getContext("2d");
  if (!context) return input;
  context.scale(scale, scale);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, input.width, input.height);
  context.strokeStyle = "#000000";
  context.lineCap = "round";
  context.lineJoin = "round";
  for (const stroke of input.strokes) {
    if (!stroke.points.length) continue;
    context.lineWidth = Math.max(2, stroke.width);
    context.beginPath();
    context.moveTo(stroke.points[0].x - input.bounds.x, stroke.points[0].y - input.bounds.y);
    stroke.points.slice(1).forEach((point) => context.lineTo(point.x - input.bounds.x, point.y - input.bounds.y));
    context.stroke();
  }
  return { ...input, imageDataUrl: canvas.toDataURL("image/png") };
}

export class DevelopmentMathRecognitionProvider implements MathRecognitionProvider {
  readonly id = "development-manual-review";
  readonly production = false;

  async recognize(input: MathRecognitionInput, options?: MathRecognitionOptions): Promise<MathRecognitionResult> {
    if (options?.signal?.aborted) throw new DOMException("Recognition cancelled", "AbortError");
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, 180);
      options?.signal?.addEventListener("abort", () => {
        clearTimeout(timer);
        reject(new DOMException("Recognition cancelled", "AbortError"));
      }, { once: true });
    });
    const likelyTrig = input.strokes.length >= 3 && input.bounds.width > input.bounds.height * 1.35;
    return {
      latex: likelyTrig ? "\\sin 60^\\circ" : "",
      normalizedExpression: likelyTrig ? "sin(60 deg)" : undefined,
      plainText: likelyTrig ? "sine sixty degrees" : "Manual review required",
      confidence: likelyTrig ? 0.38 : 0,
      alternatives: likelyTrig ? [
        { latex: "\\sin 60^\\circ", confidence: 0.38 },
        { latex: "\\sin 6\\theta", confidence: 0.24 },
      ] : [],
      detectedType: likelyTrig ? "function" : "unknown",
      warnings: ["No production handwriting AI model is configured. Set VITE_BOARD_RECOGNITION_ENDPOINT to a secure OCR/vision backend."],
    };
  }
}

export class HttpMathRecognitionProvider implements MathRecognitionProvider {
  readonly id = "http-math-vision";
  readonly production = true;

  constructor(private readonly endpoint: string) {}

  async recognize(input: MathRecognitionInput, options?: MathRecognitionOptions): Promise<MathRecognitionResult> {
    if (!input.imageDataUrl) throw new Error("Recognition image was not rendered before calling the AI model.");
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: options?.signal,
      body: JSON.stringify({
        task: "handwritten-math-to-latex",
        language: options?.language ?? "en",
        imageDataUrl: input.imageDataUrl,
        bounds: input.bounds,
        width: input.width,
        height: input.height,
        strokes: input.strokes.map((stroke) => ({
          id: stroke.id,
          tool: stroke.tool,
          width: stroke.width,
          points: stroke.points.map(({ x, y, pressure, time }) => ({ x, y, pressure, time })),
        })),
        instructions: [
          "Recognize handwritten mathematics from the image.",
          "Return concise LaTeX only for the best candidate.",
          "Prefer trigonometric notation such as \\sin 60^\\circ when the handwriting resembles sin 60.",
          "Include alternatives with confidence values when uncertain.",
        ],
      }),
    });
    if (!response.ok) throw new Error(`Recognition model failed with HTTP ${response.status}.`);
    return normalizeRecognitionResponse(await response.json() as RecognitionServiceResponse);
  }
}

export function createMathRecognitionProvider(endpoint = import.meta.env.VITE_BOARD_RECOGNITION_ENDPOINT): MathRecognitionProvider {
  return endpoint?.trim() ? new HttpMathRecognitionProvider(endpoint.trim()) : new DevelopmentMathRecognitionProvider();
}

export function normalizeRecognitionResponse(response: RecognitionServiceResponse): MathRecognitionResult {
  const latex = response.latex ?? response.text ?? response.candidates?.find((candidate) => candidate.latex || candidate.text)?.latex ?? response.candidates?.find((candidate) => candidate.latex || candidate.text)?.text ?? "";
  const alternatives = response.alternatives ?? response.candidates?.map((candidate) => ({
    latex: candidate.latex ?? candidate.text ?? "",
    confidence: candidate.confidence,
  })).filter((candidate) => candidate.latex.trim());
  return {
    latex,
    normalizedExpression: response.normalizedExpression,
    plainText: response.plainText ?? response.text,
    confidence: response.confidence ?? response.confidence_score,
    alternatives,
    detectedType: response.detectedType ?? "unknown",
    warnings: response.warnings,
  };
}

export const mathRecognitionProvider: MathRecognitionProvider = createMathRecognitionProvider();
