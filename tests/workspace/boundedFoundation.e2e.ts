import {test,expect} from '@playwright/test';

for(const [route,request,evidence] of [
 ['/workspace/geometry',{operation:'geometry2d',args:['intersection',{kind:'line',a:[0,0],b:[2,0]},{kind:'line',a:[1,-1],b:[1,1]}]},'exact geometric invariant'],
 ['/workspace/3d',{operation:'geometry3d',args:['spherePlane',{center:[0,0,0],radius:2},{point:[0,0,1],normal:[0,0,1]}]},'numerical consistency'],
] as const)test(`local worker certificates reach the ${route} result display`,async({page})=>{
 test.setTimeout(60000);
 await page.goto(route);
 await page.getByRole('button',{name:'Ask Math · Offline',exact:true}).click();
 await page.getByRole('textbox',{name:'Ask Ruhi anything',exact:true}).fill(`Run kernel.compute with ${JSON.stringify([request])}`);
 await page.getByRole('button',{name:'Run request',exact:true}).click();
 const response=page.locator('.ruhi-message.ruhi-assistant').last();
 await expect(response).toContainText(`Evidence: ${evidence}`,{timeout:30000});
 await expect(response).toContainText('Checked: intersection');
 await expect(response).toContainText('Complete');
});

test('CAS worksheet displays independent completeness and replaces certificates after edits',async({page})=>{
 await page.goto('/workspace/data');
 const input=page.getByRole('textbox',{name:'CAS input 1',exact:true});
 await expect(input).toBeVisible({timeout:30000});
 await page.getByRole('combobox',{name:'Operation for calculation 1',exact:true}).selectOption('solve');
 await input.fill('(x^2-1)/(x-1)=0');
 const block=page.locator('.cas-notebook-block').filter({has:input});
 await expect(block.getByRole('status')).toContainText('Independently verified');
 await expect(block.getByRole('status')).toContainText('Complete solution set');
 await expect(block.locator('.cas-block-result strong').first()).toContainText('-1');
 await expect(block.locator('.cas-block-result')).toContainText('≠');
 await input.fill('x^2+1=0');
 await expect(block.getByRole('status')).toContainText('Independently verified');
 await expect(block.locator('.cas-block-result strong').first()).toContainText('{}');
 await input.fill('x^3=1');
 await expect(block.getByRole('status')).toHaveCount(0);
});
