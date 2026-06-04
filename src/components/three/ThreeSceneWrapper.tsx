import { Canvas } from "@react-three/fiber";
import { clsx } from "clsx";
import { Component, CSSProperties, ReactNode, Suspense } from "react";
import { LoadingSkeleton } from "../ui/UiFeedback";

type ThreeSceneWrapperProps = {
  children: ReactNode;
  height?: string;
  mobileHeight?: string;
  interactionLabel?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  showHint?: boolean;
  defaultLights?: boolean;
  className?: string;
  quality?: "standard" | "high";
};

function ThreeFallback() {
  return (
    <div className="h-full rounded-xl bg-slate-950/70 p-4 text-cyan-100">
      <LoadingSkeleton label="Loading 3D scene..." />
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

export default function ThreeSceneWrapper({
  children,
  height = "420px",
  mobileHeight = "min(72vh, 420px)",
  interactionLabel = "Drag rotate - pinch zoom",
  cameraPosition = [3, 3, 5],
  fov = 50,
  showHint = true,
  defaultLights = true,
  className,
  quality = "standard",
}: ThreeSceneWrapperProps) {
  const style = {
    "--scene-height": height,
    "--scene-mobile-height": mobileHeight,
  } as CSSProperties;

  return (
    <div
      className={clsx(
        "relative h-[var(--scene-mobile-height)] overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-950 shadow-inner shadow-cyan-950/30 touch-none sm:h-[var(--scene-height)]",
        className
      )}
      style={style}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_25%_15%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(167,139,250,0.12),transparent_30%)]" />
      {showHint && (
        <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-slate-950/75 px-3 py-1.5 text-[11px] font-bold text-cyan-100 shadow-lg shadow-black/20 backdrop-blur">
          {interactionLabel}
        </div>
      )}
      <ThreeErrorBoundary>
        <Suspense fallback={<ThreeFallback />}>
          <Canvas
            camera={{ position: cameraPosition, fov }}
            dpr={quality === "high" ? [1, 2] : [1, 1.5]}
            gl={{ antialias: quality === "high", alpha: true }}
            shadows
          >
            {defaultLights && (
              <>
                <hemisphereLight args={["#e0f2fe", "#0f172a", 0.45]} />
                <directionalLight position={[5, 7, 6]} intensity={0.85} castShadow />
              </>
            )}
            {children}
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  );
}
