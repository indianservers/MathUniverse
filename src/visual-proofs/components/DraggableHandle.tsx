import { Move } from "lucide-react";
import { useDragValue, type DragAxis, type DragPoint } from "../hooks/useDragValue";

type DraggableHandleProps = {
  position: DragPoint;
  axis?: DragAxis;
  bounds?: { x?: [number, number]; y?: [number, number] };
  step?: number;
  keyboardStep?: number;
  snapToGrid?: number;
  label: string;
  disabled?: boolean;
  onChange: (position: DragPoint) => void;
};

export function DraggableHandle(props: DraggableHandleProps) {
  const { dragging, dragProps } = useDragValue(props);
  return (
    <g
      {...dragProps}
      role="slider"
      tabIndex={props.disabled ? -1 : 0}
      aria-label={props.label}
      aria-disabled={props.disabled}
      className={props.disabled ? "cursor-not-allowed" : "cursor-grab focus:outline-none"}
    >
      <circle cx={props.position.x} cy={props.position.y} r="15" fill={dragging ? "#fde68a" : "#f8fafc"} stroke="#0f172a" strokeWidth="3" />
      <circle cx={props.position.x} cy={props.position.y} r="8" fill="#7c3aed" stroke="#f8fafc" strokeWidth="2" />
      <foreignObject x={props.position.x - 8} y={props.position.y - 8} width="16" height="16" pointerEvents="none">
        <Move className="h-4 w-4 text-white" aria-hidden="true" />
      </foreignObject>
      <text x={props.position.x} y={props.position.y - 24} textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="900">{props.label}</text>
    </g>
  );
}
