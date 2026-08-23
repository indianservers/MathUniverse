import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Boxes,
  BrainCircuit,
  Clock3,
  FlaskConical,
  GraduationCap,
  LineChart,
  Play,
  Search,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { getLearningTopic, getLearningTopics, type LearningLessonRef, type LearningSubtopic, type LearningTopic } from "../learningExperience";

type Difficulty = "Foundational" | "Intermediate" | "Advanced";
type LearningMode = "Learn" | "Explore" | "Practice" | "Challenge" | "Investigation" | "Visual Proof" | "Assessment" | "Revision";
type InteractionFormat = "Animation" | "Simulation" | "Graphing" | "Construction" | "CAS" | "3D" | "Data Experiment" | "Algebraic Answer" | "Numeric Answer";

const topicPalettes: Record<string, { primary: string; secondary: string; soft: string; ink: string }> = {
  "numbers-and-arithmetic": { primary: "#2563eb", secondary: "#f59e0b", soft: "#eaf6ff", ink: "#092056" },
  algebra: { primary: "#6d28d9", secondary: "#06b6d4", soft: "#f2ecff", ink: "#17115a" },
  "functions-and-graphs": { primary: "#2563eb", secondary: "#06b6d4", soft: "#edf7ff", ink: "#071d55" },
  geometry: { primary: "#f97316", secondary: "#06b6d4", soft: "#fff4ea", ink: "#351446" },
  trigonometry: { primary: "#059669", secondary: "#0ea5e9", soft: "#e9fff7", ink: "#073b4c" },
  calculus: { primary: "#4f46e5", secondary: "#ec4899", soft: "#f1f0ff", ink: "#11185d" },
  "statistics-and-probability": { primary: "#db2777", secondary: "#06b6d4", soft: "#fff0f8", ink: "#34124f" },
  "vectors-and-3d-mathematics": { primary: "#2563eb", secondary: "#7c3aed", soft: "#edf2ff", ink: "#0c1a5c" },
  "discrete-and-applied-mathematics": { primary: "#d97706", secondary: "#4f46e5", soft: "#fff7df", ink: "#2f2357" },
  "advanced-mathematics": { primary: "#7c3aed", secondary: "#0f172a", soft: "#f3efff", ink: "#140d42" },
};

const modeOrder: LearningMode[] = ["Learn", "Explore", "Practice", "Challenge", "Investigation", "Visual Proof", "Assessment", "Revision"];
const formatOrder: InteractionFormat[] = ["Animation", "Simulation", "Graphing", "Construction", "CAS", "3D", "Data Experiment", "Algebraic Answer", "Numeric Answer"];

export default function LearnDiscoveryPage() {
  const { topicSlug, subtopicSlug } = useParams();
  const topic = useMemo(() => getLearningTopic(topicSlug), [topicSlug]);
  const allTopics = useMemo(() => getLearningTopics(), []);
  if (!topic) return <LearningNotFound topics={allTopics} />;

  const selectedSubtopic = topic.subtopics.find((subtopic) => subtopic.slug === subtopicSlug) ?? null;
  if (selectedSubtopic) {
    return <SubtopicExplorer topic={topic} subtopic={selectedSubtopic} />;
  }

  return <TopicMaster topic={topic} />;
}

