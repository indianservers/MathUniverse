import NCERTTabbedWorkspace, { type NCERTTabItem } from "./NCERTTabbedWorkspace";

type NCERTSubTabsProps = {
  tabs: NCERTTabItem[];
  ariaLabel: string;
  defaultTabId?: string;
};

export default function NCERTSubTabs({ tabs, ariaLabel, defaultTabId }: NCERTSubTabsProps) {
  return (
    <div className="rounded-3xl bg-slate-50 p-2 dark:bg-white/5">
      <NCERTTabbedWorkspace tabs={tabs} ariaLabel={ariaLabel} defaultTabId={defaultTabId} sticky={false} compact />
    </div>
  );
}
