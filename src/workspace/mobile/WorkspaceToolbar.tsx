import type { ReactNode } from "react";

export type WorkspaceToolbarItem = {
  id: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  active?: boolean;
  pressed?: boolean;
  onSelect: () => void;
};

export default function WorkspaceToolbar({
  label,
  items,
}: {
  label: string;
  items: WorkspaceToolbarItem[];
}) {
  return (
    <nav onPointerDownCapture={event=>{const button=(event.target as HTMLElement).closest("button");if(button?.disabled)window.dispatchEvent(new CustomEvent("mws-unavailable",{detail:button.textContent?.includes("Delete")?"Select an object before deleting it.":"This action is unavailable until there is a change to undo or redo."}));}} className="mws-toolbar" aria-label={label} data-mws-toolbar="true">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          title={item.label}
          className={[
            item.danger ? "is-danger" : "",
            item.active ? "is-active" : "",
            item.pressed ? "is-open" : "",
          ]
            .filter(Boolean)
            .join(" ") || undefined}
          aria-pressed={item.pressed ?? item.active ?? false}
          data-tool-state={
            item.active ? "mode" : item.pressed ? "open" : "idle"
          }
          onClick={item.onSelect}
        >
          <span className="mws-toolbar-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