function TopicMaster({ topic }: { topic: LearningTopic }) {
  if (topic.slug === "numbers-and-arithmetic") return <NumbersMaster topic={topic} />;
  if (topic.slug === "functions-and-graphs") return <FunctionsMaster topic={topic} />;
  if (topic.slug === "geometry") return <GeometryMaster topic={topic} />;
  if (topic.slug === "trigonometry") return <TrigonometryMaster topic={topic} />;
  if (topic.slug === "calculus") return <CalculusMaster topic={topic} />;
  if (topic.slug === "statistics-and-probability") return <StatisticsMaster topic={topic} />;
  if (topic.slug === "vectors-and-3d-mathematics") return <Vectors3DMaster topic={topic} />;
  if (topic.slug === "discrete-and-applied-mathematics") return <DiscreteAppliedMaster topic={topic} />;
  if (topic.slug === "advanced-mathematics") return <AdvancedMathMaster topic={topic} />;

  const palette = paletteFor(topic.slug);
  const totalLessons = countTopicLessons(topic);
  const firstLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons)[0] ?? null;

  return (
    <main className="learn-topic-page learn-master" style={paletteVars(palette)} data-topic={topic.slug}>
      <Breadcrumbs current={topic.title} />
      <Link className="learn-back-link learn-glass-link" to="/learn"><ArrowLeft className="h-4 w-4" />Learn home</Link>

      <section className="learn-master-hero" aria-labelledby="topic-title">
        <div className="learn-master-copy">
          <p className="learn-kicker">Main topic</p>
          <h1 id="topic-title">{topic.title}</h1>
          <p>{topic.description} {topic.prompt}</p>
          <div className="learn-stat-row" aria-label={`${topic.title} learning statistics`}>
            <Pill icon={Boxes} label={`${topic.subtopics.length} subtopics`} />
            <Pill icon={BookOpen} label={`${totalLessons} linked lessons`} />
            <Pill icon={GraduationCap} label={topicClassRange(topic)} />
            <Pill icon={Clock3} label={`${topicMinutes(topic)} min path`} />
          </div>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={firstLesson?.route ?? `/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>Start learning <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to={`#${topic.slug}-pathways`}>Explore freely</Link>
          </div>
        </div>
        <TopicLiveCanvas topic={topic} />
      </section>

      <section id={`${topic.slug}-pathways`} className="learn-pathway-panel" aria-labelledby="pathway-title">
        <div className="learn-section-heading">
          <div>
            <p className="learn-kicker">Choose your {topic.shortTitle.toLowerCase()} pathway</p>
            <h2 id="pathway-title">{topic.subtopics.length} connected pathways. One coherent {topic.shortTitle.toLowerCase()} story.</h2>
            <p>Each pathway uses a focused visual model, real catalogue lessons, and the Predict, Manipulate, Observe, Explain learning rhythm.</p>
          </div>
        </div>
        <div className="learn-pathway-cards">
          {topic.subtopics.map((subtopic, index) => (
            <SubtopicPathwayCard key={subtopic.slug} topic={topic} subtopic={subtopic} index={index} />
          ))}
        </div>
      </section>

      <section className="learn-method-route" aria-labelledby="method-title">
        <div className="learn-method-card">
          <p className="learn-kicker">How learning works</p>
          <h2 id="method-title">Predict. Manipulate. Observe. Explain.</h2>
          <LearningMethodStrip />
        </div>
        <div className="learn-recommended-route">
          <p className="learn-kicker">Recommended route</p>
          <div className="learn-route-rail">
            {topic.subtopics.map((subtopic, index) => (
              <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`}>
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{subtopic.title}</strong>
                <small>{subtopic.lessons.length} lessons</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function NumbersMaster({ topic }: { topic: LearningTopic }) {
  const palette = paletteFor(topic.slug);
  const totalLessons = countTopicLessons(topic);
  const firstLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons)[0] ?? null;
  const progress = [60, 45, 35];

  return (
    <main className="learn-topic-page learn-master numbers-master" style={paletteVars(palette)} data-topic={topic.slug}>
      <Breadcrumbs current={topic.title} />

      <section className="numbers-hero" aria-labelledby="numbers-title">
        <div className="numbers-hero-copy">
          <p className="learn-kicker">Numbers & arithmetic</p>
          <h1 id="numbers-title">Build number sense that scales.</h1>
          <p>Explore numbers, relations, and structure through interactive models. See patterns. Make connections. Build confidence.</p>
          <div className="numbers-stat-grid" aria-label="Numbers and arithmetic learning statistics">
            <Pill icon={Boxes} label={`${topic.subtopics.length} pathways`} />
            <Pill icon={BookOpen} label={`${totalLessons} interactive lessons`} />
            <Pill icon={GraduationCap} label={topicClassRange(topic)} />
            <Pill icon={Clock3} label={`${topicMinutes(topic)} min`} />
          </div>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={firstLesson?.route ?? `/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>Continue learning <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="#numbers-pathways">Explore freely</Link>
          </div>
        </div>
        <NumbersLiveModel />
      </section>

      <section id="numbers-pathways" className="numbers-pathways" aria-labelledby="numbers-pathways-title">
        <div className="numbers-section-head">
          <h2 id="numbers-pathways-title">3 connected pathways. One powerful arithmetic foundation.</h2>
        </div>
        <div className="numbers-pathway-grid">
          {topic.subtopics.map((subtopic, index) => (
            <NumbersPathwayCard key={subtopic.slug} topic={topic} subtopic={subtopic} index={index} progress={progress[index] ?? 40} />
          ))}
        </div>
      </section>

      <section className="numbers-method-panel" aria-labelledby="numbers-method-title">
        <p className="learn-kicker">How learning works</p>
        <h2 id="numbers-method-title" className="sr-only">Predict. Manipulate. Observe. Explain.</h2>
        <LearningMethodStrip />
      </section>

      <section className="numbers-dashboard" aria-label="Recommended route and progress dashboard">
        <div>
          <p className="learn-kicker">Recommended route</p>
          <div className="numbers-route-list">
            {topic.subtopics.map((subtopic, index) => (
              <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`}>
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{subtopic.title}</strong>
                <small>{subtopic.lessons.length} lessons</small>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
          <Link className="numbers-view-all" to="#numbers-pathways">View all pathways <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="numbers-progress-card">
          <p className="learn-kicker">Your progress</p>
          <div className="numbers-progress-layout">
            <div className="numbers-progress-ring" style={{ "--progress": "47%" } as CSSProperties}><span><strong>47%</strong><small>Overall progress</small></span></div>
            <div className="numbers-progress-bars">
              {topic.subtopics.map((subtopic, index) => (
                <div key={subtopic.slug}>
                  <span>{subtopic.title}<b>{progress[index]}%</b></span>
                  <em><strong style={{ width: `${progress[index]}%`, background: numbersAccent(index) }} /></em>
                </div>
              ))}
            </div>
          </div>
          <Link className="numbers-view-all" to={`/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>View detailed progress <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}

function NumbersLiveModel() {
  const [partA, setPartA] = useState(3);
  const [partB, setPartB] = useState(5);
  const whole = partA + partB;
  const pointA = -40 + (partA / whole) * 320;
  const pointB = 60 + (partB / whole) * 320;
  return (
    <div className="numbers-live-model" aria-label="Interactive number line and ratio model">
      <div className="numbers-model-tabs">
        <span className="is-active">Number line</span>
        <span>Ratios</span>
        <span>Parameters</span>
        <button type="button"><Play className="h-4 w-4" />Play</button>
      </div>
      <svg viewBox="0 0 720 260" role="img" aria-label="Number line with fraction arc and ratio bars">
        <line x1="58" x2="658" y1="86" y2="86" stroke="#0f172a" strokeWidth="3" />
        <path d="M650 86 l-12 -8 v16z" fill="#0f172a" />
        {[-4, -2, 0, 2, 4, 6, 8, 10].map((value, index) => {
          const x = 100 + index * 72;
          return <g key={value}><line x1={x} x2={x} y1="76" y2="96" stroke="#0f172a" strokeWidth="2" /><text x={x - 8} y="120" fill="#1f2d5b" fontSize="16" fontWeight="800">{value}</text></g>;
        })}
        <path d="M292 78 C332 22 426 22 494 78" fill="none" stroke="#f59e0b" strokeWidth="4" markerEnd="url(#numbers-arrow)" />
        <defs><marker id="numbers-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#f59e0b" /></marker></defs>
        <text x="365" y="28" fill="#2457ff" fontSize="20" fontWeight="950">{partA + 1}/{whole}</text>
        <circle cx={pointA + 190} cy="86" r="11" fill="#fff" stroke="#0ea5e9" strokeWidth="5" />
        <circle cx={pointB + 190} cy="86" r="11" fill="#f59e0b" />
        <text x="72" y="176" fill="#102766" fontSize="15" fontWeight="950">Ratio model</text>
        <text x="72" y="214" fill="#102766" fontSize="13" fontWeight="850">Part A</text>
        <rect x="150" y="196" width={partA * 28} height="24" rx="5" fill="#60a5fa" />
        <text x={164 + partA * 28} y="214" fill="#102766" fontSize="14" fontWeight="900">{partA}</text>
        <text x="72" y="248" fill="#102766" fontSize="13" fontWeight="850">Part B</text>
        <rect x="150" y="230" width={partB * 28} height="24" rx="5" fill="#a855f7" />
        <text x={164 + partB * 28} y="248" fill="#102766" fontSize="14" fontWeight="900">{partB}</text>
      </svg>
      <div className="numbers-model-controls">
        <label><span>Part A</span><input type="range" min="1" max="7" value={partA} onChange={(event) => setPartA(Number(event.target.value))} /></label>
        <label><span>Part B</span><input type="range" min="1" max="9" value={partB} onChange={(event) => setPartB(Number(event.target.value))} /></label>
        <strong>Whole {whole}</strong>
      </div>
    </div>
  );
}

function NumbersPathwayCard({ topic, subtopic, index, progress }: { topic: LearningTopic; subtopic: LearningSubtopic; index: number; progress: number }) {
  return (
    <Link className="numbers-pathway-card" style={{ "--numbers-accent": numbersAccent(index) } as CSSProperties} to={`/learn/${topic.slug}/${subtopic.slug}`}>
      <div className="numbers-pathway-top">
        <span>{index + 1}</span>
        <h3>{subtopic.title}</h3>
        <ArrowRight className="h-5 w-5" />
      </div>
      <p>{subtopic.description}</p>
      <NumbersPathwayVisual type={subtopic.slug} />
      <div className="learn-card-meta">
        <span>{subtopic.lessons.length} lessons</span>
        <span>{subtopic.classRange}</span>
        <span>{dominantFormat(subtopic.lessons)}</span>
      </div>
      <div className="learn-skill-chips">
        {skillChips(subtopic).map((chip) => <span key={chip}>{chip}</span>)}
      </div>
      <div className="learn-progress-track"><span style={{ width: `${progress}%` }} /></div>
      <strong className="learn-explore-action">Explore pathway <ArrowRight className="h-4 w-4" /></strong>
    </Link>
  );
}

function NumbersPathwayVisual({ type }: { type: string }) {
  return (
    <div className="numbers-pathway-visual">
      <svg viewBox="0 0 420 260" role="img" aria-label={`${type} arithmetic visual`}>
        {type.includes("number") ? (
          <g>
            <rect x="46" y="34" width="280" height="170" rx="38" fill="#dbeafe" />
            <rect x="68" y="58" width="230" height="122" rx="34" fill="#bbf7d0" opacity=".7" />
            <rect x="88" y="84" width="170" height="74" rx="28" fill="#86efac" opacity=".8" />
            <rect x="110" y="108" width="110" height="36" rx="18" fill="#34d399" opacity=".82" />
            <ellipse cx="262" cy="144" rx="46" ry="54" fill="#ecfeff" />
            <text x="78" y="70" fill="#075985" fontSize="13" fontWeight="950">Real Numbers R</text>
            <text x="94" y="102" fill="#047857" fontSize="13" fontWeight="950">Rational Numbers Q</text>
            <text x="120" y="128" fill="#065f46" fontSize="13" fontWeight="950">Integers Z</text>
            <text x="128" y="150" fill="#064e3b" fontSize="12" fontWeight="950">Natural Numbers N</text>
            <text x="235" y="144" fill="#102766" fontSize="12" fontWeight="950">Irrational</text>
          </g>
        ) : type.includes("ratio") ? (
          <g>
            <text x="48" y="50" fill="#102766" fontSize="14" fontWeight="950">Double number line</text>
            <line x1="70" x2="354" y1="102" y2="102" stroke="#0ea5e9" strokeWidth="4" />
            <line x1="70" x2="354" y1="168" y2="168" stroke="#7c3aed" strokeWidth="4" />
            {[0, 1, 2, 3].map((tick) => <g key={tick}><line x1={70 + tick * 95} x2={70 + tick * 95} y1="82" y2="188" stroke="#94a3b8" strokeDasharray="5 5" /><text x={64 + tick * 95} y="78" fill="#102766" fontSize="13" fontWeight="900">{tick * 3}</text><text x={64 + tick * 95} y="204" fill="#102766" fontSize="13" fontWeight="900">{tick * 5}</text></g>)}
            <text x="24" y="106" fill="#0e7490" fontSize="13" fontWeight="950">Apples</text>
            <text x="24" y="172" fill="#7c3aed" fontSize="13" fontWeight="950">Oranges</text>
          </g>
        ) : (
          <g>
            <rect x="40" y="52" width="104" height="104" fill="#a855f7" opacity=".8" />
            {Array.from({ length: 6 }, (_, i) => <line key={`v${i}`} x1={40 + i * 17} x2={40 + i * 17} y1="52" y2="156" stroke="#7c3aed" opacity=".45" />)}
            {Array.from({ length: 6 }, (_, i) => <line key={`h${i}`} x1="40" x2="144" y1={52 + i * 17} y2={52 + i * 17} stroke="#7c3aed" opacity=".45" />)}
            <rect x="170" y="52" width="30" height="104" fill="#2dd4bf" opacity=".8" />
            <path d="M270 204 C296 166 316 104 344 48" fill="none" stroke="#7c3aed" strokeWidth="6" markerEnd="url(#growth-arrow)" />
            <defs><marker id="growth-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6Z" fill="#7c3aed" /></marker></defs>
            <text x="74" y="190" fill="#7c3aed" fontSize="17" fontWeight="950">(x + 1)^2</text>
            <text x="304" y="154" fill="#7c3aed" fontSize="16" fontWeight="950">y = 2^x</text>
          </g>
        )}
      </svg>
    </div>
  );
}

function FunctionsMaster({ topic }: { topic: LearningTopic }) {
  const palette = paletteFor(topic.slug);
  const totalLessons = countTopicLessons(topic);
  const firstLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons)[0] ?? null;
  const progress = [42, 55, 38, 35, 48];
  const completed = Math.round(totalLessons * 0.46);

  return (
    <main className="learn-topic-page learn-master functions-master" style={paletteVars(palette)} data-topic={topic.slug}>
      <Breadcrumbs current={topic.title} />

      <section className="functions-hero" aria-labelledby="functions-title">
        <div className="functions-hero-copy">
          <p className="learn-kicker">Functions & graphs</p>
          <h1 id="functions-title">Turn patterns into pictures.</h1>
          <p>Connect mappings, tables, equations and curves to see how change takes shape.</p>
          <div className="functions-stat-grid" aria-label="Functions and graphs learning statistics">
            <Pill icon={Boxes} label={`${topic.subtopics.length} pathways`} />
            <Pill icon={BookOpen} label={`${totalLessons} interactive lessons`} />
            <Pill icon={GraduationCap} label={topicClassRange(topic)} />
            <Pill icon={Clock3} label={`${topicMinutes(topic)} min`} />
          </div>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={firstLesson?.route ?? `/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>Continue learning <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="#functions-pathways">Explore freely</Link>
          </div>
        </div>
        <FunctionStudio />
      </section>

      <section id="functions-pathways" className="functions-pathways" aria-labelledby="functions-pathways-title">
        <div className="functions-section-head">
          <p className="learn-kicker">Choose your pathway</p>
          <h2 id="functions-pathways-title">5 connected pathways. One complete language of change.</h2>
        </div>
        <div className="functions-pathway-grid">
          {topic.subtopics.map((subtopic, index) => (
            <FunctionsPathwayCard key={subtopic.slug} topic={topic} subtopic={subtopic} index={index} progress={progress[index] ?? 40} />
          ))}
        </div>
      </section>

      <section className="functions-method-panel" aria-labelledby="functions-method-title">
        <p className="learn-kicker">How learning works</p>
        <h2 id="functions-method-title" className="sr-only">Predict. Manipulate. Observe. Explain.</h2>
        <LearningMethodStrip />
      </section>

      <section className="functions-dashboard" aria-label="Recommended route and progress dashboard">
        <div>
          <p className="learn-kicker">Recommended route</p>
          <div className="functions-route-list">
            {topic.subtopics.map((subtopic, index) => (
              <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`}>
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{subtopic.title}</strong>
                <small>{subtopic.lessons.length} lessons</small>
              </Link>
            ))}
          </div>
          <p className="functions-route-note">Follow the sequence or jump to any pathway to explore.</p>
        </div>
        <div className="functions-progress-card">
          <p className="learn-kicker">Your progress</p>
          <div className="functions-progress-layout">
            <div className="functions-progress-ring" style={{ "--progress": "46%" } as CSSProperties}><span><strong>46%</strong><small>Overall progress</small></span></div>
            <div className="functions-progress-bars">
              {topic.subtopics.map((subtopic, index) => (
                <div key={subtopic.slug}>
                  <span><i style={{ background: functionsAccent(index) }} />{subtopic.title}<b>{progress[index]}%</b></span>
                  <em><strong style={{ width: `${progress[index]}%`, background: functionsAccent(index) }} /></em>
                </div>
              ))}
            </div>
          </div>
          <p className="functions-progress-note">{completed} of {totalLessons} lessons completed <span>Keep going!</span></p>
        </div>
      </section>
    </main>
  );
}

function FunctionStudio() {
  const [mode, setMode] = useState<"mapping" | "table" | "graph">("mapping");
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const [activeX, setActiveX] = useState(0);
  const domain = [-2, -1, 0, 1, 2];
  const values = domain.map((x) => ({ x, y: a * x * x + b * x + c }));
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;
  const equation = `f(x) = ${formatQuadratic(a, b, c)}`;

  return (
    <div className="function-studio" aria-label="Interactive function studio with mapping, table, and graph">
      <div className="function-studio-tabs" role="tablist" aria-label="Function representations">
        {(["mapping", "table", "graph"] as const).map((tab) => (
          <button key={tab} type="button" className={mode === tab ? "is-active" : ""} aria-selected={mode === tab} onClick={() => setMode(tab)}>
            {tab === "mapping" ? "Mapping" : tab === "table" ? "Table" : "Graph"}
          </button>
        ))}
      </div>
      <div className="function-studio-body">
        <section className="function-map-panel" aria-label="Mapping representation">
          <h3>Mapping</h3>
          <FunctionMapping values={values} activeX={activeX} onSelect={setActiveX} />
        </section>
        <section className="function-table-panel" aria-label="Table representation">
          <h3>Table</h3>
          <table>
            <thead><tr><th>x</th><th>f(x)</th></tr></thead>
            <tbody>{values.map((row) => <tr key={row.x} className={row.x === activeX ? "is-active" : ""} onMouseEnter={() => setActiveX(row.x)}><td>{row.x}</td><td>{formatNumber(row.y)}</td></tr>)}</tbody>
          </table>
        </section>
        <section className="function-graph-panel" aria-label="Graph representation">
          <div className="function-equation-row"><span>{equation}</span><button type="button" aria-label="Open equation menu">⌄</button></div>
          <FunctionGraph a={a} b={b} c={c} activeX={activeX} vertexX={vertexX} vertexY={vertexY} onSelect={setActiveX} />
        </section>
      </div>
      <div className="function-studio-controls">
        <label><span>a</span><strong>{formatNumber(a)}</strong><input type="range" min="-2" max="2" step="0.1" value={a} onChange={(event) => setA(Math.abs(Number(event.target.value)) < 0.1 ? 0.1 : Number(event.target.value))} /></label>
        <label><span>b</span><strong>{formatNumber(b)}</strong><input type="range" min="-5" max="5" step="0.1" value={b} onChange={(event) => setB(Number(event.target.value))} /></label>
        <label><span>c</span><strong>{formatNumber(c)}</strong><input type="range" min="-5" max="5" step="0.1" value={c} onChange={(event) => setC(Number(event.target.value))} /></label>
        <div className="function-studio-actions">
          <button type="button"><Play className="h-4 w-4" />Play</button>
          <button type="button" onClick={() => { setA(1); setB(-2); setC(-3); setActiveX(0); }}>Reset</button>
          <Link to="/math-lab/graphing-calculator">Workspace</Link>
        </div>
      </div>
    </div>
  );
}

function FunctionMapping({ values, activeX, onSelect }: { values: { x: number; y: number }[]; activeX: number; onSelect: (value: number) => void }) {
  const domainY = (index: number) => 34 + index * 50;
  const rangeY = (index: number) => 34 + index * 50;
  return (
    <svg viewBox="0 0 250 270" role="img" aria-label="Domain values connected to calculated range values">
      <text x="34" y="18" fill="#102766" fontSize="13" fontWeight="950">x</text>
      <text x="184" y="18" fill="#102766" fontSize="13" fontWeight="950">f(x)</text>
      {values.map((value, index) => {
        const isActive = value.x === activeX;
        return (
          <g key={value.x}>
            <path d={`M70 ${domainY(index)} C112 ${domainY(index)} 130 ${rangeY(index)} 178 ${rangeY(index)}`} fill="none" stroke={isActive ? "#2457ff" : "#8b5cf6"} strokeWidth={isActive ? 4 : 2} opacity={isActive ? 1 : 0.55} />
            <g role="button" tabIndex={0} onClick={() => onSelect(value.x)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(value.x); }} aria-label={`Select x equals ${value.x}`}>
              <circle cx="48" cy={domainY(index)} r="21" fill="#eff6ff" stroke={isActive ? "#2457ff" : "#06b6d4"} strokeWidth="3" />
              <text x={value.x < 0 ? 39 : 43} y={domainY(index) + 5} fill="#102766" fontSize="14" fontWeight="900">{value.x}</text>
            </g>
            <circle cx="202" cy={rangeY(index)} r="23" fill="#f3e8ff" stroke={isActive ? "#2457ff" : "#8b5cf6"} strokeWidth="3" />
            <text x={value.y < 0 ? 192 : 198} y={rangeY(index) + 5} fill="#5b21b6" fontSize="14" fontWeight="900">{formatNumber(value.y)}</text>
          </g>
        );
      })}
      <rect x="130" y="234" width="96" height="24" rx="12" fill="#dcfce7" />
      <text x="144" y="251" fill="#047857" fontSize="12" fontWeight="950">Function</text>
    </svg>
  );
}

function FunctionGraph({ a, b, c, activeX, vertexX, vertexY, onSelect }: { a: number; b: number; c: number; activeX: number; vertexX: number; vertexY: number; onSelect: (value: number) => void }) {
  const xToSvg = (x: number) => 210 + x * 48;
  const yToSvg = (y: number) => 190 - y * 36;
  const path = Array.from({ length: 81 }, (_, index) => {
    const x = -4 + index * 0.1;
    const y = a * x * x + b * x + c;
    return `${index === 0 ? "M" : "L"}${xToSvg(x).toFixed(1)} ${yToSvg(y).toFixed(1)}`;
  }).join(" ");
  const discriminant = b * b - 4 * a * c;
  const roots = discriminant >= 0 ? [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)].filter((root) => root >= -4 && root <= 4) : [];
  const activeY = a * activeX * activeX + b * activeX + c;

  return (
    <svg viewBox="0 0 420 360" role="img" aria-label="Quadratic graph with roots and vertex">
      <Grid />
      <line x1="28" x2="398" y1={yToSvg(0)} y2={yToSvg(0)} stroke="#1f2d5b" strokeWidth="2" />
      <line x1={xToSvg(0)} x2={xToSvg(0)} y1="26" y2="330" stroke="#1f2d5b" strokeWidth="2" />
      <path d={path} fill="none" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round" />
      {roots.map((root) => <circle key={root.toFixed(3)} cx={xToSvg(root)} cy={yToSvg(0)} r="9" fill="#06b6d4" stroke="#fff" strokeWidth="3" />)}
      <line x1={xToSvg(vertexX)} x2={xToSvg(vertexX)} y1={yToSvg(vertexY)} y2={yToSvg(0)} stroke="#8b5cf6" strokeDasharray="5 5" strokeWidth="2" />
      <circle cx={xToSvg(vertexX)} cy={yToSvg(vertexY)} r="10" fill="#7c3aed" />
      <circle cx={xToSvg(activeX)} cy={yToSvg(activeY)} r="11" fill="#fff" stroke="#2457ff" strokeWidth="5" onMouseEnter={() => onSelect(activeX)} />
      <text x={xToSvg(activeX) + 12} y={yToSvg(activeY) - 10} fill="#2457ff" fontSize="13" fontWeight="950">({activeX}, {formatNumber(activeY)})</text>
      <text x="372" y={yToSvg(0) - 8} fill="#102766" fontSize="12" fontWeight="950">x</text>
      <text x={xToSvg(0) + 9} y="44" fill="#102766" fontSize="12" fontWeight="950">y</text>
    </svg>
  );
}

function FunctionsPathwayCard({ topic, subtopic, index, progress }: { topic: LearningTopic; subtopic: LearningSubtopic; index: number; progress: number }) {
  return (
    <Link className={`functions-pathway-card ${index === 4 ? "is-wide" : ""}`} style={{ "--functions-accent": functionsAccent(index) } as CSSProperties} to={`/learn/${topic.slug}/${subtopic.slug}`}>
      <div className="functions-pathway-top">
        <span>{index + 1}</span>
        <div>
          <h3>{subtopic.title}</h3>
          <p>{subtopic.description}</p>
        </div>
        <ArrowRight className="h-5 w-5" />
      </div>
      <FunctionsPathwayVisual type={subtopic.slug} wide={index === 4} />
      <div className="learn-card-meta">
        <span>{subtopic.lessons.length} lessons</span>
        <span>{subtopic.classRange}</span>
        <span>{dominantFormat(subtopic.lessons)}</span>
      </div>
      <div className="functions-card-progress"><strong>{progress}%</strong><em><span style={{ width: `${progress}%` }} /></em><small>Explore pathway <ArrowRight className="h-4 w-4" /></small></div>
    </Link>
  );
}

function FunctionsPathwayVisual({ type, wide = false }: { type: string; wide?: boolean }) {
  return (
    <div className="functions-pathway-visual">
      <svg viewBox={wide ? "0 0 760 300" : "0 0 430 300"} role="img" aria-label={`${type} function pathway visual`}>
        {type.includes("relations") ? (
          <g>
            <ellipse cx="92" cy="132" rx="54" ry="102" fill="#e0f2fe" stroke="#7dd3fc" />
            <ellipse cx="222" cy="132" rx="54" ry="102" fill="#f3e8ff" stroke="#c084fc" />
            {[-2, -1, 0, 1].map((x, i) => <g key={x}><circle cx="92" cy={62 + i * 46} r="16" fill="#fff" stroke="#06b6d4" strokeWidth="3" /><text x={x < 0 ? 84 : 88} y={67 + i * 46} fill="#102766" fontSize="12" fontWeight="900">{x}</text></g>)}
            {[-3, -1, 1, -3].map((y, i) => <g key={`${y}-${i}`}><circle cx="222" cy={62 + i * 46} r="16" fill="#fff" stroke="#8b5cf6" strokeWidth="3" /><text x={y < 0 ? 214 : 218} y={67 + i * 46} fill="#5b21b6" fontSize="12" fontWeight="900">{y}</text></g>)}
            {[0, 1, 2, 3].map((i) => <path key={i} d={`M108 ${62 + i * 46} C142 ${62 + i * 38} 170 ${82 + i * 30} 206 ${62 + i * 46}`} fill="none" stroke="#7c3aed" strokeWidth="2.5" opacity=".75" />)}
            <rect x="282" y="62" width="104" height="118" rx="18" fill="#fff" stroke="#dbeafe" />
            <path d="M304 160 C332 82 350 228 376 72" fill="none" stroke="#2457ff" strokeWidth="3" />
            <line x1="336" x2="336" y1="70" y2="172" stroke="#06b6d4" strokeDasharray="4 4" />
            <circle cx="348" cy="120" r="9" fill="#06b6d4" />
            <text x="301" y="206" fill="#047857" fontSize="13" fontWeight="950">Vertical line test</text>
          </g>
        ) : type.includes("linear") ? (
          <g>
            <line x1="74" y1="236" x2="368" y2="236" stroke="#0f172a" strokeWidth="2" />
            <line x1="92" y1="42" x2="92" y2="254" stroke="#0f172a" strokeWidth="2" />
            <path d="M66 214 L360 72" stroke="#06b6d4" strokeWidth="5" />
            <circle cx="202" cy="148" r="9" fill="#fff" stroke="#2457ff" strokeWidth="4" />
            <line x1="202" x2="296" y1="148" y2="148" stroke="#2457ff" strokeWidth="2" />
            <line x1="296" x2="296" y1="148" y2="102" stroke="#2457ff" strokeWidth="2" />
            <text x="232" y="140" fill="#2457ff" fontSize="13" fontWeight="950">Δx</text>
            <text x="304" y="126" fill="#2457ff" fontSize="13" fontWeight="950">Δy</text>
            <text x="150" y="86" fill="#2457ff" fontSize="16" fontWeight="950">y = mx + b</text>
          </g>
        ) : type.includes("quadratic") ? (
          <g>
            <line x1="58" y1="216" x2="380" y2="216" stroke="#0f172a" strokeWidth="2" />
            <line x1="220" y1="48" x2="220" y2="250" stroke="#0f172a" strokeWidth="2" />
            <path d="M92 58 C138 248 302 248 348 58" fill="none" stroke="#7c3aed" strokeWidth="5" />
            <line x1="220" x2="220" y1="74" y2="216" stroke="#8b5cf6" strokeDasharray="5 5" />
            <circle cx="150" cy="216" r="9" fill="#fff" stroke="#06b6d4" strokeWidth="4" />
            <circle cx="290" cy="216" r="9" fill="#fff" stroke="#06b6d4" strokeWidth="4" />
            <circle cx="220" cy="238" r="10" fill="#7c3aed" />
            <text x="232" y="104" fill="#7c3aed" fontSize="13" fontWeight="950">axis</text>
            <text x="197" y="266" fill="#7c3aed" fontSize="13" fontWeight="950">vertex</text>
          </g>
        ) : type.includes("exponential") ? (
          <g>
            <line x1="56" y1="224" x2="380" y2="224" stroke="#0f172a" strokeWidth="2" />
            <line x1="88" y1="46" x2="88" y2="246" stroke="#0f172a" strokeWidth="2" />
            <path d="M70 212 C138 206 202 174 344 54" fill="none" stroke="#ec4899" strokeWidth="5" />
            <path d="M70 54 C138 88 202 160 344 212" fill="none" stroke="#2457ff" strokeWidth="5" />
            <line x1="70" x2="358" y1="224" y2="224" stroke="#8b5cf6" strokeDasharray="6 6" />
            <text x="292" y="78" fill="#ec4899" fontSize="13" fontWeight="950">growth</text>
            <text x="270" y="184" fill="#2457ff" fontSize="13" fontWeight="950">decay</text>
          </g>
        ) : (
          <g>
            <line x1="46" y1="232" x2="222" y2="232" stroke="#0f172a" strokeWidth="2" />
            <line x1="134" y1="54" x2="134" y2="250" stroke="#0f172a" strokeWidth="2" />
            <path d="M70 64 C100 226 168 226 198 64" fill="none" stroke="#475569" strokeWidth="4" />
            <text x="70" y="44" fill="#475569" fontSize="14" fontWeight="950">Original f(x)=x²</text>
            <rect x="260" y="58" width="210" height="126" rx="18" fill="#f8fbff" stroke="#dbeafe" />
            <text x="286" y="88" fill="#2457ff" fontSize="13" fontWeight="950">Transformation controls</text>
            <path d="M286 122 h132 M286 158 h132" stroke="#c7d2fe" strokeWidth="8" strokeLinecap="round" />
            <circle cx="356" cy="122" r="10" fill="#2457ff" />
            <circle cx="330" cy="158" r="10" fill="#06b6d4" />
            <line x1="528" y1="232" x2="710" y2="232" stroke="#0f172a" strokeWidth="2" />
            <line x1="620" y1="54" x2="620" y2="250" stroke="#0f172a" strokeWidth="2" />
            <path d="M552 88 C585 244 666 244 700 88" fill="none" stroke="#06b6d4" strokeWidth="5" />
            <text x="548" y="44" fill="#0891b2" fontSize="14" fontWeight="950">g(x)=(x-2)²-1</text>
          </g>
        )}
      </svg>
    </div>
  );
}

type GeometryPointKey = "a" | "b" | "c";
type GeometryPoint = { x: number; y: number };

function GeometryMaster({ topic }: { topic: LearningTopic }) {
  const palette = paletteFor(topic.slug);
  const totalLessons = countTopicLessons(topic);
  const firstLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons)[0] ?? null;
  const progress = [45, 60, 55];

  return (
    <main className="learn-topic-page learn-master geometry-master" style={paletteVars(palette)} data-topic={topic.slug}>
      <Breadcrumbs current={topic.title} />

      <section className="geometry-master-hero" aria-labelledby="geometry-title">
        <div className="geometry-master-copy">
          <p className="learn-kicker">Geometry</p>
          <h1 id="geometry-title">Draw it. Move it. Prove it.</h1>
          <p>Construct shapes, discover invariants and build rigorous proofs with interactive geometry.</p>
          <div className="geometry-stat-grid" aria-label="Geometry learning statistics">
            <Pill icon={Boxes} label={`${topic.subtopics.length} pathways`} />
            <Pill icon={BookOpen} label={`${totalLessons} interactive lessons`} />
            <Pill icon={GraduationCap} label={topicClassRange(topic)} />
            <Pill icon={Clock3} label={`${topicMinutes(topic)} min`} />
          </div>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={firstLesson?.route ?? `/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>Continue learning <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="#geometry-pathways">Explore freely</Link>
          </div>
        </div>
        <GeometryStudioPreview />
      </section>

      <section id="geometry-pathways" className="geometry-pathways" aria-labelledby="geometry-pathways-title">
        <div className="geometry-section-head">
          <h2 id="geometry-pathways-title">3 connected pathways. <span>One visual language of space.</span></h2>
        </div>
        <div className="geometry-pathway-grid">
          {topic.subtopics.map((subtopic, index) => (
            <GeometryPathwayCard key={subtopic.slug} topic={topic} subtopic={subtopic} index={index} progress={progress[index] ?? 50} />
          ))}
        </div>
      </section>

      <section className="geometry-method-panel" aria-labelledby="geometry-method-title">
        <p className="learn-kicker">How learning works</p>
        <h2 id="geometry-method-title" className="sr-only">Predict. Construct. Observe. Prove.</h2>
        <GeometryMethodStrip />
      </section>

      <section className="geometry-dashboard" aria-label="Recommended route and progress dashboard">
        <div>
          <p className="learn-kicker">Recommended route</p>
          <div className="geometry-route-list">
            {topic.subtopics.map((subtopic, index) => (
              <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`}>
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{subtopic.title}</strong>
                <small>{subtopic.lessons.length} lessons</small>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
        <div className="geometry-progress-card">
          <p className="learn-kicker">Your progress</p>
          <div className="geometry-progress-layout">
            <div className="geometry-progress-ring" style={{ "--progress": "54%" } as CSSProperties}><span><strong>54%</strong><small>Overall progress</small></span></div>
            <div className="geometry-progress-bars">
              {topic.subtopics.map((subtopic, index) => (
                <div key={subtopic.slug}>
                  <span>{subtopic.title}<b>{progress[index]}%</b></span>
                  <em><strong style={{ width: `${progress[index]}%`, background: geometryAccent(index) }} /></em>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function GeometryStudioPreview() {
  const initial = { a: { x: 330, y: 70 }, b: { x: 112, y: 320 }, c: { x: 550, y: 302 } };
  const [mode, setMode] = useState<"construct" | "measure" | "transform">("construct");
  const [points, setPoints] = useState<Record<GeometryPointKey, GeometryPoint>>(initial);
  const [dragging, setDragging] = useState<GeometryPointKey | null>(null);
  const sideAB = distance(points.a, points.b) / 42;
  const sideBC = distance(points.b, points.c) / 42;
  const sideCA = distance(points.c, points.a) / 42;
  const perimeter = sideAB + sideBC + sideCA;
  const area = triangleArea(points.a, points.b, points.c) / 1764;
  const angleA = angleAt(points.a, points.b, points.c);
  const angleB = angleAt(points.b, points.a, points.c);
  const angleC = angleAt(points.c, points.a, points.b);
  const center = circumcenter(points.a, points.b, points.c) ?? { x: 330, y: 230 };
  const radius = distance(center, points.a);

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 660;
    const y = ((event.clientY - rect.top) / rect.height) * 420;
    setPoints((current) => ({
      ...current,
      [dragging]: { x: Math.min(600, Math.max(60, x)), y: Math.min(355, Math.max(54, y)) },
    }));
  };

  return (
    <div className="geometry-studio-preview" aria-label="Interactive geometry studio preview">
      <div className="geometry-studio-heading">
        <p className="learn-kicker">Geometry studio</p>
        <div role="tablist" aria-label="Geometry studio modes">
          {(["construct", "measure", "transform"] as const).map((tab) => (
            <button key={tab} type="button" className={mode === tab ? "is-active" : ""} aria-selected={mode === tab} onClick={() => setMode(tab)}>{tab}</button>
          ))}
        </div>
      </div>
      <div className="geometry-canvas-wrap">
        <svg viewBox="0 0 660 420" role="img" aria-label="Triangle construction with draggable vertices, side lengths, angles, circumcircle, area and perimeter" onPointerMove={handlePointerMove} onPointerUp={() => setDragging(null)} onPointerLeave={() => setDragging(null)}>
          <Grid />
          <circle cx={center.x} cy={center.y} r={Math.min(radius, 240)} fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="7 7" />
          <polygon points={`${points.a.x},${points.a.y} ${points.b.x},${points.b.y} ${points.c.x},${points.c.y}`} fill="#fed7aa" opacity=".36" stroke="#f97316" strokeWidth="4" />
          <line x1={points.a.x} y1={points.a.y} x2={center.x} y2={center.y} stroke="#7dd3fc" strokeDasharray="5 5" strokeWidth="2" />
          <line x1={points.b.x} y1={points.b.y} x2={center.x} y2={center.y} stroke="#7dd3fc" strokeDasharray="5 5" strokeWidth="2" />
          <line x1={points.c.x} y1={points.c.y} x2={center.x} y2={center.y} stroke="#7dd3fc" strokeDasharray="5 5" strokeWidth="2" />
          <AngleArc at={points.a} from={points.b} to={points.c} label={`${Math.round(angleA)}°`} color="#f97316" />
          <AngleArc at={points.b} from={points.a} to={points.c} label={`${Math.round(angleB)}°`} color="#f97316" />
          <AngleArc at={points.c} from={points.a} to={points.b} label={`${Math.round(angleC)}°`} color="#f97316" />
          <SideLabel p1={points.a} p2={points.b} text={sideAB.toFixed(2)} />
          <SideLabel p1={points.b} p2={points.c} text={sideBC.toFixed(2)} />
          <SideLabel p1={points.c} p2={points.a} text={sideCA.toFixed(2)} />
          <circle cx={center.x} cy={center.y} r="7" fill="#92400e" />
          <text x={center.x + 12} y={center.y - 8} fill="#92400e" fontSize="16" fontWeight="950">O</text>
          {(["a", "b", "c"] as GeometryPointKey[]).map((key) => (
            <g key={key} role="button" tabIndex={0} aria-label={`Drag point ${key.toUpperCase()}`} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(key); }} onKeyDown={(event) => {
              const delta = event.shiftKey ? 18 : 8;
              if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
              event.preventDefault();
              setPoints((current) => ({ ...current, [key]: { x: current[key].x + (event.key === "ArrowRight" ? delta : event.key === "ArrowLeft" ? -delta : 0), y: current[key].y + (event.key === "ArrowDown" ? delta : event.key === "ArrowUp" ? -delta : 0) } }));
            }}>
              <circle cx={points[key].x} cy={points[key].y} r="12" fill="#2457ff" stroke="#fff" strokeWidth="4" />
              <text x={points[key].x - 8} y={points[key].y - 20} fill="#102766" fontSize="18" fontWeight="950">{key.toUpperCase()}</text>
            </g>
          ))}
        </svg>
        <div className="geometry-tool-palette" aria-label="Geometry tools">
          {["Select", "Point", "Line", "Segment", "Circle", "Polygon", "Text"].map((tool, index) => <button key={tool} type="button" className={index === 0 ? "is-active" : ""}>{tool}</button>)}
        </div>
        <div className="geometry-live-measures">
          <span>Perimeter <strong>{perimeter.toFixed(2)} units</strong></span>
          <span>Area <strong>{area.toFixed(2)} sq units</strong></span>
          <span>{mode === "measure" ? `Radius ${(radius / 42).toFixed(2)}` : mode === "transform" ? "Transform preserves angle" : "Drag A, B or C"}</span>
        </div>
      </div>
      <div className="geometry-studio-actions">
        <button type="button"><Play className="h-4 w-4" />Play</button>
        <button type="button" onClick={() => setPoints(initial)}>Reset</button>
        <button type="button">Expand</button>
        <Link to="/math-lab/geometry">Open workspace <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>
  );
}

function AngleArc({ at, from, to, label, color }: { at: GeometryPoint; from: GeometryPoint; to: GeometryPoint; label: string; color: string }) {
  const a1 = Math.atan2(from.y - at.y, from.x - at.x);
  const a2 = Math.atan2(to.y - at.y, to.x - at.x);
  const r = 38;
  const p1 = { x: at.x + Math.cos(a1) * r, y: at.y + Math.sin(a1) * r };
  const p2 = { x: at.x + Math.cos(a2) * r, y: at.y + Math.sin(a2) * r };
  const mid = { x: at.x + Math.cos((a1 + a2) / 2) * 55, y: at.y + Math.sin((a1 + a2) / 2) * 55 };
  return <g><path d={`M${p1.x} ${p1.y} A${r} ${r} 0 0 1 ${p2.x} ${p2.y}`} fill="none" stroke={color} strokeWidth="3" /><text x={mid.x - 14} y={mid.y} fill={color} fontSize="15" fontWeight="950">{label}</text></g>;
}

function SideLabel({ p1, p2, text }: { p1: GeometryPoint; p2: GeometryPoint; text: string }) {
  return <text x={(p1.x + p2.x) / 2 - 16} y={(p1.y + p2.y) / 2 - 12} fill="#0891b2" fontSize="16" fontWeight="950">{text}</text>;
}

function GeometryPathwayCard({ topic, subtopic, index, progress }: { topic: LearningTopic; subtopic: LearningSubtopic; index: number; progress: number }) {
  return (
    <Link className="geometry-pathway-card" style={{ "--geometry-accent": geometryAccent(index) } as CSSProperties} to={`/learn/${topic.slug}/${subtopic.slug}`}>
      <div className="geometry-pathway-top">
        <span>{index + 1}</span>
        <div>
          <h3>{subtopic.title}</h3>
          <p>{subtopic.description}</p>
        </div>
      </div>
      <GeometryPathwayVisual type={subtopic.slug} />
      <div className="learn-card-meta">
        <span>{subtopic.lessons.length} lessons</span>
        <span>{subtopic.classRange}</span>
        <span>{dominantFormat(subtopic.lessons)}</span>
      </div>
      <div className="learn-skill-chips">
        {skillChips(subtopic).map((chip) => <span key={chip}>{chip}</span>)}
      </div>
      <div className="geometry-card-progress"><strong>{progress}%</strong><em><span style={{ width: `${progress}%` }} /></em><small>Explore pathway <ArrowRight className="h-4 w-4" /></small></div>
    </Link>
  );
}

function GeometryPathwayVisual({ type }: { type: string }) {
  return (
    <div className="geometry-pathway-visual">
      <svg viewBox="0 0 430 330" role="img" aria-label={`${type} geometry pathway visual`}>
        {type.includes("shapes") ? (
          <g>
            <line x1="58" y1="166" x2="372" y2="166" stroke="#0f172a" strokeWidth="4" />
            <circle cx="58" cy="166" r="8" fill="#2457ff" /><circle cx="372" cy="166" r="8" fill="#2457ff" />
            <line x1="215" y1="68" x2="215" y2="264" stroke="#16a34a" strokeDasharray="7 7" strokeWidth="3" />
            <path d="M174 100 A54 54 0 0 1 256 100 M174 232 A54 54 0 0 0 256 232" fill="none" stroke="#16a34a" strokeWidth="3" />
            <circle cx="215" cy="166" r="7" fill="#475569" />
            <text x="45" y="146" fill="#2457ff" fontSize="14" fontWeight="950">A</text><text x="366" y="146" fill="#2457ff" fontSize="14" fontWeight="950">B</text><text x="226" y="78" fill="#102766" fontSize="14" fontWeight="950">P</text><text x="226" y="264" fill="#102766" fontSize="14" fontWeight="950">Q</text>
          </g>
        ) : type.includes("triangles") ? (
          <g>
            <circle cx="218" cy="160" r="125" fill="#eff6ff" stroke="#93c5fd" strokeWidth="3" />
            <polygon points="218,54 80,244 356,244" fill="#e0f2fe" opacity=".55" stroke="#2457ff" strokeWidth="4" />
            <line x1="218" y1="54" x2="80" y2="244" stroke="#2457ff" strokeWidth="4" /><line x1="218" y1="54" x2="356" y2="244" stroke="#2457ff" strokeWidth="4" /><line x1="80" y1="244" x2="356" y2="244" stroke="#7c3aed" strokeWidth="4" />
            <circle cx="218" cy="54" r="8" fill="#2457ff" /><circle cx="80" cy="244" r="8" fill="#2457ff" /><circle cx="356" cy="244" r="8" fill="#2457ff" />
            <text x="203" y="96" fill="#f97316" fontSize="16" fontWeight="950">70°</text><text x="116" y="226" fill="#f97316" fontSize="16" fontWeight="950">55°</text><text x="305" y="226" fill="#f97316" fontSize="16" fontWeight="950">55°</text>
            <rect x="142" y="276" width="170" height="28" rx="14" fill="#ecfeff" stroke="#bae6fd" /><text x="160" y="295" fill="#075985" fontSize="13" fontWeight="950">Prove: isosceles</text>
          </g>
        ) : (
          <g>
            <Grid />
            <line x1="42" y1="168" x2="390" y2="168" stroke="#0f172a" strokeWidth="2" />
            <line x1="216" y1="36" x2="216" y2="292" stroke="#0f172a" strokeWidth="2" />
            <polygon points="126,124 294,88 350,224 188,260" fill="#ddd6fe" opacity=".72" stroke="#7c3aed" strokeWidth="4" />
            <path d="M350 224 C394 170 378 126 316 98" fill="none" stroke="#16a34a" strokeDasharray="7 7" strokeWidth="3" />
            <circle cx="126" cy="124" r="8" fill="#2457ff" /><circle cx="294" cy="88" r="8" fill="#2457ff" /><circle cx="350" cy="224" r="8" fill="#2457ff" />
            <text x="86" y="112" fill="#102766" fontSize="14" fontWeight="950">A(-2,1)</text><text x="284" y="70" fill="#102766" fontSize="14" fontWeight="950">B(3,4)</text><text x="312" y="248" fill="#102766" fontSize="14" fontWeight="950">C(5,-1)</text>
          </g>
        )}
      </svg>
    </div>
  );
}

function GeometryMethodStrip() {
  const steps = [
    ["Predict", "Predict geometric outcomes before you construct."],
    ["Construct", "Build figures precisely using tools and strategies."],
    ["Observe", "Move, measure, and collect evidence to spot invariants."],
    ["Prove", "Prove results with logic and clear justification."],
  ];
  return (
    <div className="geometry-method-strip">
      {steps.map(([title, text], index) => <article key={title}><span>{index + 1}</span><strong>{title}</strong><p>{text}</p></article>)}
    </div>
  );
}

function TrigonometryMaster({ topic }: { topic: LearningTopic }) {
  const palette = paletteFor(topic.slug);
  const totalLessons = countTopicLessons(topic);
  const firstLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons)[0] ?? null;
  const progress = [64, 52, 48];

  return (
    <main className="learn-topic-page learn-master trigonometry-master" style={paletteVars(palette)} data-topic={topic.slug}>
      <Breadcrumbs current={topic.title} />

      <section className="trig-hero" aria-labelledby="trig-title">
        <div className="trig-hero-copy">
          <p className="learn-kicker">Trigonometry</p>
          <h1 id="trig-title">Measure angles. Reveal motion.</h1>
          <p>Connect right triangles, unit circles, identities and waves through one shared angle theta. See relationships, build intuition and master the mathematics of rotation.</p>
          <div className="trig-stat-grid" aria-label="Trigonometry learning statistics">
            <Pill icon={Boxes} label={`${topic.subtopics.length} pathways`} />
            <Pill icon={BookOpen} label={`${totalLessons} interactive lessons`} />
            <Pill icon={GraduationCap} label={topicClassRange(topic)} />
            <Pill icon={Clock3} label={`${topicMinutes(topic)} min`} />
          </div>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={firstLesson?.route ?? `/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>Continue learning <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="#trig-pathways">Explore freely</Link>
          </div>
        </div>
        <TrigLab />
      </section>

      <section id="trig-pathways" className="trig-pathways" aria-labelledby="trig-pathways-title">
        <div className="trig-section-head">
          <p className="learn-kicker">Choose your trigonometry pathway</p>
          <h2 id="trig-pathways-title">3 connected pathways. One rhythm of angle and motion.</h2>
        </div>
        <div className="trig-pathway-grid">
          {topic.subtopics.map((subtopic, index) => (
            <TrigPathwayCard key={subtopic.slug} topic={topic} subtopic={subtopic} index={index} progress={progress[index] ?? 50} />
          ))}
        </div>
      </section>

      <section className="trig-method-panel" aria-labelledby="trig-method-title">
        <p className="learn-kicker">How learning works</p>
        <h2 id="trig-method-title" className="sr-only">Predict. Manipulate. Trace. Explain.</h2>
        <TrigMethodStrip />
      </section>

      <section className="trig-dashboard" aria-label="Recommended route and progress dashboard">
        <div>
          <p className="learn-kicker">Recommended route</p>
          <div className="trig-route-list">
            {topic.subtopics.map((subtopic, index) => (
              <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`}>
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{subtopic.title}</strong>
                <small>{subtopic.lessons.length} lessons</small>
              </Link>
            ))}
          </div>
          <Link className="trig-view-all" to="#trig-pathways">View full learning map <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="trig-progress-card">
          <p className="learn-kicker">Your progress</p>
          <div className="trig-progress-layout">
            <div className="trig-progress-ring" style={{ "--progress": "55%" } as CSSProperties}><span><strong>55%</strong><small>Overall progress</small></span></div>
            <div className="trig-progress-bars">
              {topic.subtopics.map((subtopic, index) => (
                <div key={subtopic.slug}>
                  <span>{subtopic.title}<b>{progress[index]}%</b></span>
                  <em><strong style={{ width: `${progress[index]}%`, background: trigAccent(index) }} /></em>
                </div>
              ))}
            </div>
          </div>
          <Link className="trig-view-all" to="/dashboard">Go to dashboard <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}

