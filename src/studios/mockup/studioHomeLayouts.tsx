import { useState, type PointerEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Play, Search } from "lucide-react";
import { TopicIllustration } from "./labs/TopicIllustrations";
import type { StudioMockupDefinition, StudioMockupPage } from "./studioMockupCatalog";
import { parseChallengeAnswer } from "./studioLabKit";
import { studioLabMeta } from "./studioLabMeta";
import { useTrigSession, writeTrigSession } from "./trigStudioSession";
import { listSnapshots } from "../phase1/studioClassroom";

type HomeProps = {
  studio: StudioMockupDefinition;
  labs: StudioMockupPage[];
  continueTo: string;
  continueLabel: string;
  progress: number;
  challenge?: StudioMockupPage;
};

function Aside({
  continueTo,
  continueLabel,
  continueId,
  labs,
  progress,
  challenge,
  searchPlaceholder,
}: HomeProps & { continueId?: string; searchPlaceholder?: string }) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const hits = labs.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <aside className="msk-aside">
      <section className="msk-panel msk-continue">
          <h2><Play /> Continue</h2>
        <div className="msk-continue-art"><TopicIllustration pageId={continueId ?? labs[0]?.id ?? "home"} /></div>
        <p><strong>{continueLabel}</strong></p>
        <Link className="msk-cta" to={continueTo}>Continue →</Link>
      </section>
      {searchPlaceholder ? (
        <section className="msk-panel">
          <h2><Search /> Search</h2>
          <input className="msk-home-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} aria-label="Search labs" />
          {query ? (
            <ul className="msk-search-hits is-inline">
              {hits.slice(0, 5).map((item) => <li key={item.id}><Link to={item.route}>{item.label}</Link></li>)}
            </ul>
          ) : null}
        </section>
      ) : null}
      <section className="msk-panel">
        <h2>Your learning journey</h2>
        <ol className="msk-journey-list">
          {labs.slice(0, 6).map((item, index) => (
            <li key={item.id}>
              <i className={index === 0 ? "done" : index === 1 ? "now" : ""} />
              <Link to={item.route}>{item.label}</Link>
            </li>
          ))}
        </ol>
        <div className="msk-progress"><i style={{ width: `${progress || 42}%` }} /></div>
        <small>Overall progress {progress || 42}%</small>
      </section>
      {challenge ? (
        <section className="msk-panel msk-challenge">
          <h2>Daily visual challenge</h2>
          <div className="msk-continue-art"><TopicIllustration pageId={challenge.id} /></div>
          <p>{challenge.challenge.prompt}</p>
          <input value={answer} placeholder={searchPlaceholder?.includes("constructions") ? undefined : "1 or √2/2"} onChange={(event) => { setAnswer(event.target.value); setStatus(""); }} aria-label="Challenge answer" />
          <button className="msk-cta" type="button" onClick={() => setStatus(Math.abs(parseChallengeAnswer(answer) - challenge.challenge.expected) < 0.02 ? "Correct." : challenge.challenge.hint)}>Check</button>
          {status ? <p role="status">{status}</p> : null}
          <Link className="msk-teach" to={challenge.route}>Open {challenge.label}</Link>
        </section>
      ) : null}
    </aside>
  );
}

export function StudioLabCard({
  item,
  index,
  studioId,
  art,
  cta,
  numbered = false,
}: {
  item: StudioMockupPage;
  index: number;
  studioId: string;
  art?: ReactNode;
  cta?: string;
  numbered?: boolean;
}) {
  const meta = studioLabMeta(studioId, item.id);
  return (
    <Link
      className={`msk-card msk-card-premium${studioId === "modelling" ? " msk-model-card" : ""}${studioId === "trigonometry" ? " msk-trig-topic-card" : ""}`}
      to={item.route}
      data-lab-id={studioId === "trigonometry" ? item.id : undefined}
      data-card-index={studioId === "trigonometry" ? index + 1 : undefined}
    >
      <span className="msk-num">{numbered ? String(index + 1).padStart(2, "0") : index + 1}</span>
      {art ?? <TopicIllustration pageId={item.id} />}
      <b>{item.label}</b>
      <small>{meta?.outcome ?? item.description}</small>
      {meta ? <em className="msk-meta">{`${meta.level} · ${meta.minutes} min`}</em> : null}
      {item.modes.length ? <span className="msk-card-modes">{item.modes.slice(0, 3).join(" · ")}</span> : null}
      <em>{cta ?? `Open ${item.label}`}</em>
    </Link>
  );
}

