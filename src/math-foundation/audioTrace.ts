import type { PointOfInterest } from "./analysis2d";

export type AudioTraceSettings = { minimumHz: number; maximumHz: number; volume: number; speed: number; stereo: boolean; reducedSensory: boolean };
export type AudioTraceFrame = { x: number; y?: number; frequencyHz?: number; stereoPan: number; cue: "VALUE" | "X_AXIS_CROSSING" | "POINT_OF_INTEREST" | "UNDEFINED"; text: string };

export const defaultAudioTraceSettings: AudioTraceSettings = { minimumHz: 180, maximumHz: 880, volume: 0.12, speed: 1, stereo: true, reducedSensory: false };

export function createAudioTraceFrames(points: Array<{ x: number; y: number }>, viewport: { xMin: number; xMax: number; yMin: number; yMax: number }, pointsOfInterest: PointOfInterest[] = [], settings: AudioTraceSettings = defaultAudioTraceSettings): AudioTraceFrame[] {
  const ySpan = Math.max(Number.EPSILON, viewport.yMax - viewport.yMin); const xSpan = Math.max(Number.EPSILON, viewport.xMax - viewport.xMin);
  return points.map((point, index) => {
    if (!Number.isFinite(point.y)) return { x: point.x, stereoPan: 0, cue: "UNDEFINED", text: `Function undefined near x ${format(point.x)}.` };
    const normalizedY = Math.max(0, Math.min(1, (point.y - viewport.yMin) / ySpan)); const frequencyHz = Math.max(settings.minimumHz, Math.min(settings.maximumHz, settings.minimumHz * (settings.maximumHz / settings.minimumHz) ** normalizedY)); const stereoPan = settings.stereo ? Math.max(-0.85, Math.min(0.85, 2 * (point.x - viewport.xMin) / xSpan - 1)) : 0;
    const poi = pointsOfInterest.find((candidate) => candidate.x !== undefined && Math.abs(candidate.x - point.x) <= xSpan / Math.max(40, points.length)); const previous = points[index - 1]; const crossing = previous && Number.isFinite(previous.y) && Math.sign(previous.y) !== Math.sign(point.y);
    const cue = poi ? "POINT_OF_INTEREST" : crossing ? "X_AXIS_CROSSING" : "VALUE";
    return { x: point.x, y: point.y, frequencyHz, stereoPan, cue, text: poi ? `${poi.kind.toLowerCase().replaceAll("_", " ")} near x ${format(point.x)}, y ${format(point.y)}.` : crossing ? `Axis crossing near x ${format(point.x)}.` : `x ${format(point.x)}, y ${format(point.y)}.` };
  });
}

export function semanticGraphNarration(input: { curveCount: number; viewport: { xMin: number; xMax: number; yMin: number; yMax: number }; analysis?: { points: PointOfInterest[]; increasing: Array<[number, number]>; decreasing: Array<[number, number]>; diagnostics: Array<{ message: string }> } }) {
  const { viewport, analysis } = input; const parts = [`Visible window x ${viewport.xMin} to ${viewport.xMax}, y ${viewport.yMin} to ${viewport.yMax}.`, `${input.curveCount} visible curve${input.curveCount === 1 ? "" : "s"}.`];
  if (!analysis) return `${parts.join(" ")} Analysis is unavailable.`;
  const roots = analysis.points.filter((point) => point.kind === "ROOT"); const extrema = analysis.points.filter((point) => point.kind === "LOCAL_MAXIMUM" || point.kind === "LOCAL_MINIMUM"); const discontinuities = analysis.points.filter((point) => point.kind === "HOLE" || point.kind === "VERTICAL_ASYMPTOTE");
  parts.push(`${roots.length} detected root${roots.length === 1 ? "" : "s"}, ${extrema.length} extrema candidate${extrema.length === 1 ? "" : "s"}, and ${discontinuities.length} detected discontinuity feature${discontinuities.length === 1 ? "" : "s"}.`);
  if (analysis.increasing.length) parts.push(`Increasing on ${analysis.increasing.map(([a,b])=>`${format(a)} to ${format(b)}`).join(", ")}.`);
  if (analysis.decreasing.length) parts.push(`Decreasing on ${analysis.decreasing.map(([a,b])=>`${format(a)} to ${format(b)}`).join(", ")}.`);
  if (analysis.diagnostics.length) parts.push(`Warnings: ${analysis.diagnostics.map((entry)=>entry.message).join(" ")}`);
  return parts.join(" ");
}

export class BrowserAudioTrace {
  private context?: AudioContext; private oscillator?: OscillatorNode; private gain?: GainNode; private panner?: StereoPannerNode;
  async start(frame: AudioTraceFrame, settings: AudioTraceSettings = defaultAudioTraceSettings) { if (!frame.frequencyHz) return; this.stop(); this.context = new AudioContext(); await this.context.resume(); this.oscillator=this.context.createOscillator(); this.gain=this.context.createGain(); this.panner=this.context.createStereoPanner(); this.oscillator.type=settings.reducedSensory?"sine":"triangle"; this.oscillator.frequency.value=frame.frequencyHz; this.gain.gain.value=Math.min(.2,Math.max(0,settings.volume)); this.panner.pan.value=frame.stereoPan; this.oscillator.connect(this.gain).connect(this.panner).connect(this.context.destination); this.oscillator.start(); }
  update(frame: AudioTraceFrame){if(frame.frequencyHz&&this.context&&this.oscillator&&this.panner){this.oscillator.frequency.setTargetAtTime(frame.frequencyHz,this.context.currentTime,.015);this.panner.pan.setTargetAtTime(frame.stereoPan,this.context.currentTime,.015);}}
  stop(){try{this.oscillator?.stop();}catch{ /* Already stopped. */ } void this.context?.close(); this.context=undefined; this.oscillator=undefined;this.gain=undefined;this.panner=undefined;}
}
function format(value:number){return Number(value.toPrecision(7)).toString();}
