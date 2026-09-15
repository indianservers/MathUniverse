import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, HelpCircle, Lightbulb, Pencil, Play, Trophy } from "lucide-react";
import { parseChallengeAnswer } from "../mockup/studioLabKit";
import { TopicIllustration } from "../mockup/labs/TopicIllustrations";
import { studioNavPages, type StudioMockupDefinition } from "../mockup/studioMockupCatalog";
import { dailyChallengeIndex } from "../mockup/trigStudioSession";
import {
  GEO_HOME_LEARNING,
  GEO_LAB_META,
  GEO_PATH,
  type GeoTrack,
} from "./geometryStudioCopy";
import {
  continueGeoHref,
  markGeoWarmup,
  nextGeoLab,
  relativeOpened,
  useGeoSession,
  writeGeoSession,
} from "./geometryStudioSession";

const TRACKS: Array<{ id: "all" | GeoTrack; label: string }> = [
  { id: "all", label: "All" },
  { id: "2d", label: "2D" },
  { id: "3d", label: "3D" },
  { id: "proof", label: "Proof" },
];

export default function GeometryStudioHome({ studio }: { studio: StudioMockupDefinition }) {
  const labs = studioNavPages(studio);
  const session = useGeoSession();
  const [track, setTrack] = useState<"all" | GeoTrack>("all");
  const [board, setBoard] = useState<"all" | "NCERT" | "Extra">("all");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const pool = labs.filter((item) => item.challenge.prompt !== "0");
  const challengePage = pool[dailyChallengeIndex(pool.length)] ?? pool[0];
  const challenge = challengePage?.challenge;
  const next = nextGeoLab(labs, session.completed);
  const started = session.lastOpenedAt > 0;
  const continueTo = started ? continueGeoHref(session) : studio.continueRoute;
  const continueId = labs.find((item) => item.route === session.lastRoute)?.id ?? "triangles";
  const continueLabel = started ? session.lastLabel : "Triangles Explorer";
  const progress = labs.length ? Math.round((session.completed.filter((id) => labs.some((lab) => lab.id === id)).length / labs.length) * 100) : 0;
  const visible = labs.filter((item) => {
    const meta = GEO_LAB_META[item.id];
    if (track !== "all" && meta?.track !== track) return false;
    if (board !== "all" && meta?.board !== board) return false;
    return true;
  });
  const placeholders: Record<string, string> = {
    construction: "180",
    triangles: "180",
    circles: "90",
    polygons: "120",
    transformations: "−1",
    coordinate: "5",
    measurement: "24",
    proofs: "5",
    solids: "27",
    ar: "360",
  };

  const copy = GEO_HOME_LEARNING;
  const strip = [
    { icon: <Eye />, title: "Observe", text: copy.observe },
    { icon: <Lightbulb />, title: "Understand", text: copy.understand },
    { icon: <HelpCircle />, title: "Why", text: copy.why },
    { icon: <Pencil />, title: "Try", text: copy.try },
    { icon: <Trophy />, title: "Challenge", text: copy.challenge },
  ];

  const continueArtId = continueId;

  const pathIndex = useMemo(() => {
    const map = new Map(GEO_PATH.map((item, index) => [item.id, index + 1]));
    return map;
  }, []);

  return (
    <>
      <section className="msk-geo-hero" aria-label="Start here">
        <div>
          <p className="msk-geo-kicker">Recommended path</p>
          <h2>Start here: construct a perpendicular bisector in 60 seconds</h2>
          <p>Open Construction, keep A and B, and watch the orange locus and the dashed bisector stay linked to the parents.</p>
          <div className="msk-geo-hero-actions">
            <Link className="msk-cta" to="/geometry/construction">Construct a perpendicular bisector</Link>
            <Link className="msk-soft" to="/geometry/triangles">Start with Triangles</Link>
            <button type="button" className="msk-soft" onClick={() => writeGeoSession({ teacherMode: !session.teacherMode })}>
              {session.teacherMode ? "Exit teacher" : "Teacher mode"}
            </button>
            {session.teacherMode ? (
              <>
                <button type="button" className="msk-soft" onClick={() => writeGeoSession({ classPaused: !session.classPaused })}>
                  {session.classPaused ? "Resume class" : "Pause class"}
                </button>
                <button type="button" className="msk-soft" onClick={() => writeGeoSession({ lastRoute: "/geometry/construction", lastLabel: "Construction Workspace", lastOpenedAt: Date.now() })}>
                  Push Construction
                </button>
              </>
            ) : null}
          </div>
        </div>
        <div>
        <svg className="msk-graph" viewBox="0 0 280 88" role="img" aria-label="Perpendicular bisector of AB">
          <rect width="280" height="88" fill="#f8fbff" />
          <line x1="40" y1="64" x2="240" y2="64" stroke="#147df2" />
          <line x1="140" y1="12" x2="140" y2="80" stroke="#8b45f4" strokeDasharray="4 3" />
          <circle cx="40" cy="64" r="5" fill="#147df2" />
          <circle cx="240" cy="64" r="5" fill="#147df2" />
          <circle cx="140" cy="64" r="4" fill="#08b9dd" />
          <text x="36" y="20" fill="#334155" fontSize="11">A · O · B and ℓ ⊥ AB</text>
        </svg>
        <ol className="msk-geo-path" aria-label="Suggested sequence">
          {GEO_PATH.map((item, index) => (
            <li key={item.id}>
              <Link to={`/geometry/${item.id === "proofs" ? "proofs" : item.id}`}>
                <i>{index + 1}</i>
                <b>{item.label}</b>
              </Link>
              {index < GEO_PATH.length - 1 ? <span aria-hidden="true" /> : null}
            </li>
          ))}
        </ol>
        </div>
      </section>
      <div className="msk-concept-orbit msk-geo-orbit" aria-label="Filter labs by kind">
        <div className="msk-orbit-core"><span className="msk-mark">G</span><b>GEOMETRY</b></div>
        {TRACKS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={track === item.id ? "is-on" : ""}
            aria-pressed={track === item.id}
            onClick={() => setTrack(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="msk-home">
        <section>
          <header className="msk-launch-head">
            <h2>Explore by Topic</h2>
            <p>Choose a topic to explore with interactive visual models.</p>
            <div className="msk-geo-filters" role="group" aria-label="Board">
              {(["all", "NCERT", "Extra"] as const).map((item) => (
                <button key={item} type="button" className={board === item ? "active" : ""} aria-pressed={board === item} onClick={() => setBoard(item)}>
                  {item === "all" ? "All boards" : item}
                </button>
              ))}
            </div>
          </header>
          <div className="msk-launch msk-launch-geometry">
            {visible.map((item) => {
              const meta = GEO_LAB_META[item.id];
              const done = session.completed.includes(item.id);
              const pathNo = pathIndex.get(item.id);
              return (
                <Link key={item.id} className={`msk-card${done ? " is-done" : ""}${item.id === "ar" ? " is-ar" : ""}`} to={item.route}>
                  <span className="msk-num">{done ? "✓" : pathNo ?? "•"}</span>
                  <TopicIllustration pageId={item.id} />
                  <b>{item.label}</b>
                  <small>{meta?.outcome ?? item.description}</small>
                  {meta ? <em className="msk-meta">{meta.level} · {meta.minutes} min · {meta.grade}</em> : null}
                  {item.modes.length ? <span className="msk-card-modes">{item.modes.slice(0, 3).join(" · ")}</span> : null}
                  {meta?.leavesStudio ? <span className="msk-card-badge">Opens 2D/3D explorer</span> : null}
                  {meta?.camera ? <span className="msk-card-badge">Needs camera</span> : null}
                  <em>Open {item.label}</em>
                </Link>
              );
            })}
          </div>
        </section>
        <aside className="msk-aside">
          <section className="msk-panel msk-continue">
            <h2><Play /> {started ? "Continue experiment" : "Suggested first lab"}</h2>
            <div className="msk-continue-art"><TopicIllustration pageId={continueArtId} /></div>
            <p>
              <strong>{continueLabel}</strong>
              <span>{started ? relativeOpened(session.lastOpenedAt) : "Begin with Explorer, then Congruence."}</span>
            </p>
            <Link className="msk-cta" to={continueTo}>{started ? "Continue experiment" : "Start experiment"}</Link>
            {next && next.id !== continueId ? <p className="msk-note">Next: <Link to={next.route}>{next.label}</Link></p> : null}
          </section>
          <section className="msk-panel">
            <h2>Your learning journey</h2>
            <p className="msk-note">{`${session.completed.filter((id) => labs.some((lab) => lab.id === id)).length} of ${labs.length} labs started.`}</p>
            <ol className="msk-journey-list">
              {labs.map((item) => {
                const done = session.completed.includes(item.id);
                const now = item.id === next?.id && !done;
                return (
                  <li key={item.id}>
                    <i className={done ? "done" : now ? "now" : ""} />
                    <Link to={item.route}>{item.label}</Link>
                  </li>
                );
              })}
            </ol>
            <div className="msk-progress"><i style={{ width: `${progress}%` }} /></div>
            <small>Overall progress {progress}%</small>
          </section>
          {challenge && challenge.prompt !== "0" && challengePage ? (
            <section className="msk-panel msk-challenge">
              <h2>Daily visual challenge</h2>
              <div className="msk-continue-art"><TopicIllustration pageId={challengePage.id} /></div>
              <p>{challenge.prompt}</p>
              <input
                value={answer}
                placeholder={placeholders[challengePage.id] ?? "Number"}
                onChange={(event) => { setAnswer(event.target.value); setStatus(""); }}
                aria-label="Challenge answer"
              />
              <button className="msk-cta" type="button" onClick={() => {
                const correct = Math.abs(parseChallengeAnswer(answer) - challenge.expected) < 0.02;
                setStatus(correct ? `Warm-up complete — open ${challengePage.label} to see why.` : challenge.hint);
                if (correct) markGeoWarmup(challengePage.id);
              }}>Check</button>
              {status ? <p role="status">{status}</p> : null}
              <Link className="msk-teach" to={challengePage.route}>Open {challengePage.label}</Link>
            </section>
          ) : null}
        </aside>
      </div>
      <section className="msk-strip" aria-label="Learning loop for Geometry">
        {strip.map((item) => (
          <div key={item.title}>
            {item.icon}
            <b>{item.title}</b>
            <small>{item.text}</small>
          </div>
        ))}
      </section>
    </>
  );
}