function LiveStudioHero({ studioId }: { studioId: string }) {
  if (studioId === "trigonometry") return <TrigHomeHero />;
  if (studioId === "linear-algebra") {
    return (
      <svg className="msk-graph" viewBox="0 0 360 88" role="img" aria-label="Shear of the unit square">
        <rect width="360" height="88" fill="#f8fbff" />
        <polygon points="40,72 100,72 124,28 64,28" fill="rgba(20,125,242,.16)" stroke="#147df2" />
        <text x="140" y="50" fill="#334155" fontSize="12">Unit square under a shear — open Vectors or Transforms</text>
      </svg>
    );
  }
  if (studioId === "complex-numbers") {
    return (
      <svg className="msk-graph" viewBox="0 0 360 88" role="img" aria-label="Argand point z">
        <rect width="360" height="88" fill="#f8fbff" />
        <line x1="24" y1="44" x2="200" y2="44" stroke="#cbd5e1" />
        <line x1="110" y1="12" x2="110" y2="76" stroke="#cbd5e1" />
        <circle cx="150" cy="28" r="6" fill="#8b45f4" />
        <text x="214" y="50" fill="#334155" fontSize="12">Drag z on Argand Plane</text>
      </svg>
    );
  }
  if (studioId === "discrete") {
    return (
      <svg className="msk-graph" viewBox="0 0 360 88" role="img" aria-label="Clock, sieve, graph">
        <rect width="360" height="88" fill="#f8fbff" />
        <circle cx="48" cy="44" r="24" fill="none" stroke="#147df2" />
        <line x1="48" y1="44" x2="48" y2="24" stroke="#147df2" />
        <rect x="100" y="20" width="12" height="48" fill="#8b45f4" />
        <rect x="118" y="32" width="12" height="36" fill="#08b9dd" />
        <circle cx="200" cy="32" r="8" fill="#f59e0b" />
        <circle cx="240" cy="56" r="8" fill="#10b981" />
        <line x1="200" y1="32" x2="240" y2="56" stroke="#334155" />
        <text x="260" y="50" fill="#334155" fontSize="12">Clock · sieve · graph</text>
      </svg>
    );
  }
  return null;
}

function TrigHomeHero() {
  const session = useTrigSession();
  const rad = session.theta * Math.PI / 180;
  const cx = 70;
  const cy = 44;
  const r = 32;
  const px = cx + Math.cos(rad) * r;
  const py = cy - Math.sin(rad) * r;
  const onPointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width * 360;
    const y = (event.clientY - box.top) / box.height * 88;
    const deg = Math.atan2(cy - y, x - cx) * 180 / Math.PI;
    writeTrigSession({ theta: Math.round(deg) });
  };
  return (
    <div className="msk-trig-hero">
      <svg className="msk-graph is-interactive" viewBox="0 0 360 88" role="img" aria-label="Drag theta on the unit circle" onPointerDown={onPointer} onPointerMove={(event) => { if (event.buttons) onPointer(event); }}>
        <rect width="360" height="88" fill="#061428" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22d3ee" />
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="#fbbf24" />
        <circle cx={px} cy={py} r="5" fill="#fbbf24" />
        <text x="120" y="38" fill="#fde68a" fontSize="12">sin {session.theta}° = {Math.sin(rad).toFixed(2)}</text>
        <text x="120" y="58" fill="#67e8f9" fontSize="12">cos {session.theta}° = {Math.cos(rad).toFixed(2)}</text>
        <text x="120" y="78" fill="#94a3b8" fontSize="11">Drag the ray · open Unit Circle</text>
      </svg>
      <Link className="msk-cta" to="/trigonometry/unit-circle?mode=Unit+Circle">Open unit circle</Link>
    </div>
  );
}

