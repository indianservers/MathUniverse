import { ArrowLeft, ArrowRight, Filter } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getLearningTopic, getLearningTopics, type LearningLessonRef, type LearningSubtopic } from "../learningExperience";

export default function LearnDiscoveryPage() {
  const { topicSlug, subtopicSlug } = useParams();
  const topic = useMemo(() => getLearningTopic(topicSlug), [topicSlug]);
  const allTopics = useMemo(() => getLearningTopics(), []);
  if (!topic) return <LearningNotFound topics={allTopics} />;
  const selectedSubtopic = topic.subtopics.find((subtopic) => subtopic.slug === subtopicSlug) ?? null;

  if (selectedSubtopic) {
    return <SubtopicView topicSlug={topic.slug} topicTitle={topic.title} subtopic={selectedSubtopic} />;
  }

  const totalLessons = topic.subtopics.reduce((sum, subtopic) => sum + subtopic.lessons.length, 0);
  return (
    <div className="learn-topic-page">
      <Link className="learn-back-link" to="/learn"><ArrowLeft className="h-4 w-4" />Learn home</Link>
      <section className={`learn-topic-hero accent-${topic.accent}`}>
        <div>
          <p className="learn-kicker">Main topic</p>
          <h1>{topic.title}</h1>
          <p>{topic.description}</p>
          <div className="learn-topic-stats">
            <span><strong>{topic.subtopics.length}</strong> subtopics</span>
            <span><strong>{totalLessons}</strong> linked lessons</span>
            <span><strong>Predict</strong> before drag</span>
          </div>
        </div>
        <TopicPathwayGraph />
      </section>

      <section className="learn-roadmap" aria-labelledby="roadmap-title">
        <div className="learn-section-heading">
          <div>
            <p className="learn-kicker">Your learning path</p>
            <h2 id="roadmap-title">Follow a structured route, or jump into any subtopic.</h2>
          </div>
          <span>{totalLessons} lessons available</span>
        </div>
        <div className="learn-roadmap-line">
          {topic.subtopics.map((subtopic, index) => (
            <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`} className="learn-roadmap-node">
              <span>{index + 1}</span>
              <strong>{subtopic.title}</strong>
              <small>{subtopic.lessons.length} lessons</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="learn-subtopic-list">
        {topic.subtopics.map((subtopic, index) => (
          <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`} className={`learn-subtopic-row accent-${subtopic.accent}`}>
            <MiniGraph index={index} />
            <div>
              <span>{subtopic.classRange}</span>
              <h2>{subtopic.title}</h2>
              <p>{subtopic.description}</p>
            </div>
            <div className="learn-subtopic-progress">
              <strong>{subtopic.lessons.length}</strong>
              <span>lessons</span>
              <ArrowRight className="h-5 w-5" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

function SubtopicView({ topicSlug, topicTitle, subtopic }: { topicSlug: string; topicTitle: string; subtopic: LearningSubtopic }) {
  const featured = subtopic.lessons[0];
  return (
    <div className="learn-topic-page">
      <Link className="learn-back-link" to={`/learn/${topicSlug}`}><ArrowLeft className="h-4 w-4" />{topicTitle}</Link>
      <section className={`learn-subtopic-hero accent-${subtopic.accent}`}>
        <div>
          <p className="learn-kicker">Subtopic</p>
          <h1>{subtopic.title}</h1>
          <p>{subtopic.description}</p>
          <div className="learn-flow-strip" aria-label="Predict Drag Observe Explain flow">
            {["Predict", "Drag", "Observe", "Explain"].map((step, index) => <span key={step}>{index + 1}. {step}</span>)}
          </div>
          {featured ? <Link className="learn-primary" to={featured.route}>Start first lesson <ArrowRight className="h-4 w-4" /></Link> : null}
        </div>
        <DomainFocusGraph />
      </section>

      <section className="learn-lessons-board" aria-labelledby="lessons-board-title">
        <div className="learn-section-heading">
          <div>
            <p className="learn-kicker">Lessons</p>
            <h2 id="lessons-board-title">{subtopic.lessons.length} real catalog lessons in this lane</h2>
          </div>
          <span><Filter className="h-4 w-4" />Recommended order</span>
        </div>
        <div className="learn-lesson-grid">
          {subtopic.lessons.map((lesson, index) => <LessonTile key={lesson.route} lesson={lesson} index={index} />)}
        </div>
        {subtopic.lessons.length === 0 ? <p className="learn-empty">This subtopic is ready for lessons, but no catalog items matched yet.</p> : null}
      </section>
    </div>
  );
}

function LessonTile({ lesson, index }: { lesson: LearningLessonRef; index: number }) {
  return (
    <Link className="learn-lesson-tile" to={lesson.route}>
      <span className="learn-lesson-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="learn-lesson-kind">{lesson.kind}</span>
      <h3>{lesson.title}</h3>
      <p>{lesson.summary}</p>
      <div>
        <span>{lesson.level}</span>
        <span>{lesson.minutes} min</span>
      </div>
    </Link>
  );
}

function LearningNotFound({ topics }: { topics: ReturnType<typeof getLearningTopics> }) {
  return (
    <div className="learn-topic-page">
      <section className="learn-search-panel">
        <p className="learn-kicker">Topic not found</p>
        <h1>Choose one of the curated learning topics.</h1>
        <div className="learn-search-results">
          {topics.map((topic) => <Link key={topic.slug} className="learn-result" to={`/learn/${topic.slug}`}><span>{topic.subtopics.length} subtopics</span><strong>{topic.title}</strong><p>{topic.description}</p></Link>)}
        </div>
      </section>
    </div>
  );
}

function TopicPathwayGraph() {
  return (
    <div className="learn-topic-visual" aria-hidden="true">
      <svg viewBox="0 0 560 320">
        <rect width="560" height="320" rx="28" fill="#ffffff" opacity=".9" />
        <path d="M60 230 C145 95 205 254 285 142 S438 60 512 154" fill="none" stroke="#7c3aed" strokeWidth="7" strokeLinecap="round" />
        <path d="M83 236 L476 82" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="8 8" />
        {[85, 190, 300, 410, 510].map((x, index) => <circle key={x} cx={x} cy={[205, 165, 142, 92, 154][index]} r="13" fill="#fff" stroke="#4f46e5" strokeWidth="5" />)}
      </svg>
    </div>
  );
}

function MiniGraph({ index }: { index: number }) {
  const paths = [
    "M12 70 C34 20 58 116 82 68 S128 20 152 50",
    "M12 88 L45 62 L78 76 L112 34 L152 42",
    "M12 86 C42 18 112 18 152 86",
    "M12 82 C40 76 58 42 82 39 C118 34 130 72 152 56",
  ];
  return (
    <svg className="learn-mini-graph" viewBox="0 0 164 112" aria-hidden="true">
      <rect width="164" height="112" rx="18" fill="#f8fbff" />
      <path d={paths[index % paths.length]} fill="none" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" />
      <circle cx="82" cy={index % 2 ? 76 : 68} r="7" fill="#06b6d4" />
    </svg>
  );
}

function DomainFocusGraph() {
  return (
    <div className="learn-topic-visual" aria-label="Domain and range subtopic preview" role="img">
      <svg viewBox="0 0 560 320">
        <rect width="560" height="320" rx="28" fill="#ffffff" opacity=".95" />
        <rect x="102" y="110" width="352" height="112" rx="18" fill="#8b5cf6" opacity=".13" />
        <line x1="52" y1="222" x2="510" y2="222" stroke="#0f172a" strokeWidth="2" />
        <line x1="280" y1="52" x2="280" y2="278" stroke="#0f172a" strokeWidth="2" />
        <path d="M104 222 C158 90 240 60 280 86 C342 122 390 168 454 222" fill="none" stroke="#4f46e5" strokeWidth="7" strokeLinecap="round" />
        <path d="M104 222 L104 276 M454 222 L454 276 M280 86 L500 86" stroke="#7c3aed" strokeDasharray="8 8" strokeWidth="2" />
        <circle cx="104" cy="222" r="12" fill="#fff" stroke="#4f46e5" strokeWidth="6" />
        <circle cx="454" cy="222" r="12" fill="#fff" stroke="#4f46e5" strokeWidth="6" />
        <text x="424" y="292" fill="#1e40af" fontSize="18" fontWeight="800">Domain</text>
        <text x="410" y="78" fill="#7c3aed" fontSize="18" fontWeight="800">Range</text>
      </svg>
    </div>
  );
}
