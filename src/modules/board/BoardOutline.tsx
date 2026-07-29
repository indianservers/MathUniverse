import type { BoardDocument, BoardElement } from "./types";

export default function BoardOutline({ document, selectedIds, onSelect }: { document: BoardDocument; selectedIds: string[]; onSelect: (ids: string[]) => void }) {
  const elements = [...document.elements].sort((left, right) => left.bounds.y - right.bounds.y || left.bounds.x - right.bounds.x);
  return (
    <section aria-label="Board Outline">
      <h2 className="font-bold">Board Outline</h2>
      <p className="text-xs text-slate-500">Elements in visual reading order</p>
      <ol className="mt-2 max-h-56 space-y-1 overflow-y-auto">
        {elements.map((element, index) => (
          <li key={element.id}>
            <button type="button" className={`w-full rounded-lg px-2 py-2 text-left text-sm ${selectedIds.includes(element.id) ? "bg-cyan-50 ring-1 ring-cyan-400 dark:bg-cyan-400/10" : "hover:bg-slate-100 dark:hover:bg-white/5"}`} onClick={() => onSelect([element.id])}>
              <span className="mr-2 text-xs text-slate-500">{index + 1}.</span>{describeElement(element)}
            </button>
          </li>
        ))}
      </ol>
      {!elements.length && <p className="mt-2 text-sm text-slate-500">The Board is empty.</p>}
    </section>
  );
}

function describeElement(element: BoardElement) {
  if (element.type === "stroke") return `${element.tool} stroke`;
  if (element.type === "math-expression") return `Expression: ${element.latex}`;
  if (element.type === "solution-step") return `Step ${element.order + 1}: ${element.latex} · ${element.verificationStatus ?? "unverified"}`;
  if (element.type === "math-result") return `${element.title}: ${element.exactOutputLatex ?? element.plainTextOutput ?? element.status}`;
  if (element.type === "image") return `Imported image with ${element.recognitionRegions.length} regions`;
  if (element.type === "explanation") return `${element.title}: ${element.text}`;
  if (element.type === "text") return `Text: ${element.text}`;
  return `Shape: ${element.shape}`;
}