const TRIG_HOME_FLOW = [
  { id: "angles", label: "Angles", route: "/trigonometry/unit-circle", pageId: "unit-circle", row: "primary" },
  { id: "unit-circle", label: "Unit Circle", route: "/trigonometry/unit-circle?mode=Unit+Circle", pageId: "unit-circle", row: "primary" },
  { id: "functions", label: "Functions", route: "/trigonometry/graphs", pageId: "graphs", row: "primary" },
  { id: "waves", label: "Waves", route: "/trigonometry/waves", pageId: "waves", row: "primary" },
  { id: "triangles", label: "Triangles", route: "/trigonometry/right-triangle", pageId: "right-triangle", row: "branch" },
  { id: "identities", label: "Identities", route: "/trigonometry/identities", pageId: "identities", row: "branch" },
  { id: "applications", label: "Applications", route: "/trigonometry/applications", pageId: "applications", row: "branch" },
] as const;

function TrigFlowUnitCircle() {
  const session = useTrigSession();
  const rad = session.theta * Math.PI / 180;
  const cx = 110;
  const cy = 46;
  const radius = 28;
  const px = cx + Math.cos(rad) * radius;
  const py = cy - Math.sin(rad) * radius;
  const updateTheta = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width * 220;
    const y = (event.clientY - box.top) / box.height * 92;
    writeTrigSession({ theta: Math.round(Math.atan2(cy - y, x - cx) * 180 / Math.PI) });
  };

  return (
    <article className="msk-trig-flow-node msk-trig-flow-unit-circle" data-flow-node="unit-circle" data-flow-row="primary">
      <Link to="/trigonometry/unit-circle?mode=Unit+Circle" aria-label="Open unit circle"><b>Unit Circle</b></Link>
      <svg
        className="msk-art is-interactive"
        viewBox="0 0 220 92"
        role="img"
        aria-label={`Unit circle at ${session.theta} degrees. Drag the ray to change the angle.`}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          updateTheta(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) updateTheta(event);
        }}
      >
        <rect width="220" height="92" rx="12" fill="#f8fbff" />
        <line x1="75" y1={cy} x2="145" y2={cy} stroke="#94a3b8" />
        <line x1={cx} y1="12" x2={cx} y2="80" stroke="#94a3b8" />
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#147df2" strokeWidth="2" />
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="#f59e0b" strokeWidth="2" />
        <circle cx={px} cy={py} r="4" fill="#f59e0b" />
      </svg>
    </article>
  );
}

function TrigHomeFlowMap() {
  const primary = TRIG_HOME_FLOW.filter((item) => item.row === "primary");
  const branches = TRIG_HOME_FLOW.filter((item) => item.row === "branch");
  return (
    <nav className="msk-trig-flow msk-trig-flow-map" aria-label="Trigonometry concept flow" data-flow-map="trigonometry">
      <div className="msk-trig-flow-row msk-trig-flow-primary" data-flow-row="primary">
        {primary.map((item, index) => (
          <div className="msk-trig-flow-step" key={item.id}>
            {item.id === "unit-circle" ? <TrigFlowUnitCircle /> : (
              <Link className="msk-trig-flow-node" to={item.route} data-flow-node={item.id} data-flow-row={item.row}>
                <b>{item.label}</b>
                <TopicIllustration pageId={item.pageId} />
              </Link>
            )}
            {index < primary.length - 1 ? <i className="msk-trig-flow-arrow" aria-hidden="true">→</i> : null}
          </div>
        ))}
      </div>
      <div className="msk-trig-flow-connectors" aria-hidden="true">
        {branches.map((item) => <i key={item.id} data-connects-to={item.id}>↓</i>)}
      </div>
      <div className="msk-trig-flow-row msk-trig-flow-branches" data-flow-row="branch">
        {branches.map((item) => (
          <Link className="msk-trig-flow-node" key={item.id} to={item.route} data-flow-node={item.id} data-flow-row={item.row}>
            <b>{item.label}</b>
            <TopicIllustration pageId={item.pageId} />
          </Link>
        ))}
      </div>
    </nav>
  );
}

