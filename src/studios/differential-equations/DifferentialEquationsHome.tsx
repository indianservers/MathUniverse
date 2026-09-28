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
import "./differentialEquations.css";

type Feature = {
  title: string;
  detail: string;
  href?: string;
  action?: "formulas" | "practice";
  icon: LucideIcon;
  tone: string;
};

const features: Feature[] = [
  { title: "Equation Explorer", detail: "Classify order, linearity and understand solutions", href: "/differential-equations/explorer", icon: Search, tone: "blue" },
  { title: "Direction Fields", detail: "Visualize slope fields and solution curves", href: "/differential-equations/slope-fields", icon: Sparkles, tone: "green" },
  { title: "Initial Value Problems", detail: "Use an initial point to find a solution", href: "/differential-equations/initial-value", icon: Goal, tone: "orange" },
  { title: "Method Selector", detail: "Find the best method for a given equation", href: "/differential-equations/method-selector", icon: Cog, tone: "purple" },
  { title: "First-Order Equations", detail: "Separable, Linear, Exact, Bernoulli and more", href: "/differential-equations/separable", icon: Waves, tone: "pink" },
  { title: "Higher-Order Equations", detail: "Solve and explore advanced equations", href: "/differential-equations/higher-order-linear", icon: Sigma, tone: "mint" },
  { title: "Systems & Trajectories", detail: "Phase plane, eigenvalues and stability", href: "/differential-equations/systems", icon: GitBranch, tone: "yellow" },
  { title: "Numerical Methods", detail: "Euler, Improved Euler, Runge–Kutta, and more", href: "/differential-equations/euler", icon: ChartNoAxesCombined, tone: "indigo" },
  { title: "Engineering Models", detail: "Real-world applications and simulations", href: "/differential-equations/mechanical-oscillations", icon: Cog, tone: "jade" },
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
  { title: "Engineering models", ids: ["mechanical-oscillations", "lcr-circuit", "newton-cooling"] },
];

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
    <span className="de-feature-art"><Icon size={58} strokeWidth={1.85} aria-hidden="true" /></span>
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
    <section className="de-hero">
      <div className="de-hero-copy"><span className="de-hero-kicker">EXPLORE · SOLVE · VISUALIZE · APPLY</span><h1>Differential Equations <em>Studio</em></h1><p>From fundamental theory to real-world applications — an interactive learning experience.</p></div>
      <div className="de-hero-art" aria-hidden="true"><svg viewBox="0 0 330 138"><defs><linearGradient id="de-wave" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#c8e2ff"/><stop offset="1" stopColor="#88afff"/></linearGradient></defs><path d="M0 119 C45 72 74 119 113 66 S190 90 229 34 S284 72 330 14" fill="none" stroke="url(#de-wave)" strokeWidth="3"/><path d="M0 132 C61 93 82 134 137 93 S221 101 261 53 S313 69 330 42" fill="none" stroke="#d8eaff" strokeWidth="2"/><text x="83" y="74">dy</text><path d="M78 82h45" stroke="#1c55ee" strokeWidth="2"/><text x="82" y="111">dx</text><text x="139" y="91">= f(x, y)</text></svg></div>
    </section>

    <div className="de-feature-grid" aria-label="Explore Differential Equations Studio">
      {features.map((feature, index) => <FeatureCard key={feature.title} feature={feature} number={index + 1} onAction={setPanel} />)}
    </div>

    <section className="de-all-labs" aria-label="All interactive labs">
      <div className="de-section-heading"><div><span>DEEPER EXPLORATION</span><h2>All interactive labs</h2><p>Choose a method or model and change its controls to see the result.</p></div><FlaskConical size={28} /></div>
      <div className="de-lab-groups">{labGroups.map((group) => <section key={group.title}><h3>{group.title}</h3><div>{group.ids.map((id) => { const lab = labs.get(id); return lab ? <Link key={id} to={lab.route}><span>{lab.label}</span><ArrowRight size={15} /></Link> : null; })}</div></section>)}</div>
    </section>

    {panel === "formulas" && <HomeDialog title="Differential Equations Formula Sheet" onClose={() => setPanel(null)}><p>Keep these structural tests and numerical rules close as you work through the labs.</p><div className="de-formula-list">{formulas.map((item) => <div key={item.label}><strong>{item.label}</strong><MathExpression value={item.tex} /></div>)}</div><Link className="de-dialog-link" to="/differential-equations/method-selector" onClick={() => setPanel(null)}>Choose a method <ArrowRight size={16} /></Link></HomeDialog>}
    {panel === "practice" && <HomeDialog title="Practice & Quizzes" onClose={() => setPanel(null)}><div className="de-quiz"><p className="de-quiz-count">QUESTION {question + 1} OF {quiz.length}</p><h3>{quiz[question].question}</h3><div className="de-quiz-options">{quiz[question].choices.map((option, index) => <button key={option} type="button" className={choice === index ? (index === quiz[question].answer ? "correct" : "incorrect") : ""} onClick={() => setChoice(index)}>{option}</button>)}</div>{choice !== null && <p role="status" className="de-quiz-feedback">{choice === quiz[question].answer ? "Correct. " : "Try again. "}{quiz[question].note}</p>}<button className="de-dialog-link" type="button" onClick={() => { setQuestion((value) => (value + 1) % quiz.length); setChoice(null); }}>Next question <ArrowRight size={16} /></button></div></HomeDialog>}
  </div>;
}
