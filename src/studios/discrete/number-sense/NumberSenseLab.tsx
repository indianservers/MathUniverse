import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useSearchParams } from "react-router-dom";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { MockupLearningStrip } from "../../mockup/MockupStudioChrome";
import { Field, LiveRow, Panel, SliderRow, useLabMode } from "../../mockup/studioLabKit";
import { PlaybackBar, useStepPlayer } from "../primes/primesUi";
import {
  CHALLENGE_BANKS,
  GLOSSARY,
  LEARNING,
  MISCONCEPTIONS,
  MODE_BANNER,
  MODE_HEADING,
  NCERT_LOAD,
  NUMBER_SENSE_MODES,
  QUEST_STEPS,
  SIMPLE_BANNER,
  TEACH,
  type NumberSenseMode,
  type SenseChallenge,
} from "./numberSenseCopy";
import { NumberLine, type NumberLinePoint } from "./numberSenseLine";
import {
  BoardProof,
  DecimalGrid,
  Formula,
  FractionTiles,
  Legend,
  MapStrip,
  PowerTiles,
  RatioFigure,
  UnitRulers,
} from "./numberSenseFigures";
import {
  absDistance,
  answersMatch,
  compareFractions,
  convertLength,
  decodeFigureSnap,
  encodeFigureSnap,
  equivalentFraction,
  formatFraction,
  formatSigned,
  integerPower,
  mapDistance,
  mixedNumber,
  orderedValues,
  percentOf,
  placeValueParts,
  placeValueThousandths,
  randomInt,
  ratioGrade,
  representativeFraction,
  roundHalfUp,
  scaleRatio,
  scaleSegment,
  simplifyRatio,
  unitRate,
  type LengthUnit,
} from "./numberSenseMath";
import { awardNumberSenseXp, useNumberSenseSession, writeNumberSenseSession } from "./numberSenseSession";
import "./NumberSenseLab.css";

const DEFAULTS = {
  integers: { a: -3, b: 2, start: -3, hop: 5 },
  fractions: { num: 3, den: 2, k: 2, showNeg: false },
  decimals: { value: 0.65, roundTo: 2 },
  ratios: { a: 2, b: 3, k: 1 },
  powers: { base: 2 as 2 | 3 | 5 | 10, exp: 3, logScale: false },
  scales: { zoom: 10, logScale: false, kmPerCm: 5, cm: 3, length: 100, from: "cm" as LengthUnit, to: "m" as LengthUnit },
};

function ChallengePanel({
  mode,
  reveal,
  presentation,
  onCorrect,
  onLoad,
}: {
  mode: NumberSenseMode;
  reveal: boolean;
  presentation: boolean;
  onCorrect: () => void;
  onLoad: (challenge: SenseChallenge) => void;
}) {
  const bank = CHALLENGE_BANKS[mode];
  const teach = TEACH[mode];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState(false);
  const [misses, setMisses] = useState(0);
  const challenge = bank[index % bank.length]!;

  useEffect(() => {
    setAnswer("");
    setStatus("");
    setOk(false);
    setMisses(0);
    setIndex(0);
  }, [mode]);

  if (presentation) return <p className="msk-note">Challenge hidden in presentation mode.</p>;

  const check = () => {
    const useRatioGrade = typeof challenge.expected === "string" && (challenge.prompt.startsWith("Simplify") || challenge.prompt.includes("Simplest"));
    const graded = useRatioGrade ? ratioGrade(answer, String(challenge.expected)) : { ok: answersMatch(answer, challenge.expected), simplestNudge: false };
    setOk(graded.ok);
    if (graded.ok) {
      setStatus(graded.simplestNudge ? `${challenge.success} Same ratio — write simplest form ${challenge.expected} next time.` : challenge.success);
      onCorrect();
    } else {
      const nextMiss = misses + 1;
      setMisses(nextMiss);
      setStatus(nextMiss >= 2 ? `${challenge.hint} Worked: ${challenge.work}` : challenge.hint);
    }
  };

  return (
    <div className="msk-challenge">
      <span>Challenge {index + 1} / {bank.length}</span>
      <p>{challenge.prompt}</p>
      <input
        value={answer}
        placeholder={challenge.placeholder}
        aria-label="Challenge answer"
        onChange={(event) => { setAnswer(event.target.value); setStatus(""); }}
        onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); check(); } }}
      />
      <div className="msk-btn-row">
        <button className="msk-cta" type="button" onClick={check}>Check</button>
        <button className="msk-soft" type="button" onClick={() => { setIndex((i) => i + 1); setAnswer(""); setStatus(""); setOk(false); setMisses(0); }}>New challenge</button>
        {challenge.load ? <button className="msk-soft" type="button" onClick={() => onLoad(challenge)}>Load onto figure</button> : null}
      </div>
      {status ? <p role="status">{status}</p> : null}
      {!ok ? <a className="msk-teach" href={teach.href}>{teach.label}</a> : null}
      {reveal && !ok ? <p className="msk-note">Teacher reveal: {String(challenge.expected)}</p> : null}
    </div>
  );
}

