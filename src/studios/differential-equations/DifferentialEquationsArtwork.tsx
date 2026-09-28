import type { ReactNode } from "react";

/** Small, purpose-drawn vector diagrams for the studio cards. */
export default function DifferentialEquationsArtwork({ id }: { id: string }) {
  let drawing: ReactNode;
  switch (id) {
    case "explorer":
      drawing = <><circle cx="40" cy="32" r="19" /><path d="m54 46 20 20" strokeWidth="7" /><text x="29" y="37">f</text></>;
      break;
    case "slope-fields":
      drawing = <>{[-1, 0, 1].flatMap((row) => [-1, 0, 1].map((col) => <path key={`${row}-${col}`} d={`M${48 + col * 23 - 7} ${36 + row * 20 + (col + row) * 3}l14 ${-(col + row) * 6}`} />))}<circle cx="48" cy="36" r="3" fill="currentColor" /></>;
      break;
    case "initial-value":
      drawing = <><path className="de-art-muted" d="M13 57h73M23 67V8" /><path d="M20 53C35 57 39 19 55 35S72 47 84 13" /><circle cx="55" cy="35" r="7" fill="currentColor" stroke="white" strokeWidth="2" /></>;
      break;
    case "method-selector":
      drawing = <><rect x="39" y="7" width="18" height="15" rx="4" /><path d="M48 22v13M20 35h56M20 35v11M48 35v11M76 35v11" /><rect x="12" y="46" width="16" height="15" rx="4" /><rect x="40" y="46" width="16" height="15" rx="4" /><rect x="68" y="46" width="16" height="15" rx="4" /></>;
      break;
    case "separable":
      drawing = <><text x="13" y="31">dy</text><path d="M12 37h29" /><text x="13" y="55">y</text><text x="45" y="45">=</text><text x="62" y="45">x dx</text></>;
      break;
    case "homogeneous-first-order":
      drawing = <><path className="de-art-muted" d="M13 59h70M22 65V10" /><path d="M22 59 69 12M22 59 78 31" /><circle cx="50" cy="31" r="5" fill="currentColor" /><circle cx="65" cy="20" r="7" /><path d="m62 48 7 0m-4-3 4 3-4 3" /></>;
      break;
    case "exact":
      drawing = <><ellipse cx="40" cy="37" rx="29" ry="21" transform="rotate(-18 40 37)" /><ellipse cx="40" cy="37" rx="18" ry="11" transform="rotate(-18 40 37)" /><path d="m60 52 8 7 16-20" strokeWidth="5" /></>;
      break;
    case "linear-first-order":
      drawing = <><path className="de-art-muted" d="M13 59h70M20 64V11" /><path d="M22 52C36 47 43 37 54 31S73 22 83 16" /><text x="50" y="65">μ(x)</text></>;
      break;
    case "bernoulli":
      drawing = <><path d="M10 52c12-27 21 24 33-2s20-28 26-15" /><path d="m61 20 13 10-13 8" /><path className="de-art-muted" d="M75 50h13" /><text x="12" y="22">yⁿ</text></>;
      break;
    case "growth-models":
      drawing = <><path className="de-art-muted" d="M12 61h75M20 64V10M16 18h69" /><path d="M20 58C33 58 35 53 42 42S56 20 84 19" /><text x="66" y="15">K</text></>;
      break;
    case "euler":
      drawing = <><path className="de-art-muted" d="M10 60h77M17 65V12" /><path d="M17 55 33 51 49 42 65 31 82 16" /><circle cx="17" cy="55" r="3" fill="currentColor" /><circle cx="33" cy="51" r="3" fill="currentColor" /><circle cx="49" cy="42" r="3" fill="currentColor" /><circle cx="65" cy="31" r="3" fill="currentColor" /></>;
      break;
    case "heun":
      drawing = <><path className="de-art-muted" d="M13 58h72M20 63V11M23 52 47 22 71 30" strokeDasharray="4 4" /><path d="M23 52 47 39 72 21" /><circle cx="47" cy="22" r="4" /><circle cx="47" cy="39" r="4" fill="currentColor" /></>;
      break;
    case "rk4":
      drawing = <><path className="de-art-muted" d="M12 59h73M20 64V12" /><path d="M20 53C35 48 43 26 58 29S74 23 84 15" /><circle cx="24" cy="51" r="4" fill="currentColor" /><circle cx="41" cy="36" r="4" fill="currentColor" /><circle cx="58" cy="29" r="4" fill="currentColor" /><circle cx="76" cy="21" r="4" fill="currentColor" /></>;
      break;
    case "higher-order-linear":
      drawing = <><text x="15" y="31">d²y</text><path d="M12 37h69" /><text x="16" y="58">dx²</text><text x="64" y="58">= 0</text></>;
      break;
    case "undetermined-coefficients":
      drawing = <><path d="M13 51c12-30 24-30 35 0s24 30 36 0" /><path className="de-art-muted" d="M14 60h72" /><text x="17" y="18">yₚ ?</text></>;
      break;
    case "variation-of-parameters":
      drawing = <><path d="M13 57c12-23 24-27 36-2M45 55c11-39 22-40 38-3" /><circle cx="35" cy="33" r="5" fill="currentColor" /><circle cx="66" cy="30" r="5" fill="currentColor" /><text x="19" y="70">u₁</text><text x="67" y="70">u₂</text></>;
      break;
    case "cauchy-euler":
      drawing = <><text x="19" y="49" className="de-art-large">xᵐ</text><path className="de-art-muted" d="M16 60h70" /></>;
      break;
    case "systems":
      drawing = <><circle cx="25" cy="35" r="12" /><circle cx="72" cy="35" r="12" /><path d="M38 27h20m-6-5 6 5-6 5M59 45H39m6-5-6 5 6 5" /><text x="20" y="39">x</text><text x="67" y="39">y</text></>;
      break;
    case "phase-plane":
      drawing = <><path className="de-art-muted" d="M12 39h72M48 68V10" /><path d="M36 25c11-12 35-2 36 15s-18 26-32 13-4-29 10-25 13 13 8 19" /><path d="m58 42 0 5-5-1" /></>;
      break;
    case "mechanical-oscillations":
      drawing = <><path className="de-art-muted" d="M10 10h80M10 64h80" /><path d="M48 10v8l-10 5 20 7-20 7 20 7-10 5v4" /><rect x="34" y="53" width="28" height="13" rx="3" fill="currentColor" /></>;
      break;
    case "lcr-circuit":
      drawing = <><path d="M18 18h18l5 7 7-14 7 14 7-14 7 7h11v42H18z" /><path d="M18 41h15m6-9v18m8-18v18m6-9h27" /><circle cx="18" cy="41" r="3" fill="currentColor" /></>;
      break;
    case "newton-cooling":
      drawing = <><path d="M25 15a7 7 0 0 1 14 0v31a13 13 0 1 1-14 0z" /><path d="M32 23v31" strokeWidth="5" /><path className="de-art-muted" d="M51 59h34M52 24h30" /><path d="M52 27c13 2 15 24 31 29" /></>;
      break;
    default:
      drawing = <><path d="M19 53c14-32 24 32 38 0s17-32 22 0" /></>;
  }

  return <svg className="de-artwork" viewBox="0 0 96 76" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {drawing}
  </svg>;
}
