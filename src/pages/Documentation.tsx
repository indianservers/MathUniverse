import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { siteLinks } from "../data/siteLinks";

const groupedLinks = siteLinks.reduce<Record<string, typeof siteLinks>>((groups, link) => {
  const group = groups[link.category] ?? [];
  group.push(link);
  groups[link.category] = group;
  return groups;
}, {});

const orderedCategories = Object.keys(groupedLinks).sort((a, b) => {
  if (a === "Core") return -1;
  if (b === "Core") return 1;
  if (a === "Modules") return -1;
  if (b === "Modules") return 1;
  return a.localeCompare(b);
});

export default function Documentation() {
  const internalCount = siteLinks.filter((link) => !link.isExternal).length;
  const externalCount = siteLinks.length - internalCount;

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Documentation"
        subtitle="A complete index of Math Universe modules, tools, concept pages, advanced labs, and supporting routes."
        difficulty="Reference"
        estimatedMinutes={8}
      />

      <SectionCard title="Site Coverage" description="Use this page as a human-readable guide to every learning route currently published in Math Universe. Each entry includes its link, route, search category, and topic details.">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="text-2xl font-bold text-slate-950 dark:text-white">{internalCount}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Internal pages</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="text-2xl font-bold text-slate-950 dark:text-white">{externalCount}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">External references</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="text-2xl font-bold text-slate-950 dark:text-white">{orderedCategories.length}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Documentation groups</p>
          </div>
        </div>
      </SectionCard>

      {orderedCategories.map((category) => (
        <SectionCard key={category} title={category} description={`${groupedLinks[category].length} documented link${groupedLinks[category].length === 1 ? "" : "s"}.`}>
          <div className="grid gap-3 lg:grid-cols-2">
            {groupedLinks[category].map((item) => (
              <div key={`${item.category}-${item.path}`} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-base font-semibold text-slate-950 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </div>
                  {item.isExternal ? <ExternalLink className="h-5 w-5 shrink-0 text-cyan-500" /> : <LinkIcon className="h-5 w-5 shrink-0 text-cyan-500" />}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="mini-chip">{item.path}</span>
                  <span className="mini-chip">{item.changeFrequency}</span>
                  <span className="mini-chip">priority {item.priority}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.keywords.slice(0, 6).map((keyword) => (
                    <span key={keyword} className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
                      {keyword}
                    </span>
                  ))}
                </div>
                {item.details && item.details.length > 0 && (
                  <div className="mt-4 rounded-2xl bg-slate-100 p-3 dark:bg-slate-950/60">
                    <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Details</p>
                    <ul className="mt-2 grid gap-1 text-sm leading-6 text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                      {item.details.slice(0, 8).map((detail) => (
                        <li key={detail}>• {detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.isExternal ? (
                  <a className="action-secondary mt-4" href={item.path} target="_blank" rel="noreferrer">
                    Open link
                  </a>
                ) : (
                  <Link className="action-secondary mt-4" to={item.path}>
                    Open page
                  </Link>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