function TrigLab() {
  const [theta, setTheta] = useState(30);
  const [mode, setMode] = useState<"triangle" | "circle" | "wave">("triangle");
  const rad = theta * Math.PI / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const tan = Math.tan(rad);
  const adjacent = 7.5;
  const opposite = Math.max(0.05, adjacent * tan);
  const hyp = Math.hypot(adjacent, opposite);
  const px = 350 + cos * 88;
  const py = 132 - sin * 88;
  const waveX = 505 + (theta / 360) * 190;
  const waveY = 132 - sin * 72;

  return (
    <div className="trig-lab" aria-label="Synchronized trigonometry lab">
      <div className="trig-lab-tabs" role="tablist" aria-label="Trigonometry representations">
        {(["triangle", "circle", "wave"] as const).map((tab) => <button key={tab} type="button" className={mode === tab ? "is-active" : ""} aria-selected={mode === tab} onClick={() => setMode(tab)}>{tab === "circle" ? "Unit circle" : tab}</button>)}
      </div>
      <svg viewBox="0 0 760 360" role="img" aria-label="Right triangle, unit circle and sine wave linked by angle theta">
        <text x="28" y="34" fill="#0f766e" fontSize="13" fontWeight="950">RIGHT TRIANGLE</text>
        <path d={`M70 278 L250 278 L250 ${278 - opposite * 22} Z`} fill="#ecfdf5" stroke="#102766" strokeWidth="3" />
        <path d="M70 278 h32 v-32" fill="none" stroke="#94a3b8" strokeWidth="3" />
        <path d="M108 278 A38 38 0 0 0 95 248" fill="none" stroke="#059669" strokeWidth="4" />
        <text x="118" y="258" fill="#059669" fontSize="14" fontWeight="950">theta</text>
        <text x="154" y="298" fill="#0891b2" fontSize="14" fontWeight="950">adj {adjacent.toFixed(2)}</text>
        <text x="258" y={(278 - opposite * 11)} fill="#f97316" fontSize="14" fontWeight="950">opp {opposite.toFixed(2)}</text>
        <text x="148" y={(260 - opposite * 11)} fill="#102766" fontSize="14" fontWeight="950">hyp {hyp.toFixed(2)}</text>

        <text x="306" y="34" fill="#0f766e" fontSize="13" fontWeight="950">UNIT CIRCLE</text>
        <circle cx="350" cy="132" r="88" fill="#fff" stroke="#64748b" strokeWidth="2" />
        <line x1="250" x2="450" y1="132" y2="132" stroke="#102766" strokeWidth="2" />
        <line x1="350" x2="350" y1="28" y2="236" stroke="#102766" strokeWidth="2" />
        <line x1="350" x2={px} y1="132" y2={py} stroke="#059669" strokeWidth="5" />
        <line x1={px} x2={px} y1={py} y2="132" stroke="#06b6d4" strokeDasharray="5 5" strokeWidth="3" />
        <line x1="350" x2={px} y1="132" y2="132" stroke="#2563eb" strokeWidth="4" />
        <circle cx={px} cy={py} r="9" fill="#059669" stroke="#fff" strokeWidth="3" />
        <path d={`M390 132 A40 40 0 0 0 ${350 + Math.cos(rad) * 40} ${132 - Math.sin(rad) * 40}`} fill="none" stroke="#f97316" strokeWidth="4" />
        <text x={px + 8} y={py - 8} fill="#059669" fontSize="13" fontWeight="950">P(cos theta, sin theta)</text>
        <text x="376" y="154" fill="#2563eb" fontSize="13" fontWeight="950">cos theta</text>
        <text x={px + 8} y={(py + 132) / 2} fill="#06b6d4" fontSize="13" fontWeight="950">sin theta</text>

        <text x="534" y="34" fill="#0f766e" fontSize="13" fontWeight="950">SINE WAVE</text>
        <line x1="505" x2="715" y1="132" y2="132" stroke="#102766" strokeWidth="2" />
        <line x1="505" x2="505" y1="42" y2="222" stroke="#102766" strokeWidth="2" />
        <path d={Array.from({ length: 121 }, (_, index) => {
          const t = index / 120 * Math.PI * 2;
          return `${index === 0 ? "M" : "L"}${505 + index * 1.75} ${132 - Math.sin(t) * 72}`;
        }).join(" ")} fill="none" stroke="#06b6d4" strokeWidth="5" />
        <line x1={waveX} x2={waveX} y1={waveY} y2="132" stroke="#7c3aed" strokeDasharray="5 5" strokeWidth="3" />
        <circle cx={waveX} cy={waveY} r="10" fill="#7c3aed" />
        <text x="646" y="162" fill="#102766" fontSize="12" fontWeight="900">pi</text>
        <text x="694" y="162" fill="#102766" fontSize="12" fontWeight="900">2pi</text>
      </svg>
      <div className="trig-values">
        <span>theta = {theta}°</span>
        <span>{formatRadians(theta)}</span>
        <span>sin = {sin.toFixed(4)}</span>
        <span>cos = {cos.toFixed(4)}</span>
        <span>tan = {Number.isFinite(tan) ? tan.toFixed(4) : "undefined"}</span>
      </div>
      <label className="trig-angle-slider"><span>Angle theta <strong>{theta}°</strong></span><input type="range" min="0" max="360" value={theta} onChange={(event) => setTheta(Number(event.target.value))} /></label>
      <div className="trig-lab-actions">
        <button type="button"><Play className="h-4 w-4" />Play</button>
        <button type="button" onClick={() => setTheta(30)}>Reset</button>
        <Link to="/math-lab/graphing-calculator">Open Workspace</Link>
      </div>
    </div>
  );
}

function TrigPathwayCard({ topic, subtopic, index, progress }: { topic: LearningTopic; subtopic: LearningSubtopic; index: number; progress: number }) {
  return (
    <Link className="trig-pathway-card" style={{ "--trig-accent": trigAccent(index) } as CSSProperties} to={`/learn/${topic.slug}/${subtopic.slug}`}>
      <div className="trig-pathway-top"><span>{index + 1}</span><div><h3>{subtopic.title}</h3><p>{subtopic.description}</p></div></div>
      <TrigPathwayVisual type={subtopic.slug} />
      <div className="learn-card-meta"><span>{subtopic.lessons.length} lessons</span><span>{subtopic.classRange}</span><span>{dominantFormat(subtopic.lessons)}</span></div>
      <div className="learn-skill-chips">{skillChips(subtopic).map((chip) => <span key={chip}>{chip}</span>)}</div>
      <div className="trig-card-progress"><strong>{progress}%</strong><em><span style={{ width: `${progress}%` }} /></em><small>Explore pathway <ArrowRight className="h-4 w-4" /></small></div>
    </Link>
  );
}

function TrigPathwayVisual({ type }: { type: string }) {
  return (
    <div className="trig-pathway-visual">
      <svg viewBox="0 0 430 330" role="img" aria-label={`${type} trigonometry pathway visual`}>
        {type.includes("ratios") ? (
          <g><path d="M62 254 L350 254 L350 86 Z" fill="#fff7ed" stroke="#102766" strokeWidth="3" /><path d="M62 254 A42 42 0 0 0 104 254" fill="none" stroke="#059669" strokeWidth="5" /><text x="80" y="242" fill="#059669" fontSize="15" fontWeight="950">theta</text><text x="178" y="278" fill="#0891b2" fontSize="14" fontWeight="950">adjacent = 12</text><text x="358" y="170" fill="#f97316" fontSize="14" fontWeight="950">opposite = 9</text><text x="165" y="122" fill="#102766" fontSize="14" fontWeight="950">hypotenuse = 15</text><rect x="52" y="286" width="330" height="28" rx="14" fill="#ecfdf5" stroke="#bbf7d0" /><text x="72" y="305" fill="#047857" fontSize="13" fontWeight="950">sin=0.6000  cos=0.8000  tan=0.7500</text></g>
        ) : type.includes("identities") ? (
          <g><text x="52" y="42" fill="#102766" fontSize="15" fontWeight="950">Prove: sin^2 theta + cos^2 theta = 1</text><circle cx="210" cy="154" r="90" fill="#fff" stroke="#64748b" strokeWidth="2" /><line x1="110" x2="310" y1="154" y2="154" stroke="#102766" /><line x1="210" x2="210" y1="54" y2="254" stroke="#102766" /><line x1="210" y1="154" x2="270" y2="86" stroke="#059669" strokeWidth="5" /><line x1="270" y1="86" x2="270" y2="154" stroke="#f97316" strokeWidth="4" /><line x1="210" y1="154" x2="270" y2="154" stroke="#2563eb" strokeWidth="4" /><text x="276" y="122" fill="#f97316" fontSize="13" fontWeight="950">sin theta</text><text x="228" y="174" fill="#2563eb" fontSize="13" fontWeight="950">cos theta</text><rect x="58" y="276" width="300" height="30" rx="15" fill="#ecfdf5" stroke="#bbf7d0" /><text x="76" y="296" fill="#047857" fontSize="13" fontWeight="950">identity holds for every theta</text></g>
        ) : (
          <g><line x1="58" x2="374" y1="170" y2="170" stroke="#102766" strokeWidth="2" /><line x1="88" x2="88" y1="64" y2="276" stroke="#102766" strokeWidth="2" /><circle cx="142" cy="170" r="58" fill="#ecfeff" stroke="#06b6d4" strokeWidth="3" /><line x1="142" y1="170" x2="190" y2="138" stroke="#059669" strokeWidth="5" /><circle cx="190" cy="138" r="8" fill="#2563eb" /><path d="M236 170 C270 58 300 282 344 170 S404 58 426 170" fill="none" stroke="#06b6d4" strokeWidth="5" /><circle cx="304" cy="82" r="10" fill="#7c3aed" /><text x="70" y="302" fill="#2563eb" fontSize="15" fontWeight="950">y = A sin(B(x - C)) + D</text></g>
        )}
      </svg>
    </div>
  );
}

function TrigMethodStrip() {
  const steps = [["Predict", "Make a smart guess before you explore."], ["Manipulate", "Move, change, and observe in real time."], ["Trace", "Follow relationships across representations."], ["Explain", "State why it works in precise math language."]];
  return <div className="trig-method-strip">{steps.map(([title, text], index) => <article key={title}><span>{index + 1}</span><strong>{title}</strong><p>{text}</p></article>)}</div>;
}

