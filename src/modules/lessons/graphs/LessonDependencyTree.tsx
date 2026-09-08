export type LessonDependencyNode = {id:string;label:string;color:string};

/** Ordered dependency stages; multiple parents merge into the following stage. */
export function LessonDependencyTree({label,levels}:{label:string;levels:readonly (readonly LessonDependencyNode[])[]}) {
  return <ol className="lesson-dependency-tree" aria-label={label}>
    {levels.map((nodes,index)=><li key={nodes.map(node=>node.id).join('-')}>
      <div className="lesson-dependency-level">{nodes.map(node=><span key={node.id} className="lesson-dependency-node" style={{borderColor:node.color}}>{node.label}</span>)}</div>
      {index<levels.length-1&&<div className="lesson-dependency-connector" aria-hidden="true">
        {nodes.length>1&&<i/>}<span>↓</span>
      </div>}
    </li>)}
  </ol>;
}
