export const EXPRESSIONS = ['happy', 'excited', 'thinking', 'confused', 'curious', 'sad', 'surprised', 'proud', 'celebrating', 'listening', 'speaking', 'processing', 'searching', 'teaching', 'explaining', 'encouraging', 'error', 'success', 'sleepy', 'sleeping', 'waking', 'laughing', 'winking', 'focused', 'waiting'] as const;
export type Expression = typeof EXPRESSIONS[number];
export const ACTIONS = ['wave', 'waveGoodbye', 'bow', 'salute', 'raiseHands', 'pointLeft', 'pointRight', 'pointUp', 'pointDown', 'point', 'explain', 'shrug', 'nod', 'shakeHead', 'listen', 'jump', 'celebrate', 'clap', 'thumbsUp', 'dance', 'laugh', 'confusion', 'surprise', 'concern', 'encourage', 'walkLeft', 'walkRight', 'stepForward', 'turn', 'float', 'land', 'stretch', 'lookAround', 'lean', 'neutral', 'pointGraph', 'traceLine', 'traceCircle', 'indicateAngle', 'highlight', 'rotate', 'translate', 'scale', 'count', 'follow'] as const;
export type Action = typeof ACTIONS[number];
export type Target = {
    x: number;
    y: number;
};
export type ActionOptions = Partial<Target> & {
    path?: Target[];
    count?: number;
    priority?: number;
    duration?: number;
    target?: (progress?:number) => Target | undefined;
};
export type Pose = {
    head: number;
    body: number;
    y: number;
    x: number;
    left: number;
    right: number;
    elbowL: number;
    elbowR: number;
    wristL: number;
    wristR: number;
    legL: number;
    legR: number;
    scale: number;
    turn: number;
    finger: number;
    target?: Target;
};
export const neutral = (): Pose => ({ head: 0, body: 0, y: 0, x: 0, left: 0, right: 0, elbowL: 0, elbowR: 0, wristL: 0, wristR: 0, legL: 0, legR: 0, scale: 1, turn: 1, finger: 0 });
export const priorityFor = (a: Action) => a === 'concern' ? 6 : ['wave', 'waveGoodbye', 'land'].includes(a) ? 5 : ['point', 'pointGraph', 'traceLine', 'traceCircle', 'indicateAngle', 'highlight', 'rotate', 'translate', 'scale', 'count', 'follow'].includes(a) ? 4 : a === 'explain' ? 3 : 2;
/** Normalized keyframe sampler; joint angles are local to their parent bones. */
export function sampleAction(action: Action, t: number, o: ActionOptions = {}): Pose {
    const p = neutral(), pulse = Math.sin(Math.PI * t), beat = Math.sin(t * Math.PI * 6), fast = Math.sin(t * Math.PI * 10);
    switch (action) {
        case 'wave':
        case 'waveGoodbye':
            p.right = -145 * pulse;
            p.elbowR = 35 * pulse;
            p.wristR = 25 * fast * pulse;
            p.head = 5 * pulse;
            break;
        case 'bow':
            p.body = 18 * pulse;
            p.head = 15 * pulse;
            p.y = 4 * pulse;
            break;
        case 'salute':
            p.right = -145 * pulse;
            p.elbowR = -40 * pulse;
            p.wristR = 30 * pulse;
            break;
        case 'raiseHands':
            p.left = 145 * pulse;
            p.right = -145 * pulse;
            break;
        case 'pointLeft':
            p.left = 90 * pulse;
            p.finger = 1;
            break;
        case 'pointRight':
            p.right = -90 * pulse;
            p.finger = 1;
            break;
        case 'pointUp':
            p.right = -175 * pulse;
            p.finger = 1;
            break;
        case 'pointDown':
            p.right = -15 * pulse;
            p.elbowR = 20 * pulse;
            p.finger = 1;
            break;
        case 'point':
        case 'pointGraph':
        case 'highlight':
        case 'follow':
            p.right = -80 * pulse;
            p.finger = 1;
            p.target = o.target?.(t) ?? (o.x !== undefined && o.y !== undefined ? { x: o.x, y: o.y } : undefined);
            break;
        case 'traceLine':
        case 'traceCircle':
        case 'indicateAngle': {
            p.right = -90 * pulse;
            p.finger = 1;
            const path = o.path;
            if (path?.length) {
                const n = t * (path.length - 1), i = Math.floor(n), a = path[i], b = path[Math.min(i + 1, path.length - 1)];
                p.target = { x: a.x + (b.x - a.x) * (n - i), y: a.y + (b.y - a.y) * (n - i) };
            }
            else if(o.target){p.target=o.target(t);}
            else {
                p.elbowR = (action === 'traceCircle' ? Math.sin(t * Math.PI * 2) * 45 : action === 'indicateAngle' ? t * 90 : beat * 25) * pulse;
                p.wristR = Math.cos(t * Math.PI * 2) * 20 * pulse;
            }
            break;
        }
        case 'explain':
            p.left = 55 * pulse;
            p.right = -60 * pulse;
            p.elbowL = beat * 20 * pulse;
            p.elbowR = -beat * 20 * pulse;
            p.head = beat * 3;
            break;
        case 'shrug':
            p.left = 65 * pulse;
            p.right = -65 * pulse;
            p.elbowL = 75 * pulse;
            p.elbowR = -75 * pulse;
            p.head = -8 * pulse;
            break;
        case 'nod':
            p.head = beat * 12 * pulse;
            p.y = beat * 2 * pulse;
            break;
        case 'shakeHead':
            p.head = beat * 14 * pulse;
            p.turn = 1 - .12 * Math.abs(beat) * pulse;
            break;
        case 'listen':
            p.head = -12 * pulse;
            break;
        case 'jump':
            p.y = -22 * pulse;
            p.left = 80 * pulse;
            p.right = -80 * pulse;
            p.legL = 10 * pulse;
            p.legR = -10 * pulse;
            break;
        case 'celebrate':
            p.y = -Math.abs(beat) * 12 * pulse;
            p.left = 130 * pulse;
            p.right = -130 * pulse;
            p.wristL = fast * 20;
            p.wristR = -fast * 20;
            break;
        case 'clap':
            p.left = -35 * pulse;
            p.right = 35 * pulse;
            p.elbowL = -100 * pulse;
            p.elbowR = 100 * pulse;
            p.wristL = fast * 15 * pulse;
            p.wristR = -fast * 15 * pulse;
            break;
        case 'thumbsUp':
        case 'encourage':
            p.right = -65 * pulse;
            p.elbowR = -65 * pulse;
            p.wristR = 75 * pulse;
            p.finger = 2;
            p.head = (action === 'encourage' ? beat * 4 : -5) * pulse;
            break;
        case 'dance':
            p.body = beat * 12 * pulse;
            p.x = beat * 6 * pulse;
            p.left = 60 * pulse + beat * 30 * pulse;
            p.right = -60 * pulse + beat * 30 * pulse;
            p.legL = beat * 20 * pulse;
            p.legR = -beat * 20 * pulse;
            break;
        case 'laugh':
            p.body = fast * 4 * pulse;
            p.y = -Math.abs(fast) * 4 * pulse;
            p.head = -8 * pulse;
            break;
        case 'confusion':
            p.head = -18 * pulse;
            p.left = 35 * pulse;
            p.elbowL = 70 * pulse;
            break;
        case 'surprise':
            p.head = -8 * pulse;
            p.left = 65 * pulse;
            p.right = -65 * pulse;
            p.y = -5 * pulse;
            break;
        case 'concern':
            p.head = 12 * pulse;
            p.right = 30 * pulse;
            p.elbowR = 90 * pulse;
            break;
        case 'walkLeft':
        case 'walkRight':
            p.x = (action === 'walkLeft' ? -1 : 1) * 20 * pulse;
            p.legL = beat * 24 * pulse;
            p.legR = -beat * 24 * pulse;
            p.left = -beat * 15 * pulse;
            p.right = beat * 15 * pulse;
            p.y = -Math.abs(beat) * 2;
            break;
        case 'stepForward':
            p.scale = 1 + .12 * pulse;
            p.legL = 20 * beat * pulse;
            p.legR = -20 * beat * pulse;
            break;
        case 'turn':
            p.turn = Math.cos(t * Math.PI * 2);
            p.head = 5 * pulse;
            break;
        case 'float':
            p.y = -12 * pulse;
            p.left = 20 * pulse;
            p.right = -20 * pulse;
            break;
        case 'land':
            p.y = 7 * pulse;
            p.legL = -10 * pulse;
            p.legR = 10 * pulse;
            p.body = 4 * pulse;
            break;
        case 'stretch':
            p.left = 170 * pulse;
            p.right = -170 * pulse;
            p.head = -8 * pulse;
            break;
        case 'lookAround':
            p.head = beat * 12 * pulse;
            p.turn = 1 - .15 * Math.abs(beat) * pulse;
            break;
        case 'lean':
            p.body = 12 * pulse;
            p.head = 8 * pulse;
            break;
        case 'rotate':
            p.right = -90 * pulse;
            p.wristR = 180 * t * pulse;
            p.head = beat * 8 * pulse;
            break;
        case 'translate':
            p.left = 90 * pulse;
            p.right = -90 * pulse;
            p.x = 18 * beat * pulse;
            break;
        case 'scale':
            p.left = (40 + 80 * t) * pulse;
            p.right = -(40 + 80 * t) * pulse;
            p.elbowL = 25 * pulse;
            p.elbowR = -25 * pulse;
            break;
        case 'count':
            p.right = -95 * pulse;
            p.finger = Math.min(5, Math.max(1, Math.ceil(t * (o.count ?? 5)))) + 2;
            break;
        case 'neutral': break;
    }
    return p;
}
export type RoboEvent = {
    type: 'request' | 'thinking' | 'answer' | 'unknown' | 'error' | 'correct' | 'incorrect' | 'cancel' | 'greeting' | 'goodbye' | 'thanks' | 'listening' | 'speechStart' | 'speechPause' | 'speechResume' | 'speechEnd' | 'activity' | 'workspace';
    text?: string;
    target?: (progress?:number) => Target | undefined;
    path?: Target[];
    kind?: string;
};
const listeners = new Set<(e: RoboEvent) => void>();
export const roboEvents = { errors: [] as string[], report(error:unknown){this.errors.push(String(error));this.errors=this.errors.slice(-20);}, emit(e: RoboEvent) { listeners.forEach(fn => {try{fn(e);}catch(error){this.report(error);}}); }, subscribe(fn: (e: RoboEvent) => void) { listeners.add(fn); return () => { listeners.delete(fn); }; } };
export interface CharacterAPI {
    setExpression(e: Expression): void;
    playAction(a: Action, o?: ActionOptions): boolean;
    cancel(): void;
    gaze(t?: Target): void;
    speech(active: boolean): void;
}
/** Presentation only: never parses commands, calculates answers, or changes conversation memory. */
export class RoboBehaviorEngine {
    constructor(private robo: CharacterAPI) { }
    handle(e: RoboEvent) {
        switch (e.type) {
            case 'request':
            case 'listening':
                this.robo.setExpression('listening');
                break;
            case 'thinking':
                this.robo.cancel();
                this.robo.setExpression('thinking');
                break;
            case 'answer':
                this.robo.setExpression('explaining');
                this.robo.playAction('explain');
                break;
            case 'unknown':
                this.robo.setExpression('curious');
                this.robo.playAction('confusion');
                break;
            case 'error':
                this.robo.cancel();
                this.robo.speech(false);
                this.robo.setExpression('error');
                this.robo.playAction('concern');
                break;
            case 'correct':
                this.robo.setExpression('success');
                this.robo.playAction('celebrate');
                break;
            case 'incorrect':
                this.robo.setExpression('encouraging');
                this.robo.playAction('encourage');
                break;
            case 'cancel':
                this.robo.speech(false);
                this.robo.cancel();
                this.robo.setExpression('waiting');
                break;
            case 'greeting':
                this.robo.setExpression('happy');
                this.robo.playAction('wave');
                break;
            case 'goodbye':
                this.robo.setExpression('happy');
                this.robo.playAction('waveGoodbye');
                break;
            case 'thanks':
                this.robo.setExpression('happy');
                this.robo.playAction('nod');
                break;
            case 'speechStart':
            case 'speechResume':
                this.robo.cancel();
                this.robo.speech(true);
                this.robo.setExpression('speaking');
                break;
            case 'speechPause':
                this.robo.speech(false);
                break;
            case 'speechEnd':
                this.robo.speech(false);
                this.robo.setExpression('listening');
                break;
            case 'workspace':
                this.robo.setExpression('teaching');
                this.robo.playAction(e.kind === 'circle' ? 'traceCircle' : e.kind === 'line' ? 'traceLine' : e.kind === 'rotate' ? 'rotate' : ['move', 'translate'].includes(e.kind ?? '') ? 'translate' : e.kind === 'scale' ? 'scale' : e.kind === 'movement' ? 'follow' : 'pointGraph', { target: e.target, path: e.path });
                break;
            case 'activity':
                this.robo.playAction('land', { priority: 5 });
                break;
        }
    }
}
