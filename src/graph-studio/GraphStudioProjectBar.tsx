import { Copy, Download, FilePlus2, FolderOpen, Heart, Redo2, Save, Undo2, Upload } from "lucide-react";
import { cloneElement, useRef, useState, type ReactElement } from "react";
import { downloadGraphStudioFile, exportGraphStudioProject } from "./projectStorage";
import type { GraphStudioProject, GraphStudioStylePreset, GraphStudioVariable } from "./types";

type ProjectController<TState> = {
  project: GraphStudioProject<TState>;
  projects: GraphStudioProject<TState>[];
  updateProject: (patch: Partial<GraphStudioProject<TState>>) => void;
  save: () => void;
  newProject: () => void;
  load: (project: GraphStudioProject<TState>) => void;
  remove: (id: string) => void;
  duplicate: () => void;
  importProject: (raw: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export default function GraphStudioProjectBar<TState>({ controller, variables, onVariablesChange }: { controller: ProjectController<TState>; variables: GraphStudioVariable[]; onVariablesChange: (variables: GraphStudioVariable[]) => void }) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [importError, setImportError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const project = controller.project;

  return (
    <section className="sticky top-16 z-30 rounded-lg border border-cyan-300/40 bg-slate-950/95 p-2 text-white shadow-lg backdrop-blur" aria-label="Graph Studio project controls">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <div className="mr-1 flex min-w-[190px] flex-1 items-center gap-2">
          <span className="hidden rounded bg-cyan-400 px-2 py-1 text-[10px] font-black uppercase text-slate-950 sm:inline">Graph Studio {project.dimension.toUpperCase()}</span>
          <input aria-label="Project name" className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm font-black text-white outline-none focus:ring-2 focus:ring-cyan-300" value={project.name} onChange={(event) => controller.updateProject({ name: event.target.value })} />
        </div>
        <IconButton label="New project" onClick={controller.newProject}><FilePlus2 /></IconButton>
        <IconButton label="Save project" onClick={controller.save}><Save /></IconButton>
        <IconButton label="Undo" onClick={controller.undo} disabled={!controller.canUndo}><Undo2 /></IconButton>
        <IconButton label="Redo" onClick={controller.redo} disabled={!controller.canRedo}><Redo2 /></IconButton>
        <IconButton label="Duplicate project" onClick={controller.duplicate}><Copy /></IconButton>
        <IconButton label={project.favorite ? "Remove favorite" : "Favorite project"} onClick={() => controller.updateProject({ favorite: !project.favorite })}><Heart className={project.favorite ? "fill-rose-400 text-rose-400" : ""} /></IconButton>
        <IconButton label="Open projects" onClick={() => setLibraryOpen((value) => !value)}><FolderOpen /></IconButton>
        <IconButton label="Export project JSON" onClick={() => downloadGraphStudioFile(`${slug(project.name)}.graph.json`, exportGraphStudioProject({ ...project, variables }))}><Download /></IconButton>
        <IconButton label="Import project JSON" onClick={() => inputRef.current?.click()}><Upload /></IconButton>
        <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          try {
            controller.importProject(await file.text());
            onVariablesChange(controller.project.variables);
            setImportError("");
          } catch (error) {
            setImportError(error instanceof Error ? error.message : "Could not import this project.");
          }
          event.target.value = "";
        }} />
        <select aria-label="Appearance preset" className="min-h-10 rounded-md border border-white/15 bg-slate-900 px-2 text-xs font-bold" value={project.stylePreset} onChange={(event) => controller.updateProject({ stylePreset: event.target.value as GraphStudioStylePreset })}>
          <option value="classroom">Classroom</option><option value="paper">Scientific paper</option><option value="neon">Neon laboratory</option><option value="presentation">Dark presentation</option><option value="contrast">High contrast</option><option value="colorblind">Colour-blind safe</option><option value="print">Print monochrome</option>
        </select>
      </div>
      {importError && <p role="alert" className="mt-2 rounded bg-rose-500/20 px-3 py-2 text-xs font-bold text-rose-100">{importError}</p>}
      {libraryOpen && (
        <div className="mt-2 grid max-h-48 gap-2 overflow-auto border-t border-white/10 pt-2 sm:grid-cols-2 xl:grid-cols-4" aria-label="Saved Graph Studio projects">
          {controller.projects.length ? controller.projects.map((saved) => (
            <div key={saved.id} className="flex min-w-0 items-center gap-2 rounded-md border border-white/10 bg-white/5 p-2">
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => { controller.load(saved); onVariablesChange(saved.variables); setLibraryOpen(false); }}>
                <span className="block truncate text-xs font-black">{saved.favorite ? "* " : ""}{saved.name}</span>
                <span className="block text-[10px] text-slate-400">{new Date(saved.updatedAt).toLocaleString()}</span>
              </button>
              <button type="button" className="rounded p-2 text-rose-300 hover:bg-rose-400/15" aria-label={`Delete ${saved.name}`} onClick={() => controller.remove(saved.id)}>x</button>
            </div>
          )) : <p className="px-2 py-3 text-xs text-slate-400">Projects auto-save locally as you work.</p>}
        </div>
      )}
    </section>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactElement<{ className?: string }> }) {
  return <button type="button" className="tooltip-icon flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 hover:bg-cyan-400/15 disabled:opacity-35" aria-label={label} title={label} data-tooltip={label} onClick={onClick} disabled={disabled}>{cloneElement(children, { className: "h-4 w-4" })}</button>;
}

function slug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "graph-project";
}
