import { Html } from "@react-three/drei";
import type { Text } from "@react-three/drei";
import type { ComponentProps } from "react";
import { Color } from "three";

type LabelProps = ComponentProps<typeof Text>;

// Scene positions use world units; readable captions use screen pixels.
// Html follows the same 3D anchor without changing the scene's geometry.
export default function LessonSceneLabel({
  children,
  position,
  rotation,
  color = "#fff",
  fontSize = 0.25,
  fontWeight = 600,
}: LabelProps) {
  const cssColor = typeof color === "string" ? color
    : color instanceof Color ? color.getStyle()
    : typeof color === "number" ? new Color(color).getStyle() : "#fff";
  return (
    <Html position={position} rotation={rotation} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <span
        data-lesson-scene-label
        style={{
          color: cssColor,
          fontSize: Math.max(12, Math.min(24, fontSize * 48)),
          fontWeight,
          lineHeight: 1.25,
          whiteSpace: "nowrap",
          textShadow: "0 1px 3px rgba(0,0,0,.85)",
          pointerEvents: "none",
        }}
      >{children}</span>
    </Html>
  );
}
