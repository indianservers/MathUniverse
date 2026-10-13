import { useId } from 'react';
import { Activity, ArrowRight, Calculator, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Divide, Eye, Lightbulb, Minus, Pencil, Play, Plus, RotateCcw, Settings2, Sparkles, Target, Trophy, Undo2, X } from 'lucide-react';
import { useStudioMode } from '../../hooks/useStudioMode';
import { useAlgebraHistory } from './useAlgebraHistory';
import { completeSquareText } from './algebraStudioMath';
import { factorIntegerQuadratic } from './algebraEnhancementEngine';
import { challengeMatches, equationNumber, equationModes, equationText, equationSolution, evaluateSides, initialEquation, parseEquation, polynomialText, transformEquation, type EquationMode, type EquationModel, type Operation, type Polynomial, type Relation } from './equationsDashboardMath';
import './equationsDashboard.css';

const fmt = equationNumber;
type Frame = { model: EquationModel; caption: string; warning?: boolean };
const fresh = (mode: EquationMode) => {
  const model = initialEquation(mode);
  return { model, original: model, draft: equationText(model), operand: '2', autoBalance: true, showValues: true, goal: 'Solve for x', method: 'Quadratic formula', notice: '', info: false, frames: [{ model, caption: 'Start' }] as Frame[], cursor: 0, challenge: false, answer: '', checked: false };
};

