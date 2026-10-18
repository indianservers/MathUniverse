import GlobalCurriculumPathway from "./GlobalCurriculumPathway";
import { studyStages, type StudyStage } from "../data/globalCurriculumPathways";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, GraduationCap, Layers, Search, X } from "lucide-react";
import { curriculumNames, curriculumTopics, groupCurriculumTopics, topicHasUpcomingLesson, type CurriculumChapter, type CurriculumName, type CurriculumTopic } from "../data/curriculumTopics";
import { curriculumWorkbook, workbookLessonMappings } from "../data/curriculumWorkbookMappings";
import "./CurriculumDashboard.css";

const boardLabels: Record<CurriculumName, string> = { NCERT: "NCERT", AP: "Andhra Pradesh", Telangana: "Telangana", CBSE: "CBSE", Cambridge: "Cambridge", IB: "IB", "Common Core": "Common Core" };
const workbookCoverage = {mapped:workbookLessonMappings.filter((row) => row.state === "mapped").length,partial:workbookLessonMappings.filter((row) => row.state === "partial").length,upcoming:workbookLessonMappings.filter((row) => row.state === "upcoming").length};
const sharedAcross = new Map<number, Set<string>>();
for (const topic of curriculumTopics) for (const lesson of topic.lessons) {
  const curricula = sharedAcross.get(lesson.id) ?? new Set<string>();
  curricula.add(topic.curriculum); sharedAcross.set(lesson.id, curricula);
}

const browserStateKey = "math-curriculum-browser-v1";
type BrowserState = { curriculum?: string; query?: string; level?: string; status?: string; expanded?: string[] };
function readBrowserState(): BrowserState {
  try { const value: unknown = typeof window === "undefined" ? {} : JSON.parse(sessionStorage.getItem(browserStateKey) ?? "{}"); return value && typeof value === "object" && !Array.isArray(value) ? value as BrowserState : {}; } catch { return {}; }
}

