import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Compass,
  Filter,
  PenLine,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useMemo, type CSSProperties } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { advancedConceptLessons } from "../catalog/advanced/advancedConceptLessons";
import { lessonCategories } from "../catalog/lessonCatalog";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import { allLearningLessonRefs, getFeaturedLesson, getLearningTopics, getLessonTotals, type LearningLessonRef, type LearningTopic } from "../learningExperience";

const iconBase = "/assets/lesson-topic-icons";

const topicIcons: Record<string, string> = {
  "numbers-and-arithmetic": `${iconBase}/04-numbers-and-arithmetic.png`,
  algebra: `${iconBase}/08-algebra.png`,
  "functions-and-graphs": `${iconBase}/07-graphs-and-functions.png`,
  geometry: `${iconBase}/09-geometry.png`,
  trigonometry: `${iconBase}/10-trigonometry.png`,
  calculus: `${iconBase}/12-calculus.png`,
  "statistics-and-probability": `${iconBase}/14-statistics-and-probability.png`,
  "vectors-and-3d-mathematics": `${iconBase}/17-vectors-and-3d-mathematics.png`,
  "discrete-and-applied-mathematics": `${iconBase}/18-discrete-and-applied-mathematics.png`,
  "advanced-mathematics": `${iconBase}/15-advanced-mathematics.png`,
};

const learningTypeFilters = [
  { id: "learn", label: "Learn", description: "Structured explanations that make the idea click.", icon: BookOpen, terms: ["concept", "understand", "explain", "definition"] },
  { id: "explore", label: "Explore", description: "Interactive tools for experimenting freely.", icon: Compass, terms: ["explore", "visual", "dynamic", "lab"] },
  { id: "practice", label: "Practice", description: "Guided repetition with clear feedback.", icon: PenLine, terms: ["practice", "solve", "exercise", "check"] },
  { id: "challenge", label: "Challenge", description: "Stretch problems for confident learners.", icon: Trophy, terms: ["challenge", "proof", "advanced", "problem"] },
  { id: "investigation", label: "Investigation", description: "Inquiry paths that build evidence.", icon: Search, terms: ["investigate", "compare", "reason", "model"] },
  { id: "visual-proof", label: "Visual Proof", description: "Proof ideas shown through diagrams.", icon: Target, terms: ["proof", "theorem", "derive", "justify"] },
  { id: "assessment", label: "Assessment", description: "Checks and quizzes to track progress.", icon: ClipboardCheck, terms: ["assessment", "test", "quiz", "checkpoint"] },
  { id: "revision", label: "Revision", description: "Refresh important ideas before moving on.", icon: RefreshCw, terms: ["review", "revision", "recall", "summary"] },
] as const;

const visualToolOptions = ["2D Graph", "3D Graph", "2D Geometry", "3D Geometry", "CAS/Data", "Multiple Tools", "No Engine"];
type LessonsLandingView = "pathway" | "topics" | "curriculum";

const searchGoalChips = [
  { label: "Start with graphs", params: { topic: "Functions", tool: "2D Graph", type: "explore" }, note: "Curves, domain, range" },
  { label: "Build algebra fluency", params: { topic: "Expressions and Manipulation", tool: "CAS/Data", type: "learn" }, note: "Symbols with steps" },
  { label: "Geometry by dragging", params: { topic: "Coordinate Geometry", tool: "2D Geometry", type: "explore" }, note: "Points and measures" },
  { label: "Exam practice", params: { type: "practice" }, note: "Short guided checks" },
  { label: "Visual proofs", params: { type: "visual-proof" }, note: "Reason from diagrams" },
  { label: "Advanced challenge", params: { class: "Advanced", type: "challenge" }, note: "Proof-rich topics" },
] as const;

const classBandShortcuts = [
  { label: "Class 6-8", value: "CLASS 6", text: "Foundation route" },
  { label: "Class 9-10", value: "CLASS 10", text: "Board-ready concepts" },
  { label: "Class 11-12", value: "CLASS 12", text: "Senior syllabus" },
  { label: "Advanced", value: "Advanced", text: "Beyond school" },
] as const;

