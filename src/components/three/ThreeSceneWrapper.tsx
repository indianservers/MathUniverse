import { Canvas } from "@react-three/fiber";
import { clsx } from "clsx";
import { Component, CSSProperties, ReactNode, Suspense } from "react";
import * as THREE from "three";
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
  chrome?: "standard" | "cinematic";
  sceneLabel?: string;
  toolbar?: ReactNode;
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
  chrome = "standard",
  sceneLabel,
  toolbar,
}: ThreeSceneWrapperProps) {
  const style = {
    "--scene-height": height,
    "--scene-mobile-height": mobileHeight,
  } as CSSProperties;
  const isCinematic = chrome === "cinematic";

  return (
    <div
      className={clsx(
        "relative h-[var(--scene-mobile-height)] overflow-hidden border bg-slate-950 touch-none sm:h-[var(--scene-height)]",
        isCinematic
          ? "rounded-xl border-cyan-200/20 shadow-2xl shadow-cyan-950/30 ring-1 ring-white/5"
          : "rounded-xl border-cyan-300/20 shadow-inner shadow-cyan-950/30",
        className
      )}
      style={style}
    >
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 z-0",
          isCinematic
            ? "bg-[linear-gradient(135deg,rgba(8,47,73,0.34),transparent_36%),linear-gradient(315deg,rgba(88,28,135,0.24),transparent_34%),linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.72))]"
            : "bg-[radial-gradient(circle_at_25%_15%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(167,139,250,0.12),transparent_30%)]"
        )}
      />
      {isCinematic && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-slate-950/70 to-transparent" />
          <div className="pointer-events-none absolute inset-0 z-10 ring-1 ring-inset ring-white/5" />
        </>
      )}
      {(sceneLabel || toolbar) && (
        <div className="absolute left-3 right-3 top-3 z-20 flex flex-wrap items-start justify-between gap-2">
          {sceneLabel && (
            <div className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-cyan-100 shadow-lg shadow-black/20 backdrop-blur">
              {sceneLabel}
            </div>
          )}
          {toolbar && <div className="scene-toolbar">{toolbar}</div>}
        </div>
      )}
      {showHint && (
        <div className={clsx("pointer-events-none absolute z-10 rounded-full border border-white/10 bg-slate-950/75 px-3 py-1.5 text-[11px] font-bold text-cyan-100 shadow-lg shadow-black/20 backdrop-blur", sceneLabel || toolbar ? "bottom-3 left-3" : "left-3 top-3")}>
          {interactionLabel}
        </div>
      )}
      <ThreeErrorBoundary>
        <Suspense fallback={<ThreeFallback />}>
          <Canvas
            camera={{ position: cameraPosition, fov }}
            dpr={quality === "high" ? [1, 2] : [1, 1.5]}
            gl={{ antialias: quality === "high", alpha: true, preserveDrawingBuffer: true }}
            onCreated={({ gl }) => {
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = isCinematic ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
              gl.toneMappingExposure = isCinematic ? 1.08 : 1;
            }}
            shadows
          >
            {defaultLights && !isCinematic && (
              <>
                <hemisphereLight args={["#e0f2fe", "#0f172a", 0.45]} />
                <directionalLight position={[5, 7, 6]} intensity={0.85} castShadow />
              </>
            )}
            {defaultLights && isCinematic && (
              <>
                <ambientLight intensity={0.38} />
                <hemisphereLight args={["#dff7ff", "#050816", 0.62]} />
                <directionalLight position={[5, 8, 7]} intensity={1.25} castShadow />
                <pointLight position={[-4, 2.5, -3]} intensity={0.9} color="#22d3ee" />
                <pointLight position={[3.5, -1, 4]} intensity={0.55} color="#c084fc" />
              </>
            )}
            {children}
          </Canvas>
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  );
}
