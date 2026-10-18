import { useState } from "react";
import { Link } from "react-router-dom";
import { allLibraryChapters, higherPathways, type StudyStage } from "../data/globalCurriculumPathways";

export default function GlobalCurriculumPathway({stage}: {stage: Exclude<StudyStage, "School">}) {
  const [search, setSearch] = useState("");
  const [expand, setExpand] = useState(false);
  const pathway = higherPathways[stage];
  const chapters = (pathway?.chapters ?? allLibraryChapters).map((chapter) => ({...chapter,
    lessons: chapter.title.toLowerCase().includes(search.toLowerCase()) ? chapter.lessons : chapter.lessons.filter((l) => `${l.title} ${l.summary}`.toLowerCase().includes(search.toLowerCase())),
  })).filter((chapter) => !search || chapter.lessons.length || chapter.title.toLowerCase().includes(search.toLowerCase()));
  return <section className="curriculum-browser" aria-label={`${stage} mathematics`}>
    <h2>{stage === "Complete library" ? "Every chapter and lesson in the library" : `${stage} mathematics`}</h2>
    <p>{pathway?.note ?? "All registered lessons, grouped by mathematics subject. Published lessons and available authored drafts are shown separately by status."}</p>
    {pathway && <p><a href={pathway.source} target="_blank" rel="noreferrer">University source ↗</a> · Checked 17 October 2026</p>}
    <div className="curriculum-filters"><input aria-label="Search pathway lessons" placeholder="Search all chapter and lesson names" value={search} onChange={(e) => setSearch(e.target.value)}/><button onClick={() => setExpand(!expand)}>{expand ? "Collapse all" : "Expand all"}</button></div>
    <p>{chapters.length} subjects · {new Set(chapters.flatMap((c) => c.lessons.map((l) => l.id))).size} lesson links</p>
    {chapters.map((chapter) => <details className="curriculum-chapter" key={`${stage}-${chapter.title}-${expand}`} open={expand || !!search}>
      <summary><strong>{chapter.title}</strong><span>{chapter.lessons.length} lessons</span></summary>
      <div className="curriculum-chapter-content">{chapter.note && <p>{chapter.note}</p>}
        {!chapter.lessons.length && <p className="curriculum-status-upcoming">Upcoming · Specific course lessons are missing</p>}
        <div className="curriculum-lesson-grid">{chapter.lessons.map((lesson) => <Link className="curriculum-lesson" key={lesson.id} to={lesson.route}><span><strong>{lesson.title}</strong><small>{lesson.status === "Published" ? "Published" : "Draft available · awaiting review"} · {lesson.minutes} min</small></span></Link>)}</div>
      </div>
    </details>)}
    {!chapters.length && <p>No matching chapters or lessons.</p>}
  </section>;
}