function CalculusMaster({ topic }: { topic: LearningTopic }) {
  const palette = paletteFor(topic.slug);
  const totalLessons = countTopicLessons(topic);
  const firstLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons)[0] ?? null;

  return (
    <main className="learn-topic-page learn-master calculus-master" style={paletteVars(palette)} data-topic={topic.slug}>
      <Breadcrumbs current={topic.title} />
      <header className="calculus-page-heading" aria-labelledby="calculus-page-title">
        <p className="learn-kicker">Main topic</p>
        <h1 id="calculus-page-title">Calculus</h1>
      </header>

      <section className="calculus-hero" aria-labelledby="calculus-title">
        <div className="calculus-hero-copy">
          <p className="learn-kicker">Calculus studio</p>
          <h2 id="calculus-title">See change become structure.</h2>
          <p className="calculus-tagline">Limits approach. Derivatives move. Integrals accumulate.</p>
          <p className="calculus-summary">Explore calculus through dynamic visuals, real-time manipulation, and step-by-step reasoning. Build intuition, prove ideas, and solve with confidence.</p>
          <div className="calculus-stat-grid" aria-label="Calculus learning statistics">
            <Pill icon={Boxes} label={`${topic.subtopics.length} pathways`} />
            <Pill icon={BookOpen} label={`${totalLessons} interactive lessons`} />
            <Pill icon={GraduationCap} label={topicClassRange(topic)} />
            <Pill icon={Clock3} label={`${topicMinutes(topic)} min learning time`} />
          </div>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={firstLesson?.route ?? `/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>Continue learning <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="/math-lab/graphing-calculator">Open free studio</Link>
          </div>
        </div>
        <CalculusLiveGraph />
      </section>

      <section id="calculus-pathways" className="calculus-pathways" aria-labelledby="calculus-pathways-title">
        <div className="calculus-section-head">
          <h2 id="calculus-pathways-title">One curve. <span>Three ways</span> to understand change.</h2>
          <p>Limits describe approach, derivatives describe local change, and integrals describe accumulation.</p>
        </div>
        <div className="calculus-pathway-grid">
          {topic.subtopics.map((subtopic, index) => (
            <CalculusPathwayCard key={subtopic.slug} topic={topic} subtopic={subtopic} index={index} />
          ))}
        </div>
      </section>

      <section className="calculus-method-panel" aria-labelledby="calculus-method-title">
        <p className="learn-kicker">How learning works</p>
        <h2 id="calculus-method-title">Predict. Manipulate. Observe. Explain.</h2>
        <LearningMethodStrip />
      </section>

      <section className="calculus-dashboard" aria-label="Recommended route and progress dashboard">
        <div>
          <p className="learn-kicker">Recommended route</p>
          <div className="calculus-route-list">
            {topic.subtopics.map((subtopic, index) => (
              <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`}>
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{subtopic.title}</strong>
                <small>{subtopic.lessons.length} lessons</small>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
        <div className="calculus-progress-card">
          <p className="learn-kicker">Your progress</p>
          <div className="calculus-progress-layout">
            <div className="calculus-progress-ring" style={{ "--progress": "7%" } as CSSProperties}><span><strong>7%</strong><small>overall</small></span></div>
            <div className="calculus-progress-bars">
              {topic.subtopics.map((subtopic, index) => {
                const progress = [6, 8, 5][index] ?? 4;
                return (
                  <div key={subtopic.slug}>
                    <span><i style={{ background: calculusAccent(index) }} />{subtopic.title}<b>{progress}%</b></span>
                    <em><strong style={{ width: `${progress}%`, background: calculusAccent(index) }} /></em>
                  </div>
                );
              })}
              <Link className="learn-secondary" to={`/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>View full progress <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CalculusLiveGraph() {
  const [t, setT] = useState(0.55);
  const a = -1.2 + t * 1.8;
  const pointX = 365 + (t - 0.5) * 210;
  const pointY = 184 - Math.sin(t * Math.PI * 1.35) * 78;
  const h = 0.05 + t * 0.35;
  const slope = 2 + (t - 0.55) * 1.6;
  const area = 1.1 + t * 0.42;
  return (
    <div className="calculus-live-graph" aria-label="Change Lab interactive calculus graph preview">
      <div className="calculus-graph-toolbar">
        <strong>Change Lab</strong>
        <div className="calculus-mode-tabs" aria-label="Calculus lab modes">
          <button type="button">Limit</button>
          <button type="button" className="is-active">Slope</button>
          <button type="button">Area</button>
        </div>
      </div>
      <div className="calculus-equation-row">
        <span>f(x) = x^3 - 3x + 1</span>
        <button type="button"><Play className="h-4 w-4" />Play</button>
        <button type="button" onClick={() => setT(0.55)}>Reset</button>
      </div>
      <svg viewBox="0 0 720 430" role="img" aria-label="Cubic graph with limit window, tangent point, and area preview">
        <Grid />
        <line x1="72" x2="660" y1="230" y2="230" stroke="#1f2d5b" strokeWidth="2" />
        <line x1="360" x2="360" y1="58" y2="370" stroke="#1f2d5b" strokeWidth="2" />
        <path d="M104 346 C170 90 266 112 335 204 S468 344 624 72" fill="none" stroke="#4f46e5" strokeWidth="7" strokeLinecap="round" />
        <path d="M260 230 C278 178 308 144 335 150 L335 230 Z" fill="#93c5fd" opacity=".38" />
        <path d={`M${pointX - 82} ${pointY + 58} L${pointX + 82} ${pointY - 58}`} stroke="#ec4899" strokeWidth="5" strokeLinecap="round" />
        <path d={`M${pointX - 6} ${pointY} L${pointX + 78} ${pointY + 82}`} stroke="#2563eb" strokeWidth="3" strokeDasharray="7 6" />
        <line x1={pointX} x2={pointX} y1={pointY} y2="230" stroke="#ec4899" strokeDasharray="6 6" strokeWidth="2" />
        <line x1={pointX} x2={pointX + 92} y1="346" y2="346" stroke="#102766" strokeWidth="2" />
        <text x={pointX + 42} y="378" fill="#102766" fontSize="20" fontWeight="950">h</text>
        <circle cx="286" cy="148" r="12" fill="#fff" stroke="#4f46e5" strokeWidth="5" />
        <circle cx="490" cy="294" r="12" fill="#fff" stroke="#4f46e5" strokeWidth="5" />
        <circle cx={pointX} cy={pointY} r="13" fill="#ec4899" />
        <circle cx={pointX + 92} cy={pointY - 58} r="13" fill="#2563eb" />
        <rect x={pointX + 16} y={pointY - 30} width="74" height="28" rx="9" fill="#2563eb" />
        <text x={pointX + 28} y={pointY - 11} fill="#fff" fontSize="13" fontWeight="950">x = a + h</text>
        <text x="608" y="214" fill="#1f2d5b" fontSize="14" fontWeight="900">x</text>
        <text x="374" y="74" fill="#1f2d5b" fontSize="14" fontWeight="900">y</text>
      </svg>
      <div className="calculus-result-cards">
        <span>f(a)<strong>{a.toFixed(4)}</strong></span>
        <span>Slope (at a)<strong>{slope.toFixed(4)}</strong></span>
        <span>Area [a, a + h]<strong>{area.toFixed(4)}</strong></span>
      </div>
      <div className="calculus-slider-row">
        <label><span>a = {a.toFixed(2)}</span><input type="range" min="0" max="1" step="0.01" value={t} onChange={(event) => setT(Number(event.target.value))} /></label>
        <label><span>b = {(0.8 - t * 0.2).toFixed(2)}</span><input type="range" min="0" max="1" step="0.01" value={1 - t / 2} onChange={(event) => setT(2 - Number(event.target.value) * 2)} /></label>
        <label><span>h = {h.toFixed(2)}</span><input type="range" min="0" max="1" step="0.01" value={t} onChange={(event) => setT(Number(event.target.value))} /></label>
      </div>
    </div>
  );
}

function CalculusPathwayCard({ topic, subtopic, index }: { topic: LearningTopic; subtopic: LearningSubtopic; index: number }) {
  const progress = [6, 8, 5][index] ?? 5;
  return (
    <Link className="calculus-pathway-card" style={{ "--calculus-accent": calculusAccent(index) } as CSSProperties} to={`/learn/${topic.slug}/${subtopic.slug}`}>
      <div className="calculus-pathway-top">
        <span>{index + 1}</span>
        <h3>{subtopic.title}</h3>
        <ArrowRight className="h-5 w-5" />
      </div>
      <p>{subtopic.description}</p>
      <CalculusPathwayVisual type={subtopic.slug} />
      <div className="learn-card-meta">
        <span>{subtopic.lessons.length} lessons</span>
        <span>{subtopic.classRange}</span>
        <span>{dominantFormat(subtopic.lessons)}</span>
      </div>
      <div className="learn-skill-chips">
        {skillChips(subtopic).map((chip) => <span key={chip}>{chip}</span>)}
      </div>
      <div className="learn-progress-track"><span style={{ width: `${progress}%` }} /></div>
      <strong className="learn-explore-action">Explore pathway <ArrowRight className="h-4 w-4" /></strong>
    </Link>
  );
}

function CalculusPathwayVisual({ type }: { type: string }) {
  return (
    <div className="calculus-pathway-visual">
      <svg viewBox="0 0 420 250" role="img" aria-label={`${type} calculus pathway visual`}>
        <Grid />
        {type.includes("limits") ? (
          <g>
            <path d="M42 174 C104 122 152 118 206 92 C242 75 268 98 286 122" fill="none" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round" />
            <path d="M306 164 C344 132 376 132 398 118" fill="none" stroke="#7c3aed" strokeWidth="4" strokeDasharray="7 6" />
            <line x1="222" x2="222" y1="72" y2="198" stroke="#94a3b8" strokeDasharray="5 5" />
            <circle cx="222" cy="92" r="10" fill="#fff" stroke="#7c3aed" strokeWidth="4" />
            <circle cx="306" cy="164" r="10" fill="#7c3aed" />
            <text x="272" y="70" fill="#7c3aed" fontSize="18" fontWeight="900">f(x)</text>
          </g>
        ) : type.includes("derivatives") ? (
          <g>
            <path d="M38 176 C118 206 188 95 270 132 S340 144 394 104" fill="none" stroke="#2563eb" strokeWidth="6" />
            <line x1="68" x2="378" y1="214" y2="56" stroke="#2563eb" strokeWidth="4" />
            <circle cx="214" cy="140" r="10" fill="#fff" stroke="#2563eb" strokeWidth="4" />
            <rect x="160" y="84" width="104" height="40" rx="11" fill="#fff" stroke="#bfdbfe" />
            <text x="178" y="109" fill="#1d4ed8" fontSize="16" fontWeight="900">Slope = 1.45</text>
          </g>
        ) : (
          <g>
            <path d="M42 152 C104 84 158 110 208 128 S308 196 388 86" fill="none" stroke="#ec4899" strokeWidth="6" />
            {Array.from({ length: 10 }, (_, i) => <rect key={i} x={62 + i * 30} y={128 - Math.sin(i * 0.75) * 26} width="24" height={92 + Math.sin(i * 0.75) * 26} fill="#f9a8d4" opacity=".44" stroke="#ec4899" />)}
            <text x="318" y="74" fill="#ec4899" fontSize="18" fontWeight="900">f(x)</text>
          </g>
        )}
      </svg>
    </div>
  );
}

const statisticsPathwayMeta = [
  { progress: 64, description: "Summarize, visualize, and understand data distributions.", chips: ["Data summaries", "Visualizations", "Outliers"], level: "Classes 6-12" },
  { progress: 58, description: "Model chance with trees, simulations, and conditional reasoning.", chips: ["Trees", "Simulations", "Conditional probability"], level: "Classes 8-12" },
  { progress: 52, description: "Estimate, test, and draw conclusions from samples.", chips: ["Hypothesis testing", "Confidence intervals", "P-values"], level: "Advanced" },
];

function StatisticsMaster({ topic }: { topic: LearningTopic }) {
  const palette = paletteFor(topic.slug);
  const totalLessons = countTopicLessons(topic);
  const firstLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons)[0] ?? null;

  return (
    <main className="learn-topic-page learn-master statistics-master" style={paletteVars(palette)} data-topic={topic.slug}>
      <Breadcrumbs current={topic.title} />

      <section className="statistics-hero" aria-labelledby="statistics-title">
        <div className="statistics-hero-copy">
          <p className="learn-kicker">Statistics & Probability</p>
          <h1 id="statistics-title">Turn uncertainty into insight.</h1>
          <p>Explore data, model chance, and reason from evidence through interactive visual labs.</p>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={firstLesson?.route ?? `/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}><Play className="h-4 w-4" />Start learning</Link>
            <Link className="learn-secondary" to="#statistics-pathways">Explore freely <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="statistics-stat-grid" aria-label="Statistics and probability learning statistics">
            <Pill icon={Boxes} label={`${topic.subtopics.length} pathways`} />
            <Pill icon={BookOpen} label={`${totalLessons} lessons`} />
            <Pill icon={GraduationCap} label={topicClassRange(topic)} />
            <Pill icon={Clock3} label={`${topicMinutes(topic)} min`} />
          </div>
        </div>
        <SamplingDistributionLab />
      </section>

      <section id="statistics-pathways" className="statistics-pathways" aria-labelledby="statistics-pathways-title">
        <div className="statistics-section-head">
          <div>
            <h2 id="statistics-pathways-title">Choose your pathway</h2>
            <p>Three connected pathways. One coherent statistics story.</p>
          </div>
          <Link to="#statistics-method">How learning works</Link>
        </div>
        <div className="statistics-pathway-grid">
          {topic.subtopics.map((subtopic, index) => (
            <StatisticsPathwayCard key={subtopic.slug} topic={topic} subtopic={subtopic} index={index} />
          ))}
        </div>
      </section>

      <section id="statistics-method" className="statistics-method-panel" aria-labelledby="statistics-method-title">
        <p className="learn-kicker">How learning works</p>
        <h2 id="statistics-method-title" className="sr-only">Predict. Manipulate. Observe. Explain.</h2>
        <StatisticsMethodStrip />
      </section>

      <section className="statistics-dashboard" aria-label="Recommended route and progress dashboard">
        <div>
          <p className="learn-kicker">Recommended route</p>
          <div className="statistics-route-list">
            {topic.subtopics.map((subtopic, index) => (
              <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`} style={{ "--stats-accent": statisticsAccent(index) } as CSSProperties}>
                <span>{String.fromCharCode(65 + index)}</span>
                <strong>{subtopic.title}</strong>
                <small>{subtopic.lessons.length} lessons</small>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>
        <div className="statistics-progress-card">
          <p className="learn-kicker">Your progress</p>
          <div className="statistics-progress-layout">
            <div className="statistics-progress-ring" style={{ "--progress": "58%" } as CSSProperties}><span><strong>58%</strong><small>overall progress</small></span></div>
            <div className="statistics-progress-bars">
              {topic.subtopics.map((subtopic, index) => {
                const progress = statisticsPathwayMeta[index]?.progress ?? 44;
                return (
                  <div key={subtopic.slug}>
                    <span>{subtopic.title}<b>{progress}%</b></span>
                    <em><strong style={{ width: `${progress}%`, background: statisticsAccent(index) }} /></em>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SamplingDistributionLab() {
  const [sampleSize, setSampleSize] = useState(30);
  const [mean, setMean] = useState(50);
  const [stdDev, setStdDev] = useState(10);
  const [phase, setPhase] = useState(0.46);
  const [isPlaying, setIsPlaying] = useState(false);
  const standardError = stdDev / Math.sqrt(sampleSize);
  const ciLow = mean - 1.96 * standardError;
  const ciHigh = mean + 1.96 * standardError;
  const sampleMean = mean + Math.sin(phase * Math.PI * 2) * standardError * 0.68;
  const bars = Array.from({ length: 18 }, (_, index) => {
    const z = (index - 8.5) / 3.35;
    return Math.exp(-0.5 * z * z);
  });
  const maxBar = Math.max(...bars);
  const dots = Array.from({ length: 9 }, (_, index) => {
    const offset = Math.sin((phase + index * 0.17) * Math.PI * 2) * standardError * 1.9;
    return { x: 146 + ((mean + offset - (mean - 4 * standardError)) / (8 * standardError)) * 420, y: 258 + (index % 3) * 25 };
  });

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => setPhase((value) => (value + 0.035) % 1), 250);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="sampling-lab" aria-label="Sampling Distribution Lab">
      <div className="sampling-lab-toolbar">
        <strong>Sampling distribution of x-bar <span>(n = {sampleSize})</span></strong>
        <div><span>mu = {mean}</span><span>sigma = {stdDev}</span><span>n = {sampleSize}</span></div>
      </div>
      <div className="sampling-lab-body">
        <svg viewBox="0 0 760 360" role="img" aria-label={`Sampling distribution with mean ${mean}, sample size ${sampleSize}, and 95 percent confidence interval from ${ciLow.toFixed(2)} to ${ciHigh.toFixed(2)}`}>
          <line x1="86" x2="648" y1="248" y2="248" stroke="#42516f" strokeWidth="2" />
          <line x1="86" x2="86" y1="52" y2="248" stroke="#42516f" strokeWidth="2" />
          <text x="46" y="158" fill="#102766" fontSize="14" fontWeight="900" transform="rotate(-90 46 158)">Frequency</text>
          {bars.map((height, index) => {
            const x = 180 + index * 22;
            const barHeight = 28 + (height / maxBar) * 116;
            return <rect key={index} className="sampling-bar" x={x} y={248 - barHeight} width="19" height={barHeight} rx="3" fill="#67d5ee" opacity=".82" style={{ animationDelay: `${index * 28}ms` }} />;
          })}
          <path d="M126 244 C198 232 226 124 324 104 S486 146 608 242" fill="none" stroke="#7c3aed" strokeWidth="4" />
          <rect x="318" y="88" width="160" height="160" rx="12" fill="#7c3aed" opacity=".12" />
          <line x1="318" x2="318" y1="70" y2="248" stroke="#7c3aed" strokeDasharray="7 7" strokeWidth="3" />
          <line x1="478" x2="478" y1="70" y2="248" stroke="#7c3aed" strokeDasharray="7 7" strokeWidth="3" />
          <line x1="398" x2="398" y1="58" y2="248" stroke="#0891b2" strokeDasharray="5 5" strokeWidth="3" />
          <text x="372" y="68" fill="#7c3aed" fontSize="16" fontWeight="950">x-bar = {sampleMean.toFixed(1)}</text>
          {dots.map((dot, index) => <circle key={index} className="sampling-dot" cx={dot.x} cy={dot.y} r="7" fill={index === 3 ? "#7c3aed" : "#4f46e5"} opacity=".9" style={{ animationDelay: `${index * 40}ms` }} />)}
          <rect x="304" y="300" width="196" height="30" rx="13" fill="#ede9fe" />
          <text x="324" y="320" fill="#7c3aed" fontSize="15" fontWeight="950">95% CI: [{ciLow.toFixed(2)}, {ciHigh.toFixed(2)}]</text>
          {[mean - 3 * standardError, mean - standardError, mean, mean + standardError, mean + 3 * standardError].map((value, index) => <text key={index} x={126 + index * 122} y="274" fill="#53627f" fontSize="13" fontWeight="850">{value.toFixed(0)}</text>)}
        </svg>
        <div className="sampling-controls" aria-label="Sampling distribution controls">
          <strong>Controls</strong>
          <label><span>Sample size (n)<b>{sampleSize}</b></span><input aria-label="Sample size" type="range" min="10" max="100" step="5" value={sampleSize} onChange={(event) => setSampleSize(Number(event.target.value))} /></label>
          <label><span>Mean (mu)<b>{mean}</b></span><input aria-label="Mean" type="range" min="35" max="65" value={mean} onChange={(event) => setMean(Number(event.target.value))} /></label>
          <label><span>Std. dev. (sigma)<b>{stdDev}</b></span><input aria-label="Standard deviation" type="range" min="4" max="18" value={stdDev} onChange={(event) => setStdDev(Number(event.target.value))} /></label>
          <div className="sampling-actions">
            <button type="button" aria-pressed={isPlaying} onClick={() => setIsPlaying((value) => !value)}><Play className="h-4 w-4" />{isPlaying ? "Pause" : "Play"}</button>
            <button type="button" onClick={() => { setSampleSize(30); setMean(50); setStdDev(10); setPhase(0.46); setIsPlaying(false); }}>Reset</button>
          </div>
        </div>
      </div>
      <div className="sampling-legend" aria-label="Sampling distribution legend">
        <span><i />Sample means</span><span><i />Population mean</span><span><i />Confidence interval</span>
      </div>
    </div>
  );
}

function StatisticsPathwayCard({ topic, subtopic, index }: { topic: LearningTopic; subtopic: LearningSubtopic; index: number }) {
  const meta = statisticsPathwayMeta[index] ?? statisticsPathwayMeta[0];
  return (
    <Link className="statistics-pathway-card" style={{ "--stats-accent": statisticsAccent(index) } as CSSProperties} to={`/learn/${topic.slug}/${subtopic.slug}`}>
      <div className="statistics-card-top">
        <span>{index + 1}</span>
        <div>
          <h3>{subtopic.title}</h3>
          <p>{meta.description}</p>
        </div>
        <ArrowRight className="h-5 w-5" />
      </div>
      <div className="statistics-card-meta"><span>{subtopic.lessons.length} lessons</span><span>{meta.level}</span></div>
      <StatisticsPathwayPreview type={subtopic.slug} />
      <div className="learn-skill-chips">{meta.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
      <div className="statistics-card-progress"><strong>{meta.progress}% complete</strong><em><span style={{ width: `${meta.progress}%` }} /></em><small>Explore pathway <ArrowRight className="h-4 w-4" /></small></div>
    </Link>
  );
}

function StatisticsPathwayPreview({ type }: { type: string }) {
  if (type.includes("probability")) return <ProbabilityModelPreview />;
  if (type.includes("inference")) return <InferencePreview />;
  return <DataDistributionPreview />;
}

function DataDistributionPreview() {
  return (
    <div className="statistics-preview">
      <svg viewBox="0 0 520 270" role="img" aria-label="Histogram, box plot, and observation scatter preview">
        <text x="52" y="34" fill="#102766" fontSize="14" fontWeight="950">Histogram</text>
        {[22, 46, 78, 108, 88, 52, 24].map((h, i) => <rect key={i} x={42 + i * 22} y={150 - h} width="18" height={h} rx="3" fill="#fb7185" opacity=".78" />)}
        <line x1="36" x2="210" y1="152" y2="152" stroke="#64748b" />
        <text x="226" y="34" fill="#102766" fontSize="14" fontWeight="950">Box plot</text>
        <line x1="230" x2="348" y1="102" y2="102" stroke="#0f766e" strokeWidth="3" />
        <rect x="266" y="82" width="56" height="40" rx="8" fill="#5eead4" stroke="#0f766e" strokeWidth="3" />
        <line x1="292" x2="292" y1="82" y2="122" stroke="#0f766e" strokeWidth="3" />
        <text x="376" y="34" fill="#102766" fontSize="14" fontWeight="950">Observations</text>
        {[[388, 84], [420, 122], [450, 78], [478, 132], [404, 154], [466, 108], [492, 72]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="7" fill="#22c1c3" opacity=".78" />)}
        <text x="42" y="204" fill="#be123c" fontSize="13" fontWeight="900">Filter range</text>
        <line x1="140" x2="452" y1="200" y2="200" stroke="#bfdbfe" strokeWidth="8" strokeLinecap="round" />
        <line x1="166" x2="424" y1="200" y2="200" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" />
        <circle cx="166" cy="200" r="10" fill="#fff" stroke="#2563eb" strokeWidth="4" />
        <circle cx="424" cy="200" r="10" fill="#fff" stroke="#2563eb" strokeWidth="4" />
      </svg>
    </div>
  );
}

function ProbabilityModelPreview() {
  return (
    <div className="statistics-preview">
      <svg viewBox="0 0 520 270" role="img" aria-label="Probability tree, outcome grid, and outcome probability bars">
        <text x="42" y="34" fill="#102766" fontSize="14" fontWeight="950">Probability tree</text>
        <circle cx="92" cy="76" r="7" fill="#7c3aed" /><circle cx="164" cy="42" r="7" fill="#7c3aed" /><circle cx="164" cy="112" r="7" fill="#7c3aed" /><circle cx="236" cy="24" r="7" fill="#7c3aed" /><circle cx="236" cy="64" r="7" fill="#7c3aed" /><circle cx="236" cy="100" r="7" fill="#7c3aed" /><circle cx="236" cy="140" r="7" fill="#7c3aed" />
        <path d="M98 74 L158 44 M98 78 L158 110 M170 42 L230 24 M170 42 L230 64 M170 112 L230 100 M170 112 L230 140" stroke="#7c3aed" strokeWidth="3" fill="none" />
        <text x="306" y="34" fill="#102766" fontSize="14" fontWeight="950">Outcomes</text>
        {["HH", "HT", "TH", "TT"].map((label, i) => <g key={label}><rect x={310 + (i % 2) * 54} y={52 + Math.floor(i / 2) * 48} width="40" height="34" rx="9" fill="#ede9fe" stroke="#a78bfa" /><text x={319 + (i % 2) * 54} y={74 + Math.floor(i / 2) * 48} fill="#4c1d95" fontSize="13" fontWeight="950">{label}</text></g>)}
        {["HH", "HT", "TH", "TT"].map((label, i) => <g key={`${label}-bar`}><text x="62" y={178 + i * 20} fill="#4c1d95" fontSize="13" fontWeight="950">{label}</text><rect x="104" y={168 + i * 20} width="118" height="9" rx="5" fill="#ede9fe" /><rect x="104" y={168 + i * 20} width={66 + i * 4} height="9" rx="5" fill="#7c3aed" /></g>)}
        <text x="256" y="210" fill="#4c1d95" fontSize="15" fontWeight="950">P(outcome) = 1/4</text>
      </svg>
    </div>
  );
}

function InferencePreview() {
  return (
    <div className="statistics-preview">
      <svg viewBox="0 0 520 270" role="img" aria-label="Inference preview with population, sample, confidence interval, and test markers">
        <text x="40" y="32" fill="#102766" fontSize="13" fontWeight="950">Sampling distribution under H0</text>
        <path d="M52 146 C92 24 146 24 188 146" fill="#ccfbf1" stroke="#0f9f8f" strokeWidth="4" />
        <line x1="46" x2="202" y1="146" y2="146" stroke="#64748b" />
        <text x="248" y="32" fill="#102766" fontSize="13" fontWeight="950">95% confidence interval</text>
        <path d="M246 146 C286 56 344 56 386 146" fill="#d1fae5" stroke="#10b981" strokeWidth="3" />
        <line x1="270" x2="360" y1="146" y2="146" stroke="#0f766e" strokeWidth="4" />
        <line x1="270" x2="270" y1="82" y2="158" stroke="#0f766e" strokeDasharray="5 5" />
        <line x1="360" x2="360" y1="82" y2="158" stroke="#0f766e" strokeDasharray="5 5" />
        <text x="258" y="76" fill="#0f766e" fontSize="14" fontWeight="950">-1.96</text><text x="348" y="76" fill="#0f766e" fontSize="14" fontWeight="950">1.96</text>
        <text x="76" y="216" fill="#102766" fontSize="13" fontWeight="950">Population</text>
        {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={58 + (i % 13) * 12} cy={188 + Math.floor(i / 13) * 15 + (i % 3) * 2} r="5" fill="#99f6e4" opacity=".85" />)}
        <path d="M154 218 L154 242 L250 242" stroke="#102766" strokeWidth="3" markerEnd="url(#stats-inference-arrow)" />
        <defs><marker id="stats-inference-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#102766" /></marker></defs>
        <text x="276" y="216" fill="#102766" fontSize="13" fontWeight="950">Sample</text>
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={270 + i * 18} cy="242" r="6" fill={i % 2 ? "#4f46e5" : "#06b6d4"} />)}
      </svg>
    </div>
  );
}

function StatisticsMethodStrip() {
  const steps = [["Predict", "Name what you expect before seeing the sample."], ["Manipulate", "Change sample size, mean, spread, or events."], ["Observe", "Compare visual evidence, intervals, and outcomes."], ["Explain", "Write the claim with uncertainty and context."]];
  return (
    <div className="statistics-method-strip">
      {steps.map(([title, text], index) => (
        <article key={title}>
          <span>{index + 1}</span>
          <strong>{title}</strong>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}

const vectorPathwayMeta = [
  { progress: 18, difficulty: "Beginner", cta: "Continue Vectors", description: "Magnitude, direction, projections, and dot products.", skills: ["Magnitude", "Direction", "Components", "Vector addition", "Dot products", "Projections", "Cross products"] },
  { progress: 0, difficulty: "Intermediate", cta: "Explore Transformations", description: "Move and transform space with matrices.", skills: ["Matrix operations", "Linear transformations", "Rotation", "Reflection", "Scaling", "Shearing", "Composition"] },
  { progress: 0, difficulty: "Intermediate+", cta: "Explore 3D Geometry", description: "Lines, planes, surfaces, solids, and cross-sections.", skills: ["Lines", "Planes", "Surfaces", "Solids", "Intersections", "Cross-sections", "Distances and angles"] },
];

function Vectors3DMaster({ topic }: { topic: LearningTopic }) {
  const palette = paletteFor(topic.slug);
  const totalLessons = countTopicLessons(topic);
  const totalMinutes = topicMinutes(topic);
  const firstLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons)[0] ?? null;
  const recommendedLesson = topic.subtopics[0]?.lessons.find((lesson) => /addition|dot|projection|vector/i.test(lesson.title)) ?? firstLesson;

  return (
    <main className="learn-topic-page learn-master vectors3d-master" style={paletteVars(palette)} data-topic={topic.slug}>
      <nav className="vectors3d-breadcrumbs" aria-label="Learning breadcrumbs">
        <Link to="/learn">Learning Hub</Link><span>/</span>
        <Link to="/learn/advanced-mathematics">Advanced Mathematics</Link><span>/</span>
        <strong>Vectors &amp; 3D</strong>
      </nav>

      <section className="vectors3d-hero" aria-labelledby="vectors3d-title">
        <div className="vectors3d-hero-copy">
          <p className="learn-kicker">Vectors &amp; 3D Mathematics</p>
          <h1 id="vectors3d-title">Think beyond the plane.</h1>
          <span className="sr-only">{topic.title}</span>
          <p>Explore vectors, matrices, transformations, and 3D geometry. See how direction and shape unlock the world in three dimensions.</p>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={recommendedLesson?.route ?? `/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>Start learning <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="/math-lab/3d-graphing"><Boxes className="h-4 w-4" />Open 3D Lab</Link>
          </div>
          <div className="vectors3d-meta" aria-label="Vectors and 3D learning statistics">
            <Pill icon={Boxes} label={`${topic.subtopics.length} pathways`} />
            <Pill icon={BookOpen} label={`${totalLessons} lessons`} />
            <Pill icon={Clock3} label={formatDuration(totalMinutes)} />
          </div>
        </div>
        <InteractiveVectorHero />
      </section>

      <JourneyProgress topic={topic} />

      <section className="vectors3d-pathways" aria-labelledby="vectors3d-pathways-title">
        <div className="vectors3d-section-head">
          <h2 id="vectors3d-pathways-title">Choose your pathway</h2>
          <p>Three connected pathways. One coherent 3D mathematical story.</p>
        </div>
        <div className="vectors3d-pathway-grid">
          {topic.subtopics.map((subtopic, index) => <Vectors3DPathwayCard key={subtopic.slug} topic={topic} subtopic={subtopic} index={index} />)}
        </div>
      </section>

      <section className="vectors3d-lower-grid" aria-label="Learning workflow and recommendation">
        <div className="vectors3d-cycle">
          <h2>Learn by doing</h2>
          <span className="sr-only">Predict. Manipulate. Observe. Explain.</span>
          <p>A proven 4-step cycle in every lesson.</p>
          <VectorsLearningCycle />
        </div>
        <RecommendedVectorLesson lesson={recommendedLesson} />
      </section>

      <WorkspaceLauncher />
    </main>
  );
}

function InteractiveVectorHero() {
  const [angle, setAngle] = useState(18);
  const [zoom, setZoom] = useState(1);
  const [playing, setPlaying] = useState(false);
  const v = { x: 210 + angle * 1.1, y: 104 - angle * 0.45 };
  const w = { x: 335 + angle * 0.8, y: 170 + angle * 0.18 };
  const sum = { x: v.x + (w.x - 250), y: v.y + (w.y - 210) };

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => setAngle((value) => (value + 4) % 70), 220);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div className="vectors3d-hero-stage" aria-label="Interactive vector addition scene">
      <svg viewBox="0 0 760 360" role="img" aria-label="3D coordinate axes with vectors v, w, resultant v plus w, and parallelogram construction">
        <defs>
          <marker id="vectors3d-arrow-cyan" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#22d3ee" /></marker>
          <marker id="vectors3d-arrow-violet" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#a855f7" /></marker>
          <marker id="vectors3d-arrow-coral" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#fb7185" /></marker>
          <linearGradient id="vectors3d-plane" x1="0" x2="1"><stop stopColor="#06b6d4" stopOpacity=".48" /><stop offset="1" stopColor="#2563eb" stopOpacity=".18" /></linearGradient>
        </defs>
        <rect width="760" height="360" rx="24" fill="#03112d" />
        {Array.from({ length: 42 }, (_, i) => <circle key={i} cx={(i * 67) % 740 + 10} cy={(i * 41) % 330 + 14} r={i % 5 === 0 ? 2 : 1.1} fill={i % 3 ? "#2563eb" : "#22d3ee"} opacity=".42" />)}
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${72 + i * 58} 268 L${306 + i * 38} 176 L${594 + i * 42} 218`} fill="none" stroke="#1d4ed8" strokeWidth="1" opacity=".25" />)}
        <path d="M180 246 L394 158 L610 218 L378 304 Z" fill="url(#vectors3d-plane)" stroke="#22d3ee" strokeWidth="2" opacity=".78" />
        <line x1="378" y1="246" x2="164" y2="304" stroke="#fff" strokeWidth="3" markerEnd="url(#vectors3d-arrow-cyan)" />
        <line x1="378" y1="246" x2="626" y2="288" stroke="#fff" strokeWidth="3" markerEnd="url(#vectors3d-arrow-cyan)" />
        <line x1="378" y1="246" x2="378" y2="56" stroke="#fff" strokeWidth="3" markerEnd="url(#vectors3d-arrow-cyan)" />
        <text x="166" y="286" fill="#fff" fontSize="17" fontWeight="950">x</text><text x="612" y="272" fill="#fff" fontSize="17" fontWeight="950">y</text><text x="360" y="54" fill="#fff" fontSize="17" fontWeight="950">z</text>
        <line x1="378" y1="246" x2={v.x + 220} y2={v.y} stroke="#22d3ee" strokeWidth="7" markerEnd="url(#vectors3d-arrow-cyan)" />
        <line x1="378" y1="246" x2={w.x + 185} y2={w.y} stroke="#a855f7" strokeWidth="7" markerEnd="url(#vectors3d-arrow-violet)" />
        <line x1="378" y1="246" x2={sum.x + 220} y2={sum.y} stroke="#fb7185" strokeWidth="7" markerEnd="url(#vectors3d-arrow-coral)" />
        <path d={`M${v.x + 220} ${v.y} L${sum.x + 220} ${sum.y} M${w.x + 185} ${w.y} L${sum.x + 220} ${sum.y}`} stroke="#ffd1d8" strokeWidth="2" strokeDasharray="7 7" fill="none" />
        <circle cx="378" cy="246" r="10" fill="#03112d" stroke="#67e8f9" strokeWidth="4" />
        <text x={v.x + 188} y={v.y + 20} fill="#22d3ee" fontSize="21" fontWeight="950">v</text>
        <text x={w.x + 164} y={w.y + 28} fill="#c084fc" fontSize="21" fontWeight="950">w</text>
        <text x={sum.x + 228} y={sum.y + 18} fill="#fb7185" fontSize="21" fontWeight="950">v + w</text>
      </svg>
      <div className="vectors3d-stage-controls">
        <label><span>Drag to rotate</span><input aria-label="Rotate vector scene" type="range" min="0" max="70" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
        <label><span>Zoom {zoom.toFixed(1)}x</span><input aria-label="Zoom vector scene" type="range" min="0.8" max="1.4" step="0.1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
        <button type="button" onClick={() => { setAngle(18); setZoom(1); setPlaying(false); }}>Reset view</button>
        <button type="button" aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Animate"}</button>
      </div>
    </div>
  );
}

function JourneyProgress({ topic }: { topic: LearningTopic }) {
  const progress = [18, 0, 0];
  return (
    <section className="vectors3d-journey" aria-label="Vectors and 3D journey progress">
      <div><span>Your journey</span><strong>Overall progress</strong></div>
      <b>18%</b>
      <em><i style={{ width: "18%" }} /></em>
      {topic.subtopics.map((subtopic, index) => (
        <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`}>
          <span>{index + 1}</span>
          <strong>{subtopic.title}</strong>
          <small>{progress[index]}%</small>
        </Link>
      ))}
    </section>
  );
}

