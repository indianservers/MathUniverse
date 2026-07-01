import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NCERTGapAnalysis from "../components/syllabus/NCERTGapAnalysis";
import SmartSyllabusPlanner from "../components/syllabus/SmartSyllabusPlanner";
import SyllabusFilterBar from "../components/syllabus/SyllabusFilterBar";
import SyllabusRoadmap from "../components/syllabus/SyllabusRoadmap";
import SyllabusTopicCard from "../components/syllabus/SyllabusTopicCard";
import UnitUpgradeDashboard from "../components/syllabus/UnitUpgradeDashboard";
import MathExpression from "../components/ui/MathExpression";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { advancedLabCategories, advancedSyllabusLabs } from "../data/advancedSyllabusLabs";
import { allSyllabusTopics, isConcreteSyllabusLevel, syllabusLevels } from "../data/syllabus";

export default function Syllabus() {
  const { levelId } = useParams();
  const selectedLevel = syllabusLevels.find((level) => level.id === levelId);
  const routeLevel = selectedLevel?.id ?? "All";
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState(routeLevel);
  const [unitFilter, setUnitFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const baseTopics = selectedLevel ? selectedLevel.topics : allSyllabusTopics;

  useEffect(() => {
    setLevelFilter(routeLevel);
  }, [routeLevel]);

  const filteredTopics = useMemo(() => {
    const query = search.trim().toLowerCase();
    return baseTopics.filter((topic) => {
      const matchesSearch = !query || [topic.title, topic.unit, topic.classLevel, topic.description, topic.recommendedVisualization, ...topic.keyFormulas, ...topic.concepts].join(" ").toLowerCase().includes(query);
      const matchesLevel = levelFilter === "All" || topic.classLevel.toLowerCase().replace(/\s+/g, "-") === levelFilter;
      const matchesUnit = unitFilter === "All" || topic.unit === unitFilter;
      const matchesStatus = statusFilter === "All" || topic.status === statusFilter;
      return matchesSearch && matchesLevel && matchesUnit && matchesStatus;
    });
  }, [baseTopics, levelFilter, search, statusFilter, unitFilter]);

  const handleLevelFilter = (value: string) => {
    setLevelFilter(value);
    if (isConcreteSyllabusLevel(value)) setSearch("");
  };

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Syllabus Universe"
        subtitle="Browse grade-wise topics and advanced concept labs. Each interactive lab opens on its own dedicated page with formulas, sliders, guided tasks, and related concepts."
        difficulty={selectedLevel ? selectedLevel.title : "All levels"}
        estimatedMinutes={20}
      />

      <SyllabusRoadmap activeLevel={routeLevel} onLevelChange={handleLevelFilter} />
      <SyllabusFilterBar search={search} level={levelFilter} unit={unitFilter} status={statusFilter} onSearch={setSearch} onLevel={handleLevelFilter} onUnit={setUnitFilter} onStatus={setStatusFilter} onReset={() => { setSearch(""); setLevelFilter(routeLevel); setUnitFilter("All"); setStatusFilter("All"); }} />
      <SmartSyllabusPlanner topics={filteredTopics.length ? filteredTopics : baseTopics} levelId={levelFilter} />
      <UnitUpgradeDashboard topics={filteredTopics.length ? filteredTopics : baseTopics} />

      <SectionCard title="Grade and Board Topics" description="NCERT and school syllabus topics are grouped by class, with formulas, concepts, visual links, and guided workspace routes.">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{filteredTopics.length} of {baseTopics.length} topics shown</p>
          <div className="flex flex-wrap gap-2">
            <Link to="/workspace?mode=guided" className="action-secondary">Open guided workspace</Link>
            <Link to="/workspace?panel=teacher&teacher=1" className="action-secondary">Teacher workspace</Link>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredTopics.map((topic) => <SyllabusTopicCard key={topic.id} topic={topic} />)}
        </div>
      </SectionCard>

      <NCERTGapAnalysis />

      <SectionCard title="Advanced Interactive Syllabus Labs" description="Each category is subcategorized so students can jump directly into a focused visualizer instead of one oversized page.">
        <div className="space-y-5">
          {advancedLabCategories.map((category) => {
            const labs = advancedSyllabusLabs.filter((lab) => lab.category === category);
            const subcategories = Array.from(new Set(labs.map((lab) => lab.subcategory)));
            return (
              <div key={category} className="rounded-2xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                <h2 className="text-xl font-bold">{category}</h2>
                <div className="mt-4 space-y-4">
                  {subcategories.map((subcategory) => (
                    <div key={subcategory}>
                      <p className="text-sm font-bold uppercase text-violet-600 dark:text-violet-300">{subcategory}</p>
                      <div className="mt-2 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {labs.filter((lab) => lab.subcategory === subcategory).map((lab) => (
                          <Link key={lab.id} to={`/syllabus-lab/${lab.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-slate-950">
                            <h3 className="font-bold">{lab.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{lab.summary}</p>
                            <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400"><MathExpression value={lab.formula} /></p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
