import { useEffect, useMemo, useState } from "react";
import ConceptMapCanvas from "./ConceptMapCanvas";
import ConceptMapLegend from "./ConceptMapLegend";
import ConceptMapNodeDetails from "./ConceptMapNodeDetails";
import ConceptMapPathPanel from "./ConceptMapPathPanel";
import ConceptMapSidebar from "./ConceptMapSidebar";
import { conceptCategoryInfo, conceptEdges, conceptNodes } from "./conceptMapData";
import type { ConceptMapFilters, LearningMode } from "./conceptMapTypes";
import {
  filterConcepts,
  findLearningPath,
  getConceptById,
  getImmediateConnectionIds,
  getPrerequisites,
  getVisibleEdges,
} from "./conceptMapUtils";
import "./conceptMapStyles.css";

const masteredSeedIds = ["natural-numbers", "whole-numbers", "integers", "fractions", "variables", "points-lines-angles", "sets"];

export default function ConceptMapPage() {
  const [filters, setFilters] = useState<ConceptMapFilters>({});
  const [selectedId, setSelectedId] = useState("unit-circle");
  const [learningMode, setLearningMode] = useState<LearningMode>("student");
  const [classroomMode, setClassroomMode] = useState(false);
  const [showPrerequisites, setShowPrerequisites] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [pathStartId, setPathStartId] = useState("fractions");
  const [pathGoalId, setPathGoalId] = useState("trig-pythagorean-identity");

  const filteredConcepts = useMemo(() => filterConcepts(filters), [filters]);
  const selectedConcept = getConceptById(selectedId);
  const path = useMemo(() => findLearningPath(pathStartId, pathGoalId), [pathGoalId, pathStartId]);
  const pathIds = useMemo(() => new Set(path.map((concept) => concept.id)), [path]);
  const focusIds = useMemo(() => (selectedId ? getImmediateConnectionIds(selectedId) : new Set<string>()), [selectedId]);
  const filtersActive = Boolean(filters.search || filters.categories?.length || filters.difficulties?.length || filters.modules?.length);
  const categoryCount = Object.keys(conceptCategoryInfo).length;

  const visibleConcepts = useMemo(() => {
    if (!selectedId) return filteredConcepts;
    const filteredIds = new Set(filteredConcepts.map((concept) => concept.id));
    if (showPrerequisites) {
      const ids = new Set([selectedId, ...getPrerequisites(selectedId).map((concept) => concept.id), ...pathIds]);
      return conceptNodes.filter((concept) => ids.has(concept.id));
    }
    if (showNext) {
      const ids = new Set([selectedId, ...(selectedConcept?.nextConcepts ?? []), ...pathIds]);
      return conceptNodes.filter((concept) => ids.has(concept.id));
    }
    if (classroomMode) {
      return conceptNodes.filter((concept) => focusIds.has(concept.id) || pathIds.has(concept.id) || (filtersActive && filteredIds.has(concept.id)));
    }
    return filteredConcepts;
  }, [classroomMode, filteredConcepts, filtersActive, focusIds, pathIds, selectedConcept?.nextConcepts, selectedId, showNext, showPrerequisites]);

  const visibleEdges = useMemo(
    () => getVisibleEdges(visibleConcepts, selectedId, showPrerequisites, showNext),
    [selectedId, showNext, showPrerequisites, visibleConcepts],
  );

  useEffect(() => {
    if (!filteredConcepts.length) return;
    if (!filteredConcepts.some((concept) => concept.id === selectedId)) {
      setSelectedId(filteredConcepts[0].id);
    }
  }, [filteredConcepts, selectedId]);

  const setSelected = (id: string) => {
    setSelectedId(id);
    if (learningMode === "student") {
      setPathGoalId(id);
    }
  };

  return (
    <main className={`concept-map-page ${classroomMode ? "classroom" : ""}`}>
      <header className="concept-hero">
        <div>
          <p className="eyebrow">Math Universe intelligence layer</p>
          <h1>Concept Map</h1>
          <p>
            Explore how formulas, theorems, visual proofs, practice, graph tools, and real-world uses connect across the whole app.
          </p>
        </div>
        <div className="concept-hero-stats" aria-label="Concept map coverage">
          <span><strong>{conceptNodes.length}</strong> concepts</span>
          <span><strong>{conceptEdges.length}</strong> links</span>
          <span><strong>{categoryCount}</strong> categories</span>
        </div>
      </header>

      <section className="concept-coverage-note" aria-label="Concept map coverage note">
        <strong>Expanded mathematics coverage:</strong>
        <span>computation, cryptography, AI, optimization, economics, finance, engineering, topology, fractals, chaos, and mathematical physics.</span>
      </section>

      <section className="concept-view-controls" aria-label="Graph view controls">
        <button type="button" className={showPrerequisites ? "active" : ""} onClick={() => { setShowPrerequisites((value) => !value); setShowNext(false); }}>
          Show prerequisites
        </button>
        <button type="button" className={showNext ? "active" : ""} onClick={() => { setShowNext((value) => !value); setShowPrerequisites(false); }}>
          Show next steps
        </button>
        <button type="button" onClick={() => { setShowPrerequisites(false); setShowNext(false); setFilters({}); }}>
          Reset graph
        </button>
      </section>

      <div className="concept-map-layout">
        <ConceptMapSidebar
          classroomMode={classroomMode}
          filters={filters}
          learningMode={learningMode}
          onClassroomMode={setClassroomMode}
          onFilters={setFilters}
          onLearningMode={setLearningMode}
          totalCount={conceptNodes.length}
          visibleCount={filteredConcepts.length}
        />

        <div className="concept-main-column">
          <ConceptMapCanvas
            edges={classroomMode ? visibleEdges.filter((edge) => focusIds.has(edge.source) || focusIds.has(edge.target) || pathIds.has(edge.source) || pathIds.has(edge.target)) : visibleEdges}
            focusIds={focusIds}
            onSelect={setSelected}
            pathIds={pathIds}
            searchActive={filtersActive}
            selectedId={selectedId}
            visibleConcepts={visibleConcepts}
          />
          <ConceptMapLegend />
          <ConceptMapPathPanel
            goalId={pathGoalId}
            nodes={conceptNodes}
            onGoalId={setPathGoalId}
            onSelect={setSelected}
            onStartId={setPathStartId}
            path={path}
            startId={pathStartId}
          />
        </div>

        <ConceptMapNodeDetails concept={selectedConcept} learningMode={learningMode} masteredIds={masteredSeedIds} onSelect={setSelected} />
      </div>
    </main>
  );
}
