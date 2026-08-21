import { ArrowRight, BookOpen, GraduationCap, Layers3, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { lessonCategories } from "../catalog/lessonCatalog";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import { allLearningLessonRefs, getFeaturedLesson, getLearningTopics, getLessonTotals, type LearningLessonRef, type LearningTopic } from "../learningExperience";

export default function LessonsHomePage() {
  const [query, setQuery] = useState("");
  const topics = useMemo(() => getLearningTopics(), []);
  const featuredLesson = useMemo(() => getFeaturedLesson(), []);
  const totals = useMemo(() => getLessonTotals(), []);
  const allLessons = useMemo(() => allLearningLessonRefs(), []);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return allLessons.filter((lesson) => [lesson.title, lesson.topic, lesson.level, lesson.summary].join(" ").toLowerCase().includes(normalized)).slice(0, 18);
  }, [allLessons, query]);

  return (
    <div className="learn-journey" data-testid="lessons-home">
      <section className="learn-hero">
        <div className="learn-hero-copy">
          <p className="learn-kicker">MathSphere learning universe</p>
          <h1>Live mathematics becomes the visual hero.</h1>
          <p>
            Choose a topic, enter a curated pathway, and learn through interactive graphs, projections, overlays, and the Predict - Drag - Observe - Explain flow.
          </p>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to="/learn/functions-and-graphs">Explore Functions & Graphs <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="/curriculum">Open curriculum map</Link>
          </div>
          <div className="learn-totals" aria-label="Lesson inventory totals">
            <strong>{totals.total}</strong><span>lessons</span>
            <strong>{totals.interactive}</strong><span>interactive</span>
            <strong>{totals.school}</strong><span>school</span>
            <strong>{totals.advanced}</strong><span>advanced</span>
          </div>
        </div>
        <LiveHeroGraph />
      </section>

      <section className="learn-search-panel" aria-labelledby="learn-search-title">
        <div>
          <p className="learn-kicker">Find anything</p>
          <h2 id="learn-search-title">Search the full lesson library</h2>
        </div>
        <label className="learn-search">
          <Search className="h-5 w-5" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, lessons, class, outcomes..." />
          {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear lesson search"><X className="h-4 w-4" /></button> : null}
        </label>
        {query.trim() ? (
          <div className="learn-search-results">
            {results.map((lesson) => <LessonResult key={lesson.route} lesson={lesson} />)}
            {results.length === 0 ? <p className="learn-empty">No lesson matches that search yet.</p> : null}
          </div>
        ) : null}
      </section>

      <section className="learn-pathway" aria-labelledby="learning-path-title">
        <div className="learn-section-heading">
          <div>
            <p className="learn-kicker">Curated visual learning pathway</p>
            <h2 id="learning-path-title">Start with the big ideas, then drill into lessons.</h2>
          </div>
          <Link to="/lessons/school">School pathways <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="learn-topic-mosaic">
          {topics.map((topic, index) => <TopicCard key={topic.slug} topic={topic} featured={index === 2} />)}
        </div>
      </section>

      <section className="learn-flagship" aria-labelledby="flagship-title">
        <div>
          <p className="learn-kicker">Flagship immersive lesson</p>
          <h2 id="flagship-title">Understanding Domain and Range</h2>
          <p>Predict how endpoints affect a graph, drag the model, observe domain and range projections, then explain what changed.</p>
          <Link className="learn-primary" to={featuredLesson?.route ?? "/learn/functions-and-graphs/relations-and-functions"}>Launch immersive lesson <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <DomainRangePreview />
      </section>

      <section className="learn-browse" aria-labelledby="browse-title">
        <div className="learn-section-heading">
          <div>
            <p className="learn-kicker">Everything is still reachable</p>
            <h2 id="browse-title">Browse by class, source, or legacy category.</h2>
          </div>
        </div>
        <div className="learn-browse-grid">
          <Link to="/lessons/school" className="learn-browse-card"><GraduationCap className="h-5 w-5" /><strong>School Curriculum</strong><span>{schoolLessonCatalog.length} class-linked lessons</span></Link>
          <Link to="/lessons/advanced-concepts" className="learn-browse-card"><Layers3 className="h-5 w-5" /><strong>Advanced Concepts</strong><span>Proof-rich university extensions</span></Link>
          {lessonCategories.map((category) => (
            <Link key={category.slug} to={`/lessons/${category.slug}`} className="learn-browse-card">
              <BookOpen className="h-5 w-5" />
              <strong>{category.title}</strong>
              <span>{category.count} lessons</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function TopicCard({ topic, featured }: { topic: LearningTopic; featured?: boolean }) {
  const count = topic.subtopics.reduce((sum, subtopic) => sum + subtopic.lessons.length, 0);
  return (
    <Link className={featured ? `learn-topic-card is-featured accent-${topic.accent}` : `learn-topic-card accent-${topic.accent}`} to={`/learn/${topic.slug}`}>
      <span className="learn-topic-count">{count} lessons</span>
      <h3>{topic.title}</h3>
      <p>{topic.description}</p>
      <div className="learn-topic-strip">
        {topic.subtopics.slice(0, 3).map((subtopic) => <span key={subtopic.slug}>{subtopic.title}</span>)}
      </div>
      <ArrowRight className="learn-topic-arrow h-5 w-5" />
    </Link>
  );
}

function LessonResult({ lesson }: { lesson: LearningLessonRef }) {
  return (
    <Link className="learn-result" to={lesson.route}>
      <span>{lesson.kind} - {lesson.topic}</span>
      <strong>{lesson.title}</strong>
      <p>{lesson.summary}</p>
    </Link>
  );
}

function LiveHeroGraph() {
  return (
    <div className="learn-hero-visual" aria-label="Animated function graph preview" role="img">
      <div className="learn-equation-pill">f(x) = x^3 - 3x + 2</div>
      <svg viewBox="0 0 620 420">
        <defs>
          <linearGradient id="learnHeroStroke" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <pattern id="learnGrid" width="38" height="38" patternUnits="userSpaceOnUse">
            <path d="M 38 0 L 0 0 0 38" fill="none" stroke="#dbeafe" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="620" height="420" rx="28" fill="#ffffff" />
        <rect x="18" y="18" width="584" height="384" rx="22" fill="url(#learnGrid)" />
        <line x1="80" y1="310" x2="560" y2="310" stroke="#0f172a" strokeWidth="2" />
        <line x1="300" y1="55" x2="300" y2="360" stroke="#0f172a" strokeWidth="2" />
        <path d="M 75 258 C 138 174 176 332 238 277 C 295 225 284 90 358 122 C 448 160 438 360 555 204" fill="none" stroke="url(#learnHeroStroke)" strokeWidth="7" strokeLinecap="round" />
        <path d="M 136 207 L 136 310 M 358 122 L 358 310 M 555 204 L 555 310" stroke="#7c3aed" strokeDasharray="8 8" strokeWidth="2" />
        {[136, 358, 555].map((x, index) => <circle key={x} cx={x} cy={[207, 122, 204][index]} r="10" fill="#ffffff" stroke="#4f46e5" strokeWidth="6" />)}
        <path d="M 250 330 C 320 390 450 385 540 340" fill="none" stroke="#93c5fd" strokeWidth="2" strokeDasharray="5 8" />
      </svg>
    </div>
  );
}

function DomainRangePreview() {
  return (
    <div className="learn-domain-preview" aria-label="Domain and range graph preview" role="img">
      <svg viewBox="0 0 560 360">
        <rect width="560" height="360" rx="24" fill="#f8fbff" />
        {Array.from({ length: 12 }, (_, index) => <line key={`v-${index}`} x1={40 + index * 42} x2={40 + index * 42} y1="35" y2="315" stroke="#dbeafe" />)}
        {Array.from({ length: 7 }, (_, index) => <line key={`h-${index}`} x1="35" x2="520" y1={55 + index * 42} y2={55 + index * 42} stroke="#dbeafe" />)}
        <rect x="112" y="124" width="320" height="128" rx="18" fill="#8b5cf6" opacity=".12" />
        <rect x="252" y="84" width="44" height="168" rx="16" fill="#06b6d4" opacity=".18" />
        <line x1="58" y1="252" x2="500" y2="252" stroke="#0f172a" strokeWidth="2" />
        <line x1="274" y1="48" x2="274" y2="315" stroke="#0f172a" strokeWidth="2" />
        <path d="M 112 252 C 164 104 242 67 274 84 C 336 118 374 176 432 252" fill="none" stroke="#4f46e5" strokeWidth="6" strokeLinecap="round" />
        <circle cx="112" cy="252" r="11" fill="#fff" stroke="#4f46e5" strokeWidth="6" />
        <circle cx="274" cy="84" r="9" fill="#4f46e5" />
        <circle cx="432" cy="252" r="11" fill="#fff" stroke="#4f46e5" strokeWidth="6" />
      </svg>
      <div className="learn-preview-chip">Domain [-4, 4]</div>
      <div className="learn-preview-chip is-secondary">Range [-2, 2]</div>
    </div>
  );
}
