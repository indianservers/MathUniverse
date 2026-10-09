import {RuhiChatWindow} from './RuhiChatWindow';
import {CinematicMotionControls} from '../math-robo/animation/CinematicMotionControls';
import {useRoboFun} from '../math-robo/character/useRoboFun';
import {RoboFunMenu,RoboFunStatus} from '../math-robo/character/RoboFunMenu';
import type {Target} from '../math-robo/character/engine';
import {useRoboAwareness} from '../math-robo/character/useRoboAwareness';
import {describeAwareness,describeNearby} from '../math-robo/character/spatialAwareness';
import {parseSpatialRequest,resolveSpatialTarget} from '../math-robo/character/spatialCommands';
import {animateRoboResult} from '../math-robo/character/workspaceAdapter';
import {roboEvents} from '../math-robo/character/engine';
import {useRoboPosition} from '../math-robo/character/useRoboPosition';
import {RoboAnimationLab} from '../math-robo/character/RoboAnimationLab';
import type {RoboCharacterHandle} from '../math-robo/character/RoboCharacter';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { graphExpressions, interpretVisualRequest, modeForPath, type VisualCommand } from './commands';
import { applyVisualCommand, readRoboObject, readRoboScene } from './workspaceBridge';
import { contextualRequest } from './objectConversation';
import { commandTransform3d } from './solidAdapter';
import './offlineAssistant.css';
import MathRobot from './MathRobot';
import { FLAT_SHAPES, SOLID_SHAPES } from './shapeCatalog';
import { INTELLIGENCE_EXAMPLES } from './expressionCorpus';
import { useRoboSpeech } from './roboSpeech';
import { liveEngine, runSemanticAssistant } from '../math-robo/intelligence/liveAssistant';
import { loadIntelligenceModel } from '../math-robo/intelligence/hierarchicalModel';
import {loadContextModel} from '../math-robo/intelligence/ruhiContextNet';
import { LANGUAGE_ACTIONS, OPERATIONS } from '../math-robo/intelligence/actionRegistry';
import {MODEL_TRAINING_ENABLED} from '../math-robo/intelligence/buildPolicy';
import {CorrectionQueue} from '../math-robo/intelligence/correctionCandidates';

const EmbeddedGraph = lazy(() => import('../studios/geometry/GeometryEmbeddedGraph'));
const EmbeddedSolid = lazy(() => import('../studios/geometry/GeometryEmbeddedSolid'));
export type RuhiResponse = { clarification?:import('../math-foundation/executionOutcome').ClarificationRequirement; status?:string; candidates?:string[]; navigation?:import('../math-robo/intelligence/types').RoboResult['navigation']; execution?:import('../math-foundation/executionOutcome').ExecutionOutcome; id:string; text:string; command?:VisualCommand; steps?:string[]; confidence?:string; verification?:import('../math-robo/kernel/types').VerificationStatus; conditions?:string[]; errorBound?:string; method?:string };

