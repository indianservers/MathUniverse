import { ArrowLeft, ChevronLeft, ChevronRight, MoreVertical, Pause, Play, RefreshCcw, SkipBack, SkipForward, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sieve-eratosthenes-mobile.css";

const stages = [2, 3, 5, 7] as const;
const stageColors: Record<number, string> = { 2: "#f18467", 3: "#efb33f", 5: "#68bdc4", 7: "#7668e8" };

function isPrime(n: number) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
}

function firstSievingFactor(n: number, stage: number) {
  for (let i = 0; i <= stage; i += 1) {
    const p = stages[i];
    if (n > p && n % p === 0) return p;
  }
  return 0;
}

export default function SieveEratosthenesMobileProof() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [menu, setMenu] = useState(false);
  const numbers = useMemo(() => Array.from({ length: 100 }, (_, index) => index + 1), []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStage(current => {
        if (current >= stages.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 850);
    return () => window.clearInterval(timer);
  }, [playing]);

  const reset = () => {
    setPlaying(false);
    setStage(0);
    setMenu(false);
  };

  return (
    <main className="sieve-proof">
      <header>
        <button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
        <div><h1>Sieve of Eratosthenes</h1><p>53 / 69</p></div>
        <button onClick={() => setMenu(value => !value)} aria-label="Lesson options"><MoreVertical /></button>
      </header>

      <section className="sieve-board" aria-label={`Number grid sieved through ${stages[stage]}`}>
        {numbers.map(number => {
          const factor = firstSievingFactor(number, stage);
          const prime = isPrime(number) && number <= stages[stage];
          return (
            <div
              key={number}
              className={`sieve-cell${factor ? " crossed" : ""}${prime ? " active-prime" : ""}`}
              style={{ "--mark": stageColors[factor || number] } as React.CSSProperties}
              aria-label={factor ? `${number}, eliminated as a multiple of ${factor}` : `${number}${isPrime(number) ? ", prime" : ""}`}
            >
              <span>{number}</span>
              {factor ? <i aria-hidden="true" /> : null}
            </div>
          );
        })}
      </section>

      <p className="sieve-range">1–100</p>

      <nav className="sieve-stages" aria-label="Sieving primes">
        {stages.map((prime, index) => (
          <div className="stage-wrap" key={prime}>
            <button
              style={{ "--stage-color": stageColors[prime] } as React.CSSProperties}
              className={`${index < stage ? "done" : ""}${index === stage ? " current" : ""}`}
              onClick={() => { setStage(index); setPlaying(false); }}
              aria-label={`Sieve multiples of ${prime}`}
              aria-pressed={index === stage}
            >{prime}</button>
            {index < stage ? <span aria-hidden="true">✓</span> : null}
          </div>
        ))}
      </nav>

      <div className="sieve-transport" aria-label="Sieve playback controls">
        <button onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pause sieve" : "Play sieve"}>{playing ? <Pause /> : <Play />}</button>
        <button onClick={() => { setPlaying(false); setStage(0); }} aria-label="First sieve stage"><SkipBack /></button>
        <button className="main-step" onClick={() => { setPlaying(false); setStage(value => Math.min(3, value + 1)); }} aria-label="Next sieve stage"><ChevronRight /></button>
        <button onClick={() => { setPlaying(false); setStage(value => Math.min(3, value + 1)); }} aria-label="Step forward"><SkipForward /></button>
        <button onClick={() => { setPlaying(false); setStage(3); }} aria-label="Last sieve stage"><SkipForward /></button>
      </div>

      <div className="sieve-timeline">
        <input aria-label="Sieve progress" type="range" min="0" max="3" step="1" value={stage} onChange={event => { setPlaying(false); setStage(Number(event.target.value)); }} />
        <div>{stages.map(prime => <i key={prime} />)}</div>
      </div>

      <button className="sieve-reset" onClick={reset} aria-label="Reset sieve"><RefreshCcw /></button>

      {menu ? <aside role="dialog" aria-label="About the Sieve of Eratosthenes">
        <button onClick={() => setMenu(false)} aria-label="Close lesson options"><X /></button>
        <h2>Why stop after 7?</h2>
        <p>Every composite up to 100 has a prime factor at most √100 = 10. After crossing multiples of 2, 3, 5, and 7, every uncrossed number greater than 1 is prime.</p>
        <button className="menu-reset" onClick={reset}>Reset lesson</button>
      </aside> : null}
    </main>
  );
}
