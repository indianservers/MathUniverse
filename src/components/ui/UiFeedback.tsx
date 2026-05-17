import { AlertTriangle, ArrowLeft, Bookmark, BookmarkCheck, CheckCircle2, Copy, ExternalLink, Expand, ImageDown, Inbox, List, Printer, RotateCcw, Share2, Sparkles, Target } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const bookmarkedToolsKey = "math-universe-bookmarked-tools";
const practiceModeKey = "math-universe-practice-mode";

function readStringList(key: string) {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function BackToPreviousButton({ label = "Back" }: { label?: string }) {
  const navigate = useNavigate();
  return (
    <button type="button" className="action-secondary min-h-10 px-3 py-2" onClick={() => navigate(-1)}>
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

export function FriendlyErrorBox({ title = "Check the input", message }: { title?: string; message?: ReactNode }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-800 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-black">{title}</p>
          <p className="mt-1 text-sm font-semibold leading-6">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title = "Nothing to show yet", message = "Add input or change the settings to generate results." }: { title?: string; message?: string }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-white/15 dark:bg-white/5">
      <Inbox className="h-7 w-7 text-slate-400" />
      <p className="mt-3 font-black text-slate-800 dark:text-slate-100">{title}</p>
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}

export function LoadingSkeleton({ label = "Loading interactive view" }: { label?: string }) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5" aria-live="polite">
      <p className="text-sm font-bold text-slate-500 dark:text-slate-300">{label}</p>
      <div className="skeleton-soft h-56" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="skeleton-soft h-12" />
        <div className="skeleton-soft h-12" />
        <div className="skeleton-soft h-12" />
      </div>
    </div>
  );
}

export function CopyResultButton({ value, label = "Copy result" }: { value?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const disabled = !value;

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      window.prompt("Copy this result", value);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button type="button" className="tool-button" onClick={copy} disabled={disabled} title={`${label} (Ctrl/Cmd+C after selecting also works)`}>
      <Copy className="h-4 w-4" />
      {copied ? "Copied" : label}
    </button>
  );
}

export function ApproxBadge() {
  return <span className="inline-flex w-fit rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black uppercase text-amber-800 dark:bg-amber-400/15 dark:text-amber-100">Approximate</span>;
}

export function ResetExampleButton({ onClick, label = "Reset example" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" className="tool-button" onClick={onClick} title="Reset to the default worked example">
      <RotateCcw className="h-4 w-4" />
      {label}
    </button>
  );
}

export function ResetValuesButton({ onClick, label = "Reset values" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" className="tool-button" onClick={onClick} title="Clear current values and return controls to their default state">
      <RotateCcw className="h-4 w-4" />
      {label}
    </button>
  );
}

export function ExampleValuesButton({ onClick, label = "Example values" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" className="tool-button" onClick={onClick} title="Fill the tool with a complete example">
      <Sparkles className="h-4 w-4" />
      {label}
    </button>
  );
}

export function PresetChips({ examples, onSelect }: { examples: string[]; onSelect: (example: string) => void }) {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem("math-universe-last-examples") ?? "[]"));
    } catch {
      setRecent([]);
    }
  }, []);

  function choose(example: string) {
    onSelect(example);
    const next = [example, ...recent.filter((item) => item !== example)].slice(0, 5);
    setRecent(next);
    localStorage.setItem("math-universe-last-examples", JSON.stringify(next));
  }

  return (
    <div className="space-y-2">
      {recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase text-slate-500">Last used</span>
          {recent.map((example) => <button key={`recent-${example}`} type="button" className="mini-chip bg-cyan-50 text-cyan-700 transition hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100" onClick={() => choose(example)}>{example}</button>)}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button key={example} type="button" className="mini-chip transition hover:bg-cyan-100 dark:hover:bg-cyan-300/15" onClick={() => choose(example)}>
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RelatedToolLinks({ links }: { links: Array<{ label: string; route: string }> }) {
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link key={link.route} to={link.route} className="tool-button">
          {link.label}
          <ExternalLink className="h-4 w-4" />
        </Link>
      ))}
    </div>
  );
}

export function BookmarkToolButton({ id, title, label = "Bookmark tool" }: { id: string; title: string; label?: string }) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(readStringList(bookmarkedToolsKey).includes(id));
  }, [id]);

  function toggleBookmark() {
    const current = readStringList(bookmarkedToolsKey);
    const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];
    localStorage.setItem(bookmarkedToolsKey, JSON.stringify(next));
    setBookmarked(next.includes(id));
  }

  return (
    <button
      type="button"
      className={bookmarked ? "action-primary min-h-10 px-3 py-2" : "tool-button"}
      onClick={toggleBookmark}
      title={bookmarked ? `Remove ${title} from bookmarks` : `Bookmark ${title}`}
      aria-pressed={bookmarked}
    >
      {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {bookmarked ? "Bookmarked" : label}
    </button>
  );
}

