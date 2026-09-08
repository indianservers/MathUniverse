import { useId, type ReactNode } from "react";
import "./lessonGraph.css";

export type LessonGraphLegendItem = { id: string; label: ReactNode; color: string; dashed?: boolean; kind?: 'line'|'point'|'region' };
export type LessonGraphNavigation = { zoomIn: () => void; zoomOut: () => void; reset: () => void; canZoomIn?: boolean; canZoomOut?: boolean };

/** Shared chrome only. Each adapter owns its coordinate system and lesson data. */
export function LessonGraphWorkspace({ title, description, legend = [], navigation, controls, observation, children }: {
  title: string;
  description?: ReactNode;
  legend?: LessonGraphLegendItem[];
  navigation?: LessonGraphNavigation;
  controls?: ReactNode;
  observation?: ReactNode;
  children: ReactNode;
}) {
  const id = useId();
  return <section className="lesson-graph-workspace" aria-labelledby={`${id}-title`} data-lesson-graph-workspace>
    <header className="lesson-graph-heading">
      <div><h3 id={`${id}-title`}>{title}</h3>{description && <p>{description}</p>}</div>
      {navigation && <LessonGraphToolbar navigation={navigation} />}
    </header>
    {legend.length > 0 && <LessonGraphLegend items={legend} />}
    {controls && <div className="lesson-graph-controls">{controls}</div>}
    <div className="lesson-graph-stage">{children}</div>
    {observation && <div className="lesson-graph-observation">{observation}</div>}
  </section>;
}

export function LessonGraphLegend({ items }: { items: LessonGraphLegendItem[] }) {
  return <ul className="lesson-graph-legend" aria-label="Graph legend">{items.map(item => <li key={item.id}>
    <span className="lesson-graph-swatch" data-kind={item.kind??'line'} style={{ color:item.color, borderColor: item.color, borderStyle: item.dashed ? "dashed" : "solid" }} aria-hidden="true" />
    <span>{item.label}</span>
  </li>)}</ul>;
}

export function LessonGraphToolbar({ navigation }: { navigation: LessonGraphNavigation }) {
  return <div className="lesson-graph-toolbar" role="group" aria-label="Graph view controls">
    <button type="button" onClick={navigation.zoomIn} disabled={navigation.canZoomIn === false} aria-label="Zoom graph in">＋<span>Zoom in</span></button>
    <button type="button" onClick={navigation.zoomOut} disabled={navigation.canZoomOut === false} aria-label="Zoom graph out">−<span>Zoom out</span></button>
    <button type="button" onClick={navigation.reset} aria-label="Reset graph view">↺<span>Reset view</span></button>
  </div>;
}