function BalanceScene({ model, showValues, none, inequality }: { model: EquationModel; showValues: boolean; none: boolean; inequality: boolean }) {
  const id = useId().replace(/:/g, '');
  const gradient = (name: string) => `url(#${id}-${name})`;
  const tiles = (poly: Polynomial, x: number) => {
    const entries = poly.flatMap((n, index) => {
      if (Math.abs(n) < 1e-10) return [];
      if (index === 2) return [{ label: `${n > 0 ? '+' : '−'}${fmt(Math.abs(n))}`, color: 'purple' }];
      const variable = index === 0 ? 'x²' : 'x';
      if (Number.isInteger(n) && Math.abs(n) <= 4) return Array.from({ length: Math.abs(n) }, () => ({ label: `${n < 0 ? '−' : ''}${variable}`, color: index === 0 ? 'cyan' : model.left[0] ? 'green' : 'cyan' }));
      return [{ label: `${fmt(n)}${variable}`, color: index === 1 && model.left[0] ? 'green' : 'cyan' }];
    });
    const width = Math.min(53, 225 / Math.max(1, entries.length));
    return <g>{entries.map((entry, i) => {
      const tx = x + (i - entries.length / 2) * width + 2;
      return <g key={i} className="eq-scale-tile"><rect x={tx + 3} y="140" width={width - 6} height="51" rx="8" fill="#0a427b" opacity=".2" /><rect x={tx} y="136" width={width - 6} height="51" rx="8" fill={gradient(entry.color)} stroke="#ffffff" strokeOpacity=".7" /><path d={`M${tx + 7} 141h${width - 20}`} stroke="#fff" strokeOpacity=".65" strokeLinecap="round" />{showValues && <text x={tx + (width - 6) / 2} y="168" textAnchor="middle" fill="white" fontSize={width < 36 ? 14 : 22} fontWeight="800">{entry.label}</text>}</g>;
    })}{entries.length === 0 && <g><rect x={x - 90} y="136" width="180" height="51" rx="8" fill="#ffffff" fillOpacity=".5" stroke="#88baff" strokeDasharray="5 4" /><text x={x} y="157" textAnchor="middle" fill="#5c87b4" fontSize="12">Nothing here yet</text><text x={x} y="174" textAnchor="middle" fill="#5c87b4" fontSize="11">value is zero</text></g>}</g>;
  };
  const leftLabel = model.absolute ? equationText(model).split(' = ')[0] : polynomialText(model.left);
  return <svg className="eq-balance-art" viewBox="0 0 650 285" role="img" aria-label={`Balance model: ${equationText(model)}${none ? ', no real solution' : ''}`}>
    <defs>
      <linearGradient id={`${id}-cyan`} x1="0" y1="0" x2=".3" y2="1"><stop stopColor="#51e6ff" /><stop offset=".45" stopColor="#00b7f6" /><stop offset="1" stopColor="#0069b6" /></linearGradient>
      <linearGradient id={`${id}-purple`} x1="0" y1="0" x2=".25" y2="1"><stop stopColor="#e7a3ff" /><stop offset=".45" stopColor="#b34eff" /><stop offset="1" stopColor="#6b19ce" /></linearGradient>
      <linearGradient id={`${id}-green`} x1="0" y1="0" x2=".2" y2="1"><stop stopColor="#b0ffc7" /><stop offset=".4" stopColor="#39d764" /><stop offset="1" stopColor="#009b5b" /></linearGradient>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ceddff" /><stop offset=".4" stopColor="#7d9dc6" /><stop offset=".65" stopColor="#416892" /><stop offset="1" stopColor="#234c80" /></linearGradient>
      <linearGradient id={`${id}-post`}><stop stopColor="#164c90" /><stop offset=".43" stopColor="#b9e9ff" /><stop offset=".57" stopColor="#17d6ef" /><stop offset="1" stopColor="#1e5b97" /></linearGradient>
      <radialGradient id={`${id}-haze`}><stop stopColor="#7ddcff" stopOpacity=".6" /><stop offset="1" stopColor="#bfeaff" stopOpacity="0" /></radialGradient>
      <filter id={`${id}-glow`}><feGaussianBlur stdDeviation="8" /></filter>
    </defs>
    <ellipse cx="325" cy="203" rx="318" ry="103" fill={gradient('haze')} />
    <g fill="white" opacity=".55"><circle cx="106" cy="112" r="30" /><circle cx="78" cy="126" r="23" /><circle cx="130" cy="133" r="34" /><circle cx="547" cy="105" r="29" /><circle cx="575" cy="126" r="30" /></g>
    <ellipse cx="325" cy="233" rx="275" ry="12" fill="#398ec4" opacity=".2" filter={gradient('glow')} />
    <path d="M70 197H580" stroke={gradient('metal')} strokeWidth="10" strokeLinecap="round" />
    <path d="M324 101V131" stroke="#41668f" strokeWidth="6" /><circle cx="325" cy="94" r="19" fill="white" stroke={gradient('metal')} strokeWidth="5" /><circle cx="325" cy="94" r="10" fill={none ? '#ff4480' : '#00d46e'} opacity=".2" /><circle cx="325" cy="94" r="7" fill={none ? '#ff4480' : '#00ce61'} />
    <path d="M306 139L290 224Q325 234 359 224L344 139Z" fill={gradient('post')} /><path d="M325 151L319 213H331Z" fill="#00f9ff" opacity=".5" filter={gradient('glow')} /><rect x="292" y="126" width="66" height="11" rx="3" fill={gradient('metal')} />
    <g className={none ? 'eq-scale-pans is-impossible' : 'eq-scale-pans'}>
      <text x="174" y="115" textAnchor="middle" fill="#091758" fontSize="22" fontWeight="800">{showValues ? leftLabel : 'Left side'}</text><text x="478" y="115" textAnchor="middle" fill="#091758" fontSize="22" fontWeight="800">{showValues ? `${inequality ? model.relation.replace('<=', '≤').replace('>=', '≥') + ' ' : ''}${polynomialText(model.right)}` : 'Right side'}</text>
      {tiles(model.left, 174)}{tiles(model.right, 478)}{model.absolute && <g stroke="#09265b" strokeWidth="3" strokeLinecap="round"><path d="M49 132V187M294 132V187" /></g>}
      <rect x="36" y="190" width="265" height="11" rx="4" fill={gradient('metal')} /><rect x="350" y="190" width="264" height="11" rx="4" fill={gradient('metal')} /><path d="M40 191H296M354 191H610" stroke="white" strokeOpacity=".55" />
    </g>
    <g><rect x="228" y="229" width="194" height="35" rx="18" fill={none ? '#ffe0eb' : '#dffff0'} stroke="white" strokeWidth="2" /><text x="325" y="252" textAnchor="middle" fill={none ? '#e80048' : '#008d3c'} fontSize="14" fontWeight="800">{none ? 'No real solution' : inequality ? 'Order preserved ✓' : 'Equivalent equation ✓'}</text></g>
    {model.absolute && <g><rect x="91" y="52" width="160" height="29" rx="14" fill="#e7faff" stroke="#bae8ff" /><text x="171" y="71" textAnchor="middle" fill="#1269dd" fontSize="13" fontWeight="700">Absolute value ≥ 0</text></g>}
  </svg>;
}