function TrigonometryHomeAside(props: HomeProps) {
  const session = useTrigSession();
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const challenge = props.challenge;
  const continueLab = props.labs.find((item) => props.continueTo.startsWith(item.route)) ?? props.labs[0];
  const journey = [
    { id: "getting-started", label: "Getting Started", complete: true },
    { id: "unit-circle", label: "Angles & Unit Circle", complete: session.completed.includes("unit-circle") },
    { id: "graphs", label: "Trig Functions", complete: session.completed.includes("graphs") },
    { id: "identities", label: "Identities", complete: session.completed.includes("identities") },
    { id: "applications", label: "Applications", complete: session.completed.includes("applications") },
  ];
  const activeIndex = journey.findIndex((item) => !item.complete);

  return (
    <aside className="msk-aside msk-trig-home-rail" data-home-rail="trigonometry">
      <section className="msk-panel msk-continue msk-trig-continue" data-rail-card="continue">
        <h2><Play /> Continue Experiment</h2>
        <div className="msk-continue-art"><TopicIllustration pageId={continueLab?.id ?? "unit-circle"} /></div>
        <p><strong>{props.continueLabel}</strong><span>Angle: {session.theta}°</span></p>
        <div className="msk-progress" aria-label={`${props.progress}% completed`}><i style={{ width: `${props.progress}%` }} /></div>
        <small>{props.progress}% completed</small>
        <Link className="msk-cta" to={props.continueTo}>Continue Experiment →</Link>
      </section>
      <section className="msk-panel msk-trig-journey" data-rail-card="journey">
        <h2>Your Learning Journey</h2>
        <ol className="msk-journey-list">
          {journey.map((item, index) => {
            const state = item.complete ? "completed" : index === activeIndex ? "in-progress" : "locked";
            const route = props.labs.find((lab) => lab.id === item.id)?.route;
            return (
              <li key={item.id} data-journey-step={item.id} data-journey-status={state}>
                <i className={item.complete ? "done" : index === activeIndex ? "now" : ""} />
                {route ? <Link to={route}>{item.label}<small>{state.replace("-", " ")}</small></Link> : <span>{item.label}<small>{state.replace("-", " ")}</small></span>}
              </li>
            );
          })}
        </ol>
        <div className="msk-progress"><i style={{ width: `${props.progress}%` }} /></div>
        <small>Overall Progress {props.progress}%</small>
      </section>
      {challenge ? (
        <section className="msk-panel msk-challenge msk-trig-challenge" aria-label="Daily visual challenge" data-rail-card="challenge" data-challenge-id={challenge.id}>
          <h2>Daily Visual Challenge</h2>
          <div className="msk-continue-art"><TopicIllustration pageId={challenge.id} /></div>
          <p>{challenge.challenge.prompt}</p>
          <input value={answer} placeholder="1 or √2/2" onChange={(event) => { setAnswer(event.target.value); setStatus(""); }} aria-label="Challenge answer" />
          <button className="msk-cta" type="button" onClick={() => setStatus(Math.abs(parseChallengeAnswer(answer) - challenge.challenge.expected) < 0.02 ? "Correct." : challenge.challenge.hint)}>Try Challenge →</button>
          {status ? <p role="status">{status}</p> : null}
        </section>
      ) : null}
    </aside>
  );
}

function TrigonometryStudioHome(props: HomeProps & { title: string; cta?: string }) {
  return (
    <div className="msk-home msk-trig-home" data-studio-home="trigonometry" data-home-layout="target-01">
      <section className="msk-trig-home-main">
        <TrigHomeFlowMap />
        <header className="msk-launch-head msk-trig-topics-head">
          <h2>{props.title}</h2>
          <Link to="/trigonometry/unit-circle" data-topics-link="all">View all topics →</Link>
        </header>
        <div data-lab-grid="trigonometry">
          <LaunchGrid labs={props.labs} studioId={props.studio.id} cta={props.cta} />
        </div>
      </section>
      <TrigonometryHomeAside {...props} />
    </div>
  );
}

function LaunchGrid({ labs, studioId, cta }: { labs: StudioMockupPage[]; studioId: string; cta?: string }) {
  return (
    <div className={`msk-launch msk-launch-${studioId} msk-launch-premium`}>
      {labs.map((item, index) => (
        <StudioLabCard key={item.id} item={item} index={index} studioId={studioId} cta={cta} />
      ))}
    </div>
  );
}

