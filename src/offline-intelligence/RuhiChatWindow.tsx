import {useChatTools,type ChatMessage,type SavedChat} from './ruhiChatTools';
import {CinematicMotionControls} from '../math-robo/animation/CinematicMotionControls';
import {geometryState} from '../math-robo/intelligence/resultVerifier';
import {preparePlan} from '../math-robo/intelligence/executionPlanner';
import {subscribeRoboScene} from './workspaceBridge';
import { useEffect, useRef, useState, useMemo, memo, type ReactNode, type RefObject, type CSSProperties } from 'react';
import { HelpCircle, Settings, X, Send, Maximize2, Minimize2, Paperclip, Box, ChartNoAxesCombined, FunctionSquare, ArrowDown, Mic } from 'lucide-react';
import MathRobot from './MathRobot';
import { MathText,normalizeFormulaForKatex } from '../components/ui/MathExpression';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { liveEngine, runSemanticAssistant } from '../math-robo/intelligence/liveAssistant';
import type { useRoboSpeech } from './roboSpeech';
import type { RuhiResponse } from './OfflineMathAssistant';
import type { modeForPath } from './commands';
import { analyzeFunction } from '../graph-studio/graphIntelligence';
import './ruhiChat.css';
type Props = {
    mode: ReturnType<typeof modeForPath>;
    input: string;
    setInput: (value: string) => void;
    response?: RuhiResponse;
    busy: boolean;
    editor: RefObject<HTMLTextAreaElement>;
    launcher: RefObject<HTMLButtonElement>;
    learningStatus: string;
    speech: ReturnType<typeof useRoboSpeech>;
    onSend: (request?: string) => Promise<RuhiResponse | void>;
    onRestore: (context: string,solver?:SavedChat['solver']) => Promise<void>;
    onClose: () => void;
    onNavigate: (path: string) => void;
    onCancel: () => void;
    choices?: Awaited<ReturnType<typeof runSemanticAssistant>>;
    onClear: () => void;
    onAttach: () => void;
    preview: (answer: RuhiResponse) => ReactNode;
    settings: ReactNode;
};
type Message = ChatMessage;
const conversationSessions = new Map<string, Message[]>();
const inlineUndo = new Map<string,{id:string;hash:string}>();
type ChatPreferences = {
    autoPreview: boolean;
    compactAnswers: boolean;
};
function readPreferences(): ChatPreferences {
    try {
        const value = JSON.parse(localStorage.getItem('ruhi-chat-preferences') ?? '{}');
        return { autoPreview: value.autoPreview !== false, compactAnswers: value.compactAnswers !== false };
    }
    catch {
        return { autoPreview: true, compactAnswers: true };
    }
}
const help = [
    { name: 'Getting started', examples: ['Calculate 2 + 3', 'Draw circle radius 5'], text: 'Ask a question or describe a drawing. Use x^2 for powers and parentheses for grouping. Try fills the composer; review the instruction and press Send.' },
    { name: 'Drawing and geometry', examples: ['Draw a circle of radius 5', 'Draw a rectangle 4 by 6', 'Create a triangle', 'Create a sphere radius 3'], text: 'Create an object before asking about measurements. Solids require a 3D workspace. Name an object when references are ambiguous.' },
    { name: 'Algebra and CAS', examples: ['Solve x^2 - 4 = 0', 'Factor x^2 - 9', 'Differentiate x^3', 'Integrate x^2'], text: 'Use CAS for symbolic mathematics. Answers include working and verification when available.' },
    { name: 'Graphs and visualization', examples: ['Plot sin(x)', 'Plot y = x^2', 'Plot z = x^2 + y^2', 'Plot z = sin(x)*cos(y)'], text: '2D plots and 3D surfaces use the existing interactive workspaces. Edit expressions in a preview. Open full workspace transfers preview edits. Drag a 3D view to orbit.' },
    { name: 'Conversational commands', examples: ['Move it right by 2', 'Rotate it 90 degrees', 'Scale it by 2', 'Reflect it across the y-axis', 'What is its area?'], text: 'Create circle → Color it blue → Move it left 2 units → Increase its radius by 1. Follow-ups refer to the current construction; missing parameters prompt a question.' },
    { name: 'Mathematical explanations', examples: ['Give me a hint', 'Explain in detail', 'Show the steps', 'Verify my answer'], text: 'Ask for a hint or a fuller explanation after a calculation. Verification labels describe the evidence available; numerical checks do not prove every mathematical claim.' },
    { name: 'Voice and accessibility', examples: [], text: 'Use Dictate for English voice input where the browser supports it. Microphone permissions and an installed local English pack may be required. Local voice selection and read-aloud controls are in Settings. Enter sends; Shift+Enter adds a line. Escape closes the current panel.' },
    { name: 'Troubleshooting', examples: ['Undo that', 'Clear context'], text: 'Cannot identify an object? Name it or select it in the workspace. Supply missing measurements when asked. Unsupported requests are reported explicitly. Wait for local model initialization; inspect its status in Settings. Queue a misunderstood command as a correction for review. Suggestions do not retrain production weights. Save work before switching pages.' },
];
type ChatSize = { width: number; height: number };
const defaultChatSize: ChatSize = { width: 720, height: 790 };
function readChatSize(): ChatSize {
    try {
        const value = JSON.parse(localStorage.getItem('ruhi-chat-size') ?? 'null');
        if (value && Number.isFinite(value.width) && Number.isFinite(value.height) && value.width >= 420 && value.height >= 360)
            return { width: Math.min(value.width, 3000), height: Math.min(value.height, 3000) };
    } catch { /* Use the default when stored preferences are unavailable. */ }
    return defaultChatSize;
}
export function RuhiChatWindow(p: Props) {
    const tools = useChatTools(p.mode);
    const [toolsOpen,setToolsOpen]=useState(false),[position,setPosition]=useState<{right:number;bottom:number}>(),[deletion,setDeletion]=useState<{request:string;removed:string[];kept:string[];fingerprint:string}>(),[queue,setQueue]=useState(''),[queueState,setQueueState]=useState({running:false,index:0,total:0,message:''}),[targetId,setTargetId]=useState(''),[slotValue,setSlotValue]=useState(''),[fullscreenPreview,setFullscreenPreview]=useState<string>(),[highlightedStep,setHighlightedStep]=useState<string>();
    const [undoMessageId,setUndoMessageId]=useState<string|undefined>(()=>{const saved=inlineUndo.get(p.mode);return saved?.hash===geometryState(liveEngine(p.mode).snapshot())?saved.id:undefined;});
    const moving=useRef<{x:number;y:number;right:number;bottom:number}>(),cancelQueue=useRef(false),previewExpandedBefore=useRef(false),lastRequest=useRef<string>(),pendingSend=useRef(false);
    useEffect(()=>()=>{cancelQueue.current=true;},[]);
    const [,refreshScene]=useState(0);
    useEffect(()=>subscribeRoboScene(mode=>{if(mode===p.mode)refreshScene(n=>n+1);}),[p.mode]);

    const [size, setSize] = useState(readChatSize);
    const resizing = useRef<{ x: number; y: number; width: number; height: number }>();
    const resizeTo = (width: number, height: number) => setSize({
        width: Math.round(Math.max(Math.min(420, window.innerWidth - 40), Math.min(width, window.innerWidth - 40))),
        height: Math.round(Math.max(Math.min(360, (window.visualViewport?.height ?? window.innerHeight) - 115), Math.min(height, (window.visualViewport?.height ?? window.innerHeight) - 115))),
    });
    useEffect(() => {
        const timer = window.setTimeout(() => {
            try { localStorage.setItem('ruhi-chat-size', JSON.stringify(size)); }
            catch { /* Resizing remains available without persistent storage. */ }
        }, 250);
        return () => window.clearTimeout(timer);
    }, [size]);

    const [preferences, setPreferences] = useState(readPreferences);
    const updatePreferences = (next: ChatPreferences) => {
        setPreferences(next);
        try {
            localStorage.setItem('ruhi-chat-preferences', JSON.stringify(next));
        }
        catch { /* Preferences work for this session without storage. */ }
    };
    const [messages, setMessages] = useState<Message[]>(() => conversationSessions.get(p.mode)??[]), [overlay, setOverlay] = useState<'help' | 'settings'>(), [search, setSearch] = useState(''), [expanded, setExpanded] = useState(false), [activePreview, setActivePreview] = useState<string>(), [unread, setUnread] = useState(false), [route, setRoute] = useState<string>();
    const panel = useRef<HTMLDivElement>(null), modal = useRef<HTMLDivElement>(null), feed = useRef<HTMLDivElement>(null), seen = useRef<string | undefined>(conversationSessions.get(p.mode)?.at(-1)?.answer?.id), atBottom = useRef(true), readingHistory = useRef(false);
    useEffect(() => { conversationSessions.set(p.mode,messages); }, [messages,p.mode]);
    useEffect(() => {
        for (const child of Array.from(panel.current?.children ?? [])) {
            if (child instanceof HTMLElement && !child.classList.contains('ruhi-overlay'))
                child.inert = Boolean(overlay || route);
        }
    }, [overlay, route]);
    useDialogFocus(!overlay && !route, panel, p.launcher,p.editor);
    useDialogFocus(Boolean(overlay || route), modal);
    useEffect(() => {
        if (!p.response || seen.current === p.response.id)
            return;
        seen.current = p.response.id;
        const answer = p.response;
        if(p.choices?.plan.commands.some(command=>['UNDO','REDO'].includes(command.action))){setUndoMessageId(undefined);inlineUndo.delete(p.mode);}
        else if(p.choices?.effects.some(effect=>!['select','deselect'].includes(effect.roboControl??''))){setUndoMessageId(answer.id);inlineUndo.set(p.mode,{id:answer.id,hash:geometryState(liveEngine(p.mode).snapshot())});}
        setMessages(old => [...old, { id: answer.id, role: 'assistant' as const, text: answer.text, time: Date.now(), answer, request:lastRequest.current, mutated:Boolean(p.choices?.effects.some(effect=>!['select','deselect'].includes(effect.roboControl??''))) }].slice(-80));
        if (answer.command && preferences.autoPreview)
            setActivePreview(answer.id);
        if (!atBottom.current)
            setUnread(true);
    }, [p.response, preferences.autoPreview,p.choices?.effects,p.choices?.plan.commands,p.mode]);
    useEffect(() => {
        if (!atBottom.current)
            return;
        const container = feed.current;
        if (!container)
            return;
        const latest = container.querySelector<HTMLElement>('.ruhi-message:last-of-type');
        container.scrollTo({ top: latest ? latest.offsetTop - container.offsetTop : container.scrollHeight, behavior: 'auto' });
    }, [messages, p.busy]);
    useEffect(()=>{
        const container=feed.current;if(!container||typeof ResizeObserver==='undefined')return;
        let frame=0;
        const observer=new ResizeObserver(()=>{
            cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
                if(!atBottom.current||readingHistory.current)return;
                const latest=container.querySelector<HTMLElement>('.ruhi-message:last-of-type');
                if(latest)container.scrollTo({top:latest.offsetTop-container.offsetTop,behavior:'auto'});
            });
        });
        observer.observe(container);const latest=container.querySelector('.ruhi-message:last-of-type');if(latest)observer.observe(latest);
        return()=>{cancelAnimationFrame(frame);observer.disconnect();};
    },[messages]);
    useEffect(() => { const update = () => panel.current?.style.setProperty('--ruhi-viewport', `${window.visualViewport?.height ?? window.innerHeight}px`); update(); window.visualViewport?.addEventListener('resize', update); return () => window.visualViewport?.removeEventListener('resize', update); }, []);
    const send = async (request = p.input, confirmed = false): Promise<RuhiResponse | void> => {
        if (p.busy || pendingSend.current || !request.trim()) return;
        if(tools.search)tools.setSearch('');
        const engine=liveEngine(p.mode);
        if(deletion&&!confirmed)setDeletion(undefined);
        if(!confirmed){
            try {
                const plan=engine.parse(request);
                if(plan.commands.some(command=>command.action==='DELETE')){
                    const preview=preparePlan(plan,engine.snapshot()),after=new Set(preview.scene.objects.map(o=>o.id));
                    const removed=engine.snapshot().objects.filter(o=>!after.has(o.id));
                    if(removed.length){setDeletion({request,fingerprint:geometryState(engine.snapshot()),removed:removed.map(o=>o.label??o.id),kept:preview.scene.objects.map(o=>o.label??o.id)});return;}
                }
            } catch { /* Unresolved requests go through the engine's clarification path. */ }
        }
        pendingSend.current=true;
        if(atBottom.current){readingHistory.current=false;setUnread(false);}
        lastRequest.current=request.trim();
        setMessages(old => [...old, { id: crypto.randomUUID(), role: 'user' as const, text: request.trim(), time: Date.now() }].slice(-80));
        try{return await p.onSend(request);}finally{pendingSend.current=false;if(!toolsOpen)requestAnimationFrame(()=>p.editor.current?.focus());}
    };
    const runQueue=async()=>{
        const requests=queue.split(/\n/).map(line=>line.trim()).filter(Boolean);
        if(requests.length>30){setQueueState({running:false,index:0,total:requests.length,message:'Use at most 30 commands per queue. Nothing was executed.'});return;}
        if(!requests.length||queueState.running||p.busy)return;
        cancelQueue.current=false;setQueueState({running:true,index:0,total:requests.length,message:'Starting'});
        for(const [index,request] of requests.entries()){
            if(cancelQueue.current)break;
            setQueueState({running:true,index:index+1,total:requests.length,message:request});
            const result=await send(request);
            if(cancelQueue.current){setQueueState({running:false,index:index+(result&&result.status==='success'?1:0),total:requests.length,message:'Cancelled'});return;}
            if(!result||result.status!=='success'){setQueueState({running:false,index,total:requests.length,message:'Stopped: resolve the clarification or review the request before continuing.'});return;}
        }
        setQueueState(old=>({...old,running:false,message:cancelQueue.current?'Cancelled':'All queued commands completed'}));
    };
    const retry=async(message:Message)=>{if(!message.request||p.busy||queueState.running)return;const target=message.answer?.objectIds?.[0];if(target){const object=liveEngine(p.mode).snapshot().objects.find(object=>object.id===target);if(!object){tools.setNotice('The original target was removed. Edit the request and choose an existing object.');return;}const selected=await send('Select '+(object.label??object.id));if(!selected||selected.status!=='success')return;}await send(message.request);};
    const fill = (request: string) => { p.setInput(request); setOverlay(undefined); requestAnimationFrame(() => p.editor.current?.focus()); };
    const go = (path: string) => {
        if (liveEngine(p.mode).snapshot().objects.length)
            setRoute(path);
        else
            p.onNavigate(path);
    };
    const last = messages.at(-1), clarification = last?.answer?.clarification;
    const scene=liveEngine(p.mode).snapshot(),objects=scene.objects;
    const pending=liveEngine(p.mode).conversation.pending;
    const shownMessages=messages.filter(message=>!tools.search||message.text.toLowerCase().includes(tools.search.toLowerCase()));
    const subject=objects.find(object=>object.id===(scene.lastReferenced??scene.selectedIds.at(-1)));
    const measurementSuggestion=!subject?'Count objects':subject.type==='vector'?'Find its magnitude':subject.type==='line'||subject.type==='ray'?(p.mode.endsWith('3d')?'Find its direction':'Find its slope'):subject.type==='point'?'Find its coordinates':subject.type==='plot'?'Count objects':['sphere','cube','cuboid','cylinder','cone','prism','pyramid','ellipsoid','torus','hemisphere','frustum'].includes(subject.type)?'What is its volume?':subject.type==='plane'?'Find its equation':'What is its area?';
    const suggestions=objects.length?[measurementSuggestion,subject?'Move it right by 2':'Select '+(objects[0].label??objects[0].id),'Color it blue','Rotate it 90 degrees','Scale it by 2','Clear all except '+(subject?.label??objects[0].label??objects[0].type+'s')]:p.mode.endsWith('3d')?['Create a sphere radius 3','Create a cube','Plot z = x^2 + y^2']:['Draw circle radius 5','Draw rectangle 4 by 6','Create a triangle','Plot sin(x)'];
    const complete=tools.search?[]:[...new Set([...suggestions,...help.flatMap(category=>category.examples)])].filter(value=>p.input.trim().length>1&&value.toLowerCase().startsWith(p.input.toLowerCase())&&value.toLowerCase()!==p.input.toLowerCase()).slice(0,6);
    const restore=async(chat:typeof tools.saved[number])=>{try{if(chat.context)await p.onRestore(chat.context,chat.solver);setMessages(chat.messages);setUndoMessageId(undefined);inlineUndo.delete(p.mode);tools.restorePins(chat.pins,chat.messages);tools.setName(chat.name);setActivePreview(undefined);lastRequest.current=undefined;tools.setNotice('Conversation and workspace restored. Select an object before a follow-up if needed.');}catch(error){tools.setNotice(error instanceof Error?error.message:'Could not restore this conversation.');}};

    const candidates = (clarification?.candidates ?? []).map(value => ({ value, label: objects.find(object => object.id === value)?.label ?? value }));
    const moveChoices = Boolean(clarification?.kind === 'missing_parameters' && clarification.slots.includes('direction') && /move/i.test(clarification.question));
    const distanceChoices = Boolean(clarification?.kind === 'missing_parameters' && clarification.slots.includes('distance') && /move/i.test(clarification.question));
    const prioritized = p.mode.startsWith('graph') ? 'Graphs and visualization' : p.mode.startsWith('geometry') ? 'Drawing and geometry' : 'Getting started';
    const filtered = [...help].sort((a, b) => Number(b.name === prioritized) - Number(a.name === prioritized)).filter(category => `${category.name} ${category.text} ${category.examples.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
    return <div ref={panel} data-workspace-mode={p.mode} style={{ '--ruhi-width': `${size.width}px`, '--ruhi-height': `${size.height}px`, '--ruhi-font-size': `${tools.appearance.fontSize}px`, ...(position&&!expanded&&tools.appearance.dock==='floating'?{'--ruhi-right':`${position.right}px`,'--ruhi-bottom':`${position.bottom}px`}:{}) } as CSSProperties} role="dialog" aria-modal="true" aria-label="Ruhi solver and drawing assistant" tabIndex={-1} className={`offline-assistant-body ruhi-chat-window ${expanded ? 'ruhi-expanded' : ''} ${tools.appearance.compact?'ruhi-compact':''} ${tools.appearance.contrast?'ruhi-high-contrast':''} ruhi-dock-${tools.appearance.dock} ${fullscreenPreview?'ruhi-preview-fullscreen':''}`} onKeyDown={e => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                if(fullscreenPreview){setFullscreenPreview(undefined);setExpanded(previewExpandedBefore.current);}
                else if (overlay)
                    setOverlay(undefined);
                else if (route)
                    setRoute(undefined);
                else
                    p.onClose();
            }
        }}>
  <button className="ruhi-resize-handle" aria-label="Resize chat window" title="Drag to resize. Arrow keys resize; Home or double-click resets." onDoubleClick={() => setSize(defaultChatSize)} onPointerDown={e => {
      if (e.button !== 0) return;
      const bounds = panel.current!.getBoundingClientRect();
      resizing.current = { x: e.clientX, y: e.clientY, width: bounds.width, height: bounds.height };
      e.currentTarget.setPointerCapture(e.pointerId);
      e.preventDefault();
  }} onPointerMove={e => {
      const start = resizing.current;
      if (start) resizeTo(start.width + start.x - e.clientX, start.height + start.y - e.clientY);
  }} onPointerUp={e => {
      resizing.current = undefined;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }} onLostPointerCapture={() => { resizing.current = undefined; }} onPointerCancel={() => { resizing.current = undefined; }} onKeyDown={e => {
      if (e.key === 'Home') { e.preventDefault(); setSize(defaultChatSize); }
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      const bounds = panel.current!.getBoundingClientRect(), step = e.shiftKey ? 8 : 32;
      resizeTo(bounds.width + (e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0), bounds.height + (e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0));
  }}><span aria-hidden="true">↖</span></button>
  <header className="ruhi-chat-header" onPointerDown={e=>{
      if(window.innerWidth<=600||(e.target as HTMLElement).closest('button')||expanded||tools.appearance.dock!=='floating'||e.button!==0)return;
      const bounds=panel.current!.getBoundingClientRect();moving.current={x:e.clientX,y:e.clientY,right:window.innerWidth-bounds.right,bottom:window.innerHeight-bounds.bottom};e.currentTarget.setPointerCapture(e.pointerId);
  }} onPointerMove={e=>{const start=moving.current,bounds=panel.current?.getBoundingClientRect();if(start&&bounds)setPosition({right:Math.max(0,Math.min(window.innerWidth-bounds.width,start.right+start.x-e.clientX)),bottom:Math.max(0,Math.min(window.innerHeight-bounds.height,start.bottom+start.y-e.clientY))});}} onPointerUp={()=>{moving.current=undefined;}} onLostPointerCapture={()=>{moving.current=undefined;}}><span className="ruhi-workspace-badge">{p.mode.replace('geometry','Geometry ').replace('graph','Graph ').replace('normal','Maths').replace('2d','2D').replace('3d','3D')}</span><div className="ruhi-avatar"><MathRobot thinking={p.busy}/></div><div className="ruhi-heading"><h2>Ruhi · Master of Maths</h2><p><span className="ruhi-status-dot"/> Offline · Your maths companion</p><small>Ask, draw, solve, and refine your maths ideas.</small></div><div className="ruhi-header-actions"><button aria-label="Chat tools" aria-expanded={toolsOpen} onClick={()=>setToolsOpen(!toolsOpen)}>☰</button><button aria-label="Help" onClick={() => setOverlay('help')}><HelpCircle size={19}/></button><button aria-label="Settings" onClick={() => setOverlay('settings')}><Settings size={19}/></button><button aria-label={expanded ? 'Restore chat size' : 'Expand chat'} onClick={() => setExpanded(!expanded)}>{expanded ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}</button><button aria-label="Close Ruhi" onClick={p.onClose}><X size={20}/></button></div></header>
  {toolsOpen&&<section className="ruhi-tools" aria-label="Chat tools"><label>Conversation name<input value={tools.name} onChange={e=>tools.setName(e.target.value)} maxLength={80}/></label><div className="ruhi-tool-row"><button onClick={()=>tools.save(messages,liveEngine(p.mode).exportState(),liveEngine(p.mode).engineRouter.exportContext())}>Save conversation</button><button onClick={()=>tools.exportChat(messages,'markdown')}>Export Markdown</button><button onClick={()=>tools.exportChat(messages,'print')}>Print / PDF</button></div><label>Search conversation<input type="search" value={tools.search} onChange={e=>tools.setSearch(e.target.value)}/></label><div className="ruhi-tool-row"><label>Font size<input type="range" min={12} max={22} value={tools.appearance.fontSize} onChange={e=>tools.setAppearance({...tools.appearance,fontSize:Number(e.target.value)})}/></label><label><input type="checkbox" checked={tools.appearance.contrast} onChange={e=>tools.setAppearance({...tools.appearance,contrast:e.target.checked})}/>High contrast</label><label><input type="checkbox" checked={tools.appearance.compact} onChange={e=>tools.setAppearance({...tools.appearance,compact:e.target.checked})}/>Compact header</label><label>Dock<select aria-label="Dock" value={tools.appearance.dock} onChange={e=>{setPosition(undefined);tools.setAppearance({...tools.appearance,dock:e.target.value as typeof tools.appearance.dock});}}><option value="floating">Floating</option><option value="left">Left</option><option value="right">Right</option></select></label>{[['Compact',480,520],['Balanced',720,790],['Wide',1000,850]].map(([label,width,height])=><button key={label} onClick={()=>resizeTo(Number(width),Number(height))}>{label}</button>)}</div><details><summary>Saved conversations ({tools.saved.filter(chat=>chat.mode===p.mode).length})</summary>{tools.saved.filter(chat=>chat.mode===p.mode).map(chat=><div className="ruhi-tool-row" key={chat.id}><span>{chat.name}</span><button disabled={p.busy} onClick={()=>void restore(chat)}>Restore conversation and workspace</button><button onClick={()=>tools.remove(chat.id)}>Remove saved conversation</button></div>)}</details><details><summary>Pinned answers ({tools.pins.length})</summary>{tools.pinnedAnswers.map(m=><blockquote key={m.id}><MathText value={m.text}/></blockquote>)}</details><details><summary>Working memory</summary><p>“It”: {objects.find(o=>o.id===scene.lastReferenced)?.label??'No active reference'}</p><p>Selected: {scene.selectedIds.map(id=>objects.find(o=>o.id===id)?.label??id).join(', ')||'None'}</p><p>Pending: {pending?.question??'None'}</p><p>Previous result: {scene.previousResult===undefined?'None':JSON.stringify(scene.previousResult)}</p></details><details><summary>Command queue</summary><label>One instruction per line<textarea aria-label="Queued commands" maxLength={120000} value={queue} onChange={e=>setQueue(e.target.value)}/></label><button disabled={p.busy||queueState.running} onClick={()=>void runQueue()}>Run command queue</button><button disabled={!queueState.running} onClick={()=>{cancelQueue.current=true;p.onCancel();}}>Cancel queue</button><p role="status">{queueState.index}/{queueState.total} · {queueState.message}</p></details><CinematicMotionControls/></section>}
  {tools.notice&&<div className="ruhi-notice" role="status">{tools.notice}<button aria-label="Dismiss notice" onClick={()=>tools.setNotice('')}>×</button></div>}
  <div className="ruhi-conversation" ref={feed} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" onWheel={() => { readingHistory.current = true; }} onTouchMove={() => { readingHistory.current = true; }} onPointerDown={e => { if (e.target === e.currentTarget)
        readingHistory.current = true; }} onKeyDown={e => { if (['PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes(e.key))
        readingHistory.current = true; }} onScroll={() => {
            const el = feed.current;
            if (el && readingHistory.current) {
                atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
                if (atBottom.current){readingHistory.current=false;setUnread(false);}
            }
        }}>
  {!messages.length && <div className="ruhi-welcome"><h3>Hello, learners and explorers. I’m Ruhi!</h3><p>Your Master of Maths. Let’s explore a graph, build a shape, or solve a problem together.</p><div className="ruhi-chips">{['Plot sin(x)', 'Draw a circle of radius 5', 'Solve x^2 - 4 = 0'].map(example => <button key={example} onClick={() => fill(example)}>{example}</button>)}</div></div>}
  {tools.search&&!shownMessages.length&&<p role="status">No matching messages.</p>}
  {shownMessages.map(message => <article className={`ruhi-message ruhi-${message.role}`} key={message.id}><div className="ruhi-message-avatar" aria-hidden="true">{message.role === 'assistant' ? <MathRobot reducedMotion/> : 'You'}</div><div className="ruhi-bubble robo-answer" data-message-id={message.id} data-response-id={message.answer?.id}>
  {preferences.compactAnswers && message.text.length > 700 ? <><MathText value={message.text.slice(0, 240) + '…'}/><details><summary>Read full answer</summary><MathText value={message.text}/></details></> : <MathText value={message.text}/>}
  {message.answer?.command && <section className="ruhi-result-card" aria-label={`${message.answer.command.dimension} workspace preview`}><div className="ruhi-result-heading"><strong>{message.answer.command.dimension === '3d' ? '3D' : '2D'} · {message.answer.command.expression ?? message.answer.command.kind}</strong><button onClick={() => setActivePreview(activePreview === message.id ? undefined : message.id)}>{activePreview === message.id ? 'Collapse preview' : 'Show interactive preview'}</button></div>{activePreview === message.id && <div className={fullscreenPreview===message.id?'ruhi-fullscreen-visual':''}>{fullscreenPreview===message.id&&<button onClick={()=>{setFullscreenPreview(undefined);setExpanded(previewExpandedBefore.current);}}>Exit full-screen preview</button>}{<WorkspacePreview answer={message.answer} render={p.preview}/>}</div>}{message.answer.command.kind === 'plot' && message.answer.command.dimension === '2d' && message.answer.command.expression && <GraphDetails expression={message.answer.command.expression}/>}<button onClick={() => { setActivePreview(message.id);previewExpandedBefore.current=expanded; setExpanded(true);setFullscreenPreview(message.id); }}>Full-screen preview</button>{message.answer.command.kind === 'plot' && message.answer.command.expression === 'sin(x)' && <button onClick={() => fill('Plot cos(x)')}>Plot cosine</button>}</section>}
  {Boolean(message.answer?.steps?.length) && <details><summary>Show working</summary><ol>{message.answer?.steps?.map((step, i) => <li key={i} className={highlightedStep===message.id+':'+i?'ruhi-highlighted-step':''}><MathText value={step}/>{objects.filter(object=>message.answer?.objectIds?.includes(object.id)||object.label&&step.toLowerCase().split(/[^a-z0-9_-]+/).includes(object.label.toLowerCase())).map(object=><button key={object.id} onClick={()=>{setHighlightedStep(message.id+':'+i);void send('Select '+object.label);}}>Highlight {object.label}</button>)}</li>)}</ol>{p.speech.voices.length > 0 && <button onClick={() => p.speech.speak(message.answer!.steps!.join('. '))}>Read working aloud</button>}</details>}
  {message.answer?.conditions?.map((condition, i) => <p key={i} className="ruhi-condition"><MathText value={condition}/></p>)}
  {message.answer?.errorBound && <small>Error bound: {message.answer.errorBound}</small>}{message.answer?.method && <small>Method: {message.answer.method}</small>}{message.answer?.execution?.evidence.level && <small>Evidence: {message.answer.execution.evidence.level.replaceAll('_', ' ')}</small>}{message.answer?.verification && <small>Verification: {message.answer.verification.replaceAll('_', ' ')}</small>}
  {message.answer?.navigation?.requiresConfirmation && <button onClick={() => p.onNavigate(message.answer!.navigation!.path)}>Confirm workspace switch</button>}
  {message.answer?.status && ['invalid', 'unsupported', 'error'].includes(message.answer.status) && <small role="status">{message.answer.status === 'unsupported' ? 'Unsupported request' : message.answer.status === 'invalid' ? 'Request needs correction' : 'Execution failed'}</small>}<div className="ruhi-message-footer"><button onClick={()=>void tools.copy(message.text)}>Copy text</button>{(/[=^]|\\(?:frac|sqrt|int)/.test(message.text)||message.answer?.command?.expression)&&<button onClick={()=>{const bubble=Array.from(panel.current?.querySelectorAll('[data-message-id]')??[]).find(element=>element.getAttribute('data-message-id')===message.id);const sources=[...new Set(Array.from(bubble?.querySelectorAll('annotation[encoding="application/x-tex"]')??[]).map(element=>element.textContent??'').filter(Boolean))];void tools.copy(sources.length?sources.join('\n'):normalizeFormulaForKatex(message.answer?.command?.expression??message.text));}}>Copy LaTeX source</button>}<button aria-pressed={tools.pins.includes(message.id)} onClick={()=>tools.pin(message)}>{tools.pins.includes(message.id)?'Unpin':'Pin'}</button>{message.role==='user'&&<button disabled={p.busy} onClick={()=>fill(message.text)}>Edit and resend</button>}{message.answer?.status&&['invalid','unsupported','error'].includes(message.answer.status)&&message.request&&<button disabled={p.busy} onClick={()=>void retry(message)}>Retry request</button>}{message.mutated&&<button disabled={p.busy||undoMessageId!==message.id||inlineUndo.get(p.mode)?.hash!==geometryState(scene)} onClick={()=>void send('Undo that')}>Undo this action</button>}<time dateTime={new Date(message.time).toISOString()}>{new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>{message.role === 'assistant' && <button onClick={() => setOverlay('settings')}>Suggest correction</button>}{message.role === 'assistant' && p.speech.voices.length > 0 && <button onClick={() => p.speech.speak(message.text)}>Read aloud</button>}</div>
  </div></article>)}
  {p.busy && <div className="ruhi-thinking" role="status">Ruhi is thinking <span aria-hidden="true">● ● ●</span><button onClick={p.onCancel}>Cancel</button></div>}
  {clarification && !p.busy && <div className="ruhi-chips" aria-label="Clarification choices">{candidates.map(candidate => <button key={candidate.value} onClick={() => send(candidate.label)}>{candidate.label}</button>)}{moveChoices && ['Right 2 units', 'Left 3 units', 'Up 1 unit', 'Down 4 units'].map(choice => <button key={choice} onClick={() => send(choice)}>{choice}</button>)}{distanceChoices && ['1 unit', '2 units', '3 units', '5 units'].map(choice => <button key={choice} onClick={() => send(choice)}>{choice}</button>)}<button onClick={() => p.editor.current?.focus()}>Type custom instruction…</button><button onClick={() => send('no')}>Cancel pending request</button></div>}
  </div>
  {deletion&&<section className="ruhi-deletion-preview" role="dialog" aria-label="Review deletion"><strong>Review before deleting</strong><p className="ruhi-delete-list">Delete: {deletion.removed.join(', ')}</p><p className="ruhi-keep-list">Keep: {deletion.kept.join(', ')||'No objects'}</p><button disabled={p.busy} onClick={()=>{const request=deletion.request,unchanged=deletion.fingerprint===geometryState(liveEngine(p.mode).snapshot());setDeletion(undefined);void send(request,unchanged);}}>Confirm deletion</button><button onClick={()=>setDeletion(undefined)}>Cancel deletion</button></section>}
  {unread && <button className="ruhi-new-response" onClick={() => { atBottom.current = true; readingHistory.current = false; setUnread(false); feed.current?.scrollTo({ top: feed.current.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }}><ArrowDown size={15}/> New response</button>}
  <footer className="ruhi-composer"><details className="ruhi-assistance-tools"><summary>Targets, hints and practice</summary><div className="ruhi-scene-tools"><label>Target<select aria-label="Command target" disabled={p.busy||Boolean(pending&&pending.slot!=='target')} value={targetId} onChange={e=>{setTargetId(e.target.value);const object=objects.find(o=>o.id===e.target.value);if(object)void send(pending?.slot==='target'?(object.label??object.id):'Select '+(object.label??object.id));}}><option value="">Use conversational reference</option>{objects.map(o=><option key={o.id} value={o.id}>{o.label??o.id} · {o.type}</option>)}</select></label><button disabled={p.busy} onClick={()=>{tools.setHintLevel(n=>n+1);void send(tools.hintLevel?'Give me another hint':'Give me a hint');}}>Hint {tools.hintLevel+1}</button><label><input type="checkbox" checked={tools.practice} onChange={e=>{tools.setPractice(e.target.checked);if(e.target.checked)void send('Quiz me on '+(objects.find(o=>o.id===scene.lastReferenced)?.type??'algebra'));}}/>Guided practice</label></div>{tools.practice&&<div className="ruhi-tool-row"><input aria-label="Practice answer" placeholder="Your answer" value={tools.attempt} onChange={e=>tools.setAttempt(e.target.value)}/><button disabled={p.busy||!tools.attempt.trim()} onClick={()=>void send('My answer is '+tools.attempt)}>Check answer</button><button disabled={p.busy} onClick={()=>void send('Give me another example')}>Next question</button><button disabled={p.busy} onClick={()=>void send('Show answer')}>Show solution</button></div>}</details>{pending&&<div className="ruhi-tool-row"><label>{pending.slot}<input aria-label="Clarification value" placeholder={['position','destination','points'].includes(pending.slot)?'(x, y) or (x, y, z)':pending.slot==='direction'?'right 2 units':pending.slot==='angle'?'90 degrees':'Enter '+pending.slot} value={slotValue} onChange={e=>setSlotValue(e.target.value)}/></label><button disabled={p.busy||!slotValue.trim()} onClick={()=>{void send(slotValue);setSlotValue('');}}>Apply clarification</button></div>}<div className="ruhi-chips" aria-label="Scene suggestions">{suggestions.slice(0,3).map(request=><button key={request} onClick={()=>fill(request)}>{request}</button>)}</div><nav aria-label="Math workspaces"><button onClick={() => go('/workspace/graph')}><ChartNoAxesCombined size={17}/>2D</button><button onClick={() => go('/math-lab/3d-graphing')}><Box size={17}/>3D</button><button onClick={() => go('/algebra/cas')}><FunctionSquare size={17}/>CAS</button><button disabled={p.busy} onClick={p.onAttach}><Paperclip size={17}/>Attach canvas</button><button className="ruhi-help-link" onClick={() => setOverlay('help')}>Get help with…</button></nav><form onSubmit={e => { e.preventDefault(); void send(); }}><textarea id="offline-math-request" ref={p.editor} aria-label="Ask Ruhi anything" placeholder="Ask Ruhi anything…" rows={2} maxLength={4096} value={p.input} onChange={e => p.setInput(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
            }
        }}/><button type="button" aria-label={p.speech.listening ? 'Stop dictation' : 'Dictate in English'} disabled={p.busy || p.speech.checking} onClick={() => void p.speech.microphone()}><Mic size={20}/></button><button type="submit" className="ruhi-send" aria-label="Run request" disabled={p.busy || !p.input.trim()}><Send size={22}/></button></form>{complete.length>0&&<div className="ruhi-chips" aria-label="Command autocomplete">{complete.map(request=><button key={request} onClick={()=>fill(request)}>{request}</button>)}</div>}<small>{p.speech.listening ? p.speech.message : 'Review dictated text before sending · Enter to send · Shift+Enter for a new line'}</small></footer>
  {(overlay || route) && <div className="ruhi-overlay" role="dialog" aria-modal="true" aria-label={route ? 'Switch workspace' : overlay === 'help' ? 'Ruhi Help Center' : 'Ruhi Settings'} ref={modal} tabIndex={-1}><header><h3>{route ? 'Switch workspace' : overlay === 'help' ? 'How can Ruhi help you?' : 'Settings'}</h3><button aria-label="Close panel" onClick={() => { setOverlay(undefined); setRoute(undefined); }}><X size={20}/></button></header><div className="ruhi-overlay-body">{route ? <><p>Save any work you want to keep before switching workspaces. Switch now?</p><button onClick={() => { p.onNavigate(route); setRoute(undefined); }}>Switch workspace</button></> : overlay === 'help' ? <><p>Learn how to ask, draw, solve, visualize and explore mathematics.</p><label htmlFor="ruhi-help-search">Search help</label><input autoFocus id="ruhi-help-search" type="search" placeholder="Graphs, shapes, voice…" value={search} onChange={e => setSearch(e.target.value)}/><p>{filtered.length} help categories · Try fills the composer for review.</p>{filtered.map(category => <details key={category.name} open={search.length > 0 || category.name === prioritized}><summary>{category.name}</summary><p>{category.text}</p>{category.examples.map(example => <div className="ruhi-help-example" key={example}><span>{example}</span><button onClick={() => fill(example)}>Try</button></div>)}</details>)}{!filtered.length && <p>No matching help. Try “graph” or “geometry”.</p>}</> : <>{p.settings}<details><summary>Chat preferences</summary><label><input type="checkbox" checked={preferences.autoPreview} onChange={e => updatePreferences({ ...preferences, autoPreview: e.target.checked })}/> Automatically open new previews</label><label><input type="checkbox" checked={preferences.compactAnswers} onChange={e => updatePreferences({ ...preferences, compactAnswers: e.target.checked })}/> Summarize long answers</label></details><button disabled={p.busy} onClick={() => { setMessages([]); setActivePreview(undefined); setUnread(false); p.onClear(); setOverlay(undefined); }}>Clear conversation and context</button><small>This keeps workspace objects.</small></>}</div></div>}
 </div>;
}
function GraphDetails({ expression }: {
    expression: string;
}) { const findings = useMemo(() => analyzeFunction(expression, -10, 10), [expression]); return <details className="ruhi-graph-details"><summary>Graph details and analysis</summary><p>Function: <MathText value={expression}/></p><p>Analysis of the original request, on −10 ≤ x ≤ 10. Numerical findings describe this window; edited previews use their own workspace analysis.</p><dl>{findings.map(finding => <div key={finding.label}><dt>{finding.label} · {finding.status}</dt><dd><MathText value={finding.value}/><small>{finding.method}</small></dd></div>)}</dl></details>; }

const WorkspacePreview=memo(function WorkspacePreview({answer,render}:{answer:RuhiResponse;render:(answer:RuhiResponse)=>ReactNode}){return render(answer);});