export default function OfflineMathAssistant() {
  const { pathname,search } = useLocation();const navigate=useNavigate();
  const mode = modeForPath(pathname);
  const character=useRef<RoboCharacterHandle>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const position=useRoboPosition(launcher,character,pathname);
  const awareness=useRoboAwareness(launcher,mode,pathname,position.moving,position.getMovement);
  const fun=useRoboFun(launcher,character,position,awareness.refresh,pathname);
  const [funMenu,setFunMenu]=useState<Target>();
  useEffect(()=>{setFunMenu(undefined);},[pathname]);
  const currentRoute=useRef(pathname);currentRoute.current=pathname;
  const [open,setOpen] = useState(false);
  const [input,setInput] = useState('');
  const [response,setResponse] = useState<RuhiResponse>();
  const [busy,setBusy] = useState(false);

  const [exampleSearch,setExampleSearch]=useState('');
  const [learningStatus,setLearningStatus]=useState('');
  const [learnedCount,setLearnedCount]=useState(0);
  const [teachPhrase,setTeachPhrase]=useState('');
  const [teachCommand,setTeachCommand]=useState('');
  const [learningBusy,setLearningBusy]=useState(false);
  const [,setAnswerSource]=useState('');
  const [semanticDebug,setSemanticDebug]=useState<Awaited<ReturnType<typeof runSemanticAssistant>>>();
  const [modelInfo,setModelInfo]=useState<{parameters:number;bytes:number;metrics?:Record<string,unknown>}>();
  const editor = useRef<HTMLTextAreaElement>(null);
  const lastVisual = useRef<VisualCommand>();
  const roboObjects=useRef<VisualCommand[]>([]);
  const speech = useRoboSpeech(open, pathname, text => { setInput(text); editor.current?.focus(); });
  useEffect(() => { setResponse(undefined); setInput('');  lastVisual.current=undefined;roboObjects.current=[]; }, [pathname]);
  useEffect(() => { if (open) editor.current?.focus(); }, [open]);
  useEffect(() => {
    if (!open) return;
    let active=true;
    setLearningStatus('Preparing local TensorFlow.js model…');
    void import('./roboLearning').then(async ({getRoboLearning}) => {
      const learner=getRoboLearning();
      await learner.ready();
      await loadContextModel().catch(()=>undefined);
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
  function close() {liveEngine(mode).cancelCurrent();speech.stopSpeaking();roboEvents.emit({type:'cancel'});setOpen(false);launcher.current?.focus();}
  async function spatialRequest(text:string) {
    const request=parseSpatialRequest(text);if(!request)return false;
    const before=awareness.refresh();if(!before)return false;
    let message='';
    if(request.type==='stop'){position.stop();message='I stopped moving. '+describeAwareness(awareness.refresh()??before);}
    else if(request.type==='where')message=describeAwareness(before);
    else if(request.type==='nearby')message=describeNearby(before);
    else {
      const resolved=request.type==='move'?undefined:resolveSpatialTarget(before,request.name);
      if(resolved&&!resolved.target)message=resolved.choices.length?`Which target do you mean? ${resolved.choices.join(', ')}. Please include its label.`:'I cannot find that visible element or graph object. Use its button, tab, heading, or object label, or bring it into view.';
      else if(request.type==='distance'&&resolved?.target){const target=resolved.target;message=`The ${target.kind} “${target.label}” is ${Math.round(target.distancePx)} screen pixels from my feet${target.graphDistance!==undefined?` (approximately ${target.graphDistance.toFixed(2)} graph units)` : ''}${target.boundsOnly&&mode.endsWith('3d')?' to its projected bounds':''}.`;}
      else {
        character.current?.setExpression('focused');
        const movement=request.type==='move'?position.move(request.direction,request.crawl,request.distance):position.moveTo(resolved!.target!.point,'crawl' in request&&request.crawl);
        if(!movement.started)message='I need to finish my current activity before moving.';
        else {const result=await movement.completion;await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));if(currentRoute.current!==before.route)return true;message=(result.completed?(result.limited?'I moved as far as the visible workspace allows. ':''):'My movement was cancelled. ')+describeAwareness(awareness.refresh()??before);}
      }
    }
    setAnswerSource('Ruhi · live surroundings');setResponse({id:crypto.randomUUID(),text:message});
    if(position.moving&&['where','nearby','distance'].includes(request.type))character.current?.setExpression('curious');else roboEvents.emit({type:'answer'});return true;
  }
  async function submit(request=input) {
    if (!request.trim() || busy) return;
    const question=request.trim();setInput('');
    setBusy(true);
    speech.stopSpeaking();
    if(!parseSpatialRequest(question))roboEvents.emit({type:'thinking'});
    try {
      const spatial=parseSpatialRequest(question);if(!spatial||['move','target','stop'].includes(spatial.type))fun.stop();
      if(await spatialRequest(question))return;
      {
        const semantic=await runSemanticAssistant(question,mode,pathname+search);setSemanticDebug(semantic);
        if(semantic.status!=='unhandled'){
          setAnswerSource(semantic.plan.commands.some(command=>command.source.action==='correction')?'Your correction':semantic.neural?'Ruhi Intelligence v5.2 · local model + validated geometry engine':'Ruhi Intelligence v5.2 · validated local semantic engine');
          roboEvents.emit({type:semantic.status==='success'?'answer':semantic.status==='ambiguous'?'unknown':'incorrect'});
          animateRoboResult(mode,semantic);
          const kernel = semantic.engineExecution?.metadata?.kernel as import('../math-robo/kernel/types').KernelResult | undefined;
          if(semantic.navigation&&!semantic.navigation.requiresConfirmation){navigate(semantic.navigation.path);return;}
          setResponse({clarification:semantic.clarification,candidates:semantic.candidates,status:semantic.status,navigation:semantic.navigation,execution:semantic.execution,conditions:kernel?.conditions,errorBound:kernel?.errorBound,method:semantic.execution?.evidence.method,id:crypto.randomUUID(),text:semantic.message,command:semantic.status==='success'?semantic.effects.filter(c=>!c.roboControl&&!c.roboClearAll).at(-1):undefined,steps:semantic.engineExecution?.steps,verification:semantic.engineExecution?.verificationStatus??semantic.verification?.status});return;
        }
      }
      const objects=roboObjects.current.flatMap(command=>{
        const live=mode==='normal'?{command}:readRoboObject(mode,command);
        return live?[live]:[];
      });
      const context=contextualRequest(question,mode,objects);
      const result = await import('./roboLearning').then(({getRoboLearning})=>getRoboLearning().interpret(question,mode,objects.at(-1)?.command,objects))
        .catch(()=>({...context??interpretVisualRequest(question,mode,objects.at(-1)?.command),source:'Validated parser / math solver'}));
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
      } else if (result.message) {roboEvents.emit({type:/^(hi|hello|hey)\b/i.test(question)?'greeting':/\b(thanks|thank you)\b/i.test(question)?'thanks':/\b(bye|goodbye)\b/i.test(question)?'goodbye':'answer'});setResponse({id:crypto.randomUUID(),text:result.message});}
      else {
        const {solveProblem} = await import('../problem-solver/problemSolverEngine');
        const solved = solveProblem(question);
        roboEvents.emit({type:solved.trust.answer?'answer':'unknown'});
        setResponse({id:crypto.randomUUID(),text:solved.trust.answer ?? solved.trust.unsupportedReason ?? 'Try an equation or a drawing command.',steps:solved.result.steps,confidence:solved.trust.confidence});
      }
    } catch (error) { roboEvents.emit({type:'error'}); setResponse({id:crypto.randomUUID(),text:error instanceof Error ? error.message : 'Unable to create this visual. Check the request.'}); }
    finally {setBusy(false);}
  }
  return <aside className={`offline-assistant ${open?'is-open':''}`} style={position.style} aria-label="Offline math assistant" data-robo-scene-count={semanticDebug?.objects} data-robo-scene-hash={semanticDebug?.sceneHash} data-robo-before-hash={semanticDebug?.beforeHash}>
    <button ref={launcher} className="offline-assistant-toggle" {...position.handlers} title="Right-click or press Shift+F10 to play with Ruhi" onPointerDown={event=>{if(event.button===0)fun.stop();position.handlers.onPointerDown(event);}} onContextMenu={event=>{event.preventDefault();event.stopPropagation();setFunMenu({x:event.clientX,y:event.clientY});awareness.refresh();}} onKeyDown={event=>{if(event.key==='ContextMenu'||event.shiftKey&&event.key==='F10'){event.preventDefault();const rect=event.currentTarget.getBoundingClientRect();setFunMenu({x:rect.left,y:rect.top});awareness.refresh();}}} onDoubleClick={()=>character.current?.playAction('wave')} onClick={()=>{if(position.wasDragged())return;roboEvents.emit({type:'greeting'});if(open)close();else setOpen(true);}} aria-label={open?'Close assistant · Offline':'Ask Math · Offline'} aria-expanded={open} aria-controls="math-robo-panel"><span className="robo-greeting" aria-hidden="true">{busy?'Thinking…':open?'Ruhi · Your maths companion':'Hi! I’m Ruhi'}</span><MathRobot ref={character} thinking={busy&&!position.moving} awake={open} onTravel={position.travel} onCancelTravel={()=>position.stop(false)} getAwareness={awareness.get}/></button>
    {funMenu&&<RoboFunMenu point={funMenu} location={awareness.snapshot?describeAwareness(awareness.snapshot):'Checking my surroundings…'} onClose={()=>{setFunMenu(undefined);launcher.current?.focus({preventScroll:true});}} onAction={action=>{setFunMenu(undefined);void fun.run(action);}}/>}
    <RoboFunStatus message={fun.message} active={fun.active} onStop={fun.stop} onDismiss={fun.clear}/>
    {import.meta.env.DEV && new URLSearchParams(location.search).has('roboLab') && <RoboAnimationLab character={character} mode={mode} speak={speech.speak}/>}
    {open&&<RuhiChatWindow mode={mode} input={input} setInput={setInput} response={response} busy={busy} editor={editor} launcher={launcher} learningStatus={learningStatus} speech={speech} onSend={submit} onClose={close} onNavigate={navigate} onCancel={()=>liveEngine(mode).cancelCurrent()} choices={semanticDebug} onClear={()=>{setResponse(undefined);void runSemanticAssistant('Clear context',mode,pathname+search);}} onAttach={()=>{const command=readRoboScene(mode).objects.at(-1)?.command??liveEngine(mode).snapshot().objects.at(-1)?.command;setResponse({id:crypto.randomUUID(),text:command?'Attached the current construction.':'Create a graph or object in the workspace first.',command});}} preview={answer=><Suspense fallback={<p role="status">Loading existing workspace…</p>}>{answer.command&& (answer.command.dimension==='3d'&&answer.command.kind!=='plot'?<EmbeddedSolid activityId={`assistant-${answer.id}`} scene={solidScene(answer.command)}/>:<EmbeddedGraph activityId={`assistant-${answer.id}`} dimension={answer.command.dimension} expressions={graphExpressions(answer.command)} title={answer.command.expression??'Your construction'}/>)}</Suspense>} settings={<>
      <CinematicMotionControls/>
      <details className="robo-surroundings"><summary>Ruhi’s surroundings</summary>
        <p data-testid="ruhi-location">{awareness.snapshot?describeAwareness(awareness.snapshot):'Checking my surroundings…'}</p>
        <div className="robo-voice-actions">{(['left','up','right','down'] as const).map(direction=><button key={direction} type="button" disabled={busy} onClick={()=>position.move(direction)}>Walk {direction==='up'?'top':direction}</button>)}<button type="button" disabled={busy} onClick={()=>position.move('right',true)}>Crawl right</button><button type="button" disabled={!position.moving} onClick={()=>position.stop()}>Stop moving</button></div>
        <small>Ask “Where are you?”, “What is near you?”, “Ruhi walk to the Geometry tab”, or “Crawl left 100 pixels”. Distances use screen pixels; 2D graphs also show graph units.</small>
      </details>
      <details className="robo-learning"><summary>{'Suggest a correction'} · {learnedCount} {'queued suggestions'}</summary>
        {MODEL_TRAINING_ENABLED&&<p><a href="/model-training">Open Training Lab · bulk datasets, model results and downloadable weights</a></p>}
        <p>{MODEL_TRAINING_ENABLED?'Developer mappings stay local and never retrain production weights.':'Suggestions are queued locally for admin review. They do not alter the model or future command execution.'}</p>
        <label htmlFor="robo-teach-phrase">Your phrase</label><input id="robo-teach-phrase" maxLength={500} value={teachPhrase} onChange={e=>setTeachPhrase(e.target.value)} placeholder="Sketch a round shape"/>
        <label htmlFor="robo-teach-command">What it should mean</label><input id="robo-teach-command" maxLength={500} value={teachCommand} onChange={e=>setTeachCommand(e.target.value)} placeholder="Create circle radius 3"/>
        <div className="robo-voice-actions"><button type="button" disabled={learningBusy||busy||!teachPhrase.trim()||!teachCommand.trim()} onClick={()=>void teach()}>{learningBusy?'Updating…':MODEL_TRAINING_ENABLED?'Learn correction':'Queue suggestion'}</button>{MODEL_TRAINING_ENABLED&&<button type="button" disabled={learningBusy||busy||!learnedCount} onClick={()=>void resetLearning()}>Clear learned phrases</button>}</div>
      </details>
      <p aria-live="polite" className="robo-learning-status">{learningStatus}</p>
      {MODEL_TRAINING_ENABLED&&<details className="robo-learning"><summary>Model information</summary><p>{LANGUAGE_ACTIONS.length} language actions · {OPERATIONS.filter(op=>op.implemented).length} executor mappings. Local browser inference; deterministic maths.</p>{modelInfo&&<p>{modelInfo.parameters.toLocaleString()} parameters · {(modelInfo.bytes/1024).toFixed(1)} KiB weights.</p>}<a href="/model-training">Admin training and model report</a></details>}
      {MODEL_TRAINING_ENABLED&&semanticDebug&&<details className="robo-learning"><summary>Developer inspector</summary><p>Status: {semanticDebug.status} · scene objects: {semanticDebug.objects} · parse {semanticDebug.parseMs.toFixed(2)} ms · inference/load {semanticDebug.inferenceMs.toFixed(2)} ms · execution {semanticDebug.executionMs.toFixed(2)} ms</p><pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',fontSize:10}}>{JSON.stringify({rawText:semanticDebug.plan.rawPhrase,requestKind:semanticDebug.requestKind,commands:semanticDebug.plan.commands,neuralHeads:semanticDebug.neural,effects:semanticDebug.effects,candidates:semanticDebug.candidates,verification:semanticDebug.verification,error:semanticDebug.errorCode,explanation:semanticDebug.explanation},null,2)}</pre></details>}
      <div className="robo-voice-controls" aria-label="English voice skills">
        <strong>English voice</strong>
        <div className="robo-voice-actions"><button type="button" disabled={speech.checking || busy} onClick={()=>void speech.microphone()}>{speech.checking?'Checking…':speech.listening?'Stop dictation':'Dictate in English'}</button>
        {speech.availability==='downloadable' && <button type="button" disabled={speech.checking} onClick={()=>void speech.microphone(true)}>Install English pack</button>}
        {speech.speaking && <button type="button" onClick={speech.stopSpeaking}>Stop reading</button>}</div>
        <p aria-live="polite">{speech.message}</p>
        {speech.voices.length>0 ? <><label htmlFor="robo-english-voice">Local English voice</label><select id="robo-english-voice" value={speech.voiceURI || speech.voices[0].voiceURI} onChange={e=>speech.setVoiceURI(e.target.value)}>{speech.voices.map(voice=><option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} ({voice.lang})</option>)}</select></> : <small>Read-aloud needs an installed local English voice.</small>}
      </div>
      <details className="robo-command-guide"><summary>Shapes and editing commands</summary><p>2D: {FLAT_SHAPES.join(', ')}. 3D: {SOLID_SHAPES.join(', ')}.</p><p>After creating an object: “resize it to width 8 height 5”, “scale it by 2”, “rotate it 45 degrees”, “tilt it 30 degrees around the x axis” (3D), “move it right by 2”, “make it blue”. Edits target your last Ruhi object.</p></details>
      <details className="robo-command-guide"><summary>Command library · {INTELLIGENCE_EXAMPLES.length} examples</summary><label htmlFor="robo-example-search">Find an example</label><input id="robo-example-search" type="search" value={exampleSearch} onChange={e=>setExampleSearch(e.target.value)} placeholder="triangle, rotate, sphere…"/><div className="offline-assistant-examples">{Array.from(new Set(INTELLIGENCE_EXAMPLES.filter(e=>(mode==='normal'||e.mode===mode)&&e.request.toLowerCase().includes(exampleSearch.toLowerCase())).map(e=>e.request))).slice(0,12).map(request=><button key={request} onClick={()=>{setInput(request);editor.current?.focus();}}>{request}</button>)}</div><small>The offline rules understand these examples. Create an object before using an editing command.</small></details>
      </>}/>}

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
