import type { ConceptNode } from "./conceptMapTypes";

export default function ConceptMapPathPanel({
  goalId,
  nodes,
  onGoalId,
  onSelect,
  onStartId,
  path,
  startId,
}: {
  goalId: string;
  nodes: ConceptNode[];
  onGoalId: (id: string) => void;
  onSelect: (id: string) => void;
  onStartId: (id: string) => void;
  path: ConceptNode[];
  startId: string;
}) {
  return (
    <section className="concept-panel concept-path-panel" aria-label="Learning path planner">
      <div className="concept-path-heading">
        <div>
          <p className="eyebrow">Learning path</p>
          <h2>From foundation to target concept</h2>
        </div>
        <span>{path.length ? `${path.length} steps` : "No path yet"}</span>
      </div>

      <div className="concept-path-controls">
        <label>
          Start
          <select value={startId} onChange={(event) => onStartId(event.target.value)}>
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>{node.title}</option>
            ))}
          </select>
        </label>
        <label>
          Goal
          <select value={goalId} onChange={(event) => onGoalId(event.target.value)}>
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>{node.title}</option>
            ))}
          </select>
        </label>
      </div>

      {path.length ? (
        <ol className="concept-path-list">
          {path.map((node, index) => (
            <li key={node.id}>
              <button type="button" onClick={() => onSelect(node.id)}>
                <span>{index + 1}</span>
                {node.title}
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <p className="concept-muted">Pick two connected concepts to reveal a suggested prerequisite path.</p>
      )}
    </section>
  );
}
