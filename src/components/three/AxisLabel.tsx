import { Text } from "@react-three/drei";

type AxisLabelProps = {
  position: [number, number, number];
  label: string;
  color?: string;
};

export default function AxisLabel({ position, label, color = "#67e8f9" }: AxisLabelProps) {
  return (
    <Text position={position} fontSize={0.22} color={color} anchorX="center" anchorY="middle">
      {label}
    </Text>
  );
}
