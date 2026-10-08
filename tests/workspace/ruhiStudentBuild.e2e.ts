import {test,expect} from '@playwright/test';
test.use({video:'off',screenshot:'off',trace:'off'});
test('student build excludes training and only queues correction suggestions',async({page})=>{
 test.setTimeout(60000);await page.goto('/workspace/geometry');await page.getByRole('button',{name:'Ask Math · Offline'}).click();await expect(page.locator('.robo-learning-status')).toContainText('TensorFlow.js ready',{timeout:30000});
 await expect(page.getByText('Developer inspector',{exact:true})).toHaveCount(0);await expect(page.getByText('Model info',{exact:true})).toHaveCount(0);await expect(page.locator('a[href="/model-training"]')).toHaveCount(0);
 await page.locator('summary').filter({hasText:'Suggest a correction'}).click();await page.getByLabel('Your phrase',{exact:true}).fill('My custom round outline');await page.getByLabel('What it should mean',{exact:true}).fill('Create circle radius 5');await page.getByRole('button',{name:/Queue suggestion/i}).click();await expect(page.locator('.robo-learning-status')).toContainText('queued for admin review');
 const queue=await page.evaluate(()=>JSON.parse(localStorage.getItem('ruhi-correction-candidates-v4.1')??'[]'));expect(queue).toHaveLength(1);expect(queue[0].approved).toBe(false);expect(await page.evaluate(()=>localStorage.getItem('math-robo-semantic-corrections-v4'))).toBeNull();
 await page.goto('/model-training');await expect(page.getByRole('heading',{name:'Ruhi Intelligence v4.1',exact:true,level:1})).toHaveCount(0);
});