const visualToolShortcuts = [
  { label: "2D Graph", text: "Functions, slope, domain", value: "2D Graph" },
  { label: "2D Geometry", text: "Points, shapes, constructions", value: "2D Geometry" },
  { label: "3D Graph", text: "Surfaces and slices", value: "3D Graph" },
  { label: "CAS/Data", text: "Exact steps and tables", value: "CAS/Data" },
] as const;

export default function LessonsHomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topics = useMemo(() => getLearningTopics(), []);
  const featuredLesson = useMemo(() => getFeaturedLesson(), []);
  const totals = useMemo(() => getLessonTotals(), []);
  const allLessons = useMemo(() => allLearningLessonRefs(), []);
  const topicOptions = useMemo(() => Array.from(new Set(allLessons.map((lesson) => lesson.topic))).sort((a, b) => a.localeCompare(b)).slice(0, 80), [allLessons]);
  const classOptions = useMemo(() => Array.from(new Set(allLessons.map((lesson) => lesson.level))).sort((a, b) => a.localeCompare(b)), [allLessons]);

  const query = searchParams.get("q") ?? "";
  const selectedClass = searchParams.get("class") ?? "";
  const selectedTopic = searchParams.get("topic") ?? "";
  const selectedType = searchParams.get("type") ?? "";
  const selectedTool = searchParams.get("tool") ?? "";
  const rawView = searchParams.get("view");
  const selectedView: LessonsLandingView = rawView === "topics" || rawView === "curriculum" ? rawView : "pathway";

  const filteredLessonMatches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allLessons
      .filter((lesson) => !normalized || searchableText(lesson).includes(normalized))
      .filter((lesson) => !selectedClass || lesson.level === selectedClass)
      .filter((lesson) => !selectedTopic || lesson.topic === selectedTopic)
      .filter((lesson) => !selectedType || learningTypeFor(lesson) === selectedType)
      .filter((lesson) => !selectedTool || visualToolFor(lesson) === selectedTool);
  }, [allLessons, query, selectedClass, selectedTopic, selectedType, selectedTool]);
  const filteredLessons = filteredLessonMatches.slice(0, 18);

  const hasActiveFilters = Boolean(query || selectedClass || selectedTopic || selectedType || selectedTool);
  const functionsTopic = topics.find((topic) => topic.slug === "functions-and-graphs") ?? topics[0];
  const functionsCount = countTopicLessons(functionsTopic);

  function updateFilter(key: string, value: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  }

  return (
    <main className="learn-journey lessons-landing" data-testid="lessons-home">
      <section className="learn-hero lessons-landing-hero" aria-labelledby="lessons-hero-title">
        <div className="learn-hero-copy">
          <p className="learn-kicker">Interactive mathematics</p>
          <h1 id="lessons-hero-title">Mathematics you can see, touch, and understand.</h1>
          <p>Explore visual proofs, dynamic graphs, interactive simulations, guided practice, and challenges that turn abstract ideas into visible mathematical experiences.</p>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to="#lesson-search">Explore lessons <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="/curriculum"><BookOpen className="h-4 w-4" />Open curriculum</Link>
          </div>
          <ContinueLearningCard lesson={featuredLesson} />
        </div>
        <LiveHeroGraph />
      </section>

      <section id="lesson-search" className="lessons-finder" aria-labelledby="learn-search-title">
        <div className="lessons-finder-head">
          <div>
            <p className="learn-kicker">Find your next concept</p>
            <h2 id="learn-search-title">Search lessons, classes, outcomes, and visual tools.</h2>
          </div>
          {hasActiveFilters ? <button className="learn-clear-button" type="button" onClick={() => setSearchParams(new URLSearchParams())}><X className="h-4 w-4" />Clear filters</button> : null}
        </div>
        <label className="learn-search lessons-search">
          <Search className="h-5 w-5" />
          <input value={query} onChange={(event) => updateFilter("q", event.target.value)} placeholder="Search topics, lessons, classes, outcomes..." />
          <span className="lessons-search-key">Ctrl K</span>
        </label>
        <SearchCommandCenter />
        <div className="lessons-filter-row" aria-label="Lesson filters">
          <FilterSelect label="Class" value={selectedClass} options={classOptions} onChange={(value) => updateFilter("class", value)} />
          <FilterSelect label="Topic" value={selectedTopic} options={topicOptions} onChange={(value) => updateFilter("topic", value)} />
          <FilterSelect label="Learning Type" value={selectedType} options={learningTypeFilters.map((type) => type.id)} labels={Object.fromEntries(learningTypeFilters.map((type) => [type.id, type.label]))} onChange={(value) => updateFilter("type", value)} />
          <FilterSelect label="Visual Tool" value={selectedTool} options={visualToolOptions} onChange={(value) => updateFilter("tool", value)} />
          <Filter className="lessons-filter-icon h-5 w-5" aria-hidden="true" />
        </div>
        <ActiveFilterChips query={query} selectedClass={selectedClass} selectedTopic={selectedTopic} selectedType={selectedType} selectedTool={selectedTool} />
        <div className="lessons-summary-line" aria-label="Lesson inventory totals">
          <Sparkles className="h-5 w-5" />
          <strong>{totals.total}</strong><span>lessons</span>
          <strong>{totals.interactive}</strong><span>interactive</span>
          <strong>{totals.school}</strong><span>school</span>
          <strong>{totals.advanced}</strong><span>advanced</span>
        </div>
        <SearchShortcutDeck />
        {hasActiveFilters ? (
          <div className="lessons-results-wrap" aria-live="polite">
            <div className="lessons-results-head">
              <div>
                <span>Search results</span>
                <strong>{filteredLessonMatches.length} matching lessons</strong>
              </div>
              <small>Showing best {filteredLessons.length}. Refine class, topic, type, or tool to narrow faster.</small>
            </div>
            <div className="learn-search-results lessons-results">
              {filteredLessons.map((lesson, index) => <LessonResult key={lesson.route} lesson={lesson} index={index} />)}
            </div>
            {filteredLessons.length === 0 ? <p className="learn-empty">No lesson matches those filters yet.</p> : null}
          </div>
        ) : null}
      </section>

      <section id="pathways" className="lessons-pathway" aria-labelledby="learning-path-title">
        <div className="learn-section-heading">
          <div>
            <p className="learn-kicker">Curated learning pathways</p>
            <h2 id="learning-path-title">{landingViewHeading(selectedView)}</h2>
            <p>{landingViewDescription(selectedView)}</p>
          </div>
          <div className="lessons-view-switch" aria-label="Landing page views">
            <Link className={selectedView === "pathway" ? "is-active" : undefined} aria-current={selectedView === "pathway" ? "page" : undefined} to="/lessons?view=pathway#pathways">Pathway</Link>
            <Link className={selectedView === "topics" ? "is-active" : undefined} aria-current={selectedView === "topics" ? "page" : undefined} to="/lessons?view=topics#pathways">Topics</Link>
            <Link className={selectedView === "curriculum" ? "is-active" : undefined} aria-current={selectedView === "curriculum" ? "page" : undefined} to="/lessons?view=curriculum#pathways">Curriculum</Link>
          </div>
        </div>
        <LandingViewPanel view={selectedView} topics={topics} functionsCount={functionsCount} />
      </section>

      <section id="topics" className="learn-pathway lessons-topics" aria-labelledby="topics-title">
        <div className="learn-section-heading">
          <div>
            <p className="learn-kicker">Explore the mathematical universe</p>
            <h2 id="topics-title">Ten connected concept worlds, each with its own visual language.</h2>
          </div>
        </div>
        <div className="learn-topic-mosaic lessons-topic-bento">
          {topics.map((topic) => <TopicCard key={topic.slug} topic={topic} />)}
        </div>
      </section>

      <section className="learn-flagship lessons-flagship" aria-labelledby="flagship-title">
        <div className="lessons-flagship-stage">
          <p className="learn-kicker">Flagship immersive lesson</p>
          <h2 id="flagship-title">Understanding Domain and Range</h2>
          <p>Predict. Drag. Observe. Explain.</p>
          <DomainRangePreview />
        </div>
        <aside className="lessons-guided-panel" aria-label="Guided domain and range lesson steps">
          <div className="lessons-step-dots" aria-label="Step 2 of 5"><span /><span className="is-active" /><span /><span /><span /></div>
          <h3>Predict the range</h3>
          <p>Based on the graph's highest and lowest points, predict the range. Then drag the vertical projection handles to match.</p>
          {["Predict", "Drag", "Observe", "Explain"].map((step, index) => (
            <div className={index === 1 ? "lessons-flow-step is-active" : "lessons-flow-step"} key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
              <small>{["Make your prediction", "Adjust the projection", "See what changes", "Justify your thinking"][index]}</small>
            </div>
          ))}
          <Link className="learn-primary" to={featuredLesson?.route ?? "/lessons/graphs-and-functions/144-domain-and-range?v_x=-4&v_h=1"}>Launch immersive lesson <ArrowRight className="h-4 w-4" /></Link>
          <Link className="learn-secondary" to="/learn/functions-and-graphs/relations-and-functions">Preview in practice mode</Link>
        </aside>
      </section>

      <section className="lessons-learning-types" aria-labelledby="learning-types-title">
        <div className="learn-section-heading">
          <div>
            <p className="learn-kicker">Learn your way</p>
            <h2 id="learning-types-title">Eight experiences. One connected concept.</h2>
          </div>
        </div>
        <div className="lessons-type-grid">
          {learningTypeFilters.map((type) => <LearningTypeCard key={type.id} type={type} count={countLearningType(allLessons, type.id)} />)}
        </div>
      </section>

      <section className="learn-browse lessons-collections" aria-labelledby="browse-title">
        <div className="learn-section-heading">
          <div>
            <p className="learn-kicker">Collections</p>
            <h2 id="browse-title">Browse by curriculum and collection</h2>
          </div>
        </div>
        <div className="lessons-collection-grid">
          <CollectionCard to="/lessons/school" icon={`${iconBase}/01-school-curriculum.png`} title="School Curriculum" text={`${schoolLessonCatalog.length} class-linked lessons`} />
          <CollectionCard to="/lessons/advanced-concepts" icon={`${iconBase}/02-advanced-concepts.png`} title="Advanced Concepts" text={`${advancedConceptLessons.length} university extensions`} />
          <CollectionCard to="/math-lab/graphing-calculator" icon={`${iconBase}/03-core-workspaces.png`} title="Visual Workspaces" text="2D - 3D - CAS - Graphing" />
          <CollectionCard to={`/lessons/${lessonCategories[0]?.slug ?? "calculator-and-arithmetic"}`} icon={`${iconBase}/06-platform-capabilities.png`} title="Legacy Library" text="Every original route preserved" />
        </div>
      </section>
    </main>
  );
}

