import { useState } from "react";
import NCERTChapterScaffold from "../NCERTChapterScaffold";

type ConstructionMode = "perpendicular" | "angle" | "triangle";
type TilingMode = "square" | "triangle" | "hexagon";

const constructionSteps: Record<ConstructionMode, string[]> = {
  perpendicular: ["Draw segment AB.", "Open compass more than half of AB.", "Draw arcs above and below from A and B.", "Join arc intersections to get the perpendicular bisector."],
  angle: ["Draw an angle.", "Draw an arc cutting both arms.", "From both cut points, draw equal arcs inside the angle.", "Join the vertex to the arc intersection."],
  triangle: ["Draw base 3 units.", "From one end draw an arc of radius 4.", "From the other end draw an arc of radius 5.", "Join the intersection to both ends."],
};

export default function Grade7ConstructionsTilingsLab() {
  const [construction, setConstruction] = useState<ConstructionMode>("perpendicular");
  const [tiling, setTiling] = useState<TilingMode>("square");
  const [tileCount, setTileCount] = useState(5);

  return (
    <NCERTChapterScaffold
      title="Constructions and Tilings"
      conceptId="class-7-constructions-and-tilings"
      subtitle="Follow construction steps and test which shapes repeat without gaps."
      formula="accurate construction = fixed points + equal distances + clear steps"
      presets={["perpendicular bisector", "angle bisector", "3-4-5 triangle", "square tiling", "triangle tiling", "hexagon tiling"]}
      diagramSummary="The construction diagram shows compass-style arcs, while the tiling diagram repeats a selected shape in a pattern."
      studentTask={{
        tryFirst: "Choose perpendicular bisector and read each step before looking at the diagram.",
        predict: "Which points must be the same distance from A and B?",
        observe: "Arcs help locate exact points without measuring by eye.",
        explain: "Why do equal compass openings make a reliable construction?",
        commonMistake: "Do not guess the middle point by sight. Use equal arcs or measurements.",
      }}
      teacherNote={{
        objective: "Students connect construction steps with geometric conditions and tiling patterns.",
        prerequisite: "Line segments, angles, triangles, and symmetry.",
        prompt: "Ask students which information is fixed and which point is constructed.",
        misconception: "Students may treat construction as drawing a neat picture instead of following exact conditions.",
        extension: "Ask which regular polygons tile the plane and why angles around a point matter.",
      }}
      recap={["Compass arcs preserve equal distances.", "Construction steps create points that satisfy a condition.", "A tiling works when shapes repeat without gaps or overlaps."]}
    >
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
          <svg viewBox="0 0 760 420" role="img" aria-label={`${construction} construction and ${tiling} tiling diagram`} className="h-[360px] w-full">
            <rect width="760" height="420" rx="24" fill="#020617" />
            <ConstructionSvg mode={construction} />
            <TilingSvg mode={tiling} count={tileCount} />
          </svg>
        </div>
        <aside className="space-y-4">
          <label className="block text-sm font-black">
            Construction mode
            <select aria-label="Construction mode" value={construction} onChange={(event) => setConstruction(event.target.value as ConstructionMode)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
              <option value="perpendicular">Perpendicular bisector</option>
              <option value="angle">Angle bisector</option>
              <option value="triangle">Triangle 3, 4, 5</option>
            </select>
          </label>
          <label className="block text-sm font-black">
            Tiling pattern
            <select aria-label="Tiling pattern" value={tiling} onChange={(event) => setTiling(event.target.value as TilingMode)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
              <option value="square">Squares</option>
              <option value="triangle">Triangles</option>
              <option value="hexagon">Hexagons</option>
            </select>
          </label>
          <label className="block text-sm font-black">
            Tile count
            <input aria-label="Tile count" type="range" min={3} max={8} value={tileCount} onChange={(event) => setTileCount(Number(event.target.value))} className="mt-3 w-full" />
          </label>
          <ol className="space-y-2" aria-live="polite">
            {constructionSteps[construction].map((step, index) => (
              <li key={step} className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-sm font-bold text-cyan-950 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-50">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </NCERTChapterScaffold>
  );
}

function ConstructionSvg({ mode }: { mode: ConstructionMode }) {
  if (mode === "angle") {
    return (
      <g transform="translate(60 60)">
        <g stroke="#e2e8f0" strokeWidth="5" fill="none">
          <path d="M80 260 L250 120 M80 260 L320 260" />
          <path d="M145 206 A90 90 0 0 1 170 260" stroke="#22d3ee" strokeDasharray="8 8" />
          <path d="M190 170 A70 70 0 0 1 235 225 M175 260 A70 70 0 0 1 235 225" stroke="#facc15" />
          <path d="M80 260 L235 225" stroke="#a78bfa" />
        </g>
        <text x="90" y="300" fill="#fff" stroke="none" fontSize="30" fontWeight="900">angle bisector</text>
      </g>
    );
  }
  if (mode === "triangle") {
    return (
      <g transform="translate(50 55)">
        <g stroke="#e2e8f0" strokeWidth="5" fill="none">
          <path d="M70 280 L250 280 L250 40 Z" fill="#0e7490" opacity="0.55" />
          <path d="M70 280 A180 180 0 0 1 250 100 M250 280 A240 240 0 0 0 250 40" stroke="#f472b6" strokeDasharray="8 8" />
        </g>
        <g fill="#fff" stroke="none" fontSize="30" fontWeight="900">
          <text x="135" y="315">3</text>
          <text x="265" y="165">4</text>
          <text x="135" y="150">5</text>
        </g>
      </g>
    );
  }
  return (
    <g transform="translate(50 70)">
      <g stroke="#e2e8f0" strokeWidth="5" fill="none">
        <path d="M60 200 L300 200" />
        <path d="M60 200 A150 150 0 0 1 180 70 M60 200 A150 150 0 0 0 180 330 M300 200 A150 150 0 0 0 180 70 M300 200 A150 150 0 0 1 180 330" stroke="#22d3ee" strokeDasharray="8 8" />
        <path d="M180 70 L180 330" stroke="#facc15" />
      </g>
      <text x="130" y="365" fill="#fff" stroke="none" fontSize="30" fontWeight="900">perpendicular bisector</text>
    </g>
  );
}

function TilingSvg({ mode, count }: { mode: TilingMode; count: number }) {
  const cells = Array.from({ length: count * 2 }, (_, index) => index);
  return (
    <g transform="translate(430 80)">
      {cells.map((cell) => {
        const x = (cell % count) * 46;
        const y = Math.floor(cell / count) * 54;
        if (mode === "triangle") return <path key={cell} d={`M${x} ${y + 48} L${x + 23} ${y} L${x + 46} ${y + 48} Z`} fill={cell % 2 ? "#22d3ee" : "#a78bfa"} opacity="0.85" />;
        if (mode === "hexagon") return <polygon key={cell} points={`${x + 18},${y} ${x + 38},${y + 10} ${x + 38},${y + 34} ${x + 18},${y + 44} ${x - 2},${y + 34} ${x - 2},${y + 10}`} fill={cell % 2 ? "#facc15" : "#22d3ee"} opacity="0.85" />;
        return <rect key={cell} x={x} y={y} width="42" height="42" fill={cell % 2 ? "#22d3ee" : "#facc15"} opacity="0.85" />;
      })}
      <text x="0" y="150" fill="#fff" fontWeight="900">tiling repeats with no gaps</text>
    </g>
  );
}
