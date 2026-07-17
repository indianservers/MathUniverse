import { useMemo, useState } from "react";
import NCERTChapterScaffold from "../NCERTChapterScaffold";

type Mode = "transversal" | "triangle" | "exterior" | "intersecting";

const presets = [
  { label: "parallel lines at 40 degrees", mode: "transversal" as Mode, angle: 40 },
  { label: "parallel lines at 65 degrees", mode: "transversal" as Mode, angle: 65 },
  { label: "triangle 50, 60, 70", mode: "triangle" as Mode, angle: 50 },
  { label: "exterior angle", mode: "exterior" as Mode, angle: 60 },
  { label: "vertical opposite angles", mode: "intersecting" as Mode, angle: 55 },
];

export default function Grade7LinesTrianglesLab() {
  const [mode, setMode] = useState<Mode>("transversal");
  const [angle, setAngle] = useState(40);
  const triangle = useMemo(() => {
    const a = Math.max(25, Math.min(120, angle));
    const b = 60;
    return { a, b, c: 180 - a - b };
  }, [angle]);

  return (
    <NCERTChapterScaffold
      title="Lines and Triangles"
      conceptId="class-7-lines-and-triangles"
      subtitle="Explore parallel lines, transversals, angle pairs, triangle angle sum, and exterior angle facts."
      formula="angles in a triangle add to 180 degrees"
      presets={presets.map((preset) => preset.label)}
      diagramSummary="The diagram changes between parallel lines, triangles, exterior angles, and intersecting lines with live angle labels."
      studentTask={{
        tryFirst: "Set the transversal angle to 40 degrees and find the matching angle.",
        predict: "Which angles will be equal when lines are parallel?",
        observe: "Corresponding and alternate interior angles match.",
        explain: "Why do triangle angles always add to 180 degrees?",
        commonMistake: "Do not assume all angle pairs are equal. The line relationship matters.",
      }}
      teacherNote={{
        objective: "Students identify angle pairs and use triangle angle facts.",
        prerequisite: "Basic angle measurement and straight angle equals 180 degrees.",
        prompt: "Ask students to name the angle pair before calculating.",
        misconception: "Students often mix corresponding, alternate, and co-interior angles.",
        extension: "Ask students to create a triangle and calculate an exterior angle two ways.",
      }}
      recap={["Parallel lines create predictable angle pairs.", "A triangle has 180 degrees in total.", "An exterior angle equals the sum of the two opposite interior angles."]}
    >
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
          <svg viewBox="0 0 760 420" role="img" aria-label={`${mode} angle diagram`} className="h-[360px] w-full">
            <rect width="760" height="420" rx="24" fill="#020617" />
            {mode === "transversal" && <Transversal angle={angle} />}
            {mode === "triangle" && <TriangleAngles a={triangle.a} b={triangle.b} c={triangle.c} />}
            {mode === "exterior" && <ExteriorAngle angle={angle} />}
            {mode === "intersecting" && <Intersecting angle={angle} />}
          </svg>
        </div>
        <aside className="space-y-4">
          <label className="block text-sm font-black">
            Explorer mode
            <select aria-label="Lines and triangles mode" value={mode} onChange={(event) => setMode(event.target.value as Mode)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
              <option value="transversal">Parallel lines and transversal</option>
              <option value="triangle">Triangle angle sum</option>
              <option value="exterior">Exterior angle</option>
              <option value="intersecting">Intersecting lines</option>
            </select>
          </label>
          <label className="block text-sm font-black">
            Angle control: {angle} degrees
            <input aria-label="Angle control" type="range" min={25} max={120} value={angle} onChange={(event) => setAngle(Number(event.target.value))} className="mt-3 w-full" />
          </label>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-bold text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50" aria-live="polite">
            {mode === "transversal" && <p>Corresponding angle = {angle} degrees. Co-interior partner = {180 - angle} degrees.</p>}
            {mode === "triangle" && <p>{triangle.a} + {triangle.b} + {triangle.c} = 180 degrees.</p>}
            {mode === "exterior" && <p>Exterior angle = opposite interior angles added together.</p>}
            {mode === "intersecting" && <p>Vertical opposite angles are equal: {angle} degrees and {angle} degrees.</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button key={preset.label} type="button" className="action-secondary" onClick={() => { setMode(preset.mode); setAngle(preset.angle); }}>
                {preset.label}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </NCERTChapterScaffold>
  );
}

function Transversal({ angle }: { angle: number }) {
  return (
    <g>
      <g stroke="#e2e8f0" strokeWidth="5" fill="none">
        <path d="M80 140 H680 M80 280 H680" />
        <path d="M260 340 L510 70" stroke="#22d3ee" />
        <path d="M365 140 A55 55 0 0 1 410 105" stroke="#facc15" />
        <path d="M495 280 A55 55 0 0 1 538 246" stroke="#facc15" />
      </g>
      <g stroke="none" fontSize="32" fontWeight="900">
        <text x="420" y="118" fill="#fff">{angle} degrees</text>
        <text x="510" y="256" fill="#fff">corresponding</text>
        <text x="510" y="286" fill="#fff">= {angle} degrees</text>
        <text x="120" y="120" fill="#93c5fd">parallel</text>
      </g>
    </g>
  );
}

function TriangleAngles({ a, b, c }: { a: number; b: number; c: number }) {
  return (
    <g>
      <g stroke="#e2e8f0" strokeWidth="5" fill="none">
        <path d="M170 320 L590 320 L360 95 Z" fill="#0e7490" opacity="0.65" />
      </g>
      <g stroke="none" fontSize="32" fontWeight="900">
        <text x="190" y="300" fill="#facc15">{a} degrees</text>
        <text x="505" y="300" fill="#facc15">{b} degrees</text>
        <text x="345" y="135" fill="#facc15">{c} degrees</text>
        <text x="230" y="380" fill="#fff">{a} + {b} + {c} = 180 degrees</text>
      </g>
    </g>
  );
}

function ExteriorAngle({ angle }: { angle: number }) {
  const other = 60;
  const exterior = angle + other;
  return (
    <g>
      <g stroke="#e2e8f0" strokeWidth="5" fill="none">
        <path d="M180 320 L500 320 L340 120 Z" fill="#0e7490" opacity="0.65" />
        <path d="M500 320 H680" stroke="#facc15" />
      </g>
      <g stroke="none" fontSize="32" fontWeight="900">
        <text x="205" y="300" fill="#fff">{angle} degrees</text>
        <text x="335" y="155" fill="#fff">{other} degrees</text>
        <text x="525" y="292" fill="#facc15">exterior</text>
        <text x="525" y="322" fill="#facc15">{exterior} degrees</text>
        <text x="210" y="380" fill="#fff">exterior = {angle} + {other}</text>
      </g>
    </g>
  );
}

function Intersecting({ angle }: { angle: number }) {
  return (
    <g>
      <g stroke="#e2e8f0" strokeWidth="5" fill="none">
        <path d="M160 320 L600 100 M160 100 L600 320" />
      </g>
      <g stroke="none" fontSize="32" fontWeight="900">
        <text x="380" y="170" fill="#facc15">{angle} degrees</text>
        <text x="335" y="285" fill="#facc15">{angle} degrees</text>
        <text x="180" y="380" fill="#fff">vertical opposite angles are equal</text>
      </g>
    </g>
  );
}
