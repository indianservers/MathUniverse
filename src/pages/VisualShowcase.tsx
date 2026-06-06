import { ArrowRight, Box, BrainCircuit, ChartSpline, CircleDot, Cuboid, Network, Sigma, Sparkles, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";

type ShowcaseItem = {
  title: string;
  route: string;
  category: string;
  impact: "Hero" | "Cinematic" | "Interactive";
  description: string;
  cue: string;
  icon: typeof Waves;
};

const showcaseItems: ShowcaseItem[] = [
  { title: "3D Graphing Lab", route: "/math-lab/3d-graphing", category: "3D surfaces", impact: "Hero", description: "Interactive z = f(x,y) surfaces with cinematic lighting and dense controls.", cue: "Open sin(x) * cos(y), rotate slowly, then toggle wireframe.", icon: Cuboid },
  { title: "3D Surface Plotter", route: "/surface-plotter", category: "3D surfaces", impact: "Hero", description: "Fast standalone 3D mesh plotter for dramatic function landscapes.", cue: "Use exp(-(x^2+y^2)) for a clean peak reveal.", icon: Box },
  { title: "Euler Formula 3D Helix", route: "/complex-numbers", category: "Complex numbers", impact: "Hero", description: "A rotating complex number stretched into a 3D helix with sine and cosine shadows.", cue: "Open the Euler 3D tab and let the helix play.", icon: Sparkles },
  { title: "Fourier Animator", route: "/fourier-animator", category: "Signals", impact: "Hero", description: "Glowing epicycles build waves through harmonic motion.", cue: "Use square wave with 9 harmonics for the strongest demo loop.", icon: Waves },
  { title: "Matrix Transformations", route: "/math/matrix-transformations", category: "Linear algebra", impact: "Hero", description: "A matrix reshapes the whole plane, basis vectors, polygons, and selected vector.", cue: "Trigger Rotation 45 deg, Shear x, then Singular collapse.", icon: Sigma },
  { title: "Eigenvectors", route: "/math/eigenvectors", category: "Linear algebra", impact: "Hero", description: "Special directions stay aligned while the matrix transforms nearby vectors.", cue: "Use symmetric and diagonal presets for clean eigen-direction shots.", icon: ChartSpline },
  { title: "Complex Plane", route: "/complex-numbers", category: "Complex numbers", impact: "Cinematic", description: "Glowing polar grid with magnitude, angle, quadrant, and conjugate reflection.", cue: "Open Plane tab, move real and imaginary sliders across quadrants.", icon: CircleDot },
  { title: "Euler Identity", route: "/complex-numbers", category: "Complex numbers", impact: "Cinematic", description: "A stepwise reveal of e^(i*pi) + 1 = 0 on the complex unit circle.", cue: "Open Identity tab and press Play for the identity reveal.", icon: Sparkles },
  { title: "Parametric Curves", route: "/parametric-curves", category: "Curves", impact: "Cinematic", description: "Lissajous, heart, spiral, and figure-eight curves on a glowing graph stage.", cue: "Use Lissajous 3:2 or Spiral for motion-rich recordings.", icon: Waves },
  { title: "Polar Visualizer", route: "/polar-visualizer", category: "Curves", impact: "Cinematic", description: "Rose curves and spirals traced from r = f(theta).", cue: "Start with 2*sin(4*x), then increase theta sweep.", icon: Waves },
  { title: "Unit Circle", route: "/trigonometry", category: "Trigonometry", impact: "Interactive", description: "A premium dark unit circle stage with sine, cosine, tangent, and quadrant readouts.", cue: "Jump through 30, 45, 60, 90, and 180 degrees.", icon: CircleDot },
  { title: "Sine and Cosine Waves", route: "/trigonometry", category: "Trigonometry", impact: "Cinematic", description: "Glowing waveform graph linked to circular motion and live phase animation.", cue: "Press Play, then adjust amplitude and frequency.", icon: Waves },
  { title: "Derivative Tangent", route: "/math/derivatives", category: "Calculus", impact: "Cinematic", description: "A tangent beam and secant comparison show local rate of change.", cue: "Use sin(x), enable derivative graph, and move the tangent point.", icon: Sigma },
  { title: "Integration Area", route: "/math/integration", category: "Calculus", impact: "Cinematic", description: "Accumulated area, Riemann rectangles, and curves on a dark graph stage.", cue: "Animate partitions from low to high for an area-build shot.", icon: Sigma },
  { title: "Limits and Continuity", route: "/math/limits-continuity", category: "Calculus", impact: "Interactive", description: "Left and right approach points reveal continuity and discontinuity types.", cue: "Use removable discontinuity or 1/x for a clear concept reveal.", icon: ChartSpline },
  { title: "Graph Theory", route: "/graph-theory", category: "Discrete math", impact: "Interactive", description: "A spotlight graph editor with animated algorithms and coloring tools.", cue: "Step through BFS or Dijkstra with active edges highlighted.", icon: Network },
  { title: "Neural Network", route: "/ai-applications", category: "AI applications", impact: "Cinematic", description: "Pulsing activations flow through input, hidden, and output layers.", cue: "Open Neural Network and increase weight intensity.", icon: BrainCircuit },
  { title: "Gradient Descent", route: "/ai-applications", category: "AI applications", impact: "Cinematic", description: "An optimization point walks downhill on a glowing loss curve.", cue: "Press Auto Run and let the point converge.", icon: BrainCircuit },
];

const categories = Array.from(new Set(showcaseItems.map((item) => item.category)));

export default function VisualShowcase() {
  const heroCount = showcaseItems.filter((item) => item.impact === "Hero").length;
  return (
    <div className="space-y-3">
      <TopicHeader
        title="Visual Showcase"
        subtitle="A premium launchpad for the most cinematic, interactive Math Universe visualizations."
        difficulty="Product Showcase"
        estimatedMinutes={18}
      />

      <section className="overflow-hidden rounded-xl border border-cyan-200/20 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20">
        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-5">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">World-class math cinema</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-black tracking-tight sm:text-4xl">Open any flagship visual and record a polished product demo.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-cyan-50/75">
              This hub collects the upgraded scenes into one clean workflow for reels, lessons, ads, and product walkthroughs.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/math-lab/3d-graphing" className="action-primary">Open 3D Graphing</Link>
              <Link to="/fourier-animator" className="action-secondary">Open Fourier</Link>
              <Link to="/math/matrix-transformations" className="action-secondary">Open Matrix</Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ShowcaseStat label="Visuals" value={showcaseItems.length} />
            <ShowcaseStat label="Heroes" value={heroCount} />
            <ShowcaseStat label="Groups" value={categories.length} />
          </div>
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="cinematic-control-panel scroll-panel lg:sticky lg:top-24">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Showcase Groups</p>
          <nav className="mt-3 grid gap-1.5">
            {categories.map((category) => (
              <a key={category} href={`#${slug(category)}`} className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                {category}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-3">
          {categories.map((category) => (
            <SectionCard key={category} id={slug(category)} title={category} description={`${showcaseItems.filter((item) => item.category === category).length} showcase visuals`} compact>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {showcaseItems.filter((item) => item.category === category).map((item) => (
                  <ShowcaseCard key={item.title} item={item} />
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  const Icon = item.icon;
  return (
    <Link to={item.route} className="group block overflow-hidden rounded-xl border border-slate-200 bg-white/86 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-cyan-200 dark:bg-cyan-300 dark:text-slate-950">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-slate-950 dark:text-white">{item.title}</h3>
            <span className={item.impact === "Hero" ? "mini-chip bg-cyan-100 text-cyan-800 dark:bg-cyan-300/20 dark:text-cyan-100" : "mini-chip"}>
              {item.impact}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-slate-100 p-3 text-xs font-semibold leading-5 text-slate-600 dark:bg-slate-950/70 dark:text-slate-300">
        {item.cue}
      </div>
      <div className="mt-3 inline-flex items-center gap-2 text-sm font-black text-cyan-700 transition group-hover:gap-3 dark:text-cyan-200">
        Open visual <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

function ShowcaseStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-3 text-center">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-cyan-100/80">{label}</p>
    </div>
  );
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
