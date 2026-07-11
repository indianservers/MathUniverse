import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProofCard from "../components/ProofCard";
import { getVisualProofCategory } from "../data/visualProofCategories";
import { getVisualProofsByCategory } from "../data/visualProofsIndex";

export default function VisualProofCategoryPage() {
  const { categorySlug = "" } = useParams();
  const category = getVisualProofCategory(categorySlug);

  if (!category) {
    return (
      <NotFoundState
        title="Category not found"
        description="This visual proof category does not exist yet. Return to the Visual Proofs hub to pick an available category."
      />
    );
  }

  const proofs = getVisualProofsByCategory(category.slug);
  const availableProofs = proofs.filter((proof) => proof.status === "available");
  const plannedProofs = proofs.filter((proof) => proof.status === "coming-soon");
  const isGeometry = category.slug === "geometry";
  const isAlgebra = category.slug === "algebraic-identities";
  const isTrigonometry = category.slug === "trigonometry";
  const isCoordinateGeometry = category.slug === "coordinate-geometry";
  const isCalculus = category.slug === "calculus";
  const isNumberTheory = category.slug === "number-theory";
  const isSequencesSeries = category.slug === "sequences-and-series";

  return (
    <div className="space-y-4">
      <Link to="/visual-proofs" className="inline-flex items-center gap-2 text-sm font-black text-cyan-700 dark:text-cyan-200">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Visual Proofs
      </Link>
      <section className="rounded-xl border border-cyan-200/30 bg-slate-950 p-5 text-white shadow-2xl shadow-cyan-950/20">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-200">Visual Proof Category</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">{category.title}</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-cyan-50/75">{category.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950">{category.difficultyRange}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-cyan-50">{category.targetAudience}</span>
        </div>
      </section>

      {isGeometry ? (
        <>
          <ProofSection title="Featured Geometry Proofs" emptyText="No featured geometry proofs yet." proofs={availableProofs.slice(0, 4)} />
          <ProofSection title="Beginner Proofs" emptyText="No beginner geometry proofs yet." proofs={availableProofs.filter((proof) => proof.difficulty === "Beginner")} />
          <ProofSection title="Intermediate Proofs" emptyText="No intermediate geometry proofs yet." proofs={availableProofs.filter((proof) => proof.difficulty === "Intermediate")} />
          <ProofSection title="Circle Proofs" emptyText="No circle proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("circle"))} />
          <ProofSection title="Area Formula Proofs" emptyText="No area formula proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("area"))} />
          <ProofSection title="Angle Theorem Proofs" emptyText="No angle theorem proofs yet." proofs={availableProofs.filter((proof) => proof.tags.some((tag) => tag.includes("angle")))} />
          <ProofSection title="All Geometry Proofs" emptyText="No geometry proofs yet." proofs={availableProofs} />
        </>
      ) : isAlgebra ? (
        <>
          <ProofSection title="Featured Algebra Proofs" emptyText="No featured algebra proofs yet." proofs={availableProofs.slice(0, 4)} />
          <ProofSection title="Beginner Identities" emptyText="No beginner algebra proofs yet." proofs={availableProofs.filter((proof) => proof.difficulty === "Beginner")} />
          <ProofSection title="Area Model Proofs" emptyText="No area model proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("area model"))} />
          <ProofSection title="Factorization Proofs" emptyText="No factorization proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("factorization"))} />
          <ProofSection title="Perfect Square Proofs" emptyText="No perfect square proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("perfect square"))} />
          <ProofSection title="Advanced Identities" emptyText="No advanced algebra identities yet." proofs={availableProofs.filter((proof) => proof.difficulty === "Intermediate")} />
          <ProofSection title="All Algebraic Identity Proofs" emptyText="No algebraic identity proofs yet." proofs={availableProofs} />
        </>
      ) : isTrigonometry ? (
        <>
          <ProofSection title="Featured Trigonometry Proofs" emptyText="No featured trigonometry proofs yet." proofs={availableProofs.slice(0, 4)} />
          <ProofSection title="Beginner Trig Ratio Proofs" emptyText="No beginner trig ratio proofs yet." proofs={availableProofs.filter((proof) => proof.difficulty === "Beginner" && (proof.tags.includes("right triangle") || proof.tags.includes("ratios")))} />
          <ProofSection title="Unit Circle Proofs" emptyText="No unit circle proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("unit circle"))} />
          <ProofSection title="Identity Proofs" emptyText="No identity proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("identity"))} />
          <ProofSection title="Radian and Arc Proofs" emptyText="No radian or arc proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("radians") || proof.tags.includes("arc") || proof.tags.includes("arc length"))} />
          <ProofSection title="Triangle Law Proofs" emptyText="No triangle law proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("triangle law") || proof.tags.includes("triangle area"))} />
          <ProofSection title="Graph and Function Proofs" emptyText="No graph proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("graph"))} />
          <ProofSection title="Advanced Trigonometry Proofs" emptyText="No advanced trigonometry proofs yet." proofs={availableProofs.filter((proof) => proof.difficulty === "Advanced")} />
          <ProofSection title="All Trigonometry Proofs" emptyText="No trigonometry proofs yet." proofs={availableProofs} />
        </>
      ) : isCoordinateGeometry ? (
        <>
          <ProofSection title="Featured Coordinate Proofs" emptyText="No featured coordinate proofs yet." proofs={availableProofs.slice(0, 4)} />
          <ProofSection title="Beginner Grid Proofs" emptyText="No beginner grid proofs yet." proofs={availableProofs.filter((proof) => proof.difficulty === "Beginner" && proof.tags.includes("grid"))} />
          <ProofSection title="Distance and Slope Proofs" emptyText="No distance or slope proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("distance") || proof.tags.includes("slope"))} />
          <ProofSection title="Line Equation Proofs" emptyText="No line equation proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("line equation"))} />
          <ProofSection title="Circle Proofs" emptyText="No circle proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("circle"))} />
          <ProofSection title="Transformation Proofs" emptyText="No transformation proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("transformation"))} />
          <ProofSection title="Area and Determinant Proofs" emptyText="No area or determinant proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("area") || proof.tags.includes("determinant"))} />
          <ProofSection title="All Coordinate Geometry Proofs" emptyText="No coordinate geometry proofs yet." proofs={availableProofs} />
        </>
      ) : isCalculus ? (
        <>
          <ProofSection title="Featured Calculus Proofs" emptyText="No featured calculus proofs yet." proofs={availableProofs.slice(0, 4)} />
          <ProofSection title="Limits and Continuity Proofs" emptyText="No limits proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("limit") || proof.tags.includes("continuity"))} />
          <ProofSection title="Derivative Proofs" emptyText="No derivative proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("derivative") || proof.tags.includes("tangent"))} />
          <ProofSection title="Differentiation Rules" emptyText="No differentiation rule proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("differentiation rules") || proof.tags.includes("power rule") || proof.tags.includes("product rule") || proof.tags.includes("chain rule"))} />
          <ProofSection title="Integral and Area Proofs" emptyText="No integral proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("integral") || proof.tags.includes("area"))} />
          <ProofSection title="Theorem Proofs" emptyText="No theorem proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("theorem") || proof.tags.includes("fundamental theorem"))} />
          <ProofSection title="Series and Approximation Proofs" emptyText="No series proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("series") || proof.tags.includes("approximation"))} />
          <ProofSection title="Optimization Proofs" emptyText="No optimization proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("optimization"))} />
          <ProofSection title="All Calculus Visual Proofs" emptyText="No calculus proofs yet." proofs={availableProofs} />
        </>
      ) : isNumberTheory ? (
        <>
          <ProofSection title="Featured Number Theory Proofs" emptyText="No featured number theory proofs yet." proofs={availableProofs.slice(0, 4)} />
          <ProofSection title="Divisibility Proofs" emptyText="No divisibility proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("divisibility") || proof.tags.includes("parity") || proof.tags.includes("digit sum"))} />
          <ProofSection title="Prime and Composite Proofs" emptyText="No prime or composite proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("prime") || proof.tags.includes("composite") || proof.tags.includes("prime factorization"))} />
          <ProofSection title="Modular Arithmetic Proofs" emptyText="No modular arithmetic proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("modular arithmetic") || proof.tags.includes("clock") || proof.tags.includes("cycles"))} />
          <ProofSection title="GCD/LCM Proofs" emptyText="No GCD or LCM proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("gcd") || proof.tags.includes("lcm") || proof.tags.includes("euclidean algorithm"))} />
          <ProofSection title="Irrationality and Contradiction Proofs" emptyText="No contradiction proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("contradiction") || proof.tags.includes("irrationality"))} />
          <ProofSection title="All Number Theory Proofs" emptyText="No number theory proofs yet." proofs={availableProofs} />
        </>
      ) : isSequencesSeries ? (
        <>
          <ProofSection title="Featured Sequence Proofs" emptyText="No featured sequence proofs yet." proofs={availableProofs.slice(0, 4)} />
          <ProofSection title="Arithmetic Progression Proofs" emptyText="No arithmetic progression proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("arithmetic progression"))} />
          <ProofSection title="Geometric Progression Proofs" emptyText="No geometric progression proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("geometric progression") || proof.tags.includes("geometric series"))} />
          <ProofSection title="Finite Sum Proofs" emptyText="No finite sum proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("finite sum"))} />
          <ProofSection title="Infinite Series and Convergence Proofs" emptyText="No infinite series proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("infinite series") || proof.tags.includes("convergence") || proof.tags.includes("divergence"))} />
          <ProofSection title="Fibonacci and Pascal Proofs" emptyText="No Fibonacci or Pascal proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("fibonacci") || proof.tags.includes("pascal triangle") || proof.tags.includes("binomial coefficients"))} />
          <ProofSection title="Induction Proofs" emptyText="No induction proofs yet." proofs={availableProofs.filter((proof) => proof.tags.includes("induction"))} />
          <ProofSection title="All Sequences and Series Proofs" emptyText="No sequence and series proofs yet." proofs={availableProofs} />
        </>
      ) : (
        <>
          <ProofSection title="Available proofs" emptyText="No available proofs in this category yet." proofs={availableProofs} />
          <ProofSection title="Planned proofs" emptyText="No roadmap proof cards are queued for this category yet." proofs={plannedProofs} />
        </>
      )}
    </div>
  );
}

function ProofSection({ title, emptyText, proofs }: { title: string; emptyText: string; proofs: ReturnType<typeof getVisualProofsByCategory> }) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{proofs.length} proof{proofs.length === 1 ? "" : "s"}</p>
      </div>
      {proofs.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {proofs.map((proof) => (
            <ProofCard key={proof.id} proof={proof} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm font-bold text-slate-500 dark:border-white/15 dark:text-slate-400">
          {emptyText}
        </div>
      )}
    </section>
  );
}

function NotFoundState({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/88 p-6 dark:border-white/10 dark:bg-white/[0.05]">
      <h1 className="text-2xl font-black text-slate-950 dark:text-white">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
      <Link to="/visual-proofs" className="action-primary mt-4 rounded-xl">
        Open Visual Proofs
      </Link>
    </section>
  );
}
