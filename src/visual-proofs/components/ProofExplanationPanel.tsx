import { Pause, Play, Square, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MathText } from "../../components/ui/MathExpression";
import type { VisualProof } from "../data/proofTypes";
import { buildProofNarration, getProofExplanation } from "../data/proofExplanations";

export default function ProofExplanationPanel({ proof }: { proof: VisualProof }) {
  const explanation = getProofExplanation(proof);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const narration = useMemo(() => (explanation ? buildProofNarration(proof, explanation) : ""), [explanation, proof]);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!explanation) return null;

  function play() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    setPaused(false);
  }

  function pauseOrResume() {
    if (!supported || !speaking) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function stop() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }

  return (
    <section className="rounded-xl border border-cyan-200/80 bg-white/92 p-4 shadow-sm dark:border-cyan-300/20 dark:bg-white/[0.06]" aria-label="Proof explanation with text to speech">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">
            <Volume2 className="h-4 w-4" />
            Explanation
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950 dark:text-white">
            <MathText value={proof.title} mathClassName="text-[0.92em]" />
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="action-primary rounded-xl py-2" onClick={play} disabled={!supported}>
            <Play className="h-4 w-4" />
            Read
          </button>
          <button type="button" className="action-secondary rounded-xl py-2" onClick={pauseOrResume} disabled={!supported || !speaking}>
            <Pause className="h-4 w-4" />
            {paused ? "Resume" : "Pause"}
          </button>
          <button type="button" className="action-secondary rounded-xl py-2" onClick={stop} disabled={!supported || !speaking}>
            <Square className="h-4 w-4" />
            Stop
          </button>
        </div>
      </div>

      {!supported ? (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 dark:bg-amber-300/10 dark:text-amber-100">
          Text to speech is not available in this browser.
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-3">
          <ExplanationBlock title="In simple words" text={explanation.plainLanguage} />
          <ExplanationBlock title="Why the proof works" text={explanation.whyItWorks} />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-cyan-50 p-4 dark:bg-cyan-300/10">
            <h3 className="text-sm font-black uppercase tracking-wide text-cyan-800 dark:text-cyan-100">Watch for</h3>
            <ul className="mt-2 space-y-2 text-sm font-bold leading-6 text-cyan-950 dark:text-cyan-50">
              {explanation.watchFor.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <ExplanationBlock title="Common misconception" text={explanation.commonMisconception} />
          <ExplanationBlock title="Teacher prompt" text={explanation.teacherPrompt} />
        </div>
      </div>
    </section>
  );
}

function ExplanationBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-950/45">
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{text}</p>
    </div>
  );
}
