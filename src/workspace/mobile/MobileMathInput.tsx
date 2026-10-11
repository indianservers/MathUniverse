import { useRef, useState } from "react";
export default function MobileMathInput({ value, onChange, error, templates, label = "Mobile expression", onApply, onCancel }: {
  value: string; onChange: (value: string) => void; error?: string; templates: { label: string; expression: string }[]; label?: string; onApply?: () => void; onCancel?: () => void;
}) {
  const input = useRef<HTMLTextAreaElement>(null);
  const [keyboard, setKeyboard] = useState(true);
  const insert = (text: string) => {
    const start = input.current?.selectionStart ?? value.length, end = input.current?.selectionEnd ?? start;
    onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => { input.current?.focus(); input.current?.setSelectionRange(start + text.length, start + text.length); });
  };
  return <div className="mws-math-input">
    <label>{label}<textarea ref={input} aria-label={label} value={value} onChange={e => onChange(e.target.value)} autoCapitalize="off" autoCorrect="off" spellCheck={false} /></label>
    {error && <div role="alert"><p>{error}</p><p>Check matching parentheses, include multiplication (*), and use a supported function such as sin, cos, or sqrt.</p><button type="button" onClick={() => onChange("sin(x^2)")}>Try sin(x²)</button></div>}
    <button type="button" aria-pressed={keyboard} onClick={() => setKeyboard(!keyboard)}>Math keyboard</button>
    {keyboard && <div className="mws-math-keys">{["x", "y", "z", "^2", "^", "/", "sqrt(", "sin(", "cos(", "tan(", "log(", "pi", "(", ")", "+", "-", "*", "<=", ">=", "abs("].map(key => <button type="button" key={key} onPointerDown={e => e.preventDefault()} onClick={() => insert(key)}>{key === "^2" ? "x²" : key === "sqrt(" ? "√" : key}</button>)}</div>}
    <div className="mws-action-grid">{templates.map(t => <button key={t.label} type="button" onClick={() => onChange(t.expression)}>{t.label}<small>{t.expression}</small></button>)}</div>
    {onApply && <button type="button" onClick={onApply}>Plot expression</button>}{onCancel && <button type="button" onClick={onCancel}>Cancel plot</button>}
  </div>;
}
