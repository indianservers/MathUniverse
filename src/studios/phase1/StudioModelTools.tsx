import { useStudioModel } from "./StudioModelProvider";

export default function StudioModelTools({ className = "msk-canvas-tools p1-toolbar" }: { className?: string }) {
  const model = useStudioModel();
  if (!model || !model.ledger.bindings.size) return null;
  return <>
    <div className={className} role="toolbar" aria-label="Figure tools">
      <button type="button" disabled={!model.ledger.past.length} onClick={model.ledger.undo}>Undo</button>
      <button type="button" disabled={!model.ledger.future.length} onClick={model.ledger.redo}>Redo</button>
      <button type="button" onClick={model.ledger.reset}>Reset</button>
      <button type="button" onClick={() => void model.share()}>Share</button>
      <button type="button" aria-pressed={model.exact} title="Use exact fractions and radicals where available" onClick={() => model.setExact(!model.exact)}>{model.exact ? "Exact" : "Approx"}</button>
    </div>
    {model.status ? <p role="status" className="studio-model-status">{model.status}</p> : null}
  </>;
}
