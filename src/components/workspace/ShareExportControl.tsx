import { BookOpen, Check, Copy, Download, FileDown, FileUp, Image, Share2, Smartphone, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LESSON_EXTENSION, LESSON_MIME, PORTABLE_WORKSPACE_LABELS, PORTABLE_WORKSPACE_ROUTES, WORKSPACE_EXTENSION, WORKSPACE_MIME,
  createDefaultLesson, createPortableMathFile, downloadPortableFile, parsePortableMathFile, portableFilename, sceneForLessonMode,
  serializePortableMathFile, type LessonOpenMode, type PortableMathFile, type PortableWorkspaceAdapter,
} from "../../workspace/portableWorkspace";
import {
  copyPreparedImage, downloadPreparedImage, imageFilename, nativeSharePreparedImage, prepareWorkspaceImage, releasePreparedImage,
  type ImageExportBackground, type ImageExportFormat, type ImageExportScale, type ImageExportScope, type PreparedWorkspaceImage,
} from "../../workspace/workspaceImageExport";

const PENDING_IMPORT_KEY = "math-universe-portable-import";

type Props = { adapter: PortableWorkspaceAdapter; className?: string };
type PanelView = "menu" | "image" | "import" | "lesson";

export default function ShareExportControl({ adapter, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<PanelView>("menu");
  const [status, setStatus] = useState("Ready");
  const [busy, setBusy] = useState(false);
  const [prepared, setPrepared] = useState<PreparedWorkspaceImage | null>(null);
  const [scope, setScope] = useState<ImageExportScope>(adapter.workspaceType === "cas" ? "entire" : "viewport");
  const [background, setBackground] = useState<ImageExportBackground>("white");
  const [scale, setScale] = useState<ImageExportScale>(2);
  const [format, setFormat] = useState<ImageExportFormat>("png");
  const [imported, setImported] = useState<PortableMathFile | null>(null);
  const [importName, setImportName] = useState("");
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [lessonMode, setLessonMode] = useState<LessonOpenMode>("practice");
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState(() => safeSnapshot(adapter));
  const fileInput = useRef<HTMLInputElement>(null);
  const initialScene = useRef<unknown>(null);
  const solutionScene = useRef<unknown>(null);
  const checkpointScenes = useRef<Array<{ id: string; title: string; instructions: string; scene: unknown; validationRules: string[] }>>([]);
  const [lessonForm, setLessonForm] = useState({ title: `${PORTABLE_WORKSPACE_LABELS[adapter.workspaceType]} lesson`, description: "", difficulty: "intermediate", grade: "", topic: "", instructions: "", tags: "", hints: "", steps: "", expected: "", teacherNotes: "" });
  const summary = useMemo(() => adapter.getSceneSummary(), [adapter, open, view]);
  const dirty = safeSnapshot(adapter) !== lastSavedSnapshot;

  useEffect(() => () => releasePreparedImage(prepared), [prepared]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (!query.has("portableImport")) return;
    const raw = sessionStorage.getItem(PENDING_IMPORT_KEY);
    if (!raw) return;
    void parsePortableMathFile(raw).then(result => {
      if (!result.ok || result.file.workspace.type !== adapter.workspaceType) return;
      const mode = result.file.lesson?.openMode ?? "practice";
      void adapter.deserializeScene(sceneForLessonMode(result.file, mode), "replace");
      sessionStorage.removeItem(PENDING_IMPORT_KEY);
      query.delete("portableImport");
      const next = `${window.location.pathname}${query.size ? `?${query}` : ""}${window.location.hash}`;
      window.history.replaceState({}, "", next);
      setLastSavedSnapshot(safeSnapshot(adapter));
      setStatus(result.file.fileHeader.fileKind === "lesson" ? `Lesson opened in ${capital(mode)} Mode.` : `${result.file.preview.objectCount} objects imported successfully.`);
    });
  }, [adapter]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (safeSnapshot(adapter) !== lastSavedSnapshot) { event.preventDefault(); event.returnValue = ""; }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [adapter, lastSavedSnapshot]);

  const close = () => { setOpen(false); setView("menu"); setImported(null); setImportWarnings([]); setStatus("Ready"); };
  const show = (next: PanelView) => { setView(next); setOpen(true); setStatus("Ready"); };

  async function prepareImage() {
    const target = adapter.getImageTarget(scope);
    if (!target) { setStatus("The workspace viewport is not available yet."); return; }
    setBusy(true); setStatus(scale === 1 ? "Preparing image…" : "Rendering HD output…");
    releasePreparedImage(prepared); setPrepared(null);
    try {
      const next = await prepareWorkspaceImage({ target, scope, background, scale, format, filename: imageFilename(adapter.workspaceType, format) });
      setPrepared(next); setStatus("Image preview ready.");
    } catch (error) { setStatus(message(error, "The image could not be prepared.")); }
    finally { setBusy(false); }
  }

  async function exportWorkspace() {
    setBusy(true); setStatus("Preparing workspace file…");
    try {
      const file = await createPortableMathFile({ kind: "workspace", adapter, title: adapter.title(), scene: adapter.serializeScene() });
      downloadPortableFile(file); setLastSavedSnapshot(safeSnapshot(adapter)); setStatus("Workspace file exported.");
    } catch (error) { setStatus(message(error, "The workspace file could not be exported.")); }
    finally { setBusy(false); }
  }

  async function readImport(file: File) {
    setBusy(true); setStatus("Importing objects…"); setImported(null); setImportName(file.name);
    if (file.size > 25 * 1024 * 1024) { setStatus("This workspace file is too large to open safely."); setBusy(false); return; }
    const result = await parsePortableMathFile(await file.text(), file.name, file.type);
    if (!result.ok) setStatus(result.error);
    else { setImported(result.file); setImportWarnings(result.warnings); setStatus("File validated. Review the preview before opening."); }
    setBusy(false);
  }

  async function applyImport(mode: "replace" | "merge" | "new") {
    if (!imported) return;
    const targetType = imported.workspace.type;
    const targetRoute = PORTABLE_WORKSPACE_ROUTES[targetType];
    const scene = sceneForLessonMode(imported, lessonMode);
    if (targetType !== adapter.workspaceType || mode === "new") {
      const payload = { ...imported, lesson: imported.lesson ? { ...imported.lesson, openMode: lessonMode } : undefined };
      sessionStorage.setItem(PENDING_IMPORT_KEY, serializePortableMathFile(payload));
      const url = `${targetRoute}?portableImport=1`;
      if (mode === "new") window.open(url, "_blank", "noopener"); else window.location.assign(url);
      return;
    }
    if (mode === "replace" && dirty && !window.confirm("Replace the current workspace? Export the existing work first if you need a portable copy.")) return;
    setBusy(true); setStatus("Restoring workspace…");
    try {
      const warnings = adapter.validateScene?.(scene) ?? [];
      if (warnings.length) throw new Error(warnings[0]);
      await adapter.deserializeScene(scene, mode);
      setLastSavedSnapshot(safeSnapshot(adapter));
      setStatus(imported.fileHeader.fileKind === "lesson" ? `Lesson opened in ${capital(lessonMode)} Mode.` : `${imported.preview.objectCount} objects imported successfully.`);
      setImported(null);
    } catch (error) { setStatus(message(error, "The workspace could not be restored.")); }
    finally { setBusy(false); }
  }

  async function exportLesson() {
    setBusy(true); setStatus("Preparing workspace file…");
    try {
      const current = adapter.serializeScene();
      const lesson = createDefaultLesson(adapter.workspaceType, lessonForm.title, initialScene.current ?? current);
      lesson.shortDescription = lessonForm.description;
      lesson.difficulty = lessonForm.difficulty as typeof lesson.difficulty;
      lesson.gradeLevel = splitComma(lessonForm.grade);
      lesson.topic = lessonForm.topic;
      lesson.instructions = splitLines(lessonForm.instructions);
      lesson.tags = splitComma(lessonForm.tags);
      lesson.hints = splitLines(lessonForm.hints);
      lesson.solutionSteps = splitLines(lessonForm.steps);
      lesson.expectedResult = lessonForm.expected;
      lesson.teacherNotes = lessonForm.teacherNotes;
      lesson.initialScene = initialScene.current ?? current;
      lesson.solutionScene = solutionScene.current ?? current;
      lesson.checkpoints = checkpointScenes.current;
      const file = await createPortableMathFile({ kind: "lesson", adapter, title: lesson.title, description: lesson.shortDescription, tags: lesson.tags, difficulty: lesson.difficulty, gradeLevel: lesson.gradeLevel, topic: lesson.topic, scene: lesson.initialScene, lesson });
      downloadPortableFile(file); setLastSavedSnapshot(safeSnapshot(adapter)); setStatus("Lesson file exported.");
    } catch (error) { setStatus(message(error, "The lesson file could not be exported.")); }
    finally { setBusy(false); }
  }

  return <div className={`portable-share-anchor ${className}`} data-portable-export-exclude>
    <button type="button" className="portable-share-trigger" onClick={() => setOpen(true)} title="Share or export" aria-label="Share or export"><Share2 /><span>Share</span></button>
    {open && <div className="portable-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && close()}>
      <section className="portable-dialog" role="dialog" aria-modal="true" aria-label="Share & Export">
        <header><div><span>{PORTABLE_WORKSPACE_LABELS[adapter.workspaceType]}</span><h2>Share &amp; Export</h2></div><button type="button" onClick={close} aria-label="Close Share & Export"><X /></button></header>
        {view !== "menu" && <button type="button" className="portable-back" onClick={() => setView("menu")}>← Back to Share &amp; Export</button>}
        {view === "menu" && <div className="portable-action-grid">
          <Action icon={<Share2 />} title="Share as Image" note="Prepare a preview for native sharing" onClick={() => show("image")} />
          <Action icon={<Image />} title="Download HD Image" note="PNG or JPEG, 2× HD by default" onClick={() => show("image")} />
          <Action icon={<Copy />} title="Copy Image" note="Available when the Clipboard API supports images" onClick={() => show("image")} />
          <Action icon={<FileDown />} title="Export Workspace File" note={`${portableFilename(adapter.title(), adapter.workspaceType, "workspace")}`} onClick={() => void exportWorkspace()} />
          <Action icon={<FileUp />} title="Import Workspace File" note={`${WORKSPACE_EXTENSION} or ${LESSON_EXTENSION}`} onClick={() => show("import")} />
          <Action icon={<BookOpen />} title="Save as Lesson" note="Starting scene, hints, checkpoints and solution" onClick={() => show("lesson")} />
          <Action icon={<Smartphone />} title="Native Share" note="Uses the device share sheet; no upload" onClick={() => show("image")} />
        </div>}
        {view === "image" && <div className="portable-image-panel">
          <div className="portable-settings-grid">
            <label>Capture<select value={scope} onChange={event => setScope(event.target.value as ImageExportScope)}><option value="viewport">Current viewport</option><option value="entire">{adapter.workspaceType === "cas" ? "Entire worksheet" : "Entire construction or graph"}</option></select></label>
            <label>Background<select value={background} onChange={event => setBackground(event.target.value as ImageExportBackground)}><option value="transparent">Transparent</option><option value="white">White</option><option value="dark">Dark</option></select></label>
            <label>Resolution<select value={scale} onChange={event => setScale(Number(event.target.value) as ImageExportScale)}><option value="1">1×</option><option value="2">2× HD (default)</option><option value="4">4× ultra-HD</option></select></label>
            <label>Format<select value={format} onChange={event => setFormat(event.target.value as ImageExportFormat)}><option value="png">PNG</option><option value="jpeg">JPEG</option></select></label>
          </div>
          <button type="button" className="portable-primary" onClick={() => void prepareImage()} disabled={busy}>{busy ? "Rendering HD output…" : "Prepare image preview"}</button>
          {prepared && <div className="portable-preview"><img src={prepared.previewUrl} alt="Prepared workspace export preview" /><dl><div><dt>Filename</dt><dd>{prepared.filename}</dd></div><div><dt>Format</dt><dd>{prepared.format.toUpperCase()}</dd></div><div><dt>Resolution</dt><dd>{prepared.scale}× · {prepared.width} × {prepared.height}px</dd></div><div><dt>Background</dt><dd>{prepared.background}</dd></div></dl><div className="portable-preview-actions"><button type="button" onClick={() => { downloadPreparedImage(prepared); setStatus("HD image downloaded."); }}><Download />Download</button><button type="button" onClick={() => void copyPreparedImage(prepared).then(() => setStatus("Image copied to clipboard.")).catch(error => setStatus(message(error, "Copy Image is unavailable.")))}><Copy />Copy</button><button type="button" onClick={() => void nativeSharePreparedImage(prepared, adapter.title()).then(() => setStatus("Native share opened.")).catch(error => setStatus(message(error, "Image sharing is unavailable.")))}><Share2 />Share</button></div></div>}
        </div>}
        {view === "import" && <div className="portable-import-panel" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) void readImport(file); }}>
          <input ref={fileInput} hidden type="file" accept={`${WORKSPACE_EXTENSION},${LESSON_EXTENSION},${WORKSPACE_MIME},${LESSON_MIME}`} onChange={event => { const file = event.target.files?.[0]; if (file) void readImport(file); }} />
          {!imported && <button type="button" className="portable-dropzone" onClick={() => fileInput.current?.click()}><Upload /><strong>Choose or drop a workspace file</strong><span>Files are validated locally and never uploaded.</span></button>}
          {imported && <div className="portable-file-preview">{imported.preview.thumbnailDataUrl && <img src={imported.preview.thumbnailDataUrl} alt="Imported file preview" />}<dl><div><dt>File</dt><dd>{importName}</dd></div><div><dt>Kind</dt><dd>{capital(imported.fileHeader.fileKind)}</dd></div><div><dt>Workspace</dt><dd>{imported.workspace.typeLabel}</dd></div><div><dt>Title</dt><dd>{imported.document.title}</dd></div><div><dt>Description</dt><dd>{imported.document.description || "—"}</dd></div><div><dt>Author</dt><dd>{imported.document.author.name || "—"}</dd></div><div><dt>Created</dt><dd>{new Date(imported.document.createdAt).toLocaleString()}</dd></div><div><dt>Schema</dt><dd>v{imported.fileHeader.schemaVersion} · app {imported.fileHeader.createdByAppVersion}</dd></div><div><dt>Content</dt><dd>{imported.preview.objectCount} objects · {imported.preview.expressionCount} expressions</dd></div>{imported.lesson && <><div><dt>Difficulty</dt><dd>{imported.lesson.difficulty} · grades {imported.lesson.gradeLevel.join(", ") || "—"}</dd></div><div><dt>Solutions</dt><dd>{imported.lesson.hints.length} hints · {imported.lesson.solutionSteps.length} steps</dd></div></>}</dl>{importWarnings.map(warning => <p className="portable-warning" key={warning}>{warning}</p>)}{imported.lesson && <label>Open lesson mode<select value={lessonMode} onChange={event => setLessonMode(event.target.value as LessonOpenMode)}><option value="practice">Practice — solution hidden</option><option value="guided">Guided — progressive hints</option>{imported.lesson.allowSolutionView && <option value="solution">Solution</option>}<option value="teacher">Teacher</option></select></label>}<div className="portable-import-actions"><button type="button" className="portable-primary" onClick={() => void applyImport("replace")}>{imported.workspace.type === adapter.workspaceType ? "Replace Current Workspace" : `Open ${imported.workspace.typeLabel}`}</button>{adapter.canMerge && imported.workspace.type === adapter.workspaceType && <button type="button" onClick={() => void applyImport("merge")}>Merge into Current Workspace</button>}<button type="button" onClick={() => void applyImport("new")}>Open in a New Tab</button>{dirty && <button type="button" onClick={() => void exportWorkspace()}>Export Current First</button>}</div></div>}
        </div>}
        {view === "lesson" && <div className="portable-lesson-panel">
          <div className="portable-settings-grid"><label>Title<input value={lessonForm.title} onChange={event => setLessonForm({ ...lessonForm, title: event.target.value })} /></label><label>Difficulty<select value={lessonForm.difficulty} onChange={event => setLessonForm({ ...lessonForm, difficulty: event.target.value })}><option>beginner</option><option>intermediate</option><option>advanced</option><option>mixed</option></select></label><label>Grade/level<input value={lessonForm.grade} onChange={event => setLessonForm({ ...lessonForm, grade: event.target.value })} placeholder="8, 9" /></label><label>Topic<input value={lessonForm.topic} onChange={event => setLessonForm({ ...lessonForm, topic: event.target.value })} /></label></div>
          <label>Short description<textarea value={lessonForm.description} onChange={event => setLessonForm({ ...lessonForm, description: event.target.value })} /></label><label>Instructions — one per line<textarea value={lessonForm.instructions} onChange={event => setLessonForm({ ...lessonForm, instructions: event.target.value })} /></label><label>Hints — one per line<textarea value={lessonForm.hints} onChange={event => setLessonForm({ ...lessonForm, hints: event.target.value })} /></label><label>Solution steps — one per line<textarea value={lessonForm.steps} onChange={event => setLessonForm({ ...lessonForm, steps: event.target.value })} /></label><label>Expected result<textarea value={lessonForm.expected} onChange={event => setLessonForm({ ...lessonForm, expected: event.target.value })} /></label><label>Teacher notes<textarea value={lessonForm.teacherNotes} onChange={event => setLessonForm({ ...lessonForm, teacherNotes: event.target.value })} /></label><label>Tags<input value={lessonForm.tags} onChange={event => setLessonForm({ ...lessonForm, tags: event.target.value })} placeholder="geometry, construction" /></label>
          <div className="portable-scene-captures"><button type="button" onClick={() => { initialScene.current = adapter.serializeScene(); setStatus("Starting scene captured."); }}><Check />Capture starting scene</button><button type="button" onClick={() => { solutionScene.current = adapter.serializeScene(); setStatus("Solution scene captured."); }}><Check />Capture solution scene</button><button type="button" onClick={() => { checkpointScenes.current = [...checkpointScenes.current, { id: crypto.randomUUID(), title: `Checkpoint ${checkpointScenes.current.length + 1}`, instructions: "", scene: adapter.serializeScene(), validationRules: [] }]; setStatus(`Checkpoint ${checkpointScenes.current.length} captured.`); }}><Check />Add checkpoint</button></div>
          <button type="button" className="portable-primary" onClick={() => void exportLesson()} disabled={busy}>Export Lesson File</button>
        </div>}
        <footer className={status.includes("could") || status.includes("not") || status.includes("failed") ? "is-error" : ""} aria-live="polite">{busy && <span className="portable-spinner" />}{status}{dirty && !busy && <small>Unsaved portable-file changes</small>}<small>{summary.objectCount} objects · {summary.expressionCount} expressions</small></footer>
      </section>
    </div>}
  </div>;
}

function Action({ icon, title, note, onClick }: { icon: React.ReactNode; title: string; note: string; onClick: () => void }) { return <button type="button" onClick={onClick}>{icon}<span><strong>{title}</strong><small>{note}</small></span></button>; }
function safeSnapshot(adapter: PortableWorkspaceAdapter) { try { return JSON.stringify(adapter.serializeScene()); } catch { return ""; } }
function splitComma(value: string) { return value.split(",").map(item => item.trim()).filter(Boolean); }
function splitLines(value: string) { return value.split(/\r?\n/).map(item => item.trim()).filter(Boolean); }
function capital(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
function message(error: unknown, fallback: string) { return error instanceof Error && error.message ? error.message : fallback; }
