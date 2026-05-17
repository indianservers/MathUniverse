import { useState } from "react";
import ResponsiveBarChart from "../../components/charts/ResponsiveBarChart";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import { roundTo } from "../../utils/math";

export default function DiceSimulator() {
  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0]);
  const [face, setFace] = useState(1);
  const total = counts.reduce((sum, value) => sum + value, 0);

  const roll = (n: number) => {
    const next = [...counts];
    let last = face;
    for (let i = 0; i < n; i += 1) {
      last = Math.floor(Math.random() * 6) + 1;
      next[last - 1] += 1;
    }
    setFace(last);
    setCounts(next);
  };

  const data = counts.map((value, index) => ({ name: `${index + 1}`, value }));

  return (
    <SectionCard title="Dice Simulator" description="Fair dice should approach equal probabilities over many trials.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-2xl border-4 border-slate-900 bg-white text-5xl font-bold text-slate-950 shadow-xl dark:border-white">{face}</div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 10, 100, 1000].map((count) => <button key={count} className="rounded-2xl bg-slate-950 px-4 py-3 text-white dark:bg-white dark:text-slate-950" onClick={() => roll(count)}>Roll {count}</button>)}
            <button className="col-span-2 rounded-2xl bg-slate-100 px-4 py-3 font-semibold dark:bg-white/10" onClick={() => setCounts([0, 0, 0, 0, 0, 0])}>Reset</button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">{counts.map((value, index) => <Metric key={index} label={`P(${index + 1})`} value={total ? value / total : 0} />)}</div>
        </div>
        <GraphCard title="Outcome Counts" description={`Total rolls: ${total}`}>
          <ResponsiveBarChart data={data} color="#8b5cf6" />
        </GraphCard>
      </div>
    </SectionCard>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{roundTo(value, 3)}</p></div>;
}