export default function NCERTDashboardPage() {
  const [stage, setStage] = useState<StudyStage>("School");
  const [params, setParams] = useSearchParams();
  const [saved] = useState(readBrowserState);
  const lastFilters = useRef<string>();
  const focusedTopic = params.get("topic");
  const [curriculum, setCurriculum] = useState<CurriculumName | "All">(() => curriculumTopics.find((topic) => topic.id === focusedTopic)?.curriculum ?? (saved.curriculum === "All" ? "All" : curriculumNames.includes(saved.curriculum as CurriculumName) ? saved.curriculum as CurriculumName : "NCERT"));
  const [query, setQuery] = useState(!focusedTopic && typeof saved.query === "string" ? saved.query : "");
  const [level, setLevel] = useState(!focusedTopic && typeof saved.level === "string" ? saved.level : "All");
  const [status, setStatus] = useState(params.get("status") ?? (!focusedTopic && typeof saved.status === "string" ? saved.status : "All"));
  const [sourceScope, setSourceScope] = useState("All");
  const [expanded, setExpanded] = useState<Set<string>>(() => focusedTopic
    ? new Set(groupCurriculumTopics(curriculumTopics.filter((topic) => topic.id === focusedTopic)).flatMap((board) => board.classes.flatMap((entry) => [`${board.title}-${entry.title}`,...entry.chapters.map((chapter) => chapter.id)])))
    : new Set(Array.isArray(saved.expanded) ? saved.expanded.filter((key) => typeof key === "string") : []));
  const topics = useMemo(() => curriculumTopics.filter((topic) => {
    const searchText = [topic.title, topic.unit, topic.level, topic.workbook?.programme ?? "", topic.workbook?.track ?? "", ...[...topic.lessons, ...topic.draftLessons ?? [], ...topic.relatedLessons ?? []].map((lesson) => lesson.title)].join(" ").toLowerCase();
    return (curriculum === "All" || topic.curriculum === curriculum) && (level === "All" || topic.level === level) &&
      (sourceScope === "All" || !!topic.workbook) &&
      (status === "All" || (status === "upcoming" ? topicHasUpcomingLesson(topic) : status === "mapping" ? topic.mappingPending : !!(topic.lessons.length || topic.draftLessons?.length || topic.relatedLessons?.length))) &&
      (!focusedTopic || topic.id === focusedTopic) && searchText.includes(query.trim().toLowerCase());
  }), [curriculum, level, status, focusedTopic, query, sourceScope]);
  const tree = useMemo(() => {
    const matches = groupCurriculumTopics(topics);
    return groupCurriculumTopics(curriculumTopics.filter((topic) => curriculum === "All" || topic.curriculum === curriculum)).map((board) => ({...board,
      classes: board.classes.filter((entry) => level === "All" || entry.title === level).map((entry) => matches.find((match) => match.title === board.title)?.classes.find((match) => match.title === entry.title) ?? {...entry, chapters: [], lessons: [], upcomingCount: 0, mappingPendingCount: 0}),
    }));
  }, [topics, curriculum, level]);
  const allKeys = useMemo(() => tree.flatMap((board) => board.classes.flatMap((entry) => [`${board.title}-${entry.title}`, ...entry.chapters.map((chapter) => chapter.id)])), [tree]);
  useEffect(() => {
    const signature = JSON.stringify([curriculum, query, level, status, focusedTopic, sourceScope]);
    if (lastFilters.current === signature) return;
    const initial = lastFilters.current === undefined;
    lastFilters.current = signature;
    if (initial && !focusedTopic) return;
    setExpanded(query.trim() || focusedTopic || level !== "All" ? new Set(allKeys) : new Set());
  }, [allKeys, query, focusedTopic, level, curriculum, status, sourceScope]);
  useEffect(() => {
    try { sessionStorage.setItem(browserStateKey, JSON.stringify({ curriculum, query, level, status, expanded: [...expanded] })); } catch { /* Browsing still works when session storage is unavailable. */ }
  }, [curriculum, query, level, status, expanded]);
  const levels = [...new Set(curriculumTopics.filter((topic) => curriculum === "All" || topic.curriculum === curriculum).map((topic) => topic.level))].sort((a, b) => Number(a.match(/\d+/)?.[0] ?? 99) - Number(b.match(/\d+/)?.[0] ?? 99));
  const chapters = tree.flatMap((board) => board.classes.flatMap((entry) => entry.chapters));
  const lessonCount = new Set(chapters.flatMap((chapter) => [...chapter.lessons, ...chapter.draftLessons, ...chapter.relatedLessons].map((lesson) => lesson.id))).size;
  const upcomingCount = chapters.reduce((sum, chapter) => sum + chapter.upcoming.length, 0);
  const mappingCount = chapters.reduce((sum, chapter) => sum + chapter.mappingPending.length, 0);
  const toggle = (key: string) => setExpanded((previous) => {const next = new Set(previous); if (next.has(key)) next.delete(key); else next.add(key); return next;});
  const chooseCurriculum = (name: CurriculumName | "All") => {setCurriculum(name);setLevel("All");setParams({});};
  const reset = () => {setQuery("");setLevel("All");setStatus("All");setSourceScope("All");setParams({});};

  return <div className="curriculum-dashboard">
    <header className="curriculum-hero">
      <div className="curriculum-hero-copy"><p className="curriculum-eyebrow"><Layers size={15} /> ONE MATHEMATICS LIBRARY</p><h1>Find your chapter.<br /><span>Learn the mathematics.</span></h1><p>Choose a curriculum, open your class, and explore its chapters. Common topics lead to the same lessons, wherever you study.</p><Link className="curriculum-library-link" to="/lessons"><BookOpen size={16} /> Browse every lesson <ArrowRight size={16} /></Link></div>
      <div className="curriculum-path-preview" aria-label="Navigation guide"><span><GraduationCap size={22} /> Your class</span><ChevronRight size={18}/><span><BookOpen size={22} /> Math chapters</span><ChevronRight size={18}/><span><ArrowRight size={22} /> Shared lessons</span><small>One topic. One lesson page. Many curricula.</small></div>
    </header>

    <nav className="curriculum-tabs curriculum-stages" aria-label="Study stage">{studyStages.map((value) => <button key={value} aria-pressed={stage === value} onClick={() => setStage(value)}>{value === "School" ? "Class 6 to 12" : value}</button>)}</nav>
    {stage !== "School" ? <GlobalCurriculumPathway stage={stage}/> : <section className="curriculum-browser" aria-label="Curriculum Dashboard">
      <div className="curriculum-browser-heading"><div><p className="curriculum-eyebrow">EXPLORE BY CURRICULUM</p><h2>Curriculum Dashboard</h2></div><span className="curriculum-shared-note"><Layers size={15} /> Shared lessons across curricula</span></div>
      <div className="curriculum-tabs" aria-label="Curriculum">{[...curriculumNames, "All" as const].map((name) => <button key={name} type="button" aria-pressed={curriculum === name} onClick={() => chooseCurriculum(name)}>{name === "All" ? "All curricula" : name === "AP" ? "AP" : boardLabels[name]}</button>)}</div>
      <div className="curriculum-workbook-note"><strong>Textbook working index: {curriculumWorkbook.rows.length.toLocaleString()} teaching topics imported</strong><p>{workbookCoverage.mapped.toLocaleString()} topics mapped to lesson skills · {workbookCoverage.partial} partly covered · {workbookCoverage.upcoming} Upcoming. Published and authored draft links are labeled separately.</p><p>Every supplied row is listed under its curriculum, class and chapter. The index includes editorial topics, provisional chapter lists and AP proxy chapters. Original verification notes are preserved; textbook completeness is not yet certified.</p></div>
      <div className="curriculum-filters">
        <label className="curriculum-search"><Search size={18} /><input aria-label="Search chapters or lessons" type="search" placeholder="Search chapters or lessons, e.g. fractions…" value={query} onChange={(event) => setQuery(event.target.value)} />{query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={16}/></button>}</label>
        <label><span className="sr-only">Class</span><select aria-label="Class" value={level} onChange={(event) => setLevel(event.target.value)}><option value="All">All classes</option>{levels.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span className="sr-only">Availability</span><select aria-label="Availability" value={status} onChange={(event) => setStatus(event.target.value)}><option value="All">All coverage</option><option value="available">Available lessons</option><option value="upcoming">Upcoming lessons</option><option value="mapping">Mapping pending</option></select></label>
        <label><span className="sr-only">Topic source</span><select aria-label="Topic source" value={sourceScope} onChange={(event) => setSourceScope(event.target.value)}><option value="All">All topic sources</option><option value="Workbook">Workbook topics only</option></select></label>
      </div>
      <div className="curriculum-results-bar"><p aria-live="polite"><strong>{chapters.length}</strong> chapters <span>·</span> <strong>{topics.filter((topic) => topic.workbook).length}</strong> index topics <span>·</span> <strong>{lessonCount}</strong> unique lessons <span>·</span> <strong>{upcomingCount}</strong> upcoming lessons{mappingCount > 0 && <> <span>·</span> <strong>{mappingCount}</strong> mappings pending</>}</p><div><button onClick={() => setExpanded(new Set(allKeys))}><ChevronsUpDown size={15}/> Expand all</button><button onClick={() => setExpanded(new Set())}><ChevronsDownUp size={15}/> Collapse all</button>{(query || level !== "All" || status !== "All" || sourceScope !== "All" || focusedTopic) && <button onClick={reset}>Reset filters</button>}</div></div>
      {focusedTopic && <div className="curriculum-focus-note">Showing the selected topic. <button onClick={reset}>Browse all chapters</button></div>}
      <p className="curriculum-instruction">Open a class to see chapters, then open a chapter for lesson links. “Upcoming” means that specific topic has no mapped lesson. Draft links are available but await review.</p>

      <div className="curriculum-tree">{tree.map((board) => <section key={board.title} aria-label={`${boardLabels[board.title]} classes`}>
        {curriculum === "All" && <h3 className="curriculum-board-title">{boardLabels[board.title]}</h3>}
        {board.classes.map((entry) => {const key = `${board.title}-${entry.title}`;return <details className="curriculum-class" key={key} open={expanded.has(key)}>
          <summary onClick={(event) => {event.preventDefault();toggle(key);}}><span className="curriculum-class-icon"><GraduationCap size={23}/></span><span className="curriculum-class-title"><strong>{entry.title}</strong><small>Mathematics · {boardLabels[board.title]}</small></span><span className="curriculum-class-stats"><span>{entry.chapters.length} chapters</span><span>{new Set(entry.chapters.flatMap((chapter) => [...chapter.lessons, ...chapter.draftLessons, ...chapter.relatedLessons].map((lesson) => lesson.id))).size} lessons</span>{entry.upcomingCount > 0 && <span className="curriculum-upcoming-text">{entry.upcomingCount} upcoming</span>}{entry.mappingPendingCount > 0 && <span>{entry.mappingPendingCount} mapping pending</span>}</span><ChevronDown className="curriculum-chevron" size={20}/></summary>
          <div className="curriculum-chapters">{!entry.chapters.length && <p className="curriculum-focus-note">No topics match these filters in {entry.title}. <button onClick={reset}>Show all chapters</button></p>}{entry.chapters.map((chapter, index) => <details className="curriculum-chapter" key={chapter.id} open={expanded.has(chapter.id)}>
            <summary onClick={(event) => {event.preventDefault();toggle(chapter.id);}}><span className="curriculum-chapter-number">{String(index + 1).padStart(2, "0")}</span><span className="curriculum-chapter-title"><strong>{chapter.title}</strong><small>{(chapter.lessons.length || chapter.draftLessons.length) ? `${chapter.lessons.length} published / ${chapter.draftLessons.length} draft lesson${chapter.lessons.length === 1 ? "" : "s"}${chapter.relatedLessons.length ? ` / ${chapter.relatedLessons.length} chapter resources` : ""}` : chapter.mappingPending.length ? "Chapter mapping in progress" : "Lesson coming soon"}{chapter.lessons.length > 0 && chapter.upcoming.length > 0 ? ` · ${chapter.upcoming.length} upcoming topics` : ""}</small></span>{!chapter.lessons.length && !chapter.draftLessons.length && <span className={chapter.mappingPending.length ? "curriculum-status-mapping" : "curriculum-status-upcoming"}>{chapter.mappingPending.length ? "Mapping pending" : "Upcoming"}</span>}<ChevronDown className="curriculum-chevron" size={18}/></summary>
            {expanded.has(chapter.id) && <ChapterContent chapter={chapter} />}
          </details>)}</div>
        </details>;})}
      </section>)}</div>
      {!tree.length && <div className="curriculum-empty"><Search size={28}/><h3>No matching chapters or lessons</h3><p>Try another topic, class or curriculum.</p><button onClick={reset}>Clear filters</button></div>}
    </section>}
    <p className="curriculum-footer-note">Lesson availability describes the shared library. Textbook editions can differ in chapter names and sequence; source details appear inside each chapter.</p>
  </div>;
}

function ChapterContent({ chapter }: { chapter: CurriculumChapter }) {
  const workbookTopics = chapter.topics.filter((topic) => topic.workbook).sort((a,b) => a.workbook!.lessonNumber - b.workbook!.lessonNumber);
  const source = chapter.topics.find((topic) => topic.sourceUrl);
  const note = source?.sourceNote ?? chapter.topics.find((topic) => topic.sourceNote)?.sourceNote;
  return <div className="curriculum-chapter-content">
    {workbookTopics.length > 0 && <div className="curriculum-textbook-topics"><p className="curriculum-list-heading">TEXTBOOK INDEX · EVERY TEACHING TOPIC</p>{workbookTopics.map((topic) => <WorkbookTopic key={topic.id} topic={topic}/>)}</div>}
    <details className="curriculum-alignment-note"><summary>All chapter topics ({chapter.topics.length})</summary><ul>{chapter.topics.map((topic) => <li key={topic.id}>{topic.title}</li>)}</ul></details>
    {chapter.lessons.length > 0 && <><p className="curriculum-list-heading">LESSON LINKS</p><div className="curriculum-lesson-grid">{chapter.lessons.map((lesson) => <Link className="curriculum-lesson" key={lesson.id} to={lesson.route}><span className="curriculum-lesson-icon"><BookOpen size={17}/></span><span><strong>{lesson.title}</strong><small>{lesson.minutes} min{(sharedAcross.get(lesson.id)?.size ?? 0) > 1 ? ` · Shared across ${sharedAcross.get(lesson.id)?.size} curricula` : " · Interactive lesson"}</small></span><ArrowRight size={17}/></Link>)}</div></>}
    {chapter.draftLessons.length > 0 && <><p className="curriculum-list-heading">DRAFT LESSON LINKS / AWAITING REVIEW</p><div className="curriculum-lesson-grid">{chapter.draftLessons.map((lesson) => <Link className="curriculum-lesson" key={lesson.id} to={lesson.route}><span><strong>{lesson.title}</strong><small>Draft available / awaiting review / {lesson.minutes} min</small></span><ArrowRight size={17}/></Link>)}</div></>}
    {chapter.upcoming.length > 0 && <details className="curriculum-upcoming-list" open={!chapter.lessons.length}><summary><span className="curriculum-upcoming-dot" />{chapter.upcoming.length} upcoming topic{chapter.upcoming.length === 1 ? "" : "s"}<ChevronDown size={15}/></summary><ul>{chapter.upcoming.map((topic) => <li key={topic.id}><span><Link to={`/curriculum?topic=${topic.id.replace(/-missing-\d+$/, "")}`}>{topic.title}</Link>{topic.missingReason && <small className="curriculum-gap-reason">{topic.missingReason}</small>}</span><span className="curriculum-status-upcoming">Upcoming</span></li>)}</ul></details>}
    {chapter.alignmentPending.length > 0 && <details className="curriculum-alignment-note"><summary>Shared practice available · {chapter.alignmentPending.length} textbook items awaiting alignment</summary><p>The lesson links above provide worked examples and practice for the chapter skills. Exact textbook exercise sets and board assessments are still awaiting alignment.</p><ul>{chapter.alignmentPending.map((topic) => <li key={topic.id}>{topic.title}</li>)}</ul></details>}
    {chapter.mappingPending.length > 0 && <div className="curriculum-mapping-note"><p>Exact board chapter names and sequencing are being checked. Any shared reference links shown here are available for study; they do not certify textbook alignment.</p><Link to="/lessons">Browse existing lessons <ArrowRight size={14}/></Link></div>}
    {(source || note) && <p className="curriculum-source">{note} {source && <a href={source.sourceUrl} target="_blank" rel="noreferrer">View textbook source ↗</a>}</p>}
  </div>;
}

function WorkbookTopic({topic}: {topic: CurriculumTopic}) {
  const row = topic.workbook!;
  const direct = [...topic.lessons,...topic.draftLessons ?? []];
  return <article className="curriculum-workbook-topic" data-workbook-row={row.row}>
    <div className="curriculum-workbook-topic-heading"><h4><span>{row.lessonNumber}.</span> <Link to={`/curriculum?topic=${topic.id}`}>{topic.title}</Link></h4><span className={row.state === "upcoming" || row.state === "partial" ? "curriculum-status-upcoming" : "curriculum-status-mapping"}>{row.state === "mapped" ? "Lesson links" : row.state === "partial" ? "Partly covered · Upcoming" : row.state === "chapter-resources" ? "Chapter resources" : "Upcoming"}</span></div>
    <p className="curriculum-topic-track">{row.programme} · {row.track}</p>
    {row.sourceIssue && <p className="curriculum-gap-reason">Index placement note: {row.sourceIssue}</p>}
    {row.state === "partial" && <p className="curriculum-gap-reason">{row.reason}</p>}
    <div className="curriculum-topic-links">{direct.map((lesson) => <Link key={lesson.id} to={lesson.route}>{lesson.title}<small>{lesson.status === "Published" ? "Published" : "Draft available · awaiting review"}</small><ArrowRight size={14}/></Link>)}</div>
    {!direct.length && <><p className="curriculum-gap-reason">{row.reason}</p><div className="curriculum-topic-links">{topic.relatedLessons?.map((lesson) => <Link key={lesson.id} to={lesson.route}>{lesson.title}<small>Related chapter resource · {lesson.status === "Published" ? "Published" : "Draft available"}</small><ArrowRight size={14}/></Link>)}</div></>}
    <details className="curriculum-topic-source"><summary>Source and alignment · Workbook row {row.row}</summary><p>{row.reason}</p><p>{row.verification}</p><p>{topic.sourceNote}</p>{topic.sourceUrl && <a href={topic.sourceUrl} target="_blank" rel="noreferrer">View curriculum source ↗</a>}</details>
  </article>;
}
