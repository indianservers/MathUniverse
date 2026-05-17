import CalculatorButton from "./CalculatorButton";

type ScientificKeypadProps = {
  onInput: (value: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onBackspace: () => void;
  onMemory: (action: "MC" | "MR" | "M+" | "M-") => void;
};

const sci = ["sin(", "cos(", "tan(", "asin(", "acos(", "atan(", "ln(", "log(", "exp(", "10^(", "^2", "^3", "^", "sqrt(", "cbrt(", "abs(", "pi", "e", "factorial(", "1/(", "(", ")"];
const basic = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "%", "+"];

export default function ScientificKeypad({ onInput, onEquals, onClear, onBackspace, onMemory }: ScientificKeypadProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <CalculatorButton label="MC" onClick={() => onMemory("MC")} />
        <CalculatorButton label="MR" onClick={() => onMemory("MR")} />
        <CalculatorButton label="M+" onClick={() => onMemory("M+")} />
        <CalculatorButton label="M-" onClick={() => onMemory("M-")} />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
        {sci.map((key) => <CalculatorButton key={key} label={labelFor(key)} onClick={() => onInput(key)} />)}
      </div>
      <div className="grid grid-cols-4 gap-2">
        <CalculatorButton label="C" variant="danger" onClick={onClear} />
        <CalculatorButton label="Back" onClick={onBackspace} title="Backspace" />
        <CalculatorButton label="(" onClick={() => onInput("(")} />
        <CalculatorButton label=")" onClick={() => onInput(")")} />
        {basic.map((key) => <CalculatorButton key={key} label={display(key)} onClick={() => onInput(key)} variant={["/", "*", "-", "+"].includes(key) ? "primary" : "secondary"} />)}
        <CalculatorButton label="=" variant="accent" onClick={onEquals} />
      </div>
    </div>
  );
}

function display(key: string) {
  if (key === "/") return "/";
  if (key === "*") return "x";
  return key;
}

function labelFor(key: string) {
  const labels: Record<string, string> = {
    "sqrt(": "sqrt",
    "cbrt(": "cbrt",
    "abs(": "|x|",
    "factorial(": "n!",
    pi: "pi",
    "exp(": "e^x",
    "10^(": "10^x",
    "^": "x^y",
    "^2": "x^2",
    "^3": "x^3",
    "1/(": "1/x",
  };
  return labels[key] ?? key.replace("(", "");
}
