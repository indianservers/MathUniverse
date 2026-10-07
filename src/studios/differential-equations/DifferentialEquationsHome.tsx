import CinematicHero from "../heroes/CinematicHero";
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BookOpen, ChartNoAxesCombined, ChevronRight,
  Cog, FileText, FlaskConical, GitBranch,
  Goal, Search, Sigma, Sparkles, Trophy, Waves,
  type LucideIcon,
} from "lucide-react";
import type { StudioMockupDefinition } from "../mockup/studioMockupCatalog";
import MathExpression from "../../components/ui/MathExpression";
import DifferentialEquationsArtwork from "./DifferentialEquationsArtwork";
import { differentialEquationRouteFor } from "./routes";
import "./differentialEquations.css";

type Feature = {
  title: string;
  detail: string;
  href?: string;
  action?: "formulas" | "practice";
  icon: LucideIcon;
  artId?: string;
  tone: string;
};

const features: Feature[] = [
  { title: "Equation Explorer", detail: "Classify order, linearity and understand solutions", href: "/differential-equations/equation-explorer", icon: Search, artId: "explorer", tone: "blue" },
  { title: "Direction Fields", detail: "Visualize slope fields and solution curves", href: "/differential-equations/direction-fields", icon: Sparkles, artId: "slope-fields", tone: "green" },
  { title: "Initial Value Problems", detail: "Use an initial point to find a solution", href: "/differential-equations/initial-value", icon: Goal, artId: "initial-value", tone: "orange" },
  { title: "Method Selector", detail: "Find the best method for a given equation", href: "/differential-equations/method-selector", icon: Cog, artId: "method-selector", tone: "purple" },
  { title: "First-Order Equations", detail: "Separable, Linear, Exact, Bernoulli and more", href: "/differential-equations/separable", icon: Waves, artId: "separable", tone: "pink" },
  { title: "Higher-Order Equations", detail: "Solve and explore advanced equations", href: "/differential-equations/higher-order-linear", icon: Sigma, artId: "higher-order-linear", tone: "mint" },
  { title: "Systems & Trajectories", detail: "Phase plane, eigenvalues and stability", href: "/differential-equations/systems", icon: GitBranch, artId: "systems", tone: "yellow" },
  { title: "Numerical Methods", detail: "Euler, Improved Euler, Runge–Kutta, and more", href: "/differential-equations/euler", icon: ChartNoAxesCombined, artId: "rk4", tone: "indigo" },
  { title: "Engineering Models", detail: "Real-world applications and simulations", href: "/differential-equations/oscillations", icon: Cog, artId: "mechanical-oscillations", tone: "jade" },
  { title: "Calculus DE Page", detail: "Original Calculus differential equations", href: "/calculus/differential-equations", icon: BookOpen, tone: "rose" },
  { title: "Formula Sheet", detail: "Key formulas at a glance", action: "formulas", icon: FileText, tone: "sky" },
  { title: "Practice & Quizzes", detail: "Test your understanding", action: "practice", icon: Trophy, tone: "peach" },
];

const labGroups = [
  { title: "Foundations", ids: ["explorer", "slope-fields", "initial-value", "method-selector"] },
  { title: "First-order equations", ids: ["separable", "homogeneous-first-order", "exact", "linear-first-order", "bernoulli", "growth-models"] },
  { title: "Numerical methods", ids: ["euler", "heun", "rk4"] },
  { title: "Higher-order equations", ids: ["higher-order-linear", "undetermined-coefficients", "variation-of-parameters", "cauchy-euler"] },
  { title: "Systems and trajectories", ids: ["systems", "phase-plane"] },
  { title: "Transforms, boundary values and PDEs", ids: ["laplace", "boundary-values", "pde"] },
  { title: "Engineering models", ids: ["mechanical-oscillations", "lcr-circuit", "newton-cooling"] },
];

const labTones = ["blue", "green", "orange", "purple", "pink", "mint", "yellow", "indigo", "jade", "rose", "sky", "peach"];

const formulas = [
  { label: "Separable", tex: "\\frac{dy}{dx}=g(x)h(y)\\quad\\Rightarrow\\quad\\int\\frac{dy}{h(y)}=\\int g(x)\\,dx+C" },
  { label: "Linear first-order", tex: "y'+P(x)y=Q(x),\\qquad\\mu(x)=e^{\\int P(x)\\,dx}" },
  { label: "Bernoulli", tex: "y'+P(x)y=Q(x)y^n,\\qquad v=y^{1-n}" },
  { label: "Exact", tex: "M\\,dx+N\\,dy=0,\\qquad M_y=N_x" },
  { label: "Euler", tex: "y_{n+1}=y_n+h f(x_n,y_n)" },
  { label: "RK4", tex: "y_{n+1}=y_n+\\frac{h}{6}(k_1+2k_2+2k_3+k_4)" },
];

