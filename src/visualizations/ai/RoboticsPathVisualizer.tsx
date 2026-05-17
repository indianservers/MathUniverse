import { useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";

const size = 10;
const start = [0, 0] as const;
const target = [9, 8] as const;
const obstacles = new Set(["2,2", "2,3", "2,4", "3,4", "4,4", "6,2", "6,3", "6,4", "6,5", "5,7", "6,7", "7,7"]);

function bfs() {
  const queue: [number, number][] = [[...start]];
  const parent = new Map<string, string>();
  const seen = new Set(["0,0"]);
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (queue.length) {
    const [x, y] = queue.shift()!;
    if (x === target[0] && y === target[1]) break;
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= size || ny >= size || obstacles.has(key) || seen.has(key)) continue;
      seen.add(key);
      parent.set(key, `${x},${y}`);
      queue.push([nx, ny]);
    }
  }
  const path: string[] = [];
  let key = `${target[0]},${target[1]}`;
  while (key) {
    path.push(key);
    key = parent.get(key) ?? "";
  }
  return path.reverse();
}

export default function RoboticsPathVisualizer() {
  const [showPath, setShowPath] = useState(false);
  const path = useMemo(() => bfs(), []);
  const pathSet = new Set(showPath ? path : []);
  return (
    <SectionCard title="Robotics Path Planning Visualizer" description="Robots use geometry, vectors, optimization, and graph algorithms to move safely.">
      <button className="mb-4 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950" onClick={() => setShowPath((value) => !value)}>{showPath ? "Hide Path" : "Generate Path"}</button>
      <div className="grid max-w-xl grid-cols-10 gap-1">
        {Array.from({ length: size * size }, (_, index) => {
          const x = index % size;
          const y = Math.floor(index / size);
          const key = `${x},${y}`;
          const kind = key === "0,0" ? "S" : key === `${target[0]},${target[1]}` ? "T" : obstacles.has(key) ? "" : pathSet.has(key) ? "•" : "";
          const cls = key === "0,0" ? "bg-emerald-500 text-white" : key === `${target[0]},${target[1]}` ? "bg-rose-500 text-white" : obstacles.has(key) ? "bg-slate-800 dark:bg-slate-200" : pathSet.has(key) ? "bg-cyan-400 text-slate-950" : "bg-slate-100 dark:bg-white/10";
          return <div key={key} className={`grid aspect-square place-items-center rounded-lg text-sm font-bold ${cls}`}>{kind}</div>;
        })}
      </div>
    </SectionCard>
  );
}
