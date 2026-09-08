import type { CSSProperties } from "react";

/** Directed dependency-chain adapter. Ordered labels are supplied by the lesson. */
export function LessonDependencyGraph({ nodes, label }: { nodes: Array<{id:string;label:string;color:string}>; label:string }) {
  return <div className="lesson-chain-frame" data-graph-family="dependency-chain" role="region" aria-label={label} tabIndex={0}>
    <ol className="lesson-chain" aria-label={label} style={{"--node-count":nodes.length} as CSSProperties}>
      {nodes.map((node,index)=><li key={node.id}>
        <span className="lesson-chain-node" style={{borderColor:node.color}}>{node.label}</span>
        {index<nodes.length-1&&<span className="lesson-chain-arrow" aria-hidden="true">→</span>}
      </li>)}
    </ol>
  </div>;
}