function SearchCommandCenter() {
  return (
    <div className="lessons-command-center" aria-label="Search shortcuts and guided starts">
      <div className="lessons-command-card is-wide">
        <span>Try a smart search</span>
        <div className="lessons-suggestion-row">
          {["domain and range", "cosine rule", "factorisation", "surface area", "probability"].map((term) => (
            <Link key={term} to={`/lessons?q=${encodeURIComponent(term)}#lesson-search`}>{term}</Link>
          ))}
        </div>
      </div>
      <div className="lessons-command-card">
        <span>Best next move</span>
        <strong>Pick a goal first</strong>
        <small>Then filter only if needed.</small>
      </div>
      <div className="lessons-command-card">
        <span>Visual promise</span>
        <strong>Every result shows its engine</strong>
        <small>Graph, geometry, CAS, data, or no engine.</small>
      </div>
    </div>
  );
}

function ActiveFilterChips({ query, selectedClass, selectedTopic, selectedType, selectedTool }: { query: string; selectedClass: string; selectedTopic: string; selectedType: string; selectedTool: string }) {
  const chips = [
    query ? ["Search", query] : null,
    selectedClass ? ["Class", selectedClass] : null,
    selectedTopic ? ["Topic", selectedTopic] : null,
    selectedType ? ["Type", learningTypeFilters.find((type) => type.id === selectedType)?.label ?? selectedType] : null,
    selectedTool ? ["Tool", selectedTool] : null,
  ].filter(Boolean) as string[][];
  if (!chips.length) {
    return <div className="lessons-active-chips"><span>No filters yet</span><strong>Use shortcuts below to jump quickly.</strong></div>;
  }
  return (
    <div className="lessons-active-chips" aria-label="Active lesson filters">
      {chips.map(([label, value]) => <span key={`${label}-${value}`}>{label}: <strong>{value}</strong></span>)}
      <Link to="/lessons#lesson-search">Reset search</Link>
    </div>
  );
}

