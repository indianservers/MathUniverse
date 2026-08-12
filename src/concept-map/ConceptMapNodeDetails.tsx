import { Bookmark, BookOpen, Check, Circle, Clock, MoreVertical, Route, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import MathExpression from "../components/ui/MathExpression";
import { conceptCategoryInfo } from "./conceptMapData";
import type { ConceptNode, LearningMode } from "./conceptMapTypes";
import { getAvailableModuleCount, getNextConcepts, getPrerequisites, getRelatedConcepts } from "./conceptMapUtils";

type InspectorTab = "overview" | "connections" | "path";

const moduleActions: Array<{ key: keyof ConceptNode["availableModules"]; label: string; route: (concept: ConceptNode) => string }> = [
  { key: "dictionary", label: "Dictionary", route: () => "/visual-dictionary" }, { key: "formulaVisualization", label: "Formula page", route: (concept) => concept.route ?? "/formulas" }, { key: "theorem", label: "Theorem", route: () => "/theorems" }, { key: "visualProof", label: "Visual proof", route: (concept) => concept.route ?? "/visual-proofs" }, { key: "graph", label: "Graph lab", route: () => "/workspace/graph" }, { key: "visualization2D", label: "2D lab", route: () => "/workspace" }, { key: "visualization3D", label: "3D lab", route: () => "/workspace/3d" }, { key: "problemSolver", label: "Solver", route: () => "/problem-solver" }, { key: "practice", label: "Practice", route: () => "/quiz" },
];

function LinkGroup({ title, concepts, onSelect }: { title: string; concepts: ConceptNode[]; onSelect: (id: string) => void }) {
  return <section className="concept-connection-group"><h3>{title}<span>{concepts.length}</span></h3>{concepts.length ? concepts.map((item) => <button key={item.id} type="button" onClick={() => onSelect(item.id)}>{item.title}<span>{conceptCategoryInfo[item.category].label}</span></button>) : <p className="concept-muted">None recorded.</p>}</section>;
}

export default function ConceptMapNodeDetails({ concept, learningMode, masteredIds, onClose, onSelect, path, pathActive, onStartPath }: {
  concept?: ConceptNode; learningMode: LearningMode; masteredIds: string[]; onClose: () => void; onSelect: (id: string) => void; path: ConceptNode[]; pathActive: boolean; onStartPath: () => void;
}) {
  const [tab, setTab] = useState<InspectorTab>("overview");
  const [bookmarked, setBookmarked] = useState(false);
  if (!concept) return <aside className="concept-panel concept-details"><Route /><h2>Select a concept</h2><p className="concept-muted">Select a concept to explore its meaning, prerequisites, formulas, proofs, and learning path.</p></aside>;

  const category = conceptCategoryInfo[concept.category];
  const prerequisites = getPrerequisites(concept.id);
  const nextConcepts = getNextConcepts(concept.id);
  const relatedConcepts = getRelatedConcepts(concept.id);
  const completed = prerequisites.filter((item) => masteredIds.includes(item.id));
  const percent = prerequisites.length ? Math.round(completed.length / prerequisites.length * 100) : 100;
  const visibleActions = moduleActions.filter((action) => concept.availableModules[action.key]);
  const proofAction = visibleActions.find((action) => action.key === "visualProof");

  return (
    <aside className="concept-panel concept-details" aria-label="Selected concept details">
      <button type="button" className="concept-mobile-close" aria-label="Close concept details" onClick={onClose}><X /></button>
      <div className="concept-detail-header"><span style={{ background: category.softColor, color: category.color }}>{category.label}</span><span>{concept.difficulty}</span><button type="button" aria-label="Bookmark concept" className={bookmarked ? "active" : ""} onClick={() => setBookmarked((value) => !value)}><Bookmark /></button><button type="button" aria-label="More concept actions"><MoreVertical /></button></div>
      <h2>{concept.title}</h2><p>{concept.description}</p>

      <div className="concept-readiness-card"><strong>{completed.length} of {prerequisites.length} prerequisites complete</strong><span>{percent}%</span><div><i style={{ width: `${percent}%` }} /></div><div className="concept-prerequisite-chips">{prerequisites.map((item) => <button key={item.id} type="button" className={masteredIds.includes(item.id) ? "complete" : "missing"} onClick={() => onSelect(item.id)}>{masteredIds.includes(item.id) ? <Check /> : <Circle />}{item.title}</button>)}</div></div>

      {concept.formulas?.[0] && <div className="concept-key-formula"><span>Key formula</span><MathExpression value={concept.formulas[0]} /></div>}
      <div className="concept-primary-actions">{concept.route && <Link to={concept.route}><BookOpen />Open lesson</Link>}{proofAction && <Link to={proofAction.route(concept)}>Visual proof</Link>}</div>

      <div className="concept-inspector-tabs" role="tablist" aria-label="Learning path and concept information">{(["overview", "connections", "path"] as InspectorTab[]).map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div>

      <div className="concept-inspector-content">
        {tab === "overview" && <div className="concept-overview"><h3>Overview</h3><p>{concept.whyItMatters}</p><dl><div><dt>Difficulty</dt><dd>{concept.difficulty}</dd></div><div><dt>Learning time</dt><dd><Clock />{concept.estimatedMinutes ?? 20} min</dd></div><div><dt>Connected tools</dt><dd>{getAvailableModuleCount(concept)}</dd></div><div><dt>Mastery</dt><dd>{concept.masteryLevel ?? 0}%</dd></div></dl>{concept.realLifeUses?.length ? <p><strong>Use cases:</strong> {concept.realLifeUses.join(", ")}</p> : null}{learningMode !== "student" && <p className="concept-teacher-note">Teacher view: connect this topic to formulas, proof, practice, and visual modules.</p>}</div>}
        {tab === "connections" && <><LinkGroup title="Prerequisites" concepts={prerequisites} onSelect={onSelect} /><LinkGroup title="Builds into" concepts={nextConcepts} onSelect={onSelect} /><LinkGroup title="Related concepts" concepts={relatedConcepts} onSelect={onSelect} />{concept.theorems?.length ? <section className="concept-connection-group"><h3>Theorems</h3><p>{concept.theorems.join(", ")}</p></section> : null}</>}
        {tab === "path" && <div className="concept-learning-path"><div className="concept-path-summary"><strong>{path.length} steps</strong><span>About {path.reduce((sum, item) => sum + (item.estimatedMinutes ?? 20), 0)} minutes</span></div><ol>{path.map((item, index) => { const complete = masteredIds.includes(item.id); const current = item.id === concept.id; return <li key={item.id} className={current ? "current" : complete ? "complete" : ""}><button type="button" onClick={() => onSelect(item.id)}><i>{complete ? <Check /> : index + 1}</i><span>{item.title}<small>{current ? "Current" : complete ? "Completed" : "Next"}</small></span></button></li>; })}</ol><button type="button" className="concept-path-action" onClick={onStartPath}>{pathActive ? "Continue path" : "Start path"}</button></div>}
      </div>
    </aside>
  );
}
