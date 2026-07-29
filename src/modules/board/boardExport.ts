import { serializeBoard } from "./boardPersistence";
import type { BoardDocument } from "./types";

export type BoardExportFormat = "json" | "latex" | "tutor-text" | "png" | "pdf" | "print";

export type BoardExportOptions = {
  includeTutor: boolean;
  selectedElementIds?: string[];
};

export function buildBoardTextExport(document: BoardDocument, format: Extract<BoardExportFormat, "json" | "latex" | "tutor-text">, options: BoardExportOptions) {
  const selected = options.selectedElementIds?.length
    ? document.elements.filter((element) => options.selectedElementIds?.includes(element.id))
    : document.elements;
  if (format === "json") {
    const exportDocument = options.includeTutor ? document : { ...document, tutorMessages: [] };
    return JSON.stringify(serializeBoard(exportDocument), null, 2);
  }
  if (format === "latex") {
    return selected
      .filter((element) => element.type === "math-expression" || element.type === "solution-step" || (element.type === "math-result" && element.exactOutputLatex))
      .map((element) => {
        if (element.type === "math-result") return element.exactOutputLatex;
        if (element.type === "math-expression" || element.type === "solution-step") return element.latex;
        return undefined;
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return options.includeTutor
    ? document.tutorMessages.map((message) => `[${message.role.toUpperCase()} · ${message.mode}] ${message.text}`).join("\n\n")
    : "";
}

export async function exportBoard(document: BoardDocument, format: BoardExportFormat, target: HTMLElement, options: BoardExportOptions) {
  const filename = safeFilename(document.title);
  if (format === "json" || format === "latex" || format === "tutor-text") {
    const text = buildBoardTextExport(document, format, options);
    downloadBlob(new Blob([text], { type: format === "json" ? "application/json" : "text/plain;charset=utf-8" }), `${filename}.${format === "json" ? "json" : format === "latex" ? "tex" : "txt"}`);
    return;
  }
  if (format === "print") {
    globalThis.print();
    return;
  }
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);
  const canvas = await html2canvas(target, {
    backgroundColor: "#ffffff",
    scale: Math.min(2, globalThis.devicePixelRatio || 1),
    useCORS: true,
    logging: false,
  });
  if (format === "png") {
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${filename}.png`);
    }, "image/png");
    return;
  }
  const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? "landscape" : "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min((pageWidth - 48) / canvas.width, (pageHeight - 48) / canvas.height);
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 24, 24, canvas.width * ratio, canvas.height * ratio);
  pdf.save(`${filename}.pdf`);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function safeFilename(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "math-board";
}
