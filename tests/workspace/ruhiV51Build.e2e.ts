import {test,expect} from '@playwright/test';
test('production mathematical workers preserve exact values and verification labels',async({page})=>{
 await page.goto('/workspace/geometry');await page.getByRole('button',{name:'Ask Math · Offline'}).click();await expect(page.locator('.robo-learning-status')).toContainText('TensorFlow.js ready',{timeout:30000});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(String(e)));
 async function ask(prompt:string,answer:string){await page.getByLabel('What would you like to create or solve?').fill(prompt);await page.getByRole('button',{name:'Run request',exact:true}).evaluate(b=>(b as HTMLButtonElement).click());await expect(page.locator('.robo-answer > p[role="status"]')).toHaveText(answer,{timeout:30000});}
 await ask('1/3+1/6','1/2');await ask('Exact sqrt(8)','2*sqrt(2)');await ask('sin(pi/6)','1/2');await ask('Solve sqrt(x+5)=x-1','x ∈ {4}');
 await expect(page.locator('.robo-panel-content small').filter({hasText:'verified with assumptions'})).toHaveCount(1);
 await ask('Numerically integrate x^2 from 0 to 3','≈ 9');await expect(page.locator('.robo-panel-content small').filter({hasText:'verified numerical'})).toHaveCount(1);
 await page.locator('.robo-verification-details summary').click();await expect(page.locator('.robo-verification-details')).toContainText('Estimated absolute quadrature error');await expect(page.locator('.robo-verification-details')).toContainText('tolerance');
 await page.getByLabel('What would you like to create or solve?').fill('Solve 2x + 5 = 17');await page.getByRole('button',{name:'Run request',exact:true}).evaluate(b=>(b as HTMLButtonElement).click());await expect(page.locator('.robo-answer > p[role="status"]')).toContainText('6',{timeout:30000});
 await ask('Mean of 1,2,3','2');
 expect(errors).toEqual([]);
});
