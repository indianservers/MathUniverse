import { useState } from "react";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, StatusOk } from "../../mockup/studioLabKit";
import { FigureToolbar, Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import { useStudioFigure } from "../../phase1/useStudioFigure";
import { affine, avalancheBits, caesar, dhMix, letterFreq, modInverse, modPow, toyHash, vigenere } from "./cryptoMath";

type Fig = { p: number; q: number; e: number; m: number; shift: number; a: number; b: number };
const initial: Fig = { p: 61, q: 53, e: 17, m: 72, shift: 3, a: 5, b: 8 };

export default function CryptographyLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure(initial);
  const [plain, setPlain] = useState("HELLO MATH");
  const [key, setKey] = useState("KEY");
  const n = fig.state.p * fig.state.q;
  const phi = (fig.state.p - 1) * (fig.state.q - 1);
  const d = modInverse(fig.state.e, phi);
  const pow = modPow(fig.state.m, fig.state.e, n);
  const recovered = modPow(pow.value, d, n).value;
  const freq = letterFreq(plain);
  const mix = dhMix(6, 15, 5, 23);

  return (
    <Phase1LabChrome
      page={page}
      toolbar={
        <FigureToolbar
          canUndo={fig.canUndo}
          canRedo={fig.canRedo}
          exact={fig.exact}
          onUndo={fig.undo}
          onRedo={fig.redo}
          onReset={fig.reset}
          onShare={() => void fig.share()}
          onExact={fig.setExact}
        />
      }
    >
      {(mode) => (
        <>
          <Panel title={mode === "RSA Concept" ? "1. Key generation (RSA concept)" : mode}>
            {mode === "RSA Concept" ? (
              <>
                <SliderRow label="Prime p" value={fig.state.p} min={11} max={97} step={2} onChange={(p) => fig.commit({ ...fig.state, p })} />
                <SliderRow label="Prime q" value={fig.state.q} min={11} max={97} step={2} onChange={(q) => fig.commit({ ...fig.state, q })} />
                <SliderRow label="Public exponent e" value={fig.state.e} min={3} max={19} step={2} onChange={(e) => fig.commit({ ...fig.state, e })} />
                <SliderRow label="Plaintext m" value={fig.state.m} min={2} max={200} step={1} onChange={(m) => fig.commit({ ...fig.state, m })} />
                <p className="msk-note">Educational keys only — no real secrets.</p>
              </>
            ) : mode === "Caesar" || mode === "Affine" || mode === "Vigenère" ? (
              <>
                <label className="msk-note">Plaintext <input value={plain} onChange={(e) => setPlain(e.target.value.toUpperCase())} /></label>
                {mode === "Caesar" ? <SliderRow label="Shift" value={fig.state.shift} min={0} max={25} step={1} onChange={(shift) => fig.commit({ ...fig.state, shift })} /> : null}
                {mode === "Affine" ? (
                  <>
                    <SliderRow label="a" value={fig.state.a} min={1} max={25} step={2} onChange={(a) => fig.commit({ ...fig.state, a })} />
                    <SliderRow label="b" value={fig.state.b} min={0} max={25} step={1} onChange={(b) => fig.commit({ ...fig.state, b })} />
                  </>
                ) : null}
                {mode === "Vigenère" ? <label className="msk-note">Key <input value={key} onChange={(e) => setKey(e.target.value)} /></label> : null}
              </>
            ) : mode === "Diffie-Hellman" ? (
              <p className="msk-note">Paint-mix metaphor: Alice mixes yellow+secret, Bob mixes cyan+secret, they swap public paints and both reach the same brown (shared secret {mix.shared}).</p>
            ) : (
              <p className="msk-note">Flip one letter. The toy hash should avalanche.</p>
            )}
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            {mode === "RSA Concept" ? (
              <>
                <svg className="msk-graph" viewBox="0 0 360 220" role="img" aria-label="Modular exponentiation clock">
                  <rect width="360" height="220" fill="#f8fbff" />
                  <circle cx="180" cy="110" r="78" fill="none" stroke="#147df2" />
                  {pow.trail.slice(0, 8).map((v, i) => {
                    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                    return <circle key={i} cx={180 + Math.cos(a) * 78} cy={110 + Math.sin(a) * 78} r={i === pow.trail.length - 1 ? 7 : 4} fill={i === 3 ? "#f59e0b" : "#8b45f4"} />;
                  })}
                  <text x="150" y="114" fontSize="12">mᵉ mod n</text>
                </svg>
                <p className="msk-formula">plaintext m={fig.state.m} → c = mᵉ mod n = {pow.value} → recovered m = cᵈ mod n = {recovered}</p>
              </>
            ) : mode === "Caesar" || mode === "Affine" || mode === "Vigenère" ? (
              <>
                <p className="msk-formula">{mode === "Affine" ? affine(plain, fig.state.a, fig.state.b) : mode === "Vigenère" ? vigenere(plain, key) : caesar(plain, fig.state.shift)}</p>
                <svg className="msk-graph" viewBox="0 0 360 120" aria-label="Frequency">
                  <rect width="360" height="120" fill="#f8fbff" />
                  {freq.map((c, i) => <rect key={i} x={8 + i * 13} y={110 - c * 12} width="11" height={c * 12} fill="#147df2" />)}
                </svg>
              </>
            ) : mode === "Diffie-Hellman" ? (
              <svg className="msk-graph" viewBox="0 0 360 180" aria-label="Paint mix">
                <rect width="360" height="180" fill="#f8fbff" />
                <circle cx="80" cy="90" r="40" fill="#facc15" />
                <circle cx="180" cy="90" r="40" fill="#22d3ee" />
                <circle cx="280" cy="90" r="48" fill="#a16207" />
                <text x="60" y="94" fontSize="12">Alice</text>
                <text x="164" y="94" fontSize="12">Bob</text>
                <text x="250" y="94" fill="#fff" fontSize="12">shared</text>
              </svg>
            ) : (
              <p className="msk-formula">{toyHash(plain)} vs {toyHash(plain.replace(/.$/, "Z"))} · bits flipped {avalancheBits(plain, `${plain}Z`)}</p>
            )}
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label="n = p × q" value={String(n)} />
            <LiveRow color="#8b45f4" label="φ(n)" value={String(phi)} />
            <LiveRow color="#08b9dd" label="Public (e, n)" value={`(${fig.state.e}, ${n})`} />
            <LiveRow color="#f59e0b" label="Ciphertext c" value={String(pow.value)} />
            <LiveRow color="#10b981" label="Decrypt check" value={recovered === fig.state.m ? "m recovered" : "check primes"} />
            <p className="msk-note">RSA security is the difficulty of factoring n = p q. Animate m^e by watching the trail hop around the clock.</p>
            <StatusOk>{mode === "Hashing" ? "One-bit input change should scramble many hash bits." : "Educational playground only."}</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Phase1LabChrome>
  );
}
