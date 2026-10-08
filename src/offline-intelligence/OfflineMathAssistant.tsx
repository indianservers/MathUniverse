import {animateRoboResult} from '../math-robo/character/workspaceAdapter';
import {roboEvents} from '../math-robo/character/engine';
import {useRoboPosition} from '../math-robo/character/useRoboPosition';
import {RoboAnimationLab} from '../math-robo/character/RoboAnimationLab';
import type {RoboCharacterHandle} from '../math-robo/character/RoboCharacter';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { graphExpressions, interpretVisualRequest, modeForPath, type VisualCommand } from './commands';
import { applyVisualCommand, readRoboObject } from './workspaceBridge';
import { contextualRequest } from './objectConversation';
import { commandTransform3d } from './solidAdapter';
import './offlineAssistant.css';
import MathRobot from './MathRobot';
import { FLAT_SHAPES, SOLID_SHAPES } from './shapeCatalog';
import { INTELLIGENCE_EXAMPLES } from './expressionCorpus';
import { useRoboSpeech } from './roboSpeech';
import { liveEngine, runSemanticAssistant } from '../math-robo/intelligence/liveAssistant';
import { loadIntelligenceModel } from '../math-robo/intelligence/hierarchicalModel';
import { LANGUAGE_ACTIONS, OPERATIONS } from '../math-robo/intelligence/actionRegistry';
import {MODEL_TRAINING_ENABLED} from '../math-robo/intelligence/buildPolicy';
import {CorrectionQueue} from '../math-robo/intelligence/correctionCandidates';

const EmbeddedGraph = lazy(() => import('../studios/geometry/GeometryEmbeddedGraph'));
const EmbeddedSolid = lazy(() => import('../studios/geometry/GeometryEmbeddedSolid'));
type Response = { id:string; text:string; command?:VisualCommand; steps?:string[]; confidence?:string };

