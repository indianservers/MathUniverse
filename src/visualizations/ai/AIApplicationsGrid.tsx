import ApplicationVisualCard, { ApplicationVisualKind } from "../../components/ui/ApplicationVisualCard";
import SectionCard from "../../components/ui/SectionCard";

const cards = [
  { title: "Neural networks", visual: "neural-network", math: "Weighted sums and activations", use: "Pattern recognition" },
  { title: "Gradient descent", visual: "gradient-descent", math: "Derivatives and optimization", use: "Model training" },
  { title: "Signal processing", visual: "signal-processing", math: "Waves and frequency", use: "Audio and sensors" },
  { title: "Image compression", visual: "data-compression", math: "Matrices and approximations", use: "Storage and streaming" },
  { title: "GPS", visual: "gps", math: "Geometry and triangulation", use: "Navigation" },
  { title: "Cryptography", visual: "cryptography", math: "Modular arithmetic", use: "Secure communication" },
  { title: "Robotics", visual: "robotics", math: "Graphs and vectors", use: "Autonomous motion" },
  { title: "Computer graphics", visual: "computer-graphics", math: "Linear algebra", use: "Rendering" },
  { title: "Radar systems", visual: "radar", math: "Waves and timing", use: "Detection" },
  { title: "Medical imaging", visual: "medical-imaging", math: "Transforms and statistics", use: "Diagnostics" },
] satisfies { title: string; visual: ApplicationVisualKind; math: string; use: string }[];

export default function AIApplicationsGrid() {
  return (
    <SectionCard title="AI and Real-Life Applications">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <ApplicationVisualCard key={card.title} title={card.title} description={card.math} visual={card.visual} meta={card.use} compact />
        ))}
      </div>
    </SectionCard>
  );
}
