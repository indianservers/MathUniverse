import { Link } from "react-router-dom";
import { engineeringConceptLabId, syllabusConceptLabId } from "../../data/advancedSyllabusLabs";
import type { SyllabusTopic } from "../../data/syllabus";
import MathExpression from "../ui/MathExpression";
import { ConceptIconBadge, ConceptImagePanel } from "./ConceptVisualMedia";
import TopicStatusBadge from "./TopicStatusBadge";

export default function SyllabusTopicCard({ topic }: { topic: SyllabusTopic }) {
  const href = topic.linkedVisualization.available ? `${topic.linkedVisualization.route}${topic.linkedVisualization.section ? `#${topic.linkedVisualization.section}` : ""}` : `/syllabus#${topic.id}`;
  const conceptLabId = (concept: string) => topic.classLevel === "Engineering" ? engineeringConceptLabId(topic.id, concept) : syllabusConceptLabId(topic.id, concept);

  return (
    <article id={topic.id} className="glass-card flex min-h-[360px] scroll-mt-24 flex-col rounded-2xl p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mini-chip">{topic.classLevel}</span>
        <span className="mini-chip">{topic.unit}</span>
        <TopicStatusBadge status={topic.status} />
      </div>
      <h3 className="mt-4 text-xl font-bold">{topic.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{topic.description}</p>
      <div className="mt-4">
        <ConceptImagePanel title={topic.title} text={`${topic.unit} ${topic.description} ${topic.concepts.join(" ")} ${topic.keyFormulas.join(" ")}`} compact />
      </div>
      <div className="mt-4">
        <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Interactive Concept Tools</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {topic.concepts.slice(0, 5).map((concept, index) => (
            <Link key={`${concept}-${index}`} to={`/syllabus-lab/${conceptLabId(concept)}`} className="mini-chip gap-1.5 transition hover:border-cyan-300 hover:bg-cyan-100 hover:text-cyan-900 dark:hover:bg-cyan-300/15">
              <ConceptIconBadge text={`${topic.title} ${concept}`} className="h-5 w-5 [&_svg]:h-3 [&_svg]:w-3" />
              {concept}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-100 p-3 dark:bg-white/10">
        <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Key Formulas</p>
        <ul className="mt-2 space-y-2 text-xs leading-5">
          {topic.keyFormulas.slice(0, 3).map((formula, index) => (
            <li key={`${formula}-${index}`} className="flex items-start gap-2">
              <ConceptIconBadge text={`${topic.title} ${formula}`} className="mt-0.5 h-5 w-5 [&_svg]:h-3 [&_svg]:w-3" />
              <span className="min-w-0 break-words font-semibold"><MathExpression value={formula} /></span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300"><span className="font-semibold">Suggested visual:</span> {topic.recommendedVisualization}</p>
      {topic.linkedVisualization.available && topic.linkedVisualization.isExternal ? (
        <a href={href} className="action-primary mt-auto w-full">{topic.linkedVisualization.label}</a>
      ) : topic.linkedVisualization.available ? (
        <Link to={href} className="action-primary mt-auto w-full">{topic.linkedVisualization.label}</Link>
      ) : (
        <Link to={href} className="action-secondary mt-auto w-full">View Concept Card</Link>
      )}
    </article>
  );
}
