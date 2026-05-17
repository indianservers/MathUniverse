import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";

const coverage = ["Algebra", "Geometry", "Trigonometry", "Calculus", "Complex numbers", "Linear algebra", "AI applications"];
const tech = ["React", "TypeScript", "Tailwind CSS", "Recharts", "Three.js", "KaTeX", "localStorage"];
const future = ["AI tutor API integration", "More 3D models", "Voice explanations", "Teacher dashboard", "Exportable worksheets", "More quizzes"];

export default function About() {
  return (
    <div className="space-y-6">
      <TopicHeader title="About Math Universe" subtitle="A browser-based interactive mathematics learning app built to make formulas visual, explorable, and connected to real life." difficulty="All levels" estimatedMinutes={5} />
      <SectionCard title="Purpose" description="Math Universe helps learners build intuition by turning abstract formulas into sliders, charts, diagrams, 3D scenes, simulations, and topic quizzes." />
      <SectionCard title="What It Covers">
        <div className="grid gap-3 md:grid-cols-4">{coverage.map((item) => <div key={item} className="rounded-2xl bg-slate-100 p-4 font-semibold dark:bg-white/10">{item}</div>)}</div>
      </SectionCard>
      <SectionCard title="Why Visual Mathematics?" description="Students understand better when formulas become visual, interactive, and connected to real-world applications. A graph, slider, or animated model can make a symbolic idea feel concrete." />
      <SectionCard title="Technology Used">
        <div className="flex flex-wrap gap-2">{tech.map((item) => <span key={item} className="rounded-full bg-cyan-100 px-3 py-2 text-sm font-semibold text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">{item}</span>)}</div>
      </SectionCard>
      <SectionCard title="Future Improvements">
        <div className="grid gap-3 md:grid-cols-3">{future.map((item) => <div key={item} className="rounded-2xl bg-slate-100 p-4 font-semibold dark:bg-white/10">{item}</div>)}</div>
      </SectionCard>
    </div>
  );
}
