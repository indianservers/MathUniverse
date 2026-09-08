/** Schematic object visibility: positions are display percentages, not invented coordinates. */
export function LessonVisibilityGraph({visible,compact=false}:{visible:boolean;compact?:boolean}) {
  return <div className={`lesson-visibility-graph${compact?' is-compact':''}`} data-visible={visible} role="img" aria-label={`Object P ${visible?'visible':'hidden'}`}>
    <span className="lesson-visibility-x"/><span className="lesson-visibility-y"/>
    <span className="lesson-visibility-object" data-visible={visible} style={{left:compact?'55%':'63%',top:compact?'38%':'25%'}}>{visible?'★':''}</span>
    {!compact&&<span className="lesson-visibility-caption">{visible?'Object P':'Object P hidden'}</span>}
  </div>;
}
