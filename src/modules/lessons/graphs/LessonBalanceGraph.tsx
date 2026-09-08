import { LessonGraphWorkspace } from './LessonGraphWorkspace';

/** A symbolic, level balance. Pan contents are supplied by the lesson. */
export function LessonBalanceGraph({left,right}:{left:readonly string[];right:readonly string[]}) {
  return <LessonGraphWorkspace title="Balance model"><div className="lesson-balance-graph" data-graph-family="balance" role="img" aria-label={`${left.join(' ')} equals ${right.join(' ')}`}>
    <div className="lesson-balance-beam" aria-hidden="true"><b>=</b></div>
    <div className="lesson-balance-pans">{[left,right].map((terms,index)=><div key={index} className="lesson-balance-pan">{terms.map((term,i)=><span key={i}>{term}</span>)}</div>)}</div>
    <div className="lesson-balance-stand" aria-hidden="true"/>
  </div></LessonGraphWorkspace>;
}