export default function NumberSenseLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page, undefined, { keepFallback: true });
  const [params, setParams] = useSearchParams();
  const teacher = useNumberSenseSession();
  const current = (NUMBER_SENSE_MODES.includes(mode as NumberSenseMode) ? mode : "Integers") as NumberSenseMode;

  const [intA, setIntA] = useState(Number(params.get("ia")) || DEFAULTS.integers.a);
  const [intB, setIntB] = useState(Number(params.get("ib")) || DEFAULTS.integers.b);
  const [intStart, setIntStart] = useState(DEFAULTS.integers.start);
  const [intHop, setIntHop] = useState(DEFAULTS.integers.hop);
  const [showNegCompare, setShowNegCompare] = useState(false);
  const [selected, setSelected] = useState("a");
  const [hopShown, setHopShown] = useState(DEFAULTS.integers.hop);

  const [num, setNum] = useState(DEFAULTS.fractions.num);
  const [den, setDen] = useState(DEFAULTS.fractions.den);
  const [k, setK] = useState(DEFAULTS.fractions.k);
  const [fracNeg, setFracNeg] = useState(false);
  const [showCompareFracs, setShowCompareFracs] = useState(true);

  const [dec, setDec] = useState(DEFAULTS.decimals.value);
  const [roundTo, setRoundTo] = useState(DEFAULTS.decimals.roundTo);
  const [decSnap, setDecSnap] = useState(0.01);

  const [ratioA, setRatioA] = useState(Number(params.get("a")) || DEFAULTS.ratios.a);
  const [ratioB, setRatioB] = useState(Number(params.get("b")) || DEFAULTS.ratios.b);
  const [ratioK, setRatioK] = useState(Number(params.get("k")) || DEFAULTS.ratios.k);
  const [ratioC, setRatioC] = useState(0);
  const [swapRatio, setSwapRatio] = useState(false);
  const [ratioView, setRatioView] = useState<"tape" | "double" | "lattice">("double");
  const [partWhole, setPartWhole] = useState(false);
  const [ratioCursor, setRatioCursor] = useState(1);

  const [base, setBase] = useState<2 | 3 | 5 | 10>(DEFAULTS.powers.base);
  const [exp, setExp] = useState(DEFAULTS.powers.exp);
  const [powerLog, setPowerLog] = useState(DEFAULTS.powers.logScale);
  const [splitPower, setSplitPower] = useState(false);

  const [zoom, setZoom] = useState(Number(params.get("zoom")) || DEFAULTS.scales.zoom);
  const [scaleLog, setScaleLog] = useState(DEFAULTS.scales.logScale);
  const [kmPerCm, setKmPerCm] = useState(DEFAULTS.scales.kmPerCm);
  const [mapCm, setMapCm] = useState(DEFAULTS.scales.cm);
  const [length, setLength] = useState(DEFAULTS.scales.length);
  const [fromUnit, setFromUnit] = useState<LengthUnit>("cm");
  const [toUnit, setToUnit] = useState<LengthUnit>("m");
  const [pan, setPan] = useState(0);
  const [drawK, setDrawK] = useState(3);

  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [toast, setToast] = useState("");
  const [quest, setQuest] = useState<string[]>([]);
  const history = useRef<Array<() => void>>([]);
  const xpOnce = useRef(false);

  const pushHist = (undo: () => void) => {
    history.current = [...history.current.slice(-19), undo];
  };

  const resetCurrent = () => {
    if (current === "Integers") {
      setIntA(DEFAULTS.integers.a); setIntB(DEFAULTS.integers.b); setIntStart(DEFAULTS.integers.start); setIntHop(DEFAULTS.integers.hop); setShowNegCompare(false); setHopShown(DEFAULTS.integers.hop);
    } else if (current === "Fractions") {
      setNum(2); setDen(5); setK(2); setFracNeg(false);
    } else if (current === "Decimals") {
      setDec(DEFAULTS.decimals.value); setRoundTo(DEFAULTS.decimals.roundTo);
    } else if (current === "Ratios") {
      setRatioA(2); setRatioB(3); setRatioK(1); setSwapRatio(false); setRatioCursor(1);
    } else if (current === "Powers") {
      setBase(2); setExp(3); setPowerLog(false);
    } else {
      setZoom(10); setScaleLog(false); setKmPerCm(5); setMapCm(3); setPan(0);
    }
  };

  const randomCurrent = () => {
    if (current === "Integers") { setIntA(randomInt(-8, 8)); setIntB(randomInt(-8, 8)); setIntHop(randomInt(-5, 5) || 2); }
    else if (current === "Fractions") { setNum(randomInt(1, 7)); setDen(randomInt(2, 9)); setK(randomInt(2, 4)); }
    else if (current === "Decimals") setDec(randomInt(1, 199) / 100);
    else if (current === "Ratios") { setRatioA(randomInt(1, 6)); setRatioB(randomInt(1, 8)); setRatioK(randomInt(1, 4)); }
    else if (current === "Powers") { setBase([2, 3, 5, 10][randomInt(0, 3)] as 2 | 3 | 5 | 10); setExp(randomInt(0, 4)); }
    else { setKmPerCm(randomInt(1, 10)); setMapCm(randomInt(1, 6)); setZoom(randomInt(8, 30)); }
  };

  const applyTry = () => {
    if (current === "Integers") { setIntStart(-3); setIntHop(5); setHopShown(5); }
    if (current === "Fractions") { setNum(2); setDen(5); setK(2); }
    if (current === "Decimals") { setRoundTo(1); setDec(roundHalfUp(1.26, 1)); }
    if (current === "Ratios") { setRatioA(2); setRatioB(3); setRatioK((n) => Math.min(6, n + 1)); setRatioCursor((c) => Math.min(6, c + 1)); }
    if (current === "Powers") { setPowerLog((v) => !v); setExp((e) => Math.min(4, e + 1)); }
    if (current === "Scales") { setKmPerCm(5); setMapCm(3); }
    awardNumberSenseXp(2);
  };

  const ncertLoad = () => {
    if (current === "Integers") { setIntA(-3); setIntB(2); setIntStart(-3); setIntHop(5); }
    if (current === "Fractions") { setNum(2); setDen(5); setK(2); }
    if (current === "Decimals") setDec(0.65);
    if (current === "Ratios") { setRatioA(2); setRatioB(3); setRatioK(3); setRatioCursor(3); setRatioView("double"); }
    if (current === "Powers") { setBase(2); setExp(3); }
    if (current === "Scales") { setKmPerCm(5); setMapCm(3); }
  };

  const loadChallenge = (challenge: SenseChallenge) => {
    const L = challenge.load;
    if (!L) return;
    if (L.a != null) setRatioA(L.a);
    if (L.b != null) setRatioB(L.b);
    if (L.k != null) { setRatioK(L.k); setK(L.k); }
    if (L.num != null) setNum(L.num);
    if (L.den != null) setDen(L.den);
    if (L.dec != null) setDec(L.dec);
    if (L.exp != null) setExp(L.exp);
    if (L.zoom != null) setZoom(L.zoom);
    if (L.km != null) setKmPerCm(L.km);
    if (L.cm != null) setMapCm(L.cm);
    if (L.a === -7) { setIntA(-7); setIntB(-2); setShowNegCompare(true); }
  };

  useEffect(() => {
    const snap = params.get("snap");
    if (!snap) return;
    const data = decodeFigureSnap(snap);
    if (!data) return;
    if (typeof data.a === "number") setRatioA(data.a);
    if (typeof data.b === "number") setRatioB(data.b);
    if (typeof data.k === "number") setRatioK(data.k);
  }, [params]);

  useEffect(() => {
    setParams((currentParams) => {
      const next = new URLSearchParams(currentParams);
      let changed = false;
      const put = (key: string, value: string) => {
        if (next.get(key) !== value) { next.set(key, value); changed = true; }
      };
      if (current === "Ratios") {
        put("a", String(ratioA));
        put("b", String(ratioB));
        put("k", String(ratioK));
      }
      if (current === "Scales") put("zoom", String(zoom));
      return changed ? next : currentParams;
    }, { replace: true });
  }, [current, ratioA, ratioB, ratioK, zoom, setParams]);

  const go = (next: NumberSenseMode) => setMode(next);

  const onKey = (event: KeyboardEvent) => {
    const index = NUMBER_SENSE_MODES.indexOf(current);
    if (event.altKey && event.key === "ArrowRight") { event.preventDefault(); go(NUMBER_SENSE_MODES[(index + 1) % NUMBER_SENSE_MODES.length]!); }
    if (event.altKey && event.key === "ArrowLeft") { event.preventDefault(); go(NUMBER_SENSE_MODES[(index - 1 + NUMBER_SENSE_MODES.length) % NUMBER_SENSE_MODES.length]!); }
    if (event.key === "Home") { event.preventDefault(); go("Integers"); }
    if (event.key === "End") { event.preventDefault(); go("Scales"); }
    if (current === "Ratios" && event.key === "[") { event.preventDefault(); setRatioK((n) => Math.max(1, n - 1)); }
    if (current === "Ratios" && event.key === "]") { event.preventDefault(); setRatioK((n) => Math.min(6, n + 1)); }
    if (current === "Ratios" && event.key.toLowerCase() === "s" && !event.ctrlKey && !event.metaKey) { event.preventDefault(); setSwapRatio((v) => !v); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      const undo = history.current.pop();
      undo?.();
    }
  };

  useStepPlayer(playing, speed, () => {
    if (current === "Ratios") setRatioK((n) => { if (n >= 6) { setPlaying(false); return 6; } setRatioCursor(n + 1); return n + 1; });
    if (current === "Integers") setHopShown((h) => {
      const dir = intHop === 0 ? 1 : Math.sign(intHop);
      const next = h + dir;
      if ((dir > 0 && next >= intHop) || (dir < 0 && next <= intHop) || intHop === 0) {
        setPlaying(false);
        return intHop;
      }
      return next;
    });
    if (current === "Fractions") setK((n) => { if (n >= 6) { setPlaying(false); return 6; } return n + 1; });
    if (current === "Powers") setExp((n) => { if (n >= 4) { setPlaying(false); return 4; } return n + 1; });
    if (current === "Decimals") { setDec(roundHalfUp(dec, roundTo)); setPlaying(false); }
    if (current === "Scales") setMapCm((n) => { if (n >= 8) { setPlaying(false); return 8; } return n + 1; });
  });

  const learning = LEARNING[current];
  const pageForStrip = useMemo(() => ({ ...page, learning }), [page, learning]);
  const misconception = MISCONCEPTIONS[current];
  const signedNum = fracNeg ? -Math.abs(num) : num;
  const fracValue = den === 0 ? 0 : signedNum / den;
  const equiv = equivalentFraction(signedNum, den, k);
  const hopLand = intStart + intHop;
  const rounded = roundHalfUp(dec, roundTo);
  const places = placeValueParts(dec);
  const thou = placeValueThousandths(dec);
  const scaled = scaleRatio(ratioA, ratioB, ratioK);
  const simple = simplifyRatio(ratioA, ratioB);
  const tautology = ratioK === 1 && simple.a === ratioA && simple.b === ratioB;
  const percent = { left: percentOf(ratioA, ratioA + ratioB), right: percentOf(ratioB, ratioA + ratioB) };
  const ofOther = percentOf(ratioA, ratioB);
  const rate = unitRate(ratioA, ratioB);
  const powerValue = integerPower(base, exp);
  const mapKm = mapDistance(mapCm, kmPerCm);
  const converted = convertLength(length, fromUnit, toUnit);
  const rf = representativeFraction(kmPerCm);
  const fracCmp = compareFractions(3, 5, 2, 3);
  const hideLive = teacher.pauseReveal && teacher.teacherMode;
  const banner = teacher.simpleLanguage ? SIMPLE_BANNER[current] : MODE_BANNER[current];

  const intPoints: NumberLinePoint[] = showNegCompare
    ? [
      { id: "n7", value: -7, label: "−7", color: "#f59e0b", draggable: false },
      { id: "n2", value: -2, label: "−2", color: "#147df2", draggable: false },
      { id: "z", value: 0, label: "0", color: "#0f172a", draggable: false },
      { id: "p7", value: 7, label: "+7 opposite", color: "#10b981", draggable: false },
    ]
    : [
      { id: "a", value: intA, label: formatSigned(intA, 0), color: "#147df2", draggable: true },
      { id: "b", value: intB, label: formatSigned(intB, 0), color: "#8b45f4", draggable: true },
      { id: "z", value: 0, label: "0 · origin", color: "#0f172a", draggable: false },
      { id: "opp", value: -intA, label: `opp ${formatSigned(-intA, 0)}`, color: "#10b981", draggable: false },
    ];

  const fracPoints: NumberLinePoint[] = [
    { id: "frac", value: fracValue, label: formatFraction(signedNum, den), color: "#147df2", draggable: false },
    { id: "equiv", value: den === 0 ? 0 : equiv.num / equiv.den, label: formatFraction(equiv.num, equiv.den), color: "#8b45f4", draggable: false },
    ...(showCompareFracs ? [
      { id: "three", value: 3 / 5, label: "3/5", color: "#f59e0b", draggable: false },
      { id: "two", value: 2 / 3, label: "2/3", color: "#10b981", draggable: false },
    ] : []),
  ];

  const decPoints: NumberLinePoint[] = [
    { id: "dec", value: dec, label: formatSigned(dec, 3), color: "#147df2", draggable: true },
    { id: "seven", value: 0.7, label: "0.7", color: "#8b45f4", draggable: false },
    { id: "tenth", value: 0.1, label: "0.1 = 1/10", color: "#10b981", draggable: false },
    { id: "mid", value: rounded, label: `round ${formatSigned(rounded, roundTo)}`, color: "#f59e0b", draggable: false },
  ];

  const powerMin = powerLog ? 0.2 : 0;
  const powerMax = base === 10 ? (powerLog ? 1000 : 100) : Math.max(16, powerValue, 1);
  const powerExps = powerLog ? [-2, -1, 0, 1, 2, 3, 4] : [0, 1, 2, 3, 4];
  const powerPoints: NumberLinePoint[] = powerExps.map((n) => ({
    id: `p${n}`,
    value: integerPower(base, n),
    label: `${base}^{${n}}`,
    color: n === exp ? "#147df2" : n === 0 ? "#f59e0b" : "#8b45f4",
    draggable: false,
  })).filter((point) => point.value >= powerMin && point.value <= powerMax);

  const scaleMin = scaleLog ? 0.5 : Math.max(0, pan);
  const scaleMax = scaleLog ? Math.max(10, zoom) : pan + zoom;
  const scalePoints: NumberLinePoint[] = [
    { id: "s7", value: 7, label: "7", color: "#147df2", draggable: false },
    { id: "s1", value: 1, label: "1", color: "#0f172a", draggable: false },
    { id: "s0", value: scaleLog ? 0.5 : 0, label: scaleLog ? "0.5 · 0 gone on log" : "0", color: "#64748b", draggable: false },
  ];

  const ordered = current === "Ratios"
    ? []
    : orderedValues(
      current === "Integers" ? intPoints.map((p) => p.value)
        : current === "Fractions" ? fracPoints.map((p) => p.value)
          : current === "Decimals" ? decPoints.map((p) => p.value)
            : current === "Powers" ? powerPoints.map((p) => p.value)
              : scalePoints.filter((p) => p.value >= scaleMin && p.value <= scaleMax).map((p) => p.value),
    );

  const intMin = showNegCompare ? -8 : Math.min(-4, intA, intB, intStart, hopLand) - 1;
  const intMax = showNegCompare ? 8 : Math.max(8, intA, intB, hopLand) + 1;
  const denSafe = den === 0;

  const figureText = current === "Ratios"
    ? `${ratioA}:${ratioB} scaled by ${ratioK} is ${scaled.a}:${scaled.b}, simplest ${simple.a}:${simple.b}.`
    : `${MODE_HEADING[current]} · ${banner}`;

  const copyFigure = async () => {
    try {
      await navigator.clipboard.writeText(figureText);
      setToast("Copied figure statement.");
    } catch {
      setToast("Could not copy.");
    }
  };

  const copySnap = async () => {
    const token = encodeFigureSnap({ mode: current, a: ratioA, b: ratioB, k: ratioK, zoom });
    const url = `${window.location.pathname}?mode=${encodeURIComponent(current)}&snap=${token}`;
    try {
      await navigator.clipboard.writeText(new URL(url, window.location.origin).toString());
      setToast("Class snapshot URL copied.");
    } catch {
      setToast("Could not copy snapshot.");
    }
  };

  const moveInt = (id: string, value: number) => {
    const next = Math.round(value);
    if (!xpOnce.current) { awardNumberSenseXp(2); xpOnce.current = true; }
    if (id === "a") { pushHist(() => setIntA(intA)); setIntA(next); setToast(`A moved to ${next}`); }
    if (id === "b") { pushHist(() => setIntB(intB)); setIntB(next); setToast(`B moved to ${next}`); }
  };

  return (
    <div className={`ns-lab${teacher.presentation ? " is-present" : ""}`} onKeyDown={onKey}>
      <nav className="msk-tabs ns-tabs" role="tablist" aria-label={`${page.title} modes`} onKeyDown={(event) => {
        if (event.key === "Home") { event.preventDefault(); go("Integers"); }
        if (event.key === "End") { event.preventDefault(); go("Scales"); }
      }}>
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            id={`ns-tab-${item}`}
            aria-selected={item === current}
            aria-controls="ns-tabpanel"
            className={item === current ? "active" : ""}
            onClick={() => go(item as NumberSenseMode)}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="msk-dash-banner" data-lab-mode={current}>
        <b>{MODE_HEADING[current]}</b>
        <small>{banner}</small>
      </div>
      {teacher.teacherMode ? (
        <section className="msk-panel ns-teacher">
          <h2>Teacher mode</h2>
          <label><input type="checkbox" checked={teacher.showAnswers} onChange={(e) => writeNumberSenseSession({ showAnswers: e.target.checked })} /> Reveal challenge answers</label>
          <label><input type="checkbox" checked={teacher.showMisconceptions} onChange={(e) => writeNumberSenseSession({ showMisconceptions: e.target.checked })} /> Show misconception prompts</label>
          <label><input type="checkbox" checked={teacher.presentation} onChange={(e) => writeNumberSenseSession({ presentation: e.target.checked })} /> Presentation mode</label>
          <label><input type="checkbox" checked={teacher.pauseReveal} onChange={(e) => writeNumberSenseSession({ pauseReveal: e.target.checked })} /> Hide live simplified until you uncheck</label>
          <label><input type="checkbox" checked={teacher.simpleLanguage} onChange={(e) => writeNumberSenseSession({ simpleLanguage: e.target.checked })} /> Simple English captions</label>
          <div className="msk-btn-row">
            <button type="button" className="msk-soft" onClick={resetCurrent}>Reset class example</button>
            <button type="button" className="msk-soft" onClick={() => void copySnap()}>Copy class snapshot</button>
          </div>
          {teacher.showMisconceptions ? (
            <div className="ns-inspect ns-mis">
              <p>Student claim: “{misconception.claim}”</p>
              <p>Ask the class: {misconception.ask}</p>
              {teacher.showAnswers ? <p>Reveal: {misconception.reveal}</p> : null}
            </div>
          ) : null}
        </section>
      ) : (
        <div className="ns-inspect ns-mis">
          <p><b>Watch for:</b> {misconception.claim}</p>
          <p>{misconception.ask}</p>
        </div>
      )}
      <div className="msk-lab ns-grid" id="ns-tabpanel" role="tabpanel" aria-labelledby={`ns-tab-${current}`}>
        <Panel title={current} className="ns-controls">
          {current === "Integers" ? (
            <>
              <p className="msk-note">0 is the origin — neither positive nor negative. Drag A or B, or hop along unit ticks.</p>
              <SliderRow label="A" value={intA} min={-10} max={10} step={1} onChange={(v) => { pushHist(() => setIntA(intA)); setIntA(v); setSelected("a"); }} />
              <SliderRow label="B" value={intB} min={-10} max={10} step={1} onChange={(v) => { setIntB(v); setSelected("b"); }} />
              <SliderRow label="Hop start" value={intStart} min={-10} max={10} step={1} onChange={setIntStart} />
              <SliderRow label="Hop size" value={intHop} min={-8} max={8} step={1} onChange={(v) => { setIntHop(v); setHopShown(v); }} />
              <label className="msk-toggle"><input type="checkbox" checked={showNegCompare} onChange={(e) => setShowNegCompare(e.target.checked)} /> Compare −7 and −2</label>
              <p className="msk-formula">{intStart} + ({intHop}) = {hopLand}</p>
              <p className="msk-note">Lift at floor {intA}; temperature {intA}°. |{intA}| = {Math.abs(intA)} from 0. Opposite of A is {-intA}.</p>
            </>
          ) : null}
          {current === "Fractions" ? (
            <>
              <p className="msk-note">Every tick is a fraction. 3/2 and 1 1/2 are the same point.</p>
              {denSafe ? <p className="msk-note">Denominator cannot be 0 — parts would be undefined.</p> : null}
              <SliderRow label="Numerator" value={num} min={1} max={12} step={1} onChange={setNum} />
              <SliderRow label="Denominator" value={den} min={1} max={12} step={1} onChange={setDen} />
              <SliderRow label="Equivalent k" value={k} min={1} max={6} step={1} onChange={setK} />
              <label className="msk-toggle"><input type="checkbox" checked={fracNeg} onChange={(e) => setFracNeg(e.target.checked)} /> Negative fraction</label>
              <label className="msk-toggle"><input type="checkbox" checked={showCompareFracs} onChange={(e) => setShowCompareFracs(e.target.checked)} /> Show 3/5 vs 2/3</label>
              <FractionTiles num={signedNum} den={Math.max(1, den)} />
              <p className="msk-formula"><Formula value={`${formatFraction(signedNum, den).replace("/", "/")} = ${mixedNumber(signedNum, den)}`} /> {k > 1 ? `= ${formatFraction(equiv.num, equiv.den)}` : null}</p>
              <p className="msk-note">3/5 vs 2/3 as 9/15 vs 10/15. Larger is 2/3 ({fracCmp < 0 ? "2/3 wins" : ""}).</p>
            </>
          ) : null}
          {current === "Decimals" ? (
            <>
              <p className="msk-note">1/10 = 0.1 and 1/100 = 0.01. Money: ₹{formatSigned(dec, 2)}.</p>
              <SliderRow label="Value" value={dec} min={0} max={3} step={decSnap} onChange={setDec} />
              <SliderRow label="Round to d.p." value={roundTo} min={1} max={2} step={1} onChange={setRoundTo} />
              <div className="msk-btn-row">
                <button type="button" className={`msk-soft${decSnap === 0.1 ? " active" : ""}`} onClick={() => setDecSnap(0.1)}>Snap 0.1</button>
                <button type="button" className={`msk-soft${decSnap === 0.01 ? " active" : ""}`} onClick={() => setDecSnap(0.01)}>Snap 0.01</button>
                <button type="button" className="msk-soft" onClick={() => setDec(rounded)}>Snap to rounded value {formatSigned(rounded, roundTo)}</button>
              </div>
              <div className="ns-place">
                <span><b>{thou.ones}</b> ones</span>
                <span><b>{thou.tenths}</b> tenths</span>
                <span><b>{thou.hundredths}</b> hundredths</span>
                <span><b>{thou.thousandths}</b> thousandths</span>
              </div>
              <p className="msk-note">0.3̇ is recurring — we only approximate that point. 0.65 terminates. Align 0.70 vs 0.65 in hundredths.</p>
            </>
          ) : null}
          {current === "Ratios" ? (
            <>
              <p className="msk-note">Red : blue = {ratioA}:{ratioB}. Swapping order makes {ratioB}:{ratioA}, a different ratio.</p>
              <SliderRow label="Red (first)" value={ratioA} min={1} max={12} step={1} onChange={(v) => { pushHist(() => setRatioA(ratioA)); setRatioA(v); setToast(`Red is now ${v}`); }} />
              <SliderRow label="Blue (second)" value={ratioB} min={1} max={12} step={1} onChange={setRatioB} />
              <SliderRow label="Recipe multiplier" value={ratioK} min={1} max={6} step={1} onChange={(v) => { setRatioK(v); setRatioCursor(v); setToast(`Both parts ×${v}`); }} />
              {ratioC > 0 ? <SliderRow label="Third part" value={ratioC} min={1} max={8} step={1} onChange={setRatioC} /> : null}
              <div className="msk-btn-row">
                <button type="button" className="msk-soft" onClick={() => setSwapRatio((v) => !v)}>Swap order</button>
                <button type="button" className={`msk-soft${ratioView === "tape" ? " active" : ""}`} onClick={() => setRatioView("tape")}>Tape</button>
                <button type="button" className={`msk-soft${ratioView === "double" ? " active" : ""}`} onClick={() => setRatioView("double")}>Double line</button>
                <button type="button" className={`msk-soft${ratioView === "lattice" ? " active" : ""}`} onClick={() => setRatioView("lattice")}>Lattice</button>
                <button type="button" className={`msk-soft${partWhole ? " active" : ""}`} onClick={() => setPartWhole((v) => !v)}>{partWhole ? "Part–whole" : "Part–part"}</button>
                <button type="button" className="msk-soft" onClick={() => setRatioC((c) => c ? 0 : 5)}>Three-part {ratioC ? "off" : "on"}</button>
                <button type="button" className="msk-soft" onClick={() => { setRatioA(1); setRatioB(5); }}>1:n</button>
                <button type="button" className="msk-soft" onClick={() => { setRatioA(5); setRatioB(1); }}>n:1</button>
              </div>
              <p className="msk-formula">
                {tautology ? <Formula value={`${ratioA}:${ratioB}`} /> : <Formula value={`${ratioA}:${ratioB} = ${scaled.a}:${scaled.b} = ${simple.a}:${simple.b}`} />}
              </p>
              <p className="msk-note">Share of whole: {formatSigned(percent.left, 1)}% : {formatSigned(percent.right, 1)}%. {ratioA} is {formatSigned(ofOther, 0)}% of {ratioB} — a different question.</p>
              <p className="msk-note">Unit rate 1 : {formatSigned(rate.perFirst, 2)}.</p>
              <table className="msk-mini-table" aria-label="Equivalent ratio table">
                <thead><tr><th>k</th><th>Red</th><th>Blue</th></tr></thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6].map((k) => (
                    <tr key={k} className={k === ratioK ? "is-hot" : undefined}>
                      <td>{k}</td>
                      <td>{ratioA * k}</td>
                      <td>{ratioB * k}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="msk-note">Juice mix: more juice is not stronger if you scale both parts. Link: <a href="/discrete-world/primes?mode=GCD+%26+LCM">Primes GCD</a> · <a href="/discrete-world/number-sense?mode=Fractions">Fractions 2/3</a> · <a href="/discrete-world/number-sense?mode=Scales">Scales</a></p>
              {ratioC > 0 ? <p className="msk-note">Three-part {ratioA}:{ratioB}:{ratioC}.</p> : null}
              {simple.a === ratioA && simple.b === ratioB ? <p className="msk-ok">Already simplest — gcd 1.</p> : <p className="msk-note">gcd used to simplify is greater than 1.</p>}
            </>
          ) : null}
          {current === "Powers" ? (
            <>
              <p className="msk-note">Each step multiplies by the base. Equal gaps would mean adding, not multiplying.</p>
              <div className="msk-btn-row">
                {([2, 3, 5, 10] as const).map((n) => (
                  <button key={n} type="button" className={`msk-soft${base === n ? " active" : ""}`} onClick={() => setBase(n)}>Base {n}</button>
                ))}
                <button type="button" className={`msk-soft${powerLog ? " active" : ""}`} onClick={() => setPowerLog((v) => !v)}>{powerLog ? "Log axis" : "Linear axis"}</button>
                <button type="button" className={`msk-soft${splitPower ? " active" : ""}`} onClick={() => setSplitPower((v) => !v)}>Split linear | log</button>
              </div>
              <SliderRow label="Exponent" value={exp} min={-2} max={5} step={1} onChange={setExp} />
              <p className="msk-formula"><Formula value={`${base}^{${exp}} = ${formatSigned(powerValue, 4)}`} /></p>
              {base === 10 ? <p className="msk-note">Scientific: 10^3 = 1000, 10^{-2} = 0.01.</p> : null}
              <p className="msk-note">2^10 tiles vs 10^2 = 100 area trap: multiplying is not adding exponents of different bases casually.</p>
            </>
          ) : null}
          {current === "Scales" ? (
            <>
              <p className="msk-note">Zoom keeps 0 and 1 in place unless you pan. Map scale is a ratio: 1 cm : {kmPerCm} km. Powers of 10 zoom: window ≈ 10^{Math.round(Math.log10(Math.max(4, zoom)))}.</p>
              <SliderRow label="Window size" value={zoom} min={4} max={40} step={1} onChange={setZoom} />
              <SliderRow label="Pan start" value={pan} min={0} max={20} step={1} onChange={setPan} />
              <label className="msk-toggle"><input type="checkbox" checked={scaleLog} onChange={(e) => setScaleLog(e.target.checked)} /> Log scale (0 disappears)</label>
              <SliderRow label="km per cm" value={kmPerCm} min={1} max={20} step={1} onChange={setKmPerCm} />
              <SliderRow label="Map cm" value={mapCm} min={1} max={10} step={1} onChange={setMapCm} />
              <SliderRow label="Enlarge drawing k" value={drawK} min={1} max={5} step={1} onChange={setDrawK} />
              <p className="msk-formula">{mapCm} cm × {kmPerCm} km/cm = {mapKm} km · RF 1:{rf.right} · 2 cm × k={drawK} → {scaleSegment(2, drawK)} cm</p>
              <form className="ns-units" onSubmit={(event: FormEvent) => event.preventDefault()}>
                <Field label="Length">
                  <input type="number" value={length} min={1} max={2000} onChange={(e) => setLength(Number(e.target.value))} />
                </Field>
                <Field label="From">
                  <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as LengthUnit)}>
                    <option value="mm">mm</option><option value="cm">cm</option><option value="m">m</option><option value="km">km</option>
                  </select>
                </Field>
                <Field label="To">
                  <select value={toUnit} onChange={(e) => setToUnit(e.target.value as LengthUnit)}>
                    <option value="mm">mm</option><option value="cm">cm</option><option value="m">m</option><option value="km">km</option>
                  </select>
                </Field>
              </form>
              <p className="msk-formula">{length} {fromUnit} = {formatSigned(converted, 4)} {toUnit}</p>
            </>
          ) : null}
          <PlaybackBar
            playing={playing}
            onPlay={() => {
              if (current === "Integers") setHopShown(0);
              if (current === "Ratios") setRatioK(1);
              setPlaying(true);
            }}
            onPause={() => setPlaying(false)}
            onPrev={() => {
              if (current === "Ratios") setRatioK((n) => Math.max(1, n - 1));
              if (current === "Fractions") setK((n) => Math.max(1, n - 1));
              if (current === "Powers") setExp((n) => Math.max(-2, n - 1));
            }}
            onNext={() => {
              if (current === "Ratios") setRatioK((n) => Math.min(6, n + 1));
              if (current === "Fractions") setK((n) => Math.min(6, n + 1));
              if (current === "Powers") setExp((n) => Math.min(5, n + 1));
              if (current === "Integers") setHopShown(intHop);
              if (current === "Decimals") setDec(rounded);
            }}
            onReset={resetCurrent}
            onRandom={randomCurrent}
            onAuto={() => setPlaying(true)}
            speed={speed}
            onSpeed={setSpeed}
            disablePrev={false}
            disableNext={false}
          />
          <div className="msk-btn-row">
            <button type="button" className="msk-soft" onClick={ncertLoad}>{NCERT_LOAD[current].label}</button>
            <button type="button" className="msk-soft" onClick={() => void copyFigure()}>Copy figure statement</button>
            <button type="button" className="msk-soft" onClick={() => {
              if (current === "Scales") { setPan(0); setZoom(Math.max(8, 7 + 1)); }
              if (current === "Integers") { /* window already fits */ }
              if (current === "Ratios") setRatioK(Math.max(ratioK, 3));
            }}>Fit to view</button>
            <button type="button" className="msk-soft" onClick={applyTry}>Try: {learning.try}</button>
          </div>
        </Panel>
        <section className="msk-panel msk-canvas ns-canvas" data-mode-canvas={current}>
          {current === "Integers" ? (
            <>
              <Legend items={[{ color: "#147df2", label: "A" }, { color: "#8b45f4", label: "B" }, { color: "#f59e0b", label: "hop" }, { color: "#0f172a", label: "origin" }]} />
              <NumberLine
                min={intMin}
                max={intMax}
                tickStep={1}
                points={intPoints}
                selectedId={selected}
                onSelect={setSelected}
                onMove={moveInt}
                distance={showNegCompare ? ["n7", "n2"] : ["a", "b"]}
                hops={showNegCompare ? undefined : { from: intStart, size: hopShown }}
                ariaLabel={`Integers on a line from ${intMin} to ${intMax}. Points ${intPoints.map((p) => p.label).join(", ")}. Distance is absolute difference.`}
              />
              <BoardProof
                steps={showNegCompare
                  ? ["−7 is left of −2, so −7 is smaller.", "The numeral 7 looks bigger — ignore that.", "|−7 − (−2)| = 5 unit hops."]
                  : [
                    `Walk from ${formatSigned(intA, 0)} to ${formatSigned(intB, 0)}.`,
                    "Count the orange hops: each tick is 1.",
                    `|${formatSigned(intA, 0)} − ${formatSigned(intB, 0)}| = ${formatSigned(absDistance(intA, intB), 0)} hops.`,
                  ]}
              />
              <div className="ns-story" aria-hidden="true">
                <span className="ns-thermo">{intA}°</span>
                <span className="ns-lift">Floor {intA}</span>
              </div>
            </>
          ) : null}
          {current === "Fractions" ? (
            <>
              <Legend items={[{ color: "#147df2", label: "fraction" }, { color: "#8b45f4", label: "equivalent" }, { color: "#f59e0b", label: "3/5" }]} />
              <NumberLine
                min={-1}
                max={Math.max(3, Math.ceil(Math.abs(fracValue) + 1))}
                tickStep={1 / Math.max(1, den)}
                extraTicks={[0, 0.5, 1, 1.5, 2, 3 / 5, 2 / 3, fracValue]}
                points={fracPoints}
                distance={showCompareFracs ? ["three", "two"] : undefined}
                snap={1 / Math.max(1, den)}
                ariaLabel={`Fractions ${formatFraction(signedNum, den)} and ${formatFraction(equiv.num, equiv.den)} on one line, with 3/5 and 2/3 for comparison.`}
              />
              <BoardProof
                steps={[
                  `${formatFraction(signedNum, den)} and ${formatFraction(equiv.num, equiv.den)} sit on one mark.`,
                  "Same-size parts: 3/5 = 9/15 and 2/3 = 10/15.",
                  "10 > 9, so 2/3 is larger.",
                ]}
              />
            </>
          ) : null}
          {current === "Decimals" ? (
            <>
              <Legend items={[{ color: "#147df2", label: "value" }, { color: "#8b45f4", label: "0.7" }, { color: "#10b981", label: "0.1" }]} />
              <div className="ns-dec-row">
                <NumberLine
                  min={0}
                  max={2}
                  tickStep={0.1}
                  extraTicks={[0.01, 0.1, 0.25, 0.65, 0.7, 1.5]}
                  points={decPoints}
                  selectedId="dec"
                  onSelect={() => undefined}
                  onMove={(_id, value) => setDec(Math.round(value / decSnap) * decSnap)}
                  distance={["dec", "seven"]}
                  snap={decSnap}
                  ariaLabel={`Decimals including ${formatSigned(dec, 2)}, 0.7, and 0.1 = 1/10.`}
                />
                <DecimalGrid value={dec} />
              </div>
              <BoardProof
                steps={[
                  `${formatSigned(dec, 2)} = ${places.tenths} tenths + ${places.hundredths} hundredths.`,
                  "0.70 and 0.65 use the same hundredths grid.",
                  `${formatSigned(dec, 2)} rounded to ${roundTo} d.p. is ${formatSigned(rounded, roundTo)}.`,
                ]}
              />
            </>
          ) : null}
          {current === "Ratios" ? (
            <>
              <Legend items={[{ color: "#147df2", label: "Red / first", pattern: true }, { color: "#8b45f4", label: "Blue / second" }, { color: "#f59e0b", label: "pair cursor" }]} />
              <RatioFigure a={ratioA} b={ratioB} k={ratioK} swapped={swapRatio} view={ratioView} partWhole={partWhole} cursor={ratioCursor} onCursor={setRatioCursor} laser={teacher.presentation} />
              <div className="ns-percent" aria-hidden="true">
                <i style={{ width: `${percent.left}%` }} />
                <b style={{ width: `${percent.right}%` }} />
              </div>
              <BoardProof
                steps={[
                  `${ratioA}:${ratioB} is a pair, not the number ${ratioA}.`,
                  `×${ratioK} scales both parts: ${scaled.a}:${scaled.b}.`,
                  `Simplify with gcd to ${simple.a}:${simple.b}.`,
                ]}
              />
            </>
          ) : null}
          {current === "Powers" ? (
            <>
              <Legend items={[{ color: "#147df2", label: "current power" }, { color: "#f59e0b", label: "base^0 = 1" }]} />
              <NumberLine
                min={powerMin}
                max={base === 10 ? (powerLog ? 1000 : 100) : powerMax}
                tickStep={1}
                extraTicks={powerPoints.map((p) => p.value)}
                logScale={powerLog}
                points={powerPoints}
                ariaLabel={`${base} to the power n on a ${powerLog ? "log" : "linear"} line. ${base}^${exp} = ${formatSigned(powerValue, 4)}.`}
              />
              {splitPower ? (
                <NumberLine
                  min={0.2}
                  max={base === 10 ? 1000 : powerMax}
                  extraTicks={powerPoints.map((p) => p.value)}
                  logScale
                  points={powerPoints}
                  ariaLabel="Log companion axis"
                />
              ) : null}
              <PowerTiles base={base} exp={exp} />
              <BoardProof
                steps={[
                  `${base}^${exp} means ${base} used as a factor ${Math.max(0, exp)} times.`,
                  powerLog ? "Equal gaps now mean × base, not +1." : "Linear gaps grow because we multiply.",
                  `${base}^0 = 1 (empty product). ${base}^{-1} = 1/${base}.`,
                ]}
              />
            </>
          ) : null}
          {current === "Scales" ? (
            <>
              <Legend items={[{ color: "#147df2", label: "7 stays 7" }, { color: "#0f172a", label: "1" }]} />
              <NumberLine
                min={scaleMin}
                max={scaleMax}
                tickStep={1}
                extraTicks={scaleLog ? [0.5, 1, 2, 4, 7, 10, 20] : [0, 1, 7, pan + zoom]}
                logScale={scaleLog}
                points={scalePoints.filter((p) => p.value >= scaleMin && p.value <= scaleMax)}
                ariaLabel={`Scale window ${scaleMin} to ${scaleMax}${scaleLog ? " on a log axis" : ""}. 7 stays at 7.`}
              />
              {scaleLog ? <p className="msk-note">Log windows cannot include 0 — there is no log 0.</p> : null}
              <MapStrip cm={mapCm} kmPerCm={kmPerCm} />
              <UnitRulers lengthCm={fromUnit === "cm" ? length : convertLength(length, fromUnit, "cm")} />
              <BoardProof
                steps={[
                  "7 stays 7 when you zoom — only the window moves.",
                  `Map: ${mapCm} cm × ${kmPerCm} km/cm = ${mapKm} km.`,
                  `${length} ${fromUnit} = ${formatSigned(converted, 4)} ${toUnit}.`,
                ]}
              />
            </>
          ) : null}
        </section>
        <aside className="msk-panel msk-live">
          {current === "Ratios" ? (
            <LiveRow color="#147df2" label="Pair" value={`(${swapRatio ? ratioB : ratioA}, ${swapRatio ? ratioA : ratioB}) · ${ratioA} of first per ${ratioB} of second`} />
          ) : (
            <LiveRow color="#147df2" label="Ordered" value={ordered.map((n) => formatSigned(n, 4)).join(" < ")} />
          )}
          {current === "Integers" ? <LiveRow color="#8b45f4" label="|A−B|" value={showNegCompare ? "Compare −7 < −2" : `${formatSigned(absDistance(intA, intB), 0)} units`} /> : null}
          {current === "Fractions" ? <LiveRow color="#8b45f4" label="2/3 − 3/5" value={formatFraction(1, 15)} /> : null}
          {current === "Decimals" ? <LiveRow color="#8b45f4" label="Place value" value={`${places.ones} + ${places.tenths}/10 + ${places.hundredths}/100`} /> : null}
          {current === "Ratios" ? <LiveRow color="#8b45f4" label="Simplified" value={hideLive ? "hidden until teacher unchecks" : `${simple.a}:${simple.b}`} /> : null}
          {current === "Powers" ? <LiveRow color="#8b45f4" label={`${base}^${exp}`} value={formatSigned(powerValue, 4)} /> : null}
          {current === "Scales" ? <LiveRow color="#8b45f4" label="Map" value={`${mapKm} km`} /> : null}
          <p className="msk-note ns-live-note" aria-live="polite">
            {current === "Integers" ? `Selected ${selected === "a" ? intA : intB}. Distance is the count of unit steps.` : null}
            {current === "Fractions" ? `${formatFraction(signedNum, den)} sits at the same mark as ${formatFraction(equiv.num, equiv.den)}.` : null}
            {current === "Decimals" ? `${formatSigned(dec, 2)} rounded to ${roundTo} d.p. is ${formatSigned(rounded, roundTo)}. ${formatSigned(dec, 2)} = ${places.tenths}/10 + ${places.hundredths}/100.` : null}
            {current === "Ratios" ? `Scaling a recipe by ${ratioK} keeps the ratio ${simple.a}:${simple.b}.` : null}
            {current === "Powers" ? (powerLog ? "Equal visual gaps now mean × base." : "Linear gaps grow because we multiply.") : null}
            {current === "Scales" ? `7 is still 7. ${length} ${fromUnit} = ${formatSigned(converted, 4)} {toUnit}.`.replace("{toUnit}", toUnit) : null}
          </p>
          {toast ? <p className="msk-ok" role="status">{toast}</p> : null}
          <div className="ns-glossary">
            {GLOSSARY[current].map((item) => <span key={item.term} title={item.meaning}>{item.term}</span>)}
          </div>
          <p className="msk-note"><b>Why it works.</b> {learning.why}</p>
          <ChallengePanel
            mode={current}
            reveal={teacher.teacherMode && teacher.showAnswers}
            presentation={teacher.presentation}
            onCorrect={() => {
              awardNumberSenseXp(10);
              if (current === "Ratios") setQuest((q) => Array.from(new Set([...q, QUEST_STEPS[0]])));
              if (current === "Fractions") setQuest((q) => Array.from(new Set([...q, QUEST_STEPS[1]])));
              if (current === "Decimals") setQuest((q) => Array.from(new Set([...q, QUEST_STEPS[2]])));
              if (current === "Scales") setQuest((q) => Array.from(new Set([...q, QUEST_STEPS[3]])));
            }}
            onLoad={loadChallenge}
          />
          <div className="ns-quest">
            <b>Cross-mode quest</b>
            {QUEST_STEPS.map((step) => <label key={step}><input type="checkbox" checked={quest.includes(step)} readOnly /> {step}</label>)}
          </div>
        </aside>
      </div>
      <div className="ns-try-row">
        <button type="button" className="msk-cta" onClick={applyTry}>Try: {learning.try}</button>
      </div>
      <MockupLearningStrip page={pageForStrip} mode={current} />
      <section className="ns-exit" aria-label="Exit ticket">
        <h2>Exit ticket</h2>
        <p>1. Integers: which is greater, −7 or −2?</p>
        <p>2. Ratios: simplify 12:18.</p>
        <p>3. Scales: 3 cm at 5 km per cm is how many km?</p>
      </section>
    </div>
  );
}