function QuadraticPlot({ model }: { model: EquationModel }) {
  const p = model.left.map((v, i) => v - model.right[i]) as Polynomial;
  const solution = equationSolution(model);
  const center = p[0] ? -p[1] / (2 * p[0]) : 0;
  const extent = Math.max(2, ...solution.roots.map(x => Math.abs(x - center) + .8));
  const low = center - extent, high = center + extent;
  const samples = Array.from({ length: 100 }, (_, i) => { const x = low + i / 99 * (high - low); return { x, y: p[0] * x * x + p[1] * x + p[2] }; });
  const ymin = Math.min(-1, ...samples.map(v => v.y)), ymax = Math.max(1, ...samples.map(v => v.y));
  const px = (x: number) => 18 + (x - low) / (high - low) * 204;
  const py = (y: number) => 142 - (y - ymin) / (ymax - ymin) * 116;
  return <aside className="eq-mini-graph"><b><Activity size={19} />Graph view</b><svg viewBox="0 0 240 170" role="img" aria-label="Quadratic graph and real roots"><path d={`M12 ${py(0)}H232M${px(center)} 14V151`} stroke="#92a5cd" /><path d={samples.map((v, i) => `${i ? 'L' : 'M'}${px(v.x)},${py(v.y)}`).join(' ')} stroke="#8060fa" strokeWidth="2.5" fill="none" />{solution.roots.map((x, i) => <g key={i}><circle cx={px(x)} cy={py(0)} r="5" fill="white" stroke={i ? '#913cff' : '#ff4086'} strokeWidth="2" /><text x={px(x)} y={py(0) + (i ? 36 : 23)} textAnchor="middle" fontSize="11" fill={i ? '#913cff' : '#ef397c'}>{fmt(x)}</text></g>)}</svg><p>{solution.none ? 'The curve does not cross the x-axis.' : 'The roots are where the curve crosses the x-axis.'}</p></aside>;
}