export function GeometryStudioHome(props: HomeProps) {
  const { studio, labs } = props;
  const [left, right] = [labs.slice(0, 4), labs.slice(4)];
  return (
    <div className="msk-home msk-geo-home">
      <section>
        <header className="msk-launch-head">
          <h2>Explore by Topic</h2>
          <p>Construct, measure, transform, and prove with interactive figures.</p>
        </header>
        <div className="msk-geo-map" aria-label="Geometry concept map">
          <div className="msk-geo-col">
            {left.map((item, index) => (
              <Link key={item.id} to={item.route} className="msk-geo-node">
                <span>{index + 1}</span>
                <TopicIllustration pageId={item.id} />
                <b>{item.label}</b>
                <small>{item.description}</small>
              </Link>
            ))}
          </div>
          <div className="msk-orbit-core msk-geo-core"><span className="msk-mark">{studio.mark}</span><b>GEOMETRY</b></div>
          <div className="msk-geo-col">
            {right.map((item, index) => (
              <Link key={item.id} to={item.route} className="msk-geo-node">
                <span>{index + 5}</span>
                <TopicIllustration pageId={item.id} />
                <b>{item.label}</b>
                <small>{item.description}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Aside {...props} continueId={labs[1]?.id} searchPlaceholder="Search constructions, theorems, or shapes..." />
    </div>
  );
}

export function IllustratedStudioHome(props: HomeProps & { title: string; cta?: string }) {
  if (props.studio.id === "trigonometry") return <TrigonometryStudioHome {...props} />;

  const flow = props.studio.id === "trigonometry"
    ? [
        { label: "Angles", to: "/trigonometry/unit-circle" },
        { label: "Triangles", to: "/trigonometry/right-triangle" },
        { label: "Graphs", to: "/trigonometry/graphs" },
        { label: "Identities", to: "/trigonometry/identities" },
        { label: "Applications", to: "/trigonometry/applications" },
      ]
    : props.studio.id === "linear-algebra"
      ? [
          { label: "Vectors", to: "/linear-algebra/vectors" },
          { label: "Matrices", to: "/linear-algebra/matrices" },
          { label: "Transforms", to: "/linear-algebra/linear-transforms" },
          { label: "Eigen", to: "/linear-algebra/eigenvectors" },
          { label: "Least squares", to: "/linear-algebra/least-squares" },
        ]
      : props.studio.id === "complex-numbers"
        ? [
            { label: "Argand", to: "/complex-numbers/argand-plane" },
            { label: "Arithmetic", to: "/complex-numbers/arithmetic" },
            { label: "Polar", to: "/complex-numbers/polar-forms" },
            { label: "Roots", to: "/complex-numbers/roots" },
            { label: "Euler", to: "/complex-numbers/euler" },
          ]
        : props.studio.id === "discrete"
          ? [
              { label: "Number sense", to: "/discrete-world/number-sense" },
              { label: "Primes", to: "/discrete-world/primes" },
              { label: "Modular", to: "/discrete-world/modular-arithmetic" },
              { label: "Combinatorics", to: "/discrete-world/combinatorics" },
              { label: "Logic", to: "/discrete-world/logic" },
            ]
          : null;
  return (
    <div className="msk-home">
      <section>
        <header className="msk-launch-head">
          <h2>{props.title}</h2>
          <p>Choose a topic. Each card opens that lab.</p>
        </header>
        {flow ? (
          <ol className="msk-trig-flow" aria-label="Studio journey">
            {flow.map((step, index) => (
              <li key={step.to}>
                <Link to={step.to}>
                  <span>{index + 1}</span>
                  <b>{step.label}</b>
                </Link>
                {index < flow.length - 1 ? <i aria-hidden="true">→</i> : null}
              </li>
            ))}
          </ol>
        ) : null}
        <LiveStudioHero studioId={props.studio.id} />
        {props.studio.id === "discrete" ? <SnapshotGallery /> : null}
        <LaunchGrid labs={props.labs} studioId={props.studio.id} cta={props.cta} />
      </section>
      <Aside {...props} continueId={props.labs[0]?.id} searchPlaceholder={props.studio.searchPlaceholder} />
    </div>
  );
}

function SnapshotGallery() {
  const snaps = listSnapshots();
  if (!snaps.length) {
    return (
      <section className="msk-snapshots" aria-label="Figure snapshots">
        <h2>Opt-in figure snapshots</h2>
        <p>Start an activity in a lab to pin a shareable figure here.</p>
      </section>
    );
  }
  return (
    <section className="msk-snapshots" aria-label="Figure snapshots">
      <h2>Recent figures</h2>
      <ul>
        {snaps.map((item) => (
          <li key={item.href}><Link to={item.href}>{item.label}</Link></li>
        ))}
      </ul>
    </section>
  );
}