function Vectors3DPathwayCard({ topic, subtopic, index }: { topic: LearningTopic; subtopic: LearningSubtopic; index: number }) {
  const meta = vectorPathwayMeta[index] ?? vectorPathwayMeta[0];
  return (
    <Link className="vectors3d-pathway-card" style={{ "--vectors-accent": vectorAccent(index) } as CSSProperties} to={`/learn/${topic.slug}/${subtopic.slug}`}>
      <div className="vectors3d-card-copy">
        <h3>{subtopic.title}</h3>
        <p>{meta.description}</p>
      </div>
      <Vectors3DPathwayVisual type={subtopic.slug} />
      <div className="vectors3d-card-meta"><span>{subtopic.lessons.length} lessons</span><span>{formatDuration(subtopicMinutes(subtopic))}</span><span>{meta.difficulty}</span></div>
      <div className="vectors3d-skill-line">{meta.skills.slice(0, 4).map((skill) => <span key={skill}>{skill}</span>)}</div>
      <div className="vectors3d-card-action"><strong>{meta.progress}%</strong><em><i style={{ width: `${meta.progress}%` }} /></em><span>{meta.cta}<ArrowRight className="h-4 w-4" /></span></div>
    </Link>
  );
}

function Vectors3DPathwayVisual({ type }: { type: string }) {
  if (type.includes("matrices")) return <MatrixTransformationPreview />;
  if (type.includes("3d")) return <Geometry3DPreview />;
  return <VectorPathwayPreview />;
}

function VectorPathwayPreview() {
  return (
    <svg viewBox="0 0 520 220" role="img" aria-label="Vectors preview with projection, resultant, and angle arc">
      <defs><marker id="vector-card-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#22d3ee" /></marker></defs>
      <rect width="520" height="220" rx="18" fill="#031b43" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${20 + i * 34} 190 C${130 + i * 5} ${120 - i * 3} ${250 + i * 7} ${150 + i * 2} 500 ${74 + i * 4}`} stroke="#1d4ed8" strokeWidth="1" opacity=".24" fill="none" />)}
      <line x1="160" y1="160" x2="330" y2="70" stroke="#22d3ee" strokeWidth="6" markerEnd="url(#vector-card-arrow)" />
      <line x1="160" y1="160" x2="408" y2="118" stroke="#94a3b8" strokeWidth="5" markerEnd="url(#vector-card-arrow)" />
      <line x1="160" y1="160" x2="404" y2="54" stroke="#fb7185" strokeWidth="3" strokeDasharray="7 7" />
      <path d="M188 144 A52 52 0 0 1 235 122" fill="none" stroke="#fff" strokeWidth="3" />
      <text x="235" y="140" fill="#fff" fontSize="18" fontWeight="950">theta</text>
      <text x="300" y="82" fill="#22d3ee" fontSize="18" fontWeight="950">v</text><text x="386" y="112" fill="#cbd5e1" fontSize="18" fontWeight="950">w</text><text x="255" y="186" fill="#d8b4fe" fontSize="17" fontWeight="950">proj_w v</text>
    </svg>
  );
}

function MatrixTransformationPreview() {
  return (
    <svg viewBox="0 0 520 220" role="img" aria-label="Matrix transformation preview with grid, matrix, and transformed basis">
      <defs><marker id="matrix-card-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#fff" /></marker></defs>
      <rect width="520" height="220" rx="18" fill="#160c3d" />
      {Array.from({ length: 5 }, (_, i) => <line key={`v-${i}`} x1={118 + i * 26} x2={118 + i * 26} y1="38" y2="132" stroke="#a78bfa" />)}
      {Array.from({ length: 5 }, (_, i) => <line key={`h-${i}`} x1="92" x2="222" y1={38 + i * 24} y2={38 + i * 24} stroke="#a78bfa" />)}
      <path d="M318 46 L456 26 L420 122 L284 148 Z" fill="#7c3aed" opacity=".24" stroke="#c084fc" strokeWidth="3" />
      <path d="M246 86 L286 102" stroke="#fff" strokeWidth="3" markerEnd="url(#matrix-card-arrow)" />
      <text x="210" y="180" fill="#fff" fontSize="22" fontWeight="950">A = [ 1  2 ]</text>
      <text x="270" y="206" fill="#fff" fontSize="22" fontWeight="950">[ .5 1 ]</text>
    </svg>
  );
}

function Geometry3DPreview() {
  return (
    <svg viewBox="0 0 520 220" role="img" aria-label="3D geometry preview with axes, sphere, plane, and cross-section">
      <defs><marker id="geometry3d-card-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#fff" /></marker></defs>
      <rect width="520" height="220" rx="18" fill="#06203d" />
      <line x1="238" y1="158" x2="438" y2="170" stroke="#fff" strokeWidth="2" markerEnd="url(#geometry3d-card-arrow)" /><line x1="238" y1="158" x2="154" y2="196" stroke="#fff" strokeWidth="2" /><line x1="238" y1="158" x2="238" y2="36" stroke="#fff" strokeWidth="2" />
      <circle cx="334" cy="112" r="68" fill="#2563eb" opacity=".42" stroke="#22d3ee" strokeWidth="3" />
      <ellipse cx="334" cy="112" rx="72" ry="18" fill="none" stroke="#67e8f9" strokeWidth="3" />
      <path d="M162 146 L340 90 L448 136 L254 190 Z" fill="#22d3ee" opacity=".24" stroke="#22d3ee" strokeWidth="2" />
      <path d="M436 58 L486 40 L486 92 L436 114 Z M436 58 L436 114 L396 94 L396 46 Z M396 46 L436 58 L486 40 L446 30 Z" fill="#c7d2fe" opacity=".55" stroke="#a5b4fc" />
      <text x="410" y="152" fill="#fff" fontSize="14" fontWeight="950">x</text><text x="190" y="194" fill="#fff" fontSize="14" fontWeight="950">y</text><text x="246" y="44" fill="#fff" fontSize="14" fontWeight="950">z</text>
    </svg>
  );
}

function VectorsLearningCycle() {
  const steps = [["Predict", "Make a prediction before interacting."], ["Manipulate", "Change values, move objects, explore."], ["Observe", "Note patterns, collect evidence, compare."], ["Explain", "Write your reasoning and conclusions."]];
  return (
    <div className="vectors3d-cycle-flow">
      {steps.map(([title, text], index) => (
        <article key={title}>
          <span>{index + 1}</span>
          <strong>{title}</strong>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}

function RecommendedVectorLesson({ lesson }: { lesson: LearningLessonRef | null }) {
  return (
    <article className="vectors3d-recommended">
      <h2>Recommended next</h2>
      <div>
        <div className="vectors3d-recommended-thumb"><VectorPathwayPreview /><button type="button" aria-label="Preview recommended vector lesson"><Play className="h-5 w-5" /></button></div>
        <div className="vectors3d-recommended-copy">
          <h3>{lesson?.title ?? "Vector addition in 3D"}</h3>
          <span>{lesson ? lessonFormat(lesson) : "Interactive simulation"} · {lesson?.minutes ?? 12} min</span>
          <p>{lesson?.summary ?? "Visualize how vectors add in space using the parallelogram rule and component form."}</p>
          <Link to={lesson?.route ?? "/learn/vectors-and-3d-mathematics/vectors"}>Resume <ArrowRight className="h-4 w-4" /></Link>
          <em><i style={{ width: "50%" }} /></em><small>6 / 12 min</small>
        </div>
      </div>
    </article>
  );
}

function WorkspaceLauncher() {
  const workspaces = [
    { title: "3D Graph Studio", text: "Plot surfaces, slices, and vector fields in 3D.", route: "/math-lab/3d-graphing" },
    { title: "Geometry Workspace", text: "Construct, measure, and explore geometric relationships.", route: "/math-lab/geometry" },
    { title: "Solver / CAS", text: "Solve equations, simplify expressions, and check your work.", route: "/math-lab/cas" },
  ];
  return (
    <section className="vectors3d-workspaces" aria-labelledby="vectors3d-workspaces-title">
      <div><h2 id="vectors3d-workspaces-title">Launch a workspace</h2><p>Open powerful tools to visualize, compute, and create.</p></div>
      <div>
        {workspaces.map((workspace) => (
          <Link key={workspace.title} to={workspace.route}>
            <Boxes className="h-6 w-6" />
            <strong>{workspace.title}</strong>
            <span>{workspace.text}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </section>
  );
}

const discretePathwayMeta = [
  { progress: 18, accent: "#7c3aed", cta: "Continue Sets & Logic", tag: "Foundation", minutes: "164 min", description: "Membership, predicates, truth tables, propositional logic, and proofs." },
  { progress: 12, accent: "#d97706", cta: "Explore Graphs", tag: "Intermediate", minutes: "205 min", description: "Networks, routes, counting, permutations, combinations, and algorithms." },
  { progress: 24, accent: "#15803d", cta: "Explore Financial Models", tag: "Applied", minutes: "205 min", description: "Compound growth, cash flow, present value, rates, and decisions." },
];

function DiscreteAppliedMaster({ topic }: { topic: LearningTopic }) {
  const palette = paletteFor(topic.slug);
  const totalLessons = countTopicLessons(topic);
  const totalMinutes = topicMinutes(topic);
  const firstLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons)[0] ?? null;
  const recommendedLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons).find((lesson) => /dijkstra|shortest|graph|route|network/i.test(lesson.title)) ?? firstLesson;

  return (
    <main className="learn-topic-page learn-master discrete-master" style={paletteVars(palette)} data-topic={topic.slug}>
      <nav className="discrete-breadcrumbs" aria-label="Learning breadcrumbs">
        <Link to="/learn">Learning Hub</Link><span>/</span>
        <Link to="/learn/advanced-mathematics">Applied Mathematics</Link><span>/</span>
        <strong>Discrete &amp; Applied</strong>
      </nav>

      <section className="discrete-hero" aria-labelledby="discrete-title">
        <div className="discrete-hero-copy">
          <p className="learn-kicker">Discrete &amp; Applied Mathematics</p>
          <h1 id="discrete-title">Turn complex choices into clear decisions.</h1>
          <span className="sr-only">{topic.title}</span>
          <p>Explore logic, networks, counting, algorithms, optimization, and financial models through interactive experiments.</p>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={recommendedLesson?.route ?? `/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>Start learning <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="/math-lab/graphing-calculator"><FlaskConical className="h-4 w-4" />Open Network Lab</Link>
          </div>
          <div className="discrete-meta" aria-label="Discrete and applied learning statistics">
            <Pill icon={Boxes} label={`${topic.subtopics.length} pathways`} />
            <Pill icon={BookOpen} label={`${totalLessons} lessons`} />
            <Pill icon={Clock3} label={formatDuration(totalMinutes)} />
          </div>
        </div>
        <WeightedNetworkLab />
      </section>

      <DiscreteJourneyProgress topic={topic} />

      <section className="discrete-pathways" aria-labelledby="discrete-pathways-title">
        <div className="discrete-section-head">
          <h2 id="discrete-pathways-title">Choose your pathway</h2>
          <p>Three coherent pathways. One discrete and applied math story.</p>
        </div>
        <div className="discrete-pathway-grid">
          {topic.subtopics.map((subtopic, index) => <DiscretePathwayCard key={subtopic.slug} topic={topic} subtopic={subtopic} index={index} />)}
        </div>
      </section>

      <section className="discrete-lower-grid" aria-label="Discrete learning workflow and recommendation">
        <div className="discrete-flow">
          <h2>How you solve</h2>
          <span className="sr-only">Predict. Manipulate. Observe. Explain.</span>
          <p>A practical process for discrete problems.</p>
          <DiscreteSolveFlow />
        </div>
        <DiscreteRecommended lesson={recommendedLesson} />
      </section>

      <section className="discrete-launch-grid" aria-label="Discrete challenges and workspaces">
        <DiscreteChallengeLauncher />
        <DiscreteWorkspaceLauncher />
      </section>
    </main>
  );
}

function WeightedNetworkLab() {
  const [route, setRoute] = useState<"optimal" | "alternate">("optimal");
  const [dragging, setDragging] = useState<string | null>(null);
  const [nodes, setNodes] = useState<Record<string, { x: number; y: number }>>({
    A: { x: 410, y: 58 }, B: { x: 282, y: 96 }, C: { x: 250, y: 165 }, D: { x: 305, y: 232 }, E: { x: 398, y: 142 },
    F: { x: 430, y: 230 }, H: { x: 560, y: 178 }, I: { x: 604, y: 96 }, G: { x: 680, y: 186 }, J: { x: 600, y: 258 },
  });
  const optimal = ["B", "A", "E", "F", "H", "G"];
  const alternate = ["B", "C", "D", "F", "H", "I", "G"];
  const activePath = route === "optimal" ? optimal : alternate;
  const edges = [
    ["B", "A", 4], ["A", "I", 7], ["A", "E", 2], ["B", "C", 6], ["B", "E", 3], ["C", "E", 4], ["C", "D", 2], ["D", "F", 3],
    ["E", "F", 1], ["E", "H", 6], ["F", "H", 2], ["F", "J", 5], ["I", "H", 4], ["I", "G", 2], ["H", "G", 3], ["J", "G", 1],
  ] as const;
  const cost = activePath.slice(0, -1).reduce((sum, start, index) => {
    const end = activePath[index + 1];
    const edge = edges.find(([a, b]) => (a === start && b === end) || (a === end && b === start));
    return sum + (edge?.[2] ?? 0);
  }, 0);
  const isActiveEdge = (a: string, b: string) => activePath.some((node, index) => (node === a && activePath[index + 1] === b) || (node === b && activePath[index + 1] === a));
  const moveNode = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 760;
    const y = ((event.clientY - rect.top) / rect.height) * 360;
    setNodes((current) => ({ ...current, [dragging]: { x: Math.min(720, Math.max(60, x)), y: Math.min(315, Math.max(45, y)) } }));
  };

  return (
    <div className="discrete-network-lab" aria-label="Interactive weighted network shortest path lab">
      <svg viewBox="0 0 760 360" onPointerMove={moveNode} onPointerUp={() => setDragging(null)} onPointerLeave={() => setDragging(null)} role="img" aria-label={`Weighted graph showing ${route} route with cost ${cost}`}>
        <defs>
          <marker id="discrete-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L7 4 L0 8Z" fill="#f59e0b" /></marker>
          <radialGradient id="discrete-node-glow"><stop stopColor="#fde68a" /><stop offset=".7" stopColor="#f59e0b" /><stop offset="1" stopColor="#7c2d12" /></radialGradient>
        </defs>
        <rect width="760" height="360" rx="24" fill="#080d20" />
        {Array.from({ length: 96 }, (_, index) => <circle key={index} cx={(index * 67) % 730 + 18} cy={(index * 41) % 330 + 18} r={index % 6 === 0 ? 1.8 : 1} fill={index % 2 ? "#fb923c" : "#7c3aed"} opacity=".28" />)}
        {edges.map(([a, b, weight]) => {
          const start = nodes[a];
          const end = nodes[b];
          const active = isActiveEdge(a, b);
          return (
            <g key={`${a}-${b}`}>
              <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={active ? "#f59e0b" : "#c4b5fd"} strokeWidth={active ? 4 : 2} strokeDasharray={active && route === "alternate" ? "7 7" : undefined} opacity={active ? 1 : .62} markerEnd={active ? "url(#discrete-arrow)" : undefined} />
              <text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 - 8} fill="#fff7ed" fontSize="15" fontWeight="950">{weight}</text>
            </g>
          );
        })}
        {Object.entries(nodes).map(([name, point]) => {
          const active = activePath.includes(name);
          return (
            <g key={name} className="discrete-network-node" transform={`translate(${point.x} ${point.y})`} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDragging(name); }}>
              <circle r={active ? 22 : 18} fill={active ? "url(#discrete-node-glow)" : "#170b2f"} stroke={active ? "#fed7aa" : "#f0abfc"} strokeWidth="3" />
              <text textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="17" fontWeight="950">{name}</text>
            </g>
          );
        })}
      </svg>
      <div className="discrete-network-controls">
        <button type="button" aria-pressed={route === "optimal"} onClick={() => setRoute("optimal")}><Play className="h-4 w-4" />Shortest path</button>
        <button type="button" aria-pressed={route === "alternate"} onClick={() => setRoute("alternate")}>Compare route</button>
        <button type="button" onClick={() => { setNodes({ A: { x: 410, y: 58 }, B: { x: 282, y: 96 }, C: { x: 250, y: 165 }, D: { x: 305, y: 232 }, E: { x: 398, y: 142 }, F: { x: 430, y: 230 }, H: { x: 560, y: 178 }, I: { x: 604, y: 96 }, G: { x: 680, y: 186 }, J: { x: 600, y: 258 } }); }}>Reset layout</button>
      </div>
      <aside className="discrete-network-panel">
        <span>Cost {cost}</span>
        <span>Capacity 8</span>
        <strong>{route === "optimal" ? "Shortest path" : "Alternate route"}</strong>
        <b>{activePath.length - 1} steps</b>
        <small>Drag nodes</small>
      </aside>
    </div>
  );
}