function SearchShortcutDeck() {
  return (
    <div className="lessons-shortcut-deck" aria-label="Fast lesson navigation shortcuts">
      <section>
        <h3>Goal shortcuts</h3>
        <div className="lessons-goal-grid">
          {searchGoalChips.map((chip) => (
            <Link key={chip.label} to={`/lessons?${new URLSearchParams(chip.params).toString()}#lesson-search`}>
              <strong>{chip.label}</strong>
              <span>{chip.note}</span>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h3>Class routes</h3>
        <div className="lessons-mini-grid">
          {classBandShortcuts.map((item) => (
            <Link key={item.label} to={`/lessons?class=${encodeURIComponent(item.value)}#lesson-search`}>
              <strong>{item.label}</strong>
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h3>Visual tools</h3>
        <div className="lessons-mini-grid">
          {visualToolShortcuts.map((item) => (
            <Link key={item.label} to={`/lessons?tool=${encodeURIComponent(item.value)}#lesson-search`}>
              <strong>{item.label}</strong>
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function landingViewHeading(view: LessonsLandingView) {
  if (view === "topics") return "Browse concept worlds without losing the learning path.";
  if (view === "curriculum") return "Move from class syllabus to visual lessons quickly.";
  return "Choose a path. Build real mathematical intuition.";
}

function landingViewDescription(view: LessonsLandingView) {
  if (view === "topics") return "Jump into any mathematical world, compare lesson counts, and open the topic pathway directly.";
  if (view === "curriculum") return "Use school, advanced, visual workspace, and legacy collections as clear routes into the same lesson ecosystem.";
  return "Follow handpicked lessons and labs, or browse topics freely. Your journey, your way.";
}

function LandingViewPanel({ view, topics, functionsCount }: { view: LessonsLandingView; topics: LearningTopic[]; functionsCount: number }) {
  if (view === "topics") {
    return (
      <div className="lessons-tab-panel lessons-tab-topics" aria-label="Topics tab content">
        <div className="lessons-tab-intro">
          <strong>All topic worlds</strong>
          <span>{topics.length} connected areas with visual-first lesson pathways</span>
        </div>
        <div className="lessons-tab-topic-grid">
          {topics.map((topic) => (
            <Link key={topic.slug} className={`lessons-tab-topic accent-${topic.accent}`} to={`/learn/${topic.slug}`}>
              <img src={topicIcons[topic.slug]} alt="" loading="lazy" />
              <span>{countTopicLessons(topic)} lessons</span>
              <strong>{topic.title}</strong>
              <small>{topic.subtopics.slice(0, 2).map((subtopic) => subtopic.title).join(" + ")}</small>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (view === "curriculum") {
    return (
      <div className="lessons-tab-panel lessons-tab-curriculum" aria-label="Curriculum tab content">
        <div className="lessons-curriculum-summary">
          <strong>{schoolLessonCatalog.length}</strong>
          <span>school lessons mapped to class pathways, plus advanced extensions and reusable visual workspaces.</span>
        </div>
        <div className="lessons-curriculum-grid">
          <CollectionCard to="/lessons/school" icon={`${iconBase}/01-school-curriculum.png`} title="School Curriculum" text="Class-linked school pathways" />
          <CollectionCard to="/curriculum" icon={`${iconBase}/02-advanced-concepts.png`} title="Curriculum Map" text="Browse syllabus structure" />
          <CollectionCard to="/lessons/advanced-concepts" icon={`${iconBase}/15-advanced-mathematics.png`} title="Advanced Concepts" text={`${advancedConceptLessons.length} enrichment lessons`} />
          <CollectionCard to="/math-lab/graphing-calculator" icon={`${iconBase}/03-core-workspaces.png`} title="Visual Workspaces" text="2D, 3D, CAS, and graphing labs" />
        </div>
      </div>
    );
  }

  return (
    <div className="lessons-featured-path" aria-label="Pathway tab content">
      <div className="lessons-progress-ring" style={{ "--progress": "0deg" } as CSSProperties}>
        <span>Start</span>
      </div>
      <div>
        <h3>Master Functions &amp; Graphs</h3>
        <p>{functionsCount} real lessons across relations, linear functions, quadratics, exponentials, and transformations.</p>
        <Link className="learn-primary" to="/learn/functions-and-graphs">Start pathway <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <PathwayCurve />
    </div>
  );
}

function FilterSelect({ label, value, options, labels, onChange }: { label: string; value: string; options: string[]; labels?: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <label className="lessons-filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => <option key={option} value={option}>{labels?.[option] ?? option}</option>)}
      </select>
    </label>
  );
}

function ContinueLearningCard({ lesson }: { lesson: LearningLessonRef | null }) {
  if (!lesson) return null;
  return (
    <Link className="lessons-continue" to={lesson.route} aria-label={`Start recommended lesson ${lesson.title}`}>
      <span className="lessons-continue-ring">Start</span>
      <div>
        <small>Recommended start</small>
        <strong>{lesson.title}</strong>
        <span>{lesson.minutes} min guided lesson</span>
      </div>
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
}

function TopicCard({ topic, featured }: { topic: LearningTopic; featured?: boolean }) {
  const count = countTopicLessons(topic);
  return (
    <Link className={featured ? `learn-topic-card is-featured accent-${topic.accent}` : `learn-topic-card accent-${topic.accent}`} to={`/learn/${topic.slug}`} aria-label={`Explore ${topic.title}, ${count} lessons`}>
      <img className="lessons-topic-icon" src={topicIcons[topic.slug]} alt="" loading="lazy" />
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

function LessonResult({ lesson, index }: { lesson: LearningLessonRef; index: number }) {
  const tool = visualToolFor(lesson);
  const type = learningTypeFilters.find((item) => item.id === learningTypeFor(lesson))?.label ?? learningTypeFor(lesson);
  return (
    <Link className="learn-result" to={lesson.route}>
      <span>#{String(index + 1).padStart(2, "0")} - {type} - {tool}</span>
      <strong>{lesson.title}</strong>
      <p>{lesson.summary}</p>
      <div className="lessons-result-meta">
        <small>{lesson.level}</small>
        <small>{lesson.minutes} min</small>
        <small>{lesson.topic}</small>
      </div>
    </Link>
  );
}

function LearningTypeCard({ type, count }: { type: (typeof learningTypeFilters)[number]; count: number }) {
  const Icon = type.icon;
  return (
    <Link className="lessons-type-card" to={`/lessons?type=${type.id}`} aria-label={`Browse ${count} ${type.label} resources`}>
      <Icon className="h-8 w-8" />
      <strong>{type.label}</strong>
      <p>{type.description}</p>
      <span>{count} resources <ArrowRight className="h-4 w-4" /></span>
    </Link>
  );
}

function CollectionCard({ to, icon, title, text }: { to: string; icon: string; title: string; text: string }) {
  return (
    <Link className="lessons-collection-card" to={to}>
      <img src={icon} alt="" loading="lazy" />
      <strong>{title}</strong>
      <span>{text}</span>
      <ArrowRight className="h-5 w-5" />
    </Link>
  );
}

function LiveHeroGraph() {
  return (
    <div className="learn-hero-visual lessons-hero-visual" aria-label="A smooth function curve between x equals negative four and x equals six with highlighted local maximum, local minimum, endpoint, domain projection, and range projection." role="img">
      <div className="learn-equation-pill">y = 0.5x^3 - 2x</div>
      <svg viewBox="0 0 680 460">
        <defs>
          <linearGradient id="lessonsHeroStroke" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="55%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <pattern id="lessonsHeroGrid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#dbeafe" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="680" height="460" rx="28" fill="#ffffff" />
        <rect x="28" y="28" width="624" height="360" rx="22" fill="url(#lessonsHeroGrid)" />
        <line x1="55" y1="232" x2="632" y2="232" stroke="#0f172a" strokeWidth="2" />
        <line x1="340" y1="46" x2="340" y2="374" stroke="#0f172a" strokeWidth="2" />
        <path d="M 126 124 C 192 78 278 156 318 232 C 374 340 438 350 504 250 C 548 184 580 137 611 101" fill="none" stroke="url(#lessonsHeroStroke)" strokeWidth="7" strokeLinecap="round" />
        <path d="M 154 113 L 154 332 L 611 332 M 504 320 L 504 232 M 611 101 L 611 332" fill="none" stroke="#7c3aed" strokeDasharray="8 8" strokeWidth="2" />
        <circle cx="154" cy="113" r="12" fill="#fff" stroke="#7c3aed" strokeWidth="7" />
        <circle cx="504" cy="320" r="12" fill="#fff" stroke="#06b6d4" strokeWidth="7" />
        <circle cx="611" cy="101" r="12" fill="#fff" stroke="#06b6d4" strokeWidth="7" />
        <rect x="126" y="342" width="174" height="36" rx="13" fill="#f3e8ff" stroke="#ddd6fe" />
        <text x="147" y="365" fill="#6d28d9" fontSize="16" fontWeight="800">Domain [-4, 6]</text>
        <rect x="448" y="342" width="156" height="36" rx="13" fill="#ecfeff" stroke="#bae6fd" />
        <text x="470" y="365" fill="#0891b2" fontSize="16" fontWeight="800">Range [-3, 3]</text>
        <rect x="40" y="404" width="600" height="38" rx="16" fill="#f8fbff" stroke="#dbe6fb" />
        <text x="62" y="428" fill="#334155" fontSize="15">Adjust coefficient a</text>
        <text x="282" y="428" fill="#2563eb" fontSize="15" fontWeight="900">a = 0.50</text>
        <line x1="398" y1="423" x2="590" y2="423" stroke="#c7d2fe" strokeWidth="6" strokeLinecap="round" />
        <circle cx="486" cy="423" r="11" fill="#4f46e5" stroke="#fff" strokeWidth="4" />
      </svg>
    </div>
  );
}

function PathwayCurve() {
  const nodes = [
    ["Relations", 42, 74],
    ["Linear", 150, 95],
    ["Quadratic", 270, 62],
    ["Exponential", 390, 120],
    ["Transformations", 500, 86],
  ] as const;
  return (
    <svg className="lessons-path-curve" viewBox="0 0 580 170" role="img" aria-label="Functions and graphs pathway curve from relations through transformations">
      <path d="M42 74 C120 114 200 112 270 62 C345 9 390 146 520 86" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
      {nodes.map(([label, x, y], index) => (
        <g key={label}>
          <circle cx={x} cy={y} r="10" fill="#fff" stroke={index < 2 ? "#7c3aed" : "#06b6d4"} strokeWidth="5" />
          <text x={x - 28} y={y + 36} fill="#172554" fontSize="12" fontWeight="900">{label}</text>
        </g>
      ))}
    </svg>
  );
}

function DomainRangePreview() {
  return (
    <div className="learn-domain-preview lessons-domain-preview" aria-label="Upward parabola y equals x squared over four minus two with open endpoints at x equals negative four and x equals four, domain negative four to four, and range negative two to two." role="img">
      <div className="learn-equation-pill">y = x^2 / 4 - 2</div>
      <svg viewBox="0 0 640 420">
        <rect width="640" height="420" rx="24" fill="#f8fbff" />
        {Array.from({ length: 13 }, (_, index) => <line key={`v-${index}`} x1={52 + index * 45} x2={52 + index * 45} y1="38" y2="360" stroke="#dbeafe" />)}
        {Array.from({ length: 8 }, (_, index) => <line key={`h-${index}`} x1="38" x2="594" y1={52 + index * 43} y2={52 + index * 43} stroke="#dbeafe" />)}
        <rect x="146" y="92" width="348" height="196" rx="18" fill="#8b5cf6" opacity=".13" />
        <rect x="300" y="92" width="44" height="196" rx="16" fill="#06b6d4" opacity=".22" />
        <line x1="58" y1="288" x2="594" y2="288" stroke="#0f172a" strokeWidth="2" />
        <line x1="322" y1="48" x2="322" y2="365" stroke="#0f172a" strokeWidth="2" />
        <path d="M 146 92 C 206 250 274 304 322 288 C 384 268 438 178 494 92" fill="none" stroke="#4f46e5" strokeWidth="7" strokeLinecap="round" />
        <circle cx="146" cy="92" r="12" fill="#fff" stroke="#4f46e5" strokeWidth="6" />
        <circle cx="322" cy="288" r="10" fill="#4f46e5" />
        <circle cx="494" cy="92" r="12" fill="#fff" stroke="#4f46e5" strokeWidth="6" />
        <rect x="92" y="326" width="142" height="40" rx="13" fill="#f3e8ff" stroke="#ddd6fe" />
        <text x="113" y="351" fill="#6d28d9" fontSize="16" fontWeight="900">Domain [-4, 4]</text>
        <rect x="414" y="326" width="134" height="40" rx="13" fill="#ecfeff" stroke="#bae6fd" />
        <text x="433" y="351" fill="#0891b2" fontSize="16" fontWeight="900">Range [-2, 2]</text>
      </svg>
    </div>
  );
}

function searchableText(lesson: LearningLessonRef) {
  return [lesson.title, lesson.topic, lesson.level, lesson.summary, visualToolFor(lesson), learningTypeFor(lesson)].join(" ").toLowerCase();
}

function countTopicLessons(topic: LearningTopic) {
  return new Set(topic.subtopics.flatMap((subtopic) => subtopic.lessons.map((lesson) => lesson.route))).size;
}

function countLearningType(lessons: LearningLessonRef[], type: string) {
  return lessons.filter((lesson) => learningTypeFor(lesson) === type).length;
}

function learningTypeFor(lesson: LearningLessonRef) {
  const text = [lesson.title, lesson.topic, lesson.summary].join(" ").toLowerCase();
  const matched = learningTypeFilters.find((type) => type.terms.some((term) => text.includes(term)));
  return matched?.id ?? (lesson.kind === "advanced" ? "challenge" : lesson.kind === "school" ? "learn" : "explore");
}

function visualToolFor(lesson: LearningLessonRef) {
  const text = [lesson.title, lesson.topic, lesson.summary].join(" ").toLowerCase();
  if (/3d|three dimensional|solid|surface/.test(text)) return "3D Graph";
  if (/matrix|vector|plane/.test(text)) return "3D Geometry";
  if (/graph|function|curve|plot|slope|domain|range|linear|quadratic|exponential/.test(text)) return "2D Graph";
  if (/geometry|triangle|circle|construction|angle|shape|coordinate/.test(text)) return "2D Geometry";
  if (/cas|symbolic|equation|factor|polynomial|sequence|series|data|statistics|probability|distribution|mean|median/.test(text)) return "CAS/Data";
  if (/proof|model|simulation|interactive/.test(text)) return "Multiple Tools";
  return "No Engine";
}
