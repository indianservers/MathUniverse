import { ArrowRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { MathText } from "../../components/ui/MathExpression";
import type { VisualProof } from "../data/proofTypes";
import GeometryProofThumbnail from "./GeometryProofThumbnail";

type ProofCardProps = {
  proof: VisualProof;
};

export default function ProofCard({ proof }: ProofCardProps) {
  const available = proof.status === "available";

  return (
    <article className="flex min-h-[230px] flex-col justify-between rounded-xl border border-slate-200 bg-white/88 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
      <div>
        <GeometryProofThumbnail thumbnailKey={proof.thumbnailKey} />
        <div className="flex flex-wrap items-center gap-2">
          <span className={available ? "mini-chip bg-emerald-100 text-emerald-800 dark:bg-emerald-300/20 dark:text-emerald-100" : "mini-chip"}>
            {available ? "Available" : "Planned proof"}
          </span>
          <span className="mini-chip">{proof.difficulty}</span>
          <span className="mini-chip inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {proof.estimatedTime}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-black text-slate-950 dark:text-white">
          <MathText value={proof.title} />
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{proof.shortDescription}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {proof.tags.slice(0, 5).map((tag) => (
            <span key={tag} className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-800 dark:bg-cyan-300/10 dark:text-cyan-100">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <Link
        to={proof.route}
        className={available ? "action-primary mt-4 w-fit rounded-xl" : "action-secondary mt-4 w-fit rounded-xl"}
        aria-label={`${available ? "Open proof" : "Open planned proof route"}: ${proof.title}`}
      >
        {available ? "Open Proof" : "Open Roadmap"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
