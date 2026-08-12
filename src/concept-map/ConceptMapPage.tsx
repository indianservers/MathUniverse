import { ArrowRight, BookOpen, ChevronRight, EyeOff, Filter, Network, Route, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConceptMapCanvas from "./ConceptMapCanvas";
import ConceptMapNodeDetails from "./ConceptMapNodeDetails";
import ConceptMapSidebar from "./ConceptMapSidebar";
import { conceptCategoryInfo, conceptEdges, conceptNodes } from "./conceptMapData";
import type { ConceptMapFilters, LearningMode } from "./conceptMapTypes";
import { filterConcepts, findLearningPath, getConceptById, getImmediateConnectionIds, getPrerequisites, getVisibleEdges } from "./conceptMapUtils";
import "./conceptMapStyles.css";

const masteredSeedIds = ["natural-numbers", "whole-numbers", "integers", "fractions", "variables", "points-lines-angles", "sets", "coordinate-plane"];

export default function ConceptMapPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ConceptMapFilters>({});
  const [selectedId, setSelectedId] = useState("unit-circle");
  const [learningMode, setLearningMode] = useState<LearningMode>("student");
  const [classroomMode, setClassroomMode] = useState(false);
  const [masteredVisible, setMasteredVisible] = useState(true);
  const [showPrerequisites, setShowPrerequisites] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [hideUnrelated, setHideUnrelated] = useState(true);
  const [pathActive, setPathActive] = useState(false);
  const [pathStartId] = useState("fractions");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredConcepts = useMemo(() => filterConcepts(filters), [filters]);
  const selectedConcept = getConceptById(selectedId);
  const path = useMemo(() => findLearningPath(pathStartId, selectedId), [pathStartId, selectedId]);
  const pathIds = useMemo(() => new Set(pathActive ? path.map((concept) => concept.id) : []), [path, pathActive]);
  const focusIds = useMemo(() => selectedId ? getImmediateConnectionIds(selectedId) : new Set<string>(), [selectedId]);
  const searchMatchIds = useMemo(() => new Set(filteredConcepts.map((concept) => concept.id)), [filteredConcepts]);
  const searchActive = Boolean(filters.search);
  const filtersActive = Boolean(filters.search || filters.categories?.length || filters.difficulties?.length || filters.modules?.length);
  const categoryCount = Object.keys(conceptCategoryInfo).length;

  const visibleConcepts = useMemo(() => {
    const filteredIds = new Set(filteredConcepts.map((concept) => concept.id));
    if (!selectedId) return filteredConcepts;
    if (showPrerequisites) { const ids = new Set([selectedId, ...getPrerequisites(selectedId).map((concept) => concept.id), ...pathIds]); return conceptNodes.filter((concept) => ids.has(concept.id)); }
    if (showNext) { const ids = new Set([selectedId, ...(selectedConcept?.nextConcepts ?? []), ...pathIds]); return conceptNodes.filter((concept) => ids.has(concept.id)); }
    if (hideUnrelated || classroomMode || pathActive) return conceptNodes.filter((concept) => focusIds.has(concept.id) || pathIds.has(concept.id) || (filtersActive && filteredIds.has(concept.id)));
    return conceptNodes.filter((concept) => (masteredVisible || !masteredSeedIds.includes(concept.id)) && (!filtersActive || filteredIds.has(concept.id)));
  }, [classroomMode, filteredConcepts, filtersActive, focusIds, hideUnrelated, masteredVisible, pathActive, pathIds, selectedConcept?.nextConcepts, selectedId, showNext, showPrerequisites]);

  const visibleEdges = useMemo(() => getVisibleEdges(visibleConcepts, selectedId, showPrerequisites, showNext, filters.relationships), [filters.relationships, selectedId, showNext, showPrerequisites, visibleConcepts]);

  useEffect(() => { if (filtersActive && filteredConcepts.length && !filteredConcepts.some((concept) => concept.id === selectedId)) setSelectedId(filteredConcepts[0].id); }, [filteredConcepts, filtersActive, selectedId]);

  const selectConcept = (id: string) => { setSelectedId(id); setDetailsOpen(Boolean(id)); };
  const startPath = () => { if (!selectedId) setSelectedId("unit-circle"); setPathActive(true); setHideUnrelated(true); setDetailsOpen(true); };

  return (
    <main className={`concept-map-page ${classroomMode ? "classroom" : ""} ${filtersOpen ? "filters-open" : ""} ${detailsOpen ? "details-open" : ""}`}>
      <header className="concept-page-header">
        <div className="concept-heading-copy"><nav aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight />Concept Map</nav><h1>Concept Map</h1><p>Explore how mathematical concepts connect across the universe.</p></div>
        <div className="concept-hero-stats" aria-label="Concept map coverage"><span><Network /><strong>{conceptNodes.length}</strong><small>Concepts</small></span><span><Route /><strong>{conceptEdges.length}</strong><small>Connections</small></span><span><SlidersHorizontal /><strong>{categoryCount}</strong><small>Categories</small></span></div>
        <button type="button" className="concept-start-path" onClick={startPath}><BookOpen />{pathActive ? "Continue learning path" : "Start learning path"}<ArrowRight /></button>
      </header>

      <section className="concept-map-layout">
        <ConceptMapSidebar classroomMode={classroomMode} filters={filters} learningMode={learningMode} masteredVisible={masteredVisible} onClassroomMode={setClassroomMode} onFilters={setFilters} onLearningMode={setLearningMode} onMasteredVisible={setMasteredVisible} totalCount={conceptNodes.length} visibleCount={filteredConcepts.length} />

        <div className="concept-main-column">
          <div className="concept-context-toolbar" aria-label="Graph relationship controls">
            <button type="button" aria-label="Show prerequisites" className={showPrerequisites ? "active" : ""} onClick={() => { setShowPrerequisites((value) => !value); setShowNext(false); }}><Route />Prerequisites</button>
            <button type="button" className={showNext ? "active" : ""} onClick={() => { setShowNext((value) => !value); setShowPrerequisites(false); }}><ArrowRight />Next steps</button>
            <button type="button" className={hideUnrelated ? "active" : ""} onClick={() => setHideUnrelated((value) => !value)}><EyeOff />Hide unrelated</button>
            <select aria-label="Relationship filter" value={filters.relationships?.length ? "filtered" : "all"} onChange={(event) => event.target.value === "all" && setFilters({ ...filters, relationships: undefined })}><option value="all">All relationships</option>{filters.relationships?.length && <option value="filtered">{filters.relationships.length} types selected</option>}</select>
            {pathActive && <button type="button" className="concept-clear-path" onClick={() => { setPathActive(false); setHideUnrelated(false); }}><X />Clear path</button>}
          </div>
          <ConceptMapCanvas edges={visibleEdges} focusIds={focusIds} onOpen={(concept) => concept.route && navigate(concept.route)} onSelect={selectConcept} pathIds={pathIds} searchActive={searchActive} searchMatchIds={searchMatchIds} selectedId={selectedId} visibleConcepts={visibleConcepts} />
        </div>

        <ConceptMapNodeDetails concept={selectedConcept} learningMode={learningMode} masteredIds={masteredSeedIds} onClose={() => setDetailsOpen(false)} onSelect={selectConcept} path={path} pathActive={pathActive} onStartPath={startPath} />
      </section>

      <button type="button" className="concept-mobile-filter" onClick={() => setFiltersOpen(true)}><Filter />Filters</button>
      {(filtersOpen || detailsOpen) && <button type="button" className="concept-mobile-backdrop" aria-label="Close open panel" onClick={() => { setFiltersOpen(false); setDetailsOpen(false); }} />}
    </main>
  );
}
