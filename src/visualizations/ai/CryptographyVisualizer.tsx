import { useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";

function shiftText(text: string, shift: number) {
  return text.replace(/[a-z]/gi, (char) => {
    const base = char === char.toUpperCase() ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift + 26) % 26) + base);
  });
}

export default function CryptographyVisualizer() {
  const [text, setText] = useState("Math Universe");
  const [shift, setShift] = useState(3);
  const encrypted = useMemo(() => shiftText(text, shift), [text, shift]);
  const decrypted = useMemo(() => shiftText(encrypted, -shift), [encrypted, shift]);
  return (
    <SectionCard title="Cryptography Visualizer" description="Cryptography uses modular arithmetic, number theory, and algebra.">
      <div className="grid gap-4 lg:grid-cols-3">
        <label className="block lg:col-span-3"><span className="text-sm font-semibold">Message</span><input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={text} onChange={(e) => setText(e.target.value)} /></label>
        <SliderControl label="Caesar shift" value={shift} min={0} max={25} step={1} onChange={setShift} />
        <Box title="Encrypted" text={encrypted} />
        <Box title="Decrypted" text={decrypted} />
      </div>
    </SectionCard>
  );
}

function Box({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="text-xs text-slate-500">{title}</p><p className="mt-2 break-words font-mono text-lg font-bold">{text}</p></div>;
}
