import { useEffect, useState, type RefObject } from 'react';
import { ACTIONS, EXPRESSIONS, roboEvents, type Expression, type Action, type RoboEvent } from './engine';
import type { RoboCharacterHandle } from './RoboCharacter';
import type { IntelligenceMode } from '../../offline-intelligence/commands';
import { projectRoboPoint } from './workspaceAdapter';
export function RoboAnimationLab({ character, mode, speak }: {
    character: RefObject<RoboCharacterHandle>;
    mode: IntelligenceMode;
    speak: (text: string) => void;
}) {
    const [expression, setExpression] = useState<Expression>('happy'), [action, setAction] = useState<Action>('wave'), [point, setPoint] = useState('0,0,0'), [status, setStatus] = useState(''), [info, setInfo] = useState('');
    useEffect(() => { const timer = setInterval(() => setInfo(JSON.stringify(character.current?.diagnostics(), null, 2)), 500); return () => clearInterval(timer); }, [character]);
    function target() { const coords = point.split(',').map(Number); if (coords.length < 2 || !coords.every(Number.isFinite)) {
        setStatus('Enter valid x,y,z coordinates.');
        return;
    } const t = projectRoboPoint(mode, coords); if (!t) {
        setStatus('No visible workspace projection is registered.');
        return;
    } character.current?.playAction('point', { target:()=>projectRoboPoint(mode,coords), priority: 5 }); setStatus(`Actual screen target: ${t.x.toFixed(1)}, ${t.y.toFixed(1)}`); }
    return <section className="robo-test-lab" aria-label="Developer animation lab"><strong>Math Robo · Animation Lab</strong><p>Presentation events only; simulations never change the scene or model.</p><label>Expression<select aria-label="Expression" value={expression} onChange={e => { setExpression(e.target.value as Expression); character.current?.setExpression(e.target.value as Expression); }}>{EXPRESSIONS.map(e => <option key={e}>{e}</option>)}</select></label><label>Action<select aria-label="Action" value={action} onChange={e => setAction(e.target.value as Action)}>{ACTIONS.map(a => <option key={a}>{a}</option>)}</select></label><button onClick={() => character.current?.playAction(action, { priority: 5 })}>Play action</button><button onClick={() => character.current?.cancel()}>Cancel</button><label>Real graph x,y,z<input value={point} onChange={e => setPoint(e.target.value)}/></label><button onClick={target}>Point at coordinates</button><p role="status">{status}</p><label>Simulate event<select defaultValue="" onChange={e => { if (e.target.value)
        roboEvents.emit({ type: e.target.value as RoboEvent['type'] }); }}><option value="">Choose event</option>{['thinking', 'answer', 'unknown', 'error', 'correct', 'incorrect', 'cancel', 'greeting', 'thanks', 'goodbye', 'listening'].map(e => <option key={e}>{e}</option>)}</select></label><button onClick={() => speak('The circle has a constant radius. Every point is equally far from its center.')}>Test actual speech</button><p>Mouth uses playback timing, not phoneme lip synchronization. System voices must be available.</p><pre>{info}</pre></section>;
}
