import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  API_NAMES,
  EMBED_KINDS,
  createApi,
  defaultScene,
  embed,
  iframeSnippet,
  isEmbedKind,
  normalizeScene,
  scriptSnippet,
  type EmbedKind,
  type EmbedObject,
  type EmbedScene,
} from "../embed/engine";
import "./EmbedDesigner.css";

const KIND_META: Record<EmbedKind, { title: string; studio: string; add: Array<[string, string]> }> = {
  twodgraph: {
    title: "2D Graph designer",
    studio: "/math-lab/graphing-calculator",
    add: [["function", "Function y=f(x)"], ["point", "Point"], ["segment", "Segment"]],
  },
  twodgeometry: {
    title: "2D Geometry designer",
    studio: "/workspace/geometry",
    add: [["point", "Point"], ["segment", "Segment"], ["circle", "Circle"], ["polygon", "Polygon"]],
  },
  threedgraph: {
    title: "3D Graph designer",
    studio: "/math-lab/3d-graphing",
    add: [["surface", "Surface z=f(x,y)"], ["point", "Point"], ["segment", "Segment"]],
  },
  threedgeometry: {
    title: "3D Geometry designer",
    studio: "/workspace/3d",
    add: [["box", "Box"], ["sphere", "Sphere"], ["segment", "Segment"], ["point", "Point"]],
  },
};

function newObject(kind: EmbedKind, type: string, index: number): EmbedObject {
  const id = `${type}-${index + 1}`;
  if (type === "function") return { id, type, expression: "x", color: "#2563eb", size: 2, label: "y = x" };
  if (type === "surface") return { id, type, expression: "x^2 + y^2", color: "#38bdf8", label: "z = x²+y²" };
  if (type === "circle") return { id, type, x: 1, y: 1, radius: 1.2, color: "#7c3aed", size: 2 };
  if (type === "box") return { id, type, x: 0, y: 0, z: 0, width: 1.4, height: 1, depth: 1.4, color: "#22d3ee" };
  if (type === "sphere") return { id, type, x: 1, y: 0.4, z: 0, radius: 0.6, color: "#a78bfa" };
  if (type === "segment") {
    return kind.startsWith("three")
      ? { id, type, x: -1, y: 0, z: 0, x2: 1, y2: 1, z2: 0.5, color: "#f97316", size: 2 }
      : { id, type, x: 0, y: 0, x2: 2, y2: 1, color: "#0f172a", size: 2 };
  }
  if (type === "polygon") return { id, type, points: [[0, 0], [3, 0], [1.2, 2]], color: "#2563eb", fill: "rgba(37,99,235,.12)" };
  return kind.startsWith("three")
    ? { id, type: "point", x: 0, y: 1, z: 0, size: 6, color: "#f8fafc", label: "P" }
    : { id, type: "point", x: 1, y: 1, size: 6, color: "#0f766e", label: "P" };
}

export default function EmbedDesigner() {
  const params = useParams();
  const kind: EmbedKind = isEmbedKind(params.kind ?? "") ? params.kind as EmbedKind : "twodgraph";
  const meta = KIND_META[kind];
  const [scene, setScene] = useState<EmbedScene>(() => defaultScene(kind));
  const [copied, setCopied] = useState("");
  const previewNode = useRef<HTMLDivElement | null>(null);
  const origin = typeof window === "undefined" ? "https://mathuniverse.local" : window.location.origin;
  const json = useMemo(() => JSON.stringify(scene, null, 2), [scene]);

  useEffect(() => {
    setScene(defaultScene(kind));
  }, [kind]);

  useEffect(() => {
    if (previewNode.current) embed(previewNode.current, scene, kind);
  }, [kind, scene]);

  const updateObject = (id: string, patch: Partial<EmbedObject>) => {
    setScene((current) => ({
      ...current,
      objects: current.objects.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const copy = async (label: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
  };

  return (
    <div className="mu-embed-designer">
      <header>
        <p>Embed studio</p>
        <h1>{meta.title}</h1>
        <p>Design an object list (coordinates, sizes, colors, expressions), then drop it on any website like a Google Maps embed.</p>
        <nav>
          {EMBED_KINDS.map((item) => (
            <Link key={item} to={`/design/${item}`} className={item === kind ? "active" : ""}>{API_NAMES[item]}</Link>
          ))}
          <Link to={meta.studio}>Open full studio</Link>
        </nav>
      </header>
      <div className="mu-embed-layout">
        <section>
          <h2>Objects</h2>
          <div className="mu-embed-add">
            {meta.add.map(([type, label]) => (
              <button key={type} type="button" onClick={() => setScene((current) => ({ ...current, objects: [...current.objects, newObject(kind, type, current.objects.length)] }))}>{label}</button>
            ))}
          </div>
          <ul className="mu-embed-objects">
            {scene.objects.map((object) => (
              <li key={object.id}>
                <strong>{object.type}</strong>
                <input value={object.label ?? ""} onChange={(event) => updateObject(object.id, { label: event.target.value })} placeholder="label" />
                <input value={object.expression ?? ""} onChange={(event) => updateObject(object.id, { expression: event.target.value })} placeholder="expression" />
                <label>x <input type="number" step="0.1" value={object.x ?? ""} onChange={(event) => updateObject(object.id, { x: Number(event.target.value) })} /></label>
                <label>y <input type="number" step="0.1" value={object.y ?? ""} onChange={(event) => updateObject(object.id, { y: Number(event.target.value) })} /></label>
                {kind.startsWith("three") ? <label>z <input type="number" step="0.1" value={object.z ?? ""} onChange={(event) => updateObject(object.id, { z: Number(event.target.value) })} /></label> : null}
                <label>size <input type="number" step="0.1" value={object.size ?? object.radius ?? object.width ?? ""} onChange={(event) => updateObject(object.id, object.radius !== undefined ? { radius: Number(event.target.value) } : { size: Number(event.target.value) })} /></label>
                <input type="color" value={object.color ?? "#2563eb"} onChange={(event) => updateObject(object.id, { color: event.target.value })} />
                <button type="button" onClick={() => setScene((current) => ({ ...current, objects: current.objects.filter((item) => item.id !== object.id) }))}>Remove</button>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Live preview</h2>
          <div className="mu-embed-preview" ref={previewNode} />
          <h2>Embed like Google Maps</h2>
          <div className="mu-embed-copy">
            <button type="button" onClick={() => void copy("iframe", iframeSnippet(origin, scene))}>Copy iframe</button>
            <button type="button" onClick={() => void copy("script", scriptSnippet(origin, scene))}>Copy script tag</button>
            <button type="button" onClick={() => void copy("json", json)}>Copy JSON content</button>
          </div>
          {copied ? <p className="mu-embed-status">Copied {copied}.</p> : null}
          <pre>{scriptSnippet(origin, scene)}</pre>
        </section>
        <section>
          <h2>Content JSON</h2>
          <p>This is the object list other sites store: kind, view (sizes/camera), and objects (coordinates and style).</p>
          <textarea
            value={json}
            onChange={(event) => {
              try {
                setScene(normalizeScene(JSON.parse(event.target.value), kind));
              } catch {
                /* keep typing */
              }
            }}
          />
          <p className="mu-embed-api">Host file: <code>/{kind}.js</code> · API: <code>{createApi(kind).kind}</code> → <code>{API_NAMES[kind]}.embed(el, content)</code></p>
        </section>
      </div>
    </div>
  );
}
