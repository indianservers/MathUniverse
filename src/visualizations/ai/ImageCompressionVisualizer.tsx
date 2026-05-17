import { useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";

export default function ImageCompressionVisualizer() {
  const [level, setLevel] = useState(4);
  const base = useMemo(() => Array.from({ length: 12 }, (_, y) => Array.from({ length: 12 }, (_, x) => `hsl(${190 + x * 9 + y * 5}, 75%, ${38 + ((x + y) % 5) * 8}%)`)), []);
  const block = Math.max(1, Math.round(level / 2));
  return (
    <SectionCard title="Image Compression Visualizer" description="Compression uses mathematical approximations, matrix operations, and frequency components.">
      <SliderControl label="Compression level" value={level} min={1} max={10} step={1} onChange={setLevel} />
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <Grid title="Original" colors={base} block={1} />
        <Grid title="Compressed" colors={base} block={block} />
      </div>
    </SectionCard>
  );
}

function Grid({ title, colors, block }: { title: string; colors: string[][]; block: number }) {
  return (
    <div>
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="grid overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10" style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}>
        {colors.flatMap((row, y) => row.map((color, x) => {
          const sourceX = Math.floor(x / block) * block;
          const sourceY = Math.floor(y / block) * block;
          return <div key={`${x}-${y}`} className="aspect-square" style={{ background: colors[sourceY][sourceX] ?? color }} />;
        }))}
      </div>
    </div>
  );
}
