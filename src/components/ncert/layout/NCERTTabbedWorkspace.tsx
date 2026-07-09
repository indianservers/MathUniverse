import { type KeyboardEvent, type ReactNode, useId, useState } from "react";

export type NCERTTabItem = {
  id: string;
  label: string;
  badge?: string;
  content: ReactNode;
};

type NCERTTabbedWorkspaceProps = {
  tabs: NCERTTabItem[];
  defaultTabId?: string;
  ariaLabel: string;
  sticky?: boolean;
  compact?: boolean;
};

export default function NCERTTabbedWorkspace({
  tabs,
  defaultTabId,
  ariaLabel,
  sticky = true,
  compact = false,
}: NCERTTabbedWorkspaceProps) {
  const stableId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id ?? "");
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === activeId));
  const activeTab = tabs[activeIndex] ?? tabs[0];

  const focusTab = (index: number) => {
    const next = tabs[(index + tabs.length) % tabs.length];
    if (!next) return;
    setActiveId(next.id);
    window.requestAnimationFrame(() => {
      document.getElementById(`${stableId}-${next.id}-tab`)?.focus();
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(activeIndex + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(activeIndex - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      focusTab(tabs.length - 1);
    }
  };

  if (tabs.length === 0) return null;

  return (
    <section className="rounded-3xl border border-cyan-200 bg-white/95 shadow-sm dark:border-cyan-300/20 dark:bg-slate-950/80">
      <div className={`${sticky ? "sticky top-0 z-20" : ""} rounded-t-3xl border-b border-slate-200 bg-white/95 p-2 backdrop-blur dark:border-white/10 dark:bg-slate-950/90`}>
        <div
          role="tablist"
          aria-label={ariaLabel}
          onKeyDown={handleKeyDown}
          className="flex gap-2 overflow-x-auto"
        >
          {tabs.map((tab) => {
            const selected = tab.id === activeTab.id;
            return (
              <button
                id={`${stableId}-${tab.id}-tab`}
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${stableId}-${tab.id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(tab.id)}
                className={`min-h-11 shrink-0 rounded-2xl px-4 py-2 text-sm font-black transition ${
                  selected
                    ? "bg-slate-950 text-white shadow-sm dark:bg-cyan-300 dark:text-slate-950"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-cyan-200 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[11px]">{tab.badge}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div
        id={`${stableId}-${activeTab.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${stableId}-${activeTab.id}-tab`}
        className={compact ? "p-3 sm:p-4" : "p-4 sm:p-5"}
      >
        {activeTab.content}
      </div>
    </section>
  );
}