export function ToolProgressIndicator({ explored, total = 60 }: { explored: number; total?: number }) {
  const percent = Math.max(0, Math.min(100, (explored / total) * 100));
  return (
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-cyan-900 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-black">
          <Target className="h-4 w-4" />
          {explored} / {total} tools explored
        </div>
        <span className="text-xs font-black uppercase">{Math.round(percent)}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70 dark:bg-slate-950/40">
        <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function PracticeModeToggle() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(practiceModeKey) === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("practice-mode", enabled);
    localStorage.setItem(practiceModeKey, String(enabled));
  }, [enabled]);

  return (
    <button type="button" className={enabled ? "action-primary min-h-10 px-3 py-2" : "tool-button"} onClick={() => setEnabled((value) => !value)} title="Hide heavier theory panels while practicing">
      <Sparkles className="h-4 w-4" />
      Practice mode
    </button>
  );
}

export function MiniTableOfContents({ items }: { items: Array<{ label: string; id: string }> }) {
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
        <List className="h-4 w-4 text-cyan-600" />
        On this page
      </div>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="text-sm font-semibold text-slate-600 transition hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-200">
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function CollapsibleTheorySection({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div data-theory className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <button type="button" className="flex w-full items-center justify-between gap-3 text-left font-black" onClick={() => setOpen((value) => !value)}>
        {title}
        <span className="text-cyan-600">{open ? "Hide" : "Show"}</span>
      </button>
      {open && <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{children}</div>}
    </div>
  );
}

export function ShareSetupButton({ label = "Share this setup" }: { label?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this setup link", url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button type="button" className="tool-button" onClick={share}>
      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Link copied" : label}
    </button>
  );
}

export function PrintWorksheetButton({ label = "Print worksheet" }: { label?: string }) {
  return <button type="button" className="tool-button" onClick={() => window.print()}><Printer className="h-4 w-4" />{label}</button>;
}

export function FullscreenButton({ targetId, label = "Full screen" }: { targetId: string; label?: string }) {
  async function openFullscreen() {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await target.requestFullscreen?.();
  }

  return <button type="button" className="tool-button" onClick={() => void openFullscreen()}><Expand className="h-4 w-4" />{label}</button>;
}

export function ExportImageButton({ targetId, filename = "math-universe-visualization.png", label = "Export image" }: { targetId: string; filename?: string; label?: string }) {
  const [status, setStatus] = useState("");

  async function exportImage() {
    const target = document.getElementById(targetId);
    if (!target) return;
    const canvas = target.querySelector("canvas");
    const svg = target.querySelector("svg");
    try {
      const url = canvas ? canvas.toDataURL("image/png") : svg ? await svgToPng(svg) : "";
      if (!url) {
        setStatus("No image found");
        window.setTimeout(() => setStatus(""), 1400);
        return;
      }
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      setStatus("Exported");
      window.setTimeout(() => setStatus(""), 1400);
    } catch {
      setStatus("Export failed");
      window.setTimeout(() => setStatus(""), 1400);
    }
  }

  return (
    <button type="button" className="tool-button" onClick={() => void exportImage()} title="Export the current visualization as a PNG image">
      <ImageDown className="h-4 w-4" />
      {status || label}
    </button>
  );
}

function svgToPng(svg: SVGSVGElement) {
  return new Promise<string>((resolve, reject) => {
    const cloned = svg.cloneNode(true) as SVGSVGElement;
    const box = svg.getBoundingClientRect();
    cloned.setAttribute("width", String(Math.max(1, Math.round(box.width))));
    cloned.setAttribute("height", String(Math.max(1, Math.round(box.height))));
    const source = new XMLSerializer().serializeToString(cloned);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(box.width));
      canvas.height = Math.max(1, Math.round(box.height));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      URL.revokeObjectURL(image.src);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = reject;
    image.src = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
  });
}

export function TeacherModeToggle() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem("math-universe-teacher-mode") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("teacher-mode", enabled);
    localStorage.setItem("math-universe-teacher-mode", String(enabled));
  }, [enabled]);

  return (
    <button type="button" className={enabled ? "action-primary min-h-10 px-3 py-2" : "tool-button"} onClick={() => setEnabled((value) => !value)} title="Toggle larger classroom text">
      <Sparkles className="h-4 w-4" />
      Teacher mode
    </button>
  );
}

export function InfoCallout({ title, children, tone = "info" }: { title: string; children: ReactNode; tone?: "info" | "warning" | "success" }) {
  const toneClass = tone === "warning"
    ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100"
    : tone === "success"
      ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100"
      : "border-cyan-300 bg-cyan-50 text-cyan-900 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100";
  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="font-black">{title}</p>
      <div className="mt-2 text-sm font-semibold leading-6">{children}</div>
    </div>
  );
}

export function TermTooltip({ term, tip }: { term: string; tip: string }) {
  return (
    <span className="tooltip-icon cursor-help border-b border-dotted border-cyan-500 font-bold text-cyan-700 dark:text-cyan-200" data-tooltip={tip} title={tip}>
      {term}
    </span>
  );
}
