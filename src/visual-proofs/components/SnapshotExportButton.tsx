import { Check, Clipboard, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ProofInvariant, ProofLiveValue, ProofParameter } from "../data/proofTypes";
import {
  createSvgBlob,
  downloadBlob,
  ensureSvgXmlNamespace,
  generateSnapshotFilename,
  proofSlugFromRoute,
  serializeSvgElement,
  svgToPngBlob,
} from "../utils/visualProofExportUtils";

export const VISUAL_PROOF_SNAPSHOT_VERSION = "visual-proof-snapshot-v1";

export type ProofSnapshotPayload = {
  snapshotVersion: typeof VISUAL_PROOF_SNAPSHOT_VERSION;
  proofTitle: string;
  route: string;
  category: string;
  activeStep: number;
  parameters: ProofParameter[];
  liveValues: ProofLiveValue[];
  invariants: ProofInvariant[];
  timestamp: string;
};

export { ensureSvgXmlNamespace, generateSnapshotFilename, proofSlugFromRoute, serializeSvgElement };

export function SnapshotExportButton({ snapshot, visualAreaSelector = '[data-testid="visual-proof-primary-visual"]' }: { snapshot: ProofSnapshotPayload; visualAreaSelector?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "fallback" | "svg-downloaded" | "png-downloaded" | "png-unavailable" | "png-failed">("idle");
  const [svgAvailable, setSvgAvailable] = useState(false);
  const json = useMemo(() => JSON.stringify(snapshot, null, 2), [snapshot]);

  useEffect(() => {
    const visualArea = document.querySelector(visualAreaSelector);
    setSvgAvailable(Boolean(visualArea?.querySelector("svg")));
  }, [visualAreaSelector]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setStatus("copied");
    } catch {
      setStatus("fallback");
    }
  };

  const downloadSvg = () => {
    const visualArea = document.querySelector(visualAreaSelector);
    const svg = visualArea?.querySelector("svg");
    if (!(svg instanceof SVGSVGElement)) {
      setSvgAvailable(false);
      return;
    }

    downloadBlob(createSvgBlob(serializeSvgElement(svg)), generateSnapshotFilename(snapshot.route, snapshot.timestamp, "svg"));
    setStatus("svg-downloaded");
  };

  const downloadPng = async () => {
    const visualArea = document.querySelector(visualAreaSelector);
    const svg = visualArea?.querySelector("svg");
    if (!(svg instanceof SVGSVGElement)) {
      setSvgAvailable(false);
      setStatus("png-unavailable");
      return;
    }

    try {
      const blob = await svgToPngBlob(svg, { scale: 2 });
      downloadBlob(blob, generateSnapshotFilename(snapshot.route, snapshot.timestamp, "png"));
      setStatus("png-downloaded");
    } catch {
      setStatus("png-failed");
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]" data-testid="visual-proof-snapshot-button">
      <button type="button" onClick={copy} className="action-secondary w-full rounded-xl" data-testid="visual-proof-json-export-button">
        {status === "copied" ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
        {status === "copied" ? "Snapshot copied" : "Copy proof snapshot JSON"}
      </button>
      <button type="button" onClick={downloadSvg} disabled={!svgAvailable} className="action-secondary mt-2 w-full rounded-xl disabled:cursor-not-allowed disabled:opacity-60" data-testid="visual-proof-svg-export-button">
        <Download className="h-4 w-4" aria-hidden="true" />
        Download proof visual SVG
      </button>
      <button type="button" onClick={downloadPng} disabled={!svgAvailable} className="action-secondary mt-2 w-full rounded-xl disabled:cursor-not-allowed disabled:opacity-60" data-testid="visual-proof-png-export-button">
        <Download className="h-4 w-4" aria-hidden="true" />
        Download proof visual PNG
      </button>
      {!svgAvailable ? <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">SVG and PNG export unavailable for this proof.</p> : null}
      <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400" data-testid="visual-proof-export-status" aria-live="polite">
        {status === "svg-downloaded" ? "SVG downloaded" : null}
        {status === "png-downloaded" ? "PNG downloaded" : null}
        {status === "png-unavailable" ? "PNG export unavailable for this proof" : null}
        {status === "png-failed" ? "PNG export failed; try SVG export" : null}
      </p>
      {status === "fallback" ? (
        <details className="mt-3 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-950/50">
          <summary className="cursor-pointer font-black">Clipboard unavailable. Show JSON</summary>
          <pre className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap font-mono">{json}</pre>
        </details>
      ) : null}
    </section>
  );
}