const quiz = [
  { question: "What is the order of y'' + 3y' + 2y = 0?", choices: ["First", "Second", "Third"], answer: 1, note: "The highest derivative is y'', so the order is 2." },
  { question: "Which test identifies an exact first-order equation?", choices: ["Mᵧ = Nₓ", "M = N", "y' = 0"], answer: 0, note: "Exactness requires the two indicated partial derivatives to agree." },
  { question: "How many slope evaluations does one RK4 step use?", choices: ["One", "Two", "Four"], answer: 2, note: "RK4 combines four slopes, k₁ through k₄." },
];

function FeatureCard({ feature, number, onAction }: { feature: Feature; number: number; onAction: (action: "formulas" | "practice") => void }) {
  const Icon = feature.icon;
  const content = <>
    <span className="de-feature-art">{feature.artId ? <DifferentialEquationsArtwork id={feature.artId} /> : <Icon size={58} strokeWidth={1.85} aria-hidden="true" />}</span>
    <span className="de-feature-copy"><strong>{number <= 10 ? `${number}. ` : ""}{feature.title}</strong><small>{feature.detail}</small></span>
    <span className="de-feature-arrow"><ChevronRight size={17} /></span>
  </>;
  return feature.href ? <Link className={`de-feature-card tone-${feature.tone}`} to={feature.href}>{content}</Link> : <button type="button" className={`de-feature-card tone-${feature.tone}`} onClick={() => onAction(feature.action!)}>{content}</button>;
}

function HomeDialog({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="de-dialog-layer" role="presentation" onMouseDown={onClose}>
    <section className="de-dialog de-home-dialog" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
      <button className="de-dialog-close" onClick={onClose} aria-label="Close"><span aria-hidden="true">×</span></button>
      <h2>{title}</h2>{children}
    </section>
  </div>;
}

export default function DifferentialEquationsHome({ studio }: { studio: StudioMockupDefinition }) {
  const [panel, setPanel] = useState<"formulas" | "practice" | null>(null);
  const [question, setQuestion] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const labs = new Map(studio.pages.map((item) => [item.id, item]));

  return <div className="de-home">
    <CinematicHero id="differential-equations" />

    <div className="de-feature-grid" aria-label="Explore Differential Equations Studio">
      {features.map((feature, index) => <FeatureCard key={feature.title} feature={feature} number={index + 1} onAction={setPanel} />)}
    </div>

    <section className="de-all-labs" aria-label="All interactive labs">
      <div className="de-section-heading"><div><span>DEEPER EXPLORATION</span><h2>All interactive labs</h2><p>Choose a method or model and change its controls to see the result.</p></div><FlaskConical size={28} /></div>
      <div className="de-lab-groups">{labGroups.map((group, groupIndex) => <section key={group.title}><h3>{group.title}</h3><div className="de-lab-card-grid">{group.ids.map((id, itemIndex) => { const lab = labs.get(id); if (!lab) return null; const tone = labTones[(groupIndex * 4 + itemIndex) % labTones.length]; return <Link key={id} className={`de-lab-card tone-${tone}`} to={differentialEquationRouteFor(id)} data-lab-id={id}>
        <span className="de-lab-card-art"><DifferentialEquationsArtwork id={id} /></span>
        <strong>{lab.label}</strong><small>{lab.description}</small><span className="de-lab-card-cta">Open lab <ArrowRight size={15} /></span>
      </Link>; })}</div></section>)}</div>
    </section>

    {panel === "formulas" && <HomeDialog title="Differential Equations Formula Sheet" onClose={() => setPanel(null)}><p>Keep these structural tests and numerical rules close as you work through the labs.</p><div className="de-formula-list">{formulas.map((item) => <div key={item.label}><strong>{item.label}</strong><MathExpression value={item.tex} /></div>)}</div><Link className="de-dialog-link" to="/differential-equations/method-selector" onClick={() => setPanel(null)}>Choose a method <ArrowRight size={16} /></Link></HomeDialog>}
    {panel === "practice" && <HomeDialog title="Practice & Quizzes" onClose={() => setPanel(null)}><div className="de-quiz"><p className="de-quiz-count">QUESTION {question + 1} OF {quiz.length}</p><h3>{quiz[question].question}</h3><div className="de-quiz-options">{quiz[question].choices.map((option, index) => <button key={option} type="button" className={choice === index ? (index === quiz[question].answer ? "correct" : "incorrect") : ""} onClick={() => setChoice(index)}>{option}</button>)}</div>{choice !== null && <p role="status" className="de-quiz-feedback">{choice === quiz[question].answer ? "Correct. " : "Try again. "}{quiz[question].note}</p>}<button className="de-dialog-link" type="button" onClick={() => { setQuestion((value) => (value + 1) % quiz.length); setChoice(null); }}>Next question <ArrowRight size={16} /></button></div></HomeDialog>}
  </div>;
}
