import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
const base = process.env.LOGIC_AUDIT_URL || 'http://127.0.0.1:5188';
const browser = await chromium.launch({headless:true,args:['--no-proxy-server']});
const page = await browser.newPage({serviceWorkers:'block',viewport:{width:1440,height:1000}});
page.setDefaultTimeout(30000);
const errors = [], checks = [], overflow = [];
page.on('pageerror',e=>errors.push(e.message));
try {
  await page.goto(`${base}/discrete-world/logic?mode=Circuit`,{waitUntil:'commit',timeout:30000});
  const workspace = page.locator('.logic-workspace');
  await workspace.waitFor({timeout:180000});
  const gate = page.getByRole('group',{name:'Gate',exact:true});
  const assignment = page.locator('.logic-assignments').first();
  const formulas = {AND:(p,q)=>p&&q,OR:(p,q)=>p||q,XOR:(p,q)=>p!==q,NAND:(p,q)=>!(p&&q),NOR:(p,q)=>!(p||q)};
  for (const [name, evaluate] of Object.entries(formulas)) {
    await gate.getByRole('button',{name,exact:true}).click();
    for (const p of [0,1]) for(const q of [0,1]) {
      await assignment.getByRole('button',{name:`P ${p} · Q ${q}`,exact:true}).click();
      await expect(workspace.getByLabel('Circuit output')).toHaveText(evaluate(!!p,!!q)?'1':'0');
    }
  }
  checks.push('all 20 gate/assignment combinations');
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  await workspace.getByRole('button',{name:'Gate AND, click to change',exact:true}).click();
  await expect(workspace.getByRole('button',{name:'Gate OR, click to change',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Undo',exact:true}).click();
  await expect(workspace.getByRole('button',{name:'Gate AND, click to change',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Redo',exact:true}).click();
  await expect(workspace.getByRole('button',{name:'Gate OR, click to change',exact:true})).toBeVisible();
  checks.push('clickable gate, undo, redo, reset');
  await page.getByRole('button',{name:'Truth Table',exact:true}).click();
  await workspace.getByRole('button',{name:'Use P 0 Q 1',exact:true}).click();
  await expect(workspace.locator('tr.is-hot')).toContainText('Explore 2');
  await page.getByRole('button',{name:'Next assignment →',exact:true}).click();
  await expect(workspace.locator('tr.is-hot')).toContainText('Explore 3');
  checks.push('truth-table row selection and next assignment');
  await page.getByRole('button',{name:'CNF/DNF',exact:true}).click();
  await gate.getByRole('button',{name:'XOR',exact:true}).click();
  await workspace.getByRole('button',{name:'(¬P ∧ Q)',exact:true}).click();
  await workspace.getByRole('button',{name:'(P ∧ ¬Q)',exact:true}).click();
  await expect(workspace.locator('p[role="status"]')).toContainText('Correct');
  await workspace.getByRole('button',{name:'(P ∧ Q)',exact:true}).click();
  await expect(workspace.locator('p[role="status"]')).toContainText('3/4');
  checks.push('DNF grading covers correct and incorrect expressions');
  await page.getByRole('button',{name:'Equivalence',exact:true}).click();
  await gate.getByRole('button',{name:'AND',exact:true}).click();
  await expect(workspace.locator('p[role="status"]')).toContainText('counterexamples');
  await workspace.getByRole('button',{name:'Test P 0, Q 1',exact:true}).click();
  await expect(workspace.locator('.msk-formula')).toContainText('AND: 0');
  await page.getByRole('group',{name:'Compare with',exact:true}).getByRole('button',{name:'AND',exact:true}).click();
  await expect(workspace.locator('p[role="status"]')).toContainText('Equivalent for all four');
  checks.push('equivalence and loaded counterexamples');
  await page.getByRole('button',{name:'SAT',exact:true}).click();
  await page.getByRole('button',{name:'Try a contradiction',exact:true}).click();
  await expect(workspace.locator('p[role="status"]')).toContainText('UNSAT');
  await expect(workspace.getByRole('button',{name:'Apply SAT witness',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Load satisfiable example',exact:true}).click();
  await workspace.getByRole('button',{name:'Apply SAT witness',exact:true}).click();
  await expect(workspace.locator('p[role="status"]')).toContainText('all clauses satisfied');
  await workspace.getByRole('button',{name:'+ Add clause',exact:true}).click();
  await expect(workspace.locator('p[role="status"]')).toContainText('UNSAT');
  await workspace.getByRole('button',{name:'Cycle P in clause 3',exact:true}).click();
  await expect(workspace.locator('p[role="status"]')).toContainText('SAT — a satisfying');
  await workspace.getByRole('button',{name:'Remove clause 3',exact:true}).click();
  checks.push('SAT edit, empty clause, contradiction, witness, remove clause');
  await page.getByRole('button',{name:'Try a contradiction',exact:true}).click();
  await page.getByRole('button',{name:'Share',exact:true}).click();
  await expect.poll(()=>new URL(page.url()).searchParams.has('fig')).toBe(true);
  await page.reload({waitUntil:'commit'});
  await workspace.waitFor({timeout:180000});
  await expect(workspace.locator('p[role="status"]')).toContainText('UNSAT');
  await page.getByRole('button',{name:'Reset',exact:true}).click();
  await page.getByRole('button',{name:'Circuit',exact:true}).click();
  await workspace.locator('.logic-inputs button').nth(1).focus();
  await page.keyboard.press('Space');
  await expect(workspace.getByLabel('Circuit output')).toHaveText('1');
  checks.push('shared figure reload preserves SAT clauses; keyboard input switch');
  for(const width of [390,768,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const mode of ['Circuit','Truth Table','Equivalence','CNF/DNF','SAT']) {
      await page.getByRole('button',{name:mode,exact:true}).click();
      const bounds = await workspace.evaluate(el=>({client:el.clientWidth,scroll:el.scrollWidth}));
      overflow.push({width,mode,...bounds});
      expect(bounds.scroll).toBeLessThanOrEqual(bounds.client);
    }
  }
  await page.setViewportSize({width:390,height:1000});
  await page.getByRole('button',{name:'Circuit',exact:true}).click();
  await workspace.screenshot({path:'artifacts/logic-interactive-mobile.png'});
  await page.setViewportSize({width:1440,height:1000});
  await workspace.screenshot({path:'artifacts/logic-interactive-desktop.png'});
  expect(errors).toEqual([]);
  await fs.mkdir('audit/logic-interactive',{recursive:true});
  await fs.writeFile('audit/logic-interactive/browser.json',JSON.stringify({status:'passed',base,checks,overflow,errors},null,2));
  console.log(JSON.stringify({status:'passed',checks,layouts:overflow.length,errors}));
} finally { await browser.close(); }
