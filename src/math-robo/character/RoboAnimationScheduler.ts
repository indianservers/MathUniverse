import { priorityFor, type Action, type ActionOptions } from './engine';
export type ScheduledAction = {
    name: Action;
    options: ActionOptions;
    start: number;
    duration: number;
    priority: number;
    rendered?: boolean;
};
export class RoboAnimationScheduler {
    active?: ScheduledAction;
    pending?: {
        name: Action;
        options: ActionOptions;
    };
    readonly log: string[] = [];
    note(message: string) { this.record(message); }
    private record(message: string) { this.log.push(message); if (this.log.length > 30)
        this.log.shift(); }
    play(name: Action, options: ActionOptions = {}, now = performance.now()) {
        const priority = options.priority ?? priorityFor(name);
        if (this.active && this.active.priority > priority) {
            this.pending = { name, options };
            this.record(`Queued ${name}`);
            return false;
        }
        if (this.active)
            this.record(`Interrupted ${this.active.name} by ${name}`);
        this.active = { name, options, start: now, duration: Math.max(100, options.duration ?? (name === 'follow' ? 4000 : 1800)), priority };
        this.record(`Start ${name}`);
        return true;
    }
    complete(now = performance.now()) { if (this.active)
        this.record(`Complete ${this.active.name}`); this.active = undefined; const queued = this.pending; this.pending = undefined; if (queued)
        this.play(queued.name, queued.options, now); }
    cancel() { if (this.active)
        this.record(`Cancelled ${this.active.name}`); this.active = undefined; this.pending = undefined; }
}
