import fs from 'node:fs';
import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();const results=[];
for(const [route,modes] of [['interactive-distributions',['Normal','Binomial','Poisson','Exponential','t','Chi-square']],['experiments',['Coins','Dice','Cards','Spinner','Conditional','Bayes']],['hypothesis',['One Sample Mean','Two Sample Mean','Proportion','Chi-Square','Permutation Test']],['confidence-intervals',['Mean','Proportion','Two-sample','Bootstrap']],['correlation',['Linear Fit','Residuals','Prediction']],['anova',['Group Comparison','Variation Decomposition','Design Canvas','Diagnostics']],['data-explorer',['Overview','Pairwise']]]){
 await page.goto('http://127.0.0.1:4317/probability-statistics/'+route,{waitUntil:'domcontentloaded'});
 const record={route:'/probability-statistics/'+route,modes:[]};
 for(const mode of modes){const button=page.locator('nav.msk-tabs').getByRole('button',{name:mode,exact:true});await button.click();await expect(button).toHaveAttribute('aria-pressed','true');record.modes.push({mode,chart:await page.locator('.msk-canvas svg').getAttribute('aria-label'),live:await page.locator('.msk-live').innerText(),inputs:await page.locator('.msk-lab input').evaluateAll(es=>es.map(e=>e.outerHTML))});}
 results.push(record);
}
await browser.close();fs.writeFileSync('artifacts/studio-content-audit/statistics-mode-results.json',JSON.stringify(results,null,2));
