import { Box, BrainCircuit, Camera, Gamepad2, Image, Network, Rotate3D, ScanSearch } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard";

const apps = [
  ["Neural networks", BrainCircuit, "Layers are matrix operations followed by nonlinear decisions."],
  ["Computer graphics", Box, "Transforms move, rotate, and project 3D objects."],
  ["Robotics", Rotate3D, "Robot joints use matrices to compose motion."],
  ["Data compression", Network, "Large data can be represented by fewer basis directions."],
  ["PCA", ScanSearch, "Principal components find high-variance directions."],
  ["Image processing", Image, "Pixels and filters are arrays and linear transforms."],
  ["Game physics", Gamepad2, "Vectors track position, velocity, force, and collision."],
  ["3D transformations", Camera, "Camera pipelines depend on matrix multiplication."],
] as const;

export default function LinearAlgebraApplications() {
  return (
    <SectionCard title="Linear Algebra Applications">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {apps.map(([title, Icon, text]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <Icon className="h-6 w-6 text-cyan-500" />
            <h3 className="mt-3 font-bold">{title}</h3>
            <div className="my-3 grid grid-cols-3 gap-1">
              {[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ opacity: 0.35 + i * 0.1 }} />)}
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
