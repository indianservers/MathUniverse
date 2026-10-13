import { useEffect, useId, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import * as Accordion from '@radix-ui/react-accordion';
import { ArrowRight, Check, ChevronDown, Compass, FlaskConical, GitCompareArrows, Lightbulb, RotateCcw, Sparkles, Target, Download } from 'lucide-react';
import { enhancedLabs, resolveEnhancedLab, type EnhancedLab, type EnhancementSection } from './labEnhancementRegistry';
import { studioComparisons } from './studioComparisons';
import { curriculumStudios } from '../curriculum/curriculumCatalog';
import './labUnderstanding.css';
import StudioTheoryDepth from './StudioTheoryDepth';

const groups = [{id:'theory',label:'Theory & explanation',icon:Lightbulb}, {id:'discover',label:'See the idea',icon:Lightbulb}, {id:'compare',label:'Compare & distinguish',icon:GitCompareArrows}, {id:'experiment',label:'Try & check',icon:FlaskConical}, {id:'connect',label:'Connect & remember',icon:Compass}] as const;
const labels: Record<EnhancementSection, string> = {idea:'The idea in plain words',compare:'Compare the concepts',visual:'From inputs to evidence',formulas:'Formula ↔ example',worked:'Worked example, one step at a time',scenarios:'Compare three worked cases',predict:'Predict → experiment → explain',boundaries:'Conditions & boundary cases',mistakes:'Spot the reasoning trap',method:'Choose your method',check:'Check your understanding',connections:'Connect it & keep the takeaway'};
const numbers: Record<EnhancementSection, string> = {idea:'01',compare:'04',visual:'02',formulas:'03',worked:'07',scenarios:'05',predict:'08',boundaries:'06',mistakes:'10',method:'11',check:'09',connections:'12'};
const readNotes = (key: string) => { try { const value = JSON.parse(sessionStorage.getItem(`lab-understanding:${key}`) || '{}'); return { prediction: typeof value.prediction === 'string' ? value.prediction : '', observation: typeof value.observation === 'string' ? value.observation : '' }; } catch { return { prediction:'',observation:'' }; } };

export default function LabUnderstanding({ studioId }: { studioId: string }) {
  const location = useLocation();
  const resolved = resolveEnhancedLab(location.pathname, location.search);
  const choices = enhancedLabs.filter(l => l.studioId === studioId);
  const [chosen, setChosen] = useState('');
  useEffect(() => setChosen(''), [location.pathname, location.search]);
  const lab = choices.find(l => l.key === chosen) || resolved || choices[0];
  if (!lab || location.pathname.endsWith('/labs') || location.pathname.includes('/curriculum')) return null;
  return <div id="lab-understanding" className="lu-shell" data-enhancement-studio={studioId}>
    <div className="lu-topic-picker"><label htmlFor="lu-topic">Explore a learning guide</label><select id="lu-topic" value={lab.key} onChange={e => setChosen(e.target.value)}>{choices.map(l => <option key={l.key} value={l.key}>{l.title}</option>)}</select><span>12 ways to understand each topic</span></div>
    <UnderstandingGuide key={lab.key} lab={lab}/>
  </div>;
}

export function UnderstandingGuide({ lab }: { lab: EnhancedLab }) {
  const id = useId();
  const [tab, setTab] = useState('theory');
  const [seen, setSeen] = useState<string[]>(['theory']);
  const [example, setExample] = useState(0);
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState(() => readNotes(lab.key));
  const [answer, setAnswer] = useState('');
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [trap, setTrap] = useState(false);
  const [formulaIndex, setFormulaIndex] = useState(0);
  const current = lab.copy.examples[example];
  const formula = lab.formulas[formulaIndex];
  const contrast = studioComparisons[lab.studioId];
  const siblings = enhancedLabs.filter(l => l.studioId === lab.studioId && l.key !== lab.key && !l.key.includes('guided-')).slice(0,3);
  useEffect(() => { try { sessionStorage.setItem(`lab-understanding:${lab.key}`, JSON.stringify(notes)); } catch { /* Notes still work when storage is unavailable. */ } }, [lab.key, notes]);
  const panel = (section: EnhancementSection, children: ReactNode, wide = false) => <article className={`lu-card ${wide?'lu-wide':''}`} data-enhancement={section}><div className="lu-card-heading"><span>{numbers[section]}</span><h3>{labels[section]}</h3></div>{children}</article>;
  const download = () => {
    const blob = new Blob([JSON.stringify({topic:lab.title,route:lab.href,...notes,takeaway:lab.copy.principle,conditions:lab.copy.caution},null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href=url; anchor.download=`${lab.key.replaceAll('/','-')}-learning-notes.json`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const value = answer.trim();
  const fraction = /^([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)$/.exec(value);
  const numeric = fraction ? Number(fraction[1])/Number(fraction[2]) : Number(value);
  const correct = !!value && Number.isFinite(numeric) && !!lab.numeric && Math.abs(numeric-lab.numeric.expected) <= 0.001 * Math.max(1,Math.abs(lab.numeric.expected));
  return <section className="lu-guide" aria-label={`${lab.title}: visual learning guide`} data-enhancement-count="12">
    <header className="lu-hero"><div><span className="lu-eyebrow"><Sparkles size={16}/> THE UNDERSTANDING STUDIO</span><h2>{lab.title}<br/><em>Make the idea click.</em></h2><p>See the relationship. Compare the cases. Test your reasoning.</p><div className="lu-hero-chips"><span>12 learning tools</span><span>Worked cases</span><span>Explore at your pace</span></div></div><div className="lu-orbit" aria-hidden="true"><div className="lu-orbit-ring"/><div className="lu-orbit-core"><Lightbulb size={34}/><strong>Understand</strong></div><span className="lu-orbit-node lu-node-1"><GitCompareArrows/>Compare</span><span className="lu-orbit-node lu-node-2"><FlaskConical/>Explore</span><span className="lu-orbit-node lu-node-3"><Target/>Explain</span></div></header>
    <Tabs.Root value={tab} onValueChange={next=>{setTab(next);setSeen(old=>old.includes(next)?old:[...old,next]);}}>
      <div className="lu-nav"><Tabs.List aria-label={`${lab.title} learning tools`}>{groups.map(group=><Tabs.Trigger key={group.id} value={group.id}><group.icon size={18}/><span>{group.label}</span>{seen.includes(group.id)&&<Check className="lu-visited" size={13} aria-label="Visited"/>}</Tabs.Trigger>)}</Tabs.List><span className="lu-progress">{seen.length}/{groups.length} explored</span></div>
      <Tabs.Content forceMount value="theory" className="lu-panel"><StudioTheoryDepth lab={lab}/></Tabs.Content>
      <Tabs.Content forceMount value="discover" className="lu-panel"><div className="lu-grid">
        {panel('idea',<><p className="lu-big-idea">{lab.plain}</p><div className="lu-note"><Lightbulb size={19}/><p><b>Look for this:</b> {lab.observe}</p></div></>,true)}
        {panel('visual',<><p>Read one worked case as a chain of reasoning.</p><ol className="lu-flow">{[['Start with',current.setup],['Use the relationship',lab.copy.method],['Expect this evidence',current.result]].map(([name,text],i)=><li key={name}><span className="lu-flow-dot">{i+1}</span><div><b>{name}</b><p>{text}</p></div>{i<2&&<ArrowRight className="lu-flow-arrow" size={20}/>}</li>)}</ol><div className="lu-case-buttons" aria-label="Visual reasoning case">{lab.copy.examples.map((item,i)=><button key={i} aria-pressed={example===i} onClick={()=>setExample(i)}>Case {i+1}: {item.title}</button>)}</div></>)}
        {panel('formulas',<><div className="lu-formula-display"><span>{formula.title}</span><p>{formula.expression}</p></div><dl className="lu-formula-map"><div><dt>Given inputs</dt><dd>{formula.context}</dd></div><div><dt>Meaning of the result</dt><dd>{formula.result}</dd></div></dl><p className="lu-small">Read the symbols with the setup and stated conditions.</p><div className="lu-case-buttons">{lab.formulas.map((f,i)=><button key={i} aria-pressed={formulaIndex===i} onClick={()=>setFormulaIndex(i)}>Relationship {i+1}: {f.title}</button>)}</div></>)}
      </div></Tabs.Content>
      <Tabs.Content forceMount value="compare" className="lu-panel"><div className="lu-grid">
        {panel('compare',<><p className="lu-section-intro">{contrast.title} <span>A foundation for this studio</span></p><div className="lu-table-scroll" role="region" aria-label={contrast.title} tabIndex={0}><table><caption>{contrast.title}</caption><thead><tr><th scope="col">Compare</th><th scope="col">{contrast.left}</th><th scope="col">{contrast.right}</th></tr></thead><tbody>{contrast.rows.map(([name,left,right])=><tr key={name}><th scope="row">{name}</th><td>{left}</td><td>{right}</td></tr>)}</tbody></table></div></>,true)}
        {panel('scenarios',<><p>Compare the setups and results for <b>{lab.title}</b>. These are worked cases, not readings of your current workspace.</p><div className="lu-table-scroll" role="region" aria-label="Worked-case comparison" tabIndex={0}><table><caption>Topic-specific worked cases</caption><thead><tr><th scope="col">Case</th><th scope="col">Given</th><th scope="col">Result & interpretation</th></tr></thead><tbody>{lab.copy.examples.map((item,i)=><tr key={i} className={example===i?'lu-selected-row':''}><th scope="row"><button aria-pressed={example===i} onClick={()=>setExample(i)}>{item.title}</button></th><td>{item.setup}</td><td>{item.result}</td></tr>)}</tbody></table></div></>,true)}
        {panel('boundaries',<><div className="lu-warning"><Target/><p>{lab.copy.caution}</p></div><p>Before applying the relationship, identify which condition matters in your chosen case.</p><Accordion.Root type="single" collapsible className="lu-accordion"><Accordion.Item value="boundary"><Accordion.Header><Accordion.Trigger>Inspect the case and its limits<ChevronDown size={17}/></Accordion.Trigger></Accordion.Header><Accordion.Content><p><b>Case:</b> {current.setup}</p><p><b>Expected:</b> {current.result}</p><p><b>Condition to check:</b> {lab.copy.caution}</p></Accordion.Content></Accordion.Item></Accordion.Root></>,true)}
      </div></Tabs.Content>
      <Tabs.Content forceMount value="experiment" className="lu-panel"><div className="lu-grid">
        {panel('worked',<><div className="lu-case-buttons">{lab.copy.examples.map((item,i)=><button key={i} aria-pressed={example===i} onClick={()=>{setExample(i);setStep(0);}}>{item.title}</button>)}</div><ol className="lu-stepper"><li><span>1</span><div><b>Set up the problem</b><p>{current.setup}</p></div></li>{step>=1&&<li><span>2</span><div><b>Choose the relationship</b><p>{lab.copy.method}</p></div></li>}{step>=2&&<li><span>3</span><div><b>Compare your result</b><p>{current.result}</p></div></li>}</ol><div className="lu-actions"><button className="lu-primary" onClick={()=>setStep(s=>Math.min(2,s+1))} disabled={step===2}>{step===2?'All steps shown':'Reveal next step'}<ArrowRight size={16}/></button><button aria-label="Restart worked example" onClick={()=>setStep(0)}><RotateCcw size={16}/></button></div></>)}
        {panel('predict',<><p>{lab.experiment}</p><label htmlFor={`${id}-prediction`}>Before exploring: my prediction</label><textarea id={`${id}-prediction`} value={notes.prediction} onChange={e=>setNotes({...notes,prediction:e.target.value})} placeholder="I expect… because…"/><label htmlFor={`${id}-observation`}>After exploring: evidence & explanation</label><textarea id={`${id}-observation`} value={notes.observation} onChange={e=>setNotes({...notes,observation:e.target.value})} placeholder="I changed… I observed… The relationship explains this because…"/><p className="lu-small">Notes stay in this browser tab during the session. Written explanations are self-assessed.</p><button onClick={download}><Download size={16}/>Download my notes</button></>)}
        {panel('check',<><div className="lu-quiz-label"><Target size={19}/> YOUR TURN</div><p>{lab.numeric?.prompt || current.setup}</p>{lab.numeric?<><label htmlFor={`${id}-answer`}>Your numerical answer</label><div className="lu-answer"><input id={`${id}-answer`} inputMode="decimal" value={answer} onChange={e=>{setAnswer(e.target.value);setChecked(false);}} placeholder="Number or fraction" onKeyDown={e=>{if(e.key==='Enter'&&answer.trim())setChecked(true);}}/><button className="lu-primary" disabled={!answer.trim()} onClick={()=>setChecked(true)}>Check</button></div>{checked&&<div role="status" className={`lu-feedback ${correct?'is-correct':''}`}><b>{correct?'Correct for this case.':'Try again.'}</b><p>{correct?`The expected value is ${lab.numeric.expected}. Explain the relationship you used.`:'Review the formula, signs and conditions, then calculate again.'}</p></div>}<Accordion.Root type="single" collapsible className="lu-accordion"><Accordion.Item value="answer"><Accordion.Header><Accordion.Trigger>Show answer after trying<ChevronDown size={17}/></Accordion.Trigger></Accordion.Header><Accordion.Content><p>Expected value: <b>{lab.numeric.expected}</b></p><p>{lab.copy.method}</p></Accordion.Content></Accordion.Item></Accordion.Root></>:<><button className="lu-primary" onClick={()=>setRevealed(!revealed)} aria-expanded={revealed}>{revealed?'Hide expected reasoning':'Compare with expected reasoning'}</button>{revealed&&<p className="lu-feedback">{current.result}</p>}</>}<div className="lu-note"><p><b>Extend it:</b> {lab.challenge}</p></div></>,true)}
      </div></Tabs.Content>
      <Tabs.Content forceMount value="connect" className="lu-panel"><div className="lu-grid">
        {panel('mistakes',<><div className="lu-warning"><p>{lab.copy.caution}</p></div><p>Explain how ignoring this caution could change the answer to <b>{current.title}</b>.</p><button onClick={()=>setTrap(!trap)} aria-expanded={trap}>{trap?'Hide reasoning guide':'Show the reasoning guide'}</button>{trap&&<div className="lu-feedback"><p><b>Start from the rule:</b> {lab.copy.principle}</p><p><b>Check against this evidence:</b> {current.result}</p><p><b>Retain the condition:</b> {lab.copy.caution}</p></div>}</>)}
        {panel('method',<><p>{lab.copy.method}</p><ol className="lu-method"><li><b>Identify the task</b><p>{current.setup}</p></li><li><b>Check applicability</b><p>{lab.copy.caution}</p></li><li><b>Verify the outcome</b><p>{current.result}</p></li></ol></>)}
        {panel('connections',<><div className="lu-takeaway"><Sparkles size={22}/><div><span>KEEP THIS IDEA</span><p>{lab.copy.principle}</p></div></div><p><b>Build on:</b> {lab.prerequisites}</p><div className="lu-related"><span>Continue in this studio</span>{siblings.map(s=><Link key={s.key} to={s.href}>{s.title}<ArrowRight size={16}/></Link>)}</div><Link className="lu-course-link" to={`/studios/${lab.studioId}/curriculum`}>Open the complete learning path<ArrowRight size={16}/></Link></>,true)}
      </div></Tabs.Content>
    </Tabs.Root>
    <footer className="lu-footer"><span><Check size={15}/> See · compare · try · connect</span><span>{curriculumStudios.find(s=>s.id===lab.studioId)?.name}</span></footer>
  </section>;
}