function DiscreteJourneyProgress({ topic }: { topic: LearningTopic }) {
  const values = [18, 12, 24];
  return (
    <section className="discrete-journey" aria-label="Discrete journey progress">
      <div><span>Your journey</span><strong>18%</strong><small>overall progress</small></div>
      {topic.subtopics.map((subtopic, index) => (
        <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`} style={{ "--discrete-accent": discretePathwayMeta[index]?.accent ?? "#d97706" } as CSSProperties}>
          <span>{subtopic.title}</span>
          <em><i style={{ width: `${values[index] ?? 0}%` }} /></em>
          <b>{values[index] ?? 0}%</b>
        </Link>
      ))}
    </section>
  );
}

function DiscretePathwayCard({ topic, subtopic, index }: { topic: LearningTopic; subtopic: LearningSubtopic; index: number }) {
  const meta = discretePathwayMeta[index] ?? discretePathwayMeta[0];
  return (
    <Link className="discrete-pathway-card" style={{ "--discrete-accent": meta.accent } as CSSProperties} to={`/learn/${topic.slug}/${subtopic.slug}`}>
      <div className="discrete-pathway-copy">
        <h3>{subtopic.title}</h3>
        <p>{meta.description}</p>
      </div>
      <DiscretePathwayPreview type={subtopic.slug} />
      <div className="discrete-card-meta"><span>{subtopic.lessons.length} lessons</span><span>{meta.minutes}</span><span>{meta.tag}</span></div>
      <div className="discrete-card-action"><strong>{meta.progress}%</strong><em><i style={{ width: `${meta.progress}%` }} /></em><span>{meta.cta}<ArrowRight className="h-4 w-4" /></span></div>
    </Link>
  );
}

function DiscretePathwayPreview({ type }: { type: string }) {
  if (type.includes("graph")) return <GraphsCombinatoricsPreview />;
  if (type.includes("financial")) return <FinancialModelsPreview />;
  return <SetsLogicPreview />;
}

function SetsLogicPreview() {
  const [selected, setSelected] = useState("B");
  return (
    <div className="discrete-preview sets-preview">
      <svg viewBox="0 0 420 190" role="img" aria-label="Venn diagram and truth table preview">
        <circle cx="120" cy="92" r="70" fill="#312e81" opacity=".55" stroke="#c4b5fd" />
        <circle cx="210" cy="92" r="70" fill="#6d28d9" opacity=".42" stroke="#f0abfc" />
        <circle cx="166" cy="126" r="64" fill="#1e3a8a" opacity=".36" stroke="#93c5fd" />
        <text x="86" y="86" fill="#fff" fontWeight="950">A</text><text x="248" y="86" fill="#fff" fontWeight="950">B</text><text x="162" y="145" fill="#fff" fontWeight="950">C</text>
        <rect x="275" y="32" width="124" height="126" rx="12" fill="#21123f" stroke="#8b5cf6" />
        {["P", "Q", "P -> Q", "T", "T", "T", "T", "F", "F", "F", "T", "T", "F", "F", "T"].map((value, index) => <text key={`${value}-${index}`} x={292 + (index % 3) * 39} y={55 + Math.floor(index / 3) * 23} fill="#fff" fontSize="13" fontWeight="900">{value}</text>)}
      </svg>
      <button type="button" onClick={(event) => { event.preventDefault(); setSelected((value) => value === "B" ? "A ∩ C" : "B"); }}>Highlight {selected}</button>
    </div>
  );
}

function GraphsCombinatoricsPreview() {
  const [count, setCount] = useState(3);
  return (
    <div className="discrete-preview graphs-preview">
      <svg viewBox="0 0 420 190" role="img" aria-label="Weighted graph and combinatorics counter preview">
        <defs><marker id="graph-card-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#f59e0b" /></marker></defs>
        <rect width="420" height="190" rx="16" fill="#130d19" />
        {[["1", 70, 54], ["2", 160, 60], ["3", 265, 54], ["4", 82, 142], ["5", 198, 132], ["6", 300, 142]].map(([name, x, y]) => <g key={name}><circle cx={Number(x)} cy={Number(y)} r="18" fill="#251232" stroke="#f59e0b" strokeWidth="3" /><text x={Number(x)} y={Number(y) + 5} textAnchor="middle" fill="#fff" fontWeight="950">{name}</text></g>)}
        {[[70,54,160,60,3],[160,60,265,54,2],[70,54,82,142,4],[160,60,198,132,2],[82,142,198,132,1],[198,132,300,142,3],[265,54,300,142,1]].map(([x1,y1,x2,y2,w], index) => <g key={index}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={index < count ? "#f59e0b" : "#64748b"} strokeWidth="3" markerEnd={index < count ? "url(#graph-card-arrow)" : undefined} /><text x={(x1+x2)/2} y={(y1+y2)/2 - 8} fill="#fde68a" fontSize="12" fontWeight="950">{w}</text></g>)}
      </svg>
      <button type="button" onClick={(event) => { event.preventDefault(); setCount((value) => value === 7 ? 2 : value + 1); }}>Find route</button>
      <span>3! = 6 · C(5,2)=10</span>
    </div>
  );
}

function FinancialModelsPreview() {
  const [rate, setRate] = useState(7.5);
  const value = Math.round(10000 * (1 + rate / 100) ** 5);
  return (
    <div className="discrete-preview finance-preview">
      <svg viewBox="0 0 420 190" role="img" aria-label="Compound growth curve, cash flow timeline, and present value bars">
        <rect width="420" height="190" rx="16" fill="#03261f" />
        <path d={`M28 150 C92 150 130 ${142 - rate * 3} 172 ${132 - rate * 4} C220 ${118 - rate * 4} 260 ${88 - rate * 5} 292 ${42}`} fill="none" stroke="#a3e635" strokeWidth="4" />
        {[35, 70, 108, 150].map((height, index) => <rect key={index} x={310 + index * 22} y={156 - height} width="14" height={height} fill="#86efac" opacity={.45 + index * .12} />)}
        <line x1="298" y1="80" x2="396" y2="80" stroke="#67e8f9" />
        {[0, 1, 2, 3].map((step) => <g key={step}><line x1={310 + step * 27} y1="92" x2={310 + step * 27} y2="62" stroke="#fef3c7" /><text x={302 + step * 27} y="55" fill="#fef3c7" fontSize="11" fontWeight="950">3k</text></g>)}
        <text x="28" y="34" fill="#fff" fontSize="14" fontWeight="950">Future value ${value.toLocaleString()}</text>
      </svg>
      <label>r = {rate.toFixed(1)}%<input type="range" min="1" max="15" step=".5" value={rate} onClick={(event) => event.preventDefault()} onChange={(event) => setRate(Number(event.target.value))} /></label>
    </div>
  );
}

function DiscreteSolveFlow() {
  const steps = [
    ["Model", "Define the system, nodes, rules, and constraints."],
    ["Test", "Run experiments, check logic, validate results."],
    ["Optimize", "Find the best route, structure, or allocation."],
    ["Decide", "Act on insights with confidence and clarity."],
  ];
  return (
    <div className="discrete-flow-steps">
      {steps.map(([title, text], index) => (
        <article key={title}>
          <span>{index + 1}</span>
          <strong>{title}</strong>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}

function DiscreteRecommended({ lesson }: { lesson: LearningLessonRef | null }) {
  return (
    <article className="discrete-recommended">
      <h2>Recommended next</h2>
      <div>
        <GraphsCombinatoricsPreview />
        <div>
          <h3>{lesson?.title ?? "Shortest paths: Dijkstra's algorithm"}</h3>
          <p>{lesson?.summary ?? "Learn to find minimum-cost routes in weighted networks using Dijkstra's algorithm."}</p>
          <span>{lesson?.minutes ?? 14} min</span>
          <Link to={lesson?.route ?? "/learn/discrete-and-applied-mathematics/graphs-and-combinatorics"}>Resume <ArrowRight className="h-4 w-4" /></Link>
          <em><i style={{ width: "43%" }} /></em><small>6 / 14 min</small>
        </div>
      </div>
    </article>
  );
}

function DiscreteChallengeLauncher() {
  const challenges = [
    ["Logic Sprint", "Evaluate expressions and truth tables", "#7c3aed"],
    ["Route Optimizer", "Find the cheapest path in a network", "#f97316"],
    ["Compound Growth Lab", "Model investments and compare outcomes", "#16a34a"],
  ];
  return (
    <section className="discrete-challenges" aria-labelledby="discrete-challenges-title">
      <h2 id="discrete-challenges-title">Try a challenge</h2>
      <div>{challenges.map(([title, text, accent]) => <Link key={title} to="/lessons" style={{ "--discrete-accent": accent } as CSSProperties}><BrainCircuit className="h-5 w-5" /><strong>{title}</strong><span>{text}</span></Link>)}</div>
    </section>
  );
}

function DiscreteWorkspaceLauncher() {
  const workspaces = [
    ["Math Workspace", "Interactive problem solving", "/workspace"],
    ["Graph Studio", "Build and analyze graphs", "/math-lab/graphing-calculator"],
    ["Solver / CAS", "Symbolic computation", "/problem-solver"],
  ];
  return (
    <section className="discrete-workspaces" aria-labelledby="discrete-workspaces-title">
      <h2 id="discrete-workspaces-title">Launch a workspace</h2>
      <div>{workspaces.map(([title, text, route]) => <Link key={title} to={route}><Boxes className="h-5 w-5" /><strong>{title}</strong><span>{text}</span><ArrowRight className="h-4 w-4" /></Link>)}</div>
    </section>
  );
}

const advancedPathwayMeta = [
  { progress: 33, accent: "#8b5cf6", cta: "Continue exploring", difficulty: "Advanced", description: "Infinite expansions, best rational approximations, and convergence error." },
  { progress: 22, accent: "#ef4444", cta: "Explore famous problems", difficulty: "Investigation", description: "Collatz orbits, bridges, colourings, conjectures, and proof boundaries." },
  { progress: 17, accent: "#06b6d4", cta: "Explore special functions", difficulty: "Advanced", description: "Gamma, Bessel, and error functions plotted with honest domain handling." },
];

function AdvancedMathMaster({ topic }: { topic: LearningTopic }) {
  const palette = paletteFor(topic.slug);
  const totalLessons = countTopicLessons(topic);
  const totalMinutes = topicMinutes(topic);
  const firstLesson = topic.subtopics.flatMap((subtopic) => subtopic.lessons)[0] ?? null;
  const recommendedLesson = topic.subtopics[0]?.lessons.find((lesson) => /convergent|continued|sqrt|approx/i.test(lesson.title)) ?? firstLesson;

  return (
    <main className="learn-topic-page learn-master advanced-master" style={paletteVars(palette)} data-topic={topic.slug}>
      <nav className="advanced-breadcrumbs" aria-label="Learning breadcrumbs">
        <Link to="/learn">Learning Hub</Link><span>/</span><strong>Advanced Mathematics</strong>
      </nav>

      <section className="advanced-hero" aria-labelledby="advanced-title">
        <div className="advanced-hero-copy">
          <p className="learn-kicker">Advanced Mathematics</p>
          <h1 id="advanced-title">Follow an idea to its limits.</h1>
          <span className="sr-only">{topic.title}</span>
          <p>Investigate infinite processes, celebrated problems and the functions that shape modern mathematics.</p>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={recommendedLesson?.route ?? `/learn/${topic.slug}/${topic.subtopics[0]?.slug ?? ""}`}>Begin an investigation <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="/workspace">Open Math Workspace <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="advanced-meta" aria-label="Advanced mathematics learning statistics">
            <Pill icon={Boxes} label={`${topic.subtopics.length} pathways`} />
            <Pill icon={BookOpen} label={`${totalLessons} lessons`} />
            <Pill icon={Clock3} label={formatDuration(totalMinutes)} />
          </div>
        </div>
        <ConvergenceLab />
      </section>

      <AdvancedJourney topic={topic} />

      <section className="advanced-pathways" aria-labelledby="advanced-pathways-title">
        <div className="advanced-section-head">
          <span className="sr-only">Predict. Manipulate. Observe. Explain.</span>
          <h2 id="advanced-pathways-title">Three paths into deeper mathematics</h2>
          <p>Choose a path. Follow ideas. Build insight.</p>
          <Link to="/learn/advanced-mathematics/continued-fractions">View all pathways <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="advanced-pathway-grid">
          {topic.subtopics.map((subtopic, index) => <AdvancedPathwayLab key={subtopic.slug} topic={topic} subtopic={subtopic} index={index} />)}
        </div>
      </section>

      <section className="advanced-lower-grid">
        <AdvancedInvestigationCycle />
        <AdvancedRecommendation lesson={recommendedLesson} />
      </section>

      <section className="advanced-bottom-grid">
        <AdvancedFeaturedInvestigations />
        <AdvancedWorkspaceLauncher />
      </section>
    </main>
  );
}

function ConvergenceLab() {
  const [depth, setDepth] = useState(6);
  const data = useMemo(() => sqrt2Convergents(depth), [depth]);
  const current = data[data.length - 1];
  const nested = `1 ${Array.from({ length: Math.min(depth - 1, 5) }, () => "+ 1/(2 ").join("")}${Array.from({ length: Math.min(depth - 1, 5) }, () => ")").join("")}`;
  return (
    <div className="advanced-convergence-lab" aria-label="Convergence laboratory for square root of two continued fractions">
      <div className="advanced-convergence-copy">
        <p>Convergence laboratory</p>
        <h2>sqrt(2) = [1; 2, 2, 2, ...]</h2>
        <strong>{nested}</strong>
        <div className="advanced-convergent-row" aria-label="Convergents p n over q n">
          {data.slice(0, 5).map((item) => (
            <span key={item.n} title={`Convergent ${item.n}: ${item.decimal.toFixed(8)}, error ${item.error.toExponential(2)}`}>
              <b>{item.p.toString()}</b><i /> <b>{item.q.toString()}</b>
              <small>{item.decimal.toFixed(5)}</small>
            </span>
          ))}
        </div>
        <dl className="advanced-current-convergent">
          <div><dt>Current p/q</dt><dd>{current.p.toString()} / {current.q.toString()}</dd></div>
          <div><dt>Decimal</dt><dd>{current.decimal.toFixed(10)}</dd></div>
          <div><dt>Abs. error</dt><dd>{current.error.toExponential(3)}</dd></div>
        </dl>
      </div>
      <ConvergenceSvg data={data} depth={depth} />
      <div className="advanced-depth-controls">
        <button type="button" onClick={() => setDepth((value) => Math.max(1, value - 1))}>Prev</button>
        <label>Depth n = {depth}<input aria-label="Depth n" type="range" min="1" max="12" value={depth} onChange={(event) => setDepth(Number(event.target.value))} /></label>
        <button type="button" onClick={() => setDepth((value) => Math.min(12, value + 1))}>Next</button>
        <button type="button" onClick={() => setDepth(6)}>Reset</button>
      </div>
    </div>
  );
}

function ConvergenceSvg({ data, depth }: { data: ReturnType<typeof sqrt2Convergents>; depth: number }) {
  const maxError = Math.max(...data.map((item) => Math.log10(item.error)));
  const minError = Math.min(...data.map((item) => Math.log10(item.error)));
  const points = data.map((item, index) => {
    const x = 62 + index * (310 / Math.max(1, data.length - 1));
    const y = 272 - ((Math.log10(item.error) - minError) / Math.max(.001, maxError - minError)) * 104;
    return `${x},${y}`;
  }).join(" ");
  const scale = Math.min(1.42, data[data.length - 1].decimal);
  return (
    <svg viewBox="0 0 720 330" role="img" aria-label={`Error graph and geometric square construction at depth ${depth}`}>
      <defs><linearGradient id="advanced-gold" x1="0" x2="1"><stop stopColor="#f59e0b" /><stop offset="1" stopColor="#fde68a" /></linearGradient></defs>
      <rect width="720" height="330" rx="22" fill="#091124" />
      {Array.from({ length: 18 }, (_, index) => <line key={index} x1={40 + index * 36} x2={40 + index * 36} y1="28" y2="302" stroke="#273453" strokeWidth="1" opacity=".58" />)}
      {Array.from({ length: 8 }, (_, index) => <line key={index} x1="34" x2="686" y1={42 + index * 36} y2={42 + index * 36} stroke="#273453" strokeWidth="1" opacity=".58" />)}
      <rect x="468" y="42" width="148" height="148" fill="none" stroke="url(#advanced-gold)" strokeWidth="3" />
      <rect x="468" y={190 - 148 / scale} width={148 * scale / Math.SQRT2} height={148 / scale} fill="none" stroke="#8b5cf6" strokeWidth="2" />
      <path d="M468 190 C520 80 582 70 616 42 M468 42 C554 88 596 130 616 190" fill="none" stroke="#fde68a" strokeWidth="2" opacity=".7" />
      <text x="462" y="222" fill="#fef3c7" fontSize="13" fontWeight="900">geometric approximation</text>
      <polyline points={points} fill="none" stroke="#f59e0b" strokeWidth="4" />
      {points.split(" ").map((point, index) => {
        const [x, y] = point.split(",").map(Number);
        return <circle key={index} cx={x} cy={y} r="4" fill="#091124" stroke="#fbbf24" strokeWidth="3" />;
      })}
      <text x="52" y="54" fill="#fef3c7" fontSize="14" fontWeight="950">Absolute error</text>
      <text x="358" y="296" fill="#fef3c7" fontSize="14" fontWeight="950">n</text>
    </svg>
  );
}

function AdvancedJourney({ topic }: { topic: LearningTopic }) {
  const values = [33, 22, 17];
  const overall = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  return (
    <section className="advanced-journey" aria-label="Advanced mathematics journey progress">
      <div><span>Your journey</span><strong>{overall}%</strong><small>overall progress</small></div>
      {topic.subtopics.map((subtopic, index) => (
        <Link key={subtopic.slug} to={`/learn/${topic.slug}/${subtopic.slug}`} style={{ "--advanced-accent": advancedPathwayMeta[index]?.accent ?? "#8b5cf6" } as CSSProperties}>
          <b>{index + 1}</b>
          <span>{subtopic.title}<small>{Math.round(subtopic.lessons.length * values[index] / 100)} / {subtopic.lessons.length} lessons</small></span>
          <em><i style={{ width: `${values[index]}%` }} /></em>
        </Link>
      ))}
    </section>
  );
}

function AdvancedPathwayLab({ topic, subtopic, index }: { topic: LearningTopic; subtopic: LearningSubtopic; index: number }) {
  const meta = advancedPathwayMeta[index] ?? advancedPathwayMeta[0];
  return (
    <article className="advanced-pathway-card" style={{ "--advanced-accent": meta.accent } as CSSProperties}>
      <div className="advanced-pathway-title">
        <span>{index + 1}</span>
        <div><h3>{subtopic.title}</h3><p>{meta.description}</p></div>
      </div>
      {subtopic.slug === "continued-fractions" ? <ContinuedFractionsCardLab /> : subtopic.slug === "famous-problems" ? <FamousProblemsCardLab /> : <SpecialFunctionsCardLab />}
      <div className="advanced-card-meta"><span>{subtopic.lessons.length} lessons</span><span>{formatDuration(subtopicMinutes(subtopic))}</span><span>{meta.difficulty}</span></div>
      <div className="advanced-card-action"><strong>{meta.progress}%</strong><em><i style={{ width: `${meta.progress}%` }} /></em><Link to={`/learn/${topic.slug}/${subtopic.slug}`}>{meta.cta}<ArrowRight className="h-4 w-4" /></Link></div>
    </article>
  );
}

function ContinuedFractionsCardLab() {
  const [depth, setDepth] = useState(5);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => setDepth((value) => value >= 9 ? 1 : value + 1), 650);
    return () => window.clearInterval(timer);
  }, [playing]);
  const data = sqrt2Convergents(depth);
  return (
    <div className="advanced-card-lab">
      <ConvergenceSvg data={data} depth={depth} />
      <label>Expansion depth <input type="range" min="1" max="9" value={depth} onChange={(event) => setDepth(Number(event.target.value))} /></label>
      <button type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause expansion" : "Play expansion"}</button>
    </div>
  );
}

function FamousProblemsCardLab() {
  const sequence = useMemo(() => collatzSequence(27), []);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => setStep((value) => value >= sequence.length - 1 ? 0 : value + 1), 90);
    return () => window.clearInterval(timer);
  }, [playing, sequence.length]);
  return (
    <div className="advanced-card-lab famous-lab">
      <div className="advanced-problem-tabs"><span>Collatz</span><span>Bridges</span><span>Four colour</span></div>
      <CollatzSvg sequence={sequence} step={step} />
      <div className="advanced-collatz-stats"><span>Current {sequence[step]}</span><span>Steps 111</span><span>Max 9232</span></div>
      <div className="advanced-mini-actions">
        <button type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play"}</button>
        <button type="button" onClick={() => setStep((value) => Math.min(sequence.length - 1, value + 1))}>Step</button>
        <button type="button" onClick={() => { setStep(0); setPlaying(false); }}>Reset</button>
      </div>
      <p>Observation for 27 reaches 1. This is evidence for the Collatz conjecture, not a proof.</p>
    </div>
  );
}

function CollatzSvg({ sequence, step }: { sequence: number[]; step: number }) {
  const shown = sequence.slice(0, Math.max(8, step + 1));
  const max = Math.max(...sequence);
  const points = shown.slice(0, 36).map((value, index) => `${32 + index * 12},${160 - Math.log10(value) / Math.log10(max) * 118}`).join(" ");
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="Collatz sequence trajectory for 27">
      <rect width="460" height="180" rx="16" fill="#111827" />
      <polyline points={points} fill="none" stroke="#f97316" strokeWidth="3" />
      {shown.slice(0, 12).map((value, index) => <g key={index}><circle cx={34 + index * 34} cy={88 + (index % 3) * 22} r="13" fill={index === step ? "#ef4444" : "#1f2937"} stroke="#fca5a5" strokeWidth="2" /><text x={34 + index * 34} y={93 + (index % 3) * 22} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="950">{value}</text></g>)}
    </svg>
  );
}

function SpecialFunctionsCardLab() {
  const [visible, setVisible] = useState({ gamma: true, bessel: true, erf: true });
  const [zoom, setZoom] = useState(1);
  return (
    <div className="advanced-card-lab special-lab">
      <SpecialFunctionsSvg visible={visible} zoom={zoom} />
      <div className="advanced-function-toggles">
        {(["gamma", "bessel", "erf"] as const).map((key) => <label key={key}><input type="checkbox" checked={visible[key]} onChange={(event) => setVisible((current) => ({ ...current, [key]: event.target.checked }))} />{key === "gamma" ? "Gamma" : key === "bessel" ? "J0" : "erf"}</label>)}
      </div>
      <label>Zoom {zoom.toFixed(1)}x<input type="range" min=".8" max="1.8" step=".1" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
      <button type="button" onClick={() => { setVisible({ gamma: true, bessel: true, erf: true }); setZoom(1); }}>Reset viewport</button>
    </div>
  );
}

function SpecialFunctionsSvg({ visible, zoom }: { visible: { gamma: boolean; bessel: boolean; erf: boolean }; zoom: number }) {
  const xMin = -4 / zoom;
  const xMax = 5 / zoom;
  const yMin = -2.2;
  const yMax = 4.2;
  const sx = (x: number) => 54 + ((x - xMin) / (xMax - xMin)) * 360;
  const sy = (y: number) => 152 - ((y - yMin) / (yMax - yMin)) * 118;
  const pathFor = (fn: (x: number) => number | null) => {
    const parts: string[] = [];
    let drawing = false;
    for (let i = 0; i <= 240; i++) {
      const x = xMin + (xMax - xMin) * i / 240;
      const y = fn(x);
      if (y === null || !Number.isFinite(y) || y < yMin || y > yMax) {
        drawing = false;
        continue;
      }
      parts.push(`${drawing ? "L" : "M"}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`);
      drawing = true;
    }
    return parts.join(" ");
  };
  return (
    <svg viewBox="0 0 460 190" role="img" aria-label="Gamma, Bessel J zero, and error function graph">
      <rect width="460" height="190" rx="16" fill="#05202e" />
      {Array.from({ length: 10 }, (_, i) => <line key={`v${i}`} x1={54 + i * 40} x2={54 + i * 40} y1="28" y2="158" stroke="#164e63" />)}
      {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} x1="42" x2="424" y1={38 + i * 28} y2={38 + i * 28} stroke="#164e63" />)}
      <line x1={sx(0)} x2={sx(0)} y1="24" y2="162" stroke="#cbd5e1" /><line x1="42" x2="424" y1={sy(0)} y2={sy(0)} stroke="#cbd5e1" />
      {visible.gamma ? <path d={pathFor(gammaApprox)} fill="none" stroke="#22d3ee" strokeWidth="3" /> : null}
      {visible.bessel ? <path d={pathFor((x) => besselJ0(x))} fill="none" stroke="#60a5fa" strokeWidth="3" /> : null}
      {visible.erf ? <path d={pathFor((x) => erfApprox(x))} fill="none" stroke="#22c55e" strokeDasharray="6 5" strokeWidth="3" /> : null}
      <g fontSize="12" fontWeight="950"><text x="300" y="28" fill="#22d3ee">Gamma(x)</text><text x="300" y="46" fill="#60a5fa">J0(x)</text><text x="300" y="64" fill="#22c55e">erf(x)</text></g>
    </svg>
  );
}

function AdvancedInvestigationCycle() {
  const steps = [
    ["Conjecture", "Form a hypothesis. What might be true?"],
    ["Experiment", "Test with examples, simulations, data."],
    ["Prove", "Build a logical mathematical proof."],
    ["Generalize", "Extend to broader contexts and cases."],
  ];
  return (
    <section className="advanced-cycle" aria-labelledby="advanced-cycle-title">
      <h2 id="advanced-cycle-title">The investigation cycle</h2>
      <div>{steps.map(([title, text], index) => <article key={title}><span>{index + 1}</span><strong>{title}</strong><p>{text}</p></article>)}</div>
    </section>
  );
}

function AdvancedRecommendation({ lesson }: { lesson: LearningLessonRef | null }) {
  return (
    <article className="advanced-recommendation">
      <h2>Continue your investigation</h2>
      <div>
        <ConvergenceSvg data={sqrt2Convergents(5)} depth={5} />
        <div>
          <h3>{lesson?.title ?? "Approximating sqrt(2) with convergents"}</h3>
          <p>Explore how continued fractions produce best rational approximations to irrational numbers.</p>
          <span>{lesson ? lessonFormat(lesson) : "Interactive proof"} · {lesson?.minutes ?? 16} min</span>
          <em><i style={{ width: "44%" }} /></em><small>7 / 16 min</small>
          <Link to={lesson?.route ?? "/learn/advanced-mathematics/continued-fractions"}>Resume <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </article>
  );
}

function AdvancedFeaturedInvestigations() {
  const items = [
    ["Collatz Orbit Lab", "Visualize trajectories, cycles and patterns.", "/learn/advanced-mathematics/famous-problems"],
    ["Basel Problem", "Explore partial sums and pi squared over six.", "/learn/advanced-mathematics/famous-problems"],
    ["Bessel Wave Explorer", "Investigate Bessel functions visually.", "/learn/advanced-mathematics/special-functions"],
  ];
  return (
    <section className="advanced-featured" aria-labelledby="advanced-featured-title">
      <h2 id="advanced-featured-title">Featured investigations</h2>
      <div>{items.map(([title, text, route]) => <Link key={title} to={route}><LineChart className="h-5 w-5" /><strong>{title}</strong><span>{text}</span><ArrowRight className="h-4 w-4" /></Link>)}</div>
    </section>
  );
}

function AdvancedWorkspaceLauncher() {
  const items = [["Math Workspace", "GeoGebra-style workspace", "/workspace"], ["Graph Studio 3D", "3D surfaces, slices and vectors", "/math-lab/3d-graphing"], ["Solver / CAS", "Symbolic and numeric solver", "/problem-solver"]];
  return (
    <section className="advanced-workspaces" aria-labelledby="advanced-workspaces-title">
      <h2 id="advanced-workspaces-title">Launch a workspace</h2>
      <div>{items.map(([title, text, route]) => <Link key={title} to={route}><Boxes className="h-5 w-5" /><strong>{title}</strong><span>{text}</span><ArrowRight className="h-4 w-4" /></Link>)}</div>
    </section>
  );
}

function SubtopicExplorer({ topic, subtopic }: { topic: LearningTopic; subtopic: LearningSubtopic }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [mode, setMode] = useState("All");
  const [format, setFormat] = useState("All");
  const [sort, setSort] = useState("Recommended order");
  const palette = paletteForTopicAndSubtopic(topic, subtopic);
  const lessons = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = subtopic.lessons
      .filter((lesson) => !normalized || searchableText(lesson).includes(normalized))
      .filter((lesson) => difficulty === "All" || lessonDifficulty(lesson) === difficulty)
      .filter((lesson) => mode === "All" || lessonMode(lesson) === mode)
      .filter((lesson) => format === "All" || lessonFormat(lesson) === format);
    return [...filtered].sort((a, b) => sort === "Shortest first" ? a.minutes - b.minutes : sort === "Longest first" ? b.minutes - a.minutes : 0);
  }, [difficulty, format, mode, query, sort, subtopic.lessons]);
  const difficulties = availableOptions(subtopic.lessons, lessonDifficulty, ["Foundational", "Intermediate", "Advanced"]);
  const modes = availableOptions(subtopic.lessons, lessonMode, modeOrder);
  const formats = availableOptions(subtopic.lessons, lessonFormat, formatOrder);
  const firstLesson = subtopic.lessons[0] ?? null;

  return (
    <main className="learn-topic-page learn-explorer" style={paletteVars(palette)} data-topic={topic.slug} data-subtopic={subtopic.slug}>
      <Breadcrumbs topic={topic} current={subtopic.title} />
      <Link className="learn-back-link learn-glass-link" to={`/learn/${topic.slug}`}><ArrowLeft className="h-4 w-4" />{topic.title}</Link>

      <section className="learn-explorer-hero" aria-labelledby="subtopic-title">
        <div>
          <p className="learn-kicker">Subtopic</p>
          <h1 id="subtopic-title">{subtopic.title}</h1>
          <p>{subtopic.description} You will connect visual evidence to notation, then use the model in guided lesson cards.</p>
          <div className="learn-stat-row">
            <Pill icon={BookOpen} label={`${subtopic.lessons.length} lessons`} />
            <Pill icon={GraduationCap} label={subtopic.classRange} />
            <Pill icon={Clock3} label={`${subtopicMinutes(subtopic)} min approx.`} />
          </div>
          <div className="learn-hero-actions">
            <Link className="learn-primary" to={firstLesson?.route ?? "#lessons"}>Start recommended path <ArrowRight className="h-4 w-4" /></Link>
            <Link className="learn-secondary" to="#lessons"><FlaskConical className="h-4 w-4" />Open visual sandbox</Link>
          </div>
        </div>
        <SubtopicLiveCanvas topicSlug={topic.slug} subtopic={subtopic} large />
      </section>

      <section id="lessons" className="learn-lesson-explorer" aria-labelledby="lesson-grid-title">
        <div className="learn-explorer-toolbar">
          <div>
            <h2 id="lesson-grid-title">{subtopic.lessons.length} visual, interactive lessons</h2>
            <p>Every lesson begins with a manipulable idea, then connects to notation and practice.</p>
          </div>
          <label className="learn-explorer-search">
            <Search className="h-4 w-4" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lessons..." />
          </label>
        </div>
        <div className="learn-filter-grid" aria-label="Lesson explorer filters">
          <SelectFilter label="Difficulty" value={difficulty} options={["All", ...difficulties]} onChange={setDifficulty} />
          <SelectFilter label="Learning type" value={mode} options={["All", ...modes]} onChange={setMode} />
          <SelectFilter label="Interaction" value={format} options={["All", ...formats]} onChange={setFormat} />
          <SelectFilter label="Sort" value={sort} options={["Recommended order", "Shortest first", "Longest first"]} onChange={setSort} />
          <SlidersHorizontal className="learn-filter-glyph h-5 w-5" aria-hidden="true" />
        </div>
        <div className="learn-lesson-grid learn-lesson-card-grid">
          {lessons.map((lesson, index) => <LessonCard key={lesson.route} lesson={lesson} index={index} />)}
          {lessons.length === 0 ? <p className="learn-empty">No lesson matches those filters yet. Clear one filter to see more of this pathway.</p> : null}
        </div>
      </section>
    </main>
  );
}

function Breadcrumbs({ topic, current }: { topic?: LearningTopic; current: string }) {
  return (
    <nav className="learn-breadcrumbs" aria-label="Learning breadcrumbs">
      <Link to="/">Home</Link><span>/</span>
      <Link to="/learn">Learning Hub</Link><span>/</span>
      {topic ? <><Link to={`/learn/${topic.slug}`}>{topic.title}</Link><span>/</span></> : null}
      <strong>{current}</strong>
    </nav>
  );
}

function Pill({ icon: Icon, label }: { icon: typeof BookOpen; label: string }) {
  return <span className="learn-info-pill"><Icon className="h-4 w-4" />{label}</span>;
}

function SubtopicPathwayCard({ topic, subtopic, index }: { topic: LearningTopic; subtopic: LearningSubtopic; index: number }) {
  const activity = dominantFormat(subtopic.lessons);
  return (
    <Link className="learn-pathway-card" to={`/learn/${topic.slug}/${subtopic.slug}`}>
      <div className="learn-card-head">
        <span className="learn-pathway-step">{index + 1}</span>
        <div>
          <h3>{subtopic.title}</h3>
          <p>{subtopic.description}</p>
        </div>
        <ArrowRight className="h-5 w-5" />
      </div>
      <SubtopicLiveCanvas topicSlug={topic.slug} subtopic={subtopic} />
      <div className="learn-card-meta">
        <span>{subtopic.lessons.length} lessons</span>
        <span>{subtopic.classRange}</span>
        <span>{activity}</span>
      </div>
      <div className="learn-skill-chips">
        {skillChips(subtopic).map((chip) => <span key={chip}>{chip}</span>)}
      </div>
      <div className="learn-progress-track"><span style={{ width: `${Math.min(85, 10 + index * 12)}%` }} /></div>
      <strong className="learn-explore-action">Explore subtopic <ArrowRight className="h-4 w-4" /></strong>
    </Link>
  );
}

function LearningMethodStrip() {
  const steps = [
    { title: "Predict", text: "Name what you expect before touching the model.", icon: Target },
    { title: "Manipulate", text: "Move sliders, points, tiles, samples, or surfaces.", icon: SlidersHorizontal },
    { title: "Observe", text: "Compare visual evidence, equations, and measures.", icon: LineChart },
    { title: "Explain", text: "Write the reason in precise mathematical language.", icon: BrainCircuit },
  ];
  return (
    <div className="learn-method-strip">
      {steps.map(({ title, text, icon: Icon }, index) => (
        <article key={title}>
          <Icon className="h-5 w-5" />
          <span>{index + 1}</span>
          <strong>{title}</strong>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}

function LessonCard({ lesson, index }: { lesson: LearningLessonRef; index: number }) {
  const difficulty = lessonDifficulty(lesson);
  const mode = lessonMode(lesson);
  const format = lessonFormat(lesson);
  const [preview, setPreview] = useState(() => 0.28 + (index % 5) * 0.1);

  function updatePreview(event: PointerEvent<HTMLAnchorElement> | MouseEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = (event.clientX - bounds.left) / Math.max(1, bounds.width);
    setPreview(Math.min(1, Math.max(0, next)));
  }

  return (
    <Link
      className="learn-catalog-card"
      to={lesson.route}
      aria-label={`Open lesson ${lesson.title}. Move across the thumbnail to preview the model before opening.`}
      onBlur={() => setPreview(0.28 + (index % 5) * 0.1)}
      onFocus={() => setPreview(0.72)}
      onPointerLeave={() => setPreview(0.28 + (index % 5) * 0.1)}
      onPointerMove={updatePreview}
      onMouseMove={updatePreview}
      style={{ "--thumb-t": preview } as CSSProperties}
    >
      <LessonThumbnail lesson={lesson} index={index} t={preview} />
      <div className="learn-catalog-body">
        <div className="learn-catalog-overline">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <small>{mode}</small>
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.summary}</p>
        <div className="learn-catalog-meta">
          <span>{difficulty}</span>
          <span>{format}</span>
          <span>{lesson.minutes} min</span>
        </div>
      </div>
      <span className="learn-catalog-open"><ArrowRight className="h-4 w-4" /></span>
    </Link>
  );
}

function TopicLiveCanvas({ topic }: { topic: LearningTopic }) {
  return (
    <div className="learn-live-canvas" aria-label={`${topic.title} interactive mathematical preview`} role="img">
      <svg viewBox="0 0 720 360">
        <Grid />
        <TopicScene slug={topic.slug} title={topic.shortTitle} />
      </svg>
      <div className="learn-canvas-controls">
        <span>a = 1.2</span>
        <span>b = -2</span>
        <button type="button"><Play className="h-4 w-4" /> Preview</button>
      </div>
    </div>
  );
}

function SubtopicLiveCanvas({ topicSlug, subtopic, large = false }: { topicSlug: string; subtopic: LearningSubtopic; large?: boolean }) {
  return (
    <div className={large ? "learn-subtopic-canvas is-large" : "learn-subtopic-canvas"} aria-label={`${subtopic.title} visual preview`} role="img">
      <svg viewBox="0 0 520 260">
        <Grid />
        <SubtopicScene topicSlug={topicSlug} subtopic={subtopic} />
      </svg>
    </div>
  );
}

function LessonThumbnail({ lesson, index, t }: { lesson: LearningLessonRef; index: number; t: number }) {
  const kind = thumbnailKind(lesson);
  return (
    <div className="learn-lesson-thumb" aria-label={`${lesson.title} interactive mathematical thumbnail preview`} role="img">
      <svg viewBox="0 0 420 190">
        <Grid />
        <ThumbnailScene kind={kind} lesson={lesson} index={index} t={t} />
        <ThumbInteractionOverlay kind={kind} t={t} />
      </svg>
      <span className="learn-thumb-cue">Move pointer to manipulate preview</span>
    </div>
  );
}

function Grid() {
  return (
    <g opacity=".78">
      <rect width="100%" height="100%" rx="22" fill="#ffffff" />
      {Array.from({ length: 12 }, (_, i) => <line key={`v${i}`} x1={40 + i * 54} x2={40 + i * 54} y1="18" y2="342" stroke="#dbeafe" strokeWidth="1" />)}
      {Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1="30" x2="690" y1={42 + i * 42} y2={42 + i * 42} stroke="#dbeafe" strokeWidth="1" />)}
    </g>
  );
}

function TopicScene({ slug, title }: { slug: string; title: string }) {
  if (slug === "numbers-and-arithmetic") return <NumberScene />;
  if (slug === "algebra") return <AlgebraScene />;
  if (slug === "functions-and-graphs") return <FunctionsScene />;
  if (slug === "geometry") return <GeometryScene />;
  if (slug === "trigonometry") return <TrigScene />;
  if (slug === "calculus") return <CalculusScene />;
  if (slug === "statistics-and-probability") return <StatsScene />;
  if (slug === "vectors-and-3d-mathematics") return <VectorsScene />;
  if (slug === "discrete-and-applied-mathematics") return <DiscreteScene />;
  return <AdvancedScene title={title} />;
}

function SubtopicScene({ topicSlug, subtopic }: { topicSlug: string; subtopic: LearningSubtopic }) {
  const label = subtopic.title.split(" ").slice(0, 3).join(" ");
  if (/expression|identity|factor|expand/i.test(subtopic.title)) return <AlgebraTiles label={label} />;
  if (/linear|slope|intercept/i.test(subtopic.title)) return <LineAndBalance label={label} />;
  if (/quadratic|parabola|root|vertex/i.test(subtopic.title)) return <ParabolaScene label={label} />;
  if (/ratio|fraction|number|power|root/i.test(subtopic.title)) return <NumberScene compact />;
  if (/triangle|circle|construction|coordinate|shape/i.test(subtopic.title)) return <GeometryScene compact />;
  if (/wave|trig|sine|cosine|identity/i.test(subtopic.title) || topicSlug === "trigonometry") return <TrigScene compact />;
  if (/limit|derivative|integral|continuity/i.test(subtopic.title) || topicSlug === "calculus") return <CalculusScene compact />;
  if (/data|probability|inference|distribution/i.test(subtopic.title)) return <StatsScene compact />;
  if (/vector|matrix|3d|plane|surface/i.test(subtopic.title)) return <VectorsScene compact />;
  if (/set|logic|graph|combinator|finance/i.test(subtopic.title)) return <DiscreteScene compact />;
  return <AdvancedScene title={label} compact />;
}

function ThumbnailScene({ kind, lesson, index, t }: { kind: string; lesson: LearningLessonRef; index: number; t: number }) {
  const hue = 205 + (hashText(lesson.title) % 130);
  if (kind === "tiles") return <AlgebraTiles label={lesson.title} t={t} />;
  if (kind === "balance") return <LineAndBalance label={lesson.title} t={t} />;
  if (kind === "parabola") return <ParabolaScene label={lesson.title} t={t} />;
  if (kind === "geometry") return <GeometryScene compact t={t} />;
  if (kind === "trig") return <TrigScene compact t={t} />;
  if (kind === "calculus") return <CalculusScene compact t={t} />;
  if (kind === "stats") return <StatsScene compact t={t} />;
  if (kind === "vectors") return <VectorsScene compact t={t} />;
  if (kind === "discrete") return <DiscreteScene compact t={t} />;
  if (kind === "number") return <NumberScene compact t={t} />;
  const x = 80 + (hashText(lesson.title) % 240) * (0.62 + t * 0.38);
  const y = 78 + (hashText(lesson.summary) % 62) - 26 * Math.sin(t * Math.PI);
  return (
    <g>
      <path d={`M38 ${124 - index % 4 * 7} C92 ${82 - t * 26} 142 ${142 - t * 44} 196 94 S300 ${42 + t * 36} 372 88`} fill="none" stroke={`hsl(${hue} 82% 48%)`} strokeWidth="7" strokeLinecap="round" />
      <circle cx={x} cy={y} r="15" fill="#fff" stroke={`hsl(${hue} 82% 48%)`} strokeWidth="6" />
      <line x1={x} x2={x} y1={y} y2="154" stroke={`hsl(${hue} 82% 48%)`} strokeDasharray="5 5" strokeWidth="2" opacity=".7" />
      <text x="40" y="164" fill="#1e3a8a" fontSize="19" fontWeight="800">{formulaSnippet(lesson.title)}</text>
    </g>
  );
}

function NumberScene({ compact = false, t = 0.5 }: { compact?: boolean; t?: number }) {
  const markerX = 132 + t * 390;
  const dash = 120 + t * 220;
  return <g><line x1="76" y1="210" x2="620" y2="210" stroke="#0f172a" strokeWidth="3" /><path d="M134 120 h70 v70 h-70zM230 100 h50 v90 h-50zM296 72 h42 v118 h-42z" fill="#60a5fa" opacity=".78" /><path d="M380 92 A68 68 0 1 1 379 92" fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray={`${dash} 427`} /><text x="420" y="128" fill="#1d4ed8" fontSize={compact ? 22 : 30} fontWeight="900">{Math.max(1, Math.round(t * 8))}/8</text><circle cx="188" cy="210" r="11" fill="#7c3aed" /><circle cx={markerX} cy="210" r="13" fill="#fff" stroke="#06b6d4" strokeWidth="5" /></g>;
}

function AlgebraScene() {
  return <g><AlgebraTiles label="(x + 2)(x + 3)" /><path d="M412 238 C470 98 548 312 646 94" fill="none" stroke="#06b6d4" strokeWidth="5" /><circle cx="525" cy="163" r="11" fill="#fff" stroke="#06b6d4" strokeWidth="5" /><text x="398" y="54" fill="#6d28d9" fontSize="24" fontWeight="900">f(x)=x³-3x+1.2</text></g>;
}

function FunctionsScene() {
  return <g><path d="M80 86 h96 M80 146 h96 M80 206 h96" stroke="#7c3aed" strokeWidth="4" /><path d="M190 86 C250 86 250 206 308 206 M190 146 C250 146 250 86 308 86 M190 206 C250 206 250 146 308 146" fill="none" stroke="#06b6d4" strokeWidth="3" /><path d="M378 222 C430 64 506 252 632 96" fill="none" stroke="#2563eb" strokeWidth="6" /><circle cx="438" cy="128" r="12" fill="#fff" stroke="#2563eb" strokeWidth="5" /><circle cx="578" cy="126" r="12" fill="#fff" stroke="#06b6d4" strokeWidth="5" /><text x="406" y="56" fill="#0f172a" fontSize="22" fontWeight="900">table to graph</text></g>;
}

function GeometryScene({ compact = false, t = 0.45 }: { compact?: boolean; t?: number }) {
  const apexX = 286 + t * 92;
  const apexY = 48 + t * 34;
  const angle = Math.round(42 + t * 56);
  return <g><circle cx="332" cy="145" r={compact ? 70 : 92} fill="#e0f2fe" stroke="#93c5fd" strokeDasharray="8 8" strokeWidth="3" /><path d={`M178 216 L${apexX} ${apexY} L532 220 Z`} fill="#fef3c7" opacity=".62" stroke="#f97316" strokeWidth="6" /><path d="M178 216 Q356 262 532 220" fill="none" stroke="#7c3aed" strokeWidth="5" /><line x1={apexX} y1={apexY} x2="356" y2="220" stroke="#06b6d4" strokeWidth="4" /><circle cx={apexX} cy={apexY} r="12" fill="#fff" stroke="#f97316" strokeWidth="5" /><text x="94" y="82" fill="#ea580c" fontSize="22" fontWeight="900">angle = {angle}°</text></g>;
}

function TrigScene({ compact = false, t = 0.42 }: { compact?: boolean; t?: number }) {
  const theta = t * Math.PI * 1.6;
  const px = 170 + Math.cos(theta) * 78;
  const py = 142 - Math.sin(theta) * 78;
  return <g><circle cx="170" cy="142" r="78" fill="#ecfdf5" stroke="#10b981" strokeWidth="4" /><line x1="170" y1="142" x2={px} y2={py} stroke="#059669" strokeWidth="6" /><line x1="170" y1="142" x2={px} y2="142" stroke="#f59e0b" strokeWidth="4" /><line x1={px} y1={py} x2={px} y2="142" stroke="#06b6d4" strokeDasharray="5 5" strokeWidth="3" /><circle cx={px} cy={py} r="11" fill="#fff" stroke="#059669" strokeWidth="5" /><path d={`M302 142 C350 ${56 + t * 60} 396 ${226 - t * 70} 450 142 S548 ${56 + t * 60} 618 142`} fill="none" stroke="#06b6d4" strokeWidth="6" /><text x="320" y={compact ? 52 : 62} fill="#047857" fontSize="24" fontWeight="900">sin θ</text></g>;
}

function CalculusScene({ compact = false, t = 0.5 }: { compact?: boolean; t?: number }) {
  const x1 = 206 + t * 92;
  const y1 = 156 - t * 36;
  const x2 = x1 + 92 - t * 54;
  const y2 = y1 + 58 - t * 42;
  return <g><path d="M96 228 C174 68 266 68 342 178 S498 292 624 70" fill="none" stroke="#4f46e5" strokeWidth="7" /><path d={`M${x1 - 38} ${y1 - 14} L${x2 + 38} ${y2 + 14}`} stroke="#ec4899" strokeWidth="5" /><path d={`M130 230 C170 170 208 151 ${x1} ${y1} L${x1} 230 Z`} fill="#93c5fd" opacity=".35" /><circle cx={x1} cy={y1} r="12" fill="#fff" stroke="#4f46e5" strokeWidth="5" /><circle cx={x2} cy={y2} r="12" fill="#fff" stroke="#ec4899" strokeWidth="5" /><text x="430" y={compact ? 84 : 70} fill="#be185d" fontSize="24" fontWeight="900">f'(x)</text></g>;
}

function StatsScene({ compact = false, t = 0.5 }: { compact?: boolean; t?: number }) {
  const shift = (t - 0.5) * 60;
  return <g><path d={`M${92 + shift} 220 C${154 + shift} 72 ${230 + shift} 72 ${292 + shift} 220`} fill="#f9a8d4" opacity=".45" stroke="#db2777" strokeWidth="5" /><path d={`M356 218 h38 v-${46 + t * 36} h-38zM410 218 h38 v-${78 + t * 30}h-38zM464 218 h38v-${106 - t * 36}h-38zM518 218 h38v-${62 + t * 20}h-38z`} fill="#67e8f9" stroke="#06b6d4" strokeWidth="3" /><circle cx={184 + shift} cy="136" r="9" fill="#7c3aed" /><circle cx="476" cy={120 - t * 48} r="9" fill="#db2777" /><text x="102" y={compact ? 64 : 58} fill="#be185d" fontSize="23" fontWeight="900">mean shifts</text></g>;
}

function VectorsScene({ compact = false, t = 0.5 }: { compact?: boolean; t?: number }) {
  const vx = 372 + t * 92;
  const vy = 126 - t * 44;
  const wx = 244 - t * 66;
  const wy = 206 + t * 34;
  return <g><path d="M180 218 L300 154 L420 216 L300 278 Z" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" /><path d="M180 112 L300 52 L420 112 L300 174 Z M180 112 L180 218 M300 52 L300 154 M420 112 L420 216" fill="none" stroke="#7c3aed" strokeWidth="3" opacity=".7" /><path d={`M300 154 L${vx} ${vy}`} stroke="#06b6d4" strokeWidth="7" markerEnd="url(#arrow)" /><path d={`M300 154 L${wx} ${wy}`} stroke="#4f46e5" strokeWidth="7" markerEnd="url(#arrow)" /><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#0f172a" /></marker></defs><text x="448" y={compact ? 74 : 64} fill="#1d4ed8" fontSize="23" fontWeight="900">v + w</text></g>;
}

function DiscreteScene({ compact = false, t = 0.5 }: { compact?: boolean; t?: number }) {
  const pts = [[154, 84], [286, 64], [424, 102], [218, 188], [362, 206], [526, 164]];
  const active = Math.floor(t * pts.length);
  return <g>{pts.map(([x1, y1], i) => pts.slice(i + 1).map(([x2, y2], j) => (i + j) % 2 === 0 ? <line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i <= active ? "#f59e0b" : "#bfdbfe"} strokeWidth="4" opacity=".75" /> : null))}{pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === active ? 23 : 18} fill={i % 2 ? "#fff" : "#dbeafe"} stroke={i === active ? "#f59e0b" : "#2563eb"} strokeWidth="5" />)}<text x="96" y={compact ? 236 : 246} fill="#92400e" fontSize="22" fontWeight="900">path count</text></g>;
}

function AdvancedScene({ title, compact = false }: { title: string; compact?: boolean }) {
  return <g><path d="M326 148 m-86 0 a86 86 0 1 0 172 0 a64 64 0 1 1 -128 0 a42 42 0 1 0 84 0 a22 22 0 1 1 -44 0" fill="none" stroke="#7c3aed" strokeWidth="7" /><path d="M94 84 h150 M118 132 h118 M144 180 h92" stroke="#0f172a" strokeWidth="4" /><text x="96" y={compact ? 226 : 238} fill="#4c1d95" fontSize="23" fontWeight="900">{formulaSnippet(title)}</text></g>;
}

function AlgebraTiles({ label, t = 0.5 }: { label: string; t?: number }) {
  const spread = 22 + t * 42;
  return <g><rect x="58" y="74" width="116" height="82" rx="10" fill="#4f46e5" opacity=".92" /><rect x={158 + spread} y="74" width="76" height="82" rx="10" fill="#06b6d4" opacity=".9" /><rect x="58" y="162" width="116" height="48" rx="10" fill="#7c3aed" opacity=".78" /><rect x={158 + spread} y="162" width="76" height="48" rx="10" fill="#f97316" opacity=".86" /><path d="M292 142 h80" stroke="#4f46e5" strokeWidth="8" /><path d="M348 118 l28 24 l-28 24" fill="none" stroke="#4f46e5" strokeWidth="8" /><text x="72" y="126" fill="#fff" fontSize="22" fontWeight="900">x²</text><text x={174 + spread} y="126" fill="#fff" fontSize="20" fontWeight="900">3x</text><text x="406" y="132" fill="#06b6d4" fontSize="21" fontWeight="900">{formulaSnippet(label)}</text></g>;
}

function LineAndBalance({ label, t = 0.5 }: { label: string; t?: number }) {
  const tilt = (t - 0.5) * 28;
  const pointX = 332 + t * 186;
  const pointY = 197 - t * 86;
  return <g><line x1="84" y1={172 + tilt} x2="244" y2={172 - tilt} stroke="#64748b" strokeWidth="5" /><line x1="164" y1="122" x2="164" y2="218" stroke="#64748b" strokeWidth="5" /><path d={`M116 ${172 + tilt} l-42 38 h84zM212 ${172 - tilt} l-42 26 h84z`} fill="#dbeafe" stroke="#64748b" /><path d="M286 218 L612 68" stroke="#06b6d4" strokeWidth="6" /><circle cx={pointX} cy={pointY} r="12" fill="#fff" stroke="#06b6d4" strokeWidth="5" /><text x="94" y="92" fill="#4f46e5" fontSize="22" fontWeight="900">2x + 4 = 10</text><text x="446" y="76" fill="#0e7490" fontSize="20" fontWeight="900">{formulaSnippet(label)}</text></g>;
}

function ParabolaScene({ label, t = 0.5 }: { label: string; t?: number }) {
  const rootLeft = 120 + t * 64;
  const rootRight = 354 - t * 40;
  const vertexX = (rootLeft + rootRight) / 2;
  const vertexY = 226 - t * 38;
  return <g><path d={`M92 72 C${rootLeft + 30} 244 ${rootRight - 30} 244 392 72`} fill="none" stroke="#2563eb" strokeWidth="7" /><line x1="72" y1="178" x2="420" y2="178" stroke="#0f172a" strokeWidth="2" /><circle cx={rootLeft} cy="178" r="11" fill="#fff" stroke="#4f46e5" strokeWidth="5" /><circle cx={rootRight} cy="178" r="11" fill="#fff" stroke="#06b6d4" strokeWidth="5" /><circle cx={vertexX} cy={vertexY} r="11" fill="#7c3aed" /><text x="430" y="104" fill="#1d4ed8" fontSize="21" fontWeight="900">{formulaSnippet(label)}</text><text x="220" y="246" fill="#7c3aed" fontSize="18" fontWeight="900">vertex</text></g>;
}

function ThumbInteractionOverlay({ kind, t }: { kind: string; t: number }) {
  const x = 58 + t * 292;
  const label = kind === "tiles" ? "factor" : kind === "balance" ? "solve" : kind === "parabola" ? "move root" : kind === "geometry" ? "drag point" : kind === "stats" ? "sample" : kind === "vectors" ? "rotate" : "drag";
  return (
    <g className="learn-thumb-overlay">
      <rect x="36" y="151" width="336" height="22" rx="11" fill="#ffffff" opacity=".92" />
      <line x1="58" x2="350" y1="162" y2="162" stroke="#c7d2fe" strokeWidth="5" strokeLinecap="round" />
      <line x1="58" x2={x} y1="162" y2="162" stroke="#4f46e5" strokeWidth="5" strokeLinecap="round" />
      <circle cx={x} cy="162" r="9" fill="#fff" stroke="#4f46e5" strokeWidth="5" />
      <text x="44" y="142" fill="#075985" fontSize="13" fontWeight="900">{label}</text>
      <text x="290" y="142" fill="#4f46e5" fontSize="13" fontWeight="900">{Math.round(t * 100)}%</text>
    </g>
  );
}

function LearningNotFound({ topics }: { topics: ReturnType<typeof getLearningTopics> }) {
  return (
    <main className="learn-topic-page learn-master">
      <section className="learn-pathway-panel">
        <p className="learn-kicker">Topic not found</p>
        <h1>Choose one of the curated learning topics.</h1>
        <div className="learn-pathway-cards">
          {topics.map((topic) => (
            <Link key={topic.slug} className="learn-pathway-card" to={`/learn/${topic.slug}`}>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <span>{topic.subtopics.length} subtopics</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="learn-filter-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function paletteFor(slug: string) {
  return topicPalettes[slug] ?? topicPalettes["functions-and-graphs"];
}

function paletteForTopicAndSubtopic(topic: LearningTopic, subtopic: LearningSubtopic) {
  const base = paletteFor(topic.slug);
  return topicPalettes[subtopic.slug] ?? { ...base, primary: accentColor(subtopic.accent), soft: `${accentColor(subtopic.accent)}15` };
}

function paletteVars(palette: { primary: string; secondary: string; soft: string; ink: string }) {
  return { "--topic-primary": palette.primary, "--topic-secondary": palette.secondary, "--topic-soft": palette.soft, "--topic-ink": palette.ink } as CSSProperties;
}

function accentColor(accent: string) {
  const colors: Record<string, string> = { blue: "#2563eb", cyan: "#06b6d4", violet: "#7c3aed", fuchsia: "#d946ef", amber: "#f59e0b", emerald: "#059669", teal: "#0d9488", orange: "#f97316", rose: "#e11d48", sky: "#0284c7", indigo: "#4f46e5", lime: "#65a30d", slate: "#475569" };
  return colors[accent] ?? "#4f46e5";
}

function calculusAccent(index: number) {
  return ["#7c3aed", "#2563eb", "#ec4899"][index] ?? "#4f46e5";
}

function numbersAccent(index: number) {
  return ["#2457ff", "#14b8a6", "#7c3aed"][index] ?? "#2563eb";
}

function functionsAccent(index: number) {
  return ["#2457ff", "#0ea5e9", "#7c3aed", "#ec4899", "#0891b2"][index] ?? "#2563eb";
}

function geometryAccent(index: number) {
  return ["#f97316", "#06b6d4", "#7c3aed"][index] ?? "#f97316";
}

function trigAccent(index: number) {
  return ["#059669", "#0ea5e9", "#7c3aed"][index] ?? "#059669";
}

function statisticsAccent(index: number) {
  return ["#fb7185", "#7c3aed", "#10b981"][index] ?? "#0891b2";
}

function vectorAccent(index: number) {
  return ["#22d3ee", "#7c3aed", "#38bdf8"][index] ?? "#2563eb";
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

function sqrt2Convergents(depth: number) {
  const safeDepth = Math.max(1, Math.min(12, Math.floor(depth)));
  let pMinus2 = 0n;
  let pMinus1 = 1n;
  let qMinus2 = 1n;
  let qMinus1 = 0n;
  return Array.from({ length: safeDepth }, (_, index) => {
    const a = index === 0 ? 1n : 2n;
    const p = a * pMinus1 + pMinus2;
    const q = a * qMinus1 + qMinus2;
    pMinus2 = pMinus1;
    pMinus1 = p;
    qMinus2 = qMinus1;
    qMinus1 = q;
    const decimal = Number(p) / Number(q);
    return { n: index + 1, p, q, decimal, error: Math.abs(Math.SQRT2 - decimal) };
  });
}

function collatzSequence(start: number) {
  const sequence = [start];
  let value = start;
  while (value !== 1 && sequence.length < 500) {
    value = value % 2 === 0 ? value / 2 : value * 3 + 1;
    sequence.push(value);
  }
  return sequence;
}

function gammaApprox(x: number): number | null {
  if (Math.abs(x - Math.round(x)) < 0.018 && x <= 0) return null;
  const p = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * (gammaApprox(1 - x) ?? Number.NaN));
  const z = x - 1;
  let a = 0.9999999999998099;
  for (let i = 0; i < p.length; i++) a += p[i] / (z + i + 1);
  const t = z + p.length - 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (z + 0.5) * Math.exp(-t) * a;
}

function besselJ0(x: number) {
  let sum = 1;
  let term = 1;
  const xx = (x * x) / 4;
  for (let k = 1; k <= 24; k++) {
    term *= -xx / (k * k);
    sum += term;
  }
  return sum;
}

function erfApprox(x: number) {
  const sign = x < 0 ? -1 : 1;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const abs = Math.abs(x);
  const t = 1 / (1 + p * abs);
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-abs * abs);
  return sign * y;
}

function formatRadians(degrees: number) {
  if (degrees === 0) return "0 rad";
  if (degrees === 30) return "pi/6 rad";
  if (degrees === 45) return "pi/4 rad";
  if (degrees === 60) return "pi/3 rad";
  if (degrees === 90) return "pi/2 rad";
  if (degrees === 180) return "pi rad";
  if (degrees === 270) return "3pi/2 rad";
  if (degrees === 360) return "2pi rad";
  return `${(degrees * Math.PI / 180).toFixed(3)} rad`;
}

function distance(a: GeometryPoint, b: GeometryPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function triangleArea(a: GeometryPoint, b: GeometryPoint, c: GeometryPoint) {
  return Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);
}

function angleAt(origin: GeometryPoint, p1: GeometryPoint, p2: GeometryPoint) {
  const v1 = { x: p1.x - origin.x, y: p1.y - origin.y };
  const v2 = { x: p2.x - origin.x, y: p2.y - origin.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
  return Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180 / Math.PI;
}

function circumcenter(a: GeometryPoint, b: GeometryPoint, c: GeometryPoint): GeometryPoint | null {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 0.001) return null;
  const ux = ((a.x * a.x + a.y * a.y) * (b.y - c.y) + (b.x * b.x + b.y * b.y) * (c.y - a.y) + (c.x * c.x + c.y * c.y) * (a.y - b.y)) / d;
  const uy = ((a.x * a.x + a.y * a.y) * (c.x - b.x) + (b.x * b.x + b.y * b.y) * (a.x - c.x) + (c.x * c.x + c.y * c.y) * (b.x - a.x)) / d;
  return { x: ux, y: uy };
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1).replace(/\.0$/, "");
}

function formatQuadratic(a: number, b: number, c: number) {
  const parts = [`${formatNumber(a)}x^2`];
  if (b !== 0) parts.push(`${b > 0 ? "+" : "-"} ${formatNumber(Math.abs(b))}x`);
  if (c !== 0) parts.push(`${c > 0 ? "+" : "-"} ${formatNumber(Math.abs(c))}`);
  return parts.join(" ");
}

function countTopicLessons(topic: LearningTopic) {
  return topic.subtopics.reduce((sum, subtopic) => sum + subtopic.lessons.length, 0);
}

function topicMinutes(topic: LearningTopic) {
  return topic.subtopics.reduce((sum, subtopic) => sum + subtopicMinutes(subtopic), 0);
}

function subtopicMinutes(subtopic: LearningSubtopic) {
  return subtopic.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
}

function topicClassRange(topic: LearningTopic) {
  const ranges = Array.from(new Set(topic.subtopics.map((subtopic) => subtopic.classRange)));
  if (ranges.length === 1) return ranges[0];
  if (ranges.some((range) => /Advanced|Applied/i.test(range))) return "School to Advanced";
  const grades = ranges.flatMap((range) => Array.from(range.matchAll(/\d+/g), (match) => Number(match[0])));
  return grades.length > 0 ? `Classes ${Math.min(...grades)}-${Math.max(...grades)}` : ranges.join(", ");
}

function searchableText(lesson: LearningLessonRef) {
  return `${lesson.title} ${lesson.summary} ${lesson.topic} ${lesson.level} ${lesson.kind}`.toLowerCase();
}

function lessonDifficulty(lesson: LearningLessonRef): Difficulty {
  const text = searchableText(lesson);
  if (/advanced|class 11|class 12|proof|theorem|bessel|gamma|differential|integral|derivative/.test(text)) return "Advanced";
  if (/intermediate|class 8|class 9|class 10|quadratic|matrix|probability|trigonometry/.test(text)) return "Intermediate";
  return "Foundational";
}

function lessonMode(lesson: LearningLessonRef): LearningMode {
  const text = searchableText(lesson);
  if (/assessment|quiz|checkpoint|test/.test(text)) return "Assessment";
  if (/review|revision|summary/.test(text)) return "Revision";
  if (/proof|theorem|identity|derive|justify/.test(text)) return "Visual Proof";
  if (/challenge|famous|advanced problem/.test(text)) return "Challenge";
  if (/investigate|inquiry|compare|experiment/.test(text)) return "Investigation";
  if (/practice|exercise|solve/.test(text)) return "Practice";
  if (/explore|visual|model|dynamic|lab/.test(text)) return "Explore";
  return "Learn";
}

function lessonFormat(lesson: LearningLessonRef): InteractionFormat {
  const text = searchableText(lesson);
  if (/3d|solid|surface|plane|three dimensional/.test(text)) return "3D";
  if (/graph|function|slope|parabola|curve|domain|range|plot/.test(text)) return "Graphing";
  if (/geometry|triangle|circle|angle|construction|locus/.test(text)) return "Construction";
  if (/cas|symbolic|factor|expression|equation|polynomial|algebra/.test(text)) return "CAS";
  if (/data|distribution|mean|median|probability|sample/.test(text)) return "Data Experiment";
  if (/simulate|random|experiment/.test(text)) return "Simulation";
  if (/numeric|number|integer|fraction|ratio/.test(text)) return "Numeric Answer";
  if (/animation|transform|motion/.test(text)) return "Animation";
  return "Algebraic Answer";
}

function availableOptions<T extends string>(lessons: LearningLessonRef[], getter: (lesson: LearningLessonRef) => T, order: readonly T[]) {
  const values = new Set(lessons.map(getter));
  return order.filter((option) => values.has(option));
}

function dominantFormat(lessons: LearningLessonRef[]) {
  if (lessons.length === 0) return "Visual lab";
  const counts = lessons.reduce<Record<string, number>>((acc, lesson) => {
    const format = lessonFormat(lesson);
    acc[format] = (acc[format] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Visual lab";
}

function skillChips(subtopic: LearningSubtopic) {
  return subtopic.title.split(/\s+and\s+|\s+/).filter((word) => word.length > 3).slice(0, 3);
}

function thumbnailKind(lesson: LearningLessonRef) {
  const text = searchableText(lesson);
  if (/factor|expand|expression|identity|tile|polynomial/.test(text)) return "tiles";
  if (/linear equation|balance|simultaneous|system/.test(text)) return "balance";
  if (/quadratic|parabola|root|vertex|discriminant/.test(text)) return "parabola";
  if (/geometry|triangle|circle|angle|construction|coordinate/.test(text)) return "geometry";
  if (/sine|cosine|tangent|trig|wave/.test(text)) return "trig";
  if (/limit|derivative|integral|tangent|area|calculus/.test(text)) return "calculus";
  if (/data|probability|mean|median|distribution|sample|inference/.test(text)) return "stats";
  if (/vector|matrix|3d|plane|surface/.test(text)) return "vectors";
  if (/graph theory|set|logic|permutation|combination|finance|interest/.test(text)) return "discrete";
  if (/number|fraction|ratio|proportion|power|root|integer/.test(text)) return "number";
  return "curve";
}

function formulaSnippet(title: string) {
  const lower = title.toLowerCase();
  if (title.startsWith("(x")) return title;
  if (lower.includes("factor")) return "(x+a)(x+b)";
  if (lower.includes("linear")) return "y = mx + b";
  if (lower.includes("quadratic")) return "ax²+bx+c";
  if (lower.includes("domain") || lower.includes("range")) return "D -> R";
  if (lower.includes("derivative")) return "f'(x)";
  if (lower.includes("integral")) return "∫ f(x) dx";
  if (lower.includes("matrix")) return "A·v";
  if (lower.includes("probability")) return "P(A)";
  if (lower.includes("fraction")) return "a/b";
  return title.split(/\s+/).slice(0, 2).join(" ");
}

function hashText(text: string) {
  return Array.from(text).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}
