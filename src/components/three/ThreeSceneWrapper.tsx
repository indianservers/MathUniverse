import { Canvas } from "@react-three/fiber";
import { Component, ReactNode, Suspense } from "react";

type ThreeSceneWrapperProps = {
  children: ReactNode;
  height?: string;
};

function ThreeFallback() {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl bg-slate-950/70 text-sm text-cyan-100">
      Loading 3D scene...
    </div>
  );
}

class ThreeErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <ThreeFallback />;
    return this.props.children;
  }
}

export default function ThreeSceneWrapper({ children, height = "420px" }: ThreeSceneWrapperProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950" style={{ height }}>
      <ThreeErrorBoundary>
        <Suspense fallback={<ThreeFallback />}>
          <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>{children}</Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  );
}