export default function EquationsLab() {
  const [rawMode, setMode] = useStudioMode('mode', equationModes, 'Linear');
  const mode = rawMode as EquationMode;
  const history = useAlgebraHistory(Object.fromEntries(equationModes.map(m => [m, fresh(m)])) as Record<EquationMode, ReturnType<typeof fresh>>, 'equations-reference-dashboard-v1');
  const state = history.state[mode];
  const { model, original, frames, cursor, draft, showValues, autoBalance, notice, operand, goal, method } = state;
  const shown = frames[cursor]?.model ?? model;
  const shownSolution = equationSolution(shown);
  const update = (patch: Partial<typeof state>) => history.commit({ ...history.state, [mode]: { ...state, ...patch } });
  const restart = (next: EquationModel, challenge = false) => update({ ...fresh(mode), model: next, original: next, draft: equationText(next), challenge, frames: [{ model: next, caption: 'Start' }] });
  const commit = (next: EquationModel, caption: string, warning = false) => {
    const nextFrames = [...frames.slice(0, cursor + 1), { model: next, caption, warning }];
    update({ model: next, frames: nextFrames, cursor: nextFrames.length - 1, notice: caption, checked: false });
  };
  const operate = (operation: Operation) => {
    const result = transformEquation(shown, operation, operand, autoBalance);
    if (!result.ok) { update({ notice: result.error }); return; }
    commit(result.model, `${operation} (${operand}) ${autoBalance ? 'on both sides' : 'on the left only'}${result.flipped ? ' · inequality direction flipped' : ''}`, !autoBalance);
  };
  const edit = (side: 'left' | 'right', index: number, value: number) => {
    if (!Number.isFinite(value)) return;
    const next = { ...shown, [side]: shown[side].map((n, i) => i === index ? value : n) as Polynomial, scale: 1, offset: 0 };
    restart(next, state.challenge);
  };
  const solve = () => {
    const pending = draft.trim() !== equationText(original);
    const parsed = pending ? parseEquation(draft, mode) : undefined;
    if (parsed && !parsed.ok) { update({ notice: parsed.error }); return; }
    const source = parsed?.ok ? parsed.model : shown;
    const loaded = pending ? { original: source, draft: equationText(source), challenge: false, checked: false } : {};
    if (goal !== 'Solve for x') {
      const result = transformEquation(source, 'Subtract', goal === 'Move x terms left' ? `${source.right[1]}x` : String(source.left[2]));
      if (result.ok) {
        const caption = goal === 'Move x terms left' ? 'Subtract the right x term from both sides.' : 'Subtract the left constant from both sides.';
        const nextFrames = [...(pending ? [{ model: source, caption: 'Start' }] : frames.slice(0, cursor + 1)), { model: result.model, caption }];
        update({ ...loaded, model: result.model, frames: nextFrames, cursor: nextFrames.length - 1, notice: caption, checked: false });
      } else update({ notice: result.error });
      return;
    }
    const plan: Frame[] = [{ model: source, caption: 'Start', warning: !pending && frames.slice(0, cursor + 1).some(frame => frame.warning) }];
    let current = source;
    const add = (next: EquationModel, caption: string) => { current = next; plan.push({ model: next, caption }); };
    if (mode === 'Linear' || mode === 'Inequalities') {
      if (current.right[1]) { const r = transformEquation(current, 'Subtract', `${current.right[1]}x`); if (r.ok) add(r.model, 'Subtract the right x term from both sides.'); }
      if (current.left[2]) { const r = transformEquation(current, 'Subtract', String(current.left[2])); if (r.ok) add(r.model, 'Subtract the left constant from both sides.'); }
      if (current.left[1] && current.left[1] !== 1) { const r = transformEquation(current, 'Divide', String(current.left[1])); if (r.ok) add(r.model, `Divide both sides by ${fmt(current.left[1])}.${r.flipped ? ' Reverse the inequality direction.' : ''}`); }
      plan.push({ model: current, caption: `Solution: ${equationSolution(current).text}` });
    } else if (mode === 'Absolute Value') {
      const target = (source.right[2] - source.offset) / source.scale;
      const solution = equationSolution(source);
      if (target < 0) plan.push({ model: current, caption: 'An absolute value cannot be negative. There is no real solution.' });
      else if (solution.all || solution.none) plan.push({ model: current, caption: `Solution: ${solution.text}. The expression is constant.` });
      else { plan.push({ model: current, caption: `Split into ${polynomialText(source.left)} = ${fmt(target)} or ${polynomialText(source.left)} = ${fmt(-target)}.` }); plan.push({ model: current, caption: `Solve each branch: ${solution.text}. Check both in the original equation.` }); }
    } else {
      const p = source.left.map((v, i) => v - source.right[i]) as Polynomial;
      const factor = factorIntegerQuadratic(p[0], p[1], p[2]);
      add({ ...source, left: p, right: [0, 0, 0] }, `Move all terms left: ${polynomialText(p)} = 0.`);
      plan.push({ model: current, caption: method === 'Completing the square' ? completeSquareText(...p) : method === 'Factoring' && factor ? `(${polynomialText([0, ...factor.left])})(${polynomialText([0, ...factor.right])}) = 0. Set each factor to zero.` : `Discriminant D = b² − 4ac = ${fmt(p[1] ** 2 - 4 * p[0] * p[2])}. ${p[0] ? 'Use x = (−b ± √D) / 2a.' : 'The x² coefficient is zero; solve the linear equation.'}` });
      plan.push({ model: current, caption: `Solution: ${equationSolution(source).text || 'No real solution'}.` });
    }
    update({ ...loaded, model: current, frames: plan, cursor: Math.min(1, plan.length - 1), notice: 'First solving step shown. Use Next step to continue or Show all to finish.', checked: false });
  };
  const newEquation = (challenge = false) => {
    const next = initialEquation(mode);
    const root = Math.floor(Math.random() * 9) - 4;
    next.left[1] = 1 + Math.floor(Math.random() * 4); next.left[2] = Math.floor(Math.random() * 9) - 4;
    if (mode === 'Quadratic') { const other = root + 1 + Math.floor(Math.random() * 3); next.left = [1, -(root + other), root * other]; }
    else next.right[2] = mode === 'Absolute Value' ? 1 + Math.floor(Math.random() * 8) : next.left[1] * root + next.left[2] - next.right[1] * root;
    restart(next, challenge);
  };
  const field = (label: string, side: 'left' | 'right', index: number) => <label className="eq-field">{label}<input type="number" step="any" value={shown[side][index]} onChange={e => { if (e.target.value !== '') edit(side, index, Number(e.target.value)); }} /></label>;
  const keyIdea = mode === 'Absolute Value' ? 'An absolute value is always greater than or equal to 0. A negative isolated right side gives no real solution.' : mode === 'Inequalities' ? 'Multiplying or dividing by a negative number reverses the inequality direction.' : 'Whatever you do to one side, do the same to the other side to preserve the solution set.';
  const changed = frames.slice(0, cursor + 1).some(frame => frame.warning);
  const roots = shownSolution.roots;
  const radius = Math.max(4, ...roots.filter(Number.isFinite).map(v => Math.ceil(Math.abs(v)) + 2));
  const tickStep = Math.max(1, Math.ceil(radius / 6));
  const ticks = Array.from({ length: Math.floor(2 * radius / tickStep) + 1 }, (_, i) => -radius + i * tickStep);
  const percent = (x: number) => 6 + (x + radius) / (radius * 2) * 88;
  const interval = shownSolution.boundary !== undefined ? shownSolution.relation.includes('>') ? `${shownSolution.relation.includes('=') ? '[' : '('}${fmt(shownSolution.boundary)}, ∞)` : `(−∞, ${fmt(shownSolution.boundary)}${shownSolution.relation.includes('=') ? ']' : ')'}` : shownSolution.all ? '(−∞, ∞)' : shownSolution.none ? 'No real solution' : roots.map(v => fmt(v)).join('; ');
  const originalSolution = equationSolution(original);
  const challengeOk = challengeMatches(state.answer, original);
  return <div className="equations-dashboard" data-lab-pane="workspace" data-mode-canvas={mode}>
    <header className="eq-heading"><span className="eq-heading-icon"><Calculator /></span><div><h1>Equations &amp; Inequalities Lab</h1><p>Solve equations and inequalities using the balance model. Explore operations, preserve equality, and check solutions.</p></div><span className="eq-growth"><Sparkles />Math grows<br />brighter here.</span></header>
    <nav className="eq-mode-tabs" aria-label="Lab modes">{equationModes.map((item, i) => <button key={item} type="button" aria-pressed={item === mode} onClick={() => setMode(item)}><span aria-hidden="true">{['↗', '∪', '|·|', '≤'][i]}</span>{item}</button>)}</nav>
    <div className="eq-dashboard-grid">
      <section className="eq-panel eq-setup" id="algebra-lab-main"><h2><Pencil />{mode === 'Inequalities' ? 'Inequality' : 'Equation'} Setup</h2><p className="eq-original">Original: <span>{equationText(original)}</span></p><p className="eq-original">Current: <span>{equationText(shown)}</span></p><span className={`eq-state-pill ${shownSolution.none ? 'is-error' : ''}`}>{shownSolution.none ? <X /> : <Check />}{shownSolution.none ? 'No real solution' : shownSolution.all ? 'All real values' : mode === 'Linear' ? 'One solution' : 'Same solution set'}</span>
        <label className="eq-field">{mode === 'Inequalities' ? 'Inequality' : 'Equation'}<span className="eq-draft-row"><input value={draft} onChange={e => update({ draft: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') { const r = parseEquation(draft, mode); if (r.ok) restart(r.model); else update({ notice: r.error }); } }} /><button type="button" aria-label="Load equation" onClick={() => { const r = parseEquation(draft, mode); if (r.ok) restart(r.model); else update({ notice: r.error }); }}><Play fill="currentColor" /></button></span></label>
        <label className="eq-field">Goal<select value={goal} onChange={e => update({ goal: e.target.value })}><option>Solve for x</option>{!model.absolute && mode !== 'Quadratic' && <><option>Move x terms left</option><option>Move constants right</option></>}</select></label>
        <div className={`eq-coefficients ${mode === 'Quadratic' ? 'eq-three' : ''}`}>{mode === 'Quadratic' ? <>{field('a (x² coeff)', 'left', 0)}{field('b (x coeff)', 'left', 1)}{field('c (constant)', 'left', 2)}</> : <>{field(mode === 'Absolute Value' ? 'Inside x coeff' : mode === 'Linear' ? 'Left x coeff' : 'x coefficient', 'left', 1)}{field(mode === 'Absolute Value' ? 'Inside constant' : mode === 'Linear' ? 'Left constant' : 'Constant', 'left', 2)}{mode === 'Linear' && field('Right x coeff', 'right', 1)}{mode === 'Inequalities' && <label className="eq-field">Relation<select value={shown.relation} onChange={e => restart({ ...shown, relation: e.target.value as Relation })}>{(['<', '<=', '>', '>='] as const).map(r => <option key={r} value={r}>{r.replace('<=', '≤').replace('>=', '≥')}</option>)}</select></label>}{field(mode === 'Linear' ? 'Right constant' : 'Right side', 'right', 2)}</>}</div>
        {mode === 'Quadratic' && <label className="eq-field">Method<select value={method} onChange={e => update({ method: e.target.value })}><option>Quadratic formula</option><option>Factoring</option><option>Completing the square</option></select></label>}
        <button type="button" className="eq-primary eq-solve" onClick={solve}><Play size={14} />Solve step by step</button>
      </section>
      <section className="eq-panel eq-balance"><div className="eq-panel-heading"><h2><Settings2 />Balance Model<button className="eq-info" aria-label="Balance help" aria-expanded={state.info} onClick={() => update({ info: !state.info })}><CircleHelp /></button></h2><div><label className="eq-toggle">Show values<input type="checkbox" checked={showValues} onChange={e => update({ showValues: e.target.checked })} /></label><button type="button" className="eq-reset" onClick={() => restart(original)}><RotateCcw />Reset</button></div></div><div className={`eq-balance-content ${mode === 'Quadratic' ? 'with-graph' : ''}`}><BalanceScene model={shown} showValues={showValues} none={shownSolution.none} inequality={mode === 'Inequalities'} />{mode === 'Quadratic' && <QuadraticPlot model={shown} />}</div><p className={`eq-balance-caption ${mode === 'Inequalities' ? 'is-yellow' : ''}`}>{state.info ? 'The scale is a symbolic model. At a solution, both sides satisfy the equation. Matching reversible operations keep the same solutions.' : mode === 'Absolute Value' && shownSolution.none ? (shown.right[2] - shown.offset) / shown.scale < 0 ? 'The absolute-value expression cannot equal a negative number. There is no real solution.' : 'The constant absolute-value expression does not match the right side.' : mode === 'Inequalities' ? 'Multiplying 2 > 1 by −1 yields −2 < −1 — the inequality flips.' : 'Apply the same reversible operation to both sides to preserve the solution set.'}</p></section>
      <section className="eq-panel eq-steps"><h2><Settings2 />Steps <small>{cursor + 1} / {frames.length}</small></h2><div className="eq-step-current"><span>{cursor + 1}</span><div><h3>{frames[cursor]?.caption || 'Start'}</h3><p>{equationText(shown)}</p></div></div><div className={`eq-feedback ${changed || shownSolution.none ? 'is-warning' : ''}`}><CheckCircle2 /><b>{shownSolution.none ? 'No real solution.' : changed ? 'One-sided operation: solution set may change.' : `Same operation applied to both sides. ${mode === 'Inequalities' ? 'Inequality direction tracked' : 'Equality preserved'} ✓`}</b></div><div className="eq-key-idea"><Lightbulb /><p>{keyIdea}</p></div>{frames.length > 1 && <div className="eq-step-controls"><button aria-label="Previous step" disabled={!cursor} onClick={() => update({ cursor: cursor - 1 })}><ChevronLeft /></button><button disabled={cursor === frames.length - 1} onClick={() => update({ cursor: cursor + 1 })}>Next step<ChevronRight /></button><button disabled={cursor === frames.length - 1} onClick={() => update({ cursor: frames.length - 1 })}>Show all</button></div>}{cursor === frames.length - 1 && frames.length > 1 && <details className="eq-step-summary"><summary>Review all steps</summary><ol>{frames.map((frame, i) => <li key={i}><b>{frame.caption}</b><p>{equationText(frame.model)}</p></li>)}</ol></details>}</section>
      <section className="eq-panel eq-operations"><h2><Settings2 />Operations <small>Apply the same operation to both sides.</small></h2><div className="eq-operation-row"><div className="eq-operation-buttons">{([[ 'Add', Plus ], ['Subtract', Minus], ['Multiply', X], ['Divide', Divide]] as const).map(([op, Icon]) => <button key={op} type="button" className={`eq-op eq-op-${op.toLowerCase()}`} onClick={() => operate(op)}><Icon />{op}</button>)}<button type="button" disabled={!history.canUndo} onClick={history.undo}><Undo2 />Undo</button></div><label className="eq-operand">Apply {autoBalance ? 'to both sides' : 'to left side'}:<input aria-label="Operand" value={operand} onChange={e => update({ operand: e.target.value })} /></label><label className="eq-toggle">Auto-balance<input type="checkbox" checked={autoBalance} onChange={e => update({ autoBalance: e.target.checked, notice: e.target.checked ? 'Both sides will receive the same operation.' : 'Explore a one-sided operation. This can change the solution set.' })} /></label></div>{notice && <p className="eq-notice" role="status">{notice}</p>}</section>
      <div className="eq-results">
      <section className="eq-panel eq-number-line"><h2><Target />Solution on Number Line</h2><svg viewBox="0 0 900 95" role="img" aria-label={`Number line: ${shownSolution.text}`}><path d="M38 37H862M38 37l8 -5v10ZM862 37l-8 -5v10Z" fill="#607eaf" stroke="#607eaf" strokeWidth="2" />{ticks.map((n, i) => <g key={i}><path d={`M${percent(n) * 9} 37v8`} stroke="#8c9dc6" /><text x={percent(n) * 9} y="65" textAnchor="middle" fontSize="11" fill="#607eaf">{fmt(n)}</text></g>)}{shownSolution.all && <path d="M40 37H860" stroke="#00ce67" strokeWidth="4" />}{shownSolution.boundary !== undefined && <path d={`M${percent(shownSolution.boundary) * 9} 37H${shownSolution.relation.includes('>') ? 862 : 38}`} stroke="#00d775" strokeWidth="4" />}{roots.map((x, i) => <g key={i}><circle cx={percent(x) * 9} cy="37" r="8" fill={shownSolution.boundary !== undefined && !shownSolution.relation.includes('=') ? 'white' : i ? '#a344ff' : '#00cc68'} stroke={i ? '#a344ff' : '#00cc68'} strokeWidth="2.5" /><text x={percent(x) * 9} y="90" textAnchor="middle" fontSize="14" fontWeight="700" fill={i ? '#a344ff' : '#009a53'}>{fmt(x)}</text></g>)}</svg><div className="eq-interval"><span>Solution {shownSolution.boundary !== undefined ? '(interval notation)' : '(exact values)'}</span><output>{interval}</output><span className="eq-line-legend"><i />Included <i className="is-open" />Not included</span></div></section>
      <section className="eq-panel eq-validation"><h2><CheckCircle2 />Solution &amp; Validation</h2><p>Candidate <strong>{shownSolution.text || 'No real solution'}</strong></p>{changed && <p className="eq-original-solution">Original solution set: {originalSolution.text}</p>}{mode === 'Quadratic' && shownSolution.discriminant !== undefined && <div className="eq-discriminant"><b>Discriminant</b><p>D = b² − 4ac = {fmt(shownSolution.discriminant)}</p><span>{shownSolution.discriminant > 0 ? 'Two real roots' : shownSolution.discriminant === 0 ? 'One repeated real root' : 'No real roots · complex solutions'}</span><p>x = (−b ± √D) / 2a</p></div>}{shownSolution.none ? <div className="eq-validation-note is-error"><X /><div><b>No real solution</b><p>{mode === 'Absolute Value' ? 'An absolute value is nonnegative. Check the isolated absolute-value right side.' : mode === 'Quadratic' ? 'There are no intersections with the real number line.' : 'The constant statement is false.'}</p></div></div> : shownSolution.all ? <div className="eq-validation-note"><Check /><p>Every real x satisfies this statement.</p></div> : shownSolution.boundary !== undefined ? <div className="eq-validation-note"><Check /><p>{keyIdea}<br />Boundary {shownSolution.relation.includes('=') ? 'included' : 'excluded'} at x = {fmt(shownSolution.boundary)}.</p></div> : roots.map((x, i) => { const [l, r] = evaluateSides(original, x); const valid = Math.abs(l - r) < 1e-7; return <div key={i} className={`eq-validation-note ${valid ? '' : 'is-error'}`}><Check /><div><b>Check x = {fmt(x)} in the original</b><p>{fmt(l)} {valid ? '=' : '≠'} {fmt(r)} · {valid ? 'Valid solution ✓' : 'Original equation not satisfied'}</p></div></div>; })}</section>
      </div>
    </div>
    <section className="eq-learning-loop" aria-label="Learning loop"><button className="eq-learn observe" onClick={() => update({ info: true })}><Eye /><span><b>Observe</b><small>Watch both sides change together with every operation.</small></span></button><button className="eq-learn understand" onClick={() => update({ notice: keyIdea })}><Lightbulb /><span><b>Understand</b><small>{mode === 'Absolute Value' ? 'An absolute value is always greater than or equal to 0.' : 'Operations on one side must also be applied to the other.'}</small></span></button><button className="eq-learn why" onClick={() => update({ notice: keyIdea })}><CircleHelp /><span><b>Why</b><small>{keyIdea}</small></span></button><div className="eq-learn try"><Pencil /><span><b>Try</b><small>Create your own equation and solve it step by step.</small><button onClick={() => newEquation()}>New {mode === 'Inequalities' ? 'Inequality' : 'Equation'}<ArrowRight /></button></span></div><div className="eq-learn challenge"><Trophy /><span><b>Challenge</b><small>{state.challenge ? equationText(original) : `Explore a new ${mode.toLowerCase()} problem.`}</small><button onClick={() => newEquation(true)}>Challenge Me</button></span></div></section>
    {state.challenge && <section className="eq-panel eq-challenge-form"><h2><Trophy />Your challenge</h2><p>{originalSolution.boundary !== undefined ? 'Enter the solution inequality (for example x > 2).' : 'Enter a real solution, or describe the solution set.'}</p><label className="eq-field">Your answer<input value={state.answer} onChange={e => update({ answer: e.target.value, checked: false })} /></label><button className="eq-primary" onClick={() => update({ checked: true })}>Check answer</button>{state.checked && <p role="status">{challengeOk ? 'Correct! You’ve got it.' : 'Try again. Use the guided steps and check the original.'}</p>}</section>}
    <div className="sr-only" aria-live="polite">{shownSolution.text}. {notice}</div>
  </div>;
}
