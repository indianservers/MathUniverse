import { Check, Copy, X } from "lucide-react";
import { useMemo, useState } from "react";
import { encodeScene, type EmbedScene } from "./engine";
import { embedCodesForScene } from "./fromWorkspace";

type Props = {
  scene: EmbedScene;
  origin?: string;
  onClose: () => void;
};

export default function EmbedCodePanel({ scene, origin, onClose }: Props) {
  const host = origin ?? (typeof window === "undefined" ? "https://maths.indianservers.com" : window.location.origin);
  const codes = embedCodesForScene(scene, host);
  const previewSrc = useMemo(
    () => `${host}/embed.html?kind=${scene.kind}&c=${encodeScene(scene)}`,
    [host, scene],
  );
  const [copied, setCopied] = useState("");
  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
  };
  return (
    <div className="portable-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="portable-dialog embed-code-dialog" role="dialog" aria-modal="true" aria-label="Embed on a website">
        <header>
          <div>
            <span>{codes.api}</span>
            <h2>Embed on a website</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close embed code"><X /></button>
        </header>
        <p>Paste this on another site the same way you embed Google Maps. The content is the object list from this workspace (coordinates, sizes, expressions).</p>
        <iframe className="embed-preview-frame" title="Embed preview" src={previewSrc} />
        <label>
          iframe
          <textarea readOnly value={codes.iframe} rows={4} />
        </label>
        <button type="button" className="portable-primary" onClick={() => void copy("iframe", codes.iframe)}>
          {copied === "iframe" ? <Check /> : <Copy />} Copy iframe
        </button>
        <label>
          Direct embed URL
          <textarea readOnly value={previewSrc} rows={3} />
        </label>
        <button type="button" onClick={() => void copy("url", previewSrc)}>
          {copied === "url" ? <Check /> : <Copy />} Copy URL
        </button>
        <label>
          Script tag ({scene.kind}.js)
          <textarea readOnly value={codes.script} rows={10} />
        </label>
        <button type="button" onClick={() => void copy("script", codes.script)}>
          {copied === "script" ? <Check /> : <Copy />} Copy script
        </button>
        <footer aria-live="polite">{copied ? `Copied ${copied} code.` : `${scene.objects.length} objects ready to embed.`}</footer>
      </section>
    </div>
  );
}
