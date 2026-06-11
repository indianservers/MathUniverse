import ApplicationVisualCard, { ApplicationVisualKind } from "../../components/ui/ApplicationVisualCard";
import SectionCard from "../../components/ui/SectionCard";

const apps = [
  { title: "Neural networks", visual: "neural-network", text: "Layers are matrix operations followed by nonlinear decisions.", meta: "weighted layers" },
  { title: "Computer graphics", visual: "computer-graphics", text: "Transforms move, rotate, and project 3D objects.", meta: "render pipeline" },
  { title: "Robotics", visual: "robotics", text: "Robot joints use matrices to compose motion.", meta: "joint chains" },
  { title: "Data compression", visual: "data-compression", text: "Large data can be represented by fewer basis directions.", meta: "low rank" },
  { title: "PCA", visual: "pca", text: "Principal components find high-variance directions.", meta: "basis change" },
  { title: "Image processing", visual: "image-processing", text: "Pixels and filters are arrays and linear transforms.", meta: "filters" },
  { title: "Game physics", visual: "game-physics", text: "Vectors track position, velocity, force, and collision.", meta: "motion vectors" },
  { title: "3D transformations", visual: "transform-3d", text: "Camera pipelines depend on matrix multiplication.", meta: "camera math" },
] satisfies { title: string; visual: ApplicationVisualKind; text: string; meta: string }[];

export default function LinearAlgebraApplications() {
  return (
    <SectionCard title="Linear Algebra Applications">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {apps.map((app) => <ApplicationVisualCard key={app.title} title={app.title} description={app.text} visual={app.visual} meta={app.meta} />)}
      </div>
    </SectionCard>
  );
}
