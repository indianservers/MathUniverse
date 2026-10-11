from pathlib import Path
base=Path('src/studios/complex')
for name,cls in [('EulerReference.tsx','er-circle'),('ProjectionsReference.tsx','pr-diagram'),('TaylorReference.tsx','tr-plot')]:
 p=base/name;s=p.read_text(encoding='utf-8');start=s.index('className="'+cls+'"');end=s.index('>',start);s=s[:start]+s[start:end].replace('role="img"','role="slider"')+s[end:];p.write_text(s,encoding='utf-8')
p=base/'TaylorReference.tsx';s=p.read_text(encoding='utf-8');s="import {cursorAngle} from './eulerCursorMath';\n"+s
s=s.replace('    center: [353, 248],','    projectAngle:(x,y)=>view==="3D"?Math.max(0,Math.min(360,(x-45)/520*360)):view==="Both"&&x>350?Math.max(0,Math.min(360,(x-350)/370*360)):cursorAngle(x-(view==="Both"?5+353*.57:353),(view==="Both"?105+248*.57:248)-y,p.degrees,0),')
s=s.replace('                        <g key={i}>','''                        <g key={i} className="ec-term-target" role="button" tabIndex={0} aria-label={`Inspect Taylor partial sum ${i+1}`} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();pause();setStepMode(true);setStep(i+1);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();pause();setStepMode(true);setStep(i+1);}}}><title>{`Partial sum ${i+1}: ${pair(v)}`}</title><circle cx={x} cy={y} r="10" fill="transparent"/>''')
s=s.replace('          {cursor.panel}','          {cursor.panel}<p className="ec-mode-hint">{view==="2D"?"Drag around the exact-point circle to change angle. Click a gold partial sum to inspect that step.":"Drag horizontally across the 3D pane to scrub 0 to 360 degrees. In Both view, drag the left circle to rotate."}</p>')
p.write_text(s,encoding='utf-8')
