import { Link } from "react-router-dom";
import { conceptCategoryInfo } from "./conceptMapData";
import type { ConceptNode, LearningMode } from "./conceptMapTypes";
import { getAvailableModuleCount, getConceptReadiness, getNextConcepts, getPrerequisites, getRelatedConcepts } from "./conceptMapUtils";

const moduleActions: Array<{ key: keyof ConceptNode["availableModules"]; label: string; route: (concept: ConceptNode) => string }> = [
  { key: "dictionary", label: "Dictionary", route: () => "/visual-dictionary" },
  { key: "formulaVisualization", label: "Formula page", route: (concept) => concept.route ?? "/formulas" },
  { key: "theorem", label: "Theorem", route: () => "/theorems" },
  { key: "visualProof", label: "Visual proof", route: (concept) => concept.route ?? "/visual-proofs" },
  { key: "graph", label: "Graph lab", route: () => "/workspace/graph" },
  { key: "visualization2D", label: "2D lab", route: () => "/workspace" },
  { key: "visualization3D", label: "3D lab", route: () => "/workspace/3d" },
  { key: "venn", label: "Venn lab", route: () => "/set-theory/venn-diagram-engine" },
  { key: "problemSolver", label: "Solver", route: () => "/problem-solver" },
  { key: "practice", label: "Practice", route: () => "/quiz" },
  { key: "olympiad", label: "Olympiad", route: () => "/olympyard" },
];

function ConceptLinkList({ concepts, empty, onSelect }: { concepts: ConceptNode[]; empty: string; onSelect: (id: string) => void }) {
  if (!concepts.length) return <p className="concept-muted">{empty}</p>;
  return (
    <div className="concept-mini-links">
      {concepts.map((concept) => (
        <button key={concept.id} type="button" onClick={() => onSelect(concept.id)}>
          {concept.title}
        </button>
      ))}
    </div>
  );
}

export default function ConceptMapNodeDetails({
  concept,
  learningMode,
  masteredIds,
  onSelect,
}: {
  concept?: ConceptNode;
  learningMode: LearningMode;
  masteredIds: string[];
  onSelect: (id: string) => void;
}) {
  if (!concept) {
    return (
      <aside className="concept-panel concept-details" aria-label="Selected concept details">
        <h2>Select a concept</h2>
        <p className="concept-muted">Choose any node to see prerequisites, links, formulas, visual proofs, and next learning steps.</p>
      </aside>
    );
  }

  const category = conceptCategoryInfo[concept.category];
  const prerequisites = getPrerequisites(concept.id);
  const nextConcepts = getNextConcepts(concept.id);
  const relatedConcepts = getRelatedConcepts(concept.id);
  const readiness = getConceptReadiness(concept.id, masteredIds);
  const modules = getAvailableModuleCount(concept);
  const visibleActions = moduleActions.filter((action) => concept.availableModules[action.key]);

  return (
    <aside className="concept-panel concept-details" aria-label="Selected concept details">
      <div className="concept-detail-header">
        <span style={{ background: category.softColor, color: category.color }}>{category.label}</span>
        <span>{concept.difficulty}</span>
      </div>
      <h2>{concept.title}</h2>
      <p>{concept.description}</p>
      <p className="concept-why">{concept.whyItMatters}</p>

      <div className="concept-readiness">
        <strong>{readiness.ready ? "Ready to learn" : "Needs foundations first"}</strong>
        <span>{modules} connected modules | about {concept.estimatedMinutes ?? 20} minutes</span>
      </div>

      {!readiness.ready && (
        <div className="concept-warning">
          Missing: {readiness.missingPrerequisites.map((item) => item.title).join(", ")}
        </div>
      )}

      <div className="concept-action-grid">
        {concept.route && (
          <Link className="concept-primary-link" to={concept.route}>
            Open lesson
          </Link>
        )}
        {visibleActions.map((action) => (
          <Link key={action.key} to={action.route(concept)}>
            {action.label}
          </Link>
        ))}
      </div>

      <section>
        <h3>Prerequisites</h3>
        <ConceptLinkList concepts={prerequisites} empty="No prerequisites listed." onSelect={onSelect} />
      </section>

      <section>
        <h3>Builds into</h3>
        <ConceptLinkList concepts={nextConcepts} empty="No next concepts listed yet." onSelect={onSelect} />
      </section>

      {learningMode !== "student" && (
        <section>
          <h3>Teacher notes</h3>
          <p className="concept-muted">
            Use this node to connect {category.label.toLowerCase()} with formulas, theorem proofs, problem solving, and classroom-ready visual modules.
          </p>
        </section>
      )}

      <section>
        <h3>Related concepts</h3>
        <ConceptLinkList concepts={relatedConcepts} empty="No related concepts listed yet." onSelect={onSelect} />
      </section>

      {(concept.formulas?.length || concept.theorems?.length || concept.realLifeUses?.length) && (
        <section className="concept-evidence">
          {concept.formulas?.length ? <p><strong>Formulas:</strong> {concept.formulas.join(", ")}</p> : null}
          {concept.theorems?.length ? <p><strong>Theorems:</strong> {concept.theorems.join(", ")}</p> : null}
          {concept.realLifeUses?.length ? <p><strong>Uses:</strong> {concept.realLifeUses.join(", ")}</p> : null}
        </section>
      )}
    </aside>
  );
}
