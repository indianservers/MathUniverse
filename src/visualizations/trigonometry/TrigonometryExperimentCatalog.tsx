import { Compass, FlaskConical, RadioTower, Ruler, Sigma, Waves } from "lucide-react";
import { useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import TrigonometryMathLab from "./TrigonometryMathLab";

type Experiment = {
  title: string;
  prompt: string;
  variables: string[];
};

type Subcategory = {
  title: string;
  experiments: Experiment[];
};

type Category = {
  title: string;
  description: string;
  icon: typeof Compass;
  subcategories: Subcategory[];
};

const categories: Category[] = [
  {
    title: "Foundations",
    description: "Angle measures, unit-circle coordinates, ratios, and identities.",
    icon: Compass,
    subcategories: [
      {
        title: "Angles and Measures",
        experiments: [
          { title: "Degree-Radian Converter Lab", prompt: "Rotate an angle and compare degree, radian, and turn notation.", variables: ["angle", "unit"] },
          { title: "Coterminal Angle Finder", prompt: "Add or subtract full turns to discover angles with the same terminal side.", variables: ["base angle", "turns"] },
          { title: "Reference Angle Explorer", prompt: "Move an angle across quadrants and identify the acute reference angle.", variables: ["quadrant", "theta"] },
          { title: "Arc Length Slider", prompt: "Change radius and angle to see why arc length equals r theta.", variables: ["radius", "theta"] },
          { title: "Sector Area Builder", prompt: "Compare partial-circle area against the full-circle area formula.", variables: ["radius", "theta"] },
        ],
      },
      {
        title: "Unit Circle Coordinates",
        experiments: [
          { title: "Sine as Height", prompt: "Track the y-coordinate of a point moving around the unit circle.", variables: ["theta", "y"] },
          { title: "Cosine as Shadow", prompt: "Project the rotating radius onto the x-axis to read cosine.", variables: ["theta", "x"] },
          { title: "Tangent Line Measure", prompt: "Extend a tangent line and connect its height to sin theta / cos theta.", variables: ["theta", "slope"] },
          { title: "Quadrant Sign Map", prompt: "Color-code signs of sine, cosine, tangent, secant, cosecant, and cotangent.", variables: ["quadrant", "function"] },
          { title: "Special Angle Table", prompt: "Build 0, 30, 45, 60, and 90 degree values from triangle geometry.", variables: ["angle", "ratio"] },
        ],
      },
      {
        title: "Identities",
        experiments: [
          { title: "Pythagorean Identity Balance", prompt: "Watch sin squared theta plus cos squared theta remain fixed at 1.", variables: ["theta", "sum"] },
          { title: "Reciprocal Identity Mirror", prompt: "Compare sin/csc, cos/sec, and tan/cot as inverse pairs.", variables: ["function", "theta"] },
          { title: "Even-Odd Identity Test", prompt: "Flip angles across zero and observe which function changes sign.", variables: ["theta", "function"] },
          { title: "Complementary Angle Swap", prompt: "Pair theta with 90 degrees minus theta to see sine and cosine trade roles.", variables: ["theta", "complement"] },
          { title: "Identity Verification Tiles", prompt: "Drag equivalent expressions into matching identity families.", variables: ["expression", "family"] },
        ],
      },
    ],
  },
  {
    title: "Graphs and Transformations",
    description: "How parameters reshape sinusoidal and reciprocal-function graphs.",
    icon: Waves,
    subcategories: [
      {
        title: "Sine and Cosine Waves",
        experiments: [
          { title: "Amplitude Stretch Lab", prompt: "Increase amplitude and compare crest height against the baseline wave.", variables: ["amplitude", "crest"] },
          { title: "Period Compression Lab", prompt: "Adjust frequency and count how many cycles fit in the same interval.", variables: ["frequency", "period"] },
          { title: "Phase Shift Conveyor", prompt: "Slide a wave left and right while tracking a marked peak.", variables: ["phase", "peak"] },
          { title: "Vertical Shift Tide Gauge", prompt: "Raise and lower the midline to model water height over time.", variables: ["midline", "height"] },
          { title: "Sine-Cosine Overlay", prompt: "Overlay sine and cosine to show the quarter-period phase difference.", variables: ["phase", "function"] },
        ],
      },
      {
        title: "Tangent and Reciprocal Graphs",
        experiments: [
          { title: "Tangent Asymptote Tracker", prompt: "Move through angles where cosine approaches zero and tangent grows fast.", variables: ["theta", "asymptote"] },
          { title: "Secant Envelope", prompt: "Compare secant branches with the cosine curve that bounds them.", variables: ["theta", "secant"] },
          { title: "Cosecant Envelope", prompt: "Compare cosecant branches with the sine curve that bounds them.", variables: ["theta", "cosecant"] },
          { title: "Cotangent Interval Scan", prompt: "Inspect cotangent's repeating branches and vertical breaks.", variables: ["theta", "cotangent"] },
          { title: "Domain Restriction Switchboard", prompt: "Toggle visible domains to understand where inverse functions can exist.", variables: ["domain", "range"] },
        ],
      },
      {
        title: "Inverse Trigonometry",
        experiments: [
          { title: "Arcsine Range Gate", prompt: "Feed values from -1 to 1 and locate the principal arcsine angle.", variables: ["input", "angle"] },
          { title: "Arccosine Range Gate", prompt: "Map x-values onto the 0 to pi principal range.", variables: ["input", "angle"] },
          { title: "Arctangent Full Sweep", prompt: "Send slopes into arctangent and watch the output approach its limits.", variables: ["slope", "angle"] },
          { title: "Inverse Composition Check", prompt: "Compare sin(arcsin x) with arcsin(sin theta) under restrictions.", variables: ["input", "restriction"] },
          { title: "Calculator Mode Challenge", prompt: "Predict inverse trig outputs in degrees and radians before toggling modes.", variables: ["mode", "input"] },
        ],
      },
    ],
  },
  {
    title: "Triangle Solving",
    description: "Right triangles, oblique triangles, bearings, and heights.",
    icon: Ruler,
    subcategories: [
      {
        title: "Right Triangle Models",
        experiments: [
          { title: "SOH-CAH-TOA Ratio Builder", prompt: "Resize a right triangle and watch ratios remain stable for the same angle.", variables: ["angle", "side ratio"] },
          { title: "Missing Side Solver", prompt: "Choose a known side and angle, then solve the other sides visually.", variables: ["known side", "angle"] },
          { title: "Missing Angle Solver", prompt: "Use inverse ratios to recover an unknown acute angle.", variables: ["ratio", "angle"] },
          { title: "Ladder Safety Angle", prompt: "Model wall distance and ladder length to find a safe setup angle.", variables: ["distance", "ladder"] },
          { title: "Inclined Plane Component Split", prompt: "Resolve weight into parallel and perpendicular components on a slope.", variables: ["slope angle", "force"] },
        ],
      },
      {
        title: "Non-Right Triangles",
        experiments: [
          { title: "Law of Sines Ambiguous Case", prompt: "Explore when SSA data creates zero, one, or two triangles.", variables: ["side", "angle"] },
          { title: "Law of Cosines Hinge", prompt: "Change included angle and watch the opposite side length respond.", variables: ["included angle", "side"] },
          { title: "Triangle Area with Two Sides", prompt: "Use one-half ab sin C to calculate area from a hinged triangle.", variables: ["side a", "angle C"] },
          { title: "Circumradius Relation", prompt: "Compare side length over sine of opposite angle across a triangle.", variables: ["side", "opposite angle"] },
          { title: "Bearing Triangle Navigator", prompt: "Plot bearings and distances to locate a target point.", variables: ["bearing", "distance"] },
        ],
      },
      {
        title: "Heights and Distances",
        experiments: [
          { title: "Tower Height Clinometer", prompt: "Estimate tower height from eye level, distance, and angle of elevation.", variables: ["distance", "elevation"] },
          { title: "Shadow Length Clock", prompt: "Use sun angle and object height to predict shadow length.", variables: ["sun angle", "height"] },
          { title: "Two-Point Observation", prompt: "Measure elevation from two ground points to solve a hidden height.", variables: ["baseline", "angles"] },
          { title: "Depression Angle Drone", prompt: "Find ground distance from drone height and angle of depression.", variables: ["height", "depression"] },
          { title: "River Width Estimator", prompt: "Use a baseline and sight angle to estimate unreachable width.", variables: ["baseline", "sight angle"] },
        ],
      },
    ],
  },
  {
    title: "Waves and Signals",
    description: "Interference, harmonics, phase, and real-world wave behavior.",
    icon: RadioTower,
    subcategories: [
      {
        title: "Wave Composition",
        experiments: [
          { title: "Two-Wave Interference", prompt: "Combine waves and locate constructive and destructive interference.", variables: ["phase", "amplitude"] },
          { title: "Beat Frequency Mixer", prompt: "Blend nearby frequencies and measure the pulsing envelope.", variables: ["f1", "f2"] },
          { title: "Harmonic Stack Synth", prompt: "Add harmonics to transform a pure sine tone into richer shapes.", variables: ["harmonic", "weight"] },
          { title: "Fourier Shape Builder", prompt: "Approximate square and triangle waves from sine components.", variables: ["terms", "shape"] },
          { title: "Noise Filter Demo", prompt: "Apply simple frequency filters to reveal a hidden sinusoidal signal.", variables: ["cutoff", "noise"] },
        ],
      },
      {
        title: "Motion and Rotation",
        experiments: [
          { title: "Simple Harmonic Motion Link", prompt: "Connect circular motion projection to back-and-forth oscillation.", variables: ["radius", "speed"] },
          { title: "Spring Oscillation Model", prompt: "Use sine and cosine to model displacement, velocity, and acceleration.", variables: ["amplitude", "time"] },
          { title: "Pendulum Small-Angle Approximation", prompt: "Compare exact-looking swing motion with a sinusoidal approximation.", variables: ["length", "angle"] },
          { title: "Ferris Wheel Height", prompt: "Write a sinusoid for passenger height over time.", variables: ["radius", "speed"] },
          { title: "Rotating Vector Phasor", prompt: "Represent a sinusoidal signal as a spinning vector projection.", variables: ["phase", "frequency"] },
        ],
      },
      {
        title: "Applications",
        experiments: [
          { title: "AC Voltage Oscilloscope", prompt: "Adjust amplitude and frequency to model alternating current.", variables: ["voltage", "frequency"] },
          { title: "Sound Pitch Analyzer", prompt: "Relate frequency to pitch and amplitude to loudness.", variables: ["frequency", "amplitude"] },
          { title: "Radio Carrier Modulation", prompt: "Modulate a carrier wave and compare AM-style envelopes.", variables: ["carrier", "signal"] },
          { title: "Tide Prediction Curve", prompt: "Combine periodic components to model daily tide changes.", variables: ["phase", "component"] },
          { title: "Seismic Wave Arrival", prompt: "Compare wave phases to estimate travel-time differences.", variables: ["phase", "arrival"] },
        ],
      },
    ],
  },
  {
    title: "Advanced Analysis",
    description: "Equations, calculus connections, polar curves, and complex numbers.",
    icon: Sigma,
    subcategories: [
      {
        title: "Equations and Proofs",
        experiments: [
          { title: "Trig Equation Root Finder", prompt: "Scan one period and mark every solution to a trigonometric equation.", variables: ["equation", "interval"] },
          { title: "Identity Proof Flow", prompt: "Choose algebraic moves that transform one side into the other.", variables: ["move", "expression"] },
          { title: "Product-to-Sum Visualizer", prompt: "Compare multiplied waves with their sum-and-difference frequency form.", variables: ["frequency A", "frequency B"] },
          { title: "Sum-Angle Formula Lab", prompt: "Rotate two angles and test sine and cosine addition formulas.", variables: ["alpha", "beta"] },
          { title: "Double-Angle Area Model", prompt: "Relate double-angle formulas to repeated rotations and triangles.", variables: ["theta", "function"] },
        ],
      },
      {
        title: "Calculus Connections",
        experiments: [
          { title: "Derivative Cycle", prompt: "Differentiate sine and cosine repeatedly and observe the four-step cycle.", variables: ["function", "order"] },
          { title: "Integral Area Accumulator", prompt: "Track signed area under sine and cosine over selected intervals.", variables: ["start", "end"] },
          { title: "Small Angle Limit Zoom", prompt: "Zoom near zero to compare sin theta, theta, and tan theta.", variables: ["zoom", "theta"] },
          { title: "Curvature of a Sine Wave", prompt: "Locate where the wave bends upward, downward, or changes concavity.", variables: ["x", "concavity"] },
          { title: "Differential Equation Oscillator", prompt: "Show how y double-prime equals negative y creates sinusoidal motion.", variables: ["initial value", "velocity"] },
        ],
      },
      {
        title: "Polar and Complex",
        experiments: [
          { title: "Polar Rose Petals", prompt: "Change n in r equals sin n theta and count petals.", variables: ["n", "theta"] },
          { title: "Spiral Radius Control", prompt: "Compare Archimedean and sinusoidal polar radius changes.", variables: ["theta", "radius"] },
          { title: "Euler Formula Wheel", prompt: "Match e to the i theta with cosine plus i sine on the complex plane.", variables: ["theta", "complex point"] },
          { title: "De Moivre Power Lab", prompt: "Raise complex numbers to powers and watch angles multiply.", variables: ["power", "angle"] },
          { title: "Roots of Unity Compass", prompt: "Distribute nth roots around the unit circle.", variables: ["n", "root index"] },
        ],
      },
    ],
  },
  {
    title: "Practice Challenges",
    description: "Quick tasks that turn visual intuition into calculation fluency.",
    icon: FlaskConical,
    subcategories: [
      {
        title: "Prediction Games",
        experiments: [
          { title: "Guess the Graph", prompt: "Predict the equation from a transformed sinusoidal graph.", variables: ["amplitude", "period"] },
          { title: "Angle From Coordinates", prompt: "Infer angle families from a point on the unit circle.", variables: ["x", "y"] },
          { title: "Ratio Match Sprint", prompt: "Match triangle diagrams to sine, cosine, and tangent ratios.", variables: ["side", "ratio"] },
          { title: "Wave Parameter Detective", prompt: "Recover amplitude, period, phase, and midline from data points.", variables: ["points", "parameter"] },
          { title: "Identity Error Spotter", prompt: "Find the invalid step in a trigonometric simplification.", variables: ["step", "identity"] },
        ],
      },
      {
        title: "Real Data Tasks",
        experiments: [
          { title: "Daylight Hours Fit", prompt: "Fit a sinusoid to monthly daylight data.", variables: ["month", "latitude"] },
          { title: "Temperature Cycle Fit", prompt: "Model daily temperature as a shifted cosine curve.", variables: ["time", "temperature"] },
          { title: "Wheel Sensor Signal", prompt: "Estimate wheel speed from a periodic sensor trace.", variables: ["period", "radius"] },
          { title: "Heartbeat Wave Approximation", prompt: "Build a simple periodic approximation from repeated pulse data.", variables: ["frequency", "shape"] },
          { title: "Music Tuning Frequencies", prompt: "Compare note frequencies and octave ratios through periodic waves.", variables: ["note", "octave"] },
        ],
      },
    ],
  },
];

const totalExperiments = categories.reduce(
  (categoryTotal, category) =>
    categoryTotal + category.subcategories.reduce((subTotal, subcategory) => subTotal + subcategory.experiments.length, 0),
  0,
);

export default function TrigonometryExperimentCatalog() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].title);
  const visibleCategories = useMemo(
    () => categories.filter((category) => selectedCategory === "All" || category.title === selectedCategory),
    [selectedCategory],
  );

  return (
    <div className="space-y-4">
      <TrigonometryMathLab compact />
      <SectionCard
        title={`${totalExperiments} Trigonometry Experiments`}
        description="Choose a category, then launch the interactive lab above and test the variables listed on each card."
      >
        <div className="flex flex-wrap gap-2">
          {["All", ...categories.map((category) => category.title)].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-950"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-6">
          {visibleCategories.map((category) => {
            const Icon = category.icon;
            const categoryCount = category.subcategories.reduce((count, subcategory) => count + subcategory.experiments.length, 0);
            return (
              <section key={category.title} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950 dark:text-white">{category.title}</h3>
                      <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{category.description}</p>
                    </div>
                  </div>
                  <span className="mini-chip w-fit">{categoryCount} experiments</span>
                </div>

                <div className="mt-5 space-y-5">
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.title}>
                      <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-2 dark:border-white/10">
                        <h4 className="text-sm font-bold uppercase text-slate-600 dark:text-slate-300">{subcategory.title}</h4>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{subcategory.experiments.length} labs</span>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {subcategory.experiments.map((experiment, index) => (
                          <article key={experiment.title} className="min-h-[188px] rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/40">
                            <div className="flex items-start justify-between gap-3">
                              <h5 className="font-semibold leading-6 text-slate-950 dark:text-white">{experiment.title}</h5>
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{experiment.prompt}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {experiment.variables.map((variable) => (
                                <span key={variable} className="mini-chip">
                                  {variable}
                                </span>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                              className="mt-3 rounded-xl border border-cyan-300 bg-cyan-50 px-3 py-2 text-xs font-black text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100"
                            >
                              Open in lab above
                            </button>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
