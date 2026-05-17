import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { internalSiteLinks } from "../data/siteLinks";

const groupedLinks = internalSiteLinks.reduce<Record<string, typeof internalSiteLinks>>((groups, link) => {
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

export default function Sitemap() {
  return (
    <div className="space-y-6">
      <TopicHeader
        title="Sitemap"
        subtitle="A crawl-friendly index of Math Universe internal routes, concept pages, tools, and labs."
        difficulty="Search index"
        estimatedMinutes={3}
      />

      <SectionCard title="Search Engine Route Index" description="This sitemap page lists internal pages with crawl hints. Metadata for each route is also injected into the document head when the route is opened.">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-white/10">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-white/10 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Change</th>
                <th className="px-4 py-3">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/60 dark:divide-white/10 dark:bg-white/5">
              {internalSiteLinks.map((item) => (
                <tr key={`${item.category}-${item.path}`} className="align-top">
                  <td className="px-4 py-3">
                    <Link className="font-semibold text-cyan-700 hover:text-cyan-500 dark:text-cyan-200" to={item.path}>
                      {item.title}
                    </Link>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600 dark:text-slate-300">{item.description}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-200">{item.path}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{item.category}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{item.changeFrequency}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{item.priority.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {orderedCategories.map((category) => (
        <SectionCard key={category} title={category}>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {groupedLinks[category].map((item) => (
              <Link key={`${item.category}-${item.path}`} to={item.path} className="rounded-2xl bg-slate-100 p-3 text-sm font-semibold text-slate-800 transition hover:bg-cyan-100 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-cyan-400/15">
                {item.title}
                <span className="mt-1 block break-all font-mono text-xs font-normal text-slate-500 dark:text-slate-400">{item.path}</span>
              </Link>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

