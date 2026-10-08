import { RoboAnimationScheduler } from './RoboAnimationScheduler';
import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react';
import { ACTIONS, EXPRESSIONS, RoboBehaviorEngine, neutral, roboEvents, sampleAction, type CharacterAPI, type Expression, type Target } from './engine';
import './character.css';
export type RoboCharacterHandle = CharacterAPI & {
    diagnostics: () => {
        expression: Expression;
        action: string;
        fps: number;
        latency: number;
        log: string[];
    };
};
const faces: Record<Expression, [
    number,
    number,
    number,
    number,
    number
]> = { happy: [-9, -9, 6, 0, 1], excited: [-12, -12, 10, 0, 1.2], thinking: [-3, -3, 0, -4, 1], confused: [-8, 4, -2, 2, 1], curious: [-12, -10, 3, 0, 1], sad: [5, 5, -5, 2, .7], surprised: [-13, -13, 12, 0, 1.2], proud: [-6, -6, 5, -1, 1], celebrating: [-11, -11, 10, 0, 1.2], listening: [-7, -7, 2, 0, 1], speaking: [-7, -7, 6, 0, 1], processing: [-2, -2, 0, 0, 1], searching: [-6, -6, 1, 0, 1], teaching: [-8, -8, 5, 0, 1], explaining: [-6, -6, 5, 0, 1], encouraging: [-8, -8, 6, 1, 1], error: [4, 3, -3, 1, .8], success: [-12, -12, 8, 0, 1.3], sleepy: [-2, -2, 1, 2, .6], sleeping: [0, 0, 0, 3, .4], waking: [-6, -6, 3, 0, .8], laughing: [-11, -11, 10, 1, 1.1], winking: [0, -9, 6, 0, 1], focused: [-3, -3, 0, -1, 1], waiting: [-5, -5, 2, 0, .9] };
export const RoboCharacter = forwardRef<RoboCharacterHandle, {
    thinking?: boolean;
    awake?: boolean;
    restAfter?: number;
    lookAroundAfter?: number;
    reducedMotion?: boolean;
}>(function RoboCharacter({ thinking = false, awake = false, restAfter = 90000, lookAroundAfter = 25000, reducedMotion }, ref) {
    const id = useId().replace(/:/g, ''), svg = useRef<SVGSVGElement>(null);
    const state = useRef({ expression: 'waiting' as Expression, scheduler: new RoboAnimationScheduler(), speaking: false, pausedSpeech: false, gaze: undefined as Target | undefined, lastActivity: performance.now(), fps: 60, latency: 0 });
    const api = useRef<RoboCharacterHandle>();
    if (!api.current)
        api.current = {
            setExpression(e) { if (!EXPRESSIONS.includes(e))
                throw new Error(`Unknown expression: ${e}`); if (!state.current.speaking || e === 'speaking' || e === 'error') {
                if (state.current.expression !== e)
                    state.current.scheduler.note(`Expression ${state.current.expression} → ${e}`);
                state.current.expression = e;
            } if (e !== 'speaking')
                state.current.pausedSpeech = false; state.current.lastActivity = performance.now(); },
            playAction(name, options = {}) { if (!ACTIONS.includes(name))
                throw new Error(`Unknown action: ${name}`); const s = state.current; if(s.speaking&&['celebrate','dance','jump','laugh'].includes(name)){s.scheduler.note(`Skipped ${name} during speech`);return false;} s.lastActivity = performance.now(); if (s.expression === 'sleeping')
                s.expression = 'waking'; return s.scheduler.play(name, options); },
            cancel() { const s = state.current; s.scheduler.cancel(); s.gaze = undefined; },
            gaze(t) { state.current.gaze = t; }, speech(active) { state.current.pausedSpeech = !active && state.current.speaking; state.current.speaking = active; },
            diagnostics() { const s = state.current; return { expression: s.expression, action: s.scheduler.active?.name ?? 'idle', fps: s.fps, latency: s.latency, log: [...s.scheduler.log,...roboEvents.errors.map(e=>`Error ${e}`)] }; }
        };
    useImperativeHandle(ref, () => api.current!, []);
    useEffect(() => { if (thinking)
        api.current!.setExpression('thinking');
    else if (state.current.expression === 'thinking')
        api.current!.setExpression(awake ? 'listening' : 'waiting'); }, [thinking, awake]);
    useEffect(() => {
        const root = svg.current!;
        const marker = document.createElement('div');
        marker.className = 'robo-target-marker';
        marker.setAttribute('aria-hidden', 'true');
        document.body.appendChild(marker);
        const parts = Object.fromEntries([...root.querySelectorAll<SVGElement>('[data-part]')].map(el => [el.dataset.part!, el]));
        const behavior = new RoboBehaviorEngine(api.current!);
        const unsubscribe = roboEvents.subscribe(e => { state.current.lastActivity = performance.now(); behavior.handle(e); });
        const media = matchMedia('(prefers-reduced-motion: reduce)');
        let frame = 0, last = performance.now(), nextBlink = last + 2500 + Math.random() * 3000, blinkUntil = 0, face = [...faces.waiting];
        const pose = neutral();
        let lastGaze = 0, idleCycle = 0;
        const move = (e: PointerEvent) => { const s = state.current, now = performance.now(); if (now - s.lastActivity > restAfter) {
            api.current!.setExpression('waking');
            api.current!.playAction('wave');
        } s.lastActivity = now; const r = root.getBoundingClientRect(); if (now - lastGaze > 120 && !s.scheduler.active && !s.speaking && Math.hypot(e.clientX - r.left - r.width / 2, e.clientY - r.top - r.height / 2) < 400) {
            s.gaze = { x: e.clientX, y: e.clientY };
            lastGaze = now;
        } };
        const key = () => { if (state.current.expression === 'sleeping')
            api.current!.setExpression('waking'); state.current.lastActivity = performance.now(); };
        window.addEventListener('pointermove', move, { passive: true });
        window.addEventListener('pointerdown', move, { passive: true });
        window.addEventListener('keydown', key);
        const transform = (name: string, value: string) => parts[name]?.setAttribute('transform', value);
        const tick = (now: number) => {
            const s = state.current, dt = Math.min(100, now - last);
            last = now;
            s.fps = s.fps * .95 + (1000 / Math.max(1, dt)) * .05;
            const reduce = reducedMotion ?? media.matches, idle = now - s.lastActivity, rest = idle > restAfter;
            if (rest && !s.scheduler.active && !s.speaking)
                s.expression = 'sleeping';
            else if (idle > restAfter * .7 && !s.scheduler.active && !s.speaking)
                s.expression = 'sleepy';
            const cycle = Math.floor(idle / Math.max(5000, lookAroundAfter));
            if (idle < 5000)
                idleCycle = 0;
            if (cycle > idleCycle && !rest && !s.scheduler.active && !s.speaking && !reduce) {
                idleCycle = cycle;
                s.scheduler.play('lookAround', { priority: 1, duration: 2200 }, now);
            }
            let desired = neutral();
            if (s.scheduler.active) {
                const action = s.scheduler.active, t = Math.min(1, (now - action.start) / action.duration);
                if (!action.rendered) {
                    s.latency = now - action.start;
                    action.rendered = true;
                }
                try {desired = sampleAction(action.name, reduce ? .5 : t, action.options);}catch(error){roboEvents.report(error);s.scheduler.cancel();s.expression='error';}
                if (t === 1) {
                    s.scheduler.complete(now);
                    if (!s.speaking && !s.scheduler.active && !['thinking', 'listening', 'sleeping'].includes(s.expression))
                        s.expression = 'listening';
                }
            }
            else if (s.speaking && !reduce) {
                desired = sampleAction('explain', (now % 2200) / 2200);
                desired.left *= .25;
                desired.right *= .25;
            }
            else if (!reduce) {
                desired.y = Math.sin(now / (rest ? 1800 : 950)) * (rest ? .5 : 1.1);
                desired.head = Math.sin(now / 3100) * (rest ? .4 : 1.5);
                desired.body = Math.sin(now / 2200) * .6;
                if (['excited', 'celebrating'].includes(s.expression))
                    desired.y -= Math.abs(Math.sin(now / 200)) * 4;
            }
            if (now > nextBlink) {
                blinkUntil = now + 150;
                nextBlink = now + 3000 + Math.random() * 4500;
            }
            const blink = now < blinkUntil && !reduce;
            const target = desired.target ?? s.gaze, rect = root.getBoundingClientRect();
            let gx = 0, gy = 0;
            marker.style.display = desired.target ? 'block' : 'none';
            if (desired.target) {
                marker.style.left = `${desired.target.x}px`;
                marker.style.top = `${desired.target.y}px`;
            }
            if (target) {
                gx = Math.max(-3, Math.min(3, (target.x - rect.left - rect.width / 2) / 100));
                gy = Math.max(-2, Math.min(2, (target.y - rect.top - rect.height / 3) / 120));
                if (desired.target) {
                    const sx = rect.width / 140, sy = rect.height / 160, dx = (target.x - rect.left) / sx - 100, dy = (target.y - rect.top) / sy - 86;
                    desired.right = Math.atan2(-dx, dy) * 180 / Math.PI;
                    desired.elbowR = 0;
                    desired.head = gx * 2;
                }
            }
            const lerp = reduce ? 1 : 1 - Math.exp(-dt / 100);
            for (const k of Object.keys(pose) as (keyof typeof pose)[])
                if (typeof pose[k] === 'number' && typeof desired[k] === 'number')
                    (pose as unknown as Record<string, number>)[k] += (Number(desired[k]) - Number(pose[k])) * lerp;
            transform('body', `translate(${pose.x} ${pose.y}) rotate(${pose.body} 70 115) translate(70 110) scale(${pose.scale * pose.turn} ${pose.scale}) translate(-70 -110)`);
            transform('head', `rotate(${pose.head} 72 76)`);
            transform('neck', `rotate(${pose.head * .3} 72 80)`);
            for (const [side, x, angle, elbow, wrist, leg] of [['L', 41, pose.left, pose.elbowL, pose.wristL, pose.legL], ['R', 100, pose.right, pose.elbowR, pose.wristR, pose.legR]] as const) {
                transform(`arm${side}`, `rotate(${angle} ${x} 86)`);
                transform(`forearm${side}`, `rotate(${elbow} ${x} 103)`);
                transform(`hand${side}`, `rotate(${wrist} ${x} 120)`);
                transform(`leg${side}`, `rotate(${leg} ${side === 'L' ? 56 : 86} 119)`);
                transform(`foot${side}`, `rotate(${-leg} ${side === 'L' ? 56 : 86} 140)`);
            }
            const f = faces[s.expression];
            face = face.map((v, i) => v + (f[i] - v) * lerp);
            const scan = ['searching', 'processing'].includes(s.expression) && !reduce ? Math.sin(now / 600) * 3 : 0;
            for (const [side, x, i] of [['L', 46, 0], ['R', 80, 1]] as const) {
                parts[`eye${side}`].setAttribute('d', `M${x} 46 q9 ${blink ? 0 : face[i]} 18 0`);
                transform(`pupil${side}`, `translate(${gx + scan} ${gy + face[3]})`);
                parts[`pupil${side}`].setAttribute('opacity', blink || s.expression === 'sleeping' ? '0' : '.9');
            }
            transform('eyes', `translate(0 ${face[3]})`);
            parts.eyes.setAttribute('opacity', String(face[4]));
            const talking = s.speaking && !reduce ? (2 + Math.abs(Math.sin(now / 85)) * 5) : 0;
            if (!s.pausedSpeech)
                parts.mouth.setAttribute('d', `M64 55 Q73 ${55 + face[2] + talking} 82 55 Q73 ${55 + (s.speaking ? -talking : 0)} 64 55`);
            parts.sparkles.setAttribute('opacity', s.expression === 'success' ? '1' : '0');
            if (!s.pausedSpeech)
                parts.mouth.setAttribute('fill', s.speaking || ['surprised', 'laughing'].includes(s.expression) ? '#22d3ee' : 'none');
            parts.light.setAttribute('opacity', String(reduce ? .8 : .7 + Math.sin(now / 650) * .2));
            transform('shadow', `translate(${pose.x} 0) translate(70 149) scale(${1 + pose.y / 60} 1) translate(-70 -149)`);
            const gesture=Math.round(pose.finger);parts.fingers.setAttribute('opacity', gesture > 0 ? '1' : '0');
            parts.fingers.setAttribute('data-count', String(Math.round(pose.finger)));
            [...parts.fingers.children].forEach((el, i) => el.setAttribute('visibility', gesture > 2 ? (i < gesture - 2 ? 'visible' : 'hidden') : (gesture === 2 ? i === 4 : i === 0) ? 'visible' : 'hidden'));
            for (const part of ['ears', 'antenna'])
                parts[part].setAttribute('opacity', String(reduce ? .9 : .8 + Math.sin(now / 800) * .2));
            root.dataset.expression = s.expression;
            root.dataset.action = s.scheduler.active?.name ?? 'idle';
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(frame); marker.remove(); unsubscribe(); window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', move); window.removeEventListener('keydown', key); api.current!.cancel(); };
    }, [restAfter, lookAroundAfter, reducedMotion]);
    const shell = `url(#${id}-shell)`;
    return <svg ref={svg} className="math-robo articulated-robo" viewBox="0 0 140 160" aria-hidden="true">
 <defs><linearGradient id={`${id}-shell`} x2="1" y2="1"><stop stopColor="white"/><stop offset=".5" stopColor="#e2edf2"/><stop offset=".8" stopColor="#94a9b6"/><stop offset="1" stopColor="#f8fafc"/></linearGradient><linearGradient id={`${id}-visor`} x2="0" y2="1"><stop stopColor="#182d3d"/><stop offset="1" stopColor="#020910"/></linearGradient></defs>
 <ellipse data-part="shadow" cx="70" cy="149" rx="36" ry="5" fill="#0e7490" opacity=".22"/>
 <g data-part="body" stroke="#647b89" strokeWidth="1.2">
 {(['L', 'R'] as const).map((s, i) => <g key={s} data-part={`leg${s}`}><rect x={i ? 79 : 47} y="114" width="17" height="26" rx="8" fill={shell}/><g data-part={`foot${s}`}><path d={i ? 'M80 137q24-4 26 9H79Z' : 'M63 137q-24-4-27 9h28Z'} fill={shell}/></g></g>)}
 <rect data-part="torso" x="44" y="79" width="54" height="43" rx="20" fill={shell}/><path d="M47 104q25 14 48 0" fill="none"/><rect x="61" y="113" width="20" height="6" rx="3" fill="#172b35"/>
 <g data-part="light"><circle cx="72" cy="97" r="7" fill="#102a36"/><path d="M67 97h10m-5-5v10" stroke="#67e8f9" strokeWidth="2"/></g>
 {(['L', 'R'] as const).map((s, i) => { const x = i ? 100 : 41; return <g key={s} data-part={`arm${s}`}><circle cx={x} cy="86" r="7" fill="#172b35"/><rect x={x - 6} y="87" width="12" height="19" rx="6" fill={shell}/><g data-part={`forearm${s}`}><circle cx={x} cy="103" r="4" fill="#213844"/><rect x={x - 5} y="103" width="10" height="17" rx="5" fill={shell}/><g data-part={`hand${s}`}><rect x={x - 7} y="117" width="14" height="12" rx="5" fill={shell}/>{i === 1 && <g data-part="fingers" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round">{[0, 1, 2, 3, 4].map(n => <path key={n} d={n===4?`M${x+5} 122l5-5`:`M${x-5+n*2.5} 123v9`}/>)}</g>}</g></g></g>; })}
 <rect data-part="neck" x="58" y="69" width="27" height="13" rx="6" fill="#10232d"/>
 <g data-part="head"><ellipse cx="72" cy="43" rx="48" ry="36" fill={shell}/><ellipse cx="72" cy="13" rx="29" ry="7" fill="#718691" opacity=".7"/><g data-part="ears"><rect x="19" y="33" width="10" height="24" rx="5" fill="#163444" stroke="#22d3ee"/><rect x="115" y="33" width="10" height="24" rx="5" fill="#163444" stroke="#22d3ee"/></g><g data-part="antenna"><path d="M72 8V3" stroke="#8aa8b7"/><circle cx="72" cy="3" r="3" fill="#67e8f9"/></g><rect data-part="screen" x="35" y="29" width="77" height="35" rx="17" fill={`url(#${id}-visor)`} stroke="#22d3ee" strokeWidth="1.6"/><g data-part="eyes" fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round"><path data-part="eyeL" d="M46 46q9-9 18 0"/><path data-part="eyeR" d="M80 46q9-9 18 0"/></g><circle data-part="pupilL" cx="55" cy="43" r="2" fill="#a5f3fc" stroke="none"/><circle data-part="pupilR" cx="89" cy="43" r="2" fill="#a5f3fc" stroke="none"/><g data-part="sparkles" stroke="#a5f3fc" strokeWidth="1" opacity="0"><path d="M44 38v6m-3-3h6M100 38v6m-3-3h6"/></g><path data-part="mouth" d="M64 55q9 6 18 0" fill="none" stroke="#22d3ee" strokeWidth="1.6"/><path d="M44 32h24l-9 8H40" fill="white" opacity=".12" stroke="none"/></g>
 </g></svg>;
});
