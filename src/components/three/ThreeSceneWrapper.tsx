import { Canvas } from "@react-three/fiber";
import { Component, CSSProperties, ReactNode, Suspense } from "react";

type ThreeSceneWrapperProps = {
  children: ReactNode;
  height?: string;
  mobileHeight?: string;
  interactionLabel?: string;
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

export default function ThreeSceneWrapper({ children, height = "420px", mobileHeight = "min(72vh, 420px)", interactionLabel = "Drag rotate • pinch zoom" }: ThreeSceneWrapperProps) {
  const style = {
    "--scene-height": height,
    "--scene-mobile-height": mobileHeight,
  } as CSSProperties;

  return (
    <div className="relative h-[var(--scene-mobile-height)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 touch-none sm:h-[var(--scene-height)]" style={style}>
      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-slate-950/75 px-3 py-1.5 text-[11px] font-bold text-cyan-100 shadow-lg shadow-black/20">
        {interactionLabel}
      </div>
      <ThreeErrorBoundary>
        <Suspense fallback={<ThreeFallback />}>
          <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>{children}</Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  );
}
