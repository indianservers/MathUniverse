import { Link } from "react-router-dom";
import { VennCountTeaser } from "./StudioLandingTeasers";
import { ObserveStrip } from "./StudioLandingExtras";
import { markLandingVisit, useLandingSession } from "./studioLandingSession";
import "./studioLanding.css";

export default function SetTheoryLanding() {
  const session = useLandingSession("set-theory");
  return (
    <section className="st-landing" aria-label="Set Theory landing">
      <ObserveStrip items={[
        { title: "Observe", text: "Region counts on a Venn diagram." },
        { title: "Understand", text: "Complement vs difference." },
        { title: "Why", text: "Functions pair each input once." },
        { title: "Try", text: "Toggle injection and surjection." },
        { title: "Challenge", text: "Power set size is 2ⁿ." },
      ]} />
      <div className="st-landing-grid">
        <VennCountTeaser />
        <div className="sl-teaser">
          <p className="sl-kicker">Universe slider lives on Set Builder.</p>
          <div className="sl-chips">
            <Link className="sl-mini-link" to="/set-theory/venn-diagram-engine?op=complement" onClick={() => markLandingVisit("set-theory", "venn", "/set-theory/venn-diagram-engine", "Venn")}>Complement</Link>
            <Link className="sl-mini-link" to="/set-theory/venn-diagram-engine?op=difference">Difference</Link>
            <Link className="sl-mini-link" to="/set-theory/functions">Injection / surjection</Link>
            <Link className="sl-mini-link" to="/set-theory/relations">Relation lights</Link>
          </div>
          <p>Last opened {session.lastLabel}. Sets in Discrete hide home tiles — this studio is the dedicated surface.</p>
          <Link to="/discrete-world">Back to Discrete</Link>
          <Link to="/lessons">Pinned lessons</Link>
        </div>
      </div>
    </section>
  );
}
