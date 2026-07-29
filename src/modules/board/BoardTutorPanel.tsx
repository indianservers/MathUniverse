import { BrainCircuit, Copy, Pause, Play, Send, Square, Trash2, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildBoardTutorContext,
  createTutorMessage,
  runBoardTutor,
  type BoardTutorResponse,
} from "./boardTutor";
import type { BoardDocument, BoardTutorMessage, BoardTutorMode } from "./types";

const MODES: Array<{ value: BoardTutorMode; label: string }> = [
  { value: "hint", label: "Hint" },
  { value: "next-step", label: "Next step" },
  { value: "check-work", label: "Check my work" },
  { value: "find-mistake", label: "Find my mistake" },
  { value: "concept", label: "Explain concept" },
  { value: "visual", label: "Visual explanation" },
  { value: "alternative", label: "Alternative method" },
  { value: "full-solution", label: "Full solution" },
  { value: "concise", label: "Concise answer" },
  { value: "exam", label: "Exam-style answer" },
  { value: "question", label: "Ask a question" },
];

type Props = {
  document: BoardDocument;
  selectedIds: string[];
  onMessagesChange: (messages: BoardTutorMessage[]) => void;
  onHighlight: (ids: string[]) => void;
  onInsert: (response: BoardTutorResponse) => void;
  onVisual: () => void;
  onCheckWork: () => void;
};

export default function BoardTutorPanel({ document, selectedIds, onMessagesChange, onHighlight, onInsert, onVisual, onCheckWork }: Props) {
  const [mode, setMode] = useState<BoardTutorMode>("hint");
  const [question, setQuestion] = useState("");
  const [working, setWorking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const context = useMemo(() => buildBoardTutorContext(document, selectedIds), [document, selectedIds]);
  const suggestions = context.selectedExpressions.length
    ? ["Give me a small hint", "What should I check next?", "Show another method"]
    : ["Select an expression", "Select several solution lines", "Type mathematics without handwriting"];

  useEffect(() => {
    setSpeechSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => globalThis.speechSynthesis?.cancel();
  }, []);

  async function submit(prompt = question) {
    const trimmed = prompt.trim() || suggestions[0];
    if (!trimmed || working) return;
    if (mode === "check-work" || mode === "find-mistake") {
      onCheckWork();
      return;
    }
    const userMessage = createTutorMessage("user", mode, trimmed, selectedIds, false);
    const controller = new AbortController();
    abortRef.current = controller;
    setWorking(true);
    onMessagesChange([...document.tutorMessages, userMessage]);
    try {
      const response = await runBoardTutor({ mode, question: trimmed, context, signal: controller.signal });
      onMessagesChange([
        ...document.tutorMessages,
        userMessage,
        createTutorMessage("tutor", mode, response.text, response.referencedElementIds, response.verified, response.verificationMethod),
      ]);
      setQuestion("");
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        onMessagesChange([
          ...document.tutorMessages,
          userMessage,
          createTutorMessage("tutor", mode, "AI Tutor unavailable. Deterministic Board tools remain available.", [], false),
        ]);
      }
    } finally {
      setWorking(false);
    }
  }

  const lastTutor = [...document.tutorMessages].reverse().find((message) => message.role === "tutor");

  return (
    <section className="space-y-3" aria-label="AI Math Tutor" data-testid="board-tutor">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 font-bold"><BrainCircuit className="h-4 w-4" />AI Math Tutor</h2>
          <p className="text-xs text-slate-500">Offline verified mode · no production AI provider configured</p>
        </div>
        <span className="mini-chip">{context.selectedExpressions.length} expressions</span>
      </div>

      <label className="block text-xs font-semibold">Tutor mode
        <select className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 dark:border-white/10 dark:bg-slate-950" value={mode} onChange={(event) => setMode(event.target.value as BoardTutorMode)}>
          {MODES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>

      <div className="rounded-lg bg-slate-100 p-2 text-xs dark:bg-white/5">
        <strong>Current context:</strong>{" "}
        {context.selectedExpressions[0]?.rawLatex ?? context.selectedResults[0]?.outputLatex ?? "No structured math selected"}
      </div>

      <div className="max-h-56 space-y-2 overflow-y-auto" aria-live="polite" aria-label="Tutor transcript">
        {document.tutorMessages.slice(-12).map((message) => (
          <button
            key={message.id}
            type="button"
            className={`block w-full rounded-lg p-2 text-left text-sm ${message.role === "tutor" ? "bg-cyan-50 dark:bg-cyan-400/10" : "bg-slate-100 dark:bg-white/5"}`}
            onClick={() => onHighlight(message.referencedElementIds)}
          >
            <span className="block text-[11px] font-bold uppercase text-slate-500">{message.role} · {message.mode} · {message.verified ? "verified" : "guidance"}</span>
            <span className="whitespace-pre-wrap">{message.text}</span>
          </button>
        ))}
        {!document.tutorMessages.length && <p className="text-sm text-slate-500">Select Board content and request a hint or explanation.</p>}
      </div>

      <div className="flex flex-wrap gap-1">
        {suggestions.map((suggestion) => <button key={suggestion} type="button" className="tool-button min-h-8 px-2 text-xs" onClick={() => void submit(suggestion)}>{suggestion}</button>)}
      </div>

      <label className="block text-xs font-semibold">Question
        <textarea className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950" rows={2} maxLength={2_000} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about the selected mathematics" />
      </label>
      <div className="flex flex-wrap gap-2">
        {working
          ? <button type="button" className="tool-button" onClick={() => abortRef.current?.abort()}><Square className="h-4 w-4" />Stop</button>
          : <button type="button" className="action-primary" onClick={() => void submit()}><Send className="h-4 w-4" />Ask tutor</button>}
        {lastTutor && <button type="button" className="tool-button" onClick={() => navigator.clipboard?.writeText(lastTutor.text)}><Copy className="h-4 w-4" />Copy</button>}
        {lastTutor && <button type="button" className="tool-button" onClick={() => onInsert({ text: lastTutor.text, verified: lastTutor.verified, verificationMethod: lastTutor.verificationMethod, referencedElementIds: lastTutor.referencedElementIds })}>Insert</button>}
        {lastTutor && speechSupported && <button type="button" className="tool-button" onClick={() => speak(lastTutor.text)}><Play className="h-4 w-4" />Read</button>}
        {speechSupported && <button type="button" className="tool-button" onClick={() => globalThis.speechSynthesis?.pause()}><Pause className="h-4 w-4" />Pause</button>}
        {speechSupported && <button type="button" className="tool-button" onClick={() => globalThis.speechSynthesis?.cancel()}><Volume2 className="h-4 w-4" />Stop audio</button>}
        {lastTutor && mode === "visual" && <button type="button" className="tool-button" onClick={onVisual}>Open visual</button>}
        <button type="button" className="tool-button" onClick={() => onMessagesChange([])} disabled={!document.tutorMessages.length}><Trash2 className="h-4 w-4" />Clear chat</button>
      </div>
    </section>
  );
}

function speak(text: string) {
  if (!globalThis.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return;
  globalThis.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(verbalizeMath(text));
  utterance.rate = 0.92;
  globalThis.speechSynthesis.speak(utterance);
}

export function verbalizeMath(value: string) {
  return value
    .replace(/\^2\b/g, " squared")
    .replace(/\^3\b/g, " cubed")
    .replace(/\\frac\{d([a-z])\}\{d([a-z])\}/gi, "the derivative of $1 with respect to $2")
    .replace(/\\int/g, "the integral")
    .replace(/\\pi/g, "pi")
    .replace(/\\/g, " ");
}
