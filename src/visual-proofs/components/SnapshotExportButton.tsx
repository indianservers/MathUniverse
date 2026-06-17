import { Check, Clipboard, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ProofInvariant, ProofLiveValue, ProofParameter } from "../data/proofTypes";

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

export function proofSlugFromRoute(route: string) {
  return route.split("/").filter(Boolean).at(-1) ?? "visual-proof";
}

export function generateSnapshotFilename(route: string, timestamp: string, extension: "json" | "svg") {
  const safeSlug = proofSlugFromRoute(route).replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "") || "visual-proof";
  const safeTimestamp = timestamp.replace(/[:.]/g, "-");
  return `${safeSlug}-${safeTimestamp}.${extension}`;
}

export function ensureSvgXmlNamespace(serializedSvg: string) {
  if (serializedSvg.includes("xmlns=")) return serializedSvg;
  return serializedSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
}

export function serializeSvgElement(svg: SVGSVGElement) {
  return ensureSvgXmlNamespace(new XMLSerializer().serializeToString(svg));
}

export function SnapshotExportButton({ snapshot, visualAreaSelector = '[data-testid="visual-proof-primary-visual"]' }: { snapshot: ProofSnapshotPayload; visualAreaSelector?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "fallback">("idle");
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

    const blob = new Blob([serializeSvgElement(svg)], { type: "image/svg+xml;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = generateSnapshotFilename(snapshot.route, snapshot.timestamp, "svg");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]" data-testid="visual-proof-snapshot-button">
      <button type="button" onClick={copy} className="action-secondary w-full rounded-xl">
        {status === "copied" ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
        {status === "copied" ? "Snapshot copied" : "Copy proof snapshot JSON"}
      </button>
      <button type="button" onClick={downloadSvg} disabled={!svgAvailable} className="action-secondary mt-2 w-full rounded-xl disabled:cursor-not-allowed disabled:opacity-60">
        <Download className="h-4 w-4" aria-hidden="true" />
        Download proof visual SVG
      </button>
      {!svgAvailable ? <p className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">SVG export unavailable for this proof.</p> : null}
      {status === "fallback" ? (
        <details className="mt-3 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-950/50">
          <summary className="cursor-pointer font-black">Clipboard unavailable. Show JSON</summary>
          <pre className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap font-mono">{json}</pre>
        </details>
      ) : null}
    </section>
  );
}