export default function OfflineMathAssistant() {
  const { pathname } = useLocation();
  const mode = modeForPath(pathname);
  const character=useRef<RoboCharacterHandle>(null);
  const position=useRoboPosition();
  const [open,setOpen] = useState(false);
  const [input,setInput] = useState('');
  const [response,setResponse] = useState<Response>();
  const [busy,setBusy] = useState(false);
  const [history,setHistory] = useState<Array<{answer:string}>>([]);
  const [exampleSearch,setExampleSearch]=useState('');
  const [learningStatus,setLearningStatus]=useState('');
  const [learnedCount,setLearnedCount]=useState(0);
  const [teachPhrase,setTeachPhrase]=useState('');
  const [teachCommand,setTeachCommand]=useState('');
  const [learningBusy,setLearningBusy]=useState(false);
  const [answerSource,setAnswerSource]=useState('');
  const [semanticDebug,setSemanticDebug]=useState<Awaited<ReturnType<typeof runSemanticAssistant>>>();
  const [modelInfo,setModelInfo]=useState<{parameters:number;bytes:number;metrics?:Record<string,unknown>}>();
  const editor = useRef<HTMLTextAreaElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const lastVisual = useRef<VisualCommand>();
  const roboObjects=useRef<VisualCommand[]>([]);
  const speech = useRoboSpeech(open, pathname, text => { setInput(text); editor.current?.focus(); });
  useEffect(() => { setResponse(undefined); setInput(''); setHistory([]); lastVisual.current=undefined;roboObjects.current=[]; }, [pathname]);
  useEffect(() => { if (open) editor.current?.focus(); }, [open]);
  useEffect(() => {
    if (!open) return;
    let active=true;
    setLearningStatus('Preparing local TensorFlow.js model…');
    void import('./roboLearning').then(async ({getRoboLearning}) => {
      const learner=getRoboLearning();
      await learner.ready();
      if(active) {setLearnedCount(MODEL_TRAINING_ENABLED?liveEngine(mode).corrections.count:new CorrectionQueue(localStorage).list().length);setLearningStatus('TensorFlow.js ready · local semantic engine');}
      try {const model=await loadIntelligenceModel();const metadata=await model.getUserDefinedMetadata() as {report?:{metrics?:Record<string,unknown>}};if(active)setModelInfo({parameters:model.countParams(),bytes:model.countParams()*4,metrics:metadata?.report?.metrics});}catch{if(active)setLearningStatus('TensorFlow.js ready · semantic rules active · v4 model unavailable');}
    }).catch(()=>{if(active)setLearningStatus('Model unavailable · existing commands and solver are ready');});
    return ()=>{active=false;};
  },[open,mode]);
  async function teach() {
    setLearningBusy(true);
    setLearningStatus('Learning your correction…');
    try {
      const queue=new CorrectionQueue(localStorage);queue.submit(teachPhrase,teachCommand,mode,semanticDebug?.plan.commands[0]?.action,semanticDebug?.objects??0);setLearnedCount(queue.list().length);setLearningStatus('Suggestion queued for admin review. The active model is unchanged.');
    } catch(error) {setLearningStatus(error instanceof Error?error.message:'Could not save the correction.');}
    finally {setLearningBusy(false);}
  }
  async function resetLearning() {
    setLearningBusy(true);
    try {
      const {getRoboLearning}=await import('./roboLearning');
      await getRoboLearning().reset();
      liveEngine(mode).corrections.clear();
      setLearnedCount(0);setLearningStatus('Personal learning cleared. The base model will rebuild on your next request.');
    } catch {setLearningStatus('Unable to clear learning storage.');}
    finally {setLearningBusy(false);}
  }
  function close() {speech.stopSpeaking();roboEvents.emit({type:'cancel'});setOpen(false);launcher.current?.focus();}
  async function submit() {
    if (!input.trim() || busy) return;
    if (response) setHistory(previous=>[...previous,{answer:response.text}].slice(-6));
    setBusy(true);
    speech.stopSpeaking();
    roboEvents.emit({type:'thinking'});
    try {
      {
        const semantic=await runSemanticAssistant(input,mode,pathname);setSemanticDebug(semantic);
        if(semantic.status!=='unhandled'){
          setAnswerSource(semantic.plan.commands.some(command=>command.source.action==='correction')?'Your correction':semantic.neural?'Ruhi Intelligence v4 · local model + validated geometry engine':'Ruhi Intelligence v4 · validated local semantic engine');
          roboEvents.emit({type:semantic.status==='success'?'answer':semantic.status==='ambiguous'?'unknown':'incorrect'});
          animateRoboResult(mode,semantic);
          setResponse({id:crypto.randomUUID(),text:semantic.message,command:mode==='normal'?semantic.effects.filter(c=>c.action==='create').at(-1):undefined,steps:semantic.engineExecution?.steps});return;
        }
      }
      const objects=roboObjects.current.flatMap(command=>{
        const live=mode==='normal'?{command}:readRoboObject(mode,command);
        return live?[live]:[];
      });
      const context=contextualRequest(input,mode,objects);
      const result = await import('./roboLearning').then(({getRoboLearning})=>getRoboLearning().interpret(input,mode,objects.at(-1)?.command,objects))
        .catch(()=>({...context??interpretVisualRequest(input,mode,objects.at(-1)?.command),source:'Validated parser / math solver'}));
      setAnswerSource(result.source);
      if (result.command) {
        result.command.objectId ??= crypto.randomUUID();
        const sameDimension = mode === 'normal' || result.command.dimension === (mode.endsWith('3d') ? '3d' : '2d');
        if (!sameDimension) { setResponse({id:crypto.randomUUID(),text:'This request uses a different dimension. Open the matching workspace, or ask on an ordinary page for an embedded visual.'}); return; }
        const error = mode === 'normal' ? undefined : await applyVisualCommand(mode,result.command);
        if(!error) {
          lastVisual.current=result.command;
          roboObjects.current=[...roboObjects.current.filter(command=>command.objectId!==result.command!.objectId),result.command].slice(-200);
        }
        roboEvents.emit({type:error?'error':'answer'});
        setResponse({id:crypto.randomUUID(),text:error || result.message,command:!error && mode === 'normal' ? result.command : undefined});
      } else if (result.message) {roboEvents.emit({type:/^(hi|hello|hey)\b/i.test(input)?'greeting':/\b(thanks|thank you)\b/i.test(input)?'thanks':/\b(bye|goodbye)\b/i.test(input)?'goodbye':'answer'});setResponse({id:crypto.randomUUID(),text:result.message});}
      else {
        const {solveProblem} = await import('../problem-solver/problemSolverEngine');
        const solved = solveProblem(input);
        roboEvents.emit({type:solved.trust.answer?'answer':'unknown'});
        setResponse({id:crypto.randomUUID(),text:solved.trust.answer ?? solved.trust.unsupportedReason ?? 'Try an equation or a drawing command.',steps:solved.result.steps,confidence:solved.trust.confidence});
      }
    } catch (error) { roboEvents.emit({type:'error'}); setResponse({id:crypto.randomUUID(),text:error instanceof Error ? error.message : 'Unable to create this visual. Check the request.'}); }
    finally {setBusy(false);}
  }
  return <aside className={`offline-assistant ${open?'is-open':''}`} style={position.style} aria-label="Offline math assistant" data-robo-scene-count={semanticDebug?.objects} data-robo-scene-hash={semanticDebug?.sceneHash} data-robo-before-hash={semanticDebug?.beforeHash}>
    <button ref={launcher} className="offline-assistant-toggle" {...position.handlers} onDoubleClick={()=>character.current?.playAction('wave')} onClick={()=>{if(position.wasDragged())return;roboEvents.emit({type:'greeting'});if(open)close();else setOpen(true);}} aria-label={open?'Close assistant · Offline':'Ask Math · Offline'} aria-expanded={open} aria-controls="math-robo-panel"><span className="robo-greeting" aria-hidden="true">{busy?'Thinking…':open?'Ruhi · Your maths companion':'Hi! I’m Ruhi'}</span><MathRobot ref={character} thinking={busy} awake={open}/></button>
    {import.meta.env.DEV && new URLSearchParams(location.search).has('roboLab') && <RoboAnimationLab character={character} mode={mode} speak={speech.speak}/>}
    {open && <div id="math-robo-panel" style={position.panelStyle} role="dialog" aria-label="Ruhi solver and drawing assistant" onKeyDown={e=>{if(e.key==='Escape')close();}} className={`offline-assistant-body ${response?.command?'has-visual':''}`}>
      <header className="robo-panel-header"><div><strong>Ruhi · Master of Maths</strong><span>● Offline · Your maths companion</span></div><button type="button" onClick={close} aria-label="Close Ruhi">×</button></header>
      <div className="robo-panel-content">
      <p>Welcome, learners and explorers! I’m Ruhi, your maths companion. Let’s explore, draw, and solve together as you become a master of maths.</p>
      <p>{mode === 'normal' ? 'Ask a maths question, paste a problem, or request a drawing.' : `Ask for step-by-step help, or let’s create interactive objects in this ${mode.replace('2d',' 2D').replace('3d',' 3D')} workspace.`}</p>
      <details className="robo-learning"><summary>{'Suggest a correction'} · {learnedCount} {'queued suggestions'}</summary>
        {MODEL_TRAINING_ENABLED&&<p><a href="/model-training">Open Training Lab · bulk datasets, model results and downloadable weights</a></p>}
        <p>{MODEL_TRAINING_ENABLED?'Developer mappings stay local and never retrain production weights.':'Suggestions are queued locally for admin review. They do not alter the model or future command execution.'}</p>
        <label htmlFor="robo-teach-phrase">Your phrase</label><input id="robo-teach-phrase" maxLength={500} value={teachPhrase} onChange={e=>setTeachPhrase(e.target.value)} placeholder="Sketch a round shape"/>
        <label htmlFor="robo-teach-command">What it should mean</label><input id="robo-teach-command" maxLength={500} value={teachCommand} onChange={e=>setTeachCommand(e.target.value)} placeholder="Create circle radius 3"/>
        <div className="robo-voice-actions"><button type="button" disabled={learningBusy||busy||!teachPhrase.trim()||!teachCommand.trim()} onClick={()=>void teach()}>{learningBusy?'Updating…':MODEL_TRAINING_ENABLED?'Learn correction':'Queue suggestion'}</button>{MODEL_TRAINING_ENABLED&&<button type="button" disabled={learningBusy||busy||!learnedCount} onClick={()=>void resetLearning()}>Clear learned phrases</button>}</div>
      </details>
      <p aria-live="polite" className="robo-learning-status">{learningStatus}</p>
      {history.length>0 && <details className="robo-history"><summary>Previous answers ({history.length})</summary>{history.map((item,i)=><p key={i}>{item.answer}</p>)}</details>}
      <form onSubmit={e=>{e.preventDefault();void submit();}}><label htmlFor="offline-math-request">What would you like to create or solve?</label><textarea ref={editor} id="offline-math-request" value={input} onChange={e=>setInput(e.target.value)} placeholder={mode.endsWith('3d')?'Plot z = sin(x)*cos(y)':'Paste a problem, or try: draw a graph of y = x^2'} rows={3}/><button disabled={busy || learningBusy || !input.trim()} type="submit">{busy?'Working…':'Run request'}</button></form>
      {response && <small>{answerSource}</small>}
      {MODEL_TRAINING_ENABLED&&<details className="robo-learning"><summary>Model information · v4.1</summary><p>{LANGUAGE_ACTIONS.length} language actions · {OPERATIONS.filter(op=>op.implemented).length} executor mappings. Local browser inference; deterministic maths.</p>{modelInfo&&<p>{modelInfo.parameters.toLocaleString()} parameters · {(modelInfo.bytes/1024).toFixed(1)} KiB weights.</p>}<a href="/model-training">Admin training and model report</a></details>}
      {MODEL_TRAINING_ENABLED&&semanticDebug&&<details className="robo-learning"><summary>Developer inspector</summary><p>Status: {semanticDebug.status} · scene objects: {semanticDebug.objects} · parse {semanticDebug.parseMs.toFixed(2)} ms · inference/load {semanticDebug.inferenceMs.toFixed(2)} ms · execution {semanticDebug.executionMs.toFixed(2)} ms</p><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',fontSize:10}}>{JSON.stringify({rawText:input,requestKind:semanticDebug.requestKind,commands:semanticDebug.plan.commands,neuralHeads:semanticDebug.neural,effects:semanticDebug.effects,candidates:semanticDebug.candidates,verification:semanticDebug.verification,error:semanticDebug.errorCode,explanation:semanticDebug.explanation},null,2)}</pre></details>}
      <div className="robo-voice-controls" aria-label="English voice skills">
        <strong>English voice</strong>
        <div className="robo-voice-actions"><button type="button" disabled={speech.checking || busy} onClick={()=>void speech.microphone()}>{speech.checking?'Checking…':speech.listening?'Stop dictation':'Dictate in English'}</button>
        {speech.availability==='downloadable' && <button type="button" disabled={speech.checking} onClick={()=>void speech.microphone(true)}>Install English pack</button>}
        {speech.speaking && <button type="button" onClick={speech.stopSpeaking}>Stop reading</button>}</div>
        <p aria-live="polite">{speech.message}</p>
        {speech.voices.length>0 ? <><label htmlFor="robo-english-voice">Local English voice</label><select id="robo-english-voice" value={speech.voiceURI || speech.voices[0].voiceURI} onChange={e=>speech.setVoiceURI(e.target.value)}>{speech.voices.map(voice=><option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}</select></> : <small>Read-aloud needs an installed local English voice.</small>}
      </div>
      <div className="offline-assistant-examples">{(mode === 'geometry3d' ? ['Create a sphere radius 2','Create a blue cube size 3'] : mode === 'graph3d' ? ['Plot z = x^2 + y^2','Plot sin(x)*cos(y)'] : ['Create a rectagle 6 by 4','Draw a line from (0,2) to (3,0)','Plot sin(x)']).map(example=><button key={example} onClick={()=>setInput(example)}>{example}</button>)}</div>
      {response && <div className="robo-answer" data-response-id={response.id} aria-live="polite"><p role="status">{response.text}</p>{response.confidence && <span className="robo-confidence">Solver status: {response.confidence.replace('-',' ')}</span>}{!!response.steps?.length && <details><summary>Show solution steps</summary><ol>{response.steps.map((step,index)=><li key={index}>{step}</li>)}</ol></details>}{response.command && <Suspense fallback={<p>Loading embedded visual…</p>}>
        {response.command.dimension === '3d' && response.command.kind !== 'plot' ? <EmbeddedSolid activityId={`assistant-${response.id}`} scene={solidScene(response.command)}/> : <EmbeddedGraph activityId={`assistant-${response.id}`} dimension={response.command.dimension} expressions={graphExpressions(response.command)} title="Your requested visual"/>}
      </Suspense>}</div>}
      {response && <div className="robo-voice-actions"><button type="button" disabled={!speech.voices.length || speech.listening} onClick={()=>speech.speak(response.text)}>Read answer</button>{!!response.steps?.length && <button type="button" disabled={!speech.voices.length || speech.listening} onClick={()=>speech.speak([response.text,...response.steps!.map((step,index)=>`Step ${index+1}. ${step}`)].join('. '))}>Read solution steps</button>}</div>}
      <small>Runs locally in your browser. English speech uses on-device recognition and local voices when supported. Try coordinates, dimensions, and expressions. Use the workspace’s undo to reverse a drawing.</small>
      <details className="robo-command-guide"><summary>Shapes and editing commands</summary><p>2D: {FLAT_SHAPES.join(', ')}. 3D: {SOLID_SHAPES.join(', ')}.</p><p>After creating an object: “resize it to width 8 height 5”, “scale it by 2”, “rotate it 45 degrees”, “tilt it 30 degrees around the x axis” (3D), “move it right by 2”, “make it blue”. Edits target your last Ruhi object.</p></details>
      <details className="robo-command-guide"><summary>Command library · {INTELLIGENCE_EXAMPLES.length} examples</summary><label htmlFor="robo-example-search">Find an example</label><input id="robo-example-search" type="search" value={exampleSearch} onChange={e=>setExampleSearch(e.target.value)} placeholder="triangle, rotate, sphere…"/><div className="offline-assistant-examples">{Array.from(new Set(INTELLIGENCE_EXAMPLES.filter(e=>(mode==='normal'||e.mode===mode)&&e.request.toLowerCase().includes(exampleSearch.toLowerCase())).map(e=>e.request))).slice(0,12).map(request=><button key={request} onClick={()=>{setInput(request);editor.current?.focus();}}>{request}</button>)}</div><small>The offline rules understand these examples. Create an object before using an editing command.</small></details>
      </div>
    </div>}
  </aside>;
}

function solidScene(command:VisualCommand) {
  const transform=commandTransform3d(command);
  if (command.kind==='line'||command.kind==='point') {
    const base=command.kind==='line'?'line3d':'point';
    return {workspaceType:'3d-geometry',workspaceSnapshot:{input:'',results:[],plots:[],construction:{points:[],lines:[],circles:[],polygons:[],arcs:[],loci:[],constraints:[]},solid:'cube',showSurface:false,showSolid:false,transforms3d:{[base]:{name:command.kind,...transform,scale:command.scale??1,visible:true,opacity:1,material:'matte'}},deletedBase3dIds:['surface','solid','slice','point','vector','line3d','plane3d','sphere3d','cone3d','cylinder3d','prism3d','pyramid3d','polyhedron3d'].filter(id=>id!==base)}};
  }
  return {workspaceType:'3d-geometry',workspaceSnapshot:{input:'',results:[],plots:[],construction:{points:[],lines:[],circles:[],polygons:[],arcs:[],loci:[],constraints:[]},solid:'cube',height3d:command.height,surfaceScale:1,crossSection:0,showSurface:false,showSolid:true,autoRotate3d:false,zoom3d:1,added3dObjects:[{id:'robo-solid',label:command.kind,baseId:'solid',render:'solid',nlpCommand:command,transform:{name:command.kind,...transform,scale:command.scale??1,visible:true,opacity:.78,material:'glass'}}],deletedBase3dIds:['surface','solid','slice','point','vector','line3d','plane3d','sphere3d','cone3d','cylinder3d','prism3d','pyramid3d','polyhedron3d']}};
}
