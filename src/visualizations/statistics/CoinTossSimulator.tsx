import { motion } from "framer-motion";
import { useState } from "react";
import ResponsiveLineChart from "../../components/charts/ResponsiveLineChart";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import { roundTo } from "../../utils/math";

type HistoryPoint = { x: number; y: number };

export default function CoinTossSimulator() {
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [flipping, setFlipping] = useState(false);
  const total = heads + tails;

  const toss = (count: number) => {
    setFlipping(true);
    window.setTimeout(() => setFlipping(false), 450);
    let h = heads;
    let t = tails;
    const next = [...history];
    for (let i = 0; i < count; i += 1) {
      if (Math.random() < 0.5) h += 1; else t += 1;
      next.push({ x: h + t, y: h / (h + t) });
    }
    setHeads(h);
    setTails(t);
    setHistory(next);
  };

  return (
    <SectionCard title="Coin Toss Simulator" description="As trials increase, experimental probability tends toward theoretical probability.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <motion.div animate={{ rotateY: flipping ? 720 : 0 }} transition={{ duration: 0.45 }} className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-3xl font-bold text-white shadow-glow">
            {heads >= tails ? "H" : "T"}
          </motion.div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 10, 100].map((count) => <button key={count} className="rounded-2xl bg-slate-950 px-4 py-3 text-white dark:bg-white dark:text-slate-950" onClick={() => toss(count)}>Toss {count}</button>)}
            <button className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold dark:bg-white/10" onClick={() => { setHeads(0); setTails(0); setHistory([]); }}>Reset</button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="Heads" value={heads} /><Metric label="Tails" value={tails} /><Metric label="P(heads)" value={total ? heads / total : 0} /><Metric label="P(tails)" value={total ? tails / total : 0} />
          </div>
        </div>
        <GraphCard title="Convergence to 0.5" description={`Total tosses: ${total}`}>
          <ResponsiveLineChart data={history} lineColor="#f59e0b" />
        </GraphCard>
      </div>
    </SectionCard>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{roundTo(value, 3)}</p></div>;
}
