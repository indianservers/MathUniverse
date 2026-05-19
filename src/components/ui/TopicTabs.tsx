import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";

type TopicTab = {
  id: string;
  label: string;
  content: ReactNode;
};

export default function TopicTabs({ tabs, initialId }: { tabs: TopicTab[]; initialId?: string }) {
  const [activeId, setActiveId] = useState(initialId ?? tabs[0]?.id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  if (!active) return null;

  return (
    <div className="space-y-4">
      <div className="mobile-safe-scroll">
        <div className="inline-flex min-w-full gap-2 rounded-2xl border border-slate-200 bg-white/80 p-1 dark:border-white/10 dark:bg-white/5 md:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`relative min-h-10 rounded-xl px-4 py-2 text-sm font-black transition ${active.id === tab.id ? "text-slate-950 dark:text-white" : "text-slate-500 hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-100"}`}
              onClick={() => setActiveId(tab.id)}
            >
              {active.id === tab.id && <motion.span layoutId="topic-tab-pill" className="absolute inset-0 rounded-xl bg-cyan-100 dark:bg-cyan-400/15" />}
              <span className="relative">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
          {active.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
