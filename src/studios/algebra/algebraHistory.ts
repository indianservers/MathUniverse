export class AlgebraHistory<T> {
  private past: T[] = [];
  private future: T[] = [];
  private committed: T;
  present: T;

  constructor(initial: T) {
    this.committed = initial;
    this.present = initial;
  }

  commit(next: T) {
    if (Object.is(next, this.committed) && Object.is(next, this.present)) return this.present;
    this.past = [...this.past, this.committed].slice(-80);
    this.future = [];
    this.committed = next;
    this.present = next;
    return this.present;
  }

  replace(next: T) {
    this.present = next;
    return this.present;
  }

  undo() {
    if (!Object.is(this.present, this.committed)) {
      this.future = [...this.future, this.present];
      this.present = this.committed;
      return this.present;
    }
    const last = this.past.pop();
    if (last === undefined) return this.present;
    this.future = [...this.future, this.committed];
    this.committed = last;
    this.present = last;
    return this.present;
  }

  redo() {
    const next = this.future.pop();
    if (next === undefined) return this.present;
    this.past = [...this.past, this.committed];
    this.committed = next;
    this.present = next;
    return this.present;
  }

  reset(value: T) {
    this.past = [];
    this.future = [];
    this.committed = value;
    this.present = value;
    return this.present;
  }

  get canUndo() {
    return this.past.length > 0 || !Object.is(this.present, this.committed);
  }

  get canRedo() {
    return this.future.length > 0;
  }
}
