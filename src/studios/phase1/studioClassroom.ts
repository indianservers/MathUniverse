const STORAGE = "mu-studio-classroom";

export type ClassroomActivity = {
  code: string;
  href: string;
  paused: boolean;
  pushedAt: number;
  nickname: string;
};

function readAll(): Record<string, ClassroomActivity> {
  try {
    if (typeof localStorage === "undefined") return {};
    const raw = localStorage.getItem(STORAGE);
    return raw ? JSON.parse(raw) as Record<string, ClassroomActivity> : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, ClassroomActivity>) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE, JSON.stringify(all));
}

export type StudioSnapshot = { href: string; label: string; at: number };
const SNAP = "mu-studio-snapshots";

export function pushSnapshot(href: string, label: string) {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(SNAP);
    const list = (raw ? JSON.parse(raw) as StudioSnapshot[] : []).filter((item) => item.href !== href);
    list.unshift({ href, label, at: Date.now() });
    localStorage.setItem(SNAP, JSON.stringify(list.slice(0, 8)));
  } catch {
    /* ignore */
  }
}

export function listSnapshots(): StudioSnapshot[] {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(SNAP);
    return raw ? JSON.parse(raw) as StudioSnapshot[] : [];
  } catch {
    return [];
  }
}

export function makeClassCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function startActivity(code: string, href: string, nickname = "Teacher") {
  const all = readAll();
  const activity: ClassroomActivity = { code, href, paused: false, pushedAt: Date.now(), nickname };
  all[code] = activity;
  writeAll(all);
  return activity;
}

export function joinActivity(code: string) {
  return readAll()[code.toUpperCase()] ?? null;
}

export function pauseActivity(code: string, paused: boolean) {
  const all = readAll();
  const current = all[code];
  if (!current) return null;
  const next = { ...current, paused, pushedAt: Date.now() };
  all[code] = next;
  writeAll(all);
  return next;
}

export function activityLink(href: string, code: string) {
  const url = new URL(href, "https://math.local");
  url.searchParams.set("class", code);
  return `${url.pathname}${url.search}`;
}
