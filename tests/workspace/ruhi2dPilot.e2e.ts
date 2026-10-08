import {test,expect} from '@playwright/test';
test('student build keeps offline angle execution and distinct native style rendering',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(String(error)));
 await page.route('**/*',route=>/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::|\/)/.test(route.request().url())?route.continue():route.abort());
 await page.goto('/workspace/graph');await page.getByRole('button',{name:'Ask Math · Offline'}).click();await expect(page.locator('.robo-learning-status')).toContainText('TensorFlow.js ready',{timeout:30000});
 const ask=async(text:string)=>{await page.getByLabel('What would you like to create or solve?').fill(text);await page.getByRole('button',{name:'Run request',exact:true}).evaluate(button=>(button as HTMLButtonElement).click());await expect(page.getByRole('button',{name:'Run request',exact:true})).toBeEnabled();return page.locator('.robo-answer > p[role="status"]').innerText();};
 await ask('Delete all objects');for(const text of ['Draw an angle of 50 degrees','Make it 84','Increase it two more degrees'])await ask(text);expect(await ask('Decrease it by 10 percent')).toContain('77.4');await expect(page.locator('[data-ruhi-angle]')).toHaveCount(1);
 await ask('Delete all objects');await ask('Draw rectangle 4 by 6');await ask('Change its interior to orange');await expect(page.locator('[data-ruhi-fill]')).toHaveAttribute('fill','#f97316');await ask('Change its outline to teal');await expect(page.locator('[data-ruhi-fill]')).toHaveAttribute('fill','#f97316');expect(errors).toEqual([]);
 await page.goto('/model-training');await expect(page.getByRole('tab',{name:'2D NLP Audit'})).toHaveCount(0);await expect(page.getByRole('button',{name:'Train v4 model'})).toHaveCount(0);
});
