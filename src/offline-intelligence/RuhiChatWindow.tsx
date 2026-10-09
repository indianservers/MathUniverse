import { useEffect, useRef, useState, useMemo, type ReactNode, type RefObject } from 'react';
import { HelpCircle, Settings, X, Send, Maximize2, Minimize2, Paperclip, Box, ChartNoAxesCombined, FunctionSquare, ArrowDown, Mic } from 'lucide-react';
import MathRobot from './MathRobot';
import { MathText } from '../components/ui/MathExpression';
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
    onSend: (request?: string) => Promise<void>;
    onClose: () => void;
    onNavigate: (path: string) => void;
    onCancel: () => void;
    choices?: Awaited<ReturnType<typeof runSemanticAssistant>>;
    onClear: () => void;
    onAttach: () => void;
    preview: (answer: RuhiResponse) => ReactNode;
    settings: ReactNode;
};
type Message = {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    time: number;
    answer?: RuhiResponse;
};
let conversationSession: Message[] = [];
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
export function RuhiChatWindow(p: Props) {
    const [preferences, setPreferences] = useState(readPreferences);
    const updatePreferences = (next: ChatPreferences) => {
        setPreferences(next);
        try {
            localStorage.setItem('ruhi-chat-preferences', JSON.stringify(next));
        }
        catch { /* Preferences work for this session without storage. */ }
    };
    const [messages, setMessages] = useState<Message[]>(() => conversationSession), [overlay, setOverlay] = useState<'help' | 'settings'>(), [search, setSearch] = useState(''), [expanded, setExpanded] = useState(false), [activePreview, setActivePreview] = useState<string>(), [unread, setUnread] = useState(false), [route, setRoute] = useState<string>();
    const panel = useRef<HTMLDivElement>(null), modal = useRef<HTMLDivElement>(null), feed = useRef<HTMLDivElement>(null), seen = useRef<string | undefined>(conversationSession.at(-1)?.answer?.id), atBottom = useRef(true), readingHistory = useRef(false);
    useEffect(() => { conversationSession = messages; }, [messages]);
    useEffect(() => {
        for (const child of Array.from(panel.current?.children ?? [])) {
            if (child instanceof HTMLElement && !child.classList.contains('ruhi-overlay'))
                child.inert = Boolean(overlay || route);
        }
    }, [overlay, route]);
    useDialogFocus(!overlay && !route, panel, p.launcher);
    useDialogFocus(Boolean(overlay || route), modal);
    useEffect(() => {
        if (!p.response || seen.current === p.response.id)
            return;
        seen.current = p.response.id;
        const answer = p.response;
        setMessages(old => [...old, { id: answer.id, role: 'assistant' as const, text: answer.text, time: Date.now(), answer }].slice(-80));
        if (answer.command && preferences.autoPreview)
            setActivePreview(answer.id);
        if (!atBottom.current)
            setUnread(true);
    }, [p.response, preferences.autoPreview]);
    useEffect(() => {
        if (!atBottom.current)
            return;
        const container = feed.current;
        if (!container)
            return;
        const latest = container.querySelector<HTMLElement>('.ruhi-message:last-of-type');
        container.scrollTo({ top: latest ? latest.offsetTop - container.offsetTop : container.scrollHeight, behavior: 'auto' });
    }, [messages, p.busy]);
    useEffect(() => { const update = () => panel.current?.style.setProperty('--ruhi-viewport', `${window.visualViewport?.height ?? window.innerHeight}px`); update(); window.visualViewport?.addEventListener('resize', update); return () => window.visualViewport?.removeEventListener('resize', update); }, []);
    const send = (request = p.input) => {
        if (p.busy || !request.trim())
            return;
        if (atBottom.current){readingHistory.current=false;setUnread(false);}
        setMessages(old => [...old, { id: crypto.randomUUID(), role: 'user' as const, text: request.trim(), time: Date.now() }].slice(-80));
        void p.onSend(request);
    };
    const fill = (request: string) => { p.setInput(request); setOverlay(undefined); requestAnimationFrame(() => p.editor.current?.focus()); };
    const go = (path: string) => {
        if (liveEngine(p.mode).snapshot().objects.length)
            setRoute(path);
        else
            p.onNavigate(path);
    };
    const last = messages.at(-1), clarification = last?.answer?.clarification;
    const objects = liveEngine(p.mode).snapshot().objects;
    const candidates = (clarification?.candidates ?? []).map(value => ({ value, label: objects.find(object => object.id === value)?.label ?? value }));
    const moveChoices = Boolean(clarification?.kind === 'missing_parameters' && clarification.slots.includes('direction') && /move/i.test(clarification.question));
    const distanceChoices = Boolean(clarification?.kind === 'missing_parameters' && clarification.slots.includes('distance') && /move/i.test(clarification.question));
    const prioritized = p.mode.startsWith('graph') ? 'Graphs and visualization' : p.mode.startsWith('geometry') ? 'Drawing and geometry' : 'Getting started';
    const filtered = [...help].sort((a, b) => Number(b.name === prioritized) - Number(a.name === prioritized)).filter(category => `${category.name} ${category.text} ${category.examples.join(' ')}`.toLowerCase().includes(search.toLowerCase()));
    return <div ref={panel} data-workspace-mode={p.mode} role="dialog" aria-modal="true" aria-label="Ruhi solver and drawing assistant" tabIndex={-1} className={`offline-assistant-body ruhi-chat-window ${expanded ? 'ruhi-expanded' : ''}`} onKeyDown={e => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                if (overlay)
                    setOverlay(undefined);
                else if (route)
                    setRoute(undefined);
                else
                    p.onClose();
            }
        }}>
  <header className="ruhi-chat-header"><div className="ruhi-avatar"><MathRobot thinking={p.busy}/></div><div className="ruhi-heading"><h2>Ruhi · Master of Maths</h2><p><span className="ruhi-status-dot"/> Offline · Your maths companion</p><small>Ask, draw, solve, and refine your maths ideas.</small></div><div className="ruhi-header-actions"><button aria-label="Help" onClick={() => setOverlay('help')}><HelpCircle size={19}/></button><button aria-label="Settings" onClick={() => setOverlay('settings')}><Settings size={19}/></button><button aria-label={expanded ? 'Restore chat size' : 'Expand chat'} onClick={() => setExpanded(!expanded)}>{expanded ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}</button><button aria-label="Close Ruhi" onClick={p.onClose}><X size={20}/></button></div></header>
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
  {messages.map(message => <article className={`ruhi-message ruhi-${message.role}`} key={message.id}><div className="ruhi-message-avatar" aria-hidden="true">{message.role === 'assistant' ? <MathRobot reducedMotion/> : 'You'}</div><div className="ruhi-bubble robo-answer" data-response-id={message.answer?.id}>
  {preferences.compactAnswers && message.text.length > 700 ? <><MathText value={message.text.slice(0, 240) + '…'}/><details><summary>Read full answer</summary><MathText value={message.text}/></details></> : <MathText value={message.text}/>}
  {message.answer?.command && <section className="ruhi-result-card" aria-label={`${message.answer.command.dimension} workspace preview`}><div className="ruhi-result-heading"><strong>{message.answer.command.dimension === '3d' ? '3D' : '2D'} · {message.answer.command.expression ?? message.answer.command.kind}</strong><button onClick={() => setActivePreview(activePreview === message.id ? undefined : message.id)}>{activePreview === message.id ? 'Collapse preview' : 'Show interactive preview'}</button></div>{activePreview === message.id && p.preview(message.answer)}{message.answer.command.kind === 'plot' && message.answer.command.dimension === '2d' && message.answer.command.expression && <GraphDetails expression={message.answer.command.expression}/>}<button onClick={() => { setActivePreview(message.id); setExpanded(true); }}>Expand preview</button>{message.answer.command.kind === 'plot' && message.answer.command.expression === 'sin(x)' && <button onClick={() => fill('Plot cos(x)')}>Plot cosine</button>}</section>}
  {Boolean(message.answer?.steps?.length) && <details><summary>Show working</summary><ol>{message.answer?.steps?.map((step, i) => <li key={i}><MathText value={step}/></li>)}</ol>{p.speech.voices.length > 0 && <button onClick={() => p.speech.speak(message.answer!.steps!.join('. '))}>Read working aloud</button>}</details>}
  {message.answer?.conditions?.map((condition, i) => <p key={i} className="ruhi-condition"><MathText value={condition}/></p>)}
  {message.answer?.errorBound && <small>Error bound: {message.answer.errorBound}</small>}{message.answer?.method && <small>Method: {message.answer.method}</small>}{message.answer?.execution?.evidence.level && <small>Evidence: {message.answer.execution.evidence.level.replaceAll('_', ' ')}</small>}{message.answer?.verification && <small>Verification: {message.answer.verification.replaceAll('_', ' ')}</small>}
  {message.answer?.navigation?.requiresConfirmation && <button onClick={() => p.onNavigate(message.answer!.navigation!.path)}>Confirm workspace switch</button>}
  {message.answer?.status && ['invalid', 'unsupported', 'error'].includes(message.answer.status) && <small role="status">{message.answer.status === 'unsupported' ? 'Unsupported request' : message.answer.status === 'invalid' ? 'Request needs correction' : 'Execution failed'}</small>}<div className="ruhi-message-footer"><time dateTime={new Date(message.time).toISOString()}>{new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>{message.role === 'assistant' && <button onClick={() => setOverlay('settings')}>Suggest correction</button>}{message.role === 'assistant' && p.speech.voices.length > 0 && <button onClick={() => p.speech.speak(message.text)}>Read aloud</button>}</div>
  </div></article>)}
  {p.busy && <div className="ruhi-thinking" role="status">Ruhi is thinking <span aria-hidden="true">● ● ●</span><button onClick={p.onCancel}>Cancel</button></div>}
  {clarification && !p.busy && <div className="ruhi-chips" aria-label="Clarification choices">{candidates.map(candidate => <button key={candidate.value} onClick={() => send(candidate.label)}>{candidate.label}</button>)}{moveChoices && ['Right 2 units', 'Left 3 units', 'Up 1 unit', 'Down 4 units'].map(choice => <button key={choice} onClick={() => send(choice)}>{choice}</button>)}{distanceChoices && ['1 unit', '2 units', '3 units', '5 units'].map(choice => <button key={choice} onClick={() => send(choice)}>{choice}</button>)}<button onClick={() => p.editor.current?.focus()}>Type custom instruction…</button><button onClick={() => send('no')}>Cancel pending request</button></div>}
  </div>
  {unread && <button className="ruhi-new-response" onClick={() => { atBottom.current = true; readingHistory.current = false; setUnread(false); feed.current?.scrollTo({ top: feed.current.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }}><ArrowDown size={15}/> New response</button>}
  <footer className="ruhi-composer"><nav aria-label="Math workspaces"><button onClick={() => go('/workspace/graph')}><ChartNoAxesCombined size={17}/>2D</button><button onClick={() => go('/math-lab/3d-graphing')}><Box size={17}/>3D</button><button onClick={() => go('/algebra/cas')}><FunctionSquare size={17}/>CAS</button><button disabled={p.busy} onClick={p.onAttach}><Paperclip size={17}/>Attach canvas</button><button className="ruhi-help-link" onClick={() => setOverlay('help')}>Get help with…</button></nav><form onSubmit={e => { e.preventDefault(); send(); }}><textarea id="offline-math-request" ref={p.editor} aria-label="Ask Ruhi anything" placeholder="Ask Ruhi anything…" rows={2} maxLength={4096} value={p.input} onChange={e => p.setInput(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
            }
        }}/><button type="button" aria-label={p.speech.listening ? 'Stop dictation' : 'Dictate in English'} disabled={p.busy || p.speech.checking} onClick={() => void p.speech.microphone()}><Mic size={20}/></button><button type="submit" className="ruhi-send" aria-label="Run request" disabled={p.busy || !p.input.trim()}><Send size={22}/></button></form><small>{p.speech.listening ? p.speech.message : 'Enter to send · Shift+Enter for a new line'}</small></footer>
  {(overlay || route) && <div className="ruhi-overlay" role="dialog" aria-modal="true" aria-label={route ? 'Switch workspace' : overlay === 'help' ? 'Ruhi Help Center' : 'Ruhi Settings'} ref={modal} tabIndex={-1}><header><h3>{route ? 'Switch workspace' : overlay === 'help' ? 'How can Ruhi help you?' : 'Settings'}</h3><button aria-label="Close panel" onClick={() => { setOverlay(undefined); setRoute(undefined); }}><X size={20}/></button></header><div className="ruhi-overlay-body">{route ? <><p>Save any work you want to keep before switching workspaces. Switch now?</p><button onClick={() => { p.onNavigate(route); setRoute(undefined); }}>Switch workspace</button></> : overlay === 'help' ? <><p>Learn how to ask, draw, solve, visualize and explore mathematics.</p><label htmlFor="ruhi-help-search">Search help</label><input autoFocus id="ruhi-help-search" type="search" placeholder="Graphs, shapes, voice…" value={search} onChange={e => setSearch(e.target.value)}/><p>{filtered.length} help categories · Try fills the composer for review.</p>{filtered.map(category => <details key={category.name} open={search.length > 0 || category.name === prioritized}><summary>{category.name}</summary><p>{category.text}</p>{category.examples.map(example => <div className="ruhi-help-example" key={example}><span>{example}</span><button onClick={() => fill(example)}>Try</button></div>)}</details>)}{!filtered.length && <p>No matching help. Try “graph” or “geometry”.</p>}</> : <>{p.settings}<details><summary>Chat preferences</summary><label><input type="checkbox" checked={preferences.autoPreview} onChange={e => updatePreferences({ ...preferences, autoPreview: e.target.checked })}/> Automatically open new previews</label><label><input type="checkbox" checked={preferences.compactAnswers} onChange={e => updatePreferences({ ...preferences, compactAnswers: e.target.checked })}/> Summarize long answers</label></details><button disabled={p.busy} onClick={() => { setMessages([]); setActivePreview(undefined); setUnread(false); p.onClear(); setOverlay(undefined); }}>Clear conversation and context</button><small>This keeps workspace objects.</small></>}</div></div>}
 </div>;
}
function GraphDetails({ expression }: {
    expression: string;
}) { const findings = useMemo(() => analyzeFunction(expression, -10, 10), [expression]); return <details className="ruhi-graph-details"><summary>Graph details and analysis</summary><p>Function: <MathText value={expression}/></p><p>Analysis of the original request, on −10 ≤ x ≤ 10. Numerical findings describe this window; edited previews use their own workspace analysis.</p><dl>{findings.map(finding => <div key={finding.label}><dt>{finding.label} · {finding.status}</dt><dd><MathText value={finding.value}/><small>{finding.method}</small></dd></div>)}</dl></details>; }
