import { useStudioState } from "../../phase1/StudioModelProvider";
import { useEffect } from "react";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, StatusOk } from "../../mockup/studioLabKit";
import { FigureToolbar, Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import { useStudioFigure } from "../../phase1/useStudioFigure";
import { affine, avalancheBits, caesar, dhMix, letterFreq, modInverse, modPow, toyHash, vigenere } from "./cryptoMath";

type Fig = { p: number; q: number; e: number; m: number; shift: number; a: number; b: number };
const initial: Fig = { p: 61, q: 53, e: 17, m: 72, shift: 3, a: 5, b: 8 };

export default function CryptographyLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure(initial);
  const [plain, setPlain] = useStudioState("CryptographyLab:CryptographyLab:plain", "HELLO MATH");
  const [key, setKey] = useStudioState("CryptographyLab:CryptographyLab:key", "KEY");
  const [rsaMessage, setRsaMessage] = useStudioState("CryptographyLab:CryptographyLab:rsaMessage", "MATH");
  const [rsaStage, setRsaStage] = useStudioState("CryptographyLab:CryptographyLab:rsaStage", 0);
  const [rsaPlaying, setRsaPlaying] = useStudioState("CryptographyLab:CryptographyLab:rsaPlaying", false);
  const [challengeE, setChallengeE] = useStudioState("CryptographyLab:CryptographyLab:challengeE", 7);
  const n = fig.state.p * fig.state.q;
  const phi = (fig.state.p - 1) * (fig.state.q - 1);
  const d = modInverse(fig.state.e, phi);
  const pow = modPow(fig.state.m, fig.state.e, n);
  const recovered = modPow(pow.value, d, n).value;
  const isPrime = (value: number) => Number.isInteger(value) && value > 1 && Array.from({ length: Math.floor(Math.sqrt(value)) - 1 }, (_, i) => i + 2).every((divisor) => value % divisor !== 0);
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const validKeys = isPrime(fig.state.p) && isPrime(fig.state.q) && fig.state.p !== fig.state.q && gcd(fig.state.e, phi) === 1;
  const codes = [...rsaMessage.toUpperCase().replace(/[^A-Z ]/g, "").slice(0, 8)].map((char) => char.charCodeAt(0));
  const encrypted = validKeys ? codes.map((code) => modPow(code, fig.state.e, n).value) : [];
  const decrypted = validKeys ? encrypted.map((code) => modPow(code, d, n).value) : [];
  const freq = letterFreq(plain);
  const mix = dhMix(6, 15, 5, 23);
  useEffect(() => {
    if (!rsaPlaying || rsaStage >= 3) return;
    const timer = window.setTimeout(() => setRsaStage((stage) => stage + 1), 850);
    return () => window.clearTimeout(timer);
  }, [rsaPlaying, rsaStage]);

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
                <label className="msk-note">Short message <input aria-label="RSA short message" maxLength={8} value={rsaMessage} onChange={(event) => { setRsaMessage(event.target.value.toUpperCase()); setRsaStage(0); }} /></label>
                <p className="msk-note">{validKeys ? `Valid toy keys: gcd(${fig.state.e}, ${phi}) = 1.` : "Choose distinct primes p, q and an exponent coprime to φ(n)."}</p>
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
                <div className="msk-seg"><button type="button" disabled={rsaStage === 0} onClick={() => { setRsaPlaying(false); setRsaStage((stage) => stage - 1); }}>Previous</button><button type="button" disabled={rsaStage === 3 || !validKeys} onClick={() => setRsaStage((stage) => stage + 1)}>Next RSA step</button><button type="button" disabled={!validKeys} onClick={() => { setRsaStage(0); setRsaPlaying(true); }}>{rsaPlaying && rsaStage < 3 ? "Playing…" : "Play message"}</button><button type="button" onClick={() => { setRsaPlaying(false); setRsaStage(0); }}>Restart</button></div>
                <h3>{["1. Create keys", "2. Encode letters", "3. Encrypt each code", "4. Decrypt and read"][rsaStage]}</h3>
                <p className="msk-formula">{rsaStage === 0 ? `n = ${fig.state.p} × ${fig.state.q} = ${n}; φ(n) = ${phi}; e × d = ${fig.state.e} × ${d} ≡ 1 (mod ${phi})` : rsaStage === 1 ? `${rsaMessage} → ${codes.join(" · ")} (character codes)` : rsaStage === 2 ? codes.map((code, index) => `${code}^${fig.state.e} mod ${n} = ${encrypted[index]}`).join("; ") : encrypted.map((code, index) => `${code}^${d} mod ${n} = ${decrypted[index]}`).join("; ") + ` → ${String.fromCharCode(...decrypted)}`}</p>
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
            <label className="msk-note">Key challenge: find a valid public exponent e <input type="number" min="2" max={Math.max(2, phi - 1)} value={challengeE} onChange={(event) => setChallengeE(Number(event.target.value))} /></label>
            <p className="msk-note" role="status">{challengeE > 1 && challengeE < phi && gcd(challengeE, phi) === 1 ? `Valid: gcd(${challengeE}, ${phi}) = 1; private exponent d = ${modInverse(challengeE, phi)}.` : `Try an e between 2 and ${phi - 1} with gcd(e, ${phi}) = 1.`}</p>
            <StatusOk>{mode === "Hashing" ? "One-bit input change should scramble many hash bits." : "Educational playground only."}</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Phase1LabChrome>
  );
}
