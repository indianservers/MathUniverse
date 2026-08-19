import { BookOpen, Bot, Box, Code2, Eye, FlaskConical, GraduationCap, Link2, Mic, Network, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";

const universeCards = [
  { title: "Algebra", text: "Master expressions, equations, and uncover visually.", className: "algebra" },
  { title: "Geometry", text: "Explore shapes, theorems, and spatial reasoning.", className: "geometry" },
  { title: "Trigonometry", text: "Understand angles, identities, and wave functions.", className: "trig" },
  { title: "Calculus", text: "Visualize change, limits, and area under curves.", className: "calculus" },
  { title: "Complex Numbers", text: "Visualize numbers in the complex plane.", className: "complex" },
  { title: "Linear Algebra", text: "Vectors, matrices, and transformations made clear.", className: "linear" },
  { title: "AI Applications", text: "See how math powers intelligent systems.", className: "ai" },
];

const buildSteps = [
  { title: "Visual Models", text: "Beautiful, interactive 3D and 2D visualizations bring math to life.", icon: Box },
  { title: "Interactive Engines", text: "High-performance engines power real-time interactions and simulations.", icon: Code2 },
  { title: "Guided Learning", text: "Curriculum-aligned paths adapt to your pace and learning style.", icon: GraduationCap },
  { title: "Practice & Mastery", text: "Practice, quizzes, and insights help you master with confidence.", icon: Trophy },
];

const technologies = ["React", "TypeScript", "Three.js", "Recharts", "KaTeX"];

export default function About() {
  const [xValue, setXValue] = useState(1.2);
  const p = graphPoint(xValue);
  const q = graphPoint(2.6);
  const tangentSlope = Math.cos(xValue);
  const secantSlope = (q.yMath - p.yMath) / (2.6 - xValue);
  const tangentPath = linePathThroughPoint(p, tangentSlope);
  const secantPath = linePathFromPoints(p, q);

  return (
    <div className="about-studio">
      <section className="about-universe" aria-labelledby="about-universe-title">
        <h1 id="about-universe-title">Learning universe</h1>
        <div className="about-universe-row">
          {universeCards.map((card) => (
            <article key={card.title} className={`about-universe-card ${card.className}`}>
              <strong>{card.title}</strong>
              <span>{card.text}</span>
              <CardSketch type={card.className} />
            </article>
          ))}
        </div>
      </section>

      <section className="about-visual-panel" aria-labelledby="about-why-title">
        <div className="about-why-copy">
          <h2 id="about-why-title">Why visual mathematics works</h2>
          <p>
            Our brains are wired to see patterns. By turning math into interactive experiences, Math Universe helps you understand deeply, remember longer, and apply with confidence.
          </p>
          <div className="about-reason-list">
            {[
              { title: "Build intuition", text: "See concepts come alive and grasp ideas faster.", icon: Eye },
              { title: "Experiment safely", text: "Try, test, and explore without fear of mistakes.", icon: FlaskConical },
              { title: "Connect ideas", text: "Visual links help you see how concepts relate.", icon: Link2 },
            ].map(({ title, text, icon: Icon }) => (
              <article key={title}>
                <span><Icon /></span>
                <div><strong>{title}</strong><small>{text}</small></div>
              </article>
            ))}
          </div>
        </div>

        <div className="about-tangent-card">
          <h3>Tangent & Secant</h3>
          <p>Move the point along the curve</p>
          <b>x = {xValue.toFixed(2)}</b>
          <input aria-label="Move tangent point" type="range" min="-2.4" max="2.4" step="0.05" value={xValue} onChange={(event) => setXValue(Number(event.target.value))} />
          <div className="about-legend"><i className="curve" /> f(x) = sin(x)</div>
          <div className="about-legend"><i className="tangent" /> Tangent at P</div>
          <div className="about-legend"><i className="secant" /> Secant PQ</div>
        </div>

        <div className="about-graph-wrap">
          <svg className="about-graph" viewBox="0 0 720 320" role="img" aria-label="Interactive tangent and secant graph">
            <defs>
              <pattern id="aboutGraphGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M32 0H0V32" fill="none" stroke="#dbeafe" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="720" height="320" fill="url(#aboutGraphGrid)" />
            <path d="M50 166H675" stroke="#94a3b8" strokeWidth="1.4" />
            <path d="M360 34V286" stroke="#94a3b8" strokeWidth="1.4" />
            <path d={sinePath()} fill="none" stroke="#0f7af8" strokeWidth="4" strokeLinecap="round" />
            <path d={tangentPath} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
            <path d={secantPath} fill="none" stroke="#15aabf" strokeWidth="3" strokeLinecap="round" />
            <path d={`M${p.x} ${p.y}V166`} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6 6" />
            <path d={`M${q.x} ${q.y}V166`} stroke="#15aabf" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx={p.x} cy={p.y} r="7" fill="#8b5cf6" stroke="#fff" strokeWidth="3" />
            <circle cx={q.x} cy={q.y} r="7" fill="#15aabf" stroke="#fff" strokeWidth="3" />
            <text x={p.x + 10} y={p.y - 10} fill="#5b21b6" fontSize="15" fontWeight="900">P</text>
            <text x={q.x + 10} y={q.y - 10} fill="#0f766e" fontSize="15" fontWeight="900">Q</text>
            {[-3, -2, -1, 1, 2, 3].map((tick) => <text key={tick} x={360 + tick * 72} y="186" textAnchor="middle" fill="#475569" fontSize="13" fontWeight="800">{tick}</text>)}
            {[-2, -1, 1, 2].map((tick) => <text key={tick} x="346" y={170 - tick * 58} textAnchor="end" fill="#475569" fontSize="13" fontWeight="800">{tick}</text>)}
            <text x="690" y="156" fill="#475569" fontSize="17" fontStyle="italic">x</text>
            <text x="354" y="24" fill="#475569" fontSize="17" fontStyle="italic">y</text>
          </svg>
          <div className="about-math-readout">
            <span>P ({xValue.toFixed(2)}, {p.yMath.toFixed(2)})</span>
            <span>Slope tangent: {tangentSlope.toFixed(2)}</span>
            <span>Q (2.60, {q.yMath.toFixed(2)})</span>
            <span>Slope secant: {secantSlope.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <section className="about-build-panel" aria-labelledby="about-built-title">
        <h2 id="about-built-title">How Math Universe is built</h2>
        <div className="about-build-flow">
          {buildSteps.map(({ title, text, icon: Icon }, index) => (
            <article key={title}>
              <span><Icon /></span>
              <div><strong>{title}</strong><small>{text}</small></div>
              {index < buildSteps.length - 1 ? <i aria-hidden="true" /> : null}
            </article>
          ))}
        </div>
        <div className="about-tech-row">
          <span>Built with modern web technologies</span>
          {technologies.map((item) => <b key={item}>{item}</b>)}
        </div>
      </section>

      <section className="about-next-panel" aria-labelledby="about-next-title">
        <h2 id="about-next-title">What's next</h2>
        <div className="about-next-grid">
          <article className="ai"><Bot /><div><strong>AI Tutor</strong><span>Get personalized help and hints at every step of your learning.</span><b>In development</b></div><Sparkles /></article>
          <article className="immersive"><Box /><div><strong>Immersive 3D</strong><span>Explore math in fully interactive 3D spaces and AR experiences.</span><b>In development</b></div><Network /></article>
          <article className="voice"><Mic /><div><strong>Voice Explanations</strong><span>Ask questions and get clear, spoken explanations.</span><b>In development</b></div><VoiceWave /></article>
        </div>
      </section>

      <footer className="about-footer">
        <div><Sparkles /><span><strong>Math Universe</strong><small>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</small></span></div>
        <nav aria-label="About footer">
          <a href="/sitemap">Sitemap<span>Browse all pages and resources</span></a>
          <a href="/docs">Documentation<span>Guides, API, and help center</span></a>
          <a href="/about">About<span>Our mission, team, and vision</span></a>
        </nav>
        <p>© 2026 Indian Servers Private Limited<br />All rights reserved.</p>
      </footer>
    </div>
  );
}

function graphPoint(xMath: number) {
  const yMath = Math.sin(xMath);
  return {
    x: 360 + xMath * 72,
    y: 166 - yMath * 58,
    xMath,
    yMath,
  };
}

function sinePath() {
  return Array.from({ length: 120 }, (_, index) => {
    const xMath = -3.6 + (index / 119) * 7.2;
    const point = graphPoint(xMath);
    return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }).join(" ");
}

function linePathThroughPoint(point: ReturnType<typeof graphPoint>, slope: number) {
  const x1Math = point.xMath - 1.3;
  const x2Math = point.xMath + 1.3;
  const y1Math = point.yMath - slope * (point.xMath - x1Math);
  const y2Math = point.yMath + slope * (x2Math - point.xMath);
  const p1 = { x: 360 + x1Math * 72, y: 166 - y1Math * 58 };
  const p2 = { x: 360 + x2Math * 72, y: 166 - y2Math * 58 };
  return `M${p1.x.toFixed(1)} ${p1.y.toFixed(1)}L${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
}

function linePathFromPoints(a: ReturnType<typeof graphPoint>, b: ReturnType<typeof graphPoint>) {
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

function CardSketch({ type }: { type: string }) {
  if (type === "geometry") return <svg viewBox="0 0 160 90"><path d="M44 65V25L92 10L132 30V70L84 84Z" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M44 25L84 42L132 30M84 42V84M92 10L92 50" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".7" /></svg>;
  if (type === "trig") return <svg viewBox="0 0 160 90"><circle cx="72" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M24 50H128M72 14V82M72 50L112 23" stroke="currentColor" strokeWidth="2" /><path d="M91 37A24 24 0 0 1 96 50" fill="none" stroke="currentColor" strokeWidth="1.5" /><text x="104" y="45" fill="currentColor" fontSize="13">sin θ</text></svg>;
  if (type === "calculus") return <svg viewBox="0 0 160 90"><path d="M22 74H138M32 18V78" stroke="currentColor" strokeWidth="1.5" /><path d="M36 58C58 5 81 72 112 25" fill="rgba(255,255,255,.2)" stroke="currentColor" strokeWidth="2.5" /><path d="M55 72V35M112 72V25" stroke="currentColor" strokeWidth="1" opacity=".75" /><text x="112" y="24" fill="currentColor" fontSize="13">f(x)</text></svg>;
  if (type === "complex") return <svg viewBox="0 0 160 90"><path d="M24 64H136M42 18V78" stroke="currentColor" strokeWidth="1.5" /><path d="M42 64L116 24" stroke="currentColor" strokeWidth="2.5" /><text x="118" y="24" fill="currentColor" fontSize="11">z=a+bi</text><text x="22" y="19" fill="currentColor" fontSize="11">Im</text><text x="128" y="76" fill="currentColor" fontSize="11">Re</text></svg>;
  if (type === "linear") return <svg viewBox="0 0 160 90"><path d="M35 66L128 58L112 28L45 35Z" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M48 35L38 66M63 33L53 65M80 31L70 63M97 30L87 62M114 28L104 60M34 51L121 45" stroke="currentColor" strokeWidth="1" opacity=".65" /><text x="112" y="74" fill="currentColor" fontSize="13">[a b]</text></svg>;
  if (type === "ai") return <svg viewBox="0 0 160 90"><g fill="currentColor">{[[35,55],[58,35],[80,58],[100,28],[122,55],[67,66],[112,72]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />)}</g><path d="M35 55L58 35L80 58L100 28L122 55M58 35L112 72M67 66L122 55M35 55L67 66" stroke="currentColor" strokeWidth="1.5" fill="none" opacity=".75" /></svg>;
  return <svg viewBox="0 0 160 90"><path d="M20 68H138M64 16V75" stroke="currentColor" strokeWidth="1.5" /><path d="M35 30C52 82 93 82 112 22" fill="none" stroke="currentColor" strokeWidth="2.5" /><rect x="22" y="48" width="52" height="22" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" /><text x="28" y="63" fill="currentColor" fontSize="12">ax²+b</text></svg>;
}

function VoiceWave() {
  return <svg viewBox="0 0 120 46" aria-hidden="true"><path d="M6 24H20M26 24V18M34 24V12M42 24V6M50 24V14M58 24V20M66 24V12M74 24V8M82 24V18M90 24V12M98 24V20M104 24H116" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" /></svg>;
}
